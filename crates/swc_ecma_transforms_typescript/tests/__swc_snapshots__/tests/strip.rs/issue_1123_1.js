const normalizedQuestionSet = {};
var _normalizedQuestionSet_submissionIds;
const submissions = ((_normalizedQuestionSet_submissionIds = normalizedQuestionSet.submissionIds) !== null && _normalizedQuestionSet_submissionIds !== void 0 ? _normalizedQuestionSet_submissionIds : []).map((id, index)=>{
    const submission = normalizedQuestionSet.submissions?.[id];
    var _submission_answers;
    const submissionAnswers = ((_submission_answers = submission.answers) !== null && _submission_answers !== void 0 ? _submission_answers : []).map((answerId)=>normalizedQuestionSet.answers?.[answerId]);
    console.log(id, index);
    return {
        type: "super-submission"
    };
});
console.log(submissions);
