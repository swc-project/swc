(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./path/to/SS"), require("./path/to/ST"), require("./path/to/SC"), require("./path/to/S"), require("./path/to/PTUs"), require("./path/to/SDUs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./path/to/SS",
        "./path/to/ST",
        "./path/to/SC",
        "./path/to/S",
        "./path/to/PTUs",
        "./path/to/SDUs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.ss, global.st, global.sc, global.s, global.ptus, global.sdus);
})(this, function(exports, _ss, _st, _sc, _s, _ptus, _sdus) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        SETs: ()=>SETs,
        SI: ()=>_ss.SI,
        SSERT: ()=>_st.S_E_R_T,
        ILIAN: ()=>_st.ILIAN,
        IWI: ()=>_st.IWI,
        SM: ()=>_st.SM,
        VP: ()=>_st.VP,
        SC: ()=>_sc.SC,
        cSEP: ()=>_s.cSEP,
        iCSEPFT: ()=>_s.iCSEPFT,
        SASC: ()=>_s.SASC,
        us: ()=>us,
        C: ()=>C
    });
    const SETs = {
        [_st.S_E_T]: _st.S_E_T as typeof SSET
    };
    const SI = {
        [SETs[_st.S_E_T]]: _ss.SI
    };
    const iCSP = async ()=>{
        return Promise.resolve(_s.cSP);
    };
    p.eE({
        i: "s",
        eP: "s.o.sEP",
        d: 0,
        f: iCSP
    });
    const us = {
        e: {
            p: {
                gTFNDP: _ptus.gTFNDP,
                gTFPP: _ptus.gTFPP,
                vT: _ptus.vT
            }
        },
        ds: {
            D_C_E: _sdus.D_C_E,
            cDC: _sdus.cDC,
            cIRTI: _sdus.cIRTI,
            CPC: _sdus.CPC,
            rCW: _sdus.rCW,
            SDC: _sdus.SDC,
            WL: _sdus.WL,
            TS: _sdus.TS
        }
    };
    const C = {
        ..._ptus.C
    };
});
