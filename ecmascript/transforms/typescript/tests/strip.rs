use swc_common::chain;
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms_base::resolver::resolver;
use swc_ecma_transforms_compat::es2017::async_to_generator;
use swc_ecma_transforms_compat::es2020::class_properties;
use swc_ecma_transforms_compat::es2020::nullish_coalescing;
use swc_ecma_transforms_compat::es2020::optional_chaining;
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;
use swc_ecma_transforms_typescript::strip;
use swc_ecma_transforms_typescript::strip::strip_with_config;
use swc_ecma_visit::Fold;

fn tr() -> impl Fold {
    strip()
}

macro_rules! to {
    ($name:ident, $from:expr, $to:expr) => {
        test!(
            Syntax::Typescript(TsConfig {
                decorators: true,
                ..Default::default()
            }),
            |_| tr(),
            $name,
            $from,
            $to,
            ok_if_code_eq
        );
    };
}

macro_rules! test_with_config {
    ($name:ident, $config:expr, $from:expr, $to:expr) => {
        test!(
            Syntax::Typescript(TsConfig {
                decorators: true,
                ..Default::default()
            }),
            |_| strip_with_config($config),
            $name,
            $from,
            $to,
            ok_if_code_eq
        );
    };
}

to!(
    constructor_01,
    "class Foo {
    constructor(public readonly foo) {}
}",
    "class Foo {
    constructor(foo) {
        this.foo = foo;
    }
}"
);

to!(
    constructor_02,
    "class Foo {
    constructor(readonly foo) {
        this.bar = 1;
    }
}",
    "class Foo {
    constructor(foo) {
        this.foo = foo;
        this.bar = 1;
    }
}"
);

to!(export_import, "export import A = B", "export var A = B;");

to!(export_equals, "export = Foo", "export default Foo");

to!(
    issue_196_01,
    "export type Link = { key: string; text: string };",
    ""
);

to!(
    issue_196_02,
    "type Link = { key: string; text: string };
export { Link };",
    ""
);

to!(
    issue_196_03,
    "type Link = { key: string; text: string };
const Link = 'Boo';
export { Link };",
    "const Link = 'Boo';
export { Link };"
);

// TODO: Test function / variable hoisting

to!(
    issue_179_01,
    "import {Types} from 'other';
const a: Types.foo = {};",
    "const a = {};"
);

to!(
    issue_179_02,
    "import {Types} from 'other';
const a: Types = Types.foo;",
    "import {Types} from 'other';
const a = Types.foo;"
);

to!(
    issue_236,
    "function foo(this: any, $scope: angular.IScope){}",
    "function foo($scope){}"
);

to!(
    issue_357,
    "export function addProp<T, K extends string, V>(
  obj: T,
  prop: K,
  value: V
): T & { [x in K]: V };
export function addProp<T, K extends string, V>(
  prop: K,
  value: V
): (obj: T) => T & { [x in K]: V };

export function addProp(arg1: any, arg2: any, arg3?: any): any {
  if (arguments.length === 2) {
    return (object: any) => _addProp(object, arg1, arg2);
  }
  return _addProp(arg1, arg2, arg3);
}

function _addProp(obj: any, prop: string, value: any) {
  return {
    ...obj,
    [prop]: value,
  };
}",
    "export function addProp(arg1, arg2, arg3) {
  if (arguments.length === 2) {
    return (object) => _addProp(object, arg1, arg2);
  }
  return _addProp(arg1, arg2, arg3);
}

function _addProp(obj, prop, value) {
  return {
    ...obj,
    [prop]: value,
  };
}
"
);

to!(
    issue_366_01,
    "
class App {
  public enter?(): void;
  public leave?(): void;
  public destroy?(): void;
}",
    "class App {}"
);

to!(
    issue_366_02,
    "
function enter(): string;
function enter(foo: string): number;
",
    ""
);

to!(
    issue_392_1,
    "
import { PlainObject } from 'simplytyped';
const dict: PlainObject = {};
",
    "
const dict = {};"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| chain!(strip(), resolver()),
    issue_392_2,
    "
import { PlainObject } from 'simplytyped';
const dict: PlainObject = {};
",
    "
const dict = {};"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_461,
    "for (let x in ['']) {
  (x => 0)(x);
}",
    "for(let x in ['']){
    ((x)=>0
    )(x);
}"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_468_1,
    "tView.firstCreatePass ?
      getOrCreateTNode(tView, lView[T_HOST], index, TNodeType.Element, null, null) :
      tView.data[adjustedIndex] as TElementNode",
    "tView.firstCreatePass ? getOrCreateTNode(tView, lView[T_HOST], index, TNodeType.Element, \
     null, null) : tView.data[adjustedIndex];"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_468_2,
    "tView.firstCreatePass ?
      getOrCreateTNode(tView, lView[T_HOST], index, TNodeType.Element, null, null) :
      tView.data[adjustedIndex] as TElementNode",
    "tView.firstCreatePass ? getOrCreateTNode(tView, lView[T_HOST], index, TNodeType.Element, \
     null, null) : tView.data[adjustedIndex];"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_468_3,
    "tView.firstCreatePass ?
      getOrCreateTNode() : tView.data[adjustedIndex] as TElementNode",
    "tView.firstCreatePass ? getOrCreateTNode() : tView.data[adjustedIndex];"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_468_4,
    "a ? b : c",
    "a ? b : c"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_468_5,
    "a ? b : c as T",
    "a ? b : c"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_468_6,
    "a.b ? c() : d.e[f] as T",
    "a.b ? c() : d.e[f];"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_468_7,
    "tView.firstCreatePass ? getOrCreateTNode() : tView.data[adjustedIndex]",
    "tView.firstCreatePass ? getOrCreateTNode() : tView.data[adjustedIndex];"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    enum_simple,
    "enum Foo{ a }",
    "
var Foo;
(function (Foo) {
    Foo[Foo['a'] = 0] = 'a';
})(Foo || (Foo = {}));",
    ok_if_code_eq
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    enum_str,
    "enum State {
  closed = 'closed',
  opened = 'opened',
  mounted = 'mounted',
  unmounted = 'unmounted',
}",
    r#"
var State;
(function (State) {
    State["closed"] = "closed";
    State["opened"] = "opened";
    State["mounted"] = "mounted";
    State["unmounted"] = "unmounted";
})(State || (State = {}));
"#,
    ok_if_code_eq
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    enum_key_value,
    "enum StateNum {
  closed = 'cl0',
  opened = 'op1',
  mounted = 'mo2',
}",
    r#"
var StateNum;
(function (StateNum) {
    StateNum["closed"] = "cl0";
    StateNum["opened"] = "op1";
    StateNum["mounted"] = "mo2";
})(StateNum || (StateNum = {}));
"#,
    ok_if_code_eq
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    enum_export_str,
    "export enum State {
  closed = 'closed',
  opened = 'opened',
  mounted = 'mounted',
  unmounted = 'unmounted',
}",
    r#"export var State;
(function (State) {
    State["closed"] = "closed";
    State["opened"] = "opened";
    State["mounted"] = "mounted";
    State["unmounted"] = "unmounted";
})(State || (State = {}));
"#,
    ok_if_code_eq
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_640,
    "import { Handler } from 'aws-lambda';
export const handler: Handler = async (event, context) => {};",
    "export const handler = async (event, context) => {};",
    ok_if_code_eq
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| strip(),
    issue_656,
    "export const x = { text: 'hello' } as const;",
    "export const x = { text: 'hello' };",
    ok_if_code_eq
);

to!(import_type, "import type foo from 'foo'", "");

to!(export_type, "export type { foo }", "");

to!(
    issue_685,
    "
    type MyType = string;
    export default MyType;",
    ""
);

to!(
    issue_685_2,
    "
    class MyType {}
    type MyType = string;
    export default MyType;",
    "
    class MyType {}
    export default MyType;"
);

to!(
    issue_685_3,
    "
    var MyType = function(){};
    type MyType = string;
    export default MyType;",
    "
    var MyType = function(){};
    export default MyType;"
);

to!(
    ts_enum_str_init,
    "enum FlexSize {
  md = 'md',
  lg = 'lg',
}",
    "var FlexSize;
(function (FlexSize) {
    FlexSize['md'] = 'md';
    FlexSize['lg'] = 'lg';
})(FlexSize || (FlexSize = {}));
"
);

to!(
    ts_enum_no_init,
    "enum FlexSize {
  md,
  lg,
}",
    "var FlexSize;
(function (FlexSize) {
    FlexSize[FlexSize['md'] = 0] = 'md';
    FlexSize[FlexSize['lg'] = 1] = 'lg';
})(FlexSize || (FlexSize = {}));
"
);

to!(module_01, "module 'foo'{ }", "");

to!(declare_01, "declare var env: FOO", "");

to!(import_equals, "import A = B.C", "");

to!(
    issue_757,
    "// test.ts
enum Foo {
    A,
    B,
}

export default Foo;
",
    "var Foo;
    (function(Foo) {
        Foo[Foo['A'] = 0] = 'A';
        Foo[Foo['B'] = 1] = 'B';
    })(Foo || (Foo = {
    }));
    export default Foo;"
);

to!(
    issue_786_1,
    "import { IPerson } from '../types/types'
     export function createPerson(person: IPerson) {
        const a = {} as IPerson
      }",
    "export function createPerson(person) {
        const a = {};
      }"
);

to!(
    issue_786_2,
    "import { IPerson } from '../types/types'
     function createPerson(person: IPerson) {
        const a = {} as IPerson
      }",
    "function createPerson(person) {
        const a = {};
      }"
);

to!(
    issue_791_1,
    "import { IPerson } from '../types/types'

     export interface IEmployee extends IPerson {
     }

     export function createPerson(person: IPerson) {
       const a = {} as IPerson
     }",
    "export function createPerson(person) {
       const a = {}
     }"
);

to!(
    issue_791_2,
    "import { IPerson } from '../types/types'

     export class Employee implements IPerson {
     }

     export function createPerson(person: IPerson) {
       const a = {} as IPerson
     }",
    "export class Employee {
     }
     export function createPerson(person) {
       const a = {}
     }"
);

to!(
    issue_791_3,
    "import { IPerson } from '../types/types'

     export type MyPerson = IPerson;

     export function createPerson(person: MyPerson) {
       const a = {} as MyPerson
     }",
    "export function createPerson(person) {
       const a = {}
     }"
);

to!(
    issue_791_4,
    "import { A, B } from '../types/types'

     export class Child extends A implements B {
     }",
    "import { A } from '../types/types'

    export class Child extends A {
    }
    "
);

to!(
    issue_793_1,
    "import { IPerson } from '../types/types'
     export function createPerson(person) {
        const a = {} as IPerson
      }",
    "export function createPerson(person) {
        const a = {};
      }"
);

to!(
    issue_793_2,
    "import { IPerson } from '../types/types'
     export function createPerson(person) {
        const a = <IPerson>{};
      }",
    "export function createPerson(person) {
        const a = {};
      }"
);

to!(
    issue_900_1,
    "export class FeatureSet<Name extends string> {
    log(a: Name) {
        console.log(a)
    }
}",
    "export class FeatureSet {
    log(a) {
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
}",
    "class FeatureSet {
    log(a) {
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
}",
    "class FeatureSet {
    log(a) {
        console.log(a)
    }
}
export { FeatureSet as default };"
);

to!(
    issue_820_1,
    "enum Direction {
    Up = 1,
    Down = 2,
    Left = Up + Down,
}",
    "var Direction;
(function (Direction) {
    Direction[Direction['Up'] = 1] = 'Up';
    Direction[Direction['Down'] = 2] = 'Down';
    Direction[Direction['Left'] = 3] = 'Left';
})(Direction || (Direction = {}));"
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
}",
    "export class Logger {
    #level;
    #handlers;
    #loggerName;
    constructor(loggerName, levelName, options = {
    }){
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
});"#,
    r#"Deno.test("[ws] WebSocket should act as asyncIterator", async ()=>{
    var Frames;
    (function(Frames) {
        Frames[Frames["ping"] = 0] = "ping";
        Frames[Frames["hello"] = 1] = "hello";
        Frames[Frames["close"] = 2] = "close";
        Frames[Frames["end"] = 3] = "end";
    })(Frames || (Frames = {
    }));
});"#
);

to!(
    issue_915_3,
    r#"export class MultipartReader {
    readonly newLine = encoder.encode("\r\n");
}"#,
    r#"export class MultipartReader {
      constructor(){
          this.newLine = encoder.encode("\r\n");
      }
}"#
);

to!(
    issue_912,
    r#"export class BadRequestError extends Error {
    constructor(public readonly message: string) {
      super(message)
    }
}"#,
    r#"export class BadRequestError extends Error {
    constructor(message) {
      super(message)
      this.message = message
    }
}"#
);

to!(
    issue_921,
    "export abstract class Kernel {
  [key: string]: any
}",
    "export abstract class Kernel {}"
);

to!(
    issue_926,
    "class A extends Object {
  constructor(public a, private b) {
    super();
  }
}",
    "class A extends Object {
    constructor(a, b){
        super();
        this.a = a;
        this.b = b;
    }
}"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| tr(),
    issue_930_instance,
    "class A {
        b = this.a;
        constructor(readonly a){
        }
    }",
    "class A {
    constructor(a) {
        this.a = a;
        this.b = this.a;
    }
}"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| tr(),
    issue_930_static,
    "class A {
        static b = 'foo';
        constructor(a){
        }
    }",
    "class A {
        constructor(a) {
        }
    }
    A.b = 'foo';"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| tr(),
    typescript_001,
    "class A {
        foo = new Subject()

        constructor() {
          this.foo.subscribe()
        }
      }",
    "class A {
        constructor() {
            this.foo = new Subject()
            this.foo.subscribe()
        }
      }"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| tr(),
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
          }",
    "class A extends B {
        constructor(a, c, d = 1) {
            super();
            this.a = a;
            this.c = c;
            this.d = d;
            this.foo = 'foo';
            this.b = this.a;
            this.foo.subscribe();
        }
    }"
);

test!(
    ::swc_ecma_parser::Syntax::Typescript(Default::default()),
    |_| tr(),
    issue_958,
    "export class Test {
        constructor(readonly test?: string) {}
    }",
    "export class Test {
        constructor(test){
            this.test = test;
        }
    }"
);

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        strip()
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
    ",
    r#"var _class, _descriptor;
    function DefineAction() {
        return (target, property)=>{
            console.log(target, property);
        };
    }
    class Base {
        constructor(){
            this.action = new Subject();
        }
    }
    var _dec = DefineAction();
    let Child = ((_class = class Child extends Base {
        callApi() {
            console.log(this.action);
        }
        constructor(...args){
            super(...args);
            _initializerDefineProperty(this, "action", _descriptor, this);
        }
    }) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, "action", [
        _dec
    ], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: void 0
    }), _class);
    "#,
    ok_if_code_eq
);

test_exec!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        strip()
    ),
    issue_960_2,
    "function DefineAction() { return function(_a, _b, c) { return c } }

    class Base {
      constructor() {
        this.action = 1
      }
    }

    class Child extends Base {
      @DefineAction() action: number

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
    |_| tr(),
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
};"#,
    r#"
    import {
        indent as indentFormatter,
        newline as newlineFormatter,
        breakpoint as breakpointFormatter,
    } from "./format.ts";

    const proseTypes = new Map();

    // deno-lint-ignore ban-types
    const prose = (l, i, nl, bp): string => {
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
    const proseSm = (l, i, nl, bp): string => {
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
    const proseLg = (l, i, nl, bp): string => {
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
    const proseXl = (l, i, nl, bp): string => {
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
    const prose2xl = (l, i, nl, bp) => {
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

    export default ((identifier, level = 0, b = "", m = false) => {
        const i = indentFormatter(m);
        const nl = newlineFormatter(m)();
        const bp = breakpointFormatter(b);

        if (proseTypes.has(identifier)) {
            return proseTypes.get(identifier)(level, i, nl, bp);
        }

        return;
    });
    "#,
    ok_if_code_eq
);

to!(bin_01, "a!!!! + b!!!!!! + c!!!!!", "a + b + c");

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| strip(),
    deno_7413_1,
    "
    import { a } from './foo';
    import { Type } from './types';
    ",
    "
    "
);

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| strip(),
    deno_7413_2,
    "
    import './foo';
    ",
    "
    import './foo';
    "
);

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| {
        let mut config = strip::Config::default();
        config.import_not_used_as_values = strip::ImportsNotUsedAsValues::Preserve;
        strip_with_config(config)
    },
    deno_7413_3,
    "
    import { a } from './foo';
    import { Type } from './types';
    ",
    "
    import './foo';
    import './types';
    "
);

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| strip(),
    issue_1124,
    "
    import { Type } from './types';
    export type { Type };
    ",
    "
    "
);

test!(
    Syntax::Typescript(TsConfig {
        ..Default::default()
    }),
    |_| chain!(strip(), async_to_generator()),
    issue_1235_1,
    "
    class Service {
      async is(a: string): Promise<boolean> {
          return a.toUpperCase() === a;
      }
    }
    (async() => {  await (new Service()).is('ABC'); })();
    ",
    "
    class Service {
      is(a) {
        return _asyncToGenerator(function* () {
          return a.toUpperCase() === a;
        })();
      }

    }

    _asyncToGenerator(function* () {
      yield new Service().is('ABC');
    })();
    "
);

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| chain!(strip(), optional_chaining()),
    issue_1149_1,
    "
    const tmp = tt?.map((t: any) => t).join((v: any) => v);
    ",
    "
    const tmp = tt === null || tt === void 0 ? void 0 : tt.map((t) => t).join((v) => v);
    "
);

test!(
    Syntax::Typescript(TsConfig {
        ..Default::default()
    }),
    |_| chain!(strip(), nullish_coalescing()),
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
    "#,
    r#"
    const normalizedQuestionSet = {
    };
    var _submissionIds;
    const submissions = ((_submissionIds = normalizedQuestionSet.submissionIds) !== null && _submissionIds !== void 0 ? _submissionIds : []).map((id, index)=>{
        const submission = normalizedQuestionSet.submissions?.[id];
        var _answers;
        const submissionAnswers = ((_answers = submission.answers) !== null && _answers !== void 0 ? _answers : []).map((answerId)=>normalizedQuestionSet.answers?.[answerId]
        );
        console.log(id, index);
        return {
            type: "super-submission"
        };
    });
    console.log(submissions);
    "#
);

// compile_to_class_constructor_collision_ignores_types
test!(
    Syntax::Typescript(TsConfig {
        ..Default::default()
    }),
    |_| chain!(
        strip_with_config({
            let mut config = strip::Config::default();
            config.use_define_for_class_fields = true;
            config
        }),
        class_properties()
    ),
    compile_to_class_constructor_collision_ignores_types,
    r#"
class C {
    // Output should not use `_initialiseProps`
    x: T;
    y = 0;
    constructor(T) {}
}

"#,
    r#"
class C {
  // Output should not use `_initialiseProps`
  constructor(T) {
    _defineProperty(this, "x", void 0);
    _defineProperty(this, "y", 0);
  }

}

"#
);

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| chain!(resolver(), decorators(Default::default()), strip()),
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
}",
    "import { bind } from 'some';
let A = _decorate([], function(_initialize) {
    class A{
        constructor(){
            _initialize(this);
        }
    }
    return {
        F: A,
        d: [{
                kind: 'get',
                decorators: [bind],
                key: 'foo',
                value: function foo() {
                    return 1;
                }
            }, {
                kind: 'method',
                decorators: [bind],
                key: 'bar',
                value: function bar() {
                    return 1;
                }
            }]
    };
});
"
);

to!(
    deno_8978,
    "
    import { any } from './dep.ts';

    export { any };
    export type { any as t };
    ",
    "
    import { any } from './dep.ts';

    export { any };
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
    ",
    "
    export var util;
    (function (util1) {
        function assertNever(_x) {
            throw new Error();
        }
        util1.assertNever = assertNever;
        util1.arrayToEnum = (items) => {
        };
        util1.getValidEnumValues = (obj) => {
        };
        util1.getValues = (obj) => {
        };
        util1.objectValues = (obj) => {
        };
    })(util || (util = {}));

    "
);

to!(
    namespace_001,
    "
    export namespace util {
        const c = 3;
        export const [a, b] = [1, 2, 3];
    }
    ",
    "
    export var util;
    (function (util1) {
        const c = 3;
        [util1.a, util1.b] = [1, 2, 3];
    })(util || (util = {}));
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
    ",
    "
    export var util;
    (function (util1) {
        const c = 3;
        function foo() {
        }
        util1.foo = foo;
        function bar() {
        }
    })(util || (util = {}));
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
    ",
    "
    var Test;
    (function(Test1) {
        var DummyValues;
        (function(DummyValues) {
            DummyValues['A'] = 'A';
            DummyValues['B'] = 'B';
        })(DummyValues || (DummyValues = {
        }));
        Test1.DummyValues = DummyValues;
    })(Test || (Test = {
    }));
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
    ",
    "
    export class TestClass {
        testMethod(args) {
            return args.param1;
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
    ",
    "
    "
);

to!(
    issue_1383,
    "
    declare global {
        const process: Process;
    }

    export {}
    ",
    "
    "
);

test_with_config!(
    issue_1472_1_define,
    strip::Config {
        use_define_for_class_fields: true,
        ..Default::default()
    },
    "
    class A extends Object {
        a = 1;
        constructor(public b = 2) {
          super();
        }
    }
    ",
    "
    class A extends Object {
        b;
        a = 1;
        constructor(b = 2){
            super();
            this.b = b;
        }
    }
    "
);

test_with_config!(
    issue_1472_1_no_define,
    strip::Config {
        use_define_for_class_fields: false,
        ..Default::default()
    },
    "
    class A extends Object {
        a = 1;
        constructor(public b = 2) {
          super();
        }
    }
    ",
    "
    class A extends Object {
        constructor(b = 2){
            super();
            this.b = b;
            this.a = 1;
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
    ",
    "
    var _key, _key1;
    class A {
        constructor() {
            this[_key] = 1;
        }
    }
    _key = (console.log(1), 'a');
    _key1 = (console.log(2), 'b');
    A[_key1] = 2;
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
    ",
    "
    var _key, _key1;
    class A {
        [(_key = (console.log(1), 'a'), _key1 = (console.log(2), 'b'), console.log(3), 'c')]() {}
        constructor() {
            this[_key] = 1;
        }
    }
    A[_key1] = 2;
    "
);

to!(
    issue_1515_1,
    "
    export class A {}
    export namespace A {
        export class B extends A {}
    }
",
    "
    export class A {
    }
    (function(A1) {
        class B extends A {
        }
        A1.B = B;
    })(A || (A = {
    }));
    "
);

to!(
    issue_1515_2,
    "
    export namespace A {
        export class B extends A {}
    }
    export enum A {}
",
    "
    export var A;
    (function(A1) {
        class B extends A {
        }
        A1.B = B;
    })(A || (A = {
    }));
    (function(A) {
    })(A || (A = {
    }));
    "
);

to!(
    issue_1515_3,
    "
    export class A {}
    export enum A {}
",
    "
    export class A {
    }
    (function(A) {
    })(A || (A = {
    }));
    "
);

to!(
    class_expression_sequence,
    "
    const A = class {
        static a = 1;
    }
    ",
    "
    var _class;
    const A = (_class = class {},
        _class.a = 1,
        _class);
    "
);

to!(
    issue_1508_1,
    "
    declare namespace twttr {
        export const txt: typeof import('twitter-text')
    }
    ",
    ""
);

to!(
    issue_1517_1,
    "
    interface X {
        get foo(): string;
        set foo(v: string | number);
    }
    ",
    ""
);

to!(
    issue_1517_2,
    "
    type Y = {
        get bar(): string;
        set bar(v: string | number);
    }
    ",
    ""
);

to!(
    import_shadow_named,
    "
    import { Test } from 'test';
    const Test = 2;
    console.log(Test);
    ",
    "
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
    ",
    "
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
    ",
    "
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
    ",
    "
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
    ",
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
    ",
    "
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
    ",
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
    ",
    ""
);

to!(
    import_concrete,
    "
    import { Test } from 'test';
    console.log(Test);
    ",
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
    ",
    "
    import { Test } from 'test';
    console.log(Test);
    "
);

to!(
    import_hoist,
    "
    console.log(Test);
    import { Test } from 'test';
    ",
    "
    console.log(Test);
    import { Test } from 'test';
    "
);

to!(
    import_shadow_hoist,
    "
    const Test = 2;
    console.log(Test);
    import { Test } from 'test';
    ",
    "
    const Test = 2;
    console.log(Test);
    "
);

to!(
    import_shadow_hoist_type,
    "
    interface Test {}
    import { Test } from 'test';
    ",
    ""
);

to!(
    import_shadow_hoist_type_concrete,
    "
    interface Test {}
    console.log(Test);
    import { Test } from 'test';
    ",
    "
    console.log(Test);
    import { Test } from 'test';
    "
);

to!(
    issue_1448_1,
    "
    import F = require('yaml')
    console.log(F)
    ",
    "
    const F = require('yaml');
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
    }",
    "
    export class Query {
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
    }",
    "
    export class Context {
        #store;
        #body;
        constructor(optionsOrContext){
            this.response = {
                headers: new Headers()
            };
            this.params = {
            };
            if (optionsOrContext instanceof Context) {
                Object.assign(this, optionsOrContext);
                this.customContext = this;
                return;
            }
        }
    }
    "
);
