//// [typeGuardsInRightOperandOfOrOrOperator.ts]
// In the right operand of a || operation, 
// the type of a variable or parameter is narrowed by any type guard in the left operand when false, 
// provided the right operand contains no assignments to the variable or parameter.
