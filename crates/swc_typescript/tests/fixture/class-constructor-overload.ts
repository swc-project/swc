// @isolatedDeclarations: true
export class Foo {
    constructor(private prop: string) {}
}

export class Bar {
    constructor(prop: string);
    constructor(private prop: any) {}
}
