abstract class AbstractASI {
    f = 1/*missing ; */
    abstract method(): void
    ["computed-method"]() {}
}

abstract class AbstractASI2 {
    f = 1
    abstract method(): void;
    ["computed-method"]() {}
}

class OverloadASI {
    f = 1
    m(): void
    m() {}
    g = 2
    m2(): void
    *gen() {}
}

abstract class PropASI {
    f = 1
    declare p: string
    [Symbol.iterator]() {}
    g = 2
    abstract q: string
    in() {}
}

class NoExtraSemi {
    f = 1;
    m(): void
    ["a"]() {}
}
