@dec
class C {
    constructor(@dec public param: string) {
    }

    @dec
    @dec2
    method() {}

    @dec
    prop;

    @dec
    get prop2() { return 5; }

    @dec
    static method() {}
}
