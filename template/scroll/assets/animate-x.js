const DRAW_FUNCTIONS = {
  fadeIn: function(pct) { this.style.opacity = pct; },
  fadeOut: function(pct) { this.style.opacity = 1-pct; },
  slideIn: function(pct) { _draw(this, `translateX(${-100+pct*100}%)`, pct); },
  slideInLeft: function(pct) { _draw(this, `translateX(${-100+pct*100}%)`, pct); },
  slideOutLeft: function(pct) { _draw(this, `translateX(${-1*pct*100}%)`, 1-pct); },
  slideInRight: function(pct) { _draw(this, `translateX(${100 - pct*100}%)`, pct); },
  slideOut: function(pct) { _draw(this, `translateX(${1*pct*100}%)`, 1-pct); },
  slideOutRight: function(pct) { _draw(this, `translateX(${1*pct*100}%)`, 1-pct); },
  slideInDown: function(pct) { _draw(this, `translateY(${-100+pct*100}%)`, pct); },
  slideOutUp: function(pct) { _draw(this, `translateY(${-1*pct*100}%)`, 1-pct); },
  slideInUp: function(pct) { _draw(this, `translateY(${100 - pct*100}%)`, pct); },
  slideOutDown: function(pct) { _draw(this, `translateY(${1*pct*100}%)`, 1-pct); },
  zoomIn: function(pct) { _draw(this, `scale(${pct})`, pct); },
  zoomOut: function(pct) { _draw(this, `scale(${1-pct})`, 1-pct); },
  rotateIn: function(pct) { _draw(this, `rotate(${-180 + pct * 180}deg)`, pct); },
  rotateOut: function(pct) { _draw(this, `rotate(${pct * 180 * -1}deg)`, 1-pct); }
};

function _draw(el, transform, opacity) {
  el.style.transform = transform; 
  el.style.opacity = opacity;
}

const TIMING_FUNCTIONS = {
  linear: n => n,
  easeIn: n => Math.pow(n, 1.675),
  easeOut: n => 1 - Math.pow(1 - n, 1.675),
  easeInOut: n => .5*(Math.sin((n - .5)*Math.PI) + 1),
  inExpo: n => 0 == n ? 0 : Math.pow(1024, n - 1),
  outExpo: n => 1 == n ? n : 1 - Math.pow(2, -10 * n),
  inOutExpo: n => {
    if (0 == n) return 0;
    if (1 == n) return 1;
    if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
    return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
  },
  bounceEaseOut: function(n) {
    function bounce(n) {
      for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (n >= (7 - 4 * a) / 11) {
          return -Math.pow((11 - 6 * a - 11 * n) / 4, 2) + Math.pow(b, 2);
        }
      }
    }
    return 1 - bounce(1 - n);
  }
};

function _cssAnimate(el, draw, duration, timing) {

  const htmlEl = document.documentElement;
  if (timing) {
    const timingFunc = timing.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
    htmlEl.style.setProperty('--animation-timing-function', timingFunc);
  }
  if (duration) {
    htmlEl.style.setProperty('--animation-duration', duration + 'ms');
  }
  const drawClass = draw.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();

  const durationProp = getComputedStyle(document.documentElement)
    .getPropertyValue('--animation-duration') || '250ms';
  if (drawClass.match(/^expand-/)) { // width / height animation by pushing contents
    el.className.split(' ').filter(klass => klass.match(/^x-expand/))
      .forEach(klass => el.classList.remove(klass));
    return new Promise(resolve => {
      el.classList.add(`x-${drawClass}`, 'x-hidden');
      setTimeout(_ => resolve(), 100);
    }).then(_ => new Promise(resolve => {
      el.classList.remove('x-hidden');
      setTimeout(_ => resolve(), parseInt(durationProp));
    }));
  } else {
    el.className.split(' ').filter(klass => klass.match(/^x-expand/))
      .forEach(klass => el.classList.remove(klass));
    el.classList.add(`x-${drawClass}`);
    return new Promise(resolve => {
      setTimeout(_ => {
        el.classList.remove(`x-${drawClass}`);
        resolve();
      }, parseInt(durationProp));
    });
  }
}

function _jsAnimate(el, draw, duration, timing) {
  // save parent position, then set parent position relative, height as it is
  duration = duration || 250;
  const drawFn = draw || DRAW_FUNCTIONS.fadeIn;
  const timingFn = timing || TIMING_FUNCTIONS.easeInOut;

  const start = performance.now();
  return new Promise(function(resolve) {
    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      (timeFraction > 1) && (timeFraction = 1);
      drawFn.bind(el)(timingFn(timeFraction), timeFraction);
      timeFraction < 1 ? requestAnimationFrame(animate) : resolve(true);
    });
  });
}

// obj. el property anmiation variables
// e.g. transform: {expr: 'translateX({{V}}px)', from: 0, to: 100}
function _getDrawFn(props) {
  return function(timingPct, pct) {
    for (let key in props) {
      const {el, expr, from, to} = props[key];
      const v = from + timingPct*to;
      const t = from + pct*to;
      if (expr) {
        el.style[key] = expr.replace(/{{V}}/g, v).replace(/{{T}}/g, t);
      } else {
        el.style[key] = v;
      }
    }
  }
}

export function animate(el, draw='fadeIn', duration, timing) {
  if (typeof draw === 'string') {
    return _cssAnimate(el, draw, duration, timing);
  } else if (typeof draw === 'object') {
    return _cssAnimate(el, _getDrawFn(draw), duration, timing);
  } else if (typeof draw === 'function') {
    return _jsAnimate(el, draw, duration, timing);
  }
}
animate.TIMING_FUNCTIONS = TIMING_FUNCTIONS;
animate.DRAW_FUNCTIONS = DRAW_FUNCTIONS;

window.animate = animate;
