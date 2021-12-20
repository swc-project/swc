//@filename: file.tsx
export class MyComponent {
    render() {
    }
}
/*#__PURE__*/ React.createElement(MyComponent, {
    foo: "bar"
}); // ok  
/*#__PURE__*/ React.createElement(MyComponent, {
    foo: 0
}); // should be an error
