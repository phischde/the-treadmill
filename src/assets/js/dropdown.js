// Mobile-friendly dropdown navigation
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');

// Track which dropdown is currently open
let activeDropdown = null;

// Check if we're on mobile (640px breakpoint)
const isMobile = () => window.innerWidth <= 640;

// Function to close all dropdowns
const closeAllDropdowns = () => {
  dropdownMenus.forEach(menu => {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
  });
  activeDropdown = null;
};

// Function to open a dropdown
const openDropdown = (menu) => {
  closeAllDropdowns(); // Close any open dropdown first
  menu.style.opacity = '1';
  menu.style.visibility = 'visible';
  menu.style.transform = 'translateY(0)';
  activeDropdown = menu;
};

// Function to toggle dropdown
const toggleDropdown = (element) => {
  const menu = element.querySelector('.dropdown-menu') || element.nextElementSibling;
  if (!menu || !menu.classList.contains('dropdown-menu')) return;

  if (activeDropdown === menu) {
    closeAllDropdowns();
  } else {
    openDropdown(menu);
  }
};

// Add click handlers to dropdown triggers (desktop)
dropdownTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(trigger);
  });

  // Prevent the trigger link from navigating on touch
  trigger.addEventListener('touchstart', (e) => {
    e.preventDefault();
  }, { passive: false });
});

// Add click handlers to entire wrapper (mobile)
dropdownWrappers.forEach(wrapper => {
  wrapper.addEventListener('click', (e) => {
    if (isMobile()) {
      // Don't prevent clicks on dropdown menu items
      if (e.target.closest('.dropdown-menu')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(wrapper);
    }
  });

  // Add touch event for better mobile responsiveness
  wrapper.addEventListener('touchend', (e) => {
    if (isMobile()) {
      // Don't prevent clicks on dropdown menu items
      if (e.target.closest('.dropdown-menu')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(wrapper);
    }
  }, { passive: false });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  // Don't close if clicking inside a dropdown menu or wrapper
  if (activeDropdown && (activeDropdown.contains(e.target) ||
      e.target.closest('.dropdown-trigger') ||
      e.target.closest('.nav-dropdown-wrapper'))) {
    return;
  }
  closeAllDropdowns();
});

// Handle touch events for mobile
document.addEventListener('touchstart', (e) => {
  // Don't close if touching inside a dropdown menu, trigger, or wrapper
  if (activeDropdown && (activeDropdown.contains(e.target) ||
      e.target.closest('.dropdown-trigger') ||
      e.target.closest('.nav-dropdown-wrapper'))) {
    return;
  }
  closeAllDropdowns();
});

// Close dropdown on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeDropdown) {
    closeAllDropdowns();
  }
});

// Handle window resize - close dropdowns on orientation change
window.addEventListener('resize', () => {
  closeAllDropdowns();
});