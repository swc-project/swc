function work() {
    console.log("run");
}

const tag = "metadata";
const candidate = {
    run: () => work(),
    objectMeta: { value: tag },
    arrayMeta: [tag],
    negatedMeta: !tag,
};

candidate.run();
console.log(candidate.objectMeta.value);
console.log(candidate.arrayMeta[0]);
console.log(candidate.negatedMeta);
