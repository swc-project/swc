import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1, x1, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, x2, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, _iteratorAbruptCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value4, _iteratorAbruptCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _value5;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _async_iterator(asyncIterable);
                case 4:
                    _ctx.next = 6;
                    return _iterator.next();
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    {
                        _value = _step.value;
                        x = _value;
                    }
                case 8:
                    _iteratorAbruptCompletion = false;
                    _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13;
                    _ctx.t0 = _ctx["catch"](2);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 17:
                    _ctx.prev = 17;
                    _ctx.prev = 18;
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                        _ctx.next = 22;
                        break;
                    }
                    _ctx.next = 22;
                    return _iterator.return();
                case 22:
                    _ctx.prev = 22;
                    if (!_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                    _iteratorAbruptCompletion1 = false, _didIteratorError1 = false;
                    _ctx.prev = 28;
                    _iterator1 = _async_iterator(iterable);
                case 30:
                    _ctx.next = 32;
                    return _iterator1.next();
                case 32:
                    if (!(_iteratorAbruptCompletion1 = !(_step1 = _ctx.sent).done)) {
                        _ctx.next = 37;
                        break;
                    }
                    {
                        _value1 = _step1.value;
                        x1 = _value1;
                    }
                case 34:
                    _iteratorAbruptCompletion1 = false;
                    _ctx.next = 30;
                    break;
                case 37:
                    _ctx.next = 43;
                    break;
                case 39:
                    _ctx.prev = 39;
                    _ctx.t1 = _ctx["catch"](28);
                    _didIteratorError1 = true;
                    _iteratorError1 = _ctx.t1;
                case 43:
                    _ctx.prev = 43;
                    _ctx.prev = 44;
                    if (!(_iteratorAbruptCompletion1 && _iterator1.return != null)) {
                        _ctx.next = 48;
                        break;
                    }
                    _ctx.next = 48;
                    return _iterator1.return();
                case 48:
                    _ctx.prev = 48;
                    if (!_didIteratorError1) {
                        _ctx.next = 51;
                        break;
                    }
                    throw _iteratorError1;
                case 51:
                    return _ctx.finish(48);
                case 52:
                    return _ctx.finish(43);
                case 53:
                    _iteratorAbruptCompletion2 = false, _didIteratorError2 = false;
                    _ctx.prev = 54;
                    _iterator2 = _async_iterator(iterableOfPromise);
                case 56:
                    _ctx.next = 58;
                    return _iterator2.next();
                case 58:
                    if (!(_iteratorAbruptCompletion2 = !(_step2 = _ctx.sent).done)) {
                        _ctx.next = 63;
                        break;
                    }
                    {
                        _value2 = _step2.value;
                        x2 = _value2;
                    }
                case 60:
                    _iteratorAbruptCompletion2 = false;
                    _ctx.next = 56;
                    break;
                case 63:
                    _ctx.next = 69;
                    break;
                case 65:
                    _ctx.prev = 65;
                    _ctx.t2 = _ctx["catch"](54);
                    _didIteratorError2 = true;
                    _iteratorError2 = _ctx.t2;
                case 69:
                    _ctx.prev = 69;
                    _ctx.prev = 70;
                    if (!(_iteratorAbruptCompletion2 && _iterator2.return != null)) {
                        _ctx.next = 74;
                        break;
                    }
                    _ctx.next = 74;
                    return _iterator2.return();
                case 74:
                    _ctx.prev = 74;
                    if (!_didIteratorError2) {
                        _ctx.next = 77;
                        break;
                    }
                    throw _iteratorError2;
                case 77:
                    return _ctx.finish(74);
                case 78:
                    return _ctx.finish(69);
                case 79:
                    _iteratorAbruptCompletion3 = false, _didIteratorError3 = false;
                    _ctx.prev = 80;
                    _iterator3 = _async_iterator(asyncIterable);
                case 82:
                    _ctx.next = 84;
                    return _iterator3.next();
                case 84:
                    if (!(_iteratorAbruptCompletion3 = !(_step3 = _ctx.sent).done)) {
                        _ctx.next = 89;
                        break;
                    }
                    {
                        _value3 = _step3.value;
                        y = _value3;
                    }
                case 86:
                    _iteratorAbruptCompletion3 = false;
                    _ctx.next = 82;
                    break;
                case 89:
                    _ctx.next = 95;
                    break;
                case 91:
                    _ctx.prev = 91;
                    _ctx.t3 = _ctx["catch"](80);
                    _didIteratorError3 = true;
                    _iteratorError3 = _ctx.t3;
                case 95:
                    _ctx.prev = 95;
                    _ctx.prev = 96;
                    if (!(_iteratorAbruptCompletion3 && _iterator3.return != null)) {
                        _ctx.next = 100;
                        break;
                    }
                    _ctx.next = 100;
                    return _iterator3.return();
                case 100:
                    _ctx.prev = 100;
                    if (!_didIteratorError3) {
                        _ctx.next = 103;
                        break;
                    }
                    throw _iteratorError3;
                case 103:
                    return _ctx.finish(100);
                case 104:
                    return _ctx.finish(95);
                case 105:
                    _iteratorAbruptCompletion4 = false, _didIteratorError4 = false;
                    _ctx.prev = 106;
                    _iterator4 = _async_iterator(iterable);
                case 108:
                    _ctx.next = 110;
                    return _iterator4.next();
                case 110:
                    if (!(_iteratorAbruptCompletion4 = !(_step4 = _ctx.sent).done)) {
                        _ctx.next = 115;
                        break;
                    }
                    {
                        _value4 = _step4.value;
                        y = _value4;
                    }
                case 112:
                    _iteratorAbruptCompletion4 = false;
                    _ctx.next = 108;
                    break;
                case 115:
                    _ctx.next = 121;
                    break;
                case 117:
                    _ctx.prev = 117;
                    _ctx.t4 = _ctx["catch"](106);
                    _didIteratorError4 = true;
                    _iteratorError4 = _ctx.t4;
                case 121:
                    _ctx.prev = 121;
                    _ctx.prev = 122;
                    if (!(_iteratorAbruptCompletion4 && _iterator4.return != null)) {
                        _ctx.next = 126;
                        break;
                    }
                    _ctx.next = 126;
                    return _iterator4.return();
                case 126:
                    _ctx.prev = 126;
                    if (!_didIteratorError4) {
                        _ctx.next = 129;
                        break;
                    }
                    throw _iteratorError4;
                case 129:
                    return _ctx.finish(126);
                case 130:
                    return _ctx.finish(121);
                case 131:
                    _iteratorAbruptCompletion5 = false, _didIteratorError5 = false;
                    _ctx.prev = 132;
                    _iterator5 = _async_iterator(iterableOfPromise);
                case 134:
                    _ctx.next = 136;
                    return _iterator5.next();
                case 136:
                    if (!(_iteratorAbruptCompletion5 = !(_step5 = _ctx.sent).done)) {
                        _ctx.next = 141;
                        break;
                    }
                    {
                        _value5 = _step5.value;
                        y = _value5;
                    }
                case 138:
                    _iteratorAbruptCompletion5 = false;
                    _ctx.next = 134;
                    break;
                case 141:
                    _ctx.next = 147;
                    break;
                case 143:
                    _ctx.prev = 143;
                    _ctx.t5 = _ctx["catch"](132);
                    _didIteratorError5 = true;
                    _iteratorError5 = _ctx.t5;
                case 147:
                    _ctx.prev = 147;
                    _ctx.prev = 148;
                    if (!(_iteratorAbruptCompletion5 && _iterator5.return != null)) {
                        _ctx.next = 152;
                        break;
                    }
                    _ctx.next = 152;
                    return _iterator5.return();
                case 152:
                    _ctx.prev = 152;
                    if (!_didIteratorError5) {
                        _ctx.next = 155;
                        break;
                    }
                    throw _iteratorError5;
                case 155:
                    return _ctx.finish(152);
                case 156:
                    return _ctx.finish(147);
                case 157:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                13,
                17,
                27
            ],
            [
                18,
                ,
                22,
                26
            ],
            [
                28,
                39,
                43,
                53
            ],
            [
                44,
                ,
                48,
                52
            ],
            [
                54,
                65,
                69,
                79
            ],
            [
                70,
                ,
                74,
                78
            ],
            [
                80,
                91,
                95,
                105
            ],
            [
                96,
                ,
                100,
                104
            ],
            [
                106,
                117,
                121,
                131
            ],
            [
                122,
                ,
                126,
                130
            ],
            [
                132,
                143,
                147,
                157
            ],
            [
                148,
                ,
                152,
                156
            ]
        ]);
    }));
    return _f1.apply(this, arguments);
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1, x1, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, x2, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, _iteratorAbruptCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value4, _iteratorAbruptCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _value5;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _async_iterator(asyncIterable);
                case 4:
                    _ctx.next = 6;
                    return _await_async_generator(_iterator.next());
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    {
                        _value = _step.value;
                        x = _value;
                    }
                case 8:
                    _iteratorAbruptCompletion = false;
                    _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13;
                    _ctx.t0 = _ctx["catch"](2);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 17:
                    _ctx.prev = 17;
                    _ctx.prev = 18;
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                        _ctx.next = 22;
                        break;
                    }
                    _ctx.next = 22;
                    return _iterator.return();
                case 22:
                    _ctx.prev = 22;
                    if (!_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                    _iteratorAbruptCompletion1 = false, _didIteratorError1 = false;
                    _ctx.prev = 28;
                    _iterator1 = _async_iterator(iterable);
                case 30:
                    _ctx.next = 32;
                    return _await_async_generator(_iterator1.next());
                case 32:
                    if (!(_iteratorAbruptCompletion1 = !(_step1 = _ctx.sent).done)) {
                        _ctx.next = 37;
                        break;
                    }
                    {
                        _value1 = _step1.value;
                        x1 = _value1;
                    }
                case 34:
                    _iteratorAbruptCompletion1 = false;
                    _ctx.next = 30;
                    break;
                case 37:
                    _ctx.next = 43;
                    break;
                case 39:
                    _ctx.prev = 39;
                    _ctx.t1 = _ctx["catch"](28);
                    _didIteratorError1 = true;
                    _iteratorError1 = _ctx.t1;
                case 43:
                    _ctx.prev = 43;
                    _ctx.prev = 44;
                    if (!(_iteratorAbruptCompletion1 && _iterator1.return != null)) {
                        _ctx.next = 48;
                        break;
                    }
                    _ctx.next = 48;
                    return _iterator1.return();
                case 48:
                    _ctx.prev = 48;
                    if (!_didIteratorError1) {
                        _ctx.next = 51;
                        break;
                    }
                    throw _iteratorError1;
                case 51:
                    return _ctx.finish(48);
                case 52:
                    return _ctx.finish(43);
                case 53:
                    _iteratorAbruptCompletion2 = false, _didIteratorError2 = false;
                    _ctx.prev = 54;
                    _iterator2 = _async_iterator(iterableOfPromise);
                case 56:
                    _ctx.next = 58;
                    return _await_async_generator(_iterator2.next());
                case 58:
                    if (!(_iteratorAbruptCompletion2 = !(_step2 = _ctx.sent).done)) {
                        _ctx.next = 63;
                        break;
                    }
                    {
                        _value2 = _step2.value;
                        x2 = _value2;
                    }
                case 60:
                    _iteratorAbruptCompletion2 = false;
                    _ctx.next = 56;
                    break;
                case 63:
                    _ctx.next = 69;
                    break;
                case 65:
                    _ctx.prev = 65;
                    _ctx.t2 = _ctx["catch"](54);
                    _didIteratorError2 = true;
                    _iteratorError2 = _ctx.t2;
                case 69:
                    _ctx.prev = 69;
                    _ctx.prev = 70;
                    if (!(_iteratorAbruptCompletion2 && _iterator2.return != null)) {
                        _ctx.next = 74;
                        break;
                    }
                    _ctx.next = 74;
                    return _iterator2.return();
                case 74:
                    _ctx.prev = 74;
                    if (!_didIteratorError2) {
                        _ctx.next = 77;
                        break;
                    }
                    throw _iteratorError2;
                case 77:
                    return _ctx.finish(74);
                case 78:
                    return _ctx.finish(69);
                case 79:
                    _iteratorAbruptCompletion3 = false, _didIteratorError3 = false;
                    _ctx.prev = 80;
                    _iterator3 = _async_iterator(asyncIterable);
                case 82:
                    _ctx.next = 84;
                    return _await_async_generator(_iterator3.next());
                case 84:
                    if (!(_iteratorAbruptCompletion3 = !(_step3 = _ctx.sent).done)) {
                        _ctx.next = 89;
                        break;
                    }
                    {
                        _value3 = _step3.value;
                        y = _value3;
                    }
                case 86:
                    _iteratorAbruptCompletion3 = false;
                    _ctx.next = 82;
                    break;
                case 89:
                    _ctx.next = 95;
                    break;
                case 91:
                    _ctx.prev = 91;
                    _ctx.t3 = _ctx["catch"](80);
                    _didIteratorError3 = true;
                    _iteratorError3 = _ctx.t3;
                case 95:
                    _ctx.prev = 95;
                    _ctx.prev = 96;
                    if (!(_iteratorAbruptCompletion3 && _iterator3.return != null)) {
                        _ctx.next = 100;
                        break;
                    }
                    _ctx.next = 100;
                    return _iterator3.return();
                case 100:
                    _ctx.prev = 100;
                    if (!_didIteratorError3) {
                        _ctx.next = 103;
                        break;
                    }
                    throw _iteratorError3;
                case 103:
                    return _ctx.finish(100);
                case 104:
                    return _ctx.finish(95);
                case 105:
                    _iteratorAbruptCompletion4 = false, _didIteratorError4 = false;
                    _ctx.prev = 106;
                    _iterator4 = _async_iterator(iterable);
                case 108:
                    _ctx.next = 110;
                    return _await_async_generator(_iterator4.next());
                case 110:
                    if (!(_iteratorAbruptCompletion4 = !(_step4 = _ctx.sent).done)) {
                        _ctx.next = 115;
                        break;
                    }
                    {
                        _value4 = _step4.value;
                        y = _value4;
                    }
                case 112:
                    _iteratorAbruptCompletion4 = false;
                    _ctx.next = 108;
                    break;
                case 115:
                    _ctx.next = 121;
                    break;
                case 117:
                    _ctx.prev = 117;
                    _ctx.t4 = _ctx["catch"](106);
                    _didIteratorError4 = true;
                    _iteratorError4 = _ctx.t4;
                case 121:
                    _ctx.prev = 121;
                    _ctx.prev = 122;
                    if (!(_iteratorAbruptCompletion4 && _iterator4.return != null)) {
                        _ctx.next = 126;
                        break;
                    }
                    _ctx.next = 126;
                    return _iterator4.return();
                case 126:
                    _ctx.prev = 126;
                    if (!_didIteratorError4) {
                        _ctx.next = 129;
                        break;
                    }
                    throw _iteratorError4;
                case 129:
                    return _ctx.finish(126);
                case 130:
                    return _ctx.finish(121);
                case 131:
                    _iteratorAbruptCompletion5 = false, _didIteratorError5 = false;
                    _ctx.prev = 132;
                    _iterator5 = _async_iterator(iterableOfPromise);
                case 134:
                    _ctx.next = 136;
                    return _await_async_generator(_iterator5.next());
                case 136:
                    if (!(_iteratorAbruptCompletion5 = !(_step5 = _ctx.sent).done)) {
                        _ctx.next = 141;
                        break;
                    }
                    {
                        _value5 = _step5.value;
                        y = _value5;
                    }
                case 138:
                    _iteratorAbruptCompletion5 = false;
                    _ctx.next = 134;
                    break;
                case 141:
                    _ctx.next = 147;
                    break;
                case 143:
                    _ctx.prev = 143;
                    _ctx.t5 = _ctx["catch"](132);
                    _didIteratorError5 = true;
                    _iteratorError5 = _ctx.t5;
                case 147:
                    _ctx.prev = 147;
                    _ctx.prev = 148;
                    if (!(_iteratorAbruptCompletion5 && _iterator5.return != null)) {
                        _ctx.next = 152;
                        break;
                    }
                    _ctx.next = 152;
                    return _iterator5.return();
                case 152:
                    _ctx.prev = 152;
                    if (!_didIteratorError5) {
                        _ctx.next = 155;
                        break;
                    }
                    throw _iteratorError5;
                case 155:
                    return _ctx.finish(152);
                case 156:
                    return _ctx.finish(147);
                case 157:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                13,
                17,
                27
            ],
            [
                18,
                ,
                22,
                26
            ],
            [
                28,
                39,
                43,
                53
            ],
            [
                44,
                ,
                48,
                52
            ],
            [
                54,
                65,
                69,
                79
            ],
            [
                70,
                ,
                74,
                78
            ],
            [
                80,
                91,
                95,
                105
            ],
            [
                96,
                ,
                100,
                104
            ],
            [
                106,
                117,
                121,
                131
            ],
            [
                122,
                ,
                126,
                130
            ],
            [
                132,
                143,
                147,
                157
            ],
            [
                148,
                ,
                152,
                156
            ]
        ]);
    }));
    return _f2.apply(this, arguments);
}
