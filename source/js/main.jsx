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

var dash = {
  engine: new DashConnector(),
  scene: [ ],
  panels: {
    objectBrowser: { },
    propertiesEditor: { }
  },
  console: { },
  layout: {
    golden: new GoldenLayout( config ),
    registerElement: registerElement
  }
};

dash.layout.golden.init();

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
  dash.layout.golden.registerComponent( name, function( container, state )
  {
    var result = React.render(
      elementCb(),
      container.getElement()[0]
    );

    if( storeElementCb )
      storeElementCb( result );

    result.setState( state );
  });
}

dash.layout.registerElement( 'DashConnect', function() {
  function connectToDash() {
    dash.engine.connect( '8008' );
    dash.console.log( 'Connecting to Dash...' );
  }

  return <button className="connect" onClick={ connectToDash }>Connect to Dash</button>;
} );

module.exports = dash;
