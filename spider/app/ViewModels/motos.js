function Product(data) {
    this.id = data.id;
    var price = 0;
    this.price = 0;
    this.priceVisible = false;
    this.currency = Config.Currency;
    if(data.price && !isNaN(parseFloat(price = data.price)) && price > 0) {
        this.priceVisible = true;
        this.price = Config.moneyFormat.to(parseFloat(data.price));
        if(data.currency) {
            this.currency = data.currency;
        }
    }
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
    this.images = ko.observableArray(data.images);
    this.optionals = data.optionals;
    this.displacement = data.displacement;
    this.year = data.year;
    this.make = data.make;
    this.PathImage = Path();
    this.starred = data.starred;
    this.url = data.url;
    this.destacado = data.starred == "1";
    this.image = data.images[0];
    //this.image = Config.OnLine ? (data.images[0] == "" || data.images[0] == undefined ? Config.ImgNotAvailable :

    //    (data.images[0].indexOf("http") !== -1 ? encodeURI(data.images[0]) : this.PathImage + data.images[0])) : Config.ImgNotAvailable;

}

function MakeUnit(data) {
   //console.log(data);
    this.name = data.source != undefined ? data.source[0].make : data.name;
    this.value = data.source != undefined ? data.source[0].make == "All Makes" ? "all" : data.source[0].make : data.value;
    //this.value =  data.source[0].make == "All Makes" ? "all" : data.source[0].make ;
    var ModelsGr = Enumerable.From(data.source).GroupBy("$.model").ToArray();
    var modelos = [];
    $.each(ModelsGr, function (i, val) { modelos.push(val.source[0].model); });
    //this.Models = modelos;
    this.Models = data.source != undefined ? $.map(modelos, function (item) { return new ModelUnit(item) }) : [new ModelUnit(Traducir("AllModels"))];
   // this.Models =  $.map(modelos, function (item) { return new ModelUnit(item) }) ;
}

function ModelUnit(data) {
    this.value = data;
    this.name = data;

//    this.name = data.source[0].model;
 //   this.value = data.source[0].model;
}
function ProductModel() {
    $(".searcher").css("display", "none");
    Config.InUse = true;
    $(".ec").hide();
    //$("body").css("height", "auto");
   // $(".main_content").css("height", "auto");
    //$("#search_icon").show();
    var self = this;
    SetTitle(Config.dealerType != "tractor-front" ? Traducir("Inventory") : Traducir("Tractor"));
    self.CountResult = ko.observable(false);
    self.id = "#inventory";
    self.name = "motos";
    $(self.id).hide();
    /*le pongo la sombra a la barra*/
    //$(".type-switcher").addClass("sombraBarra");
    var url = Url(self.name);
    self.Dealer = Config.Dealer;
    self.NumberResult = ko.observable();
    self.visibleSelFuel = ko.observable(Config.dealerType != "tractor-front");
    var yearFrom;
    var yearTo;
    self.products = ko.observableArray([]);
    self.clase0 = ko.observable("switch-option  switch-option__selected");
    self.clase1 = ko.observable("switch-option  ");
    self.clase2 = ko.observable("switch-option ");
    self.MinPrice = 0;
    self.MaxPrice = 0;
    self.MinYear = 0;
    self.MaxYear = 0;
    self.resultMessage = ko.observable(Traducir('SearchingInventory'));
    var initSlider = false;
    self.visibleField = function (text) {
        var text = String(text);
        var num = 0;
        if(!isNaN(num = parseFloat(text))) {
            if(num <= 0) {
                return false;
            }
        }
        return (text ? false : !text.IsNullOrEmpty());
    };
    //    self.clase1 = ko.observable("switch-option switch-option__first switch-option__selected");
    //self.clase3 = ko.observable("switch-option switch-option__last");
    self.searchValue = ko.observable("");
    self.HaveSearch = ko.observable(false);
    self.searchResult = ko.observableArray();

    self.PriceFrom;
    self.PriceTo;
    self.GalleryCar = ko.observable(true);
    self.currentFilter = ko.observable(); // property to store the filter
    self.share = function (texto, titulo, image, url) {
       console.log("Sharing: " + texto + " | " + titulo + " | " + image + " | " + url);
       alert(Traducir("WaitForSharing"), 3000);
       window.plugins.socialsharing.share(texto, titulo, image, url);
    };
    self.search = function () {
       // console.log(self.SelectedModel());
 //       self.Selectedbrand() == "" && self.SelectedModel() == "" ? self.GetAll() : self.GetSearch();
        self.Selectedbrand() == "" && self.SelectedModel() == "" ? console.log("no busca") : self.GetSearch();
    };
    self.GetSearch = function () {
        Config.EnabledLoading = true;
        var searchCriteria;
        //searchCriteria = isNaN(self.searchValue()) ? "SearchInventory" : "SearchInventoryByNumber";
        searchCriteria = "SearchInventory";
        self.PriceFrom = $("#SpnPriceFrom").text().RemoveSymbols();
        self.PriceTo = $("#SpnPriceTo").text().RemoveSymbols();
        yearFrom = self.MinYear === Number($("#yearFrom").text()) ? 0 : Number($("#yearFrom").text());
        yearTo = $("#yearTo").text();
        var makeSelected = self.Selectedbrand() == "All Makes" || self.Selectedbrand() == " Todas las Marcas " ? "all" : self.Selectedbrand();
       // console.log(self.Selectedbrand());
       // console.log(makeSelected);
        var ModelSelected = self.SelectedModel() == " Todos los Modelos " ? "all" : self.SelectedModel();
       // console.log("año minimo igual al filrado ? ", self.MinYear === Number(yearFrom));
        var params = {
            '1': {
                "model[equal]": ModelSelected, "price[from]": self.PriceFrom, "price[to]": self.PriceTo, "year[from]": yearFrom
                , "year[to]": yearTo, "fuel[equal]": self.SelectedFuel(), "used[equal]": '1', "make[equal]": makeSelected
            },
            '0': {
                "model[equal]": ModelSelected, "fuel[equal]": self.SelectedFuel(), "used[equal]": '0', "make[equal]": makeSelected
                , "price[from]": self.PriceFrom, "price[to]": self.PriceTo
            },
            'all': {
                "model[equal]": ModelSelected, "fuel[equal]": self.SelectedFuel(), "used[equal]": "all", "make[equal]": makeSelected
                , "price[from]": self.PriceFrom, "price[to]": self.PriceTo, "year[from]": yearFrom , "year[to]": yearTo
            }

        };
        //var searchparams = self.SelectTypeCar() == "Used" ? params['Used'] : (self.SelectTypeCar() == "all" ? params['all'] : params['New']);
        var searchparams = params[self.SelectTypeCar()];
       // console.log(ModelSelected);
      //  console.log(searchparams);
        self.currentFilter('2');
        Commands.SwitchTab("2");
        Repository.SetLocalStorage("SearchParams", JSON.stringify(searchparams));
        Repository.SetLocalStorage("MakeModels", JSON.stringify(self.brands()));
        Repository.GetWithParams(searchCriteria, searchparams, MapCallResult);
       self.CountResult(true);
       self.enabled(true);

       self.HaveSearch(true);
    };
    //self.GetAll = function () {
    //    Repository.GetCallBack(self.name, Mapear, true);
    //    self.CountResult(false);
    //};
    Commands = {
        HideSearch: function () {
            //$(".searcher").fadeOut();
            self.GalleryCar(true);
        },
        HideSearchAndSetFilter: function (filter) {
            self.filter(parseFloat( filter)) ;
            $(".searcher").fadeOut();
            self.GalleryCar(true);
        }
        ,
        SwitchTab: function (data) {
          //  console.log("cambia a: "+data);
            $(".switch-option").removeClass('switch-option__selected');
            $("#" + data).addClass('switch-option__selected');
        },
        SwitchTab2 : {
            '0': function () {
                self.clase0("switch-option switch-option__selected");
                self.clase1("switch-option ");
                self.clase2("switch-option ");
                var visible = Enumerable.From(self.products()).Where(function(x) { return x.used === "0" }).ToArray().length > 0;
                console.log("products news", visible);
                if(visible) {
                    self.resultMessage("");
                } else {
                    self.resultMessage(Traducir('IventoryNotAvaiable'));
                }
            },
            '1': function () {
                self.clase0("switch-option ");
                self.clase1("switch-option switch-option__selected");
                self.clase2("switch-option  ");
                var visible = Enumerable.From(self.products()).Where(function (x) { return x.used === "1" }).ToArray().length > 0;
                console.log("products used", visible);
                if(visible) {
                    self.resultMessage("");
                } else {
                    self.resultMessage(Traducir('IventoryNotAvaiable'));
                }
            }
        },
        ControlUsed: {
            '1': function (params) {
                //console.log(params["price[from]"] + " " + params["price[to]"] + " " + params["year[from]"] + "" + params["year[to]"]);
                //price[from]":"65000","price[to]":"125000","year[from]":"2001","year[to]":"2019"
                var priceFrom = parseFloat(params["price[from]"]);
                var priceTo = parseFloat(params["price[to]"]);
                $("#slider-Price").val([priceFrom, priceTo]);
                $("#slider-handles").val([params["year[from]"], params["year[to]"]]);
            },
            '0': function (params) { },
            'all': function (params) {
                var priceFrom = parseFloat(params["price[from]"]);
                var priceTo = parseFloat(params["price[to]"]);
                $("#slider-Price").val([priceFrom, priceTo]);
                $("#slider-handles").val([params["year[from]"], params["year[to]"]]);
            }

        }
        ,
        Map: function (json) {
            var mapped = $.map(json, function (item) { return new Product(item); });
            self.products(mapped);
            self.searchValue("");
            if(mapped.length > 0) {
                self.resultMessage("");
            } else {
                self.resultMessage(Traducir('IventoryNotAvaiable'));
            }



        }
    };
    InitSlider = function (json) {


        if (!initSlider && json.length > 0 ) {
            initSlider = true;
            var vehicles = Enumerable.From(json).Where(function (x) { return x.year !== "0" }).ToArray();
           // console.log("--Vehiculos sin año cero--", vehicles);
            self.MinPrice = vehicles.min(function (t) { return Number(t.price) });
            self.MaxPrice = vehicles.max(function (t) { return Number(t.price) });
            self.MinYear = vehicles.min(function (t) { return Number(t.year) });
            self.MaxYear = vehicles.max(function (t) { return Number(t.year) });
           //console.log("año maximo", self.MaxYear);
           //console.log("año minimo", self.MinYear);
           //console.log("precio maximo", self.MaxPrice);
           //console.log("precio minimo", self.MinPrice);

            var makeGruped = Enumerable.From(json).GroupBy("$.make").ToArray();
            //console.log("grupo de marcas ", makeGruped);
            var ma = $.map(makeGruped, function (item) { return new MakeUnit(item); });
            var labelMakeSelect = new MakeUnit({ name: Traducir('AllBrands'), Models: [Traducir("AllModels")], value: 'all' });
            ma.unshift(labelMakeSelect);

           //console.log("a ver",ma);
            self.brands(ma);


            self.MinPrice === 0 && self.MaxPrice !== 0 ? console.log("hay un maximo") : self.MaxPrice = 500000;
            self.SetSliders();
        }
    };
    Mapear = function (json) {
      //  json.length == 0 ? alert(Traducir('IventoryNotAvaiable')) : false;
        InitSlider(json);
        json.length > 0 ? Commands.Map(json) : false;
        self.GalleryCar(json.length > 0);
        scrollWinTop(0);
        $(self.id).show();
        Animate(self.id);

    }
    MapCallResult = function (json) {
        var WordResult = json.length === 1 ? Traducir("Result") : Traducir("Results");
        self.NumberResult(json.length + WordResult);
         Config.NumberResultGlobal  = self.NumberResult() ;

        json.length > 0 ? Commands.Map(json) : false;
        self.GalleryCar(json.length > 0);
        scrollWinTop(0);
        $(self.id).show();
        Config.EnabledLoading = false;
        Animate(self.id);
        scrollWinTopTo(($("#ListCars").offset().top)-65);

    }
    MapearS = function (json) {

        (json.length != 0 ? Commands.HideSearch() : false);
        //self.NumberResult(json.length + Traducir("Results") + self.searchValue());
        self.NumberResult(Config.NumberResultGlobal);
        self.CountResult(true);
        json.length > 0 ? Commands.Map(json) : false;
       //console.log("marcas guardadas",self.brands());
        var FilterControls = $.parseJSON(Repository.GetItem("SearchParams"));
        var modelsSaved = $.parseJSON(Repository.GetItem("MakeModels"));
        self.brands(modelsSaved);
        self.Selectedbrand(FilterControls["make[equal]"]);
        self.SelectTypeCar(FilterControls["used[equal]"]);
       //console.log("used[model]", modelsSaved["used[model]"]);

        self.SelectedModel(modelsSaved["used[model]"]);
        self.SelectedFuel(FilterControls["fuel[equal]"]);
       //console.log( FilterControls["used[equal]"]);
        FilterControls["used[equal]"] == '1' || FilterControls["used[equal]"] == 'all' ? self.enabledUsed(true) : self.enabledUsed(false);
        Commands.ControlUsed[FilterControls["used[equal]"]](FilterControls);
        self.GalleryCar(json.length > 0);
    //    $(self.id).css("display", "block");
        scrollWinTopTo(($("#ListCars").offset().top) + 500);
        $(self.id).show();
        //Animate(self.id);
    }
    self.GetAll = function () {
        self.currentFilter('0');
        Repository.GetCallBack(self.name, Mapear, true);
    };
    self.ListaInventario = ko.computed(function () {
        if (self.currentFilter() == '2') {
            return self.products();
        } else {
            return ko.utils.arrayFilter(self.products(), function (prod) {
                return prod.used == self.currentFilter();
            });
        }
    });
    self.EnabledSearcher = function (data) {
        self.currentFilter('2');
        self.clase0("switch-option ");
        self.clase1("switch-option ");
        self.clase2("switch-option  switch-option__selected");
        Repository.GetItem("SearchInventory").IsNullOrEmpty() ? self.GalleryCar(false) : MapearS($.parseJSON(Repository.GetItem("SearchInventory")));
        self.enabled(true);
    };
    self.filter = function (data, event) {
        /*lleno products limpiando el resultado de busqueda*/
        Repository.GetCallBack(self.name, Mapear, false);
        self.CountResult(false);
        self.GalleryCar(true);
        self.currentFilter(data);
        self.enabled(false);
        Commands.SwitchTab2[data]();
    }
    self.changeType = function (data, event) {
       // Commands.SwitchTab(data);
        self.SelectTypeCar() == '1' || self.SelectTypeCar() == 'all' ? self.enabledUsed(true) : self.enabledUsed(false);

    };
    self.Clear = function () {
        Repository.GetCallBack(self.name, Commands.Map, false);
        self.CountResult(false);
        $('select').each(function (i, v) { $(v).find('option:eq(0)').prop('selected', true); });
        Repository.SetLocalStorage("SearchInventory", "");
        self.GalleryCar(false);
        self.enabledUsed(false);

    };
    /*autoejecutable*/

    self.SetSliders = function () {
        //console.log(self.MinPrice);
        //console.log(self.MaxPrice);
       //console.log(self.MinYear);
        //console.log(self.MaxYear);

        $('#slider-Price').noUiSlider({
            start: [self.MinPrice, self.MaxPrice]
            //start: [self.MinPrice, self.MaxPrice]
        , connect: true,
            step: 5000,
            range: {
                'min': [self.MinPrice],
                'max': [self.MaxPrice]
            }
        ,
            format: wNumb({
                decimals: 0, thousand: '.'
                //, prefix: Config.Currency
            })
        });
        d = new Date();
        $('#slider-handles').noUiSlider({
            start: [self.MinYear, d.getFullYear()]
            //,snap: true
           , connect: true,
            step: 1,
            range: {
                //'min': [1998],
                'min': [self.MinYear],
                'max': [d.getFullYear()]
            },
            format: wNumb({
                decimals: 0
            })
        });

        $('#slider-handles').Link('lower').to($('#yearFrom'));
        $('#slider-handles').Link('upper').to($('#yearTo'));

        $('#slider-Price').Link('lower').to($('#SpnPriceFrom'));
        $('#slider-Price').Link('upper').to($('#SpnPriceTo'));
    };


    self.Fuel = ko.observableArray([]);
    self.TypeCar = ko.observableArray([]);
    self.brands = ko.observableArray([]);
    self.Models = ko.observableArray([]);
    self.Selectedbrand = ko.observable();
    self.SelectedModel = ko.observable();
    self.SelectedFuel = ko.observable();
    self.SelectTypeCar = ko.observable();

    self.LoadInputs = function (AllMakes) {

        /*sse realizaa este cambio para adoptar las marcas y modelos existentes de los vehiculos cargados*/


        //var makes = $.parseJSON(Repository.GetItem("AllMakesNModels"));
        //var mapped = $.map(makes, function (item) { return new SelectMake(item); });
        //console.log("marcas ",mapped);
        //var makesWithModels = Enumerable.From(mapped).Where(function (x) { return x.Models.length != 0 }).ToArray();
        //var labelMakeSelect = AllMakes ? new SelectMake({ Marca: Traducir('AllBrands'), Modelos: [Traducir("AllModels")],value :'all' }) : new SelectMake({ Marca: Traducir('SelectMake'), Modelos: [Traducir("AllModels")], disable: true });
        //makesWithModels.unshift(labelMakeSelect);


      //  self.brands(makesWithModels);

        self.Fuel = [{ name: Traducir('Any'), value: 'all' }, { name: 'Nafta', value: 'Nafta' }, { name: 'Diesel', value: 'Diesel' }, { name: 'GNC', value: 'GNC' }, { name: Traducir('All'), value: 'all' }];
        self.TypeCar = [{ name: Traducir('NewAndUsed'), value: 'all' }, { name: Traducir('NEW'), value: '0' }, { name: Traducir('USED'), value: '1' }/*, { name: Traducir('All'), value: 'all' },*/ ];
    };
    self.changeMake = function (data, event) {
       //console.log("cambio el valor a : ", self.Selectedbrand());
        //console.log(self.brands());
        var models = Enumerable.From(self.brands()).Where(function (x) { return x.value == self.Selectedbrand() }).ToArray();
       //console.log("modelos de esta marca : ", models);
        self.Models(models[0].Models);
        //var models = self.Selectedbrand().IsNullOrEmpty() ? Enumerable.From(self.brands()).Where(function (x) { return x.name == self.Selectedbrand() }).ToArray() : "";
        self.Selectedbrand() != undefined && models[0] != undefined ? self.Models(models[0].Models) : false;
        //  models.length > 0 ? self.Models(models[0].Models) : self.Models([]);
        //self.Models()
    };
    self.LoadInputs(true);
    Repository.GetItem("SearchInventory").IsNullOrEmpty() ? self.GetAll() :  self.EnabledSearcher('2');
}
ProductModel.prototype = new Base;
ko.applyBindings(new ProductModel());
