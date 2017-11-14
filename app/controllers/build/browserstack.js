module.exports.handle = function(req, res) {
    
    let Launcher = require('webdriverio').Launcher,
        overrides = req.body.options ? JSON.parse(req.body.options) : {};
        wdio = new Launcher('./config/wdio-browserstack-defaults.js', overrides);

    if(overrides.capabilities) {
        if(overrides.project) {
            overrides.capabilities.forEach(
                function(capability) {
                    capability.project = overrides.project;
                }
            );
        }
        if(overrides.build) {
            overrides.capabilities.forEach(
                function(capability) {
                    capability.build = overrides.build;
                }
            );
        }

        wdio.configParser._capabilities = overrides.capabilities;
    }
    
    wdio.run().then(
        function(value) {
            if(value === 0) {
                res.send({
                    success: true
                });
            }
            else {
                res.send({
                    success: false,
                    reason: 'One or more tests have failed.'
                });
            }
        }, function(reason) {
            res.send({
                success: false,
                reason:reason
            });
        }
    );
};
