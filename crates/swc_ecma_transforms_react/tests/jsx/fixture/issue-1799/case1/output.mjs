// Foo.jsx
import React from "react";
export default function Foo() {
    return /*#__PURE__*/ React.createElement("div", {
        onClick: async (e)=>{
            await doSomething();
        }
    });
};
Foo.displayName = "Foo";
