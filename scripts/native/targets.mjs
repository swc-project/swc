/** The complete npm boundary. Unknown targets must never take the raw path. */
export const products = Object.freeze([
    "core",
    "html",
    "minifier",
    "react-compiler",
]);

export const targets = Object.freeze({
    "x86_64-apple-darwin": { abi: "darwin-x64", carrier: true },
    "aarch64-apple-darwin": { abi: "darwin-arm64", carrier: true },
    "x86_64-pc-windows-msvc": { abi: "win32-x64-msvc", carrier: true },
    "aarch64-pc-windows-msvc": { abi: "win32-arm64-msvc", carrier: true },
    "x86_64-unknown-linux-gnu": { abi: "linux-x64-gnu", carrier: true },
    "aarch64-unknown-linux-gnu": { abi: "linux-arm64-gnu", carrier: true },
    "x86_64-unknown-linux-musl": { abi: "linux-x64-musl", carrier: true },
    "aarch64-unknown-linux-musl": { abi: "linux-arm64-musl", carrier: true },
    "i686-pc-windows-msvc": { abi: "win32-ia32-msvc", carrier: false },
    "armv7-unknown-linux-gnueabihf": {
        abi: "linux-arm-gnueabihf",
        carrier: false,
    },
    "powerpc64le-unknown-linux-gnu": { abi: "linux-ppc64-gnu", carrier: false },
    "s390x-unknown-linux-gnu": { abi: "linux-s390x-gnu", carrier: false },
});

export const minimumNodes = Object.freeze({
    core: ["10.0.0"],
    html: ["14.0.0"],
    minifier: ["12.0.0", "14.0.0"],
    "react-compiler": ["20.0.0"],
});

export function targetInfo(product, target) {
    if (!products.includes(product) || !Object.hasOwn(targets, target)) {
        throw new Error(
            "Unknown native product/target: " + product + "/" + target
        );
    }
    return targets[target];
}
