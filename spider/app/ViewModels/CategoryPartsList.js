//function Parts(data) {
//    this.id = data.id;
//    this.name = data.name;
//    this.price = Config.moneyFormat.to(parseFloat(data.price));
//    this.dealer = data.model;
//    this.code = data.code;
//    this.link = data.link;
//    this.img = data.img;
//    this.stock = data.stock;
//    this.origin = data.origin;
//    this.supplier = data.supplier;
//    this.group = data.group;
//    this.PathImage = Path();
//    //this.image = data.img == "" ? "img/not_available.jpg" : this.PathImage + data.img;
//    this.image = Config.OnLine ? (data.img == "" ? Config.ImgNotAvailable : this.PathImage + data.img) : Config.ImgNotAvailable;
//    this.quantity = ko.observable(1);
//    this.priceVisible = false;
//    this.currency = Config.Currency;
//    var price = 0;
//    if (data.price && !isNaN(parseFloat(price = data.price)) && price > 0) {
//        this.priceVisible = true;
//        this.price = Config.moneyFormat.to(parseFloat(data.price));
//        if (data.currency) {
//            this.currency = data.currency;
//        }
//    }
//    this.codeParsed = (data.code).replace("//", "").replace(" ", "");
//}
function Parts(data) {
    this.id = data.id;
    this.name = data.name;
    var price = 0;
    this.price = 0;
    this.priceVisible = false;
    this.currency = Config.Currency;
    if (data.price && !isNaN(parseFloat(price = data.price)) && price > 0) {
        this.priceVisible = true;
        this.price = Config.moneyFormat.to(parseFloat(data.price));
        if (data.currency) {
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
    this.codeParsed = (data.code).replace("//", "").replace(" ", "");
    this.visibleShare = data.id !== null;
}
function group(data) {
    this.groupCategories = $.map(data.source, function (item) { return new Parts(item); });;
    this.name = data.source[0].group;
}
function groupCategories(data) {
    this.group = data.group;
    this.supplier = data.supplier;
}
function PartsModel() {
    Config.InUse = true;
    $(".ec").hide();
    var self = this;
  
    self.id = "#Parts";
    self.name = "Parts";

    var url = Url(self.name);
    self.Dealer = Config.Dealer;
    CreateBackIcon();
    self.Parts = ko.observableArray([]);
    self.Group = ko.observableArray();
   
    var searchValue;
    self.NumberResult = ko.observable();
    self.section = ko.observable("");
    self.searchId = ko.observable("");
    self.searchDescription = ko.observable("");
    self.share = function (texto, titulo, image, url) {
        window.plugins.socialsharing.share(texto, titulo, image, url)
    };
    self.currentFilter = ko.observable(); // property to store the filter
    Map = function (json) {
        //self.PartsView(json.length > 0);
        var category = Parametros()[1];
        //var js = Enumerable.From(json).Where(function (x) { return x.group == category }).ToArray();

        var mapped = $.map(json, function (item) { return new Parts(item); });
        self.Parts(mapped);
        self.Title(category);
    }
  
    self.LoadAllCached = function () {
        var searchCriteria = "Parts";
        var params = { "group[equal]": Parametros()[1] };
//        Repository.GetCallBack(self.name, Map, false);
        Repository.GetWithParams(searchCriteria, params, Map);
    };
   
    self.visibleField = function (text) {
        var text = String(text);
        return text == undefined ? false : (text == "0" ? false : !text.IsNullOrEmpty());
    };
    //self.buy = function (code, name, supplier, origin, price) {
    //self.buy = function (id, quantity) {
    //    var e = confirm("Desea agregar este repuesto al carrito ?");
    //    if (!e) { return; };
     

    //    var params = {
    //        id: id,
    //        quantity: quantity()
    //    };
    //    alert(Traducir('itSends'));
    //    console.log(params);


    //    Repository.PostForUserLogueds({ name: "PartsOrder", params: params, callback: messageOrder });

    //};
    GetById = function (id) {
        return Enumerable.From(self.Parts()).Where(function (x) { return x.id === id }).ToArray()[0];
    };
    self.buy = function (id) {

       // var e = confirm("Desea agregar este repuesto al carrito ?");
       // if (!e) { return; };
        var quantity = $("#" + id).val();
        console.log();
        var part = GetById(id);
        part.quantity = $("#"+id).val();
        console.log(part);

       // var content = Traducir("OrderParts") + ' : \n ' + Traducir('ID') + ' : ' + code + ' , ' + Traducir('name') + ' : ' + name + ' , ' + Traducir('supplier') + ' : ' +
         //   supplier + ' , ' + Traducir('origin') + ' : ' + origin + ' , ' + Traducir('Price') + ' : ' + price + ' , ' + Traducir('quantity') + ' : ' + part.quantity;

        var params = {
            id: id,
            quantity: quantity
        };

        var cartItem = $.parseJSON(Repository.GetItem("Cart"));

        var existingItem = Enumerable.From(cartItem).Where(function (x) { return x.id == id }).ToArray(); 
        if(existingItem.length > 0){
            
            var updatedQuantity = parseFloat(existingItem[0].quantity)+ parseFloat(quantity);
            console.log("pedido total",cartItem);
            var order = changeQuantity(cartItem ,id,updatedQuantity);
            console.log("array cantidad actualizada ",order); 
            localStorage.removeItem("Cart");
            SetLocalStorage("Cart", JSON.stringify(order))
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
    self.LoadAllCached();
    Animate(self.id);
}
PartsModel.prototype = new Base;
ko.applyBindings(new PartsModel());
