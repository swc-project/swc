export const test = (str: string | undefined): | string
    | undefined => {
    return str === undefined ? undefined : str;
};