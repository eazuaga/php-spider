function MyOrder(data) {
    this.idOrder = data.idOrder;
    this.quantity = data.quantity;
    this.subtotal = data.subtotal;
    //this.namePart = data.namePart;
    this.codePart = data.codePart;
    this.date = new Date(data.date).toFormatedString(Config.DateFormat);
};

function MyOrderListViewModel() {
    CreateBackIcon();
  if (Config.User.Logued) {
        var self = this;
        self.name = "MyOrder";
        self.id = "#MyOrder";
      GetTitle();
        self.MyOrders = ko.observableArray([]);
        var Map = function (json) {
            //if (json.length === 0) {
            //    alert(Traducir("OderNotAvaiable"));
            //}
            console.log(json.type);
            if (json.type === "error") {
                Change2("Login");
            } else {
                var mapped = $.map(json, function (item) { return new MyOrder(item); });
                self.MyOrders(mapped);
                Animate(self.id);                
            }
        };
        Repository.GetForUserLogueds({ name: self.name, params: null, callback: Map }); //{ name: 'active', params: null, callback: function(){}}
  } else {
      console.log("usuario deslogueado");
        Change2("Login");
  }
   
};
MyOrderListViewModel.prototype = new Base;
ko.applyBindings(new MyOrderListViewModel());

