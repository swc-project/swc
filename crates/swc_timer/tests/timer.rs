use swc_timer::timer;

#[test]
fn logging() {
    testing::run_test(false, |_, _| {
        timer!("operation");

        Ok(())
    })
    .unwrap();
}
