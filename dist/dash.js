!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.dash=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DashConsole, DashConsoleList, dash;

dash = require('../main');

DashConsoleList = React.createClass({
  render: function() {
    var logItem;
    logItem = function(item) {
      return React.createElement("li", {
        "key": item.id
      }, item.msg);
    };
    return React.createElement("ul", null, this.props.items.map(logItem));
  }
});

DashConsole = React.createClass({
  getInitialState: function() {
    return {
      items: [],
      keyCount: 0
    };
  },
  log: function(item) {
    nextItems;
    var key, nextItems;
    key = this.state.keyCount.value;
    if (typeof item === "string") {
      nextItems = this.state.items.concat([
        {
          msg: item,
          id: key
        }
      ]);
    } else {
      item.id = key;
      nextItems = this.state.items.concat([item]);
    }
    return this.setState({
      items: nextItems,
      keyCount: key++
    });
  },
  render: function() {
    return React.createElement("div", null, React.createElement(DashConsoleList, {
      "items": this.state.items
    }));
  }
});

dash.layout.registerElement('DashConsole', function() {
  return React.createElement(DashConsole, {
    "class": "console"
  });
}, function(element) {
  return dash.console = element;
});

module.exports = DashConsole;



},{"../main":9}],2:[function(require,module,exports){
var DashObjects, dash;

dash = require('../main');

DashObjects = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  onClick: function(i) {
    return dash.panels.propertyEditor.setProps({
      data: dash.scene.objects[i]
    });
  },
  removeObject: function(i) {
    dash.scene.objects.splice(i, 1);
    return this.setProps({
      data: dash.scene.objects
    });
  },
  render: function() {
    return React.createElement("div", null, this.props.data.map(function(node, i) {
      var close, label, self;
      self = this;
      close = new React.DOM.span({
        className: 'close-button',
        onClick: function() {
          return self.removeObject(i);
        }
      }, '(x)');
      label = new React.DOM.span({
        className: 'node',
        onClick: function() {
          return self.onClick(i);
        }
      }, node.Name, close);
      return React.createElement(TreeView, {
        "key": node.Name + '|' + i,
        "nodeLabel": label,
        "defaultCollapsed": true
      }, node.Children.map(function(child, j) {
        return React.createElement(TreeView, {
          "nodeLabel": label,
          "key": child.Type + '|' + j,
          "defaultCollapsed": false
        }, React.createElement("div", {
          "className": "info"
        }, child.Type));
      }));
    }, this));
  }
});

dash.layout.registerElement('ObjectBrowser', function() {
  return React.createElement(DashObjects, {
    "data": []
  });
}, function(element) {
  return dash.panels.objectBrowser = element;
});

module.exports = DashObjects;



},{"../main":9}],3:[function(require,module,exports){
var DashProperties, dash;

dash = require('../main');

DashProperties = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  modifyProperty: function(event) {
    console.log(this.props.data.Components[event.target.name]);
    this.props.data.Components[event.target.name] = event.target.value;
    console.log(this.props.data.Components[event.target.name]);
    return true;
  },
  renderProperty: function(property, value) {
    switch (property) {
      case "Asset":
        return React.createElement("input", {
          "type": "text",
          "name": property,
          "size": "20",
          "value": value,
          "onChange": this.modifyProperty
        });
    }
  },
  saveProperties: function() {
    return this.props.data.save;
  },
  render: function() {
    return React.createElement("div", null, " ", this.props.data.Components.map(function(node, i) {
      var label, property, value;
      label = React.createElement("span", {
        "className": "node"
      }, node.Type);
      return React.createElement(TreeView, {
        "key": node.Type + '|' + i,
        "nodeLabel": label,
        "defaultCollapsed": false
      }, (function() {
        var _results;
        _results = [];
        for (property in node) {
          value = node[property];
          _results.push(this.renderProperty(property, value));
        }
        return _results;
      }).call(this));
    }, this), " ");
  }
});

dash.layout.registerElement('Properties', function() {
  return React.createElement(DashProperties, {
    "data": {
      Components: []
    }
  });
}, function(element) {
  return dash.panels.propertyEditor = element;
});

module.exports = DashProperties;



},{"../main":9}],4:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng;

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  //
  // Moderately fast, high quality
  if (typeof(_global.require) == 'function') {
    try {
      var _rb = _global.require('crypto').randomBytes;
      _rng = _rb && function() {return _rb(16);};
    } catch(e) {}
  }

  if (!_rng && _global.crypto && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    //
    // Moderately fast, high quality
    var _rnds8 = new Uint8Array(16);
    _rng = function whatwgRNG() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var  _rnds = new Array(16);
    _rng = function() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  // Buffer class to use
  var BufferClass = typeof(_global.Buffer) == 'function' ? _global.Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});
  } else if (typeof(module) != 'undefined' && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else {
    // Publish as global (in browsers)
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    };

    _global.uuid = uuid;
  }
}).call(this);

},{}],5:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],6:[function(require,module,exports){
var Dash, DashEngine, DashLayout, DashScene;

DashEngine = require('./engine');

DashLayout = require('./layout');

DashScene = require('./scene');

Dash = (function() {
  Dash.prototype.engine = {};

  Dash.prototype.scene = {};

  Dash.prototype.panels = {
    objectBrowser: {},
    propertiesEditor: {}
  };

  Dash.prototype.console = {};

  Dash.prototype.layout = {};

  function Dash() {
    this.engine = new DashEngine(this);
    this.scene = new DashScene(this);
    this.layout = new DashLayout(this);
  }

  return Dash;

})();

module.exports = Dash;



},{"./engine":7,"./layout":8,"./scene":10}],7:[function(require,module,exports){
var CallbackMessageKey, DashEngine, Status, WebSocket, callbackResponseHandler, createMessage, emptyResponseHandler, errorFromDException, uuid, ws;

uuid = require('node-uuid');

ws = require('ws');

WebSocket = WebSocket || ws;

CallbackMessageKey = '__callback__';

Status = {
  ok: 0,
  error: 2
};

createMessage = function(key, value, callbackId) {
  if (callbackId == null) {
    callbackId = "";
  }
  return JSON.stringify({
    key: key,
    value: value,
    callbackId: callbackId
  });
};

errorFromDException = function(except) {
  return new Error(except.msg, except.file, except.line);
};

callbackResponseHandler = function(cb) {
  return function(res) {
    if (res.status === Status.ok) {
      return cb(res.data);
    } else if (res.status === Status.error) {
      throw errorFromDException(res.data);
    }
  };
};

emptyResponseHandler = callbackResponseHandler(function(resData) {});

DashEngine = (function() {
  DashEngine.prototype.isConnected = false;

  DashEngine.prototype._socket = null;

  DashEngine.prototype._receiveHandlers = {};

  DashEngine.prototype._callbackHandlers = {};

  DashEngine.prototype.onConnect = function() {};

  DashEngine.prototype.onDisconnect = function() {};

  DashEngine.prototype.onError = function(err) {};

  function DashEngine(dash) {
    this.dash = dash;
    this._receiveHandlers = {};
    this.registerReceiveHandler(CallbackMessageKey, (function(_this) {
      return function(msg, cbId) {
        if (cbId in _this._callbackHandlers) {
          return _this._callbackHandlers[cbId](msg);
        } else {
          return console.error("Rogue callback received: ", cbId);
        }
      };
    })(this));
  }

  DashEngine.prototype.connect = function(port, address, route) {
    if (address == null) {
      address = "localhost";
    }
    if (route == null) {
      route = "ws";
    }
    this._socket = new WebSocket("ws://" + address + ":" + port + "/" + route);
    return this._init();
  };

  DashEngine.prototype._init = function() {
    this._socket.onopen = (function(_this) {
      return function(oe) {
        _this.isConnected = true;
        _this.onConnect();
      };
    })(this);
    this._socket.onclose = (function(_this) {
      return function(ce) {
        _this.isConnected = false;
        _this.onDisconnect();
      };
    })(this);
    this._socket.onmessage = (function(_this) {
      return function(message) {
        var data, e, eventResponse, handler, response, _i, _len, _ref;
        data = JSON.parse(message.data);
        if (!data.key || !data.value) {
          throw new Error("Invalid message format");
        }
        if (data.key in _this._receiveHandlers) {
          _ref = _this._receiveHandlers[data.key];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            handler = _ref[_i];
            eventResponse = {};
            try {
              response = handler(data.value, data.callbackId);
              if (response === void 0) {
                eventResponse.data = 'success';
              } else {
                eventResponse.data = response;
              }
              eventResponse.status = Status.ok;
            } catch (_error) {
              e = _error;
              eventResponse.data = {
                msg: e.message,
                line: e.lineNumber,
                file: e.fileName
              };
              eventResponse.status = Status.error;
            }
            if (data.key !== CallbackMessageKey) {
              _this.send(CallbackMessageKey, eventResponse, emptyResponseHandler, data.callbackId);
            }
          }
        } else {
          console.warn("No handlers for message key " + data.key);
          console.log(_this._receiveHandlers);
        }
      };
    })(this);
    this._socket.onerror = (function(_this) {
      return function(err) {
        _this.isConnected = false;
        _this.onError(err);
      };
    })(this);
  };

  DashEngine.prototype.disconnect = function() {
    if (this.isConnected) {
      return this._socket.close();
    }
  };

  DashEngine.prototype.registerReceiveHandler = function(key, handler) {
    if (typeof key !== 'string') {
      throw new Error("Key must be of type string.");
    }
    if (!(key in this._receiveHandlers)) {
      this._receiveHandlers[key] = [];
    }
    this._receiveHandlers[key].push(handler);
  };

  DashEngine.prototype.send = function(key, data, cb, cbId) {
    if (cb == null) {
      cb = emptyResponseHandler;
    }
    if (cbId == null) {
      cbId = null;
    }
    if (!this.isConnected) {
      throw new Error("Not connected to server, can't send message");
    }
    if (key !== CallbackMessageKey) {
      if (cbId === null) {
        cbId = uuid.v4();
      }
      this._callbackHandlers[cbId] = callbackResponseHandler(cb);
    }
    return this._socket.send(createMessage(key, data, cbId));
  };

  DashEngine.prototype.refreshGame = function() {
    return this.send("dgame:refresh", {});
  };

  DashEngine.prototype.refreshObject = function(name, desc) {
    var params;
    params = {
      objectName: name,
      description: desc
    };
    return this.send("object:refresh", params);
  };

  DashEngine.prototype.refreshComponent = function(objectName, componentName, componentDesc) {
    var params;
    params = {
      objectName: objectName,
      componentName: componentName,
      description: componentDesc
    };
    return this.send("object:component:refresh", params);
  };

  return DashEngine;

})();

module.exports = DashEngine;



},{"node-uuid":4,"ws":5}],8:[function(require,module,exports){
var DashLayout, config;

DashLayout = (function() {
  function DashLayout() {
    this.golden = new GoldenLayout(config);
    this.golden.init();
  }

  DashLayout.prototype.registerElement = function(name, elementCb, storeElementCb) {
    if (storeElementCb == null) {
      storeElementCb = null;
    }
    return this.golden.registerComponent(name, function(container, state) {
      var result;
      result = React.render(elementCb(), container.getElement()[0]);
      if (storeElementCb) {
        storeElementCb(result);
      }
      return result.setState(state);
    });
  };

  return DashLayout;

})();

module.exports = DashLayout;

config = {
  content: [
    {
      type: "row",
      content: [
        {
          type: "stack",
          width: 15,
          content: [
            {
              type: "component",
              componentName: "ObjectBrowser",
              title: "Object Browser"
            }
          ]
        }, {
          type: "column",
          width: 70,
          content: [
            {
              type: "component",
              componentName: "DashConnect",
              title: "Connect to Dash"
            }, {
              type: "component",
              height: 20,
              title: "Console",
              componentName: "DashConsole"
            }
          ]
        }, {
          type: "row",
          content: [
            {
              type: "stack",
              width: 15,
              content: [
                {
                  type: "component",
                  componentName: "Properties",
                  title: "Properties"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};



},{}],9:[function(require,module,exports){
var Dash, dash;

Dash = require('./dash');

dash = new Dash;

dash.engine.registerReceiveHandler("dash:logger:message", function(data) {
  return dash.console.log(data);
});

dash.engine.registerReceiveHandler("dash:perf:frametime", function(data) {});

dash.engine.registerReceiveHandler("dash:perf:zone_data", function(data) {});

dash.engine.onConnect = function() {
  dash.console.log('Connected to Dash.');
  return dash.scene.getObjects(function(objs) {
    console.log(objs);
    return dash.panels.objectBrowser.setProps({
      data: objs
    });
  });
};

dash.layout.registerElement('DashConnect', function() {
  var connectToDash;
  connectToDash = function() {
    dash.engine.connect(8008);
    return dash.console.log('Connecting to Dash...');
  };
  return React.createElement("button", {
    "className": "connect",
    "onClick": connectToDash
  }, "Connect to Dash");
});

module.exports = dash;



},{"./dash":6}],10:[function(require,module,exports){
var DashScene, GameObject;

GameObject = (function() {
  GameObject.prototype.Children = [];

  function GameObject(desc, scene) {
    var child, prop, value, _i, _len;
    this.scene = scene;
    for (prop in desc) {
      value = desc[prop];
      if (prop === "Children") {
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          child = value[_i];
          this.Children.push(new GameObject(child, scene));
        }
      } else {
        this[prop] = value;
      }
    }
  }

  GameObject.prototype.save = function() {
    return this.scene.dash.refreshObject(this.Name, this);
  };

  return GameObject;

})();

DashScene = (function() {
  DashScene.prototype.objects = [];

  DashScene.prototype.GameObject = GameObject;

  function DashScene(dash) {
    this.dash = dash;
  }

  DashScene.prototype.getObjects = function(cb) {
    return this.dash.engine.send("dgame:scene:get_objects", {}, (function(_this) {
      return function(objs) {
        var obj, _i, _len;
        for (_i = 0, _len = objs.length; _i < _len; _i++) {
          obj = objs[_i];
          _this.objects.push(new GameObject(obj, _this));
        }
        console.log(_this.objects);
        console.log(objs);
        return cb(_this.objects);
      };
    })(this));
  };

  return DashScene;

})();

module.exports = DashScene;



},{}]},{},[1,2,3])(3)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiRzpcXERvY3VtZW50c1xcUHJvamVjdHNcXGRhc2guanNcXHNvdXJjZVxcanNcXHJlYWN0LWVsZW1lbnRzXFxjb25zb2xlLmNqc3giLCJHOlxcRG9jdW1lbnRzXFxQcm9qZWN0c1xcZGFzaC5qc1xcc291cmNlXFxqc1xccmVhY3QtZWxlbWVudHNcXG9iamVjdC1icm93c2VyLmNqc3giLCJHOlxcRG9jdW1lbnRzXFxQcm9qZWN0c1xcZGFzaC5qc1xcc291cmNlXFxqc1xccmVhY3QtZWxlbWVudHNcXHByb3BlcnRpZXMuY2pzeCIsIkc6L0RvY3VtZW50cy9Qcm9qZWN0cy9kYXNoLmpzL25vZGVfbW9kdWxlcy9ub2RlLXV1aWQvdXVpZC5qcyIsIkc6L0RvY3VtZW50cy9Qcm9qZWN0cy9kYXNoLmpzL25vZGVfbW9kdWxlcy93cy9saWIvYnJvd3Nlci5qcyIsIkc6XFxEb2N1bWVudHNcXFByb2plY3RzXFxkYXNoLmpzXFxzb3VyY2VcXGpzXFxkYXNoLmNvZmZlZSIsIkc6XFxEb2N1bWVudHNcXFByb2plY3RzXFxkYXNoLmpzXFxzb3VyY2VcXGpzXFxlbmdpbmUuY29mZmVlIiwiRzpcXERvY3VtZW50c1xcUHJvamVjdHNcXGRhc2guanNcXHNvdXJjZVxcanNcXGxheW91dC5jb2ZmZWUiLCJHOlxcRG9jdW1lbnRzXFxQcm9qZWN0c1xcZGFzaC5qc1xcc291cmNlXFxqc1xcbWFpbi5janN4IiwiRzpcXERvY3VtZW50c1xcUHJvamVjdHNcXGRhc2guanNcXHNvdXJjZVxcanNcXHNjZW5lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsa0NBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBQVAsQ0FBQTs7QUFBQSxlQUVBLEdBQWtCLEtBQUssQ0FBQyxXQUFOLENBQ2hCO0FBQUEsRUFBQSxNQUFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QWtELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFFLElBQUYsR0FBQTtBQUNoRCxZQUFBLGFBQUE7QUFBQSxhQUFBLDJDQUFBO3lCQUFBO0FBQ0UsVUFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBa0IsSUFBQSxVQUFBLENBQVcsR0FBWCxFQUFnQixLQUFoQixDQUFsQixDQUFBLENBREY7QUFBQSxTQUFBO0FBQUEsUUFHQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQUMsQ0FBQSxPQUFiLENBSEEsQ0FBQTtBQUFBLFFBSUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLENBSkEsQ0FBQTtlQUtBLEVBQUEsQ0FBRyxLQUFDLENBQUEsT0FBSixFQU5nRDtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxELEVBRFU7RUFBQSxDQVJaLENBQUE7O21CQUFBOztJQW5CRixDQUFBOztBQUFBLE1Bb0NNLENBQUMsT0FBUCxHQUFpQixTQXBDakIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJkYXNoID0gcmVxdWlyZSAnLi4vbWFpbidcblxuRGFzaENvbnNvbGVMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgcmVuZGVyOiAtPlxuICAgIGxvZ0l0ZW0gPSAoIGl0ZW0gKSAtPiBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge1wia2V5XCI6ICggaXRlbS5pZCApfSwgKGl0ZW0ubXNnKSk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCAoIEBwcm9wcy5pdGVtcy5tYXAgbG9nSXRlbSApKVxuICAgIClcbkRhc2hDb25zb2xlID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHJldHVybiBpdGVtczogW10sIGtleUNvdW50OiAwXG4gIGxvZzogKCBpdGVtICkgLT5cbiAgICBuZXh0SXRlbXM7XG4gICAga2V5ID0gdGhpcy5zdGF0ZS5rZXlDb3VudC52YWx1ZTtcbiAgICBpZiB0eXBlb2YgaXRlbSBpcyBcInN0cmluZ1wiXG4gICAgICBuZXh0SXRlbXMgPSB0aGlzLnN0YXRlLml0ZW1zLmNvbmNhdCBbIHsgbXNnOiBpdGVtLCBpZDoga2V5IH0gXVxuICAgIGVsc2VcbiAgICAgIGl0ZW0uaWQgPSBrZXlcbiAgICAgIG5leHRJdGVtcyA9IHRoaXMuc3RhdGUuaXRlbXMuY29uY2F0IFsgaXRlbSBdXG5cbiAgICB0aGlzLnNldFN0YXRlIGl0ZW1zOiBuZXh0SXRlbXMsIGtleUNvdW50OiBrZXkrK1xuICByZW5kZXI6IC0+XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEYXNoQ29uc29sZUxpc3QsIHtcIml0ZW1zXCI6IChAc3RhdGUuaXRlbXMpfSlcbiAgICAgICkgKVxuXG5kYXNoLmxheW91dC5yZWdpc3RlckVsZW1lbnQoICdEYXNoQ29uc29sZScsXG4gICgpIC0+IFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaENvbnNvbGUsIHtcImNsYXNzXCI6IFwiY29uc29sZVwifSksXG4gICggZWxlbWVudCApIC0+IGRhc2guY29uc29sZSA9IGVsZW1lbnRcbilcblxubW9kdWxlLmV4cG9ydHMgPSBEYXNoQ29uc29sZVxuIiwiZGFzaCA9IHJlcXVpcmUgJy4uL21haW4nXG5cbkRhc2hPYmplY3RzID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgICByZXR1cm4gZGF0YTogW11cbiAgICBvbkNsaWNrOiAoIGkgKSAtPlxuICAgICAgZGFzaC5wYW5lbHMucHJvcGVydHlFZGl0b3Iuc2V0UHJvcHMgZGF0YTogZGFzaC5zY2VuZS5vYmplY3RzWyBpIF1cbiAgICByZW1vdmVPYmplY3Q6ICggaSApIC0+XG4gICAgICAjIFRPRE86IHRoaXMgb25seSByZW1vdmVzIHRoZSBvYmplY3Qgb24gdGhlIHRvb2xzIHNpZGVcbiAgICAgIGRhc2guc2NlbmUub2JqZWN0cy5zcGxpY2UgaSwgMVxuICAgICAgdGhpcy5zZXRQcm9wcyBkYXRhOiBkYXNoLnNjZW5lLm9iamVjdHNcbiAgICByZW5kZXI6IC0+XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICAgICAgKFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLm1hcCggKCBub2RlLCBpICkgLT5cbiAgICAgICAgICAgICAgc2VsZiA9IHRoaXNcbiAgICAgICAgICAgICAgY2xvc2UgPSBuZXcgUmVhY3QuRE9NLnNwYW4oXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2xvc2UtYnV0dG9uJ1xuICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgLT4gc2VsZi5yZW1vdmVPYmplY3QoIGkgKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJyh4KSdcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBsYWJlbCA9IG5ldyBSZWFjdC5ET00uc3BhbihcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdub2RlJ1xuICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgLT4gc2VsZi5vbkNsaWNrKCBpIClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5vZGUuTmFtZSwgY2xvc2VcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHJlZVZpZXcsIHtcImtleVwiOiAoIG5vZGUuTmFtZSArICd8JyArIGkgKSwgXCJub2RlTGFiZWxcIjogKCBsYWJlbCApLCBcImRlZmF1bHRDb2xsYXBzZWRcIjogKCB0cnVlICl9LFxuICAgICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICBub2RlLkNoaWxkcmVuLm1hcCAoIGNoaWxkLCBqICkgLT5cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUcmVlVmlldywge1wibm9kZUxhYmVsXCI6ICggbGFiZWwgKSwgXCJrZXlcIjogKCBjaGlsZC5UeXBlICsgJ3wnICsgaiApLCBcImRlZmF1bHRDb2xsYXBzZWRcIjogKCBmYWxzZSApfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJpbmZvXCJ9LCAoIGNoaWxkLlR5cGUgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAsIHRoaXMgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG5kYXNoLmxheW91dC5yZWdpc3RlckVsZW1lbnQoICdPYmplY3RCcm93c2VyJyxcbiAgKCkgLT4gUmVhY3QuY3JlYXRlRWxlbWVudChEYXNoT2JqZWN0cywge1wiZGF0YVwiOiAoIFsgXSApfSksXG4gICggZWxlbWVudCApIC0+IGRhc2gucGFuZWxzLm9iamVjdEJyb3dzZXIgPSBlbGVtZW50XG4pXG5cbm1vZHVsZS5leHBvcnRzID0gRGFzaE9iamVjdHNcbiIsImRhc2ggPSByZXF1aXJlICcuLi9tYWluJ1xuXG5EYXNoUHJvcGVydGllcyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gIGdldEluaXRpYWxTdGF0ZTogKCkgLT4gZGF0YTogW11cbiAgbW9kaWZ5UHJvcGVydHk6ICggZXZlbnQgKSAtPlxuICAgIGNvbnNvbGUubG9nIHRoaXMucHJvcHMuZGF0YS5Db21wb25lbnRzWyBldmVudC50YXJnZXQubmFtZSBdXG4gICAgdGhpcy5wcm9wcy5kYXRhLkNvbXBvbmVudHNbIGV2ZW50LnRhcmdldC5uYW1lIF0gPSBldmVudC50YXJnZXQudmFsdWVcbiAgICBjb25zb2xlLmxvZyB0aGlzLnByb3BzLmRhdGEuQ29tcG9uZW50c1sgZXZlbnQudGFyZ2V0Lm5hbWUgXVxuICAgIHJldHVybiB0cnVlXG4gIHJlbmRlclByb3BlcnR5OiAoIHByb3BlcnR5LCB2YWx1ZSApIC0+XG4gICAgc3dpdGNoIHByb3BlcnR5XG4gICAgICB3aGVuIFwiQXNzZXRcIlxuICAgICAgdGhlbiByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcInR5cGVcIjogXCJ0ZXh0XCIsIFwibmFtZVwiOiAoIHByb3BlcnR5ICksIFwic2l6ZVwiOiBcIjIwXCIsIFwidmFsdWVcIjogKCB2YWx1ZSApLCBcIm9uQ2hhbmdlXCI6ICggdGhpcy5tb2RpZnlQcm9wZXJ0eSApfSlcbiAgc2F2ZVByb3BlcnRpZXM6ICgpIC0+XG4gICAgdGhpcy5wcm9wcy5kYXRhLnNhdmVcbiAgcmVuZGVyOiAoKSAtPlxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiIFwiLCAoXG4gICAgICAgIHRoaXMucHJvcHMuZGF0YS5Db21wb25lbnRzLm1hcCggKCBub2RlLCBpICkgLT5cbiAgICAgICAgICBsYWJlbCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtcImNsYXNzTmFtZVwiOiBcIm5vZGVcIn0sICggbm9kZS5UeXBlICkpO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyZWVWaWV3LCB7XCJrZXlcIjogKCBub2RlLlR5cGUgKyAnfCcgKyBpICksIFwibm9kZUxhYmVsXCI6ICggbGFiZWwgKSwgXCJkZWZhdWx0Q29sbGFwc2VkXCI6ICggZmFsc2UgKX0sXG4gICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICBmb3IgcHJvcGVydHksIHZhbHVlIG9mIG5vZGVcbiAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyUHJvcGVydHkgcHJvcGVydHksIHZhbHVlXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkgKVxuICAgICAgICAsIHRoaXMgKVxuICAgICAgKSwgXCIgXCIpIClcblxuZGFzaC5sYXlvdXQucmVnaXN0ZXJFbGVtZW50KCAnUHJvcGVydGllcycsXG4gICgpIC0+IFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGFzaFByb3BlcnRpZXMsIHtcImRhdGFcIjogKCBDb21wb25lbnRzOiBbXSApfSlcbiAgKCBlbGVtZW50ICkgLT4gZGFzaC5wYW5lbHMucHJvcGVydHlFZGl0b3IgPSBlbGVtZW50XG4pXG5cbm1vZHVsZS5leHBvcnRzID0gRGFzaFByb3BlcnRpZXNcbiIsIi8vICAgICB1dWlkLmpzXG4vL1xuLy8gICAgIENvcHlyaWdodCAoYykgMjAxMC0yMDEyIFJvYmVydCBLaWVmZmVyXG4vLyAgICAgTUlUIExpY2Vuc2UgLSBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIF9nbG9iYWwgPSB0aGlzO1xuXG4gIC8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuICBXZSBmZWF0dXJlXG4gIC8vIGRldGVjdCB0byBkZXRlcm1pbmUgdGhlIGJlc3QgUk5HIHNvdXJjZSwgbm9ybWFsaXppbmcgdG8gYSBmdW5jdGlvbiB0aGF0XG4gIC8vIHJldHVybnMgMTI4LWJpdHMgb2YgcmFuZG9tbmVzcywgc2luY2UgdGhhdCdzIHdoYXQncyB1c3VhbGx5IHJlcXVpcmVkXG4gIHZhciBfcm5nO1xuXG4gIC8vIE5vZGUuanMgY3J5cHRvLWJhc2VkIFJORyAtIGh0dHA6Ly9ub2RlanMub3JnL2RvY3MvdjAuNi4yL2FwaS9jcnlwdG8uaHRtbFxuICAvL1xuICAvLyBNb2RlcmF0ZWx5IGZhc3QsIGhpZ2ggcXVhbGl0eVxuICBpZiAodHlwZW9mKF9nbG9iYWwucmVxdWlyZSkgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRyeSB7XG4gICAgICB2YXIgX3JiID0gX2dsb2JhbC5yZXF1aXJlKCdjcnlwdG8nKS5yYW5kb21CeXRlcztcbiAgICAgIF9ybmcgPSBfcmIgJiYgZnVuY3Rpb24oKSB7cmV0dXJuIF9yYigxNik7fTtcbiAgICB9IGNhdGNoKGUpIHt9XG4gIH1cblxuICBpZiAoIV9ybmcgJiYgX2dsb2JhbC5jcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIFdIQVRXRyBjcnlwdG8tYmFzZWQgUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICAgIC8vXG4gICAgLy8gTW9kZXJhdGVseSBmYXN0LCBoaWdoIHF1YWxpdHlcbiAgICB2YXIgX3JuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICAgIF9ybmcgPSBmdW5jdGlvbiB3aGF0d2dSTkcoKSB7XG4gICAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKF9ybmRzOCk7XG4gICAgICByZXR1cm4gX3JuZHM4O1xuICAgIH07XG4gIH1cblxuICBpZiAoIV9ybmcpIHtcbiAgICAvLyBNYXRoLnJhbmRvbSgpLWJhc2VkIChSTkcpXG4gICAgLy9cbiAgICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAgIC8vIHF1YWxpdHkuXG4gICAgdmFyICBfcm5kcyA9IG5ldyBBcnJheSgxNik7XG4gICAgX3JuZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgICBfcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9ybmRzO1xuICAgIH07XG4gIH1cblxuICAvLyBCdWZmZXIgY2xhc3MgdG8gdXNlXG4gIHZhciBCdWZmZXJDbGFzcyA9IHR5cGVvZihfZ2xvYmFsLkJ1ZmZlcikgPT0gJ2Z1bmN0aW9uJyA/IF9nbG9iYWwuQnVmZmVyIDogQXJyYXk7XG5cbiAgLy8gTWFwcyBmb3IgbnVtYmVyIDwtPiBoZXggc3RyaW5nIGNvbnZlcnNpb25cbiAgdmFyIF9ieXRlVG9IZXggPSBbXTtcbiAgdmFyIF9oZXhUb0J5dGUgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgIF9ieXRlVG9IZXhbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xuICAgIF9oZXhUb0J5dGVbX2J5dGVUb0hleFtpXV0gPSBpO1xuICB9XG5cbiAgLy8gKipgcGFyc2UoKWAgLSBQYXJzZSBhIFVVSUQgaW50byBpdCdzIGNvbXBvbmVudCBieXRlcyoqXG4gIGZ1bmN0aW9uIHBhcnNlKHMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgdmFyIGkgPSAoYnVmICYmIG9mZnNldCkgfHwgMCwgaWkgPSAwO1xuXG4gICAgYnVmID0gYnVmIHx8IFtdO1xuICAgIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bMC05YS1mXXsyfS9nLCBmdW5jdGlvbihvY3QpIHtcbiAgICAgIGlmIChpaSA8IDE2KSB7IC8vIERvbid0IG92ZXJmbG93IVxuICAgICAgICBidWZbaSArIGlpKytdID0gX2hleFRvQnl0ZVtvY3RdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gWmVybyBvdXQgcmVtYWluaW5nIGJ5dGVzIGlmIHN0cmluZyB3YXMgc2hvcnRcbiAgICB3aGlsZSAoaWkgPCAxNikge1xuICAgICAgYnVmW2kgKyBpaSsrXSA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIC8vICoqYHVucGFyc2UoKWAgLSBDb252ZXJ0IFVVSUQgYnl0ZSBhcnJheSAoYWxhIHBhcnNlKCkpIGludG8gYSBzdHJpbmcqKlxuICBmdW5jdGlvbiB1bnBhcnNlKGJ1Ziwgb2Zmc2V0KSB7XG4gICAgdmFyIGkgPSBvZmZzZXQgfHwgMCwgYnRoID0gX2J5dGVUb0hleDtcbiAgICByZXR1cm4gIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dO1xuICB9XG5cbiAgLy8gKipgdjEoKWAgLSBHZW5lcmF0ZSB0aW1lLWJhc2VkIFVVSUQqKlxuICAvL1xuICAvLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuICAvLyBhbmQgaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L3V1aWQuaHRtbFxuXG4gIC8vIHJhbmRvbSAjJ3Mgd2UgbmVlZCB0byBpbml0IG5vZGUgYW5kIGNsb2Nrc2VxXG4gIHZhciBfc2VlZEJ5dGVzID0gX3JuZygpO1xuXG4gIC8vIFBlciA0LjUsIGNyZWF0ZSBhbmQgNDgtYml0IG5vZGUgaWQsICg0NyByYW5kb20gYml0cyArIG11bHRpY2FzdCBiaXQgPSAxKVxuICB2YXIgX25vZGVJZCA9IFtcbiAgICBfc2VlZEJ5dGVzWzBdIHwgMHgwMSxcbiAgICBfc2VlZEJ5dGVzWzFdLCBfc2VlZEJ5dGVzWzJdLCBfc2VlZEJ5dGVzWzNdLCBfc2VlZEJ5dGVzWzRdLCBfc2VlZEJ5dGVzWzVdXG4gIF07XG5cbiAgLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbiAgdmFyIF9jbG9ja3NlcSA9IChfc2VlZEJ5dGVzWzZdIDw8IDggfCBfc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcblxuICAvLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcbiAgdmFyIF9sYXN0TVNlY3MgPSAwLCBfbGFzdE5TZWNzID0gMDtcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG4gIGZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gICAgdmFyIGIgPSBidWYgfHwgW107XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT0gbnVsbCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7XG5cbiAgICAvLyBVVUlEIHRpbWVzdGFtcHMgYXJlIDEwMCBuYW5vLXNlY29uZCB1bml0cyBzaW5jZSB0aGUgR3JlZ29yaWFuIGVwb2NoLFxuICAgIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gICAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gICAgLy8gKDEwMC1uYW5vc2Vjb25kcyBvZmZzZXQgZnJvbSBtc2Vjcykgc2luY2UgdW5peCBlcG9jaCwgMTk3MC0wMS0wMSAwMDowMC5cbiAgICB2YXIgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9IG51bGwgPyBvcHRpb25zLm1zZWNzIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAvLyBQZXIgNC4yLjEuMiwgdXNlIGNvdW50IG9mIHV1aWQncyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjdXJyZW50IGNsb2NrXG4gICAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcbiAgICB2YXIgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9IG51bGwgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7XG5cbiAgICAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG4gICAgdmFyIGR0ID0gKG1zZWNzIC0gX2xhc3RNU2VjcykgKyAobnNlY3MgLSBfbGFzdE5TZWNzKS8xMDAwMDtcblxuICAgIC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cbiAgICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgICAvLyB0aW1lIGludGVydmFsXG4gICAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09IG51bGwpIHtcbiAgICAgIG5zZWNzID0gMDtcbiAgICB9XG5cbiAgICAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG4gICAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3V1aWQudjEoKTogQ2FuXFwndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWMnKTtcbiAgICB9XG5cbiAgICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gICAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICAgIF9jbG9ja3NlcSA9IGNsb2Nrc2VxO1xuXG4gICAgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG4gICAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7XG5cbiAgICAvLyBgdGltZV9sb3dgXG4gICAgdmFyIHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICAgIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgJiAweGZmO1xuXG4gICAgLy8gYHRpbWVfbWlkYFxuICAgIHZhciB0bWggPSAobXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwKSAmIDB4ZmZmZmZmZjtcbiAgICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICAgIGJbaSsrXSA9IHRtaCAmIDB4ZmY7XG5cbiAgICAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuICAgIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cbiAgICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjtcblxuICAgIC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuICAgIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDtcblxuICAgIC8vIGBjbG9ja19zZXFfbG93YFxuICAgIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjtcblxuICAgIC8vIGBub2RlYFxuICAgIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCA2OyBuKyspIHtcbiAgICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmID8gYnVmIDogdW5wYXJzZShiKTtcbiAgfVxuXG4gIC8vICoqYHY0KClgIC0gR2VuZXJhdGUgcmFuZG9tIFVVSUQqKlxuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZCBmb3IgQVBJIGRldGFpbHNcbiAgZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgICAvLyBEZXByZWNhdGVkIC0gJ2Zvcm1hdCcgYXJndW1lbnQsIGFzIHN1cHBvcnRlZCBpbiB2MS4yXG4gICAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG5cbiAgICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgICBidWYgPSBvcHRpb25zID09ICdiaW5hcnknID8gbmV3IEJ1ZmZlckNsYXNzKDE2KSA6IG51bGw7XG4gICAgICBvcHRpb25zID0gbnVsbDtcbiAgICB9XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBfcm5nKSgpO1xuXG4gICAgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuICAgIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG5cbiAgICAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcbiAgICBpZiAoYnVmKSB7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgMTY7IGlpKyspIHtcbiAgICAgICAgYnVmW2kgKyBpaV0gPSBybmRzW2lpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVmIHx8IHVucGFyc2Uocm5kcyk7XG4gIH1cblxuICAvLyBFeHBvcnQgcHVibGljIEFQSVxuICB2YXIgdXVpZCA9IHY0O1xuICB1dWlkLnYxID0gdjE7XG4gIHV1aWQudjQgPSB2NDtcbiAgdXVpZC5wYXJzZSA9IHBhcnNlO1xuICB1dWlkLnVucGFyc2UgPSB1bnBhcnNlO1xuICB1dWlkLkJ1ZmZlckNsYXNzID0gQnVmZmVyQ2xhc3M7XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIFB1Ymxpc2ggYXMgQU1EIG1vZHVsZVxuICAgIGRlZmluZShmdW5jdGlvbigpIHtyZXR1cm4gdXVpZDt9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YobW9kdWxlKSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vIFB1Ymxpc2ggYXMgbm9kZS5qcyBtb2R1bGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gUHVibGlzaCBhcyBnbG9iYWwgKGluIGJyb3dzZXJzKVxuICAgIHZhciBfcHJldmlvdXNSb290ID0gX2dsb2JhbC51dWlkO1xuXG4gICAgLy8gKipgbm9Db25mbGljdCgpYCAtIChicm93c2VyIG9ubHkpIHRvIHJlc2V0IGdsb2JhbCAndXVpZCcgdmFyKipcbiAgICB1dWlkLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgIF9nbG9iYWwudXVpZCA9IF9wcmV2aW91c1Jvb3Q7XG4gICAgICByZXR1cm4gdXVpZDtcbiAgICB9O1xuXG4gICAgX2dsb2JhbC51dWlkID0gdXVpZDtcbiAgfVxufSkuY2FsbCh0aGlzKTtcbiIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBnbG9iYWwgPSAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSgpO1xuXG4vKipcbiAqIFdlYlNvY2tldCBjb25zdHJ1Y3Rvci5cbiAqL1xuXG52YXIgV2ViU29ja2V0ID0gZ2xvYmFsLldlYlNvY2tldCB8fCBnbG9iYWwuTW96V2ViU29ja2V0O1xuXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gV2ViU29ja2V0ID8gd3MgOiBudWxsO1xuXG4vKipcbiAqIFdlYlNvY2tldCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBUaGUgdGhpcmQgYG9wdHNgIG9wdGlvbnMgb2JqZWN0IGdldHMgaWdub3JlZCBpbiB3ZWIgYnJvd3NlcnMsIHNpbmNlIGl0J3NcbiAqIG5vbi1zdGFuZGFyZCwgYW5kIHRocm93cyBhIFR5cGVFcnJvciBpZiBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yLlxuICogU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZWluYXJvcy93cy9pc3N1ZXMvMjI3XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVyaVxuICogQHBhcmFtIHtBcnJheX0gcHJvdG9jb2xzIChvcHRpb25hbClcbiAqIEBwYXJhbSB7T2JqZWN0KSBvcHRzIChvcHRpb25hbClcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gd3ModXJpLCBwcm90b2NvbHMsIG9wdHMpIHtcbiAgdmFyIGluc3RhbmNlO1xuICBpZiAocHJvdG9jb2xzKSB7XG4gICAgaW5zdGFuY2UgPSBuZXcgV2ViU29ja2V0KHVyaSwgcHJvdG9jb2xzKTtcbiAgfSBlbHNlIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBXZWJTb2NrZXQodXJpKTtcbiAgfVxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbmlmIChXZWJTb2NrZXQpIHdzLnByb3RvdHlwZSA9IFdlYlNvY2tldC5wcm90b3R5cGU7XG4iLCJEYXNoRW5naW5lID0gcmVxdWlyZSAnLi9lbmdpbmUnXG5EYXNoTGF5b3V0ID0gcmVxdWlyZSAnLi9sYXlvdXQnXG5EYXNoU2NlbmUgID0gcmVxdWlyZSAnLi9zY2VuZSdcblxuY2xhc3MgRGFzaFxuICBlbmdpbmU6IHsgfVxuICBzY2VuZTogeyB9XG4gIHBhbmVsczpcbiAgICBvYmplY3RCcm93c2VyOiB7IH1cbiAgICBwcm9wZXJ0aWVzRWRpdG9yOiB7IH1cbiAgY29uc29sZTogeyB9XG4gIGxheW91dDogeyB9XG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVuZ2luZSA9IG5ldyBEYXNoRW5naW5lIHRoaXNcbiAgICBAc2NlbmUgID0gbmV3IERhc2hTY2VuZSB0aGlzXG4gICAgQGxheW91dCA9IG5ldyBEYXNoTGF5b3V0IHRoaXNcblxubW9kdWxlLmV4cG9ydHMgPSBEYXNoXG4iLCJ1dWlkID0gcmVxdWlyZSAnbm9kZS11dWlkJ1xud3MgICA9IHJlcXVpcmUgJ3dzJ1xuXG5XZWJTb2NrZXQgPSBXZWJTb2NrZXQgfHwgd3NcblxuQ2FsbGJhY2tNZXNzYWdlS2V5ID0gJ19fY2FsbGJhY2tfXydcblxuU3RhdHVzID1cbiAgICBvazogMFxuICAgIGVycm9yOiAyXG5cbmNyZWF0ZU1lc3NhZ2UgPSAoIGtleSwgdmFsdWUsIGNhbGxiYWNrSWQgPSBcIlwiICkgLT5cbiAgICBKU09OLnN0cmluZ2lmeVxuICAgICAgICBrZXk6IGtleVxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgY2FsbGJhY2tJZDogY2FsbGJhY2tJZFxuXG5lcnJvckZyb21ERXhjZXB0aW9uID0gKCBleGNlcHQgKSAtPlxuICAgIHJldHVybiBuZXcgRXJyb3IgZXhjZXB0Lm1zZywgZXhjZXB0LmZpbGUsIGV4Y2VwdC5saW5lXG5cbmNhbGxiYWNrUmVzcG9uc2VIYW5kbGVyID0gKCBjYiApIC0+XG4gICAgcmV0dXJuICggcmVzICkgLT5cbiAgICAgICAgIyBIYW5kbGUgc3VjY2Vzcywgd2FybmluZ3MsIGFuZCBlcnJvcnNcbiAgICAgICAgaWYgcmVzLnN0YXR1cyBpcyBTdGF0dXMub2tcbiAgICAgICAgICAgIGNiIHJlcy5kYXRhXG4gICAgICAgIGVsc2UgaWYgcmVzLnN0YXR1cyBpcyBTdGF0dXMuZXJyb3JcbiAgICAgICAgICAgIHRocm93IGVycm9yRnJvbURFeGNlcHRpb24gcmVzLmRhdGFcblxuZW1wdHlSZXNwb25zZUhhbmRsZXIgPSBjYWxsYmFja1Jlc3BvbnNlSGFuZGxlciggKCByZXNEYXRhICkgLT4gKVxuXG5jbGFzcyBEYXNoRW5naW5lXG4gICAgaXNDb25uZWN0ZWQ6IGZhbHNlXG4gICAgX3NvY2tldDogbnVsbFxuICAgIF9yZWNlaXZlSGFuZGxlcnM6IHsgfVxuICAgIF9jYWxsYmFja0hhbmRsZXJzOiB7IH1cblxuICAgICMgVGhlIGNhbGxiYWNrIGZvciBvbiBjb25uZWN0aW9uIG9wZW5lZC5cbiAgICBvbkNvbm5lY3Q6ICgpIC0+XG4gICAgIyBUaGUgY2FsbGJhY2sgZm9yIG9uIGNvbm5lY3Rpb24gY2xvc2VkLlxuICAgIG9uRGlzY29ubmVjdDogKCkgLT5cbiAgICAjIFRoZSBjYWxsYmFjayBmb3Igb24gY29ubmVjdGlvbiBmYWlsZWQuXG4gICAgb25FcnJvcjogKCBlcnIgKSAtPlxuXG4gICAgIyBSZWdpc3RlciBkZWZhdWx0IGNhbGxiYWNrc1xuICAgIGNvbnN0cnVjdG9yOiAoIGRhc2ggKSAtPlxuICAgICAgICBAZGFzaCA9IGRhc2hcbiAgICAgICAgQF9yZWNlaXZlSGFuZGxlcnMgPSB7IH1cbiAgICAgICAgQHJlZ2lzdGVyUmVjZWl2ZUhhbmRsZXIgQ2FsbGJhY2tNZXNzYWdlS2V5LCAoIG1zZywgY2JJZCApID0+XG4gICAgICAgICAgICBpZiBjYklkIG9mIEBfY2FsbGJhY2tIYW5kbGVyc1xuICAgICAgICAgICAgICAgIEBfY2FsbGJhY2tIYW5kbGVyc1sgY2JJZCBdIG1zZ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgXCJSb2d1ZSBjYWxsYmFjayByZWNlaXZlZDogXCIsIGNiSWRcblxuICAgICMgQ29ubmVjdCB0byB0aGUgZW5naW5lLlxuICAgIGNvbm5lY3Q6ICggcG9ydCwgYWRkcmVzcyA9IFwibG9jYWxob3N0XCIsIHJvdXRlID0gXCJ3c1wiICkgLT5cbiAgICAgICAgQF9zb2NrZXQgPSBuZXcgV2ViU29ja2V0IFwid3M6Ly8je2FkZHJlc3N9OiN7cG9ydH0vI3tyb3V0ZX1cIlxuICAgICAgICBAX2luaXQoKVxuXG4gICAgIyBQUklWQVRFLCBmb3IgdXNlIGFmdGVyIHNvY2tldCBpcyBzZXQuXG4gICAgX2luaXQ6ICgpIC0+XG4gICAgICAgIEBfc29ja2V0Lm9ub3BlbiA9ICggb2UgKSA9PlxuICAgICAgICAgICAgQGlzQ29ubmVjdGVkID0gdHJ1ZVxuICAgICAgICAgICAgQG9uQ29ubmVjdCgpXG5cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIEBfc29ja2V0Lm9uY2xvc2UgPSAoIGNlICkgPT5cbiAgICAgICAgICAgIEBpc0Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgICAgICAgICBAb25EaXNjb25uZWN0KClcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQF9zb2NrZXQub25tZXNzYWdlID0gKCBtZXNzYWdlICkgPT5cbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlIG1lc3NhZ2UuZGF0YVxuICAgICAgICAgICAgaWYgbm90IGRhdGEua2V5IG9yIG5vdCBkYXRhLnZhbHVlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiSW52YWxpZCBtZXNzYWdlIGZvcm1hdFwiXG5cbiAgICAgICAgICAgIGlmIGRhdGEua2V5IG9mIEBfcmVjZWl2ZUhhbmRsZXJzXG4gICAgICAgICAgICAgICAgZm9yIGhhbmRsZXIgaW4gQF9yZWNlaXZlSGFuZGxlcnNbIGRhdGEua2V5IF1cbiAgICAgICAgICAgICAgICAgICAgZXZlbnRSZXNwb25zZSA9IHsgfVxuICAgICAgICAgICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gaGFuZGxlciBkYXRhLnZhbHVlLCBkYXRhLmNhbGxiYWNrSWRcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgcmVzcG9uc2UgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRSZXNwb25zZS5kYXRhID0gJ3N1Y2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRSZXNwb25zZS5kYXRhID0gcmVzcG9uc2VcblxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRSZXNwb25zZS5zdGF0dXMgPSBTdGF0dXMub2tcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRSZXNwb25zZS5kYXRhID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2c6IGUubWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IGUubGluZU51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGUuZmlsZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50UmVzcG9uc2Uuc3RhdHVzID0gU3RhdHVzLmVycm9yXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgZGF0YS5rZXkgaXNudCBDYWxsYmFja01lc3NhZ2VLZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbGxiYWNrTWVzc2FnZUtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudFJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5UmVzcG9uc2VIYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY2FsbGJhY2tJZCApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuIFwiTm8gaGFuZGxlcnMgZm9yIG1lc3NhZ2Uga2V5ICN7ZGF0YS5rZXl9XCJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyBAX3JlY2VpdmVIYW5kbGVyc1xuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBAX3NvY2tldC5vbmVycm9yID0gKCBlcnIgKSA9PlxuICAgICAgICAgICAgQGlzQ29ubmVjdGVkID0gZmFsc2VcbiAgICAgICAgICAgIEBvbkVycm9yKCBlcnIgKVxuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICByZXR1cm5cblxuICAgIGRpc2Nvbm5lY3Q6ICgpIC0+XG4gICAgICAgIGRvIEBfc29ja2V0LmNsb3NlIGlmIEBpc0Nvbm5lY3RlZFxuXG4gICAgcmVnaXN0ZXJSZWNlaXZlSGFuZGxlcjogKCBrZXksIGhhbmRsZXIgKSAtPlxuICAgICAgICBpZiB0eXBlb2Yga2V5IGlzbnQgJ3N0cmluZydcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIktleSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLlwiXG5cbiAgICAgICAgIyBJbml0IGhhbmRsZXJzIGFycmF5XG4gICAgICAgIGlmIGtleSBub3Qgb2YgQF9yZWNlaXZlSGFuZGxlcnNcbiAgICAgICAgICAgIEBfcmVjZWl2ZUhhbmRsZXJzWyBrZXkgXSA9IFsgXVxuXG4gICAgICAgICMgQWRkIHRoZSBoYW5kbGVyXG4gICAgICAgIEBfcmVjZWl2ZUhhbmRsZXJzWyBrZXkgXS5wdXNoIGhhbmRsZXJcblxuICAgICAgICByZXR1cm5cblxuICAgICMgU2VuZCBkYXRhIHRvIHRoZSBlbmdpbmUuXG4gICAgc2VuZDogKCBrZXksIGRhdGEsIGNiID0gZW1wdHlSZXNwb25zZUhhbmRsZXIsIGNiSWQgPSBudWxsICkgLT5cbiAgICAgICAgaWYgbm90IEBpc0Nvbm5lY3RlZFxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiTm90IGNvbm5lY3RlZCB0byBzZXJ2ZXIsIGNhbid0IHNlbmQgbWVzc2FnZVwiXG5cbiAgICAgICAgaWYga2V5IGlzbnQgQ2FsbGJhY2tNZXNzYWdlS2V5XG4gICAgICAgICAgICBjYklkID0gdXVpZC52NCgpIGlmIGNiSWQgaXMgbnVsbFxuICAgICAgICAgICAgQF9jYWxsYmFja0hhbmRsZXJzWyBjYklkIF0gPSBjYWxsYmFja1Jlc3BvbnNlSGFuZGxlciggY2IgKVxuXG4gICAgICAgIEBfc29ja2V0LnNlbmQgY3JlYXRlTWVzc2FnZSBrZXksIGRhdGEsIGNiSWRcblxuICAgICMgQWN0dWFsIGhlbHBlciBBUEkgZnVuY3Rpb25zLlxuICAgIHJlZnJlc2hHYW1lOiAtPlxuICAgICAgICBAc2VuZCBcImRnYW1lOnJlZnJlc2hcIiwgeyB9XG5cbiAgICByZWZyZXNoT2JqZWN0OiAoIG5hbWUsIGRlc2MgKSAtPlxuICAgICAgICBwYXJhbXMgPVxuICAgICAgICAgICAgb2JqZWN0TmFtZTogbmFtZVxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlc2NcblxuICAgICAgICBAc2VuZCBcIm9iamVjdDpyZWZyZXNoXCIsIHBhcmFtc1xuXG4gICAgcmVmcmVzaENvbXBvbmVudDogKCBvYmplY3ROYW1lLCBjb21wb25lbnROYW1lLCBjb21wb25lbnREZXNjICkgLT5cbiAgICAgICAgcGFyYW1zID1cbiAgICAgICAgICAgIG9iamVjdE5hbWU6IG9iamVjdE5hbWVcbiAgICAgICAgICAgIGNvbXBvbmVudE5hbWU6IGNvbXBvbmVudE5hbWVcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBjb21wb25lbnREZXNjXG5cbiAgICAgICAgQHNlbmQgXCJvYmplY3Q6Y29tcG9uZW50OnJlZnJlc2hcIiwgcGFyYW1zXG5cbm1vZHVsZS5leHBvcnRzID0gRGFzaEVuZ2luZVxuIiwiY2xhc3MgRGFzaExheW91dFxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZ29sZGVuID0gbmV3IEdvbGRlbkxheW91dCBjb25maWdcbiAgICBkbyBAZ29sZGVuLmluaXRcblxuICByZWdpc3RlckVsZW1lbnQ6ICggbmFtZSwgZWxlbWVudENiLCBzdG9yZUVsZW1lbnRDYiA9IG51bGwgKSAtPlxuICAgIEBnb2xkZW4ucmVnaXN0ZXJDb21wb25lbnQgbmFtZSwgKCBjb250YWluZXIsIHN0YXRlICkgLT5cbiAgICAgIHJlc3VsdCA9IFJlYWN0LnJlbmRlciBlbGVtZW50Q2IoKSwgY29udGFpbmVyLmdldEVsZW1lbnQoKVswXVxuXG4gICAgICBpZiBzdG9yZUVsZW1lbnRDYlxuICAgICAgICBzdG9yZUVsZW1lbnRDYiByZXN1bHRcblxuICAgICAgcmVzdWx0LnNldFN0YXRlIHN0YXRlXG5cbm1vZHVsZS5leHBvcnRzID0gRGFzaExheW91dFxuXG5jb25maWcgPSBjb250ZW50OiBbXG4gIHR5cGU6IFwicm93XCJcbiAgY29udGVudDogW1xuICAgIHtcbiAgICAgIHR5cGU6IFwic3RhY2tcIlxuICAgICAgd2lkdGg6IDE1XG4gICAgICBjb250ZW50OiBbXG4gICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCJcbiAgICAgICAgY29tcG9uZW50TmFtZTogXCJPYmplY3RCcm93c2VyXCJcbiAgICAgICAgdGl0bGU6IFwiT2JqZWN0IEJyb3dzZXJcIlxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICB0eXBlOiBcImNvbHVtblwiXG4gICAgICB3aWR0aDogNzBcbiAgICAgIGNvbnRlbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCJcbiAgICAgICAgICBjb21wb25lbnROYW1lOiBcIkRhc2hDb25uZWN0XCJcbiAgICAgICAgICB0aXRsZTogXCJDb25uZWN0IHRvIERhc2hcIlxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiXG4gICAgICAgICAgaGVpZ2h0OiAyMFxuICAgICAgICAgIHRpdGxlOiBcIkNvbnNvbGVcIlxuICAgICAgICAgIGNvbXBvbmVudE5hbWU6IFwiRGFzaENvbnNvbGVcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgIHR5cGU6IFwicm93XCJcbiAgICAgIGNvbnRlbnQ6IFtcbiAgICAgICAgdHlwZTogXCJzdGFja1wiXG4gICAgICAgIHdpZHRoOiAxNVxuICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIlxuICAgICAgICAgIGNvbXBvbmVudE5hbWU6IFwiUHJvcGVydGllc1wiXG4gICAgICAgICAgdGl0bGU6IFwiUHJvcGVydGllc1wiXG4gICAgICAgIF1cbiAgICAgIF1cbiAgICB9XG4gIF1cbl1cbiIsIkRhc2ggPSByZXF1aXJlICcuL2Rhc2gnXG5cbmRhc2ggPSBuZXcgRGFzaFxuXG5kYXNoLmVuZ2luZS5yZWdpc3RlclJlY2VpdmVIYW5kbGVyIFwiZGFzaDpsb2dnZXI6bWVzc2FnZVwiLCAoIGRhdGEgKSAtPlxuICBkYXNoLmNvbnNvbGUubG9nIGRhdGFcblxuIyB0aGlzIGZ1bmN0aW9uIGlzIGVtcHR5IHVudGlsIHdlIGFkZCBhIHByb3BlciBncmFwaCBmb3IgRlBTIGRhdGFcbiMgdGhlIGVtcHR5IGZ1bmN0aW9uIHN0b3BzIGFuIGVycm9yIGZyb20gYmVpbmcgdGhyb3duIGluIHRoZSBjb25zb2xlXG5kYXNoLmVuZ2luZS5yZWdpc3RlclJlY2VpdmVIYW5kbGVyIFwiZGFzaDpwZXJmOmZyYW1ldGltZVwiLCAoIGRhdGEgKSAtPlxuXG5kYXNoLmVuZ2luZS5yZWdpc3RlclJlY2VpdmVIYW5kbGVyIFwiZGFzaDpwZXJmOnpvbmVfZGF0YVwiLCAoIGRhdGEgKSAtPlxuICAjY29uc29sZS5sb2cgZGF0YVxuXG5kYXNoLmVuZ2luZS5vbkNvbm5lY3QgPSAtPlxuICBkYXNoLmNvbnNvbGUubG9nICdDb25uZWN0ZWQgdG8gRGFzaC4nXG4gIGRhc2guc2NlbmUuZ2V0T2JqZWN0cyAoIG9ianMgKSAtPlxuICAgIGNvbnNvbGUubG9nIG9ianNcbiAgICBkYXNoLnBhbmVscy5vYmplY3RCcm93c2VyLnNldFByb3BzIGRhdGE6IG9ianNcblxuZGFzaC5sYXlvdXQucmVnaXN0ZXJFbGVtZW50ICdEYXNoQ29ubmVjdCcsICgpIC0+XG4gIGNvbm5lY3RUb0Rhc2ggPSAtPlxuICAgIGRhc2guZW5naW5lLmNvbm5lY3QgODAwOFxuICAgIGRhc2guY29uc29sZS5sb2cgJ0Nvbm5lY3RpbmcgdG8gRGFzaC4uLidcblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XCJjbGFzc05hbWVcIjogXCJjb25uZWN0XCIsIFwib25DbGlja1wiOiAoIGNvbm5lY3RUb0Rhc2ggKX0sIFwiQ29ubmVjdCB0byBEYXNoXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZGFzaFxuIiwiY2xhc3MgR2FtZU9iamVjdFxuICBDaGlsZHJlbjogWyBdXG5cbiAgY29uc3RydWN0b3I6ICggZGVzYywgc2NlbmUgKSAtPlxuICAgIEBzY2VuZSA9IHNjZW5lXG5cbiAgICBmb3IgcHJvcCwgdmFsdWUgb2YgZGVzY1xuICAgICAgIyBJZiBpdCdzIGNoaWxkcmVuLCBjcmVhdGUgYSBnYW1lb2JqZWN0IGZvciBlYWNoIG9uZVxuICAgICAgaWYgcHJvcCBpcyBcIkNoaWxkcmVuXCJcbiAgICAgICAgZm9yIGNoaWxkIGluIHZhbHVlXG4gICAgICAgICAgQENoaWxkcmVuLnB1c2ggbmV3IEdhbWVPYmplY3QgY2hpbGQsIHNjZW5lXG4gICAgICBlbHNlICMgRWxzZSBqdXN0IGNvcHkgdGhlIHZhbHVlXG4gICAgICAgIEBbIHByb3AgXSA9IHZhbHVlXG5cbiAgc2F2ZTogLT5cbiAgICBAc2NlbmUuZGFzaC5yZWZyZXNoT2JqZWN0IEBOYW1lLCB0aGlzXG5cbmNsYXNzIERhc2hTY2VuZVxuICAjIFNjZW5lIG9iamVjdCB0cmVlXG4gIG9iamVjdHM6IFtdXG5cbiAgIyBQYXNzIHRocm91Z2ggZm9yIEdhbWVPYmplY3QgY2xhc3NcbiAgR2FtZU9iamVjdDogR2FtZU9iamVjdFxuXG4gIGNvbnN0cnVjdG9yOiAoIGRhc2ggKSAtPlxuICAgIEBkYXNoID0gZGFzaFxuXG4gIGdldE9iamVjdHM6ICggY2IgKSAtPlxuICAgIEBkYXNoLmVuZ2luZS5zZW5kIFwiZGdhbWU6c2NlbmU6Z2V0X29iamVjdHNcIiwgeyB9LCAoIG9ianMgKSA9PlxuICAgICAgZm9yIG9iaiBpbiBvYmpzXG4gICAgICAgIEBvYmplY3RzLnB1c2ggbmV3IEdhbWVPYmplY3Qgb2JqLCB0aGlzXG5cbiAgICAgIGNvbnNvbGUubG9nIEBvYmplY3RzXG4gICAgICBjb25zb2xlLmxvZyBvYmpzXG4gICAgICBjYiBAb2JqZWN0c1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhc2hTY2VuZVxuIl19
