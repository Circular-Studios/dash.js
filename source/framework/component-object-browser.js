var Lists = React.createClass({
    getInitialState: function() {
      return { data: [] };
    },
    render: function() {
    return (
      <div>
        { this.props.data.map( function( node, i ) { 
          var label = <span className="node">{ node.Name }</span>;
          return (
            <TreeView key={ node.Name + '|' + i } nodeLabel={ label } defaultCollapsed={ true }>
              {/*<span className="node">Children</span>*/}
              { node.Children.map( function( child, j ) {
                return (
                  <TreeView nodeLabel={ label } key={ child.Type } defaultCollapsed={ false }>
                    <div className="info">{ child.Type }</div>
                  </TreeView>
                );
              } ) }
            </TreeView>
          );
        }, this ) }
      </div>
    );
  }
} );
