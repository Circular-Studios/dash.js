var config = {
  content: [{
    type: 'row',
    content: [{
      type: 'stack',
      width: 15,
      content: [{
        type: 'component',
        componentName: 'object-browser',
        title: 'Object Browser'
      }]
    },
    {
      type: 'column',
      width: 70,
      content: [{
        type: 'component',
        componentName: 'dash-connect',
        title: 'Connect to Dash'
      },
      {
        type: 'component',
        height: 20,
        title: 'Console',
        componentName: 'dash-console'
      }]
    },
    {
      type: 'row',
      content: [{
        type: 'stack',
        width: 15,
        content: [{
          type: 'component',
          componentName: 'properties',
          title: 'Properties'
        }]
      }]
    }]
  }]
};

var myLayout = new GoldenLayout( config );
var dash = new Dash();
var dashObjectData = [];
var dashObjectList;
var dashSelectedProperties;
var dashConsole;

dash.registerReceiveHandler("dash:logger:message", function(data)
{
  dashConsole.log(data);
});

// this function is empty until we add a proper graph for FPS data
// the empty function stops an error from being thrown in the console
dash.registerReceiveHandler("dash:perf:frametime", function(data)
{

});

dash.onConnect = function()
{
  dashConsole.log( 'Connected to Dash.' );
  dash.getObjects( function( data ) {
    dashObjectData = data;
    dashObjectList.setProps( { data: dashObjectData } );
  } )
}

myLayout.registerComponent( 'dash-connect', function( container, state )
{
  container.getElement().html( '<button class="connect" onClick="connectToDash();">Connect to Dash</button>' );
});

myLayout.registerComponent( 'object-browser', function( container, state )
{
  dashObjectList = React.render(
    <DashObjects data={ [  ] } />,
    container.getElement()[0]
  );
});

myLayout.registerComponent( 'properties', function( container, state )
{
  dashSelectedProperties = React.render(
    <DashProperties data={ [  ] } />,
    container.getElement()[0]
  );
});

connectToDash = function()
{
  dash.connect( '8008' );
  dashConsole.log( 'Connecting to Dash...' );
}

myLayout.registerComponent( 'dash-console', function( container, state )
{
  container.getElement()[0].style.overflow = 'auto';
  dashConsole = React.render(
    <DashConsole />,
    container.getElement()[0]
  );
});

myLayout.init();
