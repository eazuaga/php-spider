function BranchListViewModel() {
    Config.InUse = true;
    $(".ec").hide();
    SetTitle(Traducir('Contact'));
    var h = Config.Heigth;
    var self = this;
    self.name = "Branch";
    var url = Url(self.name);
    self.Branchs = ko.observableArray([]);
    self.id = "#branch";
    $(self.id).hide();
    self.SocialNetworks = ko.observableArray([]);
    this.Traducir = function (name) {
        var r = {};
                r = Config.Language[Config.LenguajeApp][name];
                return r;
    }
    Mapear = function (json) {
        console.log("json : " + json);
        var mapped = $.map(json, function (item) { return new Branch(item); });
        self.Branchs(mapped);
        Repository.GetCallBack("Social", MapearRed, true);

        if(self.Branchs().length === 0) {
            alert(Traducir("NoBranchsAvailable"));
        } else {
            if(self.Branchs().length === 1) {
                Config.UniqueStore = self.Branchs()[0].id;
                Change2("Contact");
            } 

        }
    }


    var MapearRed = function (json) {
        $(self.id).show();
        var mapped = $.map(json, function (item) { return new SocialNetwork(item); });
        self.SocialNetworks(mapped);
        Animate(self.id);
    };
    self.OpenExternalLink = function (link) {
        console.log(link.link);
        window.open(link.link, '_system');
    };

    Repository.GetCallBack(self.name, Mapear, true);


}
BranchListViewModel.prototype = new Base;
ko.applyBindings(new BranchListViewModel());


