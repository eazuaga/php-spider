var fakeDeviceReady = 0;
var Sync = {
    configReady: false,
    deviceRegistered: false,
    bindEvents: function () {
        console.log("bindea eventos");
        document.addEventListener('deviceready', this.onDeviceReady, false);

       // if(window.mobilecheck()){
        if (navigator.appVersion.indexOf("Win") != -1) {
            fakeDeviceReady = setTimeout(function () {
                console.log("fake device ready trigger");
                if (window.device === undefined) {
                    window.device = window.navigator;
                    window.device.version = window.navigator.vendor;
                    Config.Platform = device.platform + " " + device.version;
                    Config.registrationid = window.navigator.userAgent;
                    console.log(window.device);
                    Sync.onOnline();
                    //Sync.initialize();
                    //Sync.LoginBackEnd();
                    //Sync.LoginBackEnd();
                }
            }, 3000);

        } else {
            document.addEventListener("online", this.onOnline, false);
            document.addEventListener("offline", this.onOffline, false);
        }

        document.addEventListener("searchbutton", this.SearchByDescriptions, false);
        document.addEventListener('showkeyboard', this.onKeyboardShow, false);
        document.addEventListener('hidekeyboard', this.onKeyboardHide, false);

    },
    checkConnection:function () {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

      //  alert('Connection type: ' + states[networkState]);
        return states[networkState];
    },
    //InsertInfoDevices : function () {
    //    var notifications = { Noticias: "1", Ofertas: "1", Mensajes: "1" };
    //    var params = { serial: Config.registrationid, type: Config.Platform, notifications: notifications, customer: self.customer().id, idDealer: Config.Dealer };
    //    console.log(params);
    //    Repository.SendPost("Devices", params , this.SaveDeviceLocal);
    //},
    //SaveDeviceLocal : function (json) {
    //    console.log(json);
    //    json.id == "0" ? console.log("serial de dispositivo nulo") : Config.IdDevice = json.id;
    //},
    LoginBackEnd: function () {
        //        SynchronizeCallback();
       // OfflineMode();
        Sync.Synchronize();
       // Repository.GetCallBack("Settings", Sync.SynchronizeCallback, false);
  //      Repository.Login(Config.UserApp, Sync.LoginAppCallBack, true);
    },
    LoginAppCallBack: function (json) {
        console.log("despues del logueo de la app"+json);
        if (json.type == "success") {
            if (json.message !== undefined) {
                Repository.SetLocalStorage("tokenApp", json.message);
                Config.TokenApp = json.message;

            }

            Sync.Synchronize(json.message);
            Repository.ProcessBach();
        }
        if (json.type == "error") {
            alert("no se pudo conectar al servidor ");
            /*cambia de posicion el array que  define el ambiente*/
            OfflineMode();
            Sync.Synchronize();
        }
    },
    Synchronize: function (token) {
        Config.TokenApp = token;
        Config.User.Logued = Repository.IsLogued();
        var value = Repository.GetItem("user");
        if (value != 0) {
            Config.User.Token = $.parseJSON(Repository.GetItem("user")).token;
        }
        // this.User.Token = $.parseJSON(Repository.GetItem("user")).token;
        var strCustomer = Repository.GetItem("CurrentCustomer");
        var currentCustomer = null;
        if (strCustomer !== 0) {
            currentCustomer = $.parseJSON(strCustomer);
        }
        if (currentCustomer === null) {
            currentCustomer = {
                email: Config.User.email,
                name: Config.User.name,
                surename: "",
                phone: "",
                location: ""
            };
        }
        Config.User.name = currentCustomer.name;
        Config.User.email = currentCustomer.email;
        Repository.GetCallBack("Settings", Sync.SynchronizeCallback, false);
    },
    SynchronizeCallback: function (jsonC) {
        var json = jsonC[0];
        $("#loaderS").hide();
        localStorage.setItem("Config", JSON.stringify(json));

        var template;
        var crossPlataform;
        console.log(json.template);
        Config.CurrentTemplate = json.template == undefined ? "lista" : Config.Template[json.template];
        console.log((json.numberOptions));
        Config.moneyFormat = wNumb({ mark: json.numberOptions.decDelimiter, thousand: json.numberOptions.thousandsDelimiter, decimals: 2 });
        Config.Currency = (json.numberOptions).currencySymbol;
        Config.decDelimiter = (json.numberOptions).decDelimiter;
        Config.usedContact = json.usedContact;
        Config.newContact = json.newContact;
        Config.partsContact = json.partsContact;
        Config.offersContact = json.offersContact;
        Config.mileageUnit = json.mileageUnit;
        Config.thousandsDelimiter = (json.numberOptions).thousandsDelimiter;
        crossPlataform = Config.Platform === "Android 2.3.5" ? "Android23" : "others";
        //  alert(Config.Platform);
        $("head").prepend(("<link rel='stylesheet' href='css/<%stylebody%>.css' type='text/css' media='screen'>").replace("<%stylebody%>", crossPlataform));
        $("head").append(("<link rel='stylesheet' href='css/<%template%>.css' type='text/css' media='screen'>").replace("<%template%>", Config.CurrentTemplate));
        $("head").append(("<link rel='stylesheet' href='css/Themes/<%tema%>.css' type='text/css' media='screen'>").replace("<%tema%>", Config.theme[json.theme]));
        console.log("THEME INDEX: ", json.theme);
        console.log("Theme = ", Config.theme[json.theme]);
        $("#launcher").addClass(Config.CurrentTemplate);
        Repository.GetJsonLocal(Config.UrlApi.ThemeInfo.Local.replace("<%theme_name%>", Config.theme[json.theme]), "ThemeInfo");
        Config.LenguajeApp = json.language;
        Config.wsSettings = json.wsSettings;
        console.log(json.dealerType);

        if(json.dealerType == "tractor-front") {
            Repository.GetJsonLocal(Config.UrlApi.AllMakesNModelsMachines.Local, "AllMakesNModels");
        } else {
            Repository.GetJsonLocal(Config.UrlApi.AllMakesNModels.Local, "AllMakesNModels");
        }

        var models = [
            { "id": "0", "name": Traducir('AllModels'), "value": "all" },
            { "id": "1", "name": "Corsa", "value": "Corsa" },
            { "id": "2", "name": "Captiva", "value": "Captiva" },
            { "id": "3", "name": "Camaro", "value": "Camaro" },
            { "id": "4", "name": "Aveo", "value": "Aveo" },
            { "id": "5", "name": "Celta", "value": "Celta" },
            { "id": "6", "name": "Astra", "value": "Astra" },
            { "id": "7", "name": "Celta", "value": "Celta" },
            { "id": "8", "name": "corolla", "value": "corolla" },
            { "id": "9", "name": "all", "value": "all" }
        ];
        var brand = [
            { "id": "0", "name": Traducir('AllBrands'), "value": "all" },
            { "id": "1", "name": "Chevrolet", "value": "Chevrolet" },
            { "id": "2", "name": "Susuki", "value": "Susuki" },
            { "id": "3", "name": "all", "value": "all" }
        ];
        localStorage.setItem("Brand", JSON.stringify(brand));
        localStorage.setItem("Models", JSON.stringify(models));

        Config.Dealer = json.dealer;
        Config.OnLine ? $("#logo").attr("src", Path() + json.icon) : $("#logo").attr("src", Config.Logo);
        //Config.Logo = Path() + json.icon;
        Config.TransitionIn = json.transitions;
        Config.dealerName = json.dealerName;
        Config.dealerType = json.dealerType;
        Config.Apoint365 = json.turnos365;
        Config.DateFormat = json.dateFormat;
        Config.DateTimeFormat = json.dateTimeFormat;
        //Repository.ajaxCallBack("InventoryAll");
        /*vacio los resultados de busquedas*/
        Repository.SetLocalStorage("SearchInventory", "");
        Config.menu = $.parseJSON(json.menu);
        var itemMenu = function () {
            var menu = Config.menu;
            for (var i = 0; i < menu.length; i++) {
                if(menu[i].custom !== null && menu[i].custom !== undefined && menu[i].custom.trim() !== "") {
                    menu[i].texto = menu[i].custom;
                    /*console.log(menu[i].custom)*/
                } else {
                    var texto = Config.Language[Config.LenguajeApp][menu[i].texto];
                    if(texto === null || texto === undefined || texto.trim() === "") {
                        menu[i].texto = menu[i].texto;
                    } else {
                        menu[i].texto = texto;
                    }
                }
                //console.log(clase);
                var clase = menu[i].clase.trim();
                switch (clase) {
                    case "fa fa-star":
                        clase = "fa fa-menu-ofertas";
                        break;
                    case "fa fa-user":
                        clase = "fa fa-menu-mi-cuenta";
                        break;
                    case "fa fa-calendar":
                        clase = "fa fa-menu-turnos";
                        break;
                    case "fa fa-map-marker":
                        clase = "fa fa-menu-localizacion";
                        break;
                    case "fa fa-users":
                        clase = "fa fa-menu-contactos";
                        break;
                    case "fa fa-gears":
                        clase = "fa fa-menu-repuestos";
                        break;
                    case "fa fa-comment-o":
                        clase = "fa fa-menu-mensajes";
                        break;
                }
                menu[i].clase = clase;
            }
            return menu;
        };
        Config.mainImage = json.mainImage;
       // ProcessTemplate(itemMenu(), "#TmplMenu", "#launcher", "");
        //var mainImage = Config.mainImage === "" ? "<div class='backmenu' ></div>" : "<img class='imageBanner'  width='100%' src='" + Config.GetUrlApi() + Config.mainImage + "' />";
        //$("#launcher").prepend(" <div><a id='back'  href='javascript:void(0)'> <i class='fa fa-m-left-arrow textIcons'></i></a>" +
        //    mainImage  +
        //    "</div>");
        $("#launcher").css("overflow", "overlay");
        //ProcessTemplate(itemMenu(), "#TmplMenu", "#launcher2", "");
        //grid-cell grc-1-3 launcher
        //$("#launcher").append(" <a class='grid-cell grc-1-3 launcher powered-atl' href='http://www.autologica.com/clientconnect.html'> By <strong>Autologica ClientConnect</strong></a>");
        adjustTemplate($(window).height());
        EvalMenu(Config);
        Change();
        $(window).bind('hashchange', function () {
            Change();
        });
        $(document).trigger("configReady");
        loadIframeApoint();
        console.log("configReady Trigger");
            if ($.parseJSON(Repository.GetItem('Customer')).id === undefined) {
                if ($.parseJSON(Repository.GetItem('CustomerRegistred')).id === undefined) {
                    console.log("Dispositivo no sincronizado con backend");
                    Sync.registerDeviceOnBackend();
                }
            }
        console.log("check register");
        //Repository.GetFromLocalStorage("terms", "ok", DisplayTerms);
        DisplayTerms();
        //Repository.GetFromLocalStorage2("Register", "ok", Config.DisplayTerms);
    },
    onOnline: function () {
     //   alert("synchronizing...");
        //console.log("modo online");
        //OnlineMode();
        //if (Config.TokenApp === undefined) {
        //    console.log("re logueo ");
        //    //Sync.LoginBackEnd();
        //    console.log(Repository.GetItem("tokenApp"));
        //    Config.TokenApp = Repository.GetItem("tokenApp");
        //    if (Config.TokenApp === "0" || Config.TokenApp === "undefined") {
        //        Sync.LoginBackEnd();
        //    }
        //}
        //if (!Config.ResourceLoaded) {
        //    Config.ResourceLoaded = true;
        //    Sync.LoginBackEnd();
        //};
        Sync.LoginBackEnd();

        //procesa datos que quedaron pendientes
        //Repository.ProcessBach();

        //alert(Traducir("Sincronizando..."));
        //alert(Traducir("synchronizing"));
        Change();
    },
    onKeyboardHide: function () {
        Config.ActiveKeyboard = false;
    },
    onKeyboardShow: function () {
        Config.ActiveKeyboard = true;
    },
    onOffline: function () {
        alert(Traducir("checkyourinternetconnection"));
        console.log("modo offline");
        OfflineMode();
        //Sync.onOffline();
        if (!Config.ResourceLoaded) {
            Config.ResourceLoaded = true;
            Sync.Synchronize();
        };
    },
    onDeviceReady: function () {
        clearTimeout(fakeDeviceReady);
        Sync.receivedEvent('deviceready');
      //  var typeConnection = Sync.checkConnection();
        var timeout = { 'WiFi connection': 3000, 'Cell 2G connection': 30000, 'Cell 3G connection': 30000, 'Cell 4G connection': 30000 };
    //    Config.timeout = timeout[typeConnection];
       // Sync.initialize();
        Sync.LoginBackEnd();

    },
    onBackKeyDown: function () {// Handle the back button
        if(location.hash === "") {
            navigator.notification.confirm(
                Traducir('AreYouSureYouWantToExit'),
                function(index) {
                    if( index == 1 ){//look at the docs for this part
                        navigator.app.exitApp();
                    }
                },
                Traducir('ExitApp'),
                Traducir('Yes') + ',' + Traducir('No')
            );
        } else {
            history.go(-1);
            navigator.app.backHistory();
        }
    },

    registerDeviceOnBackend: function () {
        var notifications = {
            turnos: "1",
            servicios: "1",
            Ofertas: "1",
            Mensajes: "1"
        };
        var params = {
            serial: Config.registrationid,
            type: Config.Platform,
            notifications: notifications,
            customer: Config.User && Config.User.idCustomer ? Config.User.idCustomer : "",
            idDealer: Config.Dealer ? Config.Dealer : ""
        };
        console.log("Device", params);
        if(Config.OnLine) {
            Repository.SendPost("Devices", params, function (json) {
                console.log(json);
                if(json.id == "0") {
                    console.log("Fallo el registro del dispositivo");
                    Repository.SavePending({ key: "Devices", obj: params, callback: function () { } });
                    return;
                } else {
                    Config.IdDevice = json.id;
                }
                Repository.SetLocalStorage("IdDevice", json.id);
                Repository.SetLocalStorage("Register", "ok");
                Repository.SetLocalStorage("Device", JSON.stringify(json));
                console.log("Dispositivo registrado en Backend");
                var idCustomer = parseInt(json.customer, 10);
                console.log(idCustomer);
                if(!(json.customer && !isNaN(idCustomer) && parseInt(idCustomer) > 0)) {
                    console.log("El dispositivo no tiene customer, registramos un base");
                    var customer = new Customer({ phone: '' });
                    if(Config.OnLine) {
                        Repository.SendPost("RegistCustomer", customer, function (json) {
                             Repository.SetLocalStorage("CustomerRegistred", JSON.stringify(json));
                             Config.User.idCustomer = json.id;
                            params.customer = json.id;
                            Repository.SendPost("Devices", params, function (json) {
                                console.log("actualizo el device", json);
                                Repository.SetLocalStorage("Device", JSON.stringify(json));
                            });
                        } );
                    } else {
                        Repository.SavePending({ key: "RegistCustomer", obj: customer, callback: function () { }  });
                    }
                } else {
                    Config.User.idCustomer = idCustomer;
                    console.log("El dispositivo tiene customer, no lo registramos");
                }
            });
        } else {
            Repository.SavePending({ key: "Devices", obj: params, callback: function () { } });
        }
    },
    SearchByDescriptions: function () {
        alert("presiono el boton de busqueda");
    },
    registrationid: "",
    registerDevice: function () {
      
      
    },

    receivedEvent: function (id) {
        Sync.registerDevice();
    },
    ShowNotificationBadge: function (tipo) {
        //alert("ha recibido una notificacion ");
        switch (tipo) {
            case "Offer":
                $(".fa-star").parent().find(".fa-exclamation-circle").show();
                break;
            default:
                tipo = "Messages";
                $("a[href='#!/" + tipo + "'] .ec").show();
                break;
        }
    },
    HideNotificationBadge: function (tipo) {
        //alert("ha recibido una notificacion ");
        switch (tipo) {
            case "Offer":
                $(".fa-star").parent().find(".fa-exclamation-circle").hide();
                break;
            default:
                tipo = "Messages";
                $("a[href='#!/" + tipo + "'] .ec").hide();
                break;
        }
    },
    initialize: function () {

    }

};

Sync.bindEvents();




