function foo() {
    return Math.random() > 0.5 ? 'a' : 'b'
}

import(`./lib/${foo()}`);