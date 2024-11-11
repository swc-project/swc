declare const MY_MAGIC_VARIABLE: string;

export default function Page() {
    return (
        <ul>
        <li>Server value: { true ? MY_MAGIC_VARIABLE : "not set" } </li>
            </ul>
    );
}
