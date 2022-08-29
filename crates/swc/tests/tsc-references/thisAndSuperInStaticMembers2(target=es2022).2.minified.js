//// [thisAndSuperInStaticMembers2.ts]
this.x, this.x(), this?.x(), this.x(), this?.x(), super.a, super.a, super.f(), super.f(), super.a = 0, super.a += 1, super.a = 0, [super.a] = [
    0
], [super.a = 0] = [
    0
], [...super.a] = [
    0
], ({ x: super.a  } = {
    x: 0
}), ({ x: super.a = 0  } = {
    x: 0
}), ({ ...super.a } = {
    x: 0
}), ++super.a, --super.a, ++super.a, super.a++, super.a``;
