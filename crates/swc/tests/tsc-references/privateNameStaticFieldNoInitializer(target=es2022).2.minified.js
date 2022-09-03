//// [privateNameStaticFieldNoInitializer.ts]
const C = class {
    static #x;
};
class C2 {
    static #x;
}
