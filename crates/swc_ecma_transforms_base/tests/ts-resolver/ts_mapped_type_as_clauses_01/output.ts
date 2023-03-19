type Lazyify__2<T__3> = {
    [K__3 in keyof T__3]: () => T__3[K__3];
};
