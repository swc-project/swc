let capturedPrivateAccess;
class A {
    static #x = 42;
    static [(class {}, (capturedPrivateAccess = () => A.#x))];
}
console.log(capturedPrivateAccess());
