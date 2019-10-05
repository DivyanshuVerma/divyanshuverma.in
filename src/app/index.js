import particlesJS from "particlesJS";
import 'autotrack/lib/plugins/clean-url-tracker';
import 'autotrack/lib/plugins/outbound-link-tracker';

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

var clearIntervalId = 0;

function setUpParticles() {
  if( particlesJS != undefined ) {
    window.clearInterval(clearIntervalId);
    console.log("cleared interval");

    particlesJS("particles-js", {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 500
                }
            },
            opacity: {
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                }
            },
            size: {
                value: 3,
                random: true,
                anim: { enable: false }
            },
            line_linked: { enable: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: false },
                onclick: { enable: false }
            }
        },
        retina_detect: false
    });
  }
}

ready(function() {

  const TRACKING_VERSION = 1;
  const uuid = function b(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) :
        ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
  };

  const sendNavigationTimingMetrics = () => {
    // Only track performance in supporting browsers.
    if (!(window.performance && window.performance.timing)) return;

    // If the window hasn't loaded, run this function after the `load` event.
    if (document.readyState != 'complete') {
      window.addEventListener('load', sendNavigationTimingMetrics);
      return;
    }

    const nt = performance.timing;
    const navStart = nt.navigationStart;

    const responseEnd = Math.round(nt.responseEnd - navStart);
    const domLoaded = Math.round(nt.domContentLoadedEventStart - navStart);
    const windowLoaded = Math.round(nt.loadEventStart - navStart);

    // In some edge cases browsers return very obviously incorrect NT values,
    // e.g. 0, negative, or future times. This validates values before sending.
    const allValuesAreValid = (...values) => {
      return values.every((value) => value > 0 && value < 1e6);
    };

    if (allValuesAreValid(responseEnd, domLoaded, windowLoaded)) {
      ga('send', 'event', {
        eventCategory: 'Navigation Timing',
        eventAction: 'track',
        nonInteraction: true,
        ['response_end_time']: responseEnd,
        ['dom_load_time']: domLoaded,
        ['window_load_time']: windowLoaded,
      });
    }
  };

  window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
  ga('create', 'UA-84668579-1', 'auto');

  ga('require', 'cleanUrlTracker', {
    stripQuery: true,
    trailingSlash: 'remove'
  });

  ga('require', 'outboundLinkTracker', {
    events: ['click', 'auxclick', 'contextmenu'],
    linkSelector: '.out-link'
  });

  ga('set', 'transport', 'beacon');
  ga('send', 'pageview');

  ga('set', 'app_version', TRACKING_VERSION);
  ga('set', 'window_id', uuid());
  sendNavigationTimingMetrics();

  clearIntervalId = window.setInterval(setUpParticles, 200);
});
