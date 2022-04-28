
class Foo {
    method1() {
        console.log('Foo.method1');
    }
    method2() {
        console.log('Foo.method2');
    }
}

class Bar extends Foo {
    method2() {
        console.log('Bar.method2: 1');
        super.method2();
        console.log('Bar.method2: 2');
    }
}

const bar = new Bar();

bar.method2()