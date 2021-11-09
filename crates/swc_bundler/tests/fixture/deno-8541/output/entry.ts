const React = {
    createElement: function(...args) {
        console.log(args);
    }
};
React.createElement("span", null, "\u{b7}");
