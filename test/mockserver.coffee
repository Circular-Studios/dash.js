ws            = require 'ws'
DashConnector = require '../source/js/dashconnector'

# Start WebSocket server
wss = null

addEventHandlers = ( server ) ->
    #server.registerReceiveHandler 'dash:scene:get_objects', ( data ) ->

module.exports = mockServer =
    run: ( testCompleteCb, test ) ->
        # Set up server
        server = new DashConnector
        addEventHandlers server
        wss.on 'connection', ( ws ) ->
            server._socket = ws
            server._init()
            server.onConnect()
            server.isConnected = true

        # Connect to server
        dash = new DashConnector
        dash.connect 8080, '127.0.0.1', ''

        dash.onConnect = ->
            # Ensure we are actually connected
            dash.isConnected.should.equal true
            server.isConnected.should.equal true

            test dash, server, ->
                # Cleanup
                do dash.disconnect
                do server.disconnect
                do testCompleteCb

    startServer: () ->
        wss = new ws.Server host: '127.0.0.1', port: 8080

    endServer: () ->
        do wss.close

describe 'Dash Server', ->
    before mockServer.startServer
    after  mockServer.endServer

    it "Connects", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->

            do done

    it "Receives", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            serverSock = server._socket
            clientSock = dash._socket

            serverSock.onmessage = ( msg ) ->
                msg.data.should.equal 'test'
                do done

            clientSock.send 'test'

    it "Sends", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            serverSock = server._socket
            clientSock = dash._socket

            clientSock.onmessage = ( msg ) ->
                msg.data.should.equal 'test'
                do done

            serverSock.send 'test'
