(function(){
  if (localStorage.getItem('consent-choice')) return;
  document.getElementById('consent-bubble').classList.remove('hidden');
  document.getElementById('consent-yes').addEventListener('click', function(){
    localStorage.setItem('consent-choice','yes');
    window.enableMatomoCookies();
    document.getElementById('consent-bubble').remove();
  });
  document.getElementById('consent-no').addEventListener('click', function(){
    localStorage.setItem('consent-choice','no');
    document.getElementById('consent-bubble').remove();
  });
})();