function returns(a, b, c, d, e, f) {
    return <div value={(a, b)}>{(c, d)}{...(e, f)}</div>;
}

function expressionStatement(a, b, c, d, e, f) {
    <div value={(a, b)}>{(c, d)}{...(e, f)}</div>;
}

function ifBody(a, b, c, d, e, f) {
    if (a) <div value={(a, b)}>{(c, d)}{...(e, f)}</div>;
}

const arrow = (a, b, c, d, e, f) => <div value={(a, b)}>{(c, d)}{...(e, f)}</div>;
const variable = <div value={(a, b)}>{(c, d)}{...(e, f)}</div>;
consume(<div value={(a, b)}>{(c, d)}{...(e, f)}</div>);
