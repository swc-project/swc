//// [controlFlowNullishCoalesce.ts]
// assignments in shortcutting rhs
var a;
null != o ? o : a = 1, a.toString(), null == o || o;
