function MyAccountViewModel() {
    Config.InUse = true;
    $(".ec").hide();
    var self = this;
    self.Dealer = Config.Dealer;
    SetTitle();
    self.id = "#MyAccount";
    self.userStatus = ko.observable();
    self.userStatusNot = ko.observable();
    self.userStatus(Config.User.Logued);
    self.userStatusNot(!Config.User.Logued);
    Animate(self.id);
    self.Logout = function () {
        Config.User.Logued = false;
        Config.User.Token = 0;
        self.userStatus(false);
        self.userStatusNot(true);
        RemoveLogued();
    };
   // binds();
}
MyAccountViewModel.prototype = new Base;
ko.applyBindings(new MyAccountViewModel());
