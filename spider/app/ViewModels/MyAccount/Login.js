function LoginViewModel() {
    var self = this;
    self.Dealer = Config.Dealer;
    if(Parametros()[0] === "MyCars") {
        SetTitle('my-' + Config.dealerType);
    } else {
        SetTitle();
    }
    self.id = "#Login";
    Animate(self.id);
    self.username = ko.observable();
    self.password = ko.observable();
    self.remember = ko.observable(false);
    var strCustomer = Repository.GetItem("LastUserLogued");
    self.username(strCustomer == "0" ? "" : strCustomer);
    LoginCallBack = function (json) {

        Config.User.Logued = json.type == "success";
        console.log("token usuario logueado " + json.message);
        Config.User.Token = json.message;
        Config.User.Id = json.id;
        Config.User.email = self.username();
        Config.User.Logued == true ? userLogued(json.id) : userNotLogued(json.message);
    };
    Mapear = function (json) {
        if (json !== null) {
            console.log("nombre de usuario :" + json.name);
            Config.User.name = json.name;
            Config.User.idCustomer = json.id;
            self.remember() == true ? Repository.SetLocalStorage("user", JSON.stringify(json)) : console.log("no lo recuerdo ");
        }

        //window.location.hash = "#!/MyAccount";
        Change2(Parametros()[0]);

    };
    userLogued = function (id) {
        Repository.SetLocalStorage("LastUserLogued", self.username());
        //alert(self.remember());
        var user = { token: Config.User.Token, email: self.username(), id: id };
        //console.log(user)
        Repository.GetForUserLogueds({ name: 'CurrentCustomer', params: null, callback: Mapear });
      

    };

    userNotLogued = function (mensaje) {
        alert("verifique usuario o contraseña : " + mensaje);
    };
    var test = false;
    self.Submit = function () {
        var Log = function () {
            self.username() == undefined ? alert("completar el nombre") : (
            self.password() == undefined ? alert("completar el password") : test = true);
            if (test) {
                var params = { username: self.username(), password: self.password(), remote: "true", loginApp: "false" , token : Config.TokenApp };
                Repository.Login(params, LoginCallBack, false);
            }
        }
       Config.OnLine ? Log() : alert(Traducir('MessageAlert'));
    }

}
LoginViewModel.prototype = new Base;
ko.applyBindings(new LoginViewModel());
