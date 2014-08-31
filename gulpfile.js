var gulp        = require( 'gulp' ),
    coffee      = require( 'gulp-coffee' ),
    coffeelint  = require( 'gulp-coffeelint' ),
    uglify      = require( 'gulp-uglify' ),
    concat      = require( 'gulp-concat' ),
    mocha       = require( 'gulp-mocha' );

require( 'coffee-script/register' );

var sources = './source/**/*.coffee';
var tests = './test/**/*.coffee';

gulp.task( 'lint', function() {
    return gulp
        .src( [ sources, tests ] )
        .pipe( coffeelint() )
        .pipe( coffeelint.reporter( 'fail' ) );
});

gulp.task( 'test', [ 'lint' ], function() {
    return gulp
        .src( tests )
        .pipe( mocha( {
            reporter: 'spec'
        } ) );
} );

gulp.task( 'build-coffee', [ 'test' ], function() {
    return gulp
        .src( sources )
        .pipe( concat( 'dash.coffee' ) )
        .pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'build-js', [ 'test' ], function() {
    return gulp
        .src( sources )
        .pipe( coffee() )
        .pipe( concat( 'dash.js' ) )
        .pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'build-js-min', [ 'test' ], function() {
    return gulp
        .src( sources )
        .pipe( coffee() )
        .pipe( concat( 'dash.min.js' ) );
} );

gulp.task( 'build', [ 'test', 'build-coffee', 'build-js', 'build-js-min' ] );
