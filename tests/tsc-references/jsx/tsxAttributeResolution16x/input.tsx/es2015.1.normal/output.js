// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
export class AddressComp extends React.Component {
    render() {
        return null;
    }
}
let a = /*#__PURE__*/ React.createElement(AddressComp, {
    postalCode: "T1B 0L3",
    street: "vancouver",
    country: "CA"
});
