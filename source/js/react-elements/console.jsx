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

var DashConsoleList = React.createClass({
  render: function() {
    var logItem = function(item) {
      if(item.type == 0) {
        return (
          <div>{item.msg}</div>
        );
      }
      else if(item.type == 1) {
        return (
          <TreeView key={ item.id } nodeLabel={item.msg} defaultCollapsed={true}>
            <div>File: {item.file}</div>
            <div>Line: {item.line}</div>
            <div>Function Name: {item.funcName}</div>
            <div>Pretty Function Name: {item.prettyFuncName}</div>
            <div>Module: {item.moduleName}</div>
            <div>Log Level: {item.logLevel}</div>
            <div>Log Level Label: {item.logLevelLabel}</div>
            <div>Timestamp: {item.timestamp}</div>
          </TreeView>
        );
      }
    };
    return (
      <div>{this.props.items.map(logItem)}</div>
    );
  }
});
var DashConsole = React.createClass({
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
    return (
      <DashConsoleList items={this.state.items} />
    );
  }
});

dash.layout.registerElement( 'DashConsole', function() {
  return <DashConsole class="console" />;
}, function( element ) {
  dash.console = element;
} );

module.exports = DashConsole;
