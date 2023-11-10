class Zone {
}
class FixedOffsetZone extends Zone {
}
class Info {
    use() {
        console.log(FixedOffsetZone);
    }
}
export { Zone as Zone, Info as Info, FixedOffsetZone as FixedOffsetZone };
