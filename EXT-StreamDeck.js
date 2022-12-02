/***********************
*  EXT-StreamDeck v1.0 *
*  Bugsounet           *
*  11/2022             *
***********************/

Module.register("EXT-StreamDeck", {
  defaults: {
    debug: false,
    device: null,
    Brightness: 50,
    EcoBrightness: 0,
    EcoTime: 10000,
    keyFinder: false,
    keys: [
      {
        key: 0,
        logo: "tv-on.png",
        notification: "EXT_SCREEN-WAKEUP",
        sound: "opening"
      },
      {
        key: 1,
        logo: "spotify.png",
        notification: "EXT_SPOTIFY-PLAY",
        sound: "opening"
      },
      {
        key: 2,
        logo: "volume-up.png",
        notification: "EXT_VOLUME-UP",
        sound: "up"
      },
      {
        key: 3,
        logo: "tv-off.png",
        notification: "EXT_SCREEN-END",
        sound: "closing"
      },
      {
        key: 4,
        logo: "stop.png",
        notification: "EXT_STOP",
        sound: "closing"
      },
      {
        key: 5,
        logo: "volume-down.png",
        notification: "EXT_VOLUME-DOWN",
        sound: "down"
      }
    ]
  },

  start: function() {
    this.resources = "/modules/EXT-StreamDeck/resources/"
    this.audio = null
  },

  getDom: function() {
    var wrapper = document.createElement("div")
    wrapper.style.display = 'none'
    return wrapper
  },

  notificationReceived: function(noti, payload, sender) {
    switch(noti) {
      case "DOM_OBJECTS_CREATED":
        this.sendSocketNotification("INIT", this.config)
        this.audio = new Audio()
        this.audio.autoplay = true
        break
      case "GAv4_READY":
        if (sender.name == "MMM-GoogleAssistant") this.sendNotification("EXT_HELLO", this.name)
        break
      case "EXT_STREAMDECK-ON":
        this.sendSocketNotification("ON")
        break
      case "EXT_STREAMDECK-OFF":
        this.sendSocketNotification("OFF")
        break
    }
  },

  socketNotificationReceived: function(noti, payload) {
    switch(noti) {
      case "WARNING":
        this.sendNotification("EXT_ALERT", {
          type: "warning",
          message: payload.message
        })
        break
      case "NOTIFICATION":
        this.sendNotification(payload.notification, payload.payload || undefined)
        break
      case "SOUND":
        this.audio.src= this.resources + payload + ".mp3"
        break
      case "KEYFINDER":
        this.sendNotification("EXT_ALERT", {
          type: "information",
          message: "You pressed key number: " + payload.key,
          timer: 3000
        })
    }
  }
});
