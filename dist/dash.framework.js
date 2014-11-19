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

dash.onConnect = function()
{
  dashConsole.log( 'Connected to Dash.' );
  dash.getObjects( function( data ) {
    dashObjectData = data;
    dashObjectList.setProps( { data: dashObjectData } );
  } );
};

myLayout.registerComponent( 'DashConnect', function( container, state )
{
  container.getElement().html( '<button class="connect" onClick="connectToDash();">Connect to Dash</button>' );
});

myLayout.registerComponent( 'ObjectBrowser', function( container, state )
{
  dashObjectList = React.render(
    React.createElement(DashObjects, {data: [  ] }),
    container.getElement()[0]
  );
});

myLayout.registerComponent( 'Properties', function( container, state )
{
  dashSelectedProperties = React.render(
    React.createElement(DashProperties, {data: [  ] }),
    container.getElement()[0]
  );
});

connectToDash = function()
{
  dash.connect( '8008' );
  dashConsole.log( 'Connecting to Dash...' );
};

myLayout.registerComponent( 'DashConsole', function( container, state )
{
  container.getElement()[0].style.overflow = 'auto';
  dashConsole = React.render(
    React.createElement(DashConsole, null),
    container.getElement()[0]
  );
});

myLayout.init();

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var DashObjects = React.createClass({displayName: 'DashObjects',
    getInitialState: function() {
      return { data: [] };
    },
    onClick: function( i ) {
      dashSelectedProperties.setProps( { data: dashObjectData[ i ].Components } );
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

},{}]},{},[1,2,3,4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NvdXJjZS9qcy9tYWluLmpzeCIsIi4vc291cmNlL2pzL3JlYWN0LWVsZW1lbnRzL2VsZW1lbnQtY29uc29sZS5qc3giLCIuL3NvdXJjZS9qcy9yZWFjdC1lbGVtZW50cy9lbGVtZW50LW9iamVjdC1icm93c2VyLmpzeCIsIi4vc291cmNlL2pzL3JlYWN0LWVsZW1lbnRzL2VsZW1lbnQtcHJvcGVydGllcy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29uZmlnID0ge1xuICBjb250ZW50OiBbe1xuICAgIHR5cGU6ICdyb3cnLFxuICAgIGNvbnRlbnQ6IFt7XG4gICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgd2lkdGg6IDE1LFxuICAgICAgY29udGVudDogW3tcbiAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXG4gICAgICAgIGNvbXBvbmVudE5hbWU6ICdPYmplY3RCcm93c2VyJyxcbiAgICAgICAgdGl0bGU6ICdPYmplY3QgQnJvd3NlcidcbiAgICAgIH1dXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY29sdW1uJyxcbiAgICAgIHdpZHRoOiA3MCxcbiAgICAgIGNvbnRlbnQ6IFt7XG4gICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxuICAgICAgICBjb21wb25lbnROYW1lOiAnRGFzaENvbm5lY3QnLFxuICAgICAgICB0aXRsZTogJ0Nvbm5lY3QgdG8gRGFzaCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxuICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICB0aXRsZTogJ0NvbnNvbGUnLFxuICAgICAgICBjb21wb25lbnROYW1lOiAnRGFzaENvbnNvbGUnXG4gICAgICB9XVxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ3JvdycsXG4gICAgICBjb250ZW50OiBbe1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICB3aWR0aDogMTUsXG4gICAgICAgIGNvbnRlbnQ6IFt7XG4gICAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXG4gICAgICAgICAgY29tcG9uZW50TmFtZTogJ1Byb3BlcnRpZXMnLFxuICAgICAgICAgIHRpdGxlOiAnUHJvcGVydGllcydcbiAgICAgICAgfV1cbiAgICAgIH1dXG4gICAgfV1cbiAgfV1cbn07XG5cbnZhciBteUxheW91dCA9IG5ldyBHb2xkZW5MYXlvdXQoIGNvbmZpZyApO1xudmFyIGRhc2ggPSBuZXcgRGFzaCgpO1xudmFyIGRhc2hPYmplY3REYXRhID0gW107XG52YXIgZGFzaE9iamVjdExpc3Q7XG52YXIgZGFzaFNlbGVjdGVkUHJvcGVydGllcztcbnZhciBkYXNoQ29uc29sZTtcblxuZGFzaC5yZWdpc3RlclJlY2VpdmVIYW5kbGVyKFwiZGFzaDpsb2dnZXI6bWVzc2FnZVwiLCBmdW5jdGlvbihkYXRhKVxue1xuICBkYXNoQ29uc29sZS5sb2coZGF0YSk7XG59KTtcblxuZGFzaC5vbkNvbm5lY3QgPSBmdW5jdGlvbigpXG57XG4gIGRhc2hDb25zb2xlLmxvZyggJ0Nvbm5lY3RlZCB0byBEYXNoLicgKTtcbiAgZGFzaC5nZXRPYmplY3RzKCBmdW5jdGlvbiggZGF0YSApIHtcbiAgICBkYXNoT2JqZWN0RGF0YSA9IGRhdGE7XG4gICAgZGFzaE9iamVjdExpc3Quc2V0UHJvcHMoIHsgZGF0YTogZGFzaE9iamVjdERhdGEgfSApO1xuICB9ICk7XG59O1xuXG5teUxheW91dC5yZWdpc3RlckNvbXBvbmVudCggJ0Rhc2hDb25uZWN0JywgZnVuY3Rpb24oIGNvbnRhaW5lciwgc3RhdGUgKVxue1xuICBjb250YWluZXIuZ2V0RWxlbWVudCgpLmh0bWwoICc8YnV0dG9uIGNsYXNzPVwiY29ubmVjdFwiIG9uQ2xpY2s9XCJjb25uZWN0VG9EYXNoKCk7XCI+Q29ubmVjdCB0byBEYXNoPC9idXR0b24+JyApO1xufSk7XG5cbm15TGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50KCAnT2JqZWN0QnJvd3NlcicsIGZ1bmN0aW9uKCBjb250YWluZXIsIHN0YXRlIClcbntcbiAgZGFzaE9iamVjdExpc3QgPSBSZWFjdC5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChEYXNoT2JqZWN0cywge2RhdGE6IFsgIF0gfSksXG4gICAgY29udGFpbmVyLmdldEVsZW1lbnQoKVswXVxuICApO1xufSk7XG5cbm15TGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50KCAnUHJvcGVydGllcycsIGZ1bmN0aW9uKCBjb250YWluZXIsIHN0YXRlIClcbntcbiAgZGFzaFNlbGVjdGVkUHJvcGVydGllcyA9IFJlYWN0LnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERhc2hQcm9wZXJ0aWVzLCB7ZGF0YTogWyAgXSB9KSxcbiAgICBjb250YWluZXIuZ2V0RWxlbWVudCgpWzBdXG4gICk7XG59KTtcblxuY29ubmVjdFRvRGFzaCA9IGZ1bmN0aW9uKClcbntcbiAgZGFzaC5jb25uZWN0KCAnODAwOCcgKTtcbiAgZGFzaENvbnNvbGUubG9nKCAnQ29ubmVjdGluZyB0byBEYXNoLi4uJyApO1xufTtcblxubXlMYXlvdXQucmVnaXN0ZXJDb21wb25lbnQoICdEYXNoQ29uc29sZScsIGZ1bmN0aW9uKCBjb250YWluZXIsIHN0YXRlIClcbntcbiAgY29udGFpbmVyLmdldEVsZW1lbnQoKVswXS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcbiAgZGFzaENvbnNvbGUgPSBSZWFjdC5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChEYXNoQ29uc29sZSwgbnVsbCksXG4gICAgY29udGFpbmVyLmdldEVsZW1lbnQoKVswXVxuICApO1xufSk7XG5cbm15TGF5b3V0LmluaXQoKTtcbiIsInZhciBEYXNoQ29uc29sZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdEYXNoQ29uc29sZUxpc3QnLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiAgaXRlbS5pZH0sIGl0ZW0ubXNnKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCwgdGhpcy5wcm9wcy5pdGVtcy5tYXAobG9nSXRlbSkpXG4gICAgKTtcbiAgfVxufSk7XG52YXIgRGFzaENvbnNvbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdEYXNoQ29uc29sZScsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtpdGVtczogW10sIGtleUNvdW50OiAwfTtcbiAgfSxcbiAgbG9nOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIG5leHRJdGVtcztcbiAgICB2YXIga2V5ID0gdGhpcy5zdGF0ZS5rZXlDb3VudC52YWx1ZTtcbiAgICBpZih0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIilcbiAgICAgIG5leHRJdGVtcyA9IHRoaXMuc3RhdGUuaXRlbXMuY29uY2F0KFt7bXNnOiBpdGVtLCBpZDoga2V5fV0pO1xuICAgIGVsc2VcbiAgICB7XG4gICAgICBpdGVtLmlkID0ga2V5O1xuICAgICAgbmV4dEl0ZW1zID0gdGhpcy5zdGF0ZS5pdGVtcy5jb25jYXQoW2l0ZW1dKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtpdGVtczogbmV4dEl0ZW1zLCBrZXlDb3VudDoga2V5Kyt9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEYXNoQ29uc29sZUxpc3QsIHtpdGVtczogdGhpcy5zdGF0ZS5pdGVtc30pXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG4iLCJ2YXIgRGFzaE9iamVjdHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdEYXNoT2JqZWN0cycsXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7IGRhdGE6IFtdIH07XG4gICAgfSxcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiggaSApIHtcbiAgICAgIGRhc2hTZWxlY3RlZFByb3BlcnRpZXMuc2V0UHJvcHMoIHsgZGF0YTogZGFzaE9iamVjdERhdGFbIGkgXS5Db21wb25lbnRzIH0gKTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgICB0aGlzLnByb3BzLmRhdGEubWFwKCBmdW5jdGlvbiggbm9kZSwgaSApIHtcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IFJlYWN0LkRPTS5zcGFuKHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ25vZGUnLFxuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24oKSB7IHNlbGYub25DbGljayggaSApOyB9XG4gICAgICAgICAgfSwgbm9kZS5OYW1lICk7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZVZpZXcsIHtrZXk6ICBub2RlLk5hbWUgKyAnfCcgKyBpLCBub2RlTGFiZWw6IGxhYmVsLCBkZWZhdWx0Q29sbGFwc2VkOiB0cnVlIH0sIFxuICAgICAgICAgICAgICAgbm9kZS5DaGlsZHJlbi5tYXAoIGZ1bmN0aW9uKCBjaGlsZCwgaiApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlVmlldywge25vZGVMYWJlbDogbGFiZWwsIGtleTogIGNoaWxkLlR5cGUgKyAnfCcgKyBqLCBkZWZhdWx0Q29sbGFwc2VkOiBmYWxzZSB9LCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImluZm9cIn0sICBjaGlsZC5UeXBlKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pIFxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH0sIHRoaXMpIFxuICAgICAgKVxuICAgICk7XG4gIH1cbn0gKTtcbiIsInZhciBEYXNoUHJvcGVydGllcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hQcm9wZXJ0aWVzJyxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgZGF0YTogW10gfTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKCBpICkge1xuICAgICAgLy9kYXNoU2VsZWN0ZWRQcm9wZXJ0aWVzLnNldFByb3BzKCB7IGRhdGE6IGRhc2hPYmplY3REYXRhWyBpIF0gfSApO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5tYXAoIGZ1bmN0aW9uKCBub2RlLCBpICkge1xuICAgICAgICAgIHZhciBsYWJlbCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwibm9kZVwifSwgIG5vZGUuVHlwZSk7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZVZpZXcsIHtrZXk6ICBub2RlLlR5cGUgKyAnfCcgKyBpLCBub2RlTGFiZWw6IGxhYmVsLCBkZWZhdWx0Q29sbGFwc2VkOiBmYWxzZSB9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgXCJOYW1lOiBcIiwgIG5vZGUuQXNzZXQpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSwgdGhpcykgXG4gICAgICApXG4gICAgKTtcbiAgfVxufSApO1xuIl19
