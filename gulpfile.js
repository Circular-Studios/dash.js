var gulp        = require( 'gulp' ),
    coffee      = require( 'gulp-coffee' ),
    coffeelint  = require( 'gulp-coffeelint' ),
    uglify      = require( 'gulp-uglify' ),
    mocha       = require( 'gulp-mocha' ),
    rename      = require( 'gulp-rename' ),
    gutil       = require( 'gulp-util' ),
    sass        = require( 'gulp-sass' ),
    concatCss   = require( 'gulp-concat-css' ),
    minifyCss   = require( 'gulp-minify-css' ),
    glob        = require( 'glob' ),
    browserify  = require( 'browserify' ),
    source      = require( 'vinyl-source-stream' ),
    sequence    = require( 'run-sequence' );

require( 'coffee-script/register' );

var api = './source/dashconnector.coffee';
var frameworkSources = './source/js/**/*.jsx';
var tests = './test/**/*.coffee';
var dist = './dist';
var styles = './source/css/**/*.scss';

gulp.task( 'api-lint', function() {
    return gulp
        .src( [ api, tests ] )
        .pipe( coffeelint() )
        .pipe( coffeelint.reporter() );
});

gulp.task( 'api-test', [ 'api-lint' ], function() {
    return gulp
        .src( tests )
        .pipe( mocha() );
} );

gulp.task( 'api-build-js', function() {
    return browserify( {
        // Required watchify args
        cache: { }, packageCache: { }, fullPaths: false,
        // The files to include
        entries: [ api ],
        // Export DashConnector for usage
        standalone: 'DashConnector',
        // Add file extentions to make optional in your requires
        extensions: [ '.coffee' ],
        // Enable source maps!
        debug: true
    } )
        .transform( 'coffeeify' )
        .bundle()
        .on( 'error', gutil.log )
        .pipe( source( 'dash.js' ) )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'api-build-js-min', [ 'api-build-js' ], function() {
    return gulp
        .src( './dist/dash.js' )
        .pipe( uglify() )
        .pipe( rename( 'dash.min.js' ) )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'api-build', [ 'api-build-js', 'api-build-js-min', 'api-lint', 'api-test' ] );
gulp.task( 'api-build-sync', function( cb ) {
    sequence(
        'api-lint',
        'api-test',
        'api-build-js',
        'api-build-js-min',
        cb );
} );

gulp.task( 'fw-lint', function() {

} );

gulp.task( 'fw-build-js', function() {
    return browserify( {
        // Required watchify args
        cache: { }, packageCache: { }, fullPaths: false,
        // The files to include
        entries: glob.sync( './source/js/react-elements/*.jsx' ), //glob.sync( frameworkSources ),
        // Export Dash for usage
        standalone: 'dash',
        // Add file extentions to make optional in your requires
        extensions: [ '.jsx' ],
        // Enable source maps!
        debug: true
    } )
        .transform( 'reactify' )
        .bundle()
        .on( 'error', gutil.log )
        .pipe( source( 'dash.framework.js' ) )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'fw-build-js-min', [ 'fw-build-js' ], function() {
    return gulp
        .src( './dist/dash.framework.js' )
        .pipe( uglify() )
        .pipe( rename( 'dash.framework.min.js' ) )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'fw-build-css', function() {
    return gulp
        .src( styles )
        .pipe( sass() )
        .pipe( concatCss( "dash.css" ) )
        .pipe( gulp.dest( dist ) );
});

gulp.task( 'fw-build-css-min', [ 'fw-build-css' ], function() {
    return gulp
        .src( dist + '/dash.css' )
        .pipe( minifyCss( { keepBreaks:true } ) )
        .pipe( rename( 'dash.min.css' ) )
        .pipe( gulp.dest( dist ) );
});

gulp.task( 'fw-build', [ 'fw-lint', 'fw-build-js', 'fw-build-js-min' ] );
gulp.task( 'fw-build-sync', function( cb ) {
    sequence(
        'fw-lint',
        'fw-build-js',
        'fw-build-js-min',
        cb );
} );

gulp.task( 'build', [ 'api-build', 'fw-build' ] );
gulp.task( 'build-sync', [ 'api-build-sync', 'fw-build-sync' ] );
gulp.task( 'default', [ 'build' ] );
