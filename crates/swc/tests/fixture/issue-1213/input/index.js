import foo from 'foo';

class OK {
    constructor() {
        console.log(foo);
    }
}

export default class NotOK {
    constructor() {
        console.log(foo);
    }
}