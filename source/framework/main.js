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
        componentName: 'example-react'
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

dash.onConnect = function() {
  console.log( 'Connected to Dash.' );
  dash.getObjects( function( data ) {
    dashObjectData = data;
    dashObjectList.setProps( { data: dashObjectData } );
  } )
}

myLayout.registerComponent( 'testComponent', function( container, state ){
  container.getElement().html( '<button onClick="connectToDash();">Connect to Dash</button>' );
});

myLayout.registerComponent( 'object-browser', function( container, state ){
  dashObjectList = React.renderComponent(
    <Lists data={ dashObjectData } />,
    container.getElement()[0]
  );
});

connectToDash = function() {
  dash.connect( '8008' );
  console.log( 'Connecting to Dash...' );
}

myLayout.registerComponent( 'example-react', function( container, state ){
  container.getElement()[0].style.overflow = 'auto';
  //setInterval(function() { container.getElement().html( container.getElement().html() + '<span>This is a console window.</span><br />' ) }, 5000);
});

myLayout.init();
