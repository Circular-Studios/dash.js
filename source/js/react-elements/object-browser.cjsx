dash = require '../main'

DashObjects = React.createClass
    getInitialState: ->
      return data: []
    onClick: ( i ) ->
      dash.panels.propertyEditor.setProps data: dash.scene.objects[ i ].Components
    render: ->
      return (
        <div>
          {
            this.props.data.map( ( node, i ) ->
              self = this;
              close = new React.DOM.span(
                {
                  className: 'close-button'
                  onClick: () -> self.removeObject( i )
                },
                '(x)'
              )
              label = new React.DOM.span(
                {
                  className: 'node'
                  onClick: () -> self.onClick( i )
                },
                node.Name, close
              )
              return (
                <TreeView key={ node.Name + '|' + i } nodeLabel={ label } defaultCollapsed={ true }>
                  {
                    node.Children.map ( child, j ) ->
                      return (
                        <TreeView nodeLabel={ label } key={ child.Type + '|' + j } defaultCollapsed={ false }>
                          <div className="info">{ child.Type }</div>
                        </TreeView>
                      )
                  }
                </TreeView>
              )
            , this )
          }
        </div>
      )

dash.layout.registerElement( 'ObjectBrowser',
  () -> <DashObjects data={ [ ] } />,
  ( element ) -> dash.panels.objectBrowser = element
)

module.exports = DashObjects
