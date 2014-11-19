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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NvdXJjZS9qcy9tYWluLmpzeCIsIi4vc291cmNlL2pzL3JlYWN0LWVsZW1lbnRzL2NvbnNvbGUuanN4IiwiLi9zb3VyY2UvanMvcmVhY3QtZWxlbWVudHMvb2JqZWN0LWJyb3dzZXIuanN4IiwiLi9zb3VyY2UvanMvcmVhY3QtZWxlbWVudHMvcHJvcGVydGllcy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBEYXNoQ29uc29sZSAgICAgPSByZXF1aXJlKCAnLi9yZWFjdC1lbGVtZW50cy9jb25zb2xlJyApLFxuICAgIERhc2hPYmplY3RzICAgICA9IHJlcXVpcmUoICcuL3JlYWN0LWVsZW1lbnRzL29iamVjdC1icm93c2VyJyApLFxuICAgIERhc2hQcm9wZXJ0aWVzICA9IHJlcXVpcmUoICcuL3JlYWN0LWVsZW1lbnRzL3Byb3BlcnRpZXMnICk7XG5cbnZhciBjb25maWcgPSB7XG4gIGNvbnRlbnQ6IFt7XG4gICAgdHlwZTogJ3JvdycsXG4gICAgY29udGVudDogW3tcbiAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICB3aWR0aDogMTUsXG4gICAgICBjb250ZW50OiBbe1xuICAgICAgICB0eXBlOiAnY29tcG9uZW50JyxcbiAgICAgICAgY29tcG9uZW50TmFtZTogJ09iamVjdEJyb3dzZXInLFxuICAgICAgICB0aXRsZTogJ09iamVjdCBCcm93c2VyJ1xuICAgICAgfV1cbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICdjb2x1bW4nLFxuICAgICAgd2lkdGg6IDcwLFxuICAgICAgY29udGVudDogW3tcbiAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXG4gICAgICAgIGNvbXBvbmVudE5hbWU6ICdEYXNoQ29ubmVjdCcsXG4gICAgICAgIHRpdGxlOiAnQ29ubmVjdCB0byBEYXNoJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ2NvbXBvbmVudCcsXG4gICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgIHRpdGxlOiAnQ29uc29sZScsXG4gICAgICAgIGNvbXBvbmVudE5hbWU6ICdEYXNoQ29uc29sZSdcbiAgICAgIH1dXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAncm93JyxcbiAgICAgIGNvbnRlbnQ6IFt7XG4gICAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICAgIHdpZHRoOiAxNSxcbiAgICAgICAgY29udGVudDogW3tcbiAgICAgICAgICB0eXBlOiAnY29tcG9uZW50JyxcbiAgICAgICAgICBjb21wb25lbnROYW1lOiAnUHJvcGVydGllcycsXG4gICAgICAgICAgdGl0bGU6ICdQcm9wZXJ0aWVzJ1xuICAgICAgICB9XVxuICAgICAgfV1cbiAgICB9XVxuICB9XVxufTtcblxudmFyIG15TGF5b3V0ID0gbmV3IEdvbGRlbkxheW91dCggY29uZmlnICk7XG52YXIgZGFzaCA9IG5ldyBEYXNoKCk7XG52YXIgZGFzaE9iamVjdERhdGEgPSBbXTtcbnZhciBkYXNoT2JqZWN0TGlzdDtcbnZhciBkYXNoU2VsZWN0ZWRQcm9wZXJ0aWVzO1xudmFyIGRhc2hDb25zb2xlO1xuXG5kYXNoLnJlZ2lzdGVyUmVjZWl2ZUhhbmRsZXIoXCJkYXNoOmxvZ2dlcjptZXNzYWdlXCIsIGZ1bmN0aW9uKGRhdGEpXG57XG4gIGRhc2hDb25zb2xlLmxvZyhkYXRhKTtcbn0pO1xuXG5kYXNoLm9uQ29ubmVjdCA9IGZ1bmN0aW9uKClcbntcbiAgZGFzaENvbnNvbGUubG9nKCAnQ29ubmVjdGVkIHRvIERhc2guJyApO1xuICBkYXNoLmdldE9iamVjdHMoIGZ1bmN0aW9uKCBkYXRhICkge1xuICAgIGRhc2hPYmplY3REYXRhID0gZGF0YTtcbiAgICBkYXNoT2JqZWN0TGlzdC5zZXRQcm9wcyggeyBkYXRhOiBkYXNoT2JqZWN0RGF0YSB9ICk7XG4gIH0gKTtcbn07XG5cbm15TGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50KCAnRGFzaENvbm5lY3QnLCBmdW5jdGlvbiggY29udGFpbmVyLCBzdGF0ZSApXG57XG4gIGNvbnRhaW5lci5nZXRFbGVtZW50KCkuaHRtbCggJzxidXR0b24gY2xhc3M9XCJjb25uZWN0XCIgb25DbGljaz1cImNvbm5lY3RUb0Rhc2goKTtcIj5Db25uZWN0IHRvIERhc2g8L2J1dHRvbj4nICk7XG59KTtcblxubXlMYXlvdXQucmVnaXN0ZXJDb21wb25lbnQoICdPYmplY3RCcm93c2VyJywgZnVuY3Rpb24oIGNvbnRhaW5lciwgc3RhdGUgKVxue1xuICBkYXNoT2JqZWN0TGlzdCA9IFJlYWN0LnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERhc2hPYmplY3RzLCB7ZGF0YTogWyAgXSB9KSxcbiAgICBjb250YWluZXIuZ2V0RWxlbWVudCgpWzBdXG4gICk7XG59KTtcblxubXlMYXlvdXQucmVnaXN0ZXJDb21wb25lbnQoICdQcm9wZXJ0aWVzJywgZnVuY3Rpb24oIGNvbnRhaW5lciwgc3RhdGUgKVxue1xuICBkYXNoU2VsZWN0ZWRQcm9wZXJ0aWVzID0gUmVhY3QucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaFByb3BlcnRpZXMsIHtkYXRhOiBbICBdIH0pLFxuICAgIGNvbnRhaW5lci5nZXRFbGVtZW50KClbMF1cbiAgKTtcbn0pO1xuXG5jb25uZWN0VG9EYXNoID0gZnVuY3Rpb24oKVxue1xuICBkYXNoLmNvbm5lY3QoICc4MDA4JyApO1xuICBkYXNoQ29uc29sZS5sb2coICdDb25uZWN0aW5nIHRvIERhc2guLi4nICk7XG59O1xuXG5teUxheW91dC5yZWdpc3RlckNvbXBvbmVudCggJ0Rhc2hDb25zb2xlJywgZnVuY3Rpb24oIGNvbnRhaW5lciwgc3RhdGUgKVxue1xuICBjb250YWluZXIuZ2V0RWxlbWVudCgpWzBdLnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xuICBkYXNoQ29uc29sZSA9IFJlYWN0LnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERhc2hDb25zb2xlLCBudWxsKSxcbiAgICBjb250YWluZXIuZ2V0RWxlbWVudCgpWzBdXG4gICk7XG59KTtcblxubXlMYXlvdXQuaW5pdCgpO1xuIiwidmFyIERhc2hDb25zb2xlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hDb25zb2xlTGlzdCcsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvZ0l0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6ICBpdGVtLmlkfSwgaXRlbS5tc2cpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCB0aGlzLnByb3BzLml0ZW1zLm1hcChsb2dJdGVtKSlcbiAgICApO1xuICB9XG59KTtcbnZhciBEYXNoQ29uc29sZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hDb25zb2xlJyxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge2l0ZW1zOiBbXSwga2V5Q291bnQ6IDB9O1xuICB9LFxuICBsb2c6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgbmV4dEl0ZW1zO1xuICAgIHZhciBrZXkgPSB0aGlzLnN0YXRlLmtleUNvdW50LnZhbHVlO1xuICAgIGlmKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgbmV4dEl0ZW1zID0gdGhpcy5zdGF0ZS5pdGVtcy5jb25jYXQoW3ttc2c6IGl0ZW0sIGlkOiBrZXl9XSk7XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGl0ZW0uaWQgPSBrZXk7XG4gICAgICBuZXh0SXRlbXMgPSB0aGlzLnN0YXRlLml0ZW1zLmNvbmNhdChbaXRlbV0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe2l0ZW1zOiBuZXh0SXRlbXMsIGtleUNvdW50OiBrZXkrK30pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERhc2hDb25zb2xlTGlzdCwge2l0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zfSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXNoQ29uc29sZTtcbiIsInZhciBEYXNoT2JqZWN0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Rhc2hPYmplY3RzJyxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgZGF0YTogW10gfTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKCBpICkge1xuICAgICAgZGFzaFNlbGVjdGVkUHJvcGVydGllcy5zZXRQcm9wcyggeyBkYXRhOiBkYXNoT2JqZWN0RGF0YVsgaSBdLkNvbXBvbmVudHMgfSApO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5tYXAoIGZ1bmN0aW9uKCBub2RlLCBpICkge1xuICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgUmVhY3QuRE9NLnNwYW4oe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbm9kZScsXG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbigpIHsgc2VsZi5vbkNsaWNrKCBpICk7IH1cbiAgICAgICAgICB9LCBub2RlLk5hbWUgKTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlVmlldywge2tleTogIG5vZGUuTmFtZSArICd8JyArIGksIG5vZGVMYWJlbDogbGFiZWwsIGRlZmF1bHRDb2xsYXBzZWQ6IHRydWUgfSwgXG4gICAgICAgICAgICAgICBub2RlLkNoaWxkcmVuLm1hcCggZnVuY3Rpb24oIGNoaWxkLCBqICkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVWaWV3LCB7bm9kZUxhYmVsOiBsYWJlbCwga2V5OiAgY2hpbGQuVHlwZSArICd8JyArIGosIGRlZmF1bHRDb2xsYXBzZWQ6IGZhbHNlIH0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiaW5mb1wifSwgIGNoaWxkLlR5cGUpXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSkgXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSwgdGhpcykgXG4gICAgICApXG4gICAgKTtcbiAgfVxufSApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhc2hPYmplY3RzO1xuIiwidmFyIERhc2hQcm9wZXJ0aWVzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRGFzaFByb3BlcnRpZXMnLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBkYXRhOiBbXSB9O1xuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24oIGkgKSB7XG4gICAgICAvL2Rhc2hTZWxlY3RlZFByb3BlcnRpZXMuc2V0UHJvcHMoIHsgZGF0YTogZGFzaE9iamVjdERhdGFbIGkgXSB9ICk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLm1hcCggZnVuY3Rpb24oIG5vZGUsIGkgKSB7XG4gICAgICAgICAgdmFyIGxhYmVsID0gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJub2RlXCJ9LCAgbm9kZS5UeXBlKTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlVmlldywge2tleTogIG5vZGUuVHlwZSArICd8JyArIGksIG5vZGVMYWJlbDogbGFiZWwsIGRlZmF1bHRDb2xsYXBzZWQ6IGZhbHNlIH0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBcIk5hbWU6IFwiLCAgbm9kZS5Bc3NldClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9LCB0aGlzKSBcbiAgICAgIClcbiAgICApO1xuICB9XG59ICk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGFzaFByb3BlcnRpZXM7XG4iXX0=
