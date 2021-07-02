!(function (window, document, undefined) {
    function minErr(module) {
        return function () {
            var code = arguments[0],
                template = arguments[1],
                templateArgs = arguments,
                message,
                i;
            for (
                message =
          "[" +
          (module ? module + ":" : "") +
          code +
          "] " +
          template.replace(/\{\d+\}/g, function (match) {
              var index = +match.slice(1, -1),
                  arg;
              if (index + 2 < templateArgs.length) {
                  if (((arg = templateArgs[index + 2]), "function" == typeof arg))
                      return arg.toString().replace(/ ?\{[\s\S]*$/, "");
                  if ("undefined" == typeof arg) return "undefined";
                  if ("string" !== typeof arg) return toJson(arg);
                  return arg;
              }
              return match;
          }),
                message =
            message +
            "\nhttp://errors.angularjs.org/1.2.5/" +
            (module ? module + "/" : "") +
            code,
                i = 2;
                i < arguments.length;
                i++
            )
                message =
          message +
          (2 == i ? "?" : "&") +
          "p" +
          (i - 2) +
          "=" +
          encodeURIComponent(
              (function (obj) {
                  if ("function" == typeof obj)
                      return obj.toString().replace(/ \{[\s\S]*$/, "");
                  if ("undefined" == typeof obj) return "undefined";
                  if ("string" !== typeof obj) return JSON.stringify(obj);
                  return obj;
              })(arguments[i]),
          );
            return new Error(message);
        };
    }
    var lowercase = function (string) {
            return isString(string) ? string.toLowerCase() : string;
        },
        uppercase = function (string) {
            return isString(string) ? string.toUpperCase() : string;
        },
        msie,
        jqLite,
        jQuery,
        slice = [].slice,
        push = [].push,
        toString = Object.prototype.toString,
        ngMinErr = minErr("ng"),
        angular = window.angular || (window.angular = {}),
        angularModule,
        nodeName_,
        uid = ["0", "0", "0"];
    (msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1])),
    isNaN(msie) &&
      (msie = int(
          (/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1],
      ));
    function isArrayLike(obj) {
        if (null == obj || isWindow(obj)) return !1;
        var length = obj.length;
        if (1 === obj.nodeType && length) return !0;
        return (
            isString(obj) ||
      isArray(obj) ||
      0 === length ||
      ("number" == typeof length && length > 0 && length - 1 in obj)
        );
    }
    function forEach(obj, iterator, context) {
        var key;
        if (obj) {
            if (isFunction(obj))
                for (key in obj)
                    "prototype" != key &&
            "length" != key &&
            "name" != key &&
            obj.hasOwnProperty(key) &&
            iterator.call(context, obj[key], key);
            else if (obj.forEach && obj.forEach !== forEach)
                obj.forEach(iterator, context);
            else if (isArrayLike(obj))
                for (key = 0; key < obj.length; key++)
                    iterator.call(context, obj[key], key);
            else
                for (key in obj)
                    obj.hasOwnProperty(key) && iterator.call(context, obj[key], key);
        }
        return obj;
    }
    function sortedKeys(obj) {
        var keys = [];
        for (var key in obj) obj.hasOwnProperty(key) && keys.push(key);
        return keys.sort();
    }
    function forEachSorted(obj, iterator, context) {
        for (var keys = sortedKeys(obj), i = 0; i < keys.length; i++)
            iterator.call(context, obj[keys[i]], keys[i]);
        return keys;
    }
    function reverseParams(iteratorFn) {
        return function (value, key) {
            iteratorFn(key, value);
        };
    }
    function nextUid() {
        for (var index = uid.length, digit; index; ) {
            if ((index--, (digit = uid[index].charCodeAt(0)), 57 == digit))
                return (uid[index] = "A"), uid.join("");
            if (90 == digit) uid[index] = "0";
            else return (uid[index] = String.fromCharCode(digit + 1)), uid.join("");
        }
        return uid.unshift("0"), uid.join("");
    }
    function setHashKey(obj, h) {
        if (h) obj.$$hashKey = h;
        else delete obj.$$hashKey;
    }
    function extend(dst) {
        var h = dst.$$hashKey;
        return (
            forEach(arguments, function (obj) {
                dst !== obj &&
          forEach(obj, function (value, key) {
              dst[key] = value;
          });
            }),
            setHashKey(dst, h),
            dst
        );
    }
    function int(str) {
        return parseInt(str, 10);
    }
    function inherit(parent, extra) {
        return extend(
            new (extend(function () {}, {
                prototype: parent,
            }))(),
            extra,
        );
    }
    function noop() {}
    noop.$inject = [];
    function identity($) {
        return $;
    }
    identity.$inject = [];
    function valueFn(value) {
        return function () {
            return value;
        };
    }
    function isUndefined(value) {
        return "undefined" == typeof value;
    }
    function isDefined(value) {
        return "undefined" !== typeof value;
    }
    function isObject(value) {
        return null != value && "object" == typeof value;
    }
    function isString(value) {
        return "string" == typeof value;
    }
    function isNumber(value) {
        return "number" == typeof value;
    }
    function isDate(value) {
        return toString.call(value) === "[object Date]";
    }
    function isArray(value) {
        return toString.call(value) === "[object Array]";
    }
    function isFunction(value) {
        return "function" == typeof value;
    }
    function isRegExp(value) {
        return toString.call(value) === "[object RegExp]";
    }
    function isWindow(obj) {
        return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    }
    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }
    function isFile(obj) {
        return toString.call(obj) === "[object File]";
    }
    var trim = (function () {
        if (!String.prototype.trim)
            return function (value) {
                return isString(value)
                    ? value.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
                    : value;
            };
        return function (value) {
            return isString(value) ? value.trim() : value;
        };
    })();
    function isElement(node) {
        return !(!node || !(node.nodeName || (node.on && node.find)));
    }
    if (9 > msie)
        nodeName_ = function (element) {
            return (
                (element = element.nodeName ? element : element[0]),
                element.scopeName && "HTML" != element.scopeName
                    ? uppercase(element.scopeName + ":" + element.nodeName)
                    : element.nodeName
            );
        };
    else
        nodeName_ = function (element) {
            return element.nodeName ? element.nodeName : element[0].nodeName;
        };
    function map(obj, iterator, context) {
        var results = [];
        return (
            forEach(obj, function (value, index, list) {
                results.push(iterator.call(context, value, index, list));
            }),
            results
        );
    }
    function includes(array, obj) {
        return indexOf(array, obj) != -1;
    }
    function indexOf(array, obj) {
        if (array.indexOf) return array.indexOf(obj);
        for (var i = 0; i < array.length; i++) if (obj === array[i]) return i;
        return -1;
    }
    function arrayRemove(array, value) {
        var index = indexOf(array, value);
        return index >= 0 && array.splice(index, 1), value;
    }
    function copy(source, destination) {
        if (isWindow(source) || isScope(source))
            throw ngMinErr(
                "cpws",
                "Can't copy! Making copies of Window or Scope instances is not supported.",
            );
        if (!destination) {
            if (((destination = source), source)) {
                if (isArray(source)) destination = copy(source, []);
                else if (isDate(source)) destination = new Date(source.getTime());
                else if (isRegExp(source)) destination = new RegExp(source.source);
                else isObject(source) && (destination = copy(source, {}));
            }
        } else {
            if (destination === source)
                throw ngMinErr(
                    "cpi",
                    "Can't copy! Source and destination are identical.",
                );
            if (isArray(source)) {
                destination.length = 0;
                for (var i = 0; i < source.length; i++)
                    destination.push(copy(source[i]));
            } else {
                var h = destination.$$hashKey;
                forEach(destination, function (value, key) {
                    delete destination[key];
                });
                for (var key in source) destination[key] = copy(source[key]);
                setHashKey(destination, h);
            }
        }
        return destination;
    }
    function shallowCopy(src, dst) {
        dst ||= {};
        for (var key in src)
            src.hasOwnProperty(key) &&
        key.substr(0, 2) !== "$$" &&
        (dst[key] = src[key]);
        return dst;
    }
    function equals(o1, o2) {
        if (o1 === o2) return !0;
        if (null === o1 || null === o2) return !1;
        if (o1 != o1 && o2 != o2) return !0;
        var t1 = typeof o1,
            t2 = typeof o2,
            key,
            keySet;
        if (t1 == t2) {
            if ("object" == t1) {
                if (isArray(o1)) {
                    if (!isArray(o2)) return !1;
                    if (o1.length == o2.length) {
                        for (key = 0; key < o1.length; key++)
                            if (!equals(o1[key], o2[key])) return !1;
                        return !0;
                    }
                } else if (isDate(o1))
                    return isDate(o2) && o1.getTime() == o2.getTime();
                else if (isRegExp(o1) && isRegExp(o2))
                    return o1.toString() == o2.toString();
                else {
                    if (
                        isScope(o1) ||
            isScope(o2) ||
            isWindow(o1) ||
            isWindow(o2) ||
            isArray(o2)
                    )
                        return !1;
                    keySet = {};
                    for (key in o1) {
                        if (key.charAt(0) === "$" || isFunction(o1[key])) continue;
                        if (!equals(o1[key], o2[key])) return !1;
                        keySet[key] = !0;
                    }
                    for (key in o2)
                        if (
                            (keySet.hasOwnProperty(key) ||
                key.charAt(0) === "$" ||
                o2[key] !== void 0) &&
              !isFunction(o2[key])
                        )
                            return !1;
                    return !0;
                }
            }
        }
        return !1;
    }
    function csp() {
        return (
            (document.securityPolicy && document.securityPolicy.isActive) ||
      (document.querySelector &&
        !!(
            document.querySelector("[ng-csp]") ||
          document.querySelector("[data-ng-csp]")
        ))
        );
    }
    function concat(array1, array2, index) {
        return array1.concat(slice.call(array2, index));
    }
    function sliceArgs(args, startIndex) {
        return slice.call(args, startIndex || 0);
    }
    function bind(self, fn) {
        var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
        if (isFunction(fn) && !(fn instanceof RegExp))
            return curryArgs.length
                ? function () {
                    return arguments.length
                        ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0)))
                        : fn.apply(self, curryArgs);
                }
                : function () {
                    return arguments.length ? fn.apply(self, arguments) : fn.call(self);
                };
        return fn;
    }
    function toJsonReplacer(key, value) {
        var val = value;
        if ("string" == typeof key && key.charAt(0) === "$") val = void 0;
        else if (isWindow(value)) val = "$WINDOW";
        else if (value && document === value) val = "$DOCUMENT";
        else isScope(value) && (val = "$SCOPE");
        return val;
    }
    function toJson(obj, pretty) {
        if ("undefined" == typeof obj) return void 0;
        return JSON.stringify(obj, toJsonReplacer, pretty ? "  " : null);
    }
    function fromJson(json) {
        return isString(json) ? JSON.parse(json) : json;
    }
    function toBoolean(value) {
        if (value && 0 !== value.length) {
            var v = lowercase("" + value);
            value = !(
                "f" == v ||
        "0" == v ||
        "false" == v ||
        "no" == v ||
        "n" == v ||
        "[]" == v
            );
        } else value = !1;
        return value;
    }
    function startingTag(element) {
        element = jqLite(element).clone();
        try {
            element.empty();
        } catch (e) {}
        var elemHtml = jqLite("<div>").append(element).html();
        try {
            return element[0].nodeType === 3
                ? lowercase(elemHtml)
                : elemHtml
                    .match(/^(<[^>]+>)/)[1]
                    .replace(/^<([\w\-]+)/, function (match, nodeName) {
                        return "<" + lowercase(nodeName);
                    });
        } catch (e) {
            return lowercase(elemHtml);
        }
    }
    function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {}
    }
    function parseKeyValue(keyValue) {
        var obj = {},
            key_value,
            key;
        return (
            forEach((keyValue || "").split("&"), function (keyValue) {
                if (keyValue) {
                    if (
                        ((key_value = keyValue.split("=")),
                        (key = tryDecodeURIComponent(key_value[0])),
                        isDefined(key))
                    ) {
                        var val = isDefined(key_value[1])
                            ? tryDecodeURIComponent(key_value[1])
                            : !0;
                        if (!obj[key]) obj[key] = val;
                        else if (isArray(obj[key])) obj[key].push(val);
                        else obj[key] = [obj[key], val];
                    }
                }
            }),
            obj
        );
    }
    function encodeUriSegment(val) {
        return encodeUriQuery(val, !0)
            .replace(/%26/gi, "&")
            .replace(/%3D/gi, "=")
            .replace(/%2B/gi, "+");
    }
    function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val)
            .replace(/%40/gi, "@")
            .replace(/%3A/gi, ":")
            .replace(/%24/g, "$")
            .replace(/%2C/gi, ",")
            .replace(/%20/g, pctEncodeSpaces ? "%20" : "+");
    }
    function angularInit(element, bootstrap) {
        var elements = [element],
            appElement,
            module,
            names = ["ng:app", "ng-app", "x-ng-app", "data-ng-app"];
        function append(element1) {
            element1 && elements.push(element1);
        }
        forEach(names, function (name) {
            (names[name] = !0),
            append(document.getElementById(name)),
            (name = name.replace(":", "\\:")),
            element.querySelectorAll &&
          (forEach(element.querySelectorAll("." + name), append),
          forEach(element.querySelectorAll("." + name + "\\:"), append),
          forEach(element.querySelectorAll("[" + name + "]"), append));
        }),
        forEach(elements, function (element1) {
            if (!appElement) {
                var className = " " + element1.className + " ",
                    match = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/.exec(className);
                if (match)
                    (appElement = element1),
                    (module = (match[2] || "").replace(/\s+/g, ","));
                else
                    forEach(element1.attributes, function (attr) {
                        !appElement &&
                names[attr.name] &&
                ((appElement = element1), (module = attr.value));
                    });
            }
        }),
        appElement && bootstrap(appElement, module ? [module] : []);
    }
    function bootstrap(element, modules) {
        var doBootstrap = function () {
                if (((element = jqLite(element)), element.injector())) {
                    var tag = element[0] === document ? "document" : startingTag(element);
                    throw ngMinErr(
                        "btstrpd",
                        "App Already Bootstrapped with this Element '{0}'",
                        tag,
                    );
                }
                (modules ||= []),
                modules.unshift([
                    "$provide",
                    function ($provide) {
                        $provide.value("$rootElement", element);
                    },
                ]),
                modules.unshift("ng");
                var injector = createInjector(modules);
                return (
                    injector.invoke([
                        "$rootScope",
                        "$rootElement",
                        "$compile",
                        "$injector",
                        "$animate",
                        function (scope, element1, compile, injector1, animate) {
                            scope.$apply(function () {
                                element1.data("$injector", injector1), compile(element1)(scope);
                            });
                        },
                    ]),
                    injector
                );
            },
            NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
        if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) return doBootstrap();
        (window.name = window.name.replace(NG_DEFER_BOOTSTRAP, "")),
        (angular.resumeBootstrap = function (extraModules) {
            forEach(extraModules, function (module) {
                modules.push(module);
            }),
            doBootstrap();
        });
    }
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snake_case(name, separator) {
        return (
            (separator ||= "_"),
            name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
                return (pos ? separator : "") + letter.toLowerCase();
            })
        );
    }
    function assertArg(arg, name, reason) {
        if (!arg)
            throw ngMinErr(
                "areq",
                "Argument '{0}' is {1}",
                name || "?",
                reason || "required",
            );
        return arg;
    }
    function assertArgFn(arg, name, acceptArrayAnnotation) {
        return (
            acceptArrayAnnotation && isArray(arg) && (arg = arg[arg.length - 1]),
            assertArg(
                isFunction(arg),
                name,
                "not a function, got " +
          (arg && "object" == typeof arg
              ? arg.constructor.name || "Object"
              : typeof arg),
            ),
            arg
        );
    }
    function assertNotHasOwnProperty(name, context) {
        if ("hasOwnProperty" === name)
            throw ngMinErr(
                "badname",
                "hasOwnProperty is not a valid {0} name",
                context,
            );
    }
    function getter(obj, path, bindFnToScope) {
        if (!path) return obj;
        for (
            var keys = path.split("."),
                key,
                lastInstance = obj,
                len = keys.length,
                i = 0;
            len > i;
            i++
        )
            (key = keys[i]), obj && (obj = (lastInstance = obj)[key]);
        if (!bindFnToScope && isFunction(obj)) return bind(lastInstance, obj);
        return obj;
    }
    function getBlockElements(nodes) {
        var startNode = nodes[0],
            endNode = nodes[nodes.length - 1];
        if (endNode === startNode) return jqLite(startNode);
        var element = startNode,
            elements = [element];
        do {
            if (((element = element.nextSibling), !element)) break;
            elements.push(element);
        } while (element !== endNode);
        return jqLite(elements);
    }
    function setupModuleLoader(window) {
        var $injectorMinErr = minErr("$injector"),
            ngMinErr1 = minErr("ng");
        function ensure(obj, name, factory) {
            return obj[name] || (obj[name] = factory());
        }
        var angular1 = ensure(window, "angular", Object);
        return (
            (angular1.$$minErr = angular1.$$minErr || minErr),
            ensure(angular1, "module", function () {
                var modules = {};
                return function (name, requires, configFn) {
                    return (
                        (function (name1, context) {
                            if ("hasOwnProperty" === name)
                                throw ngMinErr1(
                                    "badname",
                                    "hasOwnProperty is not a valid {0} name",
                                    "module",
                                );
                        })(name, "module"),
                        requires && modules.hasOwnProperty(name) && (modules[name] = null),
                        ensure(modules, name, function () {
                            if (!requires)
                                throw $injectorMinErr(
                                    "nomod",
                                    "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.",
                                    name,
                                );
                            var invokeQueue = [],
                                runBlocks = [],
                                config = invokeLater("$injector", "invoke"),
                                moduleInstance = {
                                    _invokeQueue: invokeQueue,
                                    _runBlocks: runBlocks,
                                    requires: requires,
                                    name: name,
                                    provider: invokeLater("$provide", "provider"),
                                    factory: invokeLater("$provide", "factory"),
                                    service: invokeLater("$provide", "service"),
                                    value: invokeLater("$provide", "value"),
                                    constant: invokeLater("$provide", "constant", "unshift"),
                                    animation: invokeLater("$animateProvider", "register"),
                                    filter: invokeLater("$filterProvider", "register"),
                                    controller: invokeLater("$controllerProvider", "register"),
                                    directive: invokeLater("$compileProvider", "directive"),
                                    config: config,
                                    run: function (block) {
                                        return runBlocks.push(block), this;
                                    },
                                };
                            return configFn && config(configFn), moduleInstance;
                            function invokeLater(provider, method, insertMethod) {
                                return function () {
                                    return (
                                        invokeQueue[insertMethod || "push"]([
                                            provider,
                                            method,
                                            arguments,
                                        ]),
                                        moduleInstance
                                    );
                                };
                            }
                        })
                    );
                };
            })
        );
    }
    var jqCache = (JQLite.cache = {}),
        jqName = (JQLite.expando = "ng-" + new Date().getTime()),
        jqId = 1,
        addEventListenerFn = window.document.addEventListener
            ? function (element, type, fn) {
                element.addEventListener(type, fn, !1);
            }
            : function (element, type, fn) {
                element.attachEvent("on" + type, fn);
            },
        removeEventListenerFn = window.document.removeEventListener
            ? function (element, type, fn) {
                element.removeEventListener(type, fn, !1);
            }
            : function (element, type, fn) {
                element.detachEvent("on" + type, fn);
            };
    function jqNextId() {
        return ++jqId;
    }
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,
        MOZ_HACK_REGEXP = /^moz([A-Z])/,
        jqLiteMinErr = minErr("jqLite");
    function camelCase(name) {
        return name
            .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            })
            .replace(MOZ_HACK_REGEXP, "Moz$1");
    }
    function jqLitePatchJQueryRemove(
        name,
        dispatchThis,
        filterElems,
        getterIfNoArguments,
    ) {
        var originalJqFn = jQuery.fn[name];
        (originalJqFn = originalJqFn.$original || originalJqFn),
        (removePatch.$original = originalJqFn),
        (jQuery.fn[name] = removePatch);
        function removePatch(param) {
            var list = filterElems && param ? [this.filter(param)] : [this],
                fireEvent = dispatchThis,
                set,
                setIndex,
                element,
                childIndex,
                children;
            if (!getterIfNoArguments || null != param)
                for (; list.length; )
                    for (
                        set = list.shift(), setIndex = 0, set.length;
                        set.length > setIndex;
                        setIndex++
                    ) {
                        if (((element = jqLite(set[setIndex])), fireEvent))
                            element.triggerHandler("$destroy");
                        else fireEvent = !fireEvent;
                        for (
                            childIndex = 0, (children = element.children()).length;
                            (children = element.children()).length > childIndex;
                            childIndex++
                        )
                            list.push(jQuery(children[childIndex]));
                    }
            return originalJqFn.apply(this, arguments);
        }
    }
    function JQLite(element) {
        if (element instanceof JQLite) return element;
        if (!(this instanceof JQLite)) {
            if (isString(element) && element.charAt(0) != "<")
                throw jqLiteMinErr(
                    "nosel",
                    "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element",
                );
            return new JQLite(element);
        }
        if (isString(element)) {
            var div = document.createElement("div");
            (div.innerHTML = "<div>&#160;</div>" + element),
            div.removeChild(div.firstChild),
            jqLiteAddNodes(this, div.childNodes),
            jqLite(document.createDocumentFragment()).append(this);
        } else jqLiteAddNodes(this, element);
    }
    function jqLiteClone(element) {
        return element.cloneNode(!0);
    }
    function jqLiteDealoc(element) {
        jqLiteRemoveData(element);
        for (
            var i = 0, children = element.childNodes || [];
            i < children.length;
            i++
        )
            jqLiteDealoc(children[i]);
    }
    function jqLiteOff(element, type, fn, unsupported) {
        if (isDefined(unsupported))
            throw jqLiteMinErr(
                "offargs",
                "jqLite#off() does not support the `selector` argument",
            );
        var events = jqLiteExpandoStore(element, "events"),
            handle = jqLiteExpandoStore(element, "handle");
        if (!handle) return;
        if (isUndefined(type))
            forEach(events, function (eventHandler, type) {
                removeEventListenerFn(element, type, eventHandler), delete events[type];
            });
        else
            forEach(type.split(" "), function (type) {
                if (isUndefined(fn))
                    removeEventListenerFn(element, type, events[type]),
                    delete events[type];
                else arrayRemove(events[type] || [], fn);
            });
    }
    function jqLiteRemoveData(element, name) {
        var expandoId = element[jqName],
            expandoStore = jqCache[expandoId];
        if (expandoStore) {
            if (name) {
                delete jqCache[expandoId].data[name];
                return;
            }
            expandoStore.handle &&
        (expandoStore.events.$destroy && expandoStore.handle({}, "$destroy"),
        jqLiteOff(element)),
            delete jqCache[expandoId],
            (element[jqName] = void 0);
        }
    }
    function jqLiteExpandoStore(element, key, value) {
        var expandoId = element[jqName],
            expandoStore = jqCache[expandoId || -1];
        if (isDefined(value))
            expandoStore ||
        ((element[jqName] = expandoId = jqNextId()),
        (expandoStore = jqCache[expandoId] = {})),
            (expandoStore[key] = value);
        else return expandoStore && expandoStore[key];
    }
    function jqLiteData(element, key, value) {
        var data = jqLiteExpandoStore(element, "data"),
            isSetter = isDefined(value),
            keyDefined = !isSetter && isDefined(key),
            isSimpleGetter = keyDefined && !isObject(key);
        if (
            (data ||
        isSimpleGetter ||
        jqLiteExpandoStore(element, "data", (data = {})),
            isSetter)
        )
            data[key] = value;
        else if (keyDefined) {
            if (isSimpleGetter) return data && data[key];
            extend(data, key);
        } else return data;
    }
    function jqLiteHasClass(element, selector) {
        if (!element.getAttribute) return !1;
        return (
            (" " + (element.getAttribute("class") || "") + " ")
                .replace(/[\n\t]/g, " ")
                .indexOf(" " + selector + " ") > -1
        );
    }
    function jqLiteRemoveClass(element, cssClasses) {
        cssClasses &&
      element.setAttribute &&
      forEach(cssClasses.split(" "), function (cssClass) {
          element.setAttribute(
              "class",
              trim(
                  (" " + (element.getAttribute("class") || "") + " ")
                      .replace(/[\n\t]/g, " ")
                      .replace(" " + trim(cssClass) + " ", " "),
              ),
          );
      });
    }
    function jqLiteAddClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            var existingClasses = (
                " " +
        (element.getAttribute("class") || "") +
        " "
            ).replace(/[\n\t]/g, " ");
            forEach(cssClasses.split(" "), function (cssClass) {
                (cssClass = trim(cssClass)),
                existingClasses.indexOf(" " + cssClass + " ") === -1 &&
            (existingClasses += cssClass + " ");
            }),
            element.setAttribute("class", trim(existingClasses));
        }
    }
    function jqLiteAddNodes(root, elements) {
        if (elements) {
            elements =
        !elements.nodeName && isDefined(elements.length) && !isWindow(elements)
            ? elements
            : [elements];
            for (var i = 0; i < elements.length; i++) root.push(elements[i]);
        }
    }
    function jqLiteController(element, name) {
        return jqLiteInheritedData(
            element,
            "$" + (name || "ngController") + "Controller",
        );
    }
    function jqLiteInheritedData(element, name, value) {
        (element = jqLite(element)),
        element[0].nodeType == 9 && (element = element.find("html"));
        for (var names = isArray(name) ? name : [name]; element.length; ) {
            for (var i = 0, ii = names.length; ii > i; i++)
                if ((value = element.data(names[i])) !== void 0) return value;
            element = element.parent();
        }
    }
    function jqLiteEmpty(element) {
        for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++)
            jqLiteDealoc(childNodes[i]);
        for (; element.firstChild; ) element.removeChild(element.firstChild);
    }
    var JQLitePrototype = (JQLite.prototype = {
            ready: function (fn) {
                var fired = !1;
                function trigger() {
                    if (fired) return;
                    (fired = !0), fn();
                }
                if ("complete" === document.readyState) setTimeout(trigger);
                else
                    this.on("DOMContentLoaded", trigger),
                    JQLite(window).on("load", trigger);
            },
            toString: function () {
                var value = [];
                return (
                    forEach(this, function (e) {
                        value.push("" + e);
                    }),
                    "[" + value.join(", ") + "]"
                );
            },
            eq: function (index) {
                return index >= 0
                    ? jqLite(this[index])
                    : jqLite(this[this.length + index]);
            },
            length: 0,
            push: push,
            sort: [].sort,
            splice: [].splice,
        }),
        BOOLEAN_ATTR = {};
    forEach(
        "multiple,selected,checked,disabled,readOnly,required,open".split(","),
        function (value) {
            BOOLEAN_ATTR[lowercase(value)] = value;
        },
    );
    var BOOLEAN_ELEMENTS = {};
    forEach(
        "input,select,option,textarea,button,form,details".split(","),
        function (value) {
            BOOLEAN_ELEMENTS[uppercase(value)] = !0;
        },
    );
    function getBooleanAttrName(element, name) {
        var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
        return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;
    }
    forEach(
        {
            data: jqLiteData,
            inheritedData: jqLiteInheritedData,
            scope: function (element) {
                return (
                    jqLite(element).data("$scope") ||
          jqLiteInheritedData(element.parentNode || element, [
              "$isolateScope",
              "$scope",
          ])
                );
            },
            isolateScope: function (element) {
                return (
                    jqLite(element).data("$isolateScope") ||
          jqLite(element).data("$isolateScopeNoTemplate")
                );
            },
            controller: jqLiteController,
            injector: function (element) {
                return jqLiteInheritedData(element, "$injector");
            },
            removeAttr: function (element, name) {
                element.removeAttribute(name);
            },
            hasClass: jqLiteHasClass,
            css: function (element, name, value) {
                if (((name = camelCase(name)), isDefined(value)))
                    element.style[name] = value;
                else {
                    var val;
                    return (
                        8 >= msie &&
              ((val = element.currentStyle && element.currentStyle[name]),
              "" === val && (val = "auto")),
                        (val ||= element.style[name]),
                        8 >= msie && (val = "" === val ? void 0 : val),
                        val
                    );
                }
            },
            attr: function (element, name, value) {
                var lowercasedName = lowercase(name);
                if (BOOLEAN_ATTR[lowercasedName]) {
                    if (isDefined(value)) {
                        if (!!value)
                            (element[name] = !0), element.setAttribute(name, lowercasedName);
                        else (element[name] = !1), element.removeAttribute(lowercasedName);
                    } else
                        return element[name] ||
              (element.attributes.getNamedItem(name) || noop).specified
                            ? lowercasedName
                            : void 0;
                } else if (isDefined(value)) element.setAttribute(name, value);
                else if (element.getAttribute) {
                    var ret = element.getAttribute(name, 2);
                    return null === ret ? void 0 : ret;
                }
            },
            prop: function (element, name, value) {
                if (isDefined(value)) element[name] = value;
                else return element[name];
            },
            text: (function () {
                var NODE_TYPE_TEXT_PROPERTY = [];
                if (9 > msie)
                    (NODE_TYPE_TEXT_PROPERTY[1] = "innerText"),
                    (NODE_TYPE_TEXT_PROPERTY[3] = "nodeValue");
                else
                    NODE_TYPE_TEXT_PROPERTY[1] = NODE_TYPE_TEXT_PROPERTY[3] =
            "textContent";
                return (getText.$dv = ""), getText;
                function getText(element, value) {
                    var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType];
                    if (isUndefined(value)) return textProp ? element[textProp] : "";
                    element[textProp] = value;
                }
            })(),
            val: function (element, value) {
                if (isUndefined(value)) {
                    if (nodeName_(element) === "SELECT" && element.multiple) {
                        var result = [];
                        return (
                            forEach(element.options, function (option) {
                                option.selected && result.push(option.value || option.text);
                            }),
                            0 === result.length ? null : result
                        );
                    }
                    return element.value;
                }
                element.value = value;
            },
            html: function (element, value) {
                if (isUndefined(value)) return element.innerHTML;
                for (
                    var i = 0, childNodes = element.childNodes;
                    i < childNodes.length;
                    i++
                )
                    jqLiteDealoc(childNodes[i]);
                element.innerHTML = value;
            },
            empty: jqLiteEmpty,
        },
        function (fn, name) {
            JQLite.prototype[name] = function (arg1, arg2) {
                var i, key;
                if (
                    fn !== jqLiteEmpty &&
          (2 == fn.length && fn !== jqLiteHasClass && fn !== jqLiteController
              ? arg1
              : arg2) === void 0
                ) {
                    if (isObject(arg1)) {
                        for (i = 0; i < this.length; i++)
                            if (fn === jqLiteData) fn(this[i], arg1);
                            else for (key in arg1) fn(this[i], key, arg1[key]);
                        return this;
                    } else {
                        for (
                            var value = fn.$dv,
                                jj = void 0 === value ? Math.min(this.length, 1) : this.length,
                                j = 0;
                            jj > j;
                            j++
                        ) {
                            var nodeValue = fn(this[j], arg1, arg2);
                            value = value ? value + nodeValue : nodeValue;
                        }
                        return value;
                    }
                } else {
                    for (i = 0; i < this.length; i++) fn(this[i], arg1, arg2);
                    return this;
                }
            };
        },
    );
    function createEventHandler(element, events) {
        var eventHandler = function (event, type) {
            if (
                (event.preventDefault ||
          (event.preventDefault = function () {
              event.returnValue = !1;
          }),
                event.stopPropagation ||
          (event.stopPropagation = function () {
              event.cancelBubble = !0;
          }),
                event.target || (event.target = event.srcElement || document),
                isUndefined(event.defaultPrevented) &&
          ((event.preventDefault = function () {
              (event.defaultPrevented = !0), event.preventDefault.call(event);
          }),
          (event.defaultPrevented = !1)),
                (event.isDefaultPrevented = function () {
                    return event.defaultPrevented || event.returnValue === !1;
                }),
                forEach(events[type || event.type], function (fn) {
                    fn.call(element, event);
                }),
                8 >= msie)
            )
                (event.preventDefault = null),
                (event.stopPropagation = null),
                (event.isDefaultPrevented = null);
            else
                delete event.preventDefault,
                delete event.stopPropagation,
                delete event.isDefaultPrevented;
        };
        return (eventHandler.elem = element), eventHandler;
    }
    forEach(
        {
            removeData: jqLiteRemoveData,
            dealoc: jqLiteDealoc,
            on: function onFn(element, type, fn, unsupported) {
                if (isDefined(unsupported))
                    throw jqLiteMinErr(
                        "onargs",
                        "jqLite#on() does not support the `selector` or `eventData` parameters",
                    );
                var events = jqLiteExpandoStore(element, "events"),
                    handle = jqLiteExpandoStore(element, "handle");
                events || jqLiteExpandoStore(element, "events", (events = {})),
                handle ||
            jqLiteExpandoStore(
                element,
                "handle",
                (handle = createEventHandler(element, events)),
            ),
                forEach(type.split(" "), function (type) {
                    var eventFns = events[type];
                    if (!eventFns) {
                        if ("mouseenter" == type || "mouseleave" == type) {
                            var contains =
                  document.body.contains ||
                  document.body.compareDocumentPosition
                      ? function (a, b) {
                          var adown = 9 === a.nodeType ? a.documentElement : a,
                              bup = b && b.parentNode;
                          return (
                              a === bup ||
                          (bup &&
                            1 === bup.nodeType &&
                            !!(adown.contains
                                ? adown.contains(bup)
                                : a.compareDocumentPosition &&
                                a.compareDocumentPosition(bup) & 16))
                          );
                      }
                      : function (a, b) {
                          if (b)
                              for (; (b = b.parentNode); ) if (a === b) return !0;
                          return !1;
                      };
                            (events[type] = []),
                            onFn(
                                element,
                                {
                                    mouseleave: "mouseout",
                                    mouseenter: "mouseover",
                                }[type],
                                function (event) {
                                    var target = this,
                                        related = event.relatedTarget;
                                    (!related ||
                        (related !== target && !contains(target, related))) &&
                        handle(event, type);
                                },
                            );
                        } else
                            addEventListenerFn(element, type, handle), (events[type] = []);
                        eventFns = events[type];
                    }
                    eventFns.push(fn);
                });
            },
            off: jqLiteOff,
            replaceWith: function (element, replaceNode) {
                var index,
                    parent = element.parentNode;
                jqLiteDealoc(element),
                forEach(new JQLite(replaceNode), function (node) {
                    if (index) parent.insertBefore(node, index.nextSibling);
                    else parent.replaceChild(node, element);
                    index = node;
                });
            },
            children: function (element) {
                var children = [];
                return (
                    forEach(element.childNodes, function (element) {
                        1 === element.nodeType && children.push(element);
                    }),
                    children
                );
            },
            contents: function (element) {
                return element.childNodes || [];
            },
            append: function (element, node) {
                forEach(new JQLite(node), function (child) {
                    (1 === element.nodeType || 11 === element.nodeType) &&
            element.appendChild(child);
                });
            },
            prepend: function (element, node) {
                if (1 === element.nodeType) {
                    var index = element.firstChild;
                    forEach(new JQLite(node), function (child) {
                        element.insertBefore(child, index);
                    });
                }
            },
            wrap: function (element, wrapNode) {
                wrapNode = jqLite(wrapNode)[0];
                var parent = element.parentNode;
                parent && parent.replaceChild(wrapNode, element),
                wrapNode.appendChild(element);
            },
            remove: function (element) {
                jqLiteDealoc(element);
                var parent = element.parentNode;
                parent && parent.removeChild(element);
            },
            after: function (element, newElement) {
                var index = element;
                forEach(new JQLite(newElement), function (node) {
                    element.parentNode.insertBefore(node, index.nextSibling),
                    (index = node);
                });
            },
            addClass: jqLiteAddClass,
            removeClass: jqLiteRemoveClass,
            toggleClass: function (element, selector, condition) {
                isUndefined(condition) &&
          (condition = !jqLiteHasClass(element, selector)),
                (condition ? jqLiteAddClass : jqLiteRemoveClass)(element, selector);
            },
            parent: function (element) {
                var parent = element.parentNode;
                return parent && 11 !== parent.nodeType ? parent : null;
            },
            next: function (element) {
                if (element.nextElementSibling) return element.nextElementSibling;
                for (var elm = element.nextSibling; null != elm && 1 !== elm.nodeType; )
                    elm = elm.nextSibling;
                return elm;
            },
            find: function (element, selector) {
                if (element.getElementsByTagName)
                    return element.getElementsByTagName(selector);
                return [];
            },
            clone: jqLiteClone,
            triggerHandler: function (element, eventName, eventData) {
                var eventFns = (jqLiteExpandoStore(element, "events") || {})[eventName];
                (eventData ||= []),
                forEach(eventFns, function (fn) {
                    fn.apply(
                        element,
                        [
                            {
                                preventDefault: noop,
                                stopPropagation: noop,
                            },
                        ].concat(eventData),
                    );
                });
            },
        },
        function (fn, name) {
            (JQLite.prototype[name] = function (arg1, arg2, arg3) {
                for (var value, i = 0; i < this.length; i++)
                    if (isUndefined(value))
                        (value = fn(this[i], arg1, arg2, arg3)),
                        isDefined(value) && (value = jqLite(value));
                    else jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
                return isDefined(value) ? value : this;
            }),
            (JQLite.prototype.bind = JQLite.prototype.on),
            (JQLite.prototype.unbind = JQLite.prototype.off);
        },
    );
    function hashKey(obj) {
        var objType = typeof obj,
            key;
        if ("object" == objType && null !== obj) {
            if ("function" == typeof (key = obj.$$hashKey)) key = obj.$$hashKey();
            else void 0 === key && (key = obj.$$hashKey = nextUid());
        } else key = obj;
        return objType + ":" + key;
    }
    function HashMap(array) {
        forEach(array, this.put, this);
    }
    HashMap.prototype = {
        put: function (key, value) {
            this[hashKey(key)] = value;
        },
        get: function (key) {
            return this[hashKey(key)];
        },
        remove: function (key) {
            return delete this[key], this[(key = hashKey(key))];
        },
    };
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        FN_ARG_SPLIT = /,/,
        FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
        STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
        $injectorMinErr = minErr("$injector");
    function annotate(fn) {
        var $inject, fnText, argDecl, last;
        if ("function" == typeof fn)
            ($inject = fn.$inject) ||
        (($inject = []),
        fn.length &&
          ((fnText = fn.toString().replace(STRIP_COMMENTS, "")),
          (argDecl = fnText.match(FN_ARGS)),
          forEach(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
              arg.replace(FN_ARG, function (all, underscore, name) {
                  $inject.push(name);
              });
          })),
        (fn.$inject = $inject));
        else if (isArray(fn))
            (last = fn.length - 1),
            assertArgFn(fn[last], "fn"),
            ($inject = fn.slice(0, last));
        else assertArgFn(fn, "fn", !0);
        return $inject;
    }
    function createInjector(modulesToLoad) {
        var INSTANTIATING = {},
            path = [],
            loadedModules = new HashMap(),
            providerCache = {
                $provide: {
                    provider: supportObject(provider),
                    factory: supportObject(factory),
                    service: supportObject(service),
                    value: supportObject(value),
                    constant: supportObject(constant),
                    decorator: decorator,
                },
            },
            providerInjector = (providerCache.$injector = createInternalInjector(
                providerCache,
                function () {
                    throw $injectorMinErr(
                        "unpr",
                        "Unknown provider: {0}",
                        path.join(" <- "),
                    );
                },
            )),
            instanceCache = {},
            instanceInjector = (instanceCache.$injector = createInternalInjector(
                instanceCache,
                function (servicename) {
                    var provider1 = providerInjector.get(servicename + "Provider");
                    return instanceInjector.invoke(provider1.$get, provider1);
                },
            ));
        return (
            forEach(loadModules(modulesToLoad), function (fn) {
                instanceInjector.invoke(fn || noop);
            }),
            instanceInjector
        );
        function supportObject(delegate) {
            return function (key, value) {
                if (isObject(key)) forEach(key, reverseParams(delegate));
                else return delegate(key, value);
            };
        }
        function provider(name, provider_) {
            if (
                (assertNotHasOwnProperty(name, "service"),
                (isFunction(provider_) || isArray(provider_)) &&
          (provider_ = providerInjector.instantiate(provider_)),
                !provider_.$get)
            )
                throw $injectorMinErr(
                    "pget",
                    "Provider '{0}' must define $get factory method.",
                    name,
                );
            return (providerCache[name + "Provider"] = provider_);
        }
        function factory(name, factoryFn) {
            return provider(name, {
                $get: factoryFn,
            });
        }
        function service(name, constructor) {
            return factory(name, [
                "$injector",
                function ($injector) {
                    return $injector.instantiate(constructor);
                },
            ]);
        }
        function value(name, val) {
            return factory(name, valueFn(val));
        }
        function constant(name, value1) {
            assertNotHasOwnProperty(name, "constant"),
            (providerCache[name] = value1),
            (instanceCache[name] = value1);
        }
        function decorator(serviceName, decorFn) {
            var origProvider = providerInjector.get(serviceName + "Provider"),
                orig$get = origProvider.$get;
            origProvider.$get = function () {
                var origInstance = instanceInjector.invoke(orig$get, origProvider);
                return instanceInjector.invoke(decorFn, null, {
                    $delegate: origInstance,
                });
            };
        }
        function loadModules(modulesToLoad) {
            var runBlocks = [],
                moduleFn,
                invokeQueue,
                i,
                ii;
            return (
                forEach(modulesToLoad, function (module) {
                    if (loadedModules.get(module)) return;
                    loadedModules.put(module, !0);
                    try {
                        if (isString(module))
                            for (
                                moduleFn = angularModule(module),
                                runBlocks = runBlocks
                                    .concat(loadModules(moduleFn.requires))
                                    .concat(moduleFn._runBlocks),
                                invokeQueue = moduleFn._invokeQueue,
                                i = 0,
                                ii = invokeQueue.length;
                                ii > i;
                                i++
                            ) {
                                var invokeArgs = invokeQueue[i],
                                    provider1 = providerInjector.get(invokeArgs[0]);
                                provider1[invokeArgs[1]].apply(provider1, invokeArgs[2]);
                            }
                        else if (isFunction(module))
                            runBlocks.push(providerInjector.invoke(module));
                        else if (isArray(module))
                            runBlocks.push(providerInjector.invoke(module));
                        else assertArgFn(module, "module");
                    } catch (e) {
                        throw (
                            (isArray(module) && (module = module[module.length - 1]),
                            e.message &&
                e.stack &&
                e.stack.indexOf(e.message) == -1 &&
                (e = e.message + "\n" + e.stack),
                            $injectorMinErr(
                                "modulerr",
                                "Failed to instantiate module {0} due to:\n{1}",
                                module,
                                e.stack || e.message || e,
                            ))
                        );
                    }
                }),
                runBlocks
            );
        }
        function createInternalInjector(cache, factory1) {
            function getService(serviceName) {
                if (cache.hasOwnProperty(serviceName)) {
                    if (cache[serviceName] === INSTANTIATING)
                        throw $injectorMinErr(
                            "cdep",
                            "Circular dependency found: {0}",
                            path.join(" <- "),
                        );
                    return cache[serviceName];
                } else
                    try {
                        return (
                            path.unshift(serviceName),
                            (cache[serviceName] = INSTANTIATING),
                            (cache[serviceName] = factory1(serviceName))
                        );
                    } finally {
                        path.shift();
                    }
            }
            function invoke(fn, self, locals) {
                var args = [],
                    $inject = annotate(fn),
                    i,
                    key;
                for (i = 0, $inject.length; i < $inject.length; i++) {
                    if (((key = $inject[i]), "string" !== typeof key))
                        throw $injectorMinErr(
                            "itkn",
                            "Incorrect injection token! Expected service name as string, got {0}",
                            key,
                        );
                    args.push(
                        locals && locals.hasOwnProperty(key)
                            ? locals[key]
                            : getService(key),
                    );
                }
                return fn.$inject || (fn = fn[$inject.length]), fn.apply(self, args);
            }
            return {
                invoke: invoke,
                instantiate: function (Type, locals) {
                    var Constructor = function () {},
                        instance,
                        returnedValue;
                    return (
                        (Constructor.prototype = (isArray(Type)
                            ? Type[Type.length - 1]
                            : Type
                        ).prototype),
                        (instance = new Constructor()),
                        (returnedValue = invoke(Type, instance, locals)),
                        isObject(returnedValue) || isFunction(returnedValue)
                            ? returnedValue
                            : instance
                    );
                },
                get: getService,
                annotate: annotate,
                has: function (name) {
                    return (
                        providerCache.hasOwnProperty(name + "Provider") ||
            cache.hasOwnProperty(name)
                    );
                },
            };
        }
    }
    function $AnchorScrollProvider() {
        var autoScrollingEnabled = !0;
        (this.disableAutoScrolling = function () {
            autoScrollingEnabled = !1;
        }),
        (this.$get = [
            "$window",
            "$location",
            "$rootScope",
            function ($window, $location, $rootScope) {
                var document1 = $window.document;
                function getFirstAnchor(list) {
                    var result = null;
                    return (
                        forEach(list, function (element) {
                            result ||
                  lowercase(element.nodeName) !== "a" ||
                  (result = element);
                        }),
                        result
                    );
                }
                function scroll() {
                    var hash = $location.hash(),
                        elm;
                    if (!hash) $window.scrollTo(0, 0);
                    else if ((elm = document1.getElementById(hash)))
                        elm.scrollIntoView();
                    else if ((elm = getFirstAnchor(document1.getElementsByName(hash))))
                        elm.scrollIntoView();
                    else "top" === hash && $window.scrollTo(0, 0);
                }
                return (
                    autoScrollingEnabled &&
              $rootScope.$watch(
                  function () {
                      return $location.hash();
                  },
                  function () {
                      $rootScope.$evalAsync(scroll);
                  },
              ),
                    scroll
                );
            },
        ]);
    }
    var $animateMinErr = minErr("$animate");
    function Browser(window1, document, $log, $sniffer) {
        var self = this,
            rawDocument = document[0],
            location = window1.location,
            history = window1.history,
            setTimeout = window1.setTimeout,
            clearTimeout = window1.clearTimeout,
            pendingDeferIds = {};
        self.isMock = !1;
        var outstandingRequestCount = 0,
            outstandingRequestCallbacks = [];
        (self.$$completeOutstandingRequest = completeOutstandingRequest),
        (self.$$incOutstandingRequestCount = function () {
            outstandingRequestCount++;
        });
        function completeOutstandingRequest(fn) {
            try {
                fn.apply(null, sliceArgs(arguments, 1));
            } finally {
                if ((outstandingRequestCount--, 0 === outstandingRequestCount))
                    for (; outstandingRequestCallbacks.length; )
                        try {
                            outstandingRequestCallbacks.pop()();
                        } catch (e) {
                            $log.error(e);
                        }
            }
        }
        self.notifyWhenNoOutstandingRequests = function (callback) {
            if (
                (forEach(pollFns, function (pollFn) {
                    pollFn();
                }),
                0 === outstandingRequestCount)
            )
                callback();
            else outstandingRequestCallbacks.push(callback);
        };
        var pollFns = [],
            pollTimeout;
        self.addPollFn = function (fn) {
            return (
                isUndefined(pollTimeout) && startPoller(100, setTimeout),
                pollFns.push(fn),
                fn
            );
        };
        function startPoller(interval, setTimeout1) {
            !(function check() {
                forEach(pollFns, function (pollFn) {
                    pollFn();
                }),
                (pollTimeout = setTimeout1(check, interval));
            })();
        }
        var lastBrowserUrl = location.href,
            baseElement = document.find("base"),
            newLocation = null;
        self.url = function (url, replace) {
            if (
                (location !== window1.location && (location = window1.location), url)
            ) {
                if (lastBrowserUrl == url) return;
                if (((lastBrowserUrl = url), $sniffer.history)) {
                    if (replace) history.replaceState(null, "", url);
                    else
                        history.pushState(null, "", url),
                        baseElement.attr("href", baseElement.attr("href"));
                } else if (((newLocation = url), replace)) location.replace(url);
                else location.href = url;
                return self;
            } else return newLocation || location.href.replace(/%27/g, "'");
        };
        var urlChangeListeners = [],
            urlChangeInit = !1;
        function fireUrlChange() {
            if (((newLocation = null), lastBrowserUrl == self.url())) return;
            (lastBrowserUrl = self.url()),
            forEach(urlChangeListeners, function (listener) {
                listener(self.url());
            });
        }
        (self.onUrlChange = function (callback) {
            if (!urlChangeInit) {
                if (
                    ($sniffer.history && jqLite(window1).on("popstate", fireUrlChange),
                    $sniffer.hashchange)
                )
                    jqLite(window1).on("hashchange", fireUrlChange);
                else self.addPollFn(fireUrlChange);
                urlChangeInit = !0;
            }
            return urlChangeListeners.push(callback), callback;
        }),
        (self.baseHref = function () {
            var href = baseElement.attr("href");
            return href ? href.replace(/^https?\:\/\/[^\/]*/, "") : "";
        });
        var lastCookies = {},
            lastCookieString = "",
            cookiePath = self.baseHref();
        (self.cookies = function (name, value) {
            var cookieLength, cookieArray, cookie, i, index;
            if (name) {
                if (void 0 === value)
                    rawDocument.cookie =
            escape(name) +
            "=;path=" +
            cookiePath +
            ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
                else
                    isString(value) &&
            ((cookieLength =
              (rawDocument.cookie =
                escape(name) + "=" + escape(value) + ";path=" + cookiePath)
                  .length + 1),
            cookieLength > 4096 &&
              $log.warn(
                  "Cookie '" +
                  name +
                  "' possibly not set or overflowed because it was too large (" +
                  cookieLength +
                  " > 4096 bytes)!",
              ));
            } else {
                if (rawDocument.cookie !== lastCookieString)
                    for (
                        lastCookieString = rawDocument.cookie,
                        cookieArray = lastCookieString.split("; "),
                        lastCookies = {},
                        i = 0;
                        i < cookieArray.length;
                        i++
                    )
                        (cookie = cookieArray[i]),
                        (index = cookie.indexOf("=")),
                        index > 0 &&
                ((name = unescape(cookie.substring(0, index))),
                lastCookies[name] === void 0 &&
                  (lastCookies[name] = unescape(cookie.substring(index + 1))));
                return lastCookies;
            }
        }),
        (self.defer = function (fn, delay) {
            var timeoutId;
            return (
                outstandingRequestCount++,
                (timeoutId = setTimeout(function () {
                    delete pendingDeferIds[timeoutId], completeOutstandingRequest(fn);
                }, delay || 0)),
                (pendingDeferIds[timeoutId] = !0),
                timeoutId
            );
        }),
        (self.defer.cancel = function (deferId) {
            if (pendingDeferIds[deferId])
                return (
                    delete pendingDeferIds[deferId],
                    clearTimeout(deferId),
                    completeOutstandingRequest(noop),
                    !0
                );
            return !1;
        });
    }
    function $BrowserProvider() {
        this.$get = [
            "$window",
            "$log",
            "$sniffer",
            "$document",
            function ($window, $log, $sniffer, $document) {
                return new Browser($window, $document, $log, $sniffer);
            },
        ];
    }
    function $CacheFactoryProvider() {
        this.$get = function () {
            var caches = {};
            function cacheFactory(cacheId, options) {
                if (cacheId in caches)
                    throw minErr("$cacheFactory")(
                        "iid",
                        "CacheId '{0}' is already taken!",
                        cacheId,
                    );
                var size = 0,
                    stats = extend({}, options, {
                        id: cacheId,
                    }),
                    data = {},
                    capacity = (options && options.capacity) || Number.MAX_VALUE,
                    lruHash = {},
                    freshEnd = null,
                    staleEnd = null;
                return (caches[cacheId] = {
                    put: function (key, value) {
                        var lruEntry =
              lruHash[key] ||
              (lruHash[key] = {
                  key: key,
              });
                        if ((refresh(lruEntry), isUndefined(value))) return;
                        return (
                            key in data || size++,
                            (data[key] = value),
                            size > capacity && this.remove(staleEnd.key),
                            value
                        );
                    },
                    get: function (key) {
                        var lruEntry = lruHash[key];
                        if (!lruEntry) return;
                        return refresh(lruEntry), data[key];
                    },
                    remove: function (key) {
                        var lruEntry = lruHash[key];
                        if (!lruEntry) return;
                        freshEnd == lruEntry && (freshEnd = lruEntry.p),
                        lruEntry == staleEnd && (staleEnd = lruEntry.n),
                        link(lruEntry.n, lruEntry.p),
                        delete lruHash[key],
                        delete data[key],
                        size--;
                    },
                    removeAll: function () {
                        (data = {}),
                        (size = 0),
                        (lruHash = {}),
                        (freshEnd = staleEnd = null);
                    },
                    destroy: function () {
                        (data = null),
                        (stats = null),
                        (lruHash = null),
                        delete caches[cacheId];
                    },
                    info: function () {
                        return extend({}, stats, {
                            size: size,
                        });
                    },
                });
                function refresh(entry) {
                    if (entry != freshEnd) {
                        if (!staleEnd) staleEnd = entry;
                        else entry == staleEnd && (staleEnd = entry.n);
                        link(entry.n, entry.p),
                        link(entry, freshEnd),
                        (freshEnd = entry),
                        (freshEnd.n = null);
                    }
                }
                function link(nextEntry, prevEntry) {
                    nextEntry != prevEntry &&
            (nextEntry && (nextEntry.p = prevEntry),
            prevEntry && (prevEntry.n = nextEntry));
                }
            }
            return (
                (cacheFactory.info = function () {
                    var info = {};
                    return (
                        forEach(caches, function (cache, cacheId) {
                            info[cacheId] = cache.info();
                        }),
                        info
                    );
                }),
                (cacheFactory.get = function (cacheId) {
                    return caches[cacheId];
                }),
                cacheFactory
            );
        };
    }
    function $TemplateCacheProvider() {
        this.$get = [
            "$cacheFactory",
            function ($cacheFactory) {
                return $cacheFactory("templates");
            },
        ];
    }
    var $compileMinErr = minErr("$compile");
    $CompileProvider.$inject = ["$provide", "$$sanitizeUriProvider"];
    function $CompileProvider($provide, $$sanitizeUriProvider) {
        var hasDirectives = {};
        (this.directive = function registerDirective(name, directiveFactory) {
            if ((assertNotHasOwnProperty(name, "directive"), isString(name)))
                assertArg(directiveFactory, "directiveFactory"),
                hasDirectives.hasOwnProperty(name) ||
            ((hasDirectives[name] = []),
            $provide.factory(name + "Directive", [
                "$injector",
                "$exceptionHandler",
                function ($injector, $exceptionHandler) {
                    var directives = [];
                    return (
                        forEach(
                            hasDirectives[name],
                            function (directiveFactory, index) {
                                try {
                                    var directive = $injector.invoke(directiveFactory);
                                    if (isFunction(directive))
                                        directive = {
                                            compile: valueFn(directive),
                                        };
                                    else
                                        !directive.compile &&
                            directive.link &&
                            (directive.compile = valueFn(directive.link));
                                    (directive.priority = directive.priority || 0),
                                    (directive.index = index),
                                    (directive.name = directive.name || name),
                                    (directive.require =
                            directive.require ||
                            (directive.controller && directive.name)),
                                    (directive.restrict = directive.restrict || "A"),
                                    directives.push(directive);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                            },
                        ),
                        directives
                    );
                },
            ])),
                hasDirectives[name].push(directiveFactory);
            else forEach(name, reverseParams(registerDirective));
            return this;
        }),
        (this.aHrefSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp))
                return $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp), this;
            return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
        }),
        (this.imgSrcSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp))
                return (
                    $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp), this
                );
            return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
        }),
        (this.$get = [
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
            function (
                $injector,
                $interpolate,
                $exceptionHandler,
                $http,
                $templateCache,
                $parse,
                $controller,
                $rootScope,
                $document,
                $sce,
                $animate,
                $$sanitizeUri,
            ) {
                var Attributes = function (element, attr) {
                    (this.$$element = element), (this.$attr = attr || {});
                };
                Attributes.prototype = {
                    $normalize: directiveNormalize,
                    $addClass: function (classVal) {
                        classVal &&
                classVal.length > 0 &&
                $animate.addClass(this.$$element, classVal);
                    },
                    $removeClass: function (classVal) {
                        classVal &&
                classVal.length > 0 &&
                $animate.removeClass(this.$$element, classVal);
                    },
                    $updateClass: function (newClasses, oldClasses) {
                        this.$removeClass(tokenDifference(oldClasses, newClasses)),
                        this.$addClass(tokenDifference(newClasses, oldClasses));
                    },
                    $set: function (key, value, writeAttr, attrName) {
                        var booleanKey = getBooleanAttrName(this.$$element[0], key),
                            nodeName;
                        if (
                            (booleanKey &&
                  (this.$$element.prop(key, value), (attrName = booleanKey)),
                            (this[key] = value),
                            attrName)
                        )
                            this.$attr[key] = attrName;
                        else
                            (attrName = this.$attr[key]),
                            attrName ||
                    (this.$attr[key] = attrName = snake_case(key, "-"));
                        if (
                            ((nodeName = nodeName_(this.$$element)),
                            (("A" === nodeName && "href" === key) ||
                  ("IMG" === nodeName && "src" === key)) &&
                  (this[key] = value = $$sanitizeUri(value, "src" === key)),
                            !1 !== writeAttr)
                        ) {
                            if (null == value) this.$$element.removeAttr(attrName);
                            else this.$$element.attr(attrName, value);
                        }
                        var $$observers = this.$$observers;
                        $$observers &&
                forEach($$observers[key], function (fn) {
                    try {
                        fn(value);
                    } catch (e) {
                        $exceptionHandler(e);
                    }
                });
                    },
                    $observe: function (key, fn) {
                        var attrs = this,
                            $$observers = attrs.$$observers || (attrs.$$observers = {}),
                            listeners = $$observers[key] || ($$observers[key] = []);
                        return (
                            listeners.push(fn),
                            $rootScope.$evalAsync(function () {
                                listeners.$$inter || fn(attrs[key]);
                            }),
                            fn
                        );
                    },
                };
                var startSymbol = $interpolate.startSymbol(),
                    endSymbol = $interpolate.endSymbol(),
                    denormalizeTemplate =
              "{{" == startSymbol || "}}" == endSymbol
                  ? identity
                  : function (template) {
                      return template
                          .replace(/\{\{/g, startSymbol)
                          .replace(/}}/g, endSymbol);
                  };
                return compile;
                function compile(
                    $compileNodes,
                    transcludeFn,
                    maxPriority,
                    ignoreDirective,
                    previousCompileContext,
                ) {
                    $compileNodes instanceof jqLite ||
              ($compileNodes = jqLite($compileNodes)),
                    forEach($compileNodes, function (node, index) {
                        3 == node.nodeType &&
                  node.nodeValue.match(/\S+/) &&
                  ($compileNodes[index] = node = jqLite(node)
                      .wrap("<span></span>")
                      .parent()[0]);
                    });
                    var compositeLinkFn = compileNodes(
                        $compileNodes,
                        transcludeFn,
                        $compileNodes,
                        maxPriority,
                        ignoreDirective,
                        previousCompileContext,
                    );
                    return function (scope, cloneConnectFn, transcludeControllers) {
                        assertArg(scope, "scope");
                        var $linkNode = cloneConnectFn
                            ? JQLitePrototype.clone.call($compileNodes)
                            : $compileNodes;
                        forEach(transcludeControllers, function (instance, name) {
                            $linkNode.data("$" + name + "Controller", instance);
                        });
                        for (var i = 0, ii = $linkNode.length; ii > i; i++) {
                            var node = $linkNode[i];
                            (1 == node.nodeType || 9 == node.nodeType) &&
                  $linkNode.eq(i).data("$scope", scope);
                        }
                        return (
                            safeAddClass($linkNode, "ng-scope"),
                            cloneConnectFn && cloneConnectFn($linkNode, scope),
                            compositeLinkFn && compositeLinkFn(scope, $linkNode, $linkNode),
                            $linkNode
                        );
                    };
                }
                function safeAddClass($element, className) {
                    try {
                        $element.addClass(className);
                    } catch (e) {}
                }
                function compileNodes(
                    nodeList,
                    transcludeFn,
                    $rootElement,
                    maxPriority,
                    ignoreDirective,
                    previousCompileContext,
                ) {
                    for (
                        var linkFns = [],
                            nodeLinkFn,
                            childLinkFn,
                            directives,
                            attrs,
                            linkFnFound,
                            i = 0;
                        i < nodeList.length;
                        i++
                    )
                        (attrs = new Attributes()),
                        (directives = collectDirectives(
                            nodeList[i],
                            [],
                            attrs,
                            0 === i ? maxPriority : void 0,
                            ignoreDirective,
                        )),
                        (nodeLinkFn = directives.length
                            ? applyDirectivesToNode(
                                directives,
                                nodeList[i],
                                attrs,
                                transcludeFn,
                                $rootElement,
                                null,
                                [],
                                [],
                                null,
                            )
                            : null),
                        (childLinkFn =
                  (nodeLinkFn && nodeLinkFn.terminal) ||
                  !nodeList[i].childNodes ||
                  !nodeList[i].childNodes.length
                      ? null
                      : compileNodes(
                          nodeList[i].childNodes,
                          nodeLinkFn ? nodeLinkFn.transclude : transcludeFn,
                      )),
                        linkFns.push(nodeLinkFn),
                        linkFns.push(childLinkFn),
                        (linkFnFound = linkFnFound || nodeLinkFn || childLinkFn);
                    return linkFnFound ? compositeLinkFn : null;
                    function compositeLinkFn(
                        scope,
                        nodeList,
                        $rootElement,
                        boundTranscludeFn,
                    ) {
                        var nodeLinkFn,
                            childLinkFn,
                            node,
                            $node,
                            childScope,
                            i,
                            ii,
                            n,
                            stableNodeList = [];
                        for (i = 0, ii = nodeList.length; ii > i; i++)
                            stableNodeList.push(nodeList[i]);
                        for (i = 0, n = 0, ii = linkFns.length; ii > i; n++)
                            if (
                                ((node = stableNodeList[n]),
                                (nodeLinkFn = linkFns[i++]),
                                (childLinkFn = linkFns[i++]),
                                ($node = jqLite(node)),
                                nodeLinkFn)
                            ) {
                                if (nodeLinkFn.scope)
                                    (childScope = scope.$new()),
                                    $node.data("$scope", childScope),
                                    safeAddClass($node, "ng-scope");
                                else childScope = scope;
                                if (
                                    (nodeLinkFn.transclude,
                                    nodeLinkFn.transclude ||
                      (!boundTranscludeFn && transcludeFn))
                                )
                                    nodeLinkFn(
                                        childLinkFn,
                                        childScope,
                                        node,
                                        $rootElement,
                                        createBoundTranscludeFn(
                                            scope,
                                            nodeLinkFn.transclude || transcludeFn,
                                        ),
                                    );
                                else
                                    nodeLinkFn(
                                        childLinkFn,
                                        childScope,
                                        node,
                                        $rootElement,
                                        boundTranscludeFn,
                                    );
                            } else
                                childLinkFn &&
                    childLinkFn(
                        scope,
                        node.childNodes,
                        void 0,
                        boundTranscludeFn,
                    );
                    }
                }
                function createBoundTranscludeFn(scope, transcludeFn) {
                    return function (transcludedScope, cloneFn, controllers) {
                        var scopeCreated = !1;
                        transcludedScope ||
                ((transcludedScope = scope.$new()),
                (transcludedScope.$$transcluded = !0),
                (scopeCreated = !0));
                        var clone = transcludeFn(transcludedScope, cloneFn, controllers);
                        return (
                            scopeCreated &&
                  clone.on(
                      "$destroy",
                      bind(transcludedScope, transcludedScope.$destroy),
                  ),
                            clone
                        );
                    };
                }
                function collectDirectives(
                    node,
                    directives,
                    attrs,
                    maxPriority,
                    ignoreDirective,
                ) {
                    var nodeType = node.nodeType,
                        attrsMap = attrs.$attr,
                        match,
                        className;
                    switch (nodeType) {
                    case 1:
                        addDirective(
                            directives,
                            directiveNormalize(nodeName_(node).toLowerCase()),
                            "E",
                            maxPriority,
                            ignoreDirective,
                        );
                        for (
                            var attr,
                                name,
                                nName,
                                ngAttrName,
                                value,
                                nAttrs = node.attributes,
                                j = 0,
                                jj = nAttrs && nAttrs.length;
                            jj > j;
                            j++
                        ) {
                            var attrStartName = !1,
                                attrEndName = !1;
                            ((attr = nAttrs[j]), !msie || msie >= 8 || attr.specified) &&
                    ((name = attr.name),
                    (ngAttrName = directiveNormalize(name)),
                    /^ngAttr[A-Z]/.test(ngAttrName) &&
                      (name = snake_case(ngAttrName.substr(6), "-")),
                    ngAttrName ===
                      ngAttrName.replace(/(Start|End)$/, "") + "Start" &&
                      ((attrStartName = name),
                      (attrEndName = name.substr(0, name.length - 5) + "end"),
                      (name = name.substr(0, name.length - 6))),
                    (nName = directiveNormalize(name.toLowerCase())),
                    (attrsMap[nName] = name),
                    (attrs[nName] = value = trim(
                        msie && "href" == name
                            ? decodeURIComponent(node.getAttribute(name, 2))
                            : attr.value,
                    )),
                    getBooleanAttrName(node, nName) && (attrs[nName] = !0),
                    addAttrInterpolateDirective(node, directives, value, nName),
                    addDirective(
                        directives,
                        nName,
                        "A",
                        maxPriority,
                        ignoreDirective,
                        attrStartName,
                        attrEndName,
                    ));
                        }
                        if (
                            ((className = node.className),
                            isString(className) && "" !== className)
                        )
                            for (
                                ;
                                (match = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/.exec(className));

                            )
                                (nName = directiveNormalize(match[2])),
                                addDirective(
                                    directives,
                                    nName,
                                    "C",
                                    maxPriority,
                                    ignoreDirective,
                                ) && (attrs[nName] = trim(match[3])),
                                (className = className.substr(
                                    match.index + match[0].length,
                                ));
                        break;
                    case 3:
                        addTextInterpolateDirective(directives, node.nodeValue);
                        break;
                    case 8:
                        try {
                            (match = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/.exec(
                                node.nodeValue,
                            )),
                            match &&
                      ((nName = directiveNormalize(match[1])),
                      addDirective(
                          directives,
                          nName,
                          "M",
                          maxPriority,
                          ignoreDirective,
                      ) && (attrs[nName] = trim(match[2])));
                        } catch (e) {}
                        break;
                    }
                    return directives.sort(byPriority), directives;
                }
                function groupScan(node, attrStart, attrEnd) {
                    var nodes = [],
                        depth = 0;
                    if (attrStart && node.hasAttribute && node.hasAttribute(attrStart))
                        do {
                            if (!node)
                                throw $compileMinErr(
                                    "uterdir",
                                    "Unterminated attribute, found '{0}' but no matching '{1}' found.",
                                    attrStart,
                                    attrEnd,
                                );
                            1 == node.nodeType &&
                  (node.hasAttribute(attrStart) && depth++,
                  node.hasAttribute(attrEnd) && depth--),
                            nodes.push(node),
                            (node = node.nextSibling);
                        } while (depth > 0);
                    else nodes.push(node);
                    return jqLite(nodes);
                }
                function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
                    return function (scope, element, attrs, controllers, transcludeFn) {
                        return (
                            (element = groupScan(element[0], attrStart, attrEnd)),
                            linkFn(scope, element, attrs, controllers, transcludeFn)
                        );
                    };
                }
                function applyDirectivesToNode(
                    directives,
                    compileNode,
                    templateAttrs,
                    transcludeFn,
                    jqCollection,
                    originalReplaceDirective,
                    preLinkFns,
                    postLinkFns,
                    previousCompileContext,
                ) {
                    previousCompileContext ||= {};
                    for (
                        var terminalPriority = -Number.MAX_VALUE,
                            newScopeDirective,
                            controllerDirectives =
                  previousCompileContext.controllerDirectives,
                            newIsolateScopeDirective =
                  previousCompileContext.newIsolateScopeDirective,
                            templateDirective = previousCompileContext.templateDirective,
                            nonTlbTranscludeDirective =
                  previousCompileContext.nonTlbTranscludeDirective,
                            hasTranscludeDirective = !1,
                            hasElementTranscludeDirective = !1,
                            $compileNode = (templateAttrs.$$element = jqLite(compileNode)),
                            directive,
                            directiveName,
                            $template,
                            replaceDirective = originalReplaceDirective,
                            childTranscludeFn = transcludeFn,
                            linkFn,
                            directiveValue,
                            i = 0,
                            ii = directives.length;
                        ii > i;
                        i++
                    ) {
                        directive = directives[i];
                        var attrStart = directive.$$start,
                            attrEnd = directive.$$end;
                        if (
                            (attrStart &&
                  ($compileNode = groupScan(compileNode, attrStart, attrEnd)),
                            ($template = void 0),
                            terminalPriority > directive.priority)
                        )
                            break;
                        if (
                            ((directiveValue = directive.scope) &&
                  ((newScopeDirective ||= directive),
                  !directive.templateUrl &&
                    (assertNoDuplicate(
                        "new/isolated scope",
                        newIsolateScopeDirective,
                        directive,
                        $compileNode,
                    ),
                    isObject(directiveValue) &&
                      (newIsolateScopeDirective = directive))),
                            (directiveName = directive.name),
                            !directive.templateUrl &&
                  directive.controller &&
                  ((directiveValue = directive.controller),
                  (controllerDirectives ||= {}),
                  assertNoDuplicate(
                      "'" + directiveName + "' controller",
                      controllerDirectives[directiveName],
                      directive,
                      $compileNode,
                  ),
                  (controllerDirectives[directiveName] = directive)),
                            (directiveValue = directive.transclude))
                        ) {
                            if (
                                ((hasTranscludeDirective = !0),
                                directive.$$tlb ||
                    (assertNoDuplicate(
                        "transclusion",
                        nonTlbTranscludeDirective,
                        directive,
                        $compileNode,
                    ),
                    (nonTlbTranscludeDirective = directive)),
                                "element" == directiveValue)
                            )
                                (hasElementTranscludeDirective = !0),
                                (terminalPriority = directive.priority),
                                ($template = groupScan(compileNode, attrStart, attrEnd)),
                                ($compileNode = templateAttrs.$$element = jqLite(
                                    document.createComment(
                                        " " +
                          directiveName +
                          ": " +
                          templateAttrs[directiveName] +
                          " ",
                                    ),
                                )),
                                (compileNode = $compileNode[0]),
                                replaceWith(
                                    jqCollection,
                                    jqLite(sliceArgs($template)),
                                    compileNode,
                                ),
                                (childTranscludeFn = compile(
                                    $template,
                                    transcludeFn,
                                    terminalPriority,
                                    replaceDirective && replaceDirective.name,
                                    {
                                        nonTlbTranscludeDirective: nonTlbTranscludeDirective,
                                    },
                                ));
                            else
                                ($template = jqLite(jqLiteClone(compileNode)).contents()),
                                $compileNode.empty(),
                                (childTranscludeFn = compile($template, transcludeFn));
                        }
                        if (directive.template) {
                            if (
                                (assertNoDuplicate(
                                    "template",
                                    templateDirective,
                                    directive,
                                    $compileNode,
                                ),
                                (templateDirective = directive),
                                (directiveValue = isFunction(directive.template)
                                    ? directive.template($compileNode, templateAttrs)
                                    : directive.template),
                                (directiveValue = denormalizeTemplate(directiveValue)),
                                directive.replace)
                            ) {
                                if (
                                    ((replaceDirective = directive),
                                    ($template = jqLite(
                                        "<div>" + trim(directiveValue) + "</div>",
                                    ).contents()),
                                    (compileNode = $template[0]),
                                    1 != $template.length || 1 !== compileNode.nodeType)
                                )
                                    throw $compileMinErr(
                                        "tplrt",
                                        "Template for directive '{0}' must have exactly one root element. {1}",
                                        directiveName,
                                        "",
                                    );
                                replaceWith(jqCollection, $compileNode, compileNode);
                                var newTemplateAttrs = {
                                        $attr: {},
                                    },
                                    templateDirectives = collectDirectives(
                                        compileNode,
                                        [],
                                        newTemplateAttrs,
                                    ),
                                    unprocessedDirectives = directives.splice(
                                        i + 1,
                                        directives.length - (i + 1),
                                    );
                                newIsolateScopeDirective &&
                    markDirectivesAsIsolate(templateDirectives),
                                (directives = directives
                                    .concat(templateDirectives)
                                    .concat(unprocessedDirectives)),
                                mergeTemplateAttributes(templateAttrs, newTemplateAttrs),
                                (ii = directives.length);
                            } else $compileNode.html(directiveValue);
                        }
                        if (directive.templateUrl)
                            assertNoDuplicate(
                                "template",
                                templateDirective,
                                directive,
                                $compileNode,
                            ),
                            (templateDirective = directive),
                            directive.replace && (replaceDirective = directive),
                            (nodeLinkFn = compileTemplateUrl(
                                directives.splice(i, directives.length - i),
                                $compileNode,
                                templateAttrs,
                                jqCollection,
                                childTranscludeFn,
                                preLinkFns,
                                postLinkFns,
                                {
                                    controllerDirectives: controllerDirectives,
                                    newIsolateScopeDirective: newIsolateScopeDirective,
                                    templateDirective: templateDirective,
                                    nonTlbTranscludeDirective: nonTlbTranscludeDirective,
                                },
                            )),
                            (ii = directives.length);
                        else if (directive.compile)
                            try {
                                if (
                                    ((linkFn = directive.compile(
                                        $compileNode,
                                        templateAttrs,
                                        childTranscludeFn,
                                    )),
                                    isFunction(linkFn))
                                )
                                    addLinkFns(null, linkFn, attrStart, attrEnd);
                                else
                                    linkFn &&
                      addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                            } catch (e) {
                                $exceptionHandler(e, startingTag($compileNode));
                            }
                        directive.terminal &&
                ((nodeLinkFn.terminal = !0),
                (terminalPriority = Math.max(
                    terminalPriority,
                    directive.priority,
                )));
                    }
                    return (
                        (nodeLinkFn.scope =
                newScopeDirective && newScopeDirective.scope === !0),
                        (nodeLinkFn.transclude =
                hasTranscludeDirective && childTranscludeFn),
                        nodeLinkFn
                    );
                    function addLinkFns(pre, post, attrStart, attrEnd) {
                        pre &&
                (attrStart &&
                  (pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd)),
                (pre.require = directive.require),
                (directive === newIsolateScopeDirective ||
                  directive.$$isolateScope) &&
                  (pre = cloneAndAnnotateFn(pre, {
                      isolateScope: !0,
                  })),
                preLinkFns.push(pre)),
                        post &&
                  (attrStart &&
                    (post = groupElementsLinkFnWrapper(
                        post,
                        attrStart,
                        attrEnd,
                    )),
                  (post.require = directive.require),
                  (directive === newIsolateScopeDirective ||
                    directive.$$isolateScope) &&
                    (post = cloneAndAnnotateFn(post, {
                        isolateScope: !0,
                    })),
                  postLinkFns.push(post));
                    }
                    function getControllers(require, $element, elementControllers) {
                        var value,
                            optional = !1;
                        if (isString(require)) {
                            for (; (value = require.charAt(0)) == "^" || "?" == value; )
                                (require = require.substr(1)),
                                "^" == value,
                                (optional ||= "?" == value);
                            if (
                                ((value = null),
                                elementControllers && (value = elementControllers[require]),
                                (value ||= $element.inheritedData(
                                    "$" + require + "Controller",
                                )),
                                !value && !optional)
                            )
                                throw $compileMinErr(
                                    "ctreq",
                                    "Controller '{0}', required by directive '{1}', can't be found!",
                                    require,
                                    directiveName,
                                );
                            return value;
                        } else
                            isArray(require) &&
                  ((value = []),
                  forEach(require, function (require) {
                      value.push(
                          getControllers(require, $element, elementControllers),
                      );
                  }));
                        return value;
                    }
                    function nodeLinkFn(
                        childLinkFn,
                        scope,
                        linkNode,
                        $rootElement,
                        boundTranscludeFn,
                    ) {
                        var attrs,
                            i,
                            linkFn,
                            controller,
                            isolateScope,
                            elementControllers = {},
                            transcludeFn1;
                        if (compileNode === linkNode) attrs = templateAttrs;
                        else
                            attrs = shallowCopy(
                                templateAttrs,
                                new Attributes(jqLite(linkNode), templateAttrs.$attr),
                            );
                        if ((attrs.$$element, newIsolateScopeDirective)) {
                            var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/,
                                $linkNode = jqLite(linkNode);
                            if (
                                ((isolateScope = scope.$new(!0)),
                                templateDirective &&
                    templateDirective ===
                      newIsolateScopeDirective.$$originalDirective)
                            )
                                $linkNode.data("$isolateScope", isolateScope);
                            else $linkNode.data("$isolateScopeNoTemplate", isolateScope);
                            safeAddClass($linkNode, "ng-isolate-scope"),
                            forEach(
                                newIsolateScopeDirective.scope,
                                function (definition, scopeName) {
                                    var match = definition.match(LOCAL_REGEXP) || [],
                                        attrName = match[3] || scopeName,
                                        optional = match[2] == "?",
                                        mode = match[1],
                                        lastValue,
                                        parentGet,
                                        parentSet,
                                        compare;
                                    switch (
                                        ((isolateScope.$$isolateBindings[scopeName] =
                          mode + attrName),
                                        mode)
                                    ) {
                                    case "@":
                                        attrs.$observe(attrName, function (value) {
                                            isolateScope[scopeName] = value;
                                        }),
                                        (attrs.$$observers[attrName].$$scope = scope),
                                        attrs[attrName] &&
                              (isolateScope[scopeName] = $interpolate(
                                  attrs[attrName],
                              )(scope));
                                        break;
                                    case "=":
                                        if (optional && !attrs[attrName]) return;
                                        if (
                                            ((parentGet = $parse(attrs[attrName])),
                                            parentGet.literal)
                                        )
                                            compare = equals;
                                        else
                                            compare = function (a, b) {
                                                return a === b;
                                            };
                                        (parentSet =
                            parentGet.assign ||
                            function () {
                                throw (
                                    ((lastValue = isolateScope[
                                        scopeName
                                    ] = parentGet(scope)),
                                    $compileMinErr(
                                        "nonassign",
                                        "Expression '{0}' used with directive '{1}' is non-assignable!",
                                        attrs[attrName],
                                        newIsolateScopeDirective.name,
                                    ))
                                );
                            }),
                                        (lastValue = isolateScope[scopeName] = parentGet(
                                            scope,
                                        )),
                                        isolateScope.$watch(
                                            function () {
                                                var parentValue = parentGet(scope);
                                                if (
                                                    !compare(parentValue, isolateScope[scopeName])
                                                ) {
                                                    if (!compare(parentValue, lastValue))
                                                        isolateScope[scopeName] = parentValue;
                                                    else
                                                        parentSet(
                                                            scope,
                                                            (parentValue = isolateScope[scopeName]),
                                                        );
                                                }
                                                return (lastValue = parentValue);
                                            },
                                            null,
                                            parentGet.literal,
                                        );
                                        break;
                                    case "&":
                                        (parentGet = $parse(attrs[attrName])),
                                        (isolateScope[scopeName] = function (locals) {
                                            return parentGet(scope, locals);
                                        });
                                        break;
                                    default:
                                        throw $compileMinErr(
                                            "iscp",
                                            "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}",
                                            newIsolateScopeDirective.name,
                                            scopeName,
                                            definition,
                                        );
                                    }
                                },
                            );
                        }
                        for (
                            transcludeFn1 = boundTranscludeFn && controllersBoundTransclude,
                            controllerDirectives &&
                    forEach(controllerDirectives, function (directive1) {
                        var locals = {
                                $scope:
                            directive1 === newIsolateScopeDirective ||
                            directive1.$$isolateScope
                                ? isolateScope
                                : scope,
                                $element: attrs.$$element,
                                $attrs: attrs,
                                $transclude: transcludeFn1,
                            },
                            controllerInstance;
                        (controller = directive1.controller),
                        "@" == controller &&
                          (controller = attrs[directive1.name]),
                        (controllerInstance = $controller(controller, locals)),
                        (elementControllers[
                            directive1.name
                        ] = controllerInstance),
                        hasElementTranscludeDirective ||
                          attrs.$$element.data(
                              "$" + directive1.name + "Controller",
                              controllerInstance,
                          ),
                        directive1.controllerAs &&
                          (locals.$scope[
                              directive1.controllerAs
                          ] = controllerInstance);
                    }),
                            i = 0;
                            i < preLinkFns.length;
                            i++
                        )
                            try {
                                (linkFn = preLinkFns[i]),
                                linkFn(
                                    linkFn.isolateScope ? isolateScope : scope,
                                    attrs.$$element,
                                    attrs,
                                    linkFn.require &&
                        getControllers(
                            linkFn.require,
                            attrs.$$element,
                            elementControllers,
                        ),
                                    transcludeFn1,
                                );
                            } catch (e) {
                                $exceptionHandler(e, startingTag(attrs.$$element));
                            }
                        var scopeToChild = scope;
                        for (
                            newIsolateScopeDirective &&
                  (newIsolateScopeDirective.template ||
                    null === newIsolateScopeDirective.templateUrl) &&
                  (scopeToChild = isolateScope),
                            childLinkFn &&
                    childLinkFn(
                        scopeToChild,
                        linkNode.childNodes,
                        void 0,
                        boundTranscludeFn,
                    ),
                            i = postLinkFns.length - 1;
                            i >= 0;
                            i--
                        )
                            try {
                                (linkFn = postLinkFns[i]),
                                linkFn(
                                    linkFn.isolateScope ? isolateScope : scope,
                                    attrs.$$element,
                                    attrs,
                                    linkFn.require &&
                        getControllers(
                            linkFn.require,
                            attrs.$$element,
                            elementControllers,
                        ),
                                    transcludeFn1,
                                );
                            } catch (e) {
                                $exceptionHandler(e, startingTag(attrs.$$element));
                            }
                        function controllersBoundTransclude(scope1, cloneAttachFn) {
                            var transcludeControllers;
                            return (
                                2 > arguments.length &&
                    ((cloneAttachFn = scope1), (scope1 = void 0)),
                                hasElementTranscludeDirective &&
                    (transcludeControllers = elementControllers),
                                boundTranscludeFn(
                                    scope1,
                                    cloneAttachFn,
                                    transcludeControllers,
                                )
                            );
                        }
                    }
                }
                function markDirectivesAsIsolate(directives) {
                    for (var j = 0, jj = directives.length; jj > j; j++)
                        directives[j] = inherit(directives[j], {
                            $$isolateScope: !0,
                        });
                }
                function addDirective(
                    tDirectives,
                    name,
                    location,
                    maxPriority,
                    ignoreDirective,
                    startAttrName,
                    endAttrName,
                ) {
                    if (ignoreDirective === name) return null;
                    var match = null;
                    if (hasDirectives.hasOwnProperty(name))
                        for (
                            var directive,
                                directives = $injector.get(name + "Directive"),
                                i = 0,
                                ii = directives.length;
                            ii > i;
                            i++
                        )
                            try {
                                (directive = directives[i]),
                                (void 0 === maxPriority ||
                      maxPriority > directive.priority) &&
                      directive.restrict.indexOf(location) != -1 &&
                      (startAttrName &&
                        (directive = inherit(directive, {
                            $$start: startAttrName,
                            $$end: endAttrName,
                        })),
                      tDirectives.push(directive),
                      (match = directive));
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                    return match;
                }
                function mergeTemplateAttributes(dst, src) {
                    var srcAttr = src.$attr,
                        dstAttr = dst.$attr,
                        $element = dst.$$element;
                    forEach(dst, function (value, key) {
                        key.charAt(0) != "$" &&
                (src[key] &&
                  (value += ("style" === key ? ";" : " ") + src[key]),
                dst.$set(key, value, !0, srcAttr[key]));
                    }),
                    forEach(src, function (value, key) {
                        if ("class" == key)
                            safeAddClass($element, value),
                            (dst.class = (dst.class ? dst.class + " " : "") + value);
                        else if ("style" == key)
                            $element.attr("style", $element.attr("style") + ";" + value),
                            (dst.style = (dst.style ? dst.style + ";" : "") + value);
                        else
                            key.charAt(0) != "$" &&
                    !dst.hasOwnProperty(key) &&
                    ((dst[key] = value), (dstAttr[key] = srcAttr[key]));
                    });
                }
                function compileTemplateUrl(
                    directives,
                    $compileNode,
                    tAttrs,
                    $rootElement,
                    childTranscludeFn,
                    preLinkFns,
                    postLinkFns,
                    previousCompileContext,
                ) {
                    var linkQueue = [],
                        afterTemplateNodeLinkFn,
                        afterTemplateChildLinkFn,
                        beforeTemplateCompileNode = $compileNode[0],
                        origAsyncDirective = directives.shift(),
                        derivedSyncDirective = extend({}, origAsyncDirective, {
                            templateUrl: null,
                            transclude: null,
                            replace: null,
                            $$originalDirective: origAsyncDirective,
                        }),
                        templateUrl = isFunction(origAsyncDirective.templateUrl)
                            ? origAsyncDirective.templateUrl($compileNode, tAttrs)
                            : origAsyncDirective.templateUrl;
                    return (
                        $compileNode.empty(),
                        $http
                            .get($sce.getTrustedResourceUrl(templateUrl), {
                                cache: $templateCache,
                            })
                            .success(function (content) {
                                var compileNode,
                                    tempTemplateAttrs,
                                    $template,
                                    childBoundTranscludeFn;
                                if (
                                    ((content = denormalizeTemplate(content)),
                                    origAsyncDirective.replace)
                                ) {
                                    if (
                                        (($template = jqLite(
                                            "<div>" + trim(content) + "</div>",
                                        ).contents()),
                                        (compileNode = $template[0]),
                                        1 != $template.length || 1 !== compileNode.nodeType)
                                    )
                                        throw $compileMinErr(
                                            "tplrt",
                                            "Template for directive '{0}' must have exactly one root element. {1}",
                                            origAsyncDirective.name,
                                            templateUrl,
                                        );
                                    (tempTemplateAttrs = {
                                        $attr: {},
                                    }),
                                    replaceWith($rootElement, $compileNode, compileNode);
                                    var templateDirectives = collectDirectives(
                                        compileNode,
                                        [],
                                        tempTemplateAttrs,
                                    );
                                    isObject(origAsyncDirective.scope) &&
                      markDirectivesAsIsolate(templateDirectives),
                                    (directives = templateDirectives.concat(directives)),
                                    mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
                                } else (compileNode = beforeTemplateCompileNode), $compileNode.html(content);
                                for (
                                    directives.unshift(derivedSyncDirective),
                                    afterTemplateNodeLinkFn = applyDirectivesToNode(
                                        directives,
                                        compileNode,
                                        tAttrs,
                                        childTranscludeFn,
                                        $compileNode,
                                        origAsyncDirective,
                                        preLinkFns,
                                        postLinkFns,
                                        previousCompileContext,
                                    ),
                                    forEach($rootElement, function (node, i) {
                                        compileNode == node &&
                          ($rootElement[i] = $compileNode[0]);
                                    }),
                                    afterTemplateChildLinkFn = compileNodes(
                                        $compileNode[0].childNodes,
                                        childTranscludeFn,
                                    );
                                    linkQueue.length;

                                ) {
                                    var scope = linkQueue.shift(),
                                        beforeTemplateLinkNode = linkQueue.shift(),
                                        linkRootElement = linkQueue.shift(),
                                        boundTranscludeFn = linkQueue.shift(),
                                        linkNode = $compileNode[0];
                                    if (
                                        (beforeTemplateCompileNode !== beforeTemplateLinkNode &&
                        ((linkNode = jqLiteClone(compileNode)),
                        replaceWith(
                            linkRootElement,
                            jqLite(beforeTemplateLinkNode),
                            linkNode,
                        )),
                                        afterTemplateNodeLinkFn.transclude)
                                    )
                                        childBoundTranscludeFn = createBoundTranscludeFn(
                                            scope,
                                            afterTemplateNodeLinkFn.transclude,
                                        );
                                    else childBoundTranscludeFn = boundTranscludeFn;
                                    afterTemplateNodeLinkFn(
                                        afterTemplateChildLinkFn,
                                        scope,
                                        linkNode,
                                        $rootElement,
                                        childBoundTranscludeFn,
                                    );
                                }
                                linkQueue = null;
                            })
                            .error(function (response, code, headers, config) {
                                throw $compileMinErr(
                                    "tpload",
                                    "Failed to load template: {0}",
                                    config.url,
                                );
                            }),
                        function (
                            ignoreChildLinkFn,
                            scope,
                            node,
                            rootElement,
                            boundTranscludeFn,
                        ) {
                            if (linkQueue)
                                linkQueue.push(scope),
                                linkQueue.push(node),
                                linkQueue.push(rootElement),
                                linkQueue.push(boundTranscludeFn);
                            else
                                afterTemplateNodeLinkFn(
                                    afterTemplateChildLinkFn,
                                    scope,
                                    node,
                                    rootElement,
                                    boundTranscludeFn,
                                );
                        }
                    );
                }
                function byPriority(a, b) {
                    var diff = b.priority - a.priority;
                    if (0 !== diff) return diff;
                    if (a.name !== b.name) return a.name < b.name ? -1 : 1;
                    return a.index - b.index;
                }
                function assertNoDuplicate(
                    what,
                    previousDirective,
                    directive,
                    element,
                ) {
                    if (previousDirective)
                        throw $compileMinErr(
                            "multidir",
                            "Multiple directives [{0}, {1}] asking for {2} on: {3}",
                            previousDirective.name,
                            directive.name,
                            what,
                            startingTag(element),
                        );
                }
                function addTextInterpolateDirective(directives, text) {
                    var interpolateFn = $interpolate(text, !0);
                    interpolateFn &&
              directives.push({
                  priority: 0,
                  compile: valueFn(function (scope, node) {
                      var parent = node.parent(),
                          bindings = parent.data("$binding") || [];
                      bindings.push(interpolateFn),
                      safeAddClass(
                          parent.data("$binding", bindings),
                          "ng-binding",
                      ),
                      scope.$watch(interpolateFn, function (value) {
                          node[0].nodeValue = value;
                      });
                  }),
              });
                }
                function getTrustedContext(node, attrNormalizedName) {
                    if ("srcdoc" == attrNormalizedName) return $sce.HTML;
                    var tag = nodeName_(node);
                    if (
                        "xlinkHref" == attrNormalizedName ||
              ("FORM" == tag && "action" == attrNormalizedName) ||
              ("IMG" != tag &&
                ("src" == attrNormalizedName || "ngSrc" == attrNormalizedName))
                    )
                        return $sce.RESOURCE_URL;
                }
                function addAttrInterpolateDirective(node, directives, value, name) {
                    var interpolateFn = $interpolate(value, !0);
                    if (!interpolateFn) return;
                    if ("multiple" === name && nodeName_(node) === "SELECT")
                        throw $compileMinErr(
                            "selmulti",
                            "Binding to the 'multiple' attribute is not supported. Element: {0}",
                            startingTag(node),
                        );
                    directives.push({
                        priority: 100,
                        compile: function () {
                            return {
                                pre: function (scope, element, attr) {
                                    var $$observers =
                      attr.$$observers || (attr.$$observers = {});
                                    if (/^(on[a-z]+|formaction)$/.test(name))
                                        throw $compileMinErr(
                                            "nodomevents",
                                            "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.",
                                        );
                                    if (
                                        ((interpolateFn = $interpolate(
                                            attr[name],
                                            !0,
                                            getTrustedContext(node, name),
                                        )),
                                        !interpolateFn)
                                    )
                                        return;
                                    (attr[name] = interpolateFn(scope)),
                                    ((
                                        $$observers[name] || ($$observers[name] = [])
                                    ).$$inter = !0),
                                    (
                                        (attr.$$observers && attr.$$observers[name].$$scope) ||
                        scope
                                    ).$watch(interpolateFn, function (newValue, oldValue) {
                                        if ("class" === name && newValue != oldValue)
                                            attr.$updateClass(newValue, oldValue);
                                        else attr.$set(name, newValue);
                                    });
                                },
                            };
                        },
                    });
                }
                function replaceWith($rootElement, elementsToRemove, newNode) {
                    var firstElementToRemove = elementsToRemove[0],
                        removeCount = elementsToRemove.length,
                        parent = firstElementToRemove.parentNode,
                        i;
                    if ($rootElement)
                        for (i = 0; i < $rootElement.length; i++)
                            if ($rootElement[i] == firstElementToRemove) {
                                $rootElement[i++] = newNode;
                                for (
                                    var j = i,
                                        j2 = j + removeCount - 1,
                                        jj = $rootElement.length;
                                    jj > j;
                                    j++, j2++
                                )
                                    if (jj > j2) $rootElement[j] = $rootElement[j2];
                                    else delete $rootElement[j];
                                $rootElement.length -= removeCount - 1;
                                break;
                            }
                    parent && parent.replaceChild(newNode, firstElementToRemove);
                    var fragment = document.createDocumentFragment();
                    fragment.appendChild(firstElementToRemove),
                    (newNode[jqLite.expando] = firstElementToRemove[jqLite.expando]);
                    for (var k = 1, kk = elementsToRemove.length; kk > k; k++) {
                        var element = elementsToRemove[k];
                        jqLite(element).remove(),
                        fragment.appendChild(element),
                        delete elementsToRemove[k];
                    }
                    (elementsToRemove[0] = newNode), (elementsToRemove.length = 1);
                }
                function cloneAndAnnotateFn(fn, annotation) {
                    return extend(
                        function () {
                            return fn.apply(null, arguments);
                        },
                        fn,
                        annotation,
                    );
                }
            },
        ]);
    }
    var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
    function directiveNormalize(name) {
        return camelCase(name.replace(PREFIX_REGEXP, ""));
    }
    function tokenDifference(str1, str2) {
        var values = "",
            tokens1 = str1.split(/\s+/),
            tokens2 = str2.split(/\s+/);
        outer: for (var i = 0; i < tokens1.length; i++) {
            for (var token = tokens1[i], j = 0; j < tokens2.length; j++)
                if (token == tokens2[j]) continue outer;
            values += (values.length > 0 ? " " : "") + token;
        }
        return values;
    }
    function $ControllerProvider() {
        var controllers = {},
            CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
        (this.register = function (name, constructor) {
            if ((assertNotHasOwnProperty(name, "controller"), isObject(name)))
                extend(controllers, name);
            else controllers[name] = constructor;
        }),
        (this.$get = [
            "$injector",
            "$window",
            function ($injector, $window) {
                return function (expression, locals) {
                    var instance, match, constructor, identifier;
                    if (
                        (isString(expression) &&
                ((match = expression.match(CNTRL_REG)),
                (constructor = match[1]),
                (identifier = match[3]),
                (expression = controllers.hasOwnProperty(constructor)
                    ? controllers[constructor]
                    : getter(locals.$scope, constructor, !0) ||
                    getter($window, constructor, !0)),
                assertArgFn(expression, constructor, !0)),
                        (instance = $injector.instantiate(expression, locals)),
                        identifier)
                    ) {
                        if (!locals || "object" != typeof locals.$scope)
                            throw minErr("$controller")(
                                "noscp",
                                "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.",
                                constructor || expression.name,
                                identifier,
                            );
                        locals.$scope[identifier] = instance;
                    }
                    return instance;
                };
            },
        ]);
    }
    function $DocumentProvider() {
        this.$get = [
            "$window",
            function (window) {
                return jqLite(window.document);
            },
        ];
    }
    function $ExceptionHandlerProvider() {
        this.$get = [
            "$log",
            function ($log) {
                return function (exception, cause) {
                    $log.error.apply($log, arguments);
                };
            },
        ];
    }
    function parseHeaders(headers) {
        var parsed = {},
            key,
            val,
            i;
        if (!headers) return parsed;
        return (
            forEach(headers.split("\n"), function (line) {
                if (
                    ((i = line.indexOf(":")),
                    (key = lowercase(trim(line.substr(0, i)))),
                    (val = trim(line.substr(i + 1))),
                    key)
                ) {
                    if (parsed[key]) parsed[key] += ", " + val;
                    else parsed[key] = val;
                }
            }),
            parsed
        );
    }
    function headersGetter(headers) {
        var headersObj = isObject(headers) ? headers : void 0;
        return function (name) {
            if ((headersObj || (headersObj = parseHeaders(headers)), name))
                return headersObj[lowercase(name)] || null;
            return headersObj;
        };
    }
    function transformData(data, headers, fns) {
        if (isFunction(fns)) return fns(data, headers);
        return (
            forEach(fns, function (fn) {
                data = fn(data, headers);
            }),
            data
        );
    }
    function isSuccess(status) {
        return 200 <= status && 300 > status;
    }
    function $HttpProvider() {
        var PROTECTION_PREFIX = /^\)\]\}',?\n/,
            CONTENT_TYPE_APPLICATION_JSON = {
                "Content-Type": "application/json;charset=utf-8",
            },
            defaults = (this.defaults = {
                transformResponse: [
                    function (data) {
                        return (
                            isString(data) &&
                ((data = data.replace(PROTECTION_PREFIX, "")),
                /^\s*(\[|\{[^\{])/.test(data) &&
                  /[\}\]]\s*$/.test(data) &&
                  (data = fromJson(data))),
                            data
                        );
                    },
                ],
                transformRequest: [
                    function (d) {
                        return isObject(d) && !isFile(d) ? toJson(d) : d;
                    },
                ],
                headers: {
                    common: {
                        Accept: "application/json, text/plain, */*",
                    },
                    post: CONTENT_TYPE_APPLICATION_JSON,
                    put: CONTENT_TYPE_APPLICATION_JSON,
                    patch: CONTENT_TYPE_APPLICATION_JSON,
                },
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
            }),
            interceptorFactories = (this.interceptors = []),
            responseInterceptorFactories = (this.responseInterceptors = []);
        this.$get = [
            "$httpBackend",
            "$browser",
            "$cacheFactory",
            "$rootScope",
            "$q",
            "$injector",
            function (
                $httpBackend,
                $browser,
                $cacheFactory,
                $rootScope,
                $q,
                $injector,
            ) {
                var defaultCache = $cacheFactory("$http"),
                    reversedInterceptors = [];
                forEach(interceptorFactories, function (interceptorFactory) {
                    reversedInterceptors.unshift(
                        isString(interceptorFactory)
                            ? $injector.get(interceptorFactory)
                            : $injector.invoke(interceptorFactory),
                    );
                }),
                forEach(
                    responseInterceptorFactories,
                    function (interceptorFactory, index) {
                        var responseFn = isString(interceptorFactory)
                            ? $injector.get(interceptorFactory)
                            : $injector.invoke(interceptorFactory);
                        reversedInterceptors.splice(index, 0, {
                            response: function (response) {
                                return responseFn($q.when(response));
                            },
                            responseError: function (response) {
                                return responseFn($q.reject(response));
                            },
                        });
                    },
                );
                function $http(requestConfig) {
                    var config = {
                            transformRequest: defaults.transformRequest,
                            transformResponse: defaults.transformResponse,
                        },
                        headers = mergeHeaders(requestConfig);
                    extend(config, requestConfig),
                    (config.headers = headers),
                    (config.method = uppercase(config.method));
                    var xsrfValue = urlIsSameOrigin(config.url)
                        ? $browser.cookies()[
                            config.xsrfCookieName || defaults.xsrfCookieName
                        ]
                        : void 0;
                    xsrfValue &&
            (headers[
                config.xsrfHeaderName || defaults.xsrfHeaderName
            ] = xsrfValue);
                    var chain = [
                            function (config1) {
                                headers = config1.headers;
                                var reqData = transformData(
                                    config1.data,
                                    headersGetter(headers),
                                    config1.transformRequest,
                                );
                                return (
                                    isUndefined(config1.data) &&
                    forEach(headers, function (value, header) {
                        lowercase(header) === "content-type" &&
                        delete headers[header];
                    }),
                                    isUndefined(config1.withCredentials) &&
                    !isUndefined(defaults.withCredentials) &&
                    (config1.withCredentials = defaults.withCredentials),
                                    sendReq(config1, reqData, headers).then(
                                        transformResponse,
                                        transformResponse,
                                    )
                                );
                            },
                            void 0,
                        ],
                        promise = $q.when(config);
                    for (
                        forEach(reversedInterceptors, function (interceptor) {
                            (interceptor.request || interceptor.requestError) &&
                chain.unshift(interceptor.request, interceptor.requestError),
                            (interceptor.response || interceptor.responseError) &&
                  chain.push(interceptor.response, interceptor.responseError);
                        });
                        chain.length;

                    ) {
                        var thenFn = chain.shift(),
                            rejectFn = chain.shift();
                        promise = promise.then(thenFn, rejectFn);
                    }
                    return (
                        (promise.success = function (fn) {
                            return (
                                promise.then(function (response) {
                                    fn(response.data, response.status, response.headers, config);
                                }),
                                promise
                            );
                        }),
                        (promise.error = function (fn) {
                            return (
                                promise.then(null, function (response) {
                                    fn(response.data, response.status, response.headers, config);
                                }),
                                promise
                            );
                        }),
                        promise
                    );
                    function transformResponse(response) {
                        var resp = extend({}, response, {
                            data: transformData(
                                response.data,
                                response.headers,
                                config.transformResponse,
                            ),
                        });
                        return isSuccess(response.status) ? resp : $q.reject(resp);
                    }
                    function mergeHeaders(config1) {
                        var defHeaders = defaults.headers,
                            reqHeaders = extend({}, config1.headers),
                            defHeaderName,
                            lowercaseDefHeaderName,
                            reqHeaderName;
                        (defHeaders = extend(
                            {},
                            defHeaders.common,
                            defHeaders[lowercase(config1.method)],
                        )),
                        execHeaders(defHeaders),
                        execHeaders(reqHeaders);
                        defaultHeadersIteration: for (defHeaderName in defHeaders) {
                            lowercaseDefHeaderName = lowercase(defHeaderName);
                            for (reqHeaderName in reqHeaders)
                                if (lowercase(reqHeaderName) === lowercaseDefHeaderName)
                                    continue defaultHeadersIteration;
                            reqHeaders[defHeaderName] = defHeaders[defHeaderName];
                        }
                        return reqHeaders;
                        function execHeaders(headers1) {
                            var headerContent;
                            forEach(headers1, function (headerFn, header) {
                                if (isFunction(headerFn)) {
                                    if (((headerContent = headerFn()), null != headerContent))
                                        headers1[header] = headerContent;
                                    else delete headers1[header];
                                }
                            });
                        }
                    }
                }
                return (
                    ($http.pendingRequests = []),
                    createShortMethods("get", "delete", "head", "jsonp"),
                    createShortMethodsWithData("post", "put"),
                    ($http.defaults = defaults),
                    $http
                );
                function createShortMethods(names) {
                    forEach(arguments, function (name) {
                        $http[name] = function (url, config) {
                            return $http(
                                extend(config || {}, {
                                    method: name,
                                    url: url,
                                }),
                            );
                        };
                    });
                }
                function createShortMethodsWithData(name) {
                    forEach(arguments, function (name1) {
                        $http[name1] = function (url, data, config) {
                            return $http(
                                extend(config || {}, {
                                    method: name1,
                                    url: url,
                                    data: data,
                                }),
                            );
                        };
                    });
                }
                function sendReq(config, reqData, reqHeaders) {
                    var deferred = $q.defer(),
                        promise = deferred.promise,
                        cache,
                        cachedResp,
                        url = buildUrl(config.url, config.params);
                    if (
                        ($http.pendingRequests.push(config),
                        promise.then(removePendingReq, removePendingReq),
                        (config.cache || defaults.cache) &&
              config.cache !== !1 &&
              "GET" == config.method &&
              (cache = isObject(config.cache)
                  ? config.cache
                  : isObject(defaults.cache)
                      ? defaults.cache
                      : defaultCache),
                        cache)
                    ) {
                        if (((cachedResp = cache.get(url)), isDefined(cachedResp))) {
                            if (cachedResp.then)
                                return (
                                    cachedResp.then(removePendingReq, removePendingReq),
                                    cachedResp
                                );
                            if (isArray(cachedResp))
                                resolvePromise(
                                    cachedResp[1],
                                    cachedResp[0],
                                    copy(cachedResp[2]),
                                );
                            else resolvePromise(cachedResp, 200, {});
                        } else cache.put(url, promise);
                    }
                    return (
                        isUndefined(cachedResp) &&
              $httpBackend(
                  config.method,
                  url,
                  reqData,
                  done,
                  reqHeaders,
                  config.timeout,
                  config.withCredentials,
                  config.responseType,
              ),
                        promise
                    );
                    function done(status, response, headersString) {
                        if (cache) {
                            if (isSuccess(status))
                                cache.put(url, [status, response, parseHeaders(headersString)]);
                            else cache.remove(url);
                        }
                        resolvePromise(response, status, headersString),
                        $rootScope.$$phase || $rootScope.$apply();
                    }
                    function resolvePromise(response, status, headers) {
                        (status = Math.max(status, 0)),
                        (isSuccess(status) ? deferred.resolve : deferred.reject)({
                            data: response,
                            status: status,
                            headers: headersGetter(headers),
                            config: config,
                        });
                    }
                    function removePendingReq() {
                        var idx = indexOf($http.pendingRequests, config);
                        -1 !== idx && $http.pendingRequests.splice(idx, 1);
                    }
                }
                function buildUrl(url, params) {
                    if (!params) return url;
                    var parts = [];
                    return (
                        forEachSorted(params, function (value, key) {
                            if (null === value || isUndefined(value)) return;
                            isArray(value) || (value = [value]),
                            forEach(value, function (v) {
                                isObject(v) && (v = toJson(v)),
                                parts.push(encodeUriQuery(key) + "=" + encodeUriQuery(v));
                            });
                        }),
                        url + (url.indexOf("?") == -1 ? "?" : "&") + parts.join("&")
                    );
                }
            },
        ];
    }
    var XHR =
    window.XMLHttpRequest ||
    function () {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e1) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e2) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e3) {}
        throw minErr("$httpBackend")(
            "noxhr",
            "This browser does not support XMLHttpRequest.",
        );
    };
    function $HttpBackendProvider() {
        this.$get = [
            "$browser",
            "$window",
            "$document",
            function ($browser, $window, $document) {
                return createHttpBackend(
                    $browser,
                    XHR,
                    $browser.defer,
                    $window.angular.callbacks,
                    $document[0],
                );
            },
        ];
    }
    function createHttpBackend(
        $browser,
        XHR1,
        $browserDefer,
        callbacks,
        rawDocument,
    ) {
        return function (
            method,
            url,
            post,
            callback,
            headers,
            timeout,
            withCredentials,
            responseType,
        ) {
            var status;
            if (
                ($browser.$$incOutstandingRequestCount(),
                (url ||= $browser.url()),
                lowercase(method) == "jsonp")
            ) {
                var callbackId = "_" + (callbacks.counter++).toString(36);
                callbacks[callbackId] = function (data) {
                    callbacks[callbackId].data = data;
                };
                var jsonpDone = jsonpReq(
                    url.replace("JSON_CALLBACK", "angular.callbacks." + callbackId),
                    function () {
                        if (callbacks[callbackId].data)
                            completeRequest(callback, 200, callbacks[callbackId].data);
                        else completeRequest(callback, status || -2);
                        delete callbacks[callbackId];
                    },
                );
            } else {
                var xhr = new XHR1();
                xhr.open(method, url, !0),
                forEach(headers, function (value, key) {
                    isDefined(value) && xhr.setRequestHeader(key, value);
                }),
                (xhr.onreadystatechange = function () {
                    if (4 == xhr.readyState) {
                        var responseHeaders = null,
                            response = null;
                        -1 !== status &&
                ((responseHeaders = xhr.getAllResponseHeaders()),
                (response = xhr.responseType
                    ? xhr.response
                    : xhr.responseText)),
                        completeRequest(
                            callback,
                            status || xhr.status,
                            response,
                            responseHeaders,
                        );
                    }
                }),
                withCredentials && (xhr.withCredentials = !0),
                responseType && (xhr.responseType = responseType),
                xhr.send(post || null);
            }
            if (timeout > 0) var timeoutId = $browserDefer(timeoutRequest, timeout);
            else timeout && timeout.then && timeout.then(timeoutRequest);
            function timeoutRequest() {
                (status = -1), jsonpDone && jsonpDone(), xhr && xhr.abort();
            }
            function completeRequest(callback, status1, response, headersString) {
                timeoutId && $browserDefer.cancel(timeoutId),
                (jsonpDone = xhr = null),
                (status1 =
            "file" == urlResolve(url).protocol && 0 === status1
                ? response
                    ? 200
                    : 404
                : status1),
                (status1 = 1223 == status1 ? 204 : status1),
                callback(status1, response, headersString),
                $browser.$$completeOutstandingRequest(noop);
            }
        };
        function jsonpReq(url, done) {
            var script = rawDocument.createElement("script"),
                doneWrapper = function () {
                    (script.onreadystatechange = script.onload = script.onerror = null),
                    rawDocument.body.removeChild(script),
                    done && done();
                };
            if (
                ((script.type = "text/javascript"),
                (script.src = url),
                msie && 8 >= msie)
            )
                script.onreadystatechange = function () {
                    /loaded|complete/.test(script.readyState) && doneWrapper();
                };
            else
                script.onload = script.onerror = function () {
                    doneWrapper();
                };
            return rawDocument.body.appendChild(script), doneWrapper;
        }
    }
    var $interpolateMinErr = minErr("$interpolate");
    function $InterpolateProvider() {
        var startSymbol = "{{",
            endSymbol = "}}";
        (this.startSymbol = function (value) {
            if (value) return (startSymbol = value), this;
            return startSymbol;
        }),
        (this.endSymbol = function (value) {
            if (value) return (endSymbol = value), this;
            return endSymbol;
        }),
        (this.$get = [
            "$parse",
            "$exceptionHandler",
            "$sce",
            function ($parse, $exceptionHandler, $sce) {
                var startSymbolLength = startSymbol.length,
                    endSymbolLength = endSymbol.length;
                function $interpolate(text, mustHaveExpression, trustedContext) {
                    for (
                        var startIndex,
                            endIndex,
                            index = 0,
                            parts = [],
                            length = text.length,
                            hasInterpolation = !1,
                            fn,
                            exp,
                            concat1 = [];
                        length > index;

                    )
                        if (
                            (startIndex = text.indexOf(startSymbol, index)) != -1 &&
                (endIndex = text.indexOf(
                    endSymbol,
                    startIndex + startSymbolLength,
                )) != -1
                        )
                            index != startIndex &&
                  parts.push(text.substring(index, startIndex)),
                            parts.push(
                                (fn = $parse(
                                    (exp = text.substring(
                                        startIndex + startSymbolLength,
                                        endIndex,
                                    )),
                                )),
                            ),
                            (fn.exp = exp),
                            (index = endIndex + endSymbolLength),
                            (hasInterpolation = !0);
                        else
                            index != length && parts.push(text.substring(index)),
                            (index = length);
                    if (
                        ((length = parts.length) || (parts.push(""), (length = 1)),
                        trustedContext && parts.length > 1)
                    )
                        throw $interpolateMinErr(
                            "noconcat",
                            "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce",
                            text,
                        );
                    if (!mustHaveExpression || hasInterpolation)
                        return (
                            (concat1.length = length),
                            (fn = function (context) {
                                try {
                                    for (var i = 0, ii = length, part; ii > i; i++) {
                                        if ("function" == typeof (part = parts[i])) {
                                            if (((part = part(context)), trustedContext))
                                                part = $sce.getTrusted(trustedContext, part);
                                            else part = $sce.valueOf(part);
                                            if (null === part || isUndefined(part)) part = "";
                                            else "string" != typeof part && (part = toJson(part));
                                        }
                                        concat1[i] = part;
                                    }
                                    return concat1.join("");
                                } catch (err) {
                                    var newErr = $interpolateMinErr(
                                        "interr",
                                        "Can't interpolate: {0}\n{1}",
                                        text,
                                        err.toString(),
                                    );
                                    $exceptionHandler(newErr);
                                }
                            }),
                            (fn.exp = text),
                            (fn.parts = parts),
                            fn
                        );
                }
                return (
                    ($interpolate.startSymbol = function () {
                        return startSymbol;
                    }),
                    ($interpolate.endSymbol = function () {
                        return endSymbol;
                    }),
                    $interpolate
                );
            },
        ]);
    }
    function $IntervalProvider() {
        this.$get = [
            "$rootScope",
            "$window",
            "$q",
            function ($rootScope, $window, $q) {
                var intervals = {};
                function interval(fn, delay, count, invokeApply) {
                    var setInterval = $window.setInterval,
                        clearInterval = $window.clearInterval,
                        deferred = $q.defer(),
                        promise = deferred.promise,
                        iteration = 0,
                        skipApply = isDefined(invokeApply) && !invokeApply;
                    return (
                        (count = isDefined(count) ? count : 0),
                        promise.then(null, null, fn),
                        (promise.$$intervalId = setInterval(function () {
                            deferred.notify(iteration++),
                            count > 0 &&
                  iteration >= count &&
                  (deferred.resolve(iteration),
                  clearInterval(promise.$$intervalId),
                  delete intervals[promise.$$intervalId]),
                            skipApply || $rootScope.$apply();
                        }, delay)),
                        (intervals[promise.$$intervalId] = deferred),
                        promise
                    );
                }
                return (
                    (interval.cancel = function (promise) {
                        if (promise && promise.$$intervalId in intervals)
                            return (
                                intervals[promise.$$intervalId].reject("canceled"),
                                clearInterval(promise.$$intervalId),
                                delete intervals[promise.$$intervalId],
                                !0
                            );
                        return !1;
                    }),
                    interval
                );
            },
        ];
    }
    function $LocaleProvider() {
        this.$get = function () {
            return {
                id: "en-us",
                NUMBER_FORMATS: {
                    DECIMAL_SEP: ".",
                    GROUP_SEP: ",",
                    PATTERNS: [
                        {
                            minInt: 1,
                            minFrac: 0,
                            maxFrac: 3,
                            posPre: "",
                            posSuf: "",
                            negPre: "-",
                            negSuf: "",
                            gSize: 3,
                            lgSize: 3,
                        },
                        {
                            minInt: 1,
                            minFrac: 2,
                            maxFrac: 2,
                            posPre: "\u00A4",
                            posSuf: "",
                            negPre: "(\u00A4",
                            negSuf: ")",
                            gSize: 3,
                            lgSize: 3,
                        },
                    ],
                    CURRENCY_SYM: "$",
                },
                DATETIME_FORMATS: {
                    MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(
                        ",",
                    ),
                    SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(
                        ",",
                    ),
                    DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(
                        ",",
                    ),
                    SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                    AMPMS: ["AM", "PM"],
                    medium: "MMM d, y h:mm:ss a",
                    short: "M/d/yy h:mm a",
                    fullDate: "EEEE, MMMM d, y",
                    longDate: "MMMM d, y",
                    mediumDate: "MMM d, y",
                    shortDate: "M/d/yy",
                    mediumTime: "h:mm:ss a",
                    shortTime: "h:mm a",
                },
                pluralCat: function (num) {
                    if (1 === num) return "one";
                    return "other";
                },
            };
        };
    }
    var $locationMinErr = minErr("$location");
    function encodePath(path) {
        for (var segments = path.split("/"), i = segments.length; i--; )
            segments[i] = encodeUriSegment(segments[i]);
        return segments.join("/");
    }
    function parseAbsoluteUrl(absoluteUrl, locationObj, appBase) {
        var parsedUrl = urlResolve(absoluteUrl, appBase);
        (locationObj.$$protocol = parsedUrl.protocol),
        (locationObj.$$host = parsedUrl.hostname),
        (locationObj.$$port =
        int(parsedUrl.port) ||
        {
            http: 80,
            https: 443,
            ftp: 21,
        }[parsedUrl.protocol] ||
        null);
    }
    function parseAppUrl(relativeUrl, locationObj, appBase) {
        var prefixed = relativeUrl.charAt(0) !== "/";
        prefixed && (relativeUrl = "/" + relativeUrl);
        var match = urlResolve(relativeUrl, appBase);
        (locationObj.$$path = decodeURIComponent(
            prefixed && match.pathname.charAt(0) === "/"
                ? match.pathname.substring(1)
                : match.pathname,
        )),
        (locationObj.$$search = parseKeyValue(match.search)),
        (locationObj.$$hash = decodeURIComponent(match.hash)),
        locationObj.$$path &&
        locationObj.$$path.charAt(0) != "/" &&
        (locationObj.$$path = "/" + locationObj.$$path);
    }
    function beginsWith(begin, whole) {
        if (whole.indexOf(begin) === 0) return whole.substr(begin.length);
    }
    function stripHash(url) {
        var index = url.indexOf("#");
        return -1 == index ? url : url.substr(0, index);
    }
    function stripFile(url) {
        return url.substr(0, stripHash(url).lastIndexOf("/") + 1);
    }
    function serverBase(url) {
        return url.substring(0, url.indexOf("/", url.indexOf("//") + 2));
    }
    function LocationHtml5Url(appBase, basePrefix) {
        (this.$$html5 = !0), (basePrefix ||= "");
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this, appBase),
        (this.$$parse = function (url) {
            var pathUrl = beginsWith(appBaseNoFile, url);
            if (!isString(pathUrl))
                throw $locationMinErr(
                    "ipthprfx",
                    'Invalid url "{0}", missing path prefix "{1}".',
                    url,
                    appBaseNoFile,
                );
            parseAppUrl(pathUrl, this, appBase),
            this.$$path || (this.$$path = "/"),
            this.$$compose();
        }),
        (this.$$compose = function () {
            (this.$$url =
          encodePath(this.$$path) +
          (search ? "?" + search : "") +
          (this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "")),
            (this.$$absUrl = appBaseNoFile + this.$$url.substr(1));
        }),
        (this.$$rewrite = function (url) {
            var appUrl, prevAppUrl;
            if ((appUrl = beginsWith(appBase, url)) !== void 0) {
                if (
                    ((prevAppUrl = appUrl),
                    (appUrl = beginsWith(basePrefix, appUrl)) !== void 0)
                )
                    return appBaseNoFile + (beginsWith("/", appUrl) || appUrl);
                return appBase + prevAppUrl;
            } else if ((appUrl = beginsWith(appBaseNoFile, url)) !== void 0)
                return appBaseNoFile + appUrl;
            else if (appBaseNoFile == url + "/") return appBaseNoFile;
        });
    }
    function LocationHashbangUrl(appBase, hashPrefix) {
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this, appBase),
        (this.$$parse = function (url) {
            var withoutBaseUrl =
            beginsWith(appBase, url) || beginsWith(appBaseNoFile, url),
                withoutHashUrl =
            withoutBaseUrl.charAt(0) == "#"
                ? beginsWith(hashPrefix, withoutBaseUrl)
                : this.$$html5
                    ? withoutBaseUrl
                    : "";
            if (!isString(withoutHashUrl))
                throw $locationMinErr(
                    "ihshprfx",
                    'Invalid url "{0}", missing hash prefix "{1}".',
                    url,
                    hashPrefix,
                );
            parseAppUrl(withoutHashUrl, this, appBase),
            (this.$$path = removeWindowsDriveName(
                this.$$path,
                withoutHashUrl,
                appBase,
            )),
            this.$$compose();
            function removeWindowsDriveName(path, url, base) {
                var windowsFilePathExp = /^\/?.*?:(\/.*)/,
                    firstPathSegmentMatch;
                if (
                    (url.indexOf(base) === 0 && (url = url.replace(base, "")),
                    windowsFilePathExp.exec(url))
                )
                    return path;
                return (
                    (firstPathSegmentMatch = windowsFilePathExp.exec(path)),
                    firstPathSegmentMatch ? firstPathSegmentMatch[1] : path
                );
            }
        }),
        (this.$$compose = function () {
            (this.$$url =
          encodePath(this.$$path) +
          (search ? "?" + search : "") +
          (this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "")),
            (this.$$absUrl =
            appBase + (this.$$url ? hashPrefix + this.$$url : ""));
        }),
        (this.$$rewrite = function (url) {
            if (stripHash(appBase) == stripHash(url)) return url;
        });
    }
    function LocationHashbangInHtml5Url(appBase, hashPrefix) {
        (this.$$html5 = !0), LocationHashbangUrl.apply(this, arguments);
        var appBaseNoFile = stripFile(appBase);
        this.$$rewrite = function (url) {
            var appUrl;
            if (appBase == stripHash(url)) return url;
            if ((appUrl = beginsWith(appBaseNoFile, url)))
                return appBase + hashPrefix + appUrl;
            if (appBaseNoFile === url + "/") return appBaseNoFile;
        };
    }
    LocationHashbangInHtml5Url.prototype = LocationHashbangUrl.prototype = LocationHtml5Url.prototype = {
        $$html5: !1,
        $$replace: !1,
        absUrl: locationGetter("$$absUrl"),
        url: function (url, replace) {
            if (isUndefined(url)) return this.$$url;
            var match = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/.exec(url);
            return (
                match[1] && this.path(decodeURIComponent(match[1])),
                (match[2] || match[1]) && this.search(match[3] || ""),
                this.hash(match[5] || "", replace),
                this
            );
        },
        protocol: locationGetter("$$protocol"),
        host: locationGetter("$$host"),
        port: locationGetter("$$port"),
        path: locationGetterSetter("$$path", function (path) {
            return path.charAt(0) == "/" ? path : "/" + path;
        }),
        search: function (search, paramValue) {
            switch (arguments.length) {
            case 0:
                return this.$$search;
            case 1:
                if (isString(search)) this.$$search = parseKeyValue(search);
                else if (isObject(search)) this.$$search = search;
                else
                    throw $locationMinErr(
                        "isrcharg",
                        "The first argument of the `$location#search()` call must be a string or an object.",
                    );
                break;
            default:
                if (isUndefined(paramValue) || null === paramValue)
                    delete this.$$search[search];
                else this.$$search[search] = paramValue;
            }
            return this.$$compose(), this;
        },
        hash: locationGetterSetter("$$hash", identity),
        replace: function () {
            return (this.$$replace = !0), this;
        },
    };
    function locationGetter(property) {
        return function () {
            return this[property];
        };
    }
    function locationGetterSetter(property, preprocess) {
        return function (value) {
            if (isUndefined(value)) return this[property];
            return (this[property] = preprocess(value)), this.$$compose(), this;
        };
    }
    function $LocationProvider() {
        var hashPrefix = "",
            html5Mode = !1;
        (this.hashPrefix = function (prefix) {
            if (isDefined(prefix)) return (hashPrefix = prefix), this;
            return hashPrefix;
        }),
        (this.html5Mode = function (mode) {
            if (isDefined(mode)) return (html5Mode = mode), this;
            return html5Mode;
        }),
        (this.$get = [
            "$rootScope",
            "$browser",
            "$sniffer",
            "$rootElement",
            function ($rootScope, $browser, $sniffer, $rootElement) {
                var $location,
                    LocationMode,
                    baseHref = $browser.baseHref(),
                    initialUrl = $browser.url(),
                    appBase;
                if (html5Mode)
                    (appBase = serverBase(initialUrl) + (baseHref || "/")),
                    (LocationMode = $sniffer.history
                        ? LocationHtml5Url
                        : LocationHashbangInHtml5Url);
                else
                    (appBase = stripHash(initialUrl)),
                    (LocationMode = LocationHashbangUrl);
                ($location = new LocationMode(appBase, "#" + hashPrefix)),
                $location.$$parse($location.$$rewrite(initialUrl)),
                $rootElement.on("click", function (event) {
                    if (event.ctrlKey || event.metaKey || 2 == event.which) return;
                    for (
                        var elm = jqLite(event.target);
                        lowercase(elm[0].nodeName) !== "a";

                    )
                        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0])
                            return;
                    var absHref = elm.prop("href"),
                        rewrittenUrl = $location.$$rewrite(absHref);
                    absHref &&
                !elm.attr("target") &&
                rewrittenUrl &&
                !event.isDefaultPrevented() &&
                (event.preventDefault(),
                rewrittenUrl != $browser.url() &&
                  ($location.$$parse(rewrittenUrl),
                  $rootScope.$apply(),
                  (window.angular["ff-684208-preventDefault"] = !0)));
                }),
                $location.absUrl() != initialUrl &&
              $browser.url($location.absUrl(), !0),
                $browser.onUrlChange(function (newUrl) {
                    if ($location.absUrl() != newUrl) {
                        if (
                            $rootScope.$broadcast(
                                "$locationChangeStart",
                                newUrl,
                                $location.absUrl(),
                            ).defaultPrevented
                        ) {
                            $browser.url($location.absUrl());
                            return;
                        }
                        $rootScope.$evalAsync(function () {
                            var oldUrl = $location.absUrl();
                            $location.$$parse(newUrl), afterLocationChange(oldUrl);
                        }),
                        $rootScope.$$phase || $rootScope.$digest();
                    }
                });
                var changeCounter = 0;
                return (
                    $rootScope.$watch(function () {
                        var oldUrl = $browser.url(),
                            currentReplace = $location.$$replace;
                        return (
                            (!changeCounter || oldUrl != $location.absUrl()) &&
                  (changeCounter++,
                  $rootScope.$evalAsync(function () {
                      if (
                          $rootScope.$broadcast(
                              "$locationChangeStart",
                              $location.absUrl(),
                              oldUrl,
                          ).defaultPrevented
                      )
                          $location.$$parse(oldUrl);
                      else
                          $browser.url($location.absUrl(), currentReplace),
                          afterLocationChange(oldUrl);
                  })),
                            ($location.$$replace = !1),
                            changeCounter
                        );
                    }),
                    $location
                );
                function afterLocationChange(oldUrl) {
                    $rootScope.$broadcast(
                        "$locationChangeSuccess",
                        $location.absUrl(),
                        oldUrl,
                    );
                }
            },
        ]);
    }
    function $LogProvider() {
        var debug = !0,
            self = this;
        (this.debugEnabled = function (flag) {
            if (isDefined(flag)) return (debug = flag), this;
            return debug;
        }),
        (this.$get = [
            "$window",
            function ($window) {
                return {
                    log: consoleLog("log"),
                    info: consoleLog("info"),
                    warn: consoleLog("warn"),
                    error: consoleLog("error"),
                    debug: (function () {
                        return function () {
                            debug && consoleLog("debug").apply(self, arguments);
                        };
                    })(),
                };
                function formatError(arg) {
                    if (arg instanceof Error) {
                        if (arg.stack)
                            arg =
                  arg.message && arg.stack.indexOf(arg.message) === -1
                      ? "Error: " + arg.message + "\n" + arg.stack
                      : arg.stack;
                        else
                            arg.sourceURL &&
                  (arg = arg.message + "\n" + arg.sourceURL + ":" + arg.line);
                    }
                    return arg;
                }
                function consoleLog(type) {
                    var console = $window.console || {},
                        logFn = console[type] || console.log || noop;
                    if (logFn.apply)
                        return function () {
                            var args = [];
                            return (
                                forEach(arguments, function (arg) {
                                    args.push(formatError(arg));
                                }),
                                logFn.apply(console, args)
                            );
                        };
                    return function (arg1, arg2) {
                        logFn(arg1, null == arg2 ? "" : arg2);
                    };
                }
            },
        ]);
    }
    var $parseMinErr = minErr("$parse"),
        promiseWarningCache = {},
        promiseWarning;
    function ensureSafeMemberName(name, fullExpression) {
        if ("constructor" === name)
            throw $parseMinErr(
                "isecfld",
                'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}',
                fullExpression,
            );
        return name;
    }
    function ensureSafeObject(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj)
                throw $parseMinErr(
                    "isecfn",
                    "Referencing Function in Angular expressions is disallowed! Expression: {0}",
                    fullExpression,
                );
            if (obj.document && obj.location && obj.alert && obj.setInterval)
                throw $parseMinErr(
                    "isecwindow",
                    "Referencing the Window in Angular expressions is disallowed! Expression: {0}",
                    fullExpression,
                );
            if (obj.children && (obj.nodeName || (obj.on && obj.find)))
                throw $parseMinErr(
                    "isecdom",
                    "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}",
                    fullExpression,
                );
        }
        return obj;
    }
    var OPERATORS = {
            null: function () {
                return null;
            },
            true: function () {
                return !0;
            },
            false: function () {
                return !1;
            },
            undefined: noop,
            "+": function (self, locals, a, b) {
                if (((a = a(self, locals)), (b = b(self, locals)), isDefined(a))) {
                    if (isDefined(b)) return a + b;
                    return a;
                }
                return isDefined(b) ? b : void 0;
            },
            "-": function (self, locals, a, b) {
                return (
                    (a = a(self, locals)),
                    (b = b(self, locals)),
                    (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0)
                );
            },
            "*": function (self, locals, a, b) {
                return a(self, locals) * b(self, locals);
            },
            "/": function (self, locals, a, b) {
                return a(self, locals) / b(self, locals);
            },
            "%": function (self, locals, a, b) {
                return a(self, locals) % b(self, locals);
            },
            "^": function (self, locals, a, b) {
                return a(self, locals) ^ b(self, locals);
            },
            "=": noop,
            "===": function (self, locals, a, b) {
                return a(self, locals) === b(self, locals);
            },
            "!==": function (self, locals, a, b) {
                return a(self, locals) !== b(self, locals);
            },
            "==": function (self, locals, a, b) {
                return a(self, locals) == b(self, locals);
            },
            "!=": function (self, locals, a, b) {
                return a(self, locals) != b(self, locals);
            },
            "<": function (self, locals, a, b) {
                return a(self, locals) < b(self, locals);
            },
            ">": function (self, locals, a, b) {
                return a(self, locals) > b(self, locals);
            },
            "<=": function (self, locals, a, b) {
                return a(self, locals) <= b(self, locals);
            },
            ">=": function (self, locals, a, b) {
                return a(self, locals) >= b(self, locals);
            },
            "&&": function (self, locals, a, b) {
                return a(self, locals) && b(self, locals);
            },
            "||": function (self, locals, a, b) {
                return a(self, locals) || b(self, locals);
            },
            "&": function (self, locals, a, b) {
                return a(self, locals) & b(self, locals);
            },
            "|": function (self, locals, a, b) {
                return b(self, locals)(self, locals, a(self, locals));
            },
            "!": function (self, locals, a) {
                return !a(self, locals);
            },
        },
        Lexer = function (options) {
            this.options = options;
        };
    Lexer.prototype = {
        constructor: Lexer,
        lex: function (text) {
            (this.text = text),
            (this.index = 0),
            (this.ch = void 0),
            (this.lastCh = ":"),
            (this.tokens = []);
            for (var token, json = []; this.index < this.text.length; ) {
                if (((this.ch = this.text.charAt(this.index)), this.is("\"'")))
                    this.readString(this.ch);
                else if (
                    this.isNumber(this.ch) ||
          (this.is(".") && this.isNumber(this.peek()))
                )
                    this.readNumber();
                else if (this.isIdent(this.ch))
                    this.readIdent(),
                    this.was("{,") &&
              json[0] === "{" &&
              (token = this.tokens[this.tokens.length - 1]) &&
              (token.json = token.text.indexOf(".") === -1);
                else if (this.is("(){}[].,;:?"))
                    this.tokens.push({
                        index: this.index,
                        text: this.ch,
                        json: (this.was(":[,") && this.is("{[")) || this.is("}]:,"),
                    }),
                    this.is("{[") && json.unshift(this.ch),
                    this.is("}]") && json.shift(),
                    this.index++;
                else if (this.isWhitespace(this.ch)) {
                    this.index++;
                    continue;
                } else {
                    var ch2 = this.ch + this.peek(),
                        ch3 = ch2 + this.peek(2),
                        fn = OPERATORS[this.ch],
                        fn2 = OPERATORS[ch2],
                        fn3 = OPERATORS[ch3];
                    if (fn3)
                        this.tokens.push({
                            index: this.index,
                            text: ch3,
                            fn: fn3,
                        }),
                        (this.index += 3);
                    else if (fn2)
                        this.tokens.push({
                            index: this.index,
                            text: ch2,
                            fn: fn2,
                        }),
                        (this.index += 2);
                    else if (fn)
                        this.tokens.push({
                            index: this.index,
                            text: this.ch,
                            fn: fn,
                            json: this.was("[,:") && this.is("+-"),
                        }),
                        (this.index += 1);
                    else
                        this.throwError(
                            "Unexpected next character ",
                            this.index,
                            this.index + 1,
                        );
                }
                this.lastCh = this.ch;
            }
            return this.tokens;
        },
        is: function (chars) {
            return chars.indexOf(this.ch) !== -1;
        },
        was: function (chars) {
            return chars.indexOf(this.lastCh) !== -1;
        },
        peek: function (i) {
            var num = i || 1;
            return this.index + num < this.text.length
                ? this.text.charAt(this.index + num)
                : !1;
        },
        isNumber: function (ch) {
            return "0" <= ch && "9" >= ch;
        },
        isWhitespace: function (ch) {
            return (
                " " === ch ||
        "\r" === ch ||
        "\t" === ch ||
        "\n" === ch ||
        "\v" === ch ||
        "\u00A0" === ch
            );
        },
        isIdent: function (ch) {
            return (
                ("a" <= ch && "z" >= ch) ||
        ("A" <= ch && "Z" >= ch) ||
        "_" === ch ||
        "$" === ch
            );
        },
        isExpOperator: function (ch) {
            return "-" === ch || "+" === ch || this.isNumber(ch);
        },
        throwError: function (error, start, end) {
            this.index;
            var colStr = isDefined(start)
                ? "s " +
          start +
          "-" +
          this.index +
          " [" +
          this.text.substring(start, this.index) +
          "]"
                : " " + this.index;
            throw $parseMinErr(
                "lexerr",
                "Lexer Error: {0} at column{1} in expression [{2}].",
                error,
                colStr,
                this.text,
            );
        },
        readNumber: function () {
            for (
                var number = "", start = this.index;
                this.index < this.text.length;

            ) {
                var ch = lowercase(this.text.charAt(this.index));
                if ("." == ch || this.isNumber(ch)) number += ch;
                else {
                    var peekCh = this.peek();
                    if ("e" == ch && this.isExpOperator(peekCh)) number += ch;
                    else if (
                        this.isExpOperator(ch) &&
            peekCh &&
            this.isNumber(peekCh) &&
            number.charAt(number.length - 1) == "e"
                    )
                        number += ch;
                    else if (
                        this.isExpOperator(ch) &&
            (!peekCh || !this.isNumber(peekCh)) &&
            number.charAt(number.length - 1) == "e"
                    )
                        this.throwError("Invalid exponent");
                    else break;
                }
                this.index++;
            }
            (number *= 1),
            this.tokens.push({
                index: start,
                text: number,
                json: !0,
                fn: function () {
                    return number;
                },
            });
        },
        readIdent: function () {
            for (
                var parser = this,
                    ident = "",
                    start = this.index,
                    peekIndex,
                    methodName,
                    ch;
                this.index < this.text.length;

            ) {
                if (
                    ((ch = this.text.charAt(this.index)),
                    "." === ch || this.isIdent(ch) || this.isNumber(ch))
                )
                    "." === ch && this.index, (ident += ch);
                else break;
                this.index++;
            }
            if (this.index)
                for (peekIndex = this.index; peekIndex < this.text.length; ) {
                    if (((ch = this.text.charAt(peekIndex)), "(" === ch)) {
                        (methodName = ident.substr(this.index - start + 1)),
                        (ident = ident.substr(0, this.index - start)),
                        (this.index = peekIndex);
                        break;
                    }
                    if (this.isWhitespace(ch)) peekIndex++;
                    else break;
                }
            var token = {
                index: start,
                text: ident,
            };
            if (OPERATORS.hasOwnProperty(ident))
                (token.fn = OPERATORS[ident]), (token.json = OPERATORS[ident]);
            else {
                var getter1 = getterFn(ident, this.options, this.text);
                token.fn = extend(
                    function (self, locals) {
                        return getter1(self, locals);
                    },
                    {
                        assign: function (self, value) {
                            return setter(self, ident, value, parser.text, parser.options);
                        },
                    },
                );
            }
            this.tokens.push(token),
            methodName &&
          (this.tokens.push({
              index: this.index,
              text: ".",
              json: !1,
          }),
          this.tokens.push({
              index: this.index + 1,
              text: methodName,
              json: !1,
          }));
        },
        readString: function (quote) {
            var start = this.index;
            this.index++;
            for (
                var string = "", rawString = quote, escape = !1;
                this.index < this.text.length;

            ) {
                var ch = this.text.charAt(this.index);
                if (((rawString += ch), escape)) {
                    if ("u" === ch) {
                        var hex = this.text.substring(this.index + 1, this.index + 5);
                        hex.match(/[\da-f]{4}/i) ||
              this.throwError("Invalid unicode escape [\\u" + hex + "]"),
                        (this.index += 4),
                        (string += String.fromCharCode(parseInt(hex, 16)));
                    } else {
                        var rep = {
                            n: "\n",
                            f: "\f",
                            r: "\r",
                            t: "\t",
                            v: "\v",
                            "'": "'",
                            '"': '"',
                        }[ch];
                        if (rep) string += rep;
                        else string += ch;
                    }
                    escape = !1;
                } else if ("\\" === ch) escape = !0;
                else if (ch === quote)
                    return (
                        this.index++,
                        this.tokens.push({
                            index: start,
                            text: rawString,
                            string: string,
                            json: !0,
                            fn: function () {
                                return string;
                            },
                        }),
                        void 0
                    );
                else string += ch;
                this.index++;
            }
            this.throwError("Unterminated quote", start);
        },
    };
    var Parser = function (lexer, $filter, options) {
        (this.lexer = lexer), (this.$filter = $filter), (this.options = options);
    };
    (Parser.ZERO = function () {
        return 0;
    }),
    (Parser.prototype = {
        constructor: Parser,
        parse: function (text, json) {
            (this.text = text),
            (this.json = json),
            (this.tokens = this.lexer.lex(text)),
            json &&
            ((this.assignment = this.logicalOR),
            (this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function () {
                this.throwError("is not valid json", {
                    text: text,
                    index: 0,
                });
            }));
            var value = json ? this.primary() : this.statements();
            return (
                this.tokens.length !== 0 &&
            this.throwError("is an unexpected token", this.tokens[0]),
                (value.literal = !!value.literal),
                (value.constant = !!value.constant),
                value
            );
        },
        primary: function () {
            var primary;
            if (this.expect("(")) (primary = this.filterChain()), this.consume(")");
            else if (this.expect("[")) primary = this.arrayDeclaration();
            else if (this.expect("{")) primary = this.object();
            else {
                var token = this.expect();
                (primary = token.fn),
                primary || this.throwError("not a primary expression", token),
                token.json && ((primary.constant = !0), (primary.literal = !0));
            }
            for (var next, context; (next = this.expect("(", "[", ".")); )
                if ("(" === next.text)
                    (primary = this.functionCall(primary, context)), (context = null);
                else if ("[" === next.text)
                    (context = primary), (primary = this.objectIndex(primary));
                else if ("." === next.text)
                    (context = primary), (primary = this.fieldAccess(primary));
                else this.throwError("IMPOSSIBLE");
            return primary;
        },
        throwError: function (msg, token) {
            throw $parseMinErr(
                "syntax",
                "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].",
                token.text,
                msg,
                token.index + 1,
                this.text,
                this.text.substring(token.index),
            );
        },
        peekToken: function () {
            if (this.tokens.length === 0)
                throw $parseMinErr(
                    "ueoe",
                    "Unexpected end of expression: {0}",
                    this.text,
                );
            return this.tokens[0];
        },
        peek: function (e1, e2, e3, e4) {
            if (this.tokens.length > 0) {
                var token = this.tokens[0],
                    t = token.text;
                if (
                    e1 === t ||
            e2 === t ||
            e3 === t ||
            e4 === t ||
            ((e1 || e2 || !e3) && !e4)
                )
                    return token;
            }
            return !1;
        },
        expect: function (e1, e2, e3, e4) {
            var token = this.peek(e1, e2, e3, e4);
            if (token)
                return (
                    this.json &&
              !token.json &&
              this.throwError("is not valid json", token),
                    this.tokens.shift(),
                    token
                );
            return !1;
        },
        consume: function (e1) {
            this.expect(e1) ||
          this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
        },
        unaryFn: function (fn, right) {
            return extend(
                function (self, locals) {
                    return fn(self, locals, right);
                },
                {
                    constant: right.constant,
                },
            );
        },
        ternaryFn: function (left, middle, right) {
            return extend(
                function (self, locals) {
                    return left(self, locals)
                        ? middle(self, locals)
                        : right(self, locals);
                },
                {
                    constant: left.constant && middle.constant && right.constant,
                },
            );
        },
        binaryFn: function (left, fn, right) {
            return extend(
                function (self, locals) {
                    return fn(self, locals, left, right);
                },
                {
                    constant: left.constant && right.constant,
                },
            );
        },
        statements: function () {
            for (var statements = []; ; )
                if (
                    (this.tokens.length > 0 &&
              !this.peek("}", ")", ";", "]") &&
              statements.push(this.filterChain()),
                    !this.expect(";"))
                )
                    return 1 === statements.length
                        ? statements[0]
                        : function (self, locals) {
                            for (var value, i = 0; i < statements.length; i++) {
                                var statement = statements[i];
                                statement && (value = statement(self, locals));
                            }
                            return value;
                        };
        },
        filterChain: function () {
            for (var left = this.expression(), token; ; )
                if ((token = this.expect("|")))
                    left = this.binaryFn(left, token.fn, this.filter());
                else return left;
        },
        filter: function () {
            for (var token = this.expect(), argsFn = []; ; )
                if ((token = this.expect(":"))) argsFn.push(this.expression());
                else {
                    var fnInvoke = function (self, locals, input) {
                        for (var args = [input], i = 0; i < argsFn.length; i++)
                            args.push(argsFn[i](self, locals));
                        return this.$filter(token.text).apply(self, args);
                    };
                    return function () {
                        return fnInvoke;
                    };
                }
        },
        expression: function () {
            return this.assignment();
        },
        assignment: function () {
            var left = this.ternary(),
                right,
                token;
            if ((token = this.expect("=")))
                return (
                    left.assign ||
              this.throwError(
                  "implies assignment but [" +
                  this.text.substring(0, token.index) +
                  "] can not be assigned to",
                  token,
              ),
                    (right = this.ternary()),
                    function (scope, locals) {
                        return left.assign(scope, right(scope, locals), locals);
                    }
                );
            return left;
        },
        ternary: function () {
            var left = this.logicalOR(),
                middle,
                token;
            if ((token = this.expect("?"))) {
                if (((middle = this.ternary()), (token = this.expect(":"))))
                    return this.ternaryFn(left, middle, this.ternary());
                this.throwError("expected :", token);
            } else return left;
        },
        logicalOR: function () {
            for (var left = this.logicalAND(), token; ; )
                if ((token = this.expect("||")))
                    left = this.binaryFn(left, token.fn, this.logicalAND());
                else return left;
        },
        logicalAND: function () {
            var left = this.equality(),
                token;
            return (
                (token = this.expect("&&")) &&
            (left = this.binaryFn(left, token.fn, this.logicalAND())),
                left
            );
        },
        equality: function () {
            var left = this.relational(),
                token;
            return (
                (token = this.expect("==", "!=", "===", "!==")) &&
            (left = this.binaryFn(left, token.fn, this.equality())),
                left
            );
        },
        relational: function () {
            var left = this.additive(),
                token;
            return (
                (token = this.expect("<", ">", "<=", ">=")) &&
            (left = this.binaryFn(left, token.fn, this.relational())),
                left
            );
        },
        additive: function () {
            for (
                var left = this.multiplicative(), token;
                (token = this.expect("+", "-"));

            )
                left = this.binaryFn(left, token.fn, this.multiplicative());
            return left;
        },
        multiplicative: function () {
            for (
                var left = this.unary(), token;
                (token = this.expect("*", "/", "%"));

            )
                left = this.binaryFn(left, token.fn, this.unary());
            return left;
        },
        unary: function () {
            var token;
            if (this.expect("+")) return this.primary();
            if ((token = this.expect("-")))
                return this.binaryFn(Parser.ZERO, token.fn, this.unary());
            if ((token = this.expect("!")))
                return this.unaryFn(token.fn, this.unary());
            return this.primary();
        },
        fieldAccess: function (object) {
            var parser = this,
                field = this.expect().text,
                getter2 = getterFn(field, this.options, this.text);
            return extend(
                function (scope, locals, self) {
                    return getter2(self || object(scope, locals), locals);
                },
                {
                    assign: function (scope, value, locals) {
                        return setter(
                            object(scope, locals),
                            field,
                            value,
                            parser.text,
                            parser.options,
                        );
                    },
                },
            );
        },
        objectIndex: function (obj) {
            var parser = this,
                indexFn = this.expression();
            return (
                this.consume("]"),
                extend(
                    function (self, locals) {
                        var o = obj(self, locals),
                            i = indexFn(self, locals),
                            v,
                            p;
                        if (!o) return void 0;
                        return (
                            (v = ensureSafeObject(o[i], parser.text)),
                            v &&
                  v.then &&
                  parser.options.unwrapPromises &&
                  ((p = v),
                  "$$v" in v ||
                    ((p.$$v = void 0),
                    p.then(function (val) {
                        p.$$v = val;
                    })),
                  (v = v.$$v)),
                            v
                        );
                    },
                    {
                        assign: function (self, value, locals) {
                            var key = indexFn(self, locals),
                                safe = ensureSafeObject(obj(self, locals), parser.text);
                            return (safe[key] = value);
                        },
                    },
                )
            );
        },
        functionCall: function (fn, contextGetter) {
            var argsFn = [];
            if (this.peekToken().text !== ")")
                do argsFn.push(this.expression());
                while (this.expect(","));
            this.consume(")");
            var parser = this;
            return function (scope, locals) {
                for (
                    var args = [],
                        context = contextGetter ? contextGetter(scope, locals) : scope,
                        i = 0;
                    i < argsFn.length;
                    i++
                )
                    args.push(argsFn[i](scope, locals));
                var fnPtr = fn(scope, locals, context) || noop;
                ensureSafeObject(context, parser.text),
                ensureSafeObject(fnPtr, parser.text);
                var v = fnPtr.apply
                    ? fnPtr.apply(context, args)
                    : fnPtr(args[0], args[1], args[2], args[3], args[4]);
                return ensureSafeObject(v, parser.text);
            };
        },
        arrayDeclaration: function () {
            var elementFns = [],
                allConstant = !0;
            if (this.peekToken().text !== "]")
                do {
                    var elementFn = this.expression();
                    elementFns.push(elementFn),
                    elementFn.constant || (allConstant = !1);
                } while (this.expect(","));
            return (
                this.consume("]"),
                extend(
                    function (self, locals) {
                        for (var array = [], i = 0; i < elementFns.length; i++)
                            array.push(elementFns[i](self, locals));
                        return array;
                    },
                    {
                        literal: !0,
                        constant: allConstant,
                    },
                )
            );
        },
        object: function () {
            var keyValues = [],
                allConstant = !0;
            if (this.peekToken().text !== "}")
                do {
                    var token = this.expect(),
                        key = token.string || token.text;
                    this.consume(":");
                    var value = this.expression();
                    keyValues.push({
                        key: key,
                        value: value,
                    }),
                    value.constant || (allConstant = !1);
                } while (this.expect(","));
            return (
                this.consume("}"),
                extend(
                    function (self, locals) {
                        for (var object = {}, i = 0; i < keyValues.length; i++) {
                            var keyValue = keyValues[i];
                            object[keyValue.key] = keyValue.value(self, locals);
                        }
                        return object;
                    },
                    {
                        literal: !0,
                        constant: allConstant,
                    },
                )
            );
        },
    });
    function setter(obj, path, setValue, fullExp, options) {
        options ||= {};
        for (var element = path.split("."), key, i = 0; element.length > 1; i++) {
            key = ensureSafeMemberName(element.shift(), fullExp);
            var propertyObj = obj[key];
            propertyObj || ((propertyObj = {}), (obj[key] = propertyObj)),
            (obj = propertyObj),
            obj.then &&
          options.unwrapPromises &&
          (promiseWarning(fullExp),
          "$$v" in obj ||
            obj.then(function (val) {
                obj.$$v = val;
            }),
          obj.$$v === void 0 && (obj.$$v = {}),
          (obj = obj.$$v));
        }
        return (
            (key = ensureSafeMemberName(element.shift(), fullExp)),
            (obj[key] = setValue),
            setValue
        );
    }
    var getterFnCache = {};
    function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
        return (
            ensureSafeMemberName(key0, fullExp),
            ensureSafeMemberName(key1, fullExp),
            ensureSafeMemberName(key2, fullExp),
            ensureSafeMemberName(key3, fullExp),
            ensureSafeMemberName(key4, fullExp),
            !options.unwrapPromises
                ? function (scope, locals) {
                    var pathVal =
              locals && locals.hasOwnProperty(key0) ? locals : scope;
                    if (null == pathVal) return pathVal;
                    if (
                        ((pathVal = pathVal[key0]),
                        key1 && null !== pathVal && void 0 === pathVal)
                    )
                        return pathVal;
                    if (
                        ((pathVal = pathVal[key1]),
                        key2 && null !== pathVal && void 0 === pathVal)
                    )
                        return pathVal;
                    if (
                        ((pathVal = pathVal[key2]),
                        key3 && null !== pathVal && void 0 === pathVal)
                    )
                        return pathVal;
                    if (
                        ((pathVal = pathVal[key3]),
                        key4 && null !== pathVal && void 0 === pathVal)
                    )
                        return pathVal;
                    return (pathVal = pathVal[key4]);
                }
                : function (scope, locals) {
                    var pathVal =
                locals && locals.hasOwnProperty(key0) ? locals : scope,
                        promise;
                    if (null == pathVal) return pathVal;
                    if (
                        ((pathVal = pathVal[key0]),
                        pathVal &&
                pathVal.then &&
                (promiseWarning(fullExp),
                "$$v" in pathVal ||
                  ((promise = pathVal),
                  (promise.$$v = void 0),
                  promise.then(function (val) {
                      promise.$$v = val;
                  })),
                (pathVal = pathVal.$$v)),
                        key1 && null !== pathVal && void 0 === pathVal)
                    )
                        return pathVal;
                    if (
                        ((pathVal = pathVal[key1]),
                        pathVal &&
                pathVal.then &&
                (promiseWarning(fullExp),
                "$$v" in pathVal ||
                  ((promise = pathVal),
                  (promise.$$v = void 0),
                  promise.then(function (val) {
                      promise.$$v = val;
                  })),
                (pathVal = pathVal.$$v)),
                        key2 && null !== pathVal && void 0 === pathVal)
                    )
                        return pathVal;
                    if (
                        ((pathVal = pathVal[key2]),
                        pathVal &&
                pathVal.then &&
                (promiseWarning(fullExp),
                "$$v" in pathVal ||
                  ((promise = pathVal),
                  (promise.$$v = void 0),
                  promise.then(function (val) {
                      promise.$$v = val;
                  })),
                (pathVal = pathVal.$$v)),
                        key3 && null !== pathVal && void 0 === pathVal)
                    )
                        return pathVal;
                    if (
                        ((pathVal = pathVal[key3]),
                        pathVal &&
                pathVal.then &&
                (promiseWarning(fullExp),
                "$$v" in pathVal ||
                  ((promise = pathVal),
                  (promise.$$v = void 0),
                  promise.then(function (val) {
                      promise.$$v = val;
                  })),
                (pathVal = pathVal.$$v)),
                        key4 && null !== pathVal && void 0 === pathVal)
                    )
                        return pathVal;
                    return (
                        (pathVal = pathVal[key4]),
                        pathVal &&
                pathVal.then &&
                (promiseWarning(fullExp),
                "$$v" in pathVal ||
                  ((promise = pathVal),
                  (promise.$$v = void 0),
                  promise.then(function (val) {
                      promise.$$v = val;
                  })),
                (pathVal = pathVal.$$v)),
                        pathVal
                    );
                }
        );
    }
    function getterFn(path, options, fullExp) {
        if (getterFnCache.hasOwnProperty(path)) return getterFnCache[path];
        var pathKeys = path.split("."),
            pathKeysLength = pathKeys.length,
            fn;
        if (options.csp) {
            if (6 > pathKeysLength)
                fn = cspSafeGetterFn(
                    pathKeys[0],
                    pathKeys[1],
                    pathKeys[2],
                    pathKeys[3],
                    pathKeys[4],
                    fullExp,
                    options,
                );
            else
                fn = function (scope, locals) {
                    var i = 0,
                        val;
                    do
                        (val = cspSafeGetterFn(
                            pathKeys[i++],
                            pathKeys[i++],
                            pathKeys[i++],
                            pathKeys[i++],
                            pathKeys[i++],
                            fullExp,
                            options,
                        )(scope, locals)),
                        (locals = void 0),
                        (scope = val);
                    while (pathKeysLength > i);
                    return val;
                };
        } else {
            var code = "var l, fn, p;\n";
            forEach(pathKeys, function (key, index) {
                ensureSafeMemberName(key, fullExp),
                (code +=
            "if(s === null || s === undefined) return s;\nl=s;\ns=" +
            (index ? "s" : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') +
            '["' +
            key +
            '"];\n' +
            (options.unwrapPromises
                ? 'if (s && s.then) {\n pw("' +
                fullExp.replace(/(["\r\n])/g, "\\$1") +
                '");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n'
                : ""));
            }),
            (code += "return s;");
            var evaledFnGetter = new Function("s", "k", "pw", code);
            (evaledFnGetter.toString = function () {
                return code;
            }),
            (fn = function (scope, locals) {
                return evaledFnGetter(scope, locals, promiseWarning);
            });
        }
        return "hasOwnProperty" !== path && (getterFnCache[path] = fn), fn;
    }
    function $ParseProvider() {
        var cache = {},
            $parseOptions = {
                csp: !1,
                unwrapPromises: !1,
                logPromiseWarnings: !0,
            };
        (this.unwrapPromises = function (value) {
            if (isDefined(value))
                return ($parseOptions.unwrapPromises = !!value), this;
            return $parseOptions.unwrapPromises;
        }),
        (this.logPromiseWarnings = function (value) {
            if (isDefined(value))
                return ($parseOptions.logPromiseWarnings = value), this;
            return $parseOptions.logPromiseWarnings;
        }),
        (this.$get = [
            "$filter",
            "$sniffer",
            "$log",
            function ($filter, $sniffer, $log) {
                return (
                    ($parseOptions.csp = $sniffer.csp),
                    (promiseWarning = function (fullExp) {
                        if (
                            !$parseOptions.logPromiseWarnings ||
                promiseWarningCache.hasOwnProperty(fullExp)
                        )
                            return;
                        (promiseWarningCache[fullExp] = !0),
                        $log.warn(
                            "[$parse] Promise found in the expression `" +
                    fullExp +
                    "`. Automatic unwrapping of promises in Angular expressions is deprecated.",
                        );
                    }),
                    function (exp) {
                        var parsedExpression;
                        switch (typeof exp) {
                        case "string":
                            if (cache.hasOwnProperty(exp)) return cache[exp];
                            return (
                                (parsedExpression = new Parser(
                                    lexer,
                                    $filter,
                                    $parseOptions,
                                ).parse(exp, !1)),
                                "hasOwnProperty" !== exp && (cache[exp] = parsedExpression),
                                parsedExpression
                            );
                        case "function":
                            return exp;
                        default:
                            return noop;
                        }
                    }
                );
            },
        ]);
    }
    function $QProvider() {
        this.$get = [
            "$rootScope",
            "$exceptionHandler",
            function ($rootScope, $exceptionHandler) {
                return qFactory(function (callback) {
                    $rootScope.$evalAsync(callback);
                }, $exceptionHandler);
            },
        ];
    }
    function qFactory(nextTick, exceptionHandler) {
        var defer = function () {
                var pending = [],
                    value,
                    deferred;
                return (deferred = {
                    resolve: function (val) {
                        if (pending) {
                            var callbacks = pending;
                            (pending = void 0),
                            (value = ref(val)),
                            callbacks.length &&
                  nextTick(function () {
                      for (
                          var callback, i = 0, ii = callbacks.length;
                          ii > i;
                          i++
                      )
                          (callback = callbacks[i]),
                          value.then(callback[0], callback[1], callback[2]);
                  });
                        }
                    },
                    reject: function (reason) {
                        deferred.resolve(reject(reason));
                    },
                    notify: function (progress) {
                        if (pending) {
                            var callbacks = pending;
                            pending.length &&
                nextTick(function () {
                    for (var callback, i = 0, ii = callbacks.length; ii > i; i++)
                        (callback = callbacks[i]), callback[2](progress);
                });
                        }
                    },
                    promise: {
                        then: function (callback, errback, progressback) {
                            var result = defer(),
                                wrappedCallback = function (value1) {
                                    try {
                                        result.resolve(
                                            (isFunction(callback) ? callback : defaultCallback)(
                                                value1,
                                            ),
                                        );
                                    } catch (e) {
                                        result.reject(e), exceptionHandler(e);
                                    }
                                },
                                wrappedErrback = function (reason) {
                                    try {
                                        result.resolve(
                                            (isFunction(errback) ? errback : defaultErrback)(reason),
                                        );
                                    } catch (e) {
                                        result.reject(e), exceptionHandler(e);
                                    }
                                },
                                wrappedProgressback = function (progress) {
                                    try {
                                        result.notify(
                                            (isFunction(progressback)
                                                ? progressback
                                                : defaultCallback)(progress),
                                        );
                                    } catch (e) {
                                        exceptionHandler(e);
                                    }
                                };
                            if (pending)
                                pending.push([
                                    wrappedCallback,
                                    wrappedErrback,
                                    wrappedProgressback,
                                ]);
                            else
                                value.then(
                                    wrappedCallback,
                                    wrappedErrback,
                                    wrappedProgressback,
                                );
                            return result.promise;
                        },
                        catch: function (callback) {
                            return this.then(null, callback);
                        },
                        finally: function (callback) {
                            function makePromise(value1, resolved) {
                                var result = defer();
                                if (resolved) result.resolve(value1);
                                else result.reject(value1);
                                return result.promise;
                            }
                            function handleCallback(value1, isResolved) {
                                var callbackOutput = null;
                                try {
                                    callbackOutput = (callback || defaultCallback)();
                                } catch (e) {
                                    return makePromise(e, !1);
                                }
                                if (callbackOutput && isFunction(callbackOutput.then))
                                    return callbackOutput.then(
                                        function () {
                                            return makePromise(value1, isResolved);
                                        },
                                        function (error) {
                                            return makePromise(error, !1);
                                        },
                                    );
                                return makePromise(value1, isResolved);
                            }
                            return this.then(
                                function (value1) {
                                    return handleCallback(value1, !0);
                                },
                                function (error) {
                                    return handleCallback(error, !1);
                                },
                            );
                        },
                    },
                });
            },
            ref = function (value) {
                if (value && isFunction(value.then)) return value;
                return {
                    then: function (callback) {
                        var result = defer();
                        return (
                            nextTick(function () {
                                result.resolve(callback(value));
                            }),
                            result.promise
                        );
                    },
                };
            },
            reject = function (reason) {
                return {
                    then: function (callback, errback) {
                        var result = defer();
                        return (
                            nextTick(function () {
                                try {
                                    result.resolve(
                                        (isFunction(errback) ? errback : defaultErrback)(reason),
                                    );
                                } catch (e) {
                                    result.reject(e), exceptionHandler(e);
                                }
                            }),
                            result.promise
                        );
                    },
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
            when: function (value, callback, errback, progressback) {
                var result = defer(),
                    done,
                    wrappedErrback = function (reason) {
                        try {
                            return (isFunction(errback) ? errback : defaultErrback)(reason);
                        } catch (e) {
                            return exceptionHandler(e), reject(e);
                        }
                    },
                    wrappedProgressback = function (progress) {
                        try {
                            return (isFunction(progressback)
                                ? progressback
                                : defaultCallback)(progress);
                        } catch (e) {
                            exceptionHandler(e);
                        }
                    };
                return (
                    nextTick(function () {
                        ref(value).then(
                            function (value1) {
                                if (done) return;
                                (done = !0),
                                result.resolve(
                                    ref(value1).then(
                                        function (value1) {
                                            try {
                                                return (isFunction(callback)
                                                    ? callback
                                                    : defaultCallback)(value1);
                                            } catch (e) {
                                                return exceptionHandler(e), reject(e);
                                            }
                                        },
                                        wrappedErrback,
                                        wrappedProgressback,
                                    ),
                                );
                            },
                            function (reason) {
                                if (done) return;
                                (done = !0), result.resolve(wrappedErrback(reason));
                            },
                            function (progress) {
                                if (done) return;
                                result.notify(wrappedProgressback(progress));
                            },
                        );
                    }),
                    result.promise
                );
            },
            all: function (promises) {
                var deferred = defer(),
                    counter = 0,
                    results = isArray(promises) ? [] : {};
                return (
                    forEach(promises, function (promise, key) {
                        counter++,
                        ref(promise).then(
                            function (value) {
                                if (results.hasOwnProperty(key)) return;
                                (results[key] = value),
                                --counter || deferred.resolve(results);
                            },
                            function (reason) {
                                if (results.hasOwnProperty(key)) return;
                                deferred.reject(reason);
                            },
                        );
                    }),
                    0 === counter && deferred.resolve(results),
                    deferred.promise
                );
            },
        };
    }
    function $RootScopeProvider() {
        var TTL = 10,
            $rootScopeMinErr = minErr("$rootScope"),
            lastDirtyWatch = null;
        (this.digestTtl = function (value) {
            return arguments.length && (TTL = value), TTL;
        }),
        (this.$get = [
            "$injector",
            "$exceptionHandler",
            "$parse",
            "$browser",
            function ($injector, $exceptionHandler, $parse, $browser) {
                function Scope() {
                    (this.$id = nextUid()),
                    (this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null),
                    (this.this = this.$root = this),
                    (this.$$destroyed = !1),
                    (this.$$asyncQueue = []),
                    (this.$$postDigestQueue = []),
                    (this.$$listeners = {}),
                    (this.$$isolateBindings = {});
                }
                Scope.prototype = {
                    constructor: Scope,
                    $new: function (isolate) {
                        var ChildScope, child;
                        if (isolate)
                            (child = new Scope()),
                            (child.$root = this.$root),
                            (child.$$asyncQueue = this.$$asyncQueue),
                            (child.$$postDigestQueue = this.$$postDigestQueue);
                        else
                            (ChildScope = function () {}),
                            (ChildScope.prototype = this),
                            (child = new ChildScope()),
                            (child.$id = nextUid());
                        if (
                            ((child.this = child),
                            (child.$$listeners = {}),
                            (child.$parent = this),
                            (child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null),
                            (child.$$prevSibling = this.$$childTail),
                            this.$$childHead)
                        )
                            (this.$$childTail.$$nextSibling = child),
                            (this.$$childTail = child);
                        else this.$$childHead = this.$$childTail = child;
                        return child;
                    },
                    $watch: function (watchExp, listener, objectEquality) {
                        var scope = this,
                            get = compileToFn(watchExp, "watch"),
                            array = scope.$$watchers,
                            watcher = {
                                fn: listener,
                                last: initWatchVal,
                                get: get,
                                exp: watchExp,
                                eq: !!objectEquality,
                            };
                        return (
                            (lastDirtyWatch = null),
                            isFunction(listener) ||
                  (watcher.fn = function (newVal, oldVal, scope) {
                      compileToFn(listener || noop, "listener")(scope);
                  }),
                            "string" == typeof watchExp &&
                  get.constant &&
                  (watcher.fn = function (newVal, oldVal, scope) {
                      watcher.fn.call(this, newVal, oldVal, scope),
                      arrayRemove(array, watcher);
                  }),
                            array || (array = scope.$$watchers = []),
                            array.unshift(watcher),
                            function () {
                                arrayRemove(array, watcher);
                            }
                        );
                    },
                    $watchCollection: function (obj, listener) {
                        var self = this,
                            oldValue,
                            newValue,
                            changeDetected = 0,
                            objGetter = $parse(obj),
                            internalArray = [],
                            internalObject = {},
                            oldLength = 0;
                        return this.$watch(
                            function () {
                                newValue = objGetter(self);
                                var newLength, key;
                                if (!isObject(newValue))
                                    newValue !== oldValue &&
                      ((oldValue = newValue), changeDetected++);
                                else if (isArrayLike(newValue)) {
                                    internalArray !== oldValue &&
                      ((oldValue = internalArray),
                      (oldLength = oldValue.length = 0),
                      changeDetected++),
                                    (newLength = newValue.length),
                                    newLength !== oldLength &&
                        (changeDetected++,
                        (oldValue.length = oldLength = newLength));
                                    for (var i = 0; newLength > i; i++)
                                        oldValue[i] !== newValue[i] &&
                        (changeDetected++, (oldValue[i] = newValue[i]));
                                } else {
                                    internalObject !== oldValue &&
                      ((oldValue = internalObject = {}),
                      (oldLength = 0),
                      changeDetected++),
                                    (newLength = 0);
                                    for (key in newValue)
                                        if (newValue.hasOwnProperty(key)) {
                                            if ((newLength++, oldValue.hasOwnProperty(key)))
                                                oldValue[key] !== newValue[key] &&
                            (changeDetected++, (oldValue[key] = newValue[key]));
                                            else
                                                oldLength++,
                                                (oldValue[key] = newValue[key]),
                                                changeDetected++;
                                        }
                                    if (oldLength > newLength) {
                                        changeDetected++;
                                        for (key in oldValue)
                                            oldValue.hasOwnProperty(key) &&
                          !newValue.hasOwnProperty(key) &&
                          (oldLength--, delete oldValue[key]);
                                    }
                                }
                                return changeDetected;
                            },
                            function () {
                                listener(newValue, oldValue, self);
                            },
                        );
                    },
                    $digest: function () {
                        var watch,
                            value,
                            last,
                            asyncQueue = this.$$asyncQueue,
                            postDigestQueue = this.$$postDigestQueue,
                            length,
                            dirty,
                            ttl = TTL,
                            next,
                            current,
                            target = this,
                            watchLog = [],
                            logIdx,
                            logMsg,
                            asyncTask;
                        beginPhase("$digest"), (lastDirtyWatch = null);
                        do {
                            for (dirty = !1, current = target; asyncQueue.length; ) {
                                try {
                                    (asyncTask = asyncQueue.shift()),
                                    asyncTask.scope.$eval(asyncTask.expression);
                                } catch (e) {
                                    clearPhase(), $exceptionHandler(e);
                                }
                                lastDirtyWatch = null;
                            }
                            traverseScopesLoop: do {
                                if (current.$$watchers)
                                    for (length = current.$$watchers.length; length--; )
                                        try {
                                            if ((watch = current.$$watchers[length])) {
                                                if (
                                                    (value = watch.get(current)) !==
                              (last = watch.last) &&
                            !(watch.eq
                                ? equals(value, last)
                                : "number" == typeof value &&
                                "number" == typeof last &&
                                isNaN(value) &&
                                isNaN(last))
                                                )
                                                    (dirty = !0),
                                                    (lastDirtyWatch = watch),
                                                    (watch.last = watch.eq ? copy(value) : value),
                                                    watch.fn(
                                                        value,
                                                        initWatchVal === last ? value : last,
                                                        current,
                                                    ),
                                                    5 > ttl &&
                                ((logIdx = 4 - ttl),
                                watchLog[logIdx] || (watchLog[logIdx] = []),
                                (logMsg = isFunction(watch.exp)
                                    ? "fn: " +
                                    (watch.exp.name || watch.exp.toString())
                                    : watch.exp),
                                (logMsg +=
                                  "; newVal: " +
                                  toJson(value) +
                                  "; oldVal: " +
                                  toJson(last)),
                                watchLog[logIdx].push(logMsg));
                                                else if (lastDirtyWatch === watch) {
                                                    dirty = !1;
                                                    break traverseScopesLoop;
                                                }
                                            }
                                        } catch (e) {
                                            clearPhase(), $exceptionHandler(e);
                                        }
                                if (
                                    !(next =
                      current.$$childHead ||
                      (current !== target && current.$$nextSibling))
                                )
                                    for (
                                        ;
                                        current !== target && !(next = current.$$nextSibling);

                                    )
                                        current = current.$parent;
                            } while ((current = next));
                            if (dirty && !ttl--)
                                throw (
                                    (clearPhase(),
                                    $rootScopeMinErr(
                                        "infdig",
                                        "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}",
                                        TTL,
                                        toJson(watchLog),
                                    ))
                                );
                        } while (dirty || asyncQueue.length);
                        for (clearPhase(); postDigestQueue.length; )
                            try {
                                postDigestQueue.shift()();
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                    },
                    $destroy: function () {
                        if (this.$$destroyed) return;
                        var parent = this.$parent;
                        if (
                            (this.$broadcast("$destroy"),
                            (this.$$destroyed = !0),
                            this === $rootScope)
                        )
                            return;
                        parent.$$childHead == this &&
                (parent.$$childHead = this.$$nextSibling),
                        parent.$$childTail == this &&
                  (parent.$$childTail = this.$$prevSibling),
                        this.$$prevSibling &&
                  (this.$$prevSibling.$$nextSibling = this.$$nextSibling),
                        this.$$nextSibling &&
                  (this.$$nextSibling.$$prevSibling = this.$$prevSibling),
                        (this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null);
                    },
                    $eval: function (expr, locals) {
                        return $parse(expr)(this, locals);
                    },
                    $evalAsync: function (expr) {
                        $rootScope.$$phase ||
                $rootScope.$$asyncQueue.length ||
                $browser.defer(function () {
                    $rootScope.$$asyncQueue.length && $rootScope.$digest();
                }),
                        this.$$asyncQueue.push({
                            scope: this,
                            expression: expr,
                        });
                    },
                    $$postDigest: function (fn) {
                        this.$$postDigestQueue.push(fn);
                    },
                    $apply: function (expr) {
                        try {
                            return beginPhase("$apply"), this.$eval(expr);
                        } catch (e) {
                            $exceptionHandler(e);
                        } finally {
                            clearPhase();
                            try {
                                $rootScope.$digest();
                            } catch (e) {
                                throw ($exceptionHandler(e), e);
                            }
                        }
                    },
                    $on: function (name, listener) {
                        var namedListeners = this.$$listeners[name];
                        return (
                            namedListeners ||
                  (this.$$listeners[name] = namedListeners = []),
                            namedListeners.push(listener),
                            function () {
                                namedListeners[indexOf(namedListeners, listener)] = null;
                            }
                        );
                    },
                    $emit: function (name, args) {
                        var namedListeners,
                            scope = this,
                            stopPropagation = !1,
                            event = {
                                name: name,
                                targetScope: scope,
                                stopPropagation: function () {
                                    stopPropagation = !0;
                                },
                                preventDefault: function () {
                                    event.defaultPrevented = !0;
                                },
                                defaultPrevented: !1,
                            },
                            listenerArgs = concat([event], arguments, 1),
                            i,
                            length;
                        do {
                            for (
                                namedListeners = scope.$$listeners[name] || [],
                                event.currentScope = scope,
                                i = 0,
                                length = namedListeners.length;
                                length > i;
                                i++
                            ) {
                                if (!namedListeners[i]) {
                                    namedListeners.splice(i, 1), i--, length--;
                                    continue;
                                }
                                try {
                                    namedListeners[i].apply(null, listenerArgs);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                            }
                            if (stopPropagation) return event;
                            scope = scope.$parent;
                        } while (scope);
                        return event;
                    },
                    $broadcast: function (name, args) {
                        var target = this,
                            current = target,
                            next = target,
                            event = {
                                name: name,
                                targetScope: target,
                                preventDefault: function () {
                                    event.defaultPrevented = !0;
                                },
                                defaultPrevented: !1,
                            },
                            listenerArgs = concat([event], arguments, 1),
                            listeners,
                            i,
                            length;
                        do {
                            for (
                                current = next,
                                event.currentScope = current,
                                listeners = current.$$listeners[name] || [],
                                i = 0,
                                length = listeners.length;
                                length > i;
                                i++
                            ) {
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
                            if (
                                !(next =
                    current.$$childHead ||
                    (current !== target && current.$$nextSibling))
                            )
                                for (
                                    ;
                                    current !== target && !(next = current.$$nextSibling);

                                )
                                    current = current.$parent;
                        } while ((current = next));
                        return event;
                    },
                };
                var $rootScope = new Scope();
                return $rootScope;
                function beginPhase(phase) {
                    if ($rootScope.$$phase)
                        throw $rootScopeMinErr(
                            "inprog",
                            "{0} already in progress",
                            $rootScope.$$phase,
                        );
                    $rootScope.$$phase = phase;
                }
                function clearPhase() {
                    $rootScope.$$phase = null;
                }
                function compileToFn(exp, name) {
                    var fn = $parse(exp);
                    return assertArgFn(fn, name), fn;
                }
                function initWatchVal() {}
            },
        ]);
    }
    function $$SanitizeUriProvider() {
        var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
            imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;
        (this.aHrefSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp)) return (aHrefSanitizationWhitelist = regexp), this;
            return aHrefSanitizationWhitelist;
        }),
        (this.imgSrcSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp))
                return (imgSrcSanitizationWhitelist = regexp), this;
            return imgSrcSanitizationWhitelist;
        }),
        (this.$get = function () {
            return function (uri, isImage) {
                if (!msie || msie >= 8) {
                    if (
                        (urlResolve(uri).href,
                        urlResolve(uri).href !== "" &&
                !urlResolve(uri).href.match(
                    isImage
                        ? imgSrcSanitizationWhitelist
                        : aHrefSanitizationWhitelist,
                ))
                    )
                        return "unsafe:" + urlResolve(uri).href;
                }
                return uri;
            };
        });
    }
    var $sceMinErr = minErr("$sce"),
        SCE_CONTEXTS = {
            HTML: "html",
            CSS: "css",
            URL: "url",
            RESOURCE_URL: "resourceUrl",
            JS: "js",
        };
    function escapeForRegexp(s) {
        return s
            .replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1")
            .replace(/\x08/g, "\\x08");
    }
    function adjustMatcher(matcher) {
        if ("self" === matcher) return matcher;
        if (isString(matcher)) {
            if (matcher.indexOf("***") > -1)
                throw $sceMinErr(
                    "iwcard",
                    "Illegal sequence *** in string matcher.  String: {0}",
                    matcher,
                );
            return (
                (matcher = escapeForRegexp(matcher)
                    .replace("\\*\\*", ".*")
                    .replace("\\*", "[^:/.?&;]*")),
                new RegExp("^" + matcher + "$")
            );
        } else if (isRegExp(matcher)) return new RegExp("^" + matcher.source + "$");
        else
            throw $sceMinErr(
                "imatcher",
                'Matchers may only be "self", string patterns or RegExp objects',
            );
    }
    function adjustMatchers(matchers) {
        var adjustedMatchers = [];
        return (
            isDefined(matchers) &&
        forEach(matchers, function (matcher) {
            adjustedMatchers.push(adjustMatcher(matcher));
        }),
            adjustedMatchers
        );
    }
    function $SceDelegateProvider() {
        this.SCE_CONTEXTS = SCE_CONTEXTS;
        var resourceUrlWhitelist = ["self"],
            resourceUrlBlacklist = [];
        (this.resourceUrlWhitelist = function (value) {
            return (
                arguments.length && (resourceUrlWhitelist = adjustMatchers(value)),
                resourceUrlWhitelist
            );
        }),
        (this.resourceUrlBlacklist = function (value) {
            return (
                arguments.length && (resourceUrlBlacklist = adjustMatchers(value)),
                resourceUrlBlacklist
            );
        }),
        (this.$get = [
            "$injector",
            function ($injector) {
                var htmlSanitizer = function (html) {
                    throw $sceMinErr(
                        "unsafe",
                        "Attempting to use an unsafe value in a safe context.",
                    );
                };
                $injector.has("$sanitize") &&
            (htmlSanitizer = $injector.get("$sanitize"));
                function matchUrl(matcher, parsedUrl) {
                    if ("self" === matcher) return urlIsSameOrigin(parsedUrl);
                    return !!matcher.exec(parsedUrl.href);
                }
                function isResourceUrlAllowedByPolicy(url) {
                    var parsedUrl = urlResolve(url.toString()),
                        i,
                        n,
                        allowed = !1;
                    for (i = 0, n = resourceUrlWhitelist.length; n > i; i++)
                        if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                            allowed = !0;
                            break;
                        }
                    if (allowed)
                        for (i = 0, n = resourceUrlBlacklist.length; n > i; i++)
                            if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                                allowed = !1;
                                break;
                            }
                    return allowed;
                }
                function generateHolderType(Base) {
                    var holderType = function (trustedValue) {
                        this.$$unwrapTrustedValue = function () {
                            return trustedValue;
                        };
                    };
                    return (
                        Base && (holderType.prototype = new Base()),
                        (holderType.prototype.valueOf = function () {
                            return this.$$unwrapTrustedValue();
                        }),
                        (holderType.prototype.toString = function () {
                            return this.$$unwrapTrustedValue().toString();
                        }),
                        holderType
                    );
                }
                var trustedValueHolderBase = generateHolderType(),
                    byType = {};
                return (
                    (byType[SCE_CONTEXTS.HTML] = generateHolderType(
                        trustedValueHolderBase,
                    )),
                    (byType[SCE_CONTEXTS.CSS] = generateHolderType(
                        trustedValueHolderBase,
                    )),
                    (byType[SCE_CONTEXTS.URL] = generateHolderType(
                        trustedValueHolderBase,
                    )),
                    (byType[SCE_CONTEXTS.JS] = generateHolderType(
                        trustedValueHolderBase,
                    )),
                    (byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(
                        byType[SCE_CONTEXTS.URL],
                    )),
                    {
                        trustAs: function (type, trustedValue) {
                            var Constructor = byType.hasOwnProperty(type)
                                ? byType[type]
                                : null;
                            if (!Constructor)
                                throw $sceMinErr(
                                    "icontext",
                                    "Attempted to trust a value in invalid context. Context: {0}; Value: {1}",
                                    type,
                                    trustedValue,
                                );
                            if (null == trustedValue || "" === trustedValue)
                                return trustedValue;
                            if ("string" !== typeof trustedValue)
                                throw $sceMinErr(
                                    "itype",
                                    "Attempted to trust a non-string value in a content requiring a string: Context: {0}",
                                    type,
                                );
                            return new Constructor(trustedValue);
                        },
                        getTrusted: function (type, maybeTrusted) {
                            if (null == maybeTrusted || "" === maybeTrusted)
                                return maybeTrusted;
                            var constructor = byType.hasOwnProperty(type)
                                ? byType[type]
                                : null;
                            if (constructor && maybeTrusted instanceof constructor)
                                return maybeTrusted.$$unwrapTrustedValue();
                            if (type === SCE_CONTEXTS.RESOURCE_URL) {
                                if (isResourceUrlAllowedByPolicy(maybeTrusted))
                                    return maybeTrusted;
                                throw $sceMinErr(
                                    "insecurl",
                                    "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}",
                                    maybeTrusted.toString(),
                                );
                            } else if (type === SCE_CONTEXTS.HTML)
                                return htmlSanitizer(maybeTrusted);
                            throw $sceMinErr(
                                "unsafe",
                                "Attempting to use an unsafe value in a safe context.",
                            );
                        },
                        valueOf: function (maybeTrusted) {
                            if (maybeTrusted instanceof trustedValueHolderBase)
                                return maybeTrusted.$$unwrapTrustedValue();
                            return maybeTrusted;
                        },
                    }
                );
            },
        ]);
    }
    function $SceProvider() {
        var enabled = !0;
        (this.enabled = function (value) {
            return arguments.length && (enabled = !!value), enabled;
        }),
        (this.$get = [
            "$parse",
            "$sniffer",
            "$sceDelegate",
            function ($parse, $sniffer, $sceDelegate) {
                if (enabled && $sniffer.msie && 8 > $sniffer.msieDocumentMode)
                    throw $sceMinErr(
                        "iequirks",
                        "Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.",
                    );
                var sce = copy(SCE_CONTEXTS);
                (sce.isEnabled = function () {
                    return enabled;
                }),
                (sce.trustAs = $sceDelegate.trustAs),
                (sce.getTrusted = $sceDelegate.getTrusted),
                (sce.valueOf = $sceDelegate.valueOf),
                enabled ||
              ((sce.trustAs = sce.getTrusted = function (type, value) {
                  return value;
              }),
              (sce.valueOf = identity)),
                (sce.parseAs = function (type, expr) {
                    var parsed = $parse(expr);
                    if (parsed.literal && parsed.constant) return parsed;
                    return function (self, locals) {
                        return sce.getTrusted(type, parsed(self, locals));
                    };
                });
                var parse = sce.parseAs,
                    getTrusted = sce.getTrusted,
                    trustAs = sce.trustAs;
                return (
                    forEach(SCE_CONTEXTS, function (enumValue, name) {
                        var lName = lowercase(name);
                        (sce[camelCase("parse_as_" + lName)] = function (expr) {
                            return parse(enumValue, expr);
                        }),
                        (sce[camelCase("get_trusted_" + lName)] = function (value) {
                            return getTrusted(enumValue, value);
                        }),
                        (sce[camelCase("trust_as_" + lName)] = function (value) {
                            return trustAs(enumValue, value);
                        });
                    }),
                    sce
                );
            },
        ]);
    }
    function $SnifferProvider() {
        this.$get = [
            "$window",
            "$document",
            function ($window, $document) {
                var eventSupport = {},
                    android = int(
                        (/android (\d+)/.exec(
                            lowercase(($window.navigator || {}).userAgent),
                        ) || [])[1],
                    ),
                    boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
                    document1 = $document[0] || {},
                    documentMode = document1.documentMode,
                    vendorPrefix,
                    bodyStyle = document1.body && document1.body.style,
                    transitions = !1,
                    animations = !1,
                    match;
                if (bodyStyle) {
                    for (var prop in bodyStyle)
                        if ((match = /^(Moz|webkit|O|ms)(?=[A-Z])/.exec(prop))) {
                            (vendorPrefix = match[0]),
                            (vendorPrefix =
                  vendorPrefix.substr(0, 1).toUpperCase() +
                  vendorPrefix.substr(1));
                            break;
                        }
                    vendorPrefix ||
            (vendorPrefix = "WebkitOpacity" in bodyStyle && "webkit"),
                    (transitions = !!(
                        "transition" in bodyStyle ||
              vendorPrefix + "Transition" in bodyStyle
                    )),
                    (animations = !!(
                        "animation" in bodyStyle ||
              vendorPrefix + "Animation" in bodyStyle
                    )),
                    android &&
              (!transitions || !animations) &&
              ((transitions = isString(document1.body.style.webkitTransition)),
              (animations = isString(document1.body.style.webkitAnimation)));
                }
                return {
                    history:
            $window.history &&
            $window.history.pushState &&
            !(4 > android) &&
            !boxee,
                    hashchange:
            "onhashchange" in $window && (!documentMode || documentMode > 7),
                    hasEvent: function (event) {
                        if ("input" == event && 9 == msie) return !1;
                        return (
                            isUndefined(eventSupport[event]) &&
                (eventSupport[event] =
                  "on" + event in document1.createElement("div")),
                            eventSupport[event]
                        );
                    },
                    csp: csp(),
                    vendorPrefix: vendorPrefix,
                    transitions: transitions,
                    animations: animations,
                    msie: msie,
                    msieDocumentMode: documentMode,
                };
            },
        ];
    }
    function $TimeoutProvider() {
        this.$get = [
            "$rootScope",
            "$browser",
            "$q",
            "$exceptionHandler",
            function ($rootScope, $browser, $q, $exceptionHandler) {
                var deferreds = {};
                function timeout(fn, delay, invokeApply) {
                    var deferred = $q.defer(),
                        promise = deferred.promise,
                        skipApply = isDefined(invokeApply) && !invokeApply,
                        timeoutId;
                    return (
                        (timeoutId = $browser.defer(function () {
                            try {
                                deferred.resolve(fn());
                            } catch (e) {
                                deferred.reject(e), $exceptionHandler(e);
                            } finally {
                                delete deferreds[promise.$$timeoutId];
                            }
                            skipApply || $rootScope.$apply();
                        }, delay)),
                        (promise.$$timeoutId = timeoutId),
                        (deferreds[timeoutId] = deferred),
                        promise
                    );
                }
                return (
                    (timeout.cancel = function (promise) {
                        if (promise && promise.$$timeoutId in deferreds)
                            return (
                                deferreds[promise.$$timeoutId].reject("canceled"),
                                delete deferreds[promise.$$timeoutId],
                                $browser.defer.cancel(promise.$$timeoutId)
                            );
                        return !1;
                    }),
                    timeout
                );
            },
        ];
    }
    var urlParsingNode = document.createElement("a"),
        originUrl = urlResolve(window.location.href, !0);
    function urlResolve(url, base) {
        return (
            msie &&
        (urlParsingNode.setAttribute("href", urlParsingNode.href),
        urlParsingNode.href),
            urlParsingNode.setAttribute("href", urlParsingNode.href),
            {
                href: urlParsingNode.href,
                protocol: urlParsingNode.protocol
                    ? urlParsingNode.protocol.replace(/:$/, "")
                    : "",
                host: urlParsingNode.host,
                search: urlParsingNode.search
                    ? urlParsingNode.search.replace(/^\?/, "")
                    : "",
                hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
                hostname: urlParsingNode.hostname,
                port: urlParsingNode.port,
                pathname:
          urlParsingNode.pathname.charAt(0) === "/"
              ? urlParsingNode.pathname
              : "/" + urlParsingNode.pathname,
            }
        );
    }
    function urlIsSameOrigin(requestUrl) {
        var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
        return (
            parsed.protocol === originUrl.protocol && parsed.host === originUrl.host
        );
    }
    function $WindowProvider() {
        this.$get = valueFn(window);
    }
    $FilterProvider.$inject = ["$provide"];
    function $FilterProvider($provide) {
        function register(name, factory) {
            if (isObject(name)) {
                var filters = {};
                return (
                    forEach(name, function (filter, key) {
                        filters[key] = register(key, filter);
                    }),
                    filters
                );
            } else return $provide.factory(name + "Filter", factory);
        }
        (this.register = register),
        (this.$get = [
            "$injector",
            function ($injector) {
                return function (name) {
                    return $injector.get(name + "Filter");
                };
            },
        ]),
        register("currency", currencyFilter),
        register("date", dateFilter),
        register("filter", filterFilter),
        register("json", jsonFilter),
        register("limitTo", limitToFilter),
        register("lowercase", lowercaseFilter),
        register("number", numberFilter),
        register("orderBy", orderByFilter),
        register("uppercase", uppercaseFilter);
    }
    function filterFilter() {
        return function (array, expression, comparator) {
            if (!isArray(array)) return array;
            var comparatorType = typeof comparator,
                predicates = [];
            if (
                ((predicates.check = function (value) {
                    for (var j = 0; j < predicates.length; j++)
                        if (!predicates[j](value)) return !1;
                    return !0;
                }),
                "function" !== comparatorType)
            ) {
                if ("boolean" === comparatorType && comparator)
                    comparator = function (obj, text) {
                        return angular.equals(obj, text);
                    };
                else
                    comparator = function (obj, text) {
                        return (
                            (text = ("" + text).toLowerCase()),
                            ("" + obj).toLowerCase().indexOf(text) > -1
                        );
                    };
            }
            var search = function (obj, text) {
                if ("string" == typeof text && text.charAt(0) === "!")
                    return !search(obj, text.substr(1));
                switch (typeof obj) {
                case "boolean":
                case "number":
                case "string":
                    return comparator(obj, text);
                case "object":
                    switch (typeof text) {
                    case "object":
                        return comparator(obj, text);
                    default:
                        for (var objKey in obj)
                            if (objKey.charAt(0) !== "$" && search(obj[objKey], text))
                                return !0;
                        break;
                    }
                    return !1;
                case "array":
                    for (var i = 0; i < obj.length; i++)
                        if (search(obj[i], text)) return !0;
                    return !1;
                default:
                    return !1;
                }
            };
            switch (typeof expression) {
            case "boolean":
            case "number":
            case "string":
                expression = {
                    $: expression,
                };
            case "object":
                for (var key in expression)
                    if ("$" == key)
                        !(function () {
                            if (!expression[key]) return;
                            predicates.push(function (value) {
                                return search(value, expression[key]);
                            });
                        })();
                    else
                        !(function () {
                            if ("undefined" == typeof expression[key]) return;
                            var path = key;
                            predicates.push(function (value) {
                                return search(getter(value, path), expression[path]);
                            });
                        })();
                break;
            case "function":
                predicates.push(expression);
                break;
            default:
                return array;
            }
            for (var filtered = [], j = 0; j < array.length; j++) {
                var value = array[j];
                predicates.check(value) && filtered.push(value);
            }
            return filtered;
        };
    }
    currencyFilter.$inject = ["$locale"];
    function currencyFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function (amount, currencySymbol) {
            return (
                isUndefined(formats.CURRENCY_SYM) && formats.CURRENCY_SYM,
                formatNumber(
                    amount,
                    formats.PATTERNS[1],
                    formats.GROUP_SEP,
                    formats.DECIMAL_SEP,
                    2,
                ).replace(/\u00A4/g, formats.CURRENCY_SYM)
            );
        };
    }
    numberFilter.$inject = ["$locale"];
    function numberFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function (number, fractionSize) {
            return formatNumber(
                number,
                formats.PATTERNS[0],
                formats.GROUP_SEP,
                formats.DECIMAL_SEP,
                fractionSize,
            );
        };
    }
    var DECIMAL_SEP = ".";
    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
        if (isNaN(number) || !isFinite(number)) return "";
        var isNegative = 0 > number;
        number = Math.abs(number);
        var numStr = number + "",
            formatedText = "",
            parts = [],
            hasExponent = !1;
        if (numStr.indexOf("e") !== -1) {
            var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
            if (match && match[2] == "-" && match[3] > fractionSize + 1) numStr = "0";
            else (formatedText = numStr), (hasExponent = !0);
        }
        if (!hasExponent) {
            var fractionLen = (numStr.split(DECIMAL_SEP)[1] || "").length;
            isUndefined(fractionSize) &&
        (fractionSize = Math.min(
            Math.max(pattern.minFrac, fractionLen),
            pattern.maxFrac,
        ));
            var pow = Math.pow(10, fractionSize);
            number = Math.round(number * pow) / pow;
            var fraction = ("" + number).split(DECIMAL_SEP),
                whole = fraction[0];
            fraction = fraction[1] || "";
            var i,
                pos = 0,
                lgroup = pattern.lgSize,
                group = pattern.gSize;
            if (whole.length >= lgroup + group)
                for (pos = whole.length - lgroup, i = 0; pos > i; i++)
                    (pos - i) % group == 0 && 0 !== i && (formatedText += groupSep),
                    (formatedText += whole.charAt(i));
            for (i = pos; i < whole.length; i++)
                (whole.length - i) % lgroup == 0 &&
          0 !== i &&
          (formatedText += groupSep),
                (formatedText += whole.charAt(i));
            for (; fraction.length < fractionSize; ) fraction += "0";
            fractionSize &&
        "0" !== fractionSize &&
        (formatedText += decimalSep + fraction.substr(0, fractionSize));
        } else
            fractionSize > 0 &&
        number > -1 &&
        1 > number &&
        (formatedText = number.toFixed(fractionSize));
        return (
            parts.push(isNegative ? pattern.negPre : pattern.posPre),
            parts.push(formatedText),
            parts.push(isNegative ? pattern.negSuf : pattern.posSuf),
            parts.join("")
        );
    }
    function padNumber(num, digits, trim1) {
        for (0 > num && (num = -num), num = "" + num; num.length < digits; )
            num = "0" + num;
        return trim1 && (num = num.substr(num.length - digits)), "-" + num;
    }
    function dateGetter(name, size, offset, trim1) {
        return (
            (offset ||= 0),
            function (date) {
                var value = date["get" + name]();
                return (
                    (offset > 0 || value > -offset) && (value += offset),
                    0 === value && -12 == offset && (value = 12),
                    padNumber(value, size, trim1)
                );
            }
        );
    }
    function dateStrGetter(name, shortForm) {
        return function (date, formats) {
            return formats[uppercase(shortForm ? "SHORT" + name : name)][value];
        };
    }
    dateFilter.$inject = ["$locale"];
    function dateFilter($locale) {
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        function jsonStringToDate(string) {
            var match;
            if ((match = string.match(R_ISO8601_STR))) {
                var date = new Date(0),
                    tzHour = 0,
                    tzMin = 0,
                    dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
                    timeSetter = match[8] ? date.setUTCHours : date.setHours;
                match[9] &&
          ((tzHour = int(match[9] + match[10])),
          (tzMin = int(match[9] + match[11]))),
                dateSetter.call(
                    date,
                    int(match[1]),
                    int(match[2]) - 1,
                    int(match[3]),
                );
                var h = int(match[4] || 0) - tzHour,
                    m = int(match[5] || 0) - tzMin,
                    s = int(match[6] || 0),
                    ms = Math.round(parseFloat("0." + (match[7] || 0)) * 1000);
                return timeSetter.call(date, h, m, s, ms), date;
            }
            return string;
        }
        return function (date, format) {
            var text = "",
                parts = [],
                fn,
                match;
            if (
                ((format ||= "mediumDate"),
                (format = $locale.DATETIME_FORMATS[format] || format),
                isString(date))
            ) {
                if (/^\-?\d+$/.test(date)) date = int(date);
                else date = jsonStringToDate(date);
            }
            if ((isNumber(date) && (date = new Date(date)), !isDate(date)))
                return date;
            for (; format; )
                if (
                    (match = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/.exec(
                        format,
                    ))
                )
                    (parts = concat(parts, match, 1)), (format = parts.pop());
                else parts.push(format), (format = null);
            return (
                forEach(parts, function (value) {
                    (fn = {
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
                        sss: dateGetter("Milliseconds", 3),
                        EEEE: dateStrGetter("Day"),
                        EEE: dateStrGetter("Day", !0),
                        a: function (date1, formats) {
                            return date1.getHours() < 12
                                ? formats.AMPMS[0]
                                : formats.AMPMS[1];
                        },
                        Z: function (date1) {
                            var zone = -1 * date1.getTimezoneOffset(),
                                paddedZone = zone >= 0 ? "+" : "";
                            return (
                                (paddedZone +=
                  padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) +
                  padNumber(Math.abs(zone % 60), 2)),
                                paddedZone
                            );
                        },
                    }[value]),
                    (text += fn
                        ? fn(date, $locale.DATETIME_FORMATS)
                        : value.replace(/(^'|'$)/g, "").replace(/''/g, "'"));
                }),
                text
            );
        };
    }
    function jsonFilter() {
        return function (object) {
            return toJson(object, !0);
        };
    }
    var lowercaseFilter = valueFn(lowercase),
        uppercaseFilter = valueFn(uppercase);
    function limitToFilter() {
        return function (input, limit) {
            if (!isArray(input) && !isString(input)) return input;
            if (((limit = int(limit)), isString(input))) {
                if (limit)
                    return limit >= 0
                        ? input.slice(0, limit)
                        : input.slice(limit, input.length);
                return "";
            }
            var out = [],
                i,
                n;
            if (limit > input.length) limit = input.length;
            else limit < -input.length && (limit = -input.length);
            if (limit > 0) (i = 0), (n = limit);
            else (i = input.length + limit), (n = input.length);
            for (; n > i; i++) out.push(input[i]);
            return out;
        };
    }
    orderByFilter.$inject = ["$parse"];
    function orderByFilter($parse) {
        return function (array, sortPredicate, reverseOrder) {
            if (!isArray(array)) return array;
            if (!sortPredicate) return array;
            (sortPredicate = isArray(sortPredicate)
                ? sortPredicate
                : [sortPredicate]),
            (sortPredicate = map(sortPredicate, function (predicate) {
                var descending = !1,
                    get = predicate || identity;
                return (
                    isString(predicate) &&
              ((predicate.charAt(0) == "+" || predicate.charAt(0) == "-") &&
                ((descending = predicate.charAt(0) == "-"),
                (predicate = predicate.substring(1))),
              (get = $parse(predicate))),
                    reverseComparator(function (a, b) {
                        return compare(get(a), get(b));
                    }, descending)
                );
            }));
            for (var arrayCopy = [], i = 0; i < array.length; i++)
                arrayCopy.push(array[i]);
            return arrayCopy.sort(reverseComparator(comparator, reverseOrder));
            function comparator(o1, o2) {
                for (var i = 0; i < sortPredicate.length; i++) {
                    var comp = sortPredicate[i](o1, o2);
                    if (0 !== comp) return comp;
                }
                return 0;
            }
            function reverseComparator(comp, descending) {
                return toBoolean(descending)
                    ? function (a, b) {
                        return comp(b, a);
                    }
                    : comp;
            }
            function compare(v1, v2) {
                var t1 = typeof v1,
                    t2 = typeof v2;
                if (t1 == t2) {
                    if (
                        ("string" == t1 &&
              ((v1 = v1.toLowerCase()), (v2 = v2.toLowerCase())),
                        v1 === v2)
                    )
                        return 0;
                    return v2 > v1 ? -1 : 1;
                } else return t2 > t1 ? -1 : 1;
            }
        };
    }
    function ngDirective(directive) {
        return (
            isFunction(directive) &&
        (directive = {
            link: directive,
        }),
            (directive.restrict = directive.restrict || "AC"),
            valueFn(directive)
        );
    }
    var htmlAnchorDirective = valueFn({
            restrict: "E",
            compile: function (element, attr) {
                if (
                    (8 >= msie &&
            (attr.href || attr.name || attr.$set("href", ""),
            element.append(document.createComment("IE fix"))),
                    !attr.href && !attr.name)
                )
                    return function (scope, element1) {
                        element1.on("click", function (event) {
                            element1.attr("href") || event.preventDefault();
                        });
                    };
            },
        }),
        ngAttributeAliasDirectives = {};
    forEach(BOOLEAN_ATTR, function (propName, attrName) {
        if ("multiple" == propName) return;
        var normalized = directiveNormalize("ng-" + attrName);
        ngAttributeAliasDirectives[normalized] = function () {
            return {
                priority: 100,
                compile: function () {
                    return function (scope, element, attr) {
                        scope.$watch(attr[normalized], function (value) {
                            attr.$set(attrName, !!value);
                        });
                    };
                },
            };
        };
    }),
    forEach(["src", "srcset", "href"], function (attrName) {
        var normalized = directiveNormalize("ng-" + attrName);
        ngAttributeAliasDirectives[normalized] = function () {
            return {
                priority: 99,
                link: function (scope, element, attr) {
                    attr.$observe(normalized, function (value) {
                        if (!value) return;
                        attr.$set(attrName, value),
                        msie && element.prop(attrName, attr[attrName]);
                    });
                },
            };
        };
    });
    var nullFormCtrl = {
        $addControl: noop,
        $removeControl: noop,
        $setValidity: noop,
        $setDirty: noop,
        $setPristine: noop,
    };
    FormController.$inject = ["$element", "$attrs", "$scope"];
    function FormController(element, attrs) {
        var form = this,
            parentForm = element.parent().controller("form") || nullFormCtrl,
            invalidCount = 0,
            errors = (form.$error = {}),
            controls = [];
        (form.$name = attrs.name || attrs.ngForm),
        (form.$dirty = !1),
        (form.$pristine = !0),
        (form.$valid = !0),
        (form.$invalid = !1),
        parentForm.$addControl(form),
        element.addClass(PRISTINE_CLASS),
        toggleValidCss(!0);
        function toggleValidCss(isValid, validationErrorKey) {
            (validationErrorKey = validationErrorKey
                ? "-" + snake_case(validationErrorKey, "-")
                : ""),
            element
                .removeClass(
                    (isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey,
                )
                .addClass(
                    (isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey,
                );
        }
        (form.$addControl = function (control) {
            assertNotHasOwnProperty(control.$name, "input"),
            controls.push(control),
            control.$name && (form[control.$name] = control);
        }),
        (form.$removeControl = function (control) {
            control.$name &&
          form[control.$name] === control &&
          delete form[control.$name],
            forEach(errors, function (queue, validationToken) {
                form.$setValidity(validationToken, !0, control);
            }),
            arrayRemove(controls, control);
        }),
        (form.$setValidity = function (validationToken, isValid, control) {
            var queue = errors[validationToken];
            if (isValid)
                queue &&
            (arrayRemove(queue, control),
            !queue.length &&
              (invalidCount--,
              invalidCount ||
                (toggleValidCss(isValid),
                (form.$valid = !0),
                (form.$invalid = !1)),
              (errors[validationToken] = !1),
              toggleValidCss(!0, validationToken),
              parentForm.$setValidity(validationToken, !0, form)));
            else {
                if ((invalidCount || toggleValidCss(isValid), queue)) {
                    if (includes(queue, control)) return;
                } else
                    (errors[validationToken] = queue = []),
                    invalidCount++,
                    toggleValidCss(!1, validationToken),
                    parentForm.$setValidity(validationToken, !1, form);
                queue.push(control), (form.$valid = !1), (form.$invalid = !0);
            }
        }),
        (form.$setDirty = function () {
            element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS),
            (form.$dirty = !0),
            (form.$pristine = !1),
            parentForm.$setDirty();
        }),
        (form.$setPristine = function () {
            element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS),
            (form.$dirty = !1),
            (form.$pristine = !0),
            forEach(controls, function (control) {
                control.$setPristine();
            });
        });
    }
    var formDirectiveFactory = function (isNgForm) {
            return [
                "$timeout",
                function ($timeout) {
                    return {
                        name: "form",
                        restrict: isNgForm ? "EAC" : "E",
                        controller: FormController,
                        compile: function () {
                            return {
                                pre: function (scope, formElement, attr, controller) {
                                    if (!attr.action) {
                                        var preventDefaultListener = function (event) {
                                            event.preventDefault
                                                ? event.preventDefault()
                                                : (event.returnValue = !1);
                                        };
                                        addEventListenerFn(
                                            formElement[0],
                                            "submit",
                                            preventDefaultListener,
                                        ),
                                        formElement.on("$destroy", function () {
                                            $timeout(
                                                function () {
                                                    removeEventListenerFn(
                                                        formElement[0],
                                                        "submit",
                                                        preventDefaultListener,
                                                    );
                                                },
                                                0,
                                                !1,
                                            );
                                        });
                                    }
                                    var parentFormCtrl = formElement.parent().controller("form"),
                                        alias = attr.name || attr.ngForm;
                                    alias && setter(scope, alias, controller, alias),
                                    parentFormCtrl &&
                      formElement.on("$destroy", function () {
                          parentFormCtrl.$removeControl(controller),
                          alias && setter(scope, alias, void 0, alias),
                          extend(controller, nullFormCtrl);
                      });
                                },
                            };
                        },
                    };
                },
            ];
        },
        formDirective = formDirectiveFactory(),
        ngFormDirective = formDirectiveFactory(!0),
        inputType = {
            text: textInputType,
            number: numberInputType,
            url: urlInputType,
            email: emailInputType,
            radio: radioInputType,
            checkbox: checkboxInputType,
            hidden: noop,
            button: noop,
            submit: noop,
            reset: noop,
        };
    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        var composing = !1;
        element.on("compositionstart", function () {
            composing = !0;
        }),
        element.on("compositionend", function () {
            composing = !1;
        });
        var listener = function () {
            if (composing) return;
            var value = element.val();
            toBoolean(attr.ngTrim || "T") && (value = trim(value)),
            ctrl.$viewValue !== value &&
          scope.$apply(function () {
              ctrl.$setViewValue(value);
          });
        };
        if ($sniffer.hasEvent("input")) element.on("input", listener);
        else {
            var timeout,
                deferListener = function () {
                    timeout ||
            (timeout = $browser.defer(function () {
                listener(), (timeout = null);
            }));
                };
            element.on("keydown", function (event) {
                var key = event.keyCode;
                if (91 === key || (15 < key && 19 > key) || (37 <= key && 40 >= key))
                    return;
                deferListener();
            }),
            $sniffer.hasEvent("paste") && element.on("paste cut", deferListener);
        }
        element.on("change", listener),
        (ctrl.$render = function () {
            element.val(ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
        });
        var pattern = attr.ngPattern,
            patternValidator,
            match,
            validate = function (regexp, value) {
                if (ctrl.$isEmpty(value) || regexp.test(value))
                    return ctrl.$setValidity("pattern", !0), value;
                return ctrl.$setValidity("pattern", !1), void 0;
            };
        if (pattern) {
            if ((match = pattern.match(/^\/(.*)\/([gim]*)$/)))
                (pattern = new RegExp(match[1], match[2])),
                (patternValidator = function (value) {
                    return validate(pattern, value);
                });
            else
                patternValidator = function (value) {
                    var patternObj = scope.$eval(pattern);
                    if (!patternObj || !patternObj.test)
                        throw minErr("ngPattern")(
                            "noregexp",
                            "Expected {0} to be a RegExp but was {1}. Element: {2}",
                            pattern,
                            patternObj,
                            startingTag(element),
                        );
                    return validate(patternObj, value);
                };
            ctrl.$formatters.push(patternValidator),
            ctrl.$parsers.push(patternValidator);
        }
        if (attr.ngMinlength) {
            var minlength = int(attr.ngMinlength),
                minLengthValidator = function (value) {
                    if (!ctrl.$isEmpty(value) && value.length < minlength)
                        return ctrl.$setValidity("minlength", !1), void 0;
                    return ctrl.$setValidity("minlength", !0), value;
                };
            ctrl.$parsers.push(minLengthValidator),
            ctrl.$formatters.push(minLengthValidator);
        }
        if (attr.ngMaxlength) {
            var maxlength = int(attr.ngMaxlength),
                maxLengthValidator = function (value) {
                    if (!ctrl.$isEmpty(value) && value.length > maxlength)
                        return ctrl.$setValidity("maxlength", !1), void 0;
                    return ctrl.$setValidity("maxlength", !0), value;
                };
            ctrl.$parsers.push(maxLengthValidator),
            ctrl.$formatters.push(maxLengthValidator);
        }
    }
    function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        if (
            (textInputType(scope, element, attr, ctrl, $sniffer, $browser),
            ctrl.$parsers.push(function (value) {
                var empty = ctrl.$isEmpty(value);
                if (empty || /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/.test(value))
                    return (
                        ctrl.$setValidity("number", !0),
                        "" === value ? null : empty ? value : parseFloat(value)
                    );
                return ctrl.$setValidity("number", !1), void 0;
            }),
            ctrl.$formatters.push(function (value) {
                return ctrl.$isEmpty(value) ? "" : "" + value;
            }),
            attr.min)
        ) {
            var minValidator = function (value) {
                var min = parseFloat(attr.min);
                if (!ctrl.$isEmpty(value) && min > value)
                    return ctrl.$setValidity("min", !1), void 0;
                return ctrl.$setValidity("min", !0), value;
            };
            ctrl.$parsers.push(minValidator), ctrl.$formatters.push(minValidator);
        }
        if (attr.max) {
            var maxValidator = function (value) {
                var max = parseFloat(attr.max);
                if (!ctrl.$isEmpty(value) && value > max)
                    return ctrl.$setValidity("max", !1), void 0;
                return ctrl.$setValidity("max", !0), value;
            };
            ctrl.$parsers.push(maxValidator), ctrl.$formatters.push(maxValidator);
        }
        ctrl.$formatters.push(function (value) {
            if (ctrl.$isEmpty(value) || isNumber(value))
                return ctrl.$setValidity("number", !0), value;
            return ctrl.$setValidity("number", !1), void 0;
        });
    }
    function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        textInputType(scope, element, attr, ctrl, $sniffer, $browser);
        var urlValidator = function (value) {
            if (
                ctrl.$isEmpty(value) ||
        /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(
            value,
        )
            )
                return ctrl.$setValidity("url", !0), value;
            return ctrl.$setValidity("url", !1), void 0;
        };
        ctrl.$formatters.push(urlValidator), ctrl.$parsers.push(urlValidator);
    }
    function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        textInputType(scope, element, attr, ctrl, $sniffer, $browser);
        var emailValidator = function (value) {
            if (
                ctrl.$isEmpty(value) ||
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(value)
            )
                return ctrl.$setValidity("email", !0), value;
            return ctrl.$setValidity("email", !1), void 0;
        };
        ctrl.$formatters.push(emailValidator), ctrl.$parsers.push(emailValidator);
    }
    function radioInputType(scope, element, attr, ctrl) {
        isUndefined(attr.name) && element.attr("name", nextUid()),
        element.on("click", function () {
            element[0].checked &&
          scope.$apply(function () {
              ctrl.$setViewValue(attr.value);
          });
        }),
        (ctrl.$render = function () {
            element[0].checked = attr.value == ctrl.$viewValue;
        }),
        attr.$observe("value", ctrl.$render);
    }
    function checkboxInputType(scope, element, attr, ctrl) {
        var trueValue = attr.ngTrueValue,
            falseValue = attr.ngFalseValue;
        isString(trueValue) || (trueValue = !0),
        isString(falseValue) || (falseValue = !1),
        element.on("click", function () {
            scope.$apply(function () {
                ctrl.$setViewValue(element[0].checked);
            });
        }),
        (ctrl.$render = function () {
            element[0].checked = ctrl.$viewValue;
        }),
        (ctrl.$isEmpty = function (value) {
            return trueValue !== value;
        }),
        ctrl.$formatters.push(function (value) {
            return trueValue === value;
        }),
        ctrl.$parsers.push(function (value) {
            return value ? trueValue : falseValue;
        });
    }
    var inputDirective = [
            "$browser",
            "$sniffer",
            function ($browser, $sniffer) {
                return {
                    restrict: "E",
                    require: "?ngModel",
                    link: function (scope, element, attr, ctrl) {
                        ctrl &&
              (inputType[lowercase(attr.type)] || inputType.text)(
                  scope,
                  element,
                  attr,
                  ctrl,
                  $sniffer,
                  $browser,
              );
                    },
                };
            },
        ],
        VALID_CLASS = "ng-valid",
        INVALID_CLASS = "ng-invalid",
        PRISTINE_CLASS = "ng-pristine",
        DIRTY_CLASS = "ng-dirty",
        ngChangeDirective = valueFn({
            require: "ngModel",
            link: function (scope, element, attr, ctrl) {
                ctrl.$viewChangeListeners.push(function () {
                    scope.$eval(attr.ngChange);
                });
            },
        }),
        requiredDirective = function () {
            return {
                require: "?ngModel",
                link: function (scope, elm, attr, ctrl) {
                    if (!ctrl) return;
                    attr.required = !0;
                    var validator = function (value) {
                        if (attr.required && ctrl.$isEmpty(value)) {
                            ctrl.$setValidity("required", !1);
                            return;
                        } else return ctrl.$setValidity("required", !0), value;
                    };
                    ctrl.$formatters.push(validator),
                    ctrl.$parsers.unshift(validator),
                    attr.$observe("required", function () {
                        validator(ctrl.$viewValue);
                    });
                },
            };
        },
        ngBindDirective = ngDirective(function (scope, element, attr) {
            element.addClass("ng-binding").data("$binding", attr.ngBind),
            scope.$watch(attr.ngBind, function (value) {
                element.text(void 0 == value ? "" : value);
            });
        });
    function classDirective(name, selector) {
        return (
            (name = "ngClass" + name),
            function () {
                return {
                    restrict: "AC",
                    link: function (scope, element, attr) {
                        var oldVal;
                        scope.$watch(attr[name], ngClassWatchAction, !0),
                        attr.$observe("class", function (value) {
                            ngClassWatchAction(scope.$eval(attr[name]));
                        }),
                        "ngClass" !== name &&
                scope.$watch("$index", function ($index, old$index) {
                    var mod = 1 & $index;
                    if ((mod !== old$index) & 1) {
                        var classes = flattenClasses(scope.$eval(attr[name]));
                        mod === selector
                            ? attr.$addClass(classes)
                            : attr.$removeClass(classes);
                    }
                });
                        function ngClassWatchAction(newVal) {
                            if (!0 === selector || scope.$index % 2 === selector) {
                                var newClasses = flattenClasses(newVal || "");
                                if (!oldVal) attr.$addClass(newClasses);
                                else
                                    equals(newVal, oldVal) ||
                    attr.$updateClass(newClasses, flattenClasses(oldVal));
                            }
                            oldVal = copy(newVal);
                        }
                        function flattenClasses(classVal) {
                            if (isArray(classVal)) return classVal.join(" ");
                            if (isObject(classVal)) {
                                var classes = [];
                                return (
                                    forEach(classVal, function (v, k) {
                                        v && classes.push(k);
                                    }),
                                    classes.join(" ")
                                );
                            }
                            return classVal;
                        }
                    },
                };
            }
        );
    }
    var ngClassDirective = classDirective("", !0),
        ngClassOddDirective = classDirective("Odd", 0),
        ngClassEvenDirective = classDirective("Even", 1),
        ngCloakDirective = ngDirective({
            compile: function (element, attr) {
                attr.$set("ngCloak", void 0), element.removeClass("ng-cloak");
            },
        }),
        ngEventDirectives = {};
    forEach(
        "click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(
            " ",
        ),
        function (name) {
            var directiveName = directiveNormalize("ng-" + name);
            ngEventDirectives[directiveName] = [
                "$parse",
                function ($parse) {
                    return {
                        compile: function ($element, attr) {
                            var fn = $parse(attr[directiveName]);
                            return function (scope, element, attr) {
                                element.on(lowercase(name), function (event) {
                                    scope.$apply(function () {
                                        fn(scope, {
                                            $event: event,
                                        });
                                    });
                                });
                            };
                        },
                    };
                },
            ];
        },
    );
    var ngInitDirective = ngDirective({
            priority: 450,
            compile: function () {
                return {
                    pre: function (scope, element, attrs) {
                        scope.$eval(attrs.ngInit);
                    },
                };
            },
        }),
        ngNonBindableDirective = ngDirective({
            terminal: !0,
            priority: 1000,
        }),
        ngStyleDirective = ngDirective(function (scope, element, attr) {
            scope.$watch(
                attr.ngStyle,
                function (newStyles, oldStyles) {
                    oldStyles &&
            newStyles !== oldStyles &&
            forEach(oldStyles, function (val, style) {
                element.css(style, "");
            }),
                    newStyles && element.css(newStyles);
                },
                !0,
            );
        }),
        ngSwitchWhenDirective = ngDirective({
            transclude: "element",
            priority: 800,
            require: "^ngSwitch",
            compile: function (element, attrs) {
                return function (scope, element, attr, ctrl, $transclude) {
                    (ctrl.cases["!" + attrs.ngSwitchWhen] =
            ctrl.cases["!" + attrs.ngSwitchWhen] || []),
                    ctrl.cases["!" + attrs.ngSwitchWhen].push({
                        transclude: $transclude,
                        element: element,
                    });
                };
            },
        }),
        ngSwitchDefaultDirective = ngDirective({
            transclude: "element",
            priority: 800,
            require: "^ngSwitch",
            link: function (scope, element, attr, ctrl, $transclude) {
                (ctrl.cases["?"] = ctrl.cases["?"] || []),
                ctrl.cases["?"].push({
                    transclude: $transclude,
                    element: element,
                });
            },
        }),
        ngTranscludeDirective = ngDirective({
            controller: [
                "$element",
                "$transclude",
                function ($element, $transclude) {
                    if (!$transclude)
                        throw minErr("ngTransclude")(
                            "orphan",
                            "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}",
                            startingTag($element),
                        );
                    this.$transclude = $transclude;
                },
            ],
            link: function ($scope, $element, $attrs, controller) {
                controller.$transclude(function (clone) {
                    $element.empty(), $element.append(clone);
                });
            },
        }),
        ngOptionsMinErr = minErr("ngOptions"),
        ngOptionsDirective = valueFn({
            terminal: !0,
        }),
        styleDirective = valueFn({
            restrict: "E",
            terminal: !0,
        });
    (function () {
        if ((jQuery = window.jQuery))
            (jqLite = jQuery),
            extend(jQuery.fn, {
                scope: JQLitePrototype.scope,
                isolateScope: JQLitePrototype.isolateScope,
                controller: JQLitePrototype.controller,
                injector: JQLitePrototype.injector,
                inheritedData: JQLitePrototype.inheritedData,
            }),
            jqLitePatchJQueryRemove("remove", !0, !0, !1),
            jqLitePatchJQueryRemove("empty", !1, !1, !1),
            jqLitePatchJQueryRemove("html", !1, !1, !0);
        else jqLite = JQLite;
        angular.element = jqLite;
    })(),
    (function (angular1) {
        extend(angular, {
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
            version: {
                full: "1.2.5",
                major: 1,
                minor: 2,
                dot: 5,
                codeName: "singularity-expansion",
            },
            isDate: isDate,
            lowercase: lowercase,
            uppercase: uppercase,
            callbacks: {
                counter: 0,
            },
            $$minErr: minErr,
            $$csp: csp,
        }),
        (angularModule = setupModuleLoader(window));
        try {
            angularModule("ngLocale");
        } catch (e) {
            angularModule("ngLocale", []).provider("$locale", $LocaleProvider);
        }
        angularModule(
            "ng",
            ["ngLocale"],
            [
                "$provide",
                function ($provide) {
                    $provide.provider({
                        $$sanitizeUri: $$SanitizeUriProvider,
                    }),
                    $provide
                        .provider("$compile", $CompileProvider)
                        .directive({
                            a: htmlAnchorDirective,
                            input: inputDirective,
                            textarea: inputDirective,
                            form: formDirective,
                            script: [
                                "$templateCache",
                                function ($templateCache) {
                                    return {
                                        restrict: "E",
                                        terminal: !0,
                                        compile: function (element, attr) {
                                            if ("text/ng-template" == attr.type) {
                                                var templateUrl = attr.id,
                                                    text = element[0].text;
                                                $templateCache.put(templateUrl, text);
                                            }
                                        },
                                    };
                                },
                            ],
                            select: [
                                "$compile",
                                "$parse",
                                function ($compile, $parse) {
                                    var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
                                    return {
                                        restrict: "E",
                                        require: ["select", "?ngModel"],
                                        controller: [
                                            "$element",
                                            "$scope",
                                            "$attrs",
                                            function ($element, $scope, $attrs) {
                                                var self = this,
                                                    optionsMap = {},
                                                    ngModelCtrl = {
                                                        $setViewValue: noop,
                                                    },
                                                    nullOption,
                                                    unknownOption;
                                                (self.databound = $attrs.ngModel),
                                                (self.init = function (
                                                    ngModelCtrl_,
                                                    nullOption_,
                                                    unknownOption_,
                                                ) {
                                                    (ngModelCtrl = ngModelCtrl_),
                                                    (nullOption = nullOption_),
                                                    (unknownOption = unknownOption_);
                                                }),
                                                (self.addOption = function (value) {
                                                    assertNotHasOwnProperty(
                                                        value,
                                                        '"option value"',
                                                    ),
                                                    (optionsMap[value] = !0),
                                                    ngModelCtrl.$viewValue == value &&
                                    ($element.val(value),
                                    unknownOption.parent() &&
                                      unknownOption.remove());
                                                }),
                                                (self.removeOption = function (value) {
                                                    this.hasOption(value) &&
                                  (delete optionsMap[value],
                                  ngModelCtrl.$viewValue == value &&
                                    this.renderUnknownOption(value));
                                                }),
                                                (self.renderUnknownOption = function (val) {
                                                    var unknownVal = "? " + hashKey(val) + " ?";
                                                    unknownOption.val(unknownVal),
                                                    $element.prepend(unknownOption),
                                                    $element.val(unknownVal),
                                                    unknownOption.prop("selected", !0);
                                                }),
                                                (self.hasOption = function (value) {
                                                    return optionsMap.hasOwnProperty(value);
                                                }),
                                                $scope.$on("$destroy", function () {
                                                    self.renderUnknownOption = noop;
                                                });
                                            },
                                        ],
                                        link: function (scope, element, attr, ctrls) {
                                            if (!ctrls[1]) return;
                                            for (
                                                var selectCtrl = ctrls[0],
                                                    ngModelCtrl = ctrls[1],
                                                    multiple = attr.multiple,
                                                    optionsExp = attr.ngOptions,
                                                    nullOption = !1,
                                                    emptyOption,
                                                    optionTemplate = jqLite(
                                                        document.createElement("option"),
                                                    ),
                                                    unknownOption = optionTemplate.clone(),
                                                    i = 0,
                                                    children = element.children(),
                                                    ii = children.length;
                                                ii > i;
                                                i++
                                            )
                                                if (children[i].value === "") {
                                                    emptyOption = nullOption = children.eq(i);
                                                    break;
                                                }
                                            if (
                                                (selectCtrl.init(
                                                    ngModelCtrl,
                                                    nullOption,
                                                    unknownOption,
                                                ),
                                                multiple && (attr.required || attr.ngRequired))
                                            ) {
                                                var requiredValidator = function (value) {
                                                    return (
                                                        ngModelCtrl.$setValidity(
                                                            "required",
                                                            !attr.required || (value && value.length),
                                                        ),
                                                        value
                                                    );
                                                };
                                                ngModelCtrl.$parsers.push(requiredValidator),
                                                ngModelCtrl.$formatters.unshift(
                                                    requiredValidator,
                                                ),
                                                attr.$observe("required", function () {
                                                    requiredValidator(ngModelCtrl.$viewValue);
                                                });
                                            }
                                            if (optionsExp)
                                                setupAsOptions(scope, element, ngModelCtrl);
                                            else if (multiple)
                                                setupAsMultiple(scope, element, ngModelCtrl);
                                            else
                                                setupAsSingle(
                                                    scope,
                                                    element,
                                                    ngModelCtrl,
                                                    selectCtrl,
                                                );
                                            function setupAsSingle(
                                                scope1,
                                                selectElement,
                                                ngModelCtrl1,
                                                selectCtrl1,
                                            ) {
                                                (ngModelCtrl1.$render = function () {
                                                    var viewValue = ngModelCtrl1.$viewValue;
                                                    if (selectCtrl1.hasOption(viewValue))
                                                        unknownOption.parent() &&
                                  unknownOption.remove(),
                                                        selectElement.val(viewValue),
                                                        "" === viewValue &&
                                    emptyOption.prop("selected", !0);
                                                    else if (isUndefined(viewValue) && emptyOption)
                                                        selectElement.val("");
                                                    else selectCtrl1.renderUnknownOption(viewValue);
                                                }),
                                                selectElement.on("change", function () {
                                                    scope1.$apply(function () {
                                                        unknownOption.parent() &&
                                    unknownOption.remove(),
                                                        ngModelCtrl1.$setViewValue(
                                                            selectElement.val(),
                                                        );
                                                    });
                                                });
                                            }
                                            function setupAsMultiple(
                                                scope1,
                                                selectElement,
                                                ctrl,
                                            ) {
                                                var lastView;
                                                (ctrl.$render = function () {
                                                    forEach(
                                                        selectElement.find("option"),
                                                        function (option) {
                                                            option.selected = isDefined(
                                                                new HashMap(ctrl.$viewValue).get(
                                                                    option.value,
                                                                ),
                                                            );
                                                        },
                                                    );
                                                }),
                                                scope1.$watch(function () {
                                                    equals(lastView, ctrl.$viewValue) ||
                                  ((lastView = copy(ctrl.$viewValue)),
                                  ctrl.$render());
                                                }),
                                                selectElement.on("change", function () {
                                                    scope1.$apply(function () {
                                                        var array = [];
                                                        forEach(
                                                            selectElement.find("option"),
                                                            function (option) {
                                                                option.selected &&
                                        array.push(option.value);
                                                            },
                                                        ),
                                                        ctrl.$setViewValue(array);
                                                    });
                                                });
                                            }
                                            function setupAsOptions(scope1, selectElement, ctrl) {
                                                var match;
                                                if (!(match = optionsExp.match(NG_OPTIONS_REGEXP)))
                                                    throw ngOptionsMinErr(
                                                        "iexp",
                                                        "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}",
                                                        optionsExp,
                                                        startingTag(selectElement),
                                                    );
                                                var displayFn = $parse(match[2] || match[1]),
                                                    valueName = match[4] || match[6],
                                                    keyName = match[5],
                                                    groupByFn = $parse(match[3] || ""),
                                                    valueFn1 = $parse(
                                                        match[2] ? match[1] : valueName,
                                                    ),
                                                    valuesFn = $parse(match[7]),
                                                    track = match[8],
                                                    trackFn = track ? $parse(match[8]) : null,
                                                    optionGroupsCache = [
                                                        [
                                                            {
                                                                element: selectElement,
                                                                label: "",
                                                            },
                                                        ],
                                                    ];
                                                nullOption &&
                              ($compile(nullOption)(scope1),
                              nullOption.removeClass("ng-scope"),
                              nullOption.remove()),
                                                selectElement.empty(),
                                                selectElement.on("change", function () {
                                                    scope1.$apply(function () {
                                                        var optionGroup,
                                                            collection = valuesFn(scope1) || [],
                                                            locals = {},
                                                            key,
                                                            value,
                                                            index,
                                                            groupIndex,
                                                            trackIndex;
                                                        if (multiple)
                                                            for (
                                                                value = [],
                                                                groupIndex = 0,
                                                                optionGroupsCache.length;
                                                                groupIndex < optionGroupsCache.length;
                                                                groupIndex++
                                                            )
                                                                for (
                                                                    optionGroup =
                                          optionGroupsCache[groupIndex],
                                                                    index = 1,
                                                                    optionGroup.length;
                                                                    index < optionGroup.length;
                                                                    index++
                                                                )
                                                                    if (
                                                                        optionGroup[index].element[0].selected
                                                                    ) {
                                                                        if (
                                                                            ((key = optionGroup[
                                                                                index
                                                                            ].element.val()),
                                                                            keyName && (locals[keyName] = key),
                                                                            trackFn)
                                                                        )
                                                                            for (
                                                                                trackIndex = 0;
                                                                                trackIndex < collection.length;
                                                                                trackIndex++
                                                                            )
                                                                                if (
                                                                                    ((locals[valueName] =
                                                  collection[trackIndex]),
                                                                                    trackFn(scope1, locals) == key)
                                                                                )
                                                                                    break;
                                                                                else
                                                                                    locals[valueName] =
                                                  collection[key];
                                                                        value.push(valueFn1(scope1, locals));
                                                                    } else if (
                                                                        ((key = selectElement.val()),
                                                                        "?" == key)
                                                                    )
                                                                        value = void 0;
                                                                    else if ("" === key) value = null;
                                                                    else if (trackFn)
                                                                        for (
                                                                            trackIndex = 0;
                                                                            trackIndex < collection.length;
                                                                            trackIndex++
                                                                        )
                                                                            if (
                                                                                ((locals[valueName] =
                                                collection[trackIndex]),
                                                                                trackFn(scope1, locals) == key)
                                                                            ) {
                                                                                value = valueFn1(scope1, locals);
                                                                                break;
                                                                            } else
                                                                                (locals[valueName] =
                                                collection[key]),
                                                                                keyName &&
                                                  (locals[keyName] = key),
                                                                                (value = valueFn1(
                                                                                    scope1,
                                                                                    locals,
                                                                                ));
                                                        ctrl.$setViewValue(value);
                                                    });
                                                }),
                                                (ctrl.$render = render),
                                                scope1.$watch(render);
                                                function render() {
                                                    var optionGroups = {
                                                            "": [],
                                                        },
                                                        optionGroupNames = [""],
                                                        optionGroupName,
                                                        optionGroup,
                                                        option,
                                                        existingParent,
                                                        existingOptions,
                                                        existingOption,
                                                        modelValue = ctrl.$modelValue,
                                                        values = valuesFn(scope1) || [],
                                                        keys = keyName ? sortedKeys(values) : values,
                                                        key,
                                                        length,
                                                        groupIndex,
                                                        index,
                                                        locals = {},
                                                        selected,
                                                        selectedSet = !1,
                                                        lastElement,
                                                        element,
                                                        label;
                                                    if (multiple) {
                                                        if (trackFn && isArray(modelValue)) {
                                                            selectedSet = new HashMap([]);
                                                            for (
                                                                var trackIndex = 0;
                                                                trackIndex < modelValue.length;
                                                                trackIndex++
                                                            )
                                                                (locals[valueName] =
                                      modelValue[trackIndex]),
                                                                selectedSet.put(
                                                                    trackFn(scope1, locals),
                                                                    modelValue[trackIndex],
                                                                );
                                                        } else selectedSet = new HashMap(modelValue);
                                                    }
                                                    for (
                                                        index = 0;
                                                        (length = keys.length), length > index;
                                                        index++
                                                    ) {
                                                        if (((key = index), keyName)) {
                                                            if (
                                                                ((key = keys[index]), key.charAt(0) === "$")
                                                            )
                                                                continue;
                                                            locals[keyName] = key;
                                                        }
                                                        if (
                                                            ((locals[valueName] = values[key]),
                                                            (optionGroupName =
                                    groupByFn(scope1, locals) || ""),
                                                            (optionGroup =
                                    optionGroups[optionGroupName]) ||
                                    ((optionGroup = optionGroups[
                                        optionGroupName
                                    ] = []),
                                    optionGroupNames.push(optionGroupName)),
                                                            multiple)
                                                        )
                                                            selected = isDefined(
                                                                selectedSet.remove(
                                                                    trackFn
                                                                        ? trackFn(scope1, locals)
                                                                        : valueFn1(scope1, locals),
                                                                ),
                                                            );
                                                        else {
                                                            if (trackFn) {
                                                                var modelCast = {};
                                                                (modelCast[valueName] = modelValue),
                                                                (selected =
                                        trackFn(scope1, modelCast) ===
                                        trackFn(scope1, locals));
                                                            } else
                                                                selected =
                                      modelValue === valueFn1(scope1, locals);
                                                            selectedSet ||= selected;
                                                        }
                                                        (label = displayFn(scope1, locals)),
                                                        (label = isDefined(label) ? label : ""),
                                                        optionGroup.push({
                                                            id: trackFn
                                                                ? trackFn(scope1, locals)
                                                                : keyName
                                                                    ? keys[index]
                                                                    : index,
                                                            label: label,
                                                            selected: selected,
                                                        });
                                                    }
                                                    if (!multiple) {
                                                        if (nullOption || null === modelValue)
                                                            optionGroups[""].unshift({
                                                                id: "",
                                                                label: "",
                                                                selected: !selectedSet,
                                                            });
                                                        else
                                                            selectedSet ||
                                    optionGroups[""].unshift({
                                        id: "?",
                                        label: "",
                                        selected: !0,
                                    });
                                                    }
                                                    for (
                                                        groupIndex = 0, optionGroupNames.length;
                                                        groupIndex < optionGroupNames.length;
                                                        groupIndex++
                                                    ) {
                                                        if (
                                                            ((optionGroupName =
                                    optionGroupNames[groupIndex]),
                                                            (optionGroup = optionGroups[optionGroupName]),
                                                            optionGroupsCache.length <= groupIndex)
                                                        )
                                                            (existingParent = {
                                                                element: jqLite(
                                                                    document.createElement("optgroup"),
                                                                )
                                                                    .clone()
                                                                    .attr("label", optionGroupName),
                                                                label: optionGroup.label,
                                                            }),
                                                            (existingOptions = [existingParent]),
                                                            optionGroupsCache.push(existingOptions),
                                                            selectElement.append(
                                                                existingParent.element,
                                                            );
                                                        else
                                                            (existingOptions =
                                    optionGroupsCache[groupIndex]),
                                                            (existingParent = existingOptions[0]),
                                                            existingParent.label != optionGroupName &&
                                      existingParent.element.attr(
                                          "label",
                                          (existingParent.label = optionGroupName),
                                      );
                                                        for (
                                                            lastElement = null,
                                                            index = 0,
                                                            length = optionGroup.length;
                                                            length > index;
                                                            index++
                                                        )
                                                            if (
                                                                ((option = optionGroup[index]),
                                                                (existingOption =
                                      existingOptions[index + 1]))
                                                            )
                                                                (lastElement = existingOption.element),
                                                                existingOption.label !== option.label &&
                                        lastElement.text(
                                            (existingOption.label = option.label),
                                        ),
                                                                existingOption.id !== option.id &&
                                        lastElement.val(
                                            (existingOption.id = option.id),
                                        ),
                                                                lastElement[0].selected !==
                                        option.selected &&
                                        lastElement.prop(
                                            "selected",
                                            (existingOption.selected =
                                            option.selected),
                                        );
                                                            else {
                                                                if ("" === option.id && nullOption)
                                                                    element = nullOption;
                                                                else
                                                                    (element = optionTemplate.clone())
                                                                        .val(option.id)
                                                                        .attr("selected", option.selected)
                                                                        .text(option.label);
                                                                if (
                                                                    (existingOptions.push(
                                                                        (existingOption = {
                                                                            element: element,
                                                                            label: option.label,
                                                                            id: option.id,
                                                                            selected: option.selected,
                                                                        }),
                                                                    ),
                                                                    lastElement)
                                                                )
                                                                    lastElement.after(element);
                                                                else existingParent.element.append(element);
                                                                lastElement = element;
                                                            }
                                                        for (index++; existingOptions.length > index; )
                                                            existingOptions.pop().element.remove();
                                                    }
                                                    for (; optionGroupsCache.length > groupIndex; )
                                                        optionGroupsCache.pop()[0].element.remove();
                                                }
                                            }
                                        },
                                    };
                                },
                            ],
                            style: styleDirective,
                            option: [
                                "$interpolate",
                                function ($interpolate) {
                                    return {
                                        restrict: "E",
                                        priority: 100,
                                        compile: function (element, attr) {
                                            if (isUndefined(attr.value)) {
                                                var interpolateFn = $interpolate(
                                                    element.text(),
                                                    !0,
                                                );
                                                interpolateFn || attr.$set("value", element.text());
                                            }
                                            return function (scope, element, attr1) {
                                                var parent = element.parent(),
                                                    selectCtrl =
                                parent.data("$selectController") ||
                                parent.parent().data("$selectController");
                                                if (selectCtrl && selectCtrl.databound)
                                                    element.prop("selected", !1);
                                                else
                                                    selectCtrl = {
                                                        addOption: noop,
                                                        removeOption: noop,
                                                    };
                                                if (interpolateFn)
                                                    scope.$watch(
                                                        interpolateFn,
                                                        function (newVal, oldVal) {
                                                            attr1.$set("value", newVal),
                                                            newVal !== oldVal &&
                                      selectCtrl.removeOption(oldVal),
                                                            selectCtrl.addOption(newVal);
                                                        },
                                                    );
                                                else selectCtrl.addOption(attr1.value);
                                                element.on("$destroy", function () {
                                                    selectCtrl.removeOption(attr1.value);
                                                });
                                            };
                                        },
                                    };
                                },
                            ],
                            ngBind: ngBindDirective,
                            ngBindHtml: [
                                "$sce",
                                "$parse",
                                function ($sce, $parse) {
                                    return function (scope, element, attr) {
                                        element
                                            .addClass("ng-binding")
                                            .data("$binding", attr.ngBindHtml);
                                        var parsed = $parse(attr.ngBindHtml);
                                        scope.$watch(
                                            function () {
                                                return (parsed(scope) || "").toString();
                                            },
                                            function (value) {
                                                element.html(
                                                    $sce.getTrustedHtml(parsed(scope)) || "",
                                                );
                                            },
                                        );
                                    };
                                },
                            ],
                            ngBindTemplate: [
                                "$interpolate",
                                function ($interpolate) {
                                    return function (scope, element, attr) {
                                        var interpolateFn = $interpolate(
                                            element.attr(attr.$attr.ngBindTemplate),
                                        );
                                        element
                                            .addClass("ng-binding")
                                            .data("$binding", interpolateFn),
                                        attr.$observe("ngBindTemplate", function (value) {
                                            element.text(value);
                                        });
                                    };
                                },
                            ],
                            ngClass: ngClassDirective,
                            ngClassEven: ngClassEvenDirective,
                            ngClassOdd: ngClassOddDirective,
                            ngCloak: ngCloakDirective,
                            ngController: [
                                function () {
                                    return {
                                        scope: !0,
                                        controller: "@",
                                        priority: 500,
                                    };
                                },
                            ],
                            ngForm: ngFormDirective,
                            ngHide: [
                                "$animate",
                                function ($animate) {
                                    return function (scope, element, attr) {
                                        scope.$watch(attr.ngHide, function (value) {
                                            $animate[
                                                toBoolean(value) ? "addClass" : "removeClass"
                                            ](element, "ng-hide");
                                        });
                                    };
                                },
                            ],
                            ngIf: [
                                "$animate",
                                function ($animate) {
                                    return {
                                        transclude: "element",
                                        priority: 600,
                                        terminal: !0,
                                        restrict: "A",
                                        $$tlb: !0,
                                        link: function (
                                            $scope,
                                            $element,
                                            $attr,
                                            ctrl,
                                            $transclude,
                                        ) {
                                            var block, childScope;
                                            $scope.$watch($attr.ngIf, function (value) {
                                                if (toBoolean(value))
                                                    childScope ||
                                ((childScope = $scope.$new()),
                                $transclude(childScope, function (clone) {
                                    (clone[
                                        clone.length++
                                    ] = document.createComment(
                                        " end ngIf: " + $attr.ngIf + " ",
                                    )),
                                    (block = {
                                        clone: clone,
                                    }),
                                    $animate.enter(
                                        clone,
                                        $element.parent(),
                                        $element,
                                    );
                                }));
                                                else
                                                    childScope &&
                                (childScope.$destroy(), (childScope = null)),
                                                    block &&
                                  ($animate.leave(
                                      getBlockElements(block.clone),
                                  ),
                                  (block = null));
                                            });
                                        },
                                    };
                                },
                            ],
                            ngInclude: [
                                "$http",
                                "$templateCache",
                                "$anchorScroll",
                                "$animate",
                                "$sce",
                                function (
                                    $http,
                                    $templateCache,
                                    $anchorScroll,
                                    $animate,
                                    $sce,
                                ) {
                                    return {
                                        restrict: "ECA",
                                        priority: 400,
                                        terminal: !0,
                                        transclude: "element",
                                        controller: angular.noop,
                                        compile: function (element, attr) {
                                            var srcExp = attr.ngInclude || attr.src,
                                                onloadExp = attr.onload || "",
                                                autoScrollExp = attr.autoscroll;
                                            return function (
                                                scope,
                                                $element,
                                                $attr,
                                                ctrl,
                                                $transclude,
                                            ) {
                                                var changeCounter = 0,
                                                    currentScope,
                                                    currentElement,
                                                    cleanupLastIncludeContent = function () {
                                                        currentScope &&
                                  (currentScope.$destroy(),
                                  (currentScope = null)),
                                                        currentElement &&
                                    ($animate.leave(currentElement),
                                    (currentElement = null));
                                                    };
                                                scope.$watch(
                                                    $sce.parseAsResourceUrl(srcExp),
                                                    function (src) {
                                                        var thisChangeId = ++changeCounter;
                                                        if (src)
                                                            $http
                                                                .get(src, {
                                                                    cache: $templateCache,
                                                                })
                                                                .success(function (response) {
                                                                    if (changeCounter !== thisChangeId)
                                                                        return;
                                                                    var newScope = scope.$new();
                                                                    ctrl.template = response;
                                                                    var clone = $transclude(
                                                                        newScope,
                                                                        function (clone) {
                                                                            cleanupLastIncludeContent(),
                                                                            $animate.enter(
                                                                                clone,
                                                                                null,
                                                                                $element,
                                                                                function () {
                                                                                    isDefined(autoScrollExp) &&
                                                  (!autoScrollExp ||
                                                    scope.$eval(
                                                        autoScrollExp,
                                                    )) &&
                                                  $anchorScroll();
                                                                                },
                                                                            );
                                                                        },
                                                                    );
                                                                    (currentScope = newScope),
                                                                    (currentElement = clone),
                                                                    currentScope.$emit(
                                                                        "$includeContentLoaded",
                                                                    ),
                                                                    scope.$eval(onloadExp);
                                                                })
                                                                .error(function () {
                                                                    changeCounter === thisChangeId &&
                                        cleanupLastIncludeContent();
                                                                }),
                                                            scope.$emit("$includeContentRequested");
                                                        else
                                                            cleanupLastIncludeContent(),
                                                            (ctrl.template = null);
                                                    },
                                                );
                                            };
                                        },
                                    };
                                },
                            ],
                            ngInit: ngInitDirective,
                            ngNonBindable: ngNonBindableDirective,
                            ngPluralize: [
                                "$locale",
                                "$interpolate",
                                function ($locale, $interpolate) {
                                    var BRACE = /{}/g;
                                    return {
                                        restrict: "EA",
                                        link: function (scope, element, attr) {
                                            var numberExp = attr.count,
                                                whenExp =
                              attr.$attr.when && element.attr(attr.$attr.when),
                                                offset = attr.offset || 0,
                                                whens = scope.$eval(whenExp) || {},
                                                whensExpFns = {},
                                                startSymbol = $interpolate.startSymbol(),
                                                endSymbol = $interpolate.endSymbol();
                                            forEach(attr, function (expression, attributeName) {
                                                /^when(Minus)?(.+)$/.test(attributeName) &&
                              (whens[
                                  lowercase(
                                      attributeName
                                          .replace("when", "")
                                          .replace("Minus", "-"),
                                  )
                              ] = element.attr(attr.$attr[attributeName]));
                                            }),
                                            forEach(whens, function (expression, key) {
                                                whensExpFns[key] = $interpolate(
                                                    expression.replace(
                                                        BRACE,
                                                        startSymbol +
                                    numberExp +
                                    "-" +
                                    offset +
                                    endSymbol,
                                                    ),
                                                );
                                            }),
                                            scope.$watch(
                                                function () {
                                                    var value = parseFloat(scope.$eval(numberExp));
                                                    if (!isNaN(value))
                                                        return (
                                                            value in whens ||
                                      (value = $locale.pluralCat(
                                          value - offset,
                                      )),
                                                            whensExpFns[value](scope, element, !0)
                                                        );
                                                    return "";
                                                },
                                                function (newVal) {
                                                    element.text(newVal);
                                                },
                                            );
                                        },
                                    };
                                },
                            ],
                            ngRepeat: [
                                "$parse",
                                "$animate",
                                function ($parse, $animate) {
                                    var ngRepeatMinErr = minErr("ngRepeat");
                                    return {
                                        transclude: "element",
                                        priority: 1000,
                                        terminal: !0,
                                        $$tlb: !0,
                                        link: function (
                                            $scope,
                                            $element,
                                            $attr,
                                            ctrl,
                                            $transclude,
                                        ) {
                                            var expression = $attr.ngRepeat,
                                                match = expression.match(
                                                    /^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/,
                                                ),
                                                trackByExp,
                                                trackByExpGetter,
                                                trackByIdExpFn,
                                                trackByIdArrayFn,
                                                trackByIdObjFn,
                                                lhs,
                                                rhs,
                                                valueIdentifier,
                                                keyIdentifier,
                                                hashFnLocals = {
                                                    $id: hashKey,
                                                };
                                            if (!match)
                                                throw ngRepeatMinErr(
                                                    "iexp",
                                                    "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
                                                    expression,
                                                );
                                            if (
                                                ((lhs = match[1]),
                                                (rhs = match[2]),
                                                (trackByExp = match[4]))
                                            )
                                                (trackByExpGetter = $parse(trackByExp)),
                                                (trackByIdExpFn = function (key, value, index) {
                                                    return (
                                                        keyIdentifier &&
                                    (hashFnLocals[keyIdentifier] = key),
                                                        (hashFnLocals[valueIdentifier] = value),
                                                        (hashFnLocals.$index = index),
                                                        trackByExpGetter($scope, hashFnLocals)
                                                    );
                                                });
                                            else
                                                (trackByIdArrayFn = function (key, value) {
                                                    return hashKey(value);
                                                }),
                                                (trackByIdObjFn = function (key) {
                                                    return key;
                                                });
                                            if (
                                                ((match = lhs.match(
                                                    /^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/,
                                                )),
                                                !match)
                                            )
                                                throw ngRepeatMinErr(
                                                    "iidexp",
                                                    "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.",
                                                    lhs,
                                                );
                                            (valueIdentifier = match[3] || match[1]),
                                            (keyIdentifier = match[2]);
                                            var lastBlockMap = {};
                                            $scope.$watchCollection(rhs, function (collection) {
                                                var index,
                                                    length,
                                                    previousNode = $element[0],
                                                    nextNode,
                                                    nextBlockMap = {},
                                                    childScope,
                                                    key,
                                                    value,
                                                    trackById,
                                                    trackByIdFn,
                                                    collectionKeys,
                                                    block,
                                                    nextBlockOrder = [],
                                                    elementsToRemove;
                                                if (isArrayLike(collection))
                                                    (collectionKeys = collection),
                                                    (trackByIdFn =
                                  trackByIdExpFn || trackByIdArrayFn);
                                                else {
                                                    (trackByIdFn = trackByIdExpFn || trackByIdObjFn),
                                                    (collectionKeys = []);
                                                    for (key in collection)
                                                        collection.hasOwnProperty(key) &&
                                  key.charAt(0) != "$" &&
                                  collectionKeys.push(key);
                                                    collectionKeys.sort();
                                                }
                                                for (
                                                    collectionKeys.length,
                                                    length = nextBlockOrder.length =
                                  collectionKeys.length,
                                                    index = 0;
                                                    length > index;
                                                    index++
                                                )
                                                    if (
                                                        ((key =
                                  collection === collectionKeys
                                      ? index
                                      : collectionKeys[index]),
                                                        (value = collection[key]),
                                                        (trackById = trackByIdFn(key, value, index)),
                                                        assertNotHasOwnProperty(
                                                            trackById,
                                                            "`track by` id",
                                                        ),
                                                        lastBlockMap.hasOwnProperty(trackById))
                                                    )
                                                        (block = lastBlockMap[trackById]),
                                                        delete lastBlockMap[trackById],
                                                        (nextBlockMap[trackById] = block),
                                                        (nextBlockOrder[index] = block);
                                                    else if (nextBlockMap.hasOwnProperty(trackById))
                                                        throw (
                                                            (forEach(nextBlockOrder, function (block) {
                                                                block &&
                                      block.scope &&
                                      (lastBlockMap[block.id] = block);
                                                            }),
                                                            ngRepeatMinErr(
                                                                "dupes",
                                                                "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}",
                                                                expression,
                                                                trackById,
                                                            ))
                                                        );
                                                    else
                                                        (nextBlockOrder[index] = {
                                                            id: trackById,
                                                        }),
                                                        (nextBlockMap[trackById] = !1);
                                                for (key in lastBlockMap)
                                                    lastBlockMap.hasOwnProperty(key) &&
                                ((block = lastBlockMap[key]),
                                (elementsToRemove = getBlockElements(
                                    block.clone,
                                )),
                                $animate.leave(elementsToRemove),
                                forEach(elementsToRemove, function (element) {
                                    element["$$NG_REMOVED"] = !0;
                                }),
                                block.scope.$destroy());
                                                for (
                                                    index = 0, length = collectionKeys.length;
                                                    length > index;
                                                    index++
                                                ) {
                                                    if (
                                                        ((key =
                                  collection === collectionKeys
                                      ? index
                                      : collectionKeys[index]),
                                                        (value = collection[key]),
                                                        (block = nextBlockOrder[index]),
                                                        nextBlockOrder[index - 1] &&
                                  (previousNode = getBlockEnd(
                                      nextBlockOrder[index - 1],
                                  )),
                                                        block.scope)
                                                    ) {
                                                        (childScope = block.scope),
                                                        (nextNode = previousNode);
                                                        do nextNode = nextNode.nextSibling;
                                                        while (nextNode && nextNode["$$NG_REMOVED"]);
                                                        getBlockStart(block) != nextNode &&
                                  $animate.move(
                                      getBlockElements(block.clone),
                                      null,
                                      jqLite(previousNode),
                                  ),
                                                        (previousNode = getBlockEnd(block));
                                                    } else childScope = $scope.$new();
                                                    (childScope[valueIdentifier] = value),
                                                    keyIdentifier &&
                                  (childScope[keyIdentifier] = key),
                                                    (childScope.$index = index),
                                                    (childScope.$first = 0 === index),
                                                    (childScope.$last =
                                  index === collectionKeys.length - 1),
                                                    (childScope.$middle = !(
                                                        childScope.$first || childScope.$last
                                                    )),
                                                    (childScope.$odd = !(childScope.$even =
                                  (1 & index) == 0)),
                                                    block.scope ||
                                  $transclude(childScope, function (clone) {
                                      (clone[
                                          clone.length++
                                      ] = document.createComment(
                                          " end ngRepeat: " + expression + " ",
                                      )),
                                      $animate.enter(
                                          clone,
                                          null,
                                          jqLite(previousNode),
                                      ),
                                      (previousNode = clone),
                                      (block.scope = childScope),
                                      (block.clone = clone),
                                      (nextBlockMap[block.id] = block);
                                  });
                                                }
                                                lastBlockMap = nextBlockMap;
                                            });
                                        },
                                    };
                                    function getBlockStart(block) {
                                        return block.clone[0];
                                    }
                                    function getBlockEnd(block) {
                                        return block.clone[block.clone.length - 1];
                                    }
                                },
                            ],
                            ngShow: [
                                "$animate",
                                function ($animate) {
                                    return function (scope, element, attr) {
                                        scope.$watch(attr.ngShow, function (value) {
                                            $animate[
                                                toBoolean(value) ? "removeClass" : "addClass"
                                            ](element, "ng-hide");
                                        });
                                    };
                                },
                            ],
                            ngStyle: ngStyleDirective,
                            ngSwitch: [
                                "$animate",
                                function ($animate) {
                                    return {
                                        restrict: "EA",
                                        require: "ngSwitch",
                                        controller: [
                                            "$scope",
                                            function () {
                                                this.cases = {};
                                            },
                                        ],
                                        link: function (
                                            scope,
                                            element,
                                            attr,
                                            ngSwitchController,
                                        ) {
                                            var watchExpr = attr.ngSwitch || attr.on,
                                                selectedTranscludes,
                                                selectedElements,
                                                selectedScopes = [];
                                            scope.$watch(watchExpr, function (value) {
                                                for (
                                                    var i = 0, ii = selectedScopes.length;
                                                    ii > i;
                                                    i++
                                                )
                                                    selectedScopes[i].$destroy(),
                                                    $animate.leave(selectedElements[i]);
                                                (selectedElements = []),
                                                (selectedScopes = []),
                                                (selectedTranscludes =
                                ngSwitchController.cases["!" + value] ||
                                ngSwitchController.cases["?"]) &&
                                (scope.$eval(attr.change),
                                forEach(
                                    selectedTranscludes,
                                    function (selectedTransclude) {
                                        var selectedScope = scope.$new();
                                        selectedScopes.push(selectedScope),
                                        selectedTransclude.transclude(
                                            selectedScope,
                                            function (caseElement) {
                                                var anchor =
                                            selectedTransclude.element;
                                                selectedElements.push(caseElement),
                                                $animate.enter(
                                                    caseElement,
                                                    anchor.parent(),
                                                    anchor,
                                                );
                                            },
                                        );
                                    },
                                ));
                                            });
                                        },
                                    };
                                },
                            ],
                            ngSwitchWhen: ngSwitchWhenDirective,
                            ngSwitchDefault: ngSwitchDefaultDirective,
                            ngOptions: ngOptionsDirective,
                            ngTransclude: ngTranscludeDirective,
                            ngModel: function () {
                                return {
                                    require: ["ngModel", "^?form"],
                                    controller: [
                                        "$scope",
                                        "$exceptionHandler",
                                        "$attrs",
                                        "$element",
                                        "$parse",
                                        function (
                                            $scope,
                                            $exceptionHandler,
                                            $attr,
                                            $element,
                                            $parse,
                                        ) {
                                            (this.$viewValue = Number.NaN),
                                            (this.$modelValue = Number.NaN),
                                            (this.$parsers = []),
                                            (this.$formatters = []),
                                            (this.$viewChangeListeners = []),
                                            (this.$pristine = !0),
                                            (this.$dirty = !1),
                                            (this.$valid = !0),
                                            (this.$invalid = !1),
                                            (this.$name = $attr.name);
                                            var ngModelGet = $parse($attr.ngModel),
                                                ngModelSet = ngModelGet.assign;
                                            if (!ngModelSet)
                                                throw minErr("ngModel")(
                                                    "nonassign",
                                                    "Expression '{0}' is non-assignable. Element: {1}",
                                                    $attr.ngModel,
                                                    startingTag($element),
                                                );
                                            (this.$render = noop),
                                            (this.$isEmpty = function (value) {
                                                return (
                                                    isUndefined(value) ||
                                "" === value ||
                                null === value ||
                                value != value
                                                );
                                            });
                                            var parentForm =
                              $element.inheritedData("$formController") ||
                              nullFormCtrl,
                                                invalidCount = 0,
                                                $error = (this.$error = {});
                                            $element.addClass(PRISTINE_CLASS), toggleValidCss(!0);
                                            function toggleValidCss(isValid, validationErrorKey) {
                                                (validationErrorKey = validationErrorKey
                                                    ? "-" + snake_case(validationErrorKey, "-")
                                                    : ""),
                                                $element
                                                    .removeClass(
                                                        (isValid ? INVALID_CLASS : VALID_CLASS) +
                                    validationErrorKey,
                                                    )
                                                    .addClass(
                                                        (isValid ? VALID_CLASS : INVALID_CLASS) +
                                    validationErrorKey,
                                                    );
                                            }
                                            (this.$setValidity = function (
                                                validationErrorKey,
                                                isValid,
                                            ) {
                                                if ($error[validationErrorKey] === !isValid) return;
                                                if (isValid)
                                                    $error[validationErrorKey] && invalidCount--,
                                                    invalidCount ||
                                  (toggleValidCss(!0),
                                  (this.$valid = !0),
                                  (this.$invalid = !1));
                                                else
                                                    toggleValidCss(!1),
                                                    (this.$invalid = !0),
                                                    (this.$valid = !1),
                                                    invalidCount++;
                                                ($error[validationErrorKey] = !isValid),
                                                toggleValidCss(isValid, validationErrorKey),
                                                parentForm.$setValidity(
                                                    validationErrorKey,
                                                    isValid,
                                                    this,
                                                );
                                            }),
                                            (this.$setPristine = function () {
                                                (this.$dirty = !1),
                                                (this.$pristine = !0),
                                                $element
                                                    .removeClass(DIRTY_CLASS)
                                                    .addClass(PRISTINE_CLASS);
                                            }),
                                            (this.$setViewValue = function (value) {
                                                (this.$viewValue = value),
                                                this.$pristine &&
                                  ((this.$dirty = !0),
                                  (this.$pristine = !1),
                                  $element
                                      .removeClass(PRISTINE_CLASS)
                                      .addClass(DIRTY_CLASS),
                                  parentForm.$setDirty()),
                                                forEach(this.$parsers, function (fn) {
                                                    value = fn(value);
                                                }),
                                                this.$modelValue !== value &&
                                  ((this.$modelValue = value),
                                  ngModelSet($scope, value),
                                  forEach(
                                      this.$viewChangeListeners,
                                      function (listener) {
                                          try {
                                              listener();
                                          } catch (e) {
                                              $exceptionHandler(e);
                                          }
                                      },
                                  ));
                                            });
                                            var ctrl = this;
                                            $scope.$watch(function () {
                                                var value = ngModelGet($scope);
                                                if (ctrl.$modelValue !== value) {
                                                    var formatters = ctrl.$formatters,
                                                        idx = formatters.length;
                                                    for (ctrl.$modelValue = value; idx--; )
                                                        value = formatters[idx](value);
                                                    ctrl.$viewValue !== value &&
                                ((ctrl.$viewValue = value), ctrl.$render());
                                                }
                                                return value;
                                            });
                                        },
                                    ],
                                    link: function (scope, element, attr, ctrls) {
                                        var modelCtrl = ctrls[0],
                                            formCtrl = ctrls[1] || nullFormCtrl;
                                        formCtrl.$addControl(modelCtrl),
                                        scope.$on("$destroy", function () {
                                            formCtrl.$removeControl(modelCtrl);
                                        });
                                    },
                                };
                            },
                            ngList: function () {
                                return {
                                    require: "ngModel",
                                    link: function (scope, element, attr, ctrl) {
                                        var match = /\/(.*)\//.exec(attr.ngList),
                                            separator =
                            (match && new RegExp(match[1])) ||
                            attr.ngList ||
                            ",";
                                        ctrl.$parsers.push(function (viewValue) {
                                            if (isUndefined(viewValue)) return;
                                            var list = [];
                                            return (
                                                viewValue &&
                              forEach(
                                  viewValue.split(separator),
                                  function (value) {
                                      value && list.push(trim(value));
                                  },
                              ),
                                                list
                                            );
                                        }),
                                        ctrl.$formatters.push(function (value) {
                                            if (isArray(value)) return value.join(", ");
                                        }),
                                        (ctrl.$isEmpty = function (value) {
                                            return !value || !value.length;
                                        });
                                    },
                                };
                            },
                            ngChange: ngChangeDirective,
                            required: requiredDirective,
                            ngRequired: requiredDirective,
                            ngValue: function () {
                                return {
                                    priority: 100,
                                    compile: function (tpl, tplAttr) {
                                        if (/^(true|false|\d+)$/.test(tplAttr.ngValue))
                                            return function (scope, elm, attr) {
                                                attr.$set("value", scope.$eval(attr.ngValue));
                                            };
                                        return function (scope, elm, attr) {
                                            scope.$watch(attr.ngValue, function (value) {
                                                attr.$set("value", value);
                                            });
                                        };
                                    },
                                };
                            },
                        })
                        .directive({
                            ngInclude: [
                                "$compile",
                                function ($compile) {
                                    return {
                                        restrict: "ECA",
                                        priority: -400,
                                        require: "ngInclude",
                                        link: function (scope, $element, $attr, ctrl) {
                                            $element.html(ctrl.template),
                                            $compile($element.contents())(scope);
                                        },
                                    };
                                },
                            ],
                        })
                        .directive(ngAttributeAliasDirectives)
                        .directive(ngEventDirectives),
                    $provide.provider({
                        $anchorScroll: $AnchorScrollProvider,
                        $animate: [
                            "$provide",
                            function ($provide1) {
                                (this.$$selectors = {}),
                                (this.register = function (name, factory) {
                                    var key = name + "-animation";
                                    if (name && name.charAt(0) != ".")
                                        throw $animateMinErr(
                                            "notcsel",
                                            "Expecting class selector starting with '.' got '{0}'.",
                                            name,
                                        );
                                    (this.$$selectors[name.substr(1)] = key),
                                    $provide1.factory(key, factory);
                                }),
                                (this.$get = [
                                    "$timeout",
                                    function ($timeout) {
                                        return {
                                            enter: function (element, parent, after, done) {
                                                if (after) after.after(element);
                                                else
                                                    (!parent || !parent[0]) &&
                                  (parent = after.parent()),
                                                    parent.append(element);
                                                done && $timeout(done, 0, !1);
                                            },
                                            leave: function (element, done) {
                                                element.remove(), done && $timeout(done, 0, !1);
                                            },
                                            move: function (element, parent, after, done) {
                                                this.enter(element, parent, after, done);
                                            },
                                            addClass: function (element, className, done) {
                                                (className = isString(className)
                                                    ? className
                                                    : isArray(className)
                                                        ? className.join(" ")
                                                        : ""),
                                                forEach(element, function (element) {
                                                    jqLiteAddClass(element, className);
                                                }),
                                                done && $timeout(done, 0, !1);
                                            },
                                            removeClass: function (element, className, done) {
                                                (className = isString(className)
                                                    ? className
                                                    : isArray(className)
                                                        ? className.join(" ")
                                                        : ""),
                                                forEach(element, function (element) {
                                                    jqLiteRemoveClass(element, className);
                                                }),
                                                done && $timeout(done, 0, !1);
                                            },
                                            enabled: noop,
                                        };
                                    },
                                ]);
                            },
                        ],
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
                        $window: $WindowProvider,
                    });
                },
            ],
        );
    })(angular),
    jqLite(document).ready(function () {
        angularInit(document, bootstrap);
    });
})(window, document),
angular.$$csp() ||
    angular
        .element(document)
        .find("head")
        .prepend(
            '<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-start{border-spacing:1px 1px;-ms-zoom:1.0001;}.ng-animate-active{border-spacing:0px 0px;-ms-zoom:1;}</style>',
        );
