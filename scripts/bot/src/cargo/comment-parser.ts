


const owner = 'swc-project';
const repo = 'swc';
const maintainer = 'kdy1';

export interface Action {
    crate: string
    breaking: boolean
}

export async function parsePrComments(prNumber: number): Promise<Action[]> {

}