export default function thrower() {
    throw new Error(
        `Failed to recognize value \`${value}\` for property ` +
            `\`${property}\`.`
    );
}
