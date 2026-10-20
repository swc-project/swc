abstract class AbstractASI {
    f = 1/*missing ; */
    abstract method(): void
//  ;^^^^^^^^^^^^^^^^^^^^^^
    ["computed-method"]() {}
}

class Declare {
    f = 1
    declare g: number
    *gen() {}
}

class Overload {
    f = 1
    m(): void
    m(a?: number): void
    in() {}
}

class Signature {
    f = 1
    declare g: number
    [key: string]: unknown
    ["computed"]() {}
}

class Ctor {
    f = 1
    constructor()
    constructor(a?: number) {}
    instanceof() {}
}
