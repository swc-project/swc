//@jsx: preserve
//@module: commonjs
//@filename: react.d.ts
//@filename: app.tsx
import * as React from 'react';
// Should see var button_1 = require('./button') here
import { Button } from './button';
export class App extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement(Button, null);
    }
}
//@filename: button.tsx
import * as React from 'react';
export class Button extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("button", null, "Some button");
    }
}
