import * as binding from "./binding";
import { TransformOutput } from "./binding";

interface Options {

}

type BabelTransform = (_:null,input: string) => Promise<string>;

export async function transform3Times(
    content: string,
    firstOptions: Options,
    babelTransform: BabelTransform,
    thirdOptions: Options
): Promise<TransformOutput> {
    return await binding.transform3Times(content, toBuffer(firstOptions ?? {}), babelTransform, toBuffer(thirdOptions ?? {})) as any;
}
export async function transform2Times(
    content: string,
    firstOptions: Options,
    babelTransform: BabelTransform,
): Promise<TransformOutput> {
    return await binding.transform2Times(content, toBuffer(firstOptions ?? {}), babelTransform) as any;
}
export async function transformOnce(
    content: string,
    firstOptions: Options,
): Promise<TransformOutput> {
    return await binding.transformOnce(content, toBuffer(firstOptions ?? {})) as any;
}

function toBuffer(t: any): Buffer {
    return Buffer.from(JSON.stringify(t));
}
