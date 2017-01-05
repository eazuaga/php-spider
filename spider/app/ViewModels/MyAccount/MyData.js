function user(data){
    this.email = data.email;
    this.name = data.name;
    this.surname = data.surname;
    this.location = data.location;
    this.phone = data.phone;
    this.token = data.Token;
}
function MyDataViewModel() {
    //!Config.User.Logued ? window.location.hash = "#!/Login" : console.log("logued");
    !Config.User.Logued ? Change2("Login") : console.log("logued");
    var self = this;
    self.Dealer = Config.Dealer;
    self.popup = ko.observable(false);
    SetTitle();
    self.name = "MyData";
    self.User = ko.observable();
    CreateBackIcon();
    var CurrentUser = $.parseJSON(Repository.GetItem("user"));
    var currentCustomer = null;
    var strCustomer = Repository.GetItem("CurrentCustomer");
    if(strCustomer !== 0) {
        currentCustomer = $.parseJSON(strCustomer);
    }
    if(currentCustomer === null) {
        currentCustomer = {
            email: CurrentUser.email,
            name: CurrentUser.name,
            surename: "",
            phone: "",
            location: ""
        };
    }
    self.User = {
        id: currentCustomer.id !== undefined ? currentCustomer.id : 0,
        dealer: currentCustomer.dealer !== undefined ? currentCustomer.dealer : Config.Dealer,
        idDealer: currentCustomer.dealer !== undefined ? currentCustomer.dealer : Config.Dealer,
        externalId: currentCustomer.externalId !== undefined ? currentCustomer.externalId : null,
        email: currentCustomer.email !== "" ? currentCustomer.email : CurrentUser.email,
        name: currentCustomer.name,
        surename: currentCustomer.surename,
        location: currentCustomer.address,
        address: currentCustomer.address,
        phone: currentCustomer.phone,
        token: Config.User.Token,
        user: Config.User.Id
    };
    console.log(self.User);
    self.id = "#MyData";
    Animate(self.id);
    var test = false;
    self.Submit = function () {
        var test = true;
        $("input:visible").each(function (i, v) {
            var _input = $(v);
            if (_input.val() === "") {
                InvalidateInput(_input);
                test = test & false;
            }
            var _txtEmail = $("#txtEmail");
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if(!re.test(_txtEmail.val())) {
                InvalidateInput(_txtEmail);
                test = test & false;
            }
        });
        if(test) {
            console.log(self.User);
            Repository.SetLocalStorage("user", JSON.stringify(self.User));
            Repository.SetLocalStorage("CurrentCustomer", JSON.stringify(self.User));
            if(Config.OnLine) {
                Repository.SendPost2("RegistCustomer", self.User);
            } else {
                Repository.SavePending({ key: "RegistCustomer", obj: self.User, callback: function () { } });
            }
            //$("#Message").fadeIn();
            alert(Traducir('RecordedData'));
        } else {
            alert(Traducir("checkTheFields"));
        }
    }
}
MyDataViewModel.prototype = new Base;
ko.applyBindings(new MyDataViewModel());
