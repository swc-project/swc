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
    }
}

function f1() {
    const x = () => {
        // should fail
        this.alert();
    }
}
