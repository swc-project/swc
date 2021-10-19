import * as React from "react";
React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: (a)=>a
}), React.createElement(GenericComponent, {
    initialValues: 12,
    nextValues: (a)=>a
}), React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: (a)=>({
            x: a.x
        })
}), React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: (a)=>a.x
});
