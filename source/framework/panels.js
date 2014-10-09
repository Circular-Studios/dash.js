/** @jsx React.DOM */
var config = {
  content: [{
    type: 'row',
    content: [
    	{
        type:'component',
        componentName: 'example',
        componentState: { text: 'Component 1' }
    	},
      {
        type:'component',
        componentName: 'example',
        componentState: { text: 'Component 2' }
    	},
      {
        type:'component',
        componentName: 'example-react',
        componentState: { text: 'Component 3' }
    	}
  	]
  }]
};

var myLayout = new GoldenLayout( config );

myLayout.registerComponent( 'example', function( container, state ){
  container.getElement().html( '<h2>' + state.text + '</h2>');
});

myLayout.registerComponent( 'example-react', function( container, state ){
  console.log(container.getElement()[0]);
  React.renderComponent(<Timer />, container.getElement()[0]);
});

myLayout.init();
