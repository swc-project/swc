export default function Home() {
    return React.createElement("div", null, foo.a);
}
const foo = {
    get a () {
        return `a ${this.b}`;
    },
    get b () {
        return "b";
    }
};
export { Home as default };
