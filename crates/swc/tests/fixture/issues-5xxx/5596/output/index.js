var _privateMethod = new WeakSet();
class Base {
    superMethod() {
        return 'good';
    }
}
class Sub extends Base {
    superMethod() {
        return 'bad';
    }
    publicMethod() {
        return privateMethod.call(this);
    }
    constructor(...args){
        super(...args);
        _privateMethod.add(this);
    }
}
function privateMethod() {
    return super.superMethod();
}
new Sub().publicMethod().toEqual('good');
