class Zone1 {
}
class FixedOffsetZone1 extends Zone1 {
}
class Info1 {
    use() {
        console.log(FixedOffsetZone1);
    }
}
export { Zone1 as Zone, Info1 as Info, FixedOffsetZone1 as FixedOffsetZone };
