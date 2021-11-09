// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/table/lib/border.ts


export interface IBorder {
    top: string;
    topMid: string;
    topLeft: string;
    topRight: string;
    bottom: string;
    bottomMid: string;
    bottomLeft: string;
    bottomRight: string;
    left: string;
    leftMid: string;
    mid: string;
    midMid: string;
    right: string;
    rightMid: string;
    middle: string;
}

export const border: IBorder = {
    top: '─',
    topMid: '┬',
    topLeft: '┌',
    topRight: '┐',
    bottom: '─',
    bottomMid: '┴',
    bottomLeft: '└',
    bottomRight: '┘',
    left: '│',
    leftMid: '├',
    mid: '─',
    midMid: '┼',
    right: '│',
    rightMid: '┤',
    middle: '│'
};
