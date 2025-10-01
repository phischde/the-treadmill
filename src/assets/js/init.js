// Initialize site
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

// Make site config available to analytics
window.siteConfig = JSON.parse(document.getElementById('site-config').textContent);

// Make page config available to analytics
window.pageConfig = JSON.parse(document.getElementById('page-config').textContent);