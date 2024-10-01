//// [awaitUsingDeclarations.1.ts]
await using d1 = {
    async [Symbol.asyncDispose] () {}
}
await using d19 = {
    async [Symbol.asyncDispose] () {}
}
switch(Math.random()){
    case 0:
        await using d20 = {
            async [Symbol.asyncDispose] () {}
        }
        break;
    case 1:
        await using d21 = {
            async [Symbol.asyncDispose] () {}
        }
}
await using d22 = {
    async [Symbol.asyncDispose] () {}
}
try {
    await using d23 = {
        async [Symbol.asyncDispose] () {}
    }
} catch  {
    await using d24 = {
        async [Symbol.asyncDispose] () {}
    }
} finally{
    await using d25 = {
        async [Symbol.asyncDispose] () {}
    }
}
await using d26 = {
    async [Symbol.asyncDispose] () {}
}
for(;;){
    await using d28 = {
        async [Symbol.asyncDispose] () {}
    }
    break;
}
for(;;){
    await using d29 = {
        async [Symbol.asyncDispose] () {}
    }
    break;
}
for(;;){
    await using d30 = {
        async [Symbol.asyncDispose] () {}
    }
    break;
}
for(let x in {})await using d31 = {
    async [Symbol.asyncDispose] () {}
}
for (let x of [])await using d32 = {
    async [Symbol.asyncDispose] () {}
}
export { };
