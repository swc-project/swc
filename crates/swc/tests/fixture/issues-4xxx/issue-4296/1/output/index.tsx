import React from "react";
const SomeList = ({ callback  })=>{
    callback();
    return /*#__PURE__*/ React.createElement("div", null);
};
const list = [
    0
];
const MyComponent = ()=>{
    return /*#__PURE__*/ React.createElement("div", null, list.map(()=>true ? /*#__PURE__*/ React.createElement(SomeList, {
            callback: ()=>console.log("do something")
        }) : /*#__PURE__*/ React.createElement("div", null)
    ));
};
