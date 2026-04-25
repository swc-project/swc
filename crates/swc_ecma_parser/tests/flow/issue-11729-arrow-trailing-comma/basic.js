const withType = (
  value: string,
): string => value;

const withTypeParam = <T: {...}>(
  value: T,
): T => value;

const genericNoComma = <Generic>(args) => args;
const genericTrailingComma = <Generic,>(args) => args;
const genericConstrained = <Generic: mixed>(args) => args;
const asyncGenericNoComma = async <Generic>(args) => args;
const asyncGenericTrailingComma = async <Generic,>(args) => args;
const jsxRollback = <Generic>(args)</Generic>;
