enum NegativeStatus {
    open = -1,
    close = 3,
}

enum Status {
    open = 1,
    close = 2,
}

function prop() { }

class A {
    @prop()
    negativeStatus: NegativeStatus;

    @prop()
    status: Status;
}