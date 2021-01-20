class Zone {
}
const Zone1 = Zone;
class FixedOffsetZone extends Zone {
}
const FixedOffsetZone1 = FixedOffsetZone;
class Info {
    use() {
        console.log(FixedOffsetZone);
    }
}
const Info1 = Info;
export { Zone as Zone, Info as Info, FixedOffsetZone as FixedOffsetZone };
