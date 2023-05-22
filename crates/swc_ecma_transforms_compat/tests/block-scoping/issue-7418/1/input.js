const truc = { as: "OK" }

function x(as) {
    return function g() {
        const { as } = truc
        console.log(as)
    }
    as
}

x()();