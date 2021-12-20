//@filename: file.tsx
class MyComponent {
    render() {
    }
}
// Should be an OK
var x = /*#__PURE__*/ React.createElement(MyComponent, {
    bar: "world"
});
