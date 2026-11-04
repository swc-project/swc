var foo = {
    async bar({ name }) {
        console.log("arguments.length", arguments.length);
    },
};

class Foo {
    async bar({ name }) {
        console.log("arguments.length", arguments.length);
    }
}

async function bar({ name }) {
    console.log("arguments.length", arguments.length);
}
