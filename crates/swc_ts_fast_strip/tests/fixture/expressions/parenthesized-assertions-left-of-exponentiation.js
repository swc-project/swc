const outer = (-input          ) ** 2;
const inner = (-input)           ** 2;
const nonNull = (-input          )  ** 2;
const chained = (-input)                            ** 2;
const prefixUpdate = ++input           ** 2;
const postfixUpdate = input++                  ** 2;
const rightOperand = 2 ** -input          ;

async function parenthesizedAwait() {
    return (await input)           ** 2;
}

async function parenthesizedAssertion() {
    return (await input          ) ** 2;
}
