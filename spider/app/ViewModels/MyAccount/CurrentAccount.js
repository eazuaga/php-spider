var previousBalance = 0;
function vouchers(data) {
    this.id  = data.id;
    this.description =  data.description;
    this.date  =  data.date;
    this.exchangeRate = data.exchangeRate;
    this.debit = data.debit;
    this.credit = data.credit;
    this.ammount = Config.moneyFormat.to(parseFloat(0 + data.debit - data.credit));
    this.FinalBalance = ko.computed(function() {
        previousBalance = previousBalance + parseFloat(data.debit.toFixed(2)) - parseFloat(data.credit.toFixed(2));
        return Config.moneyFormat.to(parseFloat(previousBalance.toFixed(2)));
    }, this);
}
function Accounts(data) {
    this.description = data.description;
    this.type = data.type;
    this.previousBalance = data.previousBalance;
    previousBalance = this.previousBalance;
    this.vouchers = $.map(data.vouchers, function (item) { return new vouchers(item); });
    this.balance = Config.moneyFormat.to(parseFloat(data.balance.toFixed(2)));
}
function CurrentAccount(data) {
    this.previousBalance = data.previousBalance;
    //this.balance = data.balance;
    this.balance = Config.moneyFormat.to(parseFloat(data.balance));
    this.accounts = $.map(data.accounts, function (item) { return new Accounts(item); });

}

function CurrentAccountListViewModel() {
    CreateBackIcon();
    LoadCurrentAccount = function (self) {
        !Config.User.Logued ? Change2("Login") : console.log("logued");
        GetTitle();
        self.name = "CurrentAccount";
        self.id = "#CurrentAccount";
        var url = Url(self.name);
        self.CurrentAccounts = ko.observableArray([]);
        self.CurrentAccount = ko.observable();
        self.User = Config.User.name;
        self.Dealer = Config.dealerName;
        self.Balance = ko.observable(0);
        self.MessageVisible = ko.observable(false);
        self.CurrentAccountVisible = ko.observable();
        Config.EnabledLoading = true;
        self.MessageVisible = ko.observable(Traducir('SearchingCurrentAccount'));
        /*this.Traducir = function (name) {
            var r = {};
            r = Config.Language[Config.LenguajeApp][name];
            return r;
        }*/

        Map = function (json) {
            Config.EnabledLoading = false;
            self.CurrentAccount(new CurrentAccount(json));
            self.Balance(self.CurrentAccount().balance);

            Animate(self.id);

        };
        Mapear = function (json) {
            console.log("cuenta correiente, objecto vacio ?", $.isEmptyObject(json));
            if (json === null || $.isEmptyObject(json)) {
                //alert(Traducir('CurrentAccountNotAvaiable'));
                self.MessageVisible = ko.observable(Traducir('CurrentAccountNotAvaiable'));
            } else {
                console.log("CUENTA CORRIENTE: ", json);
                Map(json);
                if(json.accounts.length == 0) {
                    self.MessageVisible(Traducir('CurrentAccountNotAvaiable'));
                    self.CurrentAccountVisible(false);
                } else {
                    self.MessageVisible("");
                    self.CurrentAccountVisible(true);
                }
            }



        }
        self.total = ko.computed(function () {
            var total = 0;
            for (var i = 0; i < self.CurrentAccounts().length; i++)
                total += self.CurrentAccounts()[i].debit;
            return total;
        });
        //    Repository.GetCallBack(self.name, Mapear, true);
        Config.OnLine ? Repository.GetForUserLogueds({ name: self.name, params: null, callback: Mapear }) : alert(Traducir('MessageAlert'));


    }

    LoadAccountDetail = function (self) {
        var json = Repository.GetItem("CurrentAccount");
        //console.log(json);
        var currentAccount = new CurrentAccount($.parseJSON(json));
        //console.log(currentAccount);
        self.Account = ko.observable();
        for(var i = 0; i < currentAccount.accounts.length; i++) {
            if(currentAccount.accounts[i].description === Parametros()[1]) {
                //console.log(currentAccount.accounts[i]);
                self.Account = currentAccount.accounts[i];
            }
        }
        console.log(self.Account);
        self.MessageVisible = ko.observable(false);
        self.CurrentAccountVisible = ko.observable();
        self.MessageVisible(currentAccount.accounts.length == 0);
        self.CurrentAccountVisible(currentAccount.accounts.length > 0);
        GetTitle();
    }


    var section = {
        'CurrentAccount': LoadCurrentAccount,
        'AccountDetail': LoadAccountDetail
    };
    console.log(section);
    section[Parametros()[0]](this);
}
CurrentAccountListViewModel.prototype = new Base;
ko.applyBindings(new CurrentAccountListViewModel());

