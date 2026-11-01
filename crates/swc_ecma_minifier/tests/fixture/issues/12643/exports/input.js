export let transform;
export const process = value => transform ? transform(value) : value;
