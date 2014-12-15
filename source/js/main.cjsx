Dash = require './dash'

dash = new Dash

dash.engine.registerReceiveHandler "dash:logger:message", ( data ) ->
  dash.console.log data

# this function is empty until we add a proper graph for FPS data
# the empty function stops an error from being thrown in the console
dash.engine.registerReceiveHandler "dash:perf:frametime", ( data ) ->

dash.engine.registerReceiveHandler "dash:perf:zone_data", ( data ) ->
  #console.log data

dash.engine.onConnect = ->
  dash.console.log 'Connected to Dash.'
  dash.scene.getObjects ( objs ) ->
    console.log objs
    dash.panels.objectBrowser.setProps data: objs

dash.layout.registerElement 'DashConnect', () ->
  connectToDash = ->
    dash.engine.connect 8008
    dash.console.log 'Connecting to Dash...'

  return <button className="connect" onClick={ connectToDash }>Connect to Dash</button>

module.exports = dash
