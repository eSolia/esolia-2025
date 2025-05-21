// Load this first
(function() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/windows phone/i.test(userAgent)) {
        document.body.classList.add('os-windows-phone');
    } else if (/android/i.test(userAgent)) {
        document.body.classList.add('os-android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        document.body.classList.add('os-ios');
    } else if (/Mac/i.test(userAgent)) {
        document.body.classList.add('os-mac');
    } else if (/Win/i.test(userAgent)) { // This would catch most Windows desktops/laptops
        document.body.classList.add('os-windows');
    }
})();

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
//window.addEventListener('scroll', () => {
  // const largeLogo = document.getElementById('large-logo');
  // const smallLogo = document.getElementById('small-logo');
  // const topNavBG = document.getElementById('top-nav-bg');
  // const scrollPosition = window.scrollY;

  // Handle logo swap
 // if (scrollPosition > 10) {
  //    largeLogo.classList.add('opacity-0');
      // smallLogo.classList.remove('opacity-0');
  //} else {
   //   largeLogo.classList.remove('opacity-0');
      // smallLogo.classList.add('opacity-0');
  //}

  // Handle nav opacity changes based on scroll position
  // if (scrollPosition > 50) {
  //     topNavBG.classList.remove('bg-stone-50/50', 'dark:bg-stone-700/50', 'bg-stone-50/70', 'dark:bg-stone-700/70');
  //     topNavBG.classList.add('bg-stone-50/95', 'dark:bg-stone-700/95');
  // } else if (scrollPosition > 30 && scrollPosition <= 50) {
  //     topNavBG.classList.remove('bg-stone-50/50', 'dark:bg-stone-700/50', 'bg-stone-50/95', 'dark:bg-stone-700/95');
  //     topNavBG.classList.add('bg-stone-50/70', 'dark:bg-stone-700/70');
  // } else if (scrollPosition > 10 && scrollPosition <= 30) {
  //     topNavBG.classList.remove('bg-stone-50/70', 'dark:bg-stone-700/70', 'bg-stone-50/95', 'dark:bg-stone-700/95');
  //     topNavBG.classList.add('bg-stone-50/50', 'dark:bg-stone-700/50');
  // } else {
  //     topNavBG.classList.remove('bg-stone-50/70', 'dark:bg-stone-700/70', 'bg-stone-50/95', 'dark:bg-stone-700/95');
  //     topNavBG.classList.add('bg-stone-50/50', 'dark:bg-stone-700/50');
  // }
//});

// Theme Toggle with Alpine.js
// document.addEventListener('alpine:init', () => {
//   Alpine.data('themeToggle', () => ({
//       darkMode: localStorage.getItem('darkMode') === 'true' || false,
//       init() {
//           this.$watch('darkMode', value => {
//               localStorage.setItem('darkMode', value);
//               document.body.classList.toggle('dark', value);
//           });
//           // Ensure the correct class is applied on page load
//           document.body.classList.toggle('dark', this.darkMode);
//       }
//   }));
// });
  
// Load Mastodon Comments from a local file
import Comments from "./comments.js";
customElements.define("mastodon-comments", Comments);

// Load Alpine.js with defer
// loadVendorScript('https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js', { 'defer': '' }, function() {
//   console.log('Alpine.js loaded with defer');
// });

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

// SEARCH AND MOBILE MENU MODAL CONTROL
// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('--- DOM Content Loaded ---');
  // --- Search Modal Control ---
  // Get references to the search modal elements
  const searchModal = document.getElementById("searchModal");
  const searchButton = document.getElementById("search-button"); // Select the button by its ID
  const searchModalCloseButton = document.getElementById("modal-close"); // Use a distinct ID for clarity

  // Check if all search modal elements were found before adding listeners
  if (searchModal && searchButton && searchModalCloseButton) {

    // Open search modal on button click
    searchButton.addEventListener("click", function() { // Use addEventListener
      searchModal.style.display = "block";
      // Focus on the Pagefind input if it exists after the modal is shown
      const pageFind = searchModal.querySelector(".pagefind-ui__search-input");
      if (pageFind) {
        pageFind.focus();
      }
    });

    // Close search modal on close button click
    searchModalCloseButton.addEventListener("click", function () { // Use addEventListener
      searchModal.style.display = "none";
    });

    // Close search modal on clicking outside the modal content (on the modal background)
    window.addEventListener("click", function(event) { // Add listener to window
        if (event.target === searchModal) { // Use === for precise target check
            searchModal.style.display = "none";
        }
    });

    // Close search modal on Escape key press
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') { // Use event.key for modern browsers
        if (searchModal.style.display === 'block') { // Check if visible
          searchModal.style.display = 'none';
        }
      }
    });

    // Open search modal on Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    document.addEventListener('keydown', function(event) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isCmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

        if (isCmdOrCtrl && event.key === 'k') {
            event.preventDefault(); // Prevent browser's default search shortcut
            searchModal.style.display = 'block';
            const pageFind = searchModal.querySelector(".pagefind-ui__search-input");
            if (pageFind) {
              pageFind.focus();
            }
        }
    });

  } // End check for search modal elements

  // --- Mobile Menu Modal Control ---
  // Get references to the mobile menu modal elements
  const mobileMenuOverlay = document.getElementById("mobile-menu-modal-overlay");
  const mobileMenuPanel = document.getElementById("mobile-menu-modal-panel");
  const mobileMenuButton = document.getElementById("mobile-menu-button"); // The "Menu" button
  const mobileMenuCloseButton = document.getElementById("mobile-menu-close-button"); // The close X button inside the modal

  console.log({mobileMenuButton}, {mobileMenuCloseButton}, {mobileMenuOverlay}, {mobileMenuPanel}); // Log the elements to check if they are null
  // Check if the elements are null

  // Check if all mobile menu modal elements were found before adding listeners
  if (mobileMenuOverlay && mobileMenuPanel && mobileMenuButton && mobileMenuCloseButton) {
    console.log('All mobile menu elements found. Attempting to attach listeners.');
      // Function to show the mobile menu modal
      function showMobileMenuModal() {
        console.log('--- Calling showMobileMenuModal ---'); // Check if this logs
        if (mobileMenuOverlay && mobileMenuPanel) {
          console.log('Removing hidden class from overlay and panel'); // Check if this logs
          mobileMenuOverlay.classList.remove("hidden");
          mobileMenuPanel.classList.remove("hidden");
        } else {
          console.log('Error: Modal elements are null inside showMobileMenuModal'); // Should NOT log if previous checks work
        }
      }

      // Function to hide the mobile menu modal
      function hideMobileMenuModal() {
        console.log('--- Calling hideMobileMenuModal ---'); // Check if this logs
        if (mobileMenuOverlay && mobileMenuPanel) {
          console.log('Adding hidden class to overlay and panel'); // Check if this logs
          mobileMenuOverlay.classList.add("hidden");
          mobileMenuPanel.classList.add("hidden");
        } else {
            console.log('Error: Modal elements are null inside hideMobileMenuModal'); // Should NOT log
        }
      }

      // --- Event Listeners ---

      // Open modal on "Menu" button click
      mobileMenuButton.addEventListener("click", function() {
        console.log('--- Mobile menu button clicked ---');
          showMobileMenuModal();
      });

      // Close modal on close button click
      mobileMenuCloseButton.addEventListener("click", function () {
          hideMobileMenuModal();
      });

      // Close modal when clicking outside the panel (on the overlay)
       // Use click event on the overlay itself, not the window for more precise targeting
      mobileMenuOverlay.addEventListener("click", function(event) {
           if (event.target === mobileMenuOverlay) { // Check if the clicked element is the overlay
               hideMobileMenuModal();
           }
       });


      // Close modal on Escape key press
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          // Check if the modal is currently visible (check if the panel does NOT have the hidden class)
          if (!mobileMenuPanel.classList.contains('hidden')) {
            hideMobileMenuModal();
          }
        }
      });

  } // End check for mobile menu modal elements

}); // End DOMContentLoaded listener

// For TOC details opening
// This script will automatically open the Table of Contents (ToC) on medium and larger screens
document.addEventListener('DOMContentLoaded', () => {
    const tocDetails = document.getElementById('toc-details');
    if (!tocDetails) {
        console.warn('Table of Contents details element not found!');
        return;
    }
    const handleDetailsState = () => {
        const isMediumOrLargeScreen = window.matchMedia('(min-width: 768px)').matches;

        if (isMediumOrLargeScreen) {
            // On medium and larger screens:
            // The 'open' attribute is set in the HTML. We DO NOT modify it here.
            // This allows the user to freely open/close the ToC, and their action will persist.
        } else {
            // On smaller screens:
            // Ensure the ToC is always closed by default (remove 'open' if present).
            tocDetails.removeAttribute('open');
        }
    };
    // Set initial state on page load
    handleDetailsState();
    // Re-evaluate state on window resize
    window.addEventListener('resize', handleDetailsState);
});
