DashEngine = require './engine'
DashLayout = require './layout'

class Dash
  scene: [ ]
  engine: { }
  panels:
    objectBrowser: { }
    propertiesEditor: { }
  console: { }
  layout: { }

  constructor: ->
    @engine = new DashEngine this
    @layout = new DashLayout this

module.exports = Dash
