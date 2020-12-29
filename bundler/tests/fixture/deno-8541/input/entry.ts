const React = {
    createElement: function (...args: any[]) { console.log(args) }
}

React.createElement("span", null, "\u{b7}")