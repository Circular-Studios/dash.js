/*
  Item Fields:
    file: File name 
    line:
    funcName;
    prettyFuncName;
    moduleName;
    logLevel;
    timestamp;
    msg;
*/

var DashConsoleList = React.createClass({
  render: function() {
    var logItem = function(item) {
      return (
        <TreeView key={ item.id } nodeLabel={item.msg} defaultCollapsed={true}>
          <div>File: {item.file}</div>
          <div>Line: {item.line}</div>
          <div>Function Name: {item.funcName}</div>
          <div>Pretty Function Name: {item.prettyFuncName}</div>
          <div>Module: {item.moduleName}</div>
          <div>Log Level: {item.logLevel}</div>
          <div>Timestamp: {item.timestamp}</div>
        </TreeView>
      );
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
      <DashConsoleList items={this.state.items} />
    );
  }
});
