type MyAlias = `some-value`;
type OtherAlias =
    | `some`
    | `text`;
type MultiLine = `
some value
`;
type WithTypes = `with-a-${string}`;
type WithTypes2 = `with-a-${MyAlias}-end`;
