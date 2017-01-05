function OffertsMessage(data) {
    this.id = data.id;
    this.title = data.title;

    this.content = data.content;

    if(data.img !== undefined && data.img !== "") {
        this.img = Path() + data.img;
    } else {
        this.img = "";
    }

    if(data.dateFrom !== undefined && data.dateFrom !== "") {
        this.dateFrom = data.dateFrom.toString().toDate().toFormatedString(Config.DateFormat);
    } else {
        this.dateFrom = "";
    }

    if(data.dateTo !== undefined && data.dateTo !== "") {
        this.dateTo = data.dateTo.toString().toDate().toFormatedString(Config.DateFormat);
    } else {
        this.dateTo = "";
    }

    if(data.link !== undefined && data.link !== null && data.link !== "") {
        this.link = data.link;
    } else {
        this.link = window.location.hash;
    }
}

function OffertsViewModel() {
    $(".fa-exclamation-circle").hide();
    var self = this;
    self.Dealer = Config.Dealer;
    self.Offert = ko.observable();
    var idOffer = Parametros()[1] == undefined ? Config.LastIdOffer : Parametros()[1];
    var offers = $.parseJSON(localStorage.getItem("Offerts"));
    if (offers.length > 1) {
        CreateBackIcon();
    }
    var offert = Enumerable.From(offers).Where(function (x) {
        return x.id == idOffer
    }).ToArray()[0];
    //console.log(offert);
    self.Offert = new OffertsMessage(offert);
    self.id = "#DetaislOfferts";
    self.OpenExternalLink = function (link) {
        //console.log( link.Offert.link);
        window.open(link.Offert.link, '_system');
    };
    //SetTitle(self.Offert.title);
    SetTitle(Traducir('Offert'));
    console.log("me", this, self);
    CreateSharer(self.Offert.title + ' ' + self.Offert.content, '', self.Offert.img, offert.link);
    //self.share = function (texto, titulo, image, url) {
    //    window.plugins.socialsharing.share(texto, titulo, image, url);
    //};
    Animate(self.id);
}
OffertsViewModel.prototype = new Base;
ko.applyBindings(new OffertsViewModel());
