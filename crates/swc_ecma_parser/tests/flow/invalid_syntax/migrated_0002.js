// Duplicates are forbidden if IsSimpleParameterList is false, and rest
// params, patterns, and defaults all make the params non-simple
function a(t, t, {b}) {}
