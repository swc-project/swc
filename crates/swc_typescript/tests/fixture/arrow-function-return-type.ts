function A() {
  return () => {
    return C;
  }
}

const B = () => { return B };

const C = function () {}

const D = () => `${''}`;

const E = (): (() => void) | undefined => {
  return () => {};
}
