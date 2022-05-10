export default function example(html) {
    const test = () => {
        return "test";
    };
    return html`${test()}`;
}
