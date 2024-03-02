var option;
console.log([
    null,
    (option = {
        __labelPrefix: 'test',
        tags: []
    }).__labelPrefix
].concat(option.tags));
