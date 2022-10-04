

function thing({ queryKey: [{ url, ...query }] }) {
    console.log(url);
    console.log(query);
}

thing({ queryKey: [{ url: 'https://www.google.com', id: '1' }] })