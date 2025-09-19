// Matomo Analytics - moved from inline template
export function initializeMatomo(siteConfig) {
  // Skip entirely if DNT=1
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1') {
    console.log("Matomo disabled (DNT)");
    return;
  }

  var _paq = window._paq = window._paq || [];
  // Cookieless by default
  _paq.push(['disableCookies']);
  // Only set DNT if user hasn't consented
  if (!localStorage.getItem('consent-choice')) {
    _paq.push(['setDoNotTrack', true]);
  }
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);

  // Tracker bootstrap
  (function() {
    var u = siteConfig.matomo.url;
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', siteConfig.matomo.siteId]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();

  // Upgrade function for consent
  window.enableMatomoCookies = function() {
    _paq.push(['rememberConsentGiven']);      // Tell Matomo we have consent
    _paq.push(['forgetUserOptOut']);          // Clear opt-out if set
    _paq.push(['enableCookies']);             // Re-enable cookies
    _paq.push(['setDoNotTrack', false]);      // Disable DoNotTrack after consent
    _paq.push(['trackPageView']);             // Re-track current page
  };

  // Simple event tracking
  document.addEventListener('DOMContentLoaded', function() {
    var pdfLink = document.querySelector('a[href$=".pdf"]');
    if (pdfLink) {
      pdfLink.addEventListener('click', function() {
        _paq.push(['trackEvent', 'Story', 'PDF Download']);
      });
    }

    // Only track scroll events on story pages
    var isStoryPage = document.querySelector('.story');
    if (!isStoryPage) return;

    // Scroll depth tracking
    var fifty=false, ninety=false, endSeen=false;
    window.addEventListener('scroll', function() {
      var scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
      var hasConsent = localStorage.getItem('consent-choice') === 'yes';
      
      if (!fifty && scrolled > 50 && hasConsent) { 
        setTimeout(function() {
          if (window.Matomo && window.Matomo.getTracker) {
            var tracker = window.Matomo.getTracker();
            if (tracker && tracker.trackEvent) {
              tracker.trackEvent('Scroll', '50%');
            }
          }
        }, 100);
        fifty=true; 
      }
      if (!ninety && scrolled > 90 && hasConsent) { 
        setTimeout(function() {
          if (window.Matomo && window.Matomo.getTracker) {
            var tracker = window.Matomo.getTracker();
            if (tracker && tracker.trackEvent) {
              tracker.trackEvent('Scroll', '90%');
            }
          }
        }, 100);
        ninety=true; 
      }
    });

    // Last paragraph view
    var last = document.querySelector('main p:last-of-type');
    if (last) {
      var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting && !endSeen) {
          var hasConsent = localStorage.getItem('consent-choice') === 'yes';
          if (hasConsent) {
            setTimeout(function() {
              if (window.Matomo && window.Matomo.getTracker) {
                var tracker = window.Matomo.getTracker();
                if (tracker && tracker.trackEvent) {
                  tracker.trackEvent('Story', 'End Seen');
                }
              }
            }, 100);
          }
          endSeen = true;
        }
      }, { threshold: 0.6 });
      observer.observe(last);
    }
  });
}

// Auto-initialize if site config is available
if (window.siteConfig && window.siteConfig.matomo && window.siteConfig.matomo.enabled) {
  initializeMatomo(window.siteConfig);
}