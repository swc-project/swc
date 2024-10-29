#![allow(deprecated)]

use std::{fs::read_to_string, path::PathBuf};

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015::{arrow, block_scoping, classes, function_name, template_literal},
    es2016::exponentiation,
    es2017::async_to_generator,
    es2020::optional_chaining,
    es2022::class_properties,
    es3::reserved_words,
};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec, test_fixture, Tester};

fn syntax() -> Syntax {
    Syntax::Es(Default::default())
}

fn tr(_: &Tester) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        function_name(),
        class_properties(Default::default(), unresolved_mark),
        classes(Default::default()),
        block_scoping(unresolved_mark),
        reserved_words(false),
    )
}

test!(
    syntax(),
    |t| tr(t),
    public_static_infer_name,
    r#"
var Foo = class {
  static num = 0;
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_call_exec,
    r#"
class Foo {
  foo = function() {
    return this;
  }

  test(other) {
    return [this.foo(), other.foo()];
  }
}

const f = new Foo;
const o = new Foo;
const test = f.test(o);
expect(test[0]).toBe(f);
expect(test[1]).toBe(o);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_instance_computed,
    r#"
function test(x) {
  class F {
    [x] = 1;
    constructor() {}
  }

  x = 'deadbeef';
  expect(new F().foo).toBe(1);
  x = 'wrong';
  expect(new F().foo).toBe(1);
}

test('foo');

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_super_statement,
    r#"
class Foo extends Bar {
  bar = "foo";

  constructor() {
    super();
  }
}

"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            function_name(),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    private_class_method,
    r#"
class Foo {
    #foo () {}
}
"#
);

test!(
    syntax(),
    |t| tr(t),
    private_foobar,
    r#"
class Child extends Parent {
  constructor() {
    super();
  }

  #scopedFunctionWithThis = () => {
    this.name = {};
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_call_exec,
    r#"
class Foo {
  #foo = function() {
    return this;
  }

  test(other) {
    return [this.#foo(), other.#foo()];
  }
}

const f = new Foo;
const o = new Foo;
const test = f.test(o);
expect(test[0]).toBe(f);
expect(test[1]).toBe(o);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_derived_multiple_supers,
    r#"
class Foo extends Bar {
  bar = "foo";

  constructor() {
    if (condition) {
      super();
    } else {
      super();
    }
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_static_call_exec,
    r#"
class Foo {
  static #foo = function(x) {
    return x;
  }

  test(x) {
    return Foo.#foo(x);
  }
}

const f = new Foo;
const test = f.test();
expect(f.test("bar")).toBe("bar");

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_instance_undefined_exec,
    r#"
class Foo {
  #bar;

  test() {
    return this.#bar;
  }
}

expect(new Foo().test()).toBe(undefined);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_instance_exec,
    r#"
class Foo {
  #bar = "foo";

  test() {
    return this.#bar;
  }

  update() {
    this.#bar++;
  }

  set(val) {
    this.#bar = val;
  }

  static test(foo) {
    return foo.#bar;
  }

  static update(foo) {
    foo.#bar **= 2;
  }
}

const f = new Foo();
expect(f.test()).toBe("foo");
expect(Foo.test(f)).toBe("foo");
expect("bar" in f).toBe(false);

f.set(1);
expect(f.test()).toBe(1);
f.update();
expect(Foo.test(f)).toBe(2);
Foo.update(f);
expect(f.test()).toBe(4);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_regression_t6719,
    r#"
function withContext(ComposedComponent) {
    return class WithContext extends Component {

        static propTypes = {
            context: PropTypes.shape(
                {
                    addCss: PropTypes.func,
                    setTitle: PropTypes.func,
                    setMeta: PropTypes.func,
                }
            ),
        };
    };
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_super_with_collision,
    r#"
class A {
  force = force;
  foo = super.method();

  constructor(force) {}
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_call,
    r#"
class Foo {
  foo = function() {
    return this;
  }

  test(other) {
    this.foo();
    other.obj.foo();
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_instance_computed_exec,
    r#"
function test(x) {
  class F {
    [x] = 1;
    constructor() {}
  }

  x = 'deadbeef';
  expect(new F().foo).toBe(1);
  x = 'wrong';
  expect(new F().foo).toBe(1);
}

test('foo');

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_declaration_order,
    r#"
class C {
  y = this.#x;
  #x;
}

expect(() => {
  new C();
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    nested_class_super_call_in_key,
    r#"

class Hello {
  constructor() {
    return {
      toString() {
        return 'hello';
      },
    };
  }
}

class Outer extends Hello {
  constructor() {
    class Inner {
      [super()] = "hello";
    }

    return new Inner();
  }
}

expect(new Outer().hello).toBe('hello');

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_instance_undefined,
    r#"
class Foo {
  bar;
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_derived_multiple_supers,
    r#"
class Foo extends Bar {
  #bar = "foo";

  constructor() {
    if (condition) {
      super();
    } else {
      super();
    }
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_native_classes_exec,
    r#"
class Foo {
  static foo = "foo";
  bar = "bar";

  static test() {
    return Foo.foo;
  }

  test() {
    return this.bar;
  }
}

const f = new Foo();
expect("foo" in Foo).toBe(true)
expect("bar" in f).toBe(true)
expect(Foo.test()).toBe("foo")
expect(f.test()).toBe("bar")

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_regression_t2983,
    r#"
call(class {
  static test = true
});

export default class {
  static test = true
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_static,
    r#"
class Foo {
  static bar = "foo";
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_instance_undefined,
    r#"
class Foo {
  #bar;
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_declaration_order_exec,
    r#"
class C {
  y = this.#x;
  #x;
}

expect(() => {
  new C();
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_update,
    r#"
class Foo {
  foo = 0;

  test(other) {
    this.foo++;
    ++this.foo;
    other.obj.foo++;
    ++other.obj.foo;
  }
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_super_call,
    r#"
class A {
  foo() {
    return "bar";
  }
}

class B extends A {
  foo = super.foo();
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_constructor_collision,
    r#"
var foo = "bar";

class Foo {
  #bar = foo;

  constructor() {
    var foo = "foo";
  }
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_constructor_collision,
    r#"
var foo = "bar";

class Foo {
  bar = foo;
  static bar = baz;

  constructor() {
    var foo = "foo";
    var baz = "baz";
  }
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_computed,
    r#"
const foo = "foo";
const bar = () => {};
const four = 4;

class MyClass {
  static [one()] = "test";
  static [2 * 4 + 7] = "247";
  static [2 * four + 7] = "247";
  static [2 * four + seven] = "247";
  [null] = "null";
  [undefined] = "undefined";
  [void 0] = "void 0";
  get ["whatever"]() {}
  set ["whatever"](value) {}
  get [computed()]() {}
  set [computed()](value) {}
  ["test" + one]() {}
  static [10]() {}
  [/regex/] = "regex";
  [foo] = "foo";
  [bar] = "bar";
  [baz] = "baz";
  [`template`] = "template";
  [`template${expression}`] = "template-with-expression";
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_assignment,
    r#"
class Foo {
  foo = 0;

  test(other) {
    this.foo++;
    this.foo += 1;
    this.foo = 2;
    other.obj.foo++;
    other.obj.foo += 1;
    other.obj.foo = 2;
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_static_exec,
    r#"
class Foo {
  static num = 0;
  static str = "foo";
}

expect(Foo.num).toBe(0);
expect(Foo.num = 1).toBe(1);
expect(Foo.str).toBe("foo");
expect(Foo.str = "bar").toBe("bar");

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    regression_7371_exec_1,
    r#"

class C {
}

class A extends C {
  field = 1;

  constructor() {
    super();

    class B extends C {
      constructor() {
        super();

        expect(this.field).toBeUndefined();
      }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new A();
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    regression_7371_exec_2,
    r#"
class Obj {
  constructor() {
    return {};
  }
}

// ensure superClass is still transformed
class SuperClass extends Obj {
  field = 1;

  constructor() {
    class B extends (super(), Obj) {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new SuperClass();

// ensure ComputedKey Method is still transformed
class ComputedMethod extends Obj {
  field = 1;

  constructor() {
    class B extends Obj {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }

      [super()]() { }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new ComputedMethod();


// ensure ComputedKey Field is still transformed
class ComputedField extends Obj {
  field = 1;

  constructor() {
    class B extends Obj {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }

      [super()] = 1;
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new ComputedField();

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_static_inherited_exec,
    r#"
class Base {
  static #foo = 1;

  static getThis() {
    return this.#foo;
  }

  static updateThis(val) {
    return (this.#foo = val);
  }

  static getClass() {
    return Base.#foo;
  }

  static updateClass(val) {
    return (Base.#foo = val);
  }
}

class Sub1 extends Base {
  static #foo = 2;

  static update(val) {
    return (this.#foo = val);
  }
}

class Sub2 extends Base {}

expect(Base.getThis()).toBe(1);
expect(Base.getClass()).toBe(1);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(1);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(1);

expect(Sub1.update(3)).toBe(3);
expect(Base.getThis()).toBe(1);
expect(Base.getClass()).toBe(1);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(1);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(1);

expect(Base.updateThis(4)).toBe(4);
expect(Base.getThis()).toBe(4);
expect(Base.getClass()).toBe(4);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(4);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(4);

expect(Base.updateClass(5)).toBe(5);
expect(Base.getThis()).toBe(5);
expect(Base.getClass()).toBe(5);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(5);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(5);

expect(() => Sub2.updateThis(6)).toThrow();
expect(Sub2.updateClass(7)).toBe(7);
expect(Base.getThis()).toBe(7);
expect(Base.getClass()).toBe(7);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(7);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(7);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    nested_class_super_property_in_key_exec,
    r#"

class Hello {
  toString() {
    return 'hello';
  }
}

class Outer extends Hello {
  constructor() {
    super();
    class Inner {
      [super.toString()] = 'hello';
    }

    return new Inner();
  }
}

expect(new Outer().hello).toBe('hello');

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_super_statement,
    r#"
class Foo extends Bar {
  #bar = "foo";

  constructor() {
    super();
  }
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_private_in_derived,
    r#"
class Outer {
  #outer;

  constructor() {
    class Test extends this.#outer {
    }
  }
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_update,
    r#"
class Foo {
  #foo = 0;

  test(other) {
    this.#foo++;
    ++this.#foo;
    other.obj.#foo++;
    ++other.obj.#foo;
  }
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_super_expression,
    r#"
class Foo extends Bar {
  bar = "foo";

  constructor() {
    foo(super());
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_computed_initialization_order_exec,
    r#"
const actualOrder = [];

const track = i => {
  actualOrder.push(i);
  return i;
};

class MyClass {
  static [track(1)] = track(10);
  [track(2)] = track(13);
  get [track(3)]() {
    return "foo";
  }
  set [track(4)](value) {
    this.bar = value;
  }
  [track(5)] = track(14);
  static [track(6)] = track(11);
  static [track(7)] = track(12);
  [track(8)]() {}
  [track(9)] = track(15);
}

const inst = new MyClass();

const expectedOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
expect(actualOrder).toEqual(expectedOrder);

expect(MyClass[1]).toBe(10);
expect(inst[2]).toBe(13);
expect(inst[3]).toBe("foo");
inst[4] = "baz";
expect(inst.bar).toBe("baz");
expect(inst[5]).toBe(14);
expect(MyClass[6]).toBe(11);
expect(MyClass[7]).toBe(12);
expect(typeof inst[8]).toBe("function");
expect(inst[9]).toBe(15);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    nested_class_super_call_in_key_exec,
    r#"

class Hello {
  constructor() {
    return {
      toString() {
        return 'hello';
      },
    };
  }
}

class Outer extends Hello {
  constructor() {
    class Inner {
      [super()] = "hello";
    }

    return new Inner();
  }
}

expect(new Outer().hello).toBe('hello');

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_update_exec,
    r#"
class Foo {
  #foo = 0;

  test(other) {
    return [
      this.#foo++,
      this.#foo,
      ++this.#foo,
      this.#foo,
      other.obj.#foo++,
      other.obj.#foo,
      ++other.obj.#foo,
      other.obj.#foo,
    ];
  }
}

const f = new Foo;
const results = f.test({ obj: f });
expect(results[0]).toBe(0);
expect(results[1]).toBe(1);
expect(results[2]).toBe(2);
expect(results[3]).toBe(2);
expect(results[4]).toBe(2);
expect(results[5]).toBe(3);
expect(results[6]).toBe(4);
expect(results[7]).toBe(4);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_extracted_this,
    r#"
var foo = "bar";

class Foo {
  bar = this;
  baz = foo;

  constructor(foo) {
  }
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_derived,
    r#"
class Foo {
  #prop = "foo";
}

class Bar extends Foo {
  #prop = "bar";
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_super_call,
    r#"
class A {
  foo() {
    return "bar";
  }
}

class B extends A {
  #foo = super.foo();
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_reference_in_other_property,
    r#"
class Foo {
  one = this.#private;
  #two = this.#private;
  #private = 0;
  three = this.#private;
  #four = this.#private;
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    nested_class_super_property_in_key,
    r#"

class Hello {
  toString() {
    return 'hello';
  }
}

class Outer extends Hello {
  constructor() {
    super();
    class Inner {
      [super.toString()] = 'hello';
    }

    return new Inner();
  }
}

expect(new Outer().hello).toBe('hello');

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_reevaluated_exec,
    r#"
function classFactory() {
  return class Foo {
    #foo = "foo";
    static #bar = "bar";

    instance() {
      return this.#foo;
    }

    static() {
      return Foo.#bar;
    }

    static instance(inst) {
      return inst.#foo;
    }

    static static() {
      return Foo.#bar;
    }
  };
}

const Foo1 = classFactory();
const Foo2 = classFactory();

const f1 = new Foo1();
const f2 = new Foo2();

expect(f1.instance()).toBe("foo");
expect(f1.static()).toBe("bar");
expect(f2.instance()).toBe("foo");
expect(f2.static()).toBe("bar");

expect(Foo1.instance(f1)).toBe("foo");
expect(Foo1.static()).toBe("bar");
expect(Foo2.instance(f2)).toBe("foo");
expect(Foo2.static()).toBe("bar");

expect(() => {
  f1.instance.call(f2), undefined;
}).toThrow();
expect(() => {
  f2.instance.call(f1), undefined;
}).toThrow();
expect(() => {
  Foo1.instance(f2), undefined;
}).toThrow();
expect(() => {
  Foo2.instance(f1), undefined;
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_numeric,
    r#"
class Foo {
  0 = "foo";
  1 = "bar";
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_assignment,
    r#"
class Foo {
  #foo = 0;

  test(other) {
    this.#foo += 1;
    this.#foo = 2;
    other.obj.#foo += 1;
    other.obj.#foo = 2;
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_constructor_collision_exec,
    r#"
var foo = "bar";

class Foo {
  #bar = foo;

  constructor() {
    var foo = "foo";
  }

  test() {
    return this.#bar;
  }
}

const f = new Foo;
expect(f.test()).toBe(foo);
expect("bar" in f).toBe(false);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_static_export,
    r#"
export class MyClass {
  static property = value;
}

export default class MyClass2 {
  static property = value;
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_multiple,
    r#"
class Foo {
  #x = 0;
  #y = this.#x;
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_derived,
    r#"
class Foo extends Bar {
  bar = "foo";
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_static_undefined_exec,
    r#"
class Foo {
  static num;
}

expect("num" in Foo).toBe(true);
expect(Foo.num).toBeUndefined();

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_instance,
    r#"
class Foo {
  bar = "foo";
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    static_property_tdz_edgest_case_exec,
    r#"
expect(() => {
  class A {
    static [{ x: A || 0 }.x];
  }
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_non_block_arrow_func,
    r#"
export default param =>
  class App {
    static props = {
      prop1: 'prop1',
      prop2: 'prop2'
    }

    getParam() {
      return param;
    }
  }

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_static_undefined,
    r#"
class Foo {
  static bar;
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_static_infer_name_exec,
    r#"
var Foo = class {
  static num = 0;
}

expect(Foo.num).toBe(0);
expect(Foo.num = 1).toBe(1);
expect(Foo.name).toBe("Foo");

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    static_property_tdz_general_exec,
    r#"
expect(() => {
  class C {
    static [C + 3] = 3;
  }
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_call,
    r#"
class Foo {
  #foo = function() {
    return this;
  }

  test(other) {
    this.#foo();
    other.obj.#foo();
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_derived_exec,
    r#"
class Foo {
  #prop = "foo";

  foo() {
    return this.#prop;
  }
}

class Bar extends Foo {
  #prop = "bar";

  bar() {
    return this.#prop;
  }
}

const f = new Foo;
expect(f.foo()).toBe("foo");

const b = new Bar;
expect(b.foo()).toBe("foo");
expect(b.bar()).toBe("bar");

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_extracted_this,
    r#"
var foo = "bar";

class Foo {
  #bar = this;
  #baz = foo;

  constructor(foo) {
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_canonical_exec,
    r#"
class Point {
    #x;
    #y;

    constructor(x = 0, y = 0) {
        this.#x = +x;
        this.#y = +y;
    }

    get x() { return this.#x }
    set x(value) { this.#x = +value }

    get y() { return this.#y }
    set y(value) { this.#y = +value }

    equals(p) { return this.#x === p.#x && this.#y === p.#y }

    toString() { return `Point<${ this.#x },${ this.#y }>` }

}

const p1 = new Point(1, 2);
const p2 = new Point(2, 3);
const p3 = new Point(1, 2);

expect(p1.x).toBe(1);
expect(p1.y).toBe(2);
expect(p2.x).toBe(2);
expect(p2.y).toBe(3);
expect(p3.x).toBe(1);
expect(p3.y).toBe(2);

expect(p1.equals(p1)).toBe(true)
expect(p1.equals(p2)).toBe(false)
expect(p1.equals(p3)).toBe(true)
expect(p2.equals(p1)).toBe(false)
expect(p2.equals(p2)).toBe(true)
expect(p2.equals(p3)).toBe(false)
expect(p3.equals(p1)).toBe(true)
expect(p3.equals(p2)).toBe(false)
expect(p3.equals(p3)).toBe(true)

expect(p1.toString()).toBe("Point<1,2>")
expect(p2.toString()).toBe("Point<2,3>")
expect(p3.toString()).toBe("Point<1,2>")

p1.x += 1;
p1.y = 3;
p2.x -= 1;
p2.y = 3;
p3.x = 0;
p3.y = 0;

expect(p1.x).toBe(2);
expect(p1.y).toBe(3);
expect(p2.x).toBe(1);
expect(p2.y).toBe(3);
expect(p3.x).toBe(0);
expect(p3.y).toBe(0);

expect(p1.equals(p1)).toBe(true)
expect(p1.equals(p2)).toBe(false)
expect(p1.equals(p3)).toBe(false)
expect(p2.equals(p1)).toBe(false)
expect(p2.equals(p2)).toBe(true)
expect(p2.equals(p3)).toBe(false)
expect(p3.equals(p1)).toBe(false)
expect(p3.equals(p2)).toBe(false)
expect(p3.equals(p3)).toBe(true)

expect(p1.toString()).toBe("Point<2,3>")
expect(p2.toString()).toBe("Point<1,3>")
expect(p3.toString()).toBe("Point<0,0>")

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_static_undefined_exec,
    r#"
class Foo {
  static #bar;

  static test() {
    return Foo.#bar;
  }

  test() {
    return Foo.#bar;
  }
}

expect("bar" in Foo).toBe(false);
expect(Foo.test()).toBe(undefined);
expect(Foo.test()).toBe(undefined);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_update_exec,
    r#"
class Foo {
  foo = 0;

  test(other) {
    return [
      this.foo++,
      this.foo,
      ++this.foo,
      this.foo,
      other.obj.foo++,
      other.obj.foo,
      ++other.obj.foo,
      other.obj.foo,
    ];
  }
}

const f = new Foo;
const results = f.test({ obj: f });
expect(results[0]).toBe(0);
expect(results[1]).toBe(1);
expect(results[2]).toBe(2);
expect(results[3]).toBe(2);
expect(results[4]).toBe(2);
expect(results[5]).toBe(3);
expect(results[6]).toBe(4);
expect(results[7]).toBe(4);

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_static_call,
    r#"
class Foo {
  static #foo = function(x) {
    return x;
  }

  test(x) {
    return Foo.#foo(x);
  }
}


"#
);

test!(
    syntax(),
    |t| tr(t),
    private_super_expression,
    r#"
class Foo extends Bar {
  #bar = "foo";

  constructor() {
    foo(super());
  }
}

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_native_classes_exec,
    r#"
class Foo {
  static #foo = "foo";
  #bar = "bar";

  static test() {
    return Foo.#foo;
  }

  test() {
    return this.#bar;
  }
}

const f = new Foo();
expect("foo" in Foo).toBe(false)
expect("bar" in f).toBe(false)
expect(Foo.test()).toBe("foo")
expect(f.test()).toBe("bar")

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_multiple_exec,
    r#"
class Foo {
  #x = 0;
  #y = this.#x + 1;

  test() {
    return this.#y;
  }
}

const f = new Foo();
expect(f.test()).toBe(1);

"#
);

test!(
    syntax(),
    |t| tr(t),
    custom_instance_update,
    "
class Foo {
    #x = 0;

    test() {
        this.#x++;
        ++this.#x;
    }
}
"
);

test!(
    syntax(),
    |t| tr(t),
    custom_static_update,
    "
class Foo {
    static #x = 0;

    test() {
        Foo.#x++;
        ++Foo.#x;
    }
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_308,
    "function bar(props) {}
class Foo {
  constructor() {
    super();
    bar();
  }
  onBar = () => {
    bar();
  };
}"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
        )
    },
    issue_342,
    "class Foo {
  constructor(bar) {
    this._bar = bar;
  }

  qux = {
    frob: (bar) => {},
  };
}"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(unresolved_mark),
        )
    },
    issue_443,
    "
const MODE = 1;

class foo {
  static MODE = MODE;

  constructor() {
    this.mode = MODE;
  }
}
"
);

// public_regression_t7364
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            async_to_generator(Default::default(), Mark::new()),
        )
    },
    public_regression_t7364,
    r#"
class MyClass {
  myAsyncMethod = async () => {
    console.log(this);
  }
}

(class MyClass2 {
  myAsyncMethod = async () => {
    console.log(this);
  }
})

export default class MyClass3 {
  myAsyncMethod = async () => {
    console.log(this);
  }
}

"#
);

// private_regression_t6719
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_regression_t6719,
    r#"
function withContext(ComposedComponent) {
    return class WithContext extends Component {

        static #propTypes = {
            context: PropTypes.shape(
                {
                    addCss: PropTypes.func,
                    setTitle: PropTypes.func,
                    setMeta: PropTypes.func,
                }
            ),
        };
    };
}

"#
);

// private_reevaluated
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_reevaluated,
    r#"
function classFactory() {
  return class Foo {
    #foo = "foo";
    static #bar = "bar";

    instance() {
      return this.#foo;
    }

    static() {
      return Foo.#bar;
    }

    static instance(inst) {
      return inst.#foo;
    }

    static static() {
      return Foo.#bar;
    }
  };
}

"#
);

// private_static
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_static,
    r#"
class Foo {
  static #bar = "foo";

  static test() {
    return Foo.#bar;
  }

  test() {
    return Foo.#bar;
  }
}

expect("bar" in Foo).toBe(false)
expect(Foo.test()).toBe("foo")
expect(Foo.test()).toBe("foo")

"#
);

// private_destructuring_object_pattern_1
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
            block_scoping(Mark::new()),
        )
    },
    private_destructuring_object_pattern_1,
    r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 'foo';
    ({ x: this.x = this.#client, y: this.#client, z: this.z = this.#client } = props)
  }
}
"#
);

// private_static_inherited
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_static_inherited,
    r#"
class Base {
  static #foo = 1;

  static getThis() {
    return this.#foo;
  }

  static updateThis(val) {
    return (this.#foo = val);
  }

  static getClass() {
    return Base.#foo;
  }

  static updateClass(val) {
    return (Base.#foo = val);
  }
}

class Sub1 extends Base {
  static #foo = 2;

  static update(val) {
    return (this.#foo = val);
  }
}

class Sub2 extends Base {}

"#
);

// private_destructuring_object_pattern_1_exec
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    private_destructuring_object_pattern_1_exec,
    r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 'foo';
    ;({ x: this.x = this.#client, y: this.#client, z: this.z = this.#client } = props)
  }

  getClient() {
    return this.#client;
  }
}

const foo = new Foo({ y: 'bar' });
expect(foo.getClient()).toBe('bar');
expect(foo.x).toBe('foo');
expect(foo.z).toBe('bar');

"#
);

// private_static_undefined
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_static_undefined,
    r#"
class Foo {
  static #bar;

  static test() {
    return Foo.#bar;
  }

  test() {
    return Foo.#bar;
  }
}

"#
);

// private_destructuring_array_pattern
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
            block_scoping(Mark::new()),
        )
    },
    private_destructuring_array_pattern,
    r#"
class Foo {
  #client

  constructor(props) {
    ([this.#client] = props);
  }
}

"#
);

// private_regression_t2983
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_regression_t2983,
    r#"
call(class {
  static #test = true
});

export default class {
  static #test = true
}

"#
);

// private_regression_t7364
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            async_to_generator(Default::default(), unresolved_mark),
            block_scoping(unresolved_mark),
        )
    },
    private_regression_t7364,
    r#"
class MyClass {
  #myAsyncMethod = async () => {
    console.log(this);
  }
}

(class MyClass2 {
  #myAsyncMethod = async () => {
    console.log(this);
  }
})

export default class MyClass3 {
  #myAsyncMethod = async () => {
    console.log(this);
  }
}

"#
);

// private_destructuring_array_pattern_1
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
            block_scoping(Mark::new()),
        )
    },
    private_destructuring_array_pattern_1,
    r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 1;
    ([this.x = this.#client, this.#client, this.y = this.#client] = props);
  }
}
"#
);

// regression_8882_exec
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    regression_8882_exec,
    r#"
const classes = [];
for (let i = 0; i <= 10; ++i) {
  classes.push(
    class A {
      [i] = `computed field ${i}`;
      static foo = `static field ${i}`;
      #bar = `private field ${i}`;
      getBar() {
        return this.#bar;
      }
    }
  );
}

for(let i=0; i<= 10; ++i) {
  const clazz = classes[i];
  expect(clazz.foo).toBe('static field ' + i);

  const instance = new clazz();
  expect(Object.getOwnPropertyNames(instance)).toEqual([String(i)])
  expect(instance[i]).toBe('computed field ' + i);
  expect(instance.getBar()).toBe('private field ' + i);
}
"#
);

test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    regression_8882_exec_2,
    r#"
const classes = [];
for (let i = 0; i <= 10; ++i) {
  class A {
    [i] = `computed field ${i}`;
    static foo = `static field ${i}`;
    #bar = `private field ${i}`;
    getBar() {
      return this.#bar;
    }
  }

  classes.push(A)
}

for(let i=0; i<= 10; ++i) {
  const clazz = classes[i];
  expect(clazz.foo).toBe('static field ' + i);

  const instance = new clazz();
  expect(Object.getOwnPropertyNames(instance)).toEqual([String(i)])
  expect(instance[i]).toBe('computed field ' + i);
  expect(instance.getBar()).toBe('private field ' + i);
}
"#
);

test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    private_field_reinitialized,
    r#"
class Base {
  constructor(obj) {
    return obj;
  }
}

class Derived extends Base {
  #c = 123
}

const foo = {}
new Derived(foo)
expect(() => new Derived(foo)).toThrow()
"#
);

// private_static_export
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_static_export,
    r#"
export class MyClass {
  static #property = value;
}

export default class MyClass2 {
  static #property = value;
}

"#
);

// static_property_tdz_edgest_case
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
        )
    },
    static_property_tdz_edgest_case,
    r#"
class A {
  static [{ x: A || 0 }.x];
}

"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
        )
    },
    static_property_tdz_false_alarm,
    r#"
class A {
static A = 123;
}
"#
);

// regression_6153
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            arrow(Mark::new()),
        )
    },
    regression_6153,
    r#"
() => {
  class Foo {
    fn = () => console.log(this);
    static fn = () => console.log(this);
  }
};

() => class Bar {
  fn = () => console.log(this);
  static fn = () => console.log(this);
};

() => {
  class Baz {
    fn = () => console.log(this);
    force = force
    static fn = () => console.log(this);

    constructor(force) {}
  }
};

var qux = function() {
  class Qux {
    fn = () => console.log(this);
    static fn = () => console.log(this);
  }
}.bind(this)

"#
);

// regression_7371
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            arrow(unresolved_mark),
        )
    },
    regression_7371,
    r#"
"use strict";
class C {
}

class A extends C {
  field = 1;

  constructor() {
    super();

    class B extends C {
      constructor() {
        super();

        expect(this.field).toBeUndefined();
      }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new A();

class Obj {
  constructor() {
    return {};
  }
}

// ensure superClass is still transformed
class SuperClass extends Obj {
  field = 1;

  constructor() {
    class B extends (super(), Obj) {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new SuperClass();

// ensure ComputedKey Method is still transformed
class ComputedMethod extends Obj {
  field = 1;

  constructor() {
    class B extends Obj {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }

      [super()]() { }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new ComputedMethod();


// ensure ComputedKey Field is still transformed
class ComputedField extends Obj {
  field = 1;

  constructor() {
    class B extends Obj {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }

      [super()] = 1;
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new ComputedField();

"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    private_optional_chain_call,
    r#"
class A {
    #fieldFunc;
    x = 1;
    test() {
        this.#fieldFunc?.();
    }
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    private_optional_chain_member,
    r#"
class MyClass {
  #a
  foo(o) {
    o?.#a
  }
}
"#
);

// private_canonical
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
            block_scoping(Mark::new()),
        )
    },
    private_canonical,
    r#"
class Point {
    #x;
    #y;

    constructor(x = 0, y = 0) {
        this.#x = +x;
        this.#y = +y;
    }

    get x() { return this.#x }
    set x(value) { this.#x = +value }

    get y() { return this.#y }
    set y(value) { this.#y = +value }

    equals(p) { return this.#x === p.#x && this.#y === p.#y }

    toString() { return `Point<${ this.#x },${ this.#y }>` }

}

"#
);

// regression_8882
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    regression_8882,
    r#"
const classes = [];
for(let i = 0; i <= 10; ++i){
    classes.push(function() {
        class A{
             getBar() {
                return _class_private_field_get(this, _bar);
            }
            constructor(){
                _define_property(this, i, `computed field ${i}`);
                _bar.set(this, {
                    writable: true,
                    value: `private field ${i}`
                });
            }
        }
        _define_property(A, 'foo', `static field ${i}`);
        var _bar = new WeakMap();
        return A;
    }());
}

"#
);

// private_destructuring_array_pattern_3
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
            block_scoping(Mark::new()),
        )
    },
    private_destructuring_array_pattern_3,
    r#"
class Foo {
  #client

  constructor(props) {
    ([this.#client = 5] = props);
  }
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    staic_private_destructuring_array_pattern,
    r#"
class A {
  #a = 123
  foo() {
    [a().#a] = []
  }
}
"#
);

// public_static_super_exec
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    public_static_super_exec,
    r#"
class A {
  static prop = 1;
}

class B extends A {
  static prop = 2;
  static propA = super.prop;
  static getPropA = () => super.prop;
}

const { prop, propA, getPropA } = B;

expect(prop).toBe(2);
expect(propA).toBe(1);
expect(getPropA()).toBe(1);

"#
);

// private_destructuring_array_pattern_2
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
            block_scoping(Mark::new()),
        )
    },
    private_destructuring_array_pattern_2,
    r#"
class Foo {
  #client

  constructor(props) {
    ([x, ...this.#client] = props);
  }
}
"#
);

// private_non_block_arrow_func
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_non_block_arrow_func,
    r#"
export default param =>
  class App {
    static #props = {
      prop1: 'prop1',
      prop2: 'prop2'
    }

    getParam() {
      return param;
    }
  }

"#
);

// regression_8110
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    regression_8110,
    r#"
const field = Symbol('field');

class A {
  [field] = 10;
}

"#
);

// public_computed_without_block_exec
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    public_computed_without_block_exec,
    r#"
const createClass = (k) => class { [k()] = 2 };

const clazz = createClass(() => 'foo');
const instance = new clazz();
expect(instance.foo).toBe(2);
"#
);

// private_instance
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            exponentiation(),
            classes(Default::default()),
            block_scoping(Mark::new()),
        )
    },
    private_instance,
    r#"
class Foo {
  #bar = "foo";
}

"#
);

// static_property_tdz_general
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
        )
    },
    static_property_tdz_general,
    r#"
class C {
  static [C + 3] = 3;
}

"#
);

// public_native_classes
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    public_native_classes,
    r#"
class Foo {
  static foo = "foo";
  bar = "bar";
}

"#
);

// public_arrow_static_this_without_transform
test!(
    // Emitting class properties is not supported yet.
    syntax(),
    |_| arrow(Mark::new()),
    public_arrow_static_this_without_transform,
    r#"
class Foo {
  static fn = () => console.log(this);
}

"#
);

// private_static_infer_name
test!(
    // Seems useless, while being hard to implement.
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_static_infer_name,
    r#"
var Foo = class {
  static #num = 0;
}

"#
);

// regression_7951
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    regression_7951,
    r#"
export class Foo extends Bar {
  static foo = {};

  test = args;
}

"#
);

// private_native_classes
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            block_scoping(Mark::new()),
        )
    },
    private_native_classes,
    r#"
class Foo {
  static #foo = "foo";
  #bar = "bar";

  static test() {
    return Foo.#foo;
  }

  test() {
    return this.#bar;
  }
}

"#
);

// public_computed_without_block
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
            block_scoping(Mark::new()),
        )
    },
    public_computed_without_block,
    r#"
const createClass = (k) => class { [k()] = 2 };

"#
);

// private_destructuring_array_pattern_2_exec
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    private_destructuring_array_pattern_2_exec,
    r#"
class Foo {
  #client

  constructor(props) {
    let x;
    ;([x, ...this.#client] = props);
  }

  getClient() {
    return this.#client;
  }
}

const foo = new Foo(['foo', 'bar', 'baz', 'quu']);
expect(foo.getClient()).toEqual(['bar', 'baz', 'quu']);

"#
);

// public_static_super
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
            block_scoping(Mark::new()),
        )
    },
    public_static_super,
    r#"
class A {
  static prop = 1;
}

class B extends A {
  static prop = 2;
  static propA = super.prop;
  static getPropA = () => super.prop;
}

"#
);

// private_destructuring_array_pattern_exec
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    private_destructuring_array_pattern_exec,
    r#"
class Foo {
  #client

  constructor(props) {
    ;([this.#client] = props);
  }

  getClient() {
    return this.#client;
  }
}

const foo = new Foo(['bar']);
expect(foo.getClient()).toBe('bar');

"#
);

// private_destructuring_array_pattern_1_exec
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    private_destructuring_array_pattern_1_exec,
    r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 1;
    ;([this.x = this.#client, this.#client, this.y = this.#client] = props);
  }

  getClient() {
    return this.#client;
  }
}

const foo = new Foo([undefined, 'bar']);
expect(foo.getClient()).toBe('bar');
expect(foo.x).toBe(1);
expect(foo.y).toBe('bar');

"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1306_1,
    r#"
  class Animal {
    #name;

    constructor(name) {
      this.#name = name
    }

    noise() {
      return this.#name
    }
  }
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1306_2,
    r#"
class Animal {
  #name;

  constructor(name) {
    this.#name = name
  }

  noise() {
    return this.#name.toUpperCase()
  }
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1333_1,
    "
  class Foo {
    #ws;
    #ws2;
    get connected() {
        return this.#ws2 && this.#ws.readyState === _ws1.default.OPEN;
    }
  }
  "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1333_2,
    "
  class Test {
    #ws;
    #serialization;
    #seq;

    _packet(raw) {
        /** @type {DiscordPacket} */
        let pak;
        try {
            pak = this.#serialization.decode(raw);
            this.manager.emit(ClientEvent.RAW_PACKET, pak, this);
        } catch (e) {
            this.manager.client.emit(ClientEvent.SHARD_ERROR, e, this);
            return;
        }

        switch (pak.t) {
            case 'READY':
                this.emit(ShardEvent.READY);

                this.session.id = pak.d.session_id;
                this.expectedGuilds = new Set(pak.d.guilds.map((g) => g.id));
                this.status = Status.WAITING_FOR_GUILDS;

                this.heartbeat.acked = true;
                this.heartbeat.new('ready');
                break;
            case 'RESUMED':
                /**
                * Emitted when a shards connection has been resumed.
                * @event Shard#resumed
                */
                this.emit(ShardEvent.RESUMED);

                this.status = Status.READY;
                this.heartbeat.acked = true;
                this.heartbeat.new('resumed');
                break;
        }

        if (pak.s !== null) {
            if (this.#seq !== -1 && pak.s > this.#seq + 1) {
                this._debug(`Non-consecutive sequence [${this.#seq} => ${pak.s}]`);
            }

            this.#seq = pak.s;
        }

        switch (pak.op) {
            case GatewayOp.HELLO:
                this.heartbeat.delay = pak.d.heartbeat_interval;
                this.session.hello();
                break;
            case GatewayOp.RECONNECT:
                this._debug('Gateway asked us to reconnect.');
                this.destroy({ code: 4000 });
                break;
            case GatewayOp.INVALID_SESSION:
                this._debug(`Invalid Session: Resumable => ${pak.d}`);
                if (pak.d) {
                    this.session.resume();
                    break;
                }

                this.#seq = -1;
                this.session.reset();
                this.status = Status.RECONNECTING;

                this.emit(ShardEvent.INVALID_SESSION);
                break;
            case GatewayOp.HEARTBEAT:
                this.heartbeat.new('requested');
                break;
            case GatewayOp.HEARTBEAT_ACK:
                this.heartbeat.ack();
                break;
            default:
                if (
                    this.status === Status.WAITING_FOR_GUILDS &&
                    pak.t === 'GUILD_CREATE'
                ) {
                    this.expectedGuilds.delete(pak.d.id);
                    this._checkReady();
                }
        }
    }
  }
  "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1333_3,
    "
    class Test {
      #ws;
      #serialization;

      _packet(raw) {
        /** @type {DiscordPacket} */
        let pak;
        try {
            pak = this.#serialization.decode(raw);
            this.manager.emit(ClientEvent.RAW_PACKET, pak, this);
        } catch (e) {
            this.manager.client.emit(ClientEvent.SHARD_ERROR, e, this);
            return;
        }

        switch (pak.t) {
            case 'READY':
            case 'RESUMED':
        }
      }
    }
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1333_4,
    "
  class Test {
    #ws;
    #serialization;

    _packet(raw) {
      /** @type {DiscordPacket} */
      let pak;
      try {
          pak = this.#serialization.decode(raw);
      } catch (e) {
          return;
      }
    }
  }
  "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1333_5,
    "
    class Test {
      #serialization;
      _packet(raw) {
        pak = this.#serialization.decode(raw);
      }
    }
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1333_6,
    "
    class Test {
      #serialization;
      _packet(raw) {
        this.#serialization.decode(raw);
      }
    }
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1660_1,
    "
    console.log(class { run() { } });
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_3055_1,
    "
export class Node {
    foo() {
        this.#bar(this);
    }

    #bar(parent) {
        parent.#baz(this);
        parent.baz.#baz(this);
    }

    #baz(child) { }
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_3618,
    "
class MyClass {
  get #a() {}
  set #a(x) {}
  static get #b() {}
  static set #b(x) {}
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            async_to_generator(Default::default(), Mark::new()),
        )
    },
    issue_1694_1,
    "
    class MyClass {
        #get() {
            return 1
        }
        constructor() {
            this.#get(foo);
        }
    }
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Default::default(), unresolved_mark),
            async_to_generator(Default::default(), Mark::new()),
        )
    },
    issue_1694_2,
    "
class MyClass {
    static #get() {
        return 1
    }
    constructor() {
        MyClass.#get(foo);
    }
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            async_to_generator(Default::default(), Mark::new()),
        )
    },
    issue_1702_1,
    "
    class Foo {
      #y;
      static #z = 3;

      constructor() {
        this.x = 1;
        this.#y = 2;
        this.#sssss();
      }

      #sssss() {
        console.log(this.x, this.#y, Foo.#z);
      }
    }

    const instance = new Foo();
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1711_1,
    "
    class Foo {
      #value() {
        return 1;
      }
      // #value = 1;

      get(target) {
        return target.#value;
      }
    }
    "
);

test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1742_1,
    "
    class Foo {
      #tag() {
        return this;
      }

      #tag2 = this.#tag;

      constructor() {
        const receiver = this.#tag`tagged template`;
        expect(receiver).toBe(this);

        const receiver2 = this.#tag2`tagged template`;
        expect(receiver2).toBe(this);
      }
    }
    new Foo();
    "
);

test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Default::default(), unresolved_mark),
            template_literal(Default::default()),
        )
    },
    issue_1742_2,
    "
  class Foo {
    #tag() {
      return this;
    }

    #tag2 = this.#tag;

    constructor() {
      const receiver = this.#tag`tagged template`;
      expect(receiver).toBe(this);

      const receiver2 = this.#tag2`tagged template`;
      expect(receiver2).toBe(this);
    }
  }
  new Foo();
  "
);

test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    new_target_in_class_prop,
    "
class Foo {
    bar = new.target;
    ['baz'] = new.target;
}

const foo = new Foo();

expect(foo.bar).toBe(undefined);
expect(foo.baz).toBe(undefined);
"
);

test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    class_field_evalutaion_order,
    "
class Foo {
  a = this.#b;
  get #b() {
    return 1
  }
  static #c = this.#d();
  static #d() {}
}
expect(() => new Foo()).not.toThrow();
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1742_3,
    "
    class Foo {
      #tag() {
        return this;
      }

      #tag2 = this.#tag;

      constructor() {
        const receiver = this.#tag`tagged template`;
        expect(receiver).toBe(this);

        const receiver2 = this.#tag2`tagged template`;
        expect(receiver2).toBe(this);
      }
    }
    new Foo();
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1869_1,
    "
    class TestClass {
        static Something = 'hello';

        static SomeProperties = {
            firstProp: TestClass.Something,
        };
    }

    function someClassDecorator(c) {
        return c;
    }
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_1869_2,
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

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_2021_1,
    "
    class Item extends Component {
      constructor(props) {
        super(props);
      }

      input = this.props.item;
    }
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_3229_1,
    "
class A {
  #D;
  B() {
    1;
    C.#D++;
    E(function() {});
  }
}
  "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_3229_2,
    "
class A {
    #b;
    foo() {
        A.#b += 123
        class B {
            foo() {}
        }
    }
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_3368,
    "
class A {
  #a = 'fff'
  static #b = 123
  foo() {
    return class B {
      bar() {
        console.log(this.#a, this.#b, this.#bar)
      }
    }
  }
  #bar() {}
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    nested_class_in_arrow,
    "
const a = () => class {
  a = 123
  foo() {
    return class B {
      b = 456
    }
  }
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_2481,
    "
class Foo {
    static #prop1 = 42;
    static #prop2 = (() => {
        console.log(this.#prop1);
    })();
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_4473,
    "
var test1 = class X {
  [Symbol.toStringTag]() {}
}

function a() {
  const b = class Y {
    x() {
    }
  }
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    constant_super: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    constant_super_complex_super,
    "
class A extends class B {} {
  static x = super.x;
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    constant_super: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    constant_super_field,
    "
class A extends B {
  foo = super.bar;
  static foo = super.bar;
}
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    no_document_all: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    private_optional_chain_member_loose,
    r#"
class MyClass {
  #a
  foo(o) {
    o?.#a
  }
}
"#
);

test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    set_public_fields: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    set_public_fields_initialization_order,
    r#"
const actualOrder = [];

const track = i => {
  actualOrder.push(i);
  return i;
};

class MyClass {
  static [track(1)] = track(10);
  [track(2)] = track(13);
  get [track(3)]() {
    return "foo";
  }
  set [track(4)](value) {
    this.bar = value;
  }
  [track(5)] = track(14);
  static [track(6)] = track(11);
  static [track(7)] = track(12);
  [track(8)]() {}
  [track(9)] = track(15);
}

const inst = new MyClass();

const expectedOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
expect(actualOrder).toEqual(expectedOrder);

expect(MyClass[1]).toBe(10);
expect(inst[2]).toBe(13);
expect(inst[3]).toBe("foo");
inst[4] = "baz";
expect(inst.bar).toBe("baz");
expect(inst[5]).toBe(14);
expect(MyClass[6]).toBe(11);
expect(MyClass[7]).toBe(12);
expect(typeof inst[8]).toBe("function");
expect(inst[9]).toBe(15);
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    set_public_fields: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    set_public_fields_computed,
    r#"
const foo = "foo";
const bar = () => {};
const four = 4;

class MyClass {
  static [one()] = "test";
  static [2 * 4 + 7] = "247";
  static [2 * four + 7] = "247";
  static [2 * four + seven] = "247";
  [null] = "null";
  [undefined] = "undefined";
  [void 0] = "void 0";
  get ["whatever"]() {}
  set ["whatever"](value) {}
  get [computed()]() {}
  set [computed()](value) {}
  ["test" + one]() {}
  static [10]() {}
  [/regex/] = "regex";
  [foo] = "foo";
  [bar] = "bar";
  [baz] = "baz";
  [`template`] = "template";
  [`template${expression}`] = "template-with-expression";
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    set_public_fields: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    set_public_constructor_collision,
    r#"
var foo = "bar";

class Foo {
  bar = foo;
  static bar = baz;

  constructor() {
    var foo = "foo";
    var baz = "baz";
  }
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    set_public_fields: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    set_public_static_undefined,
    r#"
class Foo {
  static bar;
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    private_as_properties: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    private_as_properties_basic,
    r#"
class Cl {
  #privateField = "top secret string";

  constructor() {
    this.publicField = "not secret string";
  }

  get #privateFieldValue() {
    return this.#privateField;
  }

  set #privateFieldValue(newValue) {
    this.#privateField = newValue;
  }

  publicGetPrivateField() {
    return this.#privateFieldValue;
  }

  publicSetPrivateField(newValue) {
    this.#privateFieldValue = newValue;
  }
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    private_as_properties: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    private_as_properties_static,
    r#"
class Cl {
  static #foo() {};
  static #f = 123;
  static get #bar() {};
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    private_as_properties: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    private_as_properties_getter_only,
    r#"
class Cl {
  #privateField = 0;

  get #privateFieldValue() {
    return this.#privateField;
  }

  constructor() {
    this.#privateFieldValue = 1;
    ([this.#privateFieldValue] = [1]);
  }
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    private_as_properties: true,
                    set_public_fields: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    loose_update,
    r#"
class Cl {
  #privateField = "top secret string";

  constructor() {
    this.publicField = "not secret string";
  }

  get #privateFieldValue() {
    return this.#privateField;
  }

  set #privateFieldValue(newValue) {
    this.#privateField = newValue;
  }

  publicGetPrivateField() {
    return this.#privateFieldValue;
  }

  publicSetPrivateField(newValue) {
    this.#privateFieldValue = newValue;
  }

  get publicFieldValue() {
    return this.publicField;
  }

  set publicFieldValue(newValue) {
    this.publicField = newValue;
  }

  testUpdates() {
    this.#privateField = 0;
    this.publicField = 0;
    this.#privateFieldValue = this.#privateFieldValue++;
    this.publicFieldValue = this.publicFieldValue++;

    ++this.#privateFieldValue;
    ++this.publicFieldValue;

    this.#privateFieldValue += 1;
    this.publicFieldValue += 1;

    this.#privateFieldValue = -(this.#privateFieldValue ** this.#privateFieldValue);
    this.publicFieldValue = -(this.publicFieldValue ** this.publicFieldValue);
  }
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    set_only_getter,
    r#"
class Cl {
  #privateField = 0;
  counter = 0;

  get #privateFieldValue() {
    return this.#privateField;
  }

  get self() {
    this.counter++;
    return this;
  }

  constructor() {
    this.self.#privateFieldValue = 1;
    ([this.self.#privateFieldValue] = [1]);
  }
}

const cl = new Cl();
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    get_only_setter,
    r#"
class Cl {
  #privateField = 0;

  set #privateFieldValue(newValue) {
    this.#privateField = newValue;
  }

  constructor() {
    this.publicField = this.#privateFieldValue;
  }
}
"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                class_properties::Config {
                    private_as_properties: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
        )
    },
    loose_keyword_method,
    r##"
class TestCls{
    foo(){
        this.#bar()    
        this.#switch()    
    }
    #switch(){
        console.log("#switch called")
    }

    #bar(){
        console.log("#bar called")
    }
}
export {TestCls}

let a = new TestCls
a.foo()
"##
);

#[testing::fixture("tests/classes/**/exec.js")]
fn exec(input: PathBuf) {
    let src = read_to_string(input).unwrap();
    compare_stdout(
        Default::default(),
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                class_properties(Default::default(), unresolved_mark),
            )
        },
        &src,
    );
}

#[testing::fixture("tests/class-properties/**/input.js")]
fn fixture(input: PathBuf) {
    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                class_properties(Default::default(), unresolved_mark),
            )
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    issue_6305,
    "class x { static #x = super.x = 0 }"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Default::default(), unresolved_mark),
            optional_chaining(Default::default(), unresolved_mark),
        )
    },
    issue_8003,
    "
class Foo {
  #priv
  search() {
    this.#priv?.()
  }
}
    
console.log(new Foo().search())"
);
