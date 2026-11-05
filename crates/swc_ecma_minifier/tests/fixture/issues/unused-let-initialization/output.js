function test(read, props) {
    let localCountry, { value } = (localCountry = read(), props);
    return [
        localCountry,
        value
    ];
}
console.log(JSON.stringify(test(()=>"CN", {
    value: 1
})));
console.log(JSON.stringify(test(()=>void 0, {
    value: 2
})));
