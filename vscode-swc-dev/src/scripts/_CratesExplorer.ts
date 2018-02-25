
import { NodeType } from "../crates-explorer/Constants";
import { isArray, debug } from "util";

// -------------------------

const runnable: NodeType[] = [
    NodeType.BenchFile,
    NodeType.BenchFiles,
    NodeType.BenchFn,
    NodeType.Binary,
    NodeType.Example,
    NodeType.TestFile,
    NodeType.TestFiles,
    NodeType.TestFn
];
const noDebug = [
    NodeType.BenchFiles,
    NodeType.TestFiles,
];


// -------------------------



const contexts: NodeType[] = Object.keys(NodeType).map((v: string) => NodeType[<any>v] as NodeType);

type CheckFn = (c: NodeType) => boolean;

function calcCond(enable: NodeType[] | CheckFn): string {
    const cond = ['view == cratesExplorer'];

    const check = isArray(enable) ? (c: NodeType) => enable.indexOf(c) !== -1 : enable;


    contexts
        .filter(v => !check(v))
        .forEach(v => {
            cond.push(`viewItem != ${v}`)
        })


    return cond.join(' && ')
}



export const runCond = calcCond(runnable);

export const debugCond = calcCond(c => runnable.indexOf(c) !== -1 && noDebug.indexOf(c) === -1)

export const checkCond = calcCond(c => c !== NodeType.Deps)