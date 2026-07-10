declare function readSetting(name: "retries"): number;
declare function readSetting<TValue extends string = string>(
    name: string,
): TValue;

function decorate<TValue = unknown>(value: TValue) {
    return value;
}

const computedName = "compute";

class Base<TName extends string = string> {
    constructor(readonly name: TName) {}

    declare readonly x: TName;

    compute<TValue extends number = number>(value?: TValue): TValue {
        return (value ?? 1) as TValue;
    }

    describe(value: string): string;
    describe(value: number): number;
    describe<TValue extends string | number = string>(value: TValue): TValue {
        return value;
    }

    run() {
        return this.name;
    }
}

@decorate
export class Derived<
    TName extends string = "derived",
    TMeta extends Record<string, unknown> = { source: string },
> extends Base<TName> {
    public accessor ready = true;
    protected value: number = 1;
    protected metadata: TMeta;
    #secret = 1;
    static #shared = 0;

    constructor(
        public readonly displayName: TName,
        private count = 0,
        metadata = { source: displayName } as TMeta,
    ) {
        super(displayName);
        this.value = count;
        this.metadata = metadata;
    }

    @decorate
    get state(): number {
        return this.#secret;
    }

    set state(next: number) {
        this.#secret = next;
    }

    read(path: "state"): number;
    read(path: string): string;
    read<TResult extends string | number = string>(path: string): TResult {
        return (path === "state" ? this.#secret : this.displayName) as TResult;
    }

    [computedName]<TStep extends number = number>(step: TStep): number {
        return super.compute() + this.#secret + step;
    }

    static {
        this.#shared += 1;
    }

    async *values<TYield extends number = number>(): AsyncGenerator<
        TYield,
        void,
        unknown
    > {
        yield this.#secret as TYield;
    }

    #touch<TResult extends number = number>(): TResult {
        return this.#secret as TResult;
    }
}

export const InlineDerived = class extends Derived<"inline"> {
    override run<TResult extends string = "inline">(): TResult {
        return super.run() as TResult;
    }
};

abstract class Shape<TId extends string = string> {
    abstract readonly id: TId;
    abstract draw(): void;
    protected abstract log(): void;
}

interface Drawable<T> {
    render(): T;
}

interface Serializable {
    serialize(): string;
}

class Circle extends Shape<"circle"> implements Drawable<string>, Serializable {
    public readonly radius: number;
    protected readonly center: [number, number];
    private readonly secret: string;

    constructor(radius: number) {
        super();
        this.radius = radius;
        this.center = [0, 0];
        this.secret = "hidden";
    }

    public draw(): void {}
    protected log(): void {}
    public render(): string {
        return "";
    }
    public serialize(): string {
        return "";
    }
}

const identity = <TValue,>(value: TValue): TValue => value;

export function App() {
    return <div data-kind="classes" />;
}
