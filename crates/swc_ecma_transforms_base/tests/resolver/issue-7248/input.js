const messages = [{ message: "hello" }];
const logs = messages.map(
    ({ log = () => console.log(message), message }) => log
);
logs[0]();

class A {
    constructor({ log = () => console.log(message), message }) {}
}
