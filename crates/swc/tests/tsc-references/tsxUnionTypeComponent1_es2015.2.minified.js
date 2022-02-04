const React = require("react");
class MyComponent extends React.Component {
    render() {
        const { AnyComponent  } = this.props;
        return React.createElement(AnyComponent, null);
    }
}
React.createElement(MyComponent, {
    AnyComponent: ()=>React.createElement("button", null, "test")
});
class MyButtonComponent extends React.Component {
}
React.createElement(MyComponent, {
    AnyComponent: MyButtonComponent
});
export { };
