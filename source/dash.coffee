uuid = require( 'node-uuid' )

class Dash
    socket: null
    isConnected: false

    constructor: () ->

    connect: ( port, address = "localhost" ) ->
        @socket = new WebSocket( "ws://#{address}:#{port}/ws" )

        @socket.onopen = ( oe ) ->
            console.log "connected."
            @isConnected = true

        @socket.onclose = ( ce ) ->
            console.log "connection closed."
            @isConnected = false

        @socket.onmessage = ( message ) ->
            console.log message.data
            @isConnected = false

        @socket.onerror = ( err ) ->
            console.log "Error!"

    send: ( key, data, cb = ( obj ) -> ) ->
        @socket.send JSON.stringify { key: key, value: data }

module.exports = Dash
