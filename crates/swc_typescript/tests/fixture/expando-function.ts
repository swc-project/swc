export function foo(): void {}
foo.apply = () => {}

export const bar = (): void => {}
bar.call = () => {}


export namespace NS {
  export const goo = (): void => {}
  goo.length = 10
}

export namespace foo {
  // declaration must be exported
  let bar = 42;
  export let baz = 100;
}

foo.bar = 42;
foo.baz = 100;

// unexported
const zoo = (): void => {}
zoo.toString = () => {}

function qux(): void {}

namespace qux {
  export let woo = 42;
}

qux.woo = 42;

export default qux;
