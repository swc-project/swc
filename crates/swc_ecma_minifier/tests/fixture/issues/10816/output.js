new class {
    fromArrow() {
        console.log('hello');
    }
    foobar() {
        const callMe = ()=>this.fromArrow();
        return function() {
            callMe();
        };
    }
}().foobar()();
