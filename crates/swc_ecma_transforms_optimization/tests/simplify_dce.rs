use swc_common::{pass::Repeat, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::{EsSyntax, Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2022::class_properties;
use swc_ecma_transforms_optimization::simplify::dce::{dce, Config};
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_typescript::strip;

fn tr() -> impl Pass {
    Repeat::new(dce(
        Config {
            top_level: true,
            ..Default::default()
        },
        Mark::new(),
    ))
}

macro_rules! to {
    ($name:ident, $src:expr) => {
        test!(
            Syntax::Es(EsSyntax {
                decorators: true,
                ..Default::default()
            }),
            |_| (resolver(Mark::new(), Mark::new(), false), tr()),
            $name,
            $src
        );
    };
}

macro_rules! optimized_out {
    ($name:ident, $src:expr) => {
        to!($name, $src);
    };
}

macro_rules! noop {
    ($name:ident, $src:expr) => {
        to!($name, $src);
    };
}

to!(
    single_pass,
    "
    const a = 1;

    if (a) {
        const b = 2;
    }
    "
);

optimized_out!(issue_607, "let a");

noop!(
    noop_1,
    "
let b = 2;

let a = 1;
if (b) {
    a = 2;
}

let c;
if (a) {
    c = 3;
}
console.log(c);
"
);

noop!(
    noop_2,
    "
switch (1){
    case 1:
        a = '1';
}

console.log(a);
"
);

noop!(
    noop_3,
    "
try {
    console.log(foo())
} catch (e) {
    console.error(e);
}"
);

to!(
    custom_loop_2,
    "let b = 2;

    let a = 1;
    a = 2;

    let c;
    if (2) c = 3
    console.log(c)"
);

optimized_out!(simple_const, "{const x = 1}");

noop!(assign_op, "x *= 2; use(x)");

to!(import_default_unused, "import foo from 'foo'");

to!(import_specific_unused, "import {foo} from 'foo'");

to!(import_mixed_unused, "import foo, { bar } from 'foo'");

noop!(export_named, "export { x };");

noop!(export_named_from, "export {foo} from 'src';");

noop!(
    import_default_export_named,
    "import foo from 'src'; export { foo }; "
);

to!(
    import_unused_export_named,
    "import foo, { bar } from 'src'; export { foo }; "
);

noop!(
    issue_760_1,
    "var ref;
    export const Auth = window === null || window === void 0 ? void 0 : (ref = window.aws) === \
     null || ref === void 0 ? void 0 : ref.Auth;
    "
);

noop!(
    issue_760_2_export_default,
    "const initialState = 'foo';
export default function reducer(state = initialState, action = {}) {
}"
);

noop!(
    issue_760_2_export_named,
    "const initialState = 'foo';
export function reducer(state = initialState, action = {}) {
}"
);

optimized_out!(
    issue_760_2_no_export,
    "const initialState = 'foo';
function reducer(state = initialState, action = {}) {
}"
);

to!(
    issue_763_1,
    "import {
      INSTAGRAM_CHECK_PATTERN,
      RESOURCE_FACEBOOK,
      RESOURCE_INSTAGRAM,
      RESOURCE_WEBSITE,
  } from '../../../../consts'

    export const resources = [
      {
          value: RESOURCE_WEBSITE,
          label: 'Webové stránky',
      },
      {
          value: RESOURCE_FACEBOOK,
          label: 'Facebook',
      },
      {
          value: RESOURCE_INSTAGRAM,
          label: 'Instagram',
      },
  ]"
);

to!(
    issue_763_2,
    "import {
      INSTAGRAM_CHECK_PATTERN,
      RESOURCE_FACEBOOK,
      RESOURCE_INSTAGRAM,
      RESOURCE_WEBSITE,
  } from '../../../../consts'

    const resources = [
      {
          value: RESOURCE_WEBSITE,
          label: 'Webové stránky',
      },
      {
          value: RESOURCE_FACEBOOK,
          label: 'Facebook',
      },
      {
          value: RESOURCE_INSTAGRAM,
          label: 'Instagram',
      },
  ]

resources.map(console.log.bind(console));"
);

noop!(
    issue_763_3,
    "import {
    RESOURCE_FACEBOOK,
    RESOURCE_INSTAGRAM,
    RESOURCE_WEBSITE,
} from '../../../../consts'

 const resources = [
    {
        value: RESOURCE_WEBSITE,
        label: 'Webové stránky',
    },
    {
        value: RESOURCE_FACEBOOK,
        label: 'Facebook',
    },
    {
        value: RESOURCE_INSTAGRAM,
        label: 'Instagram',
    },
];

resources.map(v => v)"
);

noop!(
    issue_763_4,
    "import { RESOURCE_FACEBOOK, RESOURCE_INSTAGRAM, RESOURCE_WEBSITE } from './consts';

    const resources = [
      {
        value: RESOURCE_WEBSITE,
        label: 'Webové stránky',
      },
      {
        value: RESOURCE_FACEBOOK,
        label: 'Facebook',
      },
      {
        value: RESOURCE_INSTAGRAM,
        label: 'Instagram',
      },
    ];

    export function foo(websites) {
        const a = resources.map((resource) => (
            {
                value: resource.value,
            }
        ));
        const b = website.type_id === RESOURCE_INSTAGRAM ? 'text' : 'url';
        return a + b;
      }"
);

noop!(
    issue_763_5_1,
    "import { A, B } from './consts';
    const resources = [A, B];
    use(B)
    resources.map(v => v)
"
);

noop!(
    issue_763_5_2,
    "import { A, B } from './consts';
    const resources = {A, B};
    use(B)
    resources.map(v => v)
"
);

to!(
    spack_issue_004,
    "const FOO = 'foo', BAR = 'bar';
        export default BAR;"
);

noop!(
    spack_issue_005,
    "function a() {
}
function foo() {
}
 console.log(a(), foo());"
);

noop!(
    spack_issue_006,
    "import * as a from './a';

function foo() {}

console.log(foo(), a.a(), a.foo());"
);

noop!(
    spack_issue_007,
    "
var load = function(){}
var { progress } = load();
console.log(progress);"
);

noop!(
    spack_issue_008,
    "class B {
    }
    class A extends B {
    }
    console.log('foo');
    new A();"
);

noop!(
    spack_issue_009,
    "
class A {

}
function a() {
    return new A();
}
console.log(a, a());
"
);

noop!(
    spack_issue_010,
    "
class A {}
console.log(new A());
"
);

noop!(
    issue_898_1,
    "
export default class X {
    @whatever
    anything= 0;

    x() {
        const localVar = aFunctionSomewhere();
        return localVar;
    }
}
"
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            decorators(decorators::Config {
                legacy: true,
                emit_metadata: false,
                use_define_for_class_fields: false,
            }),
            resolver(unresolved_mark, top_level_mark, false),
            strip(unresolved_mark, top_level_mark),
            tr(),
        )
    },
    issue_898_2,
    "export default class X {
    @whatever
    anything: number = 0;
    x() {
        const localVar = aFunctionSomewhere();
        return localVar;
    }
}
"
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            decorators(decorators::Config {
                legacy: true,
                emit_metadata: false,
                use_define_for_class_fields: false,
            }),
            resolver(unresolved_mark, top_level_mark, false),
            strip(unresolved_mark, top_level_mark),
            tr(),
        )
    },
    issue_1111,
    "
    const a = 1;
    export const d = { a };
    "
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (resolver(unresolved_mark, top_level_mark, false), tr())
    },
    issue_1150_1,
    "
class A {
    constructor(o = {}) {
        const {
            a = defaultA,
            c,
            } = o;
        this.#a = a;
        this.#c = c;
    }

    a() {
        this.#a();
    }

    c() {
        console.log(this.#c);
    }
}
new A();
    "
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            strip(unresolved_mark, top_level_mark),
            class_properties(
                class_properties::Config {
                    set_public_fields: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
            tr(),
        )
    },
    issue_1156_1,
    "
    export interface D {
        resolve: any;
        reject: any;
    }

    export function d(): D {
        let methods;
        const promise = new Promise((resolve, reject) => {
            methods = { resolve, reject };
        });
        return Object.assign(promise, methods);
    }
    "
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            strip(unresolved_mark, top_level_mark),
            class_properties(
                class_properties::Config {
                    set_public_fields: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
            tr(),
        )
    },
    issue_1156_2,
    "
    interface D {
        resolve: any;
        reject: any;
    }

    function d(): D {
        let methods;
        const promise = new Promise((resolve, reject) => {
          methods = { resolve, reject };
        });
        return Object.assign(promise, methods);
    }

    class A {
        private s: D = d();

        a() {
            this.s.resolve();
        }

        b() {
            this.s = d();
        }
    }

    new A();
    "
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            strip(unresolved_mark, top_level_mark),
            tr(),
        )
    },
    issue_1156_3,
    "
    function d() {
        let methods;
        const promise = new Promise((resolve, reject) => {
          methods = { resolve, reject };
        });
        return Object.assign(promise, methods);
    }

    d()
    "
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            strip(unresolved_mark, top_level_mark),
            class_properties(
                class_properties::Config {
                    set_public_fields: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
            tr(),
        )
    },
    issue_1156_4,
    "
    interface D {
        resolve: any;
        reject: any;
    }

    function d(): D {
        let methods;
        const promise = new Promise((resolve, reject) => {
          methods = { resolve, reject };
        });
        return Object.assign(promise, methods);
    }

    class A {
        private s: D = d();

        a() {
            this.s.resolve();
        }
    }

    new A();
    "
);

optimized_out!(
    self_referential_function_01,
    "
    function foo() {
        if (Math.random() > 0.5) {
            foo()
        }
    }
    "
);

optimized_out!(
    pr_1199_01,
    "
    function _nonIterableSpread() {
        throw new TypeError('Invalid attempt to spread non-iterable instance');
    }
    "
);

noop!(
    deno_8736_1,
    "
    class DenoStdInternalError1 extends Error {
        constructor(message){
            super(message);
            this.name = 'DenoStdInternalError';
        }
    }
    const DenoStdInternalError = DenoStdInternalError1;
    function assert2(expr, msg = '') {
        if (!expr) {
            throw new DenoStdInternalError(msg);
        }
    }
    const assert1 = assert2;
    const assert = assert1;
    const TEST = Deno.env.get('TEST');
    assert(TEST, 'TEST must be defined!');
    console.log(`Test is ${TEST}`);
    "
);

noop!(
    deno_8736_2,
    "
    class DenoStdInternalError extends Error {
        constructor(message){
            super(message);
            this.name = 'DenoStdInternalError';
        }
    }
    function assert(expr, msg = '') {
        throw new DenoStdInternalError(msg);
    }
    const TEST = Deno.env.get('TEST');
    assert(TEST, 'TEST must be defined!');
    console.log(`Test is ${TEST}`);
    "
);

noop!(
    deno_9076,
    "
    class App
    {
        constructor()
        {
            console.log('Hello from app')
        }
    }

    new App;
    "
);

noop!(
    deno_9212_1,
    "
    var _ = [];
    _ = l.baseState;
    "
);

noop!(
    deno_9212_2,
    "
    if (u !== null) {
        if (y !== null) {
            var _ = y.lastBaseUpdate;
        }
    }
    if (i !== null) {
        _ = l.baseState;
    }
    "
);

noop!(
    deno_9121_3,
    "
    function wt(e, n, t, r) {
        var l = e.updateQueue;
        Fe = !1;
        var i = l.firstBaseUpdate,
            o = l.lastBaseUpdate,
            u = l.shared.pending;
        if (u !== null) {
            l.shared.pending = null;
            var s = u,
                d = s.next;
            s.next = null, o === null ? i = d : o.next = d, o = s;
            var y = e.alternate;
            if (y !== null) {
                y = y.updateQueue;
                var _ = y.lastBaseUpdate;
                _ !== o && (_ === null ? y.firstBaseUpdate = d : _.next = d, y.lastBaseUpdate = s)
            }
        }
        if (i !== null) {
            _ = l.baseState, o = 0, y = d = s = null;
            do {
                u = i.lane;
                var h = i.eventTime;
                if ((r & u) === u) {
                    y !== null && (y = y.next = {
                        eventTime: h,
                        lane: 0,
                        tag: i.tag,
                        payload: i.payload,
                        callback: i.callback,
                        next: null
                    });
                    e: {
                        var k = e,
                            E = i;
                        switch (u = n, h = t, E.tag) {
                            case 1:
                                if (k = E.payload, typeof k == 'function') {
                                    _ = k.call(h, _, u);
                                    break e
                                }
                                _ = k;
                                break e;
                            case 3:
                                k.flags = k.flags & -4097 | 64;
                            case 0:
                                if (k = E.payload, u = typeof k == 'function' ? k.call(h, _, u) : \
     k, u == null) break e;
                                _ = R({}, _, u);
                                break e;
                            case 2:
                                Fe = !0
                        }
                    }
                    i.callback !== null && (e.flags |= 32, u = l.effects, u === null ? l.effects = \
     [i] : u.push(i))
                } else h = {
                    eventTime: h,
                    lane: u,
                    tag: i.tag,
                    payload: i.payload,
                    callback: i.callback,
                    next: null
                }, y === null ? (d = y = h, s = _) : y = y.next = h, o |= u;
                if (i = i.next, i === null) {
                    if (u = l.shared.pending, u === null) break;
                    i = u.next, u.next = null, l.lastBaseUpdate = u, l.shared.pending = null
                }
            } while (1);
            y === null && (s = _), l.baseState = s, l.firstBaseUpdate = d, l.lastBaseUpdate = y, \
     gt |= o, e.lanes = o, e.memoizedState = _
        }
    }
    wt()
    "
);
