var Path = require( 'path' ),
    VisualRegressionCompare = require( 'wdio-visual-regression-service/compare' );

/**
 * Retrieves a function to retrieve a platform-agnostic relative path to a 
 * screenshot resource based upon the current context that the returned 
 * function is invoked in.
 * 
 * @param basePath string the type of screenshot that is being generated (this 
 *                        will be one of 'reference', 'screen', or 'diff').
 * 
 * @returns {Function}
 */
function getScreenshotName( basePath ) {

    /**
     * The current context
     * 
     * @param context object
     * 
     * @returns string
     */
    return function ( context ) {
        
        var browserName = context.browser.name,
            browserVersion = parseInt( context.browser.version, 10 ),
            viewportWidth = context.meta.viewport.width,
            parent = context.test.parent,
            title = context.test.title,
            // Form a platform-agnostic path to the resource
            screenshot = Path.join(
                basePath, // ./reference | ./screen | ./diff
                parent,   // describe(XXX)
                title     // it(YYY)
            );

        // Note - also add the viewport width to keep names unique if more than one viewport is tested
        screenshot += `${Path.sep}${browserName}-version-${browserVersion}-${viewportWidth}px.png`;

        // Replace any white-space with dashes        
        return screenshot.replace( /\s+/g, '-' ).toLowerCase();
    };
}

// All parts of this configuration may be overridden by the client.
module.exports = {
    config: {
        baseUrl: 'https://www.google.com',

        specs: [
            '../test/specs/**/*.js'
        ],
        maxInstances: 1,
        capabilities: [ {
            browserName: 'firefox',
            platform: 'WINDOWS'
        } ],
        sync: true,
        logLevel: 'silent',
        coloredLogs: true,
        bail: 0,
        screenshotPath: './errorShots/',
        waitforTimeout: 60000,
        connectionRetryTimeout: 90000,
        connectionRetryCount: 3,
        services: [
            'visual-regression'
        ],
        visualRegression: {
            compare: new VisualRegressionCompare.LocalCompare( {
                referenceName: getScreenshotName( Path.join( process.cwd(), 'screenshots/reference' ) ),
                screenshotName: getScreenshotName( Path.join( process.cwd(), 'screenshots/screen' ) ),
                diffName: getScreenshotName( Path.join( process.cwd(), 'screenshots/diff' ) ),
                misMatchTolerance: 0.00
            } ),

            // The number of milliseconds to pause after the viewport is changed
            viewportChangePause: 2000
        },
        framework: 'mocha',
        reporters: [ 'dot' ],
        mochaOpts: {
            ui: 'bdd',
            timeout: 60000
        }
    }
};
