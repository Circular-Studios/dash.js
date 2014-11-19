var DashProperties = React.createClass({
    getInitialState: function() {
      return { data: [] };
    },
    onClick: function( i ) {
      //dashSelectedProperties.setProps( { data: dashObjectData[ i ] } );
    },
    render: function() {
    return (
      <div>
        { this.props.data.map( function( node, i ) {
          var label = <span className="node">{ node.Type }</span>;
          return (
            <TreeView key={ node.Type + '|' + i } nodeLabel={ label } defaultCollapsed={ false }>
              <span>Name: { node.Asset }</span>
            </TreeView>
          );
        }, this ) }
      </div>
    );
  }
} );

module.exports = DashProperties;
