define([
    "require",
    "exports",
    "./path/to/SS",
    "./path/to/ST",
    "./path/to/SC",
    "./path/to/S",
    "./path/to/PTUs",
    "./path/to/SDUs"
], function(require, exports, _ss, _st, _sc, _s, _pt_us, _sd_us) {
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
                gTFNDP: _pt_us.gTFNDP,
                gTFPP: _pt_us.gTFPP,
                vT: _pt_us.vT
            }
        },
        ds: {
            D_C_E: _sd_us.D_C_E,
            cDC: _sd_us.cDC,
            cIRTI: _sd_us.cIRTI,
            CPC: _sd_us.CPC,
            rCW: _sd_us.rCW,
            SDC: _sd_us.SDC,
            WL: _sd_us.WL,
            TS: _sd_us.TS
        }
    };
    const C = {
        ..._pt_us.C
    };
});
