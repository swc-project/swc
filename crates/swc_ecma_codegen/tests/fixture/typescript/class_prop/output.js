class MyClass extends Base {
    prop1?: string;
    prop2!: string;
    #prop3?: string;
    #prop4?: string = "test";
    static readonly prop5!: string;
    readonly #prop6 = "asdf";
    public override readonly prop7 = 5;
    override readonly #prop8 = 5;
}
