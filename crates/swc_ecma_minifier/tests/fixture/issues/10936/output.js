let variable = {};
console.log("OrderNumber=" + variable.data?.orderNumber + "|AuditNo=" + variable.data?.auditNo + "|JournalType=" + transactionTypeCode[variable.data.transactionType] + "|IsPreview=0");
// Additional test cases
export const test1 = "12";
export const test2 = "12";
export const test3 = "1" + variable?.notExist + "2";
export const test4 = "1" + variable.data?.value + "2";
export const test5 = "1" + obj?.a?.b?.c + "2";
// Function calls can return null/undefined
export const test6 = "1" + someFunction() + "2";
export const test7 = "1" + obj.method() + "2";
// Identifiers can be null/undefined  
export const test8 = "1" + unknownVar + "2";
// Other expressions that can be null/undefined
export const test9 = "1" + (condition ? null : 'x') + "2";
export const test10 = "1" + await promise + "2";
export const test11 = "1" + new Constructor() + "2";
