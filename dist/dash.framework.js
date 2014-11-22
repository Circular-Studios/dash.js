(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  engine: new Dash(),
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

    //TODO: Make GL state accessible from react
    console.log( state );
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

},{}],2:[function(require,module,exports){
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

},{"../main":1}],3:[function(require,module,exports){
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

},{"../main":1}],4:[function(require,module,exports){
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

},{"../main":1}]},{},[1,2,3,4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NvdXJjZS9qcy9tYWluLmpzeCIsIi4vc291cmNlL2pzL3JlYWN0LWVsZW1lbnRzL2NvbnNvbGUuanN4IiwiLi9zb3VyY2UvanMvcmVhY3QtZWxlbWVudHMvb2JqZWN0LWJyb3dzZXIuanN4IiwiLi9zb3VyY2UvanMvcmVhY3QtZWxlbWVudHMvcHJvcGVydGllcy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29uZmlnID0ge1xuICBjb250ZW50OiBbe1xuICAgIHR5cGU6ICdyb3cnLFxuICAgIGNvbnRlbnQ6IFt7XG4gICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgd2lkdGg6IDE1LFxuICAgICAgY29udGVudDogW3tcbiAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXG4gICAgICAgIGNvbXBvbmVudE5hbWU6ICdPYmplY3RCcm93c2VyJyxcbiAgICAgICAgdGl0bGU6ICdPYmplY3QgQnJvd3NlcidcbiAgICAgIH1dXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY29sdW1uJyxcbiAgICAgIHdpZHRoOiA3MCxcbiAgICAgIGNvbnRlbnQ6IFt7XG4gICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxuICAgICAgICBjb21wb25lbnROYW1lOiAnRGFzaENvbm5lY3QnLFxuICAgICAgICB0aXRsZTogJ0Nvbm5lY3QgdG8gRGFzaCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxuICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICB0aXRsZTogJ0NvbnNvbGUnLFxuICAgICAgICBjb21wb25lbnROYW1lOiAnRGFzaENvbnNvbGUnXG4gICAgICB9XVxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ3JvdycsXG4gICAgICBjb250ZW50OiBbe1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICB3aWR0aDogMTUsXG4gICAgICAgIGNvbnRlbnQ6IFt7XG4gICAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXG4gICAgICAgICAgY29tcG9uZW50TmFtZTogJ1Byb3BlcnRpZXMnLFxuICAgICAgICAgIHRpdGxlOiAnUHJvcGVydGllcydcbiAgICAgICAgfV1cbiAgICAgIH1dXG4gICAgfV1cbiAgfV1cbn07XG5cbnZhciBkYXNoID0ge1xuICBlbmdpbmU6IG5ldyBEYXNoKCksXG4gIHNjZW5lOiBbIF0sXG4gIHBhbmVsczoge1xuICAgIG9iamVjdEJyb3dzZXI6IHsgfSxcbiAgICBwcm9wZXJ0aWVzRWRpdG9yOiB7IH1cbiAgfSxcbiAgY29uc29sZTogeyB9LFxuICBsYXlvdXQ6IHtcbiAgICBnb2xkZW46IG5ldyBHb2xkZW5MYXlvdXQoIGNvbmZpZyApLFxuICAgIHJlZ2lzdGVyRWxlbWVudDogcmVnaXN0ZXJFbGVtZW50XG4gIH1cbn07XG5cbmRhc2gubGF5b3V0LmdvbGRlbi5pbml0KCk7XG5cbmRhc2guZW5naW5lLnJlZ2lzdGVyUmVjZWl2ZUhhbmRsZXIoXCJkYXNoOmxvZ2dlcjptZXNzYWdlXCIsIGZ1bmN0aW9uKGRhdGEpXG57XG4gIGRhc2guY29uc29sZS5sb2coZGF0YSk7XG59KTtcblxuLy8gdGhpcyBmdW5jdGlvbiBpcyBlbXB0eSB1bnRpbCB3ZSBhZGQgYSBwcm9wZXIgZ3JhcGggZm9yIEZQUyBkYXRhXG4vLyB0aGUgZW1wdHkgZnVuY3Rpb24gc3RvcHMgYW4gZXJyb3IgZnJvbSBiZWluZyB0aHJvd24gaW4gdGhlIGNvbnNvbGVcbmRhc2guZW5naW5lLnJlZ2lzdGVyUmVjZWl2ZUhhbmRsZXIoXCJkYXNoOnBlcmY6ZnJhbWV0aW1lXCIsIGZ1bmN0aW9uKGRhdGEpXG57XG5cbn0pO1xuXG5kYXNoLmVuZ2luZS5vbkNvbm5lY3QgPSBmdW5jdGlvbigpXG57XG4gIGRhc2guY29uc29sZS5sb2coICdDb25uZWN0ZWQgdG8gRGFzaC4nICk7XG4gIGRhc2guZW5naW5lLmdldE9iamVjdHMoIGZ1bmN0aW9uKCBkYXRhICkge1xuICAgIGRhc2guc2NlbmUgPSBkYXRhO1xuICAgIGRhc2gucGFuZWxzLm9iamVjdEJyb3dzZXIuc2V0UHJvcHMoIHsgZGF0YTogZGFzaC5zY2VuZSB9ICk7XG4gIH0gKTtcbn07XG5cbi8vcmVnaXN0ZXJFbGVtZW50KCAnTXllbGVtZW50JywgZnVuY3Rpb24oKSB7IHJldHVybiA8RGFzaFByb3BlcnRpZXMgZGF0YT17IFtdIH0gLz47IH0gKTtcbmZ1bmN0aW9uIHJlZ2lzdGVyRWxlbWVudCggbmFtZSwgZWxlbWVudENiLCBzdG9yZUVsZW1lbnRDYiApXG57XG4gIGRhc2gubGF5b3V0LmdvbGRlbi5yZWdpc3RlckNvbXBvbmVudCggbmFtZSwgZnVuY3Rpb24oIGNvbnRhaW5lciwgc3RhdGUgKVxuICB7XG4gICAgdmFyIHJlc3VsdCA9IFJlYWN0LnJlbmRlcihcbiAgICAgIGVsZW1lbnRDYigpLFxuICAgICAgY29udGFpbmVyLmdldEVsZW1lbnQoKVswXVxuICAgICk7XG5cbiAgICBpZiggc3RvcmVFbGVtZW50Q2IgKVxuICAgICAgc3RvcmVFbGVtZW50Q2IoIHJlc3VsdCApO1xuXG4gICAgLy9UT0RPOiBNYWtlIEdMIHN0YXRlIGFjY2Vzc2libGUgZnJvbSByZWFjdFxuICAgIGNvbnNvbGUubG9nKCBzdGF0ZSApO1xuICB9KTtcbn1cblxuZGFzaC5sYXlvdXQucmVnaXN0ZXJFbGVtZW50KCAnRGFzaENvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gY29ubmVjdFRvRGFzaCgpIHtcbiAgICBkYXNoLmVuZ2luZS5jb25uZWN0KCAnODAwOCcgKTtcbiAgICBkYXNoLmNvbnNvbGUubG9nKCAnQ29ubmVjdGluZyB0byBEYXNoLi4uJyApO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge2NsYXNzTmFtZTogXCJjb25uZWN0XCIsIG9uQ2xpY2s6IGNvbm5lY3RUb0Rhc2ggfSwgXCJDb25uZWN0IHRvIERhc2hcIik7XG59ICk7XG5cbmNvbnNvbGUubG9nKCBkYXNoICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGFzaDtcbiIsInZhciBkYXNoID0gcmVxdWlyZSggJy4uL21haW4nICk7XG5cbnZhciBEYXNoQ29uc29sZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdEYXNoQ29uc29sZUxpc3QnLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiAgaXRlbS5pZH0sIGl0ZW0ubXNnKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCwgdGhpcy5wcm9wcy5pdGVtcy5tYXAobG9nSXRlbSkpXG4gICAgKTtcbiAgfVxufSk7XG52YXIgRGFzaENvbnNvbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdEYXNoQ29uc29sZScsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtpdGVtczogW10sIGtleUNvdW50OiAwfTtcbiAgfSxcbiAgbG9nOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIG5leHRJdGVtcztcbiAgICB2YXIga2V5ID0gdGhpcy5zdGF0ZS5rZXlDb3VudC52YWx1ZTtcbiAgICBpZih0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIilcbiAgICAgIG5leHRJdGVtcyA9IHRoaXMuc3RhdGUuaXRlbXMuY29uY2F0KFt7bXNnOiBpdGVtLCBpZDoga2V5fV0pO1xuICAgIGVsc2VcbiAgICB7XG4gICAgICBpdGVtLmlkID0ga2V5O1xuICAgICAgbmV4dEl0ZW1zID0gdGhpcy5zdGF0ZS5pdGVtcy5jb25jYXQoW2l0ZW1dKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtpdGVtczogbmV4dEl0ZW1zLCBrZXlDb3VudDoga2V5Kyt9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEYXNoQ29uc29sZUxpc3QsIHtpdGVtczogdGhpcy5zdGF0ZS5pdGVtc30pXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbmRhc2gubGF5b3V0LnJlZ2lzdGVyRWxlbWVudCggJ0Rhc2hDb25zb2xlJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KERhc2hDb25zb2xlLCB7Y2xhc3M6IFwiY29uc29sZVwifSk7XG59LCBmdW5jdGlvbiggZWxlbWVudCApIHtcbiAgZGFzaC5jb25zb2xlID0gZWxlbWVudDtcbn0gKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXNoQ29uc29sZTtcbiIsInZhciBkYXNoID0gcmVxdWlyZSggJy4uL21haW4nICk7XG5cbnZhciBEYXNoT2JqZWN0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hPYmplY3RzJyxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgZGF0YTogW10gfTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKCBpICkge1xuICAgICAgZGFzaC5wYW5lbHMucHJvcGVydHlFZGl0b3Iuc2V0UHJvcHMoIHsgZGF0YTogZGFzaC5zY2VuZVsgaSBdLkNvbXBvbmVudHMgfSApO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5tYXAoIGZ1bmN0aW9uKCBub2RlLCBpICkge1xuICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgUmVhY3QuRE9NLnNwYW4oe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbm9kZScsXG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbigpIHsgc2VsZi5vbkNsaWNrKCBpICk7IH1cbiAgICAgICAgICB9LCBub2RlLk5hbWUgKTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlVmlldywge2tleTogIG5vZGUuTmFtZSArICd8JyArIGksIG5vZGVMYWJlbDogbGFiZWwsIGRlZmF1bHRDb2xsYXBzZWQ6IHRydWUgfSwgXG4gICAgICAgICAgICAgICBub2RlLkNoaWxkcmVuLm1hcCggZnVuY3Rpb24oIGNoaWxkLCBqICkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVWaWV3LCB7bm9kZUxhYmVsOiBsYWJlbCwga2V5OiAgY2hpbGQuVHlwZSArICd8JyArIGosIGRlZmF1bHRDb2xsYXBzZWQ6IGZhbHNlIH0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiaW5mb1wifSwgIGNoaWxkLlR5cGUpXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSkgXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSwgdGhpcykgXG4gICAgICApXG4gICAgKTtcbiAgfVxufSApO1xuXG5kYXNoLmxheW91dC5yZWdpc3RlckVsZW1lbnQoICdPYmplY3RCcm93c2VyJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KERhc2hPYmplY3RzLCB7ZGF0YTogWyAgXSB9KTtcbn0sIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuICBkYXNoLnBhbmVscy5vYmplY3RCcm93c2VyID0gZWxlbWVudDtcbn0gKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXNoT2JqZWN0cztcbiIsInZhciBkYXNoID0gcmVxdWlyZSggJy4uL21haW4nICk7XG5cbnZhciBEYXNoUHJvcGVydGllcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hQcm9wZXJ0aWVzJyxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgZGF0YTogW10gfTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKCBpICkge1xuICAgICAgLy9kYXNoU2VsZWN0ZWRQcm9wZXJ0aWVzLnNldFByb3BzKCB7IGRhdGE6IGRhc2hPYmplY3REYXRhWyBpIF0gfSApO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5tYXAoIGZ1bmN0aW9uKCBub2RlLCBpICkge1xuICAgICAgICAgIHZhciBsYWJlbCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwibm9kZVwifSwgIG5vZGUuVHlwZSk7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZVZpZXcsIHtrZXk6ICBub2RlLlR5cGUgKyAnfCcgKyBpLCBub2RlTGFiZWw6IGxhYmVsLCBkZWZhdWx0Q29sbGFwc2VkOiBmYWxzZSB9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgXCJOYW1lOiBcIiwgIG5vZGUuQXNzZXQpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSwgdGhpcykgXG4gICAgICApXG4gICAgKTtcbiAgfVxufSApO1xuXG5kYXNoLmxheW91dC5yZWdpc3RlckVsZW1lbnQoICdQcm9wZXJ0aWVzJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KERhc2hQcm9wZXJ0aWVzLCB7ZGF0YTogW10gfSk7XG59LCBmdW5jdGlvbiggZWxlbWVudCApIHtcbiAgZGFzaC5wYW5lbHMucHJvcGVydHlFZGl0b3IgPSBlbGVtZW50O1xufSApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhc2hQcm9wZXJ0aWVzO1xuIl19
