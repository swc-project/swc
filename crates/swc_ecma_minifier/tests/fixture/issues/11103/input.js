import assert from "node:assert";
const miniDynamics = () => {
    if (true) {
        let url = "api";
        url += "/";
        return new URL(url, "https://example.com").toString();
    }
};
let url = miniDynamics();
assert(url === "https://example.com/api/");
export default function Home() {
    return React.createElement("p", null, url);
}
