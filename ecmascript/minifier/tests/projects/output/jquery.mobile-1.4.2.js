!function(root, doc, factory) {
    "function" == typeof define && define.amd ? define([
        "jquery"
    ], function($) {
        return factory($, root, doc), $.mobile;
    }) : factory(root.jQuery, root, doc);
}(this, document, function(jQuery, window, document, undefined) {
    var $, rcapitals, doc, bool, docElem, refNode, fakeBody, div, $1, support, $2, self, $win, dummyFnToInitNavigate, $3, undefined, path, $base, $4, undefined, $5, path1, initialHref, $6, heldCall, curr, diff, handler, lastCall, $7, baseElement, base, $8, $9, $10, $11, undefined, rInitialLetter, iconposClass, $12, $13, $14, meta, initialContent, disabledZoom, enabledZoom, disabledInitially, $15, $16, undefined, rDividerListItem, origDefaultFilterCallback;
    jQuery.mobile = {
    }, (function($17, window, undefined) {
        $17.extend($17.mobile, {
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
            pageContainer: $17(),
            allowCrossDomainPages: !1,
            dialogHashKey: "&ui-state=dialog"
        });
    })(jQuery, this), (function($17, window, undefined) {
        var nsNormalizeDict = {
        }, oldFind = $17.find, rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, jqmDataRE = /:jqmData\(([^)]*)\)/g;
        $17.extend($17.mobile, {
            ns: "",
            getAttribute: function(element, key) {
                var data;
                (element = element.jquery ? element[0] : element) && element.getAttribute && (data = element.getAttribute("data-" + $17.mobile.ns + key));
                try {
                    data = "true" === data || "false" !== data && ("null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? JSON.parse(data) : data);
                } catch (err) {
                }
                return data;
            },
            nsNormalizeDict: nsNormalizeDict,
            nsNormalize: function(prop) {
                return nsNormalizeDict[prop] || (nsNormalizeDict[prop] = $17.camelCase($17.mobile.ns + prop));
            },
            closestPageData: function($target) {
                return $target.closest(":jqmData(role='page'), :jqmData(role='dialog')").data("mobile-page");
            }
        }), $17.fn.jqmData = function(prop, value) {
            var result;
            return void 0 !== prop && (prop && (prop = $17.mobile.nsNormalize(prop)), result = arguments.length < 2 || void 0 === value ? this.data(prop) : this.data(prop, value)), result;
        }, $17.jqmData = function(elem, prop, value) {
            var result;
            return void 0 !== prop && (result = $17.data(elem, prop ? $17.mobile.nsNormalize(prop) : prop, value)), result;
        }, $17.fn.jqmRemoveData = function(prop) {
            return this.removeData($17.mobile.nsNormalize(prop));
        }, $17.jqmRemoveData = function(elem, prop) {
            return $17.removeData(elem, $17.mobile.nsNormalize(prop));
        }, $17.find = function(selector, context, ret, extra) {
            return selector.indexOf(":jqmData") > -1 && (selector = selector.replace(jqmDataRE, "[data-" + ($17.mobile.ns || "") + "$1]")), oldFind.call(this, selector, context, ret, extra);
        }, $17.extend($17.find, oldFind);
    })(jQuery, this), (function($17, undefined) {
        var uuid = 0, runiqueId = /^ui-id-\d+$/;
        function focusable(element, isTabIndexNotNaN) {
            var mapName, img, nodeName = element.nodeName.toLowerCase();
            return "area" === nodeName ? (mapName = element.parentNode.name, !!element.href && !!mapName && "map" === element.parentNode.nodeName.toLowerCase() && !!(img = $17("img[usemap=#" + mapName + "]")[0]) && visible(img)) : (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element);
        }
        function visible(element) {
            return $17.expr.filters.visible(element) && !$17(element).parents().addBack().filter(function() {
                return "hidden" === $17.css(this, "visibility");
            }).length;
        }
        $17.ui = $17.ui || {
        }, $17.extend($17.ui, {
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
        }), $17.fn.extend({
            focus: function(orig) {
                return function(delay, fn) {
                    return "number" == typeof delay ? this.each(function() {
                        var elem = this;
                        setTimeout(function() {
                            $17(elem).focus(), fn && fn.call(elem);
                        }, delay);
                    }) : orig.apply(this, arguments);
                };
            }($17.fn.focus),
            scrollParent: function() {
                var scrollParent;
                return scrollParent = $17.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                    return /(relative|absolute|fixed)/.test($17.css(this, "position")) && /(auto|scroll)/.test($17.css(this, "overflow") + $17.css(this, "overflow-y") + $17.css(this, "overflow-x"));
                }).eq(0) : this.parents().filter(function() {
                    return /(auto|scroll)/.test($17.css(this, "overflow") + $17.css(this, "overflow-y") + $17.css(this, "overflow-x"));
                }).eq(0), /fixed/.test(this.css("position")) || !scrollParent.length ? $17(this[0].ownerDocument || document) : scrollParent;
            },
            uniqueId: function() {
                return this.each(function() {
                    this.id || (this.id = "ui-id-" + ++uuid);
                });
            },
            removeUniqueId: function() {
                return this.each(function() {
                    runiqueId.test(this.id) && $17(this).removeAttr("id");
                });
            }
        }), $17.extend($17.expr[":"], {
            data: $17.expr.createPseudo ? $17.expr.createPseudo(function(dataName) {
                return function(elem) {
                    return !!$17.data(elem, dataName);
                };
            }) : function(elem, i, match) {
                return !!$17.data(elem, match[3]);
            },
            focusable: function(element) {
                return focusable(element, !isNaN($17.attr(element, "tabindex")));
            },
            tabbable: function(element) {
                var tabIndex = $17.attr(element, "tabindex"), isTabIndexNaN = isNaN(tabIndex);
                return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
            }
        }), $17("<a>").outerWidth(1).jquery || $17.each([
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
                innerWidth: $17.fn.innerWidth,
                innerHeight: $17.fn.innerHeight,
                outerWidth: $17.fn.outerWidth,
                outerHeight: $17.fn.outerHeight
            };
            function reduce(elem, size, border, margin) {
                return $17.each(side, function() {
                    size -= parseFloat($17.css(elem, "padding" + this)) || 0, border && (size -= parseFloat($17.css(elem, "border" + this + "Width")) || 0), margin && (size -= parseFloat($17.css(elem, "margin" + this)) || 0);
                }), size;
            }
            $17.fn["inner" + name] = function(size) {
                return size === undefined ? orig["inner" + name].call(this) : this.each(function() {
                    $17(this).css(type, reduce(this, size) + "px");
                });
            }, $17.fn["outer" + name] = function(size, margin) {
                return "number" != typeof size ? orig["outer" + name].call(this, size) : this.each(function() {
                    $17(this).css(type, reduce(this, size, !0, margin) + "px");
                });
            };
        }), $17.fn.addBack || ($17.fn.addBack = function(selector) {
            return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
        }), $17("<a>").data("a-b", "a").removeData("a-b").data("a-b") && ($17.fn.removeData = (function(removeData) {
            return function(key) {
                return arguments.length ? removeData.call(this, $17.camelCase(key)) : removeData.call(this);
            };
        })($17.fn.removeData)), $17.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), $17.support.selectstart = "onselectstart" in document.createElement("div"), $17.fn.extend({
            disableSelection: function() {
                return this.bind(($17.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(event) {
                    event.preventDefault();
                });
            },
            enableSelection: function() {
                return this.unbind(".ui-disableSelection");
            },
            zIndex: function(zIndex) {
                if (zIndex !== undefined) return this.css("zIndex", zIndex);
                if (this.length) for(var position, value, elem = $17(this[0]); elem.length && elem[0] !== document;){
                    if (("absolute" === (position = elem.css("position")) || "relative" === position || "fixed" === position) && !isNaN(value = parseInt(elem.css("zIndex"), 10)) && 0 !== value) return value;
                    elem = elem.parent();
                }
                return 0;
            }
        }), $17.ui.plugin = {
            add: function(module, option, set) {
                var i, proto = $17.ui[module].prototype;
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
    })(jQuery), (function($17, window, undefined) {
        var compensateToolbars = function(page, desiredHeight) {
            var pageParent = page.parent(), toolbarsAffectingHeight = [], externalHeaders = pageParent.children(":jqmData(role='header')"), internalHeaders = page.children(":jqmData(role='header')"), externalFooters = pageParent.children(":jqmData(role='footer')"), internalFooters = page.children(":jqmData(role='footer')");
            return 0 === internalHeaders.length && externalHeaders.length > 0 && (toolbarsAffectingHeight = toolbarsAffectingHeight.concat(externalHeaders.toArray())), 0 === internalFooters.length && externalFooters.length > 0 && (toolbarsAffectingHeight = toolbarsAffectingHeight.concat(externalFooters.toArray())), $17.each(toolbarsAffectingHeight, function(index, value) {
                desiredHeight -= $17(value).outerHeight();
            }), Math.max(0, desiredHeight);
        };
        $17.extend($17.mobile, {
            window: $17(window),
            document: $17(document),
            keyCode: $17.ui.keyCode,
            behaviors: {
            },
            silentScroll: function(ypos) {
                "number" !== $17.type(ypos) && (ypos = $17.mobile.defaultHomeScroll), $17.event.special.scrollstart.enabled = !1, setTimeout(function() {
                    window.scrollTo(0, ypos), $17.mobile.document.trigger("silentscroll", {
                        x: 0,
                        y: ypos
                    });
                }, 20), setTimeout(function() {
                    $17.event.special.scrollstart.enabled = !0;
                }, 150);
            },
            getClosestBaseUrl: function(ele) {
                var url = $17(ele).closest(".ui-page").jqmData("url"), base = $17.mobile.path.documentBase.hrefNoHash;
                return $17.mobile.dynamicBaseEnabled && url && $17.mobile.path.isPath(url) || (url = base), $17.mobile.path.makeUrlAbsolute(url, base);
            },
            removeActiveLinkClass: function(forceRemoval) {
                $17.mobile.activeClickedLink && (!$17.mobile.activeClickedLink.closest("." + $17.mobile.activePageClass).length || forceRemoval) && $17.mobile.activeClickedLink.removeClass($17.mobile.activeBtnClass), $17.mobile.activeClickedLink = null;
            },
            getInheritedTheme: function(el, defaultTheme) {
                for(var c, m, e = el[0], ltr = "", re = /ui-(bar|body|overlay)-([a-z])\b/; e;){
                    if ((c = e.className || "") && (m = re.exec(c)) && (ltr = m[2])) break;
                    e = e.parentNode;
                }
                return ltr || defaultTheme || "a";
            },
            enhanceable: function(elements) {
                return this.haveParents(elements, "enhance");
            },
            hijackable: function(elements) {
                return this.haveParents(elements, "ajax");
            },
            haveParents: function(elements, attr) {
                if (!$17.mobile.ignoreContentEnabled) return elements;
                var e, $element, excluded, i, count = elements.length, $newSet = $17();
                for(i = 0; i < count; i++){
                    for($element = elements.eq(i), excluded = !1, e = elements[i]; e;){
                        if ("false" === (e.getAttribute ? e.getAttribute("data-" + $17.mobile.ns + attr) : "")) {
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
                return window.innerHeight || $17.mobile.window.height();
            },
            resetActivePageHeight: function(height) {
                var page = $17("." + $17.mobile.activePageClass), pageHeight = page.height(), pageOuterHeight = page.outerHeight(!0);
                height = compensateToolbars(page, "number" == typeof height ? height : $17.mobile.getScreenHeight()), page.css("min-height", height - (pageOuterHeight - pageHeight));
            },
            loading: function() {
                var loader = this.loading._widget || $17($17.mobile.loader.prototype.defaultHtml).loader(), returnValue = loader.loader.apply(loader, arguments);
                return this.loading._widget = loader, returnValue;
            }
        }), $17.addDependents = function(elem, newDependents) {
            var $elem = $17(elem), dependents = $elem.jqmData("dependents") || $17();
            $elem.jqmData("dependents", $17(dependents).add(newDependents));
        }, $17.fn.extend({
            removeWithDependents: function() {
                $17.removeWithDependents(this);
            },
            enhanceWithin: function() {
                var index, widgetElements = {
                }, keepNative = $17.mobile.page.prototype.keepNativeSelector(), that = this;
                for(index in $17.mobile.nojs && $17.mobile.nojs(this), $17.mobile.links && $17.mobile.links(this), $17.mobile.degradeInputsWithin && $17.mobile.degradeInputsWithin(this), $17.fn.buttonMarkup && this.find($17.fn.buttonMarkup.initSelector).not(keepNative).jqmEnhanceable().buttonMarkup(), $17.fn.fieldcontain && this.find(":jqmData(role='fieldcontain')").not(keepNative).jqmEnhanceable().fieldcontain(), $17.each($17.mobile.widgets, function(name, constructor) {
                    if (constructor.initSelector) {
                        var elements = $17.mobile.enhanceable(that.find(constructor.initSelector));
                        elements.length > 0 && (elements = elements.not(keepNative)), elements.length > 0 && (widgetElements[constructor.prototype.widgetName] = elements);
                    }
                }), widgetElements)widgetElements[index][index]();
                return this;
            },
            addDependents: function(newDependents) {
                $17.addDependents(this, newDependents);
            },
            getEncodedText: function() {
                return $17("<a>").text(this.text()).html();
            },
            jqmEnhanceable: function() {
                return $17.mobile.enhanceable(this);
            },
            jqmHijackable: function() {
                return $17.mobile.hijackable(this);
            }
        }), $17.removeWithDependents = function(nativeElement) {
            var element = $17(nativeElement);
            (element.jqmData("dependents") || $17()).remove(), element.remove();
        }, $17.addDependents = function(nativeElement, newDependents) {
            var element = $17(nativeElement), dependents = element.jqmData("dependents") || $17();
            element.jqmData("dependents", $17(dependents).add(newDependents));
        }, $17.find.matches = function(expr, set) {
            return $17.find(expr, null, null, set);
        }, $17.find.matchesSelector = function(node, expr) {
            return $17.find(expr, null, null, [
                node
            ]).length > 0;
        };
    })(jQuery, this), (function($17, undefined) {
        var uuid = 0, slice = Array.prototype.slice, _cleanData = $17.cleanData;
        $17.cleanData = function(elems) {
            for(var elem, i = 0; null != (elem = elems[i]); i++)try {
                $17(elem).triggerHandler("remove");
            } catch (e) {
            }
            _cleanData(elems);
        }, $17.widget = function(name, base, prototype) {
            var fullName, existingConstructor, constructor, basePrototype, proxiedPrototype = {
            }, namespace = name.split(".")[0];
            return fullName = namespace + "-" + (name = name.split(".")[1]), prototype || (prototype = base, base = $17.Widget), $17.expr[":"][fullName.toLowerCase()] = function(elem) {
                return !!$17.data(elem, fullName);
            }, $17[namespace] = $17[namespace] || {
            }, existingConstructor = $17[namespace][name], constructor = $17[namespace][name] = function(options, element) {
                if (!this._createWidget) return new constructor(options, element);
                arguments.length && this._createWidget(options, element);
            }, $17.extend(constructor, existingConstructor, {
                version: prototype.version,
                _proto: $17.extend({
                }, prototype),
                _childConstructors: []
            }), (basePrototype = new base()).options = $17.widget.extend({
            }, basePrototype.options), $17.each(prototype, function(prop, value) {
                if (!$17.isFunction(value)) return void (proxiedPrototype[prop] = value);
                proxiedPrototype[prop] = (function() {
                    return function() {
                        var returnValue, __super = this._super, __superApply = this._superApply;
                        return this._super = function() {
                            return base.prototype[prop].apply(this, arguments);
                        }, this._superApply = function(args) {
                            return base.prototype[prop].apply(this, args);
                        }, returnValue = value.apply(this, arguments), this._super = __super, this._superApply = __superApply, returnValue;
                    };
                })();
            }), constructor.prototype = $17.widget.extend(basePrototype, {
                widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix || name : name
            }, proxiedPrototype, {
                constructor: constructor,
                namespace: namespace,
                widgetName: name,
                widgetFullName: fullName
            }), existingConstructor ? ($17.each(existingConstructor._childConstructors, function(i, child) {
                var childPrototype = child.prototype;
                $17.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
            }), delete existingConstructor._childConstructors) : base._childConstructors.push(constructor), $17.widget.bridge(name, constructor), constructor;
        }, $17.widget.extend = function(target) {
            for(var key, value, input = slice.call(arguments, 1), inputIndex = 0, inputLength = input.length; inputIndex < inputLength; inputIndex++)for(key in input[inputIndex])value = input[inputIndex][key], input[inputIndex].hasOwnProperty(key) && value !== undefined && ($17.isPlainObject(value) ? target[key] = $17.isPlainObject(target[key]) ? $17.widget.extend({
            }, target[key], value) : $17.widget.extend({
            }, value) : target[key] = value);
            return target;
        }, $17.widget.bridge = function(name, object) {
            var fullName = object.prototype.widgetFullName || name;
            $17.fn[name] = function(options) {
                var isMethodCall = "string" == typeof options, args = slice.call(arguments, 1), returnValue = this;
                return options = !isMethodCall && args.length ? $17.widget.extend.apply(null, [
                    options
                ].concat(args)) : options, isMethodCall ? this.each(function() {
                    var methodValue, instance = $17.data(this, fullName);
                    return "instance" === options ? (returnValue = instance, !1) : instance ? $17.isFunction(instance[options]) && "_" !== options.charAt(0) ? (methodValue = instance[options].apply(instance, args)) !== instance && methodValue !== undefined ? (returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue, !1) : void 0 : $17.error("no such method '" + options + "' for " + name + " widget instance") : $17.error("cannot call methods on " + name + " prior to initialization; attempted to call method '" + options + "'");
                }) : this.each(function() {
                    var instance = $17.data(this, fullName);
                    instance ? instance.option(options || {
                    })._init() : $17.data(this, fullName, new object(options, this));
                }), returnValue;
            };
        }, $17.Widget = function() {
        }, $17.Widget._childConstructors = [], $17.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: !1,
                create: null
            },
            _createWidget: function(options, element) {
                element = $17(element || this.defaultElement || this)[0], this.element = $17(element), this.uuid = uuid++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = $17.widget.extend({
                }, this.options, this._getCreateOptions(), options), this.bindings = $17(), this.hoverable = $17(), this.focusable = $17(), element !== this && ($17.data(element, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function(event) {
                        event.target === element && this.destroy();
                    }
                }), this.document = $17(element.style ? element.ownerDocument : element.document || element), this.window = $17(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init();
            },
            _getCreateOptions: $17.noop,
            _getCreateEventData: $17.noop,
            _create: $17.noop,
            _init: $17.noop,
            destroy: function() {
                this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData($17.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus");
            },
            _destroy: $17.noop,
            widget: function() {
                return this.element;
            },
            option: function(key, value) {
                var parts, curOption, i, options = key;
                if (0 === arguments.length) return $17.widget.extend({
                }, this.options);
                if ("string" == typeof key) if (options = {
                }, key = (parts = key.split(".")).shift(), parts.length) {
                    for(i = 0, curOption = options[key] = $17.widget.extend({
                    }, this.options[key]); i < parts.length - 1; i++)curOption[parts[i]] = curOption[parts[i]] || {
                    }, curOption = curOption[parts[i]];
                    if (key = parts.pop(), value === undefined) return undefined === curOption[key] ? null : curOption[key];
                    curOption[key] = value;
                } else {
                    if (value === undefined) return undefined === this.options[key] ? null : this.options[key];
                    options[key] = value;
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
                "boolean" != typeof suppressDisabledCheck && (handlers = element, element = suppressDisabledCheck, suppressDisabledCheck = !1), handlers ? (element = delegateElement = $17(element), this.bindings = this.bindings.add(element)) : (handlers = element, element = this.element, delegateElement = this.widget()), $17.each(handlers, function(event, handler) {
                    function handlerProxy() {
                        if (!(!suppressDisabledCheck && (!0 === instance.options.disabled || $17(this).hasClass("ui-state-disabled")))) return ("string" == typeof handler ? instance[handler] : handler).apply(instance, arguments);
                    }
                    "string" != typeof handler && (handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $17.guid++);
                    var match = event.match(/^(\w+)\s*(.*)$/), eventName = match[1] + instance.eventNamespace, selector = match[2];
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
                    mouseenter: function(event) {
                        $17(event.currentTarget).addClass("ui-state-hover");
                    },
                    mouseleave: function(event) {
                        $17(event.currentTarget).removeClass("ui-state-hover");
                    }
                });
            },
            _focusable: function(element) {
                this.focusable = this.focusable.add(element), this._on(element, {
                    focusin: function(event) {
                        $17(event.currentTarget).addClass("ui-state-focus");
                    },
                    focusout: function(event) {
                        $17(event.currentTarget).removeClass("ui-state-focus");
                    }
                });
            },
            _trigger: function(type, event, data) {
                var prop, orig, callback = this.options[type];
                if (data = data || {
                }, (event = $17.Event(event)).type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase(), event.target = this.element[0], orig = event.originalEvent) for(prop in orig)prop in event || (event[prop] = orig[prop]);
                return this.element.trigger(event, data), !($17.isFunction(callback) && !1 === callback.apply(this.element[0], [
                    event
                ].concat(data)) || event.isDefaultPrevented());
            }
        }, $17.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function(method, defaultEffect) {
            $17.Widget.prototype["_" + method] = function(element, options, callback) {
                "string" == typeof options && (options = {
                    effect: options
                });
                var hasOptions, effectName = options ? !0 === options || "number" == typeof options ? defaultEffect : options.effect || defaultEffect : method;
                "number" == typeof (options = options || {
                }) && (options = {
                    duration: options
                }), hasOptions = !$17.isEmptyObject(options), options.complete = callback, options.delay && element.delay(options.delay), hasOptions && $17.effects && $17.effects.effect[effectName] ? element[method](options) : effectName !== method && element[effectName] ? element[effectName](options.duration, options.easing, callback) : element.queue(function(next) {
                    $17(this)[method](), callback && callback.call(element[0]), next();
                });
            };
        });
    })(jQuery), rcapitals = /[A-Z]/g, ($ = jQuery).extend($.Widget.prototype, {
        _getCreateOptions: function() {
            var option, value, elem = this.element[0], options = {
            };
            if (!$.mobile.getAttribute(elem, "defaults")) for(option in this.options)null != (value = $.mobile.getAttribute(elem, option.replace(rcapitals, function(c) {
                return "-" + c.toLowerCase();
            }))) && (options[option] = value);
            return options;
        }
    }), $.mobile.widget = $.Widget, (function($17) {
        var $html = $17("html");
        $17.widget("mobile.loader", {
            options: {
                theme: "a",
                textVisible: !1,
                html: "",
                text: "loading"
            },
            defaultHtml: "<div class='ui-loader'><span class='ui-icon-loading'></span><h1></h1></div>",
            fakeFixLoader: function() {
                var activeBtn = $17("." + $17.mobile.activeBtnClass).first();
                this.element.css({
                    top: $17.support.scrollTop && this.window.scrollTop() + this.window.height() / 2 || activeBtn.length && activeBtn.offset().top || 100
                });
            },
            checkLoaderPosition: function() {
                var offset = this.element.offset(), scrollTop = this.window.scrollTop(), screenHeight = $17.mobile.getScreenHeight();
                (offset.top < scrollTop || offset.top - scrollTop > screenHeight) && (this.element.addClass("ui-loader-fakefix"), this.fakeFixLoader(), this.window.unbind("scroll", this.checkLoaderPosition).bind("scroll", $17.proxy(this.fakeFixLoader, this)));
            },
            resetHtml: function() {
                this.element.html($17(this.defaultHtml).html());
            },
            show: function(theme, msgText, textonly) {
                var message, loadSettings;
                this.resetHtml(), "object" === $17.type(theme) ? theme = (loadSettings = $17.extend({
                }, this.options, theme)).theme : (loadSettings = this.options, theme = theme || loadSettings.theme), message = msgText || (!1 === loadSettings.text ? "" : loadSettings.text), $html.addClass("ui-loading"), loadSettings.textVisible, this.element.attr("class", "ui-loader ui-corner-all ui-body-" + theme + " ui-loader-" + (loadSettings.textVisible || msgText || theme.text ? "verbose" : "default") + (loadSettings.textonly || textonly ? " ui-loader-textonly" : "")), loadSettings.html ? this.element.html(loadSettings.html) : this.element.find("h1").text(message), this.element.appendTo($17.mobile.pageContainer), this.checkLoaderPosition(), this.window.bind("scroll", $17.proxy(this.checkLoaderPosition, this));
            },
            hide: function() {
                $html.removeClass("ui-loading"), this.options.text && this.element.removeClass("ui-loader-fakefix"), $17.mobile.window.unbind("scroll", this.fakeFixLoader), $17.mobile.window.unbind("scroll", this.checkLoaderPosition);
            }
        });
    })(jQuery, this), (function($17, window, undefined) {
        "$:nomunge";
        var fake_onhashchange, doc = document, special = $17.event.special, doc_mode = doc.documentMode, supports_onhashchange = "onhashchange" in window && (doc_mode === undefined || doc_mode > 7);
        function get_fragment(url) {
            return "#" + (url = url || location.href).replace(/^[^#]*#?(.*)$/, "$1");
        }
        $17.fn.hashchange = function(fn) {
            return fn ? this.bind("hashchange", fn) : this.trigger("hashchange");
        }, $17.fn.hashchange.delay = 50, special.hashchange = $17.extend(special.hashchange, {
            setup: function() {
                if (supports_onhashchange) return !1;
                $17(fake_onhashchange.start);
            },
            teardown: function() {
                if (supports_onhashchange) return !1;
                $17(fake_onhashchange.stop);
            }
        }), fake_onhashchange = (function() {
            var iframe, iframe_src, timeout_id, self = {
            }, last_hash = get_fragment(), fn_retval = function(val) {
                return val;
            }, history_set = fn_retval, history_get = fn_retval;
            function poll() {
                var hash = get_fragment(), history_hash = history_get(last_hash);
                hash !== last_hash ? (history_set(last_hash = hash, history_hash), $17(window).trigger("hashchange")) : history_hash !== last_hash && (location.href = location.href.replace(/#.*/, "") + history_hash), timeout_id = setTimeout(poll, $17.fn.hashchange.delay);
            }
            return self.start = function() {
                timeout_id || poll();
            }, self.stop = function() {
                timeout_id && clearTimeout(timeout_id), timeout_id = undefined;
            }, !window.attachEvent || window.addEventListener || supports_onhashchange || (self.start = function() {
                iframe || (iframe_src = (iframe_src = $17.fn.hashchange.src) && iframe_src + get_fragment(), iframe = $17("<iframe tabindex=\"-1\" title=\"empty\"/>").hide().one("load", function() {
                    iframe_src || history_set(get_fragment()), poll();
                }).attr("src", iframe_src || "javascript:0").insertAfter("body")[0].contentWindow, doc.onpropertychange = function() {
                    try {
                        "title" === event.propertyName && (iframe.document.title = doc.title);
                    } catch (e) {
                    }
                });
            }, self.stop = fn_retval, history_get = function() {
                return get_fragment(iframe.location.href);
            }, history_set = function(hash, history_hash) {
                var iframe_doc = iframe.document, domain = $17.fn.hashchange.domain;
                hash !== history_hash && (iframe_doc.title = doc.title, iframe_doc.open(), domain && iframe_doc.write("<script>document.domain=\"" + domain + "\"</script>"), iframe_doc.close(), iframe.location.hash = hash);
            }), self;
        })();
    })(jQuery, this), window.matchMedia = window.matchMedia || (refNode = (docElem = (doc = document).documentElement).firstElementChild || docElem.firstChild, fakeBody = doc.createElement("body"), (div = doc.createElement("div")).id = "mq-test-1", div.style.cssText = "position:absolute;top:-100em", fakeBody.style.background = "none", fakeBody.appendChild(div), function(q) {
        return div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>", docElem.insertBefore(fakeBody, refNode), bool = 42 === div.offsetWidth, docElem.removeChild(fakeBody), {
            matches: bool,
            media: q
        };
    }), jQuery.mobile.media = function(q) {
        return window.matchMedia(q).matches;
    }, $1 = jQuery, support = {
        touch: "ontouchend" in document
    }, $1.mobile.support = $1.mobile.support || {
    }, $1.extend($1.support, support), $1.extend($1.mobile.support, support), (function($17, undefined) {
        $17.extend($17.support, {
            orientation: "orientation" in window && "onorientationchange" in window
        });
    })(jQuery), (function($17, undefined) {
        function propExists(prop) {
            var v, uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1), props = (prop + " " + vendors.join(uc_prop + " ") + uc_prop).split(" ");
            for(v in props)if (undefined !== fbCSS[props[v]]) return !0;
        }
        var nokiaLTE7_3, w, ua, platform, wkmatch, wkversion, ffmatch, ffversion, operammobilematch, omversion, link, fauxBase, base, supports, element, documentElement, getComputedStyle, ua1, fakeBody = $17("<body>").prependTo("html"), fbCSS = fakeBody[0].style, vendors = [
            "Webkit",
            "Moz",
            "O"
        ], operamini = window.operamini && "[object OperaMini]" === ({
        }).toString.call(window.operamini), bb = window.blackberry && !propExists("-webkit-transform");
        $17.extend($17.mobile, {
            browser: {
            }
        }), $17.mobile.browser.oldIE = (function() {
            var v = 3, div = document.createElement("div"), a = div.all || [];
            do div.innerHTML = "<!--[if gt IE " + ++v + "]><br><![endif]-->";
            while (a[0])
            return v > 4 ? v : !v;
        })(), $17.extend($17.support, {
            pushState: "pushState" in history && "replaceState" in history && !(window.navigator.userAgent.indexOf("Firefox") >= 0 && window.top !== window) && -1 === window.navigator.userAgent.search(/CriOS/),
            mediaquery: $17.mobile.media("only all"),
            cssPseudoElement: !!propExists("content"),
            touchOverflow: !!propExists("overflowScrolling"),
            cssTransform3d: function() {
                var el, transforms, t, ret = $17.mobile.media("(-" + vendors.join("-transform-3d),(-") + "-transform-3d),(transform-3d)");
                if (ret) return !!ret;
                for(t in el = document.createElement("div"), transforms = {
                    MozTransform: "-moz-transform",
                    transform: "transform"
                }, fakeBody.append(el), transforms)undefined !== el.style[t] && (el.style[t] = "translate3d( 100px, 1px, 1px )", ret = window.getComputedStyle(el).getPropertyValue(transforms[t]));
                return !!ret && "none" !== ret;
            }(),
            boxShadow: !!propExists("boxShadow") && !bb,
            fixedPosition: (w = window, ua = navigator.userAgent, platform = navigator.platform, wkversion = !!(wkmatch = ua.match(/AppleWebKit\/([0-9]+)/)) && wkmatch[1], ffversion = !!(ffmatch = ua.match(/Fennec\/([0-9]+)/)) && ffmatch[1], omversion = !!(operammobilematch = ua.match(/Opera Mobi\/([0-9]+)/)) && operammobilematch[1], !((platform.indexOf("iPhone") > -1 || platform.indexOf("iPad") > -1 || platform.indexOf("iPod") > -1) && wkversion && wkversion < 534 || w.operamini && "[object OperaMini]" === ({
            }).toString.call(w.operamini) || operammobilematch && omversion < 7458 || ua.indexOf("Android") > -1 && wkversion && wkversion < 533 || ffversion && ffversion < 6 || "palmGetResource" in window && wkversion && wkversion < 534 || ua.indexOf("MeeGo") > -1 && ua.indexOf("NokiaBrowser/8.5.0") > -1)),
            scrollTop: ("pageXOffset" in window || "scrollTop" in document.documentElement || "scrollTop" in fakeBody[0]) && !("palmGetResource" in window) && !operamini,
            dynamicBaseTag: (fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/", (base = $17("head base")).length ? base.attr("href") : base = $17("<base>", {
                href: fauxBase
            }).appendTo("head"), (link = $17("<a href='testurl' />").prependTo(fakeBody))[0].href, base[0].href = location.pathname, 0 === link[0].href.indexOf(fauxBase)),
            cssPointerEvents: (element = document.createElement("x"), documentElement = document.documentElement, getComputedStyle = window.getComputedStyle, "pointerEvents" in element.style && (element.style.pointerEvents = "auto", element.style.pointerEvents = "x", documentElement.appendChild(element), supports = getComputedStyle && "auto" === getComputedStyle(element, "").pointerEvents, documentElement.removeChild(element), !!supports)),
            boundingRect: void 0 !== document.createElement("div").getBoundingClientRect,
            inlineSVG: function() {
                var w = window, svg = !!w.document.createElementNS && !!w.document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect && !(w.opera && -1 === navigator.userAgent.indexOf("Chrome")), support = function(data) {
                    data && svg || $17("html").addClass("ui-nosvg");
                }, img = new w.Image();
                img.onerror = function() {
                    support(!1);
                }, img.onload = function() {
                    support(1 === img.width && 1 === img.height);
                }, img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            }
        }), fakeBody.remove(), nokiaLTE7_3 = (ua1 = window.navigator.userAgent).indexOf("Nokia") > -1 && (ua1.indexOf("Symbian/3") > -1 || ua1.indexOf("Series60/5") > -1) && ua1.indexOf("AppleWebKit") > -1 && ua1.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/), $17.mobile.gradeA = function() {
            return ($17.support.mediaquery && $17.support.cssPseudoElement || $17.mobile.browser.oldIE && $17.mobile.browser.oldIE >= 8) && ($17.support.boundingRect || null !== $17.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/));
        }, $17.mobile.ajaxBlacklist = window.blackberry && !window.WebKitPoint || operamini || nokiaLTE7_3, nokiaLTE7_3 && $17(function() {
            $17("head link[rel='stylesheet']").attr("rel", "alternate stylesheet").attr("rel", "stylesheet");
        }), $17.support.boxShadow || $17("html").addClass("ui-noboxshadow");
    })(jQuery), $win = ($2 = jQuery).mobile.window, dummyFnToInitNavigate = function() {
    }, $2.event.special.beforenavigate = {
        setup: function() {
            $win.on("navigate", dummyFnToInitNavigate);
        },
        teardown: function() {
            $win.off("navigate", dummyFnToInitNavigate);
        }
    }, $2.event.special.navigate = self = {
        bound: !1,
        pushStateEnabled: !0,
        originalEventName: void 0,
        isPushStateEnabled: function() {
            return $2.support.pushState && !0 === $2.mobile.pushStateEnabled && this.isHashChangeEnabled();
        },
        isHashChangeEnabled: function() {
            return !0 === $2.mobile.hashListeningEnabled;
        },
        popstate: function(event) {
            var newEvent = new $2.Event("navigate"), beforeNavigate = new $2.Event("beforenavigate"), state = event.originalEvent.state || {
            };
            beforeNavigate.originalEvent = event, $win.trigger(beforeNavigate), beforeNavigate.isDefaultPrevented() || (event.historyState && $2.extend(state, event.historyState), newEvent.originalEvent = event, setTimeout(function() {
                $win.trigger(newEvent, {
                    state: state
                });
            }, 0));
        },
        hashchange: function(event) {
            var newEvent = new $2.Event("navigate"), beforeNavigate = new $2.Event("beforenavigate");
            beforeNavigate.originalEvent = event, $win.trigger(beforeNavigate), beforeNavigate.isDefaultPrevented() || (newEvent.originalEvent = event, $win.trigger(newEvent, {
                state: event.hashchangeState || {
                }
            }));
        },
        setup: function() {
            !self.bound && (self.bound = !0, self.isPushStateEnabled() ? (self.originalEventName = "popstate", $win.bind("popstate.navigate", self.popstate)) : self.isHashChangeEnabled() && (self.originalEventName = "hashchange", $win.bind("hashchange.navigate", self.hashchange)));
        }
    }, ($3 = jQuery).mobile.path = path = {
        uiStateKey: "&ui-state",
        urlParseRE: /^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,
        getLocation: function(url) {
            var uri = url ? this.parseUrl(url) : location, hash = this.parseUrl(url || location.href).hash;
            return hash = "#" === hash ? "" : hash, uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash;
        },
        getDocumentUrl: function(asParsedObject) {
            return asParsedObject ? $3.extend({
            }, path.documentUrl) : path.documentUrl.href;
        },
        parseLocation: function() {
            return this.parseUrl(this.getLocation());
        },
        parseUrl: function(url) {
            if ("object" === $3.type(url)) return url;
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
                    break;
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
            absUrl === undefined && (absUrl = this.documentBase);
            var relObj = path.parseUrl(relUrl), absObj = path.parseUrl(absUrl), protocol = relObj.protocol || absObj.protocol, doubleSlash = relObj.protocol ? relObj.doubleSlash : relObj.doubleSlash || absObj.doubleSlash, authority = relObj.authority || absObj.authority, hasPath = "" !== relObj.pathname;
            return protocol + doubleSlash + authority + path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname) + (relObj.search || !hasPath && absObj.search || "") + relObj.hash;
        },
        addSearchParams: function(url, params) {
            var u = path.parseUrl(url), p = "object" == typeof params ? $3.param(params) : params, s = u.search || "?";
            return u.hrefNoSearch + s + ("?" !== s.charAt(s.length - 1) ? "&" : "") + p + (u.hash || "");
        },
        convertUrlToDataUrl: function(absUrl) {
            var u = path.parseUrl(absUrl);
            return path.isEmbeddedPage(u) ? u.hash.split("&ui-state=dialog")[0].replace(/^#/, "").replace(/\?.*$/, "") : path.isSameDomain(u, this.documentBase) ? u.hrefNoHash.replace(this.documentBase.domain, "").split("&ui-state=dialog")[0] : window.decodeURIComponent(absUrl);
        },
        get: function(newPath) {
            return newPath === undefined && (newPath = path.parseLocation().hash), path.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, "");
        },
        set: function(path2) {
            location.hash = path2;
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
            return path.stripHash(hash.replace(/\?.*$/, "").replace("&ui-state=dialog", ""));
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
            var href, cleanedUrl, stateIndex, isPath = this.isPath(url), uri = this.parseUrl(url), preservedHash = uri.hash, uiState = "";
            return resolutionUrl = resolutionUrl || (path.isPath(url) ? path.getLocation() : path.getDocumentUrl()), cleanedUrl = isPath ? path.stripHash(url) : url, (stateIndex = (cleanedUrl = path.isPath(uri.hash) ? path.stripHash(uri.hash) : cleanedUrl).indexOf(this.uiStateKey)) > -1 && (uiState = cleanedUrl.slice(stateIndex), cleanedUrl = cleanedUrl.slice(0, stateIndex)), href = path.makeUrlAbsolute(cleanedUrl, resolutionUrl), this.parseUrl(href).search, isPath ? ((path.isPath(preservedHash) || 0 === preservedHash.replace("#", "").indexOf(this.uiStateKey)) && (preservedHash = ""), uiState && -1 === preservedHash.indexOf(this.uiStateKey) && (preservedHash += uiState), -1 === preservedHash.indexOf("#") && "" !== preservedHash && (preservedHash = "#" + preservedHash), href = (href = path.parseUrl(href)).protocol + "//" + href.host + href.pathname + this.parseUrl(href).search + preservedHash) : href += href.indexOf("#") > -1 ? uiState : "#" + uiState, href;
        },
        isPreservableHash: function(hash) {
            return 0 === hash.replace("#", "").indexOf(this.uiStateKey);
        },
        hashToSelector: function(hash) {
            var hasHash = "#" === hash.substring(0, 1);
            return hasHash && (hash = hash.substring(1)), (hasHash ? "#" : "") + hash.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, "\\$1");
        },
        getFilePath: function(path2) {
            var splitkey = "&" + $3.mobile.subPageUrlKey;
            return path2 && path2.split(splitkey)[0].split("&ui-state=dialog")[0];
        },
        isFirstPageUrl: function(url) {
            var u = path.parseUrl(path.makeUrlAbsolute(url, this.documentBase)), samePath = u.hrefNoHash === this.documentUrl.hrefNoHash || this.documentBaseDiffers && u.hrefNoHash === this.documentBase.hrefNoHash, fp = $3.mobile.firstPage, fpId = fp && fp[0] ? fp[0].id : undefined;
            return samePath && (!u.hash || "#" === u.hash || fpId && u.hash.replace(/^#/, "") === fpId);
        },
        isPermittedCrossDomainRequest: function(docUrl, reqUrl) {
            return $3.mobile.allowCrossDomainPages && ("file:" === docUrl.protocol || "content:" === docUrl.protocol) && -1 !== reqUrl.search(/^https?:/);
        }
    }, path.documentUrl = path.parseLocation(), $base = $3("head").find("base"), path.documentBase = $base.length ? path.parseUrl(path.makeUrlAbsolute($base.attr("href"), path.documentUrl.href)) : path.documentUrl, path.documentBaseDiffers = path.documentUrl.hrefNoHash !== path.documentBase.hrefNoHash, path.getDocumentBase = function(asParsedObject) {
        return asParsedObject ? $3.extend({
        }, path.documentBase) : path.documentBase.href;
    }, $3.extend($3.mobile, {
        getDocumentUrl: path.getDocumentUrl,
        getDocumentBase: path.getDocumentBase
    }), ($4 = jQuery).mobile.History = function(stack, index) {
        this.stack = stack || [], this.activeIndex = index || 0;
    }, $4.extend($4.mobile.History.prototype, {
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
            data = data || {
            }, this.getNext() && this.clearForward(), data.hash && -1 === data.hash.indexOf("#") && (data.hash = "#" + data.hash), data.url = url, this.stack.push(data), this.activeIndex = this.stack.length - 1;
        },
        clearForward: function() {
            this.stack = this.stack.slice(0, this.activeIndex + 1);
        },
        find: function(url, stack, earlyReturn) {
            var entry, i, index, length = (stack = stack || this.stack).length;
            for(i = 0; i < length; i++)if (entry = stack[i], (decodeURIComponent(url) === decodeURIComponent(entry.url) || decodeURIComponent(url) === decodeURIComponent(entry.hash)) && (index = i, earlyReturn)) return index;
            return index;
        },
        closest: function(url) {
            var closest, a = this.activeIndex;
            return undefined === (closest = this.find(url, this.stack.slice(0, a))) && (closest = undefined === (closest = this.find(url, this.stack.slice(a), !0)) ? closest : closest + a), closest;
        },
        direct: function(opts) {
            var newActiveIndex = this.closest(opts.url), a = this.activeIndex;
            newActiveIndex !== undefined && (this.activeIndex = newActiveIndex, this.previousIndex = a), newActiveIndex < a ? (opts.present || opts.back || $4.noop)(this.getActive(), "back") : newActiveIndex > a ? (opts.present || opts.forward || $4.noop)(this.getActive(), "forward") : newActiveIndex === undefined && opts.missing && opts.missing(this.getActive());
        }
    }), path1 = ($5 = jQuery).mobile.path, initialHref = location.href, $5.mobile.Navigator = function(history) {
        this.history = history, this.ignoreInitialHashChange = !0, $5.mobile.window.bind({
            "popstate.history": $5.proxy(this.popstate, this),
            "hashchange.history": $5.proxy(this.hashchange, this)
        });
    }, $5.extend($5.mobile.Navigator.prototype, {
        squash: function(url, data) {
            var state, href, hash = path1.isPath(url) ? path1.stripHash(url) : url;
            return href = path1.squash(url), state = $5.extend({
                hash: hash,
                url: href
            }, data), window.history.replaceState(state, state.title || document.title, href), state;
        },
        hash: function(url, href) {
            var parsed, loc, resolved;
            return parsed = path1.parseUrl(url), (loc = path1.parseLocation()).pathname + loc.search === parsed.pathname + parsed.search ? parsed.hash ? parsed.hash : parsed.pathname + parsed.search : path1.isPath(url) ? (resolved = path1.parseUrl(href)).pathname + resolved.search + (path1.isPreservableHash(resolved.hash) ? resolved.hash.replace("#", "") : "") : url;
        },
        go: function(url, data, noEvents) {
            var state, href, hash, popstateEvent, isPopStateEvent = $5.event.special.navigate.isPushStateEnabled();
            href = path1.squash(url), hash = this.hash(url, href), noEvents && hash !== path1.stripHash(path1.parseLocation().hash) && (this.preventNextHashChange = noEvents), this.preventHashAssignPopState = !0, window.location.hash = hash, this.preventHashAssignPopState = !1, state = $5.extend({
                url: href,
                hash: hash,
                title: document.title
            }, data), isPopStateEvent && ((popstateEvent = new $5.Event("popstate")).originalEvent = {
                type: "popstate",
                state: null
            }, this.squash(url, state), noEvents || (this.ignorePopState = !0, $5.mobile.window.trigger(popstateEvent))), this.history.add(state.url, state);
        },
        popstate: function(event) {
            var hash, state;
            if ($5.event.special.navigate.isPushStateEnabled()) return this.preventHashAssignPopState ? (this.preventHashAssignPopState = !1, void event.stopImmediatePropagation()) : this.ignorePopState ? void (this.ignorePopState = !1) : !event.originalEvent.state && 1 === this.history.stack.length && this.ignoreInitialHashChange && (this.ignoreInitialHashChange = !1, location.href === initialHref) ? void event.preventDefault() : (hash = path1.parseLocation().hash, !event.originalEvent.state && hash) ? (state = this.squash(hash), this.history.add(state.url, state), void (event.historyState = state)) : void this.history.direct({
                url: (event.originalEvent.state || {
                }).url || hash,
                present: function(historyEntry, direction) {
                    event.historyState = $5.extend({
                    }, historyEntry), event.historyState.direction = direction;
                }
            });
        },
        hashchange: function(event) {
            var history, hash;
            if (!(!$5.event.special.navigate.isHashChangeEnabled() || $5.event.special.navigate.isPushStateEnabled())) {
                if (this.preventNextHashChange) return this.preventNextHashChange = !1, void event.stopImmediatePropagation();
                history = this.history, hash = path1.parseLocation().hash, this.history.direct({
                    url: hash,
                    present: function(historyEntry, direction) {
                        event.hashchangeState = $5.extend({
                        }, historyEntry), event.hashchangeState.direction = direction;
                    },
                    missing: function() {
                        history.add(hash, {
                            hash: hash,
                            title: document.title
                        });
                    }
                });
            }
        }
    }), (function($17, undefined) {
        $17.mobile.navigate = function(url, data, noEvents) {
            $17.mobile.navigate.navigator.go(url, data, noEvents);
        }, $17.mobile.navigate.history = new $17.mobile.History(), $17.mobile.navigate.navigator = new $17.mobile.Navigator($17.mobile.navigate.history);
        var loc = $17.mobile.path.parseLocation();
        $17.mobile.navigate.history.add(loc.href, {
            hash: loc.hash
        });
    })(jQuery), (function($17, undefined) {
        var props = {
            animation: {
            },
            transition: {
            }
        }, testElement = document.createElement("a"), vendorPrefixes = [
            "",
            "webkit-",
            "moz-",
            "o-"
        ];
        $17.each([
            "animation",
            "transition"
        ], function(i, test) {
            var testName = 0 === i ? test + "-name" : test;
            $17.each(vendorPrefixes, function(j, prefix) {
                if (undefined !== testElement.style[$17.camelCase(prefix + testName)]) return props[test].prefix = prefix, !1;
            }), props[test].duration = $17.camelCase(props[test].prefix + test + "-duration"), props[test].event = $17.camelCase(props[test].prefix + test + "-end"), "" === props[test].prefix && (props[test].event = props[test].event.toLowerCase());
        }), $17.support.cssTransitions = undefined !== props.transition.prefix, $17.support.cssAnimations = undefined !== props.animation.prefix, $17(testElement).remove(), $17.fn.animationComplete = function(callback, type, fallbackTime) {
            var timer, duration, that = this, animationType = type && "animation" !== type ? "transition" : "animation";
            return $17.support.cssTransitions && "transition" === animationType || $17.support.cssAnimations && "animation" === animationType ? (fallbackTime === undefined && ($17(this).context !== document && (duration = 3000 * parseFloat($17(this).css(props[animationType].duration))), (0 === duration || duration === undefined || isNaN(duration)) && (duration = $17.fn.animationComplete.defaultDuration)), timer = setTimeout(function() {
                $17(that).off(props[animationType].event), callback.apply(that);
            }, duration), $17(this).one(props[animationType].event, function() {
                clearTimeout(timer), callback.call(this, arguments);
            })) : (setTimeout($17.proxy(callback, this), 0), $17(this));
        }, $17.fn.animationComplete.defaultDuration = 1000;
    })(jQuery), (function($17, window, document, undefined) {
        var threshold, i, virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "), touchEventProps = "clientX clientY pageX pageY screenX screenY".split(" "), mouseHookProps = $17.event.mouseHooks ? $17.event.mouseHooks.props : [], mouseEventProps = $17.event.props.concat(mouseHookProps), activeDocHandlers = {
        }, resetTimerID = 0, startX = 0, startY = 0, didScroll = !1, clickBlockList = [], blockMouseTriggers = !1, blockTouchTriggers = !1, eventCaptureSupported = "addEventListener" in document, $document = $17(document), nextTouchID = 1, lastTouchID = 0;
        function getNativeEvent(event) {
            for(; event && void 0 !== event.originalEvent;)event = event.originalEvent;
            return event;
        }
        function createVirtualEvent(event, eventType) {
            var oe, props, ne, prop, ct, touch, i, j, len, t = event.type;
            if ((event = $17.Event(event)).type = eventType, oe = event.originalEvent, props = $17.event.props, t.search(/^(mouse|click)/) > -1 && (props = mouseEventProps), oe) for(i = props.length; i;)event[prop = props[--i]] = oe[prop];
            if (t.search(/mouse(down|up)|click/) > -1 && !event.which && (event.which = 1), -1 !== t.search(/^touch/) && (t = (ne = getNativeEvent(oe)).touches, ct = ne.changedTouches, touch = t && t.length ? t[0] : ct && ct.length ? ct[0] : void 0)) for(j = 0, len = touchEventProps.length; j < len; j++)event[prop = touchEventProps[j]] = touch[prop];
            return event;
        }
        function getVirtualBindingFlags(element) {
            for(var b, k, flags = {
            }; element;){
                for(k in b = $17.data(element, "virtualMouseBindings"))b[k] && (flags[k] = flags.hasVirtualBinding = !0);
                element = element.parentNode;
            }
            return flags;
        }
        function getClosestElementWithVirtualBinding(element, eventType) {
            for(var b; element;){
                if ((b = $17.data(element, "virtualMouseBindings")) && (!eventType || b[eventType])) return element;
                element = element.parentNode;
            }
            return null;
        }
        function enableTouchBindings() {
            blockTouchTriggers = !1;
        }
        function disableTouchBindings() {
            blockTouchTriggers = !0;
        }
        function enableMouseBindings() {
            lastTouchID = 0, clickBlockList.length = 0, blockMouseTriggers = !1, disableTouchBindings();
        }
        function disableMouseBindings() {
            enableTouchBindings();
        }
        function startResetTimer() {
            clearResetTimer(), resetTimerID = setTimeout(function() {
                resetTimerID = 0, enableMouseBindings();
            }, $17.vmouse.resetTimerDuration);
        }
        function clearResetTimer() {
            resetTimerID && (clearTimeout(resetTimerID), resetTimerID = 0);
        }
        function triggerVirtualEvent(eventType, event, flags) {
            var ve;
            return (flags && flags[eventType] || !flags && getClosestElementWithVirtualBinding(event.target, eventType)) && (ve = createVirtualEvent(event, eventType), $17(event.target).trigger(ve)), ve;
        }
        function mouseEventCallback(event) {
            var ve, touchID = $17.data(event.target, "virtualTouchID");
            !blockMouseTriggers && (!lastTouchID || lastTouchID !== touchID) && (ve = triggerVirtualEvent("v" + event.type, event)) && (ve.isDefaultPrevented() && event.preventDefault(), ve.isPropagationStopped() && event.stopPropagation(), ve.isImmediatePropagationStopped() && event.stopImmediatePropagation());
        }
        function handleTouchStart(event) {
            var target, flags, t, touches = getNativeEvent(event).touches;
            touches && 1 === touches.length && (flags = getVirtualBindingFlags(target = event.target)).hasVirtualBinding && (lastTouchID = nextTouchID++, $17.data(target, "virtualTouchID", lastTouchID), clearResetTimer(), disableMouseBindings(), didScroll = !1, startX = (t = getNativeEvent(event).touches[0]).pageX, startY = t.pageY, triggerVirtualEvent("vmouseover", event, flags), triggerVirtualEvent("vmousedown", event, flags));
        }
        function handleScroll(event) {
            blockTouchTriggers || (didScroll || triggerVirtualEvent("vmousecancel", event, getVirtualBindingFlags(event.target)), didScroll = !0, startResetTimer());
        }
        function handleTouchMove(event) {
            if (!blockTouchTriggers) {
                var t = getNativeEvent(event).touches[0], didCancel = didScroll, moveThreshold = $17.vmouse.moveDistanceThreshold, flags = getVirtualBindingFlags(event.target);
                (didScroll = didScroll || Math.abs(t.pageX - startX) > moveThreshold || Math.abs(t.pageY - startY) > moveThreshold) && !didCancel && triggerVirtualEvent("vmousecancel", event, flags), triggerVirtualEvent("vmousemove", event, flags), startResetTimer();
            }
        }
        function handleTouchEnd(event) {
            if (!blockTouchTriggers) {
                disableTouchBindings();
                var ve, t, flags = getVirtualBindingFlags(event.target);
                triggerVirtualEvent("vmouseup", event, flags), !didScroll && (ve = triggerVirtualEvent("vclick", event, flags)) && ve.isDefaultPrevented() && (t = getNativeEvent(event).changedTouches[0], clickBlockList.push({
                    touchID: lastTouchID,
                    x: t.clientX,
                    y: t.clientY
                }), blockMouseTriggers = !0), triggerVirtualEvent("vmouseout", event, flags), didScroll = !1, startResetTimer();
            }
        }
        function hasVirtualBindings(ele) {
            var k, bindings = $17.data(ele, "virtualMouseBindings");
            if (bindings) {
                for(k in bindings)if (bindings[k]) return !0;
            }
            return !1;
        }
        function dummyMouseHandler() {
        }
        function getSpecialEventObject(eventType) {
            var realType = eventType.substr(1);
            return {
                setup: function() {
                    hasVirtualBindings(this) || $17.data(this, "virtualMouseBindings", {
                    }), $17.data(this, "virtualMouseBindings")[eventType] = !0, activeDocHandlers[eventType] = (activeDocHandlers[eventType] || 0) + 1, 1 === activeDocHandlers[eventType] && $document.bind(realType, mouseEventCallback), $17(this).bind(realType, dummyMouseHandler), eventCaptureSupported && (activeDocHandlers.touchstart = (activeDocHandlers.touchstart || 0) + 1, 1 === activeDocHandlers.touchstart && $document.bind("touchstart", handleTouchStart).bind("touchend", handleTouchEnd).bind("touchmove", handleTouchMove).bind("scroll", handleScroll));
                },
                teardown: function() {
                    --activeDocHandlers[eventType], activeDocHandlers[eventType] || $document.unbind(realType, mouseEventCallback), eventCaptureSupported && (--activeDocHandlers.touchstart, activeDocHandlers.touchstart || $document.unbind("touchstart", handleTouchStart).unbind("touchmove", handleTouchMove).unbind("touchend", handleTouchEnd).unbind("scroll", handleScroll));
                    var $this = $17(this), bindings = $17.data(this, "virtualMouseBindings");
                    bindings && (bindings[eventType] = !1), $this.unbind(realType, dummyMouseHandler), hasVirtualBindings(this) || $this.removeData("virtualMouseBindings");
                }
            };
        }
        for(i = 0, $17.vmouse = {
            moveDistanceThreshold: 10,
            clickDistanceThreshold: 10,
            resetTimerDuration: 1500
        }; i < virtualEventNames.length; i++)$17.event.special[virtualEventNames[i]] = getSpecialEventObject(virtualEventNames[i]);
        eventCaptureSupported && document.addEventListener("click", function(e) {
            var x, y, ele, i, o, cnt = clickBlockList.length, target = e.target;
            if (cnt) for(x = e.clientX, y = e.clientY, threshold = $17.vmouse.clickDistanceThreshold, ele = target; ele;){
                for(i = 0; i < cnt; i++)if (o = clickBlockList[i], ele === target && Math.abs(o.x - x) < threshold && Math.abs(o.y - y) < threshold || $17.data(ele, "virtualTouchID") === o.touchID) return e.preventDefault(), void e.stopPropagation();
                ele = ele.parentNode;
            }
        }, !0);
    })(jQuery, window, document), (function($17, window, undefined) {
        var $document = $17(document), supportTouch = $17.mobile.support.touch, touchStartEvent = supportTouch ? "touchstart" : "mousedown", touchStopEvent = supportTouch ? "touchend" : "mouseup", touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
        function triggerCustomEvent(obj, eventType, event, bubble) {
            var originalType = event.type;
            event.type = eventType, bubble ? $17.event.trigger(event, void 0, obj) : $17.event.dispatch.call(obj, event), event.type = originalType;
        }
        $17.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "), function(i, name) {
            $17.fn[name] = function(fn) {
                return fn ? this.bind(name, fn) : this.trigger(name);
            }, $17.attrFn && ($17.attrFn[name] = !0);
        }), $17.event.special.scrollstart = {
            enabled: !0,
            setup: function() {
                var scrolling, timer, thisObject = this, $this = $17(thisObject);
                function trigger(event, state) {
                    triggerCustomEvent(thisObject, (scrolling = state) ? "scrollstart" : "scrollstop", event);
                }
                $this.bind("touchmove scroll", function(event) {
                    $17.event.special.scrollstart.enabled && (scrolling || trigger(event, !0), clearTimeout(timer), timer = setTimeout(function() {
                        trigger(event, !1);
                    }, 50));
                });
            },
            teardown: function() {
                $17(this).unbind("touchmove scroll");
            }
        }, $17.event.special.tap = {
            tapholdThreshold: 750,
            emitTapOnTaphold: !0,
            setup: function() {
                var thisObject = this, $this = $17(thisObject), isTaphold = !1;
                $this.bind("vmousedown", function(event) {
                    if (isTaphold = !1, event.which && 1 !== event.which) return !1;
                    var timer, origTarget = event.target;
                    function clearTapTimer() {
                        clearTimeout(timer);
                    }
                    function clearTapHandlers() {
                        clearTapTimer(), $this.unbind("vclick", clickHandler).unbind("vmouseup", clearTapTimer), $document.unbind("vmousecancel", clearTapHandlers);
                    }
                    function clickHandler(event) {
                        clearTapHandlers(), isTaphold || origTarget !== event.target ? isTaphold && event.stopPropagation() : triggerCustomEvent(thisObject, "tap", event);
                    }
                    $this.bind("vmouseup", clearTapTimer).bind("vclick", clickHandler), $document.bind("vmousecancel", clearTapHandlers), timer = setTimeout(function() {
                        $17.event.special.tap.emitTapOnTaphold || (isTaphold = !0), triggerCustomEvent(thisObject, "taphold", $17.Event("taphold", {
                            target: origTarget
                        }));
                    }, $17.event.special.tap.tapholdThreshold);
                });
            },
            teardown: function() {
                $17(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"), $document.unbind("vmousecancel");
            }
        }, $17.event.special.swipe = {
            scrollSupressionThreshold: 30,
            durationThreshold: 1000,
            horizontalDistanceThreshold: 30,
            verticalDistanceThreshold: 30,
            getLocation: function(event) {
                var winPageX = window.pageXOffset, winPageY = window.pageYOffset, x = event.clientX, y = event.clientY;
                return 0 === event.pageY && Math.floor(y) > Math.floor(event.pageY) || 0 === event.pageX && Math.floor(x) > Math.floor(event.pageX) ? (x -= winPageX, y -= winPageY) : (y < event.pageY - winPageY || x < event.pageX - winPageX) && (x = event.pageX - winPageX, y = event.pageY - winPageY), {
                    x: x,
                    y: y
                };
            },
            start: function(event) {
                var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event, location = $17.event.special.swipe.getLocation(data);
                return {
                    time: new Date().getTime(),
                    coords: [
                        location.x,
                        location.y
                    ],
                    origin: $17(event.target)
                };
            },
            stop: function(event) {
                var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event, location = $17.event.special.swipe.getLocation(data);
                return {
                    time: new Date().getTime(),
                    coords: [
                        location.x,
                        location.y
                    ]
                };
            },
            handleSwipe: function(start, stop, thisObject, origTarget) {
                if (stop.time - start.time < $17.event.special.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > $17.event.special.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < $17.event.special.swipe.verticalDistanceThreshold) {
                    var direction = start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight";
                    return triggerCustomEvent(thisObject, "swipe", $17.Event("swipe", {
                        target: origTarget,
                        swipestart: start,
                        swipestop: stop
                    }), !0), triggerCustomEvent(thisObject, direction, $17.Event(direction, {
                        target: origTarget,
                        swipestart: start,
                        swipestop: stop
                    }), !0), !0;
                }
                return !1;
            },
            eventInProgress: !1,
            setup: function() {
                var events, thisObject = this, $this = $17(thisObject), context = {
                };
                (events = $17.data(this, "mobile-events")) || (events = {
                    length: 0
                }, $17.data(this, "mobile-events", events)), events.length++, events.swipe = context, context.start = function(event) {
                    if (!$17.event.special.swipe.eventInProgress) {
                        $17.event.special.swipe.eventInProgress = !0;
                        var stop, start = $17.event.special.swipe.start(event), origTarget = event.target, emitted = !1;
                        context.move = function(event) {
                            !!start && (stop = $17.event.special.swipe.stop(event), !emitted && (emitted = $17.event.special.swipe.handleSwipe(start, stop, thisObject, origTarget)) && ($17.event.special.swipe.eventInProgress = !1), Math.abs(start.coords[0] - stop.coords[0]) > $17.event.special.swipe.scrollSupressionThreshold && event.preventDefault());
                        }, context.stop = function() {
                            emitted = !0, $17.event.special.swipe.eventInProgress = !1, $document.off(touchMoveEvent, context.move), context.move = null;
                        }, $document.on(touchMoveEvent, context.move).one(touchStopEvent, context.stop);
                    }
                }, $this.on(touchStartEvent, context.start);
            },
            teardown: function() {
                var events, context;
                (events = $17.data(this, "mobile-events")) && (context = events.swipe, delete events.swipe, events.length--, 0 === events.length && $17.removeData(this, "mobile-events")), context && (context.start && $17(this).off(touchStartEvent, context.start), context.move && $document.off(touchMoveEvent, context.move), context.stop && $document.off(touchStopEvent, context.stop));
            }
        }, $17.each({
            scrollstop: "scrollstart",
            taphold: "tap",
            swipeleft: "swipe",
            swiperight: "swipe"
        }, function(event, sourceEvent) {
            $17.event.special[event] = {
                setup: function() {
                    $17(this).bind(sourceEvent, $17.noop);
                },
                teardown: function() {
                    $17(this).unbind(sourceEvent);
                }
            };
        });
    })(jQuery, this), ($6 = jQuery).event.special.throttledresize = {
        setup: function() {
            $6(this).bind("resize", handler);
        },
        teardown: function() {
            $6(this).unbind("resize", handler);
        }
    }, handler = function() {
        (diff = (curr = new Date().getTime()) - lastCall) >= 250 ? (lastCall = curr, $6(this).trigger("throttledresize")) : (heldCall && clearTimeout(heldCall), heldCall = setTimeout(handler, 250 - diff));
    }, lastCall = 0, (function($17, window) {
        var get_orientation, last_orientation, initial_orientation_is_landscape, initial_orientation_is_default, ww, wh, landscape_threshold, win = $17(window), portrait_map = {
            "0": !0,
            "180": !0
        };
        function handler() {
            var orientation = get_orientation();
            orientation !== last_orientation && (last_orientation = orientation, win.trigger("orientationchange"));
        }
        $17.support.orientation && (landscape_threshold = 50, initial_orientation_is_landscape = (ww = window.innerWidth || win.width()) > (wh = window.innerHeight || win.height()) && ww - wh > landscape_threshold, initial_orientation_is_default = portrait_map[window.orientation], (initial_orientation_is_landscape && initial_orientation_is_default || !initial_orientation_is_landscape && !initial_orientation_is_default) && (portrait_map = {
            "-90": !0,
            "90": !0
        })), $17.event.special.orientationchange = $17.extend({
        }, $17.event.special.orientationchange, {
            setup: function() {
                if ($17.support.orientation && !$17.event.special.orientationchange.disabled) return !1;
                last_orientation = get_orientation(), win.bind("throttledresize", handler);
            },
            teardown: function() {
                if ($17.support.orientation && !$17.event.special.orientationchange.disabled) return !1;
                win.unbind("throttledresize", handler);
            },
            add: function(handleObj) {
                var old_handler = handleObj.handler;
                handleObj.handler = function(event) {
                    return event.orientation = get_orientation(), old_handler.apply(this, arguments);
                };
            }
        }), $17.event.special.orientationchange.orientation = get_orientation = function() {
            var elem = document.documentElement;
            return ($17.support.orientation ? portrait_map[window.orientation] : elem && elem.clientWidth / elem.clientHeight < 1.1) ? "portrait" : "landscape";
        }, $17.fn.orientationchange = function(fn) {
            return fn ? this.bind("orientationchange", fn) : this.trigger("orientationchange");
        }, $17.attrFn && ($17.attrFn.orientationchange = !0);
    })(jQuery, this), base = {
        element: (baseElement = ($7 = jQuery)("head").children("base")).length ? baseElement : $7("<base>", {
            href: $7.mobile.path.documentBase.hrefNoHash
        }).prependTo($7("head")),
        linkSelector: "[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]",
        set: function(href) {
            !!$7.mobile.dynamicBaseEnabled && $7.support.dynamicBaseTag && base.element.attr("href", $7.mobile.path.makeUrlAbsolute(href, $7.mobile.path.documentBase));
        },
        rewrite: function(href, page) {
            var newPath = $7.mobile.path.get(href);
            page.find(base.linkSelector).each(function(i, link) {
                var thisAttr = $7(link).is("[href]") ? "href" : $7(link).is("[src]") ? "src" : "action", thisUrl = $7(link).attr(thisAttr);
                thisUrl = thisUrl.replace(location.protocol + "//" + location.host + location.pathname, ""), /^(\w+:|#|\/)/.test(thisUrl) || $7(link).attr(thisAttr, newPath + thisUrl);
            });
        },
        reset: function() {
            base.element.attr("href", $7.mobile.path.documentBase.hrefNoSearch);
        }
    }, $7.mobile.base = base, (function($17, undefined) {
        $17.mobile.widgets = {
        };
        var originalWidget = $17.widget, keepNativeFactoryDefault = $17.mobile.keepNative;
        $17.widget = (function(orig) {
            return function() {
                var constructor = orig.apply(this, arguments), name = constructor.prototype.widgetName;
                return constructor.initSelector = undefined !== constructor.prototype.initSelector ? constructor.prototype.initSelector : ":jqmData(role='" + name + "')", $17.mobile.widgets[name] = constructor, constructor;
            };
        })($17.widget), $17.extend($17.widget, originalWidget), $17.mobile.document.on("create", function(event) {
            $17(event.target).enhanceWithin();
        }), $17.widget("mobile.page", {
            options: {
                theme: "a",
                domCache: !1,
                keepNativeDefault: $17.mobile.keepNative,
                contentTheme: null,
                enhanced: !1
            },
            _createWidget: function() {
                $17.Widget.prototype._createWidget.apply(this, arguments), this._trigger("init");
            },
            _create: function() {
                if (!1 === this._trigger("beforecreate")) return !1;
                this.options.enhanced || this._enhance(), this._on(this.element, {
                    pagebeforehide: "removeContainerBackground",
                    pagebeforeshow: "_handlePageBeforeShow"
                }), this.element.enhanceWithin(), "dialog" === $17.mobile.getAttribute(this.element[0], "role") && $17.mobile.dialog && this.element.dialog();
            },
            _enhance: function() {
                var attrPrefix = "data-" + $17.mobile.ns, self = this;
                this.options.role && this.element.attr("data-" + $17.mobile.ns + "role", this.options.role), this.element.attr("tabindex", "0").addClass("ui-page ui-page-theme-" + this.options.theme), this.element.find("[" + attrPrefix + "role='content']").each(function() {
                    var $this = $17(this), theme = this.getAttribute(attrPrefix + "theme") || undefined;
                    self.options.contentTheme = theme || self.options.contentTheme || self.options.dialog && self.options.theme || "dialog" === self.element.jqmData("role") && self.options.theme, $this.addClass("ui-content"), self.options.contentTheme && $this.addClass("ui-body-" + self.options.contentTheme), $this.attr("role", "main").addClass("ui-content");
                });
            },
            bindRemove: function(callback) {
                var page = this.element;
                !page.data("mobile-page").options.domCache && page.is(":jqmData(external-page='true')") && page.bind("pagehide.remove", callback || function(e, data) {
                    if (!data.samePage) {
                        var $this = $17(this), prEvent = new $17.Event("pageremove");
                        $this.trigger(prEvent), prEvent.isDefaultPrevented() || $this.removeWithDependents();
                    }
                });
            },
            _setOptions: function(o) {
                undefined !== o.theme && this.element.removeClass("ui-page-theme-" + this.options.theme).addClass("ui-page-theme-" + o.theme), undefined !== o.contentTheme && this.element.find("[data-" + $17.mobile.ns + "='content']").removeClass("ui-body-" + this.options.contentTheme).addClass("ui-body-" + o.contentTheme);
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
                var options = this.options, keepNative = $17.trim(options.keepNative || ""), globalValue = $17.trim($17.mobile.keepNative), optionValue = $17.trim(options.keepNativeDefault), newDefault = keepNativeFactoryDefault === globalValue ? "" : globalValue, oldDefault = "" === newDefault ? optionValue : "";
                return (keepNative ? [
                    keepNative
                ] : []).concat(newDefault ? [
                    newDefault
                ] : []).concat(oldDefault ? [
                    oldDefault
                ] : []).join(", ");
            }
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.pagecontainer", {
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
                }), this.window.one("navigate", $17.proxy(function() {
                    this.setLastScrollEnabled = !0;
                }, this));
            },
            _setOptions: function(options) {
                undefined !== options.theme && "none" !== options.theme ? this.element.removeClass("ui-overlay-" + this.options.theme).addClass("ui-overlay-" + options.theme) : undefined !== options.theme && this.element.removeClass("ui-overlay-" + this.options.theme), this._super(options);
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
                setTimeout($17.proxy(this, "_recordScroll"), 100);
            },
            _getScroll: function() {
                return this.window.scrollTop();
            },
            _getMinScroll: function() {
                return $17.mobile.minScrollBack;
            },
            _getDefaultScroll: function() {
                return $17.mobile.defaultHomeScroll;
            },
            _filterNavigateEvents: function(e, data) {
                var url;
                e.originalEvent && e.originalEvent.isDefaultPrevented() || ((url = e.originalEvent.type.indexOf("hashchange") > -1 ? data.state.hash : data.state.url) || (url = this._getHash()), url && "#" !== url && 0 !== url.indexOf("#" + $17.mobile.path.uiStateKey) || (url = location.href), this._handleNavigate(url, data.state));
            },
            _getHash: function() {
                return $17.mobile.path.parseLocation().hash;
            },
            getActivePage: function() {
                return this.activePage;
            },
            _getInitialContent: function() {
                return $17.mobile.firstPage;
            },
            _getHistory: function() {
                return $17.mobile.navigate.history;
            },
            _getActiveHistory: function() {
                return $17.mobile.navigate.history.getActive();
            },
            _getDocumentBase: function() {
                return $17.mobile.path.documentBase;
            },
            back: function() {
                this.go(-1);
            },
            forward: function() {
                this.go(1);
            },
            go: function(steps) {
                if ($17.mobile.hashListeningEnabled) window.history.go(steps);
                else {
                    var activeIndex = $17.mobile.navigate.history.activeIndex, index = activeIndex + parseInt(steps, 10), url = $17.mobile.navigate.history.stack[index].url, direction = steps >= 1 ? "forward" : "back";
                    $17.mobile.navigate.history.activeIndex = index, $17.mobile.navigate.history.previousIndex = activeIndex, this.change(url, {
                        direction: direction,
                        changeHash: !1,
                        fromHashChange: !0
                    });
                }
            },
            _handleDestination: function(to) {
                var history;
                return "string" === $17.type(to) && (to = $17.mobile.path.stripHash(to)), to && (history = this._getHistory(), (to = $17.mobile.path.isPath(to) ? to : $17.mobile.path.makeUrlAbsolute("#" + to, this._getDocumentBase())) === $17.mobile.path.makeUrlAbsolute("#" + history.initialDst, this._getDocumentBase()) && history.stack.length && history.stack[0].url !== history.initialDst.replace($17.mobile.dialogHashKey, "") && (to = this._getInitialContent())), to || this._getInitialContent();
            },
            _handleDialog: function(changePageOptions, data) {
                var active, activeContent = this.getActivePage();
                return activeContent && !activeContent.hasClass("ui-dialog") ? ("back" === data.direction ? this.back() : this.forward(), !1) : (data.pageUrl, active = this._getActiveHistory(), $17.extend(changePageOptions, {
                    role: active.role,
                    transition: active.transition,
                    reverse: "back" === data.direction
                }), data.pageUrl);
            },
            _handleNavigate: function(url, data) {
                var to = $17.mobile.path.stripHash(url), history = this._getHistory(), transition = 0 === history.stack.length ? "none" : undefined, changePageOptions = {
                    changeHash: !1,
                    fromHashChange: !0,
                    reverse: "back" === data.direction
                };
                $17.extend(changePageOptions, data, {
                    transition: (history.getLast() || {
                    }).transition || transition
                }), history.activeIndex > 0 && to.indexOf($17.mobile.dialogHashKey) > -1 && history.initialDst !== to && !1 === (to = this._handleDialog(changePageOptions, data)) || this._changeContent(this._handleDestination(to), changePageOptions);
            },
            _changeContent: function(to, opts) {
                $17.mobile.changePage(to, opts);
            },
            _getBase: function() {
                return $17.mobile.base;
            },
            _getNs: function() {
                return $17.mobile.ns;
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
                return 0 === (page = this.element.children("[data-" + this._getNs() + "url='" + dataUrl + "']")).length && dataUrl && !$17.mobile.path.isPath(dataUrl) && (page = this.element.children($17.mobile.path.hashToSelector("#" + dataUrl)).attr("data-" + this._getNs() + "url", dataUrl).jqmData("url", dataUrl)), 0 === page.length && $17.mobile.path.isFirstPageUrl(fileUrl) && initialContent && initialContent.parent().length && (page = $17(initialContent)), page;
            },
            _getLoader: function() {
                return $17.mobile.loading();
            },
            _showLoading: function(delay, theme, msg, textonly) {
                this._loadMsg || (this._loadMsg = setTimeout($17.proxy(function() {
                    this._getLoader().loader("show", theme, msg, textonly), this._loadMsg = 0;
                }, this), delay));
            },
            _hideLoading: function() {
                clearTimeout(this._loadMsg), this._loadMsg = 0, this._getLoader().loader("hide");
            },
            _showError: function() {
                this._hideLoading(), this._showLoading(0, $17.mobile.pageLoadErrorMessageTheme, $17.mobile.pageLoadErrorMessage, !0), setTimeout($17.proxy(this, "_hideLoading"), 1500);
            },
            _parse: function(html, fileUrl) {
                var page, all = $17("<div></div>");
                return all.get(0).innerHTML = html, (page = all.find(":jqmData(role='page'), :jqmData(role='dialog')").first()).length || (page = $17("<div data-" + this._getNs() + "role='page'>" + (html.split(/<\/?body[^>]*>/gmi)[1] || "") + "</div>")), page.attr("data-" + this._getNs() + "url", $17.mobile.path.convertUrlToDataUrl(fileUrl)).attr("data-" + this._getNs() + "external-page", !0), page;
            },
            _setLoadedTitle: function(page, html) {
                var newPageTitle = html.match(/<title[^>]*>([^<]*)/) && RegExp.$1;
                newPageTitle && !page.jqmData("title") && (newPageTitle = $17("<div>" + newPageTitle + "</div>").text(), page.jqmData("title", newPageTitle));
            },
            _isRewritableBaseTag: function() {
                return $17.mobile.dynamicBaseEnabled && !$17.support.dynamicBaseTag;
            },
            _createDataUrl: function(absoluteUrl) {
                return $17.mobile.path.convertUrlToDataUrl(absoluteUrl);
            },
            _createFileUrl: function(absoluteUrl) {
                return $17.mobile.path.getFilePath(absoluteUrl);
            },
            _triggerWithDeprecated: function(name, data, page) {
                var deprecatedEvent = $17.Event("page" + name), newEvent = $17.Event(this.widgetName + name);
                return (page || this.element).trigger(deprecatedEvent, data), this.element.trigger(newEvent, data), {
                    deprecatedEvent: deprecatedEvent,
                    event: newEvent
                };
            },
            _loadSuccess: function(absUrl, triggerData, settings, deferred) {
                var fileUrl = this._createFileUrl(absUrl), dataUrl = this._createDataUrl(absUrl);
                return $17.proxy(function(html, textStatus, xhr) {
                    var content, pageElemRegex = new RegExp("(<[^>]+\\bdata-" + this._getNs() + "role=[\"']?page[\"']?[^>]*>)"), dataUrlRegex = new RegExp("\\bdata-" + this._getNs() + "url=[\"']?([^\"'>]*)[\"']?");
                    pageElemRegex.test(html) && RegExp.$1 && dataUrlRegex.test(RegExp.$1) && RegExp.$1 && (fileUrl = $17.mobile.path.getFilePath($17("<div>" + RegExp.$1 + "</div>").text())), undefined === settings.prefetch && this._getBase().set(fileUrl), content = this._parse(html, fileUrl), this._setLoadedTitle(content, html), triggerData.xhr = xhr, triggerData.textStatus = textStatus, triggerData.page = content, triggerData.content = content, this._trigger("load", undefined, triggerData) && (this._isRewritableBaseTag() && content && this._getBase().rewrite(fileUrl, content), this._include(content, settings), absUrl.indexOf("&" + $17.mobile.subPageUrlKey) > -1 && (content = this.element.children("[data-" + this._getNs() + "url='" + dataUrl + "']")), settings.showLoadMsg && this._hideLoading(), this.element.trigger("pageload"), deferred.resolve(absUrl, settings, content));
                }, this);
            },
            _loadDefaults: {
                type: "get",
                data: undefined,
                reloadPage: !1,
                reload: !1,
                role: undefined,
                showLoadMsg: !1,
                loadMsgDelay: 50
            },
            load: function(url, options) {
                var fileUrl, dataUrl, pblEvent, triggerData, deferred = options && options.deferred || $17.Deferred(), settings = $17.extend({
                }, this._loadDefaults, options), content = null, absUrl = $17.mobile.path.makeUrlAbsolute(url, this._findBaseWithDefault());
                if (settings.reload = settings.reloadPage, settings.data && "get" === settings.type && (absUrl = $17.mobile.path.addSearchParams(absUrl, settings.data), settings.data = undefined), settings.data && "post" === settings.type && (settings.reload = !0), fileUrl = this._createFileUrl(absUrl), dataUrl = this._createDataUrl(absUrl), 0 === (content = this._find(absUrl)).length && $17.mobile.path.isEmbeddedPage(fileUrl) && !$17.mobile.path.isFirstPageUrl(fileUrl)) return void deferred.reject(absUrl, settings);
                if (this._getBase().reset(), content.length && !settings.reload) return this._enhance(content, settings.role), deferred.resolve(absUrl, settings, content), void (!settings.prefetch && this._getBase().set(url));
                if (triggerData = {
                    url: url,
                    absUrl: absUrl,
                    dataUrl: dataUrl,
                    deferred: deferred,
                    options: settings
                }, !((pblEvent = this._triggerWithDeprecated("beforeload", triggerData)).deprecatedEvent.isDefaultPrevented() || pblEvent.event.isDefaultPrevented())) {
                    if (settings.showLoadMsg && this._showLoading(settings.loadMsgDelay), undefined === settings.prefetch && this._getBase().reset(), !($17.mobile.allowCrossDomainPages || $17.mobile.path.isSameDomain($17.mobile.path.documentUrl, absUrl))) return void deferred.reject(absUrl, settings);
                    $17.ajax({
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
                return $17.proxy(function(xhr, textStatus, errorThrown) {
                    this._getBase().set($17.mobile.path.get()), triggerData.xhr = xhr, triggerData.textStatus = textStatus, triggerData.errorThrown = errorThrown;
                    var plfEvent = this._triggerWithDeprecated("loadfailed", triggerData);
                    plfEvent.deprecatedEvent.isDefaultPrevented() || plfEvent.event.isDefaultPrevented() || (settings.showLoadMsg && this._showError(), deferred.reject(absUrl, settings));
                }, this);
            },
            _getTransitionHandler: function(transition) {
                return transition = $17.mobile._maybeDegradeTransition(transition), $17.mobile.transitionHandlers[transition] || $17.mobile.defaultTransitionHandler;
            },
            _triggerCssTransitionEvents: function(to, from, prefix) {
                var samePage = !1;
                prefix = prefix || "", from && (to[0] === from[0] && (samePage = !0), this._triggerWithDeprecated(prefix + "hide", {
                    nextPage: to,
                    samePage: samePage
                }, from)), this._triggerWithDeprecated(prefix + "show", {
                    prevPage: from || $17("")
                }, to);
            },
            _cssTransition: function(to, from, options) {
                var promise, transition = options.transition, reverse = options.reverse, deferred = options.deferred;
                this._triggerCssTransitionEvents(to, from, "before"), this._hideLoading(), (promise = new (this._getTransitionHandler(transition))(transition, reverse, to, from).transition()).done(function() {
                    deferred.resolve.apply(deferred, arguments);
                }), promise.done($17.proxy(function() {
                    this._triggerCssTransitionEvents(to, from);
                }, this));
            },
            _releaseTransitionLock: function() {
                isPageTransitioning = !1, pageTransitionQueue.length > 0 && $17.mobile.changePage.apply(null, pageTransitionQueue.pop());
            },
            _removeActiveLinkClass: function(force) {
                $17.mobile.removeActiveLinkClass(force);
            },
            _loadUrl: function(to, triggerData, settings) {
                settings.target = to, settings.deferred = $17.Deferred(), this.load(to, settings), settings.deferred.done($17.proxy(function(url, options, content) {
                    isPageTransitioning = !1, options.absUrl = triggerData.absUrl, this.transition(content, triggerData, options);
                }, this)), settings.deferred.fail($17.proxy(function() {
                    this._removeActiveLinkClass(!0), this._releaseTransitionLock(), this._triggerWithDeprecated("changefailed", triggerData);
                }, this));
            },
            _triggerPageBeforeChange: function(to, triggerData, settings) {
                var pbcEvent = new $17.Event("pagebeforechange");
                return $17.extend(triggerData, {
                    toPage: to,
                    options: settings
                }), "string" === $17.type(to) ? triggerData.absUrl = $17.mobile.path.makeUrlAbsolute(to, this._findBaseWithDefault()) : triggerData.absUrl = settings.absUrl, this.element.trigger(pbcEvent, triggerData), !pbcEvent.isDefaultPrevented();
            },
            change: function(to, options) {
                if (isPageTransitioning) return void pageTransitionQueue.unshift(arguments);
                var settings = $17.extend({
                }, $17.mobile.changePage.defaults, options), triggerData = {
                };
                settings.fromPage = settings.fromPage || this.activePage, this._triggerPageBeforeChange(to, triggerData, settings) && (to = triggerData.toPage, "string" === $17.type(to) ? (isPageTransitioning = !0, this._loadUrl(to, triggerData, settings)) : this.transition(to, triggerData, settings));
            },
            transition: function(toPage, triggerData, settings) {
                var fromPage, url, pageUrl, active, activeIsInitialPage, historyDir, pageTitle, isDialog, alreadyThere, newPageTitle, params, cssTransitionDeferred, beforeTransition;
                if (isPageTransitioning) return void pageTransitionQueue.unshift([
                    toPage,
                    settings
                ]);
                if (this._triggerPageBeforeChange(toPage, triggerData, settings) && !((beforeTransition = this._triggerWithDeprecated("beforetransition", triggerData)).deprecatedEvent.isDefaultPrevented() || beforeTransition.event.isDefaultPrevented())) {
                    if (isPageTransitioning = !0, toPage[0] !== $17.mobile.firstPage[0] || settings.dataUrl || (settings.dataUrl = $17.mobile.path.documentUrl.hrefNoHash), fromPage = settings.fromPage, pageUrl = url = settings.dataUrl && $17.mobile.path.convertUrlToDataUrl(settings.dataUrl) || toPage.jqmData("url"), $17.mobile.path.getFilePath(url), active = $17.mobile.navigate.history.getActive(), activeIsInitialPage = 0 === $17.mobile.navigate.history.activeIndex, historyDir = 0, pageTitle = document.title, isDialog = ("dialog" === settings.role || "dialog" === toPage.jqmData("role")) && !0 !== toPage.jqmData("dialog"), fromPage && fromPage[0] === toPage[0] && !settings.allowSamePageTransition) return isPageTransitioning = !1, this._triggerWithDeprecated("transition", triggerData), this.element.trigger("pagechange", triggerData), void (settings.fromHashChange && $17.mobile.navigate.history.direct({
                        url: url
                    }));
                    toPage.page({
                        role: settings.role
                    }), settings.fromHashChange && (historyDir = "back" === settings.direction ? -1 : 1);
                    try {
                        document.activeElement && "body" !== document.activeElement.nodeName.toLowerCase() ? $17(document.activeElement).blur() : $17("input:focus, textarea:focus, select:focus").blur();
                    } catch (e) {
                    }
                    alreadyThere = !1, isDialog && active && (active.url && active.url.indexOf($17.mobile.dialogHashKey) > -1 && this.activePage && !this.activePage.hasClass("ui-dialog") && $17.mobile.navigate.history.activeIndex > 0 && (settings.changeHash = !1, alreadyThere = !0), url = active.url || "", !alreadyThere && url.indexOf("#") > -1 ? url += $17.mobile.dialogHashKey : url += "#" + $17.mobile.dialogHashKey, 0 === $17.mobile.navigate.history.activeIndex && url === $17.mobile.navigate.history.initialDst && (url += $17.mobile.dialogHashKey)), (newPageTitle = active ? toPage.jqmData("title") || toPage.children(":jqmData(role='header')").find(".ui-title").text() : pageTitle) && pageTitle === document.title && (pageTitle = newPageTitle), toPage.jqmData("title") || toPage.jqmData("title", pageTitle), settings.transition = settings.transition || (historyDir && !activeIsInitialPage ? active.transition : undefined) || (isDialog ? $17.mobile.defaultDialogTransition : $17.mobile.defaultPageTransition), !historyDir && alreadyThere && ($17.mobile.navigate.history.getActive().pageUrl = pageUrl), url && !settings.fromHashChange && (!$17.mobile.path.isPath(url) && 0 > url.indexOf("#") && (url = "#" + url), params = {
                        transition: settings.transition,
                        title: pageTitle,
                        pageUrl: pageUrl,
                        role: settings.role
                    }, !1 !== settings.changeHash && $17.mobile.hashListeningEnabled ? $17.mobile.navigate(url, params, !0) : toPage[0] !== $17.mobile.firstPage[0] && $17.mobile.navigate.history.add(url, params)), document.title = pageTitle, $17.mobile.activePage = toPage, this.activePage = toPage, settings.reverse = settings.reverse || historyDir < 0, cssTransitionDeferred = $17.Deferred(), this._cssTransition(toPage, fromPage, {
                        transition: settings.transition,
                        reverse: settings.reverse,
                        deferred: cssTransitionDeferred
                    }), cssTransitionDeferred.done($17.proxy(function(name, reverse, $to, $from, alreadyFocused) {
                        $17.mobile.removeActiveLinkClass(), settings.duplicateCachedPage && settings.duplicateCachedPage.remove(), alreadyFocused || $17.mobile.focusPage(toPage), this._releaseTransitionLock(), this.element.trigger("pagechange", triggerData), this._triggerWithDeprecated("transition", triggerData);
                    }, this));
                }
            },
            _findBaseWithDefault: function() {
                return this.activePage && $17.mobile.getClosestBaseUrl(this.activePage) || $17.mobile.path.documentBase.hrefNoHash;
            }
        }), $17.mobile.navreadyDeferred = $17.Deferred();
        var pageTransitionQueue = [], isPageTransitioning = !1;
    })(jQuery), (function($17, undefined) {
        var domreadyDeferred = $17.Deferred(), loadDeferred = $17.Deferred(), documentUrl = $17.mobile.path.documentUrl, $lastVClicked = null;
        function findClosestLink(ele) {
            for(; ele;){
                if ("string" == typeof ele.nodeName && "a" === ele.nodeName.toLowerCase()) break;
                ele = ele.parentNode;
            }
            return ele;
        }
        $17.mobile.loadPage = function(url, opts) {
            var container;
            return container = (opts = opts || {
            }).pageContainer || $17.mobile.pageContainer, opts.deferred = $17.Deferred(), container.pagecontainer("load", url, opts), opts.deferred.promise();
        }, $17.mobile.back = function() {
            var nav = window.navigator;
            this.phonegapNavigationEnabled && nav && nav.app && nav.app.backHistory ? nav.app.backHistory() : $17.mobile.pageContainer.pagecontainer("back");
        }, $17.mobile.focusPage = function(page) {
            var autofocus = page.find("[autofocus]"), pageTitle = page.find(".ui-title:eq(0)");
            if (autofocus.length) return void autofocus.focus();
            pageTitle.length ? pageTitle.focus() : page.focus();
        }, $17.mobile._maybeDegradeTransition = $17.mobile._maybeDegradeTransition || function(transition) {
            return transition;
        }, $17.mobile.changePage = function(to, options) {
            $17.mobile.pageContainer.pagecontainer("change", to, options);
        }, $17.mobile.changePage.defaults = {
            transition: undefined,
            reverse: !1,
            changeHash: !0,
            fromHashChange: !1,
            role: undefined,
            duplicateCachedPage: undefined,
            pageContainer: undefined,
            showLoadMsg: !0,
            dataUrl: undefined,
            fromPage: undefined,
            allowSamePageTransition: !1
        }, $17.mobile._registerInternalEvents = function() {
            var getAjaxFormData = function($form, calculateOnly) {
                var url, formData, vclickedName, method, ret = !0;
                return !(!$17.mobile.ajaxEnabled || $form.is(":jqmData(ajax='false')") || !$form.jqmHijackable().length || $form.attr("target")) && (url = $lastVClicked && $lastVClicked.attr("formaction") || $form.attr("action"), method = ($form.attr("method") || "get").toLowerCase(), url || (url = $17.mobile.getClosestBaseUrl($form), "get" === method && (url = $17.mobile.path.parseUrl(url).hrefNoSearch), url === $17.mobile.path.documentBase.hrefNoHash && (url = documentUrl.hrefNoSearch)), url = $17.mobile.path.makeUrlAbsolute(url, $17.mobile.getClosestBaseUrl($form)), (!$17.mobile.path.isExternal(url) || !!$17.mobile.path.isPermittedCrossDomainRequest(documentUrl, url)) && (calculateOnly || (formData = $form.serializeArray(), $lastVClicked && $lastVClicked[0].form === $form[0] && (vclickedName = $lastVClicked.attr("name")) && ($17.each(formData, function(key, value) {
                    if (value.name === vclickedName) return vclickedName = "", !1;
                }), vclickedName && formData.push({
                    name: vclickedName,
                    value: $lastVClicked.attr("value")
                })), ret = {
                    url: url,
                    options: {
                        type: method,
                        data: $17.param(formData),
                        transition: $form.jqmData("transition"),
                        reverse: "reverse" === $form.jqmData("direction"),
                        reloadPage: !0
                    }
                }), ret));
            };
            $17.mobile.document.delegate("form", "submit", function(event) {
                var formData;
                !event.isDefaultPrevented() && (formData = getAjaxFormData($17(this))) && ($17.mobile.changePage(formData.url, formData.options), event.preventDefault());
            }), $17.mobile.document.bind("vclick", function(event) {
                var $btn, btnEls, target = event.target, needClosest = !1;
                if (!(event.which > 1) && $17.mobile.linkBindingEnabled) {
                    if ($lastVClicked = $17(target), $17.data(target, "mobile-button")) !!getAjaxFormData($17(target).closest("form"), !0) && target.parentNode && (target = target.parentNode);
                    else {
                        if (!((target = findClosestLink(target)) && "#" !== $17.mobile.path.parseUrl(target.getAttribute("href") || "#").hash)) return;
                        if (!$17(target).jqmHijackable().length) return;
                    }
                    ~target.className.indexOf("ui-link-inherit") ? target.parentNode && (btnEls = $17.data(target.parentNode, "buttonElements")) : btnEls = $17.data(target, "buttonElements"), btnEls ? target = btnEls.outer : needClosest = !0, $btn = $17(target), needClosest && ($btn = $btn.closest(".ui-btn")), $btn.length > 0 && !$btn.hasClass("ui-state-disabled") && ($17.mobile.removeActiveLinkClass(!0), $17.mobile.activeClickedLink = $btn, $17.mobile.activeClickedLink.addClass($17.mobile.activeBtnClass));
                }
            }), $17.mobile.document.bind("click", function(event) {
                if (!(!$17.mobile.linkBindingEnabled || event.isDefaultPrevented())) {
                    var baseUrl, href, transition, reverse, role, link = findClosestLink(event.target), $link = $17(link), httpCleanup = function() {
                        window.setTimeout(function() {
                            $17.mobile.removeActiveLinkClass(!0);
                        }, 200);
                    };
                    if ($17.mobile.activeClickedLink && $17.mobile.activeClickedLink[0] === event.target.parentNode && httpCleanup(), link && !(event.which > 1) && $link.jqmHijackable().length) {
                        if ($link.is(":jqmData(rel='back')")) return $17.mobile.back(), !1;
                        if (baseUrl = $17.mobile.getClosestBaseUrl($link), href = $17.mobile.path.makeUrlAbsolute($link.attr("href") || "#", baseUrl), !$17.mobile.ajaxEnabled && !$17.mobile.path.isEmbeddedPage(href)) return void httpCleanup();
                        if (-1 !== href.search("#")) {
                            if (!(href = href.replace(/[^#]*#/, ""))) return void event.preventDefault();
                            href = $17.mobile.path.isPath(href) ? $17.mobile.path.makeUrlAbsolute(href, baseUrl) : $17.mobile.path.makeUrlAbsolute("#" + href, documentUrl.hrefNoHash);
                        }
                        if ($link.is("[rel='external']") || $link.is(":jqmData(ajax='false')") || $link.is("[target]") || $17.mobile.path.isExternal(href) && !$17.mobile.path.isPermittedCrossDomainRequest(documentUrl, href)) return void httpCleanup();
                        transition = $link.jqmData("transition"), reverse = "reverse" === $link.jqmData("direction") || $link.jqmData("back"), role = $link.attr("data-" + $17.mobile.ns + "rel") || undefined, $17.mobile.changePage(href, {
                            transition: transition,
                            reverse: reverse,
                            role: role,
                            link: $link
                        }), event.preventDefault();
                    }
                }
            }), $17.mobile.document.delegate(".ui-page", "pageshow.prefetch", function() {
                var urls = [];
                $17(this).find("a:jqmData(prefetch)").each(function() {
                    var $link = $17(this), url = $link.attr("href");
                    url && -1 === $17.inArray(url, urls) && (urls.push(url), $17.mobile.loadPage(url, {
                        role: $link.attr("data-" + $17.mobile.ns + "rel"),
                        prefetch: !0
                    }));
                });
            }), $17.mobile.pageContainer.pagecontainer(), $17.mobile.document.bind("pageshow", function() {
                loadDeferred ? loadDeferred.done($17.mobile.resetActivePageHeight) : $17.mobile.resetActivePageHeight();
            }), $17.mobile.window.bind("throttledresize", $17.mobile.resetActivePageHeight);
        }, $17(function() {
            domreadyDeferred.resolve();
        }), $17.mobile.window.load(function() {
            loadDeferred.resolve(), loadDeferred = null;
        }), $17.when(domreadyDeferred, $17.mobile.navreadyDeferred).done(function() {
            $17.mobile._registerInternalEvents();
        });
    })(jQuery), (function($17, window, undefined) {
        $17.mobile.Transition = function() {
            this.init.apply(this, arguments);
        }, $17.extend($17.mobile.Transition.prototype, {
            toPreClass: " ui-page-pre-in",
            init: function(name, reverse, $to, $from) {
                $17.extend(this, {
                    name: name,
                    reverse: reverse,
                    $to: $to,
                    $from: $from,
                    deferred: new $17.Deferred()
                });
            },
            cleanFrom: function() {
                this.$from.removeClass($17.mobile.activePageClass + " out in reverse " + this.name).height("");
            },
            beforeDoneIn: function() {
            },
            beforeDoneOut: function() {
            },
            beforeStartOut: function() {
            },
            doneIn: function() {
                this.beforeDoneIn(), this.$to.removeClass("out in reverse " + this.name).height(""), this.toggleViewportClass(), $17.mobile.window.scrollTop() !== this.toScroll && this.scrollPage(), this.sequential || this.$to.addClass($17.mobile.activePageClass), this.deferred.resolve(this.name, this.reverse, this.$to, this.$from, !0);
            },
            doneOut: function(screenHeight, reverseClass, none, preventFocus) {
                this.beforeDoneOut(), this.startIn(screenHeight, reverseClass, none, preventFocus);
            },
            hideIn: function(callback) {
                this.$to.css("z-index", -10), callback.call(this), this.$to.css("z-index", "");
            },
            scrollPage: function() {
                $17.event.special.scrollstart.enabled = !1, ($17.mobile.hideUrlBar || this.toScroll !== $17.mobile.defaultHomeScroll) && window.scrollTo(0, this.toScroll), setTimeout(function() {
                    $17.event.special.scrollstart.enabled = !0;
                }, 150);
            },
            startIn: function(screenHeight, reverseClass, none, preventFocus) {
                this.hideIn(function() {
                    this.$to.addClass($17.mobile.activePageClass + this.toPreClass), preventFocus || $17.mobile.focusPage(this.$to), this.$to.height(screenHeight + this.toScroll), none || this.scrollPage();
                }), this.$to.removeClass(this.toPreClass).addClass(this.name + " in " + reverseClass), none ? this.doneIn() : this.$to.animationComplete($17.proxy(function() {
                    this.doneIn();
                }, this));
            },
            startOut: function(screenHeight, reverseClass, none) {
                this.beforeStartOut(screenHeight, reverseClass, none), this.$from.height(screenHeight + $17.mobile.window.scrollTop()).addClass(this.name + " out" + reverseClass);
            },
            toggleViewportClass: function() {
                $17.mobile.pageContainer.toggleClass("ui-mobile-viewport-transitioning viewport-" + this.name);
            },
            transition: function() {
                var none, reverseClass = this.reverse ? " reverse" : "", screenHeight = $17.mobile.getScreenHeight(), maxTransitionOverride = !1 !== $17.mobile.maxTransitionWidth && $17.mobile.window.width() > $17.mobile.maxTransitionWidth;
                return this.toScroll = $17.mobile.navigate.history.getActive().lastScroll || $17.mobile.defaultHomeScroll, none = !$17.support.cssTransitions || !$17.support.cssAnimations || maxTransitionOverride || !this.name || "none" === this.name || Math.max($17.mobile.window.scrollTop(), this.toScroll) > $17.mobile.getMaxScrollForTransition(), this.toggleViewportClass(), this.$from && !none ? this.startOut(screenHeight, reverseClass, none) : this.doneOut(screenHeight, reverseClass, none, !0), this.deferred.promise();
            }
        });
    })(jQuery, this), (function($17) {
        $17.mobile.SerialTransition = function() {
            this.init.apply(this, arguments);
        }, $17.extend($17.mobile.SerialTransition.prototype, $17.mobile.Transition.prototype, {
            sequential: !0,
            beforeDoneOut: function() {
                this.$from && this.cleanFrom();
            },
            beforeStartOut: function(screenHeight, reverseClass, none) {
                this.$from.animationComplete($17.proxy(function() {
                    this.doneOut(screenHeight, reverseClass, none);
                }, this));
            }
        });
    })(jQuery), (function($17) {
        $17.mobile.ConcurrentTransition = function() {
            this.init.apply(this, arguments);
        }, $17.extend($17.mobile.ConcurrentTransition.prototype, $17.mobile.Transition.prototype, {
            sequential: !1,
            beforeDoneIn: function() {
                this.$from && this.cleanFrom();
            },
            beforeStartOut: function(screenHeight, reverseClass, none) {
                this.doneOut(screenHeight, reverseClass, none);
            }
        });
    })(jQuery), ($8 = jQuery).mobile.transitionHandlers = {
        sequential: $8.mobile.SerialTransition,
        simultaneous: $8.mobile.ConcurrentTransition
    }, $8.mobile.defaultTransitionHandler = $8.mobile.transitionHandlers.sequential, $8.mobile.transitionFallbacks = {
    }, $8.mobile._maybeDegradeTransition = function(transition) {
        return transition && !$8.support.cssTransform3d && $8.mobile.transitionFallbacks[transition] && (transition = $8.mobile.transitionFallbacks[transition]), transition;
    }, $8.mobile.getMaxScrollForTransition = $8.mobile.getMaxScrollForTransition || function() {
        return 3 * $8.mobile.getScreenHeight();
    }, jQuery.mobile.transitionFallbacks.flip = "fade", jQuery.mobile.transitionFallbacks.flow = "fade", jQuery.mobile.transitionFallbacks.pop = "fade", ($9 = jQuery).mobile.transitionHandlers.slide = $9.mobile.transitionHandlers.simultaneous, $9.mobile.transitionFallbacks.slide = "fade", jQuery.mobile.transitionFallbacks.slidedown = "fade", jQuery.mobile.transitionFallbacks.slidefade = "fade", jQuery.mobile.transitionFallbacks.slideup = "fade", jQuery.mobile.transitionFallbacks.turn = "fade", ($10 = jQuery).mobile.degradeInputs = {
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
    }, $10.mobile.page.prototype.options.degradeInputs = $10.mobile.degradeInputs, $10.mobile.degradeInputsWithin = function(target) {
        (target = $10(target)).find("input").not($10.mobile.page.prototype.keepNativeSelector()).each(function() {
            var html, hasType, findstr, repstr, element = $10(this), type = this.getAttribute("type"), optType = $10.mobile.degradeInputs[type] || "text";
            $10.mobile.degradeInputs[type] && (findstr = (hasType = (html = $10("<div>").html(element.clone()).html()).indexOf(" type=") > -1) ? /\s+type=["']?\w+['"]?/ : /\/?>/, repstr = " type=\"" + optType + "\" data-" + $10.mobile.ns + "type=\"" + type + "\"" + (hasType ? "" : ">"), element.replaceWith(html.replace(findstr, repstr)));
        });
    }, (function($17, window, undefined) {
        $17.widget("mobile.page", $17.mobile.page, {
            options: {
                closeBtn: "left",
                closeBtnText: "Close",
                overlayTheme: "a",
                corners: !0,
                dialog: !1
            },
            _create: function() {
                this._super(), this.options.dialog && ($17.extend(this, {
                    _inner: this.element.children(),
                    _headerCloseButton: null
                }), this.options.enhanced || this._setCloseBtn(this.options.closeBtn));
            },
            _enhance: function() {
                this._super(), this.options.dialog && this.element.addClass("ui-dialog").wrapInner($17("<div/>", {
                    role: "dialog",
                    "class": "ui-dialog-contain ui-overlay-shadow" + (this.options.corners ? " ui-corner-all" : "")
                }));
            },
            _setOptions: function(options) {
                var closeButtonLocation, closeButtonText, currentOpts = this.options;
                undefined !== options.corners && this._inner.toggleClass("ui-corner-all", !!options.corners), undefined !== options.overlayTheme && $17.mobile.activePage[0] === this.element[0] && (currentOpts.overlayTheme = options.overlayTheme, this._handlePageBeforeShow()), undefined !== options.closeBtnText && (closeButtonLocation = currentOpts.closeBtn, closeButtonText = options.closeBtnText), undefined !== options.closeBtn && (closeButtonLocation = options.closeBtn), closeButtonLocation && this._setCloseBtn(closeButtonLocation, closeButtonText), this._super(options);
            },
            _handlePageBeforeShow: function() {
                this.options.overlayTheme && this.options.dialog ? (this.removeContainerBackground(), this.setContainerBackground(this.options.overlayTheme)) : this._super();
            },
            _setCloseBtn: function(location, text) {
                var dst, btn = this._headerCloseButton;
                "none" == (location = "left" === location ? "left" : "right" === location ? "right" : "none") ? btn && (btn.remove(), btn = null) : btn ? (btn.removeClass("ui-btn-left ui-btn-right").addClass("ui-btn-" + location), text && btn.text(text)) : (dst = this._inner.find(":jqmData(role='header')").first(), btn = $17("<a></a>", {
                    href: "#",
                    "class": "ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-" + location
                }).attr("data-" + $17.mobile.ns + "rel", "back").text(text || this.options.closeBtnText || "").prependTo(dst)), this._headerCloseButton = btn;
            }
        });
    })(jQuery, this), (function($17, window, undefined) {
        $17.widget("mobile.dialog", {
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
            _handleVClickSubmit: function(event) {
                var attrs, $target = $17(event.target).closest("vclick" === event.type ? "a" : "form");
                $target.length && !$target.jqmData("transition") && ((attrs = {
                })["data-" + $17.mobile.ns + "transition"] = ($17.mobile.navigate.history.getActive() || {
                }).transition || $17.mobile.defaultDialogTransition, attrs["data-" + $17.mobile.ns + "direction"] = "reverse", $target.attr(attrs));
            },
            _create: function() {
                var elem = this.element, opts = this.options;
                elem.addClass("ui-dialog").wrapInner($17("<div/>", {
                    role: "dialog",
                    "class": "ui-dialog-contain ui-overlay-shadow" + (opts.corners ? " ui-corner-all" : "")
                })), $17.extend(this, {
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
                undefined !== options.corners && this._inner.toggleClass("ui-corner-all", !!options.corners), undefined !== options.overlayTheme && $17.mobile.activePage[0] === this.element[0] && (currentOpts.overlayTheme = options.overlayTheme, this._handlePageBeforeShow()), undefined !== options.closeBtnText && (closeButtonLocation = currentOpts.closeBtn, closeButtonText = options.closeBtnText), undefined !== options.closeBtn && (closeButtonLocation = options.closeBtn), closeButtonLocation && this._setCloseBtn(closeButtonLocation, closeButtonText), this._super(options);
            },
            _setCloseBtn: function(location, text) {
                var dst, btn = this._headerCloseButton;
                "none" == (location = "left" === location ? "left" : "right" === location ? "right" : "none") ? btn && (btn.remove(), btn = null) : btn ? (btn.removeClass("ui-btn-left ui-btn-right").addClass("ui-btn-" + location), text && btn.text(text)) : (dst = this._inner.find(":jqmData(role='header')").first(), btn = $17("<a></a>", {
                    role: "button",
                    href: "#",
                    "class": "ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-" + location
                }).text(text || this.options.closeBtnText || "").prependTo(dst), this._on(btn, {
                    click: "close"
                })), this._headerCloseButton = btn;
            },
            close: function() {
                this._isCloseable && (this._isCloseable = !1, $17.mobile.hashListeningEnabled && $17.mobile.navigate.history.activeIndex > 0 ? $17.mobile.back() : $17.mobile.pageContainer.pagecontainer("back"));
            }
        });
    })(jQuery, this), $11 = jQuery, rInitialLetter = /([A-Z])/g, iconposClass = function(iconpos) {
        return "ui-btn-icon-" + (null === iconpos ? "left" : iconpos);
    }, $11.widget("mobile.collapsible", {
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
                accordion: elem.closest(":jqmData(role='collapsible-set'),:jqmData(role='collapsibleset')" + ($11.mobile.collapsibleset ? ", :mobile-collapsibleset" : "")).addClass("ui-collapsible-set")
            };
            this._ui = ui, this._renderedOptions = this._getOptions(this.options), this.options.enhanced ? (ui.heading = $11(".ui-collapsible-heading", this.element[0]), ui.content = ui.heading.next(), ui.anchor = $11("a", ui.heading[0]).first(), ui.status = ui.anchor.children(".ui-collapsible-heading-status")) : this._enhance(elem, ui), this._on(ui.heading, {
                tap: function() {
                    ui.heading.find("a").first().addClass($11.mobile.activeBtnClass);
                },
                click: function(event) {
                    this._handleExpandCollapse(!ui.heading.hasClass("ui-collapsible-heading-collapsed")), event.preventDefault(), event.stopPropagation();
                }
            });
        },
        _getOptions: function(options) {
            var key, accordion = this._ui.accordion, accordionWidget = this._ui.accordionWidget;
            for(key in options = $11.extend({
            }, options), accordion.length && !accordionWidget && (this._ui.accordionWidget = accordionWidget = accordion.data("mobile-collapsibleset")), options)options[key] = null != options[key] ? options[key] : accordionWidget ? accordionWidget.options[key] : accordion.length ? $11.mobile.getAttribute(accordion[0], key.replace(rInitialLetter, "-$1").toLowerCase()) : null, null == options[key] && (options[key] = $11.mobile.collapsible.defaults[key]);
            return options;
        },
        _themeClassFromOption: function(prefix, value) {
            return value ? "none" === value ? "" : prefix + value : "";
        },
        _enhance: function(elem, ui) {
            var iconclass, opts = this._renderedOptions, contentThemeClass = this._themeClassFromOption("ui-body-", opts.contentTheme);
            return elem.addClass("ui-collapsible " + (opts.inset ? "ui-collapsible-inset " : "") + (opts.inset && opts.corners ? "ui-corner-all " : "") + (contentThemeClass ? "ui-collapsible-themed-content " : "")), ui.originalHeading = elem.children(this.options.heading).first(), ui.content = elem.wrapInner("<div class='ui-collapsible-content " + contentThemeClass + "'></div>").children(".ui-collapsible-content"), ui.heading = ui.originalHeading, ui.heading.is("legend") && (ui.heading = $11("<div role='heading'>" + ui.heading.html() + "</div>"), ui.placeholder = $11("<div><!-- placeholder for legend --></div>").insertBefore(ui.originalHeading), ui.originalHeading.remove()), iconclass = opts.collapsed ? opts.collapsedIcon ? "ui-icon-" + opts.collapsedIcon : "" : opts.expandedIcon ? "ui-icon-" + opts.expandedIcon : "", ui.status = $11("<span class='ui-collapsible-heading-status'></span>"), ui.anchor = ui.heading.detach().addClass("ui-collapsible-heading").append(ui.status).wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a").first().addClass("ui-btn " + (iconclass ? iconclass + " " : "") + (iconclass ? iconposClass(opts.iconpos) + " " : "") + this._themeClassFromOption("ui-btn-", opts.theme) + " " + (opts.mini ? "ui-mini " : "")), ui.heading.insertBefore(ui.content), this._handleExpandCollapse(this.options.collapsed), ui;
        },
        refresh: function() {
            this._applyOptions(this.options), this._renderedOptions = this._getOptions(this.options);
        },
        _applyOptions: function(options) {
            var isCollapsed, newTheme, oldTheme, hasCorners, hasIcon, elem = this.element, currentOpts = this._renderedOptions, ui = this._ui, anchor = ui.anchor, status = ui.status, opts = this._getOptions(options);
            undefined !== options.collapsed && this._handleExpandCollapse(options.collapsed), (isCollapsed = elem.hasClass("ui-collapsible-collapsed")) ? undefined !== opts.expandCueText && status.text(opts.expandCueText) : undefined !== opts.collapseCueText && status.text(opts.collapseCueText), hasIcon = undefined !== opts.collapsedIcon ? !1 !== opts.collapsedIcon : !1 !== currentOpts.collapsedIcon, !(undefined === opts.iconpos && undefined === opts.collapsedIcon && undefined === opts.expandedIcon) && (anchor.removeClass([
                iconposClass(currentOpts.iconpos)
            ].concat(currentOpts.expandedIcon ? [
                "ui-icon-" + currentOpts.expandedIcon
            ] : []).concat(currentOpts.collapsedIcon ? [
                "ui-icon-" + currentOpts.collapsedIcon
            ] : []).join(" ")), hasIcon && anchor.addClass([
                iconposClass(undefined !== opts.iconpos ? opts.iconpos : currentOpts.iconpos)
            ].concat(isCollapsed ? [
                "ui-icon-" + (undefined !== opts.collapsedIcon ? opts.collapsedIcon : currentOpts.collapsedIcon)
            ] : [
                "ui-icon-" + (undefined !== opts.expandedIcon ? opts.expandedIcon : currentOpts.expandedIcon)
            ]).join(" "))), undefined !== opts.theme && (oldTheme = this._themeClassFromOption("ui-btn-", currentOpts.theme), newTheme = this._themeClassFromOption("ui-btn-", opts.theme), anchor.removeClass(oldTheme).addClass(newTheme)), undefined !== opts.contentTheme && (oldTheme = this._themeClassFromOption("ui-body-", currentOpts.contentTheme), newTheme = this._themeClassFromOption("ui-body-", opts.contentTheme), ui.content.removeClass(oldTheme).addClass(newTheme)), undefined !== opts.inset && (elem.toggleClass("ui-collapsible-inset", opts.inset), hasCorners = !!(opts.inset && (opts.corners || currentOpts.corners))), undefined !== opts.corners && (hasCorners = !!(opts.corners && (opts.inset || currentOpts.inset))), hasCorners !== undefined && elem.toggleClass("ui-corner-all", hasCorners), undefined !== opts.mini && anchor.toggleClass("ui-mini", opts.mini);
        },
        _setOptions: function(options) {
            this._applyOptions(options), this._super(options), this._renderedOptions = this._getOptions(this.options);
        },
        _handleExpandCollapse: function(isCollapse) {
            var opts = this._renderedOptions, ui = this._ui;
            ui.status.text(isCollapse ? opts.expandCueText : opts.collapseCueText), ui.heading.toggleClass("ui-collapsible-heading-collapsed", isCollapse).find("a").first().toggleClass("ui-icon-" + opts.expandedIcon, !isCollapse).toggleClass("ui-icon-" + opts.collapsedIcon, isCollapse || opts.expandedIcon === opts.collapsedIcon).removeClass($11.mobile.activeBtnClass), this.element.toggleClass("ui-collapsible-collapsed", isCollapse), ui.content.toggleClass("ui-collapsible-content-collapsed", isCollapse).attr("aria-hidden", isCollapse).trigger("updatelayout"), this.options.collapsed = isCollapse, this._trigger(isCollapse ? "collapse" : "expand");
        },
        expand: function() {
            this._handleExpandCollapse(!1);
        },
        collapse: function() {
            this._handleExpandCollapse(!0);
        },
        _destroy: function() {
            var ui = this._ui;
            this.options.enhanced || (ui.placeholder ? (ui.originalHeading.insertBefore(ui.placeholder), ui.placeholder.remove(), ui.heading.remove()) : (ui.status.remove(), ui.heading.removeClass("ui-collapsible-heading ui-collapsible-heading-collapsed").children().contents().unwrap()), ui.anchor.contents().unwrap(), ui.content.contents().unwrap(), this.element.removeClass("ui-collapsible ui-collapsible-collapsed ui-collapsible-themed-content ui-collapsible-inset ui-corner-all"));
        }
    }), $11.mobile.collapsible.defaults = {
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
    }, (function($17, undefined) {
        var childCollapsiblesSelector = ":mobile-collapsible, " + $17.mobile.collapsible.initSelector;
        $17.widget("mobile.collapsibleset", $17.extend({
            initSelector: ":jqmData(role='collapsible-set'),:jqmData(role='collapsibleset')",
            options: $17.extend({
                enhanced: !1
            }, $17.mobile.collapsible.defaults),
            _handleCollapsibleExpand: function(event) {
                var closestCollapsible = $17(event.target).closest(".ui-collapsible");
                closestCollapsible.parent().is(":mobile-collapsibleset, :jqmData(role='collapsible-set')") && closestCollapsible.siblings(".ui-collapsible:not(.ui-collapsible-collapsed)").collapsible("collapse");
            },
            _create: function() {
                var elem = this.element, opts = this.options;
                $17.extend(this, {
                    _classes: ""
                }), opts.enhanced || (elem.addClass("ui-collapsible-set " + this._themeClassFromOption("ui-group-theme-", opts.theme) + " " + (opts.corners && opts.inset ? "ui-corner-all " : "")), this.element.find($17.mobile.collapsible.initSelector).collapsible()), this._on(elem, {
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
                return themeClass && elem.removeClass(this._themeClassFromOption("ui-group-theme-", this.options.theme)).addClass(themeClass), undefined !== options.inset && (hasCorners = !!(options.inset && (options.corners || this.options.corners))), undefined !== options.corners && (hasCorners = !!(options.corners && (options.inset || this.options.inset))), hasCorners !== undefined && elem.toggleClass("ui-corner-all", hasCorners), ret = this._super(options), this.element.children(":mobile-collapsible").collapsible("refresh"), ret;
            },
            _destroy: function() {
                var el = this.element;
                this._removeFirstLastClasses(el.children(childCollapsiblesSelector)), el.removeClass("ui-collapsible-set ui-corner-all " + this._themeClassFromOption("ui-group-theme-", this.options.theme)).children(":mobile-collapsible").collapsible("destroy");
            },
            _refresh: function(create) {
                var collapsiblesInSet = this.element.children(childCollapsiblesSelector);
                this.element.find($17.mobile.collapsible.initSelector).not(".ui-collapsible").collapsible(), this._addFirstLastClasses(collapsiblesInSet, this._getVisibles(collapsiblesInSet, create), create);
            },
            refresh: function() {
                this._refresh(!1);
            }
        }, $17.mobile.behaviors.addFirstLastClasses));
    })(jQuery), jQuery.fn.fieldcontain = function() {
        return this.addClass("ui-field-contain");
    }, ($12 = jQuery).fn.grid = function(options) {
        return this.each(function() {
            var iterator, letter, $this = $12(this), o = $12.extend({
                grid: null
            }, options), $kids = $this.children(), gridCols = {
                solo: 1,
                a: 2,
                b: 3,
                c: 4,
                d: 5
            }, grid = o.grid;
            if (!grid) if ($kids.length <= 5) for(letter in gridCols)gridCols[letter] === $kids.length && (grid = letter);
            else grid = "a", $this.addClass("ui-grid-duo");
            iterator = gridCols[grid], $this.addClass("ui-grid-" + grid), $kids.filter(":nth-child(" + iterator + "n+1)").addClass("ui-block-a"), iterator > 1 && $kids.filter(":nth-child(" + iterator + "n+2)").addClass("ui-block-b"), iterator > 2 && $kids.filter(":nth-child(" + iterator + "n+3)").addClass("ui-block-c"), iterator > 3 && $kids.filter(":nth-child(" + iterator + "n+4)").addClass("ui-block-d"), iterator > 4 && $kids.filter(":nth-child(" + iterator + "n+5)").addClass("ui-block-e");
        });
    }, (function($17, undefined) {
        $17.widget("mobile.navbar", {
            options: {
                iconpos: "top",
                grid: null
            },
            _create: function() {
                var $navbar = this.element, $navbtns = $navbar.find("a"), iconpos = $navbtns.filter(":jqmData(icon)").length ? this.options.iconpos : void 0;
                $navbar.addClass("ui-navbar").attr("role", "navigation").find("ul").jqmEnhanceable().grid({
                    grid: this.options.grid
                }), $navbtns.each(function() {
                    var icon = $17.mobile.getAttribute(this, "icon"), theme = $17.mobile.getAttribute(this, "theme"), classes = "ui-btn";
                    theme && (classes += " ui-btn-" + theme), icon && (classes += " ui-icon-" + icon + " ui-btn-icon-" + iconpos), $17(this).addClass(classes);
                }), $navbar.delegate("a", "vclick", function() {
                    var activeBtn = $17(this);
                    activeBtn.hasClass("ui-state-disabled") || activeBtn.hasClass("ui-disabled") || activeBtn.hasClass($17.mobile.activeBtnClass) || ($navbtns.removeClass($17.mobile.activeBtnClass), activeBtn.addClass($17.mobile.activeBtnClass), $17(document).one("pagehide", function() {
                        activeBtn.removeClass($17.mobile.activeBtnClass);
                    }));
                }), $navbar.closest(".ui-page").bind("pagebeforeshow", function() {
                    $navbtns.filter(".ui-state-persist").addClass($17.mobile.activeBtnClass);
                });
            }
        });
    })(jQuery), (function($17, undefined) {
        var getAttr = $17.mobile.getAttribute;
        $17.widget("mobile.listview", $17.extend({
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
                listviewClasses += this.options.inset ? " ui-listview-inset" : "", this.options.inset && (listviewClasses += this.options.corners ? " ui-corner-all" : "", listviewClasses += this.options.shadow ? " ui-shadow" : ""), this.element.addClass(" ui-listview" + listviewClasses), this.refresh(!0);
            },
            _findFirstElementByTagName: function(ele, nextProp, lcName, ucName) {
                var dict = {
                };
                for(dict[lcName] = dict[ucName] = !0; ele;){
                    if (dict[ele.nodeName]) return ele;
                    ele = ele[nextProp];
                }
                return null;
            },
            _addThumbClasses: function(containers) {
                var i, img, len = containers.length;
                for(i = 0; i < len; i++)(img = $17(this._findFirstElementByTagName(containers[i].firstChild, "nextSibling", "img", "IMG"))).length && $17(this._findFirstElementByTagName(img[0].parentNode, "parentNode", "li", "LI")).addClass(img.hasClass("ui-li-icon") ? "ui-li-has-icon" : "ui-li-has-thumb");
            },
            _getChildrenByTagName: function(ele, lcName, ucName) {
                var results = [], dict = {
                };
                for(dict[lcName] = dict[ucName] = !0, ele = ele.firstChild; ele;)dict[ele.nodeName] && results.push(ele), ele = ele.nextSibling;
                return $17(results);
            },
            _beforeListviewRefresh: $17.noop,
            _afterListviewRefresh: $17.noop,
            refresh: function(create) {
                var buttonClass, pos, numli, item, itemClass, itemTheme, itemIcon, icon, a, isDivider, startCount, newStartCount, value, last, splittheme, splitThemeClass, altButtonClass, li, o = this.options, $list = this.element, ol = !!$17.nodeName($list[0], "ol"), start = $list.attr("start"), itemClassDict = {
                }, countBubbles = $list.find(".ui-li-count"), countTheme = getAttr($list[0], "counttheme") || this.options.countTheme, countThemeClass = countTheme ? "ui-body-" + countTheme : "ui-body-inherit";
                for(o.theme && $list.addClass("ui-group-theme-" + o.theme), ol && (start || 0 === start) && (startCount = parseInt(start, 10) - 1, $list.css("counter-reset", "listnumbering " + startCount)), this._beforeListviewRefresh(), pos = 0, numli = (li = this._getChildrenByTagName($list[0], "li", "LI")).length; pos < numli; pos++)item = li.eq(pos), itemClass = "", (create || 0 > item[0].className.search(/\bui-li-static\b|\bui-li-divider\b/)) && (a = this._getChildrenByTagName(item[0], "a", "A"), isDivider = "list-divider" === getAttr(item[0], "role"), value = item.attr("value"), itemTheme = getAttr(item[0], "theme"), a.length && 0 > a[0].className.search(/\bui-btn\b/) && !isDivider ? (icon = !1 !== (itemIcon = getAttr(item[0], "icon")) && (itemIcon || o.icon), a.removeClass("ui-link"), buttonClass = "ui-btn", itemTheme && (buttonClass += " ui-btn-" + itemTheme), a.length > 1 ? (itemClass = "ui-li-has-alt", splitThemeClass = (splittheme = getAttr((last = a.last())[0], "theme") || o.splitTheme || getAttr(item[0], "theme", !0)) ? " ui-btn-" + splittheme : "", altButtonClass = "ui-btn ui-btn-icon-notext ui-icon-" + (getAttr(last[0], "icon") || getAttr(item[0], "icon") || o.splitIcon) + splitThemeClass, last.attr("title", $17.trim(last.getEncodedText())).addClass(altButtonClass).empty()) : icon && (buttonClass += " ui-btn-icon-right ui-icon-" + icon), a.first().addClass(buttonClass)) : isDivider ? (itemClass = "ui-li-divider ui-bar-" + (getAttr(item[0], "theme") || o.dividerTheme || o.theme || "inherit"), item.attr("role", "heading")) : a.length <= 0 && (itemClass = "ui-li-static ui-body-" + (itemTheme || "inherit")), ol && value && (newStartCount = parseInt(value, 10) - 1, item.css("counter-reset", "listnumbering " + newStartCount))), itemClassDict[itemClass] || (itemClassDict[itemClass] = []), itemClassDict[itemClass].push(item[0]);
                for(itemClass in itemClassDict)$17(itemClassDict[itemClass]).addClass(itemClass);
                countBubbles.each(function() {
                    $17(this).closest("li").addClass("ui-li-has-count");
                }), countThemeClass && countBubbles.addClass(countThemeClass), this._addThumbClasses(li), this._addThumbClasses(li.find(".ui-btn")), this._afterListviewRefresh(), this._addFirstLastClasses(li, this._getVisibles(li, create), create);
            }
        }, $17.mobile.behaviors.addFirstLastClasses));
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.listview", $17.mobile.listview, {
            options: {
                autodividers: !1,
                autodividersSelector: function(elt) {
                    var text = $17.trim(elt.text()) || null;
                    return text ? text = text.slice(0, 1).toUpperCase() : null;
                }
            },
            _beforeListviewRefresh: function() {
                this.options.autodividers && (this._replaceDividers(), this._superApply(arguments));
            },
            _replaceDividers: function() {
                var i, lis, li, dividerText, divider, lastDividerText = null, list = this.element;
                for(list.children("li:jqmData(role='list-divider')").remove(), lis = list.children("li"), i = 0; i < lis.length; i++)li = lis[i], (dividerText = this.options.autodividersSelector($17(li))) && lastDividerText !== dividerText && ((divider = document.createElement("li")).appendChild(document.createTextNode(dividerText)), divider.setAttribute("data-" + $17.mobile.ns + "role", "list-divider"), li.parentNode.insertBefore(divider, li)), lastDividerText = dividerText;
            }
        });
    })(jQuery), (function($17, undefined) {
        var rdivider = /(^|\s)ui-li-divider($|\s)/, rhidden = /(^|\s)ui-screen-hidden($|\s)/;
        $17.widget("mobile.listview", $17.mobile.listview, {
            options: {
                hideDividers: !1
            },
            _afterListviewRefresh: function() {
                var items, idx, item, hideDivider = !0;
                if (this._superApply(arguments), this.options.hideDividers) for(idx = (items = this._getChildrenByTagName(this.element[0], "li", "LI")).length - 1; idx > -1; idx--)(item = items[idx]).className.match(rdivider) ? (hideDivider && (item.className = item.className + " ui-screen-hidden"), hideDivider = !0) : item.className.match(rhidden) || (hideDivider = !1);
            }
        });
    })(jQuery), ($13 = jQuery).mobile.nojs = function(target) {
        $13(":jqmData(role='nojs')", target).addClass("ui-nojs");
    }, jQuery.mobile.behaviors.formReset = {
        _handleFormReset: function() {
            this._on(this.element.closest("form"), {
                reset: function() {
                    this._delay("_reset");
                }
            });
        }
    }, (function($17, undefined) {
        var escapeId = $17.mobile.path.hashToSelector;
        $17.widget("mobile.checkboxradio", $17.extend({
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
                ("checkbox" === inputtype || "radio" === inputtype) && (this.element[0].disabled && (this.options.disabled = !0), o.iconpos = inheritAttr(input, "iconpos") || label.attr("data-" + $17.mobile.ns + "iconpos") || o.iconpos, o.mini = inheritAttr(input, "mini") || o.mini, $17.extend(this, {
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
                return $17("<div class='" + (this.options.wrapperClass ? this.options.wrapperClass : "") + " ui-" + this.inputtype + (this.options.disabled ? " ui-state-disabled" : "") + "' ></div>");
            },
            _handleInputFocus: function() {
                this.label.addClass($17.mobile.focusClass);
            },
            _handleInputBlur: function() {
                this.label.removeClass($17.mobile.focusClass);
            },
            _handleInputVClick: function() {
                this.element.prop("checked", this.element.is(":checked")), this._getInputSet().not(this.element).prop("checked", !1), this._updateAll();
            },
            _handleLabelVMouseOver: function(event) {
                this.label.parent().hasClass("ui-state-disabled") && event.stopPropagation();
            },
            _handleLabelVClick: function(event) {
                var input = this.element;
                return input.is(":disabled") ? void event.preventDefault() : (this._cacheVals(), input.prop("checked", "radio" === this.inputtype || !input.prop("checked")), input.triggerHandler("click"), this._getInputSet().not(input).prop("checked", !1), this._updateAll(), !1);
            },
            _cacheVals: function() {
                this._getInputSet().each(function() {
                    $17(this).attr("data-" + $17.mobile.ns + "cacheVal", this.checked);
                });
            },
            _getInputSet: function() {
                var selector, formId, radio = this.element[0], name = radio.name, form = radio.form, doc = this.element.parents().last().get(0), radios = this.element;
                return name && "radio" === this.inputtype && doc && (selector = "input[type='radio'][name='" + escapeId(name) + "']", form ? ((formId = form.id) && (radios = $17(selector + "[form='" + escapeId(formId) + "']", doc)), radios = $17(form).find(selector).filter(function() {
                    return this.form === form;
                }).add(radios)) : radios = $17(selector, doc).filter(function() {
                    return !this.form;
                })), radios;
            },
            _updateAll: function() {
                var self = this;
                this._getInputSet().each(function() {
                    (this.checked || "checkbox" === self.inputtype) && $17(this).trigger("change");
                }).checkboxradio("refresh");
            },
            _reset: function() {
                this.refresh();
            },
            _hasIcon: function() {
                var controlgroup, controlgroupWidget, controlgroupConstructor = $17.mobile.controlgroup;
                return !controlgroupConstructor || !((controlgroup = this.element.closest(":mobile-controlgroup," + controlgroupConstructor.prototype.initSelector)).length > 0) || ((controlgroupWidget = $17.data(controlgroup[0], "mobile-controlgroup")) ? controlgroupWidget.options.type : controlgroup.attr("data-" + $17.mobile.ns + "type")) !== "horizontal";
            },
            refresh: function() {
                var hasIcon = this._hasIcon(), isChecked = this.element[0].checked, active = $17.mobile.activeBtnClass, iconposClass = "ui-btn-icon-" + this.options.iconpos, addClasses = [], removeClasses = [];
                hasIcon ? (removeClasses.push(active), addClasses.push(iconposClass)) : (removeClasses.push(iconposClass), (isChecked ? addClasses : removeClasses).push(active)), isChecked ? (addClasses.push(this.checkedClass), removeClasses.push(this.uncheckedClass)) : (addClasses.push(this.uncheckedClass), removeClasses.push(this.checkedClass)), this.label.addClass(addClasses.join(" ")).removeClass(removeClasses.join(" "));
            },
            widget: function() {
                return this.label.parent();
            },
            _setOptions: function(options) {
                var label = this.label, currentOptions = this.options, outer = this.widget(), hasIcon = this._hasIcon();
                undefined !== options.disabled && (this.input.prop("disabled", !!options.disabled), outer.toggleClass("ui-state-disabled", !!options.disabled)), undefined !== options.mini && outer.toggleClass("ui-mini", !!options.mini), undefined !== options.theme && label.removeClass("ui-btn-" + currentOptions.theme).addClass("ui-btn-" + options.theme), undefined !== options.wrapperClass && outer.removeClass(currentOptions.wrapperClass).addClass(options.wrapperClass), undefined !== options.iconpos && hasIcon ? label.removeClass("ui-btn-icon-" + currentOptions.iconpos).addClass("ui-btn-icon-" + options.iconpos) : hasIcon || label.removeClass("ui-btn-icon-" + currentOptions.iconpos), this._super(options);
            }
        }, $17.mobile.behaviors.formReset));
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.button", {
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
                this.element.is(":disabled") && (this.options.disabled = !0), this.options.enhanced || this._enhance(), $17.extend(this, {
                    wrapper: this.element.parent()
                }), this._on({
                    focus: function() {
                        this.widget().addClass($17.mobile.focusClass);
                    },
                    blur: function() {
                        this.widget().removeClass($17.mobile.focusClass);
                    }
                }), this.refresh(!0);
            },
            _enhance: function() {
                this.element.wrap(this._button());
            },
            _button: function() {
                var options = this.options, iconClasses = this._getIconClasses(this.options);
                return $17("<div class='ui-btn ui-input-btn" + (options.wrapperClass ? " " + options.wrapperClass : "") + (options.theme ? " ui-btn-" + options.theme : "") + (options.corners ? " ui-corner-all" : "") + (options.shadow ? " ui-shadow" : "") + (options.inline ? " ui-btn-inline" : "") + (options.mini ? " ui-mini" : "") + (options.disabled ? " ui-state-disabled" : "") + (iconClasses ? " " + iconClasses : "") + "' >" + this.element.val() + "</div>");
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
                undefined !== options.theme && outer.removeClass(this.options.theme).addClass("ui-btn-" + options.theme), undefined !== options.corners && outer.toggleClass("ui-corner-all", options.corners), undefined !== options.shadow && outer.toggleClass("ui-shadow", options.shadow), undefined !== options.inline && outer.toggleClass("ui-btn-inline", options.inline), undefined !== options.mini && outer.toggleClass("ui-mini", options.mini), undefined !== options.disabled && (this.element.prop("disabled", options.disabled), outer.toggleClass("ui-state-disabled", options.disabled)), (undefined !== options.icon || undefined !== options.iconshadow || undefined !== options.iconpos) && outer.removeClass(this._getIconClasses(this.options)).addClass(this._getIconClasses($17.extend({
                }, this.options, options))), this._super(options);
            },
            refresh: function(create) {
                var originalElement, isDisabled = this.element.prop("disabled");
                this.options.icon && "notext" === this.options.iconpos && this.element.attr("title") && this.element.attr("title", this.element.val()), create || (originalElement = this.element.detach(), $17(this.wrapper).text(this.element.val()).append(originalElement)), this.options.disabled !== isDisabled && this._setOptions({
                    disabled: isDisabled
                });
            }
        });
    })(jQuery), disabledZoom = (initialContent = (meta = ($14 = jQuery)("meta[name=viewport]")).attr("content")) + ",maximum-scale=1, user-scalable=no", enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes", disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(initialContent), $14.mobile.zoom = $14.extend({
    }, {
        enabled: !disabledInitially,
        locked: !1,
        disable: function(lock) {
            disabledInitially || $14.mobile.zoom.locked || (meta.attr("content", disabledZoom), $14.mobile.zoom.enabled = !1, $14.mobile.zoom.locked = lock || !1);
        },
        enable: function(unlock) {
            disabledInitially || $14.mobile.zoom.locked && !0 !== unlock || (meta.attr("content", enabledZoom), $14.mobile.zoom.enabled = !0, $14.mobile.zoom.locked = !1);
        },
        restore: function() {
            disabledInitially || (meta.attr("content", initialContent), $14.mobile.zoom.enabled = !0);
        }
    }), (function($17, undefined) {
        $17.widget("mobile.textinput", {
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
                var options = this.options, isSearch = this.element.is("[type='search'], :jqmData(type='search')"), isTextarea = "TEXTAREA" === this.element[0].tagName, isRange = this.element.is("[data-" + ($17.mobile.ns || "") + "type='range']"), inputNeedsWrap = (this.element.is("input") || this.element.is("[data-" + ($17.mobile.ns || "") + "type='search']")) && !isRange;
                this.element.prop("disabled") && (options.disabled = !0), $17.extend(this, {
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
                return $17("<div class='" + (this.isSearch ? "ui-input-search " : "ui-input-text ") + this.classes.join(" ") + " ui-shadow-inset'></div>");
            },
            _autoCorrect: function() {
                void 0 === this.element[0].autocorrect || $17.support.touchOverflow || (this.element[0].setAttribute("autocorrect", "off"), this.element[0].setAttribute("autocomplete", "off"));
            },
            _handleBlur: function() {
                this.widget().removeClass($17.mobile.focusClass), this.options.preventFocusZoom && $17.mobile.zoom.enable(!0);
            },
            _handleFocus: function() {
                this.options.preventFocusZoom && $17.mobile.zoom.disable(!0), this.widget().addClass($17.mobile.focusClass);
            },
            _setOptions: function(options) {
                var outer = this.widget();
                this._super(options), undefined === options.disabled && undefined === options.mini && undefined === options.corners && undefined === options.theme && undefined === options.wrapperClass || (outer.removeClass(this.classes.join(" ")), this.classes = this._classesFromOptions(), outer.addClass(this.classes.join(" "))), undefined !== options.disabled && this.element.prop("disabled", !!options.disabled);
            },
            _destroy: function() {
                this.options.enhanced || (this.inputNeedsWrap && this.element.unwrap(), this.element.removeClass("ui-input-text " + this.classes.join(" ")));
            }
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.slider", $17.extend({
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
                var bg, options, wrapper, j, length, i, optionsCount, origTabIndex, side, activeClass, sliderImg, control = this.element, trackTheme = this.options.trackTheme || $17.mobile.getAttribute(control[0], "theme"), cornerClass = this.options.corners || control.jqmData("corners") ? " ui-corner-all" : "", miniClass = this.options.mini || control.jqmData("mini") ? " ui-mini" : "", cType = control[0].nodeName.toLowerCase(), isToggleSwitch = "select" === cType, isRangeslider = control.parent().is(":jqmData(role='rangeslider')"), controlID = control.attr("id"), $label = $17("[for='" + controlID + "']"), labelID = $label.attr("id") || controlID + "-label", min = isToggleSwitch ? 0 : parseFloat(control.attr("min")), max = isToggleSwitch ? control.find("option").length - 1 : parseFloat(control.attr("max")), step = window.parseFloat(control.attr("step") || 1), domHandle = document.createElement("a"), handle = $17(domHandle), domSlider = document.createElement("div"), slider = $17(domSlider), valuebg = !!this.options.highlight && !isToggleSwitch && ((bg = document.createElement("div")).className = "ui-slider-bg " + $17.mobile.activeBtnClass, $17(bg).prependTo(slider));
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
                }), $17.extend(this, {
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
                        $17(this).blur(), handle.focus();
                    }), (wrapper = document.createElement("div")).className = "ui-slider-inneroffset", j = 0, length = domSlider.childNodes.length; j < length; j++)wrapper.appendChild(domSlider.childNodes[j]);
                    for(domSlider.appendChild(wrapper), handle.addClass("ui-slider-handle-snapping"), i = 0, optionsCount = (options = control.find("option")).length; i < optionsCount; i++)side = i ? "a" : "b", activeClass = i ? " " + $17.mobile.activeBtnClass : "", (sliderImg = document.createElement("span")).className = [
                        "ui-slider-label ui-slider-label-",
                        side,
                        activeClass
                    ].join(""), sliderImg.setAttribute("role", "img"), sliderImg.appendChild(document.createTextNode(options[i].innerHTML)), $17(sliderImg).prependTo(slider);
                    this._labels = $17(".ui-slider-label", slider);
                }
                control.addClass(isToggleSwitch ? "ui-slider-switch" : "ui-slider-input"), this._on(control, {
                    change: "_controlChange",
                    keyup: "_controlKeyup",
                    blur: "_controlBlur",
                    vmouseup: "_controlVMouseUp"
                }), slider.bind("vmousedown", $17.proxy(this._sliderVMouseDown, this)).bind("vclick", !1), this._on(document, {
                    vmousemove: "_preventDocumentDrag"
                }), this._on(slider.add(document), {
                    vmouseup: "_sliderVMouseUp"
                }), slider.insertAfter(control), isToggleSwitch || isRangeslider || (wrapper = this.options.mini ? "<div class='ui-slider ui-mini'>" : "<div class='ui-slider'>", control.add(slider).wrapAll(wrapper)), this._on(this.handle, {
                    vmousedown: "_handleVMouseDown",
                    keydown: "_handleKeydown",
                    keyup: "_handleKeyup"
                }), this.handle.bind("vclick", !1), this._handleFormReset(), this.refresh(undefined, undefined, !0);
            },
            _setOptions: function(options) {
                undefined !== options.theme && this._setTheme(options.theme), undefined !== options.trackTheme && this._setTrackTheme(options.trackTheme), undefined !== options.corners && this._setCorners(options.corners), undefined !== options.mini && this._setMini(options.mini), undefined !== options.highlight && this._setHighlight(options.highlight), undefined !== options.disabled && this._setDisabled(options.disabled), this._super(options);
            },
            _controlChange: function(event) {
                if (!1 === this._trigger("controlchange", event)) return !1;
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
            _handleKeydown: function(event) {
                var index = this._value();
                if (!this.options.disabled) {
                    switch(event.keyCode){
                        case $17.mobile.keyCode.HOME:
                        case $17.mobile.keyCode.END:
                        case $17.mobile.keyCode.PAGE_UP:
                        case $17.mobile.keyCode.PAGE_DOWN:
                        case $17.mobile.keyCode.UP:
                        case $17.mobile.keyCode.RIGHT:
                        case $17.mobile.keyCode.DOWN:
                        case $17.mobile.keyCode.LEFT:
                            event.preventDefault(), this._keySliding || (this._keySliding = !0, this.handle.addClass("ui-state-active"));
                            break;
                    }
                    switch(event.keyCode){
                        case $17.mobile.keyCode.HOME:
                            this.refresh(this.min);
                            break;
                        case $17.mobile.keyCode.END:
                            this.refresh(this.max);
                            break;
                        case $17.mobile.keyCode.PAGE_UP:
                        case $17.mobile.keyCode.UP:
                        case $17.mobile.keyCode.RIGHT:
                            this.refresh(index + this.step);
                            break;
                        case $17.mobile.keyCode.PAGE_DOWN:
                        case $17.mobile.keyCode.DOWN:
                        case $17.mobile.keyCode.LEFT:
                            this.refresh(index - this.step);
                            break;
                    }
                }
            },
            _handleKeyup: function() {
                this._keySliding && (this._keySliding = !1, this.handle.removeClass("ui-state-active"));
            },
            _sliderVMouseDown: function(event) {
                return this.options.disabled || !(1 === event.which || 0 === event.which || undefined === event.which) || !1 === this._trigger("beforestart", event) || (this.dragging = !0, this.userModified = !1, this.mouseMoved = !1, this.isToggleSwitch && (this.beforeStart = this.element[0].selectedIndex), this.refresh(event), this._trigger("start")), !1;
            },
            _sliderVMouseUp: function() {
                if (this.dragging) return this.dragging = !1, this.isToggleSwitch && (this.handle.addClass("ui-slider-handle-snapping"), this.mouseMoved ? this.userModified ? this.refresh(0 === this.beforeStart ? 1 : 0) : this.refresh(this.beforeStart) : this.refresh(0 === this.beforeStart ? 1 : 0)), this.mouseMoved = !1, this._trigger("stop"), !1;
            },
            _preventDocumentDrag: function(event) {
                return !1 !== this._trigger("drag", event) && (this.dragging && !this.options.disabled ? (this.mouseMoved = !0, this.isToggleSwitch && this.handle.removeClass("ui-slider-handle-snapping"), this.refresh(event), this.userModified = this.beforeStart !== this.element[0].selectedIndex, !1) : void 0);
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
                var bg, left, width, data, pxStep, percent, control, isInput, optionElements, min, max, step, newval, valModStep, alignValue, percentPerStep, handlePercent, aPercent, bPercent, valueChanged, parentTheme = $17.mobile.getAttribute(this.element[0], "theme"), theme = this.options.theme || parentTheme, trackTheme = this.options.trackTheme || parentTheme, cornerClass = this.options.corners ? " ui-corner-all" : "", miniClass = this.options.mini ? " ui-mini" : "";
                if (this.slider[0].className = [
                    this.isToggleSwitch ? "ui-slider ui-slider-switch ui-slider-track ui-shadow-inset" : "ui-slider-track ui-shadow-inset",
                    trackTheme ? " ui-bar-" + trackTheme : " ui-bar-inherit",
                    cornerClass,
                    miniClass
                ].join(""), (this.options.disabled || this.element.prop("disabled")) && this.disable(), this.value = this._value(), this.options.highlight && !this.isToggleSwitch && 0 === this.slider.find(".ui-slider-bg").length && (this.valuebg = ((bg = document.createElement("div")).className = "ui-slider-bg " + $17.mobile.activeBtnClass, $17(bg).prependTo(this.slider))), (this.handle.addClass("ui-btn" + (theme ? " ui-btn-" + theme : "") + " ui-shadow"), control = this.element, optionElements = (isInput = !this.isToggleSwitch) ? [] : control.find("option"), min = isInput ? parseFloat(control.attr("min")) : 0, max = isInput ? parseFloat(control.attr("max")) : optionElements.length - 1, step = isInput && parseFloat(control.attr("step")) > 0 ? parseFloat(control.attr("step")) : 1, "object" == typeof val) ? (data = val, left = this.slider.offset().left, pxStep = (width = this.slider.width()) / ((max - min) / step), !this.dragging || data.pageX < left - 8 || data.pageX > left + width + 8 || (percent = pxStep > 1 ? (data.pageX - left) / width * 100 : Math.round((data.pageX - left) / width * 100))) : (null == val && (val = isInput ? parseFloat(control.val() || 0) : control[0].selectedIndex), percent = (parseFloat(val) - min) / (max - min) * 100), !isNaN(percent) && (alignValue = newval - (valModStep = ((newval = percent / 100 * (max - min) + min) - min) % step), 2 * Math.abs(valModStep) >= step && (alignValue += valModStep > 0 ? step : -step), percentPerStep = 100 / ((max - min) / step), newval = parseFloat(alignValue.toFixed(5)), void 0 === pxStep && (pxStep = width / ((max - min) / step)), pxStep > 1 && isInput && (percent = (newval - min) * percentPerStep * (1 / step)), percent < 0 && (percent = 0), percent > 100 && (percent = 100), newval < min && (newval = min), newval > max && (newval = max), this.handle.css("left", percent + "%"), this.handle[0].setAttribute("aria-valuenow", isInput ? newval : optionElements.eq(newval).attr("value")), this.handle[0].setAttribute("aria-valuetext", isInput ? newval : optionElements.eq(newval).getEncodedText()), this.handle[0].setAttribute("title", isInput ? newval : optionElements.eq(newval).getEncodedText()), this.valuebg && this.valuebg.css("width", percent + "%"), this._labels && (handlePercent = this.handle.width() / this.slider.width() * 100, aPercent = percent && handlePercent + (100 - handlePercent) * percent / 100, bPercent = 100 === percent ? 0 : Math.min(handlePercent + 100 - aPercent, 100), this._labels.each(function() {
                    var ab = $17(this).hasClass("ui-slider-label-a");
                    $17(this).width((ab ? aPercent : bPercent) + "%");
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
        }, $17.mobile.behaviors.formReset));
    })(jQuery), (function($17, undefined) {
        var popup;
        function getPopup() {
            return popup || (popup = $17("<div></div>", {
                "class": "ui-slider-popup ui-shadow ui-corner-all"
            })), popup.clone();
        }
        $17.widget("mobile.slider", $17.mobile.slider, {
            options: {
                popupEnabled: !1,
                showValue: !1
            },
            _create: function() {
                this._super(), $17.extend(this, {
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
                this._super(key, value), "showValue" === key ? this.handle.html(value && !this.options.mini ? this._value() : "") : "popupEnabled" === key && value && !this._popup && (this._popup = getPopup().addClass("ui-body-" + (this.options.theme || "a")).hide().insertBefore(this.element));
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
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.flipswitch", $17.extend({
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
                this.options.enhanced ? $17.extend(this, {
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
                var flipswitch = $17("<div>"), options = this.options, element = this.element, theme = options.theme ? options.theme : "inherit", on = $17("<a></a>", {
                    href: "#"
                }), off = $17("<span></span>"), type = element.get(0).tagName, onText = "INPUT" === type ? options.onText : element.find("option").eq(1).text(), offText = "INPUT" === type ? options.offText : element.find("option").eq(0).text();
                on.addClass("ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit").text(onText), off.addClass("ui-flipswitch-off").text(offText), flipswitch.addClass("ui-flipswitch ui-shadow-inset ui-bar-" + theme + " " + (options.wrapperClass ? options.wrapperClass : "") + " " + (element.is(":checked") || element.find("option").eq(1).is(":selected") ? "ui-flipswitch-active" : "") + (element.is(":disabled") ? " ui-state-disabled" : "") + (options.corners ? " ui-corner-all" : "") + (options.mini ? " ui-mini" : "")).append(on, off), element.addClass("ui-flipswitch-input").after(flipswitch).appendTo(flipswitch), $17.extend(this, {
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
                e.which === $17.mobile.keyCode.LEFT ? this._left() : e.which === $17.mobile.keyCode.RIGHT ? this._right() : e.which === $17.mobile.keyCode.SPACE && (this._toggle(), e.preventDefault());
            },
            _setOptions: function(options) {
                if (undefined !== options.theme) {
                    var currentTheme = options.theme ? options.theme : "inherit", newTheme = options.theme ? options.theme : "inherit";
                    this.widget().removeClass("ui-bar-" + currentTheme).addClass("ui-bar-" + newTheme);
                }
                undefined !== options.onText && this.on.text(options.onText), undefined !== options.offText && this.off.text(options.offText), undefined !== options.disabled && this.widget().toggleClass("ui-state-disabled", options.disabled), undefined !== options.mini && this.widget().toggleClass("ui-mini", options.mini), undefined !== options.corners && this.widget().toggleClass("ui-corner-all", options.corners), this._super(options);
            },
            _destroy: function() {
                this.options.enhanced || (null != this._originalTabIndex ? this.element.attr("tabindex", this._originalTabIndex) : this.element.removeAttr("tabindex"), this.on.remove(), this.off.remove(), this.element.unwrap(), this.flipswitch.remove(), this.removeClass("ui-flipswitch-input"));
            }
        }, $17.mobile.behaviors.formReset));
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.rangeslider", $17.extend({
            options: {
                theme: null,
                trackTheme: null,
                corners: !0,
                mini: !1,
                highlight: !0
            },
            _create: function() {
                var $el = this.element, elClass = this.options.mini ? "ui-rangeslider ui-mini" : "ui-rangeslider", _inputFirst = $el.find("input").first(), _inputLast = $el.find("input").last(), _label = $el.find("label").first(), _sliderWidgetFirst = $17.data(_inputFirst.get(0), "mobile-slider") || $17.data(_inputFirst.slider().get(0), "mobile-slider"), _sliderWidgetLast = $17.data(_inputLast.get(0), "mobile-slider") || $17.data(_inputLast.slider().get(0), "mobile-slider"), _sliderFirst = _sliderWidgetFirst.slider, _sliderLast = _sliderWidgetLast.slider, firstHandle = _sliderWidgetFirst.handle, _sliders = $17("<div class='ui-rangeslider-sliders' />").appendTo($el);
                _inputFirst.addClass("ui-rangeslider-first"), _inputLast.addClass("ui-rangeslider-last"), $el.addClass(elClass), _sliderFirst.appendTo(_sliders), _sliderLast.appendTo(_sliders), _label.insertBefore($el), firstHandle.prependTo(_sliderLast), $17.extend(this, {
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
            _dragFirstHandle: function(event) {
                return $17.data(this._inputFirst.get(0), "mobile-slider").dragging = !0, $17.data(this._inputFirst.get(0), "mobile-slider").refresh(event), !1;
            },
            _slidedrag: function(event) {
                var first = $17(event.target).is(this._inputFirst), otherSlider = first ? this._inputLast : this._inputFirst;
                if (this._sliderTarget = !1, "first" === this._proxy && first || "last" === this._proxy && !first) return $17.data(otherSlider.get(0), "mobile-slider").dragging = !0, $17.data(otherSlider.get(0), "mobile-slider").refresh(event), !1;
            },
            _slidestop: function(event) {
                var first = $17(event.target).is(this._inputFirst);
                this._proxy = !1, this.element.find("input").trigger("vmouseup"), this._sliderFirst.css("z-index", first ? 1 : "");
            },
            _slidebeforestart: function(event) {
                this._sliderTarget = !1, $17(event.originalEvent.target).hasClass("ui-slider-track") && (this._sliderTarget = !0, this._targetVal = $17(event.target).val());
            },
            _setOptions: function(options) {
                undefined !== options.theme && this._setTheme(options.theme), undefined !== options.trackTheme && this._setTrackTheme(options.trackTheme), undefined !== options.mini && this._setMini(options.mini), undefined !== options.highlight && this._setHighlight(options.highlight), this._super(options), this.refresh();
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
            _change: function(event) {
                if ("keyup" === event.type) return this._updateHighlight(), !1;
                var self = this, min = parseFloat(this._inputFirst.val(), 10), max = parseFloat(this._inputLast.val(), 10), first = $17(event.target).hasClass("ui-rangeslider-first"), thisSlider = first ? this._inputFirst : this._inputLast, otherSlider = first ? this._inputLast : this._inputFirst;
                if (this._inputFirst.val() > this._inputLast.val() && "mousedown" === event.type && !$17(event.target).hasClass("ui-slider-handle")) thisSlider.blur();
                else if ("mousedown" === event.type) return;
                if (min > max && !this._sliderTarget ? (thisSlider.val(first ? max : min).slider("refresh"), this._trigger("normalize")) : min > max && (thisSlider.val(this._targetVal).slider("refresh"), setTimeout(function() {
                    otherSlider.val(first ? min : max).slider("refresh"), $17.data(otherSlider.get(0), "mobile-slider").handle.focus(), self._sliderFirst.css("z-index", first ? "" : 1), self._trigger("normalize");
                }, 0), this._proxy = first ? "first" : "last"), min === max ? ($17.data(thisSlider.get(0), "mobile-slider").handle.css("z-index", 1), $17.data(otherSlider.get(0), "mobile-slider").handle.css("z-index", 0)) : ($17.data(otherSlider.get(0), "mobile-slider").handle.css("z-index", ""), $17.data(thisSlider.get(0), "mobile-slider").handle.css("z-index", "")), this._updateHighlight(), min >= max) return !1;
            },
            _updateHighlight: function() {
                var min = parseInt($17.data(this._inputFirst.get(0), "mobile-slider").handle.get(0).style.left, 10), max = parseInt($17.data(this._inputLast.get(0), "mobile-slider").handle.get(0).style.left, 10);
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
        }, $17.mobile.behaviors.formReset));
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.textinput", $17.mobile.textinput, {
            options: {
                clearBtn: !1,
                clearBtnText: "Clear text"
            },
            _create: function() {
                this._super(), (this.options.clearBtn || this.isSearch) && this._addClearBtn();
            },
            clearButton: function() {
                return $17("<a href='#' class='ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all' title='" + this.options.clearBtnText + "'>" + this.options.clearBtnText + "</a>");
            },
            _clearBtnClick: function(event) {
                this.element.val("").focus().trigger("change"), this._clearBtn.addClass("ui-input-clear-hidden"), event.preventDefault();
            },
            _addClearBtn: function() {
                this.options.enhanced || this._enhanceClear(), $17.extend(this, {
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
                this._super(options), undefined === options.clearBtn || this.element.is("textarea, :jqmData(type='range')") || (options.clearBtn ? this._addClearBtn() : this._destroyClear()), undefined !== options.clearBtnText && undefined !== this._clearBtn && this._clearBtn.text(options.clearBtnText).attr("title", options.clearBtnText);
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
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.textinput", $17.mobile.textinput, {
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
            _handleShow: function(event) {
                $17.contains(event.target, this.element[0]) && this.element.is(":visible") && ("popupbeforeposition" !== event.type && this.element.addClass("ui-textinput-autogrow-resize").animationComplete($17.proxy(function() {
                    this.element.removeClass("ui-textinput-autogrow-resize");
                }, this), "transition"), this._timeout());
            },
            _unbindAutogrow: function() {
                this.element.removeClass("ui-textinput-autogrow"), this._off(this.element, "keyup change input paste"), this._off(this.document, "pageshow popupbeforeposition updatelayout panelopen");
            },
            keyupTimeout: null,
            _prepareHeightUpdate: function(delay) {
                this.keyupTimeout && clearTimeout(this.keyupTimeout), delay === undefined ? this._updateHeight() : this.keyupTimeout = this._delay("_updateHeight", delay);
            },
            _timeout: function() {
                this._prepareHeightUpdate(this.options.keyupTimeoutBuffer);
            },
            _updateHeight: function() {
                var borderHeight, height, scrollTop = this.window.scrollTop();
                this.keyupTimeout = 0, "onpage" in this.element[0] || this.element.css({
                    height: 0,
                    "min-height": 0,
                    "max-height": 0
                }), this.element[0].scrollHeight, this.element[0].clientHeight, borderHeight = parseFloat(this.element.css("border-top-width")) + parseFloat(this.element.css("border-bottom-width")), height = this.element[0].scrollHeight + borderHeight + 15, 0 === this.element[0].clientHeight && (height += parseFloat(this.element.css("padding-top")) + parseFloat(this.element.css("padding-bottom"))), this.element.css({
                    height: height,
                    "min-height": "",
                    "max-height": ""
                }), this.window.scrollTop(scrollTop);
            },
            refresh: function() {
                this.options.autogrow && this.isTextarea && this._updateHeight();
            },
            _setOptions: function(options) {
                this._super(options), undefined !== options.autogrow && this.isTextarea && (options.autogrow ? this._autogrow() : this._unbindAutogrow());
            }
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.selectmenu", $17.extend({
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
                return $17("<div/>");
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
                ~this.element[0].className.indexOf("ui-btn-left") && (classes = " ui-btn-left"), ~this.element[0].className.indexOf("ui-btn-right") && (classes = " ui-btn-right"), inline && (classes += " ui-btn-inline"), mini && (classes += " ui-mini"), this.select = this.element.removeClass("ui-btn-left ui-btn-right").wrap("<div class='ui-select" + classes + "'>"), this.selectId = this.select.attr("id") || "select-" + this.uuid, this.buttonId = this.selectId + "-button", this.label = $17("label[for='" + this.selectId + "']"), this.isMultiple = this.select[0].multiple;
            },
            _destroy: function() {
                var wrapper = this.element.parents(".ui-select");
                wrapper.length > 0 && (wrapper.is(".ui-btn-left, .ui-btn-right") && this.element.addClass(wrapper.hasClass("ui-btn-left") ? "ui-btn-left" : "ui-btn-right"), this.element.insertAfter(wrapper), wrapper.remove());
            },
            _create: function() {
                this._preExtension(), this.button = this._button();
                var self = this, options = this.options, iconpos = !!options.icon && (options.iconpos || this.select.jqmData("iconpos")), button = this.button.insertBefore(this.select).attr("id", this.buttonId).addClass("ui-btn" + (options.icon ? " ui-icon-" + options.icon + " ui-btn-icon-" + iconpos + (options.iconshadow ? " ui-shadow-icon" : "") : "") + (options.theme ? " ui-btn-" + options.theme : "") + (options.corners ? " ui-corner-all" : "") + (options.shadow ? " ui-shadow" : ""));
                this.setButtonText(), options.nativeMenu && window.opera && window.opera.version && button.addClass("ui-select-nativeonly"), this.isMultiple && (this.buttonCount = $17("<span>").addClass("ui-li-count ui-body-inherit").hide().appendTo(button.addClass("ui-li-has-count"))), (options.disabled || this.element.attr("disabled")) && this.disable(), this.select.change(function() {
                    self.refresh(), options.nativeMenu && this.blur();
                }), this._handleFormReset(), this._on(this.button, {
                    keydown: "_handleKeydown"
                }), this.build();
            },
            build: function() {
                var self = this;
                this.select.appendTo(self.button).bind("vmousedown", function() {
                    self.button.addClass($17.mobile.activeBtnClass);
                }).bind("focus", function() {
                    self.button.addClass($17.mobile.focusClass);
                }).bind("blur", function() {
                    self.button.removeClass($17.mobile.focusClass);
                }).bind("focus vmouseover", function() {
                    self.button.trigger("vmouseover");
                }).bind("vmousemove", function() {
                    self.button.removeClass($17.mobile.activeBtnClass);
                }).bind("change blur vmouseout", function() {
                    self.button.trigger("vmouseout").removeClass($17.mobile.activeBtnClass);
                }), self.button.bind("vmousedown", function() {
                    self.options.preventFocusZoom && $17.mobile.zoom.disable(!0);
                }), self.label.bind("click focus", function() {
                    self.options.preventFocusZoom && $17.mobile.zoom.disable(!0);
                }), self.select.bind("focus", function() {
                    self.options.preventFocusZoom && $17.mobile.zoom.disable(!0);
                }), self.button.bind("mouseup", function() {
                    self.options.preventFocusZoom && setTimeout(function() {
                        $17.mobile.zoom.enable(!0);
                    }, 0);
                }), self.select.bind("blur", function() {
                    self.options.preventFocusZoom && $17.mobile.zoom.enable(!0);
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
                var selected = this.selected(), text = this.placeholder, span = $17(document.createElement("span"));
                this.button.children("span").not(".ui-li-count").remove().end().end().prepend(((text = selected.length ? selected.map(function() {
                    return $17(this).text();
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
            open: $17.noop,
            close: $17.noop,
            disable: function() {
                this._setDisabled(!0), this.button.addClass("ui-state-disabled");
            },
            enable: function() {
                this._setDisabled(!1), this.button.removeClass("ui-state-disabled");
            }
        }, $17.mobile.behaviors.formReset));
    })(jQuery), ($15 = jQuery).mobile.links = function(target) {
        $15(target).find("a").jqmEnhanceable().filter(":jqmData(rel='popup')[href][href!='']").each(function() {
            var idref = this.getAttribute("href").substring(1);
            idref && (this.setAttribute("aria-haspopup", !0), this.setAttribute("aria-owns", idref), this.setAttribute("aria-expanded", !1));
        }).end().not(".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link");
    }, (function($17, undefined) {
        function fitSegmentInsideSegment(windowSize, segmentSize, offset, desired) {
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
        $17.widget("mobile.popup", {
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
                history: !$17.mobile.browser.oldIE
            },
            _create: function() {
                var theElement = this.element, myId = theElement.attr("id"), currentOptions = this.options;
                currentOptions.history = currentOptions.history && $17.mobile.ajaxEnabled && $17.mobile.hashListeningEnabled, $17.extend(this, {
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
                }), 0 === this._page.length && (this._page = $17("body")), currentOptions.enhanced ? this._ui = {
                    container: theElement.parent(),
                    screen: theElement.parent().prev(),
                    placeholder: $17(this.document[0].getElementById(myId + "-placeholder"))
                } : (this._ui = this._enhance(theElement, myId), this._applyTransition(currentOptions.transition)), this._setTolerance(currentOptions.tolerance)._ui.focusElement = this._ui.container, this._on(this._ui.screen, {
                    vclick: "_eatEventAndClose"
                }), this._on(this.window, {
                    orientationchange: $17.proxy(this, "_handleWindowOrientationchange"),
                    resize: $17.proxy(this, "_handleWindowResize"),
                    keyup: $17.proxy(this, "_handleWindowKeyUp")
                }), this._on(this.document, {
                    focusin: "_handleDocumentFocusIn"
                });
            },
            _enhance: function(theElement, myId) {
                var currentOptions = this.options, wrapperClass = currentOptions.wrapperClass, ui = {
                    screen: $17("<div class='ui-screen-hidden ui-popup-screen " + this._themeClassFromOption("ui-overlay-", currentOptions.overlayTheme) + "'></div>"),
                    placeholder: $17("<div style='display: none;'><!-- placeholder --></div>"),
                    container: $17("<div class='ui-popup-container ui-popup-hidden ui-popup-truncate" + (wrapperClass ? " " + wrapperClass : "") + "'></div>")
                }, fragment = this.document[0].createDocumentFragment();
                return fragment.appendChild(ui.screen[0]), fragment.appendChild(ui.container[0]), myId && (ui.screen.attr("id", myId + "-screen"), ui.container.attr("id", myId + "-popup"), ui.placeholder.attr("id", myId + "-placeholder").html("<!-- placeholder for " + myId + " -->")), this._page[0].appendChild(fragment), ui.placeholder.insertAfter(theElement), theElement.detach().addClass("ui-popup " + this._themeClassFromOption("ui-body-", currentOptions.theme) + " " + (currentOptions.shadow ? "ui-overlay-shadow " : "") + (currentOptions.corners ? "ui-corner-all " : "")).appendTo(ui.container), ui;
            },
            _eatEventAndClose: function(theEvent) {
                return theEvent.preventDefault(), theEvent.stopImmediatePropagation(), this.options.dismissible && this.close(), !1;
            },
            _resizeScreen: function() {
                var screen = this._ui.screen, popupHeight = this._ui.container.outerHeight(!0), screenHeight = screen.removeAttr("style").height(), documentHeight = this.document.height() - 1;
                screenHeight < documentHeight ? screen.height(documentHeight) : popupHeight > screenHeight && screen.height(popupHeight);
            },
            _handleWindowKeyUp: function(theEvent) {
                if (this._isOpen && theEvent.keyCode === $17.mobile.keyCode.ESCAPE) return this._eatEventAndClose(theEvent);
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
                        if (0 === (target = $17(targetElement)).parents().filter(ui.container[0]).length) return $17(this.document[0].activeElement).one("focus", function() {
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
                return value && (this._ui.container.removeClass(this._fallbackTransition), "none" !== value && (this._fallbackTransition = $17.mobile._maybeDegradeTransition(value), "none" === this._fallbackTransition && (this._fallbackTransition = ""), this._ui.container.addClass(this._fallbackTransition))), this;
            },
            _setOptions: function(newOptions) {
                var currentOptions = this.options, theElement = this.element, screen = this._ui.screen;
                return undefined !== newOptions.wrapperClass && this._ui.container.removeClass(currentOptions.wrapperClass).addClass(newOptions.wrapperClass), undefined !== newOptions.theme && theElement.removeClass(this._themeClassFromOption("ui-body-", currentOptions.theme)).addClass(this._themeClassFromOption("ui-body-", newOptions.theme)), undefined !== newOptions.overlayTheme && (screen.removeClass(this._themeClassFromOption("ui-overlay-", currentOptions.overlayTheme)).addClass(this._themeClassFromOption("ui-overlay-", newOptions.overlayTheme)), this._isOpen && screen.addClass("in")), undefined !== newOptions.shadow && theElement.toggleClass("ui-overlay-shadow", newOptions.shadow), undefined !== newOptions.corners && theElement.toggleClass("ui-corner-all", newOptions.corners), undefined === newOptions.transition || this._currentTransition || this._applyTransition(newOptions.transition), undefined !== newOptions.tolerance && this._setTolerance(newOptions.tolerance), undefined !== newOptions.disabled && newOptions.disabled && this.close(), this._super(newOptions);
            },
            _setTolerance: function(value) {
                var ar, tol = {
                    t: 30,
                    r: 15,
                    b: 30,
                    l: 15
                };
                if (value !== undefined) switch(ar = String(value).split(","), $17.each(ar, function(idx, val) {
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
                        break;
                    default:
                        break;
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
                    screen: $17.Deferred(),
                    container: $17.Deferred()
                }).screen.then(function() {
                    prerequisites === self._prerequisites && screenPrerequisite();
                }), prerequisites.container.then(function() {
                    prerequisites === self._prerequisites && containerPrerequisite();
                }), $17.when(prerequisites.screen, prerequisites.container).done(function() {
                    prerequisites === self._prerequisites && (self._prerequisites = null, whenDone());
                }), self._prerequisites = prerequisites;
            },
            _animate: function(args) {
                if (this._ui.screen.removeClass(args.classToRemove).addClass(args.screenClassToAdd), args.prerequisites.screen.resolve(), args.transition && "none" !== args.transition && (args.applyTransition && this._applyTransition(args.transition), this._fallbackTransition)) return void this._ui.container.addClass(args.containerClassToAdd).removeClass(args.classToRemove).animationComplete($17.proxy(args.prerequisites.container, "resolve"));
                this._ui.container.removeClass(args.classToRemove), args.prerequisites.container.resolve();
            },
            _desiredCoords: function(openOptions) {
                var offset, dst = null, windowCoordinates = getWindowCoordinates(this.window), x = openOptions.x, y = openOptions.y, pTo = openOptions.positionTo;
                if (pTo && "origin" !== pTo) if ("window" === pTo) x = windowCoordinates.cx / 2 + windowCoordinates.x, y = windowCoordinates.cy / 2 + windowCoordinates.y;
                else {
                    try {
                        dst = $17(pTo);
                    } catch (err) {
                        dst = null;
                    }
                    dst && (dst.filter(":visible"), 0 === dst.length && (dst = null));
                }
                return dst && (x = (offset = dst.offset()).left + dst.outerWidth() / 2, y = offset.top + dst.outerHeight() / 2), ("number" !== $17.type(x) || isNaN(x)) && (x = windowCoordinates.cx / 2 + windowCoordinates.x), ("number" !== $17.type(y) || isNaN(y)) && (y = windowCoordinates.cy / 2 + windowCoordinates.y), {
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
                var ua, wkmatch, wkversion, androidmatch, andversion, chromematch, openOptions = $17.extend({
                }, this.options, options), androidBlacklist = (wkversion = !!(wkmatch = (ua = navigator.userAgent).match(/AppleWebKit\/([0-9\.]+)/)) && wkmatch[1], andversion = !!(androidmatch = ua.match(/Android (\d+(?:\.\d+))/)) && androidmatch[1], chromematch = ua.indexOf("Chrome") > -1, null !== androidmatch && "4.0" === andversion && !!wkversion && wkversion > 534.13 && !chromematch);
                this._createPrerequisites($17.noop, $17.noop, $17.proxy(this, "_openPrerequisitesComplete")), this._currentTransition = openOptions.transition, this._applyTransition(openOptions.transition), this._ui.screen.removeClass("ui-screen-hidden"), this._ui.container.removeClass("ui-popup-truncate"), this._reposition(openOptions), this._ui.container.removeClass("ui-popup-hidden"), this.options.overlayTheme && androidBlacklist && this.element.closest(".ui-page").addClass("ui-popup-open"), this._animate({
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
                container.removeAttr("tabindex"), $17.mobile.popup.active = undefined, $17(":focus", container[0]).add(container[0]).blur(), id && this.document.find("[aria-haspopup='true'][aria-owns='" + id + "']").attr("aria-expanded", !1), this._trigger("afterclose");
            },
            _close: function(immediate) {
                this._ui.container.removeClass("ui-popup-active"), this._page.removeClass("ui-popup-open"), this._isOpen = !1, this._createPrerequisites($17.proxy(this, "_closePrerequisiteScreen"), $17.proxy(this, "_closePrerequisiteContainer"), $17.proxy(this, "_closePrerequisitesDone")), this._animate({
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
                this.options.enhanced || (this._setOptions({
                    theme: $17.mobile.popup.prototype.options.theme
                }), this.element.detach().insertAfter(this._ui.placeholder).removeClass("ui-popup ui-overlay-shadow ui-corner-all ui-body-inherit"), this._ui.screen.remove(), this._ui.container.remove(), this._ui.placeholder.remove());
            },
            _destroy: function() {
                return $17.mobile.popup.active === this ? (this.element.one("popupafterclose", $17.proxy(this, "_unenhance")), this.close()) : this._unenhance(), this;
            },
            _closePopup: function(theEvent, data) {
                var parsedDst, toUrl, currentOptions = this.options, immediate = !1;
                theEvent && theEvent.isDefaultPrevented() || $17.mobile.popup.active !== this || (window.scrollTo(0, this._scrollTop), theEvent && "pagebeforechange" === theEvent.type && data && (parsedDst = "string" == typeof data.toPage ? data.toPage : data.toPage.jqmData("url"), toUrl = (parsedDst = $17.mobile.path.parseUrl(parsedDst)).pathname + parsedDst.search + parsedDst.hash, this._myUrl !== $17.mobile.path.makeUrlAbsolute(toUrl) ? immediate = !0 : theEvent.preventDefault()), this.window.off(currentOptions.closeEvents), this.element.undelegate(currentOptions.closeLinkSelector, currentOptions.closeLinkEvents), this._close(immediate));
            },
            _bindContainerClose: function() {
                this.window.on(this.options.closeEvents, $17.proxy(this, "_closePopup"));
            },
            widget: function() {
                return this._ui.container;
            },
            open: function(options) {
                var url, hashkey, activePage, currentIsDialog, urlHistory, self = this, currentOptions = this.options;
                return $17.mobile.popup.active || currentOptions.disabled ? this : ($17.mobile.popup.active = this, this._scrollTop = this.window.scrollTop(), currentOptions.history) ? (urlHistory = $17.mobile.navigate.history, hashkey = $17.mobile.dialogHashKey, currentIsDialog = !!(activePage = $17.mobile.activePage) && activePage.hasClass("ui-dialog"), this._myUrl = url = urlHistory.getActive().url, url.indexOf(hashkey) > -1 && !currentIsDialog && urlHistory.activeIndex > 0) ? (self._open(options), self._bindContainerClose(), this) : (-1 !== url.indexOf(hashkey) || currentIsDialog ? url = $17.mobile.path.parseLocation().hash + hashkey : url += url.indexOf("#") > -1 ? hashkey : "#" + hashkey, 0 === urlHistory.activeIndex && url === urlHistory.initialDst && (url += hashkey), this.window.one("beforenavigate", function(theEvent) {
                    theEvent.preventDefault(), self._open(options), self._bindContainerClose();
                }), this.urlAltered = !0, $17.mobile.navigate(url, {
                    role: "dialog"
                }), this) : (self._open(options), self._bindContainerClose(), self.element.delegate(currentOptions.closeLinkSelector, currentOptions.closeLinkEvents, function(theEvent) {
                    self.close(), theEvent.preventDefault();
                }), this);
            },
            close: function() {
                return $17.mobile.popup.active !== this || (this._scrollTop = this.window.scrollTop(), this.options.history && this.urlAltered ? ($17.mobile.back(), this.urlAltered = !1) : this._closePopup()), this;
            }
        }), $17.mobile.popup.handleLink = function($link) {
            var offset, path2 = $17.mobile.path, popup = $17(path2.hashToSelector(path2.parseUrl($link.attr("href")).hash)).first();
            popup.length > 0 && popup.data("mobile-popup") && (offset = $link.offset(), popup.popup("open", {
                x: offset.left + $link.outerWidth() / 2,
                y: offset.top + $link.outerHeight() / 2,
                transition: $link.jqmData("transition"),
                positionTo: $link.jqmData("position-to")
            })), setTimeout(function() {
                $link.removeClass($17.mobile.activeBtnClass);
            }, 300);
        }, $17.mobile.document.on("pagebeforechange", function(theEvent, data) {
            "popup" === data.options.role && ($17.mobile.popup.handleLink(data.options.link), theEvent.preventDefault());
        });
    })(jQuery), (function($17, undefined) {
        var goToAdjacentItem = function(item, target, direction) {
            var adjacent = item[direction + "All"]().not(".ui-disabled,.ui-state-disabled,.ui-li-divider,.ui-screen-hidden,:jqmData(role='placeholder')").first();
            adjacent.length && (target.blur().attr("tabindex", "-1"), adjacent.find("a").first().focus());
        };
        $17.widget("mobile.selectmenu", $17.mobile.selectmenu, {
            _create: function() {
                var o = this.options;
                return o.nativeMenu = o.nativeMenu || this.element.parents(":jqmData(role='popup'),:mobile-popup").length > 0, this._super();
            },
            _handleSelectFocus: function() {
                this.element.blur(), this.button.focus();
            },
            _handleKeydown: function(event) {
                this._super(event), this._handleButtonVclickKeydown(event);
            },
            _handleButtonVclickKeydown: function(event) {
                this.options.disabled || this.isOpen || ("vclick" === event.type || event.keyCode && (event.keyCode === $17.mobile.keyCode.ENTER || event.keyCode === $17.mobile.keyCode.SPACE)) && (this._decideFormat(), "overlay" === this.menuType ? this.button.attr("href", "#" + this.popupId).attr("data-" + ($17.mobile.ns || "") + "rel", "popup") : this.button.attr("href", "#" + this.dialogId).attr("data-" + ($17.mobile.ns || "") + "rel", "dialog"), this.isOpen = !0);
            },
            _handleListFocus: function(e) {
                var params = "focusin" === e.type ? {
                    tabindex: "0",
                    event: "vmouseover"
                } : {
                    tabindex: "-1",
                    event: "vmouseout"
                };
                $17(e.target).attr("tabindex", params.tabindex).trigger(params.event);
            },
            _handleListKeydown: function(event) {
                var target = $17(event.target), li = target.closest("li");
                switch(event.keyCode){
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
                return o.nativeMenu ? this._super() : (self = this, popupId = (selectId = this.selectId) + "-listbox", dialogId = selectId + "-dialog", label = this.label, thisPage = this.element.closest(".ui-page"), isMultiple = this.element[0].multiple, menuId = selectId + "-menu", themeAttr = o.theme ? " data-" + $17.mobile.ns + "theme='" + o.theme + "'" : "", overlayThemeAttr = (overlayTheme = o.overlayTheme || o.theme || null) ? " data-" + $17.mobile.ns + "overlay-theme='" + overlayTheme + "'" : "", dividerThemeAttr = o.dividerTheme && isMultiple ? " data-" + $17.mobile.ns + "divider-theme='" + o.dividerTheme + "'" : "", menuPage = $17("<div data-" + $17.mobile.ns + "role='dialog' class='ui-selectmenu' id='" + dialogId + "'" + themeAttr + overlayThemeAttr + "><div data-" + $17.mobile.ns + "role='header'><div class='ui-title'>" + label.getEncodedText() + "</div></div><div data-" + $17.mobile.ns + "role='content'></div></div>"), listbox = $17("<div id='" + popupId + "' class='ui-selectmenu'></div>").insertAfter(this.select).popup({
                    theme: o.overlayTheme
                }), list = $17("<ul class='ui-selectmenu-list' id='" + menuId + "' role='listbox' aria-labelledby='" + this.buttonId + "'" + themeAttr + dividerThemeAttr + "></ul>").appendTo(listbox), header = $17("<div class='ui-header ui-bar-" + (o.theme ? o.theme : "inherit") + "'></div>").prependTo(listbox), headerTitle = $17("<h1 class='ui-title'></h1>").appendTo(header), this.isMultiple && (headerClose = $17("<a>", {
                    role: "button",
                    text: o.closeText,
                    href: "#",
                    "class": "ui-btn ui-corner-all ui-btn-left ui-btn-icon-notext ui-icon-delete"
                }).appendTo(header)), $17.extend(this, {
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
                }), this.refresh(), undefined === this._origTabIndex && (this._origTabIndex = null !== this.select[0].getAttribute("tabindex") && this.select.attr("tabindex")), this.select.attr("tabindex", "-1"), this._on(this.select, {
                    focus: "_handleSelectFocus"
                }), this._on(this.button, {
                    vclick: "_handleButtonVclickKeydown"
                }), this.list.attr("role", "listbox"), this._on(this.list, {
                    focusin: "_handleListFocus",
                    focusout: "_handleListFocus",
                    keydown: "_handleListKeydown"
                }), this.list.delegate("li:not(.ui-disabled,.ui-state-disabled,.ui-li-divider)", "click", function(event) {
                    var oldIndex = self.select[0].selectedIndex, newIndex = $17.mobile.getAttribute(this, "option-index"), option = self._selectOptions().eq(newIndex)[0];
                    option.selected = !self.isMultiple || !option.selected, self.isMultiple && $17(this).find("a").toggleClass("ui-checkbox-on", option.selected).toggleClass("ui-checkbox-off", !option.selected), (self.isMultiple || oldIndex !== newIndex) && self.select.trigger("change"), self.isMultiple ? self.list.find("li:not(.ui-li-divider)").eq(newIndex).find("a").first().focus() : self.close(), event.preventDefault();
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
                self = this, (force || this._isRebuildRequired()) && self._buildList(), indices = this.selectedIndices(), self.setButtonText(), self.setButtonCount(), self.list.find("li:not(.ui-li-divider)").find("a").removeClass($17.mobile.activeBtnClass).end().attr("aria-selected", !1).each(function(i) {
                    if ($17.inArray(i, indices) > -1) {
                        var item = $17(this);
                        item.attr("aria-selected", !0), self.isMultiple ? item.find("a").removeClass("ui-checkbox-off").addClass("ui-checkbox-on") : item.hasClass("ui-screen-hidden") ? item.next().find("a").addClass($17.mobile.activeBtnClass) : item.find("a").addClass($17.mobile.activeBtnClass);
                    }
                });
            },
            close: function() {
                this.options.disabled || !this.isOpen || ("page" === this.menuType ? (this.menuPage.dialog("close"), this.list.appendTo(this.listbox)) : this.listbox.popup("close"), this._focusButton(), this.isOpen = !1);
            },
            open: function() {
                this.button.click();
            },
            _focusMenuItem: function() {
                var selector = this.list.find("a." + $17.mobile.activeBtnClass);
                0 === selector.length && (selector = this.list.find("li:not(.ui-disabled,.ui-state-disabled,.ui-li-divider,.ui-screen-hidden,:jqmData(role='placeholder')) a.ui-btn")), selector.first().focus();
            },
            _decideFormat: function() {
                var $window = this.window, menuHeight = this.list.parent().outerHeight(), scrollTop = $window.scrollTop(), btnOffset = this.button.offset().top, screenHeight = $window.height();
                menuHeight > screenHeight - 80 || !$17.support.scrollTop ? (this.menuPage.appendTo($17.mobile.pageContainer).page(), this.menuPageContent = this.menuPage.find(".ui-content"), this.menuPageClose = this.menuPage.find(".ui-header a"), this.thisPage.unbind("pagehide.remove"), 0 === scrollTop && btnOffset > screenHeight && this.thisPage.one("pagehide", function() {
                    $17(this).jqmData("lastScroll", btnOffset);
                }), this.menuPage.one({
                    pageshow: $17.proxy(this, "_focusMenuItem"),
                    pagehide: $17.proxy(this, "close")
                }), this.menuType = "page", this.menuPageContent.append(this.list), this.menuPage.find("div .ui-title").text(this.label.text())) : (this.menuType = "overlay", this.listbox.one({
                    popupafteropen: $17.proxy(this, "_focusMenuItem")
                }));
            },
            _buildList: function() {
                var $options, numOptions, select, optGroup, i, option, $option, parent, text, anchor, classes, optLabel, divider, item, o = this.options, placeholder = this.placeholder, needPlaceholder = !0, dataPrefix = "data-" + $17.mobile.ns, dataIndexAttr = dataPrefix + "option-index", dataIconAttr = dataPrefix + "icon", dataRoleAttr = dataPrefix + "role", dataPlaceholderAttr = dataPrefix + "placeholder", fragment = document.createDocumentFragment(), isPlaceholderItem = !1;
                for(this.list.empty().filter(".ui-listview").listview("destroy"), numOptions = ($options = this._selectOptions()).length, select = this.select[0], i = 0; i < numOptions; i++, isPlaceholderItem = !1)($option = $17(option = $options[i])).hasClass("ui-screen-hidden") || (parent = option.parentNode, text = $option.text(), classes = [], (anchor = document.createElement("a")).setAttribute("href", "#"), anchor.appendChild(document.createTextNode(text)), parent !== select && "optgroup" === parent.nodeName.toLowerCase() && (optLabel = parent.getAttribute("label")) !== optGroup && ((divider = document.createElement("li")).setAttribute(dataRoleAttr, "list-divider"), divider.setAttribute("role", "option"), divider.setAttribute("tabindex", "-1"), divider.appendChild(document.createTextNode(optLabel)), fragment.appendChild(divider), optGroup = optLabel), needPlaceholder && (!option.getAttribute("value") || 0 === text.length || $option.jqmData("placeholder")) && (needPlaceholder = !1, isPlaceholderItem = !0, null === option.getAttribute(dataPlaceholderAttr) && (this._removePlaceholderAttr = !0), option.setAttribute(dataPlaceholderAttr, !0), o.hidePlaceholderMenuItems && classes.push("ui-screen-hidden"), placeholder !== text && (placeholder = this.placeholder = text)), item = document.createElement("li"), option.disabled && (classes.push("ui-state-disabled"), item.setAttribute("aria-disabled", !0)), item.setAttribute(dataIndexAttr, i), item.setAttribute(dataIconAttr, "false"), isPlaceholderItem && item.setAttribute(dataPlaceholderAttr, !0), item.className = classes.join(" "), item.setAttribute("role", "option"), anchor.setAttribute("tabindex", "-1"), this.isMultiple && $17(anchor).addClass("ui-btn ui-checkbox-off ui-btn-icon-right"), item.appendChild(anchor), fragment.appendChild(item));
                this.list[0].appendChild(fragment), this.isMultiple || placeholder.length ? this.headerTitle.text(this.placeholder) : this.header.addClass("ui-screen-hidden"), this.list.listview();
            },
            _button: function() {
                return this.options.nativeMenu ? this._super() : $17("<a>", {
                    href: "#",
                    role: "button",
                    id: this.buttonId,
                    "aria-haspopup": "true",
                    "aria-owns": this.menuId
                });
            },
            _destroy: function() {
                this.options.nativeMenu || (this.close(), undefined !== this._origTabIndex && (!1 !== this._origTabIndex ? this.select.attr("tabindex", this._origTabIndex) : this.select.removeAttr("tabindex")), this._removePlaceholderAttr && this._selectOptions().removeAttr("data-" + $17.mobile.ns + "placeholder"), this.listbox.remove(), this.menuPage.remove()), this._super();
            }
        });
    })(jQuery), (function($17, undefined) {
        var reverseBoolOptionMap = {
            "ui-shadow": "shadow",
            "ui-corner-all": "corners",
            "ui-btn-inline": "inline",
            "ui-shadow-icon": "iconshadow",
            "ui-mini": "mini"
        }, getAttrFixed = function() {
            var ret = $17.mobile.getAttribute.apply(this, arguments);
            return null == ret ? undefined : ret;
        }, capitalLettersRE = /[A-Z]/g;
        function optionsToClasses(options, existingClasses) {
            var classes = existingClasses || [];
            return classes.push("ui-btn"), options.theme && classes.push("ui-btn-" + options.theme), options.icon && (classes = classes.concat([
                "ui-icon-" + options.icon,
                "ui-btn-icon-" + options.iconpos
            ]), options.iconshadow && classes.push("ui-shadow-icon")), options.inline && classes.push("ui-btn-inline"), options.shadow && classes.push("ui-shadow"), options.corners && classes.push("ui-corner-all"), options.mini && classes.push("ui-mini"), classes;
        }
        function classNameToOptions(classes) {
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
        }
        function camelCase2Hyphenated(c) {
            return "-" + c.toLowerCase();
        }
        $17.fn.buttonMarkup = function(options, overwriteClasses) {
            var idx, data, el, retrievedOptions, optionKey, defaults = $17.fn.buttonMarkup.defaults;
            for(idx = 0; idx < this.length; idx++){
                if (el = this[idx], data = overwriteClasses ? {
                    alreadyEnhanced: !1,
                    unknownClasses: []
                } : classNameToOptions(el.className), retrievedOptions = $17.extend({
                }, data.alreadyEnhanced ? data.options : {
                }, options), !data.alreadyEnhanced) for(optionKey in defaults)undefined === retrievedOptions[optionKey] && (retrievedOptions[optionKey] = getAttrFixed(el, optionKey.replace(capitalLettersRE, camelCase2Hyphenated)));
                el.className = optionsToClasses($17.extend({
                }, defaults, retrievedOptions), data.unknownClasses).join(" "), "button" !== el.tagName.toLowerCase() && el.setAttribute("role", "button");
            }
            return this;
        }, $17.fn.buttonMarkup.defaults = {
            icon: "",
            iconpos: "left",
            theme: null,
            inline: !1,
            shadow: !0,
            corners: !0,
            iconshadow: !1,
            mini: !1
        }, $17.extend($17.fn.buttonMarkup, {
            initSelector: "a:jqmData(role='button'), .ui-bar > a, .ui-bar > :jqmData(role='controlgroup') > a, button"
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.controlgroup", $17.extend({
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
                $17.fn.buttonMarkup && this.element.find($17.fn.buttonMarkup.initSelector).buttonMarkup(), $17.each(this._childWidgets, $17.proxy(function(number, widgetName) {
                    $17.mobile[widgetName] && this.element.find($17.mobile[widgetName].initSelector).not($17.mobile.page.prototype.keepNativeSelector())[widgetName]();
                }, this)), $17.extend(this, {
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
                return ui.groupLegend.length > 0 && $17("<div role='heading' class='ui-controlgroup-label'></div>").append(ui.groupLegend).prependTo(elem), ui;
            },
            _init: function() {
                this.refresh();
            },
            _setOptions: function(options) {
                var callRefresh, returnValue, elem = this.element;
                return undefined !== options.type && (elem.removeClass("ui-controlgroup-horizontal ui-controlgroup-vertical").addClass("ui-controlgroup-" + ("horizontal" === options.type ? "horizontal" : "vertical")), callRefresh = !0), undefined !== options.theme && elem.removeClass(this._themeClassFromOption(this.options.theme)).addClass(this._themeClassFromOption(options.theme)), undefined !== options.corners && elem.toggleClass("ui-corner-all", options.corners), undefined !== options.mini && elem.toggleClass("ui-mini", options.mini), undefined !== options.shadow && this._ui.childWrapper.toggleClass("ui-shadow", options.shadow), undefined !== options.excludeInvisible && (this.options.excludeInvisible = options.excludeInvisible, callRefresh = !0), returnValue = this._super(options), callRefresh && this.refresh(), returnValue;
            },
            container: function() {
                return this._ui.childWrapper;
            },
            refresh: function() {
                var $el = this.container(), els = $el.find(".ui-btn").not(".ui-slider-handle"), create = this._initialRefresh;
                $17.mobile.checkboxradio && $el.find(":mobile-checkboxradio").checkboxradio("refresh"), this._addFirstLastClasses(els, this.options.excludeInvisible ? this._getVisibles(els, create) : els, create), this._initialRefresh = !1;
            },
            _destroy: function() {
                var ui, buttons, opts = this.options;
                if (opts.enhanced) return this;
                ui = this._ui, buttons = this.element.removeClass("ui-controlgroup ui-controlgroup-horizontal ui-controlgroup-vertical ui-corner-all ui-mini " + this._themeClassFromOption(opts.theme)).find(".ui-btn").not(".ui-slider-handle"), this._removeFirstLastClasses(buttons), ui.groupLegend.unwrap(), ui.childWrapper.children().unwrap();
            }
        }, $17.mobile.behaviors.addFirstLastClasses));
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.toolbar", {
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
                })), $17.extend(this, {
                    role: role,
                    page: page,
                    leftbtn: leftbtn,
                    rightbtn: rightbtn
                }), this.element.attr("role", "header" === role ? "banner" : "contentinfo").addClass("ui-" + role), this.refresh(), this._setOptions(this.options);
            },
            _setOptions: function(o) {
                if (undefined !== o.addBackBtn && (this.options.addBackBtn && "header" === this.role && $17(".ui-page").length > 1 && this.page[0].getAttribute("data-" + $17.mobile.ns + "url") !== $17.mobile.path.stripHash(location.hash) && !this.leftbtn ? this._addBackButton() : this.element.find(".ui-toolbar-back-btn").remove()), null != o.backBtnTheme && this.element.find(".ui-toolbar-back-btn").addClass("ui-btn ui-btn-" + o.backBtnTheme), undefined !== o.backBtnText && this.element.find(".ui-toolbar-back-btn .ui-btn-text").text(o.backBtnText), undefined !== o.theme) {
                    var currentTheme = this.options.theme ? this.options.theme : "inherit", newTheme = o.theme ? o.theme : "inherit";
                    this.element.removeClass("ui-bar-" + currentTheme).addClass("ui-bar-" + newTheme);
                }
                this._super(o);
            },
            refresh: function() {
                "header" === this.role && this._addHeaderButtonClasses(), this.page || (this._setRelative(), "footer" === this.role && this.element.appendTo("body")), this._addHeadingClasses(), this._btnMarkup();
            },
            _setRelative: function() {
                $17("[data-" + $17.mobile.ns + "role='page']").css({
                    position: "relative"
                });
            },
            _btnMarkup: function() {
                this.element.children("a").filter(":not([data-" + $17.mobile.ns + "role='none'])").attr("data-" + $17.mobile.ns + "role", "button"), this.element.trigger("create");
            },
            _addHeaderButtonClasses: function() {
                var $headeranchors = this.element.children("a, button");
                this.leftbtn = $headeranchors.hasClass("ui-btn-left"), this.rightbtn = $headeranchors.hasClass("ui-btn-right"), this.leftbtn = this.leftbtn || $headeranchors.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length, this.rightbtn = this.rightbtn || $headeranchors.eq(1).addClass("ui-btn-right").length;
            },
            _addBackButton: function() {
                var options = this.options, theme = options.backBtnTheme || options.theme;
                $17("<a role='button' href='javascript:void(0);' class='ui-btn ui-corner-all ui-shadow ui-btn-left " + (theme ? "ui-btn-" + theme + " " : "") + "ui-toolbar-back-btn ui-icon-carat-l ui-btn-icon-left' data-" + $17.mobile.ns + "rel='back'>" + options.backBtnText + "</a>").prependTo(this.element);
            },
            _addHeadingClasses: function() {
                this.element.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({
                    role: "heading",
                    "aria-level": "1"
                });
            }
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.toolbar", $17.mobile.toolbar, {
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
                    return !$17.support.fixedPosition;
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
                    var $page = this.page ? this.page : $17(".ui-page-active").length > 0 ? $17(".ui-page-active") : $17(".ui-page").eq(0);
                    undefined !== o.fullscreen && (o.fullscreen ? (this.element.addClass("ui-" + this.role + "-fullscreen"), $page.addClass("ui-page-" + this.role + "-fullscreen")) : (this.element.removeClass("ui-" + this.role + "-fullscreen"), $page.removeClass("ui-page-" + this.role + "-fullscreen").addClass("ui-page-" + this.role + "-fixed")));
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
                o.disablePageZoom && $17.mobile.zoom.disable(!0), o.visibleOnPageShow || this.hide(!0);
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
                o.disablePageZoom && $17.mobile.zoom.enable(!0), o.updatePagePadding && this._off(this.window, "throttledresize"), o.trackPersistentToolbars && (thisFooter = $17(".ui-footer-fixed:jqmData(id)", this.page), thisHeader = $17(".ui-header-fixed:jqmData(id)", this.page), nextFooter = thisFooter.length && ui.nextPage && $17(".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData("id") + "')", ui.nextPage) || $17(), nextHeader = thisHeader.length && ui.nextPage && $17(".ui-header-fixed:jqmData(id='" + thisHeader.jqmData("id") + "')", ui.nextPage) || $17(), (nextFooter.length || nextHeader.length) && (nextFooter.add(nextHeader).appendTo($17.mobile.pageContainer), ui.nextPage.one("pageshow", function() {
                    nextHeader.prependTo(this), nextFooter.appendTo(this);
                })));
            },
            _visible: !0,
            updatePagePadding: function(tbPage) {
                var $el = this.element, header = "header" === this.role, pos = parseFloat($el.css(header ? "top" : "bottom"));
                this.options.fullscreen || (tbPage = tbPage && undefined === tbPage.type && tbPage || this.page || $el.closest(".ui-page"), $17(tbPage = this.page ? this.page : ".ui-page-active").css("padding-" + (header ? "top" : "bottom"), $el.outerHeight() + pos));
            },
            _useTransition: function(notransition) {
                var $win = this.window, $el = this.element, scroll = $win.scrollTop(), elHeight = $el.height(), pHeight = this.page ? $el.closest(".ui-page").height() : $17(".ui-page-active").height(), viewportHeight = $17.mobile.getScreenHeight();
                return !notransition && (this.options.transition && "none" !== this.options.transition && ("header" === this.role && !this.options.fullscreen && scroll > elHeight || "footer" === this.role && !this.options.fullscreen && scroll + viewportHeight < pHeight - elHeight) || this.options.fullscreen);
            },
            show: function(notransition) {
                var $el = this.element;
                this._useTransition(notransition) ? $el.removeClass("out ui-fixed-hidden").addClass("in").animationComplete(function() {
                    $el.removeClass("in");
                }) : $el.removeClass("ui-fixed-hidden"), this._visible = !0;
            },
            hide: function(notransition) {
                var $el = this.element, outclass = "out" + ("slide" === this.options.transition ? " reverse" : "");
                this._useTransition(notransition) ? $el.addClass(outclass).removeClass("in").animationComplete(function() {
                    $el.addClass("ui-fixed-hidden").removeClass(outclass);
                }) : $el.addClass("ui-fixed-hidden").removeClass(outclass), this._visible = !1;
            },
            toggle: function() {
                this[this._visible ? "hide" : "show"]();
            },
            _bindToggleHandlers: function() {
                var delayShow, delayHide, self = this, o = self.options, isVisible = !0;
                (this.page ? this.page : $17(".ui-page")).bind("vclick", function(e) {
                    o.tapToggle && !$17(e.target).closest(o.tapToggleBlacklist).length && self.toggle();
                }).bind("focusin focusout", function(e) {
                    screen.width < 1025 && $17(e.target).is(o.hideDuringFocus) && !$17(e.target).closest(".ui-header-fixed, .ui-footer-fixed").length && ("focusout" !== e.type || isVisible ? "focusin" === e.type && isVisible && (clearTimeout(delayShow), isVisible = !1, delayHide = setTimeout(function() {
                        self.hide();
                    }, 0)) : (isVisible = !0, clearTimeout(delayHide), delayShow = setTimeout(function() {
                        self.show();
                    }, 0)));
                });
            },
            _setRelative: function() {
                "fixed" !== this.options.position && $17("[data-" + $17.mobile.ns + "role='page']").css({
                    position: "relative"
                });
            },
            _destroy: function() {
                var $el = this.element, header = $el.hasClass("ui-header");
                $el.closest(".ui-page").css("padding-" + (header ? "top" : "bottom"), ""), $el.removeClass("ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden"), $el.closest(".ui-page").removeClass("ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen");
            }
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.toolbar", $17.mobile.toolbar, {
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
                var paddingBottom = parseFloat($17(".ui-page-active").css("padding-bottom"));
                $17(".ui-page-active").css("padding-bottom", paddingBottom + 1 + "px"), setTimeout(function() {
                    $17(".ui-page-active").css("padding-bottom", paddingBottom + "px");
                }, 0);
            },
            destroy: function() {
                this._super(), this.element.closest(".ui-page-active").removeClass("ui-android-2x-fix");
            }
        });
    })(jQuery), (function($17, undefined) {
        var ieHack = $17.mobile.browser.oldIE && $17.mobile.browser.oldIE <= 8, uiTemplate = $17("<div class='ui-popup-arrow-guide'></div><div class='ui-popup-arrow-container" + (ieHack ? " ie" : "") + "'><div class='ui-popup-arrow'></div></div>");
        function getArrow() {
            var clone = uiTemplate.clone(), gd = clone.eq(0), ct = clone.eq(1), ar = ct.children();
            return {
                arEls: ct.add(gd),
                gd: gd,
                ct: ct,
                ar: ar
            };
        }
        $17.widget("mobile.popup", $17.mobile.popup, {
            options: {
                arrow: ""
            },
            _create: function() {
                var ret = this._super();
                return this.options.arrow && (this._ui.arrow = this._addArrow()), ret;
            },
            _addArrow: function() {
                var theme, opts = this.options, ar = getArrow();
                return theme = this._themeClassFromOption("ui-body-", opts.theme), ar.ar.addClass(theme + (opts.shadow ? " ui-overlay-shadow" : "")), ar.arEls.hide().appendTo(this.element), ar;
            },
            _unenhance: function() {
                var ar = this._ui.arrow;
                return ar && ar.arEls.remove(), this._super();
            },
            _tryAnArrow: function(p, dir, desired, s, best) {
                var result, r, diff, desiredForArrow = {
                }, tip = {
                };
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
                return ar ? (ar.arEls.show(), bgRef = {
                }, params = {
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
                }, $17.each((!0 === optionValue ? "l,t,r,b" : optionValue).split(","), $17.proxy(function(key, value) {
                    best = this._tryAnArrow(params[value], value, desired, state, best);
                }, this)), best) ? (ar.ct.removeClass("ui-popup-arrow-l ui-popup-arrow-t ui-popup-arrow-r ui-popup-arrow-b").addClass("ui-popup-arrow-" + best.dir).removeAttr("style").css(best.posProp, best.posVal).show(), ieHack || (elOffset = this.element.offset(), bgRef[params[best.dir].fst] = ar.ct.offset(), bgRef[params[best.dir].snd] = {
                    left: elOffset.left + state.contentBox.x,
                    top: elOffset.top + state.contentBox.y
                }), best.result) : (ar.arEls.hide(), this._super(desired)) : this._super(desired);
            },
            _setOptions: function(opts) {
                var newTheme, oldTheme = this.options.theme, ar = this._ui.arrow, ret = this._super(opts);
                if (undefined !== opts.arrow) {
                    if (!ar && opts.arrow) return void (this._ui.arrow = this._addArrow());
                    ar && !opts.arrow && (ar.arEls.remove(), this._ui.arrow = null);
                }
                return (ar = this._ui.arrow) && (undefined !== opts.theme && (oldTheme = this._themeClassFromOption("ui-body-", oldTheme), newTheme = this._themeClassFromOption("ui-body-", opts.theme), ar.ar.removeClass(oldTheme).addClass(newTheme)), undefined !== opts.shadow && ar.ar.toggleClass("ui-overlay-shadow", opts.shadow)), ret;
            },
            _destroy: function() {
                var ar = this._ui.arrow;
                return ar && ar.arEls.remove(), this._super();
            }
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.panel", {
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
                $17.extend(this, {
                    _closeLink: el.find(":jqmData(rel='close')"),
                    _parentPage: parentPage.length > 0 && parentPage,
                    _openedPage: null,
                    _page: this._getPage,
                    _panelInner: this._getPanelInner(),
                    _fixedToolbars: this._getFixedToolbars
                }), "overlay" !== this.options.display && this._getWrapper(), this._addPanelClasses(), $17.support.cssTransform3d && this.options.animate && this.element.addClass(this.options.classes.animate), this._bindUpdateLayout(), this._bindCloseEvents(), this._bindLinkListeners(), this._bindPageEvents(), this.options.dismissible && this._createModal(), this._bindSwipeEvents();
            },
            _getPanelInner: function() {
                var panelInner = this.element.find("." + this.options.classes.panelInner);
                return 0 === panelInner.length && (panelInner = this.element.children().wrapAll("<div class='" + this.options.classes.panelInner + "' />").parent()), panelInner;
            },
            _createModal: function() {
                var self = this, target = self._parentPage ? self._parentPage.parent() : self.element.parent();
                self._modal = $17("<div class='" + self.options.classes.modal + "'></div>").on("mousedown", function() {
                    self.close();
                }).appendTo(target);
            },
            _getPage: function() {
                return this._openedPage || this._parentPage || $17("." + $17.mobile.activePageClass);
            },
            _getWrapper: function() {
                var wrapper = this._page().find("." + this.options.classes.pageWrapper);
                0 === wrapper.length && (wrapper = this._page().children(".ui-header:not(.ui-header-fixed), .ui-content:not(.ui-popup), .ui-footer:not(.ui-footer-fixed)").wrapAll("<div class='" + this.options.classes.pageWrapper + "'></div>").parent()), this._wrapper = wrapper;
            },
            _getFixedToolbars: function() {
                var extFixedToolbars = $17("body").children(".ui-header-fixed, .ui-footer-fixed"), intFixedToolbars = this._page().find(".ui-header-fixed, .ui-footer-fixed");
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
            _handleCloseClickAndEatEvent: function(event) {
                if (!event.isDefaultPrevented()) return event.preventDefault(), this.close(), !1;
            },
            _handleCloseClick: function(event) {
                event.isDefaultPrevented() || this.close();
            },
            _bindCloseEvents: function() {
                this._on(this._closeLink, {
                    click: "_handleCloseClick"
                }), this._on({
                    "click a:jqmData(ajax='false')": "_handleCloseClick"
                });
            },
            _positionPanel: function(scrollToTop) {
                var panelInnerHeight = this._panelInner.outerHeight(), expand = panelInnerHeight > $17.mobile.getScreenHeight();
                expand || !this.options.positionFixed ? (expand && (this._unfixPanel(), $17.mobile.resetActivePageHeight(panelInnerHeight)), scrollToTop && this.window[0].scrollTo(0, $17.mobile.defaultHomeScroll)) : this._fixPanel();
            },
            _bindFixListener: function() {
                this._on($17(window), {
                    throttledresize: "_positionPanel"
                });
            },
            _unbindFixListener: function() {
                this._off($17(window), "throttledresize");
            },
            _unfixPanel: function() {
                this.options.positionFixed && $17.support.fixedPosition && this.element.removeClass(this.options.classes.panelFixed);
            },
            _fixPanel: function() {
                this.options.positionFixed && $17.support.fixedPosition && this.element.addClass(this.options.classes.panelFixed);
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
                if (e.currentTarget.href.split("#")[1] === panelId && void 0 !== panelId) return e.preventDefault(), (link = $17(e.target)).hasClass("ui-btn") && (link.addClass($17.mobile.activeBtnClass), this.element.one("panelopen panelclose", function() {
                    link.removeClass($17.mobile.activeBtnClass);
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
                    var self1 = this, o = self1.options, _openPanel = function() {
                        self1.document.off("panelclose"), self1._page().jqmData("panel", "open"), $17.support.cssTransform3d && o.animate && "overlay" !== o.display && (self1._wrapper.addClass(o.classes.animate), self1._fixedToolbars().addClass(o.classes.animate)), !immediate && $17.support.cssTransform3d && o.animate ? self1.element.animationComplete(complete, "transition") : setTimeout(complete, 0), o.theme && "overlay" !== o.display && self1._page().parent().addClass(o.classes.pageContainer + "-themed " + o.classes.pageContainer + "-" + o.theme), self1.element.removeClass(o.classes.panelClosed).addClass(o.classes.panelOpen), self1._positionPanel(!0), self1._pageContentOpenClasses = self1._getPosDisplayClasses(o.classes.pageContentPrefix), "overlay" !== o.display && (self1._page().parent().addClass(o.classes.pageContainer), self1._wrapper.addClass(self1._pageContentOpenClasses), self1._fixedToolbars().addClass(self1._pageContentOpenClasses)), self1._modalOpenClasses = self1._getPosDisplayClasses(o.classes.modal) + " " + o.classes.modalOpen, self1._modal && self1._modal.addClass(self1._modalOpenClasses).height(Math.max(self1._modal.height(), self1.document.height()));
                    }, complete = function() {
                        "overlay" !== o.display && (self1._wrapper.addClass(o.classes.pageContentPrefix + "-open"), self1._fixedToolbars().addClass(o.classes.pageContentPrefix + "-open")), self1._bindFixListener(), self1._trigger("open"), self1._openedPage = self1._page();
                    };
                    self1._trigger("beforeopen"), "open" === self1._page().jqmData("panel") ? self1.document.on("panelclose", function() {
                        _openPanel();
                    }) : _openPanel(), self1._open = !0;
                }
            },
            close: function(immediate) {
                if (this._open) {
                    var self2 = this, o = this.options, _closePanel = function() {
                        self2.element.removeClass(o.classes.panelOpen), "overlay" !== o.display && (self2._wrapper.removeClass(self2._pageContentOpenClasses), self2._fixedToolbars().removeClass(self2._pageContentOpenClasses)), !immediate && $17.support.cssTransform3d && o.animate ? self2.element.animationComplete(complete, "transition") : setTimeout(complete, 0), self2._modal && self2._modal.removeClass(self2._modalOpenClasses);
                    }, complete = function() {
                        o.theme && "overlay" !== o.display && self2._page().parent().removeClass(o.classes.pageContainer + "-themed " + o.classes.pageContainer + "-" + o.theme), self2.element.addClass(o.classes.panelClosed), "overlay" !== o.display && (self2._page().parent().removeClass(o.classes.pageContainer), self2._wrapper.removeClass(o.classes.pageContentPrefix + "-open"), self2._fixedToolbars().removeClass(o.classes.pageContentPrefix + "-open")), $17.support.cssTransform3d && o.animate && "overlay" !== o.display && (self2._wrapper.removeClass(o.classes.animate), self2._fixedToolbars().removeClass(o.classes.animate)), self2._fixPanel(), self2._unbindFixListener(), $17.mobile.resetActivePageHeight(), self2._page().jqmRemoveData("panel"), self2._trigger("close"), self2._openedPage = null;
                    };
                    self2._trigger("beforeclose"), _closePanel(), self2._open = !1;
                }
            },
            toggle: function() {
                this[this._open ? "close" : "open"]();
            },
            _destroy: function() {
                var o = this.options, multiplePanels = $17("body > :mobile-panel").length + $17.mobile.activePage.find(":mobile-panel").length > 1;
                "overlay" !== o.display && (0 === $17("body > :mobile-panel").add($17.mobile.activePage.find(":mobile-panel")).not(".ui-panel-display-overlay").not(this.element).length && this._wrapper.children().unwrap(), this._open && (this._fixedToolbars().removeClass(o.classes.pageContentPrefix + "-open"), $17.support.cssTransform3d && o.animate && this._fixedToolbars().removeClass(o.classes.animate), this._page().parent().removeClass(o.classes.pageContainer), o.theme && this._page().parent().removeClass(o.classes.pageContainer + "-themed " + o.classes.pageContainer + "-" + o.theme))), multiplePanels || this.document.off("panelopen panelclose"), this._open && this._page().jqmRemoveData("panel"), this._panelInner.children().unwrap(), this.element.removeClass([
                    this._getPanelClasses(),
                    o.classes.panelOpen,
                    o.classes.animate
                ].join(" ")).off("swipeleft.panel swiperight.panel").off("panelbeforeopen").off("panelhide").off("keyup.panel").off("updatelayout"), this._modal && this._modal.remove();
            }
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.table", {
            options: {
                classes: {
                    table: "ui-table"
                },
                enhanced: !1
            },
            _create: function() {
                this.options.enhanced || this.element.addClass(this.options.classes.table), $17.extend(this, {
                    headers: undefined,
                    allHeaders: undefined
                }), this._refresh(!0);
            },
            _setHeaders: function() {
                var trs = this.element.find("thead tr");
                this.headers = this.element.find("tr:eq(0)").children(), this.allHeaders = this.headers.add(trs.children());
            },
            refresh: function() {
                this._refresh();
            },
            rebuild: $17.noop,
            _refresh: function() {
                var table = this.element, trs = table.find("thead tr");
                this._setHeaders(), trs.each(function() {
                    var columnCount = 0;
                    $17(this).children().each(function() {
                        var j, span = parseInt(this.getAttribute("colspan"), 10), selector = ":nth-child(" + (columnCount + 1) + ")";
                        if (this.setAttribute("data-" + $17.mobile.ns + "colstart", columnCount + 1), span) for(j = 0; j < span - 1; j++)columnCount++, selector += ", :nth-child(" + (columnCount + 1) + ")";
                        $17(this).jqmData("cells", table.find("tr").not(trs.eq(0)).not(this).children(selector)), columnCount++;
                    });
                });
            }
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.table", $17.mobile.table, {
            options: {
                mode: "columntoggle",
                columnBtnTheme: null,
                columnPopupTheme: null,
                columnBtnText: "Columns...",
                classes: $17.extend($17.mobile.table.prototype.options.classes, {
                    popup: "ui-table-columntoggle-popup",
                    columnBtn: "ui-table-columntoggle-btn",
                    priorityPrefix: "ui-table-priority-",
                    columnToggleTable: "ui-table-columntoggle"
                })
            },
            _create: function() {
                this._super(), "columntoggle" === this.options.mode && ($17.extend(this, {
                    _menu: null
                }), this.options.enhanced ? (this._menu = $17(this.document[0].getElementById(this._id() + "-popup")).children().first(), this._addToggles(this._menu, !0)) : (this._menu = this._enhanceColToggle(), this.element.addClass(this.options.classes.columnToggleTable)), this._setupEvents(), this._setToggleState());
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
                    var header = $17(this), priority = $17.mobile.getAttribute(this, "priority"), cells = header.add(header.jqmData("cells"));
                    priority && (cells.addClass(opts.classes.priorityPrefix + priority), (keep ? inputs.eq(checkboxIndex++) : $17("<label><input type='checkbox' checked />" + (header.children("abbr").first().attr("title") || header.text()) + "</label>").appendTo(container).children(0).checkboxradio({
                        theme: opts.columnPopupTheme
                    })).jqmData("cells", cells));
                }), keep || menu.controlgroup("refresh");
            },
            _menuInputChange: function(evt) {
                var input = $17(evt.target), checked = input[0].checked;
                input.jqmData("cells").toggleClass("ui-table-cell-hidden", !checked).toggleClass("ui-table-cell-visible", checked), input[0].getAttribute("locked") ? (input.removeAttr("locked"), this._unlockCells(input.jqmData("cells"))) : input.attr("locked", !0);
            },
            _unlockCells: function(cells) {
                cells.removeClass("ui-table-cell-hidden ui-table-cell-visible");
            },
            _enhanceColToggle: function() {
                var id, menuButton, popup, menu, table = this.element, opts = this.options, ns = $17.mobile.ns, fragment = this.document[0].createDocumentFragment();
                return menuButton = $17("<a href='#" + (id = this._id() + "-popup") + "' class='" + opts.classes.columnBtn + " ui-btn ui-btn-" + (opts.columnBtnTheme || "a") + " ui-corner-all ui-shadow ui-mini' data-" + ns + "rel='popup'>" + opts.columnBtnText + "</a>"), popup = $17("<div class='" + opts.classes.popup + "' id='" + id + "'></div>"), menu = $17("<fieldset></fieldset>").controlgroup(), this._addToggles(menu, !1), menu.appendTo(popup), fragment.appendChild(popup[0]), fragment.appendChild(menuButton[0]), table.before(fragment), popup.popup(), menu;
            },
            rebuild: function() {
                this._super(), "columntoggle" === this.options.mode && this._refresh(!1);
            },
            _refresh: function(create) {
                this._super(create), create || "columntoggle" !== this.options.mode || (this._unlockCells(this.element.find(".ui-table-cell-hidden, .ui-table-cell-visible")), this._addToggles(this._menu, create), this._setToggleState());
            },
            _setToggleState: function() {
                this._menu.find("input").each(function() {
                    var checkbox = $17(this);
                    this.checked = "table-cell" === checkbox.jqmData("cells").eq(0).css("display"), checkbox.checkboxradio("refresh");
                });
            },
            _destroy: function() {
                this._super();
            }
        });
    })(jQuery), (function($17, undefined) {
        $17.widget("mobile.table", $17.mobile.table, {
            options: {
                mode: "reflow",
                classes: $17.extend($17.mobile.table.prototype.options.classes, {
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
                $17(table.allHeaders.get().reverse()).each(function() {
                    var iteration, filter, cells = $17(this).jqmData("cells"), colstart = $17.mobile.getAttribute(this, "colstart"), hierarchyClass = cells.not(this).filter("thead th").length && " ui-table-cell-label-top", text = $17(this).text();
                    "" !== text && (hierarchyClass ? (filter = "", (iteration = parseInt(this.getAttribute("colspan"), 10)) && (filter = "td:nth-child(" + iteration + "n + " + colstart + ")"), table._addLabels(cells.filter(filter), opts.classes.cellLabels + hierarchyClass, text)) : table._addLabels(cells, opts.classes.cellLabels, text));
                });
            },
            _addLabels: function(cells, label, text) {
                cells.not(":has(b." + label + ")").prepend("<b class='" + label + "'>" + text + "</b>");
            }
        });
    })(jQuery), (function($17, undefined) {
        var defaultFilterCallback = function(index, searchValue) {
            return -1 === ("" + ($17.mobile.getAttribute(this, "filtertext") || $17(this).text())).toLowerCase().indexOf(searchValue);
        };
        $17.widget("mobile.filterable", {
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
                $17.extend(this, {
                    _search: null,
                    _timer: 0
                }), this._setInput(opts.input), opts.enhanced || this._filterItems((this._search && this._search.val() || "").toLowerCase());
            },
            _onKeyUp: function() {
                var val, lastval, search = this._search;
                !search || (val = search.val().toLowerCase(), (lastval = $17.mobile.getAttribute(search[0], "lastval") + "") && lastval === val || (this._timer && (window.clearTimeout(this._timer), this._timer = 0), this._timer = this._delay(function() {
                    this._trigger("beforefilter", null, {
                        input: search
                    }), search[0].setAttribute("data-" + $17.mobile.ns + "lastval", val), this._filterItems(val), this._timer = 0;
                }, 250)));
            },
            _getFilterableItems: function() {
                var children = this.options.children, items = children ? $17.isFunction(children) ? children() : children.nodeName ? $17(children) : children.jquery ? children : this.element.find(children) : {
                    length: 0
                };
                return 0 === items.length && (items = this.element.children()), items;
            },
            _filterItems: function(val) {
                var idx, callback, length, show = [], hide = [], opts = this.options, filterItems = this._getFilterableItems();
                if (null != val) for(idx = 0, callback = opts.filterCallback || defaultFilterCallback, length = filterItems.length; idx < length; idx++)(callback.call(filterItems[idx], idx, val) ? hide : show).push(filterItems[idx]);
                0 === hide.length ? filterItems[opts.filterReveal ? "addClass" : "removeClass"]("ui-screen-hidden") : ($17(hide).addClass("ui-screen-hidden"), $17(show).removeClass("ui-screen-hidden")), this._refreshChildWidget(), this._trigger("filter", null, {
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
                for(idx = recognizedWidgets.length - 1; idx > -1; idx--)widget = recognizedWidgets[idx], $17.mobile[widget] && (widget = this.element.data("mobile-" + widget)) && $17.isFunction(widget.refresh) && widget.refresh();
            },
            _setInput: function(selector) {
                var search = this._search;
                this._timer && (window.clearTimeout(this._timer), this._timer = 0), search && (this._off(search, "keyup change input"), search = null), selector && (search = selector.jquery ? selector : selector.nodeName ? $17(selector) : this.document.find(selector), this._on(search, {
                    keyup: "_onKeyUp",
                    change: "_onKeyUp",
                    input: "_onKeyUp"
                })), this._search = search;
            },
            _setOptions: function(options) {
                var refilter = !(undefined === options.filterReveal && undefined === options.filterCallback && undefined === options.children);
                this._super(options), undefined !== options.input && (this._setInput(options.input), refilter = !0), refilter && this.refresh();
            },
            _destroy: function() {
                var opts = this.options, items = this._getFilterableItems();
                opts.enhanced ? items.toggleClass("ui-screen-hidden", opts.filterReveal) : items.removeClass("ui-screen-hidden");
            },
            refresh: function() {
                this._timer && (window.clearTimeout(this._timer), this._timer = 0), this._filterItems((this._search && this._search.val() || "").toLowerCase());
            }
        });
    })(jQuery), rDividerListItem = /(^|\s)ui-li-divider(\s|$)/, origDefaultFilterCallback = ($16 = jQuery).mobile.filterable.prototype.options.filterCallback, $16.mobile.filterable.prototype.options.filterCallback = function(index, searchValue) {
        return !this.className.match(rDividerListItem) && origDefaultFilterCallback.call(this, index, searchValue);
    }, $16.widget("mobile.filterable", $16.mobile.filterable, {
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
            ], createHandlers = {
            };
            for(this._super(), $16.extend(this, {
                _widget: null
            }), idx = recognizedWidgets.length - 1; idx > -1; idx--)if (widgetName = recognizedWidgets[idx], $16.mobile[widgetName]) {
                if (this._setWidget(elem.data("mobile-" + widgetName))) break;
                createHandlers[widgetName + "create"] = "_handleCreate";
            }
            this._widget || this._on(elem, createHandlers);
        },
        _handleCreate: function(evt) {
            this._setWidget(this.element.data("mobile-" + evt.type.substring(0, evt.type.length - 6)));
        },
        _trigger: function(type, event, data) {
            this._widget && "mobile-listview" === this._widget.widgetFullName && "beforefilter" === type && this._widget._trigger("beforefilter", event, data), this._super(type, event, data);
        },
        _setWidget: function(widget) {
            if (!this._widget && widget) {
                var self3, orig;
                this._widget = widget, self3 = this, this._widget._setOptions = function(options) {
                    (orig = this._widget._setOptions).call(this, options), self3._syncTextInputOptions(options);
                };
            }
            return this._widget && (this._syncTextInputOptions(this._widget.options), "listview" === this._widget.widgetName && (this._widget.options.hideDividers = !0, this._widget.element.listview("refresh"))), !!this._widget;
        },
        _isSearchInternal: function() {
            return this._search && this._search.jqmData("ui-filterable-" + this.uuid + "-internal");
        },
        _setInput: function(selector) {
            var opts = this.options, updatePlaceholder = !0, textinputOpts = {
            };
            selector || !this._isSearchInternal() && (updatePlaceholder = !1, selector = $16("<input data-" + $16.mobile.ns + "type='search' placeholder='" + opts.filterPlaceholder + "'></input>").jqmData("ui-filterable-" + this.uuid + "-internal", !0), $16("<form class='ui-filterable'></form>").append(selector).submit(function(evt) {
                evt.preventDefault(), selector.blur();
            }).insertBefore(this.element), $16.mobile.textinput && (null != this.options.filterTheme && (textinputOpts.theme = opts.filterTheme), selector.textinput(textinputOpts))), this._super(selector), this._isSearchInternal() && updatePlaceholder && this._search.attr("placeholder", this.options.filterPlaceholder);
        },
        _setOptions: function(options) {
            var ret = this._super(options);
            return undefined !== options.filterPlaceholder && this._isSearchInternal() && this._search.attr("placeholder", options.filterPlaceholder), undefined !== options.filterTheme && this._search && $16.mobile.textinput && this._search.textinput("option", "theme", options.filterTheme), ret;
        },
        _destroy: function() {
            this._isSearchInternal() && this._search.remove(), this._super();
        },
        _syncTextInputOptions: function(options) {
            var idx, textinputOptions = {
            };
            if (this._isSearchInternal() && $16.mobile.textinput) {
                for(idx in $16.mobile.textinput.prototype.options)undefined !== options[idx] && ("theme" === idx && null != this.options.filterTheme ? textinputOptions[idx] = this.options.filterTheme : textinputOptions[idx] = options[idx]);
                this._search.textinput("option", textinputOptions);
            }
        }
    }), (function($17, undefined) {
        var tabId = 0, rhash = /#.*$/;
        function getNextTabId() {
            return ++tabId;
        }
        function isLocal(anchor) {
            return anchor.hash.length > 1 && decodeURIComponent(anchor.href.replace(rhash, "")) === decodeURIComponent(location.href.replace(rhash, ""));
        }
        $17.widget("ui.tabs", {
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
                this.running = !1, this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", options.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(event) {
                    $17(this).is(".ui-state-disabled") && event.preventDefault();
                }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
                    $17(this).closest("li").is(".ui-state-disabled") && this.blur();
                }), this._processTabs(), options.active = this._initialActive(), $17.isArray(options.disabled) && (options.disabled = $17.unique(options.disabled.concat($17.map(this.tabs.filter(".ui-state-disabled"), function(li) {
                    return that.tabs.index(li);
                }))).sort()), !1 !== this.options.active && this.anchors.length ? this.active = this._findActive(options.active) : this.active = $17(), this._refresh(), this.active.length && this.load(options.active);
            },
            _initialActive: function() {
                var active = this.options.active, collapsible = this.options.collapsible, locationHash = location.hash.substring(1);
                return null === active && (locationHash && this.tabs.each(function(i, tab) {
                    if ($17(tab).attr("aria-controls") === locationHash) return active = i, !1;
                }), null === active && (active = this.tabs.index(this.tabs.filter(".ui-tabs-active"))), (null === active || -1 === active) && (active = !!this.tabs.length && 0)), !1 !== active && -1 === (active = this.tabs.index(this.tabs.eq(active))) && (active = !collapsible && 0), !collapsible && !1 === active && this.anchors.length && (active = 0), active;
            },
            _getCreateEventData: function() {
                return {
                    tab: this.active,
                    panel: this.active.length ? this._getPanelForTab(this.active) : $17()
                };
            },
            _tabKeydown: function(event) {
                var focusedTab = $17(this.document[0].activeElement).closest("li"), selectedIndex = this.tabs.index(focusedTab), goingForward = !0;
                if (!this._handlePageNav(event)) {
                    switch(event.keyCode){
                        case $17.ui.keyCode.RIGHT:
                        case $17.ui.keyCode.DOWN:
                            selectedIndex++;
                            break;
                        case $17.ui.keyCode.UP:
                        case $17.ui.keyCode.LEFT:
                            goingForward = !1, selectedIndex--;
                            break;
                        case $17.ui.keyCode.END:
                            selectedIndex = this.anchors.length - 1;
                            break;
                        case $17.ui.keyCode.HOME:
                            selectedIndex = 0;
                            break;
                        case $17.ui.keyCode.SPACE:
                            return event.preventDefault(), clearTimeout(this.activating), void this._activate(selectedIndex);
                        case $17.ui.keyCode.ENTER:
                            return event.preventDefault(), clearTimeout(this.activating), void this._activate(selectedIndex !== this.options.active && selectedIndex);
                        default:
                            return;
                    }
                    event.preventDefault(), clearTimeout(this.activating), selectedIndex = this._focusNextTab(selectedIndex, goingForward), event.ctrlKey || (focusedTab.attr("aria-selected", "false"), this.tabs.eq(selectedIndex).attr("aria-selected", "true"), this.activating = this._delay(function() {
                        this.option("active", selectedIndex);
                    }, this.delay));
                }
            },
            _panelKeydown: function(event) {
                !this._handlePageNav(event) && event.ctrlKey && event.keyCode === $17.ui.keyCode.UP && (event.preventDefault(), this.active.focus());
            },
            _handlePageNav: function(event) {
                return event.altKey && event.keyCode === $17.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0) : event.altKey && event.keyCode === $17.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0) : void 0;
            },
            _findNextTab: function(index, goingForward) {
                var lastTabIndex = this.tabs.length - 1;
                function constrain() {
                    return index > lastTabIndex && (index = 0), index < 0 && (index = lastTabIndex), index;
                }
                for(; -1 !== $17.inArray(constrain(), this.options.disabled);)index = goingForward ? index + 1 : index - 1;
                return index;
            },
            _focusNextTab: function(index, goingForward) {
                return index = this._findNextTab(index, goingForward), this.tabs.eq(index).focus(), index;
            },
            _setOption: function(key, value) {
                return "active" === key ? void this._activate(value) : "disabled" === key ? void this._setupDisabled(value) : void (this._super(key, value), "collapsible" !== key || (this.element.toggleClass("ui-tabs-collapsible", value), value || !1 !== this.options.active || this._activate(0)), "event" === key && this._setupEvents(value), "heightStyle" === key && this._setupHeightStyle(value));
            },
            _tabId: function(tab) {
                return tab.attr("aria-controls") || "ui-tabs-" + getNextTabId();
            },
            _sanitizeSelector: function(hash) {
                return hash ? hash.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "";
            },
            refresh: function() {
                var options = this.options, lis = this.tablist.children(":has(a[href])");
                options.disabled = $17.map(lis.filter(".ui-state-disabled"), function(tab) {
                    return lis.index(tab);
                }), this._processTabs(), !1 !== options.active && this.anchors.length ? this.active.length && !$17.contains(this.tablist[0], this.active[0]) ? this.tabs.length === options.disabled.length ? (options.active = !1, this.active = $17()) : this._activate(this._findNextTab(Math.max(0, options.active - 1), !1)) : options.active = this.tabs.index(this.active) : (options.active = !1, this.active = $17()), this._refresh();
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
                    return $17("a", this)[0];
                }).addClass("ui-tabs-anchor").attr({
                    role: "presentation",
                    tabIndex: -1
                }), this.panels = $17(), this.anchors.each(function(i, anchor) {
                    var selector, panel, panelId, anchorId = $17(anchor).uniqueId().attr("id"), tab = $17(anchor).closest("li"), originalAriaControls = tab.attr("aria-controls");
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
                return $17("<div>").attr("id", id).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0);
            },
            _setupDisabled: function(disabled) {
                $17.isArray(disabled) && (disabled.length ? disabled.length === this.anchors.length && (disabled = !0) : disabled = !1);
                for(var li, i = 0; li = this.tabs[i]; i++)!0 === disabled || -1 !== $17.inArray(i, disabled) ? $17(li).addClass("ui-state-disabled").attr("aria-disabled", "true") : $17(li).removeClass("ui-state-disabled").removeAttr("aria-disabled");
                this.options.disabled = disabled;
            },
            _setupEvents: function(event) {
                var events = {
                    click: function(event) {
                        event.preventDefault();
                    }
                };
                event && $17.each(event.split(" "), function(index, eventName) {
                    events[eventName] = "_eventHandler";
                }), this._off(this.anchors.add(this.tabs).add(this.panels)), this._on(this.anchors, events), this._on(this.tabs, {
                    keydown: "_tabKeydown"
                }), this._on(this.panels, {
                    keydown: "_panelKeydown"
                }), this._focusable(this.tabs), this._hoverable(this.tabs);
            },
            _setupHeightStyle: function(heightStyle) {
                var maxHeight;
                "fill" === heightStyle ? (maxHeight = this.element.parent().height(), maxHeight -= this.element.outerHeight() - this.element.height(), this.element.siblings(":visible").each(function() {
                    var elem = $17(this), position = elem.css("position");
                    "absolute" !== position && "fixed" !== position && (maxHeight -= elem.outerHeight(!0));
                }), this.element.children().not(this.panels).each(function() {
                    maxHeight -= $17(this).outerHeight(!0);
                }), this.panels.each(function() {
                    $17(this).height(Math.max(0, maxHeight - $17(this).innerHeight() + $17(this).height()));
                }).css("overflow", "auto")) : "auto" === heightStyle && (maxHeight = 0, this.panels.each(function() {
                    maxHeight = Math.max(maxHeight, $17(this).height("").height());
                }).height(maxHeight));
            },
            _eventHandler: function(event) {
                var options = this.options, active = this.active, tab = $17(event.currentTarget).closest("li"), clickedIsActive = tab[0] === active[0], collapsing = clickedIsActive && options.collapsible, toShow = collapsing ? $17() : this._getPanelForTab(tab), toHide = active.length ? this._getPanelForTab(active) : $17(), eventData = {
                    oldTab: active,
                    oldPanel: toHide,
                    newTab: collapsing ? $17() : tab,
                    newPanel: toShow
                };
                event.preventDefault(), tab.hasClass("ui-state-disabled") || tab.hasClass("ui-tabs-loading") || this.running || clickedIsActive && !options.collapsible || !1 === this._trigger("beforeActivate", event, eventData) || (options.active = !collapsing && this.tabs.index(tab), this.active = clickedIsActive ? $17() : tab, this.xhr && this.xhr.abort(), toHide.length || toShow.length || $17.error("jQuery UI Tabs: Mismatching fragment identifier."), toShow.length && this.load(this.tabs.index(tab), event), this._toggle(event, eventData));
            },
            _toggle: function(event, eventData) {
                var that = this, toShow = eventData.newPanel, toHide = eventData.oldPanel;
                function complete() {
                    that.running = !1, that._trigger("activate", event, eventData);
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
                    return 0 === $17(this).attr("tabIndex");
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
                    preventDefault: $17.noop
                }));
            },
            _findActive: function(index) {
                return !1 === index ? $17() : this.tabs.eq(index);
            },
            _getIndex: function(index) {
                return "string" == typeof index && (index = this.anchors.index(this.anchors.filter("[href$='" + index + "']"))), index;
            },
            _destroy: function() {
                this.xhr && this.xhr.abort(), this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"), this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"), this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(), this.tabs.add(this.panels).each(function() {
                    $17.data(this, "ui-tabs-destroy") ? $17(this).remove() : $17(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role");
                }), this.tabs.each(function() {
                    var li = $17(this), prev = li.data("ui-tabs-aria-controls");
                    prev ? li.attr("aria-controls", prev).removeData("ui-tabs-aria-controls") : li.removeAttr("aria-controls");
                }), this.panels.show(), "content" !== this.options.heightStyle && this.panels.css("height", "");
            },
            enable: function(index) {
                var disabled = this.options.disabled;
                !1 !== disabled && (index === undefined ? disabled = !1 : (index = this._getIndex(index), disabled = $17.isArray(disabled) ? $17.map(disabled, function(num) {
                    return num !== index ? num : null;
                }) : $17.map(this.tabs, function(li, num) {
                    return num !== index ? num : null;
                })), this._setupDisabled(disabled));
            },
            disable: function(index) {
                var disabled = this.options.disabled;
                if (!0 !== disabled) {
                    if (index === undefined) disabled = !0;
                    else {
                        if (index = this._getIndex(index), -1 !== $17.inArray(index, disabled)) return;
                        disabled = $17.isArray(disabled) ? $17.merge([
                            index
                        ], disabled).sort() : [
                            index
                        ];
                    }
                    this._setupDisabled(disabled);
                }
            },
            load: function(index, event) {
                index = this._getIndex(index);
                var that = this, tab = this.tabs.eq(index), anchor = tab.find(".ui-tabs-anchor"), panel = this._getPanelForTab(tab), eventData = {
                    tab: tab,
                    panel: panel
                };
                !isLocal(anchor[0]) && (this.xhr = $17.ajax(this._ajaxSettings(anchor, event, eventData)), this.xhr && "canceled" !== this.xhr.statusText && (tab.addClass("ui-tabs-loading"), panel.attr("aria-busy", "true"), this.xhr.success(function(response) {
                    setTimeout(function() {
                        panel.html(response), that._trigger("load", event, eventData);
                    }, 1);
                }).complete(function(jqXHR, status) {
                    setTimeout(function() {
                        "abort" === status && that.panels.stop(!1, !0), tab.removeClass("ui-tabs-loading"), panel.removeAttr("aria-busy"), jqXHR === that.xhr && delete that.xhr;
                    }, 1);
                })));
            },
            _ajaxSettings: function(anchor, event, eventData) {
                var that = this;
                return {
                    url: anchor.attr("href"),
                    beforeSend: function(jqXHR, settings) {
                        return that._trigger("beforeLoad", event, $17.extend({
                            jqXHR: jqXHR,
                            ajaxSettings: settings
                        }, eventData));
                    }
                };
            },
            _getPanelForTab: function(tab) {
                var id = $17(tab).attr("aria-controls");
                return this.element.find(this._sanitizeSelector("#" + id));
            }
        });
    })(jQuery), (function($17, window) {
        $17.mobile.iosorientationfixEnabled = !0;
        var zoom, evt, x, y, z, aig, ua = navigator.userAgent;
        if (!(/iPhone|iPad|iPod/.test(navigator.platform) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf("AppleWebKit") > -1)) return void ($17.mobile.iosorientationfixEnabled = !1);
        function checkTilt(e) {
            x = Math.abs((aig = (evt = e.originalEvent).accelerationIncludingGravity).x), y = Math.abs(aig.y), z = Math.abs(aig.z), !window.orientation && (x > 7 || (z > 6 && y < 8 || z < 8 && y > 6) && x > 5) ? zoom.enabled && zoom.disable() : zoom.enabled || zoom.enable();
        }
        zoom = $17.mobile.zoom, $17.mobile.document.on("mobileinit", function() {
            $17.mobile.iosorientationfixEnabled && $17.mobile.window.bind("orientationchange.iosorientationfix", zoom.enable).bind("devicemotion.iosorientationfix", checkTilt);
        });
    })(jQuery, this), (function($17, window, undefined) {
        var $html = $17("html"), $window = $17.mobile.window;
        function hideRenderingClass() {
            $html.removeClass("ui-mobile-rendering");
        }
        $17(window.document).trigger("mobileinit"), $17.mobile.gradeA() && ($17.mobile.ajaxBlacklist && ($17.mobile.ajaxEnabled = !1), $html.addClass("ui-mobile ui-mobile-rendering"), setTimeout(hideRenderingClass, 5000), $17.extend($17.mobile, {
            initializePage: function() {
                var path2 = $17.mobile.path, $pages = $17(":jqmData(role='page'), :jqmData(role='dialog')"), hash = path2.stripHash(path2.stripQueryParams(path2.parseLocation().hash)), hashPage = document.getElementById(hash);
                $pages.length || ($pages = $17("body").wrapInner("<div data-" + $17.mobile.ns + "role='page'></div>").children(0)), $pages.each(function() {
                    var $this = $17(this);
                    $this[0].getAttribute("data-" + $17.mobile.ns + "url") || $this.attr("data-" + $17.mobile.ns + "url", $this.attr("id") || location.pathname + location.search);
                }), $17.mobile.firstPage = $pages.first(), $17.mobile.pageContainer = $17.mobile.firstPage.parent().addClass("ui-mobile-viewport").pagecontainer(), $17.mobile.navreadyDeferred.resolve(), $window.trigger("pagecontainercreate"), $17.mobile.loading("show"), hideRenderingClass(), $17.mobile.hashListeningEnabled && $17.mobile.path.isHashValid(location.hash) && ($17(hashPage).is(":jqmData(role='page')") || $17.mobile.path.isPath(hash) || hash === $17.mobile.dialogHashKey) ? $17.event.special.navigate.isPushStateEnabled() ? ($17.mobile.navigate.history.stack = [], $17.mobile.navigate($17.mobile.path.isPath(location.hash) ? location.hash : location.href)) : $window.trigger("hashchange", [
                    !0
                ]) : ($17.mobile.path.isHashValid(location.hash) && ($17.mobile.navigate.history.initialDst = hash.replace("#", "")), $17.event.special.navigate.isPushStateEnabled() && $17.mobile.navigate.navigator.squash(path2.parseLocation().href), $17.mobile.changePage($17.mobile.firstPage, {
                    transition: "none",
                    reverse: !0,
                    changeHash: !1,
                    fromHashChange: !0
                }));
            }
        }), $17(function() {
            $17.support.inlineSVG(), $17.mobile.hideUrlBar && window.scrollTo(0, 1), $17.mobile.defaultHomeScroll = $17.support.scrollTop && 1 !== $17.mobile.window.scrollTop() ? 1 : 0, $17.mobile.autoInitializePage && $17.mobile.initializePage(), $17.mobile.hideUrlBar && $window.load($17.mobile.silentScroll), $17.support.cssPointerEvents || $17.mobile.document.delegate(".ui-state-disabled,.ui-disabled", "vclick", function(e) {
                e.preventDefault(), e.stopImmediatePropagation();
            });
        }));
    })(jQuery, this);
});
