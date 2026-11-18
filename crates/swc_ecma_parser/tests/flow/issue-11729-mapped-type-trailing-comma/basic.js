type MappedOptional<T: {...}> = {
  [K in keyof T]?: T[K],
};

type MappedRequired<T: {...}> = {
  [K in keyof T]: T[K],
};
