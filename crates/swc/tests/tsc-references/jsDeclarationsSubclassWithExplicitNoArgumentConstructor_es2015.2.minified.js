export class Super {
    constructor(firstArg, secondArg){}
}
export class Sub extends Super {
    constructor(){
        super('first', 'second');
    }
}
