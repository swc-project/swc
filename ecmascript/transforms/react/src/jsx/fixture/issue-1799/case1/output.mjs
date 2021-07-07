import React from "react";
export default function Foo() {
    return React.createElement("div", {
        onClick: async (e)=>{
            await doSomething();
        }
    });
};
Foo.displayName = "Foo";
