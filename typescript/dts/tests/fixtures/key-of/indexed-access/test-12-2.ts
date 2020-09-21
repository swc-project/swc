// Repro from #23618

type DBBoolTable<K extends string> = { [k in K]: 0 | 1 }

enum Flag {
    FLAG_1 = "flag_1",
    FLAG_2 = "flag_2"
}

type DynamicDBRecord<Flag extends string> = ({ dynamicField: number } | { dynamicField: string }) & DBBoolTable<Flag>

function getFlagsFromDynamicRecord<Flag extends string>(record: DynamicDBRecord<Flag>, flags: Flag[]) {
    return record[flags[0]];
}
