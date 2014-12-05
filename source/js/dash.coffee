DashEngine = require './engine'
DashLayout = require './layout'
DashScene  = require './scene'

class Dash
  engine: { }
  scene: { }
  panels:
    objectBrowser: { }
    propertiesEditor: { }
  console: { }
  layout: { }

  constructor: ->
    @engine = new DashEngine this
    @scene  = new DashScene this
    @layout = new DashLayout this

module.exports = Dash
