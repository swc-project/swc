(function () {
    for (let eval = globalThis.eval, keep = () => eval;;) {
        let local = 7;
        console.log(eval("local"), keep() === globalThis.eval);
        break;
    }
})();
