const React = require("react");
class MyComponent extends React.Component {
    render() {
        const { AnyComponent  } = this.props;
        return React.createElement(AnyComponent, null);
    }
}
class MyButtonComponent extends React.Component {
}
export { };
