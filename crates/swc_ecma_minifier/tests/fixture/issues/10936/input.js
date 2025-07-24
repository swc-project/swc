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