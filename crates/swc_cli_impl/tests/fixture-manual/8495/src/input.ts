import type {
    AnimationConfigWithData,
    AnimationConfigWithPath,
} from "lottie-web";
import type { CSSProperties } from "react";

type Without<T, U> = {
    // For each `K` in the keys of `T` excluding keys of `U`
    // map `K` to an optional `never` type.
    //
    // See: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
    [K in Exclude<keyof T, keyof U>]?: never;
};

// A type that either has one set of properties or another, but not both.
export type XOR<T, U> = T | U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

export type LottieWebParams = XOR<
    Omit<AnimationConfigWithPath<"svg">, "renderer" | "container">,
    Omit<AnimationConfigWithData<"svg">, "renderer" | "container">
>;

export type LottieAnimationProps = {
    className?: string;
    style?: CSSProperties;
    withShadowRoot?: boolean;
    onAnimationEnd?: () => void;
} & LottieWebParams;