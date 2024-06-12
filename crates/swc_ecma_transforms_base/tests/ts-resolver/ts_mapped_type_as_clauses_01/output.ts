type Lazyify__2<T__3> = {
    [K__3 in keyof T__3 as `get${Capitalize<K__3 & string>}`]: () => T__3[K__3];
};
