define([
    "require",
    "exports",
    "./path/to/SS",
    "./path/to/ST",
    "./path/to/SC",
    "./path/to/S",
    "./path/to/PTUs",
    "./path/to/SDUs"
], function(require, exports, _SS, _ST, _SC, _S, _PTUs, _SDUs) {
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
        SETs: function() {
            return SETs;
        },
        SI: function() {
            return SI;
        },
        SSERT: function() {
            return _ST.S_E_R_T;
        },
        ILIAN: function() {
            return _ST.ILIAN;
        },
        IWI: function() {
            return _ST.IWI;
        },
        SM: function() {
            return _ST.SM;
        },
        VP: function() {
            return _ST.VP;
        },
        SC: function() {
            return _SC.SC;
        },
        cSEP: function() {
            return _S.cSEP;
        },
        iCSEPFT: function() {
            return _S.iCSEPFT;
        },
        SASC: function() {
            return _S.SASC;
        },
        us: function() {
            return us;
        },
        C: function() {
            return C;
        }
    });
    const SETs = {
        [_ST.S_E_T]: _ST.S_E_T as typeof SSET
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
