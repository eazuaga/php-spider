function Branch(data) {
    this.email = data.email;
    this.id = data.id;
    this.idDealer = data.idDealer;
    this.img = data.img.IsNullOrEmpty() ? Config.ImgNotAvailable : Path() + data.img;
    this.name = data.name;
    this.location = data.location;
    this.phone = data.phone;
    this.url = "#!/Contact/" + data.id;

}
function SocialNetwork(data) {
    this.id = data.id;
    this.dealer = data.dealer;
    this.type = data.type;
    this.link = data.link;
}
function Appoint (data) {
    this.vehicle = data.vehicle;
    this.servicioRequerido = data.servicioRequerido;
    this.user = data.user;
    this.date = data.date;
    this.branch = data.branch;
}
function Message (data) {
    this.id = data.id;
    this.content = data.content;
    this.shorContent = data.content.length > 40 ? data.content.Truncate() : data.content;
    this.device = data.device;
    this.answerOf = data.answerOf;
    this.sender = data.sender == "dealer" ? Config.dealerName : (Config.User.Logued ? Config.User.name : "Customer");
    this.sendDatetime = data.sendDatetime;
    this.clase = ko.computed(function () {
        var clase = data.sender == "user" ? "you" : "me";
        return clase;
    }, this);
    this.viewed = data.viewed == "0" ? " BackWhite" : "";
    this.answerable = data.answerable;
    this.avatar = data.sender == "user" ? "img/im2.jpg" : "img/im1.jpg";
    //this.avatar =  "img/user.png" ;
}
function Vehicle (data) {
    this.id = data.id;
    this.price = data.price;
    this.make = data.make;
    this.model = data.model;
    this.year = data.year;
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
    this.PathImage = Path();
    this.image = data.images;
    this.licensePlate = data.licensePlate;
}
function SelectMake(data) {
    this.name = data.Marca;
    this.value = data.Marca == "All Makes" ? "all" : data.Marca;
    //this.value = data.Marca == " Todas las Marcas " ? data.value : data.Marca;
    this.disable = data.disable == undefined ? false : data.disable;
    this.Models = $.map(data.Modelos, function (item) { return new SelectModels(item) });
    //$.map(json, function (item) { return new Product(item); });
}
function SelectModels(name, disable) {

    // this.value = name == "AllModels" ? "all" : name;
    this.value = name;
    //this.disable = disable == undefined ? false : disable;
    this.name = name;
}
function Customer(data) {
    this.id = data.id;
    this.name = data.name;
    this.surename = data.surename;
    this.email = data.email;
    this.phone = data.phone;
    this.dealer = data.dealer;
    this.password = data.password;
    this.externalId = data.externalId;
    this.country = data.country;
    this.taxId = data.taxId;
    this.personalId = data.personalId;
    this.store = data.store;
    this.address = data.address;
}
