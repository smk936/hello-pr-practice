/* ============================================================
   CENIT — theme.js
   Vanilla JS. No framework, no build step. Native Shopify APIs:
   /cart/add.js · /cart/change.js · /cart.js · Section Rendering API ·
   /search/suggest.json (predictive).
   ============================================================ */
(function () {
  "use strict";

  var routes = window.routes || {};
  var money = window.CENIT_money_format || "${{amount}}";

  /* ---------- tiny helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts); }

  function formatMoney(cents) {
    var value = (cents / 100).toLocaleString(document.documentElement.lang || "es", {
      minimumFractionDigits: (cents % 100 === 0) ? 0 : 2,
      maximumFractionDigits: 2
    });
    // Respect the shop money format's currency placement where simple.
    return money.replace(/\{\{\s*amount\s*\}\}/, value)
                .replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100).toLocaleString());
  }

  function fetchJSON(url, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ "Content-Type": "application/json", "Accept": "application/json" }, opts.headers || {});
    return fetch(url, opts).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) { throw data; }
        return data;
      });
    });
  }

  function toast(msg) {
    var t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("is-visible"); }, 2800);
  }

  function lockScroll(lock) {
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.overflow = lock ? "hidden" : "";
  }

  /* ============================================================
     GENERIC OVERLAY (drawer / modal) controller
     ============================================================ */
  var openOverlays = [];
  function openOverlay(el) {
    if (!el || el.classList.contains("is-open")) return;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    openOverlays.push(el);
    lockScroll(true);
    var focusable = el.querySelector("[autofocus], input, button, a");
    if (focusable) setTimeout(function () { focusable.focus(); }, 60);
  }
  function closeOverlay(el) {
    if (!el || !el.classList.contains("is-open")) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    openOverlays = openOverlays.filter(function (o) { return o !== el; });
    if (!openOverlays.length) lockScroll(false);
  }
  function closeTopOverlay() {
    if (openOverlays.length) closeOverlay(openOverlays[openOverlays.length - 1]);
  }
  // Delegated open/close triggers
  on(document, "click", function (e) {
    var opener = e.target.closest("[data-overlay-open]");
    if (opener) { var t = $(opener.getAttribute("data-overlay-open")); if (t) { e.preventDefault(); openOverlay(t); } return; }
    var closer = e.target.closest("[data-drawer-close], [data-overlay-close]");
    if (closer) { var ov = closer.closest(".drawer, .search-modal, .mobile-nav"); if (ov) { e.preventDefault(); closeOverlay(ov); } }
  });
  on(document, "keydown", function (e) { if (e.key === "Escape") closeTopOverlay(); });

  /* ============================================================
     CART
     ============================================================ */
  var CartDrawer = {
    el: null,
    sectionId: "cart-drawer",
    init: function () {
      this.el = $("[data-cart-drawer]");
      var self = this;
      // Any link to /cart opens drawer if drawer mode, unless modified click
      on(document, "click", function (e) {
        var trigger = e.target.closest("[data-cart-toggle]");
        if (trigger && self.el) { e.preventDefault(); openOverlay(self.el); }
      });
      // qty steppers + remove inside cart contexts (delegated)
      on(document, "click", function (e) {
        var up = e.target.closest("[data-qty-up]");
        var down = e.target.closest("[data-qty-down]");
        var rm = e.target.closest("[data-line-remove]");
        if (up || down) {
          var key = (up || down).getAttribute("data-line-key");
          var input = document.querySelector('[data-line-qty="' + CSS.escape(key) + '"]');
          if (!input) return;
          var q = parseInt(input.value, 10) || 0;
          q = up ? q + 1 : Math.max(0, q - 1);
          Cart.changeByKey(key, q);
        }
        if (rm) { Cart.changeByKey(rm.getAttribute("data-line-remove"), 0); }
      });
      on(document, "change", function (e) {
        var input = e.target.closest("[data-line-qty]");
        if (input) { Cart.changeByKey(input.getAttribute("data-line-qty"), Math.max(0, parseInt(input.value, 10) || 0)); }
      });
      // cart note
      on(document, "change", function (e) {
        var note = e.target.closest("[data-cart-note]");
        if (note) { fetch(routes.cart + "/update.js", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note: note.value }) }); }
      });
    },
    open: function () { if (this.el) openOverlay(this.el); }
  };

  var Cart = {
    _sectionsForContext: function () {
      // Always refresh the drawer; on the cart page also refresh main-cart.
      return (window.location.pathname.indexOf("/cart") === 0)
        ? CartDrawer.sectionId + ",main-cart"
        : CartDrawer.sectionId;
    },
    add: function (formData, btn) {
      var body = new FormData(formData);
      // request the drawer section back in the same round-trip; count is updated from /cart.js
      body.append("sections", CartDrawer.sectionId);
      body.append("sections_url", window.location.pathname);
      if (btn) { btn.classList.add("is-loading"); btn.setAttribute("aria-disabled", "true"); }
      return fetch(routes.cart_add, {
        method: "POST",
        headers: { "Accept": "application/javascript" },
        body: body
      }).then(function (r) {
        return r.json().then(function (data) { if (!r.ok) throw data; return data; });
      }).then(function (data) {
        Cart.refreshCount();
        if (CartDrawer.el) {
          Cart.renderSections(data.sections);
          CartDrawer.open();
        } else {
          // Cart "page" mode: no drawer — go to the cart page.
          window.location.href = routes.cart;
        }
        return data;
      }).catch(function (err) {
        toast((err && err.description) || "No se pudo añadir. Inténtalo de nuevo.");
        throw err;
      }).finally(function () {
        if (btn) { btn.classList.remove("is-loading"); btn.removeAttribute("aria-disabled"); }
      });
    },
    changeByKey: function (key, quantity) {
      var loading = $("#loading-bar"); if (loading) { loading.style.width = "60%"; loading.style.opacity = "1"; }
      return fetch(routes.cart_change, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/javascript" },
        body: JSON.stringify({ id: key, quantity: quantity, sections: Cart._sectionsForContext(), sections_url: window.location.pathname })
      }).then(function (r) { return r.json(); }).then(function (data) {
        Cart.renderSections(data.sections);
        Cart.refreshCountFromCart(data);
        if (window.location.pathname.indexOf("/cart") === 0 && data.item_count === 0) { window.location.reload(); }
      }).catch(function () { toast("No se pudo actualizar la bolsa."); })
        .finally(function () { if (loading) { loading.style.width = "100%"; setTimeout(function () { loading.style.opacity = "0"; loading.style.width = "0"; }, 300); } });
    },
    renderSections: function (sections) {
      if (!sections) return;
      Object.keys(sections).forEach(function (id) {
        var html = sections[id];
        if (!html) return;
        var doc = new DOMParser().parseFromString(html, "text/html");
        if (id === CartDrawer.sectionId) {
          var incoming = doc.querySelector("[data-cart-drawer] .drawer__panel") || doc.querySelector(".drawer__panel");
          var current = document.querySelector("[data-cart-drawer] .drawer__panel");
          if (incoming && current) current.innerHTML = incoming.innerHTML;
        } else if (id === "main-cart") {
          var inNode = doc.querySelector("[data-cart-root]");
          var curNode = document.querySelector("[data-cart-root]");
          if (inNode && curNode) curNode.innerHTML = inNode.innerHTML;
        } else if (id === "header-cart") {
          var inC = doc.querySelector("[data-cart-count]");
          var curC = document.querySelector(".header [data-cart-count]");
          if (inC && curC) curC.textContent = inC.textContent;
        }
      });
    },
    refreshCount: function () {
      fetchJSON(routes.cart + ".js").then(Cart.refreshCountFromCart);
    },
    refreshCountFromCart: function (cart) {
      if (!cart) return;
      $all("[data-cart-count]").forEach(function (n) {
        n.setAttribute("data-count", cart.item_count);
        // header bubble shows number; drawer title shows (n)
        if (n.closest(".header")) { n.textContent = cart.item_count; }
      });
    }
  };

  // PDP quantity stepper (adjusts sibling quantity input)
  on(document, "click", function (e) {
    var adj = e.target.closest("[data-qty-adjust]");
    if (!adj) return;
    var wrap = adj.closest(".qty");
    var input = wrap && wrap.querySelector('input[name="quantity"]');
    if (!input) return;
    var delta = parseInt(adj.getAttribute("data-qty-adjust"), 10) || 0;
    input.value = Math.max(1, (parseInt(input.value, 10) || 1) + delta);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // Add-to-cart form submit (delegated)
  on(document, "submit", function (e) {
    var form = e.target.closest("[data-product-form]");
    if (!form) return;
    e.preventDefault();
    Cart.add(form, form.querySelector('[type="submit"]'));
  });

  /* ============================================================
     PRODUCT: variant picker + gallery
     ============================================================ */
  function ProductForm(root) {
    var dataEl = $("[data-variant-json]", root);
    if (!dataEl) return;
    var variants = JSON.parse(dataEl.textContent);
    var form = $("[data-product-form]", root);
    var idInput = form ? $('[name="id"]', form) : null;
    var priceTarget = $("[data-price]", root);
    var addBtn = form ? $('[data-add-btn]', form) : null;
    var addText = addBtn ? $(".btn__swap", addBtn) : null;
    var mediaMap = {};
    $all("[data-media-id]", root).forEach(function (m) { mediaMap[m.getAttribute("data-media-id")] = m; });

    function currentSelections() {
      var opts = [];
      $all("[data-option-index]", root).forEach(function (group) {
        var idx = parseInt(group.getAttribute("data-option-index"), 10);
        var checked = group.querySelector("input:checked");
        var sel = group.querySelector("select");
        if (checked) opts[idx] = checked.value;
        else if (sel) opts[idx] = sel.value;
      });
      return opts;
    }

    function findVariant(sel) {
      return variants.find(function (v) {
        return v.options.every(function (o, i) { return o === sel[i]; });
      });
    }

    function updateAvailabilityUI(sel) {
      // Disable size/option inputs that would make an unavailable combo, per second option dimension.
      $all("[data-option-index]", root).forEach(function (group) {
        var idx = parseInt(group.getAttribute("data-option-index"), 10);
        $all("input", group).forEach(function (input) {
          var test = sel.slice(); test[idx] = input.value;
          var match = variants.find(function (v) { return v.options.every(function (o, i) { return test[i] == null || o === test[i]; }); });
          var available = variants.some(function (v) { return v.available && v.options[idx] === input.value && v.options.every(function (o, i) { return i === idx || sel[i] == null || o === sel[i]; }); });
          input.disabled = !available;
        });
      });
    }

    function selectMedia(variant) {
      if (!variant || variant.featured_media == null) return;
      var target = mediaMap[variant.featured_media.id];
      if (target && root.__gallery) root.__gallery.goTo(target.getAttribute("data-media-id"));
    }

    function render() {
      var sel = currentSelections();
      var variant = findVariant(sel);
      updateAvailabilityUI(sel);

      // update selected option label
      $all("[data-option-index]", root).forEach(function (group) {
        var label = group.querySelector("[data-option-selected]");
        var checked = group.querySelector("input:checked");
        if (label && checked) label.textContent = checked.getAttribute("data-label") || checked.value;
      });

      if (!variant) {
        if (addBtn) { addBtn.setAttribute("aria-disabled", "true"); }
        if (addText) addText.textContent = addText.getAttribute("data-unavailable") || "No disponible";
        return;
      }
      if (idInput) idInput.value = variant.id;
      // URL sync (no reload)
      if (history.replaceState && variant.id) {
        var url = new URL(window.location.href);
        url.searchParams.set("variant", variant.id);
        history.replaceState({}, "", url.toString());
      }
      if (priceTarget && variant.price_html) { priceTarget.innerHTML = variant.price_html; }
      else if (priceTarget) { priceTarget.textContent = formatMoney(variant.price); }

      if (addBtn) {
        if (variant.available) {
          addBtn.removeAttribute("aria-disabled");
          if (addText) addText.textContent = addText.getAttribute("data-default") || "Añadir a la bolsa";
        } else {
          addBtn.setAttribute("aria-disabled", "true");
          if (addText) addText.textContent = addText.getAttribute("data-soldout") || "Agotado";
        }
      }
      selectMedia(variant);
      // sticky bar mirror
      var stickyPrice = $("[data-sticky-price]");
      if (stickyPrice && priceTarget) stickyPrice.innerHTML = priceTarget.innerHTML;
    }

    on(root, "change", function (e) { if (e.target.closest("[data-option-index]")) render(); });
    root.__renderVariant = render;
    render();
  }

  function Gallery(root) {
    var main = $("[data-gallery-main]", root);
    var slides = $all("[data-media-id]", main);
    var thumbs = $all("[data-thumb]", root);
    if (!main) return null;
    function goTo(id) {
      slides.forEach(function (s) { s.hidden = s.getAttribute("data-media-id") !== id; });
      thumbs.forEach(function (t) { t.setAttribute("aria-current", t.getAttribute("data-thumb") === id ? "true" : "false"); });
      var active = slides.filter(function (s) { return !s.hidden; })[0];
      if (active) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
    thumbs.forEach(function (t) { on(t, "click", function () { goTo(t.getAttribute("data-thumb")); }); });
    // If slides are laid out as a horizontal scroller on mobile, keep them all visible.
    var api = { goTo: goTo };
    return api;
  }

  $all("[data-product-root]").forEach(function (root) {
    root.__gallery = Gallery(root);
    ProductForm(root);
  });

  /* ============================================================
     PREDICTIVE SEARCH
     ============================================================ */
  (function () {
    var modal = $("[data-search-modal]");
    if (!modal) return;
    var input = $("[data-search-input]", modal);
    var resultsBox = $("[data-predictive]", modal);
    if (!input) return;
    var timer;
    function run() {
      var q = input.value.trim();
      if (q.length < 2) { if (resultsBox) resultsBox.innerHTML = ""; return; }
      var url = (routes.predictive || "/search/suggest") + ".json?q=" + encodeURIComponent(q) +
        "&resources[type]=product,collection,query,article&resources[limit]=6&resources[options][unavailable_products]=last";
      fetchJSON(url).then(function (data) { renderPredictive(data.resources.results); })
        .catch(function () {});
    }
    function renderPredictive(res) {
      if (!resultsBox) return;
      var html = "";
      if (res.queries && res.queries.length) {
        html += '<div class="predictive__group"><p class="predictive__group-title">Sugerencias</p><div class="predictive__queries">';
        res.queries.slice(0, 4).forEach(function (q) { html += '<a class="predictive__query" href="' + q.url + '">' + q.styled_text + "</a>"; });
        html += "</div></div>";
      }
      if (res.products && res.products.length) {
        html += '<div class="predictive__group"><p class="predictive__group-title">Prendas</p><div class="predictive__products">';
        res.products.slice(0, 8).forEach(function (p) {
          var img = p.featured_image && p.featured_image.url ? p.featured_image.url : (p.image || "");
          html += '<a class="pcard" href="' + p.url + '"><div class="pcard__frame" style="--pad:125%">' +
            (img ? '<img class="pcard__img" src="' + img + '" alt="' + (p.title || "").replace(/"/g, "&quot;") + '" loading="lazy">' : "") +
            '</div><div class="pcard__meta"><h3 class="pcard__name">' + p.title + "</h3>" +
            (p.price ? '<span class="price"><span class="price__now">' + p.price + "</span></span>" : "") + "</div></a>";
        });
        html += "</div></div>";
      }
      if (res.collections && res.collections.length) {
        html += '<div class="predictive__group"><p class="predictive__group-title">Colecciones</p><div class="predictive__queries">';
        res.collections.slice(0, 4).forEach(function (c) { html += '<a class="predictive__query" href="' + c.url + '">' + c.title + "</a>"; });
        html += "</div></div>";
      }
      resultsBox.innerHTML = html || '<p class="form-note">Nada con ese nombre todavía.</p>';
    }
    on(input, "input", function () { clearTimeout(timer); timer = setTimeout(run, 220); });
  })();

  /* ============================================================
     COLLECTION: filters + sort (progressive; forms submit natively)
     ============================================================ */
  (function () {
    // Mobile filter drawer toggle
    on(document, "click", function (e) {
      var open = e.target.closest("[data-filters-open]");
      var close = e.target.closest("[data-filters-close]");
      var panel = $("[data-filters]");
      if (open && panel) { panel.classList.add("is-open"); lockScroll(true); }
      if (close && panel) { panel.classList.remove("is-open"); lockScroll(false); }
    });
    // Sort select auto-submits
    var sort = $("[data-sort]");
    on(sort, "change", function () {
      var url = new URL(window.location.href);
      url.searchParams.set("sort_by", sort.value);
      url.searchParams.delete("page");
      window.location.href = url.toString();
    });
    // Auto-submit filter form on change (desktop)
    var filterForm = $("[data-filter-form]");
    if (filterForm && window.matchMedia("(min-width: 769px)").matches) {
      on(filterForm, "change", function () { filterForm.requestSubmit ? filterForm.requestSubmit() : filterForm.submit(); });
    }
  })();

  /* ============================================================
     HEADER: hide on scroll down, mobile menu accordions
     ============================================================ */
  (function () {
    var header = $(".header");
    if (!header) return;
    var last = 0;
    window.addEventListener("scroll", function () {
      var y = window.pageYOffset;
      if (y > 200 && y > last && !openOverlays.length) header.classList.add("header--hidden");
      else header.classList.remove("header--hidden");
      last = y;
    }, { passive: true });

    // Mobile nav submenu expand
    on(document, "click", function (e) {
      var toggle = e.target.closest("[data-subnav-toggle]");
      if (toggle) { var sub = toggle.nextElementSibling; if (sub) sub.hidden = !sub.hidden; toggle.setAttribute("aria-expanded", sub && !sub.hidden ? "true" : "false"); }
    });
  })();

  /* ============================================================
     STICKY BUY BAR (mobile PDP)
     ============================================================ */
  (function () {
    var bar = $("[data-sticky-buy]");
    var anchor = $("[data-buy-anchor]");
    if (!bar || !anchor || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { bar.classList.toggle("is-visible", !en.isIntersecting && en.boundingClientRect.top < 0); });
    }, { threshold: 0 });
    io.observe(anchor);
    // Sticky "add" delegates to the real form
    on(bar, "click", function (e) {
      if (e.target.closest("[data-sticky-add]")) {
        var form = $("[data-product-form]");
        if (form) Cart.add(form, e.target.closest("[data-sticky-add]"));
      }
    });
  })();

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  (function () {
    var els = $all(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ============================================================
     NEWSLETTER: reflect Shopify form state gracefully (native POST)
     Handled server-side by {% form 'customer' %}; JS only adds a11y focus.
     ============================================================ */
  $all("[data-newsletter]").forEach(function (form) {
    var success = form.querySelector(".newsletter__success");
    if (success) success.setAttribute("role", "status");
  });

  /* ---------- init cart bits ---------- */
  CartDrawer.init();

  // Expose a minimal API for debugging / inline handlers
  window.CENIT = { Cart: Cart, openCart: function () { CartDrawer.open(); }, toast: toast };
})();
