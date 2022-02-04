//@filename: app.tsx
import * as React from 'react';
//@filename: button.tsx
import * as React from 'react';
export class App extends React.Component {
    render() {
        return(/*#__PURE__*/ React.createElement(Button, null));
    }
}
export class Button extends React.Component {
    render() {
        return(/*#__PURE__*/ React.createElement("button", null, "Some button"));
    }
}
