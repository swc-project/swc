var _normalizedQuestionSet_submissionIds;
const normalizedQuestionSet = {};
const submissions = ((_normalizedQuestionSet_submissionIds = normalizedQuestionSet.submissionIds) !== null && _normalizedQuestionSet_submissionIds !== void 0 ? _normalizedQuestionSet_submissionIds : []).map((id, index)=>{
    var _submission_answers;
    const submission = normalizedQuestionSet.submissions?.[id];
    const submissionAnswers = ((_submission_answers = submission.answers) !== null && _submission_answers !== void 0 ? _submission_answers : []).map((answerId)=>normalizedQuestionSet.answers?.[answerId]);
    console.log(id, index);
    return {
        type: "super-submission"
    };
});
console.log(submissions);
