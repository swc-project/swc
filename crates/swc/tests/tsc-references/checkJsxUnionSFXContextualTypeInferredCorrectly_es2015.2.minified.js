import React from "react";
export function ComponentWithUnion() {
    return React.createElement("h1", null);
}
export function HereIsTheError() {
    return React.createElement(ComponentWithUnion, {
        multi: !1,
        value: "s",
        onChange: (val)=>console.log(val)
    });
}
ComponentWithUnion({
    multi: !1,
    value: "s",
    onChange: (val)=>console.log(val)
});
