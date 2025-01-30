import * as binding from "./binding";
import { TransformOutput } from "./binding";

interface Options {

}

type BabelTransform = (input: TransformOutput) => Promise<TransformOutput>;

export async function transform3Times(
    content: string,
    options?: Options,
    babel_transform?: BabelTransform
): Promise<binding.TransformOutput> {
    return binding.transform3Times(content, toBuffer(options ?? {}), babel_transform);
}

function toBuffer(t: any): Buffer {
    return Buffer.from(JSON.stringify(t));
}
