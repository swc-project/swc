!function(root, doc, factory) {
    "function" == typeof define && define.amd ? define([
        "jquery"
    ], function($) {
        return factory($, root, doc), $.mobile;
    }) : factory(root.jQuery, root, doc);
}(this, document, function(jQuery, window, document1, undefined) {
    var undefined1, nsNormalizeDict, oldFind, rbrace, jqmDataRE, window1, compensateToolbars, undefined2, uuid, slice, _cleanData, rcapitals, replaceFunction, bool, docElem, refNode, fakeBody, div, support, self, $win, dummyFnToInitNavigate, undefined3, path, $base, dialogHashKey, undefined4, path1, initialHref, undefined5, props, testElement, vendorPrefixes, heldCall, curr, diff, handler, lastCall, baseElement, base, undefined6, originalWidget, keepNativeFactoryDefault, orig, undefined7, pageTransitionQueue, isPageTransitioning, window2, undefined8, rInitialLetter, iconposClass, meta, initialContent, disabledZoom, enabledZoom, disabledInitially, undefined9, rDividerListItem, origDefaultFilterCallback;
    jQuery.mobile = {}, function($, window, undefined) {
        $.extend($.mobile, {
            version: "1.4.2",
            subPageUrlKey: "ui-page",
            hideUrlBar: !0,
            keepNative: ":jqmData(role='none'), :jqmData(role='nojs')",
            activePageClass: "ui-page-active",
            activeBtnClass: "ui-btn-active",
            focusClass: "ui-focus",
            ajaxEnabled: !0,
            hashListeningEnabled: !0,
            linkBindingEnabled: !0,
            defaultPageTransition: "fade",
            maxTransitionWidth: !1,
            minScrollBack: 0,
            defaultDialogTransition: "pop",
            pageLoadErrorMessage: "Error Loading Page",
            pageLoadErrorMessageTheme: "a",
            phonegapNavigationEnabled: !1,
            autoInitializePage: !0,
            pushStateEnabled: !0,
            ignoreContentEnabled: !1,
            buttonMarkup: {
                hoverDelay: 200
            },
            dynamicBaseEnabled: !0,
            pageContainer: $(),
            allowCrossDomainPages: !1,
            dialogHashKey: "&ui-state=dialog"
        });
    }(jQuery, 0), nsNormalizeDict = {}, oldFind = jQuery.find, rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, jqmDataRE = /:jqmData\(([^)]*)\)/g, jQuery.extend(jQuery.mobile, {
        ns: "",
        getAttribute: function(element, key) {
            var data;
            (element = element.jquery ? element[0] : element) && element.getAttribute && (data = element.getAttribute("data-" + jQuery.mobile.ns + key));
            try {
                data = "true" === data || "false" !== data && ("null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? JSON.parse(data) : data);
            } catch (err) {}
            return data;
        },
        nsNormalizeDict: nsNormalizeDict,
        nsNormalize: function(prop) {
            return nsNormalizeDict[prop] || (nsNormalizeDict[prop] = jQuery.camelCase(jQuery.mobile.ns + prop));
        },
        closestPageData: function($target) {
            return $target.closest(":jqmData(role='page'), :jqmData(role='dialog')").data("mobile-page");
        }
    }), jQuery.fn.jqmData = function(prop, value) {
        var result;
        return void 0 !== prop && (prop && (prop = jQuery.mobile.nsNormalize(prop)), result = arguments.length < 2 || undefined1 === value ? this.data(prop) : this.data(prop, value)), result;
    }, jQuery.jqmData = function(elem, prop, value) {
        var result;
        return void 0 !== prop && (result = jQuery.data(elem, prop ? jQuery.mobile.nsNormalize(prop) : prop, value)), result;
    }, jQuery.fn.jqmRemoveData = function(prop) {
        return this.removeData(jQuery.mobile.nsNormalize(prop));
    }, jQuery.jqmRemoveData = function(elem, prop) {
        return jQuery.removeData(elem, jQuery.mobile.nsNormalize(prop));
    }, jQuery.find = function(selector, context, ret, extra) {
        return selector.indexOf(":jqmData") > -1 && (selector = selector.replace(jqmDataRE, "[data-" + (jQuery.mobile.ns || "") + "$1]")), oldFind.call(this, selector, context, ret, extra);
    }, jQuery.extend(jQuery.find, oldFind), function($, undefined) {
        var orig, removeData, uuid = 0, runiqueId = /^ui-id-\d+$/;
        function focusable(element, isTabIndexNotNaN) {
            var map, mapName, img, nodeName = element.nodeName.toLowerCase();
            return "area" === nodeName ? (mapName = (map = element.parentNode).name, !!element.href && !!mapName && "map" === map.nodeName.toLowerCase() && !!(img = $("img[usemap=#" + mapName + "]")[0]) && visible(img)) : (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName && element.href || isTabIndexNotNaN) && visible(element);
        }
        function visible(element) {
            return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function() {
                return "hidden" === $.css(this, "visibility");
            }).length;
        }
        $.ui = $.ui || {}, $.extend($.ui, {
            version: "c0ab71056b936627e8a7821f03c044aec6280a40",
            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        }), $.fn.extend({
            focus: (orig = $.fn.focus, function(delay, fn) {
                return "number" == typeof delay ? this.each(function() {
                    var elem = this;
                    setTimeout(function() {
                        $(elem).focus(), fn && fn.call(elem);
                    }, delay);
                }) : orig.apply(this, arguments);
            }),
            scrollParent: function() {
                var scrollParent;
                return scrollParent = $.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                    return /(relative|absolute|fixed)/.test($.css(this, "position")) && /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
                }).eq(0) : this.parents().filter(function() {
                    return /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
                }).eq(0), /fixed/.test(this.css("position")) || !scrollParent.length ? $(this[0].ownerDocument || document1) : scrollParent;
            },
            uniqueId: function() {
                return this.each(function() {
                    this.id || (this.id = "ui-id-" + ++uuid);
                });
            },
            removeUniqueId: function() {
                return this.each(function() {
                    runiqueId.test(this.id) && $(this).removeAttr("id");
                });
            }
        }), $.extend($.expr[":"], {
            data: $.expr.createPseudo ? $.expr.createPseudo(function(dataName) {
                return function(elem) {
                    return !!$.data(elem, dataName);
                };
            }) : function(elem, i, match) {
                return !!$.data(elem, match[3]);
            },
            focusable: function(element) {
                return focusable(element, !isNaN($.attr(element, "tabindex")));
            },
            tabbable: function(element) {
                var tabIndex = $.attr(element, "tabindex"), isTabIndexNaN = isNaN(tabIndex);
                return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
            }
        }), $("<a>").outerWidth(1).jquery || $.each([
            "Width",
            "Height"
        ], function(i, name) {
            var side = "Width" === name ? [
                "Left",
                "Right"
            ] : [
                "Top",
                "Bottom"
            ], type = name.toLowerCase(), orig = {
                innerWidth: $.fn.innerWidth,
                innerHeight: $.fn.innerHeight,
                outerWidth: $.fn.outerWidth,
                outerHeight: $.fn.outerHeight
            };
            function reduce(elem, size, border, margin) {
                return $.each(side, function() {
                    size -= parseFloat($.css(elem, "padding" + this)) || 0, border && (size -= parseFloat($.css(elem, "border" + this + "Width")) || 0), margin && (size -= parseFloat($.css(elem, "margin" + this)) || 0);
                }), size;
            }
            $.fn["inner" + name] = function(size) {
                return undefined === size ? orig["inner" + name].call(this) : this.each(function() {
                    $(this).css(type, reduce(this, size) + "px");
                });
            }, $.fn["outer" + name] = function(size, margin) {
                return "number" != typeof size ? orig["outer" + name].call(this, size) : this.each(function() {
                    $(this).css(type, reduce(this, size, !0, margin) + "px");
                });
            };
        }), $.fn.addBack || ($.fn.addBack = function(selector) {
            return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
        }), $("<a>").data("a-b", "a").removeData("a-b").data("a-b") && ($.fn.removeData = (removeData = $.fn.removeData, function(key) {
            return arguments.length ? removeData.call(this, $.camelCase(key)) : removeData.call(this);
        })), $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), $.support.selectstart = "onselectstart" in document1.createElement("div"), $.fn.extend({
            disableSelection: function() {
                return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(event1) {
                    event1.preventDefault();
                });
            },
            enableSelection: function() {
                return this.unbind(".ui-disableSelection");
            },
            zIndex: function(zIndex) {
                if (undefined !== zIndex) return this.css("zIndex", zIndex);
                if (this.length) for(var position, value, elem = $(this[0]); elem.length && elem[0] !== document1;){
                    if (("absolute" === (position = elem.css("position")) || "relative" === position || "fixed" === position) && !isNaN(value = parseInt(elem.css("zIndex"), 10)) && 0 !== value) return value;
                    elem = elem.parent();
                }
                return 0;
            }
        }), $.ui.plugin = {
            add: function(module, option, set) {
                var i, proto = $.ui[module].prototype;
                for(i in set)proto.plugins[i] = proto.plugins[i] || [], proto.plugins[i].push([
                    option,
                    set[i]
                ]);
            },
            call: function(instance, name, args, allowDisconnected) {
                var i, set = instance.plugins[name];
                if (set && (allowDisconnected || instance.element[0].parentNode && 11 !== instance.element[0].parentNode.nodeType)) for(i = 0; i < set.length; i++)instance.options[set[i][0]] && set[i][1].apply(instance.element, args);
            }
        };
    }(jQuery), window1 = this, compensateToolbars = function(page, desiredHeight) {
        var pageParent = page.parent(), toolbarsAffectingHeight = [], externalHeaders = pageParent.children(":jqmData(role='header')"), internalHeaders = page.children(":jqmData(role='header')"), externalFooters = pageParent.children(":jqmData(role='footer')"), internalFooters = page.children(":jqmData(role='footer')");
        return 0 === internalHeaders.length && externalHeaders.length > 0 && (toolbarsAffectingHeight = toolbarsAffectingHeight.concat(externalHeaders.toArray())), 0 === internalFooters.length && externalFooters.length > 0 && (toolbarsAffectingHeight = toolbarsAffectingHeight.concat(externalFooters.toArray())), jQuery.each(toolbarsAffectingHeight, function(index, value) {
            desiredHeight -= jQuery(value).outerHeight();
        }), Math.max(0, desiredHeight);
    }, jQuery.extend(jQuery.mobile, {
        window: jQuery(window1),
        document: jQuery(document1),
        keyCode: jQuery.ui.keyCode,
        behaviors: {},
        silentScroll: function(ypos) {
            "number" !== jQuery.type(ypos) && (ypos = jQuery.mobile.defaultHomeScroll), jQuery.event.special.scrollstart.enabled = !1, setTimeout(function() {
                window1.scrollTo(0, ypos), jQuery.mobile.document.trigger("silentscroll", {
                    x: 0,
                    y: ypos
                });
            }, 20), setTimeout(function() {
                jQuery.event.special.scrollstart.enabled = !0;
            }, 150);
        },
        getClosestBaseUrl: function(ele) {
            var url = jQuery(ele).closest(".ui-page").jqmData("url"), base = jQuery.mobile.path.documentBase.hrefNoHash;
            return jQuery.mobile.dynamicBaseEnabled && url && jQuery.mobile.path.isPath(url) || (url = base), jQuery.mobile.path.makeUrlAbsolute(url, base);
        },
        removeActiveLinkClass: function(forceRemoval) {
            jQuery.mobile.activeClickedLink && (!jQuery.mobile.activeClickedLink.closest("." + jQuery.mobile.activePageClass).length || forceRemoval) && jQuery.mobile.activeClickedLink.removeClass(jQuery.mobile.activeBtnClass), jQuery.mobile.activeClickedLink = null;
        },
        getInheritedTheme: function(el, defaultTheme) {
            for(var c, m, e = el[0], ltr = "", re = /ui-(bar|body|overlay)-([a-z])\b/; e && (!((c = e.className || "") && (m = re.exec(c))) || !(ltr = m[2]));)e = e.parentNode;
            return ltr || defaultTheme || "a";
        },
        enhanceable: function(elements) {
            return this.haveParents(elements, "enhance");
        },
        hijackable: function(elements) {
            return this.haveParents(elements, "ajax");
        },
        haveParents: function(elements, attr) {
            if (!jQuery.mobile.ignoreContentEnabled) return elements;
            var e, $element, excluded, i, count = elements.length, $newSet = jQuery();
            for(i = 0; i < count; i++){
                for($element = elements.eq(i), excluded = !1, e = elements[i]; e;){
                    if ("false" === (e.getAttribute ? e.getAttribute("data-" + jQuery.mobile.ns + attr) : "")) {
                        excluded = !0;
                        break;
                    }
                    e = e.parentNode;
                }
                excluded || ($newSet = $newSet.add($element));
            }
            return $newSet;
        },
        getScreenHeight: function() {
            return window1.innerHeight || jQuery.mobile.window.height();
        },
        resetActivePageHeight: function(height) {
            var page = jQuery("." + jQuery.mobile.activePageClass), pageHeight = page.height(), pageOuterHeight = page.outerHeight(!0);
            height = compensateToolbars(page, "number" == typeof height ? height : jQuery.mobile.getScreenHeight()), page.css("min-height", height - (pageOuterHeight - pageHeight));
        },
        loading: function() {
            var loader = this.loading._widget || jQuery(jQuery.mobile.loader.prototype.defaultHtml).loader(), returnValue = loader.loader.apply(loader, arguments);
            return this.loading._widget = loader, returnValue;
        }
    }), jQuery.addDependents = function(elem, newDependents) {
        var $elem = jQuery(elem), dependents = $elem.jqmData("dependents") || jQuery();
        $elem.jqmData("dependents", jQuery(dependents).add(newDependents));
    }, jQuery.fn.extend({
        removeWithDependents: function() {
            jQuery.removeWithDependents(this);
        },
        enhanceWithin: function() {
            var index, widgetElements = {}, keepNative = jQuery.mobile.page.prototype.keepNativeSelector(), that = this;
            for(index in jQuery.mobile.nojs && jQuery.mobile.nojs(this), jQuery.mobile.links && jQuery.mobile.links(this), jQuery.mobile.degradeInputsWithin && jQuery.mobile.degradeInputsWithin(this), jQuery.fn.buttonMarkup && this.find(jQuery.fn.buttonMarkup.initSelector).not(keepNative).jqmEnhanceable().buttonMarkup(), jQuery.fn.fieldcontain && this.find(":jqmData(role='fieldcontain')").not(keepNative).jqmEnhanceable().fieldcontain(), jQuery.each(jQuery.mobile.widgets, function(name, constructor) {
                if (constructor.initSelector) {
                    var elements = jQuery.mobile.enhanceable(that.find(constructor.initSelector));
                    elements.length > 0 && (elements = elements.not(keepNative)), elements.length > 0 && (widgetElements[constructor.prototype.widgetName] = elements);
                }
            }), widgetElements)widgetElements[index][index]();
            return this;
        },
        addDependents: function(newDependents) {
            jQuery.addDependents(this, newDependents);
        },
        getEncodedText: function() {
            return jQuery("<a>").text(this.text()).html();
        },
        jqmEnhanceable: function() {
            return jQuery.mobile.enhanceable(this);
        },
        jqmHijackable: function() {
            return jQuery.mobile.hijackable(this);
        }
    }), jQuery.removeWithDependents = function(nativeElement) {
        var element = jQuery(nativeElement);
        (element.jqmData("dependents") || jQuery()).remove(), element.remove();
    }, jQuery.addDependents = function(nativeElement, newDependents) {
        var element = jQuery(nativeElement), dependents = element.jqmData("dependents") || jQuery();
        element.jqmData("dependents", jQuery(dependents).add(newDependents));
    }, jQuery.find.matches = function(expr, set) {
        return jQuery.find(expr, null, null, set);
    }, jQuery.find.matchesSelector = function(node, expr) {
        return jQuery.find(expr, null, null, [
            node
        ]).length > 0;
    }, uuid = 0, slice = Array.prototype.slice, _cleanData = jQuery.cleanData, jQuery.cleanData = function(elems) {
        for(var elem, i = 0; null != (elem = elems[i]); i++)try {
            jQuery(elem).triggerHandler("remove");
        } catch (e) {}
        _cleanData(elems);
    }, jQuery.widget = function(name, base, prototype) {
        var fullName, existingConstructor, constructor, basePrototype, proxiedPrototype = {}, namespace = name.split(".")[0];
        return fullName = namespace + "-" + (name = name.split(".")[1]), prototype || (prototype = base, base = jQuery.Widget), jQuery.expr[":"][fullName.toLowerCase()] = function(elem) {
            return !!jQuery.data(elem, fullName);
        }, jQuery[namespace] = jQuery[namespace] || {}, existingConstructor = jQuery[namespace][name], constructor = jQuery[namespace][name] = function(options, element) {
            if (!this._createWidget) return new constructor(options, element);
            arguments.length && this._createWidget(options, element);
        }, jQuery.extend(constructor, existingConstructor, {
            version: prototype.version,
            _proto: jQuery.extend({}, prototype),
            _childConstructors: []
        }), (basePrototype = new base()).options = jQuery.widget.extend({}, basePrototype.options), jQuery.each(prototype, function(prop, value) {
            var _super, _superApply;
            if (!jQuery.isFunction(value)) {
                proxiedPrototype[prop] = value;
                return;
            }
            proxiedPrototype[prop] = (_super = function() {
                return base.prototype[prop].apply(this, arguments);
            }, _superApply = function(args) {
                return base.prototype[prop].apply(this, args);
            }, function() {
                var returnValue, __super = this._super, __superApply = this._superApply;
                return this._super = _super, this._superApply = _superApply, returnValue = value.apply(this, arguments), this._super = __super, this._superApply = __superApply, returnValue;
            });
        }), constructor.prototype = jQuery.widget.extend(basePrototype, {
            widgetEventPrefix: existingConstructor && basePrototype.widgetEventPrefix || name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        }), existingConstructor ? (jQuery.each(existingConstructor._childConstructors, function(i, child) {
            var childPrototype = child.prototype;
            jQuery.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
        }), delete existingConstructor._childConstructors) : base._childConstructors.push(constructor), jQuery.widget.bridge(name, constructor), constructor;
    }, jQuery.widget.extend = function(target) {
        for(var key, value, input = slice.call(arguments, 1), inputIndex = 0, inputLength = input.length; inputIndex < inputLength; inputIndex++)for(key in input[inputIndex])value = input[inputIndex][key], input[inputIndex].hasOwnProperty(key) && undefined2 !== value && (jQuery.isPlainObject(value) ? target[key] = jQuery.isPlainObject(target[key]) ? jQuery.widget.extend({}, target[key], value) : jQuery.widget.extend({}, value) : target[key] = value);
        return target;
    }, jQuery.widget.bridge = function(name, object) {
        var fullName = object.prototype.widgetFullName || name;
        jQuery.fn[name] = function(options) {
            var isMethodCall = "string" == typeof options, args = slice.call(arguments, 1), returnValue = this;
            return options = !isMethodCall && args.length ? jQuery.widget.extend.apply(null, [
                options
            ].concat(args)) : options, isMethodCall ? this.each(function() {
                var methodValue, instance = jQuery.data(this, fullName);
                return "instance" === options ? (returnValue = instance, !1) : instance ? jQuery.isFunction(instance[options]) && "_" !== options.charAt(0) ? (methodValue = instance[options].apply(instance, args)) !== instance && undefined2 !== methodValue ? (returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue, !1) : void 0 : jQuery.error("no such method '" + options + "' for " + name + " widget instance") : jQuery.error("cannot call methods on " + name + " prior to initialization; attempted to call method '" + options + "'");
            }) : this.each(function() {
                var instance = jQuery.data(this, fullName);
                instance ? instance.option(options || {})._init() : jQuery.data(this, fullName, new object(options, this));
            }), returnValue;
        };
    }, jQuery.Widget = function() {}, jQuery.Widget._childConstructors = [], jQuery.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: !1,
            create: null
        },
        _createWidget: function(options, element) {
            element = jQuery(element || this.defaultElement || this)[0], this.element = jQuery(element), this.uuid = uuid++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = jQuery.widget.extend({}, this.options, this._getCreateOptions(), options), this.bindings = jQuery(), this.hoverable = jQuery(), this.focusable = jQuery(), element !== this && (jQuery.data(element, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(event1) {
                    event1.target === element && this.destroy();
                }
            }), this.document = jQuery(element.style ? element.ownerDocument : element.document || element), this.window = jQuery(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init();
        },
        _getCreateOptions: jQuery.noop,
        _getCreateEventData: jQuery.noop,
        _create: jQuery.noop,
        _init: jQuery.noop,
        destroy: function() {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(jQuery.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus");
        },
        _destroy: jQuery.noop,
        widget: function() {
            return this.element;
        },
        option: function(key, value) {
            var parts, curOption, i, options = key;
            if (0 == arguments.length) return jQuery.widget.extend({}, this.options);
            if ("string" == typeof key) {
                if (options = {}, key = (parts = key.split(".")).shift(), parts.length) {
                    for(i = 0, curOption = options[key] = jQuery.widget.extend({}, this.options[key]); i < parts.length - 1; i++)curOption[parts[i]] = curOption[parts[i]] || {}, curOption = curOption[parts[i]];
                    if (key = parts.pop(), undefined2 === value) return curOption[key] === undefined2 ? null : curOption[key];
                    curOption[key] = value;
                } else {
                    if (undefined2 === value) return this.options[key] === undefined2 ? null : this.options[key];
                    options[key] = value;
                }
            }
            return this._setOptions(options), this;
        },
        _setOptions: function(options) {
            var key;
            for(key in options)this._setOption(key, options[key]);
            return this;
        },
        _setOption: function(key, value) {
            return this.options[key] = value, "disabled" === key && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!value), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this;
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            });
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            });
        },
        _on: function(suppressDisabledCheck, element, handlers) {
            var delegateElement, instance = this;
            "boolean" != typeof suppressDisabledCheck && (handlers = element, element = suppressDisabledCheck, suppressDisabledCheck = !1), handlers ? (element = delegateElement = jQuery(element), this.bindings = this.bindings.add(element)) : (handlers = element, element = this.element, delegateElement = this.widget()), jQuery.each(handlers, function(event1, handler) {
                function handlerProxy() {
                    if (!(!suppressDisabledCheck && (!0 === instance.options.disabled || jQuery(this).hasClass("ui-state-disabled")))) return ("string" == typeof handler ? instance[handler] : handler).apply(instance, arguments);
                }
                "string" != typeof handler && (handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || jQuery.guid++);
                var match = event1.match(/^(\w+)\s*(.*)$/), eventName = match[1] + instance.eventNamespace, selector = match[2];
                selector ? delegateElement.delegate(selector, eventName, handlerProxy) : element.bind(eventName, handlerProxy);
            });
        },
        _off: function(element, eventName) {
            eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, element.unbind(eventName).undelegate(eventName);
        },
        _delay: function(handler, delay) {
            var instance = this;
            return setTimeout(function() {
                return ("string" == typeof handler ? instance[handler] : handler).apply(instance, arguments);
            }, delay || 0);
        },
        _hoverable: function(element) {
            this.hoverable = this.hoverable.add(element), this._on(element, {
                mouseenter: function(event1) {
                    jQuery(event1.currentTarget).addClass("ui-state-hover");
                },
                mouseleave: function(event1) {
                    jQuery(event1.currentTarget).removeClass("ui-state-hover");
                }
            });
        },
        _focusable: function(element) {
            this.focusable = this.focusable.add(element), this._on(element, {
                focusin: function(event1) {
                    jQuery(event1.currentTarget).addClass("ui-state-focus");
                },
                focusout: function(event1) {
                    jQuery(event1.currentTarget).removeClass("ui-state-focus");
                }
            });
        },
        _trigger: function(type, event1, data) {
            var prop, orig, callback = this.options[type];
            if (data = data || {}, (event1 = jQuery.Event(event1)).type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase(), event1.target = this.element[0], orig = event1.originalEvent) for(prop in orig)prop in event1 || (event1[prop] = orig[prop]);
            return this.element.trigger(event1, data), !(jQuery.isFunction(callback) && !1 === callback.apply(this.element[0], [
                event1
            ].concat(data)) || event1.isDefaultPrevented());
        }
    }, jQuery.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(method, defaultEffect) {
        jQuery.Widget.prototype["_" + method] = function(element, options, callback) {
            "string" == typeof options && (options = {
                effect: options
            });
            var hasOptions, effectName = options ? !0 === options || "number" == typeof options ? defaultEffect : options.effect || defaultEffect : method;
            "number" == typeof (options = options || {}) && (options = {
                duration: options
            }), hasOptions = !jQuery.isEmptyObject(options), options.complete = callback, options.delay && element.delay(options.delay), hasOptions && jQuery.effects && jQuery.effects.effect[effectName] ? element[method](options) : effectName !== method && element[effectName] ? element[effectName](options.duration, options.easing, callback) : element.queue(function(next) {
                jQuery(this)[method](), callback && callback.call(element[0]), next();
            });
        };
    }), rcapitals = /[A-Z]/g, replaceFunction = function(c) {
        return "-" + c.toLowerCase();
    }, jQuery.extend(jQuery.Widget.prototype, {
        _getCreateOptions: function() {
            var option, value, elem = this.element[0], options = {};
            if (!jQuery.mobile.getAttribute(elem, "defaults")) for(option in this.options)null != (value = jQuery.mobile.getAttribute(elem, option.replace(rcapitals, replaceFunction))) && (options[option] = value);
            return options;
        }
    }), jQuery.mobile.widget = jQuery.Widget, function($) {
        var loaderClass = "ui-loader", $html = $("html");
        $.widget("mobile.loader", {
            options: {
                theme: "a",
                textVisible: !1,
                html: "",
                text: "loading"
            },
            defaultHtml: "<div class='" + loaderClass + "'><span class='ui-icon-loading'></span><h1></h1></div>",
            fakeFixLoader: function() {
                var activeBtn = $("." + $.mobile.activeBtnClass).first();
                this.element.css({
                    top: $.support.scrollTop && this.window.scrollTop() + this.window.height() / 2 || activeBtn.length && activeBtn.offset().top || 100
                });
            },
            checkLoaderPosition: function() {
                var offset = this.element.offset(), scrollTop = this.window.scrollTop(), screenHeight = $.mobile.getScreenHeight();
                (offset.top < scrollTop || offset.top - scrollTop > screenHeight) && (this.element.addClass("ui-loader-fakefix"), this.fakeFixLoader(), this.window.unbind("scroll", this.checkLoaderPosition).bind("scroll", $.proxy(this.fakeFixLoader, this)));
            },
            resetHtml: function() {
                this.element.html($(this.defaultHtml).html());
            },
            show: function(theme, msgText, textonly) {
                var textVisible, message, loadSettings;
                this.resetHtml(), "object" === $.type(theme) ? theme = (loadSettings = $.extend({}, this.options, theme)).theme : (loadSettings = this.options, theme = theme || loadSettings.theme), message = msgText || (!1 === loadSettings.text ? "" : loadSettings.text), $html.addClass("ui-loading"), textVisible = loadSettings.textVisible, this.element.attr("class", loaderClass + " ui-corner-all ui-body-" + theme + " ui-loader-" + (textVisible || msgText || theme.text ? "verbose" : "default") + (loadSettings.textonly || textonly ? " ui-loader-textonly" : "")), loadSettings.html ? this.element.html(loadSettings.html) : this.element.find("h1").text(message), this.element.appendTo($.mobile.pageContainer), this.checkLoaderPosition(), this.window.bind("scroll", $.proxy(this.checkLoaderPosition, this));
            },
            hide: function() {
                $html.removeClass("ui-loading"), this.options.text && this.element.removeClass("ui-loader-fakefix"), $.mobile.window.unbind("scroll", this.fakeFixLoader), $.mobile.window.unbind("scroll", this.checkLoaderPosition);
            }
        });
    }(jQuery, this), function($, window, undefined) {
        var fake_onhashchange, str_hashchange = "hashchange", special = $.event.special, doc_mode = document1.documentMode, supports_onhashchange = "on" + str_hashchange in window && (void 0 === doc_mode || doc_mode > 7);
        function get_fragment(url) {
            return "#" + (url = url || location.href).replace(/^[^#]*#?(.*)$/, "$1");
        }
        $.fn[str_hashchange] = function(fn) {
            return fn ? this.bind(str_hashchange, fn) : this.trigger(str_hashchange);
        }, $.fn[str_hashchange].delay = 50, special[str_hashchange] = $.extend(special[str_hashchange], {
            setup: function() {
                if (supports_onhashchange) return !1;
                $(fake_onhashchange.start);
            },
            teardown: function() {
                if (supports_onhashchange) return !1;
                $(fake_onhashchange.stop);
            }
        }), fake_onhashchange = function() {
            var iframe, iframe_src, timeout_id, self = {}, last_hash = get_fragment(), fn_retval = function(val) {
                return val;
            }, history_set = fn_retval, history_get = fn_retval;
            function poll() {
                var hash = get_fragment(), history_hash = history_get(last_hash);
                hash !== last_hash ? (history_set(last_hash = hash, history_hash), $(window).trigger(str_hashchange)) : history_hash !== last_hash && (location.href = location.href.replace(/#.*/, "") + history_hash), timeout_id = setTimeout(poll, $.fn[str_hashchange].delay);
            }
            return self.start = function() {
                timeout_id || poll();
            }, self.stop = function() {
                timeout_id && clearTimeout(timeout_id), timeout_id = void 0;
            }, !window.attachEvent || window.addEventListener || supports_onhashchange || (self.start = function() {
                iframe || (iframe_src = (iframe_src = $.fn[str_hashchange].src) && iframe_src + get_fragment(), iframe = $('<iframe tabindex="-1" title="empty"/>').hide().one("load", function() {
                    iframe_src || history_set(get_fragment()), poll();
                }).attr("src", iframe_src || "javascript:0").insertAfter("body")[0].contentWindow, document1.onpropertychange = function() {
                    try {
                        "title" === event.propertyName && (iframe.document.title = document1.title);
                    } catch (e) {}
                });
            }, self.stop = fn_retval, history_get = function() {
                return get_fragment(iframe.location.href);
            }, history_set = function(hash, history_hash) {
                var iframe_doc = iframe.document, domain = $.fn[str_hashchange].domain;
                hash !== history_hash && (iframe_doc.title = document1.title, iframe_doc.open(), domain && iframe_doc.write('<script>document.domain="' + domain + '"</script>'), iframe_doc.close(), iframe.location.hash = hash);
            }), self;
        }();
    }(jQuery, this), window.matchMedia = window.matchMedia || (refNode = (docElem = document1.documentElement).firstElementChild || docElem.firstChild, fakeBody = document1.createElement("body"), (div = document1.createElement("div")).id = "mq-test-1", div.style.cssText = "position:absolute;top:-100em", fakeBody.style.background = "none", fakeBody.appendChild(div), function(q) {
        return div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>', docElem.insertBefore(fakeBody, refNode), bool = 42 === div.offsetWidth, docElem.removeChild(fakeBody), {
            matches: bool,
            media: q
        };
    }), jQuery.mobile.media = function(q) {
        return window.matchMedia(q).matches;
    }, support = {
        touch: "ontouchend" in document1
    }, jQuery.mobile.support = jQuery.mobile.support || {}, jQuery.extend(jQuery.support, support), jQuery.extend(jQuery.mobile.support, support), function($, undefined) {
        $.extend($.support, {
            orientation: "orientation" in window && "onorientationchange" in window
        });
    }(jQuery), function($, undefined) {
        function propExists(prop) {
            var v, uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1), props = (prop + " " + vendors.join(uc_prop + " ") + uc_prop).split(" ");
            for(v in props)if (void 0 !== fbCSS[props[v]]) return !0;
        }
        var ua, platform, wkmatch, wkversion, ffmatch, ffversion, operammobilematch, omversion, rebase, fauxBase, base, fauxEle, href, supports, element, documentElement, getComputedStyle, ua1, nokiaLTE7_3, fakeBody = $("<body>").prependTo("html"), fbCSS = fakeBody[0].style, vendors = [
            "Webkit",
            "Moz",
            "O"
        ], webos = "palmGetResource" in window, operamini = window.operamini && "[object OperaMini]" === ({}).toString.call(window.operamini), bb = window.blackberry && !propExists("-webkit-transform");
        $.extend($.mobile, {
            browser: {}
        }), $.mobile.browser.oldIE = function() {
            var v = 3, div = document1.createElement("div"), a = div.all || [];
            do div.innerHTML = "<!--[if gt IE " + ++v + "]><br><![endif]-->";
            while (a[0])
            return v > 4 ? v : !v;
        }(), $.extend($.support, {
            pushState: "pushState" in history && "replaceState" in history && !(window.navigator.userAgent.indexOf("Firefox") >= 0 && window.top !== window) && -1 === window.navigator.userAgent.search(/CriOS/),
            mediaquery: $.mobile.media("only all"),
            cssPseudoElement: !!propExists("content"),
            touchOverflow: !!propExists("overflowScrolling"),
            cssTransform3d: function() {
                var el, transforms, t, mqProp = "transform-3d", ret = $.mobile.media("(-" + vendors.join("-" + mqProp + "),(-") + "-" + mqProp + "),(" + mqProp + ")");
                if (ret) return !!ret;
                for(t in el = document1.createElement("div"), transforms = {
                    MozTransform: "-moz-transform",
                    transform: "transform"
                }, fakeBody.append(el), transforms)void 0 !== el.style[t] && (el.style[t] = "translate3d( 100px, 1px, 1px )", ret = window.getComputedStyle(el).getPropertyValue(transforms[t]));
                return !!ret && "none" !== ret;
            }(),
            boxShadow: !!propExists("boxShadow") && !bb,
            fixedPosition: (ua = navigator.userAgent, platform = navigator.platform, wkversion = !!(wkmatch = ua.match(/AppleWebKit\/([0-9]+)/)) && wkmatch[1], ffversion = !!(ffmatch = ua.match(/Fennec\/([0-9]+)/)) && ffmatch[1], omversion = !!(operammobilematch = ua.match(/Opera Mobi\/([0-9]+)/)) && operammobilematch[1], !((platform.indexOf("iPhone") > -1 || platform.indexOf("iPad") > -1 || platform.indexOf("iPod") > -1) && wkversion && wkversion < 534 || window.operamini && "[object OperaMini]" === ({}).toString.call(window.operamini) || operammobilematch && omversion < 7458 || ua.indexOf("Android") > -1 && wkversion && wkversion < 533 || ffversion && ffversion < 6 || "palmGetResource" in window && wkversion && wkversion < 534 || ua.indexOf("MeeGo") > -1 && ua.indexOf("NokiaBrowser/8.5.0") > -1)),
            scrollTop: ("pageXOffset" in window || "scrollTop" in document1.documentElement || "scrollTop" in fakeBody[0]) && !webos && !operamini,
            dynamicBaseTag: (fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/", base = $("head base"), fauxEle = null, href = "", base.length ? href = base.attr("href") : base = fauxEle = $("<base>", {
                href: fauxBase
            }).appendTo("head"), rebase = $("<a href='testurl' />").prependTo(fakeBody)[0].href, base[0].href = href || location.pathname, fauxEle && fauxEle.remove(), 0 === rebase.indexOf(fauxBase)),
            cssPointerEvents: (element = document1.createElement("x"), documentElement = document1.documentElement, getComputedStyle = window.getComputedStyle, "pointerEvents" in element.style && (element.style.pointerEvents = "auto", element.style.pointerEvents = "x", documentElement.appendChild(element), supports = getComputedStyle && "auto" === getComputedStyle(element, "").pointerEvents, documentElement.removeChild(element), !!supports)),
            boundingRect: void 0 !== document1.createElement("div").getBoundingClientRect,
            inlineSVG: function() {
                var svg = !!window.document.createElementNS && !!window.document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect && !(window.opera && -1 === navigator.userAgent.indexOf("Chrome")), support = function(data) {
                    data && svg || $("html").addClass("ui-nosvg");
                }, img = new window.Image();
                img.onerror = function() {
                    support(!1);
                }, img.onload = function() {
                    support(1 === img.width && 1 === img.height);
                }, img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            }
        }), fakeBody.remove(), nokiaLTE7_3 = (ua1 = window.navigator.userAgent).indexOf("Nokia") > -1 && (ua1.indexOf("Symbian/3") > -1 || ua1.indexOf("Series60/5") > -1) && ua1.indexOf("AppleWebKit") > -1 && ua1.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/), $.mobile.gradeA = function() {
            return ($.support.mediaquery && $.support.cssPseudoElement || $.mobile.browser.oldIE && $.mobile.browser.oldIE >= 8) && ($.support.boundingRect || null !== $.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/));
        }, $.mobile.ajaxBlacklist = window.blackberry && !window.WebKitPoint || operamini || nokiaLTE7_3, nokiaLTE7_3 && $(function() {
            $("head link[rel='stylesheet']").attr("rel", "alternate stylesheet").attr("rel", "stylesheet");
        }), $.support.boxShadow || $("html").addClass("ui-noboxshadow");
    }(jQuery), $win = jQuery.mobile.window, dummyFnToInitNavigate = function() {}, jQuery.event.special.beforenavigate = {
        setup: function() {
            $win.on("navigate", dummyFnToInitNavigate);
        },
        teardown: function() {
            $win.off("navigate", dummyFnToInitNavigate);
        }
    }, jQuery.event.special.navigate = self = {
        bound: !1,
        pushStateEnabled: !0,
        originalEventName: void 0,
        isPushStateEnabled: function() {
            return jQuery.support.pushState && !0 === jQuery.mobile.pushStateEnabled && this.isHashChangeEnabled();
        },
        isHashChangeEnabled: function() {
            return !0 === jQuery.mobile.hashListeningEnabled;
        },
        popstate: function(event1) {
            var newEvent = new jQuery.Event("navigate"), beforeNavigate = new jQuery.Event("beforenavigate"), state = event1.originalEvent.state || {};
            beforeNavigate.originalEvent = event1, $win.trigger(beforeNavigate), !beforeNavigate.isDefaultPrevented() && (event1.historyState && jQuery.extend(state, event1.historyState), newEvent.originalEvent = event1, setTimeout(function() {
                $win.trigger(newEvent, {
                    state: state
                });
            }, 0));
        },
        hashchange: function(event1) {
            var newEvent = new jQuery.Event("navigate"), beforeNavigate = new jQuery.Event("beforenavigate");
            beforeNavigate.originalEvent = event1, $win.trigger(beforeNavigate), !beforeNavigate.isDefaultPrevented() && (newEvent.originalEvent = event1, $win.trigger(newEvent, {
                state: event1.hashchangeState || {}
            }));
        },
        setup: function() {
            !self.bound && (self.bound = !0, self.isPushStateEnabled() ? (self.originalEventName = "popstate", $win.bind("popstate.navigate", self.popstate)) : self.isHashChangeEnabled() && (self.originalEventName = "hashchange", $win.bind("hashchange.navigate", self.hashchange)));
        }
    }, dialogHashKey = "&ui-state=dialog", jQuery.mobile.path = path = {
        uiStateKey: "&ui-state",
        urlParseRE: /^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,
        getLocation: function(url) {
            var uri = url ? this.parseUrl(url) : location, hash = this.parseUrl(url || location.href).hash;
            return hash = "#" === hash ? "" : hash, uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash;
        },
        getDocumentUrl: function(asParsedObject) {
            return asParsedObject ? jQuery.extend({}, path.documentUrl) : path.documentUrl.href;
        },
        parseLocation: function() {
            return this.parseUrl(this.getLocation());
        },
        parseUrl: function(url) {
            if ("object" === jQuery.type(url)) return url;
            var matches = path.urlParseRE.exec(url || "") || [];
            return {
                href: matches[0] || "",
                hrefNoHash: matches[1] || "",
                hrefNoSearch: matches[2] || "",
                domain: matches[3] || "",
                protocol: matches[4] || "",
                doubleSlash: matches[5] || "",
                authority: matches[6] || "",
                username: matches[8] || "",
                password: matches[9] || "",
                host: matches[10] || "",
                hostname: matches[11] || "",
                port: matches[12] || "",
                pathname: matches[13] || "",
                directory: matches[14] || "",
                filename: matches[15] || "",
                search: matches[16] || "",
                hash: matches[17] || ""
            };
        },
        makePathAbsolute: function(relPath, absPath) {
            var absStack, relStack, i, d;
            if (relPath && "/" === relPath.charAt(0)) return relPath;
            for(i = 0, relPath = relPath || "", absStack = (absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "") ? absPath.split("/") : [], relStack = relPath.split("/"); i < relStack.length; i++)switch(d = relStack[i]){
                case ".":
                    break;
                case "..":
                    absStack.length && absStack.pop();
                    break;
                default:
                    absStack.push(d);
            }
            return "/" + absStack.join("/");
        },
        isSameDomain: function(absUrl1, absUrl2) {
            return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
        },
        isRelativeUrl: function(url) {
            return "" === path.parseUrl(url).protocol;
        },
        isAbsoluteUrl: function(url) {
            return "" !== path.parseUrl(url).protocol;
        },
        makeUrlAbsolute: function(relUrl, absUrl) {
            if (!path.isRelativeUrl(relUrl)) return relUrl;
            void 0 === absUrl && (absUrl = this.documentBase);
            var relObj = path.parseUrl(relUrl), absObj = path.parseUrl(absUrl), protocol = relObj.protocol || absObj.protocol, doubleSlash = relObj.protocol ? relObj.doubleSlash : relObj.doubleSlash || absObj.doubleSlash, authority = relObj.authority || absObj.authority, hasPath = "" !== relObj.pathname;
            return protocol + doubleSlash + authority + path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname) + (relObj.search || !hasPath && absObj.search || "") + relObj.hash;
        },
        addSearchParams: function(url, params) {
            var u = path.parseUrl(url), p = "object" == typeof params ? jQuery.param(params) : params, s = u.search || "?";
            return u.hrefNoSearch + s + ("?" !== s.charAt(s.length - 1) ? "&" : "") + p + (u.hash || "");
        },
        convertUrlToDataUrl: function(absUrl) {
            var u = path.parseUrl(absUrl);
            return path.isEmbeddedPage(u) ? u.hash.split(dialogHashKey)[0].replace(/^#/, "").replace(/\?.*$/, "") : path.isSameDomain(u, this.documentBase) ? u.hrefNoHash.replace(this.documentBase.domain, "").split(dialogHashKey)[0] : window.decodeURIComponent(absUrl);
        },
        get: function(newPath) {
            return undefined3 === newPath && (newPath = path.parseLocation().hash), path.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, "");
        },
        set: function(path) {
            location.hash = path;
        },
        isPath: function(url) {
            return /\//.test(url);
        },
        clean: function(url) {
            return url.replace(this.documentBase.domain, "");
        },
        stripHash: function(url) {
            return url.replace(/^#/, "");
        },
        stripQueryParams: function(url) {
            return url.replace(/\?.*$/, "");
        },
        cleanHash: function(hash) {
            return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
        },
        isHashValid: function(hash) {
            return /^#[^#]+$/.test(hash);
        },
        isExternal: function(url) {
            var u = path.parseUrl(url);
            return !!u.protocol && u.domain !== this.documentUrl.domain;
        },
        hasProtocol: function(url) {
            return /^(:?\w+:)/.test(url);
        },
        isEmbeddedPage: function(url) {
            var u = path.parseUrl(url);
            return "" !== u.protocol ? !this.isPath(u.hash) && u.hash && (u.hrefNoHash === this.documentUrl.hrefNoHash || this.documentBaseDiffers && u.hrefNoHash === this.documentBase.hrefNoHash) : /^#/.test(u.href);
        },
        squash: function(url, resolutionUrl) {
            var href, cleanedUrl, search, stateIndex, isPath = this.isPath(url), uri = this.parseUrl(url), preservedHash = uri.hash, uiState = "";
            return resolutionUrl = resolutionUrl || (path.isPath(url) ? path.getLocation() : path.getDocumentUrl()), cleanedUrl = isPath ? path.stripHash(url) : url, (stateIndex = (cleanedUrl = path.isPath(uri.hash) ? path.stripHash(uri.hash) : cleanedUrl).indexOf(this.uiStateKey)) > -1 && (uiState = cleanedUrl.slice(stateIndex), cleanedUrl = cleanedUrl.slice(0, stateIndex)), href = path.makeUrlAbsolute(cleanedUrl, resolutionUrl), search = this.parseUrl(href).search, isPath ? ((path.isPath(preservedHash) || 0 === preservedHash.replace("#", "").indexOf(this.uiStateKey)) && (preservedHash = ""), uiState && -1 === preservedHash.indexOf(this.uiStateKey) && (preservedHash += uiState), -1 === preservedHash.indexOf("#") && "" !== preservedHash && (preservedHash = "#" + preservedHash), href = (href = path.parseUrl(href)).protocol + "//" + href.host + href.pathname + search + preservedHash) : href += href.indexOf("#") > -1 ? uiState : "#" + uiState, href;
        },
        isPreservableHash: function(hash) {
            return 0 === hash.replace("#", "").indexOf(this.uiStateKey);
        },
        hashToSelector: function(hash) {
            var hasHash = "#" === hash.substring(0, 1);
            return hasHash && (hash = hash.substring(1)), (hasHash ? "#" : "") + hash.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, "\\$1");
        },
        getFilePath: function(path) {
            var splitkey = "&" + jQuery.mobile.subPageUrlKey;
            return path && path.split(splitkey)[0].split(dialogHashKey)[0];
        },
        isFirstPageUrl: function(url) {
            var u = path.parseUrl(path.makeUrlAbsolute(url, this.documentBase)), samePath = u.hrefNoHash === this.documentUrl.hrefNoHash || this.documentBaseDiffers && u.hrefNoHash === this.documentBase.hrefNoHash, fp = jQuery.mobile.firstPage, fpId = fp && fp[0] ? fp[0].id : undefined3;
            return samePath && (!u.hash || "#" === u.hash || fpId && u.hash.replace(/^#/, "") === fpId);
        },
        isPermittedCrossDomainRequest: function(docUrl, reqUrl) {
            return jQuery.mobile.allowCrossDomainPages && ("file:" === docUrl.protocol || "content:" === docUrl.protocol) && -1 !== reqUrl.search(/^https?:/);
        }
    }, path.documentUrl = path.parseLocation(), $base = jQuery("head").find("base"), path.documentBase = $base.length ? path.parseUrl(path.makeUrlAbsolute($base.attr("href"), path.documentUrl.href)) : path.documentUrl, path.documentBaseDiffers = path.documentUrl.hrefNoHash !== path.documentBase.hrefNoHash, path.getDocumentBase = function(asParsedObject) {
        return asParsedObject ? jQuery.extend({}, path.documentBase) : path.documentBase.href;
    }, jQuery.extend(jQuery.mobile, {
        getDocumentUrl: path.getDocumentUrl,
        getDocumentBase: path.getDocumentBase
    }), jQuery.mobile.History = function(stack, index) {
        this.stack = stack || [], this.activeIndex = index || 0;
    }, jQuery.extend(jQuery.mobile.History.prototype, {
        getActive: function() {
            return this.stack[this.activeIndex];
        },
        getLast: function() {
            return this.stack[this.previousIndex];
        },
        getNext: function() {
            return this.stack[this.activeIndex + 1];
        },
        getPrev: function() {
            return this.stack[this.activeIndex - 1];
        },
        add: function(url, data) {
            data = data || {}, this.getNext() && this.clearForward(), data.hash && -1 === data.hash.indexOf("#") && (data.hash = "#" + data.hash), data.url = url, this.stack.push(data), this.activeIndex = this.stack.length - 1;
        },
        clearForward: function() {
            this.stack = this.stack.slice(0, this.activeIndex + 1);
        },
        find: function(url, stack, earlyReturn) {
            var entry, i, index, length = (stack = stack || this.stack).length;
            for(i = 0; i < length && (entry = stack[i], decodeURIComponent(url) !== decodeURIComponent(entry.url) && decodeURIComponent(url) !== decodeURIComponent(entry.hash) || (index = i, !earlyReturn)); i++);
            return index;
        },
        closest: function(url) {
            var closest, a = this.activeIndex;
            return void 0 === (closest = this.find(url, this.stack.slice(0, a))) && (closest = undefined4 === (closest = this.find(url, this.stack.slice(a), !0)) ? closest : closest + a), closest;
        },
        direct: function(opts) {
            var newActiveIndex = this.closest(opts.url), a = this.activeIndex;
            undefined4 !== newActiveIndex && (this.activeIndex = newActiveIndex, this.previousIndex = a), newActiveIndex < a ? (opts.present || opts.back || jQuery.noop)(this.getActive(), "back") : newActiveIndex > a ? (opts.present || opts.forward || jQuery.noop)(this.getActive(), "forward") : undefined4 === newActiveIndex && opts.missing && opts.missing(this.getActive());
        }
    }), path1 = jQuery.mobile.path, initialHref = location.href, jQuery.mobile.Navigator = function(history1) {
        this.history = history1, this.ignoreInitialHashChange = !0, jQuery.mobile.window.bind({
            "popstate.history": jQuery.proxy(this.popstate, this),
            "hashchange.history": jQuery.proxy(this.hashchange, this)
        });
    }, jQuery.extend(jQuery.mobile.Navigator.prototype, {
        squash: function(url, data) {
            var state, href, hash = path1.isPath(url) ? path1.stripHash(url) : url;
            return href = path1.squash(url), state = jQuery.extend({
                hash: hash,
                url: href
            }, data), window.history.replaceState(state, state.title || document1.title, href), state;
        },
        hash: function(url, href) {
            var parsed, loc, hash, resolved;
            return parsed = path1.parseUrl(url), (loc = path1.parseLocation()).pathname + loc.search === parsed.pathname + parsed.search ? parsed.hash ? parsed.hash : parsed.pathname + parsed.search : path1.isPath(url) ? (resolved = path1.parseUrl(href)).pathname + resolved.search + (path1.isPreservableHash(resolved.hash) ? resolved.hash.replace("#", "") : "") : url;
        },
        go: function(url, data, noEvents) {
            var state, href, hash, popstateEvent, isPopStateEvent = jQuery.event.special.navigate.isPushStateEnabled();
            href = path1.squash(url), hash = this.hash(url, href), noEvents && hash !== path1.stripHash(path1.parseLocation().hash) && (this.preventNextHashChange = noEvents), this.preventHashAssignPopState = !0, window.location.hash = hash, this.preventHashAssignPopState = !1, state = jQuery.extend({
                url: href,
                hash: hash,
                title: document1.title
            }, data), isPopStateEvent && ((popstateEvent = new jQuery.Event("popstate")).originalEvent = {
                type: "popstate",
                state: null
            }, this.squash(url, state), noEvents || (this.ignorePopState = !0, jQuery.mobile.window.trigger(popstateEvent))), this.history.add(state.url, state);
        },
        popstate: function(event1) {
            var hash, state;
            if (jQuery.event.special.navigate.isPushStateEnabled()) {
                if (this.preventHashAssignPopState) {
                    this.preventHashAssignPopState = !1, event1.stopImmediatePropagation();
                    return;
                }
                if (this.ignorePopState) {
                    this.ignorePopState = !1;
                    return;
                }
                if (!event1.originalEvent.state && 1 === this.history.stack.length && this.ignoreInitialHashChange && (this.ignoreInitialHashChange = !1, location.href === initialHref)) {
                    event1.preventDefault();
                    return;
                }
                if (hash = path1.parseLocation().hash, !event1.originalEvent.state && hash) {
                    state = this.squash(hash), this.history.add(state.url, state), event1.historyState = state;
                    return;
                }
                this.history.direct({
                    url: (event1.originalEvent.state || {}).url || hash,
                    present: function(historyEntry, direction) {
                        event1.historyState = jQuery.extend({}, historyEntry), event1.historyState.direction = direction;
                    }
                });
            }
        },
        hashchange: function(event1) {
            var history1, hash;
            if (!(!jQuery.event.special.navigate.isHashChangeEnabled() || jQuery.event.special.navigate.isPushStateEnabled())) {
                if (this.preventNextHashChange) {
                    this.preventNextHashChange = !1, event1.stopImmediatePropagation();
                    return;
                }
                history1 = this.history, hash = path1.parseLocation().hash, this.history.direct({
                    url: hash,
                    present: function(historyEntry, direction) {
                        event1.hashchangeState = jQuery.extend({}, historyEntry), event1.hashchangeState.direction = direction;
                    },
                    missing: function() {
                        history1.add(hash, {
                            hash: hash,
                            title: document1.title
                        });
                    }
                });
            }
        }
    }), function($, undefined) {
        $.mobile.navigate = function(url, data, noEvents) {
            $.mobile.navigate.navigator.go(url, data, noEvents);
        }, $.mobile.navigate.history = new $.mobile.History(), $.mobile.navigate.navigator = new $.mobile.Navigator($.mobile.navigate.history);
        var loc = $.mobile.path.parseLocation();
        $.mobile.navigate.history.add(loc.href, {
            hash: loc.hash
        });
    }(jQuery), props = {
        animation: {},
        transition: {}
    }, testElement = document1.createElement("a"), vendorPrefixes = [
        "",
        "webkit-",
        "moz-",
        "o-"
    ], jQuery.each([
        "animation",
        "transition"
    ], function(i, test) {
        var testName = 0 === i ? test + "-name" : test;
        jQuery.each(vendorPrefixes, function(j, prefix) {
            if (testElement.style[jQuery.camelCase(prefix + testName)] !== undefined5) return props[test].prefix = prefix, !1;
        }), props[test].duration = jQuery.camelCase(props[test].prefix + test + "-duration"), props[test].event = jQuery.camelCase(props[test].prefix + test + "-end"), "" === props[test].prefix && (props[test].event = props[test].event.toLowerCase());
    }), jQuery.support.cssTransitions = props.transition.prefix !== undefined5, jQuery.support.cssAnimations = props.animation.prefix !== undefined5, jQuery(testElement).remove(), jQuery.fn.animationComplete = function(callback, type, fallbackTime) {
        var timer, duration, that = this, animationType = type && "animation" !== type ? "transition" : "animation";
        return jQuery.support.cssTransitions && "transition" === animationType || jQuery.support.cssAnimations && "animation" === animationType ? (undefined5 === fallbackTime && (jQuery(this).context !== document1 && (duration = 3000 * parseFloat(jQuery(this).css(props[animationType].duration))), (0 === duration || undefined5 === duration || isNaN(duration)) && (duration = jQuery.fn.animationComplete.defaultDuration)), timer = setTimeout(function() {
            jQuery(that).off(props[animationType].event), callback.apply(that);
        }, duration), jQuery(this).one(props[animationType].event, function() {
            clearTimeout(timer), callback.call(this, arguments);
        })) : (setTimeout(jQuery.proxy(callback, this), 0), jQuery(this));
    }, jQuery.fn.animationComplete.defaultDuration = 1000, function($, window, document1, undefined) {
        var threshold, i, dataPropertyName = "virtualMouseBindings", touchTargetPropertyName = "virtualTouchID", virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "), touchEventProps = "clientX clientY pageX pageY screenX screenY".split(" "), mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [], mouseEventProps = $.event.props.concat(mouseHookProps), activeDocHandlers = {}, resetTimerID = 0, startX = 0, startY = 0, didScroll = !1, clickBlockList = [], blockMouseTriggers = !1, blockTouchTriggers = !1, eventCaptureSupported = "addEventListener" in document1, $document = $(document1), nextTouchID = 1, lastTouchID = 0;
        function getNativeEvent(event1) {
            for(; event1 && void 0 !== event1.originalEvent;)event1 = event1.originalEvent;
            return event1;
        }
        function getVirtualBindingFlags(element) {
            for(var b, k, flags = {}; element;){
                for(k in b = $.data(element, dataPropertyName))b[k] && (flags[k] = flags.hasVirtualBinding = !0);
                element = element.parentNode;
            }
            return flags;
        }
        $.vmouse = {
            moveDistanceThreshold: 10,
            clickDistanceThreshold: 10,
            resetTimerDuration: 1500
        };
        function startResetTimer() {
            clearResetTimer(), resetTimerID = setTimeout(function() {
                resetTimerID = 0, lastTouchID = 0, clickBlockList.length = 0, blockMouseTriggers = !1, blockTouchTriggers = !0;
            }, $.vmouse.resetTimerDuration);
        }
        function clearResetTimer() {
            resetTimerID && (clearTimeout(resetTimerID), resetTimerID = 0);
        }
        function triggerVirtualEvent(eventType, event1, flags) {
            var ve;
            return (flags && flags[eventType] || !flags && function(element, eventType) {
                for(var b; element;){
                    if ((b = $.data(element, dataPropertyName)) && (!eventType || b[eventType])) return element;
                    element = element.parentNode;
                }
                return null;
            }(event1.target, eventType)) && (ve = function(event1, eventType) {
                var oe, props, ne, prop, ct, touch, i, j, len, t = event1.type;
                if ((event1 = $.Event(event1)).type = eventType, oe = event1.originalEvent, props = $.event.props, t.search(/^(mouse|click)/) > -1 && (props = mouseEventProps), oe) for(i = props.length; i;)event1[prop = props[--i]] = oe[prop];
                if (t.search(/mouse(down|up)|click/) > -1 && !event1.which && (event1.which = 1), -1 !== t.search(/^touch/) && (t = (ne = getNativeEvent(oe)).touches, ct = ne.changedTouches, touch = t && t.length ? t[0] : ct && ct.length ? ct[0] : void 0)) for(j = 0, len = touchEventProps.length; j < len; j++)event1[prop = touchEventProps[j]] = touch[prop];
                return event1;
            }(event1, eventType), $(event1.target).trigger(ve)), ve;
        }
        function mouseEventCallback(event1) {
            var ve, touchID = $.data(event1.target, touchTargetPropertyName);
            !blockMouseTriggers && (!lastTouchID || lastTouchID !== touchID) && (ve = triggerVirtualEvent("v" + event1.type, event1)) && (ve.isDefaultPrevented() && event1.preventDefault(), ve.isPropagationStopped() && event1.stopPropagation(), ve.isImmediatePropagationStopped() && event1.stopImmediatePropagation());
        }
        function handleTouchStart(event1) {
            var target, flags, t, touches = getNativeEvent(event1).touches;
            touches && 1 === touches.length && (flags = getVirtualBindingFlags(target = event1.target)).hasVirtualBinding && (lastTouchID = nextTouchID++, $.data(target, touchTargetPropertyName, lastTouchID), clearResetTimer(), blockTouchTriggers = !1, didScroll = !1, startX = (t = getNativeEvent(event1).touches[0]).pageX, startY = t.pageY, triggerVirtualEvent("vmouseover", event1, flags), triggerVirtualEvent("vmousedown", event1, flags));
        }
        function handleScroll(event1) {
            !blockTouchTriggers && (didScroll || triggerVirtualEvent("vmousecancel", event1, getVirtualBindingFlags(event1.target)), didScroll = !0, startResetTimer());
        }
        function handleTouchMove(event1) {
            if (!blockTouchTriggers) {
                var t = getNativeEvent(event1).touches[0], didCancel = didScroll, moveThreshold = $.vmouse.moveDistanceThreshold, flags = getVirtualBindingFlags(event1.target);
                (didScroll = didScroll || Math.abs(t.pageX - startX) > moveThreshold || Math.abs(t.pageY - startY) > moveThreshold) && !didCancel && triggerVirtualEvent("vmousecancel", event1, flags), triggerVirtualEvent("vmousemove", event1, flags), startResetTimer();
            }
        }
        function handleTouchEnd(event1) {
            if (!blockTouchTriggers) {
                blockTouchTriggers = !0;
                var ve, t, flags = getVirtualBindingFlags(event1.target);
                triggerVirtualEvent("vmouseup", event1, flags), !didScroll && (ve = triggerVirtualEvent("vclick", event1, flags)) && ve.isDefaultPrevented() && (t = getNativeEvent(event1).changedTouches[0], clickBlockList.push({
                    touchID: lastTouchID,
                    x: t.clientX,
                    y: t.clientY
                }), blockMouseTriggers = !0), triggerVirtualEvent("vmouseout", event1, flags), didScroll = !1, startResetTimer();
            }
        }
        function hasVirtualBindings(ele) {
            var k, bindings = $.data(ele, dataPropertyName);
            if (bindings) {
                for(k in bindings)if (bindings[k]) return !0;
            }
            return !1;
        }
        function dummyMouseHandler() {}
        for(i = 0; i < virtualEventNames.length; i++)$.event.special[virtualEventNames[i]] = function(eventType) {
            var realType = eventType.substr(1);
            return {
                setup: function() {
                    hasVirtualBindings(this) || $.data(this, dataPropertyName, {}), $.data(this, dataPropertyName)[eventType] = !0, activeDocHandlers[eventType] = (activeDocHandlers[eventType] || 0) + 1, 1 === activeDocHandlers[eventType] && $document.bind(realType, mouseEventCallback), $(this).bind(realType, dummyMouseHandler), eventCaptureSupported && (activeDocHandlers.touchstart = (activeDocHandlers.touchstart || 0) + 1, 1 === activeDocHandlers.touchstart && $document.bind("touchstart", handleTouchStart).bind("touchend", handleTouchEnd).bind("touchmove", handleTouchMove).bind("scroll", handleScroll));
                },
                teardown: function() {
                    --activeDocHandlers[eventType], activeDocHandlers[eventType] || $document.unbind(realType, mouseEventCallback), eventCaptureSupported && (--activeDocHandlers.touchstart, activeDocHandlers.touchstart || $document.unbind("touchstart", handleTouchStart).unbind("touchmove", handleTouchMove).unbind("touchend", handleTouchEnd).unbind("scroll", handleScroll));
                    var $this = $(this), bindings = $.data(this, dataPropertyName);
                    bindings && (bindings[eventType] = !1), $this.unbind(realType, dummyMouseHandler), hasVirtualBindings(this) || $this.removeData(dataPropertyName);
                }
            };
        }(virtualEventNames[i]);
        eventCaptureSupported && document1.addEventListener("click", function(e) {
            var x, y, ele, i, o, cnt = clickBlockList.length, target = e.target;
            if (cnt) for(x = e.clientX, y = e.clientY, threshold = $.vmouse.clickDistanceThreshold, ele = target; ele;){
                for(i = 0; i < cnt; i++)if (o = clickBlockList[i], ele === target && Math.abs(o.x - x) < threshold && Math.abs(o.y - y) < threshold || $.data(ele, touchTargetPropertyName) === o.touchID) {
                    e.preventDefault(), e.stopPropagation();
                    return;
                }
                ele = ele.parentNode;
            }
        }, !0);
    }(jQuery, 0, document1), function($, window, undefined) {
        var $document = $(document1), supportTouch = $.mobile.support.touch, scrollEvent = "touchmove scroll", touchStartEvent = supportTouch ? "touchstart" : "mousedown", touchStopEvent = supportTouch ? "touchend" : "mouseup", touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
        function triggerCustomEvent(obj, eventType, event1, bubble) {
            var originalType = event1.type;
            event1.type = eventType, bubble ? $.event.trigger(event1, void 0, obj) : $.event.dispatch.call(obj, event1), event1.type = originalType;
        }
        $.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "), function(i, name) {
            $.fn[name] = function(fn) {
                return fn ? this.bind(name, fn) : this.trigger(name);
            }, $.attrFn && ($.attrFn[name] = !0);
        }), $.event.special.scrollstart = {
            enabled: !0,
            setup: function() {
                var scrolling, timer, thisObject = this;
                function trigger(event1, state) {
                    triggerCustomEvent(thisObject, (scrolling = state) ? "scrollstart" : "scrollstop", event1);
                }
                $(thisObject).bind(scrollEvent, function(event1) {
                    $.event.special.scrollstart.enabled && (scrolling || trigger(event1, !0), clearTimeout(timer), timer = setTimeout(function() {
                        trigger(event1, !1);
                    }, 50));
                });
            },
            teardown: function() {
                $(this).unbind(scrollEvent);
            }
        }, $.event.special.tap = {
            tapholdThreshold: 750,
            emitTapOnTaphold: !0,
            setup: function() {
                var thisObject = this, $this = $(thisObject), isTaphold = !1;
                $this.bind("vmousedown", function(event1) {
                    if (isTaphold = !1, event1.which && 1 !== event1.which) return !1;
                    var timer, origTarget = event1.target;
                    function clearTapTimer() {
                        clearTimeout(timer);
                    }
                    function clearTapHandlers() {
                        clearTapTimer(), $this.unbind("vclick", clickHandler).unbind("vmouseup", clearTapTimer), $document.unbind("vmousecancel", clearTapHandlers);
                    }
                    function clickHandler(event1) {
                        clearTapHandlers(), isTaphold || origTarget !== event1.target ? isTaphold && event1.stopPropagation() : triggerCustomEvent(thisObject, "tap", event1);
                    }
                    $this.bind("vmouseup", clearTapTimer).bind("vclick", clickHandler), $document.bind("vmousecancel", clearTapHandlers), timer = setTimeout(function() {
                        $.event.special.tap.emitTapOnTaphold || (isTaphold = !0), triggerCustomEvent(thisObject, "taphold", $.Event("taphold", {
                            target: origTarget
                        }));
                    }, $.event.special.tap.tapholdThreshold);
                });
            },
            teardown: function() {
                $(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"), $document.unbind("vmousecancel");
            }
        }, $.event.special.swipe = {
            scrollSupressionThreshold: 30,
            durationThreshold: 1000,
            horizontalDistanceThreshold: 30,
            verticalDistanceThreshold: 30,
            getLocation: function(event1) {
                var winPageX = window.pageXOffset, winPageY = window.pageYOffset, x = event1.clientX, y = event1.clientY;
                return 0 === event1.pageY && Math.floor(y) > Math.floor(event1.pageY) || 0 === event1.pageX && Math.floor(x) > Math.floor(event1.pageX) ? (x -= winPageX, y -= winPageY) : (y < event1.pageY - winPageY || x < event1.pageX - winPageX) && (x = event1.pageX - winPageX, y = event1.pageY - winPageY), {
                    x: x,
                    y: y
                };
            },
            start: function(event1) {
                var data = event1.originalEvent.touches ? event1.originalEvent.touches[0] : event1, location1 = $.event.special.swipe.getLocation(data);
                return {
                    time: new Date().getTime(),
                    coords: [
                        location1.x,
                        location1.y
                    ],
                    origin: $(event1.target)
                };
            },
            stop: function(event1) {
                var data = event1.originalEvent.touches ? event1.originalEvent.touches[0] : event1, location1 = $.event.special.swipe.getLocation(data);
                return {
                    time: new Date().getTime(),
                    coords: [
                        location1.x,
                        location1.y
                    ]
                };
            },
            handleSwipe: function(start, stop, thisObject, origTarget) {
                if (stop.time - start.time < $.event.special.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.verticalDistanceThreshold) {
                    var direction = start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight";
                    return triggerCustomEvent(thisObject, "swipe", $.Event("swipe", {
                        target: origTarget,
                        swipestart: start,
                        swipestop: stop
                    }), !0), triggerCustomEvent(thisObject, direction, $.Event(direction, {
                        target: origTarget,
                        swipestart: start,
                        swipestop: stop
                    }), !0), !0;
                }
                return !1;
            },
            eventInProgress: !1,
            setup: function() {
                var events, thisObject = this, $this = $(thisObject), context = {};
                (events = $.data(this, "mobile-events")) || (events = {
                    length: 0
                }, $.data(this, "mobile-events", events)), events.length++, events.swipe = context, context.start = function(event1) {
                    if (!$.event.special.swipe.eventInProgress) {
                        $.event.special.swipe.eventInProgress = !0;
                        var stop, start = $.event.special.swipe.start(event1), origTarget = event1.target, emitted = !1;
                        context.move = function(event1) {
                            start && (stop = $.event.special.swipe.stop(event1), !emitted && (emitted = $.event.special.swipe.handleSwipe(start, stop, thisObject, origTarget)) && ($.event.special.swipe.eventInProgress = !1), Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.scrollSupressionThreshold && event1.preventDefault());
                        }, context.stop = function() {
                            emitted = !0, $.event.special.swipe.eventInProgress = !1, $document.off(touchMoveEvent, context.move), context.move = null;
                        }, $document.on(touchMoveEvent, context.move).one(touchStopEvent, context.stop);
                    }
                }, $this.on(touchStartEvent, context.start);
            },
            teardown: function() {
                var events, context;
                (events = $.data(this, "mobile-events")) && (context = events.swipe, delete events.swipe, events.length--, 0 === events.length && $.removeData(this, "mobile-events")), context && (context.start && $(this).off(touchStartEvent, context.start), context.move && $document.off(touchMoveEvent, context.move), context.stop && $document.off(touchStopEvent, context.stop));
            }
        }, $.each({
            scrollstop: "scrollstart",
            taphold: "tap",
            swipeleft: "swipe",
            swiperight: "swipe"
        }, function(event1, sourceEvent) {
            $.event.special[event1] = {
                setup: function() {
                    $(this).bind(sourceEvent, $.noop);
                },
                teardown: function() {
                    $(this).unbind(sourceEvent);
                }
            };
        });
    }(jQuery, this), jQuery.event.special.throttledresize = {
        setup: function() {
            jQuery(this).bind("resize", handler);
        },
        teardown: function() {
            jQuery(this).unbind("resize", handler);
        }
    }, handler = function() {
        (diff = (curr = new Date().getTime()) - lastCall) >= 250 ? (lastCall = curr, jQuery(this).trigger("throttledresize")) : (heldCall && clearTimeout(heldCall), heldCall = setTimeout(handler, 250 - diff));
    }, lastCall = 0, function($, window) {
        var get_orientation, last_orientation, initial_orientation_is_landscape, initial_orientation_is_default, ww, wh, win = $(window), event_name = "orientationchange", portrait_map = {
            0: !0,
            180: !0
        };
        function handler() {
            var orientation = get_orientation();
            orientation !== last_orientation && (last_orientation = orientation, win.trigger(event_name));
        }
        $.support.orientation && (ww = window.innerWidth || win.width(), initial_orientation_is_landscape = ww > (wh = window.innerHeight || win.height()) && ww - wh > 50, initial_orientation_is_default = portrait_map[window.orientation], (initial_orientation_is_landscape && initial_orientation_is_default || !initial_orientation_is_landscape && !initial_orientation_is_default) && (portrait_map = {
            "-90": !0,
            90: !0
        })), $.event.special.orientationchange = $.extend({}, $.event.special.orientationchange, {
            setup: function() {
                if ($.support.orientation && !$.event.special.orientationchange.disabled) return !1;
                last_orientation = get_orientation(), win.bind("throttledresize", handler);
            },
            teardown: function() {
                if ($.support.orientation && !$.event.special.orientationchange.disabled) return !1;
                win.unbind("throttledresize", handler);
            },
            add: function(handleObj) {
                var old_handler = handleObj.handler;
                handleObj.handler = function(event1) {
                    return event1.orientation = get_orientation(), old_handler.apply(this, arguments);
                };
            }
        }), $.event.special.orientationchange.orientation = get_orientation = function() {
            var isPortrait = !0, elem = document1.documentElement;
            return ($.support.orientation ? portrait_map[window.orientation] : elem && elem.clientWidth / elem.clientHeight < 1.1) ? "portrait" : "landscape";
        }, $.fn[event_name] = function(fn) {
            return fn ? this.bind(event_name, fn) : this.trigger(event_name);
        }, $.attrFn && ($.attrFn[event_name] = !0);
    }(jQuery, this), base = {
        element: (baseElement = jQuery("head").children("base")).length ? baseElement : jQuery("<base>", {
            href: jQuery.mobile.path.documentBase.hrefNoHash
        }).prependTo(jQuery("head")),
        linkSelector: "[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]",
        set: function(href) {
            jQuery.mobile.dynamicBaseEnabled && jQuery.support.dynamicBaseTag && base.element.attr("href", jQuery.mobile.path.makeUrlAbsolute(href, jQuery.mobile.path.documentBase));
        },
        rewrite: function(href, page) {
            var newPath = jQuery.mobile.path.get(href);
            page.find(base.linkSelector).each(function(i, link) {
                var thisAttr = jQuery(link).is("[href]") ? "href" : jQuery(link).is("[src]") ? "src" : "action", thisUrl = jQuery(link).attr(thisAttr);
                thisUrl = thisUrl.replace(location.protocol + "//" + location.host + location.pathname, ""), /^(\w+:|#|\/)/.test(thisUrl) || jQuery(link).attr(thisAttr, newPath + thisUrl);
            });
        },
        reset: function() {
            base.element.attr("href", jQuery.mobile.path.documentBase.hrefNoSearch);
        }
    }, jQuery.mobile.base = base, jQuery.mobile.widgets = {}, originalWidget = jQuery.widget, keepNativeFactoryDefault = jQuery.mobile.keepNative, jQuery.widget = (orig = jQuery.widget, function() {
        var constructor = orig.apply(this, arguments), name = constructor.prototype.widgetName;
        return constructor.initSelector = constructor.prototype.initSelector !== undefined6 ? constructor.prototype.initSelector : ":jqmData(role='" + name + "')", jQuery.mobile.widgets[name] = constructor, constructor;
    }), jQuery.extend(jQuery.widget, originalWidget), jQuery.mobile.document.on("create", function(event1) {
        jQuery(event1.target).enhanceWithin();
    }), jQuery.widget("mobile.page", {
        options: {
            theme: "a",
            domCache: !1,
            keepNativeDefault: jQuery.mobile.keepNative,
            contentTheme: null,
            enhanced: !1
        },
        _createWidget: function() {
            jQuery.Widget.prototype._createWidget.apply(this, arguments), this._trigger("init");
        },
        _create: function() {
            if (!1 === this._trigger("beforecreate")) return !1;
            this.options.enhanced || this._enhance(), this._on(this.element, {
                pagebeforehide: "removeContainerBackground",
                pagebeforeshow: "_handlePageBeforeShow"
            }), this.element.enhanceWithin(), "dialog" === jQuery.mobile.getAttribute(this.element[0], "role") && jQuery.mobile.dialog && this.element.dialog();
        },
        _enhance: function() {
            var attrPrefix = "data-" + jQuery.mobile.ns, self = this;
            this.options.role && this.element.attr("data-" + jQuery.mobile.ns + "role", this.options.role), this.element.attr("tabindex", "0").addClass("ui-page ui-page-theme-" + this.options.theme), this.element.find("[" + attrPrefix + "role='content']").each(function() {
                var $this = jQuery(this), theme = this.getAttribute(attrPrefix + "theme") || undefined6;
                self.options.contentTheme = theme || self.options.contentTheme || self.options.dialog && self.options.theme || "dialog" === self.element.jqmData("role") && self.options.theme, $this.addClass("ui-content"), self.options.contentTheme && $this.addClass("ui-body-" + self.options.contentTheme), $this.attr("role", "main").addClass("ui-content");
            });
        },
        bindRemove: function(callback) {
            var page = this.element;
            !page.data("mobile-page").options.domCache && page.is(":jqmData(external-page='true')") && page.bind("pagehide.remove", callback || function(e, data) {
                if (!data.samePage) {
                    var $this = jQuery(this), prEvent = new jQuery.Event("pageremove");
                    $this.trigger(prEvent), prEvent.isDefaultPrevented() || $this.removeWithDependents();
                }
            });
        },
        _setOptions: function(o) {
            o.theme !== undefined6 && this.element.removeClass("ui-page-theme-" + this.options.theme).addClass("ui-page-theme-" + o.theme), o.contentTheme !== undefined6 && this.element.find("[data-" + jQuery.mobile.ns + "='content']").removeClass("ui-body-" + this.options.contentTheme).addClass("ui-body-" + o.contentTheme);
        },
        _handlePageBeforeShow: function() {
            this.setContainerBackground();
        },
        removeContainerBackground: function() {
            this.element.closest(":mobile-pagecontainer").pagecontainer({
                theme: "none"
            });
        },
        setContainerBackground: function(theme) {
            this.element.parent().pagecontainer({
                theme: theme || this.options.theme
            });
        },
        keepNativeSelector: function() {
            var options = this.options, keepNative = jQuery.trim(options.keepNative || ""), globalValue = jQuery.trim(jQuery.mobile.keepNative), optionValue = jQuery.trim(options.keepNativeDefault), newDefault = keepNativeFactoryDefault === globalValue ? "" : globalValue, oldDefault = "" === newDefault ? optionValue : "";
            return (keepNative ? [
                keepNative
            ] : []).concat(newDefault ? [
                newDefault
            ] : []).concat(oldDefault ? [
                oldDefault
            ] : []).join(", ");
        }
    }), jQuery.widget("mobile.pagecontainer", {
        options: {
            theme: "a"
        },
        initSelector: !1,
        _create: function() {
            this.setLastScrollEnabled = !0, this._on(this.window, {
                navigate: "_disableRecordScroll",
                scrollstop: "_delayedRecordScroll"
            }), this._on(this.window, {
                navigate: "_filterNavigateEvents"
            }), this._on({
                pagechange: "_afterContentChange"
            }), this.window.one("navigate", jQuery.proxy(function() {
                this.setLastScrollEnabled = !0;
            }, this));
        },
        _setOptions: function(options) {
            options.theme !== undefined7 && "none" !== options.theme ? this.element.removeClass("ui-overlay-" + this.options.theme).addClass("ui-overlay-" + options.theme) : options.theme !== undefined7 && this.element.removeClass("ui-overlay-" + this.options.theme), this._super(options);
        },
        _disableRecordScroll: function() {
            this.setLastScrollEnabled = !1;
        },
        _enableRecordScroll: function() {
            this.setLastScrollEnabled = !0;
        },
        _afterContentChange: function() {
            this.setLastScrollEnabled = !0, this._off(this.window, "scrollstop"), this._on(this.window, {
                scrollstop: "_delayedRecordScroll"
            });
        },
        _recordScroll: function() {
            if (this.setLastScrollEnabled) {
                var currentScroll, minScroll, defaultScroll, active = this._getActiveHistory();
                active && (currentScroll = this._getScroll(), minScroll = this._getMinScroll(), defaultScroll = this._getDefaultScroll(), active.lastScroll = currentScroll < minScroll ? defaultScroll : currentScroll);
            }
        },
        _delayedRecordScroll: function() {
            setTimeout(jQuery.proxy(this, "_recordScroll"), 100);
        },
        _getScroll: function() {
            return this.window.scrollTop();
        },
        _getMinScroll: function() {
            return jQuery.mobile.minScrollBack;
        },
        _getDefaultScroll: function() {
            return jQuery.mobile.defaultHomeScroll;
        },
        _filterNavigateEvents: function(e, data) {
            var url;
            !(e.originalEvent && e.originalEvent.isDefaultPrevented()) && ((url = e.originalEvent.type.indexOf("hashchange") > -1 ? data.state.hash : data.state.url) || (url = this._getHash()), url && "#" !== url && 0 !== url.indexOf("#" + jQuery.mobile.path.uiStateKey) || (url = location.href), this._handleNavigate(url, data.state));
        },
        _getHash: function() {
            return jQuery.mobile.path.parseLocation().hash;
        },
        getActivePage: function() {
            return this.activePage;
        },
        _getInitialContent: function() {
            return jQuery.mobile.firstPage;
        },
        _getHistory: function() {
            return jQuery.mobile.navigate.history;
        },
        _getActiveHistory: function() {
            return jQuery.mobile.navigate.history.getActive();
        },
        _getDocumentBase: function() {
            return jQuery.mobile.path.documentBase;
        },
        back: function() {
            this.go(-1);
        },
        forward: function() {
            this.go(1);
        },
        go: function(steps) {
            if (jQuery.mobile.hashListeningEnabled) window.history.go(steps);
            else {
                var activeIndex = jQuery.mobile.navigate.history.activeIndex, index = activeIndex + parseInt(steps, 10), url = jQuery.mobile.navigate.history.stack[index].url;
                jQuery.mobile.navigate.history.activeIndex = index, jQuery.mobile.navigate.history.previousIndex = activeIndex, this.change(url, {
                    direction: steps >= 1 ? "forward" : "back",
                    changeHash: !1,
                    fromHashChange: !0
                });
            }
        },
        _handleDestination: function(to) {
            var history1;
            return "string" === jQuery.type(to) && (to = jQuery.mobile.path.stripHash(to)), to && (history1 = this._getHistory(), (to = jQuery.mobile.path.isPath(to) ? to : jQuery.mobile.path.makeUrlAbsolute("#" + to, this._getDocumentBase())) === jQuery.mobile.path.makeUrlAbsolute("#" + history1.initialDst, this._getDocumentBase()) && history1.stack.length && history1.stack[0].url !== history1.initialDst.replace(jQuery.mobile.dialogHashKey, "") && (to = this._getInitialContent())), to || this._getInitialContent();
        },
        _handleDialog: function(changePageOptions, data) {
            var to, active, activeContent = this.getActivePage();
            return activeContent && !activeContent.hasClass("ui-dialog") ? ("back" === data.direction ? this.back() : this.forward(), !1) : (to = data.pageUrl, active = this._getActiveHistory(), jQuery.extend(changePageOptions, {
                role: active.role,
                transition: active.transition,
                reverse: "back" === data.direction
            }), to);
        },
        _handleNavigate: function(url, data) {
            var to = jQuery.mobile.path.stripHash(url), history1 = this._getHistory(), transition = 0 === history1.stack.length ? "none" : undefined7, changePageOptions = {
                changeHash: !1,
                fromHashChange: !0,
                reverse: "back" === data.direction
            };
            jQuery.extend(changePageOptions, data, {
                transition: (history1.getLast() || {}).transition || transition
            }), (!(history1.activeIndex > 0 && to.indexOf(jQuery.mobile.dialogHashKey) > -1) || history1.initialDst === to || !1 !== (to = this._handleDialog(changePageOptions, data))) && this._changeContent(this._handleDestination(to), changePageOptions);
        },
        _changeContent: function(to, opts) {
            jQuery.mobile.changePage(to, opts);
        },
        _getBase: function() {
            return jQuery.mobile.base;
        },
        _getNs: function() {
            return jQuery.mobile.ns;
        },
        _enhance: function(content, role) {
            return content.page({
                role: role
            });
        },
        _include: function(page, settings) {
            page.appendTo(this.element), this._enhance(page, settings.role), page.page("bindRemove");
        },
        _find: function(absUrl) {
            var page, fileUrl = this._createFileUrl(absUrl), dataUrl = this._createDataUrl(absUrl), initialContent = this._getInitialContent();
            return 0 === (page = this.element.children("[data-" + this._getNs() + "url='" + dataUrl + "']")).length && dataUrl && !jQuery.mobile.path.isPath(dataUrl) && (page = this.element.children(jQuery.mobile.path.hashToSelector("#" + dataUrl)).attr("data-" + this._getNs() + "url", dataUrl).jqmData("url", dataUrl)), 0 === page.length && jQuery.mobile.path.isFirstPageUrl(fileUrl) && initialContent && initialContent.parent().length && (page = jQuery(initialContent)), page;
        },
        _getLoader: function() {
            return jQuery.mobile.loading();
        },
        _showLoading: function(delay, theme, msg, textonly) {
            !this._loadMsg && (this._loadMsg = setTimeout(jQuery.proxy(function() {
                this._getLoader().loader("show", theme, msg, textonly), this._loadMsg = 0;
            }, this), delay));
        },
        _hideLoading: function() {
            clearTimeout(this._loadMsg), this._loadMsg = 0, this._getLoader().loader("hide");
        },
        _showError: function() {
            this._hideLoading(), this._showLoading(0, jQuery.mobile.pageLoadErrorMessageTheme, jQuery.mobile.pageLoadErrorMessage, !0), setTimeout(jQuery.proxy(this, "_hideLoading"), 1500);
        },
        _parse: function(html, fileUrl) {
            var page, all = jQuery("<div></div>");
            return all.get(0).innerHTML = html, (page = all.find(":jqmData(role='page'), :jqmData(role='dialog')").first()).length || (page = jQuery("<div data-" + this._getNs() + "role='page'>" + (html.split(/<\/?body[^>]*>/gim)[1] || "") + "</div>")), page.attr("data-" + this._getNs() + "url", jQuery.mobile.path.convertUrlToDataUrl(fileUrl)).attr("data-" + this._getNs() + "external-page", !0), page;
        },
        _setLoadedTitle: function(page, html) {
            var newPageTitle = html.match(/<title[^>]*>([^<]*)/) && RegExp.$1;
            newPageTitle && !page.jqmData("title") && (newPageTitle = jQuery("<div>" + newPageTitle + "</div>").text(), page.jqmData("title", newPageTitle));
        },
        _isRewritableBaseTag: function() {
            return jQuery.mobile.dynamicBaseEnabled && !jQuery.support.dynamicBaseTag;
        },
        _createDataUrl: function(absoluteUrl) {
            return jQuery.mobile.path.convertUrlToDataUrl(absoluteUrl);
        },
        _createFileUrl: function(absoluteUrl) {
            return jQuery.mobile.path.getFilePath(absoluteUrl);
        },
        _triggerWithDeprecated: function(name, data, page) {
            var deprecatedEvent = jQuery.Event("page" + name), newEvent = jQuery.Event(this.widgetName + name);
            return (page || this.element).trigger(deprecatedEvent, data), this.element.trigger(newEvent, data), {
                deprecatedEvent: deprecatedEvent,
                event: newEvent
            };
        },
        _loadSuccess: function(absUrl, triggerData, settings, deferred) {
            var fileUrl = this._createFileUrl(absUrl), dataUrl = this._createDataUrl(absUrl);
            return jQuery.proxy(function(html, textStatus, xhr) {
                var content, pageElemRegex = RegExp("(<[^>]+\\bdata-" + this._getNs() + "role=[\"']?page[\"']?[^>]*>)"), dataUrlRegex = RegExp("\\bdata-" + this._getNs() + "url=[\"']?([^\"'>]*)[\"']?");
                pageElemRegex.test(html) && RegExp.$1 && dataUrlRegex.test(RegExp.$1) && RegExp.$1 && (fileUrl = jQuery.mobile.path.getFilePath(jQuery("<div>" + RegExp.$1 + "</div>").text())), settings.prefetch === undefined7 && this._getBase().set(fileUrl), content = this._parse(html, fileUrl), this._setLoadedTitle(content, html), triggerData.xhr = xhr, triggerData.textStatus = textStatus, triggerData.page = content, triggerData.content = content, this._trigger("load", undefined7, triggerData) && (this._isRewritableBaseTag() && content && this._getBase().rewrite(fileUrl, content), this._include(content, settings), absUrl.indexOf("&" + jQuery.mobile.subPageUrlKey) > -1 && (content = this.element.children("[data-" + this._getNs() + "url='" + dataUrl + "']")), settings.showLoadMsg && this._hideLoading(), this.element.trigger("pageload"), deferred.resolve(absUrl, settings, content));
            }, this);
        },
        _loadDefaults: {
            type: "get",
            data: undefined7,
            reloadPage: !1,
            reload: !1,
            role: undefined7,
            showLoadMsg: !1,
            loadMsgDelay: 50
        },
        load: function(url, options) {
            var fileUrl, dataUrl, pblEvent, triggerData, deferred = options && options.deferred || jQuery.Deferred(), settings = jQuery.extend({}, this._loadDefaults, options), content = null, absUrl = jQuery.mobile.path.makeUrlAbsolute(url, this._findBaseWithDefault());
            if (settings.reload = settings.reloadPage, settings.data && "get" === settings.type && (absUrl = jQuery.mobile.path.addSearchParams(absUrl, settings.data), settings.data = undefined7), settings.data && "post" === settings.type && (settings.reload = !0), fileUrl = this._createFileUrl(absUrl), dataUrl = this._createDataUrl(absUrl), 0 === (content = this._find(absUrl)).length && jQuery.mobile.path.isEmbeddedPage(fileUrl) && !jQuery.mobile.path.isFirstPageUrl(fileUrl)) {
                deferred.reject(absUrl, settings);
                return;
            }
            if (this._getBase().reset(), content.length && !settings.reload) {
                this._enhance(content, settings.role), deferred.resolve(absUrl, settings, content), settings.prefetch || this._getBase().set(url);
                return;
            }
            if (triggerData = {
                url: url,
                absUrl: absUrl,
                dataUrl: dataUrl,
                deferred: deferred,
                options: settings
            }, !((pblEvent = this._triggerWithDeprecated("beforeload", triggerData)).deprecatedEvent.isDefaultPrevented() || pblEvent.event.isDefaultPrevented())) {
                if (settings.showLoadMsg && this._showLoading(settings.loadMsgDelay), settings.prefetch === undefined7 && this._getBase().reset(), !(jQuery.mobile.allowCrossDomainPages || jQuery.mobile.path.isSameDomain(jQuery.mobile.path.documentUrl, absUrl))) {
                    deferred.reject(absUrl, settings);
                    return;
                }
                jQuery.ajax({
                    url: fileUrl,
                    type: settings.type,
                    data: settings.data,
                    contentType: settings.contentType,
                    dataType: "html",
                    success: this._loadSuccess(absUrl, triggerData, settings, deferred),
                    error: this._loadError(absUrl, triggerData, settings, deferred)
                });
            }
        },
        _loadError: function(absUrl, triggerData, settings, deferred) {
            return jQuery.proxy(function(xhr, textStatus, errorThrown) {
                this._getBase().set(jQuery.mobile.path.get()), triggerData.xhr = xhr, triggerData.textStatus = textStatus, triggerData.errorThrown = errorThrown;
                var plfEvent = this._triggerWithDeprecated("loadfailed", triggerData);
                !(plfEvent.deprecatedEvent.isDefaultPrevented() || plfEvent.event.isDefaultPrevented()) && (settings.showLoadMsg && this._showError(), deferred.reject(absUrl, settings));
            }, this);
        },
        _getTransitionHandler: function(transition) {
            return transition = jQuery.mobile._maybeDegradeTransition(transition), jQuery.mobile.transitionHandlers[transition] || jQuery.mobile.defaultTransitionHandler;
        },
        _triggerCssTransitionEvents: function(to, from, prefix) {
            var samePage = !1;
            prefix = prefix || "", from && (to[0] === from[0] && (samePage = !0), this._triggerWithDeprecated(prefix + "hide", {
                nextPage: to,
                samePage: samePage
            }, from)), this._triggerWithDeprecated(prefix + "show", {
                prevPage: from || jQuery("")
            }, to);
        },
        _cssTransition: function(to, from, options) {
            var promise, transition = options.transition, reverse = options.reverse, deferred = options.deferred;
            this._triggerCssTransitionEvents(to, from, "before"), this._hideLoading(), (promise = new (this._getTransitionHandler(transition))(transition, reverse, to, from).transition()).done(function() {
                deferred.resolve.apply(deferred, arguments);
            }), promise.done(jQuery.proxy(function() {
                this._triggerCssTransitionEvents(to, from);
            }, this));
        },
        _releaseTransitionLock: function() {
            isPageTransitioning = !1, pageTransitionQueue.length > 0 && jQuery.mobile.changePage.apply(null, pageTransitionQueue.pop());
        },
        _removeActiveLinkClass: function(force) {
            jQuery.mobile.removeActiveLinkClass(force);
        },
        _loadUrl: function(to, triggerData, settings) {
            settings.target = to, settings.deferred = jQuery.Deferred(), this.load(to, settings), settings.deferred.done(jQuery.proxy(function(url, options, content) {
                isPageTransitioning = !1, options.absUrl = triggerData.absUrl, this.transition(content, triggerData, options);
            }, this)), settings.deferred.fail(jQuery.proxy(function() {
                this._removeActiveLinkClass(!0), this._releaseTransitionLock(), this._triggerWithDeprecated("changefailed", triggerData);
            }, this));
        },
        _triggerPageBeforeChange: function(to, triggerData, settings) {
            var pbcEvent = new jQuery.Event("pagebeforechange");
            return jQuery.extend(triggerData, {
                toPage: to,
                options: settings
            }), "string" === jQuery.type(to) ? triggerData.absUrl = jQuery.mobile.path.makeUrlAbsolute(to, this._findBaseWithDefault()) : triggerData.absUrl = settings.absUrl, this.element.trigger(pbcEvent, triggerData), !pbcEvent.isDefaultPrevented();
        },
        change: function(to, options) {
            if (isPageTransitioning) {
                pageTransitionQueue.unshift(arguments);
                return;
            }
            var settings = jQuery.extend({}, jQuery.mobile.changePage.defaults, options), triggerData = {};
            settings.fromPage = settings.fromPage || this.activePage, this._triggerPageBeforeChange(to, triggerData, settings) && (to = triggerData.toPage, "string" === jQuery.type(to) ? (isPageTransitioning = !0, this._loadUrl(to, triggerData, settings)) : this.transition(to, triggerData, settings));
        },
        transition: function(toPage, triggerData, settings) {
            var fromPage, url, pageUrl, active, activeIsInitialPage, historyDir, pageTitle, isDialog, alreadyThere, newPageTitle, params, cssTransitionDeferred, beforeTransition;
            if (isPageTransitioning) {
                pageTransitionQueue.unshift([
                    toPage,
                    settings
                ]);
                return;
            }
            if (!(!this._triggerPageBeforeChange(toPage, triggerData, settings) || (beforeTransition = this._triggerWithDeprecated("beforetransition", triggerData)).deprecatedEvent.isDefaultPrevented() || beforeTransition.event.isDefaultPrevented())) {
                if (isPageTransitioning = !0, toPage[0] !== jQuery.mobile.firstPage[0] || settings.dataUrl || (settings.dataUrl = jQuery.mobile.path.documentUrl.hrefNoHash), fromPage = settings.fromPage, pageUrl = url = settings.dataUrl && jQuery.mobile.path.convertUrlToDataUrl(settings.dataUrl) || toPage.jqmData("url"), jQuery.mobile.path.getFilePath(url), active = jQuery.mobile.navigate.history.getActive(), activeIsInitialPage = 0 === jQuery.mobile.navigate.history.activeIndex, historyDir = 0, pageTitle = document1.title, isDialog = ("dialog" === settings.role || "dialog" === toPage.jqmData("role")) && !0 !== toPage.jqmData("dialog"), fromPage && fromPage[0] === toPage[0] && !settings.allowSamePageTransition) {
                    isPageTransitioning = !1, this._triggerWithDeprecated("transition", triggerData), this.element.trigger("pagechange", triggerData), settings.fromHashChange && jQuery.mobile.navigate.history.direct({
                        url: url
                    });
                    return;
                }
                toPage.page({
                    role: settings.role
                }), settings.fromHashChange && (historyDir = "back" === settings.direction ? -1 : 1);
                try {
                    document1.activeElement && "body" !== document1.activeElement.nodeName.toLowerCase() ? jQuery(document1.activeElement).blur() : jQuery("input:focus, textarea:focus, select:focus").blur();
                } catch (e) {}
                alreadyThere = !1, isDialog && active && (active.url && active.url.indexOf(jQuery.mobile.dialogHashKey) > -1 && this.activePage && !this.activePage.hasClass("ui-dialog") && jQuery.mobile.navigate.history.activeIndex > 0 && (settings.changeHash = !1, alreadyThere = !0), url = active.url || "", !alreadyThere && url.indexOf("#") > -1 ? url += jQuery.mobile.dialogHashKey : url += "#" + jQuery.mobile.dialogHashKey, 0 === jQuery.mobile.navigate.history.activeIndex && url === jQuery.mobile.navigate.history.initialDst && (url += jQuery.mobile.dialogHashKey)), (newPageTitle = active ? toPage.jqmData("title") || toPage.children(":jqmData(role='header')").find(".ui-title").text() : pageTitle) && pageTitle === document1.title && (pageTitle = newPageTitle), toPage.jqmData("title") || toPage.jqmData("title", pageTitle), settings.transition = settings.transition || (historyDir && !activeIsInitialPage ? active.transition : undefined7) || (isDialog ? jQuery.mobile.defaultDialogTransition : jQuery.mobile.defaultPageTransition), !historyDir && alreadyThere && (jQuery.mobile.navigate.history.getActive().pageUrl = pageUrl), url && !settings.fromHashChange && (!jQuery.mobile.path.isPath(url) && 0 > url.indexOf("#") && (url = "#" + url), params = {
                    transition: settings.transition,
                    title: pageTitle,
                    pageUrl: pageUrl,
                    role: settings.role
                }, !1 !== settings.changeHash && jQuery.mobile.hashListeningEnabled ? jQuery.mobile.navigate(url, params, !0) : toPage[0] !== jQuery.mobile.firstPage[0] && jQuery.mobile.navigate.history.add(url, params)), document1.title = pageTitle, jQuery.mobile.activePage = toPage, this.activePage = toPage, settings.reverse = settings.reverse || historyDir < 0, cssTransitionDeferred = jQuery.Deferred(), this._cssTransition(toPage, fromPage, {
                    transition: settings.transition,
                    reverse: settings.reverse,
                    deferred: cssTransitionDeferred
                }), cssTransitionDeferred.done(jQuery.proxy(function(name, reverse, $to, $from, alreadyFocused) {
                    jQuery.mobile.removeActiveLinkClass(), settings.duplicateCachedPage && settings.duplicateCachedPage.remove(), alreadyFocused || jQuery.mobile.focusPage(toPage), this._releaseTransitionLock(), this.element.trigger("pagechange", triggerData), this._triggerWithDeprecated("transition", triggerData);
                }, this));
            }
        },
        _findBaseWithDefault: function() {
            return this.activePage && jQuery.mobile.getClosestBaseUrl(this.activePage) || jQuery.mobile.path.documentBase.hrefNoHash;
        }
    }), jQuery.mobile.navreadyDeferred = jQuery.Deferred(), pageTransitionQueue = [], isPageTransitioning = !1, function($, undefined) {
        var domreadyDeferred = $.Deferred(), loadDeferred = $.Deferred(), documentUrl = $.mobile.path.documentUrl, $lastVClicked = null;
        function findClosestLink(ele) {
            for(; ele && ("string" != typeof ele.nodeName || "a" !== ele.nodeName.toLowerCase());)ele = ele.parentNode;
            return ele;
        }
        $.mobile.loadPage = function(url, opts) {
            var container;
            return container = (opts = opts || {}).pageContainer || $.mobile.pageContainer, opts.deferred = $.Deferred(), container.pagecontainer("load", url, opts), opts.deferred.promise();
        }, $.mobile.back = function() {
            var nav = window.navigator;
            this.phonegapNavigationEnabled && nav && nav.app && nav.app.backHistory ? nav.app.backHistory() : $.mobile.pageContainer.pagecontainer("back");
        }, $.mobile.focusPage = function(page) {
            var autofocus = page.find("[autofocus]"), pageTitle = page.find(".ui-title:eq(0)");
            if (autofocus.length) {
                autofocus.focus();
                return;
            }
            pageTitle.length ? pageTitle.focus() : page.focus();
        }, $.mobile._maybeDegradeTransition = $.mobile._maybeDegradeTransition || function(transition) {
            return transition;
        }, $.mobile.changePage = function(to, options) {
            $.mobile.pageContainer.pagecontainer("change", to, options);
        }, $.mobile.changePage.defaults = {
            transition: void 0,
            reverse: !1,
            changeHash: !0,
            fromHashChange: !1,
            role: void 0,
            duplicateCachedPage: undefined,
            pageContainer: undefined,
            showLoadMsg: !0,
            dataUrl: undefined,
            fromPage: undefined,
            allowSamePageTransition: !1
        }, $.mobile._registerInternalEvents = function() {
            var getAjaxFormData = function($form, calculateOnly) {
                var url, formData, vclickedName, method, ret = !0;
                return !(!$.mobile.ajaxEnabled || $form.is(":jqmData(ajax='false')") || !$form.jqmHijackable().length || $form.attr("target")) && (url = $lastVClicked && $lastVClicked.attr("formaction") || $form.attr("action"), method = ($form.attr("method") || "get").toLowerCase(), url || (url = $.mobile.getClosestBaseUrl($form), "get" === method && (url = $.mobile.path.parseUrl(url).hrefNoSearch), url !== $.mobile.path.documentBase.hrefNoHash || (url = documentUrl.hrefNoSearch)), url = $.mobile.path.makeUrlAbsolute(url, $.mobile.getClosestBaseUrl($form)), (!$.mobile.path.isExternal(url) || !!$.mobile.path.isPermittedCrossDomainRequest(documentUrl, url)) && (calculateOnly || (formData = $form.serializeArray(), $lastVClicked && $lastVClicked[0].form === $form[0] && (vclickedName = $lastVClicked.attr("name")) && ($.each(formData, function(key, value) {
                    if (value.name === vclickedName) return vclickedName = "", !1;
                }), vclickedName && formData.push({
                    name: vclickedName,
                    value: $lastVClicked.attr("value")
                })), ret = {
                    url: url,
                    options: {
                        type: method,
                        data: $.param(formData),
                        transition: $form.jqmData("transition"),
                        reverse: "reverse" === $form.jqmData("direction"),
                        reloadPage: !0
                    }
                }), ret));
            };
            $.mobile.document.delegate("form", "submit", function(event1) {
                var formData;
                !event1.isDefaultPrevented() && (formData = getAjaxFormData($(this))) && ($.mobile.changePage(formData.url, formData.options), event1.preventDefault());
            }), $.mobile.document.bind("vclick", function(event1) {
                var $btn, btnEls, target = event1.target, needClosest = !1;
                if (!(event1.which > 1) && $.mobile.linkBindingEnabled) {
                    if ($lastVClicked = $(target), $.data(target, "mobile-button")) {
                        if (!getAjaxFormData($(target).closest("form"), !0)) return;
                        target.parentNode && (target = target.parentNode);
                    } else if (!((target = findClosestLink(target)) && "#" !== $.mobile.path.parseUrl(target.getAttribute("href") || "#").hash) || !$(target).jqmHijackable().length) return;
                    ~target.className.indexOf("ui-link-inherit") ? target.parentNode && (btnEls = $.data(target.parentNode, "buttonElements")) : btnEls = $.data(target, "buttonElements"), btnEls ? target = btnEls.outer : needClosest = !0, $btn = $(target), needClosest && ($btn = $btn.closest(".ui-btn")), $btn.length > 0 && !$btn.hasClass("ui-state-disabled") && ($.mobile.removeActiveLinkClass(!0), $.mobile.activeClickedLink = $btn, $.mobile.activeClickedLink.addClass($.mobile.activeBtnClass));
                }
            }), $.mobile.document.bind("click", function(event1) {
                if (!(!$.mobile.linkBindingEnabled || event1.isDefaultPrevented())) {
                    var baseUrl, href, transition, reverse, role, link = findClosestLink(event1.target), $link = $(link), httpCleanup = function() {
                        window.setTimeout(function() {
                            $.mobile.removeActiveLinkClass(!0);
                        }, 200);
                    };
                    if ($.mobile.activeClickedLink && $.mobile.activeClickedLink[0] === event1.target.parentNode && httpCleanup(), link && !(event1.which > 1) && $link.jqmHijackable().length) {
                        if ($link.is(":jqmData(rel='back')")) return $.mobile.back(), !1;
                        if (baseUrl = $.mobile.getClosestBaseUrl($link), href = $.mobile.path.makeUrlAbsolute($link.attr("href") || "#", baseUrl), !$.mobile.ajaxEnabled && !$.mobile.path.isEmbeddedPage(href)) {
                            httpCleanup();
                            return;
                        }
                        if (-1 !== href.search("#")) {
                            if (href = href.replace(/[^#]*#/, "")) href = $.mobile.path.isPath(href) ? $.mobile.path.makeUrlAbsolute(href, baseUrl) : $.mobile.path.makeUrlAbsolute("#" + href, documentUrl.hrefNoHash);
                            else {
                                event1.preventDefault();
                                return;
                            }
                        }
                        if ($link.is("[rel='external']") || $link.is(":jqmData(ajax='false')") || $link.is("[target]") || $.mobile.path.isExternal(href) && !$.mobile.path.isPermittedCrossDomainRequest(documentUrl, href)) {
                            httpCleanup();
                            return;
                        }
                        transition = $link.jqmData("transition"), reverse = "reverse" === $link.jqmData("direction") || $link.jqmData("back"), role = $link.attr("data-" + $.mobile.ns + "rel") || undefined, $.mobile.changePage(href, {
                            transition: transition,
                            reverse: reverse,
                            role: role,
                            link: $link
                        }), event1.preventDefault();
                    }
                }
            }), $.mobile.document.delegate(".ui-page", "pageshow.prefetch", function() {
                var urls = [];
                $(this).find("a:jqmData(prefetch)").each(function() {
                    var $link = $(this), url = $link.attr("href");
                    url && -1 === $.inArray(url, urls) && (urls.push(url), $.mobile.loadPage(url, {
                        role: $link.attr("data-" + $.mobile.ns + "rel"),
                        prefetch: !0
                    }));
                });
            }), $.mobile.pageContainer.pagecontainer(), $.mobile.document.bind("pageshow", function() {
                loadDeferred ? loadDeferred.done($.mobile.resetActivePageHeight) : $.mobile.resetActivePageHeight();
            }), $.mobile.window.bind("throttledresize", $.mobile.resetActivePageHeight);
        }, $(function() {
            domreadyDeferred.resolve();
        }), $.mobile.window.load(function() {
            loadDeferred.resolve(), loadDeferred = null;
        }), $.when(domreadyDeferred, $.mobile.navreadyDeferred).done(function() {
            $.mobile._registerInternalEvents();
        });
    }(jQuery), window2 = this, jQuery.mobile.Transition = function() {
        this.init.apply(this, arguments);
    }, jQuery.extend(jQuery.mobile.Transition.prototype, {
        toPreClass: " ui-page-pre-in",
        init: function(name, reverse, $to, $from) {
            jQuery.extend(this, {
                name: name,
                reverse: reverse,
                $to: $to,
                $from: $from,
                deferred: new jQuery.Deferred()
            });
        },
        cleanFrom: function() {
            this.$from.removeClass(jQuery.mobile.activePageClass + " out in reverse " + this.name).height("");
        },
        beforeDoneIn: function() {},
        beforeDoneOut: function() {},
        beforeStartOut: function() {},
        doneIn: function() {
            this.beforeDoneIn(), this.$to.removeClass("out in reverse " + this.name).height(""), this.toggleViewportClass(), jQuery.mobile.window.scrollTop() !== this.toScroll && this.scrollPage(), this.sequential || this.$to.addClass(jQuery.mobile.activePageClass), this.deferred.resolve(this.name, this.reverse, this.$to, this.$from, !0);
        },
        doneOut: function(screenHeight, reverseClass, none, preventFocus) {
            this.beforeDoneOut(), this.startIn(screenHeight, reverseClass, none, preventFocus);
        },
        hideIn: function(callback) {
            this.$to.css("z-index", -10), callback.call(this), this.$to.css("z-index", "");
        },
        scrollPage: function() {
            jQuery.event.special.scrollstart.enabled = !1, (jQuery.mobile.hideUrlBar || this.toScroll !== jQuery.mobile.defaultHomeScroll) && window2.scrollTo(0, this.toScroll), setTimeout(function() {
                jQuery.event.special.scrollstart.enabled = !0;
            }, 150);
        },
        startIn: function(screenHeight, reverseClass, none, preventFocus) {
            this.hideIn(function() {
                this.$to.addClass(jQuery.mobile.activePageClass + this.toPreClass), preventFocus || jQuery.mobile.focusPage(this.$to), this.$to.height(screenHeight + this.toScroll), none || this.scrollPage();
            }), this.$to.removeClass(this.toPreClass).addClass(this.name + " in " + reverseClass), none ? this.doneIn() : this.$to.animationComplete(jQuery.proxy(function() {
                this.doneIn();
            }, this));
        },
        startOut: function(screenHeight, reverseClass, none) {
            this.beforeStartOut(screenHeight, reverseClass, none), this.$from.height(screenHeight + jQuery.mobile.window.scrollTop()).addClass(this.name + " out" + reverseClass);
        },
        toggleViewportClass: function() {
            jQuery.mobile.pageContainer.toggleClass("ui-mobile-viewport-transitioning viewport-" + this.name);
        },
        transition: function() {
            var none, reverseClass = this.reverse ? " reverse" : "", screenHeight = jQuery.mobile.getScreenHeight(), maxTransitionOverride = !1 !== jQuery.mobile.maxTransitionWidth && jQuery.mobile.window.width() > jQuery.mobile.maxTransitionWidth;
            return this.toScroll = jQuery.mobile.navigate.history.getActive().lastScroll || jQuery.mobile.defaultHomeScroll, none = !jQuery.support.cssTransitions || !jQuery.support.cssAnimations || maxTransitionOverride || !this.name || "none" === this.name || Math.max(jQuery.mobile.window.scrollTop(), this.toScroll) > jQuery.mobile.getMaxScrollForTransition(), this.toggleViewportClass(), this.$from && !none ? this.startOut(screenHeight, reverseClass, none) : this.doneOut(screenHeight, reverseClass, none, !0), this.deferred.promise();
        }
    }), jQuery.mobile.SerialTransition = function() {
        this.init.apply(this, arguments);
    }, jQuery.extend(jQuery.mobile.SerialTransition.prototype, jQuery.mobile.Transition.prototype, {
        sequential: !0,
        beforeDoneOut: function() {
            this.$from && this.cleanFrom();
        },
        beforeStartOut: function(screenHeight, reverseClass, none) {
            this.$from.animationComplete(jQuery.proxy(function() {
                this.doneOut(screenHeight, reverseClass, none);
            }, this));
        }
    }), jQuery.mobile.ConcurrentTransition = function() {
        this.init.apply(this, arguments);
    }, jQuery.extend(jQuery.mobile.ConcurrentTransition.prototype, jQuery.mobile.Transition.prototype, {
        sequential: !1,
        beforeDoneIn: function() {
            this.$from && this.cleanFrom();
        },
        beforeStartOut: function(screenHeight, reverseClass, none) {
            this.doneOut(screenHeight, reverseClass, none);
        }
    }), jQuery.mobile.transitionHandlers = {
        sequential: jQuery.mobile.SerialTransition,
        simultaneous: jQuery.mobile.ConcurrentTransition
    }, jQuery.mobile.defaultTransitionHandler = jQuery.mobile.transitionHandlers.sequential, jQuery.mobile.transitionFallbacks = {}, jQuery.mobile._maybeDegradeTransition = function(transition) {
        return transition && !jQuery.support.cssTransform3d && jQuery.mobile.transitionFallbacks[transition] && (transition = jQuery.mobile.transitionFallbacks[transition]), transition;
    }, jQuery.mobile.getMaxScrollForTransition = jQuery.mobile.getMaxScrollForTransition || function() {
        return 3 * jQuery.mobile.getScreenHeight();
    }, jQuery.mobile.transitionFallbacks.flip = "fade", jQuery.mobile.transitionFallbacks.flow = "fade", jQuery.mobile.transitionFallbacks.pop = "fade", jQuery.mobile.transitionHandlers.slide = jQuery.mobile.transitionHandlers.simultaneous, jQuery.mobile.transitionFallbacks.slide = "fade", jQuery.mobile.transitionFallbacks.slidedown = "fade", jQuery.mobile.transitionFallbacks.slidefade = "fade", jQuery.mobile.transitionFallbacks.slideup = "fade", jQuery.mobile.transitionFallbacks.turn = "fade", jQuery.mobile.degradeInputs = {
        color: !1,
        date: !1,
        datetime: !1,
        "datetime-local": !1,
        email: !1,
        month: !1,
        number: !1,
        range: "number",
        search: "text",
        tel: !1,
        time: !1,
        url: !1,
        week: !1
    }, jQuery.mobile.page.prototype.options.degradeInputs = jQuery.mobile.degradeInputs, jQuery.mobile.degradeInputsWithin = function(target) {
        (target = jQuery(target)).find("input").not(jQuery.mobile.page.prototype.keepNativeSelector()).each(function() {
            var html, hasType, findstr, repstr, element = jQuery(this), type = this.getAttribute("type"), optType = jQuery.mobile.degradeInputs[type] || "text";
            jQuery.mobile.degradeInputs[type] && (findstr = (hasType = (html = jQuery("<div>").html(element.clone()).html()).indexOf(" type=") > -1) ? /\s+type=["']?\w+['"]?/ : /\/?>/, repstr = ' type="' + optType + '" data-' + jQuery.mobile.ns + 'type="' + type + '"' + (hasType ? "" : ">"), element.replaceWith(html.replace(findstr, repstr)));
        });
    }, function($, window, undefined) {
        $.widget("mobile.page", $.mobile.page, {
            options: {
                closeBtn: "left",
                closeBtnText: "Close",
                overlayTheme: "a",
                corners: !0,
                dialog: !1
            },
            _create: function() {
                this._super(), this.options.dialog && ($.extend(this, {
                    _inner: this.element.children(),
                    _headerCloseButton: null
                }), this.options.enhanced || this._setCloseBtn(this.options.closeBtn));
            },
            _enhance: function() {
                this._super(), this.options.dialog && this.element.addClass("ui-dialog").wrapInner($("<div/>", {
                    role: "dialog",
                    class: "ui-dialog-contain ui-overlay-shadow" + (this.options.corners ? " ui-corner-all" : "")
                }));
            },
            _setOptions: function(options) {
                var closeButtonLocation, closeButtonText, currentOpts = this.options;
                void 0 !== options.corners && this._inner.toggleClass("ui-corner-all", !!options.corners), void 0 !== options.overlayTheme && $.mobile.activePage[0] === this.element[0] && (currentOpts.overlayTheme = options.overlayTheme, this._handlePageBeforeShow()), options.closeBtnText !== undefined && (closeButtonLocation = currentOpts.closeBtn, closeButtonText = options.closeBtnText), options.closeBtn !== undefined && (closeButtonLocation = options.closeBtn), closeButtonLocation && this._setCloseBtn(closeButtonLocation, closeButtonText), this._super(options);
            },
            _handlePageBeforeShow: function() {
                this.options.overlayTheme && this.options.dialog ? (this.removeContainerBackground(), this.setContainerBackground(this.options.overlayTheme)) : this._super();
            },
            _setCloseBtn: function(location1, text) {
                var dst, btn = this._headerCloseButton;
                "none" == (location1 = "left" === location1 ? "left" : "right" === location1 ? "right" : "none") ? btn && (btn.remove(), btn = null) : btn ? (btn.removeClass("ui-btn-left ui-btn-right").addClass("ui-btn-" + location1), text && btn.text(text)) : (dst = this._inner.find(":jqmData(role='header')").first(), btn = $("<a></a>", {
                    href: "#",
                    class: "ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-" + location1
                }).attr("data-" + $.mobile.ns + "rel", "back").text(text || this.options.closeBtnText || "").prependTo(dst)), this._headerCloseButton = btn;
            }
        });
    }(jQuery, 0), function($, window, undefined) {
        $.widget("mobile.dialog", {
            options: {
                closeBtn: "left",
                closeBtnText: "Close",
                overlayTheme: "a",
                corners: !0
            },
            _handlePageBeforeShow: function() {
                this._isCloseable = !0, this.options.overlayTheme && this.element.page("removeContainerBackground").page("setContainerBackground", this.options.overlayTheme);
            },
            _handlePageBeforeHide: function() {
                this._isCloseable = !1;
            },
            _handleVClickSubmit: function(event1) {
                var attrs, $target = $(event1.target).closest("vclick" === event1.type ? "a" : "form");
                $target.length && !$target.jqmData("transition") && ((attrs = {})["data-" + $.mobile.ns + "transition"] = ($.mobile.navigate.history.getActive() || {}).transition || $.mobile.defaultDialogTransition, attrs["data-" + $.mobile.ns + "direction"] = "reverse", $target.attr(attrs));
            },
            _create: function() {
                var elem = this.element, opts = this.options;
                elem.addClass("ui-dialog").wrapInner($("<div/>", {
                    role: "dialog",
                    class: "ui-dialog-contain ui-overlay-shadow" + (opts.corners ? " ui-corner-all" : "")
                })), $.extend(this, {
                    _isCloseable: !1,
                    _inner: elem.children(),
                    _headerCloseButton: null
                }), this._on(elem, {
                    vclick: "_handleVClickSubmit",
                    submit: "_handleVClickSubmit",
                    pagebeforeshow: "_handlePageBeforeShow",
                    pagebeforehide: "_handlePageBeforeHide"
                }), this._setCloseBtn(opts.closeBtn);
            },
            _setOptions: function(options) {
                var closeButtonLocation, closeButtonText, currentOpts = this.options;
                void 0 !== options.corners && this._inner.toggleClass("ui-corner-all", !!options.corners), void 0 !== options.overlayTheme && $.mobile.activePage[0] === this.element[0] && (currentOpts.overlayTheme = options.overlayTheme, this._handlePageBeforeShow()), options.closeBtnText !== undefined && (closeButtonLocation = currentOpts.closeBtn, closeButtonText = options.closeBtnText), options.closeBtn !== undefined && (closeButtonLocation = options.closeBtn), closeButtonLocation && this._setCloseBtn(closeButtonLocation, closeButtonText), this._super(options);
            },
            _setCloseBtn: function(location1, text) {
                var dst, btn = this._headerCloseButton;
                "none" == (location1 = "left" === location1 ? "left" : "right" === location1 ? "right" : "none") ? btn && (btn.remove(), btn = null) : btn ? (btn.removeClass("ui-btn-left ui-btn-right").addClass("ui-btn-" + location1), text && btn.text(text)) : (dst = this._inner.find(":jqmData(role='header')").first(), btn = $("<a></a>", {
                    role: "button",
                    href: "#",
                    class: "ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-" + location1
                }).text(text || this.options.closeBtnText || "").prependTo(dst), this._on(btn, {
                    click: "close"
                })), this._headerCloseButton = btn;
            },
            close: function() {
                var hist = $.mobile.navigate.history;
                this._isCloseable && (this._isCloseable = !1, $.mobile.hashListeningEnabled && hist.activeIndex > 0 ? $.mobile.back() : $.mobile.pageContainer.pagecontainer("back"));
            }
        });
    }(jQuery, 0), rInitialLetter = /([A-Z])/g, iconposClass = function(iconpos) {
        return "ui-btn-icon-" + (null === iconpos ? "left" : iconpos);
    }, jQuery.widget("mobile.collapsible", {
        options: {
            enhanced: !1,
            expandCueText: null,
            collapseCueText: null,
            collapsed: !0,
            heading: "h1,h2,h3,h4,h5,h6,legend",
            collapsedIcon: null,
            expandedIcon: null,
            iconpos: null,
            theme: null,
            contentTheme: null,
            inset: null,
            corners: null,
            mini: null
        },
        _create: function() {
            var elem = this.element, ui = {
                accordion: elem.closest(":jqmData(role='collapsible-set'),:jqmData(role='collapsibleset')" + (jQuery.mobile.collapsibleset ? ", :mobile-collapsibleset" : "")).addClass("ui-collapsible-set")
            };
            this._ui = ui, this._renderedOptions = this._getOptions(this.options), this.options.enhanced ? (ui.heading = jQuery(".ui-collapsible-heading", this.element[0]), ui.content = ui.heading.next(), ui.anchor = jQuery("a", ui.heading[0]).first(), ui.status = ui.anchor.children(".ui-collapsible-heading-status")) : this._enhance(elem, ui), this._on(ui.heading, {
                tap: function() {
                    ui.heading.find("a").first().addClass(jQuery.mobile.activeBtnClass);
                },
                click: function(event1) {
                    this._handleExpandCollapse(!ui.heading.hasClass("ui-collapsible-heading-collapsed")), event1.preventDefault(), event1.stopPropagation();
                }
            });
        },
        _getOptions: function(options) {
            var key, accordion = this._ui.accordion, accordionWidget = this._ui.accordionWidget;
            for(key in options = jQuery.extend({}, options), accordion.length && !accordionWidget && (this._ui.accordionWidget = accordionWidget = accordion.data("mobile-collapsibleset")), options)options[key] = null != options[key] ? options[key] : accordionWidget ? accordionWidget.options[key] : accordion.length ? jQuery.mobile.getAttribute(accordion[0], key.replace(rInitialLetter, "-$1").toLowerCase()) : null, null == options[key] && (options[key] = jQuery.mobile.collapsible.defaults[key]);
            return options;
        },
        _themeClassFromOption: function(prefix, value) {
            return value ? "none" === value ? "" : prefix + value : "";
        },
        _enhance: function(elem, ui) {
            var iconclass, opts = this._renderedOptions, contentThemeClass = this._themeClassFromOption("ui-body-", opts.contentTheme);
            return elem.addClass("ui-collapsible " + (opts.inset ? "ui-collapsible-inset " : "") + (opts.inset && opts.corners ? "ui-corner-all " : "") + (contentThemeClass ? "ui-collapsible-themed-content " : "")), ui.originalHeading = elem.children(this.options.heading).first(), ui.content = elem.wrapInner("<div class='ui-collapsible-content " + contentThemeClass + "'></div>").children(".ui-collapsible-content"), ui.heading = ui.originalHeading, ui.heading.is("legend") && (ui.heading = jQuery("<div role='heading'>" + ui.heading.html() + "</div>"), ui.placeholder = jQuery("<div><!-- placeholder for legend --></div>").insertBefore(ui.originalHeading), ui.originalHeading.remove()), iconclass = opts.collapsed ? opts.collapsedIcon ? "ui-icon-" + opts.collapsedIcon : "" : opts.expandedIcon ? "ui-icon-" + opts.expandedIcon : "", ui.status = jQuery("<span class='ui-collapsible-heading-status'></span>"), ui.anchor = ui.heading.detach().addClass("ui-collapsible-heading").append(ui.status).wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a").first().addClass("ui-btn " + (iconclass ? iconclass + " " : "") + (iconclass ? iconposClass(opts.iconpos) + " " : "") + this._themeClassFromOption("ui-btn-", opts.theme) + " " + (opts.mini ? "ui-mini " : "")), ui.heading.insertBefore(ui.content), this._handleExpandCollapse(this.options.collapsed), ui;
        },
        refresh: function() {
            this._applyOptions(this.options), this._renderedOptions = this._getOptions(this.options);
        },
        _applyOptions: function(options) {
            var isCollapsed, newTheme, oldTheme, hasCorners, hasIcon, elem = this.element, currentOpts = this._renderedOptions, ui = this._ui, anchor = ui.anchor, status = ui.status, opts = this._getOptions(options);
            void 0 !== options.collapsed && this._handleExpandCollapse(options.collapsed), (isCollapsed = elem.hasClass("ui-collapsible-collapsed")) ? opts.expandCueText !== undefined8 && status.text(opts.expandCueText) : opts.collapseCueText !== undefined8 && status.text(opts.collapseCueText), hasIcon = opts.collapsedIcon !== undefined8 ? !1 !== opts.collapsedIcon : !1 !== currentOpts.collapsedIcon, !(opts.iconpos === undefined8 && opts.collapsedIcon === undefined8 && opts.expandedIcon === undefined8) && (anchor.removeClass([
                iconposClass(currentOpts.iconpos)
            ].concat(currentOpts.expandedIcon ? [
                "ui-icon-" + currentOpts.expandedIcon
            ] : []).concat(currentOpts.collapsedIcon ? [
                "ui-icon-" + currentOpts.collapsedIcon
            ] : []).join(" ")), hasIcon && anchor.addClass([
                iconposClass(opts.iconpos !== undefined8 ? opts.iconpos : currentOpts.iconpos)
            ].concat(isCollapsed ? [
                "ui-icon-" + (opts.collapsedIcon !== undefined8 ? opts.collapsedIcon : currentOpts.collapsedIcon)
            ] : [
                "ui-icon-" + (opts.expandedIcon !== undefined8 ? opts.expandedIcon : currentOpts.expandedIcon)
            ]).join(" "))), opts.theme !== undefined8 && (oldTheme = this._themeClassFromOption("ui-btn-", currentOpts.theme), newTheme = this._themeClassFromOption("ui-btn-", opts.theme), anchor.removeClass(oldTheme).addClass(newTheme)), opts.contentTheme !== undefined8 && (oldTheme = this._themeClassFromOption("ui-body-", currentOpts.contentTheme), newTheme = this._themeClassFromOption("ui-body-", opts.contentTheme), ui.content.removeClass(oldTheme).addClass(newTheme)), opts.inset !== undefined8 && (elem.toggleClass("ui-collapsible-inset", opts.inset), hasCorners = !!(opts.inset && (opts.corners || currentOpts.corners))), opts.corners !== undefined8 && (hasCorners = !!(opts.corners && (opts.inset || currentOpts.inset))), undefined8 !== hasCorners && elem.toggleClass("ui-corner-all", hasCorners), opts.mini !== undefined8 && anchor.toggleClass("ui-mini", opts.mini);
        },
        _setOptions: function(options) {
            this._applyOptions(options), this._super(options), this._renderedOptions = this._getOptions(this.options);
        },
        _handleExpandCollapse: function(isCollapse) {
            var opts = this._renderedOptions, ui = this._ui;
            ui.status.text(isCollapse ? opts.expandCueText : opts.collapseCueText), ui.heading.toggleClass("ui-collapsible-heading-collapsed", isCollapse).find("a").first().toggleClass("ui-icon-" + opts.expandedIcon, !isCollapse).toggleClass("ui-icon-" + opts.collapsedIcon, isCollapse || opts.expandedIcon === opts.collapsedIcon).removeClass(jQuery.mobile.activeBtnClass), this.element.toggleClass("ui-collapsible-collapsed", isCollapse), ui.content.toggleClass("ui-collapsible-content-collapsed", isCollapse).attr("aria-hidden", isCollapse).trigger("updatelayout"), this.options.collapsed = isCollapse, this._trigger(isCollapse ? "collapse" : "expand");
        },
        expand: function() {
            this._handleExpandCollapse(!1);
        },
        collapse: function() {
            this._handleExpandCollapse(!0);
        },
        _destroy: function() {
            var ui = this._ui;
            !this.options.enhanced && (ui.placeholder ? (ui.originalHeading.insertBefore(ui.placeholder), ui.placeholder.remove(), ui.heading.remove()) : (ui.status.remove(), ui.heading.removeClass("ui-collapsible-heading ui-collapsible-heading-collapsed").children().contents().unwrap()), ui.anchor.contents().unwrap(), ui.content.contents().unwrap(), this.element.removeClass("ui-collapsible ui-collapsible-collapsed ui-collapsible-themed-content ui-collapsible-inset ui-corner-all"));
        }
    }), jQuery.mobile.collapsible.defaults = {
        expandCueText: " click to expand contents",
        collapseCueText: " click to collapse contents",
        collapsedIcon: "plus",
        contentTheme: "inherit",
        expandedIcon: "minus",
        iconpos: "left",
        inset: !0,
        corners: !0,
        theme: "inherit",
        mini: !1
    }, jQuery.mobile.behaviors.addFirstLastClasses = {
        _getVisibles: function($els, create) {
            var visibles;
            return create ? visibles = $els.not(".ui-screen-hidden") : 0 === (visibles = $els.filter(":visible")).length && (visibles = $els.not(".ui-screen-hidden")), visibles;
        },
        _addFirstLastClasses: function($els, $visibles, create) {
            $els.removeClass("ui-first-child ui-last-child"), $visibles.eq(0).addClass("ui-first-child").end().last().addClass("ui-last-child"), create || this.element.trigger("updatelayout");
        },
        _removeFirstLastClasses: function($els) {
            $els.removeClass("ui-first-child ui-last-child");
        }
    }, function($, undefined) {
        var childCollapsiblesSelector = ":mobile-collapsible, " + $.mobile.collapsible.initSelector;
        $.widget("mobile.collapsibleset", $.extend({
            initSelector: ":jqmData(role='collapsible-set'),:jqmData(role='collapsibleset')",
            options: $.extend({
                enhanced: !1
            }, $.mobile.collapsible.defaults),
            _handleCollapsibleExpand: function(event1) {
                var closestCollapsible = $(event1.target).closest(".ui-collapsible");
                closestCollapsible.parent().is(":mobile-collapsibleset, :jqmData(role='collapsible-set')") && closestCollapsible.siblings(".ui-collapsible:not(.ui-collapsible-collapsed)").collapsible("collapse");
            },
            _create: function() {
                var elem = this.element, opts = this.options;
                $.extend(this, {
                    _classes: ""
                }), opts.enhanced || (elem.addClass("ui-collapsible-set " + this._themeClassFromOption("ui-group-theme-", opts.theme) + " " + (opts.corners && opts.inset ? "ui-corner-all " : "")), this.element.find($.mobile.collapsible.initSelector).collapsible()), this._on(elem, {
                    collapsibleexpand: "_handleCollapsibleExpand"
                });
            },
            _themeClassFromOption: function(prefix, value) {
                return value ? "none" === value ? "" : prefix + value : "";
            },
            _init: function() {
                this._refresh(!0), this.element.children(childCollapsiblesSelector).filter(":jqmData(collapsed='false')").collapsible("expand");
            },
            _setOptions: function(options) {
                var ret, hasCorners, elem = this.element, themeClass = this._themeClassFromOption("ui-group-theme-", options.theme);
                return themeClass && elem.removeClass(this._themeClassFromOption("ui-group-theme-", this.options.theme)).addClass(themeClass), void 0 !== options.inset && (hasCorners = !!(options.inset && (options.corners || this.options.corners))), void 0 !== options.corners && (hasCorners = !!(options.corners && (options.inset || this.options.inset))), undefined !== hasCorners && elem.toggleClass("ui-corner-all", hasCorners), ret = this._super(options), this.element.children(":mobile-collapsible").collapsible("refresh"), ret;
            },
            _destroy: function() {
                var el = this.element;
                this._removeFirstLastClasses(el.children(childCollapsiblesSelector)), el.removeClass("ui-collapsible-set ui-corner-all " + this._themeClassFromOption("ui-group-theme-", this.options.theme)).children(":mobile-collapsible").collapsible("destroy");
            },
            _refresh: function(create) {
                var collapsiblesInSet = this.element.children(childCollapsiblesSelector);
                this.element.find($.mobile.collapsible.initSelector).not(".ui-collapsible").collapsible(), this._addFirstLastClasses(collapsiblesInSet, this._getVisibles(collapsiblesInSet, create), create);
            },
            refresh: function() {
                this._refresh(!1);
            }
        }, $.mobile.behaviors.addFirstLastClasses));
    }(jQuery), jQuery.fn.fieldcontain = function() {
        return this.addClass("ui-field-contain");
    }, jQuery.fn.grid = function(options) {
        return this.each(function() {
            var iterator, letter, $this = jQuery(this), o = jQuery.extend({
                grid: null
            }, options), $kids = $this.children(), gridCols = {
                solo: 1,
                a: 2,
                b: 3,
                c: 4,
                d: 5
            }, grid = o.grid;
            if (!grid) {
                if ($kids.length <= 5) for(letter in gridCols)gridCols[letter] === $kids.length && (grid = letter);
                else grid = "a", $this.addClass("ui-grid-duo");
            }
            iterator = gridCols[grid], $this.addClass("ui-grid-" + grid), $kids.filter(":nth-child(" + iterator + "n+1)").addClass("ui-block-a"), iterator > 1 && $kids.filter(":nth-child(" + iterator + "n+2)").addClass("ui-block-b"), iterator > 2 && $kids.filter(":nth-child(" + iterator + "n+3)").addClass("ui-block-c"), iterator > 3 && $kids.filter(":nth-child(" + iterator + "n+4)").addClass("ui-block-d"), iterator > 4 && $kids.filter(":nth-child(" + iterator + "n+5)").addClass("ui-block-e");
        });
    }, function($, undefined) {
        $.widget("mobile.navbar", {
            options: {
                iconpos: "top",
                grid: null
            },
            _create: function() {
                var $navbar = this.element, $navbtns = $navbar.find("a"), iconpos = $navbtns.filter(":jqmData(icon)").length ? this.options.iconpos : void 0;
                $navbar.addClass("ui-navbar").attr("role", "navigation").find("ul").jqmEnhanceable().grid({
                    grid: this.options.grid
                }), $navbtns.each(function() {
                    var icon = $.mobile.getAttribute(this, "icon"), theme = $.mobile.getAttribute(this, "theme"), classes = "ui-btn";
                    theme && (classes += " ui-btn-" + theme), icon && (classes += " ui-icon-" + icon + " ui-btn-icon-" + iconpos), $(this).addClass(classes);
                }), $navbar.delegate("a", "vclick", function() {
                    var activeBtn = $(this);
                    activeBtn.hasClass("ui-state-disabled") || activeBtn.hasClass("ui-disabled") || activeBtn.hasClass($.mobile.activeBtnClass) || ($navbtns.removeClass($.mobile.activeBtnClass), activeBtn.addClass($.mobile.activeBtnClass), $(document1).one("pagehide", function() {
                        activeBtn.removeClass($.mobile.activeBtnClass);
                    }));
                }), $navbar.closest(".ui-page").bind("pagebeforeshow", function() {
                    $navbtns.filter(".ui-state-persist").addClass($.mobile.activeBtnClass);
                });
            }
        });
    }(jQuery), function($, undefined) {
        var getAttr = $.mobile.getAttribute;
        $.widget("mobile.listview", $.extend({
            options: {
                theme: null,
                countTheme: null,
                dividerTheme: null,
                icon: "carat-r",
                splitIcon: "carat-r",
                splitTheme: null,
                corners: !0,
                shadow: !0,
                inset: !1
            },
            _create: function() {
                var listviewClasses = "";
                listviewClasses += this.options.inset ? " ui-listview-inset" : "", this.options.inset && (listviewClasses += (this.options.corners ? " ui-corner-all" : "") + (this.options.shadow ? " ui-shadow" : "")), this.element.addClass(" ui-listview" + listviewClasses), this.refresh(!0);
            },
            _findFirstElementByTagName: function(ele, nextProp, lcName, ucName) {
                var dict = {};
                for(dict[lcName] = dict[ucName] = !0; ele;){
                    if (dict[ele.nodeName]) return ele;
                    ele = ele[nextProp];
                }
                return null;
            },
            _addThumbClasses: function(containers) {
                var i, img, len = containers.length;
                for(i = 0; i < len; i++)(img = $(this._findFirstElementByTagName(containers[i].firstChild, "nextSibling", "img", "IMG"))).length && $(this._findFirstElementByTagName(img[0].parentNode, "parentNode", "li", "LI")).addClass(img.hasClass("ui-li-icon") ? "ui-li-has-icon" : "ui-li-has-thumb");
            },
            _getChildrenByTagName: function(ele, lcName, ucName) {
                var results = [], dict = {};
                for(dict[lcName] = dict[ucName] = !0, ele = ele.firstChild; ele;)dict[ele.nodeName] && results.push(ele), ele = ele.nextSibling;
                return $(results);
            },
            _beforeListviewRefresh: $.noop,
            _afterListviewRefresh: $.noop,
            refresh: function(create) {
                var buttonClass, pos, numli, item, itemClass, itemTheme, itemIcon, icon, a, isDivider, startCount, newStartCount, value, last, splittheme, splitThemeClass, altButtonClass, dividerTheme, li, o = this.options, $list = this.element, ol = !!$.nodeName($list[0], "ol"), start = $list.attr("start"), itemClassDict = {}, countBubbles = $list.find(".ui-li-count"), countTheme = getAttr($list[0], "counttheme") || this.options.countTheme, countThemeClass = countTheme ? "ui-body-" + countTheme : "ui-body-inherit";
                for(o.theme && $list.addClass("ui-group-theme-" + o.theme), ol && (start || 0 === start) && (startCount = parseInt(start, 10) - 1, $list.css("counter-reset", "listnumbering " + startCount)), this._beforeListviewRefresh(), pos = 0, numli = (li = this._getChildrenByTagName($list[0], "li", "LI")).length; pos < numli; pos++)item = li.eq(pos), itemClass = "", (create || 0 > item[0].className.search(/\bui-li-static\b|\bui-li-divider\b/)) && (a = this._getChildrenByTagName(item[0], "a", "A"), isDivider = "list-divider" === getAttr(item[0], "role"), value = item.attr("value"), itemTheme = getAttr(item[0], "theme"), a.length && 0 > a[0].className.search(/\bui-btn\b/) && !isDivider ? (icon = !1 !== (itemIcon = getAttr(item[0], "icon")) && (itemIcon || o.icon), a.removeClass("ui-link"), buttonClass = "ui-btn", itemTheme && (buttonClass += " ui-btn-" + itemTheme), a.length > 1 ? (itemClass = "ui-li-has-alt", splitThemeClass = (splittheme = getAttr((last = a.last())[0], "theme") || o.splitTheme || getAttr(item[0], "theme", !0)) ? " ui-btn-" + splittheme : "", altButtonClass = "ui-btn ui-btn-icon-notext ui-icon-" + (getAttr(last[0], "icon") || getAttr(item[0], "icon") || o.splitIcon) + splitThemeClass, last.attr("title", $.trim(last.getEncodedText())).addClass(altButtonClass).empty()) : icon && (buttonClass += " ui-btn-icon-right ui-icon-" + icon), a.first().addClass(buttonClass)) : isDivider ? (itemClass = "ui-li-divider ui-bar-" + (getAttr(item[0], "theme") || o.dividerTheme || o.theme || "inherit"), item.attr("role", "heading")) : a.length <= 0 && (itemClass = "ui-li-static ui-body-" + (itemTheme || "inherit")), ol && value && (newStartCount = parseInt(value, 10) - 1, item.css("counter-reset", "listnumbering " + newStartCount))), itemClassDict[itemClass] || (itemClassDict[itemClass] = []), itemClassDict[itemClass].push(item[0]);
                for(itemClass in itemClassDict)$(itemClassDict[itemClass]).addClass(itemClass);
                countBubbles.each(function() {
                    $(this).closest("li").addClass("ui-li-has-count");
                }), countThemeClass && countBubbles.addClass(countThemeClass), this._addThumbClasses(li), this._addThumbClasses(li.find(".ui-btn")), this._afterListviewRefresh(), this._addFirstLastClasses(li, this._getVisibles(li, create), create);
            }
        }, $.mobile.behaviors.addFirstLastClasses));
    }(jQuery), function($, undefined) {
        $.widget("mobile.listview", $.mobile.listview, {
            options: {
                autodividers: !1,
                autodividersSelector: function(elt) {
                    var text = $.trim(elt.text()) || null;
                    return text ? text = text.slice(0, 1).toUpperCase() : null;
                }
            },
            _beforeListviewRefresh: function() {
                this.options.autodividers && (this._replaceDividers(), this._superApply(arguments));
            },
            _replaceDividers: function() {
                var i, lis, li, dividerText, divider, lastDividerText = null, list = this.element;
                for(list.children("li:jqmData(role='list-divider')").remove(), lis = list.children("li"), i = 0; i < lis.length; i++)li = lis[i], (dividerText = this.options.autodividersSelector($(li))) && lastDividerText !== dividerText && ((divider = document1.createElement("li")).appendChild(document1.createTextNode(dividerText)), divider.setAttribute("data-" + $.mobile.ns + "role", "list-divider"), li.parentNode.insertBefore(divider, li)), lastDividerText = dividerText;
            }
        });
    }(jQuery), function($, undefined) {
        var rdivider = /(^|\s)ui-li-divider($|\s)/, rhidden = /(^|\s)ui-screen-hidden($|\s)/;
        $.widget("mobile.listview", $.mobile.listview, {
            options: {
                hideDividers: !1
            },
            _afterListviewRefresh: function() {
                var items, idx, item, hideDivider = !0;
                if (this._superApply(arguments), this.options.hideDividers) for(idx = (items = this._getChildrenByTagName(this.element[0], "li", "LI")).length - 1; idx > -1; idx--)(item = items[idx]).className.match(rdivider) ? (hideDivider && (item.className = item.className + " ui-screen-hidden"), hideDivider = !0) : item.className.match(rhidden) || (hideDivider = !1);
            }
        });
    }(jQuery), jQuery.mobile.nojs = function(target) {
        jQuery(":jqmData(role='nojs')", target).addClass("ui-nojs");
    }, jQuery.mobile.behaviors.formReset = {
        _handleFormReset: function() {
            this._on(this.element.closest("form"), {
                reset: function() {
                    this._delay("_reset");
                }
            });
        }
    }, function($, undefined) {
        var escapeId = $.mobile.path.hashToSelector;
        $.widget("mobile.checkboxradio", $.extend({
            initSelector: "input:not( :jqmData(role='flipswitch' ) )[type='checkbox'],input[type='radio']:not( :jqmData(role='flipswitch' ))",
            options: {
                theme: "inherit",
                mini: !1,
                wrapperClass: null,
                enhanced: !1,
                iconpos: "left"
            },
            _create: function() {
                var input = this.element, o = this.options, inheritAttr = function(input, dataAttr) {
                    return input.jqmData(dataAttr) || input.closest("form, fieldset").jqmData(dataAttr);
                }, parentLabel = input.closest("label"), label = parentLabel.length ? parentLabel : input.closest("form, fieldset, :jqmData(role='page'), :jqmData(role='dialog')").find("label").filter("[for='" + escapeId(input[0].id) + "']").first(), inputtype = input[0].type;
                ("checkbox" === inputtype || "radio" === inputtype) && (this.element[0].disabled && (this.options.disabled = !0), o.iconpos = inheritAttr(input, "iconpos") || label.attr("data-" + $.mobile.ns + "iconpos") || o.iconpos, o.mini = inheritAttr(input, "mini") || o.mini, $.extend(this, {
                    input: input,
                    label: label,
                    parentLabel: parentLabel,
                    inputtype: inputtype,
                    checkedClass: "ui-" + inputtype + "-on",
                    uncheckedClass: "ui-" + inputtype + "-off"
                }), this.options.enhanced || this._enhance(), this._on(label, {
                    vmouseover: "_handleLabelVMouseOver",
                    vclick: "_handleLabelVClick"
                }), this._on(input, {
                    vmousedown: "_cacheVals",
                    vclick: "_handleInputVClick",
                    focus: "_handleInputFocus",
                    blur: "_handleInputBlur"
                }), this._handleFormReset(), this.refresh());
            },
            _enhance: function() {
                this.label.addClass("ui-btn ui-corner-all"), this.parentLabel.length > 0 ? this.input.add(this.label).wrapAll(this._wrapper()) : (this.element.wrap(this._wrapper()), this.element.parent().prepend(this.label)), this._setOptions({
                    theme: this.options.theme,
                    iconpos: this.options.iconpos,
                    mini: this.options.mini
                });
            },
            _wrapper: function() {
                return $("<div class='" + (this.options.wrapperClass ? this.options.wrapperClass : "") + " ui-" + this.inputtype + (this.options.disabled ? " ui-state-disabled" : "") + "' ></div>");
            },
            _handleInputFocus: function() {
                this.label.addClass($.mobile.focusClass);
            },
            _handleInputBlur: function() {
                this.label.removeClass($.mobile.focusClass);
            },
            _handleInputVClick: function() {
                this.element.prop("checked", this.element.is(":checked")), this._getInputSet().not(this.element).prop("checked", !1), this._updateAll();
            },
            _handleLabelVMouseOver: function(event1) {
                this.label.parent().hasClass("ui-state-disabled") && event1.stopPropagation();
            },
            _handleLabelVClick: function(event1) {
                var input = this.element;
                if (input.is(":disabled")) {
                    event1.preventDefault();
                    return;
                }
                return this._cacheVals(), input.prop("checked", "radio" === this.inputtype || !input.prop("checked")), input.triggerHandler("click"), this._getInputSet().not(input).prop("checked", !1), this._updateAll(), !1;
            },
            _cacheVals: function() {
                this._getInputSet().each(function() {
                    $(this).attr("data-" + $.mobile.ns + "cacheVal", this.checked);
                });
            },
            _getInputSet: function() {
                var selector, formId, radio = this.element[0], name = radio.name, form = radio.form, doc = this.element.parents().last().get(0), radios = this.element;
                return name && "radio" === this.inputtype && doc && (selector = "input[type='radio'][name='" + escapeId(name) + "']", form ? ((formId = form.id) && (radios = $(selector + "[form='" + escapeId(formId) + "']", doc)), radios = $(form).find(selector).filter(function() {
                    return this.form === form;
                }).add(radios)) : radios = $(selector, doc).filter(function() {
                    return !this.form;
                })), radios;
            },
            _updateAll: function() {
                var self = this;
                this._getInputSet().each(function() {
                    var $this = $(this);
                    (this.checked || "checkbox" === self.inputtype) && $this.trigger("change");
                }).checkboxradio("refresh");
            },
            _reset: function() {
                this.refresh();
            },
            _hasIcon: function() {
                var controlgroup, controlgroupWidget, controlgroupConstructor = $.mobile.controlgroup;
                return !controlgroupConstructor || !((controlgroup = this.element.closest(":mobile-controlgroup," + controlgroupConstructor.prototype.initSelector)).length > 0) || ((controlgroupWidget = $.data(controlgroup[0], "mobile-controlgroup")) ? controlgroupWidget.options.type : controlgroup.attr("data-" + $.mobile.ns + "type")) !== "horizontal";
            },
            refresh: function() {
                var hasIcon = this._hasIcon(), isChecked = this.element[0].checked, active = $.mobile.activeBtnClass, iconposClass = "ui-btn-icon-" + this.options.iconpos, addClasses = [], removeClasses = [];
                hasIcon ? (removeClasses.push(active), addClasses.push(iconposClass)) : (removeClasses.push(iconposClass), (isChecked ? addClasses : removeClasses).push(active)), isChecked ? (addClasses.push(this.checkedClass), removeClasses.push(this.uncheckedClass)) : (addClasses.push(this.uncheckedClass), removeClasses.push(this.checkedClass)), this.label.addClass(addClasses.join(" ")).removeClass(removeClasses.join(" "));
            },
            widget: function() {
                return this.label.parent();
            },
            _setOptions: function(options) {
                var label = this.label, currentOptions = this.options, outer = this.widget(), hasIcon = this._hasIcon();
                void 0 !== options.disabled && (this.input.prop("disabled", !!options.disabled), outer.toggleClass("ui-state-disabled", !!options.disabled)), void 0 !== options.mini && outer.toggleClass("ui-mini", !!options.mini), options.theme !== undefined && label.removeClass("ui-btn-" + currentOptions.theme).addClass("ui-btn-" + options.theme), options.wrapperClass !== undefined && outer.removeClass(currentOptions.wrapperClass).addClass(options.wrapperClass), options.iconpos !== undefined && hasIcon ? label.removeClass("ui-btn-icon-" + currentOptions.iconpos).addClass("ui-btn-icon-" + options.iconpos) : hasIcon || label.removeClass("ui-btn-icon-" + currentOptions.iconpos), this._super(options);
            }
        }, $.mobile.behaviors.formReset));
    }(jQuery), function($, undefined) {
        $.widget("mobile.button", {
            initSelector: "input[type='button'], input[type='submit'], input[type='reset']",
            options: {
                theme: null,
                icon: null,
                iconpos: "left",
                iconshadow: !1,
                corners: !0,
                shadow: !0,
                inline: null,
                mini: null,
                wrapperClass: null,
                enhanced: !1
            },
            _create: function() {
                this.element.is(":disabled") && (this.options.disabled = !0), this.options.enhanced || this._enhance(), $.extend(this, {
                    wrapper: this.element.parent()
                }), this._on({
                    focus: function() {
                        this.widget().addClass($.mobile.focusClass);
                    },
                    blur: function() {
                        this.widget().removeClass($.mobile.focusClass);
                    }
                }), this.refresh(!0);
            },
            _enhance: function() {
                this.element.wrap(this._button());
            },
            _button: function() {
                var options = this.options, iconClasses = this._getIconClasses(this.options);
                return $("<div class='ui-btn ui-input-btn" + (options.wrapperClass ? " " + options.wrapperClass : "") + (options.theme ? " ui-btn-" + options.theme : "") + (options.corners ? " ui-corner-all" : "") + (options.shadow ? " ui-shadow" : "") + (options.inline ? " ui-btn-inline" : "") + (options.mini ? " ui-mini" : "") + (options.disabled ? " ui-state-disabled" : "") + (iconClasses ? " " + iconClasses : "") + "' >" + this.element.val() + "</div>");
            },
            widget: function() {
                return this.wrapper;
            },
            _destroy: function() {
                this.element.insertBefore(this.button), this.button.remove();
            },
            _getIconClasses: function(options) {
                return options.icon ? "ui-icon-" + options.icon + (options.iconshadow ? " ui-shadow-icon" : "") + " ui-btn-icon-" + options.iconpos : "";
            },
            _setOptions: function(options) {
                var outer = this.widget();
                void 0 !== options.theme && outer.removeClass(this.options.theme).addClass("ui-btn-" + options.theme), void 0 !== options.corners && outer.toggleClass("ui-corner-all", options.corners), options.shadow !== undefined && outer.toggleClass("ui-shadow", options.shadow), options.inline !== undefined && outer.toggleClass("ui-btn-inline", options.inline), options.mini !== undefined && outer.toggleClass("ui-mini", options.mini), options.disabled !== undefined && (this.element.prop("disabled", options.disabled), outer.toggleClass("ui-state-disabled", options.disabled)), (options.icon !== undefined || options.iconshadow !== undefined || options.iconpos !== undefined) && outer.removeClass(this._getIconClasses(this.options)).addClass(this._getIconClasses($.extend({}, this.options, options))), this._super(options);
            },
            refresh: function(create) {
                var originalElement, isDisabled = this.element.prop("disabled");
                this.options.icon && "notext" === this.options.iconpos && this.element.attr("title") && this.element.attr("title", this.element.val()), create || (originalElement = this.element.detach(), $(this.wrapper).text(this.element.val()).append(originalElement)), this.options.disabled !== isDisabled && this._setOptions({
                    disabled: isDisabled
                });
            }
        });
    }(jQuery), disabledZoom = (initialContent = (meta = jQuery("meta[name=viewport]")).attr("content")) + ",maximum-scale=1, user-scalable=no", enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes", disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(initialContent), jQuery.mobile.zoom = jQuery.extend({}, {
        enabled: !disabledInitially,
        locked: !1,
        disable: function(lock) {
            disabledInitially || jQuery.mobile.zoom.locked || (meta.attr("content", disabledZoom), jQuery.mobile.zoom.enabled = !1, jQuery.mobile.zoom.locked = lock || !1);
        },
        enable: function(unlock) {
            disabledInitially || jQuery.mobile.zoom.locked && !0 !== unlock || (meta.attr("content", enabledZoom), jQuery.mobile.zoom.enabled = !0, jQuery.mobile.zoom.locked = !1);
        },
        restore: function() {
            disabledInitially || (meta.attr("content", initialContent), jQuery.mobile.zoom.enabled = !0);
        }
    }), function($, undefined) {
        $.widget("mobile.textinput", {
            initSelector: "input[type='text'],input[type='search'],:jqmData(type='search'),input[type='number'],:jqmData(type='number'),input[type='password'],input[type='email'],input[type='url'],input[type='tel'],textarea,input[type='time'],input[type='date'],input[type='month'],input[type='week'],input[type='datetime'],input[type='datetime-local'],input[type='color'],input:not([type]),input[type='file']",
            options: {
                theme: null,
                corners: !0,
                mini: !1,
                preventFocusZoom: /iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1,
                wrapperClass: "",
                enhanced: !1
            },
            _create: function() {
                var options = this.options, isSearch = this.element.is("[type='search'], :jqmData(type='search')"), isTextarea = "TEXTAREA" === this.element[0].tagName, isRange = this.element.is("[data-" + ($.mobile.ns || "") + "type='range']"), inputNeedsWrap = (this.element.is("input") || this.element.is("[data-" + ($.mobile.ns || "") + "type='search']")) && !isRange;
                this.element.prop("disabled") && (options.disabled = !0), $.extend(this, {
                    classes: this._classesFromOptions(),
                    isSearch: isSearch,
                    isTextarea: isTextarea,
                    isRange: isRange,
                    inputNeedsWrap: inputNeedsWrap
                }), this._autoCorrect(), options.enhanced || this._enhance(), this._on({
                    focus: "_handleFocus",
                    blur: "_handleBlur"
                });
            },
            refresh: function() {
                this.setOptions({
                    disabled: this.element.is(":disabled")
                });
            },
            _enhance: function() {
                var elementClasses = [];
                this.isTextarea && elementClasses.push("ui-input-text"), (this.isTextarea || this.isRange) && elementClasses.push("ui-shadow-inset"), this.inputNeedsWrap ? this.element.wrap(this._wrap()) : elementClasses = elementClasses.concat(this.classes), this.element.addClass(elementClasses.join(" "));
            },
            widget: function() {
                return this.inputNeedsWrap ? this.element.parent() : this.element;
            },
            _classesFromOptions: function() {
                var options = this.options, classes = [];
                return classes.push("ui-body-" + (null === options.theme ? "inherit" : options.theme)), options.corners && classes.push("ui-corner-all"), options.mini && classes.push("ui-mini"), options.disabled && classes.push("ui-state-disabled"), options.wrapperClass && classes.push(options.wrapperClass), classes;
            },
            _wrap: function() {
                return $("<div class='" + (this.isSearch ? "ui-input-search " : "ui-input-text ") + this.classes.join(" ") + " ui-shadow-inset'></div>");
            },
            _autoCorrect: function() {
                void 0 === this.element[0].autocorrect || $.support.touchOverflow || (this.element[0].setAttribute("autocorrect", "off"), this.element[0].setAttribute("autocomplete", "off"));
            },
            _handleBlur: function() {
                this.widget().removeClass($.mobile.focusClass), this.options.preventFocusZoom && $.mobile.zoom.enable(!0);
            },
            _handleFocus: function() {
                this.options.preventFocusZoom && $.mobile.zoom.disable(!0), this.widget().addClass($.mobile.focusClass);
            },
            _setOptions: function(options) {
                var outer = this.widget();
                this._super(options), void 0 === options.disabled && void 0 === options.mini && options.corners === undefined && options.theme === undefined && options.wrapperClass === undefined || (outer.removeClass(this.classes.join(" ")), this.classes = this._classesFromOptions(), outer.addClass(this.classes.join(" "))), options.disabled !== undefined && this.element.prop("disabled", !!options.disabled);
            },
            _destroy: function() {
                !this.options.enhanced && (this.inputNeedsWrap && this.element.unwrap(), this.element.removeClass("ui-input-text " + this.classes.join(" ")));
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.slider", $.extend({
            initSelector: "input[type='range'], :jqmData(type='range'), :jqmData(role='slider')",
            widgetEventPrefix: "slide",
            options: {
                theme: null,
                trackTheme: null,
                corners: !0,
                mini: !1,
                highlight: !1
            },
            _create: function() {
                var bg, options, wrapper, j, length, i, optionsCount, origTabIndex, side, activeClass, sliderImg, control = this.element, trackTheme = this.options.trackTheme || $.mobile.getAttribute(control[0], "theme"), cornerClass = this.options.corners || control.jqmData("corners") ? " ui-corner-all" : "", miniClass = this.options.mini || control.jqmData("mini") ? " ui-mini" : "", cType = control[0].nodeName.toLowerCase(), isToggleSwitch = "select" === cType, isRangeslider = control.parent().is(":jqmData(role='rangeslider')"), controlID = control.attr("id"), $label = $("[for='" + controlID + "']"), labelID = $label.attr("id") || controlID + "-label", min = isToggleSwitch ? 0 : parseFloat(control.attr("min")), max = isToggleSwitch ? control.find("option").length - 1 : parseFloat(control.attr("max")), step = window.parseFloat(control.attr("step") || 1), domHandle = document1.createElement("a"), handle = $(domHandle), domSlider = document1.createElement("div"), slider = $(domSlider), valuebg = !!this.options.highlight && !isToggleSwitch && ((bg = document1.createElement("div")).className = "ui-slider-bg " + $.mobile.activeBtnClass, $(bg).prependTo(slider));
                if ($label.attr("id", labelID), this.isToggleSwitch = isToggleSwitch, domHandle.setAttribute("href", "#"), domSlider.setAttribute("role", "application"), domSlider.className = [
                    this.isToggleSwitch ? "ui-slider ui-slider-track ui-shadow-inset " : "ui-slider-track ui-shadow-inset ",
                    isToggleSwitch ? "ui-slider-switch" : "",
                    trackTheme ? " ui-bar-" + trackTheme : " ui-bar-inherit",
                    cornerClass,
                    miniClass
                ].join(""), domHandle.className = "ui-slider-handle", domSlider.appendChild(domHandle), handle.attr({
                    role: "slider",
                    "aria-valuemin": min,
                    "aria-valuemax": max,
                    "aria-valuenow": this._value(),
                    "aria-valuetext": this._value(),
                    title: this._value(),
                    "aria-labelledby": labelID
                }), $.extend(this, {
                    slider: slider,
                    handle: handle,
                    control: control,
                    type: cType,
                    step: step,
                    max: max,
                    min: min,
                    valuebg: valuebg,
                    isRangeslider: isRangeslider,
                    dragging: !1,
                    beforeStart: null,
                    userModified: !1,
                    mouseMoved: !1
                }), isToggleSwitch) {
                    for((origTabIndex = control.attr("tabindex")) && handle.attr("tabindex", origTabIndex), control.attr("tabindex", "-1").focus(function() {
                        $(this).blur(), handle.focus();
                    }), (wrapper = document1.createElement("div")).className = "ui-slider-inneroffset", j = 0, length = domSlider.childNodes.length; j < length; j++)wrapper.appendChild(domSlider.childNodes[j]);
                    for(domSlider.appendChild(wrapper), handle.addClass("ui-slider-handle-snapping"), i = 0, optionsCount = (options = control.find("option")).length; i < optionsCount; i++)side = i ? "a" : "b", activeClass = i ? " " + $.mobile.activeBtnClass : "", (sliderImg = document1.createElement("span")).className = [
                        "ui-slider-label ui-slider-label-",
                        side,
                        activeClass
                    ].join(""), sliderImg.setAttribute("role", "img"), sliderImg.appendChild(document1.createTextNode(options[i].innerHTML)), $(sliderImg).prependTo(slider);
                    this._labels = $(".ui-slider-label", slider);
                }
                control.addClass(isToggleSwitch ? "ui-slider-switch" : "ui-slider-input"), this._on(control, {
                    change: "_controlChange",
                    keyup: "_controlKeyup",
                    blur: "_controlBlur",
                    vmouseup: "_controlVMouseUp"
                }), slider.bind("vmousedown", $.proxy(this._sliderVMouseDown, this)).bind("vclick", !1), this._on(document1, {
                    vmousemove: "_preventDocumentDrag"
                }), this._on(slider.add(document1), {
                    vmouseup: "_sliderVMouseUp"
                }), slider.insertAfter(control), isToggleSwitch || isRangeslider || (wrapper = this.options.mini ? "<div class='ui-slider ui-mini'>" : "<div class='ui-slider'>", control.add(slider).wrapAll(wrapper)), this._on(this.handle, {
                    vmousedown: "_handleVMouseDown",
                    keydown: "_handleKeydown",
                    keyup: "_handleKeyup"
                }), this.handle.bind("vclick", !1), this._handleFormReset(), this.refresh(void 0, void 0, !0);
            },
            _setOptions: function(options) {
                options.theme !== undefined && this._setTheme(options.theme), options.trackTheme !== undefined && this._setTrackTheme(options.trackTheme), options.corners !== undefined && this._setCorners(options.corners), options.mini !== undefined && this._setMini(options.mini), options.highlight !== undefined && this._setHighlight(options.highlight), options.disabled !== undefined && this._setDisabled(options.disabled), this._super(options);
            },
            _controlChange: function(event1) {
                if (!1 === this._trigger("controlchange", event1)) return !1;
                this.mouseMoved || this.refresh(this._value(), !0);
            },
            _controlKeyup: function() {
                this.refresh(this._value(), !0, !0);
            },
            _controlBlur: function() {
                this.refresh(this._value(), !0);
            },
            _controlVMouseUp: function() {
                this._checkedRefresh();
            },
            _handleVMouseDown: function() {
                this.handle.focus();
            },
            _handleKeydown: function(event1) {
                var index = this._value();
                if (!this.options.disabled) {
                    switch(event1.keyCode){
                        case $.mobile.keyCode.HOME:
                        case $.mobile.keyCode.END:
                        case $.mobile.keyCode.PAGE_UP:
                        case $.mobile.keyCode.PAGE_DOWN:
                        case $.mobile.keyCode.UP:
                        case $.mobile.keyCode.RIGHT:
                        case $.mobile.keyCode.DOWN:
                        case $.mobile.keyCode.LEFT:
                            event1.preventDefault(), this._keySliding || (this._keySliding = !0, this.handle.addClass("ui-state-active"));
                    }
                    switch(event1.keyCode){
                        case $.mobile.keyCode.HOME:
                            this.refresh(this.min);
                            break;
                        case $.mobile.keyCode.END:
                            this.refresh(this.max);
                            break;
                        case $.mobile.keyCode.PAGE_UP:
                        case $.mobile.keyCode.UP:
                        case $.mobile.keyCode.RIGHT:
                            this.refresh(index + this.step);
                            break;
                        case $.mobile.keyCode.PAGE_DOWN:
                        case $.mobile.keyCode.DOWN:
                        case $.mobile.keyCode.LEFT:
                            this.refresh(index - this.step);
                    }
                }
            },
            _handleKeyup: function() {
                this._keySliding && (this._keySliding = !1, this.handle.removeClass("ui-state-active"));
            },
            _sliderVMouseDown: function(event1) {
                return !this.options.disabled && !!(1 === event1.which || 0 === event1.which || event1.which === undefined) && !1 !== this._trigger("beforestart", event1) && (this.dragging = !0, this.userModified = !1, this.mouseMoved = !1, this.isToggleSwitch && (this.beforeStart = this.element[0].selectedIndex), this.refresh(event1), this._trigger("start"), !1);
            },
            _sliderVMouseUp: function() {
                if (this.dragging) return this.dragging = !1, this.isToggleSwitch && (this.handle.addClass("ui-slider-handle-snapping"), this.mouseMoved ? this.userModified ? this.refresh(0 === this.beforeStart ? 1 : 0) : this.refresh(this.beforeStart) : this.refresh(0 === this.beforeStart ? 1 : 0)), this.mouseMoved = !1, this._trigger("stop"), !1;
            },
            _preventDocumentDrag: function(event1) {
                return !1 !== this._trigger("drag", event1) && (this.dragging && !this.options.disabled ? (this.mouseMoved = !0, this.isToggleSwitch && this.handle.removeClass("ui-slider-handle-snapping"), this.refresh(event1), this.userModified = this.beforeStart !== this.element[0].selectedIndex, !1) : void 0);
            },
            _checkedRefresh: function() {
                this.value !== this._value() && this.refresh(this._value());
            },
            _value: function() {
                return this.isToggleSwitch ? this.element[0].selectedIndex : parseFloat(this.element.val());
            },
            _reset: function() {
                this.refresh(undefined, !1, !0);
            },
            refresh: function(val, isfromControl, preventInputUpdate) {
                var bg, left, width, data, pxStep, percent, control, isInput, optionElements, min, max, step, newval, valModStep, alignValue, percentPerStep, handlePercent, aPercent, bPercent, valueChanged, parentTheme = $.mobile.getAttribute(this.element[0], "theme"), theme = this.options.theme || parentTheme, trackTheme = this.options.trackTheme || parentTheme, cornerClass = this.options.corners ? " ui-corner-all" : "", miniClass = this.options.mini ? " ui-mini" : "";
                if (this.slider[0].className = [
                    this.isToggleSwitch ? "ui-slider ui-slider-switch ui-slider-track ui-shadow-inset" : "ui-slider-track ui-shadow-inset",
                    trackTheme ? " ui-bar-" + trackTheme : " ui-bar-inherit",
                    cornerClass,
                    miniClass
                ].join(""), (this.options.disabled || this.element.prop("disabled")) && this.disable(), this.value = this._value(), this.options.highlight && !this.isToggleSwitch && 0 === this.slider.find(".ui-slider-bg").length && (this.valuebg = ((bg = document1.createElement("div")).className = "ui-slider-bg " + $.mobile.activeBtnClass, $(bg).prependTo(this.slider))), this.handle.addClass("ui-btn" + (theme ? " ui-btn-" + theme : "") + " ui-shadow"), control = this.element, optionElements = (isInput = !this.isToggleSwitch) ? [] : control.find("option"), min = isInput ? parseFloat(control.attr("min")) : 0, max = isInput ? parseFloat(control.attr("max")) : optionElements.length - 1, step = isInput && parseFloat(control.attr("step")) > 0 ? parseFloat(control.attr("step")) : 1, "object" == typeof val) {
                    if (data = val, left = this.slider.offset().left, pxStep = (width = this.slider.width()) / ((max - min) / step), !this.dragging || data.pageX < left - 8 || data.pageX > left + width + 8) return;
                    percent = pxStep > 1 ? (data.pageX - left) / width * 100 : Math.round((data.pageX - left) / width * 100);
                } else null == val && (val = isInput ? parseFloat(control.val() || 0) : control[0].selectedIndex), percent = (parseFloat(val) - min) / (max - min) * 100;
                if (!isNaN(percent) && (valModStep = ((newval = percent / 100 * (max - min) + min) - min) % step, alignValue = newval - valModStep, 2 * Math.abs(valModStep) >= step && (alignValue += valModStep > 0 ? step : -step), percentPerStep = 100 / ((max - min) / step), newval = parseFloat(alignValue.toFixed(5)), void 0 === pxStep && (pxStep = width / ((max - min) / step)), pxStep > 1 && isInput && (percent = (newval - min) * percentPerStep * (1 / step)), percent < 0 && (percent = 0), percent > 100 && (percent = 100), newval < min && (newval = min), newval > max && (newval = max), this.handle.css("left", percent + "%"), this.handle[0].setAttribute("aria-valuenow", isInput ? newval : optionElements.eq(newval).attr("value")), this.handle[0].setAttribute("aria-valuetext", isInput ? newval : optionElements.eq(newval).getEncodedText()), this.handle[0].setAttribute("title", isInput ? newval : optionElements.eq(newval).getEncodedText()), this.valuebg && this.valuebg.css("width", percent + "%"), this._labels && (handlePercent = this.handle.width() / this.slider.width() * 100, aPercent = percent && handlePercent + (100 - handlePercent) * percent / 100, bPercent = 100 === percent ? 0 : Math.min(handlePercent + 100 - aPercent, 100), this._labels.each(function() {
                    var ab = $(this).hasClass("ui-slider-label-a");
                    $(this).width((ab ? aPercent : bPercent) + "%");
                })), !preventInputUpdate)) {
                    if (valueChanged = !1, isInput ? (valueChanged = control.val() !== newval, control.val(newval)) : (valueChanged = control[0].selectedIndex !== newval, control[0].selectedIndex = newval), !1 === this._trigger("beforechange", val)) return !1;
                    !isfromControl && valueChanged && control.trigger("change");
                }
            },
            _setHighlight: function(value) {
                (value = !!value) ? (this.options.highlight = !!value, this.refresh()) : this.valuebg && (this.valuebg.remove(), this.valuebg = !1);
            },
            _setTheme: function(value) {
                this.handle.removeClass("ui-btn-" + this.options.theme).addClass("ui-btn-" + value);
                var currentTheme = this.options.theme ? this.options.theme : "inherit";
                this.control.removeClass("ui-body-" + currentTheme).addClass("ui-body-" + (value || "inherit"));
            },
            _setTrackTheme: function(value) {
                var currentTrackTheme = this.options.trackTheme ? this.options.trackTheme : "inherit";
                this.slider.removeClass("ui-body-" + currentTrackTheme).addClass("ui-body-" + (value || "inherit"));
            },
            _setMini: function(value) {
                value = !!value, this.isToggleSwitch || this.isRangeslider || (this.slider.parent().toggleClass("ui-mini", value), this.element.toggleClass("ui-mini", value)), this.slider.toggleClass("ui-mini", value);
            },
            _setCorners: function(value) {
                this.slider.toggleClass("ui-corner-all", value), this.isToggleSwitch || this.control.toggleClass("ui-corner-all", value);
            },
            _setDisabled: function(value) {
                value = !!value, this.element.prop("disabled", value), this.slider.toggleClass("ui-state-disabled", value).attr("aria-disabled", value);
            }
        }, $.mobile.behaviors.formReset));
    }(jQuery), function($, undefined) {
        var popup;
        $.widget("mobile.slider", $.mobile.slider, {
            options: {
                popupEnabled: !1,
                showValue: !1
            },
            _create: function() {
                this._super(), $.extend(this, {
                    _currentValue: null,
                    _popup: null,
                    _popupVisible: !1
                }), this._setOption("popupEnabled", this.options.popupEnabled), this._on(this.handle, {
                    vmousedown: "_showPopup"
                }), this._on(this.slider.add(this.document), {
                    vmouseup: "_hidePopup"
                }), this._refresh();
            },
            _positionPopup: function() {
                var dstOffset = this.handle.offset();
                this._popup.offset({
                    left: dstOffset.left + (this.handle.width() - this._popup.width()) / 2,
                    top: dstOffset.top - this._popup.outerHeight() - 5
                });
            },
            _setOption: function(key, value) {
                this._super(key, value), "showValue" === key ? this.handle.html(value && !this.options.mini ? this._value() : "") : "popupEnabled" === key && value && !this._popup && (this._popup = (popup || (popup = $("<div></div>", {
                    class: "ui-slider-popup ui-shadow ui-corner-all"
                })), popup.clone()).addClass("ui-body-" + (this.options.theme || "a")).hide().insertBefore(this.element));
            },
            refresh: function() {
                this._super.apply(this, arguments), this._refresh();
            },
            _refresh: function() {
                var newValue, o = this.options;
                o.popupEnabled && this.handle.removeAttr("title"), (newValue = this._value()) !== this._currentValue && (this._currentValue = newValue, o.popupEnabled && this._popup ? (this._positionPopup(), this._popup.html(newValue)) : o.showValue && !this.options.mini && this.handle.html(newValue));
            },
            _showPopup: function() {
                this.options.popupEnabled && !this._popupVisible && (this.handle.html(""), this._popup.show(), this._positionPopup(), this._popupVisible = !0);
            },
            _hidePopup: function() {
                var o = this.options;
                o.popupEnabled && this._popupVisible && (o.showValue && !o.mini && this.handle.html(this._value()), this._popup.hide(), this._popupVisible = !1);
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.flipswitch", $.extend({
            options: {
                onText: "On",
                offText: "Off",
                theme: null,
                enhanced: !1,
                wrapperClass: null,
                corners: !0,
                mini: !1
            },
            _create: function() {
                this.options.enhanced ? $.extend(this, {
                    flipswitch: this.element.parent(),
                    on: this.element.find(".ui-flipswitch-on").eq(0),
                    off: this.element.find(".ui-flipswitch-off").eq(0),
                    type: this.element.get(0).tagName
                }) : this._enhance(), this._handleFormReset(), this._originalTabIndex = this.element.attr("tabindex"), null != this._originalTabIndex && this.on.attr("tabindex", this._originalTabIndex), this.element.attr("tabindex", "-1"), this._on({
                    focus: "_handleInputFocus"
                }), this.element.is(":disabled") && this._setOptions({
                    disabled: !0
                }), this._on(this.flipswitch, {
                    click: "_toggle",
                    swipeleft: "_left",
                    swiperight: "_right"
                }), this._on(this.on, {
                    keydown: "_keydown"
                }), this._on({
                    change: "refresh"
                });
            },
            _handleInputFocus: function() {
                this.on.focus();
            },
            widget: function() {
                return this.flipswitch;
            },
            _left: function() {
                this.flipswitch.removeClass("ui-flipswitch-active"), "SELECT" === this.type ? this.element.get(0).selectedIndex = 0 : this.element.prop("checked", !1), this.element.trigger("change");
            },
            _right: function() {
                this.flipswitch.addClass("ui-flipswitch-active"), "SELECT" === this.type ? this.element.get(0).selectedIndex = 1 : this.element.prop("checked", !0), this.element.trigger("change");
            },
            _enhance: function() {
                var flipswitch = $("<div>"), options = this.options, element = this.element, theme = options.theme ? options.theme : "inherit", on = $("<a></a>", {
                    href: "#"
                }), off = $("<span></span>"), type = element.get(0).tagName, onText = "INPUT" === type ? options.onText : element.find("option").eq(1).text(), offText = "INPUT" === type ? options.offText : element.find("option").eq(0).text();
                on.addClass("ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit").text(onText), off.addClass("ui-flipswitch-off").text(offText), flipswitch.addClass("ui-flipswitch ui-shadow-inset ui-bar-" + theme + " " + (options.wrapperClass ? options.wrapperClass : "") + " " + (element.is(":checked") || element.find("option").eq(1).is(":selected") ? "ui-flipswitch-active" : "") + (element.is(":disabled") ? " ui-state-disabled" : "") + (options.corners ? " ui-corner-all" : "") + (options.mini ? " ui-mini" : "")).append(on, off), element.addClass("ui-flipswitch-input").after(flipswitch).appendTo(flipswitch), $.extend(this, {
                    flipswitch: flipswitch,
                    on: on,
                    off: off,
                    type: type
                });
            },
            _reset: function() {
                this.refresh();
            },
            refresh: function() {
                var direction, existingDirection = this.flipswitch.hasClass("ui-flipswitch-active") ? "_right" : "_left";
                (direction = "SELECT" === this.type ? this.element.get(0).selectedIndex > 0 ? "_right" : "_left" : this.element.prop("checked") ? "_right" : "_left") !== existingDirection && this[direction]();
            },
            _toggle: function() {
                this[this.flipswitch.hasClass("ui-flipswitch-active") ? "_left" : "_right"]();
            },
            _keydown: function(e) {
                e.which === $.mobile.keyCode.LEFT ? this._left() : e.which === $.mobile.keyCode.RIGHT ? this._right() : e.which === $.mobile.keyCode.SPACE && (this._toggle(), e.preventDefault());
            },
            _setOptions: function(options) {
                if (void 0 !== options.theme) {
                    var currentTheme = options.theme ? options.theme : "inherit", newTheme = options.theme ? options.theme : "inherit";
                    this.widget().removeClass("ui-bar-" + currentTheme).addClass("ui-bar-" + newTheme);
                }
                void 0 !== options.onText && this.on.text(options.onText), options.offText !== undefined && this.off.text(options.offText), options.disabled !== undefined && this.widget().toggleClass("ui-state-disabled", options.disabled), options.mini !== undefined && this.widget().toggleClass("ui-mini", options.mini), options.corners !== undefined && this.widget().toggleClass("ui-corner-all", options.corners), this._super(options);
            },
            _destroy: function() {
                !this.options.enhanced && (null != this._originalTabIndex ? this.element.attr("tabindex", this._originalTabIndex) : this.element.removeAttr("tabindex"), this.on.remove(), this.off.remove(), this.element.unwrap(), this.flipswitch.remove(), this.removeClass("ui-flipswitch-input"));
            }
        }, $.mobile.behaviors.formReset));
    }(jQuery), function($, undefined) {
        $.widget("mobile.rangeslider", $.extend({
            options: {
                theme: null,
                trackTheme: null,
                corners: !0,
                mini: !1,
                highlight: !0
            },
            _create: function() {
                var $el = this.element, elClass = this.options.mini ? "ui-rangeslider ui-mini" : "ui-rangeslider", _inputFirst = $el.find("input").first(), _inputLast = $el.find("input").last(), _label = $el.find("label").first(), _sliderWidgetFirst = $.data(_inputFirst.get(0), "mobile-slider") || $.data(_inputFirst.slider().get(0), "mobile-slider"), _sliderWidgetLast = $.data(_inputLast.get(0), "mobile-slider") || $.data(_inputLast.slider().get(0), "mobile-slider"), _sliderFirst = _sliderWidgetFirst.slider, _sliderLast = _sliderWidgetLast.slider, firstHandle = _sliderWidgetFirst.handle, _sliders = $("<div class='ui-rangeslider-sliders' />").appendTo($el);
                _inputFirst.addClass("ui-rangeslider-first"), _inputLast.addClass("ui-rangeslider-last"), $el.addClass(elClass), _sliderFirst.appendTo(_sliders), _sliderLast.appendTo(_sliders), _label.insertBefore($el), firstHandle.prependTo(_sliderLast), $.extend(this, {
                    _inputFirst: _inputFirst,
                    _inputLast: _inputLast,
                    _sliderFirst: _sliderFirst,
                    _sliderLast: _sliderLast,
                    _label: _label,
                    _targetVal: null,
                    _sliderTarget: !1,
                    _sliders: _sliders,
                    _proxy: !1
                }), this.refresh(), this._on(this.element.find("input.ui-slider-input"), {
                    slidebeforestart: "_slidebeforestart",
                    slidestop: "_slidestop",
                    slidedrag: "_slidedrag",
                    slidebeforechange: "_change",
                    blur: "_change",
                    keyup: "_change"
                }), this._on({
                    mousedown: "_change"
                }), this._on(this.element.closest("form"), {
                    reset: "_handleReset"
                }), this._on(firstHandle, {
                    vmousedown: "_dragFirstHandle"
                });
            },
            _handleReset: function() {
                var self = this;
                setTimeout(function() {
                    self._updateHighlight();
                }, 0);
            },
            _dragFirstHandle: function(event1) {
                return $.data(this._inputFirst.get(0), "mobile-slider").dragging = !0, $.data(this._inputFirst.get(0), "mobile-slider").refresh(event1), !1;
            },
            _slidedrag: function(event1) {
                var first = $(event1.target).is(this._inputFirst), otherSlider = first ? this._inputLast : this._inputFirst;
                if (this._sliderTarget = !1, "first" === this._proxy && first || "last" === this._proxy && !first) return $.data(otherSlider.get(0), "mobile-slider").dragging = !0, $.data(otherSlider.get(0), "mobile-slider").refresh(event1), !1;
            },
            _slidestop: function(event1) {
                var first = $(event1.target).is(this._inputFirst);
                this._proxy = !1, this.element.find("input").trigger("vmouseup"), this._sliderFirst.css("z-index", first ? 1 : "");
            },
            _slidebeforestart: function(event1) {
                this._sliderTarget = !1, $(event1.originalEvent.target).hasClass("ui-slider-track") && (this._sliderTarget = !0, this._targetVal = $(event1.target).val());
            },
            _setOptions: function(options) {
                void 0 !== options.theme && this._setTheme(options.theme), void 0 !== options.trackTheme && this._setTrackTheme(options.trackTheme), options.mini !== undefined && this._setMini(options.mini), options.highlight !== undefined && this._setHighlight(options.highlight), this._super(options), this.refresh();
            },
            refresh: function() {
                var $el = this.element, o = this.options;
                (this._inputFirst.is(":disabled") || this._inputLast.is(":disabled")) && (this.options.disabled = !0), $el.find("input").slider({
                    theme: o.theme,
                    trackTheme: o.trackTheme,
                    disabled: o.disabled,
                    corners: o.corners,
                    mini: o.mini,
                    highlight: o.highlight
                }).slider("refresh"), this._updateHighlight();
            },
            _change: function(event1) {
                if ("keyup" === event1.type) return this._updateHighlight(), !1;
                var self = this, min = parseFloat(this._inputFirst.val(), 10), max = parseFloat(this._inputLast.val(), 10), first = $(event1.target).hasClass("ui-rangeslider-first"), thisSlider = first ? this._inputFirst : this._inputLast, otherSlider = first ? this._inputLast : this._inputFirst;
                if (this._inputFirst.val() > this._inputLast.val() && "mousedown" === event1.type && !$(event1.target).hasClass("ui-slider-handle")) thisSlider.blur();
                else if ("mousedown" === event1.type) return;
                if (min > max && !this._sliderTarget ? (thisSlider.val(first ? max : min).slider("refresh"), this._trigger("normalize")) : min > max && (thisSlider.val(this._targetVal).slider("refresh"), setTimeout(function() {
                    otherSlider.val(first ? min : max).slider("refresh"), $.data(otherSlider.get(0), "mobile-slider").handle.focus(), self._sliderFirst.css("z-index", first ? "" : 1), self._trigger("normalize");
                }, 0), this._proxy = first ? "first" : "last"), min === max ? ($.data(thisSlider.get(0), "mobile-slider").handle.css("z-index", 1), $.data(otherSlider.get(0), "mobile-slider").handle.css("z-index", 0)) : ($.data(otherSlider.get(0), "mobile-slider").handle.css("z-index", ""), $.data(thisSlider.get(0), "mobile-slider").handle.css("z-index", "")), this._updateHighlight(), min >= max) return !1;
            },
            _updateHighlight: function() {
                var min = parseInt($.data(this._inputFirst.get(0), "mobile-slider").handle.get(0).style.left, 10), max = parseInt($.data(this._inputLast.get(0), "mobile-slider").handle.get(0).style.left, 10);
                this.element.find(".ui-slider-bg").css({
                    "margin-left": min + "%",
                    width: max - min + "%"
                });
            },
            _setTheme: function(value) {
                this._inputFirst.slider("option", "theme", value), this._inputLast.slider("option", "theme", value);
            },
            _setTrackTheme: function(value) {
                this._inputFirst.slider("option", "trackTheme", value), this._inputLast.slider("option", "trackTheme", value);
            },
            _setMini: function(value) {
                this._inputFirst.slider("option", "mini", value), this._inputLast.slider("option", "mini", value), this.element.toggleClass("ui-mini", !!value);
            },
            _setHighlight: function(value) {
                this._inputFirst.slider("option", "highlight", value), this._inputLast.slider("option", "highlight", value);
            },
            _destroy: function() {
                this._label.prependTo(this.element), this.element.removeClass("ui-rangeslider ui-mini"), this._inputFirst.after(this._sliderFirst), this._inputLast.after(this._sliderLast), this._sliders.remove(), this.element.find("input").removeClass("ui-rangeslider-first ui-rangeslider-last").slider("destroy");
            }
        }, $.mobile.behaviors.formReset));
    }(jQuery), function($, undefined) {
        $.widget("mobile.textinput", $.mobile.textinput, {
            options: {
                clearBtn: !1,
                clearBtnText: "Clear text"
            },
            _create: function() {
                this._super(), (this.options.clearBtn || this.isSearch) && this._addClearBtn();
            },
            clearButton: function() {
                return $("<a href='#' class='ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all' title='" + this.options.clearBtnText + "'>" + this.options.clearBtnText + "</a>");
            },
            _clearBtnClick: function(event1) {
                this.element.val("").focus().trigger("change"), this._clearBtn.addClass("ui-input-clear-hidden"), event1.preventDefault();
            },
            _addClearBtn: function() {
                this.options.enhanced || this._enhanceClear(), $.extend(this, {
                    _clearBtn: this.widget().find("a.ui-input-clear")
                }), this._bindClearEvents(), this._toggleClear();
            },
            _enhanceClear: function() {
                this.clearButton().appendTo(this.widget()), this.widget().addClass("ui-input-has-clear");
            },
            _bindClearEvents: function() {
                this._on(this._clearBtn, {
                    click: "_clearBtnClick"
                }), this._on({
                    keyup: "_toggleClear",
                    change: "_toggleClear",
                    input: "_toggleClear",
                    focus: "_toggleClear",
                    blur: "_toggleClear",
                    cut: "_toggleClear",
                    paste: "_toggleClear"
                });
            },
            _unbindClear: function() {
                this._off(this._clearBtn, "click"), this._off(this.element, "keyup change input focus blur cut paste");
            },
            _setOptions: function(options) {
                this._super(options), void 0 === options.clearBtn || this.element.is("textarea, :jqmData(type='range')") || (options.clearBtn ? this._addClearBtn() : this._destroyClear()), void 0 !== options.clearBtnText && this._clearBtn !== undefined && this._clearBtn.text(options.clearBtnText).attr("title", options.clearBtnText);
            },
            _toggleClear: function() {
                this._delay("_toggleClearClass", 0);
            },
            _toggleClearClass: function() {
                this._clearBtn.toggleClass("ui-input-clear-hidden", !this.element.val());
            },
            _destroyClear: function() {
                this.widget().removeClass("ui-input-has-clear"), this._unbindClear(), this._clearBtn.remove();
            },
            _destroy: function() {
                this._super(), this._destroyClear();
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.textinput", $.mobile.textinput, {
            options: {
                autogrow: !0,
                keyupTimeoutBuffer: 100
            },
            _create: function() {
                this._super(), this.options.autogrow && this.isTextarea && this._autogrow();
            },
            _autogrow: function() {
                this.element.addClass("ui-textinput-autogrow"), this._on({
                    keyup: "_timeout",
                    change: "_timeout",
                    input: "_timeout",
                    paste: "_timeout"
                }), this._on(!0, this.document, {
                    pageshow: "_handleShow",
                    popupbeforeposition: "_handleShow",
                    updatelayout: "_handleShow",
                    panelopen: "_handleShow"
                });
            },
            _handleShow: function(event1) {
                $.contains(event1.target, this.element[0]) && this.element.is(":visible") && ("popupbeforeposition" !== event1.type && this.element.addClass("ui-textinput-autogrow-resize").animationComplete($.proxy(function() {
                    this.element.removeClass("ui-textinput-autogrow-resize");
                }, this), "transition"), this._timeout());
            },
            _unbindAutogrow: function() {
                this.element.removeClass("ui-textinput-autogrow"), this._off(this.element, "keyup change input paste"), this._off(this.document, "pageshow popupbeforeposition updatelayout panelopen");
            },
            keyupTimeout: null,
            _prepareHeightUpdate: function(delay) {
                this.keyupTimeout && clearTimeout(this.keyupTimeout), void 0 === delay ? this._updateHeight() : this.keyupTimeout = this._delay("_updateHeight", delay);
            },
            _timeout: function() {
                this._prepareHeightUpdate(this.options.keyupTimeoutBuffer);
            },
            _updateHeight: function() {
                var scrollHeight, clientHeight, height, scrollTop = this.window.scrollTop();
                this.keyupTimeout = 0, "onpage" in this.element[0] || this.element.css({
                    height: 0,
                    "min-height": 0,
                    "max-height": 0
                }), scrollHeight = this.element[0].scrollHeight, clientHeight = this.element[0].clientHeight, height = scrollHeight + (parseFloat(this.element.css("border-top-width")) + parseFloat(this.element.css("border-bottom-width"))) + 15, 0 === clientHeight && (height += parseFloat(this.element.css("padding-top")) + parseFloat(this.element.css("padding-bottom"))), this.element.css({
                    height: height,
                    "min-height": "",
                    "max-height": ""
                }), this.window.scrollTop(scrollTop);
            },
            refresh: function() {
                this.options.autogrow && this.isTextarea && this._updateHeight();
            },
            _setOptions: function(options) {
                this._super(options), void 0 !== options.autogrow && this.isTextarea && (options.autogrow ? this._autogrow() : this._unbindAutogrow());
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.selectmenu", $.extend({
            initSelector: "select:not( :jqmData(role='slider')):not( :jqmData(role='flipswitch') )",
            options: {
                theme: null,
                icon: "carat-d",
                iconpos: "right",
                inline: !1,
                corners: !0,
                shadow: !0,
                iconshadow: !1,
                overlayTheme: null,
                dividerTheme: null,
                hidePlaceholderMenuItems: !0,
                closeText: "Close",
                nativeMenu: !0,
                preventFocusZoom: /iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1,
                mini: !1
            },
            _button: function() {
                return $("<div/>");
            },
            _setDisabled: function(value) {
                return this.element.attr("disabled", value), this.button.attr("aria-disabled", value), this._setOption("disabled", value);
            },
            _focusButton: function() {
                var self = this;
                setTimeout(function() {
                    self.button.focus();
                }, 40);
            },
            _selectOptions: function() {
                return this.select.find("option");
            },
            _preExtension: function() {
                var inline = this.options.inline || this.element.jqmData("inline"), mini = this.options.mini || this.element.jqmData("mini"), classes = "";
                ~this.element[0].className.indexOf("ui-btn-left") && (classes = " ui-btn-left"), ~this.element[0].className.indexOf("ui-btn-right") && (classes = " ui-btn-right"), inline && (classes += " ui-btn-inline"), mini && (classes += " ui-mini"), this.select = this.element.removeClass("ui-btn-left ui-btn-right").wrap("<div class='ui-select" + classes + "'>"), this.selectId = this.select.attr("id") || "select-" + this.uuid, this.buttonId = this.selectId + "-button", this.label = $("label[for='" + this.selectId + "']"), this.isMultiple = this.select[0].multiple;
            },
            _destroy: function() {
                var wrapper = this.element.parents(".ui-select");
                wrapper.length > 0 && (wrapper.is(".ui-btn-left, .ui-btn-right") && this.element.addClass(wrapper.hasClass("ui-btn-left") ? "ui-btn-left" : "ui-btn-right"), this.element.insertAfter(wrapper), wrapper.remove());
            },
            _create: function() {
                this._preExtension(), this.button = this._button();
                var self = this, options = this.options, iconpos = !!options.icon && (options.iconpos || this.select.jqmData("iconpos")), button = this.button.insertBefore(this.select).attr("id", this.buttonId).addClass("ui-btn" + (options.icon ? " ui-icon-" + options.icon + " ui-btn-icon-" + iconpos + (options.iconshadow ? " ui-shadow-icon" : "") : "") + (options.theme ? " ui-btn-" + options.theme : "") + (options.corners ? " ui-corner-all" : "") + (options.shadow ? " ui-shadow" : ""));
                this.setButtonText(), options.nativeMenu && window.opera && window.opera.version && button.addClass("ui-select-nativeonly"), this.isMultiple && (this.buttonCount = $("<span>").addClass("ui-li-count ui-body-inherit").hide().appendTo(button.addClass("ui-li-has-count"))), (options.disabled || this.element.attr("disabled")) && this.disable(), this.select.change(function() {
                    self.refresh(), options.nativeMenu && this.blur();
                }), this._handleFormReset(), this._on(this.button, {
                    keydown: "_handleKeydown"
                }), this.build();
            },
            build: function() {
                var self = this;
                this.select.appendTo(self.button).bind("vmousedown", function() {
                    self.button.addClass($.mobile.activeBtnClass);
                }).bind("focus", function() {
                    self.button.addClass($.mobile.focusClass);
                }).bind("blur", function() {
                    self.button.removeClass($.mobile.focusClass);
                }).bind("focus vmouseover", function() {
                    self.button.trigger("vmouseover");
                }).bind("vmousemove", function() {
                    self.button.removeClass($.mobile.activeBtnClass);
                }).bind("change blur vmouseout", function() {
                    self.button.trigger("vmouseout").removeClass($.mobile.activeBtnClass);
                }), self.button.bind("vmousedown", function() {
                    self.options.preventFocusZoom && $.mobile.zoom.disable(!0);
                }), self.label.bind("click focus", function() {
                    self.options.preventFocusZoom && $.mobile.zoom.disable(!0);
                }), self.select.bind("focus", function() {
                    self.options.preventFocusZoom && $.mobile.zoom.disable(!0);
                }), self.button.bind("mouseup", function() {
                    self.options.preventFocusZoom && setTimeout(function() {
                        $.mobile.zoom.enable(!0);
                    }, 0);
                }), self.select.bind("blur", function() {
                    self.options.preventFocusZoom && $.mobile.zoom.enable(!0);
                });
            },
            selected: function() {
                return this._selectOptions().filter(":selected");
            },
            selectedIndices: function() {
                var self = this;
                return this.selected().map(function() {
                    return self._selectOptions().index(this);
                }).get();
            },
            setButtonText: function() {
                var selected = this.selected(), text = this.placeholder, span = $(document1.createElement("span"));
                this.button.children("span").not(".ui-li-count").remove().end().end().prepend(((text = selected.length ? selected.map(function() {
                    return $(this).text();
                }).get().join(", ") : this.placeholder) ? span.text(text) : span.html("&#160;"), span.addClass(this.select.attr("class")).addClass(selected.attr("class")).removeClass("ui-screen-hidden")));
            },
            setButtonCount: function() {
                var selected = this.selected();
                this.isMultiple && this.buttonCount[selected.length > 1 ? "show" : "hide"]().text(selected.length);
            },
            _handleKeydown: function() {
                this._delay("_refreshButton");
            },
            _reset: function() {
                this.refresh();
            },
            _refreshButton: function() {
                this.setButtonText(), this.setButtonCount();
            },
            refresh: function() {
                this._refreshButton();
            },
            open: $.noop,
            close: $.noop,
            disable: function() {
                this._setDisabled(!0), this.button.addClass("ui-state-disabled");
            },
            enable: function() {
                this._setDisabled(!1), this.button.removeClass("ui-state-disabled");
            }
        }, $.mobile.behaviors.formReset));
    }(jQuery), jQuery.mobile.links = function(target) {
        jQuery(target).find("a").jqmEnhanceable().filter(":jqmData(rel='popup')[href][href!='']").each(function() {
            var idref = this.getAttribute("href").substring(1);
            idref && (this.setAttribute("aria-haspopup", !0), this.setAttribute("aria-owns", idref), this.setAttribute("aria-expanded", !1));
        }).end().not(".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link");
    }, function($, undefined) {
        function fitSegmentInsideSegment(windowSize, segmentSize, offset, desired) {
            var returnValue = desired;
            return windowSize < segmentSize ? offset + (windowSize - segmentSize) / 2 : Math.min(Math.max(offset, desired - segmentSize / 2), offset + windowSize - segmentSize);
        }
        function getWindowCoordinates(theWindow) {
            return {
                x: theWindow.scrollLeft(),
                y: theWindow.scrollTop(),
                cx: theWindow[0].innerWidth || theWindow.width(),
                cy: theWindow[0].innerHeight || theWindow.height()
            };
        }
        $.widget("mobile.popup", {
            options: {
                wrapperClass: null,
                theme: null,
                overlayTheme: null,
                shadow: !0,
                corners: !0,
                transition: "none",
                positionTo: "origin",
                tolerance: null,
                closeLinkSelector: "a:jqmData(rel='back')",
                closeLinkEvents: "click.popup",
                navigateEvents: "navigate.popup",
                closeEvents: "navigate.popup pagebeforechange.popup",
                dismissible: !0,
                enhanced: !1,
                history: !$.mobile.browser.oldIE
            },
            _create: function() {
                var theElement = this.element, myId = theElement.attr("id"), currentOptions = this.options;
                currentOptions.history = currentOptions.history && $.mobile.ajaxEnabled && $.mobile.hashListeningEnabled, $.extend(this, {
                    _scrollTop: 0,
                    _page: theElement.closest(".ui-page"),
                    _ui: null,
                    _fallbackTransition: "",
                    _currentTransition: !1,
                    _prerequisites: null,
                    _isOpen: !1,
                    _tolerance: null,
                    _resizeData: null,
                    _ignoreResizeTo: 0,
                    _orientationchangeInProgress: !1
                }), 0 === this._page.length && (this._page = $("body")), currentOptions.enhanced ? this._ui = {
                    container: theElement.parent(),
                    screen: theElement.parent().prev(),
                    placeholder: $(this.document[0].getElementById(myId + "-placeholder"))
                } : (this._ui = this._enhance(theElement, myId), this._applyTransition(currentOptions.transition)), this._setTolerance(currentOptions.tolerance)._ui.focusElement = this._ui.container, this._on(this._ui.screen, {
                    vclick: "_eatEventAndClose"
                }), this._on(this.window, {
                    orientationchange: $.proxy(this, "_handleWindowOrientationchange"),
                    resize: $.proxy(this, "_handleWindowResize"),
                    keyup: $.proxy(this, "_handleWindowKeyUp")
                }), this._on(this.document, {
                    focusin: "_handleDocumentFocusIn"
                });
            },
            _enhance: function(theElement, myId) {
                var currentOptions = this.options, wrapperClass = currentOptions.wrapperClass, ui = {
                    screen: $("<div class='ui-screen-hidden ui-popup-screen " + this._themeClassFromOption("ui-overlay-", currentOptions.overlayTheme) + "'></div>"),
                    placeholder: $("<div style='display: none;'><!-- placeholder --></div>"),
                    container: $("<div class='ui-popup-container ui-popup-hidden ui-popup-truncate" + (wrapperClass ? " " + wrapperClass : "") + "'></div>")
                }, fragment = this.document[0].createDocumentFragment();
                return fragment.appendChild(ui.screen[0]), fragment.appendChild(ui.container[0]), myId && (ui.screen.attr("id", myId + "-screen"), ui.container.attr("id", myId + "-popup"), ui.placeholder.attr("id", myId + "-placeholder").html("<!-- placeholder for " + myId + " -->")), this._page[0].appendChild(fragment), ui.placeholder.insertAfter(theElement), theElement.detach().addClass("ui-popup " + this._themeClassFromOption("ui-body-", currentOptions.theme) + " " + (currentOptions.shadow ? "ui-overlay-shadow " : "") + (currentOptions.corners ? "ui-corner-all " : "")).appendTo(ui.container), ui;
            },
            _eatEventAndClose: function(theEvent) {
                return theEvent.preventDefault(), theEvent.stopImmediatePropagation(), this.options.dismissible && this.close(), !1;
            },
            _resizeScreen: function() {
                var screen1 = this._ui.screen, popupHeight = this._ui.container.outerHeight(!0), screenHeight = screen1.removeAttr("style").height(), documentHeight = this.document.height() - 1;
                screenHeight < documentHeight ? screen1.height(documentHeight) : popupHeight > screenHeight && screen1.height(popupHeight);
            },
            _handleWindowKeyUp: function(theEvent) {
                if (this._isOpen && theEvent.keyCode === $.mobile.keyCode.ESCAPE) return this._eatEventAndClose(theEvent);
            },
            _expectResizeEvent: function() {
                var windowCoordinates = getWindowCoordinates(this.window);
                if (this._resizeData) {
                    if (windowCoordinates.x === this._resizeData.windowCoordinates.x && windowCoordinates.y === this._resizeData.windowCoordinates.y && windowCoordinates.cx === this._resizeData.windowCoordinates.cx && windowCoordinates.cy === this._resizeData.windowCoordinates.cy) return !1;
                    clearTimeout(this._resizeData.timeoutId);
                }
                return this._resizeData = {
                    timeoutId: this._delay("_resizeTimeout", 200),
                    windowCoordinates: windowCoordinates
                }, !0;
            },
            _resizeTimeout: function() {
                this._isOpen ? this._expectResizeEvent() || (this._ui.container.hasClass("ui-popup-hidden") && (this._ui.container.removeClass("ui-popup-hidden ui-popup-truncate"), this.reposition({
                    positionTo: "window"
                }), this._ignoreResizeEvents()), this._resizeScreen(), this._resizeData = null, this._orientationchangeInProgress = !1) : (this._resizeData = null, this._orientationchangeInProgress = !1);
            },
            _stopIgnoringResizeEvents: function() {
                this._ignoreResizeTo = 0;
            },
            _ignoreResizeEvents: function() {
                this._ignoreResizeTo && clearTimeout(this._ignoreResizeTo), this._ignoreResizeTo = this._delay("_stopIgnoringResizeEvents", 1000);
            },
            _handleWindowResize: function() {
                this._isOpen && 0 === this._ignoreResizeTo && (this._expectResizeEvent() || this._orientationchangeInProgress) && !this._ui.container.hasClass("ui-popup-hidden") && this._ui.container.addClass("ui-popup-hidden ui-popup-truncate").removeAttr("style");
            },
            _handleWindowOrientationchange: function() {
                !this._orientationchangeInProgress && this._isOpen && 0 === this._ignoreResizeTo && (this._expectResizeEvent(), this._orientationchangeInProgress = !0);
            },
            _handleDocumentFocusIn: function(theEvent) {
                var target, targetElement = theEvent.target, ui = this._ui;
                if (this._isOpen) {
                    if (targetElement !== ui.container[0]) {
                        if (0 === (target = $(targetElement)).parents().filter(ui.container[0]).length) return $(this.document[0].activeElement).one("focus", function() {
                            target.blur();
                        }), ui.focusElement.focus(), theEvent.preventDefault(), theEvent.stopImmediatePropagation(), !1;
                        ui.focusElement[0] === ui.container[0] && (ui.focusElement = target);
                    }
                    this._ignoreResizeEvents();
                }
            },
            _themeClassFromOption: function(prefix, value) {
                return value ? "none" === value ? "" : prefix + value : prefix + "inherit";
            },
            _applyTransition: function(value) {
                return value && (this._ui.container.removeClass(this._fallbackTransition), "none" !== value && (this._fallbackTransition = $.mobile._maybeDegradeTransition(value), "none" === this._fallbackTransition && (this._fallbackTransition = ""), this._ui.container.addClass(this._fallbackTransition))), this;
            },
            _setOptions: function(newOptions) {
                var currentOptions = this.options, theElement = this.element, screen1 = this._ui.screen;
                return void 0 !== newOptions.wrapperClass && this._ui.container.removeClass(currentOptions.wrapperClass).addClass(newOptions.wrapperClass), void 0 !== newOptions.theme && theElement.removeClass(this._themeClassFromOption("ui-body-", currentOptions.theme)).addClass(this._themeClassFromOption("ui-body-", newOptions.theme)), newOptions.overlayTheme !== undefined && (screen1.removeClass(this._themeClassFromOption("ui-overlay-", currentOptions.overlayTheme)).addClass(this._themeClassFromOption("ui-overlay-", newOptions.overlayTheme)), this._isOpen && screen1.addClass("in")), newOptions.shadow !== undefined && theElement.toggleClass("ui-overlay-shadow", newOptions.shadow), newOptions.corners !== undefined && theElement.toggleClass("ui-corner-all", newOptions.corners), newOptions.transition === undefined || this._currentTransition || this._applyTransition(newOptions.transition), newOptions.tolerance !== undefined && this._setTolerance(newOptions.tolerance), newOptions.disabled !== undefined && newOptions.disabled && this.close(), this._super(newOptions);
            },
            _setTolerance: function(value) {
                var ar, tol = {
                    t: 30,
                    r: 15,
                    b: 30,
                    l: 15
                };
                if (undefined !== value) switch(ar = String(value).split(","), $.each(ar, function(idx, val) {
                    ar[idx] = parseInt(val, 10);
                }), ar.length){
                    case 1:
                        isNaN(ar[0]) || (tol.t = tol.r = tol.b = tol.l = ar[0]);
                        break;
                    case 2:
                        isNaN(ar[0]) || (tol.t = tol.b = ar[0]), isNaN(ar[1]) || (tol.l = tol.r = ar[1]);
                        break;
                    case 4:
                        isNaN(ar[0]) || (tol.t = ar[0]), isNaN(ar[1]) || (tol.r = ar[1]), isNaN(ar[2]) || (tol.b = ar[2]), isNaN(ar[3]) || (tol.l = ar[3]);
                }
                return this._tolerance = tol, this;
            },
            _clampPopupWidth: function(infoOnly) {
                var windowCoordinates = getWindowCoordinates(this.window), rectangle = {
                    x: this._tolerance.l,
                    y: windowCoordinates.y + this._tolerance.t,
                    cx: windowCoordinates.cx - this._tolerance.l - this._tolerance.r,
                    cy: windowCoordinates.cy - this._tolerance.t - this._tolerance.b
                };
                return infoOnly || this._ui.container.css("max-width", rectangle.cx), {
                    rc: rectangle,
                    menuSize: {
                        cx: this._ui.container.outerWidth(!0),
                        cy: this._ui.container.outerHeight(!0)
                    }
                };
            },
            _calculateFinalLocation: function(desired, clampInfo) {
                var returnValue, rectangle = clampInfo.rc, menuSize = clampInfo.menuSize;
                return (returnValue = {
                    left: fitSegmentInsideSegment(rectangle.cx, menuSize.cx, rectangle.x, desired.x),
                    top: fitSegmentInsideSegment(rectangle.cy, menuSize.cy, rectangle.y, desired.y)
                }).top = Math.max(0, returnValue.top), returnValue.top -= Math.min(returnValue.top, Math.max(0, returnValue.top + menuSize.cy - this.document.height())), returnValue;
            },
            _placementCoords: function(desired) {
                return this._calculateFinalLocation(desired, this._clampPopupWidth());
            },
            _createPrerequisites: function(screenPrerequisite, containerPrerequisite, whenDone) {
                var prerequisites, self = this;
                (prerequisites = {
                    screen: $.Deferred(),
                    container: $.Deferred()
                }).screen.then(function() {
                    prerequisites === self._prerequisites && screenPrerequisite();
                }), prerequisites.container.then(function() {
                    prerequisites === self._prerequisites && containerPrerequisite();
                }), $.when(prerequisites.screen, prerequisites.container).done(function() {
                    prerequisites === self._prerequisites && (self._prerequisites = null, whenDone());
                }), self._prerequisites = prerequisites;
            },
            _animate: function(args) {
                if (this._ui.screen.removeClass(args.classToRemove).addClass(args.screenClassToAdd), args.prerequisites.screen.resolve(), args.transition && "none" !== args.transition && (args.applyTransition && this._applyTransition(args.transition), this._fallbackTransition)) {
                    this._ui.container.addClass(args.containerClassToAdd).removeClass(args.classToRemove).animationComplete($.proxy(args.prerequisites.container, "resolve"));
                    return;
                }
                this._ui.container.removeClass(args.classToRemove), args.prerequisites.container.resolve();
            },
            _desiredCoords: function(openOptions) {
                var offset, dst = null, windowCoordinates = getWindowCoordinates(this.window), x = openOptions.x, y = openOptions.y, pTo = openOptions.positionTo;
                if (pTo && "origin" !== pTo) {
                    if ("window" === pTo) x = windowCoordinates.cx / 2 + windowCoordinates.x, y = windowCoordinates.cy / 2 + windowCoordinates.y;
                    else {
                        try {
                            dst = $(pTo);
                        } catch (err) {
                            dst = null;
                        }
                        dst && (dst.filter(":visible"), 0 === dst.length && (dst = null));
                    }
                }
                return dst && (x = (offset = dst.offset()).left + dst.outerWidth() / 2, y = offset.top + dst.outerHeight() / 2), ("number" !== $.type(x) || isNaN(x)) && (x = windowCoordinates.cx / 2 + windowCoordinates.x), ("number" !== $.type(y) || isNaN(y)) && (y = windowCoordinates.cy / 2 + windowCoordinates.y), {
                    x: x,
                    y: y
                };
            },
            _reposition: function(openOptions) {
                openOptions = {
                    x: openOptions.x,
                    y: openOptions.y,
                    positionTo: openOptions.positionTo
                }, this._trigger("beforeposition", undefined, openOptions), this._ui.container.offset(this._placementCoords(this._desiredCoords(openOptions)));
            },
            reposition: function(openOptions) {
                this._isOpen && this._reposition(openOptions);
            },
            _openPrerequisitesComplete: function() {
                var id = this.element.attr("id");
                this._ui.container.addClass("ui-popup-active"), this._isOpen = !0, this._resizeScreen(), this._ui.container.attr("tabindex", "0").focus(), this._ignoreResizeEvents(), id && this.document.find("[aria-haspopup='true'][aria-owns='" + id + "']").attr("aria-expanded", !0), this._trigger("afteropen");
            },
            _open: function(options) {
                var ua, wkmatch, wkversion, androidmatch, andversion, chromematch, openOptions = $.extend({}, this.options, options), androidBlacklist = (wkversion = !!(wkmatch = (ua = navigator.userAgent).match(/AppleWebKit\/([0-9\.]+)/)) && wkmatch[1], andversion = !!(androidmatch = ua.match(/Android (\d+(?:\.\d+))/)) && androidmatch[1], chromematch = ua.indexOf("Chrome") > -1, null !== androidmatch && "4.0" === andversion && !!wkversion && !!(wkversion > 534.13) && !chromematch);
                this._createPrerequisites($.noop, $.noop, $.proxy(this, "_openPrerequisitesComplete")), this._currentTransition = openOptions.transition, this._applyTransition(openOptions.transition), this._ui.screen.removeClass("ui-screen-hidden"), this._ui.container.removeClass("ui-popup-truncate"), this._reposition(openOptions), this._ui.container.removeClass("ui-popup-hidden"), this.options.overlayTheme && androidBlacklist && this.element.closest(".ui-page").addClass("ui-popup-open"), this._animate({
                    additionalCondition: !0,
                    transition: openOptions.transition,
                    classToRemove: "",
                    screenClassToAdd: "in",
                    containerClassToAdd: "in",
                    applyTransition: !1,
                    prerequisites: this._prerequisites
                });
            },
            _closePrerequisiteScreen: function() {
                this._ui.screen.removeClass("out").addClass("ui-screen-hidden");
            },
            _closePrerequisiteContainer: function() {
                this._ui.container.removeClass("reverse out").addClass("ui-popup-hidden ui-popup-truncate").removeAttr("style");
            },
            _closePrerequisitesDone: function() {
                var container = this._ui.container, id = this.element.attr("id");
                container.removeAttr("tabindex"), $.mobile.popup.active = undefined, $(":focus", container[0]).add(container[0]).blur(), id && this.document.find("[aria-haspopup='true'][aria-owns='" + id + "']").attr("aria-expanded", !1), this._trigger("afterclose");
            },
            _close: function(immediate) {
                this._ui.container.removeClass("ui-popup-active"), this._page.removeClass("ui-popup-open"), this._isOpen = !1, this._createPrerequisites($.proxy(this, "_closePrerequisiteScreen"), $.proxy(this, "_closePrerequisiteContainer"), $.proxy(this, "_closePrerequisitesDone")), this._animate({
                    additionalCondition: this._ui.screen.hasClass("in"),
                    transition: immediate ? "none" : this._currentTransition,
                    classToRemove: "in",
                    screenClassToAdd: "out",
                    containerClassToAdd: "reverse out",
                    applyTransition: !0,
                    prerequisites: this._prerequisites
                });
            },
            _unenhance: function() {
                !this.options.enhanced && (this._setOptions({
                    theme: $.mobile.popup.prototype.options.theme
                }), this.element.detach().insertAfter(this._ui.placeholder).removeClass("ui-popup ui-overlay-shadow ui-corner-all ui-body-inherit"), this._ui.screen.remove(), this._ui.container.remove(), this._ui.placeholder.remove());
            },
            _destroy: function() {
                return $.mobile.popup.active === this ? (this.element.one("popupafterclose", $.proxy(this, "_unenhance")), this.close()) : this._unenhance(), this;
            },
            _closePopup: function(theEvent, data) {
                var parsedDst, toUrl, currentOptions = this.options, immediate = !1;
                !(theEvent && theEvent.isDefaultPrevented()) && $.mobile.popup.active === this && (window.scrollTo(0, this._scrollTop), theEvent && "pagebeforechange" === theEvent.type && data && (parsedDst = "string" == typeof data.toPage ? data.toPage : data.toPage.jqmData("url"), toUrl = (parsedDst = $.mobile.path.parseUrl(parsedDst)).pathname + parsedDst.search + parsedDst.hash, this._myUrl !== $.mobile.path.makeUrlAbsolute(toUrl) ? immediate = !0 : theEvent.preventDefault()), this.window.off(currentOptions.closeEvents), this.element.undelegate(currentOptions.closeLinkSelector, currentOptions.closeLinkEvents), this._close(immediate));
            },
            _bindContainerClose: function() {
                this.window.on(this.options.closeEvents, $.proxy(this, "_closePopup"));
            },
            widget: function() {
                return this._ui.container;
            },
            open: function(options) {
                var url, hashkey, activePage, currentIsDialog, urlHistory, self = this, currentOptions = this.options;
                return $.mobile.popup.active || currentOptions.disabled || (($.mobile.popup.active = this, this._scrollTop = this.window.scrollTop(), currentOptions.history) ? (urlHistory = $.mobile.navigate.history, hashkey = $.mobile.dialogHashKey, currentIsDialog = !!(activePage = $.mobile.activePage) && activePage.hasClass("ui-dialog"), this._myUrl = url = urlHistory.getActive().url, url.indexOf(hashkey) > -1 && !currentIsDialog && urlHistory.activeIndex > 0) ? (self._open(options), self._bindContainerClose()) : (-1 !== url.indexOf(hashkey) || currentIsDialog ? url = $.mobile.path.parseLocation().hash + hashkey : url += url.indexOf("#") > -1 ? hashkey : "#" + hashkey, 0 === urlHistory.activeIndex && url === urlHistory.initialDst && (url += hashkey), this.window.one("beforenavigate", function(theEvent) {
                    theEvent.preventDefault(), self._open(options), self._bindContainerClose();
                }), this.urlAltered = !0, $.mobile.navigate(url, {
                    role: "dialog"
                })) : (self._open(options), self._bindContainerClose(), self.element.delegate(currentOptions.closeLinkSelector, currentOptions.closeLinkEvents, function(theEvent) {
                    self.close(), theEvent.preventDefault();
                }))), this;
            },
            close: function() {
                return $.mobile.popup.active !== this || (this._scrollTop = this.window.scrollTop(), this.options.history && this.urlAltered ? ($.mobile.back(), this.urlAltered = !1) : this._closePopup()), this;
            }
        }), $.mobile.popup.handleLink = function($link) {
            var offset, path = $.mobile.path, popup = $(path.hashToSelector(path.parseUrl($link.attr("href")).hash)).first();
            popup.length > 0 && popup.data("mobile-popup") && (offset = $link.offset(), popup.popup("open", {
                x: offset.left + $link.outerWidth() / 2,
                y: offset.top + $link.outerHeight() / 2,
                transition: $link.jqmData("transition"),
                positionTo: $link.jqmData("position-to")
            })), setTimeout(function() {
                $link.removeClass($.mobile.activeBtnClass);
            }, 300);
        }, $.mobile.document.on("pagebeforechange", function(theEvent, data) {
            "popup" === data.options.role && ($.mobile.popup.handleLink(data.options.link), theEvent.preventDefault());
        });
    }(jQuery), function($, undefined) {
        var unfocusableItemSelector = ".ui-disabled,.ui-state-disabled,.ui-li-divider,.ui-screen-hidden,:jqmData(role='placeholder')", goToAdjacentItem = function(item, target, direction) {
            var adjacent = item[direction + "All"]().not(unfocusableItemSelector).first();
            adjacent.length && (target.blur().attr("tabindex", "-1"), adjacent.find("a").first().focus());
        };
        $.widget("mobile.selectmenu", $.mobile.selectmenu, {
            _create: function() {
                var o = this.options;
                return o.nativeMenu = o.nativeMenu || this.element.parents(":jqmData(role='popup'),:mobile-popup").length > 0, this._super();
            },
            _handleSelectFocus: function() {
                this.element.blur(), this.button.focus();
            },
            _handleKeydown: function(event1) {
                this._super(event1), this._handleButtonVclickKeydown(event1);
            },
            _handleButtonVclickKeydown: function(event1) {
                !this.options.disabled && !this.isOpen && ("vclick" === event1.type || event1.keyCode && (event1.keyCode === $.mobile.keyCode.ENTER || event1.keyCode === $.mobile.keyCode.SPACE)) && (this._decideFormat(), "overlay" === this.menuType ? this.button.attr("href", "#" + this.popupId).attr("data-" + ($.mobile.ns || "") + "rel", "popup") : this.button.attr("href", "#" + this.dialogId).attr("data-" + ($.mobile.ns || "") + "rel", "dialog"), this.isOpen = !0);
            },
            _handleListFocus: function(e) {
                var params = "focusin" === e.type ? {
                    tabindex: "0",
                    event: "vmouseover"
                } : {
                    tabindex: "-1",
                    event: "vmouseout"
                };
                $(e.target).attr("tabindex", params.tabindex).trigger(params.event);
            },
            _handleListKeydown: function(event1) {
                var target = $(event1.target), li = target.closest("li");
                switch(event1.keyCode){
                    case 38:
                        return goToAdjacentItem(li, target, "prev"), !1;
                    case 40:
                        return goToAdjacentItem(li, target, "next"), !1;
                    case 13:
                    case 32:
                        return target.trigger("click"), !1;
                }
            },
            _handleMenuPageHide: function() {
                this.thisPage.page("bindRemove");
            },
            _handleHeaderCloseClick: function() {
                if ("overlay" === this.menuType) return this.close(), !1;
            },
            build: function() {
                var selectId, popupId, dialogId, label, thisPage, isMultiple, menuId, themeAttr, overlayTheme, overlayThemeAttr, dividerThemeAttr, menuPage, listbox, list, header, headerTitle, menuPageContent, menuPageClose, headerClose, self, o = this.options;
                return o.nativeMenu ? this._super() : (self = this, popupId = (selectId = this.selectId) + "-listbox", dialogId = selectId + "-dialog", label = this.label, thisPage = this.element.closest(".ui-page"), isMultiple = this.element[0].multiple, menuId = selectId + "-menu", themeAttr = o.theme ? " data-" + $.mobile.ns + "theme='" + o.theme + "'" : "", overlayThemeAttr = (overlayTheme = o.overlayTheme || o.theme || null) ? " data-" + $.mobile.ns + "overlay-theme='" + overlayTheme + "'" : "", dividerThemeAttr = o.dividerTheme && isMultiple ? " data-" + $.mobile.ns + "divider-theme='" + o.dividerTheme + "'" : "", menuPage = $("<div data-" + $.mobile.ns + "role='dialog' class='ui-selectmenu' id='" + dialogId + "'" + themeAttr + overlayThemeAttr + "><div data-" + $.mobile.ns + "role='header'><div class='ui-title'>" + label.getEncodedText() + "</div></div><div data-" + $.mobile.ns + "role='content'></div></div>"), listbox = $("<div id='" + popupId + "' class='ui-selectmenu'></div>").insertAfter(this.select).popup({
                    theme: o.overlayTheme
                }), list = $("<ul class='ui-selectmenu-list' id='" + menuId + "' role='listbox' aria-labelledby='" + this.buttonId + "'" + themeAttr + dividerThemeAttr + "></ul>").appendTo(listbox), header = $("<div class='ui-header ui-bar-" + (o.theme ? o.theme : "inherit") + "'></div>").prependTo(listbox), headerTitle = $("<h1 class='ui-title'></h1>").appendTo(header), this.isMultiple && (headerClose = $("<a>", {
                    role: "button",
                    text: o.closeText,
                    href: "#",
                    class: "ui-btn ui-corner-all ui-btn-left ui-btn-icon-notext ui-icon-delete"
                }).appendTo(header)), $.extend(this, {
                    selectId: selectId,
                    menuId: menuId,
                    popupId: popupId,
                    dialogId: dialogId,
                    thisPage: thisPage,
                    menuPage: menuPage,
                    label: label,
                    isMultiple: isMultiple,
                    theme: o.theme,
                    listbox: listbox,
                    list: list,
                    header: header,
                    headerTitle: headerTitle,
                    headerClose: headerClose,
                    menuPageContent: menuPageContent,
                    menuPageClose: menuPageClose,
                    placeholder: ""
                }), this.refresh(), void 0 === this._origTabIndex && (this._origTabIndex = null !== this.select[0].getAttribute("tabindex") && this.select.attr("tabindex")), this.select.attr("tabindex", "-1"), this._on(this.select, {
                    focus: "_handleSelectFocus"
                }), this._on(this.button, {
                    vclick: "_handleButtonVclickKeydown"
                }), this.list.attr("role", "listbox"), this._on(this.list, {
                    focusin: "_handleListFocus",
                    focusout: "_handleListFocus",
                    keydown: "_handleListKeydown"
                }), this.list.delegate("li:not(.ui-disabled,.ui-state-disabled,.ui-li-divider)", "click", function(event1) {
                    var oldIndex = self.select[0].selectedIndex, newIndex = $.mobile.getAttribute(this, "option-index"), option = self._selectOptions().eq(newIndex)[0];
                    option.selected = !self.isMultiple || !option.selected, self.isMultiple && $(this).find("a").toggleClass("ui-checkbox-on", option.selected).toggleClass("ui-checkbox-off", !option.selected), (self.isMultiple || oldIndex !== newIndex) && self.select.trigger("change"), self.isMultiple ? self.list.find("li:not(.ui-li-divider)").eq(newIndex).find("a").first().focus() : self.close(), event1.preventDefault();
                }), this._on(this.menuPage, {
                    pagehide: "_handleMenuPageHide"
                }), this._on(this.listbox, {
                    popupafterclose: "close"
                }), this.isMultiple && this._on(this.headerClose, {
                    click: "_handleHeaderCloseClick"
                }), this);
            },
            _isRebuildRequired: function() {
                var list = this.list.find("li");
                return this._selectOptions().not(".ui-screen-hidden").text() !== list.text();
            },
            selected: function() {
                return this._selectOptions().filter(":selected:not( :jqmData(placeholder='true') )");
            },
            refresh: function(force) {
                var self, indices;
                if (this.options.nativeMenu) return this._super(force);
                self = this, (force || this._isRebuildRequired()) && self._buildList(), indices = this.selectedIndices(), self.setButtonText(), self.setButtonCount(), self.list.find("li:not(.ui-li-divider)").find("a").removeClass($.mobile.activeBtnClass).end().attr("aria-selected", !1).each(function(i) {
                    if ($.inArray(i, indices) > -1) {
                        var item = $(this);
                        item.attr("aria-selected", !0), self.isMultiple ? item.find("a").removeClass("ui-checkbox-off").addClass("ui-checkbox-on") : item.hasClass("ui-screen-hidden") ? item.next().find("a").addClass($.mobile.activeBtnClass) : item.find("a").addClass($.mobile.activeBtnClass);
                    }
                });
            },
            close: function() {
                !this.options.disabled && this.isOpen && ("page" === this.menuType ? (this.menuPage.dialog("close"), this.list.appendTo(this.listbox)) : this.listbox.popup("close"), this._focusButton(), this.isOpen = !1);
            },
            open: function() {
                this.button.click();
            },
            _focusMenuItem: function() {
                var selector = this.list.find("a." + $.mobile.activeBtnClass);
                0 === selector.length && (selector = this.list.find("li:not(" + unfocusableItemSelector + ") a.ui-btn")), selector.first().focus();
            },
            _decideFormat: function() {
                var $window = this.window, menuHeight = this.list.parent().outerHeight(), scrollTop = $window.scrollTop(), btnOffset = this.button.offset().top, screenHeight = $window.height();
                menuHeight > screenHeight - 80 || !$.support.scrollTop ? (this.menuPage.appendTo($.mobile.pageContainer).page(), this.menuPageContent = this.menuPage.find(".ui-content"), this.menuPageClose = this.menuPage.find(".ui-header a"), this.thisPage.unbind("pagehide.remove"), 0 === scrollTop && btnOffset > screenHeight && this.thisPage.one("pagehide", function() {
                    $(this).jqmData("lastScroll", btnOffset);
                }), this.menuPage.one({
                    pageshow: $.proxy(this, "_focusMenuItem"),
                    pagehide: $.proxy(this, "close")
                }), this.menuType = "page", this.menuPageContent.append(this.list), this.menuPage.find("div .ui-title").text(this.label.text())) : (this.menuType = "overlay", this.listbox.one({
                    popupafteropen: $.proxy(this, "_focusMenuItem")
                }));
            },
            _buildList: function() {
                var $options, numOptions, select, optGroup, i, option, $option, parent, text, anchor, classes, optLabel, divider, item, o = this.options, placeholder = this.placeholder, needPlaceholder = !0, dataPrefix = "data-" + $.mobile.ns, dataIndexAttr = dataPrefix + "option-index", dataIconAttr = dataPrefix + "icon", dataRoleAttr = dataPrefix + "role", dataPlaceholderAttr = dataPrefix + "placeholder", fragment = document1.createDocumentFragment(), isPlaceholderItem = !1;
                for(this.list.empty().filter(".ui-listview").listview("destroy"), numOptions = ($options = this._selectOptions()).length, select = this.select[0], i = 0; i < numOptions; i++, isPlaceholderItem = !1)!($option = $(option = $options[i])).hasClass("ui-screen-hidden") && (parent = option.parentNode, text = $option.text(), anchor = document1.createElement("a"), classes = [], anchor.setAttribute("href", "#"), anchor.appendChild(document1.createTextNode(text)), parent !== select && "optgroup" === parent.nodeName.toLowerCase() && (optLabel = parent.getAttribute("label")) !== optGroup && ((divider = document1.createElement("li")).setAttribute(dataRoleAttr, "list-divider"), divider.setAttribute("role", "option"), divider.setAttribute("tabindex", "-1"), divider.appendChild(document1.createTextNode(optLabel)), fragment.appendChild(divider), optGroup = optLabel), needPlaceholder && (!option.getAttribute("value") || 0 === text.length || $option.jqmData("placeholder")) && (needPlaceholder = !1, isPlaceholderItem = !0, null === option.getAttribute(dataPlaceholderAttr) && (this._removePlaceholderAttr = !0), option.setAttribute(dataPlaceholderAttr, !0), o.hidePlaceholderMenuItems && classes.push("ui-screen-hidden"), placeholder !== text && (placeholder = this.placeholder = text)), item = document1.createElement("li"), option.disabled && (classes.push("ui-state-disabled"), item.setAttribute("aria-disabled", !0)), item.setAttribute(dataIndexAttr, i), item.setAttribute(dataIconAttr, "false"), isPlaceholderItem && item.setAttribute(dataPlaceholderAttr, !0), item.className = classes.join(" "), item.setAttribute("role", "option"), anchor.setAttribute("tabindex", "-1"), this.isMultiple && $(anchor).addClass("ui-btn ui-checkbox-off ui-btn-icon-right"), item.appendChild(anchor), fragment.appendChild(item));
                this.list[0].appendChild(fragment), this.isMultiple || placeholder.length ? this.headerTitle.text(this.placeholder) : this.header.addClass("ui-screen-hidden"), this.list.listview();
            },
            _button: function() {
                return this.options.nativeMenu ? this._super() : $("<a>", {
                    href: "#",
                    role: "button",
                    id: this.buttonId,
                    "aria-haspopup": "true",
                    "aria-owns": this.menuId
                });
            },
            _destroy: function() {
                this.options.nativeMenu || (this.close(), void 0 !== this._origTabIndex && (!1 !== this._origTabIndex ? this.select.attr("tabindex", this._origTabIndex) : this.select.removeAttr("tabindex")), this._removePlaceholderAttr && this._selectOptions().removeAttr("data-" + $.mobile.ns + "placeholder"), this.listbox.remove(), this.menuPage.remove()), this._super();
            }
        });
    }(jQuery), function($, undefined) {
        var reverseBoolOptionMap = {
            "ui-shadow": "shadow",
            "ui-corner-all": "corners",
            "ui-btn-inline": "inline",
            "ui-shadow-icon": "iconshadow",
            "ui-mini": "mini"
        }, getAttrFixed = function() {
            var ret = $.mobile.getAttribute.apply(this, arguments);
            return null == ret ? undefined : ret;
        }, capitalLettersRE = /[A-Z]/g;
        function camelCase2Hyphenated(c) {
            return "-" + c.toLowerCase();
        }
        $.fn.buttonMarkup = function(options, overwriteClasses) {
            var idx, data, el, retrievedOptions, optionKey, defaults = $.fn.buttonMarkup.defaults;
            for(idx = 0; idx < this.length; idx++){
                if (el = this[idx], data = overwriteClasses ? {
                    alreadyEnhanced: !1,
                    unknownClasses: []
                } : function(classes) {
                    var idx, map, unknownClass, alreadyEnhanced = !1, noIcon = !0, o = {
                        icon: "",
                        inline: !1,
                        shadow: !1,
                        corners: !1,
                        iconshadow: !1,
                        mini: !1
                    }, unknownClasses = [];
                    for(idx = 0, classes = classes.split(" "); idx < classes.length; idx++)unknownClass = !0, undefined !== (map = reverseBoolOptionMap[classes[idx]]) ? (unknownClass = !1, o[map] = !0) : 0 === classes[idx].indexOf("ui-btn-icon-") ? (unknownClass = !1, noIcon = !1, o.iconpos = classes[idx].substring(12)) : 0 === classes[idx].indexOf("ui-icon-") ? (unknownClass = !1, o.icon = classes[idx].substring(8)) : 0 === classes[idx].indexOf("ui-btn-") && 8 === classes[idx].length ? (unknownClass = !1, o.theme = classes[idx].substring(7)) : "ui-btn" === classes[idx] && (unknownClass = !1, alreadyEnhanced = !0), unknownClass && unknownClasses.push(classes[idx]);
                    return noIcon && (o.icon = ""), {
                        options: o,
                        unknownClasses: unknownClasses,
                        alreadyEnhanced: alreadyEnhanced
                    };
                }(el.className), retrievedOptions = $.extend({}, data.alreadyEnhanced ? data.options : {}, options), !data.alreadyEnhanced) for(optionKey in defaults)retrievedOptions[optionKey] === undefined && (retrievedOptions[optionKey] = getAttrFixed(el, optionKey.replace(capitalLettersRE, camelCase2Hyphenated)));
                el.className = (function(options, existingClasses) {
                    var classes = existingClasses || [];
                    return classes.push("ui-btn"), options.theme && classes.push("ui-btn-" + options.theme), options.icon && (classes = classes.concat([
                        "ui-icon-" + options.icon,
                        "ui-btn-icon-" + options.iconpos
                    ]), options.iconshadow && classes.push("ui-shadow-icon")), options.inline && classes.push("ui-btn-inline"), options.shadow && classes.push("ui-shadow"), options.corners && classes.push("ui-corner-all"), options.mini && classes.push("ui-mini"), classes;
                })($.extend({}, defaults, retrievedOptions), data.unknownClasses).join(" "), "button" !== el.tagName.toLowerCase() && el.setAttribute("role", "button");
            }
            return this;
        }, $.fn.buttonMarkup.defaults = {
            icon: "",
            iconpos: "left",
            theme: null,
            inline: !1,
            shadow: !0,
            corners: !0,
            iconshadow: !1,
            mini: !1
        }, $.extend($.fn.buttonMarkup, {
            initSelector: "a:jqmData(role='button'), .ui-bar > a, .ui-bar > :jqmData(role='controlgroup') > a, button"
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.controlgroup", $.extend({
            options: {
                enhanced: !1,
                theme: null,
                shadow: !1,
                corners: !0,
                excludeInvisible: !0,
                type: "vertical",
                mini: !1
            },
            _create: function() {
                var elem = this.element, opts = this.options;
                $.fn.buttonMarkup && this.element.find($.fn.buttonMarkup.initSelector).buttonMarkup(), $.each(this._childWidgets, $.proxy(function(number, widgetName) {
                    $.mobile[widgetName] && this.element.find($.mobile[widgetName].initSelector).not($.mobile.page.prototype.keepNativeSelector())[widgetName]();
                }, this)), $.extend(this, {
                    _ui: null,
                    _initialRefresh: !0
                }), opts.enhanced ? this._ui = {
                    groupLegend: elem.children(".ui-controlgroup-label").children(),
                    childWrapper: elem.children(".ui-controlgroup-controls")
                } : this._ui = this._enhance();
            },
            _childWidgets: [
                "checkboxradio",
                "selectmenu",
                "button"
            ],
            _themeClassFromOption: function(value) {
                return value ? "none" === value ? "" : "ui-group-theme-" + value : "";
            },
            _enhance: function() {
                var elem = this.element, opts = this.options, ui = {
                    groupLegend: elem.children("legend"),
                    childWrapper: elem.addClass("ui-controlgroup ui-controlgroup-" + ("horizontal" === opts.type ? "horizontal" : "vertical") + " " + this._themeClassFromOption(opts.theme) + " " + (opts.corners ? "ui-corner-all " : "") + (opts.mini ? "ui-mini " : "")).wrapInner("<div class='ui-controlgroup-controls " + (!0 === opts.shadow ? "ui-shadow" : "") + "'></div>").children()
                };
                return ui.groupLegend.length > 0 && $("<div role='heading' class='ui-controlgroup-label'></div>").append(ui.groupLegend).prependTo(elem), ui;
            },
            _init: function() {
                this.refresh();
            },
            _setOptions: function(options) {
                var callRefresh, returnValue, elem = this.element;
                return void 0 !== options.type && (elem.removeClass("ui-controlgroup-horizontal ui-controlgroup-vertical").addClass("ui-controlgroup-" + ("horizontal" === options.type ? "horizontal" : "vertical")), callRefresh = !0), void 0 !== options.theme && elem.removeClass(this._themeClassFromOption(this.options.theme)).addClass(this._themeClassFromOption(options.theme)), options.corners !== undefined && elem.toggleClass("ui-corner-all", options.corners), options.mini !== undefined && elem.toggleClass("ui-mini", options.mini), options.shadow !== undefined && this._ui.childWrapper.toggleClass("ui-shadow", options.shadow), options.excludeInvisible !== undefined && (this.options.excludeInvisible = options.excludeInvisible, callRefresh = !0), returnValue = this._super(options), callRefresh && this.refresh(), returnValue;
            },
            container: function() {
                return this._ui.childWrapper;
            },
            refresh: function() {
                var $el = this.container(), els = $el.find(".ui-btn").not(".ui-slider-handle"), create = this._initialRefresh;
                $.mobile.checkboxradio && $el.find(":mobile-checkboxradio").checkboxradio("refresh"), this._addFirstLastClasses(els, this.options.excludeInvisible ? this._getVisibles(els, create) : els, create), this._initialRefresh = !1;
            },
            _destroy: function() {
                var ui, buttons, opts = this.options;
                if (opts.enhanced) return this;
                ui = this._ui, buttons = this.element.removeClass("ui-controlgroup ui-controlgroup-horizontal ui-controlgroup-vertical ui-corner-all ui-mini " + this._themeClassFromOption(opts.theme)).find(".ui-btn").not(".ui-slider-handle"), this._removeFirstLastClasses(buttons), ui.groupLegend.unwrap(), ui.childWrapper.children().unwrap();
            }
        }, $.mobile.behaviors.addFirstLastClasses));
    }(jQuery), function($, undefined) {
        $.widget("mobile.toolbar", {
            initSelector: ":jqmData(role='footer'), :jqmData(role='header')",
            options: {
                theme: null,
                addBackBtn: !1,
                backBtnTheme: null,
                backBtnText: "Back"
            },
            _create: function() {
                var leftbtn, rightbtn, role = this.element.is(":jqmData(role='header')") ? "header" : "footer", page = this.element.closest(".ui-page");
                0 === page.length && (page = !1, this._on(this.document, {
                    pageshow: "refresh"
                })), $.extend(this, {
                    role: role,
                    page: page,
                    leftbtn: leftbtn,
                    rightbtn: rightbtn
                }), this.element.attr("role", "header" === role ? "banner" : "contentinfo").addClass("ui-" + role), this.refresh(), this._setOptions(this.options);
            },
            _setOptions: function(o) {
                if (void 0 !== o.addBackBtn && (this.options.addBackBtn && "header" === this.role && $(".ui-page").length > 1 && this.page[0].getAttribute("data-" + $.mobile.ns + "url") !== $.mobile.path.stripHash(location.hash) && !this.leftbtn ? this._addBackButton() : this.element.find(".ui-toolbar-back-btn").remove()), null != o.backBtnTheme && this.element.find(".ui-toolbar-back-btn").addClass("ui-btn ui-btn-" + o.backBtnTheme), void 0 !== o.backBtnText && this.element.find(".ui-toolbar-back-btn .ui-btn-text").text(o.backBtnText), o.theme !== undefined) {
                    var currentTheme = this.options.theme ? this.options.theme : "inherit", newTheme = o.theme ? o.theme : "inherit";
                    this.element.removeClass("ui-bar-" + currentTheme).addClass("ui-bar-" + newTheme);
                }
                this._super(o);
            },
            refresh: function() {
                "header" === this.role && this._addHeaderButtonClasses(), this.page || (this._setRelative(), "footer" === this.role && this.element.appendTo("body")), this._addHeadingClasses(), this._btnMarkup();
            },
            _setRelative: function() {
                $("[data-" + $.mobile.ns + "role='page']").css({
                    position: "relative"
                });
            },
            _btnMarkup: function() {
                this.element.children("a").filter(":not([data-" + $.mobile.ns + "role='none'])").attr("data-" + $.mobile.ns + "role", "button"), this.element.trigger("create");
            },
            _addHeaderButtonClasses: function() {
                var $headeranchors = this.element.children("a, button");
                this.leftbtn = $headeranchors.hasClass("ui-btn-left"), this.rightbtn = $headeranchors.hasClass("ui-btn-right"), this.leftbtn = this.leftbtn || $headeranchors.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length, this.rightbtn = this.rightbtn || $headeranchors.eq(1).addClass("ui-btn-right").length;
            },
            _addBackButton: function() {
                var options = this.options, theme = options.backBtnTheme || options.theme;
                $("<a role='button' href='javascript:void(0);' class='ui-btn ui-corner-all ui-shadow ui-btn-left " + (theme ? "ui-btn-" + theme + " " : "") + "ui-toolbar-back-btn ui-icon-carat-l ui-btn-icon-left' data-" + $.mobile.ns + "rel='back'>" + options.backBtnText + "</a>").prependTo(this.element);
            },
            _addHeadingClasses: function() {
                this.element.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({
                    role: "heading",
                    "aria-level": "1"
                });
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.toolbar", $.mobile.toolbar, {
            options: {
                position: null,
                visibleOnPageShow: !0,
                disablePageZoom: !0,
                transition: "slide",
                fullscreen: !1,
                tapToggle: !0,
                tapToggleBlacklist: "a, button, input, select, textarea, .ui-header-fixed, .ui-footer-fixed, .ui-flipswitch, .ui-popup, .ui-panel, .ui-panel-dismiss-open",
                hideDuringFocus: "input, textarea, select",
                updatePagePadding: !0,
                trackPersistentToolbars: !0,
                supportBlacklist: function() {
                    return !$.support.fixedPosition;
                }
            },
            _create: function() {
                this._super(), "fixed" !== this.options.position || this.options.supportBlacklist() || this._makeFixed();
            },
            _makeFixed: function() {
                this.element.addClass("ui-" + this.role + "-fixed"), this.updatePagePadding(), this._addTransitionClass(), this._bindPageEvents(), this._bindToggleHandlers();
            },
            _setOptions: function(o) {
                if ("fixed" === o.position && "fixed" !== this.options.position && this._makeFixed(), "fixed" === this.options.position && !this.options.supportBlacklist()) {
                    var $page = this.page ? this.page : $(".ui-page-active").length > 0 ? $(".ui-page-active") : $(".ui-page").eq(0);
                    void 0 !== o.fullscreen && (o.fullscreen ? (this.element.addClass("ui-" + this.role + "-fullscreen"), $page.addClass("ui-page-" + this.role + "-fullscreen")) : (this.element.removeClass("ui-" + this.role + "-fullscreen"), $page.removeClass("ui-page-" + this.role + "-fullscreen").addClass("ui-page-" + this.role + "-fixed")));
                }
                this._super(o);
            },
            _addTransitionClass: function() {
                var tclass = this.options.transition;
                tclass && "none" !== tclass && ("slide" === tclass && (tclass = this.element.hasClass("ui-header") ? "slidedown" : "slideup"), this.element.addClass(tclass));
            },
            _bindPageEvents: function() {
                var page = this.page ? this.element.closest(".ui-page") : this.document;
                this._on(page, {
                    pagebeforeshow: "_handlePageBeforeShow",
                    webkitAnimationStart: "_handleAnimationStart",
                    animationstart: "_handleAnimationStart",
                    updatelayout: "_handleAnimationStart",
                    pageshow: "_handlePageShow",
                    pagebeforehide: "_handlePageBeforeHide"
                });
            },
            _handlePageBeforeShow: function() {
                var o = this.options;
                o.disablePageZoom && $.mobile.zoom.disable(!0), o.visibleOnPageShow || this.hide(!0);
            },
            _handleAnimationStart: function() {
                this.options.updatePagePadding && this.updatePagePadding(this.page ? this.page : ".ui-page-active");
            },
            _handlePageShow: function() {
                this.updatePagePadding(this.page ? this.page : ".ui-page-active"), this.options.updatePagePadding && this._on(this.window, {
                    throttledresize: "updatePagePadding"
                });
            },
            _handlePageBeforeHide: function(e, ui) {
                var thisFooter, thisHeader, nextFooter, nextHeader, o = this.options;
                o.disablePageZoom && $.mobile.zoom.enable(!0), o.updatePagePadding && this._off(this.window, "throttledresize"), o.trackPersistentToolbars && (thisFooter = $(".ui-footer-fixed:jqmData(id)", this.page), thisHeader = $(".ui-header-fixed:jqmData(id)", this.page), nextFooter = thisFooter.length && ui.nextPage && $(".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData("id") + "')", ui.nextPage) || $(), nextHeader = thisHeader.length && ui.nextPage && $(".ui-header-fixed:jqmData(id='" + thisHeader.jqmData("id") + "')", ui.nextPage) || $(), (nextFooter.length || nextHeader.length) && (nextFooter.add(nextHeader).appendTo($.mobile.pageContainer), ui.nextPage.one("pageshow", function() {
                    nextHeader.prependTo(this), nextFooter.appendTo(this);
                })));
            },
            _visible: !0,
            updatePagePadding: function(tbPage) {
                var $el = this.element, header = "header" === this.role, pos = parseFloat($el.css(header ? "top" : "bottom"));
                !this.options.fullscreen && (tbPage = tbPage && void 0 === tbPage.type && tbPage || this.page || $el.closest(".ui-page"), $(tbPage = this.page ? this.page : ".ui-page-active").css("padding-" + (header ? "top" : "bottom"), $el.outerHeight() + pos));
            },
            _useTransition: function(notransition) {
                var $win = this.window, $el = this.element, scroll = $win.scrollTop(), elHeight = $el.height(), pHeight = this.page ? $el.closest(".ui-page").height() : $(".ui-page-active").height(), viewportHeight = $.mobile.getScreenHeight();
                return !notransition && (this.options.transition && "none" !== this.options.transition && ("header" === this.role && !this.options.fullscreen && scroll > elHeight || "footer" === this.role && !this.options.fullscreen && scroll + viewportHeight < pHeight - elHeight) || this.options.fullscreen);
            },
            show: function(notransition) {
                var hideClass = "ui-fixed-hidden", $el = this.element;
                this._useTransition(notransition) ? $el.removeClass("out " + hideClass).addClass("in").animationComplete(function() {
                    $el.removeClass("in");
                }) : $el.removeClass(hideClass), this._visible = !0;
            },
            hide: function(notransition) {
                var hideClass = "ui-fixed-hidden", $el = this.element, outclass = "out" + ("slide" === this.options.transition ? " reverse" : "");
                this._useTransition(notransition) ? $el.addClass(outclass).removeClass("in").animationComplete(function() {
                    $el.addClass(hideClass).removeClass(outclass);
                }) : $el.addClass(hideClass).removeClass(outclass), this._visible = !1;
            },
            toggle: function() {
                this[this._visible ? "hide" : "show"]();
            },
            _bindToggleHandlers: function() {
                var delayShow, delayHide, self = this, o = self.options, isVisible = !0;
                (this.page ? this.page : $(".ui-page")).bind("vclick", function(e) {
                    o.tapToggle && !$(e.target).closest(o.tapToggleBlacklist).length && self.toggle();
                }).bind("focusin focusout", function(e) {
                    screen.width < 1025 && $(e.target).is(o.hideDuringFocus) && !$(e.target).closest(".ui-header-fixed, .ui-footer-fixed").length && ("focusout" !== e.type || isVisible ? "focusin" === e.type && isVisible && (clearTimeout(delayShow), isVisible = !1, delayHide = setTimeout(function() {
                        self.hide();
                    }, 0)) : (isVisible = !0, clearTimeout(delayHide), delayShow = setTimeout(function() {
                        self.show();
                    }, 0)));
                });
            },
            _setRelative: function() {
                "fixed" !== this.options.position && $("[data-" + $.mobile.ns + "role='page']").css({
                    position: "relative"
                });
            },
            _destroy: function() {
                var $el = this.element, header = $el.hasClass("ui-header");
                $el.closest(".ui-page").css("padding-" + (header ? "top" : "bottom"), ""), $el.removeClass("ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden"), $el.closest(".ui-page").removeClass("ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen");
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.toolbar", $.mobile.toolbar, {
            _makeFixed: function() {
                this._super(), this._workarounds();
            },
            _workarounds: function() {
                var ua = navigator.userAgent, platform = navigator.platform, wkmatch = ua.match(/AppleWebKit\/([0-9]+)/), wkversion = !!wkmatch && wkmatch[1], os = null;
                if (platform.indexOf("iPhone") > -1 || platform.indexOf("iPad") > -1 || platform.indexOf("iPod") > -1) os = "ios";
                else {
                    if (!(ua.indexOf("Android") > -1)) return;
                    os = "android";
                }
                if ("ios" === os) this._bindScrollWorkaround();
                else {
                    if ("android" !== os || !wkversion || !(wkversion < 534)) return;
                    this._bindScrollWorkaround(), this._bindListThumbWorkaround();
                }
            },
            _viewportOffset: function() {
                var $el = this.element, header = $el.hasClass("ui-header"), offset = Math.abs($el.offset().top - this.window.scrollTop());
                return header || (offset = Math.round(offset - this.window.height() + $el.outerHeight()) - 60), offset;
            },
            _bindScrollWorkaround: function() {
                var self = this;
                this._on(this.window, {
                    scrollstop: function() {
                        self._viewportOffset() > 2 && self._visible && self._triggerRedraw();
                    }
                });
            },
            _bindListThumbWorkaround: function() {
                this.element.closest(".ui-page").addClass("ui-android-2x-fixed");
            },
            _triggerRedraw: function() {
                var paddingBottom = parseFloat($(".ui-page-active").css("padding-bottom"));
                $(".ui-page-active").css("padding-bottom", paddingBottom + 1 + "px"), setTimeout(function() {
                    $(".ui-page-active").css("padding-bottom", paddingBottom + "px");
                }, 0);
            },
            destroy: function() {
                this._super(), this.element.closest(".ui-page-active").removeClass("ui-android-2x-fix");
            }
        });
    }(jQuery), function($, undefined) {
        var ieHack = $.mobile.browser.oldIE && $.mobile.browser.oldIE <= 8, uiTemplate = $("<div class='ui-popup-arrow-guide'></div><div class='ui-popup-arrow-container" + (ieHack ? " ie" : "") + "'><div class='ui-popup-arrow'></div></div>");
        $.widget("mobile.popup", $.mobile.popup, {
            options: {
                arrow: ""
            },
            _create: function() {
                var ret = this._super();
                return this.options.arrow && (this._ui.arrow = this._addArrow()), ret;
            },
            _addArrow: function() {
                var clone, gd, ct, ar, theme, opts = this.options, ar1 = (gd = (clone = uiTemplate.clone()).eq(0), ar = (ct = clone.eq(1)).children(), {
                    arEls: ct.add(gd),
                    gd: gd,
                    ct: ct,
                    ar: ar
                });
                return theme = this._themeClassFromOption("ui-body-", opts.theme), ar1.ar.addClass(theme + (opts.shadow ? " ui-overlay-shadow" : "")), ar1.arEls.hide().appendTo(this.element), ar1;
            },
            _unenhance: function() {
                var ar = this._ui.arrow;
                return ar && ar.arEls.remove(), this._super();
            },
            _tryAnArrow: function(p, dir, desired, s, best) {
                var result, r, diff, desiredForArrow = {}, tip = {};
                return s.arFull[p.dimKey] > s.guideDims[p.dimKey] || (desiredForArrow[p.fst] = desired[p.fst] + (s.arHalf[p.oDimKey] + s.menuHalf[p.oDimKey]) * p.offsetFactor - s.contentBox[p.fst] + (s.clampInfo.menuSize[p.oDimKey] - s.contentBox[p.oDimKey]) * p.arrowOffsetFactor, desiredForArrow[p.snd] = desired[p.snd], r = {
                    x: (result = s.result || this._calculateFinalLocation(desiredForArrow, s.clampInfo)).left,
                    y: result.top
                }, tip[p.fst] = r[p.fst] + s.contentBox[p.fst] + p.tipOffset, tip[p.snd] = Math.max(result[p.prop] + s.guideOffset[p.prop] + s.arHalf[p.dimKey], Math.min(result[p.prop] + s.guideOffset[p.prop] + s.guideDims[p.dimKey] - s.arHalf[p.dimKey], desired[p.snd])), diff = Math.abs(desired.x - tip.x) + Math.abs(desired.y - tip.y), (!best || diff < best.diff) && (tip[p.snd] -= s.arHalf[p.dimKey] + result[p.prop] + s.contentBox[p.snd], best = {
                    dir: dir,
                    diff: diff,
                    result: result,
                    posProp: p.prop,
                    posVal: tip[p.snd]
                })), best;
            },
            _getPlacementState: function(clamp) {
                var offset, gdOffset, ar = this._ui.arrow, state = {
                    clampInfo: this._clampPopupWidth(!clamp),
                    arFull: {
                        cx: ar.ct.width(),
                        cy: ar.ct.height()
                    },
                    guideDims: {
                        cx: ar.gd.width(),
                        cy: ar.gd.height()
                    },
                    guideOffset: ar.gd.offset()
                };
                return offset = this.element.offset(), ar.gd.css({
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0
                }), gdOffset = ar.gd.offset(), state.contentBox = {
                    x: gdOffset.left - offset.left,
                    y: gdOffset.top - offset.top,
                    cx: ar.gd.width(),
                    cy: ar.gd.height()
                }, ar.gd.removeAttr("style"), state.guideOffset = {
                    left: state.guideOffset.left - offset.left,
                    top: state.guideOffset.top - offset.top
                }, state.arHalf = {
                    cx: state.arFull.cx / 2,
                    cy: state.arFull.cy / 2
                }, state.menuHalf = {
                    cx: state.clampInfo.menuSize.cx / 2,
                    cy: state.clampInfo.menuSize.cy / 2
                }, state;
            },
            _placementCoords: function(desired) {
                var state, best, params, elOffset, bgRef, optionValue = this.options.arrow, ar = this._ui.arrow;
                return ar ? (ar.arEls.show(), bgRef = {}, params = {
                    l: {
                        fst: "x",
                        snd: "y",
                        prop: "top",
                        dimKey: "cy",
                        oDimKey: "cx",
                        offsetFactor: 1,
                        tipOffset: -(state = this._getPlacementState(!0)).arHalf.cx,
                        arrowOffsetFactor: 0
                    },
                    r: {
                        fst: "x",
                        snd: "y",
                        prop: "top",
                        dimKey: "cy",
                        oDimKey: "cx",
                        offsetFactor: -1,
                        tipOffset: state.arHalf.cx + state.contentBox.cx,
                        arrowOffsetFactor: 1
                    },
                    b: {
                        fst: "y",
                        snd: "x",
                        prop: "left",
                        dimKey: "cx",
                        oDimKey: "cy",
                        offsetFactor: -1,
                        tipOffset: state.arHalf.cy + state.contentBox.cy,
                        arrowOffsetFactor: 1
                    },
                    t: {
                        fst: "y",
                        snd: "x",
                        prop: "left",
                        dimKey: "cx",
                        oDimKey: "cy",
                        offsetFactor: 1,
                        tipOffset: -state.arHalf.cy,
                        arrowOffsetFactor: 0
                    }
                }, $.each((!0 === optionValue ? "l,t,r,b" : optionValue).split(","), $.proxy(function(key, value) {
                    best = this._tryAnArrow(params[value], value, desired, state, best);
                }, this)), best) ? (ar.ct.removeClass("ui-popup-arrow-l ui-popup-arrow-t ui-popup-arrow-r ui-popup-arrow-b").addClass("ui-popup-arrow-" + best.dir).removeAttr("style").css(best.posProp, best.posVal).show(), ieHack || (elOffset = this.element.offset(), bgRef[params[best.dir].fst] = ar.ct.offset(), bgRef[params[best.dir].snd] = {
                    left: elOffset.left + state.contentBox.x,
                    top: elOffset.top + state.contentBox.y
                }), best.result) : (ar.arEls.hide(), this._super(desired)) : this._super(desired);
            },
            _setOptions: function(opts) {
                var newTheme, oldTheme = this.options.theme, ar = this._ui.arrow, ret = this._super(opts);
                if (void 0 !== opts.arrow) {
                    if (!ar && opts.arrow) {
                        this._ui.arrow = this._addArrow();
                        return;
                    }
                    ar && !opts.arrow && (ar.arEls.remove(), this._ui.arrow = null);
                }
                return (ar = this._ui.arrow) && (void 0 !== opts.theme && (oldTheme = this._themeClassFromOption("ui-body-", oldTheme), newTheme = this._themeClassFromOption("ui-body-", opts.theme), ar.ar.removeClass(oldTheme).addClass(newTheme)), opts.shadow !== undefined && ar.ar.toggleClass("ui-overlay-shadow", opts.shadow)), ret;
            },
            _destroy: function() {
                var ar = this._ui.arrow;
                return ar && ar.arEls.remove(), this._super();
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.panel", {
            options: {
                classes: {
                    panel: "ui-panel",
                    panelOpen: "ui-panel-open",
                    panelClosed: "ui-panel-closed",
                    panelFixed: "ui-panel-fixed",
                    panelInner: "ui-panel-inner",
                    modal: "ui-panel-dismiss",
                    modalOpen: "ui-panel-dismiss-open",
                    pageContainer: "ui-panel-page-container",
                    pageWrapper: "ui-panel-wrapper",
                    pageFixedToolbar: "ui-panel-fixed-toolbar",
                    pageContentPrefix: "ui-panel-page-content",
                    animate: "ui-panel-animate"
                },
                animate: !0,
                theme: null,
                position: "left",
                dismissible: !0,
                display: "reveal",
                swipeClose: !0,
                positionFixed: !1
            },
            _closeLink: null,
            _parentPage: null,
            _page: null,
            _modal: null,
            _panelInner: null,
            _wrapper: null,
            _fixedToolbars: null,
            _create: function() {
                var el = this.element, parentPage = el.closest(".ui-page, :jqmData(role='page')");
                $.extend(this, {
                    _closeLink: el.find(":jqmData(rel='close')"),
                    _parentPage: parentPage.length > 0 && parentPage,
                    _openedPage: null,
                    _page: this._getPage,
                    _panelInner: this._getPanelInner(),
                    _fixedToolbars: this._getFixedToolbars
                }), "overlay" !== this.options.display && this._getWrapper(), this._addPanelClasses(), $.support.cssTransform3d && this.options.animate && this.element.addClass(this.options.classes.animate), this._bindUpdateLayout(), this._bindCloseEvents(), this._bindLinkListeners(), this._bindPageEvents(), this.options.dismissible && this._createModal(), this._bindSwipeEvents();
            },
            _getPanelInner: function() {
                var panelInner = this.element.find("." + this.options.classes.panelInner);
                return 0 === panelInner.length && (panelInner = this.element.children().wrapAll("<div class='" + this.options.classes.panelInner + "' />").parent()), panelInner;
            },
            _createModal: function() {
                var self = this, target = self._parentPage ? self._parentPage.parent() : self.element.parent();
                self._modal = $("<div class='" + self.options.classes.modal + "'></div>").on("mousedown", function() {
                    self.close();
                }).appendTo(target);
            },
            _getPage: function() {
                return this._openedPage || this._parentPage || $("." + $.mobile.activePageClass);
            },
            _getWrapper: function() {
                var wrapper = this._page().find("." + this.options.classes.pageWrapper);
                0 === wrapper.length && (wrapper = this._page().children(".ui-header:not(.ui-header-fixed), .ui-content:not(.ui-popup), .ui-footer:not(.ui-footer-fixed)").wrapAll("<div class='" + this.options.classes.pageWrapper + "'></div>").parent()), this._wrapper = wrapper;
            },
            _getFixedToolbars: function() {
                var extFixedToolbars = $("body").children(".ui-header-fixed, .ui-footer-fixed"), intFixedToolbars = this._page().find(".ui-header-fixed, .ui-footer-fixed");
                return extFixedToolbars.add(intFixedToolbars).addClass(this.options.classes.pageFixedToolbar);
            },
            _getPosDisplayClasses: function(prefix) {
                return prefix + "-position-" + this.options.position + " " + prefix + "-display-" + this.options.display;
            },
            _getPanelClasses: function() {
                var panelClasses = this.options.classes.panel + " " + this._getPosDisplayClasses(this.options.classes.panel) + " " + this.options.classes.panelClosed + " ui-body-" + (this.options.theme ? this.options.theme : "inherit");
                return this.options.positionFixed && (panelClasses += " " + this.options.classes.panelFixed), panelClasses;
            },
            _addPanelClasses: function() {
                this.element.addClass(this._getPanelClasses());
            },
            _handleCloseClickAndEatEvent: function(event1) {
                if (!event1.isDefaultPrevented()) return event1.preventDefault(), this.close(), !1;
            },
            _handleCloseClick: function(event1) {
                event1.isDefaultPrevented() || this.close();
            },
            _bindCloseEvents: function() {
                this._on(this._closeLink, {
                    click: "_handleCloseClick"
                }), this._on({
                    "click a:jqmData(ajax='false')": "_handleCloseClick"
                });
            },
            _positionPanel: function(scrollToTop) {
                var panelInnerHeight = this._panelInner.outerHeight(), expand = panelInnerHeight > $.mobile.getScreenHeight();
                expand || !this.options.positionFixed ? (expand && (this._unfixPanel(), $.mobile.resetActivePageHeight(panelInnerHeight)), scrollToTop && this.window[0].scrollTo(0, $.mobile.defaultHomeScroll)) : this._fixPanel();
            },
            _bindFixListener: function() {
                this._on($(window), {
                    throttledresize: "_positionPanel"
                });
            },
            _unbindFixListener: function() {
                this._off($(window), "throttledresize");
            },
            _unfixPanel: function() {
                this.options.positionFixed && $.support.fixedPosition && this.element.removeClass(this.options.classes.panelFixed);
            },
            _fixPanel: function() {
                this.options.positionFixed && $.support.fixedPosition && this.element.addClass(this.options.classes.panelFixed);
            },
            _bindUpdateLayout: function() {
                var self = this;
                self.element.on("updatelayout", function() {
                    self._open && self._positionPanel();
                });
            },
            _bindLinkListeners: function() {
                this._on("body", {
                    "click a": "_handleClick"
                });
            },
            _handleClick: function(e) {
                var link, panelId = this.element.attr("id");
                if (e.currentTarget.href.split("#")[1] === panelId && void 0 !== panelId) return e.preventDefault(), (link = $(e.target)).hasClass("ui-btn") && (link.addClass($.mobile.activeBtnClass), this.element.one("panelopen panelclose", function() {
                    link.removeClass($.mobile.activeBtnClass);
                })), this.toggle(), !1;
            },
            _bindSwipeEvents: function() {
                var self = this, area = self._modal ? self.element.add(self._modal) : self.element;
                self.options.swipeClose && ("left" === self.options.position ? area.on("swipeleft.panel", function() {
                    self.close();
                }) : area.on("swiperight.panel", function() {
                    self.close();
                }));
            },
            _bindPageEvents: function() {
                var self = this;
                this.document.on("panelbeforeopen", function(e) {
                    self._open && e.target !== self.element[0] && self.close();
                }).on("keyup.panel", function(e) {
                    27 === e.keyCode && self._open && self.close();
                }), this._parentPage || "overlay" === this.options.display || this._on(this.document, {
                    pageshow: "_getWrapper"
                }), self._parentPage ? this.document.on("pagehide", ":jqmData(role='page')", function() {
                    self._open && self.close(!0);
                }) : this.document.on("pagebeforehide", function() {
                    self._open && self.close(!0);
                });
            },
            _open: !1,
            _pageContentOpenClasses: null,
            _modalOpenClasses: null,
            open: function(immediate) {
                if (!this._open) {
                    var self = this, o = self.options, _openPanel = function() {
                        self.document.off("panelclose"), self._page().jqmData("panel", "open"), $.support.cssTransform3d && o.animate && "overlay" !== o.display && (self._wrapper.addClass(o.classes.animate), self._fixedToolbars().addClass(o.classes.animate)), !immediate && $.support.cssTransform3d && o.animate ? self.element.animationComplete(complete, "transition") : setTimeout(complete, 0), o.theme && "overlay" !== o.display && self._page().parent().addClass(o.classes.pageContainer + "-themed " + o.classes.pageContainer + "-" + o.theme), self.element.removeClass(o.classes.panelClosed).addClass(o.classes.panelOpen), self._positionPanel(!0), self._pageContentOpenClasses = self._getPosDisplayClasses(o.classes.pageContentPrefix), "overlay" !== o.display && (self._page().parent().addClass(o.classes.pageContainer), self._wrapper.addClass(self._pageContentOpenClasses), self._fixedToolbars().addClass(self._pageContentOpenClasses)), self._modalOpenClasses = self._getPosDisplayClasses(o.classes.modal) + " " + o.classes.modalOpen, self._modal && self._modal.addClass(self._modalOpenClasses).height(Math.max(self._modal.height(), self.document.height()));
                    }, complete = function() {
                        "overlay" !== o.display && (self._wrapper.addClass(o.classes.pageContentPrefix + "-open"), self._fixedToolbars().addClass(o.classes.pageContentPrefix + "-open")), self._bindFixListener(), self._trigger("open"), self._openedPage = self._page();
                    };
                    self._trigger("beforeopen"), "open" === self._page().jqmData("panel") ? self.document.on("panelclose", function() {
                        _openPanel();
                    }) : _openPanel(), self._open = !0;
                }
            },
            close: function(immediate) {
                if (this._open) {
                    var self = this, o = this.options, complete = function() {
                        o.theme && "overlay" !== o.display && self._page().parent().removeClass(o.classes.pageContainer + "-themed " + o.classes.pageContainer + "-" + o.theme), self.element.addClass(o.classes.panelClosed), "overlay" !== o.display && (self._page().parent().removeClass(o.classes.pageContainer), self._wrapper.removeClass(o.classes.pageContentPrefix + "-open"), self._fixedToolbars().removeClass(o.classes.pageContentPrefix + "-open")), $.support.cssTransform3d && o.animate && "overlay" !== o.display && (self._wrapper.removeClass(o.classes.animate), self._fixedToolbars().removeClass(o.classes.animate)), self._fixPanel(), self._unbindFixListener(), $.mobile.resetActivePageHeight(), self._page().jqmRemoveData("panel"), self._trigger("close"), self._openedPage = null;
                    };
                    self._trigger("beforeclose"), self.element.removeClass(o.classes.panelOpen), "overlay" !== o.display && (self._wrapper.removeClass(self._pageContentOpenClasses), self._fixedToolbars().removeClass(self._pageContentOpenClasses)), !immediate && $.support.cssTransform3d && o.animate ? self.element.animationComplete(complete, "transition") : setTimeout(complete, 0), self._modal && self._modal.removeClass(self._modalOpenClasses), self._open = !1;
                }
            },
            toggle: function() {
                this[this._open ? "close" : "open"]();
            },
            _destroy: function() {
                var o = this.options, multiplePanels = $("body > :mobile-panel").length + $.mobile.activePage.find(":mobile-panel").length > 1;
                "overlay" !== o.display && (0 === $("body > :mobile-panel").add($.mobile.activePage.find(":mobile-panel")).not(".ui-panel-display-overlay").not(this.element).length && this._wrapper.children().unwrap(), this._open && (this._fixedToolbars().removeClass(o.classes.pageContentPrefix + "-open"), $.support.cssTransform3d && o.animate && this._fixedToolbars().removeClass(o.classes.animate), this._page().parent().removeClass(o.classes.pageContainer), o.theme && this._page().parent().removeClass(o.classes.pageContainer + "-themed " + o.classes.pageContainer + "-" + o.theme))), multiplePanels || this.document.off("panelopen panelclose"), this._open && this._page().jqmRemoveData("panel"), this._panelInner.children().unwrap(), this.element.removeClass([
                    this._getPanelClasses(),
                    o.classes.panelOpen,
                    o.classes.animate
                ].join(" ")).off("swipeleft.panel swiperight.panel").off("panelbeforeopen").off("panelhide").off("keyup.panel").off("updatelayout"), this._modal && this._modal.remove();
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.table", {
            options: {
                classes: {
                    table: "ui-table"
                },
                enhanced: !1
            },
            _create: function() {
                this.options.enhanced || this.element.addClass(this.options.classes.table), $.extend(this, {
                    headers: void 0,
                    allHeaders: void 0
                }), this._refresh(!0);
            },
            _setHeaders: function() {
                var trs = this.element.find("thead tr");
                this.headers = this.element.find("tr:eq(0)").children(), this.allHeaders = this.headers.add(trs.children());
            },
            refresh: function() {
                this._refresh();
            },
            rebuild: $.noop,
            _refresh: function() {
                var table = this.element, trs = table.find("thead tr");
                this._setHeaders(), trs.each(function() {
                    var columnCount = 0;
                    $(this).children().each(function() {
                        var j, span = parseInt(this.getAttribute("colspan"), 10), selector = ":nth-child(" + (columnCount + 1) + ")";
                        if (this.setAttribute("data-" + $.mobile.ns + "colstart", columnCount + 1), span) for(j = 0; j < span - 1; j++)selector += ", :nth-child(" + (++columnCount + 1) + ")";
                        $(this).jqmData("cells", table.find("tr").not(trs.eq(0)).not(this).children(selector)), columnCount++;
                    });
                });
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.table", $.mobile.table, {
            options: {
                mode: "columntoggle",
                columnBtnTheme: null,
                columnPopupTheme: null,
                columnBtnText: "Columns...",
                classes: $.extend($.mobile.table.prototype.options.classes, {
                    popup: "ui-table-columntoggle-popup",
                    columnBtn: "ui-table-columntoggle-btn",
                    priorityPrefix: "ui-table-priority-",
                    columnToggleTable: "ui-table-columntoggle"
                })
            },
            _create: function() {
                this._super(), "columntoggle" === this.options.mode && ($.extend(this, {
                    _menu: null
                }), this.options.enhanced ? (this._menu = $(this.document[0].getElementById(this._id() + "-popup")).children().first(), this._addToggles(this._menu, !0)) : (this._menu = this._enhanceColToggle(), this.element.addClass(this.options.classes.columnToggleTable)), this._setupEvents(), this._setToggleState());
            },
            _id: function() {
                return this.element.attr("id") || this.widgetName + this.uuid;
            },
            _setupEvents: function() {
                this._on(this.window, {
                    throttledresize: "_setToggleState"
                }), this._on(this._menu, {
                    "change input": "_menuInputChange"
                });
            },
            _addToggles: function(menu, keep) {
                var inputs, checkboxIndex = 0, opts = this.options, container = menu.controlgroup("container");
                keep ? inputs = menu.find("input") : container.empty(), this.headers.not("td").each(function() {
                    var header = $(this), priority = $.mobile.getAttribute(this, "priority"), cells = header.add(header.jqmData("cells"));
                    priority && (cells.addClass(opts.classes.priorityPrefix + priority), (keep ? inputs.eq(checkboxIndex++) : $("<label><input type='checkbox' checked />" + (header.children("abbr").first().attr("title") || header.text()) + "</label>").appendTo(container).children(0).checkboxradio({
                        theme: opts.columnPopupTheme
                    })).jqmData("cells", cells));
                }), keep || menu.controlgroup("refresh");
            },
            _menuInputChange: function(evt) {
                var input = $(evt.target), checked = input[0].checked;
                input.jqmData("cells").toggleClass("ui-table-cell-hidden", !checked).toggleClass("ui-table-cell-visible", checked), input[0].getAttribute("locked") ? (input.removeAttr("locked"), this._unlockCells(input.jqmData("cells"))) : input.attr("locked", !0);
            },
            _unlockCells: function(cells) {
                cells.removeClass("ui-table-cell-hidden ui-table-cell-visible");
            },
            _enhanceColToggle: function() {
                var id, menuButton, popup, menu, table = this.element, opts = this.options, ns = $.mobile.ns, fragment = this.document[0].createDocumentFragment();
                return menuButton = $("<a href='#" + (id = this._id() + "-popup") + "' class='" + opts.classes.columnBtn + " ui-btn ui-btn-" + (opts.columnBtnTheme || "a") + " ui-corner-all ui-shadow ui-mini' data-" + ns + "rel='popup'>" + opts.columnBtnText + "</a>"), popup = $("<div class='" + opts.classes.popup + "' id='" + id + "'></div>"), menu = $("<fieldset></fieldset>").controlgroup(), this._addToggles(menu, !1), menu.appendTo(popup), fragment.appendChild(popup[0]), fragment.appendChild(menuButton[0]), table.before(fragment), popup.popup(), menu;
            },
            rebuild: function() {
                this._super(), "columntoggle" === this.options.mode && this._refresh(!1);
            },
            _refresh: function(create) {
                this._super(create), create || "columntoggle" !== this.options.mode || (this._unlockCells(this.element.find(".ui-table-cell-hidden, .ui-table-cell-visible")), this._addToggles(this._menu, create), this._setToggleState());
            },
            _setToggleState: function() {
                this._menu.find("input").each(function() {
                    var checkbox = $(this);
                    this.checked = "table-cell" === checkbox.jqmData("cells").eq(0).css("display"), checkbox.checkboxradio("refresh");
                });
            },
            _destroy: function() {
                this._super();
            }
        });
    }(jQuery), function($, undefined) {
        $.widget("mobile.table", $.mobile.table, {
            options: {
                mode: "reflow",
                classes: $.extend($.mobile.table.prototype.options.classes, {
                    reflowTable: "ui-table-reflow",
                    cellLabels: "ui-table-cell-label"
                })
            },
            _create: function() {
                this._super(), "reflow" === this.options.mode && (this.options.enhanced || (this.element.addClass(this.options.classes.reflowTable), this._updateReflow()));
            },
            rebuild: function() {
                this._super(), "reflow" === this.options.mode && this._refresh(!1);
            },
            _refresh: function(create) {
                this._super(create), create || "reflow" !== this.options.mode || this._updateReflow();
            },
            _updateReflow: function() {
                var table = this, opts = this.options;
                $(table.allHeaders.get().reverse()).each(function() {
                    var iteration, filter, cells = $(this).jqmData("cells"), colstart = $.mobile.getAttribute(this, "colstart"), hierarchyClass = cells.not(this).filter("thead th").length && " ui-table-cell-label-top", text = $(this).text();
                    "" !== text && (hierarchyClass ? (iteration = parseInt(this.getAttribute("colspan"), 10), filter = "", iteration && (filter = "td:nth-child(" + iteration + "n + " + colstart + ")"), table._addLabels(cells.filter(filter), opts.classes.cellLabels + hierarchyClass, text)) : table._addLabels(cells, opts.classes.cellLabels, text));
                });
            },
            _addLabels: function(cells, label, text) {
                cells.not(":has(b." + label + ")").prepend("<b class='" + label + "'>" + text + "</b>");
            }
        });
    }(jQuery), function($, undefined) {
        var defaultFilterCallback = function(index, searchValue) {
            return -1 === ("" + ($.mobile.getAttribute(this, "filtertext") || $(this).text())).toLowerCase().indexOf(searchValue);
        };
        $.widget("mobile.filterable", {
            initSelector: ":jqmData(filter='true')",
            options: {
                filterReveal: !1,
                filterCallback: defaultFilterCallback,
                enhanced: !1,
                input: null,
                children: "> li, > option, > optgroup option, > tbody tr, > .ui-controlgroup-controls > .ui-btn, > .ui-controlgroup-controls > .ui-checkbox, > .ui-controlgroup-controls > .ui-radio"
            },
            _create: function() {
                var opts = this.options;
                $.extend(this, {
                    _search: null,
                    _timer: 0
                }), this._setInput(opts.input), opts.enhanced || this._filterItems((this._search && this._search.val() || "").toLowerCase());
            },
            _onKeyUp: function() {
                var val, lastval, search = this._search;
                if (search) {
                    if (val = search.val().toLowerCase(), (lastval = $.mobile.getAttribute(search[0], "lastval") + "") && lastval === val) return;
                    this._timer && (window.clearTimeout(this._timer), this._timer = 0), this._timer = this._delay(function() {
                        this._trigger("beforefilter", null, {
                            input: search
                        }), search[0].setAttribute("data-" + $.mobile.ns + "lastval", val), this._filterItems(val), this._timer = 0;
                    }, 250);
                }
            },
            _getFilterableItems: function() {
                var elem = this.element, children = this.options.children, items = children ? $.isFunction(children) ? children() : children.nodeName ? $(children) : children.jquery ? children : this.element.find(children) : {
                    length: 0
                };
                return 0 === items.length && (items = elem.children()), items;
            },
            _filterItems: function(val) {
                var idx, callback, length, show = [], hide = [], opts = this.options, filterItems = this._getFilterableItems();
                if (null != val) for(idx = 0, callback = opts.filterCallback || defaultFilterCallback, length = filterItems.length; idx < length; idx++)(callback.call(filterItems[idx], idx, val) ? hide : show).push(filterItems[idx]);
                0 === hide.length ? filterItems[opts.filterReveal ? "addClass" : "removeClass"]("ui-screen-hidden") : ($(hide).addClass("ui-screen-hidden"), $(show).removeClass("ui-screen-hidden")), this._refreshChildWidget(), this._trigger("filter", null, {
                    items: filterItems
                });
            },
            _refreshChildWidget: function() {
                var widget, idx, recognizedWidgets = [
                    "collapsibleset",
                    "selectmenu",
                    "controlgroup",
                    "listview"
                ];
                for(idx = recognizedWidgets.length - 1; idx > -1; idx--)widget = recognizedWidgets[idx], $.mobile[widget] && (widget = this.element.data("mobile-" + widget)) && $.isFunction(widget.refresh) && widget.refresh();
            },
            _setInput: function(selector) {
                var search = this._search;
                this._timer && (window.clearTimeout(this._timer), this._timer = 0), search && (this._off(search, "keyup change input"), search = null), selector && (search = selector.jquery ? selector : selector.nodeName ? $(selector) : this.document.find(selector), this._on(search, {
                    keyup: "_onKeyUp",
                    change: "_onKeyUp",
                    input: "_onKeyUp"
                })), this._search = search;
            },
            _setOptions: function(options) {
                var refilter = !(void 0 === options.filterReveal && void 0 === options.filterCallback && options.children === undefined);
                this._super(options), options.input !== undefined && (this._setInput(options.input), refilter = !0), refilter && this.refresh();
            },
            _destroy: function() {
                var opts = this.options, items = this._getFilterableItems();
                opts.enhanced ? items.toggleClass("ui-screen-hidden", opts.filterReveal) : items.removeClass("ui-screen-hidden");
            },
            refresh: function() {
                this._timer && (window.clearTimeout(this._timer), this._timer = 0), this._filterItems((this._search && this._search.val() || "").toLowerCase());
            }
        });
    }(jQuery), rDividerListItem = /(^|\s)ui-li-divider(\s|$)/, origDefaultFilterCallback = jQuery.mobile.filterable.prototype.options.filterCallback, jQuery.mobile.filterable.prototype.options.filterCallback = function(index, searchValue) {
        return !this.className.match(rDividerListItem) && origDefaultFilterCallback.call(this, index, searchValue);
    }, jQuery.widget("mobile.filterable", jQuery.mobile.filterable, {
        options: {
            filterPlaceholder: "Filter items...",
            filterTheme: null
        },
        _create: function() {
            var idx, widgetName, elem = this.element, recognizedWidgets = [
                "collapsibleset",
                "selectmenu",
                "controlgroup",
                "listview"
            ], createHandlers = {};
            for(this._super(), jQuery.extend(this, {
                _widget: null
            }), idx = recognizedWidgets.length - 1; idx > -1; idx--)if (widgetName = recognizedWidgets[idx], jQuery.mobile[widgetName]) {
                if (this._setWidget(elem.data("mobile-" + widgetName))) break;
                createHandlers[widgetName + "create"] = "_handleCreate";
            }
            this._widget || this._on(elem, createHandlers);
        },
        _handleCreate: function(evt) {
            this._setWidget(this.element.data("mobile-" + evt.type.substring(0, evt.type.length - 6)));
        },
        _trigger: function(type, event1, data) {
            this._widget && "mobile-listview" === this._widget.widgetFullName && "beforefilter" === type && this._widget._trigger("beforefilter", event1, data), this._super(type, event1, data);
        },
        _setWidget: function(widget) {
            if (!this._widget && widget) {
                var self, orig;
                this._widget = widget, this._widget._setOptions = (self = this, orig = this._widget._setOptions, function(options) {
                    orig.call(this, options), self._syncTextInputOptions(options);
                });
            }
            return this._widget && (this._syncTextInputOptions(this._widget.options), "listview" === this._widget.widgetName && (this._widget.options.hideDividers = !0, this._widget.element.listview("refresh"))), !!this._widget;
        },
        _isSearchInternal: function() {
            return this._search && this._search.jqmData("ui-filterable-" + this.uuid + "-internal");
        },
        _setInput: function(selector) {
            var opts = this.options, updatePlaceholder = !0, textinputOpts = {};
            if (!selector) {
                if (this._isSearchInternal()) return;
                updatePlaceholder = !1, selector = jQuery("<input data-" + jQuery.mobile.ns + "type='search' placeholder='" + opts.filterPlaceholder + "'></input>").jqmData("ui-filterable-" + this.uuid + "-internal", !0), jQuery("<form class='ui-filterable'></form>").append(selector).submit(function(evt) {
                    evt.preventDefault(), selector.blur();
                }).insertBefore(this.element), jQuery.mobile.textinput && (null != this.options.filterTheme && (textinputOpts.theme = opts.filterTheme), selector.textinput(textinputOpts));
            }
            this._super(selector), this._isSearchInternal() && updatePlaceholder && this._search.attr("placeholder", this.options.filterPlaceholder);
        },
        _setOptions: function(options) {
            var ret = this._super(options);
            return void 0 !== options.filterPlaceholder && this._isSearchInternal() && this._search.attr("placeholder", options.filterPlaceholder), options.filterTheme !== undefined9 && this._search && jQuery.mobile.textinput && this._search.textinput("option", "theme", options.filterTheme), ret;
        },
        _destroy: function() {
            this._isSearchInternal() && this._search.remove(), this._super();
        },
        _syncTextInputOptions: function(options) {
            var idx, textinputOptions = {};
            if (this._isSearchInternal() && jQuery.mobile.textinput) {
                for(idx in jQuery.mobile.textinput.prototype.options)options[idx] !== undefined9 && ("theme" === idx && null != this.options.filterTheme ? textinputOptions[idx] = this.options.filterTheme : textinputOptions[idx] = options[idx]);
                this._search.textinput("option", textinputOptions);
            }
        }
    }), function($, undefined) {
        var tabId = 0, rhash = /#.*$/;
        function isLocal(anchor) {
            return anchor.hash.length > 1 && decodeURIComponent(anchor.href.replace(rhash, "")) === decodeURIComponent(location.href.replace(rhash, ""));
        }
        $.widget("ui.tabs", {
            version: "fadf2b312a05040436451c64bbfaf4814bc62c56",
            delay: 300,
            options: {
                active: null,
                collapsible: !1,
                event: "click",
                heightStyle: "content",
                hide: null,
                show: null,
                activate: null,
                beforeActivate: null,
                beforeLoad: null,
                load: null
            },
            _create: function() {
                var that = this, options = this.options;
                this.running = !1, this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", options.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(event1) {
                    $(this).is(".ui-state-disabled") && event1.preventDefault();
                }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
                    $(this).closest("li").is(".ui-state-disabled") && this.blur();
                }), this._processTabs(), options.active = this._initialActive(), $.isArray(options.disabled) && (options.disabled = $.unique(options.disabled.concat($.map(this.tabs.filter(".ui-state-disabled"), function(li) {
                    return that.tabs.index(li);
                }))).sort()), !1 !== this.options.active && this.anchors.length ? this.active = this._findActive(options.active) : this.active = $(), this._refresh(), this.active.length && this.load(options.active);
            },
            _initialActive: function() {
                var active = this.options.active, collapsible = this.options.collapsible, locationHash = location.hash.substring(1);
                return null === active && (locationHash && this.tabs.each(function(i, tab) {
                    if ($(tab).attr("aria-controls") === locationHash) return active = i, !1;
                }), null === active && (active = this.tabs.index(this.tabs.filter(".ui-tabs-active"))), (null === active || -1 === active) && (active = !!this.tabs.length && 0)), !1 !== active && -1 === (active = this.tabs.index(this.tabs.eq(active))) && (active = !collapsible && 0), !collapsible && !1 === active && this.anchors.length && (active = 0), active;
            },
            _getCreateEventData: function() {
                return {
                    tab: this.active,
                    panel: this.active.length ? this._getPanelForTab(this.active) : $()
                };
            },
            _tabKeydown: function(event1) {
                var focusedTab = $(this.document[0].activeElement).closest("li"), selectedIndex = this.tabs.index(focusedTab), goingForward = !0;
                if (!this._handlePageNav(event1)) {
                    switch(event1.keyCode){
                        case $.ui.keyCode.RIGHT:
                        case $.ui.keyCode.DOWN:
                            selectedIndex++;
                            break;
                        case $.ui.keyCode.UP:
                        case $.ui.keyCode.LEFT:
                            goingForward = !1, selectedIndex--;
                            break;
                        case $.ui.keyCode.END:
                            selectedIndex = this.anchors.length - 1;
                            break;
                        case $.ui.keyCode.HOME:
                            selectedIndex = 0;
                            break;
                        case $.ui.keyCode.SPACE:
                            event1.preventDefault(), clearTimeout(this.activating), this._activate(selectedIndex);
                            return;
                        case $.ui.keyCode.ENTER:
                            event1.preventDefault(), clearTimeout(this.activating), this._activate(selectedIndex !== this.options.active && selectedIndex);
                            return;
                        default:
                            return;
                    }
                    event1.preventDefault(), clearTimeout(this.activating), selectedIndex = this._focusNextTab(selectedIndex, goingForward), event1.ctrlKey || (focusedTab.attr("aria-selected", "false"), this.tabs.eq(selectedIndex).attr("aria-selected", "true"), this.activating = this._delay(function() {
                        this.option("active", selectedIndex);
                    }, this.delay));
                }
            },
            _panelKeydown: function(event1) {
                !this._handlePageNav(event1) && event1.ctrlKey && event1.keyCode === $.ui.keyCode.UP && (event1.preventDefault(), this.active.focus());
            },
            _handlePageNav: function(event1) {
                return event1.altKey && event1.keyCode === $.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0) : event1.altKey && event1.keyCode === $.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0) : void 0;
            },
            _findNextTab: function(index, goingForward) {
                for(var lastTabIndex = this.tabs.length - 1; -1 !== $.inArray((index > lastTabIndex && (index = 0), index < 0 && (index = lastTabIndex), index), this.options.disabled);)index = goingForward ? index + 1 : index - 1;
                return index;
            },
            _focusNextTab: function(index, goingForward) {
                return index = this._findNextTab(index, goingForward), this.tabs.eq(index).focus(), index;
            },
            _setOption: function(key, value) {
                if ("active" === key) {
                    this._activate(value);
                    return;
                }
                if ("disabled" === key) {
                    this._setupDisabled(value);
                    return;
                }
                this._super(key, value), "collapsible" !== key || (this.element.toggleClass("ui-tabs-collapsible", value), value || !1 !== this.options.active || this._activate(0)), "event" === key && this._setupEvents(value), "heightStyle" === key && this._setupHeightStyle(value);
            },
            _tabId: function(tab) {
                return tab.attr("aria-controls") || "ui-tabs-" + ++tabId;
            },
            _sanitizeSelector: function(hash) {
                return hash ? hash.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "";
            },
            refresh: function() {
                var options = this.options, lis = this.tablist.children(":has(a[href])");
                options.disabled = $.map(lis.filter(".ui-state-disabled"), function(tab) {
                    return lis.index(tab);
                }), this._processTabs(), !1 !== options.active && this.anchors.length ? this.active.length && !$.contains(this.tablist[0], this.active[0]) ? this.tabs.length === options.disabled.length ? (options.active = !1, this.active = $()) : this._activate(this._findNextTab(Math.max(0, options.active - 1), !1)) : options.active = this.tabs.index(this.active) : (options.active = !1, this.active = $()), this._refresh();
            },
            _refresh: function() {
                this._setupDisabled(this.options.disabled), this._setupEvents(this.options.event), this._setupHeightStyle(this.options.heightStyle), this.tabs.not(this.active).attr({
                    "aria-selected": "false",
                    tabIndex: -1
                }), this.panels.not(this._getPanelForTab(this.active)).hide().attr({
                    "aria-expanded": "false",
                    "aria-hidden": "true"
                }), this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({
                    "aria-selected": "true",
                    tabIndex: 0
                }), this._getPanelForTab(this.active).show().attr({
                    "aria-expanded": "true",
                    "aria-hidden": "false"
                })) : this.tabs.eq(0).attr("tabIndex", 0);
            },
            _processTabs: function() {
                var that = this;
                this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist"), this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
                    role: "tab",
                    tabIndex: -1
                }), this.anchors = this.tabs.map(function() {
                    return $("a", this)[0];
                }).addClass("ui-tabs-anchor").attr({
                    role: "presentation",
                    tabIndex: -1
                }), this.panels = $(), this.anchors.each(function(i, anchor) {
                    var selector, panel, panelId, anchorId = $(anchor).uniqueId().attr("id"), tab = $(anchor).closest("li"), originalAriaControls = tab.attr("aria-controls");
                    isLocal(anchor) ? (selector = anchor.hash, panel = that.element.find(that._sanitizeSelector(selector))) : (selector = "#" + (panelId = that._tabId(tab)), (panel = that.element.find(selector)).length || (panel = that._createPanel(panelId)).insertAfter(that.panels[i - 1] || that.tablist), panel.attr("aria-live", "polite")), panel.length && (that.panels = that.panels.add(panel)), originalAriaControls && tab.data("ui-tabs-aria-controls", originalAriaControls), tab.attr({
                        "aria-controls": selector.substring(1),
                        "aria-labelledby": anchorId
                    }), panel.attr("aria-labelledby", anchorId);
                }), this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel");
            },
            _getList: function() {
                return this.element.find("ol,ul").eq(0);
            },
            _createPanel: function(id) {
                return $("<div>").attr("id", id).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0);
            },
            _setupDisabled: function(disabled) {
                $.isArray(disabled) && (disabled.length ? disabled.length === this.anchors.length && (disabled = !0) : disabled = !1);
                for(var li, i = 0; li = this.tabs[i]; i++)!0 === disabled || -1 !== $.inArray(i, disabled) ? $(li).addClass("ui-state-disabled").attr("aria-disabled", "true") : $(li).removeClass("ui-state-disabled").removeAttr("aria-disabled");
                this.options.disabled = disabled;
            },
            _setupEvents: function(event1) {
                var events = {
                    click: function(event1) {
                        event1.preventDefault();
                    }
                };
                event1 && $.each(event1.split(" "), function(index, eventName) {
                    events[eventName] = "_eventHandler";
                }), this._off(this.anchors.add(this.tabs).add(this.panels)), this._on(this.anchors, events), this._on(this.tabs, {
                    keydown: "_tabKeydown"
                }), this._on(this.panels, {
                    keydown: "_panelKeydown"
                }), this._focusable(this.tabs), this._hoverable(this.tabs);
            },
            _setupHeightStyle: function(heightStyle) {
                var maxHeight, parent = this.element.parent();
                "fill" === heightStyle ? (maxHeight = parent.height() - (this.element.outerHeight() - this.element.height()), this.element.siblings(":visible").each(function() {
                    var elem = $(this), position = elem.css("position");
                    "absolute" !== position && "fixed" !== position && (maxHeight -= elem.outerHeight(!0));
                }), this.element.children().not(this.panels).each(function() {
                    maxHeight -= $(this).outerHeight(!0);
                }), this.panels.each(function() {
                    $(this).height(Math.max(0, maxHeight - $(this).innerHeight() + $(this).height()));
                }).css("overflow", "auto")) : "auto" === heightStyle && (maxHeight = 0, this.panels.each(function() {
                    maxHeight = Math.max(maxHeight, $(this).height("").height());
                }).height(maxHeight));
            },
            _eventHandler: function(event1) {
                var options = this.options, active = this.active, tab = $(event1.currentTarget).closest("li"), clickedIsActive = tab[0] === active[0], collapsing = clickedIsActive && options.collapsible, toShow = collapsing ? $() : this._getPanelForTab(tab), toHide = active.length ? this._getPanelForTab(active) : $(), eventData = {
                    oldTab: active,
                    oldPanel: toHide,
                    newTab: collapsing ? $() : tab,
                    newPanel: toShow
                };
                event1.preventDefault(), !(tab.hasClass("ui-state-disabled") || tab.hasClass("ui-tabs-loading")) && !this.running && (!clickedIsActive || options.collapsible) && !1 !== this._trigger("beforeActivate", event1, eventData) && (options.active = !collapsing && this.tabs.index(tab), this.active = clickedIsActive ? $() : tab, this.xhr && this.xhr.abort(), toHide.length || toShow.length || $.error("jQuery UI Tabs: Mismatching fragment identifier."), toShow.length && this.load(this.tabs.index(tab), event1), this._toggle(event1, eventData));
            },
            _toggle: function(event1, eventData) {
                var that = this, toShow = eventData.newPanel, toHide = eventData.oldPanel;
                function complete() {
                    that.running = !1, that._trigger("activate", event1, eventData);
                }
                function show() {
                    eventData.newTab.closest("li").addClass("ui-tabs-active ui-state-active"), toShow.length && that.options.show ? that._show(toShow, that.options.show, complete) : (toShow.show(), complete());
                }
                this.running = !0, toHide.length && this.options.hide ? this._hide(toHide, this.options.hide, function() {
                    eventData.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), show();
                }) : (eventData.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), toHide.hide(), show()), toHide.attr({
                    "aria-expanded": "false",
                    "aria-hidden": "true"
                }), eventData.oldTab.attr("aria-selected", "false"), toShow.length && toHide.length ? eventData.oldTab.attr("tabIndex", -1) : toShow.length && this.tabs.filter(function() {
                    return 0 === $(this).attr("tabIndex");
                }).attr("tabIndex", -1), toShow.attr({
                    "aria-expanded": "true",
                    "aria-hidden": "false"
                }), eventData.newTab.attr({
                    "aria-selected": "true",
                    tabIndex: 0
                });
            },
            _activate: function(index) {
                var anchor, active = this._findActive(index);
                active[0] !== this.active[0] && (active.length || (active = this.active), anchor = active.find(".ui-tabs-anchor")[0], this._eventHandler({
                    target: anchor,
                    currentTarget: anchor,
                    preventDefault: $.noop
                }));
            },
            _findActive: function(index) {
                return !1 === index ? $() : this.tabs.eq(index);
            },
            _getIndex: function(index) {
                return "string" == typeof index && (index = this.anchors.index(this.anchors.filter("[href$='" + index + "']"))), index;
            },
            _destroy: function() {
                this.xhr && this.xhr.abort(), this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"), this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"), this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(), this.tabs.add(this.panels).each(function() {
                    $.data(this, "ui-tabs-destroy") ? $(this).remove() : $(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role");
                }), this.tabs.each(function() {
                    var li = $(this), prev = li.data("ui-tabs-aria-controls");
                    prev ? li.attr("aria-controls", prev).removeData("ui-tabs-aria-controls") : li.removeAttr("aria-controls");
                }), this.panels.show(), "content" !== this.options.heightStyle && this.panels.css("height", "");
            },
            enable: function(index) {
                var disabled = this.options.disabled;
                !1 !== disabled && (void 0 === index ? disabled = !1 : (index = this._getIndex(index), disabled = $.isArray(disabled) ? $.map(disabled, function(num) {
                    return num !== index ? num : null;
                }) : $.map(this.tabs, function(li, num) {
                    return num !== index ? num : null;
                })), this._setupDisabled(disabled));
            },
            disable: function(index) {
                var disabled = this.options.disabled;
                if (!0 !== disabled) {
                    if (void 0 === index) disabled = !0;
                    else {
                        if (index = this._getIndex(index), -1 !== $.inArray(index, disabled)) return;
                        disabled = $.isArray(disabled) ? $.merge([
                            index
                        ], disabled).sort() : [
                            index
                        ];
                    }
                    this._setupDisabled(disabled);
                }
            },
            load: function(index, event1) {
                index = this._getIndex(index);
                var that = this, tab = this.tabs.eq(index), anchor = tab.find(".ui-tabs-anchor"), panel = this._getPanelForTab(tab), eventData = {
                    tab: tab,
                    panel: panel
                };
                !isLocal(anchor[0]) && (this.xhr = $.ajax(this._ajaxSettings(anchor, event1, eventData)), this.xhr && "canceled" !== this.xhr.statusText && (tab.addClass("ui-tabs-loading"), panel.attr("aria-busy", "true"), this.xhr.success(function(response) {
                    setTimeout(function() {
                        panel.html(response), that._trigger("load", event1, eventData);
                    }, 1);
                }).complete(function(jqXHR, status) {
                    setTimeout(function() {
                        "abort" === status && that.panels.stop(!1, !0), tab.removeClass("ui-tabs-loading"), panel.removeAttr("aria-busy"), jqXHR === that.xhr && delete that.xhr;
                    }, 1);
                })));
            },
            _ajaxSettings: function(anchor, event1, eventData) {
                var that = this;
                return {
                    url: anchor.attr("href"),
                    beforeSend: function(jqXHR, settings) {
                        return that._trigger("beforeLoad", event1, $.extend({
                            jqXHR: jqXHR,
                            ajaxSettings: settings
                        }, eventData));
                    }
                };
            },
            _getPanelForTab: function(tab) {
                var id = $(tab).attr("aria-controls");
                return this.element.find(this._sanitizeSelector("#" + id));
            }
        });
    }(jQuery), function($, window) {
        $.mobile.iosorientationfixEnabled = !0;
        var zoom, x, y, z, aig, ua = navigator.userAgent;
        if (!(/iPhone|iPad|iPod/.test(navigator.platform) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf("AppleWebKit") > -1)) {
            $.mobile.iosorientationfixEnabled = !1;
            return;
        }
        function checkTilt(e) {
            x = Math.abs((aig = e.originalEvent.accelerationIncludingGravity).x), y = Math.abs(aig.y), z = Math.abs(aig.z), !window.orientation && (x > 7 || (z > 6 && y < 8 || z < 8 && y > 6) && x > 5) ? zoom.enabled && zoom.disable() : zoom.enabled || zoom.enable();
        }
        zoom = $.mobile.zoom, $.mobile.document.on("mobileinit", function() {
            $.mobile.iosorientationfixEnabled && $.mobile.window.bind("orientationchange.iosorientationfix", zoom.enable).bind("devicemotion.iosorientationfix", checkTilt);
        });
    }(jQuery, this), function($, window, undefined) {
        var $html = $("html"), $window = $.mobile.window;
        function hideRenderingClass() {
            $html.removeClass("ui-mobile-rendering");
        }
        $(window.document).trigger("mobileinit"), $.mobile.gradeA() && ($.mobile.ajaxBlacklist && ($.mobile.ajaxEnabled = !1), $html.addClass("ui-mobile ui-mobile-rendering"), setTimeout(hideRenderingClass, 5000), $.extend($.mobile, {
            initializePage: function() {
                var path = $.mobile.path, $pages = $(":jqmData(role='page'), :jqmData(role='dialog')"), hash = path.stripHash(path.stripQueryParams(path.parseLocation().hash)), hashPage = document1.getElementById(hash);
                $pages.length || ($pages = $("body").wrapInner("<div data-" + $.mobile.ns + "role='page'></div>").children(0)), $pages.each(function() {
                    var $this = $(this);
                    $this[0].getAttribute("data-" + $.mobile.ns + "url") || $this.attr("data-" + $.mobile.ns + "url", $this.attr("id") || location.pathname + location.search);
                }), $.mobile.firstPage = $pages.first(), $.mobile.pageContainer = $.mobile.firstPage.parent().addClass("ui-mobile-viewport").pagecontainer(), $.mobile.navreadyDeferred.resolve(), $window.trigger("pagecontainercreate"), $.mobile.loading("show"), hideRenderingClass(), $.mobile.hashListeningEnabled && $.mobile.path.isHashValid(location.hash) && ($(hashPage).is(":jqmData(role='page')") || $.mobile.path.isPath(hash) || hash === $.mobile.dialogHashKey) ? $.event.special.navigate.isPushStateEnabled() ? ($.mobile.navigate.history.stack = [], $.mobile.navigate($.mobile.path.isPath(location.hash) ? location.hash : location.href)) : $window.trigger("hashchange", [
                    !0
                ]) : ($.mobile.path.isHashValid(location.hash) && ($.mobile.navigate.history.initialDst = hash.replace("#", "")), $.event.special.navigate.isPushStateEnabled() && $.mobile.navigate.navigator.squash(path.parseLocation().href), $.mobile.changePage($.mobile.firstPage, {
                    transition: "none",
                    reverse: !0,
                    changeHash: !1,
                    fromHashChange: !0
                }));
            }
        }), $(function() {
            $.support.inlineSVG(), $.mobile.hideUrlBar && window.scrollTo(0, 1), $.mobile.defaultHomeScroll = $.support.scrollTop && 1 !== $.mobile.window.scrollTop() ? 1 : 0, $.mobile.autoInitializePage && $.mobile.initializePage(), $.mobile.hideUrlBar && $window.load($.mobile.silentScroll), $.support.cssPointerEvents || $.mobile.document.delegate(".ui-state-disabled,.ui-disabled", "vclick", function(e) {
                e.preventDefault(), e.stopImmediatePropagation();
            });
        }));
    }(jQuery, this);
});
