#![allow(deprecated)]

mod common;

use std::{fs::read_to_string, path::PathBuf};

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
#[cfg(feature = "es3")]
use swc_ecma_transforms_compat::es3::reserved_words;
use swc_ecma_transforms_compat::{
    es2015::{arrow, block_scoping, classes, function_name, template_literal},
    es2016::exponentiation,
    es2017::async_to_generator,
    es2022::class_properties,
};
use swc_ecma_transforms_testing::{compare_stdout, test_exec, Tester};

fn syntax() -> Syntax {
    Syntax::Es(Default::default())
}

#[cfg(feature = "es3")]
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

#[cfg(not(feature = "es3"))]
fn tr(_: &Tester) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        function_name(),
        class_properties(Default::default(), unresolved_mark),
        classes(Default::default()),
        block_scoping(unresolved_mark),
    )
}

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

// public_regression_t7364

// private_regression_t6719

// private_reevaluated

// private_static

// private_destructuring_object_pattern_1

// private_static_inherited

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

// private_destructuring_array_pattern

// private_regression_t2983

// private_regression_t7364

// private_destructuring_array_pattern_1

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

// static_property_tdz_edgest_case

// regression_6153

// regression_7371

// private_canonical

// regression_8882

// private_destructuring_array_pattern_3

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

// private_non_block_arrow_func

// regression_8110

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

// static_property_tdz_general

// public_native_classes

// public_arrow_static_this_without_transform

// private_static_infer_name

// regression_7951

// private_native_classes

// public_computed_without_block

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

// Test for issue 11422: nested arrow functions should preserve `this` context

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "function-name-class-properties-classes-block-scoping-optional-es3")]
    FunctionNameClassPropertiesClassesBlockScopingOptionalEs3,
    #[serde(rename = "resolver-function-name-class-properties")]
    ResolverFunctionNameClassProperties,
    #[serde(rename = "resolver-class-properties-async-to-generator-typescript-resolver")]
    ResolverClassPropertiesAsyncToGeneratorTypescriptResolver,
    #[serde(rename = "resolver-class-properties-block-scoping-typescript-resolver")]
    ResolverClassPropertiesBlockScopingTypescriptResolver,
    #[serde(rename = "resolver-class-properties-classes-block-scoping-typescript-resolver")]
    ResolverClassPropertiesClassesBlockScopingTypescriptResolver,
    #[serde(
        rename = "resolver-class-properties-async-to-generator-block-scoping-typescript-resolver"
    )]
    ResolverClassPropertiesAsyncToGeneratorBlockScopingTypescriptResolver,
    #[serde(rename = "resolver-class-properties-classes-typescript-resolver")]
    ResolverClassPropertiesClassesTypescriptResolver,
    #[serde(rename = "resolver-class-properties-arrow-typescript-resolver-new-arrow-mark")]
    ResolverClassPropertiesArrowTypescriptResolverNewArrowMark,
    #[serde(rename = "resolver-class-properties-arrow-typescript-resolver-shared-arrow-mark")]
    ResolverClassPropertiesArrowTypescriptResolverSharedArrowMark,
    #[serde(rename = "resolver-class-properties-typescript-resolver")]
    ResolverClassPropertiesTypescriptResolver,
    #[serde(
        rename = "resolver-class-properties-exponentiation-classes-block-scoping-typescript-resolver"
    )]
    ResolverClassPropertiesExponentiationClassesBlockScopingTypescriptResolver,
    #[serde(rename = "resolver-class-properties-set-public-fields")]
    ResolverClassPropertiesSetPublicFields,
    #[serde(rename = "resolver-class-properties-set-public-fields-private-as-properties")]
    ResolverClassPropertiesSetPublicFieldsPrivateAsProperties,
    #[serde(rename = "resolver-class-properties-arrow-classes-block-scoping-shared-arrow-mark")]
    ResolverClassPropertiesArrowClassesBlockScopingSharedArrowMark,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture(
    "tests/class-properties/function-name-class-properties-classes-block-scoping-optional-es3/**/\
     input.js"
)]
#[testing::fixture(
    "tests/class-properties/\
     resolver-class-properties-arrow-classes-block-scoping-shared-arrow-mark/**/input.js"
)]
#[testing::fixture(
    "tests/class-properties/resolver-class-properties-arrow-typescript-resolver-new-arrow-mark/**/\
     input.js"
)]
#[testing::fixture(
    "tests/class-properties/resolver-class-properties-arrow-typescript-resolver-shared-arrow-mark/\
     **/input.js"
)]
#[testing::fixture(
    "tests/class-properties/\
     resolver-class-properties-async-to-generator-block-scoping-typescript-resolver/**/input.js"
)]
#[testing::fixture(
    "tests/class-properties/resolver-class-properties-async-to-generator-typescript-resolver/**/\
     input.js"
)]
#[testing::fixture(
    "tests/class-properties/resolver-class-properties-block-scoping-typescript-resolver/**/input.\
     js"
)]
#[testing::fixture(
    "tests/class-properties/resolver-class-properties-classes-block-scoping-typescript-resolver/**\
     /input.js"
)]
#[testing::fixture(
    "tests/class-properties/resolver-class-properties-classes-typescript-resolver/**/input.js"
)]
#[testing::fixture(
    "tests/class-properties/\
     resolver-class-properties-exponentiation-classes-block-scoping-typescript-resolver/**/input.\
     js"
)]
#[testing::fixture(
    "tests/class-properties/resolver-class-properties-set-public-fields/**/input.js"
)]
#[testing::fixture(
    "tests/class-properties/resolver-class-properties-set-public-fields-private-as-properties/**/\
     input.js"
)]
#[testing::fixture(
    "tests/class-properties/resolver-class-properties-typescript-resolver/**/input.js"
)]
#[testing::fixture("tests/class-properties/resolver-function-name-class-properties/**/input.js")]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
            CasePipeline::FunctionNameClassPropertiesClassesBlockScopingOptionalEs3 => Box::new(tr (t)),
            CasePipeline::ResolverFunctionNameClassProperties => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , false) , function_name () , class_properties (Default :: default () , unresolved_mark) ,) }),
            CasePipeline::ResolverClassPropertiesAsyncToGeneratorTypescriptResolver => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , true) , class_properties (Default :: default () , unresolved_mark) , async_to_generator (Default :: default () , Mark :: new ()) ,) }),
            CasePipeline::ResolverClassPropertiesBlockScopingTypescriptResolver => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , true) , class_properties (Default :: default () , unresolved_mark) , block_scoping (Mark :: new ()) ,) }),
            CasePipeline::ResolverClassPropertiesClassesBlockScopingTypescriptResolver => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , true) , class_properties (Default :: default () , unresolved_mark) , classes (Default :: default ()) , block_scoping (Mark :: new ()) ,) }),
            CasePipeline::ResolverClassPropertiesAsyncToGeneratorBlockScopingTypescriptResolver => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , true) , class_properties (Default :: default () , unresolved_mark) , async_to_generator (Default :: default () , unresolved_mark) , block_scoping (unresolved_mark) ,) }),
            CasePipeline::ResolverClassPropertiesClassesTypescriptResolver => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , true) , class_properties (Default :: default () , unresolved_mark) , classes (Default :: default ()) ,) }),
            CasePipeline::ResolverClassPropertiesArrowTypescriptResolverNewArrowMark => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , true) , class_properties (Default :: default () , unresolved_mark) , arrow (Mark :: new ()) ,) }),
            CasePipeline::ResolverClassPropertiesArrowTypescriptResolverSharedArrowMark => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , true) , class_properties (Default :: default () , unresolved_mark) , arrow (unresolved_mark) ,) }),
            CasePipeline::ResolverClassPropertiesTypescriptResolver => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , true) , class_properties (Default :: default () , unresolved_mark) ,) }),
            CasePipeline::ResolverClassPropertiesExponentiationClassesBlockScopingTypescriptResolver => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , true) , class_properties (Default :: default () , unresolved_mark) , exponentiation () , classes (Default :: default ()) , block_scoping (Mark :: new ()) ,) }),
            CasePipeline::ResolverClassPropertiesSetPublicFields => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , false) , class_properties (class_properties :: Config { set_public_fields : true , .. Default :: default () } , unresolved_mark ,) ,) }),
            CasePipeline::ResolverClassPropertiesSetPublicFieldsPrivateAsProperties => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , false) , class_properties (class_properties :: Config { private_as_properties : true , set_public_fields : true , .. Default :: default () } , unresolved_mark ,) ,) }),
            CasePipeline::ResolverClassPropertiesArrowClassesBlockScopingSharedArrowMark => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , false) , class_properties (Default :: default () , unresolved_mark) , arrow (unresolved_mark) , classes (Default :: default ()) , block_scoping (unresolved_mark) ,) }),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
