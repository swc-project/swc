class ProtectedGeneric<T> {
    private privateMethod() {
    }

    protected protectedMethod() {
    }
}

class ProtectedGeneric2<T> {
    private privateMethod() {
    }

    protected protectedMethod() {
    }
}

function f7(x: ProtectedGeneric<{}> & ProtectedGeneric<{}>) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}

function f8(x: ProtectedGeneric<{ a: void; }> & ProtectedGeneric2<{ a: void; b: void; }>) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}

function f9(x: ProtectedGeneric<{ a: void; }> & ProtectedGeneric<{ a: void; b: void; }>) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}