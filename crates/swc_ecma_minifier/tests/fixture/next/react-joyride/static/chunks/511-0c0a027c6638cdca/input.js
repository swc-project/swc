(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[511], {

/***/ 9996:
/***/ (function (module) {

      "use strict";


      var isMergeableObject = function isMergeableObject(value) {
        return isNonNullObject(value)
          && !isSpecial(value)
      };

      function isNonNullObject(value) {
        return !!value && typeof value === 'object'
      }

      function isSpecial(value) {
        var stringValue = Object.prototype.toString.call(value);

        return stringValue === '[object RegExp]'
          || stringValue === '[object Date]'
          || isReactElement(value)
      }

      // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
      var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
      var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

      function isReactElement(value) {
        return value.$$typeof === REACT_ELEMENT_TYPE
      }

      function emptyTarget(val) {
        return Array.isArray(val) ? [] : {}
      }

      function cloneUnlessOtherwiseSpecified(value, options) {
        return (options.clone !== false && options.isMergeableObject(value))
          ? deepmerge(emptyTarget(value), value, options)
          : value
      }

      function defaultArrayMerge(target, source, options) {
        return target.concat(source).map(function (element) {
          return cloneUnlessOtherwiseSpecified(element, options)
        })
      }

      function getMergeFunction(key, options) {
        if (!options.customMerge) {
          return deepmerge
        }
        var customMerge = options.customMerge(key);
        return typeof customMerge === 'function' ? customMerge : deepmerge
      }

      function getEnumerableOwnPropertySymbols(target) {
        return Object.getOwnPropertySymbols
          ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
            return target.propertyIsEnumerable(symbol)
          })
          : []
      }

      function getKeys(target) {
        return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
      }

      function propertyIsOnObject(object, property) {
        try {
          return property in object
        } catch (_) {
          return false
        }
      }

      // Protects from prototype poisoning and unexpected merging up the prototype chain.
      function propertyIsUnsafe(target, key) {
        return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
          && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
            && Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
      }

      function mergeObject(target, source, options) {
        var destination = {};
        if (options.isMergeableObject(target)) {
          getKeys(target).forEach(function (key) {
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
          });
        }
        getKeys(source).forEach(function (key) {
          if (propertyIsUnsafe(target, key)) {
            return
          }

          if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
          } else {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
          }
        });
        return destination
      }

      function deepmerge(target, source, options) {
        options = options || {};
        options.arrayMerge = options.arrayMerge || defaultArrayMerge;
        options.isMergeableObject = options.isMergeableObject || isMergeableObject;
        // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
        // implementations can use it. The caller may not replace it.
        options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

        var sourceIsArray = Array.isArray(source);
        var targetIsArray = Array.isArray(target);
        var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

        if (!sourceAndTargetTypesMatch) {
          return cloneUnlessOtherwiseSpecified(source, options)
        } else if (sourceIsArray) {
          return options.arrayMerge(target, source, options)
        } else {
          return mergeObject(target, source, options)
        }
      }

      deepmerge.all = function deepmergeAll(array, options) {
        if (!Array.isArray(array)) {
          throw new Error('first argument should be an array')
        }

        return array.reduce(function (prev, next) {
          return deepmerge(prev, next, options)
        }, {})
      };

      var deepmerge_1 = deepmerge;

      module.exports = deepmerge_1;


      /***/
    }),

/***/ 8875:
/***/ (function (module, exports, __webpack_require__) {

      var __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/
      /* global define */

      (function () {
        'use strict';

        var canUseDOM = !!(
          typeof window !== 'undefined' &&
          window.document &&
          window.document.createElement
        );

        var ExecutionEnvironment = {

          canUseDOM: canUseDOM,

          canUseWorkers: typeof Worker !== 'undefined',

          canUseEventListeners:
            canUseDOM && !!(window.addEventListener || window.attachEvent),

          canUseViewport: canUseDOM && !!window.screen

        };

        if (true) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return ExecutionEnvironment;
          }).call(exports, __webpack_require__, exports, module),
            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else { }

      }());


      /***/
    }),

/***/ 2703:
/***/ (function (module, __unused_webpack_exports, __webpack_require__) {

      "use strict";
      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */



      var ReactPropTypesSecret = __webpack_require__(414);

      function emptyFunction() { }
      function emptyFunctionWithReset() { }
      emptyFunctionWithReset.resetWarningCache = emptyFunction;

      module.exports = function () {
        function shim(props, propName, componentName, location, propFullName, secret) {
          if (secret === ReactPropTypesSecret) {
            // It is still safe when called from React.
            return;
          }
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use PropTypes.checkPropTypes() to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        };
        shim.isRequired = shim;
        function getShim() {
          return shim;
        };
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
          resetWarningCache: emptyFunction
        };

        ReactPropTypes.PropTypes = ReactPropTypes;

        return ReactPropTypes;
      };


      /***/
    }),

/***/ 5697:
/***/ (function (module, __unused_webpack_exports, __webpack_require__) {

      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      if (false) { var throwOnDirectAccess, ReactIs; } else {
        // By explicitly using `prop-types` you are opting into new production behavior.
        // http://fb.me/prop-types-in-prod
        module.exports = __webpack_require__(2703)();
      }


      /***/
    }),

/***/ 414:
/***/ (function (module) {

      "use strict";
      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */



      var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

      module.exports = ReactPropTypesSecret;


      /***/
    }),

/***/ 9921:
/***/ (function (__unused_webpack_module, exports) {

      "use strict";
      var __webpack_unused_export__;
      /** @license React v16.13.1
       * react-is.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      var b = "function" === typeof Symbol && Symbol.for, c = b ? Symbol.for("react.element") : 60103, d = b ? Symbol.for("react.portal") : 60106, e = b ? Symbol.for("react.fragment") : 60107, f = b ? Symbol.for("react.strict_mode") : 60108, g = b ? Symbol.for("react.profiler") : 60114, h = b ? Symbol.for("react.provider") : 60109, k = b ? Symbol.for("react.context") : 60110, l = b ? Symbol.for("react.async_mode") : 60111, m = b ? Symbol.for("react.concurrent_mode") : 60111, n = b ? Symbol.for("react.forward_ref") : 60112, p = b ? Symbol.for("react.suspense") : 60113, q = b ?
        Symbol.for("react.suspense_list") : 60120, r = b ? Symbol.for("react.memo") : 60115, t = b ? Symbol.for("react.lazy") : 60116, v = b ? Symbol.for("react.block") : 60121, w = b ? Symbol.for("react.fundamental") : 60117, x = b ? Symbol.for("react.responder") : 60118, y = b ? Symbol.for("react.scope") : 60119;
      function z(a) { if ("object" === typeof a && null !== a) { var u = a.$$typeof; switch (u) { case c: switch (a = a.type, a) { case l: case m: case e: case g: case f: case p: return a; default: switch (a = a && a.$$typeof, a) { case k: case n: case t: case r: case h: return a; default: return u } }case d: return u } } } function A(a) { return z(a) === m } __webpack_unused_export__ = l; __webpack_unused_export__ = m; __webpack_unused_export__ = k; __webpack_unused_export__ = h; exports.Element = c; exports.ForwardRef = n; __webpack_unused_export__ = e; __webpack_unused_export__ = t; __webpack_unused_export__ = r; __webpack_unused_export__ = d;
      __webpack_unused_export__ = g; __webpack_unused_export__ = f; __webpack_unused_export__ = p; __webpack_unused_export__ = function (a) { return A(a) || z(a) === l }; __webpack_unused_export__ = A; __webpack_unused_export__ = function (a) { return z(a) === k }; __webpack_unused_export__ = function (a) { return z(a) === h }; __webpack_unused_export__ = function (a) { return "object" === typeof a && null !== a && a.$$typeof === c }; __webpack_unused_export__ = function (a) { return z(a) === n }; __webpack_unused_export__ = function (a) { return z(a) === e }; __webpack_unused_export__ = function (a) { return z(a) === t };
      __webpack_unused_export__ = function (a) { return z(a) === r }; __webpack_unused_export__ = function (a) { return z(a) === d }; __webpack_unused_export__ = function (a) { return z(a) === g }; __webpack_unused_export__ = function (a) { return z(a) === f }; __webpack_unused_export__ = function (a) { return z(a) === p };
      exports.isValidElementType = function (a) { return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v) }; exports.typeOf = z;


      /***/
    }),

/***/ 9864:
/***/ (function (module, __unused_webpack_exports, __webpack_require__) {

      "use strict";


      if (true) {
        module.exports = __webpack_require__(9921);
      } else { }


      /***/
    }),

/***/ 5511:
/***/ (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {

      "use strict";

      // EXPORTS
      __webpack_require__.d(__webpack_exports__, {
        "ZP": function () { return /* binding */ Joyride; }
      });

      // UNUSED EXPORTS: ACTIONS, EVENTS, LIFECYCLE, STATUS

      // EXTERNAL MODULE: ./node_modules/react/index.js
      var react = __webpack_require__(7294);
      ;// CONCATENATED MODULE: ./node_modules/@gilbarbara/deep-equal/esm/helpers.js
      // eslint-disable-next-line @typescript-eslint/ban-types
      function isOfType(type) {
        return function (value) { return typeof value === type; };
      }
      // eslint-disable-next-line @typescript-eslint/ban-types
      var isFunction = isOfType('function');
      var isNull = function (value) {
        return value === null;
      };
      var isRegex = function (value) {
        return Object.prototype.toString.call(value).slice(8, -1) === 'RegExp';
      };
      var isObject = function (value) {
        return !isUndefined(value) && !isNull(value) && (isFunction(value) || typeof value === 'object');
      };
      var isUndefined = isOfType('undefined');
      //# sourceMappingURL=helpers.js.map
      ;// CONCATENATED MODULE: ./node_modules/@gilbarbara/deep-equal/esm/index.js
      var __values = (undefined && undefined.__values) || function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
          next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
      };

      function equalArray(left, right) {
        var length = left.length;
        if (length !== right.length) {
          return false;
        }
        for (var index = length; index-- !== 0;) {
          if (!equal(left[index], right[index])) {
            return false;
          }
        }
        return true;
      }
      function equalArrayBuffer(left, right) {
        if (left.byteLength !== right.byteLength) {
          return false;
        }
        var view1 = new DataView(left.buffer);
        var view2 = new DataView(right.buffer);
        var index = left.byteLength;
        while (index--) {
          if (view1.getUint8(index) !== view2.getUint8(index)) {
            return false;
          }
        }
        return true;
      }
      function equalMap(left, right) {
        var e_1, _a, e_2, _b;
        if (left.size !== right.size) {
          return false;
        }
        try {
          for (var _c = __values(left.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var index = _d.value;
            if (!right.has(index[0])) {
              return false;
            }
          }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
          try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
          }
          finally { if (e_1) throw e_1.error; }
        }
        try {
          for (var _e = __values(left.entries()), _f = _e.next(); !_f.done; _f = _e.next()) {
            var index = _f.value;
            if (!equal(index[1], right.get(index[0]))) {
              return false;
            }
          }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
          try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
          }
          finally { if (e_2) throw e_2.error; }
        }
        return true;
      }
      function equalSet(left, right) {
        var e_3, _a;
        if (left.size !== right.size) {
          return false;
        }
        try {
          for (var _b = __values(left.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var index = _c.value;
            if (!right.has(index[0])) {
              return false;
            }
          }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          }
          finally { if (e_3) throw e_3.error; }
        }
        return true;
      }
      function equal(left, right) {
        if (left === right) {
          return true;
        }
        if (left && isObject(left) && right && isObject(right)) {
          if (left.constructor !== right.constructor) {
            return false;
          }
          if (Array.isArray(left) && Array.isArray(right)) {
            return equalArray(left, right);
          }
          if (left instanceof Map && right instanceof Map) {
            return equalMap(left, right);
          }
          if (left instanceof Set && right instanceof Set) {
            return equalSet(left, right);
          }
          if (ArrayBuffer.isView(left) && ArrayBuffer.isView(right)) {
            return equalArrayBuffer(left, right);
          }
          if (isRegex(left) && isRegex(right)) {
            return left.source === right.source && left.flags === right.flags;
          }
          if (left.valueOf !== Object.prototype.valueOf) {
            return left.valueOf() === right.valueOf();
          }
          if (left.toString !== Object.prototype.toString) {
            return left.toString() === right.toString();
          }
          var leftKeys = Object.keys(left);
          var rightKeys = Object.keys(right);
          if (leftKeys.length !== rightKeys.length) {
            return false;
          }
          for (var index = leftKeys.length; index-- !== 0;) {
            if (!Object.prototype.hasOwnProperty.call(right, leftKeys[index])) {
              return false;
            }
          }
          for (var index = leftKeys.length; index-- !== 0;) {
            var key = leftKeys[index];
            if (key === '_owner' && left.$$typeof) {
              // React-specific: avoid traversing React elements' _owner.
              //  _owner contains circular references
              // and is not needed when comparing the actual elements (and not their owners)
              // eslint-disable-next-line no-continue
              continue;
            }
            if (!equal(left[key], right[key])) {
              return false;
            }
          }
          return true;
        }
        if (Number.isNaN(left) && Number.isNaN(right)) {
          return true;
        }
        return left === right;
      }
      //# sourceMappingURL=index.js.map
      ;// CONCATENATED MODULE: ./node_modules/is-lite/esm/index.js
      var DOM_PROPERTIES_TO_CHECK = [
        'innerHTML',
        'ownerDocument',
        'style',
        'attributes',
        'nodeValue',
      ];
      var objectTypes = [
        'Array',
        'ArrayBuffer',
        'AsyncFunction',
        'AsyncGenerator',
        'AsyncGeneratorFunction',
        'Date',
        'Error',
        'Function',
        'Generator',
        'GeneratorFunction',
        'HTMLElement',
        'Map',
        'Object',
        'Promise',
        'RegExp',
        'Set',
        'WeakMap',
        'WeakSet',
      ];
      var primitiveTypes = [
        'bigint',
        'boolean',
        'null',
        'number',
        'string',
        'symbol',
        'undefined',
      ];
      function getObjectType(value) {
        var objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
        if (/HTML\w+Element/.test(objectTypeName)) {
          return 'HTMLElement';
        }
        if (isObjectType(objectTypeName)) {
          return objectTypeName;
        }
        return undefined;
      }
      function isObjectOfType(type) {
        return function (value) { return getObjectType(value) === type; };
      }
      function isObjectType(name) {
        return objectTypes.includes(name);
      }
      // eslint-disable-next-line @typescript-eslint/ban-types
      function esm_isOfType(type) {
        return function (value) { return typeof value === type; };
      }
      function isPrimitiveType(name) {
        return primitiveTypes.includes(name);
      }
      function is(value) {
        if (value === null) {
          return 'null';
        }
        switch (typeof value) {
          case 'bigint':
            return 'bigint';
          case 'boolean':
            return 'boolean';
          case 'number':
            return 'number';
          case 'string':
            return 'string';
          case 'symbol':
            return 'symbol';
          case 'undefined':
            return 'undefined';
          default:
        }
        if (is.array(value)) {
          return 'Array';
        }
        if (is.plainFunction(value)) {
          return 'Function';
        }
        var tagType = getObjectType(value);
        /* istanbul ignore else */
        if (tagType) {
          return tagType;
        }
        /* istanbul ignore next */
        return 'Object';
      }
      is.array = Array.isArray;
      is.arrayOf = function (target, predicate) {
        if (!is.array(target) && !is.function(predicate)) {
          return false;
        }
        return target.every(function (d) { return predicate(d); });
      };
      is.asyncGeneratorFunction = function (value) {
        return getObjectType(value) === 'AsyncGeneratorFunction';
      };
      // eslint-disable-next-line @typescript-eslint/ban-types
      is.asyncFunction = isObjectOfType('AsyncFunction');
      is.bigint = esm_isOfType('bigint');
      is.boolean = function (value) {
        return value === true || value === false;
      };
      is.date = isObjectOfType('Date');
      is.defined = function (value) { return !is.undefined(value); };
      is.domElement = function (value) {
        return (is.object(value) &&
          !is.plainObject(value) &&
          value.nodeType === 1 &&
          is.string(value.nodeName) &&
          DOM_PROPERTIES_TO_CHECK.every(function (property) { return property in value; }));
      };
      is.empty = function (value) {
        return ((is.string(value) && value.length === 0) ||
          (is.array(value) && value.length === 0) ||
          (is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0) ||
          (is.set(value) && value.size === 0) ||
          (is.map(value) && value.size === 0));
      };
      is.error = isObjectOfType('Error');
      // eslint-disable-next-line @typescript-eslint/ban-types
      is.function = esm_isOfType('function');
      is.generator = function (value) {
        return (is.iterable(value) &&
          is.function(value.next) &&
          is.function(value.throw));
      };
      is.generatorFunction = isObjectOfType('GeneratorFunction');
      is.instanceOf = function (instance, class_) {
        if (!instance || !class_) {
          return false;
        }
        return Object.getPrototypeOf(instance) === class_.prototype;
      };
      is.iterable = function (value) {
        return (!is.nullOrUndefined(value) && is.function(value[Symbol.iterator]));
      };
      is.map = isObjectOfType('Map');
      is.nan = function (value) {
        return Number.isNaN(value);
      };
      is.null = function (value) {
        return value === null;
      };
      is.nullOrUndefined = function (value) {
        return is.null(value) || is.undefined(value);
      };
      is.number = function (value) {
        return esm_isOfType('number')(value) && !is.nan(value);
      };
      is.numericString = function (value) {
        return is.string(value) && value.length > 0 && !Number.isNaN(Number(value));
      };
      // eslint-disable-next-line @typescript-eslint/ban-types
      is.object = function (value) {
        return !is.nullOrUndefined(value) && (is.function(value) || typeof value === 'object');
      };
      is.oneOf = function (target, value) {
        if (!is.array(target)) {
          return false;
        }
        // eslint-disable-next-line unicorn/prefer-includes
        return target.indexOf(value) > -1;
      };
      // eslint-disable-next-line @typescript-eslint/ban-types
      is.plainFunction = isObjectOfType('Function');
      is.plainObject = function (value) {
        if (getObjectType(value) !== 'Object') {
          return false;
        }
        var prototype = Object.getPrototypeOf(value);
        return prototype === null || prototype === Object.getPrototypeOf({});
      };
      is.primitive = function (value) {
        return is.null(value) || isPrimitiveType(typeof value);
      };
      is.promise = isObjectOfType('Promise');
      is.propertyOf = function (target, key, predicate) {
        if (!is.object(target) || !key) {
          return false;
        }
        var value = target[key];
        if (is.function(predicate)) {
          return predicate(value);
        }
        return is.defined(value);
      };
      is.regexp = isObjectOfType('RegExp');
      is.set = isObjectOfType('Set');
      is.string = esm_isOfType('string');
      is.symbol = esm_isOfType('symbol');
      is.undefined = esm_isOfType('undefined');
      is.weakMap = isObjectOfType('WeakMap');
      is.weakSet = isObjectOfType('WeakSet');

/* harmony default export */ var esm = (is);
      //# sourceMappingURL=index.js.map
      ;// CONCATENATED MODULE: ./node_modules/tree-changes/esm/helpers.js


      function canHaveLength() {
        var arguments_ = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          arguments_[_i] = arguments[_i];
        }
        return arguments_.every(function (d) { return esm.string(d) || esm.array(d) || esm.plainObject(d); });
      }
      function checkEquality(left, right, value) {
        if (!isSameType(left, right)) {
          return false;
        }
        if ([left, right].every(esm.array)) {
          return !left.some(hasValue(value)) && right.some(hasValue(value));
        }
        /* istanbul ignore else */
        if ([left, right].every(esm.plainObject)) {
          return (!Object.entries(left).some(hasEntry(value)) && Object.entries(right).some(hasEntry(value)));
        }
        return right === value;
      }
      function compareNumbers(previousData, data, options) {
        var actual = options.actual, key = options.key, previous = options.previous, type = options.type;
        var left = nested(previousData, key);
        var right = nested(data, key);
        var changed = [left, right].every(esm.number) && (type === 'increased' ? left < right : left > right);
        if (!esm.undefined(actual)) {
          changed = changed && right === actual;
        }
        if (!esm.undefined(previous)) {
          changed = changed && left === previous;
        }
        return changed;
      }
      function compareValues(previousData, data, options) {
        var key = options.key, type = options.type, value = options.value;
        var left = nested(previousData, key);
        var right = nested(data, key);
        var primary = type === 'added' ? left : right;
        var secondary = type === 'added' ? right : left;
        // console.log({ primary, secondary });
        if (!esm.nullOrUndefined(value)) {
          if (esm.defined(primary)) {
            // check if nested data matches
            if (esm.array(primary) || esm.plainObject(primary)) {
              return checkEquality(primary, secondary, value);
            }
          }
          else {
            return equal(secondary, value);
          }
          return false;
        }
        if ([left, right].every(esm.array)) {
          return !secondary.every(isEqualPredicate(primary));
        }
        if ([left, right].every(esm.plainObject)) {
          return hasExtraKeys(Object.keys(primary), Object.keys(secondary));
        }
        return (![left, right].every(function (d) { return esm.primitive(d) && esm.defined(d); }) &&
          (type === 'added'
            ? !esm.defined(left) && esm.defined(right)
            : esm.defined(left) && !esm.defined(right)));
      }
      function getIterables(previousData, data, _a) {
        var _b = _a === void 0 ? {} : _a, key = _b.key;
        var left = nested(previousData, key);
        var right = nested(data, key);
        if (!isSameType(left, right)) {
          throw new TypeError('Inputs have different types');
        }
        if (!canHaveLength(left, right)) {
          throw new TypeError("Inputs don't have length");
        }
        if ([left, right].every(esm.plainObject)) {
          left = Object.keys(left);
          right = Object.keys(right);
        }
        return [left, right];
      }
      function hasEntry(input) {
        return function (_a) {
          var key = _a[0], value = _a[1];
          if (esm.array(input)) {
            return (equal(input, value) ||
              input.some(function (d) { return equal(d, value) || (esm.array(value) && isEqualPredicate(value)(d)); }));
          }
          /* istanbul ignore else */
          if (esm.plainObject(input) && input[key]) {
            return !!input[key] && equal(input[key], value);
          }
          return equal(input, value);
        };
      }
      function hasExtraKeys(left, right) {
        return right.some(function (d) { return !left.includes(d); });
      }
      function hasValue(input) {
        return function (value) {
          if (esm.array(input)) {
            return input.some(function (d) { return equal(d, value) || (esm.array(value) && isEqualPredicate(value)(d)); });
          }
          return equal(input, value);
        };
      }
      function includesOrEqualsTo(previousValue, value) {
        return esm.array(previousValue)
          ? previousValue.some(function (d) { return equal(d, value); })
          : equal(previousValue, value);
      }
      function isEqualPredicate(data) {
        return function (value) { return data.some(function (d) { return equal(d, value); }); };
      }
      function isSameType() {
        var arguments_ = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          arguments_[_i] = arguments[_i];
        }
        return (arguments_.every(esm.array) ||
          arguments_.every(esm.number) ||
          arguments_.every(esm.plainObject) ||
          arguments_.every(esm.string));
      }
      function nested(data, property) {
        /* istanbul ignore else */
        if (esm.plainObject(data) || esm.array(data)) {
          /* istanbul ignore else */
          if (esm.string(property)) {
            var props = property.split('.');
            return props.reduce(function (acc, d) { return acc && acc[d]; }, data);
          }
          /* istanbul ignore else */
          if (esm.number(property)) {
            return data[property];
          }
          return data;
        }
        return data;
      }
      //# sourceMappingURL=helpers.js.map
      ;// CONCATENATED MODULE: ./node_modules/tree-changes/esm/index.js



      function treeChanges(previousData, data) {
        if ([previousData, data].some(esm.nullOrUndefined)) {
          throw new Error('Missing required parameters');
        }
        if (![previousData, data].every(function (d) { return esm.plainObject(d) || esm.array(d); })) {
          throw new Error('Expected plain objects or array');
        }
        var added = function (key, value) {
          try {
            return compareValues(previousData, data, { key: key, type: 'added', value: value });
          }
          catch (_a) {
            /* istanbul ignore next */
            return false;
          }
        };
        var changed = function (key, actual, previous) {
          try {
            var left = nested(previousData, key);
            var right = nested(data, key);
            var hasActual = esm.defined(actual);
            var hasPrevious = esm.defined(previous);
            if (hasActual || hasPrevious) {
              var leftComparator = hasPrevious
                ? includesOrEqualsTo(previous, left)
                : !includesOrEqualsTo(actual, left);
              var rightComparator = includesOrEqualsTo(actual, right);
              return leftComparator && rightComparator;
            }
            if ([left, right].every(esm.array) || [left, right].every(esm.plainObject)) {
              return !equal(left, right);
            }
            return left !== right;
          }
          catch (_a) {
            /* istanbul ignore next */
            return false;
          }
        };
        var changedFrom = function (key, previous, actual) {
          if (!esm.defined(key)) {
            return false;
          }
          try {
            var left = nested(previousData, key);
            var right = nested(data, key);
            var hasActual = esm.defined(actual);
            return (includesOrEqualsTo(previous, left) &&
              (hasActual ? includesOrEqualsTo(actual, right) : !hasActual));
          }
          catch (_a) {
            /* istanbul ignore next */
            return false;
          }
        };
        /**
         * @deprecated
         * Use "changed" instead
         */
        var changedTo = function (key, actual) {
          if (!esm.defined(key)) {
            return false;
          }
          /* istanbul ignore next */
          if (false) { }
          return changed(key, actual);
        };
        var decreased = function (key, actual, previous) {
          if (!esm.defined(key)) {
            return false;
          }
          try {
            return compareNumbers(previousData, data, { key: key, actual: actual, previous: previous, type: 'decreased' });
          }
          catch (_a) {
            /* istanbul ignore next */
            return false;
          }
        };
        var emptied = function (key) {
          try {
            var _a = getIterables(previousData, data, { key: key }), left = _a[0], right = _a[1];
            return !!left.length && !right.length;
          }
          catch (_b) {
            /* istanbul ignore next */
            return false;
          }
        };
        var filled = function (key) {
          try {
            var _a = getIterables(previousData, data, { key: key }), left = _a[0], right = _a[1];
            return !left.length && !!right.length;
          }
          catch (_b) {
            /* istanbul ignore next */
            return false;
          }
        };
        var increased = function (key, actual, previous) {
          if (!esm.defined(key)) {
            return false;
          }
          try {
            return compareNumbers(previousData, data, { key: key, actual: actual, previous: previous, type: 'increased' });
          }
          catch (_a) {
            /* istanbul ignore next */
            return false;
          }
        };
        var removed = function (key, value) {
          try {
            return compareValues(previousData, data, { key: key, type: 'removed', value: value });
          }
          catch (_a) {
            /* istanbul ignore next */
            return false;
          }
        };
        return { added: added, changed: changed, changedFrom: changedFrom, changedTo: changedTo, decreased: decreased, emptied: emptied, filled: filled, increased: increased, removed: removed };
      }

      //# sourceMappingURL=index.js.map
      ;// CONCATENATED MODULE: ./node_modules/react-joyride/node_modules/is-lite/dist/index.mjs
      // src/index.ts
      var dist_DOM_PROPERTIES_TO_CHECK = [
        "innerHTML",
        "ownerDocument",
        "style",
        "attributes",
        "nodeValue"
      ];
      var dist_objectTypes = [
        "Array",
        "ArrayBuffer",
        "AsyncFunction",
        "AsyncGenerator",
        "AsyncGeneratorFunction",
        "Date",
        "Error",
        "Function",
        "Generator",
        "GeneratorFunction",
        "HTMLElement",
        "Map",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "WeakMap",
        "WeakSet"
      ];
      var dist_primitiveTypes = [
        "bigint",
        "boolean",
        "null",
        "number",
        "string",
        "symbol",
        "undefined"
      ];
      function dist_getObjectType(value) {
        const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
        if (/HTML\w+Element/.test(objectTypeName)) {
          return "HTMLElement";
        }
        if (dist_isObjectType(objectTypeName)) {
          return objectTypeName;
        }
        return void 0;
      }
      function dist_isObjectOfType(type) {
        return (value) => dist_getObjectType(value) === type;
      }
      function dist_isObjectType(name) {
        return dist_objectTypes.includes(name);
      }
      function dist_isOfType(type) {
        return (value) => typeof value === type;
      }
      function dist_isPrimitiveType(name) {
        return dist_primitiveTypes.includes(name);
      }
      function dist_is(value) {
        if (value === null) {
          return "null";
        }
        switch (typeof value) {
          case "bigint":
            return "bigint";
          case "boolean":
            return "boolean";
          case "number":
            return "number";
          case "string":
            return "string";
          case "symbol":
            return "symbol";
          case "undefined":
            return "undefined";
          default:
        }
        if (dist_is.array(value)) {
          return "Array";
        }
        if (dist_is.plainFunction(value)) {
          return "Function";
        }
        const tagType = dist_getObjectType(value);
        if (tagType) {
          return tagType;
        }
        return "Object";
      }
      dist_is.array = Array.isArray;
      dist_is.arrayOf = (target, predicate) => {
        if (!dist_is.array(target) && !dist_is.function(predicate)) {
          return false;
        }
        return target.every((d) => predicate(d));
      };
      dist_is.asyncGeneratorFunction = (value) => dist_getObjectType(value) === "AsyncGeneratorFunction";
      dist_is.asyncFunction = dist_isObjectOfType("AsyncFunction");
      dist_is.bigint = dist_isOfType("bigint");
      dist_is.boolean = (value) => {
        return value === true || value === false;
      };
      dist_is.date = dist_isObjectOfType("Date");
      dist_is.defined = (value) => !dist_is.undefined(value);
      dist_is.domElement = (value) => {
        return dist_is.object(value) && !dist_is.plainObject(value) && value.nodeType === 1 && dist_is.string(value.nodeName) && dist_DOM_PROPERTIES_TO_CHECK.every((property) => property in value);
      };
      dist_is.empty = (value) => {
        return dist_is.string(value) && value.length === 0 || dist_is.array(value) && value.length === 0 || dist_is.object(value) && !dist_is.map(value) && !dist_is.set(value) && Object.keys(value).length === 0 || dist_is.set(value) && value.size === 0 || dist_is.map(value) && value.size === 0;
      };
      dist_is.error = dist_isObjectOfType("Error");
      dist_is.function = dist_isOfType("function");
      dist_is.generator = (value) => {
        return dist_is.iterable(value) && dist_is.function(value.next) && dist_is.function(value.throw);
      };
      dist_is.generatorFunction = dist_isObjectOfType("GeneratorFunction");
      dist_is.instanceOf = (instance, class_) => {
        if (!instance || !class_) {
          return false;
        }
        return Object.getPrototypeOf(instance) === class_.prototype;
      };
      dist_is.iterable = (value) => {
        return !dist_is.nullOrUndefined(value) && dist_is.function(value[Symbol.iterator]);
      };
      dist_is.map = dist_isObjectOfType("Map");
      dist_is.nan = (value) => {
        return Number.isNaN(value);
      };
      dist_is.null = (value) => {
        return value === null;
      };
      dist_is.nullOrUndefined = (value) => {
        return dist_is.null(value) || dist_is.undefined(value);
      };
      dist_is.number = (value) => {
        return dist_isOfType("number")(value) && !dist_is.nan(value);
      };
      dist_is.numericString = (value) => {
        return dist_is.string(value) && value.length > 0 && !Number.isNaN(Number(value));
      };
      dist_is.object = (value) => {
        return !dist_is.nullOrUndefined(value) && (dist_is.function(value) || typeof value === "object");
      };
      dist_is.oneOf = (target, value) => {
        if (!dist_is.array(target)) {
          return false;
        }
        return target.indexOf(value) > -1;
      };
      dist_is.plainFunction = dist_isObjectOfType("Function");
      dist_is.plainObject = (value) => {
        if (dist_getObjectType(value) !== "Object") {
          return false;
        }
        const prototype = Object.getPrototypeOf(value);
        return prototype === null || prototype === Object.getPrototypeOf({});
      };
      dist_is.primitive = (value) => dist_is.null(value) || dist_isPrimitiveType(typeof value);
      dist_is.promise = dist_isObjectOfType("Promise");
      dist_is.propertyOf = (target, key, predicate) => {
        if (!dist_is.object(target) || !key) {
          return false;
        }
        const value = target[key];
        if (dist_is.function(predicate)) {
          return predicate(value);
        }
        return dist_is.defined(value);
      };
      dist_is.regexp = dist_isObjectOfType("RegExp");
      dist_is.set = dist_isObjectOfType("Set");
      dist_is.string = dist_isOfType("string");
      dist_is.symbol = dist_isOfType("symbol");
      dist_is.undefined = dist_isOfType("undefined");
      dist_is.weakMap = dist_isObjectOfType("WeakMap");
      dist_is.weakSet = dist_isObjectOfType("WeakSet");
      var src_default = dist_is;

      //# sourceMappingURL=index.mjs.map

      // EXTERNAL MODULE: ./node_modules/react-dom/index.js
      var react_dom = __webpack_require__(3935);
      // EXTERNAL MODULE: ./node_modules/exenv/index.js
      var exenv = __webpack_require__(8875);
      var exenv_default = /*#__PURE__*/__webpack_require__.n(exenv);
      // EXTERNAL MODULE: ./node_modules/scroll/index.js
      var node_modules_scroll = __webpack_require__(7339);
      var scroll_default = /*#__PURE__*/__webpack_require__.n(node_modules_scroll);
      // EXTERNAL MODULE: ./node_modules/scrollparent/scrollparent.js
      var scrollparent = __webpack_require__(7274);
      var scrollparent_default = /*#__PURE__*/__webpack_require__.n(scrollparent);
      // EXTERNAL MODULE: ./node_modules/react-is/index.js
      var react_is = __webpack_require__(9864);
      // EXTERNAL MODULE: ./node_modules/deepmerge/dist/cjs.js
      var cjs = __webpack_require__(9996);
      var cjs_default = /*#__PURE__*/__webpack_require__.n(cjs);
      // EXTERNAL MODULE: ./node_modules/prop-types/index.js
      var prop_types = __webpack_require__(5697);
      var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
      // EXTERNAL MODULE: ./node_modules/react-proptype-conditional-require/dist/isRequiredIf.js
      var isRequiredIf = __webpack_require__(6494);
      ;// CONCATENATED MODULE: ./node_modules/popper.js/dist/esm/popper.js
      /**!
       * @fileOverview Kickass library to create and place poppers near their reference elements.
       * @version 1.16.1
       * @license
       * Copyright (c) 2016 Federico Zivolo and contributors
       *
       * Permission is hereby granted, free of charge, to any person obtaining a copy
       * of this software and associated documentation files (the "Software"), to deal
       * in the Software without restriction, including without limitation the rights
       * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
       * copies of the Software, and to permit persons to whom the Software is
       * furnished to do so, subject to the following conditions:
       *
       * The above copyright notice and this permission notice shall be included in all
       * copies or substantial portions of the Software.
       *
       * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
       * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
       * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
       * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
       * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
       * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
       * SOFTWARE.
       */
      var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

      var timeoutDuration = function () {
        var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
        for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
          if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
            return 1;
          }
        }
        return 0;
      }();

      function microtaskDebounce(fn) {
        var called = false;
        return function () {
          if (called) {
            return;
          }
          called = true;
          window.Promise.resolve().then(function () {
            called = false;
            fn();
          });
        };
      }

      function taskDebounce(fn) {
        var scheduled = false;
        return function () {
          if (!scheduled) {
            scheduled = true;
            setTimeout(function () {
              scheduled = false;
              fn();
            }, timeoutDuration);
          }
        };
      }

      var supportsMicroTasks = isBrowser && window.Promise;

      /**
      * Create a debounced version of a method, that's asynchronously deferred
      * but called in the minimum time possible.
      *
      * @method
      * @memberof Popper.Utils
      * @argument {Function} fn
      * @returns {Function}
      */
      var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

      /**
       * Check if the given variable is a function
       * @method
       * @memberof Popper.Utils
       * @argument {Any} functionToCheck - variable to check
       * @returns {Boolean} answer to: is a function?
       */
      function popper_isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
      }

      /**
       * Get CSS computed property of the given element
       * @method
       * @memberof Popper.Utils
       * @argument {Eement} element
       * @argument {String} property
       */
      function getStyleComputedProperty(element, property) {
        if (element.nodeType !== 1) {
          return [];
        }
        // NOTE: 1 DOM access here
        var window = element.ownerDocument.defaultView;
        var css = window.getComputedStyle(element, null);
        return property ? css[property] : css;
      }

      /**
       * Returns the parentNode or the host of the element
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element
       * @returns {Element} parent
       */
      function getParentNode(element) {
        if (element.nodeName === 'HTML') {
          return element;
        }
        return element.parentNode || element.host;
      }

      /**
       * Returns the scrolling parent of the given element
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element
       * @returns {Element} scroll parent
       */
      function getScrollParent(element) {
        // Return body, `getScroll` will take care to get the correct `scrollTop` from it
        if (!element) {
          return document.body;
        }

        switch (element.nodeName) {
          case 'HTML':
          case 'BODY':
            return element.ownerDocument.body;
          case '#document':
            return element.body;
        }

        // Firefox want us to check `-x` and `-y` variations as well

        var _getStyleComputedProp = getStyleComputedProperty(element),
          overflow = _getStyleComputedProp.overflow,
          overflowX = _getStyleComputedProp.overflowX,
          overflowY = _getStyleComputedProp.overflowY;

        if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
          return element;
        }

        return getScrollParent(getParentNode(element));
      }

      /**
       * Returns the reference node of the reference object, or the reference object itself.
       * @method
       * @memberof Popper.Utils
       * @param {Element|Object} reference - the reference element (the popper will be relative to this)
       * @returns {Element} parent
       */
      function getReferenceNode(reference) {
        return reference && reference.referenceNode ? reference.referenceNode : reference;
      }

      var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
      var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

      /**
       * Determines if the browser is Internet Explorer
       * @method
       * @memberof Popper.Utils
       * @param {Number} version to check
       * @returns {Boolean} isIE
       */
      function isIE(version) {
        if (version === 11) {
          return isIE11;
        }
        if (version === 10) {
          return isIE10;
        }
        return isIE11 || isIE10;
      }

      /**
       * Returns the offset parent of the given element
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element
       * @returns {Element} offset parent
       */
      function getOffsetParent(element) {
        if (!element) {
          return document.documentElement;
        }

        var noOffsetParent = isIE(10) ? document.body : null;

        // NOTE: 1 DOM access here
        var offsetParent = element.offsetParent || null;
        // Skip hidden elements which don't have an offsetParent
        while (offsetParent === noOffsetParent && element.nextElementSibling) {
          offsetParent = (element = element.nextElementSibling).offsetParent;
        }

        var nodeName = offsetParent && offsetParent.nodeName;

        if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
          return element ? element.ownerDocument.documentElement : document.documentElement;
        }

        // .offsetParent will return the closest TH, TD or TABLE in case
        // no offsetParent is present, I hate this job...
        if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
          return getOffsetParent(offsetParent);
        }

        return offsetParent;
      }

      function isOffsetContainer(element) {
        var nodeName = element.nodeName;

        if (nodeName === 'BODY') {
          return false;
        }
        return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
      }

      /**
       * Finds the root node (document, shadowDOM root) of the given element
       * @method
       * @memberof Popper.Utils
       * @argument {Element} node
       * @returns {Element} root node
       */
      function getRoot(node) {
        if (node.parentNode !== null) {
          return getRoot(node.parentNode);
        }

        return node;
      }

      /**
       * Finds the offset parent common to the two provided nodes
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element1
       * @argument {Element} element2
       * @returns {Element} common offset parent
       */
      function findCommonOffsetParent(element1, element2) {
        // This check is needed to avoid errors in case one of the elements isn't defined for any reason
        if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
          return document.documentElement;
        }

        // Here we make sure to give as "start" the element that comes first in the DOM
        var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
        var start = order ? element1 : element2;
        var end = order ? element2 : element1;

        // Get common ancestor container
        var range = document.createRange();
        range.setStart(start, 0);
        range.setEnd(end, 0);
        var commonAncestorContainer = range.commonAncestorContainer;

        // Both nodes are inside #document

        if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
          if (isOffsetContainer(commonAncestorContainer)) {
            return commonAncestorContainer;
          }

          return getOffsetParent(commonAncestorContainer);
        }

        // one of the nodes is inside shadowDOM, find which one
        var element1root = getRoot(element1);
        if (element1root.host) {
          return findCommonOffsetParent(element1root.host, element2);
        } else {
          return findCommonOffsetParent(element1, getRoot(element2).host);
        }
      }

      /**
       * Gets the scroll value of the given element in the given side (top and left)
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element
       * @argument {String} side `top` or `left`
       * @returns {number} amount of scrolled pixels
       */
      function getScroll(element) {
        var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

        var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
        var nodeName = element.nodeName;

        if (nodeName === 'BODY' || nodeName === 'HTML') {
          var html = element.ownerDocument.documentElement;
          var scrollingElement = element.ownerDocument.scrollingElement || html;
          return scrollingElement[upperSide];
        }

        return element[upperSide];
      }

      /*
       * Sum or subtract the element scroll values (left and top) from a given rect object
       * @method
       * @memberof Popper.Utils
       * @param {Object} rect - Rect object you want to change
       * @param {HTMLElement} element - The element from the function reads the scroll values
       * @param {Boolean} subtract - set to true if you want to subtract the scroll values
       * @return {Object} rect - The modifier rect object
       */
      function includeScroll(rect, element) {
        var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var scrollTop = getScroll(element, 'top');
        var scrollLeft = getScroll(element, 'left');
        var modifier = subtract ? -1 : 1;
        rect.top += scrollTop * modifier;
        rect.bottom += scrollTop * modifier;
        rect.left += scrollLeft * modifier;
        rect.right += scrollLeft * modifier;
        return rect;
      }

      /*
       * Helper to detect borders of a given element
       * @method
       * @memberof Popper.Utils
       * @param {CSSStyleDeclaration} styles
       * Result of `getStyleComputedProperty` on the given element
       * @param {String} axis - `x` or `y`
       * @return {number} borders - The borders size of the given axis
       */

      function getBordersSize(styles, axis) {
        var sideA = axis === 'x' ? 'Left' : 'Top';
        var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

        return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
      }

      function getSize(axis, body, html, computedStyle) {
        return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
      }

      function getWindowSizes(document) {
        var body = document.body;
        var html = document.documentElement;
        var computedStyle = isIE(10) && getComputedStyle(html);

        return {
          height: getSize('Height', body, html, computedStyle),
          width: getSize('Width', body, html, computedStyle)
        };
      }

      var classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };

      var createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();





      var defineProperty = function (obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }

        return obj;
      };

      var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      /**
       * Given element offsets, generate an output similar to getBoundingClientRect
       * @method
       * @memberof Popper.Utils
       * @argument {Object} offsets
       * @returns {Object} ClientRect like output
       */
      function getClientRect(offsets) {
        return _extends({}, offsets, {
          right: offsets.left + offsets.width,
          bottom: offsets.top + offsets.height
        });
      }

      /**
       * Get bounding client rect of given element
       * @method
       * @memberof Popper.Utils
       * @param {HTMLElement} element
       * @return {Object} client rect
       */
      function getBoundingClientRect(element) {
        var rect = {};

        // IE10 10 FIX: Please, don't ask, the element isn't
        // considered in DOM in some circumstances...
        // This isn't reproducible in IE10 compatibility mode of IE11
        try {
          if (isIE(10)) {
            rect = element.getBoundingClientRect();
            var scrollTop = getScroll(element, 'top');
            var scrollLeft = getScroll(element, 'left');
            rect.top += scrollTop;
            rect.left += scrollLeft;
            rect.bottom += scrollTop;
            rect.right += scrollLeft;
          } else {
            rect = element.getBoundingClientRect();
          }
        } catch (e) { }

        var result = {
          left: rect.left,
          top: rect.top,
          width: rect.right - rect.left,
          height: rect.bottom - rect.top
        };

        // subtract scrollbar size from sizes
        var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
        var width = sizes.width || element.clientWidth || result.width;
        var height = sizes.height || element.clientHeight || result.height;

        var horizScrollbar = element.offsetWidth - width;
        var vertScrollbar = element.offsetHeight - height;

        // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
        // we make this check conditional for performance reasons
        if (horizScrollbar || vertScrollbar) {
          var styles = getStyleComputedProperty(element);
          horizScrollbar -= getBordersSize(styles, 'x');
          vertScrollbar -= getBordersSize(styles, 'y');

          result.width -= horizScrollbar;
          result.height -= vertScrollbar;
        }

        return getClientRect(result);
      }

      function getOffsetRectRelativeToArbitraryNode(children, parent) {
        var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var isIE10 = isIE(10);
        var isHTML = parent.nodeName === 'HTML';
        var childrenRect = getBoundingClientRect(children);
        var parentRect = getBoundingClientRect(parent);
        var scrollParent = getScrollParent(children);

        var styles = getStyleComputedProperty(parent);
        var borderTopWidth = parseFloat(styles.borderTopWidth);
        var borderLeftWidth = parseFloat(styles.borderLeftWidth);

        // In cases where the parent is fixed, we must ignore negative scroll in offset calc
        if (fixedPosition && isHTML) {
          parentRect.top = Math.max(parentRect.top, 0);
          parentRect.left = Math.max(parentRect.left, 0);
        }
        var offsets = getClientRect({
          top: childrenRect.top - parentRect.top - borderTopWidth,
          left: childrenRect.left - parentRect.left - borderLeftWidth,
          width: childrenRect.width,
          height: childrenRect.height
        });
        offsets.marginTop = 0;
        offsets.marginLeft = 0;

        // Subtract margins of documentElement in case it's being used as parent
        // we do this only on HTML because it's the only element that behaves
        // differently when margins are applied to it. The margins are included in
        // the box of the documentElement, in the other cases not.
        if (!isIE10 && isHTML) {
          var marginTop = parseFloat(styles.marginTop);
          var marginLeft = parseFloat(styles.marginLeft);

          offsets.top -= borderTopWidth - marginTop;
          offsets.bottom -= borderTopWidth - marginTop;
          offsets.left -= borderLeftWidth - marginLeft;
          offsets.right -= borderLeftWidth - marginLeft;

          // Attach marginTop and marginLeft because in some circumstances we may need them
          offsets.marginTop = marginTop;
          offsets.marginLeft = marginLeft;
        }

        if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
          offsets = includeScroll(offsets, parent);
        }

        return offsets;
      }

      function getViewportOffsetRectRelativeToArtbitraryNode(element) {
        var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var html = element.ownerDocument.documentElement;
        var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
        var width = Math.max(html.clientWidth, window.innerWidth || 0);
        var height = Math.max(html.clientHeight, window.innerHeight || 0);

        var scrollTop = !excludeScroll ? getScroll(html) : 0;
        var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

        var offset = {
          top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
          left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
          width: width,
          height: height
        };

        return getClientRect(offset);
      }

      /**
       * Check if the given element is fixed or is inside a fixed parent
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element
       * @argument {Element} customContainer
       * @returns {Boolean} answer to "isFixed?"
       */
      function isFixed(element) {
        var nodeName = element.nodeName;
        if (nodeName === 'BODY' || nodeName === 'HTML') {
          return false;
        }
        if (getStyleComputedProperty(element, 'position') === 'fixed') {
          return true;
        }
        var parentNode = getParentNode(element);
        if (!parentNode) {
          return false;
        }
        return isFixed(parentNode);
      }

      /**
       * Finds the first parent of an element that has a transformed property defined
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element
       * @returns {Element} first transformed parent or documentElement
       */

      function getFixedPositionOffsetParent(element) {
        // This check is needed to avoid errors in case one of the elements isn't defined for any reason
        if (!element || !element.parentElement || isIE()) {
          return document.documentElement;
        }
        var el = element.parentElement;
        while (el && getStyleComputedProperty(el, 'transform') === 'none') {
          el = el.parentElement;
        }
        return el || document.documentElement;
      }

      /**
       * Computed the boundaries limits and return them
       * @method
       * @memberof Popper.Utils
       * @param {HTMLElement} popper
       * @param {HTMLElement} reference
       * @param {number} padding
       * @param {HTMLElement} boundariesElement - Element used to define the boundaries
       * @param {Boolean} fixedPosition - Is in fixed position mode
       * @returns {Object} Coordinates of the boundaries
       */
      function getBoundaries(popper, reference, padding, boundariesElement) {
        var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

        // NOTE: 1 DOM access here

        var boundaries = { top: 0, left: 0 };
        var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));

        // Handle viewport case
        if (boundariesElement === 'viewport') {
          boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
        } else {
          // Handle other cases based on DOM element used as boundaries
          var boundariesNode = void 0;
          if (boundariesElement === 'scrollParent') {
            boundariesNode = getScrollParent(getParentNode(reference));
            if (boundariesNode.nodeName === 'BODY') {
              boundariesNode = popper.ownerDocument.documentElement;
            }
          } else if (boundariesElement === 'window') {
            boundariesNode = popper.ownerDocument.documentElement;
          } else {
            boundariesNode = boundariesElement;
          }

          var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

          // In case of HTML, we need a different computation
          if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
            var _getWindowSizes = getWindowSizes(popper.ownerDocument),
              height = _getWindowSizes.height,
              width = _getWindowSizes.width;

            boundaries.top += offsets.top - offsets.marginTop;
            boundaries.bottom = height + offsets.top;
            boundaries.left += offsets.left - offsets.marginLeft;
            boundaries.right = width + offsets.left;
          } else {
            // for all the other DOM elements, this one is good
            boundaries = offsets;
          }
        }

        // Add paddings
        padding = padding || 0;
        var isPaddingNumber = typeof padding === 'number';
        boundaries.left += isPaddingNumber ? padding : padding.left || 0;
        boundaries.top += isPaddingNumber ? padding : padding.top || 0;
        boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
        boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

        return boundaries;
      }

      function getArea(_ref) {
        var width = _ref.width,
          height = _ref.height;

        return width * height;
      }

      /**
       * Utility used to transform the `auto` placement to the placement with more
       * available space.
       * @method
       * @memberof Popper.Utils
       * @argument {Object} data - The data object generated by update method
       * @argument {Object} options - Modifiers configuration and options
       * @returns {Object} The data object, properly modified
       */
      function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
        var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

        if (placement.indexOf('auto') === -1) {
          return placement;
        }

        var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

        var rects = {
          top: {
            width: boundaries.width,
            height: refRect.top - boundaries.top
          },
          right: {
            width: boundaries.right - refRect.right,
            height: boundaries.height
          },
          bottom: {
            width: boundaries.width,
            height: boundaries.bottom - refRect.bottom
          },
          left: {
            width: refRect.left - boundaries.left,
            height: boundaries.height
          }
        };

        var sortedAreas = Object.keys(rects).map(function (key) {
          return _extends({
            key: key
          }, rects[key], {
            area: getArea(rects[key])
          });
        }).sort(function (a, b) {
          return b.area - a.area;
        });

        var filteredAreas = sortedAreas.filter(function (_ref2) {
          var width = _ref2.width,
            height = _ref2.height;
          return width >= popper.clientWidth && height >= popper.clientHeight;
        });

        var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

        var variation = placement.split('-')[1];

        return computedPlacement + (variation ? '-' + variation : '');
      }

      /**
       * Get offsets to the reference element
       * @method
       * @memberof Popper.Utils
       * @param {Object} state
       * @param {Element} popper - the popper element
       * @param {Element} reference - the reference element (the popper will be relative to this)
       * @param {Element} fixedPosition - is in fixed position mode
       * @returns {Object} An object containing the offsets which will be applied to the popper
       */
      function getReferenceOffsets(state, popper, reference) {
        var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
        return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
      }

      /**
       * Get the outer sizes of the given element (offset size + margins)
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element
       * @returns {Object} object containing width and height properties
       */
      function getOuterSizes(element) {
        var window = element.ownerDocument.defaultView;
        var styles = window.getComputedStyle(element);
        var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
        var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
        var result = {
          width: element.offsetWidth + y,
          height: element.offsetHeight + x
        };
        return result;
      }

      /**
       * Get the opposite placement of the given one
       * @method
       * @memberof Popper.Utils
       * @argument {String} placement
       * @returns {String} flipped placement
       */
      function getOppositePlacement(placement) {
        var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
        return placement.replace(/left|right|bottom|top/g, function (matched) {
          return hash[matched];
        });
      }

      /**
       * Get offsets to the popper
       * @method
       * @memberof Popper.Utils
       * @param {Object} position - CSS position the Popper will get applied
       * @param {HTMLElement} popper - the popper element
       * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
       * @param {String} placement - one of the valid placement options
       * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
       */
      function getPopperOffsets(popper, referenceOffsets, placement) {
        placement = placement.split('-')[0];

        // Get popper node sizes
        var popperRect = getOuterSizes(popper);

        // Add position, width and height to our offsets object
        var popperOffsets = {
          width: popperRect.width,
          height: popperRect.height
        };

        // depending by the popper placement we have to compute its offsets slightly differently
        var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
        var mainSide = isHoriz ? 'top' : 'left';
        var secondarySide = isHoriz ? 'left' : 'top';
        var measurement = isHoriz ? 'height' : 'width';
        var secondaryMeasurement = !isHoriz ? 'height' : 'width';

        popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
        if (placement === secondarySide) {
          popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
        } else {
          popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
        }

        return popperOffsets;
      }

      /**
       * Mimics the `find` method of Array
       * @method
       * @memberof Popper.Utils
       * @argument {Array} arr
       * @argument prop
       * @argument value
       * @returns index or -1
       */
      function find(arr, check) {
        // use native find if supported
        if (Array.prototype.find) {
          return arr.find(check);
        }

        // use `filter` to obtain the same behavior of `find`
        return arr.filter(check)[0];
      }

      /**
       * Return the index of the matching object
       * @method
       * @memberof Popper.Utils
       * @argument {Array} arr
       * @argument prop
       * @argument value
       * @returns index or -1
       */
      function findIndex(arr, prop, value) {
        // use native findIndex if supported
        if (Array.prototype.findIndex) {
          return arr.findIndex(function (cur) {
            return cur[prop] === value;
          });
        }

        // use `find` + `indexOf` if `findIndex` isn't supported
        var match = find(arr, function (obj) {
          return obj[prop] === value;
        });
        return arr.indexOf(match);
      }

      /**
       * Loop trough the list of modifiers and run them in order,
       * each of them will then edit the data object.
       * @method
       * @memberof Popper.Utils
       * @param {dataObject} data
       * @param {Array} modifiers
       * @param {String} ends - Optional modifier name used as stopper
       * @returns {dataObject}
       */
      function runModifiers(modifiers, data, ends) {
        var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

        modifiersToRun.forEach(function (modifier) {
          if (modifier['function']) {
            // eslint-disable-line dot-notation
            console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
          }
          var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
          if (modifier.enabled && popper_isFunction(fn)) {
            // Add properties to offsets to make them a complete clientRect object
            // we do this before each modifier to make sure the previous one doesn't
            // mess with these values
            data.offsets.popper = getClientRect(data.offsets.popper);
            data.offsets.reference = getClientRect(data.offsets.reference);

            data = fn(data, modifier);
          }
        });

        return data;
      }

      /**
       * Updates the position of the popper, computing the new offsets and applying
       * the new style.<br />
       * Prefer `scheduleUpdate` over `update` because of performance reasons.
       * @method
       * @memberof Popper
       */
      function update() {
        // if popper is destroyed, don't perform any further update
        if (this.state.isDestroyed) {
          return;
        }

        var data = {
          instance: this,
          styles: {},
          arrowStyles: {},
          attributes: {},
          flipped: false,
          offsets: {}
        };

        // compute reference element offsets
        data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

        // compute auto placement, store placement inside the data object,
        // modifiers will be able to edit `placement` if needed
        // and refer to originalPlacement to know the original value
        data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

        // store the computed placement inside `originalPlacement`
        data.originalPlacement = data.placement;

        data.positionFixed = this.options.positionFixed;

        // compute the popper offsets
        data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

        data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

        // run the modifiers
        data = runModifiers(this.modifiers, data);

        // the first `update` will call `onCreate` callback
        // the other ones will call `onUpdate` callback
        if (!this.state.isCreated) {
          this.state.isCreated = true;
          this.options.onCreate(data);
        } else {
          this.options.onUpdate(data);
        }
      }

      /**
       * Helper used to know if the given modifier is enabled.
       * @method
       * @memberof Popper.Utils
       * @returns {Boolean}
       */
      function isModifierEnabled(modifiers, modifierName) {
        return modifiers.some(function (_ref) {
          var name = _ref.name,
            enabled = _ref.enabled;
          return enabled && name === modifierName;
        });
      }

      /**
       * Get the prefixed supported property name
       * @method
       * @memberof Popper.Utils
       * @argument {String} property (camelCase)
       * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
       */
      function getSupportedPropertyName(property) {
        var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
        var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

        for (var i = 0; i < prefixes.length; i++) {
          var prefix = prefixes[i];
          var toCheck = prefix ? '' + prefix + upperProp : property;
          if (typeof document.body.style[toCheck] !== 'undefined') {
            return toCheck;
          }
        }
        return null;
      }

      /**
       * Destroys the popper.
       * @method
       * @memberof Popper
       */
      function destroy() {
        this.state.isDestroyed = true;

        // touch DOM only if `applyStyle` modifier is enabled
        if (isModifierEnabled(this.modifiers, 'applyStyle')) {
          this.popper.removeAttribute('x-placement');
          this.popper.style.position = '';
          this.popper.style.top = '';
          this.popper.style.left = '';
          this.popper.style.right = '';
          this.popper.style.bottom = '';
          this.popper.style.willChange = '';
          this.popper.style[getSupportedPropertyName('transform')] = '';
        }

        this.disableEventListeners();

        // remove the popper if user explicitly asked for the deletion on destroy
        // do not use `remove` because IE11 doesn't support it
        if (this.options.removeOnDestroy) {
          this.popper.parentNode.removeChild(this.popper);
        }
        return this;
      }

      /**
       * Get the window associated with the element
       * @argument {Element} element
       * @returns {Window}
       */
      function getWindow(element) {
        var ownerDocument = element.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView : window;
      }

      function attachToScrollParents(scrollParent, event, callback, scrollParents) {
        var isBody = scrollParent.nodeName === 'BODY';
        var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
        target.addEventListener(event, callback, { passive: true });

        if (!isBody) {
          attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
        }
        scrollParents.push(target);
      }

      /**
       * Setup needed event listeners used to update the popper position
       * @method
       * @memberof Popper.Utils
       * @private
       */
      function setupEventListeners(reference, options, state, updateBound) {
        // Resize event listener on window
        state.updateBound = updateBound;
        getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

        // Scroll event listener on scroll parents
        var scrollElement = getScrollParent(reference);
        attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
        state.scrollElement = scrollElement;
        state.eventsEnabled = true;

        return state;
      }

      /**
       * It will add resize/scroll events and start recalculating
       * position of the popper element when they are triggered.
       * @method
       * @memberof Popper
       */
      function enableEventListeners() {
        if (!this.state.eventsEnabled) {
          this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
        }
      }

      /**
       * Remove event listeners used to update the popper position
       * @method
       * @memberof Popper.Utils
       * @private
       */
      function removeEventListeners(reference, state) {
        // Remove resize event listener on window
        getWindow(reference).removeEventListener('resize', state.updateBound);

        // Remove scroll event listener on scroll parents
        state.scrollParents.forEach(function (target) {
          target.removeEventListener('scroll', state.updateBound);
        });

        // Reset state
        state.updateBound = null;
        state.scrollParents = [];
        state.scrollElement = null;
        state.eventsEnabled = false;
        return state;
      }

      /**
       * It will remove resize/scroll events and won't recalculate popper position
       * when they are triggered. It also won't trigger `onUpdate` callback anymore,
       * unless you call `update` method manually.
       * @method
       * @memberof Popper
       */
      function disableEventListeners() {
        if (this.state.eventsEnabled) {
          cancelAnimationFrame(this.scheduleUpdate);
          this.state = removeEventListeners(this.reference, this.state);
        }
      }

      /**
       * Tells if a given input is a number
       * @method
       * @memberof Popper.Utils
       * @param {*} input to check
       * @return {Boolean}
       */
      function isNumeric(n) {
        return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
      }

      /**
       * Set the style to the given popper
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element - Element to apply the style to
       * @argument {Object} styles
       * Object with a list of properties and values which will be applied to the element
       */
      function setStyles(element, styles) {
        Object.keys(styles).forEach(function (prop) {
          var unit = '';
          // add unit if the value is numeric and is one of the following
          if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
            unit = 'px';
          }
          element.style[prop] = styles[prop] + unit;
        });
      }

      /**
       * Set the attributes to the given popper
       * @method
       * @memberof Popper.Utils
       * @argument {Element} element - Element to apply the attributes to
       * @argument {Object} styles
       * Object with a list of properties and values which will be applied to the element
       */
      function setAttributes(element, attributes) {
        Object.keys(attributes).forEach(function (prop) {
          var value = attributes[prop];
          if (value !== false) {
            element.setAttribute(prop, attributes[prop]);
          } else {
            element.removeAttribute(prop);
          }
        });
      }

      /**
       * @function
       * @memberof Modifiers
       * @argument {Object} data - The data object generated by `update` method
       * @argument {Object} data.styles - List of style properties - values to apply to popper element
       * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
       * @argument {Object} options - Modifiers configuration and options
       * @returns {Object} The same data object
       */
      function applyStyle(data) {
        // any property present in `data.styles` will be applied to the popper,
        // in this way we can make the 3rd party modifiers add custom styles to it
        // Be aware, modifiers could override the properties defined in the previous
        // lines of this modifier!
        setStyles(data.instance.popper, data.styles);

        // any property present in `data.attributes` will be applied to the popper,
        // they will be set as HTML attributes of the element
        setAttributes(data.instance.popper, data.attributes);

        // if arrowElement is defined and arrowStyles has some properties
        if (data.arrowElement && Object.keys(data.arrowStyles).length) {
          setStyles(data.arrowElement, data.arrowStyles);
        }

        return data;
      }

      /**
       * Set the x-placement attribute before everything else because it could be used
       * to add margins to the popper margins needs to be calculated to get the
       * correct popper offsets.
       * @method
       * @memberof Popper.modifiers
       * @param {HTMLElement} reference - The reference element used to position the popper
       * @param {HTMLElement} popper - The HTML element used as popper
       * @param {Object} options - Popper.js options
       */
      function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
        // compute reference element offsets
        var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

        // compute auto placement, store placement inside the data object,
        // modifiers will be able to edit `placement` if needed
        // and refer to originalPlacement to know the original value
        var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

        popper.setAttribute('x-placement', placement);

        // Apply `position` to popper before anything else because
        // without the position applied we can't guarantee correct computations
        setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

        return options;
      }

      /**
       * @function
       * @memberof Popper.Utils
       * @argument {Object} data - The data object generated by `update` method
       * @argument {Boolean} shouldRound - If the offsets should be rounded at all
       * @returns {Object} The popper's position offsets rounded
       *
       * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
       * good as it can be within reason.
       * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
       *
       * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
       * as well on High DPI screens).
       *
       * Firefox prefers no rounding for positioning and does not have blurriness on
       * high DPI screens.
       *
       * Only horizontal placement and left/right values need to be considered.
       */
      function getRoundedOffsets(data, shouldRound) {
        var _data$offsets = data.offsets,
          popper = _data$offsets.popper,
          reference = _data$offsets.reference;
        var round = Math.round,
          floor = Math.floor;

        var noRound = function noRound(v) {
          return v;
        };

        var referenceWidth = round(reference.width);
        var popperWidth = round(popper.width);

        var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
        var isVariation = data.placement.indexOf('-') !== -1;
        var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
        var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

        var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
        var verticalToInteger = !shouldRound ? noRound : round;

        return {
          left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
          top: verticalToInteger(popper.top),
          bottom: verticalToInteger(popper.bottom),
          right: horizontalToInteger(popper.right)
        };
      }

      var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

      /**
       * @function
       * @memberof Modifiers
       * @argument {Object} data - The data object generated by `update` method
       * @argument {Object} options - Modifiers configuration and options
       * @returns {Object} The data object, properly modified
       */
      function computeStyle(data, options) {
        var x = options.x,
          y = options.y;
        var popper = data.offsets.popper;

        // Remove this legacy support in Popper.js v2

        var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
          return modifier.name === 'applyStyle';
        }).gpuAcceleration;
        if (legacyGpuAccelerationOption !== undefined) {
          console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
        }
        var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

        var offsetParent = getOffsetParent(data.instance.popper);
        var offsetParentRect = getBoundingClientRect(offsetParent);

        // Styles
        var styles = {
          position: popper.position
        };

        var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

        var sideA = x === 'bottom' ? 'top' : 'bottom';
        var sideB = y === 'right' ? 'left' : 'right';

        // if gpuAcceleration is set to `true` and transform is supported,
        //  we use `translate3d` to apply the position to the popper we
        // automatically use the supported prefixed version if needed
        var prefixedProperty = getSupportedPropertyName('transform');

        // now, let's make a step back and look at this code closely (wtf?)
        // If the content of the popper grows once it's been positioned, it
        // may happen that the popper gets misplaced because of the new content
        // overflowing its reference element
        // To avoid this problem, we provide two options (x and y), which allow
        // the consumer to define the offset origin.
        // If we position a popper on top of a reference element, we can set
        // `x` to `top` to make the popper grow towards its top instead of
        // its bottom.
        var left = void 0,
          top = void 0;
        if (sideA === 'bottom') {
          // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
          // and not the bottom of the html element
          if (offsetParent.nodeName === 'HTML') {
            top = -offsetParent.clientHeight + offsets.bottom;
          } else {
            top = -offsetParentRect.height + offsets.bottom;
          }
        } else {
          top = offsets.top;
        }
        if (sideB === 'right') {
          if (offsetParent.nodeName === 'HTML') {
            left = -offsetParent.clientWidth + offsets.right;
          } else {
            left = -offsetParentRect.width + offsets.right;
          }
        } else {
          left = offsets.left;
        }
        if (gpuAcceleration && prefixedProperty) {
          styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
          styles[sideA] = 0;
          styles[sideB] = 0;
          styles.willChange = 'transform';
        } else {
          // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
          var invertTop = sideA === 'bottom' ? -1 : 1;
          var invertLeft = sideB === 'right' ? -1 : 1;
          styles[sideA] = top * invertTop;
          styles[sideB] = left * invertLeft;
          styles.willChange = sideA + ', ' + sideB;
        }

        // Attributes
        var attributes = {
          'x-placement': data.placement
        };

        // Update `data` attributes, styles and arrowStyles
        data.attributes = _extends({}, attributes, data.attributes);
        data.styles = _extends({}, styles, data.styles);
        data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

        return data;
      }

      /**
       * Helper used to know if the given modifier depends from another one.<br />
       * It checks if the needed modifier is listed and enabled.
       * @method
       * @memberof Popper.Utils
       * @param {Array} modifiers - list of modifiers
       * @param {String} requestingName - name of requesting modifier
       * @param {String} requestedName - name of requested modifier
       * @returns {Boolean}
       */
      function isModifierRequired(modifiers, requestingName, requestedName) {
        var requesting = find(modifiers, function (_ref) {
          var name = _ref.name;
          return name === requestingName;
        });

        var isRequired = !!requesting && modifiers.some(function (modifier) {
          return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
        });

        if (!isRequired) {
          var _requesting = '`' + requestingName + '`';
          var requested = '`' + requestedName + '`';
          console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
        }
        return isRequired;
      }

      /**
       * @function
       * @memberof Modifiers
       * @argument {Object} data - The data object generated by update method
       * @argument {Object} options - Modifiers configuration and options
       * @returns {Object} The data object, properly modified
       */
      function arrow(data, options) {
        var _data$offsets$arrow;

        // arrow depends on keepTogether in order to work
        if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
          return data;
        }

        var arrowElement = options.element;

        // if arrowElement is a string, suppose it's a CSS selector
        if (typeof arrowElement === 'string') {
          arrowElement = data.instance.popper.querySelector(arrowElement);

          // if arrowElement is not found, don't run the modifier
          if (!arrowElement) {
            return data;
          }
        } else {
          // if the arrowElement isn't a query selector we must check that the
          // provided DOM node is child of its popper node
          if (!data.instance.popper.contains(arrowElement)) {
            console.warn('WARNING: `arrow.element` must be child of its popper element!');
            return data;
          }
        }

        var placement = data.placement.split('-')[0];
        var _data$offsets = data.offsets,
          popper = _data$offsets.popper,
          reference = _data$offsets.reference;

        var isVertical = ['left', 'right'].indexOf(placement) !== -1;

        var len = isVertical ? 'height' : 'width';
        var sideCapitalized = isVertical ? 'Top' : 'Left';
        var side = sideCapitalized.toLowerCase();
        var altSide = isVertical ? 'left' : 'top';
        var opSide = isVertical ? 'bottom' : 'right';
        var arrowElementSize = getOuterSizes(arrowElement)[len];

        //
        // extends keepTogether behavior making sure the popper and its
        // reference have enough pixels in conjunction
        //

        // top/left side
        if (reference[opSide] - arrowElementSize < popper[side]) {
          data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
        }
        // bottom/right side
        if (reference[side] + arrowElementSize > popper[opSide]) {
          data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
        }
        data.offsets.popper = getClientRect(data.offsets.popper);

        // compute center of the popper
        var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

        // Compute the sideValue using the updated popper offsets
        // take popper margin in account because we don't have this info available
        var css = getStyleComputedProperty(data.instance.popper);
        var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
        var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
        var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

        // prevent arrowElement from being placed not contiguously to its popper
        sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

        data.arrowElement = arrowElement;
        data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

        return data;
      }

      /**
       * Get the opposite placement variation of the given one
       * @method
       * @memberof Popper.Utils
       * @argument {String} placement variation
       * @returns {String} flipped placement variation
       */
      function getOppositeVariation(variation) {
        if (variation === 'end') {
          return 'start';
        } else if (variation === 'start') {
          return 'end';
        }
        return variation;
      }

      /**
       * List of accepted placements to use as values of the `placement` option.<br />
       * Valid placements are:
       * - `auto`
       * - `top`
       * - `right`
       * - `bottom`
       * - `left`
       *
       * Each placement can have a variation from this list:
       * - `-start`
       * - `-end`
       *
       * Variations are interpreted easily if you think of them as the left to right
       * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
       * is right.<br />
       * Vertically (`left` and `right`), `start` is top and `end` is bottom.
       *
       * Some valid examples are:
       * - `top-end` (on top of reference, right aligned)
       * - `right-start` (on right of reference, top aligned)
       * - `bottom` (on bottom, centered)
       * - `auto-end` (on the side with more space available, alignment depends by placement)
       *
       * @static
       * @type {Array}
       * @enum {String}
       * @readonly
       * @method placements
       * @memberof Popper
       */
      var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

      // Get rid of `auto` `auto-start` and `auto-end`
      var validPlacements = placements.slice(3);

      /**
       * Given an initial placement, returns all the subsequent placements
       * clockwise (or counter-clockwise).
       *
       * @method
       * @memberof Popper.Utils
       * @argument {String} placement - A valid placement (it accepts variations)
       * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
       * @returns {Array} placements including their variations
       */
      function clockwise(placement) {
        var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var index = validPlacements.indexOf(placement);
        var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
        return counter ? arr.reverse() : arr;
      }

      var BEHAVIORS = {
        FLIP: 'flip',
        CLOCKWISE: 'clockwise',
        COUNTERCLOCKWISE: 'counterclockwise'
      };

      /**
       * @function
       * @memberof Modifiers
       * @argument {Object} data - The data object generated by update method
       * @argument {Object} options - Modifiers configuration and options
       * @returns {Object} The data object, properly modified
       */
      function flip(data, options) {
        // if `inner` modifier is enabled, we can't use the `flip` modifier
        if (isModifierEnabled(data.instance.modifiers, 'inner')) {
          return data;
        }

        if (data.flipped && data.placement === data.originalPlacement) {
          // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
          return data;
        }

        var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

        var placement = data.placement.split('-')[0];
        var placementOpposite = getOppositePlacement(placement);
        var variation = data.placement.split('-')[1] || '';

        var flipOrder = [];

        switch (options.behavior) {
          case BEHAVIORS.FLIP:
            flipOrder = [placement, placementOpposite];
            break;
          case BEHAVIORS.CLOCKWISE:
            flipOrder = clockwise(placement);
            break;
          case BEHAVIORS.COUNTERCLOCKWISE:
            flipOrder = clockwise(placement, true);
            break;
          default:
            flipOrder = options.behavior;
        }

        flipOrder.forEach(function (step, index) {
          if (placement !== step || flipOrder.length === index + 1) {
            return data;
          }

          placement = data.placement.split('-')[0];
          placementOpposite = getOppositePlacement(placement);

          var popperOffsets = data.offsets.popper;
          var refOffsets = data.offsets.reference;

          // using floor because the reference offsets may contain decimals we are not going to consider here
          var floor = Math.floor;
          var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

          var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
          var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
          var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
          var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

          var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

          // flip the variation if required
          var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

          // flips variation if reference element overflows boundaries
          var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

          // flips variation if popper content overflows boundaries
          var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

          var flippedVariation = flippedVariationByRef || flippedVariationByContent;

          if (overlapsRef || overflowsBoundaries || flippedVariation) {
            // this boolean to detect any flip loop
            data.flipped = true;

            if (overlapsRef || overflowsBoundaries) {
              placement = flipOrder[index + 1];
            }

            if (flippedVariation) {
              variation = getOppositeVariation(variation);
            }

            data.placement = placement + (variation ? '-' + variation : '');

            // this object contains `position`, we want to preserve it along with
            // any additional property we may add in the future
            data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

            data = runModifiers(data.instance.modifiers, data, 'flip');
          }
        });
        return data;
      }

      /**
       * @function
       * @memberof Modifiers
       * @argument {Object} data - The data object generated by update method
       * @argument {Object} options - Modifiers configuration and options
       * @returns {Object} The data object, properly modified
       */
      function keepTogether(data) {
        var _data$offsets = data.offsets,
          popper = _data$offsets.popper,
          reference = _data$offsets.reference;

        var placement = data.placement.split('-')[0];
        var floor = Math.floor;
        var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
        var side = isVertical ? 'right' : 'bottom';
        var opSide = isVertical ? 'left' : 'top';
        var measurement = isVertical ? 'width' : 'height';

        if (popper[side] < floor(reference[opSide])) {
          data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
        }
        if (popper[opSide] > floor(reference[side])) {
          data.offsets.popper[opSide] = floor(reference[side]);
        }

        return data;
      }

      /**
       * Converts a string containing value + unit into a px value number
       * @function
       * @memberof {modifiers~offset}
       * @private
       * @argument {String} str - Value + unit string
       * @argument {String} measurement - `height` or `width`
       * @argument {Object} popperOffsets
       * @argument {Object} referenceOffsets
       * @returns {Number|String}
       * Value in pixels, or original string if no values were extracted
       */
      function toValue(str, measurement, popperOffsets, referenceOffsets) {
        // separate value from unit
        var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
        var value = +split[1];
        var unit = split[2];

        // If it's not a number it's an operator, I guess
        if (!value) {
          return str;
        }

        if (unit.indexOf('%') === 0) {
          var element = void 0;
          switch (unit) {
            case '%p':
              element = popperOffsets;
              break;
            case '%':
            case '%r':
            default:
              element = referenceOffsets;
          }

          var rect = getClientRect(element);
          return rect[measurement] / 100 * value;
        } else if (unit === 'vh' || unit === 'vw') {
          // if is a vh or vw, we calculate the size based on the viewport
          var size = void 0;
          if (unit === 'vh') {
            size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
          } else {
            size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
          }
          return size / 100 * value;
        } else {
          // if is an explicit pixel unit, we get rid of the unit and keep the value
          // if is an implicit unit, it's px, and we return just the value
          return value;
        }
      }

      /**
       * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
       * @function
       * @memberof {modifiers~offset}
       * @private
       * @argument {String} offset
       * @argument {Object} popperOffsets
       * @argument {Object} referenceOffsets
       * @argument {String} basePlacement
       * @returns {Array} a two cells array with x and y offsets in numbers
       */
      function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
        var offsets = [0, 0];

        // Use height if placement is left or right and index is 0 otherwise use width
        // in this way the first offset will use an axis and the second one
        // will use the other one
        var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

        // Split the offset string to obtain a list of values and operands
        // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
        var fragments = offset.split(/(\+|\-)/).map(function (frag) {
          return frag.trim();
        });

        // Detect if the offset string contains a pair of values or a single one
        // they could be separated by comma or space
        var divider = fragments.indexOf(find(fragments, function (frag) {
          return frag.search(/,|\s/) !== -1;
        }));

        if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
          console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
        }

        // If divider is found, we divide the list of values and operands to divide
        // them by ofset X and Y.
        var splitRegex = /\s*,\s*|\s+/;
        var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

        // Convert the values with units to absolute pixels to allow our computations
        ops = ops.map(function (op, index) {
          // Most of the units rely on the orientation of the popper
          var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
          var mergeWithPrevious = false;
          return op
            // This aggregates any `+` or `-` sign that aren't considered operators
            // e.g.: 10 + +5 => [10, +, +5]
            .reduce(function (a, b) {
              if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
                a[a.length - 1] = b;
                mergeWithPrevious = true;
                return a;
              } else if (mergeWithPrevious) {
                a[a.length - 1] += b;
                mergeWithPrevious = false;
                return a;
              } else {
                return a.concat(b);
              }
            }, [])
            // Here we convert the string values into number values (in px)
            .map(function (str) {
              return toValue(str, measurement, popperOffsets, referenceOffsets);
            });
        });

        // Loop trough the offsets arrays and execute the operations
        ops.forEach(function (op, index) {
          op.forEach(function (frag, index2) {
            if (isNumeric(frag)) {
              offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
            }
          });
        });
        return offsets;
      }

      /**
       * @function
       * @memberof Modifiers
       * @argument {Object} data - The data object generated by update method
       * @argument {Object} options - Modifiers configuration and options
       * @argument {Number|String} options.offset=0
       * The offset value as described in the modifier description
       * @returns {Object} The data object, properly modified
       */
      function offset(data, _ref) {
        var offset = _ref.offset;
        var placement = data.placement,
          _data$offsets = data.offsets,
          popper = _data$offsets.popper,
          reference = _data$offsets.reference;

        var basePlacement = placement.split('-')[0];

        var offsets = void 0;
        if (isNumeric(+offset)) {
          offsets = [+offset, 0];
        } else {
          offsets = parseOffset(offset, popper, reference, basePlacement);
        }

        if (basePlacement === 'left') {
          popper.top += offsets[0];
          popper.left -= offsets[1];
        } else if (basePlacement === 'right') {
          popper.top += offsets[0];
          popper.left += offsets[1];
        } else if (basePlacement === 'top') {
          popper.left += offsets[0];
          popper.top -= offsets[1];
        } else if (basePlacement === 'bottom') {
          popper.left += offsets[0];
          popper.top += offsets[1];
        }

        data.popper = popper;
        return data;
      }

      /**
       * @function
       * @memberof Modifiers
       * @argument {Object} data - The data object generated by `update` method
       * @argument {Object} options - Modifiers configuration and options
       * @returns {Object} The data object, properly modified
       */
      function preventOverflow(data, options) {
        var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

        // If offsetParent is the reference element, we really want to
        // go one step up and use the next offsetParent as reference to
        // avoid to make this modifier completely useless and look like broken
        if (data.instance.reference === boundariesElement) {
          boundariesElement = getOffsetParent(boundariesElement);
        }

        // NOTE: DOM access here
        // resets the popper's position so that the document size can be calculated excluding
        // the size of the popper element itself
        var transformProp = getSupportedPropertyName('transform');
        var popperStyles = data.instance.popper.style; // assignment to help minification
        var top = popperStyles.top,
          left = popperStyles.left,
          transform = popperStyles[transformProp];

        popperStyles.top = '';
        popperStyles.left = '';
        popperStyles[transformProp] = '';

        var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

        // NOTE: DOM access here
        // restores the original style properties after the offsets have been computed
        popperStyles.top = top;
        popperStyles.left = left;
        popperStyles[transformProp] = transform;

        options.boundaries = boundaries;

        var order = options.priority;
        var popper = data.offsets.popper;

        var check = {
          primary: function primary(placement) {
            var value = popper[placement];
            if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
              value = Math.max(popper[placement], boundaries[placement]);
            }
            return defineProperty({}, placement, value);
          },
          secondary: function secondary(placement) {
            var mainSide = placement === 'right' ? 'left' : 'top';
            var value = popper[mainSide];
            if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
              value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
            }
            return defineProperty({}, mainSide, value);
          }
        };

        order.forEach(function (placement) {
          var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
          popper = _extends({}, popper, check[side](placement));
        });

        data.offsets.popper = popper;

        return data;
      }




      /**
       * Modifier function, each modifier can have a function of this type assigned
       * to its `fn` property.<br />
       * These functions will be called on each update, this means that you must
       * make sure they are performant enough to avoid performance bottlenecks.
       *
       * @function ModifierFn
       * @argument {dataObject} data - The data object generated by `update` method
       * @argument {Object} options - Modifiers configuration and options
       * @returns {dataObject} The data object, properly modified
       */

      /**
       * Modifiers are plugins used to alter the behavior of your poppers.<br />
       * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
       * needed by the library.
       *
       * Usually you don't want to override the `order`, `fn` and `onLoad` props.
       * All the other properties are configurations that could be tweaked.
       * @namespace modifiers
       */
      var modifiers = {

        /**
         * The `offset` modifier can shift your popper on both its axis.
         *
         * It accepts the following units:
         * - `px` or unit-less, interpreted as pixels
         * - `%` or `%r`, percentage relative to the length of the reference element
         * - `%p`, percentage relative to the length of the popper element
         * - `vw`, CSS viewport width unit
         * - `vh`, CSS viewport height unit
         *
         * For length is intended the main axis relative to the placement of the popper.<br />
         * This means that if the placement is `top` or `bottom`, the length will be the
         * `width`. In case of `left` or `right`, it will be the `height`.
         *
         * You can provide a single value (as `Number` or `String`), or a pair of values
         * as `String` divided by a comma or one (or more) white spaces.<br />
         * The latter is a deprecated method because it leads to confusion and will be
         * removed in v2.<br />
         * Additionally, it accepts additions and subtractions between different units.
         * Note that multiplications and divisions aren't supported.
         *
         * Valid examples are:
         * ```
         * 10
         * '10%'
         * '10, 10'
         * '10%, 10'
         * '10 + 10%'
         * '10 - 5vh + 3%'
         * '-10px + 5vh, 5px - 6%'
         * ```
         * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
         * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
         * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
         *
         * @memberof modifiers
         * @inner
         */
        offset: {
          /** @prop {number} order=200 - Index used to define the order of execution */
          order: 200,
          /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
          enabled: true,
          /** @prop {ModifierFn} */
          fn: offset,
          /** @prop {Number|String} offset=0
           * The offset value as described in the modifier description
           */
          offset: 0
        },
      };

      /**
       * Default options provided to Popper.js constructor.<br />
       * These can be overridden using the `options` argument of Popper.js.<br />
       * To override an option, simply pass an object with the same
       * structure of the `options` object, as the 3rd argument. For example:
       * ```
       * new Popper(ref, pop, {
       *   modifiers: {
       *     preventOverflow: { enabled: false }
       *   }
       * })
       * ```
       * @type {Object}
       * @static
       * @memberof Popper
       */
      var Defaults = {
        /**
         * List of modifiers used to modify the offsets before they are applied to the popper.
         * They provide most of the functionalities of Popper.js.
         * @prop {modifiers}
         */
        modifiers: modifiers
      };

      /**
       * @callback onCreate
       * @param {dataObject} data
       */

      /**
       * @callback onUpdate
       * @param {dataObject} data
       */

      // Utils
      // Methods
      var Popper = function () {
        /**
         * Creates a new Popper.js instance.
         * @class Popper
         * @param {Element|referenceObject} reference - The reference element used to position the popper
         * @param {Element} popper - The HTML / XML element used as the popper
         * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
         * @return {Object} instance - The generated Popper.js instance
         */
        function Popper(reference, popper) {
          var _this = this;

          var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          classCallCheck(this, Popper);

          this.scheduleUpdate = function () {
            return requestAnimationFrame(_this.update);
          };

          // make update() debounced, so that it only runs at most once-per-tick
          this.update = debounce(this.update.bind(this));

          // with {} we create a new object with the options inside it
          this.options = _extends({}, Popper.Defaults, options);

          // init state
          this.state = {
            isDestroyed: false,
            isCreated: false,
            scrollParents: []
          };

          // get reference and popper elements (allow jQuery wrappers)
          this.reference = reference && reference.jquery ? reference[0] : reference;
          this.popper = popper && popper.jquery ? popper[0] : popper;

          // Deep merge modifiers options
          this.options.modifiers = {};
          Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
            _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
          });

          // Refactoring modifiers' list (Object => Array)
          this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
            return _extends({
              name: name
            }, _this.options.modifiers[name]);
          })
            // sort the modifiers by order
            .sort(function (a, b) {
              return a.order - b.order;
            });

          // modifiers have the ability to execute arbitrary code when Popper.js get inited
          // such code is executed in the same order of its modifier
          // they could add new properties to their options configuration
          // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
          this.modifiers.forEach(function (modifierOptions) {
            if (modifierOptions.enabled && popper_isFunction(modifierOptions.onLoad)) {
              modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
            }
          });

          // fire the first update to position the popper in the right place
          this.update();

          var eventsEnabled = this.options.eventsEnabled;
          if (eventsEnabled) {
            // setup event listeners, they will take care of update the position in specific situations
            this.enableEventListeners();
          }

          this.state.eventsEnabled = eventsEnabled;
        }

        // We can't use class properties because they don't get listed in the
        // class prototype and break stuff like Sinon stubs


        createClass(Popper, [{
          key: 'update',
          value: function update$$1() {
            return update.call(this);
          }
        }, {
          key: 'destroy',
          value: function destroy$$1() {
            return destroy.call(this);
          }
        }, {
          key: 'enableEventListeners',
          value: function enableEventListeners$$1() {
            return enableEventListeners.call(this);
          }
        }, {
          key: 'disableEventListeners',
          value: function disableEventListeners$$1() {
            return disableEventListeners.call(this);
          }

          /**
           * Schedules an update. It will run on the next UI update available.
           * @method scheduleUpdate
           * @memberof Popper
           */


          /**
           * Collection of utilities useful when writing custom modifiers.
           * Starting from version 1.7, this method is available only if you
           * include `popper-utils.js` before `popper.js`.
           *
           * **DEPRECATION**: This way to access PopperUtils is deprecated
           * and will be removed in v2! Use the PopperUtils module directly instead.
           * Due to the high instability of the methods contained in Utils, we can't
           * guarantee them to follow semver. Use them at your own risk!
           * @static
           * @private
           * @type {Object}
           * @deprecated since version 1.8
           * @member Utils
           * @memberof Popper
           */

        }]);
        return Popper;
      }();

      /**
       * The `referenceObject` is an object that provides an interface compatible with Popper.js
       * and lets you use it as replacement of a real DOM node.<br />
       * You can use this method to position a popper relatively to a set of coordinates
       * in case you don't have a DOM node to use as reference.
       *
       * ```
       * new Popper(referenceObject, popperNode);
       * ```
       *
       * NB: This feature isn't supported in Internet Explorer 10.
       * @name referenceObject
       * @property {Function} data.getBoundingClientRect
       * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
       * @property {number} data.clientWidth
       * An ES6 getter that will return the width of the virtual reference element.
       * @property {number} data.clientHeight
       * An ES6 getter that will return the height of the virtual reference element.
       */


      Popper.Utils = (typeof window !== 'undefined' ? window : __webpack_require__.g).PopperUtils;
      Popper.placements = placements;
      Popper.Defaults = Defaults;

/* harmony default export */ var popper = (Popper);
      //# sourceMappingURL=popper.js.map

      ;// CONCATENATED MODULE: ./node_modules/react-floater/es/index.js










      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);

        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys.push.apply(keys, symbols);
        }

        return keys;
      }

      function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = null != arguments[i] ? arguments[i] : {};
          i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }

        return target;
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

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
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", {
          writable: false
        });
        return Constructor;
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }

        return obj;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            writable: true,
            configurable: true
          }
        });
        Object.defineProperty(subClass, "prototype", {
          writable: false
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
      }

      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
      }

      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
        };
        return _setPrototypeOf(o, p);
      }

      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;

        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { }));
          return true;
        } catch (e) {
          return false;
        }
      }

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
      }

      function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};

        var target = _objectWithoutPropertiesLoose(source, excluded);

        var key, i;

        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
          }
        }

        return target;
      }

      function _assertThisInitialized(self) {
        if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return self;
      }

      function _possibleConstructorReturn(self, call) {
        if (call && (typeof call === "object" || typeof call === "function")) {
          return call;
        } else if (call !== void 0) {
          throw new TypeError("Derived constructors may only return object or undefined");
        }

        return _assertThisInitialized(self);
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

      var DEFAULTS = { flip: { padding: 20 }, preventOverflow: { padding: 10 } };

      var STATUS = { INIT: 'init', IDLE: 'idle', OPENING: 'opening', OPEN: 'open', CLOSING: 'closing', ERROR: 'error' };

      var canUseDOM = (exenv_default()).canUseDOM; var isReact16 = react_dom.createPortal !== undefined; function isMobile() { return 'ontouchstart' in window && /Mobi/.test(navigator.userAgent); }/**
 * Log method calls if debug is enabled
 *
 * @private
 * @param {Object}       arg
 * @param {string}       arg.title    - The title the logger was called from
 * @param {Object|Array} [arg.data]   - The data to be logged
 * @param {boolean}      [arg.warn]  - If true, the message will be a warning
 * @param {boolean}      [arg.debug] - Nothing will be logged unless debug is true
 */function log(_ref) { var title = _ref.title, data = _ref.data, _ref$warn = _ref.warn, warn = _ref$warn === void 0 ? false : _ref$warn, _ref$debug = _ref.debug, debug = _ref$debug === void 0 ? false : _ref$debug;/* eslint-disable no-console */var logFn = warn ? console.warn || console.error : console.log; if (debug && title && data) { console.groupCollapsed("%creact-floater: ".concat(title), 'color: #9b00ff; font-weight: bold; font-size: 12px;'); if (Array.isArray(data)) { data.forEach(function (d) { if (esm.plainObject(d) && d.key) { logFn.apply(console, [d.key, d.value]); } else { logFn.apply(console, [d]); } }); } else { logFn.apply(console, [data]); } console.groupEnd(); }/* eslint-enable */ } function on(element, event, cb) { var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false; element.addEventListener(event, cb, capture); } function off(element, event, cb) { var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false; element.removeEventListener(event, cb, capture); } function once(element, event, cb) {
        var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false; var _nextCB;// eslint-disable-next-line prefer-const
        _nextCB = function nextCB(e) { cb(e); off(element, event, _nextCB); }; on(element, event, _nextCB, capture);
      } function noop() { }

      var ReactFloaterPortal =/*#__PURE__*/function (_React$Component) { _inherits(ReactFloaterPortal, _React$Component); var _super = _createSuper(ReactFloaterPortal); function ReactFloaterPortal() { _classCallCheck(this, ReactFloaterPortal); return _super.apply(this, arguments); } _createClass(ReactFloaterPortal, [{ key: "componentDidMount", value: function componentDidMount() { if (!canUseDOM) return; if (!this.node) { this.appendNode(); } if (!isReact16) { this.renderPortal(); } } }, { key: "componentDidUpdate", value: function componentDidUpdate() { if (!canUseDOM) return; if (!isReact16) { this.renderPortal(); } } }, { key: "componentWillUnmount", value: function componentWillUnmount() { if (!canUseDOM || !this.node) return; if (!isReact16) { react_dom.unmountComponentAtNode(this.node); } if (this.node && this.node.parentNode === document.body) { document.body.removeChild(this.node); this.node = undefined; } } }, { key: "appendNode", value: function appendNode() { var _this$props = this.props, id = _this$props.id, zIndex = _this$props.zIndex; if (!this.node) { this.node = document.createElement('div');/* istanbul ignore else */if (id) { this.node.id = id; } if (zIndex) { this.node.style.zIndex = zIndex; } document.body.appendChild(this.node); } } }, { key: "renderPortal", value: function renderPortal() { if (!canUseDOM) return null; var _this$props2 = this.props, children = _this$props2.children, setRef = _this$props2.setRef; if (!this.node) { this.appendNode(); }/* istanbul ignore else */if (isReact16) { return/*#__PURE__*/react_dom.createPortal(children, this.node); } var portal = react_dom.unstable_renderSubtreeIntoContainer(this, children.length > 1 ?/*#__PURE__*/react.createElement("div", null, children) : children[0], this.node); setRef(portal); return null; } }, { key: "renderReact16", value: function renderReact16() { var _this$props3 = this.props, hasChildren = _this$props3.hasChildren, placement = _this$props3.placement, target = _this$props3.target; if (!hasChildren) { if (target || placement === 'center') { return this.renderPortal(); } return null; } return this.renderPortal(); } }, { key: "render", value: function render() { if (!isReact16) { return null; } return this.renderReact16(); } }]); return ReactFloaterPortal; }(react.Component); _defineProperty(ReactFloaterPortal, "propTypes", { children: prop_types_default().oneOfType([(prop_types_default()).element, (prop_types_default()).array]), hasChildren: (prop_types_default()).bool, id: prop_types_default().oneOfType([(prop_types_default()).string, (prop_types_default()).number]), placement: (prop_types_default()).string, setRef: (prop_types_default()).func.isRequired, target: prop_types_default().oneOfType([(prop_types_default()).object, (prop_types_default()).string]), zIndex: (prop_types_default()).number });

      var FloaterArrow =/*#__PURE__*/function (_React$Component) { _inherits(FloaterArrow, _React$Component); var _super = _createSuper(FloaterArrow); function FloaterArrow() { _classCallCheck(this, FloaterArrow); return _super.apply(this, arguments); } _createClass(FloaterArrow, [{ key: "parentStyle", get: function get() { var _this$props = this.props, placement = _this$props.placement, styles = _this$props.styles; var length = styles.arrow.length; var arrow = { pointerEvents: 'none', position: 'absolute', width: '100%' };/* istanbul ignore else */if (placement.startsWith('top')) { arrow.bottom = 0; arrow.left = 0; arrow.right = 0; arrow.height = length; } else if (placement.startsWith('bottom')) { arrow.left = 0; arrow.right = 0; arrow.top = 0; arrow.height = length; } else if (placement.startsWith('left')) { arrow.right = 0; arrow.top = 0; arrow.bottom = 0; } else if (placement.startsWith('right')) { arrow.left = 0; arrow.top = 0; } return arrow; } }, { key: "render", value: function render() { var _this$props2 = this.props, placement = _this$props2.placement, setArrowRef = _this$props2.setArrowRef, styles = _this$props2.styles; var _styles$arrow = styles.arrow, color = _styles$arrow.color, display = _styles$arrow.display, length = _styles$arrow.length, margin = _styles$arrow.margin, position = _styles$arrow.position, spread = _styles$arrow.spread; var arrowStyles = { display: display, position: position }; var points; var x = spread; var y = length;/* istanbul ignore else */if (placement.startsWith('top')) { points = "0,0 ".concat(x / 2, ",").concat(y, " ").concat(x, ",0"); arrowStyles.bottom = 0; arrowStyles.marginLeft = margin; arrowStyles.marginRight = margin; } else if (placement.startsWith('bottom')) { points = "".concat(x, ",").concat(y, " ").concat(x / 2, ",0 0,").concat(y); arrowStyles.top = 0; arrowStyles.marginLeft = margin; arrowStyles.marginRight = margin; } else if (placement.startsWith('left')) { y = spread; x = length; points = "0,0 ".concat(x, ",").concat(y / 2, " 0,").concat(y); arrowStyles.right = 0; arrowStyles.marginTop = margin; arrowStyles.marginBottom = margin; } else if (placement.startsWith('right')) { y = spread; x = length; points = "".concat(x, ",").concat(y, " ").concat(x, ",0 0,").concat(y / 2); arrowStyles.left = 0; arrowStyles.marginTop = margin; arrowStyles.marginBottom = margin; } return/*#__PURE__*/react.createElement("div", { className: "__floater__arrow", style: this.parentStyle },/*#__PURE__*/react.createElement("span", { ref: setArrowRef, style: arrowStyles },/*#__PURE__*/react.createElement("svg", { width: x, height: y, version: "1.1", xmlns: "http://www.w3.org/2000/svg" },/*#__PURE__*/react.createElement("polygon", { points: points, fill: color })))); } }]); return FloaterArrow; }(react.Component); _defineProperty(FloaterArrow, "propTypes", { placement: (prop_types_default()).string.isRequired, setArrowRef: (prop_types_default()).func.isRequired, styles: (prop_types_default()).object.isRequired });

      var _excluded$1 = ["color", "height", "width"]; var FloaterCloseBtn = function FloaterCloseBtn(_ref) { var handleClick = _ref.handleClick, styles = _ref.styles; var color = styles.color, height = styles.height, width = styles.width, style = _objectWithoutProperties(styles, _excluded$1); return/*#__PURE__*/react.createElement("button", { "aria-label": "close", onClick: handleClick, style: style, type: "button" },/*#__PURE__*/react.createElement("svg", { width: "".concat(width, "px"), height: "".concat(height, "px"), viewBox: "0 0 18 18", version: "1.1", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid" },/*#__PURE__*/react.createElement("g", null,/*#__PURE__*/react.createElement("path", { d: "M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z", fill: color })))); }; FloaterCloseBtn.propTypes = { handleClick: (prop_types_default()).func.isRequired, styles: (prop_types_default()).object.isRequired };

      var FloaterContainer = function FloaterContainer(_ref) { var content = _ref.content, footer = _ref.footer, handleClick = _ref.handleClick, open = _ref.open, positionWrapper = _ref.positionWrapper, showCloseButton = _ref.showCloseButton, title = _ref.title, styles = _ref.styles; var output = { content:/*#__PURE__*/react.isValidElement(content) ? content :/*#__PURE__*/react.createElement("div", { className: "__floater__content", style: styles.content }, content) }; if (title) { output.title =/*#__PURE__*/react.isValidElement(title) ? title :/*#__PURE__*/react.createElement("div", { className: "__floater__title", style: styles.title }, title); } if (footer) { output.footer =/*#__PURE__*/react.isValidElement(footer) ? footer :/*#__PURE__*/react.createElement("div", { className: "__floater__footer", style: styles.footer }, footer); } if ((showCloseButton || positionWrapper) && !esm.boolean(open)) { output.close =/*#__PURE__*/react.createElement(FloaterCloseBtn, { styles: styles.close, handleClick: handleClick }); } return/*#__PURE__*/react.createElement("div", { className: "__floater__container", style: styles.container }, output.close, output.title, output.content, output.footer); }; FloaterContainer.propTypes = { content: (prop_types_default()).node.isRequired, footer: (prop_types_default()).node, handleClick: (prop_types_default()).func.isRequired, open: (prop_types_default()).bool, positionWrapper: (prop_types_default()).bool.isRequired, showCloseButton: (prop_types_default()).bool.isRequired, styles: (prop_types_default()).object.isRequired, title: (prop_types_default()).node };

      var Floater =/*#__PURE__*/function (_React$Component) { _inherits(Floater, _React$Component); var _super = _createSuper(Floater); function Floater() { _classCallCheck(this, Floater); return _super.apply(this, arguments); } _createClass(Floater, [{ key: "style", get: function get() { var _this$props = this.props, disableAnimation = _this$props.disableAnimation, component = _this$props.component, placement = _this$props.placement, hideArrow = _this$props.hideArrow, status = _this$props.status, styles = _this$props.styles; var length = styles.arrow.length, floater = styles.floater, floaterCentered = styles.floaterCentered, floaterClosing = styles.floaterClosing, floaterOpening = styles.floaterOpening, floaterWithAnimation = styles.floaterWithAnimation, floaterWithComponent = styles.floaterWithComponent; var element = {}; if (!hideArrow) { if (placement.startsWith('top')) { element.padding = "0 0 ".concat(length, "px"); } else if (placement.startsWith('bottom')) { element.padding = "".concat(length, "px 0 0"); } else if (placement.startsWith('left')) { element.padding = "0 ".concat(length, "px 0 0"); } else if (placement.startsWith('right')) { element.padding = "0 0 0 ".concat(length, "px"); } } if ([STATUS.OPENING, STATUS.OPEN].indexOf(status) !== -1) { element = _objectSpread2(_objectSpread2({}, element), floaterOpening); } if (status === STATUS.CLOSING) { element = _objectSpread2(_objectSpread2({}, element), floaterClosing); } if (status === STATUS.OPEN && !disableAnimation) { element = _objectSpread2(_objectSpread2({}, element), floaterWithAnimation); } if (placement === 'center') { element = _objectSpread2(_objectSpread2({}, element), floaterCentered); } if (component) { element = _objectSpread2(_objectSpread2({}, element), floaterWithComponent); } return _objectSpread2(_objectSpread2({}, floater), element); } }, { key: "render", value: function render() { var _this$props2 = this.props, component = _this$props2.component, closeFn = _this$props2.handleClick, hideArrow = _this$props2.hideArrow, setFloaterRef = _this$props2.setFloaterRef, status = _this$props2.status; var output = {}; var classes = ['__floater']; if (component) { if (/*#__PURE__*/react.isValidElement(component)) { output.content =/*#__PURE__*/react.cloneElement(component, { closeFn: closeFn }); } else { output.content = component({ closeFn: closeFn }); } } else { output.content =/*#__PURE__*/react.createElement(FloaterContainer, this.props); } if (status === STATUS.OPEN) { classes.push('__floater__open'); } if (!hideArrow) { output.arrow =/*#__PURE__*/react.createElement(FloaterArrow, this.props); } return/*#__PURE__*/react.createElement("div", { ref: setFloaterRef, className: classes.join(' '), style: this.style },/*#__PURE__*/react.createElement("div", { className: "__floater__body" }, output.content, output.arrow)); } }]); return Floater; }(react.Component); _defineProperty(Floater, "propTypes", { component: prop_types_default().oneOfType([(prop_types_default()).func, (prop_types_default()).element]), content: (prop_types_default()).node, disableAnimation: (prop_types_default()).bool.isRequired, footer: (prop_types_default()).node, handleClick: (prop_types_default()).func.isRequired, hideArrow: (prop_types_default()).bool.isRequired, open: (prop_types_default()).bool, placement: (prop_types_default()).string.isRequired, positionWrapper: (prop_types_default()).bool.isRequired, setArrowRef: (prop_types_default()).func.isRequired, setFloaterRef: (prop_types_default()).func.isRequired, showCloseButton: (prop_types_default()).bool, status: (prop_types_default()).string.isRequired, styles: (prop_types_default()).object.isRequired, title: (prop_types_default()).node });

      var ReactFloaterWrapper =/*#__PURE__*/function (_React$Component) { _inherits(ReactFloaterWrapper, _React$Component); var _super = _createSuper(ReactFloaterWrapper); function ReactFloaterWrapper() { _classCallCheck(this, ReactFloaterWrapper); return _super.apply(this, arguments); } _createClass(ReactFloaterWrapper, [{ key: "render", value: function render() { var _this$props = this.props, children = _this$props.children, handleClick = _this$props.handleClick, handleMouseEnter = _this$props.handleMouseEnter, handleMouseLeave = _this$props.handleMouseLeave, setChildRef = _this$props.setChildRef, setWrapperRef = _this$props.setWrapperRef, style = _this$props.style, styles = _this$props.styles; var element;/* istanbul ignore else */if (children) { if (react.Children.count(children) === 1) { if (!/*#__PURE__*/react.isValidElement(children)) { element =/*#__PURE__*/react.createElement("span", null, children); } else { var refProp = esm["function"](children.type) ? 'innerRef' : 'ref'; element =/*#__PURE__*/react.cloneElement(react.Children.only(children), _defineProperty({}, refProp, setChildRef)); } } else { element = children; } } if (!element) { return null; } return/*#__PURE__*/react.createElement("span", { ref: setWrapperRef, style: _objectSpread2(_objectSpread2({}, styles), style), onClick: handleClick, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }, element); } }]); return ReactFloaterWrapper; }(react.Component); _defineProperty(ReactFloaterWrapper, "propTypes", { children: (prop_types_default()).node, handleClick: (prop_types_default()).func.isRequired, handleMouseEnter: (prop_types_default()).func.isRequired, handleMouseLeave: (prop_types_default()).func.isRequired, setChildRef: (prop_types_default()).func.isRequired, setWrapperRef: (prop_types_default()).func.isRequired, style: (prop_types_default()).object, styles: (prop_types_default()).object.isRequired });

      var defaultOptions = { zIndex: 100 }; function getStyles(styles) { var options = cjs_default()(defaultOptions, styles.options || {}); return { wrapper: { cursor: 'help', display: 'inline-flex', flexDirection: 'column', zIndex: options.zIndex }, wrapperPosition: { left: -1000, position: 'absolute', top: -1000, visibility: 'hidden' }, floater: { display: 'inline-block', filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))', maxWidth: 300, opacity: 0, position: 'relative', transition: 'opacity 0.3s', visibility: 'hidden', zIndex: options.zIndex }, floaterOpening: { opacity: 1, visibility: 'visible' }, floaterWithAnimation: { opacity: 1, transition: 'opacity 0.3s, transform 0.2s', visibility: 'visible' }, floaterWithComponent: { maxWidth: '100%' }, floaterClosing: { opacity: 0, visibility: 'visible' }, floaterCentered: { left: '50%', position: 'fixed', top: '50%', transform: 'translate(-50%, -50%)' }, container: { backgroundColor: '#fff', color: '#666', minHeight: 60, minWidth: 200, padding: 20, position: 'relative', zIndex: 10 }, title: { borderBottom: '1px solid #555', color: '#555', fontSize: 18, marginBottom: 5, paddingBottom: 6, paddingRight: 18 }, content: { fontSize: 15 }, close: { backgroundColor: 'transparent', border: 0, borderRadius: 0, color: '#555', fontSize: 0, height: 15, outline: 'none', padding: 10, position: 'absolute', right: 0, top: 0, width: 15, WebkitAppearance: 'none' }, footer: { borderTop: '1px solid #ccc', fontSize: 13, marginTop: 10, paddingTop: 5 }, arrow: { color: '#fff', display: 'inline-flex', length: 16, margin: 8, position: 'absolute', spread: 32 }, options: options }; }

      var _excluded = ["arrow", "flip", "offset"]; var POSITIONING_PROPS = ['position', 'top', 'right', 'bottom', 'left']; var ReactFloater =/*#__PURE__*/function (_React$Component) {
        _inherits(ReactFloater, _React$Component); var _super = _createSuper(ReactFloater); function ReactFloater(props) { var _this; _classCallCheck(this, ReactFloater); _this = _super.call(this, props);/* istanbul ignore else */_defineProperty(_assertThisInitialized(_this), "setArrowRef", function (ref) { _this.arrowRef = ref; }); _defineProperty(_assertThisInitialized(_this), "setChildRef", function (ref) { _this.childRef = ref; }); _defineProperty(_assertThisInitialized(_this), "setFloaterRef", function (ref) { _this.floaterRef = ref; }); _defineProperty(_assertThisInitialized(_this), "setWrapperRef", function (ref) { _this.wrapperRef = ref; }); _defineProperty(_assertThisInitialized(_this), "handleTransitionEnd", function () { var status = _this.state.status; var callback = _this.props.callback;/* istanbul ignore else */if (_this.wrapperPopper) { _this.wrapperPopper.instance.update(); } _this.setState({ status: status === STATUS.OPENING ? STATUS.OPEN : STATUS.IDLE }, function () { var newStatus = _this.state.status; callback(newStatus === STATUS.OPEN ? 'open' : 'close', _this.props); }); }); _defineProperty(_assertThisInitialized(_this), "handleClick", function () { var _this$props = _this.props, event = _this$props.event, open = _this$props.open; if (esm.boolean(open)) return; var _this$state = _this.state, positionWrapper = _this$state.positionWrapper, status = _this$state.status;/* istanbul ignore else */if (_this.event === 'click' || _this.event === 'hover' && positionWrapper) { log({ title: 'click', data: [{ event: event, status: status === STATUS.OPEN ? 'closing' : 'opening' }], debug: _this.debug }); _this.toggle(); } }); _defineProperty(_assertThisInitialized(_this), "handleMouseEnter", function () { var _this$props2 = _this.props, event = _this$props2.event, open = _this$props2.open; if (esm.boolean(open) || isMobile()) return; var status = _this.state.status;/* istanbul ignore else */if (_this.event === 'hover' && status === STATUS.IDLE) { log({ title: 'mouseEnter', data: [{ key: 'originalEvent', value: event }], debug: _this.debug }); clearTimeout(_this.eventDelayTimeout); _this.toggle(); } }); _defineProperty(_assertThisInitialized(_this), "handleMouseLeave", function () { var _this$props3 = _this.props, event = _this$props3.event, eventDelay = _this$props3.eventDelay, open = _this$props3.open; if (esm.boolean(open) || isMobile()) return; var _this$state2 = _this.state, status = _this$state2.status, positionWrapper = _this$state2.positionWrapper;/* istanbul ignore else */if (_this.event === 'hover') { log({ title: 'mouseLeave', data: [{ key: 'originalEvent', value: event }], debug: _this.debug }); if (!eventDelay) { _this.toggle(STATUS.IDLE); } else if ([STATUS.OPENING, STATUS.OPEN].indexOf(status) !== -1 && !positionWrapper && !_this.eventDelayTimeout) { _this.eventDelayTimeout = setTimeout(function () { delete _this.eventDelayTimeout; _this.toggle(); }, eventDelay * 1000); } } }); _this.state = { currentPlacement: props.placement, needsUpdate: false, positionWrapper: props.wrapperOptions.position && !!props.target, status: STATUS.INIT, statusWrapper: STATUS.INIT }; _this._isMounted = false; _this.hasMounted = false; if (canUseDOM) { window.addEventListener('load', function () { if (_this.popper) { _this.popper.instance.update(); } if (_this.wrapperPopper) { _this.wrapperPopper.instance.update(); } }); } return _this; } _createClass(ReactFloater, [{ key: "componentDidMount", value: function componentDidMount() { if (!canUseDOM) return; var positionWrapper = this.state.positionWrapper; var _this$props5 = this.props, children = _this$props5.children, open = _this$props5.open, target = _this$props5.target; this._isMounted = true; log({ title: 'init', data: { hasChildren: !!children, hasTarget: !!target, isControlled: esm.boolean(open), positionWrapper: positionWrapper, target: this.target, floater: this.floaterRef }, debug: this.debug }); if (!this.hasMounted) { this.initPopper(); this.hasMounted = true; } if (!children && target && !esm.boolean(open)); } }, {
          key: "componentDidUpdate", value: function componentDidUpdate(prevProps, prevState) {
            if (!canUseDOM) return; var _this$props6 = this.props, autoOpen = _this$props6.autoOpen, open = _this$props6.open, target = _this$props6.target, wrapperOptions = _this$props6.wrapperOptions; var _treeChanges = treeChanges(prevState, this.state), changedFrom = _treeChanges.changedFrom, changed = _treeChanges.changed; if (prevProps.open !== open) {
              var forceStatus;// always follow `open` in controlled mode
              if (esm.boolean(open)) { forceStatus = open ? STATUS.OPENING : STATUS.CLOSING; } this.toggle(forceStatus);
            } if (prevProps.wrapperOptions.position !== wrapperOptions.position || prevProps.target !== target) { this.changeWrapperPosition(this.props); } if (changed('status', STATUS.IDLE) && open) { this.toggle(STATUS.OPEN); } else if (changedFrom('status', STATUS.INIT, STATUS.IDLE) && autoOpen) { this.toggle(STATUS.OPEN); } if (this.popper && changed('status', STATUS.OPENING)) { this.popper.instance.update(); } if (this.floaterRef && (changed('status', STATUS.OPENING) || changed('status', STATUS.CLOSING))) { once(this.floaterRef, 'transitionend', this.handleTransitionEnd); } if (changed('needsUpdate', true)) { this.rebuildPopper(); }
          }
        }, { key: "componentWillUnmount", value: function componentWillUnmount() { if (!canUseDOM) return; this._isMounted = false; if (this.popper) { this.popper.instance.destroy(); } if (this.wrapperPopper) { this.wrapperPopper.instance.destroy(); } } }, { key: "initPopper", value: function initPopper() { var _this2 = this; var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.target; var positionWrapper = this.state.positionWrapper; var _this$props7 = this.props, disableFlip = _this$props7.disableFlip, getPopper = _this$props7.getPopper, hideArrow = _this$props7.hideArrow, offset = _this$props7.offset, placement = _this$props7.placement, wrapperOptions = _this$props7.wrapperOptions; var flipBehavior = placement === 'top' || placement === 'bottom' ? 'flip' : ['right', 'bottom-end', 'top-end', 'left', 'top-start', 'bottom-start'];/* istanbul ignore else */if (placement === 'center') { this.setState({ status: STATUS.IDLE }); } else if (target && this.floaterRef) { var _this$options = this.options, arrow = _this$options.arrow, flip = _this$options.flip, offsetOptions = _this$options.offset, rest = _objectWithoutProperties(_this$options, _excluded); new popper(target, this.floaterRef, { placement: placement, modifiers: _objectSpread2({ arrow: _objectSpread2({ enabled: !hideArrow, element: this.arrowRef }, arrow), flip: _objectSpread2({ enabled: !disableFlip, behavior: flipBehavior }, flip), offset: _objectSpread2({ offset: "0, ".concat(offset, "px") }, offsetOptions) }, rest), onCreate: function onCreate(data) { var _this2$floaterRef; _this2.popper = data; if (!((_this2$floaterRef = _this2.floaterRef) !== null && _this2$floaterRef !== void 0 && _this2$floaterRef.isConnected)) { _this2.setState({ needsUpdate: true }); return; } getPopper(data, 'floater'); if (_this2._isMounted) { _this2.setState({ currentPlacement: data.placement, status: STATUS.IDLE }); } if (placement !== data.placement) { setTimeout(function () { data.instance.update(); }, 1); } }, onUpdate: function onUpdate(data) { _this2.popper = data; var currentPlacement = _this2.state.currentPlacement; if (_this2._isMounted && data.placement !== currentPlacement) { _this2.setState({ currentPlacement: data.placement }); } } }); } if (positionWrapper) { var wrapperOffset = !esm.undefined(wrapperOptions.offset) ? wrapperOptions.offset : 0; new popper(this.target, this.wrapperRef, { placement: wrapperOptions.placement || placement, modifiers: { arrow: { enabled: false }, offset: { offset: "0, ".concat(wrapperOffset, "px") }, flip: { enabled: false } }, onCreate: function onCreate(data) { _this2.wrapperPopper = data; if (_this2._isMounted) { _this2.setState({ statusWrapper: STATUS.IDLE }); } getPopper(data, 'wrapper'); if (placement !== data.placement) { setTimeout(function () { data.instance.update(); }, 1); } } }); } } }, { key: "rebuildPopper", value: function rebuildPopper() { var _this3 = this; this.floaterRefInterval = setInterval(function () { var _this3$floaterRef; if ((_this3$floaterRef = _this3.floaterRef) !== null && _this3$floaterRef !== void 0 && _this3$floaterRef.isConnected) { clearInterval(_this3.floaterRefInterval); _this3.setState({ needsUpdate: false }); _this3.initPopper(); } }, 50); } }, { key: "changeWrapperPosition", value: function changeWrapperPosition(_ref) { var target = _ref.target, wrapperOptions = _ref.wrapperOptions; this.setState({ positionWrapper: wrapperOptions.position && !!target }); } }, { key: "toggle", value: function toggle(forceStatus) { var status = this.state.status; var nextStatus = status === STATUS.OPEN ? STATUS.CLOSING : STATUS.OPENING; if (!esm.undefined(forceStatus)) { nextStatus = forceStatus; } this.setState({ status: nextStatus }); } }, { key: "debug", get: function get() { var debug = this.props.debug; return debug || !!__webpack_require__.g.ReactFloaterDebug; } }, { key: "event", get: function get() { var _this$props8 = this.props, disableHoverToClick = _this$props8.disableHoverToClick, event = _this$props8.event; if (event === 'hover' && isMobile() && !disableHoverToClick) { return 'click'; } return event; } }, { key: "options", get: function get() { var options = this.props.options; return cjs_default()(DEFAULTS, options || {}); } }, { key: "styles", get: function get() { var _this4 = this; var _this$state3 = this.state, status = _this$state3.status, positionWrapper = _this$state3.positionWrapper, statusWrapper = _this$state3.statusWrapper; var styles = this.props.styles; var nextStyles = cjs_default()(getStyles(styles), styles); if (positionWrapper) { var wrapperStyles; if (!([STATUS.IDLE].indexOf(status) !== -1) || !([STATUS.IDLE].indexOf(statusWrapper) !== -1)) { wrapperStyles = nextStyles.wrapperPosition; } else { wrapperStyles = this.wrapperPopper.styles; } nextStyles.wrapper = _objectSpread2(_objectSpread2({}, nextStyles.wrapper), wrapperStyles); }/* istanbul ignore else */if (this.target) { var targetStyles = window.getComputedStyle(this.target);/* istanbul ignore else */if (this.wrapperStyles) { nextStyles.wrapper = _objectSpread2(_objectSpread2({}, nextStyles.wrapper), this.wrapperStyles); } else if (!(['relative', 'static'].indexOf(targetStyles.position) !== -1)) { this.wrapperStyles = {}; if (!positionWrapper) { POSITIONING_PROPS.forEach(function (d) { _this4.wrapperStyles[d] = targetStyles[d]; }); nextStyles.wrapper = _objectSpread2(_objectSpread2({}, nextStyles.wrapper), this.wrapperStyles); this.target.style.position = 'relative'; this.target.style.top = 'auto'; this.target.style.right = 'auto'; this.target.style.bottom = 'auto'; this.target.style.left = 'auto'; } } } return nextStyles; } }, { key: "target", get: function get() { if (!canUseDOM) return null; var target = this.props.target; if (target) { if (esm.domElement(target)) { return target; } return document.querySelector(target); } return this.childRef || this.wrapperRef; } }, { key: "render", value: function render() { var _this$state4 = this.state, currentPlacement = _this$state4.currentPlacement, positionWrapper = _this$state4.positionWrapper, status = _this$state4.status; var _this$props9 = this.props, children = _this$props9.children, component = _this$props9.component, content = _this$props9.content, disableAnimation = _this$props9.disableAnimation, footer = _this$props9.footer, hideArrow = _this$props9.hideArrow, id = _this$props9.id, open = _this$props9.open, showCloseButton = _this$props9.showCloseButton, style = _this$props9.style, target = _this$props9.target, title = _this$props9.title; var wrapper =/*#__PURE__*/react.createElement(ReactFloaterWrapper, { handleClick: this.handleClick, handleMouseEnter: this.handleMouseEnter, handleMouseLeave: this.handleMouseLeave, setChildRef: this.setChildRef, setWrapperRef: this.setWrapperRef, style: style, styles: this.styles.wrapper }, children); var output = {}; if (positionWrapper) { output.wrapperInPortal = wrapper; } else { output.wrapperAsChildren = wrapper; } return/*#__PURE__*/react.createElement("span", null,/*#__PURE__*/react.createElement(ReactFloaterPortal, { hasChildren: !!children, id: id, placement: currentPlacement, setRef: this.setFloaterRef, target: target, zIndex: this.styles.options.zIndex },/*#__PURE__*/react.createElement(Floater, { component: component, content: content, disableAnimation: disableAnimation, footer: footer, handleClick: this.handleClick, hideArrow: hideArrow || currentPlacement === 'center', open: open, placement: currentPlacement, positionWrapper: positionWrapper, setArrowRef: this.setArrowRef, setFloaterRef: this.setFloaterRef, showCloseButton: showCloseButton, status: status, styles: this.styles, title: title }), output.wrapperInPortal), output.wrapperAsChildren); } }]); return ReactFloater;
      }(react.Component); _defineProperty(ReactFloater, "propTypes", { autoOpen: (prop_types_default()).bool, callback: (prop_types_default()).func, children: (prop_types_default()).node, component: (0, isRequiredIf/* default */.Z)(prop_types_default().oneOfType([(prop_types_default()).func, (prop_types_default()).element]), function (props) { return !props.content; }), content: (0, isRequiredIf/* default */.Z)((prop_types_default()).node, function (props) { return !props.component; }), debug: (prop_types_default()).bool, disableAnimation: (prop_types_default()).bool, disableFlip: (prop_types_default()).bool, disableHoverToClick: (prop_types_default()).bool, event: prop_types_default().oneOf(['hover', 'click']), eventDelay: (prop_types_default()).number, footer: (prop_types_default()).node, getPopper: (prop_types_default()).func, hideArrow: (prop_types_default()).bool, id: prop_types_default().oneOfType([(prop_types_default()).string, (prop_types_default()).number]), offset: (prop_types_default()).number, open: (prop_types_default()).bool, options: (prop_types_default()).object, placement: prop_types_default().oneOf(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end', 'auto', 'center']), showCloseButton: (prop_types_default()).bool, style: (prop_types_default()).object, styles: (prop_types_default()).object, target: prop_types_default().oneOfType([(prop_types_default()).object, (prop_types_default()).string]), title: (prop_types_default()).node, wrapperOptions: prop_types_default().shape({ offset: (prop_types_default()).number, placement: prop_types_default().oneOf(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end', 'auto']), position: (prop_types_default()).bool }) }); _defineProperty(ReactFloater, "defaultProps", { autoOpen: false, callback: noop, debug: false, disableAnimation: false, disableFlip: false, disableHoverToClick: false, event: 'click', eventDelay: 0.4, getPopper: noop, hideArrow: false, offset: 15, placement: 'bottom', showCloseButton: false, styles: {}, target: null, wrapperOptions: { position: false } });



      ;// CONCATENATED MODULE: ./node_modules/react-joyride/es/index.js












      function es_ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);

        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys.push.apply(keys, symbols);
        }

        return keys;
      }

      function es_objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = null != arguments[i] ? arguments[i] : {};
          i % 2 ? es_ownKeys(Object(source), !0).forEach(function (key) {
            es_defineProperty(target, key, source[key]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : es_ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }

        return target;
      }

      function es_classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      function es_defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      function es_createClass(Constructor, protoProps, staticProps) {
        if (protoProps) es_defineProperties(Constructor.prototype, protoProps);
        if (staticProps) es_defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", {
          writable: false
        });
        return Constructor;
      }

      function es_defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }

        return obj;
      }

      function es_extends() {
        es_extends = Object.assign ? Object.assign.bind() : function (target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }

          return target;
        };
        return es_extends.apply(this, arguments);
      }

      function es_inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            writable: true,
            configurable: true
          }
        });
        Object.defineProperty(subClass, "prototype", {
          writable: false
        });
        if (superClass) es_setPrototypeOf(subClass, superClass);
      }

      function es_getPrototypeOf(o) {
        es_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
        return es_getPrototypeOf(o);
      }

      function es_setPrototypeOf(o, p) {
        es_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
        };
        return es_setPrototypeOf(o, p);
      }

      function es_isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;

        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { }));
          return true;
        } catch (e) {
          return false;
        }
      }

      function es_objectWithoutPropertiesLoose(source, excluded) {
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
      }

      function es_objectWithoutProperties(source, excluded) {
        if (source == null) return {};

        var target = es_objectWithoutPropertiesLoose(source, excluded);

        var key, i;

        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
          }
        }

        return target;
      }

      function es_assertThisInitialized(self) {
        if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return self;
      }

      function es_possibleConstructorReturn(self, call) {
        if (call && (typeof call === "object" || typeof call === "function")) {
          return call;
        } else if (call !== void 0) {
          throw new TypeError("Derived constructors may only return object or undefined");
        }

        return es_assertThisInitialized(self);
      }

      function es_createSuper(Derived) {
        var hasNativeReflectConstruct = es_isNativeReflectConstruct();

        return function _createSuperInternal() {
          var Super = es_getPrototypeOf(Derived),
            result;

          if (hasNativeReflectConstruct) {
            var NewTarget = es_getPrototypeOf(this).constructor;

            result = Reflect.construct(Super, arguments, NewTarget);
          } else {
            result = Super.apply(this, arguments);
          }

          return es_possibleConstructorReturn(this, result);
        };
      }

      var ACTIONS = {
        INIT: 'init',
        START: 'start',
        STOP: 'stop',
        RESET: 'reset',
        PREV: 'prev',
        NEXT: 'next',
        GO: 'go',
        CLOSE: 'close',
        SKIP: 'skip',
        UPDATE: 'update'
      };

      var EVENTS = {
        TOUR_START: 'tour:start',
        STEP_BEFORE: 'step:before',
        BEACON: 'beacon',
        TOOLTIP: 'tooltip',
        STEP_AFTER: 'step:after',
        TOUR_END: 'tour:end',
        TOUR_STATUS: 'tour:status',
        TARGET_NOT_FOUND: 'error:target_not_found',
        ERROR: 'error'
      };

      var LIFECYCLE = {
        INIT: 'init',
        READY: 'ready',
        BEACON: 'beacon',
        TOOLTIP: 'tooltip',
        COMPLETE: 'complete',
        ERROR: 'error'
      };

      var es_STATUS = {
        IDLE: 'idle',
        READY: 'ready',
        WAITING: 'waiting',
        RUNNING: 'running',
        PAUSED: 'paused',
        SKIPPED: 'skipped',
        FINISHED: 'finished',
        ERROR: 'error'
      };

      var es_canUseDOM = (exenv_default()).canUseDOM;
      var es_isReact16 = react_dom.createPortal !== undefined;
      /**
       * Get the current browser
       *
       * @param {string} userAgent
       *
       * @returns {String}
       */

      function getBrowser() {
        var userAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navigator.userAgent;
        var browser = userAgent;

        if (typeof window === 'undefined') {
          browser = 'node';
        } else if (document.documentMode) {
          browser = 'ie';
        } else if (/Edge/.test(userAgent)) {
          browser = 'edge';
        } // Opera 8.0+
        else if (Boolean(window.opera) || userAgent.indexOf(' OPR/') >= 0) {
          browser = 'opera';
        } // Firefox 1.0+
        else if (typeof window.InstallTrigger !== 'undefined') {
          browser = 'firefox';
        } // Chrome 1+
        else if (window.chrome) {
          browser = 'chrome';
        } // Safari (and Chrome iOS, Firefox iOS)
        else if (/(Version\/([0-9._]+).*Safari|CriOS|FxiOS| Mobile\/)/.test(userAgent)) {
          browser = 'safari';
        }

        return browser;
      }
      /**
       * Get the toString Object type
       * @param {*} value
       * @returns {string}
       */

      function es_getObjectType(value) {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
      }
      /**
       * Get text from React components
       *
       * @param {*} root
       *
       * @returns {string}
       */

      function getText(root) {
        var content = [];

        var recurse = function recurse(child) {
          /* istanbul ignore else */
          if (typeof child === 'string' || typeof child === 'number') {
            content.push(child);
          } else if (Array.isArray(child)) {
            child.forEach(function (c) {
              return recurse(c);
            });
          } else if (child && child.props) {
            var children = child.props.children;

            if (Array.isArray(children)) {
              children.forEach(function (c) {
                return recurse(c);
              });
            } else {
              recurse(children);
            }
          }
        };

        recurse(root);
        return content.join(' ').trim();
      }
      function es_hasOwnProperty(value, key) {
        return Object.prototype.hasOwnProperty.call(value, key);
      }
      function hasValidKeys(value, keys) {
        if (!src_default.plainObject(value) || !src_default.array(keys)) {
          return false;
        }

        return Object.keys(value).every(function (d) {
          return keys.indexOf(d) !== -1;
        });
      }
      /**
       * Convert hex to RGB
       *
       * @param {string} hex
       * @returns {Array}
       */

      function hexToRGB(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        var properHex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(properHex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [];
      }
      /**
       * Decide if the step shouldn't skip the beacon
       * @param {Object} step
       *
       * @returns {boolean}
       */

      function hideBeacon(step) {
        return step.disableBeacon || step.placement === 'center';
      }
      /**
       * Compare if two variables are equal
       *
       * @param {*} left
       * @param {*} right
       *
       * @returns {boolean}
       */

      function isEqual(left, right) {
        var type;
        var hasReactElement = /*#__PURE__*/(0, react.isValidElement)(left) || /*#__PURE__*/(0, react.isValidElement)(right);
        var hasUndefined = src_default.undefined(left) || src_default.undefined(right);

        if (es_getObjectType(left) !== es_getObjectType(right) || hasReactElement || hasUndefined) {
          return false;
        }

        if (src_default.domElement(left)) {
          return left.isSameNode(right);
        }

        if (src_default.number(left)) {
          return left === right;
        }

        if (src_default["function"](left)) {
          return left.toString() === right.toString();
        }

        for (var key in left) {
          /* istanbul ignore else */
          if (es_hasOwnProperty(left, key)) {
            if (typeof left[key] === 'undefined' || typeof right[key] === 'undefined') {
              return false;
            }

            type = es_getObjectType(left[key]);

            if (['object', 'array'].indexOf(type) !== -1 && isEqual(left[key], right[key])) {
              continue;
            }

            if (type === 'function' && isEqual(left[key], right[key])) {
              continue;
            }

            if (left[key] !== right[key]) {
              return false;
            }
          }
        }

        for (var p in right) {
          /* istanbul ignore else */
          if (es_hasOwnProperty(right, p)) {
            if (typeof left[p] === 'undefined') {
              return false;
            }
          }
        }

        return true;
      }
      /**
       * Detect legacy browsers
       *
       * @returns {boolean}
       */

      function isLegacy() {
        return !(['chrome', 'safari', 'firefox', 'opera'].indexOf(getBrowser()) !== -1);
      }
      /**
       * Log method calls if debug is enabled
       *
       * @private
       * @param {Object}       arg
       * @param {string}       arg.title    - The title the logger was called from
       * @param {Object|Array} [arg.data]   - The data to be logged
       * @param {boolean}      [arg.warn]  - If true, the message will be a warning
       * @param {boolean}      [arg.debug] - Nothing will be logged unless debug is true
       */

      function es_log(_ref) {
        var title = _ref.title,
          data = _ref.data,
          _ref$warn = _ref.warn,
          warn = _ref$warn === void 0 ? false : _ref$warn,
          _ref$debug = _ref.debug,
          debug = _ref$debug === void 0 ? false : _ref$debug;

        /* eslint-disable no-console */
        var logFn = warn ? console.warn || console.error : console.log;

        if (debug) {
          if (title && data) {
            console.groupCollapsed("%creact-joyride: ".concat(title), 'color: #ff0044; font-weight: bold; font-size: 12px;');

            if (Array.isArray(data)) {
              data.forEach(function (d) {
                if (src_default.plainObject(d) && d.key) {
                  logFn.apply(console, [d.key, d.value]);
                } else {
                  logFn.apply(console, [d]);
                }
              });
            } else {
              logFn.apply(console, [data]);
            }

            console.groupEnd();
          } else {
            console.error('Missing title or data props');
          }
        }
        /* eslint-enable */

      }

      var defaultState = {
        action: '',
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: 0,
        status: es_STATUS.IDLE
      };
      var validKeys = ['action', 'index', 'lifecycle', 'status'];
      function createStore(props) {
        var store = new Map();
        var data = new Map();

        var Store = /*#__PURE__*/function () {
          function Store() {
            var _this = this;

            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              _ref$continuous = _ref.continuous,
              continuous = _ref$continuous === void 0 ? false : _ref$continuous,
              stepIndex = _ref.stepIndex,
              _ref$steps = _ref.steps,
              _steps = _ref$steps === void 0 ? [] : _ref$steps;

            es_classCallCheck(this, Store);

            es_defineProperty(this, "listener", void 0);

            es_defineProperty(this, "setSteps", function (steps) {
              var _this$getState = _this.getState(),
                size = _this$getState.size,
                status = _this$getState.status;

              var state = {
                size: steps.length,
                status: status
              };
              data.set('steps', steps);

              if (status === es_STATUS.WAITING && !size && steps.length) {
                state.status = es_STATUS.RUNNING;
              }

              _this.setState(state);
            });

            es_defineProperty(this, "addListener", function (listener) {
              _this.listener = listener;
            });

            es_defineProperty(this, "update", function (state) {
              if (!hasValidKeys(state, validKeys)) {
                throw new Error("State is not valid. Valid keys: ".concat(validKeys.join(', ')));
              }

              _this.setState(es_objectSpread2({}, _this.getNextState(es_objectSpread2(es_objectSpread2(es_objectSpread2({}, _this.getState()), state), {}, {
                action: state.action || ACTIONS.UPDATE
              }), true)));
            });

            es_defineProperty(this, "start", function (nextIndex) {
              var _this$getState2 = _this.getState(),
                index = _this$getState2.index,
                size = _this$getState2.size;

              _this.setState(es_objectSpread2(es_objectSpread2({}, _this.getNextState({
                action: ACTIONS.START,
                index: src_default.number(nextIndex) ? nextIndex : index
              }, true)), {}, {
                status: size ? es_STATUS.RUNNING : es_STATUS.WAITING
              }));
            });

            es_defineProperty(this, "stop", function () {
              var advance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

              var _this$getState3 = _this.getState(),
                index = _this$getState3.index,
                status = _this$getState3.status;

              if ([es_STATUS.FINISHED, es_STATUS.SKIPPED].indexOf(status) !== -1) return;

              _this.setState(es_objectSpread2(es_objectSpread2({}, _this.getNextState({
                action: ACTIONS.STOP,
                index: index + (advance ? 1 : 0)
              })), {}, {
                status: es_STATUS.PAUSED
              }));
            });

            es_defineProperty(this, "close", function () {
              var _this$getState4 = _this.getState(),
                index = _this$getState4.index,
                status = _this$getState4.status;

              if (status !== es_STATUS.RUNNING) return;

              _this.setState(es_objectSpread2({}, _this.getNextState({
                action: ACTIONS.CLOSE,
                index: index + 1
              })));
            });

            es_defineProperty(this, "go", function (nextIndex) {
              var _this$getState5 = _this.getState(),
                controlled = _this$getState5.controlled,
                status = _this$getState5.status;

              if (controlled || status !== es_STATUS.RUNNING) return;

              var step = _this.getSteps()[nextIndex];

              _this.setState(es_objectSpread2(es_objectSpread2({}, _this.getNextState({
                action: ACTIONS.GO,
                index: nextIndex
              })), {}, {
                status: step ? status : es_STATUS.FINISHED
              }));
            });

            es_defineProperty(this, "info", function () {
              return _this.getState();
            });

            es_defineProperty(this, "next", function () {
              var _this$getState6 = _this.getState(),
                index = _this$getState6.index,
                status = _this$getState6.status;

              if (status !== es_STATUS.RUNNING) return;

              _this.setState(_this.getNextState({
                action: ACTIONS.NEXT,
                index: index + 1
              }));
            });

            es_defineProperty(this, "open", function () {
              var _this$getState7 = _this.getState(),
                status = _this$getState7.status;

              if (status !== es_STATUS.RUNNING) return;

              _this.setState(es_objectSpread2({}, _this.getNextState({
                action: ACTIONS.UPDATE,
                lifecycle: LIFECYCLE.TOOLTIP
              })));
            });

            es_defineProperty(this, "prev", function () {
              var _this$getState8 = _this.getState(),
                index = _this$getState8.index,
                status = _this$getState8.status;

              if (status !== es_STATUS.RUNNING) return;

              _this.setState(es_objectSpread2({}, _this.getNextState({
                action: ACTIONS.PREV,
                index: index - 1
              })));
            });

            es_defineProperty(this, "reset", function () {
              var restart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

              var _this$getState9 = _this.getState(),
                controlled = _this$getState9.controlled;

              if (controlled) return;

              _this.setState(es_objectSpread2(es_objectSpread2({}, _this.getNextState({
                action: ACTIONS.RESET,
                index: 0
              })), {}, {
                status: restart ? es_STATUS.RUNNING : es_STATUS.READY
              }));
            });

            es_defineProperty(this, "skip", function () {
              var _this$getState10 = _this.getState(),
                status = _this$getState10.status;

              if (status !== es_STATUS.RUNNING) return;

              _this.setState({
                action: ACTIONS.SKIP,
                lifecycle: LIFECYCLE.INIT,
                status: es_STATUS.SKIPPED
              });
            });

            this.setState({
              action: ACTIONS.INIT,
              controlled: src_default.number(stepIndex),
              continuous: continuous,
              index: src_default.number(stepIndex) ? stepIndex : 0,
              lifecycle: LIFECYCLE.INIT,
              status: _steps.length ? es_STATUS.READY : es_STATUS.IDLE
            }, true);
            this.setSteps(_steps);
          }

          es_createClass(Store, [{
            key: "setState",
            value: function setState(nextState) {
              var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
              var state = this.getState();

              var _state$nextState = es_objectSpread2(es_objectSpread2({}, state), nextState),
                action = _state$nextState.action,
                index = _state$nextState.index,
                lifecycle = _state$nextState.lifecycle,
                size = _state$nextState.size,
                status = _state$nextState.status;

              store.set('action', action);
              store.set('index', index);
              store.set('lifecycle', lifecycle);
              store.set('size', size);
              store.set('status', status);

              if (initial) {
                store.set('controlled', nextState.controlled);
                store.set('continuous', nextState.continuous);
              }
              /* istanbul ignore else */


              if (this.listener && this.hasUpdatedState(state)) {
                // console.log('▶ ▶ ▶ NEW STATE', this.getState());
                this.listener(this.getState());
              }
            }
          }, {
            key: "getState",
            value: function getState() {
              if (!store.size) {
                return es_objectSpread2({}, defaultState);
              }

              return {
                action: store.get('action') || '',
                controlled: store.get('controlled') || false,
                index: parseInt(store.get('index'), 10),
                lifecycle: store.get('lifecycle') || '',
                size: store.get('size') || 0,
                status: store.get('status') || ''
              };
            }
          }, {
            key: "getNextState",
            value: function getNextState(state) {
              var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

              var _this$getState11 = this.getState(),
                action = _this$getState11.action,
                controlled = _this$getState11.controlled,
                index = _this$getState11.index,
                size = _this$getState11.size,
                status = _this$getState11.status;

              var newIndex = src_default.number(state.index) ? state.index : index;
              var nextIndex = controlled && !force ? index : Math.min(Math.max(newIndex, 0), size);
              return {
                action: state.action || action,
                controlled: controlled,
                index: nextIndex,
                lifecycle: state.lifecycle || LIFECYCLE.INIT,
                size: state.size || size,
                status: nextIndex === size ? es_STATUS.FINISHED : state.status || status
              };
            }
          }, {
            key: "hasUpdatedState",
            value: function hasUpdatedState(oldState) {
              var before = JSON.stringify(oldState);
              var after = JSON.stringify(this.getState());
              return before !== after;
            }
          }, {
            key: "getSteps",
            value: function getSteps() {
              var steps = data.get('steps');
              return Array.isArray(steps) ? steps : [];
            }
          }, {
            key: "getHelpers",
            value: function getHelpers() {
              return {
                close: this.close,
                go: this.go,
                info: this.info,
                next: this.next,
                open: this.open,
                prev: this.prev,
                reset: this.reset,
                skip: this.skip
              };
            }
          }]);

          return Store;
        }();

        return new Store(props);
      }

      /**
       * Find the bounding client rect
       *
       * @private
       * @param {HTMLElement} element - The target element
       * @returns {Object}
       */

      function es_getClientRect(element) {
        if (!element) {
          return {};
        }

        return element.getBoundingClientRect();
      }
      /**
       * Helper function to get the browser-normalized "document height"
       * @returns {Number}
       */

      function getDocumentHeight() {
        var _document = document,
          body = _document.body,
          html = _document.documentElement;

        if (!body || !html) {
          return 0;
        }

        return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      }
      /**
       * Find and return the target DOM element based on a step's 'target'.
       *
       * @private
       * @param {string|HTMLElement} element
       *
       * @returns {HTMLElement|null}
       */

      function getElement(element) {
        /* istanbul ignore else */
        if (typeof element === 'string') {
          return document.querySelector(element);
        }

        return element;
      }
      /**
       *  Get computed style property
       *
       * @param {HTMLElement} el
       *
       * @returns {Object}
       */

      function es_getStyleComputedProperty(el) {
        if (!el || el.nodeType !== 1) {
          return {};
        }

        return getComputedStyle(el);
      }
      /**
       * Get scroll parent with fix
       *
       * @param {HTMLElement} element
       * @param {boolean} skipFix
       * @param {boolean} [forListener]
       *
       * @returns {*}
       */

      function es_getScrollParent(element, skipFix, forListener) {
        var parent = scrollparent_default()(element);

        if (parent.isSameNode(scrollDoc())) {
          if (forListener) {
            return document;
          }

          return scrollDoc();
        }

        var hasScrolling = parent.scrollHeight > parent.offsetHeight;
        /* istanbul ignore else */

        if (!hasScrolling && !skipFix) {
          parent.style.overflow = 'initial';
          return scrollDoc();
        }

        return parent;
      }
      /**
       * Check if the element has custom scroll parent
       *
       * @param {HTMLElement} element
       * @param {boolean} skipFix
       *
       * @returns {boolean}
       */

      function hasCustomScrollParent(element, skipFix) {
        if (!element) return false;
        var parent = es_getScrollParent(element, skipFix);
        return !parent.isSameNode(scrollDoc());
      }
      /**
       * Check if the element has custom offset parent
       *
       * @param {HTMLElement} element
       *
       * @returns {boolean}
       */

      function hasCustomOffsetParent(element) {
        return element.offsetParent !== document.body;
      }
      /**
       * Check if an element has fixed/sticky position
       * @param {HTMLElement|Node} el
       * @param {string} [type]
       *
       * @returns {boolean}
       */

      function hasPosition(el) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fixed';

        if (!el || !(el instanceof HTMLElement)) {
          return false;
        }

        var nodeName = el.nodeName;

        if (nodeName === 'BODY' || nodeName === 'HTML') {
          return false;
        }

        if (es_getStyleComputedProperty(el).position === type) {
          return true;
        }

        return hasPosition(el.parentNode, type);
      }
      /**
       * Check if the element is visible
       *
       * @param {HTMLElement} element
       *
       * @returns {boolean}
       */

      function isElementVisible(element) {
        if (!element) return false;
        var parentElement = element;

        while (parentElement) {
          if (parentElement === document.body) break;
          /* istanbul ignore else */

          if (parentElement instanceof HTMLElement) {
            var _getComputedStyle = getComputedStyle(parentElement),
              display = _getComputedStyle.display,
              visibility = _getComputedStyle.visibility;

            if (display === 'none' || visibility === 'hidden') {
              return false;
            }
          }

          parentElement = parentElement.parentNode;
        }

        return true;
      }
      /**
       * Find and return the target DOM element based on a step's 'target'.
       *
       * @private
       * @param {string|HTMLElement} element
       * @param {number} offset
       * @param {boolean} skipFix
       *
       * @returns {HTMLElement|undefined}
       */

      function getElementPosition(element, offset, skipFix) {
        var elementRect = es_getClientRect(element);
        var parent = es_getScrollParent(element, skipFix);
        var hasScrollParent = hasCustomScrollParent(element, skipFix);
        var parentTop = 0;
        /* istanbul ignore else */

        if (parent instanceof HTMLElement) {
          parentTop = parent.scrollTop;
        }

        var top = elementRect.top + (!hasScrollParent && !hasPosition(element) ? parentTop : 0);
        return Math.floor(top - offset);
      }
      /**
       * Get the offsetTop of each element up to the body
       *
       * @param {HTMLElement} element
       *
       * @returns {number}
       */

      function getTopOffset(element) {
        if (element instanceof HTMLElement) {
          if (element.offsetParent instanceof HTMLElement) {
            return getTopOffset(element.offsetParent) + element.offsetTop;
          }

          return element.offsetTop;
        }

        return 0;
      }
      /**
       * Get the scrollTop position
       *
       * @param {HTMLElement} element
       * @param {number} offset
       * @param {boolean} skipFix
       *
       * @returns {number}
       */

      function getScrollTo(element, offset, skipFix) {
        if (!element) {
          return 0;
        }

        var parent = scrollparent_default()(element);
        var top = getTopOffset(element);

        if (hasCustomScrollParent(element, skipFix) && !hasCustomOffsetParent(element)) {
          top -= getTopOffset(parent);
        }

        return Math.floor(top - offset);
      }
      function scrollDoc() {
        return document.scrollingElement || document.createElement('body');
      }
      /**
       * Scroll to position
       * @param {number} value
       * @param {HTMLElement} element
       * @param {number} scrollDuration
       * @returns {Promise<*>}
       */

      function scrollTo(value) {
        var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scrollDoc();
        var scrollDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;
        return new Promise(function (resolve, reject) {
          var scrollTop = element.scrollTop;
          var limit = value > scrollTop ? value - scrollTop : scrollTop - value;
          scroll_default().top(element, value, {
            duration: limit < 100 ? 50 : scrollDuration
          }, function (error) {
            if (error && error.message !== 'Element already at target scroll position') {
              return reject(error);
            }

            return resolve();
          });
        });
      }

      function createChainableTypeChecker(validate) {
        function checkType(isRequired, props, propName, componentName, location, propFullName) {
          var componentNameSafe = componentName || '<<anonymous>>';
          var propFullNameSafe = propFullName || propName;
          /* istanbul ignore else */

          if (props[propName] == null) {
            if (isRequired) {
              return new Error("Required ".concat(location, " `").concat(propFullNameSafe, "` was not specified in `").concat(componentNameSafe, "`."));
            }

            return null;
          }

          for (var _len = arguments.length, args = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
            args[_key - 6] = arguments[_key];
          }

          return validate.apply(void 0, [props, propName, componentNameSafe, location, propFullNameSafe].concat(args));
        }

        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);
        return chainedCheckType;
      }

      createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var Component = propValue;

        if (! /*#__PURE__*/react.isValidElement(propValue) && (0, react_is.isValidElementType)(propValue)) {
          var ownProps = {
            ref: function ref() { },
            step: {}
          };
          Component = /*#__PURE__*/react.createElement(Component, ownProps);
        }

        if (src_default.string(propValue) || src_default.number(propValue) || !(0, react_is.isValidElementType)(propValue) || !([react_is.Element, react_is.ForwardRef].indexOf((0, react_is.typeOf)(Component)) !== -1)) {
          return new Error("Invalid ".concat(location, " `").concat(propFullName, "` supplied to `").concat(componentName, "`. Expected a React class or forwardRef."));
        }

        return undefined;
      });

      var es_defaultOptions = {
        arrowColor: '#fff',
        backgroundColor: '#fff',
        beaconSize: 36,
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        primaryColor: '#f04',
        spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
        textColor: '#333',
        zIndex: 100
      };
      var buttonBase = {
        backgroundColor: 'transparent',
        border: 0,
        borderRadius: 0,
        color: '#555',
        cursor: 'pointer',
        fontSize: 16,
        lineHeight: 1,
        padding: 8,
        WebkitAppearance: 'none'
      };
      var spotlight = {
        borderRadius: 4,
        position: 'absolute'
      };
      function es_getStyles() {
        var stepStyles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var options = cjs_default()(es_defaultOptions, stepStyles.options || {});
        var width = 290;

        if (window.innerWidth > 480) {
          width = 380;
        }

        if (options.width) {
          if (window.innerWidth < options.width) {
            width = window.innerWidth - 30;
          } else {
            width = options.width; //eslint-disable-line prefer-destructuring
          }
        }

        var overlay = {
          bottom: 0,
          left: 0,
          overflow: 'hidden',
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: options.zIndex
        };
        var defaultStyles = {
          beacon: es_objectSpread2(es_objectSpread2({}, buttonBase), {}, {
            display: 'inline-block',
            height: options.beaconSize,
            position: 'relative',
            width: options.beaconSize,
            zIndex: options.zIndex
          }),
          beaconInner: {
            animation: 'joyride-beacon-inner 1.2s infinite ease-in-out',
            backgroundColor: options.primaryColor,
            borderRadius: '50%',
            display: 'block',
            height: '50%',
            left: '50%',
            opacity: 0.7,
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%'
          },
          beaconOuter: {
            animation: 'joyride-beacon-outer 1.2s infinite ease-in-out',
            backgroundColor: "rgba(".concat(hexToRGB(options.primaryColor).join(','), ", 0.2)"),
            border: "2px solid ".concat(options.primaryColor),
            borderRadius: '50%',
            boxSizing: 'border-box',
            display: 'block',
            height: '100%',
            left: 0,
            opacity: 0.9,
            position: 'absolute',
            top: 0,
            transformOrigin: 'center',
            width: '100%'
          },
          tooltip: {
            backgroundColor: options.backgroundColor,
            borderRadius: 5,
            boxSizing: 'border-box',
            color: options.textColor,
            fontSize: 16,
            maxWidth: '100%',
            padding: 15,
            position: 'relative',
            width: width
          },
          tooltipContainer: {
            lineHeight: 1.4,
            textAlign: 'center'
          },
          tooltipTitle: {
            fontSize: 18,
            margin: 0
          },
          tooltipContent: {
            padding: '20px 10px'
          },
          tooltipFooter: {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 15
          },
          tooltipFooterSpacer: {
            flex: 1
          },
          buttonNext: es_objectSpread2(es_objectSpread2({}, buttonBase), {}, {
            backgroundColor: options.primaryColor,
            borderRadius: 4,
            color: '#fff'
          }),
          buttonBack: es_objectSpread2(es_objectSpread2({}, buttonBase), {}, {
            color: options.primaryColor,
            marginLeft: 'auto',
            marginRight: 5
          }),
          buttonClose: es_objectSpread2(es_objectSpread2({}, buttonBase), {}, {
            color: options.textColor,
            height: 14,
            padding: 15,
            position: 'absolute',
            right: 0,
            top: 0,
            width: 14
          }),
          buttonSkip: es_objectSpread2(es_objectSpread2({}, buttonBase), {}, {
            color: options.textColor,
            fontSize: 14
          }),
          overlay: es_objectSpread2(es_objectSpread2({}, overlay), {}, {
            backgroundColor: options.overlayColor,
            mixBlendMode: 'hard-light'
          }),
          overlayLegacy: es_objectSpread2({}, overlay),
          overlayLegacyCenter: es_objectSpread2(es_objectSpread2({}, overlay), {}, {
            backgroundColor: options.overlayColor
          }),
          spotlight: es_objectSpread2(es_objectSpread2({}, spotlight), {}, {
            backgroundColor: 'gray'
          }),
          spotlightLegacy: es_objectSpread2(es_objectSpread2({}, spotlight), {}, {
            boxShadow: "0 0 0 9999px ".concat(options.overlayColor, ", ").concat(options.spotlightShadow)
          }),
          floaterStyles: {
            arrow: {
              color: options.arrowColor
            },
            options: {
              zIndex: options.zIndex + 100
            }
          },
          options: options
        };
        return cjs_default()(defaultStyles, stepStyles);
      }

      var es_DEFAULTS = {
        floaterProps: {
          options: {
            preventOverflow: {
              boundariesElement: 'scrollParent'
            }
          },
          wrapperOptions: {
            offset: -18,
            position: true
          }
        },
        locale: {
          back: 'Back',
          close: 'Close',
          last: 'Last',
          next: 'Next',
          open: 'Open the dialog',
          skip: 'Skip'
        },
        step: {
          event: 'click',
          placement: 'bottom',
          offset: 10
        }
      };

      function getTourProps(props) {
        var sharedTourProps = ['beaconComponent', 'disableCloseOnEsc', 'disableOverlay', 'disableOverlayClose', 'disableScrolling', 'disableScrollParentFix', 'floaterProps', 'hideBackButton', 'hideCloseButton', 'locale', 'showProgress', 'showSkipButton', 'spotlightClicks', 'spotlightPadding', 'styles', 'tooltipComponent'];
        return Object.keys(props).filter(function (d) {
          return sharedTourProps.indexOf(d) !== -1;
        }).reduce(function (acc, i) {
          acc[i] = props[i]; //eslint-disable-line react/destructuring-assignment

          return acc;
        }, {});
      }

      function getMergedStep(step, props) {
        if (!step) return null;
        var mergedStep = cjs_default().all([getTourProps(props), es_DEFAULTS.step, step], {
          isMergeableObject: src_default.plainObject
        });
        var mergedStyles = es_getStyles(cjs_default()(props.styles || {}, step.styles || {}));
        var scrollParent = hasCustomScrollParent(getElement(step.target), mergedStep.disableScrollParentFix);
        var floaterProps = cjs_default().all([props.floaterProps || {}, es_DEFAULTS.floaterProps, mergedStep.floaterProps || {}]); // Set react-floater props

        floaterProps.offset = mergedStep.offset;
        floaterProps.styles = cjs_default()(floaterProps.styles || {}, mergedStyles.floaterStyles || {});
        delete mergedStyles.floaterStyles;
        floaterProps.offset += props.spotlightPadding || step.spotlightPadding || 0;

        if (step.placementBeacon) {
          floaterProps.wrapperOptions.placement = step.placementBeacon;
        }

        if (scrollParent) {
          floaterProps.options.preventOverflow.boundariesElement = 'window';
        }

        return es_objectSpread2(es_objectSpread2({}, mergedStep), {}, {
          locale: cjs_default().all([es_DEFAULTS.locale, props.locale || {}, mergedStep.locale || {}]),
          floaterProps: floaterProps,
          styles: mergedStyles
        });
      }
      /**
       * Validate if a step is valid
       *
       * @param {Object} step - A step object
       * @param {boolean} debug
       *
       * @returns {boolean} - True if the step is valid, false otherwise
       */

      function validateStep(step) {
        var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!src_default.plainObject(step)) {
          es_log({
            title: 'validateStep',
            data: 'step must be an object',
            warn: true,
            debug: debug
          });
          return false;
        }

        if (!step.target) {
          es_log({
            title: 'validateStep',
            data: 'target is missing from the step',
            warn: true,
            debug: debug
          });
          return false;
        }

        return true;
      }
      /**
       * Validate if steps is valid
       *
       * @param {Array} steps - A steps array
       * @param {boolean} debug
       *
       * @returns {boolean} - True if the steps are valid, false otherwise
       */

      function validateSteps(steps) {
        var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!src_default.array(steps)) {
          es_log({
            title: 'validateSteps',
            data: 'steps must be an array',
            warn: true,
            debug: debug
          });
          return false;
        }

        return steps.every(function (d) {
          return validateStep(d, debug);
        });
      }

      var Scope = /*#__PURE__*/es_createClass(function Scope(_element) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        es_classCallCheck(this, Scope);

        es_defineProperty(this, "element", void 0);

        es_defineProperty(this, "options", void 0);

        es_defineProperty(this, "canBeTabbed", function (element) {
          var tabIndex = element.tabIndex;
          if (tabIndex === null || tabIndex < 0) tabIndex = undefined;
          var isTabIndexNaN = isNaN(tabIndex);
          return !isTabIndexNaN && _this.canHaveFocus(element);
        });

        es_defineProperty(this, "canHaveFocus", function (element) {
          var validTabNodes = /input|select|textarea|button|object/;
          var nodeName = element.nodeName.toLowerCase();
          var res = validTabNodes.test(nodeName) && !element.getAttribute('disabled') || nodeName === 'a' && !!element.getAttribute('href');
          return res && _this.isVisible(element);
        });

        es_defineProperty(this, "findValidTabElements", function () {
          return [].slice.call(_this.element.querySelectorAll('*'), 0).filter(_this.canBeTabbed);
        });

        es_defineProperty(this, "handleKeyDown", function (e) {
          var _this$options$keyCode = _this.options.keyCode,
            keyCode = _this$options$keyCode === void 0 ? 9 : _this$options$keyCode;
          /* istanbul ignore else */

          if (e.keyCode === keyCode) {
            _this.interceptTab(e);
          }
        });

        es_defineProperty(this, "interceptTab", function (event) {
          var elements = _this.findValidTabElements();

          if (!elements.length) {
            return;
          }

          event.preventDefault();
          var shiftKey = event.shiftKey;
          var x = elements.indexOf(document.activeElement);

          if (x === -1 || !shiftKey && x + 1 === elements.length) {
            x = 0;
          } else if (shiftKey && x === 0) {
            x = elements.length - 1;
          } else {
            x += shiftKey ? -1 : 1;
          }

          elements[x].focus();
        });

        es_defineProperty(this, "isHidden", function (element) {
          var noSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;
          var style = window.getComputedStyle(element);
          if (noSize && !element.innerHTML) return true;
          return noSize && style.getPropertyValue('overflow') !== 'visible' || style.getPropertyValue('display') === 'none';
        });

        es_defineProperty(this, "isVisible", function (element) {
          var parentElement = element;

          while (parentElement) {
            /* istanbul ignore else */
            if (parentElement instanceof HTMLElement) {
              if (parentElement === document.body) break;
              /* istanbul ignore else */

              if (_this.isHidden(parentElement)) return false;
              parentElement = parentElement.parentNode;
            }
          }

          return true;
        });

        es_defineProperty(this, "removeScope", function () {
          window.removeEventListener('keydown', _this.handleKeyDown);
        });

        es_defineProperty(this, "checkFocus", function (target) {
          if (document.activeElement !== target) {
            target.focus();
            window.requestAnimationFrame(function () {
              return _this.checkFocus(target);
            });
          }
        });

        es_defineProperty(this, "setFocus", function () {
          var selector = _this.options.selector;
          if (!selector) return;

          var target = _this.element.querySelector(selector);
          /* istanbul ignore else */


          if (target) {
            window.requestAnimationFrame(function () {
              return _this.checkFocus(target);
            });
          }
        });

        if (!(_element instanceof HTMLElement)) {
          throw new TypeError('Invalid parameter: element must be an HTMLElement');
        }

        this.element = _element;
        this.options = options;
        window.addEventListener('keydown', this.handleKeyDown, false);
        this.setFocus();
      });

      var JoyrideBeacon = /*#__PURE__*/function (_React$Component) {
        es_inherits(JoyrideBeacon, _React$Component);

        var _super = es_createSuper(JoyrideBeacon);

        function JoyrideBeacon(props) {
          var _this;

          es_classCallCheck(this, JoyrideBeacon);

          _this = _super.call(this, props);

          es_defineProperty(es_assertThisInitialized(_this), "setBeaconRef", function (c) {
            _this.beacon = c;
          });

          if (!props.beaconComponent) {
            var head = document.head || document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            var css = "\n        @keyframes joyride-beacon-inner {\n          20% {\n            opacity: 0.9;\n          }\n        \n          90% {\n            opacity: 0.7;\n          }\n        }\n        \n        @keyframes joyride-beacon-outer {\n          0% {\n            transform: scale(1);\n          }\n        \n          45% {\n            opacity: 0.7;\n            transform: scale(0.75);\n          }\n        \n          100% {\n            opacity: 0.9;\n            transform: scale(1);\n          }\n        }\n      ";
            style.type = 'text/css';
            style.id = 'joyride-beacon-animation';

            if (props.nonce !== undefined) {
              style.setAttribute('nonce', props.nonce);
            }

            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
          }

          return _this;
        }

        es_createClass(JoyrideBeacon, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            var _this2 = this;

            var shouldFocus = this.props.shouldFocus;

            setTimeout(function () {
              if (src_default.domElement(_this2.beacon) && shouldFocus) {
                _this2.beacon.focus();
              }
            }, 0);
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            var style = document.getElementById('joyride-beacon-animation');

            if (style) {
              style.parentNode.removeChild(style);
            }
          }
        }, {
          key: "render",
          value: function render() {
            var _this$props = this.props,
              beaconComponent = _this$props.beaconComponent,
              locale = _this$props.locale,
              onClickOrHover = _this$props.onClickOrHover,
              styles = _this$props.styles;
            var props = {
              'aria-label': locale.open,
              onClick: onClickOrHover,
              onMouseEnter: onClickOrHover,
              ref: this.setBeaconRef,
              title: locale.open
            };
            var component;

            if (beaconComponent) {
              var BeaconComponent = beaconComponent;
              component = /*#__PURE__*/react.createElement(BeaconComponent, props);
            } else {
              component = /*#__PURE__*/react.createElement("button", es_extends({
                key: "JoyrideBeacon",
                className: "react-joyride__beacon",
                style: styles.beacon,
                type: "button"
              }, props), /*#__PURE__*/react.createElement("span", {
                style: styles.beaconInner
              }), /*#__PURE__*/react.createElement("span", {
                style: styles.beaconOuter
              }));
            }

            return component;
          }
        }]);

        return JoyrideBeacon;
      }(react.Component);

      function JoyrideSpotlight(_ref) {
        var styles = _ref.styles;
        return /*#__PURE__*/react.createElement("div", {
          key: "JoyrideSpotlight",
          className: "react-joyride__spotlight",
          style: styles
        });
      }

      var _excluded$2 = ["mixBlendMode", "zIndex"];

      var JoyrideOverlay = /*#__PURE__*/function (_React$Component) {
        es_inherits(JoyrideOverlay, _React$Component);

        var _super = es_createSuper(JoyrideOverlay);

        function JoyrideOverlay() {
          var _this;

          es_classCallCheck(this, JoyrideOverlay);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _super.call.apply(_super, [this].concat(args));

          es_defineProperty(es_assertThisInitialized(_this), "_isMounted", false);

          es_defineProperty(es_assertThisInitialized(_this), "state", {
            mouseOverSpotlight: false,
            isScrolling: false,
            showSpotlight: true
          });

          es_defineProperty(es_assertThisInitialized(_this), "handleMouseMove", function (e) {
            var mouseOverSpotlight = _this.state.mouseOverSpotlight;
            var _this$spotlightStyles = _this.spotlightStyles,
              height = _this$spotlightStyles.height,
              left = _this$spotlightStyles.left,
              position = _this$spotlightStyles.position,
              top = _this$spotlightStyles.top,
              width = _this$spotlightStyles.width;
            var offsetY = position === 'fixed' ? e.clientY : e.pageY;
            var offsetX = position === 'fixed' ? e.clientX : e.pageX;
            var inSpotlightHeight = offsetY >= top && offsetY <= top + height;
            var inSpotlightWidth = offsetX >= left && offsetX <= left + width;
            var inSpotlight = inSpotlightWidth && inSpotlightHeight;

            if (inSpotlight !== mouseOverSpotlight) {
              _this.updateState({
                mouseOverSpotlight: inSpotlight
              });
            }
          });

          es_defineProperty(es_assertThisInitialized(_this), "handleScroll", function () {
            var target = _this.props.target;
            var element = getElement(target);

            if (_this.scrollParent !== document) {
              var isScrolling = _this.state.isScrolling;

              if (!isScrolling) {
                _this.updateState({
                  isScrolling: true,
                  showSpotlight: false
                });
              }

              clearTimeout(_this.scrollTimeout);
              _this.scrollTimeout = setTimeout(function () {
                _this.updateState({
                  isScrolling: false,
                  showSpotlight: true
                });
              }, 50);
            } else if (hasPosition(element, 'sticky')) {
              _this.updateState({});
            }
          });

          es_defineProperty(es_assertThisInitialized(_this), "handleResize", function () {
            clearTimeout(_this.resizeTimeout);
            _this.resizeTimeout = setTimeout(function () {
              if (!_this._isMounted) {
                return;
              }

              _this.forceUpdate();
            }, 100);
          });

          return _this;
        }

        es_createClass(JoyrideOverlay, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            var _this$props = this.props;
            _this$props.debug;
            _this$props.disableScrolling;
            var disableScrollParentFix = _this$props.disableScrollParentFix,
              target = _this$props.target;
            var element = getElement(target);
            this.scrollParent = es_getScrollParent(element, disableScrollParentFix, true);
            this._isMounted = true;

            window.addEventListener('resize', this.handleResize);
          }
        }, {
          key: "componentDidUpdate",
          value: function componentDidUpdate(prevProps) {
            var _this2 = this;

            var _this$props2 = this.props,
              lifecycle = _this$props2.lifecycle,
              spotlightClicks = _this$props2.spotlightClicks;

            var _treeChanges = treeChanges(prevProps, this.props),
              changed = _treeChanges.changed;
            /* istanbul ignore else */


            if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
              this.scrollParent.addEventListener('scroll', this.handleScroll, {
                passive: true
              });
              setTimeout(function () {
                var isScrolling = _this2.state.isScrolling;

                if (!isScrolling) {
                  _this2.updateState({
                    showSpotlight: true
                  });
                }
              }, 100);
            }

            if (changed('spotlightClicks') || changed('disableOverlay') || changed('lifecycle')) {
              if (spotlightClicks && lifecycle === LIFECYCLE.TOOLTIP) {
                window.addEventListener('mousemove', this.handleMouseMove, false);
              } else if (lifecycle !== LIFECYCLE.TOOLTIP) {
                window.removeEventListener('mousemove', this.handleMouseMove);
              }
            }
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            this._isMounted = false;
            window.removeEventListener('mousemove', this.handleMouseMove);
            window.removeEventListener('resize', this.handleResize);
            clearTimeout(this.resizeTimeout);
            clearTimeout(this.scrollTimeout);
            this.scrollParent.removeEventListener('scroll', this.handleScroll);
          }
        }, {
          key: "spotlightStyles",
          get: function get() {
            var showSpotlight = this.state.showSpotlight;
            var _this$props3 = this.props,
              disableScrollParentFix = _this$props3.disableScrollParentFix,
              spotlightClicks = _this$props3.spotlightClicks,
              spotlightPadding = _this$props3.spotlightPadding,
              styles = _this$props3.styles,
              target = _this$props3.target;
            var element = getElement(target);
            var elementRect = es_getClientRect(element);
            var isFixedTarget = hasPosition(element);
            var top = getElementPosition(element, spotlightPadding, disableScrollParentFix);
            return es_objectSpread2(es_objectSpread2({}, isLegacy() ? styles.spotlightLegacy : styles.spotlight), {}, {
              height: Math.round(elementRect.height + spotlightPadding * 2),
              left: Math.round(elementRect.left - spotlightPadding),
              opacity: showSpotlight ? 1 : 0,
              pointerEvents: spotlightClicks ? 'none' : 'auto',
              position: isFixedTarget ? 'fixed' : 'absolute',
              top: top,
              transition: 'opacity 0.2s',
              width: Math.round(elementRect.width + spotlightPadding * 2)
            });
          }
        }, {
          key: "updateState",
          value: function updateState(state) {
            if (!this._isMounted) {
              return;
            }

            this.setState(state);
          }
        }, {
          key: "render",
          value: function render() {
            var _this$state = this.state,
              mouseOverSpotlight = _this$state.mouseOverSpotlight,
              showSpotlight = _this$state.showSpotlight;
            var _this$props4 = this.props,
              disableOverlay = _this$props4.disableOverlay,
              disableOverlayClose = _this$props4.disableOverlayClose,
              lifecycle = _this$props4.lifecycle,
              onClickOverlay = _this$props4.onClickOverlay,
              placement = _this$props4.placement,
              styles = _this$props4.styles;

            if (disableOverlay || lifecycle !== LIFECYCLE.TOOLTIP) {
              return null;
            }

            var baseStyles = styles.overlay;
            /* istanbul ignore else */

            if (isLegacy()) {
              baseStyles = placement === 'center' ? styles.overlayLegacyCenter : styles.overlayLegacy;
            }

            var stylesOverlay = es_objectSpread2({
              cursor: disableOverlayClose ? 'default' : 'pointer',
              height: getDocumentHeight(),
              pointerEvents: mouseOverSpotlight ? 'none' : 'auto'
            }, baseStyles);

            var spotlight = placement !== 'center' && showSpotlight && /*#__PURE__*/react.createElement(JoyrideSpotlight, {
              styles: this.spotlightStyles
            }); // Hack for Safari bug with mix-blend-mode with z-index

            if (getBrowser() === 'safari') {
              stylesOverlay.mixBlendMode;
              stylesOverlay.zIndex;
              var safarOverlay = es_objectWithoutProperties(stylesOverlay, _excluded$2);

              spotlight = /*#__PURE__*/react.createElement("div", {
                style: es_objectSpread2({}, safarOverlay)
              }, spotlight);
              delete stylesOverlay.backgroundColor;
            }

            return /*#__PURE__*/react.createElement("div", {
              className: "react-joyride__overlay",
              style: stylesOverlay,
              onClick: onClickOverlay
            }, spotlight);
          }
        }]);

        return JoyrideOverlay;
      }(react.Component);

      var es_excluded$1 = ["styles"],
        _excluded2 = ["color", "height", "width"];

      function JoyrideTooltipCloseBtn(_ref) {
        var styles = _ref.styles,
          props = es_objectWithoutProperties(_ref, es_excluded$1);

        var color = styles.color,
          height = styles.height,
          width = styles.width,
          style = es_objectWithoutProperties(styles, _excluded2);

        return /*#__PURE__*/react.createElement("button", es_extends({
          style: style,
          type: "button"
        }, props), /*#__PURE__*/react.createElement("svg", {
          width: typeof width === 'number' ? "".concat(width, "px") : width,
          height: typeof height === 'number' ? "".concat(height, "px") : height,
          viewBox: "0 0 18 18",
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          preserveAspectRatio: "xMidYMid"
        }, /*#__PURE__*/react.createElement("g", null, /*#__PURE__*/react.createElement("path", {
          d: "M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z",
          fill: color
        }))));
      }

      var JoyrideTooltipContainer = /*#__PURE__*/function (_React$Component) {
        es_inherits(JoyrideTooltipContainer, _React$Component);

        var _super = es_createSuper(JoyrideTooltipContainer);

        function JoyrideTooltipContainer() {
          es_classCallCheck(this, JoyrideTooltipContainer);

          return _super.apply(this, arguments);
        }

        es_createClass(JoyrideTooltipContainer, [{
          key: "render",
          value: function render() {
            var _this$props = this.props,
              backProps = _this$props.backProps,
              closeProps = _this$props.closeProps,
              continuous = _this$props.continuous,
              index = _this$props.index,
              isLastStep = _this$props.isLastStep,
              primaryProps = _this$props.primaryProps,
              size = _this$props.size,
              skipProps = _this$props.skipProps,
              step = _this$props.step,
              tooltipProps = _this$props.tooltipProps;
            var content = step.content,
              hideBackButton = step.hideBackButton,
              hideCloseButton = step.hideCloseButton,
              hideFooter = step.hideFooter,
              showProgress = step.showProgress,
              showSkipButton = step.showSkipButton,
              title = step.title,
              styles = step.styles;
            var _step$locale = step.locale,
              back = _step$locale.back,
              close = _step$locale.close,
              last = _step$locale.last,
              next = _step$locale.next,
              skip = _step$locale.skip;
            var output = {
              primary: close
            };

            if (continuous) {
              output.primary = isLastStep ? last : next;

              if (showProgress) {
                output.primary = /*#__PURE__*/react.createElement("span", null, output.primary, " (", index + 1, "/", size, ")");
              }
            }

            if (showSkipButton && !isLastStep) {
              output.skip = /*#__PURE__*/react.createElement("button", es_extends({
                style: styles.buttonSkip,
                type: "button",
                "aria-live": "off"
              }, skipProps), skip);
            }

            if (!hideBackButton && index > 0) {
              output.back = /*#__PURE__*/react.createElement("button", es_extends({
                style: styles.buttonBack,
                type: "button"
              }, backProps), back);
            }

            output.close = !hideCloseButton && /*#__PURE__*/react.createElement(JoyrideTooltipCloseBtn, es_extends({
              styles: styles.buttonClose
            }, closeProps));
            return /*#__PURE__*/react.createElement("div", es_extends({
              key: "JoyrideTooltip",
              className: "react-joyride__tooltip",
              style: styles.tooltip
            }, tooltipProps), /*#__PURE__*/react.createElement("div", {
              style: styles.tooltipContainer
            }, title && /*#__PURE__*/react.createElement("h4", {
              style: styles.tooltipTitle,
              "aria-label": title
            }, title), /*#__PURE__*/react.createElement("div", {
              style: styles.tooltipContent
            }, content)), !hideFooter && /*#__PURE__*/react.createElement("div", {
              style: styles.tooltipFooter
            }, /*#__PURE__*/react.createElement("div", {
              style: styles.tooltipFooterSpacer
            }, output.skip), output.back, /*#__PURE__*/react.createElement("button", es_extends({
              style: styles.buttonNext,
              type: "button"
            }, primaryProps), output.primary)), output.close);
          }
        }]);

        return JoyrideTooltipContainer;
      }(react.Component);

      var es_excluded = ["beaconComponent", "tooltipComponent"];

      var JoyrideTooltip = /*#__PURE__*/function (_React$Component) {
        es_inherits(JoyrideTooltip, _React$Component);

        var _super = es_createSuper(JoyrideTooltip);

        function JoyrideTooltip() {
          var _this;

          es_classCallCheck(this, JoyrideTooltip);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _super.call.apply(_super, [this].concat(args));

          es_defineProperty(es_assertThisInitialized(_this), "handleClickBack", function (e) {
            e.preventDefault();
            var helpers = _this.props.helpers;
            helpers.prev();
          });

          es_defineProperty(es_assertThisInitialized(_this), "handleClickClose", function (e) {
            e.preventDefault();
            var helpers = _this.props.helpers;
            helpers.close();
          });

          es_defineProperty(es_assertThisInitialized(_this), "handleClickPrimary", function (e) {
            e.preventDefault();
            var _this$props = _this.props,
              continuous = _this$props.continuous,
              helpers = _this$props.helpers;

            if (!continuous) {
              helpers.close();
              return;
            }

            helpers.next();
          });

          es_defineProperty(es_assertThisInitialized(_this), "handleClickSkip", function (e) {
            e.preventDefault();
            var helpers = _this.props.helpers;
            helpers.skip();
          });

          es_defineProperty(es_assertThisInitialized(_this), "getElementsProps", function () {
            var _this$props2 = _this.props,
              continuous = _this$props2.continuous,
              isLastStep = _this$props2.isLastStep,
              setTooltipRef = _this$props2.setTooltipRef,
              step = _this$props2.step;
            var back = getText(step.locale.back);
            var close = getText(step.locale.close);
            var last = getText(step.locale.last);
            var next = getText(step.locale.next);
            var skip = getText(step.locale.skip);
            var primaryText = continuous ? next : close;

            if (isLastStep) {
              primaryText = last;
            }

            return {
              backProps: {
                'aria-label': back,
                'data-action': 'back',
                onClick: _this.handleClickBack,
                role: 'button',
                title: back
              },
              closeProps: {
                'aria-label': close,
                'data-action': 'close',
                onClick: _this.handleClickClose,
                role: 'button',
                title: close
              },
              primaryProps: {
                'aria-label': primaryText,
                'data-action': 'primary',
                onClick: _this.handleClickPrimary,
                role: 'button',
                title: primaryText
              },
              skipProps: {
                'aria-label': skip,
                'data-action': 'skip',
                onClick: _this.handleClickSkip,
                role: 'button',
                title: skip
              },
              tooltipProps: {
                'aria-modal': true,
                ref: setTooltipRef,
                role: 'alertdialog'
              }
            };
          });

          return _this;
        }

        es_createClass(JoyrideTooltip, [{
          key: "render",
          value: function render() {
            var _this$props3 = this.props,
              continuous = _this$props3.continuous,
              index = _this$props3.index,
              isLastStep = _this$props3.isLastStep,
              size = _this$props3.size,
              step = _this$props3.step;

            step.beaconComponent;
            var tooltipComponent = step.tooltipComponent,
              cleanStep = es_objectWithoutProperties(step, es_excluded);

            var component;

            if (tooltipComponent) {
              var renderProps = es_objectSpread2(es_objectSpread2({}, this.getElementsProps()), {}, {
                continuous: continuous,
                index: index,
                isLastStep: isLastStep,
                size: size,
                step: cleanStep
              });

              var TooltipComponent = tooltipComponent;
              component = /*#__PURE__*/react.createElement(TooltipComponent, renderProps);
            } else {
              component = /*#__PURE__*/react.createElement(JoyrideTooltipContainer, es_extends({}, this.getElementsProps(), {
                continuous: continuous,
                index: index,
                isLastStep: isLastStep,
                size: size,
                step: step
              }));
            }

            return component;
          }
        }]);

        return JoyrideTooltip;
      }(react.Component);

      var JoyridePortal = /*#__PURE__*/function (_React$Component) {
        es_inherits(JoyridePortal, _React$Component);

        var _super = es_createSuper(JoyridePortal);

        function JoyridePortal() {
          es_classCallCheck(this, JoyridePortal);

          return _super.apply(this, arguments);
        }

        es_createClass(JoyridePortal, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            if (!es_canUseDOM) return;

            if (!es_isReact16) {
              this.renderReact15();
            }
          }
        }, {
          key: "componentDidUpdate",
          value: function componentDidUpdate() {
            if (!es_canUseDOM) return;

            if (!es_isReact16) {
              this.renderReact15();
            }
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            if (!es_canUseDOM || !this.node) return;

            if (!es_isReact16) {
              react_dom.unmountComponentAtNode(this.node);
            }

            if (this.node.parentNode === document.body) {
              document.body.removeChild(this.node);
              this.node = undefined;
            }
          }
        }, {
          key: "appendNode",
          value: function appendNode() {
            var id = this.props.id;

            if (!this.node) {
              this.node = document.createElement('div');
              /* istanbul ignore else */

              if (id) {
                this.node.id = id;
              }

              document.body.appendChild(this.node);
            }
          }
        }, {
          key: "renderReact15",
          value: function renderReact15() {
            if (!es_canUseDOM) return null;
            var children = this.props.children;

            if (!this.node) {
              this.appendNode();
            }

            react_dom.unstable_renderSubtreeIntoContainer(this, children, this.node);
            return null;
          }
        }, {
          key: "renderReact16",
          value: function renderReact16() {
            if (!es_canUseDOM || !es_isReact16) return null;
            var children = this.props.children;

            if (!this.node) {
              this.appendNode();
            }

            return /*#__PURE__*/react_dom.createPortal(children, this.node);
          }
        }, {
          key: "render",
          value: function render() {
            if (!es_isReact16) {
              return null;
            }

            return this.renderReact16();
          }
        }]);

        return JoyridePortal;
      }(react.Component);

      var JoyrideStep = /*#__PURE__*/function (_React$Component) {
        es_inherits(JoyrideStep, _React$Component);

        var _super = es_createSuper(JoyrideStep);

        function JoyrideStep() {
          var _this;

          es_classCallCheck(this, JoyrideStep);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _super.call.apply(_super, [this].concat(args));

          es_defineProperty(es_assertThisInitialized(_this), "scope", {
            removeScope: function removeScope() { }
          });

          es_defineProperty(es_assertThisInitialized(_this), "handleClickHoverBeacon", function (e) {
            var _this$props = _this.props,
              step = _this$props.step,
              update = _this$props.update;

            if (e.type === 'mouseenter' && step.event !== 'hover') {
              return;
            }

            update({
              lifecycle: LIFECYCLE.TOOLTIP
            });
          });

          es_defineProperty(es_assertThisInitialized(_this), "handleClickOverlay", function () {
            var _this$props2 = _this.props,
              helpers = _this$props2.helpers,
              step = _this$props2.step;

            if (!step.disableOverlayClose) {
              helpers.close();
            }
          });

          es_defineProperty(es_assertThisInitialized(_this), "setTooltipRef", function (c) {
            _this.tooltip = c;
          });

          es_defineProperty(es_assertThisInitialized(_this), "setPopper", function (popper, type) {
            var _this$props3 = _this.props,
              action = _this$props3.action,
              setPopper = _this$props3.setPopper,
              update = _this$props3.update;

            if (type === 'wrapper') {
              _this.beaconPopper = popper;
            } else {
              _this.tooltipPopper = popper;
            }

            setPopper(popper, type);

            if (_this.beaconPopper && _this.tooltipPopper) {
              update({
                action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : action,
                lifecycle: LIFECYCLE.READY
              });
            }
          });

          return _this;
        }

        es_createClass(JoyrideStep, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            var _this$props4 = this.props,
              debug = _this$props4.debug,
              index = _this$props4.index;
            es_log({
              title: "step:".concat(index),
              data: [{
                key: 'props',
                value: this.props
              }],
              debug: debug
            });
          }
        }, {
          key: "componentDidUpdate",
          value: function componentDidUpdate(prevProps) {
            var _this$props5 = this.props,
              action = _this$props5.action,
              callback = _this$props5.callback,
              continuous = _this$props5.continuous,
              controlled = _this$props5.controlled,
              debug = _this$props5.debug,
              index = _this$props5.index,
              lifecycle = _this$props5.lifecycle,
              size = _this$props5.size,
              status = _this$props5.status,
              step = _this$props5.step,
              update = _this$props5.update;

            var _treeChanges = treeChanges(prevProps, this.props),
              changed = _treeChanges.changed,
              changedFrom = _treeChanges.changedFrom;

            var state = {
              action: action,
              controlled: controlled,
              index: index,
              lifecycle: lifecycle,
              size: size,
              status: status
            };
            var skipBeacon = continuous && action !== ACTIONS.CLOSE && (index > 0 || action === ACTIONS.PREV);
            var hasStoreChanged = changed('action') || changed('index') || changed('lifecycle') || changed('status');
            var hasStarted = changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT);
            var isAfterAction = changed('action', [ACTIONS.NEXT, ACTIONS.PREV, ACTIONS.SKIP, ACTIONS.CLOSE]);

            if (isAfterAction && (hasStarted || controlled)) {
              callback(es_objectSpread2(es_objectSpread2({}, state), {}, {
                index: prevProps.index,
                lifecycle: LIFECYCLE.COMPLETE,
                step: prevProps.step,
                type: EVENTS.STEP_AFTER
              }));
            }

            if (step.placement === 'center' && status === es_STATUS.RUNNING && changed('index') && action !== ACTIONS.START && lifecycle === LIFECYCLE.INIT) {
              update({
                lifecycle: LIFECYCLE.READY
              });
            } // There's a step to use, but there's no target in the DOM


            if (hasStoreChanged) {
              var element = getElement(step.target);
              var elementExists = !!element;
              var hasRenderedTarget = elementExists && isElementVisible(element);

              if (hasRenderedTarget) {
                if (changedFrom('status', es_STATUS.READY, es_STATUS.RUNNING) || changedFrom('lifecycle', LIFECYCLE.INIT, LIFECYCLE.READY)) {
                  callback(es_objectSpread2(es_objectSpread2({}, state), {}, {
                    step: step,
                    type: EVENTS.STEP_BEFORE
                  }));
                }
              } else {
                console.warn(elementExists ? 'Target not visible' : 'Target not mounted', step); //eslint-disable-line no-console

                callback(es_objectSpread2(es_objectSpread2({}, state), {}, {
                  type: EVENTS.TARGET_NOT_FOUND,
                  step: step
                }));

                if (!controlled) {
                  update({
                    index: index + ([ACTIONS.PREV].indexOf(action) !== -1 ? -1 : 1)
                  });
                }
              }
            }

            if (changedFrom('lifecycle', LIFECYCLE.INIT, LIFECYCLE.READY)) {
              update({
                lifecycle: hideBeacon(step) || skipBeacon ? LIFECYCLE.TOOLTIP : LIFECYCLE.BEACON
              });
            }

            if (changed('index')) {
              es_log({
                title: "step:".concat(lifecycle),
                data: [{
                  key: 'props',
                  value: this.props
                }],
                debug: debug
              });
            }
            /* istanbul ignore else */


            if (changed('lifecycle', LIFECYCLE.BEACON)) {
              callback(es_objectSpread2(es_objectSpread2({}, state), {}, {
                step: step,
                type: EVENTS.BEACON
              }));
            }

            if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
              callback(es_objectSpread2(es_objectSpread2({}, state), {}, {
                step: step,
                type: EVENTS.TOOLTIP
              }));
              this.scope = new Scope(this.tooltip, {
                selector: '[data-action=primary]'
              });
              this.scope.setFocus();
            }

            if (changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT)) {
              this.scope.removeScope();
              delete this.beaconPopper;
              delete this.tooltipPopper;
            }
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            this.scope.removeScope();
          }
          /**
           * Beacon click/hover event listener
           *
           * @param {Event} e
           */

        }, {
          key: "open",
          get: function get() {
            var _this$props6 = this.props,
              step = _this$props6.step,
              lifecycle = _this$props6.lifecycle;
            return !!(hideBeacon(step) || lifecycle === LIFECYCLE.TOOLTIP);
          }
        }, {
          key: "render",
          value: function render() {
            var _this$props7 = this.props,
              continuous = _this$props7.continuous,
              debug = _this$props7.debug,
              helpers = _this$props7.helpers,
              index = _this$props7.index,
              lifecycle = _this$props7.lifecycle,
              nonce = _this$props7.nonce,
              shouldScroll = _this$props7.shouldScroll,
              size = _this$props7.size,
              step = _this$props7.step;
            var target = getElement(step.target);

            if (!validateStep(step) || !src_default.domElement(target)) {
              return null;
            }

            return /*#__PURE__*/react.createElement("div", {
              key: "JoyrideStep-".concat(index),
              className: "react-joyride__step"
            }, /*#__PURE__*/react.createElement(JoyridePortal, {
              id: "react-joyride-portal"
            }, /*#__PURE__*/react.createElement(JoyrideOverlay, es_extends({}, step, {
              debug: debug,
              lifecycle: lifecycle,
              onClickOverlay: this.handleClickOverlay
            }))), /*#__PURE__*/react.createElement(ReactFloater, es_extends({
              component: /*#__PURE__*/react.createElement(JoyrideTooltip, {
                continuous: continuous,
                helpers: helpers,
                index: index,
                isLastStep: index + 1 === size,
                setTooltipRef: this.setTooltipRef,
                size: size,
                step: step
              }),
              debug: debug,
              getPopper: this.setPopper,
              id: "react-joyride-step-".concat(index),
              isPositioned: step.isFixed || hasPosition(target),
              open: this.open,
              placement: step.placement,
              target: step.target
            }, step.floaterProps), /*#__PURE__*/react.createElement(JoyrideBeacon, {
              beaconComponent: step.beaconComponent,
              locale: step.locale,
              nonce: nonce,
              onClickOrHover: this.handleClickHoverBeacon,
              shouldFocus: shouldScroll,
              styles: step.styles
            })));
          }
        }]);

        return JoyrideStep;
      }(react.Component);

      var Joyride = /*#__PURE__*/function (_React$Component) {
        es_inherits(Joyride, _React$Component);

        var _super = es_createSuper(Joyride);

        function Joyride(props) {
          var _this;

          es_classCallCheck(this, Joyride);

          _this = _super.call(this, props);

          es_defineProperty(es_assertThisInitialized(_this), "initStore", function () {
            var _this$props = _this.props,
              debug = _this$props.debug,
              getHelpers = _this$props.getHelpers,
              run = _this$props.run,
              stepIndex = _this$props.stepIndex;
            _this.store = new createStore(es_objectSpread2(es_objectSpread2({}, _this.props), {}, {
              controlled: run && src_default.number(stepIndex)
            }));
            _this.helpers = _this.store.getHelpers();
            var addListener = _this.store.addListener;
            es_log({
              title: 'init',
              data: [{
                key: 'props',
                value: _this.props
              }, {
                key: 'state',
                value: _this.state
              }],
              debug: debug
            }); // Sync the store to this component's state.

            addListener(_this.syncState);
            getHelpers(_this.helpers);
            return _this.store.getState();
          });

          es_defineProperty(es_assertThisInitialized(_this), "callback", function (data) {
            var callback = _this.props.callback;
            /* istanbul ignore else */

            if (src_default["function"](callback)) {
              callback(data);
            }
          });

          es_defineProperty(es_assertThisInitialized(_this), "handleKeyboard", function (e) {
            var _this$state = _this.state,
              index = _this$state.index,
              lifecycle = _this$state.lifecycle;
            var steps = _this.props.steps;
            var step = steps[index];
            var intKey = window.Event ? e.which : e.keyCode;

            if (lifecycle === LIFECYCLE.TOOLTIP) {
              if (intKey === 27 && step && !step.disableCloseOnEsc) {
                _this.store.close();
              }
            }
          });

          es_defineProperty(es_assertThisInitialized(_this), "syncState", function (state) {
            _this.setState(state);
          });

          es_defineProperty(es_assertThisInitialized(_this), "setPopper", function (popper, type) {
            if (type === 'wrapper') {
              _this.beaconPopper = popper;
            } else {
              _this.tooltipPopper = popper;
            }
          });

          es_defineProperty(es_assertThisInitialized(_this), "shouldScroll", function (disableScrolling, index, scrollToFirstStep, lifecycle, step, target, prevState) {
            return !disableScrolling && (index !== 0 || scrollToFirstStep || lifecycle === LIFECYCLE.TOOLTIP) && step.placement !== 'center' && (!step.isFixed || !hasPosition(target)) && // fixed steps don't need to scroll
              prevState.lifecycle !== lifecycle && [LIFECYCLE.BEACON, LIFECYCLE.TOOLTIP].indexOf(lifecycle) !== -1;
          });

          _this.state = _this.initStore();
          return _this;
        }

        es_createClass(Joyride, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            if (!es_canUseDOM) return;
            var _this$props2 = this.props,
              disableCloseOnEsc = _this$props2.disableCloseOnEsc,
              debug = _this$props2.debug,
              run = _this$props2.run,
              steps = _this$props2.steps;
            var start = this.store.start;

            if (validateSteps(steps, debug) && run) {
              start();
            }
            /* istanbul ignore else */


            if (!disableCloseOnEsc) {
              document.body.addEventListener('keydown', this.handleKeyboard, {
                passive: true
              });
            }
          }
        }, {
          key: "componentDidUpdate",
          value: function componentDidUpdate(prevProps, prevState) {
            if (!es_canUseDOM) return;
            var _this$state2 = this.state,
              action = _this$state2.action,
              controlled = _this$state2.controlled,
              index = _this$state2.index,
              lifecycle = _this$state2.lifecycle,
              status = _this$state2.status;
            var _this$props3 = this.props,
              debug = _this$props3.debug,
              run = _this$props3.run,
              stepIndex = _this$props3.stepIndex,
              steps = _this$props3.steps;
            var prevSteps = prevProps.steps,
              prevStepIndex = prevProps.stepIndex;
            var _this$store = this.store,
              reset = _this$store.reset,
              setSteps = _this$store.setSteps,
              start = _this$store.start,
              stop = _this$store.stop,
              update = _this$store.update;

            var _treeChanges = treeChanges(prevProps, this.props),
              changedProps = _treeChanges.changed;

            var _treeChanges2 = treeChanges(prevState, this.state),
              changed = _treeChanges2.changed,
              changedFrom = _treeChanges2.changedFrom;

            var step = getMergedStep(steps[index], this.props);
            var stepsChanged = !isEqual(prevSteps, steps);
            var stepIndexChanged = src_default.number(stepIndex) && changedProps('stepIndex');
            var target = getElement(step === null || step === void 0 ? void 0 : step.target);

            if (stepsChanged) {
              if (validateSteps(steps, debug)) {
                setSteps(steps);
              } else {
                console.warn('Steps are not valid', steps); //eslint-disable-line no-console
              }
            }
            /* istanbul ignore else */


            if (changedProps('run')) {
              if (run) {
                start(stepIndex);
              } else {
                stop();
              }
            }
            /* istanbul ignore else */


            if (stepIndexChanged) {
              var nextAction = prevStepIndex < stepIndex ? ACTIONS.NEXT : ACTIONS.PREV;

              if (action === ACTIONS.STOP) {
                nextAction = ACTIONS.START;
              }

              if (!([es_STATUS.FINISHED, es_STATUS.SKIPPED].indexOf(status) !== -1)) {
                update({
                  action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : nextAction,
                  index: stepIndex,
                  lifecycle: LIFECYCLE.INIT
                });
              }
            } // Update the index if the first step is not found


            if (!controlled && status === es_STATUS.RUNNING && index === 0 && !target) {
              update({
                index: index + 1
              });
              this.callback(es_objectSpread2(es_objectSpread2({}, this.state), {}, {
                type: EVENTS.TARGET_NOT_FOUND,
                step: step
              }));
            }

            var callbackData = es_objectSpread2(es_objectSpread2({}, this.state), {}, {
              index: index,
              step: step
            });

            var isAfterAction = changed('action', [ACTIONS.NEXT, ACTIONS.PREV, ACTIONS.SKIP, ACTIONS.CLOSE]);

            if (isAfterAction && changed('status', es_STATUS.PAUSED)) {
              var prevStep = getMergedStep(steps[prevState.index], this.props);
              this.callback(es_objectSpread2(es_objectSpread2({}, callbackData), {}, {
                index: prevState.index,
                lifecycle: LIFECYCLE.COMPLETE,
                step: prevStep,
                type: EVENTS.STEP_AFTER
              }));
            }

            if (changed('status', [es_STATUS.FINISHED, es_STATUS.SKIPPED])) {
              var _prevStep = getMergedStep(steps[prevState.index], this.props);

              if (!controlled) {
                this.callback(es_objectSpread2(es_objectSpread2({}, callbackData), {}, {
                  index: prevState.index,
                  lifecycle: LIFECYCLE.COMPLETE,
                  step: _prevStep,
                  type: EVENTS.STEP_AFTER
                }));
              }

              this.callback(es_objectSpread2(es_objectSpread2({}, callbackData), {}, {
                index: prevState.index,
                // Return the last step when the tour is finished
                step: _prevStep,
                type: EVENTS.TOUR_END
              }));
              reset();
            } else if (changedFrom('status', [es_STATUS.IDLE, es_STATUS.READY], es_STATUS.RUNNING)) {
              this.callback(es_objectSpread2(es_objectSpread2({}, callbackData), {}, {
                type: EVENTS.TOUR_START
              }));
            } else if (changed('status')) {
              this.callback(es_objectSpread2(es_objectSpread2({}, callbackData), {}, {
                type: EVENTS.TOUR_STATUS
              }));
            } else if (changed('action', ACTIONS.RESET)) {
              this.callback(es_objectSpread2(es_objectSpread2({}, callbackData), {}, {
                type: EVENTS.TOUR_STATUS
              }));
            }

            if (step) {
              this.scrollToStep(prevState);

              if (step.placement === 'center' && status === es_STATUS.RUNNING && action === ACTIONS.START && lifecycle === LIFECYCLE.INIT) {
                update({
                  lifecycle: LIFECYCLE.READY
                });
              }
            }
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            var disableCloseOnEsc = this.props.disableCloseOnEsc;
            /* istanbul ignore else */

            if (!disableCloseOnEsc) {
              document.body.removeEventListener('keydown', this.handleKeyboard);
            }
          }
        }, {
          key: "scrollToStep",
          value: function scrollToStep(prevState) {
            var _this$state3 = this.state,
              index = _this$state3.index,
              lifecycle = _this$state3.lifecycle,
              status = _this$state3.status;
            var _this$props4 = this.props,
              debug = _this$props4.debug,
              disableScrolling = _this$props4.disableScrolling,
              disableScrollParentFix = _this$props4.disableScrollParentFix,
              scrollToFirstStep = _this$props4.scrollToFirstStep,
              scrollOffset = _this$props4.scrollOffset,
              scrollDuration = _this$props4.scrollDuration,
              steps = _this$props4.steps;
            var step = getMergedStep(steps[index], this.props);
            /* istanbul ignore else */

            if (step) {
              var target = getElement(step.target);
              var shouldScroll = this.shouldScroll(disableScrolling, index, scrollToFirstStep, lifecycle, step, target, prevState);

              if (status === es_STATUS.RUNNING && shouldScroll) {
                var hasCustomScroll = hasCustomScrollParent(target, disableScrollParentFix);
                var scrollParent = es_getScrollParent(target, disableScrollParentFix);
                var scrollY = Math.floor(getScrollTo(target, scrollOffset, disableScrollParentFix)) || 0;
                es_log({
                  title: 'scrollToStep',
                  data: [{
                    key: 'index',
                    value: index
                  }, {
                    key: 'lifecycle',
                    value: lifecycle
                  }, {
                    key: 'status',
                    value: status
                  }],
                  debug: debug
                });
                /* istanbul ignore else */

                if (lifecycle === LIFECYCLE.BEACON && this.beaconPopper) {
                  var _this$beaconPopper = this.beaconPopper,
                    placement = _this$beaconPopper.placement,
                    popper = _this$beaconPopper.popper;
                  /* istanbul ignore else */

                  if (!(['bottom'].indexOf(placement) !== -1) && !hasCustomScroll) {
                    scrollY = Math.floor(popper.top - scrollOffset);
                  }
                } else if (lifecycle === LIFECYCLE.TOOLTIP && this.tooltipPopper) {
                  var _this$tooltipPopper = this.tooltipPopper,
                    flipped = _this$tooltipPopper.flipped,
                    _placement = _this$tooltipPopper.placement,
                    _popper = _this$tooltipPopper.popper;

                  if (['top', 'right', 'left'].indexOf(_placement) !== -1 && !flipped && !hasCustomScroll) {
                    scrollY = Math.floor(_popper.top - scrollOffset);
                  } else {
                    scrollY -= step.spotlightPadding;
                  }
                }

                scrollY = scrollY >= 0 ? scrollY : 0;
                /* istanbul ignore else */

                if (status === es_STATUS.RUNNING) {
                  scrollTo(scrollY, scrollParent, scrollDuration);
                }
              }
            }
          }
          /**
           * Trigger the callback.
           *
           * @private
           * @param {Object} data
           */

        }, {
          key: "render",
          value: function render() {
            if (!es_canUseDOM) return null;
            var _this$state4 = this.state,
              index = _this$state4.index,
              status = _this$state4.status;
            var _this$props5 = this.props,
              continuous = _this$props5.continuous,
              debug = _this$props5.debug,
              nonce = _this$props5.nonce,
              scrollToFirstStep = _this$props5.scrollToFirstStep,
              steps = _this$props5.steps;
            var step = getMergedStep(steps[index], this.props);
            var output;

            if (status === es_STATUS.RUNNING && step) {
              output = /*#__PURE__*/react.createElement(JoyrideStep, es_extends({}, this.state, {
                callback: this.callback,
                continuous: continuous,
                debug: debug,
                setPopper: this.setPopper,
                helpers: this.helpers,
                nonce: nonce,
                shouldScroll: !step.disableScrolling && (index !== 0 || scrollToFirstStep),
                step: step,
                update: this.store.update
              }));
            }

            return /*#__PURE__*/react.createElement("div", {
              className: "react-joyride"
            }, output);
          }
        }]);

        return Joyride;
      }(react.Component);

      es_defineProperty(Joyride, "defaultProps", {
        continuous: false,
        debug: false,
        disableCloseOnEsc: false,
        disableOverlay: false,
        disableOverlayClose: false,
        disableScrolling: false,
        disableScrollParentFix: false,
        getHelpers: function getHelpers() { },
        hideBackButton: false,
        run: true,
        scrollOffset: 20,
        scrollDuration: 300,
        scrollToFirstStep: false,
        showSkipButton: false,
        showProgress: false,
        spotlightClicks: false,
        spotlightPadding: 10,
        steps: []
      });




      /***/
    }),

/***/ 6494:
/***/ (function (__unused_webpack_module, exports) {

      "use strict";
      var __webpack_unused_export__;
      __webpack_unused_export__ = ({ value: !0 }); var VALIDATOR_ARG_ERROR_MESSAGE = 'The typeValidator argument must be a function with the signature function(props, propName, componentName).', MESSAGE_ARG_ERROR_MESSAGE = 'The error message is optional, but must be a string if provided.', propIsRequired = function propIsRequired(a, b, c, d) { if ('boolean' == typeof a) return a; return 'function' == typeof a ? a(b, c, d) : !(!0 !== !!a) && !!a }, propExists = function propExists(a, b) { return Object.hasOwnProperty.call(a, b) }, missingPropError = function missingPropError(a, b, c, d) { return d ? new Error(d) : new Error('Required ' + a[b] + ' `' + b + '`' + (' was not specified in `' + c + '`.')) }, guardAgainstInvalidArgTypes = function guardAgainstInvalidArgTypes(a, b) { if ('function' != typeof a) throw new TypeError(VALIDATOR_ARG_ERROR_MESSAGE); if (!!b && 'string' != typeof b) throw new TypeError(MESSAGE_ARG_ERROR_MESSAGE) }, isRequiredIf = function isRequiredIf(a, b, c) {
        return guardAgainstInvalidArgTypes(a, c), function (d, e, f) {
          for (var _len = arguments.length, g = Array(3 < _len ? _len - 3 : 0), _key = 3; _key < _len; _key++)g[_key - 3] = arguments[_key]; return propIsRequired(b, d, e, f) ? propExists(d, e) ? a.apply(void 0, [d, e, f].concat(g)) : missingPropError(d, e, f, c) : a.apply(void 0, [d, e, f].concat(g));// Is not required, so just run typeValidator.
        }
      }; exports.Z = isRequiredIf;

      //# sourceMappingURL=isRequiredIf.js.map

      /***/
    }),

/***/ 7339:
/***/ (function (module) {

      var E_NOSCROLL = new Error('Element already at target scroll position')
      var E_CANCELLED = new Error('Scroll cancelled')
      var min = Math.min
      var ms = Date.now

      module.exports = {
        left: make('scrollLeft'),
        top: make('scrollTop')
      }

      function make(prop) {
        return function scroll(el, to, opts, cb) {
          opts = opts || {}

          if (typeof opts == 'function') cb = opts, opts = {}
          if (typeof cb != 'function') cb = noop

          var start = ms()
          var from = el[prop]
          var ease = opts.ease || inOutSine
          var duration = !isNaN(opts.duration) ? +opts.duration : 350
          var cancelled = false

          return from === to ?
            cb(E_NOSCROLL, el[prop]) :
            requestAnimationFrame(animate), cancel

          function cancel() {
            cancelled = true
          }

          function animate(timestamp) {
            if (cancelled) return cb(E_CANCELLED, el[prop])

            var now = ms()
            var time = min(1, ((now - start) / duration))
            var eased = ease(time)

            el[prop] = (eased * (to - from)) + from

            time < 1 ?
              requestAnimationFrame(animate) :
              requestAnimationFrame(function () {
                cb(null, el[prop])
              })
          }
        }
      }

      function inOutSine(n) {
        return 0.5 * (1 - Math.cos(Math.PI * n))
      }

      function noop() { }


      /***/
    }),

/***/ 7274:
/***/ (function (module, exports) {

      var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; (function (root, factory) {
        if (true) {
          !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
            __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
              (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else { }
      }(this, function () {
        var regex = /(auto|scroll)/;

        var parents = function (node, ps) {
          if (node.parentNode === null) { return ps; }

          return parents(node.parentNode, ps.concat([node]));
        };

        var style = function (node, prop) {
          return getComputedStyle(node, null).getPropertyValue(prop);
        };

        var overflow = function (node) {
          return style(node, "overflow") + style(node, "overflow-y") + style(node, "overflow-x");
        };

        var scroll = function (node) {
          return regex.test(overflow(node));
        };

        var scrollParent = function (node) {
          if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
            return;
          }

          var ps = parents(node.parentNode, []);

          for (var i = 0; i < ps.length; i += 1) {
            if (scroll(ps[i])) {
              return ps[i];
            }
          }

          return document.scrollingElement || document.documentElement;
        };

        return scrollParent;
      }));


      /***/
    })

}]);