async function asAssertion() {
    return await input as number ** 2;
}

async function satisfiesAssertion() {
    return await input satisfies number ** 2;
}

async function nestedAssertions() {
    return await input! as number satisfies number ** 2;
}
