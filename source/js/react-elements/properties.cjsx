dash = require '../main'

DashProperties = React.createClass
    getInitialState: () -> data: []
    onClick: ( i ) ->
      #dashSelectedProperties.setProps data: dashObjectData[ i ]
    render: () ->
      return (
        <div> {
          this.props.data.map( ( node, i ) ->
            label = <span className="node">{ node.Type }</span>;
            return (
              <TreeView key={ node.Type + '|' + i } nodeLabel={ label } defaultCollapsed={ false }>
                <span>Name: { node.Asset }</span>
              </TreeView> )
          , this )
        } </div> )

dash.layout.registerElement( 'Properties',
  () -> <DashProperties data={ [] } />
  ( element ) -> dash.panels.propertyEditor = element
)

module.exports = DashProperties
