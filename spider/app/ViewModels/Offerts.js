function OffertsMessage(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.img = Config.OnLine ? Config.GetUrlApi() + data.img : Config.ImgNotAvailable;
    this.active = data.active;
    if(data.dateFrom !== undefined && data.dateFrom !== "") {
        this.dateFrom = data.dateFrom.toString().toDate().toFormatedString(Config.DateFormat);
        this.dateFromCalc = data.dateFrom.toString().toDate().toFormatedString();
    } else {
        this.dateFrom = "";
        this.dateFromCalc = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0 ,0 , 0).toFormatedString();
    }

    if(data.dateTo !== undefined && data.dateTo !== "") {
        this.dateTo = data.dateTo.toString().toDate().toFormatedString(Config.DateFormat);
        this.dateToCalc = data.dateTo.toString().toDate().toFormatedString();
    } else {
        this.dateTo = "";
        this.dateToCalc = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0 ,0 , 0).toFormatedString();
    }
    this.link = (data.link) == "" ? "#!/DetailOffers/" + data.id : data.link;
}

function OffertsListViewModel() {
    window.onpopstate = function (event) {

    };
    Config.InUse = true;
    $(".fa-exclamation-circle").hide();
    var self = this;
    SetTitle();
    self.Dealer = Config.Dealer;
    self.Offerts = ko.observableArray([]);
    self.resultMessage = ko.observable(Traducir('SearchingOffers'));
    self.name = "Offerts";
    var url = Url(self.name);
    Mapear = function (json) {
       // json.length == 0 ? alert(Traducir('GeolocalizacionDisabled')) : false;
        var mapped = $.map(json, function (item) { return new OffertsMessage(item); });
        var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0 ,0 , 0);

        var offersAvailable = Enumerable.From(mapped).Where(function (x) {
            console.log(today, " ==> ", x.dateFromCalc.toString().toDate(), " ==> ", x.dateToCalc.toString().toDate());
            return (x.active == "1" && today >= x.dateFromCalc.toString().toDate() && today <= x.dateToCalc.toString().toDate());
        }).ToArray();
        offersAvailable.length > 0 ? Config.LastIdOffer = offersAvailable[0].id : false;
        offersAvailable.length == 1 ? Change2("DetailOffers")   : self.Offerts(offersAvailable);
        if(json.length > 0) {
            self.resultMessage('');
        } else {
            self.resultMessage(Traducir('NoOffersAvailable'));
        }
       // binds();
    }
    Repository.GetCallBack(self.name, Mapear, true);
    self.id = "#Offerts";
    Animate(self.id);
}
OffertsListViewModel.prototype = new Base;
ko.applyBindings(new OffertsListViewModel());
