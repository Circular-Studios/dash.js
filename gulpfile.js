var gulp        = require( 'gulp' ),
    coffee      = require( 'gulp-coffee' ),
    coffeelint  = require( 'gulp-coffeelint' ),
    uglify      = require( 'gulp-uglify' ),
    mocha       = require( 'gulp-mocha' ),
    rename      = require( 'gulp-rename' ),
    gutil       = require( 'gulp-util' ),
    browserify  = require( 'browserify' ),
    source      = require( 'vinyl-source-stream' ),
    sequence    = require( 'run-sequence' );

require( 'coffee-script/register' );

var sources = './source/**/*.coffee';
var tests = './test/**/*.coffee';
var dist = './dist';

gulp.task( 'lint', function() {
    return gulp
        .src( [ sources, tests ] )
        .pipe( coffeelint() )
        .pipe( coffeelint.reporter() );
});

gulp.task( 'test', function() {
    return gulp
        .src( tests )
        .pipe( mocha( {
            reporter: 'spec'
        } ) );
} );

gulp.task( 'build-js', function() {
    return browserify( {
        // Required watchify args
        cache: { }, packageCache: { }, fullPaths: false,
        // The files to include
        entries: [ './source/dash.coffee' ],
        // Export Dash for usage
        standalone: 'Dash',
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

gulp.task( 'build-js-min', function() {
    return gulp
        .src( './dist/dash.js' )
        .pipe( uglify() )
        .pipe( rename( 'dash.min.js' ) )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'build-sync', function( cb ) {
    sequence(
        'lint',
        'test',
        'build-js',
        'build-js-min',
        cb
    );
} );

gulp.task( 'build', [ 'build-js', 'build-js-min', 'lint', 'test' ] );
gulp.task( 'default', [ 'build-sync' ] );
