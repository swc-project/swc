import { A } from './a';
import { C } from './c';

export class B extends C {
    a() {
        return new A();
    }
}