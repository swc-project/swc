// A default parameter captures the receiver where the arrow is created.
function make() {
    const f = async (value = this) => value;
    return function () {
        return f();
    };
}
const receiver = { value: 1 };
make.call(receiver)().then(
    value => console.log(value === receiver),
    error => console.log(error.name),
);
