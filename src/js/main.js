// Function to load a script from a CDN with additional attributes
function loadVendorScript(src, attributes, callback) {
  var script = document.createElement('script');
  script.src = src;
  // script.async = true;
  // Set additional attributes
  for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
          script.setAttribute(key, attributes[key]);
      }
  }
  script.onload = callback;
  document.head.appendChild(script);
}
  
// Swap logo on scroll and make nav bg more opaque
window.addEventListener('scroll', () => {
  const largeLogo = document.getElementById('large-logo');
  const smallLogo = document.getElementById('small-logo');
  const topNavBG = document.getElementById('top-nav-bg');
  const scrollPosition = window.scrollY;

  // Handle logo swap
  if (scrollPosition > 10) {
      largeLogo.classList.add('opacity-0');
      smallLogo.classList.remove('opacity-0');
  } else {
      largeLogo.classList.remove('opacity-0');
      smallLogo.classList.add('opacity-0');
  }

  // Handle nav opacity changes based on scroll position
  if (scrollPosition > 50) {
      topNavBG.classList.remove('bg-stone-50/50', 'dark:bg-stone-700/50', 'bg-stone-50/70', 'dark:bg-stone-700/70');
      topNavBG.classList.add('bg-stone-50/95', 'dark:bg-stone-700/95');
  } else if (scrollPosition > 30 && scrollPosition <= 50) {
      topNavBG.classList.remove('bg-stone-50/50', 'dark:bg-stone-700/50', 'bg-stone-50/95', 'dark:bg-stone-700/95');
      topNavBG.classList.add('bg-stone-50/70', 'dark:bg-stone-700/70');
  } else if (scrollPosition > 10 && scrollPosition <= 30) {
      topNavBG.classList.remove('bg-stone-50/70', 'dark:bg-stone-700/70', 'bg-stone-50/95', 'dark:bg-stone-700/95');
      topNavBG.classList.add('bg-stone-50/50', 'dark:bg-stone-700/50');
  } else {
      topNavBG.classList.remove('bg-stone-50/70', 'dark:bg-stone-700/70', 'bg-stone-50/95', 'dark:bg-stone-700/95');
      topNavBG.classList.add('bg-stone-50/50', 'dark:bg-stone-700/50');
  }
});

// Theme Toggle with Alpine.js
document.addEventListener('alpine:init', () => {
  Alpine.data('themeToggle', () => ({
      darkMode: localStorage.getItem('darkMode') === 'true' || false,
      init() {
          this.$watch('darkMode', value => {
              localStorage.setItem('darkMode', value);
              document.body.classList.toggle('dark', value);
          });
          // Ensure the correct class is applied on page load
          document.body.classList.toggle('dark', this.darkMode);
      }
  }));
});
  
// Load Mastodon Comments from a local file
import Comments from "./comments.js";
customElements.define("mastodon-comments", Comments);

// Load Alpine.js with defer
loadVendorScript('https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js', { 'defer': '' }, function() {
  console.log('Alpine.js loaded with defer');
});

// Load Fathom Analytics script with data-site attribute and defer
loadVendorScript('https://cdn.usefathom.com/script.js', { 'data-site': 'OIXGEUHR', 'defer': '' }, function() {
  console.log('Fathom Analytics loaded with defer and data-site attribute');
});

// Handle keydown event for anchor tags with role="button"
const buttons = document.querySelectorAll('a[role="button"]');
buttons.forEach(button => {
  button.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      this.click();
    }
  });
});

// Search modal
const modal = document.getElementById("searchModal");
const searchButton = document.getElementById("search-button"); // Select the button by its ID
const close = document.getElementById("modal-close");

searchButton.onclick = function() { // Change the event listener target to the button
  modal.style.display = "block";
  // Focus on the Pagefind input if it exists after the modal is shown
  const pageFind = modal.querySelector(".pagefind-ui__search-input");
  if (pageFind) {
    pageFind.focus();
  }
}
close.onclick = function () {
  modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// Close modal on Escape key press
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' || event.keyCode === 27) { // Check for Escape key
    if (modal.style.display === 'block') {
    modal.style.display = 'none';
    }
 }
});
// Open modal on Cmd+K (Mac) or Ctrl+K (Windows/Linux)
document.addEventListener('keydown', function(event) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isCmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

    if (isCmdOrCtrl && event.key === 'k') {
        event.preventDefault(); // Prevent browser's default search shortcut
        modal.style.display = 'block';
        const pageFind = modal.querySelector(".pagefind-ui__search-input");
        if (pageFind) {
        pageFind.focus();
        }
    }
});

// Mobile Menu Modal Control
const mobileMenuOverlay = document.getElementById("mobile-menu-modal-overlay");
const mobileMenuPanel = document.getElementById("mobile-menu-modal-panel");
const mobileMenuButton = document.getElementById("mobile-menu-button"); // The "Menu" button
const mobileMenuCloseButton = document.getElementById("mobile-menu-close-button"); // The close X button inside the modal

// Function to show the mobile menu modal
function showMobileMenuModal() {
  if (mobileMenuOverlay && mobileMenuPanel) { // Check if elements exist
    mobileMenuOverlay.classList.remove("hidden"); // Remove hidden class to show overlay
    mobileMenuPanel.classList.remove("hidden"); // Remove hidden class to show panel
    // Optional: Add logic here to prevent body scrolling when modal is open
    // document.body.style.overflow = 'hidden';
  }
}

// Function to hide the mobile menu modal
function hideMobileMenuModal() {
  if (mobileMenuOverlay && mobileMenuPanel) { // Check if elements exist
    mobileMenuOverlay.classList.add("hidden"); // Add hidden class to hide overlay
    mobileMenuPanel.classList.add("hidden"); // Add hidden class to hide panel
    // Optional: Add logic here to re-enable body scrolling
    // document.body.style.overflow = '';
  }
}

// --- Event Listeners ---

// Open modal on "Menu" button click
if (mobileMenuButton) { // Ensure the button exists before adding listener
  mobileMenuButton.addEventListener("click", function() {
    showMobileMenuModal();
  });
}

// Close modal on close button click
if (mobileMenuCloseButton) { // Ensure the button exists before adding listener
  mobileMenuCloseButton.addEventListener("click", function () {
    hideMobileMenuModal();
  });
}

// Close modal when clicking outside the panel (on the overlay)
if (mobileMenuOverlay) { // Ensure the overlay exists before adding listener
  // Use click event on the overlay itself, not the window for more precise targeting
   mobileMenuOverlay.addEventListener("click", function(event) {
       if (event.target === mobileMenuOverlay) { // Check if the clicked element is the overlay
           hideMobileMenuModal();
       }
   });
}


// Close modal on Escape key press
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') { // Use event.key for modern browsers
    // Check if the modal is currently visible (check if the panel does NOT have the hidden class)
    if (mobileMenuPanel && !mobileMenuPanel.classList.contains('hidden')) {
      hideMobileMenuModal();
    }
  }
});

// Note: The logic for opening on Cmd+K/Ctrl+K is specific to the search modal
// and is not included in this script for the mobile menu modal.
// The logic for focusing an input is also specific to the search modal.

