let current_component;
try {
    let parent = current_component;
    current_component = {
        m () {
            console.log("call m()");
        }
    }, parent.m();
} catch (e) {
    console.log('PASS');
}
