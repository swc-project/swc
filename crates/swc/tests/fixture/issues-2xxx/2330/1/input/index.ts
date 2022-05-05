interface Group {
    readonly name: string;
    readonly members: readonly string[];
}

interface Parent {
    readonly groups: readonly Group[];
}

function findGroupMember(
    search: string,
    groups: readonly Group[]
): string | null {
    console.log(groups.length);
    for (const group of groups) {
        console.log("GROUP", group.name);

        for (const member of group.members) {
            if (member === search) {
                console.log("YES", member, search);
                return member;
            }
            console.log("nope", member, search);
        }
        console.log("END OF GROUP", group.name);
    }
    return null;
}

const r = findGroupMember("B", [
    {
        name: "foo",
        members: ["A"],
    },
    {
        name: "bar",
        members: ["B"],
    },
]);

console.log(r);
