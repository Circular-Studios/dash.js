dash = require '../main'

DashConsoleList = React.createClass
  render: ->
    logItem = ( item ) -> <li key={ item.id }>{item.msg}</li>;
    return (
      <ul>{ @props.items.map logItem }</ul>
    )
DashConsole = React.createClass
  getInitialState: ->
    return items: [], keyCount: 0
  log: ( item ) ->
    nextItems;
    key = this.state.keyCount.value;
    if typeof item is "string"
      nextItems = this.state.items.concat [ { msg: item, id: key } ]
    else
      item.id = key
      nextItems = this.state.items.concat [ item ]

    this.setState items: nextItems, keyCount: key++
  render: ->
    return (
      <div>
        <DashConsoleList items={@state.items} />
      </div> )

dash.layout.registerElement( 'DashConsole',
  () -> <DashConsole class="console" />,
  ( element ) -> dash.console = element
)

module.exports = DashConsole
