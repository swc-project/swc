define([
    "require",
    "exports",
    "./Bar"
], function(require, exports, _Bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const makeX = (props)=>{
        const _bar = props.bar;
        const { list  } = _bar;
        return list.map(()=>_Bar.bar);
    };
});
