abstract class B {
    abstract accessor i: number;
}
class C1 extends B {
    accessor a: any;
    accessor b = 1;
    static accessor c: any;
    static accessor d = 2;
    public static accessor e = 4;
    protected static accessor f: number;
    private accessor g!: string;
    public accessor h = 1;
    public override accessor i = 10;
}
