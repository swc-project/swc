// @jsx: preserve
//@filename: react.d.ts
//@filename: app.tsx
import * as React from 'react';
export class Text extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement(this, null) // this should be an error
        ;
    }
    constructor(...args){
        super(...args);
        this._tagName = 'div';
    }
}
