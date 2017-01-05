function RegisterViewModel() {
    var self = this;
    self.Dealer = Config.Dealer;
    console.log("Cargando Register.html");

    /*sacar este hook*/
    // Config.OnLine = false;
    /**/
    SetTitle('Register');

    self.id = "#register";
    Animate(self.id);
    self.AsVisitorText = Traducir('AsVisitor').replace("{%dealer_name%}", Config.dealerName);
    self.Email = ko.observable();
    self.Nombre = ko.observable();
    self.RPassword = ko.observable();
    self.language = ko.observable();
    self.Password = ko.observable();
    self.enabled = ko.observable();
    self.disabled = ko.observable();
    self.enabled(false);
    /*registro en  0*/
    self.customer = ko.observable(new Customer({ phone: '' }));
    self.disabled(true);
    var test = false;
    $("#app").show();
    $("#menu").hide();
    //if (window.display.deviceType !== "tablet") {
    //    $("#menu").hide();
    //} else {
    //    $("#menu").show();
    //}
    $("#iconMenu").hide();
    //self.customer().id = Config.User.idCustomer;

    var MappearClienteExistente = function (json) {
        //self.customer = ko.observable(new Customer(json));
        self.customer().id = json.id;
        self.customer().dealer = json.dealer;
        console.log("customer antes de subirds",self.customer());
        //return;
        //validate();
        SubmitProfile();
    };


    Map = function (json) {
        self.customer(new Customer(json));
        InsertInfoDevices();

    };
    goHome = function(){
        ShowMenu();
    }
    /*validate = function() {
        if (self.customer().email == undefined) {
            alert(Traducir("RequiredEmail"));
        } else {
            if (self.customer().password == undefined) {
                alert(Traducir("RequiredPassword"));
            } else {
                if (self.RPassword() == undefined) {
                    alert(Traducir("PasswordMustMatch"));
                } else {
                    test = true;
                }
            }
        }

    };*/
    SubmitProfile = function() {
        var test = true;
        var _username = $("#username");
        var _pass = $("#password");
        var _rpass = $("#rpass");
        var _cbx = $("#cbxTerms");
        console.log("Nombre: ", self.customer().name);
        console.log("Username: ", _username.val());
        console.log("Password: ", self.customer().password);
        console.log("Re-Password: ", _rpass.val());
        $("input:visible").each(function (i, v) {
            var _input = $(v);
            if (_input.val() === "") {
                InvalidateInput(_input);
                test = test & false;
            }
            //test = true;
        });
        if(_pass.val() !== _rpass.val()) {
            InvalidateInput(_pass);
            InvalidateInput(_rpass);
            test = test & false;
        }
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if(!re.test(_username.val())) {
            InvalidateInput(_username);
            test = test & false;
        }
        if(!_cbx.is(":checked")) {
            InvalidateInput(_cbx);
        }
        if (test) {
            console.log("Registracion valida", self.customer());
            var params = {
                dealer: Config.Dealer,
                name: self.customer().name,
                username: self.customer().email,
                password: self.customer().password,
                active: "0",
                customer: self.customer().id,
                email: self.customer().email
            };
            if (Config.OnLine) {
                Repository.SendPost("RegistCustomer", self.customer(), function (data) {
                    params.customer = data.id;
                    Repository.SendPost("User", params, function (data) {
                        if (data.type && data.type === "error") {
                            alert(data.message);
                        } else {
                            alert(Traducir('checkYourEmail'));
                            var device = {
                                id: Config.IdDevice,
                                type: Config.Platform,
                                serial: Config.registrationid,
                                idDealer: Config.Dealer,
                                customer: params.customer
                            }
                            Repository.SendPost("Devices", device, goHome);
                        }
                    });
                });

                /*Repository.SendPost("User", params, function (data) {
                    if (data.type && data.type === "error") {
                        alert(data.message);
                    } else {
                        Repository.SendPost("RegistCustomer", self.customer(), goHome);
                        alert(Traducir('checkYourEmail'));
                    }
                });*/
            } else {
                Repository.SavePending({ key: "User", obj: params });
                Repository.SavePending({ key: "Customer", obj: self.customer(), callback: MapCustomer });
                alert(Traducir('willbesent'));
            }
        } else {
            alert(Traducir("checkTheFields"));
        }
    };
    self.Submit = function () {
        var idCustomer = Config.User.idCustomer === 0 ? $.parseJSON(Repository.GetItem('CustomerRegistred')).id : Config.User.idCustomer;
        console.log("idCustomer", idCustomer);
        Repository.GetCallBack("Customer", MappearClienteExistente, true, { id: idCustomer });
    }
    self.openMenu = function () {
        if (window.display.deviceType === "tablet") {
            console.log("muetro el menu tablet");
            $("#menu").show();
        } else {
            /*en la viste de dispositivo lo muestro*/
            ShowMenu();
        }

    }
}

RegisterViewModel.prototype = new Base;
ko.applyBindings(new RegisterViewModel());
