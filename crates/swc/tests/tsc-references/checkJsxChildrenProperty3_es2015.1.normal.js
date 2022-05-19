// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class FetchUser extends React.Component {
    render() {
        return this.state ? this.props.children(this.state.result) : null;
    }
}
// Ok
function UserName0() {
    return /*#__PURE__*/ React.createElement(FetchUser, null, (user)=>/*#__PURE__*/ React.createElement("h1", null, user.Name));
}
function UserName1() {
    return /*#__PURE__*/ React.createElement(FetchUser, null, (user)=>/*#__PURE__*/ React.createElement("h1", null, user.Name));
}
export { };
