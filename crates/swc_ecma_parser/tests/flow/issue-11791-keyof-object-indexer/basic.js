type Commands<T> = {
  [keyof T]: (...ReadonlyArray<unknown>) => void,
};

type UnknownByString = {
  [string]: unknown,
};

type NamedIndexer<K, V> = {
  [key: K]: V,
};
