// `flow-hermes/corpus/types/mapped_types/multiple_props.js` with the mapped
// members moved first.
type T = {
  [K in keyof O]: T,
  [K in keyof O]: T,
  foo: string,
  ...bar,
  [number]: boolean,
};
