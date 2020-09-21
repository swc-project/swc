// Repro from #13604

class A<T> {
    props: T & { foo: string };
}

class B extends A<{ x: number }> {
    f(p: this["props"]) {
        p.x;
    }
}

