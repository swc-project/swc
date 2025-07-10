class A {
    fromArrow() {
        console.log('hello')
    }
    foobar() {
        const callMe = () => this.fromArrow()
        function B() {
            callMe();
        }
        return B;
    }
}
const instance = new A();
const fn = instance.foobar();
fn();
