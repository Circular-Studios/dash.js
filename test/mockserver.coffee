ws    = require 'ws'
Dash  = require '../source/dash'

wss = new ws.Server host: '127.0.0.1', port: 8080

testDashServer = ( test ) ->
    # Set up server
    dashServer = new Dash
    wss.on 'connection', ( ws ) ->
        dashServer._socket = ws
        dashServer._init()

    # Connect to server
    dash = new Dash
    dash.connect 8080, '127.0.0.1', ''

    dash.onConnect = ->
        # Ensure we are actually connected
        dash.isConnected.should.equal true

        do test

        # Cleanup
        do dash.disconnect
        do dashServer.disconnect
        do wss.close

module.exports =
    testDashServer: testDashServer

describe 'Dash Server', ->
    it "Connects", ->
        testDashServer () ->
