//// [nullishCoalescingOperator7.ts]
a, null == a || a, (null == a ? 'foo' : a) ? null != b && b : null != c && c;
