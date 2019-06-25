// @declaration: true

type Kind = "A" | "B"

interface Entity {
    kind: Kind;
}

interface A extends Entity {
    kind: "A";
    a: number;
}

interface B extends Entity {
    kind: "B";
    b: string;
}

function hasKind(entity: Entity, kind: "A"): entity is A;
function hasKind(entity: Entity, kind: "B"): entity is B;
function hasKind(entity: Entity, kind: Kind): entity is Entity;
function hasKind(entity: Entity, kind: Kind): boolean {
    return entity.kind === kind;
}

let x: A = {
    kind: "A",
    a: 100,
}

if (hasKind(x, "A")) {
    let a = x;
}
else {
    let b = x;
}

if (!hasKind(x, "B")) {
    let c = x;
}
else {
    let d = x;
}