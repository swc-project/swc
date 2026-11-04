
    interface SuperSubmission {
        [key: string]: any;
    }

    const normalizedQuestionSet: any = {};

    const submissions: SuperSubmission[] = (
        normalizedQuestionSet.submissionIds ?? []
    ).map(
        (id, index): SuperSubmission => {
          const submission = normalizedQuestionSet.submissions?.[id];

          const submissionAnswers = (submission.answers ?? []).map(
            (answerId) => normalizedQuestionSet.answers?.[answerId]
          );

          console.log(id, index);

          return {
            type: "super-submission",
          };
        }
      );

      console.log(submissions);
