const handleSubmit = useMutation(async () => {
    try {
        const res = await gate.register({ username: phoneNumber });
        setstep((prev) => prev + 1);
        toast.success(res.message);
    } catch ({ data: { errors } }) {
        showErrorMessage(errors);
    }
});