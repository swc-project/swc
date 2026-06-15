import { c as _c } from "react/compiler-runtime";
type NamedValue = {
    name: string;
};
const fallback = {
    count: 1,
    label: "fallback"
};
const namedFunctionExpression = function NamedFunctionExpression<TValue extends number = number>(value: TValue) {
    return value + fallback.count;
};
export async function expressionShapes<TInput = any>(input: TInput & any, loader: () => Promise<NamedValue>) {
    let total = 0;
    const [first, , ...rest] = input.items;
    const { count: renamed = first, nested: { flag = true } = {}, ...others } = input;
    ({ total } = {
        total: renamed
    });
    total += rest.length;
    total ||= 1;
    total &&= 2;
    total ??= 3;
    total++;
    --total;
    const loaded = await loader();
    const dynamic = await import("./lazy.json", {
        with: {
            type: "json"
        }
    });
    const maybeText = input.service?.format?.(total, ...rest);
    const instance = new Map<string, number>([
        [
            "value",
            total
        ]
    ]);
    const matcher = /status-(\d+)/giu;
    const key = `value-${total}`;
    const tagged = tag<string>`load:${loaded.name}`;
    const big = 1n + BigInt(total);
    const typed = loaded as NamedValue;
    const nonNull = typed.name!;
    const satisfied = {
        name: nonNull
    } satisfies NamedValue;
    const tuple = [
        satisfied.name,
        big
    ] as const;
    const instantiatedFactory = input.makeBox<string>;
    const sequence = (total++, total--, total);
    delete others.skip;
    void import.meta.url;
    typeof maybeText;
    return {
        flag,
        dynamic,
        instance,
        key,
        matcher,
        tagged,
        tuple,
        instantiatedFactory,
        namedFunctionExpression,
        sequence,
        fallback
    };
}
function tag<TValue = string>(strings: TemplateStringsArray, ...values: unknown[]): TValue {
    return (strings.raw.join("|") + values.length) as TValue;
}
export const objectShapes = {
    fallback,
    async method () {
        return await Promise.resolve(1);
    },
    get ready () {
        return true;
    },
    set ready (value: boolean){
        fallback.count = value ? 1 : 0;
    },
    ["computed" + fallback.count]: fallback.label,
    __proto__: null
};
export function* generatedIds(seed: number) {
    yield seed;
    yield* [
        seed + 1,
        seed + 2
    ];
}
export function App() {
    const $ = _c(1);
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <div data-kind="expressions"/>;
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
