!(function (
    window, undefined
) {
    var readyList,
        rootjQuery,
        document = window.document,
        location = window.location,
        _jQuery = window.jQuery,
        _$ = window.$,
        class2type = {
        },
        core_deletedIds = [],
        core_concat = core_deletedIds.concat,
        core_push = core_deletedIds.push,
        core_slice = core_deletedIds.slice,
        core_indexOf = core_deletedIds.indexOf,
        core_hasOwn = class2type.hasOwnProperty,
        core_trim = "1.9.1".trim,
        jQuery = function (
            selector, context
        ) {
            return new jQuery.fn.init(
                selector,
                context,
                rootjQuery
            );
        },
        core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        core_rnotwhite = /\S+/g,
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,
        completed = function (
            event
        ) {
            (document.addEventListener ||
        "load" === event.type ||
        "complete" === document.readyState) &&
        (detach(
        ), jQuery.ready(
        ));
        },
        detach = function (
        ) {
            document.addEventListener
                ? (document.removeEventListener(
                    "DOMContentLoaded",
                    completed,
                    !1
                ),
                window.removeEventListener(
                    "load",
                    completed,
                    !1
                ))
                : (document.detachEvent(
                    "onreadystatechange",
                    completed
                ),
                window.detachEvent(
                    "onload",
                    completed
                ));
        };
    (jQuery.fn = jQuery.prototype = {
        jquery: "1.9.1",
        constructor: jQuery,
        init: function (
            selector, context, rootjQuery1
        ) {
            var match, elem;
            if (!selector) return this;
            if ("string" == typeof selector) {
                if (
                    ((match =
            "<" === selector.charAt(
                0
            ) &&
            ">" === selector.charAt(
                selector.length - 1
            ) &&
            selector.length >= 3
                ? [null, selector, null,]
                : /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/.exec(
                    selector
                )),
                    match && (match[1] || !context))
                ) {
                    if (match[1]) {
                        if (
                            ((context = context instanceof jQuery ? context[0] : context),
                            jQuery.merge(
                                this,
                                jQuery.parseHTML(
                                    match[1],
                                    context && context.nodeType
                                        ? context.ownerDocument || context
                                        : document,
                                    !0,
                                ),
                            ),
                            rsingleTag.test(
                                match[1]
                            ) && jQuery.isPlainObject(
                                context
                            ))
                        )
                            for (match in context)
                                jQuery.isFunction(
                                    this[match]
                                )
                                    ? this[match](
                                        context[match]
                                    )
                                    : this.attr(
                                        match,
                                        context[match]
                                    );
                        return this;
                    } else {
                        if (
                            ((elem = document.getElementById(
                                match[2]
                            )),
                            elem && elem.parentNode)
                        ) {
                            if (elem.id !== match[2]) return rootjQuery1.find(
                                selector
                            );
                            (this.length = 1), (this[0] = elem);
                        }
                        return (this.context = document), (this.selector = selector), this;
                    }
                } else if (!context || context.jquery)
                    return (context || rootjQuery1).find(
                        selector
                    );
                else return this.constructor(
                    context
                ).find(
                    selector
                );
            } else if (selector.nodeType)
                return (this.context = this[0] = selector), (this.length = 1), this;
            else if (jQuery.isFunction(
                selector
            )) return rootjQuery1.ready(
                selector
            );
            return (
                selector.selector !== void 0 &&
          ((this.selector = selector.selector),
          (this.context = selector.context)),
                jQuery.makeArray(
                    selector,
                    this
                )
            );
        },
        selector: "",
        length: 0,
        size: function (
        ) {
            return this.length;
        },
        toArray: function (
        ) {
            return core_slice.call(
                this
            );
        },
        get: function (
            num
        ) {
            return null == num
                ? this.toArray(
                )
                : 0 > num
                    ? this[this.length + num]
                    : this[num];
        },
        pushStack: function (
            elems
        ) {
            var ret = jQuery.merge(
                this.constructor(
                ),
                elems
            );
            return (ret.prevObject = this), (ret.context = this.context), ret;
        },
        each: function (
            callback, args
        ) {
            return jQuery.each(
                this,
                callback,
                args
            );
        },
        ready: function (
            fn
        ) {
            return jQuery.ready.promise(
            ).done(
                fn
            ), this;
        },
        slice: function (
        ) {
            return this.pushStack(
                core_slice.apply(
                    this,
                    arguments
                )
            );
        },
        first: function (
        ) {
            return this.eq(
                0
            );
        },
        last: function (
        ) {
            return this.eq(
                -1
            );
        },
        eq: function (
            i
        ) {
            var len = this.length,
                j = +i + (0 > i ? len : 0);
            return this.pushStack(
                j >= 0 && len > j ? [this[j],] : []
            );
        },
        map: function (
            callback
        ) {
            return this.pushStack(
                jQuery.map(
                    this,
                    function (
                        elem, i
                    ) {
                        return callback.call(
                            elem,
                            i,
                            elem
                        );
                    }
                ),
            );
        },
        end: function (
        ) {
            return this.prevObject || this.constructor(
                null
            );
        },
        push: core_push,
        sort: [].sort,
        splice: [].splice,
    }),
    (jQuery.fn.init.prototype = jQuery.fn),
    (jQuery.extend = jQuery.fn.extend = function (
    ) {
        var src,
            copyIsArray,
            copy,
            name,
            options,
            clone,
            target = arguments[0] || {
            },
            i = 1,
            length = arguments.length,
            deep = !1;
        for (
            "boolean" == typeof target &&
          ((deep = target), (target = arguments[1] || {
          }), (i = 2)),
            "object" == typeof target ||
            jQuery.isFunction(
                target
            ) ||
            (target = {
            }),
            i === length && ((target = this), --i);
            length > i;
            i++
        )
            if (null != (options = arguments[i]))
                for (name in options) {
                    if (((src = target[name]), (copy = options[name]), copy === target))
                        continue;
                    deep &&
            copy &&
            (jQuery.isPlainObject(
                copy
            ) || (copyIsArray = jQuery.isArray(
                copy
            )))
                        ? (copyIsArray
                            ? ((copyIsArray = !1),
                            (clone = src && jQuery.isArray(
                                src
                            )
                                ? src
                                : []))
                            : (clone = src && jQuery.isPlainObject(
                                src
                            )
                                ? src
                                : {
                                }),
                        (target[name] = jQuery.extend(
                            deep,
                            clone,
                            copy
                        )))
                        : void 0 !== copy && (target[name] = copy);
                }
        return target;
    }),
    jQuery.extend(
        {
            noConflict: function (
                deep
            ) {
                return (
                    window.$ === jQuery && (window.$ = _$),
                    deep && window.jQuery === jQuery && (window.jQuery = _jQuery),
                    jQuery
                );
            },
            isReady: !1,
            readyWait: 1,
            holdReady: function (
                hold
            ) {
                hold
                    ? jQuery.readyWait++
                    : jQuery.ready(
                        !0
                    );
            },
            ready: function (
                wait
            ) {
                return (!0 === wait ? --jQuery.readyWait : jQuery.isReady)
                    ? void 0
                    : !document.body
                        ? setTimeout(
                            jQuery.ready
                        )
                        : ((jQuery.isReady = !0), !0 !== wait && --jQuery.readyWait > 0)
                            ? void 0
                            : void (readyList.resolveWith(
                                document,
                                [jQuery,]
                            ),
                            jQuery.fn.trigger &&
              jQuery(
                  document
              ).trigger(
                  "ready"
              ).off(
                  "ready"
              ));
            },
            isFunction: function (
                obj
            ) {
                return "function" === jQuery.type(
                    obj
                );
            },
            isArray:
        Array.isArray ||
        function (
            obj
        ) {
            return "array" === jQuery.type(
                obj
            );
        },
            isWindow: function (
                obj
            ) {
                return null != obj && obj == obj.window;
            },
            isNumeric: function (
                obj
            ) {
                return !isNaN(
                    parseFloat(
                        obj
                    )
                ) && isFinite(
                    obj
                );
            },
            type: function (
                obj
            ) {
                return null == obj
                    ? String(
                        obj
                    )
                    : "object" == typeof obj || "function" == typeof obj
                        ? class2type[class2type.toString.call(
                            obj
                        )] || "object"
                        : typeof obj;
            },
            isPlainObject: function (
                obj
            ) {
                if (
                    !obj ||
          "object" !== jQuery.type(
              obj
          ) ||
          obj.nodeType ||
          jQuery.isWindow(
              obj
          )
                )
                    return !1;
                try {
                    if (
                        obj.constructor &&
            !core_hasOwn.call(
                obj,
                "constructor"
            ) &&
            !core_hasOwn.call(
                obj.constructor.prototype,
                "isPrototypeOf"
            )
                    )
                        return !1;
                } catch (e) {
                    return !1;
                }
                var key;
                for (key in obj);
                return void 0 === key || core_hasOwn.call(
                    obj,
                    key
                );
            },
            isEmptyObject: function (
                obj
            ) {
                var name;
                for (name in obj) return !1;
                return !0;
            },
            error: function (
                msg
            ) {
                throw new Error(
                    msg
                );
            },
            parseHTML: function (
                data, context, keepScripts
            ) {
                if (!data || "string" !== typeof data) return null;
                "boolean" == typeof context &&
          ((keepScripts = context), (context = !1)),
                (context ||= document);
                var parsed = rsingleTag.exec(
                        data
                    ),
                    scripts = !keepScripts && [];
                return parsed
                    ? [context.createElement(
                        parsed[1]
                    ),]
                    : ((parsed = jQuery.buildFragment(
                        [data,],
                        context,
                        scripts
                    )),
                    scripts && jQuery(
                        scripts
                    ).remove(
                    ),
                    jQuery.merge(
                        [],
                        parsed.childNodes
                    ));
            },
            parseJSON: function (
                data
            ) {
                return window.JSON && window.JSON.parse
                    ? window.JSON.parse(
                        data
                    )
                    : null === data
                        ? data
                        : "string" == typeof data
                            ? (data = jQuery.trim(
                                data
                            ))
                                ? /^[\],:{}\s]*$/.test(
                                    data
                                        .replace(
                                            rvalidescape,
                                            "@"
                                        )
                                        .replace(
                                            rvalidtokens,
                                            "]"
                                        )
                                        .replace(
                                            rvalidbraces,
                                            ""
                                        ),
                                )
                                    ? new Function(
                                        "return " + data
                                    )(
                                    )
                                    : void 0
                                : void 0
                            : void jQuery.error(
                                "Invalid JSON: " + data
                            );
            },
            parseXML: function (
                data
            ) {
                var xml, tmp;
                if (!data || "string" !== typeof data) return null;
                try {
                    window.DOMParser
                        ? ((tmp = new DOMParser(
                        )),
                        (xml = tmp.parseFromString(
                            data,
                            "text/xml"
                        )))
                        : ((xml = new ActiveXObject(
                            "Microsoft.XMLDOM"
                        )),
                        (xml.async = "false"),
                        xml.loadXML(
                            data
                        ));
                } catch (e) {
                    xml = void 0;
                }
                return (
                    (!xml ||
            !xml.documentElement ||
            xml.getElementsByTagName(
                "parsererror"
            ).length) &&
            jQuery.error(
                "Invalid XML: " + data
            ),
                    xml
                );
            },
            noop: function (
            ) {},
            globalEval: function (
                data
            ) {
                data &&
          jQuery.trim(
              data
          ) &&
          (
              window.execScript ||
            function (
                data
            ) {
                window.eval.call(
                    window,
                    data
                );
            }
          )(
              data
          );
            },
            camelCase: function (
                string
            ) {
                return string
                    .replace(
                        rmsPrefix,
                        "ms-"
                    )
                    .replace(
                        rdashAlpha,
                        function (
                            all, letter
                        ) {
                            return letter.toUpperCase(
                            );
                        }
                    );
            },
            nodeName: function (
                elem, name
            ) {
                return (
                    elem.nodeName && elem.nodeName.toLowerCase(
                    ) === name.toLowerCase(
                    )
                );
            },
            each: function (
                obj, callback, args
            ) {
                var value,
                    i = 0,
                    length = obj.length,
                    isArray = isArraylike(
                        obj
                    );
                if (args) {
                    if (isArray)
                        for (; length > i; i++)
                            if (((value = callback.apply(
                                obj[i],
                                args
                            )), !1 === value)) break;
                            else
                                for (i in obj)
                                    if (((value = callback.apply(
                                        obj[i],
                                        args
                                    )), !1 === value))
                                        break;
                } else if (isArray)
                    for (; length > i; i++)
                        if (((value = callback.call(
                            obj[i],
                            i,
                            obj[i]
                        )), !1 === value))
                            break;
                        else
                            for (i in obj)
                                if (((value = callback.call(
                                    obj[i],
                                    i,
                                    obj[i]
                                )), !1 === value))
                                    break;
                return obj;
            },
            trim:
        core_trim && !core_trim.call(
            "\uFEFF\xA0"
        )
            ? function (
                text
            ) {
                return null == text
                    ? ""
                    : core_trim.call(
                        text
                    );
            }
            : function (
                text
            ) {
                return null == text
                    ? ""
                    : (text + "").replace(
                        rtrim,
                        ""
                    );
            },
            makeArray: function (
                arr, results
            ) {
                var ret = results || [];
                return (
                    null != arr &&
            (isArraylike(
                Object(
                    arr
                )
            )
                ? jQuery.merge(
                    ret,
                    "string" == typeof arr ? [arr,] : arr
                )
                : core_push.call(
                    ret,
                    arr
                )),
                    ret
                );
            },
            inArray: function (
                elem, arr, i
            ) {
                if (arr) {
                    if (core_indexOf) return core_indexOf.call(
                        arr,
                        elem,
                        i
                    );
                    for (
                        i = i
                            ? (0 > i
                                ? Math.max(
                                    0,
                                    arr.length + i
                                )
                                : i)
                            : 0;
                        i < arr.length;
                        i++
                    )
                        if (i in arr && arr[i] === elem) return i;
                }
                return -1;
            },
            merge: function (
                first, second
            ) {
                var l = second.length,
                    i = first.length,
                    j = 0;
                if ("number" == typeof l) for (; l > j; j++) first[i++] = second[j];
                else for (; second[j] !== void 0; ) first[i++] = second[j++];
                return (first.length = i), first;
            },
            grep: function (
                elems, callback, inv
            ) {
                var retVal,
                    ret = [],
                    i = 0,
                    length = elems.length;
                for (inv = !!inv; length > i; i++)
                    (retVal = !!callback(
                        elems[i],
                        i
                    )),
                    inv !== retVal && ret.push(
                        elems[i]
                    );
                return ret;
            },
            map: function (
                elems, callback, arg
            ) {
                var value,
                    i = 0,
                    length = elems.length,
                    isArray = isArraylike(
                        elems
                    ),
                    ret = [];
                if (isArray)
                    for (; length > i; i++)
                        (value = callback(
                            elems[i],
                            i,
                            arg
                        )),
                        null != value && (ret[ret.length] = value);
                else
                    for (i in elems)
                        (value = callback(
                            elems[i],
                            i,
                            arg
                        )),
                        null != value && (ret[ret.length] = value);
                return core_concat.apply(
                    [],
                    ret
                );
            },
            guid: 1,
            proxy: function (
                fn, context
            ) {
                var args, proxy, tmp;
                return ("string" == typeof context &&
          ((tmp = fn[context]), (context = fn), (fn = tmp)),
                !jQuery.isFunction(
                    fn
                ))
                    ? void 0
                    : ((args = core_slice.call(
                        arguments,
                        2
                    )),
                    (proxy = function (
                    ) {
                        return fn.apply(
                            context || this,
                            args.concat(
                                core_slice.call(
                                    arguments
                                )
                            ),
                        );
                    }),
                    (proxy.guid = fn.guid = fn.guid || jQuery.guid++),
                    proxy);
            },
            access: function (
                elems, fn, key, value, chainable, emptyGet, raw
            ) {
                var i = 0,
                    length = elems.length,
                    bulk = null == key;
                if ("object" === jQuery.type(
                    key
                )) {
                    chainable = !0;
                    for (i in key) jQuery.access(
                        elems,
                        fn,
                        i,
                        key[i],
                        !0,
                        emptyGet,
                        raw
                    );
                } else if (void 0 !== value) {
                    if (
                        ((chainable = !0),
                        jQuery.isFunction(
                            value
                        ) || (raw = !0),
                        bulk &&
              (raw
                  ? (fn.call(
                      elems,
                      value
                  ), (fn = null))
                  : ((bulk = fn),
                  (fn = function (
                      elem, key, value
                  ) {
                      return bulk.call(
                          jQuery(
                              elem
                          ),
                          value
                      );
                  }))),
                        fn)
                    )
                        for (; length > i; i++)
                            fn(
                                elems[i],
                                key,
                                raw
                                    ? value
                                    : value.call(
                                        elems[i],
                                        i,
                                        fn(
                                            elems[i],
                                            key
                                        )
                                    ),
                            );
                }
                return chainable
                    ? elems
                    : bulk
                        ? fn.call(
                            elems
                        )
                        : length
                            ? fn(
                                elems[0],
                                key
                            )
                            : emptyGet;
            },
            now: function (
            ) {
                return new Date(
                ).getTime(
                );
            },
        }
    ),
    (jQuery.ready.promise = function (
        obj
    ) {
        if (!readyList) {
            if (
                ((readyList = jQuery.Deferred(
                )), "complete" === document.readyState)
            )
                setTimeout(
                    jQuery.ready
                );
            else if (document.addEventListener)
                document.addEventListener(
                    "DOMContentLoaded",
                    completed,
                    !1
                ),
                window.addEventListener(
                    "load",
                    completed,
                    !1
                );
            else {
                document.attachEvent(
                    "onreadystatechange",
                    completed
                ),
                window.attachEvent(
                    "onload",
                    completed
                );
                var top = !1;
                try {
                    top = null == window.frameElement && document.documentElement;
                } catch (e) {}
                top &&
            top.doScroll &&
            (function doScrollCheck(
            ) {
                if (!jQuery.isReady) {
                    try {
                        top.doScroll(
                            "left"
                        );
                    } catch (e) {
                        return setTimeout(
                            doScrollCheck,
                            50
                        );
                    }
                    detach(
                    ), jQuery.ready(
                    );
                }
            })(
            );
            }
        }
        return readyList.promise(
            obj
        );
    }),
    jQuery.each(
        "Boolean Number String Function Array Date RegExp Object Error".split(
            " ",
        ),
        function (
            i, name
        ) {
            class2type["[object " + name + "]"] = name.toLowerCase(
            );
        },
    );
    function isArraylike(
        obj
    ) {
        var length = obj.length,
            type = jQuery.type(
                obj
            );
        return jQuery.isWindow(
            obj
        )
            ? !1
            : 1 === obj.nodeType && length
                ? !0
                : "array" === type ||
        ("function" !== type &&
          (0 === length ||
            ("number" == typeof length && length > 0 && length - 1 in obj)));
    }
    rootjQuery = jQuery(
        document
    );
    var optionsCache = {
    };
    function createOptions(
        options
    ) {
        var object = (optionsCache[options] = {
        });
        return (
            jQuery.each(
                options.match(
                    core_rnotwhite
                ) || [],
                function (
                    _, flag
                ) {
                    object[flag] = !0;
                }
            ),
            object
        );
    }
    (jQuery.Callbacks = function (
        options
    ) {
        options =
      "string" == typeof options
          ? optionsCache[options] || createOptions(
              options
          )
          : jQuery.extend(
              {
              },
              options
          );
        var firing,
            memory,
            fired,
            firingLength,
            firingIndex,
            firingStart,
            list = [],
            stack = !options.once && [],
            fire = function (
                data
            ) {
                for (
                    memory = options.memory && data,
                    fired = !0,
                    firingIndex = firingStart || 0,
                    firingStart = 0,
                    firingLength = list.length,
                    firing = !0;
                    list && firingLength > firingIndex;
                    firingIndex++
                )
                    if (
                        list[firingIndex].apply(
                            data[0],
                            data[1]
                        ) === !1 &&
            options.stopOnFalse
                    ) {
                        memory = !1;
                        break;
                    }
                (firing = !1),
                list &&
            (stack
                ? stack.length && fire(
                    stack.shift(
                    )
                )
                : memory
                    ? (list = [])
                    : self.disable(
                    ));
            },
            self = {
                add: function (
                ) {
                    return (
                        list &&
              ((function add(
                  args
              ) {
                  jQuery.each(
                      arguments,
                      function (
                          _, arg
                      ) {
                          var type = jQuery.type(
                              arg
                          );
                          "function" === type
                              ? (!options.unique || !self.has(
                                  arg
                              )) && list.push(
                                  arg
                              )
                              : arg && arg.length && "string" !== type && add(
                                  arg
                              );
                      }
                  );
              })(
                  arguments
              ),
              firing
                  ? (firingLength = list.length)
                  : memory && ((firingStart = list.length), fire(
                      memory
                  ))),
                        this
                    );
                },
                remove: function (
                ) {
                    return (
                        list &&
              jQuery.each(
                  arguments,
                  function (
                      _, arg
                  ) {
                      for (
                          var index;
                          (index = jQuery.inArray(
                              arg,
                              list,
                              index
                          )) > -1;

                      )
                          list.splice(
                              index,
                              1
                          ),
                          firing &&
                      (firingLength >= index && firingLength--,
                      firingIndex >= index && firingIndex--);
                  }
              ),
                        this
                    );
                },
                has: function (
                    fn
                ) {
                    return fn
                        ? jQuery.inArray(
                            fn,
                            list
                        ) > -1
                        : !(!list || !list.length);
                },
                empty: function (
                ) {
                    return (list = []), this;
                },
                disable: function (
                ) {
                    return (list = stack = memory = void 0), this;
                },
                disabled: function (
                ) {
                    return !list;
                },
                lock: function (
                ) {
                    return (stack = void 0), memory || self.disable(
                    ), this;
                },
                locked: function (
                ) {
                    return !stack;
                },
                fireWith: function (
                    context, args
                ) {
                    return (
                        (args ||= []),
                        (args = [context, args.slice
                            ? args.slice(
                            )
                            : args,]),
                        list &&
              (!fired || stack) &&
              (firing
                  ? stack.push(
                      args
                  )
                  : fire(
                      args
                  )),
                        this
                    );
                },
                fire: function (
                ) {
                    return self.fireWith(
                        this,
                        arguments
                    ), this;
                },
                fired: function (
                ) {
                    return !!fired;
                },
            };
        return self;
    }),
    jQuery.extend(
        {
            Deferred: function (
                func
            ) {
                var tuples = [
                        ["resolve", "done", jQuery.Callbacks(
                            "once memory"
                        ), "resolved",],
                        ["reject", "fail", jQuery.Callbacks(
                            "once memory"
                        ), "rejected",],
                        ["notify", "progress", jQuery.Callbacks(
                            "memory"
                        ),],
                    ],
                    state = "pending",
                    promise = {
                        state: function (
                        ) {
                            return state;
                        },
                        always: function (
                        ) {
                            return deferred.done(
                                arguments
                            ).fail(
                                arguments
                            ), this;
                        },
                        then: function (
                        ) {
                            var fns = arguments;
                            return jQuery
                                .Deferred(
                                    function (
                                        newDefer
                                    ) {
                                        jQuery.each(
                                            tuples,
                                            function (
                                                i, tuple
                                            ) {
                                                var action = tuple[0],
                                                    fn = jQuery.isFunction(
                                                        fns[i]
                                                    ) && fns[i];
                                                deferred[tuple[1]](
                                                    function (
                                                    ) {
                                                        var returned = fn && fn.apply(
                                                            this,
                                                            arguments
                                                        );
                                                        returned && jQuery.isFunction(
                                                            returned.promise
                                                        )
                                                            ? returned
                                                                .promise(
                                                                )
                                                                .done(
                                                                    newDefer.resolve
                                                                )
                                                                .fail(
                                                                    newDefer.reject
                                                                )
                                                                .progress(
                                                                    newDefer.notify
                                                                )
                                                            : newDefer[action + "With"](
                                                                this === promise
                                                                    ? newDefer.promise(
                                                                    )
                                                                    : this,
                                                                fn ? [returned,] : arguments,
                                                            );
                                                    }
                                                );
                                            }
                                        ),
                                        (fns = null);
                                    }
                                )
                                .promise(
                                );
                        },
                        promise: function (
                            obj
                        ) {
                            return null != obj
                                ? jQuery.extend(
                                    obj,
                                    promise
                                )
                                : promise;
                        },
                    },
                    deferred = {
                    };
                return (
                    (promise.pipe = promise.then),
                    jQuery.each(
                        tuples,
                        function (
                            i, tuple
                        ) {
                            var list = tuple[2],
                                stateString = tuple[3];
                            (promise[tuple[1]] = list.add),
                            stateString &&
                list.add(
                    function (
                    ) {
                        state = stateString;
                    },
                    tuples[1 ^ i][2].disable,
                    tuples[2][2].lock,
                ),
                            (deferred[tuple[0]] = function (
                            ) {
                                return (
                                    deferred[tuple[0] + "With"](
                                        this === deferred ? promise : this,
                                        arguments,
                                    ),
                                    this
                                );
                            }),
                            (deferred[tuple[0] + "With"] = list.fireWith);
                        }
                    ),
                    promise.promise(
                        deferred
                    ),
                    func && func.call(
                        deferred,
                        deferred
                    ),
                    deferred
                );
            },
            when: function (
                subordinate
            ) {
                var i = 0,
                    resolveValues = core_slice.call(
                        arguments
                    ),
                    length = resolveValues.length,
                    remaining =
            1 !== length ||
            (subordinate && jQuery.isFunction(
                subordinate.promise
            ))
                ? length
                : 0,
                    deferred = 1 === remaining
                        ? subordinate
                        : jQuery.Deferred(
                        ),
                    updateFunc = function (
                        i1, contexts, values
                    ) {
                        return function (
                            value
                        ) {
                            (contexts[i1] = this),
                            (values[i1] =
                  arguments.length > 1
                      ? core_slice.call(
                          arguments
                      )
                      : value),
                            progressValues === values
                                ? deferred.notifyWith(
                                    contexts,
                                    values
                                )
                                : !--remaining && deferred.resolveWith(
                                    contexts,
                                    values
                                );
                        };
                    },
                    progressValues,
                    progressContexts,
                    resolveContexts;
                if (length > 1)
                    for (
                        progressValues = new Array(
                            length
                        ),
                        progressContexts = new Array(
                            length
                        ),
                        resolveContexts = new Array(
                            length
                        );
                        length > i;
                        i++
                    )
                        resolveValues[i] && jQuery.isFunction(
                            resolveValues[i].promise
                        )
                            ? resolveValues[i]
                                .promise(
                                )
                                .done(
                                    updateFunc(
                                        i,
                                        resolveContexts,
                                        resolveValues
                                    )
                                )
                                .fail(
                                    deferred.reject
                                )
                                .progress(
                                    updateFunc(
                                        i,
                                        progressContexts,
                                        progressValues
                                    )
                                )
                            : --remaining;
                return (
                    remaining || deferred.resolveWith(
                        resolveContexts,
                        resolveValues
                    ),
                    deferred.promise(
                    )
                );
            },
        }
    ),
    (jQuery.support = (function (
    ) {
        var support,
            all,
            a,
            input,
            select,
            fragment,
            opt,
            eventName,
            isSupported,
            i,
            div = document.createElement(
                "div"
            );
        if (
            (div.setAttribute(
                "className",
                "t"
            ),
            (div.innerHTML =
          "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
            (all = div.getElementsByTagName(
                "*"
            )),
            (a = div.getElementsByTagName(
                "a"
            )[0]),
            !all || !a || !all.length)
        )
            return {
            };
        (select = document.createElement(
            "select"
        )),
        (opt = select.appendChild(
            document.createElement(
                "option"
            )
        )),
        (input = div.getElementsByTagName(
            "input"
        )[0]),
        (a.style.cssText = "top:1px;float:left;opacity:.5"),
        (support = {
            getSetAttribute: "t" !== div.className,
            leadingWhitespace: div.firstChild.nodeType === 3,
            tbody: !div.getElementsByTagName(
                "tbody"
            ).length,
            htmlSerialize: !!div.getElementsByTagName(
                "link"
            ).length,
            style: /top/.test(
                a.getAttribute(
                    "style"
                )
            ),
            hrefNormalized: "/a" === a.getAttribute(
                "href"
            ),
            opacity: /^0.5/.test(
                a.style.opacity
            ),
            cssFloat: !!a.style.cssFloat,
            checkOn: !!input.value,
            optSelected: opt.selected,
            enctype: !!document.createElement(
                "form"
            ).enctype,
            html5Clone:
            document.createElement(
                "nav"
            ).cloneNode(
                !0
            ).outerHTML !==
            "<:nav></:nav>",
            boxModel: "CSS1Compat" === document.compatMode,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            boxSizingReliable: !0,
            pixelPosition: !1,
        }),
        (input.checked = !0),
        (support.noCloneChecked = input.cloneNode(
            !0
        ).checked),
        (select.disabled = !0),
        (support.optDisabled = !opt.disabled);
        try {
            delete div.test;
        } catch (e) {
            support.deleteExpando = !1;
        }
        (input = document.createElement(
            "input"
        )),
        input.setAttribute(
            "value",
            ""
        ),
        (support.input = "" === input.getAttribute(
            "value"
        )),
        (input.value = "t"),
        input.setAttribute(
            "type",
            "radio"
        ),
        (support.radioValue = "t" === input.value),
        input.setAttribute(
            "checked",
            "t"
        ),
        input.setAttribute(
            "name",
            "t"
        ),
        (fragment = document.createDocumentFragment(
        )),
        fragment.appendChild(
            input
        ),
        (support.appendChecked = input.checked),
        (support.checkClone = fragment
            .cloneNode(
                !0
            )
            .cloneNode(
                !0
            ).lastChild.checked),
        div.attachEvent &&
          (div.attachEvent(
              "onclick",
              function (
              ) {
                  support.noCloneEvent = !1;
              }
          ),
          div.cloneNode(
              !0
          ).click(
          ));
        for (i in {
            submit: !0,
            change: !0,
            focusin: !0,
        })
            div.setAttribute(
                (eventName = "on" + i),
                "t"
            ),
            (support[i + "Bubbles"] =
            eventName in window || div.attributes[eventName].expando === !1);
        return (
            (div.style.backgroundClip = "content-box"),
            (div.cloneNode(
                !0
            ).style.backgroundClip = ""),
            (support.clearCloneStyle = div.style.backgroundClip === "content-box"),
            jQuery(
                function (
                ) {
                    var container,
                        marginDiv,
                        tds,
                        body = document.getElementsByTagName(
                            "body"
                        )[0];
                    if (!body) return;
                    (container = document.createElement(
                        "div"
                    )),
                    (container.style.cssText =
              "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px"),
                    body.appendChild(
                        container
                    ).appendChild(
                        div
                    ),
                    (div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>"),
                    (tds = div.getElementsByTagName(
                        "td"
                    )),
                    (tds[0].style.cssText = "padding:0;margin:0;border:0;display:none"),
                    (isSupported = tds[0].offsetHeight === 0),
                    (tds[0].style.display = ""),
                    (tds[1].style.display = "none"),
                    (support.reliableHiddenOffsets =
              isSupported && tds[0].offsetHeight === 0),
                    (div.innerHTML = ""),
                    (div.style.cssText =
              "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;"),
                    (support.boxSizing = 4 === div.offsetWidth),
                    (support.doesNotIncludeMarginInBodyOffset = 1 !== body.offsetTop),
                    window.getComputedStyle &&
              ((support.pixelPosition =
                (window.getComputedStyle(
                    div,
                    null
                ) || {
                }).top !== "1%"),
              (support.boxSizingReliable =
                (
                    window.getComputedStyle(
                        div,
                        null
                    ) || {
                        width: "4px",
                    }
                ).width === "4px"),
              (marginDiv = div.appendChild(
                  document.createElement(
                      "div"
                  )
              )),
              (marginDiv.style.cssText = div.style.cssText =
                "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;"),
              (marginDiv.style.marginRight = marginDiv.style.width = "0"),
              (div.style.width = "1px"),
              (support.reliableMarginRight = !parseFloat(
                  (window.getComputedStyle(
                      marginDiv,
                      null
                  ) || {
                  }).marginRight,
              ))),
                    "undefined" !== typeof div.style.zoom &&
              ((div.innerHTML = ""),
              (div.style.cssText =
                "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;width:1px;padding:1px;display:inline;zoom:1"),
              (support.inlineBlockNeedsLayout = 3 === div.offsetWidth),
              (div.style.display = "block"),
              (div.innerHTML = "<div></div>"),
              (div.firstChild.style.width = "5px"),
              (support.shrinkWrapBlocks = 3 !== div.offsetWidth),
              support.inlineBlockNeedsLayout && (body.style.zoom = 1)),
                    body.removeChild(
                        container
                    ),
                    (container = div = tds = marginDiv = null);
                }
            ),
            (all = select = fragment = opt = a = input = null),
            support
        );
    })(
    ));
    var rmultiDash = /([A-Z])/g;
    function internalData(
        elem, name, data, pvt
    ) {
        if (!jQuery.acceptData(
            elem
        )) return;
        var thisCache,
            ret,
            internalKey = jQuery.expando,
            getByName = "string" == typeof name,
            isNode = elem.nodeType,
            cache = isNode ? jQuery.cache : elem,
            id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
        return (!id || !cache[id] || (!pvt && !cache[id].data)) &&
      getByName &&
      void 0 === data
            ? void 0
            : (id ||
          (isNode
              ? (elem[internalKey] = id = core_deletedIds.pop(
              ) || jQuery.guid++)
              : (id = internalKey)),
            cache[id] ||
          ((cache[id] = {
          }), !isNode && (cache[id].toJSON = jQuery.noop)),
            ("object" == typeof name || "function" == typeof name) &&
          (pvt
              ? (cache[id] = jQuery.extend(
                  cache[id],
                  name
              ))
              : (cache[id].data = jQuery.extend(
                  cache[id].data,
                  name
              ))),
            (thisCache = cache[id]),
            pvt ||
          (thisCache.data || (thisCache.data = {
          }),
          (thisCache = thisCache.data)),
            void 0 !== data && (thisCache[jQuery.camelCase(
                name
            )] = data),
            getByName
                ? ((ret = thisCache[name]),
                null == ret && (ret = thisCache[jQuery.camelCase(
                    name
                )]))
                : (ret = thisCache),
            ret);
    }
    function internalRemoveData(
        elem, name, pvt
    ) {
        if (!jQuery.acceptData(
            elem
        )) return;
        var i,
            thisCache,
            isNode = elem.nodeType,
            cache = isNode ? jQuery.cache : elem,
            id = isNode ? elem[jQuery.expando] : jQuery.expando;
        if (!cache[id]) return;
        if (name) {
            if ((thisCache = pvt ? cache[id] : cache[id].data)) {
                for (
                    !jQuery.isArray(
                        name
                    )
                        ? (name in thisCache)
                            ? (name = [name,])
                            : ((name = jQuery.camelCase(
                                name
                            )),
                            (name = (name in thisCache)
                                ? [name,]
                                : name.split(
                                    " "
                                )))
                        : (name = name.concat(
                            jQuery.map(
                                name,
                                jQuery.camelCase
                            )
                        )),
                    i = 0;
                    i < name.length;
                    i++
                )
                    delete thisCache[name[i]];
                if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(
                    thisCache
                ))
                    return;
            }
        }
        return !pvt
            ? (delete cache[id].data, !isEmptyDataObject(
                cache[id]
            ))
                ? void 0
                : void 0
            : void (isNode
                ? jQuery.cleanData(
                    [elem,],
                    !0
                )
                : jQuery.support.deleteExpando || cache != cache.window
                    ? delete cache[id]
                    : (cache[id] = null));
    }
    jQuery.extend(
        {
            cache: {
            },
            expando: "jQuery" + ("1.9.1" + Math.random(
            )).replace(
                /\D/g,
                ""
            ),
            noData: {
                embed: !0,
                object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                applet: !0,
            },
            hasData: function (
                elem
            ) {
                return (
                    (elem = elem.nodeType
                        ? jQuery.cache[elem[jQuery.expando]]
                        : elem[jQuery.expando]),
                    !!elem && !isEmptyDataObject(
                        elem
                    )
                );
            },
            data: function (
                elem, name, data
            ) {
                return internalData(
                    elem,
                    name,
                    data
                );
            },
            removeData: function (
                elem, name
            ) {
                return internalRemoveData(
                    elem,
                    name
                );
            },
            _data: function (
                elem, name, data
            ) {
                return internalData(
                    elem,
                    name,
                    data,
                    !0
                );
            },
            _removeData: function (
                elem, name
            ) {
                return internalRemoveData(
                    elem,
                    name,
                    !0
                );
            },
            acceptData: function (
                elem
            ) {
                if (elem.nodeType && 1 !== elem.nodeType && 9 !== elem.nodeType)
                    return !1;
                var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase(
                )];
                return (
                    !noData || (!0 !== noData && elem.getAttribute(
                        "classid"
                    ) === noData)
                );
            },
        }
    ),
    jQuery.fn.extend(
        {
            data: function (
                key, value
            ) {
                var name,
                    elem = this[0],
                    i = 0,
                    data = null;
                if (void 0 === key) {
                    if (this.length) {
                        if (
                            ((data = jQuery.data(
                                elem
                            )),
                            1 === elem.nodeType && !jQuery._data(
                                elem,
                                "parsedAttrs"
                            ))
                        ) {
                            for (elem.attributes; i < elem.attributes.length; i++)
                                (name = elem.attributes[i].name),
                                name.indexOf(
                                    "data-"
                                ) ||
                    ((name = jQuery.camelCase(
                        name.slice(
                            5
                        )
                    )),
                    dataAttr(
                        elem,
                        name,
                        data[name]
                    ));
                            jQuery._data(
                                elem,
                                "parsedAttrs",
                                !0
                            );
                        }
                    }
                    return data;
                }
                return "object" == typeof key
                    ? this.each(
                        function (
                        ) {
                            jQuery.data(
                                this,
                                key
                            );
                        }
                    )
                    : jQuery.access(
                        this,
                        function (
                            value1
                        ) {
                            if (void 0 === value1)
                                return elem
                                    ? dataAttr(
                                        elem,
                                        key,
                                        jQuery.data(
                                            elem,
                                            key
                                        )
                                    )
                                    : null;
                            this.each(
                                function (
                                ) {
                                    jQuery.data(
                                        this,
                                        key,
                                        value1
                                    );
                                }
                            );
                        },
                        null,
                        value,
                        arguments.length > 1,
                        null,
                        !0,
                    );
            },
            removeData: function (
                key
            ) {
                return this.each(
                    function (
                    ) {
                        jQuery.removeData(
                            this,
                            key
                        );
                    }
                );
            },
        }
    );
    function dataAttr(
        elem, key, data
    ) {
        if (void 0 === data && 1 === elem.nodeType) {
            var name = "data-" + key.replace(
                rmultiDash,
                "-$1"
            ).toLowerCase(
            );
            if (((data = elem.getAttribute(
                name
            )), "string" == typeof data)) {
                try {
                    data =
            "true" === data
                ? !0
                : "false" === data
                    ? !1
                    : "null" === data
                        ? null
                        : +data + "" === data
                            ? +data
                            : /(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test(
                                data
                            )
                                ? jQuery.parseJSON(
                                    data
                                )
                                : data;
                } catch (e) {}
                jQuery.data(
                    elem,
                    key,
                    data
                );
            } else data = void 0;
        }
        return data;
    }
    function isEmptyDataObject(
        obj
    ) {
        var name;
        for (name in obj) {
            if ("data" === name && jQuery.isEmptyObject(
                obj[name]
            )) continue;
            if ("toJSON" !== name) return !1;
        }
        return !0;
    }
    jQuery.extend(
        {
            queue: function (
                elem, type, data
            ) {
                var queue;
                if (elem)
                    return (
                        (type = (type || "fx") + "queue"),
                        (queue = jQuery._data(
                            elem,
                            type
                        )),
                        data &&
            (queue && !jQuery.isArray(
                data
            )
                ? (queue = jQuery._data(
                    elem,
                    type,
                    jQuery.makeArray(
                        data
                    )
                ))
                : queue.push(
                    data
                )),
                        queue || []
                    );
            },
            dequeue: function (
                elem, type
            ) {
                type ||= "fx";
                var queue = jQuery.queue(
                        elem,
                        type
                    ),
                    startLength = queue.length,
                    fn = queue.shift(
                    ),
                    hooks = jQuery._queueHooks(
                        elem,
                        type
                    );
                "inprogress" === fn && ((fn = queue.shift(
                )), startLength--),
                (hooks.cur = fn),
                fn &&
          ("fx" === type && queue.unshift(
              "inprogress"
          ),
          delete hooks.stop,
          fn.call(
              elem,
              function (
              ) {
                  jQuery.dequeue(
                      elem,
                      type
                  );
              },
              hooks,
          )),
                !startLength && hooks && hooks.empty.fire(
                );
            },
            _queueHooks: function (
                elem, type
            ) {
                var key = type + "queueHooks";
                return (
                    jQuery._data(
                        elem,
                        key
                    ) ||
        jQuery._data(
            elem,
            key,
            {
                empty: jQuery.Callbacks(
                    "once memory"
                ).add(
                    function (
                    ) {
                        jQuery._removeData(
                            elem,
                            type + "queue"
                        ),
                        jQuery._removeData(
                            elem,
                            key
                        );
                    }
                ),
            }
        )
                );
            },
        }
    ),
    jQuery.fn.extend(
        {
            queue: function (
                type, data
            ) {
                var setter = 2;
                return ("string" !== typeof type &&
          ((data = type), (type = "fx"), setter--),
                arguments.length < setter)
                    ? jQuery.queue(
                        this[0],
                        type
                    )
                    : void 0 === data
                        ? this
                        : this.each(
                            function (
                            ) {
                                jQuery._queueHooks(
                                    this,
                                    type
                                ),
                                "fx" === type &&
                  jQuery.queue(
                      this,
                      type,
                      data
                  )[0] !== "inprogress" &&
                  jQuery.dequeue(
                      this,
                      type
                  );
                            }
                        );
            },
            dequeue: function (
                type
            ) {
                return this.each(
                    function (
                    ) {
                        jQuery.dequeue(
                            this,
                            type
                        );
                    }
                );
            },
            delay: function (
                time, type
            ) {
                return (
                    (time = jQuery.fx ? jQuery.fx.speeds[time] || time : time),
                    this.queue(
                        "fx",
                        function (
                            next, hooks
                        ) {
                            var timeout = setTimeout(
                                next,
                                time
                            );
                            hooks.stop = function (
                            ) {
                                clearTimeout(
                                    timeout
                                );
                            };
                        }
                    )
                );
            },
            clearQueue: function (
                type
            ) {
                return this.queue(
                    type || "fx",
                    []
                );
            },
            promise: function (
                type, obj
            ) {
                var tmp,
                    count = 1,
                    defer = jQuery.Deferred(
                    ),
                    elements = this,
                    i = this.length,
                    resolve = function (
                    ) {
                        --count || defer.resolveWith(
                            elements,
                            [elements,]
                        );
                    };
                for (
                    "string" !== typeof type && ((obj = type), (type = void 0)),
                    type ||= "fx";
                    i--;

                )
                    (tmp = jQuery._data(
                        elements[i],
                        type + "queueHooks"
                    )),
                    tmp && tmp.empty && (count++, tmp.empty.add(
                        resolve
                    ));
                return resolve(
                ), defer.promise(
                    obj
                );
            },
        }
    );
    var nodeHook,
        boolHook,
        rclass = /[\t\r\n]/g,
        rreturn = /\r/g,
        rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
        ruseDefault = /^(?:checked|selected)$/i,
        getSetAttribute = jQuery.support.getSetAttribute,
        getSetInput = jQuery.support.input;
    jQuery.fn.extend(
        {
            attr: function (
                name, value
            ) {
                return jQuery.access(
                    this,
                    jQuery.attr,
                    name,
                    value,
                    arguments.length > 1,
                );
            },
            removeAttr: function (
                name
            ) {
                return this.each(
                    function (
                    ) {
                        jQuery.removeAttr(
                            this,
                            name
                        );
                    }
                );
            },
            prop: function (
                name, value
            ) {
                return jQuery.access(
                    this,
                    jQuery.prop,
                    name,
                    value,
                    arguments.length > 1,
                );
            },
            removeProp: function (
                name
            ) {
                return (
                    (name = jQuery.propFix[name] || name),
                    this.each(
                        function (
                        ) {
                            try {
                                (this[name] = void 0), delete this[name];
                            } catch (e) {}
                        }
                    )
                );
            },
            addClass: function (
                value
            ) {
                var classes,
                    elem,
                    cur,
                    clazz,
                    j,
                    i = 0,
                    len = this.length;
                if (jQuery.isFunction(
                    value
                ))
                    return this.each(
                        function (
                            j
                        ) {
                            jQuery(
                                this
                            ).addClass(
                                value.call(
                                    this,
                                    j,
                                    this.className
                                )
                            );
                        }
                    );
                if ("string" == typeof value && value)
                    for (classes = (value || "").match(
                        core_rnotwhite
                    ) || []; len > i; i++)
                        if (
                            ((elem = this[i]),
                            (cur =
              1 === elem.nodeType &&
              (elem.className
                  ? (" " + elem.className + " ").replace(
                      rclass,
                      " "
                  )
                  : " ")))
                        ) {
                            for (; (clazz = classes[j++]); )
                                0 > cur.indexOf(
                                    " " + clazz + " "
                                ) && (cur += clazz + " ");
                            elem.className = jQuery.trim(
                                cur
                            );
                        }
                return this;
            },
            removeClass: function (
                value
            ) {
                var classes,
                    elem,
                    cur,
                    clazz,
                    j,
                    i = 0,
                    len = this.length,
                    proceed = 0 === arguments.length || ("string" == typeof value && value);
                if (jQuery.isFunction(
                    value
                ))
                    return this.each(
                        function (
                            j
                        ) {
                            jQuery(
                                this
                            ).removeClass(
                                value.call(
                                    this,
                                    j,
                                    this.className
                                )
                            );
                        }
                    );
                if (proceed)
                    for (classes = (value || "").match(
                        core_rnotwhite
                    ) || []; len > i; i++)
                        if (
                            ((elem = this[i]),
                            (cur =
              1 === elem.nodeType &&
              (elem.className
                  ? (" " + elem.className + " ").replace(
                      rclass,
                      " "
                  )
                  : "")))
                        ) {
                            for (; (clazz = classes[j++]); )
                                for (; cur.indexOf(
                                    " " + clazz + " "
                                ) >= 0; )
                                    cur = cur.replace(
                                        " " + clazz + " ",
                                        " "
                                    );
                            elem.className = value
                                ? jQuery.trim(
                                    cur
                                )
                                : "";
                        }
                return this;
            },
            toggleClass: function (
                value, stateVal
            ) {
                var type = typeof value;
                return jQuery.isFunction(
                    value
                )
                    ? this.each(
                        function (
                            i
                        ) {
                            jQuery(
                                this
                            ).toggleClass(
                                value.call(
                                    this,
                                    i,
                                    this.className,
                                    stateVal
                                ),
                                stateVal,
                            );
                        }
                    )
                    : this.each(
                        function (
                        ) {
                            if ("string" === type)
                                for (
                                    var className, i = 0, self = jQuery(
                                            this
                                        ), state = stateVal;
                                    (className = (value.match(
                                        core_rnotwhite
                                    ) || [])[i++]);

                                )
                                    (state =
                  "boolean" == typeof stateVal
                      ? state
                      : !self.hasClass(
                          className
                      )),
                                    self[state ? "addClass" : "removeClass"](
                                        className
                                    );
                            else
                                ("undefined" === type || "boolean" === type) &&
                (this.className &&
                  jQuery._data(
                      this,
                      "__className__",
                      this.className
                  ),
                (this.className =
                  this.className || !1 === value
                      ? ""
                      : jQuery._data(
                          this,
                          "__className__"
                      ) || ""));
                        }
                    );
            },
            hasClass: function (
                selector
            ) {
                for (var i = 0, l = this.length; l > i; i++)
                    if (
                        this[i].nodeType === 1 &&
          (" " + this[i].className + " ")
              .replace(
                  rclass,
                  " "
              )
              .indexOf(
                  " " + selector + " "
              ) >= 0
                    )
                        return !0;
                return !1;
            },
            val: function (
                value
            ) {
                var ret,
                    hooks,
                    isFunction,
                    elem = this[0];
                if (!arguments.length) {
                    if (elem) {
                        if (
                            ((hooks =
              jQuery.valHooks[elem.type] ||
              jQuery.valHooks[elem.nodeName.toLowerCase(
              )]),
                            hooks &&
              "get" in hooks &&
              (ret = hooks.get(
                  elem,
                  "value"
              )) !== void 0)
                        )
                            return ret;
                        return (
                            (ret = elem.value),
                            "string" == typeof ret
                                ? ret.replace(
                                    rreturn,
                                    ""
                                )
                                : null == ret
                                    ? ""
                                    : ret
                        );
                    }
                    return;
                }
                return (
                    (isFunction = jQuery.isFunction(
                        value
                    )),
                    this.each(
                        function (
                            i
                        ) {
                            var val;
                            if (1 !== this.nodeType) return;
                            (val = isFunction
                                ? value.call(
                                    this,
                                    i,
                                    jQuery(
                                        this
                                    ).val(
                                    )
                                )
                                : value),
                            null == val
                                ? (val = "")
                                : "number" == typeof val
                                    ? (val += "")
                                    : jQuery.isArray(
                                        val
                                    ) &&
                (val = jQuery.map(
                    val,
                    function (
                        value1
                    ) {
                        return null == value1 ? "" : value1 + "";
                    }
                )),
                            (hooks =
              jQuery.valHooks[this.type] ||
              jQuery.valHooks[this.nodeName.toLowerCase(
              )]),
                            (!hooks ||
              !("set" in hooks) ||
              hooks.set(
                  this,
                  val,
                  "value"
              ) === void 0) &&
              (this.value = val);
                        }
                    )
                );
            },
        }
    ),
    jQuery.extend(
        {
            valHooks: {
                option: {
                    get: function (
                        elem
                    ) {
                        var val = elem.attributes.value;
                        return val && !val.specified ? elem.value : elem.text;
                    },
                },
                select: {
                    get: function (
                        elem
                    ) {
                        for (
                            var value,
                                option,
                                options = elem.options,
                                index = elem.selectedIndex,
                                one = "select-one" === elem.type || 0 > index,
                                values = one ? null : [],
                                max = one ? index + 1 : options.length,
                                i = 0 > index ? max : one ? index : 0;
                            max > i;
                            i++
                        )
                            if (
                                ((option = options[i]),
                                (option.selected || i === index) &&
                  (jQuery.support.optDisabled
                      ? !option.disabled
                      : null === option.getAttribute(
                          "disabled"
                      )) &&
                  (!option.parentNode.disabled ||
                    !jQuery.nodeName(
                        option.parentNode,
                        "optgroup"
                    )))
                            ) {
                                if (((value = jQuery(
                                    option
                                ).val(
                                )), one)) return value;
                                values.push(
                                    value
                                );
                            }
                        return values;
                    },
                    set: function (
                        elem, value
                    ) {
                        var values = jQuery.makeArray(
                            value
                        );
                        return (
                            jQuery(
                                elem
                            )
                                .find(
                                    "option"
                                )
                                .each(
                                    function (
                                    ) {
                                        this.selected =
                    jQuery.inArray(
                        jQuery(
                            this
                        ).val(
                        ),
                        values
                    ) >= 0;
                                    }
                                ),
                            values.length || (elem.selectedIndex = -1),
                            values
                        );
                    },
                },
            },
            attr: function (
                elem, name, value
            ) {
                var hooks,
                    notxml,
                    ret,
                    nType = elem.nodeType;
                if (!elem || 3 === nType || 8 === nType || 2 === nType) return;
                if ("undefined" == typeof elem.getAttribute)
                    return jQuery.prop(
                        elem,
                        name,
                        value
                    );
                if (
                    ((notxml = 1 !== nType || !jQuery.isXMLDoc(
                        elem
                    )),
                    notxml &&
            ((name = name.toLowerCase(
            )),
            (hooks =
              jQuery.attrHooks[name] ||
              (rboolean.test(
                  name
              )
                  ? boolHook
                  : nodeHook))),
                    void 0 !== value)
                ) {
                    if (null === value) jQuery.removeAttr(
                        elem,
                        name
                    );
                    else if (
                        hooks &&
            notxml &&
            "set" in hooks &&
            (ret = hooks.set(
                elem,
                value,
                name
            )) !== void 0
                    )
                        return ret;
                    else return elem.setAttribute(
                        name,
                        value + ""
                    ), value;
                } else if (
                    hooks &&
          notxml &&
          "get" in hooks &&
          null !== (ret = hooks.get(
              elem,
              name
          ))
                )
                    return ret;
                else
                    return (
                        "undefined" !== typeof elem.getAttribute &&
              (ret = elem.getAttribute(
                  name
              )),
                        null == ret ? void 0 : ret
                    );
            },
            removeAttr: function (
                elem, value
            ) {
                var name,
                    propName,
                    i = 0,
                    attrNames = value && value.match(
                        core_rnotwhite
                    );
                if (attrNames && 1 === elem.nodeType)
                    for (; (name = attrNames[i++]); )
                        (propName = jQuery.propFix[name] || name),
                        rboolean.test(
                            name
                        )
                            ? getSetAttribute || !ruseDefault.test(
                                name
                            )
                                ? (elem[jQuery.camelCase(
                                    "default-" + name
                                )] = elem[
                                    propName
                                ] = !1)
                                : (elem[propName] = !1)
                            : jQuery.attr(
                                elem,
                                name,
                                ""
                            ),
                        elem.removeAttribute(
                            getSetAttribute ? name : propName
                        );
            },
            attrHooks: {
                type: {
                    set: function (
                        elem, value
                    ) {
                        if (
                            !jQuery.support.radioValue &&
              "radio" === value &&
              jQuery.nodeName(
                  elem,
                  "input"
              )
                        ) {
                            var val = elem.value;
                            return (
                                elem.setAttribute(
                                    "type",
                                    value
                                ),
                                val && (elem.value = val),
                                value
                            );
                        }
                    },
                },
            },
            propFix: {
                tabindex: "tabIndex",
                readonly: "readOnly",
                for: "htmlFor",
                class: "className",
                maxlength: "maxLength",
                cellspacing: "cellSpacing",
                cellpadding: "cellPadding",
                rowspan: "rowSpan",
                colspan: "colSpan",
                usemap: "useMap",
                frameborder: "frameBorder",
                contenteditable: "contentEditable",
            },
            prop: function (
                elem, name, value
            ) {
                var ret,
                    hooks,
                    notxml,
                    nType = elem.nodeType;
                if (!elem || 3 === nType || 8 === nType || 2 === nType) return;
                if (
                    ((notxml = 1 !== nType || !jQuery.isXMLDoc(
                        elem
                    )),
                    notxml &&
            ((name = jQuery.propFix[name] || name),
            (hooks = jQuery.propHooks[name])),
                    void 0 !== value)
                ) {
                    if (
                        hooks &&
            "set" in hooks &&
            (ret = hooks.set(
                elem,
                value,
                name
            )) !== void 0
                    )
                        return ret;
                    return (elem[name] = value);
                } else {
                    if (hooks && "get" in hooks && null !== (ret = hooks.get(
                        elem,
                        name
                    )))
                        return ret;
                    return elem[name];
                }
            },
            propHooks: {
                tabIndex: {
                    get: function (
                        elem
                    ) {
                        var attributeNode = elem.getAttributeNode(
                            "tabindex"
                        );
                        return attributeNode && attributeNode.specified
                            ? parseInt(
                                attributeNode.value,
                                10
                            )
                            : /^(?:input|select|textarea|button|object)$/i.test(
                                elem.nodeName,
                            ) ||
                (/^(?:a|area)$/i.test(
                    elem.nodeName
                ) && elem.href)
                                ? 0
                                : void 0;
                    },
                },
            },
        }
    ),
    (boolHook = {
        get: function (
            elem, name
        ) {
            var prop = jQuery.prop(
                    elem,
                    name
                ),
                attr = "boolean" == typeof prop && elem.getAttribute(
                    name
                ),
                detail =
            "boolean" == typeof prop
                ? getSetInput && getSetAttribute
                    ? null != attr
                    : ruseDefault.test(
                        name
                    )
                        ? elem[jQuery.camelCase(
                            "default-" + name
                        )]
                        : !!attr
                : elem.getAttributeNode(
                    name
                );
            return detail && detail.value !== !1
                ? name.toLowerCase(
                )
                : void 0;
        },
        set: function (
            elem, value, name
        ) {
            return (
                !1 === value
                    ? jQuery.removeAttr(
                        elem,
                        name
                    )
                    : (getSetInput && getSetAttribute) || !ruseDefault.test(
                        name
                    )
                        ? elem.setAttribute(
                            (!getSetAttribute && jQuery.propFix[name]) || name,
                            name,
                        )
                        : (elem[jQuery.camelCase(
                            "default-" + name
                        )] = elem[name] = !0),
                name
            );
        },
    }),
    (!getSetInput || !getSetAttribute) &&
      (jQuery.attrHooks.value = {
          get: function (
              elem, name
          ) {
              var ret = elem.getAttributeNode(
                  name
              );
              return jQuery.nodeName(
                  elem,
                  "input"
              )
                  ? elem.defaultValue
                  : ret && ret.specified
                      ? ret.value
                      : void 0;
          },
          set: function (
              elem, value, name
          ) {
              if (jQuery.nodeName(
                  elem,
                  "input"
              )) elem.defaultValue = value;
              else return nodeHook && nodeHook.set(
                  elem,
                  value,
                  name
              );
          },
      }),
    getSetAttribute ||
      ((nodeHook = jQuery.valHooks.button = {
          get: function (
              elem, name
          ) {
              var ret = elem.getAttributeNode(
                  name
              );
              return ret &&
            ("id" === name || "name" === name || "coords" === name
                ? "" !== ret.value
                : ret.specified)
                  ? ret.value
                  : void 0;
          },
          set: function (
              elem, value, name
          ) {
              var ret = elem.getAttributeNode(
                  name
              );
              return (
                  ret ||
              elem.setAttributeNode(
                  (ret = elem.ownerDocument.createAttribute(
                      name
                  )),
              ),
                  (ret.value = value += ""),
                  "value" === name || value === elem.getAttribute(
                      name
                  )
                      ? value
                      : void 0
              );
          },
      }),
      (jQuery.attrHooks.contenteditable = {
          get: nodeHook.get,
          set: function (
              elem, value, name
          ) {
              nodeHook.set(
                  elem,
                  "" === value ? !1 : value,
                  name
              );
          },
      }),
      jQuery.each(
          ["width", "height",],
          function (
              i, name
          ) {
              jQuery.attrHooks[name] = jQuery.extend(
                  jQuery.attrHooks[name],
                  {
                      set: function (
                          elem, value
                      ) {
                          if ("" === value) return elem.setAttribute(
                              name,
                              "auto"
                          ), value;
                      },
                  }
              );
          }
      )),
    jQuery.support.hrefNormalized ||
      (jQuery.each(
          ["href", "src", "width", "height",],
          function (
              i, name
          ) {
              jQuery.attrHooks[name] = jQuery.extend(
                  jQuery.attrHooks[name],
                  {
                      get: function (
                          elem
                      ) {
                          var ret = elem.getAttribute(
                              name,
                              2
                          );
                          return null == ret ? void 0 : ret;
                      },
                  }
              );
          }
      ),
      jQuery.each(
          ["href", "src",],
          function (
              i, name
          ) {
              jQuery.propHooks[name] = {
                  get: function (
                      elem
                  ) {
                      return elem.getAttribute(
                          name,
                          4
                      );
                  },
              };
          }
      )),
    jQuery.support.style ||
      (jQuery.attrHooks.style = {
          get: function (
              elem
          ) {
              return elem.style.cssText || void 0;
          },
          set: function (
              elem, value
          ) {
              return (elem.style.cssText = value + "");
          },
      }),
    jQuery.support.optSelected ||
      (jQuery.propHooks.selected = jQuery.extend(
          jQuery.propHooks.selected,
          {
              get: function (
                  elem
              ) {
                  var parent = elem.parentNode;
                  return (
                      parent &&
              (parent.selectedIndex,
              parent.parentNode && parent.parentNode.selectedIndex),
                      null
                  );
              },
          }
      )),
    jQuery.support.enctype || (jQuery.propFix.enctype = "encoding"),
    jQuery.support.checkOn ||
      jQuery.each(
          ["radio", "checkbox",],
          function (
          ) {
              jQuery.valHooks[this] = {
                  get: function (
                      elem
                  ) {
                      return null === elem.getAttribute(
                          "value"
                      )
                          ? "on"
                          : elem.value;
                  },
              };
          }
      ),
    jQuery.each(
        ["radio", "checkbox",],
        function (
        ) {
            jQuery.valHooks[this] = jQuery.extend(
                jQuery.valHooks[this],
                {
                    set: function (
                        elem, value
                    ) {
                        if (jQuery.isArray(
                            value
                        ))
                            return (elem.checked =
              jQuery.inArray(
                  jQuery(
                      elem
                  ).val(
                  ),
                  value
              ) >= 0);
                    },
                }
            );
        }
    );
    var rformElems = /^(?:input|select|textarea)$/i,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
    function returnTrue(
    ) {
        return !0;
    }
    function returnFalse(
    ) {
        return !1;
    }
    (jQuery.event = {
        global: {
        },
        add: function (
            elem, types, handler, data, selector
        ) {
            var tmp,
                events,
                t,
                handleObjIn,
                special,
                eventHandle,
                handleObj,
                handlers,
                type,
                namespaces,
                origType,
                elemData = jQuery._data(
                    null
                );
            if (!elemData) return;
            for (
                handleObjIn.handler.handler &&
          ((handleObjIn = handleObjIn.handler),
          handleObjIn.handler,
          handleObjIn.selector),
                handleObjIn.handler.guid ||
            (handleObjIn.handler.guid = jQuery.guid++),
                (events = elemData.events) || (events = elemData.events = {
                }),
                (eventHandle = elemData.handle) ||
            ((eventHandle = elemData.handle = function (
                e
            ) {
                return e && jQuery.event.triggered === e.type
                    ? jQuery.event.dispatch.apply(
                        eventHandle.elem,
                        arguments
                    )
                    : void 0;
            }),
            (eventHandle.elem = null)),
                types = (types || "").match(
                    core_rnotwhite
                ) || ["",],
                t = types.length;
                t--;

            )
                (tmp = rtypenamespace.exec(
                    types[t]
                ) || []),
                (type = origType = tmp[1]),
                (namespaces = (tmp[2] || "").split(
                    "."
                ).sort(
                )),
                (special = jQuery.event.special[type] || {
                }),
                (type =
            (handleObjIn.selector ? special.delegateType : special.bindType) ||
            type),
                (special = jQuery.event.special[type] || {
                }),
                (handleObj = jQuery.extend(
                    {
                        type: type,
                        origType: origType,
                        data: data,
                        handler: handleObjIn.handler,
                        guid: handleObjIn.handler.guid,
                        selector: handleObjIn.selector,
                        needsContext:
                handleObjIn.selector &&
                jQuery.expr.match.needsContext.test(
                    handleObjIn.selector
                ),
                        namespace: namespaces.join(
                            "."
                        ),
                    },
                    handleObjIn,
                )),
                (handlers = events[type]) ||
            ((handlers = events[type] = []),
            (handlers.delegateCount = 0),
            (!special.setup ||
              special.setup.call(
                  null,
                  data,
                  namespaces,
                  eventHandle
              ) === !1) &&
              (null.addEventListener
                  ? null.addEventListener(
                      type,
                      eventHandle,
                      !1
                  )
                  : null.attachEvent &&
                  null.attachEvent(
                      "on" + type,
                      eventHandle
                  ))),
                special.add &&
            (special.add.call(
                null,
                handleObj
            ),
            !handleObj.handler.guid &&
              (handleObj.handler.guid = handleObjIn.handler.guid)),
                handleObjIn.selector
                    ? handlers.splice(
                        handlers.delegateCount++,
                        0,
                        handleObj
                    )
                    : handlers.push(
                        handleObj
                    ),
                (jQuery.event.global[type] = !0);
        },
        remove: function (
            elem, types, handler, selector, mappedTypes
        ) {
            var j,
                handleObj,
                tmp,
                origCount,
                t,
                special,
                handlers,
                type,
                namespaces,
                origType,
                elemData = jQuery.hasData(
                    elem
                ) && jQuery._data(
                    elem
                );
            if (!elemData || !elemData.events) return;
            for (
                types = (types || "").match(
                    core_rnotwhite
                ) || ["",], t = types.length;
                t--;

            ) {
                if (
                    ((tmp = rtypenamespace.exec(
                        types[t]
                    ) || []),
                    (type = origType = tmp[1]),
                    (namespaces = (tmp[2] || "").split(
                        "."
                    ).sort(
                    )),
                    !type)
                ) {
                    for (type in elemData.events)
                        jQuery.event.remove(
                            elem,
                            type + types[t],
                            handler,
                            selector,
                            !0
                        );
                    continue;
                }
                for (
                    special = jQuery.event.special[type] || {
                    },
                    type = (selector ? special.delegateType : special.bindType) || type,
                    handlers = elemData.events[type] || [],
                    tmp =
              tmp[2] &&
              new RegExp(
                  "(^|\\.)" + namespaces.join(
                      "\\.(?:.*\\.|)"
                  ) + "(\\.|$)",
              ),
                    origCount = j = handlers.length;
                    j--;

                )
                    (handleObj = handlers[j]),
                    (mappedTypes || origType === handleObj.origType) &&
              (!handler || handler.guid === handleObj.guid) &&
              (!tmp || tmp.test(
                  handleObj.namespace
              )) &&
              (!selector ||
                selector === handleObj.selector ||
                ("**" === selector && handleObj.selector)) &&
              (handlers.splice(
                  j,
                  1
              ),
              handleObj.selector && handlers.delegateCount--,
              special.remove && special.remove.call(
                  elem,
                  handleObj
              ));
                origCount &&
          !handlers.length &&
          ((!special.teardown ||
            special.teardown.call(
                elem,
                namespaces,
                elemData.handle
            ) === !1) &&
            jQuery.removeEvent(
                elem,
                type,
                elemData.handle
            ),
          delete elemData.events[type]);
            }
            jQuery.isEmptyObject(
                elemData.events
            ) &&
        (delete elemData.handle, jQuery._removeData(
            elem,
            "events"
        ));
        },
        trigger: function (
            event, data, elem, onlyHandlers
        ) {
            var handle,
                ontype,
                cur,
                bubbleType,
                special,
                tmp,
                i,
                eventPath = [elem || document,],
                type = core_hasOwn.call(
                    event,
                    "type"
                )
                    ? event.type
                    : event,
                namespaces = core_hasOwn.call(
                    event,
                    "namespace"
                )
                    ? event.namespace.split(
                        "."
                    )
                    : [];
            if (
                ((cur = tmp = elem ||= document),
                3 === elem.nodeType || 8 === elem.nodeType)
            )
                return;
            if (rfocusMorph.test(
                type + jQuery.event.triggered
            )) return;
            if (
                (type.indexOf(
                    "."
                ) >= 0 &&
          ((namespaces = type.split(
              "."
          )),
          (type = namespaces.shift(
          )),
          namespaces.sort(
          )),
                (ontype = 0 > type.indexOf(
                    ":"
                ) && "on" + type),
                (event = event[jQuery.expando]
                    ? event
                    : new jQuery.Event(
                        type,
                        "object" == typeof event && event
                    )),
                (event.isTrigger = !0),
                (event.namespace = namespaces.join(
                    "."
                )),
                (event.namespace_re = event.namespace
                    ? new RegExp(
                        "(^|\\.)" + namespaces.join(
                            "\\.(?:.*\\.|)"
                        ) + "(\\.|$)"
                    )
                    : null),
                (event.result = void 0),
                event.target || (event.target = elem),
                (data = null == data
                    ? [event,]
                    : jQuery.makeArray(
                        data,
                        [event,]
                    )),
                (special = jQuery.event.special[type] || {
                }),
                !onlyHandlers &&
          special.trigger &&
          special.trigger.apply(
              elem,
              data
          ) === !1)
            )
                return;
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(
                elem
            )) {
                for (
                    bubbleType = special.delegateType || type,
                    !rfocusMorph.test(
                        bubbleType + type
                    ) && (cur = cur.parentNode);
                    cur;
                    cur = cur.parentNode
                )
                    eventPath.push(
                        cur
                    ), (tmp = cur);
                tmp === (elem.ownerDocument || document) &&
          eventPath.push(
              tmp.defaultView || tmp.parentWindow || window
          );
            }
            for (i = 0; (cur = eventPath[i++]) && !event.isPropagationStopped(
            ); )
                (event.type = i > 1 ? bubbleType : special.bindType || type),
                (handle =
            (jQuery._data(
                cur,
                "events"
            ) || {
            })[event.type] &&
            jQuery._data(
                cur,
                "handle"
            )),
                handle && handle.apply(
                    cur,
                    data
                ),
                (handle = ontype && cur[ontype]),
                handle &&
            jQuery.acceptData(
                cur
            ) &&
            handle.apply &&
            handle.apply(
                cur,
                data
            ) === !1 &&
            event.preventDefault(
            );
            if (((event.type = type), !onlyHandlers && !event.isDefaultPrevented(
            ))) {
                if (
                    (!special._default ||
            special._default.apply(
                elem.ownerDocument,
                data
            ) === !1) &&
          ("click" !== type || !jQuery.nodeName(
              elem,
              "a"
          )) &&
          jQuery.acceptData(
              elem
          )
                ) {
                    if (ontype && elem[type] && !jQuery.isWindow(
                        elem
                    )) {
                        (tmp = elem[ontype]),
                        tmp && (elem[ontype] = null),
                        (jQuery.event.triggered = type);
                        try {
                            elem[type](
                            );
                        } catch (e) {}
                        (jQuery.event.triggered = void 0), tmp && (elem[ontype] = tmp);
                    }
                }
            }
            return event.result;
        },
        dispatch: function (
            event
        ) {
            event = jQuery.event.fix(
                event
            );
            var i,
                ret,
                handleObj,
                matched,
                j,
                handlerQueue = [],
                args = core_slice.call(
                    arguments
                ),
                handlers = (jQuery._data(
                    this,
                    "events"
                ) || {
                })[event.type] || [],
                special = jQuery.event.special[event.type] || {
                };
            if (
                ((args[0] = event),
                (event.delegateTarget = this),
                special.preDispatch && special.preDispatch.call(
                    this,
                    event
                ) === !1)
            )
                return;
            for (
                handlerQueue = jQuery.event.handlers.call(
                    this,
                    event,
                    handlers
                );
                (matched = handlerQueue[i++]) && !event.isPropagationStopped(
                );

            )
                for (
                    event.currentTarget = matched.elem;
                    (handleObj = matched.handlers[j++]) &&
          !event.isImmediatePropagationStopped(
          );

                )
                    (!event.namespace_re ||
            event.namespace_re.test(
                handleObj.namespace
            )) &&
            ((event.handleObj = handleObj),
            (event.data = handleObj.data),
            (ret = (
                (jQuery.event.special[handleObj.origType] || {
                }).handle ||
              handleObj.handler
            ).apply(
                matched.elem,
                args
            )),
            void 0 !== ret &&
              (event.result = ret) === !1 &&
              (event.preventDefault(
              ), event.stopPropagation(
              )));
            return (
                special.postDispatch && special.postDispatch.call(
                    this,
                    event
                ),
                event.result
            );
        },
        handlers: function (
            event, handlers
        ) {
            var sel,
                handleObj,
                matches,
                i,
                handlerQueue = [],
                delegateCount = handlers.delegateCount,
                cur = event.target;
            if (
                delegateCount &&
        cur.nodeType &&
        (!event.button || "click" !== event.type)
            )
                for (; cur != this; cur = cur.parentNode || this)
                    if (
                        1 === cur.nodeType &&
            (cur.disabled !== !0 || "click" !== event.type)
                    ) {
                        for (matches = [], i = 0; delegateCount > i; i++)
                            (handleObj = handlers[i]),
                            (sel = handleObj.selector + " "),
                            matches[sel] === void 0 &&
                  (matches[sel] = handleObj.needsContext
                      ? jQuery(
                          sel,
                          this
                      ).index(
                          cur
                      ) >= 0
                      : jQuery.find(
                          sel,
                          this,
                          null,
                          [cur,]
                      ).length),
                            matches[sel] && matches.push(
                                handleObj
                            );
                        matches.length &&
              handlerQueue.push(
                  {
                      elem: cur,
                      handlers: matches,
                  }
              );
                    }
            return (
                delegateCount < handlers.length &&
          handlerQueue.push(
              {
                  elem: this,
                  handlers: handlers.slice(
                      delegateCount
                  ),
              }
          ),
                handlerQueue
            );
        },
        fix: function (
            event
        ) {
            if (event[jQuery.expando]) return event;
            var i,
                prop,
                copy,
                type = event.type,
                originalEvent = event,
                fixHook = this.fixHooks[type];
            for (
                fixHook ||
          (this.fixHooks[type] = fixHook = /^(?:mouse|contextmenu)|click/.test(
              type,
          )
              ? this.mouseHooks
              : /^key/.test(
                  type
              )
                  ? this.keyHooks
                  : {
                  }),
                copy = fixHook.props
                    ? this.props.concat(
                        fixHook.props
                    )
                    : this.props,
                event = new jQuery.Event(
                    originalEvent
                ),
                i = copy.length;
                i--;

            )
                (prop = copy[i]), (event[prop] = originalEvent[prop]);
            return (
                event.target || (event.target = originalEvent.srcElement || document),
                event.target.nodeType === 3 && (event.target = event.target.parentNode),
                (event.metaKey = !!event.metaKey),
                fixHook.filter
                    ? fixHook.filter(
                        event,
                        originalEvent
                    )
                    : event
            );
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
            " ",
        ),
        fixHooks: {
        },
        keyHooks: {
            props: "char charCode key keyCode".split(
                " "
            ),
            filter: function (
                event, original
            ) {
                return (
                    null == event.which &&
            (event.which =
              null != original.charCode ? original.charCode : original.keyCode),
                    event
                );
            },
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(
                " ",
            ),
            filter: function (
                event, original
            ) {
                var eventDoc,
                    button = original.button,
                    fromElement = original.fromElement;
                return (
                    null == event.pageX &&
            null != original.clientX &&
            ((eventDoc = event.target.ownerDocument || document),
            eventDoc.documentElement,
            eventDoc.body,
            (event.pageX =
              original.clientX +
              ((eventDoc.documentElement &&
                eventDoc.documentElement.scrollLeft) ||
                (eventDoc.body && eventDoc.body.scrollLeft) ||
                0) -
              ((eventDoc.documentElement &&
                eventDoc.documentElement.clientLeft) ||
                (eventDoc.body && eventDoc.body.clientLeft) ||
                0)),
            (event.pageY =
              original.clientY +
              ((eventDoc.documentElement &&
                eventDoc.documentElement.scrollTop) ||
                (eventDoc.body && eventDoc.body.scrollTop) ||
                0) -
              ((eventDoc.documentElement &&
                eventDoc.documentElement.clientTop) ||
                (eventDoc.body && eventDoc.body.clientTop) ||
                0))),
                    !event.relatedTarget &&
            fromElement &&
            (event.relatedTarget =
              fromElement === event.target ? original.toElement : fromElement),
                    event.which ||
            void 0 === button ||
            (event.which =
              1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0),
                    event
                );
            },
        },
        special: {
            load: {
                noBubble: !0,
            },
            click: {
                trigger: function (
                ) {
                    if (
                        jQuery.nodeName(
                            this,
                            "input"
                        ) &&
            "checkbox" === this.type &&
            this.click
                    )
                        return this.click(
                        ), !1;
                },
            },
            focus: {
                trigger: function (
                ) {
                    if (this !== document.activeElement && this.focus)
                        try {
                            return this.focus(
                            ), !1;
                        } catch (e) {}
                },
                delegateType: "focusin",
            },
            blur: {
                trigger: function (
                ) {
                    if (this === document.activeElement && this.blur)
                        return this.blur(
                        ), !1;
                },
                delegateType: "focusout",
            },
            beforeunload: {
                postDispatch: function (
                    event
                ) {
                    event.result !== void 0 &&
            (event.originalEvent.returnValue = event.result);
                },
            },
        },
        simulate: function (
            type, elem, event, bubble
        ) {
            var e = jQuery.extend(
                new jQuery.Event(
                ),
                event,
                {
                    type: type,
                    isSimulated: !0,
                    originalEvent: {
                    },
                }
            );
            bubble
                ? jQuery.event.trigger(
                    e,
                    null,
                    elem
                )
                : jQuery.event.dispatch.call(
                    elem,
                    e
                ),
            e.isDefaultPrevented(
            ) && event.preventDefault(
            );
        },
    }),
    (jQuery.removeEvent = document.removeEventListener
        ? function (
            elem, type, handle
        ) {
            elem.removeEventListener &&
            elem.removeEventListener(
                type,
                handle,
                !1
            );
        }
        : function (
            elem, type, handle
        ) {
            var name = "on" + type;
            elem.detachEvent &&
            ("undefined" == typeof elem[name] && (elem[name] = null),
            elem.detachEvent(
                name,
                handle
            ));
        }),
    (jQuery.Event = function (
        src, props
    ) {
        if (!(this instanceof jQuery.Event)) return new jQuery.Event(
            src,
            props
        );
        src && src.type
            ? ((this.originalEvent = src),
            (this.type = src.type),
            (this.isDefaultPrevented =
            src.defaultPrevented ||
            src.returnValue === !1 ||
            (src.getPreventDefault && src.getPreventDefault(
            ))
                ? returnTrue
                : returnFalse))
            : (this.type = src),
        props && jQuery.extend(
            this,
            props
        ),
        (this.timeStamp = (src && src.timeStamp) || jQuery.now(
        )),
        (this[jQuery.expando] = !0);
    }),
    (jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function (
        ) {
            var e = this.originalEvent;
            if (((this.isDefaultPrevented = returnTrue), !e)) return;
            e.preventDefault
                ? e.preventDefault(
                )
                : (e.returnValue = !1);
        },
        stopPropagation: function (
        ) {
            var e = this.originalEvent;
            if (((this.isPropagationStopped = returnTrue), !e)) return;
            e.stopPropagation && e.stopPropagation(
            ), (e.cancelBubble = !0);
        },
        stopImmediatePropagation: function (
        ) {
            (this.isImmediatePropagationStopped = returnTrue),
            this.stopPropagation(
            );
        },
    }),
    jQuery.each(
        {
            mouseenter: "mouseover",
            mouseleave: "mouseout",
        },
        function (
            orig, fix
        ) {
            jQuery.event.special[orig] = {
                delegateType: fix,
                bindType: fix,
                handle: function (
                    event
                ) {
                    var ret,
                        target = this,
                        related = event.relatedTarget,
                        handleObj = event.handleObj;
                    return (
                        (!related ||
                (related !== target && !jQuery.contains(
                    target,
                    related
                ))) &&
                ((event.type = handleObj.origType),
                (ret = handleObj.handler.apply(
                    this,
                    arguments
                )),
                (event.type = fix)),
                        ret
                    );
                },
            };
        },
    ),
    jQuery.support.submitBubbles ||
      (jQuery.event.special.submit = {
          setup: function (
          ) {
              if (jQuery.nodeName(
                  this,
                  "form"
              )) return !1;
              jQuery.event.add(
                  this,
                  "click._submit keypress._submit",
                  function (
                      e
                  ) {
                      var elem = e.target,
                          form =
                  jQuery.nodeName(
                      elem,
                      "input"
                  ) ||
                  jQuery.nodeName(
                      elem,
                      "button"
                  )
                      ? elem.form
                      : void 0;
                      form &&
                !jQuery._data(
                    form,
                    "submitBubbles"
                ) &&
                (jQuery.event.add(
                    form,
                    "submit._submit",
                    function (
                        event
                    ) {
                        event._submit_bubble = !0;
                    }
                ),
                jQuery._data(
                    form,
                    "submitBubbles",
                    !0
                ));
                  },
              );
          },
          postDispatch: function (
              event
          ) {
              event._submit_bubble &&
            (delete event._submit_bubble,
            this.parentNode &&
              !event.isTrigger &&
              jQuery.event.simulate(
                  "submit",
                  this.parentNode,
                  event,
                  !0
              ));
          },
          teardown: function (
          ) {
              if (jQuery.nodeName(
                  this,
                  "form"
              )) return !1;
              jQuery.event.remove(
                  this,
                  "._submit"
              );
          },
      }),
    jQuery.support.changeBubbles ||
      (jQuery.event.special.change = {
          setup: function (
          ) {
              if (rformElems.test(
                  this.nodeName
              ))
                  return (
                      ("checkbox" === this.type || "radio" === this.type) &&
                (jQuery.event.add(
                    this,
                    "propertychange._change",
                    function (
                        event
                    ) {
                        event.originalEvent.propertyName === "checked" &&
                      (this._just_changed = !0);
                    },
                ),
                jQuery.event.add(
                    this,
                    "click._change",
                    function (
                        event
                    ) {
                        this._just_changed &&
                    !event.isTrigger &&
                    (this._just_changed = !1),
                        jQuery.event.simulate(
                            "change",
                            this,
                            event,
                            !0
                        );
                    }
                )),
                      !1
                  );
              jQuery.event.add(
                  this,
                  "beforeactivate._change",
                  function (
                      e
                  ) {
                      var elem = e.target;
                      rformElems.test(
                          elem.nodeName
                      ) &&
              !jQuery._data(
                  elem,
                  "changeBubbles"
              ) &&
              (jQuery.event.add(
                  elem,
                  "change._change",
                  function (
                      event
                  ) {
                      this.parentNode &&
                  !event.isSimulated &&
                  !event.isTrigger &&
                  jQuery.event.simulate(
                      "change",
                      this.parentNode,
                      event,
                      !0
                  );
                  }
              ),
              jQuery._data(
                  elem,
                  "changeBubbles",
                  !0
              ));
                  }
              );
          },
          handle: function (
              event
          ) {
              var elem = event.target;
              if (
                  this !== elem ||
            event.isSimulated ||
            event.isTrigger ||
            ("radio" !== elem.type && "checkbox" !== elem.type)
              )
                  return event.handleObj.handler.apply(
                      this,
                      arguments
                  );
          },
          teardown: function (
          ) {
              return (
                  jQuery.event.remove(
                      this,
                      "._change"
                  ),
                  !rformElems.test(
                      this.nodeName
                  )
              );
          },
      }),
    jQuery.support.focusinBubbles ||
      jQuery.each(
          {
              focus: "focusin",
              blur: "focusout",
          },
          function (
              orig, fix
          ) {
              var attaches = 0,
                  handler = function (
                      event
                  ) {
                      jQuery.event.simulate(
                          fix,
                          event.target,
                          jQuery.event.fix(
                              event
                          ),
                          !0,
                      );
                  };
              jQuery.event.special[fix] = {
                  setup: function (
                  ) {
                      attaches++ == 0 && document.addEventListener(
                          orig,
                          handler,
                          !0
                      );
                  },
                  teardown: function (
                  ) {
                      --attaches == 0 &&
                document.removeEventListener(
                    orig,
                    handler,
                    !0
                );
                  },
              };
          },
      ),
    jQuery.fn.extend(
        {
            on: function (
                types, selector, data, fn, one
            ) {
                var type, origFn;
                if ("object" == typeof types) {
                    "string" !== typeof selector &&
            ((data ||= selector), (selector = void 0));
                    for (type in types) this.on(
                        type,
                        selector,
                        data,
                        types[type],
                        one
                    );
                    return this;
                }
                return (null == data && null == fn
                    ? ((fn = selector), (data = selector = void 0))
                    : null == fn &&
            ("string" == typeof selector
                ? ((fn = data), (data = void 0))
                : ((fn = data), (data = selector), (selector = void 0))),
                !1 === fn)
                    ? void (fn = returnFalse)
                    : !fn
                        ? this
                        : (1 === one &&
              ((origFn = fn),
              (fn = function (
                  event
              ) {
                  return jQuery(
                  ).off(
                      event
                  ), origFn.apply(
                      this,
                      arguments
                  );
              }),
              (fn.guid = origFn.guid || (origFn.guid = jQuery.guid++))),
                        this.each(
                            function (
                            ) {
                                jQuery.event.add(
                                    this,
                                    types,
                                    fn,
                                    data,
                                    selector
                                );
                            }
                        ));
            },
            one: function (
                types, selector, data, fn
            ) {
                return this.on(
                    types,
                    selector,
                    data,
                    fn,
                    1
                );
            },
            off: function (
                types, selector, fn
            ) {
                var type;
                if (types && types.preventDefault && types.handleObj)
                    return (
                        jQuery(
                            types.delegateTarget
                        ).off(
                            types.handleObj.namespace
                                ? types.handleObj.origType + "." + types.handleObj.namespace
                                : types.handleObj.origType,
                            types.handleObj.selector,
                            types.handleObj.handler,
                        ),
                        this
                    );
                if ("object" == typeof types) {
                    for (type in types) this.off(
                        type,
                        selector,
                        types[type]
                    );
                    return this;
                }
                return (
                    (!1 === selector || "function" == typeof selector) &&
            ((fn = selector), (selector = void 0)),
                    !1 === fn && (fn = returnFalse),
                    this.each(
                        function (
                        ) {
                            jQuery.event.remove(
                                this,
                                types,
                                fn,
                                selector
                            );
                        }
                    )
                );
            },
            bind: function (
                types, data, fn
            ) {
                return this.on(
                    types,
                    null,
                    data,
                    fn
                );
            },
            unbind: function (
                types, fn
            ) {
                return this.off(
                    types,
                    null,
                    fn
                );
            },
            delegate: function (
                selector, types, data, fn
            ) {
                return this.on(
                    types,
                    selector,
                    data,
                    fn
                );
            },
            undelegate: function (
                selector, types, fn
            ) {
                return 1 === arguments.length
                    ? this.off(
                        selector,
                        "**"
                    )
                    : this.off(
                        types,
                        selector || "**",
                        fn
                    );
            },
            trigger: function (
                type, data
            ) {
                return this.each(
                    function (
                    ) {
                        jQuery.event.trigger(
                            type,
                            data,
                            this
                        );
                    }
                );
            },
            triggerHandler: function (
                type, data
            ) {
                var elem = this[0];
                if (elem) return jQuery.event.trigger(
                    type,
                    data,
                    elem,
                    !0
                );
            },
        }
    ),
    (function (
        window, undefined
    ) {
        var i,
            cachedruns,
            Expr,
            getText,
            isXML,
            compile,
            hasDuplicate,
            outermostContext,
            setDocument,
            document1,
            docElem,
            documentIsXML,
            rbuggyQSA,
            rbuggyMatches,
            matches,
            contains,
            sortOrder,
            expando = "sizzle" + -new Date(
            ),
            preferredDoc = window.document,
            support = {
            },
            dirruns = 0,
            done = 0,
            classCache = createCache(
            ),
            tokenCache = createCache(
            ),
            compilerCache = createCache(
            ),
            arr = [],
            push = arr.push,
            slice = arr.slice,
            indexOf =
          arr.indexOf ||
          function (
              elem
          ) {
              for (var i = 0, len = this.length; len > i; i++)
                  if (this[i] === elem) return i;
              return -1;
          },
            whitespace = "[\\x20\\t\\r\\n\\f]",
            characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            identifier = characterEncoding.replace(
                "w",
                "w#"
            ),
            operators = "([*^$|!~]?=)",
            attributes =
          "\\[" +
          whitespace +
          "*(" +
          characterEncoding +
          ")" +
          whitespace +
          "*(?:" +
          operators +
          whitespace +
          "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" +
          identifier +
          ")|)|)" +
          whitespace +
          "*\\]",
            pseudos =
          ":(" +
          characterEncoding +
          ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" +
          attributes.replace(
              3,
              8
          ) +
          ")*)|.*)\\)|)",
            rtrim1 = new RegExp(
                "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
                "g",
            ),
            rcomma = new RegExp(
                "^" + whitespace + "*," + whitespace + "*"
            ),
            rcombinators = new RegExp(
                "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*",
            ),
            rpseudo = new RegExp(
                pseudos
            ),
            ridentifier = new RegExp(
                "^" + identifier + "$"
            ),
            matchExpr = {
                ID: new RegExp(
                    "^#(" + characterEncoding + ")"
                ),
                CLASS: new RegExp(
                    "^\\.(" + characterEncoding + ")"
                ),
                NAME: new RegExp(
                    "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]",
                ),
                TAG: new RegExp(
                    "^(" + characterEncoding.replace(
                        "w",
                        "w*"
                    ) + ")"
                ),
                ATTR: new RegExp(
                    "^" + attributes
                ),
                PSEUDO: new RegExp(
                    "^" + pseudos
                ),
                CHILD: new RegExp(
                    "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
              whitespace +
              "*(even|odd|(([+-]|)(\\d*)n|)" +
              whitespace +
              "*(?:([+-]|)" +
              whitespace +
              "*(\\d+)|))" +
              whitespace +
              "*\\)|)",
                    "i",
                ),
                needsContext: new RegExp(
                    "^" +
              whitespace +
              "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
              whitespace +
              "*((?:-\\d)?\\d*)" +
              whitespace +
              "*\\)|)(?=[^-]|$)",
                    "i",
                ),
            },
            rsibling = /[\x20\t\r\n\f]*[+~]/,
            rescape = /'|\\/g,
            rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
            runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
            funescape = function (
                _, escaped
            ) {
                var high = "0x" + escaped - 65536;
                return high != high
                    ? escaped
                    : 0 > high
                        ? String.fromCharCode(
                            high + 65536
                        )
                        : String.fromCharCode(
                            (high >> 10) | 55296,
                            (1023 & high) | 56320
                        );
            };
        try {
            slice.call(
                preferredDoc.documentElement.childNodes,
                0
            )[0].nodeType;
        } catch (e) {
            slice = function (
                i
            ) {
                for (var elem, results = []; (elem = this[i++]); ) results.push(
                    elem
                );
                return results;
            };
        }
        function isNative(
            fn
        ) {
            return /^[^{]+\{\s*\[native code/.test(
                fn + ""
            );
        }
        function createCache(
        ) {
            var cache,
                keys = [];
            return (cache = function (
                key, value
            ) {
                return (
                    keys.push(
                        (key += " ")
                    ) > Expr.cacheLength &&
              delete cache[keys.shift(
              )],
                    (cache[key] = value)
                );
            });
        }
        function markFunction(
            fn
        ) {
            return (fn[expando] = !0), fn;
        }
        function assert(
            fn
        ) {
            document1.createElement(
                "div"
            );
            try {
                return fn(
                    null
                );
            } catch (e) {
                return !1;
            } finally {
            }
        }
        function Sizzle(
            selector, context, results, seed
        ) {
            var match, elem, m, i, groups, old, nid, newContext, newSelector;
            if (
                ((context ? context.ownerDocument || context : preferredDoc) !==
            document1 && setDocument(
                    context
                ),
                (context ||= document1),
                (results ||= []),
                !selector || "string" !== typeof selector)
            )
                return results;
            if (1 !== context.nodeType && 9 !== context.nodeType) return [];
            if (!documentIsXML && !seed) {
                if ((match = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/.exec(
                    selector
                ))) {
                    if ((m = match[1])) {
                        if (9 === context.nodeType) {
                            if (
                                ((elem = context.getElementById(
                                    m
                                )), elem && elem.parentNode)
                            ) {
                                if (elem.id === m) return results.push(
                                    elem
                                ), results;
                            } else return results;
                        } else if (
                            context.ownerDocument &&
                (elem = context.ownerDocument.getElementById(
                    m
                )) &&
                contains(
                    context,
                    elem
                ) &&
                elem.id === m
                        )
                            return results.push(
                                elem
                            ), results;
                    } else if (match[2])
                        return (
                            push.apply(
                                results,
                                slice.call(
                                    context.getElementsByTagName(
                                        selector
                                    ),
                                    0
                                ),
                            ),
                            results
                        );
                    else if (
                        (m = match[3]) &&
              support.getByClassName &&
              context.getElementsByClassName
                    )
                        return (
                            push.apply(
                                results,
                                slice.call(
                                    context.getElementsByClassName(
                                        m
                                    ),
                                    0
                                ),
                            ),
                            results
                        );
                }
                if (support.qsa && !rbuggyQSA.test(
                    selector
                )) {
                    if (
                        ((old = !0),
                        (nid = expando),
                        (newContext = context),
                        (newSelector = 9 === context.nodeType && selector),
                        1 === context.nodeType &&
                "object" !== context.nodeName.toLowerCase(
                ))
                    ) {
                        for (
                            groups = tokenize(
                                selector
                            ),
                            (old = context.getAttribute(
                                "id"
                            ))
                                ? (nid = old.replace(
                                    rescape,
                                    "\\$&"
                                ))
                                : context.setAttribute(
                                    "id",
                                    nid
                                ),
                            nid = "[id='" + nid + "'] ",
                            i = groups.length;
                            i--;

                        )
                            groups[i] = nid + toSelector(
                                groups[i]
                            );
                        (newContext =
                (rsibling.test(
                    selector
                ) && context.parentNode) || context),
                        (newSelector = groups.join(
                            ","
                        ));
                    }
                    if (newSelector)
                        try {
                            return (
                                push.apply(
                                    results,
                                    slice.call(
                                        newContext.querySelectorAll(
                                            newSelector
                                        ),
                                        0
                                    ),
                                ),
                                results
                            );
                        } catch (qsaError) {
                        } finally {
                            old || context.removeAttribute(
                                "id"
                            );
                        }
                }
            }
            return select(
                selector.replace(
                    rtrim1,
                    "$1"
                ),
                context,
                results,
                seed
            );
        }
        (isXML = Sizzle.isXML = function (
            elem
        ) {
            var documentElement =
          elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? "HTML" !== documentElement.nodeName : !1;
        }),
        (setDocument = Sizzle.setDocument = function (
            node
        ) {
            var doc = node ? node.ownerDocument || node : preferredDoc;
            return doc === document1 || 9 !== doc.nodeType || !doc.documentElement
                ? document1
                : ((document1 = doc),
                (docElem = doc.documentElement),
                (documentIsXML = isXML(
                    doc
                )),
                (support.tagNameNoComments = assert(
                    function (
                        div
                    ) {
                        return (
                            div.appendChild(
                                doc.createComment(
                                    ""
                                )
                            ),
                            !div.getElementsByTagName(
                                "*"
                            ).length
                        );
                    }
                )),
                (support.attributes = assert(
                    function (
                        div
                    ) {
                        div.innerHTML = "<select></select>";
                        var type = typeof div.lastChild.getAttribute(
                            "multiple"
                        );
                        return "boolean" !== type && "string" !== type;
                    }
                )),
                (support.getByClassName = assert(
                    function (
                        div
                    ) {
                        return ((div.innerHTML =
                  "<div class='hidden e'></div><div class='hidden'></div>"),
                        !div.getElementsByClassName ||
                  !div.getElementsByClassName(
                      "e"
                  ).length)
                            ? !1
                            : ((div.lastChild.className = "e"),
                            div.getElementsByClassName(
                                "e"
                            ).length === 2);
                    }
                )),
                (support.getByName = assert(
                    function (
                        div
                    ) {
                        (div.id = expando + 0),
                        (div.innerHTML =
                    "<a name='" +
                    expando +
                    "'></a><div name='" +
                    expando +
                    "'></div>"),
                        docElem.insertBefore(
                            div,
                            docElem.firstChild
                        );
                        var pass =
                  doc.getElementsByName &&
                  doc.getElementsByName(
                      expando
                  ).length ===
                    2 + doc.getElementsByName(
                        expando + 0
                    ).length;
                        return (
                            (support.getIdNotName = !doc.getElementById(
                                expando
                            )),
                            docElem.removeChild(
                                div
                            ),
                            pass
                        );
                    }
                )),
                (Expr.attrHandle = assert(
                    function (
                        div
                    ) {
                        return (
                            (div.innerHTML = "<a href='#'></a>"),
                            div.firstChild &&
                    "undefined" !== typeof div.firstChild.getAttribute &&
                    "#" === div.firstChild.getAttribute(
                        "href"
                    )
                        );
                    }
                )
                    ? {
                    }
                    : {
                        href: function (
                            elem
                        ) {
                            return elem.getAttribute(
                                "href",
                                2
                            );
                        },
                        type: function (
                            elem
                        ) {
                            return elem.getAttribute(
                                "type"
                            );
                        },
                    }),
                support.getIdNotName
                    ? ((Expr.find.ID = function (
                        id, context
                    ) {
                        if (
                            "undefined" !== typeof context.getElementById &&
                      !documentIsXML
                        ) {
                            var m = context.getElementById(
                                id
                            );
                            return m && m.parentNode ? [m,] : [];
                        }
                    }),
                    (Expr.filter.ID = function (
                        id
                    ) {
                        return function (
                            elem
                        ) {
                            return (
                                elem.getAttribute(
                                    "id"
                                ) ===
                        id.replace(
                            runescape,
                            funescape
                        )
                            );
                        };
                    }))
                    : ((Expr.find.ID = function (
                        id, context
                    ) {
                        if (
                            "undefined" !== typeof context.getElementById &&
                      !documentIsXML
                        ) {
                            var m = context.getElementById(
                                id
                            );
                            return m
                                ? m.id === id ||
                          ("undefined" !== typeof m.getAttributeNode &&
                            m.getAttributeNode(
                                "id"
                            ).value === id)
                                    ? [m,]
                                    : void 0
                                : [];
                        }
                    }),
                    (Expr.filter.ID = function (
                        id
                    ) {
                        return function (
                            elem
                        ) {
                            var node =
                        "undefined" !== typeof elem.getAttributeNode &&
                        elem.getAttributeNode(
                            "id"
                        );
                            return (
                                node && node.value === id.replace(
                                    runescape,
                                    funescape
                                )
                            );
                        };
                    })),
                (Expr.find.TAG = support.tagNameNoComments
                    ? function (
                        tag, context
                    ) {
                        if ("undefined" !== typeof context.getElementsByTagName)
                            return context.getElementsByTagName(
                                tag
                            );
                    }
                    : function (
                        tag, context
                    ) {
                        var elem,
                            tmp = [],
                            i = 0,
                            results = context.getElementsByTagName(
                                tag
                            );
                        if ("*" === tag) {
                            for (; (elem = results[i++]); )
                                1 === elem.nodeType && tmp.push(
                                    elem
                                );
                            return tmp;
                        }
                        return results;
                    }),
                (Expr.find.NAME =
                support.getByName &&
                function (
                    tag, context
                ) {
                    if ("undefined" !== typeof context.getElementsByName)
                        return context.getElementsByName(
                            name
                        );
                }),
                (Expr.find.CLASS =
                support.getByClassName &&
                function (
                    className, context
                ) {
                    if (
                        "undefined" !== typeof context.getElementsByClassName &&
                    !documentIsXML
                    )
                        return context.getElementsByClassName(
                            className
                        );
                }),
                (rbuggyMatches = []),
                (rbuggyQSA = [":focus",]),
                (support.qsa = isNative(
                    doc.querySelectorAll
                )) &&
                (assert(
                    function (
                        div
                    ) {
                        (div.innerHTML =
                    "<select><option selected=''></option></select>"),
                        div.querySelectorAll(
                            "[selected]"
                        ).length ||
                      rbuggyQSA.push(
                          "\\[" +
                          whitespace +
                          "*(?:checked|disabled|ismap|multiple|readonly|selected|value)",
                      ),
                        div.querySelectorAll(
                            ":checked"
                        ).length ||
                      rbuggyQSA.push(
                          ":checked"
                      );
                    }
                ),
                assert(
                    function (
                        div
                    ) {
                        (div.innerHTML = "<input type='hidden' i=''/>"),
                        div.querySelectorAll(
                            "[i^='']"
                        ).length &&
                      rbuggyQSA.push(
                          "[*^$]=" + whitespace + "*(?:\"\"|'')"
                      ),
                        div.querySelectorAll(
                            ":enabled"
                        ).length ||
                      rbuggyQSA.push(
                          ":enabled",
                          ":disabled"
                      ),
                        div.querySelectorAll(
                            "*,:x"
                        ),
                        rbuggyQSA.push(
                            ",.*:"
                        );
                    }
                )),
                (support.matchesSelector = isNative(
                    (matches =
                  docElem.matchesSelector ||
                  docElem.mozMatchesSelector ||
                  docElem.webkitMatchesSelector ||
                  docElem.oMatchesSelector ||
                  docElem.msMatchesSelector),
                )) &&
                assert(
                    function (
                        div
                    ) {
                        (support.disconnectedMatch = matches.call(
                            div,
                            "div"
                        )),
                        matches.call(
                            div,
                            "[s!='']:x"
                        ),
                        rbuggyMatches.push(
                            "!=",
                            pseudos
                        );
                    }
                ),
                (rbuggyQSA = new RegExp(
                    rbuggyQSA.join(
                        "|"
                    )
                )),
                (rbuggyMatches = new RegExp(
                    rbuggyMatches.join(
                        "|"
                    )
                )),
                (contains =
                isNative(
                    docElem.contains
                ) || docElem.compareDocumentPosition
                    ? function (
                        a, b
                    ) {
                        var adown = 9 === a.nodeType ? a.documentElement : a,
                            bup = b && b.parentNode;
                        return (
                            a === bup ||
                        !(
                            !bup ||
                          1 !== bup.nodeType ||
                          !(adown.contains
                              ? adown.contains(
                                  bup
                              )
                              : a.compareDocumentPosition &&
                              16 & a.compareDocumentPosition(
                                  bup
                              ))
                        )
                        );
                    }
                    : function (
                        a, b
                    ) {
                        if (b)
                            for (; (b = b.parentNode); ) if (a === b) return !0;
                        return !1;
                    }),
                (sortOrder = docElem.compareDocumentPosition
                    ? function (
                        a, b
                    ) {
                        var compare;
                        if (a === b) return (hasDuplicate = !0), 0;
                        if (
                            (compare =
                        b.compareDocumentPosition &&
                        a.compareDocumentPosition &&
                        a.compareDocumentPosition(
                            b
                        ))
                        ) {
                            if (
                                1 & compare ||
                        (a.parentNode && a.parentNode.nodeType === 11)
                            ) {
                                if (a === doc || contains(
                                    preferredDoc,
                                    a
                                )) return -1;
                                if (b === doc || contains(
                                    preferredDoc,
                                    b
                                )) return 1;
                                return 0;
                            }
                            return 4 & compare ? -1 : 1;
                        }
                        return a.compareDocumentPosition ? -1 : 1;
                    }
                    : function (
                        a, b
                    ) {
                        var cur,
                            i = 0,
                            aup = a.parentNode,
                            bup = b.parentNode,
                            ap = [a,],
                            bp = [b,];
                        if (a === b) return (hasDuplicate = !0), 0;
                        if (!aup || !bup)
                            return a === doc
                                ? -1
                                : b === doc
                                    ? 1
                                    : aup
                                        ? -1
                                        : bup
                                            ? 1
                                            : 0;
                        if (aup === bup) return siblingCheck(
                            a,
                            b
                        );
                        for (cur = a; (cur = cur.parentNode); ) ap.unshift(
                            cur
                        );
                        for (cur = b; (cur = cur.parentNode); ) bp.unshift(
                            cur
                        );
                        for (; ap[i] === bp[i]; ) i++;
                        return i
                            ? siblingCheck(
                                ap[i],
                                bp[i]
                            )
                            : ap[i] === preferredDoc
                                ? -1
                                : bp[i] === preferredDoc
                                    ? 1
                                    : 0;
                    }),
                (hasDuplicate = !1),
                [0, 0,].sort(
                    sortOrder
                ),
                (support.detectDuplicates = hasDuplicate),
                document1);
        }),
        (Sizzle.matches = function (
            expr, elements
        ) {
            return Sizzle(
                expr,
                null,
                null,
                elements
            );
        }),
        (Sizzle.matchesSelector = function (
            elem, expr
        ) {
            if (
                ((elem.ownerDocument || elem) !== document1 && setDocument(
                    elem
                ),
                (expr = expr.replace(
                    rattributeQuotes,
                    "='$1']"
                )),
                support.matchesSelector &&
              !documentIsXML &&
              (!rbuggyMatches || !rbuggyMatches.test(
                  expr
              )) &&
              !rbuggyQSA.test(
                  expr
              ))
            )
                try {
                    var ret = matches.call(
                        elem,
                        expr
                    );
                    if (
                        ret ||
                support.disconnectedMatch ||
                (elem.document && elem.document.nodeType !== 11)
                    )
                        return ret;
                } catch (e) {}
            return Sizzle(
                expr,
                document1,
                null,
                [elem,]
            ).length > 0;
        }),
        (Sizzle.contains = function (
            context, elem
        ) {
            return (
                (context.ownerDocument || context) !== document1 &&
              setDocument(
                  context
              ),
                contains(
                    context,
                    elem
                )
            );
        }),
        (Sizzle.attr = function (
            elem, name
        ) {
            var val;
            return ((elem.ownerDocument || elem) !== document1 &&
            setDocument(
                elem
            ),
            documentIsXML || (name = name.toLowerCase(
            )),
            (val = Expr.attrHandle[name]))
                ? val(
                    elem
                )
                : documentIsXML || support.attributes
                    ? elem.getAttribute(
                        name
                    )
                    : ((val = elem.getAttributeNode(
                        name
                    )) ||
                elem.getAttribute(
                    name
                )) &&
              elem[name] === !0
                        ? name
                        : val && val.specified
                            ? val.value
                            : null;
        }),
        (Sizzle.error = function (
            msg
        ) {
            throw new Error(
                "Syntax error, unrecognized expression: " + msg
            );
        }),
        (Sizzle.uniqueSort = function (
            results
        ) {
            var elem,
                duplicates = [],
                i = 1,
                j = 0;
            if (
                ((hasDuplicate = !support.detectDuplicates),
                results.sort(
                    sortOrder
                ),
                hasDuplicate)
            ) {
                for (; (elem = results[i]); i++)
                    elem === results[i - 1] && (j = duplicates.push(
                        i
                    ));
                for (; j--; ) results.splice(
                    duplicates[j],
                    1
                );
            }
            return results;
        });
        function siblingCheck(
            a, b
        ) {
            var cur = b && a,
                diff =
            cur &&
            (~b.sourceIndex || -2147483648) - (~a.sourceIndex || -2147483648);
            if (diff) return diff;
            if (cur) for (; (cur = cur.nextSibling); ) if (b === cur) return -1;
            return a ? 1 : -1;
        }
        function createInputPseudo(
            type
        ) {
            return function (
                elem
            ) {
                return "input" === elem.nodeName.toLowerCase(
                ) && elem.type === type;
            };
        }
        function createButtonPseudo(
            type
        ) {
            return function (
                elem
            ) {
                var name = elem.nodeName.toLowerCase(
                );
                return ("input" === name || "button" === name) && elem.type === type;
            };
        }
        function createPositionalPseudo(
            fn
        ) {
            return markFunction(
                function (
                    argument
                ) {
                    return (
                        (argument = +argument),
                        markFunction(
                            function (
                                seed, matches1
                            ) {
                                for (
                                    var j,
                                        matchIndexes = fn(
                                            [],
                                            seed.length,
                                            argument
                                        ),
                                        i = matchIndexes.length;
                                    i--;

                                )
                                    seed[(j = matchIndexes[i])] &&
                  (seed[j] = !(matches1[j] = seed[j]));
                            }
                        )
                    );
                }
            );
        }
        (getText = Sizzle.getText = function (
            elem
        ) {
            var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;
            if (!nodeType) for (; (node = elem[i]); i++) ret += getText(
                node
            );
            else if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
                if ("string" == typeof elem.textContent) return elem.textContent;
                for (elem = elem.firstChild; elem; elem = elem.nextSibling)
                    ret += getText(
                        elem
                    );
            } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue;
            return ret;
        }),
        (Expr = Sizzle.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            find: {
            },
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0,
                },
                " ": {
                    dir: "parentNode",
                },
                "+": {
                    dir: "previousSibling",
                    first: !0,
                },
                "~": {
                    dir: "previousSibling",
                },
            },
            preFilter: {
                ATTR: function (
                    match
                ) {
                    return (
                        (match[1] = match[1].replace(
                            runescape,
                            funescape
                        )),
                        (match[3] = (match[4] || match[5] || "").replace(
                            runescape,
                            funescape,
                        )),
                        match[2] === "~=" && (match[3] = " " + match[3] + " "),
                        match.slice(
                            0,
                            4
                        )
                    );
                },
                CHILD: function (
                    match
                ) {
                    return (
                        (match[1] = match[1].toLowerCase(
                        )),
                        "nth" === match[1].slice(
                            0,
                            3
                        )
                            ? (match[3] || Sizzle.error(
                                match[0]
                            ),
                            (match[4] = +(match[4]
                                ? match[5] + (match[6] || 1)
                                : 2 * (match[3] === "even" || match[3] === "odd"))),
                            (match[5] = +(match[7] + match[8] || match[3] === "odd")))
                            : match[3] && Sizzle.error(
                                match[0]
                            ),
                        match
                    );
                },
                PSEUDO: function (
                    match
                ) {
                    var excess,
                        unquoted = !match[5] && match[2];
                    return matchExpr.CHILD.test(
                        match[0]
                    )
                        ? null
                        : (match[4]
                            ? (match[2] = match[4])
                            : unquoted &&
                      rpseudo.test(
                          unquoted
                      ) &&
                      (excess = tokenize(
                          unquoted,
                          !0
                      )) &&
                      (excess =
                        unquoted.indexOf(
                            ")",
                            unquoted.length - excess
                        ) -
                        unquoted.length) &&
                      ((match[0] = match[0].slice(
                          0,
                          excess
                      )),
                      (match[2] = unquoted.slice(
                          0,
                          excess
                      ))),
                        match.slice(
                            0,
                            3
                        ));
                },
            },
            filter: {
                TAG: function (
                    nodeName
                ) {
                    return "*" === nodeName
                        ? function (
                        ) {
                            return !0;
                        }
                        : ((nodeName = nodeName
                            .replace(
                                runescape,
                                funescape
                            )
                            .toLowerCase(
                            )),
                        function (
                            elem
                        ) {
                            return (
                                elem.nodeName && elem.nodeName.toLowerCase(
                                ) === nodeName
                            );
                        });
                },
                CLASS: function (
                    className
                ) {
                    var pattern = classCache[className + " "];
                    return (
                        pattern ||
                ((pattern = new RegExp(
                    "(^|" +
                    whitespace +
                    ")" +
                    className +
                    "(" +
                    whitespace +
                    "|$)",
                )),
                classCache(
                    className,
                    function (
                        elem
                    ) {
                        return pattern.test(
                            elem.className ||
                      ("undefined" !== typeof elem.getAttribute &&
                        elem.getAttribute(
                            "class"
                        )) ||
                      "",
                        );
                    }
                ))
                    );
                },
                ATTR: function (
                    name, operator, check
                ) {
                    return function (
                        elem
                    ) {
                        var result = Sizzle.attr(
                            elem,
                            name
                        );
                        return null == result
                            ? "!=" === operator
                            : !operator
                                ? !0
                                : ((result += ""),
                                "=" === operator
                                    ? check === result
                                    : "!=" === operator
                                        ? check !== result
                                        : "^=" === operator
                                            ? check && 0 === result.indexOf(
                                                check
                                            )
                                            : "*=" === operator
                                                ? check && result.indexOf(
                                                    check
                                                ) > -1
                                                : "$=" === operator
                                                    ? check && result.slice(
                                                        -check.length
                                                    ) === check
                                                    : "~=" === operator
                                                        ? (" " + result + " ").indexOf(
                                                            check
                                                        ) > -1
                                                        : "|=" === operator
                                                            ? check === result ||
                        result.slice(
                            0,
                            check.length + 1
                        ) === check + "-"
                                                            : !1);
                    };
                },
                CHILD: function (
                    type, what, argument, first, last
                ) {
                    var simple = "nth" !== type.slice(
                            0,
                            3
                        ),
                        forward = "last" !== type.slice(
                            -4
                        ),
                        ofType = "of-type" === what;
                    return 1 === first && 0 === last
                        ? function (
                            elem
                        ) {
                            return !!elem.parentNode;
                        }
                        : function (
                            elem, context, xml
                        ) {
                            var cache,
                                outerCache,
                                node,
                                diff,
                                nodeIndex,
                                start,
                                dir =
                        forward !== simple ? "nextSibling" : "previousSibling",
                                parent = elem.parentNode,
                                name = ofType && elem.nodeName.toLowerCase(
                                ),
                                useCache = !xml && !ofType;
                            if (parent) {
                                if (simple) {
                                    for (; dir; ) {
                                        for (node = elem; (node = node[dir]); )
                                            if (
                                                ofType
                                                    ? node.nodeName.toLowerCase(
                                                    ) === name
                                                    : 1 === node.nodeType
                                            )
                                                return !1;
                                        start = dir =
                            "only" === type && !start && "nextSibling";
                                    }
                                    return !0;
                                }
                                if (
                                    ((start = [
                                        forward ? parent.firstChild : parent.lastChild,
                                    ]),
                                    forward && useCache)
                                )
                                    for (
                                        outerCache =
                            parent[expando] || (parent[expando] = {
                            }),
                                        cache = outerCache[type] || [],
                                        nodeIndex = cache[0] === dirruns && cache[1],
                                        diff = cache[0] === dirruns && cache[2],
                                        node = nodeIndex && parent.childNodes[nodeIndex];
                                        (node =
                            (++nodeIndex && node && node[dir]) ||
                            (diff = nodeIndex = 0) ||
                            start.pop(
                            ));

                                    )
                                        if (1 === node.nodeType && ++diff && elem === node) {
                                            outerCache[type] = [dirruns, nodeIndex, diff,];
                                            break;
                                        } else if (
                                            useCache &&
                            (cache = (elem[expando] || (elem[expando] = {
                            }))[
                                type
                            ]) &&
                            cache[0] === dirruns
                                        )
                                            diff = cache[1];
                                        else
                                            for (
                                                ;
                                                (node =
                                (++nodeIndex && node && node[dir]) ||
                                (diff = nodeIndex = 0) ||
                                start.pop(
                                ));

                                            )
                                                if (
                                                    (ofType
                                                        ? node.nodeName.toLowerCase(
                                                        ) === name
                                                        : 1 === node.nodeType) &&
                                ++diff
                                                ) {
                                                    if (
                                                        (useCache &&
                                    ((node[expando] || (node[expando] = {
                                    }))[
                                        type
                                    ] = [dirruns, diff,]),
                                                        elem === node)
                                                    )
                                                        break;
                                                }
                                return (
                                    (diff -= last),
                                    diff === first ||
                          (diff % first == 0 && diff / first >= 0)
                                );
                            }
                        };
                },
                PSEUDO: function (
                    pseudo, argument
                ) {
                    var args,
                        fn =
                  Expr.pseudos[pseudo] ||
                  Expr.setFilters[pseudo.toLowerCase(
                  )] ||
                  Sizzle.error(
                      "unsupported pseudo: " + pseudo
                  );
                    return fn[expando]
                        ? fn(
                            argument
                        )
                        : fn.length > 1
                            ? ((args = [pseudo, pseudo, "", argument,]),
                            Expr.setFilters.hasOwnProperty(
                                pseudo.toLowerCase(
                                )
                            )
                                ? markFunction(
                                    function (
                                        seed, matches1
                                    ) {
                                        for (
                                            var idx,
                                                matched = fn(
                                                    seed,
                                                    argument
                                                ),
                                                i = matched.length;
                                            i--;

                                        )
                                            (idx = indexOf.call(
                                                seed,
                                                matched[i]
                                            )),
                                            (seed[idx] = !(matches1[idx] = matched[i]));
                                    }
                                )
                                : function (
                                    elem
                                ) {
                                    return fn(
                                        elem,
                                        0,
                                        args
                                    );
                                })
                            : fn;
                },
            },
            pseudos: {
                not: markFunction(
                    function (
                        selector
                    ) {
                        var input = [],
                            results = [],
                            matcher = compile(
                                selector.replace(
                                    rtrim1,
                                    "$1"
                                )
                            );
                        return matcher[expando]
                            ? markFunction(
                                function (
                                    seed, matches1, context, xml
                                ) {
                                    for (
                                        var elem,
                                            unmatched = matcher(
                                                seed,
                                                null,
                                                xml,
                                                []
                                            ),
                                            i = seed.length;
                                        i--;

                                    )
                                        (elem = unmatched[i]) &&
                        (seed[i] = !(matches1[i] = elem));
                                }
                            )
                            : function (
                                elem, context, xml
                            ) {
                                return (
                                    (input[0] = elem),
                                    matcher(
                                        input,
                                        null,
                                        xml,
                                        results
                                    ),
                                    !results.pop(
                                    )
                                );
                            };
                    }
                ),
                has: markFunction(
                    function (
                        selector
                    ) {
                        return function (
                            elem
                        ) {
                            return Sizzle(
                                selector,
                                elem
                            ).length > 0;
                        };
                    }
                ),
                contains: markFunction(
                    function (
                        text
                    ) {
                        return function (
                            elem
                        ) {
                            return (
                                (elem.textContent || elem.innerText || getText(
                                    elem
                                )).indexOf(
                                    text,
                                ) > -1
                            );
                        };
                    }
                ),
                lang: markFunction(
                    function (
                        lang
                    ) {
                        return (
                            ridentifier.test(
                                lang || ""
                            ) ||
                  Sizzle.error(
                      "unsupported lang: " + lang
                  ),
                            (lang = lang.replace(
                                runescape,
                                funescape
                            ).toLowerCase(
                            )),
                            function (
                                elem
                            ) {
                                var elemLang;
                                do
                                    if (
                                        (elemLang = documentIsXML
                                            ? elem.getAttribute(
                                                "xml:lang"
                                            ) ||
                          elem.getAttribute(
                              "lang"
                          )
                                            : elem.lang)
                                    )
                                        return (
                                            (elemLang = elemLang.toLowerCase(
                                            )),
                                            elemLang === lang || 0 === elemLang.indexOf(
                                                lang + "-"
                                            )
                                        );
                                while ((elem = elem.parentNode) && 1 === elem.nodeType);
                                return !1;
                            }
                        );
                    }
                ),
                target: function (
                    elem
                ) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(
                        1
                    ) === elem.id;
                },
                root: function (
                    elem
                ) {
                    return docElem === elem;
                },
                focus: function (
                    elem
                ) {
                    return (
                        elem === document1.activeElement &&
                (!document1.hasFocus || document1.hasFocus(
                )) &&
                !!(elem.type || elem.href || ~elem.tabIndex)
                    );
                },
                enabled: function (
                    elem
                ) {
                    return elem.disabled === !1;
                },
                disabled: function (
                    elem
                ) {
                    return elem.disabled === !0;
                },
                checked: function (
                    elem
                ) {
                    var nodeName = elem.nodeName.toLowerCase(
                    );
                    return (
                        ("input" === nodeName && !!elem.checked) ||
                ("option" === nodeName && !!elem.selected)
                    );
                },
                selected: function (
                    elem
                ) {
                    return (
                        elem.parentNode && elem.parentNode.selectedIndex,
                        elem.selected === !0
                    );
                },
                empty: function (
                    elem
                ) {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling)
                        if (
                            elem.nodeName > "@" ||
                  3 === elem.nodeType ||
                  4 === elem.nodeType
                        )
                            return !1;
                    return !0;
                },
                parent: function (
                    elem
                ) {
                    return !Expr.pseudos.empty(
                        elem
                    );
                },
                header: function (
                    elem
                ) {
                    return /^h\d$/i.test(
                        elem.nodeName
                    );
                },
                input: function (
                    elem
                ) {
                    return /^(?:input|select|textarea|button)$/i.test(
                        elem.nodeName
                    );
                },
                button: function (
                    elem
                ) {
                    var name = elem.nodeName.toLowerCase(
                    );
                    return (
                        ("input" === name && "button" === elem.type) ||
                "button" === name
                    );
                },
                text: function (
                    elem
                ) {
                    var attr;
                    return (
                        "input" === elem.nodeName.toLowerCase(
                        ) &&
                "text" === elem.type &&
                (null == (attr = elem.getAttribute(
                    "type"
                )) ||
                  attr.toLowerCase(
                  ) === elem.type)
                    );
                },
                first: createPositionalPseudo(
                    function (
                    ) {
                        return [0,];
                    }
                ),
                last: createPositionalPseudo(
                    function (
                        matchIndexes, length
                    ) {
                        return [length - 1,];
                    }
                ),
                eq: createPositionalPseudo(
                    function (
                        matchIndexes,
                        length,
                        argument,
                    ) {
                        return [0 > argument ? argument + length : argument,];
                    }
                ),
                even: createPositionalPseudo(
                    function (
                        matchIndexes, length
                    ) {
                        for (var i = 0; length > i; i += 2) matchIndexes.push(
                            i
                        );
                        return matchIndexes;
                    }
                ),
                odd: createPositionalPseudo(
                    function (
                        matchIndexes, length
                    ) {
                        for (var i = 1; length > i; i += 2) matchIndexes.push(
                            i
                        );
                        return matchIndexes;
                    }
                ),
                lt: createPositionalPseudo(
                    function (
                        matchIndexes,
                        length,
                        argument,
                    ) {
                        for (
                            var i = 0 > argument ? argument + length : argument;
                            --i >= 0;

                        )
                            matchIndexes.push(
                                i
                            );
                        return matchIndexes;
                    }
                ),
                gt: createPositionalPseudo(
                    function (
                        matchIndexes,
                        length,
                        argument,
                    ) {
                        for (
                            var i = 0 > argument ? argument + length : argument;
                            ++i < length;

                        )
                            matchIndexes.push(
                                i
                            );
                        return matchIndexes;
                    }
                ),
            },
        });
        for (i in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0,
        })
            Expr.pseudos[i] = createInputPseudo(
                i
            );
        for (i in {
            submit: !0,
            reset: !0,
        })
            Expr.pseudos[i] = createButtonPseudo(
                i
            );
        function tokenize(
            selector, parseOnly
        ) {
            var matched,
                match,
                tokens,
                type,
                soFar,
                groups,
                cached = tokenCache[selector + " "];
            if (cached) return parseOnly
                ? 0
                : cached.slice(
                    0
                );
            for (soFar = selector, groups = [], Expr.preFilter; soFar; ) {
                (!matched || (match = rcomma.exec(
                    soFar
                ))) &&
            (match && (soFar = soFar.slice(
                match[0].length
            ) || soFar),
            groups.push(
                (tokens = [])
            )),
                (matched = !1),
                (match = rcombinators.exec(
                    soFar
                )) &&
              ((matched = match.shift(
              )),
              tokens.push(
                  {
                      value: matched,
                      type: match[0].replace(
                          rtrim1,
                          " "
                      ),
                  }
              ),
              (soFar = soFar.slice(
                  matched.length
              )));
                for (type in Expr.filter)
                    (match = matchExpr[type].exec(
                        soFar
                    )) &&
              (!Expr.preFilter[type] ||
                (match = Expr.preFilter[type](
                    match
                ))) &&
              ((matched = match.shift(
              )),
              tokens.push(
                  {
                      value: matched,
                      type: type,
                      matches: match,
                  }
              ),
              (soFar = soFar.slice(
                  matched.length
              )));
                if (!matched) break;
            }
            return parseOnly
                ? soFar.length
                : soFar
                    ? Sizzle.error(
                        selector
                    )
                    : tokenCache(
                        selector,
                        groups
                    ).slice(
                        0
                    );
        }
        function toSelector(
            tokens
        ) {
            for (var i = 0, len = tokens.length, selector = ""; len > i; i++)
                selector += tokens[i].value;
            return selector;
        }
        function addCombinator(
            matcher, combinator, base
        ) {
            var dir = combinator.dir,
                checkNonElements = base && "parentNode" === dir,
                doneName = done++;
            return combinator.first
                ? function (
                    elem, context, xml
                ) {
                    for (; (elem = elem[dir]); )
                        if (1 === elem.nodeType || checkNonElements)
                            return matcher(
                                elem,
                                context,
                                xml
                            );
                }
                : function (
                    elem, context, xml
                ) {
                    var data,
                        cache,
                        outerCache,
                        dirkey = dirruns + " " + doneName;
                    if (xml)
                        for (; (elem = elem[dir]); )
                            if (1 === elem.nodeType || checkNonElements) {
                                if (matcher(
                                    elem,
                                    context,
                                    xml
                                )) return !0;
                            } else
                                for (; (elem = elem[dir]); )
                                    if (1 === elem.nodeType || checkNonElements) {
                                        if (
                                            ((outerCache = elem[expando] || (elem[expando] = {
                                            })),
                                            (cache = outerCache[dir]) && cache[0] === dirkey)
                                        ) {
                                            if ((data = cache[1]) === !0 || cachedruns === data)
                                                return !0 === data;
                                        } else if (
                                            ((cache = outerCache[dir] = [dirkey,]),
                                            (cache[1] =
                            matcher(
                                elem,
                                context,
                                xml
                            ) || cachedruns),
                                            cache[1] === !0)
                                        )
                                            return !0;
                                    }
                };
        }
        function elementMatcher(
            matchers
        ) {
            return matchers.length > 1
                ? function (
                    elem, context, xml
                ) {
                    for (var i = matchers.length; i--; )
                        if (!matchers[i](
                            elem,
                            context,
                            xml
                        )) return !1;
                    return !0;
                }
                : matchers[0];
        }
        function condense(
            unmatched, map, filter, context, xml
        ) {
            for (
                var elem, newUnmatched = [], i = 0, len = unmatched.length;
                len > i;
                i++
            )
                (elem = unmatched[i]) &&
            (!filter || filter(
                elem,
                context,
                xml
            )) &&
            (newUnmatched.push(
                elem
            ), null != map && map.push(
                i
            ));
            return newUnmatched;
        }
        function setMatcher(
            preFilter,
            selector,
            matcher,
            postFilter,
            postFinder,
            postSelector,
        ) {
            return (
                postFilter &&
            !postFilter[expando] &&
            (postFilter = setMatcher(
                postFilter
            )),
                postFinder &&
            !postFinder[expando] &&
            (postFinder = setMatcher(
                postFinder,
                postSelector
            )),
                markFunction(
                    function (
                        seed, results, context, xml
                    ) {
                        var temp,
                            i,
                            elem,
                            preMap = [],
                            postMap = [],
                            preexisting = results.length,
                            elems =
                seed ||
                multipleContexts(
                    selector || "*",
                    context.nodeType ? [context,] : context,
                    [],
                ),
                            matcherIn =
                preFilter && (seed || !selector)
                    ? condense(
                        elems,
                        preMap,
                        preFilter,
                        context,
                        xml
                    )
                    : elems,
                            matcherOut = matcher
                                ? postFinder || (seed ? preFilter : preexisting || postFilter)
                                    ? []
                                    : results
                                : matcherIn;
                        if (
                            (matcher && matcher(
                                matcherIn,
                                matcherOut,
                                context,
                                xml
                            ),
                            postFilter)
                        )
                            for (
                                temp = condense(
                                    matcherOut,
                                    postMap
                                ),
                                postFilter(
                                    temp,
                                    [],
                                    context,
                                    xml
                                ),
                                i = temp.length;
                                i--;

                            )
                                (elem = temp[i]) &&
                  (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
                        if (seed) {
                            if (postFinder || preFilter) {
                                if (postFinder) {
                                    for (temp = [], i = matcherOut.length; i--; )
                                        (elem = matcherOut[i]) && temp.push(
                                            (matcherIn[i] = elem)
                                        );
                                    postFinder(
                                        null, (
                                            matcherOut = []),
                                        temp,
                                        xml
                                    );
                                }
                                for (i = matcherOut.length; i--; )
                                    (elem = matcherOut[i]) &&
                    (temp = postFinder
                        ? indexOf.call(
                            seed,
                            elem
                        )
                        : preMap[i]) >
                      -1 &&
                    (seed[temp] = !(results[temp] = elem));
                            }
                        } else (matcherOut = condense(
                            matcherOut === results
                                ? matcherOut.splice(
                                    preexisting,
                                    matcherOut.length
                                )
                                : matcherOut
                        )), postFinder
                            ? postFinder(
                                null,
                                results,
                                matcherOut,
                                xml
                            )
                            : push.apply(
                                results,
                                matcherOut
                            );
                    }
                )
            );
        }
        function matcherFromTokens(
            tokens
        ) {
            for (
                var checkContext,
                    matcher,
                    j,
                    len = tokens.length,
                    leadingRelative = Expr.relative[tokens[0].type],
                    implicitRelative = leadingRelative || Expr.relative[" "],
                    i = leadingRelative ? 1 : 0,
                    matchContext = addCombinator(
                        function (
                            elem
                        ) {
                            return checkContext === elem;
                        },
                        implicitRelative,
                        !0,
                    ),
                    matchAnyContext = addCombinator(
                        function (
                            elem
                        ) {
                            return indexOf.call(
                                checkContext,
                                elem
                            ) > -1;
                        },
                        implicitRelative,
                        !0,
                    ),
                    matchers = [
                        function (
                            elem, context, xml
                        ) {
                            return (
                                (!leadingRelative && (xml || context !== outermostContext)) ||
                  ((checkContext = context).nodeType
                      ? matchContext(
                          elem,
                          context,
                          xml
                      )
                      : matchAnyContext(
                          elem,
                          context,
                          xml
                      ))
                            );
                        },
                    ];
                len > i;
                i++
            )
                if ((matcher = Expr.relative[tokens[i].type]))
                    matchers = [addCombinator(
                        elementMatcher(
                            matchers
                        ),
                        matcher
                    ),];
                else {
                    if (
                        ((matcher = Expr.filter[tokens[i].type].apply(
                            null,
                            tokens[i].matches,
                        )),
                        matcher[expando])
                    ) {
                        for (j = ++i; len > j; j++)
                            if (Expr.relative[tokens[j].type]) break;
                        return setMatcher(
                            i > 1 && elementMatcher(
                                matchers
                            ),
                            i > 1 &&
                  toSelector(
                      tokens.slice(
                          0,
                          i - 1
                      )
                  ).replace(
                      rtrim1,
                      "$1"
                  ),
                            matcher,
                            j > i && matcherFromTokens(
                                tokens.slice(
                                    i,
                                    j
                                )
                            ),
                            len > j && matcherFromTokens(
                                (tokens = tokens.slice(
                                    j
                                ))
                            ),
                            len > j && toSelector(
                                tokens
                            ),
                        );
                    }
                    matchers.push(
                        matcher
                    );
                }
            return elementMatcher(
                matchers
            );
        }
        function matcherFromGroupMatchers(
            elementMatchers, setMatchers
        ) {
            var matcherCachedRuns = 0,
                bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function (
                    seed, context, xml, results, expandContext
                ) {
                    var elem,
                        j,
                        matcher,
                        setMatched = [],
                        matchedCount = 0,
                        i = "0",
                        unmatched = seed && [],
                        outermost = null != expandContext,
                        contextBackup = outermostContext,
                        dirrunsUnique = (dirruns +=
                null == contextBackup
                    ? 1
                    : Math.random(
                    ) || 0.1);
                    for (
                        outermost &&
              ((outermostContext = context !== document1 && context),
              (cachedruns = matcherCachedRuns));
                        null !=
              (elem = (seed ||
                (byElement &&
                  Expr.find.TAG(
                      "*",
                      (expandContext && context.parentNode) || context,
                  )))[i]);
                        i++
                    ) {
                        if (byElement && elem) {
                            for (; (matcher = elementMatchers[j++]); )
                                if (matcher(
                                    elem,
                                    context,
                                    xml
                                )) {
                                    results.push(
                                        elem
                                    );
                                    break;
                                }
                            outermost &&
                  ((dirruns = dirrunsUnique),
                  (cachedruns = ++matcherCachedRuns));
                        }
                        bySet &&
                ((elem = !matcher && elem) && matchedCount--,
                seed && unmatched.push(
                    elem
                ));
                    }
                    if (((matchedCount += i), bySet && i !== matchedCount)) {
                        for (; (matcher = setMatchers[j++]); )
                            matcher(
                                unmatched,
                                setMatched,
                                context,
                                xml
                            );
                        if (seed) {
                            if (matchedCount > 0)
                                for (; i--; )
                                    unmatched[i] ||
                      setMatched[i] ||
                      (setMatched[i] = arr.pop.call(
                          results
                      ));
                            setMatched = condense(
                                setMatched
                            );
                        }
                        push.apply(
                            results,
                            setMatched
                        ),
                        outermost &&
                  !seed &&
                  setMatched.length > 0 &&
                  matchedCount + setMatchers.length > 1 &&
                  Sizzle.uniqueSort(
                      results
                  );
                    }
                    return (
                        outermost &&
                ((dirruns = dirrunsUnique), (outermostContext = contextBackup)),
                        unmatched
                    );
                };
            return bySet
                ? markFunction(
                    superMatcher
                )
                : superMatcher;
        }
        compile = Sizzle.compile = function (
            selector, group
        ) {
            var i,
                setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[selector + " "];
            if (!cached) {
                for (group || (group = tokenize(
                    selector
                )), i = group.length; i--; )
                    (cached = matcherFromTokens(
                        group[i]
                    )),
                    cached[expando]
                        ? setMatchers.push(
                            cached
                        )
                        : elementMatchers.push(
                            cached
                        );
                cached = compilerCache(
                    selector,
                    matcherFromGroupMatchers(
                        elementMatchers,
                        setMatchers
                    ),
                );
            }
            return cached;
        };
        function multipleContexts(
            selector, contexts, results
        ) {
            for (var i = 0, len = contexts.length; len > i; i++)
                Sizzle(
                    selector,
                    contexts[i],
                    results
                );
            return results;
        }
        function select(
            selector, context, results, seed
        ) {
            var i,
                tokens,
                token,
                find,
                match = tokenize(
                    selector
                );
            if (!seed) {
                if (1 === match.length) {
                    if (
                        ((tokens = match[0] = match[0].slice(
                            0
                        )),
                        tokens.length > 2 &&
                (token = tokens[0]).type === "ID" &&
                9 === context.nodeType &&
                !documentIsXML &&
                Expr.relative[tokens[1].type])
                    ) {
                        if (
                            ((context = Expr.find.ID(
                                token.matches[0].replace(
                                    runescape,
                                    funescape
                                ),
                                context,
                            )[0]),
                            !context)
                        )
                            return results;
                        selector = selector.slice(
                            tokens.shift(
                            ).value.length
                        );
                    }
                    for (
                        i = matchExpr.needsContext.test(
                            selector
                        )
                            ? 0
                            : tokens.length;
                        i--;

                    ) {
                        if (((token = tokens[i]), Expr.relative[token.type])) break;
                        if ((find = Expr.find[token.type])) {
                            if (
                                (seed = find(
                                    token.matches[0].replace(
                                        runescape,
                                        funescape
                                    ),
                                    (rsibling.test(
                                        tokens[0].type
                                    ) && context.parentNode) ||
                      context,
                                ))
                            ) {
                                if (
                                    (tokens.splice(
                                        i,
                                        1
                                    ),
                                    (selector = seed.length && toSelector(
                                        tokens
                                    )),
                                    !selector)
                                )
                                    return push.apply(
                                        results,
                                        slice.call(
                                            seed,
                                            0
                                        )
                                    ), results;
                                break;
                            }
                        }
                    }
                }
            }
            return (
                compile(
                    selector,
                    match
                )(
                    seed,
                    context,
                    documentIsXML,
                    results,
                    rsibling.test(
                        selector
                    ),
                ),
                results
            );
        }
        Expr.pseudos.nth = Expr.pseudos.eq;
        function setFilters(
        ) {}
        (Expr.filters = setFilters.prototype = Expr.pseudos),
        (Expr.setFilters = new setFilters(
        )),
        setDocument(
        ),
        (Sizzle.attr = jQuery.attr),
        (jQuery.find = Sizzle),
        (jQuery.expr = Sizzle.selectors),
        (jQuery.expr[":"] = jQuery.expr.pseudos),
        (jQuery.unique = Sizzle.uniqueSort),
        (jQuery.text = Sizzle.getText),
        (jQuery.isXMLDoc = Sizzle.isXML),
        (jQuery.contains = Sizzle.contains);
    })(
        window
    );
    var rneedsContext = jQuery.expr.match.needsContext;
    jQuery.fn.extend(
        {
            find: function (
                selector
            ) {
                var i,
                    ret,
                    self,
                    len = this.length;
                if ("string" !== typeof selector)
                    return (
                        (self = this),
                        this.pushStack(
                            jQuery(
                                selector
                            ).filter(
                                function (
                                ) {
                                    for (i = 0; len > i; i++)
                                        if (jQuery.contains(
                                            self[i],
                                            this
                                        )) return !0;
                                }
                            ),
                        )
                    );
                for (ret = [], i = 0; len > i; i++) jQuery.find(
                    selector,
                    this[i],
                    ret
                );
                return (
                    (ret = this.pushStack(
                        len > 1
                            ? jQuery.unique(
                                ret
                            )
                            : ret
                    )),
                    (ret.selector = (this.selector ? this.selector + " " : "") + selector),
                    ret
                );
            },
            has: function (
                target
            ) {
                var i,
                    targets = jQuery(
                        target,
                        this
                    ),
                    len = targets.length;
                return this.filter(
                    function (
                    ) {
                        for (i = 0; len > i; i++)
                            if (jQuery.contains(
                                this,
                                targets[i]
                            )) return !0;
                    }
                );
            },
            not: function (
                selector
            ) {
                return this.pushStack(
                    winnow(
                        this,
                        selector,
                        !1
                    )
                );
            },
            filter: function (
                selector
            ) {
                return this.pushStack(
                    winnow(
                        this,
                        selector,
                        !0
                    )
                );
            },
            is: function (
                selector
            ) {
                return (
                    !!selector &&
        ("string" == typeof selector
            ? rneedsContext.test(
                selector
            )
                ? jQuery(
                    selector,
                    this.context
                ).index(
                    this[0]
                ) >= 0
                : jQuery.filter(
                    selector,
                    this
                ).length > 0
            : this.filter(
                selector
            ).length > 0)
                );
            },
            closest: function (
                selectors, context
            ) {
                for (
                    var cur,
                        i = 0,
                        l = this.length,
                        ret = [],
                        pos =
            rneedsContext.test(
                selectors
            ) || "string" !== typeof selectors
                ? jQuery(
                    selectors,
                    context || this.context
                )
                : 0;
                    l > i;
                    i++
                )
                    for (
                        cur = this[i];
                        cur && cur.ownerDocument && context !== cur && 11 !== cur.nodeType;

                    ) {
                        if (
                            pos
                                ? pos.index(
                                    cur
                                ) > -1
                                : jQuery.find.matchesSelector(
                                    cur,
                                    selectors
                                )
                        ) {
                            ret.push(
                                cur
                            );
                            break;
                        }
                        cur = cur.parentNode;
                    }
                return this.pushStack(
                    ret.length > 1
                        ? jQuery.unique(
                            ret
                        )
                        : ret
                );
            },
            index: function (
                elem
            ) {
                return !elem
                    ? this[0] && this[0].parentNode
                        ? this.first(
                        ).prevAll(
                        ).length
                        : -1
                    : "string" == typeof elem
                        ? jQuery.inArray(
                            this[0],
                            jQuery(
                                elem
                            )
                        )
                        : jQuery.inArray(
                            elem.jquery ? elem[0] : elem,
                            this
                        );
            },
            add: function (
                selector, context
            ) {
                var set =
          "string" == typeof selector
              ? jQuery(
                  selector,
                  context
              )
              : jQuery.makeArray(
                  selector && selector.nodeType ? [selector,] : selector,
              ),
                    all = jQuery.merge(
                        this.get(
                        ),
                        set
                    );
                return this.pushStack(
                    jQuery.unique(
                        all
                    )
                );
            },
            addBack: function (
                selector
            ) {
                return this.add(
                    null == selector
                        ? this.prevObject
                        : this.prevObject.filter(
                            selector
                        ),
                );
            },
        }
    ),
    (jQuery.fn.andSelf = jQuery.fn.addBack);
    function sibling(
        cur, dir
    ) {
        do cur = cur[dir];
        while (cur && 1 !== cur.nodeType);
        return cur;
    }
    jQuery.each(
        {
            parent: function (
                elem
            ) {
                var parent = elem.parentNode;
                return parent && 11 !== parent.nodeType ? parent : null;
            },
            parents: function (
                elem
            ) {
                return jQuery.dir(
                    elem,
                    "parentNode"
                );
            },
            parentsUntil: function (
                elem, i, until
            ) {
                return jQuery.dir(
                    elem,
                    "parentNode",
                    until
                );
            },
            next: function (
                elem
            ) {
                return sibling(
                    elem,
                    "nextSibling"
                );
            },
            prev: function (
                elem
            ) {
                return sibling(
                    elem,
                    "previousSibling"
                );
            },
            nextAll: function (
                elem
            ) {
                return jQuery.dir(
                    elem,
                    "nextSibling"
                );
            },
            prevAll: function (
                elem
            ) {
                return jQuery.dir(
                    elem,
                    "previousSibling"
                );
            },
            nextUntil: function (
                elem, i, until
            ) {
                return jQuery.dir(
                    elem,
                    "nextSibling",
                    until
                );
            },
            prevUntil: function (
                elem, i, until
            ) {
                return jQuery.dir(
                    elem,
                    "previousSibling",
                    until
                );
            },
            siblings: function (
                elem
            ) {
                return jQuery.sibling(
                    (elem.parentNode || {
                    }).firstChild,
                    elem
                );
            },
            children: function (
                elem
            ) {
                return jQuery.sibling(
                    elem.firstChild
                );
            },
            contents: function (
                elem
            ) {
                return jQuery.nodeName(
                    elem,
                    "iframe"
                )
                    ? elem.contentDocument || elem.contentWindow.document
                    : jQuery.merge(
                        [],
                        elem.childNodes
                    );
            },
        },
        function (
            name, fn
        ) {
            jQuery.fn[name] = function (
                until, selector
            ) {
                var ret = jQuery.map(
                    this,
                    fn,
                    until
                );
                return (
                    /Until$/.test(
                        name
                    ) || (selector = until),
                    selector &&
            "string" == typeof selector &&
            (ret = jQuery.filter(
                selector,
                ret
            )),
                    (ret =
            this.length > 1 &&
            !{
                children: !0,
                contents: !0,
                next: !0,
                prev: !0,
            }[name]
                ? jQuery.unique(
                    ret
                )
                : ret),
                    this.length > 1 &&
            /^(?:parents|prev(?:Until|All))/.test(
                name
            ) &&
            (ret = ret.reverse(
            )),
                    this.pushStack(
                        ret
                    )
                );
            };
        },
    ),
    jQuery.extend(
        {
            filter: function (
                expr, elems, not
            ) {
                return (
                    not && (expr = ":not(" + expr + ")"),
                    1 === elems.length
                        ? jQuery.find.matchesSelector(
                            elems[0],
                            expr
                        )
                            ? [elems[0],]
                            : []
                        : jQuery.find.matches(
                            expr,
                            elems
                        )
                );
            },
            dir: function (
                elem, dir, until
            ) {
                for (
                    var matched = [], cur = elem[dir];
                    cur &&
          9 !== cur.nodeType &&
          (void 0 === until || 1 !== cur.nodeType || !jQuery(
              cur
          ).is(
              until
          ));

                )
                    1 === cur.nodeType && matched.push(
                        cur
                    ), (cur = cur[dir]);
                return matched;
            },
            sibling: function (
                n, elem
            ) {
                for (var r = []; n; n = n.nextSibling)
                    1 === n.nodeType && elem !== n && r.push(
                        n
                    );
                return r;
            },
        }
    );
    function winnow(
        elements, qualifier, keep
    ) {
        if (((qualifier ||= 0), jQuery.isFunction(
            qualifier
        )))
            return jQuery.grep(
                elements,
                function (
                    elem, i
                ) {
                    var retVal = !!qualifier.call(
                        elem,
                        i,
                        elem
                    );
                    return keep === retVal;
                }
            );
        if (qualifier.nodeType)
            return jQuery.grep(
                elements,
                function (
                    elem
                ) {
                    return (elem === qualifier) === keep;
                }
            );
        if ("string" == typeof qualifier) {
            var filtered = jQuery.grep(
                elements,
                function (
                    elem
                ) {
                    return 1 === elem.nodeType;
                }
            );
            if (/^.[^:#\[\.,]*$/.test(
                qualifier
            ))
                return jQuery.filter(
                    qualifier,
                    filtered,
                    !keep
                );
            qualifier = jQuery.filter(
                qualifier,
                filtered
            );
        }
        return jQuery.grep(
            elements,
            function (
                elem
            ) {
                return jQuery.inArray(
                    elem,
                    qualifier
                ) >= 0 === keep;
            }
        );
    }
    function createSafeFragment(
        document1
    ) {
        var list = nodeNames.split(
                "|"
            ),
            safeFrag = document1.createDocumentFragment(
            );
        if (safeFrag.createElement)
            for (; list.length; ) safeFrag.createElement(
                list.pop(
                )
            );
        return safeFrag;
    }
    var nodeNames =
      "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
        rnoshimcache = new RegExp(
            "<(?:" + nodeNames + ")[\\s/>]",
            "i"
        ),
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
        rscriptType = /^$|\/(?:java|ecma)script/i,
        rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        wrapMap = {
            option: [1, "<select multiple='multiple'>", "</select>",],
            legend: [1, "<fieldset>", "</fieldset>",],
            area: [1, "<map>", "</map>",],
            param: [1, "<object>", "</object>",],
            thead: [1, "<table>", "</table>",],
            tr: [2, "<table><tbody>", "</tbody></table>",],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>",],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>",],
            _default: jQuery.support.htmlSerialize
                ? [0, "", "",]
                : [1, "X<div>", "</div>",],
        },
        safeFragment = createSafeFragment(
            document
        ),
        fragmentDiv = safeFragment.appendChild(
            document.createElement(
                "div"
            )
        );
    (wrapMap.optgroup = wrapMap.option),
    (wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption =
      wrapMap.thead),
    (wrapMap.th = wrapMap.td),
    jQuery.fn.extend(
        {
            text: function (
                value
            ) {
                return jQuery.access(
                    this,
                    function (
                        value
                    ) {
                        return void 0 === value
                            ? jQuery.text(
                                this
                            )
                            : this.empty(
                            ).append(
                                (
                                    (this[0] && this[0].ownerDocument) ||
                    document
                                ).createTextNode(
                                    value
                                ),
                            );
                    },
                    null,
                    value,
                    arguments.length,
                );
            },
            wrapAll: function (
                html
            ) {
                if (jQuery.isFunction(
                    html
                ))
                    return this.each(
                        function (
                            i
                        ) {
                            jQuery(
                                this
                            ).wrapAll(
                                html.call(
                                    this,
                                    i
                                )
                            );
                        }
                    );
                if (this[0]) {
                    var wrap = jQuery(
                        html,
                        this[0].ownerDocument
                    ).eq(
                        0
                    ).clone(
                        !0
                    );
                    this[0].parentNode && wrap.insertBefore(
                        this[0]
                    ),
                    wrap
                        .map(
                            function (
                            ) {
                                for (
                                    var elem = this;
                                    elem.firstChild && elem.firstChild.nodeType === 1;

                                )
                                    elem = elem.firstChild;
                                return elem;
                            }
                        )
                        .append(
                            this
                        );
                }
                return this;
            },
            wrapInner: function (
                html
            ) {
                return jQuery.isFunction(
                    html
                )
                    ? this.each(
                        function (
                            i
                        ) {
                            jQuery(
                                this
                            ).wrapInner(
                                html.call(
                                    this,
                                    i
                                )
                            );
                        }
                    )
                    : this.each(
                        function (
                        ) {
                            var self = jQuery(
                                    this
                                ),
                                contents = self.contents(
                                );
                            contents.length
                                ? contents.wrapAll(
                                    html
                                )
                                : self.append(
                                    html
                                );
                        }
                    );
            },
            wrap: function (
                html
            ) {
                var isFunction = jQuery.isFunction(
                    html
                );
                return this.each(
                    function (
                        i
                    ) {
                        jQuery(
                            this
                        ).wrapAll(
                            isFunction
                                ? html.call(
                                    this,
                                    i
                                )
                                : html
                        );
                    }
                );
            },
            unwrap: function (
            ) {
                return this.parent(
                )
                    .each(
                        function (
                        ) {
                            jQuery.nodeName(
                                this,
                                "body"
                            ) ||
              jQuery(
                  this
              ).replaceWith(
                  this.childNodes
              );
                        }
                    )
                    .end(
                    );
            },
            append: function (
            ) {
                return this.domManip(
                    arguments,
                    !0,
                    function (
                        elem
                    ) {
                        (1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType) &&
            this.appendChild(
                elem
            );
                    }
                );
            },
            prepend: function (
            ) {
                return this.domManip(
                    arguments,
                    !0,
                    function (
                        elem
                    ) {
                        (1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType) &&
            this.insertBefore(
                elem,
                this.firstChild
            );
                    }
                );
            },
            before: function (
            ) {
                return this.domManip(
                    arguments,
                    !1,
                    function (
                        elem
                    ) {
                        this.parentNode && this.parentNode.insertBefore(
                            elem,
                            this
                        );
                    }
                );
            },
            after: function (
            ) {
                return this.domManip(
                    arguments,
                    !1,
                    function (
                        elem
                    ) {
                        this.parentNode &&
            this.parentNode.insertBefore(
                elem,
                this.nextSibling
            );
                    }
                );
            },
            remove: function (
                selector, keepData
            ) {
                for (var elem, i = 0; null != (elem = this[i]); i++)
                    (!selector || jQuery.filter(
                        selector,
                        [elem,]
                    ).length > 0) &&
            (keepData || 1 !== elem.nodeType || jQuery.cleanData(
                getAll(
                    elem
                )
            ),
            elem.parentNode &&
              (keepData &&
                jQuery.contains(
                    elem.ownerDocument,
                    elem
                ) &&
                setGlobalEval(
                    getAll(
                        elem,
                        "script"
                    )
                ),
              elem.parentNode.removeChild(
                  elem
              )));
                return this;
            },
            empty: function (
            ) {
                for (var elem, i = 0; null != (elem = this[i]); i++) {
                    for (
                        1 === elem.nodeType && jQuery.cleanData(
                            getAll(
                                elem,
                                !1
                            )
                        );
                        elem.firstChild;

                    )
                        elem.removeChild(
                            elem.firstChild
                        );
                    elem.options &&
            jQuery.nodeName(
                elem,
                "select"
            ) &&
            (elem.options.length = 0);
                }
                return this;
            },
            clone: function (
                dataAndEvents, deepDataAndEvents
            ) {
                return (
                    (dataAndEvents = null == dataAndEvents ? !1 : dataAndEvents),
                    (deepDataAndEvents =
            null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents),
                    this.map(
                        function (
                        ) {
                            return jQuery.clone(
                                this,
                                dataAndEvents,
                                deepDataAndEvents
                            );
                        }
                    )
                );
            },
            html: function (
                value
            ) {
                return jQuery.access(
                    this,
                    function (
                        value
                    ) {
                        var elem = this[0] || {
                            },
                            i = 0,
                            l = this.length;
                        if (void 0 === value)
                            return 1 === elem.nodeType
                                ? elem.innerHTML.replace(
                                    rinlinejQuery,
                                    ""
                                )
                                : void 0;
                        if (
                            "string" == typeof value &&
              !/<(?:script|style|link)/i.test(
                  value
              ) &&
              (jQuery.support.htmlSerialize || !rnoshimcache.test(
                  value
              )) &&
              (jQuery.support.leadingWhitespace ||
                !rleadingWhitespace.test(
                    value
                )) &&
              !wrapMap[(rtagName.exec(
                  value
              ) || ["", "",])[1].toLowerCase(
              )]
                        ) {
                            value = value.replace(
                                rxhtmlTag,
                                "<$1></$2>"
                            );
                            try {
                                for (; l > i; i++)
                                    (elem = this[i] || {
                                    }),
                                    1 === elem.nodeType &&
                      (jQuery.cleanData(
                          getAll(
                              elem,
                              !1
                          )
                      ),
                      (elem.innerHTML = value));
                                elem = 0;
                            } catch (e) {}
                        }
                        elem && this.empty(
                        ).append(
                            value
                        );
                    },
                    null,
                    value,
                    arguments.length,
                );
            },
            replaceWith: function (
                value
            ) {
                var isFunc = jQuery.isFunction(
                    value
                );
                return (
                    isFunc ||
            "string" == typeof value ||
            (value = jQuery(
                value
            ).not(
                this
            ).detach(
            )),
                    this.domManip(
                        [value,],
                        !0,
                        function (
                            elem
                        ) {
                            var next = this.nextSibling,
                                parent = this.parentNode;
                            parent && (jQuery(
                                this
                            ).remove(
                            ), parent.insertBefore(
                                elem,
                                next
                            ));
                        }
                    )
                );
            },
            detach: function (
                selector
            ) {
                return this.remove(
                    selector,
                    !0
                );
            },
            domManip: function (
                args, table, callback
            ) {
                args = core_concat.apply(
                    [],
                    args
                );
                var first,
                    node,
                    scripts,
                    fragment,
                    i = 0,
                    l = this.length,
                    value = args[0],
                    isFunction = jQuery.isFunction(
                        value
                    );
                if (
                    isFunction ||
          !(
              1 >= l ||
            "string" !== typeof value ||
            jQuery.support.checkClone ||
            !/checked\s*(?:[^=]|=\s*.checked.)/i.test(
                value
            )
          )
                )
                    return this.each(
                        function (
                            index
                        ) {
                            var self = this.eq(
                                index
                            );
                            isFunction &&
              (args[0] = value.call(
                  this,
                  index,
                  table
                      ? self.html(
                      )
                      : void 0
              )),
                            self.domManip(
                                args,
                                table,
                                callback
                            );
                        }
                    );
                if (l) {
                    if (
                        ((fragment = jQuery.buildFragment(
                            args,
                            this[0].ownerDocument,
                            !1,
                            this,
                        )),
                        (first = fragment.firstChild),
                        fragment.childNodes.length === 1 && (fragment = first),
                        first)
                    ) {
                        for (
                            table &&= jQuery.nodeName(
                                first,
                                "tr"
                            ),
                            scripts = jQuery.map(
                                getAll(
                                    fragment,
                                    "script"
                                ),
                                disableScript
                            ),
                            scripts.length;
                            l > i;
                            i++
                        )
                            (node = fragment),
                            i !== l - 1 &&
                  ((node = jQuery.clone(
                      node,
                      !0,
                      !0
                  )),
                  scripts.length &&
                    jQuery.merge(
                        scripts,
                        getAll(
                            node,
                            "script"
                        )
                    )),
                            callback.call(
                                table && jQuery.nodeName(
                                    this[i],
                                    "table"
                                )
                                    ? findOrAppend(
                                        this[i],
                                        "tbody"
                                    )
                                    : this[i],
                                node,
                                i,
                            );
                        if (scripts.length)
                            for (
                                scripts[scripts.length - 1].ownerDocument,
                                jQuery.map(
                                    scripts,
                                    restoreScript
                                ),
                                i = 0;
                                i < scripts.length;
                                i++
                            )
                                (node = scripts[i]),
                                rscriptType.test(
                                    node.type || ""
                                ) &&
                    !jQuery._data(
                        node,
                        "globalEval"
                    ) &&
                    jQuery.contains(
                        scripts[scripts.length - 1].ownerDocument,
                        node,
                    ) &&
                    (node.src
                        ? jQuery.ajax(
                            {
                                url: node.src,
                                type: "GET",
                                dataType: "script",
                                async: !1,
                                global: !1,
                                throws: !0,
                            }
                        )
                        : jQuery.globalEval(
                            (
                                node.text ||
                            node.textContent ||
                            node.innerHTML ||
                            ""
                            ).replace(
                                rcleanScript,
                                ""
                            ),
                        ));
                        fragment = first = null;
                    }
                }
                return this;
            },
        }
    );
    function findOrAppend(
        elem, tag
    ) {
        return (
            elem.getElementsByTagName(
                tag
            )[0] ||
      elem.appendChild(
          elem.ownerDocument.createElement(
              tag
          )
      )
        );
    }
    function disableScript(
        elem
    ) {
        var attr = elem.getAttributeNode(
            "type"
        );
        return (elem.type = (attr && attr.specified) + "/" + elem.type), elem;
    }
    function restoreScript(
        elem
    ) {
        var match = /^true\/(.*)/.exec(
            elem.type
        );
        return match
            ? (elem.type = match[1])
            : elem.removeAttribute(
                "type"
            ), elem;
    }
    function setGlobalEval(
        elems, refElements
    ) {
        for (var elem, i = 0; null != (elem = elems[i]); i++)
            jQuery._data(
                elem,
                "globalEval",
                !refElements || jQuery._data(
                    refElements[i],
                    "globalEval"
                ),
            );
    }
    function cloneCopyEvent(
        src, dest
    ) {
        if (1 !== dest.nodeType || !jQuery.hasData(
            src
        )) return;
        var type,
            i,
            oldData = jQuery._data(
                src
            ),
            curData = jQuery._data(
                dest,
                oldData
            ),
            events = oldData.events;
        if (events) {
            delete curData.handle, (curData.events = {
            });
            for (type in events)
                for (i = 0, events[type].length; i < events[type].length; i++)
                    jQuery.event.add(
                        dest,
                        type,
                        events[type][i]
                    );
        }
        curData.data && (curData.data = jQuery.extend(
            {
            },
            curData.data
        ));
    }
    function fixCloneNodeIssues(
        src, dest
    ) {
        var nodeName, e, data;
        if (1 !== dest.nodeType) return;
        if (
            ((nodeName = dest.nodeName.toLowerCase(
            )),
            !jQuery.support.noCloneEvent && dest[jQuery.expando])
        ) {
            data = jQuery._data(
                dest
            );
            for (e in data.events) jQuery.removeEvent(
                dest,
                e,
                data.handle
            );
            dest.removeAttribute(
                jQuery.expando
            );
        }
        "script" === nodeName && dest.text !== src.text
            ? ((disableScript(
                dest
            ).text = src.text), restoreScript(
                dest
            ))
            : "object" === nodeName
                ? (dest.parentNode && (dest.outerHTML = src.outerHTML),
                jQuery.support.html5Clone &&
          src.innerHTML &&
          !jQuery.trim(
              dest.innerHTML
          ) &&
          (dest.innerHTML = src.innerHTML))
                : "input" === nodeName && manipulation_rcheckableType.test(
                    src.type
                )
                    ? ((dest.defaultChecked = dest.checked = src.checked),
                    dest.value !== src.value && (dest.value = src.value))
                    : "option" === nodeName
                        ? (dest.defaultSelected = dest.selected = src.defaultSelected)
                        : ("input" === nodeName || "textarea" === nodeName) &&
        (dest.defaultValue = src.defaultValue);
    }
    jQuery.each(
        {
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith",
        },
        function (
            name, original
        ) {
            jQuery.fn[name] = function (
                selector
            ) {
                for (
                    var elems,
                        i = 0,
                        ret = [],
                        insert = jQuery(
                            selector
                        ),
                        last = insert.length - 1;
                    last >= i;
                    i++
                )
                    (elems = i === last
                        ? this
                        : this.clone(
                            !0
                        )),
                    jQuery(
                        insert[i]
                    )[original](
                        elems
                    ),
                    core_push.apply(
                        ret,
                        elems.get(
                        )
                    );
                return this.pushStack(
                    ret
                );
            };
        },
    );
    function getAll(
        context, tag
    ) {
        var elems,
            elem,
            i = 0,
            found =
        "undefined" !== typeof context.getElementsByTagName
            ? context.getElementsByTagName(
                tag || "*"
            )
            : "undefined" !== typeof context.querySelectorAll
                ? context.querySelectorAll(
                    tag || "*"
                )
                : void 0;
        if (!found)
            for (
                found = [], elems = context.childNodes || context;
                null != (elem = elems[i]);
                i++
            )
                tag && !jQuery.nodeName(
                    elem,
                    tag
                )
                    ? found.push(
                        elem
                    )
                    : jQuery.merge(
                        found,
                        getAll(
                            elem,
                            tag
                        )
                    );
        return void 0 === tag || (tag && jQuery.nodeName(
            context,
            tag
        ))
            ? jQuery.merge(
                [context,],
                found
            )
            : found;
    }
    function fixDefaultChecked(
        elem
    ) {
        manipulation_rcheckableType.test(
            elem.type
        ) &&
      (elem.defaultChecked = elem.checked);
    }
    jQuery.extend(
        {
            clone: function (
                elem, dataAndEvents, deepDataAndEvents
            ) {
                var destElements,
                    node,
                    clone,
                    i,
                    srcElements,
                    inPage = jQuery.contains(
                        elem.ownerDocument,
                        elem
                    );
                if (
                    (jQuery.support.html5Clone ||
        jQuery.isXMLDoc(
            elem
        ) ||
        !rnoshimcache.test(
            "<" + elem.nodeName + ">"
        )
                        ? (clone = elem.cloneNode(
                            !0
                        ))
                        : ((fragmentDiv.innerHTML = elem.outerHTML),
                        fragmentDiv.removeChild(
                            (clone = fragmentDiv.firstChild)
                        )),
                    (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
          (1 === elem.nodeType || 11 === elem.nodeType) &&
          !jQuery.isXMLDoc(
              elem
          ))
                )
                    for (
                        destElements = getAll(
                            clone
                        ), srcElements = getAll(
                            elem
                        ), i = 0;
                        null != (node = srcElements[i]);
                        ++i
                    )
                        destElements[i] && fixCloneNodeIssues(
                            node,
                            destElements[i]
                        );
                if (dataAndEvents) {
                    if (deepDataAndEvents)
                        for (
                            srcElements ||= getAll(
                                elem
                            ), destElements ||= getAll(
                                clone
                            ), i = 0;
                            null != (node = srcElements[i]);
                            i++
                        )
                            cloneCopyEvent(
                                node,
                                destElements[i]
                            );
                    else cloneCopyEvent(
                        elem,
                        clone
                    );
                }
                return (
                    (destElements = getAll(
                        clone,
                        "script"
                    )),
                    destElements.length > 0 &&
          setGlobalEval(
              destElements,
              !inPage && getAll(
                  elem,
                  "script"
              )
          ),
                    (destElements = srcElements = node = null),
                    clone
                );
            },
            buildFragment: function (
                elems, context, scripts, selection
            ) {
                for (
                    var j,
                        elem,
                        contains,
                        tmp,
                        tag,
                        tbody,
                        wrap,
                        l = elems.length,
                        safe = createSafeFragment(
                            context
                        ),
                        nodes = [],
                        i = 0;
                    l > i;
                    i++
                )
                    if (((elem = elems[i]), elem || 0 === elem)) {
                        if ("object" === jQuery.type(
                            elem
                        ))
                            jQuery.merge(
                                nodes,
                                elem.nodeType ? [elem,] : elem
                            );
                        else if (!/<|&#?\w+;/.test(
                            elem
                        ))
                            nodes.push(
                                context.createTextNode(
                                    elem
                                )
                            );
                        else {
                            for (
                                tmp ||= safe.appendChild(
                                    context.createElement(
                                        "div"
                                    )
                                ),
                                tag = (rtagName.exec(
                                    elem
                                ) || ["", "",])[1].toLowerCase(
                                ),
                                wrap = wrapMap[tag] || wrapMap._default,
                                tmp.innerHTML =
                  wrap[1] + elem.replace(
                      rxhtmlTag,
                      "<$1></$2>"
                  ) + wrap[2],
                                j = wrap[0];
                                j--;

                            )
                                tmp = tmp.lastChild;
                            if (
                                (!jQuery.support.leadingWhitespace &&
                rleadingWhitespace.test(
                    elem
                ) &&
                nodes.push(
                    context.createTextNode(
                        rleadingWhitespace.exec(
                            elem
                        )[0]
                    ),
                ),
                                !jQuery.support.tbody)
                            )
                                for (
                                    elem =
                  "table" !== tag || rtbody.test(
                      elem
                  )
                      ? tmp.firstChild
                      : wrap[1] !== "<table>" || rtbody.test(
                          elem
                      )
                          ? tmp
                          : 0,
                                    j = elem && elem.childNodes.length;
                                    j--;

                                )
                                    jQuery.nodeName(
                                        (tbody = elem.childNodes[j]),
                                        "tbody"
                                    ) &&
                  !tbody.childNodes.length &&
                  elem.removeChild(
                      tbody
                  );
                            for (
                                jQuery.merge(
                                    nodes,
                                    tmp.childNodes
                                ), tmp.textContent = "";
                                tmp.firstChild;

                            )
                                tmp.removeChild(
                                    tmp.firstChild
                                );
                            tmp = safe.lastChild;
                        }
                    }
                for (
                    tmp && safe.removeChild(
                        tmp
                    ),
                    jQuery.support.appendChecked ||
            jQuery.grep(
                getAll(
                    nodes,
                    "input"
                ),
                fixDefaultChecked
            ),
                    i = 0;
                    (elem = nodes[i++]);

                ) {
                    if (selection && -1 !== jQuery.inArray(
                        elem,
                        selection
                    )) continue;
                    if (
                        ((contains = jQuery.contains(
                            elem.ownerDocument,
                            elem
                        )),
                        (tmp = getAll(
                            safe.appendChild(
                                elem
                            ),
                            "script"
                        )),
                        contains && setGlobalEval(
                            tmp
                        ),
                        scripts)
                    )
                        for (j = 0; (elem = tmp[j++]); )
                            rscriptType.test(
                                elem.type || ""
                            ) && scripts.push(
                                elem
                            );
                }
                return (tmp = null), safe;
            },
            cleanData: function (
                elems, acceptData
            ) {
                for (
                    var elem,
                        type,
                        id,
                        data,
                        i = 0,
                        internalKey = jQuery.expando,
                        cache = jQuery.cache,
                        deleteExpando = jQuery.support.deleteExpando;
                    null != (elem = elems[i]);
                    i++
                )
                    if (acceptData || jQuery.acceptData(
                        elem
                    )) {
                        if (((id = elem[internalKey]), (data = id && cache[id]))) {
                            if (data.events)
                                for (type in data.events)
                                    jQuery.event.special[type]
                                        ? jQuery.event.remove(
                                            elem,
                                            type
                                        )
                                        : jQuery.removeEvent(
                                            elem,
                                            type,
                                            data.handle
                                        );
                            cache[id] &&
              (delete cache[id],
              deleteExpando
                  ? delete elem[internalKey]
                  : "undefined" !== typeof elem.removeAttribute
                      ? elem.removeAttribute(
                          internalKey
                      )
                      : (elem[internalKey] = null),
              core_deletedIds.push(
                  id
              ));
                        }
                    }
            },
        }
    );
    var iframe,
        getStyles,
        curCSS,
        ralpha = /alpha\([^)]*\)/i,
        rmargin = /^margin/,
        rnumnonpx = new RegExp(
            "^(" + core_pnum + ")(?!px)[a-z%]+$",
            "i"
        ),
        elemdisplay = {
            BODY: "block",
        },
        cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400,
        },
        cssExpand = ["Top", "Right", "Bottom", "Left",],
        cssPrefixes = ["Webkit", "O", "Moz", "ms",];
    function vendorPropName(
        style, name
    ) {
        if (name in style) return name;
        for (
            var capName = name.charAt(
                    0
                ).toUpperCase(
                ) + name.slice(
                    1
                ),
                i = cssPrefixes.length;
            i--;

        )
            if (((name = cssPrefixes[i] + capName), name in style)) return name;
        return name;
    }
    function isHidden(
        elem, el
    ) {
        return (
            (elem = el || elem),
            "none" === jQuery.css(
                elem,
                "display"
            ) ||
        !jQuery.contains(
            elem.ownerDocument,
            elem
        )
        );
    }
    function showHide(
        elements, show
    ) {
        for (
            var elem, hidden, values = [], index = 0, length = elements.length;
            length > index;
            index++
        ) {
            if (((elem = elements[index]), !elem.style)) continue;
            (values[index] = jQuery._data(
                elem,
                "olddisplay"
            )),
            elem.style.display,
            show
                ? (values[index] ||
              elem.style.display !== "none" ||
              (elem.style.display = ""),
                elem.style.display === "" &&
              isHidden(
                  elem
              ) &&
              (values[index] = jQuery._data(
                  elem,
                  "olddisplay",
                  css_defaultDisplay(
                      elem.nodeName
                  ),
              )))
                : !values[index] &&
            ((hidden = isHidden(
                elem
            )),
            ((elem.style.display && elem.style.display !== "none") ||
              !hidden) &&
              jQuery._data(
                  elem,
                  "olddisplay",
                  hidden
                      ? elem.style.display
                      : jQuery.css(
                          elem,
                          "display"
                      ),
              ));
        }
        for (index = 0; length > index; index++) {
            if (((elem = elements[index]), !elem.style)) continue;
            (!show || elem.style.display === "none" || elem.style.display === "") &&
        (elem.style.display = show ? values[index] || "" : "none");
        }
        return elements;
    }
    jQuery.fn.extend(
        {
            css: function (
                name, value
            ) {
                return jQuery.access(
                    this,
                    function (
                        elem, name, value
                    ) {
                        var styles,
                            map = {
                            },
                            i = 0;
                        if (jQuery.isArray(
                            name
                        )) {
                            for (styles = getStyles(
                                elem
                            ); i < name.length; i++)
                                map[name[i]] = jQuery.css(
                                    elem,
                                    name[i],
                                    !1,
                                    styles
                                );
                            return map;
                        }
                        return void 0 !== value
                            ? jQuery.style(
                                elem,
                                name,
                                value
                            )
                            : jQuery.css(
                                elem,
                                name
                            );
                    },
                    name,
                    value,
                    arguments.length > 1,
                );
            },
            show: function (
            ) {
                return showHide(
                    this,
                    !0
                );
            },
            hide: function (
            ) {
                return showHide(
                    this
                );
            },
            toggle: function (
                state
            ) {
                return this.each(
                    function (
                    ) {
                        ("boolean" == typeof state
                            ? state
                            : isHidden(
                                this
                            ))
                            ? jQuery(
                                this
                            ).show(
                            )
                            : jQuery(
                                this
                            ).hide(
                            );
                    }
                );
            },
        }
    ),
    jQuery.extend(
        {
            cssHooks: {
                opacity: {
                    get: function (
                        elem, computed
                    ) {
                        if (computed) {
                            var ret = curCSS(
                                elem,
                                "opacity"
                            );
                            return "" === ret ? "1" : ret;
                        }
                    },
                },
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0,
            },
            cssProps: {
                float: jQuery.support.cssFloat ? "cssFloat" : "styleFloat",
            },
            style: function (
                elem, name, value, extra
            ) {
                if (!elem || 3 === elem.nodeType || 8 === elem.nodeType || !elem.style)
                    return;
                var ret,
                    type,
                    hooks,
                    origName = jQuery.camelCase(
                        name
                    ),
                    style = elem.style;
                if (
                    ((name =
            jQuery.cssProps[origName] ||
            (jQuery.cssProps[origName] = vendorPropName(
                style,
                origName
            ))),
                    (hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]),
                    void 0 !== value)
                ) {
                    if (
                        ((type = typeof value),
                        "string" === type &&
              (ret = new RegExp(
                  "^([+-])=(" + core_pnum + ")",
                  "i"
              ).exec(
                  value,
              )) &&
              ((value =
                (ret[1] + 1) * ret[2] + parseFloat(
                    jQuery.css(
                        elem,
                        name
                    )
                )),
              (type = "number")),
                        null == value || ("number" === type && isNaN(
                            value
                        )))
                    )
                        return;
                    if (
                        ("number" !== type || jQuery.cssNumber[origName] || (value += "px"),
                        !jQuery.support.clearCloneStyle &&
              "" === value &&
              0 === name.indexOf(
                  "background"
              ) &&
              (style[name] = "inherit"),
                        !hooks ||
              !("set" in hooks) ||
              (value = hooks.set(
                  elem,
                  value,
                  extra
              )) !== void 0)
                    )
                        try {
                            style[name] = value;
                        } catch (e) {}
                } else {
                    if (
                        hooks &&
            "get" in hooks &&
            (ret = hooks.get(
                elem,
                !1,
                extra
            )) !== void 0
                    )
                        return ret;
                    return style[name];
                }
            },
            css: function (
                elem, name, extra, styles
            ) {
                var num,
                    val,
                    hooks,
                    origName = jQuery.camelCase(
                        name
                    );
                return ((name =
          jQuery.cssProps[origName] ||
          (jQuery.cssProps[origName] = vendorPropName(
              elem.style,
              origName
          ))),
                (hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]),
                hooks && "get" in hooks && (val = hooks.get(
                    elem,
                    !0,
                    extra
                )),
                void 0 === val && (val = curCSS(
                    elem,
                    name,
                    styles
                )),
                "normal" === val &&
          name in cssNormalTransform &&
          (val = cssNormalTransform[name]),
                "" === extra || extra)
                    ? ((num = parseFloat(
                        val
                    )),
                    !0 === extra || jQuery.isNumeric(
                        num
                    )
                        ? num || 0
                        : val)
                    : val;
            },
            swap: function (
                elem, options, callback, args
            ) {
                var ret,
                    name,
                    old = {
                    };
                for (name in options)
                    (old[name] = elem.style[name]), (elem.style[name] = options[name]);
                ret = callback.apply(
                    elem,
                    args || []
                );
                for (name in options) elem.style[name] = old[name];
                return ret;
            },
        }
    ),
    window.getComputedStyle
        ? ((getStyles = function (
            elem
        ) {
            return window.getComputedStyle(
                elem,
                null
            );
        }),
        (curCSS = function (
            elem, name, _computed
        ) {
            var computed = _computed || getStyles(
                    elem
                ),
                ret = computed
                    ? computed.getPropertyValue(
                        name
                    ) || computed[name]
                    : void 0,
                style = elem.style;
            return (
                computed &&
              ("" !== ret ||
                jQuery.contains(
                    elem.ownerDocument,
                    elem
                ) ||
                (ret = jQuery.style(
                    elem,
                    name
                )),
              rnumnonpx.test(
                  ret
              ) &&
                rmargin.test(
                    name
                ) &&
                (style.width,
                style.minWidth,
                style.maxWidth,
                (style.minWidth = style.maxWidth = style.width = ret),
                (ret = computed.width),
                (style.width = style.width),
                (style.minWidth = style.minWidth),
                (style.maxWidth = style.maxWidth))),
                ret
            );
        }))
        : document.documentElement.currentStyle &&
        ((getStyles = function (
            elem
        ) {
            return elem.currentStyle;
        }),
        (curCSS = function (
            elem, name, _computed
        ) {
            var rsLeft,
                computed = _computed || getStyles(
                    elem
                ),
                ret = computed ? computed[name] : void 0,
                style = elem.style;
            return (
                null == ret && style && style[name] && (ret = style[name]),
                rnumnonpx.test(
                    ret
                ) &&
              !/^(top|right|bottom|left)$/.test(
                  name
              ) &&
              (style.left,
              (rsLeft = elem.runtimeStyle && elem.runtimeStyle.left),
              rsLeft && (elem.runtimeStyle.left = elem.currentStyle.left),
              (style.left = "fontSize" === name ? "1em" : ret),
              (ret = style.pixelLeft + "px"),
              (style.left = style.left),
              rsLeft && (elem.runtimeStyle.left = rsLeft)),
                "" === ret ? "auto" : ret
            );
        }));
    function setPositiveNumber(
        elem, value, subtract
    ) {
        var matches = new RegExp(
            "^(" + core_pnum + ")(.*)$",
            "i"
        ).exec(
            value
        );
        return matches
            ? Math.max(
                0,
                matches[1] - (subtract || 0)
            ) + (matches[2] || "px")
            : value;
    }
    function augmentWidthOrHeight(
        elem, name, extra, isBorderBox, styles
    ) {
        for (
            var i =
          extra === (isBorderBox ? "border" : "content")
              ? 4
              : "width" === name
                  ? 1
                  : 0,
                val = 0;
            4 > i;
            i += 2
        )
            "margin" === extra &&
        (val += jQuery.css(
            elem,
            extra + cssExpand[i],
            !0,
            styles
        )),
            isBorderBox
                ? ("content" === extra &&
              (val -= jQuery.css(
                  elem,
                  "padding" + cssExpand[i],
                  !0,
                  styles
              )),
                "margin" !== extra &&
              (val -= jQuery.css(
                  elem,
                  "border" + cssExpand[i] + "Width",
                  !0,
                  styles,
              )))
                : ((val += jQuery.css(
                    elem,
                    "padding" + cssExpand[i],
                    !0,
                    styles
                )),
                "padding" !== extra &&
              (val += jQuery.css(
                  elem,
                  "border" + cssExpand[i] + "Width",
                  !0,
                  styles,
              )));
        return val;
    }
    function getWidthOrHeight(
        elem, name, extra
    ) {
        var valueIsBorderBox = !0,
            val = "width" === name ? elem.offsetWidth : elem.offsetHeight,
            styles = getStyles(
                elem
            ),
            isBorderBox =
        jQuery.support.boxSizing &&
        "border-box" === jQuery.css(
            elem,
            "boxSizing",
            !1,
            styles
        );
        if (0 >= val || null == val) {
            if (
                ((val = curCSS(
                    elem,
                    name,
                    styles
                )),
                (0 > val || null == val) && (val = elem.style[name]),
                rnumnonpx.test(
                    val
                ))
            )
                return val;
            (valueIsBorderBox =
        isBorderBox &&
        (jQuery.support.boxSizingReliable || val === elem.style[name])),
            (val = parseFloat(
                val
            ) || 0);
        }
        return (
            val +
      augmentWidthOrHeight(
          elem,
          name,
          extra || (isBorderBox ? "border" : "content"),
          valueIsBorderBox,
          styles,
      ) +
      "px"
        );
    }
    function css_defaultDisplay(
        nodeName
    ) {
        var display = elemdisplay[nodeName];
        return (
            display ||
        ((display = actualDisplay(
            nodeName,
            (iframe[0].contentWindow || iframe[0].contentDocument).document,
        )),
        ("none" === display || !display) &&
          ((iframe = (
              iframe ||
            jQuery(
                "<iframe frameborder='0' width='0' height='0'/>"
            ).css(
                "cssText",
                "display:block !important",
            )
          ).appendTo(
              (iframe[0].contentWindow || iframe[0].contentDocument).document
                  .documentElement,
          )),
          (iframe[0].contentWindow || iframe[0].contentDocument).document,
          (iframe[0].contentWindow || iframe[0].contentDocument).document.write(
              "<!doctype html><html><body>",
          ),
          (
              iframe[0].contentWindow || iframe[0].contentDocument
          ).document.close(
          ),
          (display = actualDisplay(
              nodeName,
              (iframe[0].contentWindow || iframe[0].contentDocument).document,
          )),
          iframe.detach(
          )),
        (elemdisplay[nodeName] = display)),
            display
        );
    }
    function actualDisplay(
        name, doc
    ) {
        return elem.remove(
        ), jQuery.css(
            elem[0],
            "display"
        );
    }
    jQuery.each(
        ["height", "width",],
        function (
            i, name
        ) {
            jQuery.cssHooks[name] = {
                get: function (
                    elem, computed, extra
                ) {
                    if (computed)
                        return 0 === elem.offsetWidth &&
            /^(none|table(?!-c[ea]).+)/.test(
                jQuery.css(
                    elem,
                    "display"
                )
            )
                            ? jQuery.swap(
                                elem,
                                {
                                    position: "absolute",
                                    visibility: "hidden",
                                    display: "block",
                                },
                                function (
                                ) {
                                    return getWidthOrHeight(
                                        elem,
                                        name,
                                        extra
                                    );
                                },
                            )
                            : getWidthOrHeight(
                                elem,
                                name,
                                extra
                            );
                },
                set: function (
                    elem, value, extra
                ) {
                    var styles = extra && getStyles(
                        elem
                    );
                    return setPositiveNumber(
                        elem,
                        value,
                        extra
                            ? augmentWidthOrHeight(
                                elem,
                                name,
                                extra,
                                jQuery.support.boxSizing &&
                  "border-box" === jQuery.css(
                      elem,
                      "boxSizing",
                      !1,
                      styles
                  ),
                                styles,
                            )
                            : 0,
                    );
                },
            };
        }
    ),
    jQuery.support.opacity ||
      (jQuery.cssHooks.opacity = {
          get: function (
              elem, computed
          ) {
              return /opacity\s*=\s*([^)]*)/.test(
                  (computed && elem.currentStyle
                      ? elem.currentStyle.filter
                      : elem.style.filter) || "",
              )
                  ? 0.01 * parseFloat(
                      RegExp.$1
                  ) + ""
                  : computed
                      ? "1"
                      : "";
          },
          set: function (
              elem, value
          ) {
              var style = elem.style,
                  currentStyle = elem.currentStyle,
                  opacity = jQuery.isNumeric(
                      value
                  )
                      ? "alpha(opacity=" + 100 * value + ")"
                      : "",
                  filter =
              (currentStyle && currentStyle.filter) || style.filter || "";
              if (
                  ((style.zoom = 1),
                  (value >= 1 || "" === value) &&
              "" === jQuery.trim(
                  filter.replace(
                      ralpha,
                      ""
                  )
              ) &&
              style.removeAttribute)
              ) {
                  if (
                      (style.removeAttribute(
                          "filter"
                      ),
                      "" === value || (currentStyle && !currentStyle.filter))
                  )
                      return;
              }
              style.filter = ralpha.test(
                  filter
              )
                  ? filter.replace(
                      ralpha,
                      opacity
                  )
                  : filter + " " + opacity;
          },
      }),
    jQuery(
        function (
        ) {
            jQuery.support.reliableMarginRight ||
        (jQuery.cssHooks.marginRight = {
            get: function (
                elem, computed
            ) {
                if (computed)
                    return jQuery.swap(
                        elem,
                        {
                            display: "inline-block",
                        },
                        curCSS,
                        [elem, "marginRight",],
                    );
            },
        }),
            !jQuery.support.pixelPosition &&
          jQuery.fn.position &&
          jQuery.each(
              ["top", "left",],
              function (
                  i, prop
              ) {
                  jQuery.cssHooks[prop] = {
                      get: function (
                          elem, computed
                      ) {
                          if (computed)
                              return (
                                  (computed = curCSS(
                                      elem,
                                      prop
                                  )),
                                  rnumnonpx.test(
                                      computed
                                  )
                                      ? jQuery(
                                          elem
                                      ).position(
                                      )[prop] + "px"
                                      : computed
                              );
                      },
                  };
              }
          );
        }
    ),
    jQuery.expr &&
      jQuery.expr.filters &&
      ((jQuery.expr.filters.hidden = function (
          elem
      ) {
          return (
              (0 >= elem.offsetWidth && 0 >= elem.offsetHeight) ||
          (!jQuery.support.reliableHiddenOffsets &&
            ((elem.style && elem.style.display) ||
              jQuery.css(
                  elem,
                  "display"
              )) === "none")
          );
      }),
      (jQuery.expr.filters.visible = function (
          elem
      ) {
          return !jQuery.expr.filters.hidden(
              elem
          );
      })),
    jQuery.each(
        {
            margin: "",
            padding: "",
            border: "Width",
        },
        function (
            prefix, suffix
        ) {
            (jQuery.cssHooks[prefix + suffix] = {
                expand: function (
                    value
                ) {
                    for (
                        var i = 0,
                            expanded = {
                            },
                            parts = "string" == typeof value
                                ? value.split(
                                    " "
                                )
                                : [value,];
                        4 > i;
                        i++
                    )
                        expanded[prefix + cssExpand[i] + suffix] =
                parts[i] || parts[i - 2] || parts[0];
                    return expanded;
                },
            }),
            rmargin.test(
                prefix
            ) ||
            (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber);
        },
    );
    var r20 = /%20/g,
        rCRLF = /\r?\n/g;
    jQuery.fn.extend(
        {
            serialize: function (
            ) {
                return jQuery.param(
                    this.serializeArray(
                    )
                );
            },
            serializeArray: function (
            ) {
                return this.map(
                    function (
                    ) {
                        var elements = jQuery.prop(
                            this,
                            "elements"
                        );
                        return elements
                            ? jQuery.makeArray(
                                elements
                            )
                            : this;
                    }
                )
                    .filter(
                        function (
                        ) {
                            var type = this.type;
                            return (
                                this.name &&
            !jQuery(
                this
            ).is(
                ":disabled"
            ) &&
            /^(?:input|select|textarea|keygen)/i.test(
                this.nodeName
            ) &&
            !/^(?:submit|button|image|reset|file)$/i.test(
                type
            ) &&
            (this.checked || !manipulation_rcheckableType.test(
                type
            ))
                            );
                        }
                    )
                    .map(
                        function (
                            i, elem
                        ) {
                            var val = jQuery(
                                this
                            ).val(
                            );
                            return null == val
                                ? null
                                : jQuery.isArray(
                                    val
                                )
                                    ? jQuery.map(
                                        val,
                                        function (
                                            val
                                        ) {
                                            return {
                                                name: elem.name,
                                                value: val.replace(
                                                    rCRLF,
                                                    "\r\n"
                                                ),
                                            };
                                        }
                                    )
                                    : {
                                        name: elem.name,
                                        value: val.replace(
                                            rCRLF,
                                            "\r\n"
                                        ),
                                    };
                        }
                    )
                    .get(
                    );
            },
        }
    ),
    (jQuery.param = function (
        a, traditional
    ) {
        var prefix,
            s = [],
            add = function (
                key, value
            ) {
                (value = jQuery.isFunction(
                    value
                )
                    ? value(
                    )
                    : null == value
                        ? ""
                        : value),
                (s[s.length] =
              encodeURIComponent(
                  key
              ) + "=" + encodeURIComponent(
                  value
              ));
            };
        if (
            (void 0 === traditional &&
          (traditional =
            jQuery.ajaxSettings && jQuery.ajaxSettings.traditional),
            jQuery.isArray(
                a
            ) || (a.jquery && !jQuery.isPlainObject(
                a
            )))
        )
            jQuery.each(
                a,
                function (
                ) {
                    add(
                        this.name,
                        this.value
                    );
                }
            );
        else for (prefix in a) buildParams(
            prefix,
            a[prefix],
            traditional,
            add
        );
        return s.join(
            "&"
        ).replace(
            r20,
            "+"
        );
    });
    function buildParams(
        prefix, obj, traditional, add
    ) {
        var name;
        if (jQuery.isArray(
            obj
        ))
            jQuery.each(
                obj,
                function (
                    i, v
                ) {
                    traditional || /\[\]$/.test(
                        prefix
                    )
                        ? add(
                            prefix,
                            v
                        )
                        : buildParams(
                            prefix + "[" + ("object" == typeof v ? i : "") + "]",
                            v,
                            traditional,
                            add,
                        );
                }
            );
        else if (!traditional && "object" === jQuery.type(
            obj
        ))
            for (name in obj)
                buildParams(
                    prefix + "[" + name + "]",
                    obj[name],
                    traditional,
                    add
                );
        else add(
            prefix,
            obj
        );
    }
    jQuery.each(
        "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
            " ",
        ),
        function (
            i, name
        ) {
            jQuery.fn[name] = function (
                data, fn
            ) {
                return arguments.length > 0
                    ? this.on(
                        name,
                        null,
                        data,
                        fn
                    )
                    : this.trigger(
                        name
                    );
            };
        },
    ),
    (jQuery.fn.hover = function (
        fnOver, fnOut
    ) {
        return this.mouseenter(
            fnOver
        ).mouseleave(
            fnOut || fnOver
        );
    });
    var ajaxLocParts,
        ajaxLocation,
        ajax_nonce = jQuery.now(
        ),
        ajax_rquery = /\?/,
        rhash = /#.*$/,
        rts = /([?&])_=[^&]*/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rprotocol = /^\/\//,
        rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        _load = jQuery.fn.load,
        prefilters = {
        },
        transports = {
        },
        allTypes = "*/".concat(
            "*"
        );
    try {
        ajaxLocation = location.href;
    } catch (e) {
        (ajaxLocation = document.createElement(
            "a"
        )),
        (ajaxLocation.href = ""),
        (ajaxLocation = ajaxLocation.href);
    }
    ajaxLocParts = rurl.exec(
        ajaxLocation.toLowerCase(
        )
    ) || [];
    function addToPrefiltersOrTransports(
        structure
    ) {
        return function (
            dataTypeExpression, func
        ) {
            var dataType,
                i = 0;
            if (jQuery.isFunction(
                "*"
            ))
                for (; (dataType = ("*".match(
                    core_rnotwhite
                ) || [])[i++]); )
                    dataType[0] === "+"
                        ? ((dataType = dataType.slice(
                            1
                        ) || "*"),
                        (structure[dataType] = structure[dataType] || []).unshift(
                            "*"
                        ))
                        : (structure[dataType] = structure[dataType] || []).push(
                            "*"
                        );
        };
    }
    function inspectPrefiltersOrTransports(
        structure,
        options,
        originalOptions,
        jqXHR,
    ) {
        var inspected = {
            },
            seekingTransport = structure === transports;
        function inspect(
            dataType
        ) {
            var selected;
            return (
                (inspected[dataType] = !0),
                jQuery.each(
                    structure[dataType] || [],
                    function (
                        _, prefilterOrFactory
                    ) {
                        var dataTypeOrTransport = prefilterOrFactory(
                            options,
                            originalOptions,
                            jqXHR,
                        );
                        if (
                            "string" == typeof dataTypeOrTransport &&
              !seekingTransport &&
              !inspected[dataTypeOrTransport]
                        )
                            return (
                                options.dataTypes.unshift(
                                    dataTypeOrTransport
                                ),
                                inspect(
                                    dataTypeOrTransport
                                ),
                                !1
                            );
                        if (seekingTransport) return !(selected = dataTypeOrTransport);
                    },
                ),
                selected
            );
        }
        return inspect(
            options.dataTypes[0]
        ) || (!inspected["*"] && inspect(
            "*"
        ));
    }
    function ajaxExtend(
        target, src
    ) {
        var deep,
            key,
            flatOptions = jQuery.ajaxSettings.flatOptions || {
            };
        for (key in src)
            src[key] !== void 0 &&
        ((flatOptions[key]
            ? target
            : deep || (deep = {
            }))[key] = src[key]);
        return deep && jQuery.extend(
            !0,
            target,
            deep
        ), target;
    }
    (jQuery.fn.load = function (
        url, params, callback
    ) {
        if ("string" !== typeof url && _load) return _load.apply(
            this,
            arguments
        );
        var selector,
            response,
            self = this,
            off = url.indexOf(
                " "
            );
        return (
            off >= 0 &&
        ((selector = url.slice(
            off,
            url.length
        )), (url = url.slice(
            0,
            off
        ))),
            jQuery.isFunction(
                params
            )
                ? ((callback = params), (params = void 0))
                : params && "object" == typeof params,
            self.length > 0 &&
        jQuery
            .ajax(
                {
                    url: url,
                    type: "POST",
                    dataType: "html",
                    data: params,
                }
            )
            .done(
                function (
                    responseText
                ) {
                    (response = arguments),
                    self.html(
                        selector
                            ? jQuery(
                                "<div>"
                            )
                                .append(
                                    jQuery.parseHTML(
                                        responseText
                                    )
                                )
                                .find(
                                    selector
                                )
                            : responseText,
                    );
                }
            )
            .complete(
                callback &&
              function (
                  jqXHR, status
              ) {
                  self.each(
                      callback,
                      response || [jqXHR.responseText, status, jqXHR,],
                  );
              },
            ),
            this
        );
    }),
    jQuery.each(
        [
            "ajaxStart",
            "ajaxStop",
            "ajaxComplete",
            "ajaxError",
            "ajaxSuccess",
            "ajaxSend",
        ],
        function (
            i, type
        ) {
            jQuery.fn[type] = function (
                fn
            ) {
                return this.on(
                    type,
                    fn
                );
            };
        },
    ),
    jQuery.each(
        ["get", "post",],
        function (
            i, method
        ) {
            jQuery[method] = function (
                url, data, callback, type
            ) {
                return (
                    jQuery.isFunction(
                        data
                    ) &&
            ((type ||= callback), (callback = data), (data = void 0)),
                    jQuery.ajax(
                        {
                            url: url,
                            type: method,
                            dataType: type,
                            data: data,
                            success: callback,
                        }
                    )
                );
            };
        }
    ),
    jQuery.extend(
        {
            active: 0,
            lastModified: {
            },
            etag: {
            },
            ajaxSettings: {
                url: ajaxLocation,
                type: "GET",
                isLocal: rlocalProtocol.test(
                    ajaxLocParts[1]
                ),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": allTypes,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript",
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/,
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                },
                converters: {
                    "* text": window.String,
                    "text html": !0,
                    "text json": jQuery.parseJSON,
                    "text xml": jQuery.parseXML,
                },
                flatOptions: {
                    url: !0,
                    context: !0,
                },
            },
            ajaxSetup: function (
                target, settings
            ) {
                return settings
                    ? ajaxExtend(
                        ajaxExtend(
                            target,
                            jQuery.ajaxSettings
                        ),
                        settings
                    )
                    : ajaxExtend(
                        jQuery.ajaxSettings,
                        target
                    );
            },
            ajaxPrefilter: addToPrefiltersOrTransports(
                prefilters
            ),
            ajaxTransport: addToPrefiltersOrTransports(
                transports
            ),
            ajax: function (
                url, options
            ) {
                "object" == typeof url && ((options = url), (url = void 0)),
                (options ||= {
                });
                var parts,
                    i,
                    cacheURL,
                    responseHeadersString,
                    timeoutTimer,
                    fireGlobals,
                    transport,
                    responseHeaders,
                    s = jQuery.ajaxSetup(
                        {
                        },
                        options
                    ),
                    callbackContext = s.context || s,
                    globalEventContext =
            s.context && (callbackContext.nodeType || callbackContext.jquery)
                ? jQuery(
                    callbackContext
                )
                : jQuery.event,
                    deferred = jQuery.Deferred(
                    ),
                    completeDeferred = jQuery.Callbacks(
                        "once memory"
                    ),
                    statusCode = s.statusCode || {
                    },
                    requestHeaders = {
                    },
                    requestHeadersNames = {
                    },
                    state = 0,
                    strAbort = "canceled",
                    jqXHR = {
                        readyState: 0,
                        getResponseHeader: function (
                            key
                        ) {
                            var match;
                            if (2 === state) {
                                if (!responseHeaders)
                                    for (
                                        responseHeaders = {
                                        };
                                        (match = rheaders.exec(
                                            responseHeadersString
                                        ));

                                    )
                                        responseHeaders[match[1].toLowerCase(
                                        )] = match[2];
                                match = responseHeaders[key.toLowerCase(
                                )];
                            }
                            return null == match ? null : match;
                        },
                        getAllResponseHeaders: function (
                        ) {
                            return 2 === state ? responseHeadersString : null;
                        },
                        setRequestHeader: function (
                            name, value
                        ) {
                            var lname = name.toLowerCase(
                            );
                            return (
                                state ||
                  ((name = requestHeadersNames[lname] =
                    requestHeadersNames[lname] || name),
                  (requestHeaders[name] = value)),
                                this
                            );
                        },
                        overrideMimeType: function (
                            type
                        ) {
                            return state || (s.mimeType = type), this;
                        },
                        statusCode: function (
                            map
                        ) {
                            var code;
                            if (map) {
                                if (2 > state)
                                    for (code in map)
                                        statusCode[code] = [statusCode[code], map[code],];
                                else jqXHR.always(
                                    map[jqXHR.status]
                                );
                            }
                            return this;
                        },
                        abort: function (
                            statusText
                        ) {
                            var finalText = statusText || strAbort;
                            return (
                                transport && transport.abort(
                                    finalText
                                ),
                                done(
                                    0,
                                    finalText
                                ),
                                this
                            );
                        },
                    };
                if (
                    ((deferred.promise(
                        jqXHR
                    ).complete = completeDeferred.add),
                    (jqXHR.success = jqXHR.done),
                    (jqXHR.error = jqXHR.fail),
                    (s.url = ((url || s.url || ajaxLocation) + "")
                        .replace(
                            rhash,
                            ""
                        )
                        .replace(
                            rprotocol,
                            ajaxLocParts[1] + "//"
                        )),
                    (s.type = options.method || options.type || s.method || s.type),
                    (s.dataTypes = jQuery
                        .trim(
                            s.dataType || "*"
                        )
                        .toLowerCase(
                        )
                        .match(
                            core_rnotwhite
                        ) || ["",]),
                    null == s.crossDomain &&
            ((parts = rurl.exec(
                s.url.toLowerCase(
                )
            )),
            (s.crossDomain = !(
                !parts ||
              !(
                  parts[1] !== ajaxLocParts[1] ||
                parts[2] !== ajaxLocParts[2] ||
                (parts[3] || (parts[1] === "http:" ? 80 : 443)) !=
                  (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443))
              )
            ))),
                    s.data &&
            s.processData &&
            "string" !== typeof s.data &&
            (s.data = jQuery.param(
                s.data,
                s.traditional
            )),
                    inspectPrefiltersOrTransports(
                        prefilters,
                        s,
                        options,
                        jqXHR
                    ),
                    2 === state)
                )
                    return jqXHR;
                (fireGlobals = s.global),
                fireGlobals &&
            jQuery.active++ == 0 &&
            jQuery.event.trigger(
                "ajaxStart"
            ),
                (s.type = s.type.toUpperCase(
                )),
                (s.hasContent = !/^(?:GET|HEAD)$/.test(
                    s.type
                )),
                (cacheURL = s.url),
                s.hasContent ||
            (s.data &&
              ((cacheURL = s.url +=
                (ajax_rquery.test(
                    cacheURL
                )
                    ? "&"
                    : "?") + s.data),
              delete s.data),
            s.cache === !1 &&
              (s.url = rts.test(
                  cacheURL
              )
                  ? cacheURL.replace(
                      rts,
                      "$1_=" + ajax_nonce++
                  )
                  : cacheURL +
                  (ajax_rquery.test(
                      cacheURL
                  )
                      ? "&"
                      : "?") +
                  "_=" +
                  ajax_nonce++)),
                s.ifModified &&
            (jQuery.lastModified[cacheURL] &&
              jqXHR.setRequestHeader(
                  "If-Modified-Since",
                  jQuery.lastModified[cacheURL],
              ),
            jQuery.etag[cacheURL] &&
              jqXHR.setRequestHeader(
                  "If-None-Match",
                  jQuery.etag[cacheURL]
              )),
                ((s.data && s.hasContent && s.contentType !== !1) ||
            options.contentType) &&
            jqXHR.setRequestHeader(
                "Content-Type",
                s.contentType
            ),
                jqXHR.setRequestHeader(
                    "Accept",
                    s.dataTypes[0] && s.accepts[s.dataTypes[0]]
                        ? s.accepts[s.dataTypes[0]] +
                  (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "")
                        : s.accepts["*"],
                );
                for (i in s.headers) jqXHR.setRequestHeader(
                    i,
                    s.headers[i]
                );
                if (
                    s.beforeSend &&
          (s.beforeSend.call(
              callbackContext,
              jqXHR,
              s
          ) === !1 || 2 === state)
                )
                    return jqXHR.abort(
                    );
                strAbort = "abort";
                for (i in {
                    success: 1,
                    error: 1,
                    complete: 1,
                })
                    jqXHR[i](
                        s[i]
                    );
                if (
                    ((transport = inspectPrefiltersOrTransports(
                        transports,
                        s,
                        options,
                        jqXHR,
                    )),
                    !transport)
                )
                    done(
                        -1,
                        "No Transport"
                    );
                else {
                    (jqXHR.readyState = 1),
                    fireGlobals && globalEventContext.trigger(
                        "ajaxSend",
                        [jqXHR, s,]
                    ),
                    s.async &&
              s.timeout > 0 &&
              (timeoutTimer = setTimeout(
                  function (
                  ) {
                      jqXHR.abort(
                          "timeout"
                      );
                  },
                  s.timeout
              ));
                    try {
                        (state = 1), transport.send(
                            requestHeaders,
                            done
                        );
                    } catch (e) {
                        if (2 > state) done(
                            -1,
                            e
                        );
                        else throw e;
                    }
                }
                function done(
                    status, nativeStatusText, responses, headers
                ) {
                    var isSuccess;
                    if (2 === state) return;
                    (state = 2),
                    timeoutTimer && clearTimeout(
                        timeoutTimer
                    ),
                    (transport = void 0),
                    (responseHeadersString = headers || ""),
                    (jqXHR.readyState = 0),
                    responses && ajaxHandleResponses(
                        s,
                        jqXHR,
                        responses
                    ),
                    (jqXHR.status = 0),
                    (jqXHR.statusText = (nativeStatusText || "error") + ""),
                    isSuccess
                        ? deferred.resolveWith(
                            callbackContext,
                            [
                                isSuccess.data,
                                "error",
                                jqXHR,
                            ]
                        )
                        : deferred.rejectWith(
                            callbackContext,
                            [jqXHR, "error", "error",]
                        ),
                    jqXHR.statusCode(
                        statusCode
                    ),
                    (statusCode = void 0),
                    fireGlobals &&
              globalEventContext.trigger(
                  isSuccess ? "ajaxSuccess" : "ajaxError",
                  [jqXHR, s, isSuccess ? isSuccess.data : "error",],
              ),
                    completeDeferred.fireWith(
                        callbackContext,
                        [jqXHR, "error",]
                    ),
                    fireGlobals &&
              (globalEventContext.trigger(
                  "ajaxComplete",
                  [jqXHR, s,]
              ),
              !--jQuery.active && jQuery.event.trigger(
                  "ajaxStop"
              ));
                }
                return jqXHR;
            },
            getScript: function (
                url, callback
            ) {
                return jQuery.get(
                    url,
                    void 0,
                    callback,
                    "script"
                );
            },
            getJSON: function (
                url, data, callback
            ) {
                return jQuery.get(
                    url,
                    data,
                    callback,
                    "json"
                );
            },
        }
    );
    function ajaxHandleResponses(
        s, jqXHR, responses
    ) {
        var firstDataType,
            ct,
            finalDataType,
            type,
            contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields;
        for (type in responseFields)
            type in responses && (jqXHR[responseFields[type]] = responses[type]);
        for (; dataTypes[0] === "*"; )
            dataTypes.shift(
            ),
            void 0 === ct &&
          (ct = s.mimeType || jqXHR.getResponseHeader(
              "Content-Type"
          ));
        if (ct)
            for (type in contents)
                if (contents[type] && contents[type].test(
                    ct
                )) {
                    dataTypes.unshift(
                        type
                    );
                    break;
                }
        if (dataTypes[0] in responses) finalDataType = dataTypes[0];
        else {
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                firstDataType || (firstDataType = type);
            }
            finalDataType ||= firstDataType;
        }
        if (finalDataType)
            return (
                finalDataType !== dataTypes[0] && dataTypes.unshift(
                    finalDataType
                ),
                responses[finalDataType]
            );
    }
    jQuery.ajaxSetup(
        {
            accepts: {
                script:
        "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
            },
            contents: {
                script: /(?:java|ecma)script/,
            },
            converters: {
                "text script": function (
                    text
                ) {
                    return jQuery.globalEval(
                        text
                    ), text;
                },
            },
        }
    ),
    jQuery.ajaxPrefilter(
        "script",
        function (
            s
        ) {
            s.cache === void 0 && (s.cache = !1),
            s.crossDomain && ((s.type = "GET"), (s.global = !1));
        }
    ),
    jQuery.ajaxTransport(
        "script",
        function (
            s
        ) {
            if (s.crossDomain) {
                var script,
                    head = document.head || jQuery(
                        "head"
                    )[0] || document.documentElement;
                return {
                    send: function (
                        _, callback
                    ) {
                        (script = document.createElement(
                            "script"
                        )),
                        (script.async = !0),
                        s.scriptCharset && (script.charset = s.scriptCharset),
                        (script.src = s.url),
                        (script.onload = script.onreadystatechange = function (
                            _,
                            isAbort,
                        ) {
                            (isAbort ||
                  !script.readyState ||
                  /loaded|complete/.test(
                      script.readyState
                  )) &&
                  ((script.onload = script.onreadystatechange = null),
                  script.parentNode && script.parentNode.removeChild(
                      script
                  ),
                  (script = null),
                  !isAbort && callback(
                      200,
                      "success"
                  ));
                        }),
                        head.insertBefore(
                            script,
                            head.firstChild
                        );
                    },
                    abort: function (
                    ) {
                        script && script.onload(
                            void 0,
                            !0
                        );
                    },
                };
            }
        }
    );
    var oldCallbacks = [],
        rjsonp = /(=)\?(?=&|$)|\?\?/;
    jQuery.ajaxSetup(
        {
            jsonp: "callback",
            jsonpCallback: function (
            ) {
                var callback = oldCallbacks.pop(
                ) || jQuery.expando + "_" + ajax_nonce++;
                return (this[callback] = !0), callback;
            },
        }
    ),
    jQuery.ajaxPrefilter(
        "json jsonp",
        function (
            s, originalSettings, jqXHR
        ) {
            var callbackName,
                overwritten,
                responseContainer,
                jsonProp =
          s.jsonp !== !1 &&
          (rjsonp.test(
              s.url
          )
              ? "url"
              : "string" == typeof s.data &&
              !(s.contentType || "").indexOf(
                  "application/x-www-form-urlencoded",
              ) &&
              rjsonp.test(
                  s.data
              ) &&
              "data");
            if (jsonProp || s.dataTypes[0] === "jsonp")
                return (
                    (callbackName = s.jsonpCallback = jQuery.isFunction(
                        s.jsonpCallback
                    )
                        ? s.jsonpCallback(
                        )
                        : s.jsonpCallback),
                    jsonProp
                        ? (s[jsonProp] = s[jsonProp].replace(
                            rjsonp,
                            "$1" + callbackName
                        ))
                        : s.jsonp !== !1 &&
              (s.url +=
                (ajax_rquery.test(
                    s.url
                )
                    ? "&"
                    : "?") +
                s.jsonp +
                "=" +
                callbackName),
                    (s.converters["script json"] = function (
                    ) {
                        return (
                            responseContainer ||
                jQuery.error(
                    callbackName + " was not called"
                ),
                            responseContainer[0]
                        );
                    }),
                    (s.dataTypes[0] = "json"),
                    (overwritten = window[callbackName]),
                    (window[callbackName] = function (
                    ) {
                        responseContainer = arguments;
                    }),
                    jqXHR.always(
                        function (
                        ) {
                            (window[callbackName] = overwritten),
                            s[callbackName] &&
                ((s.jsonpCallback = originalSettings.jsonpCallback),
                oldCallbacks.push(
                    callbackName
                )),
                            responseContainer &&
                jQuery.isFunction(
                    overwritten
                ) &&
                overwritten(
                    responseContainer[0]
                ),
                            (responseContainer = overwritten = void 0);
                        }
                    ),
                    "script"
                );
        }
    );
    var xhrCallbacks,
        xhrSupported,
        xhrId = 0,
        xhrOnUnloadAbort =
      window.ActiveXObject &&
      function (
      ) {
          var key;
          for (key in xhrCallbacks) xhrCallbacks[key](
              void 0,
              !0
          );
      };
    function createStandardXHR(
    ) {
        try {
            return new window.XMLHttpRequest(
            );
        } catch (e) {}
    }
    function createActiveXHR(
    ) {
        try {
            return new window.ActiveXObject(
                "Microsoft.XMLHTTP"
            );
        } catch (e) {}
    }
    (jQuery.ajaxSettings.xhr = window.ActiveXObject
        ? function (
        ) {
            return (!this.isLocal && createStandardXHR(
            )) || createActiveXHR(
            );
        }
        : createStandardXHR),
    (xhrSupported = jQuery.ajaxSettings.xhr(
    )),
    (jQuery.support.cors = !!xhrSupported && "withCredentials" in xhrSupported),
    (xhrSupported = jQuery.support.ajax = !!xhrSupported),
    xhrSupported &&
      jQuery.ajaxTransport(
          function (
              s
          ) {
              if (!s.crossDomain || jQuery.support.cors) {
                  var callback;
                  return {
                      send: function (
                          headers, complete
                      ) {
                          var handle,
                              i,
                              xhr = s.xhr(
                              );
                          if (
                              (s.username
                                  ? xhr.open(
                                      s.type,
                                      s.url,
                                      s.async,
                                      s.username,
                                      s.password
                                  )
                                  : xhr.open(
                                      s.type,
                                      s.url,
                                      s.async
                                  ),
                              s.xhrFields)
                          )
                              for (i in s.xhrFields) xhr[i] = s.xhrFields[i];
                          s.mimeType &&
                xhr.overrideMimeType &&
                xhr.overrideMimeType(
                    s.mimeType
                ),
                          s.crossDomain ||
                  headers["X-Requested-With"] ||
                  (headers["X-Requested-With"] = "XMLHttpRequest");
                          try {
                              for (i in headers) xhr.setRequestHeader(
                                  i,
                                  headers[i]
                              );
                          } catch (err) {}
                          xhr.send(
                              (s.hasContent && s.data) || null
                          ),
                          (callback = function (
                              _, isAbort
                          ) {
                              var status, responseHeaders, statusText, responses;
                              try {
                                  if (callback && (isAbort || 4 === xhr.readyState)) {
                                      if (
                                          ((callback = void 0),
                                          handle &&
                          ((xhr.onreadystatechange = jQuery.noop),
                          xhrOnUnloadAbort && delete xhrCallbacks[handle]),
                                          isAbort)
                                      )
                                          4 !== xhr.readyState && xhr.abort(
                                          );
                                      else {
                                          (responses = {
                                          }),
                                          (status = xhr.status),
                                          (responseHeaders = xhr.getAllResponseHeaders(
                                          )),
                                          "string" == typeof xhr.responseText &&
                            (responses.text = xhr.responseText);
                                          try {
                                              statusText = xhr.statusText;
                                          } catch (e) {
                                              statusText = "";
                                          }
                                          !status && s.isLocal && !s.crossDomain
                                              ? (status = responses.text ? 200 : 404)
                                              : 1223 === status && (status = 204);
                                      }
                                  }
                              } catch (firefoxAccessException) {
                                  isAbort || complete(
                                      -1,
                                      firefoxAccessException
                                  );
                              }
                              responses &&
                    complete(
                        status,
                        statusText,
                        responses,
                        responseHeaders
                    );
                          }),
                          !s.async
                              ? callback(
                              )
                              : 4 === xhr.readyState
                                  ? setTimeout(
                                      callback
                                  )
                                  : ((handle = ++xhrId),
                                  xhrOnUnloadAbort &&
                      (xhrCallbacks ||
                        ((xhrCallbacks = {
                        }),
                        jQuery(
                            window
                        ).unload(
                            xhrOnUnloadAbort
                        )),
                      (xhrCallbacks[handle] = callback)),
                                  (xhr.onreadystatechange = callback));
                      },
                      abort: function (
                      ) {
                          callback && callback(
                              void 0,
                              !0
                          );
                      },
                  };
              }
          }
      );
    var fxNow,
        timerId,
        animationPrefilters = [defaultPrefilter,],
        tweeners = {
            "*": [
                function (
                    prop, value
                ) {
                    var end,
                        unit,
                        tween = this.createTween(
                            prop,
                            value
                        ),
                        parts = new RegExp(
                            "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$",
                            "i",
                        ).exec(
                            value
                        ),
                        target = tween.cur(
                        ),
                        start = +target || 0,
                        scale = 1,
                        maxIterations = 20;
                    if (parts) {
                        if (
                            ((end = +parts[2]),
                            (unit = parts[3] || (jQuery.cssNumber[prop] ? "" : "px")),
                            "px" !== unit && start)
                        ) {
                            start = jQuery.css(
                                tween.elem,
                                prop,
                                !0
                            ) || end || 1;
                            do
                                (scale ||= ".5"),
                                (start /= scale),
                                jQuery.style(
                                    tween.elem,
                                    prop,
                                    start + unit
                                );
                            while (
                                scale !== (scale = tween.cur(
                                ) / target) &&
                1 !== scale &&
                --maxIterations
                            );
                        }
                        (tween.unit = unit),
                        (tween.start = start),
                        (tween.end = parts[1] ? start + (parts[1] + 1) * end : end);
                    }
                    return tween;
                },
            ],
        };
    function createFxNow(
    ) {
        return (
            setTimeout(
                function (
                ) {
                    fxNow = void 0;
                }
            ),
            (fxNow = jQuery.now(
            ))
        );
    }
    function createTweens(
        animation, props
    ) {
        jQuery.each(
            props,
            function (
                prop, value
            ) {
                for (
                    var collection = (tweeners[prop] || []).concat(
                            tweeners["*"]
                        ),
                        index = 0,
                        length = collection.length;
                    length > index;
                    index++
                )
                    if (collection[index].call(
                        animation,
                        prop,
                        value
                    )) return;
            }
        );
    }
    function Animation1(
        elem, properties, options
    ) {
        var result,
            stopped,
            index = 0,
            length = animationPrefilters.length,
            deferred = jQuery.Deferred(
            ).always(
                function (
                ) {
                    delete tick.elem;
                }
            ),
            tick = function (
            ) {
                if (stopped) return !1;
                for (
                    var currentTime = fxNow || createFxNow(
                        ),
                        remaining = Math.max(
                            0,
                            animation.startTime + animation.duration - currentTime,
                        ),
                        temp = remaining / animation.duration || 0,
                        percent = 1 - temp,
                        index = 0,
                        length = animation.tweens.length;
                    length > index;
                    index++
                )
                    animation.tweens[index].run(
                        percent
                    );
                return (deferred.notifyWith(
                    elem,
                    [animation, percent, remaining,]
                ),
                1 > percent && length)
                    ? remaining
                    : (deferred.resolveWith(
                        elem,
                        [animation,]
                    ), !1);
            },
            animation = deferred.promise(
                {
                    elem: elem,
                    props: jQuery.extend(
                        {
                        },
                        properties
                    ),
                    opts: jQuery.extend(
                        !0,
                        {
                            specialEasing: {
                            },
                        },
                        options,
                    ),
                    originalProperties: properties,
                    originalOptions: options,
                    startTime: fxNow || createFxNow(
                    ),
                    duration: options.duration,
                    tweens: [],
                    createTween: function (
                        prop, end
                    ) {
                        var tween = jQuery.Tween(
                            elem,
                            animation.opts,
                            prop,
                            end,
                            animation.opts.specialEasing[prop] || animation.opts.easing,
                        );
                        return animation.tweens.push(
                            tween
                        ), tween;
                    },
                    stop: function (
                        gotoEnd
                    ) {
                        var index = 0,
                            length = gotoEnd ? animation.tweens.length : 0;
                        if (stopped) return this;
                        for (stopped = !0; length > index; index++)
                            animation.tweens[index].run(
                                1
                            );
                        return (
                            gotoEnd
                                ? deferred.resolveWith(
                                    elem,
                                    [animation, gotoEnd,]
                                )
                                : deferred.rejectWith(
                                    elem,
                                    [animation, gotoEnd,]
                                ),
                            this
                        );
                    },
                }
            ),
            props = animation.props;
        for (
            propFilter(
                props,
                animation.opts.specialEasing
            );
            length > index;
            index++
        )
            if (
                (result = animationPrefilters[index].call(
                    animation,
                    elem,
                    props,
                    animation.opts,
                ))
            )
                return result;
        return (
            createTweens(
                animation,
                props
            ),
            jQuery.isFunction(
                animation.opts.start
            ) &&
        animation.opts.start.call(
            elem,
            animation
        ),
            jQuery.fx.timer(
                jQuery.extend(
                    tick,
                    {
                        elem: elem,
                        anim: animation,
                        queue: animation.opts.queue,
                    }
                ),
            ),
            animation
                .progress(
                    animation.opts.progress
                )
                .done(
                    animation.opts.done,
                    animation.opts.complete
                )
                .fail(
                    animation.opts.fail
                )
                .always(
                    animation.opts.always
                )
        );
    }
    function propFilter(
        props, specialEasing
    ) {
        var value, name, index, easing, hooks;
        for (index in props)
            if (
                ((name = jQuery.camelCase(
                    index
                )),
                (easing = specialEasing[name]),
                (value = props[index]),
                jQuery.isArray(
                    value
                ) &&
          ((easing = value[1]), (value = props[index] = value[0])),
                index !== name && ((props[name] = value), delete props[index]),
                (hooks = jQuery.cssHooks[name]),
                hooks && "expand" in hooks)
            ) {
                (value = hooks.expand(
                    value
                )), delete props[name];
                for (index in value)
                    index in props ||
            ((props[index] = value[index]), (specialEasing[index] = easing));
            } else specialEasing[name] = easing;
    }
    jQuery.Animation = jQuery.extend(
        Animation1,
        {
            tweener: function (
                props, callback
            ) {
                jQuery.isFunction(
                    props
                )
                    ? ((callback = props), (props = ["*",]))
                    : (props = props.split(
                        " "
                    ));
                for (var prop, index = 0, length = props.length; length > index; index++)
                    (prop = props[index]),
                    (tweeners[prop] = tweeners[prop] || []),
                    tweeners[prop].unshift(
                        callback
                    );
            },
            prefilter: function (
                callback, prepend
            ) {
                prepend
                    ? animationPrefilters.unshift(
                        callback
                    )
                    : animationPrefilters.push(
                        callback
                    );
            },
        }
    );
    function defaultPrefilter(
        elem, props, opts
    ) {
        var prop,
            index,
            value,
            dataShow,
            toggle,
            tween,
            hooks,
            anim = this,
            style = elem.style,
            orig = {
            },
            handled = [];
        elem.nodeType && isHidden(
            elem
        ),
        opts.queue ||
        ((hooks = jQuery._queueHooks(
            elem,
            "fx"
        )),
        null == hooks.unqueued &&
          ((hooks.unqueued = 0),
          hooks.empty.fire,
          (hooks.empty.fire = function (
          ) {
              hooks.unqueued || hooks.empty.fire(
              );
          })),
        hooks.unqueued++,
        anim.always(
            function (
            ) {
                anim.always(
                    function (
                    ) {
                        hooks.unqueued--,
                        jQuery.queue(
                            elem,
                            "fx"
                        ).length || hooks.empty.fire(
                        );
                    }
                );
            }
        )),
        1 === elem.nodeType &&
        ("height" in props || "width" in props) &&
        ((opts.overflow = [style.overflow, style.overflowX, style.overflowY,]),
        "inline" === jQuery.css(
            elem,
            "display"
        ) &&
          "none" === jQuery.css(
              elem,
              "float"
          ) &&
          (jQuery.support.inlineBlockNeedsLayout &&
          "inline" !== css_defaultDisplay(
              elem.nodeName
          )
              ? (style.display = "inline-block")
              : (style.zoom = 1))),
        opts.overflow &&
        ((style.overflow = "hidden"),
        !jQuery.support.shrinkWrapBlocks &&
          anim.always(
              function (
              ) {
                  (style.overflow = opts.overflow[0]),
                  (style.overflowX = opts.overflow[1]),
                  (style.overflowY = opts.overflow[2]);
              }
          ));
        for (index in props)
            if (((value = props[index]), /^(?:toggle|show|hide)$/.exec(
                value
            ))) {
                if (
                    (delete props[index],
                    (toggle ||= "toggle" === value),
                    value === (dataShow.hidden ? "hide" : "show"))
                )
                    continue;
                handled.push(
                    index
                );
            }
        if ((handled.length, handled.length))
            for (
                dataShow =
          jQuery._data(
              elem,
              "fxshow"
          ) || jQuery._data(
              elem,
              "fxshow",
              {
              }
          ),
                ("hidden" in dataShow) && dataShow.hidden,
                toggle && (dataShow.hidden = !dataShow.hidden),
                dataShow.hidden
                    ? jQuery(
                        elem
                    ).show(
                    )
                    : anim.done(
                        function (
                        ) {
                            jQuery(
                                elem
                            ).hide(
                            );
                        }
                    ),
                anim.done(
                    function (
                    ) {
                        var prop;
                        jQuery._removeData(
                            elem,
                            "fxshow"
                        );
                        for (prop in orig) jQuery.style(
                            elem,
                            prop,
                            orig[prop]
                        );
                    }
                ),
                index = 0;
                index < handled.length;
                index++
            )
                (prop = handled[index]),
                (tween = anim.createTween(
                    prop,
                    dataShow.hidden ? dataShow[prop] : 0,
                )),
                (orig[prop] = dataShow[prop] || jQuery.style(
                    elem,
                    prop
                )),
                prop in dataShow ||
            ((dataShow[prop] = tween.start),
            dataShow.hidden &&
              ((tween.end = tween.start),
              (tween.start = "width" === prop || "height" === prop ? 1 : 0)));
    }
    function Tween(
        elem, options, prop, end, easing
    ) {
        return new Tween.prototype.init(
            elem,
            options,
            prop,
            end,
            easing
        );
    }
    (jQuery.Tween = Tween),
    (Tween.prototype = {
        constructor: Tween,
        init: function (
            elem, options, prop, end, easing, unit
        ) {
            (this.elem = elem),
            (this.prop = prop),
            (this.easing = easing || "swing"),
            (this.options = options),
            (this.start = this.now = this.cur(
            )),
            (this.end = end),
            (this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px"));
        },
        cur: function (
        ) {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get
                ? hooks.get(
                    this
                )
                : Tween.propHooks._default.get(
                    this
                );
        },
        run: function (
            percent
        ) {
            var eased,
                hooks = Tween.propHooks[this.prop];
            return (
                this.options.duration
                    ? (this.pos = eased = jQuery.easing[this.easing](
                        percent,
                        this.options.duration * percent,
                        0,
                        1,
                        this.options.duration,
                    ))
                    : (this.pos = eased = percent),
                (this.now = (this.end - this.start) * eased + this.start),
                this.options.step &&
            this.options.step.call(
                this.elem,
                this.now,
                this
            ),
                hooks && hooks.set
                    ? hooks.set(
                        this
                    )
                    : Tween.propHooks._default.set(
                        this
                    ),
                this
            );
        },
    }),
    (Tween.prototype.init.prototype = Tween.prototype),
    (Tween.propHooks = {
        _default: {
            get: function (
                tween
            ) {
                var result;
                return tween.elem[tween.prop] != null &&
            (!tween.elem.style || tween.elem.style[tween.prop] == null)
                    ? tween.elem[tween.prop]
                    : ((result = jQuery.css(
                        tween.elem,
                        tween.prop,
                        ""
                    )),
                    result && "auto" !== result ? 0 : result);
            },
            set: function (
                tween
            ) {
                jQuery.fx.step[tween.prop]
                    ? jQuery.fx.step[tween.prop](
                        tween
                    )
                    : tween.elem.style &&
              (tween.elem.style[jQuery.cssProps[tween.prop]] != null ||
                jQuery.cssHooks[tween.prop])
                        ? jQuery.style(
                            tween.elem,
                            tween.prop,
                            tween.now + tween.unit
                        )
                        : (tween.elem[tween.prop] = tween.now);
            },
        },
    }),
    (Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function (
            tween
        ) {
            tween.elem.nodeType &&
          tween.elem.parentNode &&
          (tween.elem[tween.prop] = tween.now);
        },
    }),
    jQuery.each(
        ["toggle", "show", "hide",],
        function (
            i, name
        ) {
            jQuery.fn[name] = function (
                speed, easing, callback
            ) {
                return null == speed || "boolean" == typeof speed
                    ? jQuery.fn[name].apply(
                        this,
                        arguments
                    )
                    : this.animate(
                        genFx(
                            name,
                            !0
                        ),
                        speed,
                        easing,
                        callback
                    );
            };
        }
    ),
    jQuery.fn.extend(
        {
            fadeTo: function (
                speed, to, easing, callback
            ) {
                return this.filter(
                    isHidden
                ).css(
                    "opacity",
                    0
                ).show(
                ).end(
                ).animate(
                    {
                        opacity: to,
                    },
                    speed,
                    easing,
                    callback,
                );
            },
            animate: function (
                prop, speed, easing, callback
            ) {
                var empty = jQuery.isEmptyObject(
                        prop
                    ),
                    optall = jQuery.speed(
                        speed,
                        easing,
                        callback
                    ),
                    doAnimation = function (
                    ) {
                        var anim = Animation1(
                            this,
                            jQuery.extend(
                                {
                                },
                                prop
                            ),
                            optall
                        );
                        (doAnimation.finish = function (
                        ) {
                            anim.stop(
                                !0
                            );
                        }),
                        (empty || jQuery._data(
                            this,
                            "finish"
                        )) && anim.stop(
                            !0
                        );
                    };
                return (
                    (doAnimation.finish = doAnimation),
                    empty || optall.queue === !1
                        ? this.each(
                            doAnimation
                        )
                        : this.queue(
                            optall.queue,
                            doAnimation
                        )
                );
            },
            stop: function (
                type, clearQueue, gotoEnd
            ) {
                var stopQueue = function (
                    hooks
                ) {
                    var stop = hooks.stop;
                    delete hooks.stop, stop(
                        gotoEnd
                    );
                };
                return (
                    "string" !== typeof type &&
            ((gotoEnd = clearQueue), (clearQueue = type), (type = void 0)),
                    clearQueue && !1 !== type && this.queue(
                        type || "fx",
                        []
                    ),
                    this.each(
                        function (
                        ) {
                            var dequeue = !0,
                                index = null != type && type + "queueHooks",
                                timers = jQuery.timers,
                                data = jQuery._data(
                                    this
                                );
                            if (index)
                                data[index] && data[index].stop && stopQueue(
                                    data[index]
                                );
                            else
                                for (index in data)
                                    data[index] &&
                  data[index].stop &&
                  /queueHooks$/.test(
                      index
                  ) &&
                  stopQueue(
                      data[index]
                  );
                            for (index = timers.length; index--; )
                                timers[index].elem === this &&
                (null == type || timers[index].queue === type) &&
                (timers[index].anim.stop(
                    gotoEnd
                ),
                (dequeue = !1),
                timers.splice(
                    index,
                    1
                ));
                            (dequeue || !gotoEnd) && jQuery.dequeue(
                                this,
                                type
                            );
                        }
                    )
                );
            },
            finish: function (
                type
            ) {
                return (
                    !1 !== type && (type ||= "fx"),
                    this.each(
                        function (
                        ) {
                            var index,
                                data = jQuery._data(
                                    this
                                ),
                                queue = data[type + "queue"],
                                hooks = data[type + "queueHooks"],
                                timers = jQuery.timers,
                                length = queue ? queue.length : 0;
                            for (
                                data.finish = !0,
                                jQuery.queue(
                                    this,
                                    type,
                                    []
                                ),
                                hooks &&
                  hooks.cur &&
                  hooks.cur.finish &&
                  hooks.cur.finish.call(
                      this
                  ),
                                index = timers.length;
                                index--;

                            )
                                timers[index].elem === this &&
                timers[index].queue === type &&
                (timers[index].anim.stop(
                    !0
                ), timers.splice(
                    index,
                    1
                ));
                            for (index = 0; length > index; index++)
                                queue[index] &&
                queue[index].finish &&
                queue[index].finish.call(
                    this
                );
                            delete data.finish;
                        }
                    )
                );
            },
        }
    );
    function genFx(
        type, includeWidth
    ) {
        var which,
            attrs = {
                height: type,
            },
            i = 0;
        for (includeWidth = includeWidth ? 1 : 0; 4 > i; i += 2 - includeWidth)
            (which = cssExpand[i]),
            (attrs["margin" + which] = attrs["padding" + which] = type);
        return includeWidth && (attrs.opacity = attrs.width = type), attrs;
    }
    jQuery.each(
        {
            slideDown: genFx(
                "show"
            ),
            slideUp: genFx(
                "hide"
            ),
            slideToggle: genFx(
                "toggle"
            ),
            fadeIn: {
                opacity: "show",
            },
            fadeOut: {
                opacity: "hide",
            },
            fadeToggle: {
                opacity: "toggle",
            },
        },
        function (
            name, props
        ) {
            jQuery.fn[name] = function (
                speed, easing, callback
            ) {
                return this.animate(
                    props,
                    speed,
                    easing,
                    callback
                );
            };
        },
    ),
    (jQuery.speed = function (
        speed, easing, fn
    ) {
        var opt =
        speed && "object" == typeof speed
            ? jQuery.extend(
                {
                },
                speed
            )
            : {
                complete:
                fn || (!fn && easing) || (jQuery.isFunction(
                    speed
                ) && speed),
                duration: speed,
                easing:
                (fn && easing) ||
                (easing && !jQuery.isFunction(
                    easing
                ) && easing),
            };
        return (
            (opt.duration = jQuery.fx.off
                ? 0
                : "number" == typeof opt.duration
                    ? opt.duration
                    : opt.duration in jQuery.fx.speeds
                        ? jQuery.fx.speeds[opt.duration]
                        : jQuery.fx.speeds._default),
            (null == opt.queue || opt.queue === !0) && (opt.queue = "fx"),
            (opt.old = opt.complete),
            (opt.complete = function (
            ) {
                jQuery.isFunction(
                    opt.old
                ) && opt.old.call(
                    this
                ),
                opt.queue && jQuery.dequeue(
                    this,
                    opt.queue
                );
            }),
            opt
        );
    }),
    (jQuery.easing = {
        linear: function (
            p
        ) {
            return p;
        },
        swing: function (
            p
        ) {
            return 0.5 - Math.cos(
                p * Math.PI
            ) / 2;
        },
    }),
    (jQuery.timers = []),
    (jQuery.fx = Tween.prototype.init),
    (jQuery.fx.tick = function (
    ) {
        var timer,
            timers = jQuery.timers,
            i = 0;
        for (fxNow = jQuery.now(
        ); i < timers.length; i++)
            (timer = timers[i]),
            timer(
            ) || timers[i] !== timer || timers.splice(
                i--,
                1
            );
        timers.length || jQuery.fx.stop(
        ), (fxNow = void 0);
    }),
    (jQuery.fx.timer = function (
        timer
    ) {
        timer(
        ) && jQuery.timers.push(
            timer
        ) && jQuery.fx.start(
        );
    }),
    (jQuery.fx.interval = 13),
    (jQuery.fx.start = function (
    ) {
        timerId || (timerId = setInterval(
            jQuery.fx.tick,
            jQuery.fx.interval
        ));
    }),
    (jQuery.fx.stop = function (
    ) {
        clearInterval(
            timerId
        ), (timerId = null);
    }),
    (jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400,
    }),
    (jQuery.fx.step = {
    }),
    jQuery.expr &&
      jQuery.expr.filters &&
      (jQuery.expr.filters.animated = function (
          elem
      ) {
          return jQuery.grep(
              jQuery.timers,
              function (
                  fn
              ) {
                  return elem === fn.elem;
              }
          ).length;
      }),
    (jQuery.fn.offset = function (
        options
    ) {
        if (arguments.length)
            return void 0 === options
                ? this
                : this.each(
                    function (
                        i
                    ) {
                        jQuery.offset.setOffset(
                            this,
                            options,
                            i
                        );
                    }
                );
        var win,
            box = {
                top: 0,
                left: 0,
            },
            elem = this[0],
            doc = elem && elem.ownerDocument;
        return !doc
            ? void 0
            : (doc.documentElement, !jQuery.contains(
                doc.documentElement,
                elem
            ))
                ? box
                : ("undefined" !== typeof elem.getBoundingClientRect &&
            (box = elem.getBoundingClientRect(
            )),
                (win = getWindow(
                    doc
                )),
                {
                    top:
              box.top +
              (win.pageYOffset || doc.documentElement.scrollTop) -
              (doc.documentElement.clientTop || 0),
                    left:
              box.left +
              (win.pageXOffset || doc.documentElement.scrollLeft) -
              (doc.documentElement.clientLeft || 0),
                });
    }),
    (jQuery.offset = {
        setOffset: function (
            elem, options, i
        ) {
            var position = jQuery.css(
                elem,
                "position"
            );
            "static" === position && (elem.style.position = "relative");
            var curElem = jQuery(
                    elem
                ),
                curOffset = curElem.offset(
                ),
                curCSSTop = jQuery.css(
                    elem,
                    "top"
                ),
                curCSSLeft = jQuery.css(
                    elem,
                    "left"
                ),
                calculatePosition =
            ("absolute" === position || "fixed" === position) &&
            jQuery.inArray(
                "auto",
                [curCSSTop, curCSSLeft,]
            ) > -1,
                props = {
                },
                curPosition = {
                },
                curTop,
                curLeft;
            calculatePosition
                ? ((curPosition = curElem.position(
                )),
                (curTop = curPosition.top),
                (curLeft = curPosition.left))
                : ((curTop = parseFloat(
                    curCSSTop
                ) || 0),
                (curLeft = parseFloat(
                    curCSSLeft
                ) || 0)),
            jQuery.isFunction(
                options
            ) &&
            (options = options.call(
                elem,
                i,
                curOffset
            )),
            null != options.top &&
            (props.top = options.top - curOffset.top + curTop),
            null != options.left &&
            (props.left = options.left - curOffset.left + curLeft),
            "using" in options
                ? options.using.call(
                    elem,
                    props
                )
                : curElem.css(
                    props
                );
        },
    }),
    jQuery.fn.extend(
        {
            position: function (
            ) {
                if (!this[0]) return;
                var offsetParent,
                    offset,
                    parentOffset = {
                        top: 0,
                        left: 0,
                    },
                    elem = this[0];
                return (
                    "fixed" === jQuery.css(
                        elem,
                        "position"
                    )
                        ? (offset = elem.getBoundingClientRect(
                        ))
                        : ((offsetParent = this.offsetParent(
                        )),
                        (offset = this.offset(
                        )),
                        jQuery.nodeName(
                            offsetParent[0],
                            "html"
                        ) ||
                (parentOffset = offsetParent.offset(
                )),
                        (parentOffset.top += jQuery.css(
                            offsetParent[0],
                            "borderTopWidth",
                            !0,
                        )),
                        (parentOffset.left += jQuery.css(
                            offsetParent[0],
                            "borderLeftWidth",
                            !0,
                        ))),
                    {
                        top:
              offset.top - parentOffset.top - jQuery.css(
                  elem,
                  "marginTop",
                  !0
              ),
                        left:
              offset.left -
              parentOffset.left -
              jQuery.css(
                  elem,
                  "marginLeft",
                  !0
              ),
                    }
                );
            },
            offsetParent: function (
            ) {
                return this.map(
                    function (
                    ) {
                        for (
                            var offsetParent = this.offsetParent || document.documentElement;
                            offsetParent &&
            !jQuery.nodeName(
                offsetParent,
                "html"
            ) &&
            "static" === jQuery.css(
                offsetParent,
                "position"
            );

                        )
                            offsetParent = offsetParent.offsetParent;
                        return offsetParent || document.documentElement;
                    }
                );
            },
        }
    ),
    jQuery.each(
        {
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset",
        },
        function (
            method, prop
        ) {
            var top = /Y/.test(
                prop
            );
            jQuery.fn[method] = function (
                val
            ) {
                return jQuery.access(
                    this,
                    function (
                        elem, method1, val
                    ) {
                        var win = getWindow(
                            elem
                        );
                        if (void 0 === val)
                            return win
                                ? prop in win
                                    ? win[prop]
                                    : win.document.documentElement[method1]
                                : elem[method1];
                        win
                            ? win.scrollTo(
                                !top
                                    ? val
                                    : jQuery(
                                        win
                                    ).scrollLeft(
                                    ),
                                top
                                    ? val
                                    : jQuery(
                                        win
                                    ).scrollTop(
                                    ),
                            )
                            : (elem[method1] = val);
                    },
                    method,
                    val,
                    arguments.length,
                    null,
                );
            };
        },
    );
    function getWindow(
        elem
    ) {
        return jQuery.isWindow(
            elem
        )
            ? elem
            : 9 === elem.nodeType
                ? elem.defaultView || elem.parentWindow
                : !1;
    }
    jQuery.each(
        {
            Height: "height",
            Width: "width",
        },
        function (
            name, type
        ) {
            jQuery.each(
                {
                    padding: "inner" + name,
                    content: type,
                    "": "outer" + name,
                },
                function (
                    defaultExtra, funcName
                ) {
                    jQuery.fn[funcName] = function (
                        margin, value
                    ) {
                        var chainable =
                arguments.length &&
                (defaultExtra || "boolean" !== typeof margin),
                            extra =
                defaultExtra ||
                (!0 === margin || !0 === value ? "margin" : "border");
                        return jQuery.access(
                            this,
                            function (
                                elem, type1, value
                            ) {
                                return jQuery.isWindow(
                                    elem
                                )
                                    ? elem.document.documentElement["client" + name]
                                    : 9 === elem.nodeType
                                        ? Math.max(
                                            elem.body["scroll" + name],
                                            elem.documentElement["scroll" + name],
                                            elem.body["offset" + name],
                                            elem.documentElement["offset" + name],
                                            elem.documentElement["client" + name],
                                        )
                                        : void 0 === value
                                            ? jQuery.css(
                                                elem,
                                                type1,
                                                extra
                                            )
                                            : jQuery.style(
                                                elem,
                                                type1,
                                                value,
                                                extra
                                            );
                            },
                            type,
                            chainable ? margin : void 0,
                            chainable,
                            null,
                        );
                    };
                },
            );
        },
    ),
    (window.jQuery = window.$ = jQuery),
    "function" == typeof define &&
      define.amd &&
      define.amd.jQuery &&
      define(
          "jquery",
          [],
          function (
          ) {
              return jQuery;
          }
      );
})(
    window
);
