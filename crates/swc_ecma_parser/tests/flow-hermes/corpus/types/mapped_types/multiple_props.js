type T = {
  foo: string,
  [K in keyof O]: T,
  ...bar,
  [number]: boolean,
  [K in keyof O]: T,
};
