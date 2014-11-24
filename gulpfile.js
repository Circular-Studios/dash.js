var gulp        = require( 'gulp' ),
    coffee      = require( 'gulp-coffee' ),
    coffeelint  = require( 'gulp-coffeelint' ),
    uglify      = require( 'gulp-uglify' ),
    mocha       = require( 'gulp-mocha' ),
    rename      = require( 'gulp-rename' ),
    gutil       = require( 'gulp-util' ),
    glob        = require( 'glob' ),
    browserify  = require( 'browserify' ),
    source      = require( 'vinyl-source-stream' ),
    sequence    = require( 'run-sequence' );

require( 'coffee-script/register' );

var coffeescripts = './source/**/*.coffee';
var coffeeelements = './source/js/**/*.cjsx';
var tests = './test/**/*.coffee';
var dist = './dist';

gulp.task( 'lint', function() {
    return gulp
        .src( [ coffeescripts, tests ] )
        .pipe( coffeelint() )
        .pipe( coffeelint.reporter() );
});

gulp.task( 'test', [ 'lint' ], function() {
    return gulp
        .src( tests )
        .pipe( mocha() );
} );

gulp.task( 'build-js', function() {
    return browserify( {
        // Required watchify args
        cache: { }, packageCache: { }, fullPaths: false,
        // The files to include
        entries: glob.sync( './source/js/react-elements/*.cjsx' ),//coffeescripts ),//.concat( glob.sync( coffeeelements ) ),
        // Export dash for usage
        standalone: 'dash',
        // Add file extentions to make optional in your requires
        extensions: [ '.coffee', '.cjsx' ],
        // Enable source maps!
        debug: true
    } )
        .transform( 'coffee-reactify' )
        .bundle()
        .on( 'error', gutil.log )
        .pipe( source( 'dash.js' ) )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'build-js-min', [ 'build-js' ], function() {
    return gulp
        .src( './dist/dash.js' )
        .pipe( uglify() )
        .pipe( rename( 'dash.min.js' ) )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'build', [ 'build-js', 'build-js-min', 'lint', 'test' ] );
gulp.task( 'build-sync', function( cb ) {
    sequence(
        'test',
        'build-js-min',
        cb );
} );

gulp.task( 'default', [ 'build' ] );
