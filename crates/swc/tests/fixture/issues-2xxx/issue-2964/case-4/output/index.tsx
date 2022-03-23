"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnElement = void 0;
const AnElement = ({ prop1 , prop2 , prop3 , num , data  })=>{
    return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(SomeElement, {
        prop1: prop1,
        prop2: true,
        /* istanbul ignore if */ style: num > 0 ? data.name : undefined
    }), // istanbul ignore next
    !(num > 0) && data.name && /*#__PURE__*/ React.createElement(React.Fragment, null, '"Hello"'));
};
exports.AnElement = AnElement;
