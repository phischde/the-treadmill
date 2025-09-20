// Matomo Analytics
export function initializeMatomo(siteConfig) {
  // Skip entirely if DNT=1
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1') {
    console.log("Matomo disabled (DNT)");
    return;
  }

  var _paq = window._paq = window._paq || [];
  var storageAccessible = true;
  var safeGetItem = function(key) {
    if (!storageAccessible) return null;
    try {
      return localStorage.getItem(key);
    } catch (err) {
      storageAccessible = false;
      return null;
    }
  };
  // Cookieless by default
  _paq.push(['disableCookies']);
  // Only set DNT if user hasn't consented
  if (safeGetItem('consent-choice') !== 'yes') {
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
    if (!storageAccessible) {
      return;
    }
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

    // Time tracking
    var pageLoadTime = Date.now();
    
    // Scroll depth tracking
    var thirty=false, sixty=false, ninety=false, halfwayReached=false, storyRead=false;
    window.addEventListener('scroll', function() {
      var scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
      var hasConsent = safeGetItem('consent-choice') === 'yes';
      var timeElapsed = Date.now() - pageLoadTime;

      if (!thirty && scrolled > 30 && hasConsent) {
        setTimeout(function() {
          if (window.Matomo && window.Matomo.getTracker) {
            var tracker = window.Matomo.getTracker();
            if (tracker && tracker.trackEvent) {
              tracker.trackEvent('Scroll', '30%');
            }
          }
        }, 100);
        thirty=true; 
      }
      if (!sixty && scrolled > 60 && hasConsent) {
        setTimeout(function() {
          if (window.Matomo && window.Matomo.getTracker) {
            var tracker = window.Matomo.getTracker();
            if (tracker && tracker.trackEvent) {
              tracker.trackEvent('Scroll', '60%');
            }
          }
        }, 100);
        sixty=true; 
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
      
      // Halfway event: 50% scroll + at least 1 minute
      if (!halfwayReached && scrolled > 50 && timeElapsed > 60000 && hasConsent) {
        setTimeout(function() {
          if (window.Matomo && window.Matomo.getTracker) {
            var tracker = window.Matomo.getTracker();
            if (tracker && tracker.trackEvent) {
              tracker.trackEvent('Story', 'Halfway Read');
            }
          }
        }, 100);
        halfwayReached=true; 
      }
      
      // Story Read event: 90% scroll + at least 2 minutes + halfway reached
      if (!storyRead && scrolled > 90 && timeElapsed > 120000 && halfwayReached && hasConsent) {
        setTimeout(function() {
          if (window.Matomo && window.Matomo.getTracker) {
            var tracker = window.Matomo.getTracker();
            if (tracker && tracker.trackEvent) {
              tracker.trackEvent('Story', 'Story Read');
            }
          }
        }, 100);
        storyRead=true; 
      }
    });

  });
}

// Auto-initialize if site config is available
if (window.siteConfig && window.siteConfig.matomo && window.siteConfig.matomo.enabled) {
  initializeMatomo(window.siteConfig);
}

// activate the consent button
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('reset-consent');
    if (!btn) return;
    btn.addEventListener('click', function () {
        try { localStorage.removeItem('consent-choice'); } catch (e) {}
        location.reload();
    });
});