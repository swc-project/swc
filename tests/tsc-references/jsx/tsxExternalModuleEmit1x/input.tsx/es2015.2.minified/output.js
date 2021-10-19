import * as React from "react";
import * as React from "react";
export class App extends React.Component {
    render() {
        return React.createElement(Button, null);
    }
}
export class Button extends React.Component {
    render() {
        return React.createElement("button", null, "Some button");
    }
}
