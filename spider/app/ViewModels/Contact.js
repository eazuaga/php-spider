function Contact(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.phone = data.phone;
    this.skype = data.skype;
    this.role = data.role;
    this.department = data.department;
    this.imagevisible = !data.img.IsNullOrEmpty();
    this.img = Config.OnLine ? (data.img.IsNullOrEmpty() ? Config.ImgUser : Path() + data.img) : Config.ImgUser;
    console.log("imagen contacto :" + this.img);
    this.branch = data.branch;
    this.MailParsed =ko.computed(function(){
        return "mailto:" + data.email;
    }, this);
    this.PhoneParsed = ko.computed(function () {
        return "tel:" + data.phone;
    }, this);
    this.SkypeParsed = ko.computed(function () {
        return "skype:" + data.skype + "?call";
    }, this);
    this.SMSParsed = ko.computed(function () {
        return "sms:+" + data.sms ;
    }, this);
    console.log(data.phone.IsNullOrEmpty());
    this.HavePhoneParsed = !data.phone.IsNullOrEmpty();
    this.HaveEmail = !data.email.IsNullOrEmpty();
    this.HaveSkypeParsed = !data.skype.IsNullOrEmpty();
    this.HaveSMSParsed = !data.sms.IsNullOrEmpty();
}
function SocialNetwork(data) {
    this.id = data.id;
    this.dealer = data.dealer;
    this.type = data.type;
    this.link = data.link;
}

function ContactsListViewModel() {

    var self = this;
    self.currentFilter = ko.observable();
    self.branch = ko.observableArray([]);
    self.branch($.parseJSON(Repository.GetItem("Branch")));
    if (self.branch().length > 1) {
        CreateBackIcon();
    }

    self.currentLocationBranch = ko.observable();
    self.currentPhoneBranch = ko.observable();
    self.currentPhoneBranchParsed = ko.observable();
    self.currentLocationBranchGoogleMaps = ko.observable();
    self.currentImage = ko.observable();
    self.TitleBranch = ko.observable();
    self.imgVisible = ko.observable();
    self.Contacts = ko.observableArray([]);
    self.SocialNetworks = ko.observableArray([]);
    var idBranch = Parametros()[1] === undefined ? Config.UniqueStore : Parametros()[1];
    self.GenericImagePeople = ko.observable(true);
    //var idBranch = Parametros()[1];
    console.log(idBranch);
    var Branch = Enumerable.From(self.branch())
         .Where(function (x) { return x.id == idBranch }).ToArray();
    console.log(Branch);
    self.currentLocationBranch(Branch[0].location);
    self.currentImage(Config.OnLine ? Path() + Branch[0].img : Config.ImgNotAvailable);
    self.imgVisible(Branch[0].img != "");
    self.currentPhoneBranch(Branch[0].phone);
    this.mailParsed = ko.computed(function () {
        return "mailto:" + Branch[0].email;
    }, this);
    self.currentPhoneBranchParsed("tel:" + Branch[0].phone);
    self.currentLocationBranchGoogleMaps("https://maps.google.com.ar/maps?q=" + Branch[0].location);
    var contactos = Branch[0].contacts;
    var mapped = $.map(contactos, function (item) { return new Contact(item); });
    self.VisibleCurrentPhoneBranchParsed = !Branch[0].phone.IsNullOrEmpty();
    self.VisibleMailParsed = !Branch[0].email.IsNullOrEmpty();

    SetTitle(Traducir('Contact'));
    self.TitleBranch = Branch[0].name;

    self.Contacts(mapped);
    self.id = "#Contact";

    DisplayIfNotEmpty = function (text) {
        return ! text.IsNullOrEmpty();
    };

    Animate(self.id);

    var MapearRedesSociales = function (json) {
        $(self.id).show();
        var mapped = $.map(json, function (item) { return new SocialNetwork(item); });
        self.SocialNetworks(mapped);
        Animate(self.id);
    };
    self.OpenExternalLink = function (link) {
        console.log(link.link);
        window.open(link.link, '_system');
    };
    var chiringolosActivos = Enumerable.From(self.Contacts()).Where(function(x) { return x.imagevisible === true }).ToArray().length > 0;
   // console.log("hay al menos una imagen", Enumerable.From(self.Contacts()).Where(function (x) { return x.img === ""  }).ToArray());
    console.log("hay al menos una  imagen", chiringolosActivos);
    chiringolosActivos ? self.GenericImagePeople(true) : self.GenericImagePeople(false);
    Repository.GetCallBack("Social", MapearRedesSociales, true);

}
ContactsListViewModel.prototype = new Base;
ko.applyBindings(new ContactsListViewModel());
