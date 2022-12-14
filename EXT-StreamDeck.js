/***********************
*  EXT-StreamDeck v1.0 *
*  Bugsounet           *
*  12/2022             *
***********************/

Module.register("EXT-StreamDeck", {
  defaults: {
    debug: false,
    device: null,
    Brightness: 100,
    EcoBrightness: 10,
    EcoTime: 10000,
    keyFinder: false,
    keys: [
      {
        key: 0,
        logo: "tv-on",
        notification: "EXT_SCREEN-WAKEUP",
        payload: null,
        command: null,
        sound: "opening"
      },
      {
        key: 1,
        logo: "spotify",
        notification: "EXT_SPOTIFY-PLAY",
        payload: null,
        command: null,
        sound: "opening"
      },
      {
        key: 2,
        logo: "volume-up",
        notification: "EXT_VOLUME-SPEAKER_UP",
        payload: null,
        command: null,
        sound: "up"
      },
      {
        key: 3,
        logo: "tv-off",
        notification: "EXT_SCREEN-END",
        payload: null,
        command: null,
        sound: "closing"
      },
      {
        key: 4,
        logo: "stop",
        notification: "EXT_STOP",
        payload: null,
        command: null,
        sound: "closing"
      },
      {
        key: 5,
        logo: "volume-down",
        notification: "EXT_VOLUME-SPEAKER_DOWN",
        payload: null,
        command: null,
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
