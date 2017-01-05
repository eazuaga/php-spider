function Car(data) {
    this.id = data.id;
    this.price = data.price;
    this.model = data.model;
    this.mileage = data.mileage;
    this.fuel = data.fuel;
    this.power = data.power;
    this.traction = data.traction;
    this.long = data.long;
    this.width = data.width;
    this.height = data.height;
    this.weight = data.weight;
    this.trunk = data.trunk;
    this.used = data.used;
    this.color = data.color;
    this.optionals = data.optionals;
    this.displacement = data.displacement;
    this.year = data.year;
    this.make = data.make;
    this.PathImage = Path();
    this.image = data.images
}

function MyCarsViewModel() {
    //!Config.User.Logued ? window.location.hash = "#!/Login" : console.log("logued");
    !Config.User.Logued ? Change2("Login") : console.log("logued");
    var self = this;
    self.Dealer = Config.Dealer;
    SetTitle();
    self.name = "MyCars";
    self.Cars = ko.observableArray([]);
    self.MyCar = ko.observable();
    self.id = "#MyCars";
    self.IdMessageAnswer = ko.observable();
    //self.stories = ko.observableArray();
    self.popup = ko.observable(false);
    //Mapear = function (json) {
    //    var mapped = $.map(json.vehicles, function (item) { return new Car(item); });
    //    self.Cars(mapped);
    //    console.log(mapped);
    //    Repository.SetLocalStorage("MyCars", JSON.stringify(mapped));
    //}
    LoadMyCars = function () {
        //Repository.GetCallBack(self.name, Mapear, true);
        Repository.GetForUserLogueds({ name: 'CurrentCustomer', params: null, callback: Mapear });
        Animate(self.id);
    };
    LoadMyCarsById = function () {
        self.Cars($.parseJSON(Repository.GetItem(self.name))); /*lo cargo del local storage ya q incialmente lo llene*/
        var car = GetById(Parametros()[1]);
        self.MyCar = new Car(car);
        Animate(self.id);
    };
    //LoadEditMyCar = function () {
    //    LoadMyCarsById();
    //};
    LoadDeleteMyCar = function () {
        LoadMyCarsById();
    };
    //LoadInsertMyCar = function () {
    //    Animate(self.id);
    //};
    //LoadVehicleHistory = function () {
    //    var id = Parametros()[1];
    //    Repository.GetCallBack("VehicleHistory", MapearVehicleHistory, true, id);
    //  //  self.id = "#VehicleHistory";
    //};
    GetById = function (id) {
        console.log(id);
        var idCar = id;
        return Enumerable.From(self.Cars()).Where(function (x) { return x.id == idCar }).ToArray()[0];
    };
    //MapearVehicleHistory = function (json) {
    //    var mapped = $.map(json.history, function (item) { return new historyService(item); });
    //    self.stories(mapped);
    //    console.log(mapped);
    //    Animate(self.id);
    //    //self.history(new history(json));
    //};
 //   var section = { 'EditMyCar': LoadEditMyCar, 'DeleteMyCar': LoadDeleteMyCar, 'InsertMyCar': LoadInsertMyCar, 'MyCars': LoadMyCars };
    //  console.log("pathname : " + Config.History[Config.History.length - 2]);
    //section[Parametros()[0]]();
    LoadDeleteMyCar()
    //    section[Config.History[Config.History.length - 2]];
    var CurrentCustomer = $.parseJSON(Repository.GetItem("CurrentCustomer"));
    //Save = function () {
    //    var params = {
    //        'InsertMyCar': {
    //            model: self.MyCar.model, price: "0", mileage: self.MyCar.mileage,
    //            fuel: self.MyCar.fuel, power: "0", traction: "0", long: "0", width: "0",
    //            height: "0", weight: 0, trunk: "1", used: "1", color: "",
    //            optionals: "", displacement: "0",
    //            year: "", make: self.MyCar.make,
    //            starred: "0", userCustomer: CurrentCustomer.id, idCustomer: CurrentCustomer.id
    //        },
    //        'EditMyCar': {
    //            model: self.MyCar.model, price: "0", mileage: self.MyCar.mileage,
    //            fuel: self.MyCar.fuel, power: "0", traction: "0", long: "0", width: "0",
    //            height: "0", weight: 0, trunk: "1", used: "1", color: "",
    //            optionals: "", displacement: "0",
    //            year: "", make: self.MyCar.make,
    //            starred: "0", userCustomer: CurrentCustomer.id, id: Parametros()[1], idCustomer: CurrentCustomer.id
    //        }
    //    };
       // console.log(params[Parametros()[0]]);
      //  Repository.SendPost2("InventoryAll", params[Parametros()[0]]);
      //  $("#Message").fadeIn();
    //};
    Delete = function () {
        Repository.Del({ name: 'InventoryById', params: Parametros()[1], callback: LoadMyCars });
    };
}
MyCarsViewModel.prototype = new Base;
ko.applyBindings(new MyCarsViewModel());
