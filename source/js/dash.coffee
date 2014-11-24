DashConnector = require './dashconnector'
DashLayout    = require './layout'

class Dash
  engine: new DashConnector()
  scene: [ ]
  panels:
    objectBrowser: { }
    propertiesEditor: { }
  console: { }
  layout: new DashLayout()

module.exports = Dash
