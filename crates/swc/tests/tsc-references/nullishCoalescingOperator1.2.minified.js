//// [nullishCoalescingOperator1.ts]
var ref, aa1 = null != a1 ? a1 : "whatever", aa2 = null != a2 ? a2 : "whatever", aa3 = null != a3 ? a3 : "whatever", aa4 = null != a4 ? a4 : "whatever", bb1 = null != b1 ? b1 : 1, bb2 = null != b2 ? b2 : 1, bb3 = null != b3 ? b3 : 1, bb4 = null != b4 ? b4 : 1, cc1 = null == c1 || c1, cc2 = null == c2 || c2, cc3 = null == c3 || c3, cc4 = null == c4 || c4, dd1 = null != d1 ? d1 : {
    b: 1
}, dd2 = null != d2 ? d2 : {
    b: 1
}, dd3 = null != d3 ? d3 : {
    b: 1
}, dd4 = null != d4 ? d4 : {
    b: 1
}, maybeBool = !1;
null == maybeBool || maybeBool || foo(), foo(), ref = !1, foo();
