var Zone;
Zone = class Zone {
};
var FixedOffsetZone;
FixedOffsetZone = class FixedOffsetZone extends Zone {
};
var Info;
Info = class Info {
    use() {
        console.log(FixedOffsetZone);
    }
};
export { Zone as Zone, Info as Info, FixedOffsetZone as FixedOffsetZone };
