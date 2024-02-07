//// [controlFlowElementAccessNoCrash1.ts]
function testTscCompile(input) {}
function verifyTscEditDiscrepancies(param) {
    var index = param.index, edits = param.edits, commandLineArgs = param.commandLineArgs;
    var caption = edits[index].caption;
    testTscCompile({
        subScenario: caption,
        commandLineArgs: edits[index].commandLineArgs || commandLineArgs
    });
}
