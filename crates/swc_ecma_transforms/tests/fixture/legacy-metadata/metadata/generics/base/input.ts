@Decorate
class MyClass {
    constructor(private generic: Generic<A>, generic2: Generic<A, B>) {}

    @Run
    method(generic: Inter<A>, @Arg() generic2: InterGen<A, B>) {}
}
