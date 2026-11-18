let outer = 0;

function normal(param = outer) {
    var outer = 1;
    let bodyOnly = param;
    {
        let bodyOnly = outer;
        use(bodyOnly);
    }
    use(outer, bodyOnly);
}

const arrow = (param = outer) => {
    var outer = 2;
    let bodyOnly = param;
    {
        let bodyOnly = outer;
        use(bodyOnly);
    }
    return [outer, bodyOnly];
};

class Example {
    constructor(param = outer) {
        var outer = 3;
        let bodyOnly = param;
        {
            let bodyOnly = outer;
            use(bodyOnly);
        }
        use(outer, bodyOnly);
    }
}
