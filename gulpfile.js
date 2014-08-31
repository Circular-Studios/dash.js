var gulp        = require( 'gulp' ),
    coffee      = require( 'gulp-coffee' ),
    coffeelint  = require( 'gulp-coffeelint' ),
    uglify      = require( 'gulp-uglify' ),
    concat      = require( 'gulp-concat' ),
    mocha       = require( 'gulp-mocha' );

require( 'coffee-script/register' );

var sources = gulp.src( './source/**/*.coffee' );

gulp.task( 'build', [ 'test' ], function() {
    sources
        .pipe( concat( 'dash.coffee' ) )
        .pipe( gulp.dest( './dist' ) );

    return sources
        .pipe( concat( 'dash.js' ) )
        .pipe( coffee() )
        .pipe( uglify() )
        .pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'lint', function() {
    sources
        .pipe( coffeelint() )
        .pipe( coffeelint.reporter() );
});

gulp.task( 'test', function() {
    return gulp
        .src( 'test/**/*.coffee' )
        .pipe( coffeelint() )
        .pipe( coffeelint.reporter( 'fail' ) )
        .pipe( mocha( {
            reporter: 'spec'
        } ) );
} );
