export function Colors(member) {
    return Colors.ValueFor(member);
}
(function(Colors1) {
    var ValueMap = Colors1.ValueMap = {
        Red: {
            value: 0.0,
            label: "Red"
        },
        Blue: {
            value: 1.0,
            label: "Blue"
        },
        Green: {
            value: 2.0,
            label: "Green"
        }
    };
    var Values = Colors1.Values = [
        0.0,
        1.0,
        2.0
    ];
    function ValueFor(member) {
        return ValueMap[member]?.value;
    }
    Colors1.ValueFor = ValueFor;
    async function LabelFor(member) {
        return ValueMap[member]?.label;
    }
    Colors1.LabelFor = LabelFor;
})(Colors || (Colors = {}));
