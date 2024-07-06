!/**
 * @license AngularJS v1.2.5
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */ function(window1, document1, undefined) {
    "use strict";
    /**
   * @description
   *
   * This object provides a utility for producing rich Error messages within
   * Angular. It can be called as follows:
   *
   * var exampleMinErr = minErr('example');
   * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
   *
   * The above creates an instance of minErr in the example namespace. The
   * resulting error will have a namespaced error code of example.one.  The
   * resulting error will replace {0} with the value of foo, and {1} with the
   * value of bar. The object is not restricted in the number of arguments it can
   * take.
   *
   * If fewer arguments are specified than necessary for interpolation, the extra
   * interpolation markers will be preserved in the final string.
   *
   * Since data will be parsed statically during a build step, some restrictions
   * are applied with respect to how minErr instances are created and called.
   * Instances should have names of the form namespaceMinErr for a minErr created
   * using minErr('namespace') . Error codes, namespaces and template strings
   * should all be static strings, not variables or general expressions.
   *
   * @param {string} module The namespace to use for the new minErr instance.
   * @returns {function(string, string, ...): Error} instance
   */ function minErr(module) {
        return function() {
            var obj, message, i, code = arguments[0], template = arguments[1], templateArgs = arguments;
            for(i = 2, message = (message = "[" + (module ? module + ":" : "") + code + "] " + template.replace(/\{\d+\}/g, function(match) {
                var arg, index = +match.slice(1, -1);
                if (index + 2 < templateArgs.length) return "function" == typeof (arg = templateArgs[index + 2]) ? arg.toString().replace(/ ?\{[\s\S]*$/, "") : void 0 === arg ? "undefined" : "string" != typeof arg ? toJson(arg) : arg;
                return match;
            })) + "\nhttp://errors.angularjs.org/1.2.5/" + (module ? module + "/" : "") + code; i < arguments.length; i++){
                message = message + (2 == i ? "?" : "&") + "p" + (i - 2) + "=" + encodeURIComponent((obj = arguments[i], "function" == typeof obj ? obj.toString().replace(/ \{[\s\S]*$/, "") : void 0 === obj ? "undefined" : "string" != typeof obj ? JSON.stringify(obj) : obj));
            }
            return Error(message);
        };
    }
    /* We need to tell jshint what variables are being exported */ /* global
    -angular,
    -msie,
    -jqLite,
    -jQuery,
    -slice,
    -push,
    -toString,
    -ngMinErr,
    -_angular,
    -angularModule,
    -nodeName_,
    -uid,

    -lowercase,
    -uppercase,
    -manualLowercase,
    -manualUppercase,
    -nodeName_,
    -isArrayLike,
    -forEach,
    -sortedKeys,
    -forEachSorted,
    -reverseParams,
    -nextUid,
    -setHashKey,
    -extend,
    -int,
    -inherit,
    -noop,
    -identity,
    -valueFn,
    -isUndefined,
    -isDefined,
    -isObject,
    -isString,
    -isNumber,
    -isDate,
    -isArray,
    -isFunction,
    -isRegExp,
    -isWindow,
    -isScope,
    -isFile,
    -isBoolean,
    -trim,
    -isElement,
    -makeMap,
    -map,
    -size,
    -includes,
    -indexOf,
    -arrayRemove,
    -isLeafNode,
    -copy,
    -shallowCopy,
    -equals,
    -csp,
    -concat,
    -sliceArgs,
    -bind,
    -toJsonReplacer,
    -toJson,
    -fromJson,
    -toBoolean,
    -startingTag,
    -tryDecodeURIComponent,
    -parseKeyValue,
    -toKeyValue,
    -encodeUriSegment,
    -encodeUriQuery,
    -angularInit,
    -bootstrap,
    -snake_case,
    -bindJQuery,
    -assertArg,
    -assertArgFn,
    -assertNotHasOwnProperty,
    -getter,
    -getBlockElements,

*/ ////////////////////////////////////
    /**
   * @ngdoc function
   * @name angular.lowercase
   * @function
   *
   * @description Converts the specified string to lowercase.
   * @param {string} string String to be converted to lowercase.
   * @returns {string} Lowercased string.
   */ var promiseWarning, /** holds major version number for IE or NaN for real browsers */ msie, jqLite, jQuery, angularModule, nodeName_, lowercase = function(string) {
        return isString(string) ? string.toLowerCase() : string;
    }, uppercase = function(string) {
        return isString(string) ? string.toUpperCase() : string;
    }, slice = [].slice, push = [].push, toString = Object.prototype.toString, ngMinErr = minErr("ng"), /** @name angular */ angular1 = (window1.angular, window1.angular || (window1.angular = {})), uid = [
        "0",
        "0",
        "0"
    ];
    /**
   * @private
   * @param {*} obj
   * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
   *                   String ...)
   */ function isArrayLike(obj) {
        if (null == obj || isWindow(obj)) return !1;
        var length = obj.length;
        return 1 === obj.nodeType && !!length || isString(obj) || isArray(obj) || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj;
    }
    /**
 * @ngdoc function
 * @name angular.forEach
 * @function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
 * object or an array. The `iterator` function is invoked with `iterator(value, key)`, where `value`
 * is the value of an object property or an array element and `key` is the object property key or
 * array element index. Specifying a `context` for the function is optional.
 *
 * Note: this function was previously known as `angular.foreach`.
 *
   <pre>
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.forEach(values, function(value, key){
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender:male']);
   </pre>
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {Function} iterator Iterator function.
 * @param {Object=} context Object to become context (`this`) for the iterator function.
 * @returns {Object|Array} Reference to `obj`.
 */ function forEach(obj, iterator, context) {
        var key;
        if (obj) {
            if (isFunction(obj)) for(key in obj)"prototype" != key && "length" != key && "name" != key && obj.hasOwnProperty(key) && iterator.call(context, obj[key], key);
            else if (obj.forEach && obj.forEach !== forEach) obj.forEach(iterator, context);
            else if (isArrayLike(obj)) for(key = 0; key < obj.length; key++)iterator.call(context, obj[key], key);
            else for(key in obj)obj.hasOwnProperty(key) && iterator.call(context, obj[key], key);
        }
        return obj;
    }
    function sortedKeys(obj) {
        var keys = [];
        for(var key in obj)obj.hasOwnProperty(key) && keys.push(key);
        return keys.sort();
    }
    /**
   * when using forEach the params are value, key, but it is often useful to have key, value.
   * @param {function(string, *)} iteratorFn
   * @returns {function(*, string)}
   */ function reverseParams(iteratorFn) {
        return function(value, key) {
            iteratorFn(key, value);
        };
    }
    /**
   * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
   * characters such as '012ABC'. The reason why we are not using simply a number counter is that
   * the number string gets longer over time, and it can also overflow, where as the nextId
   * will grow much slower, it is a string, and it will never overflow.
   *
   * @returns an unique alpha-numeric string
   */ function nextUid() {
        for(var digit, index = uid.length; index;){
            if (57 /*'9'*/  == (digit = uid[--index].charCodeAt(0))) return uid[index] = "A", uid.join("");
            if (90 /*'Z'*/  != digit) return uid[index] = String.fromCharCode(digit + 1), uid.join("");
            uid[index] = "0";
        }
        return uid.unshift("0"), uid.join("");
    }
    /**
   * Set or clear the hashkey for an object.
   * @param obj object
   * @param h the hashkey (!truthy to delete the hashkey)
   */ function setHashKey(obj, h) {
        h ? obj.$$hashKey = h : delete obj.$$hashKey;
    }
    /**
   * @ngdoc function
   * @name angular.extend
   * @function
   *
   * @description
   * Extends the destination object `dst` by copying all of the properties from the `src` object(s)
   * to `dst`. You can specify multiple `src` objects.
   *
   * @param {Object} dst Destination object.
   * @param {...Object} src Source object(s).
   * @returns {Object} Reference to `dst`.
   */ function extend(dst) {
        var h = dst.$$hashKey;
        return forEach(arguments, function(obj) {
            obj !== dst && forEach(obj, function(value, key) {
                dst[key] = value;
            });
        }), setHashKey(dst, h), dst;
    }
    function int(str) {
        return parseInt(str, 10);
    }
    function inherit(parent, extra) {
        return extend(new (extend(function() {}, {
            prototype: parent
        }))(), extra);
    }
    /**
 * @ngdoc function
 * @name angular.noop
 * @function
 *
 * @description
 * A function that performs no operations. This function can be useful when writing code in the
 * functional style.
   <pre>
     function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   </pre>
 */ function noop() {}
    /**
 * @ngdoc function
 * @name angular.identity
 * @function
 *
 * @description
 * A function that returns its first argument. This function is useful when writing code in the
 * functional style.
 *
   <pre>
     function transformer(transformationFn, value) {
       return (transformationFn || angular.identity)(value);
     };
   </pre>
 */ function identity($) {
        return $;
    }
    function valueFn(value) {
        return function() {
            return value;
        };
    }
    /**
   * @ngdoc function
   * @name angular.isUndefined
   * @function
   *
   * @description
   * Determines if a reference is undefined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is undefined.
   */ function isUndefined(value) {
        return void 0 === value;
    }
    /**
   * @ngdoc function
   * @name angular.isDefined
   * @function
   *
   * @description
   * Determines if a reference is defined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is defined.
   */ function isDefined(value) {
        return void 0 !== value;
    }
    /**
   * @ngdoc function
   * @name angular.isObject
   * @function
   *
   * @description
   * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
   * considered to be objects.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Object` but not `null`.
   */ function isObject(value) {
        return null != value && "object" == typeof value;
    }
    /**
   * @ngdoc function
   * @name angular.isString
   * @function
   *
   * @description
   * Determines if a reference is a `String`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `String`.
   */ function isString(value) {
        return "string" == typeof value;
    }
    /**
   * @ngdoc function
   * @name angular.isNumber
   * @function
   *
   * @description
   * Determines if a reference is a `Number`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Number`.
   */ function isNumber(value) {
        return "number" == typeof value;
    }
    /**
   * @ngdoc function
   * @name angular.isDate
   * @function
   *
   * @description
   * Determines if a value is a date.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Date`.
   */ function isDate(value) {
        return "[object Date]" === toString.call(value);
    }
    /**
   * @ngdoc function
   * @name angular.isArray
   * @function
   *
   * @description
   * Determines if a reference is an `Array`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Array`.
   */ function isArray(value) {
        return "[object Array]" === toString.call(value);
    }
    /**
   * @ngdoc function
   * @name angular.isFunction
   * @function
   *
   * @description
   * Determines if a reference is a `Function`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Function`.
   */ function isFunction(value) {
        return "function" == typeof value;
    }
    /**
   * Determines if a value is a regular expression object.
   *
   * @private
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `RegExp`.
   */ function isRegExp(value) {
        return "[object RegExp]" === toString.call(value);
    }
    /**
   * Checks if `obj` is a window object.
   *
   * @private
   * @param {*} obj Object to check
   * @returns {boolean} True if `obj` is a window obj.
   */ function isWindow(obj) {
        return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    }
    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }
    isNaN(/**
   * IE 11 changed the format of the UserAgent string.
   * See http://msdn.microsoft.com/en-us/library/ms537503.aspx
   */ msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1])) && (msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1])), noop.$inject = [], identity.$inject = [];
    var trim = // native trim is way faster: http://jsperf.com/angular-trim-test
    // but IE doesn't have it... :-(
    // TODO: we should move this into IE/ES5 polyfill
    String.prototype.trim ? function(value) {
        return isString(value) ? value.trim() : value;
    } : function(value) {
        return isString(value) ? value.replace(/^\s\s*/, "").replace(/\s\s*$/, "") : value;
    };
    /**
   * @ngdoc function
   * @name angular.isElement
   * @function
   *
   * @description
   * Determines if a reference is a DOM element (or wrapped jQuery element).
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
   */ function isElement(node) {
        return !!(node && (node.nodeName || // we are a direct element
        node.on && node.find)); // we have an on and find method part of jQuery API
    }
    function indexOf(array, obj) {
        if (array.indexOf) return array.indexOf(obj);
        for(var i = 0; i < array.length; i++)if (obj === array[i]) return i;
        return -1;
    }
    function arrayRemove(array, value) {
        var index = indexOf(array, value);
        return index >= 0 && array.splice(index, 1), value;
    }
    /**
 * @ngdoc function
 * @name angular.copy
 * @function
 *
 * @description
 * Creates a deep copy of `source`, which should be an object or an array.
 *
 * * If no destination is supplied, a copy of the object or array is created.
 * * If a destination is provided, all of its elements (for array) or properties (for objects)
 *   are deleted and then all elements/properties from the source are copied to it.
 * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
 * * If `source` is identical to 'destination' an exception will be thrown.
 *
 * @param {*} source The source that will be used to make a copy.
 *                   Can be any type, including primitives, `null`, and `undefined`.
 * @param {(Object|Array)=} destination Destination into which the source is copied. If
 *     provided, must be of the same type as `source`.
 * @returns {*} The copy or updated `destination`, if `destination` was specified.
 *
 * @example
 <doc:example>
 <doc:source>
 <div ng-controller="Controller">
 <form novalidate class="simple-form">
 Name: <input type="text" ng-model="user.name" /><br />
 E-mail: <input type="email" ng-model="user.email" /><br />
 Gender: <input type="radio" ng-model="user.gender" value="male" />male
 <input type="radio" ng-model="user.gender" value="female" />female<br />
 <button ng-click="reset()">RESET</button>
 <button ng-click="update(user)">SAVE</button>
 </form>
 <pre>form = {{user | json}}</pre>
 <pre>master = {{master | json}}</pre>
 </div>

 <script>
 function Controller($scope) {
    $scope.master= {};

    $scope.update = function(user) {
      // Example with 1 argument
      $scope.master= angular.copy(user);
    };

    $scope.reset = function() {
      // Example with 2 arguments
      angular.copy($scope.master, $scope.user);
    };

    $scope.reset();
  }
 </script>
 </doc:source>
 </doc:example>
 */ function copy(source, destination) {
        if (isWindow(source) || isScope(source)) throw ngMinErr("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        if (destination) {
            if (source === destination) throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
            if (isArray(source)) {
                destination.length = 0;
                for(var i = 0; i < source.length; i++)destination.push(copy(source[i]));
            } else {
                var h = destination.$$hashKey;
                for(var key in forEach(destination, function(value, key) {
                    delete destination[key];
                }), source)destination[key] = copy(source[key]);
                setHashKey(destination, h);
            }
        } else destination = source, source && (isArray(source) ? destination = copy(source, []) : isDate(source) ? destination = new Date(source.getTime()) : isRegExp(source) ? destination = new RegExp(source.source) : isObject(source) && (destination = copy(source, {})));
        return destination;
    }
    /**
   * @ngdoc function
   * @name angular.equals
   * @function
   *
   * @description
   * Determines if two objects or two values are equivalent. Supports value types, regular
   * expressions, arrays and objects.
   *
   * Two objects or values are considered equivalent if at least one of the following is true:
   *
   * * Both objects or values pass `===` comparison.
   * * Both objects or values are of the same type and all of their properties are equal by
   *   comparing them with `angular.equals`.
   * * Both values are NaN. (In JavaScript, NaN == NaN => false. But we consider two NaN as equal)
   * * Both values represent the same regular expression (In JavasScript,
   *   /abc/ == /abc/ => false. But we consider two regular expressions as equal when their textual
   *   representation matches).
   *
   * During a property comparison, properties of `function` type and properties with names
   * that begin with `$` are ignored.
   *
   * Scope and DOMWindow objects are being compared only by identify (`===`).
   *
   * @param {*} o1 Object or value to compare.
   * @param {*} o2 Object or value to compare.
   * @returns {boolean} True if arguments are equal.
   */ function equals(o1, o2) {
        if (o1 === o2) return !0;
        if (null === o1 || null === o2) return !1;
        if (o1 != o1 && o2 != o2) return !0; // NaN === NaN
        var length, key, keySet, t1 = typeof o1;
        if (t1 == typeof o2 && "object" == t1) {
            if (isArray(o1)) {
                if (!isArray(o2)) return !1;
                if ((length = o1.length) == o2.length) {
                    for(key = 0; key < length; key++)if (!equals(o1[key], o2[key])) return !1;
                    return !0;
                }
            } else {
                if (isDate(o1)) return isDate(o2) && o1.getTime() == o2.getTime();
                if (isRegExp(o1) && isRegExp(o2)) return o1.toString() == o2.toString();
                if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) return !1;
                for(key in keySet = {}, o1)if (!("$" === key.charAt(0) || isFunction(o1[key]))) {
                    if (!equals(o1[key], o2[key])) return !1;
                    keySet[key] = !0;
                }
                for(key in o2)if (!keySet.hasOwnProperty(key) && "$" !== key.charAt(0) && o2[key] !== undefined && !isFunction(o2[key])) return !1;
                return !0;
            }
        }
        return !1;
    }
    function csp() {
        return document1.securityPolicy && document1.securityPolicy.isActive || document1.querySelector && !!(document1.querySelector("[ng-csp]") || document1.querySelector("[data-ng-csp]"));
    }
    function concat(array1, array2, index) {
        return array1.concat(slice.call(array2, index));
    }
    function sliceArgs(args, startIndex) {
        return slice.call(args, startIndex || 0);
    }
    /* jshint -W101 */ /**
   * @ngdoc function
   * @name angular.bind
   * @function
   *
   * @description
   * Returns a function which calls function `fn` bound to `self` (`self` becomes the `this` for
   * `fn`). You can supply optional `args` that are prebound to the function. This feature is also
   * known as [partial application](http://en.wikipedia.org/wiki/Partial_application), as
   * distinguished from [function currying](http://en.wikipedia.org/wiki/Currying#Contrast_with_partial_function_application).
   *
   * @param {Object} self Context which `fn` should be evaluated in.
   * @param {function()} fn Function to be bound.
   * @param {...*} args Optional arguments to be prebound to the `fn` function call.
   * @returns {function()} Function that wraps the `fn` with all the specified bindings.
   */ /* jshint +W101 */ function bind(self, fn) {
        var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
        return !isFunction(fn) || fn instanceof RegExp ? fn : curryArgs.length ? function() {
            return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0))) : fn.apply(self, curryArgs);
        } : function() {
            return arguments.length ? fn.apply(self, arguments) : fn.call(self);
        };
    }
    function toJsonReplacer(key, value) {
        var val = value;
        return "string" == typeof key && "$" === key.charAt(0) ? val = undefined : isWindow(value) ? val = "$WINDOW" : value && document1 === value ? val = "$DOCUMENT" : isScope(value) && (val = "$SCOPE"), val;
    }
    /**
   * @ngdoc function
   * @name angular.toJson
   * @function
   *
   * @description
   * Serializes input into a JSON-formatted string. Properties with leading $ characters will be
   * stripped since angular uses this notation internally.
   *
   * @param {Object|Array|Date|string|number} obj Input to be serialized into JSON.
   * @param {boolean=} pretty If set to true, the JSON output will contain newlines and whitespace.
   * @returns {string|undefined} JSON-ified string representing `obj`.
   */ function toJson(obj, pretty) {
        return void 0 === obj ? undefined : JSON.stringify(obj, toJsonReplacer, pretty ? "  " : null);
    }
    /**
   * @ngdoc function
   * @name angular.fromJson
   * @function
   *
   * @description
   * Deserializes a JSON string.
   *
   * @param {string} json JSON string to deserialize.
   * @returns {Object|Array|Date|string|number} Deserialized thingy.
   */ function fromJson(json) {
        return isString(json) ? JSON.parse(json) : json;
    }
    function toBoolean(value) {
        if (value && 0 !== value.length) {
            var v = lowercase("" + value);
            value = !("f" == v || "0" == v || "false" == v || "no" == v || "n" == v || "[]" == v);
        } else value = !1;
        return value;
    }
    /**
   * @returns {string} Returns the string representation of the element.
   */ function startingTag(element) {
        element = jqLite(element).clone();
        try {
            // turns out IE does not let you set .html() on elements which
            // are not allowed to have children. So we just ignore it.
            element.empty();
        } catch (e) {}
        var elemHtml = jqLite("<div>").append(element).html();
        try {
            return 3 === element[0].nodeType ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(match, nodeName) {
                return "<" + lowercase(nodeName);
            });
        } catch (e) {
            return lowercase(elemHtml);
        }
    }
    /////////////////////////////////////////////////
    /**
   * Tries to decode the URI component without throwing an exception.
   *
   * @private
   * @param str value potential URI component to check.
   * @returns {boolean} True if `value` can be decoded
   * with the decodeURIComponent function.
   */ function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {
        // Ignore any invalid uri component
        }
    }
    /**
   * Parses an escaped url query string into key-value pairs.
   * @returns Object.<(string|boolean)>
   */ function parseKeyValue(/**string*/ keyValue) {
        var key_value, key, obj = {};
        return forEach((keyValue || "").split("&"), function(keyValue) {
            if (keyValue && isDefined(key = tryDecodeURIComponent((key_value = keyValue.split("="))[0]))) {
                var val = !isDefined(key_value[1]) || tryDecodeURIComponent(key_value[1]);
                obj[key] ? isArray(obj[key]) ? obj[key].push(val) : obj[key] = [
                    obj[key],
                    val
                ] : obj[key] = val;
            }
        }), obj;
    }
    function toKeyValue(obj) {
        var parts = [];
        return forEach(obj, function(value, key) {
            isArray(value) ? forEach(value, function(arrayValue) {
                parts.push(encodeUriQuery(key, !0) + (!0 === arrayValue ? "" : "=" + encodeUriQuery(arrayValue, !0)));
            }) : parts.push(encodeUriQuery(key, !0) + (!0 === value ? "" : "=" + encodeUriQuery(value, !0)));
        }), parts.length ? parts.join("&") : "";
    }
    /**
   * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
   * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
   * segments:
   *    segment       = *pchar
   *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
   *    pct-encoded   = "%" HEXDIG HEXDIG
   *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
   *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
   *                     / "*" / "+" / "," / ";" / "="
   */ function encodeUriSegment(val) {
        return encodeUriQuery(val, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+");
    }
    /**
   * This method is intended for encoding *key* or *value* parts of query component. We need a custom
   * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
   * encoded per http://tools.ietf.org/html/rfc3986:
   *    query       = *( pchar / "/" / "?" )
   *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
   *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
   *    pct-encoded   = "%" HEXDIG HEXDIG
   *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
   *                     / "*" / "+" / "," / ";" / "="
   */ function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, pctEncodeSpaces ? "%20" : "+");
    }
    /**
   * @ngdoc function
   * @name angular.bootstrap
   * @description
   * Use this function to manually start up angular application.
   *
   * See: {@link guide/bootstrap Bootstrap}
   *
   * Note that ngScenario-based end-to-end tests cannot use this function to bootstrap manually.
   * They must use {@link api/ng.directive:ngApp ngApp}.
   *
   * @param {Element} element DOM element which is the root of angular application.
   * @param {Array<String|Function|Array>=} modules an array of modules to load into the application.
   *     Each item in the array should be the name of a predefined module or a (DI annotated)
   *     function that will be invoked by the injector as a run block.
   *     See: {@link angular.module modules}
   * @returns {AUTO.$injector} Returns the newly created injector for this app.
   */ function bootstrap(element, modules) {
        var doBootstrap = function() {
            if ((element = jqLite(element)).injector()) throw ngMinErr("btstrpd", "App Already Bootstrapped with this Element '{0}'", element[0] === document1 ? "document" : startingTag(element));
            (modules = modules || []).unshift([
                "$provide",
                function($provide) {
                    $provide.value("$rootElement", element);
                }
            ]), modules.unshift("ng");
            var injector = createInjector(modules);
            return injector.invoke([
                "$rootScope",
                "$rootElement",
                "$compile",
                "$injector",
                "$animate",
                function(scope, element, compile, injector, animate) {
                    scope.$apply(function() {
                        element.data("$injector", injector), compile(element)(scope);
                    });
                }
            ]), injector;
        }, NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
        if (window1 && !NG_DEFER_BOOTSTRAP.test(window1.name)) return doBootstrap();
        window1.name = window1.name.replace(NG_DEFER_BOOTSTRAP, ""), angular1.resumeBootstrap = function(extraModules) {
            forEach(extraModules, function(module) {
                modules.push(module);
            }), doBootstrap();
        };
    }
    nodeName_ = msie < 9 ? function(element) {
        return (element = element.nodeName ? element : element[0]).scopeName && "HTML" != element.scopeName ? uppercase(element.scopeName + ":" + element.nodeName) : element.nodeName;
    } : function(element) {
        return element.nodeName ? element.nodeName : element[0].nodeName;
    };
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snake_case(name, separator) {
        return separator = separator || "_", name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
            return (pos ? separator : "") + letter.toLowerCase();
        });
    }
    /**
   * throw error if the argument is falsy.
   */ function assertArg(arg, name, reason) {
        if (!arg) throw ngMinErr("areq", "Argument '{0}' is {1}", name || "?", reason || "required");
        return arg;
    }
    function assertArgFn(arg, name, acceptArrayAnnotation) {
        return acceptArrayAnnotation && isArray(arg) && (arg = arg[arg.length - 1]), assertArg(isFunction(arg), name, "not a function, got " + (arg && "object" == typeof arg ? arg.constructor.name || "Object" : typeof arg)), arg;
    }
    /**
   * throw error if the name given is hasOwnProperty
   * @param  {String} name    the name to test
   * @param  {String} context the context in which the name is used, such as module or directive
   */ function assertNotHasOwnProperty(name, context) {
        if ("hasOwnProperty" === name) throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context);
    }
    /**
   * Return the value accessible from the object by path. Any undefined traversals are ignored
   * @param {Object} obj starting object
   * @param {string} path path to traverse
   * @param {boolean=true} bindFnToScope
   * @returns value as accessible by path
   */ //TODO(misko): this function needs to be removed
    function getter(obj, path, bindFnToScope) {
        if (!path) return obj;
        for(var key, keys = path.split("."), lastInstance = obj, len = keys.length, i = 0; i < len; i++)key = keys[i], obj && (obj = (lastInstance = obj)[key]);
        return !bindFnToScope && isFunction(obj) ? bind(lastInstance, obj) : obj;
    }
    /**
   * Return the DOM siblings between the first and last node in the given array.
   * @param {Array} array like object
   * @returns jQlite object containing the elements
   */ function getBlockElements(nodes) {
        var startNode = nodes[0], endNode = nodes[nodes.length - 1];
        if (startNode === endNode) return jqLite(startNode);
        var element = startNode, elements = [
            element
        ];
        do {
            if (!(element = element.nextSibling)) break;
            elements.push(element);
        }while (element !== endNode)
        return jqLite(elements);
    }
    /* global
    angularModule: true,
    version: true,
    
    $LocaleProvider,
    $CompileProvider,
    
    htmlAnchorDirective,
    inputDirective,
    inputDirective,
    formDirective,
    scriptDirective,
    selectDirective,
    styleDirective,
    optionDirective,
    ngBindDirective,
    ngBindHtmlDirective,
    ngBindTemplateDirective,
    ngClassDirective,
    ngClassEvenDirective,
    ngClassOddDirective,
    ngCspDirective,
    ngCloakDirective,
    ngControllerDirective,
    ngFormDirective,
    ngHideDirective,
    ngIfDirective,
    ngIncludeDirective,
    ngIncludeFillContentDirective,
    ngInitDirective,
    ngNonBindableDirective,
    ngPluralizeDirective,
    ngRepeatDirective,
    ngShowDirective,
    ngStyleDirective,
    ngSwitchDirective,
    ngSwitchWhenDirective,
    ngSwitchDefaultDirective,
    ngOptionsDirective,
    ngTranscludeDirective,
    ngModelDirective,
    ngListDirective,
    ngChangeDirective,
    requiredDirective,
    requiredDirective,
    ngValueDirective,
    ngAttributeAliasDirectives,
    ngEventDirectives,

    $AnchorScrollProvider,
    $AnimateProvider,
    $BrowserProvider,
    $CacheFactoryProvider,
    $ControllerProvider,
    $DocumentProvider,
    $ExceptionHandlerProvider,
    $FilterProvider,
    $InterpolateProvider,
    $IntervalProvider,
    $HttpProvider,
    $HttpBackendProvider,
    $LocationProvider,
    $LogProvider,
    $ParseProvider,
    $RootScopeProvider,
    $QProvider,
    $$SanitizeUriProvider,
    $SceProvider,
    $SceDelegateProvider,
    $SnifferProvider,
    $TemplateCacheProvider,
    $TimeoutProvider,
    $WindowProvider
*/ /**
   * @ngdoc property
   * @name angular.version
   * @description
   * An object that contains information about the current AngularJS version. This object has the
   * following properties:
   *
   * - `full` – `{string}` – Full version string, such as "0.9.18".
   * - `major` – `{number}` – Major version number, such as "0".
   * - `minor` – `{number}` – Minor version number, such as "9".
   * - `dot` – `{number}` – Dot version number, such as "18".
   * - `codeName` – `{string}` – Code name of the release, such as "jiggling-armfat".
   */ var version = {
        full: "1.2.5",
        major: 1,
        minor: 2,
        dot: 5,
        codeName: "singularity-expansion"
    }, jqCache = JQLite.cache = {}, jqName = JQLite.expando = "ng-" + new Date().getTime(), jqId = 1, addEventListenerFn = window1.document.addEventListener ? function(element, type, fn) {
        element.addEventListener(type, fn, !1);
    } : function(element, type, fn) {
        element.attachEvent("on" + type, fn);
    }, removeEventListenerFn = window1.document.removeEventListener ? function(element, type, fn) {
        element.removeEventListener(type, fn, !1);
    } : function(element, type, fn) {
        element.detachEvent("on" + type, fn);
    }, SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g, MOZ_HACK_REGEXP = /^moz([A-Z])/, jqLiteMinErr = minErr("jqLite");
    /**
   * Converts snake_case to camelCase.
   * Also there is special case for Moz prefix starting with upper case letter.
   * @param name Name to normalize
   */ function camelCase(name) {
        return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        }).replace(MOZ_HACK_REGEXP, "Moz$1");
    }
    /////////////////////////////////////////////
    // jQuery mutation patch
    //
    // In conjunction with bindJQuery intercepts all jQuery's DOM destruction apis and fires a
    // $destroy event on all DOM nodes being removed.
    //
    /////////////////////////////////////////////
    function jqLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments) {
        var originalJqFn = jQuery.fn[name];
        function removePatch(param) {
            // jshint -W040
            var set, setIndex, setLength, element, childIndex, childLength, children, list = filterElems && param ? [
                this.filter(param)
            ] : [
                this
            ], fireEvent = dispatchThis;
            if (!getterIfNoArguments || null != param) for(; list.length;)for(setIndex = 0, setLength = (set = list.shift()).length; setIndex < setLength; setIndex++)for(element = jqLite(set[setIndex]), fireEvent ? element.triggerHandler("$destroy") : fireEvent = !fireEvent, childIndex = 0, childLength = (children = element.children()).length; childIndex < childLength; childIndex++)list.push(jQuery(children[childIndex]));
            return originalJqFn.apply(this, arguments);
        }
        originalJqFn = originalJqFn.$original || originalJqFn, removePatch.$original = originalJqFn, jQuery.fn[name] = removePatch;
    }
    /////////////////////////////////////////////
    function JQLite(element) {
        if (element instanceof JQLite) return element;
        if (!(this instanceof JQLite)) {
            if (isString(element) && "<" != element.charAt(0)) throw jqLiteMinErr("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
            return new JQLite(element);
        }
        if (isString(element)) {
            var div = document1.createElement("div");
            // Read about the NoScope elements here:
            // http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx
            div.innerHTML = "<div>&#160;</div>" + element, div.removeChild(div.firstChild), jqLiteAddNodes(this, div.childNodes), jqLite(document1.createDocumentFragment()).append(this);
        } else jqLiteAddNodes(this, element);
    }
    function jqLiteClone(element) {
        return element.cloneNode(!0);
    }
    function jqLiteDealoc(element) {
        jqLiteRemoveData(element);
        for(var i = 0, children = element.childNodes || []; i < children.length; i++)jqLiteDealoc(children[i]);
    }
    function jqLiteOff(element, type, fn, unsupported) {
        if (isDefined(unsupported)) throw jqLiteMinErr("offargs", "jqLite#off() does not support the `selector` argument");
        var events = jqLiteExpandoStore(element, "events");
        jqLiteExpandoStore(element, "handle") && (isUndefined(type) ? forEach(events, function(eventHandler, type) {
            removeEventListenerFn(element, type, eventHandler), delete events[type];
        }) : forEach(type.split(" "), function(type) {
            isUndefined(fn) ? (removeEventListenerFn(element, type, events[type]), delete events[type]) : arrayRemove(events[type] || [], fn);
        })); //no listeners registered
    }
    function jqLiteRemoveData(element, name) {
        var expandoId = element[jqName], expandoStore = jqCache[expandoId];
        if (expandoStore) {
            if (name) {
                delete jqCache[expandoId].data[name];
                return;
            }
            expandoStore.handle && (expandoStore.events.$destroy && expandoStore.handle({}, "$destroy"), jqLiteOff(element)), delete jqCache[expandoId], element[jqName] = undefined;
        }
    }
    function jqLiteExpandoStore(element, key, value) {
        var expandoId = element[jqName], expandoStore = jqCache[expandoId || -1];
        if (!isDefined(value)) return expandoStore && expandoStore[key];
        expandoStore || (element[jqName] = expandoId = ++jqId, expandoStore = jqCache[expandoId] = {}), expandoStore[key] = value;
    }
    function jqLiteData(element, key, value) {
        var data = jqLiteExpandoStore(element, "data"), isSetter = isDefined(value), keyDefined = !isSetter && isDefined(key), isSimpleGetter = keyDefined && !isObject(key);
        if (data || isSimpleGetter || jqLiteExpandoStore(element, "data", data = {}), isSetter) data[key] = value;
        else {
            if (!keyDefined) return data;
            if (isSimpleGetter) // don't create data in this case.
            return data && data[key];
            extend(data, key);
        }
    }
    function jqLiteHasClass(element, selector) {
        return !!element.getAttribute && (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1;
    }
    function jqLiteRemoveClass(element, cssClasses) {
        cssClasses && element.setAttribute && forEach(cssClasses.split(" "), function(cssClass) {
            element.setAttribute("class", trim((" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + trim(cssClass) + " ", " ")));
        });
    }
    function jqLiteAddClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            var existingClasses = (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
            forEach(cssClasses.split(" "), function(cssClass) {
                cssClass = trim(cssClass), -1 === existingClasses.indexOf(" " + cssClass + " ") && (existingClasses += cssClass + " ");
            }), element.setAttribute("class", trim(existingClasses));
        }
    }
    function jqLiteAddNodes(root, elements) {
        if (elements) {
            elements = !elements.nodeName && isDefined(elements.length) && !isWindow(elements) ? elements : [
                elements
            ];
            for(var i = 0; i < elements.length; i++)root.push(elements[i]);
        }
    }
    function jqLiteController(element, name) {
        return jqLiteInheritedData(element, "$" + (name || "ngController") + "Controller");
    }
    function jqLiteInheritedData(element, name, value) {
        // if element is the document object work with the html element instead
        // this makes $(document).scope() possible
        9 == (element = jqLite(element))[0].nodeType && (element = element.find("html"));
        for(var names = isArray(name) ? name : [
            name
        ]; element.length;){
            for(var i = 0, ii = names.length; i < ii; i++)if ((value = element.data(names[i])) !== undefined) return value;
            element = element.parent();
        }
    }
    function jqLiteEmpty(element) {
        for(var i = 0, childNodes = element.childNodes; i < childNodes.length; i++)jqLiteDealoc(childNodes[i]);
        for(; element.firstChild;)element.removeChild(element.firstChild);
    }
    //////////////////////////////////////////
    // Functions which are declared directly.
    //////////////////////////////////////////
    var JQLitePrototype = JQLite.prototype = {
        ready: function(fn) {
            var fired = !1;
            function trigger() {
                fired || (fired = !0, fn());
            }
            // check if document already is loaded
            "complete" === document1.readyState ? setTimeout(trigger) : (this.on("DOMContentLoaded", trigger), // we can not use jqLite since we are not done loading and jQuery could be loaded later.
            // jshint -W064
            JQLite(window1).on("load", trigger));
        },
        toString: function() {
            var value = [];
            return forEach(this, function(e) {
                value.push("" + e);
            }), "[" + value.join(", ") + "]";
        },
        eq: function(index) {
            return index >= 0 ? jqLite(this[index]) : jqLite(this[this.length + index]);
        },
        length: 0,
        push: push,
        sort: [].sort,
        splice: [].splice
    }, BOOLEAN_ATTR = {};
    forEach("multiple,selected,checked,disabled,readOnly,required,open".split(","), function(value) {
        BOOLEAN_ATTR[lowercase(value)] = value;
    });
    var BOOLEAN_ELEMENTS = {};
    function getBooleanAttrName(element, name) {
        // check dom last since we will most likely fail on name
        var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
        // booleanAttr is here twice to minimize DOM access
        return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;
    }
    /**
   * Computes a hash of an 'obj'.
   * Hash of a:
   *  string is string
   *  number is number as string
   *  object is either result of calling $$hashKey function on the object or uniquely generated id,
   *         that is also assigned to the $$hashKey property of the object.
   *
   * @param obj
   * @returns {string} hash string such that the same input will have the same hash string.
   *         The resulting string key is in 'type:hashKey' format.
   */ function hashKey(obj) {
        var key, objType = typeof obj;
        return "object" == objType && null !== obj ? "function" == typeof (key = obj.$$hashKey) ? // must invoke on object to keep the right this
        key = obj.$$hashKey() : undefined === key && (key = obj.$$hashKey = nextUid()) : key = obj, objType + ":" + key;
    }
    /**
   * HashMap which can use objects as keys
   */ function HashMap(array) {
        forEach(array, this.put, this);
    }
    forEach("input,select,option,textarea,button,form,details".split(","), function(value) {
        BOOLEAN_ELEMENTS[uppercase(value)] = !0;
    }), forEach({
        data: jqLiteData,
        inheritedData: jqLiteInheritedData,
        scope: function(element) {
            // Can't use jqLiteData here directly so we stay compatible with jQuery!
            return jqLite(element).data("$scope") || jqLiteInheritedData(element.parentNode || element, [
                "$isolateScope",
                "$scope"
            ]);
        },
        isolateScope: function(element) {
            // Can't use jqLiteData here directly so we stay compatible with jQuery!
            return jqLite(element).data("$isolateScope") || jqLite(element).data("$isolateScopeNoTemplate");
        },
        controller: jqLiteController,
        injector: function(element) {
            return jqLiteInheritedData(element, "$injector");
        },
        removeAttr: function(element, name) {
            element.removeAttribute(name);
        },
        hasClass: jqLiteHasClass,
        css: function(element, name, value) {
            if (name = camelCase(name), isDefined(value)) element.style[name] = value;
            else {
                var val;
                return msie <= 8 && "" === // this is some IE specific weirdness that jQuery 1.6.4 does not sure why
                (val = element.currentStyle && element.currentStyle[name]) && (val = "auto"), val = val || element.style[name], msie <= 8 && // jquery weirdness :-/
                (val = "" === val ? undefined : val), val;
            }
        },
        attr: function(element, name, value) {
            var lowercasedName = lowercase(name);
            if (BOOLEAN_ATTR[lowercasedName]) {
                if (!isDefined(value)) return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
                value ? (element[name] = !0, element.setAttribute(name, lowercasedName)) : (element[name] = !1, element.removeAttribute(lowercasedName));
            } else if (isDefined(value)) element.setAttribute(name, value);
            else if (element.getAttribute) {
                // the extra argument "2" is to get the right thing for a.href in IE, see jQuery code
                // some elements (e.g. Document) don't have get attribute, so return undefined
                var ret = element.getAttribute(name, 2);
                // normalize non-existing attributes to undefined (as jQuery)
                return null === ret ? undefined : ret;
            }
        },
        prop: function(element, name, value) {
            if (!isDefined(value)) return element[name];
            element[name] = value;
        },
        text: function() {
            var NODE_TYPE_TEXT_PROPERTY = [];
            return msie < 9 ? (NODE_TYPE_TEXT_PROPERTY[1] = "innerText", NODE_TYPE_TEXT_PROPERTY[3] = "nodeValue") : NODE_TYPE_TEXT_PROPERTY[1] = /** Element **/ NODE_TYPE_TEXT_PROPERTY[3] = "textContent", getText.$dv = "", getText;
            function getText(element, value) {
                var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType];
                if (isUndefined(value)) return textProp ? element[textProp] : "";
                element[textProp] = value;
            }
        }(),
        val: function(element, value) {
            if (isUndefined(value)) {
                if ("SELECT" === nodeName_(element) && element.multiple) {
                    var result = [];
                    return forEach(element.options, function(option) {
                        option.selected && result.push(option.value || option.text);
                    }), 0 === result.length ? null : result;
                }
                return element.value;
            }
            element.value = value;
        },
        html: function(element, value) {
            if (isUndefined(value)) return element.innerHTML;
            for(var i = 0, childNodes = element.childNodes; i < childNodes.length; i++)jqLiteDealoc(childNodes[i]);
            element.innerHTML = value;
        },
        empty: jqLiteEmpty
    }, function(fn, name) {
        /**
       * Properties: writes return selection, reads return first value
       */ JQLite.prototype[name] = function(arg1, arg2) {
            var i, key;
            // jqLiteHasClass has only two arguments, but is a getter-only fn, so we need to special-case it
            // in a way that survives minification.
            // jqLiteEmpty takes no arguments but is a setter.
            if (fn !== jqLiteEmpty && (2 == fn.length && fn !== jqLiteHasClass && fn !== jqLiteController ? arg1 : arg2) === undefined) {
                if (isObject(arg1)) {
                    // we are a write, but the object properties are the key/values
                    for(i = 0; i < this.length; i++)if (fn === jqLiteData) // data() takes the whole object in jQuery
                    fn(this[i], arg1);
                    else for(key in arg1)fn(this[i], key, arg1[key]);
                    // return self for chaining
                    return this;
                }
                for(var value = fn.$dv, jj = undefined === value ? Math.min(this.length, 1) : this.length, j = 0; j < jj; j++){
                    var nodeValue = fn(this[j], arg1, arg2);
                    value = value ? value + nodeValue : nodeValue;
                }
                return value;
            }
            // we are a write, so apply to all children
            for(i = 0; i < this.length; i++)fn(this[i], arg1, arg2);
            // return self for chaining
            return this;
        };
    }), //////////////////////////////////////////
    // Functions iterating traversal.
    // These functions chain results into a single
    // selector.
    //////////////////////////////////////////
    forEach({
        removeData: jqLiteRemoveData,
        dealoc: jqLiteDealoc,
        on: function onFn(element, type, fn, unsupported) {
            if (isDefined(unsupported)) throw jqLiteMinErr("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
            var events, eventHandler, events1 = jqLiteExpandoStore(element, "events"), handle = jqLiteExpandoStore(element, "handle");
            events1 || jqLiteExpandoStore(element, "events", events1 = {}), !handle && jqLiteExpandoStore(element, "handle", (events = events1, (eventHandler = function(event, type) {
                if (event.preventDefault || (event.preventDefault = function() {
                    event.returnValue = !1; //ie
                }), event.stopPropagation || (event.stopPropagation = function() {
                    event.cancelBubble = !0; //ie
                }), event.target || (event.target = event.srcElement || document1), isUndefined(event.defaultPrevented)) {
                    var prevent = event.preventDefault;
                    event.preventDefault = function() {
                        event.defaultPrevented = !0, prevent.call(event);
                    }, event.defaultPrevented = !1;
                }
                event.isDefaultPrevented = function() {
                    return event.defaultPrevented || !1 === event.returnValue;
                }, forEach(events[type || event.type], function(fn) {
                    fn.call(element, event);
                }), msie <= 8 ? (// IE7/8 does not allow to delete property on native object
                event.preventDefault = null, event.stopPropagation = null, event.isDefaultPrevented = null) : (// It shouldn't affect normal browsers (native methods are defined on prototype).
                delete event.preventDefault, delete event.stopPropagation, delete event.isDefaultPrevented);
            }).elem = element, handle = eventHandler)), forEach(type.split(" "), function(type) {
                var eventFns = events1[type];
                if (!eventFns) {
                    if ("mouseenter" == type || "mouseleave" == type) {
                        var contains = document1.body.contains || document1.body.compareDocumentPosition ? function(a, b) {
                            // jshint bitwise: false
                            var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
                            return a === bup || !!(bup && 1 === bup.nodeType && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)));
                        } : function(a, b) {
                            if (b) {
                                for(; b = b.parentNode;)if (b === a) return !0;
                            }
                            return !1;
                        };
                        events1[type] = [], onFn(element, {
                            mouseleave: "mouseout",
                            mouseenter: "mouseover"
                        }[type], function(event) {
                            var related = event.relatedTarget;
                            // For mousenter/leave call the handler if related is outside the target.
                            // NB: No relatedTarget if the mouse left/entered the browser window
                            related && (related === this || contains(this, related)) || handle(event, type);
                        });
                    } else addEventListenerFn(element, type, handle), events1[type] = [];
                    eventFns = events1[type];
                }
                eventFns.push(fn);
            });
        },
        off: jqLiteOff,
        replaceWith: function(element, replaceNode) {
            var index, parent = element.parentNode;
            jqLiteDealoc(element), forEach(new JQLite(replaceNode), function(node) {
                index ? parent.insertBefore(node, index.nextSibling) : parent.replaceChild(node, element), index = node;
            });
        },
        children: function(element) {
            var children = [];
            return forEach(element.childNodes, function(element) {
                1 === element.nodeType && children.push(element);
            }), children;
        },
        contents: function(element) {
            return element.childNodes || [];
        },
        append: function(element, node) {
            forEach(new JQLite(node), function(child) {
                (1 === element.nodeType || 11 === element.nodeType) && element.appendChild(child);
            });
        },
        prepend: function(element, node) {
            if (1 === element.nodeType) {
                var index = element.firstChild;
                forEach(new JQLite(node), function(child) {
                    element.insertBefore(child, index);
                });
            }
        },
        wrap: function(element, wrapNode) {
            wrapNode = jqLite(wrapNode)[0];
            var parent = element.parentNode;
            parent && parent.replaceChild(wrapNode, element), wrapNode.appendChild(element);
        },
        remove: function(element) {
            jqLiteDealoc(element);
            var parent = element.parentNode;
            parent && parent.removeChild(element);
        },
        after: function(element, newElement) {
            var index = element, parent = element.parentNode;
            forEach(new JQLite(newElement), function(node) {
                parent.insertBefore(node, index.nextSibling), index = node;
            });
        },
        addClass: jqLiteAddClass,
        removeClass: jqLiteRemoveClass,
        toggleClass: function(element, selector, condition) {
            isUndefined(condition) && (condition = !jqLiteHasClass(element, selector)), (condition ? jqLiteAddClass : jqLiteRemoveClass)(element, selector);
        },
        parent: function(element) {
            var parent = element.parentNode;
            return parent && 11 !== parent.nodeType ? parent : null;
        },
        next: function(element) {
            if (element.nextElementSibling) return element.nextElementSibling;
            for(// IE8 doesn't have nextElementSibling
            var elm = element.nextSibling; null != elm && 1 !== elm.nodeType;)elm = elm.nextSibling;
            return elm;
        },
        find: function(element, selector) {
            return element.getElementsByTagName ? element.getElementsByTagName(selector) : [];
        },
        clone: jqLiteClone,
        triggerHandler: function(element, eventName, eventData) {
            var eventFns = (jqLiteExpandoStore(element, "events") || {})[eventName];
            eventData = eventData || [];
            var event = [
                {
                    preventDefault: noop,
                    stopPropagation: noop
                }
            ];
            forEach(eventFns, function(fn) {
                fn.apply(element, event.concat(eventData));
            });
        }
    }, function(fn, name) {
        /**
       * chaining functions
       */ JQLite.prototype[name] = function(arg1, arg2, arg3) {
            for(var value, i = 0; i < this.length; i++)isUndefined(value) ? isDefined(value = fn(this[i], arg1, arg2, arg3)) && // any function which returns a value needs to be wrapped
            (value = jqLite(value)) : jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
            return isDefined(value) ? value : this;
        }, // bind legacy bind/unbind to on/off
        JQLite.prototype.bind = JQLite.prototype.on, JQLite.prototype.unbind = JQLite.prototype.off;
    }), HashMap.prototype = {
        /**
     * Store key value pair
     * @param key key to store can be any type
     * @param value value to store can be any type
     */ put: function(key, value) {
            this[hashKey(key)] = value;
        },
        /**
     * @param key
     * @returns the value for the key
     */ get: function(key) {
            return this[hashKey(key)];
        },
        /**
     * Remove the key/value pair
     * @param key
     */ remove: function(key) {
            var value = this[key = hashKey(key)];
            return delete this[key], value;
        }
    };
    /**
 * @ngdoc function
 * @name angular.injector
 * @function
 *
 * @description
 * Creates an injector function that can be used for retrieving services as well as for
 * dependency injection (see {@link guide/di dependency injection}).
 *

 * @param {Array.<string|Function>} modules A list of module functions or their aliases. See
 *        {@link angular.module}. The `ng` module must be explicitly added.
 * @returns {function()} Injector function. See {@link AUTO.$injector $injector}.
 *
 * @example
 * Typical usage
 * <pre>
 *   // create an injector
 *   var $injector = angular.injector(['ng']);
 *
 *   // use the injector to kick off your application
 *   // use the type inference to auto inject arguments, or use implicit injection
 *   $injector.invoke(function($rootScope, $compile, $document){
 *     $compile($document)($rootScope);
 *     $rootScope.$digest();
 *   });
 * </pre>
 *
 * Sometimes you want to get access to the injector of a currently running Angular app
 * from outside Angular. Perhaps, you want to inject and compile some markup after the
 * application has been bootstrapped. You can do this using extra `injector()` added
 * to JQuery/jqLite elements. See {@link angular.element}.
 *
 * *This is fairly rare but could be the case if a third party library is injecting the
 * markup.*
 *
 * In the following example a new block of HTML containing a `ng-controller`
 * directive is added to the end of the document body by JQuery. We then compile and link
 * it into the current AngularJS scope.
 *
 * <pre>
 * var $div = $('<div ng-controller="MyCtrl">{{content.label}}</div>');
 * $(document.body).append($div);
 *
 * angular.element(document).injector().invoke(function($compile) {
 *   var scope = angular.element($div).scope();
 *   $compile($div)(scope);
 * });
 * </pre>
 */ /**
   * @ngdoc overview
   * @name AUTO
   * @description
   *
   * Implicit module which gets automatically added to each {@link AUTO.$injector $injector}.
   */ var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m, FN_ARG_SPLIT = /,/, FN_ARG = /^\s*(_?)(\S+?)\1\s*$/, STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, $injectorMinErr = minErr("$injector");
    function annotate(fn) {
        var $inject, last;
        return "function" == typeof fn ? ($inject = fn.$inject) || ($inject = [], fn.length && forEach(fn.toString().replace(STRIP_COMMENTS, "").match(FN_ARGS)[1].split(FN_ARG_SPLIT), function(arg) {
            arg.replace(FN_ARG, function(all, underscore, name) {
                $inject.push(name);
            });
        }), fn.$inject = $inject) : isArray(fn) ? (last = fn.length - 1, assertArgFn(fn[last], "fn"), $inject = fn.slice(0, last)) : assertArgFn(fn, "fn", !0), $inject;
    }
    ///////////////////////////////////////
    /**
   * @ngdoc object
   * @name AUTO.$injector
   * @function
   *
   * @description
   *
   * `$injector` is used to retrieve object instances as defined by
   * {@link AUTO.$provide provider}, instantiate types, invoke methods,
   * and load modules.
   *
   * The following always holds true:
   *
   * <pre>
   *   var $injector = angular.injector();
   *   expect($injector.get('$injector')).toBe($injector);
   *   expect($injector.invoke(function($injector){
   *     return $injector;
   *   }).toBe($injector);
   * </pre>
   *
   * # Injection Function Annotation
   *
   * JavaScript does not have annotations, and annotations are needed for dependency injection. The
   * following are all valid ways of annotating function with injection arguments and are equivalent.
   *
   * <pre>
   *   // inferred (only works if code not minified/obfuscated)
   *   $injector.invoke(function(serviceA){});
   *
   *   // annotated
   *   function explicit(serviceA) {};
   *   explicit.$inject = ['serviceA'];
   *   $injector.invoke(explicit);
   *
   *   // inline
   *   $injector.invoke(['serviceA', function(serviceA){}]);
   * </pre>
   *
   * ## Inference
   *
   * In JavaScript calling `toString()` on a function returns the function definition. The definition
   * can then be parsed and the function arguments can be extracted. *NOTE:* This does not work with
   * minification, and obfuscation tools since these tools change the argument names.
   *
   * ## `$inject` Annotation
   * By adding a `$inject` property onto a function the injection parameters can be specified.
   *
   * ## Inline
   * As an array of injection names, where the last item in the array is the function to call.
   */ /**
   * @ngdoc method
   * @name AUTO.$injector#get
   * @methodOf AUTO.$injector
   *
   * @description
   * Return an instance of the service.
   *
   * @param {string} name The name of the instance to retrieve.
   * @return {*} The instance.
   */ /**
   * @ngdoc method
   * @name AUTO.$injector#invoke
   * @methodOf AUTO.$injector
   *
   * @description
   * Invoke the method and supply the method arguments from the `$injector`.
   *
   * @param {!function} fn The function to invoke. Function parameters are injected according to the
   *   {@link guide/di $inject Annotation} rules.
   * @param {Object=} self The `this` for the invoked method.
   * @param {Object=} locals Optional object. If preset then any argument names are read from this
   *                         object first, before the `$injector` is consulted.
   * @returns {*} the value returned by the invoked `fn` function.
   */ /**
   * @ngdoc method
   * @name AUTO.$injector#has
   * @methodOf AUTO.$injector
   *
   * @description
   * Allows the user to query if the particular service exist.
   *
   * @param {string} Name of the service to query.
   * @returns {boolean} returns true if injector has given service.
   */ /**
   * @ngdoc method
   * @name AUTO.$injector#instantiate
   * @methodOf AUTO.$injector
   * @description
   * Create a new instance of JS type. The method takes a constructor function invokes the new
   * operator and supplies all of the arguments to the constructor function as specified by the
   * constructor annotation.
   *
   * @param {function} Type Annotated constructor function.
   * @param {Object=} locals Optional object. If preset then any argument names are read from this
   * object first, before the `$injector` is consulted.
   * @returns {Object} new instance of `Type`.
   */ /**
   * @ngdoc method
   * @name AUTO.$injector#annotate
   * @methodOf AUTO.$injector
   *
   * @description
   * Returns an array of service names which the function is requesting for injection. This API is
   * used by the injector to determine which services need to be injected into the function when the
   * function is invoked. There are three ways in which the function can be annotated with the needed
   * dependencies.
   *
   * # Argument names
   *
   * The simplest form is to extract the dependencies from the arguments of the function. This is done
   * by converting the function into a string using `toString()` method and extracting the argument
   * names.
   * <pre>
   *   // Given
   *   function MyController($scope, $route) {
   *     // ...
   *   }
   *
   *   // Then
   *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
   * </pre>
   *
   * This method does not work with code minification / obfuscation. For this reason the following
   * annotation strategies are supported.
   *
   * # The `$inject` property
   *
   * If a function has an `$inject` property and its value is an array of strings, then the strings
   * represent names of services to be injected into the function.
   * <pre>
   *   // Given
   *   var MyController = function(obfuscatedScope, obfuscatedRoute) {
   *     // ...
   *   }
   *   // Define function dependencies
   *   MyController['$inject'] = ['$scope', '$route'];
   *
   *   // Then
   *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
   * </pre>
   *
   * # The array notation
   *
   * It is often desirable to inline Injected functions and that's when setting the `$inject` property
   * is very inconvenient. In these situations using the array notation to specify the dependencies in
   * a way that survives minification is a better choice:
   *
   * <pre>
   *   // We wish to write this (not minification / obfuscation safe)
   *   injector.invoke(function($compile, $rootScope) {
   *     // ...
   *   });
   *
   *   // We are forced to write break inlining
   *   var tmpFn = function(obfuscatedCompile, obfuscatedRootScope) {
   *     // ...
   *   };
   *   tmpFn.$inject = ['$compile', '$rootScope'];
   *   injector.invoke(tmpFn);
   *
   *   // To better support inline function the inline annotation is supported
   *   injector.invoke(['$compile', '$rootScope', function(obfCompile, obfRootScope) {
   *     // ...
   *   }]);
   *
   *   // Therefore
   *   expect(injector.annotate(
   *      ['$compile', '$rootScope', function(obfus_$compile, obfus_$rootScope) {}])
   *    ).toEqual(['$compile', '$rootScope']);
   * </pre>
   *
   * @param {function|Array.<string|Function>} fn Function for which dependent service names need to
   * be retrieved as described above.
   *
   * @returns {Array.<string>} The names of the services which the function requires.
   */ /**
   * @ngdoc object
   * @name AUTO.$provide
   *
   * @description
   *
   * The {@link AUTO.$provide $provide} service has a number of methods for registering components
   * with the {@link AUTO.$injector $injector}. Many of these functions are also exposed on
   * {@link angular.Module}.
   *
   * An Angular **service** is a singleton object created by a **service factory**.  These **service
   * factories** are functions which, in turn, are created by a **service provider**.
   * The **service providers** are constructor functions. When instantiated they must contain a
   * property called `$get`, which holds the **service factory** function.
   *
   * When you request a service, the {@link AUTO.$injector $injector} is responsible for finding the
   * correct **service provider**, instantiating it and then calling its `$get` **service factory**
   * function to get the instance of the **service**.
   *
   * Often services have no configuration options and there is no need to add methods to the service
   * provider.  The provider will be no more than a constructor function with a `$get` property. For
   * these cases the {@link AUTO.$provide $provide} service has additional helper methods to register
   * services without specifying a provider.
   *
   * * {@link AUTO.$provide#methods_provider provider(provider)} - registers a **service provider** with the
   *     {@link AUTO.$injector $injector}
   * * {@link AUTO.$provide#methods_constant constant(obj)} - registers a value/object that can be accessed by
   *     providers and services.
   * * {@link AUTO.$provide#methods_value value(obj)} - registers a value/object that can only be accessed by
   *     services, not providers.
   * * {@link AUTO.$provide#methods_factory factory(fn)} - registers a service **factory function**, `fn`,
   *     that will be wrapped in a **service provider** object, whose `$get` property will contain the
   *     given factory function.
   * * {@link AUTO.$provide#methods_service service(class)} - registers a **constructor function**, `class` that
   *     that will be wrapped in a **service provider** object, whose `$get` property will instantiate
   *      a new object using the given constructor function.
   *
   * See the individual methods for more information and examples.
   */ /**
 * @ngdoc method
 * @name AUTO.$provide#provider
 * @methodOf AUTO.$provide
 * @description
 *
 * Register a **provider function** with the {@link AUTO.$injector $injector}. Provider functions
 * are constructor functions, whose instances are responsible for "providing" a factory for a
 * service.
 *
 * Service provider names start with the name of the service they provide followed by `Provider`.
 * For example, the {@link ng.$log $log} service has a provider called
 * {@link ng.$logProvider $logProvider}.
 *
 * Service provider objects can have additional methods which allow configuration of the provider
 * and its service. Importantly, you can configure what kind of service is created by the `$get`
 * method, or how that service will act. For example, the {@link ng.$logProvider $logProvider} has a
 * method {@link ng.$logProvider#debugEnabled debugEnabled}
 * which lets you specify whether the {@link ng.$log $log} service will log debug messages to the
 * console or not.
 *
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name +
                        'Provider'` key.
 * @param {(Object|function())} provider If the provider is:
 *
 *   - `Object`: then it should have a `$get` method. The `$get` method will be invoked using
 *               {@link AUTO.$injector#invoke $injector.invoke()} when an instance needs to be
 *               created.
 *   - `Constructor`: a new instance of the provider will be created using
 *               {@link AUTO.$injector#instantiate $injector.instantiate()}, then treated as
 *               `object`.
 *
 * @returns {Object} registered provider instance

 * @example
 *
 * The following example shows how to create a simple event tracking service and register it using
 * {@link AUTO.$provide#methods_provider $provide.provider()}.
 *
 * <pre>
 *  // Define the eventTracker provider
 *  function EventTrackerProvider() {
 *    var trackingUrl = '/track';
 *
 *    // A provider method for configuring where the tracked events should been saved
 *    this.setTrackingUrl = function(url) {
 *      trackingUrl = url;
 *    };
 *
 *    // The service factory function
 *    this.$get = ['$http', function($http) {
 *      var trackedEvents = {};
 *      return {
 *        // Call this to track an event
 *        event: function(event) {
 *          var count = trackedEvents[event] || 0;
 *          count += 1;
 *          trackedEvents[event] = count;
 *          return count;
 *        },
 *        // Call this to save the tracked events to the trackingUrl
 *        save: function() {
 *          $http.post(trackingUrl, trackedEvents);
 *        }
 *      };
 *    }];
 *  }
 *
 *  describe('eventTracker', function() {
 *    var postSpy;
 *
 *    beforeEach(module(function($provide) {
 *      // Register the eventTracker provider
 *      $provide.provider('eventTracker', EventTrackerProvider);
 *    }));
 *
 *    beforeEach(module(function(eventTrackerProvider) {
 *      // Configure eventTracker provider
 *      eventTrackerProvider.setTrackingUrl('/custom-track');
 *    }));
 *
 *    it('tracks events', inject(function(eventTracker) {
 *      expect(eventTracker.event('login')).toEqual(1);
 *      expect(eventTracker.event('login')).toEqual(2);
 *    }));
 *
 *    it('saves to the tracking url', inject(function(eventTracker, $http) {
 *      postSpy = spyOn($http, 'post');
 *      eventTracker.event('login');
 *      eventTracker.save();
 *      expect(postSpy).toHaveBeenCalled();
 *      expect(postSpy.mostRecentCall.args[0]).not.toEqual('/track');
 *      expect(postSpy.mostRecentCall.args[0]).toEqual('/custom-track');
 *      expect(postSpy.mostRecentCall.args[1]).toEqual({ 'login': 1 });
 *    }));
 *  });
 * </pre>
 */ /**
   * @ngdoc method
   * @name AUTO.$provide#factory
   * @methodOf AUTO.$provide
   * @description
   *
   * Register a **service factory**, which will be called to return the service instance.
   * This is short for registering a service where its provider consists of only a `$get` property,
   * which is the given service factory function.
   * You should use {@link AUTO.$provide#factory $provide.factory(getFn)} if you do not need to
   * configure your service in a provider.
   *
   * @param {string} name The name of the instance.
   * @param {function()} $getFn The $getFn for the instance creation. Internally this is a short hand
   *                            for `$provide.provider(name, {$get: $getFn})`.
   * @returns {Object} registered provider instance
   *
   * @example
   * Here is an example of registering a service
   * <pre>
   *   $provide.factory('ping', ['$http', function($http) {
   *     return function ping() {
   *       return $http.send('/ping');
   *     };
   *   }]);
   * </pre>
   * You would then inject and use this service like this:
   * <pre>
   *   someModule.controller('Ctrl', ['ping', function(ping) {
   *     ping();
   *   }]);
   * </pre>
   */ /**
   * @ngdoc method
   * @name AUTO.$provide#service
   * @methodOf AUTO.$provide
   * @description
   *
   * Register a **service constructor**, which will be invoked with `new` to create the service
   * instance.
   * This is short for registering a service where its provider's `$get` property is the service
   * constructor function that will be used to instantiate the service instance.
   *
   * You should use {@link AUTO.$provide#methods_service $provide.service(class)} if you define your service
   * as a type/class. This is common when using {@link http://coffeescript.org CoffeeScript}.
   *
   * @param {string} name The name of the instance.
   * @param {Function} constructor A class (constructor function) that will be instantiated.
   * @returns {Object} registered provider instance
   *
   * @example
   * Here is an example of registering a service using
   * {@link AUTO.$provide#methods_service $provide.service(class)} that is defined as a CoffeeScript class.
   * <pre>
   *   class Ping
   *     constructor: (@$http)->
   *     send: ()=>
   *       @$http.get('/ping')
   *
   *   $provide.service('ping', ['$http', Ping])
   * </pre>
   * You would then inject and use this service like this:
   * <pre>
   *   someModule.controller 'Ctrl', ['ping', (ping)->
   *     ping.send()
   *   ]
   * </pre>
   */ /**
   * @ngdoc method
   * @name AUTO.$provide#value
   * @methodOf AUTO.$provide
   * @description
   *
   * Register a **value service** with the {@link AUTO.$injector $injector}, such as a string, a
   * number, an array, an object or a function.  This is short for registering a service where its
   * provider's `$get` property is a factory function that takes no arguments and returns the **value
   * service**.
   *
   * Value services are similar to constant services, except that they cannot be injected into a
   * module configuration function (see {@link angular.Module#config}) but they can be overridden by
   * an Angular
   * {@link AUTO.$provide#decorator decorator}.
   *
   * @param {string} name The name of the instance.
   * @param {*} value The value.
   * @returns {Object} registered provider instance
   *
   * @example
   * Here are some examples of creating value services.
   * <pre>
   *   $provide.value('ADMIN_USER', 'admin');
   *
   *   $provide.value('RoleLookup', { admin: 0, writer: 1, reader: 2 });
   *
   *   $provide.value('halfOf', function(value) {
   *     return value / 2;
   *   });
   * </pre>
   */ /**
   * @ngdoc method
   * @name AUTO.$provide#constant
   * @methodOf AUTO.$provide
   * @description
   *
   * Register a **constant service**, such as a string, a number, an array, an object or a function,
   * with the {@link AUTO.$injector $injector}. Unlike {@link AUTO.$provide#value value} it can be
   * injected into a module configuration function (see {@link angular.Module#config}) and it cannot
   * be overridden by an Angular {@link AUTO.$provide#decorator decorator}.
   *
   * @param {string} name The name of the constant.
   * @param {*} value The constant value.
   * @returns {Object} registered instance
   *
   * @example
   * Here a some examples of creating constants:
   * <pre>
   *   $provide.constant('SHARD_HEIGHT', 306);
   *
   *   $provide.constant('MY_COLOURS', ['red', 'blue', 'grey']);
   *
   *   $provide.constant('double', function(value) {
   *     return value * 2;
   *   });
   * </pre>
   */ /**
   * @ngdoc method
   * @name AUTO.$provide#decorator
   * @methodOf AUTO.$provide
   * @description
   *
   * Register a **service decorator** with the {@link AUTO.$injector $injector}. A service decorator
   * intercepts the creation of a service, allowing it to override or modify the behaviour of the
   * service. The object returned by the decorator may be the original service, or a new service
   * object which replaces or wraps and delegates to the original service.
   *
   * @param {string} name The name of the service to decorate.
   * @param {function()} decorator This function will be invoked when the service needs to be
   *    instantiated and should return the decorated service instance. The function is called using
   *    the {@link AUTO.$injector#invoke injector.invoke} method and is therefore fully injectable.
   *    Local injection arguments:
   *
   *    * `$delegate` - The original service instance, which can be monkey patched, configured,
   *      decorated or delegated to.
   *
   * @example
   * Here we decorate the {@link ng.$log $log} service to convert warnings to errors by intercepting
   * calls to {@link ng.$log#error $log.warn()}.
   * <pre>
   *   $provider.decorator('$log', ['$delegate', function($delegate) {
   *     $delegate.warn = $delegate.error;
   *     return $delegate;
   *   }]);
   * </pre>
   */ function createInjector(modulesToLoad) {
        var INSTANTIATING = {}, providerSuffix = "Provider", path = [], loadedModules = new HashMap(), providerCache = {
            $provide: {
                provider: supportObject(provider),
                factory: supportObject(factory),
                service: supportObject(function(name, constructor) {
                    return factory(name, [
                        "$injector",
                        function($injector) {
                            return $injector.instantiate(constructor);
                        }
                    ]);
                }),
                value: supportObject(function(name, val) {
                    return factory(name, valueFn(val));
                }),
                constant: supportObject(function(name, value) {
                    assertNotHasOwnProperty(name, "constant"), providerCache[name] = value, instanceCache[name] = value;
                }),
                decorator: function(serviceName, decorFn) {
                    var origProvider = providerInjector.get(serviceName + providerSuffix), orig$get = origProvider.$get;
                    origProvider.$get = function() {
                        var origInstance = instanceInjector.invoke(orig$get, origProvider);
                        return instanceInjector.invoke(decorFn, null, {
                            $delegate: origInstance
                        });
                    };
                }
            }
        }, providerInjector = providerCache.$injector = createInternalInjector(providerCache, function() {
            throw $injectorMinErr("unpr", "Unknown provider: {0}", path.join(" <- "));
        }), instanceCache = {}, instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function(servicename) {
            var provider = providerInjector.get(servicename + providerSuffix);
            return instanceInjector.invoke(provider.$get, provider);
        });
        return forEach(////////////////////////////////////
        // Module Loading
        ////////////////////////////////////
        function loadModules(modulesToLoad) {
            var moduleFn, invokeQueue, i, ii, runBlocks = [];
            return forEach(modulesToLoad, function(module) {
                if (!loadedModules.get(module)) {
                    loadedModules.put(module, !0);
                    try {
                        if (isString(module)) for(moduleFn = angularModule(module), runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks), invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++){
                            var invokeArgs = invokeQueue[i], provider = providerInjector.get(invokeArgs[0]);
                            provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
                        }
                        else isFunction(module) ? runBlocks.push(providerInjector.invoke(module)) : isArray(module) ? runBlocks.push(providerInjector.invoke(module)) : assertArgFn(module, "module");
                    } catch (e) {
                        throw isArray(module) && (module = module[module.length - 1]), e.message && e.stack && -1 == e.stack.indexOf(e.message) && // Safari & FF's stack traces don't contain error.message content
                        // unlike those of Chrome and IE
                        // So if stack doesn't contain message, we create a new string that contains both.
                        // Since error.stack is read-only in Safari, I'm overriding e and not e.stack here.
                        /* jshint -W022 */ (e = e.message + "\n" + e.stack), $injectorMinErr("modulerr", "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e);
                    }
                }
            }), runBlocks;
        }(modulesToLoad), function(fn) {
            instanceInjector.invoke(fn || noop);
        }), instanceInjector;
        ////////////////////////////////////
        // $provider
        ////////////////////////////////////
        function supportObject(delegate) {
            return function(key, value) {
                if (!isObject(key)) return delegate(key, value);
                forEach(key, reverseParams(delegate));
            };
        }
        function provider(name, provider_) {
            if (assertNotHasOwnProperty(name, "service"), (isFunction(provider_) || isArray(provider_)) && (provider_ = providerInjector.instantiate(provider_)), !provider_.$get) throw $injectorMinErr("pget", "Provider '{0}' must define $get factory method.", name);
            return providerCache[name + providerSuffix] = provider_;
        }
        function factory(name, factoryFn) {
            return provider(name, {
                $get: factoryFn
            });
        }
        ////////////////////////////////////
        // internal Injector
        ////////////////////////////////////
        function createInternalInjector(cache, factory) {
            function getService(serviceName) {
                if (cache.hasOwnProperty(serviceName)) {
                    if (cache[serviceName] === INSTANTIATING) throw $injectorMinErr("cdep", "Circular dependency found: {0}", path.join(" <- "));
                    return cache[serviceName];
                }
                try {
                    return path.unshift(serviceName), cache[serviceName] = INSTANTIATING, cache[serviceName] = factory(serviceName);
                } finally{
                    path.shift();
                }
            }
            function invoke(fn, self, locals) {
                var length, i, key, args = [], $inject = annotate(fn);
                for(i = 0, length = $inject.length; i < length; i++){
                    if ("string" != typeof (key = $inject[i])) throw $injectorMinErr("itkn", "Incorrect injection token! Expected service name as string, got {0}", key);
                    args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key));
                }
                // http://jsperf.com/angularjs-invoke-apply-vs-switch
                // #5388
                return fn.$inject || // this means that we must be an array.
                (fn = fn[length]), fn.apply(self, args);
            }
            return {
                invoke: invoke,
                instantiate: function(Type, locals) {
                    var instance, returnedValue, Constructor = function() {};
                    return(// Check if Type is annotated and use just the given function at n-1 as parameter
                    // e.g. someModule.factory('greeter', ['$window', function(renamed$window) {}]);
                    Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype, isObject(returnedValue = invoke(Type, instance = new Constructor(), locals)) || isFunction(returnedValue) ? returnedValue : instance);
                },
                get: getService,
                annotate: annotate,
                has: function(name) {
                    return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
                }
            };
        }
    }
    /**
 * @ngdoc function
 * @name ng.$anchorScroll
 * @requires $window
 * @requires $location
 * @requires $rootScope
 *
 * @description
 * When called, it checks current value of `$location.hash()` and scroll to related element,
 * according to rules specified in
 * {@link http://dev.w3.org/html5/spec/Overview.html#the-indicated-part-of-the-document Html5 spec}.
 *
 * It also watches the `$location.hash()` and scrolls whenever it changes to match any anchor.
 * This can be disabled by calling `$anchorScrollProvider.disableAutoScrolling()`.
 * 
 * @example
   <example>
     <file name="index.html">
       <div id="scrollArea" ng-controller="ScrollCtrl">
         <a ng-click="gotoBottom()">Go to bottom</a>
         <a id="bottom"></a> You're at the bottom!
       </div>
     </file>
     <file name="script.js">
       function ScrollCtrl($scope, $location, $anchorScroll) {
         $scope.gotoBottom = function (){
           // set the location.hash to the id of
           // the element you wish to scroll to.
           $location.hash('bottom');
           
           // call $anchorScroll()
           $anchorScroll();
         }
       }
     </file>
     <file name="style.css">
       #scrollArea {
         height: 350px;
         overflow: auto;
       }

       #bottom {
         display: block;
         margin-top: 2000px;
       }
     </file>
   </example>
 */ function $AnchorScrollProvider() {
        var autoScrollingEnabled = !0;
        this.disableAutoScrolling = function() {
            autoScrollingEnabled = !1;
        }, this.$get = [
            "$window",
            "$location",
            "$rootScope",
            function($window, $location, $rootScope) {
                var document1 = $window.document;
                function scroll() {
                    var list, result, elm, hash = $location.hash();
                    // empty hash, scroll to the top of the page
                    hash ? (elm = document1.getElementById(hash)) ? elm.scrollIntoView() : (list = document1.getElementsByName(hash), result = null, forEach(list, function(element) {
                        result || "a" !== lowercase(element.nodeName) || (result = element);
                    }), elm = result) ? elm.scrollIntoView() : "top" === hash && $window.scrollTo(0, 0) : $window.scrollTo(0, 0);
                }
                return autoScrollingEnabled && $rootScope.$watch(function() {
                    return $location.hash();
                }, function() {
                    $rootScope.$evalAsync(scroll);
                }), scroll;
            }
        ];
    }
    var $animateMinErr = minErr("$animate"), $AnimateProvider = [
        "$provide",
        function($provide) {
            this.$$selectors = {}, /**
       * @ngdoc function
       * @name ng.$animateProvider#register
       * @methodOf ng.$animateProvider
       *
       * @description
       * Registers a new injectable animation factory function. The factory function produces the
       * animation object which contains callback functions for each event that is expected to be
       * animated.
       *
       *   * `eventFn`: `function(Element, doneFunction)` The element to animate, the `doneFunction`
       *   must be called once the element animation is complete. If a function is returned then the
       *   animation service will use this function to cancel the animation whenever a cancel event is
       *   triggered.
       *
       *
       *<pre>
       *   return {
       *     eventFn : function(element, done) {
       *       //code to run the animation
       *       //once complete, then run done()
       *       return function cancellationFunction() {
       *         //code to cancel the animation
       *       }
       *     }
       *   }
       *</pre>
       *
       * @param {string} name The name of the animation.
       * @param {function} factory The factory function that will be executed to return the animation
       *                           object.
       */ this.register = function(name, factory) {
                var key = name + "-animation";
                if (name && "." != name.charAt(0)) throw $animateMinErr("notcsel", "Expecting class selector starting with '.' got '{0}'.", name);
                this.$$selectors[name.substr(1)] = key, $provide.factory(key, factory);
            }, this.$get = [
                "$timeout",
                function($timeout) {
                    /**
           *
           * @ngdoc object
           * @name ng.$animate
           * @description The $animate service provides rudimentary DOM manipulation functions to
           * insert, remove and move elements within the DOM, as well as adding and removing classes.
           * This service is the core service used by the ngAnimate $animator service which provides
           * high-level animation hooks for CSS and JavaScript.
           *
           * $animate is available in the AngularJS core, however, the ngAnimate module must be included
           * to enable full out animation support. Otherwise, $animate will only perform simple DOM
           * manipulation operations.
           *
           * To learn more about enabling animation support, click here to visit the {@link ngAnimate
           * ngAnimate module page} as well as the {@link ngAnimate.$animate ngAnimate $animate service
           * page}.
           */ return {
                        /**
             *
             * @ngdoc function
             * @name ng.$animate#enter
             * @methodOf ng.$animate
             * @function
             * @description Inserts the element into the DOM either after the `after` element or within
             *   the `parent` element. Once complete, the done() callback will be fired (if provided).
             * @param {jQuery/jqLite element} element the element which will be inserted into the DOM
             * @param {jQuery/jqLite element} parent the parent element which will append the element as
             *   a child (if the after element is not present)
             * @param {jQuery/jqLite element} after the sibling element which will append the element
             *   after itself
             * @param {function=} done callback function that will be called after the element has been
             *   inserted into the DOM
             */ enter: function(element, parent, after, done) {
                            after ? after.after(element) : (parent && parent[0] || (parent = after.parent()), parent.append(element)), done && $timeout(done, 0, !1);
                        },
                        /**
             *
             * @ngdoc function
             * @name ng.$animate#leave
             * @methodOf ng.$animate
             * @function
             * @description Removes the element from the DOM. Once complete, the done() callback will be
             *   fired (if provided).
             * @param {jQuery/jqLite element} element the element which will be removed from the DOM
             * @param {function=} done callback function that will be called after the element has been
             *   removed from the DOM
             */ leave: function(element, done) {
                            element.remove(), done && $timeout(done, 0, !1);
                        },
                        /**
             *
             * @ngdoc function
             * @name ng.$animate#move
             * @methodOf ng.$animate
             * @function
             * @description Moves the position of the provided element within the DOM to be placed
             * either after the `after` element or inside of the `parent` element. Once complete, the
             * done() callback will be fired (if provided).
             *
             * @param {jQuery/jqLite element} element the element which will be moved around within the
             *   DOM
             * @param {jQuery/jqLite element} parent the parent element where the element will be
             *   inserted into (if the after element is not present)
             * @param {jQuery/jqLite element} after the sibling element where the element will be
             *   positioned next to
             * @param {function=} done the callback function (if provided) that will be fired after the
             *   element has been moved to its new position
             */ move: function(element, parent, after, done) {
                            // Do not remove element before insert. Removing will cause data associated with the
                            // element to be dropped. Insert will implicitly do the remove.
                            this.enter(element, parent, after, done);
                        },
                        /**
             *
             * @ngdoc function
             * @name ng.$animate#addClass
             * @methodOf ng.$animate
             * @function
             * @description Adds the provided className CSS class value to the provided element. Once
             * complete, the done() callback will be fired (if provided).
             * @param {jQuery/jqLite element} element the element which will have the className value
             *   added to it
             * @param {string} className the CSS class which will be added to the element
             * @param {function=} done the callback function (if provided) that will be fired after the
             *   className value has been added to the element
             */ addClass: function(element, className, done) {
                            className = isString(className) ? className : isArray(className) ? className.join(" ") : "", forEach(element, function(element) {
                                jqLiteAddClass(element, className);
                            }), done && $timeout(done, 0, !1);
                        },
                        /**
             *
             * @ngdoc function
             * @name ng.$animate#removeClass
             * @methodOf ng.$animate
             * @function
             * @description Removes the provided className CSS class value from the provided element.
             * Once complete, the done() callback will be fired (if provided).
             * @param {jQuery/jqLite element} element the element which will have the className value
             *   removed from it
             * @param {string} className the CSS class which will be removed from the element
             * @param {function=} done the callback function (if provided) that will be fired after the
             *   className value has been removed from the element
             */ removeClass: function(element, className, done) {
                            className = isString(className) ? className : isArray(className) ? className.join(" ") : "", forEach(element, function(element) {
                                jqLiteRemoveClass(element, className);
                            }), done && $timeout(done, 0, !1);
                        },
                        enabled: noop
                    };
                }
            ];
        }
    ];
    /**
   * ! This is a private undocumented service !
   *
   * @name ng.$browser
   * @requires $log
   * @description
   * This object has two goals:
   *
   * - hide all the global state in the browser caused by the window object
   * - abstract away all the browser specific features and inconsistencies
   *
   * For tests we provide {@link ngMock.$browser mock implementation} of the `$browser`
   * service, which can be used for convenient testing of the application without the interaction with
   * the real browser apis.
   */ /**
   * @param {object} window The global window object.
   * @param {object} document jQuery wrapped document.
   * @param {function()} XHR XMLHttpRequest constructor.
   * @param {object} $log console.log or an object with the same interface.
   * @param {object} $sniffer $sniffer service
   */ function Browser(window1, document1, $log, $sniffer) {
        var self = this, rawDocument = document1[0], location = window1.location, history = window1.history, setTimeout1 = window1.setTimeout, clearTimeout = window1.clearTimeout, pendingDeferIds = {};
        self.isMock = !1;
        var outstandingRequestCount = 0, outstandingRequestCallbacks = [];
        /**
     * Executes the `fn` function(supports currying) and decrements the `outstandingRequestCallbacks`
     * counter. If the counter reaches 0, all the `outstandingRequestCallbacks` are executed.
     */ function completeOutstandingRequest(fn) {
            try {
                fn.apply(null, sliceArgs(arguments, 1));
            } finally{
                if (0 == --outstandingRequestCount) for(; outstandingRequestCallbacks.length;)try {
                    outstandingRequestCallbacks.pop()();
                } catch (e) {
                    $log.error(e);
                }
            }
        }
        // TODO(vojta): remove this temporary api
        self.$$completeOutstandingRequest = completeOutstandingRequest, self.$$incOutstandingRequestCount = function() {
            outstandingRequestCount++;
        }, /**
     * @private
     * Note: this method is used only by scenario runner
     * TODO(vojta): prefix this method with $$ ?
     * @param {function()} callback Function that will be called when no outstanding request
     */ self.notifyWhenNoOutstandingRequests = function(callback) {
            // force browser to execute all pollFns - this is needed so that cookies and other pollers fire
            // at some deterministic time in respect to the test runner's actions. Leaving things up to the
            // regular poller would result in flaky tests.
            forEach(pollFns, function(pollFn) {
                pollFn();
            }), 0 === outstandingRequestCount ? callback() : outstandingRequestCallbacks.push(callback);
        };
        //////////////////////////////////////////////////////////////
        // Poll Watcher API
        //////////////////////////////////////////////////////////////
        var pollTimeout, pollFns = [];
        /**
     * @name ng.$browser#addPollFn
     * @methodOf ng.$browser
     *
     * @param {function()} fn Poll function to add
     *
     * @description
     * Adds a function to the list of functions that poller periodically executes,
     * and starts polling if not started yet.
     *
     * @returns {function()} the added function
     */ self.addPollFn = function(fn) {
            var interval, setTimeout2;
            return isUndefined(pollTimeout) && (interval = 100, setTimeout2 = setTimeout1, function check() {
                forEach(pollFns, function(pollFn) {
                    pollFn();
                }), pollTimeout = setTimeout2(check, 100);
            }()), pollFns.push(fn), fn;
        };
        //////////////////////////////////////////////////////////////
        // URL API
        //////////////////////////////////////////////////////////////
        var lastBrowserUrl = location.href, baseElement = document1.find("base"), newLocation = null;
        /**
     * @name ng.$browser#url
     * @methodOf ng.$browser
     *
     * @description
     * GETTER:
     * Without any argument, this method just returns current value of location.href.
     *
     * SETTER:
     * With at least one argument, this method sets url to new value.
     * If html5 history api supported, pushState/replaceState is used, otherwise
     * location.href/location.replace is used.
     * Returns its own instance to allow chaining
     *
     * NOTE: this api is intended for use only by the $location service. Please use the
     * {@link ng.$location $location service} to change url.
     *
     * @param {string} url New url (when used as setter)
     * @param {boolean=} replace Should new url replace current history record ?
     */ self.url = function(url, replace) {
            return(// setter
            (location !== window1.location && (location = window1.location), url) ? lastBrowserUrl != url ? (lastBrowserUrl = url, $sniffer.history ? replace ? history.replaceState(null, "", url) : (history.pushState(null, "", url), // Crazy Opera Bug: http://my.opera.com/community/forums/topic.dml?id=1185462
            baseElement.attr("href", baseElement.attr("href"))) : (newLocation = url, replace ? location.replace(url) : location.href = url), self) : void 0 : newLocation || location.href.replace(/%27/g, "'"));
        };
        var urlChangeListeners = [], urlChangeInit = !1;
        function fireUrlChange() {
            newLocation = null, lastBrowserUrl != self.url() && (lastBrowserUrl = self.url(), forEach(urlChangeListeners, function(listener) {
                listener(self.url());
            }));
        }
        /**
     * @name ng.$browser#onUrlChange
     * @methodOf ng.$browser
     * @TODO(vojta): refactor to use node's syntax for events
     *
     * @description
     * Register callback function that will be called, when url changes.
     *
     * It's only called when the url is changed by outside of angular:
     * - user types different url into address bar
     * - user clicks on history (forward/back) button
     * - user clicks on a link
     *
     * It's not called when url is changed by $browser.url() method
     *
     * The listener gets called with new url as parameter.
     *
     * NOTE: this api is intended for use only by the $location service. Please use the
     * {@link ng.$location $location service} to monitor url changes in angular apps.
     *
     * @param {function(string)} listener Listener function to be called when url changes.
     * @return {function(string)} Returns the registered listener fn - handy if the fn is anonymous.
     */ self.onUrlChange = function(callback) {
            return urlChangeInit || ($sniffer.history && jqLite(window1).on("popstate", fireUrlChange), $sniffer.hashchange ? jqLite(window1).on("hashchange", fireUrlChange) : self.addPollFn(fireUrlChange), urlChangeInit = !0), urlChangeListeners.push(callback), callback;
        }, //////////////////////////////////////////////////////////////
        // Misc API
        //////////////////////////////////////////////////////////////
        /**
     * @name ng.$browser#baseHref
     * @methodOf ng.$browser
     *
     * @description
     * Returns current <base href>
     * (always relative - without domain)
     *
     * @returns {string=} current <base href>
     */ self.baseHref = function() {
            var href = baseElement.attr("href");
            return href ? href.replace(/^https?\:\/\/[^\/]*/, "") : "";
        };
        //////////////////////////////////////////////////////////////
        // Cookies API
        //////////////////////////////////////////////////////////////
        var lastCookies = {}, lastCookieString = "", cookiePath = self.baseHref();
        /**
     * @name ng.$browser#cookies
     * @methodOf ng.$browser
     *
     * @param {string=} name Cookie name
     * @param {string=} value Cookie value
     *
     * @description
     * The cookies method provides a 'private' low level access to browser cookies.
     * It is not meant to be used directly, use the $cookie service instead.
     *
     * The return values vary depending on the arguments that the method was called with as follows:
     *
     * - cookies() -> hash of all cookies, this is NOT a copy of the internal state, so do not modify
     *   it
     * - cookies(name, value) -> set name to value, if value is undefined delete the cookie
     * - cookies(name) -> the same as (name, undefined) == DELETES (no one calls it right now that
     *   way)
     *
     * @returns {Object} Hash of all cookies (if called without any parameter)
     */ self.cookies = function(name, value) {
            /* global escape: false, unescape: false */ var cookieLength, cookieArray, cookie, i, index;
            if (name) undefined === value ? rawDocument.cookie = escape(name) + "=;path=" + cookiePath + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : isString(value) && (cookieLength = (rawDocument.cookie = escape(name) + "=" + escape(value) + ";path=" + cookiePath).length + 1) > 4096 && $log.warn("Cookie '" + name + "' possibly not set or overflowed because it was too large (" + cookieLength + " > 4096 bytes)!");
            else {
                if (rawDocument.cookie !== lastCookieString) for(i = 0, cookieArray = (lastCookieString = rawDocument.cookie).split("; "), lastCookies = {}; i < cookieArray.length; i++)(index = (cookie = cookieArray[i]).indexOf("=")) > 0 && lastCookies[//ignore nameless cookies
                name = unescape(cookie.substring(0, index))] === undefined && (lastCookies[name] = unescape(cookie.substring(index + 1)));
                return lastCookies;
            }
        }, /**
     * @name ng.$browser#defer
     * @methodOf ng.$browser
     * @param {function()} fn A function, who's execution should be deferred.
     * @param {number=} [delay=0] of milliseconds to defer the function execution.
     * @returns {*} DeferId that can be used to cancel the task via `$browser.defer.cancel()`.
     *
     * @description
     * Executes a fn asynchronously via `setTimeout(fn, delay)`.
     *
     * Unlike when calling `setTimeout` directly, in test this function is mocked and instead of using
     * `setTimeout` in tests, the fns are queued in an array, which can be programmatically flushed
     * via `$browser.defer.flush()`.
     *
     */ self.defer = function(fn, delay) {
            var timeoutId;
            return outstandingRequestCount++, pendingDeferIds[timeoutId = setTimeout1(function() {
                delete pendingDeferIds[timeoutId], completeOutstandingRequest(fn);
            }, delay || 0)] = !0, timeoutId;
        }, /**
     * @name ng.$browser#defer.cancel
     * @methodOf ng.$browser.defer
     *
     * @description
     * Cancels a deferred task identified with `deferId`.
     *
     * @param {*} deferId Token returned by the `$browser.defer` function.
     * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully
     *                    canceled.
     */ self.defer.cancel = function(deferId) {
            return !!pendingDeferIds[deferId] && (delete pendingDeferIds[deferId], clearTimeout(deferId), completeOutstandingRequest(noop), !0);
        };
    }
    function $BrowserProvider() {
        this.$get = [
            "$window",
            "$log",
            "$sniffer",
            "$document",
            function($window, $log, $sniffer, $document) {
                return new Browser($window, $document, $log, $sniffer);
            }
        ];
    }
    /**
   * @ngdoc object
   * @name ng.$cacheFactory
   *
   * @description
   * Factory that constructs cache objects and gives access to them.
   *
   * <pre>
   *
   *  var cache = $cacheFactory('cacheId');
   *  expect($cacheFactory.get('cacheId')).toBe(cache);
   *  expect($cacheFactory.get('noSuchCacheId')).not.toBeDefined();
   *
   *  cache.put("key", "value");
   *  cache.put("another key", "another value");
   *
   *  // We've specified no options on creation
   *  expect(cache.info()).toEqual({id: 'cacheId', size: 2});
   *
   * </pre>
   *
   *
   * @param {string} cacheId Name or id of the newly created cache.
   * @param {object=} options Options object that specifies the cache behavior. Properties:
   *
   *   - `{number=}` `capacity` — turns the cache into LRU cache.
   *
   * @returns {object} Newly created cache object with the following set of methods:
   *
   * - `{object}` `info()` — Returns id, size, and options of cache.
   * - `{{*}}` `put({string} key, {*} value)` — Puts a new key-value pair into the cache and returns
   *   it.
   * - `{{*}}` `get({string} key)` — Returns cached value for `key` or undefined for cache miss.
   * - `{void}` `remove({string} key)` — Removes a key-value pair from the cache.
   * - `{void}` `removeAll()` — Removes all cached values.
   * - `{void}` `destroy()` — Removes references to this cache from $cacheFactory.
   *
   */ function $CacheFactoryProvider() {
        this.$get = function() {
            var caches = {};
            function cacheFactory(cacheId, options) {
                if (cacheId in caches) throw minErr("$cacheFactory")("iid", "CacheId '{0}' is already taken!", cacheId);
                var size = 0, stats = extend({}, options, {
                    id: cacheId
                }), data = {}, capacity = options && options.capacity || Number.MAX_VALUE, lruHash = {}, freshEnd = null, staleEnd = null;
                return caches[cacheId] = {
                    put: function(key, value) {
                        if (refresh(lruHash[key] || (lruHash[key] = {
                            key: key
                        })), !isUndefined(value)) return !(key in data) && size++, data[key] = value, size > capacity && this.remove(staleEnd.key), value;
                    },
                    get: function(key) {
                        var lruEntry = lruHash[key];
                        if (lruEntry) return refresh(lruEntry), data[key];
                    },
                    remove: function(key) {
                        var lruEntry = lruHash[key];
                        lruEntry && (lruEntry == freshEnd && (freshEnd = lruEntry.p), lruEntry == staleEnd && (staleEnd = lruEntry.n), link(lruEntry.n, lruEntry.p), delete lruHash[key], delete data[key], size--);
                    },
                    removeAll: function() {
                        data = {}, size = 0, lruHash = {}, freshEnd = staleEnd = null;
                    },
                    destroy: function() {
                        data = null, stats = null, lruHash = null, delete caches[cacheId];
                    },
                    info: function() {
                        return extend({}, stats, {
                            size: size
                        });
                    }
                };
                /**
         * makes the `entry` the freshEnd of the LRU linked list
         */ function refresh(entry) {
                    entry != freshEnd && (staleEnd ? staleEnd == entry && (staleEnd = entry.n) : staleEnd = entry, link(entry.n, entry.p), link(entry, freshEnd), (freshEnd = entry).n = null);
                }
                /**
         * bidirectionally links two entries of the LRU linked list
         */ function link(nextEntry, prevEntry) {
                    nextEntry != prevEntry && (nextEntry && (nextEntry.p = prevEntry), prevEntry && (prevEntry.n = nextEntry));
                }
            }
            return(/**
       * @ngdoc method
       * @name ng.$cacheFactory#info
       * @methodOf ng.$cacheFactory
       *
       * @description
       * Get information about all the of the caches that have been created
       *
       * @returns {Object} - key-value map of `cacheId` to the result of calling `cache#info`
       */ cacheFactory.info = function() {
                var info = {};
                return forEach(caches, function(cache, cacheId) {
                    info[cacheId] = cache.info();
                }), info;
            }, /**
       * @ngdoc method
       * @name ng.$cacheFactory#get
       * @methodOf ng.$cacheFactory
       *
       * @description
       * Get access to a cache object by the `cacheId` used when it was created.
       *
       * @param {string} cacheId Name or id of a cache to access.
       * @returns {object} Cache object identified by the cacheId or undefined if no such cache.
       */ cacheFactory.get = function(cacheId) {
                return caches[cacheId];
            }, cacheFactory);
        };
    }
    /**
   * @ngdoc object
   * @name ng.$templateCache
   *
   * @description
   * The first time a template is used, it is loaded in the template cache for quick retrieval. You
   * can load templates directly into the cache in a `script` tag, or by consuming the
   * `$templateCache` service directly.
   *
   * Adding via the `script` tag:
   * <pre>
   * <html ng-app>
   * <head>
   * <script type="text/ng-template" id="templateId.html">
   *   This is the content of the template
   * </script>
   * </head>
   *   ...
   * </html>
   * </pre>
   *
   * **Note:** the `script` tag containing the template does not need to be included in the `head` of
   * the document, but it must be below the `ng-app` definition.
   *
   * Adding via the $templateCache service:
   *
   * <pre>
   * var myApp = angular.module('myApp', []);
   * myApp.run(function($templateCache) {
   *   $templateCache.put('templateId.html', 'This is the content of the template');
   * });
   * </pre>
   *
   * To retrieve the template later, simply use it in your HTML:
   * <pre>
   * <div ng-include=" 'templateId.html' "></div>
   * </pre>
   *
   * or get it via Javascript:
   * <pre>
   * $templateCache.get('templateId.html')
   * </pre>
   *
   * See {@link ng.$cacheFactory $cacheFactory}.
   *
   */ function $TemplateCacheProvider() {
        this.$get = [
            "$cacheFactory",
            function($cacheFactory) {
                return $cacheFactory("templates");
            }
        ];
    }
    /* ! VARIABLE/FUNCTION NAMING CONVENTIONS THAT APPLY TO THIS FILE!
   *
   * DOM-related variables:
   *
   * - "node" - DOM Node
   * - "element" - DOM Element or Node
   * - "$node" or "$element" - jqLite-wrapped node or element
   *
   *
   * Compiler related stuff:
   *
   * - "linkFn" - linking fn of a single directive
   * - "nodeLinkFn" - function that aggregates all linking fns for a particular node
   * - "childLinkFn" -  function that aggregates all linking fns for child nodes of a particular node
   * - "compositeLinkFn" - function that aggregates all linking fns for a compilation root (nodeList)
   */ /**
 * @ngdoc function
 * @name ng.$compile
 * @function
 *
 * @description
 * Compiles a piece of HTML string or DOM into a template and produces a template function, which
 * can then be used to link {@link ng.$rootScope.Scope `scope`} and the template together.
 *
 * The compilation is a process of walking the DOM tree and matching DOM elements to
 * {@link ng.$compileProvider#methods_directive directives}.
 *
 * <div class="alert alert-warning">
 * **Note:** This document is an in-depth reference of all directive options.
 * For a gentle introduction to directives with examples of common use cases,
 * see the {@link guide/directive directive guide}.
 * </div>
 *
 * ## Comprehensive Directive API
 *
 * There are many different options for a directive.
 *
 * The difference resides in the return value of the factory function.
 * You can either return a "Directive Definition Object" (see below) that defines the directive properties,
 * or just the `postLink` function (all other properties will have the default values).
 *
 * <div class="alert alert-success">
 * **Best Practice:** It's recommended to use the "directive definition object" form.
 * </div>
 *
 * Here's an example directive declared with a Directive Definition Object:
 *
 * <pre>
 *   var myModule = angular.module(...);
 *
 *   myModule.directive('directiveName', function factory(injectables) {
 *     var directiveDefinitionObject = {
 *       priority: 0,
 *       template: '<div></div>', // or // function(tElement, tAttrs) { ... },
 *       // or
 *       // templateUrl: 'directive.html', // or // function(tElement, tAttrs) { ... },
 *       replace: false,
 *       transclude: false,
 *       restrict: 'A',
 *       scope: false,
 *       controller: function($scope, $element, $attrs, $transclude, otherInjectables) { ... },
 *       require: 'siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
 *       compile: function compile(tElement, tAttrs, transclude) {
 *         return {
 *           pre: function preLink(scope, iElement, iAttrs, controller) { ... },
 *           post: function postLink(scope, iElement, iAttrs, controller) { ... }
 *         }
 *         // or
 *         // return function postLink( ... ) { ... }
 *       },
 *       // or
 *       // link: {
 *       //  pre: function preLink(scope, iElement, iAttrs, controller) { ... },
 *       //  post: function postLink(scope, iElement, iAttrs, controller) { ... }
 *       // }
 *       // or
 *       // link: function postLink( ... ) { ... }
 *     };
 *     return directiveDefinitionObject;
 *   });
 * </pre>
 *
 * <div class="alert alert-warning">
 * **Note:** Any unspecified options will use the default value. You can see the default values below.
 * </div>
 *
 * Therefore the above can be simplified as:
 *
 * <pre>
 *   var myModule = angular.module(...);
 *
 *   myModule.directive('directiveName', function factory(injectables) {
 *     var directiveDefinitionObject = {
 *       link: function postLink(scope, iElement, iAttrs) { ... }
 *     };
 *     return directiveDefinitionObject;
 *     // or
 *     // return function postLink(scope, iElement, iAttrs) { ... }
 *   });
 * </pre>
 *
 *
 *
 * ### Directive Definition Object
 *
 * The directive definition object provides instructions to the {@link api/ng.$compile
 * compiler}. The attributes are:
 *
 * #### `priority`
 * When there are multiple directives defined on a single DOM element, sometimes it
 * is necessary to specify the order in which the directives are applied. The `priority` is used
 * to sort the directives before their `compile` functions get called. Priority is defined as a
 * number. Directives with greater numerical `priority` are compiled first. Pre-link functions
 * are also run in priority order, but post-link functions are run in reverse order. The order
 * of directives with the same priority is undefined. The default priority is `0`.
 *
 * #### `terminal`
 * If set to true then the current `priority` will be the last set of directives
 * which will execute (any directives at the current priority will still execute
 * as the order of execution on same `priority` is undefined).
 *
 * #### `scope`
 * **If set to `true`,** then a new scope will be created for this directive. If multiple directives on the
 * same element request a new scope, only one new scope is created. The new scope rule does not
 * apply for the root of the template since the root of the template always gets a new scope.
 *
 * **If set to `{}` (object hash),** then a new "isolate" scope is created. The 'isolate' scope differs from
 * normal scope in that it does not prototypically inherit from the parent scope. This is useful
 * when creating reusable components, which should not accidentally read or modify data in the
 * parent scope.
 *
 * The 'isolate' scope takes an object hash which defines a set of local scope properties
 * derived from the parent scope. These local properties are useful for aliasing values for
 * templates. Locals definition is a hash of local scope property to its source:
 *
 * * `@` or `@attr` - bind a local scope property to the value of DOM attribute. The result is
 *   always a string since DOM attributes are strings. If no `attr` name is specified  then the
 *   attribute name is assumed to be the same as the local name.
 *   Given `<widget my-attr="hello {{name}}">` and widget definition
 *   of `scope: { localName:'@myAttr' }`, then widget scope property `localName` will reflect
 *   the interpolated value of `hello {{name}}`. As the `name` attribute changes so will the
 *   `localName` property on the widget scope. The `name` is read from the parent scope (not
 *   component scope).
 *
 * * `=` or `=attr` - set up bi-directional binding between a local scope property and the
 *   parent scope property of name defined via the value of the `attr` attribute. If no `attr`
 *   name is specified then the attribute name is assumed to be the same as the local name.
 *   Given `<widget my-attr="parentModel">` and widget definition of
 *   `scope: { localModel:'=myAttr' }`, then widget scope property `localModel` will reflect the
 *   value of `parentModel` on the parent scope. Any changes to `parentModel` will be reflected
 *   in `localModel` and any changes in `localModel` will reflect in `parentModel`. If the parent
 *   scope property doesn't exist, it will throw a NON_ASSIGNABLE_MODEL_EXPRESSION exception. You
 *   can avoid this behavior using `=?` or `=?attr` in order to flag the property as optional.
 *
 * * `&` or `&attr` - provides a way to execute an expression in the context of the parent scope.
 *   If no `attr` name is specified then the attribute name is assumed to be the same as the
 *   local name. Given `<widget my-attr="count = count + value">` and widget definition of
 *   `scope: { localFn:'&myAttr' }`, then isolate scope property `localFn` will point to
 *   a function wrapper for the `count = count + value` expression. Often it's desirable to
 *   pass data from the isolated scope via an expression and to the parent scope, this can be
 *   done by passing a map of local variable names and values into the expression wrapper fn.
 *   For example, if the expression is `increment(amount)` then we can specify the amount value
 *   by calling the `localFn` as `localFn({amount: 22})`.
 *
 *
 *
 * #### `controller`
 * Controller constructor function. The controller is instantiated before the
 * pre-linking phase and it is shared with other directives (see
 * `require` attribute). This allows the directives to communicate with each other and augment
 * each other's behavior. The controller is injectable (and supports bracket notation) with the following locals:
 *
 * * `$scope` - Current scope associated with the element
 * * `$element` - Current element
 * * `$attrs` - Current attributes object for the element
 * * `$transclude` - A transclude linking function pre-bound to the correct transclusion scope.
 *    The scope can be overridden by an optional first argument.
 *   `function([scope], cloneLinkingFn)`.
 *
 *
 * #### `require`
 * Require another directive and inject its controller as the fourth argument to the linking function. The
 * `require` takes a string name (or array of strings) of the directive(s) to pass in. If an array is used, the
 * injected argument will be an array in corresponding order. If no such directive can be
 * found, or if the directive does not have a controller, then an error is raised. The name can be prefixed with:
 *
 * * (no prefix) - Locate the required controller on the current element. Throw an error if not found.
 * * `?` - Attempt to locate the required controller or pass `null` to the `link` fn if not found.
 * * `^` - Locate the required controller by searching the element's parents. Throw an error if not found.
 * * `?^` - Attempt to locate the required controller by searching the element's parents or pass `null` to the
 *   `link` fn if not found.
 *
 *
 * #### `controllerAs`
 * Controller alias at the directive scope. An alias for the controller so it
 * can be referenced at the directive template. The directive needs to define a scope for this
 * configuration to be used. Useful in the case when directive is used as component.
 *
 *
 * #### `restrict`
 * String of subset of `EACM` which restricts the directive to a specific directive
 * declaration style. If omitted, the default (attributes only) is used.
 *
 * * `E` - Element name: `<my-directive></my-directive>`
 * * `A` - Attribute (default): `<div my-directive="exp"></div>`
 * * `C` - Class: `<div class="my-directive: exp;"></div>`
 * * `M` - Comment: `<!-- directive: my-directive exp -->`
 *
 *
 * #### `template`
 * replace the current element with the contents of the HTML. The replacement process
 * migrates all of the attributes / classes from the old element to the new one. See the
 * {@link guide/directive#creating-custom-directives_creating-directives_template-expanding-directive
 * Directives Guide} for an example.
 *
 * You can specify `template` as a string representing the template or as a function which takes
 * two arguments `tElement` and `tAttrs` (described in the `compile` function api below) and
 * returns a string value representing the template.
 *
 *
 * #### `templateUrl`
 * Same as `template` but the template is loaded from the specified URL. Because
 * the template loading is asynchronous the compilation/linking is suspended until the template
 * is loaded.
 *
 * You can specify `templateUrl` as a string representing the URL or as a function which takes two
 * arguments `tElement` and `tAttrs` (described in the `compile` function api below) and returns
 * a string value representing the url.  In either case, the template URL is passed through {@link
 * api/ng.$sce#methods_getTrustedResourceUrl $sce.getTrustedResourceUrl}.
 *
 *
 * #### `replace`
 * specify where the template should be inserted. Defaults to `false`.
 *
 * * `true` - the template will replace the current element.
 * * `false` - the template will replace the contents of the current element.
 *
 *
 * #### `transclude`
 * compile the content of the element and make it available to the directive.
 * Typically used with {@link api/ng.directive:ngTransclude
 * ngTransclude}. The advantage of transclusion is that the linking function receives a
 * transclusion function which is pre-bound to the correct scope. In a typical setup the widget
 * creates an `isolate` scope, but the transclusion is not a child, but a sibling of the `isolate`
 * scope. This makes it possible for the widget to have private state, and the transclusion to
 * be bound to the parent (pre-`isolate`) scope.
 *
 * * `true` - transclude the content of the directive.
 * * `'element'` - transclude the whole element including any directives defined at lower priority.
 *
 *
 * #### `compile`
 *
 * <pre>
 *   function compile(tElement, tAttrs, transclude) { ... }
 * </pre>
 *
 * The compile function deals with transforming the template DOM. Since most directives do not do
 * template transformation, it is not used often. Examples that require compile functions are
 * directives that transform template DOM, such as {@link
 * api/ng.directive:ngRepeat ngRepeat}, or load the contents
 * asynchronously, such as {@link api/ngRoute.directive:ngView ngView}. The
 * compile function takes the following arguments.
 *
 *   * `tElement` - template element - The element where the directive has been declared. It is
 *     safe to do template transformation on the element and child elements only.
 *
 *   * `tAttrs` - template attributes - Normalized list of attributes declared on this element shared
 *     between all directive compile functions.
 *
 *   * `transclude` -  [*DEPRECATED*!] A transclude linking function: `function(scope, cloneLinkingFn)`
 *
 * <div class="alert alert-warning">
 * **Note:** The template instance and the link instance may be different objects if the template has
 * been cloned. For this reason it is **not** safe to do anything other than DOM transformations that
 * apply to all cloned DOM nodes within the compile function. Specifically, DOM listener registration
 * should be done in a linking function rather than in a compile function.
 * </div>
 *
 * <div class="alert alert-error">
 * **Note:** The `transclude` function that is passed to the compile function is deprecated, as it
 *   e.g. does not know about the right outer scope. Please use the transclude function that is passed
 *   to the link function instead.
 * </div>

 * A compile function can have a return value which can be either a function or an object.
 *
 * * returning a (post-link) function - is equivalent to registering the linking function via the
 *   `link` property of the config object when the compile function is empty.
 *
 * * returning an object with function(s) registered via `pre` and `post` properties - allows you to
 *   control when a linking function should be called during the linking phase. See info about
 *   pre-linking and post-linking functions below.
 *
 *
 * #### `link`
 * This property is used only if the `compile` property is not defined.
 *
 * <pre>
 *   function link(scope, iElement, iAttrs, controller, transcludeFn) { ... }
 * </pre>
 *
 * The link function is responsible for registering DOM listeners as well as updating the DOM. It is
 * executed after the template has been cloned. This is where most of the directive logic will be
 * put.
 *
 *   * `scope` - {@link api/ng.$rootScope.Scope Scope} - The scope to be used by the
 *     directive for registering {@link api/ng.$rootScope.Scope#methods_$watch watches}.
 *
 *   * `iElement` - instance element - The element where the directive is to be used. It is safe to
 *     manipulate the children of the element only in `postLink` function since the children have
 *     already been linked.
 *
 *   * `iAttrs` - instance attributes - Normalized list of attributes declared on this element shared
 *     between all directive linking functions.
 *
 *   * `controller` - a controller instance - A controller instance if at least one directive on the
 *     element defines a controller. The controller is shared among all the directives, which allows
 *     the directives to use the controllers as a communication channel.
 *
 *   * `transcludeFn` - A transclude linking function pre-bound to the correct transclusion scope.
 *     The scope can be overridden by an optional first argument. This is the same as the `$transclude`
 *     parameter of directive controllers.
 *     `function([scope], cloneLinkingFn)`.
 *
 *
 * #### Pre-linking function
 *
 * Executed before the child elements are linked. Not safe to do DOM transformation since the
 * compiler linking function will fail to locate the correct elements for linking.
 *
 * #### Post-linking function
 *
 * Executed after the child elements are linked. It is safe to do DOM transformation in the post-linking function.
 *
 * <a name="Attributes"></a>
 * ### Attributes
 *
 * The {@link api/ng.$compile.directive.Attributes Attributes} object - passed as a parameter in the
 * `link()` or `compile()` functions. It has a variety of uses.
 *
 * accessing *Normalized attribute names:*
 * Directives like 'ngBind' can be expressed in many ways: 'ng:bind', `data-ng-bind`, or 'x-ng-bind'.
 * the attributes object allows for normalized access to
 *   the attributes.
 *
 * * *Directive inter-communication:* All directives share the same instance of the attributes
 *   object which allows the directives to use the attributes object as inter directive
 *   communication.
 *
 * * *Supports interpolation:* Interpolation attributes are assigned to the attribute object
 *   allowing other directives to read the interpolated value.
 *
 * * *Observing interpolated attributes:* Use `$observe` to observe the value changes of attributes
 *   that contain interpolation (e.g. `src="{{bar}}"`). Not only is this very efficient but it's also
 *   the only way to easily get the actual value because during the linking phase the interpolation
 *   hasn't been evaluated yet and so the value is at this time set to `undefined`.
 *
 * <pre>
 * function linkingFn(scope, elm, attrs, ctrl) {
 *   // get the attribute value
 *   console.log(attrs.ngModel);
 *
 *   // change the attribute
 *   attrs.$set('ngModel', 'new value');
 *
 *   // observe changes to interpolated attribute
 *   attrs.$observe('ngModel', function(value) {
 *     console.log('ngModel has changed value to ' + value);
 *   });
 * }
 * </pre>
 *
 * Below is an example using `$compileProvider`.
 *
 * <div class="alert alert-warning">
 * **Note**: Typically directives are registered with `module.directive`. The example below is
 * to illustrate how `$compile` works.
 * </div>
 *
 <doc:example module="compile">
   <doc:source>
    <script>
      angular.module('compile', [], function($compileProvider) {
        // configure new 'compile' directive by passing a directive
        // factory function. The factory function injects the '$compile'
        $compileProvider.directive('compile', function($compile) {
          // directive factory creates a link function
          return function(scope, element, attrs) {
            scope.$watch(
              function(scope) {
                 // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
              },
              function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
              }
            );
          };
        })
      });

      function Ctrl($scope) {
        $scope.name = 'Angular';
        $scope.html = 'Hello {{name}}';
      }
    </script>
    <div ng-controller="Ctrl">
      <input ng-model="name"> <br>
      <textarea ng-model="html"></textarea> <br>
      <div compile="html"></div>
    </div>
   </doc:source>
   <doc:scenario>
     it('should auto compile', function() {
       expect(element('div[compile]').text()).toBe('Hello Angular');
       input('html').enter('{{name}}!');
       expect(element('div[compile]').text()).toBe('Angular!');
     });
   </doc:scenario>
 </doc:example>

 *
 *
 * @param {string|DOMElement} element Element or HTML string to compile into a template function.
 * @param {function(angular.Scope[, cloneAttachFn]} transclude function available to directives.
 * @param {number} maxPriority only apply directives lower then given priority (Only effects the
 *                 root element(s), not their children)
 * @returns {function(scope[, cloneAttachFn])} a link function which is used to bind template
 * (a DOM element/tree) to a scope. Where:
 *
 *  * `scope` - A {@link ng.$rootScope.Scope Scope} to bind to.
 *  * `cloneAttachFn` - If `cloneAttachFn` is provided, then the link function will clone the
 *  `template` and call the `cloneAttachFn` function allowing the caller to attach the
 *  cloned elements to the DOM document at the appropriate place. The `cloneAttachFn` is
 *  called as: <br> `cloneAttachFn(clonedElement, scope)` where:
 *
 *      * `clonedElement` - is a clone of the original `element` passed into the compiler.
 *      * `scope` - is the current scope with which the linking function is working with.
 *
 * Calling the linking function returns the element of the template. It is either the original
 * element passed in, or the clone of the element if the `cloneAttachFn` is provided.
 *
 * After linking the view is not updated until after a call to $digest which typically is done by
 * Angular automatically.
 *
 * If you need access to the bound view, there are two ways to do it:
 *
 * - If you are not asking the linking function to clone the template, create the DOM element(s)
 *   before you send them to the compiler and keep this reference around.
 *   <pre>
 *     var element = $compile('<p>{{total}}</p>')(scope);
 *   </pre>
 *
 * - if on the other hand, you need the element to be cloned, the view reference from the original
 *   example would not point to the clone, but rather to the original template that was cloned. In
 *   this case, you can access the clone via the cloneAttachFn:
 *   <pre>
 *     var templateHTML = angular.element('<p>{{total}}</p>'),
 *         scope = ....;
 *
 *     var clonedElement = $compile(templateHTML)(scope, function(clonedElement, scope) {
 *       //attach the clone to DOM document at the right place
 *     });
 *
 *     //now we have reference to the cloned DOM via `clone`
 *   </pre>
 *
 *
 * For information on how the compiler works, see the
 * {@link guide/compiler Angular HTML Compiler} section of the Developer Guide.
 */ var $compileMinErr = minErr("$compile");
    function $CompileProvider($provide, $$sanitizeUriProvider) {
        var hasDirectives = {}, Suffix = "Directive", COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/, CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/, EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
        /**
     * @ngdoc function
     * @name ng.$compileProvider#directive
     * @methodOf ng.$compileProvider
     * @function
     *
     * @description
     * Register a new directive with the compiler.
     *
     * @param {string|Object} name Name of the directive in camel-case (i.e. <code>ngBind</code> which
     *    will match as <code>ng-bind</code>), or an object map of directives where the keys are the
     *    names and the values are the factories.
     * @param {function|Array} directiveFactory An injectable directive factory function. See
     *    {@link guide/directive} for more info.
     * @returns {ng.$compileProvider} Self for chaining.
     */ this.directive = function registerDirective(name, directiveFactory) {
            return assertNotHasOwnProperty(name, "directive"), isString(name) ? (assertArg(directiveFactory, "directiveFactory"), hasDirectives.hasOwnProperty(name) || (hasDirectives[name] = [], $provide.factory(name + Suffix, [
                "$injector",
                "$exceptionHandler",
                function($injector, $exceptionHandler) {
                    var directives = [];
                    return forEach(hasDirectives[name], function(directiveFactory, index) {
                        try {
                            var directive = $injector.invoke(directiveFactory);
                            isFunction(directive) ? directive = {
                                compile: valueFn(directive)
                            } : !directive.compile && directive.link && (directive.compile = valueFn(directive.link)), directive.priority = directive.priority || 0, directive.index = index, directive.name = directive.name || name, directive.require = directive.require || directive.controller && directive.name, directive.restrict = directive.restrict || "A", directives.push(directive);
                        } catch (e) {
                            $exceptionHandler(e);
                        }
                    }), directives;
                }
            ])), hasDirectives[name].push(directiveFactory)) : forEach(name, reverseParams(registerDirective)), this;
        }, /**
     * @ngdoc function
     * @name ng.$compileProvider#aHrefSanitizationWhitelist
     * @methodOf ng.$compileProvider
     * @function
     *
     * @description
     * Retrieves or overrides the default regular expression that is used for whitelisting of safe
     * urls during a[href] sanitization.
     *
     * The sanitization is a security measure aimed at prevent XSS attacks via html links.
     *
     * Any url about to be assigned to a[href] via data-binding is first normalized and turned into
     * an absolute url. Afterwards, the url is matched against the `aHrefSanitizationWhitelist`
     * regular expression. If a match is found, the original url is written into the dom. Otherwise,
     * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
     *
     * @param {RegExp=} regexp New regexp to whitelist urls with.
     * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
     *    chaining otherwise.
     */ this.aHrefSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.aHrefSanitizationWhitelist();
        }, /**
     * @ngdoc function
     * @name ng.$compileProvider#imgSrcSanitizationWhitelist
     * @methodOf ng.$compileProvider
     * @function
     *
     * @description
     * Retrieves or overrides the default regular expression that is used for whitelisting of safe
     * urls during img[src] sanitization.
     *
     * The sanitization is a security measure aimed at prevent XSS attacks via html links.
     *
     * Any url about to be assigned to img[src] via data-binding is first normalized and turned into
     * an absolute url. Afterwards, the url is matched against the `imgSrcSanitizationWhitelist`
     * regular expression. If a match is found, the original url is written into the dom. Otherwise,
     * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
     *
     * @param {RegExp=} regexp New regexp to whitelist urls with.
     * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
     *    chaining otherwise.
     */ this.imgSrcSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
        }, this.$get = [
            "$injector",
            "$interpolate",
            "$exceptionHandler",
            "$http",
            "$templateCache",
            "$parse",
            "$controller",
            "$rootScope",
            "$document",
            "$sce",
            "$animate",
            "$$sanitizeUri",
            function($injector, $interpolate, $exceptionHandler, $http, $templateCache, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
                var Attributes = function(element, attr) {
                    this.$$element = element, this.$attr = attr || {};
                };
                Attributes.prototype = {
                    $normalize: directiveNormalize,
                    /**
           * @ngdoc function
           * @name ng.$compile.directive.Attributes#$addClass
           * @methodOf ng.$compile.directive.Attributes
           * @function
           *
           * @description
           * Adds the CSS class value specified by the classVal parameter to the element. If animations
           * are enabled then an animation will be triggered for the class addition.
           *
           * @param {string} classVal The className value that will be added to the element
           */ $addClass: function(classVal) {
                        classVal && classVal.length > 0 && $animate.addClass(this.$$element, classVal);
                    },
                    /**
           * @ngdoc function
           * @name ng.$compile.directive.Attributes#$removeClass
           * @methodOf ng.$compile.directive.Attributes
           * @function
           *
           * @description
           * Removes the CSS class value specified by the classVal parameter from the element. If
           * animations are enabled then an animation will be triggered for the class removal.
           *
           * @param {string} classVal The className value that will be removed from the element
           */ $removeClass: function(classVal) {
                        classVal && classVal.length > 0 && $animate.removeClass(this.$$element, classVal);
                    },
                    /**
           * @ngdoc function
           * @name ng.$compile.directive.Attributes#$updateClass
           * @methodOf ng.$compile.directive.Attributes
           * @function
           *
           * @description
           * Adds and removes the appropriate CSS class values to the element based on the difference
           * between the new and old CSS class values (specified as newClasses and oldClasses).
           *
           * @param {string} newClasses The current CSS className value
           * @param {string} oldClasses The former CSS className value
           */ $updateClass: function(newClasses, oldClasses) {
                        this.$removeClass(tokenDifference(oldClasses, newClasses)), this.$addClass(tokenDifference(newClasses, oldClasses));
                    },
                    /**
           * Set a normalized attribute on the element in a way such that all directives
           * can share the attribute. This function properly handles boolean attributes.
           * @param {string} key Normalized key. (ie ngAttribute)
           * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
           * @param {boolean=} writeAttr If false, does not write the value to DOM element attribute.
           *     Defaults to true.
           * @param {string=} attrName Optional none normalized name. Defaults to key.
           */ $set: function(key, value, writeAttr, attrName) {
                        // TODO: decide whether or not to throw an error if "class"
                        //is set through this function since it may cause $updateClass to
                        //become unstable.
                        var nodeName, booleanKey = getBooleanAttrName(this.$$element[0], key);
                        booleanKey && (this.$$element.prop(key, value), attrName = booleanKey), this[key] = value, attrName ? this.$attr[key] = attrName : (attrName = this.$attr[key]) || (this.$attr[key] = attrName = snake_case(key, "-")), ("A" === (nodeName = nodeName_(this.$$element)) && "href" === key || "IMG" === nodeName && "src" === key) && (this[key] = value = $$sanitizeUri(value, "src" === key)), !1 !== writeAttr && (null == value ? this.$$element.removeAttr(attrName) : this.$$element.attr(attrName, value));
                        // fire observers
                        var $$observers = this.$$observers;
                        $$observers && forEach($$observers[key], function(fn) {
                            try {
                                fn(value);
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                        });
                    },
                    /**
       * @ngdoc function
       * @name ng.$compile.directive.Attributes#$observe
       * @methodOf ng.$compile.directive.Attributes
       * @function
       *
       * @description
       * Observes an interpolated attribute.
       *
       * The observer function will be invoked once during the next `$digest` following
       * compilation. The observer is then invoked whenever the interpolated value
       * changes.
       *
       * @param {string} key Normalized key. (ie ngAttribute) .
       * @param {function(interpolatedValue)} fn Function that will be called whenever
                the interpolated value of the attribute changes.
       *        See the {@link guide/directive#Attributes Directives} guide for more info.
       * @returns {function()} the `fn` parameter.
       */ $observe: function(key, fn) {
                        var attrs = this, $$observers = attrs.$$observers || (attrs.$$observers = {}), listeners = $$observers[key] || ($$observers[key] = []);
                        return listeners.push(fn), $rootScope.$evalAsync(function() {
                            listeners.$$inter || // no one registered attribute interpolation function, so lets call it manually
                            fn(attrs[key]);
                        }), fn;
                    }
                };
                var startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), denormalizeTemplate = "{{" == startSymbol || "}}" == endSymbol ? identity : function(template) {
                    return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
                }, NG_ATTR_BINDING = /^ngAttr[A-Z]/;
                return compile;
                //================================
                function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
                    $compileNodes instanceof jqLite || // jquery always rewraps, whereas we need to preserve the original selector so that we can
                    // modify it.
                    ($compileNodes = jqLite($compileNodes)), // We can not compile top level text elements since text nodes can be merged and we will
                    // not be able to attach scope data to them, so we will wrap them in <span>
                    forEach($compileNodes, function(node, index) {
                        3 /* text node */  == node.nodeType && node.nodeValue.match(/\S+/) && ($compileNodes[index] = node = jqLite(node).wrap("<span></span>").parent()[0]);
                    });
                    var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
                    return function(scope, cloneConnectFn, transcludeControllers) {
                        assertArg(scope, "scope");
                        // important!!: we must call our jqLite.clone() since the jQuery one is trying to be smart
                        // and sometimes changes the structure of the DOM.
                        var $linkNode = cloneConnectFn ? JQLitePrototype.clone.call($compileNodes) // IMPORTANT!!!
                         : $compileNodes;
                        forEach(transcludeControllers, function(instance, name) {
                            $linkNode.data("$" + name + "Controller", instance);
                        });
                        // Attach scope only to non-text nodes.
                        for(var i = 0, ii = $linkNode.length; i < ii; i++){
                            var node = $linkNode[i];
                            (1 /* element */  == node.nodeType || 9 /* document */  == node.nodeType) && $linkNode.eq(i).data("$scope", scope);
                        }
                        return safeAddClass($linkNode, "ng-scope"), cloneConnectFn && cloneConnectFn($linkNode, scope), compositeLinkFn && compositeLinkFn(scope, $linkNode, $linkNode), $linkNode;
                    };
                }
                function safeAddClass($element, className) {
                    try {
                        $element.addClass(className);
                    } catch (e) {
                    // ignore, since it means that we are trying to set class on
                    // SVG element, where class name is read-only.
                    }
                }
                /**
         * Compile function matches each node in nodeList against the directives. Once all directives
         * for a particular node are collected their compile functions are executed. The compile
         * functions return values - the linking functions - are combined into a composite linking
         * function, which is the a linking function for the node.
         *
         * @param {NodeList} nodeList an array of nodes or NodeList to compile
         * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the
         *        scope argument is auto-generated to the new child of the transcluded parent scope.
         * @param {DOMElement=} $rootElement If the nodeList is the root of the compilation tree then
         *        the rootElement must be set the jqLite collection of the compile root. This is
         *        needed so that the jqLite collection items can be replaced with widgets.
         * @param {number=} max directive priority
         * @returns {?function} A composite linking function of all of the matched directives or null.
         */ function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
                    for(var nodeLinkFn, childLinkFn, directives, attrs, linkFnFound, linkFns = [], i = 0; i < nodeList.length; i++)attrs = new Attributes(), childLinkFn = (nodeLinkFn = // we must always refer to nodeList[i] since the nodes can be replaced underneath us.
                    (directives = collectDirectives(nodeList[i], [], attrs, 0 === i ? maxPriority : undefined, ignoreDirective)).length ? /**
         * Once the directives have been collected, their compile functions are executed. This method
         * is responsible for inlining directive templates as well as terminating the application
         * of the directives if the terminal directive has been reached.
         *
         * @param {Array} directives Array of collected directives to execute their compile function.
         *        this needs to be pre-sorted by priority order.
         * @param {Node} compileNode The raw DOM node to apply the compile functions to
         * @param {Object} templateAttrs The shared attribute function
         * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the
         *                                                  scope argument is auto-generated to the new
         *                                                  child of the transcluded parent scope.
         * @param {JQLite} jqCollection If we are working on the root of the compile tree then this
         *                              argument has the root jqLite array so that we can replace nodes
         *                              on it.
         * @param {Object=} originalReplaceDirective An optional directive that will be ignored when
         *                                           compiling the transclusion.
         * @param {Array.<Function>} preLinkFns
         * @param {Array.<Function>} postLinkFns
         * @param {Object} previousCompileContext Context used for previous compilation of the current
         *                                        node
         * @returns linkFn
         */ function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
                        // executes all directives on the current element
                        for(var newScopeDirective, directive, directiveName, $template, linkFn, directiveValue, terminalPriority = -Number.MAX_VALUE, controllerDirectives = (previousCompileContext = previousCompileContext || {}).controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = !1, hasElementTranscludeDirective = !1, $compileNode = templateAttrs.$$element = jqLite(compileNode), replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, i = 0, ii = directives.length; i < ii; i++){
                            var attrStart = (directive = directives[i]).$$start, attrEnd = directive.$$end;
                            if (attrStart && ($compileNode = groupScan(compileNode, attrStart, attrEnd)), $template = undefined, terminalPriority > directive.priority) break; // prevent further processing of directives
                            if ((directiveValue = directive.scope) && (newScopeDirective = newScopeDirective || directive, !directive.templateUrl && (assertNoDuplicate("new/isolated scope", newIsolateScopeDirective, directive, $compileNode), isObject(directiveValue) && (newIsolateScopeDirective = directive))), directiveName = directive.name, !directive.templateUrl && directive.controller && (directiveValue = directive.controller, assertNoDuplicate("'" + directiveName + "' controller", (controllerDirectives = controllerDirectives || {})[directiveName], directive, $compileNode), controllerDirectives[directiveName] = directive), (directiveValue = directive.transclude) && (hasTranscludeDirective = !0, directive.$$tlb || (assertNoDuplicate("transclusion", nonTlbTranscludeDirective, directive, $compileNode), nonTlbTranscludeDirective = directive), "element" == directiveValue ? (hasElementTranscludeDirective = !0, terminalPriority = directive.priority, $template = groupScan(compileNode, attrStart, attrEnd), compileNode = ($compileNode = templateAttrs.$$element = jqLite(document1.createComment(" " + directiveName + ": " + templateAttrs[directiveName] + " ")))[0], replaceWith(jqCollection, jqLite(sliceArgs($template)), compileNode), childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, {
                                // Don't pass in:
                                // - controllerDirectives - otherwise we'll create duplicates controllers
                                // - newIsolateScopeDirective or templateDirective - combining templates with
                                //   element transclusion doesn't make sense.
                                //
                                // We need only nonTlbTranscludeDirective so that we prevent putting transclusion
                                // on the same element more than once.
                                nonTlbTranscludeDirective: nonTlbTranscludeDirective
                            })) : ($template = jqLite(jqLiteClone(compileNode)).contents(), $compileNode.empty(), childTranscludeFn = compile($template, transcludeFn))), directive.template) {
                                if (assertNoDuplicate("template", templateDirective, directive, $compileNode), templateDirective = directive, directiveValue = denormalizeTemplate(directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template), directive.replace) {
                                    if (replaceDirective = directive, compileNode = ($template = jqLite("<div>" + trim(directiveValue) + "</div>").contents())[0], 1 != $template.length || 1 !== compileNode.nodeType) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", directiveName, "");
                                    replaceWith(jqCollection, $compileNode, compileNode);
                                    var newTemplateAttrs = {
                                        $attr: {}
                                    }, templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs), unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                                    newIsolateScopeDirective && markDirectivesAsIsolate(templateDirectives), directives = directives.concat(templateDirectives).concat(unprocessedDirectives), mergeTemplateAttributes(templateAttrs, newTemplateAttrs), ii = directives.length;
                                } else $compileNode.html(directiveValue);
                            }
                            if (directive.templateUrl) assertNoDuplicate("template", templateDirective, directive, $compileNode), templateDirective = directive, directive.replace && (replaceDirective = directive), nodeLinkFn = function(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
                                var afterTemplateNodeLinkFn, afterTemplateChildLinkFn, linkQueue = [], beforeTemplateCompileNode = $compileNode[0], origAsyncDirective = directives.shift(), // The fact that we have to copy and patch the directive seems wrong!
                                derivedSyncDirective = extend({}, origAsyncDirective, {
                                    templateUrl: null,
                                    transclude: null,
                                    replace: null,
                                    $$originalDirective: origAsyncDirective
                                }), templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl;
                                return $compileNode.empty(), $http.get($sce.getTrustedResourceUrl(templateUrl), {
                                    cache: $templateCache
                                }).success(function(content) {
                                    var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
                                    if (content = denormalizeTemplate(content), origAsyncDirective.replace) {
                                        if (compileNode = ($template = jqLite("<div>" + trim(content) + "</div>").contents())[0], 1 != $template.length || 1 !== compileNode.nodeType) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", origAsyncDirective.name, templateUrl);
                                        tempTemplateAttrs = {
                                            $attr: {}
                                        }, replaceWith($rootElement, $compileNode, compileNode);
                                        var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
                                        isObject(origAsyncDirective.scope) && markDirectivesAsIsolate(templateDirectives), directives = templateDirectives.concat(directives), mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
                                    } else compileNode = beforeTemplateCompileNode, $compileNode.html(content);
                                    for(directives.unshift(derivedSyncDirective), afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext), forEach($rootElement, function(node, i) {
                                        node == compileNode && ($rootElement[i] = $compileNode[0]);
                                    }), afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn); linkQueue.length;){
                                        var scope = linkQueue.shift(), beforeTemplateLinkNode = linkQueue.shift(), linkRootElement = linkQueue.shift(), boundTranscludeFn = linkQueue.shift(), linkNode = $compileNode[0];
                                        beforeTemplateLinkNode !== beforeTemplateCompileNode && (// it was cloned therefore we have to clone as well.
                                        linkNode = jqLiteClone(compileNode), replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode)), childBoundTranscludeFn = afterTemplateNodeLinkFn.transclude ? createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude) : boundTranscludeFn, afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn);
                                    }
                                    linkQueue = null;
                                }).error(function(response, code, headers, config) {
                                    throw $compileMinErr("tpload", "Failed to load template: {0}", config.url);
                                }), function(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
                                    linkQueue ? (linkQueue.push(scope), linkQueue.push(node), linkQueue.push(rootElement), linkQueue.push(boundTranscludeFn)) : afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, boundTranscludeFn);
                                };
                            }(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, childTranscludeFn, preLinkFns, postLinkFns, {
                                controllerDirectives: controllerDirectives,
                                newIsolateScopeDirective: newIsolateScopeDirective,
                                templateDirective: templateDirective,
                                nonTlbTranscludeDirective: nonTlbTranscludeDirective
                            }), ii = directives.length;
                            else if (directive.compile) try {
                                linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn), isFunction(linkFn) ? addLinkFns(null, linkFn, attrStart, attrEnd) : linkFn && addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                            } catch (e) {
                                $exceptionHandler(e, startingTag($compileNode));
                            }
                            directive.terminal && (nodeLinkFn.terminal = !0, terminalPriority = Math.max(terminalPriority, directive.priority));
                        }
                        // might be normal or delayed nodeLinkFn depending on if templateUrl is present
                        return nodeLinkFn.scope = newScopeDirective && !0 === newScopeDirective.scope, nodeLinkFn.transclude = hasTranscludeDirective && childTranscludeFn, nodeLinkFn;
                        ////////////////////
                        function addLinkFns(pre, post, attrStart, attrEnd) {
                            pre && (attrStart && (pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd)), pre.require = directive.require, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (pre = cloneAndAnnotateFn(pre, {
                                isolateScope: !0
                            })), preLinkFns.push(pre)), post && (attrStart && (post = groupElementsLinkFnWrapper(post, attrStart, attrEnd)), post.require = directive.require, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (post = cloneAndAnnotateFn(post, {
                                isolateScope: !0
                            })), postLinkFns.push(post));
                        }
                        function getControllers(require, $element, elementControllers) {
                            var value, retrievalMethod = "data", optional = !1;
                            if (isString(require)) {
                                for(; "^" == (value = require.charAt(0)) || "?" == value;)require = require.substr(1), "^" == value && (retrievalMethod = "inheritedData"), optional = optional || "?" == value;
                                if (value = null, elementControllers && "data" === retrievalMethod && (value = elementControllers[require]), !(value = value || $element[retrievalMethod]("$" + require + "Controller")) && !optional) throw $compileMinErr("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", require, directiveName);
                            } else isArray(require) && (value = [], forEach(require, function(require) {
                                value.push(getControllers(require, $element, elementControllers));
                            }));
                            return value;
                        }
                        function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
                            var attrs, $element, i, ii, linkFn, controller, isolateScope, transcludeFn, elementControllers = {};
                            if ($element = (attrs = compileNode === linkNode ? templateAttrs : /**
   * Create a shallow copy of an object
   */ function(src, dst) {
                                for(var key in dst = dst || {}, src)// shallowCopy is only ever called by $compile nodeLinkFn, which has control over src
                                // so we don't need to worry about using our custom hasOwnProperty here
                                src.hasOwnProperty(key) && "$$" !== key.substr(0, 2) && (dst[key] = src[key]);
                                return dst;
                            }(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr))).$$element, newIsolateScopeDirective) {
                                var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/, $linkNode = jqLite(linkNode);
                                isolateScope = scope.$new(!0), templateDirective && templateDirective === newIsolateScopeDirective.$$originalDirective ? $linkNode.data("$isolateScope", isolateScope) : $linkNode.data("$isolateScopeNoTemplate", isolateScope), safeAddClass($linkNode, "ng-isolate-scope"), forEach(newIsolateScopeDirective.scope, function(definition, scopeName) {
                                    var lastValue, parentGet, parentSet, compare, match = definition.match(LOCAL_REGEXP) || [], attrName = match[3] || scopeName, optional = "?" == match[2], mode = match[1];
                                    switch(isolateScope.$$isolateBindings[scopeName] = mode + attrName, mode){
                                        case "@":
                                            attrs.$observe(attrName, function(value) {
                                                isolateScope[scopeName] = value;
                                            }), attrs.$$observers[attrName].$$scope = scope, attrs[attrName] && // If the attribute has been provided then we trigger an interpolation to ensure
                                            // the value is there for use in the link fn
                                            (isolateScope[scopeName] = $interpolate(attrs[attrName])(scope));
                                            break;
                                        case "=":
                                            if (optional && !attrs[attrName]) return;
                                            compare = (parentGet = $parse(attrs[attrName])).literal ? equals : function(a, b) {
                                                return a === b;
                                            }, parentSet = parentGet.assign || function() {
                                                throw(// reset the change, or we will throw this exception on every $digest
                                                lastValue = isolateScope[scopeName] = parentGet(scope), $compileMinErr("nonassign", "Expression '{0}' used with directive '{1}' is non-assignable!", attrs[attrName], newIsolateScopeDirective.name));
                                            }, lastValue = isolateScope[scopeName] = parentGet(scope), isolateScope.$watch(function() {
                                                var parentValue = parentGet(scope);
                                                return compare(parentValue, isolateScope[scopeName]) || (compare(parentValue, lastValue) ? // if the parent can be assigned then do so
                                                parentSet(scope, parentValue = isolateScope[scopeName]) : // parent changed and it has precedence
                                                isolateScope[scopeName] = parentValue), lastValue = parentValue;
                                            }, null, parentGet.literal);
                                            break;
                                        case "&":
                                            parentGet = $parse(attrs[attrName]), isolateScope[scopeName] = function(locals) {
                                                return parentGet(scope, locals);
                                            };
                                            break;
                                        default:
                                            throw $compileMinErr("iscp", "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}", newIsolateScopeDirective.name, scopeName, definition);
                                    }
                                });
                            }
                            // PRELINKING
                            for(transcludeFn = boundTranscludeFn && // This is the function that is injected as `$transclude`.
                            function(scope, cloneAttachFn) {
                                var transcludeControllers;
                                return arguments.length < 2 && (cloneAttachFn = scope, scope = undefined), hasElementTranscludeDirective && (transcludeControllers = elementControllers), boundTranscludeFn(scope, cloneAttachFn, transcludeControllers);
                            }, controllerDirectives && forEach(controllerDirectives, function(directive) {
                                var controllerInstance, locals = {
                                    $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                                    $element: $element,
                                    $attrs: attrs,
                                    $transclude: transcludeFn
                                };
                                "@" == (controller = directive.controller) && (controller = attrs[directive.name]), controllerInstance = $controller(controller, locals), // For directives with element transclusion the element is a comment,
                                // but jQuery .data doesn't support attaching data to comment nodes as it's hard to
                                // clean up (http://bugs.jquery.com/ticket/8335).
                                // Instead, we save the controllers for the element in a local hash and attach to .data
                                // later, once we have the actual element.
                                elementControllers[directive.name] = controllerInstance, hasElementTranscludeDirective || $element.data("$" + directive.name + "Controller", controllerInstance), directive.controllerAs && (locals.$scope[directive.controllerAs] = controllerInstance);
                            }), i = 0, ii = preLinkFns.length; i < ii; i++)try {
                                (linkFn = preLinkFns[i])(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
                            } catch (e) {
                                $exceptionHandler(e, startingTag($element));
                            }
                            // RECURSION
                            // We only pass the isolate scope, if the isolate directive has a template,
                            // otherwise the child elements do not belong to the isolate directive.
                            var scopeToChild = scope;
                            // POSTLINKING
                            for(newIsolateScopeDirective && (newIsolateScopeDirective.template || null === newIsolateScopeDirective.templateUrl) && (scopeToChild = isolateScope), childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn), i = postLinkFns.length - 1; i >= 0; i--)try {
                                (linkFn = postLinkFns[i])(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
                            } catch (e) {
                                $exceptionHandler(e, startingTag($element));
                            }
                        }
                    }(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null) && nodeLinkFn.terminal || !nodeList[i].childNodes || !nodeList[i].childNodes.length ? null : compileNodes(nodeList[i].childNodes, nodeLinkFn ? nodeLinkFn.transclude : transcludeFn), linkFns.push(nodeLinkFn), linkFns.push(childLinkFn), linkFnFound = linkFnFound || nodeLinkFn || childLinkFn, //use the previous context only for the first element in the virtual group
                    previousCompileContext = null;
                    // return a linking function if we have found anything, null otherwise
                    return linkFnFound ? function(scope, nodeList, $rootElement, boundTranscludeFn) {
                        // copy nodeList so that linking doesn't break due to live list updates.
                        var nodeLinkFn, childLinkFn, node, $node, childScope, childTranscludeFn, i, ii, n, stableNodeList = [];
                        for(i = 0, ii = nodeList.length; i < ii; i++)stableNodeList.push(nodeList[i]);
                        for(i = 0, n = 0, ii = linkFns.length; i < ii; n++)node = stableNodeList[n], nodeLinkFn = linkFns[i++], childLinkFn = linkFns[i++], $node = jqLite(node), nodeLinkFn ? (nodeLinkFn.scope ? (childScope = scope.$new(), $node.data("$scope", childScope), safeAddClass($node, "ng-scope")) : childScope = scope, childTranscludeFn = nodeLinkFn.transclude, nodeLinkFn(childLinkFn, childScope, node, $rootElement, childTranscludeFn || !boundTranscludeFn && transcludeFn ? createBoundTranscludeFn(scope, childTranscludeFn || transcludeFn) : boundTranscludeFn)) : childLinkFn && childLinkFn(scope, node.childNodes, undefined, boundTranscludeFn);
                    } : null;
                }
                function createBoundTranscludeFn(scope, transcludeFn) {
                    return function(transcludedScope, cloneFn, controllers) {
                        var scopeCreated = !1;
                        transcludedScope || ((transcludedScope = scope.$new()).$$transcluded = !0, scopeCreated = !0);
                        var clone = transcludeFn(transcludedScope, cloneFn, controllers);
                        return scopeCreated && clone.on("$destroy", bind(transcludedScope, transcludedScope.$destroy)), clone;
                    };
                }
                /**
         * Looks for directives on the given node and adds them to the directive collection which is
         * sorted.
         *
         * @param node Node to search.
         * @param directives An array to which the directives are added to. This array is sorted before
         *        the function returns.
         * @param attrs The shared attrs object which is used to populate the normalized attributes.
         * @param {number=} maxPriority Max directive priority.
         */ function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
                    var directives1, interpolateFn, match, className, nodeType = node.nodeType, attrsMap = attrs.$attr;
                    switch(nodeType){
                        case 1 /* Element */ :
                            // use the node name: <directive>
                            addDirective(directives, directiveNormalize(nodeName_(node).toLowerCase()), "E", maxPriority, ignoreDirective);
                            // iterate over the attributes
                            for(var attr, name, nName, ngAttrName, value, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; j < jj; j++){
                                var attrStartName = !1, attrEndName = !1;
                                if (attr = nAttrs[j], !msie || msie >= 8 || attr.specified) {
                                    // support ngAttr attribute binding
                                    ngAttrName = directiveNormalize(name = attr.name), NG_ATTR_BINDING.test(ngAttrName) && (name = snake_case(ngAttrName.substr(6), "-"));
                                    var directiveNName = ngAttrName.replace(/(Start|End)$/, "");
                                    ngAttrName === directiveNName + "Start" && (attrStartName = name, attrEndName = name.substr(0, name.length - 5) + "end", name = name.substr(0, name.length - 6)), attrsMap[nName = directiveNormalize(name.toLowerCase())] = name, attrs[nName] = value = trim(msie && "href" == name ? decodeURIComponent(node.getAttribute(name, 2)) : attr.value), getBooleanAttrName(node, nName) && (attrs[nName] = !0), function(node, directives, value, name) {
                                        var interpolateFn = $interpolate(value, !0);
                                        // no interpolation found -> ignore
                                        if (interpolateFn) {
                                            if ("multiple" === name && "SELECT" === nodeName_(node)) throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", startingTag(node));
                                            directives.push({
                                                priority: 100,
                                                compile: function() {
                                                    return {
                                                        pre: function(scope, element, attr) {
                                                            var $$observers = attr.$$observers || (attr.$$observers = {});
                                                            if (EVENT_HANDLER_ATTR_REGEXP.test(name)) throw $compileMinErr("nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");
                                                            // if attribute was updated so that there is no interpolation going on we don't want to
                                                            // register any observers
                                                            // we need to interpolate again, in case the attribute value has been updated
                                                            // (e.g. by another directive's compile function)
                                                            (interpolateFn = $interpolate(attr[name], !0, function(node, attrNormalizedName) {
                                                                if ("srcdoc" == attrNormalizedName) return $sce.HTML;
                                                                var tag = nodeName_(node);
                                                                // maction[xlink:href] can source SVG.  It's not limited to <maction>.
                                                                if ("xlinkHref" == attrNormalizedName || "FORM" == tag && "action" == attrNormalizedName || "IMG" != tag && ("src" == attrNormalizedName || "ngSrc" == attrNormalizedName)) return $sce.RESOURCE_URL;
                                                            }(node, name))) && (// TODO(i): this should likely be attr.$set(name, iterpolateFn(scope) so that we reset the
                                                            // actual attr value
                                                            attr[name] = interpolateFn(scope), ($$observers[name] || ($$observers[name] = [])).$$inter = !0, (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function(newValue, oldValue) {
                                                                //special case for class attribute addition + removal
                                                                //so that class changes can tap into the animation
                                                                //hooks provided by the $animate service. Be sure to
                                                                //skip animations when the first digest occurs (when
                                                                //both the new and the old values are the same) since
                                                                //the CSS classes are the non-interpolated values
                                                                "class" === name && newValue != oldValue ? attr.$updateClass(newValue, oldValue) : attr.$set(name, newValue);
                                                            }));
                                                        }
                                                    };
                                                }
                                            });
                                        }
                                    }(node, directives, value, nName), addDirective(directives, nName, "A", maxPriority, ignoreDirective, attrStartName, attrEndName);
                                }
                            }
                            if (isString(// use class as directive
                            className = node.className) && "" !== className) for(; match = CLASS_DIRECTIVE_REGEXP.exec(className);)addDirective(directives, nName = directiveNormalize(match[2]), "C", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[3])), className = className.substr(match.index + match[0].length);
                            break;
                        case 3 /* Text Node */ :
                            directives1 = directives, (interpolateFn = $interpolate(node.nodeValue, !0)) && directives1.push({
                                priority: 0,
                                compile: valueFn(function(scope, node) {
                                    var parent = node.parent(), bindings = parent.data("$binding") || [];
                                    bindings.push(interpolateFn), safeAddClass(parent.data("$binding", bindings), "ng-binding"), scope.$watch(interpolateFn, function(value) {
                                        node[0].nodeValue = value;
                                    });
                                })
                            });
                            break;
                        case 8 /* Comment */ :
                            try {
                                (match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue)) && (nName = directiveNormalize(match[1]), addDirective(directives, nName, "M", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[2])));
                            } catch (e) {
                            // turns out that under some circumstances IE9 throws errors when one attempts to read
                            // comment's node value.
                            // Just ignore it and continue. (Can't seem to reproduce in test case.)
                            }
                    }
                    return directives.sort(byPriority), directives;
                }
                /**
         * Given a node with an directive-start it collects all of the siblings until it finds
         * directive-end.
         * @param node
         * @param attrStart
         * @param attrEnd
         * @returns {*}
         */ function groupScan(node, attrStart, attrEnd) {
                    var nodes = [], depth = 0;
                    if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) do {
                        if (!node) throw $compileMinErr("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
                        1 /** Element **/  == node.nodeType && (node.hasAttribute(attrStart) && depth++, node.hasAttribute(attrEnd) && depth--), nodes.push(node), node = node.nextSibling;
                    }while (depth > 0)
                    else nodes.push(node);
                    return jqLite(nodes);
                }
                /**
         * Wrapper for linking function which converts normal linking function into a grouped
         * linking function.
         * @param linkFn
         * @param attrStart
         * @param attrEnd
         * @returns {Function}
         */ function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
                    return function(scope, element, attrs, controllers, transcludeFn) {
                        return linkFn(scope, element = groupScan(element[0], attrStart, attrEnd), attrs, controllers, transcludeFn);
                    };
                }
                function markDirectivesAsIsolate(directives) {
                    // mark all directives as needing isolate scope.
                    for(var j = 0, jj = directives.length; j < jj; j++)directives[j] = inherit(directives[j], {
                        $$isolateScope: !0
                    });
                }
                /**
         * looks up the directive and decorates it with exception handling and proper parameters. We
         * call this the boundDirective.
         *
         * @param {string} name name of the directive to look up.
         * @param {string} location The directive must be found in specific format.
         *   String containing any of theses characters:
         *
         *   * `E`: element name
         *   * `A': attribute
         *   * `C`: class
         *   * `M`: comment
         * @returns true if directive was added.
         */ function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
                    if (name === ignoreDirective) return null;
                    var match = null;
                    if (hasDirectives.hasOwnProperty(name)) for(var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++)try {
                        directive = directives[i], (undefined === maxPriority || maxPriority > directive.priority) && -1 != directive.restrict.indexOf(location) && (startAttrName && (directive = inherit(directive, {
                            $$start: startAttrName,
                            $$end: endAttrName
                        })), tDirectives.push(directive), match = directive);
                    } catch (e) {
                        $exceptionHandler(e);
                    }
                    return match;
                }
                /**
         * When the element is replaced with HTML template then the new attributes
         * on the template need to be merged with the existing attributes in the DOM.
         * The desired effect is to have both of the attributes present.
         *
         * @param {object} dst destination attributes (original DOM)
         * @param {object} src source attributes (from the directive template)
         */ function mergeTemplateAttributes(dst, src) {
                    var srcAttr = src.$attr, dstAttr = dst.$attr, $element = dst.$$element;
                    // reapply the old attributes to the new element
                    forEach(dst, function(value, key) {
                        "$" != key.charAt(0) && (src[key] && (value += ("style" === key ? ";" : " ") + src[key]), dst.$set(key, value, !0, srcAttr[key]));
                    }), // copy the new attributes on the old attrs object
                    forEach(src, function(value, key) {
                        "class" == key ? (safeAddClass($element, value), dst.class = (dst.class ? dst.class + " " : "") + value) : "style" == key ? ($element.attr("style", $element.attr("style") + ";" + value), dst.style = (dst.style ? dst.style + ";" : "") + value) : "$" == key.charAt(0) || dst.hasOwnProperty(key) || (dst[key] = value, dstAttr[key] = srcAttr[key]);
                    });
                }
                /**
         * Sorting function for bound directives.
         */ function byPriority(a, b) {
                    var diff = b.priority - a.priority;
                    return 0 !== diff ? diff : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index;
                }
                function assertNoDuplicate(what, previousDirective, directive, element) {
                    if (previousDirective) throw $compileMinErr("multidir", "Multiple directives [{0}, {1}] asking for {2} on: {3}", previousDirective.name, directive.name, what, startingTag(element));
                }
                /**
         * This is a special jqLite.replaceWith, which can replace items which
         * have no parents, provided that the containing jqLite collection is provided.
         *
         * @param {JqLite=} $rootElement The root of the compile tree. Used so that we can replace nodes
         *                               in the root of the tree.
         * @param {JqLite} elementsToRemove The jqLite element which we are going to replace. We keep
         *                                  the shell, but replace its DOM node reference.
         * @param {Node} newNode The new DOM node.
         */ function replaceWith($rootElement, elementsToRemove, newNode) {
                    var i, ii, firstElementToRemove = elementsToRemove[0], removeCount = elementsToRemove.length, parent = firstElementToRemove.parentNode;
                    if ($rootElement) {
                        for(i = 0, ii = $rootElement.length; i < ii; i++)if ($rootElement[i] == firstElementToRemove) {
                            $rootElement[i++] = newNode;
                            for(var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; j < jj; j++, j2++)j2 < jj ? $rootElement[j] = $rootElement[j2] : delete $rootElement[j];
                            $rootElement.length -= removeCount - 1;
                            break;
                        }
                    }
                    parent && parent.replaceChild(newNode, firstElementToRemove);
                    var fragment = document1.createDocumentFragment();
                    fragment.appendChild(firstElementToRemove), newNode[jqLite.expando] = firstElementToRemove[jqLite.expando];
                    for(var k = 1, kk = elementsToRemove.length; k < kk; k++){
                        var element = elementsToRemove[k];
                        jqLite(element).remove(), fragment.appendChild(element), delete elementsToRemove[k];
                    }
                    elementsToRemove[0] = newNode, elementsToRemove.length = 1;
                }
                function cloneAndAnnotateFn(fn, annotation) {
                    return extend(function() {
                        return fn.apply(null, arguments);
                    }, fn, annotation);
                }
            }
        ];
    }
    /**
   * @ngdoc service
   * @name ng.$compileProvider
   * @function
   *
   * @description
   */ $CompileProvider.$inject = [
        "$provide",
        "$$sanitizeUriProvider"
    ];
    var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
    /**
   * Converts all accepted directives format into proper directive name.
   * All of these will become 'myDirective':
   *   my:Directive
   *   my-directive
   *   x-my-directive
   *   data-my:directive
   *
   * Also there is special case for Moz prefix starting with upper case letter.
   * @param name Name to normalize
   */ function directiveNormalize(name) {
        return camelCase(name.replace(PREFIX_REGEXP, ""));
    }
    function tokenDifference(str1, str2) {
        var values = "", tokens1 = str1.split(/\s+/), tokens2 = str2.split(/\s+/);
        outer: for(var i = 0; i < tokens1.length; i++){
            for(var token = tokens1[i], j = 0; j < tokens2.length; j++)if (token == tokens2[j]) continue outer;
            values += (values.length > 0 ? " " : "") + token;
        }
        return values;
    }
    /**
   * @ngdoc object
   * @name ng.$controllerProvider
   * @description
   * The {@link ng.$controller $controller service} is used by Angular to create new
   * controllers.
   *
   * This provider allows controller registration via the
   * {@link ng.$controllerProvider#methods_register register} method.
   */ function $ControllerProvider() {
        var controllers = {}, CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
        /**
     * @ngdoc function
     * @name ng.$controllerProvider#register
     * @methodOf ng.$controllerProvider
     * @param {string|Object} name Controller name, or an object map of controllers where the keys are
     *    the names and the values are the constructors.
     * @param {Function|Array} constructor Controller constructor fn (optionally decorated with DI
     *    annotations in the array notation).
     */ this.register = function(name, constructor) {
            assertNotHasOwnProperty(name, "controller"), isObject(name) ? extend(controllers, name) : controllers[name] = constructor;
        }, this.$get = [
            "$injector",
            "$window",
            function($injector, $window) {
                /**
         * @ngdoc function
         * @name ng.$controller
         * @requires $injector
         *
         * @param {Function|string} constructor If called with a function then it's considered to be the
         *    controller constructor function. Otherwise it's considered to be a string which is used
         *    to retrieve the controller constructor using the following steps:
         *
         *    * check if a controller with given name is registered via `$controllerProvider`
         *    * check if evaluating the string on the current scope returns a constructor
         *    * check `window[constructor]` on the global `window` object
         *
         * @param {Object} locals Injection locals for Controller.
         * @return {Object} Instance of given controller.
         *
         * @description
         * `$controller` service is responsible for instantiating controllers.
         *
         * It's just a simple call to {@link AUTO.$injector $injector}, but extracted into
         * a service, so that one can override this service with {@link https://gist.github.com/1649788
         * BC version}.
         */ return function(expression, locals) {
                    var instance, match, constructor, identifier;
                    if (isString(expression) && (constructor = (match = expression.match(CNTRL_REG))[1], identifier = match[3], assertArgFn(expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, !0) || getter($window, constructor, !0), constructor, !0)), instance = $injector.instantiate(expression, locals), identifier) {
                        if (!(locals && "object" == typeof locals.$scope)) throw minErr("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", constructor || expression.name, identifier);
                        locals.$scope[identifier] = instance;
                    }
                    return instance;
                };
            }
        ];
    }
    /**
   * @ngdoc object
   * @name ng.$document
   * @requires $window
   *
   * @description
   * A {@link angular.element jQuery (lite)}-wrapped reference to the browser's `window.document`
   * element.
   */ function $DocumentProvider() {
        this.$get = [
            "$window",
            function(window1) {
                return jqLite(window1.document);
            }
        ];
    }
    /**
   * @ngdoc function
   * @name ng.$exceptionHandler
   * @requires $log
   *
   * @description
   * Any uncaught exception in angular expressions is delegated to this service.
   * The default implementation simply delegates to `$log.error` which logs it into
   * the browser console.
   *
   * In unit tests, if `angular-mocks.js` is loaded, this service is overridden by
   * {@link ngMock.$exceptionHandler mock $exceptionHandler} which aids in testing.
   *
   * ## Example:
   *
   * <pre>
   *   angular.module('exceptionOverride', []).factory('$exceptionHandler', function () {
   *     return function (exception, cause) {
   *       exception.message += ' (caused by "' + cause + '")';
   *       throw exception;
   *     };
   *   });
   * </pre>
   *
   * This example will override the normal action of `$exceptionHandler`, to make angular
   * exceptions fail hard when they happen, instead of just logging to the console.
   *
   * @param {Error} exception Exception associated with the error.
   * @param {string=} cause optional information about the context in which
   *       the error was thrown.
   *
   */ function $ExceptionHandlerProvider() {
        this.$get = [
            "$log",
            function($log) {
                return function(exception, cause) {
                    $log.error.apply($log, arguments);
                };
            }
        ];
    }
    /**
   * Parse headers into key value object
   *
   * @param {string} headers Raw headers as a string
   * @returns {Object} Parsed headers as key value object
   */ function parseHeaders(headers) {
        var key, val, i, parsed = {};
        return headers && forEach(headers.split("\n"), function(line) {
            i = line.indexOf(":"), key = lowercase(trim(line.substr(0, i))), val = trim(line.substr(i + 1)), key && (parsed[key] ? parsed[key] += ", " + val : parsed[key] = val);
        }), parsed;
    }
    /**
   * Returns a function that provides access to parsed headers.
   *
   * Headers are lazy parsed when first requested.
   * @see parseHeaders
   *
   * @param {(string|Object)} headers Headers to provide access to.
   * @returns {function(string=)} Returns a getter function which if called with:
   *
   *   - if called with single an argument returns a single header value or null
   *   - if called with no arguments returns an object containing all headers.
   */ function headersGetter(headers) {
        var headersObj = isObject(headers) ? headers : undefined;
        return function(name) {
            return (headersObj || (headersObj = parseHeaders(headers)), name) ? headersObj[lowercase(name)] || null : headersObj;
        };
    }
    /**
   * Chain all given functions
   *
   * This function is used for both request and response transforming
   *
   * @param {*} data Data to transform.
   * @param {function(string=)} headers Http headers getter fn.
   * @param {(function|Array.<function>)} fns Function or an array of functions.
   * @returns {*} Transformed data.
   */ function transformData(data, headers, fns) {
        return isFunction(fns) ? fns(data, headers) : (forEach(fns, function(fn) {
            data = fn(data, headers);
        }), data);
    }
    function isSuccess(status) {
        return 200 <= status && status < 300;
    }
    function $HttpProvider() {
        var JSON_START = /^\s*(\[|\{[^\{])/, JSON_END = /[\}\]]\s*$/, PROTECTION_PREFIX = /^\)\]\}',?\n/, CONTENT_TYPE_APPLICATION_JSON = {
            "Content-Type": "application/json;charset=utf-8"
        }, defaults = this.defaults = {
            // transform incoming response data
            transformResponse: [
                function(data) {
                    return isString(data) && (// strip json vulnerability protection prefix
                    data = data.replace(PROTECTION_PREFIX, ""), JSON_START.test(data) && JSON_END.test(data) && (data = fromJson(data))), data;
                }
            ],
            // transform outgoing request data
            transformRequest: [
                function(d) {
                    return isObject(d) && "[object File]" !== toString.call(d) ? toJson(d) : d;
                }
            ],
            // default headers
            headers: {
                common: {
                    Accept: "application/json, text/plain, */*"
                },
                post: CONTENT_TYPE_APPLICATION_JSON,
                put: CONTENT_TYPE_APPLICATION_JSON,
                patch: CONTENT_TYPE_APPLICATION_JSON
            },
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN"
        }, interceptorFactories = this.interceptors = [], responseInterceptorFactories = this.responseInterceptors = [];
        this.$get = [
            "$httpBackend",
            "$browser",
            "$cacheFactory",
            "$rootScope",
            "$q",
            "$injector",
            function($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
                var defaultCache = $cacheFactory("$http"), reversedInterceptors = [];
                /**
     * @ngdoc function
     * @name ng.$http
     * @requires $httpBackend
     * @requires $browser
     * @requires $cacheFactory
     * @requires $rootScope
     * @requires $q
     * @requires $injector
     *
     * @description
     * The `$http` service is a core Angular service that facilitates communication with the remote
     * HTTP servers via the browser's {@link https://developer.mozilla.org/en/xmlhttprequest
     * XMLHttpRequest} object or via {@link http://en.wikipedia.org/wiki/JSONP JSONP}.
     *
     * For unit testing applications that use `$http` service, see
     * {@link ngMock.$httpBackend $httpBackend mock}.
     *
     * For a higher level of abstraction, please check out the {@link ngResource.$resource
     * $resource} service.
     *
     * The $http API is based on the {@link ng.$q deferred/promise APIs} exposed by
     * the $q service. While for simple usage patterns this doesn't matter much, for advanced usage
     * it is important to familiarize yourself with these APIs and the guarantees they provide.
     *
     *
     * # General usage
     * The `$http` service is a function which takes a single argument — a configuration object —
     * that is used to generate an HTTP request and returns  a {@link ng.$q promise}
     * with two $http specific methods: `success` and `error`.
     *
     * <pre>
     *   $http({method: 'GET', url: '/someUrl'}).
     *     success(function(data, status, headers, config) {
     *       // this callback will be called asynchronously
     *       // when the response is available
     *     }).
     *     error(function(data, status, headers, config) {
     *       // called asynchronously if an error occurs
     *       // or server returns response with an error status.
     *     });
     * </pre>
     *
     * Since the returned value of calling the $http function is a `promise`, you can also use
     * the `then` method to register callbacks, and these callbacks will receive a single argument –
     * an object representing the response. See the API signature and type info below for more
     * details.
     *
     * A response status code between 200 and 299 is considered a success status and
     * will result in the success callback being called. Note that if the response is a redirect,
     * XMLHttpRequest will transparently follow it, meaning that the error callback will not be
     * called for such responses.
     * 
     * # Calling $http from outside AngularJS
     * The `$http` service will not actually send the request until the next `$digest()` is
     * executed. Normally this is not an issue, since almost all the time your call to `$http` will
     * be from within a `$apply()` block.
     * If you are calling `$http` from outside Angular, then you should wrap it in a call to
     * `$apply` to cause a $digest to occur and also to handle errors in the block correctly.
     *
     * ```
     * $scope.$apply(function() {
     *   $http(...);
     * });
     * ```
     *
     * # Writing Unit Tests that use $http
     * When unit testing you are mostly responsible for scheduling the `$digest` cycle. If you do
     * not trigger a `$digest` before calling `$httpBackend.flush()` then the request will not have
     * been made and `$httpBackend.expect(...)` expectations will fail.  The solution is to run the
     * code that calls the `$http()` method inside a $apply block as explained in the previous
     * section.
     *
     * ```
     * $httpBackend.expectGET(...);
     * $scope.$apply(function() {
     *   $http.get(...);
     * });
     * $httpBackend.flush();
     * ```
     *
     * # Shortcut methods
     *
     * Since all invocations of the $http service require passing in an HTTP method and URL, and
     * POST/PUT requests require request data to be provided as well, shortcut methods
     * were created:
     *
     * <pre>
     *   $http.get('/someUrl').success(successCallback);
     *   $http.post('/someUrl', data).success(successCallback);
     * </pre>
     *
     * Complete list of shortcut methods:
     *
     * - {@link ng.$http#methods_get $http.get}
     * - {@link ng.$http#methods_head $http.head}
     * - {@link ng.$http#methods_post $http.post}
     * - {@link ng.$http#methods_put $http.put}
     * - {@link ng.$http#methods_delete $http.delete}
     * - {@link ng.$http#methods_jsonp $http.jsonp}
     *
     *
     * # Setting HTTP Headers
     *
     * The $http service will automatically add certain HTTP headers to all requests. These defaults
     * can be fully configured by accessing the `$httpProvider.defaults.headers` configuration
     * object, which currently contains this default configuration:
     *
     * - `$httpProvider.defaults.headers.common` (headers that are common for all requests):
     *   - `Accept: application/json, text/plain, * / *`
     * - `$httpProvider.defaults.headers.post`: (header defaults for POST requests)
     *   - `Content-Type: application/json`
     * - `$httpProvider.defaults.headers.put` (header defaults for PUT requests)
     *   - `Content-Type: application/json`
     *
     * To add or overwrite these defaults, simply add or remove a property from these configuration
     * objects. To add headers for an HTTP method other than POST or PUT, simply add a new object
     * with the lowercased HTTP method name as the key, e.g.
     * `$httpProvider.defaults.headers.get = { 'My-Header' : 'value' }.
     *
     * The defaults can also be set at runtime via the `$http.defaults` object in the same
     * fashion. In addition, you can supply a `headers` property in the config object passed when
     * calling `$http(config)`, which overrides the defaults without changing them globally.
     *
     *
     * # Transforming Requests and Responses
     *
     * Both requests and responses can be transformed using transform functions. By default, Angular
     * applies these transformations:
     *
     * Request transformations:
     *
     * - If the `data` property of the request configuration object contains an object, serialize it
     *   into JSON format.
     *
     * Response transformations:
     *
     *  - If XSRF prefix is detected, strip it (see Security Considerations section below).
     *  - If JSON response is detected, deserialize it using a JSON parser.
     *
     * To globally augment or override the default transforms, modify the
     * `$httpProvider.defaults.transformRequest` and `$httpProvider.defaults.transformResponse`
     * properties. These properties are by default an array of transform functions, which allows you
     * to `push` or `unshift` a new transformation function into the transformation chain. You can
     * also decide to completely override any default transformations by assigning your
     * transformation functions to these properties directly without the array wrapper.
     *
     * Similarly, to locally override the request/response transforms, augment the
     * `transformRequest` and/or `transformResponse` properties of the configuration object passed
     * into `$http`.
     *
     *
     * # Caching
     *
     * To enable caching, set the request configuration `cache` property to `true` (to use default
     * cache) or to a custom cache object (built with {@link ng.$cacheFactory `$cacheFactory`}).
     * When the cache is enabled, `$http` stores the response from the server in the specified
     * cache. The next time the same request is made, the response is served from the cache without
     * sending a request to the server.
     *
     * Note that even if the response is served from cache, delivery of the data is asynchronous in
     * the same way that real requests are.
     *
     * If there are multiple GET requests for the same URL that should be cached using the same
     * cache, but the cache is not populated yet, only one request to the server will be made and
     * the remaining requests will be fulfilled using the response from the first request.
     *
     * You can change the default cache to a new object (built with
     * {@link ng.$cacheFactory `$cacheFactory`}) by updating the
     * {@link ng.$http#properties_defaults `$http.defaults.cache`} property. All requests who set
     * their `cache` property to `true` will now use this cache object.
     *
     * If you set the default cache to `false` then only requests that specify their own custom
     * cache object will be cached.
     *
     * # Interceptors
     *
     * Before you start creating interceptors, be sure to understand the
     * {@link ng.$q $q and deferred/promise APIs}.
     *
     * For purposes of global error handling, authentication, or any kind of synchronous or
     * asynchronous pre-processing of request or postprocessing of responses, it is desirable to be
     * able to intercept requests before they are handed to the server and
     * responses before they are handed over to the application code that
     * initiated these requests. The interceptors leverage the {@link ng.$q
     * promise APIs} to fulfill this need for both synchronous and asynchronous pre-processing.
     *
     * The interceptors are service factories that are registered with the `$httpProvider` by
     * adding them to the `$httpProvider.interceptors` array. The factory is called and
     * injected with dependencies (if specified) and returns the interceptor.
     *
     * There are two kinds of interceptors (and two kinds of rejection interceptors):
     *
     *   * `request`: interceptors get called with http `config` object. The function is free to
     *     modify the `config` or create a new one. The function needs to return the `config`
     *     directly or as a promise.
     *   * `requestError`: interceptor gets called when a previous interceptor threw an error or
     *     resolved with a rejection.
     *   * `response`: interceptors get called with http `response` object. The function is free to
     *     modify the `response` or create a new one. The function needs to return the `response`
     *     directly or as a promise.
     *   * `responseError`: interceptor gets called when a previous interceptor threw an error or
     *     resolved with a rejection.
     *
     *
     * <pre>
     *   // register the interceptor as a service
     *   $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {
     *     return {
     *       // optional method
     *       'request': function(config) {
     *         // do something on success
     *         return config || $q.when(config);
     *       },
     *
     *       // optional method
     *      'requestError': function(rejection) {
     *         // do something on error
     *         if (canRecover(rejection)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(rejection);
     *       },
     *
     *
     *
     *       // optional method
     *       'response': function(response) {
     *         // do something on success
     *         return response || $q.when(response);
     *       },
     *
     *       // optional method
     *      'responseError': function(rejection) {
     *         // do something on error
     *         if (canRecover(rejection)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(rejection);
     *       };
     *     }
     *   });
     *
     *   $httpProvider.interceptors.push('myHttpInterceptor');
     *
     *
     *   // register the interceptor via an anonymous factory
     *   $httpProvider.interceptors.push(function($q, dependency1, dependency2) {
     *     return {
     *      'request': function(config) {
     *          // same as above
     *       },
     *       'response': function(response) {
     *          // same as above
     *       }
     *     };
     *   });
     * </pre>
     *
     * # Response interceptors (DEPRECATED)
     *
     * Before you start creating interceptors, be sure to understand the
     * {@link ng.$q $q and deferred/promise APIs}.
     *
     * For purposes of global error handling, authentication or any kind of synchronous or
     * asynchronous preprocessing of received responses, it is desirable to be able to intercept
     * responses for http requests before they are handed over to the application code that
     * initiated these requests. The response interceptors leverage the {@link ng.$q
     * promise apis} to fulfil this need for both synchronous and asynchronous preprocessing.
     *
     * The interceptors are service factories that are registered with the $httpProvider by
     * adding them to the `$httpProvider.responseInterceptors` array. The factory is called and
     * injected with dependencies (if specified) and returns the interceptor  — a function that
     * takes a {@link ng.$q promise} and returns the original or a new promise.
     *
     * <pre>
     *   // register the interceptor as a service
     *   $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {
     *     return function(promise) {
     *       return promise.then(function(response) {
     *         // do something on success
     *         return response;
     *       }, function(response) {
     *         // do something on error
     *         if (canRecover(response)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(response);
     *       });
     *     }
     *   });
     *
     *   $httpProvider.responseInterceptors.push('myHttpInterceptor');
     *
     *
     *   // register the interceptor via an anonymous factory
     *   $httpProvider.responseInterceptors.push(function($q, dependency1, dependency2) {
     *     return function(promise) {
     *       // same as above
     *     }
     *   });
     * </pre>
     *
     *
     * # Security Considerations
     *
     * When designing web applications, consider security threats from:
     *
     * - {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
     *   JSON vulnerability}
     * - {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF}
     *
     * Both server and the client must cooperate in order to eliminate these threats. Angular comes
     * pre-configured with strategies that address these issues, but for this to work backend server
     * cooperation is required.
     *
     * ## JSON Vulnerability Protection
     *
     * A {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
     * JSON vulnerability} allows third party website to turn your JSON resource URL into
     * {@link http://en.wikipedia.org/wiki/JSONP JSONP} request under some conditions. To
     * counter this your server can prefix all JSON requests with following string `")]}',\n"`.
     * Angular will automatically strip the prefix before processing it as JSON.
     *
     * For example if your server needs to return:
     * <pre>
     * ['one','two']
     * </pre>
     *
     * which is vulnerable to attack, your server can return:
     * <pre>
     * )]}',
     * ['one','two']
     * </pre>
     *
     * Angular will strip the prefix, before processing the JSON.
     *
     *
     * ## Cross Site Request Forgery (XSRF) Protection
     *
     * {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF} is a technique by which
     * an unauthorized site can gain your user's private data. Angular provides a mechanism
     * to counter XSRF. When performing XHR requests, the $http service reads a token from a cookie
     * (by default, `XSRF-TOKEN`) and sets it as an HTTP header (`X-XSRF-TOKEN`). Since only
     * JavaScript that runs on your domain could read the cookie, your server can be assured that
     * the XHR came from JavaScript running on your domain. The header will not be set for
     * cross-domain requests.
     *
     * To take advantage of this, your server needs to set a token in a JavaScript readable session
     * cookie called `XSRF-TOKEN` on the first HTTP GET request. On subsequent XHR requests the
     * server can verify that the cookie matches `X-XSRF-TOKEN` HTTP header, and therefore be sure
     * that only JavaScript running on your domain could have sent the request. The token must be
     * unique for each user and must be verifiable by the server (to prevent the JavaScript from
     * making up its own tokens). We recommend that the token is a digest of your site's
     * authentication cookie with a {@link https://en.wikipedia.org/wiki/Salt_(cryptography) salt}
     * for added security.
     *
     * The name of the headers can be specified using the xsrfHeaderName and xsrfCookieName
     * properties of either $httpProvider.defaults, or the per-request config object.
     *
     *
     * @param {object} config Object describing the request to be made and how it should be
     *    processed. The object has following properties:
     *
     *    - **method** – `{string}` – HTTP method (e.g. 'GET', 'POST', etc)
     *    - **url** – `{string}` – Absolute or relative URL of the resource that is being requested.
     *    - **params** – `{Object.<string|Object>}` – Map of strings or objects which will be turned
     *      to `?key1=value1&key2=value2` after the url. If the value is not a string, it will be
     *      JSONified.
     *    - **data** – `{string|Object}` – Data to be sent as the request message data.
     *    - **headers** – `{Object}` – Map of strings or functions which return strings representing
     *      HTTP headers to send to the server. If the return value of a function is null, the
     *      header will not be sent.
     *    - **xsrfHeaderName** – `{string}` – Name of HTTP header to populate with the XSRF token.
     *    - **xsrfCookieName** – `{string}` – Name of cookie containing the XSRF token.
     *    - **transformRequest** –
     *      `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
     *      transform function or an array of such functions. The transform function takes the http
     *      request body and headers and returns its transformed (typically serialized) version.
     *    - **transformResponse** –
     *      `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
     *      transform function or an array of such functions. The transform function takes the http
     *      response body and headers and returns its transformed (typically deserialized) version.
     *    - **cache** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
     *      GET request, otherwise if a cache instance built with
     *      {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
     *      caching.
     *    - **timeout** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise}
     *      that should abort the request when resolved.
     *    - **withCredentials** - `{boolean}` - whether to to set the `withCredentials` flag on the
     *      XHR object. See {@link https://developer.mozilla.org/en/http_access_control#section_5
     *      requests with credentials} for more information.
     *    - **responseType** - `{string}` - see {@link
     *      https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType requestType}.
     *
     * @returns {HttpPromise} Returns a {@link ng.$q promise} object with the
     *   standard `then` method and two http specific methods: `success` and `error`. The `then`
     *   method takes two arguments a success and an error callback which will be called with a
     *   response object. The `success` and `error` methods take a single argument - a function that
     *   will be called when the request succeeds or fails respectively. The arguments passed into
     *   these functions are destructured representation of the response object passed into the
     *   `then` method. The response object has these properties:
     *
     *   - **data** – `{string|Object}` – The response body transformed with the transform
     *     functions.
     *   - **status** – `{number}` – HTTP status code of the response.
     *   - **headers** – `{function([headerName])}` – Header getter function.
     *   - **config** – `{Object}` – The configuration object that was used to generate the request.
     *
     * @property {Array.<Object>} pendingRequests Array of config objects for currently pending
     *   requests. This is primarily meant to be used for debugging purposes.
     *
     *
     * @example
<example>
<file name="index.html">
  <div ng-controller="FetchCtrl">
    <select ng-model="method">
      <option>GET</option>
      <option>JSONP</option>
    </select>
    <input type="text" ng-model="url" size="80"/>
    <button ng-click="fetch()">fetch</button><br>
    <button ng-click="updateModel('GET', 'http-hello.html')">Sample GET</button>
    <button
      ng-click="updateModel('JSONP',
                    'http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero')">
      Sample JSONP
    </button>
    <button
      ng-click="updateModel('JSONP', 'http://angularjs.org/doesntexist&callback=JSON_CALLBACK')">
        Invalid JSONP
      </button>
    <pre>http status code: {{status}}</pre>
    <pre>http response data: {{data}}</pre>
  </div>
</file>
<file name="script.js">
  function FetchCtrl($scope, $http, $templateCache) {
    $scope.method = 'GET';
    $scope.url = 'http-hello.html';

    $scope.fetch = function() {
      $scope.code = null;
      $scope.response = null;

      $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          $scope.data = data;
        }).
        error(function(data, status) {
          $scope.data = data || "Request failed";
          $scope.status = status;
      });
    };

    $scope.updateModel = function(method, url) {
      $scope.method = method;
      $scope.url = url;
    };
  }
</file>
<file name="http-hello.html">
  Hello, $http!
</file>
<file name="scenario.js">
  it('should make an xhr GET request', function() {
    element(':button:contains("Sample GET")').click();
    element(':button:contains("fetch")').click();
    expect(binding('status')).toBe('200');
    expect(binding('data')).toMatch(/Hello, \$http!/);
  });

  it('should make a JSONP request to angularjs.org', function() {
    element(':button:contains("Sample JSONP")').click();
    element(':button:contains("fetch")').click();
    expect(binding('status')).toBe('200');
    expect(binding('data')).toMatch(/Super Hero!/);
  });

  it('should make JSONP request to invalid URL and invoke the error handler',
      function() {
    element(':button:contains("Invalid JSONP")').click();
    element(':button:contains("fetch")').click();
    expect(binding('status')).toBe('0');
    expect(binding('data')).toBe('Request failed');
  });
</file>
</example>
     */ function $http(requestConfig) {
                    var config = {
                        transformRequest: defaults.transformRequest,
                        transformResponse: defaults.transformResponse
                    }, headers = function(config) {
                        var defHeaderName, lowercaseDefHeaderName, reqHeaderName, defHeaders = defaults.headers, reqHeaders = extend({}, config.headers);
                        // execute if header value is function
                        execHeaders(defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)])), execHeaders(reqHeaders);
                        // using for-in instead of forEach to avoid unecessary iteration after header has been found
                        defaultHeadersIteration: for(defHeaderName in defHeaders){
                            for(reqHeaderName in lowercaseDefHeaderName = lowercase(defHeaderName), reqHeaders)if (lowercase(reqHeaderName) === lowercaseDefHeaderName) continue defaultHeadersIteration;
                            reqHeaders[defHeaderName] = defHeaders[defHeaderName];
                        }
                        return reqHeaders;
                        function execHeaders(headers) {
                            var headerContent;
                            forEach(headers, function(headerFn, header) {
                                isFunction(headerFn) && (null != (headerContent = headerFn()) ? headers[header] = headerContent : delete headers[header]);
                            });
                        }
                    }(requestConfig);
                    extend(config, requestConfig), config.headers = headers, config.method = uppercase(config.method);
                    var xsrfValue = urlIsSameOrigin(config.url) ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
                    xsrfValue && (headers[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue);
                    var chain = [
                        function(config) {
                            headers = config.headers;
                            var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);
                            // send request
                            return isUndefined(config.data) && forEach(headers, function(value, header) {
                                "content-type" === lowercase(header) && delete headers[header];
                            }), isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials) && (config.withCredentials = defaults.withCredentials), /**
         * Makes the request.
         *
         * !!! ACCESSES CLOSURE VARS:
         * $httpBackend, defaults, $log, $rootScope, defaultCache, $http.pendingRequests
         */ (function(config, reqData, reqHeaders) {
                                var cache, cachedResp, deferred = $q.defer(), promise = deferred.promise, url = function(url, params) {
                                    if (!params) return url;
                                    var parts = [];
                                    return function(obj, iterator, context) {
                                        for(var keys = sortedKeys(obj), i = 0; i < keys.length; i++)iterator.call(void 0, obj[keys[i]], keys[i]);
                                    }(params, function(value, key) {
                                        null === value || isUndefined(value) || (isArray(value) || (value = [
                                            value
                                        ]), forEach(value, function(v) {
                                            isObject(v) && (v = toJson(v)), parts.push(encodeUriQuery(key) + "=" + encodeUriQuery(v));
                                        }));
                                    }), url + (-1 == url.indexOf("?") ? "?" : "&") + parts.join("&");
                                }(config.url, config.params);
                                if ($http.pendingRequests.push(config), promise.then(removePendingReq, removePendingReq), (config.cache || defaults.cache) && !1 !== config.cache && "GET" == config.method && (cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache), cache) {
                                    if (isDefined(cachedResp = cache.get(url))) {
                                        if (cachedResp.then) return(// cached request has already been sent, but there is no response yet
                                        cachedResp.then(removePendingReq, removePendingReq), cachedResp);
                                        // serving from cache
                                        isArray(cachedResp) ? resolvePromise(cachedResp[1], cachedResp[0], copy(cachedResp[2])) : resolvePromise(cachedResp, 200, {});
                                    } else // put the promise for the non-transformed response into cache as a placeholder
                                    cache.put(url, promise);
                                }
                                return isUndefined(cachedResp) && $httpBackend(config.method, url, reqData, /**
           * Callback registered to $httpBackend():
           *  - caches the response if desired
           *  - resolves the raw $http promise
           *  - calls $apply
           */ function(status, response, headersString) {
                                    cache && (isSuccess(status) ? cache.put(url, [
                                        status,
                                        response,
                                        parseHeaders(headersString)
                                    ]) : // remove promise from the cache
                                    cache.remove(url)), resolvePromise(response, status, headersString), $rootScope.$$phase || $rootScope.$apply();
                                }, reqHeaders, config.timeout, config.withCredentials, config.responseType), promise;
                                /**
           * Resolves the raw $http promise.
           */ function resolvePromise(response, status, headers) {
                                    (isSuccess(// normalize internal statuses to 0
                                    status = Math.max(status, 0)) ? deferred.resolve : deferred.reject)({
                                        data: response,
                                        status: status,
                                        headers: headersGetter(headers),
                                        config: config
                                    });
                                }
                                function removePendingReq() {
                                    var idx = indexOf($http.pendingRequests, config);
                                    -1 !== idx && $http.pendingRequests.splice(idx, 1);
                                }
                            })(config, reqData, headers).then(transformResponse, transformResponse);
                        },
                        undefined
                    ], promise = $q.when(config);
                    for(// apply interceptors
                    forEach(reversedInterceptors, function(interceptor) {
                        (interceptor.request || interceptor.requestError) && chain.unshift(interceptor.request, interceptor.requestError), (interceptor.response || interceptor.responseError) && chain.push(interceptor.response, interceptor.responseError);
                    }); chain.length;){
                        var thenFn = chain.shift(), rejectFn = chain.shift();
                        promise = promise.then(thenFn, rejectFn);
                    }
                    return promise.success = function(fn) {
                        return promise.then(function(response) {
                            fn(response.data, response.status, response.headers, config);
                        }), promise;
                    }, promise.error = function(fn) {
                        return promise.then(null, function(response) {
                            fn(response.data, response.status, response.headers, config);
                        }), promise;
                    }, promise;
                    function transformResponse(response) {
                        // make a copy since the response must be cacheable
                        var resp = extend({}, response, {
                            data: transformData(response.data, response.headers, config.transformResponse)
                        });
                        return isSuccess(response.status) ? resp : $q.reject(resp);
                    }
                }
                return forEach(interceptorFactories, function(interceptorFactory) {
                    reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
                }), forEach(responseInterceptorFactories, function(interceptorFactory, index) {
                    var responseFn = isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory);
                    /**
             * Response interceptors go before "around" interceptors (no real reason, just
             * had to pick one.) But they are already reversed, so we can't use unshift, hence
             * the splice.
             */ reversedInterceptors.splice(index, 0, {
                        response: function(response) {
                            return responseFn($q.when(response));
                        },
                        responseError: function(response) {
                            return responseFn($q.reject(response));
                        }
                    });
                }), $http.pendingRequests = [], /**
         * @ngdoc method
         * @name ng.$http#get
         * @methodOf ng.$http
         *
         * @description
         * Shortcut method to perform `GET` request.
         *
         * @param {string} url Relative or absolute URL specifying the destination of the request
         * @param {Object=} config Optional configuration object
         * @returns {HttpPromise} Future object
         */ /**
         * @ngdoc method
         * @name ng.$http#delete
         * @methodOf ng.$http
         *
         * @description
         * Shortcut method to perform `DELETE` request.
         *
         * @param {string} url Relative or absolute URL specifying the destination of the request
         * @param {Object=} config Optional configuration object
         * @returns {HttpPromise} Future object
         */ /**
         * @ngdoc method
         * @name ng.$http#head
         * @methodOf ng.$http
         *
         * @description
         * Shortcut method to perform `HEAD` request.
         *
         * @param {string} url Relative or absolute URL specifying the destination of the request
         * @param {Object=} config Optional configuration object
         * @returns {HttpPromise} Future object
         */ /**
         * @ngdoc method
         * @name ng.$http#jsonp
         * @methodOf ng.$http
         *
         * @description
         * Shortcut method to perform `JSONP` request.
         *
         * @param {string} url Relative or absolute URL specifying the destination of the request.
         *                     Should contain `JSON_CALLBACK` string.
         * @param {Object=} config Optional configuration object
         * @returns {HttpPromise} Future object
         */ function(names) {
                    forEach(arguments, function(name) {
                        $http[name] = function(url, config) {
                            return $http(extend(config || {}, {
                                method: name,
                                url: url
                            }));
                        };
                    });
                }("get", "delete", "head", "jsonp"), /**
         * @ngdoc method
         * @name ng.$http#post
         * @methodOf ng.$http
         *
         * @description
         * Shortcut method to perform `POST` request.
         *
         * @param {string} url Relative or absolute URL specifying the destination of the request
         * @param {*} data Request content
         * @param {Object=} config Optional configuration object
         * @returns {HttpPromise} Future object
         */ /**
         * @ngdoc method
         * @name ng.$http#put
         * @methodOf ng.$http
         *
         * @description
         * Shortcut method to perform `PUT` request.
         *
         * @param {string} url Relative or absolute URL specifying the destination of the request
         * @param {*} data Request content
         * @param {Object=} config Optional configuration object
         * @returns {HttpPromise} Future object
         */ function(name) {
                    forEach(arguments, function(name) {
                        $http[name] = function(url, data, config) {
                            return $http(extend(config || {}, {
                                method: name,
                                url: url,
                                data: data
                            }));
                        };
                    });
                }("post", "put"), /**
         * @ngdoc property
         * @name ng.$http#defaults
         * @propertyOf ng.$http
         *
         * @description
         * Runtime equivalent of the `$httpProvider.defaults` property. Allows configuration of
         * default headers, withCredentials as well as request and response transformations.
         *
         * See "Setting HTTP Headers" and "Transforming Requests and Responses" sections above.
         */ $http.defaults = defaults, $http;
            }
        ];
    }
    var XHR = window1.XMLHttpRequest || function() {
        /* global ActiveXObject */ try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e1) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e2) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e3) {}
        throw minErr("$httpBackend")("noxhr", "This browser does not support XMLHttpRequest.");
    };
    /**
   * @ngdoc object
   * @name ng.$httpBackend
   * @requires $browser
   * @requires $window
   * @requires $document
   *
   * @description
   * HTTP backend used by the {@link ng.$http service} that delegates to
   * XMLHttpRequest object or JSONP and deals with browser incompatibilities.
   *
   * You should never need to use this service directly, instead use the higher-level abstractions:
   * {@link ng.$http $http} or {@link ngResource.$resource $resource}.
   *
   * During testing this implementation is swapped with {@link ngMock.$httpBackend mock
   * $httpBackend} which can be trained with responses.
   */ function $HttpBackendProvider() {
        this.$get = [
            "$browser",
            "$window",
            "$document",
            function($browser, $window, $document) {
                var $browser1, XHR1, $browserDefer, callbacks, rawDocument;
                return $browser1 = $browser, XHR1 = XHR, $browserDefer = $browser.defer, callbacks = $window.angular.callbacks, rawDocument = $document[0], function(method, url, post, callback, headers, timeout, withCredentials, responseType) {
                    var status;
                    if ($browser1.$$incOutstandingRequestCount(), url = url || $browser1.url(), "jsonp" == lowercase(method)) {
                        var url1, done, script, doneWrapper, callbackId = "_" + (callbacks.counter++).toString(36);
                        callbacks[callbackId] = function(data) {
                            callbacks[callbackId].data = data;
                        };
                        var jsonpDone = (url1 = url.replace("JSON_CALLBACK", "angular.callbacks." + callbackId), done = function() {
                            callbacks[callbackId].data ? completeRequest(callback, 200, callbacks[callbackId].data) : completeRequest(callback, status || -2), delete callbacks[callbackId];
                        }, script = rawDocument.createElement("script"), doneWrapper = function() {
                            script.onreadystatechange = script.onload = script.onerror = null, rawDocument.body.removeChild(script), done && done();
                        }, script.type = "text/javascript", script.src = url1, msie && msie <= 8 ? script.onreadystatechange = function() {
                            /loaded|complete/.test(script.readyState) && doneWrapper();
                        } : script.onload = script.onerror = function() {
                            doneWrapper();
                        }, rawDocument.body.appendChild(script), doneWrapper);
                    } else {
                        var xhr = new XHR1();
                        xhr.open(method, url, !0), forEach(headers, function(value, key) {
                            isDefined(value) && xhr.setRequestHeader(key, value);
                        }), // In IE6 and 7, this might be called synchronously when xhr.send below is called and the
                        // response is in the cache. the promise api will ensure that to the app code the api is
                        // always async
                        xhr.onreadystatechange = function() {
                            if (4 == xhr.readyState) {
                                var responseHeaders = null, response = null;
                                -1 !== status && (responseHeaders = xhr.getAllResponseHeaders(), response = xhr.responseType ? xhr.response : xhr.responseText), // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                                // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
                                completeRequest(callback, status || xhr.status, response, responseHeaders);
                            }
                        }, withCredentials && (xhr.withCredentials = !0), responseType && (xhr.responseType = responseType), xhr.send(post || null);
                    }
                    if (timeout > 0) var timeoutId = $browserDefer(timeoutRequest, timeout);
                    else timeout && timeout.then && timeout.then(timeoutRequest);
                    function timeoutRequest() {
                        status = -1, jsonpDone && jsonpDone(), xhr && xhr.abort();
                    }
                    function completeRequest(callback, status, response, headersString) {
                        var protocol = urlResolve(url).protocol;
                        // cancel timeout and subsequent timeout promise resolution
                        timeoutId && $browserDefer.cancel(timeoutId), jsonpDone = xhr = null, callback(// normalize IE bug (http://bugs.jquery.com/ticket/1450)
                        status = 1223 == // fix status code for file protocol (it's always 0)
                        (status = "file" == protocol && 0 === status ? response ? 200 : 404 : status) ? 204 : status, response, headersString), $browser1.$$completeOutstandingRequest(noop);
                    }
                };
            }
        ];
    }
    var $interpolateMinErr = minErr("$interpolate");
    /**
 * @ngdoc object
 * @name ng.$interpolateProvider
 * @function
 *
 * @description
 *
 * Used for configuring the interpolation markup. Defaults to `{{` and `}}`.
 *
 * @example
<doc:example module="customInterpolationApp">
<doc:source>
<script>
  var customInterpolationApp = angular.module('customInterpolationApp', []);

  customInterpolationApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('//');
    $interpolateProvider.endSymbol('//');
  });


  customInterpolationApp.controller('DemoController', function DemoController() {
      this.label = "This binding is brought you by // interpolation symbols.";
  });
</script>
<div ng-app="App" ng-controller="DemoController as demo">
    //demo.label//
</div>
</doc:source>
<doc:scenario>
 it('should interpolate binding with custom symbols', function() {
  expect(binding('demo.label')).toBe('This binding is brought you by // interpolation symbols.');
 });
</doc:scenario>
</doc:example>
 */ function $InterpolateProvider() {
        var startSymbol = "{{", endSymbol = "}}";
        /**
     * @ngdoc method
     * @name ng.$interpolateProvider#startSymbol
     * @methodOf ng.$interpolateProvider
     * @description
     * Symbol to denote start of expression in the interpolated string. Defaults to `{{`.
     *
     * @param {string=} value new value to set the starting symbol to.
     * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
     */ this.startSymbol = function(value) {
            return value ? (startSymbol = value, this) : startSymbol;
        }, /**
     * @ngdoc method
     * @name ng.$interpolateProvider#endSymbol
     * @methodOf ng.$interpolateProvider
     * @description
     * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
     *
     * @param {string=} value new value to set the ending symbol to.
     * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
     */ this.endSymbol = function(value) {
            return value ? (endSymbol = value, this) : endSymbol;
        }, this.$get = [
            "$parse",
            "$exceptionHandler",
            "$sce",
            function($parse, $exceptionHandler, $sce) {
                var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length;
                /**
     * @ngdoc function
     * @name ng.$interpolate
     * @function
     *
     * @requires $parse
     * @requires $sce
     *
     * @description
     *
     * Compiles a string with markup into an interpolation function. This service is used by the
     * HTML {@link ng.$compile $compile} service for data binding. See
     * {@link ng.$interpolateProvider $interpolateProvider} for configuring the
     * interpolation markup.
     *
     *
       <pre>
         var $interpolate = ...; // injected
         var exp = $interpolate('Hello {{name | uppercase}}!');
         expect(exp({name:'Angular'}).toEqual('Hello ANGULAR!');
       </pre>
     *
     *
     * @param {string} text The text with markup to interpolate.
     * @param {boolean=} mustHaveExpression if set to true then the interpolation string must have
     *    embedded expression in order to return an interpolation function. Strings with no
     *    embedded expression will return null for the interpolation function.
     * @param {string=} trustedContext when provided, the returned function passes the interpolated
     *    result through {@link ng.$sce#methods_getTrusted $sce.getTrusted(interpolatedResult,
     *    trustedContext)} before returning it.  Refer to the {@link ng.$sce $sce} service that
     *    provides Strict Contextual Escaping for details.
     * @returns {function(context)} an interpolation function which is used to compute the
     *    interpolated string. The function has these parameters:
     *
     *    * `context`: an object against which any expressions embedded in the strings are evaluated
     *      against.
     *
     */ function $interpolate(text, mustHaveExpression, trustedContext) {
                    for(var startIndex, endIndex, fn, exp, index = 0, parts = [], length = text.length, hasInterpolation = !1, concat = []; index < length;)-1 != (startIndex = text.indexOf(startSymbol, index)) && -1 != (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) ? (index != startIndex && parts.push(text.substring(index, startIndex)), parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex))), fn.exp = exp, index = endIndex + endSymbolLength, hasInterpolation = !0) : (// we did not find anything, so we have to add the remainder to the parts array
                    index != length && parts.push(text.substring(index)), index = length);
                    // Concatenating expressions makes it hard to reason about whether some combination of
                    // concatenated values are unsafe to use and could easily lead to XSS.  By requiring that a
                    // single expression be used for iframe[src], object[src], etc., we ensure that the value
                    // that's used is assigned or constructed by some JS code somewhere that is more testable or
                    // make it obvious that you bound the value to some user controlled value.  This helps reduce
                    // the load when auditing for XSS issues.
                    if ((length = parts.length) || (// we added, nothing, must have been an empty string.
                    parts.push(""), length = 1), trustedContext && parts.length > 1) throw $interpolateMinErr("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", text);
                    if (!mustHaveExpression || hasInterpolation) return concat.length = length, (fn = function(context) {
                        try {
                            for(var part, i = 0, ii = length; i < ii; i++)"function" == typeof (part = parts[i]) && (part = part(context), part = trustedContext ? $sce.getTrusted(trustedContext, part) : $sce.valueOf(part), null === part || isUndefined(part) ? part = "" : "string" != typeof part && (part = toJson(part))), concat[i] = part;
                            return concat.join("");
                        } catch (err) {
                            $exceptionHandler($interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString()));
                        }
                    }).exp = text, fn.parts = parts, fn;
                }
                return(/**
         * @ngdoc method
         * @name ng.$interpolate#startSymbol
         * @methodOf ng.$interpolate
         * @description
         * Symbol to denote the start of expression in the interpolated string. Defaults to `{{`.
         *
         * Use {@link ng.$interpolateProvider#startSymbol $interpolateProvider#startSymbol} to change
         * the symbol.
         *
         * @returns {string} start symbol.
         */ $interpolate.startSymbol = function() {
                    return startSymbol;
                }, /**
         * @ngdoc method
         * @name ng.$interpolate#endSymbol
         * @methodOf ng.$interpolate
         * @description
         * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
         *
         * Use {@link ng.$interpolateProvider#endSymbol $interpolateProvider#endSymbol} to change
         * the symbol.
         *
         * @returns {string} start symbol.
         */ $interpolate.endSymbol = function() {
                    return endSymbol;
                }, $interpolate);
            }
        ];
    }
    function $IntervalProvider() {
        this.$get = [
            "$rootScope",
            "$window",
            "$q",
            function($rootScope, $window, $q) {
                var intervals = {};
                /**
         * @ngdoc function
         * @name ng.$interval
         *
         * @description
         * Angular's wrapper for `window.setInterval`. The `fn` function is executed every `delay`
         * milliseconds.
         *
         * The return value of registering an interval function is a promise. This promise will be
         * notified upon each tick of the interval, and will be resolved after `count` iterations, or
         * run indefinitely if `count` is not defined. The value of the notification will be the
         * number of iterations that have run.
         * To cancel an interval, call `$interval.cancel(promise)`.
         *
         * In tests you can use {@link ngMock.$interval#methods_flush `$interval.flush(millis)`} to
         * move forward by `millis` milliseconds and trigger any functions scheduled to run in that
         * time.
         *
         * @param {function()} fn A function that should be called repeatedly.
         * @param {number} delay Number of milliseconds between each function call.
         * @param {number=} [count=0] Number of times to repeat. If not set, or 0, will repeat
         *   indefinitely.
         * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
         *   will invoke `fn` within the {@link ng.$rootScope.Scope#methods_$apply $apply} block.
         * @returns {promise} A promise which will be notified on each iteration.
         */ function interval(fn, delay, count, invokeApply) {
                    var setInterval = $window.setInterval, clearInterval1 = $window.clearInterval, deferred = $q.defer(), promise = deferred.promise, iteration = 0, skipApply = isDefined(invokeApply) && !invokeApply;
                    return count = isDefined(count) ? count : 0, promise.then(null, null, fn), promise.$$intervalId = setInterval(function() {
                        deferred.notify(iteration++), count > 0 && iteration >= count && (deferred.resolve(iteration), clearInterval1(promise.$$intervalId), delete intervals[promise.$$intervalId]), skipApply || $rootScope.$apply();
                    }, delay), intervals[promise.$$intervalId] = deferred, promise;
                }
                return(/**
         * @ngdoc function
         * @name ng.$interval#cancel
         * @methodOf ng.$interval
         *
         * @description
         * Cancels a task associated with the `promise`.
         *
         * @param {number} promise Promise returned by the `$interval` function.
         * @returns {boolean} Returns `true` if the task was successfully canceled.
         */ interval.cancel = function(promise) {
                    return !!promise && promise.$$intervalId in intervals && (intervals[promise.$$intervalId].reject("canceled"), clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId], !0);
                }, interval);
            }
        ];
    }
    /**
   * @ngdoc object
   * @name ng.$locale
   *
   * @description
   * $locale service provides localization rules for various Angular components. As of right now the
   * only public api is:
   *
   * * `id` – `{string}` – locale id formatted as `languageId-countryId` (e.g. `en-us`)
   */ function $LocaleProvider() {
        this.$get = function() {
            return {
                id: "en-us",
                NUMBER_FORMATS: {
                    DECIMAL_SEP: ".",
                    GROUP_SEP: ",",
                    PATTERNS: [
                        {
                            // Decimal Pattern
                            minInt: 1,
                            minFrac: 0,
                            maxFrac: 3,
                            posPre: "",
                            posSuf: "",
                            negPre: "-",
                            negSuf: "",
                            gSize: 3,
                            lgSize: 3
                        },
                        {
                            //Currency Pattern
                            minInt: 1,
                            minFrac: 2,
                            maxFrac: 2,
                            posPre: "\u00A4",
                            posSuf: "",
                            negPre: "(\u00A4",
                            negSuf: ")",
                            gSize: 3,
                            lgSize: 3
                        }
                    ],
                    CURRENCY_SYM: "$"
                },
                DATETIME_FORMATS: {
                    MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
                    SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
                    DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                    SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                    AMPMS: [
                        "AM",
                        "PM"
                    ],
                    medium: "MMM d, y h:mm:ss a",
                    short: "M/d/yy h:mm a",
                    fullDate: "EEEE, MMMM d, y",
                    longDate: "MMMM d, y",
                    mediumDate: "MMM d, y",
                    shortDate: "M/d/yy",
                    mediumTime: "h:mm:ss a",
                    shortTime: "h:mm a"
                },
                pluralCat: function(num) {
                    return 1 === num ? "one" : "other";
                }
            };
        };
    }
    var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, DEFAULT_PORTS = {
        http: 80,
        https: 443,
        ftp: 21
    }, $locationMinErr = minErr("$location");
    /**
   * Encode path using encodeUriSegment, ignoring forward slashes
   *
   * @param {string} path Path to encode
   * @returns {string}
   */ function encodePath(path) {
        for(var segments = path.split("/"), i = segments.length; i--;)segments[i] = encodeUriSegment(segments[i]);
        return segments.join("/");
    }
    function parseAbsoluteUrl(absoluteUrl, locationObj, appBase) {
        var parsedUrl = urlResolve(absoluteUrl, appBase);
        locationObj.$$protocol = parsedUrl.protocol, locationObj.$$host = parsedUrl.hostname, locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
    }
    function parseAppUrl(relativeUrl, locationObj, appBase) {
        var prefixed = "/" !== relativeUrl.charAt(0);
        prefixed && (relativeUrl = "/" + relativeUrl);
        var match = urlResolve(relativeUrl, appBase);
        locationObj.$$path = decodeURIComponent(prefixed && "/" === match.pathname.charAt(0) ? match.pathname.substring(1) : match.pathname), locationObj.$$search = parseKeyValue(match.search), locationObj.$$hash = decodeURIComponent(match.hash), locationObj.$$path && "/" != locationObj.$$path.charAt(0) && (locationObj.$$path = "/" + locationObj.$$path);
    }
    /**
   *
   * @param {string} begin
   * @param {string} whole
   * @returns {string} returns text from whole after begin or undefined if it does not begin with
   *                   expected string.
   */ function beginsWith(begin, whole) {
        if (0 === whole.indexOf(begin)) return whole.substr(begin.length);
    }
    function stripHash(url) {
        var index = url.indexOf("#");
        return -1 == index ? url : url.substr(0, index);
    }
    function stripFile(url) {
        return url.substr(0, stripHash(url).lastIndexOf("/") + 1);
    }
    /**
   * LocationHtml5Url represents an url
   * This object is exposed as $location service when HTML5 mode is enabled and supported
   *
   * @constructor
   * @param {string} appBase application base URL
   * @param {string} basePrefix url path prefix
   */ function LocationHtml5Url(appBase, basePrefix) {
        this.$$html5 = !0, basePrefix = basePrefix || "";
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this, appBase), /**
     * Parse given html5 (regular) url string into properties
     * @param {string} newAbsoluteUrl HTML5 url
     * @private
     */ this.$$parse = function(url) {
            var pathUrl = beginsWith(appBaseNoFile, url);
            if (!isString(pathUrl)) throw $locationMinErr("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
            parseAppUrl(pathUrl, this, appBase), this.$$path || (this.$$path = "/"), this.$$compose();
        }, /**
     * Compose url and update `absUrl` property
     * @private
     */ this.$$compose = function() {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
        }, this.$$rewrite = function(url) {
            var appUrl, prevAppUrl;
            return (appUrl = beginsWith(appBase, url)) !== undefined ? (prevAppUrl = appUrl, (appUrl = beginsWith(basePrefix, appUrl)) !== undefined) ? appBaseNoFile + (beginsWith("/", appUrl) || appUrl) : appBase + prevAppUrl : (appUrl = beginsWith(appBaseNoFile, url)) !== undefined ? appBaseNoFile + appUrl : appBaseNoFile == url + "/" ? appBaseNoFile : void 0;
        };
    }
    /**
   * LocationHashbangUrl represents url
   * This object is exposed as $location service when developer doesn't opt into html5 mode.
   * It also serves as the base class for html5 mode fallback on legacy browsers.
   *
   * @constructor
   * @param {string} appBase application base URL
   * @param {string} hashPrefix hashbang prefix
   */ function LocationHashbangUrl(appBase, hashPrefix) {
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this, appBase), /**
     * Parse given hashbang url into properties
     * @param {string} url Hashbang url
     * @private
     */ this.$$parse = function(url) {
            var path, url1, base, firstPathSegmentMatch, windowsFilePathExp, withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url), withoutHashUrl = "#" == withoutBaseUrl.charAt(0) ? beginsWith(hashPrefix, withoutBaseUrl) : this.$$html5 ? withoutBaseUrl : "";
            if (!isString(withoutHashUrl)) throw $locationMinErr("ihshprfx", 'Invalid url "{0}", missing hash prefix "{1}".', url, hashPrefix);
            parseAppUrl(withoutHashUrl, this, appBase), this.$$path = (path = this.$$path, url1 = withoutHashUrl, base = appBase, windowsFilePathExp = /^\/?.*?:(\/.*)/, /*
         * The input URL intentionally contains a
         * first path segment that ends with a colon.
         */ (0 === url1.indexOf(base) && (url1 = url1.replace(base, "")), windowsFilePathExp.exec(url1)) ? path : (firstPathSegmentMatch = windowsFilePathExp.exec(path)) ? firstPathSegmentMatch[1] : path), this.$$compose();
        }, /**
     * Compose hashbang url and update `absUrl` property
     * @private
     */ this.$$compose = function() {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : "");
        }, this.$$rewrite = function(url) {
            if (stripHash(appBase) == stripHash(url)) return url;
        };
    }
    /**
   * LocationHashbangUrl represents url
   * This object is exposed as $location service when html5 history api is enabled but the browser
   * does not support it.
   *
   * @constructor
   * @param {string} appBase application base URL
   * @param {string} hashPrefix hashbang prefix
   */ function LocationHashbangInHtml5Url(appBase, hashPrefix) {
        this.$$html5 = !0, LocationHashbangUrl.apply(this, arguments);
        var appBaseNoFile = stripFile(appBase);
        this.$$rewrite = function(url) {
            var appUrl;
            return appBase == stripHash(url) ? url : (appUrl = beginsWith(appBaseNoFile, url)) ? appBase + hashPrefix + appUrl : appBaseNoFile === url + "/" ? appBaseNoFile : void 0;
        };
    }
    function locationGetter(property) {
        return function() {
            return this[property];
        };
    }
    function locationGetterSetter(property, preprocess) {
        return function(value) {
            return isUndefined(value) ? this[property] : (this[property] = preprocess(value), this.$$compose(), this);
        };
    }
    /**
   * @ngdoc object
   * @name ng.$location
   *
   * @requires $browser
   * @requires $sniffer
   * @requires $rootElement
   *
   * @description
   * The $location service parses the URL in the browser address bar (based on the
   * {@link https://developer.mozilla.org/en/window.location window.location}) and makes the URL
   * available to your application. Changes to the URL in the address bar are reflected into
   * $location service and changes to $location are reflected into the browser address bar.
   *
   * **The $location service:**
   *
   * - Exposes the current URL in the browser address bar, so you can
   *   - Watch and observe the URL.
   *   - Change the URL.
   * - Synchronizes the URL with the browser when the user
   *   - Changes the address bar.
   *   - Clicks the back or forward button (or clicks a History link).
   *   - Clicks on a link.
   * - Represents the URL object as a set of methods (protocol, host, port, path, search, hash).
   *
   * For more information see {@link guide/dev_guide.services.$location Developer Guide: Angular
   * Services: Using $location}
   */ /**
   * @ngdoc object
   * @name ng.$locationProvider
   * @description
   * Use the `$locationProvider` to configure how the application deep linking paths are stored.
   */ function $LocationProvider() {
        var hashPrefix = "", html5Mode = !1;
        /**
     * @ngdoc property
     * @name ng.$locationProvider#hashPrefix
     * @methodOf ng.$locationProvider
     * @description
     * @param {string=} prefix Prefix for hash part (containing path and search)
     * @returns {*} current value if used as getter or itself (chaining) if used as setter
     */ this.hashPrefix = function(prefix) {
            return isDefined(prefix) ? (hashPrefix = prefix, this) : hashPrefix;
        }, /**
     * @ngdoc property
     * @name ng.$locationProvider#html5Mode
     * @methodOf ng.$locationProvider
     * @description
     * @param {boolean=} mode Use HTML5 strategy if available.
     * @returns {*} current value if used as getter or itself (chaining) if used as setter
     */ this.html5Mode = function(mode) {
            return isDefined(mode) ? (html5Mode = mode, this) : html5Mode;
        }, /**
     * @ngdoc event
     * @name ng.$location#$locationChangeStart
     * @eventOf ng.$location
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a URL will change. This change can be prevented by calling
     * `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on} for more
     * details about event object. Upon successful change
     * {@link ng.$location#$locationChangeSuccess $locationChangeSuccess} is fired.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {string} newUrl New URL
     * @param {string=} oldUrl URL that was before it was changed.
     */ /**
     * @ngdoc event
     * @name ng.$location#$locationChangeSuccess
     * @eventOf ng.$location
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a URL was changed.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {string} newUrl New URL
     * @param {string=} oldUrl URL that was before it was changed.
     */ this.$get = [
            "$rootScope",
            "$browser",
            "$sniffer",
            "$rootElement",
            function($rootScope, $browser, $sniffer, $rootElement) {
                var $location, LocationMode, appBase, baseHref = $browser.baseHref(), initialUrl = $browser.url();
                html5Mode ? (appBase = initialUrl.substring(0, initialUrl.indexOf("/", initialUrl.indexOf("//") + 2)) + (baseHref || "/"), LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url) : (appBase = stripHash(initialUrl), LocationMode = LocationHashbangUrl), ($location = new LocationMode(appBase, "#" + hashPrefix)).$$parse($location.$$rewrite(initialUrl)), $rootElement.on("click", function(event) {
                    // TODO(vojta): rewrite link when opening in new tab/window (in legacy browser)
                    // currently we open nice url link and redirect then
                    if (!event.ctrlKey && !event.metaKey && 2 != event.which) {
                        // traverse the DOM up to find first A tag
                        for(var elm = jqLite(event.target); "a" !== lowercase(elm[0].nodeName);)// ignore rewriting if no A tag (reached root element, or no parent - removed from document)
                        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
                        var absHref = elm.prop("href"), rewrittenUrl = $location.$$rewrite(absHref);
                        absHref && !elm.attr("target") && rewrittenUrl && !event.isDefaultPrevented() && (event.preventDefault(), rewrittenUrl != $browser.url() && (// update location manually
                        $location.$$parse(rewrittenUrl), $rootScope.$apply(), // hack to work around FF6 bug 684208 when scenario runner clicks on links
                        window1.angular["ff-684208-preventDefault"] = !0));
                    }
                }), $location.absUrl() != initialUrl && $browser.url($location.absUrl(), !0), // update $location when $browser url changes
                $browser.onUrlChange(function(newUrl) {
                    if ($location.absUrl() != newUrl) {
                        if ($rootScope.$broadcast("$locationChangeStart", newUrl, $location.absUrl()).defaultPrevented) {
                            $browser.url($location.absUrl());
                            return;
                        }
                        $rootScope.$evalAsync(function() {
                            var oldUrl = $location.absUrl();
                            $location.$$parse(newUrl), afterLocationChange(oldUrl);
                        }), $rootScope.$$phase || $rootScope.$digest();
                    }
                });
                // update browser
                var changeCounter = 0;
                return $rootScope.$watch(function() {
                    var oldUrl = $browser.url(), currentReplace = $location.$$replace;
                    return changeCounter && oldUrl == $location.absUrl() || (changeCounter++, $rootScope.$evalAsync(function() {
                        $rootScope.$broadcast("$locationChangeStart", $location.absUrl(), oldUrl).defaultPrevented ? $location.$$parse(oldUrl) : ($browser.url($location.absUrl(), currentReplace), afterLocationChange(oldUrl));
                    })), $location.$$replace = !1, changeCounter;
                }), $location;
                function afterLocationChange(oldUrl) {
                    $rootScope.$broadcast("$locationChangeSuccess", $location.absUrl(), oldUrl);
                }
            }
        ];
    }
    /**
 * @ngdoc object
 * @name ng.$log
 * @requires $window
 *
 * @description
 * Simple service for logging. Default implementation safely writes the message
 * into the browser's console (if present).
 * 
 * The main purpose of this service is to simplify debugging and troubleshooting.
 *
 * The default is to log `debug` messages. You can use
 * {@link ng.$logProvider ng.$logProvider#debugEnabled} to change this.
 *
 * @example
   <example>
     <file name="script.js">
       function LogCtrl($scope, $log) {
         $scope.$log = $log;
         $scope.message = 'Hello World!';
       }
     </file>
     <file name="index.html">
       <div ng-controller="LogCtrl">
         <p>Reload this page with open console, enter text and hit the log button...</p>
         Message:
         <input type="text" ng-model="message"/>
         <button ng-click="$log.log(message)">log</button>
         <button ng-click="$log.warn(message)">warn</button>
         <button ng-click="$log.info(message)">info</button>
         <button ng-click="$log.error(message)">error</button>
       </div>
     </file>
   </example>
 */ /**
   * @ngdoc object
   * @name ng.$logProvider
   * @description
   * Use the `$logProvider` to configure how the application logs messages
   */ function $LogProvider() {
        var debug = !0, self = this;
        /**
     * @ngdoc property
     * @name ng.$logProvider#debugEnabled
     * @methodOf ng.$logProvider
     * @description
     * @param {string=} flag enable or disable debug level messages
     * @returns {*} current value if used as getter or itself (chaining) if used as setter
     */ this.debugEnabled = function(flag) {
            return isDefined(flag) ? (debug = flag, this) : debug;
        }, this.$get = [
            "$window",
            function($window) {
                var fn;
                return {
                    /**
           * @ngdoc method
           * @name ng.$log#log
           * @methodOf ng.$log
           *
           * @description
           * Write a log message
           */ log: consoleLog("log"),
                    /**
           * @ngdoc method
           * @name ng.$log#info
           * @methodOf ng.$log
           *
           * @description
           * Write an information message
           */ info: consoleLog("info"),
                    /**
           * @ngdoc method
           * @name ng.$log#warn
           * @methodOf ng.$log
           *
           * @description
           * Write a warning message
           */ warn: consoleLog("warn"),
                    /**
           * @ngdoc method
           * @name ng.$log#error
           * @methodOf ng.$log
           *
           * @description
           * Write an error message
           */ error: consoleLog("error"),
                    /**
           * @ngdoc method
           * @name ng.$log#debug
           * @methodOf ng.$log
           *
           * @description
           * Write a debug message
           */ debug: (fn = consoleLog("debug"), function() {
                        debug && fn.apply(self, arguments);
                    })
                };
                function consoleLog(type) {
                    var console = $window.console || {}, logFn = console[type] || console.log || noop;
                    return logFn.apply ? function() {
                        var args = [];
                        return forEach(arguments, function(arg) {
                            var arg1;
                            args.push(((arg1 = arg) instanceof Error && (arg1.stack ? arg1 = arg1.message && -1 === arg1.stack.indexOf(arg1.message) ? "Error: " + arg1.message + "\n" + arg1.stack : arg1.stack : arg1.sourceURL && (arg1 = arg1.message + "\n" + arg1.sourceURL + ":" + arg1.line)), arg1));
                        }), logFn.apply(console, args);
                    } : function(arg1, arg2) {
                        logFn(arg1, null == arg2 ? "" : arg2);
                    };
                }
            }
        ];
    }
    LocationHashbangInHtml5Url.prototype = LocationHashbangUrl.prototype = LocationHtml5Url.prototype = {
        /**
         * Are we in html5 mode?
         * @private
         */ $$html5: !1,
        /**
         * Has any change been replacing ?
         * @private
         */ $$replace: !1,
        /**
         * @ngdoc method
         * @name ng.$location#absUrl
         * @methodOf ng.$location
         *
         * @description
         * This method is getter only.
         *
         * Return full url representation with all segments encoded according to rules specified in
         * {@link http://www.ietf.org/rfc/rfc3986.txt RFC 3986}.
         *
         * @return {string} full url
         */ absUrl: locationGetter("$$absUrl"),
        /**
         * @ngdoc method
         * @name ng.$location#url
         * @methodOf ng.$location
         *
         * @description
         * This method is getter / setter.
         *
         * Return url (e.g. `/path?a=b#hash`) when called without any parameter.
         *
         * Change path, search and hash, when called with parameter and return `$location`.
         *
         * @param {string=} url New url without base prefix (e.g. `/path?a=b#hash`)
         * @param {string=} replace The path that will be changed
         * @return {string} url
         */ url: function(url, replace) {
            if (isUndefined(url)) return this.$$url;
            var match = PATH_MATCH.exec(url);
            return match[1] && this.path(decodeURIComponent(match[1])), (match[2] || match[1]) && this.search(match[3] || ""), this.hash(match[5] || "", replace), this;
        },
        /**
         * @ngdoc method
         * @name ng.$location#protocol
         * @methodOf ng.$location
         *
         * @description
         * This method is getter only.
         *
         * Return protocol of current url.
         *
         * @return {string} protocol of current url
         */ protocol: locationGetter("$$protocol"),
        /**
         * @ngdoc method
         * @name ng.$location#host
         * @methodOf ng.$location
         *
         * @description
         * This method is getter only.
         *
         * Return host of current url.
         *
         * @return {string} host of current url.
         */ host: locationGetter("$$host"),
        /**
         * @ngdoc method
         * @name ng.$location#port
         * @methodOf ng.$location
         *
         * @description
         * This method is getter only.
         *
         * Return port of current url.
         *
         * @return {Number} port
         */ port: locationGetter("$$port"),
        /**
         * @ngdoc method
         * @name ng.$location#path
         * @methodOf ng.$location
         *
         * @description
         * This method is getter / setter.
         *
         * Return path of current url when called without any parameter.
         *
         * Change path when called with parameter and return `$location`.
         *
         * Note: Path should always begin with forward slash (/), this method will add the forward slash
         * if it is missing.
         *
         * @param {string=} path New path
         * @return {string} path
         */ path: locationGetterSetter("$$path", function(path) {
            return "/" == path.charAt(0) ? path : "/" + path;
        }),
        /**
         * @ngdoc method
         * @name ng.$location#search
         * @methodOf ng.$location
         *
         * @description
         * This method is getter / setter.
         *
         * Return search part (as object) of current url when called without any parameter.
         *
         * Change search part when called with parameter and return `$location`.
         *
         * @param {string|Object.<string>|Object.<Array.<string>>} search New search params - string or
         * hash object. Hash object may contain an array of values, which will be decoded as duplicates in
         * the url.
         *
         * @param {(string|Array<string>)=} paramValue If `search` is a string, then `paramValue` will override only a
         * single search parameter. If `paramValue` is an array, it will set the parameter as a
         * comma-separated value. If `paramValue` is `null`, the parameter will be deleted.
         *
         * @return {string} search
         */ search: function(search, paramValue) {
            switch(arguments.length){
                case 0:
                    return this.$$search;
                case 1:
                    if (isString(search)) this.$$search = parseKeyValue(search);
                    else if (isObject(search)) this.$$search = search;
                    else throw $locationMinErr("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
                    break;
                default:
                    isUndefined(paramValue) || null === paramValue ? delete this.$$search[search] : this.$$search[search] = paramValue;
            }
            return this.$$compose(), this;
        },
        /**
         * @ngdoc method
         * @name ng.$location#hash
         * @methodOf ng.$location
         *
         * @description
         * This method is getter / setter.
         *
         * Return hash fragment when called without any parameter.
         *
         * Change hash fragment when called with parameter and return `$location`.
         *
         * @param {string=} hash New hash fragment
         * @return {string} hash
         */ hash: locationGetterSetter("$$hash", identity),
        /**
         * @ngdoc method
         * @name ng.$location#replace
         * @methodOf ng.$location
         *
         * @description
         * If called, all changes to $location during current `$digest` will be replacing current history
         * record, instead of adding new one.
         */ replace: function() {
            return this.$$replace = !0, this;
        }
    };
    var $parseMinErr = minErr("$parse"), promiseWarningCache = {};
    // Sandboxing Angular Expressions
    // ------------------------------
    // Angular expressions are generally considered safe because these expressions only have direct
    // access to $scope and locals. However, one can obtain the ability to execute arbitrary JS code by
    // obtaining a reference to native JS functions such as the Function constructor.
    //
    // As an example, consider the following Angular expression:
    //
    //   {}.toString.constructor(alert("evil JS code"))
    //
    // We want to prevent this type of access. For the sake of performance, during the lexing phase we
    // disallow any "dotted" access to any member named "constructor".
    //
    // For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor
    // while evaluating the expression, which is a stronger but more expensive test. Since reflective
    // calls are expensive anyway, this is not such a big deal compared to static dereferencing.
    //
    // This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits
    // against the expression language, but not to prevent exploits that were enabled by exposing
    // sensitive JavaScript or browser apis on Scope. Exposing such objects on a Scope is never a good
    // practice and therefore we are not even trying to protect against interaction with an object
    // explicitly exposed in this way.
    //
    // A developer could foil the name check by aliasing the Function constructor under a different
    // name on the scope.
    //
    // In general, it is not possible to access a Window object from an angular expression unless a
    // window or some DOM object that has a reference to window is published onto a Scope.
    function ensureSafeMemberName(name, fullExpression) {
        if ("constructor" === name) throw $parseMinErr("isecfld", 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
        return name;
    }
    function ensureSafeObject(obj, fullExpression) {
        // nifty check if obj is Function that is fast and works across iframes and other contexts
        if (obj) {
            if (obj.constructor === obj) throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (// isWindow(obj)
            obj.document && obj.location && obj.alert && obj.setInterval) throw $parseMinErr("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (// isElement(obj)
            obj.children && (obj.nodeName || obj.on && obj.find)) throw $parseMinErr("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", fullExpression);
        }
        return obj;
    }
    var OPERATORS = {
        /* jshint bitwise : false */ null: function() {
            return null;
        },
        true: function() {
            return !0;
        },
        false: function() {
            return !1;
        },
        undefined: noop,
        "+": function(self, locals, a, b) {
            return (a = a(self, locals), b = b(self, locals), isDefined(a)) ? isDefined(b) ? a + b : a : isDefined(b) ? b : undefined;
        },
        "-": function(self, locals, a, b) {
            return a = a(self, locals), b = b(self, locals), (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
        },
        "*": function(self, locals, a, b) {
            return a(self, locals) * b(self, locals);
        },
        "/": function(self, locals, a, b) {
            return a(self, locals) / b(self, locals);
        },
        "%": function(self, locals, a, b) {
            return a(self, locals) % b(self, locals);
        },
        "^": function(self, locals, a, b) {
            return a(self, locals) ^ b(self, locals);
        },
        "=": noop,
        "===": function(self, locals, a, b) {
            return a(self, locals) === b(self, locals);
        },
        "!==": function(self, locals, a, b) {
            return a(self, locals) !== b(self, locals);
        },
        "==": function(self, locals, a, b) {
            return a(self, locals) == b(self, locals);
        },
        "!=": function(self, locals, a, b) {
            return a(self, locals) != b(self, locals);
        },
        "<": function(self, locals, a, b) {
            return a(self, locals) < b(self, locals);
        },
        ">": function(self, locals, a, b) {
            return a(self, locals) > b(self, locals);
        },
        "<=": function(self, locals, a, b) {
            return a(self, locals) <= b(self, locals);
        },
        ">=": function(self, locals, a, b) {
            return a(self, locals) >= b(self, locals);
        },
        "&&": function(self, locals, a, b) {
            return a(self, locals) && b(self, locals);
        },
        "||": function(self, locals, a, b) {
            return a(self, locals) || b(self, locals);
        },
        "&": function(self, locals, a, b) {
            return a(self, locals) & b(self, locals);
        },
        //    '|':function(self, locals, a,b){return a|b;},
        "|": function(self, locals, a, b) {
            return b(self, locals)(self, locals, a(self, locals));
        },
        "!": function(self, locals, a) {
            return !a(self, locals);
        }
    }, ESCAPE = {
        n: "\n",
        f: "\f",
        r: "\r",
        t: "\t",
        v: "\v",
        "'": "'",
        '"': '"'
    }, Lexer = function(options) {
        this.options = options;
    };
    Lexer.prototype = {
        constructor: Lexer,
        lex: function(text) {
            this.text = text, this.index = 0, this.ch = undefined, this.lastCh = ":", this.tokens = [];
            for(var token, json = []; this.index < this.text.length;){
                if (this.ch = this.text.charAt(this.index), this.is("\"'")) this.readString(this.ch);
                else if (this.isNumber(this.ch) || this.is(".") && this.isNumber(this.peek())) this.readNumber();
                else if (this.isIdent(this.ch)) this.readIdent(), this.was("{,") && "{" === json[0] && (token = this.tokens[this.tokens.length - 1]) && (token.json = -1 === token.text.indexOf("."));
                else if (this.is("(){}[].,;:?")) this.tokens.push({
                    index: this.index,
                    text: this.ch,
                    json: this.was(":[,") && this.is("{[") || this.is("}]:,")
                }), this.is("{[") && json.unshift(this.ch), this.is("}]") && json.shift(), this.index++;
                else if (this.isWhitespace(this.ch)) {
                    this.index++;
                    continue;
                } else {
                    var ch2 = this.ch + this.peek(), ch3 = ch2 + this.peek(2), fn = OPERATORS[this.ch], fn2 = OPERATORS[ch2], fn3 = OPERATORS[ch3];
                    fn3 ? (this.tokens.push({
                        index: this.index,
                        text: ch3,
                        fn: fn3
                    }), this.index += 3) : fn2 ? (this.tokens.push({
                        index: this.index,
                        text: ch2,
                        fn: fn2
                    }), this.index += 2) : fn ? (this.tokens.push({
                        index: this.index,
                        text: this.ch,
                        fn: fn,
                        json: this.was("[,:") && this.is("+-")
                    }), this.index += 1) : this.throwError("Unexpected next character ", this.index, this.index + 1);
                }
                this.lastCh = this.ch;
            }
            return this.tokens;
        },
        is: function(chars) {
            return -1 !== chars.indexOf(this.ch);
        },
        was: function(chars) {
            return -1 !== chars.indexOf(this.lastCh);
        },
        peek: function(i) {
            var num = i || 1;
            return this.index + num < this.text.length && this.text.charAt(this.index + num);
        },
        isNumber: function(ch) {
            return "0" <= ch && ch <= "9";
        },
        isWhitespace: function(ch) {
            // IE treats non-breaking space as \u00A0
            return " " === ch || "\r" === ch || "\t" === ch || "\n" === ch || "\v" === ch || "\u00A0" === ch;
        },
        isIdent: function(ch) {
            return "a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || "_" === ch || "$" === ch;
        },
        isExpOperator: function(ch) {
            return "-" === ch || "+" === ch || this.isNumber(ch);
        },
        throwError: function(error, start, end) {
            throw end = end || this.index, $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end, this.text);
        },
        readNumber: function() {
            for(var number = "", start = this.index; this.index < this.text.length;){
                var ch = lowercase(this.text.charAt(this.index));
                if ("." == ch || this.isNumber(ch)) number += ch;
                else {
                    var peekCh = this.peek();
                    if ("e" == ch && this.isExpOperator(peekCh)) number += ch;
                    else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && "e" == number.charAt(number.length - 1)) number += ch;
                    else if (!this.isExpOperator(ch) || peekCh && this.isNumber(peekCh) || "e" != number.charAt(number.length - 1)) break;
                    else this.throwError("Invalid exponent");
                }
                this.index++;
            }
            number *= 1, this.tokens.push({
                index: start,
                text: number,
                json: !0,
                fn: function() {
                    return number;
                }
            });
        },
        readIdent: function() {
            for(var lastDot, peekIndex, methodName, ch, parser = this, ident = "", start = this.index; this.index < this.text.length && ("." === (ch = this.text.charAt(this.index)) || this.isIdent(ch) || this.isNumber(ch));)"." === ch && (lastDot = this.index), ident += ch, this.index++;
            //check if this is not a method invocation and if it is back out to last dot
            if (lastDot) for(peekIndex = this.index; peekIndex < this.text.length;){
                if ("(" === (ch = this.text.charAt(peekIndex))) {
                    methodName = ident.substr(lastDot - start + 1), ident = ident.substr(0, lastDot - start), this.index = peekIndex;
                    break;
                }
                if (this.isWhitespace(ch)) peekIndex++;
                else break;
            }
            var token = {
                index: start,
                text: ident
            };
            // OPERATORS is our own object so we don't need to use special hasOwnPropertyFn
            if (OPERATORS.hasOwnProperty(ident)) token.fn = OPERATORS[ident], token.json = OPERATORS[ident];
            else {
                var getter = getterFn(ident, this.options, this.text);
                token.fn = extend(function(self, locals) {
                    return getter(self, locals);
                }, {
                    assign: function(self, value) {
                        return setter(self, ident, value, parser.text, parser.options);
                    }
                });
            }
            this.tokens.push(token), methodName && (this.tokens.push({
                index: lastDot,
                text: ".",
                json: !1
            }), this.tokens.push({
                index: lastDot + 1,
                text: methodName,
                json: !1
            }));
        },
        readString: function(quote) {
            var start = this.index;
            this.index++;
            for(var string = "", rawString = quote, escape1 = !1; this.index < this.text.length;){
                var ch = this.text.charAt(this.index);
                if (rawString += ch, escape1) {
                    if ("u" === ch) {
                        var hex = this.text.substring(this.index + 1, this.index + 5);
                        hex.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + hex + "]"), this.index += 4, string += String.fromCharCode(parseInt(hex, 16));
                    } else {
                        var rep = ESCAPE[ch];
                        rep ? string += rep : string += ch;
                    }
                    escape1 = !1;
                } else if ("\\" === ch) escape1 = !0;
                else if (ch === quote) {
                    this.index++, this.tokens.push({
                        index: start,
                        text: rawString,
                        string: string,
                        json: !0,
                        fn: function() {
                            return string;
                        }
                    });
                    return;
                } else string += ch;
                this.index++;
            }
            this.throwError("Unterminated quote", start);
        }
    };
    /**
   * @constructor
   */ var Parser = function(lexer, $filter, options) {
        this.lexer = lexer, this.$filter = $filter, this.options = options;
    };
    //////////////////////////////////////////////////
    // Parser helper functions
    //////////////////////////////////////////////////
    function setter(obj, path, setValue, fullExp, options) {
        //needed?
        options = options || {};
        for(var key, element = path.split("."), i = 0; element.length > 1; i++){
            var propertyObj = obj[key = ensureSafeMemberName(element.shift(), fullExp)];
            propertyObj || (propertyObj = {}, obj[key] = propertyObj), (obj = propertyObj).then && options.unwrapPromises && (promiseWarning(fullExp), "$$v" in obj || function(promise) {
                promise.then(function(val) {
                    promise.$$v = val;
                });
            }(obj), obj.$$v === undefined && (obj.$$v = {}), obj = obj.$$v);
        }
        return obj[key = ensureSafeMemberName(element.shift(), fullExp)] = setValue, setValue;
    }
    Parser.ZERO = function() {
        return 0;
    }, Parser.prototype = {
        constructor: Parser,
        parse: function(text, json) {
            this.text = text, //TODO(i): strip all the obsolte json stuff from this file
            this.json = json, this.tokens = this.lexer.lex(text), json && (// The extra level of aliasing is here, just in case the lexer misses something, so that
            // we prevent any accidental execution in JSON.
            this.assignment = this.logicalOR, this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function() {
                this.throwError("is not valid json", {
                    text: text,
                    index: 0
                });
            });
            var value = json ? this.primary() : this.statements();
            return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]), value.literal = !!value.literal, value.constant = !!value.constant, value;
        },
        primary: function() {
            if (this.expect("(")) primary = this.filterChain(), this.consume(")");
            else if (this.expect("[")) primary = this.arrayDeclaration();
            else if (this.expect("{")) primary = this.object();
            else {
                var primary, next, context, token = this.expect();
                (primary = token.fn) || this.throwError("not a primary expression", token), token.json && (primary.constant = !0, primary.literal = !0);
            }
            for(; next = this.expect("(", "[", ".");)"(" === next.text ? (primary = this.functionCall(primary, context), context = null) : "[" === next.text ? (context = primary, primary = this.objectIndex(primary)) : "." === next.text ? (context = primary, primary = this.fieldAccess(primary)) : this.throwError("IMPOSSIBLE");
            return primary;
        },
        throwError: function(msg, token) {
            throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
        },
        peekToken: function() {
            if (0 === this.tokens.length) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
            return this.tokens[0];
        },
        peek: function(e1, e2, e3, e4) {
            if (this.tokens.length > 0) {
                var token = this.tokens[0], t = token.text;
                if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) return token;
            }
            return !1;
        },
        expect: function(e1, e2, e3, e4) {
            var token = this.peek(e1, e2, e3, e4);
            return !!token && (this.json && !token.json && this.throwError("is not valid json", token), this.tokens.shift(), token);
        },
        consume: function(e1) {
            this.expect(e1) || this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
        },
        unaryFn: function(fn, right) {
            return extend(function(self, locals) {
                return fn(self, locals, right);
            }, {
                constant: right.constant
            });
        },
        ternaryFn: function(left, middle, right) {
            return extend(function(self, locals) {
                return left(self, locals) ? middle(self, locals) : right(self, locals);
            }, {
                constant: left.constant && middle.constant && right.constant
            });
        },
        binaryFn: function(left, fn, right) {
            return extend(function(self, locals) {
                return fn(self, locals, left, right);
            }, {
                constant: left.constant && right.constant
            });
        },
        statements: function() {
            for(var statements = [];;)if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]") && statements.push(this.filterChain()), !this.expect(";")) // optimize for the common case where there is only one statement.
            // TODO(size): maybe we should not support multiple statements?
            return 1 === statements.length ? statements[0] : function(self, locals) {
                for(var value, i = 0; i < statements.length; i++){
                    var statement = statements[i];
                    statement && (value = statement(self, locals));
                }
                return value;
            };
        },
        filterChain: function() {
            for(var token, left = this.expression();;){
                if (!(token = this.expect("|"))) return left;
                left = this.binaryFn(left, token.fn, this.filter());
            }
        },
        filter: function() {
            for(var token = this.expect(), fn = this.$filter(token.text), argsFn = [];;)if (token = this.expect(":")) argsFn.push(this.expression());
            else {
                var fnInvoke = function(self, locals, input) {
                    for(var args = [
                        input
                    ], i = 0; i < argsFn.length; i++)args.push(argsFn[i](self, locals));
                    return fn.apply(self, args);
                };
                return function() {
                    return fnInvoke;
                };
            }
        },
        expression: function() {
            return this.assignment();
        },
        assignment: function() {
            var right, token, left = this.ternary();
            return (token = this.expect("=")) ? (left.assign || this.throwError("implies assignment but [" + this.text.substring(0, token.index) + "] can not be assigned to", token), right = this.ternary(), function(scope, locals) {
                return left.assign(scope, right(scope, locals), locals);
            }) : left;
        },
        ternary: function() {
            var middle, token, left = this.logicalOR();
            return (token = this.expect("?")) ? (middle = this.ternary(), token = this.expect(":")) ? this.ternaryFn(left, middle, this.ternary()) : void this.throwError("expected :", token) : left;
        },
        logicalOR: function() {
            for(var token, left = this.logicalAND();;){
                if (!(token = this.expect("||"))) return left;
                left = this.binaryFn(left, token.fn, this.logicalAND());
            }
        },
        logicalAND: function() {
            var token, left = this.equality();
            return (token = this.expect("&&")) && (left = this.binaryFn(left, token.fn, this.logicalAND())), left;
        },
        equality: function() {
            var token, left = this.relational();
            return (token = this.expect("==", "!=", "===", "!==")) && (left = this.binaryFn(left, token.fn, this.equality())), left;
        },
        relational: function() {
            var token, left = this.additive();
            return (token = this.expect("<", ">", "<=", ">=")) && (left = this.binaryFn(left, token.fn, this.relational())), left;
        },
        additive: function() {
            for(var token, left = this.multiplicative(); token = this.expect("+", "-");)left = this.binaryFn(left, token.fn, this.multiplicative());
            return left;
        },
        multiplicative: function() {
            for(var token, left = this.unary(); token = this.expect("*", "/", "%");)left = this.binaryFn(left, token.fn, this.unary());
            return left;
        },
        unary: function() {
            var token;
            return this.expect("+") ? this.primary() : (token = this.expect("-")) ? this.binaryFn(Parser.ZERO, token.fn, this.unary()) : (token = this.expect("!")) ? this.unaryFn(token.fn, this.unary()) : this.primary();
        },
        fieldAccess: function(object) {
            var parser = this, field = this.expect().text, getter = getterFn(field, this.options, this.text);
            return extend(function(scope, locals, self) {
                return getter(self || object(scope, locals), locals);
            }, {
                assign: function(scope, value, locals) {
                    return setter(object(scope, locals), field, value, parser.text, parser.options);
                }
            });
        },
        objectIndex: function(obj) {
            var parser = this, indexFn = this.expression();
            return this.consume("]"), extend(function(self, locals) {
                var v, p, o = obj(self, locals), i = indexFn(self, locals);
                return o ? ((v = ensureSafeObject(o[i], parser.text)) && v.then && parser.options.unwrapPromises && (p = v, "$$v" in v || (p.$$v = undefined, p.then(function(val) {
                    p.$$v = val;
                })), v = v.$$v), v) : undefined;
            }, {
                assign: function(self, value, locals) {
                    var key = indexFn(self, locals);
                    return ensureSafeObject(obj(self, locals), parser.text)[key] = value;
                }
            });
        },
        functionCall: function(fn, contextGetter) {
            var argsFn = [];
            if (")" !== this.peekToken().text) do argsFn.push(this.expression());
            while (this.expect(","))
            this.consume(")");
            var parser = this;
            return function(scope, locals) {
                for(var args = [], context = contextGetter ? contextGetter(scope, locals) : scope, i = 0; i < argsFn.length; i++)args.push(argsFn[i](scope, locals));
                var fnPtr = fn(scope, locals, context) || noop;
                return ensureSafeObject(context, parser.text), ensureSafeObject(fnPtr, parser.text), ensureSafeObject(fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]), parser.text);
            };
        },
        // This is used with json array declaration
        arrayDeclaration: function() {
            var elementFns = [], allConstant = !0;
            if ("]" !== this.peekToken().text) do {
                var elementFn = this.expression();
                elementFns.push(elementFn), elementFn.constant || (allConstant = !1);
            }while (this.expect(","))
            return this.consume("]"), extend(function(self, locals) {
                for(var array = [], i = 0; i < elementFns.length; i++)array.push(elementFns[i](self, locals));
                return array;
            }, {
                literal: !0,
                constant: allConstant
            });
        },
        object: function() {
            var keyValues = [], allConstant = !0;
            if ("}" !== this.peekToken().text) do {
                var token = this.expect(), key = token.string || token.text;
                this.consume(":");
                var value = this.expression();
                keyValues.push({
                    key: key,
                    value: value
                }), value.constant || (allConstant = !1);
            }while (this.expect(","))
            return this.consume("}"), extend(function(self, locals) {
                for(var object = {}, i = 0; i < keyValues.length; i++){
                    var keyValue = keyValues[i];
                    object[keyValue.key] = keyValue.value(self, locals);
                }
                return object;
            }, {
                literal: !0,
                constant: allConstant
            });
        }
    };
    var getterFnCache = {};
    /**
   * Implementation of the "Black Hole" variant from:
   * - http://jsperf.com/angularjs-parse-getter/4
   * - http://jsperf.com/path-evaluation-simplified/7
   */ function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
        return ensureSafeMemberName(key0, fullExp), ensureSafeMemberName(key1, fullExp), ensureSafeMemberName(key2, fullExp), ensureSafeMemberName(key3, fullExp), ensureSafeMemberName(key4, fullExp), options.unwrapPromises ? function(scope, locals) {
            var promise, pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
            return null == pathVal || ((pathVal = pathVal[key0]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v), key1 && null != pathVal && ((pathVal = pathVal[key1]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v), key2 && null != pathVal && ((pathVal = pathVal[key2]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v), key3 && null != pathVal && ((pathVal = pathVal[key3]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v), key4 && null != pathVal && (pathVal = pathVal[key4]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v))))), pathVal;
        } : function(scope, locals) {
            var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
            return null == pathVal ? pathVal : (pathVal = pathVal[key0], key1 && null != pathVal && (pathVal = pathVal[key1], key2 && null != pathVal && (pathVal = pathVal[key2], key3 && null != pathVal && (pathVal = pathVal[key3], key4 && null != pathVal)))) ? pathVal = pathVal[key4] : pathVal;
        };
    }
    function getterFn(path, options, fullExp) {
        // Check whether the cache has this getter already.
        // We can use hasOwnProperty directly on the cache because we ensure,
        // see below, that the cache never stores a path called 'hasOwnProperty'
        if (getterFnCache.hasOwnProperty(path)) return getterFnCache[path];
        var fn, pathKeys = path.split("."), pathKeysLength = pathKeys.length;
        if (options.csp) fn = pathKeysLength < 6 ? cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options) : function(scope, locals) {
            var val, i = 0;
            do val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals), locals = undefined, scope = val;
            while (i < pathKeysLength)
            return val;
        };
        else {
            var code = "var l, fn, p;\n";
            forEach(pathKeys, function(key, index) {
                ensureSafeMemberName(key, fullExp), code += "if(s === null || s === undefined) return s;\nl=s;\ns=" + (index ? "s" : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"];\n' + (options.unwrapPromises ? 'if (s && s.then) {\n pw("' + fullExp.replace(/(["\r\n])/g, "\\$1") + '");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n' : "");
            });
            /* jshint -W054 */ var evaledFnGetter = Function("s", "k", "pw", code += "return s;"); // s=scope, k=locals, pw=promiseWarning
            /* jshint +W054 */ evaledFnGetter.toString = function() {
                return code;
            }, fn = function(scope, locals) {
                return evaledFnGetter(scope, locals, promiseWarning);
            };
        }
        return "hasOwnProperty" !== path && (getterFnCache[path] = fn), fn;
    }
    ///////////////////////////////////
    /**
   * @ngdoc function
   * @name ng.$parse
   * @function
   *
   * @description
   *
   * Converts Angular {@link guide/expression expression} into a function.
   *
   * <pre>
   *   var getter = $parse('user.name');
   *   var setter = getter.assign;
   *   var context = {user:{name:'angular'}};
   *   var locals = {user:{name:'local'}};
   *
   *   expect(getter(context)).toEqual('angular');
   *   setter(context, 'newValue');
   *   expect(context.user.name).toEqual('newValue');
   *   expect(getter(context, locals)).toEqual('local');
   * </pre>
   *
   *
   * @param {string} expression String expression to compile.
   * @returns {function(context, locals)} a function which represents the compiled expression:
   *
   *    * `context` – `{object}` – an object against which any expressions embedded in the strings
   *      are evaluated against (typically a scope object).
   *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
   *      `context`.
   *
   *    The returned function also has the following properties:
   *      * `literal` – `{boolean}` – whether the expression's top-level node is a JavaScript
   *        literal.
   *      * `constant` – `{boolean}` – whether the expression is made entirely of JavaScript
   *        constant literals.
   *      * `assign` – `{?function(context, value)}` – if the expression is assignable, this will be
   *        set to a function to change its value on the given context.
   *
   */ /**
   * @ngdoc object
   * @name ng.$parseProvider
   * @function
   *
   * @description
   * `$parseProvider` can be used for configuring the default behavior of the {@link ng.$parse $parse}
   *  service.
   */ function $ParseProvider() {
        var cache = {}, $parseOptions = {
            csp: !1,
            unwrapPromises: !1,
            logPromiseWarnings: !0
        };
        /**
     * @deprecated Promise unwrapping via $parse is deprecated and will be removed in the future.
     *
     * @ngdoc method
     * @name ng.$parseProvider#unwrapPromises
     * @methodOf ng.$parseProvider
     * @description
     *
     * **This feature is deprecated, see deprecation notes below for more info**
     *
     * If set to true (default is false), $parse will unwrap promises automatically when a promise is
     * found at any part of the expression. In other words, if set to true, the expression will always
     * result in a non-promise value.
     *
     * While the promise is unresolved, it's treated as undefined, but once resolved and fulfilled,
     * the fulfillment value is used in place of the promise while evaluating the expression.
     *
     * **Deprecation notice**
     *
     * This is a feature that didn't prove to be wildly useful or popular, primarily because of the
     * dichotomy between data access in templates (accessed as raw values) and controller code
     * (accessed as promises).
     *
     * In most code we ended up resolving promises manually in controllers anyway and thus unifying
     * the model access there.
     *
     * Other downsides of automatic promise unwrapping:
     *
     * - when building components it's often desirable to receive the raw promises
     * - adds complexity and slows down expression evaluation
     * - makes expression code pre-generation unattractive due to the amount of code that needs to be
     *   generated
     * - makes IDE auto-completion and tool support hard
     *
     * **Warning Logs**
     *
     * If the unwrapping is enabled, Angular will log a warning about each expression that unwraps a
     * promise (to reduce the noise, each expression is logged only once). To disable this logging use
     * `$parseProvider.logPromiseWarnings(false)` api.
     *
     *
     * @param {boolean=} value New value.
     * @returns {boolean|self} Returns the current setting when used as getter and self if used as
     *                         setter.
     */ this.unwrapPromises = function(value) {
            return isDefined(value) ? ($parseOptions.unwrapPromises = !!value, this) : $parseOptions.unwrapPromises;
        }, /**
     * @deprecated Promise unwrapping via $parse is deprecated and will be removed in the future.
     *
     * @ngdoc method
     * @name ng.$parseProvider#logPromiseWarnings
     * @methodOf ng.$parseProvider
     * @description
     *
     * Controls whether Angular should log a warning on any encounter of a promise in an expression.
     *
     * The default is set to `true`.
     *
     * This setting applies only if `$parseProvider.unwrapPromises` setting is set to true as well.
     *
     * @param {boolean=} value New value.
     * @returns {boolean|self} Returns the current setting when used as getter and self if used as
     *                         setter.
     */ this.logPromiseWarnings = function(value) {
            return isDefined(value) ? ($parseOptions.logPromiseWarnings = value, this) : $parseOptions.logPromiseWarnings;
        }, this.$get = [
            "$filter",
            "$sniffer",
            "$log",
            function($filter, $sniffer, $log) {
                return $parseOptions.csp = $sniffer.csp, promiseWarning = function(fullExp) {
                    !$parseOptions.logPromiseWarnings || promiseWarningCache.hasOwnProperty(fullExp) || (promiseWarningCache[fullExp] = !0, $log.warn("[$parse] Promise found in the expression `" + fullExp + "`. Automatic unwrapping of promises in Angular expressions is deprecated."));
                }, function(exp) {
                    var parsedExpression;
                    switch(typeof exp){
                        case "string":
                            if (cache.hasOwnProperty(exp)) return cache[exp];
                            return parsedExpression = new Parser(new Lexer($parseOptions), $filter, $parseOptions).parse(exp, !1), "hasOwnProperty" !== exp && // Only cache the value if it's not going to mess up the cache object
                            // This is more performant that using Object.prototype.hasOwnProperty.call
                            (cache[exp] = parsedExpression), parsedExpression;
                        case "function":
                            return exp;
                        default:
                            return noop;
                    }
                };
            }
        ];
    }
    /**
   * @ngdoc service
   * @name ng.$q
   * @requires $rootScope
   *
   * @description
   * A promise/deferred implementation inspired by [Kris Kowal's Q](https://github.com/kriskowal/q).
   *
   * [The CommonJS Promise proposal](http://wiki.commonjs.org/wiki/Promises) describes a promise as an
   * interface for interacting with an object that represents the result of an action that is
   * performed asynchronously, and may or may not be finished at any given point in time.
   *
   * From the perspective of dealing with error handling, deferred and promise APIs are to
   * asynchronous programming what `try`, `catch` and `throw` keywords are to synchronous programming.
   *
   * <pre>
   *   // for the purpose of this example let's assume that variables `$q` and `scope` are
   *   // available in the current lexical scope (they could have been injected or passed in).
   *
   *   function asyncGreet(name) {
   *     var deferred = $q.defer();
   *
   *     setTimeout(function() {
   *       // since this fn executes async in a future turn of the event loop, we need to wrap
   *       // our code into an $apply call so that the model changes are properly observed.
   *       scope.$apply(function() {
   *         deferred.notify('About to greet ' + name + '.');
   *
   *         if (okToGreet(name)) {
   *           deferred.resolve('Hello, ' + name + '!');
   *         } else {
   *           deferred.reject('Greeting ' + name + ' is not allowed.');
   *         }
   *       });
   *     }, 1000);
   *
   *     return deferred.promise;
   *   }
   *
   *   var promise = asyncGreet('Robin Hood');
   *   promise.then(function(greeting) {
   *     alert('Success: ' + greeting);
   *   }, function(reason) {
   *     alert('Failed: ' + reason);
   *   }, function(update) {
   *     alert('Got notification: ' + update);
   *   });
   * </pre>
   *
   * At first it might not be obvious why this extra complexity is worth the trouble. The payoff
   * comes in the way of guarantees that promise and deferred APIs make, see
   * https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md.
   *
   * Additionally the promise api allows for composition that is very hard to do with the
   * traditional callback ([CPS](http://en.wikipedia.org/wiki/Continuation-passing_style)) approach.
   * For more on this please see the [Q documentation](https://github.com/kriskowal/q) especially the
   * section on serial or parallel joining of promises.
   *
   *
   * # The Deferred API
   *
   * A new instance of deferred is constructed by calling `$q.defer()`.
   *
   * The purpose of the deferred object is to expose the associated Promise instance as well as APIs
   * that can be used for signaling the successful or unsuccessful completion, as well as the status
   * of the task.
   *
   * **Methods**
   *
   * - `resolve(value)` – resolves the derived promise with the `value`. If the value is a rejection
   *   constructed via `$q.reject`, the promise will be rejected instead.
   * - `reject(reason)` – rejects the derived promise with the `reason`. This is equivalent to
   *   resolving it with a rejection constructed via `$q.reject`.
   * - `notify(value)` - provides updates on the status of the promises execution. This may be called
   *   multiple times before the promise is either resolved or rejected.
   *
   * **Properties**
   *
   * - promise – `{Promise}` – promise object associated with this deferred.
   *
   *
   * # The Promise API
   *
   * A new promise instance is created when a deferred instance is created and can be retrieved by
   * calling `deferred.promise`.
   *
   * The purpose of the promise object is to allow for interested parties to get access to the result
   * of the deferred task when it completes.
   *
   * **Methods**
   *
   * - `then(successCallback, errorCallback, notifyCallback)` – regardless of when the promise was or
   *   will be resolved or rejected, `then` calls one of the success or error callbacks asynchronously
   *   as soon as the result is available. The callbacks are called with a single argument: the result
   *   or rejection reason. Additionally, the notify callback may be called zero or more times to
   *   provide a progress indication, before the promise is resolved or rejected.
   *
   *   This method *returns a new promise* which is resolved or rejected via the return value of the
   *   `successCallback`, `errorCallback`. It also notifies via the return value of the
   *   `notifyCallback` method. The promise can not be resolved or rejected from the notifyCallback
   *   method.
   *
   * - `catch(errorCallback)` – shorthand for `promise.then(null, errorCallback)`
   *
   * - `finally(callback)` – allows you to observe either the fulfillment or rejection of a promise,
   *   but to do so without modifying the final value. This is useful to release resources or do some
   *   clean-up that needs to be done whether the promise was rejected or resolved. See the [full
   *   specification](https://github.com/kriskowal/q/wiki/API-Reference#promisefinallycallback) for
   *   more information.
   *
   *   Because `finally` is a reserved word in JavaScript and reserved keywords are not supported as
   *   property names by ES3, you'll need to invoke the method like `promise['finally'](callback)` to
   *   make your code IE8 compatible.
   *
   * # Chaining promises
   *
   * Because calling the `then` method of a promise returns a new derived promise, it is easily
   * possible to create a chain of promises:
   *
   * <pre>
   *   promiseB = promiseA.then(function(result) {
   *     return result + 1;
   *   });
   *
   *   // promiseB will be resolved immediately after promiseA is resolved and its value
   *   // will be the result of promiseA incremented by 1
   * </pre>
   *
   * It is possible to create chains of any length and since a promise can be resolved with another
   * promise (which will defer its resolution further), it is possible to pause/defer resolution of
   * the promises at any point in the chain. This makes it possible to implement powerful APIs like
   * $http's response interceptors.
   *
   *
   * # Differences between Kris Kowal's Q and $q
   *
   *  There are two main differences:
   *
   * - $q is integrated with the {@link ng.$rootScope.Scope} Scope model observation
   *   mechanism in angular, which means faster propagation of resolution or rejection into your
   *   models and avoiding unnecessary browser repaints, which would result in flickering UI.
   * - Q has many more features than $q, but that comes at a cost of bytes. $q is tiny, but contains
   *   all the important functionality needed for common async tasks.
   *
   *  # Testing
   *
   *  <pre>
   *    it('should simulate promise', inject(function($q, $rootScope) {
   *      var deferred = $q.defer();
   *      var promise = deferred.promise;
   *      var resolvedValue;
   *
   *      promise.then(function(value) { resolvedValue = value; });
   *      expect(resolvedValue).toBeUndefined();
   *
   *      // Simulate resolving of promise
   *      deferred.resolve(123);
   *      // Note that the 'then' function does not get called synchronously.
   *      // This is because we want the promise API to always be async, whether or not
   *      // it got called synchronously or asynchronously.
   *      expect(resolvedValue).toBeUndefined();
   *
   *      // Propagate promise resolution to 'then' functions using $apply().
   *      $rootScope.$apply();
   *      expect(resolvedValue).toEqual(123);
   *    }));
   *  </pre>
   */ function $QProvider() {
        this.$get = [
            "$rootScope",
            "$exceptionHandler",
            function($rootScope, $exceptionHandler) {
                return(/**
   * Constructs a promise manager.
   *
   * @param {function(function)} nextTick Function for executing functions in the next turn.
   * @param {function(...*)} exceptionHandler Function into which unexpected exceptions are passed for
   *     debugging purposes.
   * @returns {object} Promise manager.
   */ function(nextTick, exceptionHandler) {
                    /**
     * @ngdoc
     * @name ng.$q#defer
     * @methodOf ng.$q
     * @description
     * Creates a `Deferred` object which represents a task which will finish in the future.
     *
     * @returns {Deferred} Returns a new instance of deferred.
     */ var defer = function() {
                        var value, deferred, pending = [];
                        return deferred = {
                            resolve: function(val) {
                                if (pending) {
                                    var callbacks = pending;
                                    pending = undefined, value = ref(val), callbacks.length && nextTick(function() {
                                        for(var callback, i = 0, ii = callbacks.length; i < ii; i++)callback = callbacks[i], value.then(callback[0], callback[1], callback[2]);
                                    });
                                }
                            },
                            reject: function(reason) {
                                deferred.resolve(reject(reason));
                            },
                            notify: function(progress) {
                                if (pending) {
                                    var callbacks = pending;
                                    pending.length && nextTick(function() {
                                        for(var i = 0, ii = callbacks.length; i < ii; i++)callbacks[i][2](progress);
                                    });
                                }
                            },
                            promise: {
                                then: function(callback, errback, progressback) {
                                    var result = defer(), wrappedCallback = function(value) {
                                        try {
                                            result.resolve((isFunction(callback) ? callback : defaultCallback)(value));
                                        } catch (e) {
                                            result.reject(e), exceptionHandler(e);
                                        }
                                    }, wrappedErrback = function(reason) {
                                        try {
                                            result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
                                        } catch (e) {
                                            result.reject(e), exceptionHandler(e);
                                        }
                                    }, wrappedProgressback = function(progress) {
                                        try {
                                            result.notify((isFunction(progressback) ? progressback : defaultCallback)(progress));
                                        } catch (e) {
                                            exceptionHandler(e);
                                        }
                                    };
                                    return pending ? pending.push([
                                        wrappedCallback,
                                        wrappedErrback,
                                        wrappedProgressback
                                    ]) : value.then(wrappedCallback, wrappedErrback, wrappedProgressback), result.promise;
                                },
                                catch: function(callback) {
                                    return this.then(null, callback);
                                },
                                finally: function(callback) {
                                    function makePromise(value, resolved) {
                                        var result = defer();
                                        return resolved ? result.resolve(value) : result.reject(value), result.promise;
                                    }
                                    function handleCallback(value, isResolved) {
                                        var callbackOutput = null;
                                        try {
                                            callbackOutput = (callback || defaultCallback)();
                                        } catch (e) {
                                            return makePromise(e, !1);
                                        }
                                        return callbackOutput && isFunction(callbackOutput.then) ? callbackOutput.then(function() {
                                            return makePromise(value, isResolved);
                                        }, function(error) {
                                            return makePromise(error, !1);
                                        }) : makePromise(value, isResolved);
                                    }
                                    return this.then(function(value) {
                                        return handleCallback(value, !0);
                                    }, function(error) {
                                        return handleCallback(error, !1);
                                    });
                                }
                            }
                        };
                    }, ref = function(value) {
                        return value && isFunction(value.then) ? value : {
                            then: function(callback) {
                                var result = defer();
                                return nextTick(function() {
                                    result.resolve(callback(value));
                                }), result.promise;
                            }
                        };
                    }, reject = function(reason) {
                        return {
                            then: function(callback, errback) {
                                var result = defer();
                                return nextTick(function() {
                                    try {
                                        result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
                                    } catch (e) {
                                        result.reject(e), exceptionHandler(e);
                                    }
                                }), result.promise;
                            }
                        };
                    };
                    function defaultCallback(value) {
                        return value;
                    }
                    function defaultErrback(reason) {
                        return reject(reason);
                    }
                    return {
                        defer: defer,
                        reject: reject,
                        when: function(value, callback, errback, progressback) {
                            var done, result = defer(), wrappedCallback = function(value) {
                                try {
                                    return (isFunction(callback) ? callback : defaultCallback)(value);
                                } catch (e) {
                                    return exceptionHandler(e), reject(e);
                                }
                            }, wrappedErrback = function(reason) {
                                try {
                                    return (isFunction(errback) ? errback : defaultErrback)(reason);
                                } catch (e) {
                                    return exceptionHandler(e), reject(e);
                                }
                            }, wrappedProgressback = function(progress) {
                                try {
                                    return (isFunction(progressback) ? progressback : defaultCallback)(progress);
                                } catch (e) {
                                    exceptionHandler(e);
                                }
                            };
                            return nextTick(function() {
                                ref(value).then(function(value) {
                                    done || (done = !0, result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback)));
                                }, function(reason) {
                                    done || (done = !0, result.resolve(wrappedErrback(reason)));
                                }, function(progress) {
                                    done || result.notify(wrappedProgressback(progress));
                                });
                            }), result.promise;
                        },
                        all: /**
     * @ngdoc
     * @name ng.$q#all
     * @methodOf ng.$q
     * @description
     * Combines multiple promises into a single promise that is resolved when all of the input
     * promises are resolved.
     *
     * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
     * @returns {Promise} Returns a single promise that will be resolved with an array/hash of values,
     *   each value corresponding to the promise at the same index/key in the `promises` array/hash.
     *   If any of the promises is resolved with a rejection, this resulting promise will be rejected
     *   with the same rejection value.
     */ function(promises) {
                            var deferred = defer(), counter = 0, results = isArray(promises) ? [] : {};
                            return forEach(promises, function(promise, key) {
                                counter++, ref(promise).then(function(value) {
                                    results.hasOwnProperty(key) || (results[key] = value, --counter || deferred.resolve(results));
                                }, function(reason) {
                                    results.hasOwnProperty(key) || deferred.reject(reason);
                                });
                            }), 0 === counter && deferred.resolve(results), deferred.promise;
                        }
                    };
                }(function(callback) {
                    $rootScope.$evalAsync(callback);
                }, $exceptionHandler));
            }
        ];
    }
    /**
   * DESIGN NOTES
   *
   * The design decisions behind the scope are heavily favored for speed and memory consumption.
   *
   * The typical use of scope is to watch the expressions, which most of the time return the same
   * value as last time so we optimize the operation.
   *
   * Closures construction is expensive in terms of speed as well as memory:
   *   - No closures, instead use prototypical inheritance for API
   *   - Internal state needs to be stored on scope directly, which means that private state is
   *     exposed as $$____ properties
   *
   * Loop operations are optimized by using while(count--) { ... }
   *   - this means that in order to keep the same order of execution as addition we have to add
   *     items to the array at the beginning (shift) instead of at the end (push)
   *
   * Child scopes are created and removed often
   *   - Using an array would be slow since inserts in middle are expensive so we use linked list
   *
   * There are few watches then a lot of observers. This is why you don't want the observer to be
   * implemented in the same way as watch. Watch requires return of initialization function which
   * are expensive to construct.
   */ /**
   * @ngdoc object
   * @name ng.$rootScopeProvider
   * @description
   *
   * Provider for the $rootScope service.
   */ /**
   * @ngdoc function
   * @name ng.$rootScopeProvider#digestTtl
   * @methodOf ng.$rootScopeProvider
   * @description
   *
   * Sets the number of `$digest` iterations the scope should attempt to execute before giving up and
   * assuming that the model is unstable.
   *
   * The current default is 10 iterations.
   *
   * In complex applications it's possible that the dependencies between `$watch`s will result in
   * several digest iterations. However if an application needs more than the default 10 digest
   * iterations for its model to stabilize then you should investigate what is causing the model to
   * continuously change during the digest.
   *
   * Increasing the TTL could have performance implications, so you should not change it without
   * proper justification.
   *
   * @param {number} limit The number of digest iterations.
   */ /**
   * @ngdoc object
   * @name ng.$rootScope
   * @description
   *
   * Every application has a single root {@link ng.$rootScope.Scope scope}.
   * All other scopes are descendant scopes of the root scope. Scopes provide separation
   * between the model and the view, via a mechanism for watching the model for changes.
   * They also provide an event emission/broadcast and subscription facility. See the
   * {@link guide/scope developer guide on scopes}.
   */ function $RootScopeProvider() {
        var TTL = 10, $rootScopeMinErr = minErr("$rootScope"), lastDirtyWatch = null;
        this.digestTtl = function(value) {
            return arguments.length && (TTL = value), TTL;
        }, this.$get = [
            "$injector",
            "$exceptionHandler",
            "$parse",
            "$browser",
            function($injector, $exceptionHandler, $parse, $browser) {
                /**
     * @ngdoc function
     * @name ng.$rootScope.Scope
     *
     * @description
     * A root scope can be retrieved using the {@link ng.$rootScope $rootScope} key from the
     * {@link AUTO.$injector $injector}. Child scopes are created using the
     * {@link ng.$rootScope.Scope#methods_$new $new()} method. (Most scopes are created automatically when
     * compiled HTML template is executed.)
     *
     * Here is a simple scope snippet to show how you can interact with the scope.
     * <pre>
     * <file src="./test/ng/rootScopeSpec.js" tag="docs1" />
     * </pre>
     *
     * # Inheritance
     * A scope can inherit from a parent scope, as in this example:
     * <pre>
         var parent = $rootScope;
         var child = parent.$new();

         parent.salutation = "Hello";
         child.name = "World";
         expect(child.salutation).toEqual('Hello');

         child.salutation = "Welcome";
         expect(child.salutation).toEqual('Welcome');
         expect(parent.salutation).toEqual('Hello');
     * </pre>
     *
     *
     * @param {Object.<string, function()>=} providers Map of service factory which need to be
     *                                       provided for the current scope. Defaults to {@link ng}.
     * @param {Object.<string, *>=} instanceCache Provides pre-instantiated services which should
     *                              append/override services provided by `providers`. This is handy
     *                              when unit-testing and having the need to override a default
     *                              service.
     * @returns {Object} Newly created scope.
     *
     */ function Scope() {
                    this.$id = nextUid(), this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, this.this = this.$root = this, this.$$destroyed = !1, this.$$asyncQueue = [], this.$$postDigestQueue = [], this.$$listeners = {}, this.$$isolateBindings = {};
                }
                /**
         * @ngdoc property
         * @name ng.$rootScope.Scope#$id
         * @propertyOf ng.$rootScope.Scope
         * @returns {number} Unique scope ID (monotonically increasing alphanumeric sequence) useful for
         *   debugging.
         */ Scope.prototype = {
                    constructor: Scope,
                    /**
           * @ngdoc function
           * @name ng.$rootScope.Scope#$new
           * @methodOf ng.$rootScope.Scope
           * @function
           *
           * @description
           * Creates a new child {@link ng.$rootScope.Scope scope}.
           *
           * The parent scope will propagate the {@link ng.$rootScope.Scope#methods_$digest $digest()} and
           * {@link ng.$rootScope.Scope#methods_$digest $digest()} events. The scope can be removed from the
           * scope hierarchy using {@link ng.$rootScope.Scope#methods_$destroy $destroy()}.
           *
           * {@link ng.$rootScope.Scope#methods_$destroy $destroy()} must be called on a scope when it is
           * desired for the scope and its child scopes to be permanently detached from the parent and
           * thus stop participating in model change detection and listener notification by invoking.
           *
           * @param {boolean} isolate If true, then the scope does not prototypically inherit from the
           *         parent scope. The scope is isolated, as it can not see parent scope properties.
           *         When creating widgets, it is useful for the widget to not accidentally read parent
           *         state.
           *
           * @returns {Object} The newly created child scope.
           *
           */ $new: function(isolate) {
                        var ChildScope, child;
                        return isolate ? ((child = new Scope()).$root = this.$root, // ensure that there is just one async queue per $rootScope and its children
                        child.$$asyncQueue = this.$$asyncQueue, child.$$postDigestQueue = this.$$postDigestQueue) : (// the name it does not become random set of chars. This will then show up as class
                        // name in the debugger.
                        (ChildScope = function() {}).prototype = this, (child = new ChildScope()).$id = nextUid()), child.this = child, child.$$listeners = {}, child.$parent = this, child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null, child.$$prevSibling = this.$$childTail, this.$$childHead ? (this.$$childTail.$$nextSibling = child, this.$$childTail = child) : this.$$childHead = this.$$childTail = child, child;
                    },
                    /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$watch
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Registers a `listener` callback to be executed whenever the `watchExpression` changes.
       *
       * - The `watchExpression` is called on every call to {@link ng.$rootScope.Scope#methods_$digest
       *   $digest()} and should return the value that will be watched. (Since
       *   {@link ng.$rootScope.Scope#methods_$digest $digest()} reruns when it detects changes the
       *   `watchExpression` can execute multiple times per
       *   {@link ng.$rootScope.Scope#methods_$digest $digest()} and should be idempotent.)
       * - The `listener` is called only when the value from the current `watchExpression` and the
       *   previous call to `watchExpression` are not equal (with the exception of the initial run,
       *   see below). The inequality is determined according to
       *   {@link angular.equals} function. To save the value of the object for later comparison,
       *   the {@link angular.copy} function is used. It also means that watching complex options
       *   will have adverse memory and performance implications.
       * - The watch `listener` may change the model, which may trigger other `listener`s to fire.
       *   This is achieved by rerunning the watchers until no changes are detected. The rerun
       *   iteration limit is 10 to prevent an infinite loop deadlock.
       *
       *
       * If you want to be notified whenever {@link ng.$rootScope.Scope#methods_$digest $digest} is called,
       * you can register a `watchExpression` function with no `listener`. (Since `watchExpression`
       * can execute multiple times per {@link ng.$rootScope.Scope#methods_$digest $digest} cycle when a
       * change is detected, be prepared for multiple calls to your listener.)
       *
       * After a watcher is registered with the scope, the `listener` fn is called asynchronously
       * (via {@link ng.$rootScope.Scope#methods_$evalAsync $evalAsync}) to initialize the
       * watcher. In rare cases, this is undesirable because the listener is called when the result
       * of `watchExpression` didn't change. To detect this scenario within the `listener` fn, you
       * can compare the `newVal` and `oldVal`. If these two values are identical (`===`) then the
       * listener was called due to initialization.
       *
       * The example below contains an illustration of using a function as your $watch listener
       *
       *
       * # Example
       * <pre>
           // let's assume that scope was dependency injected as the $rootScope
           var scope = $rootScope;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // no variable change
           expect(scope.counter).toEqual(0);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(1);



           // Using a listener function
           var food;
           scope.foodCounter = 0;
           expect(scope.foodCounter).toEqual(0);
           scope.$watch(
             // This is the listener function
             function() { return food; },
             // This is the change handler
             function(newValue, oldValue) {
               if ( newValue !== oldValue ) {
                 // Only increment the counter if the value changed
                 scope.foodCounter = scope.foodCounter + 1;
               }
             }
           );
           // No digest has been run so the counter will be zero
           expect(scope.foodCounter).toEqual(0);

           // Run the digest but since food has not changed cout will still be zero
           scope.$digest();
           expect(scope.foodCounter).toEqual(0);

           // Update food and run digest.  Now the counter will increment
           food = 'cheeseburger';
           scope.$digest();
           expect(scope.foodCounter).toEqual(1);

       * </pre>
       *
       *
       *
       * @param {(function()|string)} watchExpression Expression that is evaluated on each
       *    {@link ng.$rootScope.Scope#methods_$digest $digest} cycle. A change in the return value triggers
       *    a call to the `listener`.
       *
       *    - `string`: Evaluated as {@link guide/expression expression}
       *    - `function(scope)`: called with current `scope` as a parameter.
       * @param {(function()|string)=} listener Callback called whenever the return value of
       *   the `watchExpression` changes.
       *
       *    - `string`: Evaluated as {@link guide/expression expression}
       *    - `function(newValue, oldValue, scope)`: called with current and previous values as
       *      parameters.
       *
       * @param {boolean=} objectEquality Compare object for equality rather than for reference.
       * @returns {function()} Returns a deregistration function for this listener.
       */ $watch: function(watchExp, listener, objectEquality) {
                        var get = compileToFn(watchExp, "watch"), array = this.$$watchers, watcher = {
                            fn: listener,
                            last: initWatchVal,
                            get: get,
                            exp: watchExp,
                            eq: !!objectEquality
                        };
                        // in the case user pass string, we need to compile it, do we really need this ?
                        if (lastDirtyWatch = null, !isFunction(listener)) {
                            var listenFn = compileToFn(listener || noop, "listener");
                            watcher.fn = function(newVal, oldVal, scope) {
                                listenFn(scope);
                            };
                        }
                        if ("string" == typeof watchExp && get.constant) {
                            var originalFn = watcher.fn;
                            watcher.fn = function(newVal, oldVal, scope) {
                                originalFn.call(this, newVal, oldVal, scope), arrayRemove(array, watcher);
                            };
                        }
                        return array || (array = this.$$watchers = []), // we use unshift since we use a while loop in $digest for speed.
                        // the while loop reads in reverse order.
                        array.unshift(watcher), function() {
                            arrayRemove(array, watcher);
                        };
                    },
                    /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$watchCollection
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Shallow watches the properties of an object and fires whenever any of the properties change
       * (for arrays, this implies watching the array items; for object maps, this implies watching
       * the properties). If a change is detected, the `listener` callback is fired.
       *
       * - The `obj` collection is observed via standard $watch operation and is examined on every
       *   call to $digest() to see if any items have been added, removed, or moved.
       * - The `listener` is called whenever anything within the `obj` has changed. Examples include
       *   adding, removing, and moving items belonging to an object or array.
       *
       *
       * # Example
       * <pre>
          $scope.names = ['igor', 'matias', 'misko', 'james'];
          $scope.dataCount = 4;

          $scope.$watchCollection('names', function(newNames, oldNames) {
            $scope.dataCount = newNames.length;
          });

          expect($scope.dataCount).toEqual(4);
          $scope.$digest();

          //still at 4 ... no changes
          expect($scope.dataCount).toEqual(4);

          $scope.names.pop();
          $scope.$digest();

          //now there's been a change
          expect($scope.dataCount).toEqual(3);
       * </pre>
       *
       *
       * @param {string|Function(scope)} obj Evaluated as {@link guide/expression expression}. The
       *    expression value should evaluate to an object or an array which is observed on each
       *    {@link ng.$rootScope.Scope#methods_$digest $digest} cycle. Any shallow change within the
       *    collection will trigger a call to the `listener`.
       *
       * @param {function(newCollection, oldCollection, scope)} listener a callback function that is
       *    fired with both the `newCollection` and `oldCollection` as parameters.
       *    The `newCollection` object is the newly modified data obtained from the `obj` expression
       *    and the `oldCollection` object is a copy of the former collection data.
       *    The `scope` refers to the current scope.
       *
       * @returns {function()} Returns a de-registration function for this listener. When the
       *    de-registration function is executed, the internal watch operation is terminated.
       */ $watchCollection: function(obj, listener) {
                        var oldValue, newValue, self = this, changeDetected = 0, objGetter = $parse(obj), internalArray = [], internalObject = {}, oldLength = 0;
                        return this.$watch(function() {
                            if (isObject(newValue = objGetter(self))) {
                                if (isArrayLike(newValue)) {
                                    oldValue !== internalArray && (oldLength = // we are transitioning from something which was not an array into array.
                                    (oldValue = internalArray).length = 0, changeDetected++), newLength = newValue.length, oldLength !== newLength && (// if lengths do not match we need to trigger change notification
                                    changeDetected++, oldValue.length = oldLength = newLength);
                                    // copy the items to oldValue and look for changes.
                                    for(var newLength, key, i = 0; i < newLength; i++)oldValue[i] !== newValue[i] && (changeDetected++, oldValue[i] = newValue[i]);
                                } else {
                                    for(key in oldValue !== internalObject && (// we are transitioning from something which was not an object into object.
                                    oldValue = internalObject = {}, oldLength = 0, changeDetected++), // copy the items to oldValue and look for changes.
                                    newLength = 0, newValue)newValue.hasOwnProperty(key) && (newLength++, oldValue.hasOwnProperty(key) ? oldValue[key] !== newValue[key] && (changeDetected++, oldValue[key] = newValue[key]) : (oldLength++, oldValue[key] = newValue[key], changeDetected++));
                                    if (oldLength > newLength) for(key in // we used to have more keys, need to find them and destroy them.
                                    changeDetected++, oldValue)oldValue.hasOwnProperty(key) && !newValue.hasOwnProperty(key) && (oldLength--, delete oldValue[key]);
                                }
                            } else oldValue !== newValue && (oldValue = newValue, changeDetected++);
                            return changeDetected;
                        }, function() {
                            listener(newValue, oldValue, self);
                        });
                    },
                    /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$digest
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Processes all of the {@link ng.$rootScope.Scope#methods_$watch watchers} of the current scope and
       * its children. Because a {@link ng.$rootScope.Scope#methods_$watch watcher}'s listener can change
       * the model, the `$digest()` keeps calling the {@link ng.$rootScope.Scope#methods_$watch watchers}
       * until no more listeners are firing. This means that it is possible to get into an infinite
       * loop. This function will throw `'Maximum iteration limit exceeded.'` if the number of
       * iterations exceeds 10.
       *
       * Usually, you don't call `$digest()` directly in
       * {@link ng.directive:ngController controllers} or in
       * {@link ng.$compileProvider#methods_directive directives}.
       * Instead, you should call {@link ng.$rootScope.Scope#methods_$apply $apply()} (typically from within
       * a {@link ng.$compileProvider#methods_directive directives}), which will force a `$digest()`.
       *
       * If you want to be notified whenever `$digest()` is called,
       * you can register a `watchExpression` function with
       * {@link ng.$rootScope.Scope#methods_$watch $watch()} with no `listener`.
       *
       * In unit tests, you may need to call `$digest()` to simulate the scope life cycle.
       *
       * # Example
       * <pre>
           var scope = ...;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // no variable change
           expect(scope.counter).toEqual(0);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(1);
       * </pre>
       *
       */ $digest: function() {
                        var watch, value, last, watchers, length, dirty, next, current, logIdx, logMsg, asyncTask, asyncQueue = this.$$asyncQueue, postDigestQueue = this.$$postDigestQueue, ttl = TTL, watchLog = [];
                        beginPhase("$digest"), lastDirtyWatch = null;
                        do {
                            for(// "while dirty" loop
                            dirty = !1, current = this; asyncQueue.length;){
                                try {
                                    (asyncTask = asyncQueue.shift()).scope.$eval(asyncTask.expression);
                                } catch (e) {
                                    clearPhase(), $exceptionHandler(e);
                                }
                                lastDirtyWatch = null;
                            }
                            traverseScopesLoop: do {
                                // "traverse the scopes" loop
                                if (watchers = current.$$watchers) for(// process our watches
                                length = watchers.length; length--;)try {
                                    // Most common watches are on primitives, in which case we can short
                                    // circuit it with === operator, only when === fails do we use .equals
                                    if (watch = watchers[length]) {
                                        if ((value = watch.get(current)) === (last = watch.last) || (watch.eq ? equals(value, last) : "number" == typeof value && "number" == typeof last && isNaN(value) && isNaN(last))) {
                                            if (watch === lastDirtyWatch) {
                                                // If the most recently dirty watcher is now clean, short circuit since the remaining watchers
                                                // have already been tested.
                                                dirty = !1;
                                                break traverseScopesLoop;
                                            }
                                        } else dirty = !0, lastDirtyWatch = watch, watch.last = watch.eq ? copy(value) : value, watch.fn(value, last === initWatchVal ? value : last, current), ttl < 5 && (watchLog[logIdx = 4 - ttl] || (watchLog[logIdx] = []), logMsg = (isFunction(watch.exp) ? "fn: " + (watch.exp.name || watch.exp.toString()) : watch.exp) + ("; newVal: " + toJson(value) + "; oldVal: ") + toJson(last), watchLog[logIdx].push(logMsg));
                                    }
                                } catch (e) {
                                    clearPhase(), $exceptionHandler(e);
                                }
                                // Insanity Warning: scope depth-first traversal
                                // yes, this code is a bit crazy, but it works and we have tests to prove it!
                                // this piece should be kept in sync with the traversal in $broadcast
                                if (!(next = current.$$childHead || current !== this && current.$$nextSibling)) for(; current !== this && !(next = current.$$nextSibling);)current = current.$parent;
                            }while (current = next)
                            // `break traverseScopesLoop;` takes us to here
                            if (dirty && !ttl--) throw clearPhase(), $rootScopeMinErr("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", TTL, toJson(watchLog));
                        }while (dirty || asyncQueue.length)
                        for(clearPhase(); postDigestQueue.length;)try {
                            postDigestQueue.shift()();
                        } catch (e) {
                            $exceptionHandler(e);
                        }
                    },
                    /**
           * @ngdoc event
           * @name ng.$rootScope.Scope#$destroy
           * @eventOf ng.$rootScope.Scope
           * @eventType broadcast on scope being destroyed
           *
           * @description
           * Broadcasted when a scope and its children are being destroyed.
           *
           * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
           * clean up DOM bindings before an element is removed from the DOM.
           */ /**
           * @ngdoc function
           * @name ng.$rootScope.Scope#$destroy
           * @methodOf ng.$rootScope.Scope
           * @function
           *
           * @description
           * Removes the current scope (and all of its children) from the parent scope. Removal implies
           * that calls to {@link ng.$rootScope.Scope#methods_$digest $digest()} will no longer
           * propagate to the current scope and its children. Removal also implies that the current
           * scope is eligible for garbage collection.
           *
           * The `$destroy()` is usually used by directives such as
           * {@link ng.directive:ngRepeat ngRepeat} for managing the
           * unrolling of the loop.
           *
           * Just before a scope is destroyed, a `$destroy` event is broadcasted on this scope.
           * Application code can register a `$destroy` event handler that will give it a chance to
           * perform any necessary cleanup.
           *
           * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
           * clean up DOM bindings before an element is removed from the DOM.
           */ $destroy: function() {
                        // we can't destroy the root scope or a scope that has been already destroyed
                        if (!this.$$destroyed) {
                            var parent = this.$parent;
                            this.$broadcast("$destroy"), this.$$destroyed = !0, this !== $rootScope && (parent.$$childHead == this && (parent.$$childHead = this.$$nextSibling), parent.$$childTail == this && (parent.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), // This is bogus code that works around Chrome's GC leak
                            // see: https://github.com/angular/angular.js/issues/1313#issuecomment-10378451
                            this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null);
                        }
                    },
                    /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$eval
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Executes the `expression` on the current scope and returns the result. Any exceptions in
       * the expression are propagated (uncaught). This is useful when evaluating Angular
       * expressions.
       *
       * # Example
       * <pre>
           var scope = ng.$rootScope.Scope();
           scope.a = 1;
           scope.b = 2;

           expect(scope.$eval('a+b')).toEqual(3);
           expect(scope.$eval(function(scope){ return scope.a + scope.b; })).toEqual(3);
       * </pre>
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in  {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       * @param {(object)=} locals Local variables object, useful for overriding values in scope.
       * @returns {*} The result of evaluating the expression.
       */ $eval: function(expr, locals) {
                        return $parse(expr)(this, locals);
                    },
                    /**
           * @ngdoc function
           * @name ng.$rootScope.Scope#$evalAsync
           * @methodOf ng.$rootScope.Scope
           * @function
           *
           * @description
           * Executes the expression on the current scope at a later point in time.
           *
           * The `$evalAsync` makes no guarantees as to when the `expression` will be executed, only
           * that:
           *
           *   - it will execute after the function that scheduled the evaluation (preferably before DOM
           *     rendering).
           *   - at least one {@link ng.$rootScope.Scope#methods_$digest $digest cycle} will be performed after
           *     `expression` execution.
           *
           * Any exceptions from the execution of the expression are forwarded to the
           * {@link ng.$exceptionHandler $exceptionHandler} service.
           *
           * __Note:__ if this function is called outside of a `$digest` cycle, a new `$digest` cycle
           * will be scheduled. However, it is encouraged to always call code that changes the model
           * from within an `$apply` call. That includes code evaluated via `$evalAsync`.
           *
           * @param {(string|function())=} expression An angular expression to be executed.
           *
           *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
           *    - `function(scope)`: execute the function with the current `scope` parameter.
           *
           */ $evalAsync: function(expr) {
                        $rootScope.$$phase || $rootScope.$$asyncQueue.length || $browser.defer(function() {
                            $rootScope.$$asyncQueue.length && $rootScope.$digest();
                        }), this.$$asyncQueue.push({
                            scope: this,
                            expression: expr
                        });
                    },
                    $$postDigest: function(fn) {
                        this.$$postDigestQueue.push(fn);
                    },
                    /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$apply
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * `$apply()` is used to execute an expression in angular from outside of the angular
       * framework. (For example from browser DOM events, setTimeout, XHR or third party libraries).
       * Because we are calling into the angular framework we need to perform proper scope life
       * cycle of {@link ng.$exceptionHandler exception handling},
       * {@link ng.$rootScope.Scope#methods_$digest executing watches}.
       *
       * ## Life cycle
       *
       * # Pseudo-Code of `$apply()`
       * <pre>
           function $apply(expr) {
             try {
               return $eval(expr);
             } catch (e) {
               $exceptionHandler(e);
             } finally {
               $root.$digest();
             }
           }
       * </pre>
       *
       *
       * Scope's `$apply()` method transitions through the following stages:
       *
       * 1. The {@link guide/expression expression} is executed using the
       *    {@link ng.$rootScope.Scope#methods_$eval $eval()} method.
       * 2. Any exceptions from the execution of the expression are forwarded to the
       *    {@link ng.$exceptionHandler $exceptionHandler} service.
       * 3. The {@link ng.$rootScope.Scope#methods_$watch watch} listeners are fired immediately after the
       *    expression was executed using the {@link ng.$rootScope.Scope#methods_$digest $digest()} method.
       *
       *
       * @param {(string|function())=} exp An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       *
       * @returns {*} The result of evaluating the expression.
       */ $apply: function(expr) {
                        try {
                            return beginPhase("$apply"), this.$eval(expr);
                        } catch (e) {
                            $exceptionHandler(e);
                        } finally{
                            clearPhase();
                            try {
                                $rootScope.$digest();
                            } catch (e) {
                                throw $exceptionHandler(e), e;
                            }
                        }
                    },
                    /**
           * @ngdoc function
           * @name ng.$rootScope.Scope#$on
           * @methodOf ng.$rootScope.Scope
           * @function
           *
           * @description
           * Listens on events of a given type. See {@link ng.$rootScope.Scope#methods_$emit $emit} for
           * discussion of event life cycle.
           *
           * The event listener function format is: `function(event, args...)`. The `event` object
           * passed into the listener has the following attributes:
           *
           *   - `targetScope` - `{Scope}`: the scope on which the event was `$emit`-ed or
           *     `$broadcast`-ed.
           *   - `currentScope` - `{Scope}`: the current scope which is handling the event.
           *   - `name` - `{string}`: name of the event.
           *   - `stopPropagation` - `{function=}`: calling `stopPropagation` function will cancel
           *     further event propagation (available only for events that were `$emit`-ed).
           *   - `preventDefault` - `{function}`: calling `preventDefault` sets `defaultPrevented` flag
           *     to true.
           *   - `defaultPrevented` - `{boolean}`: true if `preventDefault` was called.
           *
           * @param {string} name Event name to listen on.
           * @param {function(event, args...)} listener Function to call when the event is emitted.
           * @returns {function()} Returns a deregistration function for this listener.
           */ $on: function(name, listener) {
                        var namedListeners = this.$$listeners[name];
                        return namedListeners || (this.$$listeners[name] = namedListeners = []), namedListeners.push(listener), function() {
                            namedListeners[indexOf(namedListeners, listener)] = null;
                        };
                    },
                    /**
           * @ngdoc function
           * @name ng.$rootScope.Scope#$emit
           * @methodOf ng.$rootScope.Scope
           * @function
           *
           * @description
           * Dispatches an event `name` upwards through the scope hierarchy notifying the
           * registered {@link ng.$rootScope.Scope#methods_$on} listeners.
           *
           * The event life cycle starts at the scope on which `$emit` was called. All
           * {@link ng.$rootScope.Scope#methods_$on listeners} listening for `name` event on this scope get
           * notified. Afterwards, the event traverses upwards toward the root scope and calls all
           * registered listeners along the way. The event will stop propagating if one of the listeners
           * cancels it.
           *
           * Any exception emitted from the {@link ng.$rootScope.Scope#methods_$on listeners} will be passed
           * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
           *
           * @param {string} name Event name to emit.
           * @param {...*} args Optional set of arguments which will be passed onto the event listeners.
           * @return {Object} Event object (see {@link ng.$rootScope.Scope#methods_$on}).
           */ $emit: function(name, args) {
                        var namedListeners, i, length, empty = [], scope = this, stopPropagation = !1, event = {
                            name: name,
                            targetScope: scope,
                            stopPropagation: function() {
                                stopPropagation = !0;
                            },
                            preventDefault: function() {
                                event.defaultPrevented = !0;
                            },
                            defaultPrevented: !1
                        }, listenerArgs = concat([
                            event
                        ], arguments, 1);
                        do {
                            for(i = 0, namedListeners = scope.$$listeners[name] || empty, event.currentScope = scope, length = namedListeners.length; i < length; i++){
                                // if listeners were deregistered, defragment the array
                                if (!namedListeners[i]) {
                                    namedListeners.splice(i, 1), i--, length--;
                                    continue;
                                }
                                try {
                                    //allow all listeners attached to the current scope to run
                                    namedListeners[i].apply(null, listenerArgs);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                            }
                            //if any listener on the current scope stops propagation, prevent bubbling
                            if (stopPropagation) break;
                            //traverse upwards
                            scope = scope.$parent;
                        }while (scope)
                        return event;
                    },
                    /**
           * @ngdoc function
           * @name ng.$rootScope.Scope#$broadcast
           * @methodOf ng.$rootScope.Scope
           * @function
           *
           * @description
           * Dispatches an event `name` downwards to all child scopes (and their children) notifying the
           * registered {@link ng.$rootScope.Scope#methods_$on} listeners.
           *
           * The event life cycle starts at the scope on which `$broadcast` was called. All
           * {@link ng.$rootScope.Scope#methods_$on listeners} listening for `name` event on this scope get
           * notified. Afterwards, the event propagates to all direct and indirect scopes of the current
           * scope and calls all registered listeners along the way. The event cannot be canceled.
           *
           * Any exception emitted from the {@link ng.$rootScope.Scope#methods_$on listeners} will be passed
           * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
           *
           * @param {string} name Event name to broadcast.
           * @param {...*} args Optional set of arguments which will be passed onto the event listeners.
           * @return {Object} Event object, see {@link ng.$rootScope.Scope#methods_$on}
           */ $broadcast: function(name, args) {
                        var listeners, i, length, current = this, next = this, event = {
                            name: name,
                            targetScope: this,
                            preventDefault: function() {
                                event.defaultPrevented = !0;
                            },
                            defaultPrevented: !1
                        }, listenerArgs = concat([
                            event
                        ], arguments, 1);
                        //down while you can, then up and next sibling or up and next sibling until back at root
                        do {
                            for(i = 0, current = next, event.currentScope = current, length = (listeners = current.$$listeners[name] || []).length; i < length; i++){
                                // if listeners were deregistered, defragment the array
                                if (!listeners[i]) {
                                    listeners.splice(i, 1), i--, length--;
                                    continue;
                                }
                                try {
                                    listeners[i].apply(null, listenerArgs);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                            }
                            // Insanity Warning: scope depth-first traversal
                            // yes, this code is a bit crazy, but it works and we have tests to prove it!
                            // this piece should be kept in sync with the traversal in $digest
                            if (!(next = current.$$childHead || current !== this && current.$$nextSibling)) for(; current !== this && !(next = current.$$nextSibling);)current = current.$parent;
                        }while (current = next)
                        return event;
                    }
                };
                var $rootScope = new Scope();
                return $rootScope;
                function beginPhase(phase) {
                    if ($rootScope.$$phase) throw $rootScopeMinErr("inprog", "{0} already in progress", $rootScope.$$phase);
                    $rootScope.$$phase = phase;
                }
                function clearPhase() {
                    $rootScope.$$phase = null;
                }
                function compileToFn(exp, name) {
                    var fn = $parse(exp);
                    return assertArgFn(fn, name), fn;
                }
                /**
         * function used as an initial value for watchers.
         * because it's unique we can easily tell it apart from other values
         */ function initWatchVal() {}
            }
        ];
    }
    /**
   * @description
   * Private service to sanitize uris for links and images. Used by $compile and $sanitize.
   */ function $$SanitizeUriProvider() {
        var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/, imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;
        /**
     * @description
     * Retrieves or overrides the default regular expression that is used for whitelisting of safe
     * urls during a[href] sanitization.
     *
     * The sanitization is a security measure aimed at prevent XSS attacks via html links.
     *
     * Any url about to be assigned to a[href] via data-binding is first normalized and turned into
     * an absolute url. Afterwards, the url is matched against the `aHrefSanitizationWhitelist`
     * regular expression. If a match is found, the original url is written into the dom. Otherwise,
     * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
     *
     * @param {RegExp=} regexp New regexp to whitelist urls with.
     * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
     *    chaining otherwise.
     */ this.aHrefSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? (aHrefSanitizationWhitelist = regexp, this) : aHrefSanitizationWhitelist;
        }, /**
     * @description
     * Retrieves or overrides the default regular expression that is used for whitelisting of safe
     * urls during img[src] sanitization.
     *
     * The sanitization is a security measure aimed at prevent XSS attacks via html links.
     *
     * Any url about to be assigned to img[src] via data-binding is first normalized and turned into
     * an absolute url. Afterwards, the url is matched against the `imgSrcSanitizationWhitelist`
     * regular expression. If a match is found, the original url is written into the dom. Otherwise,
     * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
     *
     * @param {RegExp=} regexp New regexp to whitelist urls with.
     * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
     *    chaining otherwise.
     */ this.imgSrcSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? (imgSrcSanitizationWhitelist = regexp, this) : imgSrcSanitizationWhitelist;
        }, this.$get = function() {
            return function(uri, isImage) {
                var normalizedVal, regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
                return(// NOTE: urlResolve() doesn't support IE < 8 so we don't sanitize for that case.
                msie && !(msie >= 8) || "" === (normalizedVal = urlResolve(uri).href) || normalizedVal.match(regex) ? uri : "unsafe:" + normalizedVal);
            };
        };
    }
    var $sceMinErr = minErr("$sce"), SCE_CONTEXTS = {
        HTML: "html",
        CSS: "css",
        URL: "url",
        // RESOURCE_URL is a subtype of URL used in contexts where a privileged resource is sourced from a
        // url.  (e.g. ng-include, script src, templateUrl)
        RESOURCE_URL: "resourceUrl",
        JS: "js"
    };
    function adjustMatchers(matchers) {
        var adjustedMatchers = [];
        return isDefined(matchers) && forEach(matchers, function(matcher) {
            adjustedMatchers.push(function(matcher) {
                if ("self" === matcher) return matcher;
                if (isString(matcher)) {
                    // Strings match exactly except for 2 wildcards - '*' and '**'.
                    // '*' matches any character except those from the set ':/.?&'.
                    // '**' matches any character (like .* in a RegExp).
                    // More than 2 *'s raises an error as it's ill defined.
                    if (matcher.indexOf("***") > -1) throw $sceMinErr("iwcard", "Illegal sequence *** in string matcher.  String: {0}", matcher);
                    return RegExp("^" + (matcher = matcher.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*")) + "$");
                }
                if (isRegExp(matcher)) // The only other type of matcher allowed is a Regexp.
                // Match entire URL / disallow partial matches.
                // Flags are reset (i.e. no global, ignoreCase or multiline)
                return RegExp("^" + matcher.source + "$");
                throw $sceMinErr("imatcher", 'Matchers may only be "self", string patterns or RegExp objects');
            }(matcher));
        }), adjustedMatchers;
    }
    /**
   * @ngdoc service
   * @name ng.$sceDelegate
   * @function
   *
   * @description
   *
   * `$sceDelegate` is a service that is used by the `$sce` service to provide {@link ng.$sce Strict
   * Contextual Escaping (SCE)} services to AngularJS.
   *
   * Typically, you would configure or override the {@link ng.$sceDelegate $sceDelegate} instead of
   * the `$sce` service to customize the way Strict Contextual Escaping works in AngularJS.  This is
   * because, while the `$sce` provides numerous shorthand methods, etc., you really only need to
   * override 3 core functions (`trustAs`, `getTrusted` and `valueOf`) to replace the way things
   * work because `$sce` delegates to `$sceDelegate` for these operations.
   *
   * Refer {@link ng.$sceDelegateProvider $sceDelegateProvider} to configure this service.
   *
   * The default instance of `$sceDelegate` should work out of the box with little pain.  While you
   * can override it completely to change the behavior of `$sce`, the common case would
   * involve configuring the {@link ng.$sceDelegateProvider $sceDelegateProvider} instead by setting
   * your own whitelists and blacklists for trusting URLs used for loading AngularJS resources such as
   * templates.  Refer {@link ng.$sceDelegateProvider#methods_resourceUrlWhitelist
   * $sceDelegateProvider.resourceUrlWhitelist} and {@link
   * ng.$sceDelegateProvider#methods_resourceUrlBlacklist $sceDelegateProvider.resourceUrlBlacklist}
   */ /**
   * @ngdoc object
   * @name ng.$sceDelegateProvider
   * @description
   *
   * The `$sceDelegateProvider` provider allows developers to configure the {@link ng.$sceDelegate
   * $sceDelegate} service.  This allows one to get/set the whitelists and blacklists used to ensure
   * that the URLs used for sourcing Angular templates are safe.  Refer {@link
   * ng.$sceDelegateProvider#methods_resourceUrlWhitelist $sceDelegateProvider.resourceUrlWhitelist} and
   * {@link ng.$sceDelegateProvider#methods_resourceUrlBlacklist $sceDelegateProvider.resourceUrlBlacklist}
   *
   * For the general details about this service in Angular, read the main page for {@link ng.$sce
   * Strict Contextual Escaping (SCE)}.
   *
   * **Example**:  Consider the following case. <a name="example"></a>
   *
   * - your app is hosted at url `http://myapp.example.com/`
   * - but some of your templates are hosted on other domains you control such as
   *   `http://srv01.assets.example.com/`,  `http://srv02.assets.example.com/`, etc.
   * - and you have an open redirect at `http://myapp.example.com/clickThru?...`.
   *
   * Here is what a secure configuration for this scenario might look like:
   *
   * <pre class="prettyprint">
   *    angular.module('myApp', []).config(function($sceDelegateProvider) {
   *      $sceDelegateProvider.resourceUrlWhitelist([
   *        // Allow same origin resource loads.
   *        'self',
   *        // Allow loading from our assets domain.  Notice the difference between * and **.
   *        'http://srv*.assets.example.com/**']);
   *
   *      // The blacklist overrides the whitelist so the open redirect here is blocked.
   *      $sceDelegateProvider.resourceUrlBlacklist([
   *        'http://myapp.example.com/clickThru**']);
   *      });
   * </pre>
   */ function $SceDelegateProvider() {
        this.SCE_CONTEXTS = SCE_CONTEXTS;
        // Resource URLs can also be trusted by policy.
        var resourceUrlWhitelist = [
            "self"
        ], resourceUrlBlacklist = [];
        /**
     * @ngdoc function
     * @name ng.sceDelegateProvider#resourceUrlWhitelist
     * @methodOf ng.$sceDelegateProvider
     * @function
     *
     * @param {Array=} whitelist When provided, replaces the resourceUrlWhitelist with the value
     *     provided.  This must be an array or null.  A snapshot of this array is used so further
     *     changes to the array are ignored.
     *
     *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
     *     allowed in this array.
     *
     *     Note: **an empty whitelist array will block all URLs**!
     *
     * @return {Array} the currently set whitelist array.
     *
     * The **default value** when no whitelist has been explicitly set is `['self']` allowing only
     * same origin resource requests.
     *
     * @description
     * Sets/Gets the whitelist of trusted resource URLs.
     */ this.resourceUrlWhitelist = function(value) {
            return arguments.length && (resourceUrlWhitelist = adjustMatchers(value)), resourceUrlWhitelist;
        }, /**
     * @ngdoc function
     * @name ng.sceDelegateProvider#resourceUrlBlacklist
     * @methodOf ng.$sceDelegateProvider
     * @function
     *
     * @param {Array=} blacklist When provided, replaces the resourceUrlBlacklist with the value
     *     provided.  This must be an array or null.  A snapshot of this array is used so further
     *     changes to the array are ignored.
     *
     *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
     *     allowed in this array.
     *
     *     The typical usage for the blacklist is to **block
     *     [open redirects](http://cwe.mitre.org/data/definitions/601.html)** served by your domain as
     *     these would otherwise be trusted but actually return content from the redirected domain.
     *
     *     Finally, **the blacklist overrides the whitelist** and has the final say.
     *
     * @return {Array} the currently set blacklist array.
     *
     * The **default value** when no whitelist has been explicitly set is the empty array (i.e. there
     * is no blacklist.)
     *
     * @description
     * Sets/Gets the blacklist of trusted resource URLs.
     */ this.resourceUrlBlacklist = function(value) {
            return arguments.length && (resourceUrlBlacklist = adjustMatchers(value)), resourceUrlBlacklist;
        }, this.$get = [
            "$injector",
            function($injector) {
                var htmlSanitizer = function(html) {
                    throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.");
                };
                function matchUrl(matcher, parsedUrl) {
                    return "self" === matcher ? urlIsSameOrigin(parsedUrl) : !!matcher.exec(parsedUrl.href);
                }
                function generateHolderType(Base) {
                    var holderType = function(trustedValue) {
                        this.$$unwrapTrustedValue = function() {
                            return trustedValue;
                        };
                    };
                    return Base && (holderType.prototype = new Base()), holderType.prototype.valueOf = function() {
                        return this.$$unwrapTrustedValue();
                    }, holderType.prototype.toString = function() {
                        return this.$$unwrapTrustedValue().toString();
                    }, holderType;
                }
                $injector.has("$sanitize") && (htmlSanitizer = $injector.get("$sanitize"));
                var trustedValueHolderBase = generateHolderType(), byType = {};
                return byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]), {
                    trustAs: /**
         * @ngdoc method
         * @name ng.$sceDelegate#trustAs
         * @methodOf ng.$sceDelegate
         *
         * @description
         * Returns an object that is trusted by angular for use in specified strict
         * contextual escaping contexts (such as ng-html-bind-unsafe, ng-include, any src
         * attribute interpolation, any dom event binding attribute interpolation
         * such as for onclick,  etc.) that uses the provided value.
         * See {@link ng.$sce $sce} for enabling strict contextual escaping.
         *
         * @param {string} type The kind of context in which this value is safe for use.  e.g. url,
         *   resourceUrl, html, js and css.
         * @param {*} value The value that that should be considered trusted/safe.
         * @returns {*} A value that can be used to stand in for the provided `value` in places
         * where Angular expects a $sce.trustAs() return value.
         */ function(type, trustedValue) {
                        var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                        if (!Constructor) throw $sceMinErr("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", type, trustedValue);
                        if (null == trustedValue || "" === trustedValue) return trustedValue;
                        // All the current contexts in SCE_CONTEXTS happen to be strings.  In order to avoid trusting
                        // mutable objects, we ensure here that the value passed in is actually a string.
                        if ("string" != typeof trustedValue) throw $sceMinErr("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", type);
                        return new Constructor(trustedValue);
                    },
                    getTrusted: /**
         * @ngdoc method
         * @name ng.$sceDelegate#getTrusted
         * @methodOf ng.$sceDelegate
         *
         * @description
         * Takes the result of a {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`} call and
         * returns the originally supplied value if the queried context type is a supertype of the
         * created type.  If this condition isn't satisfied, throws an exception.
         *
         * @param {string} type The kind of context in which this value is to be used.
         * @param {*} maybeTrusted The result of a prior {@link ng.$sceDelegate#methods_trustAs
         *     `$sceDelegate.trustAs`} call.
         * @returns {*} The value the was originally provided to {@link ng.$sceDelegate#methods_trustAs
         *     `$sceDelegate.trustAs`} if valid in this context.  Otherwise, throws an exception.
         */ function(type, maybeTrusted) {
                        if (null == maybeTrusted || "" === maybeTrusted) return maybeTrusted;
                        var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                        if (constructor && maybeTrusted instanceof constructor) return maybeTrusted.$$unwrapTrustedValue();
                        // If we get here, then we may only take one of two actions.
                        // 1. sanitize the value for the requested type, or
                        // 2. throw an exception.
                        if (type === SCE_CONTEXTS.RESOURCE_URL) {
                            if (function(url) {
                                var i, n, parsedUrl = urlResolve(url.toString()), allowed = !1;
                                // Ensure that at least one item from the whitelist allows this url.
                                for(i = 0, n = resourceUrlWhitelist.length; i < n; i++)if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                                    allowed = !0;
                                    break;
                                }
                                if (allowed) // Ensure that no item from the blacklist blocked this url.
                                {
                                    for(i = 0, n = resourceUrlBlacklist.length; i < n; i++)if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                                        allowed = !1;
                                        break;
                                    }
                                }
                                return allowed;
                            }(maybeTrusted)) return maybeTrusted;
                            throw $sceMinErr("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", maybeTrusted.toString());
                        }
                        if (type === SCE_CONTEXTS.HTML) return htmlSanitizer(maybeTrusted);
                        throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.");
                    },
                    valueOf: /**
         * @ngdoc method
         * @name ng.$sceDelegate#valueOf
         * @methodOf ng.$sceDelegate
         *
         * @description
         * If the passed parameter had been returned by a prior call to {@link ng.$sceDelegate#methods_trustAs
         * `$sceDelegate.trustAs`}, returns the value that had been passed to {@link
         * ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`}.
         *
         * If the passed parameter is not a value that had been returned by {@link
         * ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`}, returns it as-is.
         *
         * @param {*} value The result of a prior {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`}
         *      call or anything else.
         * @returns {*} The value the was originally provided to {@link ng.$sceDelegate#methods_trustAs
         *     `$sceDelegate.trustAs`} if `value` is the result of such a call.  Otherwise, returns
         *     `value` unchanged.
         */ function(maybeTrusted) {
                        return maybeTrusted instanceof trustedValueHolderBase ? maybeTrusted.$$unwrapTrustedValue() : maybeTrusted;
                    }
                };
            }
        ];
    }
    /**
   * @ngdoc object
   * @name ng.$sceProvider
   * @description
   *
   * The $sceProvider provider allows developers to configure the {@link ng.$sce $sce} service.
   * -   enable/disable Strict Contextual Escaping (SCE) in a module
   * -   override the default implementation with a custom delegate
   *
   * Read more about {@link ng.$sce Strict Contextual Escaping (SCE)}.
   */ /* jshint maxlen: false*/ /**
 * @ngdoc service
 * @name ng.$sce
 * @function
 *
 * @description
 *
 * `$sce` is a service that provides Strict Contextual Escaping services to AngularJS.
 *
 * # Strict Contextual Escaping
 *
 * Strict Contextual Escaping (SCE) is a mode in which AngularJS requires bindings in certain
 * contexts to result in a value that is marked as safe to use for that context.  One example of
 * such a context is binding arbitrary html controlled by the user via `ng-bind-html`.  We refer
 * to these contexts as privileged or SCE contexts.
 *
 * As of version 1.2, Angular ships with SCE enabled by default.
 *
 * Note:  When enabled (the default), IE8 in quirks mode is not supported.  In this mode, IE8 allows
 * one to execute arbitrary javascript by the use of the expression() syntax.  Refer
 * <http://blogs.msdn.com/b/ie/archive/2008/10/16/ending-expressions.aspx> to learn more about them.
 * You can ensure your document is in standards mode and not quirks mode by adding `<!doctype html>`
 * to the top of your HTML document.
 *
 * SCE assists in writing code in way that (a) is secure by default and (b) makes auditing for
 * security vulnerabilities such as XSS, clickjacking, etc. a lot easier.
 *
 * Here's an example of a binding in a privileged context:
 *
 * <pre class="prettyprint">
 *     <input ng-model="userHtml">
 *     <div ng-bind-html="userHtml">
 * </pre>
 *
 * Notice that `ng-bind-html` is bound to `userHtml` controlled by the user.  With SCE
 * disabled, this application allows the user to render arbitrary HTML into the DIV.
 * In a more realistic example, one may be rendering user comments, blog articles, etc. via
 * bindings.  (HTML is just one example of a context where rendering user controlled input creates
 * security vulnerabilities.)
 *
 * For the case of HTML, you might use a library, either on the client side, or on the server side,
 * to sanitize unsafe HTML before binding to the value and rendering it in the document.
 *
 * How would you ensure that every place that used these types of bindings was bound to a value that
 * was sanitized by your library (or returned as safe for rendering by your server?)  How can you
 * ensure that you didn't accidentally delete the line that sanitized the value, or renamed some
 * properties/fields and forgot to update the binding to the sanitized value?
 *
 * To be secure by default, you want to ensure that any such bindings are disallowed unless you can
 * determine that something explicitly says it's safe to use a value for binding in that
 * context.  You can then audit your code (a simple grep would do) to ensure that this is only done
 * for those values that you can easily tell are safe - because they were received from your server,
 * sanitized by your library, etc.  You can organize your codebase to help with this - perhaps
 * allowing only the files in a specific directory to do this.  Ensuring that the internal API
 * exposed by that code doesn't markup arbitrary values as safe then becomes a more manageable task.
 *
 * In the case of AngularJS' SCE service, one uses {@link ng.$sce#methods_trustAs $sce.trustAs} 
 * (and shorthand methods such as {@link ng.$sce#methods_trustAsHtml $sce.trustAsHtml}, etc.) to
 * obtain values that will be accepted by SCE / privileged contexts.
 *
 *
 * ## How does it work?
 *
 * In privileged contexts, directives and code will bind to the result of {@link ng.$sce#methods_getTrusted
 * $sce.getTrusted(context, value)} rather than to the value directly.  Directives use {@link
 * ng.$sce#methods_parse $sce.parseAs} rather than `$parse` to watch attribute bindings, which performs the
 * {@link ng.$sce#methods_getTrusted $sce.getTrusted} behind the scenes on non-constant literals.
 *
 * As an example, {@link ng.directive:ngBindHtml ngBindHtml} uses {@link
 * ng.$sce#methods_parseAsHtml $sce.parseAsHtml(binding expression)}.  Here's the actual code (slightly
 * simplified):
 *
 * <pre class="prettyprint">
 *   var ngBindHtmlDirective = ['$sce', function($sce) {
 *     return function(scope, element, attr) {
 *       scope.$watch($sce.parseAsHtml(attr.ngBindHtml), function(value) {
 *         element.html(value || '');
 *       });
 *     };
 *   }];
 * </pre>
 *
 * ## Impact on loading templates
 *
 * This applies both to the {@link ng.directive:ngInclude `ng-include`} directive as well as
 * `templateUrl`'s specified by {@link guide/directive directives}.
 *
 * By default, Angular only loads templates from the same domain and protocol as the application
 * document.  This is done by calling {@link ng.$sce#methods_getTrustedResourceUrl
 * $sce.getTrustedResourceUrl} on the template URL.  To load templates from other domains and/or
 * protocols, you may either either {@link ng.$sceDelegateProvider#methods_resourceUrlWhitelist whitelist
 * them} or {@link ng.$sce#methods_trustAsResourceUrl wrap it} into a trusted value.
 *
 * *Please note*:
 * The browser's
 * {@link https://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest
 * Same Origin Policy} and {@link http://www.w3.org/TR/cors/ Cross-Origin Resource Sharing (CORS)}
 * policy apply in addition to this and may further restrict whether the template is successfully
 * loaded.  This means that without the right CORS policy, loading templates from a different domain
 * won't work on all browsers.  Also, loading templates from `file://` URL does not work on some
 * browsers.
 *
 * ## This feels like too much overhead for the developer?
 *
 * It's important to remember that SCE only applies to interpolation expressions.
 *
 * If your expressions are constant literals, they're automatically trusted and you don't need to
 * call `$sce.trustAs` on them.  (e.g.
 * `<div ng-html-bind-unsafe="'<b>implicitly trusted</b>'"></div>`) just works.
 *
 * Additionally, `a[href]` and `img[src]` automatically sanitize their URLs and do not pass them
 * through {@link ng.$sce#methods_getTrusted $sce.getTrusted}.  SCE doesn't play a role here.
 *
 * The included {@link ng.$sceDelegate $sceDelegate} comes with sane defaults to allow you to load
 * templates in `ng-include` from your application's domain without having to even know about SCE.
 * It blocks loading templates from other domains or loading templates over http from an https
 * served document.  You can change these by setting your own custom {@link
 * ng.$sceDelegateProvider#methods_resourceUrlWhitelist whitelists} and {@link
 * ng.$sceDelegateProvider#methods_resourceUrlBlacklist blacklists} for matching such URLs.
 *
 * This significantly reduces the overhead.  It is far easier to pay the small overhead and have an
 * application that's secure and can be audited to verify that with much more ease than bolting
 * security onto an application later.
 *
 * <a name="contexts"></a>
 * ## What trusted context types are supported?
 *
 * | Context             | Notes          |
 * |---------------------|----------------|
 * | `$sce.HTML`         | For HTML that's safe to source into the application.  The {@link ng.directive:ngBindHtml ngBindHtml} directive uses this context for bindings. |
 * | `$sce.CSS`          | For CSS that's safe to source into the application.  Currently unused.  Feel free to use it in your own directives. |
 * | `$sce.URL`          | For URLs that are safe to follow as links.  Currently unused (`<a href=` and `<img src=` sanitize their urls and don't consititute an SCE context. |
 * | `$sce.RESOURCE_URL` | For URLs that are not only safe to follow as links, but whose contens are also safe to include in your application.  Examples include `ng-include`, `src` / `ngSrc` bindings for tags other than `IMG` (e.g. `IFRAME`, `OBJECT`, etc.)  <br><br>Note that `$sce.RESOURCE_URL` makes a stronger statement about the URL than `$sce.URL` does and therefore contexts requiring values trusted for `$sce.RESOURCE_URL` can be used anywhere that values trusted for `$sce.URL` are required. |
 * | `$sce.JS`           | For JavaScript that is safe to execute in your application's context.  Currently unused.  Feel free to use it in your own directives. |
 *
 * ## Format of items in {@link ng.$sceDelegateProvider#methods_resourceUrlWhitelist resourceUrlWhitelist}/{@link ng.$sceDelegateProvider#methods_resourceUrlBlacklist Blacklist} <a name="resourceUrlPatternItem"></a>
 *
 *  Each element in these arrays must be one of the following:
 *
 *  - **'self'**
 *    - The special **string**, `'self'`, can be used to match against all URLs of the **same
 *      domain** as the application document using the **same protocol**.
 *  - **String** (except the special value `'self'`)
 *    - The string is matched against the full *normalized / absolute URL* of the resource
 *      being tested (substring matches are not good enough.)
 *    - There are exactly **two wildcard sequences** - `*` and `**`.  All other characters
 *      match themselves.
 *    - `*`: matches zero or more occurances of any character other than one of the following 6
 *      characters: '`:`', '`/`', '`.`', '`?`', '`&`' and ';'.  It's a useful wildcard for use
 *      in a whitelist.
 *    - `**`: matches zero or more occurances of *any* character.  As such, it's not
 *      not appropriate to use in for a scheme, domain, etc. as it would match too much.  (e.g.
 *      http://**.example.com/ would match http://evil.com/?ignore=.example.com/ and that might
 *      not have been the intention.)  It's usage at the very end of the path is ok.  (e.g.
 *      http://foo.example.com/templates/**).
 *  - **RegExp** (*see caveat below*)
 *    - *Caveat*:  While regular expressions are powerful and offer great flexibility,  their syntax
 *      (and all the inevitable escaping) makes them *harder to maintain*.  It's easy to
 *      accidentally introduce a bug when one updates a complex expression (imho, all regexes should
 *      have good test coverage.).  For instance, the use of `.` in the regex is correct only in a
 *      small number of cases.  A `.` character in the regex used when matching the scheme or a
 *      subdomain could be matched against a `:` or literal `.` that was likely not intended.   It
 *      is highly recommended to use the string patterns and only fall back to regular expressions
 *      if they as a last resort.
 *    - The regular expression must be an instance of RegExp (i.e. not a string.)  It is
 *      matched against the **entire** *normalized / absolute URL* of the resource being tested
 *      (even when the RegExp did not have the `^` and `$` codes.)  In addition, any flags
 *      present on the RegExp (such as multiline, global, ignoreCase) are ignored.
 *    - If you are generating your Javascript from some other templating engine (not
 *      recommended, e.g. in issue [#4006](https://github.com/angular/angular.js/issues/4006)),
 *      remember to escape your regular expression (and be aware that you might need more than
 *      one level of escaping depending on your templating engine and the way you interpolated
 *      the value.)  Do make use of your platform's escaping mechanism as it might be good
 *      enough before coding your own.  e.g. Ruby has
 *      [Regexp.escape(str)](http://www.ruby-doc.org/core-2.0.0/Regexp.html#method-c-escape)
 *      and Python has [re.escape](http://docs.python.org/library/re.html#re.escape).
 *      Javascript lacks a similar built in function for escaping.  Take a look at Google
 *      Closure library's [goog.string.regExpEscape(s)](
 *      http://docs.closure-library.googlecode.com/git/closure_goog_string_string.js.source.html#line962).
 *
 * Refer {@link ng.$sceDelegateProvider $sceDelegateProvider} for an example.
 *
 * ## Show me an example using SCE.
 *
 * @example
<example module="mySceApp">
<file name="index.html">
  <div ng-controller="myAppController as myCtrl">
    <i ng-bind-html="myCtrl.explicitlyTrustedHtml" id="explicitlyTrustedHtml"></i><br><br>
    <b>User comments</b><br>
    By default, HTML that isn't explicitly trusted (e.g. Alice's comment) is sanitized when
    $sanitize is available.  If $sanitize isn't available, this results in an error instead of an
    exploit.
    <div class="well">
      <div ng-repeat="userComment in myCtrl.userComments">
        <b>{{userComment.name}}</b>:
        <span ng-bind-html="userComment.htmlComment" class="htmlComment"></span>
        <br>
      </div>
    </div>
  </div>
</file>

<file name="script.js">
  var mySceApp = angular.module('mySceApp', ['ngSanitize']);

  mySceApp.controller("myAppController", function myAppController($http, $templateCache, $sce) {
    var self = this;
    $http.get("test_data.json", {cache: $templateCache}).success(function(userComments) {
      self.userComments = userComments;
    });
    self.explicitlyTrustedHtml = $sce.trustAsHtml(
        '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
        'sanitization.&quot;">Hover over this text.</span>');
  });
</file>

<file name="test_data.json">
[
  { "name": "Alice",
    "htmlComment":
        "<span onmouseover='this.textContent=\"PWN3D!\"'>Is <i>anyone</i> reading this?</span>"
  },
  { "name": "Bob",
    "htmlComment": "<i>Yes!</i>  Am I the only other one?"
  }
]
</file>

<file name="scenario.js">
  describe('SCE doc demo', function() {
    it('should sanitize untrusted values', function() {
      expect(element('.htmlComment').html()).toBe('<span>Is <i>anyone</i> reading this?</span>');
    });
    it('should NOT sanitize explicitly trusted values', function() {
      expect(element('#explicitlyTrustedHtml').html()).toBe(
          '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
          'sanitization.&quot;">Hover over this text.</span>');
    });
  });
</file>
</example>
 *
 *
 *
 * ## Can I disable SCE completely?
 *
 * Yes, you can.  However, this is strongly discouraged.  SCE gives you a lot of security benefits
 * for little coding overhead.  It will be much harder to take an SCE disabled application and
 * either secure it on your own or enable SCE at a later stage.  It might make sense to disable SCE
 * for cases where you have a lot of existing code that was written before SCE was introduced and
 * you're migrating them a module at a time.
 *
 * That said, here's how you can completely disable SCE:
 *
 * <pre class="prettyprint">
 *   angular.module('myAppWithSceDisabledmyApp', []).config(function($sceProvider) {
 *     // Completely disable SCE.  For demonstration purposes only!
 *     // Do not use in new projects.
 *     $sceProvider.enabled(false);
 *   });
 * </pre>
 *
 */ /* jshint maxlen: 100 */ function $SceProvider() {
        var enabled = !0;
        /**
     * @ngdoc function
     * @name ng.sceProvider#enabled
     * @methodOf ng.$sceProvider
     * @function
     *
     * @param {boolean=} value If provided, then enables/disables SCE.
     * @return {boolean} true if SCE is enabled, false otherwise.
     *
     * @description
     * Enables/disables SCE and returns the current value.
     */ this.enabled = function(value) {
            return arguments.length && (enabled = !!value), enabled;
        }, /* Design notes on the default implementation for SCE.
     *
     * The API contract for the SCE delegate
     * -------------------------------------
     * The SCE delegate object must provide the following 3 methods:
     *
     * - trustAs(contextEnum, value)
     *     This method is used to tell the SCE service that the provided value is OK to use in the
     *     contexts specified by contextEnum.  It must return an object that will be accepted by
     *     getTrusted() for a compatible contextEnum and return this value.
     *
     * - valueOf(value)
     *     For values that were not produced by trustAs(), return them as is.  For values that were
     *     produced by trustAs(), return the corresponding input value to trustAs.  Basically, if
     *     trustAs is wrapping the given values into some type, this operation unwraps it when given
     *     such a value.
     *
     * - getTrusted(contextEnum, value)
     *     This function should return the a value that is safe to use in the context specified by
     *     contextEnum or throw and exception otherwise.
     *
     * NOTE: This contract deliberately does NOT state that values returned by trustAs() must be
     * opaque or wrapped in some holder object.  That happens to be an implementation detail.  For
     * instance, an implementation could maintain a registry of all trusted objects by context.  In
     * such a case, trustAs() would return the same object that was passed in.  getTrusted() would
     * return the same object passed in if it was found in the registry under a compatible context or
     * throw an exception otherwise.  An implementation might only wrap values some of the time based
     * on some criteria.  getTrusted() might return a value and not throw an exception for special
     * constants or objects even if not wrapped.  All such implementations fulfill this contract.
     *
     *
     * A note on the inheritance model for SCE contexts
     * ------------------------------------------------
     * I've used inheritance and made RESOURCE_URL wrapped types a subtype of URL wrapped types.  This
     * is purely an implementation details.
     *
     * The contract is simply this:
     *
     *     getTrusted($sce.RESOURCE_URL, value) succeeding implies that getTrusted($sce.URL, value)
     *     will also succeed.
     *
     * Inheritance happens to capture this in a natural way.  In some future, we
     * may not use inheritance anymore.  That is OK because no code outside of
     * sce.js and sceSpecs.js would need to be aware of this detail.
     */ this.$get = [
            "$parse",
            "$sniffer",
            "$sceDelegate",
            function($parse, $sniffer, $sceDelegate) {
                // Prereq: Ensure that we're not running in IE8 quirks mode.  In that mode, IE allows
                // the "expression(javascript expression)" syntax which is insecure.
                if (enabled && $sniffer.msie && $sniffer.msieDocumentMode < 8) throw $sceMinErr("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
                var sce = copy(SCE_CONTEXTS);
                /**
         * @ngdoc function
         * @name ng.sce#isEnabled
         * @methodOf ng.$sce
         * @function
         *
         * @return {Boolean} true if SCE is enabled, false otherwise.  If you want to set the value, you
         * have to do it at module config time on {@link ng.$sceProvider $sceProvider}.
         *
         * @description
         * Returns a boolean indicating if SCE is enabled.
         */ sce.isEnabled = function() {
                    return enabled;
                }, sce.trustAs = $sceDelegate.trustAs, sce.getTrusted = $sceDelegate.getTrusted, sce.valueOf = $sceDelegate.valueOf, enabled || (sce.trustAs = sce.getTrusted = function(type, value) {
                    return value;
                }, sce.valueOf = identity), /**
         * @ngdoc method
         * @name ng.$sce#parse
         * @methodOf ng.$sce
         *
         * @description
         * Converts Angular {@link guide/expression expression} into a function.  This is like {@link
         * ng.$parse $parse} and is identical when the expression is a literal constant.  Otherwise, it
         * wraps the expression in a call to {@link ng.$sce#methods_getTrusted $sce.getTrusted(*type*,
         * *result*)}
         *
         * @param {string} type The kind of SCE context in which this result will be used.
         * @param {string} expression String expression to compile.
         * @returns {function(context, locals)} a function which represents the compiled expression:
         *
         *    * `context` – `{object}` – an object against which any expressions embedded in the strings
         *      are evaluated against (typically a scope object).
         *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
         *      `context`.
         */ sce.parseAs = function(type, expr) {
                    var parsed = $parse(expr);
                    return parsed.literal && parsed.constant ? parsed : function(self, locals) {
                        return sce.getTrusted(type, parsed(self, locals));
                    };
                };
                /**
         * @ngdoc method
         * @name ng.$sce#trustAs
         * @methodOf ng.$sce
         *
         * @description
         * Delegates to {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`}.  As such,
         * returns an objectthat is trusted by angular for use in specified strict contextual
         * escaping contexts (such as ng-html-bind-unsafe, ng-include, any src attribute
         * interpolation, any dom event binding attribute interpolation such as for onclick,  etc.)
         * that uses the provided value.  See * {@link ng.$sce $sce} for enabling strict contextual
         * escaping.
         *
         * @param {string} type The kind of context in which this value is safe for use.  e.g. url,
         *   resource_url, html, js and css.
         * @param {*} value The value that that should be considered trusted/safe.
         * @returns {*} A value that can be used to stand in for the provided `value` in places
         * where Angular expects a $sce.trustAs() return value.
         */ /**
         * @ngdoc method
         * @name ng.$sce#trustAsHtml
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.trustAsHtml(value)` →
         *     {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs($sce.HTML, value)`}
         *
         * @param {*} value The value to trustAs.
         * @returns {*} An object that can be passed to {@link ng.$sce#methods_getTrustedHtml
         *     $sce.getTrustedHtml(value)} to obtain the original value.  (privileged directives
         *     only accept expressions that are either literal constants or are the
         *     return value of {@link ng.$sce#methods_trustAs $sce.trustAs}.)
         */ /**
         * @ngdoc method
         * @name ng.$sce#trustAsUrl
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.trustAsUrl(value)` →
         *     {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs($sce.URL, value)`}
         *
         * @param {*} value The value to trustAs.
         * @returns {*} An object that can be passed to {@link ng.$sce#methods_getTrustedUrl
         *     $sce.getTrustedUrl(value)} to obtain the original value.  (privileged directives
         *     only accept expressions that are either literal constants or are the
         *     return value of {@link ng.$sce#methods_trustAs $sce.trustAs}.)
         */ /**
         * @ngdoc method
         * @name ng.$sce#trustAsResourceUrl
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.trustAsResourceUrl(value)` →
         *     {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs($sce.RESOURCE_URL, value)`}
         *
         * @param {*} value The value to trustAs.
         * @returns {*} An object that can be passed to {@link ng.$sce#methods_getTrustedResourceUrl
         *     $sce.getTrustedResourceUrl(value)} to obtain the original value.  (privileged directives
         *     only accept expressions that are either literal constants or are the return
         *     value of {@link ng.$sce#methods_trustAs $sce.trustAs}.)
         */ /**
         * @ngdoc method
         * @name ng.$sce#trustAsJs
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.trustAsJs(value)` →
         *     {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs($sce.JS, value)`}
         *
         * @param {*} value The value to trustAs.
         * @returns {*} An object that can be passed to {@link ng.$sce#methods_getTrustedJs
         *     $sce.getTrustedJs(value)} to obtain the original value.  (privileged directives
         *     only accept expressions that are either literal constants or are the
         *     return value of {@link ng.$sce#methods_trustAs $sce.trustAs}.)
         */ /**
         * @ngdoc method
         * @name ng.$sce#getTrusted
         * @methodOf ng.$sce
         *
         * @description
         * Delegates to {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted`}.  As such,
         * takes the result of a {@link ng.$sce#methods_trustAs `$sce.trustAs`}() call and returns the
         * originally supplied value if the queried context type is a supertype of the created type.
         * If this condition isn't satisfied, throws an exception.
         *
         * @param {string} type The kind of context in which this value is to be used.
         * @param {*} maybeTrusted The result of a prior {@link ng.$sce#methods_trustAs `$sce.trustAs`}
         *                         call.
         * @returns {*} The value the was originally provided to
         *              {@link ng.$sce#methods_trustAs `$sce.trustAs`} if valid in this context.
         *              Otherwise, throws an exception.
         */ /**
         * @ngdoc method
         * @name ng.$sce#getTrustedHtml
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.getTrustedHtml(value)` →
         *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.HTML, value)`}
         *
         * @param {*} value The value to pass to `$sce.getTrusted`.
         * @returns {*} The return value of `$sce.getTrusted($sce.HTML, value)`
         */ /**
         * @ngdoc method
         * @name ng.$sce#getTrustedCss
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.getTrustedCss(value)` →
         *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.CSS, value)`}
         *
         * @param {*} value The value to pass to `$sce.getTrusted`.
         * @returns {*} The return value of `$sce.getTrusted($sce.CSS, value)`
         */ /**
         * @ngdoc method
         * @name ng.$sce#getTrustedUrl
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.getTrustedUrl(value)` →
         *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.URL, value)`}
         *
         * @param {*} value The value to pass to `$sce.getTrusted`.
         * @returns {*} The return value of `$sce.getTrusted($sce.URL, value)`
         */ /**
         * @ngdoc method
         * @name ng.$sce#getTrustedResourceUrl
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.getTrustedResourceUrl(value)` →
         *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.RESOURCE_URL, value)`}
         *
         * @param {*} value The value to pass to `$sceDelegate.getTrusted`.
         * @returns {*} The return value of `$sce.getTrusted($sce.RESOURCE_URL, value)`
         */ /**
         * @ngdoc method
         * @name ng.$sce#getTrustedJs
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.getTrustedJs(value)` →
         *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.JS, value)`}
         *
         * @param {*} value The value to pass to `$sce.getTrusted`.
         * @returns {*} The return value of `$sce.getTrusted($sce.JS, value)`
         */ /**
         * @ngdoc method
         * @name ng.$sce#parseAsHtml
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.parseAsHtml(expression string)` →
         *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.HTML, value)`}
         *
         * @param {string} expression String expression to compile.
         * @returns {function(context, locals)} a function which represents the compiled expression:
         *
         *    * `context` – `{object}` – an object against which any expressions embedded in the strings
         *      are evaluated against (typically a scope object).
         *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
         *      `context`.
         */ /**
         * @ngdoc method
         * @name ng.$sce#parseAsCss
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.parseAsCss(value)` →
         *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.CSS, value)`}
         *
         * @param {string} expression String expression to compile.
         * @returns {function(context, locals)} a function which represents the compiled expression:
         *
         *    * `context` – `{object}` – an object against which any expressions embedded in the strings
         *      are evaluated against (typically a scope object).
         *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
         *      `context`.
         */ /**
         * @ngdoc method
         * @name ng.$sce#parseAsUrl
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.parseAsUrl(value)` →
         *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.URL, value)`}
         *
         * @param {string} expression String expression to compile.
         * @returns {function(context, locals)} a function which represents the compiled expression:
         *
         *    * `context` – `{object}` – an object against which any expressions embedded in the strings
         *      are evaluated against (typically a scope object).
         *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
         *      `context`.
         */ /**
         * @ngdoc method
         * @name ng.$sce#parseAsResourceUrl
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.parseAsResourceUrl(value)` →
         *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.RESOURCE_URL, value)`}
         *
         * @param {string} expression String expression to compile.
         * @returns {function(context, locals)} a function which represents the compiled expression:
         *
         *    * `context` – `{object}` – an object against which any expressions embedded in the strings
         *      are evaluated against (typically a scope object).
         *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
         *      `context`.
         */ /**
         * @ngdoc method
         * @name ng.$sce#parseAsJs
         * @methodOf ng.$sce
         *
         * @description
         * Shorthand method.  `$sce.parseAsJs(value)` →
         *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.JS, value)`}
         *
         * @param {string} expression String expression to compile.
         * @returns {function(context, locals)} a function which represents the compiled expression:
         *
         *    * `context` – `{object}` – an object against which any expressions embedded in the strings
         *      are evaluated against (typically a scope object).
         *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
         *      `context`.
         */ // Shorthand delegations.
                var parse = sce.parseAs, getTrusted = sce.getTrusted, trustAs = sce.trustAs;
                return forEach(SCE_CONTEXTS, function(enumValue, name) {
                    var lName = lowercase(name);
                    sce[camelCase("parse_as_" + lName)] = function(expr) {
                        return parse(enumValue, expr);
                    }, sce[camelCase("get_trusted_" + lName)] = function(value) {
                        return getTrusted(enumValue, value);
                    }, sce[camelCase("trust_as_" + lName)] = function(value) {
                        return trustAs(enumValue, value);
                    };
                }), sce;
            }
        ];
    }
    /**
   * !!! This is an undocumented "private" service !!!
   *
   * @name ng.$sniffer
   * @requires $window
   * @requires $document
   *
   * @property {boolean} history Does the browser support html5 history api ?
   * @property {boolean} hashchange Does the browser support hashchange event ?
   * @property {boolean} transitions Does the browser support CSS transition events ?
   * @property {boolean} animations Does the browser support CSS animation events ?
   *
   * @description
   * This is very simple implementation of testing browser's features.
   */ function $SnifferProvider() {
        this.$get = [
            "$window",
            "$document",
            function($window, $document) {
                var vendorPrefix, match, eventSupport = {}, android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]), boxee = /Boxee/i.test(($window.navigator || {}).userAgent), document1 = $document[0] || {}, documentMode = document1.documentMode, vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/, bodyStyle = document1.body && document1.body.style, transitions = !1, animations = !1;
                if (bodyStyle) {
                    for(var prop in bodyStyle)if (match = vendorRegex.exec(prop)) {
                        vendorPrefix = (vendorPrefix = match[0]).substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
                        break;
                    }
                    vendorPrefix || (vendorPrefix = "WebkitOpacity" in bodyStyle && "webkit"), transitions = !!("transition" in bodyStyle || vendorPrefix + "Transition" in bodyStyle), animations = !!("animation" in bodyStyle || vendorPrefix + "Animation" in bodyStyle), !android || transitions && animations || (transitions = isString(document1.body.style.webkitTransition), animations = isString(document1.body.style.webkitAnimation));
                }
                return {
                    // Android has history.pushState, but it does not update location correctly
                    // so let's not use the history API at all.
                    // http://code.google.com/p/android/issues/detail?id=17471
                    // https://github.com/angular/angular.js/issues/904
                    // older webit browser (533.9) on Boxee box has exactly the same problem as Android has
                    // so let's not use the history API also
                    // We are purposefully using `!(android < 4)` to cover the case when `android` is undefined
                    // jshint -W018
                    history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
                    // jshint +W018
                    hashchange: "onhashchange" in $window && // IE8 compatible mode lies
                    (!documentMode || documentMode > 7),
                    hasEvent: function(event) {
                        // IE9 implements 'input' event it's so fubared that we rather pretend that it doesn't have
                        // it. In particular the event is not fired when backspace or delete key are pressed or
                        // when cut operation is performed.
                        if ("input" == event && 9 == msie) return !1;
                        if (isUndefined(eventSupport[event])) {
                            var divElm = document1.createElement("div");
                            eventSupport[event] = "on" + event in divElm;
                        }
                        return eventSupport[event];
                    },
                    csp: csp(),
                    vendorPrefix: vendorPrefix,
                    transitions: transitions,
                    animations: animations,
                    msie: msie,
                    msieDocumentMode: documentMode
                };
            }
        ];
    }
    function $TimeoutProvider() {
        this.$get = [
            "$rootScope",
            "$browser",
            "$q",
            "$exceptionHandler",
            function($rootScope, $browser, $q, $exceptionHandler) {
                var deferreds = {};
                /**
      * @ngdoc function
      * @name ng.$timeout
      * @requires $browser
      *
      * @description
      * Angular's wrapper for `window.setTimeout`. The `fn` function is wrapped into a try/catch
      * block and delegates any exceptions to
      * {@link ng.$exceptionHandler $exceptionHandler} service.
      *
      * The return value of registering a timeout function is a promise, which will be resolved when
      * the timeout is reached and the timeout function is executed.
      *
      * To cancel a timeout request, call `$timeout.cancel(promise)`.
      *
      * In tests you can use {@link ngMock.$timeout `$timeout.flush()`} to
      * synchronously flush the queue of deferred functions.
      *
      * @param {function()} fn A function, whose execution should be delayed.
      * @param {number=} [delay=0] Delay in milliseconds.
      * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
      *   will invoke `fn` within the {@link ng.$rootScope.Scope#methods_$apply $apply} block.
      * @returns {Promise} Promise that will be resolved when the timeout is reached. The value this
      *   promise will be resolved with is the return value of the `fn` function.
      * 
      * @example
      <doc:example module="time">
        <doc:source>
          <script>
            function Ctrl2($scope,$timeout) {
              $scope.format = 'M/d/yy h:mm:ss a';
              $scope.blood_1 = 100;
              $scope.blood_2 = 120;

              var stop;
              $scope.fight = function() {
                stop = $timeout(function() {
                  if ($scope.blood_1 > 0 && $scope.blood_2 > 0) {
                      $scope.blood_1 = $scope.blood_1 - 3;
                      $scope.blood_2 = $scope.blood_2 - 4;
                      $scope.fight();
                  } else {
                      $timeout.cancel(stop);
                  }
                }, 100);
              };

              $scope.stopFight = function() {
                $timeout.cancel(stop);
              };

              $scope.resetFight = function() {
                $scope.blood_1 = 100;
                $scope.blood_2 = 120;
              }
            }

            angular.module('time', [])
              // Register the 'myCurrentTime' directive factory method.
              // We inject $timeout and dateFilter service since the factory method is DI.
              .directive('myCurrentTime', function($timeout, dateFilter) {
                // return the directive link function. (compile function not needed)
                return function(scope, element, attrs) {
                  var format,  // date format
                  timeoutId; // timeoutId, so that we can cancel the time updates

                  // used to update the UI
                  function updateTime() {
                    element.text(dateFilter(new Date(), format));
                  }

                  // watch the expression, and update the UI on change.
                  scope.$watch(attrs.myCurrentTime, function(value) {
                    format = value;
                    updateTime();
                  });

                  // schedule update in one second
                  function updateLater() {
                    // save the timeoutId for canceling
                    timeoutId = $timeout(function() {
                      updateTime(); // update DOM
                      updateLater(); // schedule another update
                    }, 1000);
                  }

                  // listen on DOM destroy (removal) event, and cancel the next UI update
                  // to prevent updating time ofter the DOM element was removed.
                  element.bind('$destroy', function() {
                    $timeout.cancel(timeoutId);
                  });

                  updateLater(); // kick off the UI update process.
                }
              });
          </script>

          <div>
            <div ng-controller="Ctrl2">
              Date format: <input ng-model="format"> <hr/>
              Current time is: <span my-current-time="format"></span>
              <hr/>
              Blood 1 : <font color='red'>{{blood_1}}</font>
              Blood 2 : <font color='red'>{{blood_2}}</font>
              <button type="button" data-ng-click="fight()">Fight</button>
              <button type="button" data-ng-click="stopFight()">StopFight</button>
              <button type="button" data-ng-click="resetFight()">resetFight</button>
            </div>
          </div>

        </doc:source>
      </doc:example>
      */ function timeout(fn, delay, invokeApply) {
                    var timeoutId, deferred = $q.defer(), promise = deferred.promise, skipApply = isDefined(invokeApply) && !invokeApply;
                    return timeoutId = $browser.defer(function() {
                        try {
                            deferred.resolve(fn());
                        } catch (e) {
                            deferred.reject(e), $exceptionHandler(e);
                        } finally{
                            delete deferreds[promise.$$timeoutId];
                        }
                        skipApply || $rootScope.$apply();
                    }, delay), promise.$$timeoutId = timeoutId, deferreds[timeoutId] = deferred, promise;
                }
                return(/**
         * @ngdoc function
         * @name ng.$timeout#cancel
         * @methodOf ng.$timeout
         *
         * @description
         * Cancels a task associated with the `promise`. As a result of this, the promise will be
         * resolved with a rejection.
         *
         * @param {Promise=} promise Promise returned by the `$timeout` function.
         * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully
         *   canceled.
         */ timeout.cancel = function(promise) {
                    return !!promise && promise.$$timeoutId in deferreds && (deferreds[promise.$$timeoutId].reject("canceled"), delete deferreds[promise.$$timeoutId], $browser.defer.cancel(promise.$$timeoutId));
                }, timeout);
            }
        ];
    }
    // NOTE:  The usage of window and document instead of $window and $document here is
    // deliberate.  This service depends on the specific behavior of anchor nodes created by the
    // browser (resolving and parsing URLs) that is unlikely to be provided by mock objects and
    // cause us to break tests.  In addition, when the browser resolves a URL for XHR, it
    // doesn't know about mocked locations and resolves URLs to the real document - which is
    // exactly the behavior needed here.  There is little value is mocking these out for this
    // service.
    var urlParsingNode = document1.createElement("a"), originUrl = urlResolve(window1.location.href, !0);
    /**
   *
   * Implementation Notes for non-IE browsers
   * ----------------------------------------
   * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
   * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
   * URL will be resolved into an absolute URL in the context of the application document.
   * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
   * properties are all populated to reflect the normalized URL.  This approach has wide
   * compatibility - Safari 1+, Mozilla 1+, Opera 7+,e etc.  See
   * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
   *
   * Implementation Notes for IE
   * ---------------------------
   * IE >= 8 and <= 10 normalizes the URL when assigned to the anchor node similar to the other
   * browsers.  However, the parsed components will not be set if the URL assigned did not specify
   * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
   * work around that by performing the parsing in a 2nd step by taking a previously normalized
   * URL (e.g. by assigning to a.href) and assigning it a.href again.  This correctly populates the
   * properties such as protocol, hostname, port, etc.
   *
   * IE7 does not normalize the URL when assigned to an anchor node.  (Apparently, it does, if one
   * uses the inner HTML approach to assign the URL as part of an HTML snippet -
   * http://stackoverflow.com/a/472729)  However, setting img[src] does normalize the URL.
   * Unfortunately, setting img[src] to something like "javascript:foo" on IE throws an exception.
   * Since the primary usage for normalizing URLs is to sanitize such URLs, we can't use that
   * method and IE < 8 is unsupported.
   *
   * References:
   *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
   *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
   *   http://url.spec.whatwg.org/#urlutils
   *   https://github.com/angular/angular.js/pull/2902
   *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
   *
   * @function
   * @param {string} url The URL to be parsed.
   * @description Normalizes and parses a URL.
   * @returns {object} Returns the normalized URL as a dictionary.
   *
   *   | member name   | Description    |
   *   |---------------|----------------|
   *   | href          | A normalized version of the provided URL if it was not an absolute URL |
   *   | protocol      | The protocol including the trailing colon                              |
   *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
   *   | search        | The search params, minus the question mark                             |
   *   | hash          | The hash string, minus the hash symbol
   *   | hostname      | The hostname
   *   | port          | The port, without ":"
   *   | pathname      | The pathname, beginning with "/"
   *
   */ function urlResolve(url, base) {
        var href = url;
        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return msie && (// Normalize before parse.  Refer Implementation Notes on why this is
        // done in two steps on IE.
        urlParsingNode.setAttribute("href", href), href = urlParsingNode.href), urlParsingNode.setAttribute("href", href), {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: "/" === urlParsingNode.pathname.charAt(0) ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
    }
    /**
   * Parse a request URL and determine whether this is a same-origin request as the application document.
   *
   * @param {string|object} requestUrl The url of the request as a string that will be resolved
   * or a parsed URL object.
   * @returns {boolean} Whether the request is for the same origin as the application document.
   */ function urlIsSameOrigin(requestUrl) {
        var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
        return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host;
    }
    /**
 * @ngdoc object
 * @name ng.$window
 *
 * @description
 * A reference to the browser's `window` object. While `window`
 * is globally available in JavaScript, it causes testability problems, because
 * it is a global variable. In angular we always refer to it through the
 * `$window` service, so it may be overridden, removed or mocked for testing.
 *
 * Expressions, like the one defined for the `ngClick` directive in the example
 * below, are evaluated with respect to the current scope.  Therefore, there is
 * no risk of inadvertently coding in a dependency on a global value in such an
 * expression.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope, $window) {
           $scope.greeting = 'Hello, World!';
           $scope.doGreeting = function(greeting) {
               $window.alert(greeting);
           };
         }
       </script>
       <div ng-controller="Ctrl">
         <input type="text" ng-model="greeting" />
         <button ng-click="doGreeting(greeting)">ALERT</button>
       </div>
     </doc:source>
     <doc:scenario>
      it('should display the greeting in the input box', function() {
       input('greeting').enter('Hello, E2E Tests');
       // If we click the button it will block the test runner
       // element(':button').click();
      });
     </doc:scenario>
   </doc:example>
 */ function $WindowProvider() {
        this.$get = valueFn(window1);
    }
    function $FilterProvider($provide) {
        var suffix = "Filter";
        /**
     * @ngdoc function
     * @name ng.$controllerProvider#register
     * @methodOf ng.$controllerProvider
     * @param {string|Object} name Name of the filter function, or an object map of filters where
     *    the keys are the filter names and the values are the filter factories.
     * @returns {Object} Registered filter instance, or if a map of filters was provided then a map
     *    of the registered filter instances.
     */ function register(name, factory) {
            if (!isObject(name)) return $provide.factory(name + suffix, factory);
            var filters = {};
            return forEach(name, function(filter, key) {
                filters[key] = register(key, filter);
            }), filters;
        }
        this.register = register, this.$get = [
            "$injector",
            function($injector) {
                return function(name) {
                    return $injector.get(name + suffix);
                };
            }
        ], ////////////////////////////////////////
        /* global
    currencyFilter: false,
    dateFilter: false,
    filterFilter: false,
    jsonFilter: false,
    limitToFilter: false,
    lowercaseFilter: false,
    numberFilter: false,
    orderByFilter: false,
    uppercaseFilter: false,
  */ register("currency", currencyFilter), register("date", dateFilter), register("filter", filterFilter), register("json", jsonFilter), register("limitTo", limitToFilter), register("lowercase", lowercaseFilter), register("number", numberFilter), register("orderBy", orderByFilter), register("uppercase", uppercaseFilter);
    }
    /**
 * @ngdoc filter
 * @name ng.filter:filter
 * @function
 *
 * @description
 * Selects a subset of items from `array` and returns it as a new array.
 *
 * @param {Array} array The source array.
 * @param {string|Object|function()} expression The predicate to be used for selecting items from
 *   `array`.
 *
 *   Can be one of:
 *
 *   - `string`: Predicate that results in a substring match using the value of `expression`
 *     string. All strings or objects with string properties in `array` that contain this string
 *     will be returned. The predicate can be negated by prefixing the string with `!`.
 *
 *   - `Object`: A pattern object can be used to filter specific properties on objects contained
 *     by `array`. For example `{name:"M", phone:"1"}` predicate will return an array of items
 *     which have property `name` containing "M" and property `phone` containing "1". A special
 *     property name `$` can be used (as in `{$:"text"}`) to accept a match against any
 *     property of the object. That's equivalent to the simple substring match with a `string`
 *     as described above.
 *
 *   - `function`: A predicate function can be used to write arbitrary filters. The function is
 *     called for each element of `array`. The final result is an array of those elements that
 *     the predicate returned true for.
 *
 * @param {function(expected, actual)|true|undefined} comparator Comparator which is used in
 *     determining if the expected value (from the filter expression) and actual value (from
 *     the object in the array) should be considered a match.
 *
 *   Can be one of:
 *
 *     - `function(expected, actual)`:
 *       The function will be given the object value and the predicate value to compare and
 *       should return true if the item should be included in filtered result.
 *
 *     - `true`: A shorthand for `function(expected, actual) { return angular.equals(expected, actual)}`.
 *       this is essentially strict comparison of expected and actual.
 *
 *     - `false|undefined`: A short hand for a function which will look for a substring match in case
 *       insensitive way.
 *
 * @example
   <doc:example>
     <doc:source>
       <div ng-init="friends = [{name:'John', phone:'555-1276'},
                                {name:'Mary', phone:'800-BIG-MARY'},
                                {name:'Mike', phone:'555-4321'},
                                {name:'Adam', phone:'555-5678'},
                                {name:'Julie', phone:'555-8765'},
                                {name:'Juliette', phone:'555-5678'}]"></div>

       Search: <input ng-model="searchText">
       <table id="searchTextResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friend in friends | filter:searchText">
           <td>{{friend.name}}</td>
           <td>{{friend.phone}}</td>
         </tr>
       </table>
       <hr>
       Any: <input ng-model="search.$"> <br>
       Name only <input ng-model="search.name"><br>
       Phone only <input ng-model="search.phone"><br>
       Equality <input type="checkbox" ng-model="strict"><br>
       <table id="searchObjResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friend in friends | filter:search:strict">
           <td>{{friend.name}}</td>
           <td>{{friend.phone}}</td>
         </tr>
       </table>
     </doc:source>
     <doc:scenario>
       it('should search across all fields when filtering with a string', function() {
         input('searchText').enter('m');
         expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
           toEqual(['Mary', 'Mike', 'Adam']);

         input('searchText').enter('76');
         expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
           toEqual(['John', 'Julie']);
       });

       it('should search in specific fields when filtering with a predicate object', function() {
         input('search.$').enter('i');
         expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
           toEqual(['Mary', 'Mike', 'Julie', 'Juliette']);
       });
       it('should use a equal comparison when comparator is true', function() {
         input('search.name').enter('Julie');
         input('strict').check();
         expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
           toEqual(['Julie']);
       });
     </doc:scenario>
   </doc:example>
 */ function filterFilter() {
        return function(array, expression, comparator) {
            if (!isArray(array)) return array;
            var comparatorType = typeof comparator, predicates = [];
            predicates.check = function(value) {
                for(var j = 0; j < predicates.length; j++)if (!predicates[j](value)) return !1;
                return !0;
            }, "function" !== comparatorType && (comparator = "boolean" === comparatorType && comparator ? function(obj, text) {
                return angular1.equals(obj, text);
            } : function(obj, text) {
                return text = ("" + text).toLowerCase(), ("" + obj).toLowerCase().indexOf(text) > -1;
            });
            var search = function(obj, text) {
                if ("string" == typeof text && "!" === text.charAt(0)) return !search(obj, text.substr(1));
                switch(typeof obj){
                    case "boolean":
                    case "number":
                    case "string":
                        return comparator(obj, text);
                    case "object":
                        if ("object" == typeof text) return comparator(obj, text);
                        for(var objKey in obj)if ("$" !== objKey.charAt(0) && search(obj[objKey], text)) return !0;
                        return !1;
                    case "array":
                        for(var i = 0; i < obj.length; i++)if (search(obj[i], text)) return !0;
                        return !1;
                    default:
                        return !1;
                }
            };
            switch(typeof expression){
                case "boolean":
                case "number":
                case "string":
                    // Set up expression object and fall through
                    expression = {
                        $: expression
                    };
                // jshint -W086
                case "object":
                    // jshint +W086
                    for(var key in expression)"$" == key ? expression[key] && predicates.push(function(value) {
                        return search(value, expression[key]);
                    }) : void 0 !== expression[key] && predicates.push(function(value) {
                        return search(getter(value, key), expression[key]);
                    });
                    break;
                case "function":
                    predicates.push(expression);
                    break;
                default:
                    return array;
            }
            for(var filtered = [], j = 0; j < array.length; j++){
                var value = array[j];
                predicates.check(value) && filtered.push(value);
            }
            return filtered;
        };
    }
    function currencyFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function(amount, currencySymbol) {
            return isUndefined(currencySymbol) && (currencySymbol = formats.CURRENCY_SYM), formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).replace(/\u00A4/g, currencySymbol);
        };
    }
    function numberFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function(number, fractionSize) {
            return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
        };
    }
    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
        if (isNaN(number) || !isFinite(number)) return "";
        var isNegative = number < 0, numStr = (number = Math.abs(number)) + "", formatedText = "", parts = [], hasExponent = !1;
        if (-1 !== numStr.indexOf("e")) {
            var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
            match && "-" == match[2] && match[3] > fractionSize + 1 ? numStr = "0" : (formatedText = numStr, hasExponent = !0);
        }
        if (hasExponent) fractionSize > 0 && number > -1 && number < 1 && (formatedText = number.toFixed(fractionSize));
        else {
            var fractionLen = (numStr.split(".")[1] || "").length;
            // determine fractionSize if it is not specified
            isUndefined(fractionSize) && (fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac));
            var pow = Math.pow(10, fractionSize), fraction = ("" + (number = Math.round(number * pow) / pow)).split("."), whole = fraction[0];
            fraction = fraction[1] || "";
            var i, pos = 0, lgroup = pattern.lgSize, group = pattern.gSize;
            if (whole.length >= lgroup + group) for(i = 0, pos = whole.length - lgroup; i < pos; i++)(pos - i) % group == 0 && 0 !== i && (formatedText += groupSep), formatedText += whole.charAt(i);
            for(i = pos; i < whole.length; i++)(whole.length - i) % lgroup == 0 && 0 !== i && (formatedText += groupSep), formatedText += whole.charAt(i);
            // format fraction part.
            for(; fraction.length < fractionSize;)fraction += "0";
            fractionSize && "0" !== fractionSize && (formatedText += decimalSep + fraction.substr(0, fractionSize));
        }
        return parts.push(isNegative ? pattern.negPre : pattern.posPre), parts.push(formatedText), parts.push(isNegative ? pattern.negSuf : pattern.posSuf), parts.join("");
    }
    function padNumber(num, digits, trim) {
        var neg = "";
        for(num < 0 && (neg = "-", num = -num), num = "" + num; num.length < digits;)num = "0" + num;
        return trim && (num = num.substr(num.length - digits)), neg + num;
    }
    function dateGetter(name, size, offset, trim) {
        return offset = offset || 0, function(date) {
            var value = date["get" + name]();
            return (offset > 0 || value > -offset) && (value += offset), 0 === value && -12 == offset && (value = 12), padNumber(value, size, trim);
        };
    }
    function dateStrGetter(name, shortForm) {
        return function(date, formats) {
            var value = date["get" + name]();
            return formats[uppercase(shortForm ? "SHORT" + name : name)][value];
        };
    }
    /**
   * @ngdoc object
   * @name ng.$filterProvider
   * @description
   *
   * Filters are just functions which transform input to an output. However filters need to be
   * Dependency Injected. To achieve this a filter definition consists of a factory function which is
   * annotated with dependencies and is responsible for creating a filter function.
   *
   * <pre>
   *   // Filter registration
   *   function MyModule($provide, $filterProvider) {
   *     // create a service to demonstrate injection (not always needed)
   *     $provide.value('greet', function(name){
   *       return 'Hello ' + name + '!';
   *     });
   *
   *     // register a filter factory which uses the
   *     // greet service to demonstrate DI.
   *     $filterProvider.register('greet', function(greet){
   *       // return the filter function which uses the greet service
   *       // to generate salutation
   *       return function(text) {
   *         // filters need to be forgiving so check input validity
   *         return text && greet(text) || text;
   *       };
   *     });
   *   }
   * </pre>
   *
   * The filter function is registered with the `$injector` under the filter name suffix with
   * `Filter`.
   *
   * <pre>
   *   it('should be the same instance', inject(
   *     function($filterProvider) {
   *       $filterProvider.register('reverse', function(){
   *         return ...;
   *       });
   *     },
   *     function($filter, reverseFilter) {
   *       expect($filter('reverse')).toBe(reverseFilter);
   *     });
   * </pre>
   *
   *
   * For more information about how angular filters work, and how to create your own filters, see
   * {@link guide/filter Filters} in the Angular Developer Guide.
   */ /**
   * @ngdoc method
   * @name ng.$filterProvider#register
   * @methodOf ng.$filterProvider
   * @description
   * Register filter factory function.
   *
   * @param {String} name Name of the filter.
   * @param {function} fn The filter factory function which is injectable.
   */ /**
   * @ngdoc function
   * @name ng.$filter
   * @function
   * @description
   * Filters are used for formatting data displayed to the user.
   *
   * The general syntax in templates is as follows:
   *
   *         {{ expression [| filter_name[:parameter_value] ... ] }}
   *
   * @param {String} name Name of the filter function to retrieve
   * @return {Function} the filter function
   */ $FilterProvider.$inject = [
        "$provide"
    ], /**
 * @ngdoc filter
 * @name ng.filter:currency
 * @function
 *
 * @description
 * Formats a number as a currency (ie $1,234.56). When no currency symbol is provided, default
 * symbol for current locale is used.
 *
 * @param {number} amount Input to filter.
 * @param {string=} symbol Currency symbol or identifier to be displayed.
 * @returns {string} Formatted number.
 *
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.amount = 1234.56;
         }
       </script>
       <div ng-controller="Ctrl">
         <input type="number" ng-model="amount"> <br>
         default currency symbol ($): {{amount | currency}}<br>
         custom currency identifier (USD$): {{amount | currency:"USD$"}}
       </div>
     </doc:source>
     <doc:scenario>
       it('should init with 1234.56', function() {
         expect(binding('amount | currency')).toBe('$1,234.56');
         expect(binding('amount | currency:"USD$"')).toBe('USD$1,234.56');
       });
       it('should update', function() {
         input('amount').enter('-1234');
         expect(binding('amount | currency')).toBe('($1,234.00)');
         expect(binding('amount | currency:"USD$"')).toBe('(USD$1,234.00)');
       });
     </doc:scenario>
   </doc:example>
 */ currencyFilter.$inject = [
        "$locale"
    ], /**
 * @ngdoc filter
 * @name ng.filter:number
 * @function
 *
 * @description
 * Formats a number as text.
 *
 * If the input is not a number an empty string is returned.
 *
 * @param {number|string} number Number to format.
 * @param {(number|string)=} fractionSize Number of decimal places to round the number to.
 * If this is not provided then the fraction size is computed from the current locale's number
 * formatting pattern. In the case of the default locale, it will be 3.
 * @returns {string} Number rounded to decimalPlaces and places a “,” after each third digit.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.val = 1234.56789;
         }
       </script>
       <div ng-controller="Ctrl">
         Enter number: <input ng-model='val'><br>
         Default formatting: {{val | number}}<br>
         No fractions: {{val | number:0}}<br>
         Negative number: {{-val | number:4}}
       </div>
     </doc:source>
     <doc:scenario>
       it('should format numbers', function() {
         expect(binding('val | number')).toBe('1,234.568');
         expect(binding('val | number:0')).toBe('1,235');
         expect(binding('-val | number:4')).toBe('-1,234.5679');
       });

       it('should update', function() {
         input('val').enter('3374.333');
         expect(binding('val | number')).toBe('3,374.333');
         expect(binding('val | number:0')).toBe('3,374');
         expect(binding('-val | number:4')).toBe('-3,374.3330');
       });
     </doc:scenario>
   </doc:example>
 */ numberFilter.$inject = [
        "$locale"
    ];
    var DATE_FORMATS = {
        yyyy: dateGetter("FullYear", 4),
        yy: dateGetter("FullYear", 2, 0, !0),
        y: dateGetter("FullYear", 1),
        MMMM: dateStrGetter("Month"),
        MMM: dateStrGetter("Month", !0),
        MM: dateGetter("Month", 2, 1),
        M: dateGetter("Month", 1, 1),
        dd: dateGetter("Date", 2),
        d: dateGetter("Date", 1),
        HH: dateGetter("Hours", 2),
        H: dateGetter("Hours", 1),
        hh: dateGetter("Hours", 2, -12),
        h: dateGetter("Hours", 1, -12),
        mm: dateGetter("Minutes", 2),
        m: dateGetter("Minutes", 1),
        ss: dateGetter("Seconds", 2),
        s: dateGetter("Seconds", 1),
        // while ISO 8601 requires fractions to be prefixed with `.` or `,`
        // we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
        sss: dateGetter("Milliseconds", 3),
        EEEE: dateStrGetter("Day"),
        EEE: dateStrGetter("Day", !0),
        a: function(date, formats) {
            return 12 > date.getHours() ? formats.AMPMS[0] : formats.AMPMS[1];
        },
        Z: function(date) {
            var zone = -1 * date.getTimezoneOffset(), paddedZone = zone >= 0 ? "+" : "";
            return paddedZone + (padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2));
        }
    }, DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/, NUMBER_STRING = /^\-?\d+$/;
    function dateFilter($locale) {
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function(date, format) {
            var fn, match, text = "", parts = [];
            if (format = format || "mediumDate", format = $locale.DATETIME_FORMATS[format] || format, isString(date) && (date = NUMBER_STRING.test(date) ? int(date) : // 1        2       3         4          5          6          7          8  9     10      11
            function(string) {
                var match;
                if (match = string.match(R_ISO8601_STR)) {
                    var date = new Date(0), tzHour = 0, tzMin = 0, dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear, timeSetter = match[8] ? date.setUTCHours : date.setHours;
                    match[9] && (tzHour = int(match[9] + match[10]), tzMin = int(match[9] + match[11])), dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
                    var h = int(match[4] || 0) - tzHour, m = int(match[5] || 0) - tzMin, s = int(match[6] || 0), ms = Math.round(1000 * parseFloat("0." + (match[7] || 0)));
                    return timeSetter.call(date, h, m, s, ms), date;
                }
                return string;
            }(date)), isNumber(date) && (date = new Date(date)), !isDate(date)) return date;
            for(; format;)(match = DATE_FORMATS_SPLIT.exec(format)) ? format = (parts = concat(parts, match, 1)).pop() : (parts.push(format), format = null);
            return forEach(parts, function(value) {
                fn = DATE_FORMATS[value], text += fn ? fn(date, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'");
            }), text;
        };
    }
    /**
 * @ngdoc filter
 * @name ng.filter:json
 * @function
 *
 * @description
 *   Allows you to convert a JavaScript object into JSON string.
 *
 *   This filter is mostly useful for debugging. When using the double curly {{value}} notation
 *   the binding is automatically converted to JSON.
 *
 * @param {*} object Any JavaScript object (including arrays and primitive types) to filter.
 * @returns {string} JSON string.
 *
 *
 * @example:
   <doc:example>
     <doc:source>
       <pre>{{ {'name':'value'} | json }}</pre>
     </doc:source>
     <doc:scenario>
       it('should jsonify filtered objects', function() {
         expect(binding("{'name':'value'}")).toMatch(/\{\n  "name": ?"value"\n}/);
       });
     </doc:scenario>
   </doc:example>
 *
 */ function jsonFilter() {
        return function(object) {
            return toJson(object, !0);
        };
    }
    /**
 * @ngdoc filter
 * @name ng.filter:date
 * @function
 *
 * @description
 *   Formats `date` to a string based on the requested `format`.
 *
 *   `format` string can be composed of the following elements:
 *
 *   * `'yyyy'`: 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
 *   * `'yy'`: 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
 *   * `'y'`: 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
 *   * `'MMMM'`: Month in year (January-December)
 *   * `'MMM'`: Month in year (Jan-Dec)
 *   * `'MM'`: Month in year, padded (01-12)
 *   * `'M'`: Month in year (1-12)
 *   * `'dd'`: Day in month, padded (01-31)
 *   * `'d'`: Day in month (1-31)
 *   * `'EEEE'`: Day in Week,(Sunday-Saturday)
 *   * `'EEE'`: Day in Week, (Sun-Sat)
 *   * `'HH'`: Hour in day, padded (00-23)
 *   * `'H'`: Hour in day (0-23)
 *   * `'hh'`: Hour in am/pm, padded (01-12)
 *   * `'h'`: Hour in am/pm, (1-12)
 *   * `'mm'`: Minute in hour, padded (00-59)
 *   * `'m'`: Minute in hour (0-59)
 *   * `'ss'`: Second in minute, padded (00-59)
 *   * `'s'`: Second in minute (0-59)
 *   * `'.sss' or ',sss'`: Millisecond in second, padded (000-999)
 *   * `'a'`: am/pm marker
 *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200-+1200)
 *
 *   `format` string can also be one of the following predefined
 *   {@link guide/i18n localizable formats}:
 *
 *   * `'medium'`: equivalent to `'MMM d, y h:mm:ss a'` for en_US locale
 *     (e.g. Sep 3, 2010 12:05:08 pm)
 *   * `'short'`: equivalent to `'M/d/yy h:mm a'` for en_US  locale (e.g. 9/3/10 12:05 pm)
 *   * `'fullDate'`: equivalent to `'EEEE, MMMM d,y'` for en_US  locale
 *     (e.g. Friday, September 3, 2010)
 *   * `'longDate'`: equivalent to `'MMMM d, y'` for en_US  locale (e.g. September 3, 2010)
 *   * `'mediumDate'`: equivalent to `'MMM d, y'` for en_US  locale (e.g. Sep 3, 2010)
 *   * `'shortDate'`: equivalent to `'M/d/yy'` for en_US locale (e.g. 9/3/10)
 *   * `'mediumTime'`: equivalent to `'h:mm:ss a'` for en_US locale (e.g. 12:05:08 pm)
 *   * `'shortTime'`: equivalent to `'h:mm a'` for en_US locale (e.g. 12:05 pm)
 *
 *   `format` string can contain literal values. These need to be quoted with single quotes (e.g.
 *   `"h 'in the morning'"`). In order to output single quote, use two single quotes in a sequence
 *   (e.g. `"h 'o''clock'"`).
 *
 * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or
 *    number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.SSSZ and its
 *    shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is
 *    specified in the string input, the time is considered to be in the local timezone.
 * @param {string=} format Formatting rules (see Description). If not specified,
 *    `mediumDate` is used.
 * @returns {string} Formatted string or the input if input is not recognized as date/millis.
 *
 * @example
   <doc:example>
     <doc:source>
       <span ng-non-bindable>{{1288323623006 | date:'medium'}}</span>:
           {{1288323623006 | date:'medium'}}<br>
       <span ng-non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:
          {{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}<br>
       <span ng-non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:
          {{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}<br>
     </doc:source>
     <doc:scenario>
       it('should format date', function() {
         expect(binding("1288323623006 | date:'medium'")).
            toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
         expect(binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).
            toMatch(/2010\-10\-2\d \d{2}:\d{2}:\d{2} (\-|\+)?\d{4}/);
         expect(binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).
            toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
       });
     </doc:scenario>
   </doc:example>
 */ dateFilter.$inject = [
        "$locale"
    ];
    /**
   * @ngdoc filter
   * @name ng.filter:lowercase
   * @function
   * @description
   * Converts string to lowercase.
   * @see angular.lowercase
   */ var lowercaseFilter = valueFn(lowercase), uppercaseFilter = valueFn(uppercase);
    /**
 * @ngdoc function
 * @name ng.filter:limitTo
 * @function
 *
 * @description
 * Creates a new array or string containing only a specified number of elements. The elements
 * are taken from either the beginning or the end of the source array or string, as specified by
 * the value and sign (positive or negative) of `limit`.
 *
 * @param {Array|string} input Source array or string to be limited.
 * @param {string|number} limit The length of the returned array or string. If the `limit` number 
 *     is positive, `limit` number of items from the beginning of the source array/string are copied.
 *     If the number is negative, `limit` number  of items from the end of the source array/string 
 *     are copied. The `limit` will be trimmed if it exceeds `array.length`
 * @returns {Array|string} A new sub-array or substring of length `limit` or less if input array
 *     had less than `limit` elements.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.numbers = [1,2,3,4,5,6,7,8,9];
           $scope.letters = "abcdefghi";
           $scope.numLimit = 3;
           $scope.letterLimit = 3;
         }
       </script>
       <div ng-controller="Ctrl">
         Limit {{numbers}} to: <input type="integer" ng-model="numLimit">
         <p>Output numbers: {{ numbers | limitTo:numLimit }}</p>
         Limit {{letters}} to: <input type="integer" ng-model="letterLimit">
         <p>Output letters: {{ letters | limitTo:letterLimit }}</p>
       </div>
     </doc:source>
     <doc:scenario>
       it('should limit the number array to first three items', function() {
         expect(element('.doc-example-live input[ng-model=numLimit]').val()).toBe('3');
         expect(element('.doc-example-live input[ng-model=letterLimit]').val()).toBe('3');
         expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3]');
         expect(binding('letters | limitTo:letterLimit')).toEqual('abc');
       });

       it('should update the output when -3 is entered', function() {
         input('numLimit').enter(-3);
         input('letterLimit').enter(-3);
         expect(binding('numbers | limitTo:numLimit')).toEqual('[7,8,9]');
         expect(binding('letters | limitTo:letterLimit')).toEqual('ghi');
       });

       it('should not exceed the maximum size of input array', function() {
         input('numLimit').enter(100);
         input('letterLimit').enter(100);
         expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3,4,5,6,7,8,9]');
         expect(binding('letters | limitTo:letterLimit')).toEqual('abcdefghi');
       });
     </doc:scenario>
   </doc:example>
 */ function limitToFilter() {
        return function(input, limit) {
            if (!isArray(input) && !isString(input)) return input;
            if (limit = int(limit), isString(input)) return(//NaN check on limit
            limit ? limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length) : "");
            var i, n, out = [];
            for(limit > input.length ? limit = input.length : limit < -input.length && (limit = -input.length), limit > 0 ? (i = 0, n = limit) : (i = input.length + limit, n = input.length); i < n; i++)out.push(input[i]);
            return out;
        };
    }
    function orderByFilter($parse) {
        return function(array, sortPredicate, reverseOrder) {
            if (!isArray(array) || !sortPredicate) return array;
            obj = sortPredicate = isArray(sortPredicate) ? sortPredicate : [
                sortPredicate
            ], iterator = function(predicate) {
                var descending = !1, get = predicate || identity;
                return isString(predicate) && (("+" == predicate.charAt(0) || "-" == predicate.charAt(0)) && (descending = "-" == predicate.charAt(0), predicate = predicate.substring(1)), get = $parse(predicate)), reverseComparator(function(a, b) {
                    var v1, v2, t1, t2;
                    return v1 = get(a), v2 = get(b), (t1 = typeof v1) != (t2 = typeof v2) ? t1 < t2 ? -1 : 1 : ("string" == t1 && (v1 = v1.toLowerCase(), v2 = v2.toLowerCase()), v1 === v2) ? 0 : v1 < v2 ? -1 : 1;
                }, descending);
            }, results = [], forEach(obj, function(value, index, list) {
                results.push(iterator.call(void 0, value, index, list));
            }), sortPredicate = results;
            for(var obj, iterator, results, arrayCopy = [], i = 0; i < array.length; i++)arrayCopy.push(array[i]);
            return arrayCopy.sort(reverseComparator(function(o1, o2) {
                for(var i = 0; i < sortPredicate.length; i++){
                    var comp = sortPredicate[i](o1, o2);
                    if (0 !== comp) return comp;
                }
                return 0;
            }, reverseOrder));
            function reverseComparator(comp, descending) {
                return toBoolean(descending) ? function(a, b) {
                    return comp(b, a);
                } : comp;
            }
        };
    }
    function ngDirective(directive) {
        return isFunction(directive) && (directive = {
            link: directive
        }), directive.restrict = directive.restrict || "AC", valueFn(directive);
    }
    /**
 * @ngdoc function
 * @name ng.filter:orderBy
 * @function
 *
 * @description
 * Orders a specified `array` by the `expression` predicate.
 *
 * @param {Array} array The array to sort.
 * @param {function(*)|string|Array.<(function(*)|string)>} expression A predicate to be
 *    used by the comparator to determine the order of elements.
 *
 *    Can be one of:
 *
 *    - `function`: Getter function. The result of this function will be sorted using the
 *      `<`, `=`, `>` operator.
 *    - `string`: An Angular expression which evaluates to an object to order by, such as 'name'
 *      to sort by a property called 'name'. Optionally prefixed with `+` or `-` to control
 *      ascending or descending sort order (for example, +name or -name).
 *    - `Array`: An array of function or string predicates. The first predicate in the array
 *      is used for sorting, but when two items are equivalent, the next predicate is used.
 *
 * @param {boolean=} reverse Reverse the order the array.
 * @returns {Array} Sorted copy of the source array.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.friends =
               [{name:'John', phone:'555-1212', age:10},
                {name:'Mary', phone:'555-9876', age:19},
                {name:'Mike', phone:'555-4321', age:21},
                {name:'Adam', phone:'555-5678', age:35},
                {name:'Julie', phone:'555-8765', age:29}]
           $scope.predicate = '-age';
         }
       </script>
       <div ng-controller="Ctrl">
         <pre>Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>
         <hr/>
         [ <a href="" ng-click="predicate=''">unsorted</a> ]
         <table class="friend">
           <tr>
             <th><a href="" ng-click="predicate = 'name'; reverse=false">Name</a>
                 (<a href="" ng-click="predicate = '-name'; reverse=false">^</a>)</th>
             <th><a href="" ng-click="predicate = 'phone'; reverse=!reverse">Phone Number</a></th>
             <th><a href="" ng-click="predicate = 'age'; reverse=!reverse">Age</a></th>
           </tr>
           <tr ng-repeat="friend in friends | orderBy:predicate:reverse">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
             <td>{{friend.age}}</td>
           </tr>
         </table>
       </div>
     </doc:source>
     <doc:scenario>
       it('should be reverse ordered by aged', function() {
         expect(binding('predicate')).toBe('-age');
         expect(repeater('table.friend', 'friend in friends').column('friend.age')).
           toEqual(['35', '29', '21', '19', '10']);
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).
           toEqual(['Adam', 'Julie', 'Mike', 'Mary', 'John']);
       });

       it('should reorder the table when user selects different predicate', function() {
         element('.doc-example-live a:contains("Name")').click();
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).
           toEqual(['Adam', 'John', 'Julie', 'Mary', 'Mike']);
         expect(repeater('table.friend', 'friend in friends').column('friend.age')).
           toEqual(['35', '10', '29', '19', '21']);

         element('.doc-example-live a:contains("Phone")').click();
         expect(repeater('table.friend', 'friend in friends').column('friend.phone')).
           toEqual(['555-9876', '555-8765', '555-5678', '555-4321', '555-1212']);
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).
           toEqual(['Mary', 'Julie', 'Adam', 'Mike', 'John']);
       });
     </doc:scenario>
   </doc:example>
 */ orderByFilter.$inject = [
        "$parse"
    ];
    /**
   * @ngdoc directive
   * @name ng.directive:a
   * @restrict E
   *
   * @description
   * Modifies the default behavior of the html A tag so that the default action is prevented when
   * the href attribute is empty.
   *
   * This change permits the easy creation of action links with the `ngClick` directive
   * without changing the location or causing page reloads, e.g.:
   * `<a href="" ng-click="list.addItem()">Add Item</a>`
   */ var htmlAnchorDirective = valueFn({
        restrict: "E",
        compile: function(element, attr) {
            if (msie <= 8 && (attr.href || attr.name || attr.$set("href", ""), // add a comment node to anchors to workaround IE bug that causes element content to be reset
            // to new attribute content if attribute is updated with value containing @ and element also
            // contains value with @
            // see issue #1949
            element.append(document1.createComment("IE fix"))), !attr.href && !attr.name) return function(scope, element) {
                element.on("click", function(event) {
                    // if we have no href url, then don't navigate anywhere.
                    element.attr("href") || event.preventDefault();
                });
            };
        }
    }), ngAttributeAliasDirectives = {};
    // boolean attrs are evaluated
    forEach(BOOLEAN_ATTR, function(propName, attrName) {
        // binding to multiple is not supported
        if ("multiple" != propName) {
            var normalized = directiveNormalize("ng-" + attrName);
            ngAttributeAliasDirectives[normalized] = function() {
                return {
                    priority: 100,
                    compile: function() {
                        return function(scope, element, attr) {
                            scope.$watch(attr[normalized], function(value) {
                                attr.$set(attrName, !!value);
                            });
                        };
                    }
                };
            };
        }
    }), // ng-src, ng-srcset, ng-href are interpolated
    forEach([
        "src",
        "srcset",
        "href"
    ], function(attrName) {
        var normalized = directiveNormalize("ng-" + attrName);
        ngAttributeAliasDirectives[normalized] = function() {
            return {
                priority: 99,
                link: function(scope, element, attr) {
                    attr.$observe(normalized, function(value) {
                        value && (attr.$set(attrName, value), msie && element.prop(attrName, attr[attrName]));
                    });
                }
            };
        };
    });
    /* global -nullFormCtrl */ var nullFormCtrl = {
        $addControl: noop,
        $removeControl: noop,
        $setValidity: noop,
        $setDirty: noop,
        $setPristine: noop
    };
    function FormController(element, attrs) {
        var form = this, parentForm = element.parent().controller("form") || nullFormCtrl, invalidCount = 0, errors = form.$error = {}, controls = [];
        // convenience method for easy toggling of classes
        function toggleValidCss(isValid, validationErrorKey) {
            validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "", element.removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
        }
        // init state
        form.$name = attrs.name || attrs.ngForm, form.$dirty = !1, form.$pristine = !0, form.$valid = !0, form.$invalid = !1, parentForm.$addControl(form), // Setup initial state of the control
        element.addClass(PRISTINE_CLASS), toggleValidCss(!0), /**
     * @ngdoc function
     * @name ng.directive:form.FormController#$addControl
     * @methodOf ng.directive:form.FormController
     *
     * @description
     * Register a control with the form.
     *
     * Input elements using ngModelController do this automatically when they are linked.
     */ form.$addControl = function(control) {
            // Breaking change - before, inputs whose name was "hasOwnProperty" were quietly ignored
            // and not added to the scope.  Now we throw an error.
            assertNotHasOwnProperty(control.$name, "input"), controls.push(control), control.$name && (form[control.$name] = control);
        }, /**
     * @ngdoc function
     * @name ng.directive:form.FormController#$removeControl
     * @methodOf ng.directive:form.FormController
     *
     * @description
     * Deregister a control from the form.
     *
     * Input elements using ngModelController do this automatically when they are destroyed.
     */ form.$removeControl = function(control) {
            control.$name && form[control.$name] === control && delete form[control.$name], forEach(errors, function(queue, validationToken) {
                form.$setValidity(validationToken, !0, control);
            }), arrayRemove(controls, control);
        }, /**
     * @ngdoc function
     * @name ng.directive:form.FormController#$setValidity
     * @methodOf ng.directive:form.FormController
     *
     * @description
     * Sets the validity of a form control.
     *
     * This method will also propagate to parent forms.
     */ form.$setValidity = function(validationToken, isValid, control) {
            var queue = errors[validationToken];
            if (isValid) queue && (arrayRemove(queue, control), queue.length || (--invalidCount || (toggleValidCss(isValid), form.$valid = !0, form.$invalid = !1), errors[validationToken] = !1, toggleValidCss(!0, validationToken), parentForm.$setValidity(validationToken, !0, form)));
            else {
                if (invalidCount || toggleValidCss(isValid), queue) {
                    if (-1 != indexOf(queue, control)) return;
                } else errors[validationToken] = queue = [], invalidCount++, toggleValidCss(!1, validationToken), parentForm.$setValidity(validationToken, !1, form);
                queue.push(control), form.$valid = !1, form.$invalid = !0;
            }
        }, /**
     * @ngdoc function
     * @name ng.directive:form.FormController#$setDirty
     * @methodOf ng.directive:form.FormController
     *
     * @description
     * Sets the form to a dirty state.
     *
     * This method can be called to add the 'ng-dirty' class and set the form to a dirty
     * state (ng-dirty class). This method will also propagate to parent forms.
     */ form.$setDirty = function() {
            element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS), form.$dirty = !0, form.$pristine = !1, parentForm.$setDirty();
        }, /**
     * @ngdoc function
     * @name ng.directive:form.FormController#$setPristine
     * @methodOf ng.directive:form.FormController
     *
     * @description
     * Sets the form to its pristine state.
     *
     * This method can be called to remove the 'ng-dirty' class and set the form to its pristine
     * state (ng-pristine class). This method will also propagate to all the controls contained
     * in this form.
     *
     * Setting a form back to a pristine state is often useful when we want to 'reuse' a form after
     * saving or resetting it.
     */ form.$setPristine = function() {
            element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS), form.$dirty = !1, form.$pristine = !0, forEach(controls, function(control) {
                control.$setPristine();
            });
        };
    }
    /**
   * @ngdoc object
   * @name ng.directive:form.FormController
   *
   * @property {boolean} $pristine True if user has not interacted with the form yet.
   * @property {boolean} $dirty True if user has already interacted with the form.
   * @property {boolean} $valid True if all of the containing forms and controls are valid.
   * @property {boolean} $invalid True if at least one containing control or form is invalid.
   *
   * @property {Object} $error Is an object hash, containing references to all invalid controls or
   *  forms, where:
   *
   *  - keys are validation tokens (error names),
   *  - values are arrays of controls or forms that are invalid for given error name.
   *
   *
   *  Built-in validation tokens:
   *
   *  - `email`
   *  - `max`
   *  - `maxlength`
   *  - `min`
   *  - `minlength`
   *  - `number`
   *  - `pattern`
   *  - `required`
   *  - `url`
   *
   * @description
   * `FormController` keeps track of all its controls and nested forms as well as state of them,
   * such as being valid/invalid or dirty/pristine.
   *
   * Each {@link ng.directive:form form} directive creates an instance
   * of `FormController`.
   *
   */ //asks for $scope to fool the BC controller module
    FormController.$inject = [
        "$element",
        "$attrs",
        "$scope"
    ];
    /**
   * @ngdoc directive
   * @name ng.directive:ngForm
   * @restrict EAC
   *
   * @description
   * Nestable alias of {@link ng.directive:form `form`} directive. HTML
   * does not allow nesting of form elements. It is useful to nest forms, for example if the validity of a
   * sub-group of controls needs to be determined.
   *
   * @param {string=} ngForm|name Name of the form. If specified, the form controller will be published into
   *                       related scope, under this name.
   *
   */ /**
 * @ngdoc directive
 * @name ng.directive:form
 * @restrict E
 *
 * @description
 * Directive that instantiates
 * {@link ng.directive:form.FormController FormController}.
 *
 * If the `name` attribute is specified, the form controller is published onto the current scope under
 * this name.
 *
 * # Alias: {@link ng.directive:ngForm `ngForm`}
 *
 * In Angular forms can be nested. This means that the outer form is valid when all of the child
 * forms are valid as well. However, browsers do not allow nesting of `<form>` elements, so
 * Angular provides the {@link ng.directive:ngForm `ngForm`} directive which behaves identically to
 * `<form>` but can be nested.  This allows you to have nested forms, which is very useful when
 * using Angular validation directives in forms that are dynamically generated using the
 * {@link ng.directive:ngRepeat `ngRepeat`} directive. Since you cannot dynamically generate the `name`
 * attribute of input elements using interpolation, you have to wrap each set of repeated inputs in an
 * `ngForm` directive and nest these in an outer `form` element.
 *
 *
 * # CSS classes
 *  - `ng-valid` Is set if the form is valid.
 *  - `ng-invalid` Is set if the form is invalid.
 *  - `ng-pristine` Is set if the form is pristine.
 *  - `ng-dirty` Is set if the form is dirty.
 *
 *
 * # Submitting a form and preventing the default action
 *
 * Since the role of forms in client-side Angular applications is different than in classical
 * roundtrip apps, it is desirable for the browser not to translate the form submission into a full
 * page reload that sends the data to the server. Instead some javascript logic should be triggered
 * to handle the form submission in an application-specific way.
 *
 * For this reason, Angular prevents the default action (form submission to the server) unless the
 * `<form>` element has an `action` attribute specified.
 *
 * You can use one of the following two ways to specify what javascript method should be called when
 * a form is submitted:
 *
 * - {@link ng.directive:ngSubmit ngSubmit} directive on the form element
 * - {@link ng.directive:ngClick ngClick} directive on the first
  *  button or input field of type submit (input[type=submit])
 *
 * To prevent double execution of the handler, use only one of the {@link ng.directive:ngSubmit ngSubmit}
 * or {@link ng.directive:ngClick ngClick} directives.
 * This is because of the following form submission rules in the HTML specification:
 *
 * - If a form has only one input field then hitting enter in this field triggers form submit
 * (`ngSubmit`)
 * - if a form has 2+ input fields and no buttons or input[type=submit] then hitting enter
 * doesn't trigger submit
 * - if a form has one or more input fields and one or more buttons or input[type=submit] then
 * hitting enter in any of the input fields will trigger the click handler on the *first* button or
 * input[type=submit] (`ngClick`) *and* a submit handler on the enclosing form (`ngSubmit`)
 *
 * @param {string=} name Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.userType = 'guest';
         }
       </script>
       <form name="myForm" ng-controller="Ctrl">
         userType: <input name="input" ng-model="userType" required>
         <span class="error" ng-show="myForm.input.$error.required">Required!</span><br>
         <tt>userType = {{userType}}</tt><br>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
         expect(binding('userType')).toEqual('guest');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
         input('userType').enter('');
         expect(binding('userType')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */ var formDirectiveFactory = function(isNgForm) {
        return [
            "$timeout",
            function($timeout) {
                return {
                    name: "form",
                    restrict: isNgForm ? "EAC" : "E",
                    controller: FormController,
                    compile: function() {
                        return {
                            pre: function(scope, formElement, attr, controller) {
                                if (!attr.action) {
                                    // we can't use jq events because if a form is destroyed during submission the default
                                    // action is not prevented. see #1238
                                    //
                                    // IE 9 is not affected because it doesn't fire a submit event and try to do a full
                                    // page reload if the form was destroyed by submission of the form via a click handler
                                    // on a button in the form. Looks like an IE9 specific bug.
                                    var preventDefaultListener = function(event) {
                                        event.preventDefault ? event.preventDefault() : event.returnValue = !1; // IE
                                    };
                                    addEventListenerFn(formElement[0], "submit", preventDefaultListener), // unregister the preventDefault listener so that we don't not leak memory but in a
                                    // way that will achieve the prevention of the default action.
                                    formElement.on("$destroy", function() {
                                        $timeout(function() {
                                            removeEventListenerFn(formElement[0], "submit", preventDefaultListener);
                                        }, 0, !1);
                                    });
                                }
                                var parentFormCtrl = formElement.parent().controller("form"), alias = attr.name || attr.ngForm;
                                alias && setter(scope, alias, controller, alias), parentFormCtrl && formElement.on("$destroy", function() {
                                    parentFormCtrl.$removeControl(controller), alias && setter(scope, alias, undefined, alias), extend(controller, nullFormCtrl);
                                });
                            }
                        };
                    }
                };
            }
        ];
    }, formDirective = formDirectiveFactory(), ngFormDirective = formDirectiveFactory(!0), URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/, NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/, inputType = {
        /**
   * @ngdoc inputType
   * @name ng.directive:input.text
   *
   * @description
   * Standard HTML text input with angular data binding.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Adds `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   * @param {boolean=} [ngTrim=true] If set to false Angular will not automatically trim the input.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.text = 'guest';
             $scope.word = /^\s*\w*\s*$/;
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           Single word: <input type="text" name="input" ng-model="text"
                               ng-pattern="word" required ng-trim="false">
           <span class="error" ng-show="myForm.input.$error.required">
             Required!</span>
           <span class="error" ng-show="myForm.input.$error.pattern">
             Single word only!</span>

           <tt>text = {{text}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
            expect(binding('text')).toEqual('guest');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
            input('text').enter('');
            expect(binding('text')).toEqual('');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if multi word', function() {
            input('text').enter('hello world');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should not be trimmed', function() {
            input('text').enter('untrimmed ');
            expect(binding('text')).toEqual('untrimmed ');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });
        </doc:scenario>
      </doc:example>
   */ text: textInputType,
        /**
   * @ngdoc inputType
   * @name ng.directive:input.number
   *
   * @description
   * Text input with number validation and transformation. Sets the `number` validation
   * error if not a valid number.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.value = 12;
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           Number: <input type="number" name="input" ng-model="value"
                          min="0" max="99" required>
           <span class="error" ng-show="myForm.input.$error.required">
             Required!</span>
           <span class="error" ng-show="myForm.input.$error.number">
             Not valid number!</span>
           <tt>value = {{value}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
           expect(binding('value')).toEqual('12');
           expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
           input('value').enter('');
           expect(binding('value')).toEqual('');
           expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if over max', function() {
           input('value').enter('123');
           expect(binding('value')).toEqual('');
           expect(binding('myForm.input.$valid')).toEqual('false');
          });
        </doc:scenario>
      </doc:example>
   */ number: function(scope, element, attr, ctrl, $sniffer, $browser) {
            if (textInputType(scope, element, attr, ctrl, $sniffer, $browser), ctrl.$parsers.push(function(value) {
                var empty = ctrl.$isEmpty(value);
                return empty || NUMBER_REGEXP.test(value) ? (ctrl.$setValidity("number", !0), "" === value ? null : empty ? value : parseFloat(value)) : (ctrl.$setValidity("number", !1), undefined);
            }), ctrl.$formatters.push(function(value) {
                return ctrl.$isEmpty(value) ? "" : "" + value;
            }), attr.min) {
                var minValidator = function(value) {
                    var min = parseFloat(attr.min);
                    return !ctrl.$isEmpty(value) && value < min ? (ctrl.$setValidity("min", !1), undefined) : (ctrl.$setValidity("min", !0), value);
                };
                ctrl.$parsers.push(minValidator), ctrl.$formatters.push(minValidator);
            }
            if (attr.max) {
                var maxValidator = function(value) {
                    var max = parseFloat(attr.max);
                    return !ctrl.$isEmpty(value) && value > max ? (ctrl.$setValidity("max", !1), undefined) : (ctrl.$setValidity("max", !0), value);
                };
                ctrl.$parsers.push(maxValidator), ctrl.$formatters.push(maxValidator);
            }
            ctrl.$formatters.push(function(value) {
                return ctrl.$isEmpty(value) || isNumber(value) ? (ctrl.$setValidity("number", !0), value) : (ctrl.$setValidity("number", !1), undefined);
            });
        },
        /**
   * @ngdoc inputType
   * @name ng.directive:input.url
   *
   * @description
   * Text input with URL validation. Sets the `url` validation error key if the content is not a
   * valid URL.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.text = 'http://google.com';
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           URL: <input type="url" name="input" ng-model="text" required>
           <span class="error" ng-show="myForm.input.$error.required">
             Required!</span>
           <span class="error" ng-show="myForm.input.$error.url">
             Not valid url!</span>
           <tt>text = {{text}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
           <tt>myForm.$error.url = {{!!myForm.$error.url}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
            expect(binding('text')).toEqual('http://google.com');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
            input('text').enter('');
            expect(binding('text')).toEqual('');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if not url', function() {
            input('text').enter('xxx');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });
        </doc:scenario>
      </doc:example>
   */ url: function(scope, element, attr, ctrl, $sniffer, $browser) {
            textInputType(scope, element, attr, ctrl, $sniffer, $browser);
            var urlValidator = function(value) {
                return ctrl.$isEmpty(value) || URL_REGEXP.test(value) ? (ctrl.$setValidity("url", !0), value) : (ctrl.$setValidity("url", !1), undefined);
            };
            ctrl.$formatters.push(urlValidator), ctrl.$parsers.push(urlValidator);
        },
        /**
   * @ngdoc inputType
   * @name ng.directive:input.email
   *
   * @description
   * Text input with email validation. Sets the `email` validation error key if not a valid email
   * address.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.text = 'me@example.com';
           }
         </script>
           <form name="myForm" ng-controller="Ctrl">
             Email: <input type="email" name="input" ng-model="text" required>
             <span class="error" ng-show="myForm.input.$error.required">
               Required!</span>
             <span class="error" ng-show="myForm.input.$error.email">
               Not valid email!</span>
             <tt>text = {{text}}</tt><br/>
             <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
             <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
             <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
             <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
             <tt>myForm.$error.email = {{!!myForm.$error.email}}</tt><br/>
           </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
            expect(binding('text')).toEqual('me@example.com');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
            input('text').enter('');
            expect(binding('text')).toEqual('');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if not email', function() {
            input('text').enter('xxx');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });
        </doc:scenario>
      </doc:example>
   */ email: function(scope, element, attr, ctrl, $sniffer, $browser) {
            textInputType(scope, element, attr, ctrl, $sniffer, $browser);
            var emailValidator = function(value) {
                return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value) ? (ctrl.$setValidity("email", !0), value) : (ctrl.$setValidity("email", !1), undefined);
            };
            ctrl.$formatters.push(emailValidator), ctrl.$parsers.push(emailValidator);
        },
        /**
   * @ngdoc inputType
   * @name ng.directive:input.radio
   *
   * @description
   * HTML radio button.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string} value The value to which the expression should be set when selected.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.color = 'blue';
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           <input type="radio" ng-model="color" value="red">  Red <br/>
           <input type="radio" ng-model="color" value="green"> Green <br/>
           <input type="radio" ng-model="color" value="blue"> Blue <br/>
           <tt>color = {{color}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should change state', function() {
            expect(binding('color')).toEqual('blue');

            input('color').select('red');
            expect(binding('color')).toEqual('red');
          });
        </doc:scenario>
      </doc:example>
   */ radio: function(scope, element, attr, ctrl) {
            isUndefined(attr.name) && element.attr("name", nextUid()), element.on("click", function() {
                element[0].checked && scope.$apply(function() {
                    ctrl.$setViewValue(attr.value);
                });
            }), ctrl.$render = function() {
                var value = attr.value;
                element[0].checked = value == ctrl.$viewValue;
            }, attr.$observe("value", ctrl.$render);
        },
        /**
   * @ngdoc inputType
   * @name ng.directive:input.checkbox
   *
   * @description
   * HTML checkbox.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} ngTrueValue The value to which the expression should be set when selected.
   * @param {string=} ngFalseValue The value to which the expression should be set when not selected.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.value1 = true;
             $scope.value2 = 'YES'
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           Value1: <input type="checkbox" ng-model="value1"> <br/>
           Value2: <input type="checkbox" ng-model="value2"
                          ng-true-value="YES" ng-false-value="NO"> <br/>
           <tt>value1 = {{value1}}</tt><br/>
           <tt>value2 = {{value2}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should change state', function() {
            expect(binding('value1')).toEqual('true');
            expect(binding('value2')).toEqual('YES');

            input('value1').check();
            input('value2').check();
            expect(binding('value1')).toEqual('false');
            expect(binding('value2')).toEqual('NO');
          });
        </doc:scenario>
      </doc:example>
   */ checkbox: function(scope, element, attr, ctrl) {
            var trueValue = attr.ngTrueValue, falseValue = attr.ngFalseValue;
            isString(trueValue) || (trueValue = !0), isString(falseValue) || (falseValue = !1), element.on("click", function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(element[0].checked);
                });
            }), ctrl.$render = function() {
                element[0].checked = ctrl.$viewValue;
            }, // Override the standard `$isEmpty` because a value of `false` means empty in a checkbox.
            ctrl.$isEmpty = function(value) {
                return value !== trueValue;
            }, ctrl.$formatters.push(function(value) {
                return value === trueValue;
            }), ctrl.$parsers.push(function(value) {
                return value ? trueValue : falseValue;
            });
        },
        hidden: noop,
        button: noop,
        submit: noop,
        reset: noop
    };
    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        // In composition mode, users are still inputing intermediate text buffer,
        // hold the listener until composition is done.
        // More about composition events: https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
        var composing = !1;
        element.on("compositionstart", function() {
            composing = !0;
        }), element.on("compositionend", function() {
            composing = !1;
        });
        var listener = function() {
            if (!composing) {
                var value = element.val();
                toBoolean(attr.ngTrim || "T") && (value = trim(value)), ctrl.$viewValue !== value && scope.$apply(function() {
                    ctrl.$setViewValue(value);
                });
            }
        };
        // if the browser does support "input" event, we are fine - except on IE9 which doesn't fire the
        // input event on backspace, delete or cut
        if ($sniffer.hasEvent("input")) element.on("input", listener);
        else {
            var timeout, deferListener = function() {
                timeout || (timeout = $browser.defer(function() {
                    listener(), timeout = null;
                }));
            };
            element.on("keydown", function(event) {
                var key = event.keyCode;
                // ignore
                //    command            modifiers                   arrows
                91 === key || 15 < key && key < 19 || 37 <= key && key <= 40 || deferListener();
            }), $sniffer.hasEvent("paste") && element.on("paste cut", deferListener);
        }
        // if user paste into input using mouse on older browser
        // or form autocomplete on newer browser, we need "change" event to catch it
        element.on("change", listener), ctrl.$render = function() {
            element.val(ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
        };
        // pattern validator
        var patternValidator, match, pattern = attr.ngPattern, validate = function(regexp, value) {
            return ctrl.$isEmpty(value) || regexp.test(value) ? (ctrl.$setValidity("pattern", !0), value) : (ctrl.$setValidity("pattern", !1), undefined);
        };
        // min length validator
        if (pattern && ((match = pattern.match(/^\/(.*)\/([gim]*)$/)) ? (pattern = new RegExp(match[1], match[2]), patternValidator = function(value) {
            return validate(pattern, value);
        }) : patternValidator = function(value) {
            var patternObj = scope.$eval(pattern);
            if (!patternObj || !patternObj.test) throw minErr("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", pattern, patternObj, startingTag(element));
            return validate(patternObj, value);
        }, ctrl.$formatters.push(patternValidator), ctrl.$parsers.push(patternValidator)), attr.ngMinlength) {
            var minlength = int(attr.ngMinlength), minLengthValidator = function(value) {
                return !ctrl.$isEmpty(value) && value.length < minlength ? (ctrl.$setValidity("minlength", !1), undefined) : (ctrl.$setValidity("minlength", !0), value);
            };
            ctrl.$parsers.push(minLengthValidator), ctrl.$formatters.push(minLengthValidator);
        }
        // max length validator
        if (attr.ngMaxlength) {
            var maxlength = int(attr.ngMaxlength), maxLengthValidator = function(value) {
                return !ctrl.$isEmpty(value) && value.length > maxlength ? (ctrl.$setValidity("maxlength", !1), undefined) : (ctrl.$setValidity("maxlength", !0), value);
            };
            ctrl.$parsers.push(maxLengthValidator), ctrl.$formatters.push(maxLengthValidator);
        }
    }
    /**
   * @ngdoc directive
   * @name ng.directive:textarea
   * @restrict E
   *
   * @description
   * HTML textarea element control with angular data-binding. The data-binding and validation
   * properties of this element are exactly the same as those of the
   * {@link ng.directive:input input element}.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   */ /**
 * @ngdoc directive
 * @name ng.directive:input
 * @restrict E
 *
 * @description
 * HTML input element control with angular data-binding. Input control follows HTML5 input types
 * and polyfills the HTML5 validation behavior for older browsers.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {boolean=} ngRequired Sets `required` attribute if set to true
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.user = {name: 'guest', last: 'visitor'};
         }
       </script>
       <div ng-controller="Ctrl">
         <form name="myForm">
           User name: <input type="text" name="userName" ng-model="user.name" required>
           <span class="error" ng-show="myForm.userName.$error.required">
             Required!</span><br>
           Last name: <input type="text" name="lastName" ng-model="user.last"
             ng-minlength="3" ng-maxlength="10">
           <span class="error" ng-show="myForm.lastName.$error.minlength">
             Too short!</span>
           <span class="error" ng-show="myForm.lastName.$error.maxlength">
             Too long!</span><br>
         </form>
         <hr>
         <tt>user = {{user}}</tt><br/>
         <tt>myForm.userName.$valid = {{myForm.userName.$valid}}</tt><br>
         <tt>myForm.userName.$error = {{myForm.userName.$error}}</tt><br>
         <tt>myForm.lastName.$valid = {{myForm.lastName.$valid}}</tt><br>
         <tt>myForm.lastName.$error = {{myForm.lastName.$error}}</tt><br>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br>
         <tt>myForm.$error.minlength = {{!!myForm.$error.minlength}}</tt><br>
         <tt>myForm.$error.maxlength = {{!!myForm.$error.maxlength}}</tt><br>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('user')).toEqual('{"name":"guest","last":"visitor"}');
          expect(binding('myForm.userName.$valid')).toEqual('true');
          expect(binding('myForm.$valid')).toEqual('true');
        });

        it('should be invalid if empty when required', function() {
          input('user.name').enter('');
          expect(binding('user')).toEqual('{"last":"visitor"}');
          expect(binding('myForm.userName.$valid')).toEqual('false');
          expect(binding('myForm.$valid')).toEqual('false');
        });

        it('should be valid if empty when min length is set', function() {
          input('user.last').enter('');
          expect(binding('user')).toEqual('{"name":"guest","last":""}');
          expect(binding('myForm.lastName.$valid')).toEqual('true');
          expect(binding('myForm.$valid')).toEqual('true');
        });

        it('should be invalid if less than required min length', function() {
          input('user.last').enter('xx');
          expect(binding('user')).toEqual('{"name":"guest"}');
          expect(binding('myForm.lastName.$valid')).toEqual('false');
          expect(binding('myForm.lastName.$error')).toMatch(/minlength/);
          expect(binding('myForm.$valid')).toEqual('false');
        });

        it('should be invalid if longer than max length', function() {
          input('user.last').enter('some ridiculously long name');
          expect(binding('user'))
            .toEqual('{"name":"guest"}');
          expect(binding('myForm.lastName.$valid')).toEqual('false');
          expect(binding('myForm.lastName.$error')).toMatch(/maxlength/);
          expect(binding('myForm.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */ var inputDirective = [
        "$browser",
        "$sniffer",
        function($browser, $sniffer) {
            return {
                restrict: "E",
                require: "?ngModel",
                link: function(scope, element, attr, ctrl) {
                    ctrl && (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl, $sniffer, $browser);
                }
            };
        }
    ], VALID_CLASS = "ng-valid", INVALID_CLASS = "ng-invalid", PRISTINE_CLASS = "ng-pristine", DIRTY_CLASS = "ng-dirty", NgModelController = [
        "$scope",
        "$exceptionHandler",
        "$attrs",
        "$element",
        "$parse",
        function($scope, $exceptionHandler, $attr, $element, $parse) {
            this.$viewValue = Number.NaN, this.$modelValue = Number.NaN, this.$parsers = [], this.$formatters = [], this.$viewChangeListeners = [], this.$pristine = !0, this.$dirty = !1, this.$valid = !0, this.$invalid = !1, this.$name = $attr.name;
            var ngModelGet = $parse($attr.ngModel), ngModelSet = ngModelGet.assign;
            if (!ngModelSet) throw minErr("ngModel")("nonassign", "Expression '{0}' is non-assignable. Element: {1}", $attr.ngModel, startingTag($element));
            /**
       * @ngdoc function
       * @name ng.directive:ngModel.NgModelController#$render
       * @methodOf ng.directive:ngModel.NgModelController
       *
       * @description
       * Called when the view needs to be updated. It is expected that the user of the ng-model
       * directive will implement this method.
       */ this.$render = noop, /**
       * @ngdoc function
       * @name { ng.directive:ngModel.NgModelController#$isEmpty
       * @methodOf ng.directive:ngModel.NgModelController
       *
       * @description
       * This is called when we need to determine if the value of the input is empty.
       *
       * For instance, the required directive does this to work out if the input has data or not.
       * The default `$isEmpty` function checks whether the value is `undefined`, `''`, `null` or `NaN`.
       *
       * You can override this for input directives whose concept of being empty is different to the
       * default. The `checkboxInputType` directive does this because in its case a value of `false`
       * implies empty.
       */ this.$isEmpty = function(value) {
                return isUndefined(value) || "" === value || null === value || value != value;
            };
            var parentForm = $element.inheritedData("$formController") || nullFormCtrl, invalidCount = 0, $error = this.$error = {}; // keep invalid keys here
            // convenience method for easy toggling of classes
            function toggleValidCss(isValid, validationErrorKey) {
                validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "", $element.removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
            }
            // Setup initial state of the control
            $element.addClass(PRISTINE_CLASS), toggleValidCss(!0), /**
       * @ngdoc function
       * @name ng.directive:ngModel.NgModelController#$setValidity
       * @methodOf ng.directive:ngModel.NgModelController
       *
       * @description
       * Change the validity state, and notifies the form when the control changes validity. (i.e. it
       * does not notify form if given validator is already marked as invalid).
       *
       * This method should be called by validators - i.e. the parser or formatter functions.
       *
       * @param {string} validationErrorKey Name of the validator. the `validationErrorKey` will assign
       *        to `$error[validationErrorKey]=isValid` so that it is available for data-binding.
       *        The `validationErrorKey` should be in camelCase and will get converted into dash-case
       *        for class name. Example: `myError` will result in `ng-valid-my-error` and `ng-invalid-my-error`
       *        class and can be bound to as  `{{someForm.someControl.$error.myError}}` .
       * @param {boolean} isValid Whether the current state is valid (true) or invalid (false).
       */ this.$setValidity = function(validationErrorKey, isValid) {
                // Purposeful use of ! here to cast isValid to boolean in case it is undefined
                // jshint -W018
                !isValid !== $error[validationErrorKey] && (isValid ? ($error[validationErrorKey] && invalidCount--, invalidCount || (toggleValidCss(!0), this.$valid = !0, this.$invalid = !1)) : (toggleValidCss(!1), this.$invalid = !0, this.$valid = !1, invalidCount++), $error[validationErrorKey] = !isValid, toggleValidCss(isValid, validationErrorKey), parentForm.$setValidity(validationErrorKey, isValid, this));
            }, /**
       * @ngdoc function
       * @name ng.directive:ngModel.NgModelController#$setPristine
       * @methodOf ng.directive:ngModel.NgModelController
       *
       * @description
       * Sets the control to its pristine state.
       *
       * This method can be called to remove the 'ng-dirty' class and set the control to its pristine
       * state (ng-pristine class).
       */ this.$setPristine = function() {
                this.$dirty = !1, this.$pristine = !0, $element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
            }, /**
       * @ngdoc function
       * @name ng.directive:ngModel.NgModelController#$setViewValue
       * @methodOf ng.directive:ngModel.NgModelController
       *
       * @description
       * Update the view value.
       *
       * This method should be called when the view value changes, typically from within a DOM event handler.
       * For example {@link ng.directive:input input} and
       * {@link ng.directive:select select} directives call it.
       *
       * It will update the $viewValue, then pass this value through each of the functions in `$parsers`,
       * which includes any validators. The value that comes out of this `$parsers` pipeline, be applied to
       * `$modelValue` and the **expression** specified in the `ng-model` attribute.
       *
       * Lastly, all the registered change listeners, in the `$viewChangeListeners` list, are called.
       *
       * Note that calling this function does not trigger a `$digest`.
       *
       * @param {string} value Value from the view.
       */ this.$setViewValue = function(value) {
                this.$viewValue = value, this.$pristine && (this.$dirty = !0, this.$pristine = !1, $element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS), parentForm.$setDirty()), forEach(this.$parsers, function(fn) {
                    value = fn(value);
                }), this.$modelValue !== value && (this.$modelValue = value, ngModelSet($scope, value), forEach(this.$viewChangeListeners, function(listener) {
                    try {
                        listener();
                    } catch (e) {
                        $exceptionHandler(e);
                    }
                }));
            };
            // model -> value
            var ctrl = this;
            $scope.$watch(function() {
                var value = ngModelGet($scope);
                // if scope model value and ngModel value are out of sync
                if (ctrl.$modelValue !== value) {
                    var formatters = ctrl.$formatters, idx = formatters.length;
                    for(ctrl.$modelValue = value; idx--;)value = formatters[idx](value);
                    ctrl.$viewValue !== value && (ctrl.$viewValue = value, ctrl.$render());
                }
                return value;
            });
        }
    ], ngModelDirective = function() {
        return {
            require: [
                "ngModel",
                "^?form"
            ],
            controller: NgModelController,
            link: function(scope, element, attr, ctrls) {
                // notify others, especially parent forms
                var modelCtrl = ctrls[0], formCtrl = ctrls[1] || nullFormCtrl;
                formCtrl.$addControl(modelCtrl), scope.$on("$destroy", function() {
                    formCtrl.$removeControl(modelCtrl);
                });
            }
        };
    }, ngChangeDirective = valueFn({
        require: "ngModel",
        link: function(scope, element, attr, ctrl) {
            ctrl.$viewChangeListeners.push(function() {
                scope.$eval(attr.ngChange);
            });
        }
    }), requiredDirective = function() {
        return {
            require: "?ngModel",
            link: function(scope, elm, attr, ctrl) {
                if (ctrl) {
                    attr.required = !0;
                    var validator = function(value) {
                        if (!(attr.required && ctrl.$isEmpty(value))) return ctrl.$setValidity("required", !0), value;
                        ctrl.$setValidity("required", !1);
                    };
                    ctrl.$formatters.push(validator), ctrl.$parsers.unshift(validator), attr.$observe("required", function() {
                        validator(ctrl.$viewValue);
                    });
                }
            }
        };
    }, ngListDirective = function() {
        return {
            require: "ngModel",
            link: function(scope, element, attr, ctrl) {
                var match = /\/(.*)\//.exec(attr.ngList), separator = match && new RegExp(match[1]) || attr.ngList || ",";
                ctrl.$parsers.push(function(viewValue) {
                    // If the viewValue is invalid (say required but empty) it will be `undefined`
                    if (!isUndefined(viewValue)) {
                        var list = [];
                        return viewValue && forEach(viewValue.split(separator), function(value) {
                            value && list.push(trim(value));
                        }), list;
                    }
                }), ctrl.$formatters.push(function(value) {
                    return isArray(value) ? value.join(", ") : undefined;
                }), // Override the standard $isEmpty because an empty array means the input is empty.
                ctrl.$isEmpty = function(value) {
                    return !value || !value.length;
                };
            }
        };
    }, CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/, ngValueDirective = function() {
        return {
            priority: 100,
            compile: function(tpl, tplAttr) {
                return CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue) ? function(scope, elm, attr) {
                    attr.$set("value", scope.$eval(attr.ngValue));
                } : function(scope, elm, attr) {
                    scope.$watch(attr.ngValue, function(value) {
                        attr.$set("value", value);
                    });
                };
            }
        };
    }, ngBindDirective = ngDirective(function(scope, element, attr) {
        element.addClass("ng-binding").data("$binding", attr.ngBind), scope.$watch(attr.ngBind, function(value) {
            // We are purposefully using == here rather than === because we want to
            // catch when value is "null or undefined"
            // jshint -W041
            element.text(undefined == value ? "" : value);
        });
    }), ngBindTemplateDirective = [
        "$interpolate",
        function($interpolate) {
            return function(scope, element, attr) {
                // TODO: move this to scenario runner
                var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
                element.addClass("ng-binding").data("$binding", interpolateFn), attr.$observe("ngBindTemplate", function(value) {
                    element.text(value);
                });
            };
        }
    ], ngBindHtmlDirective = [
        "$sce",
        "$parse",
        function($sce, $parse) {
            return function(scope, element, attr) {
                element.addClass("ng-binding").data("$binding", attr.ngBindHtml);
                var parsed = $parse(attr.ngBindHtml);
                scope.$watch(function() {
                    return (parsed(scope) || "").toString();
                }, function(value) {
                    element.html($sce.getTrustedHtml(parsed(scope)) || "");
                });
            };
        }
    ];
    function classDirective(name, selector) {
        return name = "ngClass" + name, function() {
            return {
                restrict: "AC",
                link: function(scope, element, attr) {
                    var oldVal;
                    function ngClassWatchAction(newVal) {
                        if (!0 === selector || scope.$index % 2 === selector) {
                            var newClasses = flattenClasses(newVal || "");
                            oldVal ? equals(newVal, oldVal) || attr.$updateClass(newClasses, flattenClasses(oldVal)) : attr.$addClass(newClasses);
                        }
                        oldVal = copy(newVal);
                    }
                    function flattenClasses(classVal) {
                        if (isArray(classVal)) return classVal.join(" ");
                        if (isObject(classVal)) {
                            var classes = [];
                            return forEach(classVal, function(v, k) {
                                v && classes.push(k);
                            }), classes.join(" ");
                        }
                        return classVal;
                    }
                    scope.$watch(attr[name], ngClassWatchAction, !0), attr.$observe("class", function(value) {
                        ngClassWatchAction(scope.$eval(attr[name]));
                    }), "ngClass" !== name && scope.$watch("$index", function($index, old$index) {
                        // jshint bitwise: false
                        var mod = 1 & $index;
                        if (mod !== old$index & 1) {
                            var classes = flattenClasses(scope.$eval(attr[name]));
                            mod === selector ? attr.$addClass(classes) : attr.$removeClass(classes);
                        }
                    });
                }
            };
        };
    }
    /**
 * @ngdoc directive
 * @name ng.directive:ngClass
 * @restrict AC
 *
 * @description
 * The `ngClass` directive allows you to dynamically set CSS classes on an HTML element by databinding
 * an expression that represents all classes to be added.
 *
 * The directive won't add duplicate classes if a particular class was already set.
 *
 * When the expression changes, the previously added classes are removed and only then the
 * new classes are added.
 *
 * @animations
 * add - happens just before the class is applied to the element
 * remove - happens just before the class is removed from the element
 *
 * @element ANY
 * @param {expression} ngClass {@link guide/expression Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class
 *   names, an array, or a map of class names to boolean values. In the case of a map, the
 *   names of the properties whose values are truthy will be added as css classes to the
 *   element.
 *
 * @example Example that demonstrates basic bindings via ngClass directive.
   <example>
     <file name="index.html">
       <p ng-class="{strike: deleted, bold: important, red: error}">Map Syntax Example</p>
       <input type="checkbox" ng-model="deleted"> deleted (apply "strike" class)<br>
       <input type="checkbox" ng-model="important"> important (apply "bold" class)<br>
       <input type="checkbox" ng-model="error"> error (apply "red" class)
       <hr>
       <p ng-class="style">Using String Syntax</p>
       <input type="text" ng-model="style" placeholder="Type: bold strike red">
       <hr>
       <p ng-class="[style1, style2, style3]">Using Array Syntax</p>
       <input ng-model="style1" placeholder="Type: bold, strike or red"><br>
       <input ng-model="style2" placeholder="Type: bold, strike or red"><br>
       <input ng-model="style3" placeholder="Type: bold, strike or red"><br>
     </file>
     <file name="style.css">
       .strike {
         text-decoration: line-through;
       }
       .bold {
           font-weight: bold;
       }
       .red {
           color: red;
       }
     </file>
     <file name="scenario.js">
       it('should let you toggle the class', function() {

         expect(element('.doc-example-live p:first').prop('className')).not().toMatch(/bold/);
         expect(element('.doc-example-live p:first').prop('className')).not().toMatch(/red/);

         input('important').check();
         expect(element('.doc-example-live p:first').prop('className')).toMatch(/bold/);

         input('error').check();
         expect(element('.doc-example-live p:first').prop('className')).toMatch(/red/);
       });

       it('should let you toggle string example', function() {
         expect(element('.doc-example-live p:nth-of-type(2)').prop('className')).toBe('');
         input('style').enter('red');
         expect(element('.doc-example-live p:nth-of-type(2)').prop('className')).toBe('red');
       });

       it('array example should have 3 classes', function() {
         expect(element('.doc-example-live p:last').prop('className')).toBe('');
         input('style1').enter('bold');
         input('style2').enter('strike');
         input('style3').enter('red');
         expect(element('.doc-example-live p:last').prop('className')).toBe('bold strike red');
       });
     </file>
   </example>

   ## Animations

   The example below demonstrates how to perform animations using ngClass.

   <example animations="true">
     <file name="index.html">
      <input type="button" value="set" ng-click="myVar='my-class'">
      <input type="button" value="clear" ng-click="myVar=''">
      <br>
      <span class="base-class" ng-class="myVar">Sample Text</span>
     </file>
     <file name="style.css">
       .base-class {
         -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
         transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
       }

       .base-class.my-class {
         color: red;
         font-size:3em;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class', function() {
         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/my-class/);

         using('.doc-example-live').element(':button:first').click();

         expect(element('.doc-example-live span').prop('className')).
           toMatch(/my-class/);

         using('.doc-example-live').element(':button:last').click();

         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/my-class/);
       });
     </file>
   </example>


   ## ngClass and pre-existing CSS3 Transitions/Animations
   The ngClass directive still supports CSS3 Transitions/Animations even if they do not follow the ngAnimate CSS naming structure.
   Upon animation ngAnimate will apply supplementary CSS classes to track the start and end of an animation, but this will not hinder
   any pre-existing CSS transitions already on the element. To get an idea of what happens during a class-based animation, be sure
   to view the step by step details of {@link ngAnimate.$animate#methods_addclass $animate.addClass} and
   {@link ngAnimate.$animate#methods_removeclass $animate.removeClass}.
 */ var ngClassDirective = classDirective("", !0), ngClassOddDirective = classDirective("Odd", 0), ngClassEvenDirective = classDirective("Even", 1), ngCloakDirective = ngDirective({
        compile: function(element, attr) {
            attr.$set("ngCloak", undefined), element.removeClass("ng-cloak");
        }
    }), ngControllerDirective = [
        function() {
            return {
                scope: !0,
                controller: "@",
                priority: 500
            };
        }
    ], ngEventDirectives = {};
    forEach("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(name) {
        var directiveName = directiveNormalize("ng-" + name);
        ngEventDirectives[directiveName] = [
            "$parse",
            function($parse) {
                return {
                    compile: function($element, attr) {
                        var fn = $parse(attr[directiveName]);
                        return function(scope, element, attr) {
                            element.on(lowercase(name), function(event) {
                                scope.$apply(function() {
                                    fn(scope, {
                                        $event: event
                                    });
                                });
                            });
                        };
                    }
                };
            }
        ];
    });
    /**
   * @ngdoc directive
   * @name ng.directive:ngDblclick
   *
   * @description
   * The `ngDblclick` directive allows you to specify custom behavior on a dblclick event.
   *
   * @element ANY
   * @param {expression} ngDblclick {@link guide/expression Expression} to evaluate upon
   * a dblclick. (The Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngMousedown
   *
   * @description
   * The ngMousedown directive allows you to specify custom behavior on mousedown event.
   *
   * @element ANY
   * @param {expression} ngMousedown {@link guide/expression Expression} to evaluate upon
   * mousedown. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngMouseup
   *
   * @description
   * Specify custom behavior on mouseup event.
   *
   * @element ANY
   * @param {expression} ngMouseup {@link guide/expression Expression} to evaluate upon
   * mouseup. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngMouseover
   *
   * @description
   * Specify custom behavior on mouseover event.
   *
   * @element ANY
   * @param {expression} ngMouseover {@link guide/expression Expression} to evaluate upon
   * mouseover. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngMouseenter
   *
   * @description
   * Specify custom behavior on mouseenter event.
   *
   * @element ANY
   * @param {expression} ngMouseenter {@link guide/expression Expression} to evaluate upon
   * mouseenter. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngMouseleave
   *
   * @description
   * Specify custom behavior on mouseleave event.
   *
   * @element ANY
   * @param {expression} ngMouseleave {@link guide/expression Expression} to evaluate upon
   * mouseleave. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngMousemove
   *
   * @description
   * Specify custom behavior on mousemove event.
   *
   * @element ANY
   * @param {expression} ngMousemove {@link guide/expression Expression} to evaluate upon
   * mousemove. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngKeydown
   *
   * @description
   * Specify custom behavior on keydown event.
   *
   * @element ANY
   * @param {expression} ngKeydown {@link guide/expression Expression} to evaluate upon
   * keydown. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngKeyup
   *
   * @description
   * Specify custom behavior on keyup event.
   *
   * @element ANY
   * @param {expression} ngKeyup {@link guide/expression Expression} to evaluate upon
   * keyup. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngKeypress
   *
   * @description
   * Specify custom behavior on keypress event.
   *
   * @element ANY
   * @param {expression} ngKeypress {@link guide/expression Expression} to evaluate upon
   * keypress. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
 * @ngdoc directive
 * @name ng.directive:ngSubmit
 *
 * @description
 * Enables binding angular expressions to onsubmit events.
 *
 * Additionally it prevents the default action (which for form means sending the request to the
 * server and reloading the current page) **but only if the form does not contain an `action`
 * attribute**.
 *
 * @element form
 * @param {expression} ngSubmit {@link guide/expression Expression} to eval. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <script>
        function Ctrl($scope) {
          $scope.list = [];
          $scope.text = 'hello';
          $scope.submit = function() {
            if (this.text) {
              this.list.push(this.text);
              this.text = '';
            }
          };
        }
      </script>
      <form ng-submit="submit()" ng-controller="Ctrl">
        Enter text and hit enter:
        <input type="text" ng-model="text" name="text" />
        <input type="submit" id="submit" value="Submit" />
        <pre>list={{list}}</pre>
      </form>
     </doc:source>
     <doc:scenario>
       it('should check ng-submit', function() {
         expect(binding('list')).toBe('[]');
         element('.doc-example-live #submit').click();
         expect(binding('list')).toBe('["hello"]');
         expect(input('text').val()).toBe('');
       });
       it('should ignore empty strings', function() {
         expect(binding('list')).toBe('[]');
         element('.doc-example-live #submit').click();
         element('.doc-example-live #submit').click();
         expect(binding('list')).toBe('["hello"]');
       });
     </doc:scenario>
   </doc:example>
 */ /**
   * @ngdoc directive
   * @name ng.directive:ngFocus
   *
   * @description
   * Specify custom behavior on focus event.
   *
   * @element window, input, select, textarea, a
   * @param {expression} ngFocus {@link guide/expression Expression} to evaluate upon
   * focus. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngBlur
   *
   * @description
   * Specify custom behavior on blur event.
   *
   * @element window, input, select, textarea, a
   * @param {expression} ngBlur {@link guide/expression Expression} to evaluate upon
   * blur. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngCopy
   *
   * @description
   * Specify custom behavior on copy event.
   *
   * @element window, input, select, textarea, a
   * @param {expression} ngCopy {@link guide/expression Expression} to evaluate upon
   * copy. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngCut
   *
   * @description
   * Specify custom behavior on cut event.
   *
   * @element window, input, select, textarea, a
   * @param {expression} ngCut {@link guide/expression Expression} to evaluate upon
   * cut. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
   * @ngdoc directive
   * @name ng.directive:ngPaste
   *
   * @description
   * Specify custom behavior on paste event.
   *
   * @element window, input, select, textarea, a
   * @param {expression} ngPaste {@link guide/expression Expression} to evaluate upon
   * paste. (Event object is available as `$event`)
   *
   * @example
   * See {@link ng.directive:ngClick ngClick}
   */ /**
 * @ngdoc directive
 * @name ng.directive:ngIf
 * @restrict A
 *
 * @description
 * The `ngIf` directive removes or recreates a portion of the DOM tree based on an
 * {expression}. If the expression assigned to `ngIf` evaluates to a false
 * value then the element is removed from the DOM, otherwise a clone of the
 * element is reinserted into the DOM.
 *
 * `ngIf` differs from `ngShow` and `ngHide` in that `ngIf` completely removes and recreates the
 * element in the DOM rather than changing its visibility via the `display` css property.  A common
 * case when this difference is significant is when using css selectors that rely on an element's
 * position within the DOM, such as the `:first-child` or `:last-child` pseudo-classes.
 *
 * Note that when an element is removed using `ngIf` its scope is destroyed and a new scope
 * is created when the element is restored.  The scope created within `ngIf` inherits from
 * its parent scope using
 * {@link https://github.com/angular/angular.js/wiki/The-Nuances-of-Scope-Prototypal-Inheritance prototypal inheritance}.
 * An important implication of this is if `ngModel` is used within `ngIf` to bind to
 * a javascript primitive defined in the parent scope. In this case any modifications made to the
 * variable within the child scope will override (hide) the value in the parent scope.
 *
 * Also, `ngIf` recreates elements using their compiled state. An example of this behavior
 * is if an element's class attribute is directly modified after it's compiled, using something like
 * jQuery's `.addClass()` method, and the element is later removed. When `ngIf` recreates the element
 * the added class will be lost because the original compiled state is used to regenerate the element.
 *
 * Additionally, you can provide animations via the `ngAnimate` module to animate the `enter`
 * and `leave` effects.
 *
 * @animations
 * enter - happens just after the ngIf contents change and a new DOM element is created and injected into the ngIf container
 * leave - happens just before the ngIf contents are removed from the DOM
 *
 * @element ANY
 * @scope
 * @priority 600
 * @param {expression} ngIf If the {@link guide/expression expression} is falsy then
 *     the element is removed from the DOM tree. If it is truthy a copy of the compiled
 *     element is added to the DOM tree.
 *
 * @example
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked" ng-init="checked=true" /><br/>
      Show when checked:
      <span ng-if="checked" class="animate-if">
        I'm removed when the checkbox is unchecked.
      </span>
    </file>
    <file name="animations.css">
      .animate-if {
        background:white;
        border:1px solid black;
        padding:10px;
      }

      /&#42;
        The transition styles can also be placed on the CSS base class above
      &#42;/
      .animate-if.ng-enter, .animate-if.ng-leave {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
      }

      .animate-if.ng-enter,
      .animate-if.ng-leave.ng-leave-active {
        opacity:0;
      }

      .animate-if.ng-leave,
      .animate-if.ng-enter.ng-enter-active {
        opacity:1;
      }
    </file>
  </example>
 */ var ngIfDirective = [
        "$animate",
        function($animate) {
            return {
                transclude: "element",
                priority: 600,
                terminal: !0,
                restrict: "A",
                $$tlb: !0,
                link: function($scope, $element, $attr, ctrl, $transclude) {
                    var block, childScope;
                    $scope.$watch($attr.ngIf, function(value) {
                        toBoolean(value) ? childScope || $transclude(childScope = $scope.$new(), function(clone) {
                            clone[clone.length++] = document1.createComment(" end ngIf: " + $attr.ngIf + " "), // Note: We only need the first/last node of the cloned nodes.
                            // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                            // by a directive with templateUrl when it's template arrives.
                            block = {
                                clone: clone
                            }, $animate.enter(clone, $element.parent(), $element);
                        }) : (childScope && (childScope.$destroy(), childScope = null), block && ($animate.leave(getBlockElements(block.clone)), block = null));
                    });
                }
            };
        }
    ], ngIncludeDirective = [
        "$http",
        "$templateCache",
        "$anchorScroll",
        "$animate",
        "$sce",
        function($http, $templateCache, $anchorScroll, $animate, $sce) {
            return {
                restrict: "ECA",
                priority: 400,
                terminal: !0,
                transclude: "element",
                controller: angular1.noop,
                compile: function(element, attr) {
                    var srcExp = attr.ngInclude || attr.src, onloadExp = attr.onload || "", autoScrollExp = attr.autoscroll;
                    return function(scope, $element, $attr, ctrl, $transclude) {
                        var currentScope, currentElement, changeCounter = 0, cleanupLastIncludeContent = function() {
                            currentScope && (currentScope.$destroy(), currentScope = null), currentElement && ($animate.leave(currentElement), currentElement = null);
                        };
                        scope.$watch($sce.parseAsResourceUrl(srcExp), function(src) {
                            var afterAnimation = function() {
                                isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp)) && $anchorScroll();
                            }, thisChangeId = ++changeCounter;
                            src ? ($http.get(src, {
                                cache: $templateCache
                            }).success(function(response) {
                                if (thisChangeId === changeCounter) {
                                    var newScope = scope.$new();
                                    ctrl.template = response;
                                    // Note: This will also link all children of ng-include that were contained in the original
                                    // html. If that content contains controllers, ... they could pollute/change the scope.
                                    // However, using ng-include on an element with additional content does not make sense...
                                    // Note: We can't remove them in the cloneAttchFn of $transclude as that
                                    // function is called before linking the content, which would apply child
                                    // directives to non existing elements.
                                    var clone = $transclude(newScope, function(clone) {
                                        cleanupLastIncludeContent(), $animate.enter(clone, null, $element, afterAnimation);
                                    });
                                    currentScope = newScope, currentElement = clone, currentScope.$emit("$includeContentLoaded"), scope.$eval(onloadExp);
                                }
                            }).error(function() {
                                thisChangeId === changeCounter && cleanupLastIncludeContent();
                            }), scope.$emit("$includeContentRequested")) : (cleanupLastIncludeContent(), ctrl.template = null);
                        });
                    };
                }
            };
        }
    ], ngIncludeFillContentDirective = [
        "$compile",
        function($compile) {
            return {
                restrict: "ECA",
                priority: -400,
                require: "ngInclude",
                link: function(scope, $element, $attr, ctrl) {
                    $element.html(ctrl.template), $compile($element.contents())(scope);
                }
            };
        }
    ], ngInitDirective = ngDirective({
        priority: 450,
        compile: function() {
            return {
                pre: function(scope, element, attrs) {
                    scope.$eval(attrs.ngInit);
                }
            };
        }
    }), ngNonBindableDirective = ngDirective({
        terminal: !0,
        priority: 1000
    }), ngPluralizeDirective = [
        "$locale",
        "$interpolate",
        function($locale, $interpolate) {
            var BRACE = /{}/g;
            return {
                restrict: "EA",
                link: function(scope, element, attr) {
                    var numberExp = attr.count, whenExp = attr.$attr.when && element.attr(attr.$attr.when), offset = attr.offset || 0, whens = scope.$eval(whenExp) || {}, whensExpFns = {}, startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), isWhen = /^when(Minus)?(.+)$/;
                    forEach(attr, function(expression, attributeName) {
                        isWhen.test(attributeName) && (whens[lowercase(attributeName.replace("when", "").replace("Minus", "-"))] = element.attr(attr.$attr[attributeName]));
                    }), forEach(whens, function(expression, key) {
                        whensExpFns[key] = $interpolate(expression.replace(BRACE, startSymbol + numberExp + "-" + offset + endSymbol));
                    }), scope.$watch(function() {
                        var value = parseFloat(scope.$eval(numberExp));
                        return isNaN(value) ? "" : (value in whens || (value = $locale.pluralCat(value - offset)), whensExpFns[value](scope, element, !0));
                    }, function(newVal) {
                        element.text(newVal);
                    });
                }
            };
        }
    ], ngRepeatDirective = [
        "$parse",
        "$animate",
        function($parse, $animate) {
            var NG_REMOVED = "$$NG_REMOVED", ngRepeatMinErr = minErr("ngRepeat");
            return {
                transclude: "element",
                priority: 1000,
                terminal: !0,
                $$tlb: !0,
                link: function($scope, $element, $attr, ctrl, $transclude) {
                    var trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn, lhs, rhs, valueIdentifier, keyIdentifier, expression = $attr.ngRepeat, match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/), hashFnLocals = {
                        $id: hashKey
                    };
                    if (!match) throw ngRepeatMinErr("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
                    if (lhs = match[1], rhs = match[2], (trackByExp = match[4]) ? (trackByExpGetter = $parse(trackByExp), trackByIdExpFn = function(key, value, index) {
                        return keyIdentifier && (hashFnLocals[keyIdentifier] = key), hashFnLocals[valueIdentifier] = value, hashFnLocals.$index = index, trackByExpGetter($scope, hashFnLocals);
                    }) : (trackByIdArrayFn = function(key, value) {
                        return hashKey(value);
                    }, trackByIdObjFn = function(key) {
                        return key;
                    }), !(match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/))) throw ngRepeatMinErr("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
                    valueIdentifier = match[3] || match[1], keyIdentifier = match[2];
                    // Store a list of elements from previous run. This is a hash where key is the item from the
                    // iterator, and the value is objects with following properties.
                    //   - scope: bound scope
                    //   - element: previous element.
                    //   - index: position
                    var lastBlockMap = {};
                    //watch props
                    $scope.$watchCollection(rhs, function(collection) {
                        var index, length, nextNode, arrayLength, childScope, key, value, trackById, trackByIdFn, collectionKeys, block, elementsToRemove, previousNode = $element[0], // Same as lastBlockMap but it has the current state. It will become the
                        // lastBlockMap on the next iteration.
                        nextBlockMap = {}, nextBlockOrder = [];
                        if (isArrayLike(collection)) collectionKeys = collection, trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                        else {
                            for(key in trackByIdFn = trackByIdExpFn || trackByIdObjFn, // if object, extract keys, sort them and use to determine order of iteration over obj props
                            collectionKeys = [], collection)collection.hasOwnProperty(key) && "$" != key.charAt(0) && collectionKeys.push(key);
                            collectionKeys.sort();
                        }
                        for(index = 0, arrayLength = collectionKeys.length, // locate existing items
                        length = nextBlockOrder.length = collectionKeys.length; index < length; index++)if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], assertNotHasOwnProperty(trackById = trackByIdFn(key, value, index), "`track by` id"), lastBlockMap.hasOwnProperty(trackById)) block = lastBlockMap[trackById], delete lastBlockMap[trackById], nextBlockMap[trackById] = block, nextBlockOrder[index] = block;
                        else if (nextBlockMap.hasOwnProperty(trackById)) // This is a duplicate and we need to throw an error
                        throw(// restore lastBlockMap
                        forEach(nextBlockOrder, function(block) {
                            block && block.scope && (lastBlockMap[block.id] = block);
                        }), ngRepeatMinErr("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}", expression, trackById));
                        else // new never before seen block
                        nextBlockOrder[index] = {
                            id: trackById
                        }, nextBlockMap[trackById] = !1;
                        // remove existing items
                        for(key in lastBlockMap)// lastBlockMap is our own object so we don't need to use special hasOwnPropertyFn
                        lastBlockMap.hasOwnProperty(key) && (elementsToRemove = getBlockElements((block = lastBlockMap[key]).clone), $animate.leave(elementsToRemove), forEach(elementsToRemove, function(element) {
                            element[NG_REMOVED] = !0;
                        }), block.scope.$destroy());
                        // we are not using forEach for perf reasons (trying to avoid #call)
                        for(index = 0, length = collectionKeys.length; index < length; index++){
                            if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], block = nextBlockOrder[index], nextBlockOrder[index - 1] && (previousNode = getBlockEnd(nextBlockOrder[index - 1])), block.scope) {
                                // if we have already seen this object, then we need to reuse the
                                // associated scope/element
                                childScope = block.scope, nextNode = previousNode;
                                do nextNode = nextNode.nextSibling;
                                while (nextNode && nextNode[NG_REMOVED])
                                block.clone[0] != nextNode && // existing item which got moved
                                $animate.move(getBlockElements(block.clone), null, jqLite(previousNode)), previousNode = getBlockEnd(block);
                            } else // new item which we don't know about
                            childScope = $scope.$new();
                            childScope[valueIdentifier] = value, keyIdentifier && (childScope[keyIdentifier] = key), childScope.$index = index, childScope.$first = 0 === index, childScope.$last = index === arrayLength - 1, childScope.$middle = !(childScope.$first || childScope.$last), // jshint bitwise: false
                            childScope.$odd = !(childScope.$even = (1 & index) == 0), block.scope || $transclude(childScope, function(clone) {
                                clone[clone.length++] = document1.createComment(" end ngRepeat: " + expression + " "), $animate.enter(clone, null, jqLite(previousNode)), previousNode = clone, block.scope = childScope, // Note: We only need the first/last node of the cloned nodes.
                                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                                // by a directive with templateUrl when it's template arrives.
                                block.clone = clone, nextBlockMap[block.id] = block;
                            });
                        }
                        lastBlockMap = nextBlockMap;
                    });
                }
            };
            function getBlockEnd(block) {
                return block.clone[block.clone.length - 1];
            }
        }
    ], ngShowDirective = [
        "$animate",
        function($animate) {
            return function(scope, element, attr) {
                scope.$watch(attr.ngShow, function(value) {
                    $animate[toBoolean(value) ? "removeClass" : "addClass"](element, "ng-hide");
                });
            };
        }
    ], ngHideDirective = [
        "$animate",
        function($animate) {
            return function(scope, element, attr) {
                scope.$watch(attr.ngHide, function(value) {
                    $animate[toBoolean(value) ? "addClass" : "removeClass"](element, "ng-hide");
                });
            };
        }
    ], ngStyleDirective = ngDirective(function(scope, element, attr) {
        scope.$watch(attr.ngStyle, function(newStyles, oldStyles) {
            oldStyles && newStyles !== oldStyles && forEach(oldStyles, function(val, style) {
                element.css(style, "");
            }), newStyles && element.css(newStyles);
        }, !0);
    }), ngSwitchDirective = [
        "$animate",
        function($animate) {
            return {
                restrict: "EA",
                require: "ngSwitch",
                // asks for $scope to fool the BC controller module
                controller: [
                    "$scope",
                    function() {
                        this.cases = {};
                    }
                ],
                link: function(scope, element, attr, ngSwitchController) {
                    var selectedTranscludes, selectedElements, watchExpr = attr.ngSwitch || attr.on, selectedScopes = [];
                    scope.$watch(watchExpr, function(value) {
                        for(var i = 0, ii = selectedScopes.length; i < ii; i++)selectedScopes[i].$destroy(), $animate.leave(selectedElements[i]);
                        selectedElements = [], selectedScopes = [], (selectedTranscludes = ngSwitchController.cases["!" + value] || ngSwitchController.cases["?"]) && (scope.$eval(attr.change), forEach(selectedTranscludes, function(selectedTransclude) {
                            var selectedScope = scope.$new();
                            selectedScopes.push(selectedScope), selectedTransclude.transclude(selectedScope, function(caseElement) {
                                var anchor = selectedTransclude.element;
                                selectedElements.push(caseElement), $animate.enter(caseElement, anchor.parent(), anchor);
                            });
                        }));
                    });
                }
            };
        }
    ], ngSwitchWhenDirective = ngDirective({
        transclude: "element",
        priority: 800,
        require: "^ngSwitch",
        compile: function(element, attrs) {
            return function(scope, element, attr, ctrl, $transclude) {
                ctrl.cases["!" + attrs.ngSwitchWhen] = ctrl.cases["!" + attrs.ngSwitchWhen] || [], ctrl.cases["!" + attrs.ngSwitchWhen].push({
                    transclude: $transclude,
                    element: element
                });
            };
        }
    }), ngSwitchDefaultDirective = ngDirective({
        transclude: "element",
        priority: 800,
        require: "^ngSwitch",
        link: function(scope, element, attr, ctrl, $transclude) {
            ctrl.cases["?"] = ctrl.cases["?"] || [], ctrl.cases["?"].push({
                transclude: $transclude,
                element: element
            });
        }
    }), ngTranscludeDirective = ngDirective({
        controller: [
            "$element",
            "$transclude",
            function($element, $transclude) {
                if (!$transclude) throw minErr("ngTransclude")("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", startingTag($element));
                // remember the transclusion fn but call it during linking so that we don't process transclusion before directives on
                // the parent element even when the transclusion replaces the current element. (we can't use priority here because
                // that applies only to compile fns and not controllers
                this.$transclude = $transclude;
            }
        ],
        link: function($scope, $element, $attrs, controller) {
            controller.$transclude(function(clone) {
                $element.empty(), $element.append(clone);
            });
        }
    }), scriptDirective = [
        "$templateCache",
        function($templateCache) {
            return {
                restrict: "E",
                terminal: !0,
                compile: function(element, attr) {
                    if ("text/ng-template" == attr.type) {
                        var templateUrl = attr.id, // IE is not consistent, in scripts we have to read .text but in other nodes we have to read .textContent
                        text = element[0].text;
                        $templateCache.put(templateUrl, text);
                    }
                }
            };
        }
    ], ngOptionsMinErr = minErr("ngOptions"), ngOptionsDirective = valueFn({
        terminal: !0
    }), selectDirective = [
        "$compile",
        "$parse",
        function($compile, $parse) {
            //0000111110000000000022220000000000000000000000333300000000000000444444444444444000000000555555555555555000000066666666666666600000000000000007777000000000000000000088888
            var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/, nullModelCtrl = {
                $setViewValue: noop
            };
            // jshint maxlen: 100
            return {
                restrict: "E",
                require: [
                    "select",
                    "?ngModel"
                ],
                controller: [
                    "$element",
                    "$scope",
                    "$attrs",
                    function($element, $scope, $attrs) {
                        var unknownOption, self = this, optionsMap = {}, ngModelCtrl = nullModelCtrl;
                        self.databound = $attrs.ngModel, self.init = function(ngModelCtrl_, nullOption_, unknownOption_) {
                            ngModelCtrl = ngModelCtrl_, unknownOption = unknownOption_;
                        }, self.addOption = function(value) {
                            assertNotHasOwnProperty(value, '"option value"'), optionsMap[value] = !0, ngModelCtrl.$viewValue == value && ($element.val(value), unknownOption.parent() && unknownOption.remove());
                        }, self.removeOption = function(value) {
                            this.hasOption(value) && (delete optionsMap[value], ngModelCtrl.$viewValue == value && this.renderUnknownOption(value));
                        }, self.renderUnknownOption = function(val) {
                            var unknownVal = "? " + hashKey(val) + " ?";
                            unknownOption.val(unknownVal), $element.prepend(unknownOption), $element.val(unknownVal), unknownOption.prop("selected", !0);
                        }, self.hasOption = function(value) {
                            return optionsMap.hasOwnProperty(value);
                        }, $scope.$on("$destroy", function() {
                            // disable unknown option so that we don't do work when the whole select is being destroyed
                            self.renderUnknownOption = noop;
                        });
                    }
                ],
                link: function(scope, element, attr, ctrls) {
                    // if ngModel is not defined, we don't need to do anything
                    if (ctrls[1]) {
                        // find "null" option
                        for(var scope1, selectElement, ctrl, lastView, scope2, selectElement1, ngModelCtrl, selectCtrl, emptyOption, selectCtrl1 = ctrls[0], ngModelCtrl1 = ctrls[1], multiple = attr.multiple, optionsExp = attr.ngOptions, nullOption = !1, // we can't just jqLite('<option>') since jqLite is not smart enough
                        // to create it in <select> and IE barfs otherwise.
                        optionTemplate = jqLite(document1.createElement("option")), optGroupTemplate = jqLite(document1.createElement("optgroup")), unknownOption = optionTemplate.clone(), i = 0, children = element.children(), ii = children.length; i < ii; i++)if ("" === children[i].value) {
                            emptyOption = nullOption = children.eq(i);
                            break;
                        }
                        // required validator
                        if (selectCtrl1.init(ngModelCtrl1, nullOption, unknownOption), multiple && (attr.required || attr.ngRequired)) {
                            var requiredValidator = function(value) {
                                return ngModelCtrl1.$setValidity("required", !attr.required || value && value.length), value;
                            };
                            ngModelCtrl1.$parsers.push(requiredValidator), ngModelCtrl1.$formatters.unshift(requiredValidator), attr.$observe("required", function() {
                                requiredValidator(ngModelCtrl1.$viewValue);
                            });
                        }
                        optionsExp ? function(scope, selectElement, ctrl) {
                            if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) throw ngOptionsMinErr("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", optionsExp, startingTag(selectElement));
                            var match, displayFn = $parse(match[2] || match[1]), valueName = match[4] || match[6], keyName = match[5], groupByFn = $parse(match[3] || ""), valueFn = $parse(match[2] ? match[1] : valueName), valuesFn = $parse(match[7]), trackFn = match[8] ? $parse(match[8]) : null, // This is an array of array of existing option groups in DOM.
                            // We try to reuse these if possible
                            // - optionGroupsCache[0] is the options with no option group
                            // - optionGroupsCache[?][0] is the parent: either the SELECT or OPTGROUP element
                            optionGroupsCache = [
                                [
                                    {
                                        element: selectElement,
                                        label: ""
                                    }
                                ]
                            ];
                            function render() {
                                // Temporary location for the option groups before we render them
                                var optionGroupName, optionGroup, option, existingParent, existingOptions, existingOption, key, groupLength, length, groupIndex, index, selected, lastElement, element, label, optionGroups = {
                                    "": []
                                }, optionGroupNames = [
                                    ""
                                ], modelValue = ctrl.$modelValue, values = valuesFn(scope) || [], keys = keyName ? sortedKeys(values) : values, locals = {}, selectedSet = !1;
                                if (multiple) {
                                    if (trackFn && isArray(modelValue)) {
                                        selectedSet = new HashMap([]);
                                        for(var trackIndex = 0; trackIndex < modelValue.length; trackIndex++)locals[valueName] = modelValue[trackIndex], selectedSet.put(trackFn(scope, locals), modelValue[trackIndex]);
                                    } else selectedSet = new HashMap(modelValue);
                                }
                                // We now build up the list of options we need (we merge later)
                                for(index = 0; index < (length = keys.length); index++){
                                    if (key = index, keyName) {
                                        if ("$" === (key = keys[index]).charAt(0)) continue;
                                        locals[keyName] = key;
                                    }
                                    if (locals[valueName] = values[key], (optionGroup = optionGroups[optionGroupName = groupByFn(scope, locals) || ""]) || (optionGroup = optionGroups[optionGroupName] = [], optionGroupNames.push(optionGroupName)), multiple) selected = isDefined(selectedSet.remove(trackFn ? trackFn(scope, locals) : valueFn(scope, locals)));
                                    else {
                                        if (trackFn) {
                                            var modelCast = {};
                                            modelCast[valueName] = modelValue, selected = trackFn(scope, modelCast) === trackFn(scope, locals);
                                        } else selected = modelValue === valueFn(scope, locals);
                                        selectedSet = selectedSet || selected; // see if at least one item is selected
                                    }
                                    // doing displayFn(scope, locals) || '' overwrites zero values
                                    label = isDefined(label = displayFn(scope, locals)) ? label : "", optionGroup.push({
                                        // either the index into array or key from object
                                        id: trackFn ? trackFn(scope, locals) : keyName ? keys[index] : index,
                                        label: label,
                                        selected: selected
                                    });
                                }
                                // Now we need to update the list of DOM nodes to match the optionGroups we computed above
                                for(multiple || (nullOption || null === modelValue ? // insert null option if we have a placeholder, or the model is null
                                optionGroups[""].unshift({
                                    id: "",
                                    label: "",
                                    selected: !selectedSet
                                }) : selectedSet || // option could not be found, we have to insert the undefined item
                                optionGroups[""].unshift({
                                    id: "?",
                                    label: "",
                                    selected: !0
                                })), groupIndex = 0, groupLength = optionGroupNames.length; groupIndex < groupLength; groupIndex++){
                                    for(// list of options for that group. (first item has the parent)
                                    optionGroup = optionGroups[// current option group name or '' if no group
                                    optionGroupName = optionGroupNames[groupIndex]], optionGroupsCache.length <= groupIndex ? (existingOptions = [
                                        // we need to grow the optionGroups
                                        existingParent = {
                                            element: optGroupTemplate.clone().attr("label", optionGroupName),
                                            label: optionGroup.label
                                        }
                                    ], optionGroupsCache.push(existingOptions), selectElement.append(existingParent.element)) : (existingParent = (existingOptions = optionGroupsCache[groupIndex])[0]).label != optionGroupName && existingParent.element.attr("label", existingParent.label = optionGroupName), lastElement = null, index = 0, length = optionGroup.length; index < length; index++)option = optionGroup[index], (existingOption = existingOptions[index + 1]) ? (// reuse elements
                                    lastElement = existingOption.element, existingOption.label !== option.label && lastElement.text(existingOption.label = option.label), existingOption.id !== option.id && lastElement.val(existingOption.id = option.id), lastElement[0].selected !== option.selected && lastElement.prop("selected", existingOption.selected = option.selected)) : ("" === option.id && nullOption ? // put back the pre-compiled element
                                    element = nullOption : // jQuery(v1.4.2) Bug: We should be able to chain the method calls, but
                                    // in this version of jQuery on some browser the .text() returns a string
                                    // rather then the element.
                                    (element = optionTemplate.clone()).val(option.id).attr("selected", option.selected).text(option.label), existingOptions.push(existingOption = {
                                        element: element,
                                        label: option.label,
                                        id: option.id,
                                        selected: option.selected
                                    }), lastElement ? lastElement.after(element) : existingParent.element.append(element), lastElement = element);
                                    for(// remove any excessive OPTIONs in a group
                                    index++; existingOptions.length > index;)existingOptions.pop().element.remove();
                                }
                                // remove any excessive OPTGROUPs from select
                                for(; optionGroupsCache.length > groupIndex;)optionGroupsCache.pop()[0].element.remove();
                            }
                            nullOption && (// compile the element since there might be bindings in it
                            $compile(nullOption)(scope), // remove the class, which is added automatically because we recompile the element and it
                            // becomes the compilation root
                            nullOption.removeClass("ng-scope"), // we need to remove it before calling selectElement.empty() because otherwise IE will
                            // remove the label from the element. wtf?
                            nullOption.remove()), // clear contents, we'll add what's needed based on the model
                            selectElement.empty(), selectElement.on("change", function() {
                                scope.$apply(function() {
                                    var optionGroup, key, value, optionElement, index, groupIndex, length, groupLength, trackIndex, collection = valuesFn(scope) || [], locals = {};
                                    if (multiple) {
                                        for(groupIndex = 0, value = [], groupLength = optionGroupsCache.length; groupIndex < groupLength; groupIndex++)for(index = 1, length = // list of options for that group. (first item has the parent)
                                        (optionGroup = optionGroupsCache[groupIndex]).length; index < length; index++)if ((optionElement = optionGroup[index].element)[0].selected) {
                                            if (key = optionElement.val(), keyName && (locals[keyName] = key), trackFn) for(trackIndex = 0; trackIndex < collection.length && (locals[valueName] = collection[trackIndex], trackFn(scope, locals) != key); trackIndex++);
                                            else locals[valueName] = collection[key];
                                            value.push(valueFn(scope, locals));
                                        }
                                    } else if ("?" == (key = selectElement.val())) value = undefined;
                                    else if ("" === key) value = null;
                                    else if (trackFn) {
                                        for(trackIndex = 0; trackIndex < collection.length; trackIndex++)if (locals[valueName] = collection[trackIndex], trackFn(scope, locals) == key) {
                                            value = valueFn(scope, locals);
                                            break;
                                        }
                                    } else locals[valueName] = collection[key], keyName && (locals[keyName] = key), value = valueFn(scope, locals);
                                    ctrl.$setViewValue(value);
                                });
                            }), ctrl.$render = render, // TODO(vojta): can't we optimize this ?
                            scope.$watch(render);
                        }(scope, element, ngModelCtrl1) : multiple ? (scope1 = scope, selectElement = element, (ctrl = ngModelCtrl1).$render = function() {
                            var items = new HashMap(ctrl.$viewValue);
                            forEach(selectElement.find("option"), function(option) {
                                option.selected = isDefined(items.get(option.value));
                            });
                        }, // we have to do it on each watch since ngModel watches reference, but
                        // we need to work of an array, so we need to see if anything was inserted/removed
                        scope1.$watch(function() {
                            equals(lastView, ctrl.$viewValue) || (lastView = copy(ctrl.$viewValue), ctrl.$render());
                        }), selectElement.on("change", function() {
                            scope1.$apply(function() {
                                var array = [];
                                forEach(selectElement.find("option"), function(option) {
                                    option.selected && array.push(option.value);
                                }), ctrl.$setViewValue(array);
                            });
                        })) : (scope2 = scope, selectElement1 = element, ngModelCtrl = ngModelCtrl1, selectCtrl = selectCtrl1, ngModelCtrl.$render = function() {
                            var viewValue = ngModelCtrl.$viewValue;
                            selectCtrl.hasOption(viewValue) ? (unknownOption.parent() && unknownOption.remove(), selectElement1.val(viewValue), "" === viewValue && emptyOption.prop("selected", !0)) : isUndefined(viewValue) && emptyOption ? selectElement1.val("") : selectCtrl.renderUnknownOption(viewValue);
                        }, selectElement1.on("change", function() {
                            scope2.$apply(function() {
                                unknownOption.parent() && unknownOption.remove(), ngModelCtrl.$setViewValue(selectElement1.val());
                            });
                        }));
                    }
                }
            };
        }
    ], optionDirective = [
        "$interpolate",
        function($interpolate) {
            var nullSelectCtrl = {
                addOption: noop,
                removeOption: noop
            };
            return {
                restrict: "E",
                priority: 100,
                compile: function(element, attr) {
                    if (isUndefined(attr.value)) {
                        var interpolateFn = $interpolate(element.text(), !0);
                        interpolateFn || attr.$set("value", element.text());
                    }
                    return function(scope, element, attr) {
                        var selectCtrlName = "$selectController", parent = element.parent(), selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName); // in case we are in optgroup
                        selectCtrl && selectCtrl.databound ? // For some reason Opera defaults to true and if not overridden this messes up the repeater.
                        // We don't want the view to drive the initialization of the model anyway.
                        element.prop("selected", !1) : selectCtrl = nullSelectCtrl, interpolateFn ? scope.$watch(interpolateFn, function(newVal, oldVal) {
                            attr.$set("value", newVal), newVal !== oldVal && selectCtrl.removeOption(oldVal), selectCtrl.addOption(newVal);
                        }) : selectCtrl.addOption(attr.value), element.on("$destroy", function() {
                            selectCtrl.removeOption(attr.value);
                        });
                    };
                }
            };
        }
    ], styleDirective = valueFn({
        restrict: "E",
        terminal: !0
    });
    // bind to jQuery if present;
    (jQuery = window1.jQuery) ? (jqLite = jQuery, extend(jQuery.fn, {
        scope: JQLitePrototype.scope,
        isolateScope: JQLitePrototype.isolateScope,
        controller: JQLitePrototype.controller,
        injector: JQLitePrototype.injector,
        inheritedData: JQLitePrototype.inheritedData
    }), // Method signature:
    //     jqLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments)
    jqLitePatchJQueryRemove("remove", !0, !0, !1), jqLitePatchJQueryRemove("empty", !1, !1, !1), jqLitePatchJQueryRemove("html", !1, !1, !0)) : jqLite = JQLite, angular1.element = jqLite, function(angular1) {
        extend(angular1, {
            bootstrap: bootstrap,
            copy: copy,
            extend: extend,
            equals: equals,
            element: jqLite,
            forEach: forEach,
            injector: createInjector,
            noop: noop,
            bind: bind,
            toJson: toJson,
            fromJson: fromJson,
            identity: identity,
            isUndefined: isUndefined,
            isDefined: isDefined,
            isString: isString,
            isFunction: isFunction,
            isObject: isObject,
            isNumber: isNumber,
            isElement: isElement,
            isArray: isArray,
            version: version,
            isDate: isDate,
            lowercase: lowercase,
            uppercase: uppercase,
            callbacks: {
                counter: 0
            },
            $$minErr: minErr,
            $$csp: csp
        }), angularModule = /**
   * @ngdoc interface
   * @name angular.Module
   * @description
   *
   * Interface for configuring angular {@link angular.module modules}.
   */ function(window1) {
            var $injectorMinErr = minErr("$injector"), ngMinErr = minErr("ng");
            function ensure(obj, name, factory) {
                return obj[name] || (obj[name] = factory());
            }
            var angular1 = ensure(window1, "angular", Object);
            return(// We need to expose `angular.$$minErr` to modules such as `ngResource` that reference it during bootstrap
            angular1.$$minErr = angular1.$$minErr || minErr, ensure(angular1, "module", function() {
                /** @type {Object.<string, angular.Module>} */ var modules = {};
                /**
       * @ngdoc function
       * @name angular.module
       * @description
       *
       * The `angular.module` is a global place for creating, registering and retrieving Angular
       * modules.
       * All modules (angular core or 3rd party) that should be available to an application must be
       * registered using this mechanism.
       *
       * When passed two or more arguments, a new module is created.  If passed only one argument, an
       * existing module (the name passed as the first argument to `module`) is retrieved.
       *
       *
       * # Module
       *
       * A module is a collection of services, directives, filters, and configuration information.
       * `angular.module` is used to configure the {@link AUTO.$injector $injector}.
       *
       * <pre>
       * // Create a new module
       * var myModule = angular.module('myModule', []);
       *
       * // register a new service
       * myModule.value('appName', 'MyCoolApp');
       *
       * // configure existing services inside initialization blocks.
       * myModule.config(function($locationProvider) {
       *   // Configure existing providers
       *   $locationProvider.hashPrefix('!');
       * });
       * </pre>
       *
       * Then you can create an injector and load your modules like this:
       *
       * <pre>
       * var injector = angular.injector(['ng', 'MyModule'])
       * </pre>
       *
       * However it's more likely that you'll just use
       * {@link ng.directive:ngApp ngApp} or
       * {@link angular.bootstrap} to simplify this process for you.
       *
       * @param {!string} name The name of the module to create or retrieve.
       * @param {Array.<string>=} requires If specified then new module is being created. If
       *        unspecified then the the module is being retrieved for further configuration.
       * @param {Function} configFn Optional configuration function for the module. Same as
       *        {@link angular.Module#methods_config Module#config()}.
       * @returns {module} new module with the {@link angular.Module} api.
       */ return function(name, requires, configFn) {
                    return function(name, context) {
                        if ("hasOwnProperty" === name) throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context);
                    }(name, "module"), requires && modules.hasOwnProperty(name) && (modules[name] = null), ensure(modules, name, function() {
                        if (!requires) throw $injectorMinErr("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", name);
                        /** @type {!Array.<Array.<*>>} */ var invokeQueue = [], runBlocks = [], config = invokeLater("$injector", "invoke"), moduleInstance = {
                            // Private state
                            _invokeQueue: invokeQueue,
                            _runBlocks: runBlocks,
                            /**
             * @ngdoc property
             * @name angular.Module#requires
             * @propertyOf angular.Module
             * @returns {Array.<string>} List of module names which must be loaded before this module.
             * @description
             * Holds the list of modules which the injector will load before the current module is
             * loaded.
             */ requires: requires,
                            /**
             * @ngdoc property
             * @name angular.Module#name
             * @propertyOf angular.Module
             * @returns {string} Name of the module.
             * @description
             */ name: name,
                            /**
             * @ngdoc method
             * @name angular.Module#provider
             * @methodOf angular.Module
             * @param {string} name service name
             * @param {Function} providerType Construction function for creating new instance of the
             *                                service.
             * @description
             * See {@link AUTO.$provide#provider $provide.provider()}.
             */ provider: invokeLater("$provide", "provider"),
                            /**
             * @ngdoc method
             * @name angular.Module#factory
             * @methodOf angular.Module
             * @param {string} name service name
             * @param {Function} providerFunction Function for creating new instance of the service.
             * @description
             * See {@link AUTO.$provide#factory $provide.factory()}.
             */ factory: invokeLater("$provide", "factory"),
                            /**
             * @ngdoc method
             * @name angular.Module#service
             * @methodOf angular.Module
             * @param {string} name service name
             * @param {Function} constructor A constructor function that will be instantiated.
             * @description
             * See {@link AUTO.$provide#service $provide.service()}.
             */ service: invokeLater("$provide", "service"),
                            /**
             * @ngdoc method
             * @name angular.Module#value
             * @methodOf angular.Module
             * @param {string} name service name
             * @param {*} object Service instance object.
             * @description
             * See {@link AUTO.$provide#value $provide.value()}.
             */ value: invokeLater("$provide", "value"),
                            /**
             * @ngdoc method
             * @name angular.Module#constant
             * @methodOf angular.Module
             * @param {string} name constant name
             * @param {*} object Constant value.
             * @description
             * Because the constant are fixed, they get applied before other provide methods.
             * See {@link AUTO.$provide#constant $provide.constant()}.
             */ constant: invokeLater("$provide", "constant", "unshift"),
                            /**
             * @ngdoc method
             * @name angular.Module#animation
             * @methodOf angular.Module
             * @param {string} name animation name
             * @param {Function} animationFactory Factory function for creating new instance of an
             *                                    animation.
             * @description
             *
             * **NOTE**: animations take effect only if the **ngAnimate** module is loaded.
             *
             *
             * Defines an animation hook that can be later used with
             * {@link ngAnimate.$animate $animate} service and directives that use this service.
             *
             * <pre>
             * module.animation('.animation-name', function($inject1, $inject2) {
             *   return {
             *     eventName : function(element, done) {
             *       //code to run the animation
             *       //once complete, then run done()
             *       return function cancellationFunction(element) {
             *         //code to cancel the animation
             *       }
             *     }
             *   }
             * })
             * </pre>
             *
             * See {@link ngAnimate.$animateProvider#register $animateProvider.register()} and
             * {@link ngAnimate ngAnimate module} for more information.
             */ animation: invokeLater("$animateProvider", "register"),
                            /**
             * @ngdoc method
             * @name angular.Module#filter
             * @methodOf angular.Module
             * @param {string} name Filter name.
             * @param {Function} filterFactory Factory function for creating new instance of filter.
             * @description
             * See {@link ng.$filterProvider#register $filterProvider.register()}.
             */ filter: invokeLater("$filterProvider", "register"),
                            /**
             * @ngdoc method
             * @name angular.Module#controller
             * @methodOf angular.Module
             * @param {string|Object} name Controller name, or an object map of controllers where the
             *    keys are the names and the values are the constructors.
             * @param {Function} constructor Controller constructor function.
             * @description
             * See {@link ng.$controllerProvider#register $controllerProvider.register()}.
             */ controller: invokeLater("$controllerProvider", "register"),
                            /**
             * @ngdoc method
             * @name angular.Module#directive
             * @methodOf angular.Module
             * @param {string|Object} name Directive name, or an object map of directives where the
             *    keys are the names and the values are the factories.
             * @param {Function} directiveFactory Factory function for creating new instance of
             * directives.
             * @description
             * See {@link ng.$compileProvider#methods_directive $compileProvider.directive()}.
             */ directive: invokeLater("$compileProvider", "directive"),
                            /**
             * @ngdoc method
             * @name angular.Module#config
             * @methodOf angular.Module
             * @param {Function} configFn Execute this function on module load. Useful for service
             *    configuration.
             * @description
             * Use this method to register work which needs to be performed on module loading.
             */ config: config,
                            /**
             * @ngdoc method
             * @name angular.Module#run
             * @methodOf angular.Module
             * @param {Function} initializationFn Execute this function after injector creation.
             *    Useful for application initialization.
             * @description
             * Use this method to register work which should be performed when the injector is done
             * loading all modules.
             */ run: function(block) {
                                return runBlocks.push(block), this;
                            }
                        };
                        return configFn && config(configFn), moduleInstance;
                        /**
           * @param {string} provider
           * @param {string} method
           * @param {String=} insertMethod
           * @returns {angular.Module}
           */ function invokeLater(provider, method, insertMethod) {
                            return function() {
                                return invokeQueue[insertMethod || "push"]([
                                    provider,
                                    method,
                                    arguments
                                ]), moduleInstance;
                            };
                        }
                    });
                };
            }));
        }(window1);
        try {
            angularModule("ngLocale");
        } catch (e) {
            angularModule("ngLocale", []).provider("$locale", $LocaleProvider);
        }
        angularModule("ng", [
            "ngLocale"
        ], [
            "$provide",
            function($provide) {
                // $$sanitizeUriProvider needs to be before $compileProvider as it is used by it.
                $provide.provider({
                    $$sanitizeUri: $$SanitizeUriProvider
                }), $provide.provider("$compile", $CompileProvider).directive({
                    a: htmlAnchorDirective,
                    input: inputDirective,
                    textarea: inputDirective,
                    form: formDirective,
                    script: scriptDirective,
                    select: selectDirective,
                    style: styleDirective,
                    option: optionDirective,
                    ngBind: ngBindDirective,
                    ngBindHtml: ngBindHtmlDirective,
                    ngBindTemplate: ngBindTemplateDirective,
                    ngClass: ngClassDirective,
                    ngClassEven: ngClassEvenDirective,
                    ngClassOdd: ngClassOddDirective,
                    ngCloak: ngCloakDirective,
                    ngController: ngControllerDirective,
                    ngForm: ngFormDirective,
                    ngHide: ngHideDirective,
                    ngIf: ngIfDirective,
                    ngInclude: ngIncludeDirective,
                    ngInit: ngInitDirective,
                    ngNonBindable: ngNonBindableDirective,
                    ngPluralize: ngPluralizeDirective,
                    ngRepeat: ngRepeatDirective,
                    ngShow: ngShowDirective,
                    ngStyle: ngStyleDirective,
                    ngSwitch: ngSwitchDirective,
                    ngSwitchWhen: ngSwitchWhenDirective,
                    ngSwitchDefault: ngSwitchDefaultDirective,
                    ngOptions: ngOptionsDirective,
                    ngTransclude: ngTranscludeDirective,
                    ngModel: ngModelDirective,
                    ngList: ngListDirective,
                    ngChange: ngChangeDirective,
                    required: requiredDirective,
                    ngRequired: requiredDirective,
                    ngValue: ngValueDirective
                }).directive({
                    ngInclude: ngIncludeFillContentDirective
                }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives), $provide.provider({
                    $anchorScroll: $AnchorScrollProvider,
                    $animate: $AnimateProvider,
                    $browser: $BrowserProvider,
                    $cacheFactory: $CacheFactoryProvider,
                    $controller: $ControllerProvider,
                    $document: $DocumentProvider,
                    $exceptionHandler: $ExceptionHandlerProvider,
                    $filter: $FilterProvider,
                    $interpolate: $InterpolateProvider,
                    $interval: $IntervalProvider,
                    $http: $HttpProvider,
                    $httpBackend: $HttpBackendProvider,
                    $location: $LocationProvider,
                    $log: $LogProvider,
                    $parse: $ParseProvider,
                    $rootScope: $RootScopeProvider,
                    $q: $QProvider,
                    $sce: $SceProvider,
                    $sceDelegate: $SceDelegateProvider,
                    $sniffer: $SnifferProvider,
                    $templateCache: $TemplateCacheProvider,
                    $timeout: $TimeoutProvider,
                    $window: $WindowProvider
                });
            }
        ]);
    }(angular1), jqLite(document1).ready(function() {
        !/**
 * @ngdoc directive
 * @name ng.directive:ngApp
 *
 * @element ANY
 * @param {angular.Module} ngApp an optional application
 *   {@link angular.module module} name to load.
 *
 * @description
 *
 * Use this directive to **auto-bootstrap** an AngularJS application. The `ngApp` directive
 * designates the **root element** of the application and is typically placed near the root element
 * of the page - e.g. on the `<body>` or `<html>` tags.
 *
 * Only one AngularJS application can be auto-bootstrapped per HTML document. The first `ngApp`
 * found in the document will be used to define the root element to auto-bootstrap as an
 * application. To run multiple applications in an HTML document you must manually bootstrap them using
 * {@link angular.bootstrap} instead. AngularJS applications cannot be nested within each other.
 *
 * You can specify an **AngularJS module** to be used as the root module for the application.  This
 * module will be loaded into the {@link AUTO.$injector} when the application is bootstrapped and
 * should contain the application code needed or have dependencies on other modules that will
 * contain the code. See {@link angular.module} for more information.
 *
 * In the example below if the `ngApp` directive were not placed on the `html` element then the
 * document would not be compiled, the `AppController` would not be instantiated and the `{{ a+b }}`
 * would not be resolved to `3`.
 *
 * `ngApp` is the easiest, and most common, way to bootstrap an application.
 *
 <example module="ngAppDemo">
   <file name="index.html">
   <div ng-controller="ngAppDemoController">
     I can add: {{a}} + {{b}} =  {{ a+b }}
   </file>
   <file name="script.js">
   angular.module('ngAppDemo', []).controller('ngAppDemoController', function($scope) {
     $scope.a = 1;
     $scope.b = 2;
   });
   </file>
 </example>
 *
 */ function(element, bootstrap) {
            var appElement, module, elements = [
                element
            ], names = [
                "ng:app",
                "ng-app",
                "x-ng-app",
                "data-ng-app"
            ], NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
            function append(element) {
                element && elements.push(element);
            }
            forEach(names, function(name) {
                names[name] = !0, append(document1.getElementById(name)), name = name.replace(":", "\\:"), element.querySelectorAll && (forEach(element.querySelectorAll("." + name), append), forEach(element.querySelectorAll("." + name + "\\:"), append), forEach(element.querySelectorAll("[" + name + "]"), append));
            }), forEach(elements, function(element) {
                if (!appElement) {
                    var className = " " + element.className + " ", match = NG_APP_CLASS_REGEXP.exec(className);
                    match ? (appElement = element, module = (match[2] || "").replace(/\s+/g, ",")) : forEach(element.attributes, function(attr) {
                        !appElement && names[attr.name] && (appElement = element, module = attr.value);
                    });
                }
            }), appElement && bootstrap(appElement, module ? [
                module
            ] : []);
        }(document1, bootstrap);
    });
}(window, document), angular.$$csp() || angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-start{border-spacing:1px 1px;-ms-zoom:1.0001;}.ng-animate-active{border-spacing:0px 0px;-ms-zoom:1;}</style>');
