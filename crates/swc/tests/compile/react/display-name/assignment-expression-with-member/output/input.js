foo.x = createReactClass({
    displayName: "x"
});
class A extends B {
    render() {
        super.x = React.createClass({
            displayName: "x"
        });
    }
}
;
