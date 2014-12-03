! function() {
  function now() {
    return (new Date).getTime()
  }

  function bind(a, b) {
    return function() {
      return b.apply(a, arguments)
    }
  }

  function addEvent(a, b, c) {
    a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent && (a["e" + b + c] = c, a[b + c] = function() {
      a["e" + b + c](window.event)
    }, a.attachEvent("on" + b, a[b + c]))
  }

  function removeEvent(a, b, c) {
    a.removeEventListener ? a.removeEventListener(b, c, !1) : a.detachEvent && (a.detachEvent("on" + b, a[b + c]), a[b + c] = null, a["e" + b + c] = null)
  }

  function elementIsContainedIn(a, b) {
    return element.contains ? a.contains(b) : !!(16 & a.compareDocumentPosition(b))
  }

  function code(a) {
    var b = {
      38: "up",
      40: "down",
      37: "left",
      39: "right",
      27: "esc"
    };
    return b[a] ? b[a] : String.fromCharCode(a)
  }

  function random(a, b) {
    return Math.floor(Math.random() * (b + 1) + a)
  }
  var Class = function(a) {
    var b = function() {
      return a && "function" == typeof a.initialize ? a.initialize.apply(this, arguments) : void 0
    };
    for (var c in a) a.hasOwnProperty(c) && (b.prototype[c] = a[c]);
    return b
  };
  Array.prototype.indexOf || (Array.prototype.indexOf = function(a) {
    if (void 0 === this || null === this) throw new TypeError;
    var b = Object(this),
      c = b.length >>> 0;
    if (0 === c) return -1;
    var d = 0;
    if (arguments.length > 0 && (d = Number(arguments[1]), d !== d ? d = 0 : 0 !== d && d !== 1 / 0 && d !== -(1 / 0) && (d = (d > 0 || -1) * Math.floor(Math.abs(d)))), d >= c) return -1;
    for (var e = d >= 0 ? d : Math.max(c - Math.abs(d), 0); c > e; e++)
      if (e in b && b[e] === a) return e;
    return -1
  });
  var Vector = new Class({
      initialize: function(a, b) {
        "Object" == typeof a ? (this.x = a.x, this.y = a.y) : (this.x = a, this.y = b)
      },
      cp: function() {
        return new Vector(this.x, this.y)
      },
      mul: function(a) {
        return this.x *= a, this.y *= a, this
      },
      mulNew: function(a) {
        return new Vector(this.x * a, this.y * a)
      },
      add: function(a) {
        return this.x += a.x, this.y += a.y, this
      },
      addNew: function(a) {
        return new Vector(this.x + a.x, this.y + a.y)
      },
      sub: function(a) {
        return this.x -= a.x, this.y -= a.y, this
      },
      subNew: function(a) {
        return new Vector(this.x - a.x, this.y - a.y)
      },
      rotate: function(a) {
        var b = this.x,
          c = this.y;
        return this.x = b * Math.cos(a) - Math.sin(a) * c, this.y = b * Math.sin(a) + Math.cos(a) * c, this
      },
      rotateNew: function(a) {
        return this.cp().rotate(a)
      },
      setAngle: function(a) {
        var b = this.len();
        return this.x = Math.cos(a) * b, this.y = Math.sin(a) * b, this
      },
      setAngleNew: function(a) {
        return this.cp().setAngle(a)
      },
      setLength: function(a) {
        var b = this.len();
        return b ? this.mul(a / b) : this.x = this.y = a, this
      },
      setLengthNew: function(a) {
        return this.cp().setLength(a)
      },
      normalize: function() {
        var a = this.len();
        return 0 == a ? this : (this.x /= a, this.y /= a, this)
      },
      normalizeNew: function() {
        return this.cp().normalize()
      },
      angle: function() {
        return Math.atan2(this.y, this.x)
      },
      collidesWith: function(a) {
        return this.x > a.x && this.y > a.y && this.x < a.x + a.width && this.y < a.y + a.height
      },
      len: function() {
        var a = Math.sqrt(this.x * this.x + this.y * this.y);
        return .005 > a && a > -.005 ? 0 : a
      },
      is: function(a) {
        return "object" == typeof a && this.x == a.x && this.y == a.y
      },
      dot: function(a) {
        return this.x * a.x + this.y * a.y
      },
      toString: function() {
        return "[Vector(" + this.x + ", " + this.y + ") angle: " + this.angle() + ", length: " + this.len() + "]"
      }
    }),
    Rect = new Class({
      initialize: function(a, b, c, d) {
        this.pos = new Vector(a, b), this.size = {
          width: c,
          height: d
        }
      },
      getRight: function() {
        return this.pos.x + this.size.width / 2
      },
      getBottom: function() {
        return this.pos.y + this.size.height / 2
      }
    }),
    KickAss = new Class({
      initialize: function() {
        this.players = [], this.elements = [], this.bulletManager = new BulletManager, this.bulletManager.game = this, this.explosionManager = new ExplosionManager, this.explosionManager.game = this, this.menuManager = new MenuManager, this.menuManager.game = this, this.menuManager.create(), this.lastUpdate = now(), this.keyMap = {}, this.keydownEvent = bind(this, this.keydown), this.keyupEvent = bind(this, this.keyup), addEvent(document, "keydown", this.keydownEvent), addEvent(document, "keyup", this.keyupEvent), addEvent(document, "keypress", this.keydownEvent), this.scrollPos = new Vector(0, 0), this.windowSize = {
          width: 0,
          height: 0
        }, this.updateWindowInfo()
      },
      begin: function() {
        this.addPlayer(), this.loopTimer = window.setInterval(bind(this, this.loop), 1e3 / 60)
      },
      keydown: function(a) {
        var b = code(a.keyCode);
        switch (this.keyMap[b] = !0, b) {
          case "left":
          case "right":
          case "up":
          case "down":
          case "esc":
          case " ":
            a.stopPropogation && a.stopPropogation(), a.preventDefault && a.preventDefault(), a.returnValue = !1
        }
        switch (b) {
          case "esc":
            this.destroy()
        }
      },
      keyup: function(a) {
        var b = code(a.keyCode);
        switch (this.keyMap[b] = !1, b) {
          case "left":
          case "right":
          case "up":
          case "down":
          case "esc":
          case " ":
            a.stopPropogation && a.stopPropogation(), a.preventDefault && a.preventDefault(), a.returnValue = !1
        }
      },
      loop: function() {
        var a = now(),
          b = (a - this.lastUpdate) / 1e3;
        this.updateWindowInfo();
        for (var c, d = 0; c = this.players[d]; d++) c.update(b);
        this.bulletManager.update(b), this.explosionManager.update(b), this.lastUpdate = a
      },
      addPlayer: function() {
        var a = new Player;
        a.game = this, this.players.push(a), this.explosionManager.addExplosion(a.pos)
      },
      registerElement: function(a) {
        this.elements.push(a)
      },
      unregisterElement: function(a) {
        this.elements.splice(this.elements.indexOf(a), 1)
      },
      isKickAssElement: function(a) {
        for (var b, c = 0; b = this.elements[c]; c++)
          if (a === b || elementIsContainedIn(b, a)) return !0;
        return !1
      },
      isKeyPressed: function(a) {
        return !!this.keyMap[a]
      },
      updateWindowInfo: function() {
        var a = !!window.ActiveXObject && "BackCompat" == document.compatMode;
        this.windowSize = {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight
        }, a && (this.windowSize.width = document.body.clientWidth, this.windowSize.height = document.body.clientHeight), this.scrollPos.x = window.pageXOffset || document.documentElement.scrollLeft, this.scrollPos.y = window.pageYOffset || document.documentElement.scrollTop
      },
      hideAll: function() {
        for (var a, b = 0; a = this.elements[b]; b++) a.style.visibility = "hidden"
      },
      showAll: function() {
        for (var a, b = 0; a = this.elements[b]; b++) a.style.visibility = "visible"
      },
      destroy: function() {
        removeEvent(document, "keydown", this.keydownEvent), removeEvent(document, "keypress", this.keydownEvent), removeEvent(document, "keyup", this.keyupEvent);
        for (var a, b = 0; a = this.players[b]; b++) a.destroy();
        this.bulletManager.destroy(), this.explosionManager.destroy(), this.menuManager.destroy(), clearInterval(this.loopTimer), window.location.reload()
      }
    }),
    MenuManager = new Class({
      initialize: function() {
        this.numPoints = 0
      },
      create: function() {
        // with(this.container = document.createElement("div"), this.container.className = "KICKASSELEMENT", this.container.style) position = "fixed", bottom = "20px", right = "20px", font = "16pt Arial", color = "black", zIndex = "1000000", textAlign = "right";
        // with(document.body.appendChild(this.container), this.points = document.createElement("div"), this.points.className = "KICKASSELEMENT", this.points.style.fontSize = "30pt", this.points.innerHTML = this.numPoints, this.container.appendChild(this.points), this.escToQuit = document.createElement("div"), this.escToQuit.className = "KICKASSELEMENT", this.escToQuit.innerHTML = "Press esc to quit", this.container.appendChild(this.escToQuit), this.social = document.createElement("div"), this.social.className = "KICKASSELEMENT", document.body.appendChild(this.social), this.social.style) display = "block", position = "fixed", top = "20px", right = "20px", zIndex = "100000", textAlign = "right";
        // this.social.innerHTML = '<iframe src="http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(window.location.href) + '&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=true&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="display: block; position: absolute; right: 120px; border:none; overflow:hidden; width:100px; height:21px;" allowTransparency="true"></iframe>' + (/^https/.test(window.location.href) ? "" : '<a href="http://twitter.com/share" class="twitter-share-button" data-text="I found the secret code and played #browserblaster on ' + window.location.href + '. Can you find the code?" data-count="horizontal" data-related="cloudflare:CloudFlare: Performance and Security for Any Website">Tweet</a>');
        // var twitter = document.createElement("script");
        // twitter.type = "text/javascript", twitter.src = "http://platform.twitter.com/widgets.js", twitter.async = !0, this.social.appendChild(twitter), this.game.registerElement(this.container), this.game.registerElement(this.points), this.game.registerElement(this.escToQuit), this.game.registerElement(this.social)
      },
      addPoints: function(a) {
        this.numPoints += 10 * a, this.points.innerHTML = this.numPoints
      },
      destroy: function() {
        this.game.unregisterElement(this.container), this.game.unregisterElement(this.escToQuit), this.game.unregisterElement(this.points), this.container.parentNode.removeChild(this.container)
      }
    }),
    PLAYERIDS = 0,
    Player = new Class({
      initialize: function() {
        this.id = PLAYERIDS++, this.verts = [
          [-10, 10],
          [15, 0],
          [-10, -10],
          [-10, 10]
        ], this.size = {
          width: 20,
          height: 30
        }, this.flames = {
          r: [],
          y: []
        }, this.sheet = new Sheet(new Rect(100, 100, 50, 50)), this.pos = new Vector(100, 100), this.vel = new Vector(0, 0), this.acc = new Vector(0, 0), this.dir = new Vector(1, 0), this.currentRotation = 0, this.friction = .8, this.terminalVelocity = 2e3, this.lastPos = new Vector(0, 0), this.lastFrameUpdate = 0, this.generateFlames()
      },
      update: function(a) {
        this.game.isKeyPressed("left") || this.game.isKeyPressed("right") ? (this.game.isKeyPressed("left") && this.rotateLeft(), this.game.isKeyPressed("right") && this.rotateRight()) : this.stopRotate(), this.game.isKeyPressed("up") ? this.activateThrusters() : this.stopThrusters(), this.currentRotation && this.dir.setAngle(this.dir.angle() + this.currentRotation * a);
        var b = this.acc.mulNew(a).sub(this.vel.mulNew(a * this.friction));
        this.vel.add(b), this.vel.len() > this.terminalVelocity && this.vel.setLength(this.terminalVelocity), this.pos.add(this.vel.mulNew(a)), now() - this.lastFrameUpdate > 1e3 / 15 && this.generateFlames(), this.checkBounds(), (!this.lastPos.is(this.pos) || this.currentRotation) && (this.sheet.clear(), this.sheet.setAngle(this.dir.angle()), this.sheet.setPosition(this.pos), this.acc.is({
          x: 0,
          y: 0
        }) || this.sheet.drawFlames(this.flames), this.sheet.drawPlayer(this.verts), this.lastPos = this.pos.cp())
      },
      generateFlames: function() {
        var a = this.size.width,
          b = .1 * this.size.width,
          c = .6 * this.size.width,
          d = .2 * c,
          e = a / 2,
          f = c / 2,
          g = this.size.height / 4;
        this.flames.r = [
          [-1 * g, -1 * e]
        ], this.flames.y = [
          [-1 * g, -1 * f]
        ];
        for (var h = 0; a > h; h += b) this.flames.r.push([-random(2, 7) - g, h - e]);
        this.flames.r.push([-1 * g, e]);
        for (var h = 0; c > h; h += d) this.flames.y.push([-random(2, 7) - g, h - f]);
        this.flames.y.push([-1 * g, f]), this.lastFrameUpdate = now()
      },
      checkBounds: function() {
        var a = this.game.windowSize.width,
          b = this.game.windowSize.height,
          c = this.pos.x + this.sheet.rect.size.width / 2,
          d = this.pos.y + this.sheet.rect.size.height / 2;
        c > a ? (window.scrollTo(this.game.scrollPos.x + 50, this.game.scrollPos.y), this.pos.x = 0) : this.pos.x < 0 && (window.scrollTo(this.game.scrollPos.x - 50, this.game.scrollPos.y), this.pos.x = a - this.sheet.rect.size.width / 2), d > b ? (window.scrollTo(this.game.scrollPos.x, this.game.scrollPos.y + .75 * b), this.pos.y = 0) : this.pos.y < 0 && (window.scrollTo(this.game.scrollPos.x, this.game.scrollPos.y - .75 * b), this.pos.y = b - this.sheet.rect.size.height / 2)
      },
      activateThrusters: function() {
        this.acc = new Vector(500, 0).setAngle(this.dir.angle())
      },
      stopThrusters: function() {
        this.acc = new Vector(0, 0)
      },
      rotateLeft: function() {
        this.currentRotation = 2 * -Math.PI
      },
      rotateRight: function() {
        this.currentRotation = 2 * Math.PI
      },
      stopRotate: function() {
        this.currentRotation = 0
      },
      destroy: function() {
        this.sheet.destroy()
      }
    }),
    BulletManager = new Class({
      initialize: function() {
        this.bullets = {}, this.lastFired = 0, this.lastBlink = 0, this.blinkActive = !1, this.enemyIndex = []
      },
      update: function(a) {
        if (this.game.isKeyPressed(" ") && now() - this.lastFired > 100) {
          for (var b, c = 0; b = this.game.players[c]; c++) this.addBulletFromPlayer(b);
          this.lastFired = now()
        }
        this.game.isKeyPressed("B") ? this.blink() : this.endBlink();
        for (var d in this.bullets)
          if (this.bullets.hasOwnProperty(d)) {
            for (var e, f = now(), c = 0; e = this.bullets[d][c]; c++) f - e.bornAt > 2e3 && (e.destroy(), this.bullets[d].splice(c, 1));
            for (var e, c = 0; e = this.bullets[d][c]; c++) {
              e.update(a), this.game.hideAll();
              var g = e.checkCollision();
              g && (this.game.explosionManager.addExplosion(e.pos), this.game.menuManager.addPoints(g.getElementsByTagName("*").length + 1), g.parentNode.removeChild(g), e.destroy(), this.bullets[d].splice(c, 1)), this.game.showAll()
            }
          }
      },
      blink: function() {
        if (now() - this.lastBlink > 250) {
          for (var a, b = 0; a = this.enemyIndex[b]; b++) a.style.outline = this.blinkActive ? a.KICKASSOLDBORDER : "1px solid red";
          this.blinkActive = !this.blinkActive, this.lastBlink = now(), this.blinkActive || this.updateEnemyIndex()
        }
      },
      endBlink: function() {
        if (this.enemyIndex.length) {
          for (var a, b = 0; a = this.enemyIndex[b]; b++) a.style.outline = a.KICKASSOLDBORDER;
          this.enemyIndex = [], this.lastBlink = 0, this.blinkActive = !1
        }
      },
      updateEnemyIndex: function() {
        var a = document.getElementsByTagName("*");
        this.enemyIndex = [];
        for (var b, c = 0; b = a[c]; c++) this.hasOnlyTextualChildren(b) && (this.enemyIndex.push(b), b.KICKASSOLDBORDER = b.style.outline || document.defaultView.getComputedStyle(b, null).outline)
      },
      addBulletFromPlayer: function(a) {
        var b = a.id;
        this.bullets[b] && this.bullets[b].length > 10 && (this.bullets[b][0].destroy(), this.bullets[b].shift());
        var c = new Bullet;
        c.manager = this, c.pos = a.pos.cp(), c.dir = a.dir.cp(), c.game = this.game, c.vel.add(c.vel.cp().setLength(a.vel.len())), this.bullets[b] || (this.bullets[b] = []), this.bullets[b].push(c)
      },
      hasOnlyTextualChildren: function(a) {
        if (a == document.defaultView || a == document.body) return !1;
        if (a.className && -1 != a.className.indexOf("KICKASSELEMENT")) return !1;
        for (var b = 0; b < a.childNodes.length; b++)
          if (a.childNodes[b].childNodes[0])
            for (var c, d = a.childNodes, b = 0; c = d[b]; b++)
              if (1 == c.nodeType && "hidden" != c.style.visibility && "none" != c.style.display && 0 != c.offsetHeight && 0 != c.offsetWidth && -1 == ELEMENTSTHATCOUNTASTEXTUAL.indexOf(c.tagName) && -1 == ELEMENTSTHATARENOTTOBEINCLUDED.indexOf(c.tagName)) return !1;
        return !0
      },
      destroy: function() {
        for (var a in this.bullets)
          if (this.bullets.hasOwnProperty(a))
            for (var b, c = 0; b = this.bullets[a][c]; c++) b.destroy();
        this.bullets = {}
      }
    }),
    ELEMENTSTHATCOUNTASTEXTUAL = ["BR", "SELECT", "LEGEND"],
    ELEMENTSTHATARENOTTOBEINCLUDED = ["BR", "SCRIPT", "STYLE", "TITLE", "META", "HEAD", "OPTION", "OPTGROUP"],
    Bullet = new Class({
      initialize: function() {
        this.pos = new Vector(100, 100), this.dir = new Vector(1, 1), this.vel = new Vector(500, 500), this.bornAt = now(), this.sheet = new Sheet(new Rect(this.pos.x, this.pos.y, 5, 5)), this.sheet.drawBullet()
      },
      update: function(a) {
        this.pos.add(this.vel.setAngle(this.dir.angle()).mulNew(a)), this.checkBounds(), this.sheet.setPosition(this.pos)
      },
      checkCollision: function() {
        var a = document.elementFromPoint(this.pos.x, this.pos.y);
        return a && 3 == a.nodeType && (a = a.parentNode), a && a != document.documentElement && this.manager.hasOnlyTextualChildren(a) ? a : !1
      },
      checkBounds: function() {
        var a = this.game.windowSize.width,
          b = this.game.windowSize.height,
          c = this.pos.x + this.sheet.rect.size.width / 2,
          d = this.pos.y + this.sheet.rect.size.height / 2;
        c > a ? this.pos.x = 0 : this.pos.x < 0 && (this.pos.x = a - this.sheet.rect.size.width / 2), d > b ? this.pos.y = 0 : this.pos.y < 0 && (this.pos.y = b - this.sheet.rect.size.height / 2)
      },
      destroy: function() {
        this.sheet.destroy()
      }
    }),
    ExplosionManager = new Class({
      initialize: function() {
        this.explosions = []
      },
      update: function(a) {
        for (var b, c = now(), d = 0; b = this.explosions[d]; d++) c - b.bornAt > 300 ? (b.destroy(), this.explosions.splice(d, 1)) : b.update(a)
      },
      addExplosion: function(a) {
        var b = new Explosion(a);
        b.game = this.game, b.checkBounds(), this.explosions.push(b)
      },
      destroy: function() {
        for (var a, b = 0; a = this.explosions[b]; b++) a.destroy();
        this.explosions = []
      }
    }),
    Explosion = new Class({
      initialize: function(a) {
        this.bornAt = now(), this.pos = a.cp(), this.particleVel = new Vector(400, 0), this.generateParticles(), this.sheet = new Sheet(new Rect(a.x, a.y, 250, 250))
      },
      update: function(a) {
        this.particleVel.mulNew(a);
        for (var b, c = 0; b = this.particles[c]; c++) b.pos.add(b.vel.mulNew(a).mul(random(.5, 1)).setAngle(b.dir.angle()));
        this.sheet.clear(), this.sheet.drawExplosion(this.particles)
      },
      generateParticles: function() {
        this.particles = [];
        for (var a = 0, b = "undefined" != typeof Raphael ? 10 : 40; b > a; a++) this.particles.push({
          dir: new Vector(random(0, 20) - 10, random(0, 20) - 10).normalize(),
          vel: this.particleVel.cp(),
          pos: new Vector(0, 0)
        })
      },
      checkBounds: function() {
        var a = this.sheet.rect.getRight(),
          b = this.sheet.rect.getBottom(),
          c = this.game.windowSize.width,
          d = this.game.windowSize.height;
        a > c && (this.pos.x -= a - c), b > d && (this.pos.y -= b - d), this.sheet.setPosition(this.pos)
      },
      destroy: function() {
        this.sheet.destroy()
      }
    }),
    Sheet = new Class({
      initialize: function(a) {
        this.rect = a, this.drawer = "undefined" != typeof Raphael ? new SheetRaphael(a) : new SheetCanvas(a)
      },
      clear: function() {
        this.drawer.clear()
      },
      setPosition: function(a) {
        this.rect.pos = a.cp(), this.drawer.rect = this.rect, this.drawer.updateCanvas()
      },
      setAngle: function(a) {
        this.drawer.setAngle(a)
      },
      drawPlayer: function(a) {
        this.drawer.setFillColor("white"), this.drawer.setStrokeColor("black"), this.drawer.setLineWidth(1.5), this.drawer.tracePoly(a), this.drawer.fillPath(), this.drawer.tracePoly(a), this.drawer.strokePath()
      },
      drawFlames: function(a) {
        this.drawer.setStrokeColor("red"), this.drawer.tracePoly(a.r), this.drawer.strokePath(), this.drawer.setStrokeColor("yellow"), this.drawer.tracePoly(a.y), this.drawer.strokePath()
      },
      drawBullet: function() {
        this.drawer.setFillColor("black"), this.drawer.drawCircle(2.5)
      },
      drawExplosion: function(a) {
        for (var b, c = 0; b = a[c]; c++) this.drawer.setFillColor(["yellow", "red"][random(0, 1)]), this.drawer.drawLine(b.pos.x, b.pos.y, b.pos.x - 10 * b.dir.x, b.pos.y - 10 * b.dir.y)
      },
      destroy: function() {
        this.drawer.destroy()
      }
    }),
    SheetRaphael = new Class({
      initialize: function(a) {
        this.rect = a, this.fillColor = "black", this.strokeColor = "black", this.lineWidth = 1, this.polyString = "", this.raphael = Raphael(this.rect.pos.x - this.rect.size.width / 2, this.rect.pos.y - this.rect.size.height / 2, this.rect.size.width, this.rect.size.height), this.raphael.canvas.style.zIndex = "10000", this.raphael.canvas.className = "KICKASSELEMENT", window.KICKASSGAME.registerElement(this.raphael.canvas)
      },
      tracePoly: function(a) {
        if (a[0]) {
          this.polyString = "M" + a[0][0] + " " + a[0][1];
          for (var b = 0; b < a.length; b++) this.polyString += "L" + a[b][0] + " " + a[b][1]
        }
      },
      setAngle: function(a) {
        this.angle = a
      },
      updateCanvas: function() {
        this.raphael.canvas.width = this.rect.size.width, this.raphael.canvas.height = this.rect.size.height, this.raphael.canvas.style.left = window.KICKASSGAME.scrollPos.x + (this.rect.pos.x - this.rect.size.width / 2) + "px", this.raphael.canvas.style.top = window.KICKASSGAME.scrollPos.y + (this.rect.pos.y - this.rect.size.height / 2) + "px"
      },
      drawLine: function(a, b, c, d) {
        this.tracePoly([
          [a, b],
          [c, d]
        ]), this.fillPath()
      },
      drawCircle: function(a, b) {
        b = b || {
          x: 0,
          y: 0
        }, this.currentElement = this.raphael.circle(b.x, b.y, a), this.currentElement.attr("fill", this.fillColor)
      },
      setFillColor: function(a) {
        this.fillColor = a
      },
      setStrokeColor: function(a) {
        this.strokeColor = a
      },
      setLineWidth: function(a) {
        this.lineWidth = a
      },
      fillPath: function() {
        this.currentElement = this.raphael.path(this.polyString), this.currentElement.translate(this.rect.size.width / 2, this.rect.size.height / 2), this.currentElement.attr("fill", this.fillColor), this.currentElement.attr("stroke", this.fillColor), this.currentElement.rotate(Raphael.deg(this.angle), this.rect.size.width / 2, this.rect.size.height / 2)
      },
      strokePath: function() {
        this.currentElement = this.raphael.path(this.polyString), this.currentElement.attr("stroke", this.strokeColor), this.currentElement.attr("stroke-width", this.lineWidth), this.currentElement.translate(this.rect.size.width / 2, this.rect.size.height / 2), this.currentElement.rotate(Raphael.deg(this.angle), this.rect.size.width / 2, this.rect.size.height / 2)
      },
      clear: function() {
        this.raphael.clear()
      },
      destroy: function() {
        window.KICKASSGAME.unregisterElement(this.raphael.canvas), this.raphael.remove()
      }
    }),
    SheetCanvas = new Class({
      initialize: function(rect) {
        with(this.canvas = document.createElement("canvas"), this.canvas.className = "KICKASSELEMENT", this.canvas.style) position = "absolute", zIndex = "1000000";
        window.KICKASSGAME.registerElement(this.canvas), this.canvas.getContext && (this.ctx = this.canvas.getContext("2d")), this.rect = rect, this.angle = 0, this.updateCanvas(), document.body.appendChild(this.canvas)
      },
      tracePoly: function(a) {
        if (a[0]) {
          this.ctx.save(), this.ctx.translate(this.rect.size.width / 2, this.rect.size.height / 2), this.ctx.rotate(this.angle), this.ctx.beginPath(), this.ctx.moveTo(a[0][0], a[0][1]);
          for (var b = 0; b < a.length; b++) this.ctx.lineTo(a[b][0], a[b][1]);
          this.ctx.restore()
        }
      },
      setAngle: function(a) {
        this.angle = a
      },
      updateCanvas: function() {
        this.canvas.width != this.rect.size.width && (this.canvas.width = this.rect.size.width), this.canvas.height != this.rect.size.height && (this.canvas.height = this.rect.size.height), this.canvas.style.left = window.KICKASSGAME.scrollPos.x + (this.rect.pos.x - this.rect.size.width / 2) + "px", this.canvas.style.top = window.KICKASSGAME.scrollPos.y + (this.rect.pos.y - this.rect.size.height / 2) + "px"
      },
      drawLine: function(a, b, c, d) {
        this.ctx.save(), this.ctx.translate(this.rect.size.width / 2, this.rect.size.height / 2), this.ctx.beginPath(), this.ctx.moveTo(a, b), this.ctx.lineTo(c, d), this.ctx.lineTo(c + 2, d + 2), this.ctx.closePath(), this.ctx.fill(), this.ctx.restore()
      },
      drawCircle: function(a, b) {
        b = b || {
          x: 0,
          y: 0
        }, this.ctx.save(), this.ctx.translate(this.rect.size.width / 2, this.rect.size.height / 2), this.ctx.arc(0, 0, a, 0, 2 * Math.PI, !0), this.ctx.restore(), this.ctx.fill()
      },
      setFillColor: function(a) {
        this.ctx.fillStyle = a
      },
      setStrokeColor: function(a) {
        this.ctx.strokeStyle = a
      },
      setLineWidth: function(a) {
        this.ctx.lineWidth = a
      },
      fillPath: function() {
        this.ctx.fill()
      },
      strokePath: function() {
        this.ctx.stroke()
      },
      clear: function() {
        this.ctx.clearRect(0, 0, this.rect.size.width, this.rect.size.height)
      },
      destroy: function() {
        window.KICKASSGAME.unregisterElement(this.canvas), this.canvas.parentNode.removeChild(this.canvas)
      }
    }),

    initKickAss = function() {
      window.KICKASSGAME ? window.KICKASSGAME.addPlayer() : (window.KICKASSGAME = new KickAss, window.KICKASSGAME.begin())
    };

  if (document.createElement("canvas").getContext) initKickAss();
  else {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript"), script.onreadystatechange = function() {
      ("loaded" == script.readyState || "complete" == script.readyState) && initKickAss()
    }, script.onload = initKickAss, script.src = "http://cdnjs.cloudflare.com/ajax/libs/raphael/1.5.2/raphael-min.js", document.getElementsByTagName("head")[0].appendChild(script)
  }
}();