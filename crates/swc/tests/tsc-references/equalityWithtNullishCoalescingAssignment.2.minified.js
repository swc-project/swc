//// [equalityWithtNullishCoalescingAssignment.ts]
!function(a) {
    null != a || (a = !0), !1 === a && console.log(a);
}(!1);
