var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
function f(a) {
    a = 1;
}
function f(a) {
    function f3() {
        a = 1;
    }
}
function f(a) {
    a.prop = 1;
    a.prop = 1;
    a.prop = 1;
    (0, a).prop = 1;
    a.prop = 1;
    a.prop = 1, void 0;
    a.prop.b = 1;
}
function f(a) {
    a++;
    ++a;
    a.prop++;
    ++a.prop;
}
function f(a) {
    for(var _i = 0, _iter = []; _i < _iter.length; _i++){
        a = _iter[_i];
    }
    for(var _i1 = 0, _iter1 = []; _i1 < _iter1.length; _i1++){
        var _$a = _iter1[_i1];
    }
    for(a in []){}
    for(var _$a1 in []){}
}
function f(a) {
    delete a.x;
}
function f(a, b, c) {
    a = ({}).a;
    var ref;
    ref = {}, a = ref.a, b = ref.b, ref;
    var ref1;
    ref1 = {}, a = ref1.a, b = ref1.b, c = ref1.k.c, ref1;
    var ref2;
    ref2 = [], a = ref2[0], ref2;
    var ref3, ref4, ref5;
    ref3 = [], ref4 = ref3[0], a = ref4.a, ref4, ref5 = _sliced_to_array._(ref3[1], 1), b = ref5[0], ref5, ref3;
}
function f(a, param, param1) {
    var b = param.b, c = param.k.c, _param_k2 = _sliced_to_array._(param.k2, 1), d = _param_k2[0], _param = _sliced_to_array._(param1, 3), e = _param[0], _param_ = _sliced_to_array._(_param[1], 1), f = _param_[0], g = _param[2].g;
    a = 1;
    b = 1;
    c = 1;
    d = 1;
    e = 1;
    f = 1;
    g = 1;
}
function f(a) {
    alert(a);
}
