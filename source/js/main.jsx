var DashConsole     = require( './react-elements/console' ),
    DashObjects     = require( './react-elements/object-browser' ),
    DashProperties  = require( './react-elements/properties' );

var config = {
  content: [{
    type: 'row',
    content: [{
      type: 'stack',
      width: 15,
      content: [{
        type: 'component',
        componentName: 'ObjectBrowser',
        title: 'Object Browser'
      }]
    },
    {
      type: 'column',
      width: 70,
      content: [{
        type: 'component',
        componentName: 'DashConnect',
        title: 'Connect to Dash'
      },
      {
        type: 'component',
        height: 20,
        title: 'Console',
        componentName: 'DashConsole'
      }]
    },
    {
      type: 'row',
      content: [{
        type: 'stack',
        width: 15,
        content: [{
          type: 'component',
          componentName: 'Properties',
          title: 'Properties'
        }]
      }]
    }]
  }]
};

dash = module.exports = {
  engine: new Dash(),
  scene: [],
  panels: {
    objectBrowser: { },
    propertiesEditor: { }
  },
  console: { },
  layout: new GoldenLayout( config )
};

dash.engine.registerReceiveHandler("dash:logger:message", function(data)
{
  dash.console.log(data);
});

// this function is empty until we add a proper graph for FPS data
// the empty function stops an error from being thrown in the console
dash.engine.registerReceiveHandler("dash:perf:frametime", function(data)
{

});

dash.engine.onConnect = function()
{
  dash.console.log( 'Connected to Dash.' );
  dash.engine.getObjects( function( data ) {
    dash.scene = data;
    dash.panels.objectBrowser.setProps( { data: dash.scene } );
  } );
};

//registerElement( 'Myelement', function() { return <DashProperties data={ [] } />; } );
function registerElement( name, elementCb, storeElementCb )
{
  dash.layout.registerComponent( name, function( container, state )
  {
    var result = React.render(
      elementCb(),
      container.getElement()[0]
    );

    if( storeElementCb )
      storeElementCb( result );

    //TODO: Make GL state accessible from react
  });
}


connectToDash = function()
{
  dash.engine.connect( '8008' );
  dash.console.log( 'Connecting to Dash...' );
};

registerElement( 'DashConnect', function() {
  return <button className="connect" onClick={ connectToDash }>Connect to Dash</button>;
} );
registerElement( 'ObjectBrowser', function() {
  return <DashObjects data={ [  ] } />;
}, function( element ) {
  dash.panels.objectBrowser = element;
} );
registerElement( 'Properties', function() {
  return <DashProperties data={ [] } />;
}, function( element ) {
  dash.panels.propertyEditor = element;
} );
registerElement( 'DashConsole', function() {
  return <DashConsole class="console" />;
}, function( element ) {
  dash.console = element;
} );

dash.layout.init();
