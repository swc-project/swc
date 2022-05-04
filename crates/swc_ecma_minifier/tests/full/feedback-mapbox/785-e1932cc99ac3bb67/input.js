(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [785],
    {
        /***/ 840: /***/ function (module, exports, __webpack_require__) {
            var __WEBPACK_AMD_DEFINE_RESULT__;
            /*! Hammer.JS - v2.0.7 - 2016-04-22
             * http://hammerjs.github.io/
             *
             * Copyright (c) 2016 Jorik Tangelder;
             * Licensed under the MIT license */
            (function (window, document, exportName, undefined) {
                "use strict";

                var VENDOR_PREFIXES = ["", "webkit", "Moz", "MS", "ms", "o"];
                var TEST_ELEMENT = document.createElement("div");

                var TYPE_FUNCTION = "function";

                var round = Math.round;
                var abs = Math.abs;
                var now = Date.now;

                /**
                 * set a timeout with a given scope
                 * @param {Function} fn
                 * @param {Number} timeout
                 * @param {Object} context
                 * @returns {number}
                 */
                function setTimeoutContext(fn, timeout, context) {
                    return setTimeout(bindFn(fn, context), timeout);
                }

                /**
                 * if the argument is an array, we want to execute the fn on each entry
                 * if it aint an array we don't want to do a thing.
                 * this is used by all the methods that accept a single and array argument.
                 * @param {*|Array} arg
                 * @param {String} fn
                 * @param {Object} [context]
                 * @returns {Boolean}
                 */
                function invokeArrayArg(arg, fn, context) {
                    if (Array.isArray(arg)) {
                        each(arg, context[fn], context);
                        return true;
                    }
                    return false;
                }

                /**
                 * walk objects and arrays
                 * @param {Object} obj
                 * @param {Function} iterator
                 * @param {Object} context
                 */
                function each(obj, iterator, context) {
                    var i;

                    if (!obj) {
                        return;
                    }

                    if (obj.forEach) {
                        obj.forEach(iterator, context);
                    } else if (obj.length !== undefined) {
                        i = 0;
                        while (i < obj.length) {
                            iterator.call(context, obj[i], i, obj);
                            i++;
                        }
                    } else {
                        for (i in obj) {
                            obj.hasOwnProperty(i) &&
                                iterator.call(context, obj[i], i, obj);
                        }
                    }
                }

                /**
                 * wrap a method with a deprecation warning and stack trace
                 * @param {Function} method
                 * @param {String} name
                 * @param {String} message
                 * @returns {Function} A new function wrapping the supplied method.
                 */
                function deprecate(method, name, message) {
                    var deprecationMessage =
                        "DEPRECATED METHOD: " +
                        name +
                        "\n" +
                        message +
                        " AT \n";
                    return function () {
                        var e = new Error("get-stack-trace");
                        var stack =
                            e && e.stack
                                ? e.stack
                                      .replace(/^[^\(]+?[\n$]/gm, "")
                                      .replace(/^\s+at\s+/gm, "")
                                      .replace(
                                          /^Object.<anonymous>\s*\(/gm,
                                          "{anonymous}()@"
                                      )
                                : "Unknown Stack Trace";

                        var log =
                            window.console &&
                            (window.console.warn || window.console.log);
                        if (log) {
                            log.call(window.console, deprecationMessage, stack);
                        }
                        return method.apply(this, arguments);
                    };
                }

                /**
                 * extend object.
                 * means that properties in dest will be overwritten by the ones in src.
                 * @param {Object} target
                 * @param {...Object} objects_to_assign
                 * @returns {Object} target
                 */
                var assign;
                if (typeof Object.assign !== "function") {
                    assign = function assign(target) {
                        if (target === undefined || target === null) {
                            throw new TypeError(
                                "Cannot convert undefined or null to object"
                            );
                        }

                        var output = Object(target);
                        for (var index = 1; index < arguments.length; index++) {
                            var source = arguments[index];
                            if (source !== undefined && source !== null) {
                                for (var nextKey in source) {
                                    if (source.hasOwnProperty(nextKey)) {
                                        output[nextKey] = source[nextKey];
                                    }
                                }
                            }
                        }
                        return output;
                    };
                } else {
                    assign = Object.assign;
                }

                /**
                 * extend object.
                 * means that properties in dest will be overwritten by the ones in src.
                 * @param {Object} dest
                 * @param {Object} src
                 * @param {Boolean} [merge=false]
                 * @returns {Object} dest
                 */
                var extend = deprecate(
                    function extend(dest, src, merge) {
                        var keys = Object.keys(src);
                        var i = 0;
                        while (i < keys.length) {
                            if (
                                !merge ||
                                (merge && dest[keys[i]] === undefined)
                            ) {
                                dest[keys[i]] = src[keys[i]];
                            }
                            i++;
                        }
                        return dest;
                    },
                    "extend",
                    "Use `assign`."
                );

                /**
                 * merge the values from src in the dest.
                 * means that properties that exist in dest will not be overwritten by src
                 * @param {Object} dest
                 * @param {Object} src
                 * @returns {Object} dest
                 */
                var merge = deprecate(
                    function merge(dest, src) {
                        return extend(dest, src, true);
                    },
                    "merge",
                    "Use `assign`."
                );

                /**
                 * simple class inheritance
                 * @param {Function} child
                 * @param {Function} base
                 * @param {Object} [properties]
                 */
                function inherit(child, base, properties) {
                    var baseP = base.prototype,
                        childP;

                    childP = child.prototype = Object.create(baseP);
                    childP.constructor = child;
                    childP._super = baseP;

                    if (properties) {
                        assign(childP, properties);
                    }
                }

                /**
                 * simple function bind
                 * @param {Function} fn
                 * @param {Object} context
                 * @returns {Function}
                 */
                function bindFn(fn, context) {
                    return function boundFn() {
                        return fn.apply(context, arguments);
                    };
                }

                /**
                 * let a boolean value also be a function that must return a boolean
                 * this first item in args will be used as the context
                 * @param {Boolean|Function} val
                 * @param {Array} [args]
                 * @returns {Boolean}
                 */
                function boolOrFn(val, args) {
                    if (typeof val == TYPE_FUNCTION) {
                        return val.apply(
                            args ? args[0] || undefined : undefined,
                            args
                        );
                    }
                    return val;
                }

                /**
                 * use the val2 when val1 is undefined
                 * @param {*} val1
                 * @param {*} val2
                 * @returns {*}
                 */
                function ifUndefined(val1, val2) {
                    return val1 === undefined ? val2 : val1;
                }

                /**
                 * addEventListener with multiple events at once
                 * @param {EventTarget} target
                 * @param {String} types
                 * @param {Function} handler
                 */
                function addEventListeners(target, types, handler) {
                    each(splitStr(types), function (type) {
                        target.addEventListener(type, handler, false);
                    });
                }

                /**
                 * removeEventListener with multiple events at once
                 * @param {EventTarget} target
                 * @param {String} types
                 * @param {Function} handler
                 */
                function removeEventListeners(target, types, handler) {
                    each(splitStr(types), function (type) {
                        target.removeEventListener(type, handler, false);
                    });
                }

                /**
                 * find if a node is in the given parent
                 * @method hasParent
                 * @param {HTMLElement} node
                 * @param {HTMLElement} parent
                 * @return {Boolean} found
                 */
                function hasParent(node, parent) {
                    while (node) {
                        if (node == parent) {
                            return true;
                        }
                        node = node.parentNode;
                    }
                    return false;
                }

                /**
                 * small indexOf wrapper
                 * @param {String} str
                 * @param {String} find
                 * @returns {Boolean} found
                 */
                function inStr(str, find) {
                    return str.indexOf(find) > -1;
                }

                /**
                 * split string on whitespace
                 * @param {String} str
                 * @returns {Array} words
                 */
                function splitStr(str) {
                    return str.trim().split(/\s+/g);
                }

                /**
                 * find if a array contains the object using indexOf or a simple polyFill
                 * @param {Array} src
                 * @param {String} find
                 * @param {String} [findByKey]
                 * @return {Boolean|Number} false when not found, or the index
                 */
                function inArray(src, find, findByKey) {
                    if (src.indexOf && !findByKey) {
                        return src.indexOf(find);
                    } else {
                        var i = 0;
                        while (i < src.length) {
                            if (
                                (findByKey && src[i][findByKey] == find) ||
                                (!findByKey && src[i] === find)
                            ) {
                                return i;
                            }
                            i++;
                        }
                        return -1;
                    }
                }

                /**
                 * convert array-like objects to real arrays
                 * @param {Object} obj
                 * @returns {Array}
                 */
                function toArray(obj) {
                    return Array.prototype.slice.call(obj, 0);
                }

                /**
                 * unique array with objects based on a key (like 'id') or just by the array's value
                 * @param {Array} src [{id:1},{id:2},{id:1}]
                 * @param {String} [key]
                 * @param {Boolean} [sort=False]
                 * @returns {Array} [{id:1},{id:2}]
                 */
                function uniqueArray(src, key, sort) {
                    var results = [];
                    var values = [];
                    var i = 0;

                    while (i < src.length) {
                        var val = key ? src[i][key] : src[i];
                        if (inArray(values, val) < 0) {
                            results.push(src[i]);
                        }
                        values[i] = val;
                        i++;
                    }

                    if (sort) {
                        if (!key) {
                            results = results.sort();
                        } else {
                            results = results.sort(function sortUniqueArray(
                                a,
                                b
                            ) {
                                return a[key] > b[key];
                            });
                        }
                    }

                    return results;
                }

                /**
                 * get the prefixed property
                 * @param {Object} obj
                 * @param {String} property
                 * @returns {String|Undefined} prefixed
                 */
                function prefixed(obj, property) {
                    var prefix, prop;
                    var camelProp =
                        property[0].toUpperCase() + property.slice(1);

                    var i = 0;
                    while (i < VENDOR_PREFIXES.length) {
                        prefix = VENDOR_PREFIXES[i];
                        prop = prefix ? prefix + camelProp : property;

                        if (prop in obj) {
                            return prop;
                        }
                        i++;
                    }
                    return undefined;
                }

                /**
                 * get a unique id
                 * @returns {number} uniqueId
                 */
                var _uniqueId = 1;
                function uniqueId() {
                    return _uniqueId++;
                }

                /**
                 * get the window object of an element
                 * @param {HTMLElement} element
                 * @returns {DocumentView|Window}
                 */
                function getWindowForElement(element) {
                    var doc = element.ownerDocument || element;
                    return doc.defaultView || doc.parentWindow || window;
                }

                var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

                var SUPPORT_TOUCH = "ontouchstart" in window;
                var SUPPORT_POINTER_EVENTS =
                    prefixed(window, "PointerEvent") !== undefined;
                var SUPPORT_ONLY_TOUCH =
                    SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

                var INPUT_TYPE_TOUCH = "touch";
                var INPUT_TYPE_PEN = "pen";
                var INPUT_TYPE_MOUSE = "mouse";
                var INPUT_TYPE_KINECT = "kinect";

                var COMPUTE_INTERVAL = 25;

                var INPUT_START = 1;
                var INPUT_MOVE = 2;
                var INPUT_END = 4;
                var INPUT_CANCEL = 8;

                var DIRECTION_NONE = 1;
                var DIRECTION_LEFT = 2;
                var DIRECTION_RIGHT = 4;
                var DIRECTION_UP = 8;
                var DIRECTION_DOWN = 16;

                var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
                var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
                var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

                var PROPS_XY = ["x", "y"];
                var PROPS_CLIENT_XY = ["clientX", "clientY"];

                /**
                 * create new input type manager
                 * @param {Manager} manager
                 * @param {Function} callback
                 * @returns {Input}
                 * @constructor
                 */
                function Input(manager, callback) {
                    var self = this;
                    this.manager = manager;
                    this.callback = callback;
                    this.element = manager.element;
                    this.target = manager.options.inputTarget;

                    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
                    // so when disabled the input events are completely bypassed.
                    this.domHandler = function (ev) {
                        if (boolOrFn(manager.options.enable, [manager])) {
                            self.handler(ev);
                        }
                    };

                    this.init();
                }

                Input.prototype = {
                    /**
                     * should handle the inputEvent data and trigger the callback
                     * @virtual
                     */
                    handler: function () {},

                    /**
                     * bind the events
                     */
                    init: function () {
                        this.evEl &&
                            addEventListeners(
                                this.element,
                                this.evEl,
                                this.domHandler
                            );
                        this.evTarget &&
                            addEventListeners(
                                this.target,
                                this.evTarget,
                                this.domHandler
                            );
                        this.evWin &&
                            addEventListeners(
                                getWindowForElement(this.element),
                                this.evWin,
                                this.domHandler
                            );
                    },

                    /**
                     * unbind the events
                     */
                    destroy: function () {
                        this.evEl &&
                            removeEventListeners(
                                this.element,
                                this.evEl,
                                this.domHandler
                            );
                        this.evTarget &&
                            removeEventListeners(
                                this.target,
                                this.evTarget,
                                this.domHandler
                            );
                        this.evWin &&
                            removeEventListeners(
                                getWindowForElement(this.element),
                                this.evWin,
                                this.domHandler
                            );
                    },
                };

                /**
                 * create new input type manager
                 * called by the Manager constructor
                 * @param {Hammer} manager
                 * @returns {Input}
                 */
                function createInputInstance(manager) {
                    var Type;
                    var inputClass = manager.options.inputClass;

                    if (inputClass) {
                        Type = inputClass;
                    } else if (SUPPORT_POINTER_EVENTS) {
                        Type = PointerEventInput;
                    } else if (SUPPORT_ONLY_TOUCH) {
                        Type = TouchInput;
                    } else if (!SUPPORT_TOUCH) {
                        Type = MouseInput;
                    } else {
                        Type = TouchMouseInput;
                    }
                    return new Type(manager, inputHandler);
                }

                /**
                 * handle input events
                 * @param {Manager} manager
                 * @param {String} eventType
                 * @param {Object} input
                 */
                function inputHandler(manager, eventType, input) {
                    var pointersLen = input.pointers.length;
                    var changedPointersLen = input.changedPointers.length;
                    var isFirst =
                        eventType & INPUT_START &&
                        pointersLen - changedPointersLen === 0;
                    var isFinal =
                        eventType & (INPUT_END | INPUT_CANCEL) &&
                        pointersLen - changedPointersLen === 0;

                    input.isFirst = !!isFirst;
                    input.isFinal = !!isFinal;

                    if (isFirst) {
                        manager.session = {};
                    }

                    // source event is the normalized value of the domEvents
                    // like 'touchstart, mouseup, pointerdown'
                    input.eventType = eventType;

                    // compute scale, rotation etc
                    computeInputData(manager, input);

                    // emit secret event
                    manager.emit("hammer.input", input);

                    manager.recognize(input);
                    manager.session.prevInput = input;
                }

                /**
                 * extend the data with some usable properties like scale, rotate, velocity etc
                 * @param {Object} manager
                 * @param {Object} input
                 */
                function computeInputData(manager, input) {
                    var session = manager.session;
                    var pointers = input.pointers;
                    var pointersLength = pointers.length;

                    // store the first input to calculate the distance and direction
                    if (!session.firstInput) {
                        session.firstInput = simpleCloneInputData(input);
                    }

                    // to compute scale and rotation we need to store the multiple touches
                    if (pointersLength > 1 && !session.firstMultiple) {
                        session.firstMultiple = simpleCloneInputData(input);
                    } else if (pointersLength === 1) {
                        session.firstMultiple = false;
                    }

                    var firstInput = session.firstInput;
                    var firstMultiple = session.firstMultiple;
                    var offsetCenter = firstMultiple
                        ? firstMultiple.center
                        : firstInput.center;

                    var center = (input.center = getCenter(pointers));
                    input.timeStamp = now();
                    input.deltaTime = input.timeStamp - firstInput.timeStamp;

                    input.angle = getAngle(offsetCenter, center);
                    input.distance = getDistance(offsetCenter, center);

                    computeDeltaXY(session, input);
                    input.offsetDirection = getDirection(
                        input.deltaX,
                        input.deltaY
                    );

                    var overallVelocity = getVelocity(
                        input.deltaTime,
                        input.deltaX,
                        input.deltaY
                    );
                    input.overallVelocityX = overallVelocity.x;
                    input.overallVelocityY = overallVelocity.y;
                    input.overallVelocity =
                        abs(overallVelocity.x) > abs(overallVelocity.y)
                            ? overallVelocity.x
                            : overallVelocity.y;

                    input.scale = firstMultiple
                        ? getScale(firstMultiple.pointers, pointers)
                        : 1;
                    input.rotation = firstMultiple
                        ? getRotation(firstMultiple.pointers, pointers)
                        : 0;

                    input.maxPointers = !session.prevInput
                        ? input.pointers.length
                        : input.pointers.length > session.prevInput.maxPointers
                        ? input.pointers.length
                        : session.prevInput.maxPointers;

                    computeIntervalInputData(session, input);

                    // find the correct target
                    var target = manager.element;
                    if (hasParent(input.srcEvent.target, target)) {
                        target = input.srcEvent.target;
                    }
                    input.target = target;
                }

                function computeDeltaXY(session, input) {
                    var center = input.center;
                    var offset = session.offsetDelta || {};
                    var prevDelta = session.prevDelta || {};
                    var prevInput = session.prevInput || {};

                    if (
                        input.eventType === INPUT_START ||
                        prevInput.eventType === INPUT_END
                    ) {
                        prevDelta = session.prevDelta = {
                            x: prevInput.deltaX || 0,
                            y: prevInput.deltaY || 0,
                        };

                        offset = session.offsetDelta = {
                            x: center.x,
                            y: center.y,
                        };
                    }

                    input.deltaX = prevDelta.x + (center.x - offset.x);
                    input.deltaY = prevDelta.y + (center.y - offset.y);
                }

                /**
                 * velocity is calculated every x ms
                 * @param {Object} session
                 * @param {Object} input
                 */
                function computeIntervalInputData(session, input) {
                    var last = session.lastInterval || input,
                        deltaTime = input.timeStamp - last.timeStamp,
                        velocity,
                        velocityX,
                        velocityY,
                        direction;

                    if (
                        input.eventType != INPUT_CANCEL &&
                        (deltaTime > COMPUTE_INTERVAL ||
                            last.velocity === undefined)
                    ) {
                        var deltaX = input.deltaX - last.deltaX;
                        var deltaY = input.deltaY - last.deltaY;

                        var v = getVelocity(deltaTime, deltaX, deltaY);
                        velocityX = v.x;
                        velocityY = v.y;
                        velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
                        direction = getDirection(deltaX, deltaY);

                        session.lastInterval = input;
                    } else {
                        // use latest velocity info if it doesn't overtake a minimum period
                        velocity = last.velocity;
                        velocityX = last.velocityX;
                        velocityY = last.velocityY;
                        direction = last.direction;
                    }

                    input.velocity = velocity;
                    input.velocityX = velocityX;
                    input.velocityY = velocityY;
                    input.direction = direction;
                }

                /**
                 * create a simple clone from the input used for storage of firstInput and firstMultiple
                 * @param {Object} input
                 * @returns {Object} clonedInputData
                 */
                function simpleCloneInputData(input) {
                    // make a simple copy of the pointers because we will get a reference if we don't
                    // we only need clientXY for the calculations
                    var pointers = [];
                    var i = 0;
                    while (i < input.pointers.length) {
                        pointers[i] = {
                            clientX: round(input.pointers[i].clientX),
                            clientY: round(input.pointers[i].clientY),
                        };
                        i++;
                    }

                    return {
                        timeStamp: now(),
                        pointers: pointers,
                        center: getCenter(pointers),
                        deltaX: input.deltaX,
                        deltaY: input.deltaY,
                    };
                }

                /**
                 * get the center of all the pointers
                 * @param {Array} pointers
                 * @return {Object} center contains `x` and `y` properties
                 */
                function getCenter(pointers) {
                    var pointersLength = pointers.length;

                    // no need to loop when only one touch
                    if (pointersLength === 1) {
                        return {
                            x: round(pointers[0].clientX),
                            y: round(pointers[0].clientY),
                        };
                    }

                    var x = 0,
                        y = 0,
                        i = 0;
                    while (i < pointersLength) {
                        x += pointers[i].clientX;
                        y += pointers[i].clientY;
                        i++;
                    }

                    return {
                        x: round(x / pointersLength),
                        y: round(y / pointersLength),
                    };
                }

                /**
                 * calculate the velocity between two points. unit is in px per ms.
                 * @param {Number} deltaTime
                 * @param {Number} x
                 * @param {Number} y
                 * @return {Object} velocity `x` and `y`
                 */
                function getVelocity(deltaTime, x, y) {
                    return {
                        x: x / deltaTime || 0,
                        y: y / deltaTime || 0,
                    };
                }

                /**
                 * get the direction between two points
                 * @param {Number} x
                 * @param {Number} y
                 * @return {Number} direction
                 */
                function getDirection(x, y) {
                    if (x === y) {
                        return DIRECTION_NONE;
                    }

                    if (abs(x) >= abs(y)) {
                        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
                    }
                    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
                }

                /**
                 * calculate the absolute distance between two points
                 * @param {Object} p1 {x, y}
                 * @param {Object} p2 {x, y}
                 * @param {Array} [props] containing x and y keys
                 * @return {Number} distance
                 */
                function getDistance(p1, p2, props) {
                    if (!props) {
                        props = PROPS_XY;
                    }
                    var x = p2[props[0]] - p1[props[0]],
                        y = p2[props[1]] - p1[props[1]];

                    return Math.sqrt(x * x + y * y);
                }

                /**
                 * calculate the angle between two coordinates
                 * @param {Object} p1
                 * @param {Object} p2
                 * @param {Array} [props] containing x and y keys
                 * @return {Number} angle
                 */
                function getAngle(p1, p2, props) {
                    if (!props) {
                        props = PROPS_XY;
                    }
                    var x = p2[props[0]] - p1[props[0]],
                        y = p2[props[1]] - p1[props[1]];
                    return (Math.atan2(y, x) * 180) / Math.PI;
                }

                /**
                 * calculate the rotation degrees between two pointersets
                 * @param {Array} start array of pointers
                 * @param {Array} end array of pointers
                 * @return {Number} rotation
                 */
                function getRotation(start, end) {
                    return (
                        getAngle(end[1], end[0], PROPS_CLIENT_XY) +
                        getAngle(start[1], start[0], PROPS_CLIENT_XY)
                    );
                }

                /**
                 * calculate the scale factor between two pointersets
                 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
                 * @param {Array} start array of pointers
                 * @param {Array} end array of pointers
                 * @return {Number} scale
                 */
                function getScale(start, end) {
                    return (
                        getDistance(end[0], end[1], PROPS_CLIENT_XY) /
                        getDistance(start[0], start[1], PROPS_CLIENT_XY)
                    );
                }

                var MOUSE_INPUT_MAP = {
                    mousedown: INPUT_START,
                    mousemove: INPUT_MOVE,
                    mouseup: INPUT_END,
                };

                var MOUSE_ELEMENT_EVENTS = "mousedown";
                var MOUSE_WINDOW_EVENTS = "mousemove mouseup";

                /**
                 * Mouse events input
                 * @constructor
                 * @extends Input
                 */
                function MouseInput() {
                    this.evEl = MOUSE_ELEMENT_EVENTS;
                    this.evWin = MOUSE_WINDOW_EVENTS;

                    this.pressed = false; // mousedown state

                    Input.apply(this, arguments);
                }

                inherit(MouseInput, Input, {
                    /**
                     * handle mouse events
                     * @param {Object} ev
                     */
                    handler: function MEhandler(ev) {
                        var eventType = MOUSE_INPUT_MAP[ev.type];

                        // on start we want to have the left mouse button down
                        if (eventType & INPUT_START && ev.button === 0) {
                            this.pressed = true;
                        }

                        if (eventType & INPUT_MOVE && ev.which !== 1) {
                            eventType = INPUT_END;
                        }

                        // mouse must be down
                        if (!this.pressed) {
                            return;
                        }

                        if (eventType & INPUT_END) {
                            this.pressed = false;
                        }

                        this.callback(this.manager, eventType, {
                            pointers: [ev],
                            changedPointers: [ev],
                            pointerType: INPUT_TYPE_MOUSE,
                            srcEvent: ev,
                        });
                    },
                });

                var POINTER_INPUT_MAP = {
                    pointerdown: INPUT_START,
                    pointermove: INPUT_MOVE,
                    pointerup: INPUT_END,
                    pointercancel: INPUT_CANCEL,
                    pointerout: INPUT_CANCEL,
                };

                // in IE10 the pointer types is defined as an enum
                var IE10_POINTER_TYPE_ENUM = {
                    2: INPUT_TYPE_TOUCH,
                    3: INPUT_TYPE_PEN,
                    4: INPUT_TYPE_MOUSE,
                    5: INPUT_TYPE_KINECT, // see https://twitter.com/jacobrossi/status/480596438489890816
                };

                var POINTER_ELEMENT_EVENTS = "pointerdown";
                var POINTER_WINDOW_EVENTS =
                    "pointermove pointerup pointercancel";

                // IE10 has prefixed support, and case-sensitive
                if (window.MSPointerEvent && !window.PointerEvent) {
                    POINTER_ELEMENT_EVENTS = "MSPointerDown";
                    POINTER_WINDOW_EVENTS =
                        "MSPointerMove MSPointerUp MSPointerCancel";
                }

                /**
                 * Pointer events input
                 * @constructor
                 * @extends Input
                 */
                function PointerEventInput() {
                    this.evEl = POINTER_ELEMENT_EVENTS;
                    this.evWin = POINTER_WINDOW_EVENTS;

                    Input.apply(this, arguments);

                    this.store = this.manager.session.pointerEvents = [];
                }

                inherit(PointerEventInput, Input, {
                    /**
                     * handle mouse events
                     * @param {Object} ev
                     */
                    handler: function PEhandler(ev) {
                        var store = this.store;
                        var removePointer = false;

                        var eventTypeNormalized = ev.type
                            .toLowerCase()
                            .replace("ms", "");
                        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
                        var pointerType =
                            IE10_POINTER_TYPE_ENUM[ev.pointerType] ||
                            ev.pointerType;

                        var isTouch = pointerType == INPUT_TYPE_TOUCH;

                        // get index of the event in the store
                        var storeIndex = inArray(
                            store,
                            ev.pointerId,
                            "pointerId"
                        );

                        // start and mouse must be down
                        if (
                            eventType & INPUT_START &&
                            (ev.button === 0 || isTouch)
                        ) {
                            if (storeIndex < 0) {
                                store.push(ev);
                                storeIndex = store.length - 1;
                            }
                        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
                            removePointer = true;
                        }

                        // it not found, so the pointer hasn't been down (so it's probably a hover)
                        if (storeIndex < 0) {
                            return;
                        }

                        // update the event in the store
                        store[storeIndex] = ev;

                        this.callback(this.manager, eventType, {
                            pointers: store,
                            changedPointers: [ev],
                            pointerType: pointerType,
                            srcEvent: ev,
                        });

                        if (removePointer) {
                            // remove from the store
                            store.splice(storeIndex, 1);
                        }
                    },
                });

                var SINGLE_TOUCH_INPUT_MAP = {
                    touchstart: INPUT_START,
                    touchmove: INPUT_MOVE,
                    touchend: INPUT_END,
                    touchcancel: INPUT_CANCEL,
                };

                var SINGLE_TOUCH_TARGET_EVENTS = "touchstart";
                var SINGLE_TOUCH_WINDOW_EVENTS =
                    "touchstart touchmove touchend touchcancel";

                /**
                 * Touch events input
                 * @constructor
                 * @extends Input
                 */
                function SingleTouchInput() {
                    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
                    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
                    this.started = false;

                    Input.apply(this, arguments);
                }

                inherit(SingleTouchInput, Input, {
                    handler: function TEhandler(ev) {
                        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

                        // should we handle the touch events?
                        if (type === INPUT_START) {
                            this.started = true;
                        }

                        if (!this.started) {
                            return;
                        }

                        var touches = normalizeSingleTouches.call(
                            this,
                            ev,
                            type
                        );

                        // when done, reset the started state
                        if (
                            type & (INPUT_END | INPUT_CANCEL) &&
                            touches[0].length - touches[1].length === 0
                        ) {
                            this.started = false;
                        }

                        this.callback(this.manager, type, {
                            pointers: touches[0],
                            changedPointers: touches[1],
                            pointerType: INPUT_TYPE_TOUCH,
                            srcEvent: ev,
                        });
                    },
                });

                /**
                 * @this {TouchInput}
                 * @param {Object} ev
                 * @param {Number} type flag
                 * @returns {undefined|Array} [all, changed]
                 */
                function normalizeSingleTouches(ev, type) {
                    var all = toArray(ev.touches);
                    var changed = toArray(ev.changedTouches);

                    if (type & (INPUT_END | INPUT_CANCEL)) {
                        all = uniqueArray(
                            all.concat(changed),
                            "identifier",
                            true
                        );
                    }

                    return [all, changed];
                }

                var TOUCH_INPUT_MAP = {
                    touchstart: INPUT_START,
                    touchmove: INPUT_MOVE,
                    touchend: INPUT_END,
                    touchcancel: INPUT_CANCEL,
                };

                var TOUCH_TARGET_EVENTS =
                    "touchstart touchmove touchend touchcancel";

                /**
                 * Multi-user touch events input
                 * @constructor
                 * @extends Input
                 */
                function TouchInput() {
                    this.evTarget = TOUCH_TARGET_EVENTS;
                    this.targetIds = {};

                    Input.apply(this, arguments);
                }

                inherit(TouchInput, Input, {
                    handler: function MTEhandler(ev) {
                        var type = TOUCH_INPUT_MAP[ev.type];
                        var touches = getTouches.call(this, ev, type);
                        if (!touches) {
                            return;
                        }

                        this.callback(this.manager, type, {
                            pointers: touches[0],
                            changedPointers: touches[1],
                            pointerType: INPUT_TYPE_TOUCH,
                            srcEvent: ev,
                        });
                    },
                });

                /**
                 * @this {TouchInput}
                 * @param {Object} ev
                 * @param {Number} type flag
                 * @returns {undefined|Array} [all, changed]
                 */
                function getTouches(ev, type) {
                    var allTouches = toArray(ev.touches);
                    var targetIds = this.targetIds;

                    // when there is only one touch, the process can be simplified
                    if (
                        type & (INPUT_START | INPUT_MOVE) &&
                        allTouches.length === 1
                    ) {
                        targetIds[allTouches[0].identifier] = true;
                        return [allTouches, allTouches];
                    }

                    var i,
                        targetTouches,
                        changedTouches = toArray(ev.changedTouches),
                        changedTargetTouches = [],
                        target = this.target;

                    // get target touches from touches
                    targetTouches = allTouches.filter(function (touch) {
                        return hasParent(touch.target, target);
                    });

                    // collect touches
                    if (type === INPUT_START) {
                        i = 0;
                        while (i < targetTouches.length) {
                            targetIds[targetTouches[i].identifier] = true;
                            i++;
                        }
                    }

                    // filter changed touches to only contain touches that exist in the collected target ids
                    i = 0;
                    while (i < changedTouches.length) {
                        if (targetIds[changedTouches[i].identifier]) {
                            changedTargetTouches.push(changedTouches[i]);
                        }

                        // cleanup removed touches
                        if (type & (INPUT_END | INPUT_CANCEL)) {
                            delete targetIds[changedTouches[i].identifier];
                        }
                        i++;
                    }

                    if (!changedTargetTouches.length) {
                        return;
                    }

                    return [
                        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
                        uniqueArray(
                            targetTouches.concat(changedTargetTouches),
                            "identifier",
                            true
                        ),
                        changedTargetTouches,
                    ];
                }

                /**
                 * Combined touch and mouse input
                 *
                 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
                 * This because touch devices also emit mouse events while doing a touch.
                 *
                 * @constructor
                 * @extends Input
                 */

                var DEDUP_TIMEOUT = 2500;
                var DEDUP_DISTANCE = 25;

                function TouchMouseInput() {
                    Input.apply(this, arguments);

                    var handler = bindFn(this.handler, this);
                    this.touch = new TouchInput(this.manager, handler);
                    this.mouse = new MouseInput(this.manager, handler);

                    this.primaryTouch = null;
                    this.lastTouches = [];
                }

                inherit(TouchMouseInput, Input, {
                    /**
                     * handle mouse and touch events
                     * @param {Hammer} manager
                     * @param {String} inputEvent
                     * @param {Object} inputData
                     */
                    handler: function TMEhandler(
                        manager,
                        inputEvent,
                        inputData
                    ) {
                        var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH,
                            isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;

                        if (
                            isMouse &&
                            inputData.sourceCapabilities &&
                            inputData.sourceCapabilities.firesTouchEvents
                        ) {
                            return;
                        }

                        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
                        if (isTouch) {
                            recordTouches.call(this, inputEvent, inputData);
                        } else if (
                            isMouse &&
                            isSyntheticEvent.call(this, inputData)
                        ) {
                            return;
                        }

                        this.callback(manager, inputEvent, inputData);
                    },

                    /**
                     * remove the event listeners
                     */
                    destroy: function destroy() {
                        this.touch.destroy();
                        this.mouse.destroy();
                    },
                });

                function recordTouches(eventType, eventData) {
                    if (eventType & INPUT_START) {
                        this.primaryTouch =
                            eventData.changedPointers[0].identifier;
                        setLastTouch.call(this, eventData);
                    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
                        setLastTouch.call(this, eventData);
                    }
                }

                function setLastTouch(eventData) {
                    var touch = eventData.changedPointers[0];

                    if (touch.identifier === this.primaryTouch) {
                        var lastTouch = { x: touch.clientX, y: touch.clientY };
                        this.lastTouches.push(lastTouch);
                        var lts = this.lastTouches;
                        var removeLastTouch = function () {
                            var i = lts.indexOf(lastTouch);
                            if (i > -1) {
                                lts.splice(i, 1);
                            }
                        };
                        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
                    }
                }

                function isSyntheticEvent(eventData) {
                    var x = eventData.srcEvent.clientX,
                        y = eventData.srcEvent.clientY;
                    for (var i = 0; i < this.lastTouches.length; i++) {
                        var t = this.lastTouches[i];
                        var dx = Math.abs(x - t.x),
                            dy = Math.abs(y - t.y);
                        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
                            return true;
                        }
                    }
                    return false;
                }

                var PREFIXED_TOUCH_ACTION = prefixed(
                    TEST_ELEMENT.style,
                    "touchAction"
                );
                var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

                // magical touchAction value
                var TOUCH_ACTION_COMPUTE = "compute";
                var TOUCH_ACTION_AUTO = "auto";
                var TOUCH_ACTION_MANIPULATION = "manipulation"; // not implemented
                var TOUCH_ACTION_NONE = "none";
                var TOUCH_ACTION_PAN_X = "pan-x";
                var TOUCH_ACTION_PAN_Y = "pan-y";
                var TOUCH_ACTION_MAP = getTouchActionProps();

                /**
                 * Touch Action
                 * sets the touchAction property or uses the js alternative
                 * @param {Manager} manager
                 * @param {String} value
                 * @constructor
                 */
                function TouchAction(manager, value) {
                    this.manager = manager;
                    this.set(value);
                }

                TouchAction.prototype = {
                    /**
                     * set the touchAction value on the element or enable the polyfill
                     * @param {String} value
                     */
                    set: function (value) {
                        // find out the touch-action by the event handlers
                        if (value == TOUCH_ACTION_COMPUTE) {
                            value = this.compute();
                        }

                        if (
                            NATIVE_TOUCH_ACTION &&
                            this.manager.element.style &&
                            TOUCH_ACTION_MAP[value]
                        ) {
                            this.manager.element.style[PREFIXED_TOUCH_ACTION] =
                                value;
                        }
                        this.actions = value.toLowerCase().trim();
                    },

                    /**
                     * just re-set the touchAction value
                     */
                    update: function () {
                        this.set(this.manager.options.touchAction);
                    },

                    /**
                     * compute the value for the touchAction property based on the recognizer's settings
                     * @returns {String} value
                     */
                    compute: function () {
                        var actions = [];
                        each(this.manager.recognizers, function (recognizer) {
                            if (
                                boolOrFn(recognizer.options.enable, [
                                    recognizer,
                                ])
                            ) {
                                actions = actions.concat(
                                    recognizer.getTouchAction()
                                );
                            }
                        });
                        return cleanTouchActions(actions.join(" "));
                    },

                    /**
                     * this method is called on each input cycle and provides the preventing of the browser behavior
                     * @param {Object} input
                     */
                    preventDefaults: function (input) {
                        var srcEvent = input.srcEvent;
                        var direction = input.offsetDirection;

                        // if the touch action did prevented once this session
                        if (this.manager.session.prevented) {
                            srcEvent.preventDefault();
                            return;
                        }

                        var actions = this.actions;
                        var hasNone =
                            inStr(actions, TOUCH_ACTION_NONE) &&
                            !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
                        var hasPanY =
                            inStr(actions, TOUCH_ACTION_PAN_Y) &&
                            !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
                        var hasPanX =
                            inStr(actions, TOUCH_ACTION_PAN_X) &&
                            !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

                        if (hasNone) {
                            //do not prevent defaults if this is a tap gesture

                            var isTapPointer = input.pointers.length === 1;
                            var isTapMovement = input.distance < 2;
                            var isTapTouchTime = input.deltaTime < 250;

                            if (
                                isTapPointer &&
                                isTapMovement &&
                                isTapTouchTime
                            ) {
                                return;
                            }
                        }

                        if (hasPanX && hasPanY) {
                            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
                            return;
                        }

                        if (
                            hasNone ||
                            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
                            (hasPanX && direction & DIRECTION_VERTICAL)
                        ) {
                            return this.preventSrc(srcEvent);
                        }
                    },

                    /**
                     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
                     * @param {Object} srcEvent
                     */
                    preventSrc: function (srcEvent) {
                        this.manager.session.prevented = true;
                        srcEvent.preventDefault();
                    },
                };

                /**
                 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
                 * @param {String} actions
                 * @returns {*}
                 */
                function cleanTouchActions(actions) {
                    // none
                    if (inStr(actions, TOUCH_ACTION_NONE)) {
                        return TOUCH_ACTION_NONE;
                    }

                    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
                    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

                    // if both pan-x and pan-y are set (different recognizers
                    // for different directions, e.g. horizontal pan but vertical swipe?)
                    // we need none (as otherwise with pan-x pan-y combined none of these
                    // recognizers will work, since the browser would handle all panning
                    if (hasPanX && hasPanY) {
                        return TOUCH_ACTION_NONE;
                    }

                    // pan-x OR pan-y
                    if (hasPanX || hasPanY) {
                        return hasPanX
                            ? TOUCH_ACTION_PAN_X
                            : TOUCH_ACTION_PAN_Y;
                    }

                    // manipulation
                    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
                        return TOUCH_ACTION_MANIPULATION;
                    }

                    return TOUCH_ACTION_AUTO;
                }

                function getTouchActionProps() {
                    if (!NATIVE_TOUCH_ACTION) {
                        return false;
                    }
                    var touchMap = {};
                    var cssSupports = window.CSS && window.CSS.supports;
                    [
                        "auto",
                        "manipulation",
                        "pan-y",
                        "pan-x",
                        "pan-x pan-y",
                        "none",
                    ].forEach(function (val) {
                        // If css.supports is not supported but there is native touch-action assume it supports
                        // all values. This is the case for IE 10 and 11.
                        touchMap[val] = cssSupports
                            ? window.CSS.supports("touch-action", val)
                            : true;
                    });
                    return touchMap;
                }

                /**
                 * Recognizer flow explained; *
                 * All recognizers have the initial state of POSSIBLE when a input session starts.
                 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
                 * Example session for mouse-input: mousedown -> mousemove -> mouseup
                 *
                 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
                 * which determines with state it should be.
                 *
                 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
                 * POSSIBLE to give it another change on the next cycle.
                 *
                 *               Possible
                 *                  |
                 *            +-----+---------------+
                 *            |                     |
                 *      +-----+-----+               |
                 *      |           |               |
                 *   Failed      Cancelled          |
                 *                          +-------+------+
                 *                          |              |
                 *                      Recognized       Began
                 *                                         |
                 *                                      Changed
                 *                                         |
                 *                                  Ended/Recognized
                 */
                var STATE_POSSIBLE = 1;
                var STATE_BEGAN = 2;
                var STATE_CHANGED = 4;
                var STATE_ENDED = 8;
                var STATE_RECOGNIZED = STATE_ENDED;
                var STATE_CANCELLED = 16;
                var STATE_FAILED = 32;

                /**
                 * Recognizer
                 * Every recognizer needs to extend from this class.
                 * @constructor
                 * @param {Object} options
                 */
                function Recognizer(options) {
                    this.options = assign({}, this.defaults, options || {});

                    this.id = uniqueId();

                    this.manager = null;

                    // default is enable true
                    this.options.enable = ifUndefined(
                        this.options.enable,
                        true
                    );

                    this.state = STATE_POSSIBLE;

                    this.simultaneous = {};
                    this.requireFail = [];
                }

                Recognizer.prototype = {
                    /**
                     * @virtual
                     * @type {Object}
                     */
                    defaults: {},

                    /**
                     * set options
                     * @param {Object} options
                     * @return {Recognizer}
                     */
                    set: function (options) {
                        assign(this.options, options);

                        // also update the touchAction, in case something changed about the directions/enabled state
                        this.manager && this.manager.touchAction.update();
                        return this;
                    },

                    /**
                     * recognize simultaneous with an other recognizer.
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */
                    recognizeWith: function (otherRecognizer) {
                        if (
                            invokeArrayArg(
                                otherRecognizer,
                                "recognizeWith",
                                this
                            )
                        ) {
                            return this;
                        }

                        var simultaneous = this.simultaneous;
                        otherRecognizer = getRecognizerByNameIfManager(
                            otherRecognizer,
                            this
                        );
                        if (!simultaneous[otherRecognizer.id]) {
                            simultaneous[otherRecognizer.id] = otherRecognizer;
                            otherRecognizer.recognizeWith(this);
                        }
                        return this;
                    },

                    /**
                     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */
                    dropRecognizeWith: function (otherRecognizer) {
                        if (
                            invokeArrayArg(
                                otherRecognizer,
                                "dropRecognizeWith",
                                this
                            )
                        ) {
                            return this;
                        }

                        otherRecognizer = getRecognizerByNameIfManager(
                            otherRecognizer,
                            this
                        );
                        delete this.simultaneous[otherRecognizer.id];
                        return this;
                    },

                    /**
                     * recognizer can only run when an other is failing
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */
                    requireFailure: function (otherRecognizer) {
                        if (
                            invokeArrayArg(
                                otherRecognizer,
                                "requireFailure",
                                this
                            )
                        ) {
                            return this;
                        }

                        var requireFail = this.requireFail;
                        otherRecognizer = getRecognizerByNameIfManager(
                            otherRecognizer,
                            this
                        );
                        if (inArray(requireFail, otherRecognizer) === -1) {
                            requireFail.push(otherRecognizer);
                            otherRecognizer.requireFailure(this);
                        }
                        return this;
                    },

                    /**
                     * drop the requireFailure link. it does not remove the link on the other recognizer.
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */
                    dropRequireFailure: function (otherRecognizer) {
                        if (
                            invokeArrayArg(
                                otherRecognizer,
                                "dropRequireFailure",
                                this
                            )
                        ) {
                            return this;
                        }

                        otherRecognizer = getRecognizerByNameIfManager(
                            otherRecognizer,
                            this
                        );
                        var index = inArray(this.requireFail, otherRecognizer);
                        if (index > -1) {
                            this.requireFail.splice(index, 1);
                        }
                        return this;
                    },

                    /**
                     * has require failures boolean
                     * @returns {boolean}
                     */
                    hasRequireFailures: function () {
                        return this.requireFail.length > 0;
                    },

                    /**
                     * if the recognizer can recognize simultaneous with an other recognizer
                     * @param {Recognizer} otherRecognizer
                     * @returns {Boolean}
                     */
                    canRecognizeWith: function (otherRecognizer) {
                        return !!this.simultaneous[otherRecognizer.id];
                    },

                    /**
                     * You should use `tryEmit` instead of `emit` directly to check
                     * that all the needed recognizers has failed before emitting.
                     * @param {Object} input
                     */
                    emit: function (input) {
                        var self = this;
                        var state = this.state;

                        function emit(event) {
                            self.manager.emit(event, input);
                        }

                        // 'panstart' and 'panmove'
                        if (state < STATE_ENDED) {
                            emit(self.options.event + stateStr(state));
                        }

                        emit(self.options.event); // simple 'eventName' events

                        if (input.additionalEvent) {
                            // additional event(panleft, panright, pinchin, pinchout...)
                            emit(input.additionalEvent);
                        }

                        // panend and pancancel
                        if (state >= STATE_ENDED) {
                            emit(self.options.event + stateStr(state));
                        }
                    },

                    /**
                     * Check that all the require failure recognizers has failed,
                     * if true, it emits a gesture event,
                     * otherwise, setup the state to FAILED.
                     * @param {Object} input
                     */
                    tryEmit: function (input) {
                        if (this.canEmit()) {
                            return this.emit(input);
                        }
                        // it's failing anyway
                        this.state = STATE_FAILED;
                    },

                    /**
                     * can we emit?
                     * @returns {boolean}
                     */
                    canEmit: function () {
                        var i = 0;
                        while (i < this.requireFail.length) {
                            if (
                                !(
                                    this.requireFail[i].state &
                                    (STATE_FAILED | STATE_POSSIBLE)
                                )
                            ) {
                                return false;
                            }
                            i++;
                        }
                        return true;
                    },

                    /**
                     * update the recognizer
                     * @param {Object} inputData
                     */
                    recognize: function (inputData) {
                        // make a new copy of the inputData
                        // so we can change the inputData without messing up the other recognizers
                        var inputDataClone = assign({}, inputData);

                        // is is enabled and allow recognizing?
                        if (
                            !boolOrFn(this.options.enable, [
                                this,
                                inputDataClone,
                            ])
                        ) {
                            this.reset();
                            this.state = STATE_FAILED;
                            return;
                        }

                        // reset when we've reached the end
                        if (
                            this.state &
                            (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)
                        ) {
                            this.state = STATE_POSSIBLE;
                        }

                        this.state = this.process(inputDataClone);

                        // the recognizer has recognized a gesture
                        // so trigger an event
                        if (
                            this.state &
                            (STATE_BEGAN |
                                STATE_CHANGED |
                                STATE_ENDED |
                                STATE_CANCELLED)
                        ) {
                            this.tryEmit(inputDataClone);
                        }
                    },

                    /**
                     * return the state of the recognizer
                     * the actual recognizing happens in this method
                     * @virtual
                     * @param {Object} inputData
                     * @returns {Const} STATE
                     */
                    process: function (inputData) {}, // jshint ignore:line

                    /**
                     * return the preferred touch-action
                     * @virtual
                     * @returns {Array}
                     */
                    getTouchAction: function () {},

                    /**
                     * called when the gesture isn't allowed to recognize
                     * like when another is being recognized or it is disabled
                     * @virtual
                     */
                    reset: function () {},
                };

                /**
                 * get a usable string, used as event postfix
                 * @param {Const} state
                 * @returns {String} state
                 */
                function stateStr(state) {
                    if (state & STATE_CANCELLED) {
                        return "cancel";
                    } else if (state & STATE_ENDED) {
                        return "end";
                    } else if (state & STATE_CHANGED) {
                        return "move";
                    } else if (state & STATE_BEGAN) {
                        return "start";
                    }
                    return "";
                }

                /**
                 * direction cons to string
                 * @param {Const} direction
                 * @returns {String}
                 */
                function directionStr(direction) {
                    if (direction == DIRECTION_DOWN) {
                        return "down";
                    } else if (direction == DIRECTION_UP) {
                        return "up";
                    } else if (direction == DIRECTION_LEFT) {
                        return "left";
                    } else if (direction == DIRECTION_RIGHT) {
                        return "right";
                    }
                    return "";
                }

                /**
                 * get a recognizer by name if it is bound to a manager
                 * @param {Recognizer|String} otherRecognizer
                 * @param {Recognizer} recognizer
                 * @returns {Recognizer}
                 */
                function getRecognizerByNameIfManager(
                    otherRecognizer,
                    recognizer
                ) {
                    var manager = recognizer.manager;
                    if (manager) {
                        return manager.get(otherRecognizer);
                    }
                    return otherRecognizer;
                }

                /**
                 * This recognizer is just used as a base for the simple attribute recognizers.
                 * @constructor
                 * @extends Recognizer
                 */
                function AttrRecognizer() {
                    Recognizer.apply(this, arguments);
                }

                inherit(AttrRecognizer, Recognizer, {
                    /**
                     * @namespace
                     * @memberof AttrRecognizer
                     */
                    defaults: {
                        /**
                         * @type {Number}
                         * @default 1
                         */
                        pointers: 1,
                    },

                    /**
                     * Used to check if it the recognizer receives valid input, like input.distance > 10.
                     * @memberof AttrRecognizer
                     * @param {Object} input
                     * @returns {Boolean} recognized
                     */
                    attrTest: function (input) {
                        var optionPointers = this.options.pointers;
                        return (
                            optionPointers === 0 ||
                            input.pointers.length === optionPointers
                        );
                    },

                    /**
                     * Process the input and return the state for the recognizer
                     * @memberof AttrRecognizer
                     * @param {Object} input
                     * @returns {*} State
                     */
                    process: function (input) {
                        var state = this.state;
                        var eventType = input.eventType;

                        var isRecognized =
                            state & (STATE_BEGAN | STATE_CHANGED);
                        var isValid = this.attrTest(input);

                        // on cancel input and we've recognized before, return STATE_CANCELLED
                        if (
                            isRecognized &&
                            (eventType & INPUT_CANCEL || !isValid)
                        ) {
                            return state | STATE_CANCELLED;
                        } else if (isRecognized || isValid) {
                            if (eventType & INPUT_END) {
                                return state | STATE_ENDED;
                            } else if (!(state & STATE_BEGAN)) {
                                return STATE_BEGAN;
                            }
                            return state | STATE_CHANGED;
                        }
                        return STATE_FAILED;
                    },
                });

                /**
                 * Pan
                 * Recognized when the pointer is down and moved in the allowed direction.
                 * @constructor
                 * @extends AttrRecognizer
                 */
                function PanRecognizer() {
                    AttrRecognizer.apply(this, arguments);

                    this.pX = null;
                    this.pY = null;
                }

                inherit(PanRecognizer, AttrRecognizer, {
                    /**
                     * @namespace
                     * @memberof PanRecognizer
                     */
                    defaults: {
                        event: "pan",
                        threshold: 10,
                        pointers: 1,
                        direction: DIRECTION_ALL,
                    },

                    getTouchAction: function () {
                        var direction = this.options.direction;
                        var actions = [];
                        if (direction & DIRECTION_HORIZONTAL) {
                            actions.push(TOUCH_ACTION_PAN_Y);
                        }
                        if (direction & DIRECTION_VERTICAL) {
                            actions.push(TOUCH_ACTION_PAN_X);
                        }
                        return actions;
                    },

                    directionTest: function (input) {
                        var options = this.options;
                        var hasMoved = true;
                        var distance = input.distance;
                        var direction = input.direction;
                        var x = input.deltaX;
                        var y = input.deltaY;

                        // lock to axis?
                        if (!(direction & options.direction)) {
                            if (options.direction & DIRECTION_HORIZONTAL) {
                                direction =
                                    x === 0
                                        ? DIRECTION_NONE
                                        : x < 0
                                        ? DIRECTION_LEFT
                                        : DIRECTION_RIGHT;
                                hasMoved = x != this.pX;
                                distance = Math.abs(input.deltaX);
                            } else {
                                direction =
                                    y === 0
                                        ? DIRECTION_NONE
                                        : y < 0
                                        ? DIRECTION_UP
                                        : DIRECTION_DOWN;
                                hasMoved = y != this.pY;
                                distance = Math.abs(input.deltaY);
                            }
                        }
                        input.direction = direction;
                        return (
                            hasMoved &&
                            distance > options.threshold &&
                            direction & options.direction
                        );
                    },

                    attrTest: function (input) {
                        return (
                            AttrRecognizer.prototype.attrTest.call(
                                this,
                                input
                            ) &&
                            (this.state & STATE_BEGAN ||
                                (!(this.state & STATE_BEGAN) &&
                                    this.directionTest(input)))
                        );
                    },

                    emit: function (input) {
                        this.pX = input.deltaX;
                        this.pY = input.deltaY;

                        var direction = directionStr(input.direction);

                        if (direction) {
                            input.additionalEvent =
                                this.options.event + direction;
                        }
                        this._super.emit.call(this, input);
                    },
                });

                /**
                 * Pinch
                 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
                 * @constructor
                 * @extends AttrRecognizer
                 */
                function PinchRecognizer() {
                    AttrRecognizer.apply(this, arguments);
                }

                inherit(PinchRecognizer, AttrRecognizer, {
                    /**
                     * @namespace
                     * @memberof PinchRecognizer
                     */
                    defaults: {
                        event: "pinch",
                        threshold: 0,
                        pointers: 2,
                    },

                    getTouchAction: function () {
                        return [TOUCH_ACTION_NONE];
                    },

                    attrTest: function (input) {
                        return (
                            this._super.attrTest.call(this, input) &&
                            (Math.abs(input.scale - 1) >
                                this.options.threshold ||
                                this.state & STATE_BEGAN)
                        );
                    },

                    emit: function (input) {
                        if (input.scale !== 1) {
                            var inOut = input.scale < 1 ? "in" : "out";
                            input.additionalEvent = this.options.event + inOut;
                        }
                        this._super.emit.call(this, input);
                    },
                });

                /**
                 * Press
                 * Recognized when the pointer is down for x ms without any movement.
                 * @constructor
                 * @extends Recognizer
                 */
                function PressRecognizer() {
                    Recognizer.apply(this, arguments);

                    this._timer = null;
                    this._input = null;
                }

                inherit(PressRecognizer, Recognizer, {
                    /**
                     * @namespace
                     * @memberof PressRecognizer
                     */
                    defaults: {
                        event: "press",
                        pointers: 1,
                        time: 251, // minimal time of the pointer to be pressed
                        threshold: 9, // a minimal movement is ok, but keep it low
                    },

                    getTouchAction: function () {
                        return [TOUCH_ACTION_AUTO];
                    },

                    process: function (input) {
                        var options = this.options;
                        var validPointers =
                            input.pointers.length === options.pointers;
                        var validMovement = input.distance < options.threshold;
                        var validTime = input.deltaTime > options.time;

                        this._input = input;

                        // we only allow little movement
                        // and we've reached an end event, so a tap is possible
                        if (
                            !validMovement ||
                            !validPointers ||
                            (input.eventType & (INPUT_END | INPUT_CANCEL) &&
                                !validTime)
                        ) {
                            this.reset();
                        } else if (input.eventType & INPUT_START) {
                            this.reset();
                            this._timer = setTimeoutContext(
                                function () {
                                    this.state = STATE_RECOGNIZED;
                                    this.tryEmit();
                                },
                                options.time,
                                this
                            );
                        } else if (input.eventType & INPUT_END) {
                            return STATE_RECOGNIZED;
                        }
                        return STATE_FAILED;
                    },

                    reset: function () {
                        clearTimeout(this._timer);
                    },

                    emit: function (input) {
                        if (this.state !== STATE_RECOGNIZED) {
                            return;
                        }

                        if (input && input.eventType & INPUT_END) {
                            this.manager.emit(this.options.event + "up", input);
                        } else {
                            this._input.timeStamp = now();
                            this.manager.emit(this.options.event, this._input);
                        }
                    },
                });

                /**
                 * Rotate
                 * Recognized when two or more pointer are moving in a circular motion.
                 * @constructor
                 * @extends AttrRecognizer
                 */
                function RotateRecognizer() {
                    AttrRecognizer.apply(this, arguments);
                }

                inherit(RotateRecognizer, AttrRecognizer, {
                    /**
                     * @namespace
                     * @memberof RotateRecognizer
                     */
                    defaults: {
                        event: "rotate",
                        threshold: 0,
                        pointers: 2,
                    },

                    getTouchAction: function () {
                        return [TOUCH_ACTION_NONE];
                    },

                    attrTest: function (input) {
                        return (
                            this._super.attrTest.call(this, input) &&
                            (Math.abs(input.rotation) >
                                this.options.threshold ||
                                this.state & STATE_BEGAN)
                        );
                    },
                });

                /**
                 * Swipe
                 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
                 * @constructor
                 * @extends AttrRecognizer
                 */
                function SwipeRecognizer() {
                    AttrRecognizer.apply(this, arguments);
                }

                inherit(SwipeRecognizer, AttrRecognizer, {
                    /**
                     * @namespace
                     * @memberof SwipeRecognizer
                     */
                    defaults: {
                        event: "swipe",
                        threshold: 10,
                        velocity: 0.3,
                        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
                        pointers: 1,
                    },

                    getTouchAction: function () {
                        return PanRecognizer.prototype.getTouchAction.call(
                            this
                        );
                    },

                    attrTest: function (input) {
                        var direction = this.options.direction;
                        var velocity;

                        if (
                            direction &
                            (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)
                        ) {
                            velocity = input.overallVelocity;
                        } else if (direction & DIRECTION_HORIZONTAL) {
                            velocity = input.overallVelocityX;
                        } else if (direction & DIRECTION_VERTICAL) {
                            velocity = input.overallVelocityY;
                        }

                        return (
                            this._super.attrTest.call(this, input) &&
                            direction & input.offsetDirection &&
                            input.distance > this.options.threshold &&
                            input.maxPointers == this.options.pointers &&
                            abs(velocity) > this.options.velocity &&
                            input.eventType & INPUT_END
                        );
                    },

                    emit: function (input) {
                        var direction = directionStr(input.offsetDirection);
                        if (direction) {
                            this.manager.emit(
                                this.options.event + direction,
                                input
                            );
                        }

                        this.manager.emit(this.options.event, input);
                    },
                });

                /**
                 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
                 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
                 * a single tap.
                 *
                 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
                 * multi-taps being recognized.
                 * @constructor
                 * @extends Recognizer
                 */
                function TapRecognizer() {
                    Recognizer.apply(this, arguments);

                    // previous time and center,
                    // used for tap counting
                    this.pTime = false;
                    this.pCenter = false;

                    this._timer = null;
                    this._input = null;
                    this.count = 0;
                }

                inherit(TapRecognizer, Recognizer, {
                    /**
                     * @namespace
                     * @memberof PinchRecognizer
                     */
                    defaults: {
                        event: "tap",
                        pointers: 1,
                        taps: 1,
                        interval: 300, // max time between the multi-tap taps
                        time: 250, // max time of the pointer to be down (like finger on the screen)
                        threshold: 9, // a minimal movement is ok, but keep it low
                        posThreshold: 10, // a multi-tap can be a bit off the initial position
                    },

                    getTouchAction: function () {
                        return [TOUCH_ACTION_MANIPULATION];
                    },

                    process: function (input) {
                        var options = this.options;

                        var validPointers =
                            input.pointers.length === options.pointers;
                        var validMovement = input.distance < options.threshold;
                        var validTouchTime = input.deltaTime < options.time;

                        this.reset();

                        if (input.eventType & INPUT_START && this.count === 0) {
                            return this.failTimeout();
                        }

                        // we only allow little movement
                        // and we've reached an end event, so a tap is possible
                        if (validMovement && validTouchTime && validPointers) {
                            if (input.eventType != INPUT_END) {
                                return this.failTimeout();
                            }

                            var validInterval = this.pTime
                                ? input.timeStamp - this.pTime <
                                  options.interval
                                : true;
                            var validMultiTap =
                                !this.pCenter ||
                                getDistance(this.pCenter, input.center) <
                                    options.posThreshold;

                            this.pTime = input.timeStamp;
                            this.pCenter = input.center;

                            if (!validMultiTap || !validInterval) {
                                this.count = 1;
                            } else {
                                this.count += 1;
                            }

                            this._input = input;

                            // if tap count matches we have recognized it,
                            // else it has began recognizing...
                            var tapCount = this.count % options.taps;
                            if (tapCount === 0) {
                                // no failing requirements, immediately trigger the tap event
                                // or wait as long as the multitap interval to trigger
                                if (!this.hasRequireFailures()) {
                                    return STATE_RECOGNIZED;
                                } else {
                                    this._timer = setTimeoutContext(
                                        function () {
                                            this.state = STATE_RECOGNIZED;
                                            this.tryEmit();
                                        },
                                        options.interval,
                                        this
                                    );
                                    return STATE_BEGAN;
                                }
                            }
                        }
                        return STATE_FAILED;
                    },

                    failTimeout: function () {
                        this._timer = setTimeoutContext(
                            function () {
                                this.state = STATE_FAILED;
                            },
                            this.options.interval,
                            this
                        );
                        return STATE_FAILED;
                    },

                    reset: function () {
                        clearTimeout(this._timer);
                    },

                    emit: function () {
                        if (this.state == STATE_RECOGNIZED) {
                            this._input.tapCount = this.count;
                            this.manager.emit(this.options.event, this._input);
                        }
                    },
                });

                /**
                 * Simple way to create a manager with a default set of recognizers.
                 * @param {HTMLElement} element
                 * @param {Object} [options]
                 * @constructor
                 */
                function Hammer(element, options) {
                    options = options || {};
                    options.recognizers = ifUndefined(
                        options.recognizers,
                        Hammer.defaults.preset
                    );
                    return new Manager(element, options);
                }

                /**
                 * @const {string}
                 */
                Hammer.VERSION = "2.0.7";

                /**
                 * default settings
                 * @namespace
                 */
                Hammer.defaults = {
                    /**
                     * set if DOM events are being triggered.
                     * But this is slower and unused by simple implementations, so disabled by default.
                     * @type {Boolean}
                     * @default false
                     */
                    domEvents: false,

                    /**
                     * The value for the touchAction property/fallback.
                     * When set to `compute` it will magically set the correct value based on the added recognizers.
                     * @type {String}
                     * @default compute
                     */
                    touchAction: TOUCH_ACTION_COMPUTE,

                    /**
                     * @type {Boolean}
                     * @default true
                     */
                    enable: true,

                    /**
                     * EXPERIMENTAL FEATURE -- can be removed/changed
                     * Change the parent input target element.
                     * If Null, then it is being set the to main element.
                     * @type {Null|EventTarget}
                     * @default null
                     */
                    inputTarget: null,

                    /**
                     * force an input class
                     * @type {Null|Function}
                     * @default null
                     */
                    inputClass: null,

                    /**
                     * Default recognizer setup when calling `Hammer()`
                     * When creating a new Manager these will be skipped.
                     * @type {Array}
                     */
                    preset: [
                        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
                        [RotateRecognizer, { enable: false }],
                        [PinchRecognizer, { enable: false }, ["rotate"]],
                        [SwipeRecognizer, { direction: DIRECTION_HORIZONTAL }],
                        [
                            PanRecognizer,
                            { direction: DIRECTION_HORIZONTAL },
                            ["swipe"],
                        ],
                        [TapRecognizer],
                        [
                            TapRecognizer,
                            { event: "doubletap", taps: 2 },
                            ["tap"],
                        ],
                        [PressRecognizer],
                    ],

                    /**
                     * Some CSS properties can be used to improve the working of Hammer.
                     * Add them to this method and they will be set when creating a new Manager.
                     * @namespace
                     */
                    cssProps: {
                        /**
                         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
                         * @type {String}
                         * @default 'none'
                         */
                        userSelect: "none",

                        /**
                         * Disable the Windows Phone grippers when pressing an element.
                         * @type {String}
                         * @default 'none'
                         */
                        touchSelect: "none",

                        /**
                         * Disables the default callout shown when you touch and hold a touch target.
                         * On iOS, when you touch and hold a touch target such as a link, Safari displays
                         * a callout containing information about the link. This property allows you to disable that callout.
                         * @type {String}
                         * @default 'none'
                         */
                        touchCallout: "none",

                        /**
                         * Specifies whether zooming is enabled. Used by IE10>
                         * @type {String}
                         * @default 'none'
                         */
                        contentZooming: "none",

                        /**
                         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
                         * @type {String}
                         * @default 'none'
                         */
                        userDrag: "none",

                        /**
                         * Overrides the highlight color shown when the user taps a link or a JavaScript
                         * clickable element in iOS. This property obeys the alpha value, if specified.
                         * @type {String}
                         * @default 'rgba(0,0,0,0)'
                         */
                        tapHighlightColor: "rgba(0,0,0,0)",
                    },
                };

                var STOP = 1;
                var FORCED_STOP = 2;

                /**
                 * Manager
                 * @param {HTMLElement} element
                 * @param {Object} [options]
                 * @constructor
                 */
                function Manager(element, options) {
                    this.options = assign({}, Hammer.defaults, options || {});

                    this.options.inputTarget =
                        this.options.inputTarget || element;

                    this.handlers = {};
                    this.session = {};
                    this.recognizers = [];
                    this.oldCssProps = {};

                    this.element = element;
                    this.input = createInputInstance(this);
                    this.touchAction = new TouchAction(
                        this,
                        this.options.touchAction
                    );

                    toggleCssProps(this, true);

                    each(
                        this.options.recognizers,
                        function (item) {
                            var recognizer = this.add(new item[0](item[1]));
                            item[2] && recognizer.recognizeWith(item[2]);
                            item[3] && recognizer.requireFailure(item[3]);
                        },
                        this
                    );
                }

                Manager.prototype = {
                    /**
                     * set options
                     * @param {Object} options
                     * @returns {Manager}
                     */
                    set: function (options) {
                        assign(this.options, options);

                        // Options that need a little more setup
                        if (options.touchAction) {
                            this.touchAction.update();
                        }
                        if (options.inputTarget) {
                            // Clean up existing event listeners and reinitialize
                            this.input.destroy();
                            this.input.target = options.inputTarget;
                            this.input.init();
                        }
                        return this;
                    },

                    /**
                     * stop recognizing for this session.
                     * This session will be discarded, when a new [input]start event is fired.
                     * When forced, the recognizer cycle is stopped immediately.
                     * @param {Boolean} [force]
                     */
                    stop: function (force) {
                        this.session.stopped = force ? FORCED_STOP : STOP;
                    },

                    /**
                     * run the recognizers!
                     * called by the inputHandler function on every movement of the pointers (touches)
                     * it walks through all the recognizers and tries to detect the gesture that is being made
                     * @param {Object} inputData
                     */
                    recognize: function (inputData) {
                        var session = this.session;
                        if (session.stopped) {
                            return;
                        }

                        // run the touch-action polyfill
                        this.touchAction.preventDefaults(inputData);

                        var recognizer;
                        var recognizers = this.recognizers;

                        // this holds the recognizer that is being recognized.
                        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
                        // if no recognizer is detecting a thing, it is set to `null`
                        var curRecognizer = session.curRecognizer;

                        // reset when the last recognizer is recognized
                        // or when we're in a new session
                        if (
                            !curRecognizer ||
                            (curRecognizer &&
                                curRecognizer.state & STATE_RECOGNIZED)
                        ) {
                            curRecognizer = session.curRecognizer = null;
                        }

                        var i = 0;
                        while (i < recognizers.length) {
                            recognizer = recognizers[i];

                            // find out if we are allowed try to recognize the input for this one.
                            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
                            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
                            //      that is being recognized.
                            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
                            //      this can be setup with the `recognizeWith()` method on the recognizer.
                            if (
                                session.stopped !== FORCED_STOP && // 1
                                (!curRecognizer ||
                                    recognizer == curRecognizer || // 2
                                    recognizer.canRecognizeWith(curRecognizer))
                            ) {
                                // 3
                                recognizer.recognize(inputData);
                            } else {
                                recognizer.reset();
                            }

                            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
                            // current active recognizer. but only if we don't already have an active recognizer
                            if (
                                !curRecognizer &&
                                recognizer.state &
                                    (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)
                            ) {
                                curRecognizer = session.curRecognizer =
                                    recognizer;
                            }
                            i++;
                        }
                    },

                    /**
                     * get a recognizer by its event name.
                     * @param {Recognizer|String} recognizer
                     * @returns {Recognizer|Null}
                     */
                    get: function (recognizer) {
                        if (recognizer instanceof Recognizer) {
                            return recognizer;
                        }

                        var recognizers = this.recognizers;
                        for (var i = 0; i < recognizers.length; i++) {
                            if (recognizers[i].options.event == recognizer) {
                                return recognizers[i];
                            }
                        }
                        return null;
                    },

                    /**
                     * add a recognizer to the manager
                     * existing recognizers with the same event name will be removed
                     * @param {Recognizer} recognizer
                     * @returns {Recognizer|Manager}
                     */
                    add: function (recognizer) {
                        if (invokeArrayArg(recognizer, "add", this)) {
                            return this;
                        }

                        // remove existing
                        var existing = this.get(recognizer.options.event);
                        if (existing) {
                            this.remove(existing);
                        }

                        this.recognizers.push(recognizer);
                        recognizer.manager = this;

                        this.touchAction.update();
                        return recognizer;
                    },

                    /**
                     * remove a recognizer by name or instance
                     * @param {Recognizer|String} recognizer
                     * @returns {Manager}
                     */
                    remove: function (recognizer) {
                        if (invokeArrayArg(recognizer, "remove", this)) {
                            return this;
                        }

                        recognizer = this.get(recognizer);

                        // let's make sure this recognizer exists
                        if (recognizer) {
                            var recognizers = this.recognizers;
                            var index = inArray(recognizers, recognizer);

                            if (index !== -1) {
                                recognizers.splice(index, 1);
                                this.touchAction.update();
                            }
                        }

                        return this;
                    },

                    /**
                     * bind event
                     * @param {String} events
                     * @param {Function} handler
                     * @returns {EventEmitter} this
                     */
                    on: function (events, handler) {
                        if (events === undefined) {
                            return;
                        }
                        if (handler === undefined) {
                            return;
                        }

                        var handlers = this.handlers;
                        each(splitStr(events), function (event) {
                            handlers[event] = handlers[event] || [];
                            handlers[event].push(handler);
                        });
                        return this;
                    },

                    /**
                     * unbind event, leave emit blank to remove all handlers
                     * @param {String} events
                     * @param {Function} [handler]
                     * @returns {EventEmitter} this
                     */
                    off: function (events, handler) {
                        if (events === undefined) {
                            return;
                        }

                        var handlers = this.handlers;
                        each(splitStr(events), function (event) {
                            if (!handler) {
                                delete handlers[event];
                            } else {
                                handlers[event] &&
                                    handlers[event].splice(
                                        inArray(handlers[event], handler),
                                        1
                                    );
                            }
                        });
                        return this;
                    },

                    /**
                     * emit event to the listeners
                     * @param {String} event
                     * @param {Object} data
                     */
                    emit: function (event, data) {
                        // we also want to trigger dom events
                        if (this.options.domEvents) {
                            triggerDomEvent(event, data);
                        }

                        // no handlers, so skip it all
                        var handlers =
                            this.handlers[event] &&
                            this.handlers[event].slice();
                        if (!handlers || !handlers.length) {
                            return;
                        }

                        data.type = event;
                        data.preventDefault = function () {
                            data.srcEvent.preventDefault();
                        };

                        var i = 0;
                        while (i < handlers.length) {
                            handlers[i](data);
                            i++;
                        }
                    },

                    /**
                     * destroy the manager and unbinds all events
                     * it doesn't unbind dom events, that is the user own responsibility
                     */
                    destroy: function () {
                        this.element && toggleCssProps(this, false);

                        this.handlers = {};
                        this.session = {};
                        this.input.destroy();
                        this.element = null;
                    },
                };

                /**
                 * add/remove the css properties as defined in manager.options.cssProps
                 * @param {Manager} manager
                 * @param {Boolean} add
                 */
                function toggleCssProps(manager, add) {
                    var element = manager.element;
                    if (!element.style) {
                        return;
                    }
                    var prop;
                    each(manager.options.cssProps, function (value, name) {
                        prop = prefixed(element.style, name);
                        if (add) {
                            manager.oldCssProps[prop] = element.style[prop];
                            element.style[prop] = value;
                        } else {
                            element.style[prop] =
                                manager.oldCssProps[prop] || "";
                        }
                    });
                    if (!add) {
                        manager.oldCssProps = {};
                    }
                }

                /**
                 * trigger dom event
                 * @param {String} event
                 * @param {Object} data
                 */
                function triggerDomEvent(event, data) {
                    var gestureEvent = document.createEvent("Event");
                    gestureEvent.initEvent(event, true, true);
                    gestureEvent.gesture = data;
                    data.target.dispatchEvent(gestureEvent);
                }

                assign(Hammer, {
                    INPUT_START: INPUT_START,
                    INPUT_MOVE: INPUT_MOVE,
                    INPUT_END: INPUT_END,
                    INPUT_CANCEL: INPUT_CANCEL,

                    STATE_POSSIBLE: STATE_POSSIBLE,
                    STATE_BEGAN: STATE_BEGAN,
                    STATE_CHANGED: STATE_CHANGED,
                    STATE_ENDED: STATE_ENDED,
                    STATE_RECOGNIZED: STATE_RECOGNIZED,
                    STATE_CANCELLED: STATE_CANCELLED,
                    STATE_FAILED: STATE_FAILED,

                    DIRECTION_NONE: DIRECTION_NONE,
                    DIRECTION_LEFT: DIRECTION_LEFT,
                    DIRECTION_RIGHT: DIRECTION_RIGHT,
                    DIRECTION_UP: DIRECTION_UP,
                    DIRECTION_DOWN: DIRECTION_DOWN,
                    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
                    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
                    DIRECTION_ALL: DIRECTION_ALL,

                    Manager: Manager,
                    Input: Input,
                    TouchAction: TouchAction,

                    TouchInput: TouchInput,
                    MouseInput: MouseInput,
                    PointerEventInput: PointerEventInput,
                    TouchMouseInput: TouchMouseInput,
                    SingleTouchInput: SingleTouchInput,

                    Recognizer: Recognizer,
                    AttrRecognizer: AttrRecognizer,
                    Tap: TapRecognizer,
                    Pan: PanRecognizer,
                    Swipe: SwipeRecognizer,
                    Pinch: PinchRecognizer,
                    Rotate: RotateRecognizer,
                    Press: PressRecognizer,

                    on: addEventListeners,
                    off: removeEventListeners,
                    each: each,
                    merge: merge,
                    extend: extend,
                    assign: assign,
                    inherit: inherit,
                    bindFn: bindFn,
                    prefixed: prefixed,
                });

                // this prevents errors when Hammer is loaded in the presence of an AMD
                //  style loader but by script tag, not by the loader.
                var freeGlobal =
                    typeof window !== "undefined"
                        ? window
                        : typeof self !== "undefined"
                        ? self
                        : {}; // jshint ignore:line
                freeGlobal.Hammer = Hammer;

                if (true) {
                    !((__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                        return Hammer;
                    }.call(exports, __webpack_require__, exports, module)),
                    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined &&
                        (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                } else {
                }
            })(window, document, "Hammer");

            /***/
        },

        /***/ 3454: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var ref, ref1;
            module.exports =
                ((ref = __webpack_require__.g.process) === null ||
                ref === void 0
                    ? void 0
                    : ref.env) &&
                typeof ((ref1 = __webpack_require__.g.process) === null ||
                ref1 === void 0
                    ? void 0
                    : ref1.env) === "object"
                    ? __webpack_require__.g.process
                    : __webpack_require__(7663);

            //# sourceMappingURL=process.js.map

            /***/
        },

        /***/ 7663: /***/ function (module) {
            var __dirname = "/";
            (function () {
                var e = {
                    162: function (e) {
                        var t = (e.exports = {});
                        var r;
                        var n;
                        function defaultSetTimout() {
                            throw new Error("setTimeout has not been defined");
                        }
                        function defaultClearTimeout() {
                            throw new Error(
                                "clearTimeout has not been defined"
                            );
                        }
                        (function () {
                            try {
                                if (typeof setTimeout === "function") {
                                    r = setTimeout;
                                } else {
                                    r = defaultSetTimout;
                                }
                            } catch (e) {
                                r = defaultSetTimout;
                            }
                            try {
                                if (typeof clearTimeout === "function") {
                                    n = clearTimeout;
                                } else {
                                    n = defaultClearTimeout;
                                }
                            } catch (e) {
                                n = defaultClearTimeout;
                            }
                        })();
                        function runTimeout(e) {
                            if (r === setTimeout) {
                                return setTimeout(e, 0);
                            }
                            if ((r === defaultSetTimout || !r) && setTimeout) {
                                r = setTimeout;
                                return setTimeout(e, 0);
                            }
                            try {
                                return r(e, 0);
                            } catch (t) {
                                try {
                                    return r.call(null, e, 0);
                                } catch (t) {
                                    return r.call(this, e, 0);
                                }
                            }
                        }
                        function runClearTimeout(e) {
                            if (n === clearTimeout) {
                                return clearTimeout(e);
                            }
                            if (
                                (n === defaultClearTimeout || !n) &&
                                clearTimeout
                            ) {
                                n = clearTimeout;
                                return clearTimeout(e);
                            }
                            try {
                                return n(e);
                            } catch (t) {
                                try {
                                    return n.call(null, e);
                                } catch (t) {
                                    return n.call(this, e);
                                }
                            }
                        }
                        var i = [];
                        var o = false;
                        var u;
                        var a = -1;
                        function cleanUpNextTick() {
                            if (!o || !u) {
                                return;
                            }
                            o = false;
                            if (u.length) {
                                i = u.concat(i);
                            } else {
                                a = -1;
                            }
                            if (i.length) {
                                drainQueue();
                            }
                        }
                        function drainQueue() {
                            if (o) {
                                return;
                            }
                            var e = runTimeout(cleanUpNextTick);
                            o = true;
                            var t = i.length;
                            while (t) {
                                u = i;
                                i = [];
                                while (++a < t) {
                                    if (u) {
                                        u[a].run();
                                    }
                                }
                                a = -1;
                                t = i.length;
                            }
                            u = null;
                            o = false;
                            runClearTimeout(e);
                        }
                        t.nextTick = function (e) {
                            var t = new Array(arguments.length - 1);
                            if (arguments.length > 1) {
                                for (var r = 1; r < arguments.length; r++) {
                                    t[r - 1] = arguments[r];
                                }
                            }
                            i.push(new Item(e, t));
                            if (i.length === 1 && !o) {
                                runTimeout(drainQueue);
                            }
                        };
                        function Item(e, t) {
                            this.fun = e;
                            this.array = t;
                        }
                        Item.prototype.run = function () {
                            this.fun.apply(null, this.array);
                        };
                        t.title = "browser";
                        t.browser = true;
                        t.env = {};
                        t.argv = [];
                        t.version = "";
                        t.versions = {};
                        function noop() {}
                        t.on = noop;
                        t.addListener = noop;
                        t.once = noop;
                        t.off = noop;
                        t.removeListener = noop;
                        t.removeAllListeners = noop;
                        t.emit = noop;
                        t.prependListener = noop;
                        t.prependOnceListener = noop;
                        t.listeners = function (e) {
                            return [];
                        };
                        t.binding = function (e) {
                            throw new Error("process.binding is not supported");
                        };
                        t.cwd = function () {
                            return "/";
                        };
                        t.chdir = function (e) {
                            throw new Error("process.chdir is not supported");
                        };
                        t.umask = function () {
                            return 0;
                        };
                    },
                };
                var t = {};
                function __nccwpck_require__(r) {
                    var n = t[r];
                    if (n !== undefined) {
                        return n.exports;
                    }
                    var i = (t[r] = { exports: {} });
                    var o = true;
                    try {
                        e[r](i, i.exports, __nccwpck_require__);
                        o = false;
                    } finally {
                        if (o) delete t[r];
                    }
                    return i.exports;
                }
                if (typeof __nccwpck_require__ !== "undefined")
                    __nccwpck_require__.ab = __dirname + "/";
                var r = __nccwpck_require__(162);
                module.exports = r;
            })();

            /***/
        },

        /***/ 2703: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var ReactPropTypesSecret = __webpack_require__(414);

            function emptyFunction() {}
            function emptyFunctionWithReset() {}
            emptyFunctionWithReset.resetWarningCache = emptyFunction;

            module.exports = function () {
                function shim(
                    props,
                    propName,
                    componentName,
                    location,
                    propFullName,
                    secret
                ) {
                    if (secret === ReactPropTypesSecret) {
                        // It is still safe when called from React.
                        return;
                    }
                    var err = new Error(
                        "Calling PropTypes validators directly is not supported by the `prop-types` package. " +
                            "Use PropTypes.checkPropTypes() to call them. " +
                            "Read more at http://fb.me/use-check-prop-types"
                    );
                    err.name = "Invariant Violation";
                    throw err;
                }
                shim.isRequired = shim;
                function getShim() {
                    return shim;
                }
                // Important!
                // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
                var ReactPropTypes = {
                    array: shim,
                    bigint: shim,
                    bool: shim,
                    func: shim,
                    number: shim,
                    object: shim,
                    string: shim,
                    symbol: shim,

                    any: shim,
                    arrayOf: getShim,
                    element: shim,
                    elementType: shim,
                    instanceOf: getShim,
                    node: shim,
                    objectOf: getShim,
                    oneOf: getShim,
                    oneOfType: getShim,
                    shape: getShim,
                    exact: getShim,

                    checkPropTypes: emptyFunctionWithReset,
                    resetWarningCache: emptyFunction,
                };

                ReactPropTypes.PropTypes = ReactPropTypes;

                return ReactPropTypes;
            };

            /***/
        },

        /***/ 5697: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            if (false) {
                var throwOnDirectAccess, ReactIs;
            } else {
                // By explicitly using `prop-types` you are opting into new production behavior.
                // http://fb.me/prop-types-in-prod
                module.exports = __webpack_require__(2703)();
            }

            /***/
        },

        /***/ 414: /***/ function (module) {
            "use strict";
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var ReactPropTypesSecret =
                "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";

            module.exports = ReactPropTypesSecret;

            /***/
        },

        /***/ 6785: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";

            // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                ZP: function () {
                    return /* reexport */ interactive_map;
                },
            }); // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js

            // UNUSED EXPORTS: AttributionControl, BaseControl, CanvasOverlay, FlyToInterpolator, FullscreenControl, GeolocateControl, HTMLOverlay, InteractiveMap, Layer, LinearInterpolator, MapContext, MapController, Marker, NavigationControl, Popup, SVGOverlay, ScaleControl, Source, StaticMap, TRANSITION_EVENTS, TransitionInterpolator, WebMercatorViewport, _MapContext, _useMapControl, setRTLTextPlugin

            function _extends() {
                _extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];

                            for (var key in source) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        source,
                                        key
                                    )
                                ) {
                                    target[key] = source[key];
                                }
                            }
                        }

                        return target;
                    };

                return _extends.apply(this, arguments);
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
            function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;

                for (var i = 0, arr2 = new Array(len); i < len; i++) {
                    arr2[i] = arr[i];
                }

                return arr2;
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
            function _arrayWithoutHoles(arr) {
                if (Array.isArray(arr)) return _arrayLikeToArray(arr);
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
            function _iterableToArray(iter) {
                if (
                    (typeof Symbol !== "undefined" &&
                        iter[Symbol.iterator] != null) ||
                    iter["@@iterator"] != null
                )
                    return Array.from(iter);
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
            function _unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === "string") return _arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return _arrayLikeToArray(o, minLen);
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
            function _nonIterableSpread() {
                throw new TypeError(
                    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                );
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
            function _toConsumableArray(arr) {
                return (
                    _arrayWithoutHoles(arr) ||
                    _iterableToArray(arr) ||
                    _unsupportedIterableToArray(arr) ||
                    _nonIterableSpread()
                );
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true,
                    });
                } else {
                    obj[key] = value;
                }

                return obj;
            }
            // EXTERNAL MODULE: ./node_modules/react/index.js
            var react = __webpack_require__(7294);
            // EXTERNAL MODULE: ./node_modules/prop-types/index.js
            var prop_types = __webpack_require__(5697); // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
            function _arrayWithHoles(arr) {
                if (Array.isArray(arr)) return arr;
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
            function _iterableToArrayLimit(arr, i) {
                var _i =
                    arr == null
                        ? null
                        : (typeof Symbol !== "undefined" &&
                              arr[Symbol.iterator]) ||
                          arr["@@iterator"];

                if (_i == null) return;
                var _arr = [];
                var _n = true;
                var _d = false;

                var _s, _e;

                try {
                    for (
                        _i = _i.call(arr);
                        !(_n = (_s = _i.next()).done);
                        _n = true
                    ) {
                        _arr.push(_s.value);

                        if (i && _arr.length === i) break;
                    }
                } catch (err) {
                    _d = true;
                    _e = err;
                } finally {
                    try {
                        if (!_n && _i["return"] != null) _i["return"]();
                    } finally {
                        if (_d) throw _e;
                    }
                }

                return _arr;
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
            function _nonIterableRest() {
                throw new TypeError(
                    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                );
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js
            function _slicedToArray(arr, i) {
                return (
                    _arrayWithHoles(arr) ||
                    _iterableToArrayLimit(arr, i) ||
                    _unsupportedIterableToArray(arr, i) ||
                    _nonIterableRest()
                );
            } // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/node_modules/gl-matrix/esm/common.js
            /**
             * Common utilities
             * @module glMatrix
             */
            // Configuration Constants
            var EPSILON = 0.000001;
            var ARRAY_TYPE =
                typeof Float32Array !== "undefined" ? Float32Array : Array;
            var RANDOM = Math.random;
            /**
             * Sets the type of array used when creating new vectors and matrices
             *
             * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
             */

            function setMatrixArrayType(type) {
                ARRAY_TYPE = type;
            }
            var degree = Math.PI / 180;
            /**
             * Convert Degree To Radian
             *
             * @param {Number} a Angle in Degrees
             */

            function toRadian(a) {
                return a * degree;
            }
            /**
             * Tests whether or not the arguments have approximately the same value, within an absolute
             * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
             * than or equal to 1.0, and a relative tolerance is used for larger values)
             *
             * @param {Number} a The first number to test.
             * @param {Number} b The second number to test.
             * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
             */

            function equals(a, b) {
                return (
                    Math.abs(a - b) <=
                    EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b))
                );
            }
            if (!Math.hypot)
                Math.hypot = function () {
                    var y = 0,
                        i = arguments.length;

                    while (i--) {
                        y += arguments[i] * arguments[i];
                    }

                    return Math.sqrt(y);
                }; // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/node_modules/gl-matrix/esm/vec4.js
            /**
             * 4 Dimensional Vector
             * @module vec4
             */

            /**
             * Creates a new, empty vec4
             *
             * @returns {vec4} a new 4D vector
             */

            function create() {
                var out = new ARRAY_TYPE(4);

                if (ARRAY_TYPE != Float32Array) {
                    out[0] = 0;
                    out[1] = 0;
                    out[2] = 0;
                    out[3] = 0;
                }

                return out;
            }
            /**
             * Creates a new vec4 initialized with values from an existing vector
             *
             * @param {ReadonlyVec4} a vector to clone
             * @returns {vec4} a new 4D vector
             */

            function clone(a) {
                var out = new glMatrix.ARRAY_TYPE(4);
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                return out;
            }
            /**
             * Creates a new vec4 initialized with the given values
             *
             * @param {Number} x X component
             * @param {Number} y Y component
             * @param {Number} z Z component
             * @param {Number} w W component
             * @returns {vec4} a new 4D vector
             */

            function fromValues(x, y, z, w) {
                var out = new glMatrix.ARRAY_TYPE(4);
                out[0] = x;
                out[1] = y;
                out[2] = z;
                out[3] = w;
                return out;
            }
            /**
             * Copy the values from one vec4 to another
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the source vector
             * @returns {vec4} out
             */

            function copy(out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                return out;
            }
            /**
             * Set the components of a vec4 to the given values
             *
             * @param {vec4} out the receiving vector
             * @param {Number} x X component
             * @param {Number} y Y component
             * @param {Number} z Z component
             * @param {Number} w W component
             * @returns {vec4} out
             */

            function set(out, x, y, z, w) {
                out[0] = x;
                out[1] = y;
                out[2] = z;
                out[3] = w;
                return out;
            }
            /**
             * Adds two vec4's
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @returns {vec4} out
             */

            function add(out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                out[2] = a[2] + b[2];
                out[3] = a[3] + b[3];
                return out;
            }
            /**
             * Subtracts vector b from vector a
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @returns {vec4} out
             */

            function subtract(out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                out[2] = a[2] - b[2];
                out[3] = a[3] - b[3];
                return out;
            }
            /**
             * Multiplies two vec4's
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @returns {vec4} out
             */

            function multiply(out, a, b) {
                out[0] = a[0] * b[0];
                out[1] = a[1] * b[1];
                out[2] = a[2] * b[2];
                out[3] = a[3] * b[3];
                return out;
            }
            /**
             * Divides two vec4's
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @returns {vec4} out
             */

            function divide(out, a, b) {
                out[0] = a[0] / b[0];
                out[1] = a[1] / b[1];
                out[2] = a[2] / b[2];
                out[3] = a[3] / b[3];
                return out;
            }
            /**
             * Math.ceil the components of a vec4
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a vector to ceil
             * @returns {vec4} out
             */

            function ceil(out, a) {
                out[0] = Math.ceil(a[0]);
                out[1] = Math.ceil(a[1]);
                out[2] = Math.ceil(a[2]);
                out[3] = Math.ceil(a[3]);
                return out;
            }
            /**
             * Math.floor the components of a vec4
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a vector to floor
             * @returns {vec4} out
             */

            function floor(out, a) {
                out[0] = Math.floor(a[0]);
                out[1] = Math.floor(a[1]);
                out[2] = Math.floor(a[2]);
                out[3] = Math.floor(a[3]);
                return out;
            }
            /**
             * Returns the minimum of two vec4's
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @returns {vec4} out
             */

            function min(out, a, b) {
                out[0] = Math.min(a[0], b[0]);
                out[1] = Math.min(a[1], b[1]);
                out[2] = Math.min(a[2], b[2]);
                out[3] = Math.min(a[3], b[3]);
                return out;
            }
            /**
             * Returns the maximum of two vec4's
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @returns {vec4} out
             */

            function max(out, a, b) {
                out[0] = Math.max(a[0], b[0]);
                out[1] = Math.max(a[1], b[1]);
                out[2] = Math.max(a[2], b[2]);
                out[3] = Math.max(a[3], b[3]);
                return out;
            }
            /**
             * Math.round the components of a vec4
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a vector to round
             * @returns {vec4} out
             */

            function round(out, a) {
                out[0] = Math.round(a[0]);
                out[1] = Math.round(a[1]);
                out[2] = Math.round(a[2]);
                out[3] = Math.round(a[3]);
                return out;
            }
            /**
             * Scales a vec4 by a scalar number
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the vector to scale
             * @param {Number} b amount to scale the vector by
             * @returns {vec4} out
             */

            function scale(out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                out[2] = a[2] * b;
                out[3] = a[3] * b;
                return out;
            }
            /**
             * Adds two vec4's after scaling the second operand by a scalar value
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @param {Number} scale the amount to scale b by before adding
             * @returns {vec4} out
             */

            function scaleAndAdd(out, a, b, scale) {
                out[0] = a[0] + b[0] * scale;
                out[1] = a[1] + b[1] * scale;
                out[2] = a[2] + b[2] * scale;
                out[3] = a[3] + b[3] * scale;
                return out;
            }
            /**
             * Calculates the euclidian distance between two vec4's
             *
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @returns {Number} distance between a and b
             */

            function distance(a, b) {
                var x = b[0] - a[0];
                var y = b[1] - a[1];
                var z = b[2] - a[2];
                var w = b[3] - a[3];
                return Math.hypot(x, y, z, w);
            }
            /**
             * Calculates the squared euclidian distance between two vec4's
             *
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @returns {Number} squared distance between a and b
             */

            function squaredDistance(a, b) {
                var x = b[0] - a[0];
                var y = b[1] - a[1];
                var z = b[2] - a[2];
                var w = b[3] - a[3];
                return x * x + y * y + z * z + w * w;
            }
            /**
             * Calculates the length of a vec4
             *
             * @param {ReadonlyVec4} a vector to calculate length of
             * @returns {Number} length of a
             */

            function vec4_length(a) {
                var x = a[0];
                var y = a[1];
                var z = a[2];
                var w = a[3];
                return Math.hypot(x, y, z, w);
            }
            /**
             * Calculates the squared length of a vec4
             *
             * @param {ReadonlyVec4} a vector to calculate squared length of
             * @returns {Number} squared length of a
             */

            function squaredLength(a) {
                var x = a[0];
                var y = a[1];
                var z = a[2];
                var w = a[3];
                return x * x + y * y + z * z + w * w;
            }
            /**
             * Negates the components of a vec4
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a vector to negate
             * @returns {vec4} out
             */

            function negate(out, a) {
                out[0] = -a[0];
                out[1] = -a[1];
                out[2] = -a[2];
                out[3] = -a[3];
                return out;
            }
            /**
             * Returns the inverse of the components of a vec4
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a vector to invert
             * @returns {vec4} out
             */

            function inverse(out, a) {
                out[0] = 1.0 / a[0];
                out[1] = 1.0 / a[1];
                out[2] = 1.0 / a[2];
                out[3] = 1.0 / a[3];
                return out;
            }
            /**
             * Normalize a vec4
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a vector to normalize
             * @returns {vec4} out
             */

            function normalize(out, a) {
                var x = a[0];
                var y = a[1];
                var z = a[2];
                var w = a[3];
                var len = x * x + y * y + z * z + w * w;

                if (len > 0) {
                    len = 1 / Math.sqrt(len);
                }

                out[0] = x * len;
                out[1] = y * len;
                out[2] = z * len;
                out[3] = w * len;
                return out;
            }
            /**
             * Calculates the dot product of two vec4's
             *
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @returns {Number} dot product of a and b
             */

            function dot(a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
            }
            /**
             * Returns the cross-product of three vectors in a 4-dimensional space
             *
             * @param {ReadonlyVec4} result the receiving vector
             * @param {ReadonlyVec4} U the first vector
             * @param {ReadonlyVec4} V the second vector
             * @param {ReadonlyVec4} W the third vector
             * @returns {vec4} result
             */

            function cross(out, u, v, w) {
                var A = v[0] * w[1] - v[1] * w[0],
                    B = v[0] * w[2] - v[2] * w[0],
                    C = v[0] * w[3] - v[3] * w[0],
                    D = v[1] * w[2] - v[2] * w[1],
                    E = v[1] * w[3] - v[3] * w[1],
                    F = v[2] * w[3] - v[3] * w[2];
                var G = u[0];
                var H = u[1];
                var I = u[2];
                var J = u[3];
                out[0] = H * F - I * E + J * D;
                out[1] = -(G * F) + I * C - J * B;
                out[2] = G * E - H * C + J * A;
                out[3] = -(G * D) + H * B - I * A;
                return out;
            }
            /**
             * Performs a linear interpolation between two vec4's
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the first operand
             * @param {ReadonlyVec4} b the second operand
             * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
             * @returns {vec4} out
             */

            function lerp(out, a, b, t) {
                var ax = a[0];
                var ay = a[1];
                var az = a[2];
                var aw = a[3];
                out[0] = ax + t * (b[0] - ax);
                out[1] = ay + t * (b[1] - ay);
                out[2] = az + t * (b[2] - az);
                out[3] = aw + t * (b[3] - aw);
                return out;
            }
            /**
             * Generates a random vector with the given scale
             *
             * @param {vec4} out the receiving vector
             * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
             * @returns {vec4} out
             */

            function random(out, scale) {
                scale = scale || 1.0; // Marsaglia, George. Choosing a Point from the Surface of a
                // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
                // http://projecteuclid.org/euclid.aoms/1177692644;

                var v1, v2, v3, v4;
                var s1, s2;

                do {
                    v1 = glMatrix.RANDOM() * 2 - 1;
                    v2 = glMatrix.RANDOM() * 2 - 1;
                    s1 = v1 * v1 + v2 * v2;
                } while (s1 >= 1);

                do {
                    v3 = glMatrix.RANDOM() * 2 - 1;
                    v4 = glMatrix.RANDOM() * 2 - 1;
                    s2 = v3 * v3 + v4 * v4;
                } while (s2 >= 1);

                var d = Math.sqrt((1 - s1) / s2);
                out[0] = scale * v1;
                out[1] = scale * v2;
                out[2] = scale * v3 * d;
                out[3] = scale * v4 * d;
                return out;
            }
            /**
             * Transforms the vec4 with a mat4.
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the vector to transform
             * @param {ReadonlyMat4} m matrix to transform with
             * @returns {vec4} out
             */

            function transformMat4(out, a, m) {
                var x = a[0],
                    y = a[1],
                    z = a[2],
                    w = a[3];
                out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
                out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
                out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
                out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
                return out;
            }
            /**
             * Transforms the vec4 with a quat
             *
             * @param {vec4} out the receiving vector
             * @param {ReadonlyVec4} a the vector to transform
             * @param {ReadonlyQuat} q quaternion to transform with
             * @returns {vec4} out
             */

            function transformQuat(out, a, q) {
                var x = a[0],
                    y = a[1],
                    z = a[2];
                var qx = q[0],
                    qy = q[1],
                    qz = q[2],
                    qw = q[3]; // calculate quat * vec

                var ix = qw * x + qy * z - qz * y;
                var iy = qw * y + qz * x - qx * z;
                var iz = qw * z + qx * y - qy * x;
                var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

                out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
                out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
                out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
                out[3] = a[3];
                return out;
            }
            /**
             * Set the components of a vec4 to zero
             *
             * @param {vec4} out the receiving vector
             * @returns {vec4} out
             */

            function zero(out) {
                out[0] = 0.0;
                out[1] = 0.0;
                out[2] = 0.0;
                out[3] = 0.0;
                return out;
            }
            /**
             * Returns a string representation of a vector
             *
             * @param {ReadonlyVec4} a vector to represent as a string
             * @returns {String} string representation of the vector
             */

            function str(a) {
                return (
                    "vec4(" +
                    a[0] +
                    ", " +
                    a[1] +
                    ", " +
                    a[2] +
                    ", " +
                    a[3] +
                    ")"
                );
            }
            /**
             * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
             *
             * @param {ReadonlyVec4} a The first vector.
             * @param {ReadonlyVec4} b The second vector.
             * @returns {Boolean} True if the vectors are equal, false otherwise.
             */

            function exactEquals(a, b) {
                return (
                    a[0] === b[0] &&
                    a[1] === b[1] &&
                    a[2] === b[2] &&
                    a[3] === b[3]
                );
            }
            /**
             * Returns whether or not the vectors have approximately the same elements in the same position.
             *
             * @param {ReadonlyVec4} a The first vector.
             * @param {ReadonlyVec4} b The second vector.
             * @returns {Boolean} True if the vectors are equal, false otherwise.
             */

            function vec4_equals(a, b) {
                var a0 = a[0],
                    a1 = a[1],
                    a2 = a[2],
                    a3 = a[3];
                var b0 = b[0],
                    b1 = b[1],
                    b2 = b[2],
                    b3 = b[3];
                return (
                    Math.abs(a0 - b0) <=
                        glMatrix.EPSILON *
                            Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <=
                        glMatrix.EPSILON *
                            Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                    Math.abs(a2 - b2) <=
                        glMatrix.EPSILON *
                            Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
                    Math.abs(a3 - b3) <=
                        glMatrix.EPSILON *
                            Math.max(1.0, Math.abs(a3), Math.abs(b3))
                );
            }
            /**
             * Alias for {@link vec4.subtract}
             * @function
             */

            var sub = /* unused pure expression or super */ null && subtract;
            /**
             * Alias for {@link vec4.multiply}
             * @function
             */

            var mul = /* unused pure expression or super */ null && multiply;
            /**
             * Alias for {@link vec4.divide}
             * @function
             */

            var div = /* unused pure expression or super */ null && divide;
            /**
             * Alias for {@link vec4.distance}
             * @function
             */

            var dist = /* unused pure expression or super */ null && distance;
            /**
             * Alias for {@link vec4.squaredDistance}
             * @function
             */

            var sqrDist =
                /* unused pure expression or super */ null && squaredDistance;
            /**
             * Alias for {@link vec4.length}
             * @function
             */

            var len = /* unused pure expression or super */ null && vec4_length;
            /**
             * Alias for {@link vec4.squaredLength}
             * @function
             */

            var sqrLen =
                /* unused pure expression or super */ null && squaredLength;
            /**
             * Perform some operation over an array of vec4s.
             *
             * @param {Array} a the array of vectors to iterate over
             * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
             * @param {Number} offset Number of elements to skip at the beginning of the array
             * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
             * @param {Function} fn Function to call for each vector in the array
             * @param {Object} [arg] additional argument to pass to fn
             * @returns {Array} a
             * @function
             */

            var forEach = (function () {
                var vec = create();
                return function (a, stride, offset, count, fn, arg) {
                    var i, l;

                    if (!stride) {
                        stride = 4;
                    }

                    if (!offset) {
                        offset = 0;
                    }

                    if (count) {
                        l = Math.min(count * stride + offset, a.length);
                    } else {
                        l = a.length;
                    }

                    for (i = offset; i < l; i += stride) {
                        vec[0] = a[i];
                        vec[1] = a[i + 1];
                        vec[2] = a[i + 2];
                        vec[3] = a[i + 3];
                        fn(vec, vec, arg);
                        a[i] = vec[0];
                        a[i + 1] = vec[1];
                        a[i + 2] = vec[2];
                        a[i + 3] = vec[3];
                    }

                    return a;
                };
            })(); // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/math-utils.js
            function createMat4() {
                return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            }
            function transformVector(matrix, vector) {
                const result = transformMat4([], vector, matrix);
                scale(result, result, 1 / result[3]);
                return result;
            }
            function mod(value, divisor) {
                const modulus = value % divisor;
                return modulus < 0 ? divisor + modulus : modulus;
            }
            function math_utils_lerp(start, end, step) {
                return step * end + (1 - step) * start;
            }
            function clamp(x, min, max) {
                return x < min ? min : x > max ? max : x;
            }

            function ieLog2(x) {
                return Math.log(x) * Math.LOG2E;
            }

            const log2 = Math.log2 || ieLog2; // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/node_modules/gl-matrix/esm/mat4.js
            //# sourceMappingURL=math-utils.js.map
            /**
             * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
             * @module mat4
             */

            /**
             * Creates a new identity mat4
             *
             * @returns {mat4} a new 4x4 matrix
             */

            function mat4_create() {
                var out = new glMatrix.ARRAY_TYPE(16);

                if (glMatrix.ARRAY_TYPE != Float32Array) {
                    out[1] = 0;
                    out[2] = 0;
                    out[3] = 0;
                    out[4] = 0;
                    out[6] = 0;
                    out[7] = 0;
                    out[8] = 0;
                    out[9] = 0;
                    out[11] = 0;
                    out[12] = 0;
                    out[13] = 0;
                    out[14] = 0;
                }

                out[0] = 1;
                out[5] = 1;
                out[10] = 1;
                out[15] = 1;
                return out;
            }
            /**
             * Creates a new mat4 initialized with values from an existing matrix
             *
             * @param {ReadonlyMat4} a matrix to clone
             * @returns {mat4} a new 4x4 matrix
             */

            function mat4_clone(a) {
                var out = new glMatrix.ARRAY_TYPE(16);
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[8] = a[8];
                out[9] = a[9];
                out[10] = a[10];
                out[11] = a[11];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
                return out;
            }
            /**
             * Copy the values from one mat4 to another
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the source matrix
             * @returns {mat4} out
             */

            function mat4_copy(out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[8] = a[8];
                out[9] = a[9];
                out[10] = a[10];
                out[11] = a[11];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
                return out;
            }
            /**
             * Create a new mat4 with the given values
             *
             * @param {Number} m00 Component in column 0, row 0 position (index 0)
             * @param {Number} m01 Component in column 0, row 1 position (index 1)
             * @param {Number} m02 Component in column 0, row 2 position (index 2)
             * @param {Number} m03 Component in column 0, row 3 position (index 3)
             * @param {Number} m10 Component in column 1, row 0 position (index 4)
             * @param {Number} m11 Component in column 1, row 1 position (index 5)
             * @param {Number} m12 Component in column 1, row 2 position (index 6)
             * @param {Number} m13 Component in column 1, row 3 position (index 7)
             * @param {Number} m20 Component in column 2, row 0 position (index 8)
             * @param {Number} m21 Component in column 2, row 1 position (index 9)
             * @param {Number} m22 Component in column 2, row 2 position (index 10)
             * @param {Number} m23 Component in column 2, row 3 position (index 11)
             * @param {Number} m30 Component in column 3, row 0 position (index 12)
             * @param {Number} m31 Component in column 3, row 1 position (index 13)
             * @param {Number} m32 Component in column 3, row 2 position (index 14)
             * @param {Number} m33 Component in column 3, row 3 position (index 15)
             * @returns {mat4} A new mat4
             */

            function mat4_fromValues(
                m00,
                m01,
                m02,
                m03,
                m10,
                m11,
                m12,
                m13,
                m20,
                m21,
                m22,
                m23,
                m30,
                m31,
                m32,
                m33
            ) {
                var out = new glMatrix.ARRAY_TYPE(16);
                out[0] = m00;
                out[1] = m01;
                out[2] = m02;
                out[3] = m03;
                out[4] = m10;
                out[5] = m11;
                out[6] = m12;
                out[7] = m13;
                out[8] = m20;
                out[9] = m21;
                out[10] = m22;
                out[11] = m23;
                out[12] = m30;
                out[13] = m31;
                out[14] = m32;
                out[15] = m33;
                return out;
            }
            /**
             * Set the components of a mat4 to the given values
             *
             * @param {mat4} out the receiving matrix
             * @param {Number} m00 Component in column 0, row 0 position (index 0)
             * @param {Number} m01 Component in column 0, row 1 position (index 1)
             * @param {Number} m02 Component in column 0, row 2 position (index 2)
             * @param {Number} m03 Component in column 0, row 3 position (index 3)
             * @param {Number} m10 Component in column 1, row 0 position (index 4)
             * @param {Number} m11 Component in column 1, row 1 position (index 5)
             * @param {Number} m12 Component in column 1, row 2 position (index 6)
             * @param {Number} m13 Component in column 1, row 3 position (index 7)
             * @param {Number} m20 Component in column 2, row 0 position (index 8)
             * @param {Number} m21 Component in column 2, row 1 position (index 9)
             * @param {Number} m22 Component in column 2, row 2 position (index 10)
             * @param {Number} m23 Component in column 2, row 3 position (index 11)
             * @param {Number} m30 Component in column 3, row 0 position (index 12)
             * @param {Number} m31 Component in column 3, row 1 position (index 13)
             * @param {Number} m32 Component in column 3, row 2 position (index 14)
             * @param {Number} m33 Component in column 3, row 3 position (index 15)
             * @returns {mat4} out
             */

            function mat4_set(
                out,
                m00,
                m01,
                m02,
                m03,
                m10,
                m11,
                m12,
                m13,
                m20,
                m21,
                m22,
                m23,
                m30,
                m31,
                m32,
                m33
            ) {
                out[0] = m00;
                out[1] = m01;
                out[2] = m02;
                out[3] = m03;
                out[4] = m10;
                out[5] = m11;
                out[6] = m12;
                out[7] = m13;
                out[8] = m20;
                out[9] = m21;
                out[10] = m22;
                out[11] = m23;
                out[12] = m30;
                out[13] = m31;
                out[14] = m32;
                out[15] = m33;
                return out;
            }
            /**
             * Set a mat4 to the identity matrix
             *
             * @param {mat4} out the receiving matrix
             * @returns {mat4} out
             */

            function identity(out) {
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = 1;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = 1;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            }
            /**
             * Transpose the values of a mat4
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the source matrix
             * @returns {mat4} out
             */

            function transpose(out, a) {
                // If we are transposing ourselves we can skip a few steps but have to cache some values
                if (out === a) {
                    var a01 = a[1],
                        a02 = a[2],
                        a03 = a[3];
                    var a12 = a[6],
                        a13 = a[7];
                    var a23 = a[11];
                    out[1] = a[4];
                    out[2] = a[8];
                    out[3] = a[12];
                    out[4] = a01;
                    out[6] = a[9];
                    out[7] = a[13];
                    out[8] = a02;
                    out[9] = a12;
                    out[11] = a[14];
                    out[12] = a03;
                    out[13] = a13;
                    out[14] = a23;
                } else {
                    out[0] = a[0];
                    out[1] = a[4];
                    out[2] = a[8];
                    out[3] = a[12];
                    out[4] = a[1];
                    out[5] = a[5];
                    out[6] = a[9];
                    out[7] = a[13];
                    out[8] = a[2];
                    out[9] = a[6];
                    out[10] = a[10];
                    out[11] = a[14];
                    out[12] = a[3];
                    out[13] = a[7];
                    out[14] = a[11];
                    out[15] = a[15];
                }

                return out;
            }
            /**
             * Inverts a mat4
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the source matrix
             * @returns {mat4} out
             */

            function invert(out, a) {
                var a00 = a[0],
                    a01 = a[1],
                    a02 = a[2],
                    a03 = a[3];
                var a10 = a[4],
                    a11 = a[5],
                    a12 = a[6],
                    a13 = a[7];
                var a20 = a[8],
                    a21 = a[9],
                    a22 = a[10],
                    a23 = a[11];
                var a30 = a[12],
                    a31 = a[13],
                    a32 = a[14],
                    a33 = a[15];
                var b00 = a00 * a11 - a01 * a10;
                var b01 = a00 * a12 - a02 * a10;
                var b02 = a00 * a13 - a03 * a10;
                var b03 = a01 * a12 - a02 * a11;
                var b04 = a01 * a13 - a03 * a11;
                var b05 = a02 * a13 - a03 * a12;
                var b06 = a20 * a31 - a21 * a30;
                var b07 = a20 * a32 - a22 * a30;
                var b08 = a20 * a33 - a23 * a30;
                var b09 = a21 * a32 - a22 * a31;
                var b10 = a21 * a33 - a23 * a31;
                var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

                var det =
                    b00 * b11 -
                    b01 * b10 +
                    b02 * b09 +
                    b03 * b08 -
                    b04 * b07 +
                    b05 * b06;

                if (!det) {
                    return null;
                }

                det = 1.0 / det;
                out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
                out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
                out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
                out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
                out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
                out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
                out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
                out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
                out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
                out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
                out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
                out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
                out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
                out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
                out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
                out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
                return out;
            }
            /**
             * Calculates the adjugate of a mat4
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the source matrix
             * @returns {mat4} out
             */

            function adjoint(out, a) {
                var a00 = a[0],
                    a01 = a[1],
                    a02 = a[2],
                    a03 = a[3];
                var a10 = a[4],
                    a11 = a[5],
                    a12 = a[6],
                    a13 = a[7];
                var a20 = a[8],
                    a21 = a[9],
                    a22 = a[10],
                    a23 = a[11];
                var a30 = a[12],
                    a31 = a[13],
                    a32 = a[14],
                    a33 = a[15];
                out[0] =
                    a11 * (a22 * a33 - a23 * a32) -
                    a21 * (a12 * a33 - a13 * a32) +
                    a31 * (a12 * a23 - a13 * a22);
                out[1] = -(
                    a01 * (a22 * a33 - a23 * a32) -
                    a21 * (a02 * a33 - a03 * a32) +
                    a31 * (a02 * a23 - a03 * a22)
                );
                out[2] =
                    a01 * (a12 * a33 - a13 * a32) -
                    a11 * (a02 * a33 - a03 * a32) +
                    a31 * (a02 * a13 - a03 * a12);
                out[3] = -(
                    a01 * (a12 * a23 - a13 * a22) -
                    a11 * (a02 * a23 - a03 * a22) +
                    a21 * (a02 * a13 - a03 * a12)
                );
                out[4] = -(
                    a10 * (a22 * a33 - a23 * a32) -
                    a20 * (a12 * a33 - a13 * a32) +
                    a30 * (a12 * a23 - a13 * a22)
                );
                out[5] =
                    a00 * (a22 * a33 - a23 * a32) -
                    a20 * (a02 * a33 - a03 * a32) +
                    a30 * (a02 * a23 - a03 * a22);
                out[6] = -(
                    a00 * (a12 * a33 - a13 * a32) -
                    a10 * (a02 * a33 - a03 * a32) +
                    a30 * (a02 * a13 - a03 * a12)
                );
                out[7] =
                    a00 * (a12 * a23 - a13 * a22) -
                    a10 * (a02 * a23 - a03 * a22) +
                    a20 * (a02 * a13 - a03 * a12);
                out[8] =
                    a10 * (a21 * a33 - a23 * a31) -
                    a20 * (a11 * a33 - a13 * a31) +
                    a30 * (a11 * a23 - a13 * a21);
                out[9] = -(
                    a00 * (a21 * a33 - a23 * a31) -
                    a20 * (a01 * a33 - a03 * a31) +
                    a30 * (a01 * a23 - a03 * a21)
                );
                out[10] =
                    a00 * (a11 * a33 - a13 * a31) -
                    a10 * (a01 * a33 - a03 * a31) +
                    a30 * (a01 * a13 - a03 * a11);
                out[11] = -(
                    a00 * (a11 * a23 - a13 * a21) -
                    a10 * (a01 * a23 - a03 * a21) +
                    a20 * (a01 * a13 - a03 * a11)
                );
                out[12] = -(
                    a10 * (a21 * a32 - a22 * a31) -
                    a20 * (a11 * a32 - a12 * a31) +
                    a30 * (a11 * a22 - a12 * a21)
                );
                out[13] =
                    a00 * (a21 * a32 - a22 * a31) -
                    a20 * (a01 * a32 - a02 * a31) +
                    a30 * (a01 * a22 - a02 * a21);
                out[14] = -(
                    a00 * (a11 * a32 - a12 * a31) -
                    a10 * (a01 * a32 - a02 * a31) +
                    a30 * (a01 * a12 - a02 * a11)
                );
                out[15] =
                    a00 * (a11 * a22 - a12 * a21) -
                    a10 * (a01 * a22 - a02 * a21) +
                    a20 * (a01 * a12 - a02 * a11);
                return out;
            }
            /**
             * Calculates the determinant of a mat4
             *
             * @param {ReadonlyMat4} a the source matrix
             * @returns {Number} determinant of a
             */

            function determinant(a) {
                var a00 = a[0],
                    a01 = a[1],
                    a02 = a[2],
                    a03 = a[3];
                var a10 = a[4],
                    a11 = a[5],
                    a12 = a[6],
                    a13 = a[7];
                var a20 = a[8],
                    a21 = a[9],
                    a22 = a[10],
                    a23 = a[11];
                var a30 = a[12],
                    a31 = a[13],
                    a32 = a[14],
                    a33 = a[15];
                var b00 = a00 * a11 - a01 * a10;
                var b01 = a00 * a12 - a02 * a10;
                var b02 = a00 * a13 - a03 * a10;
                var b03 = a01 * a12 - a02 * a11;
                var b04 = a01 * a13 - a03 * a11;
                var b05 = a02 * a13 - a03 * a12;
                var b06 = a20 * a31 - a21 * a30;
                var b07 = a20 * a32 - a22 * a30;
                var b08 = a20 * a33 - a23 * a30;
                var b09 = a21 * a32 - a22 * a31;
                var b10 = a21 * a33 - a23 * a31;
                var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

                return (
                    b00 * b11 -
                    b01 * b10 +
                    b02 * b09 +
                    b03 * b08 -
                    b04 * b07 +
                    b05 * b06
                );
            }
            /**
             * Multiplies two mat4s
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the first operand
             * @param {ReadonlyMat4} b the second operand
             * @returns {mat4} out
             */

            function mat4_multiply(out, a, b) {
                var a00 = a[0],
                    a01 = a[1],
                    a02 = a[2],
                    a03 = a[3];
                var a10 = a[4],
                    a11 = a[5],
                    a12 = a[6],
                    a13 = a[7];
                var a20 = a[8],
                    a21 = a[9],
                    a22 = a[10],
                    a23 = a[11];
                var a30 = a[12],
                    a31 = a[13],
                    a32 = a[14],
                    a33 = a[15]; // Cache only the current line of the second matrix

                var b0 = b[0],
                    b1 = b[1],
                    b2 = b[2],
                    b3 = b[3];
                out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = b[4];
                b1 = b[5];
                b2 = b[6];
                b3 = b[7];
                out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = b[8];
                b1 = b[9];
                b2 = b[10];
                b3 = b[11];
                out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = b[12];
                b1 = b[13];
                b2 = b[14];
                b3 = b[15];
                out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                return out;
            }
            /**
             * Translate a mat4 by the given vector
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to translate
             * @param {ReadonlyVec3} v vector to translate by
             * @returns {mat4} out
             */

            function translate(out, a, v) {
                var x = v[0],
                    y = v[1],
                    z = v[2];
                var a00, a01, a02, a03;
                var a10, a11, a12, a13;
                var a20, a21, a22, a23;

                if (a === out) {
                    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
                    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
                    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
                    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
                } else {
                    a00 = a[0];
                    a01 = a[1];
                    a02 = a[2];
                    a03 = a[3];
                    a10 = a[4];
                    a11 = a[5];
                    a12 = a[6];
                    a13 = a[7];
                    a20 = a[8];
                    a21 = a[9];
                    a22 = a[10];
                    a23 = a[11];
                    out[0] = a00;
                    out[1] = a01;
                    out[2] = a02;
                    out[3] = a03;
                    out[4] = a10;
                    out[5] = a11;
                    out[6] = a12;
                    out[7] = a13;
                    out[8] = a20;
                    out[9] = a21;
                    out[10] = a22;
                    out[11] = a23;
                    out[12] = a00 * x + a10 * y + a20 * z + a[12];
                    out[13] = a01 * x + a11 * y + a21 * z + a[13];
                    out[14] = a02 * x + a12 * y + a22 * z + a[14];
                    out[15] = a03 * x + a13 * y + a23 * z + a[15];
                }

                return out;
            }
            /**
             * Scales the mat4 by the dimensions in the given vec3 not using vectorization
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to scale
             * @param {ReadonlyVec3} v the vec3 to scale the matrix by
             * @returns {mat4} out
             **/

            function mat4_scale(out, a, v) {
                var x = v[0],
                    y = v[1],
                    z = v[2];
                out[0] = a[0] * x;
                out[1] = a[1] * x;
                out[2] = a[2] * x;
                out[3] = a[3] * x;
                out[4] = a[4] * y;
                out[5] = a[5] * y;
                out[6] = a[6] * y;
                out[7] = a[7] * y;
                out[8] = a[8] * z;
                out[9] = a[9] * z;
                out[10] = a[10] * z;
                out[11] = a[11] * z;
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
                return out;
            }
            /**
             * Rotates a mat4 by the given angle around the given axis
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to rotate
             * @param {Number} rad the angle to rotate the matrix by
             * @param {ReadonlyVec3} axis the axis to rotate around
             * @returns {mat4} out
             */

            function rotate(out, a, rad, axis) {
                var x = axis[0],
                    y = axis[1],
                    z = axis[2];
                var len = Math.hypot(x, y, z);
                var s, c, t;
                var a00, a01, a02, a03;
                var a10, a11, a12, a13;
                var a20, a21, a22, a23;
                var b00, b01, b02;
                var b10, b11, b12;
                var b20, b21, b22;

                if (len < glMatrix.EPSILON) {
                    return null;
                }

                len = 1 / len;
                x *= len;
                y *= len;
                z *= len;
                s = Math.sin(rad);
                c = Math.cos(rad);
                t = 1 - c;
                a00 = a[0];
                a01 = a[1];
                a02 = a[2];
                a03 = a[3];
                a10 = a[4];
                a11 = a[5];
                a12 = a[6];
                a13 = a[7];
                a20 = a[8];
                a21 = a[9];
                a22 = a[10];
                a23 = a[11]; // Construct the elements of the rotation matrix

                b00 = x * x * t + c;
                b01 = y * x * t + z * s;
                b02 = z * x * t - y * s;
                b10 = x * y * t - z * s;
                b11 = y * y * t + c;
                b12 = z * y * t + x * s;
                b20 = x * z * t + y * s;
                b21 = y * z * t - x * s;
                b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

                out[0] = a00 * b00 + a10 * b01 + a20 * b02;
                out[1] = a01 * b00 + a11 * b01 + a21 * b02;
                out[2] = a02 * b00 + a12 * b01 + a22 * b02;
                out[3] = a03 * b00 + a13 * b01 + a23 * b02;
                out[4] = a00 * b10 + a10 * b11 + a20 * b12;
                out[5] = a01 * b10 + a11 * b11 + a21 * b12;
                out[6] = a02 * b10 + a12 * b11 + a22 * b12;
                out[7] = a03 * b10 + a13 * b11 + a23 * b12;
                out[8] = a00 * b20 + a10 * b21 + a20 * b22;
                out[9] = a01 * b20 + a11 * b21 + a21 * b22;
                out[10] = a02 * b20 + a12 * b21 + a22 * b22;
                out[11] = a03 * b20 + a13 * b21 + a23 * b22;

                if (a !== out) {
                    // If the source and destination differ, copy the unchanged last row
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                }

                return out;
            }
            /**
             * Rotates a matrix by the given angle around the X axis
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to rotate
             * @param {Number} rad the angle to rotate the matrix by
             * @returns {mat4} out
             */

            function rotateX(out, a, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                var a10 = a[4];
                var a11 = a[5];
                var a12 = a[6];
                var a13 = a[7];
                var a20 = a[8];
                var a21 = a[9];
                var a22 = a[10];
                var a23 = a[11];

                if (a !== out) {
                    // If the source and destination differ, copy the unchanged rows
                    out[0] = a[0];
                    out[1] = a[1];
                    out[2] = a[2];
                    out[3] = a[3];
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                } // Perform axis-specific matrix multiplication

                out[4] = a10 * c + a20 * s;
                out[5] = a11 * c + a21 * s;
                out[6] = a12 * c + a22 * s;
                out[7] = a13 * c + a23 * s;
                out[8] = a20 * c - a10 * s;
                out[9] = a21 * c - a11 * s;
                out[10] = a22 * c - a12 * s;
                out[11] = a23 * c - a13 * s;
                return out;
            }
            /**
             * Rotates a matrix by the given angle around the Y axis
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to rotate
             * @param {Number} rad the angle to rotate the matrix by
             * @returns {mat4} out
             */

            function rotateY(out, a, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                var a00 = a[0];
                var a01 = a[1];
                var a02 = a[2];
                var a03 = a[3];
                var a20 = a[8];
                var a21 = a[9];
                var a22 = a[10];
                var a23 = a[11];

                if (a !== out) {
                    // If the source and destination differ, copy the unchanged rows
                    out[4] = a[4];
                    out[5] = a[5];
                    out[6] = a[6];
                    out[7] = a[7];
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                } // Perform axis-specific matrix multiplication

                out[0] = a00 * c - a20 * s;
                out[1] = a01 * c - a21 * s;
                out[2] = a02 * c - a22 * s;
                out[3] = a03 * c - a23 * s;
                out[8] = a00 * s + a20 * c;
                out[9] = a01 * s + a21 * c;
                out[10] = a02 * s + a22 * c;
                out[11] = a03 * s + a23 * c;
                return out;
            }
            /**
             * Rotates a matrix by the given angle around the Z axis
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to rotate
             * @param {Number} rad the angle to rotate the matrix by
             * @returns {mat4} out
             */

            function rotateZ(out, a, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad);
                var a00 = a[0];
                var a01 = a[1];
                var a02 = a[2];
                var a03 = a[3];
                var a10 = a[4];
                var a11 = a[5];
                var a12 = a[6];
                var a13 = a[7];

                if (a !== out) {
                    // If the source and destination differ, copy the unchanged last row
                    out[8] = a[8];
                    out[9] = a[9];
                    out[10] = a[10];
                    out[11] = a[11];
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                } // Perform axis-specific matrix multiplication

                out[0] = a00 * c + a10 * s;
                out[1] = a01 * c + a11 * s;
                out[2] = a02 * c + a12 * s;
                out[3] = a03 * c + a13 * s;
                out[4] = a10 * c - a00 * s;
                out[5] = a11 * c - a01 * s;
                out[6] = a12 * c - a02 * s;
                out[7] = a13 * c - a03 * s;
                return out;
            }
            /**
             * Creates a matrix from a vector translation
             * This is equivalent to (but much faster than):
             *
             *     mat4.identity(dest);
             *     mat4.translate(dest, dest, vec);
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {ReadonlyVec3} v Translation vector
             * @returns {mat4} out
             */

            function fromTranslation(out, v) {
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = 1;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = 1;
                out[11] = 0;
                out[12] = v[0];
                out[13] = v[1];
                out[14] = v[2];
                out[15] = 1;
                return out;
            }
            /**
             * Creates a matrix from a vector scaling
             * This is equivalent to (but much faster than):
             *
             *     mat4.identity(dest);
             *     mat4.scale(dest, dest, vec);
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {ReadonlyVec3} v Scaling vector
             * @returns {mat4} out
             */

            function fromScaling(out, v) {
                out[0] = v[0];
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = v[1];
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = v[2];
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            }
            /**
             * Creates a matrix from a given angle around a given axis
             * This is equivalent to (but much faster than):
             *
             *     mat4.identity(dest);
             *     mat4.rotate(dest, dest, rad, axis);
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {Number} rad the angle to rotate the matrix by
             * @param {ReadonlyVec3} axis the axis to rotate around
             * @returns {mat4} out
             */

            function fromRotation(out, rad, axis) {
                var x = axis[0],
                    y = axis[1],
                    z = axis[2];
                var len = Math.hypot(x, y, z);
                var s, c, t;

                if (len < glMatrix.EPSILON) {
                    return null;
                }

                len = 1 / len;
                x *= len;
                y *= len;
                z *= len;
                s = Math.sin(rad);
                c = Math.cos(rad);
                t = 1 - c; // Perform rotation-specific matrix multiplication

                out[0] = x * x * t + c;
                out[1] = y * x * t + z * s;
                out[2] = z * x * t - y * s;
                out[3] = 0;
                out[4] = x * y * t - z * s;
                out[5] = y * y * t + c;
                out[6] = z * y * t + x * s;
                out[7] = 0;
                out[8] = x * z * t + y * s;
                out[9] = y * z * t - x * s;
                out[10] = z * z * t + c;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            }
            /**
             * Creates a matrix from the given angle around the X axis
             * This is equivalent to (but much faster than):
             *
             *     mat4.identity(dest);
             *     mat4.rotateX(dest, dest, rad);
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {Number} rad the angle to rotate the matrix by
             * @returns {mat4} out
             */

            function fromXRotation(out, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad); // Perform axis-specific matrix multiplication

                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = c;
                out[6] = s;
                out[7] = 0;
                out[8] = 0;
                out[9] = -s;
                out[10] = c;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            }
            /**
             * Creates a matrix from the given angle around the Y axis
             * This is equivalent to (but much faster than):
             *
             *     mat4.identity(dest);
             *     mat4.rotateY(dest, dest, rad);
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {Number} rad the angle to rotate the matrix by
             * @returns {mat4} out
             */

            function fromYRotation(out, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad); // Perform axis-specific matrix multiplication

                out[0] = c;
                out[1] = 0;
                out[2] = -s;
                out[3] = 0;
                out[4] = 0;
                out[5] = 1;
                out[6] = 0;
                out[7] = 0;
                out[8] = s;
                out[9] = 0;
                out[10] = c;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            }
            /**
             * Creates a matrix from the given angle around the Z axis
             * This is equivalent to (but much faster than):
             *
             *     mat4.identity(dest);
             *     mat4.rotateZ(dest, dest, rad);
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {Number} rad the angle to rotate the matrix by
             * @returns {mat4} out
             */

            function fromZRotation(out, rad) {
                var s = Math.sin(rad);
                var c = Math.cos(rad); // Perform axis-specific matrix multiplication

                out[0] = c;
                out[1] = s;
                out[2] = 0;
                out[3] = 0;
                out[4] = -s;
                out[5] = c;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = 1;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            }
            /**
             * Creates a matrix from a quaternion rotation and vector translation
             * This is equivalent to (but much faster than):
             *
             *     mat4.identity(dest);
             *     mat4.translate(dest, vec);
             *     let quatMat = mat4.create();
             *     quat4.toMat4(quat, quatMat);
             *     mat4.multiply(dest, quatMat);
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {quat4} q Rotation quaternion
             * @param {ReadonlyVec3} v Translation vector
             * @returns {mat4} out
             */

            function fromRotationTranslation(out, q, v) {
                // Quaternion math
                var x = q[0],
                    y = q[1],
                    z = q[2],
                    w = q[3];
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var xy = x * y2;
                var xz = x * z2;
                var yy = y * y2;
                var yz = y * z2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                out[0] = 1 - (yy + zz);
                out[1] = xy + wz;
                out[2] = xz - wy;
                out[3] = 0;
                out[4] = xy - wz;
                out[5] = 1 - (xx + zz);
                out[6] = yz + wx;
                out[7] = 0;
                out[8] = xz + wy;
                out[9] = yz - wx;
                out[10] = 1 - (xx + yy);
                out[11] = 0;
                out[12] = v[0];
                out[13] = v[1];
                out[14] = v[2];
                out[15] = 1;
                return out;
            }
            /**
             * Creates a new mat4 from a dual quat.
             *
             * @param {mat4} out Matrix
             * @param {ReadonlyQuat2} a Dual Quaternion
             * @returns {mat4} mat4 receiving operation result
             */

            function fromQuat2(out, a) {
                var translation = new glMatrix.ARRAY_TYPE(3);
                var bx = -a[0],
                    by = -a[1],
                    bz = -a[2],
                    bw = a[3],
                    ax = a[4],
                    ay = a[5],
                    az = a[6],
                    aw = a[7];
                var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

                if (magnitude > 0) {
                    translation[0] =
                        ((ax * bw + aw * bx + ay * bz - az * by) * 2) /
                        magnitude;
                    translation[1] =
                        ((ay * bw + aw * by + az * bx - ax * bz) * 2) /
                        magnitude;
                    translation[2] =
                        ((az * bw + aw * bz + ax * by - ay * bx) * 2) /
                        magnitude;
                } else {
                    translation[0] =
                        (ax * bw + aw * bx + ay * bz - az * by) * 2;
                    translation[1] =
                        (ay * bw + aw * by + az * bx - ax * bz) * 2;
                    translation[2] =
                        (az * bw + aw * bz + ax * by - ay * bx) * 2;
                }

                fromRotationTranslation(out, a, translation);
                return out;
            }
            /**
             * Returns the translation vector component of a transformation
             *  matrix. If a matrix is built with fromRotationTranslation,
             *  the returned vector will be the same as the translation vector
             *  originally supplied.
             * @param  {vec3} out Vector to receive translation component
             * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
             * @return {vec3} out
             */

            function getTranslation(out, mat) {
                out[0] = mat[12];
                out[1] = mat[13];
                out[2] = mat[14];
                return out;
            }
            /**
             * Returns the scaling factor component of a transformation
             *  matrix. If a matrix is built with fromRotationTranslationScale
             *  with a normalized Quaternion paramter, the returned vector will be
             *  the same as the scaling vector
             *  originally supplied.
             * @param  {vec3} out Vector to receive scaling factor component
             * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
             * @return {vec3} out
             */

            function getScaling(out, mat) {
                var m11 = mat[0];
                var m12 = mat[1];
                var m13 = mat[2];
                var m21 = mat[4];
                var m22 = mat[5];
                var m23 = mat[6];
                var m31 = mat[8];
                var m32 = mat[9];
                var m33 = mat[10];
                out[0] = Math.hypot(m11, m12, m13);
                out[1] = Math.hypot(m21, m22, m23);
                out[2] = Math.hypot(m31, m32, m33);
                return out;
            }
            /**
             * Returns a quaternion representing the rotational component
             *  of a transformation matrix. If a matrix is built with
             *  fromRotationTranslation, the returned quaternion will be the
             *  same as the quaternion originally supplied.
             * @param {quat} out Quaternion to receive the rotation component
             * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
             * @return {quat} out
             */

            function getRotation(out, mat) {
                var scaling = new glMatrix.ARRAY_TYPE(3);
                getScaling(scaling, mat);
                var is1 = 1 / scaling[0];
                var is2 = 1 / scaling[1];
                var is3 = 1 / scaling[2];
                var sm11 = mat[0] * is1;
                var sm12 = mat[1] * is2;
                var sm13 = mat[2] * is3;
                var sm21 = mat[4] * is1;
                var sm22 = mat[5] * is2;
                var sm23 = mat[6] * is3;
                var sm31 = mat[8] * is1;
                var sm32 = mat[9] * is2;
                var sm33 = mat[10] * is3;
                var trace = sm11 + sm22 + sm33;
                var S = 0;

                if (trace > 0) {
                    S = Math.sqrt(trace + 1.0) * 2;
                    out[3] = 0.25 * S;
                    out[0] = (sm23 - sm32) / S;
                    out[1] = (sm31 - sm13) / S;
                    out[2] = (sm12 - sm21) / S;
                } else if (sm11 > sm22 && sm11 > sm33) {
                    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
                    out[3] = (sm23 - sm32) / S;
                    out[0] = 0.25 * S;
                    out[1] = (sm12 + sm21) / S;
                    out[2] = (sm31 + sm13) / S;
                } else if (sm22 > sm33) {
                    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
                    out[3] = (sm31 - sm13) / S;
                    out[0] = (sm12 + sm21) / S;
                    out[1] = 0.25 * S;
                    out[2] = (sm23 + sm32) / S;
                } else {
                    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
                    out[3] = (sm12 - sm21) / S;
                    out[0] = (sm31 + sm13) / S;
                    out[1] = (sm23 + sm32) / S;
                    out[2] = 0.25 * S;
                }

                return out;
            }
            /**
             * Creates a matrix from a quaternion rotation, vector translation and vector scale
             * This is equivalent to (but much faster than):
             *
             *     mat4.identity(dest);
             *     mat4.translate(dest, vec);
             *     let quatMat = mat4.create();
             *     quat4.toMat4(quat, quatMat);
             *     mat4.multiply(dest, quatMat);
             *     mat4.scale(dest, scale)
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {quat4} q Rotation quaternion
             * @param {ReadonlyVec3} v Translation vector
             * @param {ReadonlyVec3} s Scaling vector
             * @returns {mat4} out
             */

            function fromRotationTranslationScale(out, q, v, s) {
                // Quaternion math
                var x = q[0],
                    y = q[1],
                    z = q[2],
                    w = q[3];
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var xy = x * y2;
                var xz = x * z2;
                var yy = y * y2;
                var yz = y * z2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                var sx = s[0];
                var sy = s[1];
                var sz = s[2];
                out[0] = (1 - (yy + zz)) * sx;
                out[1] = (xy + wz) * sx;
                out[2] = (xz - wy) * sx;
                out[3] = 0;
                out[4] = (xy - wz) * sy;
                out[5] = (1 - (xx + zz)) * sy;
                out[6] = (yz + wx) * sy;
                out[7] = 0;
                out[8] = (xz + wy) * sz;
                out[9] = (yz - wx) * sz;
                out[10] = (1 - (xx + yy)) * sz;
                out[11] = 0;
                out[12] = v[0];
                out[13] = v[1];
                out[14] = v[2];
                out[15] = 1;
                return out;
            }
            /**
             * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
             * This is equivalent to (but much faster than):
             *
             *     mat4.identity(dest);
             *     mat4.translate(dest, vec);
             *     mat4.translate(dest, origin);
             *     let quatMat = mat4.create();
             *     quat4.toMat4(quat, quatMat);
             *     mat4.multiply(dest, quatMat);
             *     mat4.scale(dest, scale)
             *     mat4.translate(dest, negativeOrigin);
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {quat4} q Rotation quaternion
             * @param {ReadonlyVec3} v Translation vector
             * @param {ReadonlyVec3} s Scaling vector
             * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
             * @returns {mat4} out
             */

            function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
                // Quaternion math
                var x = q[0],
                    y = q[1],
                    z = q[2],
                    w = q[3];
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var xy = x * y2;
                var xz = x * z2;
                var yy = y * y2;
                var yz = y * z2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                var sx = s[0];
                var sy = s[1];
                var sz = s[2];
                var ox = o[0];
                var oy = o[1];
                var oz = o[2];
                var out0 = (1 - (yy + zz)) * sx;
                var out1 = (xy + wz) * sx;
                var out2 = (xz - wy) * sx;
                var out4 = (xy - wz) * sy;
                var out5 = (1 - (xx + zz)) * sy;
                var out6 = (yz + wx) * sy;
                var out8 = (xz + wy) * sz;
                var out9 = (yz - wx) * sz;
                var out10 = (1 - (xx + yy)) * sz;
                out[0] = out0;
                out[1] = out1;
                out[2] = out2;
                out[3] = 0;
                out[4] = out4;
                out[5] = out5;
                out[6] = out6;
                out[7] = 0;
                out[8] = out8;
                out[9] = out9;
                out[10] = out10;
                out[11] = 0;
                out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
                out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
                out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
                out[15] = 1;
                return out;
            }
            /**
             * Calculates a 4x4 matrix from the given quaternion
             *
             * @param {mat4} out mat4 receiving operation result
             * @param {ReadonlyQuat} q Quaternion to create matrix from
             *
             * @returns {mat4} out
             */

            function fromQuat(out, q) {
                var x = q[0],
                    y = q[1],
                    z = q[2],
                    w = q[3];
                var x2 = x + x;
                var y2 = y + y;
                var z2 = z + z;
                var xx = x * x2;
                var yx = y * x2;
                var yy = y * y2;
                var zx = z * x2;
                var zy = z * y2;
                var zz = z * z2;
                var wx = w * x2;
                var wy = w * y2;
                var wz = w * z2;
                out[0] = 1 - yy - zz;
                out[1] = yx + wz;
                out[2] = zx - wy;
                out[3] = 0;
                out[4] = yx - wz;
                out[5] = 1 - xx - zz;
                out[6] = zy + wx;
                out[7] = 0;
                out[8] = zx + wy;
                out[9] = zy - wx;
                out[10] = 1 - xx - yy;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            }
            /**
             * Generates a frustum matrix with the given bounds
             *
             * @param {mat4} out mat4 frustum matrix will be written into
             * @param {Number} left Left bound of the frustum
             * @param {Number} right Right bound of the frustum
             * @param {Number} bottom Bottom bound of the frustum
             * @param {Number} top Top bound of the frustum
             * @param {Number} near Near bound of the frustum
             * @param {Number} far Far bound of the frustum
             * @returns {mat4} out
             */

            function frustum(out, left, right, bottom, top, near, far) {
                var rl = 1 / (right - left);
                var tb = 1 / (top - bottom);
                var nf = 1 / (near - far);
                out[0] = near * 2 * rl;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = near * 2 * tb;
                out[6] = 0;
                out[7] = 0;
                out[8] = (right + left) * rl;
                out[9] = (top + bottom) * tb;
                out[10] = (far + near) * nf;
                out[11] = -1;
                out[12] = 0;
                out[13] = 0;
                out[14] = far * near * 2 * nf;
                out[15] = 0;
                return out;
            }
            /**
             * Generates a perspective projection matrix with the given bounds.
             * Passing null/undefined/no value for far will generate infinite projection matrix.
             *
             * @param {mat4} out mat4 frustum matrix will be written into
             * @param {number} fovy Vertical field of view in radians
             * @param {number} aspect Aspect ratio. typically viewport width/height
             * @param {number} near Near bound of the frustum
             * @param {number} far Far bound of the frustum, can be null or Infinity
             * @returns {mat4} out
             */

            function perspective(out, fovy, aspect, near, far) {
                var f = 1.0 / Math.tan(fovy / 2),
                    nf;
                out[0] = f / aspect;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = f;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[11] = -1;
                out[12] = 0;
                out[13] = 0;
                out[15] = 0;

                if (far != null && far !== Infinity) {
                    nf = 1 / (near - far);
                    out[10] = (far + near) * nf;
                    out[14] = 2 * far * near * nf;
                } else {
                    out[10] = -1;
                    out[14] = -2 * near;
                }

                return out;
            }
            /**
             * Generates a perspective projection matrix with the given field of view.
             * This is primarily useful for generating projection matrices to be used
             * with the still experiemental WebVR API.
             *
             * @param {mat4} out mat4 frustum matrix will be written into
             * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
             * @param {number} near Near bound of the frustum
             * @param {number} far Far bound of the frustum
             * @returns {mat4} out
             */

            function perspectiveFromFieldOfView(out, fov, near, far) {
                var upTan = Math.tan((fov.upDegrees * Math.PI) / 180.0);
                var downTan = Math.tan((fov.downDegrees * Math.PI) / 180.0);
                var leftTan = Math.tan((fov.leftDegrees * Math.PI) / 180.0);
                var rightTan = Math.tan((fov.rightDegrees * Math.PI) / 180.0);
                var xScale = 2.0 / (leftTan + rightTan);
                var yScale = 2.0 / (upTan + downTan);
                out[0] = xScale;
                out[1] = 0.0;
                out[2] = 0.0;
                out[3] = 0.0;
                out[4] = 0.0;
                out[5] = yScale;
                out[6] = 0.0;
                out[7] = 0.0;
                out[8] = -((leftTan - rightTan) * xScale * 0.5);
                out[9] = (upTan - downTan) * yScale * 0.5;
                out[10] = far / (near - far);
                out[11] = -1.0;
                out[12] = 0.0;
                out[13] = 0.0;
                out[14] = (far * near) / (near - far);
                out[15] = 0.0;
                return out;
            }
            /**
             * Generates a orthogonal projection matrix with the given bounds
             *
             * @param {mat4} out mat4 frustum matrix will be written into
             * @param {number} left Left bound of the frustum
             * @param {number} right Right bound of the frustum
             * @param {number} bottom Bottom bound of the frustum
             * @param {number} top Top bound of the frustum
             * @param {number} near Near bound of the frustum
             * @param {number} far Far bound of the frustum
             * @returns {mat4} out
             */

            function ortho(out, left, right, bottom, top, near, far) {
                var lr = 1 / (left - right);
                var bt = 1 / (bottom - top);
                var nf = 1 / (near - far);
                out[0] = -2 * lr;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = -2 * bt;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = 2 * nf;
                out[11] = 0;
                out[12] = (left + right) * lr;
                out[13] = (top + bottom) * bt;
                out[14] = (far + near) * nf;
                out[15] = 1;
                return out;
            }
            /**
             * Generates a look-at matrix with the given eye position, focal point, and up axis.
             * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
             *
             * @param {mat4} out mat4 frustum matrix will be written into
             * @param {ReadonlyVec3} eye Position of the viewer
             * @param {ReadonlyVec3} center Point the viewer is looking at
             * @param {ReadonlyVec3} up vec3 pointing up
             * @returns {mat4} out
             */

            function lookAt(out, eye, center, up) {
                var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
                var eyex = eye[0];
                var eyey = eye[1];
                var eyez = eye[2];
                var upx = up[0];
                var upy = up[1];
                var upz = up[2];
                var centerx = center[0];
                var centery = center[1];
                var centerz = center[2];

                if (
                    Math.abs(eyex - centerx) < glMatrix.EPSILON &&
                    Math.abs(eyey - centery) < glMatrix.EPSILON &&
                    Math.abs(eyez - centerz) < glMatrix.EPSILON
                ) {
                    return identity(out);
                }

                z0 = eyex - centerx;
                z1 = eyey - centery;
                z2 = eyez - centerz;
                len = 1 / Math.hypot(z0, z1, z2);
                z0 *= len;
                z1 *= len;
                z2 *= len;
                x0 = upy * z2 - upz * z1;
                x1 = upz * z0 - upx * z2;
                x2 = upx * z1 - upy * z0;
                len = Math.hypot(x0, x1, x2);

                if (!len) {
                    x0 = 0;
                    x1 = 0;
                    x2 = 0;
                } else {
                    len = 1 / len;
                    x0 *= len;
                    x1 *= len;
                    x2 *= len;
                }

                y0 = z1 * x2 - z2 * x1;
                y1 = z2 * x0 - z0 * x2;
                y2 = z0 * x1 - z1 * x0;
                len = Math.hypot(y0, y1, y2);

                if (!len) {
                    y0 = 0;
                    y1 = 0;
                    y2 = 0;
                } else {
                    len = 1 / len;
                    y0 *= len;
                    y1 *= len;
                    y2 *= len;
                }

                out[0] = x0;
                out[1] = y0;
                out[2] = z0;
                out[3] = 0;
                out[4] = x1;
                out[5] = y1;
                out[6] = z1;
                out[7] = 0;
                out[8] = x2;
                out[9] = y2;
                out[10] = z2;
                out[11] = 0;
                out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
                out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
                out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
                out[15] = 1;
                return out;
            }
            /**
             * Generates a matrix that makes something look at something else.
             *
             * @param {mat4} out mat4 frustum matrix will be written into
             * @param {ReadonlyVec3} eye Position of the viewer
             * @param {ReadonlyVec3} center Point the viewer is looking at
             * @param {ReadonlyVec3} up vec3 pointing up
             * @returns {mat4} out
             */

            function targetTo(out, eye, target, up) {
                var eyex = eye[0],
                    eyey = eye[1],
                    eyez = eye[2],
                    upx = up[0],
                    upy = up[1],
                    upz = up[2];
                var z0 = eyex - target[0],
                    z1 = eyey - target[1],
                    z2 = eyez - target[2];
                var len = z0 * z0 + z1 * z1 + z2 * z2;

                if (len > 0) {
                    len = 1 / Math.sqrt(len);
                    z0 *= len;
                    z1 *= len;
                    z2 *= len;
                }

                var x0 = upy * z2 - upz * z1,
                    x1 = upz * z0 - upx * z2,
                    x2 = upx * z1 - upy * z0;
                len = x0 * x0 + x1 * x1 + x2 * x2;

                if (len > 0) {
                    len = 1 / Math.sqrt(len);
                    x0 *= len;
                    x1 *= len;
                    x2 *= len;
                }

                out[0] = x0;
                out[1] = x1;
                out[2] = x2;
                out[3] = 0;
                out[4] = z1 * x2 - z2 * x1;
                out[5] = z2 * x0 - z0 * x2;
                out[6] = z0 * x1 - z1 * x0;
                out[7] = 0;
                out[8] = z0;
                out[9] = z1;
                out[10] = z2;
                out[11] = 0;
                out[12] = eyex;
                out[13] = eyey;
                out[14] = eyez;
                out[15] = 1;
                return out;
            }
            /**
             * Returns a string representation of a mat4
             *
             * @param {ReadonlyMat4} a matrix to represent as a string
             * @returns {String} string representation of the matrix
             */

            function mat4_str(a) {
                return (
                    "mat4(" +
                    a[0] +
                    ", " +
                    a[1] +
                    ", " +
                    a[2] +
                    ", " +
                    a[3] +
                    ", " +
                    a[4] +
                    ", " +
                    a[5] +
                    ", " +
                    a[6] +
                    ", " +
                    a[7] +
                    ", " +
                    a[8] +
                    ", " +
                    a[9] +
                    ", " +
                    a[10] +
                    ", " +
                    a[11] +
                    ", " +
                    a[12] +
                    ", " +
                    a[13] +
                    ", " +
                    a[14] +
                    ", " +
                    a[15] +
                    ")"
                );
            }
            /**
             * Returns Frobenius norm of a mat4
             *
             * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
             * @returns {Number} Frobenius norm
             */

            function frob(a) {
                return Math.hypot(
                    a[0],
                    a[1],
                    a[2],
                    a[3],
                    a[4],
                    a[5],
                    a[6],
                    a[7],
                    a[8],
                    a[9],
                    a[10],
                    a[11],
                    a[12],
                    a[13],
                    a[14],
                    a[15]
                );
            }
            /**
             * Adds two mat4's
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the first operand
             * @param {ReadonlyMat4} b the second operand
             * @returns {mat4} out
             */

            function mat4_add(out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                out[2] = a[2] + b[2];
                out[3] = a[3] + b[3];
                out[4] = a[4] + b[4];
                out[5] = a[5] + b[5];
                out[6] = a[6] + b[6];
                out[7] = a[7] + b[7];
                out[8] = a[8] + b[8];
                out[9] = a[9] + b[9];
                out[10] = a[10] + b[10];
                out[11] = a[11] + b[11];
                out[12] = a[12] + b[12];
                out[13] = a[13] + b[13];
                out[14] = a[14] + b[14];
                out[15] = a[15] + b[15];
                return out;
            }
            /**
             * Subtracts matrix b from matrix a
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the first operand
             * @param {ReadonlyMat4} b the second operand
             * @returns {mat4} out
             */

            function mat4_subtract(out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                out[2] = a[2] - b[2];
                out[3] = a[3] - b[3];
                out[4] = a[4] - b[4];
                out[5] = a[5] - b[5];
                out[6] = a[6] - b[6];
                out[7] = a[7] - b[7];
                out[8] = a[8] - b[8];
                out[9] = a[9] - b[9];
                out[10] = a[10] - b[10];
                out[11] = a[11] - b[11];
                out[12] = a[12] - b[12];
                out[13] = a[13] - b[13];
                out[14] = a[14] - b[14];
                out[15] = a[15] - b[15];
                return out;
            }
            /**
             * Multiply each element of the matrix by a scalar.
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to scale
             * @param {Number} b amount to scale the matrix's elements by
             * @returns {mat4} out
             */

            function multiplyScalar(out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                out[2] = a[2] * b;
                out[3] = a[3] * b;
                out[4] = a[4] * b;
                out[5] = a[5] * b;
                out[6] = a[6] * b;
                out[7] = a[7] * b;
                out[8] = a[8] * b;
                out[9] = a[9] * b;
                out[10] = a[10] * b;
                out[11] = a[11] * b;
                out[12] = a[12] * b;
                out[13] = a[13] * b;
                out[14] = a[14] * b;
                out[15] = a[15] * b;
                return out;
            }
            /**
             * Adds two mat4's after multiplying each element of the second operand by a scalar value.
             *
             * @param {mat4} out the receiving vector
             * @param {ReadonlyMat4} a the first operand
             * @param {ReadonlyMat4} b the second operand
             * @param {Number} scale the amount to scale b's elements by before adding
             * @returns {mat4} out
             */

            function multiplyScalarAndAdd(out, a, b, scale) {
                out[0] = a[0] + b[0] * scale;
                out[1] = a[1] + b[1] * scale;
                out[2] = a[2] + b[2] * scale;
                out[3] = a[3] + b[3] * scale;
                out[4] = a[4] + b[4] * scale;
                out[5] = a[5] + b[5] * scale;
                out[6] = a[6] + b[6] * scale;
                out[7] = a[7] + b[7] * scale;
                out[8] = a[8] + b[8] * scale;
                out[9] = a[9] + b[9] * scale;
                out[10] = a[10] + b[10] * scale;
                out[11] = a[11] + b[11] * scale;
                out[12] = a[12] + b[12] * scale;
                out[13] = a[13] + b[13] * scale;
                out[14] = a[14] + b[14] * scale;
                out[15] = a[15] + b[15] * scale;
                return out;
            }
            /**
             * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
             *
             * @param {ReadonlyMat4} a The first matrix.
             * @param {ReadonlyMat4} b The second matrix.
             * @returns {Boolean} True if the matrices are equal, false otherwise.
             */

            function mat4_exactEquals(a, b) {
                return (
                    a[0] === b[0] &&
                    a[1] === b[1] &&
                    a[2] === b[2] &&
                    a[3] === b[3] &&
                    a[4] === b[4] &&
                    a[5] === b[5] &&
                    a[6] === b[6] &&
                    a[7] === b[7] &&
                    a[8] === b[8] &&
                    a[9] === b[9] &&
                    a[10] === b[10] &&
                    a[11] === b[11] &&
                    a[12] === b[12] &&
                    a[13] === b[13] &&
                    a[14] === b[14] &&
                    a[15] === b[15]
                );
            }
            /**
             * Returns whether or not the matrices have approximately the same elements in the same position.
             *
             * @param {ReadonlyMat4} a The first matrix.
             * @param {ReadonlyMat4} b The second matrix.
             * @returns {Boolean} True if the matrices are equal, false otherwise.
             */

            function mat4_equals(a, b) {
                var a0 = a[0],
                    a1 = a[1],
                    a2 = a[2],
                    a3 = a[3];
                var a4 = a[4],
                    a5 = a[5],
                    a6 = a[6],
                    a7 = a[7];
                var a8 = a[8],
                    a9 = a[9],
                    a10 = a[10],
                    a11 = a[11];
                var a12 = a[12],
                    a13 = a[13],
                    a14 = a[14],
                    a15 = a[15];
                var b0 = b[0],
                    b1 = b[1],
                    b2 = b[2],
                    b3 = b[3];
                var b4 = b[4],
                    b5 = b[5],
                    b6 = b[6],
                    b7 = b[7];
                var b8 = b[8],
                    b9 = b[9],
                    b10 = b[10],
                    b11 = b[11];
                var b12 = b[12],
                    b13 = b[13],
                    b14 = b[14],
                    b15 = b[15];
                return (
                    Math.abs(a0 - b0) <=
                        EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <=
                        EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                    Math.abs(a2 - b2) <=
                        EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
                    Math.abs(a3 - b3) <=
                        EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
                    Math.abs(a4 - b4) <=
                        EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
                    Math.abs(a5 - b5) <=
                        EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
                    Math.abs(a6 - b6) <=
                        EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
                    Math.abs(a7 - b7) <=
                        EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
                    Math.abs(a8 - b8) <=
                        EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
                    Math.abs(a9 - b9) <=
                        EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
                    Math.abs(a10 - b10) <=
                        EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
                    Math.abs(a11 - b11) <=
                        EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
                    Math.abs(a12 - b12) <=
                        EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
                    Math.abs(a13 - b13) <=
                        EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
                    Math.abs(a14 - b14) <=
                        EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
                    Math.abs(a15 - b15) <=
                        EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15))
                );
            }
            /**
             * Alias for {@link mat4.multiply}
             * @function
             */

            var mat4_mul =
                /* unused pure expression or super */ null && mat4_multiply;
            /**
             * Alias for {@link mat4.subtract}
             * @function
             */

            var mat4_sub =
                /* unused pure expression or super */ null && mat4_subtract; // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/node_modules/gl-matrix/esm/vec2.js
            /**
             * 2 Dimensional Vector
             * @module vec2
             */

            /**
             * Creates a new, empty vec2
             *
             * @returns {vec2} a new 2D vector
             */

            function vec2_create() {
                var out = new ARRAY_TYPE(2);

                if (ARRAY_TYPE != Float32Array) {
                    out[0] = 0;
                    out[1] = 0;
                }

                return out;
            }
            /**
             * Creates a new vec2 initialized with values from an existing vector
             *
             * @param {ReadonlyVec2} a vector to clone
             * @returns {vec2} a new 2D vector
             */

            function vec2_clone(a) {
                var out = new glMatrix.ARRAY_TYPE(2);
                out[0] = a[0];
                out[1] = a[1];
                return out;
            }
            /**
             * Creates a new vec2 initialized with the given values
             *
             * @param {Number} x X component
             * @param {Number} y Y component
             * @returns {vec2} a new 2D vector
             */

            function vec2_fromValues(x, y) {
                var out = new glMatrix.ARRAY_TYPE(2);
                out[0] = x;
                out[1] = y;
                return out;
            }
            /**
             * Copy the values from one vec2 to another
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the source vector
             * @returns {vec2} out
             */

            function vec2_copy(out, a) {
                out[0] = a[0];
                out[1] = a[1];
                return out;
            }
            /**
             * Set the components of a vec2 to the given values
             *
             * @param {vec2} out the receiving vector
             * @param {Number} x X component
             * @param {Number} y Y component
             * @returns {vec2} out
             */

            function vec2_set(out, x, y) {
                out[0] = x;
                out[1] = y;
                return out;
            }
            /**
             * Adds two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {vec2} out
             */

            function vec2_add(out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                return out;
            }
            /**
             * Subtracts vector b from vector a
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {vec2} out
             */

            function vec2_subtract(out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                return out;
            }
            /**
             * Multiplies two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {vec2} out
             */

            function vec2_multiply(out, a, b) {
                out[0] = a[0] * b[0];
                out[1] = a[1] * b[1];
                return out;
            }
            /**
             * Divides two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {vec2} out
             */

            function vec2_divide(out, a, b) {
                out[0] = a[0] / b[0];
                out[1] = a[1] / b[1];
                return out;
            }
            /**
             * Math.ceil the components of a vec2
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a vector to ceil
             * @returns {vec2} out
             */

            function vec2_ceil(out, a) {
                out[0] = Math.ceil(a[0]);
                out[1] = Math.ceil(a[1]);
                return out;
            }
            /**
             * Math.floor the components of a vec2
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a vector to floor
             * @returns {vec2} out
             */

            function vec2_floor(out, a) {
                out[0] = Math.floor(a[0]);
                out[1] = Math.floor(a[1]);
                return out;
            }
            /**
             * Returns the minimum of two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {vec2} out
             */

            function vec2_min(out, a, b) {
                out[0] = Math.min(a[0], b[0]);
                out[1] = Math.min(a[1], b[1]);
                return out;
            }
            /**
             * Returns the maximum of two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {vec2} out
             */

            function vec2_max(out, a, b) {
                out[0] = Math.max(a[0], b[0]);
                out[1] = Math.max(a[1], b[1]);
                return out;
            }
            /**
             * Math.round the components of a vec2
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a vector to round
             * @returns {vec2} out
             */

            function vec2_round(out, a) {
                out[0] = Math.round(a[0]);
                out[1] = Math.round(a[1]);
                return out;
            }
            /**
             * Scales a vec2 by a scalar number
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the vector to scale
             * @param {Number} b amount to scale the vector by
             * @returns {vec2} out
             */

            function vec2_scale(out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                return out;
            }
            /**
             * Adds two vec2's after scaling the second operand by a scalar value
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @param {Number} scale the amount to scale b by before adding
             * @returns {vec2} out
             */

            function vec2_scaleAndAdd(out, a, b, scale) {
                out[0] = a[0] + b[0] * scale;
                out[1] = a[1] + b[1] * scale;
                return out;
            }
            /**
             * Calculates the euclidian distance between two vec2's
             *
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {Number} distance between a and b
             */

            function vec2_distance(a, b) {
                var x = b[0] - a[0],
                    y = b[1] - a[1];
                return Math.hypot(x, y);
            }
            /**
             * Calculates the squared euclidian distance between two vec2's
             *
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {Number} squared distance between a and b
             */

            function vec2_squaredDistance(a, b) {
                var x = b[0] - a[0],
                    y = b[1] - a[1];
                return x * x + y * y;
            }
            /**
             * Calculates the length of a vec2
             *
             * @param {ReadonlyVec2} a vector to calculate length of
             * @returns {Number} length of a
             */

            function vec2_length(a) {
                var x = a[0],
                    y = a[1];
                return Math.hypot(x, y);
            }
            /**
             * Calculates the squared length of a vec2
             *
             * @param {ReadonlyVec2} a vector to calculate squared length of
             * @returns {Number} squared length of a
             */

            function vec2_squaredLength(a) {
                var x = a[0],
                    y = a[1];
                return x * x + y * y;
            }
            /**
             * Negates the components of a vec2
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a vector to negate
             * @returns {vec2} out
             */

            function vec2_negate(out, a) {
                out[0] = -a[0];
                out[1] = -a[1];
                return out;
            }
            /**
             * Returns the inverse of the components of a vec2
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a vector to invert
             * @returns {vec2} out
             */

            function vec2_inverse(out, a) {
                out[0] = 1.0 / a[0];
                out[1] = 1.0 / a[1];
                return out;
            }
            /**
             * Normalize a vec2
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a vector to normalize
             * @returns {vec2} out
             */

            function vec2_normalize(out, a) {
                var x = a[0],
                    y = a[1];
                var len = x * x + y * y;

                if (len > 0) {
                    //TODO: evaluate use of glm_invsqrt here?
                    len = 1 / Math.sqrt(len);
                }

                out[0] = a[0] * len;
                out[1] = a[1] * len;
                return out;
            }
            /**
             * Calculates the dot product of two vec2's
             *
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {Number} dot product of a and b
             */

            function vec2_dot(a, b) {
                return a[0] * b[0] + a[1] * b[1];
            }
            /**
             * Computes the cross product of two vec2's
             * Note that the cross product must by definition produce a 3D vector
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {vec3} out
             */

            function vec2_cross(out, a, b) {
                var z = a[0] * b[1] - a[1] * b[0];
                out[0] = out[1] = 0;
                out[2] = z;
                return out;
            }
            /**
             * Performs a linear interpolation between two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
             * @returns {vec2} out
             */

            function vec2_lerp(out, a, b, t) {
                var ax = a[0],
                    ay = a[1];
                out[0] = ax + t * (b[0] - ax);
                out[1] = ay + t * (b[1] - ay);
                return out;
            }
            /**
             * Generates a random vector with the given scale
             *
             * @param {vec2} out the receiving vector
             * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
             * @returns {vec2} out
             */

            function vec2_random(out, scale) {
                scale = scale || 1.0;
                var r = glMatrix.RANDOM() * 2.0 * Math.PI;
                out[0] = Math.cos(r) * scale;
                out[1] = Math.sin(r) * scale;
                return out;
            }
            /**
             * Transforms the vec2 with a mat2
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the vector to transform
             * @param {ReadonlyMat2} m matrix to transform with
             * @returns {vec2} out
             */

            function transformMat2(out, a, m) {
                var x = a[0],
                    y = a[1];
                out[0] = m[0] * x + m[2] * y;
                out[1] = m[1] * x + m[3] * y;
                return out;
            }
            /**
             * Transforms the vec2 with a mat2d
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the vector to transform
             * @param {ReadonlyMat2d} m matrix to transform with
             * @returns {vec2} out
             */

            function transformMat2d(out, a, m) {
                var x = a[0],
                    y = a[1];
                out[0] = m[0] * x + m[2] * y + m[4];
                out[1] = m[1] * x + m[3] * y + m[5];
                return out;
            }
            /**
             * Transforms the vec2 with a mat3
             * 3rd vector component is implicitly '1'
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the vector to transform
             * @param {ReadonlyMat3} m matrix to transform with
             * @returns {vec2} out
             */

            function transformMat3(out, a, m) {
                var x = a[0],
                    y = a[1];
                out[0] = m[0] * x + m[3] * y + m[6];
                out[1] = m[1] * x + m[4] * y + m[7];
                return out;
            }
            /**
             * Transforms the vec2 with a mat4
             * 3rd vector component is implicitly '0'
             * 4th vector component is implicitly '1'
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the vector to transform
             * @param {ReadonlyMat4} m matrix to transform with
             * @returns {vec2} out
             */

            function vec2_transformMat4(out, a, m) {
                var x = a[0];
                var y = a[1];
                out[0] = m[0] * x + m[4] * y + m[12];
                out[1] = m[1] * x + m[5] * y + m[13];
                return out;
            }
            /**
             * Rotate a 2D vector
             * @param {vec2} out The receiving vec2
             * @param {ReadonlyVec2} a The vec2 point to rotate
             * @param {ReadonlyVec2} b The origin of the rotation
             * @param {Number} rad The angle of rotation in radians
             * @returns {vec2} out
             */

            function vec2_rotate(out, a, b, rad) {
                //Translate point to the origin
                var p0 = a[0] - b[0],
                    p1 = a[1] - b[1],
                    sinC = Math.sin(rad),
                    cosC = Math.cos(rad); //perform rotation and translate to correct position

                out[0] = p0 * cosC - p1 * sinC + b[0];
                out[1] = p0 * sinC + p1 * cosC + b[1];
                return out;
            }
            /**
             * Get the angle between two 2D vectors
             * @param {ReadonlyVec2} a The first operand
             * @param {ReadonlyVec2} b The second operand
             * @returns {Number} The angle in radians
             */

            function angle(a, b) {
                var x1 = a[0],
                    y1 = a[1],
                    x2 = b[0],
                    y2 = b[1],
                    // mag is the product of the magnitudes of a and b
                    mag =
                        Math.sqrt(x1 * x1 + y1 * y1) *
                        Math.sqrt(x2 * x2 + y2 * y2),
                    // mag &&.. short circuits if mag == 0
                    cosine = mag && (x1 * x2 + y1 * y2) / mag; // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1

                return Math.acos(Math.min(Math.max(cosine, -1), 1));
            }
            /**
             * Set the components of a vec2 to zero
             *
             * @param {vec2} out the receiving vector
             * @returns {vec2} out
             */

            function vec2_zero(out) {
                out[0] = 0.0;
                out[1] = 0.0;
                return out;
            }
            /**
             * Returns a string representation of a vector
             *
             * @param {ReadonlyVec2} a vector to represent as a string
             * @returns {String} string representation of the vector
             */

            function vec2_str(a) {
                return "vec2(" + a[0] + ", " + a[1] + ")";
            }
            /**
             * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
             *
             * @param {ReadonlyVec2} a The first vector.
             * @param {ReadonlyVec2} b The second vector.
             * @returns {Boolean} True if the vectors are equal, false otherwise.
             */

            function vec2_exactEquals(a, b) {
                return a[0] === b[0] && a[1] === b[1];
            }
            /**
             * Returns whether or not the vectors have approximately the same elements in the same position.
             *
             * @param {ReadonlyVec2} a The first vector.
             * @param {ReadonlyVec2} b The second vector.
             * @returns {Boolean} True if the vectors are equal, false otherwise.
             */

            function vec2_equals(a, b) {
                var a0 = a[0],
                    a1 = a[1];
                var b0 = b[0],
                    b1 = b[1];
                return (
                    Math.abs(a0 - b0) <=
                        glMatrix.EPSILON *
                            Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <=
                        glMatrix.EPSILON *
                            Math.max(1.0, Math.abs(a1), Math.abs(b1))
                );
            }
            /**
             * Alias for {@link vec2.length}
             * @function
             */

            var vec2_len =
                /* unused pure expression or super */ null && vec2_length;
            /**
             * Alias for {@link vec2.subtract}
             * @function
             */

            var vec2_sub = vec2_subtract;
            /**
             * Alias for {@link vec2.multiply}
             * @function
             */

            var vec2_mul =
                /* unused pure expression or super */ null && vec2_multiply;
            /**
             * Alias for {@link vec2.divide}
             * @function
             */

            var vec2_div =
                /* unused pure expression or super */ null && vec2_divide;
            /**
             * Alias for {@link vec2.distance}
             * @function
             */

            var vec2_dist =
                /* unused pure expression or super */ null && vec2_distance;
            /**
             * Alias for {@link vec2.squaredDistance}
             * @function
             */

            var vec2_sqrDist =
                /* unused pure expression or super */ null &&
                vec2_squaredDistance;
            /**
             * Alias for {@link vec2.squaredLength}
             * @function
             */

            var vec2_sqrLen =
                /* unused pure expression or super */ null &&
                vec2_squaredLength;
            /**
             * Perform some operation over an array of vec2s.
             *
             * @param {Array} a the array of vectors to iterate over
             * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
             * @param {Number} offset Number of elements to skip at the beginning of the array
             * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
             * @param {Function} fn Function to call for each vector in the array
             * @param {Object} [arg] additional argument to pass to fn
             * @returns {Array} a
             * @function
             */

            var vec2_forEach = (function () {
                var vec = vec2_create();
                return function (a, stride, offset, count, fn, arg) {
                    var i, l;

                    if (!stride) {
                        stride = 2;
                    }

                    if (!offset) {
                        offset = 0;
                    }

                    if (count) {
                        l = Math.min(count * stride + offset, a.length);
                    } else {
                        l = a.length;
                    }

                    for (i = offset; i < l; i += stride) {
                        vec[0] = a[i];
                        vec[1] = a[i + 1];
                        fn(vec, vec, arg);
                        a[i] = vec[0];
                        a[i + 1] = vec[1];
                    }

                    return a;
                };
            })(); // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/node_modules/gl-matrix/esm/vec3.js
            /**
             * 3 Dimensional Vector
             * @module vec3
             */

            /**
             * Creates a new, empty vec3
             *
             * @returns {vec3} a new 3D vector
             */

            function vec3_create() {
                var out = new ARRAY_TYPE(3);

                if (ARRAY_TYPE != Float32Array) {
                    out[0] = 0;
                    out[1] = 0;
                    out[2] = 0;
                }

                return out;
            }
            /**
             * Creates a new vec3 initialized with values from an existing vector
             *
             * @param {ReadonlyVec3} a vector to clone
             * @returns {vec3} a new 3D vector
             */

            function vec3_clone(a) {
                var out = new glMatrix.ARRAY_TYPE(3);
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                return out;
            }
            /**
             * Calculates the length of a vec3
             *
             * @param {ReadonlyVec3} a vector to calculate length of
             * @returns {Number} length of a
             */

            function vec3_length(a) {
                var x = a[0];
                var y = a[1];
                var z = a[2];
                return Math.hypot(x, y, z);
            }
            /**
             * Creates a new vec3 initialized with the given values
             *
             * @param {Number} x X component
             * @param {Number} y Y component
             * @param {Number} z Z component
             * @returns {vec3} a new 3D vector
             */

            function vec3_fromValues(x, y, z) {
                var out = new glMatrix.ARRAY_TYPE(3);
                out[0] = x;
                out[1] = y;
                out[2] = z;
                return out;
            }
            /**
             * Copy the values from one vec3 to another
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the source vector
             * @returns {vec3} out
             */

            function vec3_copy(out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                return out;
            }
            /**
             * Set the components of a vec3 to the given values
             *
             * @param {vec3} out the receiving vector
             * @param {Number} x X component
             * @param {Number} y Y component
             * @param {Number} z Z component
             * @returns {vec3} out
             */

            function vec3_set(out, x, y, z) {
                out[0] = x;
                out[1] = y;
                out[2] = z;
                return out;
            }
            /**
             * Adds two vec3's
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {vec3} out
             */

            function vec3_add(out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                out[2] = a[2] + b[2];
                return out;
            }
            /**
             * Subtracts vector b from vector a
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {vec3} out
             */

            function vec3_subtract(out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                out[2] = a[2] - b[2];
                return out;
            }
            /**
             * Multiplies two vec3's
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {vec3} out
             */

            function vec3_multiply(out, a, b) {
                out[0] = a[0] * b[0];
                out[1] = a[1] * b[1];
                out[2] = a[2] * b[2];
                return out;
            }
            /**
             * Divides two vec3's
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {vec3} out
             */

            function vec3_divide(out, a, b) {
                out[0] = a[0] / b[0];
                out[1] = a[1] / b[1];
                out[2] = a[2] / b[2];
                return out;
            }
            /**
             * Math.ceil the components of a vec3
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a vector to ceil
             * @returns {vec3} out
             */

            function vec3_ceil(out, a) {
                out[0] = Math.ceil(a[0]);
                out[1] = Math.ceil(a[1]);
                out[2] = Math.ceil(a[2]);
                return out;
            }
            /**
             * Math.floor the components of a vec3
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a vector to floor
             * @returns {vec3} out
             */

            function vec3_floor(out, a) {
                out[0] = Math.floor(a[0]);
                out[1] = Math.floor(a[1]);
                out[2] = Math.floor(a[2]);
                return out;
            }
            /**
             * Returns the minimum of two vec3's
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {vec3} out
             */

            function vec3_min(out, a, b) {
                out[0] = Math.min(a[0], b[0]);
                out[1] = Math.min(a[1], b[1]);
                out[2] = Math.min(a[2], b[2]);
                return out;
            }
            /**
             * Returns the maximum of two vec3's
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {vec3} out
             */

            function vec3_max(out, a, b) {
                out[0] = Math.max(a[0], b[0]);
                out[1] = Math.max(a[1], b[1]);
                out[2] = Math.max(a[2], b[2]);
                return out;
            }
            /**
             * Math.round the components of a vec3
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a vector to round
             * @returns {vec3} out
             */

            function vec3_round(out, a) {
                out[0] = Math.round(a[0]);
                out[1] = Math.round(a[1]);
                out[2] = Math.round(a[2]);
                return out;
            }
            /**
             * Scales a vec3 by a scalar number
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the vector to scale
             * @param {Number} b amount to scale the vector by
             * @returns {vec3} out
             */

            function vec3_scale(out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                out[2] = a[2] * b;
                return out;
            }
            /**
             * Adds two vec3's after scaling the second operand by a scalar value
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @param {Number} scale the amount to scale b by before adding
             * @returns {vec3} out
             */

            function vec3_scaleAndAdd(out, a, b, scale) {
                out[0] = a[0] + b[0] * scale;
                out[1] = a[1] + b[1] * scale;
                out[2] = a[2] + b[2] * scale;
                return out;
            }
            /**
             * Calculates the euclidian distance between two vec3's
             *
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {Number} distance between a and b
             */

            function vec3_distance(a, b) {
                var x = b[0] - a[0];
                var y = b[1] - a[1];
                var z = b[2] - a[2];
                return Math.hypot(x, y, z);
            }
            /**
             * Calculates the squared euclidian distance between two vec3's
             *
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {Number} squared distance between a and b
             */

            function vec3_squaredDistance(a, b) {
                var x = b[0] - a[0];
                var y = b[1] - a[1];
                var z = b[2] - a[2];
                return x * x + y * y + z * z;
            }
            /**
             * Calculates the squared length of a vec3
             *
             * @param {ReadonlyVec3} a vector to calculate squared length of
             * @returns {Number} squared length of a
             */

            function vec3_squaredLength(a) {
                var x = a[0];
                var y = a[1];
                var z = a[2];
                return x * x + y * y + z * z;
            }
            /**
             * Negates the components of a vec3
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a vector to negate
             * @returns {vec3} out
             */

            function vec3_negate(out, a) {
                out[0] = -a[0];
                out[1] = -a[1];
                out[2] = -a[2];
                return out;
            }
            /**
             * Returns the inverse of the components of a vec3
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a vector to invert
             * @returns {vec3} out
             */

            function vec3_inverse(out, a) {
                out[0] = 1.0 / a[0];
                out[1] = 1.0 / a[1];
                out[2] = 1.0 / a[2];
                return out;
            }
            /**
             * Normalize a vec3
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a vector to normalize
             * @returns {vec3} out
             */

            function vec3_normalize(out, a) {
                var x = a[0];
                var y = a[1];
                var z = a[2];
                var len = x * x + y * y + z * z;

                if (len > 0) {
                    //TODO: evaluate use of glm_invsqrt here?
                    len = 1 / Math.sqrt(len);
                }

                out[0] = a[0] * len;
                out[1] = a[1] * len;
                out[2] = a[2] * len;
                return out;
            }
            /**
             * Calculates the dot product of two vec3's
             *
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {Number} dot product of a and b
             */

            function vec3_dot(a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
            }
            /**
             * Computes the cross product of two vec3's
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @returns {vec3} out
             */

            function vec3_cross(out, a, b) {
                var ax = a[0],
                    ay = a[1],
                    az = a[2];
                var bx = b[0],
                    by = b[1],
                    bz = b[2];
                out[0] = ay * bz - az * by;
                out[1] = az * bx - ax * bz;
                out[2] = ax * by - ay * bx;
                return out;
            }
            /**
             * Performs a linear interpolation between two vec3's
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
             * @returns {vec3} out
             */

            function vec3_lerp(out, a, b, t) {
                var ax = a[0];
                var ay = a[1];
                var az = a[2];
                out[0] = ax + t * (b[0] - ax);
                out[1] = ay + t * (b[1] - ay);
                out[2] = az + t * (b[2] - az);
                return out;
            }
            /**
             * Performs a hermite interpolation with two control points
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @param {ReadonlyVec3} c the third operand
             * @param {ReadonlyVec3} d the fourth operand
             * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
             * @returns {vec3} out
             */

            function hermite(out, a, b, c, d, t) {
                var factorTimes2 = t * t;
                var factor1 = factorTimes2 * (2 * t - 3) + 1;
                var factor2 = factorTimes2 * (t - 2) + t;
                var factor3 = factorTimes2 * (t - 1);
                var factor4 = factorTimes2 * (3 - 2 * t);
                out[0] =
                    a[0] * factor1 +
                    b[0] * factor2 +
                    c[0] * factor3 +
                    d[0] * factor4;
                out[1] =
                    a[1] * factor1 +
                    b[1] * factor2 +
                    c[1] * factor3 +
                    d[1] * factor4;
                out[2] =
                    a[2] * factor1 +
                    b[2] * factor2 +
                    c[2] * factor3 +
                    d[2] * factor4;
                return out;
            }
            /**
             * Performs a bezier interpolation with two control points
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the first operand
             * @param {ReadonlyVec3} b the second operand
             * @param {ReadonlyVec3} c the third operand
             * @param {ReadonlyVec3} d the fourth operand
             * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
             * @returns {vec3} out
             */

            function bezier(out, a, b, c, d, t) {
                var inverseFactor = 1 - t;
                var inverseFactorTimesTwo = inverseFactor * inverseFactor;
                var factorTimes2 = t * t;
                var factor1 = inverseFactorTimesTwo * inverseFactor;
                var factor2 = 3 * t * inverseFactorTimesTwo;
                var factor3 = 3 * factorTimes2 * inverseFactor;
                var factor4 = factorTimes2 * t;
                out[0] =
                    a[0] * factor1 +
                    b[0] * factor2 +
                    c[0] * factor3 +
                    d[0] * factor4;
                out[1] =
                    a[1] * factor1 +
                    b[1] * factor2 +
                    c[1] * factor3 +
                    d[1] * factor4;
                out[2] =
                    a[2] * factor1 +
                    b[2] * factor2 +
                    c[2] * factor3 +
                    d[2] * factor4;
                return out;
            }
            /**
             * Generates a random vector with the given scale
             *
             * @param {vec3} out the receiving vector
             * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
             * @returns {vec3} out
             */

            function vec3_random(out, scale) {
                scale = scale || 1.0;
                var r = glMatrix.RANDOM() * 2.0 * Math.PI;
                var z = glMatrix.RANDOM() * 2.0 - 1.0;
                var zScale = Math.sqrt(1.0 - z * z) * scale;
                out[0] = Math.cos(r) * zScale;
                out[1] = Math.sin(r) * zScale;
                out[2] = z * scale;
                return out;
            }
            /**
             * Transforms the vec3 with a mat4.
             * 4th vector component is implicitly '1'
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the vector to transform
             * @param {ReadonlyMat4} m matrix to transform with
             * @returns {vec3} out
             */

            function vec3_transformMat4(out, a, m) {
                var x = a[0],
                    y = a[1],
                    z = a[2];
                var w = m[3] * x + m[7] * y + m[11] * z + m[15];
                w = w || 1.0;
                out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
                out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
                out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
                return out;
            }
            /**
             * Transforms the vec3 with a mat3.
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the vector to transform
             * @param {ReadonlyMat3} m the 3x3 matrix to transform with
             * @returns {vec3} out
             */

            function vec3_transformMat3(out, a, m) {
                var x = a[0],
                    y = a[1],
                    z = a[2];
                out[0] = x * m[0] + y * m[3] + z * m[6];
                out[1] = x * m[1] + y * m[4] + z * m[7];
                out[2] = x * m[2] + y * m[5] + z * m[8];
                return out;
            }
            /**
             * Transforms the vec3 with a quat
             * Can also be used for dual quaternions. (Multiply it with the real part)
             *
             * @param {vec3} out the receiving vector
             * @param {ReadonlyVec3} a the vector to transform
             * @param {ReadonlyQuat} q quaternion to transform with
             * @returns {vec3} out
             */

            function vec3_transformQuat(out, a, q) {
                // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
                var qx = q[0],
                    qy = q[1],
                    qz = q[2],
                    qw = q[3];
                var x = a[0],
                    y = a[1],
                    z = a[2]; // var qvec = [qx, qy, qz];
                // var uv = vec3.cross([], qvec, a);

                var uvx = qy * z - qz * y,
                    uvy = qz * x - qx * z,
                    uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

                var uuvx = qy * uvz - qz * uvy,
                    uuvy = qz * uvx - qx * uvz,
                    uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

                var w2 = qw * 2;
                uvx *= w2;
                uvy *= w2;
                uvz *= w2; // vec3.scale(uuv, uuv, 2);

                uuvx *= 2;
                uuvy *= 2;
                uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

                out[0] = x + uvx + uuvx;
                out[1] = y + uvy + uuvy;
                out[2] = z + uvz + uuvz;
                return out;
            }
            /**
             * Rotate a 3D vector around the x-axis
             * @param {vec3} out The receiving vec3
             * @param {ReadonlyVec3} a The vec3 point to rotate
             * @param {ReadonlyVec3} b The origin of the rotation
             * @param {Number} rad The angle of rotation in radians
             * @returns {vec3} out
             */

            function vec3_rotateX(out, a, b, rad) {
                var p = [],
                    r = []; //Translate point to the origin

                p[0] = a[0] - b[0];
                p[1] = a[1] - b[1];
                p[2] = a[2] - b[2]; //perform rotation

                r[0] = p[0];
                r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
                r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

                out[0] = r[0] + b[0];
                out[1] = r[1] + b[1];
                out[2] = r[2] + b[2];
                return out;
            }
            /**
             * Rotate a 3D vector around the y-axis
             * @param {vec3} out The receiving vec3
             * @param {ReadonlyVec3} a The vec3 point to rotate
             * @param {ReadonlyVec3} b The origin of the rotation
             * @param {Number} rad The angle of rotation in radians
             * @returns {vec3} out
             */

            function vec3_rotateY(out, a, b, rad) {
                var p = [],
                    r = []; //Translate point to the origin

                p[0] = a[0] - b[0];
                p[1] = a[1] - b[1];
                p[2] = a[2] - b[2]; //perform rotation

                r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
                r[1] = p[1];
                r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

                out[0] = r[0] + b[0];
                out[1] = r[1] + b[1];
                out[2] = r[2] + b[2];
                return out;
            }
            /**
             * Rotate a 3D vector around the z-axis
             * @param {vec3} out The receiving vec3
             * @param {ReadonlyVec3} a The vec3 point to rotate
             * @param {ReadonlyVec3} b The origin of the rotation
             * @param {Number} rad The angle of rotation in radians
             * @returns {vec3} out
             */

            function vec3_rotateZ(out, a, b, rad) {
                var p = [],
                    r = []; //Translate point to the origin

                p[0] = a[0] - b[0];
                p[1] = a[1] - b[1];
                p[2] = a[2] - b[2]; //perform rotation

                r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
                r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
                r[2] = p[2]; //translate to correct position

                out[0] = r[0] + b[0];
                out[1] = r[1] + b[1];
                out[2] = r[2] + b[2];
                return out;
            }
            /**
             * Get the angle between two 3D vectors
             * @param {ReadonlyVec3} a The first operand
             * @param {ReadonlyVec3} b The second operand
             * @returns {Number} The angle in radians
             */

            function vec3_angle(a, b) {
                var ax = a[0],
                    ay = a[1],
                    az = a[2],
                    bx = b[0],
                    by = b[1],
                    bz = b[2],
                    mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
                    mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
                    mag = mag1 * mag2,
                    cosine = mag && vec3_dot(a, b) / mag;
                return Math.acos(Math.min(Math.max(cosine, -1), 1));
            }
            /**
             * Set the components of a vec3 to zero
             *
             * @param {vec3} out the receiving vector
             * @returns {vec3} out
             */

            function vec3_zero(out) {
                out[0] = 0.0;
                out[1] = 0.0;
                out[2] = 0.0;
                return out;
            }
            /**
             * Returns a string representation of a vector
             *
             * @param {ReadonlyVec3} a vector to represent as a string
             * @returns {String} string representation of the vector
             */

            function vec3_str(a) {
                return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
            }
            /**
             * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
             *
             * @param {ReadonlyVec3} a The first vector.
             * @param {ReadonlyVec3} b The second vector.
             * @returns {Boolean} True if the vectors are equal, false otherwise.
             */

            function vec3_exactEquals(a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
            }
            /**
             * Returns whether or not the vectors have approximately the same elements in the same position.
             *
             * @param {ReadonlyVec3} a The first vector.
             * @param {ReadonlyVec3} b The second vector.
             * @returns {Boolean} True if the vectors are equal, false otherwise.
             */

            function vec3_equals(a, b) {
                var a0 = a[0],
                    a1 = a[1],
                    a2 = a[2];
                var b0 = b[0],
                    b1 = b[1],
                    b2 = b[2];
                return (
                    Math.abs(a0 - b0) <=
                        glMatrix.EPSILON *
                            Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <=
                        glMatrix.EPSILON *
                            Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                    Math.abs(a2 - b2) <=
                        glMatrix.EPSILON *
                            Math.max(1.0, Math.abs(a2), Math.abs(b2))
                );
            }
            /**
             * Alias for {@link vec3.subtract}
             * @function
             */

            var vec3_sub =
                /* unused pure expression or super */ null && vec3_subtract;
            /**
             * Alias for {@link vec3.multiply}
             * @function
             */

            var vec3_mul = vec3_multiply;
            /**
             * Alias for {@link vec3.divide}
             * @function
             */

            var vec3_div =
                /* unused pure expression or super */ null && vec3_divide;
            /**
             * Alias for {@link vec3.distance}
             * @function
             */

            var vec3_dist =
                /* unused pure expression or super */ null && vec3_distance;
            /**
             * Alias for {@link vec3.squaredDistance}
             * @function
             */

            var vec3_sqrDist =
                /* unused pure expression or super */ null &&
                vec3_squaredDistance;
            /**
             * Alias for {@link vec3.length}
             * @function
             */

            var vec3_len =
                /* unused pure expression or super */ null && vec3_length;
            /**
             * Alias for {@link vec3.squaredLength}
             * @function
             */

            var vec3_sqrLen =
                /* unused pure expression or super */ null &&
                vec3_squaredLength;
            /**
             * Perform some operation over an array of vec3s.
             *
             * @param {Array} a the array of vectors to iterate over
             * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
             * @param {Number} offset Number of elements to skip at the beginning of the array
             * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
             * @param {Function} fn Function to call for each vector in the array
             * @param {Object} [arg] additional argument to pass to fn
             * @returns {Array} a
             * @function
             */

            var vec3_forEach = (function () {
                var vec = vec3_create();
                return function (a, stride, offset, count, fn, arg) {
                    var i, l;

                    if (!stride) {
                        stride = 3;
                    }

                    if (!offset) {
                        offset = 0;
                    }

                    if (count) {
                        l = Math.min(count * stride + offset, a.length);
                    } else {
                        l = a.length;
                    }

                    for (i = offset; i < l; i += stride) {
                        vec[0] = a[i];
                        vec[1] = a[i + 1];
                        vec[2] = a[i + 2];
                        fn(vec, vec, arg);
                        a[i] = vec[0];
                        a[i + 1] = vec[1];
                        a[i + 2] = vec[2];
                    }

                    return a;
                };
            })(); // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/assert.js
            function assert_assert(condition, message) {
                if (!condition) {
                    throw new Error(
                        message || "@math.gl/web-mercator: assertion failed."
                    );
                }
            } // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/web-mercator-utils.js
            //# sourceMappingURL=assert.js.map
            const PI = Math.PI;
            const PI_4 = PI / 4;
            const DEGREES_TO_RADIANS = PI / 180;
            const RADIANS_TO_DEGREES = 180 / PI;
            const TILE_SIZE = 512;
            const EARTH_CIRCUMFERENCE = 40.03e6;
            const MAX_LATITUDE = 85.051129;
            const DEFAULT_ALTITUDE = 1.5;
            function zoomToScale(zoom) {
                return Math.pow(2, zoom);
            }
            function scaleToZoom(scale) {
                return log2(scale);
            }
            function lngLatToWorld([lng, lat]) {
                assert_assert(Number.isFinite(lng));
                assert_assert(
                    Number.isFinite(lat) && lat >= -90 && lat <= 90,
                    "invalid latitude"
                );
                const lambda2 = lng * DEGREES_TO_RADIANS;
                const phi2 = lat * DEGREES_TO_RADIANS;
                const x = (TILE_SIZE * (lambda2 + PI)) / (2 * PI);
                const y =
                    (TILE_SIZE * (PI + Math.log(Math.tan(PI_4 + phi2 * 0.5)))) /
                    (2 * PI);
                return [x, y];
            }
            function worldToLngLat([x, y]) {
                const lambda2 = (x / TILE_SIZE) * (2 * PI) - PI;
                const phi2 =
                    2 *
                    (Math.atan(Math.exp((y / TILE_SIZE) * (2 * PI) - PI)) -
                        PI_4);
                return [
                    lambda2 * RADIANS_TO_DEGREES,
                    phi2 * RADIANS_TO_DEGREES,
                ];
            }
            function getMeterZoom({ latitude }) {
                assert(Number.isFinite(latitude));
                const latCosine = Math.cos(latitude * DEGREES_TO_RADIANS);
                return scaleToZoom(EARTH_CIRCUMFERENCE * latCosine) - 9;
            }
            function getDistanceScales({
                latitude,
                longitude,
                highPrecision = false,
            }) {
                assert_assert(
                    Number.isFinite(latitude) && Number.isFinite(longitude)
                );
                const result = {};
                const worldSize = TILE_SIZE;
                const latCosine = Math.cos(latitude * DEGREES_TO_RADIANS);
                const unitsPerDegreeX = worldSize / 360;
                const unitsPerDegreeY = unitsPerDegreeX / latCosine;
                const altUnitsPerMeter =
                    worldSize / EARTH_CIRCUMFERENCE / latCosine;
                result.unitsPerMeter = [
                    altUnitsPerMeter,
                    altUnitsPerMeter,
                    altUnitsPerMeter,
                ];
                result.metersPerUnit = [
                    1 / altUnitsPerMeter,
                    1 / altUnitsPerMeter,
                    1 / altUnitsPerMeter,
                ];
                result.unitsPerDegree = [
                    unitsPerDegreeX,
                    unitsPerDegreeY,
                    altUnitsPerMeter,
                ];
                result.degreesPerUnit = [
                    1 / unitsPerDegreeX,
                    1 / unitsPerDegreeY,
                    1 / altUnitsPerMeter,
                ];

                if (highPrecision) {
                    const latCosine2 =
                        (DEGREES_TO_RADIANS *
                            Math.tan(latitude * DEGREES_TO_RADIANS)) /
                        latCosine;
                    const unitsPerDegreeY2 = (unitsPerDegreeX * latCosine2) / 2;
                    const altUnitsPerDegree2 =
                        (worldSize / EARTH_CIRCUMFERENCE) * latCosine2;
                    const altUnitsPerMeter2 =
                        (altUnitsPerDegree2 / unitsPerDegreeY) *
                        altUnitsPerMeter;
                    result.unitsPerDegree2 = [
                        0,
                        unitsPerDegreeY2,
                        altUnitsPerDegree2,
                    ];
                    result.unitsPerMeter2 = [
                        altUnitsPerMeter2,
                        0,
                        altUnitsPerMeter2,
                    ];
                }

                return result;
            }
            function addMetersToLngLat(lngLatZ, xyz) {
                const [longitude, latitude, z0] = lngLatZ;
                const [x, y, z] = xyz;
                const { unitsPerMeter, unitsPerMeter2 } = getDistanceScales({
                    longitude,
                    latitude,
                    highPrecision: true,
                });
                const worldspace = lngLatToWorld(lngLatZ);
                worldspace[0] += x * (unitsPerMeter[0] + unitsPerMeter2[0] * y);
                worldspace[1] += y * (unitsPerMeter[1] + unitsPerMeter2[1] * y);
                const newLngLat = worldToLngLat(worldspace);
                const newZ = (z0 || 0) + (z || 0);
                return Number.isFinite(z0) || Number.isFinite(z)
                    ? [newLngLat[0], newLngLat[1], newZ]
                    : newLngLat;
            }
            function getViewMatrix({
                height,
                pitch,
                bearing,
                altitude,
                scale,
                center = null,
            }) {
                const vm = createMat4();
                translate(vm, vm, [0, 0, -altitude]);
                rotateX(vm, vm, -pitch * DEGREES_TO_RADIANS);
                rotateZ(vm, vm, bearing * DEGREES_TO_RADIANS);
                scale /= height;
                mat4_scale(vm, vm, [scale, scale, scale]);

                if (center) {
                    translate(vm, vm, vec3_negate([], center));
                }

                return vm;
            }
            function getProjectionParameters({
                width,
                height,
                fovy = altitudeToFovy(DEFAULT_ALTITUDE),
                altitude,
                pitch = 0,
                nearZMultiplier = 1,
                farZMultiplier = 1,
            }) {
                if (altitude !== undefined) {
                    fovy = altitudeToFovy(altitude);
                }

                const halfFov = 0.5 * fovy * DEGREES_TO_RADIANS;
                const focalDistance = fovyToAltitude(fovy);
                const pitchRadians = pitch * DEGREES_TO_RADIANS;
                const topHalfSurfaceDistance =
                    (Math.sin(halfFov) * focalDistance) /
                    Math.sin(
                        Math.min(
                            Math.max(
                                Math.PI / 2 - pitchRadians - halfFov,
                                0.01
                            ),
                            Math.PI - 0.01
                        )
                    );
                const farZ =
                    Math.sin(pitchRadians) * topHalfSurfaceDistance +
                    focalDistance;
                return {
                    fov: 2 * halfFov,
                    aspect: width / height,
                    focalDistance,
                    near: nearZMultiplier,
                    far: farZ * farZMultiplier,
                };
            }
            function getProjectionMatrix({
                width,
                height,
                pitch,
                altitude,
                fovy,
                nearZMultiplier,
                farZMultiplier,
            }) {
                const { fov, aspect, near, far } = getProjectionParameters({
                    width,
                    height,
                    altitude,
                    fovy,
                    pitch,
                    nearZMultiplier,
                    farZMultiplier,
                });
                const projectionMatrix = perspective(
                    [],
                    fov,
                    aspect,
                    near,
                    far
                );
                return projectionMatrix;
            }
            function altitudeToFovy(altitude) {
                return 2 * Math.atan(0.5 / altitude) * RADIANS_TO_DEGREES;
            }
            function fovyToAltitude(fovy) {
                return 0.5 / Math.tan(0.5 * fovy * DEGREES_TO_RADIANS);
            }
            function worldToPixels(xyz, pixelProjectionMatrix) {
                const [x, y, z = 0] = xyz;
                assert_assert(
                    Number.isFinite(x) &&
                        Number.isFinite(y) &&
                        Number.isFinite(z)
                );
                return transformVector(pixelProjectionMatrix, [x, y, z, 1]);
            }
            function pixelsToWorld(xyz, pixelUnprojectionMatrix, targetZ = 0) {
                const [x, y, z] = xyz;
                assert_assert(
                    Number.isFinite(x) && Number.isFinite(y),
                    "invalid pixel coordinate"
                );

                if (Number.isFinite(z)) {
                    const coord = transformVector(pixelUnprojectionMatrix, [
                        x,
                        y,
                        z,
                        1,
                    ]);
                    return coord;
                }

                const coord0 = transformVector(pixelUnprojectionMatrix, [
                    x,
                    y,
                    0,
                    1,
                ]);
                const coord1 = transformVector(pixelUnprojectionMatrix, [
                    x,
                    y,
                    1,
                    1,
                ]);
                const z0 = coord0[2];
                const z1 = coord1[2];
                const t = z0 === z1 ? 0 : ((targetZ || 0) - z0) / (z1 - z0);
                return vec2_lerp([], coord0, coord1, t);
            } // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/fit-bounds.js
            //# sourceMappingURL=web-mercator-utils.js.map
            function fitBounds({
                width,
                height,
                bounds,
                minExtent = 0,
                maxZoom = 24,
                padding = 0,
                offset = [0, 0],
            }) {
                const [[west, south], [east, north]] = bounds;

                if (Number.isFinite(padding)) {
                    const p = padding;
                    padding = {
                        top: p,
                        bottom: p,
                        left: p,
                        right: p,
                    };
                } else {
                    assert_assert(
                        Number.isFinite(padding.top) &&
                            Number.isFinite(padding.bottom) &&
                            Number.isFinite(padding.left) &&
                            Number.isFinite(padding.right)
                    );
                }

                const nw = lngLatToWorld([
                    west,
                    clamp(north, -MAX_LATITUDE, MAX_LATITUDE),
                ]);
                const se = lngLatToWorld([
                    east,
                    clamp(south, -MAX_LATITUDE, MAX_LATITUDE),
                ]);
                const size = [
                    Math.max(Math.abs(se[0] - nw[0]), minExtent),
                    Math.max(Math.abs(se[1] - nw[1]), minExtent),
                ];
                const targetSize = [
                    width -
                        padding.left -
                        padding.right -
                        Math.abs(offset[0]) * 2,
                    height -
                        padding.top -
                        padding.bottom -
                        Math.abs(offset[1]) * 2,
                ];
                assert_assert(targetSize[0] > 0 && targetSize[1] > 0);
                const scaleX = targetSize[0] / size[0];
                const scaleY = targetSize[1] / size[1];
                const offsetX = (padding.right - padding.left) / 2 / scaleX;
                const offsetY = (padding.bottom - padding.top) / 2 / scaleY;
                const center = [
                    (se[0] + nw[0]) / 2 + offsetX,
                    (se[1] + nw[1]) / 2 + offsetY,
                ];
                const centerLngLat = worldToLngLat(center);
                const zoom = Math.min(
                    maxZoom,
                    log2(Math.abs(Math.min(scaleX, scaleY)))
                );
                assert_assert(Number.isFinite(zoom));
                return {
                    longitude: centerLngLat[0],
                    latitude: centerLngLat[1],
                    zoom,
                };
            } // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/get-bounds.js
            //# sourceMappingURL=fit-bounds.js.map
            const get_bounds_DEGREES_TO_RADIANS = Math.PI / 180;
            function getBounds(viewport, z = 0) {
                const { width, height, unproject } = viewport;
                const unprojectOps = {
                    targetZ: z,
                };
                const bottomLeft = unproject([0, height], unprojectOps);
                const bottomRight = unproject([width, height], unprojectOps);
                let topLeft;
                let topRight;
                const halfFov = viewport.fovy
                    ? 0.5 * viewport.fovy * get_bounds_DEGREES_TO_RADIANS
                    : Math.atan(0.5 / viewport.altitude);
                const angleToGround =
                    (90 - viewport.pitch) * get_bounds_DEGREES_TO_RADIANS;

                if (halfFov > angleToGround - 0.01) {
                    topLeft = unprojectOnFarPlane(viewport, 0, z);
                    topRight = unprojectOnFarPlane(viewport, width, z);
                } else {
                    topLeft = unproject([0, 0], unprojectOps);
                    topRight = unproject([width, 0], unprojectOps);
                }

                return [bottomLeft, bottomRight, topRight, topLeft];
            }

            function unprojectOnFarPlane(viewport, x, targetZ) {
                const { pixelUnprojectionMatrix } = viewport;
                const coord0 = transformVector(pixelUnprojectionMatrix, [
                    x,
                    0,
                    1,
                    1,
                ]);
                const coord1 = transformVector(pixelUnprojectionMatrix, [
                    x,
                    viewport.height,
                    1,
                    1,
                ]);
                const z = targetZ * viewport.distanceScales.unitsPerMeter[2];
                const t = (z - coord0[2]) / (coord1[2] - coord0[2]);
                const coord = vec2_lerp([], coord0, coord1, t);
                const result = worldToLngLat(coord);
                result[2] = targetZ;
                return result;
            } // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/web-mercator-viewport.js
            //# sourceMappingURL=get-bounds.js.map
            class WebMercatorViewport {
                constructor(
                    {
                        width,
                        height,
                        latitude = 0,
                        longitude = 0,
                        zoom = 0,
                        pitch = 0,
                        bearing = 0,
                        altitude = null,
                        fovy = null,
                        position = null,
                        nearZMultiplier = 0.02,
                        farZMultiplier = 1.01,
                    } = {
                        width: 1,
                        height: 1,
                    }
                ) {
                    width = width || 1;
                    height = height || 1;

                    if (fovy === null && altitude === null) {
                        altitude = DEFAULT_ALTITUDE;
                        fovy = altitudeToFovy(altitude);
                    } else if (fovy === null) {
                        fovy = altitudeToFovy(altitude);
                    } else if (altitude === null) {
                        altitude = fovyToAltitude(fovy);
                    }

                    const scale = zoomToScale(zoom);
                    altitude = Math.max(0.75, altitude);
                    const distanceScales = getDistanceScales({
                        longitude,
                        latitude,
                    });
                    const center = lngLatToWorld([longitude, latitude]);
                    center[2] = 0;

                    if (position) {
                        vec3_add(
                            center,
                            center,
                            vec3_mul([], position, distanceScales.unitsPerMeter)
                        );
                    }

                    this.projectionMatrix = getProjectionMatrix({
                        width,
                        height,
                        pitch,
                        fovy,
                        nearZMultiplier,
                        farZMultiplier,
                    });
                    this.viewMatrix = getViewMatrix({
                        height,
                        scale,
                        center,
                        pitch,
                        bearing,
                        altitude,
                    });
                    this.width = width;
                    this.height = height;
                    this.scale = scale;
                    this.latitude = latitude;
                    this.longitude = longitude;
                    this.zoom = zoom;
                    this.pitch = pitch;
                    this.bearing = bearing;
                    this.altitude = altitude;
                    this.fovy = fovy;
                    this.center = center;
                    this.meterOffset = position || [0, 0, 0];
                    this.distanceScales = distanceScales;

                    this._initMatrices();

                    this.equals = this.equals.bind(this);
                    this.project = this.project.bind(this);
                    this.unproject = this.unproject.bind(this);
                    this.projectPosition = this.projectPosition.bind(this);
                    this.unprojectPosition = this.unprojectPosition.bind(this);
                    Object.freeze(this);
                }

                _initMatrices() {
                    const { width, height, projectionMatrix, viewMatrix } =
                        this;
                    const vpm = createMat4();
                    mat4_multiply(vpm, vpm, projectionMatrix);
                    mat4_multiply(vpm, vpm, viewMatrix);
                    this.viewProjectionMatrix = vpm;
                    const m = createMat4();
                    mat4_scale(m, m, [width / 2, -height / 2, 1]);
                    translate(m, m, [1, -1, 0]);
                    mat4_multiply(m, m, vpm);
                    const mInverse = invert(createMat4(), m);

                    if (!mInverse) {
                        throw new Error("Pixel project matrix not invertible");
                    }

                    this.pixelProjectionMatrix = m;
                    this.pixelUnprojectionMatrix = mInverse;
                }

                equals(viewport) {
                    if (!(viewport instanceof WebMercatorViewport)) {
                        return false;
                    }

                    return (
                        viewport.width === this.width &&
                        viewport.height === this.height &&
                        mat4_equals(
                            viewport.projectionMatrix,
                            this.projectionMatrix
                        ) &&
                        mat4_equals(viewport.viewMatrix, this.viewMatrix)
                    );
                }

                project(xyz, { topLeft = true } = {}) {
                    const worldPosition = this.projectPosition(xyz);
                    const coord = worldToPixels(
                        worldPosition,
                        this.pixelProjectionMatrix
                    );
                    const [x, y] = coord;
                    const y2 = topLeft ? y : this.height - y;
                    return xyz.length === 2 ? [x, y2] : [x, y2, coord[2]];
                }

                unproject(xyz, { topLeft = true, targetZ = undefined } = {}) {
                    const [x, y, z] = xyz;
                    const y2 = topLeft ? y : this.height - y;
                    const targetZWorld =
                        targetZ &&
                        targetZ * this.distanceScales.unitsPerMeter[2];
                    const coord = pixelsToWorld(
                        [x, y2, z],
                        this.pixelUnprojectionMatrix,
                        targetZWorld
                    );
                    const [X, Y, Z] = this.unprojectPosition(coord);

                    if (Number.isFinite(z)) {
                        return [X, Y, Z];
                    }

                    return Number.isFinite(targetZ) ? [X, Y, targetZ] : [X, Y];
                }

                projectPosition(xyz) {
                    const [X, Y] = lngLatToWorld(xyz);
                    const Z =
                        (xyz[2] || 0) * this.distanceScales.unitsPerMeter[2];
                    return [X, Y, Z];
                }

                unprojectPosition(xyz) {
                    const [X, Y] = worldToLngLat(xyz);
                    const Z =
                        (xyz[2] || 0) * this.distanceScales.metersPerUnit[2];
                    return [X, Y, Z];
                }

                projectFlat(lngLat) {
                    return lngLatToWorld(lngLat);
                }

                unprojectFlat(xy) {
                    return worldToLngLat(xy);
                }

                getMapCenterByLngLatPosition({ lngLat, pos }) {
                    const fromLocation = pixelsToWorld(
                        pos,
                        this.pixelUnprojectionMatrix
                    );
                    const toLocation = lngLatToWorld(lngLat);
                    const translate = vec2_add(
                        [],
                        toLocation,
                        vec2_negate([], fromLocation)
                    );
                    const newCenter = vec2_add([], this.center, translate);
                    return worldToLngLat(newCenter);
                }

                getLocationAtPoint({ lngLat, pos }) {
                    return this.getMapCenterByLngLatPosition({
                        lngLat,
                        pos,
                    });
                }

                fitBounds(bounds, options = {}) {
                    const { width, height } = this;
                    const { longitude, latitude, zoom } = fitBounds(
                        Object.assign(
                            {
                                width,
                                height,
                                bounds,
                            },
                            options
                        )
                    );
                    return new WebMercatorViewport({
                        width,
                        height,
                        longitude,
                        latitude,
                        zoom,
                    });
                }

                getBounds(options) {
                    const corners = this.getBoundingRegion(options);
                    const west = Math.min(...corners.map((p) => p[0]));
                    const east = Math.max(...corners.map((p) => p[0]));
                    const south = Math.min(...corners.map((p) => p[1]));
                    const north = Math.max(...corners.map((p) => p[1]));
                    return [
                        [west, south],
                        [east, north],
                    ];
                }

                getBoundingRegion(options = {}) {
                    return getBounds(this, options.z || 0);
                }
            } // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/normalize-viewport-props.js
            //# sourceMappingURL=web-mercator-viewport.js.map
            const normalize_viewport_props_TILE_SIZE = 512;
            function normalizeViewportProps({
                width,
                height,
                longitude,
                latitude,
                zoom,
                pitch = 0,
                bearing = 0,
            }) {
                if (longitude < -180 || longitude > 180) {
                    longitude = mod(longitude + 180, 360) - 180;
                }

                if (bearing < -180 || bearing > 180) {
                    bearing = mod(bearing + 180, 360) - 180;
                }

                const minZoom = log2(
                    height / normalize_viewport_props_TILE_SIZE
                );

                if (zoom <= minZoom) {
                    zoom = minZoom;
                    latitude = 0;
                } else {
                    const halfHeightPixels = height / 2 / Math.pow(2, zoom);
                    const minLatitude = worldToLngLat([0, halfHeightPixels])[1];

                    if (latitude < minLatitude) {
                        latitude = minLatitude;
                    } else {
                        const maxLatitude = worldToLngLat([
                            0,
                            normalize_viewport_props_TILE_SIZE -
                                halfHeightPixels,
                        ])[1];

                        if (latitude > maxLatitude) {
                            latitude = maxLatitude;
                        }
                    }
                }

                return {
                    width,
                    height,
                    longitude,
                    latitude,
                    zoom,
                    pitch,
                    bearing,
                };
            } // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/fly-to-viewport.js
            //# sourceMappingURL=normalize-viewport-props.js.map
            const fly_to_viewport_EPSILON = 0.01;
            const VIEWPORT_TRANSITION_PROPS = ["longitude", "latitude", "zoom"];
            const DEFAULT_OPTS = {
                curve: 1.414,
                speed: 1.2,
            };
            function flyToViewport(startProps, endProps, t, opts = {}) {
                const viewport = {};
                const {
                    startZoom,
                    startCenterXY,
                    uDelta,
                    w0,
                    u1,
                    S,
                    rho,
                    rho2,
                    r0,
                } = getFlyToTransitionParams(startProps, endProps, opts);

                if (u1 < fly_to_viewport_EPSILON) {
                    for (const key of VIEWPORT_TRANSITION_PROPS) {
                        const startValue = startProps[key];
                        const endValue = endProps[key];
                        viewport[key] = math_utils_lerp(
                            startValue,
                            endValue,
                            t
                        );
                    }

                    return viewport;
                }

                const s = t * S;
                const w = Math.cosh(r0) / Math.cosh(r0 + rho * s);
                const u =
                    (w0 *
                        ((Math.cosh(r0) * Math.tanh(r0 + rho * s) -
                            Math.sinh(r0)) /
                            rho2)) /
                    u1;
                const scaleIncrement = 1 / w;
                const newZoom = startZoom + scaleToZoom(scaleIncrement);
                const newCenterWorld = vec2_scale([], uDelta, u);
                vec2_add(newCenterWorld, newCenterWorld, startCenterXY);
                const newCenter = worldToLngLat(newCenterWorld);
                viewport.longitude = newCenter[0];
                viewport.latitude = newCenter[1];
                viewport.zoom = newZoom;
                return viewport;
            }
            function getFlyToDuration(startProps, endProps, opts = {}) {
                opts = Object.assign({}, DEFAULT_OPTS, opts);
                const { screenSpeed, speed, maxDuration } = opts;
                const { S, rho } = getFlyToTransitionParams(
                    startProps,
                    endProps,
                    opts
                );
                const length = 1000 * S;
                let duration;

                if (Number.isFinite(screenSpeed)) {
                    duration = length / (screenSpeed / rho);
                } else {
                    duration = length / speed;
                }

                return Number.isFinite(maxDuration) && duration > maxDuration
                    ? 0
                    : duration;
            }

            function getFlyToTransitionParams(startProps, endProps, opts) {
                opts = Object.assign({}, DEFAULT_OPTS, opts);
                const rho = opts.curve;
                const startZoom = startProps.zoom;
                const startCenter = [startProps.longitude, startProps.latitude];
                const startScale = zoomToScale(startZoom);
                const endZoom = endProps.zoom;
                const endCenter = [endProps.longitude, endProps.latitude];
                const scale = zoomToScale(endZoom - startZoom);
                const startCenterXY = lngLatToWorld(startCenter);
                const endCenterXY = lngLatToWorld(endCenter);
                const uDelta = vec2_sub([], endCenterXY, startCenterXY);
                const w0 = Math.max(startProps.width, startProps.height);
                const w1 = w0 / scale;
                const u1 = vec2_length(uDelta) * startScale;

                const _u1 = Math.max(u1, fly_to_viewport_EPSILON);

                const rho2 = rho * rho;
                const b0 =
                    (w1 * w1 - w0 * w0 + rho2 * rho2 * _u1 * _u1) /
                    (2 * w0 * rho2 * _u1);
                const b1 =
                    (w1 * w1 - w0 * w0 - rho2 * rho2 * _u1 * _u1) /
                    (2 * w1 * rho2 * _u1);
                const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
                const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
                const S = (r1 - r0) / rho;
                return {
                    startZoom,
                    startCenterXY,
                    uDelta,
                    w0,
                    u1,
                    S,
                    rho,
                    rho2,
                    r0,
                    r1,
                };
            } // CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/index.js // CONCATENATED MODULE: ./node_modules/viewport-mercator-project/module.js // CONCATENATED MODULE: ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
            //# sourceMappingURL=fly-to-viewport.js.map
            //# sourceMappingURL=index.js.map
            /**
             * A collection of shims that provide minimal functionality of the ES6 collections.
             *
             * These implementations are not meant to be used outside of the ResizeObserver
             * modules as they cover only a limited range of use cases.
             */
            /* eslint-disable require-jsdoc, valid-jsdoc */
            var MapShim = (function () {
                if (typeof Map !== "undefined") {
                    return Map;
                }
                /**
                 * Returns index in provided array that matches the specified key.
                 *
                 * @param {Array<Array>} arr
                 * @param {*} key
                 * @returns {number}
                 */
                function getIndex(arr, key) {
                    var result = -1;
                    arr.some(function (entry, index) {
                        if (entry[0] === key) {
                            result = index;
                            return true;
                        }
                        return false;
                    });
                    return result;
                }
                return /** @class */ (function () {
                    function class_1() {
                        this.__entries__ = [];
                    }
                    Object.defineProperty(class_1.prototype, "size", {
                        /**
                         * @returns {boolean}
                         */
                        get: function () {
                            return this.__entries__.length;
                        },
                        enumerable: true,
                        configurable: true,
                    });
                    /**
                     * @param {*} key
                     * @returns {*}
                     */
                    class_1.prototype.get = function (key) {
                        var index = getIndex(this.__entries__, key);
                        var entry = this.__entries__[index];
                        return entry && entry[1];
                    };
                    /**
                     * @param {*} key
                     * @param {*} value
                     * @returns {void}
                     */
                    class_1.prototype.set = function (key, value) {
                        var index = getIndex(this.__entries__, key);
                        if (~index) {
                            this.__entries__[index][1] = value;
                        } else {
                            this.__entries__.push([key, value]);
                        }
                    };
                    /**
                     * @param {*} key
                     * @returns {void}
                     */
                    class_1.prototype.delete = function (key) {
                        var entries = this.__entries__;
                        var index = getIndex(entries, key);
                        if (~index) {
                            entries.splice(index, 1);
                        }
                    };
                    /**
                     * @param {*} key
                     * @returns {void}
                     */
                    class_1.prototype.has = function (key) {
                        return !!~getIndex(this.__entries__, key);
                    };
                    /**
                     * @returns {void}
                     */
                    class_1.prototype.clear = function () {
                        this.__entries__.splice(0);
                    };
                    /**
                     * @param {Function} callback
                     * @param {*} [ctx=null]
                     * @returns {void}
                     */
                    class_1.prototype.forEach = function (callback, ctx) {
                        if (ctx === void 0) {
                            ctx = null;
                        }
                        for (
                            var _i = 0, _a = this.__entries__;
                            _i < _a.length;
                            _i++
                        ) {
                            var entry = _a[_i];
                            callback.call(ctx, entry[1], entry[0]);
                        }
                    };
                    return class_1;
                })();
            })();

            /**
             * Detects whether window and document objects are available in current environment.
             */
            var isBrowser =
                typeof window !== "undefined" &&
                typeof document !== "undefined" &&
                window.document === document;

            // Returns global object of a current environment.
            var global$1 = (function () {
                if (
                    typeof __webpack_require__.g !== "undefined" &&
                    __webpack_require__.g.Math === Math
                ) {
                    return __webpack_require__.g;
                }
                if (typeof self !== "undefined" && self.Math === Math) {
                    return self;
                }
                if (typeof window !== "undefined" && window.Math === Math) {
                    return window;
                }
                // eslint-disable-next-line no-new-func
                return Function("return this")();
            })();

            /**
             * A shim for the requestAnimationFrame which falls back to the setTimeout if
             * first one is not supported.
             *
             * @returns {number} Requests' identifier.
             */
            var requestAnimationFrame$1 = (function () {
                if (typeof requestAnimationFrame === "function") {
                    // It's required to use a bounded function because IE sometimes throws
                    // an "Invalid calling object" error if rAF is invoked without the global
                    // object on the left hand side.
                    return requestAnimationFrame.bind(global$1);
                }
                return function (callback) {
                    return setTimeout(function () {
                        return callback(Date.now());
                    }, 1000 / 60);
                };
            })();

            // Defines minimum timeout before adding a trailing call.
            var trailingTimeout = 2;
            /**
             * Creates a wrapper function which ensures that provided callback will be
             * invoked only once during the specified delay period.
             *
             * @param {Function} callback - Function to be invoked after the delay period.
             * @param {number} delay - Delay after which to invoke callback.
             * @returns {Function}
             */
            function throttle(callback, delay) {
                var leadingCall = false,
                    trailingCall = false,
                    lastCallTime = 0;
                /**
                 * Invokes the original callback function and schedules new invocation if
                 * the "proxy" was called during current request.
                 *
                 * @returns {void}
                 */
                function resolvePending() {
                    if (leadingCall) {
                        leadingCall = false;
                        callback();
                    }
                    if (trailingCall) {
                        proxy();
                    }
                }
                /**
                 * Callback invoked after the specified delay. It will further postpone
                 * invocation of the original function delegating it to the
                 * requestAnimationFrame.
                 *
                 * @returns {void}
                 */
                function timeoutCallback() {
                    requestAnimationFrame$1(resolvePending);
                }
                /**
                 * Schedules invocation of the original function.
                 *
                 * @returns {void}
                 */
                function proxy() {
                    var timeStamp = Date.now();
                    if (leadingCall) {
                        // Reject immediately following calls.
                        if (timeStamp - lastCallTime < trailingTimeout) {
                            return;
                        }
                        // Schedule new call to be in invoked when the pending one is resolved.
                        // This is important for "transitions" which never actually start
                        // immediately so there is a chance that we might miss one if change
                        // happens amids the pending invocation.
                        trailingCall = true;
                    } else {
                        leadingCall = true;
                        trailingCall = false;
                        setTimeout(timeoutCallback, delay);
                    }
                    lastCallTime = timeStamp;
                }
                return proxy;
            }

            // Minimum delay before invoking the update of observers.
            var REFRESH_DELAY = 20;
            // A list of substrings of CSS properties used to find transition events that
            // might affect dimensions of observed elements.
            var transitionKeys = [
                "top",
                "right",
                "bottom",
                "left",
                "width",
                "height",
                "size",
                "weight",
            ];
            // Check if MutationObserver is available.
            var mutationObserverSupported =
                typeof MutationObserver !== "undefined";
            /**
             * Singleton controller class which handles updates of ResizeObserver instances.
             */
            var ResizeObserverController = /** @class */ (function () {
                /**
                 * Creates a new instance of ResizeObserverController.
                 *
                 * @private
                 */
                function ResizeObserverController() {
                    /**
                     * Indicates whether DOM listeners have been added.
                     *
                     * @private {boolean}
                     */
                    this.connected_ = false;
                    /**
                     * Tells that controller has subscribed for Mutation Events.
                     *
                     * @private {boolean}
                     */
                    this.mutationEventsAdded_ = false;
                    /**
                     * Keeps reference to the instance of MutationObserver.
                     *
                     * @private {MutationObserver}
                     */
                    this.mutationsObserver_ = null;
                    /**
                     * A list of connected observers.
                     *
                     * @private {Array<ResizeObserverSPI>}
                     */
                    this.observers_ = [];
                    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
                    this.refresh = throttle(
                        this.refresh.bind(this),
                        REFRESH_DELAY
                    );
                }
                /**
                 * Adds observer to observers list.
                 *
                 * @param {ResizeObserverSPI} observer - Observer to be added.
                 * @returns {void}
                 */
                ResizeObserverController.prototype.addObserver = function (
                    observer
                ) {
                    if (!~this.observers_.indexOf(observer)) {
                        this.observers_.push(observer);
                    }
                    // Add listeners if they haven't been added yet.
                    if (!this.connected_) {
                        this.connect_();
                    }
                };
                /**
                 * Removes observer from observers list.
                 *
                 * @param {ResizeObserverSPI} observer - Observer to be removed.
                 * @returns {void}
                 */
                ResizeObserverController.prototype.removeObserver = function (
                    observer
                ) {
                    var observers = this.observers_;
                    var index = observers.indexOf(observer);
                    // Remove observer if it's present in registry.
                    if (~index) {
                        observers.splice(index, 1);
                    }
                    // Remove listeners if controller has no connected observers.
                    if (!observers.length && this.connected_) {
                        this.disconnect_();
                    }
                };
                /**
                 * Invokes the update of observers. It will continue running updates insofar
                 * it detects changes.
                 *
                 * @returns {void}
                 */
                ResizeObserverController.prototype.refresh = function () {
                    var changesDetected = this.updateObservers_();
                    // Continue running updates if changes have been detected as there might
                    // be future ones caused by CSS transitions.
                    if (changesDetected) {
                        this.refresh();
                    }
                };
                /**
                 * Updates every observer from observers list and notifies them of queued
                 * entries.
                 *
                 * @private
                 * @returns {boolean} Returns "true" if any observer has detected changes in
                 *      dimensions of it's elements.
                 */
                ResizeObserverController.prototype.updateObservers_ =
                    function () {
                        // Collect observers that have active observations.
                        var activeObservers = this.observers_.filter(function (
                            observer
                        ) {
                            return (
                                observer.gatherActive(), observer.hasActive()
                            );
                        });
                        // Deliver notifications in a separate cycle in order to avoid any
                        // collisions between observers, e.g. when multiple instances of
                        // ResizeObserver are tracking the same element and the callback of one
                        // of them changes content dimensions of the observed target. Sometimes
                        // this may result in notifications being blocked for the rest of observers.
                        activeObservers.forEach(function (observer) {
                            return observer.broadcastActive();
                        });
                        return activeObservers.length > 0;
                    };
                /**
                 * Initializes DOM listeners.
                 *
                 * @private
                 * @returns {void}
                 */
                ResizeObserverController.prototype.connect_ = function () {
                    // Do nothing if running in a non-browser environment or if listeners
                    // have been already added.
                    if (!isBrowser || this.connected_) {
                        return;
                    }
                    // Subscription to the "Transitionend" event is used as a workaround for
                    // delayed transitions. This way it's possible to capture at least the
                    // final state of an element.
                    document.addEventListener(
                        "transitionend",
                        this.onTransitionEnd_
                    );
                    window.addEventListener("resize", this.refresh);
                    if (mutationObserverSupported) {
                        this.mutationsObserver_ = new MutationObserver(
                            this.refresh
                        );
                        this.mutationsObserver_.observe(document, {
                            attributes: true,
                            childList: true,
                            characterData: true,
                            subtree: true,
                        });
                    } else {
                        document.addEventListener(
                            "DOMSubtreeModified",
                            this.refresh
                        );
                        this.mutationEventsAdded_ = true;
                    }
                    this.connected_ = true;
                };
                /**
                 * Removes DOM listeners.
                 *
                 * @private
                 * @returns {void}
                 */
                ResizeObserverController.prototype.disconnect_ = function () {
                    // Do nothing if running in a non-browser environment or if listeners
                    // have been already removed.
                    if (!isBrowser || !this.connected_) {
                        return;
                    }
                    document.removeEventListener(
                        "transitionend",
                        this.onTransitionEnd_
                    );
                    window.removeEventListener("resize", this.refresh);
                    if (this.mutationsObserver_) {
                        this.mutationsObserver_.disconnect();
                    }
                    if (this.mutationEventsAdded_) {
                        document.removeEventListener(
                            "DOMSubtreeModified",
                            this.refresh
                        );
                    }
                    this.mutationsObserver_ = null;
                    this.mutationEventsAdded_ = false;
                    this.connected_ = false;
                };
                /**
                 * "Transitionend" event handler.
                 *
                 * @private
                 * @param {TransitionEvent} event
                 * @returns {void}
                 */
                ResizeObserverController.prototype.onTransitionEnd_ = function (
                    _a
                ) {
                    var _b = _a.propertyName,
                        propertyName = _b === void 0 ? "" : _b;
                    // Detect whether transition may affect dimensions of an element.
                    var isReflowProperty = transitionKeys.some(function (key) {
                        return !!~propertyName.indexOf(key);
                    });
                    if (isReflowProperty) {
                        this.refresh();
                    }
                };
                /**
                 * Returns instance of the ResizeObserverController.
                 *
                 * @returns {ResizeObserverController}
                 */
                ResizeObserverController.getInstance = function () {
                    if (!this.instance_) {
                        this.instance_ = new ResizeObserverController();
                    }
                    return this.instance_;
                };
                /**
                 * Holds reference to the controller's instance.
                 *
                 * @private {ResizeObserverController}
                 */
                ResizeObserverController.instance_ = null;
                return ResizeObserverController;
            })();

            /**
             * Defines non-writable/enumerable properties of the provided target object.
             *
             * @param {Object} target - Object for which to define properties.
             * @param {Object} props - Properties to be defined.
             * @returns {Object} Target object.
             */
            var defineConfigurable = function (target, props) {
                for (
                    var _i = 0, _a = Object.keys(props);
                    _i < _a.length;
                    _i++
                ) {
                    var key = _a[_i];
                    Object.defineProperty(target, key, {
                        value: props[key],
                        enumerable: false,
                        writable: false,
                        configurable: true,
                    });
                }
                return target;
            };

            /**
             * Returns the global object associated with provided element.
             *
             * @param {Object} target
             * @returns {Object}
             */
            var getWindowOf = function (target) {
                // Assume that the element is an instance of Node, which means that it
                // has the "ownerDocument" property from which we can retrieve a
                // corresponding global object.
                var ownerGlobal =
                    target &&
                    target.ownerDocument &&
                    target.ownerDocument.defaultView;
                // Return the local global object if it's not possible extract one from
                // provided element.
                return ownerGlobal || global$1;
            };

            // Placeholder of an empty content rectangle.
            var emptyRect = createRectInit(0, 0, 0, 0);
            /**
             * Converts provided string to a number.
             *
             * @param {number|string} value
             * @returns {number}
             */
            function toFloat(value) {
                return parseFloat(value) || 0;
            }
            /**
             * Extracts borders size from provided styles.
             *
             * @param {CSSStyleDeclaration} styles
             * @param {...string} positions - Borders positions (top, right, ...)
             * @returns {number}
             */
            function getBordersSize(styles) {
                var positions = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    positions[_i - 1] = arguments[_i];
                }
                return positions.reduce(function (size, position) {
                    var value = styles["border-" + position + "-width"];
                    return size + toFloat(value);
                }, 0);
            }
            /**
             * Extracts paddings sizes from provided styles.
             *
             * @param {CSSStyleDeclaration} styles
             * @returns {Object} Paddings box.
             */
            function getPaddings(styles) {
                var positions = ["top", "right", "bottom", "left"];
                var paddings = {};
                for (
                    var _i = 0, positions_1 = positions;
                    _i < positions_1.length;
                    _i++
                ) {
                    var position = positions_1[_i];
                    var value = styles["padding-" + position];
                    paddings[position] = toFloat(value);
                }
                return paddings;
            }
            /**
             * Calculates content rectangle of provided SVG element.
             *
             * @param {SVGGraphicsElement} target - Element content rectangle of which needs
             *      to be calculated.
             * @returns {DOMRectInit}
             */
            function getSVGContentRect(target) {
                var bbox = target.getBBox();
                return createRectInit(0, 0, bbox.width, bbox.height);
            }
            /**
             * Calculates content rectangle of provided HTMLElement.
             *
             * @param {HTMLElement} target - Element for which to calculate the content rectangle.
             * @returns {DOMRectInit}
             */
            function getHTMLElementContentRect(target) {
                // Client width & height properties can't be
                // used exclusively as they provide rounded values.
                var clientWidth = target.clientWidth,
                    clientHeight = target.clientHeight;
                // By this condition we can catch all non-replaced inline, hidden and
                // detached elements. Though elements with width & height properties less
                // than 0.5 will be discarded as well.
                //
                // Without it we would need to implement separate methods for each of
                // those cases and it's not possible to perform a precise and performance
                // effective test for hidden elements. E.g. even jQuery's ':visible' filter
                // gives wrong results for elements with width & height less than 0.5.
                if (!clientWidth && !clientHeight) {
                    return emptyRect;
                }
                var styles = getWindowOf(target).getComputedStyle(target);
                var paddings = getPaddings(styles);
                var horizPad = paddings.left + paddings.right;
                var vertPad = paddings.top + paddings.bottom;
                // Computed styles of width & height are being used because they are the
                // only dimensions available to JS that contain non-rounded values. It could
                // be possible to utilize the getBoundingClientRect if only it's data wasn't
                // affected by CSS transformations let alone paddings, borders and scroll bars.
                var width = toFloat(styles.width),
                    height = toFloat(styles.height);
                // Width & height include paddings and borders when the 'border-box' box
                // model is applied (except for IE).
                if (styles.boxSizing === "border-box") {
                    // Following conditions are required to handle Internet Explorer which
                    // doesn't include paddings and borders to computed CSS dimensions.
                    //
                    // We can say that if CSS dimensions + paddings are equal to the "client"
                    // properties then it's either IE, and thus we don't need to subtract
                    // anything, or an element merely doesn't have paddings/borders styles.
                    if (Math.round(width + horizPad) !== clientWidth) {
                        width -=
                            getBordersSize(styles, "left", "right") + horizPad;
                    }
                    if (Math.round(height + vertPad) !== clientHeight) {
                        height -=
                            getBordersSize(styles, "top", "bottom") + vertPad;
                    }
                }
                // Following steps can't be applied to the document's root element as its
                // client[Width/Height] properties represent viewport area of the window.
                // Besides, it's as well not necessary as the <html> itself neither has
                // rendered scroll bars nor it can be clipped.
                if (!isDocumentElement(target)) {
                    // In some browsers (only in Firefox, actually) CSS width & height
                    // include scroll bars size which can be removed at this step as scroll
                    // bars are the only difference between rounded dimensions + paddings
                    // and "client" properties, though that is not always true in Chrome.
                    var vertScrollbar =
                        Math.round(width + horizPad) - clientWidth;
                    var horizScrollbar =
                        Math.round(height + vertPad) - clientHeight;
                    // Chrome has a rather weird rounding of "client" properties.
                    // E.g. for an element with content width of 314.2px it sometimes gives
                    // the client width of 315px and for the width of 314.7px it may give
                    // 314px. And it doesn't happen all the time. So just ignore this delta
                    // as a non-relevant.
                    if (Math.abs(vertScrollbar) !== 1) {
                        width -= vertScrollbar;
                    }
                    if (Math.abs(horizScrollbar) !== 1) {
                        height -= horizScrollbar;
                    }
                }
                return createRectInit(
                    paddings.left,
                    paddings.top,
                    width,
                    height
                );
            }
            /**
             * Checks whether provided element is an instance of the SVGGraphicsElement.
             *
             * @param {Element} target - Element to be checked.
             * @returns {boolean}
             */
            var isSVGGraphicsElement = (function () {
                // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
                // interface.
                if (typeof SVGGraphicsElement !== "undefined") {
                    return function (target) {
                        return (
                            target instanceof
                            getWindowOf(target).SVGGraphicsElement
                        );
                    };
                }
                // If it's so, then check that element is at least an instance of the
                // SVGElement and that it has the "getBBox" method.
                // eslint-disable-next-line no-extra-parens
                return function (target) {
                    return (
                        target instanceof getWindowOf(target).SVGElement &&
                        typeof target.getBBox === "function"
                    );
                };
            })();
            /**
             * Checks whether provided element is a document element (<html>).
             *
             * @param {Element} target - Element to be checked.
             * @returns {boolean}
             */
            function isDocumentElement(target) {
                return target === getWindowOf(target).document.documentElement;
            }
            /**
             * Calculates an appropriate content rectangle for provided html or svg element.
             *
             * @param {Element} target - Element content rectangle of which needs to be calculated.
             * @returns {DOMRectInit}
             */
            function getContentRect(target) {
                if (!isBrowser) {
                    return emptyRect;
                }
                if (isSVGGraphicsElement(target)) {
                    return getSVGContentRect(target);
                }
                return getHTMLElementContentRect(target);
            }
            /**
             * Creates rectangle with an interface of the DOMRectReadOnly.
             * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
             *
             * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
             * @returns {DOMRectReadOnly}
             */
            function createReadOnlyRect(_a) {
                var x = _a.x,
                    y = _a.y,
                    width = _a.width,
                    height = _a.height;
                // If DOMRectReadOnly is available use it as a prototype for the rectangle.
                var Constr =
                    typeof DOMRectReadOnly !== "undefined"
                        ? DOMRectReadOnly
                        : Object;
                var rect = Object.create(Constr.prototype);
                // Rectangle's properties are not writable and non-enumerable.
                defineConfigurable(rect, {
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    top: y,
                    right: x + width,
                    bottom: height + y,
                    left: x,
                });
                return rect;
            }
            /**
             * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
             * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
             *
             * @param {number} x - X coordinate.
             * @param {number} y - Y coordinate.
             * @param {number} width - Rectangle's width.
             * @param {number} height - Rectangle's height.
             * @returns {DOMRectInit}
             */
            function createRectInit(x, y, width, height) {
                return { x: x, y: y, width: width, height: height };
            }

            /**
             * Class that is responsible for computations of the content rectangle of
             * provided DOM element and for keeping track of it's changes.
             */
            var ResizeObservation = /** @class */ (function () {
                /**
                 * Creates an instance of ResizeObservation.
                 *
                 * @param {Element} target - Element to be observed.
                 */
                function ResizeObservation(target) {
                    /**
                     * Broadcasted width of content rectangle.
                     *
                     * @type {number}
                     */
                    this.broadcastWidth = 0;
                    /**
                     * Broadcasted height of content rectangle.
                     *
                     * @type {number}
                     */
                    this.broadcastHeight = 0;
                    /**
                     * Reference to the last observed content rectangle.
                     *
                     * @private {DOMRectInit}
                     */
                    this.contentRect_ = createRectInit(0, 0, 0, 0);
                    this.target = target;
                }
                /**
                 * Updates content rectangle and tells whether it's width or height properties
                 * have changed since the last broadcast.
                 *
                 * @returns {boolean}
                 */
                ResizeObservation.prototype.isActive = function () {
                    var rect = getContentRect(this.target);
                    this.contentRect_ = rect;
                    return (
                        rect.width !== this.broadcastWidth ||
                        rect.height !== this.broadcastHeight
                    );
                };
                /**
                 * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
                 * from the corresponding properties of the last observed content rectangle.
                 *
                 * @returns {DOMRectInit} Last observed content rectangle.
                 */
                ResizeObservation.prototype.broadcastRect = function () {
                    var rect = this.contentRect_;
                    this.broadcastWidth = rect.width;
                    this.broadcastHeight = rect.height;
                    return rect;
                };
                return ResizeObservation;
            })();

            var ResizeObserverEntry = /** @class */ (function () {
                /**
                 * Creates an instance of ResizeObserverEntry.
                 *
                 * @param {Element} target - Element that is being observed.
                 * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
                 */
                function ResizeObserverEntry(target, rectInit) {
                    var contentRect = createReadOnlyRect(rectInit);
                    // According to the specification following properties are not writable
                    // and are also not enumerable in the native implementation.
                    //
                    // Property accessors are not being used as they'd require to define a
                    // private WeakMap storage which may cause memory leaks in browsers that
                    // don't support this type of collections.
                    defineConfigurable(this, {
                        target: target,
                        contentRect: contentRect,
                    });
                }
                return ResizeObserverEntry;
            })();

            var ResizeObserverSPI = /** @class */ (function () {
                /**
                 * Creates a new instance of ResizeObserver.
                 *
                 * @param {ResizeObserverCallback} callback - Callback function that is invoked
                 *      when one of the observed elements changes it's content dimensions.
                 * @param {ResizeObserverController} controller - Controller instance which
                 *      is responsible for the updates of observer.
                 * @param {ResizeObserver} callbackCtx - Reference to the public
                 *      ResizeObserver instance which will be passed to callback function.
                 */
                function ResizeObserverSPI(callback, controller, callbackCtx) {
                    /**
                     * Collection of resize observations that have detected changes in dimensions
                     * of elements.
                     *
                     * @private {Array<ResizeObservation>}
                     */
                    this.activeObservations_ = [];
                    /**
                     * Registry of the ResizeObservation instances.
                     *
                     * @private {Map<Element, ResizeObservation>}
                     */
                    this.observations_ = new MapShim();
                    if (typeof callback !== "function") {
                        throw new TypeError(
                            "The callback provided as parameter 1 is not a function."
                        );
                    }
                    this.callback_ = callback;
                    this.controller_ = controller;
                    this.callbackCtx_ = callbackCtx;
                }
                /**
                 * Starts observing provided element.
                 *
                 * @param {Element} target - Element to be observed.
                 * @returns {void}
                 */
                ResizeObserverSPI.prototype.observe = function (target) {
                    if (!arguments.length) {
                        throw new TypeError(
                            "1 argument required, but only 0 present."
                        );
                    }
                    // Do nothing if current environment doesn't have the Element interface.
                    if (
                        typeof Element === "undefined" ||
                        !(Element instanceof Object)
                    ) {
                        return;
                    }
                    if (!(target instanceof getWindowOf(target).Element)) {
                        throw new TypeError(
                            'parameter 1 is not of type "Element".'
                        );
                    }
                    var observations = this.observations_;
                    // Do nothing if element is already being observed.
                    if (observations.has(target)) {
                        return;
                    }
                    observations.set(target, new ResizeObservation(target));
                    this.controller_.addObserver(this);
                    // Force the update of observations.
                    this.controller_.refresh();
                };
                /**
                 * Stops observing provided element.
                 *
                 * @param {Element} target - Element to stop observing.
                 * @returns {void}
                 */
                ResizeObserverSPI.prototype.unobserve = function (target) {
                    if (!arguments.length) {
                        throw new TypeError(
                            "1 argument required, but only 0 present."
                        );
                    }
                    // Do nothing if current environment doesn't have the Element interface.
                    if (
                        typeof Element === "undefined" ||
                        !(Element instanceof Object)
                    ) {
                        return;
                    }
                    if (!(target instanceof getWindowOf(target).Element)) {
                        throw new TypeError(
                            'parameter 1 is not of type "Element".'
                        );
                    }
                    var observations = this.observations_;
                    // Do nothing if element is not being observed.
                    if (!observations.has(target)) {
                        return;
                    }
                    observations.delete(target);
                    if (!observations.size) {
                        this.controller_.removeObserver(this);
                    }
                };
                /**
                 * Stops observing all elements.
                 *
                 * @returns {void}
                 */
                ResizeObserverSPI.prototype.disconnect = function () {
                    this.clearActive();
                    this.observations_.clear();
                    this.controller_.removeObserver(this);
                };
                /**
                 * Collects observation instances the associated element of which has changed
                 * it's content rectangle.
                 *
                 * @returns {void}
                 */
                ResizeObserverSPI.prototype.gatherActive = function () {
                    var _this = this;
                    this.clearActive();
                    this.observations_.forEach(function (observation) {
                        if (observation.isActive()) {
                            _this.activeObservations_.push(observation);
                        }
                    });
                };
                /**
                 * Invokes initial callback function with a list of ResizeObserverEntry
                 * instances collected from active resize observations.
                 *
                 * @returns {void}
                 */
                ResizeObserverSPI.prototype.broadcastActive = function () {
                    // Do nothing if observer doesn't have active observations.
                    if (!this.hasActive()) {
                        return;
                    }
                    var ctx = this.callbackCtx_;
                    // Create ResizeObserverEntry instance for every active observation.
                    var entries = this.activeObservations_.map(function (
                        observation
                    ) {
                        return new ResizeObserverEntry(
                            observation.target,
                            observation.broadcastRect()
                        );
                    });
                    this.callback_.call(ctx, entries, ctx);
                    this.clearActive();
                };
                /**
                 * Clears the collection of active observations.
                 *
                 * @returns {void}
                 */
                ResizeObserverSPI.prototype.clearActive = function () {
                    this.activeObservations_.splice(0);
                };
                /**
                 * Tells whether observer has active observations.
                 *
                 * @returns {boolean}
                 */
                ResizeObserverSPI.prototype.hasActive = function () {
                    return this.activeObservations_.length > 0;
                };
                return ResizeObserverSPI;
            })();

            // Registry of internal observers. If WeakMap is not available use current shim
            // for the Map collection as it has all required methods and because WeakMap
            // can't be fully polyfilled anyway.
            var observers =
                typeof WeakMap !== "undefined" ? new WeakMap() : new MapShim();
            /**
             * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
             * exposing only those methods and properties that are defined in the spec.
             */
            var ResizeObserver = /** @class */ (function () {
                /**
                 * Creates a new instance of ResizeObserver.
                 *
                 * @param {ResizeObserverCallback} callback - Callback that is invoked when
                 *      dimensions of the observed elements change.
                 */
                function ResizeObserver(callback) {
                    if (!(this instanceof ResizeObserver)) {
                        throw new TypeError(
                            "Cannot call a class as a function."
                        );
                    }
                    if (!arguments.length) {
                        throw new TypeError(
                            "1 argument required, but only 0 present."
                        );
                    }
                    var controller = ResizeObserverController.getInstance();
                    var observer = new ResizeObserverSPI(
                        callback,
                        controller,
                        this
                    );
                    observers.set(this, observer);
                }
                return ResizeObserver;
            })();
            // Expose public methods of ResizeObserver.
            ["observe", "unobserve", "disconnect"].forEach(function (method) {
                ResizeObserver.prototype[method] = function () {
                    var _a;
                    return (_a = observers.get(this))[method].apply(
                        _a,
                        arguments
                    );
                };
            });

            var index = (function () {
                // Export existing implementation if available.
                if (typeof global$1.ResizeObserver !== "undefined") {
                    return global$1.ResizeObserver;
                }
                return ResizeObserver;
            })();

            /* harmony default export */ var ResizeObserver_es = index; // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
            function _defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            function _createClass(Constructor, protoProps, staticProps) {
                if (protoProps)
                    _defineProperties(Constructor.prototype, protoProps);
                if (staticProps) _defineProperties(Constructor, staticProps);
                Object.defineProperty(Constructor, "prototype", {
                    writable: false,
                });
                return Constructor;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/globals.js
            var window_ =
                typeof window !== "undefined" ? window : __webpack_require__.g;
            var global_ =
                typeof __webpack_require__.g !== "undefined"
                    ? __webpack_require__.g
                    : window;
            var document_ = typeof document !== "undefined" ? document : {}; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/style-utils.js

            //# sourceMappingURL=globals.js.map
            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        ownKeys(Object(source), true).forEach(function (key) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        ownKeys(Object(source)).forEach(function (key) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            function _createForOfIteratorHelper(o, allowArrayLike) {
                var it;
                if (
                    typeof Symbol === "undefined" ||
                    o[Symbol.iterator] == null
                ) {
                    if (
                        Array.isArray(o) ||
                        (it = style_utils_unsupportedIterableToArray(o)) ||
                        (allowArrayLike && o && typeof o.length === "number")
                    ) {
                        if (it) o = it;
                        var i = 0;
                        var F = function F() {};
                        return {
                            s: F,
                            n: function n() {
                                if (i >= o.length) return { done: true };
                                return { done: false, value: o[i++] };
                            },
                            e: function e(_e) {
                                throw _e;
                            },
                            f: F,
                        };
                    }
                    throw new TypeError(
                        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                }
                var normalCompletion = true,
                    didErr = false,
                    err;
                return {
                    s: function s() {
                        it = o[Symbol.iterator]();
                    },
                    n: function n() {
                        var step = it.next();
                        normalCompletion = step.done;
                        return step;
                    },
                    e: function e(_e2) {
                        didErr = true;
                        err = _e2;
                    },
                    f: function f() {
                        try {
                            if (!normalCompletion && it["return"] != null)
                                it["return"]();
                        } finally {
                            if (didErr) throw err;
                        }
                    },
                };
            }

            function style_utils_unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === "string")
                    return style_utils_arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return style_utils_arrayLikeToArray(o, minLen);
            }

            function style_utils_arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for (var i = 0, arr2 = new Array(len); i < len; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            }

            var refProps = [
                "type",
                "source",
                "source-layer",
                "minzoom",
                "maxzoom",
                "filter",
                "layout",
            ];
            function normalizeStyle(style) {
                if (!style) {
                    return null;
                }

                if (typeof style === "string") {
                    return style;
                }

                if (style.toJS) {
                    style = style.toJS();
                }

                var layerIndex = {};

                var _iterator = _createForOfIteratorHelper(style.layers),
                    _step;

                try {
                    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                        var layer = _step.value;
                        layerIndex[layer.id] = layer;
                    }
                } catch (err) {
                    _iterator.e(err);
                } finally {
                    _iterator.f();
                }

                var layers = style.layers.map(function (layer) {
                    var layerRef = layerIndex[layer.ref];
                    var normalizedLayer = null;

                    if ("interactive" in layer) {
                        normalizedLayer = _objectSpread({}, layer);
                        delete normalizedLayer.interactive;
                    }

                    if (layerRef) {
                        normalizedLayer =
                            normalizedLayer || _objectSpread({}, layer);
                        delete normalizedLayer.ref;

                        var _iterator2 = _createForOfIteratorHelper(refProps),
                            _step2;

                        try {
                            for (
                                _iterator2.s();
                                !(_step2 = _iterator2.n()).done;

                            ) {
                                var propName = _step2.value;

                                if (propName in layerRef) {
                                    normalizedLayer[propName] =
                                        layerRef[propName];
                                }
                            }
                        } catch (err) {
                            _iterator2.e(err);
                        } finally {
                            _iterator2.f();
                        }
                    }

                    return normalizedLayer || layer;
                });
                return _objectSpread(
                    _objectSpread({}, style),
                    {},
                    {
                        layers: layers,
                    }
                );
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/mapbox/mapbox.js
            //# sourceMappingURL=style-utils.js.map
            /* provided dependency */ var process = __webpack_require__(3454);

            function noop() {}

            function defaultOnError(event) {
                if (event) {
                    console.error(event.error);
                }
            }

            var propTypes = {
                container: prop_types.object,
                gl: prop_types.object,
                mapboxApiAccessToken: prop_types.string,
                mapboxApiUrl: prop_types.string,
                attributionControl: prop_types.bool,
                preserveDrawingBuffer: prop_types.bool,
                reuseMaps: prop_types.bool,
                transformRequest: prop_types.func,
                mapOptions: prop_types.object,
                mapStyle: prop_types.oneOfType([
                    prop_types.string,
                    prop_types.object,
                ]),
                preventStyleDiffing: prop_types.bool,
                visible: prop_types.bool,
                asyncRender: prop_types.bool,
                onLoad: prop_types.func,
                onError: prop_types.func,
                width: prop_types.number,
                height: prop_types.number,
                viewState: prop_types.object,
                longitude: prop_types.number,
                latitude: prop_types.number,
                zoom: prop_types.number,
                bearing: prop_types.number,
                pitch: prop_types.number,
                altitude: prop_types.number,
            };
            var defaultProps = {
                container: document_.body,
                mapboxApiAccessToken: getAccessToken(),
                mapboxApiUrl: "https://api.mapbox.com",
                preserveDrawingBuffer: false,
                attributionControl: true,
                reuseMaps: false,
                mapOptions: {},
                mapStyle: "mapbox://styles/mapbox/light-v8",
                preventStyleDiffing: false,
                visible: true,
                asyncRender: false,
                onLoad: noop,
                onError: defaultOnError,
                width: 0,
                height: 0,
                longitude: 0,
                latitude: 0,
                zoom: 0,
                bearing: 0,
                pitch: 0,
                altitude: 1.5,
            };
            function getAccessToken() {
                var accessToken = null;

                if (typeof window !== "undefined" && window.location) {
                    var match = window.location.search.match(
                        /access_token=([^&\/]*)/
                    );
                    accessToken = match && match[1];
                }

                if (!accessToken && typeof process !== "undefined") {
                    accessToken =
                        accessToken ||
                        process.env.MapboxAccessToken ||
                        process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
                }

                return accessToken || "no-token";
            }

            function checkPropTypes(props) {
                var component =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : "component";

                if (props.debug) {
                    prop_types.checkPropTypes(
                        propTypes,
                        props,
                        "prop",
                        component
                    );
                }
            }

            var Mapbox = (function () {
                function Mapbox(props) {
                    var _this = this;

                    _classCallCheck(this, Mapbox);

                    _defineProperty(this, "props", defaultProps);

                    _defineProperty(this, "width", 0);

                    _defineProperty(this, "height", 0);

                    _defineProperty(this, "_fireLoadEvent", function () {
                        _this.props.onLoad({
                            type: "load",
                            target: _this._map,
                        });
                    });

                    _defineProperty(this, "_handleError", function (event) {
                        _this.props.onError(event);
                    });

                    if (!props.mapboxgl) {
                        throw new Error("Mapbox not available");
                    }

                    this.mapboxgl = props.mapboxgl;

                    if (!Mapbox.initialized) {
                        Mapbox.initialized = true;

                        this._checkStyleSheet(this.mapboxgl.version);
                    }

                    this._initialize(props);
                }

                _createClass(Mapbox, [
                    {
                        key: "finalize",
                        value: function finalize() {
                            this._destroy();

                            return this;
                        },
                    },
                    {
                        key: "setProps",
                        value: function setProps(props) {
                            this._update(this.props, props);

                            return this;
                        },
                    },
                    {
                        key: "redraw",
                        value: function redraw() {
                            var map = this._map;

                            if (map.style) {
                                if (map._frame) {
                                    map._frame.cancel();

                                    map._frame = null;
                                }

                                map._render();
                            }
                        },
                    },
                    {
                        key: "getMap",
                        value: function getMap() {
                            return this._map;
                        },
                    },
                    {
                        key: "_reuse",
                        value: function _reuse(props) {
                            this._map = Mapbox.savedMap;

                            var oldContainer = this._map.getContainer();

                            var newContainer = props.container;
                            newContainer.classList.add("mapboxgl-map");

                            while (oldContainer.childNodes.length > 0) {
                                newContainer.appendChild(
                                    oldContainer.childNodes[0]
                                );
                            }

                            this._map._container = newContainer;
                            Mapbox.savedMap = null;

                            if (props.mapStyle) {
                                this._map.setStyle(
                                    normalizeStyle(props.mapStyle),
                                    {
                                        diff: false,
                                    }
                                );
                            }

                            if (this._map.isStyleLoaded()) {
                                this._fireLoadEvent();
                            } else {
                                this._map.once(
                                    "styledata",
                                    this._fireLoadEvent
                                );
                            }
                        },
                    },
                    {
                        key: "_create",
                        value: function _create(props) {
                            if (props.reuseMaps && Mapbox.savedMap) {
                                this._reuse(props);
                            } else {
                                if (props.gl) {
                                    var getContext =
                                        HTMLCanvasElement.prototype.getContext;

                                    HTMLCanvasElement.prototype.getContext =
                                        function () {
                                            HTMLCanvasElement.prototype.getContext =
                                                getContext;
                                            return props.gl;
                                        };
                                }

                                var mapOptions = {
                                    container: props.container,
                                    center: [0, 0],
                                    zoom: 8,
                                    pitch: 0,
                                    bearing: 0,
                                    maxZoom: 24,
                                    style: normalizeStyle(props.mapStyle),
                                    interactive: false,
                                    trackResize: false,
                                    attributionControl:
                                        props.attributionControl,
                                    preserveDrawingBuffer:
                                        props.preserveDrawingBuffer,
                                };

                                if (props.transformRequest) {
                                    mapOptions.transformRequest =
                                        props.transformRequest;
                                }

                                this._map = new this.mapboxgl.Map(
                                    Object.assign(
                                        {},
                                        mapOptions,
                                        props.mapOptions
                                    )
                                );

                                this._map.once("load", this._fireLoadEvent);

                                this._map.on("error", this._handleError);
                            }

                            return this;
                        },
                    },
                    {
                        key: "_destroy",
                        value: function _destroy() {
                            if (!this._map) {
                                return;
                            }

                            if (this.props.reuseMaps && !Mapbox.savedMap) {
                                Mapbox.savedMap = this._map;

                                this._map.off("load", this._fireLoadEvent);

                                this._map.off("error", this._handleError);

                                this._map.off("styledata", this._fireLoadEvent);
                            } else {
                                this._map.remove();
                            }

                            this._map = null;
                        },
                    },
                    {
                        key: "_initialize",
                        value: function _initialize(props) {
                            var _this2 = this;

                            props = Object.assign({}, defaultProps, props);
                            checkPropTypes(props, "Mapbox");
                            this.mapboxgl.accessToken =
                                props.mapboxApiAccessToken ||
                                defaultProps.mapboxApiAccessToken;
                            this.mapboxgl.baseApiUrl = props.mapboxApiUrl;

                            this._create(props);

                            var _props = props,
                                container = _props.container;
                            Object.defineProperty(container, "offsetWidth", {
                                configurable: true,
                                get: function get() {
                                    return _this2.width;
                                },
                            });
                            Object.defineProperty(container, "clientWidth", {
                                configurable: true,
                                get: function get() {
                                    return _this2.width;
                                },
                            });
                            Object.defineProperty(container, "offsetHeight", {
                                configurable: true,
                                get: function get() {
                                    return _this2.height;
                                },
                            });
                            Object.defineProperty(container, "clientHeight", {
                                configurable: true,
                                get: function get() {
                                    return _this2.height;
                                },
                            });

                            var canvas = this._map.getCanvas();

                            if (canvas) {
                                canvas.style.outline = "none";
                            }

                            this._updateMapViewport({}, props);

                            this._updateMapSize({}, props);

                            this.props = props;
                        },
                    },
                    {
                        key: "_update",
                        value: function _update(oldProps, newProps) {
                            if (!this._map) {
                                return;
                            }

                            newProps = Object.assign({}, this.props, newProps);
                            checkPropTypes(newProps, "Mapbox");

                            var viewportChanged = this._updateMapViewport(
                                oldProps,
                                newProps
                            );

                            var sizeChanged = this._updateMapSize(
                                oldProps,
                                newProps
                            );

                            this._updateMapStyle(oldProps, newProps);

                            if (
                                !newProps.asyncRender &&
                                (viewportChanged || sizeChanged)
                            ) {
                                this.redraw();
                            }

                            this.props = newProps;
                        },
                    },
                    {
                        key: "_updateMapStyle",
                        value: function _updateMapStyle(oldProps, newProps) {
                            var styleChanged =
                                oldProps.mapStyle !== newProps.mapStyle;

                            if (styleChanged) {
                                this._map.setStyle(
                                    normalizeStyle(newProps.mapStyle),
                                    {
                                        diff: !newProps.preventStyleDiffing,
                                    }
                                );
                            }
                        },
                    },
                    {
                        key: "_updateMapSize",
                        value: function _updateMapSize(oldProps, newProps) {
                            var sizeChanged =
                                oldProps.width !== newProps.width ||
                                oldProps.height !== newProps.height;

                            if (sizeChanged) {
                                this.width = newProps.width;
                                this.height = newProps.height;

                                this._map.resize();
                            }

                            return sizeChanged;
                        },
                    },
                    {
                        key: "_updateMapViewport",
                        value: function _updateMapViewport(oldProps, newProps) {
                            var oldViewState = this._getViewState(oldProps);

                            var newViewState = this._getViewState(newProps);

                            var viewportChanged =
                                newViewState.latitude !==
                                    oldViewState.latitude ||
                                newViewState.longitude !==
                                    oldViewState.longitude ||
                                newViewState.zoom !== oldViewState.zoom ||
                                newViewState.pitch !== oldViewState.pitch ||
                                newViewState.bearing !== oldViewState.bearing ||
                                newViewState.altitude !== oldViewState.altitude;

                            if (viewportChanged) {
                                this._map.jumpTo(
                                    this._viewStateToMapboxProps(newViewState)
                                );

                                if (
                                    newViewState.altitude !==
                                    oldViewState.altitude
                                ) {
                                    this._map.transform.altitude =
                                        newViewState.altitude;
                                }
                            }

                            return viewportChanged;
                        },
                    },
                    {
                        key: "_getViewState",
                        value: function _getViewState(props) {
                            var _ref = props.viewState || props,
                                longitude = _ref.longitude,
                                latitude = _ref.latitude,
                                zoom = _ref.zoom,
                                _ref$pitch = _ref.pitch,
                                pitch = _ref$pitch === void 0 ? 0 : _ref$pitch,
                                _ref$bearing = _ref.bearing,
                                bearing =
                                    _ref$bearing === void 0 ? 0 : _ref$bearing,
                                _ref$altitude = _ref.altitude,
                                altitude =
                                    _ref$altitude === void 0
                                        ? 1.5
                                        : _ref$altitude;

                            return {
                                longitude: longitude,
                                latitude: latitude,
                                zoom: zoom,
                                pitch: pitch,
                                bearing: bearing,
                                altitude: altitude,
                            };
                        },
                    },
                    {
                        key: "_checkStyleSheet",
                        value: function _checkStyleSheet() {
                            var mapboxVersion =
                                arguments.length > 0 &&
                                arguments[0] !== undefined
                                    ? arguments[0]
                                    : "0.47.0";

                            if (typeof document_ === "undefined") {
                                return;
                            }

                            try {
                                var testElement =
                                    document_.createElement("div");
                                testElement.className = "mapboxgl-map";
                                testElement.style.display = "none";
                                document_.body.appendChild(testElement);
                                var isCssLoaded =
                                    window.getComputedStyle(testElement)
                                        .position !== "static";

                                if (!isCssLoaded) {
                                    var link = document_.createElement("link");
                                    link.setAttribute("rel", "stylesheet");
                                    link.setAttribute("type", "text/css");
                                    link.setAttribute(
                                        "href",
                                        "https://api.tiles.mapbox.com/mapbox-gl-js/v".concat(
                                            mapboxVersion,
                                            "/mapbox-gl.css"
                                        )
                                    );
                                    document_.head.appendChild(link);
                                }
                            } catch (error) {}
                        },
                    },
                    {
                        key: "_viewStateToMapboxProps",
                        value: function _viewStateToMapboxProps(viewState) {
                            return {
                                center: [
                                    viewState.longitude,
                                    viewState.latitude,
                                ],
                                zoom: viewState.zoom,
                                bearing: viewState.bearing,
                                pitch: viewState.pitch,
                            };
                        },
                    },
                ]);

                return Mapbox;
            })();

            _defineProperty(Mapbox, "initialized", false);

            _defineProperty(Mapbox, "propTypes", propTypes);

            _defineProperty(Mapbox, "defaultProps", defaultProps);

            _defineProperty(Mapbox, "savedMap", null);

            //# sourceMappingURL=mapbox.js.map
            // EXTERNAL MODULE: ./node_modules/mapbox-gl/dist/mapbox-gl.js
            var mapbox_gl = __webpack_require__(6158);
            var mapbox_gl_default =
                /*#__PURE__*/ __webpack_require__.n(mapbox_gl); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/mapboxgl.browser.js // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/math-utils.js
            //# sourceMappingURL=mapboxgl.browser.js.map
            var math_utils_EPSILON = 1e-7;

            function isArray(value) {
                return Array.isArray(value) || ArrayBuffer.isView(value);
            }

            function math_utils_equals(a, b) {
                if (a === b) {
                    return true;
                }

                if (isArray(a) && isArray(b)) {
                    if (a.length !== b.length) {
                        return false;
                    }

                    for (var i = 0; i < a.length; ++i) {
                        if (!math_utils_equals(a[i], b[i])) {
                            return false;
                        }
                    }

                    return true;
                }

                return Math.abs(a - b) <= math_utils_EPSILON;
            }
            function math_utils_clamp(value, min, max) {
                return Math.max(min, Math.min(max, value));
            }
            function utils_math_utils_lerp(a, b, t) {
                if (isArray(a)) {
                    return a.map(function (ai, i) {
                        return utils_math_utils_lerp(ai, b[i], t);
                    });
                }

                return t * b + (1 - t) * a;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/assert.js
            //# sourceMappingURL=math-utils.js.map
            function utils_assert_assert(condition, message) {
                if (!condition) {
                    throw new Error(
                        message || "react-map-gl: assertion failed."
                    );
                }
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/map-state.js
            //# sourceMappingURL=assert.js.map
            function map_state_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function map_state_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        map_state_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        map_state_ownKeys(Object(source)).forEach(function (
                            key
                        ) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            var MAPBOX_LIMITS = {
                minZoom: 0,
                maxZoom: 24,
                minPitch: 0,
                maxPitch: 85,
            };
            var DEFAULT_STATE = {
                pitch: 0,
                bearing: 0,
                altitude: 1.5,
            };
            var PITCH_MOUSE_THRESHOLD = 5;
            var PITCH_ACCEL = 1.2;

            var MapState = (function () {
                function MapState(_ref) {
                    var width = _ref.width,
                        height = _ref.height,
                        latitude = _ref.latitude,
                        longitude = _ref.longitude,
                        zoom = _ref.zoom,
                        _ref$bearing = _ref.bearing,
                        bearing =
                            _ref$bearing === void 0
                                ? DEFAULT_STATE.bearing
                                : _ref$bearing,
                        _ref$pitch = _ref.pitch,
                        pitch =
                            _ref$pitch === void 0
                                ? DEFAULT_STATE.pitch
                                : _ref$pitch,
                        _ref$altitude = _ref.altitude,
                        altitude =
                            _ref$altitude === void 0
                                ? DEFAULT_STATE.altitude
                                : _ref$altitude,
                        _ref$maxZoom = _ref.maxZoom,
                        maxZoom =
                            _ref$maxZoom === void 0
                                ? MAPBOX_LIMITS.maxZoom
                                : _ref$maxZoom,
                        _ref$minZoom = _ref.minZoom,
                        minZoom =
                            _ref$minZoom === void 0
                                ? MAPBOX_LIMITS.minZoom
                                : _ref$minZoom,
                        _ref$maxPitch = _ref.maxPitch,
                        maxPitch =
                            _ref$maxPitch === void 0
                                ? MAPBOX_LIMITS.maxPitch
                                : _ref$maxPitch,
                        _ref$minPitch = _ref.minPitch,
                        minPitch =
                            _ref$minPitch === void 0
                                ? MAPBOX_LIMITS.minPitch
                                : _ref$minPitch,
                        transitionDuration = _ref.transitionDuration,
                        transitionEasing = _ref.transitionEasing,
                        transitionInterpolator = _ref.transitionInterpolator,
                        transitionInterruption = _ref.transitionInterruption,
                        startPanLngLat = _ref.startPanLngLat,
                        startZoomLngLat = _ref.startZoomLngLat,
                        startRotatePos = _ref.startRotatePos,
                        startBearing = _ref.startBearing,
                        startPitch = _ref.startPitch,
                        startZoom = _ref.startZoom;

                    _classCallCheck(this, MapState);

                    utils_assert_assert(
                        Number.isFinite(width),
                        "`width` must be supplied"
                    );
                    utils_assert_assert(
                        Number.isFinite(height),
                        "`height` must be supplied"
                    );
                    utils_assert_assert(
                        Number.isFinite(longitude),
                        "`longitude` must be supplied"
                    );
                    utils_assert_assert(
                        Number.isFinite(latitude),
                        "`latitude` must be supplied"
                    );
                    utils_assert_assert(
                        Number.isFinite(zoom),
                        "`zoom` must be supplied"
                    );
                    this._viewportProps = this._applyConstraints({
                        width: width,
                        height: height,
                        latitude: latitude,
                        longitude: longitude,
                        zoom: zoom,
                        bearing: bearing,
                        pitch: pitch,
                        altitude: altitude,
                        maxZoom: maxZoom,
                        minZoom: minZoom,
                        maxPitch: maxPitch,
                        minPitch: minPitch,
                        transitionDuration: transitionDuration,
                        transitionEasing: transitionEasing,
                        transitionInterpolator: transitionInterpolator,
                        transitionInterruption: transitionInterruption,
                    });
                    this._state = {
                        startPanLngLat: startPanLngLat,
                        startZoomLngLat: startZoomLngLat,
                        startRotatePos: startRotatePos,
                        startBearing: startBearing,
                        startPitch: startPitch,
                        startZoom: startZoom,
                    };
                }

                _createClass(MapState, [
                    {
                        key: "getViewportProps",
                        value: function getViewportProps() {
                            return this._viewportProps;
                        },
                    },
                    {
                        key: "getState",
                        value: function getState() {
                            return this._state;
                        },
                    },
                    {
                        key: "panStart",
                        value: function panStart(_ref2) {
                            var pos = _ref2.pos;
                            return this._getUpdatedMapState({
                                startPanLngLat: this._unproject(pos),
                            });
                        },
                    },
                    {
                        key: "pan",
                        value: function pan(_ref3) {
                            var pos = _ref3.pos,
                                startPos = _ref3.startPos;

                            var startPanLngLat =
                                this._state.startPanLngLat ||
                                this._unproject(startPos);

                            if (!startPanLngLat) {
                                return this;
                            }

                            var _this$_calculateNewLn =
                                    this._calculateNewLngLat({
                                        startPanLngLat: startPanLngLat,
                                        pos: pos,
                                    }),
                                _this$_calculateNewLn2 = _slicedToArray(
                                    _this$_calculateNewLn,
                                    2
                                ),
                                longitude = _this$_calculateNewLn2[0],
                                latitude = _this$_calculateNewLn2[1];

                            return this._getUpdatedMapState({
                                longitude: longitude,
                                latitude: latitude,
                            });
                        },
                    },
                    {
                        key: "panEnd",
                        value: function panEnd() {
                            return this._getUpdatedMapState({
                                startPanLngLat: null,
                            });
                        },
                    },
                    {
                        key: "rotateStart",
                        value: function rotateStart(_ref4) {
                            var pos = _ref4.pos;
                            return this._getUpdatedMapState({
                                startRotatePos: pos,
                                startBearing: this._viewportProps.bearing,
                                startPitch: this._viewportProps.pitch,
                            });
                        },
                    },
                    {
                        key: "rotate",
                        value: function rotate(_ref5) {
                            var pos = _ref5.pos,
                                _ref5$deltaAngleX = _ref5.deltaAngleX,
                                deltaAngleX =
                                    _ref5$deltaAngleX === void 0
                                        ? 0
                                        : _ref5$deltaAngleX,
                                _ref5$deltaAngleY = _ref5.deltaAngleY,
                                deltaAngleY =
                                    _ref5$deltaAngleY === void 0
                                        ? 0
                                        : _ref5$deltaAngleY;
                            var _this$_state = this._state,
                                startRotatePos = _this$_state.startRotatePos,
                                startBearing = _this$_state.startBearing,
                                startPitch = _this$_state.startPitch;

                            if (
                                !Number.isFinite(startBearing) ||
                                !Number.isFinite(startPitch)
                            ) {
                                return this;
                            }

                            var newRotation;

                            if (pos) {
                                newRotation = this._calculateNewPitchAndBearing(
                                    map_state_objectSpread(
                                        map_state_objectSpread(
                                            {},
                                            this._getRotationParams(
                                                pos,
                                                startRotatePos
                                            )
                                        ),
                                        {},
                                        {
                                            startBearing: startBearing,
                                            startPitch: startPitch,
                                        }
                                    )
                                );
                            } else {
                                newRotation = {
                                    bearing: startBearing + deltaAngleX,
                                    pitch: startPitch + deltaAngleY,
                                };
                            }

                            return this._getUpdatedMapState(newRotation);
                        },
                    },
                    {
                        key: "rotateEnd",
                        value: function rotateEnd() {
                            return this._getUpdatedMapState({
                                startBearing: null,
                                startPitch: null,
                            });
                        },
                    },
                    {
                        key: "zoomStart",
                        value: function zoomStart(_ref6) {
                            var pos = _ref6.pos;
                            return this._getUpdatedMapState({
                                startZoomLngLat: this._unproject(pos),
                                startZoom: this._viewportProps.zoom,
                            });
                        },
                    },
                    {
                        key: "zoom",
                        value: function zoom(_ref7) {
                            var pos = _ref7.pos,
                                startPos = _ref7.startPos,
                                scale = _ref7.scale;
                            utils_assert_assert(
                                scale > 0,
                                "`scale` must be a positive number"
                            );
                            var _this$_state2 = this._state,
                                startZoom = _this$_state2.startZoom,
                                startZoomLngLat = _this$_state2.startZoomLngLat;

                            if (!Number.isFinite(startZoom)) {
                                startZoom = this._viewportProps.zoom;
                                startZoomLngLat =
                                    this._unproject(startPos) ||
                                    this._unproject(pos);
                            }

                            utils_assert_assert(
                                startZoomLngLat,
                                "`startZoomLngLat` prop is required " +
                                    "for zoom behavior to calculate where to position the map."
                            );

                            var zoom = this._calculateNewZoom({
                                scale: scale,
                                startZoom: startZoom || 0,
                            });

                            var zoomedViewport = new WebMercatorViewport(
                                Object.assign({}, this._viewportProps, {
                                    zoom: zoom,
                                })
                            );

                            var _zoomedViewport$getMa =
                                    zoomedViewport.getMapCenterByLngLatPosition(
                                        {
                                            lngLat: startZoomLngLat,
                                            pos: pos,
                                        }
                                    ),
                                _zoomedViewport$getMa2 = _slicedToArray(
                                    _zoomedViewport$getMa,
                                    2
                                ),
                                longitude = _zoomedViewport$getMa2[0],
                                latitude = _zoomedViewport$getMa2[1];

                            return this._getUpdatedMapState({
                                zoom: zoom,
                                longitude: longitude,
                                latitude: latitude,
                            });
                        },
                    },
                    {
                        key: "zoomEnd",
                        value: function zoomEnd() {
                            return this._getUpdatedMapState({
                                startZoomLngLat: null,
                                startZoom: null,
                            });
                        },
                    },
                    {
                        key: "_getUpdatedMapState",
                        value: function _getUpdatedMapState(newProps) {
                            return new MapState(
                                Object.assign(
                                    {},
                                    this._viewportProps,
                                    this._state,
                                    newProps
                                )
                            );
                        },
                    },
                    {
                        key: "_applyConstraints",
                        value: function _applyConstraints(props) {
                            var maxZoom = props.maxZoom,
                                minZoom = props.minZoom,
                                zoom = props.zoom;
                            props.zoom = math_utils_clamp(
                                zoom,
                                minZoom,
                                maxZoom
                            );
                            var maxPitch = props.maxPitch,
                                minPitch = props.minPitch,
                                pitch = props.pitch;
                            props.pitch = math_utils_clamp(
                                pitch,
                                minPitch,
                                maxPitch
                            );
                            Object.assign(props, normalizeViewportProps(props));
                            return props;
                        },
                    },
                    {
                        key: "_unproject",
                        value: function _unproject(pos) {
                            var viewport = new WebMercatorViewport(
                                this._viewportProps
                            );
                            return pos && viewport.unproject(pos);
                        },
                    },
                    {
                        key: "_calculateNewLngLat",
                        value: function _calculateNewLngLat(_ref8) {
                            var startPanLngLat = _ref8.startPanLngLat,
                                pos = _ref8.pos;
                            var viewport = new WebMercatorViewport(
                                this._viewportProps
                            );
                            return viewport.getMapCenterByLngLatPosition({
                                lngLat: startPanLngLat,
                                pos: pos,
                            });
                        },
                    },
                    {
                        key: "_calculateNewZoom",
                        value: function _calculateNewZoom(_ref9) {
                            var scale = _ref9.scale,
                                startZoom = _ref9.startZoom;
                            var _this$_viewportProps = this._viewportProps,
                                maxZoom = _this$_viewportProps.maxZoom,
                                minZoom = _this$_viewportProps.minZoom;
                            var zoom = startZoom + Math.log2(scale);
                            return math_utils_clamp(zoom, minZoom, maxZoom);
                        },
                    },
                    {
                        key: "_calculateNewPitchAndBearing",
                        value: function _calculateNewPitchAndBearing(_ref10) {
                            var deltaScaleX = _ref10.deltaScaleX,
                                deltaScaleY = _ref10.deltaScaleY,
                                startBearing = _ref10.startBearing,
                                startPitch = _ref10.startPitch;
                            deltaScaleY = math_utils_clamp(deltaScaleY, -1, 1);
                            var _this$_viewportProps2 = this._viewportProps,
                                minPitch = _this$_viewportProps2.minPitch,
                                maxPitch = _this$_viewportProps2.maxPitch;
                            var bearing = startBearing + 180 * deltaScaleX;
                            var pitch = startPitch;

                            if (deltaScaleY > 0) {
                                pitch =
                                    startPitch +
                                    deltaScaleY * (maxPitch - startPitch);
                            } else if (deltaScaleY < 0) {
                                pitch =
                                    startPitch -
                                    deltaScaleY * (minPitch - startPitch);
                            }

                            return {
                                pitch: pitch,
                                bearing: bearing,
                            };
                        },
                    },
                    {
                        key: "_getRotationParams",
                        value: function _getRotationParams(pos, startPos) {
                            var deltaX = pos[0] - startPos[0];
                            var deltaY = pos[1] - startPos[1];
                            var centerY = pos[1];
                            var startY = startPos[1];
                            var _this$_viewportProps3 = this._viewportProps,
                                width = _this$_viewportProps3.width,
                                height = _this$_viewportProps3.height;
                            var deltaScaleX = deltaX / width;
                            var deltaScaleY = 0;

                            if (deltaY > 0) {
                                if (
                                    Math.abs(height - startY) >
                                    PITCH_MOUSE_THRESHOLD
                                ) {
                                    deltaScaleY =
                                        (deltaY / (startY - height)) *
                                        PITCH_ACCEL;
                                }
                            } else if (deltaY < 0) {
                                if (startY > PITCH_MOUSE_THRESHOLD) {
                                    deltaScaleY = 1 - centerY / startY;
                                }
                            }

                            deltaScaleY = Math.min(
                                1,
                                Math.max(-1, deltaScaleY)
                            );
                            return {
                                deltaScaleX: deltaScaleX,
                                deltaScaleY: deltaScaleY,
                            };
                        },
                    },
                ]);

                return MapState;
            })(); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/map-constraints.js

            //# sourceMappingURL=map-state.js.map
            function decapitalize(s) {
                return s[0].toLowerCase() + s.slice(1);
            }

            function checkVisibilityConstraints(props) {
                var constraints =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : MAPBOX_LIMITS;

                for (var constraintName in constraints) {
                    var type = constraintName.slice(0, 3);
                    var propName = decapitalize(constraintName.slice(3));

                    if (
                        type === "min" &&
                        props[propName] < constraints[constraintName]
                    ) {
                        return false;
                    }

                    if (
                        type === "max" &&
                        props[propName] > constraints[constraintName]
                    ) {
                        return false;
                    }
                }

                return true;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/map-context.js
            //# sourceMappingURL=map-constraints.js.map
            function map_context_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function map_context_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        map_context_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        map_context_ownKeys(Object(source)).forEach(function (
                            key
                        ) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            var MapContext = (0, react.createContext)({
                viewport: null,
                map: null,
                container: null,
                onViewportChange: null,
                onViewStateChange: null,
                eventManager: null,
            });
            var MapContextProvider = MapContext.Provider;

            function WrappedProvider(_ref) {
                var value = _ref.value,
                    children = _ref.children;

                var _useState = (0, react.useState)(null),
                    _useState2 = _slicedToArray(_useState, 2),
                    map = _useState2[0],
                    setMap = _useState2[1];

                var context = (0, react.useContext)(MapContext);
                value = map_context_objectSpread(
                    map_context_objectSpread(
                        {
                            setMap: setMap,
                        },
                        context
                    ),
                    {},
                    {
                        map: (context && context.map) || map,
                    },
                    value
                );
                return react.createElement(
                    MapContextProvider,
                    {
                        value: value,
                    },
                    children
                );
            }

            MapContext.Provider = WrappedProvider;
            /* harmony default export */ var map_context = MapContext; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/use-isomorphic-layout-effect.js
            //# sourceMappingURL=map-context.js.map
            var useIsomorphicLayoutEffect =
                typeof window !== "undefined"
                    ? react.useLayoutEffect
                    : react.useEffect;
            /* harmony default export */ var use_isomorphic_layout_effect =
                useIsomorphicLayoutEffect; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/terrain.js
            //# sourceMappingURL=use-isomorphic-layout-effect.js.map
            function getTerrainElevation(map, _ref) {
                var longitude = _ref.longitude,
                    latitude = _ref.latitude;

                if (map && map.queryTerrainElevation) {
                    return (
                        map.queryTerrainElevation([longitude, latitude]) || 0
                    );
                }

                return 0;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/static-map.js
            //# sourceMappingURL=terrain.js.map
            function static_map_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function static_map_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        static_map_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        static_map_ownKeys(Object(source)).forEach(function (
                            key
                        ) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            var TOKEN_DOC_URL =
                "https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens";
            var NO_TOKEN_WARNING =
                "A valid API access token is required to use Mapbox data";

            function static_map_noop() {}

            function getViewport(_ref) {
                var map = _ref.map,
                    props = _ref.props,
                    width = _ref.width,
                    height = _ref.height;

                var viewportProps = static_map_objectSpread(
                    static_map_objectSpread(
                        static_map_objectSpread({}, props),
                        props.viewState
                    ),
                    {},
                    {
                        width: width,
                        height: height,
                    }
                );

                viewportProps.position = [
                    0,
                    0,
                    getTerrainElevation(map, viewportProps),
                ];
                return new WebMercatorViewport(viewportProps);
            }
            var UNAUTHORIZED_ERROR_CODE = 401;
            var CONTAINER_STYLE = {
                position: "absolute",
                width: "100%",
                height: "100%",
                overflow: "hidden",
            };
            var static_map_propTypes = Object.assign({}, Mapbox.propTypes, {
                width: prop_types.oneOfType([
                    prop_types.number,
                    prop_types.string,
                ]),
                height: prop_types.oneOfType([
                    prop_types.number,
                    prop_types.string,
                ]),
                onResize: prop_types.func,
                disableTokenWarning: prop_types.bool,
                visible: prop_types.bool,
                className: prop_types.string,
                style: prop_types.object,
                visibilityConstraints: prop_types.object,
            });
            var static_map_defaultProps = Object.assign(
                {},
                Mapbox.defaultProps,
                {
                    disableTokenWarning: false,
                    visible: true,
                    onResize: static_map_noop,
                    className: "",
                    style: null,
                    visibilityConstraints: MAPBOX_LIMITS,
                }
            );

            function NoTokenWarning() {
                var style = {
                    position: "absolute",
                    left: 0,
                    top: 0,
                };
                return react.createElement(
                    "div",
                    {
                        key: "warning",
                        id: "no-token-warning",
                        style: style,
                    },
                    react.createElement(
                        "h3",
                        {
                            key: "header",
                        },
                        NO_TOKEN_WARNING
                    ),
                    react.createElement(
                        "div",
                        {
                            key: "text",
                        },
                        "For information on setting up your basemap, read"
                    ),
                    react.createElement(
                        "a",
                        {
                            key: "link",
                            href: TOKEN_DOC_URL,
                        },
                        "Note on Map Tokens"
                    )
                );
            }

            function getRefHandles(mapboxRef) {
                return {
                    getMap: function getMap() {
                        return mapboxRef.current && mapboxRef.current.getMap();
                    },
                    queryRenderedFeatures: function queryRenderedFeatures(
                        geometry
                    ) {
                        var options =
                            arguments.length > 1 && arguments[1] !== undefined
                                ? arguments[1]
                                : {};
                        var map =
                            mapboxRef.current && mapboxRef.current.getMap();
                        return (
                            map && map.queryRenderedFeatures(geometry, options)
                        );
                    },
                };
            }

            var StaticMap = (0, react.forwardRef)(function (props, ref) {
                var _useState = (0, react.useState)(true),
                    _useState2 = _slicedToArray(_useState, 2),
                    accessTokenValid = _useState2[0],
                    setTokenState = _useState2[1];

                var _useState3 = (0, react.useState)({
                        width: 0,
                        height: 0,
                    }),
                    _useState4 = _slicedToArray(_useState3, 2),
                    size = _useState4[0],
                    setSize = _useState4[1];

                var mapboxRef = (0, react.useRef)(null);
                var mapDivRef = (0, react.useRef)(null);
                var containerRef = (0, react.useRef)(null);
                var overlayRef = (0, react.useRef)(null);
                var context = (0, react.useContext)(map_context);
                use_isomorphic_layout_effect(function () {
                    if (!StaticMap.supported()) {
                        return undefined;
                    }

                    var mapbox = new Mapbox(
                        static_map_objectSpread(
                            static_map_objectSpread(
                                static_map_objectSpread({}, props),
                                size
                            ),
                            {},
                            {
                                mapboxgl: mapbox_gl_default(),
                                container: mapDivRef.current,
                                onError: function onError(evt) {
                                    var statusCode =
                                        (evt.error && evt.error.status) ||
                                        evt.status;

                                    if (
                                        statusCode ===
                                            UNAUTHORIZED_ERROR_CODE &&
                                        accessTokenValid
                                    ) {
                                        console.error(NO_TOKEN_WARNING);
                                        setTokenState(false);
                                    }

                                    props.onError(evt);
                                },
                            }
                        )
                    );
                    mapboxRef.current = mapbox;

                    if (context && context.setMap) {
                        context.setMap(mapbox.getMap());
                    }

                    var resizeObserver = new ResizeObserver_es(function (
                        entries
                    ) {
                        if (entries[0].contentRect) {
                            var _entries$0$contentRec = entries[0].contentRect,
                                _width = _entries$0$contentRec.width,
                                _height = _entries$0$contentRec.height;
                            setSize({
                                width: _width,
                                height: _height,
                            });
                            props.onResize({
                                width: _width,
                                height: _height,
                            });
                        }
                    });
                    resizeObserver.observe(containerRef.current);
                    return function () {
                        mapbox.finalize();
                        mapboxRef.current = null;
                        resizeObserver.disconnect();
                    };
                }, []);
                use_isomorphic_layout_effect(function () {
                    if (mapboxRef.current) {
                        mapboxRef.current.setProps(
                            static_map_objectSpread(
                                static_map_objectSpread({}, props),
                                size
                            )
                        );
                    }
                });
                var map = mapboxRef.current && mapboxRef.current.getMap();
                (0, react.useImperativeHandle)(
                    ref,
                    function () {
                        return getRefHandles(mapboxRef);
                    },
                    []
                );
                var preventScroll = (0, react.useCallback)(function (_ref2) {
                    var target = _ref2.target;

                    if (target === overlayRef.current) {
                        target.scrollTo(0, 0);
                    }
                }, []);
                var overlays =
                    map &&
                    react.createElement(
                        MapContextProvider,
                        {
                            value: static_map_objectSpread(
                                static_map_objectSpread({}, context),
                                {},
                                {
                                    viewport:
                                        context.viewport ||
                                        getViewport(
                                            static_map_objectSpread(
                                                {
                                                    map: map,
                                                    props: props,
                                                },
                                                size
                                            )
                                        ),
                                    map: map,
                                    container:
                                        context.container ||
                                        containerRef.current,
                                }
                            ),
                        },
                        react.createElement(
                            "div",
                            {
                                key: "map-overlays",
                                className: "overlays",
                                ref: overlayRef,
                                style: CONTAINER_STYLE,
                                onScroll: preventScroll,
                            },
                            props.children
                        )
                    );
                var className = props.className,
                    width = props.width,
                    height = props.height,
                    style = props.style,
                    visibilityConstraints = props.visibilityConstraints;
                var mapContainerStyle = Object.assign(
                    {
                        position: "relative",
                    },
                    style,
                    {
                        width: width,
                        height: height,
                    }
                );
                var visible =
                    props.visible &&
                    checkVisibilityConstraints(
                        props.viewState || props,
                        visibilityConstraints
                    );
                var mapStyle = Object.assign({}, CONTAINER_STYLE, {
                    visibility: visible ? "inherit" : "hidden",
                });
                return react.createElement(
                    "div",
                    {
                        key: "map-container",
                        ref: containerRef,
                        style: mapContainerStyle,
                    },
                    react.createElement("div", {
                        key: "map-mapbox",
                        ref: mapDivRef,
                        style: mapStyle,
                        className: className,
                    }),
                    overlays,
                    !accessTokenValid &&
                        !props.disableTokenWarning &&
                        react.createElement(NoTokenWarning, null)
                );
            });

            StaticMap.supported = function () {
                return mapbox_gl_default() && mapbox_gl_default().supported();
            };

            StaticMap.propTypes = static_map_propTypes;
            StaticMap.defaultProps = static_map_defaultProps;
            /* harmony default export */ var static_map = StaticMap; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition/transition-interpolator.js
            //# sourceMappingURL=static-map.js.map
            function transition_interpolator_createForOfIteratorHelper(
                o,
                allowArrayLike
            ) {
                var it;
                if (
                    typeof Symbol === "undefined" ||
                    o[Symbol.iterator] == null
                ) {
                    if (
                        Array.isArray(o) ||
                        (it =
                            transition_interpolator_unsupportedIterableToArray(
                                o
                            )) ||
                        (allowArrayLike && o && typeof o.length === "number")
                    ) {
                        if (it) o = it;
                        var i = 0;
                        var F = function F() {};
                        return {
                            s: F,
                            n: function n() {
                                if (i >= o.length) return { done: true };
                                return { done: false, value: o[i++] };
                            },
                            e: function e(_e) {
                                throw _e;
                            },
                            f: F,
                        };
                    }
                    throw new TypeError(
                        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                }
                var normalCompletion = true,
                    didErr = false,
                    err;
                return {
                    s: function s() {
                        it = o[Symbol.iterator]();
                    },
                    n: function n() {
                        var step = it.next();
                        normalCompletion = step.done;
                        return step;
                    },
                    e: function e(_e2) {
                        didErr = true;
                        err = _e2;
                    },
                    f: function f() {
                        try {
                            if (!normalCompletion && it["return"] != null)
                                it["return"]();
                        } finally {
                            if (didErr) throw err;
                        }
                    },
                };
            }

            function transition_interpolator_unsupportedIterableToArray(
                o,
                minLen
            ) {
                if (!o) return;
                if (typeof o === "string")
                    return transition_interpolator_arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return transition_interpolator_arrayLikeToArray(o, minLen);
            }

            function transition_interpolator_arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for (var i = 0, arr2 = new Array(len); i < len; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            }

            var TransitionInterpolator = (function () {
                function TransitionInterpolator() {
                    _classCallCheck(this, TransitionInterpolator);

                    _defineProperty(this, "propNames", []);
                }

                _createClass(TransitionInterpolator, [
                    {
                        key: "arePropsEqual",
                        value: function arePropsEqual(currentProps, nextProps) {
                            var _iterator =
                                    transition_interpolator_createForOfIteratorHelper(
                                        this.propNames || []
                                    ),
                                _step;

                            try {
                                for (
                                    _iterator.s();
                                    !(_step = _iterator.n()).done;

                                ) {
                                    var key = _step.value;

                                    if (
                                        !math_utils_equals(
                                            currentProps[key],
                                            nextProps[key]
                                        )
                                    ) {
                                        return false;
                                    }
                                }
                            } catch (err) {
                                _iterator.e(err);
                            } finally {
                                _iterator.f();
                            }

                            return true;
                        },
                    },
                    {
                        key: "initializeProps",
                        value: function initializeProps(startProps, endProps) {
                            return {
                                start: startProps,
                                end: endProps,
                            };
                        },
                    },
                    {
                        key: "interpolateProps",
                        value: function interpolateProps(
                            startProps,
                            endProps,
                            t
                        ) {
                            utils_assert_assert(
                                false,
                                "interpolateProps is not implemented"
                            );
                        },
                    },
                    {
                        key: "getDuration",
                        value: function getDuration(startProps, endProps) {
                            return endProps.transitionDuration;
                        },
                    },
                ]);

                return TransitionInterpolator;
            })(); // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js

            //# sourceMappingURL=transition-interpolator.js.map
            function _assertThisInitialized(self) {
                if (self === void 0) {
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                }

                return self;
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
            function _setPrototypeOf(o, p) {
                _setPrototypeOf =
                    Object.setPrototypeOf ||
                    function _setPrototypeOf(o, p) {
                        o.__proto__ = p;
                        return o;
                    };

                return _setPrototypeOf(o, p);
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js
            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError(
                        "Super expression must either be null or a function"
                    );
                }

                subClass.prototype = Object.create(
                    superClass && superClass.prototype,
                    {
                        constructor: {
                            value: subClass,
                            writable: true,
                            configurable: true,
                        },
                    }
                );
                Object.defineProperty(subClass, "prototype", {
                    writable: false,
                });
                if (superClass) _setPrototypeOf(subClass, superClass);
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
            function _typeof(obj) {
                "@babel/helpers - typeof";

                return (
                    (_typeof =
                        "function" == typeof Symbol &&
                        "symbol" == typeof Symbol.iterator
                            ? function (obj) {
                                  return typeof obj;
                              }
                            : function (obj) {
                                  return obj &&
                                      "function" == typeof Symbol &&
                                      obj.constructor === Symbol &&
                                      obj !== Symbol.prototype
                                      ? "symbol"
                                      : typeof obj;
                              }),
                    _typeof(obj)
                );
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
            function _possibleConstructorReturn(self, call) {
                if (
                    call &&
                    (_typeof(call) === "object" || typeof call === "function")
                ) {
                    return call;
                } else if (call !== void 0) {
                    throw new TypeError(
                        "Derived constructors may only return object or undefined"
                    );
                }

                return _assertThisInitialized(self);
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
            function _getPrototypeOf(o) {
                _getPrototypeOf = Object.setPrototypeOf
                    ? Object.getPrototypeOf
                    : function _getPrototypeOf(o) {
                          return o.__proto__ || Object.getPrototypeOf(o);
                      };
                return _getPrototypeOf(o);
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition/transition-utils.js
            var WRAPPED_ANGULAR_PROPS = {
                longitude: 1,
                bearing: 1,
            };
            function transition_utils_mod(value, divisor) {
                var modulus = value % divisor;
                return modulus < 0 ? divisor + modulus : modulus;
            }
            function isValid(prop) {
                return Number.isFinite(prop) || Array.isArray(prop);
            }

            function isWrappedAngularProp(propName) {
                return propName in WRAPPED_ANGULAR_PROPS;
            }

            function getEndValueByShortestPath(propName, startValue, endValue) {
                if (
                    isWrappedAngularProp(propName) &&
                    Math.abs(endValue - startValue) > 180
                ) {
                    endValue = endValue < 0 ? endValue + 360 : endValue - 360;
                }

                return endValue;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition/viewport-fly-to-interpolator.js
            //# sourceMappingURL=transition-utils.js.map
            function viewport_fly_to_interpolator_createForOfIteratorHelper(
                o,
                allowArrayLike
            ) {
                var it;
                if (
                    typeof Symbol === "undefined" ||
                    o[Symbol.iterator] == null
                ) {
                    if (
                        Array.isArray(o) ||
                        (it =
                            viewport_fly_to_interpolator_unsupportedIterableToArray(
                                o
                            )) ||
                        (allowArrayLike && o && typeof o.length === "number")
                    ) {
                        if (it) o = it;
                        var i = 0;
                        var F = function F() {};
                        return {
                            s: F,
                            n: function n() {
                                if (i >= o.length) return { done: true };
                                return { done: false, value: o[i++] };
                            },
                            e: function e(_e) {
                                throw _e;
                            },
                            f: F,
                        };
                    }
                    throw new TypeError(
                        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                }
                var normalCompletion = true,
                    didErr = false,
                    err;
                return {
                    s: function s() {
                        it = o[Symbol.iterator]();
                    },
                    n: function n() {
                        var step = it.next();
                        normalCompletion = step.done;
                        return step;
                    },
                    e: function e(_e2) {
                        didErr = true;
                        err = _e2;
                    },
                    f: function f() {
                        try {
                            if (!normalCompletion && it["return"] != null)
                                it["return"]();
                        } finally {
                            if (didErr) throw err;
                        }
                    },
                };
            }

            function viewport_fly_to_interpolator_unsupportedIterableToArray(
                o,
                minLen
            ) {
                if (!o) return;
                if (typeof o === "string")
                    return viewport_fly_to_interpolator_arrayLikeToArray(
                        o,
                        minLen
                    );
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return viewport_fly_to_interpolator_arrayLikeToArray(
                        o,
                        minLen
                    );
            }

            function viewport_fly_to_interpolator_arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for (var i = 0, arr2 = new Array(len); i < len; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            }

            function _createSuper(Derived) {
                var hasNativeReflectConstruct = _isNativeReflectConstruct();
                return function _createSuperInternal() {
                    var Super = _getPrototypeOf(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                };
            }

            function _isNativeReflectConstruct() {
                if (typeof Reflect === "undefined" || !Reflect.construct)
                    return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Date.prototype.toString.call(
                        Reflect.construct(Date, [], function () {})
                    );
                    return true;
                } catch (e) {
                    return false;
                }
            }

            var viewport_fly_to_interpolator_VIEWPORT_TRANSITION_PROPS = [
                "longitude",
                "latitude",
                "zoom",
                "bearing",
                "pitch",
            ];
            var REQUIRED_PROPS = [
                "latitude",
                "longitude",
                "zoom",
                "width",
                "height",
            ];
            var LINEARLY_INTERPOLATED_PROPS = ["bearing", "pitch"];
            var viewport_fly_to_interpolator_DEFAULT_OPTS = {
                speed: 1.2,
                curve: 1.414,
            };

            var ViewportFlyToInterpolator = (function (_TransitionInterpolat) {
                _inherits(ViewportFlyToInterpolator, _TransitionInterpolat);

                var _super = _createSuper(ViewportFlyToInterpolator);

                function ViewportFlyToInterpolator() {
                    var _this;

                    var props =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {};

                    _classCallCheck(this, ViewportFlyToInterpolator);

                    _this = _super.call(this);

                    _defineProperty(
                        _assertThisInitialized(_this),
                        "propNames",
                        viewport_fly_to_interpolator_VIEWPORT_TRANSITION_PROPS
                    );

                    _this.props = Object.assign(
                        {},
                        viewport_fly_to_interpolator_DEFAULT_OPTS,
                        props
                    );
                    return _this;
                }

                _createClass(ViewportFlyToInterpolator, [
                    {
                        key: "initializeProps",
                        value: function initializeProps(startProps, endProps) {
                            var startViewportProps = {};
                            var endViewportProps = {};

                            var _iterator =
                                    viewport_fly_to_interpolator_createForOfIteratorHelper(
                                        REQUIRED_PROPS
                                    ),
                                _step;

                            try {
                                for (
                                    _iterator.s();
                                    !(_step = _iterator.n()).done;

                                ) {
                                    var key = _step.value;
                                    var startValue = startProps[key];
                                    var endValue = endProps[key];
                                    utils_assert_assert(
                                        isValid(startValue) &&
                                            isValid(endValue),
                                        "".concat(
                                            key,
                                            " must be supplied for transition"
                                        )
                                    );
                                    startViewportProps[key] = startValue;
                                    endViewportProps[key] =
                                        getEndValueByShortestPath(
                                            key,
                                            startValue,
                                            endValue
                                        );
                                }
                            } catch (err) {
                                _iterator.e(err);
                            } finally {
                                _iterator.f();
                            }

                            var _iterator2 =
                                    viewport_fly_to_interpolator_createForOfIteratorHelper(
                                        LINEARLY_INTERPOLATED_PROPS
                                    ),
                                _step2;

                            try {
                                for (
                                    _iterator2.s();
                                    !(_step2 = _iterator2.n()).done;

                                ) {
                                    var _key = _step2.value;

                                    var _startValue = startProps[_key] || 0;

                                    var _endValue = endProps[_key] || 0;

                                    startViewportProps[_key] = _startValue;
                                    endViewportProps[_key] =
                                        getEndValueByShortestPath(
                                            _key,
                                            _startValue,
                                            _endValue
                                        );
                                }
                            } catch (err) {
                                _iterator2.e(err);
                            } finally {
                                _iterator2.f();
                            }

                            return {
                                start: startViewportProps,
                                end: endViewportProps,
                            };
                        },
                    },
                    {
                        key: "interpolateProps",
                        value: function interpolateProps(
                            startProps,
                            endProps,
                            t
                        ) {
                            var viewport = flyToViewport(
                                startProps,
                                endProps,
                                t,
                                this.props
                            );

                            var _iterator3 =
                                    viewport_fly_to_interpolator_createForOfIteratorHelper(
                                        LINEARLY_INTERPOLATED_PROPS
                                    ),
                                _step3;

                            try {
                                for (
                                    _iterator3.s();
                                    !(_step3 = _iterator3.n()).done;

                                ) {
                                    var key = _step3.value;
                                    viewport[key] = utils_math_utils_lerp(
                                        startProps[key],
                                        endProps[key],
                                        t
                                    );
                                }
                            } catch (err) {
                                _iterator3.e(err);
                            } finally {
                                _iterator3.f();
                            }

                            return viewport;
                        },
                    },
                    {
                        key: "getDuration",
                        value: function getDuration(startProps, endProps) {
                            var transitionDuration =
                                endProps.transitionDuration;

                            if (transitionDuration === "auto") {
                                transitionDuration = getFlyToDuration(
                                    startProps,
                                    endProps,
                                    this.props
                                );
                            }

                            return transitionDuration;
                        },
                    },
                ]);

                return ViewportFlyToInterpolator;
            })(TransitionInterpolator); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition/linear-interpolator.js

            //# sourceMappingURL=viewport-fly-to-interpolator.js.map
            function linear_interpolator_createForOfIteratorHelper(
                o,
                allowArrayLike
            ) {
                var it;
                if (
                    typeof Symbol === "undefined" ||
                    o[Symbol.iterator] == null
                ) {
                    if (
                        Array.isArray(o) ||
                        (it =
                            linear_interpolator_unsupportedIterableToArray(
                                o
                            )) ||
                        (allowArrayLike && o && typeof o.length === "number")
                    ) {
                        if (it) o = it;
                        var i = 0;
                        var F = function F() {};
                        return {
                            s: F,
                            n: function n() {
                                if (i >= o.length) return { done: true };
                                return { done: false, value: o[i++] };
                            },
                            e: function e(_e) {
                                throw _e;
                            },
                            f: F,
                        };
                    }
                    throw new TypeError(
                        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                }
                var normalCompletion = true,
                    didErr = false,
                    err;
                return {
                    s: function s() {
                        it = o[Symbol.iterator]();
                    },
                    n: function n() {
                        var step = it.next();
                        normalCompletion = step.done;
                        return step;
                    },
                    e: function e(_e2) {
                        didErr = true;
                        err = _e2;
                    },
                    f: function f() {
                        try {
                            if (!normalCompletion && it["return"] != null)
                                it["return"]();
                        } finally {
                            if (didErr) throw err;
                        }
                    },
                };
            }

            function linear_interpolator_unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === "string")
                    return linear_interpolator_arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return linear_interpolator_arrayLikeToArray(o, minLen);
            }

            function linear_interpolator_arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for (var i = 0, arr2 = new Array(len); i < len; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            }

            function linear_interpolator_createSuper(Derived) {
                var hasNativeReflectConstruct =
                    linear_interpolator_isNativeReflectConstruct();
                return function _createSuperInternal() {
                    var Super = _getPrototypeOf(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                };
            }

            function linear_interpolator_isNativeReflectConstruct() {
                if (typeof Reflect === "undefined" || !Reflect.construct)
                    return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Date.prototype.toString.call(
                        Reflect.construct(Date, [], function () {})
                    );
                    return true;
                } catch (e) {
                    return false;
                }
            }

            var linear_interpolator_VIEWPORT_TRANSITION_PROPS = [
                "longitude",
                "latitude",
                "zoom",
                "bearing",
                "pitch",
            ];

            var LinearInterpolator = (function (_TransitionInterpolat) {
                _inherits(LinearInterpolator, _TransitionInterpolat);

                var _super =
                    linear_interpolator_createSuper(LinearInterpolator);

                function LinearInterpolator() {
                    var _this;

                    var opts =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {};

                    _classCallCheck(this, LinearInterpolator);

                    _this = _super.call(this);

                    if (Array.isArray(opts)) {
                        opts = {
                            transitionProps: opts,
                        };
                    }

                    _this.propNames =
                        opts.transitionProps ||
                        linear_interpolator_VIEWPORT_TRANSITION_PROPS;

                    if (opts.around) {
                        _this.around = opts.around;
                    }

                    return _this;
                }

                _createClass(LinearInterpolator, [
                    {
                        key: "initializeProps",
                        value: function initializeProps(startProps, endProps) {
                            var startViewportProps = {};
                            var endViewportProps = {};

                            if (this.around) {
                                startViewportProps.around = this.around;
                                var aroundLngLat = new WebMercatorViewport(
                                    startProps
                                ).unproject(this.around);
                                Object.assign(endViewportProps, endProps, {
                                    around: new WebMercatorViewport(
                                        endProps
                                    ).project(aroundLngLat),
                                    aroundLngLat: aroundLngLat,
                                });
                            }

                            var _iterator =
                                    linear_interpolator_createForOfIteratorHelper(
                                        this.propNames
                                    ),
                                _step;

                            try {
                                for (
                                    _iterator.s();
                                    !(_step = _iterator.n()).done;

                                ) {
                                    var key = _step.value;
                                    var startValue = startProps[key];
                                    var endValue = endProps[key];
                                    utils_assert_assert(
                                        isValid(startValue) &&
                                            isValid(endValue),
                                        "".concat(
                                            key,
                                            " must be supplied for transition"
                                        )
                                    );
                                    startViewportProps[key] = startValue;
                                    endViewportProps[key] =
                                        getEndValueByShortestPath(
                                            key,
                                            startValue,
                                            endValue
                                        );
                                }
                            } catch (err) {
                                _iterator.e(err);
                            } finally {
                                _iterator.f();
                            }

                            return {
                                start: startViewportProps,
                                end: endViewportProps,
                            };
                        },
                    },
                    {
                        key: "interpolateProps",
                        value: function interpolateProps(
                            startProps,
                            endProps,
                            t
                        ) {
                            var viewport = {};

                            var _iterator2 =
                                    linear_interpolator_createForOfIteratorHelper(
                                        this.propNames
                                    ),
                                _step2;

                            try {
                                for (
                                    _iterator2.s();
                                    !(_step2 = _iterator2.n()).done;

                                ) {
                                    var key = _step2.value;
                                    viewport[key] = utils_math_utils_lerp(
                                        startProps[key],
                                        endProps[key],
                                        t
                                    );
                                }
                            } catch (err) {
                                _iterator2.e(err);
                            } finally {
                                _iterator2.f();
                            }

                            if (endProps.around) {
                                var _WebMercatorViewport$ =
                                        new WebMercatorViewport(
                                            Object.assign(
                                                {},
                                                endProps,
                                                viewport
                                            )
                                        ).getMapCenterByLngLatPosition({
                                            lngLat: endProps.aroundLngLat,
                                            pos: utils_math_utils_lerp(
                                                startProps.around,
                                                endProps.around,
                                                t
                                            ),
                                        }),
                                    _WebMercatorViewport$2 = _slicedToArray(
                                        _WebMercatorViewport$,
                                        2
                                    ),
                                    longitude = _WebMercatorViewport$2[0],
                                    latitude = _WebMercatorViewport$2[1];

                                viewport.longitude = longitude;
                                viewport.latitude = latitude;
                            }

                            return viewport;
                        },
                    },
                ]);

                return LinearInterpolator;
            })(TransitionInterpolator); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition/index.js // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition-manager.js

            //# sourceMappingURL=linear-interpolator.js.map
            //# sourceMappingURL=index.js.map
            var transition_manager_noop = function noop() {};

            function cropEasingFunction(easing, x0) {
                var y0 = easing(x0);
                return function (t) {
                    return (1 / (1 - y0)) * (easing(t * (1 - x0) + x0) - y0);
                };
            }
            var TRANSITION_EVENTS = {
                BREAK: 1,
                SNAP_TO_END: 2,
                IGNORE: 3,
                UPDATE: 4,
            };
            var DEFAULT_PROPS = {
                transitionDuration: 0,
                transitionEasing: function transitionEasing(t) {
                    return t;
                },
                transitionInterpolator: new LinearInterpolator(),
                transitionInterruption: TRANSITION_EVENTS.BREAK,
                onTransitionStart: transition_manager_noop,
                onTransitionInterrupt: transition_manager_noop,
                onTransitionEnd: transition_manager_noop,
            };

            var TransitionManager = (function () {
                function TransitionManager() {
                    var _this = this;

                    var opts =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {};

                    _classCallCheck(this, TransitionManager);

                    _defineProperty(this, "_animationFrame", null);

                    _defineProperty(this, "_onTransitionFrame", function () {
                        _this._animationFrame = requestAnimationFrame(
                            _this._onTransitionFrame
                        );

                        _this._updateViewport();
                    });

                    this.props = null;
                    this.onViewportChange =
                        opts.onViewportChange || transition_manager_noop;
                    this.onStateChange =
                        opts.onStateChange || transition_manager_noop;
                    this.time = opts.getTime || Date.now;
                }

                _createClass(TransitionManager, [
                    {
                        key: "getViewportInTransition",
                        value: function getViewportInTransition() {
                            return this._animationFrame
                                ? this.state.propsInTransition
                                : null;
                        },
                    },
                    {
                        key: "processViewportChange",
                        value: function processViewportChange(nextProps) {
                            var currentProps = this.props;
                            this.props = nextProps;

                            if (
                                !currentProps ||
                                this._shouldIgnoreViewportChange(
                                    currentProps,
                                    nextProps
                                )
                            ) {
                                return false;
                            }

                            if (this._isTransitionEnabled(nextProps)) {
                                var startProps = Object.assign(
                                    {},
                                    currentProps
                                );
                                var endProps = Object.assign({}, nextProps);

                                if (this._isTransitionInProgress()) {
                                    currentProps.onTransitionInterrupt();

                                    if (
                                        this.state.interruption ===
                                        TRANSITION_EVENTS.SNAP_TO_END
                                    ) {
                                        Object.assign(
                                            startProps,
                                            this.state.endProps
                                        );
                                    } else {
                                        Object.assign(
                                            startProps,
                                            this.state.propsInTransition
                                        );
                                    }

                                    if (
                                        this.state.interruption ===
                                        TRANSITION_EVENTS.UPDATE
                                    ) {
                                        var currentTime = this.time();
                                        var x0 =
                                            (currentTime -
                                                this.state.startTime) /
                                            this.state.duration;
                                        endProps.transitionDuration =
                                            this.state.duration -
                                            (currentTime -
                                                this.state.startTime);
                                        endProps.transitionEasing =
                                            cropEasingFunction(
                                                this.state.easing,
                                                x0
                                            );
                                        endProps.transitionInterpolator =
                                            startProps.transitionInterpolator;
                                    }
                                }

                                endProps.onTransitionStart();

                                this._triggerTransition(startProps, endProps);

                                return true;
                            }

                            if (this._isTransitionInProgress()) {
                                currentProps.onTransitionInterrupt();

                                this._endTransition();
                            }

                            return false;
                        },
                    },
                    {
                        key: "_isTransitionInProgress",
                        value: function _isTransitionInProgress() {
                            return Boolean(this._animationFrame);
                        },
                    },
                    {
                        key: "_isTransitionEnabled",
                        value: function _isTransitionEnabled(props) {
                            var transitionDuration = props.transitionDuration,
                                transitionInterpolator =
                                    props.transitionInterpolator;
                            return (
                                (transitionDuration > 0 ||
                                    transitionDuration === "auto") &&
                                Boolean(transitionInterpolator)
                            );
                        },
                    },
                    {
                        key: "_isUpdateDueToCurrentTransition",
                        value: function _isUpdateDueToCurrentTransition(props) {
                            if (this.state.propsInTransition) {
                                return this.state.interpolator.arePropsEqual(
                                    props,
                                    this.state.propsInTransition
                                );
                            }

                            return false;
                        },
                    },
                    {
                        key: "_shouldIgnoreViewportChange",
                        value: function _shouldIgnoreViewportChange(
                            currentProps,
                            nextProps
                        ) {
                            if (!currentProps) {
                                return true;
                            }

                            if (this._isTransitionInProgress()) {
                                return (
                                    this.state.interruption ===
                                        TRANSITION_EVENTS.IGNORE ||
                                    this._isUpdateDueToCurrentTransition(
                                        nextProps
                                    )
                                );
                            }

                            if (this._isTransitionEnabled(nextProps)) {
                                return nextProps.transitionInterpolator.arePropsEqual(
                                    currentProps,
                                    nextProps
                                );
                            }

                            return true;
                        },
                    },
                    {
                        key: "_triggerTransition",
                        value: function _triggerTransition(
                            startProps,
                            endProps
                        ) {
                            utils_assert_assert(
                                this._isTransitionEnabled(endProps)
                            );

                            if (this._animationFrame) {
                                cancelAnimationFrame(this._animationFrame);
                            }

                            var transitionInterpolator =
                                endProps.transitionInterpolator;
                            var duration = transitionInterpolator.getDuration
                                ? transitionInterpolator.getDuration(
                                      startProps,
                                      endProps
                                  )
                                : endProps.transitionDuration;

                            if (duration === 0) {
                                return;
                            }

                            var initialProps =
                                endProps.transitionInterpolator.initializeProps(
                                    startProps,
                                    endProps
                                );
                            var interactionState = {
                                inTransition: true,
                                isZooming: startProps.zoom !== endProps.zoom,
                                isPanning:
                                    startProps.longitude !==
                                        endProps.longitude ||
                                    startProps.latitude !== endProps.latitude,
                                isRotating:
                                    startProps.bearing !== endProps.bearing ||
                                    startProps.pitch !== endProps.pitch,
                            };
                            this.state = {
                                duration: duration,
                                easing: endProps.transitionEasing,
                                interpolator: endProps.transitionInterpolator,
                                interruption: endProps.transitionInterruption,
                                startTime: this.time(),
                                startProps: initialProps.start,
                                endProps: initialProps.end,
                                animation: null,
                                propsInTransition: {},
                            };

                            this._onTransitionFrame();

                            this.onStateChange(interactionState);
                        },
                    },
                    {
                        key: "_endTransition",
                        value: function _endTransition() {
                            if (this._animationFrame) {
                                cancelAnimationFrame(this._animationFrame);
                                this._animationFrame = null;
                            }

                            this.onStateChange({
                                inTransition: false,
                                isZooming: false,
                                isPanning: false,
                                isRotating: false,
                            });
                        },
                    },
                    {
                        key: "_updateViewport",
                        value: function _updateViewport() {
                            var currentTime = this.time();
                            var _this$state = this.state,
                                startTime = _this$state.startTime,
                                duration = _this$state.duration,
                                easing = _this$state.easing,
                                interpolator = _this$state.interpolator,
                                startProps = _this$state.startProps,
                                endProps = _this$state.endProps;
                            var shouldEnd = false;
                            var t = (currentTime - startTime) / duration;

                            if (t >= 1) {
                                t = 1;
                                shouldEnd = true;
                            }

                            t = easing(t);
                            var viewport = interpolator.interpolateProps(
                                startProps,
                                endProps,
                                t
                            );
                            var mapState = new MapState(
                                Object.assign({}, this.props, viewport)
                            );
                            this.state.propsInTransition =
                                mapState.getViewportProps();
                            this.onViewportChange(
                                this.state.propsInTransition,
                                this.props
                            );

                            if (shouldEnd) {
                                this._endTransition();

                                this.props.onTransitionEnd();
                            }
                        },
                    },
                ]);

                return TransitionManager;
            })();

            _defineProperty(TransitionManager, "defaultProps", DEFAULT_PROPS);

            //# sourceMappingURL=transition-manager.js.map
            // EXTERNAL MODULE: ./node_modules/hammerjs/hammer.js
            var hammer = __webpack_require__(840);
            var hammer_default = /*#__PURE__*/ __webpack_require__.n(hammer); // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/utils/hammer-overrides.js
            const INPUT_START = 1;
            const INPUT_MOVE = 2;
            const INPUT_END = 4;
            const MOUSE_INPUT_MAP = {
                mousedown: INPUT_START,
                mousemove: INPUT_MOVE,
                mouseup: INPUT_END,
            };

            function some(array, predict) {
                for (let i = 0; i < array.length; i++) {
                    if (predict(array[i])) {
                        return true;
                    }
                }

                return false;
            }

            function enhancePointerEventInput(PointerEventInput) {
                const oldHandler = PointerEventInput.prototype.handler;

                PointerEventInput.prototype.handler = function handler(ev) {
                    const store = this.store;

                    if (ev.button > 0 && ev.type === "pointerdown") {
                        if (!some(store, (e) => e.pointerId === ev.pointerId)) {
                            store.push(ev);
                        }
                    }

                    oldHandler.call(this, ev);
                };
            }
            function enhanceMouseInput(MouseInput) {
                MouseInput.prototype.handler = function handler(ev) {
                    let eventType = MOUSE_INPUT_MAP[ev.type];

                    if (eventType & INPUT_START && ev.button >= 0) {
                        this.pressed = true;
                    }

                    if (eventType & INPUT_MOVE && ev.which === 0) {
                        eventType = INPUT_END;
                    }

                    if (!this.pressed) {
                        return;
                    }

                    if (eventType & INPUT_END) {
                        this.pressed = false;
                    }

                    this.callback(this.manager, eventType, {
                        pointers: [ev],
                        changedPointers: [ev],
                        pointerType: "mouse",
                        srcEvent: ev,
                    });
                };
            } // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/utils/hammer.browser.js
            //# sourceMappingURL=hammer-overrides.js.map
            enhancePointerEventInput(hammer_default().PointerEventInput);
            enhanceMouseInput(hammer_default().MouseInput);
            const Manager = hammer_default().Manager;
            /* harmony default export */ var hammer_browser = hammer_default(); // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/constants.js
            //# sourceMappingURL=hammer.browser.js.map
            const RECOGNIZERS = hammer_browser
                ? [
                      [
                          hammer_browser.Pan,
                          {
                              event: "tripan",
                              pointers: 3,
                              threshold: 0,
                              enable: false,
                          },
                      ],
                      [
                          hammer_browser.Rotate,
                          {
                              enable: false,
                          },
                      ],
                      [
                          hammer_browser.Pinch,
                          {
                              enable: false,
                          },
                      ],
                      [
                          hammer_browser.Swipe,
                          {
                              enable: false,
                          },
                      ],
                      [
                          hammer_browser.Pan,
                          {
                              threshold: 0,
                              enable: false,
                          },
                      ],
                      [
                          hammer_browser.Press,
                          {
                              enable: false,
                          },
                      ],
                      [
                          hammer_browser.Tap,
                          {
                              event: "doubletap",
                              taps: 2,
                              enable: false,
                          },
                      ],
                      [
                          hammer_browser.Tap,
                          {
                              event: "anytap",
                              enable: false,
                          },
                      ],
                      [
                          hammer_browser.Tap,
                          {
                              enable: false,
                          },
                      ],
                  ]
                : null;
            const RECOGNIZER_COMPATIBLE_MAP = {
                tripan: ["rotate", "pinch", "pan"],
                rotate: ["pinch"],
                pinch: ["pan"],
                pan: ["press", "doubletap", "anytap", "tap"],
                doubletap: ["anytap"],
                anytap: ["tap"],
            };
            const RECOGNIZER_FALLBACK_MAP = {
                doubletap: ["tap"],
            };
            const BASIC_EVENT_ALIASES = {
                pointerdown: "pointerdown",
                pointermove: "pointermove",
                pointerup: "pointerup",
                touchstart: "pointerdown",
                touchmove: "pointermove",
                touchend: "pointerup",
                mousedown: "pointerdown",
                mousemove: "pointermove",
                mouseup: "pointerup",
            };
            const INPUT_EVENT_TYPES = {
                KEY_EVENTS: ["keydown", "keyup"],
                MOUSE_EVENTS: [
                    "mousedown",
                    "mousemove",
                    "mouseup",
                    "mouseover",
                    "mouseout",
                    "mouseleave",
                ],
                WHEEL_EVENTS: ["wheel", "mousewheel"],
            };
            const EVENT_RECOGNIZER_MAP = {
                tap: "tap",
                anytap: "anytap",
                doubletap: "doubletap",
                press: "press",
                pinch: "pinch",
                pinchin: "pinch",
                pinchout: "pinch",
                pinchstart: "pinch",
                pinchmove: "pinch",
                pinchend: "pinch",
                pinchcancel: "pinch",
                rotate: "rotate",
                rotatestart: "rotate",
                rotatemove: "rotate",
                rotateend: "rotate",
                rotatecancel: "rotate",
                tripan: "tripan",
                tripanstart: "tripan",
                tripanmove: "tripan",
                tripanup: "tripan",
                tripandown: "tripan",
                tripanleft: "tripan",
                tripanright: "tripan",
                tripanend: "tripan",
                tripancancel: "tripan",
                pan: "pan",
                panstart: "pan",
                panmove: "pan",
                panup: "pan",
                pandown: "pan",
                panleft: "pan",
                panright: "pan",
                panend: "pan",
                pancancel: "pan",
                swipe: "swipe",
                swipeleft: "swipe",
                swiperight: "swipe",
                swipeup: "swipe",
                swipedown: "swipe",
            };
            const GESTURE_EVENT_ALIASES = {
                click: "tap",
                anyclick: "anytap",
                dblclick: "doubletap",
                mousedown: "pointerdown",
                mousemove: "pointermove",
                mouseup: "pointerup",
                mouseover: "pointerover",
                mouseout: "pointerout",
                mouseleave: "pointerleave",
            }; // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/utils/globals.js
            //# sourceMappingURL=constants.js.map
            const userAgent =
                typeof navigator !== "undefined" && navigator.userAgent
                    ? navigator.userAgent.toLowerCase()
                    : "";
            const globals_window_ =
                typeof window !== "undefined" ? window : __webpack_require__.g;
            const globals_global_ =
                typeof __webpack_require__.g !== "undefined"
                    ? __webpack_require__.g
                    : window;
            const globals_document_ =
                typeof document !== "undefined" ? document : {};

            let passiveSupported = false;

            try {
                const options = {
                    get passive() {
                        passiveSupported = true;
                        return true;
                    },
                };
                globals_window_.addEventListener("test", options, options);
                globals_window_.removeEventListener("test", options, options);
            } catch (err) {} // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/wheel-input.js

            //# sourceMappingURL=globals.js.map
            const firefox = userAgent.indexOf("firefox") !== -1;
            const { WHEEL_EVENTS } = INPUT_EVENT_TYPES;
            const EVENT_TYPE = "wheel";
            const WHEEL_DELTA_MAGIC_SCALER = 4.000244140625;
            const WHEEL_DELTA_PER_LINE = 40;
            const SHIFT_MULTIPLIER = 0.25;
            class WheelInput {
                constructor(element, callback, options = {}) {
                    this.element = element;
                    this.callback = callback;
                    this.options = Object.assign(
                        {
                            enable: true,
                        },
                        options
                    );
                    this.events = WHEEL_EVENTS.concat(options.events || []);
                    this.handleEvent = this.handleEvent.bind(this);
                    this.events.forEach((event) =>
                        element.addEventListener(
                            event,
                            this.handleEvent,
                            passiveSupported
                                ? {
                                      passive: false,
                                  }
                                : false
                        )
                    );
                }

                destroy() {
                    this.events.forEach((event) =>
                        this.element.removeEventListener(
                            event,
                            this.handleEvent
                        )
                    );
                }

                enableEventType(eventType, enabled) {
                    if (eventType === EVENT_TYPE) {
                        this.options.enable = enabled;
                    }
                }

                handleEvent(event) {
                    if (!this.options.enable) {
                        return;
                    }

                    let value = event.deltaY;

                    if (globals_window_.WheelEvent) {
                        if (
                            firefox &&
                            event.deltaMode ===
                                globals_window_.WheelEvent.DOM_DELTA_PIXEL
                        ) {
                            value /= globals_window_.devicePixelRatio;
                        }

                        if (
                            event.deltaMode ===
                            globals_window_.WheelEvent.DOM_DELTA_LINE
                        ) {
                            value *= WHEEL_DELTA_PER_LINE;
                        }
                    }

                    const wheelPosition = {
                        x: event.clientX,
                        y: event.clientY,
                    };

                    if (value !== 0 && value % WHEEL_DELTA_MAGIC_SCALER === 0) {
                        value = Math.floor(value / WHEEL_DELTA_MAGIC_SCALER);
                    }

                    if (event.shiftKey && value) {
                        value = value * SHIFT_MULTIPLIER;
                    }

                    this._onWheel(event, -value, wheelPosition);
                }

                _onWheel(srcEvent, delta, position) {
                    this.callback({
                        type: EVENT_TYPE,
                        center: position,
                        delta,
                        srcEvent,
                        pointerType: "mouse",
                        target: srcEvent.target,
                    });
                }
            } // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/move-input.js
            //# sourceMappingURL=wheel-input.js.map
            const { MOUSE_EVENTS } = INPUT_EVENT_TYPES;
            const MOVE_EVENT_TYPE = "pointermove";
            const OVER_EVENT_TYPE = "pointerover";
            const OUT_EVENT_TYPE = "pointerout";
            const LEAVE_EVENT_TYPE = "pointerleave";
            class MoveInput {
                constructor(element, callback, options = {}) {
                    this.element = element;
                    this.callback = callback;
                    this.pressed = false;
                    this.options = Object.assign(
                        {
                            enable: true,
                        },
                        options
                    );
                    this.enableMoveEvent = this.options.enable;
                    this.enableLeaveEvent = this.options.enable;
                    this.enableOutEvent = this.options.enable;
                    this.enableOverEvent = this.options.enable;
                    this.events = MOUSE_EVENTS.concat(options.events || []);
                    this.handleEvent = this.handleEvent.bind(this);
                    this.events.forEach((event) =>
                        element.addEventListener(event, this.handleEvent)
                    );
                }

                destroy() {
                    this.events.forEach((event) =>
                        this.element.removeEventListener(
                            event,
                            this.handleEvent
                        )
                    );
                }

                enableEventType(eventType, enabled) {
                    if (eventType === MOVE_EVENT_TYPE) {
                        this.enableMoveEvent = enabled;
                    }

                    if (eventType === OVER_EVENT_TYPE) {
                        this.enableOverEvent = enabled;
                    }

                    if (eventType === OUT_EVENT_TYPE) {
                        this.enableOutEvent = enabled;
                    }

                    if (eventType === LEAVE_EVENT_TYPE) {
                        this.enableLeaveEvent = enabled;
                    }
                }

                handleEvent(event) {
                    this.handleOverEvent(event);
                    this.handleOutEvent(event);
                    this.handleLeaveEvent(event);
                    this.handleMoveEvent(event);
                }

                handleOverEvent(event) {
                    if (this.enableOverEvent) {
                        if (event.type === "mouseover") {
                            this.callback({
                                type: OVER_EVENT_TYPE,
                                srcEvent: event,
                                pointerType: "mouse",
                                target: event.target,
                            });
                        }
                    }
                }

                handleOutEvent(event) {
                    if (this.enableOutEvent) {
                        if (event.type === "mouseout") {
                            this.callback({
                                type: OUT_EVENT_TYPE,
                                srcEvent: event,
                                pointerType: "mouse",
                                target: event.target,
                            });
                        }
                    }
                }

                handleLeaveEvent(event) {
                    if (this.enableLeaveEvent) {
                        if (event.type === "mouseleave") {
                            this.callback({
                                type: LEAVE_EVENT_TYPE,
                                srcEvent: event,
                                pointerType: "mouse",
                                target: event.target,
                            });
                        }
                    }
                }

                handleMoveEvent(event) {
                    if (this.enableMoveEvent) {
                        switch (event.type) {
                            case "mousedown":
                                if (event.button >= 0) {
                                    this.pressed = true;
                                }

                                break;

                            case "mousemove":
                                if (event.which === 0) {
                                    this.pressed = false;
                                }

                                if (!this.pressed) {
                                    this.callback({
                                        type: MOVE_EVENT_TYPE,
                                        srcEvent: event,
                                        pointerType: "mouse",
                                        target: event.target,
                                    });
                                }

                                break;

                            case "mouseup":
                                this.pressed = false;
                                break;

                            default:
                        }
                    }
                }
            } // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/key-input.js
            //# sourceMappingURL=move-input.js.map
            const { KEY_EVENTS } = INPUT_EVENT_TYPES;
            const DOWN_EVENT_TYPE = "keydown";
            const UP_EVENT_TYPE = "keyup";
            class KeyInput {
                constructor(element, callback, options = {}) {
                    this.element = element;
                    this.callback = callback;
                    this.options = Object.assign(
                        {
                            enable: true,
                        },
                        options
                    );
                    this.enableDownEvent = this.options.enable;
                    this.enableUpEvent = this.options.enable;
                    this.events = KEY_EVENTS.concat(options.events || []);
                    this.handleEvent = this.handleEvent.bind(this);
                    element.tabIndex = options.tabIndex || 0;
                    element.style.outline = "none";
                    this.events.forEach((event) =>
                        element.addEventListener(event, this.handleEvent)
                    );
                }

                destroy() {
                    this.events.forEach((event) =>
                        this.element.removeEventListener(
                            event,
                            this.handleEvent
                        )
                    );
                }

                enableEventType(eventType, enabled) {
                    if (eventType === DOWN_EVENT_TYPE) {
                        this.enableDownEvent = enabled;
                    }

                    if (eventType === UP_EVENT_TYPE) {
                        this.enableUpEvent = enabled;
                    }
                }

                handleEvent(event) {
                    const targetElement = event.target || event.srcElement;

                    if (
                        (targetElement.tagName === "INPUT" &&
                            targetElement.type === "text") ||
                        targetElement.tagName === "TEXTAREA"
                    ) {
                        return;
                    }

                    if (this.enableDownEvent && event.type === "keydown") {
                        this.callback({
                            type: DOWN_EVENT_TYPE,
                            srcEvent: event,
                            key: event.key,
                            target: event.target,
                        });
                    }

                    if (this.enableUpEvent && event.type === "keyup") {
                        this.callback({
                            type: UP_EVENT_TYPE,
                            srcEvent: event,
                            key: event.key,
                            target: event.target,
                        });
                    }
                }
            } // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/contextmenu-input.js
            //# sourceMappingURL=key-input.js.map
            const contextmenu_input_EVENT_TYPE = "contextmenu";
            class ContextmenuInput {
                constructor(element, callback, options = {}) {
                    this.element = element;
                    this.callback = callback;
                    this.options = Object.assign(
                        {
                            enable: true,
                        },
                        options
                    );
                    this.handleEvent = this.handleEvent.bind(this);
                    element.addEventListener("contextmenu", this.handleEvent);
                }

                destroy() {
                    this.element.removeEventListener(
                        "contextmenu",
                        this.handleEvent
                    );
                }

                enableEventType(eventType, enabled) {
                    if (eventType === contextmenu_input_EVENT_TYPE) {
                        this.options.enable = enabled;
                    }
                }

                handleEvent(event) {
                    if (!this.options.enable) {
                        return;
                    }

                    this.callback({
                        type: contextmenu_input_EVENT_TYPE,
                        center: {
                            x: event.clientX,
                            y: event.clientY,
                        },
                        srcEvent: event,
                        pointerType: "mouse",
                        target: event.target,
                    });
                }
            } // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/utils/event-utils.js
            //# sourceMappingURL=contextmenu-input.js.map
            const DOWN_EVENT = 1;
            const MOVE_EVENT = 2;
            const UP_EVENT = 4;
            const event_utils_MOUSE_EVENTS = {
                pointerdown: DOWN_EVENT,
                pointermove: MOVE_EVENT,
                pointerup: UP_EVENT,
                mousedown: DOWN_EVENT,
                mousemove: MOVE_EVENT,
                mouseup: UP_EVENT,
            };
            const MOUSE_EVENT_WHICH_LEFT = 1;
            const MOUSE_EVENT_WHICH_MIDDLE = 2;
            const MOUSE_EVENT_WHICH_RIGHT = 3;
            const MOUSE_EVENT_BUTTON_LEFT = 0;
            const MOUSE_EVENT_BUTTON_MIDDLE = 1;
            const MOUSE_EVENT_BUTTON_RIGHT = 2;
            const MOUSE_EVENT_BUTTONS_LEFT_MASK = 1;
            const MOUSE_EVENT_BUTTONS_RIGHT_MASK = 2;
            const MOUSE_EVENT_BUTTONS_MIDDLE_MASK = 4;
            function whichButtons(event) {
                const eventType = event_utils_MOUSE_EVENTS[event.srcEvent.type];

                if (!eventType) {
                    return null;
                }

                const { buttons, button, which } = event.srcEvent;
                let leftButton = false;
                let middleButton = false;
                let rightButton = false;

                if (
                    eventType === UP_EVENT ||
                    (eventType === MOVE_EVENT && !Number.isFinite(buttons))
                ) {
                    leftButton = which === MOUSE_EVENT_WHICH_LEFT;
                    middleButton = which === MOUSE_EVENT_WHICH_MIDDLE;
                    rightButton = which === MOUSE_EVENT_WHICH_RIGHT;
                } else if (eventType === MOVE_EVENT) {
                    leftButton = Boolean(
                        buttons & MOUSE_EVENT_BUTTONS_LEFT_MASK
                    );
                    middleButton = Boolean(
                        buttons & MOUSE_EVENT_BUTTONS_MIDDLE_MASK
                    );
                    rightButton = Boolean(
                        buttons & MOUSE_EVENT_BUTTONS_RIGHT_MASK
                    );
                } else if (eventType === DOWN_EVENT) {
                    leftButton = button === MOUSE_EVENT_BUTTON_LEFT;
                    middleButton = button === MOUSE_EVENT_BUTTON_MIDDLE;
                    rightButton = button === MOUSE_EVENT_BUTTON_RIGHT;
                }

                return {
                    leftButton,
                    middleButton,
                    rightButton,
                };
            }
            function getOffsetPosition(event, rootElement) {
                const { srcEvent } = event;

                if (!event.center && !Number.isFinite(srcEvent.clientX)) {
                    return null;
                }

                const center = event.center || {
                    x: srcEvent.clientX,
                    y: srcEvent.clientY,
                };
                const rect = rootElement.getBoundingClientRect();
                const scaleX = rect.width / rootElement.offsetWidth || 1;
                const scaleY = rect.height / rootElement.offsetHeight || 1;
                const offsetCenter = {
                    x: (center.x - rect.left - rootElement.clientLeft) / scaleX,
                    y: (center.y - rect.top - rootElement.clientTop) / scaleY,
                };
                return {
                    center,
                    offsetCenter,
                };
            } // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/utils/event-registrar.js
            //# sourceMappingURL=event-utils.js.map
            const DEFAULT_OPTIONS = {
                srcElement: "root",
                priority: 0,
            };
            class EventRegistrar {
                constructor(eventManager) {
                    this.eventManager = eventManager;
                    this.handlers = [];
                    this.handlersByElement = new Map();
                    this.handleEvent = this.handleEvent.bind(this);
                    this._active = false;
                }

                isEmpty() {
                    return !this._active;
                }

                add(type, handler, opts, once = false, passive = false) {
                    const { handlers, handlersByElement } = this;

                    if (
                        opts &&
                        (typeof opts !== "object" || opts.addEventListener)
                    ) {
                        opts = {
                            srcElement: opts,
                        };
                    }

                    opts = opts
                        ? Object.assign({}, DEFAULT_OPTIONS, opts)
                        : DEFAULT_OPTIONS;
                    let entries = handlersByElement.get(opts.srcElement);

                    if (!entries) {
                        entries = [];
                        handlersByElement.set(opts.srcElement, entries);
                    }

                    const entry = {
                        type,
                        handler,
                        srcElement: opts.srcElement,
                        priority: opts.priority,
                    };

                    if (once) {
                        entry.once = true;
                    }

                    if (passive) {
                        entry.passive = true;
                    }

                    handlers.push(entry);
                    this._active = this._active || !entry.passive;
                    let insertPosition = entries.length - 1;

                    while (insertPosition >= 0) {
                        if (
                            entries[insertPosition].priority >= entry.priority
                        ) {
                            break;
                        }

                        insertPosition--;
                    }

                    entries.splice(insertPosition + 1, 0, entry);
                }

                remove(type, handler) {
                    const { handlers, handlersByElement } = this;

                    for (let i = handlers.length - 1; i >= 0; i--) {
                        const entry = handlers[i];

                        if (entry.type === type && entry.handler === handler) {
                            handlers.splice(i, 1);
                            const entries = handlersByElement.get(
                                entry.srcElement
                            );
                            entries.splice(entries.indexOf(entry), 1);

                            if (entries.length === 0) {
                                handlersByElement.delete(entry.srcElement);
                            }
                        }
                    }

                    this._active = handlers.some((entry) => !entry.passive);
                }

                handleEvent(event) {
                    if (this.isEmpty()) {
                        return;
                    }

                    const mjolnirEvent = this._normalizeEvent(event);

                    let target = event.srcEvent.target;

                    while (target && target !== mjolnirEvent.rootElement) {
                        this._emit(mjolnirEvent, target);

                        if (mjolnirEvent.handled) {
                            return;
                        }

                        target = target.parentNode;
                    }

                    this._emit(mjolnirEvent, "root");
                }

                _emit(event, srcElement) {
                    const entries = this.handlersByElement.get(srcElement);

                    if (entries) {
                        let immediatePropagationStopped = false;

                        const stopPropagation = () => {
                            event.handled = true;
                        };

                        const stopImmediatePropagation = () => {
                            event.handled = true;
                            immediatePropagationStopped = true;
                        };

                        const entriesToRemove = [];

                        for (let i = 0; i < entries.length; i++) {
                            const { type, handler, once } = entries[i];
                            handler(
                                Object.assign({}, event, {
                                    type,
                                    stopPropagation,
                                    stopImmediatePropagation,
                                })
                            );

                            if (once) {
                                entriesToRemove.push(entries[i]);
                            }

                            if (immediatePropagationStopped) {
                                break;
                            }
                        }

                        for (let i = 0; i < entriesToRemove.length; i++) {
                            const { type, handler } = entriesToRemove[i];
                            this.remove(type, handler);
                        }
                    }
                }

                _normalizeEvent(event) {
                    const rootElement = this.eventManager.element;
                    return Object.assign(
                        {},
                        event,
                        whichButtons(event),
                        getOffsetPosition(event, rootElement),
                        {
                            handled: false,
                            rootElement,
                        }
                    );
                }
            } // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/event-manager.js
            //# sourceMappingURL=event-registrar.js.map
            const event_manager_DEFAULT_OPTIONS = {
                events: null,
                recognizers: null,
                recognizerOptions: {},
                Manager: Manager,
                touchAction: "none",
                tabIndex: 0,
            };
            class EventManager {
                constructor(element = null, options = {}) {
                    this.options = Object.assign(
                        {},
                        event_manager_DEFAULT_OPTIONS,
                        options
                    );
                    this.events = new Map();
                    this._onBasicInput = this._onBasicInput.bind(this);
                    this._onOtherEvent = this._onOtherEvent.bind(this);
                    this.setElement(element);
                    const { events } = options;

                    if (events) {
                        this.on(events);
                    }
                }

                setElement(element) {
                    if (this.element) {
                        this.destroy();
                    }

                    this.element = element;

                    if (!element) {
                        return;
                    }

                    const { options } = this;
                    const ManagerClass = options.Manager;
                    this.manager = new ManagerClass(element, {
                        touchAction: options.touchAction,
                        recognizers: options.recognizers || RECOGNIZERS,
                    }).on("hammer.input", this._onBasicInput);

                    if (!options.recognizers) {
                        Object.keys(RECOGNIZER_COMPATIBLE_MAP).forEach(
                            (name) => {
                                const recognizer = this.manager.get(name);

                                if (recognizer) {
                                    RECOGNIZER_COMPATIBLE_MAP[name].forEach(
                                        (otherName) => {
                                            recognizer.recognizeWith(otherName);
                                        }
                                    );
                                }
                            }
                        );
                    }

                    for (const recognizerName in options.recognizerOptions) {
                        const recognizer = this.manager.get(recognizerName);

                        if (recognizer) {
                            const recognizerOption =
                                options.recognizerOptions[recognizerName];
                            delete recognizerOption.enable;
                            recognizer.set(recognizerOption);
                        }
                    }

                    this.wheelInput = new WheelInput(
                        element,
                        this._onOtherEvent,
                        {
                            enable: false,
                        }
                    );
                    this.moveInput = new MoveInput(
                        element,
                        this._onOtherEvent,
                        {
                            enable: false,
                        }
                    );
                    this.keyInput = new KeyInput(element, this._onOtherEvent, {
                        enable: false,
                        tabIndex: options.tabIndex,
                    });
                    this.contextmenuInput = new ContextmenuInput(
                        element,
                        this._onOtherEvent,
                        {
                            enable: false,
                        }
                    );

                    for (const [eventAlias, eventRegistrar] of this.events) {
                        if (!eventRegistrar.isEmpty()) {
                            this._toggleRecognizer(
                                eventRegistrar.recognizerName,
                                true
                            );

                            this.manager.on(
                                eventAlias,
                                eventRegistrar.handleEvent
                            );
                        }
                    }
                }

                destroy() {
                    if (this.element) {
                        this.wheelInput.destroy();
                        this.moveInput.destroy();
                        this.keyInput.destroy();
                        this.contextmenuInput.destroy();
                        this.manager.destroy();
                        this.wheelInput = null;
                        this.moveInput = null;
                        this.keyInput = null;
                        this.contextmenuInput = null;
                        this.manager = null;
                        this.element = null;
                    }
                }

                on(event, handler, opts) {
                    this._addEventHandler(event, handler, opts, false);
                }

                once(event, handler, opts) {
                    this._addEventHandler(event, handler, opts, true);
                }

                watch(event, handler, opts) {
                    this._addEventHandler(event, handler, opts, false, true);
                }

                off(event, handler) {
                    this._removeEventHandler(event, handler);
                }

                _toggleRecognizer(name, enabled) {
                    const { manager } = this;

                    if (!manager) {
                        return;
                    }

                    const recognizer = manager.get(name);

                    if (recognizer && recognizer.options.enable !== enabled) {
                        recognizer.set({
                            enable: enabled,
                        });
                        const fallbackRecognizers =
                            RECOGNIZER_FALLBACK_MAP[name];

                        if (fallbackRecognizers && !this.options.recognizers) {
                            fallbackRecognizers.forEach((otherName) => {
                                const otherRecognizer = manager.get(otherName);

                                if (enabled) {
                                    otherRecognizer.requireFailure(name);
                                    recognizer.dropRequireFailure(otherName);
                                } else {
                                    otherRecognizer.dropRequireFailure(name);
                                }
                            });
                        }
                    }

                    this.wheelInput.enableEventType(name, enabled);
                    this.moveInput.enableEventType(name, enabled);
                    this.keyInput.enableEventType(name, enabled);
                    this.contextmenuInput.enableEventType(name, enabled);
                }

                _addEventHandler(event, handler, opts, once, passive) {
                    if (typeof event !== "string") {
                        opts = handler;

                        for (const eventName in event) {
                            this._addEventHandler(
                                eventName,
                                event[eventName],
                                opts,
                                once,
                                passive
                            );
                        }

                        return;
                    }

                    const { manager, events } = this;
                    const eventAlias = GESTURE_EVENT_ALIASES[event] || event;
                    let eventRegistrar = events.get(eventAlias);

                    if (!eventRegistrar) {
                        eventRegistrar = new EventRegistrar(this);
                        events.set(eventAlias, eventRegistrar);
                        eventRegistrar.recognizerName =
                            EVENT_RECOGNIZER_MAP[eventAlias] || eventAlias;

                        if (manager) {
                            manager.on(eventAlias, eventRegistrar.handleEvent);
                        }
                    }

                    eventRegistrar.add(event, handler, opts, once, passive);

                    if (!eventRegistrar.isEmpty()) {
                        this._toggleRecognizer(
                            eventRegistrar.recognizerName,
                            true
                        );
                    }
                }

                _removeEventHandler(event, handler) {
                    if (typeof event !== "string") {
                        for (const eventName in event) {
                            this._removeEventHandler(
                                eventName,
                                event[eventName]
                            );
                        }

                        return;
                    }

                    const { events } = this;
                    const eventAlias = GESTURE_EVENT_ALIASES[event] || event;
                    const eventRegistrar = events.get(eventAlias);

                    if (!eventRegistrar) {
                        return;
                    }

                    eventRegistrar.remove(event, handler);

                    if (eventRegistrar.isEmpty()) {
                        const { recognizerName } = eventRegistrar;
                        let isRecognizerUsed = false;

                        for (const eh of events.values()) {
                            if (
                                eh.recognizerName === recognizerName &&
                                !eh.isEmpty()
                            ) {
                                isRecognizerUsed = true;
                                break;
                            }
                        }

                        if (!isRecognizerUsed) {
                            this._toggleRecognizer(recognizerName, false);
                        }
                    }
                }

                _onBasicInput(event) {
                    const { srcEvent } = event;
                    const alias = BASIC_EVENT_ALIASES[srcEvent.type];

                    if (alias) {
                        this.manager.emit(alias, event);
                    }
                }

                _onOtherEvent(event) {
                    this.manager.emit(event.type, event);
                }
            } // CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/index.js // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/map-controller.js
            //# sourceMappingURL=event-manager.js.map
            //# sourceMappingURL=index.js.map
            function map_controller_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function map_controller_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        map_controller_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        map_controller_ownKeys(Object(source)).forEach(
                            function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            }
                        );
                    }
                }
                return target;
            }

            var NO_TRANSITION_PROPS = {
                transitionDuration: 0,
            };
            var LINEAR_TRANSITION_PROPS = {
                transitionDuration: 300,
                transitionEasing: function transitionEasing(t) {
                    return t;
                },
                transitionInterpolator: new LinearInterpolator(),
                transitionInterruption: TRANSITION_EVENTS.BREAK,
            };
            var DEFAULT_INERTIA = 300;

            var INERTIA_EASING = function INERTIA_EASING(t) {
                return 1 - (1 - t) * (1 - t);
            };

            var EVENT_TYPES = {
                WHEEL: ["wheel"],
                PAN: ["panstart", "panmove", "panend"],
                PINCH: ["pinchstart", "pinchmove", "pinchend"],
                TRIPLE_PAN: ["tripanstart", "tripanmove", "tripanend"],
                DOUBLE_TAP: ["doubletap"],
                KEYBOARD: ["keydown"],
            };

            var MapController = (function () {
                function MapController() {
                    var _this = this;

                    _classCallCheck(this, MapController);

                    _defineProperty(this, "events", []);

                    _defineProperty(this, "scrollZoom", true);

                    _defineProperty(this, "dragPan", true);

                    _defineProperty(this, "dragRotate", true);

                    _defineProperty(this, "doubleClickZoom", true);

                    _defineProperty(this, "touchZoom", true);

                    _defineProperty(this, "touchRotate", false);

                    _defineProperty(this, "keyboard", true);

                    _defineProperty(this, "_interactionState", {
                        isDragging: false,
                    });

                    _defineProperty(this, "_events", {});

                    _defineProperty(
                        this,
                        "_setInteractionState",
                        function (newState) {
                            Object.assign(_this._interactionState, newState);

                            if (_this.onStateChange) {
                                _this.onStateChange(_this._interactionState);
                            }
                        }
                    );

                    _defineProperty(
                        this,
                        "_onTransition",
                        function (newViewport, oldViewport) {
                            _this.onViewportChange(
                                newViewport,
                                _this._interactionState,
                                oldViewport
                            );
                        }
                    );

                    this.handleEvent = this.handleEvent.bind(this);
                    this._transitionManager = new TransitionManager({
                        onViewportChange: this._onTransition,
                        onStateChange: this._setInteractionState,
                    });
                }

                _createClass(MapController, [
                    {
                        key: "handleEvent",
                        value: function handleEvent(event) {
                            this.mapState = this.getMapState();
                            var eventStartBlocked = this._eventStartBlocked;

                            switch (event.type) {
                                case "panstart":
                                    return eventStartBlocked
                                        ? false
                                        : this._onPanStart(event);

                                case "panmove":
                                    return this._onPan(event);

                                case "panend":
                                    return this._onPanEnd(event);

                                case "pinchstart":
                                    return eventStartBlocked
                                        ? false
                                        : this._onPinchStart(event);

                                case "pinchmove":
                                    return this._onPinch(event);

                                case "pinchend":
                                    return this._onPinchEnd(event);

                                case "tripanstart":
                                    return eventStartBlocked
                                        ? false
                                        : this._onTriplePanStart(event);

                                case "tripanmove":
                                    return this._onTriplePan(event);

                                case "tripanend":
                                    return this._onTriplePanEnd(event);

                                case "doubletap":
                                    return this._onDoubleTap(event);

                                case "wheel":
                                    return this._onWheel(event);

                                case "keydown":
                                    return this._onKeyDown(event);

                                default:
                                    return false;
                            }
                        },
                    },
                    {
                        key: "getCenter",
                        value: function getCenter(event) {
                            var _event$offsetCenter = event.offsetCenter,
                                x = _event$offsetCenter.x,
                                y = _event$offsetCenter.y;
                            return [x, y];
                        },
                    },
                    {
                        key: "isFunctionKeyPressed",
                        value: function isFunctionKeyPressed(event) {
                            var srcEvent = event.srcEvent;
                            return Boolean(
                                srcEvent.metaKey ||
                                    srcEvent.altKey ||
                                    srcEvent.ctrlKey ||
                                    srcEvent.shiftKey
                            );
                        },
                    },
                    {
                        key: "blockEvents",
                        value: function blockEvents(timeout) {
                            var _this2 = this;

                            var timer = setTimeout(function () {
                                if (_this2._eventStartBlocked === timer) {
                                    _this2._eventStartBlocked = null;
                                }
                            }, timeout);
                            this._eventStartBlocked = timer;
                        },
                    },
                    {
                        key: "updateViewport",
                        value: function updateViewport(
                            newMapState,
                            extraProps,
                            interactionState
                        ) {
                            var oldViewport =
                                this.mapState instanceof MapState
                                    ? this.mapState.getViewportProps()
                                    : this.mapState;

                            var newViewport = map_controller_objectSpread(
                                map_controller_objectSpread(
                                    {},
                                    newMapState.getViewportProps()
                                ),
                                extraProps
                            );

                            var viewStateChanged = Object.keys(
                                newViewport
                            ).some(function (key) {
                                return oldViewport[key] !== newViewport[key];
                            });
                            this._state = newMapState.getState();

                            this._setInteractionState(interactionState);

                            if (viewStateChanged) {
                                this.onViewportChange(
                                    newViewport,
                                    this._interactionState,
                                    oldViewport
                                );
                            }
                        },
                    },
                    {
                        key: "getMapState",
                        value: function getMapState(overrides) {
                            return new MapState(
                                map_controller_objectSpread(
                                    map_controller_objectSpread(
                                        map_controller_objectSpread(
                                            {},
                                            this.mapStateProps
                                        ),
                                        this._state
                                    ),
                                    overrides
                                )
                            );
                        },
                    },
                    {
                        key: "isDragging",
                        value: function isDragging() {
                            return this._interactionState.isDragging;
                        },
                    },
                    {
                        key: "setOptions",
                        value: function setOptions(options) {
                            var onViewportChange = options.onViewportChange,
                                onStateChange = options.onStateChange,
                                _options$eventManager = options.eventManager,
                                eventManager =
                                    _options$eventManager === void 0
                                        ? this.eventManager
                                        : _options$eventManager,
                                _options$isInteractiv = options.isInteractive,
                                isInteractive =
                                    _options$isInteractiv === void 0
                                        ? true
                                        : _options$isInteractiv,
                                _options$scrollZoom = options.scrollZoom,
                                scrollZoom =
                                    _options$scrollZoom === void 0
                                        ? this.scrollZoom
                                        : _options$scrollZoom,
                                _options$dragPan = options.dragPan,
                                dragPan =
                                    _options$dragPan === void 0
                                        ? this.dragPan
                                        : _options$dragPan,
                                _options$dragRotate = options.dragRotate,
                                dragRotate =
                                    _options$dragRotate === void 0
                                        ? this.dragRotate
                                        : _options$dragRotate,
                                _options$doubleClickZ = options.doubleClickZoom,
                                doubleClickZoom =
                                    _options$doubleClickZ === void 0
                                        ? this.doubleClickZoom
                                        : _options$doubleClickZ,
                                _options$touchZoom = options.touchZoom,
                                touchZoom =
                                    _options$touchZoom === void 0
                                        ? this.touchZoom
                                        : _options$touchZoom,
                                _options$touchRotate = options.touchRotate,
                                touchRotate =
                                    _options$touchRotate === void 0
                                        ? this.touchRotate
                                        : _options$touchRotate,
                                _options$keyboard = options.keyboard,
                                keyboard =
                                    _options$keyboard === void 0
                                        ? this.keyboard
                                        : _options$keyboard;
                            this.onViewportChange = onViewportChange;
                            this.onStateChange = onStateChange;
                            var prevOptions = this.mapStateProps || {};
                            var dimensionChanged =
                                prevOptions.height !== options.height ||
                                prevOptions.width !== options.width;
                            this.mapStateProps = options;

                            if (dimensionChanged) {
                                this.mapState = prevOptions;
                                this.updateViewport(new MapState(options));
                            }

                            this._transitionManager.processViewportChange(
                                options
                            );

                            if (this.eventManager !== eventManager) {
                                this.eventManager = eventManager;
                                this._events = {};
                                this.toggleEvents(this.events, true);
                            }

                            this.toggleEvents(
                                EVENT_TYPES.WHEEL,
                                isInteractive && Boolean(scrollZoom)
                            );
                            this.toggleEvents(
                                EVENT_TYPES.PAN,
                                isInteractive && Boolean(dragPan || dragRotate)
                            );
                            this.toggleEvents(
                                EVENT_TYPES.PINCH,
                                isInteractive &&
                                    Boolean(touchZoom || touchRotate)
                            );
                            this.toggleEvents(
                                EVENT_TYPES.TRIPLE_PAN,
                                isInteractive && Boolean(touchRotate)
                            );
                            this.toggleEvents(
                                EVENT_TYPES.DOUBLE_TAP,
                                isInteractive && Boolean(doubleClickZoom)
                            );
                            this.toggleEvents(
                                EVENT_TYPES.KEYBOARD,
                                isInteractive && Boolean(keyboard)
                            );
                            this.scrollZoom = scrollZoom;
                            this.dragPan = dragPan;
                            this.dragRotate = dragRotate;
                            this.doubleClickZoom = doubleClickZoom;
                            this.touchZoom = touchZoom;
                            this.touchRotate = touchRotate;
                            this.keyboard = keyboard;
                        },
                    },
                    {
                        key: "toggleEvents",
                        value: function toggleEvents(eventNames, enabled) {
                            var _this3 = this;

                            if (this.eventManager) {
                                eventNames.forEach(function (eventName) {
                                    if (_this3._events[eventName] !== enabled) {
                                        _this3._events[eventName] = enabled;

                                        if (enabled) {
                                            _this3.eventManager.on(
                                                eventName,
                                                _this3.handleEvent
                                            );
                                        } else {
                                            _this3.eventManager.off(
                                                eventName,
                                                _this3.handleEvent
                                            );
                                        }
                                    }
                                });
                            }
                        },
                    },
                    {
                        key: "_onPanStart",
                        value: function _onPanStart(event) {
                            var pos = this.getCenter(event);
                            this._panRotate =
                                this.isFunctionKeyPressed(event) ||
                                event.rightButton;
                            var newMapState = this._panRotate
                                ? this.mapState.rotateStart({
                                      pos: pos,
                                  })
                                : this.mapState.panStart({
                                      pos: pos,
                                  });
                            this.updateViewport(
                                newMapState,
                                NO_TRANSITION_PROPS,
                                {
                                    isDragging: true,
                                }
                            );
                            return true;
                        },
                    },
                    {
                        key: "_onPan",
                        value: function _onPan(event) {
                            if (!this.isDragging()) {
                                return false;
                            }

                            return this._panRotate
                                ? this._onPanRotate(event)
                                : this._onPanMove(event);
                        },
                    },
                    {
                        key: "_onPanEnd",
                        value: function _onPanEnd(event) {
                            if (!this.isDragging()) {
                                return false;
                            }

                            return this._panRotate
                                ? this._onPanRotateEnd(event)
                                : this._onPanMoveEnd(event);
                        },
                    },
                    {
                        key: "_onPanMove",
                        value: function _onPanMove(event) {
                            if (!this.dragPan) {
                                return false;
                            }

                            var pos = this.getCenter(event);
                            var newMapState = this.mapState.pan({
                                pos: pos,
                            });
                            this.updateViewport(
                                newMapState,
                                NO_TRANSITION_PROPS,
                                {
                                    isPanning: true,
                                }
                            );
                            return true;
                        },
                    },
                    {
                        key: "_onPanMoveEnd",
                        value: function _onPanMoveEnd(event) {
                            if (this.dragPan) {
                                var _this$dragPan$inertia =
                                        this.dragPan.inertia,
                                    inertia =
                                        _this$dragPan$inertia === void 0
                                            ? DEFAULT_INERTIA
                                            : _this$dragPan$inertia;

                                if (inertia && event.velocity) {
                                    var pos = this.getCenter(event);
                                    var endPos = [
                                        pos[0] +
                                            (event.velocityX * inertia) / 2,
                                        pos[1] +
                                            (event.velocityY * inertia) / 2,
                                    ];
                                    var newControllerState = this.mapState
                                        .pan({
                                            pos: endPos,
                                        })
                                        .panEnd();
                                    this.updateViewport(
                                        newControllerState,
                                        map_controller_objectSpread(
                                            map_controller_objectSpread(
                                                {},
                                                LINEAR_TRANSITION_PROPS
                                            ),
                                            {},
                                            {
                                                transitionDuration: inertia,
                                                transitionEasing:
                                                    INERTIA_EASING,
                                            }
                                        ),
                                        {
                                            isDragging: false,
                                            isPanning: true,
                                        }
                                    );
                                    return true;
                                }
                            }

                            var newMapState = this.mapState.panEnd();
                            this.updateViewport(newMapState, null, {
                                isDragging: false,
                                isPanning: false,
                            });
                            return true;
                        },
                    },
                    {
                        key: "_onPanRotate",
                        value: function _onPanRotate(event) {
                            if (!this.dragRotate) {
                                return false;
                            }

                            var pos = this.getCenter(event);
                            var newMapState = this.mapState.rotate({
                                pos: pos,
                            });
                            this.updateViewport(
                                newMapState,
                                NO_TRANSITION_PROPS,
                                {
                                    isRotating: true,
                                }
                            );
                            return true;
                        },
                    },
                    {
                        key: "_onPanRotateEnd",
                        value: function _onPanRotateEnd(event) {
                            if (this.dragRotate) {
                                var _this$dragRotate$iner =
                                        this.dragRotate.inertia,
                                    inertia =
                                        _this$dragRotate$iner === void 0
                                            ? DEFAULT_INERTIA
                                            : _this$dragRotate$iner;

                                if (inertia && event.velocity) {
                                    var pos = this.getCenter(event);
                                    var endPos = [
                                        pos[0] +
                                            (event.velocityX * inertia) / 2,
                                        pos[1] +
                                            (event.velocityY * inertia) / 2,
                                    ];
                                    var newControllerState = this.mapState
                                        .rotate({
                                            pos: endPos,
                                        })
                                        .rotateEnd();
                                    this.updateViewport(
                                        newControllerState,
                                        map_controller_objectSpread(
                                            map_controller_objectSpread(
                                                {},
                                                LINEAR_TRANSITION_PROPS
                                            ),
                                            {},
                                            {
                                                transitionDuration: inertia,
                                                transitionEasing:
                                                    INERTIA_EASING,
                                            }
                                        ),
                                        {
                                            isDragging: false,
                                            isRotating: true,
                                        }
                                    );
                                    return true;
                                }
                            }

                            var newMapState = this.mapState.panEnd();
                            this.updateViewport(newMapState, null, {
                                isDragging: false,
                                isRotating: false,
                            });
                            return true;
                        },
                    },
                    {
                        key: "_onWheel",
                        value: function _onWheel(event) {
                            if (!this.scrollZoom) {
                                return false;
                            }

                            var _this$scrollZoom = this.scrollZoom,
                                _this$scrollZoom$spee = _this$scrollZoom.speed,
                                speed =
                                    _this$scrollZoom$spee === void 0
                                        ? 0.01
                                        : _this$scrollZoom$spee,
                                _this$scrollZoom$smoo = _this$scrollZoom.smooth,
                                smooth =
                                    _this$scrollZoom$smoo === void 0
                                        ? false
                                        : _this$scrollZoom$smoo;
                            event.preventDefault();
                            var pos = this.getCenter(event);
                            var delta = event.delta;
                            var scale =
                                2 / (1 + Math.exp(-Math.abs(delta * speed)));

                            if (delta < 0 && scale !== 0) {
                                scale = 1 / scale;
                            }

                            var newMapState = this.mapState.zoom({
                                pos: pos,
                                scale: scale,
                            });

                            if (
                                newMapState.getViewportProps().zoom ===
                                this.mapStateProps.zoom
                            ) {
                                return false;
                            }

                            this.updateViewport(
                                newMapState,
                                map_controller_objectSpread(
                                    map_controller_objectSpread(
                                        {},
                                        LINEAR_TRANSITION_PROPS
                                    ),
                                    {},
                                    {
                                        transitionInterpolator:
                                            new LinearInterpolator({
                                                around: pos,
                                            }),
                                        transitionDuration: smooth ? 250 : 1,
                                    }
                                ),
                                {
                                    isPanning: true,
                                    isZooming: true,
                                }
                            );
                            return true;
                        },
                    },
                    {
                        key: "_onPinchStart",
                        value: function _onPinchStart(event) {
                            var pos = this.getCenter(event);
                            var newMapState = this.mapState
                                .zoomStart({
                                    pos: pos,
                                })
                                .rotateStart({
                                    pos: pos,
                                });
                            this._startPinchRotation = event.rotation;
                            this._lastPinchEvent = event;
                            this.updateViewport(
                                newMapState,
                                NO_TRANSITION_PROPS,
                                {
                                    isDragging: true,
                                }
                            );
                            return true;
                        },
                    },
                    {
                        key: "_onPinch",
                        value: function _onPinch(event) {
                            if (!this.isDragging()) {
                                return false;
                            }

                            if (!this.touchZoom && !this.touchRotate) {
                                return false;
                            }

                            var newMapState = this.mapState;

                            if (this.touchZoom) {
                                var scale = event.scale;
                                var pos = this.getCenter(event);
                                newMapState = newMapState.zoom({
                                    pos: pos,
                                    scale: scale,
                                });
                            }

                            if (this.touchRotate) {
                                var rotation = event.rotation;
                                newMapState = newMapState.rotate({
                                    deltaAngleX:
                                        this._startPinchRotation - rotation,
                                });
                            }

                            this.updateViewport(
                                newMapState,
                                NO_TRANSITION_PROPS,
                                {
                                    isDragging: true,
                                    isPanning: Boolean(this.touchZoom),
                                    isZooming: Boolean(this.touchZoom),
                                    isRotating: Boolean(this.touchRotate),
                                }
                            );
                            this._lastPinchEvent = event;
                            return true;
                        },
                    },
                    {
                        key: "_onPinchEnd",
                        value: function _onPinchEnd(event) {
                            if (!this.isDragging()) {
                                return false;
                            }

                            if (this.touchZoom) {
                                var _this$touchZoom$inert =
                                        this.touchZoom.inertia,
                                    inertia =
                                        _this$touchZoom$inert === void 0
                                            ? DEFAULT_INERTIA
                                            : _this$touchZoom$inert;
                                var _lastPinchEvent = this._lastPinchEvent;

                                if (
                                    inertia &&
                                    _lastPinchEvent &&
                                    event.scale !== _lastPinchEvent.scale
                                ) {
                                    var pos = this.getCenter(event);

                                    var _newMapState =
                                        this.mapState.rotateEnd();

                                    var z = Math.log2(event.scale);

                                    var velocityZ =
                                        (z - Math.log2(_lastPinchEvent.scale)) /
                                        (event.deltaTime -
                                            _lastPinchEvent.deltaTime);

                                    var endScale = Math.pow(
                                        2,
                                        z + (velocityZ * inertia) / 2
                                    );
                                    _newMapState = _newMapState
                                        .zoom({
                                            pos: pos,
                                            scale: endScale,
                                        })
                                        .zoomEnd();
                                    this.updateViewport(
                                        _newMapState,
                                        map_controller_objectSpread(
                                            map_controller_objectSpread(
                                                {},
                                                LINEAR_TRANSITION_PROPS
                                            ),
                                            {},
                                            {
                                                transitionInterpolator:
                                                    new LinearInterpolator({
                                                        around: pos,
                                                    }),
                                                transitionDuration: inertia,
                                                transitionEasing:
                                                    INERTIA_EASING,
                                            }
                                        ),
                                        {
                                            isDragging: false,
                                            isPanning: Boolean(this.touchZoom),
                                            isZooming: Boolean(this.touchZoom),
                                            isRotating: false,
                                        }
                                    );
                                    this.blockEvents(inertia);
                                    return true;
                                }
                            }

                            var newMapState = this.mapState
                                .zoomEnd()
                                .rotateEnd();
                            this._state.startPinchRotation = 0;
                            this.updateViewport(newMapState, null, {
                                isDragging: false,
                                isPanning: false,
                                isZooming: false,
                                isRotating: false,
                            });
                            this._startPinchRotation = null;
                            this._lastPinchEvent = null;
                            return true;
                        },
                    },
                    {
                        key: "_onTriplePanStart",
                        value: function _onTriplePanStart(event) {
                            var pos = this.getCenter(event);
                            var newMapState = this.mapState.rotateStart({
                                pos: pos,
                            });
                            this.updateViewport(
                                newMapState,
                                NO_TRANSITION_PROPS,
                                {
                                    isDragging: true,
                                }
                            );
                            return true;
                        },
                    },
                    {
                        key: "_onTriplePan",
                        value: function _onTriplePan(event) {
                            if (!this.isDragging()) {
                                return false;
                            }

                            if (!this.touchRotate) {
                                return false;
                            }

                            var pos = this.getCenter(event);
                            pos[0] -= event.deltaX;
                            var newMapState = this.mapState.rotate({
                                pos: pos,
                            });
                            this.updateViewport(
                                newMapState,
                                NO_TRANSITION_PROPS,
                                {
                                    isRotating: true,
                                }
                            );
                            return true;
                        },
                    },
                    {
                        key: "_onTriplePanEnd",
                        value: function _onTriplePanEnd(event) {
                            if (!this.isDragging()) {
                                return false;
                            }

                            if (this.touchRotate) {
                                var _this$touchRotate$ine =
                                        this.touchRotate.inertia,
                                    inertia =
                                        _this$touchRotate$ine === void 0
                                            ? DEFAULT_INERTIA
                                            : _this$touchRotate$ine;

                                if (inertia && event.velocityY) {
                                    var pos = this.getCenter(event);
                                    var endPos = [
                                        pos[0],
                                        (pos[1] +=
                                            (event.velocityY * inertia) / 2),
                                    ];

                                    var _newMapState2 = this.mapState.rotate({
                                        pos: endPos,
                                    });

                                    this.updateViewport(
                                        _newMapState2,
                                        map_controller_objectSpread(
                                            map_controller_objectSpread(
                                                {},
                                                LINEAR_TRANSITION_PROPS
                                            ),
                                            {},
                                            {
                                                transitionDuration: inertia,
                                                transitionEasing:
                                                    INERTIA_EASING,
                                            }
                                        ),
                                        {
                                            isDragging: false,
                                            isRotating: true,
                                        }
                                    );
                                    this.blockEvents(inertia);
                                    return false;
                                }
                            }

                            var newMapState = this.mapState.rotateEnd();
                            this.updateViewport(newMapState, null, {
                                isDragging: false,
                                isRotating: false,
                            });
                            return true;
                        },
                    },
                    {
                        key: "_onDoubleTap",
                        value: function _onDoubleTap(event) {
                            if (!this.doubleClickZoom) {
                                return false;
                            }

                            var pos = this.getCenter(event);
                            var isZoomOut = this.isFunctionKeyPressed(event);
                            var newMapState = this.mapState.zoom({
                                pos: pos,
                                scale: isZoomOut ? 0.5 : 2,
                            });
                            this.updateViewport(
                                newMapState,
                                Object.assign({}, LINEAR_TRANSITION_PROPS, {
                                    transitionInterpolator:
                                        new LinearInterpolator({
                                            around: pos,
                                        }),
                                }),
                                {
                                    isZooming: true,
                                }
                            );
                            return true;
                        },
                    },
                    {
                        key: "_onKeyDown",
                        value: function _onKeyDown(event) {
                            if (!this.keyboard) {
                                return false;
                            }

                            var funcKey = this.isFunctionKeyPressed(event);
                            var _this$keyboard = this.keyboard,
                                _this$keyboard$zoomSp =
                                    _this$keyboard.zoomSpeed,
                                zoomSpeed =
                                    _this$keyboard$zoomSp === void 0
                                        ? 2
                                        : _this$keyboard$zoomSp,
                                _this$keyboard$moveSp =
                                    _this$keyboard.moveSpeed,
                                moveSpeed =
                                    _this$keyboard$moveSp === void 0
                                        ? 100
                                        : _this$keyboard$moveSp,
                                _this$keyboard$rotate =
                                    _this$keyboard.rotateSpeedX,
                                rotateSpeedX =
                                    _this$keyboard$rotate === void 0
                                        ? 15
                                        : _this$keyboard$rotate,
                                _this$keyboard$rotate2 =
                                    _this$keyboard.rotateSpeedY,
                                rotateSpeedY =
                                    _this$keyboard$rotate2 === void 0
                                        ? 10
                                        : _this$keyboard$rotate2;
                            var mapStateProps = this.mapStateProps;
                            var newMapState;

                            switch (event.srcEvent.keyCode) {
                                case 189:
                                    if (funcKey) {
                                        newMapState = this.getMapState({
                                            zoom:
                                                mapStateProps.zoom -
                                                Math.log2(zoomSpeed) -
                                                1,
                                        });
                                    } else {
                                        newMapState = this.getMapState({
                                            zoom:
                                                mapStateProps.zoom -
                                                Math.log2(zoomSpeed),
                                        });
                                    }

                                    break;

                                case 187:
                                    if (funcKey) {
                                        newMapState = this.getMapState({
                                            zoom:
                                                mapStateProps.zoom +
                                                Math.log2(zoomSpeed) +
                                                1,
                                        });
                                    } else {
                                        newMapState = this.getMapState({
                                            zoom:
                                                mapStateProps.zoom +
                                                Math.log2(zoomSpeed),
                                        });
                                    }

                                    break;

                                case 37:
                                    if (funcKey) {
                                        newMapState = this.getMapState({
                                            bearing:
                                                mapStateProps.bearing -
                                                rotateSpeedX,
                                        });
                                    } else {
                                        newMapState = this.mapState.pan({
                                            pos: [moveSpeed, 0],
                                            startPos: [0, 0],
                                        });
                                    }

                                    break;

                                case 39:
                                    if (funcKey) {
                                        newMapState = this.getMapState({
                                            bearing:
                                                mapStateProps.bearing +
                                                rotateSpeedX,
                                        });
                                    } else {
                                        newMapState = this.mapState.pan({
                                            pos: [-moveSpeed, 0],
                                            startPos: [0, 0],
                                        });
                                    }

                                    break;

                                case 38:
                                    if (funcKey) {
                                        newMapState = this.getMapState({
                                            pitch:
                                                mapStateProps.pitch +
                                                rotateSpeedY,
                                        });
                                    } else {
                                        newMapState = this.mapState.pan({
                                            pos: [0, moveSpeed],
                                            startPos: [0, 0],
                                        });
                                    }

                                    break;

                                case 40:
                                    if (funcKey) {
                                        newMapState = this.getMapState({
                                            pitch:
                                                mapStateProps.pitch -
                                                rotateSpeedY,
                                        });
                                    } else {
                                        newMapState = this.mapState.pan({
                                            pos: [0, -moveSpeed],
                                            startPos: [0, 0],
                                        });
                                    }

                                    break;

                                default:
                                    return false;
                            }

                            return this.updateViewport(
                                newMapState,
                                LINEAR_TRANSITION_PROPS
                            );
                        },
                    },
                ]);

                return MapController;
            })(); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/interactive-map.js

            //# sourceMappingURL=map-controller.js.map
            function interactive_map_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function interactive_map_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        interactive_map_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        interactive_map_ownKeys(Object(source)).forEach(
                            function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            }
                        );
                    }
                }
                return target;
            }

            var interactive_map_propTypes = Object.assign(
                {},
                static_map.propTypes,
                {
                    maxZoom: prop_types.number,
                    minZoom: prop_types.number,
                    maxPitch: prop_types.number,
                    minPitch: prop_types.number,
                    onViewStateChange: prop_types.func,
                    onViewportChange: prop_types.func,
                    onInteractionStateChange: prop_types.func,
                    transitionDuration: prop_types.oneOfType([
                        prop_types.number,
                        prop_types.string,
                    ]),
                    transitionInterpolator: prop_types.object,
                    transitionInterruption: prop_types.number,
                    transitionEasing: prop_types.func,
                    onTransitionStart: prop_types.func,
                    onTransitionInterrupt: prop_types.func,
                    onTransitionEnd: prop_types.func,
                    scrollZoom: prop_types.oneOfType([
                        prop_types.bool,
                        prop_types.object,
                    ]),
                    dragPan: prop_types.oneOfType([
                        prop_types.bool,
                        prop_types.object,
                    ]),
                    dragRotate: prop_types.oneOfType([
                        prop_types.bool,
                        prop_types.object,
                    ]),
                    doubleClickZoom: prop_types.bool,
                    touchZoom: prop_types.oneOfType([
                        prop_types.bool,
                        prop_types.object,
                    ]),
                    touchRotate: prop_types.oneOfType([
                        prop_types.bool,
                        prop_types.object,
                    ]),
                    keyboard: prop_types.oneOfType([
                        prop_types.bool,
                        prop_types.object,
                    ]),
                    onHover: prop_types.func,
                    onClick: prop_types.func,
                    onDblClick: prop_types.func,
                    onContextMenu: prop_types.func,
                    onMouseDown: prop_types.func,
                    onMouseMove: prop_types.func,
                    onMouseUp: prop_types.func,
                    onTouchStart: prop_types.func,
                    onTouchMove: prop_types.func,
                    onTouchEnd: prop_types.func,
                    onMouseEnter: prop_types.func,
                    onMouseLeave: prop_types.func,
                    onMouseOut: prop_types.func,
                    onWheel: prop_types.func,
                    touchAction: prop_types.string,
                    eventRecognizerOptions: prop_types.object,
                    clickRadius: prop_types.number,
                    interactiveLayerIds: prop_types.array,
                    getCursor: prop_types.func,
                    controller: prop_types.instanceOf(MapController),
                }
            );

            var getDefaultCursor = function getDefaultCursor(_ref) {
                var isDragging = _ref.isDragging,
                    isHovering = _ref.isHovering;
                return isDragging
                    ? "grabbing"
                    : isHovering
                    ? "pointer"
                    : "grab";
            };

            var interactive_map_defaultProps = Object.assign(
                {},
                static_map.defaultProps,
                MAPBOX_LIMITS,
                TransitionManager.defaultProps,
                {
                    onViewStateChange: null,
                    onViewportChange: null,
                    onClick: null,
                    onNativeClick: null,
                    onHover: null,
                    onContextMenu: function onContextMenu(event) {
                        return event.preventDefault();
                    },
                    scrollZoom: true,
                    dragPan: true,
                    dragRotate: true,
                    doubleClickZoom: true,
                    touchZoom: true,
                    touchRotate: false,
                    keyboard: true,
                    touchAction: "none",
                    eventRecognizerOptions: {},
                    clickRadius: 0,
                    getCursor: getDefaultCursor,
                }
            );

            function normalizeEvent(event) {
                if (event.lngLat || !event.offsetCenter) {
                    return event;
                }

                var _event$offsetCenter = event.offsetCenter,
                    x = _event$offsetCenter.x,
                    y = _event$offsetCenter.y;

                if (!Number.isFinite(x) || !Number.isFinite(y)) {
                    return event;
                }

                var pos = [x, y];
                event.point = pos;

                if (this.map) {
                    var location = this.map.unproject(pos);
                    event.lngLat = [location.lng, location.lat];
                }

                return event;
            }

            function getFeatures(pos) {
                var map = this.map;

                if (!map || !pos) {
                    return null;
                }

                var queryParams = {};
                var size = this.props.clickRadius;

                if (this.props.interactiveLayerIds) {
                    queryParams.layers = this.props.interactiveLayerIds;
                }

                try {
                    return map.queryRenderedFeatures(
                        size
                            ? [
                                  [pos[0] - size, pos[1] + size],
                                  [pos[0] + size, pos[1] - size],
                              ]
                            : pos,
                        queryParams
                    );
                } catch (_unused) {
                    return null;
                }
            }

            function onEvent(callbackName, event) {
                var func = this.props[callbackName];

                if (func) {
                    func(normalizeEvent.call(this, event));
                }
            }

            function onPointerDown(event) {
                onEvent.call(
                    this,
                    event.pointerType === "touch"
                        ? "onTouchStart"
                        : "onMouseDown",
                    event
                );
            }

            function onPointerUp(event) {
                onEvent.call(
                    this,
                    event.pointerType === "touch" ? "onTouchEnd" : "onMouseUp",
                    event
                );
            }

            function onPointerMove(event) {
                onEvent.call(
                    this,
                    event.pointerType === "touch"
                        ? "onTouchMove"
                        : "onMouseMove",
                    event
                );

                if (!this.state.isDragging) {
                    var _this$props = this.props,
                        onHover = _this$props.onHover,
                        interactiveLayerIds = _this$props.interactiveLayerIds;
                    var features;
                    event = normalizeEvent.call(this, event);

                    if (interactiveLayerIds || onHover) {
                        features = getFeatures.call(this, event.point);
                    }

                    var isHovering = Boolean(
                        interactiveLayerIds && features && features.length > 0
                    );
                    var isEntering = isHovering && !this.state.isHovering;
                    var isExiting = !isHovering && this.state.isHovering;

                    if (onHover || isEntering) {
                        event.features = features;

                        if (onHover) {
                            onHover(event);
                        }
                    }

                    if (isEntering) {
                        onEvent.call(this, "onMouseEnter", event);
                    }

                    if (isExiting) {
                        onEvent.call(this, "onMouseLeave", event);
                    }

                    if (isEntering || isExiting) {
                        this.setState({
                            isHovering: isHovering,
                        });
                    }
                }
            }

            function onPointerClick(event) {
                var _this$props2 = this.props,
                    onClick = _this$props2.onClick,
                    onNativeClick = _this$props2.onNativeClick,
                    onDblClick = _this$props2.onDblClick,
                    doubleClickZoom = _this$props2.doubleClickZoom;
                var callbacks = [];
                var isDoubleClickEnabled = onDblClick || doubleClickZoom;

                switch (event.type) {
                    case "anyclick":
                        callbacks.push(onNativeClick);

                        if (!isDoubleClickEnabled) {
                            callbacks.push(onClick);
                        }

                        break;

                    case "click":
                        if (isDoubleClickEnabled) {
                            callbacks.push(onClick);
                        }

                        break;

                    default:
                }

                callbacks = callbacks.filter(Boolean);

                if (callbacks.length) {
                    event = normalizeEvent.call(this, event);
                    event.features = getFeatures.call(this, event.point);
                    callbacks.forEach(function (cb) {
                        return cb(event);
                    });
                }
            }

            function interactive_map_getRefHandles(staticMapRef) {
                return {
                    getMap: staticMapRef.current && staticMapRef.current.getMap,
                    queryRenderedFeatures:
                        staticMapRef.current &&
                        staticMapRef.current.queryRenderedFeatures,
                };
            }

            var InteractiveMap = (0, react.forwardRef)(function (props, ref) {
                var parentContext = (0, react.useContext)(map_context);
                var controller = (0, react.useMemo)(function () {
                    return props.controller || new MapController();
                }, []);
                var eventManager = (0, react.useMemo)(function () {
                    return new EventManager(null, {
                        touchAction: props.touchAction,
                        recognizerOptions: props.eventRecognizerOptions,
                    });
                }, []);
                var eventCanvasRef = (0, react.useRef)(null);
                var staticMapRef = (0, react.useRef)(null);

                var _thisRef = (0, react.useRef)({
                    width: 0,
                    height: 0,
                    state: {
                        isHovering: false,
                        isDragging: false,
                    },
                });

                var thisRef = _thisRef.current;
                thisRef.props = props;
                thisRef.map =
                    staticMapRef.current && staticMapRef.current.getMap();

                thisRef.setState = function (newState) {
                    thisRef.state = interactive_map_objectSpread(
                        interactive_map_objectSpread({}, thisRef.state),
                        newState
                    );
                    eventCanvasRef.current.style.cursor = props.getCursor(
                        thisRef.state
                    );
                };

                var inRender = true;
                var viewportUpdateRequested;
                var stateUpdateRequested;

                var handleViewportChange = function handleViewportChange(
                    viewState,
                    interactionState,
                    oldViewState
                ) {
                    if (inRender) {
                        viewportUpdateRequested = [
                            viewState,
                            interactionState,
                            oldViewState,
                        ];
                        return;
                    }

                    var _thisRef$props = thisRef.props,
                        onViewStateChange = _thisRef$props.onViewStateChange,
                        onViewportChange = _thisRef$props.onViewportChange;
                    Object.defineProperty(viewState, "position", {
                        get: function get() {
                            return [
                                0,
                                0,
                                getTerrainElevation(thisRef.map, viewState),
                            ];
                        },
                    });

                    if (onViewStateChange) {
                        onViewStateChange({
                            viewState: viewState,
                            interactionState: interactionState,
                            oldViewState: oldViewState,
                        });
                    }

                    if (onViewportChange) {
                        onViewportChange(
                            viewState,
                            interactionState,
                            oldViewState
                        );
                    }
                };

                (0, react.useImperativeHandle)(
                    ref,
                    function () {
                        return interactive_map_getRefHandles(staticMapRef);
                    },
                    []
                );
                var context = (0, react.useMemo)(
                    function () {
                        return interactive_map_objectSpread(
                            interactive_map_objectSpread({}, parentContext),
                            {},
                            {
                                eventManager: eventManager,
                                container:
                                    parentContext.container ||
                                    eventCanvasRef.current,
                            }
                        );
                    },
                    [parentContext, eventCanvasRef.current]
                );
                context.onViewportChange = handleViewportChange;
                context.viewport =
                    parentContext.viewport || getViewport(thisRef);
                thisRef.viewport = context.viewport;

                var handleInteractionStateChange =
                    function handleInteractionStateChange(interactionState) {
                        var _interactionState$isD = interactionState.isDragging,
                            isDragging =
                                _interactionState$isD === void 0
                                    ? false
                                    : _interactionState$isD;

                        if (isDragging !== thisRef.state.isDragging) {
                            thisRef.setState({
                                isDragging: isDragging,
                            });
                        }

                        if (inRender) {
                            stateUpdateRequested = interactionState;
                            return;
                        }

                        var onInteractionStateChange =
                            thisRef.props.onInteractionStateChange;

                        if (onInteractionStateChange) {
                            onInteractionStateChange(interactionState);
                        }
                    };

                var updateControllerOpts = function updateControllerOpts() {
                    if (thisRef.width && thisRef.height) {
                        controller.setOptions(
                            interactive_map_objectSpread(
                                interactive_map_objectSpread(
                                    interactive_map_objectSpread(
                                        {},
                                        thisRef.props
                                    ),
                                    thisRef.props.viewState
                                ),
                                {},
                                {
                                    isInteractive: Boolean(
                                        thisRef.props.onViewStateChange ||
                                            thisRef.props.onViewportChange
                                    ),
                                    onViewportChange: handleViewportChange,
                                    onStateChange: handleInteractionStateChange,
                                    eventManager: eventManager,
                                    width: thisRef.width,
                                    height: thisRef.height,
                                }
                            )
                        );
                    }
                };

                var onResize = function onResize(_ref2) {
                    var width = _ref2.width,
                        height = _ref2.height;
                    thisRef.width = width;
                    thisRef.height = height;
                    updateControllerOpts();
                    thisRef.props.onResize({
                        width: width,
                        height: height,
                    });
                };

                (0, react.useEffect)(function () {
                    eventManager.setElement(eventCanvasRef.current);
                    eventManager.on({
                        pointerdown: onPointerDown.bind(thisRef),
                        pointermove: onPointerMove.bind(thisRef),
                        pointerup: onPointerUp.bind(thisRef),
                        pointerleave: onEvent.bind(thisRef, "onMouseOut"),
                        click: onPointerClick.bind(thisRef),
                        anyclick: onPointerClick.bind(thisRef),
                        dblclick: onEvent.bind(thisRef, "onDblClick"),
                        wheel: onEvent.bind(thisRef, "onWheel"),
                        contextmenu: onEvent.bind(thisRef, "onContextMenu"),
                    });
                    return function () {
                        eventManager.destroy();
                    };
                }, []);
                use_isomorphic_layout_effect(function () {
                    if (viewportUpdateRequested) {
                        handleViewportChange.apply(
                            void 0,
                            _toConsumableArray(viewportUpdateRequested)
                        );
                    }

                    if (stateUpdateRequested) {
                        handleInteractionStateChange(stateUpdateRequested);
                    }
                });
                updateControllerOpts();
                var width = props.width,
                    height = props.height,
                    style = props.style,
                    getCursor = props.getCursor;
                var eventCanvasStyle = (0, react.useMemo)(
                    function () {
                        return interactive_map_objectSpread(
                            interactive_map_objectSpread(
                                {
                                    position: "relative",
                                },
                                style
                            ),
                            {},
                            {
                                width: width,
                                height: height,
                                cursor: getCursor(thisRef.state),
                            }
                        );
                    },
                    [style, width, height, getCursor, thisRef.state]
                );

                if (!viewportUpdateRequested || !thisRef._child) {
                    thisRef._child = react.createElement(
                        MapContextProvider,
                        {
                            value: context,
                        },
                        react.createElement(
                            "div",
                            {
                                key: "event-canvas",
                                ref: eventCanvasRef,
                                style: eventCanvasStyle,
                            },
                            react.createElement(
                                static_map,
                                _extends({}, props, {
                                    width: "100%",
                                    height: "100%",
                                    style: null,
                                    onResize: onResize,
                                    ref: staticMapRef,
                                })
                            )
                        )
                    );
                }

                inRender = false;
                return thisRef._child;
            });
            InteractiveMap.supported = static_map.supported;
            InteractiveMap.propTypes = interactive_map_propTypes;
            InteractiveMap.defaultProps = interactive_map_defaultProps;
            /* harmony default export */ var interactive_map = InteractiveMap; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/deep-equal.js
            //# sourceMappingURL=interactive-map.js.map
            function deepEqual(a, b) {
                if (a === b) {
                    return true;
                }

                if (!a || !b) {
                    return false;
                }

                if (Array.isArray(a)) {
                    if (!Array.isArray(b) || a.length !== b.length) {
                        return false;
                    }

                    for (var i = 0; i < a.length; i++) {
                        if (!deepEqual(a[i], b[i])) {
                            return false;
                        }
                    }

                    return true;
                } else if (Array.isArray(b)) {
                    return false;
                }

                if (_typeof(a) === "object" && _typeof(b) === "object") {
                    var aKeys = Object.keys(a);
                    var bKeys = Object.keys(b);

                    if (aKeys.length !== bKeys.length) {
                        return false;
                    }

                    for (var _i = 0, _aKeys = aKeys; _i < _aKeys.length; _i++) {
                        var key = _aKeys[_i];

                        if (!b.hasOwnProperty(key)) {
                            return false;
                        }

                        if (!deepEqual(a[key], b[key])) {
                            return false;
                        }
                    }

                    return true;
                }

                return false;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/source.js
            //# sourceMappingURL=deep-equal.js.map
            function source_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function source_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        source_ownKeys(Object(source), true).forEach(function (
                            key
                        ) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        source_ownKeys(Object(source)).forEach(function (key) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            var source_propTypes = {
                type: prop_types.string.isRequired,
                id: prop_types.string,
            };
            var sourceCounter = 0;

            function createSource(map, id, props) {
                if (map.style && map.style._loaded) {
                    var options = source_objectSpread({}, props);

                    delete options.id;
                    delete options.children;
                    map.addSource(id, options);
                    return map.getSource(id);
                }

                return null;
            }

            function updateSource(source, props, prevProps) {
                utils_assert_assert(
                    props.id === prevProps.id,
                    "source id changed"
                );
                utils_assert_assert(
                    props.type === prevProps.type,
                    "source type changed"
                );
                var changedKey = "";
                var changedKeyCount = 0;

                for (var key in props) {
                    if (
                        key !== "children" &&
                        key !== "id" &&
                        !deepEqual(prevProps[key], props[key])
                    ) {
                        changedKey = key;
                        changedKeyCount++;
                    }
                }

                if (!changedKeyCount) {
                    return;
                }

                var type = props.type;

                if (type === "geojson") {
                    source.setData(props.data);
                } else if (type === "image") {
                    source.updateImage({
                        url: props.url,
                        coordinates: props.coordinates,
                    });
                } else if (
                    (type === "canvas" || type === "video") &&
                    changedKeyCount === 1 &&
                    changedKey === "coordinates"
                ) {
                    source.setCoordinates(props.coordinates);
                } else if (type === "vector" && source.setUrl) {
                    switch (changedKey) {
                        case "url":
                            source.setUrl(props.url);
                            break;

                        case "tiles":
                            source.setTiles(props.tiles);
                            break;

                        default:
                    }
                } else {
                    console.warn(
                        "Unable to update <Source> prop: ".concat(changedKey)
                    );
                }
            }

            function Source(props) {
                var context = (0, react.useContext)(map_context);
                var propsRef = (0, react.useRef)({
                    id: props.id,
                    type: props.type,
                });

                var _useState = (0, react.useState)(0),
                    _useState2 = _slicedToArray(_useState, 2),
                    setStyleLoaded = _useState2[1];

                var id = (0, react.useMemo)(function () {
                    return props.id || "jsx-source-".concat(sourceCounter++);
                }, []);
                var map = context.map;
                (0, react.useEffect)(
                    function () {
                        if (map) {
                            var forceUpdate = function forceUpdate() {
                                return setStyleLoaded(function (version) {
                                    return version + 1;
                                });
                            };

                            map.on("styledata", forceUpdate);
                            return function () {
                                map.off("styledata", forceUpdate);
                                requestAnimationFrame(function () {
                                    if (
                                        map.style &&
                                        map.style._loaded &&
                                        map.getSource(id)
                                    ) {
                                        map.removeSource(id);
                                    }
                                });
                            };
                        }

                        return undefined;
                    },
                    [map, id]
                );
                var source = map && map.style && map.getSource(id);

                if (source) {
                    updateSource(source, props, propsRef.current);
                } else {
                    source = createSource(map, id, props);
                }

                propsRef.current = props;
                return (
                    (source &&
                        react.Children.map(props.children, function (child) {
                            return (
                                child &&
                                (0, react.cloneElement)(child, {
                                    source: id,
                                })
                            );
                        })) ||
                    null
                );
            }

            Source.propTypes = source_propTypes;
            /* harmony default export */ var source =
                /* unused pure expression or super */ null && Source; // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
            //# sourceMappingURL=source.js.map
            function _objectWithoutPropertiesLoose(source, excluded) {
                if (source == null) return {};
                var target = {};
                var sourceKeys = Object.keys(source);
                var key, i;

                for (i = 0; i < sourceKeys.length; i++) {
                    key = sourceKeys[i];
                    if (excluded.indexOf(key) >= 0) continue;
                    target[key] = source[key];
                }

                return target;
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js
            function _objectWithoutProperties(source, excluded) {
                if (source == null) return {};
                var target = _objectWithoutPropertiesLoose(source, excluded);
                var key, i;

                if (Object.getOwnPropertySymbols) {
                    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

                    for (i = 0; i < sourceSymbolKeys.length; i++) {
                        key = sourceSymbolKeys[i];
                        if (excluded.indexOf(key) >= 0) continue;
                        if (
                            !Object.prototype.propertyIsEnumerable.call(
                                source,
                                key
                            )
                        )
                            continue;
                        target[key] = source[key];
                    }
                }

                return target;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/layer.js
            function layer_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function layer_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        layer_ownKeys(Object(source), true).forEach(function (
                            key
                        ) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        layer_ownKeys(Object(source)).forEach(function (key) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            var LAYER_TYPES = [
                "fill",
                "line",
                "symbol",
                "circle",
                "fill-extrusion",
                "raster",
                "background",
                "heatmap",
                "hillshade",
                "sky",
            ];
            var layer_propTypes = {
                type: prop_types.oneOf(LAYER_TYPES).isRequired,
                id: prop_types.string,
                source: prop_types.string,
                beforeId: prop_types.string,
            };

            function diffLayerStyles(map, id, props, prevProps) {
                var _props$layout = props.layout,
                    layout = _props$layout === void 0 ? {} : _props$layout,
                    _props$paint = props.paint,
                    paint = _props$paint === void 0 ? {} : _props$paint,
                    filter = props.filter,
                    minzoom = props.minzoom,
                    maxzoom = props.maxzoom,
                    beforeId = props.beforeId,
                    otherProps = _objectWithoutProperties(props, [
                        "layout",
                        "paint",
                        "filter",
                        "minzoom",
                        "maxzoom",
                        "beforeId",
                    ]);

                if (beforeId !== prevProps.beforeId) {
                    map.moveLayer(id, beforeId);
                }

                if (layout !== prevProps.layout) {
                    var prevLayout = prevProps.layout || {};

                    for (var key in layout) {
                        if (!deepEqual(layout[key], prevLayout[key])) {
                            map.setLayoutProperty(id, key, layout[key]);
                        }
                    }

                    for (var _key in prevLayout) {
                        if (!layout.hasOwnProperty(_key)) {
                            map.setLayoutProperty(id, _key, undefined);
                        }
                    }
                }

                if (paint !== prevProps.paint) {
                    var prevPaint = prevProps.paint || {};

                    for (var _key2 in paint) {
                        if (!deepEqual(paint[_key2], prevPaint[_key2])) {
                            map.setPaintProperty(id, _key2, paint[_key2]);
                        }
                    }

                    for (var _key3 in prevPaint) {
                        if (!paint.hasOwnProperty(_key3)) {
                            map.setPaintProperty(id, _key3, undefined);
                        }
                    }
                }

                if (!deepEqual(filter, prevProps.filter)) {
                    map.setFilter(id, filter);
                }

                if (
                    minzoom !== prevProps.minzoom ||
                    maxzoom !== prevProps.maxzoom
                ) {
                    map.setLayerZoomRange(id, minzoom, maxzoom);
                }

                for (var _key4 in otherProps) {
                    if (!deepEqual(otherProps[_key4], prevProps[_key4])) {
                        map.setLayerProperty(id, _key4, otherProps[_key4]);
                    }
                }
            }

            function createLayer(map, id, props) {
                if (map.style && map.style._loaded) {
                    var options = layer_objectSpread(
                        layer_objectSpread({}, props),
                        {},
                        {
                            id: id,
                        }
                    );

                    delete options.beforeId;
                    map.addLayer(options, props.beforeId);
                }
            }

            function updateLayer(map, id, props, prevProps) {
                utils_assert_assert(
                    props.id === prevProps.id,
                    "layer id changed"
                );
                utils_assert_assert(
                    props.type === prevProps.type,
                    "layer type changed"
                );

                try {
                    diffLayerStyles(map, id, props, prevProps);
                } catch (error) {
                    console.warn(error);
                }
            }

            var layerCounter = 0;

            function Layer(props) {
                var context = (0, react.useContext)(map_context);
                var propsRef = (0, react.useRef)({
                    id: props.id,
                    type: props.type,
                });

                var _useState = (0, react.useState)(0),
                    _useState2 = _slicedToArray(_useState, 2),
                    setStyleLoaded = _useState2[1];

                var id = (0, react.useMemo)(function () {
                    return props.id || "jsx-layer-".concat(layerCounter++);
                }, []);
                var map = context.map;
                (0, react.useEffect)(
                    function () {
                        if (map) {
                            var forceUpdate = function forceUpdate() {
                                return setStyleLoaded(function (version) {
                                    return version + 1;
                                });
                            };

                            map.on("styledata", forceUpdate);
                            return function () {
                                map.off("styledata", forceUpdate);

                                if (map.style && map.style._loaded) {
                                    map.removeLayer(id);
                                }
                            };
                        }

                        return undefined;
                    },
                    [map]
                );
                var layer = map && map.style && map.getLayer(id);

                if (layer) {
                    updateLayer(map, id, props, propsRef.current);
                } else {
                    createLayer(map, id, props);
                }

                propsRef.current = props;
                return null;
            }

            Layer.propTypes = layer_propTypes;
            /* harmony default export */ var components_layer =
                /* unused pure expression or super */ null && Layer; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/use-map-control.js
            //# sourceMappingURL=layer.js.map
            var mapControlDefaultProps = {
                captureScroll: false,
                captureDrag: true,
                captureClick: true,
                captureDoubleClick: true,
                capturePointerMove: false,
            };
            var mapControlPropTypes = {
                captureScroll: prop_types.bool,
                captureDrag: prop_types.bool,
                captureClick: prop_types.bool,
                captureDoubleClick: prop_types.bool,
                capturePointerMove: prop_types.bool,
            };

            function onMount(thisRef) {
                var ref = thisRef.containerRef.current;
                var eventManager = thisRef.context.eventManager;

                if (!ref || !eventManager) {
                    return undefined;
                }

                var events = {
                    wheel: function wheel(evt) {
                        var props = thisRef.props;

                        if (props.captureScroll) {
                            evt.stopPropagation();
                        }

                        if (props.onScroll) {
                            props.onScroll(evt, thisRef);
                        }
                    },
                    panstart: function panstart(evt) {
                        var props = thisRef.props;

                        if (props.captureDrag) {
                            evt.stopPropagation();
                        }

                        if (props.onDragStart) {
                            props.onDragStart(evt, thisRef);
                        }
                    },
                    anyclick: function anyclick(evt) {
                        var props = thisRef.props;

                        if (props.captureClick) {
                            evt.stopPropagation();
                        }

                        if (props.onNativeClick) {
                            props.onNativeClick(evt, thisRef);
                        }
                    },
                    click: function click(evt) {
                        var props = thisRef.props;

                        if (props.captureClick) {
                            evt.stopPropagation();
                        }

                        if (props.onClick) {
                            props.onClick(evt, thisRef);
                        }
                    },
                    dblclick: function dblclick(evt) {
                        var props = thisRef.props;

                        if (props.captureDoubleClick) {
                            evt.stopPropagation();
                        }

                        if (props.onDoubleClick) {
                            props.onDoubleClick(evt, thisRef);
                        }
                    },
                    pointermove: function pointermove(evt) {
                        var props = thisRef.props;

                        if (props.capturePointerMove) {
                            evt.stopPropagation();
                        }

                        if (props.onPointerMove) {
                            props.onPointerMove(evt, thisRef);
                        }
                    },
                };
                eventManager.watch(events, ref);
                return function () {
                    eventManager.off(events);
                };
            }

            function useMapControl() {
                var props =
                    arguments.length > 0 && arguments[0] !== undefined
                        ? arguments[0]
                        : {};
                var context = (0, react.useContext)(map_context);
                var containerRef = (0, react.useRef)(null);

                var _thisRef = (0, react.useRef)({
                    props: props,
                    state: {},
                    context: context,
                    containerRef: containerRef,
                });

                var thisRef = _thisRef.current;
                thisRef.props = props;
                thisRef.context = context;
                (0, react.useEffect)(
                    function () {
                        return onMount(thisRef);
                    },
                    [context.eventManager]
                );
                return thisRef;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/base-control.js
            //# sourceMappingURL=use-map-control.js.map
            function base_control_createSuper(Derived) {
                var hasNativeReflectConstruct =
                    base_control_isNativeReflectConstruct();
                return function _createSuperInternal() {
                    var Super = _getPrototypeOf(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                };
            }

            function base_control_isNativeReflectConstruct() {
                if (typeof Reflect === "undefined" || !Reflect.construct)
                    return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Date.prototype.toString.call(
                        Reflect.construct(Date, [], function () {})
                    );
                    return true;
                } catch (e) {
                    return false;
                }
            }

            function Control(props) {
                var instance = props.instance;

                var _useMapControl = useMapControl(props),
                    context = _useMapControl.context,
                    containerRef = _useMapControl.containerRef;

                instance._context = context;
                instance._containerRef = containerRef;
                return instance._render();
            }

            var BaseControl = (function (_PureComponent) {
                _inherits(BaseControl, _PureComponent);

                var _super = base_control_createSuper(BaseControl);

                function BaseControl() {
                    var _this;

                    _classCallCheck(this, BaseControl);

                    for (
                        var _len = arguments.length,
                            args = new Array(_len),
                            _key = 0;
                        _key < _len;
                        _key++
                    ) {
                        args[_key] = arguments[_key];
                    }

                    _this = _super.call.apply(_super, [this].concat(args));

                    _defineProperty(
                        _assertThisInitialized(_this),
                        "_context",
                        {}
                    );

                    _defineProperty(
                        _assertThisInitialized(_this),
                        "_containerRef",
                        (0, react.createRef)()
                    );

                    _defineProperty(
                        _assertThisInitialized(_this),
                        "_onScroll",
                        function (evt) {}
                    );

                    _defineProperty(
                        _assertThisInitialized(_this),
                        "_onDragStart",
                        function (evt) {}
                    );

                    _defineProperty(
                        _assertThisInitialized(_this),
                        "_onDblClick",
                        function (evt) {}
                    );

                    _defineProperty(
                        _assertThisInitialized(_this),
                        "_onClick",
                        function (evt) {}
                    );

                    _defineProperty(
                        _assertThisInitialized(_this),
                        "_onPointerMove",
                        function (evt) {}
                    );

                    return _this;
                }

                _createClass(BaseControl, [
                    {
                        key: "_render",
                        value: function _render() {
                            throw new Error("_render() not implemented");
                        },
                    },
                    {
                        key: "render",
                        value: function render() {
                            return react.createElement(
                                Control,
                                _extends(
                                    {
                                        instance: this,
                                    },
                                    this.props,
                                    {
                                        onScroll: this._onScroll,
                                        onDragStart: this._onDragStart,
                                        onDblClick: this._onDblClick,
                                        onClick: this._onClick,
                                        onPointerMove: this._onPointerMove,
                                    }
                                )
                            );
                        },
                    },
                ]);

                return BaseControl;
            })(react.PureComponent);

            _defineProperty(BaseControl, "propTypes", mapControlPropTypes);

            _defineProperty(
                BaseControl,
                "defaultProps",
                mapControlDefaultProps
            ); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/draggable-control.js

            //# sourceMappingURL=base-control.js.map
            function draggable_control_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function draggable_control_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        draggable_control_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        draggable_control_ownKeys(Object(source)).forEach(
                            function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            }
                        );
                    }
                }
                return target;
            }

            var draggableControlPropTypes = Object.assign(
                {},
                mapControlPropTypes,
                {
                    draggable: prop_types.bool,
                    onDrag: prop_types.func,
                    onDragEnd: prop_types.func,
                    onDragStart: prop_types.func,
                    offsetLeft: prop_types.number,
                    offsetTop: prop_types.number,
                }
            );
            var draggableControlDefaultProps = Object.assign(
                {},
                mapControlDefaultProps,
                {
                    draggable: false,
                    offsetLeft: 0,
                    offsetTop: 0,
                }
            );

            function getDragEventPosition(event) {
                var _event$offsetCenter = event.offsetCenter,
                    x = _event$offsetCenter.x,
                    y = _event$offsetCenter.y;
                return [x, y];
            }

            function getDragEventOffset(event, container) {
                var _event$center = event.center,
                    x = _event$center.x,
                    y = _event$center.y;

                if (container) {
                    var rect = container.getBoundingClientRect();
                    return [rect.left - x, rect.top - y];
                }

                return null;
            }

            function getDragLngLat(dragPos, dragOffset, props, context) {
                var x = dragPos[0] + dragOffset[0] - props.offsetLeft;
                var y = dragPos[1] + dragOffset[1] - props.offsetTop;
                return context.viewport.unproject([x, y]);
            }

            function onDragStart(event, _ref) {
                var props = _ref.props,
                    callbacks = _ref.callbacks,
                    state = _ref.state,
                    context = _ref.context,
                    containerRef = _ref.containerRef;
                var draggable = props.draggable;

                if (!draggable) {
                    return;
                }

                event.stopPropagation();
                var dragPos = getDragEventPosition(event);
                var dragOffset = getDragEventOffset(
                    event,
                    containerRef.current
                );
                state.setDragPos(dragPos);
                state.setDragOffset(dragOffset);

                if (callbacks.onDragStart && dragOffset) {
                    var callbackEvent = Object.assign({}, event);
                    callbackEvent.lngLat = getDragLngLat(
                        dragPos,
                        dragOffset,
                        props,
                        context
                    );
                    callbacks.onDragStart(callbackEvent);
                }
            }

            function onDrag(event, _ref2) {
                var props = _ref2.props,
                    callbacks = _ref2.callbacks,
                    state = _ref2.state,
                    context = _ref2.context;
                event.stopPropagation();
                var dragPos = getDragEventPosition(event);
                state.setDragPos(dragPos);
                var dragOffset = state.dragOffset;

                if (callbacks.onDrag && dragOffset) {
                    var callbackEvent = Object.assign({}, event);
                    callbackEvent.lngLat = getDragLngLat(
                        dragPos,
                        dragOffset,
                        props,
                        context
                    );
                    callbacks.onDrag(callbackEvent);
                }
            }

            function onDragEnd(event, _ref3) {
                var props = _ref3.props,
                    callbacks = _ref3.callbacks,
                    state = _ref3.state,
                    context = _ref3.context;
                event.stopPropagation();
                var dragPos = state.dragPos,
                    dragOffset = state.dragOffset;
                state.setDragPos(null);
                state.setDragOffset(null);

                if (callbacks.onDragEnd && dragPos && dragOffset) {
                    var callbackEvent = Object.assign({}, event);
                    callbackEvent.lngLat = getDragLngLat(
                        dragPos,
                        dragOffset,
                        props,
                        context
                    );
                    callbacks.onDragEnd(callbackEvent);
                }
            }

            function onDragCancel(event, _ref4) {
                var state = _ref4.state;
                event.stopPropagation();
                state.setDragPos(null);
                state.setDragOffset(null);
            }

            function registerEvents(thisRef) {
                var eventManager = thisRef.context.eventManager;

                if (!eventManager || !thisRef.state.dragPos) {
                    return undefined;
                }

                var events = {
                    panmove: function panmove(evt) {
                        return onDrag(evt, thisRef);
                    },
                    panend: function panend(evt) {
                        return onDragEnd(evt, thisRef);
                    },
                    pancancel: function pancancel(evt) {
                        return onDragCancel(evt, thisRef);
                    },
                };
                eventManager.watch(events);
                return function () {
                    eventManager.off(events);
                };
            }

            function useDraggableControl(props) {
                var _useState = (0, react.useState)(null),
                    _useState2 = _slicedToArray(_useState, 2),
                    dragPos = _useState2[0],
                    setDragPos = _useState2[1];

                var _useState3 = (0, react.useState)(null),
                    _useState4 = _slicedToArray(_useState3, 2),
                    dragOffset = _useState4[0],
                    setDragOffset = _useState4[1];

                var thisRef = useMapControl(
                    draggable_control_objectSpread(
                        draggable_control_objectSpread({}, props),
                        {},
                        {
                            onDragStart: onDragStart,
                        }
                    )
                );
                thisRef.callbacks = props;
                thisRef.state.dragPos = dragPos;
                thisRef.state.setDragPos = setDragPos;
                thisRef.state.dragOffset = dragOffset;
                thisRef.state.setDragOffset = setDragOffset;
                (0, react.useEffect)(
                    function () {
                        return registerEvents(thisRef);
                    },
                    [thisRef.context.eventManager, Boolean(dragPos)]
                );
                return thisRef;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/crisp-pixel.js
            //# sourceMappingURL=draggable-control.js.map
            var pixelRatio =
                (typeof window !== "undefined" && window.devicePixelRatio) || 1;
            var crispPixel = function crispPixel(size) {
                return Math.round(size * pixelRatio) / pixelRatio;
            };
            var crispPercentage = function crispPercentage(el, percentage) {
                var dimension =
                    arguments.length > 2 && arguments[2] !== undefined
                        ? arguments[2]
                        : "x";

                if (el === null) {
                    return percentage;
                }

                var origSize =
                    dimension === "x" ? el.offsetWidth : el.offsetHeight;
                return (
                    (crispPixel((percentage / 100) * origSize) / origSize) * 100
                );
            }; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/marker.js
            //# sourceMappingURL=crisp-pixel.js.map
            function marker_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function marker_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        marker_ownKeys(Object(source), true).forEach(function (
                            key
                        ) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        marker_ownKeys(Object(source)).forEach(function (key) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            var marker_propTypes = Object.assign(
                {},
                draggableControlPropTypes,
                {
                    className: prop_types.string,
                    longitude: prop_types.number.isRequired,
                    latitude: prop_types.number.isRequired,
                    style: prop_types.object,
                }
            );
            var marker_defaultProps = Object.assign(
                {},
                draggableControlDefaultProps,
                {
                    className: "",
                }
            );

            function getPosition(_ref) {
                var props = _ref.props,
                    state = _ref.state,
                    context = _ref.context;
                var longitude = props.longitude,
                    latitude = props.latitude,
                    offsetLeft = props.offsetLeft,
                    offsetTop = props.offsetTop;
                var dragPos = state.dragPos,
                    dragOffset = state.dragOffset;
                var viewport = context.viewport,
                    map = context.map;

                if (dragPos && dragOffset) {
                    return [
                        dragPos[0] + dragOffset[0],
                        dragPos[1] + dragOffset[1],
                    ];
                }

                var altitude = getTerrainElevation(map, {
                    longitude: longitude,
                    latitude: latitude,
                });

                var _viewport$project = viewport.project([
                        longitude,
                        latitude,
                        altitude,
                    ]),
                    _viewport$project2 = _slicedToArray(_viewport$project, 2),
                    x = _viewport$project2[0],
                    y = _viewport$project2[1];

                x += offsetLeft;
                y += offsetTop;
                return [x, y];
            }

            function Marker(props) {
                var thisRef = useDraggableControl(props);
                var state = thisRef.state,
                    containerRef = thisRef.containerRef;
                var children = props.children,
                    className = props.className,
                    draggable = props.draggable,
                    style = props.style;
                var dragPos = state.dragPos;

                var _getPosition = getPosition(thisRef),
                    _getPosition2 = _slicedToArray(_getPosition, 2),
                    x = _getPosition2[0],
                    y = _getPosition2[1];

                var transform = "translate("
                    .concat(crispPixel(x), "px, ")
                    .concat(crispPixel(y), "px)");
                var cursor = draggable
                    ? dragPos
                        ? "grabbing"
                        : "grab"
                    : "auto";
                var control = (0, react.useMemo)(
                    function () {
                        var containerStyle = marker_objectSpread(
                            {
                                position: "absolute",
                                left: 0,
                                top: 0,
                                transform: transform,
                                cursor: cursor,
                            },
                            style
                        );

                        return react.createElement(
                            "div",
                            {
                                className: "mapboxgl-marker ".concat(className),
                                ref: thisRef.containerRef,
                                style: containerStyle,
                            },
                            children
                        );
                    },
                    [children, className]
                );
                var container = containerRef.current;

                if (container) {
                    container.style.transform = transform;
                    container.style.cursor = cursor;
                }

                return control;
            }

            Marker.defaultProps = marker_defaultProps;
            Marker.propTypes = marker_propTypes;
            /* harmony default export */ var marker = react.memo(Marker); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/dynamic-position.js
            //# sourceMappingURL=marker.js.map
            var ANCHOR_POSITION = {
                top: {
                    x: 0.5,
                    y: 0,
                },
                "top-left": {
                    x: 0,
                    y: 0,
                },
                "top-right": {
                    x: 1,
                    y: 0,
                },
                bottom: {
                    x: 0.5,
                    y: 1,
                },
                "bottom-left": {
                    x: 0,
                    y: 1,
                },
                "bottom-right": {
                    x: 1,
                    y: 1,
                },
                left: {
                    x: 0,
                    y: 0.5,
                },
                right: {
                    x: 1,
                    y: 0.5,
                },
            };
            var ANCHOR_TYPES = Object.keys(ANCHOR_POSITION);
            function getDynamicPosition(_ref) {
                var x = _ref.x,
                    y = _ref.y,
                    width = _ref.width,
                    height = _ref.height,
                    selfWidth = _ref.selfWidth,
                    selfHeight = _ref.selfHeight,
                    anchor = _ref.anchor,
                    _ref$padding = _ref.padding,
                    padding = _ref$padding === void 0 ? 0 : _ref$padding;
                var _ANCHOR_POSITION$anch = ANCHOR_POSITION[anchor],
                    anchorX = _ANCHOR_POSITION$anch.x,
                    anchorY = _ANCHOR_POSITION$anch.y;
                var top = y - anchorY * selfHeight;
                var bottom = top + selfHeight;
                var cutoffY =
                    Math.max(0, padding - top) +
                    Math.max(0, bottom - height + padding);

                if (cutoffY > 0) {
                    var bestAnchorY = anchorY;
                    var minCutoff = cutoffY;

                    for (anchorY = 0; anchorY <= 1; anchorY += 0.5) {
                        top = y - anchorY * selfHeight;
                        bottom = top + selfHeight;
                        cutoffY =
                            Math.max(0, padding - top) +
                            Math.max(0, bottom - height + padding);

                        if (cutoffY < minCutoff) {
                            minCutoff = cutoffY;
                            bestAnchorY = anchorY;
                        }
                    }

                    anchorY = bestAnchorY;
                }

                var xStep = 0.5;

                if (anchorY === 0.5) {
                    anchorX = Math.floor(anchorX);
                    xStep = 1;
                }

                var left = x - anchorX * selfWidth;
                var right = left + selfWidth;
                var cutoffX =
                    Math.max(0, padding - left) +
                    Math.max(0, right - width + padding);

                if (cutoffX > 0) {
                    var bestAnchorX = anchorX;
                    var _minCutoff = cutoffX;

                    for (anchorX = 0; anchorX <= 1; anchorX += xStep) {
                        left = x - anchorX * selfWidth;
                        right = left + selfWidth;
                        cutoffX =
                            Math.max(0, padding - left) +
                            Math.max(0, right - width + padding);

                        if (cutoffX < _minCutoff) {
                            _minCutoff = cutoffX;
                            bestAnchorX = anchorX;
                        }
                    }

                    anchorX = bestAnchorX;
                }

                return (
                    ANCHOR_TYPES.find(function (positionType) {
                        var anchorPosition = ANCHOR_POSITION[positionType];
                        return (
                            anchorPosition.x === anchorX &&
                            anchorPosition.y === anchorY
                        );
                    }) || anchor
                );
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/popup.js
            //# sourceMappingURL=dynamic-position.js.map
            var popup_propTypes = Object.assign({}, mapControlPropTypes, {
                className: prop_types.string,
                longitude: prop_types.number.isRequired,
                latitude: prop_types.number.isRequired,
                altitude: prop_types.number,
                offsetLeft: prop_types.number,
                offsetTop: prop_types.number,
                tipSize: prop_types.number,
                closeButton: prop_types.bool,
                closeOnClick: prop_types.bool,
                anchor: prop_types.oneOf(Object.keys(ANCHOR_POSITION)),
                dynamicPosition: prop_types.bool,
                sortByDepth: prop_types.bool,
                onClose: prop_types.func,
            });
            var popup_defaultProps = Object.assign({}, mapControlDefaultProps, {
                className: "",
                offsetLeft: 0,
                offsetTop: 0,
                tipSize: 10,
                anchor: "bottom",
                dynamicPosition: true,
                sortByDepth: false,
                closeButton: true,
                closeOnClick: true,
                onClose: function onClose() {},
            });

            function popup_getPosition(props, viewport, el, _ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    x = _ref2[0],
                    y = _ref2[1];

                var anchor = props.anchor,
                    dynamicPosition = props.dynamicPosition,
                    tipSize = props.tipSize;

                if (el) {
                    return dynamicPosition
                        ? getDynamicPosition({
                              x: x,
                              y: y,
                              anchor: anchor,
                              padding: tipSize,
                              width: viewport.width,
                              height: viewport.height,
                              selfWidth: el.clientWidth,
                              selfHeight: el.clientHeight,
                          })
                        : anchor;
                }

                return anchor;
            }

            function getContainerStyle(
                props,
                viewport,
                el,
                _ref3,
                positionType
            ) {
                var _ref4 = _slicedToArray(_ref3, 3),
                    x = _ref4[0],
                    y = _ref4[1],
                    z = _ref4[2];

                var offsetLeft = props.offsetLeft,
                    offsetTop = props.offsetTop,
                    sortByDepth = props.sortByDepth;
                var anchorPosition = ANCHOR_POSITION[positionType];
                var left = x + offsetLeft;
                var top = y + offsetTop;
                var xPercentage = crispPercentage(el, -anchorPosition.x * 100);
                var yPercentage = crispPercentage(
                    el,
                    -anchorPosition.y * 100,
                    "y"
                );
                var style = {
                    position: "absolute",
                    transform: "\n      translate("
                        .concat(xPercentage, "%, ")
                        .concat(yPercentage, "%)\n      translate(")
                        .concat(crispPixel(left), "px, ")
                        .concat(crispPixel(top), "px)\n    "),
                    display: undefined,
                    zIndex: undefined,
                };

                if (!sortByDepth) {
                    return style;
                }

                if (
                    z > 1 ||
                    z < -1 ||
                    x < 0 ||
                    x > viewport.width ||
                    y < 0 ||
                    y > viewport.height
                ) {
                    style.display = "none";
                } else {
                    style.zIndex = Math.floor(((1 - z) / 2) * 100000);
                }

                return style;
            }

            function Popup(props) {
                var contentRef = (0, react.useRef)(null);
                var thisRef = useMapControl(props);
                var context = thisRef.context,
                    containerRef = thisRef.containerRef;

                var _useState = (0, react.useState)(false),
                    _useState2 = _slicedToArray(_useState, 2),
                    setLoaded = _useState2[1];

                (0, react.useEffect)(
                    function () {
                        setLoaded(true);
                    },
                    [contentRef.current]
                );
                (0, react.useEffect)(
                    function () {
                        if (context.eventManager && props.closeOnClick) {
                            var clickCallback = function clickCallback() {
                                return thisRef.props.onClose();
                            };

                            context.eventManager.on("anyclick", clickCallback);
                            return function () {
                                context.eventManager.off(
                                    "anyclick",
                                    clickCallback
                                );
                            };
                        }

                        return undefined;
                    },
                    [context.eventManager, props.closeOnClick]
                );
                var viewport = context.viewport,
                    map = context.map;
                var className = props.className,
                    longitude = props.longitude,
                    latitude = props.latitude,
                    tipSize = props.tipSize,
                    closeButton = props.closeButton,
                    children = props.children;
                var altitude = props.altitude;

                if (altitude === undefined) {
                    altitude = getTerrainElevation(map, {
                        longitude: longitude,
                        latitude: latitude,
                    });
                }

                var position = viewport.project([
                    longitude,
                    latitude,
                    altitude,
                ]);
                var positionType = popup_getPosition(
                    props,
                    viewport,
                    contentRef.current,
                    position
                );
                var containerStyle = getContainerStyle(
                    props,
                    viewport,
                    containerRef.current,
                    position,
                    positionType
                );
                var onClickCloseButton = (0, react.useCallback)(function (evt) {
                    thisRef.props.onClose();
                    var eventManager = thisRef.context.eventManager;

                    if (eventManager) {
                        eventManager.once(
                            "click",
                            function (e) {
                                return e.stopPropagation();
                            },
                            evt.target
                        );
                    }
                }, []);
                return react.createElement(
                    "div",
                    {
                        className: "mapboxgl-popup mapboxgl-popup-anchor-"
                            .concat(positionType, " ")
                            .concat(className),
                        style: containerStyle,
                        ref: containerRef,
                    },
                    react.createElement("div", {
                        key: "tip",
                        className: "mapboxgl-popup-tip",
                        style: {
                            borderWidth: tipSize,
                        },
                    }),
                    react.createElement(
                        "div",
                        {
                            key: "content",
                            ref: contentRef,
                            className: "mapboxgl-popup-content",
                        },
                        closeButton &&
                            react.createElement(
                                "button",
                                {
                                    key: "close-button",
                                    className: "mapboxgl-popup-close-button",
                                    type: "button",
                                    onClick: onClickCloseButton,
                                },
                                "\xD7"
                            ),
                        children
                    )
                );
            }

            Popup.propTypes = popup_propTypes;
            Popup.defaultProps = popup_defaultProps;
            /* harmony default export */ var popup = react.memo(Popup); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/attribution-control.js
            //# sourceMappingURL=popup.js.map
            function attribution_control_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function attribution_control_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        attribution_control_ownKeys(
                            Object(source),
                            true
                        ).forEach(function (key) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        attribution_control_ownKeys(Object(source)).forEach(
                            function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            }
                        );
                    }
                }
                return target;
            }

            var attribution_control_propTypes = Object.assign(
                {},
                mapControlPropTypes,
                {
                    toggleLabel: prop_types.string,
                    className: prop_types.string,
                    style: prop_types.object,
                    compact: prop_types.bool,
                    customAttribution: prop_types.oneOfType([
                        prop_types.string,
                        prop_types.arrayOf(prop_types.string),
                    ]),
                }
            );
            var attribution_control_defaultProps = Object.assign(
                {},
                mapControlDefaultProps,
                {
                    className: "",
                    toggleLabel: "Toggle Attribution",
                }
            );

            function setupAttributioncontrol(
                opts,
                map,
                container,
                attributionContainer
            ) {
                var control = new (mapbox_gl_default().AttributionControl)(
                    opts
                );
                control._map = map;
                control._container = container;
                control._innerContainer = attributionContainer;

                control._updateAttributions();

                control._updateEditLink();

                map.on("styledata", control._updateData);
                map.on("sourcedata", control._updateData);
                return control;
            }

            function removeAttributionControl(control) {
                control._map.off("styledata", control._updateData);

                control._map.off("sourcedata", control._updateData);
            }

            function AttributionControl(props) {
                var _useMapControl = useMapControl(props),
                    context = _useMapControl.context,
                    containerRef = _useMapControl.containerRef;

                var innerContainerRef = (0, react.useRef)(null);

                var _useState = (0, react.useState)(false),
                    _useState2 = _slicedToArray(_useState, 2),
                    showCompact = _useState2[0],
                    setShowCompact = _useState2[1];

                (0, react.useEffect)(
                    function () {
                        var control;

                        if (context.map) {
                            control = setupAttributioncontrol(
                                {
                                    customAttribution: props.customAttribution,
                                },
                                context.map,
                                containerRef.current,
                                innerContainerRef.current
                            );
                        }

                        return function () {
                            return control && removeAttributionControl(control);
                        };
                    },
                    [context.map]
                );
                var compact =
                    props.compact === undefined
                        ? context.viewport.width <= 640
                        : props.compact;
                (0, react.useEffect)(
                    function () {
                        if (!compact && showCompact) {
                            setShowCompact(false);
                        }
                    },
                    [compact]
                );
                var toggleAttribution = (0, react.useCallback)(function () {
                    return setShowCompact(function (value) {
                        return !value;
                    });
                }, []);
                var style = (0, react.useMemo)(
                    function () {
                        return attribution_control_objectSpread(
                            {
                                position: "absolute",
                            },
                            props.style
                        );
                    },
                    [props.style]
                );
                return react.createElement(
                    "div",
                    {
                        style: style,
                        className: props.className,
                    },
                    react.createElement(
                        "div",
                        {
                            ref: containerRef,
                            "aria-pressed": showCompact,
                            className: "mapboxgl-ctrl mapboxgl-ctrl-attrib "
                                .concat(compact ? "mapboxgl-compact" : "", " ")
                                .concat(
                                    showCompact ? "mapboxgl-compact-show" : ""
                                ),
                        },
                        react.createElement("button", {
                            type: "button",
                            className: "mapboxgl-ctrl-attrib-button",
                            title: props.toggleLabel,
                            onClick: toggleAttribution,
                        }),
                        react.createElement("div", {
                            ref: innerContainerRef,
                            className: "mapboxgl-ctrl-attrib-inner",
                            role: "list",
                        })
                    )
                );
            }

            AttributionControl.propTypes = attribution_control_propTypes;
            AttributionControl.defaultProps = attribution_control_defaultProps;
            /* harmony default export */ var attribution_control =
                react.memo(AttributionControl); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/fullscreen-control.js
            //# sourceMappingURL=attribution-control.js.map
            function fullscreen_control_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function fullscreen_control_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        fullscreen_control_ownKeys(
                            Object(source),
                            true
                        ).forEach(function (key) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        fullscreen_control_ownKeys(Object(source)).forEach(
                            function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            }
                        );
                    }
                }
                return target;
            }

            var fullscreen_control_propTypes = Object.assign(
                {},
                mapControlPropTypes,
                {
                    className: prop_types.string,
                    style: prop_types.object,
                    container: prop_types.object,
                    label: prop_types.string,
                }
            );
            var fullscreen_control_defaultProps = Object.assign(
                {},
                mapControlDefaultProps,
                {
                    className: "",
                    container: null,
                    label: "Toggle fullscreen",
                }
            );

            function FullscreenControl(props) {
                var _useMapControl = useMapControl(props),
                    context = _useMapControl.context,
                    containerRef = _useMapControl.containerRef;

                var _useState = (0, react.useState)(false),
                    _useState2 = _slicedToArray(_useState, 2),
                    isFullscreen = _useState2[0],
                    setIsFullscreen = _useState2[1];

                var _useState3 = (0, react.useState)(false),
                    _useState4 = _slicedToArray(_useState3, 2),
                    showButton = _useState4[0],
                    setShowButton = _useState4[1];

                var _useState5 = (0, react.useState)(null),
                    _useState6 = _slicedToArray(_useState5, 2),
                    mapboxFullscreenControl = _useState6[0],
                    createMapboxFullscreenControl = _useState6[1];

                (0, react.useEffect)(function () {
                    var control = new (mapbox_gl_default().FullscreenControl)();
                    createMapboxFullscreenControl(control);
                    setShowButton(control._checkFullscreenSupport());

                    var onFullscreenChange = function onFullscreenChange() {
                        var nextState = !control._fullscreen;
                        control._fullscreen = nextState;
                        setIsFullscreen(nextState);
                    };

                    document_.addEventListener(
                        control._fullscreenchange,
                        onFullscreenChange
                    );
                    return function () {
                        document_.removeEventListener(
                            control._fullscreenchange,
                            onFullscreenChange
                        );
                    };
                }, []);

                var onClickFullscreen = function onClickFullscreen() {
                    if (mapboxFullscreenControl) {
                        mapboxFullscreenControl._container =
                            props.container || context.container;

                        mapboxFullscreenControl._onClickFullscreen();
                    }
                };

                var style = (0, react.useMemo)(
                    function () {
                        return fullscreen_control_objectSpread(
                            {
                                position: "absolute",
                            },
                            props.style
                        );
                    },
                    [props.style]
                );

                if (!showButton) {
                    return null;
                }

                var className = props.className,
                    label = props.label;
                var type = isFullscreen ? "shrink" : "fullscreen";
                return react.createElement(
                    "div",
                    {
                        style: style,
                        className: className,
                    },
                    react.createElement(
                        "div",
                        {
                            className: "mapboxgl-ctrl mapboxgl-ctrl-group",
                            ref: containerRef,
                        },
                        react.createElement(
                            "button",
                            {
                                key: type,
                                className:
                                    "mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(
                                        type
                                    ),
                                type: "button",
                                title: label,
                                onClick: onClickFullscreen,
                            },
                            react.createElement("span", {
                                className: "mapboxgl-ctrl-icon",
                                "aria-hidden": "true",
                            })
                        )
                    )
                );
            }

            FullscreenControl.propTypes = fullscreen_control_propTypes;
            FullscreenControl.defaultProps = fullscreen_control_defaultProps;
            /* harmony default export */ var fullscreen_control =
                react.memo(FullscreenControl); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/geolocate-utils.js
            //# sourceMappingURL=fullscreen-control.js.map
            var supported;
            function isGeolocationSupported() {
                if (supported !== undefined) {
                    return Promise.resolve(supported);
                }

                if (window.navigator.permissions !== undefined) {
                    return window.navigator.permissions
                        .query({
                            name: "geolocation",
                        })
                        .then(function (p) {
                            supported = p.state !== "denied";
                            return supported;
                        });
                }

                supported = Boolean(window.navigator.geolocation);
                return Promise.resolve(supported);
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/geolocate-control.js
            //# sourceMappingURL=geolocate-utils.js.map
            function geolocate_control_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function geolocate_control_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        geolocate_control_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        geolocate_control_ownKeys(Object(source)).forEach(
                            function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            }
                        );
                    }
                }
                return target;
            }

            var geolocate_control_noop = function noop() {};

            var geolocate_control_propTypes = Object.assign(
                {},
                mapControlPropTypes,
                {
                    className: prop_types.string,
                    style: prop_types.object,
                    label: prop_types.string,
                    disabledLabel: prop_types.string,
                    auto: prop_types.bool,
                    positionOptions: prop_types.object,
                    fitBoundsOptions: prop_types.object,
                    trackUserLocation: prop_types.bool,
                    showUserLocation: prop_types.bool,
                    showAccuracyCircle: prop_types.bool,
                    showUserHeading: prop_types.bool,
                    onViewStateChange: prop_types.func,
                    onViewportChange: prop_types.func,
                    onGeolocate: prop_types.func,
                }
            );
            var geolocate_control_defaultProps = Object.assign(
                {},
                mapControlDefaultProps,
                {
                    className: "",
                    label: "Find My Location",
                    disabledLabel: "Location Not Available",
                    auto: false,
                    positionOptions: {
                        enableHighAccuracy: false,
                        timeout: 6000,
                    },
                    fitBoundsOptions: {
                        maxZoom: 15,
                    },
                    trackUserLocation: false,
                    showUserLocation: true,
                    showUserHeading: false,
                    showAccuracyCircle: true,
                    onGeolocate: function onGeolocate() {},
                }
            );

            function geolocate_control_getBounds(position) {
                var center = new (mapbox_gl_default().LngLat)(
                    position.coords.longitude,
                    position.coords.latitude
                );
                var radius = position.coords.accuracy;
                var bounds = center.toBounds(radius);
                return [
                    [bounds._ne.lng, bounds._ne.lat],
                    [bounds._sw.lng, bounds._sw.lat],
                ];
            }

            function setupMapboxGeolocateControl(
                context,
                props,
                geolocateButton
            ) {
                var control = new (mapbox_gl_default().GeolocateControl)(props);
                control._container = document_.createElement("div");
                control._map = {
                    on: function on() {},
                    _getUIString: function _getUIString() {
                        return "";
                    },
                };

                control._setupUI(true);

                control._map = context.map;
                control._geolocateButton = geolocateButton;
                var eventManager = context.eventManager;

                if (control.options.trackUserLocation && eventManager) {
                    eventManager.on("panstart", function () {
                        if (control._watchState === "ACTIVE_LOCK") {
                            control._watchState = "BACKGROUND";
                            geolocateButton.classList.add(
                                "mapboxgl-ctrl-geolocate-background"
                            );
                            geolocateButton.classList.remove(
                                "mapboxgl-ctrl-geolocate-active"
                            );
                        }
                    });
                }

                control.on("geolocate", props.onGeolocate);
                return control;
            }

            function updateCamera(position, _ref) {
                var context = _ref.context,
                    props = _ref.props;
                var bounds = geolocate_control_getBounds(position);

                var _context$viewport$fit = context.viewport.fitBounds(
                        bounds,
                        props.fitBoundsOptions
                    ),
                    longitude = _context$viewport$fit.longitude,
                    latitude = _context$viewport$fit.latitude,
                    zoom = _context$viewport$fit.zoom;

                var newViewState = Object.assign({}, context.viewport, {
                    longitude: longitude,
                    latitude: latitude,
                    zoom: zoom,
                });
                var mapState = new MapState(newViewState);
                var viewState = Object.assign(
                    {},
                    mapState.getViewportProps(),
                    LINEAR_TRANSITION_PROPS
                );
                var onViewportChange =
                    props.onViewportChange ||
                    context.onViewportChange ||
                    geolocate_control_noop;
                var onViewStateChange =
                    props.onViewStateChange ||
                    context.onViewStateChange ||
                    geolocate_control_noop;
                onViewStateChange({
                    viewState: viewState,
                });
                onViewportChange(viewState);
            }

            function GeolocateControl(props) {
                var thisRef = useMapControl(props);
                var context = thisRef.context,
                    containerRef = thisRef.containerRef;
                var geolocateButtonRef = (0, react.useRef)(null);

                var _useState = (0, react.useState)(null),
                    _useState2 = _slicedToArray(_useState, 2),
                    mapboxGeolocateControl = _useState2[0],
                    createMapboxGeolocateControl = _useState2[1];

                var _useState3 = (0, react.useState)(false),
                    _useState4 = _slicedToArray(_useState3, 2),
                    supportsGeolocation = _useState4[0],
                    setSupportsGeolocation = _useState4[1];

                (0, react.useEffect)(
                    function () {
                        var control;

                        if (context.map) {
                            isGeolocationSupported().then(function (result) {
                                setSupportsGeolocation(result);

                                if (geolocateButtonRef.current) {
                                    control = setupMapboxGeolocateControl(
                                        context,
                                        props,
                                        geolocateButtonRef.current
                                    );

                                    control._updateCamera = function (
                                        position
                                    ) {
                                        return updateCamera(position, thisRef);
                                    };

                                    createMapboxGeolocateControl(control);
                                }
                            });
                        }

                        return function () {
                            if (control) {
                                control._clearWatch();
                            }
                        };
                    },
                    [context.map]
                );
                var triggerGeolocate = (0, react.useCallback)(
                    function () {
                        if (mapboxGeolocateControl) {
                            mapboxGeolocateControl.options = thisRef.props;
                            mapboxGeolocateControl.trigger();
                        }
                    },
                    [mapboxGeolocateControl]
                );
                (0, react.useEffect)(
                    function () {
                        if (props.auto) {
                            triggerGeolocate();
                        }
                    },
                    [mapboxGeolocateControl, props.auto]
                );
                (0, react.useEffect)(
                    function () {
                        if (mapboxGeolocateControl) {
                            mapboxGeolocateControl._onZoom();
                        }
                    },
                    [context.viewport.zoom]
                );
                var className = props.className,
                    label = props.label,
                    disabledLabel = props.disabledLabel,
                    trackUserLocation = props.trackUserLocation;
                var style = (0, react.useMemo)(
                    function () {
                        return geolocate_control_objectSpread(
                            {
                                position: "absolute",
                            },
                            props.style
                        );
                    },
                    [props.style]
                );
                return react.createElement(
                    "div",
                    {
                        style: style,
                        className: className,
                    },
                    react.createElement(
                        "div",
                        {
                            key: "geolocate-control",
                            className: "mapboxgl-ctrl mapboxgl-ctrl-group",
                            ref: containerRef,
                        },
                        react.createElement(
                            "button",
                            {
                                key: "geolocate",
                                className:
                                    "mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate",
                                ref: geolocateButtonRef,
                                disabled: !supportsGeolocation,
                                "aria-pressed": !trackUserLocation,
                                type: "button",
                                title: supportsGeolocation
                                    ? label
                                    : disabledLabel,
                                "aria-label": supportsGeolocation
                                    ? label
                                    : disabledLabel,
                                onClick: triggerGeolocate,
                            },
                            react.createElement("span", {
                                className: "mapboxgl-ctrl-icon",
                                "aria-hidden": "true",
                            })
                        )
                    )
                );
            }

            GeolocateControl.propTypes = geolocate_control_propTypes;
            GeolocateControl.defaultProps = geolocate_control_defaultProps;
            /* harmony default export */ var geolocate_control =
                react.memo(GeolocateControl); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/version.js
            //# sourceMappingURL=geolocate-control.js.map
            function compareVersions(version1, version2) {
                var v1 = (version1 || "").split(".").map(Number);
                var v2 = (version2 || "").split(".").map(Number);

                for (var i = 0; i < 3; i++) {
                    var part1 = v1[i] || 0;
                    var part2 = v2[i] || 0;

                    if (part1 < part2) {
                        return -1;
                    }

                    if (part1 > part2) {
                        return 1;
                    }
                }

                return 0;
            } // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/navigation-control.js
            //# sourceMappingURL=version.js.map
            function navigation_control_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function navigation_control_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        navigation_control_ownKeys(
                            Object(source),
                            true
                        ).forEach(function (key) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        navigation_control_ownKeys(Object(source)).forEach(
                            function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            }
                        );
                    }
                }
                return target;
            }

            var navigation_control_noop = function noop() {};

            var navigation_control_propTypes = Object.assign(
                {},
                mapControlPropTypes,
                {
                    className: prop_types.string,
                    style: prop_types.object,
                    onViewStateChange: prop_types.func,
                    onViewportChange: prop_types.func,
                    showCompass: prop_types.bool,
                    showZoom: prop_types.bool,
                    zoomInLabel: prop_types.string,
                    zoomOutLabel: prop_types.string,
                    compassLabel: prop_types.string,
                }
            );
            var navigation_control_defaultProps = Object.assign(
                {},
                mapControlDefaultProps,
                {
                    className: "",
                    showCompass: true,
                    showZoom: true,
                    zoomInLabel: "Zoom In",
                    zoomOutLabel: "Zoom Out",
                    compassLabel: "Reset North",
                }
            );
            var VERSION_LEGACY = 1;
            var VERSION_1_6 = 2;

            function getUIVersion(mapboxVersion) {
                return compareVersions(mapboxVersion, "1.6.0") >= 0
                    ? VERSION_1_6
                    : VERSION_LEGACY;
            }

            function updateViewport(context, props, opts) {
                var viewport = context.viewport;
                var mapState = new MapState(Object.assign({}, viewport, opts));
                var viewState = Object.assign(
                    {},
                    mapState.getViewportProps(),
                    LINEAR_TRANSITION_PROPS
                );
                var onViewportChange =
                    props.onViewportChange ||
                    context.onViewportChange ||
                    navigation_control_noop;
                var onViewStateChange =
                    props.onViewStateChange ||
                    context.onViewStateChange ||
                    navigation_control_noop;
                onViewStateChange({
                    viewState: viewState,
                });
                onViewportChange(viewState);
            }

            function renderButton(type, label, callback, children) {
                return react.createElement(
                    "button",
                    {
                        key: type,
                        className: "mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(
                            type
                        ),
                        type: "button",
                        title: label,
                        onClick: callback,
                    },
                    children ||
                        react.createElement("span", {
                            className: "mapboxgl-ctrl-icon",
                            "aria-hidden": "true",
                        })
                );
            }

            function renderCompass(context) {
                var uiVersion = (0, react.useMemo)(
                    function () {
                        return context.map
                            ? getUIVersion(context.map.version)
                            : VERSION_1_6;
                    },
                    [context.map]
                );
                var bearing = context.viewport.bearing;
                var style = {
                    transform: "rotate(".concat(-bearing, "deg)"),
                };
                return uiVersion === VERSION_1_6
                    ? react.createElement("span", {
                          className: "mapboxgl-ctrl-icon",
                          "aria-hidden": "true",
                          style: style,
                      })
                    : react.createElement("span", {
                          className: "mapboxgl-ctrl-compass-arrow",
                          style: style,
                      });
            }

            function NavigationControl(props) {
                var _useMapControl = useMapControl(props),
                    context = _useMapControl.context,
                    containerRef = _useMapControl.containerRef;

                var onZoomIn = function onZoomIn() {
                    updateViewport(context, props, {
                        zoom: context.viewport.zoom + 1,
                    });
                };

                var onZoomOut = function onZoomOut() {
                    updateViewport(context, props, {
                        zoom: context.viewport.zoom - 1,
                    });
                };

                var onResetNorth = function onResetNorth() {
                    updateViewport(context, props, {
                        bearing: 0,
                        pitch: 0,
                    });
                };

                var className = props.className,
                    showCompass = props.showCompass,
                    showZoom = props.showZoom,
                    zoomInLabel = props.zoomInLabel,
                    zoomOutLabel = props.zoomOutLabel,
                    compassLabel = props.compassLabel;
                var style = (0, react.useMemo)(
                    function () {
                        return navigation_control_objectSpread(
                            {
                                position: "absolute",
                            },
                            props.style
                        );
                    },
                    [props.style]
                );
                return react.createElement(
                    "div",
                    {
                        style: style,
                        className: className,
                    },
                    react.createElement(
                        "div",
                        {
                            className: "mapboxgl-ctrl mapboxgl-ctrl-group",
                            ref: containerRef,
                        },
                        showZoom &&
                            renderButton("zoom-in", zoomInLabel, onZoomIn),
                        showZoom &&
                            renderButton("zoom-out", zoomOutLabel, onZoomOut),
                        showCompass &&
                            renderButton(
                                "compass",
                                compassLabel,
                                onResetNorth,
                                renderCompass(context)
                            )
                    )
                );
            }

            NavigationControl.propTypes = navigation_control_propTypes;
            NavigationControl.defaultProps = navigation_control_defaultProps;
            /* harmony default export */ var navigation_control =
                react.memo(NavigationControl); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/scale-control.js
            //# sourceMappingURL=navigation-control.js.map
            function scale_control_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function scale_control_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        scale_control_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        scale_control_ownKeys(Object(source)).forEach(function (
                            key
                        ) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            var scale_control_propTypes = Object.assign(
                {},
                mapControlPropTypes,
                {
                    className: prop_types.string,
                    style: prop_types.object,
                    maxWidth: prop_types.number,
                    unit: prop_types.oneOf(["imperial", "metric", "nautical"]),
                }
            );
            var scale_control_defaultProps = Object.assign(
                {},
                mapControlDefaultProps,
                {
                    className: "",
                    maxWidth: 100,
                    unit: "metric",
                }
            );

            function ScaleControl(props) {
                var _useMapControl = useMapControl(props),
                    context = _useMapControl.context,
                    containerRef = _useMapControl.containerRef;

                var _useState = (0, react.useState)(null),
                    _useState2 = _slicedToArray(_useState, 2),
                    mapboxScaleControl = _useState2[0],
                    createMapboxScaleControl = _useState2[1];

                (0, react.useEffect)(
                    function () {
                        if (context.map) {
                            var control =
                                new (mapbox_gl_default().ScaleControl)();
                            control._map = context.map;
                            control._container = containerRef.current;
                            createMapboxScaleControl(control);
                        }
                    },
                    [context.map]
                );

                if (mapboxScaleControl) {
                    mapboxScaleControl.options = props;

                    mapboxScaleControl._onMove();
                }

                var style = (0, react.useMemo)(
                    function () {
                        return scale_control_objectSpread(
                            {
                                position: "absolute",
                            },
                            props.style
                        );
                    },
                    [props.style]
                );
                return react.createElement(
                    "div",
                    {
                        style: style,
                        className: props.className,
                    },
                    react.createElement("div", {
                        ref: containerRef,
                        className: "mapboxgl-ctrl mapboxgl-ctrl-scale",
                    })
                );
            }

            ScaleControl.propTypes = scale_control_propTypes;
            ScaleControl.defaultProps = scale_control_defaultProps;
            /* harmony default export */ var scale_control =
                react.memo(ScaleControl); // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/overlays/canvas-overlay.js
            //# sourceMappingURL=scale-control.js.map
            var canvas_overlay_pixelRatio =
                (typeof window !== "undefined" && window.devicePixelRatio) || 1;
            var canvas_overlay_propTypes = Object.assign(
                {},
                mapControlPropTypes,
                {
                    redraw: prop_types.func.isRequired,
                }
            );
            var canvas_overlay_defaultProps = {
                captureScroll: false,
                captureDrag: false,
                captureClick: false,
                captureDoubleClick: false,
                capturePointerMove: false,
            };

            function CanvasOverlay(props) {
                var _useMapControl = useMapControl(props),
                    context = _useMapControl.context,
                    containerRef = _useMapControl.containerRef;

                var _useState = (0, react.useState)(null),
                    _useState2 = _slicedToArray(_useState, 2),
                    ctx = _useState2[0],
                    setDrawingContext = _useState2[1];

                (0, react.useEffect)(function () {
                    setDrawingContext(containerRef.current.getContext("2d"));
                }, []);
                var viewport = context.viewport,
                    isDragging = context.isDragging;

                if (ctx) {
                    ctx.save();
                    ctx.scale(
                        canvas_overlay_pixelRatio,
                        canvas_overlay_pixelRatio
                    );
                    props.redraw({
                        width: viewport.width,
                        height: viewport.height,
                        ctx: ctx,
                        isDragging: isDragging,
                        project: viewport.project,
                        unproject: viewport.unproject,
                    });
                    ctx.restore();
                }

                return react.createElement("canvas", {
                    ref: containerRef,
                    width: viewport.width * canvas_overlay_pixelRatio,
                    height: viewport.height * canvas_overlay_pixelRatio,
                    style: {
                        width: "".concat(viewport.width, "px"),
                        height: "".concat(viewport.height, "px"),
                        position: "absolute",
                        left: 0,
                        top: 0,
                    },
                });
            }

            CanvasOverlay.propTypes = canvas_overlay_propTypes;
            CanvasOverlay.defaultProps = canvas_overlay_defaultProps;
            /* harmony default export */ var canvas_overlay =
                /* unused pure expression or super */ null && CanvasOverlay; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/overlays/html-overlay.js
            //# sourceMappingURL=canvas-overlay.js.map
            function html_overlay_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function html_overlay_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        html_overlay_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        html_overlay_ownKeys(Object(source)).forEach(function (
                            key
                        ) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            var html_overlay_propTypes = Object.assign(
                {},
                mapControlPropTypes,
                {
                    redraw: prop_types.func.isRequired,
                    style: prop_types.object,
                }
            );
            var html_overlay_defaultProps = {
                captureScroll: false,
                captureDrag: false,
                captureClick: false,
                captureDoubleClick: false,
                capturePointerMove: false,
            };

            function HTMLOverlay(props) {
                var _useMapControl = useMapControl(props),
                    context = _useMapControl.context,
                    containerRef = _useMapControl.containerRef;

                var viewport = context.viewport,
                    isDragging = context.isDragging;

                var style = html_overlay_objectSpread(
                    {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: viewport.width,
                        height: viewport.height,
                    },
                    props.style
                );

                return react.createElement(
                    "div",
                    {
                        ref: containerRef,
                        style: style,
                    },
                    props.redraw({
                        width: viewport.width,
                        height: viewport.height,
                        isDragging: isDragging,
                        project: viewport.project,
                        unproject: viewport.unproject,
                    })
                );
            }

            HTMLOverlay.propTypes = html_overlay_propTypes;
            HTMLOverlay.defaultProps = html_overlay_defaultProps;
            /* harmony default export */ var html_overlay =
                /* unused pure expression or super */ null && HTMLOverlay; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/overlays/svg-overlay.js
            //# sourceMappingURL=html-overlay.js.map
            function svg_overlay_ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function svg_overlay_objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        svg_overlay_ownKeys(Object(source), true).forEach(
                            function (key) {
                                _defineProperty(target, key, source[key]);
                            }
                        );
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        svg_overlay_ownKeys(Object(source)).forEach(function (
                            key
                        ) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            var svg_overlay_propTypes = Object.assign({}, mapControlPropTypes, {
                redraw: prop_types.func.isRequired,
                style: prop_types.object,
            });
            var svg_overlay_defaultProps = {
                captureScroll: false,
                captureDrag: false,
                captureClick: false,
                captureDoubleClick: false,
                capturePointerMove: false,
            };

            function SVGOverlay(props) {
                var _useMapControl = useMapControl(props),
                    context = _useMapControl.context,
                    containerRef = _useMapControl.containerRef;

                var viewport = context.viewport,
                    isDragging = context.isDragging;

                var style = svg_overlay_objectSpread(
                    {
                        position: "absolute",
                        left: 0,
                        top: 0,
                    },
                    props.style
                );

                return react.createElement(
                    "svg",
                    {
                        width: viewport.width,
                        height: viewport.height,
                        ref: containerRef,
                        style: style,
                    },
                    props.redraw({
                        width: viewport.width,
                        height: viewport.height,
                        isDragging: isDragging,
                        project: viewport.project,
                        unproject: viewport.unproject,
                    })
                );
            }

            SVGOverlay.propTypes = svg_overlay_propTypes;
            SVGOverlay.defaultProps = svg_overlay_defaultProps;
            /* harmony default export */ var svg_overlay =
                /* unused pure expression or super */ null && SVGOverlay; // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/set-rtl-text-plugin.js
            //# sourceMappingURL=svg-overlay.js.map
            var setRTLTextPlugin = mapbox_gl_default()
                ? mapbox_gl_default().setRTLTextPlugin
                : function () {};
            /* harmony default export */ var set_rtl_text_plugin =
                /* unused pure expression or super */ null && setRTLTextPlugin;
            //# sourceMappingURL=set-rtl-text-plugin.js.map // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/index.js

            //# sourceMappingURL=index.js.map

            /***/
        },
    },
]);
