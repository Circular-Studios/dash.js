Dash = require './dash'

dash = new Dash

dash.engine.registerReceiveHandler "dash:logger:message", ( data ) ->
  dash.console.log( data );

# this function is empty until we add a proper graph for FPS data
# the empty function stops an error from being thrown in the console
dash.engine.registerReceiveHandler "dash:perf:frametime", ( data ) ->

dash.engine.onConnect = ->
  dash.console.log 'Connected to Dash.'
  dash.engine.getObjects ( data ) ->
    dash.scene = data;
    dash.panels.objectBrowser.setProps data: dash.scene

dash.layout.registerElement 'DashConnect', () ->
  connectToDash = ->
    dash.engine.connect 8008
    dash.console.log 'Connecting to Dash...'

  return <button className="connect" onClick={ connectToDash }>Connect to Dash</button>

module.exports = dash
