(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  return React.createElement("button", {className: "connect", onClick: connectToDash }, "Connect to Dash");
} );
registerElement( 'ObjectBrowser', function() {
  return React.createElement(DashObjects, {data: [  ] });
}, function( element ) {
  dash.panels.objectBrowser = element;
} );
registerElement( 'Properties', function() {
  return React.createElement(DashProperties, {data: [] });
}, function( element ) {
  dash.panels.propertyEditor = element;
} );
registerElement( 'DashConsole', function() {
  return React.createElement(DashConsole, {class: "console"});
}, function( element ) {
  dash.console = element;
} );

dash.layout.init();

},{"./react-elements/console":2,"./react-elements/object-browser":3,"./react-elements/properties":4}],2:[function(require,module,exports){
var DashConsoleList = React.createClass({displayName: 'DashConsoleList',
  render: function() {
    var logItem = function(item) {
      return React.createElement("li", {key:  item.id}, item.msg);
    };
    return (
      React.createElement("ul", null, this.props.items.map(logItem))
    );
  }
});
var DashConsole = React.createClass({displayName: 'DashConsole',
  getInitialState: function() {
    return {items: [], keyCount: 0};
  },
  log: function(item) {
    var nextItems;
    var key = this.state.keyCount.value;
    if(typeof item === "string")
      nextItems = this.state.items.concat([{msg: item, id: key}]);
    else
    {
      item.id = key;
      nextItems = this.state.items.concat([item]);
    }

    this.setState({items: nextItems, keyCount: key++});
  },
  render: function() {
    return (
      React.createElement("div", null,
        React.createElement(DashConsoleList, {items: this.state.items})
      )
    );
  }
});

module.exports = DashConsole;

},{}],3:[function(require,module,exports){
var DashObjects = React.createClass({displayName: 'DashObjects',
    getInitialState: function() {
      return { data: [] };
    },
    onClick: function( i ) {
      dash.panels.propertyEditor.setProps( { data: dash.scene[ i ].Components } );
    },
    render: function() {
    return (
      React.createElement("div", null,
         this.props.data.map( function( node, i ) {
          var self = this;
          var label = new React.DOM.span({
            className: 'node',
            onClick: function() { self.onClick( i ); }
          }, node.Name );
          return (
            React.createElement(TreeView, {key:  node.Name + '|' + i, nodeLabel: label, defaultCollapsed: true },
               node.Children.map( function( child, j ) {
                return (
                  React.createElement(TreeView, {nodeLabel: label, key:  child.Type + '|' + j, defaultCollapsed: false },
                    React.createElement("div", {className: "info"},  child.Type)
                  )
                );
              })
            )
          );
        }, this)
      )
    );
  }
} );

module.exports = DashObjects;

},{}],4:[function(require,module,exports){
var DashProperties = React.createClass({displayName: 'DashProperties',
    getInitialState: function() {
      return { data: [] };
    },
    onClick: function( i ) {
      //dashSelectedProperties.setProps( { data: dashObjectData[ i ] } );
    },
    render: function() {
    return (
      React.createElement("div", null,
         this.props.data.map( function( node, i ) {
          var label = React.createElement("span", {className: "node"},  node.Type);
          return (
            React.createElement(TreeView, {key:  node.Type + '|' + i, nodeLabel: label, defaultCollapsed: false },
              React.createElement("span", null, "Name: ",  node.Asset)
            )
          );
        }, this)
      )
    );
  }
} );

module.exports = DashProperties;

},{}]},{},[1,2,3,4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxkZXZcXGNpcmN1bGFyXFxkYXNoXFxqc1xcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCIuL3NvdXJjZS9qcy9tYWluLmpzeCIsIi4vc291cmNlL2pzL3JlYWN0LWVsZW1lbnRzL2NvbnNvbGUuanN4IiwiLi9zb3VyY2UvanMvcmVhY3QtZWxlbWVudHMvb2JqZWN0LWJyb3dzZXIuanN4IiwiLi9zb3VyY2UvanMvcmVhY3QtZWxlbWVudHMvcHJvcGVydGllcy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBEYXNoQ29uc29sZSAgICAgPSByZXF1aXJlKCAnLi9yZWFjdC1lbGVtZW50cy9jb25zb2xlJyApLFxyXG4gICAgRGFzaE9iamVjdHMgICAgID0gcmVxdWlyZSggJy4vcmVhY3QtZWxlbWVudHMvb2JqZWN0LWJyb3dzZXInICksXHJcbiAgICBEYXNoUHJvcGVydGllcyAgPSByZXF1aXJlKCAnLi9yZWFjdC1lbGVtZW50cy9wcm9wZXJ0aWVzJyApO1xyXG5cclxudmFyIGNvbmZpZyA9IHtcclxuICBjb250ZW50OiBbe1xyXG4gICAgdHlwZTogJ3JvdycsXHJcbiAgICBjb250ZW50OiBbe1xyXG4gICAgICB0eXBlOiAnc3RhY2snLFxyXG4gICAgICB3aWR0aDogMTUsXHJcbiAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXHJcbiAgICAgICAgY29tcG9uZW50TmFtZTogJ09iamVjdEJyb3dzZXInLFxyXG4gICAgICAgIHRpdGxlOiAnT2JqZWN0IEJyb3dzZXInXHJcbiAgICAgIH1dXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICB0eXBlOiAnY29sdW1uJyxcclxuICAgICAgd2lkdGg6IDcwLFxyXG4gICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxyXG4gICAgICAgIGNvbXBvbmVudE5hbWU6ICdEYXNoQ29ubmVjdCcsXHJcbiAgICAgICAgdGl0bGU6ICdDb25uZWN0IHRvIERhc2gnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnY29tcG9uZW50JyxcclxuICAgICAgICBoZWlnaHQ6IDIwLFxyXG4gICAgICAgIHRpdGxlOiAnQ29uc29sZScsXHJcbiAgICAgICAgY29tcG9uZW50TmFtZTogJ0Rhc2hDb25zb2xlJ1xyXG4gICAgICB9XVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdHlwZTogJ3JvdycsXHJcbiAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgdHlwZTogJ3N0YWNrJyxcclxuICAgICAgICB3aWR0aDogMTUsXHJcbiAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxyXG4gICAgICAgICAgY29tcG9uZW50TmFtZTogJ1Byb3BlcnRpZXMnLFxyXG4gICAgICAgICAgdGl0bGU6ICdQcm9wZXJ0aWVzJ1xyXG4gICAgICAgIH1dXHJcbiAgICAgIH1dXHJcbiAgICB9XVxyXG4gIH1dXHJcbn07XHJcblxyXG5kYXNoID0gbW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZW5naW5lOiBuZXcgRGFzaCgpLFxyXG4gIHNjZW5lOiBbXSxcclxuICBwYW5lbHM6IHtcclxuICAgIG9iamVjdEJyb3dzZXI6IHsgfSxcclxuICAgIHByb3BlcnRpZXNFZGl0b3I6IHsgfVxyXG4gIH0sXHJcbiAgY29uc29sZTogeyB9LFxyXG4gIGxheW91dDogbmV3IEdvbGRlbkxheW91dCggY29uZmlnIClcclxufTtcclxuXHJcbmRhc2guZW5naW5lLnJlZ2lzdGVyUmVjZWl2ZUhhbmRsZXIoXCJkYXNoOmxvZ2dlcjptZXNzYWdlXCIsIGZ1bmN0aW9uKGRhdGEpXHJcbntcclxuICBkYXNoLmNvbnNvbGUubG9nKGRhdGEpO1xyXG59KTtcclxuXHJcbi8vIHRoaXMgZnVuY3Rpb24gaXMgZW1wdHkgdW50aWwgd2UgYWRkIGEgcHJvcGVyIGdyYXBoIGZvciBGUFMgZGF0YVxyXG4vLyB0aGUgZW1wdHkgZnVuY3Rpb24gc3RvcHMgYW4gZXJyb3IgZnJvbSBiZWluZyB0aHJvd24gaW4gdGhlIGNvbnNvbGVcclxuZGFzaC5lbmdpbmUucmVnaXN0ZXJSZWNlaXZlSGFuZGxlcihcImRhc2g6cGVyZjpmcmFtZXRpbWVcIiwgZnVuY3Rpb24oZGF0YSlcclxue1xyXG5cclxufSk7XHJcblxyXG5kYXNoLmVuZ2luZS5vbkNvbm5lY3QgPSBmdW5jdGlvbigpXHJcbntcclxuICBkYXNoLmNvbnNvbGUubG9nKCAnQ29ubmVjdGVkIHRvIERhc2guJyApO1xyXG4gIGRhc2guZW5naW5lLmdldE9iamVjdHMoIGZ1bmN0aW9uKCBkYXRhICkge1xyXG4gICAgZGFzaC5zY2VuZSA9IGRhdGE7XHJcbiAgICBkYXNoLnBhbmVscy5vYmplY3RCcm93c2VyLnNldFByb3BzKCB7IGRhdGE6IGRhc2guc2NlbmUgfSApO1xyXG4gIH0gKTtcclxufTtcclxuXHJcbi8vcmVnaXN0ZXJFbGVtZW50KCAnTXllbGVtZW50JywgZnVuY3Rpb24oKSB7IHJldHVybiA8RGFzaFByb3BlcnRpZXMgZGF0YT17IFtdIH0gLz47IH0gKTtcclxuZnVuY3Rpb24gcmVnaXN0ZXJFbGVtZW50KCBuYW1lLCBlbGVtZW50Q2IsIHN0b3JlRWxlbWVudENiIClcclxue1xyXG4gIGRhc2gubGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50KCBuYW1lLCBmdW5jdGlvbiggY29udGFpbmVyLCBzdGF0ZSApXHJcbiAge1xyXG4gICAgdmFyIHJlc3VsdCA9IFJlYWN0LnJlbmRlcihcclxuICAgICAgZWxlbWVudENiKCksXHJcbiAgICAgIGNvbnRhaW5lci5nZXRFbGVtZW50KClbMF1cclxuICAgICk7XHJcblxyXG4gICAgaWYoIHN0b3JlRWxlbWVudENiIClcclxuICAgICAgc3RvcmVFbGVtZW50Q2IoIHJlc3VsdCApO1xyXG5cclxuICAgIC8vVE9ETzogTWFrZSBHTCBzdGF0ZSBhY2Nlc3NpYmxlIGZyb20gcmVhY3RcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmNvbm5lY3RUb0Rhc2ggPSBmdW5jdGlvbigpXHJcbntcclxuICBkYXNoLmVuZ2luZS5jb25uZWN0KCAnODAwOCcgKTtcclxuICBkYXNoLmNvbnNvbGUubG9nKCAnQ29ubmVjdGluZyB0byBEYXNoLi4uJyApO1xyXG59O1xyXG5cclxucmVnaXN0ZXJFbGVtZW50KCAnRGFzaENvbm5lY3QnLCBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7Y2xhc3NOYW1lOiBcImNvbm5lY3RcIiwgb25DbGljazogY29ubmVjdFRvRGFzaCB9LCBcIkNvbm5lY3QgdG8gRGFzaFwiKTtcclxufSApO1xyXG5yZWdpc3RlckVsZW1lbnQoICdPYmplY3RCcm93c2VyJywgZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaE9iamVjdHMsIHtkYXRhOiBbICBdIH0pO1xyXG59LCBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuICBkYXNoLnBhbmVscy5vYmplY3RCcm93c2VyID0gZWxlbWVudDtcclxufSApO1xyXG5yZWdpc3RlckVsZW1lbnQoICdQcm9wZXJ0aWVzJywgZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaFByb3BlcnRpZXMsIHtkYXRhOiBbXSB9KTtcclxufSwgZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcbiAgZGFzaC5wYW5lbHMucHJvcGVydHlFZGl0b3IgPSBlbGVtZW50O1xyXG59ICk7XHJcbnJlZ2lzdGVyRWxlbWVudCggJ0Rhc2hDb25zb2xlJywgZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaENvbnNvbGUsIHtjbGFzczogXCJjb25zb2xlXCJ9KTtcclxufSwgZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcbiAgZGFzaC5jb25zb2xlID0gZWxlbWVudDtcclxufSApO1xyXG5cclxuZGFzaC5sYXlvdXQuaW5pdCgpO1xyXG4iLCJ2YXIgRGFzaENvbnNvbGVMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRGFzaENvbnNvbGVMaXN0JyxcclxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGxvZ0l0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2tleTogIGl0ZW0uaWR9LCBpdGVtLm1zZyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIG51bGwsIHRoaXMucHJvcHMuaXRlbXMubWFwKGxvZ0l0ZW0pKVxyXG4gICAgKTtcclxuICB9XHJcbn0pO1xyXG52YXIgRGFzaENvbnNvbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdEYXNoQ29uc29sZScsXHJcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7aXRlbXM6IFtdLCBrZXlDb3VudDogMH07XHJcbiAgfSxcclxuICBsb2c6IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgIHZhciBuZXh0SXRlbXM7XHJcbiAgICB2YXIga2V5ID0gdGhpcy5zdGF0ZS5rZXlDb3VudC52YWx1ZTtcclxuICAgIGlmKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiKVxyXG4gICAgICBuZXh0SXRlbXMgPSB0aGlzLnN0YXRlLml0ZW1zLmNvbmNhdChbe21zZzogaXRlbSwgaWQ6IGtleX1dKTtcclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgaXRlbS5pZCA9IGtleTtcclxuICAgICAgbmV4dEl0ZW1zID0gdGhpcy5zdGF0ZS5pdGVtcy5jb25jYXQoW2l0ZW1dKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHtpdGVtczogbmV4dEl0ZW1zLCBrZXlDb3VudDoga2V5Kyt9KTtcclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxyXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaENvbnNvbGVMaXN0LCB7aXRlbXM6IHRoaXMuc3RhdGUuaXRlbXN9KVxyXG4gICAgICApXHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERhc2hDb25zb2xlO1xyXG4iLCJ2YXIgRGFzaE9iamVjdHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdEYXNoT2JqZWN0cycsXHJcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4geyBkYXRhOiBbXSB9O1xyXG4gICAgfSxcclxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKCBpICkge1xyXG4gICAgICBkYXNoLnBhbmVscy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wcyggeyBkYXRhOiBkYXNoLnNjZW5lWyBpIF0uQ29tcG9uZW50cyB9ICk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXHJcbiAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5tYXAoIGZ1bmN0aW9uKCBub2RlLCBpICkge1xyXG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IFJlYWN0LkRPTS5zcGFuKHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbm9kZScsXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKCkgeyBzZWxmLm9uQ2xpY2soIGkgKTsgfVxyXG4gICAgICAgICAgfSwgbm9kZS5OYW1lICk7XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVWaWV3LCB7a2V5OiAgbm9kZS5OYW1lICsgJ3wnICsgaSwgbm9kZUxhYmVsOiBsYWJlbCwgZGVmYXVsdENvbGxhcHNlZDogdHJ1ZSB9LCBcclxuICAgICAgICAgICAgICAgbm9kZS5DaGlsZHJlbi5tYXAoIGZ1bmN0aW9uKCBjaGlsZCwgaiApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZVZpZXcsIHtub2RlTGFiZWw6IGxhYmVsLCBrZXk6ICBjaGlsZC5UeXBlICsgJ3wnICsgaiwgZGVmYXVsdENvbGxhcHNlZDogZmFsc2UgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImluZm9cIn0sICBjaGlsZC5UeXBlKVxyXG4gICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIH0pIFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0sIHRoaXMpIFxyXG4gICAgICApXHJcbiAgICApO1xyXG4gIH1cclxufSApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXNoT2JqZWN0cztcclxuIiwidmFyIERhc2hQcm9wZXJ0aWVzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRGFzaFByb3BlcnRpZXMnLFxyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHsgZGF0YTogW10gfTtcclxuICAgIH0sXHJcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiggaSApIHtcclxuICAgICAgLy9kYXNoU2VsZWN0ZWRQcm9wZXJ0aWVzLnNldFByb3BzKCB7IGRhdGE6IGRhc2hPYmplY3REYXRhWyBpIF0gfSApO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxyXG4gICAgICAgICB0aGlzLnByb3BzLmRhdGEubWFwKCBmdW5jdGlvbiggbm9kZSwgaSApIHtcclxuICAgICAgICAgIHZhciBsYWJlbCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwibm9kZVwifSwgIG5vZGUuVHlwZSk7XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVWaWV3LCB7a2V5OiAgbm9kZS5UeXBlICsgJ3wnICsgaSwgbm9kZUxhYmVsOiBsYWJlbCwgZGVmYXVsdENvbGxhcHNlZDogZmFsc2UgfSwgXHJcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgXCJOYW1lOiBcIiwgIG5vZGUuQXNzZXQpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSwgdGhpcykgXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgfVxyXG59ICk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERhc2hQcm9wZXJ0aWVzO1xyXG4iXX0=
