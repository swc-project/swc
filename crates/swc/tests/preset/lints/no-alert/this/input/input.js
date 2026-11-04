this.alert();

class X {
    constructor(x) {
        this.alert(x);
    }

    alert() {}

    m() {
        const x = () => {
            // shouldn't fail
            this.alert();
        }
    }

    m1() {
        class Y {}

        this.alert();
    }
}

var o = {
    a() {
        this.alert();
    },
    b: function() {
        this.alert()
    },
    c: () => {
        // should fail
        this.alert();
    },
    e: {
        a() {
            this.alert();
        }
    },
    f() {
        this.alert();
    }
}

function f1() {
    const x = () => {
        // should fail
        this.alert();
    }
}
