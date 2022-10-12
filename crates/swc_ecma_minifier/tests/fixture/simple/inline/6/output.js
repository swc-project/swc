export function endOf(units) {
    var time;
    switch(this._isUTC, units){
        case "hour":
            time = v(), time += 3600000 - ((time + 3600000) % 3600000 + 3600000) % 3600000 - 1;
            break;
        case "minute":
            time = v(), time += 60000 - (time % 60000 + 60000) % 60000 - 1;
            break;
        case "second":
            time = v(), time += 1000 - (time % 1000 + 1000) % 1000 - 1;
    }
    return time;
}
