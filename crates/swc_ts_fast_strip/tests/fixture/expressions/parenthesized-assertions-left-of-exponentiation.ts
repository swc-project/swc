const outer = (-input as number) ** 2;
const inner = (-input) as number ** 2;
const nonNull = (-input as number)! ** 2;
const chained = (-input) as number satisfies number ** 2;
const prefixUpdate = ++input as number ** 2;
const postfixUpdate = input++ satisfies number ** 2;
const rightOperand = 2 ** -input as number;

async function parenthesizedAwait() {
    return (await input) as number ** 2;
}

async function parenthesizedAssertion() {
    return (await input as number) ** 2;
}
