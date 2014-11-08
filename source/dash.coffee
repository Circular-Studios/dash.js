uuid = require( 'node-uuid' )

CallbackMessageKey = '__callback__'

Status =
    ok: 0
    error: 2

createMessage = ( key, value, callbackId = "" ) ->
    JSON.stringify
        key: key
        value: value
        callbackId: callbackId

errorFromDException = ( except ) ->
    return new Error except.msg, except.file, except.line

callbackResponseHandler = ( cb ) ->
    return ( response ) ->
        res = typeof response is string ? JSON.parse response : response

        # Handle success, warnings, and errors
        if res.status is Status.ok
            cb res.data
        else if res.status is Status.error
            throw errorFromDException res.data

emptyResponseHandler = callbackResponseHandler( ( resData ) -> )

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
        @registerReceiveHandler CallbackMessageKey, ( msg, cbId ) =>
            if cbId of @_callbackHandlers
                @_callbackHandlers[ cbId ] msg
            else
                console.error "Rogue callback received: ", cbId

    # Connect to the engine.
    connect: ( port, address = "localhost", route = "ws" ) ->
        @_socket = new WebSocket "ws://#{address}:#{port}/#{route}"

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
            if not data.key or not data.value
                throw new Error "Invalid message format"

            if data.key of @_receiveHandlers
                for handler in @_receiveHandlers[ data.key ]
                    eventResponse = { }
                    try
                        response = handler data.value, data.callbackId

                        if response is undefined
                            eventResponse.data = 'success'
                        else
                            eventResponse.data = response

                        eventResponse.status = Status.ok
                    catch e
                        eventResponse.data =
                            msg: e.message
                            line: e.lineNumber
                            file: e.fileName
                        eventResponse.status = Status.error

                    @send CallbackMessageKey, eventResponse, data.callbackId
            else
                console.warn "No handlers for message key #{data.key}"
                console.log @_receiveHandlers

            return

        @_socket.onerror = ( err ) =>
            @isConnected = false
            @onError( err )

            return

        return

    disconnect: () ->
        do @socket.close if @isConnected

    registerReceiveHandler: ( key, handler ) ->
        if typeof key isnt 'string'
            throw new Error "Key must be of type string."

        # Init handlers array
        if key not of @_receiveHandlers
            @_receiveHandlers[ key ] = [ ]

        # Add the handler
        @_receiveHandlers[ key ].push handler

        return

    # Send data to the engine.
    send: ( key, data, cb = emptyResponseHandler ) ->
        return if not @isConnected

        cbId = uuid.v4()
        @_callbackHandlers[ cbId ] = cb
        @_socket.send createMessage key, data, cbId

    # Actual helper API functions.
    refreshGame: ->
        @send "dgame:refresh", { }

    refreshObject: ( name, desc ) ->
        params =
            objectName: name
            description: desc

        @send "object:refresh", params

    refreshComponent: ( objectName, componentName, componentDesc ) ->
        params =
            objectName: objectName
            componentName: componentName
            description: componentDesc

        @send "object:component:refresh", params

    getObjects: ( cb ) ->
        @send "dgame:scene:get_objects", { }, callbackResponseHandler( cb )

module.exports = Dash
