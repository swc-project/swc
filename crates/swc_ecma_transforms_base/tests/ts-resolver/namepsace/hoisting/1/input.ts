declare namespace RangeParser {
    interface Ranges extends Array<Range> {
        type: string;
    }
    interface Range {
        start: number;
        end: number;
    }
}
