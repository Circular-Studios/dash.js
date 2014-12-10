dash = require '../main'

DashProperties = React.createClass
  getInitialState: () -> data: []
  modifyProperty: ( event ) ->
    console.log this.props.data.Components[ event.target.name ]
    this.props.data.Components[ event.target.name ] = event.target.value
    console.log this.props.data.Components[ event.target.name ]
    return true
  renderProperty: ( property, value ) ->
    switch property
      when "Asset"
      then return <input type="text" name={ property } size="20" value={ value } onChange={ this.modifyProperty } />
  saveProperties: () ->
    this.props.data.save
  render: () ->
    return (
      <div> {
        this.props.data.Components.map( ( node, i ) ->
          label = <span className="node">{ node.Type }</span>;
          return (
            <TreeView key={ node.Type + '|' + i } nodeLabel={ label } defaultCollapsed={ false }>
              {
                for property, value of node
                  this.renderProperty property, value
              }
            </TreeView> )
        , this )
      } </div> )

dash.layout.registerElement( 'Properties',
  () -> <DashProperties data={ Components: [] } />
  ( element ) -> dash.panels.propertyEditor = element
)

module.exports = DashProperties
