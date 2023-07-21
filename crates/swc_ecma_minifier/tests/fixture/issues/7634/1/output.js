import o from './foo.js';
export const Bar = o;
function someRecursiveFunction(e) {
    return e.map(someRecursiveFunction);
}
export default someRecursiveFunction;
