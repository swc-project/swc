const res = String.raw`
` === "\\n";
if (!res) {
    throw new Error('Wrong')
}