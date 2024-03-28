abstract class B {
    abstract accessor b: string;
}
class Test extends B {
    accessor a!: string;
    public override accessor b: string = "";
}
