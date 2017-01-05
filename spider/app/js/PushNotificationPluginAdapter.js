(function( window, undefined ) {
    function Notification (e) {
        this.foreground = false;
        this.sound = '';
        this.title = '';
        this.content = '';
        this.type = '';
        this.url = '';
        this._original = {};
        if (e) {
            //La aplicacion esta abierta y en pantalla
            this.foreground = e.foreground == "1" ? true  : false; //Coercion
            this.sound = e.sound ? e.sound : "";
            this.title = e.title ? e.title : "";
            this.content = e.body ? e.body : (e.message ? e.message : "");
            this.type = e.type ? e.type : "";
            this.url = e.url ? e.url : "";

            this._original = e;

            if(e.payload) {
                //Info que viene de android
                var p = e.payload;
                this.sound = p.soundname ? p.soundname : "";
                this.title = p.title ? p.title : "";
                //this.content = "";
                this.type = p.type ? p.type : "";
                this.url = p.url ? p.url : "";
            }
        }

    }
    document.addEventListener('deviceready', _init, true);
    function _init () {
        if(window.device && window.plugins && window.plugins.pushNotification) {
            var pushNotification = window.plugins.pushNotification;;
            var successHandler, errorHandler, messageHandler = null;

            function PushPluginAdapter () {};

            PushPluginAdapter.prototype.register = function (options, shandler, ehandler, mhandler) {
                try {
                    successHandler = shandler;
                    errorHandler = ehandler;
                    messageHandler = mhandler;
                    console.log("PushPluginAdapter: Platform = " + device.platform);
                    if (device.platform.toLowerCase() == 'android' || device.platform == 'amazon-fireos' ) {
                        options["ecb"] = "ppa.onNotificationGCM";
                        pushNotification.register(function(){}, errorHandler, options);
                    } else {
                        if(device.platform == "Win32NT") {
                            options["ecb"] = "ppa.onNotificationWP8";
                            options["channelName"] = "PhonegapAppNotification";
                            options["uccb"] = "ppa.channelHandler";
                            //options["errcb"] = errorHandler;
                            pushNotification.register(this._channelHandler, errorHandler, options);
                        } else {
                            options["ecb"] = "ppa.onNotificationAPN";
                            pushNotification.register(_tokenHandler, errorHandler, options);
                        }
                    }
                    console.log(options);
                }
                catch(err) {
                    console.log("PushPluginAdapter: Exception occurs", err.message);
                }
            }

            function _tokenHandler(e) {
                successHandler(e);
            };

            window.ppa = new PushPluginAdapter();

            // handle APNS notifications for iOS
            window.ppa.onNotificationAPN = function (e) {
                console.log("PushPluginAdapter: iOS Event Received = ", e);
                if (e.badge) {
                    pushNotification.setApplicationIconBadgeNumber(function(){}, function(){}, e.badge);
                }
                messageHandler(new Notification(e));
            }

            // handle GCM notifications for Android
            window.ppa.onNotificationGCM = function (e) {
                console.log("PushPluginAdapter: Android Event Received = ", e);
                switch( e.event ) {
                    case 'registered':
                        if (e.regid.length > 0) {
                            successHandler(e.regid);
                        }
                        break;

                    case 'message':
                        //e.foreground
                        //e.coldstart
                        messageHandler(new Notification(e));
                        break;

                    case 'error':
                        errorHandler(e);
                        break;

                    default:
                        errorHandler(e);
                        break;
                }
            }

            // handle MPNS notifications for WP8
            window.ppa.onNotificationWP8 = function (e) {
                messageHandler(new Notification(e));
            }

            window.ppa._channelHandler = function (e) {
                successHandler(e.uri);
            }

        } else {
            console.log("PushPluginAdapter: All requirements are not met");
        }
    }
})(window);
