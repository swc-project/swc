import React from "react";

export default function Foo() {
    return (
        <div
            onClick={async (e) => {
                await doSomething();
            }}
        ></div>
    );
}

Foo.displayName = "Foo";
