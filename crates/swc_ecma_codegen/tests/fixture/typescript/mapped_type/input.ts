type NoTypeAnn = {
    [value: string];
};
type MappedTypeWithNamedType = {
    [K in T as U]: undefined;
};
type Partial<T> = {
    [P in keyof T]?: T[P];
};
type OptionalPlus<T> = {
    [P in keyof T]+?: T[P];
};
type OptionalMinus<T> = {
    [P in keyof T]-?: T[P];
};
type Flags<T> = {
    [P in keyof T]: boolean;
};
type ReadOnly<T> = {
    readonly [P in keyof T]: T[P];
};
type ReadOnlyPlus<T> = {
    +readonly [P in keyof T]: T[P];
};
type ReadOnlyMinus<T> = {
    -readonly [P in keyof T]: T[P];
};
