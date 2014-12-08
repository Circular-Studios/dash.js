class DashLayout
  constructor: ->
    @golden = new GoldenLayout config
    do @golden.init

  registerElement: ( name, elementCb, storeElementCb = null ) ->
    @golden.registerComponent name, ( container, state ) ->
      result = React.render elementCb(), container.getElement()[0]

      if storeElementCb
        storeElementCb result

      result.setState state

module.exports = DashLayout

config = content: [
  type: "row"
  content: [
    {
      type: "stack"
      width: 15
      content: [
        type: "component"
        componentName: "ObjectBrowser"
        title: "Object Browser"
      ]
    }
    {
      type: "column"
      width: 70
      content: [
        {
          type: "component"
          componentName: "DashConnect"
          title: "Connect to Dash"
        }
        {
          type: "component"
          height: 20
          title: "Console"
          componentName: "DashConsole"
        }
      ]
    }
    {
      type: "row"
      content: [
        type: "stack"
        width: 15
        content: [
          type: "component"
          componentName: "Properties"
          title: "Properties"
        ]
      ]
    }
  ]
]
