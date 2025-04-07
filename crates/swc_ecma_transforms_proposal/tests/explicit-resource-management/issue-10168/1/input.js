using _ = { [Symbol.dispose]: () => {} };
function a() {}
export function b() {
  a();
}
b();