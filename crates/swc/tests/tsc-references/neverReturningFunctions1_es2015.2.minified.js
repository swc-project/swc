registerComponent('test-component', {
    schema: {
        myProperty: {
            default: [],
            parse () {
                return [
                    !0
                ];
            }
        },
        string: {
            type: 'string'
        },
        num: 0
    },
    init () {
        this.data.num = 0, this.el.setAttribute('custom-attribute', 'custom-value');
    },
    update () {},
    tick () {},
    remove () {},
    pause () {},
    play () {},
    multiply (f) {
        return f * this.data.num * this.system.data.counter;
    }
});
export { };
