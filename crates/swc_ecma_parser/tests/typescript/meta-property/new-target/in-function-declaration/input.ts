function f1() {
    new.target;
}

function f2() {
    const a = () => {
        new.target;
    };
}
