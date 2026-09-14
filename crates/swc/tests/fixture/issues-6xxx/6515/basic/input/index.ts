function CommonProp() {
    return (Base: any) => class extends Base {
        prop = 100;
    };
}

@CommonProp()
class ClassX {
    static checkX() {
        return new ClassX().prop;
    }
}

console.log(ClassX.checkX());
