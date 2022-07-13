//@jsx: preserve
//@module: amd
//@filename: react.d.ts
//@filename: file.tsx
export class MyComponent {
    render() {}
}
/*#__PURE__*/ React.createElement(MyComponent, {
    foo: "bar"
}); // ok  
/*#__PURE__*/ React.createElement(MyComponent, {
    foo: 0
}); // should be an error
