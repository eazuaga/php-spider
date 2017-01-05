function user(data) {
    this.email = data.email;
    this.name = data.name;
    this.surename = data.surname;
    this.location = data.location;
    this.phone = data.phone;
    this.token = data.Token;
}

function ShiftsListViewModel() {
    var self = this;
    SetTitle();
    self.id = "#contentApoint";
    var url = '';
    function DisplayForm(){
        $("#app").show() ;
        $("#formApoint").show();
        if ($(window).width() <= 769) {
            $("#menu").hide();
        } else {
            $("#menu").show();
        }
        
        console.log("oculto menu display form");
    }
    Config.Apoint365 == "1" ? $("#contentApoint").show() : DisplayForm();


    //User & Customer -----------------------------------------------------------
    self.User = ko.observable();
    var CurrentUser = $.parseJSON(Repository.GetItem("user"));
    var currentCustomer = null;
    var strCustomer = Repository.GetItem("CurrentCustomer");
    currentCustomer =  strCustomer !== 0 ? $.parseJSON(strCustomer) : null ;
    console.log(currentCustomer);
    currentCustomer === null ? currentCustomer = {
        name: CurrentUser.name,
        surename: "",
        email: CurrentUser.email,
        phone: "",
        location: ""
    } : null;
    self.User = new user({
        name: currentCustomer.name,
        surname: currentCustomer.surename,
        email: currentCustomer.email,
        location: CurrentUser.location,
        phone: CurrentUser.phone,
        token: Config.User.Token
    });
    //####################################################################
    //Appoint-----------------------------------------------------------
    var LastApoint = $.parseJSON(Repository.GetItem("apoint"));
    self.Appoint = ko.observable();
    self.Appoint = new Appoint({
        vehicle: new Vehicle({
            make: "",
            model: "",
            year: ""
        }),
        Comments: LastApoint.Comments,
        user: self.User,
        branch: ""
    });
    //####################################################################
    //Makes---------------------------------------------------------------
    self.SelectedMake = ko.observable();
    self.Makes = ko.observableArray([]);
    var AllMakes = false;
    var makes = $.parseJSON(Repository.GetItem("AllMakesNModels"));
    console.log("makes", makes);
    var mapped = $.map(makes, function (item) {
        if(!item.disable) {
            return (new SelectMake(item));
        }
    });
    console.log("mapped", mapped);
    console.log("all makes", AllMakes);
    var makesWithModels = Enumerable.From(mapped).Where(function (x) { return x.Models.length != 0 }).ToArray();
    self.Makes(makesWithModels);
    //####################################################################
    //Models---------------------------------------------------------------
    self.SelectedModel = ko.observable();
    self.Models = ko.computed(function() {
        return self.SelectedMake() ? self.SelectedMake().Models : [];
    });
    //####################################################################
    //Years-------------------------------------------------------------
    self.SelectedYear = ko.observable();
    self.Years = ko.observableArray([]);
    self.Years = ko.computed(function() {
        var years = [];
        var actualYear = (new Date()).getFullYear();
        for (var year = actualYear; year > actualYear - 30; year -= 1) {
            years.push({ name: year.toString(), value: year, disable: false });
        }
        return self.SelectedModel() ? years : [];
    });
    //####################################################################
    //Others-------------------------------------------------------------
    self.Fuel = [
        { name: Traducir('Any'), value: 'all' },
        { name: 'Nafta', value: 'Nafta' },
        { name: 'Diesel', value: 'Diesel' },
        { name: 'GNC', value: 'GNC' },
        { name: Traducir('All'), value: 'all' }
    ];
    self.TypeCar = [
        { name: Traducir('NewAndUsed'), value: 'all' },
        { name: 'New', value: '0' },
        { name: 'Used', value: '1' },
        { name: Traducir('All'), value: 'all' }
    ];
    self.isAgroDealer = Config.dealerType === "tractor-front";
    console.log("isAgroDealer", self.isAgroDealer);
    self.Dealer = Config.Dealer;

    //####################################################################
    //Branchs---------------------------------------------------------------
    self.SelectedBranch = ko.observable();
    self.Branchs = ko.observableArray([]);
    var strBranches = Repository.GetItem("Branch");
    self.Branchs([]);
    if(strBranches !== 0) {
        self.Branchs($.parseJSON(strBranches));
    } else {
        Repository.GetCallBack("Branch", function(json) {
            self.Branchs($.map(json, function (item) { return new Branch(item); }));
        }, true);
        Repository.GetCallBack("Social", function(){}, true);
    }
    //####################################################################
    var test = true;


    self.Submit = function () {
        $("input:visible, textarea:visible").each(function (i, v) {
            var _input = $(v);
            if (_input.val() === "") {
                InvalidateInput(_input);
                test = test & false;
            }
            //test = true;
        });
        console.log("MARCA: ", self.SelectedMake());
        console.log("MODELO: ", self.SelectedModel());
        console.log("AÑO: ", self.SelectedYear());
        console.log("SUCURSAL: ", self.SelectedBranch());
        if(self.SelectedBranch() === undefined) {
            test = test & false;
            InvalidateInput($("#ddlBranchs"));
        }
        if(self.SelectedMake() === undefined) {
            test = test & false;
            InvalidateInput($("#ddlMakes"));
        }
        if(self.SelectedModel() === undefined) {
            test = test & false;
            InvalidateInput($("#ddlModels"));
        }
        if(self.SelectedYear() === undefined) {
            test = test & false;
            InvalidateInput($("#ddlYears"));
        }
        //test = false;
        console.log("Validation:", test);
        if (test) {
            self.Appoint.vehicle.make = self.SelectedMake().name;
            self.Appoint.vehicle.model = self.SelectedModel().name;
            self.Appoint.vehicle.year = self.SelectedYear().name;
            self.Appoint.branch = self.SelectedBranch().name;
            var content = Traducir("AppoinmentRequest") + ": \n" + HumanSerialize(self.Appoint, ["PathImage"]);
            var params = {
                title: Traducir("AppoinmentRequest"),
                content: content,
                device: Config.IdDevice,
                answerOf: 0,
                sender: "user",
                type: "message",
                answerable: true,
                about: "appointment"
            };
            console.log("===================");
            console.log(params);
            Config.OnLine ? Repository.SendPost("PostMessage", params, function() {}) : Repository.SavePending({ key: "PostMessage", obj: params });
            Config.OnLine ? alert(Traducir('sentSuccessfully')) : alert(Traducir('willbesent'));
        } else {
            alert(Traducir("checkTheFields"));
        }
    }
    //self.LoadInputs(false);
}
ShiftsListViewModel.prototype = new Base;
ko.applyBindings(new ShiftsListViewModel());
