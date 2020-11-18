class Zone3 {
}
const __default = Zone3;
const Zone1 = __default;
class FixedOffsetZone3 extends Zone1 {
}
const __default1 = FixedOffsetZone3;
const FixedOffsetZone1 = __default1;
const Zone2 = __default;
const FixedOffsetZone2 = __default1;
class Info2 {
    use() {
        console.log(FixedOffsetZone1);
    }
}
const __default2 = Info2;
const Info1 = __default2;
export { Zone2 as Zone, Info1 as Info, FixedOffsetZone2 as FixedOffsetZone };
