// Multiple literal line breaks inside quoted JSX attribute strings should stay intact.
const hello = <div data-anything="line1

    line2
line3">hello</div>;
