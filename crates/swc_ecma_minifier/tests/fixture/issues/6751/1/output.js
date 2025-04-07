let current_component;
try {
    const parent = current_component;
    current_component = {
        m () {
            console.log("call m()");
        }
    }, parent.m();
} catch (e) {
    console.log('PASS');
}
