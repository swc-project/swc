export class A {
}
export { };
export * from './b';
import { A } from './c';
new A();
