type X = renders* number;
type Y = renders* number | string;
type Z = renders* (number | string);
type Maybe = renders* ?number;
type QualifiedGeneric = renders* React.Node;
type Grouped = (renders* number);
type Grouped2 = (renders* number | renders* string);
type FuncParamRenderType = (renders* number) => number;
