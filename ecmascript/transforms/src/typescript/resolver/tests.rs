use swc_common::{chain, Mark};
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_visit::Fold;

struct Visulaizer {}

impl Fold for Visulaizer {}

fn tr() -> impl Fold {
    let top_lelel_mark = Mark::fresh(Mark::root());
    chain!(
        crate::resolver_with_mark(top_lelel_mark),
        super::resolver(top_lelel_mark),
        Visulaizer {}
    )
}

fn syntax() -> Syntax {
    Syntax::Typescript(TsConfig {
        ..Default::default()
    })
}

macro_rules! to {
    ($name:ident, $src:literal, $to:literal) => {
        test!(syntax(), |_| tr(), $name, $src, $to);
    };
}

macro_rules! identical {
    ($name:ident, $src:literal) => {
        to!($name, $src, $src);
    };
}

identical!(ts_resolver_001, "type A = B;");

identical!(
    ts_resolver_002,
    "
    class A {}
    new A();
    "
);

identical!(
    ts_resolver_003,
    "
    class Foo<T> {}
    class A {}
    class B {}
    new Foo<A>();
    new Foo<B>();
    "
);

to!(
    ts_resolver_class_constructor,
    "
class G<T> {}
class Foo {
    constructor() {
        class Foo {
            
        }

        new G<Foo>();
    }
}
new G<Foo>();
",
    ""
);

to!(
    ts_resolver_class_getter,
    "
class G<T> {}
class Foo {
    get foo() {
        class Foo {
            
        }

        new G<Foo>();
    }
}
",
    ""
);

to!(
    ts_resolver_class_setter,
    "
class Foo {
    set foo(v) {
        class Foo {
            
        }
    }
}
",
    ""
);

to!(
    ts_resolver_neseted_interface,
    "
class Foo {
    set foo(v) {
        class Foo {
            
        }
    }
}
",
    ""
);
