const contexts = new Map();

const example = (_, context) => {
  contexts.set(String(context.name), context);
};

class Foo {
  @example
  someMethod() {}

  @example
  get someGetter() {
    return true;
  }

  @example
  set someSetter(_) {}

  @example
  accessor foobar = "bazbuzz";

  @example
  fieldOfBrokenDreams = "change me";
}

const foo = new Foo();

const methodCtx = contexts.get("someMethod");
expect("has" in methodCtx.access).toBe(true);
expect("get" in methodCtx.access).toBe(true);
expect("set" in methodCtx.access).toBe(false);
expect(methodCtx.access.has(foo)).toBe(true);
expect(methodCtx.access.has({})).toBe(false);

const getterCtx = contexts.get("someGetter");
expect("has" in getterCtx.access).toBe(true);
expect("get" in getterCtx.access).toBe(true);
expect("set" in getterCtx.access).toBe(false);
expect(getterCtx.access.has(foo)).toBe(true);
expect(getterCtx.access.has({})).toBe(false);

const setterCtx = contexts.get("someSetter");
expect("has" in setterCtx.access).toBe(true);
expect("get" in setterCtx.access).toBe(false);
expect("set" in setterCtx.access).toBe(true);
expect(setterCtx.access.has(foo)).toBe(true);
expect(setterCtx.access.has({})).toBe(false);

const accessorCtx = contexts.get("foobar");
expect("has" in accessorCtx.access).toBe(true);
expect("get" in accessorCtx.access).toBe(true);
expect("set" in accessorCtx.access).toBe(true);
expect(accessorCtx.access.has(foo)).toBe(true);
expect(accessorCtx.access.has({})).toBe(false);

const fieldCtx = contexts.get("fieldOfBrokenDreams");
expect("has" in fieldCtx.access).toBe(true);
expect("get" in fieldCtx.access).toBe(true);
expect("set" in fieldCtx.access).toBe(true);
expect(fieldCtx.access.has(foo)).toBe(true);
expect(fieldCtx.access.has({})).toBe(false);
