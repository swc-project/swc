//@filename: app.tsx
import * as React from 'react';
export class Text extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement(this._tagName, null, " Hello world ");
    }
    constructor(...args){
        super(...args);
        this._tagName = 'div';
    }
}
