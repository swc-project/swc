// before
import { bind } from 'some';
let A = _decorate([], function(_initialize) {
    class A {
        constructor(){
            _initialize(this);
        }
    }
    return {
        F: A,
        d: [
            {
                kind: "get",
                decorators: [
                    bind
                ],
                key: "foo",
                value: function foo() {
                    return 1;
                }
            },
            {
                kind: "method",
                decorators: [
                    bind
                ],
                key: "bar",
                value: function bar() {
                    return 1;
                }
            }
        ]
    };
});
