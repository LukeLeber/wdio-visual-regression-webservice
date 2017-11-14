var Common = require('./wdio-common-defaults'),
    merge  = require('merge');

exports.config = merge.recursive(
    Common.config, 
    {
        host: '127.0.0.1',
        port: 4444,
        path: '/wd/hub',
        services: [
            'selenium-standalone',
            'visual-regression'
        ]
    }
);
