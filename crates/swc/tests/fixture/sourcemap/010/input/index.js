
jest.mock('../LanguageStore', () => {
    const language = "en"
    const stringsMock = {
        setLanguage: jest.fn()
    };
    const mockSetLanguage = jest.fn();

    return () => ({
        language,
        strings: stringsMock,
        setLanguage: mockSetLanguage,
    })
});

it('renders correctly', () => {
    const TestComponent = connect(Test);
    const strings = { test: 'Test' };
    const wrapper = shallow(<LanguageProvider strings={strings} language="en"><Test /></LanguageProvider>);
    expect(wrapper.get(0)).toMatchSnapshot();
});