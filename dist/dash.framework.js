!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.dash=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var dash = require( '../main' );

/*
  Item Fields:
    file: File name of the log origin 
    line: Line number of the log origin
    funcName: Simple function name of the log origin
    prettyFuncName: Expaned function name of the log origin
    moduleName: Module of the log origin
    logLevel: Integer representation of log level
    logLevelLabel: String representation of log level
    timestamp: Time of log
    msg: Message of the log
    type:
      0: String
      1: Dash Log
      2: Dash Exception
    id: Unique react id
*/

var DashConsoleList = React.createClass({displayName: 'DashConsoleList',
  render: function() {
    var logItem = function(item) {
      if(item.type == 0) {
        return (
          React.createElement("div", null, item.msg)
        );
      }
      else if(item.type == 1) {
        return (
          React.createElement(TreeView, {key:  item.id, nodeLabel: item.msg, defaultCollapsed: true}, 
            React.createElement("div", null, "File: ", item.file), 
            React.createElement("div", null, "Line: ", item.line), 
            React.createElement("div", null, "Function Name: ", item.funcName), 
            React.createElement("div", null, "Pretty Function Name: ", item.prettyFuncName), 
            React.createElement("div", null, "Module: ", item.moduleName), 
            React.createElement("div", null, "Log Level: ", item.logLevel), 
            React.createElement("div", null, "Log Level Label: ", item.logLevelLabel), 
            React.createElement("div", null, "Timestamp: ", item.timestamp)
          )
        );
      }
    };
    return (
      React.createElement("div", null, this.props.items.map(logItem))
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
      nextItems = this.state.items.concat([{msg: item, id: key, type: 0}]);
    else
    {
      item.id = key;
      item.type = 1;
      nextItems = this.state.items.concat([item]);
    }

    this.setState({items: nextItems, keyCount: key++});
  },
  render: function() {
    /*var cx = React.addons.classSet;
    var classes = cx({
      'console-item': true
    });*/
    var classname = 'console-item';
    return (
      React.createElement(DashConsoleList, {items: this.state.items, className: classname})
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi9zb3VyY2UvanMvcmVhY3QtZWxlbWVudHMvY29uc29sZS5qc3giLCIuL3NvdXJjZS9qcy9yZWFjdC1lbGVtZW50cy9vYmplY3QtYnJvd3Nlci5qc3giLCIuL3NvdXJjZS9qcy9yZWFjdC1lbGVtZW50cy9wcm9wZXJ0aWVzLmpzeCIsIkM6L1VzZXJzL01BR0lDVXNlci9EZXNrdG9wL0JyYW5kb25MaXR0ZWxsL0Rhc2hqcy9kYXNoLmpzL3NvdXJjZS9qcy9tYWluLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGRhc2ggPSByZXF1aXJlKCAnLi4vbWFpbicgKTtcclxuXHJcbi8qXHJcbiAgSXRlbSBGaWVsZHM6XHJcbiAgICBmaWxlOiBGaWxlIG5hbWUgb2YgdGhlIGxvZyBvcmlnaW4gXHJcbiAgICBsaW5lOiBMaW5lIG51bWJlciBvZiB0aGUgbG9nIG9yaWdpblxyXG4gICAgZnVuY05hbWU6IFNpbXBsZSBmdW5jdGlvbiBuYW1lIG9mIHRoZSBsb2cgb3JpZ2luXHJcbiAgICBwcmV0dHlGdW5jTmFtZTogRXhwYW5lZCBmdW5jdGlvbiBuYW1lIG9mIHRoZSBsb2cgb3JpZ2luXHJcbiAgICBtb2R1bGVOYW1lOiBNb2R1bGUgb2YgdGhlIGxvZyBvcmlnaW5cclxuICAgIGxvZ0xldmVsOiBJbnRlZ2VyIHJlcHJlc2VudGF0aW9uIG9mIGxvZyBsZXZlbFxyXG4gICAgbG9nTGV2ZWxMYWJlbDogU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGxvZyBsZXZlbFxyXG4gICAgdGltZXN0YW1wOiBUaW1lIG9mIGxvZ1xyXG4gICAgbXNnOiBNZXNzYWdlIG9mIHRoZSBsb2dcclxuICAgIHR5cGU6XHJcbiAgICAgIDA6IFN0cmluZ1xyXG4gICAgICAxOiBEYXNoIExvZ1xyXG4gICAgICAyOiBEYXNoIEV4Y2VwdGlvblxyXG4gICAgaWQ6IFVuaXF1ZSByZWFjdCBpZFxyXG4qL1xyXG5cclxudmFyIERhc2hDb25zb2xlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hDb25zb2xlTGlzdCcsXHJcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBsb2dJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICBpZihpdGVtLnR5cGUgPT0gMCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIGl0ZW0ubXNnKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZihpdGVtLnR5cGUgPT0gMSkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVWaWV3LCB7a2V5OiAgaXRlbS5pZCwgbm9kZUxhYmVsOiBpdGVtLm1zZywgZGVmYXVsdENvbGxhcHNlZDogdHJ1ZX0sIFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiRmlsZTogXCIsIGl0ZW0uZmlsZSksIFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiTGluZTogXCIsIGl0ZW0ubGluZSksIFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiRnVuY3Rpb24gTmFtZTogXCIsIGl0ZW0uZnVuY05hbWUpLCBcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcIlByZXR0eSBGdW5jdGlvbiBOYW1lOiBcIiwgaXRlbS5wcmV0dHlGdW5jTmFtZSksIFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiTW9kdWxlOiBcIiwgaXRlbS5tb2R1bGVOYW1lKSwgXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXCJMb2cgTGV2ZWw6IFwiLCBpdGVtLmxvZ0xldmVsKSwgXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXCJMb2cgTGV2ZWwgTGFiZWw6IFwiLCBpdGVtLmxvZ0xldmVsTGFiZWwpLCBcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcIlRpbWVzdGFtcDogXCIsIGl0ZW0udGltZXN0YW1wKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIHRoaXMucHJvcHMuaXRlbXMubWFwKGxvZ0l0ZW0pKVxyXG4gICAgKTtcclxuICB9XHJcbn0pO1xyXG52YXIgRGFzaENvbnNvbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdEYXNoQ29uc29sZScsXHJcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7aXRlbXM6IFtdLCBrZXlDb3VudDogMH07XHJcbiAgfSxcclxuICBsb2c6IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgIHZhciBuZXh0SXRlbXM7XHJcbiAgICB2YXIga2V5ID0gdGhpcy5zdGF0ZS5rZXlDb3VudC52YWx1ZTtcclxuICAgIGlmKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiKVxyXG4gICAgICBuZXh0SXRlbXMgPSB0aGlzLnN0YXRlLml0ZW1zLmNvbmNhdChbe21zZzogaXRlbSwgaWQ6IGtleSwgdHlwZTogMH1dKTtcclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgaXRlbS5pZCA9IGtleTtcclxuICAgICAgaXRlbS50eXBlID0gMTtcclxuICAgICAgbmV4dEl0ZW1zID0gdGhpcy5zdGF0ZS5pdGVtcy5jb25jYXQoW2l0ZW1dKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHtpdGVtczogbmV4dEl0ZW1zLCBrZXlDb3VudDoga2V5Kyt9KTtcclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAvKnZhciBjeCA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldDtcclxuICAgIHZhciBjbGFzc2VzID0gY3goe1xyXG4gICAgICAnY29uc29sZS1pdGVtJzogdHJ1ZVxyXG4gICAgfSk7Ki9cclxuICAgIHZhciBjbGFzc25hbWUgPSAnY29uc29sZS1pdGVtJztcclxuICAgIHJldHVybiAoXHJcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaENvbnNvbGVMaXN0LCB7aXRlbXM6IHRoaXMuc3RhdGUuaXRlbXMsIGNsYXNzTmFtZTogY2xhc3NuYW1lfSlcclxuICAgICk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmRhc2gubGF5b3V0LnJlZ2lzdGVyRWxlbWVudCggJ0Rhc2hDb25zb2xlJywgZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaENvbnNvbGUsIHtjbGFzczogXCJjb25zb2xlXCJ9KTtcclxufSwgZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcbiAgZGFzaC5jb25zb2xlID0gZWxlbWVudDtcclxufSApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXNoQ29uc29sZTtcclxuIiwidmFyIGRhc2ggPSByZXF1aXJlKCAnLi4vbWFpbicgKTtcclxuXHJcbnZhciBEYXNoT2JqZWN0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hPYmplY3RzJyxcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB7IGRhdGE6IFtdIH07XHJcbiAgICB9LFxyXG4gICAgb25DbGljazogZnVuY3Rpb24oIGkgKSB7XHJcbiAgICAgIGRhc2gucGFuZWxzLnByb3BlcnR5RWRpdG9yLnNldFByb3BzKCB7IGRhdGE6IGRhc2guc2NlbmVbIGkgXS5Db21wb25lbnRzIH0gKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcclxuICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLm1hcCggZnVuY3Rpb24oIG5vZGUsIGkgKSB7XHJcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgUmVhY3QuRE9NLnNwYW4oe1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdub2RlJyxcclxuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24oKSB7IHNlbGYub25DbGljayggaSApOyB9XHJcbiAgICAgICAgICB9LCBub2RlLk5hbWUgKTtcclxuICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZVZpZXcsIHtrZXk6ICBub2RlLk5hbWUgKyAnfCcgKyBpLCBub2RlTGFiZWw6IGxhYmVsLCBkZWZhdWx0Q29sbGFwc2VkOiB0cnVlIH0sIFxyXG4gICAgICAgICAgICAgICBub2RlLkNoaWxkcmVuLm1hcCggZnVuY3Rpb24oIGNoaWxkLCBqICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlVmlldywge25vZGVMYWJlbDogbGFiZWwsIGtleTogIGNoaWxkLlR5cGUgKyAnfCcgKyBqLCBkZWZhdWx0Q29sbGFwc2VkOiBmYWxzZSB9LCBcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiaW5mb1wifSwgIGNoaWxkLlR5cGUpXHJcbiAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfSkgXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSwgdGhpcykgXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgfVxyXG59ICk7XHJcblxyXG5kYXNoLmxheW91dC5yZWdpc3RlckVsZW1lbnQoICdPYmplY3RCcm93c2VyJywgZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaE9iamVjdHMsIHtkYXRhOiBbICBdIH0pO1xyXG59LCBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuICBkYXNoLnBhbmVscy5vYmplY3RCcm93c2VyID0gZWxlbWVudDtcclxufSApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXNoT2JqZWN0cztcclxuIiwidmFyIGRhc2ggPSByZXF1aXJlKCAnLi4vbWFpbicgKTtcclxuXHJcbnZhciBEYXNoUHJvcGVydGllcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hQcm9wZXJ0aWVzJyxcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB7IGRhdGE6IFtdIH07XHJcbiAgICB9LFxyXG4gICAgb25DbGljazogZnVuY3Rpb24oIGkgKSB7XHJcbiAgICAgIC8vZGFzaFNlbGVjdGVkUHJvcGVydGllcy5zZXRQcm9wcyggeyBkYXRhOiBkYXNoT2JqZWN0RGF0YVsgaSBdIH0gKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcclxuICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLm1hcCggZnVuY3Rpb24oIG5vZGUsIGkgKSB7XHJcbiAgICAgICAgICB2YXIgbGFiZWwgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcIm5vZGVcIn0sICBub2RlLlR5cGUpO1xyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlVmlldywge2tleTogIG5vZGUuVHlwZSArICd8JyArIGksIG5vZGVMYWJlbDogbGFiZWwsIGRlZmF1bHRDb2xsYXBzZWQ6IGZhbHNlIH0sIFxyXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIFwiTmFtZTogXCIsICBub2RlLkFzc2V0KVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0sIHRoaXMpIFxyXG4gICAgICApXHJcbiAgICApO1xyXG4gIH1cclxufSApO1xyXG5cclxuZGFzaC5sYXlvdXQucmVnaXN0ZXJFbGVtZW50KCAnUHJvcGVydGllcycsIGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KERhc2hQcm9wZXJ0aWVzLCB7ZGF0YTogW10gfSk7XHJcbn0sIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG4gIGRhc2gucGFuZWxzLnByb3BlcnR5RWRpdG9yID0gZWxlbWVudDtcclxufSApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXNoUHJvcGVydGllcztcclxuIiwidmFyIGNvbmZpZyA9IHtcclxuICBjb250ZW50OiBbe1xyXG4gICAgdHlwZTogJ3JvdycsXHJcbiAgICBjb250ZW50OiBbe1xyXG4gICAgICB0eXBlOiAnc3RhY2snLFxyXG4gICAgICB3aWR0aDogMTUsXHJcbiAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXHJcbiAgICAgICAgY29tcG9uZW50TmFtZTogJ09iamVjdEJyb3dzZXInLFxyXG4gICAgICAgIHRpdGxlOiAnT2JqZWN0IEJyb3dzZXInXHJcbiAgICAgIH1dXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICB0eXBlOiAnY29sdW1uJyxcclxuICAgICAgd2lkdGg6IDcwLFxyXG4gICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxyXG4gICAgICAgIGNvbXBvbmVudE5hbWU6ICdEYXNoQ29ubmVjdCcsXHJcbiAgICAgICAgdGl0bGU6ICdDb25uZWN0IHRvIERhc2gnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnY29tcG9uZW50JyxcclxuICAgICAgICBoZWlnaHQ6IDIwLFxyXG4gICAgICAgIHRpdGxlOiAnQ29uc29sZScsXHJcbiAgICAgICAgY29tcG9uZW50TmFtZTogJ0Rhc2hDb25zb2xlJ1xyXG4gICAgICB9XVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdHlwZTogJ3JvdycsXHJcbiAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgdHlwZTogJ3N0YWNrJyxcclxuICAgICAgICB3aWR0aDogMTUsXHJcbiAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxyXG4gICAgICAgICAgY29tcG9uZW50TmFtZTogJ1Byb3BlcnRpZXMnLFxyXG4gICAgICAgICAgdGl0bGU6ICdQcm9wZXJ0aWVzJ1xyXG4gICAgICAgIH1dXHJcbiAgICAgIH1dXHJcbiAgICB9XVxyXG4gIH1dXHJcbn07XHJcblxyXG52YXIgZGFzaCA9IHtcclxuICBlbmdpbmU6IG5ldyBEYXNoQ29ubmVjdG9yKCksXHJcbiAgc2NlbmU6IFsgXSxcclxuICBwYW5lbHM6IHtcclxuICAgIG9iamVjdEJyb3dzZXI6IHsgfSxcclxuICAgIHByb3BlcnRpZXNFZGl0b3I6IHsgfVxyXG4gIH0sXHJcbiAgY29uc29sZTogeyB9LFxyXG4gIGxheW91dDoge1xyXG4gICAgZ29sZGVuOiBuZXcgR29sZGVuTGF5b3V0KCBjb25maWcgKSxcclxuICAgIHJlZ2lzdGVyRWxlbWVudDogcmVnaXN0ZXJFbGVtZW50XHJcbiAgfVxyXG59O1xyXG5cclxuZGFzaC5sYXlvdXQuZ29sZGVuLmluaXQoKTtcclxuXHJcbmRhc2guZW5naW5lLnJlZ2lzdGVyUmVjZWl2ZUhhbmRsZXIoXCJkYXNoOmxvZ2dlcjptZXNzYWdlXCIsIGZ1bmN0aW9uKGRhdGEpXHJcbntcclxuICBkYXNoLmNvbnNvbGUubG9nKGRhdGEpO1xyXG59KTtcclxuXHJcbi8vIHRoaXMgZnVuY3Rpb24gaXMgZW1wdHkgdW50aWwgd2UgYWRkIGEgcHJvcGVyIGdyYXBoIGZvciBGUFMgZGF0YVxyXG4vLyB0aGUgZW1wdHkgZnVuY3Rpb24gc3RvcHMgYW4gZXJyb3IgZnJvbSBiZWluZyB0aHJvd24gaW4gdGhlIGNvbnNvbGVcclxuZGFzaC5lbmdpbmUucmVnaXN0ZXJSZWNlaXZlSGFuZGxlcihcImRhc2g6cGVyZjpmcmFtZXRpbWVcIiwgZnVuY3Rpb24oZGF0YSlcclxue1xyXG5cclxufSk7XHJcblxyXG5kYXNoLmVuZ2luZS5vbkNvbm5lY3QgPSBmdW5jdGlvbigpXHJcbntcclxuICBkYXNoLmNvbnNvbGUubG9nKCAnQ29ubmVjdGVkIHRvIERhc2guJyApO1xyXG4gIGRhc2guZW5naW5lLmdldE9iamVjdHMoIGZ1bmN0aW9uKCBkYXRhICkge1xyXG4gICAgZGFzaC5zY2VuZSA9IGRhdGE7XHJcbiAgICBkYXNoLnBhbmVscy5vYmplY3RCcm93c2VyLnNldFByb3BzKCB7IGRhdGE6IGRhc2guc2NlbmUgfSApO1xyXG4gIH0gKTtcclxufTtcclxuXHJcbi8vcmVnaXN0ZXJFbGVtZW50KCAnTXllbGVtZW50JywgZnVuY3Rpb24oKSB7IHJldHVybiA8RGFzaFByb3BlcnRpZXMgZGF0YT17IFtdIH0gLz47IH0gKTtcclxuZnVuY3Rpb24gcmVnaXN0ZXJFbGVtZW50KCBuYW1lLCBlbGVtZW50Q2IsIHN0b3JlRWxlbWVudENiIClcclxue1xyXG4gIGRhc2gubGF5b3V0LmdvbGRlbi5yZWdpc3RlckNvbXBvbmVudCggbmFtZSwgZnVuY3Rpb24oIGNvbnRhaW5lciwgc3RhdGUgKVxyXG4gIHtcclxuICAgIHZhciByZXN1bHQgPSBSZWFjdC5yZW5kZXIoXHJcbiAgICAgIGVsZW1lbnRDYigpLFxyXG4gICAgICBjb250YWluZXIuZ2V0RWxlbWVudCgpWzBdXHJcbiAgICApO1xyXG5cclxuICAgIGlmKCBzdG9yZUVsZW1lbnRDYiApXHJcbiAgICAgIHN0b3JlRWxlbWVudENiKCByZXN1bHQgKTtcclxuXHJcbiAgICByZXN1bHQuc2V0U3RhdGUoIHN0YXRlICk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmRhc2gubGF5b3V0LnJlZ2lzdGVyRWxlbWVudCggJ0Rhc2hDb25uZWN0JywgZnVuY3Rpb24oKSB7XHJcbiAgZnVuY3Rpb24gY29ubmVjdFRvRGFzaCgpIHtcclxuICAgIGRhc2guZW5naW5lLmNvbm5lY3QoICc4MDA4JyApO1xyXG4gICAgZGFzaC5jb25zb2xlLmxvZyggJ0Nvbm5lY3RpbmcgdG8gRGFzaC4uLicgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHtjbGFzc05hbWU6IFwiY29ubmVjdFwiLCBvbkNsaWNrOiBjb25uZWN0VG9EYXNoIH0sIFwiQ29ubmVjdCB0byBEYXNoXCIpO1xyXG59ICk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhc2g7XHJcbiJdfQ==
