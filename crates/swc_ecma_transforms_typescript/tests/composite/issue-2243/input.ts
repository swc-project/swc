export type Colors = 0.0 | 1.0 | 2.0;

export function Colors(member: Colors.KeyType): Colors {
    return Colors.ValueFor(member);
}

export module Colors {
    export type KeyType = keyof typeof ValueMap;

    export const ValueMap = {
        Red: { value: 0.0, label: "Red" },
        Blue: { value: 1.0, label: "Blue" },
        Green: { value: 2.0, label: "Green" },
    } as const;

    export const Values: Colors[] = [0.0, 1.0, 2.0];

    export function ValueFor(member: KeyType): Colors {
        return ValueMap[member]?.value;
    }

    export async function LabelFor(
        member: KeyType
    ): Promise<string | undefined> {
        return ValueMap[member]?.label;
    }
}
