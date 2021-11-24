use swc_timer::timer;

#[test]
fn logging() {
    testing::run_test(false, |_, _| {
        let _timer = timer!("operation");

        Ok(())
    })
    .unwrap();
}
