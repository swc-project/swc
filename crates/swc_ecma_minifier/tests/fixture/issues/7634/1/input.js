import Foo from './foo.js';

export const Bar = Foo;

function someRecursiveFunction(value) {
    return value.map(someRecursiveFunction);
}

export default someRecursiveFunction;