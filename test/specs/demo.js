describe('demo', function() {

  it('test', function () {

    browser.url('https://www.google.com/');
    
    const results = browser.checkDocument();

    let assert = require('assert');
    
    results.forEach(
        function(result) {
            assert.ok(result.isExactSameImage)
        }
    );
  });
});
