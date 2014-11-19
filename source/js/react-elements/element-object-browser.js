var DashObjects = React.createClass({
    getInitialState: function() {
      return { data: [] };
    },
    onClick: function( i ) {
      dashSelectedProperties.setProps( { data: dashObjectData[ i ].Components } );
    },
    removeObject: function( i ) {
      dashObjectData.splice( i, i + 1 );
      dashObjectList.setProps( { data: dashObjectData } );
    },
    render: function() {
    return (
      <div>
        { this.props.data.map( function( node, i ) {
          var self = this;
          var close = new React.DOM.span({
            className: 'close-button',
            onClick: function() { self.removeObject( i ); }
          }, '(x)' );
          var label = new React.DOM.span({
            className: 'node',
            onClick: function() { self.onClick( i );}
          }, node.Name, close );
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
