const withType = (
  value: string,
): string => value;

const withTypeParam = <T: {...}>(
  value: T,
): T => value;
