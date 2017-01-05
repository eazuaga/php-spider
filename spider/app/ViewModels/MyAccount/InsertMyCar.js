function MyCarsViewModel() {
    var self = this;
    self.Dealer = Config.Dealer;
    SetTitle("Insert-" + Config.dealerType);
    CreateBackIcon();
    self.name = "MyCars";
    self.Cars = ko.observableArray([]);
    self.MyCar = ko.observable();
    self.id = "#MyCars";
    self.popup = ko.observable(false);
    //####################################################################
    //Makes---------------------------------------------------------------
    self.SelectedMake = ko.observable();
    self.Makes = ko.observableArray([]);
    var AllMakes = false;
    var makes = $.parseJSON(Repository.GetItem("AllMakesNModels"));
    console.log("makes", makes);
    var mapped = $.map(makes, function (item) {
        if(!item.disable) {
            return (new SelectMake(item));
        }
    });
    console.log("mapped", mapped);
    console.log("all makes", AllMakes);
    var makesWithModels = Enumerable.From(mapped).Where(function (x) { return x.Models.length != 0 }).ToArray();
    self.Makes(makesWithModels);
    //####################################################################
    //Models---------------------------------------------------------------
    self.SelectedModel = ko.observable();
    self.Models = ko.computed(function() {
        return self.SelectedMake() ? self.SelectedMake().Models : [];
    });
    //####################################################################
    //Years-------------------------------------------------------------
    self.SelectedYear = ko.observable();
    self.Years = ko.observableArray([]);
    self.Years = ko.computed(function() {
        var years = [];
        var actualYear = (new Date()).getFullYear();
        for (var year = actualYear; year > actualYear - 30; year -= 1) {
            years.push({ name: year.toString(), value: year, disable: false });
        }
        return self.SelectedModel() ? years : [];
    });
    if(Config.dealerType === "tractor-front") {
        self.LabelMileage = Traducir("Hours");
    } else {
        self.LabelMileage = Traducir("Mileage");
    }
    self.Mileage = "";


    self.SelectedFuel = ko.observable();
    self.Fuel = ko.observableArray([]);
    self.Fuel = [
        /*{ name: Traducir('SelectFuel'), value: 'all', disable: true },*/
        { name: Traducir('Gasoline'), value: 'nafta', disable: false },
        { name: Traducir('Diesel'), value: 'diesel', disable: false },
        { name: Traducir('CNG'), value: 'gnc', disable: false },
        { name: Traducir('Electric'), value: 'electrico', disable: false },
        { name: Traducir('Hybrid'), value: 'hibrido', disable: false }
    ];
    self.SelectedFuel = ko.observable();
    Mapear = function (json) {
        var mapped = $.map(json.vehicles, function (item) { return new Vehicle (item); });
        self.Cars(mapped);
        console.log(mapped);
        Repository.SetLocalStorage("MyCars", JSON.stringify(mapped));
    }
    LoadInsertMyCar = function () {
        Animate(self.id);
    };
    !Config.User.Logued ? Change2("Login") : LoadInsertMyCar();
    var CurrentCustomer = $.parseJSON(Repository.GetItem("CurrentCustomer"));
    Save = function () {
        console.log("marca selecionada", self.SelectedMake());
        console.log("modelo selecionada", self.SelectedModel());
        console.log("año selecionada", self.SelectedYear());
        console.log("combustible selecionada", self.SelectedFuel());
        console.log("mileage selecionada", self.Mileage == "");
        var test = true;
        if(self.SelectedMake() === undefined) {
            test = test & false;
            InvalidateInput($("#ddlMakes"));
        }
        if(self.SelectedModel() === undefined) {
            test = test & false;
            InvalidateInput($("#ddlModels"));
        }
        if(self.SelectedYear() === undefined) {
            test = test & false;
            InvalidateInput($("#ddlYears"));
        }
        if(self.Mileage == "") {
            test = test & false;
            InvalidateInput($("#ddlMileage"));
        }
        if(test) {
            var params = {
                'InsertMyCar': {
                    model: self.SelectedModel().value,
                    price: "0",
                    mileage: self.Mileage,
                    fuel: self.SelectedFuel().value,
                    power: "0",
                    traction: "0",
                    long: "0",
                    width: "0",
                    height: "0",
                    weight: 0,
                    trunk: "1",
                    used: "1",
                    color: "",
                    optionals: "",
                    displacement: "0",
                    year: self.SelectedYear().value,
                    make: self.SelectedMake().value,
                    starred: "0",
                    userCustomer: CurrentCustomer.id,
                    idCustomer: CurrentCustomer.id
                }
            };
            Repository.SendPost("InventoryAll", params['InsertMyCar'], function () {
                //$("#Message").fadeIn();
                alert(Traducir('RecordedData'));
            });
        } else {
            //Mostrar que faltan datos
            alert(Traducir("checkTheFields"));
        }
    };
}

MyCarsViewModel.prototype = new Base;
ko.applyBindings(new MyCarsViewModel());
