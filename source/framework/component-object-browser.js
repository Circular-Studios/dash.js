/** @jsx React.DOM */
var Lists = React.createClass({
    getInitialState: function() {
      return {data: []};
    },
    render: function() {
    return (
      <div>
        {this.props.data.map(function(node, i) {
          var label = <span className="node">{node.Name}</span>;
          return (
            <TreeView key={node.Name + '|' + i} nodeLabel={label} defaultCollapsed={false}>
              <span className="node">Components</span>
              {node.Components.map(function(component, j) {
                return (
                  <TreeView nodeLabel={label} key={component.Type} defaultCollapsed={false}>
                    <div className="info">{component.Type}</div>
                  </TreeView>
                );
              })}
            </TreeView>
          );
        }, this)}
      </div>
    );
  }
});
