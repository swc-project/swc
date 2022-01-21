"use strict";

function _interopDefault(e) {
    return e && "object" == typeof e && "default" in e ? e["default"] : e
}
var React = _interopDefault(require("react")),
    reactDom = require("react-dom");

function _defaults2(e, t) {
    for (var n = Object.getOwnPropertyNames(t), a = 0; a < n.length; a++) {
        var i = n[a],
            r = Object.getOwnPropertyDescriptor(t, i);
        r && r.configurable && e[i] === undefined && Object.defineProperty(e, i, r)
    }
    return e
}

function _extends() {
    return (_extends = Object.assign || function (e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a])
        }
        return e
    }).apply(this, arguments)
}

function _inheritsLoose(e, t) {
    e.prototype = Object.create(t.prototype), _defaults2(e.prototype.constructor = e, t)
}

function _objectWithoutPropertiesLoose(e, t) {
    if (null == e) return {};
    var n, a, i = {},
        r = Object.keys(e);
    for (a = 0; a < r.length; a++) n = r[a], 0 <= t.indexOf(n) || (i[n] = e[n]);
    return i
}

function _assertThisInitialized(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e
}
var invariant = function (e, t, n, a, i, r, o, s) {
    if (!e) {
        var l;
        if (t === undefined) l = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
        else {
            var u = [n, a, i, r, o, s],
                c = 0;
            (l = new Error(t.replace(/%s/g, function () {
                return u[c++]
            }))).name = "Invariant Violation"
        }
        throw l.framesToPop = 1, l
    }
},
    invariant_1 = invariant;

function setInputSelection(e, t, n) {
    if ("selectionStart" in e && "selectionEnd" in e) e.selectionStart = t, e.selectionEnd = n;
    else {
        var a = e.createTextRange();
        a.collapse(!0), a.moveStart("character", t), a.moveEnd("character", n - t), a.select()
    }
}

function getInputSelection(e) {
    var t = 0,
        n = 0;
    if ("selectionStart" in e && "selectionEnd" in e) t = e.selectionStart, n = e.selectionEnd;
    else {
        var a = document.selection.createRange();
        a.parentElement() === e && (t = -a.moveStart("character", -e.value.length), n = -a.moveEnd("character", -e.value.length))
    }
    return {
        start: t,
        end: n,
        length: n - t
    }
}
var defaultFormatChars = {
    9: "[0-9]",
    a: "[A-Za-z]",
    "*": "[A-Za-z0-9]"
},
    defaultMaskChar = "_";

function parseMask(e, t, n) {
    var a = "",
        i = "",
        r = null,
        o = [];
    if (t === undefined && (t = defaultMaskChar), null == n && (n = defaultFormatChars), !e || "string" != typeof e) return {
        maskChar: t,
        formatChars: n,
        mask: null,
        prefix: null,
        lastEditablePosition: null,
        permanents: []
    };
    var s = !1;
    return e.split("").forEach(function (e) {
        s = !s && "\\" === e || (s || !n[e] ? (o.push(a.length), a.length === o.length - 1 && (i += e)) : r = a.length + 1, a += e, !1)
    }), {
        maskChar: t,
        formatChars: n,
        prefix: i,
        mask: a,
        lastEditablePosition: r,
        permanents: o
    }
}

function isPermanentCharacter(e, t) {
    return -1 !== e.permanents.indexOf(t)
}

function isAllowedCharacter(e, t, n) {
    var a = e.mask,
        i = e.formatChars;
    if (!n) return !1;
    if (isPermanentCharacter(e, t)) return a[t] === n;
    var r = i[a[t]];
    return new RegExp(r).test(n)
}

function isEmpty(n, e) {
    return e.split("").every(function (e, t) {
        return isPermanentCharacter(n, t) || !isAllowedCharacter(n, t, e)
    })
}

function getFilledLength(e, t) {
    var n = e.maskChar,
        a = e.prefix;
    if (!n) {
        for (; t.length > a.length && isPermanentCharacter(e, t.length - 1);) t = t.slice(0, t.length - 1);
        return t.length
    }
    for (var i = a.length, r = t.length; r >= a.length; r--) {
        var o = t[r];
        if (!isPermanentCharacter(e, r) && isAllowedCharacter(e, r, o)) {
            i = r + 1;
            break
        }
    }
    return i
}

function isFilled(e, t) {
    return getFilledLength(e, t) === e.mask.length
}

function formatValue(e, t) {
    var n = e.maskChar,
        a = e.mask,
        i = e.prefix;
    if (!n) {
        for ((t = insertString(e, "", t, 0)).length < i.length && (t = i); t.length < a.length && isPermanentCharacter(e, t.length);) t += a[t.length];
        return t
    }
    if (t) return insertString(e, formatValue(e, ""), t, 0);
    for (var r = 0; r < a.length; r++) isPermanentCharacter(e, r) ? t += a[r] : t += n;
    return t
}

function clearRange(n, e, a, t) {
    var i = a + t,
        r = n.maskChar,
        o = n.mask,
        s = n.prefix,
        l = e.split("");
    if (r) return l.map(function (e, t) {
        return t < a || i <= t ? e : isPermanentCharacter(n, t) ? o[t] : r
    }).join("");
    for (var u = i; u < l.length; u++) isPermanentCharacter(n, u) && (l[u] = "");
    return a = Math.max(s.length, a), l.splice(a, i - a), e = l.join(""), formatValue(n, e)
}

function insertString(r, o, e, s) {
    var l = r.mask,
        u = r.maskChar,
        c = r.prefix,
        t = e.split(""),
        h = isFilled(r, o);
    return !u && s > o.length && (o += l.slice(o.length, s)), t.every(function (e) {
        for (; i = e, isPermanentCharacter(r, a = s) && i !== l[a];) {
            if (s >= o.length && (o += l[s]), t = e, n = s, u && isPermanentCharacter(r, n) && t === u) return !0;
            if (++s >= l.length) return !1
        }
        var t, n, a, i;
        return !isAllowedCharacter(r, s, e) && e !== u || (s < o.length ? o = u || h || s < c.length ? o.slice(0, s) + e + o.slice(s + 1) : (o = o.slice(0, s) + e + o.slice(s), formatValue(r, o)) : u || (o += e), ++s < l.length)
    }), o
}

function getInsertStringLength(a, e, t, i) {
    var r = a.mask,
        o = a.maskChar,
        n = t.split(""),
        s = i;
    return n.every(function (e) {
        for (; n = e, isPermanentCharacter(a, t = i) && n !== r[t];)
            if (++i >= r.length) return !1;
        var t, n;
        return (isAllowedCharacter(a, i, e) || e === o) && i++, i < r.length
    }), i - s
}

function getLeftEditablePosition(e, t) {
    for (var n = t; 0 <= n; --n)
        if (!isPermanentCharacter(e, n)) return n;
    return null
}

function getRightEditablePosition(e, t) {
    for (var n = e.mask, a = t; a < n.length; ++a)
        if (!isPermanentCharacter(e, a)) return a;
    return null
}

function getStringValue(e) {
    return e || 0 === e ? e + "" : ""
}

function processChange(e, t, n, a, i) {
    var r = e.mask,
        o = e.prefix,
        s = e.lastEditablePosition,
        l = t,
        u = "",
        c = 0,
        h = 0,
        f = Math.min(i.start, n.start);
    if (n.end > i.start ? h = (c = getInsertStringLength(e, a, u = l.slice(i.start, n.end), f)) ? i.length : 0 : l.length < a.length && (h = a.length - l.length), l = a, h) {
        if (1 === h && !i.length) f = i.start === n.start ? getRightEditablePosition(e, n.start) : getLeftEditablePosition(e, n.start);
        l = clearRange(e, l, f, h)
    }
    return l = insertString(e, l, u, f), (f += c) >= r.length ? f = r.length : f < o.length && !c ? f = o.length : f >= o.length && f < s && c && (f = getRightEditablePosition(e, f)), u || (u = null), {
        value: l = formatValue(e, l),
        enteredString: u,
        selection: {
            start: f,
            end: f
        }
    }
}

function isWindowsPhoneBrowser() {
    var e = new RegExp("windows", "i"),
        t = new RegExp("phone", "i"),
        n = navigator.userAgent;
    return e.test(n) && t.test(n)
}

function isFunction(e) {
    return "function" == typeof e
}

function getRequestAnimationFrame() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
}

function getCancelAnimationFrame() {
    return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame
}

function defer(e) {
    return (!!getCancelAnimationFrame() ? getRequestAnimationFrame() : function () {
        return setTimeout(e, 1e3 / 60)
    })(e)
}

function cancelDefer(e) {
    (getCancelAnimationFrame() || clearTimeout)(e)
}
var InputElement = function (c) {
    function e(e) {
        var f = c.call(this, e) || this;
        f.focused = !1, f.mounted = !1, f.previousSelection = null, f.selectionDeferId = null, f.saveSelectionLoopDeferId = null, f.saveSelectionLoop = function () {
            f.previousSelection = f.getSelection(), f.saveSelectionLoopDeferId = defer(f.saveSelectionLoop)
        }, f.runSaveSelectionLoop = function () {
            null === f.saveSelectionLoopDeferId && f.saveSelectionLoop()
        }, f.stopSaveSelectionLoop = function () {
            null !== f.saveSelectionLoopDeferId && (cancelDefer(f.saveSelectionLoopDeferId), f.saveSelectionLoopDeferId = null, f.previousSelection = null)
        }, f.getInputDOMNode = function () {
            if (!f.mounted) return null;
            var e = reactDom.findDOMNode(_assertThisInitialized(_assertThisInitialized(f))),
                t = "undefined" != typeof window && e instanceof window.Element;
            if (e && !t) return null;
            if ("INPUT" !== e.nodeName && (e = e.querySelector("input")), !e) throw new Error("react-input-mask: inputComponent doesn't contain input node");
            return e
        }, f.getInputValue = function () {
            var e = f.getInputDOMNode();
            return e ? e.value : null
        }, f.setInputValue = function (e) {
            var t = f.getInputDOMNode();
            t && (f.value = e, t.value = e)
        }, f.setCursorToEnd = function () {
            var e = getFilledLength(f.maskOptions, f.value),
                t = getRightEditablePosition(f.maskOptions, e);
            null !== t && f.setCursorPosition(t)
        }, f.setSelection = function (e, t, n) {
            void 0 === n && (n = {});
            var a = f.getInputDOMNode(),
                i = f.isFocused();
            a && i && (n.deferred || setInputSelection(a, e, t), null !== f.selectionDeferId && cancelDefer(f.selectionDeferId), f.selectionDeferId = defer(function () {
                f.selectionDeferId = null, setInputSelection(a, e, t)
            }), f.previousSelection = {
                start: e,
                end: t,
                length: Math.abs(t - e)
            })
        }, f.getSelection = function () {
            return getInputSelection(f.getInputDOMNode())
        }, f.getCursorPosition = function () {
            return f.getSelection().start
        }, f.setCursorPosition = function (e) {
            f.setSelection(e, e)
        }, f.isFocused = function () {
            return f.focused
        }, f.getBeforeMaskedValueChangeConfig = function () {
            var e = f.maskOptions,
                t = e.mask,
                n = e.maskChar,
                a = e.permanents,
                i = e.formatChars;
            return {
                mask: t,
                maskChar: n,
                permanents: a,
                alwaysShowMask: !!f.props.alwaysShowMask,
                formatChars: i
            }
        }, f.isInputAutofilled = function (e, t, n, a) {
            var i = f.getInputDOMNode();
            try {
                if (i.matches(":-webkit-autofill")) return !0
            } catch (r) { }
            return !f.focused || a.end < n.length && t.end === e.length
        }, f.onChange = function (e) {
            var t = _assertThisInitialized(_assertThisInitialized(f)).beforePasteState,
                n = _assertThisInitialized(_assertThisInitialized(f)).previousSelection,
                a = f.props.beforeMaskedValueChange,
                i = f.getInputValue(),
                r = f.value,
                o = f.getSelection();
            f.isInputAutofilled(i, o, r, n) && (r = formatValue(f.maskOptions, ""), n = {
                start: 0,
                end: 0,
                length: 0
            }), t && (n = t.selection, r = t.value, o = {
                start: n.start + i.length,
                end: n.start + i.length,
                length: 0
            }, i = r.slice(0, n.start) + i + r.slice(n.end), f.beforePasteState = null);
            var s = processChange(f.maskOptions, i, o, r, n),
                l = s.enteredString,
                u = s.selection,
                c = s.value;
            if (isFunction(a)) {
                var h = a({
                    value: c,
                    selection: u
                }, {
                    value: r,
                    selection: n
                }, l, f.getBeforeMaskedValueChangeConfig());
                c = h.value, u = h.selection
            }
            f.setInputValue(c), isFunction(f.props.onChange) && f.props.onChange(e), f.isWindowsPhoneBrowser ? f.setSelection(u.start, u.end, {
                deferred: !0
            }) : f.setSelection(u.start, u.end)
        }, f.onFocus = function (e) {
            var t = f.props.beforeMaskedValueChange,
                n = f.maskOptions,
                a = n.mask,
                i = n.prefix;
            if (f.focused = !0, f.mounted = !0, a) {
                if (f.value) getFilledLength(f.maskOptions, f.value) < f.maskOptions.mask.length && f.setCursorToEnd();
                else {
                    var r = formatValue(f.maskOptions, i),
                        o = formatValue(f.maskOptions, r),
                        s = getFilledLength(f.maskOptions, o),
                        l = getRightEditablePosition(f.maskOptions, s),
                        u = {
                            start: l,
                            end: l
                        };
                    if (isFunction(t)) {
                        var c = t({
                            value: o,
                            selection: u
                        }, {
                            value: f.value,
                            selection: null
                        }, null, f.getBeforeMaskedValueChangeConfig());
                        o = c.value, u = c.selection
                    }
                    var h = o !== f.getInputValue();
                    h && f.setInputValue(o), h && isFunction(f.props.onChange) && f.props.onChange(e), f.setSelection(u.start, u.end)
                }
                f.runSaveSelectionLoop()
            }
            isFunction(f.props.onFocus) && f.props.onFocus(e)
        }, f.onBlur = function (e) {
            var t = f.props.beforeMaskedValueChange,
                n = f.maskOptions.mask;
            if (f.stopSaveSelectionLoop(), f.focused = !1, n && !f.props.alwaysShowMask && isEmpty(f.maskOptions, f.value)) {
                var a = "";
                if (isFunction(t)) a = t({
                    value: a,
                    selection: null
                }, {
                    value: f.value,
                    selection: f.previousSelection
                }, null, f.getBeforeMaskedValueChangeConfig()).value;
                var i = a !== f.getInputValue();
                i && f.setInputValue(a), i && isFunction(f.props.onChange) && f.props.onChange(e)
            }
            isFunction(f.props.onBlur) && f.props.onBlur(e)
        }, f.onMouseDown = function (e) {
            if (!f.focused && document.addEventListener) {
                f.mouseDownX = e.clientX, f.mouseDownY = e.clientY, f.mouseDownTime = (new Date).getTime();
                var r = function r(e) {
                    if (document.removeEventListener("mouseup", r), f.focused) {
                        var t = Math.abs(e.clientX - f.mouseDownX),
                            n = Math.abs(e.clientY - f.mouseDownY),
                            a = Math.max(t, n),
                            i = (new Date).getTime() - f.mouseDownTime;
                        (a <= 10 && i <= 200 || a <= 5 && i <= 300) && f.setCursorToEnd()
                    }
                };
                document.addEventListener("mouseup", r)
            }
            isFunction(f.props.onMouseDown) && f.props.onMouseDown(e)
        }, f.onPaste = function (e) {
            isFunction(f.props.onPaste) && f.props.onPaste(e), e.defaultPrevented || (f.beforePasteState = {
                value: f.getInputValue(),
                selection: f.getSelection()
            }, f.setInputValue(""))
        }, f.handleRef = function (e) {
            null == f.props.children && isFunction(f.props.inputRef) && f.props.inputRef(e)
        };
        var t = e.mask,
            n = e.maskChar,
            a = e.formatChars,
            i = e.alwaysShowMask,
            r = e.beforeMaskedValueChange,
            o = e.defaultValue,
            s = e.value;
        f.maskOptions = parseMask(t, n, a), null == o && (o = ""), null == s && (s = o);
        var l = getStringValue(s);
        if (f.maskOptions.mask && (i || l) && (l = formatValue(f.maskOptions, l), isFunction(r))) {
            var u = e.value;
            null == e.value && (u = o), l = r({
                value: l,
                selection: null
            }, {
                value: u = getStringValue(u),
                selection: null
            }, null, f.getBeforeMaskedValueChangeConfig()).value
        }
        return f.value = l, f
    }
    _inheritsLoose(e, c);
    var t = e.prototype;
    return t.componentDidMount = function () {
        this.mounted = !0, this.getInputDOMNode() && (this.isWindowsPhoneBrowser = isWindowsPhoneBrowser(), this.maskOptions.mask && this.getInputValue() !== this.value && this.setInputValue(this.value))
    }, t.componentDidUpdate = function () {
        var e = this.previousSelection,
            t = this.props,
            n = t.beforeMaskedValueChange,
            a = t.alwaysShowMask,
            i = t.mask,
            r = t.maskChar,
            o = t.formatChars,
            s = this.maskOptions,
            l = a || this.isFocused(),
            u = null != this.props.value,
            c = u ? getStringValue(this.props.value) : this.value,
            h = e ? e.start : null;
        if (this.maskOptions = parseMask(i, r, o), this.maskOptions.mask) {
            !s.mask && this.isFocused() && this.runSaveSelectionLoop();
            var f = this.maskOptions.mask && this.maskOptions.mask !== s.mask;
            if (s.mask || u || (c = this.getInputValue()), (f || this.maskOptions.mask && (c || l)) && (c = formatValue(this.maskOptions, c)), f) {
                var p = getFilledLength(this.maskOptions, c);
                (null === h || p < h) && (h = isFilled(this.maskOptions, c) ? p : getRightEditablePosition(this.maskOptions, p))
            } !this.maskOptions.mask || !isEmpty(this.maskOptions, c) || l || u && this.props.value || (c = "");
            var d = {
                start: h,
                end: h
            };
            if (isFunction(n)) {
                var m = n({
                    value: c,
                    selection: d
                }, {
                    value: this.value,
                    selection: this.previousSelection
                }, null, this.getBeforeMaskedValueChangeConfig());
                c = m.value, d = m.selection
            }
            this.value = c;
            var g = this.getInputValue() !== this.value;
            g ? (this.setInputValue(this.value), this.forceUpdate()) : f && this.forceUpdate();
            var v = !1;
            null != d.start && null != d.end && (v = !e || e.start !== d.start || e.end !== d.end), (v || g) && this.setSelection(d.start, d.end)
        } else s.mask && (this.stopSaveSelectionLoop(), this.forceUpdate())
    }, t.componentWillUnmount = function () {
        this.mounted = !1, null !== this.selectionDeferId && cancelDefer(this.selectionDeferId), this.stopSaveSelectionLoop()
    }, t.render = function () {
        var t, e = this.props,
            n = (e.mask, e.alwaysShowMask, e.maskChar, e.formatChars, e.inputRef, e.beforeMaskedValueChange, e.children),
            a = _objectWithoutPropertiesLoose(e, ["mask", "alwaysShowMask", "maskChar", "formatChars", "inputRef", "beforeMaskedValueChange", "children"]);
        if (n) {
            isFunction(n) || invariant_1(!1);
            var i = ["onChange", "onPaste", "onMouseDown", "onFocus", "onBlur", "value", "disabled", "readOnly"],
                r = _extends({}, a);
            i.forEach(function (e) {
                return delete r[e]
            }), t = n(r), i.filter(function (e) {
                return null != t.props[e] && t.props[e] !== a[e]
            }).length && invariant_1(!1)
        } else t = React.createElement("input", _extends({
            ref: this.handleRef
        }, a));
        var o = {
            onFocus: this.onFocus,
            onBlur: this.onBlur
        };
        return this.maskOptions.mask && (a.disabled || a.readOnly || (o.onChange = this.onChange, o.onPaste = this.onPaste, o.onMouseDown = this.onMouseDown), null != a.value && (o.value = this.value)), t = React.cloneElement(t, o)
    }, e
}(React.Component);
module.exports = InputElement;