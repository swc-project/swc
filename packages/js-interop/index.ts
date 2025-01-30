import * as binding from "./binding";

export type MinifierType = "js-module" | "js-script" | "json" | "css" | "html";

export type Options = {
    filename?: string;
    iframeSrcdoc?: boolean;
    scriptingEnabled?: boolean;
    forceSetHtml5Doctype?: boolean;
    collapseWhitespaces?:
        | "none"
        | "all"
        | "smart"
        | "conservative"
        | "advanced-conservative"
        | "only-metadata";
    removeEmptyMetadataElements?: boolean;
    removeComments?: boolean;
    preserveComments?: string[];
    minifyConditionalComments?: boolean;
    removeEmptyAttributes?: boolean;
    removeRedundantAttributes?: "none" | "all" | "smart";
    collapseBooleanAttributes?: boolean;
    normalizeAttributes?: boolean;
    minifyJson?: boolean | { pretty?: boolean };
    // TODO improve me after typing `@swc/css`
    minifyJs?: boolean | { parser?: any; minifier?: any; codegen?: any };
    minifyCss?:
        | boolean
        | { lib: "lightningcss" }
        | { lib: "swc"; parser?: any; minifier?: any; codegen?: any };
    minifyAdditionalScriptsContent?: [string, MinifierType][];
    minifyAdditionalAttributes?: [string, MinifierType][];
    sortSpaceSeparatedAttributeValues?: boolean;
    sortAttributes?: boolean;
    tagOmission?: boolean;
    selfClosingVoidElements?: boolean;
    quotes?: boolean;
};

export type FragmentOptions = Options & {
    mode?: "no-quirks" | "limited-quirks" | "quirks";
    context_element?: binding.Element;
    form_element?: binding.Element;
};

export async function minify(
    content: string | Buffer,
    options?: Options
): Promise<binding.TransformOutput> {
    return binding.minify(content, toBuffer(options ?? {}));
}

export async function minifyFragment(
    content: string | Buffer,
    options?: FragmentOptions
): Promise<binding.TransformOutput> {
    return binding.minifyFragment(content, toBuffer(options ?? {}));
}

export function minifySync(
    content: string | Buffer,
    options?: Options
): binding.TransformOutput {
    return binding.minifySync(content, toBuffer(options ?? {}));
}

export async function minifyFragmentSync(
    content: string | Buffer,
    options?: FragmentOptions
): Promise<binding.TransformOutput> {
    return binding.minifyFragmentSync(content, toBuffer(options ?? {}));
}

function toBuffer(t: any): Buffer {
    return Buffer.from(JSON.stringify(t));
}
