// @isolatedDeclarations: true
export class Foo {
    constructor(private prop: string) {}
}

export class Bar {
    constructor(prop: string);
    constructor(private prop: any) {}
}

export class Baz {
    constructor(prop: string);
    constructor(readonly prop: any) {}
}
