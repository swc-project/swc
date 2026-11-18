// test case from node-swc/tests/issue-2546/input.ts

import { injectable } from 'inversify';

@injectable()
export default abstract class MyClass {}


// required to got error from test
console.log(a);
const a = 1;
