function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _slicedToArray(arr, i) {
    return (function(arr) {
        if (Array.isArray(arr)) return arr;
    })(arr) || (function(arr, i) {
        var _s, _e, _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
        if (null != _i) {
            var _arr = [], _n = !0, _d = !1;
            try {
                for(_i = _i.call(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
            } catch (err) {
                _d = !0, _e = err;
            } finally{
                try {
                    _n || null == _i.return || _i.return();
                } finally{
                    if (_d) throw _e;
                }
            }
            return _arr;
        }
    })(arr, i) || _unsupportedIterableToArray(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx1) {
        for(;;)switch(_ctx1.prev = _ctx1.next){
            case 0:
                return _ctx1.delegateYield(regeneratorRuntime.mark(function _callee() {
                    var y;
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return;
                            case 2:
                                y = _ctx.sent;
                            case 3:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                })(), "t0", 1);
            case 1:
            case "end":
                return _ctx1.stop();
        }
    }, _marked);
}), _marked1 = regeneratorRuntime.mark(function() {
    var ref, tmp, a, tmp1, b;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.t0 = _slicedToArray, _ctx.next = 3;
                return;
            case 3:
                _ctx.t1 = _ctx.sent, a = void 0 === (tmp = (ref = (0, _ctx.t0)(_ctx.t1, 2))[0]) ? 1 : tmp, tmp1 = ref[1], b = void 0 === tmp1 ? 2 : tmp1;
            case 9:
            case "end":
                return _ctx.stop();
        }
    }, _marked1);
}), _marked2 = regeneratorRuntime.mark(function(x, y) {
    var a;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, x;
            case 2:
                return a = _ctx.sent, _ctx.abrupt("return", y);
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked2);
}), _marked3 = regeneratorRuntime.mark(function(x) {
    var a;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, x;
            case 2:
                return a = _ctx.sent, _ctx.abrupt("return", a);
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked3);
}), _marked4 = regeneratorRuntime.mark(function() {
    var a;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 0;
            case 2:
                return a = _ctx.sent, _ctx.abrupt("return", a);
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked4);
}), _marked5 = regeneratorRuntime.mark(function() {
    var a;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 1;
            case 2:
                return a = _ctx.sent, _ctx.abrupt("return", !0);
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked5);
}), _marked6 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                if (!Math.random()) {
                    _ctx.next = 3;
                    break;
                }
                return _ctx.next = 3, 1;
            case 3:
                return _ctx.next = 5, 2;
            case 5:
                if (!Math.random()) {
                    _ctx.next = 7;
                    break;
                }
                return _ctx.abrupt("return", "a");
            case 7:
                return _ctx.abrupt("return", "b");
            case 8:
            case "end":
                return _ctx.stop();
        }
    }, _marked6);
}), _marked7 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 1;
            case 2:
                return _ctx.abrupt("return", "a");
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked7);
}), _marked8 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.abrupt("return", "a");
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked8);
}), _marked9 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 1;
            case 2:
                return _ctx.abrupt("return");
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked9);
}), _marked10 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.abrupt("return");
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked10);
}), _marked11 = regeneratorRuntime.mark(function() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.t0 = f2, _ctx.next = 3, 1;
            case 3:
                _ctx.t1 = _ctx.sent, x = (0, _ctx.t0)(_ctx.t1);
            case 5:
            case "end":
                return _ctx.stop();
        }
    }, _marked11);
}), _marked12 = regeneratorRuntime.mark(function() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.t0 = f1, _ctx.next = 3, 1;
            case 3:
                _ctx.t1 = _ctx.sent, x = (0, _ctx.t0)(_ctx.t1);
            case 5:
            case "end":
                return _ctx.stop();
        }
    }, _marked12);
}), _marked13 = regeneratorRuntime.mark(function() {
    var a, b;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 1;
            case 2:
                return a = _ctx.sent, _ctx.next = 5, 2;
            case 5:
                b = _ctx.sent;
            case 6:
            case "end":
                return _ctx.stop();
        }
    }, _marked13);
}), _marked14 = regeneratorRuntime.mark(function() {
    var a;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 1;
            case 2:
                a = _ctx.sent;
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked14);
}), _marked15 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.abrupt("return", never);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _marked15);
}), _marked16 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                if (!Math.random()) {
                    _ctx.next = 2;
                    break;
                }
                return _ctx.abrupt("return", 1);
            case 2:
                return _ctx.abrupt("return", 2);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked16);
}), _marked17 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.abrupt("return", 1);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _marked17);
}), _marked18 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, never;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked18);
}), _marked19 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 1;
            case 2:
                return _ctx.next = 4, 2;
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked19);
}), _marked20 = regeneratorRuntime.mark(function() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield(generator, "t0", 1);
            case 1:
                x = _ctx.t0;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked20);
}), _marked21 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield(iterableIterator, "t0", 1);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _marked21);
}), _marked22 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield([], "t0", 1);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _marked22);
}), _marked23 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 1;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked23);
}), _marked24 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked24);
}), _marked25 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
            case "end":
                return _ctx.stop();
        }
    }, _marked25);
});
