ws    = require 'ws'
Dash  = require '../source/dash'

# Start WebSocket server
wss = null

addEventHandlers = ( server ) ->
    #server.registerReceiveHandler 'dash:scene:get_objects', ( data ) ->

module.exports = mockServer =
    run: ( test ) ->
        # Set up server
        dashServer = new Dash
        addEventHandlers dashServer
        wss.on 'connection', ( ws ) ->
            dashServer._socket = ws
            dashServer._init()

        # Connect to server
        dash = new Dash
        dash.connect 8080, '127.0.0.1', ''

        dash.onConnect = ->
            # Ensure we are actually connected
            dash.isConnected.should.equal true

            test dash, dashServer, ->
                # Cleanup
                do dash.disconnect
                do dashServer.disconnect
                #do wss.removeAllListeners 'connection'

    startServer: () ->
        wss = new ws.Server host: '127.0.0.1', port: 8080

    endServer: () ->
        do wss.close

describe 'Dash Server', ->
    before mockServer.startServer
    after  mockServer.endServer

    it "Connects", ->
        mockServer.run ( dash, server ) ->
