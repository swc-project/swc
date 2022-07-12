//@jsx: preserve
//@module: amd
//@filename: react.d.ts
//@filename: file.tsx
export class MyComponent {
    render() {}
}
// Should be an error
/*#__PURE__*/ React.createElement(MyComponent, {
    bar: "world"
});
// Should be OK
/*#__PURE__*/ React.createElement(MyComponent, {
    bar: true
});
// Should be ok
/*#__PURE__*/ React.createElement(MyComponent, {
    "data-bar": "hello"
});
