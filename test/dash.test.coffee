chai = require 'chai'
chai.should()

Dash = require '../source/dash'
mockServer = require './mockserver'

describe "Dash", ->
    before mockServer.startServer
    after  mockServer.endServer

    it "isConnected should be false initially", ( testComplete ) ->
        dash = new Dash
        dash.isConnected.should.equal false
        do testComplete

    ##
    it "Should send messages", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            server.registerReceiveHandler 'black_hole', ( data ) ->
                data.should.equal 'test'
                do done

            dash.send 'black_hole', 'test'
    ##

    ###
    it "Should receive messages", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            dash.registerReceiveHandler 'black_hole', ( data ) ->
                console.log 'msg received'
                data.should.equal 'test'
                do done

            server.send 'black_hole', 'test'
    ###

    ###
    it "Should send responses", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            dash.registerReceiveHandler 'black_hole', ( data ) ->
                console.log 'msg received'
                data.should.equal 'test'
                return myRes: 'done!'

            server.send 'black_hole', 'test', ( res ) ->
                console.log 'res received'
                console.log res
                do done
    ###

    ###
    it "Should receive responses", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            server.registerReceiveHandler 'black_hole', ( data ) ->
                data.should.equal 'test'
                return myRes: 'done!'

            dash.send 'black_hole', 'test', ( res ) ->
                do done
    ###
