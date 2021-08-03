var a;
// compress these
a = b ? true : false;
a = !b ? true : false;
a = b() ? true : false;
a = b ? !1 : !2;
a = !b ? !null : !3;
a = b() ? !4 : !-3.5;
if (b) {
    a = true;
} else {
    a = false;
}
if (b) {
    a = !5;
} else {
    a = !6;
}
a = b ? false : true;
a = !b ? false : true;
a = b() ? false : true;
a = b ? !7 : !8;
a = !b ? !9 : !10;
a = b() ? !11 : !12;
if (b) {
    a = false;
} else {
    a = true;
}
if (b) {
    a = !13;
} else {
    a = !14;
}
a = b ? 15 : false;
a = !b ? true : 16;
a = b ? 17 : 18;
