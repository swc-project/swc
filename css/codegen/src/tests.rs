fn assert_min(src: &[Token], expected: &str) {
    testing::run_test2(false, |cm, handler| {
        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let stylesheet: Stylesheet = parse_tokens(
            &fm,
            ParserConfig {
                parse_values: true,
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
            return Err(());
        }

        let mut css_str = String::new();
        {
            let wr = BasicCssWriter::new(&mut css_str, BasicCssWriterConfig { indent: "\t" });
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: true });

            gen.emit(&stylesheet).unwrap();
        }

        NormalizedOutput::from(css_str)
            .compare_to_file(output_file)
            .unwrap();

        Ok(())
    })
    .unwrap();
}
