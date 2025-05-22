// === OS Detection ===
(() => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const bodyClass = 
    /windows phone/i.test(ua) ? 'os-windows-phone' :
    /android/i.test(ua) ? 'os-android' :
    /iPad|iPhone|iPod/.test(ua) && !window.MSStream ? 'os-ios' :
    /Mac/i.test(ua) ? 'os-mac' :
    /Win/i.test(ua) ? 'os-windows' : null;

  if (bodyClass) document.body.classList.add(bodyClass);
})();

// === Utility: Load External Script ===
function loadVendorScript(src, attributes = {}, callback) {
  const script = document.createElement('script');
  script.src = src;
  Object.entries(attributes).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });
  script.onload = callback;
  document.head.appendChild(script);
}

// === Load Fathom Analytics ===
loadVendorScript('https://cdn.usefathom.com/script.js', {
  'data-site': 'OIXGEUHR',
  'defer': ''
}, () => {
  console.log('Fathom Analytics loaded');
});

// === Register Mastodon Comments ===
import Comments from "./comments.js";
customElements.define("mastodon-comments", Comments);

// === DOM-Dependent Logic ===
document.addEventListener('DOMContentLoaded', () => {
  console.log('--- DOM Content Loaded ---');

  // === Accessibility: Role="button" Keyboard Support ===
  document.querySelectorAll('a[role="button"]').forEach(button => {
    button.addEventListener('keydown', e => {
      if (e.key === 'Enter') button.click();
    });
  });

  // === Utility: Trap Focus ===
  function trapFocus(container) {
    const focusables = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    container.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });

    if (first) first.focus();
  }

  // === Search Modal ===
  (() => {
    const modal = document.getElementById("searchModal");
    const openBtn = document.getElementById("search-button");
    const closeBtn = document.getElementById("modal-close");

    if (!(modal && openBtn && closeBtn)) return;

    const open = () => {
      modal.style.display = "block";
      const input = modal.querySelector(".pagefind-ui__search-input");
      if (input) input.focus();
      trapFocus(modal);
    };

    const close = () => {
      modal.style.display = "none";
      openBtn.focus();
    };

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    window.addEventListener("click", e => { if (e.target === modal) close(); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && modal.style.display === "block") close();
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key === "k") {
        e.preventDefault(); open();
      }
    });
  })();

  // === Mobile Menu Modal ===
  (() => {
    const overlay = document.getElementById("mobile-menu-modal-overlay");
    const panel = document.getElementById("mobile-menu-modal-panel");
    const openBtn = document.getElementById("mobile-menu-button");
    const closeBtn = document.getElementById("mobile-menu-close-button");

    if (!(overlay && panel && openBtn && closeBtn)) return;

    const show = () => {
      overlay.classList.remove("hidden", "opacity-0", "pointer-events-none");
      panel.classList.remove("hidden", "translate-x-full");
      void overlay.offsetWidth; void panel.offsetWidth;
      overlay.classList.add("opacity-100");
      panel.classList.add("translate-x-0");
      trapFocus(panel);
    };

    const hide = () => {
      overlay.classList.remove("opacity-100");
      overlay.classList.add("opacity-0", "pointer-events-none");
      panel.classList.remove("translate-x-0");
      panel.classList.add("translate-x-full");
      setTimeout(() => {
        overlay.classList.add("hidden");
        panel.classList.add("hidden");
        openBtn.focus();
      }, 300);
    };

    openBtn.addEventListener("click", show);
    closeBtn.addEventListener("click", hide);
    overlay.addEventListener("click", e => { if (e.target === overlay) hide(); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !panel.classList.contains("hidden")) hide();
    });
  })();

  // === Table of Contents (ToC) Auto-Close on Small Screens ===
  (() => {
    const path = window.location.pathname;
    const isRootOrLangRoot = /^\/([a-z]{2}\/)?$/.test(path);
    if (isRootOrLangRoot) return;

    const toc = document.getElementById('toc-details');
    if (!toc) {
      console.warn('No Table of Contents found');
      return;
    }

    const updateToC = () => {
      const isWide = window.matchMedia('(min-width: 768px)').matches;
      if (!isWide) toc.removeAttribute('open');
    };

    updateToC();
    window.addEventListener('resize', updateToC);
  })();

  // === Sticky Nav + Logo Swap ===
  (() => {
    const nav = document.getElementById("top-nav");
    const sentinel = document.getElementById("nav-sentinel");
    const largeLogo = document.getElementById("large-logo");
    const symbolLogo = document.getElementById("symbol-logo");

    if (!(nav && sentinel && largeLogo && symbolLogo)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isPinned = !entry.isIntersecting;
        nav.setAttribute("data-pinned", isPinned ? "true" : "false");

        if (window.innerWidth <= 640) {
          if (isPinned) {
            largeLogo.classList.add("opacity-0", "scale-95");
            largeLogo.classList.remove("opacity-100", "scale-110");

            symbolLogo.classList.remove("opacity-0", "scale-90");
            symbolLogo.classList.add("opacity-100", "scale-100");
          } else {
            largeLogo.classList.remove("opacity-0", "scale-95");
            largeLogo.classList.add("opacity-100", "scale-110");

            symbolLogo.classList.add("opacity-0", "scale-90");
            symbolLogo.classList.remove("opacity-100", "scale-100");
          }
        }
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
  })();
});
