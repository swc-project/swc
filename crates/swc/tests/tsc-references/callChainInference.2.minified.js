//// [callChainInference.ts]
// Repro from #42404
value && (null == value || value.foo("a")), null == value || value.foo("a");
