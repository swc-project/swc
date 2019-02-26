// Don't apply transformation to global code
function a() {
    b.c('d');
}
function a() {
    b.c('e');
}
a();
