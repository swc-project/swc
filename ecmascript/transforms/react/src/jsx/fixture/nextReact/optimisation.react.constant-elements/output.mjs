var _ref = <div className="navbar-header">
      <a className="navbar-brand" href="/">
        <img src="/img/logo/logo-96x36.png" />
      </a>
    </div>;

let App = /*#__PURE__*/function (_React$Component) {
  babelHelpers.inherits(App, _React$Component);

  var _super = babelHelpers.createSuper(App);

  function App() {
    babelHelpers.classCallCheck(this, App);
    return _super.apply(this, arguments);
  }

  babelHelpers.createClass(App, [{
    key: "render",
    value: function render() {
      const navbarHeader = _ref;
      return <div>
      <nav className="navbar navbar-default">
        <div className="container">
          {navbarHeader}
        </div>
      </nav>
    </div>;
    }
  }]);
  return App;
}(React.Component);
