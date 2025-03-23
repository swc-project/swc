//// [controlFlowNullishCoalesce.ts]
var a;
null == o ? a = 1 : o, a.toString(), null == o || o;
