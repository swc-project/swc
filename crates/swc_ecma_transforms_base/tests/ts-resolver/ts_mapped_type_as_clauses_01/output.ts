type Lazyify__1<T__2> = {
    [K__2 in keyof T__2]: () => T__2[K__2];
};
