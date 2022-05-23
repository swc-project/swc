global.id = (v) => v;
global.leak = (cb) => cb;
global.sideefffect = (() => {
    let i = 0;
    return () => {
        console.log(`Side effect: ${i++}`);
    };
})();
global.pass = () => console.log("PASS");
