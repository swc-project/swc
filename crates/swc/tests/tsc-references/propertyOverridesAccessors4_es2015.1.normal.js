class Lion extends Animal {
    constructor(...args){
        super(...args);
        this.sound = 'RAWR!' // error here
        ;
    }
}
