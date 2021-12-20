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
var EmptyRCComp = RC3 || RC4, PartRCComp = RC1 || RC4;
React.createElement(RC1 || RC2, {
    x: "Hi"
}), React.createElement(EmptyRCComp, null), React.createElement(EmptyRCComp, {
    "data-prop": "hello"
}), React.createElement(PartRCComp, null), React.createElement(PartRCComp, {
    "data-extra": "hello"
});
export { };
