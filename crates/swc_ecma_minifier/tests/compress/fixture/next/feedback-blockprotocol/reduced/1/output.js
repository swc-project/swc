!function(window, document, undefined) {
    if (window) {
        for(var _REVERSE_MAP, _MAP = {
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "ins",
            46: "del",
            91: "meta",
            93: "meta",
            224: "meta"
        }, _KEYCODE_MAP = {
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        }, _SHIFT_MAP = {
            "~": "`",
            "!": "1",
            "@": "2",
            "#": "3",
            "$": "4",
            "%": "5",
            "^": "6",
            "&": "7",
            "*": "8",
            "(": "9",
            ")": "0",
            "_": "-",
            "+": "=",
            ":": ";",
            "\"": "'",
            "<": ",",
            ">": ".",
            "?": "/",
            "|": "\\"
        }, _SPECIAL_ALIASES = {
            option: "alt",
            command: "meta",
            "return": "enter",
            escape: "esc",
            plus: "+",
            mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
        }, i = 1; i < 20; ++i)_MAP[111 + i] = "f" + i;
        for(i = 0; i <= 9; ++i)_MAP[i + 96] = i.toString();
        Mousetrap.prototype.bind = function(keys, callback, action) {
            return keys = keys instanceof Array ? keys : [
                keys
            ], this._bindMultiple.call(this, keys, callback, action), this;
        }, Mousetrap.prototype.unbind = function(keys, action) {
            return this.bind.call(this, keys, function() {}, action);
        }, Mousetrap.prototype.trigger = function(keys, action) {
            return this._directMap[keys + ":" + action] && this._directMap[keys + ":" + action]({}, keys), this;
        }, Mousetrap.prototype.reset = function() {
            var self = this;
            return self._callbacks = {}, self._directMap = {}, self;
        }, Mousetrap.prototype.stopCallback = function(e, element) {
            if ((" " + element.className + " ").indexOf(" mousetrap ") > -1) return !1;
            if (_belongsTo(element, this.target)) return !1;
            if ("composedPath" in e && "function" == typeof e.composedPath) {
                var initialEventTarget = e.composedPath()[0];
                initialEventTarget !== e.target && (element = initialEventTarget);
            }
            return "INPUT" == element.tagName || "SELECT" == element.tagName || "TEXTAREA" == element.tagName || element.isContentEditable;
        }, Mousetrap.prototype.handleKey = function() {
            return this._handleKey.apply(this, arguments);
        }, Mousetrap.addKeycodes = function(object) {
            for(var key in object)object.hasOwnProperty(key) && (_MAP[key] = object[key]);
            _REVERSE_MAP = null;
        }, Mousetrap.init = function() {
            var documentMousetrap = Mousetrap(document);
            for(var method1 in documentMousetrap)"_" !== method1.charAt(0) && (Mousetrap[method1] = (function(method) {
                return function() {
                    return documentMousetrap[method].apply(documentMousetrap, arguments);
                };
            })(method1));
        }, Mousetrap.init(), window.Mousetrap = Mousetrap, module.exports && (module.exports = Mousetrap), void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
            return Mousetrap;
        }).call(exports, __webpack_require__, exports, module)) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    }
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, !1);
            return;
        }
        object.attachEvent("on" + type, callback);
    }
    function _characterFromEvent(e) {
        if ("keypress" == e.type) {
            var character = String.fromCharCode(e.which);
            return e.shiftKey || (character = character.toLowerCase()), character;
        }
        return _MAP[e.which] ? _MAP[e.which] : _KEYCODE_MAP[e.which] ? _KEYCODE_MAP[e.which] : String.fromCharCode(e.which).toLowerCase();
    }
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(",") === modifiers2.sort().join(",");
    }
    function _isModifier(key) {
        return "shift" == key || "ctrl" == key || "alt" == key || "meta" == key;
    }
    function _getKeyInfo(combination, action) {
        var key2, modifiers, action1, keys, key1, i, combination1, modifiers1 = [];
        for(i = 0, keys = "+" === (combination1 = combination) ? [
            "+"
        ] : (combination1 = combination1.replace(/\+{2}/g, "+plus")).split("+"); i < keys.length; ++i)_SPECIAL_ALIASES[key1 = keys[i]] && (key1 = _SPECIAL_ALIASES[key1]), action && "keypress" != action && _SHIFT_MAP[key1] && (key1 = _SHIFT_MAP[key1], modifiers1.push("shift")), _isModifier(key1) && modifiers1.push(key1);
        return key2 = key1, modifiers = modifiers1, (action1 = action) || (action1 = (function() {
            if (!_REVERSE_MAP) for(var key in _REVERSE_MAP = {}, _MAP)key > 95 && key < 112 || _MAP.hasOwnProperty(key) && (_REVERSE_MAP[_MAP[key]] = key);
            return _REVERSE_MAP;
        })()[key2] ? "keydown" : "keypress"), "keypress" == action1 && modifiers.length && (action1 = "keydown"), {
            key: key1,
            modifiers: modifiers1,
            action: action = action1
        };
    }
    function _belongsTo(element, ancestor) {
        return null !== element && element !== document && (element === ancestor || _belongsTo(element.parentNode, ancestor));
    }
    function Mousetrap(targetElement) {
        var _resetTimer, self = this;
        if (targetElement = targetElement || document, !(self instanceof Mousetrap)) return new Mousetrap(targetElement);
        self.target = targetElement, self._callbacks = {}, self._directMap = {};
        var _sequenceLevels = {}, _ignoreNextKeyup = !1, _ignoreNextKeypress = !1, _nextExpectedAction = !1;
        function _resetSequences(doNotReset) {
            doNotReset = doNotReset || {};
            var key, activeSequences = !1;
            for(key in _sequenceLevels){
                if (doNotReset[key]) {
                    activeSequences = !0;
                    continue;
                }
                _sequenceLevels[key] = 0;
            }
            activeSequences || (_nextExpectedAction = !1);
        }
        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
            var i, callback, matches = [], action = e.type;
            if (!self._callbacks[character]) return [];
            for("keyup" == action && _isModifier(character) && (modifiers = [
                character
            ]), i = 0; i < self._callbacks[character].length; ++i)if (callback = self._callbacks[character][i], (sequenceName || !callback.seq || _sequenceLevels[callback.seq] == callback.level) && action == callback.action && ("keypress" == action && !e.metaKey && !e.ctrlKey || _modifiersMatch(modifiers, callback.modifiers))) {
                var deleteCombo = !sequenceName && callback.combo == combination, deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                (deleteCombo || deleteSequence) && self._callbacks[character].splice(i, 1), matches.push(callback);
            }
            return matches;
        }
        function _fireCallback(callback, e1, combo, sequence) {
            self.stopCallback(e1, e1.target || e1.srcElement, combo, sequence) || !1 === callback(e1, combo) && (!function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                    return;
                }
                e.returnValue = !1;
            }(e1), (function(e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                    return;
                }
                e.cancelBubble = !0;
            })(e1));
        }
        function _handleKeyEvent(e) {
            "number" != typeof e.which && (e.which = e.keyCode);
            var e2, modifiers, character = _characterFromEvent(e);
            if (character) {
                if ("keyup" == e.type && _ignoreNextKeyup === character) {
                    _ignoreNextKeyup = !1;
                    return;
                }
                self.handleKey(character, (modifiers = [], (e2 = e).shiftKey && modifiers.push("shift"), e2.altKey && modifiers.push("alt"), e2.ctrlKey && modifiers.push("ctrl"), e2.metaKey && modifiers.push("meta"), modifiers), e);
            }
        }
        function _bindSingle(combination, callback1, action2, sequenceName, level) {
            self._directMap[combination + ":" + action2] = callback1;
            var info, sequence = (combination = combination.replace(/\s+/g, " ")).split(" ");
            if (sequence.length > 1) {
                !function(combo, keys, callback, action) {
                    function _increaseSequence(nextAction) {
                        return function() {
                            _nextExpectedAction = nextAction, ++_sequenceLevels[combo], clearTimeout(_resetTimer), _resetTimer = setTimeout(_resetSequences, 1000);
                        };
                    }
                    function _callbackAndReset(e) {
                        _fireCallback(callback, e, combo), "keyup" !== action && (_ignoreNextKeyup = _characterFromEvent(e)), setTimeout(_resetSequences, 10);
                    }
                    _sequenceLevels[combo] = 0;
                    for(var i = 0; i < keys.length; ++i){
                        var wrappedCallback = i + 1 === keys.length ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
                        _bindSingle(keys[i], wrappedCallback, action, combo, i);
                    }
                }(combination, sequence, callback1, action2);
                return;
            }
            info = _getKeyInfo(combination, action2), self._callbacks[info.key] = self._callbacks[info.key] || [], _getMatches(info.key, info.modifiers, {
                type: info.action
            }, sequenceName, combination, level), self._callbacks[info.key][sequenceName ? "unshift" : "push"]({
                callback: callback1,
                modifiers: info.modifiers,
                action: info.action,
                seq: sequenceName,
                level: level,
                combo: combination
            });
        }
        self._handleKey = function(character, modifiers, e) {
            var i, callbacks = _getMatches(character, modifiers, e), doNotReset = {}, maxLevel = 0, processedSequenceCallback = !1;
            for(i = 0; i < callbacks.length; ++i)callbacks[i].seq && (maxLevel = Math.max(maxLevel, callbacks[i].level));
            for(i = 0; i < callbacks.length; ++i){
                if (callbacks[i].seq) {
                    if (callbacks[i].level != maxLevel) continue;
                    processedSequenceCallback = !0, doNotReset[callbacks[i].seq] = 1, _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                    continue;
                }
                processedSequenceCallback || _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
            }
            var ignoreThisKeypress = "keypress" == e.type && _ignoreNextKeypress;
            e.type != _nextExpectedAction || _isModifier(character) || ignoreThisKeypress || _resetSequences(doNotReset), _ignoreNextKeypress = processedSequenceCallback && "keydown" == e.type;
        }, self._bindMultiple = function(combinations, callback, action) {
            for(var i = 0; i < combinations.length; ++i)_bindSingle(combinations[i], callback, action);
        }, _addEvent(targetElement, "keypress", _handleKeyEvent), _addEvent(targetElement, "keydown", _handleKeyEvent), _addEvent(targetElement, "keyup", _handleKeyEvent);
    }
}("undefined" != typeof window ? window : null, "undefined" != typeof window ? document : null);
