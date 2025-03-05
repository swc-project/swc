declare const MY_MAGIC_VARIABLE: string;

export default function Page() {
    return `Server value: ${true ? MY_MAGIC_VARIABLE : "not set"}`
}
