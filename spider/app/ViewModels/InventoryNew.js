function Product(data) {
    this.id = data.id;
    this.price = Config.moneyFormat.to(parseFloat(data.price));
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
    this.images = data.images[0] == "" ? ko.observableArray(["not_available.jpg"]) : ko.observableArray(data.images);
    this.optionals = data.optionals;
    this.displacement = data.displacement;
    this.year = data.year;
    this.make = data.make;
    this.PathImage = Config.Path();
    this.starred = data.starred;
    this.url = data.url;
    this.destacado = data.starred == "1";
    this.image = data.images[0] == "" ? "img/not_available.jpg" :this.PathImage + data.images[0];
}

function ProductModel() {
    $(".searcher").css("display","none")
    Config.InUse = true;
    $(".ec").hide();
    console.log("inventory");
    //$("#search_icon").show();
    var self = this;
    SetTitle();
    self.CountResult = ko.observable(false);
    self.id = "#inventory";
    self.name = "Inventory";
    var url = Config.Url(self.name);
    self.Dealer = Config.Dealer;
    self.NumberResult = ko.observable();
    self.products = ko.observableArray([]);
    self.clase1 = ko.observable("switch-option  switch-option__selected");
    self.clase2 = ko.observable("switch-option ");
    //    self.clase1 = ko.observable("switch-option switch-option__first switch-option__selected");
    //self.clase3 = ko.observable("switch-option switch-option__last");
    self.searchValue = ko.observable("");
    self.searchResult = ko.observableArray();
    self.PriceFrom ;
    self.PriceTo;
    self.GalleryCar = ko.observable(true);
    self.currentFilter = ko.observable(); // property to store the filter
    self.share = function (texto, titulo, image, url) {
        window.plugins.socialsharing.share(texto,titulo,image, null)
    };
    self.search = function () {
        console.log(self.SelectedModel());
 //       self.Selectedbrand() == "" && self.SelectedModel() == "" ? self.GetAll() : self.GetSearch();
        self.Selectedbrand() == "" && self.SelectedModel() == "" ? console.log("no busca") : self.GetSearch();
    };
    self.GetSearch = function () {
        var searchCriteria;
        //searchCriteria = isNaN(self.searchValue()) ? "SearchInventory" : "SearchInventoryByNumber";
        searchCriteria = "SearchInventory";
        self.PriceFrom = $("#SpnPriceFrom").text().RemoveSymbols();
        self.PriceTo = $("#SpnPriceTo").text().RemoveSymbols();
        var yearFrom = $("#yearFrom").text();
        var yearTo = $("#yearTo").text();
        var params = {
            '0': {
                "model[equal]": self.SelectedModel(), "price[from]": self.PriceFrom, "price[to]": self.PriceTo, "year[from]": yearFrom
                , "year[to]": yearTo, "fuel[equal]": self.SelectedFuel(), "used[equal]": 0, "make[equal]": self.Selectedbrand()
            },
            '1': {
                "model[equal]": self.SelectedModel(), "fuel[equal]": self.SelectedFuel(),"used[equal]":1 ,"make[equal]": self.Selectedbrand()
            },
            'all': {
                "model[equal]": self.SelectedModel(), "fuel[equal]": self.SelectedFuel(), "used[equal]": "all", "make[equal]": self.Selectedbrand()
            }

        };
        //var searchparams = self.SelectTypeCar() == "Used" ? params['Used'] : (self.SelectTypeCar() == "all" ? params['all'] : params['New']);
        var searchparams = params[self.SelectTypeCar()];
        console.log(searchparams);
        window.location.hash = "#!/inventory/" + JSON.stringify(searchparams);

       // self.currentFilter('2');
       //Repository.GetWithParams(searchCriteria, searchparams, Mapear);
       // self.CountResult(true);

    };
    CallSearch = function () {
        var searchCriteria;
        searchCriteria = "SearchInventory";
        var searchparams = $.parseJSON(Config.Parametros()[1]);
        self.currentFilter('2');

        console.log(searchparams["make[equal]"]);
        Repository.GetWithParams(searchCriteria, searchparams, MapearS);
        self.CountResult(true);


    };


    self.GetAll = function () {
        Repository.GetCallBack(self.name, Mapear, true);
        self.CountResult(false);
    };
    Commands = {
        HideSearch: function () {
        //    $(".searcher").fadeOut();
           // self.currentFilter('2');
            self.GalleryCar(true);
        },
        HideSearchAndSetFilter: function (filter) {
            //self.filter(parseFloat( filter)) ;

            $(".searcher").fadeOut();
            self.GalleryCar(true);
        },
        SwitchTab: function (data) {
            $(".switch-option").removeClass('switch-option__selected');
            $("#" + data).addClass('switch-option__selected');
        },
        Map: function (json) {

            var mapped = $.map(json, function (item) { return new Product(item); });
            self.products(mapped);
            self.searchValue("");
            Animate(self.id);
          //  scrollWinTop(0);
           // binds();
        }
    };
    Mapear = function (json) {
        //json.length == 1 ? Commands.HideSearchAndSetFilter(json[0].used) : (json.length != 0 ? Commands.HideSearch() : false);
         (json.length != 0 ? Commands.HideSearch() : false);
         self.NumberResult(json.length + Traducir("Results") + self.searchValue());
         $("html, body").animate({ scrollTop: 425 }, 2000);
        json.length > 0 ? Commands.Map(json) : false;
    }
    MapearS = function (json) {
        var searchparams = $.parseJSON(Config.Parametros()[1]);
        (json.length != 0 ? Commands.HideSearch() : false);
        self.NumberResult(json.length + Traducir("Results") + self.searchValue());
        $("html, body").animate({ scrollTop: 425 }, 2000);
        json.length > 0 ? Commands.Map(json) : false;
        self.searchResult(json);
        //$('.SelType').val(searchparams["used[equal]"]);
        //$('.SelBrand').val(searchparams["make[equal]"]);
        self.Selectedbrand(searchparams["make[equal]"]);
        self.SelectTypeCar(searchparams["used[equal]"]);
        self.SelectedModel(searchparams["used[model]"]);
        self.SelectedFuel(searchparams["fuel[equal]"]);
        searchparams["used[equal]"] == "1" ? self.enabledUsed(true) : self.enabledUsed(false);
        //$('.SelModel').val(searchparams["model[equal]"]);
       // $('.SelFuel').val(searchparams["fuel[equal]"]);
        /*  self.Selectedbrand = ko.observable();
    self.SelectedModel = ko.observable();
    self.SelectedFuel = ko.observable();
    self.SelectTypeCar = ko.observable();*/
        Commands.SwitchTab("2");
        self.enabled(true);
    }
    CallAll= function(){
        Repository.GetCallBack(self.name, Mapear,true);
        self.currentFilter('0');
    };


    self.ListaInventario = ko.computed(function () {
        if (self.currentFilter() =='2') {
            return self.products();
        } else {
            return ko.utils.arrayFilter(self.products(), function (prod) {
                return prod.used == self.currentFilter() ;
            });
        }
    });

    LoadSearchResults = function () {
        //var json = $.parseJSON(Repository.GetItem("SearchInventory"));
        console.log(self.searchResult());
        var json = self.searchResult();
        var mapped = $.map(json, function (item) { return new Product(item); });
        self.products(mapped);
        self.GalleryCar(true);

    };
    self.EnabledSearcher = function (data) {
        Commands.SwitchTab(data);
        //self.enabled() == true ? self.enabled(false) : self.enabled(true);
        self.enabled(true);
        Config.Parametros()[1] != undefined ? LoadSearchResults(): self.GalleryCar(false) ;

    };
    self.filter = function (data, event) {
        /*lleno products limpiando el resultado de busqueda*/
        Repository.GetCallBack(self.name, Mapear, false);
        self.CountResult(false);
        self.GalleryCar(true);
        self.currentFilter(data);
        self.enabled(false);
     //   self.enabledNew(data == 0);
        console.log("you clicked " + data);
     //   $(".switch-option").removeClass('switch-option__selected');
     //   $("#" + data).addClass('switch-option__selected');
        Commands.SwitchTab(data);
    }
    self.changeType = function (data, event) {
       // Commands.SwitchTab(data);
        self.SelectTypeCar() == "1" ? self.enabledUsed(true) : self.enabledUsed(false);

    };
    self.LoadInputs = function () {
        self.brands($.parseJSON(Repository.GetItem("Brand")));
        self.Models($.parseJSON(Repository.GetItem("Models")));
        self.Fuel = [{ name: '--Fuel--', value: 'all' }, { name: 'Nafta', value: 'Nafta' }, { name: 'Diesel', value: 'Diesel' }, { name: 'GNC', value: 'GNC' }, { name: Traducir('All'), value: 'all' }];
        self.TypeCar = [{ name: '--TypeCar--', value: 'all' }, { name: 'New', value: '0' }, { name: 'Used', value: '1' }, { name: Traducir('All'), value: 'all' }, ];
    };


    self.brands = ko.observableArray([]);
    self.Fuel = ko.observableArray([]);
    self.TypeCar = ko.observableArray([]);
    self.Models = ko.observableArray([]);
    self.LoadInputs();
    self.Selectedbrand = ko.observable();
    self.SelectedModel = ko.observable();
    self.SelectedFuel = ko.observable();
    self.SelectTypeCar = ko.observable();

    self.Clear = function () {
        Repository.GetCallBack(self.name, Commands.Map, false);
        self.CountResult(false);
        $('select').each(function (i, v) { $(v).find('option:eq(0)').prop('selected', true); });
        self.GalleryCar(false);
    };
   Config.Parametros()[1] != undefined ? CallSearch() : CallAll();
}
ProductModel.prototype = new Base;
ko.applyBindings(new ProductModel())
