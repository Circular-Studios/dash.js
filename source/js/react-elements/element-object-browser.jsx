var DashObjects = React.createClass({
    getInitialState: function() {
      return { data: [] };
    },
    onClick: function( i ) {
      dashSelectedProperties.setProps( { data: dashObjectData[ i ].Components } );
    },
    render: function() {
    return (
      <div>
        { this.props.data.map( function( node, i ) {
          var self = this;
          var label = new React.DOM.span({
            className: 'node',
            onClick: function() { self.onClick( i ); }
          }, node.Name );
          return (
            <TreeView key={ node.Name + '|' + i } nodeLabel={ label } defaultCollapsed={ true }>
              { node.Children.map( function( child, j ) {
                return (
                  <TreeView nodeLabel={ label } key={ child.Type + '|' + j } defaultCollapsed={ false }>
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
