import { Debounce } from 'lodash-decorators';
class Person {
    private static debounceTime: number = 500 as const;
    save() {
        console.log('Hello World!');
    }
}
__decorate([
    Debounce(Person.debounceTime)
], Person.prototype, "save", null);
const p = new Person();
p.save();
