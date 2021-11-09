// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/validate.ts


export function validateBase64(s: string) {
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s)) {
        throw new TypeError('invalid base64 string');
    }
}

export function validateHex(s: string) {
    if (!/^(?:[A-Fa-f0-9]{2})+$/.test(s)) {
        throw new TypeError('invalid hex string');
    }
}
