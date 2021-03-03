// Loaded from https://dev.jspm.io/npm:immediate@3.0.6/lib/browser.dew.js


var exports = {},
    _dewExec = false;

var _global = typeof self !== "undefined" ? self : global;

export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  var Mutation = _global.MutationObserver || _global.WebKitMutationObserver;
  var scheduleDrain;
  {
    if (Mutation) {
      var called = 0;
      var observer = new Mutation(nextTick);

      var element = _global.document.createTextNode('');

      observer.observe(element, {
        characterData: true
      });

      scheduleDrain = function () {
        element.data = called = ++called % 2;
      };
    } else if (!_global.setImmediate && typeof _global.MessageChannel !== 'undefined') {
      var channel = new _global.MessageChannel();
      channel.port1.onmessage = nextTick;

      scheduleDrain = function () {
        channel.port2.postMessage(0);
      };
    } else if ('document' in _global && 'onreadystatechange' in _global.document.createElement('script')) {
      scheduleDrain = function () {
        // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
        // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
        var scriptEl = _global.document.createElement('script');

        scriptEl.onreadystatechange = function () {
          nextTick();
          scriptEl.onreadystatechange = null;
          scriptEl.parentNode.removeChild(scriptEl);
          scriptEl = null;
        };

        _global.document.documentElement.appendChild(scriptEl);
      };
    } else {
      scheduleDrain = function () {
        setTimeout(nextTick, 0);
      };
    }
  }
  var draining;
  var queue = []; //named nextTick for less confusing stack traces

  function nextTick() {
    draining = true;
    var i, oldQueue;
    var len = queue.length;

    while (len) {
      oldQueue = queue;
      queue = [];
      i = -1;

      while (++i < len) {
        oldQueue[i]();
      }

      len = queue.length;
    }

    draining = false;
  }

  exports = immediate;

  function immediate(task) {
    if (queue.push(task) === 1 && !draining) {
      scheduleDrain();
    }
  }

  return exports;
}