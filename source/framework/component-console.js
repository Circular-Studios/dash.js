var DashConsoleList = React.createClass({
  render: function() {
    var logItem = function(item) {
      return <li>{item.msg}</li>;
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


/*
var Timer = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0};
  },
  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <h2>Seconds Elapsed: {this.state.secondsElapsed}</h2>
    );
  }
});
*/