(function(){
  var storageAvailable = true;
  var storedChoice = null;

  try {
    storedChoice = localStorage.getItem('consent-choice');
  } catch (err) {
    storageAvailable = false;
  }

  if (storedChoice) return;

  var consentBubble = document.getElementById('consent-bubble');
  if (!consentBubble) return;

  consentBubble.classList.remove('hidden');

  var persistChoice = function(value) {
    if (!storageAvailable) return;
    try {
      localStorage.setItem('consent-choice', value);
    } catch (err) {
      storageAvailable = false;
    }
  };

  var yesButton = document.getElementById('consent-yes');
  if (yesButton) {
    yesButton.addEventListener('click', function(){
      persistChoice('yes');
      if (typeof window.enableMatomoCookies === 'function') {
        window.enableMatomoCookies();
      }
      consentBubble.remove();
    });
  }

  var noButton = document.getElementById('consent-no');
  if (noButton) {
    noButton.addEventListener('click', function(){
      persistChoice('no');
      consentBubble.remove();
    });
  }
})();
