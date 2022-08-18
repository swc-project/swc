var a = 1;

h();

function h() {
    (function g() {
        a-- && g();
    })();
}
