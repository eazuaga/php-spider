function Store(data) {
    this.email = data.email;
    this.id = data.id;
    this.idDealer = data.idDealer;
    this.img = data.img;
    this.name = data.name;
    this.location = data.location;
    this.phone = data.phone;
}

function StoreListViewModel() {
    var self = this;
    self.Stores = ko.observableArray([]);
    $.getJSON("http://backend.10.0.0.6.xip.io:80/Branch", function (allData) {
        var mappedBlogs = $.map(allData, function (item) { return new Store(item); });
        self.Stores(mappedBlogs);

    });
    }
ko.applyBindings(new StoreListViewModel());
