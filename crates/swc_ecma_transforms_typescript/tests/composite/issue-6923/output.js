import ReactDOM from "react-dom";
import { _Component } from "./Component";
const App = React.createElement("div", null, React.createElement(_Component, null), React.createElement("p", null, "Hello World"));
ReactDOM.render(App, window.document.getElementById("react_root"));
