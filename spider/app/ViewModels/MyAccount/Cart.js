function Cart(data) {
    this.id = data.id;
    this.name = data.name;
    this.price = Config.moneyFormat.to(parseFloat(data.price));
    this.dealer = data.model;
    this.code = data.code;
    this.link = data.link;
    this.img = data.img;
    this.stock = data.stock;
    this.origin = data.origin;
    this.supplier = data.supplier;
    this.group = data.group;
    this.PathImage = Path();
    this.image = Config.OnLine ? (data.img == "" || data.img === null ? Config.ImgNotAvailable : this.PathImage + data.img) : Config.ImgNotAvailable;
    this.subtotal = ko.observable((parseFloat(data.quantity) * parseFloat(data.price)));
    this.codeParsed = (data.code).replace("//", "").replace(" ", "");
    //this.quantity = ko.observable(data.quantity);
    this.quantity = (data.quantity);

}
function CartModel() {
    var self = this;
    self.id = "#Cart";
    self.name = "Cart";
    GetTitle();
    self.ListCarts = ko.observableArray([]);
    self.Total = "0";
    Map = function () {
        var json = $.parseJSON(Repository.GetItem("Cart"));

        //if (json.length === 0 || json.length === undefined ) {
    //        alert(Traducir("OderNotAvaiable"));
    //    }
        var mapped = $.map(json, function (item) { return new Cart(item); });
        //self.ListCarts(mapped.reverse());
        self.ListCarts(mapped);
        Animate(self.id);
    };
    Map();
    self.send = function() {
        var order = { cart : JSON.stringify(self.ListCarts()) } ;
        console.log(order);
        //Repository.SendPost("Cart", order, callbackSend);
        Repository.PostForUserLogueds({ name: "Cart", params: order, callback: callbackSend });
    }
    var getRejectedOrder = function (message) {
        var code = extractSubstring(message.Info);
        console.log(code);
        var obj = Enumerable.From(self.ListCarts()).Where(function (x) { return x.code === code }).ToArray()[0];
        console.log(obj);
        return obj;
    };
    callbackSend = function (json) {
        var message = "";
        var rejectedOrders = [];

        if (json.length > 0) {
            for (var i = 0; i < json.length; i++) {
                console.log(json[i].Info);
                message += json[i].Info + "  ; ";
                if (json[i].Name === "InvalidPart") {
                    rejectedOrders.push(getRejectedOrder(json[i]));
                }
                  
            }
        } else {
            message = json.Info;
        }
        alert(message);
        console.log(rejectedOrders);
//        localStorage.removeItem("Cart");
        self.ListCarts(rejectedOrders);
        Repository.SetLocalStorage("Cart", JSON.stringify(self.ListCarts()));
        //  json.Name !== "InvalidPart" ?  : console.log("no se envio el pedido");
        //  Map();
        //localStorage.removeItem("user");
    };
    extractSubstring = function(string) {
        var tesst = string; // "CODE LO QUE QUIERO EST ACA IN";
        var code = tesst.match(/El repuesto(.*)no/);
        return code[1].replace(/\s/g,'');
    };
    // Computed data
    self.totalSurcharge = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < self.ListCarts().length; i++)
            total += parseFloat(self.ListCarts()[i].subtotal());
        return Config.moneyFormat.to(total);
    });
    self.Change = function ( quantity) {
        //  console.log(this.quantity);
        this.subtotal(parseFloat(this.quantity) * parseFloat(this.price));
      //  this.quantity(quantity);
       // console.log(self.ListCarts()[0].quantity);
        //update cart in local storage
        Repository.SetLocalStorage("Cart", JSON.stringify(self.ListCarts()));
    }
    self.removeCart = function(cart) {
        self.ListCarts.remove(cart);
        //update cart in local storage
        Repository.SetLocalStorage("Cart", JSON.stringify(self.ListCarts()));
    }
     self.select = function(id){
     //alert(id);
        $("#"+id).select();
    };
  
}
CartModel.prototype = new Base;
ko.applyBindings(new CartModel());
