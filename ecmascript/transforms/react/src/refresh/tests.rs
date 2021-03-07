use super::*;
use swc_common::chain;
use swc_ecma_transforms_base::hygiene::hygiene;
use swc_ecma_transforms_testing::{test, Tester};
fn tr(t: &mut Tester) -> impl Fold {
    chain!(
        hygiene(),
        refresh(true, t.cm.clone(), Some(t.comments.clone()))
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
