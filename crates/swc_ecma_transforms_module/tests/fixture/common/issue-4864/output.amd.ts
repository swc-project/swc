define([
    "require",
    "exports",
    "./path/to/SS",
    "./path/to/ST",
    "./path/to/SC",
    "./path/to/S",
    "./path/to/PTUs",
    "./path/to/SDUs"
], function(require, exports, _ss, _st, _sc, _s, _ptus, _sdus) {
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
        SI: ()=>SI,
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
