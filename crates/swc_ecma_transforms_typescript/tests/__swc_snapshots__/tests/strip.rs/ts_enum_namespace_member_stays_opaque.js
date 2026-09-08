var Fwd = function(Fwd) {
    Fwd[Fwd["A"] = Later.baz] = "A";
    Fwd["B"] = "b";
    return Fwd;
}(Fwd || {});
(function(Later) {
    Later.baz = "u";
})(Later || (Later = {}));
(function(NotExported) {
    const hidden = "h";
})(NotExported || (NotExported = {}));
var Hid = function(Hid) {
    Hid[Hid["A"] = NotExported.hidden] = "A";
    Hid["B"] = "b";
    return Hid;
}(Hid || {});
(function(Mut) {
    Mut.m = "v";
})(Mut || (Mut = {}));
var MutE = function(MutE) {
    MutE[MutE["A"] = Mut.m] = "A";
    MutE["B"] = "b";
    return MutE;
}(MutE || {});
const objLit = {
    k: "w"
};
var Obj = function(Obj) {
    Obj[Obj["A"] = objLit.k] = "A";
    Obj["B"] = "b";
    return Obj;
}(Obj || {});
var H = function(H) {
    H[H["A"] = D2.c] = "A";
    H["B"] = "b";
    return H;
}(H || {});
(function(T) {
    T.typed = "annotated";
})(T || (T = {}));
var Typed = function(Typed) {
    Typed[Typed["A"] = T.typed] = "A";
    Typed["B"] = "b";
    return Typed;
}(Typed || {});
(function(Outer) {
    (function(Hidden) {
        Hidden.v = "h";
    })(Hidden || (Hidden = {}));
    var Hidden;
})(Outer || (Outer = {}));
var Nested = function(Nested) {
    Nested[Nested["A"] = Outer.Hidden.v] = "A";
    Nested["B"] = "b";
    return Nested;
}(Nested || {});
(function(WithHidden) {
    WithHidden.live = 0;
})(WithHidden || (WithHidden = {}));
var FalseAmbient = function(FalseAmbient) {
    FalseAmbient[FalseAmbient["A"] = WithHidden.hidden] = "A";
    FalseAmbient["B"] = "b";
    return FalseAmbient;
}(FalseAmbient || {});
var LateConst = function(LateConst) {
    LateConst[LateConst["A"] = LaterNs.b] = "A";
    LateConst["B"] = "b";
    return LateConst;
}(LateConst || {});
(function(LaterNs) {
    LaterNs.b = "post";
})(LaterNs || (LaterNs = {}));
var LateEnum = function(LateEnum) {
    LateEnum[LateEnum["A"] = LaterEnumNs.Inner.X] = "A";
    LateEnum["B"] = "b";
    return LateEnum;
}(LateEnum || {});
(function(Elem) {
    (function(Seg) {
        Seg.x = 1;
    })(Elem.Seg || (Elem.Seg = {}));
    Elem.y = 2;
})(Elem || (Elem = {}));
var ComputedSeg = function(ComputedSeg) {
    ComputedSeg[ComputedSeg["A"] = Elem["Seg"].x] = "A";
    ComputedSeg["B"] = "b";
    return ComputedSeg;
}(ComputedSeg || {});
var ComputedProp = function(ComputedProp) {
    ComputedProp[ComputedProp["A"] = Elem["y"]] = "A";
    ComputedProp["B"] = "b";
    return ComputedProp;
}(ComputedProp || {});
var TplSeg = function(TplSeg) {
    TplSeg[TplSeg["A"] = Elem[`Seg`].x] = "A";
    TplSeg["B"] = "b";
    return TplSeg;
}(TplSeg || {});
(function(Paren) {
    Paren.p = "p";
})(Paren || (Paren = {}));
var ParenObj = function(ParenObj) {
    ParenObj[ParenObj["A"] = Paren.p] = "A";
    ParenObj["B"] = "b";
    return ParenObj;
}(ParenObj || {});
const global = {
    g: 99
};
var GlobalObj = function(GlobalObj) {
    GlobalObj[GlobalObj["A"] = global.g] = "A";
    GlobalObj["B"] = "b";
    return GlobalObj;
}(GlobalObj || {});
(function(PrivAmb) {
    PrivAmb.live = 0;
})(PrivAmb || (PrivAmb = {}));
var HiddenEnum = function(HiddenEnum) {
    HiddenEnum[HiddenEnum["A"] = PrivAmb.HiddenE.X] = "A";
    HiddenEnum["B"] = "b";
    return HiddenEnum;
}(HiddenEnum || {});
(function(PrivNs) {
    PrivNs.live = 0;
})(PrivNs || (PrivNs = {}));
var HiddenNs = function(HiddenNs) {
    HiddenNs[HiddenNs["A"] = PrivNs.HiddenN.x] = "A";
    HiddenNs["B"] = "b";
    return HiddenNs;
}(HiddenNs || {});
(function(PrivC) {
    PrivC.live = 0;
})(PrivC || (PrivC = {}));
var HiddenConst = function(HiddenConst) {
    HiddenConst[HiddenConst["A"] = PrivC.HiddenC.Z] = "A";
    HiddenConst["B"] = "b";
    return HiddenConst;
}(HiddenConst || {});
(function(LaterEnumNs) {
    (function(Inner) {
        Inner[Inner["X"] = 1] = "X";
    })(LaterEnumNs.Inner || (LaterEnumNs.Inner = {}));
})(LaterEnumNs || (LaterEnumNs = {}));
var Later, NotExported, Mut, T, Outer, WithHidden, LaterNs, Elem, Paren, PrivAmb, PrivNs, PrivC, LaterEnumNs;
