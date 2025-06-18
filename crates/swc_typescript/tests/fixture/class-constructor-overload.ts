// @isolatedDeclarations: true
export class C1 {
    constructor(private prop: string) {}
}

export class C2 {
    constructor(prop: string);
    constructor(private prop: any) {}
}

export class C3 {
    constructor(prop: string);
    constructor(readonly prop: any) {}
}

export class C4 {
    constructor(prop: string);
    constructor(public readonly prop: any) {}
}

export class C5 {
    constructor(prop: string);
    constructor(private readonly prop: any) {}
}
