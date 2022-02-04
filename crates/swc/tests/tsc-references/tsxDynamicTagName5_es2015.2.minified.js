import * as React from "react";
export class Text extends React.Component {
    render() {
        return React.createElement(this._tagName, null);
    }
    constructor(...args){
        super(...args), this._tagName = "div";
    }
}
