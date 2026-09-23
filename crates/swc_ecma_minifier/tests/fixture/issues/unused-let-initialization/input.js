function test(read, props) {
    let localCountry,
        unused = (localCountry = read()),
        { value } = props;
    return [localCountry, value];
}

console.log(JSON.stringify(test(() => "CN", { value: 1 })));
console.log(JSON.stringify(test(() => undefined, { value: 2 })));
