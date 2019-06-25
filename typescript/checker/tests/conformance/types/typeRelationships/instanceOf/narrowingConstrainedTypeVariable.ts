// @strict: true

// Repro from #20138

class C { }

function f1<T extends C>(v: T | string): void {
    if (v instanceof C) {
        const x: T = v;
    }
    else {
        const s: string = v;
    }
}

class D { }

function f2<T extends C, U extends D>(v: T | U) {
    if (v instanceof C) {
        const x: T = v;
    }
    else {
        const y: U = v;
    }
}

class E { x: string | undefined }

function f3<T extends E>(v: T | { x: string }) {
    if (v instanceof E) {
        const x: T = v;
    }
    else {
        const y: { x: string } = v;
    }
}
