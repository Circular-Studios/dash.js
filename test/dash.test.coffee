chai = require 'chai'
chai.should()

Dash = require '../source/dash'
mockServer = require './mockserver'

describe "Dash", ->
    before mockServer.startServer
    after  mockServer.endServer

    ###
    before () ->
        console.log 'before'
    after () ->
        console.log 'after'
    ###

    it "isConnected should be false initially", ->
        dash = new Dash
        dash.isConnected.should.equal false

    it "Should send messages", ->
        mockServer.run ( dash, server, done ) ->
            server.registerReceiveHandler 'black_hole', ( data ) ->
                data.should.equal 'test'
                do done

            dash.send 'black_hole', 'test'

    it "Should receive messages", ->
        mockServer.run ( dash, server, done ) ->
            dash.registerReceiveHandler 'black_hole', ( data ) ->
                data.should.equal 'test'
                do done

            server.send 'black_hole', 'test'

    it "Should send responses", ->
        mockServer.run ( dash, server, done ) ->
            dash.registerReceiveHandler 'black_hole', ( data ) ->
                data.should.equal 'test'
                return myRes: 'done!'

            server.send 'black_hole', 'test', ( res ) ->
                console.log res
                do done
