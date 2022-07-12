//@jsx: preserve
//@module: amd
//@filename: react.d.ts
//@filename: file.tsx
class MyComponent {
    render() {}
}
// Should be an OK
var x = /*#__PURE__*/ React.createElement(MyComponent, {
    bar: "world"
});
