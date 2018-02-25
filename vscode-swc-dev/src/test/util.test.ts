
// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

import { IDisposable, dispose } from '../util';

// Defines a Mocha test suite to group tests of similar kind together
suite("@dispose", () => {
    test("works", () => {

        class A implements IDisposable {
            disposed = false;
            dispose() { this.disposed = true }
        }

        class B implements IDisposable {
            @dispose
            readonly a: A;

            constructor(a: A) { this.a = a }

            disposed = false;
            dispose() { this.disposed = true }
        }

        const a = new A();
        const b = new B(a);

        assert.equal(a.disposed, false);
        assert.equal(b.disposed, false);

        b.dispose();

        assert.equal(b.disposed, true, 'original dispose() should be called');
        assert.equal(a.disposed, true, 'a.dispose() should be called');
    });
});