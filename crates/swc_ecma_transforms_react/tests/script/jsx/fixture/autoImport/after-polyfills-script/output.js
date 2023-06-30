// https://github.com/babel/babel/issues/12522
const { jsx: _jsx } = require("react/jsx-runtime");
require("react-app-polyfill/ie11");
require("react-app-polyfill/stable");
const ReactDOM = require("react-dom");
ReactDOM.render(/*#__PURE__*/ _jsx("p", {
    children: "Hello, World!"
}), document.getElementById("root"));
