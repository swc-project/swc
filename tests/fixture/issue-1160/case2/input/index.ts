import { MyEnum } from './enum';

class Xpto {
    @Decorator()
    value!: MyEnum;
}

function Decorator() {
    return function (...args) { };
}
