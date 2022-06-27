// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class MyComponent extends React.Component {
    render() {
        const { AnyComponent  } = this.props;
        return /*#__PURE__*/ React.createElement(AnyComponent, null);
    }
}
// Stateless Component As Props
/*#__PURE__*/ React.createElement(MyComponent, {
    AnyComponent: ()=>/*#__PURE__*/ React.createElement("button", null, "test")
});
// Component Class as Props
class MyButtonComponent extends React.Component {
}
/*#__PURE__*/ React.createElement(MyComponent, {
    AnyComponent: MyButtonComponent
});
export { };
