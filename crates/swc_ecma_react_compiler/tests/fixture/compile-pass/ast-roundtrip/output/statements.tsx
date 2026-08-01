const { c: _c } = require("react/compiler-runtime");
declare const main: () => void;
function statementShapes(input: object) {
    let total = 0;
    debugger;
    outer: for(let index = 0; index < input.count; index++){
        if (index % 2 === 0) {
            continue outer;
        }
        total += index;
        break;
    }
    for(const key in input.map){
        total += input.map[key];
    }
    for (const value of input.values){
        total += value;
    }
    while(total < 10){
        total++;
    }
    do {
        total--;
    }while (total > 5)
    switch(input.kind){
        case "alpha":
            total += 1;
            break;
        case "beta":
            {
                total += 2;
                break;
            }
        default:
            total = 0;
    }
    try {
        if (input.fail) {
            throw new Error("failed");
        }
    } catch (error) {
        total += error instanceof Error ? 1 : 0;
    } finally{
        total ||= 1;
    }
    return total;
}
function App() {
    const $ = _c(1);
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <div data-kind="statements"/>;
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
