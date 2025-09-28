// Set reading time attribute on the first h1 element
document.addEventListener('DOMContentLoaded', function() {
  const storyBody = document.querySelector('.story-body[data-reading-time]');

  // Only run if we have a story body with reading time data
  if (!storyBody) return;

  const firstH1 = storyBody.querySelector('h1:first-child');
  const readingTime = storyBody.getAttribute('data-reading-time');

  if (firstH1 && readingTime) {
    firstH1.setAttribute('data-reading-time', readingTime);
  }
});