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
        [_classStaticPrivateFieldSpecGet(_a, A, _field)] = [
            2
        ];
    }
    constructor(){
        this.otherClass = A;
        let y;
        ({ x: _classStaticPrivateFieldSpecGet(A, A, _field) , y  } = this.testObject()), [_classStaticPrivateFieldSpecGet(A, A, _field), y] = this.testArray(), ({ a: _classStaticPrivateFieldSpecGet(A, A, _field) , b: [_classStaticPrivateFieldSpecGet(A, A, _field)]  } = {
            a: 1,
            b: [
                2
            ]
        }), [_classStaticPrivateFieldSpecGet(A, A, _field), [_classStaticPrivateFieldSpecGet(A, A, _field)]] = [
            1,
            [
                2
            ]
        ], ({ a: _classStaticPrivateFieldSpecGet(A, A, _field) = 1 , b: [_classStaticPrivateFieldSpecGet(A, A, _field) = 1]  } = {
            b: []
        }), [_classStaticPrivateFieldSpecGet(A, A, _field) = 2] = [], [_classStaticPrivateFieldSpecGet(this.otherClass, A, _field) = 2] = [];
    }
}
var _field = {
    writable: !0,
    value: 1
};
