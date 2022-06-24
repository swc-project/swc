define([
    "require",
    "exports",
    "./Bar"
], function(require, exports, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const makeX = (props)=>{
        const _bar1 = props.bar;
        const { list  } = _bar1;
        return list.map(()=>_bar.bar);
    };
});
