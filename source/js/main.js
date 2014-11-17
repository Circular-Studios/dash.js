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
        componentName: 'testComponent',
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
          componentName: 'object-browser',
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
var dashConsole;

dash.registerReceiveHandler("dash:logger:message", function(data) {
  dashConsole.log(data);
});

dash.onConnect = function() {
  dashConsole.log( 'Connected to Dash.' );
  dash.getObjects( function( data ) {
    dashObjectData = data;
    dashObjectList.setProps( { data: dashObjectData } );
  } )
}

myLayout.registerComponent( 'testComponent', function( container, state ){
  container.getElement().html( '<button class="connect" onClick="connectToDash();">Connect to Dash</button>' );
});

myLayout.registerComponent( 'object-browser', function( container, state ){
  dashObjectList = React.render(
    <Lists data={ dashObjectData } />,
    container.getElement()[0]
  );
});

connectToDash = function() {
  dash.connect( '8008' );
  dashConsole.log( 'Connecting to Dash...' );
}

myLayout.registerComponent( 'dash-console', function( container, state ){
  container.getElement()[0].style.overflow = 'auto';
  dashConsole = React.render(
    <DashConsole />,
    container.getElement()[0]
  );
});

myLayout.init();
