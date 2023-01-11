let current_component;

function set_current_component(component) {
    current_component = component;
}

function f(component) {
    const parent = current_component
    set_current_component(component)
    parent.m()
}

const obj = {
    m() {
        console.log("call m()")
    }
}

try {
    f(obj)
} catch (e) {
    console.log('PASS')
}