#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]

use swc_common::chain;
use swc_ecma_transforms::{resolver, typescript::strip};

#[macro_use]
mod common;

macro_rules! to {
    ($name:ident, $from:expr, $to:expr) => {
        test!(
            ::swc_ecma_parser::Syntax::Typescript(Default::default()),
            |_| strip(),
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
    "export default class FeatureSet {
    log(a) {
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
}",
    "var Direction;
(function (Direction) {
    Direction[Direction['Up'] = 1] = 'Up';
    Direction[Direction['Down'] = 2] = 'Down';
    Direction[Direction['Left'] = 3] = 'Left';
})(Direction || (Direction = {}));"
);
