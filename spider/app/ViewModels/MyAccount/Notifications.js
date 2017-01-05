function NotificationsViewModel() {

    //!Config.User.Logued ? Config.change2("Login") : console.log("logued");
    //Config.User.Token == undefined ? Config.change2("Login") : console.log("logued");
    var json2 = {}
    var self = this;
    self.Dealer = Config.Dealer;
    SetTitle();
    CreateBackIcon();
    self.id = "#Notifications";
    Animate(self.id);
    self.Noticias = ko.observable("1");
    self.Turnos = ko.observable("1");
    self.Servicios = ko.observable("1");
    self.Ofertas = ko.observable("1");
    self.Mensajes = ko.observable("1");
    callbackNotifications = function (json) {
        //var jason = { Noticias: "1", Ofertas: "1", Mensajes: "1" };
        console.log("llega");
        console.log(json.notifications);

        if (json.notifications !== "0" && json.notifications !== null) {
            console.log("entra?");
            self.Noticias = ko.observable("0");
            self.Turnos = ko.observable(json.notifications !== 0 ? (json.notifications.hasOwnProperty('turnos') ? json.notifications.turnos : "0") : "0");
            //self.Turnos = ko.observable(json.notifications !== 0 ?  json.notifications.Turnos : "0") ;
            self.Servicios = ko.observable(json.notifications !== 0 ? (json.notifications.hasOwnProperty('servicios') ? json.notifications.servicios : "0") : "0");
            self.Ofertas = ko.observable(json.notifications !== 0 ? json.notifications.Ofertas : "0");
            self.Mensajes = ko.observable(json.notifications !== 0 ? json.notifications.Mensajes : "0");
        }
        var sliders = [
            { id: "#slider-Ofertas", value: self.Ofertas() },
            { id: "#slider-Mensajes", value: self.Mensajes() },
            { id: "#slider-Turnos", value: self.Turnos() },
            { id: "#slider-Servicios", value: self.Servicios() }
                ];
        console.log(sliders[0].value);
        console.log(sliders[1].value);
        for (var i = 0; i < sliders.length; i++) {
            
            $(sliders[i].id).noUiSlider({
                start: sliders[i].value,
                range: {
                    'min': [0, 1],
                    'max': 1
                },
                format: wNumb({
                    decimals: 0
                })
            });
            $(sliders[i].id).addClass('toggle');
            $(sliders[i].id).Link('lower').to(toggle);
        }

        $("#slider-Ofertas").on({
            change: function () {
                var value = $("#slider-Ofertas").val();
                self.Ofertas(value);
                self.OnChange();
            }
        });
        $("#slider-Mensajes").on({
            change: function () {
                console.log("cambia");
                var value = $("#slider-Mensajes").val();
                self.Mensajes(value);
                self.OnChange();
            }
        });
        $("#slider-Turnos").on({
            change: function () {
                console.log("cambia");
                var value = $("#slider-Turnos").val();
                self.Turnos(value);
                self.OnChange();
            }
        });
        $("#slider-Servicios").on({
            change: function () {
                console.log("cambia");
                var value = $("#slider-Servicios").val();
                self.Servicios(value);
                self.OnChange();
            }
        });

    };
    self.OnChange = function () {
        //{"Turnos": "0", "Servicios": "0" ,"Noticias":"1","Ofertas":"1","Mensajes":"1"}
        var notifications = { Turnos: self.Turnos(), Servicios: self.Servicios(), Ofertas: self.Ofertas(), Mensajes: self.Mensajes(), tokenUser: Config.User.Token };
        console.log(notifications);
        idCustomer = Config.User.idCustomer == 0 ? JSON.parse(Repository.GetItem("CurrentCustomer")).id : Config.User.idCustomer;
        var params = { id: Config.IdDevice, serial: Config.registrationid, type: Config.Platform, notifications: notifications, customer: idCustomer, idDealer: Config.Dealer };
        //Repository.SendPost2("Devices", params);
        Config.OnLine ? Repository.SendPost2("Devices", params) : Repository.SavePending({ key: "Devices", obj: params });
        Repository.SetLocalStorage("Device", JSON.stringify(params));
        console.log(params);
        return true;
    }

    Config.OnLine ? Repository.GetCallBack('Device', callbackNotifications, true, Config.IdDevice) :
    callbackNotifications(Repository.GetItem('Device') != 0 ? $.parseJSON(Repository.GetItem('Device')) : 0);
    function toggle(value) {
        $(this).toggleClass('off', value === "1");
    }
 }
NotificationsViewModel.prototype = new Base;
ko.applyBindings(new NotificationsViewModel());
