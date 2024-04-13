export function k() {
    function x() {
        console.log("hi");
    }
    {
        function x() {
            console.log("merong");
        }
    }
    return x;
}
k();
