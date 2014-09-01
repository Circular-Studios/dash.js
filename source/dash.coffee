uuid = require( 'node-uuid' )

createMessage = ( key, value, callbackId = "" ) ->
    JSON.stringify
        key: key
        value: value
        callbackId: callbackId

CallbackMessageKey = '__callback__'

class Dash
    socket: null
    isConnected: false
    receiveHandlers: { }

    # The callback for on connection opened.
    onConnect: () ->
    # The callback for on connection closed.
    onDisconnect: () ->
    # The callback for on connection failed.
    onError: ( err ) ->

    # Connect to the engine.
    connect: ( port, address = "localhost" ) ->
        @socket = new WebSocket( "ws://#{address}:#{port}/ws" )

        @socket.onopen = ( oe ) =>
            @isConnected = true
            @onConnect()

            return

        @socket.onclose = ( ce ) =>
            @isConnected = false
            @onDisconnect()

            return

        @socket.onmessage = ( message ) =>
            console.log message.data

            data = JSON.parse message.data
            return if not data.key or not data.value

            responseFunc = ( resp ) =>
                @socket.send(
                    createMessage CallbackMessageKey, resp, data.callbackId
                )

            if data.key of @receiveHandlers
                for handler in @receiveHandlers[ data.key ]
                    handler data.value, responseFunc if handler
            else
                console.log "Warning, no handlers for message key #{data.key}"
                console.log @receiveHandlers

            return

        @socket.onerror = ( err ) =>
            @isConnected = false
            @onError()

            return

        return

    registerReceiveHandler: ( key, handler ) ->
        return if typeof key isnt 'string'

        # Init handlers array
        if key not of @receiveHandlers
            @receiveHandlers[ key ] = [ ]

        # Add the handler
        @receiveHandlers[ key ].push handler

        return

    # Send data to the engine.
    send: ( key, data, cb = ( obj ) -> ) ->
        @socket.send createMessage key, data

module.exports = Dash
