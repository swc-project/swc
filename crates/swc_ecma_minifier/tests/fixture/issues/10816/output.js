new class {
    fromArrow() {
        console.log('hello');
    }
    foobar() {
        let callMe = ()=>this.fromArrow();
        return function() {
            callMe();
        };
    }
}().foobar()();
