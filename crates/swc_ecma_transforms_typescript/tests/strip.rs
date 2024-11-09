use std::path::PathBuf;

use swc_common::{comments::NoopComments, pass::Optional, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    class_fields_use_set::class_fields_use_set,
    es2015::{block_scoping, destructuring, parameters},
    es2017::async_to_generator,
    es2020::{nullish_coalescing, optional_chaining},
    es2022::{class_properties, static_blocks},
};
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_react::jsx;
use swc_ecma_transforms_testing::{test, test_exec, test_fixture, Tester};
use swc_ecma_transforms_typescript::{
    tsx, typescript, ImportsNotUsedAsValues, TsImportExportAssignConfig, TsxConfig,
};

fn tr(t: &mut Tester) -> impl Pass {
    tr_config(t, None, None, false)
}

fn tr_config(
    t: &mut Tester,
    config: Option<typescript::Config>,
    decorators_config: Option<decorators::Config>,
    use_define_for_class_fields: bool,
) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    let has_decorators = decorators_config.is_some();
    let config = config.unwrap_or_else(|| typescript::Config {
        no_empty_export: true,
        ..Default::default()
    });

    (
        Optional::new(
            decorators(decorators_config.unwrap_or_default()),
            has_decorators,
        ),
        resolver(unresolved_mark, top_level_mark, true),
        typescript(config, unresolved_mark, top_level_mark),
        jsx(
            t.cm.clone(),
            None::<NoopComments>,
            Default::default(),
            top_level_mark,
            unresolved_mark,
        ),
        Optional::new(class_fields_use_set(true), !use_define_for_class_fields),
    )
}

fn tsxr(t: &Tester) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        tsx(
            t.cm.clone(),
            typescript::Config {
                no_empty_export: true,
                import_not_used_as_values: ImportsNotUsedAsValues::Remove,
                ..Default::default()
            },
            TsxConfig::default(),
            t.comments.clone(),
            unresolved_mark,
            top_level_mark,
        ),
        swc_ecma_transforms_react::jsx(
            t.cm.clone(),
            Some(t.comments.clone()),
            swc_ecma_transforms_react::Options::default(),
            top_level_mark,
            unresolved_mark,
        ),
    )
}

fn properties(_: &Tester, loose: bool) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        static_blocks(),
        class_properties(
            class_properties::Config {
                set_public_fields: loose,
                ..Default::default()
            },
            unresolved_mark,
        ),
    )
}

macro_rules! to {
    ($name:ident, $from:expr) => {
        test!(
            Syntax::Typescript(TsSyntax {
                decorators: true,
                ..Default::default()
            }),
            |t| (tr(t), properties(t, true)),
            $name,
            $from
        );
    };
}

macro_rules! test_with_config {
    ($name:ident, $config:expr, SET, $from:expr) => {
        test_with_config!($name, $config, false, $from);
    };
    ($name:ident, $config:expr, $from:expr) => {
        test_with_config!($name, $config, true, $from);
    };
    ($name:ident, $config:expr, $use_define:expr,$from:expr) => {
        test!(
            Syntax::Typescript(TsSyntax {
                decorators: true,
                ..Default::default()
            }),
            |t| tr_config(t, Some($config), None, $use_define),
            $name,
            $from
        );
    };
}

test!(
    Syntax::Typescript(Default::default()),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, true),
            tr(t),
            parameters(
                parameters::Config {
                    ignore_function_length: true,
                },
                unresolved_mark,
            ),
            destructuring(destructuring::Config { loose: false }),
            block_scoping(unresolved_mark),
        )
    },
    fn_len_default_assignment_with_types,
    "export function transformFileSync(
      filename: string,
      opts: Object = {},
    ): string {}"
);

// TODO: Test function / variable hoisting

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_392_2,
    "
import { PlainObject } from 'simplytyped';
const dict: PlainObject = {};
"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_461,
    "for (let x in ['']) {
  (x => 0)(x);
}"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_468_1,
    "tView.firstCreatePass ?
      getOrCreateTNode(tView, lView[T_HOST], index, TNodeType.Element, null, null) :
      tView.data[adjustedIndex] as TElementNode"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_468_2,
    "tView.firstCreatePass ?
      getOrCreateTNode(tView, lView[T_HOST], index, TNodeType.Element, null, null) :
      tView.data[adjustedIndex] as TElementNode"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_468_3,
    "tView.firstCreatePass ?
      getOrCreateTNode() : tView.data[adjustedIndex] as TElementNode"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_468_4,
    "a ? b : c"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_468_5,
    "a ? b : c as T"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_468_6,
    "a.b ? c() : d.e[f] as T"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_468_7,
    "tView.firstCreatePass ? getOrCreateTNode() : tView.data[adjustedIndex]"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    enum_simple,
    "enum Foo{ a }"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    enum_str,
    "enum State {
  closed = 'closed',
  opened = 'opened',
  mounted = 'mounted',
  unmounted = 'unmounted',
}"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    enum_key_value,
    "enum StateNum {
  closed = 'cl0',
  opened = 'op1',
  mounted = 'mo2',
}"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    enum_export_str,
    "export enum State {
  closed = 'closed',
  opened = 'opened',
  mounted = 'mounted',
  unmounted = 'unmounted',
}"
);

to!(
    enum_self_reference,
    "var x;
    enum Foo {
        a,
        b = a,
        c = b + 1,
        d = c
    }"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_640,
    "import { Handler } from 'aws-lambda';
export const handler: Handler = async (event, context) => {};"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_656,
    "export const x = { text: 'hello' } as const;"
);

to!(import_type, "import type foo from 'foo'");

to!(export_type, "export type { foo }");

to!(
    issue_685,
    "
    type MyType = string;
    export default MyType;"
);

to!(
    issue_685_2,
    "
    class MyType {}
    type MyType = string;
    export default MyType;"
);

to!(
    issue_685_3,
    "
    var MyType = function(){};
    type MyType = string;
    export default MyType;"
);

to!(
    issue_685_4,
    "
    interface MyType {
        other: number;
    }
    export default MyType;"
);

to!(
    ts_enum_str_init,
    "enum FlexSize {
  md = 'md',
  lg = 'lg',
}"
);

to!(
    ts_enum_no_init,
    "enum FlexSize {
  md,
  lg,
}"
);

to!(module_01, "module 'foo'{ }");

to!(declare_01, "declare var env: FOO");

to!(
    issue_757,
    "// test.ts
enum Foo {
    A,
    B,
}

export default Foo;
"
);

to!(
    issue_786_1,
    "import { IPerson } from '../types/types'
     export function createPerson(person: IPerson) {
        const a = {} as IPerson
      }"
);

to!(
    issue_786_2,
    "import { IPerson } from '../types/types'
     function createPerson(person: IPerson) {
        const a = {} as IPerson
      }"
);

to!(
    issue_791_1,
    "import { IPerson } from '../types/types'

     export interface IEmployee extends IPerson {
     }

     export function createPerson(person: IPerson) {
       const a = {} as IPerson
     }"
);

to!(
    issue_791_2,
    "import { IPerson } from '../types/types'

     export class Employee implements IPerson {
     }

     export function createPerson(person: IPerson) {
       const a = {} as IPerson
     }"
);

to!(
    issue_791_3,
    "import { IPerson } from '../types/types'

     export type MyPerson = IPerson;

     export function createPerson(person: MyPerson) {
       const a = {} as MyPerson
     }"
);

to!(
    issue_791_4,
    "import { A, B } from '../types/types'

     export class Child extends A implements B {
     }"
);

to!(
    issue_793_1,
    "import { IPerson } from '../types/types'
     export function createPerson(person) {
        const a = {} as IPerson
      }"
);

to!(
    issue_793_2,
    "import { IPerson } from '../types/types'
     export function createPerson(person) {
        const a = <IPerson>{};
      }"
);

to!(
    issue_900_1,
    "export class FeatureSet<Name extends string> {
    log(a: Name) {
        console.log(a)
    }
}"
);

to!(
    issue_900_2,
    "class FeatureSet<Name extends string> {
    log(a: Name) {
        console.log(a)
    }
}"
);

to!(
    issue_900_3,
    "export default class FeatureSet<Name extends string> {
    log(a: Name) {
        console.log(a)
    }
}"
);

to!(
    issue_820_1,
    "enum Direction {
    Up = 1,
    Down = 2,
    Left = Up + Down,
}"
);

to!(
    issue_915,
    "export class Logger {
    #level: LogLevels;
    #handlers: BaseHandler[];
    readonly #loggerName: string;

    constructor(
        loggerName: string,
        levelName: LevelName,
        options: LoggerOptions = {},
    ) {
        this.#loggerName = loggerName;
        this.#level = getLevelByName(levelName);
        this.#handlers = options.handlers || [];
    }
}"
);

to!(
    issue_915_2,
    r#"Deno.test("[ws] WebSocket should act as asyncIterator", async () => {
  enum Frames {
    ping,
    hello,
    close,
    end,
  }
});"#
);

to!(
    issue_915_3,
    r#"export class MultipartReader {
    readonly newLine = encoder.encode("\r\n");
}"#
);

to!(
    issue_912,
    r#"export class BadRequestError extends Error {
    constructor(public readonly message: string) {
      super(message)
    }
}"#
);

to!(
    issue_921,
    "export abstract class Kernel {
  [key: string]: any
}"
);

to!(
    issue_926,
    "class A extends Object {
  constructor(public a, private b) {
    super();
  }
}"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_930_instance,
    "class A {
        b = this.a;
        constructor(readonly a){
        }
    }"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |t| (tr(t), properties(t, true)),
    issue_930_static,
    "class A {
        static b = 'foo';
        constructor(a){
        }
    }"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |t| (tr(t), properties(t, true)),
    typescript_001,
    "class A {
        foo = new Subject()

        constructor() {
          this.foo.subscribe()
        }
      }"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    typescript_002,
    "class A extends B {
            foo = 'foo'
            b = this.a;

            declare1
            declare2!: string

            constructor(private readonly a: string, readonly c, private d: number = 1) {
                super()
                this.foo.subscribe()
            }
          }"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_958,
    "export class Test {
        constructor(readonly test?: string) {}
    }"
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |t| (
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        tr(t)
    ),
    issue_960_1,
    "
    function DefineAction() {
        return (target, property) => {
            console.log(target, property);
        }
    }
    class Base {
        constructor() {
          this.action = new Subject()
        }
      }

      class Child extends Base {
        @DefineAction() action: Observable<void>

        callApi() {
          console.log(this.action) // undefined
        }
      }
    "
);

test_exec!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |t| (
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        tr(t)
    ),
    issue_960_2,
    "function DefineAction() { return function(_a, _b, c) { return c } }

    class Base {
      constructor() {
        this.action = 1
      }
    }

    class Child extends Base {
      @DefineAction() declare action: number

      callApi() {
        console.log(this.action) // undefined
        return this.action
      }
    }

    const c = new Child()

    c.callApi()
    expect(c.callApi()).not.toBe(undefined)
    expect(c.action).toBe(1);
    "
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_1032,
    r#"import {
    indent as indentFormatter,
    newline as newlineFormatter,
    breakpoint as breakpointFormatter,
} from "./format.ts";

const proseTypes = new Map();

// deno-lint-ignore ban-types
const prose = (l: number, i: Function, nl: Function, bp: string): string => {
    return i(l) + bp + "prose {" + nl +
        i(l + 1) + "color: #374151;" + nl +
        i(l + 1) + "max-width: 65ch;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + 'prose [class~="lead"] {' + nl +
        i(l + 1) + "color: #4b5563;" + nl +
        i(l + 1) + "font-size: 1.25em;" + nl +
        i(l + 1) + "line-height: 1.6;" + nl +
        i(l + 1) + "margin-top: 1.2em;" + nl +
        i(l + 1) + "margin-bottom: 1.2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose a {" + nl +
        i(l + 1) + "color: #5850ec;" + nl +
        i(l + 1) + "text-decoration: none;" + nl +
        i(l + 1) + "font-weight: 600;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose strong {" + nl +
        i(l + 1) + "color: #161e2e;" + nl +
        i(l + 1) + "font-weight: 600;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose ol {" + nl +
        i(l + 1) + "counter-reset: list-counter;" + nl +
        i(l + 1) + "margin-top: 1.25em;" + nl +
        i(l + 1) + "margin-bottom: 1.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose ol > li {" + nl +
        i(l + 1) + "position: relative;" + nl +
        i(l + 1) + "counter-increment: list-counter;" + nl +
        i(l + 1) + "padding-left: 1.75em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose ol > li::before {" + nl +
        i(l + 1) + 'content: counter(list-counter) ".";' + nl +
        i(l + 1) + "position: absolute;" + nl +
        i(l + 1) + "font-weight: 400;" + nl +
        i(l + 1) + "color: #6b7280;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose ul > li {" + nl +
        i(l + 1) + "position: relative;" + nl +
        i(l + 1) + "padding-left: 1.75em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose ul > li::before {" + nl +
        i(l + 1) + 'content: "";' + nl +
        i(l + 1) + "position: absolute;" + nl +
        i(l + 1) + "background-color: #d2d6dc;" + nl +
        i(l + 1) + "border-radius: 50%;" + nl +
        i(l + 1) + "width: 0.375em;" + nl +
        i(l + 1) + "height: 0.375em;" + nl +
        i(l + 1) + "top: calc(0.875em - 0.1875em);" + nl +
        i(l + 1) + "left: 0.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose hr {" + nl +
        i(l + 1) + "border-color: #e5e7eb;" + nl +
        i(l + 1) + "border-top-width: 1px;" + nl +
        i(l + 1) + "margin-top: 3em;" + nl +
        i(l + 1) + "margin-bottom: 3em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose blockquote {" + nl +
        i(l + 1) + "font-weight: 500;" + nl +
        i(l + 1) + "font-style: italic;" + nl +
        i(l + 1) + "color: #161e2e;" + nl +
        i(l + 1) + "border-left-width: 0.25rem;" + nl +
        i(l + 1) + "border-left-color: #e5e7eb;" + nl +
        i(l + 1) + 'quotes: "\\201C""\\201D""\\2018""\\2019";' + nl +
        i(l + 1) + "margin-top: 1.6em;" + nl +
        i(l + 1) + "margin-bottom: 1.6em;" + nl +
        i(l + 1) + "padding-left: 1em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose blockquote p:first-of-type::before {" + nl +
        i(l + 1) + "content: open-quote;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose blockquote p:last-of-type::after {" + nl +
        i(l + 1) + "content: close-quote;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h1 {" + nl +
        i(l + 1) + "color: #1a202c;" + nl +
        i(l + 1) + "font-weight: 800;" + nl +
        i(l + 1) + "font-size: 2.25em;" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0.8888889em;" + nl +
        i(l + 1) + "line-height: 1.1111111;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h2 {" + nl +
        i(l + 1) + "color: #1a202c;" + nl +
        i(l + 1) + "font-weight: 700;" + nl +
        i(l + 1) + "font-size: 1.5em;" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 1em;" + nl +
        i(l + 1) + "line-height: 1.3333333;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h3 {" + nl +
        i(l + 1) + "color: #1a202c;" + nl +
        i(l + 1) + "font-weight: 600;" + nl +
        i(l + 1) + "font-size: 1.25em;" + nl +
        i(l + 1) + "margin-top: 1.6em;" + nl +
        i(l + 1) + "margin-bottom: 0.6em;" + nl +
        i(l + 1) + "line-height: 1.6;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h4 {" + nl +
        i(l + 1) + "color: #1a202c;" + nl +
        i(l + 1) + "font-weight: 600;" + nl +
        i(l + 1) + "margin-top: 1.5em;" + nl +
        i(l + 1) + "margin-bottom: 0.5em;" + nl +
        i(l + 1) + "line-height: 1.5;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose figure figcaption {" + nl +
        i(l + 1) + "color: #6b7280;" + nl +
        i(l + 1) + "font-size: 0.875em;" + nl +
        i(l + 1) + "line-height: 1.4285714;" + nl +
        i(l + 1) + "margin-top: 0.8571429em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose code {" + nl +
        i(l + 1) + "color: #161e2e;" + nl +
        i(l + 1) + "font-weight: 600;" + nl +
        i(l + 1) + "font-size: 0.875em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose code::before {" + nl +
        i(l + 1) + 'content: "`";' + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose code::after {" + nl +
        i(l + 1) + 'content: "`";' + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose pre {" + nl +
        i(l + 1) + "color: #e5e7eb;" + nl +
        i(l + 1) + "background-color: #252f3f;" + nl +
        i(l + 1) + "overflow-x: auto;" + nl +
        i(l + 1) + "font-size: 0.875em;" + nl +
        i(l + 1) + "line-height: 1.7142857;" + nl +
        i(l + 1) + "margin-top: 1.7142857em;" + nl +
        i(l + 1) + "margin-bottom: 1.7142857em;" + nl +
        i(l + 1) + "border-radius: 0.375rem;" + nl +
        i(l + 1) + "padding-top: 0.8571429em;" + nl +
        i(l + 1) + "padding-right: 1.1428571em;" + nl +
        i(l + 1) + "padding-bottom: 0.8571429em;" + nl +
        i(l + 1) + "padding-left: 1.1428571em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose pre code {" + nl +
        i(l + 1) + "background-color: transparent;" + nl +
        i(l + 1) + "border-width: 0;" + nl +
        i(l + 1) + "border-radius: 0;" + nl +
        i(l + 1) + "padding: 0;" + nl +
        i(l + 1) + "font-weight: 400;" + nl +
        i(l + 1) + "color: inherit;" + nl +
        i(l + 1) + "font-size: inherit;" + nl +
        i(l + 1) + "font-family: inherit;" + nl +
        i(l + 1) + "line-height: inherit;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose pre code::before {" + nl +
        i(l + 1) + 'content: "";' + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose pre code::after {" + nl +
        i(l + 1) + 'content: "";' + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose table {" + nl +
        i(l + 1) + "width: 100%;" + nl +
        i(l + 1) + "table-layout: auto;" + nl +
        i(l + 1) + "text-align: left;" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l + 1) + "font-size: 0.875em;" + nl +
        i(l + 1) + "line-height: 1.7142857;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose thead {" + nl +
        i(l + 1) + "color: #161e2e;" + nl +
        i(l + 1) + "font-weight: 600;" + nl +
        i(l + 1) + "border-bottom-width: 1px;" + nl +
        i(l + 1) + "border-bottom-color: #d2d6dc;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose thead th {" + nl +
        i(l + 1) + "vertical-align: bottom;" + nl +
        i(l + 1) + "padding-right: 0.5714286em;" + nl +
        i(l + 1) + "padding-bottom: 0.5714286em;" + nl +
        i(l + 1) + "padding-left: 0.5714286em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose tbody tr {" + nl +
        i(l + 1) + "border-bottom-width: 1px;" + nl +
        i(l + 1) + "border-bottom-color: #e5e7eb;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose tbody tr:last-child {" + nl +
        i(l + 1) + "border-bottom-width: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose tbody td {" + nl +
        i(l + 1) + "vertical-align: top;" + nl +
        i(l + 1) + "padding-top: 0.5714286em;" + nl +
        i(l + 1) + "padding-right: 0.5714286em;" + nl +
        i(l + 1) + "padding-bottom: 0.5714286em;" + nl +
        i(l + 1) + "padding-left: 0.5714286em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose {" + nl +
        i(l + 1) + "font-size: 1rem;" + nl +
        i(l + 1) + "line-height: 1.75;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose p {" + nl +
        i(l + 1) + "margin-top: 1.25em;" + nl +
        i(l + 1) + "margin-bottom: 1.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose img {" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose video {" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose figure {" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose figure > * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h2 code {" + nl +
        i(l + 1) + "font-size: 0.875em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h3 code {" + nl +
        i(l + 1) + "font-size: 0.9em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose ul {" + nl +
        i(l + 1) + "margin-top: 1.25em;" + nl +
        i(l + 1) + "margin-bottom: 1.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose li {" + nl +
        i(l + 1) + "margin-top: 0.5em;" + nl +
        i(l + 1) + "margin-bottom: 0.5em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose ol > li:before {" + nl +
        i(l + 1) + "left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose > ul > li p {" + nl +
        i(l + 1) + "margin-top: 0.75em;" + nl +
        i(l + 1) + "margin-bottom: 0.75em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose > ul > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose > ul > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose > ol > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose > ol > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose ol ol," + nl +
        i(l) + bp + "prose ol ul," + nl +
        i(l) + bp + "prose ul ol," + nl +
        i(l) + bp + "prose ul ul {" + nl +
        i(l + 1) + "margin-top: 0.75em;" + nl +
        i(l + 1) + "margin-bottom: 0.75em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose hr + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h2 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h3 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h4 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose thead th:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose thead th:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose tbody td:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose tbody td:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose > :first-child {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose h1," + nl +
        i(l) + bp + "prose h2," + nl +
        i(l) + bp + "prose h3," + nl +
        i(l) + bp + "prose h4 {" + nl +
        i(l + 1) + "color: #161e2e;" + nl +
        i(l) + "}" + nl;
};

proseTypes.set("prose", prose);

// deno-lint-ignore ban-types
const proseSm = (l: number, i: Function, nl: Function, bp: string): string => {
    return i(l) + bp + "prose-sm {" + nl +
        i(l + 1) + "font-size: 0.875rem;" + nl +
        i(l + 1) + "line-height: 1.7142857;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm p {" + nl +
        i(l + 1) + "margin-top: 1.1428571em;" + nl +
        i(l + 1) + "margin-bottom: 1.1428571em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + 'prose-sm [class~="lead"] {' + nl +
        i(l + 1) + "font-size: 1.2857143em;" + nl +
        i(l + 1) + "line-height: 1.5555556;" + nl +
        i(l + 1) + "margin-top: 0.8888889em;" + nl +
        i(l + 1) + "margin-bottom: 0.8888889em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm blockquote {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l + 1) + "padding-left: 1.1111111em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm h1 {" + nl +
        i(l + 1) + "font-size: 2.1428571em;" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0.8em;" + nl +
        i(l + 1) + "line-height: 1.2;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm h2 {" + nl +
        i(l + 1) + "font-size: 1.4285714em;" + nl +
        i(l + 1) + "margin-top: 1.6em;" + nl +
        i(l + 1) + "margin-bottom: 0.8em;" + nl +
        i(l + 1) + "line-height: 1.4;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm h3 {" + nl +
        i(l + 1) + "font-size: 1.2857143em;" + nl +
        i(l + 1) + "margin-top: 1.5555556em;" + nl +
        i(l + 1) + "margin-bottom: 0.4444444em;" + nl +
        i(l + 1) + "line-height: 1.5555556;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm h4 {" + nl +
        i(l + 1) + "margin-top: 1.4285714em;" + nl +
        i(l + 1) + "margin-bottom: 0.5714286em;" + nl +
        i(l + 1) + "line-height: 1.4285714;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm img {" + nl +
        i(l + 1) + "margin-top: 1.7142857em;" + nl +
        i(l + 1) + "margin-bottom: 1.7142857em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm video {" + nl +
        i(l + 1) + "margin-top: 1.7142857em;" + nl +
        i(l + 1) + "margin-bottom: 1.7142857em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm figure {" + nl +
        i(l + 1) + "margin-top: 1.7142857em;" + nl +
        i(l + 1) + "margin-bottom: 1.7142857em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm figure > * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm figure figcaption {" + nl +
        i(l + 1) + "font-size: 0.8571429em;" + nl +
        i(l + 1) + "line-height: 1.3333333;" + nl +
        i(l + 1) + "margin-top: 0.6666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm code {" + nl +
        i(l + 1) + "font-size: 0.8571429em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm h2 code {" + nl +
        i(l + 1) + "font-size: 0.9em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm h3 code {" + nl +
        i(l + 1) + "font-size: 0.8888889em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm pre {" + nl +
        i(l + 1) + "font-size: 0.8571429em;" + nl +
        i(l + 1) + "line-height: 1.6666667;" + nl +
        i(l + 1) + "margin-top: 1.6666667em;" + nl +
        i(l + 1) + "margin-bottom: 1.6666667em;" + nl +
        i(l + 1) + "border-radius: 0.25rem;" + nl +
        i(l + 1) + "padding-top: 0.6666667em;" + nl +
        i(l + 1) + "padding-right: 1em;" + nl +
        i(l + 1) + "padding-bottom: 0.6666667em;" + nl +
        i(l + 1) + "padding-left: 1em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm ol {" + nl +
        i(l + 1) + "margin-top: 1.1428571em;" + nl +
        i(l + 1) + "margin-bottom: 1.1428571em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm ul {" + nl +
        i(l + 1) + "margin-top: 1.1428571em;" + nl +
        i(l + 1) + "margin-bottom: 1.1428571em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm li {" + nl +
        i(l + 1) + "margin-top: 0.2857143em;" + nl +
        i(l + 1) + "margin-bottom: 0.2857143em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm ol > li {" + nl +
        i(l + 1) + "padding-left: 1.5714286em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm ol > li:before {" + nl +
        i(l + 1) + "left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm ul > li {" + nl +
        i(l + 1) + "padding-left: 1.5714286em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm ul > li::before {" + nl +
        i(l + 1) + "height: 0.3571429em;" + nl +
        i(l + 1) + "width: 0.3571429em;" + nl +
        i(l + 1) + "top: calc(0.8571429em - 0.1785714em);" + nl +
        i(l + 1) + "left: 0.2142857em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm > ul > li p {" + nl +
        i(l + 1) + "margin-top: 0.5714286em;" + nl +
        i(l + 1) + "margin-bottom: 0.5714286em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm > ul > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.1428571em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm > ul > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.1428571em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm > ol > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.1428571em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm > ol > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.1428571em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm ol ol," + nl +
        i(l) + bp + "prose-sm ol ul," + nl +
        i(l) + bp + "prose-sm ul ol," + nl +
        i(l) + bp + "prose-sm ul ul {" + nl +
        i(l + 1) + "margin-top: 0.5714286em;" + nl +
        i(l + 1) + "margin-bottom: 0.5714286em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm hr {" + nl +
        i(l + 1) + "margin-top: 2.8571429em;" + nl +
        i(l + 1) + "margin-bottom: 2.8571429em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm hr + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm h2 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm h3 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm h4 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm table {" + nl +
        i(l + 1) + "font-size: 0.8571429em;" + nl +
        i(l + 1) + "line-height: 1.5;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm thead th {" + nl +
        i(l + 1) + "padding-right: 1em;" + nl +
        i(l + 1) + "padding-bottom: 0.6666667em;" + nl +
        i(l + 1) + "padding-left: 1em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm thead th:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm thead th:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm tbody td {" + nl +
        i(l + 1) + "padding-top: 0.6666667em;" + nl +
        i(l + 1) + "padding-right: 1em;" + nl +
        i(l + 1) + "padding-bottom: 0.6666667em;" + nl +
        i(l + 1) + "padding-left: 1em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm tbody td:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm tbody td:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm > :first-child {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-sm > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl;
};

proseTypes.set("prose-sm", proseSm);

// deno-lint-ignore ban-types
const proseLg = (l: number, i: Function, nl: Function, bp: string): string => {
    return i(l) + bp + "prose-lg {" + nl +
        i(l + 1) + "font-size: 1.125rem;" + nl +
        i(l + 1) + "line-height: 1.7777778;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg p {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + 'prose-lg [class~="lead"] {' + nl +
        i(l + 1) + "font-size: 1.2222222em;" + nl +
        i(l + 1) + "line-height: 1.4545455;" + nl +
        i(l + 1) + "margin-top: 1.0909091em;" + nl +
        i(l + 1) + "margin-bottom: 1.0909091em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg blockquote {" + nl +
        i(l + 1) + "margin-top: 1.6666667em;" + nl +
        i(l + 1) + "margin-bottom: 1.6666667em;" + nl +
        i(l + 1) + "padding-left: 1em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg h1 {" + nl +
        i(l + 1) + "font-size: 2.6666667em;" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0.8333333em;" + nl +
        i(l + 1) + "line-height: 1;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg h2 {" + nl +
        i(l + 1) + "font-size: 1.6666667em;" + nl +
        i(l + 1) + "margin-top: 1.8666667em;" + nl +
        i(l + 1) + "margin-bottom: 1.0666667em;" + nl +
        i(l + 1) + "line-height: 1.3333333;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg h3 {" + nl +
        i(l + 1) + "font-size: 1.3333333em;" + nl +
        i(l + 1) + "margin-top: 1.6666667em;" + nl +
        i(l + 1) + "margin-bottom: 0.6666667em;" + nl +
        i(l + 1) + "line-height: 1.5;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg h4 {" + nl +
        i(l + 1) + "margin-top: 1.7777778em;" + nl +
        i(l + 1) + "margin-bottom: 0.4444444em;" + nl +
        i(l + 1) + "line-height: 1.5555556;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg img {" + nl +
        i(l + 1) + "margin-top: 1.7777778em;" + nl +
        i(l + 1) + "margin-bottom: 1.7777778em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg video {" + nl +
        i(l + 1) + "margin-top: 1.7777778em;" + nl +
        i(l + 1) + "margin-bottom: 1.7777778em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg figure {" + nl +
        i(l + 1) + "margin-top: 1.7777778em;" + nl +
        i(l + 1) + "margin-bottom: 1.7777778em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg figure > * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg figure figcaption {" + nl +
        i(l + 1) + "font-size: 0.8888889em;" + nl +
        i(l + 1) + "line-height: 1.5;" + nl +
        i(l + 1) + "margin-top: 1em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg code {" + nl +
        i(l + 1) + "font-size: 0.8888889em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg h2 code {" + nl +
        i(l + 1) + "font-size: 0.8666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg h3 code {" + nl +
        i(l + 1) + "font-size: 0.875em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg pre {" + nl +
        i(l + 1) + "font-size: 0.8888889em;" + nl +
        i(l + 1) + "line-height: 1.75;" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l + 1) + "border-radius: 0.375rem;" + nl +
        i(l + 1) + "padding-top: 1em;" + nl +
        i(l + 1) + "padding-right: 1.5em;" + nl +
        i(l + 1) + "padding-bottom: 1em;" + nl +
        i(l + 1) + "padding-left: 1.5em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg ol {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg ul {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg li {" + nl +
        i(l + 1) + "margin-top: 0.6666667em;" + nl +
        i(l + 1) + "margin-bottom: 0.6666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg ol > li {" + nl +
        i(l + 1) + "padding-left: 1.6666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg ol > li:before {" + nl +
        i(l + 1) + "left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg ul > li {" + nl +
        i(l + 1) + "padding-left: 1.6666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg ul > li::before {" + nl +
        i(l + 1) + "width: 0.3333333em;" + nl +
        i(l + 1) + "height: 0.3333333em;" + nl +
        i(l + 1) + "top: calc(0.8888889em - 0.1666667em);" + nl +
        i(l + 1) + "left: 0.2222222em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg > ul > li p {" + nl +
        i(l + 1) + "margin-top: 0.8888889em;" + nl +
        i(l + 1) + "margin-bottom: 0.8888889em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg > ul > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg > ul > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg > ol > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg > ol > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg ol ol," + nl +
        i(l) + bp + "prose-lg ol ul," + nl +
        i(l) + bp + "prose-lg ul ol," + nl +
        i(l) + bp + "prose-lg ul ul {" + nl +
        i(l + 1) + "margin-top: 0.8888889em;" + nl +
        i(l + 1) + "margin-bottom: 0.8888889em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg hr {" + nl +
        i(l + 1) + "margin-top: 3.1111111em;" + nl +
        i(l + 1) + "margin-bottom: 3.1111111em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg hr + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg h2 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg h3 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg h4 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg table {" + nl +
        i(l + 1) + "font-size: 0.8888889em;" + nl +
        i(l + 1) + "line-height: 1.5;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg thead th {" + nl +
        i(l + 1) + "padding-right: 0.75em;" + nl +
        i(l + 1) + "padding-bottom: 0.75em;" + nl +
        i(l + 1) + "padding-left: 0.75em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg thead th:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg thead th:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg tbody td {" + nl +
        i(l + 1) + "padding-top: 0.75em;" + nl +
        i(l + 1) + "padding-right: 0.75em;" + nl +
        i(l + 1) + "padding-bottom: 0.75em;" + nl +
        i(l + 1) + "padding-left: 0.75em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg tbody td:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg tbody td:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg > :first-child {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-lg > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl;
};

proseTypes.set("prose-lg", proseLg);

// deno-lint-ignore ban-types
const proseXl = (l: number, i: Function, nl: Function, bp: string): string => {
    return i(l) + bp + "prose-xl {" + nl +
        i(l + 1) + "font-size: 1.25rem;" + nl +
        i(l + 1) + "line-height: 1.8;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl p {" + nl +
        i(l + 1) + "margin-top: 1.2em;" + nl +
        i(l + 1) + "margin-bottom: 1.2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + 'prose-xl [class~="lead"] {' + nl +
        i(l + 1) + "font-size: 1.2em;" + nl +
        i(l + 1) + "line-height: 1.5;" + nl +
        i(l + 1) + "margin-top: 1em;" + nl +
        i(l + 1) + "margin-bottom: 1em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl blockquote {" + nl +
        i(l + 1) + "margin-top: 1.6em;" + nl +
        i(l + 1) + "margin-bottom: 1.6em;" + nl +
        i(l + 1) + "padding-left: 1.0666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl h1 {" + nl +
        i(l + 1) + "font-size: 2.8em;" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0.8571429em;" + nl +
        i(l + 1) + "line-height: 1;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl h2 {" + nl +
        i(l + 1) + "font-size: 1.8em;" + nl +
        i(l + 1) + "margin-top: 1.5555556em;" + nl +
        i(l + 1) + "margin-bottom: 0.8888889em;" + nl +
        i(l + 1) + "line-height: 1.1111111;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl h3 {" + nl +
        i(l + 1) + "font-size: 1.5em;" + nl +
        i(l + 1) + "margin-top: 1.6em;" + nl +
        i(l + 1) + "margin-bottom: 0.6666667em;" + nl +
        i(l + 1) + "line-height: 1.3333333;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl h4 {" + nl +
        i(l + 1) + "margin-top: 1.8em;" + nl +
        i(l + 1) + "margin-bottom: 0.6em;" + nl +
        i(l + 1) + "line-height: 1.6;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl img {" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl video {" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl figure {" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl figure > * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl figure figcaption {" + nl +
        i(l + 1) + "font-size: 0.9em;" + nl +
        i(l + 1) + "line-height: 1.5555556;" + nl +
        i(l + 1) + "margin-top: 1em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl code {" + nl +
        i(l + 1) + "font-size: 0.9em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl h2 code {" + nl +
        i(l + 1) + "font-size: 0.8611111em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl h3 code {" + nl +
        i(l + 1) + "font-size: 0.9em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl pre {" + nl +
        i(l + 1) + "font-size: 0.9em;" + nl +
        i(l + 1) + "line-height: 1.7777778;" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l + 1) + "border-radius: 0.5rem;" + nl +
        i(l + 1) + "padding-top: 1.1111111em;" + nl +
        i(l + 1) + "padding-right: 1.3333333em;" + nl +
        i(l + 1) + "padding-bottom: 1.1111111em;" + nl +
        i(l + 1) + "padding-left: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl ol {" + nl +
        i(l + 1) + "margin-top: 1.2em;" + nl +
        i(l + 1) + "margin-bottom: 1.2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl ul {" + nl +
        i(l + 1) + "margin-top: 1.2em;" + nl +
        i(l + 1) + "margin-bottom: 1.2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl li {" + nl +
        i(l + 1) + "margin-top: 0.6em;" + nl +
        i(l + 1) + "margin-bottom: 0.6em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl ol > li {" + nl +
        i(l + 1) + "padding-left: 1.8em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl ol > li:before {" + nl +
        i(l + 1) + "left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl ul > li {" + nl +
        i(l + 1) + "padding-left: 1.8em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl ul > li::before {" + nl +
        i(l + 1) + "width: 0.35em;" + nl +
        i(l + 1) + "height: 0.35em;" + nl +
        i(l + 1) + "top: calc(0.9em - 0.175em);" + nl +
        i(l + 1) + "left: 0.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl > ul > li p {" + nl +
        i(l + 1) + "margin-top: 0.8em;" + nl +
        i(l + 1) + "margin-bottom: 0.8em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl > ul > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl > ul > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl > ol > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl > ol > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl ol ol," + nl +
        i(l) + bp + "prose-xl ol ul," + nl +
        i(l) + bp + "prose-xl ul ol," + nl +
        i(l) + bp + "prose-xl ul ul {" + nl +
        i(l + 1) + "margin-top: 0.8em;" + nl +
        i(l + 1) + "margin-bottom: 0.8em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl hr {" + nl +
        i(l + 1) + "margin-top: 2.8em;" + nl +
        i(l + 1) + "margin-bottom: 2.8em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl hr + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl h2 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl h3 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl h4 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl table {" + nl +
        i(l + 1) + "font-size: 0.9em;" + nl +
        i(l + 1) + "line-height: 1.5555556;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl thead th {" + nl +
        i(l + 1) + "padding-right: 0.6666667em;" + nl +
        i(l + 1) + "padding-bottom: 0.8888889em;" + nl +
        i(l + 1) + "padding-left: 0.6666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl thead th:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl thead th:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl tbody td {" + nl +
        i(l + 1) + "padding-top: 0.8888889em;" + nl +
        i(l + 1) + "padding-right: 0.6666667em;" + nl +
        i(l + 1) + "padding-bottom: 0.8888889em;" + nl +
        i(l + 1) + "padding-left: 0.6666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl tbody td:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl tbody td:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl > :first-child {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-xl > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl;
};

proseTypes.set("prose-xl", proseXl);

// deno-lint-ignore ban-types
const prose2xl = (l: number, i: Function, nl: Function, bp: string): string => {
    return i(l) + bp + "prose-2xl {" + nl +
        i(l + 1) + "font-size: 1.5rem;" + nl +
        i(l + 1) + "line-height: 1.6666667;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl p {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + 'prose-2xl [class~="lead"] {' + nl +
        i(l + 1) + "font-size: 1.25em;" + nl +
        i(l + 1) + "line-height: 1.4666667;" + nl +
        i(l + 1) + "margin-top: 1.0666667em;" + nl +
        i(l + 1) + "margin-bottom: 1.0666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl blockquote {" + nl +
        i(l + 1) + "margin-top: 1.7777778em;" + nl +
        i(l + 1) + "margin-bottom: 1.7777778em;" + nl +
        i(l + 1) + "padding-left: 1.1111111em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl h1 {" + nl +
        i(l + 1) + "font-size: 2.6666667em;" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0.875em;" + nl +
        i(l + 1) + "line-height: 1;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl h2 {" + nl +
        i(l + 1) + "font-size: 2em;" + nl +
        i(l + 1) + "margin-top: 1.5em;" + nl +
        i(l + 1) + "margin-bottom: 0.8333333em;" + nl +
        i(l + 1) + "line-height: 1.0833333;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl h3 {" + nl +
        i(l + 1) + "font-size: 1.5em;" + nl +
        i(l + 1) + "margin-top: 1.5555556em;" + nl +
        i(l + 1) + "margin-bottom: 0.6666667em;" + nl +
        i(l + 1) + "line-height: 1.2222222;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl h4 {" + nl +
        i(l + 1) + "margin-top: 1.6666667em;" + nl +
        i(l + 1) + "margin-bottom: 0.6666667em;" + nl +
        i(l + 1) + "line-height: 1.5;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl img {" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl video {" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl figure {" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl figure > * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl figure figcaption {" + nl +
        i(l + 1) + "font-size: 0.8333333em;" + nl +
        i(l + 1) + "line-height: 1.6;" + nl +
        i(l + 1) + "margin-top: 1em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl code {" + nl +
        i(l + 1) + "font-size: 0.8333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl h2 code {" + nl +
        i(l + 1) + "font-size: 0.875em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl h3 code {" + nl +
        i(l + 1) + "font-size: 0.8888889em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl pre {" + nl +
        i(l + 1) + "font-size: 0.8333333em;" + nl +
        i(l + 1) + "line-height: 1.8;" + nl +
        i(l + 1) + "margin-top: 2em;" + nl +
        i(l + 1) + "margin-bottom: 2em;" + nl +
        i(l + 1) + "border-radius: 0.5rem;" + nl +
        i(l + 1) + "padding-top: 1.2em;" + nl +
        i(l + 1) + "padding-right: 1.6em;" + nl +
        i(l + 1) + "padding-bottom: 1.2em;" + nl +
        i(l + 1) + "padding-left: 1.6em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl ol {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl ul {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl li {" + nl +
        i(l + 1) + "margin-top: 0.5em;" + nl +
        i(l + 1) + "margin-bottom: 0.5em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl ol > li {" + nl +
        i(l + 1) + "padding-left: 1.6666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl ol > li:before {" + nl +
        i(l + 1) + "left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl ul > li {" + nl +
        i(l + 1) + "padding-left: 1.6666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl ul > li::before {" + nl +
        i(l + 1) + "width: 0.3333333em;" + nl +
        i(l + 1) + "height: 0.3333333em;" + nl +
        i(l + 1) + "top: calc(0.8333333em - 0.1666667em);" + nl +
        i(l + 1) + "left: 0.25em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl > ul > li p {" + nl +
        i(l + 1) + "margin-top: 0.8333333em;" + nl +
        i(l + 1) + "margin-bottom: 0.8333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl > ul > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl > ul > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl > ol > li > :first-child {" + nl +
        i(l + 1) + "margin-top: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl > ol > li > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 1.3333333em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl ol ol," + nl +
        i(l) + bp + "prose-2xl ol ul," + nl +
        i(l) + bp + "prose-2xl ul ol," + nl +
        i(l) + bp + "prose-2xl ul ul {" + nl +
        i(l + 1) + "margin-top: 0.6666667em;" + nl +
        i(l + 1) + "margin-bottom: 0.6666667em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl hr {" + nl +
        i(l + 1) + "margin-top: 3em;" + nl +
        i(l + 1) + "margin-bottom: 3em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl hr + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl h2 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl h3 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl h4 + * {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl table {" + nl +
        i(l + 1) + "font-size: 0.8333333em;" + nl +
        i(l + 1) + "line-height: 1.4;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl thead th {" + nl +
        i(l + 1) + "padding-right: 0.6em;" + nl +
        i(l + 1) + "padding-bottom: 0.8em;" + nl +
        i(l + 1) + "padding-left: 0.6em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl thead th:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl thead th:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl tbody td {" + nl +
        i(l + 1) + "padding-top: 0.8em;" + nl +
        i(l + 1) + "padding-right: 0.6em;" + nl +
        i(l + 1) + "padding-bottom: 0.8em;" + nl +
        i(l + 1) + "padding-left: 0.6em;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl tbody td:first-child {" + nl +
        i(l + 1) + "padding-left: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl tbody td:last-child {" + nl +
        i(l + 1) + "padding-right: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl > :first-child {" + nl +
        i(l + 1) + "margin-top: 0;" + nl +
        i(l) + "}" + nl +
        i(l) + bp + "prose-2xl > :last-child {" + nl +
        i(l + 1) + "margin-bottom: 0;" + nl +
        i(l) + "}" + nl;
};

proseTypes.set("prose-2xl", prose2xl);

export default (identifier: string, level = 0, b = "", m = false) => {
    const i = indentFormatter(m);
    const nl = newlineFormatter(m)();
    const bp = breakpointFormatter(b);

    if (proseTypes.has(identifier)) {
        return proseTypes.get(identifier)(level, i, nl, bp);
    }

    return;
};"#
);

to!(bin_01, "a!!!! + b!!!!!! + c!!!!!");

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    tr,
    deno_7413_1,
    "
    import { a } from './foo';
    import { Type } from './types';
    "
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    tr,
    deno_7413_2,
    "
    import './foo';
    "
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |t| {
        tr_config(
            t,
            Some(typescript::Config {
                no_empty_export: true,
                import_not_used_as_values: ImportsNotUsedAsValues::Preserve,
                ..Default::default()
            }),
            None,
            true,
        )
    },
    deno_7413_3,
    "
    import { a } from './foo';
    import { Type } from './types';
    "
);

test!(
    Syntax::Typescript(TsSyntax {
        tsx: true,
        ..Default::default()
    }),
    |t| tsxr(t),
    imports_not_used_as_values_jsx_prag,
    r#"/** @jsx h */
import html, { h } from "example";
serve((_req) =>
  html({
    body: <div>Hello World!</div>,
  })
);
"#
);

test!(
    Syntax::Typescript(TsSyntax {
        tsx: true,
        ..Default::default()
    }),
    |t| tsxr(t),
    imports_not_used_as_values_shebang_jsx_prag,
    r#"#!/usr/bin/env -S deno run -A
/** @jsx h */
import html, { h } from "example";
serve((_req) =>
  html({
    body: <div>Hello World!</div>,
  })
);
"#
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    tr,
    issue_1124,
    "
    import { Type } from './types';
    export type { Type };
    "
);

test!(
    Syntax::Typescript(Default::default()),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        let config = typescript::Config {
            no_empty_export: true,
            ..Default::default()
        };
        (
            resolver(unresolved_mark, top_level_mark, true),
            typescript(config, unresolved_mark, top_level_mark),
            async_to_generator(Default::default(), unresolved_mark),
        )
    },
    issue_1235_1,
    "
    class Service {
      async is(a: string): Promise<boolean> {
          return a.toUpperCase() === a;
      }
    }
    (async() => {  await (new Service()).is('ABC'); })();
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
        let config = typescript::Config {
            no_empty_export: true,
            ..Default::default()
        };
        (
            Optional::new(decorators(Default::default()), false),
            resolver(unresolved_mark, top_level_mark, true),
            typescript(config, unresolved_mark, top_level_mark),
            optional_chaining(Default::default(), unresolved_mark),
        )
    },
    issue_1149_1,
    "
    const tmp = tt?.map((t: any) => t).join((v: any) => v);
    "
);

test!(
    Syntax::Typescript(Default::default()),
    |t| (tr(t), nullish_coalescing(Default::default())),
    issue_1123_1,
    r#"
    interface SuperSubmission {
        [key: string]: any;
    }

    const normalizedQuestionSet: any = {};

    const submissions: SuperSubmission[] = (
        normalizedQuestionSet.submissionIds ?? []
    ).map(
        (id, index): SuperSubmission => {
          const submission = normalizedQuestionSet.submissions?.[id];

          const submissionAnswers = (submission.answers ?? []).map(
            (answerId) => normalizedQuestionSet.answers?.[answerId]
          );

          console.log(id, index);

          return {
            type: "super-submission",
          };
        }
      );

      console.log(submissions);
    "#
);

// compile_to_class_constructor_collision_ignores_types
test!(
    Syntax::Typescript(Default::default()),
    |t| tr_config(
        t,
        Some(typescript::Config {
            no_empty_export: true,
            ..Default::default()
        }),
        None,
        true
    ),
    compile_to_class_constructor_collision_ignores_types,
    r#"
class C {
    // Output should not use `_initialiseProps`
    x: T;
    y = 0;
    constructor(T) {}
}

"#
);

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |t| tr_config(t, None, Some(Default::default()), false),
    issue_367,
    "

 // before
import { bind } from 'some';

class A {
  @bind
  public get foo() {
    return 1;
  }

  @bind
  public bar() {
    return 1;
  }
}"
);

to!(
    deno_8978,
    "
    import { any } from './dep.ts';

    export { any };
    export type { any as t };
    "
);

to!(
    deno_9097,
    "
    export namespace util {
        export type AssertEqual<T, Expected> = T extends Expected
            ? Expected extends T
            ? true
            : false
            : false;

        export function assertNever(_x: never): never {
            throw new Error();
        }

        export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
        export type OmitKeys<T, K extends string> = Pick<T, Exclude<keyof T, K>>;
        export type MakePartial<T, K extends keyof T> = Omit<T, K> &
            Partial<Pick<T, K>>;

        export const arrayToEnum = <T extends string, U extends [T, ...T[]]>(
            items: U
        ): { [k in U[number]]: k } => {
        };

        export const getValidEnumValues = (obj: any) => {
        };

        export const getValues = (obj: any) => {

        };

        export const objectValues = (obj: any) => {

        };
    }
    "
);

to!(
    namespace_001,
    "
    export namespace util {
        const c = 3;
        export const [a, b] = [1, 2, 3];
    }
    "
);

to!(
    namespace_002,
    "
    export namespace util {
        const c = 3;
        export function foo() {

        }

        function bar() {

        }
    }
    "
);

to!(
    namespace_003,
    "
    namespace Test.Inner {
        export const c = 3;
    }
    namespace Test.Other {
        export interface Test {}
    }
    "
);

to!(
    namespace_004,
    "
    namespace MyNamespace {
        export enum MyEnum {
            A = 1
        }
        export namespace MyInnerNamespace {
            export enum MyEnum {
                A = 1
            }
        }
    }
    namespace MyNamespace {
        export enum MyEnum {
            B = 1
        }
        export namespace MyInnerNamespace {
            export const Dec2 = 2;
        }
    }
    namespace MyNamespace {
        enum MyEnum {
            A = 2
        }
    }
    "
);

to!(
    namespace_005,
    "
    namespace A {
        export class Test {}
    }
    namespace B {
        export import a = A;
        console.log(a.Test);
        import b = A;
        console.log(b.Test);
    }
    "
);

to!(
    issue_1329,
    "
    namespace Test {
        export enum DummyValues {
            A = 'A',
            B = 'B',
        }
      }

    console(Test.DummyValues.A);
    "
);

to!(
    deno_9289_1,
    "
    export class TestClass {
        public testMethod (args: TestClass.TestArgs)
        {
            return args.param1;
        }
    }

    declare namespace TestClass {
        export interface TestArgs {
            param1: boolean;
        }
    }
    "
);

to!(
    deno_9289_2,
    "
    declare namespace TestClass {
        export interface TestArgs {
            param1: boolean;
        }
    }
    "
);

to!(
    issue_1383,
    "
    declare global {
        const process: Process;
    }

    export {}
    "
);

test_with_config!(
    issue_1472_1_define,
    typescript::Config {
        no_empty_export: true,
        ..Default::default()
    },
    "
    class A extends Object {
        a = 1;
        constructor(public b = 2) {
          super();
        }
    }
    "
);

test_with_config!(
    issue_1472_1_no_define,
    typescript::Config {
        no_empty_export: true,
        ..Default::default()
    },
    SET,
    "
    class A extends Object {
        a = 1;
        constructor(public b = 2) {
          super();
        }
    }
    "
);

to!(
    issue_1497_1,
    "
    class A {
        [(console.log(1), 'a')] = 1;
        static [(console.log(2), 'b')] = 2;
    }
    "
);

to!(
    issue_1497_2,
    "
    class A {
        [(console.log(1), 'a')] = 1;
        static [(console.log(2), 'b')] = 2;
        [(console.log(3), 'c')]() {}
    }
    "
);

to!(
    issue_1515_1,
    "
    export class A {}
    export namespace A {
        export class B extends A {}
    }
"
);

to!(
    issue_1515_2,
    "
    export namespace A {
        export class B extends A {}
    }
    export enum A {}
"
);

to!(
    issue_1515_3,
    "
    export class A {}
    export enum A {}
"
);

to!(
    class_expression_sequence,
    "
    const A = class {
        static a = 1;
    }
    "
);

to!(
    issue_1508_1,
    "
    declare namespace twttr {
        export const txt: typeof import('twitter-text')
    }
    "
);

to!(
    issue_1517_1,
    "
    interface X {
        get foo(): string;
        set foo(v: string | number);
    }
    "
);

to!(
    issue_1517_2,
    "
    type Y = {
        get bar(): string;
        set bar(v: string | number);
    }
    "
);

to!(
    import_shadow_named,
    "
    import { Test } from 'test';
    const Test = 2;
    console.log(Test);
    "
);

to!(
    import_shadow_default,
    "
    import Test from 'test';
    const Test = 2;
    console.log(Test);
    "
);

to!(
    import_shadow_namespace,
    "
    import * as Test from 'test';
    const Test = 2;
    console.log(Test);
    "
);

to!(
    import_shadow_array_pat,
    "
    import { Test } from 'test';
    const [Test] = [];
    console.log(a);
    "
);

to!(
    import_shadow_array_pat_default,
    "
    import { Test } from 'test';
    const [a = Test] = [];
    console.log(a);
    "
);

to!(
    import_shadow_object_pat,
    "
    import { Test } from 'test';
    const {Test: a} = {};
    console.log(a);
    "
);

to!(
    import_shadow_object_pat_default,
    "
    import { Test } from 'test';
    const {a = Test} = {};
    console.log(Test);
    "
);

to!(
    import_shadow_type,
    "
    import { Test } from 'test';
    interface Test {}
    "
);

to!(
    import_concrete,
    "
    import { Test } from 'test';
    console.log(Test);
    "
);

to!(
    import_shadow_type_concrete,
    "
    import { Test } from 'test';
    interface Test {}
    console.log(Test);
    "
);

to!(
    import_hoist,
    "
    console.log(Test);
    import { Test } from 'test';
    "
);

//
to!(
    import_shadow_hoist,
    "
    const Test = 2;
    console.log(Test);
    import { Test } from 'test';
    "
);

to!(
    import_shadow_hoist_type,
    "
    interface Test {}
    import { Test } from 'test';
    "
);

to!(
    import_shadow_hoist_type_concrete,
    "
    interface Test {}
    console.log(Test);
    import { Test } from 'test';
    "
);

to!(
    issue_1448_1,
    "
    import F = require('yaml')
    console.log(F)
    "
);

to!(
    constructor_1,
    "export class Query {
        public text: string;
        public args: EncodedArg[];
        public fields?: string[];

        constructor(config: QueryObjectConfig);
        constructor(text: string, ...args: unknown[]);
    }"
);

to!(
    constructor_2,
    "export class Context {
        app!: Application;
        request!: ServerRequest;
        url!: URL;

        response: Response & { headers: Headers } = { headers: new Headers() };
        params: Record<string, string> = {};
        customContext: any;

        #store?: Map<string | symbol, unknown>;

        #body: Promise<unknown> | undefined;

        constructor(opts: ContextOptions);
        constructor(c: Context);
        constructor(optionsOrContext: ContextOptions | Context) {
          if (optionsOrContext instanceof Context) {
            Object.assign(this, optionsOrContext);
            this.customContext = this;
            return;
          }
        }
    }"
);

to!(
    issue_1593,
    "
    export = 'something';
    "
);

to!(
    deno_10462,
    "
    import { foo } from './temp2.ts';

    const _: foo = null;
    console.log({ foo: 1 });
    "
);

to!(
    pr_1835,
    r#"
    import { A } from "./a";
    import { B } from "./b";
    import { C } from "./c";

    const { A: AB } = B;
    const { CB = C } = B;

    console.log(A, AB, CB);
    "#
);

to!(
    deno_10684,
    "
    import { Foo } from './temp2.ts';

    const a: Foo = null;
    console.log(a);
    const b = { Foo: 1 };
    console.log(b.Foo)
    "
);

to!(
    issue_1869_3,
    "
    var _class;
    let TestClass = _class = someClassDecorator((_class = class TestClass {
        static Something = 'hello';
        static SomeProperties = {
            firstProp: TestClass.Something
        };
    }) || _class) || _class;
    function someClassDecorator(c) {
        return c;
    }
    "
);

to!(
    issue_2219,
    "
    import type { TestInfo } from './config'

    export { TestInfo }
    "
);

to!(
    issue_3827,
    "
    import { foo } from './foo'

    type A = {
        get [foo](): number
    }
    "
);

to!(
    issue_1122_2,
    "
const identifier = 'bar';

class Foo {
  identifier = 5;
}
"
);

to!(
    issue_1122_5,
    "
const identifier = 'bar';

class Foo {
  static identifier = 5;
}
  "
);

to!(
    deno_12395_import_equals_1,
    "
    import * as mongo from 'https://deno.land/x/mongo@v0.27.0/mod.ts';
    import MongoClient = mongo.MongoClient;
    const mongoClient = new MongoClient();
    "
);

to!(
    deno_12395_import_equals_2,
    "
    import * as mongo from 'https://deno.land/x/mongo@v0.27.0/mod.ts';
    import MongoClient = mongo.MongoClient;
    const mongoClient: MongoClient = {};
    "
);

test_with_config!(
    deno_12532_declare_class_prop,
    typescript::Config {
        no_empty_export: true,
        ..Default::default()
    },
    "
    export class Foo {
        x: number;
        constructor(x: number) {
            this.x = x;
        }
    }
    export class Bar extends Foo {
        declare x: 123;
        constructor() {
            super(123);
        }
    }
    "
);

to!(
    issue_2613,
    "
    export = function (foo: string, bar: number): boolean {
        return true
    };
    "
);

to!(
    issue_2809,
    "enum Color {
    Aqua = '#00ffff',
    Cyan = Aqua,
}"
);

to!(
    issue_2886_enum_namespace_block_scoping,
    "
export enum Enum {
    test = 1
}
namespace Namespace {
    export enum Enum {
        test = 1
    }
    export enum Enum {
        test2 = 1
    }
}
{
    enum Enum {
        test = 1
    }
    namespace Namespace {
        export enum Enum {
            test = 1
        }
    }
}
{
    enum Enum {
        test = 1
    }
    namespace Namespace {
        export enum Enum {
            test = 1
        }
    }
}
"
);

#[testing::fixture("tests/fixture/**/input.ts")]
#[testing::fixture("tests/fixture/**/input.tsx")]
fn exec(input: PathBuf) {
    let output = input.with_file_name("output.js");
    test_fixture(
        Syntax::Typescript(TsSyntax {
            tsx: input.to_string_lossy().ends_with(".tsx"),
            ..Default::default()
        }),
        &|t| (tr(t), properties(t, true)),
        &input,
        &output,
        Default::default(),
    );
}

to!(
    parameter_properties_with_computed,
    "
class A {
    [console.log(123)] = 456
    constructor(public a = 1) {}
}

let b = class {
    [console.log(456)] = 123
    constructor(public a = 1) {}
}
    "
);

test!(
    Syntax::Typescript(TsSyntax::default()),
    |t| tr_config(t, None, None, true),
    export_import_assign,
    r#"
    export import foo = require("foo");

    foo();
    "#
);

test!(
    Syntax::Typescript(TsSyntax::default()),
    |t| tr_config(
        t,
        Some(typescript::Config {
            import_export_assign_config: TsImportExportAssignConfig::NodeNext,
            ..Default::default()
        }),
        None,
        true,
    ),
    node_next_1,
    r#"
    import foo = require("foo");

    foo();
    "#
);

test!(
    Syntax::Typescript(TsSyntax::default()),
    |t| tr_config(
        t,
        Some(typescript::Config {
            import_export_assign_config: TsImportExportAssignConfig::NodeNext,
            ..Default::default()
        }),
        None,
        true
    ),
    node_next_2,
    r#"
    export import foo = require("foo");

    foo();
    "#
);

test_with_config!(
    issue_6023,
    Default::default(),
    "
    abstract class Shape {
        abstract height: number;
        abstract width: number;
    }
    "
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_6219,
    "enum A{
        a=a,
    }"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    tr,
    issue_7106,
    "
    export class test {
        #throw() {}
        #new() {}
        test() {
          this.#throw();
          this.#new();
        }
    }
      "
);

test!(
    Syntax::Typescript(TsSyntax::default()),
    |t| tr_config(
        t,
        Some(typescript::Config {
            ts_enum_is_mutable: true,
            ..Default::default()
        }),
        None,
        true,
    ),
    ts_enum_is_mutable_true,
    r#"
    enum D {
      A,
      B = 2,
    }

    (D as any).A = 5;
    console.log(D.A);
    const enum E {
      A,
      B,
    }
    console.log(E.B);

    const enum F {
      A = 2,
    }
    enum G {
      A = F.A
    }
    console.log(G.A);

    enum H {
      A = 2,
    }
    const enum I {
      A = H.A
    }
    console.log(I.A);
    "#
);

test!(
    Syntax::Typescript(TsSyntax::default()),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            tsx(
                t.cm.clone(),
                typescript::Config {
                    verbatim_module_syntax: false,
                    ..Default::default()
                },
                TsxConfig::default(),
                t.comments.clone(),
                unresolved_mark,
                top_level_mark,
            ),
        )
    },
    ts_jsx_bad_pragma,
    r#"/** @jsx bad-pragma */"#
);
