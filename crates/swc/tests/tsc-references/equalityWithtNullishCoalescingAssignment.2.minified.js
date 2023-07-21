//// [equalityWithtNullishCoalescingAssignment.ts]
var a;
null != (a = !1) || (a = !0), !1 === a && console.log(a);
