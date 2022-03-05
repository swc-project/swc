import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    /**
     * @readonly
     */ this.readonlyCall = Symbol();
    this.readwriteCall = Symbol();
};
/**
     * @readonly
     */ C.readonlyStaticCall = Symbol();
/**
     * @type {unique symbol}
     * @readonly
     */ C.readonlyStaticTypeAndCall = Symbol();
C.readwriteStaticCall = Symbol();
