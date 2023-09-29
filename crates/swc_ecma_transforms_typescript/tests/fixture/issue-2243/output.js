export function Colors(member) {
    return Colors.ValueFor(member);
}
(function(Colors) {
    Colors.ValueMap = {
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
    Colors.Values = [
        0.0,
        1.0,
        2.0
    ];
    function ValueFor(member) {
        return Colors.ValueMap[member]?.value;
    }
    Colors.ValueFor = ValueFor;
    async function LabelFor(member) {
        return Colors.ValueMap[member]?.label;
    }
    Colors.LabelFor = LabelFor;
})(Colors || (Colors = {}));
