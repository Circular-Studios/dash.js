/*global TreeView, React */

// This example data format is totally arbitrary. No data massaging is
// required and you use regular js in `render` to iterate through and
// construct your nodes.
dataSource = [
  {
    type: 'Employees',
    collapsed: false,
    people: [
      {name: 'Paul Gordon', age: 25, sex: 'male', role: 'coder', collapsed: false},
      {name: 'Sarah Lee', age: 23, sex: 'female', role: 'jqueryer', collapsed: false},
    ]
  },
  {
    type: 'CEO',
    collapsed: false,
    people: [
      {name: 'Drew Anderson', age: 35, sex: 'male', role: 'boss', collapsed: false}
    ]
  }
];

// A controlled TreeView, akin to React's controlled inputs
// (http://facebook.github.io/react/docs/forms.html#controlled-components), has
// many benefits. Among others, you can expand/collapse everything (i.e. easily
// trigger those somewhere else).
var Lists = React.createClass({
  getInitialState: function() {
    var collapsedBookkeeping = this.props.dataSource.map(function() {
      return false;
    });
    return {
      collapsedBookkeeping: collapsedBookkeeping
    };
  },

  handleClick: function(i) {
    this.state.collapsedBookkeeping[i] = !this.state.collapsedBookkeeping[i];
    this.setState({collapsedBookkeeping: this.state.collapsedBookkeeping});
  },

  collapseAll: function() {
    this.setState({
      collapsedBookkeeping: this.state.collapsedBookkeeping.map(function() {return true;})
    });
  },

  render: function() {
    var collapsedBookkeeping = this.state.collapsedBookkeeping;

    return (
      <div>
        <button onClick={this.collapseAll}>Collapse all</button>

        {this.props.dataSource.map(function(node, i) {
          // Let's make it so that the tree also toggles when we click the
          // label. Controlled components make this effortless.
          var label =
            <span className="node" onClick={this.handleClick.bind(null, i)}>
              Type {i}
            </span>;
          return (
            <TreeView key={i}
              nodeLabel={label}
              collapsed={collapsedBookkeeping[i]}
              onClick={this.handleClick.bind(null, i)}>
                {node.Components.map(function(entry) {
                  return <div className="info">{entry}</div>;
                })}
            </TreeView>
          );
        }, this)}
      </div>
    );
  }
});
