class B {
    static y() { }
}

abstract class A extends B {
    abstract x(): void;
    public static override y() { }
}
