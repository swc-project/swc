import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
const SomeList = ({ callback })=>{
    callback();
    return /*#__PURE__*/ _jsx("div", {});
};
const list = [
    0
];
const MyComponent = ()=>{
    return /*#__PURE__*/ _jsx("div", {
        children: list.map(()=>true ? /*#__PURE__*/ _jsx(SomeList, {
                callback: ()=>console.log("do something")
            }) : /*#__PURE__*/ _jsx("div", {}))
    });
};
