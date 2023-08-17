export default function Home() {
    return (
        <div>{foo.a}</div>
    )
}

const foo = {
    get a() {
        return `a ${this.b}`;
    },
    get b() {
        return `b`;
    }
}
