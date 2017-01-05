function parts(data) {
    this.id = data.id;
    this.dealer = data.dealer;
    this.name = data.name;
    this.code = data.code;
    this.link = data.link;
    this.img = data.img;
    this.stock = data.stock;
    this.price = data.price;
    this.origin = data.origin;
    this.supplier = data.supplier;
    this.group = data.group;
    this.url = data.url;
    this.starred = data.starred;
    this.model = data.model;
    this.quantity = data.quantity;
    this.chargeTo = data.chargeTo;
}
function jobs(data) {
    this.id = data.id;
    this.description = data.description;
    this.quantity = data.quantity;
    this.price = data.price;
    this.chargeTo = data.chargeTo;
    this.unit = data.unit;

}
function services(data) {
    this.id = data.id;
    this.description = data.description;
    this.jobs = $.map(data.jobs, function (item) { return new jobs(item); });
    this.parts = $.map(data.parts, function (item) { return new parts(item); });
}

function historyService(data) {
    this.id = data.id;
    this.description = data.description;
    this.date = data.date.toDate().toFormatedString(Config.DateFormat);
    this.mileage = data.mileage;
    this.store = data.store;
    this.parts = $.map(data.parts, function (item) { return new parts(item); });
    this.jobs = $.map(data.jobs, function (item) { return new jobs(item); });
    this.services = $.map(data.services, function (item) { return new services(item) });
}
function VehicleHistoryViewModel() {
    !Config.User.Logued ? Change2("Login") : console.log("logued");
    $(".ec").hide();
    var self = this;
    self.vehicleHistoryVisible = ko.observable(true);
    SetTitle();
    self.name = "VehicleHistory";
    self.IdMessageAnswer = ko.observable();
    CreateBackIcon();
    self.stories = ko.observableArray();
    self.Model = Parametros()[2];
    self.Year = Parametros()[3];
    self.km = Parametros()[4];
    self.make = Parametros()[5];
    self.MessageVisible = ko.observable(Traducir('SearchingVehicleHistory'));

    Map = function (json) {
        console.log(json);
        console.log(json.history.length > 0);
        if(json.history.length > 0) {
            self.MessageVisible("");
            self.vehicleHistoryVisible(true);
        } else {
            self.MessageVisible(Traducir('VehicleHistoryNotAvaiable'));
            self.vehicleHistoryVisible(false);
        }
        var mapped = $.map(json.history, function (item) { return new historyService(item); });
        self.stories(mapped);
    };
    MapearVehicleHistory = function (json) {
        json == null ? Change2("Login") : Map(json);
        //self.history(new history(json));

    };
    var id = Parametros()[1];
    //Repository.GetCallBack(self.name, MapearVehicleHistory, true, id);
    Repository.GetForUserLogueds({ name: self.name, params: id, callback: MapearVehicleHistory });
    self.id = "#VehicleHistory";
    Animate(self.id);

}
VehicleHistoryViewModel.prototype = new Base;
ko.applyBindings(new VehicleHistoryViewModel());
