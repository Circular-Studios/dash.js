uuid = require( 'node-uuid' )

createMessage = ( key, value, callbackId = "" ) ->
    JSON.stringify
        key: key
        value: value
        callbackId: callbackId

CallbackMessageKey = '__callback__'

class Dash
    isConnected: false
    _socket: null
    _receiveHandlers: { }
    _callbackHandlers: { }

    # The callback for on connection opened.
    onConnect: () ->
    # The callback for on connection closed.
    onDisconnect: () ->
    # The callback for on connection failed.
    onError: ( err ) ->

    # Register default callbacks
    constructor: () ->
        @registerReceiveHandler CallbackMessageKey, ( msg, _, cbId ) =>
            if cbId of @_callbackHandlers
                @_callbackHandlers[ cbId ] msg
            else
                console.error "Rogue callback received: ", cbId

    # Connect to the engine.
    connect: ( port, address = "localhost" ) ->
        @_socket = new WebSocket( "ws://#{address}:#{port}/ws" )

        @_socket.onopen = ( oe ) =>
            @isConnected = true
            @onConnect()

            return

        @_socket.onclose = ( ce ) =>
            @isConnected = false
            @onDisconnect()

            return

        @_socket.onmessage = ( message ) =>
            data = JSON.parse message.data
            return if not data.key or not data.value

            responseFunc = ( resp ) =>
                @_socket.send(
                    createMessage CallbackMessageKey, resp, data.callbackId
                )

            if data.key of @_receiveHandlers
                for handler in @_receiveHandlers[ data.key ]
                    handler data.value, responseFunc, data.callbackId if handler
            else
                console.log "Warning, no handlers for message key #{data.key}"
                console.log @_receiveHandlers

            return

        @_socket.onerror = ( err ) =>
            @isConnected = false
            @onError()

            return

        return

    disconnect: () ->
        do @socket.close if @isConnected

    registerReceiveHandler: ( key, handler ) ->
        return if typeof key isnt 'string'

        # Init handlers array
        if key not of @_receiveHandlers
            @_receiveHandlers[ key ] = [ ]

        # Add the handler
        @_receiveHandlers[ key ].push handler

        return

    # Send data to the engine.
    send: ( key, data, cb = null ) ->
        return if not @isConnected

        cbId = ""

        if cb isnt null
            cbId = uuid.v4()
            @_callbackHandlers[ cbId ] = cb

        @_socket.send createMessage key, data, cbId

module.exports = Dash
