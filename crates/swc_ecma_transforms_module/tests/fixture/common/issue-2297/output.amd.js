define([
    "require",
    "./Bar"
], function(require, _bar) {
    "use strict";
    const makeX = (props)=>{
        const _bar1 = props.bar;
        const { list  } = _bar1;
        return list.map(()=>_bar.bar);
    };
});
