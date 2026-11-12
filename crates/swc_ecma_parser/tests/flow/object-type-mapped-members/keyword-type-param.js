// A mapped type parameter is an IdentifierName, so reserved words are allowed.
type PropThenKeywordMapped = { foo: string, [in in keyof O]: string };
type KeywordMappedThenProp = { [in in keyof O]: string, foo: string };
type KeywordMappedOnly = { [in in keyof O]: string };
type KeywordMappedSigned = { foo: string, [out in keyof O]-?: string };
