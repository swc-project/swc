class MyClass extends Base {
    prop1?: string;
    prop2!: string;
    #prop3?: string;
    #prop4?: string = "test";
    #privateOptionalNoType?;
    static readonly prop5!: string;
    readonly #prop6 = "asdf";
    public abstract override readonly prop7 = 5;
    override readonly #prop8 = 5;
    declare public static readonly prop9: string;
    accessor prop10!: string = "";
    public accessor prop11 = "";
    public static accessor prop12 = "";
    public prop13: string;
    private static prop14: string;
    protected override accessor prop15 = 5;
    [value]?: string[];
}
