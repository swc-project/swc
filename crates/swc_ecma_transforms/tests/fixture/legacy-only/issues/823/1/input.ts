import { Debounce } from 'lodash-decorators';
class Person {
    private static debounceTime: number = 500 as const;

    @Debounce(Person.debounceTime)
    save() {
        console.log('Hello World!');
    }
}

const p = new Person();
p.save();