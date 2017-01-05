function Parts(data) {
    this.id = data.id;
    this.name = data.name;
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
    this.dealer = data.model;
    this.code = data.code;
    this.link = data.url;
    this.img = data.img;
    this.stock = data.stock;
    this.origin = data.origin;
    this.supplier = data.supplier;
    this.group = data.group;
    this.PathImage = Path();
    this.image = Config.OnLine ? (data.img === "" || data.img === null ? Config.ImgNotAvailable : (this.PathImage + data.img)) : Config.ImgNotAvailable;
    //    this.image = Config.OnLine ? (data.images[0] == "" || data.images[0] == undefined ? "img/not_available.jpg" : this.PathImage + data.images[0]) : "img/not_available.jpg";
    this.quantity = ko.observable(1);
    this.codeParsed = (data.code).replace("//", "").replace(" ","");
    this.visibleShare = data.id !== null;
}
function group(data) {
    //this.groupCategories = $.map(data.source, function (item) { return new Parts(item); });
    //this.name = data.source[0].group;
    this.name = data.name;
}
function groupCategories(data) {
    this.group = data.group;
    this.supplier = data.supplier;
}
function PartsModel() {
    Config.InUse = true;
    $(".ec").hide();
    var self = this;
    SetTitle();
    self.id = "#Parts";
    self.name = "Parts";
    self.nameStarred = "PartStarred";
  //  $("#search_icon").show();
    var url = Url(self.name);
    self.Dealer = Config.Dealer;
    self.clase0 = ko.observable("switch-option  switch-option__selected");
    self.clase1 = ko.observable("switch-option  ");
    self.clase2 = ko.observable("switch-option ");
    self.Parts = ko.observableArray([]);
    self.Group = ko.observableArray();
    self.PartsView = ko.observable(true);
    self.CategoryView = ko.observable(false);
    self.CountResult = ko.observable(false);
    self.groupCategoriesView = ko.observable(false);
    self.morebtn = ko.observable(false);
    var searchValue;
    self.NumberResult = ko.observable();
    self.section = ko.observable("");
    self.searchId = ko.observable("");
    self.limitHeigth = 192950;
    self.IndexPage = 0;
    self.resultMessage = ko.observable(Traducir('SearchingParts'));
    self.searchDescription = ko.observable("");
    self.share = function (texto, titulo, image, url) {
       console.log("Sharing: " + texto + " | " + titulo + " | " + image + " | " + url);
        alert(Traducir("WaitForSharing"), 3000);
       window.plugins.socialsharing.share(texto, titulo, image, url);
    };
    self.currentFilter = ko.observable(); // property to store the filter
    Map = function (json) {
      //  json.length == 0 ? alert(Traducir('noPartsAvailable')) : false;
        self.PartsView(json.length > 0);
        if(json.length > 0) {
            self.resultMessage("");
        } else {
            self.resultMessage(Traducir('noPartsAvailable'));
        }
        var mapped = $.map(json, function (item) { return new Parts(item); });
        self.Parts(mapped);
        console.log(self.Parts());
        Animate(self.id);
    }
    Mapear = function (json) {
        Map(json);
    }
    MapSearch = function (json) {
        //Map(json);
        self.morebtn(true);
        self.IndexPage === 0 ? self.PartsView(json.length > 0) : self.PartsView(true);

        var mapped = $.map(json, function (item) { return new Parts(item); });

        console.log("cantidad andes del concat", self.Parts().length);
        if (json.length > 0) {
            self.IndexPage === 0 ? self.Parts(mapped) : self.Parts(self.Parts().concat(mapped));
        }

        console.log("indice de la pagina", self.IndexPage);
        console.log("cantidad de repuestos",self.Parts().length);

        var WordResult = json.length == 1 ? Traducir("Result") : Traducir("Results");
        self.NumberResult(self.Parts().length + WordResult);
        Config.EnabledLoading = false;

    }
    MapCategory = function (json) {
     //   var ma = Enumerable.From(json).Where(function (x) { return x.group !== "" }).ToArray();
      //  var mapped = Enumerable.From(ma).GroupBy("$.group").ToArray();
        var categories = $.map(json, function (item) { return new group(item); });
        self.Group(categories);
    };
    self.GetCategories = function () {
        //Repository.GetCallBack(self.name, MapCategory, false);
        Repository.GetCallBack("CategoryParts", MapCategory, true);

    };
    /*no se usa ?*/
    self.ListaProducts = function (category) {
        console.log(category);
        var parts = $.parseJSON(Repository.GetItem(self.name));
        var partByCategory = Enumerable.From(parts).Where(function (x) { return x.group == category }).ToArray();
        console.log(partByCategory);
        var mapped = $.map(partByCategory, function (item) { return new Parts(item); });
        console.log(mapped);
        self.Parts(mapped);

        Commands.ChangeContent('0');
        self.section(category);
        console.log(self.Parts());
    }

    Commands = {
        HideSearch: function () {
            $(".searcher").fadeOut();
        },
        HideSearchAndSetFilter: function (filter) {
            self.filter(parseFloat(filter));
            $(".searcher").fadeOut();
        },
        ChangeContent: function (id) {
            self.PartsView('0' == id);
            self.CategoryView('1' == id);
            self.enabled('2' == id);
            self.CountResult('2' == id);
        },
        ChangeTab: function (id) {
            self.clase0(id === 0 ? "switch-option switch-option__selected" : "switch-option");
            self.clase1(id === 1 ? "switch-option switch-option__selected" : "switch-option");
            self.clase2(id === 2 ? "switch-option switch-option__selected" : "switch-option");

        }
        ,
        SwitchTab: {
            '0': function (id) {
                Commands.ChangeTab(id);

                self.LoadAllCached();
            },
            '1': function (id) {
                Commands.ChangeTab(id);
                self.GetCategories();
                self.PartsView(false);
              //  self.IndexPage = 0;
            },
            '2': function (id) {
                self.Parts([]);
               // self.IndexPage = 0;
                Commands.ChangeTab(id);
            }
        }
    };
    self.LoadAllFirst = function () {
        //Repository.GetCallBack(self.name, Mapear, true);
        Repository.GetCallBack(self.nameStarred, Mapear, true);
    };
    self.LoadAllCached = function () {
        Repository.GetCallBack(self.nameStarred, Mapear, false);
    };
    MapearById = function (json) {
        var mapped = new Parts(json);
        self.Parts(mapped);
    }
    SeachById = function () {
        var params = { 'code[equal]': self.searchId() };
        Repository.GetWithParams("Parts", params, MapSearch);
    };
    SearchByDescription = function () {
        Config.EnabledLoading = true;
        Repository.GetCallBack("SearchParts", MapSearch, true, self.searchDescription(),"0");
    };
    DefineSearch = function () {
        SearchByDescription();
    };
    self.search = function () {

        self.IndexPage = 0;
        console.log("tamaño de busqueda",self.searchDescription().length);
        self.searchDescription().length > 2 ? DefineSearch() : alert(Traducir("MustEnterAtLeast3Characters") );
    };
    self.visibleField = function (text) {
        var text = String(text);

        return text == undefined ? false : (parseFloat(text) === "0" ? false : !text.IsNullOrEmpty());
    };
    self.tabs = function (id, seccion) {
        console.log(id);
        console.log(seccion);
        self.IndexPage = 0;
        Config.History = seccion;
        self.morebtn(false);
        Commands.SwitchTab[id](id);
        self.PartsView('0'== id);
        self.CategoryView('1'== id);
        self.enabled('2' == id);
        self.CountResult('2' == id);
        self.section("");
        /*parche*/
        DisplayContent();
        //ajustContentMessage(300);

    };
    Config.History == "Categories" ? self.tabs('1', Config.History) : self.LoadAllFirst();
    SearchByDescriptions = function () {
        alert("presiona busquedas");

    }
    GetById = function (id) {
        return Enumerable.From(self.Parts()).Where(function (x) { return x.id === id }).ToArray()[0];
    };
    GetByCode = function (id) {
        console.log("querear: ",self.Parts());
        return Enumerable.From(self.Parts()).Where(function (x) { return x.codeParsed === id }).ToArray()[0];
    };
    var messageOrder;
    self.buy = function (id) {
        console.log(id);
       // var e = confirm("Desea agregar este repuesto al carrito ?");
       // if (!e) { return; };
        var quantity = $("#" + id).val();
        console.log(quantity);
        var part = GetByCode(id);
        part.quantity = quantity;
        console.log(part);

       // var content = Traducir("OrderParts") + ' : \n ' + Traducir('ID') + ' : ' + code + ' , ' + Traducir('name') + ' : ' + name + ' , ' + Traducir('supplier') + ' : ' +
         //   supplier + ' , ' + Traducir('origin') + ' : ' + origin + ' , ' + Traducir('Price') + ' : ' + price + ' , ' + Traducir('quantity') + ' : ' + part.quantity;

        var params = {
            id: id,
            quantity: quantity
        };

        var cartItem = $.parseJSON(Repository.GetItem("Cart"));

      //  var existingItem = Enumerable.From(cartItem).Where(function (x) { return x.id == id }).ToArray();
        var existingItem = Enumerable.From(cartItem).Where(function (x) { return x.code == id }).ToArray();
        if(existingItem.length > 0){

            var updatedQuantity = parseFloat(existingItem[0].quantity)+ parseFloat(quantity);
            console.log("pedido total",cartItem);
            //var order = changeQuantity(cartItem ,id,updatedQuantity);
            var order = changeQuantity(cartItem ,code,updatedQuantity);
            console.log("array cantidad actualizada ",order);
            localStorage.removeItem("Cart");
            SetLocalStorage("Cart", JSON.stringify(order));
            //Repository.appendArrayLocalStorage(order, "Cart");

            /*part.quantity = updatedQuantity ;
            var n =removeByAttr(cartItem, 'id', id);

            console.log(" n",n);
            // n.push(part);


            */
        }
        else {
            Repository.appendArrayLocalStorage(part, "Cart");
        }


        alert(Traducir('itSends'));
        //Repository.PostForUserLogueds({ name: "PartsOrder", params: params, callback: messageOrder });

    };
    messageOrder = function (json) {
        json.Name === "InvalidPart" ? alert(Traducir("PartNotAvaiable")) : alert(json.Info);

    };
    self.select = function(id){
     //alert(id);
        $("#"+id).select();
    };
    function changeQuantity(array , value, desc ) {
       for (var i in array) {
         if (array[i].id== value) {
            array[i].quantity = desc;
            break; //Stop this loop, we found it!
         }
    }
        return array;
    }

    self.moreSearch = function () {
        Config.EnabledLoading = true;
        self.IndexPage++;
        Repository.GetCallBack("SearchParts", MapSearch, true, $("#SearchDescription").val(), String(self.IndexPage*10));
    };
    //$(window).scroll(function () {
    //    $(window).unbind('scroll');
    //    var height = $(window).scrollTop();

    //        if (height > self.limitHeigth) {

    //            self.limitHeigth = 192950 + self.limitHeigth;
    //            console.log(self.limitHeigth);
    //            console.log("text de busqueda", $("#SearchDescription").val());
    //            self.IndexPage++;
    //            Repository.GetCallBack("SearchParts", MapSearch, true, $("#SearchDescription").val(), String(self.IndexPage));

    //            //self.limitHeigth = 197746;
    //            //self.IndexPage = 0;
    //        }

    //});
}
PartsModel.prototype = new Base;
ko.applyBindings(new PartsModel());
