const React = require("react");
class RC1 extends React.Component {
    render() {
        return null;
    }
}
class RC2 extends React.Component {
    render() {
        return null;
    }
    method() {
    }
}
class RC3 extends React.Component {
    render() {
        return null;
    }
}
class RC4 extends React.Component {
    render() {
        return null;
    }
}
React.createElement(RC1 || RC2, {
    x: !0
}), React.createElement(RC1 || RC4, {
    x: 10
}), React.createElement(RC3 || RC4, {
    prop: !0
});
export { };
