import { B } from './b';

export class C {
    a() {
        throw new Error('Unimplemented')
    }
    b() {
        return new B();
    }
}