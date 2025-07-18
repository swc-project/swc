class A {
    b() {
        return 0;
    }

    c() {
        const d = () => {
            if (Math.random() < 0) {
                throw new Error("foo");
            }
            return this.b();
        };

        function e() {
            d();
        }
        return e();
    }
}

const a = new A();
a.c();
