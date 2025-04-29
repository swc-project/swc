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
})(this, function(exports, _SS, _ST, _SC, _S, _PTUs, _SDUs) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get C () {
            return C;
        },
        get ILIAN () {
            return _ST.ILIAN;
        },
        get IWI () {
            return _ST.IWI;
        },
        get SASC () {
            return _S.SASC;
        },
        get SC () {
            return _SC.SC;
        },
        get SETs () {
            return SETs;
        },
        get SI () {
            return SI;
        },
        get SM () {
            return _ST.SM;
        },
        get SSERT () {
            return _ST.S_E_R_T;
        },
        get VP () {
            return _ST.VP;
        },
        get cSEP () {
            return _S.cSEP;
        },
        get iCSEPFT () {
            return _S.iCSEPFT;
        },
        get us () {
            return us;
        }
    });
    const SETs = {
        [_ST.S_E_T]: _ST.S_E_T
    };
    const SI = {
        [SETs[_ST.S_E_T]]: _SS.SI
    };
    const iCSP = async ()=>{
        return Promise.resolve(_S.cSP);
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
                gTFNDP: _PTUs.gTFNDP,
                gTFPP: _PTUs.gTFPP,
                vT: _PTUs.vT
            }
        },
        ds: {
            D_C_E: _SDUs.D_C_E,
            cDC: _SDUs.cDC,
            cIRTI: _SDUs.cIRTI,
            CPC: _SDUs.CPC,
            rCW: _SDUs.rCW,
            SDC: _SDUs.SDC,
            WL: _SDUs.WL,
            TS: _SDUs.TS
        }
    };
    const C = {
        ..._PTUs.C
    };
});
