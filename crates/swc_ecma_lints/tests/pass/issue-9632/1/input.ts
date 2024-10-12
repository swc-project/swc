import * as meta from "./meta.js";

function nameof(obj: unknown) { }

namespace nameof {
    export import version = meta.version;
}

export = nameof;