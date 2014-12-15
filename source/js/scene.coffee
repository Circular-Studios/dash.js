class GameObject
  Children: [ ]

  constructor: ( desc, scene ) ->
    @scene = scene

    for prop, value of desc
      # If it's children, create a gameobject for each one
      if prop is "Children"
        for child in value
          @Children.push new GameObject child, scene
      else # Else just copy the value
        @[ prop ] = value

  save: ->
    @scene.dash.refreshObject @Name, this

class DashScene
  # Scene object tree
  objects: []

  # Pass through for GameObject class
  GameObject: GameObject

  constructor: ( dash ) ->
    @dash = dash

  getObjects: ( cb ) ->
    @dash.engine.send "dgame:scene:get_objects", { }, ( objs ) =>
      for obj in objs
        @objects.push new GameObject obj, this

      console.log @objects
      console.log objs
      cb @objects

module.exports = DashScene
