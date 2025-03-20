let current_component;
try {
    !function(component) {
        const parent = current_component;
        current_component = component, parent.m();
    }({
        m () {
            console.log("call m()");
        }
    });
} catch (e) {
    console.log('PASS');
}
