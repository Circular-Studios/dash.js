chai = require 'chai'
chai.should()

DashEngine = require '../source/js/engine'
mockServer = require './mockserver'

describe "Dash Connector", ->
    before mockServer.startServer
    after  mockServer.endServer

    it "isConnected should be false initially", ( testComplete ) ->
        dash = new DashEngine
        dash.isConnected.should.equal false
        do testComplete

    it "Should send messages", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            server.registerReceiveHandler 'black_hole', ( data ) ->
                data.should.equal 'test'

            dash.send 'black_hole', 'test', ->
                do done

    it "Should receive messages", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            dash.registerReceiveHandler 'black_hole', ( data ) ->
                data.should.equal 'test'

            server.send 'black_hole', 'test', ( res ) ->
                do done

    it "Should send responses", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            dash.registerReceiveHandler 'black_hole', ( data ) ->
                data.should.equal 'test'
                return myRes: 'done'

            server.send 'black_hole', 'test', ( res ) ->
                res.myRes.should.equal 'done'
                do done

    it "Should receive responses", ( testComplete ) ->
        mockServer.run testComplete, ( dash, server, done ) ->
            server.registerReceiveHandler 'black_hole', ( data ) ->
                data.should.equal 'test'
                return myRes: 'done'

            dash.send 'black_hole', 'test', ( res ) ->
                res.myRes.should.equal 'done'
                do done
