window.$ = document.querySelector.bind(document);
window.$All= document.querySelectorAll.bind(document);
window._sectionSwitching = false;

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

function setNavItem(navItemId) {
  $('.nav-bar .nav-item.active')?.classList.remove('active');
  $(`#${navItemId}`).scrollIntoView({behavior: 'smooth'});
  $(`.nav-bar [data-nav="${navItemId}"]`).classList.add('active');
  runTransition($(`#${navItemId}`));
}

function runTransition(toEl) {
  const bgColor = toEl.dataset.bgColor || '#fff';
  const luminance = chroma(bgColor).luminance();
  document.body.classList.remove('dark-bg');
  document.body.style.backgroundColor = bgColor;
  luminance < .5 && document.body.classList.add('dark-bg');
}

// developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
function intersectionObserverCallback(entries, observer) {
  entries.forEach(entry => {
    const inView = entry.intersectionRatio > 0;
    if (inView && !window._sectionSwitching) {
      console.log(entry.intersectionRatio, entry.target.dataset.bgColor, entry.target)
      runTransition(entry.target); // run background transition and animation
      setNavItem(entry.target.id); // set menu item active
    }
  });
}

window.addEventListener('DOMContentLoaded', function() {
  replaceUrlForSPA();
  
  const observer = new IntersectionObserver(intersectionObserverCallback, {
    threshold: [0.5]
  });
  $All('.contents').forEach(el => observer.observe(el));
  $All('.nav-item').forEach(el => el.addEventListener('click', _ => {
    setNavItem(el.dataset.nav);
    window._sectionSwitching = true;
    setTimeout(_ => window._sectionSwitching = false, 500);
  }));

  // AOS.init({mirror: true});
  AOS.init({ duration: 1200, delay: 80, mirror: true });
});
