import assert from "node:assert";
let url = new URL("api/", "https://example.com").toString();
assert("https://example.com/api/" === url);
export default function Home() {
    return React.createElement("p", null, url);
}
