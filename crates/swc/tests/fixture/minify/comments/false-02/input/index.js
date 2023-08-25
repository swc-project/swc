export var padding = ''

// some-comment
function exec1({
	command,
}) {
	command();
}

export function exec2({
	commands,
}) {
	return __awaiter(this, void 0, void 0, function* () {
		for (let i2 = 0; i2 < commands.length; i2++) {
			const command = commands[i2]
			yield exec1({
				command,
				handleError,
			})
		}
	})
}
