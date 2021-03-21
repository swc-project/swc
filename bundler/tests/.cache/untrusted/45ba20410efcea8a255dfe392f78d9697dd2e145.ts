// Loaded from https://dev.jspm.io/npm:ngraph.events@1.2.1/index.dew.js


var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  exports = function eventify(subject) {
    validateSubject(subject);
    var eventsStorage = createEventsStorage(subject);
    subject.on = eventsStorage.on;
    subject.off = eventsStorage.off;
    subject.fire = eventsStorage.fire;
    return subject;
  };

  function createEventsStorage(subject) {
    // Store all event listeners to this hash. Key is event name, value is array
    // of callback records.
    //
    // A callback record consists of callback function and its optional context:
    // { 'eventName' => [{callback: function, ctx: object}] }
    var registeredEvents = Object.create(null);
    return {
      on: function (eventName, callback, ctx) {
        if (typeof callback !== 'function') {
          throw new Error('callback is expected to be a function');
        }

        var handlers = registeredEvents[eventName];

        if (!handlers) {
          handlers = registeredEvents[eventName] = [];
        }

        handlers.push({
          callback: callback,
          ctx: ctx
        });
        return subject;
      },
      off: function (eventName, callback) {
        var wantToRemoveAll = typeof eventName === 'undefined';

        if (wantToRemoveAll) {
          // Killing old events storage should be enough in this case:
          registeredEvents = Object.create(null);
          return subject;
        }

        if (registeredEvents[eventName]) {
          var deleteAllCallbacksForEvent = typeof callback !== 'function';

          if (deleteAllCallbacksForEvent) {
            delete registeredEvents[eventName];
          } else {
            var callbacks = registeredEvents[eventName];

            for (var i = 0; i < callbacks.length; ++i) {
              if (callbacks[i].callback === callback) {
                callbacks.splice(i, 1);
              }
            }
          }
        }

        return subject;
      },
      fire: function (eventName) {
        var callbacks = registeredEvents[eventName];

        if (!callbacks) {
          return subject;
        }

        var fireArguments;

        if (arguments.length > 1) {
          fireArguments = Array.prototype.splice.call(arguments, 1);
        }

        for (var i = 0; i < callbacks.length; ++i) {
          var callbackInfo = callbacks[i];
          callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
        }

        return subject;
      }
    };
  }

  function validateSubject(subject) {
    if (!subject) {
      throw new Error('Eventify cannot use falsy object as events subject');
    }

    var reservedWords = ['on', 'fire', 'off'];

    for (var i = 0; i < reservedWords.length; ++i) {
      if (subject.hasOwnProperty(reservedWords[i])) {
        throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'");
      }
    }
  }

  return exports;
}