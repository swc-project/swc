"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    AnElement: function() {
        return AnElement;
    }
});
const AnElement = ({ prop1 , prop2 , prop3 , num , data  })=>{
    return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(SomeElement, {
        prop1: prop1,
        prop2: true,
        /* istanbul ignore if */ style: num > 0 ? data.name : undefined
    }), // istanbul ignore next
    !(num > 0) && data.name && /*#__PURE__*/ React.createElement(React.Fragment, null, '"Hello"'));
};
