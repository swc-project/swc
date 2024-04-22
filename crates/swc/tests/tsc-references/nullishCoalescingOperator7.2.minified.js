//// [nullishCoalescingOperator7.ts]
a, null != a && a, (null != a ? a : 'foo') ? null != b && b : null != c && c;
