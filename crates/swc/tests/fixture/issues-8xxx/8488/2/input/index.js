function f1(x = this) {}
function f2(x = () => this) {}
function f3(
    x = () => {
        return this;
    },
) {}

function bar() {
    function b1(x = this) {}
    function b2(x = () => this) {}
    function b3(
        x = () => {
            return this;
        },
    ) {}
}
