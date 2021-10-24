window.$ = document.querySelector.bind(document);
window.$All= document.querySelectorAll.bind(document);

// Single Page Apps for GitHub Pages https://github.com/rafgraph/spa-github-pages
// if a redirect is present in the query string, converts it back into the correct url
// from : https://username.github.io/repo-name/?/one/two&a=b~and~c=d#qwe
// to :   https://username.github.io/repo-name/one/two?a=b&c=d#qwe
function replaceUrlForSPA() {
  const l = window.location;
  if (l.search[1] === '/' ) {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
  }
}

// enable/disable tabindex outline for action items
function disableOutline() {
  document.body.addEventListener('click', e => document.body.classList.remove('a11y-outline') );
  document.body.addEventListener('keydown', e => (e.key === 'Tab') && document.body.classList.add('a11y-outline') );
}

function setNavItem(navItemId) {
  $('.nav-bar .nav-item.active').classList.remove('active');
  $(`#${navItemId}`).scrollIntoView({behavior: 'smooth'});
  $(`.nav-bar [data-nav="${navItemId}"]`).classList.add('active');
}

function show1by1(els, wait=0, effect='zoomIn') {
  Array.from(els).forEach( (el, i) => {
    el.style.visibility = 'hidden';
    setTimeout(_ => {
      el.style.visibility = '';
      animate(el, effect, 300);
    }, wait + i * 200);
    if (el.classList.contains('x-animate')) {
      show1by1(el.children, i * 200);
    }
  });
}

// developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
function intersectionObserverCallback(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bgColor = entry.target.getAttribute('data-color');
      const luminance = chroma(bgColor).luminance();
      document.body.classList.remove('dark-bg');
      document.body.style.backgroundColor = bgColor;
      luminance < .5 && document.body.classList.add('dark-bg');
      setNavItem(entry.target.id);
      const animateEls = entry.target.children.length === 1 ? 
        entry.target.children.children : entry.target.children;
      show1by1(animateEls);
    }
  });
}

window.addEventListener('DOMContentLoaded', function() {
  replaceUrlForSPA();
  disableOutline();
  
  const observer = new IntersectionObserver(intersectionObserverCallback);
  $All('.contents').forEach(el => observer.observe(el));
  $All('.nav-item').forEach(el => el.addEventListener('click', _ => setNavItem(el.dataset.nav)) );
});