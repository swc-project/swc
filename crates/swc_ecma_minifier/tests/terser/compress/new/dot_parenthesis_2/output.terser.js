console.log(
    typeof new function () {
        Math.random();
    }.constructor()
);
