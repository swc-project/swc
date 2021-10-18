import * as React from "react";
React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: function(a) {
        return a;
    }
}), React.createElement(GenericComponent, {
    initialValues: 12,
    nextValues: function(a) {
        return a;
    }
}), React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: function(a) {
        return {
            x: a.x
        };
    }
}), React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: function(a) {
        return a.x;
    }
});
