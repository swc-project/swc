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
export  const test1 = [1, null, 2].join('');
export const test2 = [1, undefined, 2].join('');
export const test3 = [1, variable?.notExist, 2].join('');
export const test4 = [1, variable.data?.value, 2].join('');
export const test5 = [1, obj?.a?.b?.c, 2].join('');

// Function calls can return null/undefined
export const test6 = [1, someFunction(), 2].join('');
export const test7 = [1, obj.method(), 2].join('');

// Identifiers can be null/undefined  
export const test8 = [1, unknownVar, 2].join('');

// Other expressions that can be null/undefined
export const test9 = [1, condition ? null : 'x', 2].join('');
export const test10 = [1, await promise, 2].join('');
export const test11 = [1, new Constructor(), 2].join('');