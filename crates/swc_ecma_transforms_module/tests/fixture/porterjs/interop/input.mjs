import $ from 'yen';
require('@cara/demo-component');
var expect = require('expect.js');

describe('yen.fn.reveal()', function () {
  before(function () {
    $('#fixture').addClass('hidden');
  });

  it('removeClass("hidden")', function () {
    expect($('#fixture').reveal().hasClass('hidden')).to.be(false);
  });
});

describe('auto transpile es modules', function () {
  it('should be able to handle es module by default', async function () {
    const exports = await import('./add');
    expect(exports.default).to.be.a(Function);
  });
});
