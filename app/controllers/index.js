module.exports = {
    handle: function(req, res) {
        res.send('Hello, the REST service is online.\n');
        res.end();
    }
};
