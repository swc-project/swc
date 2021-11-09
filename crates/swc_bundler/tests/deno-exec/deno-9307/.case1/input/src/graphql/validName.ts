export const isValidGraphQLName = RegExp.prototype.test.bind(/^[A-Za-z_]\w*$/);

const invalidTokensRe = /^[^A-Za-z_]|\W+(.)?/g;
export const toValidGraphQLName = (name: string): string =>
  name.replace(
    invalidTokensRe,
    (_match, charAfter) => charAfter?.toUpperCase() || ``,
  );
