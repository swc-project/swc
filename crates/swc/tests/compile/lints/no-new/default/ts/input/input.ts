new A()

@Decorator(() => {
    new A()
})
class C {
    public prop = new A();
    public prop2 = () => {
        new A();
    }
}
