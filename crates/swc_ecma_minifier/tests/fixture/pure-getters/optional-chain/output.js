// `a?.b` short-circuits, so it is an OptChainExpr rather than a plain
// member access and is left alone.
a?.b;
