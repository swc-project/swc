use super::*;
use crate::{
    compat::{
        es2015::{arrow, Classes},
        es3::PropertyLiteral,
    },
    modules::common_js::common_js,
    react::display_name,
};
use swc_common::{chain, Mark};

fn tr(options: Options) -> impl Fold<Module> {
    chain!(jsx(options), display_name(), Classes::default(), arrow(),)
}

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_add_appropriate_newlines,
    r#"
<Component
  {...props}
  sound="moo" />
"#,
    r#"
React.createElement(Component, _extends({}, props, {
  sound: "moo"
}));
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_arrow_functions,
    r#"
var foo = function () {
  return () => <this />;
};

var bar = function () {
  return () => <this.foo />;
};
"#,
    r#"
var foo = function() {
    return (function() {
        return React.createElement(this, null);
    }).bind(this);
};
var bar = function() {
    return (function() {
        return React.createElement(this.foo, null);
    }).bind(this);
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_concatenates_adjacent_string_literals,
    r#"
var x =
  <div>
    foo
    {"bar"}
    baz
    <div>
      buz
      bang
    </div>
    qux
    {null}
    quack
  </div>
  "#,
    r#"
var x = React.createElement(
  "div",
  null,
  "foo",
  "bar",
  "baz",
  React.createElement("div", null, "buz bang"),
  "qux",
  null,
  "quack"
);
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_display_name_assignment_expression,
    r#"var Component;
Component = React.createClass({
  render: function render() {
  return null;
  }
});"#,
    r#"
var Component;
Component = React.createClass({
  render: function render() {
    return null;
  },
  displayName: "Component",
});"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_display_name_export_default,
    r#"
export default React.createClass({
  render: function render() {
    return null;
  }
});
"#,
    r#"
export default React.createClass({
  render: function render() {
    return null;
  },
  displayName: "input",
});
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_display_name_if_missing,
    r#"
var Whateva = React.createClass({
  displayName: "Whatever",
  render: function render() {
    return null;
  }
});

var Bar = React.createClass({
  "displayName": "Ba",
  render: function render() {
    return null;
  }
});
"#,
    r#"
var Whateva = React.createClass({
  displayName: "Whatever",
  render: function render() {
    return null;
  }
});
var Bar = React.createClass({
  "displayName": "Ba",
  render: function render() {
    return null;
  }
});
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_display_name_object_declaration,
    r#"
exports = {
  Component: React.createClass({
    render: function render() {
      return null;
    }
  })
};"#,
    r#"
exports = {
  Component: React.createClass({
    render: function render() {
      return null;
    },
    displayName: "Component",
  })
};"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_display_name_property_assignment,
    r#"
exports.Component = React.createClass({
  render: function render() {
  return null;
  }
});
"#,
    r#"
exports.Component = React.createClass({
  render: function render() {
    return null;
  },
  displayName: "Component",
});
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_display_name_variable_declaration,
    r#"
var Component = React.createClass({
  render: function render() {
    return null;
  }
});
"#,
    r#"
var Component = React.createClass({
  render: function render() {
    return null;
  },
  displayName: "Component",
});
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_dont_coerce_expression_containers,
    r#"
<Text>
  To get started, edit index.ios.js!!!{"\n"}
  Press Cmd+R to reload
</Text>
"#,
    r#"React.createElement(
  Text,
  null,
  "To get started, edit index.ios.js!!!",
  "\n",
  "Press Cmd+R to reload"
);
"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_honor_custom_jsx_comment_if_jsx_pragma_option_set,
    r#"/** @jsx dom */

<Foo></Foo>;

var profile = <div>
  <img src="avatar.png" className="profile" />
  <h3>{[user.firstName, user.lastName].join(" ")}</h3>
</div>;"#,
    r#"/** @jsx dom */
dom(Foo, null);
var profile = dom("div", null, dom("img", {
  src: "avatar.png",
  className: "profile"
}), dom("h3", null, [user.firstName, user.lastName].join(" ")));
"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_honor_custom_jsx_comment,
    r#"
/** @jsx dom */

<Foo></Foo>;

var profile = <div>
  <img src="avatar.png" className="profile" />
  <h3>{[user.firstName, user.lastName].join(" ")}</h3>
</div>;
"#,
    r#"
/** @jsx dom */
dom(Foo, null);
var profile = dom("div", null, dom("img", {
  src: "avatar.png",
  className: "profile"
}), dom("h3", null, [user.firstName, user.lastName].join(" ")));
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Options {
        pragma: "dom".into(),
        ..Default::default()
    }),
    react_honor_custom_jsx_pragma_option,
    r#"

<Foo></Foo>;

var profile = <div>
  <img src="avatar.png" className="profile" />
  <h3>{[user.firstName, user.lastName].join(" ")}</h3>
</div>;"#,
    r#"
dom(Foo, null);
var profile = dom("div", null, dom("img", {
  src: "avatar.png",
  className: "profile"
}), dom("h3", null, [user.firstName, user.lastName].join(" ")));"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_jsx_with_retainlines_option,
    r#"var div = <div>test</div>;"#,
    r#"var div = React.createElement("div", null, "test");"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_jsx_without_retainlines_option,
    r#"var div = <div>test</div>;"#,
    r#"var div = React.createElement("div", null, "test");"#
);

test!(
    // Optimization is not implemented yet
    ignore,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_optimisation_react_constant_elements,
    r#"
class App extends React.Component {
  render() {
    const navbarHeader = <div className="navbar-header">
      <a className="navbar-brand" href="/">
        <img src="/img/logo/logo-96x36.png" />
      </a>
    </div>;

    return <div>
      <nav className="navbar navbar-default">
        <div className="container">
          {navbarHeader}
        </div>
      </nav>
    </div>;
  }
}
"#,
    r#"
var _ref =
/*#__PURE__*/
<div className="navbar-header">
      <a className="navbar-brand" href="/">
        <img src="/img/logo/logo-96x36.png" />
      </a>
    </div>;

let App =
/*#__PURE__*/
function (_React$Component) {
  "use strict";

  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);
    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
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
}(React.Component);"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| chain!(tr(Default::default()), PropertyLiteral),
    react_should_add_quotes_es3,
    r#"var es3 = <F aaa new const var default foo-bar/>;"#,
    r#"
var es3 = React.createElement(F, {
  aaa: true,
  "new": true,
  "const": true,
  "var": true,
  "default": true,
  "foo-bar": true
});
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_allow_constructor_as_prop,
    r#"<Component constructor="foo" />;"#,
    r#"
React.createElement(Component, {
  constructor: "foo"
});
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_allow_deeper_js_namespacing,
    r#"<Namespace.DeepNamespace.Component />;"#,
    r#"React.createElement(Namespace.DeepNamespace.Component, null);"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_allow_elements_as_attributes,
    r#"<div attr=<div /> />"#,
    r#"
React.createElement("div", {
  attr: React.createElement("div", null)
});"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_allow_js_namespacing,
    r#"<Namespace.Component />;"#,
    r#"React.createElement(Namespace.Component, null);"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_allow_nested_fragments,
    r#"
<div>
  <  >
    <>
      <span>Hello</span>
      <span>world</span>
    </>
    <>
      <span>Goodbye</span>
      <span>world</span>
    </>
  </>
</div>
"#,
    r#"
React.createElement("div", null, React.createElement(
    React.Fragment, null, React.createElement(React.Fragment, null,
        React.createElement("span", null, "Hello"),
        React.createElement("span", null, "world")
    ),
    React.createElement(React.Fragment, null, React.createElement("span", null, "Goodbye"),
        React.createElement("span", null, "world")
    )
    )
);
"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_allow_no_pragmafrag_if_frag_unused,
    r#"
/** @jsx dom */

<div>no fragment is used</div>
"#,
    r#"
/** @jsx dom */
dom("div", null, "no fragment is used");
"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_allow_pragmafrag_and_frag,
    r#"
/** @jsx dom */
/** @jsxFrag DomFrag */

<></>
"#,
    r#"
/** @jsx dom */
/** @jsxFrag DomFrag */

dom(DomFrag, null);
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_avoid_wrapping_in_extra_parens_if_not_needed,
    r#"
var x = <div>
  <Component />
</div>;

var x = <div>
  {props.children}
</div>;

var x = <Composite>
  {props.children}
</Composite>;

var x = <Composite>
  <Composite2 />
</Composite>;
"#,
    r#"
var x = React.createElement("div", null, React.createElement(Component, null));
var x = React.createElement("div", null, props.children);
var x = React.createElement(Composite, null, props.children);
var x = React.createElement(Composite, null, React.createElement(Composite2, null));
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_convert_simple_tags,
    r#"var x = <div></div>;"#,
    r#"var x = React.createElement("div", null);"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_convert_simple_text,
    r#"var x = <div>text</div>;"#,
    r#"var x = React.createElement("div", null, "text");"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_escape_xhtml_jsxattribute,
    r#"
<div id="wôw" />;
<div id="\w" />;
<div id="w &lt; w" />;
"#,
    r#"
React.createElement("div", {
  id: "w\xF4w"
});
React.createElement("div", {
  id: "w"
});
React.createElement("div", {
  id: "w < w"
});
"#,
    ok_if_code_eq
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_escape_xhtml_jsxtext_1,
    r#"
<div>wow</div>;
<div>wôw</div>;

<div>w & w</div>;
<div>w &amp; w</div>;

<div>w &nbsp; w</div>;
<div>this should parse as unicode: {'\u00a0 '}</div>;

<div>w &lt; w</div>;
"#,
    r#"
React.createElement("div", null, "wow");
React.createElement("div", null, "w\xF4w");
React.createElement("div", null, "w & w");
React.createElement("div", null, "w & w");
React.createElement("div", null, "w \xA0 w");
React.createElement("div", null, "this should parse as unicode: ", '\u00a0 ');
React.createElement("div", null, "w < w");
"#,
    ok_if_code_eq
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_escape_xhtml_jsxtext_2,
    r#"
<div>this should not parse as unicode: \u00a0</div>;
"#,
    r#"
React.createElement("div", null, "this should not parse as unicode: \\u00a0");
"#,
    ok_if_code_eq
);

test!(
    // FIXME
    ignore,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_escape_xhtml_jsxtext_3,
    r#"
<div>this should parse as nbsp:   </div>;
"#,
    r#"
React.createElement("div", null, "this should parse as nbsp: \xA0 ");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_handle_attributed_elements,
    r#"
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

React.render(<HelloMessage name={
  <span>
    Sebastian
  </span>
} />, mountNode);
"#,
    r#"
var HelloMessage = React.createClass({
  render: function() {
    return React.createElement("div", null, "Hello ", this.props.name);
  },
  displayName: "HelloMessage",
});
React.render(
  React.createElement(HelloMessage, {
    name: React.createElement("span", null, "Sebastian")
  }),
  mountNode
);
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_handle_has_own_property_correctly,
    r#"<hasOwnProperty>testing</hasOwnProperty>;"#,
    r#"React.createElement("hasOwnProperty", null, "testing");"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_have_correct_comma_in_nested_children,
    r#"
var x = <div>
  <div><br /></div>
  <Component>{foo}<br />{bar}</Component>
  <br />
</div>;
"#,
    r#"
var x = React.createElement("div", null,
    React.createElement("div", null, React.createElement("br", null)),
    React.createElement(Component, null, foo,
        React.createElement("br", null), bar
    ), React.createElement("br", null)
);
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_insert_commas_after_expressions_before_whitespace,
    r#"
var x =
  <div
    attr1={
      "foo" + "bar"
    }
    attr2={
      "foo" + "bar" +

      "baz" + "bug"
    }
    attr3={
      "foo" + "bar" +
      "baz" + "bug"
    }
    attr4="baz">
  </div>
"#,
    r#"
var x = React.createElement("div", {
  attr1: "foo" + "bar",
  attr2: "foo" + "bar" + "baz" + "bug",
  attr3: "foo" + "bar" + "baz" + "bug",
  attr4: "baz"
});
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_not_add_quotes_to_identifier_names,
    r#"var e = <F aaa new const var default foo-bar/>;"#,
    r#"
var e = React.createElement(F, {
  aaa: true,
  new: true,
  const: true,
  var: true,
  default: true,
  "foo-bar": true
});
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_not_mangle_expressioncontainer_attribute_values,
    r#"<button data-value={"a value\n  with\nnewlines\n   and spaces"}>Button</button>;"#,
    r#"
React.createElement("button", {
  "data-value": "a value\n  with\nnewlines\n   and spaces"
}, "Button");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_not_strip_nbsp_even_coupled_with_other_whitespace,
    r#"<div>&nbsp; </div>;"#,
    r#"React.createElement("div", null, "\xA0 ");"#,
    ok_if_code_eq
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_not_strip_tags_with_a_single_child_of_nbsp,
    r#"<div>&nbsp;</div>;"#,
    r#"React.createElement("div", null, "\xA0");"#,
    ok_if_code_eq
);

test!(
    // Comments are currently stripped out
    ignore,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_properly_handle_comments_between_props,
    r#"
var x = (
  <div
    /* a multi-line
       comment */
    attr1="foo">
    <span // a double-slash comment
      attr2="bar"
    />
  </div>
);
"#,
    r#"
var x = React.createElement("div", {
  /* a multi-line
     comment */
  attr1: "foo"
}, React.createElement("span", {
  // a double-slash comment
  attr2: "bar"
}));
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_quote_jsx_attributes,
    r#"<button data-value='a value'>Button</button>;"#,
    r#"
React.createElement("button", {
  "data-value": "a value"
}, "Button");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Options {
        pragma: "h".into(),
        throw_if_namespace: false,
        ..Default::default()
    },),
    react_should_support_xml_namespaces_if_flag,
    r#"<f:image n:attr />;"#,
    r#"h("f:image", {
  "n:attr": true
});"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_should_transform_known_hyphenated_tags,
    r#"<font-face />;"#,
    r#"React.createElement("font-face", null);"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_wraps_props_in_react_spread_for_first_spread_attributes,
    r#"
<Component { ... x } y
={2 } z />
"#,
    r#"
React.createElement(Component, _extends({}, x, {
  y: 2,
  z: true
}));
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_wraps_props_in_react_spread_for_last_spread_attributes,
    r#"<Component y={2} z { ... x } />"#,
    r#"
React.createElement(Component, _extends({
  y: 2,
  z: true
}, x));
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Default::default()),
    react_wraps_props_in_react_spread_for_middle_spread_attributes,
    r#"<Component y={2} { ... x } z />"#,
    r#"
React.createElement(Component, _extends({
  y: 2
}, x, {
  z: true
}));"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Options {
        use_builtins: true,
        ..Default::default()
    },),
    use_builtins_assignment,
    r#"var div = <Component {...props} foo="bar" />"#,
    r#"
var div = React.createElement(Component, Object.assign({}, props, {
  foo: "bar"
}));
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Options {
        use_builtins: true,
        ..Default::default()
    },),
    issue_229,
    "const a = <>test</>
const b = <div>test</div>",
    "const a = React.createElement(React.Fragment, null, 'test');
const b = React.createElement('div', null, 'test');"
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| chain!(
        tr(Options {
            use_builtins: true,
            ..Default::default()
        }),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
    issue_351,
    "import React from 'react';

<div />;",
    "'use strict';
var _react = _interopRequireDefault(require('react'));
_react.default.createElement('div', null);"
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Options {
        use_builtins: true,
        ..Default::default()
    }),
    issue_481,
    "<span> {foo}</span>;",
    "React.createElement('span', null, ' ', foo);"
);

// https://github.com/swc-project/swc/issues/517
test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| chain!(
        tr(Options {
            use_builtins: true,
            ..Default::default()
        }),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
    issue_517,
    "import React from 'react';
<div style='white-space: pre'>Hello World</div>;",
    "'use strict';
var _react = _interopRequireDefault(require('react'));
_react.default.createElement('div', {
    style: 'white-space: pre'
}, 'Hello World');"
);

#[test]
fn jsx_text() {
    assert_eq!(jsx_text_to_str(" ".into()), *" ");
    assert_eq!(jsx_text_to_str("Hello world".into()), *"Hello world");
    //    assert_eq!(jsx_text_to_str(" \n".into()), *" ");
}

// https://github.com/swc-project/swc/issues/542
test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(Options {
        use_builtins: true,
        ..Default::default()
    }),
    issue_542,
    "let page = <p>Click <em>New melody</em> listen to a randomly generated melody</p>",
    "let page = React.createElement('p', null, 'Click ', React.createElement('em', null, 'New \
     melody'), ' listen to a randomly generated melody');"
);
