export default function useResponse<R>(value: R): R;

export default function useResponse<R, T>(
    value: R,
    transform: (value: R) => T,
): T;

export default function useResponse<R, T>(
    value: R,
    transform?: (value: R) => T,
): R | T {
    return transform ? transform(value) : value;
}
