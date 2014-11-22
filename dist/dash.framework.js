!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.dash=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var dash = require( '../main' );

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

dash.layout.registerElement( 'DashConsole', function() {
  return React.createElement(DashConsole, {class: "console"});
}, function( element ) {
  dash.console = element;
} );

module.exports = DashConsole;

},{"../main":4}],2:[function(require,module,exports){
var dash = require( '../main' );

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

dash.layout.registerElement( 'ObjectBrowser', function() {
  return React.createElement(DashObjects, {data: [  ] });
}, function( element ) {
  dash.panels.objectBrowser = element;
} );

module.exports = DashObjects;

},{"../main":4}],3:[function(require,module,exports){
var dash = require( '../main' );

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

dash.layout.registerElement( 'Properties', function() {
  return React.createElement(DashProperties, {data: [] });
}, function( element ) {
  dash.panels.propertyEditor = element;
} );

module.exports = DashProperties;

},{"../main":4}],4:[function(require,module,exports){
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

  return React.createElement("button", {className: "connect", onClick: connectToDash }, "Connect to Dash");
} );

module.exports = dash;

},{}]},{},[1,2,3])(3)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NvdXJjZS9qcy9yZWFjdC1lbGVtZW50cy9jb25zb2xlLmpzeCIsIi4vc291cmNlL2pzL3JlYWN0LWVsZW1lbnRzL29iamVjdC1icm93c2VyLmpzeCIsIi4vc291cmNlL2pzL3JlYWN0LWVsZW1lbnRzL3Byb3BlcnRpZXMuanN4IiwiL1VzZXJzL0NvbGRlbi9EZXZlbG9wL0NpcmN1bGFyL2Rhc2gvanMvc291cmNlL2pzL21haW4uanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGRhc2ggPSByZXF1aXJlKCAnLi4vbWFpbicgKTtcblxudmFyIERhc2hDb25zb2xlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hDb25zb2xlTGlzdCcsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvZ0l0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6ICBpdGVtLmlkfSwgaXRlbS5tc2cpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCB0aGlzLnByb3BzLml0ZW1zLm1hcChsb2dJdGVtKSlcbiAgICApO1xuICB9XG59KTtcbnZhciBEYXNoQ29uc29sZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hDb25zb2xlJyxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge2l0ZW1zOiBbXSwga2V5Q291bnQ6IDB9O1xuICB9LFxuICBsb2c6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgbmV4dEl0ZW1zO1xuICAgIHZhciBrZXkgPSB0aGlzLnN0YXRlLmtleUNvdW50LnZhbHVlO1xuICAgIGlmKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgbmV4dEl0ZW1zID0gdGhpcy5zdGF0ZS5pdGVtcy5jb25jYXQoW3ttc2c6IGl0ZW0sIGlkOiBrZXl9XSk7XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGl0ZW0uaWQgPSBrZXk7XG4gICAgICBuZXh0SXRlbXMgPSB0aGlzLnN0YXRlLml0ZW1zLmNvbmNhdChbaXRlbV0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe2l0ZW1zOiBuZXh0SXRlbXMsIGtleUNvdW50OiBrZXkrK30pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERhc2hDb25zb2xlTGlzdCwge2l0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zfSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuZGFzaC5sYXlvdXQucmVnaXN0ZXJFbGVtZW50KCAnRGFzaENvbnNvbGUnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaENvbnNvbGUsIHtjbGFzczogXCJjb25zb2xlXCJ9KTtcbn0sIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuICBkYXNoLmNvbnNvbGUgPSBlbGVtZW50O1xufSApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhc2hDb25zb2xlO1xuIiwidmFyIGRhc2ggPSByZXF1aXJlKCAnLi4vbWFpbicgKTtcblxudmFyIERhc2hPYmplY3RzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRGFzaE9iamVjdHMnLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBkYXRhOiBbXSB9O1xuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24oIGkgKSB7XG4gICAgICBkYXNoLnBhbmVscy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wcyggeyBkYXRhOiBkYXNoLnNjZW5lWyBpIF0uQ29tcG9uZW50cyB9ICk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLm1hcCggZnVuY3Rpb24oIG5vZGUsIGkgKSB7XG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgIHZhciBsYWJlbCA9IG5ldyBSZWFjdC5ET00uc3Bhbih7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdub2RlJyxcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKCkgeyBzZWxmLm9uQ2xpY2soIGkgKTsgfVxuICAgICAgICAgIH0sIG5vZGUuTmFtZSApO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVWaWV3LCB7a2V5OiAgbm9kZS5OYW1lICsgJ3wnICsgaSwgbm9kZUxhYmVsOiBsYWJlbCwgZGVmYXVsdENvbGxhcHNlZDogdHJ1ZSB9LCBcbiAgICAgICAgICAgICAgIG5vZGUuQ2hpbGRyZW4ubWFwKCBmdW5jdGlvbiggY2hpbGQsIGogKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZVZpZXcsIHtub2RlTGFiZWw6IGxhYmVsLCBrZXk6ICBjaGlsZC5UeXBlICsgJ3wnICsgaiwgZGVmYXVsdENvbGxhcHNlZDogZmFsc2UgfSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJpbmZvXCJ9LCAgY2hpbGQuVHlwZSlcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KSBcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9LCB0aGlzKSBcbiAgICAgIClcbiAgICApO1xuICB9XG59ICk7XG5cbmRhc2gubGF5b3V0LnJlZ2lzdGVyRWxlbWVudCggJ09iamVjdEJyb3dzZXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaE9iamVjdHMsIHtkYXRhOiBbICBdIH0pO1xufSwgZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG4gIGRhc2gucGFuZWxzLm9iamVjdEJyb3dzZXIgPSBlbGVtZW50O1xufSApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhc2hPYmplY3RzO1xuIiwidmFyIGRhc2ggPSByZXF1aXJlKCAnLi4vbWFpbicgKTtcblxudmFyIERhc2hQcm9wZXJ0aWVzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRGFzaFByb3BlcnRpZXMnLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBkYXRhOiBbXSB9O1xuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24oIGkgKSB7XG4gICAgICAvL2Rhc2hTZWxlY3RlZFByb3BlcnRpZXMuc2V0UHJvcHMoIHsgZGF0YTogZGFzaE9iamVjdERhdGFbIGkgXSB9ICk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLm1hcCggZnVuY3Rpb24oIG5vZGUsIGkgKSB7XG4gICAgICAgICAgdmFyIGxhYmVsID0gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJub2RlXCJ9LCAgbm9kZS5UeXBlKTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlVmlldywge2tleTogIG5vZGUuVHlwZSArICd8JyArIGksIG5vZGVMYWJlbDogbGFiZWwsIGRlZmF1bHRDb2xsYXBzZWQ6IGZhbHNlIH0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBcIk5hbWU6IFwiLCAgbm9kZS5Bc3NldClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9LCB0aGlzKSBcbiAgICAgIClcbiAgICApO1xuICB9XG59ICk7XG5cbmRhc2gubGF5b3V0LnJlZ2lzdGVyRWxlbWVudCggJ1Byb3BlcnRpZXMnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaFByb3BlcnRpZXMsIHtkYXRhOiBbXSB9KTtcbn0sIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuICBkYXNoLnBhbmVscy5wcm9wZXJ0eUVkaXRvciA9IGVsZW1lbnQ7XG59ICk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGFzaFByb3BlcnRpZXM7XG4iLCJ2YXIgY29uZmlnID0ge1xuICBjb250ZW50OiBbe1xuICAgIHR5cGU6ICdyb3cnLFxuICAgIGNvbnRlbnQ6IFt7XG4gICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgd2lkdGg6IDE1LFxuICAgICAgY29udGVudDogW3tcbiAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXG4gICAgICAgIGNvbXBvbmVudE5hbWU6ICdPYmplY3RCcm93c2VyJyxcbiAgICAgICAgdGl0bGU6ICdPYmplY3QgQnJvd3NlcidcbiAgICAgIH1dXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY29sdW1uJyxcbiAgICAgIHdpZHRoOiA3MCxcbiAgICAgIGNvbnRlbnQ6IFt7XG4gICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxuICAgICAgICBjb21wb25lbnROYW1lOiAnRGFzaENvbm5lY3QnLFxuICAgICAgICB0aXRsZTogJ0Nvbm5lY3QgdG8gRGFzaCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxuICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICB0aXRsZTogJ0NvbnNvbGUnLFxuICAgICAgICBjb21wb25lbnROYW1lOiAnRGFzaENvbnNvbGUnXG4gICAgICB9XVxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ3JvdycsXG4gICAgICBjb250ZW50OiBbe1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICB3aWR0aDogMTUsXG4gICAgICAgIGNvbnRlbnQ6IFt7XG4gICAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXG4gICAgICAgICAgY29tcG9uZW50TmFtZTogJ1Byb3BlcnRpZXMnLFxuICAgICAgICAgIHRpdGxlOiAnUHJvcGVydGllcydcbiAgICAgICAgfV1cbiAgICAgIH1dXG4gICAgfV1cbiAgfV1cbn07XG5cbnZhciBkYXNoID0ge1xuICBlbmdpbmU6IG5ldyBEYXNoQ29ubmVjdG9yKCksXG4gIHNjZW5lOiBbIF0sXG4gIHBhbmVsczoge1xuICAgIG9iamVjdEJyb3dzZXI6IHsgfSxcbiAgICBwcm9wZXJ0aWVzRWRpdG9yOiB7IH1cbiAgfSxcbiAgY29uc29sZTogeyB9LFxuICBsYXlvdXQ6IHtcbiAgICBnb2xkZW46IG5ldyBHb2xkZW5MYXlvdXQoIGNvbmZpZyApLFxuICAgIHJlZ2lzdGVyRWxlbWVudDogcmVnaXN0ZXJFbGVtZW50XG4gIH1cbn07XG5cbmRhc2gubGF5b3V0LmdvbGRlbi5pbml0KCk7XG5cbmRhc2guZW5naW5lLnJlZ2lzdGVyUmVjZWl2ZUhhbmRsZXIoXCJkYXNoOmxvZ2dlcjptZXNzYWdlXCIsIGZ1bmN0aW9uKGRhdGEpXG57XG4gIGRhc2guY29uc29sZS5sb2coZGF0YSk7XG59KTtcblxuLy8gdGhpcyBmdW5jdGlvbiBpcyBlbXB0eSB1bnRpbCB3ZSBhZGQgYSBwcm9wZXIgZ3JhcGggZm9yIEZQUyBkYXRhXG4vLyB0aGUgZW1wdHkgZnVuY3Rpb24gc3RvcHMgYW4gZXJyb3IgZnJvbSBiZWluZyB0aHJvd24gaW4gdGhlIGNvbnNvbGVcbmRhc2guZW5naW5lLnJlZ2lzdGVyUmVjZWl2ZUhhbmRsZXIoXCJkYXNoOnBlcmY6ZnJhbWV0aW1lXCIsIGZ1bmN0aW9uKGRhdGEpXG57XG5cbn0pO1xuXG5kYXNoLmVuZ2luZS5vbkNvbm5lY3QgPSBmdW5jdGlvbigpXG57XG4gIGRhc2guY29uc29sZS5sb2coICdDb25uZWN0ZWQgdG8gRGFzaC4nICk7XG4gIGRhc2guZW5naW5lLmdldE9iamVjdHMoIGZ1bmN0aW9uKCBkYXRhICkge1xuICAgIGRhc2guc2NlbmUgPSBkYXRhO1xuICAgIGRhc2gucGFuZWxzLm9iamVjdEJyb3dzZXIuc2V0UHJvcHMoIHsgZGF0YTogZGFzaC5zY2VuZSB9ICk7XG4gIH0gKTtcbn07XG5cbi8vcmVnaXN0ZXJFbGVtZW50KCAnTXllbGVtZW50JywgZnVuY3Rpb24oKSB7IHJldHVybiA8RGFzaFByb3BlcnRpZXMgZGF0YT17IFtdIH0gLz47IH0gKTtcbmZ1bmN0aW9uIHJlZ2lzdGVyRWxlbWVudCggbmFtZSwgZWxlbWVudENiLCBzdG9yZUVsZW1lbnRDYiApXG57XG4gIGRhc2gubGF5b3V0LmdvbGRlbi5yZWdpc3RlckNvbXBvbmVudCggbmFtZSwgZnVuY3Rpb24oIGNvbnRhaW5lciwgc3RhdGUgKVxuICB7XG4gICAgdmFyIHJlc3VsdCA9IFJlYWN0LnJlbmRlcihcbiAgICAgIGVsZW1lbnRDYigpLFxuICAgICAgY29udGFpbmVyLmdldEVsZW1lbnQoKVswXVxuICAgICk7XG5cbiAgICBpZiggc3RvcmVFbGVtZW50Q2IgKVxuICAgICAgc3RvcmVFbGVtZW50Q2IoIHJlc3VsdCApO1xuXG4gICAgcmVzdWx0LnNldFN0YXRlKCBzdGF0ZSApO1xuICB9KTtcbn1cblxuZGFzaC5sYXlvdXQucmVnaXN0ZXJFbGVtZW50KCAnRGFzaENvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gY29ubmVjdFRvRGFzaCgpIHtcbiAgICBkYXNoLmVuZ2luZS5jb25uZWN0KCAnODAwOCcgKTtcbiAgICBkYXNoLmNvbnNvbGUubG9nKCAnQ29ubmVjdGluZyB0byBEYXNoLi4uJyApO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge2NsYXNzTmFtZTogXCJjb25uZWN0XCIsIG9uQ2xpY2s6IGNvbm5lY3RUb0Rhc2ggfSwgXCJDb25uZWN0IHRvIERhc2hcIik7XG59ICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGFzaDtcbiJdfQ==
