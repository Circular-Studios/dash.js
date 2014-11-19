var DashConsoleList = React.createClass({
  render: function() {
    var logItem = function(item) {
      return <li key={ item.id }>{item.msg}</li>;
    };
    return (
      <ul>{this.props.items.map(logItem)}</ul>
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
      <div>
        <DashConsoleList items={this.state.items} />
      </div>
    );
  }
});

module.exports = DashConsole;
