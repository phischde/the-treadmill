// Mobile-friendly dropdown navigation
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');

// Track which dropdown is currently open
let activeDropdown = null;

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
const toggleDropdown = (trigger) => {
  const menu = trigger.nextElementSibling;
  if (!menu || !menu.classList.contains('dropdown-menu')) return;

  if (activeDropdown === menu) {
    closeAllDropdowns();
  } else {
    openDropdown(menu);
  }
};

// Add click handlers to dropdown triggers
dropdownTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(trigger);
  });

  // Prevent the trigger link from navigating
  trigger.addEventListener('touchstart', (e) => {
    e.preventDefault();
  }, { passive: false });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  // Don't close if clicking inside a dropdown menu
  if (activeDropdown && (activeDropdown.contains(e.target) || e.target.closest('.dropdown-trigger'))) {
    return;
  }
  closeAllDropdowns();
});

// Handle touch events for mobile
document.addEventListener('touchstart', (e) => {
  // Don't close if touching inside a dropdown menu or trigger
  if (activeDropdown && (activeDropdown.contains(e.target) || e.target.closest('.dropdown-trigger'))) {
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