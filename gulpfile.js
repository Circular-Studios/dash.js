var gulp        = require( 'gulp' ),
    coffee      = require( 'gulp-coffee' ),
    coffeelint  = require( 'gulp-coffeelint' ),
    uglify      = require( 'gulp-uglify' ),
    concat      = require( 'gulp-concat' );

gulp.task( 'build', function() {
    var linted = gulp
        .src( './source/**/*.coffee')
        .pipe( coffeelint() )
        .pipe( coffeelint.reporter( 'fail' ) );

    linted
        .pipe( concat( 'dash.coffee' ) )
        .pipe( gulp.dest( './dist' ) );

    linted
        .pipe( concat( 'dash.js' ) )
        .pipe( coffee() )
        .pipe( uglify() )
        .pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'lint', function() {
    gulp.src( './source/*.coffee' )
        .pipe( coffeelint() )
        .pipe( coffeelint.reporter() );
});

gulp.task( 'test', function() {

} );
