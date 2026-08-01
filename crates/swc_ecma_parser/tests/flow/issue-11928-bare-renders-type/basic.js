type Rendered = renders React.Node;
type MaybeRendered = renders ?React.Node;

function f(x: renders React.Node) {}

type P = { node: renders React.Node };

const g = (): renders React.Node => null;

type X = Array<renders React.Node>;

component Foo() renders React.Node {}
