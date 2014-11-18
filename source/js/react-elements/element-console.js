var DashConsoleList = React.createClass({
  render: function() {
    var logItem = function(item) {
      return <li key={ item.timestamp }>{item.msg}</li>;
    };
    return (
      <ul>{this.props.items.map(logItem)}</ul>
    );
  }
});
var DashConsole = React.createClass({
  getInitialState: function() {
    return {items: []};
  },
  log: function(item) {
    var nextItems;
    if(typeof item === "string")
      nextItems = this.state.items.concat([{msg: item}]);
    else
      nextItems = this.state.items.concat([item]);

    this.setState({items: nextItems});
  },
  render: function() {
    return (
      <div>
        <DashConsoleList items={this.state.items} />
      </div>
    );
  }
});
