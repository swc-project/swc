function effect(getDep) {
    return function (_, context) {};
}

class A {
    @effect(() => [1, 2])
    #effect = () => {
        console.log(123);
    };
}
