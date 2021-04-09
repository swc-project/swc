use super::*;
use swc_common::{chain, Mark};
use swc_ecma_transforms_base::{hygiene::hygiene, resolver::resolver_with_mark};
use swc_ecma_transforms_module::common_js;
use swc_ecma_transforms_testing::{test, Tester};

fn tr(t: &mut Tester) -> impl Fold {
    chain!(
        hygiene(),
        refresh(
            true,
            Some(RefreshOptions {
                emit_full_signatures: true,
                ..Default::default()
            }),
            t.cm.clone(),
            Some(t.comments.clone())
        )
    )
}

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    normal_function,
    r#"
    function Hello() {
        function handleClick() {}
        return <h1 onClick={handleClick}>Hi</h1>;
    }
    function Bar() {
        return <Hello />;
    }
"#,
    r#"
    function Hello() {
        function handleClick() {}

        return <h1 onClick={handleClick}>Hi</h1>;
    }
    _c = Hello;
    function Bar() {
        return <Hello />;
    }
    _c1 = Bar;
    var _c, _c1;
    $RefreshReg$(_c, "Hello");
    $RefreshReg$(_c1, "Bar");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    export_function,
    r#"
    export function Hello() {
      function handleClick() {}
      return <h1 onClick={handleClick}>Hi</h1>;
    }
    export default function Bar() {
      return <Hello />;
    }
    function Baz() {
      return <h1>OK</h1>;
    }
    const NotAComp = 'hi';
    export { Baz, NotAComp };
    export function sum() {}
    export const Bad = 42;
"#,
    r#"
    export function Hello() {
      function handleClick() {}

      return <h1 onClick={handleClick}>Hi</h1>;
    }
    _c = Hello;
    export default function Bar() {
      return <Hello />;
    }
    _c1 = Bar;

    function Baz() {
      return <h1>OK</h1>;
    }

    _c2 = Baz;
    const NotAComp = 'hi';
    export { Baz, NotAComp };
    export function sum() {}
    export const Bad = 42;

    var _c, _c1, _c2;

    $RefreshReg$(_c, "Hello");
    $RefreshReg$(_c1, "Bar");
    $RefreshReg$(_c2, "Baz");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    export_named_arrow_function,
    r#"
    export const Hello = () => {
      function handleClick() {}
      return <h1 onClick={handleClick}>Hi</h1>;
    };
    export let Bar = (props) => <Hello />;
    export default () => {
      // This one should be ignored.
      // You should name your components.
      return <Hello />;
    };
"#,
    r#"
    export const Hello = () => {
      function handleClick() {}

      return <h1 onClick={handleClick}>Hi</h1>;
    };
    _c = Hello;
    export let Bar = props => <Hello />;
    _c1 = Bar;
    export default (() => {
      // This one should be ignored.
      // You should name your components.
      return <Hello />;
    });

    var _c, _c1;

    $RefreshReg$(_c, "Hello");
    $RefreshReg$(_c1, "Bar");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    reassigned_function,
    // TODO: in the future, we may *also* register the wrapped one.
    r#"
    function Hello() {
      return <h1>Hi</h1>;
    }
    Hello = connect(Hello);
"#,
    r#"
    function Hello() {
      return <h1>Hi</h1>;
    }

    _c = Hello;
    Hello = connect(Hello);

    var _c;

    $RefreshReg$(_c, "Hello");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    pascal_case_only,
    r#"
    function hello() {
      return 2 * 2;
    }
"#,
    r#"
    function hello() {
      return 2 * 2;
    }
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    anonymous_function_expressions_declaration,
    r#"
    let Hello = function() {
      function handleClick() {}
      return <h1 onClick={handleClick}>Hi</h1>;
    };
    const Bar = function Baz() {
      return <Hello />;
    };
    function sum() {}
    let Baz = 10;
    var Qux;
"#,
    r#"
    let Hello = function () {
      function handleClick() {}

      return <h1 onClick={handleClick}>Hi</h1>;
    };

    _c = Hello;

    const Bar = function Baz() {
      return <Hello />;
    };

    _c1 = Bar;

    function sum() {}

    let Baz = 10;
    var Qux;

    var _c, _c1;

    $RefreshReg$(_c, "Hello");
    $RefreshReg$(_c1, "Bar");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    named_arrow_function_expressions_declaration,
    r#"
    let Hello = () => {
      const handleClick = () => {};
      return <h1 onClick={handleClick}>Hi</h1>;
    }
    const Bar = () => {
      return <Hello />;
    };
    var Baz = () => <div />;
    var sum = () => {};
"#,
    r#"
    let Hello = () => {
      const handleClick = () => {};

      return <h1 onClick={handleClick}>Hi</h1>;
    };

    _c = Hello;

    const Bar = () => {
      return <Hello />;
    };

    _c1 = Bar;

    var Baz = () => <div />;

    _c2 = Baz;

    var sum = () => {};

    var _c, _c1, _c2;

    $RefreshReg$(_c, "Hello");
    $RefreshReg$(_c1, "Bar");
    $RefreshReg$(_c2, "Baz");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    ignore_hoc,
    // TODO: we might want to handle HOCs at usage site, however.
    // TODO: it would be nice if we could always avoid registering
    r#"
    let connect = () => {
      function Comp() {
        const handleClick = () => {};
        return <h1 onClick={handleClick}>Hi</h1>;
      }
      return Comp;
    };
    function withRouter() {
      return function Child() {
        const handleClick = () => {};
        return <h1 onClick={handleClick}>Hi</h1>;
      }
    };
"#,
    r#"
    let connect = () => {
      function Comp() {
        const handleClick = () => {};

        return <h1 onClick={handleClick}>Hi</h1>;
      }

      return Comp;
    };

    function withRouter() {
      return function Child() {
        const handleClick = () => {};

        return <h1 onClick={handleClick}>Hi</h1>;
      };
    };
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    ignore_complex_definition,
    r#"
    let A = foo ? () => {
      return <h1>Hi</h1>;
    } : null
    const B = (function Foo() {
      return <h1>Hi</h1>;
    })();
    let C = () => () => {
      return <h1>Hi</h1>;
    };
    let D = bar && (() => {
      return <h1>Hi</h1>;
    });
"#,
    r#"
    let A = foo ? () => {
      return <h1>Hi</h1>;
    } : null;

    const B = function Foo() {
      return <h1>Hi</h1>;
    }();

    let C = () => () => {
      return <h1>Hi</h1>;
    };

    let D = bar && (() => {
      return <h1>Hi</h1>;
    });
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    ignore_unnamed_function_declarations,
    r#"export default function() {}"#,
    r#"export default function() {}"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_likely_hoc_1,
    r#"
    const A = forwardRef(function() {
      return <h1>Foo</h1>;
    });
    export const B = memo(React.forwardRef(() => {
      return <h1>Foo</h1>;
    }));
    export default React.memo(forwardRef((props, ref) => {
      return <h1>Foo</h1>;
    }));
"#,
    r#"
    const A = forwardRef(_c = function () {
      return <h1>Foo</h1>;
    });
    _c1 = A;
    export const B = memo(_c3 = React.forwardRef(_c2 = () => {
      return <h1>Foo</h1>;
    }));
    _c4 = B;
    export default _c7 = React.memo(_c6 = forwardRef(_c5 = (props, ref) => {
      return <h1>Foo</h1>;
    }));
    
    var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
    
    $RefreshReg$(_c, "A$forwardRef");
    $RefreshReg$(_c1, "A");
    $RefreshReg$(_c2, "B$memo$React.forwardRef");
    $RefreshReg$(_c3, "B$memo");
    $RefreshReg$(_c4, "B");
    $RefreshReg$(_c5, "%default%$React.memo$forwardRef");
    $RefreshReg$(_c6, "%default%$React.memo");
    $RefreshReg$(_c7, "%default%");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_likely_hoc_2,
    r#"
    export default React.memo(forwardRef(function (props, ref) {
      return <h1>Foo</h1>;
    }));
"#,
    r#"
    export default _c2 = React.memo(_c1 = forwardRef(_c = function (props, ref) {
      return <h1>Foo</h1>;
    }));
    
    var _c, _c1, _c2;
    
    $RefreshReg$(_c, "%default%$React.memo$forwardRef");
    $RefreshReg$(_c1, "%default%$React.memo");
    $RefreshReg$(_c2, "%default%");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_likely_hoc_3,
    r#"
    export default React.memo(forwardRef(function Named(props, ref) {
      return <h1>Foo</h1>;
    }));
"#,
    r#"
    export default _c2 = React.memo(_c1 = forwardRef(_c = function Named(props, ref) {
      return <h1>Foo</h1>;
    }));
    
    var _c, _c1, _c2;
    
    $RefreshReg$(_c, "%default%$React.memo$forwardRef");
    $RefreshReg$(_c1, "%default%$React.memo");
    $RefreshReg$(_c2, "%default%");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_likely_hoc_4,
    r#"
    function Foo() {
      return <div>123</div>
    }

    export default memo(Foo)
"#,
    r#"
    function Foo() {
      return <div >123</div>;
    }
    _c = Foo;
    export default _c1 = memo(Foo);
    var _c, _c1;
    $RefreshReg$(_c, "Foo");
    $RefreshReg$(_c1, "%default%");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    ignore_not_hoc,
    r#"
    const throttledAlert = throttle(function() {
      alert('Hi');
    });
    const TooComplex = (function() { return hello })(() => {});
    if (cond) {
      const Foo = thing(() => {});
    }
"#,
    r#"
    const throttledAlert = throttle(function () {
      alert('Hi');
    });
    
    const TooComplex = function () {
      return hello;
    }(() => {});
    
    if (cond) {
      const Foo = thing(() => {});
    }
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_identifiers_used_in_jsx,
    r#"
    import A from './A';
    import Store from './Store';
    Store.subscribe();
    const Header = styled.div`color: red`
    const StyledFactory1 = styled('div')`color: hotpink`
    const StyledFactory2 = styled('div')({ color: 'hotpink' })
    const StyledFactory3 = styled(A)({ color: 'hotpink' })
    const FunnyFactory = funny.factory``;
    let Alias1 = A;
    let Alias2 = A.Foo;
    const Dict = {};
    function Foo() {
      return (
        <div><A /><B /><StyledFactory1 /><StyledFactory2 /><StyledFactory3 /><Alias1 /><Alias2 /><Header /><Dict.X /></div>
      );
    }
    const B = hoc(A);
    // This is currently registered as a false positive:
    const NotAComponent = wow(A);
    // We could avoid it but it also doesn't hurt.
"#,
    r#"
    import A from './A';
    import Store from './Store';
    Store.subscribe();
    const Header = styled.div`color: red`;
    _c = Header;
    const StyledFactory1 = styled('div')`color: hotpink`;
    _c1 = StyledFactory1;
    const StyledFactory2 = styled('div')({
      color: 'hotpink'
    });
    _c2 = StyledFactory2;
    const StyledFactory3 = styled(A)({
      color: 'hotpink'
    });
    _c3 = StyledFactory3;
    const FunnyFactory = funny.factory``;
    let Alias1 = A;
    let Alias2 = A.Foo;
    const Dict = {};
    
    function Foo() {
      return <div><A /><B /><StyledFactory1 /><StyledFactory2 /><StyledFactory3 /><Alias1 /><Alias2 /><Header /><Dict.X /></div>;
    }
    
    _c4 = Foo;
    const B = hoc(A); // This is currently registered as a false positive:

    _c5 = B;
    const NotAComponent = wow(A); // We could avoid it but it also doesn't hurt.

    _c6 = NotAComponent;

    var _c, _c1, _c2, _c3, _c4, _c5, _c6;
    
    $RefreshReg$(_c, "Header");
    $RefreshReg$(_c1, "StyledFactory1");
    $RefreshReg$(_c2, "StyledFactory2");
    $RefreshReg$(_c3, "StyledFactory3");
    $RefreshReg$(_c4, "Foo");
    $RefreshReg$(_c5, "B");
    $RefreshReg$(_c6, "NotAComponent");
"#
);

// When in doubt, register variables that were used in JSX.
// Foo, Header, and B get registered.
// A doesn't get registered because it's not declared locally.
// Alias doesn't get registered because its definition is just an identifier.
test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_identifiers_used_in_create_element,
    r#"
    import A from './A';
    import Store from './Store';
    Store.subscribe();
    const Header = styled.div`color: red`
    const StyledFactory1 = styled('div')`color: hotpink`
    const StyledFactory2 = styled('div')({ color: 'hotpink' })
    const StyledFactory3 = styled(A)({ color: 'hotpink' })
    const FunnyFactory = funny.factory``;
    let Alias1 = A;
    let Alias2 = A.Foo;
    const Dict = {};
    function Foo() {
      return [
        React.createElement(A),
        React.createElement(B),
        React.createElement(StyledFactory1),
        React.createElement(StyledFactory2),
        React.createElement(StyledFactory3),
        React.createElement(Alias1),
        React.createElement(Alias2),
        jsx(Header),
        React.createElement(Dict.X),
      ];
    }
    React.createContext(Store);
    const B = hoc(A);
    // This is currently registered as a false positive:
    const NotAComponent = wow(A);
    // We could avoid it but it also doesn't hurt.
"#,
    r#"
    import A from './A';
    import Store from './Store';
    Store.subscribe();
    const Header = styled.div`color: red`;
    _c = Header;
    const StyledFactory1 = styled('div')`color: hotpink`;
    _c1 = StyledFactory1;
    const StyledFactory2 = styled('div')({
      color: 'hotpink'
    });
    _c2 = StyledFactory2;
    const StyledFactory3 = styled(A)({
      color: 'hotpink'
    });
    _c3 = StyledFactory3;
    const FunnyFactory = funny.factory``;
    let Alias1 = A;
    let Alias2 = A.Foo;
    const Dict = {};
    
    function Foo() {
      return [React.createElement(A), React.createElement(B), React.createElement(StyledFactory1), React.createElement(StyledFactory2), React.createElement(StyledFactory3), React.createElement(Alias1), React.createElement(Alias2), jsx(Header), React.createElement(Dict.X)];
    }
    
    _c4 = Foo;
    React.createContext(Store);
    const B = hoc(A); // This is currently registered as a false positive:

    _c5 = B;
    const NotAComponent = wow(A); // We could avoid it but it also doesn't hurt.

    _c6 = NotAComponent;
    
    var _c, _c1, _c2, _c3, _c4, _c5, _c6;
    
    $RefreshReg$(_c, "Header");
    $RefreshReg$(_c1, "StyledFactory1");
    $RefreshReg$(_c2, "StyledFactory2");
    $RefreshReg$(_c3, "StyledFactory3");
    $RefreshReg$(_c4, "Foo");
    $RefreshReg$(_c5, "B");
    $RefreshReg$(_c6, "NotAComponent");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_capitalized_identifiers_in_hoc,
    r#"
    function Foo() {
      return <h1>Hi</h1>;
    }
    export default hoc(Foo);
    export const A = hoc(Foo);
    const B = hoc(Foo);
"#,
    r#"
    function Foo() {
      return <h1>Hi</h1>;
    }
    
    _c = Foo;
    export default _c1 = hoc(Foo);
    export const A = hoc(Foo);
    _c2 = A;
    const B = hoc(Foo);
    _c3 = B;

    var _c, _c1, _c2, _c3;

    $RefreshReg$(_c, "Foo");
    $RefreshReg$(_c1, "%default%");
    $RefreshReg$(_c2, "A");
    $RefreshReg$(_c3, "B");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_fn_with_hooks,
    r#"
    export default function App() {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }
"#,
    r#"
    var _s = $RefreshSig$();

    export default function App() {
      _s();
    
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }

    _s(App, "useState{[foo, setFoo](0)}\nuseEffect{}");
    
    _c = App;
    
    var _c;
    
    $RefreshReg$(_c, "App");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_fn_with_hooks_2,
    r#"
    export function Foo() {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }
    function Bar() {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }

    function baz() {
      return (useState(), useState())
    }
"#,
    r#"
    var _s = $RefreshSig$(), _s1 = $RefreshSig$(), _s2 = $RefreshSig$();

    export function Foo() {
      _s();
  
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }

    _s(Foo, "useState{[foo, setFoo](0)}\nuseEffect{}");
  
    _c = Foo;

    function Bar() {
      _s1();
  
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }

    _s1(Bar, "useState{[foo, setFoo](0)}\nuseEffect{}");
  
    _c1 = Bar;

    function baz() {
      _s2();
      return useState(), useState();
    }

    _s2(baz, "useState{}\nuseState{}");

    var _c, _c1;
  
    $RefreshReg$(_c, "Foo");
    $RefreshReg$(_c1, "Bar");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_fn_expr_with_hooks,
    r#"
    export const A = React.memo(React.forwardRef((props, ref) => {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1 ref={ref}>{foo}</h1>;
    }));
    export const B = React.memo(React.forwardRef(function(props, ref) {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1 ref={ref}>{foo}</h1>;
    }));
    function hoc() {
      return function Inner() {
        const [foo, setFoo] = useState(0);
        React.useEffect(() => {});
        return <h1 ref={ref}>{foo}</h1>;
      };
    }
    export let C = hoc();
"#,
    r#"
    var _s = $RefreshSig$(), _s1 = $RefreshSig$();

    export const A = _s(React.memo(_c1 = _s(React.forwardRef(_c = _s((props, ref) => {
      _s();
    
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1 ref={ref}>{foo}</h1>;
    }, "useState{[foo, setFoo](0)}\nuseEffect{}")), "useState{[foo, setFoo](0)}\nuseEffect{}")), "useState{[foo, setFoo](0)}\nuseEffect{}");
    _c2 = A;
    export const B = _s1(React.memo(_c4 = _s1(React.forwardRef(_c3 = _s1(function (props, ref) {
      _s1();
    
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1 ref={ref}>{foo}</h1>;
    }, "useState{[foo, setFoo](0)}\nuseEffect{}")), "useState{[foo, setFoo](0)}\nuseEffect{}")), "useState{[foo, setFoo](0)}\nuseEffect{}");
    _c5 = B;

    function hoc() {
      var _s2 = $RefreshSig$();

      return _s2(function Inner() {
        _s2();

        const [foo, setFoo] = useState(0);
        React.useEffect(() => {});
        return <h1 ref={ref}>{foo}</h1>;
      }, "useState{[foo, setFoo](0)}\nuseEffect{}");
    }

    export let C = hoc();

    var _c, _c1, _c2, _c3, _c4, _c5;

    $RefreshReg$(_c, "A$React.memo$React.forwardRef");
    $RefreshReg$(_c1, "A$React.memo");
    $RefreshReg$(_c2, "A");
    $RefreshReg$(_c3, "B$React.memo$React.forwardRef");
    $RefreshReg$(_c4, "B$React.memo");
    $RefreshReg$(_c5, "B");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_fn_expr_with_hooks_2,
    r#"
  const A = function () {
    const [foo, setFoo] = useState(0);
  }, B = () => {
    const [foo, setFoo] = useState(0);
  }
"#,
    r#"
  var _s = $RefreshSig$(), _s1 = $RefreshSig$();

  const A = function () {
    _s();
    const [foo, setFoo] = useState(0);
  }, B = () => {
    _s1();
    const [foo, setFoo] = useState(0);
  }
  // orignial implment will register _s1 first, hopefully this won't cause any trouble
  _s(A, "useState{[foo, setFoo](0)}");
  _s1(B, "useState{[foo, setFoo](0)}");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    register_implicit_arrow_returns,
    r#"
    export default () => useContext(X);
    export const Foo = () => useContext(X);
    module.exports = () => useContext(X);
    const Bar = () => useContext(X);
    const Baz = memo(() => useContext(X));
    const Qux = () => (0, useContext(X));
"#,
    r#"
    var _s = $RefreshSig$(),
    _s1 = $RefreshSig$(),
    _s2 = $RefreshSig$(),
    _s3 = $RefreshSig$(),
    _s4 = $RefreshSig$(),
    _s5 = $RefreshSig$();

    export default _s(() => {
      _s();

      return useContext(X);
    }, "useContext{}");
    export const Foo = () => {
      _s1();

      return useContext(X);
    };

    _s1(Foo, "useContext{}");

    _c = Foo;
    module.exports = _s2(() => {
      _s2();

      return useContext(X);
    }, "useContext{}");

    const Bar = () => {
      _s3();

      return useContext(X);
    };

    _s3(Bar, "useContext{}");

    _c1 = Bar;
    const Baz = _s4(memo(_c2 = _s4(() => {
      _s4();

      return useContext(X);
    }, "useContext{}")), "useContext{}");
    _c3 = Baz;

    const Qux = () => {
      _s5();

      return 0, useContext(X);
    };

    _s5(Qux, "useContext{}");

    _c4 = Qux;

    var _c, _c1, _c2, _c3, _c4;

    $RefreshReg$(_c, "Foo");
    $RefreshReg$(_c1, "Bar");
    $RefreshReg$(_c2, "Baz$memo");
    $RefreshReg$(_c3, "Baz");
    $RefreshReg$(_c4, "Qux");
    "#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    hook_signatures_should_include_custom_hook,
    r#"
    function useFancyState() {
      const [foo, setFoo] = React.useState(0);
      useFancyEffect();
      return foo;
    }
    const useFancyEffect = () => {
      React.useEffect(() => {});
    };
    export default function App() {
      const bar = useFancyState();
      return <h1>{bar}</h1>;
    }
"#,
    r#"
    var _s = $RefreshSig$(),
    _s1 = $RefreshSig$(),
    _s2 = $RefreshSig$();

    function useFancyState() {
      _s();

      const [foo, setFoo] = React.useState(0);
      useFancyEffect();
      return foo;
    }

    _s(useFancyState, "useState{[foo, setFoo](0)}\nuseFancyEffect{}", false, function () {
      return [useFancyEffect];
    });

    const useFancyEffect = () => {
      _s1();

      React.useEffect(() => {});
    };

    _s1(useFancyEffect, "useEffect{}");

    export default function App() {
      _s2();

      const bar = useFancyState();
      return <h1>{bar}</h1>;
    }

    _s2(App, "useFancyState{bar}", false, function () {
      return [useFancyState];
    });

    _c = App;

    var _c;

    $RefreshReg$(_c, "App");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(::swc_ecma_parser::TsConfig {
        tsx: true,
        ..Default::default()
    }),
    |t| {
        let mark = Mark::fresh(Mark::root());
        chain!(
            hygiene(),
            refresh(
                true,
                Some(RefreshOptions {
                    emit_full_signatures: true,
                    ..Default::default()
                }),
                t.cm.clone(),
                Some(t.comments.clone())
            ),
            resolver_with_mark(mark),
            common_js(mark, Default::default())
        )
    },
    include_hook_signature_in_commonjs,
    r#"
    import {useFancyState} from './hooks';
    import useFoo from './foo'
    export default function App() {
      const bar = useFancyState();
      const foo = useFoo()
      return <h1>{bar}</h1>;
    }
"#,
    r#"
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _hooks = require("./hooks");
    var _foo = _interopRequireDefault(require("./foo"));
    
    var _s = $RefreshSig$();
    
    function App() {
      _s();

      const bar = (0, _hooks).useFancyState();
      const foo = (0, _foo).default();
      return <h1>{bar}</h1>;
    }
    exports.default = App;
    
    _s(App, "useFancyState{bar}\nuseFoo{foo}", false, function () {
      return [_hooks.useFancyState, _foo.default];
    });
    
    _c = App;
    
    var _c;
    
    $RefreshReg$(_c, "App");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    gen_valid_hook_signatures_for_exotic_hooks,
    r#"
    import FancyHook from 'fancy';
    export default function App() {
      function useFancyState() {
        const [foo, setFoo] = React.useState(0);
        useFancyEffect();
        return foo;
      }
      const bar = useFancyState();
      const baz = FancyHook.useThing();
      React.useState();
      useThePlatform();
      return <h1>{bar}{baz}</h1>;
    }
"#,
    r#"
    var _s = $RefreshSig$();

    import FancyHook from 'fancy';
    export default function App() {
      _s();

      var _s1 = $RefreshSig$();

      function useFancyState() {
        _s1();

        const [foo, setFoo] = React.useState(0);
        useFancyEffect();
        return foo;
      }

      _s1(useFancyState, "useState{[foo, setFoo](0)}\nuseFancyEffect{}", true);
    
      const bar = useFancyState();
      const baz = FancyHook.useThing();
      React.useState();
      useThePlatform();
      return <h1>{bar}{baz}</h1>;
    }
    
    _s(App, "useFancyState{bar}\nuseThing{baz}\nuseState{}\nuseThePlatform{}", true, function () {
      return [FancyHook.useThing];
    });
    
    _c = App;
    
    var _c;
    
    $RefreshReg$(_c, "App");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(::swc_ecma_parser::TsConfig {
        tsx: true,
        dynamic_import: true,
        ..Default::default()
    }),
    tr,
    dont_consider_require_as_hoc,
    r#"
    const A = require('A');
    const B = foo ? require('X') : require('Y');
    const C = requireCond(gk, 'C');
    const D = import('D');
    import E = require('E');
    export default function App() {
      return (
        <div>
          <A />
          <B />
          <C />
          <D />
          <E />
        </div>
      );
    }
"#,
    r#"
    const A = require('A');
    const B = foo ? require('X') : require('Y');
    const C = requireCond(gk, 'C');
    const D = import('D');
    import E = require('E');
    export default function App() {
      return <div>
          <A />
          <B />
          <C />
          <D />
          <E />
        </div>;
    }
    _c = App;
    
    var _c;
    
    $RefreshReg$(_c, "App");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    should_refresh_when_has_comment,
    r#"
    export function Foo() {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }
    function Bar() {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {
        // @refresh reset
      });
      return <h1>{foo}</h1>;
    }
"#,
    r#"
    var _s = $RefreshSig$(), _s1 = $RefreshSig$();

    export function Foo() {
      _s();

      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }

    _s(Foo, "useState{[foo, setFoo](0)}\nuseEffect{}", true);

    _c = Foo;

    function Bar() {
      _s1();

      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }

    _s1(Bar, "useState{[foo, setFoo](0)}\nuseEffect{}", true);

    _c1 = Bar;

    var _c, _c1;

    $RefreshReg$(_c, "Foo");
    $RefreshReg$(_c1, "Bar");
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    tr,
    dont_consider_iife_as_hoc,
    r#"
    while (item) {
      (item => {
        useFoo();
      })(item);
    }
"#,
    r#"
    while (item) {
      var _s = $RefreshSig$();
    
      _s(item => {
        _s();
    
        useFoo();
      }, "useFoo{}", true)(item);
    }
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        dynamic_import: true,
        ..Default::default()
    }),
    |t| chain!(
        hygiene(),
        refresh(
            true,
            Some(RefreshOptions {
                refresh_reg: "import_meta_refreshReg".to_string(),
                refresh_sig: "import_meta_refreshSig".to_string(),
                emit_full_signatures: true,
            }),
            t.cm.clone(),
            Some(t.comments.clone())
        )
    ),
    custom_identifier,
    r#"
    export default function Bar () {
      useContext(X)
      return <Foo />
    }
"#,
    r#"
    var _s = import_meta_refreshSig();

    export default function Bar() {
      _s();
    
      useContext(X);
      return <Foo />;
    }
    
    _s(Bar, "useContext{}");
    
    _c = Bar;
    
    var _c;
    
    import_meta_refreshReg(_c, "Bar");
"#
);
