function _classStaticPrivateFieldDestructureSet(receiver, classConstructor, descriptor) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "set"), (function(receiver, descriptor) {
        if (descriptor.set) return "__destrObj" in descriptor || (descriptor.__destrObj = {
            set value (v){
                descriptor.set.call(receiver, v);
            }
        }), descriptor.__destrObj;
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        return descriptor;
    })(receiver, descriptor);
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class A {
    testObject() {
        return {
            x: 10,
            y: 6
        };
    }
    testArray() {
        return [
            10,
            11
        ];
    }
    static test(_a) {
        [_classStaticPrivateFieldDestructureSet(_a, _field).value] = [
            2
        ];
    }
    constructor(){
        this.otherClass = A;
        let y;
        ({ x: _classStaticPrivateFieldDestructureSet(A, _field).value , y  } = this.testObject()), [_classStaticPrivateFieldDestructureSet(A, _field).value, y] = this.testArray(), ({ a: _classStaticPrivateFieldDestructureSet(A, _field).value , b: [_classStaticPrivateFieldDestructureSet(A, _field).value]  } = {
            a: 1,
            b: [
                2
            ]
        }), [_classStaticPrivateFieldDestructureSet(A, _field).value, [_classStaticPrivateFieldDestructureSet(A, _field).value]] = [
            1,
            [
                2
            ]
        ], ({ a: _classStaticPrivateFieldDestructureSet(A, _field).value = 1 , b: [_classStaticPrivateFieldDestructureSet(A, _field).value = 1]  } = {
            b: []
        }), [_classStaticPrivateFieldDestructureSet(A, _field).value = 2] = [], [_classStaticPrivateFieldDestructureSet(this.otherClass, _field).value = 2] = [];
    }
}
var _field = {
    writable: !0,
    value: 1
};
