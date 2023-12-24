class MyClass extends Base {
    prop1?: string;
    prop2!: string;
    #prop3?: string;
    #prop4?: string = "test";
    static readonly prop5!: string;
    readonly #prop6 = "asdf";
    accessor prop9!: string = "";
    public accessor prop10 = "";
    public static accessor prop11 = "";
    public prop12: string;
    private static prop13: string;
    protected override accessor prop14 = 5;
    public override readonly prop7 = 5;
    override readonly #prop8 = 5;
}
