using data = create();
console.log(data);

function test() {
    function test2() {
        return data;
    }
    using data = create();
    console.log(data);
}

async function test3() {
    await using data = create();
    console.log(data);
}
