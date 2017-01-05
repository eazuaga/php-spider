function Car(data) {
    this.id = data.id;
    this.price = data.price;
    this.model = data.model;
    this.mileage = (data.mileage + "") === "-1" ? "" : data.mileage;
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
    this.licensePlate = data.licensePlate;
    this.year = data.year == '0' ? "":data.year;
    this.make = data.make;
    this.PathImage = Path();
    //this.image = data.images;
    this.image = data.images != null ? (data.images[0] == "" || data.images[0] == undefined ? "img/not.jpg" : this.PathImage + data.images[0]) : "img/not.jpg";
    this.visibleEditcar = ko.observable(true);
    this.visibleSaveCar = ko.observable(false);

}
function historyService(data) {
    this.description = data.description;
    this.date = data.date;
    this.mileage = data.mileage;
    this.store = data.store;
    this.parts = data.parts;
    this.jobs = data.jobs;
}
function MyCarsViewModel() {
    var self = this;
    self.Dealer = Config.Dealer;
    SetTitle('my-' + Config.dealerType);
    self.name = "MyCars";
    self.Cars = ko.observableArray([]);
    self.MyCar = ko.observable();
    CreateBackIcon();
    self.id = "#MyCars";
    self.IdMessageAnswer = ko.observable();
    self.popup = ko.observable(false);
    self.MessageVisible = ko.observable(false);
    $(self.id).hide();
//    self.visibleSaveEditcar = ko.observable(false); UnitsnotAvailable
    //!Config.User.Logued ? window.location.hash = "#!/Login" : console.log("logued");
    Map = function (json) {
        console.log(json.length);
        self.MessageVisible(json.length > 0);
       // json.length == 0  ? alert(Traducir('UnitsnotAvailable')) : false;
        var code = json.vehicles[0].id;
        console.log(code);
        if (code != "0") {
            var mapped = $.map(json.vehicles, function(item) { return new Car(item); });
            self.Cars(mapped);
            console.log(mapped);
            Repository.SetLocalStorage("MyCars", JSON.stringify(mapped));
            $(self.id).show();
        } else {
            self.Cars([]);
        }

    };
    self.visibleField = function (text) {
        var text = String(text);
        return text == undefined ? false : (text == "0" ? false : !text.IsNullOrEmpty());
    };
    Mapear = function (json) {
        console.log("entra en mapeard");
        //alert(json);
      //  Repository.displayLoad(false);//saco el loading si sale por errror

        json == null ? alert(Traducir("HasNoClientAssociated")) : console.log("tiene cliente asociado");
        json == null ? Change2("Login") : Map(json);
        //$(".DisplayEditcar").click(function () {
        //    $(this).parent().find(".editcar").show();
        //    $(this).hide();
        //});

        Animate(self.id);

    }
    LoadMyCars = function () {
        //Repository.GetCallBack(self.name, Mapear, true);
        console.log("entra en loadmy cars");
        Repository.GetForUserLogueds({ name: 'CurrentCustomer', params: null, callback: Mapear });

    };
    Init = function () {
        Config.User.Logued ? LoadMyCars() : Change2("Login");
    };
    Config.OnLine ? Init() : alert(Traducir('MessageAlert'));

    self.DisplaySaveButton = function (dato) {
        dato.visibleEditcar(false);
        dato.visibleSaveCar(true);
        $('.InputEditKm').focus();
    };





    //LoadMyCarsById = function(){
    //    self.Cars($.parseJSON(Repository.GetItem(self.name))); /*lo cargo del local storage ya q incialmente lo llene*/
    //    var car = GetById(Parametros()[1]);
    //     self.MyCar = new Car(car);
    //    Animate(self.id);
    //};
    //LoadEditMyCar = function () {
    //    LoadMyCarsById();
    //};
    //LoadDeleteMyCar = function () {
    //    LoadMyCarsById();
    //};
    //LoadInsertMyCar = function () {
    //    Animate(self.id);
    //};
    GetById = function (id) {
        console.log(id);
        var idCar = id;
        return Enumerable.From(self.Cars()).Where(function (x) { return x.id == idCar }).ToArray()[0];
    };
   // var section = { 'EditMyCar': LoadEditMyCar, 'DeleteMyCar': LoadDeleteMyCar, 'InsertMyCar': LoadInsertMyCar, 'MyCars': LoadMyCars };
    //section[Parametros()[0]]();
//    section[Config.History[Config.History.length - 2]];
    var CurrentCustomer = $.parseJSON(Repository.GetItem("CurrentCustomer"));
    self.Save = function (id, data) {
        console.log(data);
        data.visibleEditcar(true);
        data.visibleSaveCar(false);
        //console.log(mileage());
        var vehicule = GetById(id);
        vehicule.userCustomer = CurrentCustomer.id;
        vehicule.idCustomer = CurrentCustomer.id;
        console.log(vehicule);
        //vehicule.mileage =
        var params = {
            //'InsertMyCar': {
            //    model: self.MyCar.model, price: "0", mileage: self.MyCar.mileage,
            //    fuel: self.MyCar.fuel, power: "0", traction: "0", long: "0", width: "0",
            //    height: "0", weight: 0, trunk: "1", used: "1", color: "",
            //    optionals: "", displacement: "0",
            //    year: "", make: self.MyCar.make,
            //    starred: "0", userCustomer: CurrentCustomer.id, idCustomer: CurrentCustomer.id
            //},
            'EditMyCar': {
                model: self.MyCar.model, price: self.MyCar.price, mileage: self.MyCar.mileage,
                fuel: self.MyCar.fuel, power: self.MyCar.power, traction: self.MyCar.traction , long: self.MyCar.long , width:self.MyCar.width,
                height: self.MyCar.height, weight: self.MyCar.weight, trunk: self.MyCar.trunk, used: self.MyCar.used, color: self.MyCar.color,
        optionals: self.MyCar.optionals, displacement: self.MyCar.displacement,
        year: self.MyCar.year, make: self.MyCar.make
                , licensePlate: self.MyCar.licensePlate
                , starred: self.MyCar.starred, userCustomer: CurrentCustomer.id, id: Parametros()[1], idCustomer: CurrentCustomer.id
                }

        };
        //$(".editcar").hide();
        Repository.SendPost2("InventoryAll", vehicule);
        $("#Message").fadeIn();
    };
    self.Delete = function (id, data) {
       // var vehicule = GetById(id);
        Repository.Del({ name: 'InventoryById', params: id, callback: LoadMyCars });
    };
    //Delete = function () {
    //    Repository.Del({ name: 'InventoryById', params: Parametros()[1], callback: LoadMyCars });
    //};
}
MyCarsViewModel.prototype = new Base;
ko.applyBindings(new MyCarsViewModel());
