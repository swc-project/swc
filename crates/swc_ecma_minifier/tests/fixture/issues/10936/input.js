const variable = {};

const params = [
    'OrderNumber=',
    variable.data?.orderNumber,
    '|AuditNo=',
    variable.data?.auditNo,
    '|JournalType=',
    transactionTypeCode[variable.data.transactionType],
    '|IsPreview=0',
].join('');

console.log(params);

// Additional test cases
const test1 = [1, null, 2].join('');
const test2 = [1, undefined, 2].join('');
const test3 = [1, variable?.notExist, 2].join('');
const test4 = [1, variable.data?.value, 2].join('');
const test5 = [1, obj?.a?.b?.c, 2].join('');

// Function calls can return null/undefined
const test6 = [1, someFunction(), 2].join('');
const test7 = [1, obj.method(), 2].join('');

// Identifiers can be null/undefined  
const test8 = [1, unknownVar, 2].join('');

// Other expressions that can be null/undefined
const test9 = [1, condition ? null : 'x', 2].join('');
const test10 = [1, await promise, 2].join('');
const test11 = [1, new Constructor(), 2].join('');