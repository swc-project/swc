type Lazyify<T> = {
    [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};
