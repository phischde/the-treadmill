// Initialize site
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

// Make site config available to analytics
window.siteConfig = JSON.parse(document.getElementById('site-config').textContent);