let sideEffects = 0;

function sideEffect() {
    sideEffects++;
}

export const direct = console.log(sideEffect());
export const call = console.error.call(console, sideEffect());
export const apply = console.warn.apply(console, [sideEffect()]);
export const bound = console.error.bind(console, sideEffect());
export const source = console.log.toString(sideEffect());

const ignored = console.log.bind(console, sideEffect());

console.log.bind(console, sideEffect());
console.log.toString(sideEffect());
console.log.call(console, sideEffect());
console.log.apply(console, [sideEffect()]);

export const optionalDirect = console?.log?.(sideEffect());
export const optionalCall = console?.error?.call?.(console, sideEffect());
export const optionalApply = console?.warn?.apply?.(console, [sideEffect()]);
export const optionalBound = console?.error?.bind?.(console, sideEffect());
export const optionalSource = console?.log?.toString?.(sideEffect());

export { sideEffects };
