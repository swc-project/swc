class Zone {
}
const Zone1 = Zone;
const Zone2 = Zone;
class FixedOffsetZone extends Zone {
}
const FixedOffsetZone1 = FixedOffsetZone;
const FixedOffsetZone2 = FixedOffsetZone;
class Info {
    use() {
        console.log(FixedOffsetZone);
    }
}
const Info1 = Info;
const Info2 = Info;
export { Zone1 as Zone, Info1 as Info, FixedOffsetZone1 as FixedOffsetZone };
