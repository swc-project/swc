class Public {
    foo(bar: string): string;
    foo(bar: number): number;
    foo(bar: string | number): string | number;
    foo(bar: string | number): string | number {
        return bar;
    }
}

class Private {
    #foo(bar: string): string;
    #foo(bar: number): number;
    #foo(bar: string | number): string | number;
    #foo(bar: string | number): string | number {
        return bar;
    }
}
