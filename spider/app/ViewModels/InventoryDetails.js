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
//    this.images = Config.OnLine ? (data.images[0] == "" ? [Config.ImgNotAvailable] : data.images) : [Config.ImgNotAvailable];
    this.images = Config.OnLine ? (data.images[0] == "" || data.images[0] == undefined ? Config.ImgNotAvailable :
       /*cuando tiene imagen y esta online*/
       ( data.images )) : Config.ImgNotAvailable;

    this.optionals = data.optionals;
    this.displacement = data.displacement;
    this.year = data.year;
    this.make = data.make;
    this.videos = data.videos;
    this.PathImage = Path();
    this.attachments =  data.attachments;
    this.description = data.description;
    this.url = data.url;
}


function ProductModel() {
    //SetTitle();
    SetTitle(Config.dealerType != "tractor-front" ? Traducir("VehicleDetail") : Traducir("TractorDetails"));
    var self = this;
    $("body").css("height", "auto");
    $(".main_content").css("height", "auto");
    self.id = "#inventoryDetails";
    $(self.id).hide();
    CreateBackIcon();
    self.LabelInformation = Config.dealerType != "tractor-front" ? Traducir("Vehicleinformation") : Traducir("TractorInformation");
    self.Dealer = Config.Dealer;
    self.Vehiculo = ko.observable(new Product({
        id: 0, price: 0, model: "", mileage: "", fuel: "", power: "", traction: "",
        long: "", width: "", height: "", weight: "", trunk: "", used: "", color: "", images: [], optionals: "", displacement: "", year: "", make: "", videos: [], PathImage: "", description: "", url: ""
    }));
    self.visibleWidgets = ko.observable(false);
    self.visibleMore = ko.observable(true);
    self.PathImage = Path();
    var idVehicle = Parametros()[1];
   // CreateSharer('s', 'details', 's', 'sa');
    GetById = function (id) {
        var key = Config.OnLine ? "InventoryById" : "Inventory";
        Repository.GetCallBack(key, Map, true, id);
    };
    var V ;
    var imagenes;
    self.price = ko.observable();
    self.images = ko.observableArray([]);
    self.visibleField = function (text) {
        var text = String(text);
        var num = 0;
        if(!isNaN(num = parseFloat(text))) {
            if(num <= 0) {
                return false;
            }
        }
        //console.log("imagen visible",text);
        return (text ==="" ? false : !text.IsNullOrEmpty());
    };
    self.OpenExternalLink = function(link) {
        window.open(self.PathImage +link, '_system');
    };
    self.showall= function() {
        self.visibleWidgets(true);
            self.visibleMore(false);
        },
    self.hideall = function() {
        self.visibleWidgets(false);
        self.visibleMore(true);
    };
    Map = function (json) {
        var idVehicle = Parametros()[1];
        var vehicleEntity = Config.Context() == "Local" ? Enumerable.From(json).Where(function (x) { return x.id == idVehicle }).ToArray()[0] : json;
        V = new Product(vehicleEntity);
        self.Vehiculo(V);
        imagenes = (V.videos ? V.videos : "").concat(V.images);
        self.images(ProcessPathImage(imagenes));
        self.price(self.Vehiculo().price);
        $(self.id).show();
        var _slider = $(".slider");
        _slider.owlCarousel({
            navigation: false,
            slideSpeed: 300,
            paginationSpeed: 400,
            singleItem: true
        });
       // console.log(self.Vehiculo().make + ' ' + self.Vehiculo().model + ' ' + self.Vehiculo().year + (self.Vehiculo().priceVisible ? (' - ' + self.Vehiculo().price) : ''), '', self.images()[0].path, self.Vehiculo().url);
        var texto = self.Vehiculo().make + ' ' + self.Vehiculo().model + ' ' + self.Vehiculo().year + (self.Vehiculo().priceVisible ? (' - ' + self.Vehiculo().price) : '');
        console.log("me", this, self);
        self.llamar(texto, self.images()[0].path, self.Vehiculo().url);
        Animate(self.id);
        scrollWinTop(0);
    };
    self.llamar = function (texto, img, link) {
        console.log(texto, img, link);
        CreateSharer(texto, '', img, link);
        //CreateSharer("s", 'details', "s", "as");
    };
    GetThumbyoutube = function (url) {
        var id = url.split('embed')[1].replace('/','');
        var thumb_url = "http://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
        return thumb_url;
    };
    GetThumbvimeo = function (url) {
        var thumb_url = "img/vimeo.png";
        return thumb_url;
    };
    GetPath = function (url) {
        var thumb_url ;
        thumb_url = url == Config.ImgNotAvailable ? url : thumb_url = Path() + url;
        return thumb_url;
    };
    Share = function() {
        console.log("dasda");
    };
    self.SeeVideo = function (type, id) {
        $("#video").css("padding-bottom", "56.25%");
        $("#player").append("<iframe class='youtube-player'  type='text/html' src=" + id + " frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>");
        $(".slider").hide();
        $("#video").show();
    };
    self.CloseVideo = function () {
        $("#video").css("padding-bottom", "0%");
        $("#video").hide();
        $(".slider").show();
        $("#player").empty();
    };
    IsVideo = function (type) {
        return type == "vimeo" || type == "youtube";
    };

    ProcessPathImage = function (images) {
        var im = [];
        for (var i = 0; i < images.length; i++) {
            if (images[i].indexOf('youtube') > 0) {
                im.push({
                    path: GetThumbyoutube(images[i]),
                    type: "youtube",
                    id: images[i].split('embed')[1].replace('/', ''),
                    embed: "http:" + images[i]
                });
            }
            else {
                if (images[i].indexOf('vimeo') > 0) {
                    im.push({
                        path: GetThumbvimeo(images[i]),
                        type: "vimeo",
                        id: images[i].split('//player.vimeo.com/video/')[1],
                        embed: "http:" + images[i]
                    });
                }
                else {
                    im.push({
                        path: images[i].indexOf("http") !== -1 ? encodeURI(images[i]) : GetPath(images[i]),
                        type: "img",
                        id: 0,
                        embed: ""
                    });
                }
            }
        }
        return im;
    };
    self.share = function (texto, titulo, image, url) {
       alert(Traducir("WaitForSharing"), 3000);
       window.plugins.socialsharing.share(texto, titulo, image.path, url);
    };

    GetById(idVehicle);

}
ProductModel.prototype = new Base;
ko.applyBindings(new ProductModel());

