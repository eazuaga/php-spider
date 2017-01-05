function ShiftsListViewModel() {
    var self = this;
    self.Dealer = Config.Dealer;
    SetTitle();
    self.id = "#turnos";
    Animate(self.id);
    Config.Apoint365 == "1" ? $("#contentApoint").append("<iframe src='http://www.turnos365.com/user' style='width:99%; height:1000px; border:0;' ></iframe>") : $("#formApoint").show();
    self.name = ko.observable();
    self.branch = ko.observable();
    self.vehicle = ko.observable();
    self.date = ko.observable();
    self.servicioRequerido = ko.observable();
    var test = false;

    self.Submit = function () {

        self.name() == undefined ? alert("completar el nombre") :(
        self.date() == undefined ? alert("completar el fecha"):
        self.servicioRequerido() == undefined ? alert("completar el el servicio") :
        self.vehicle() == undefined ? alert("completar el vehiculo") :
        self.branch() == undefined ? alert("completar el branch") : test = true);
        if (test) {
            var params = $("form").serialize();
            Repository.Send("Apoint", params);
        }


    }
    //OnBlurEvent = function (data, event) {
    //    alert(data);
    //}
}
ShiftsListViewModel.prototype = new Base;
ko.applyBindings(new ShiftsListViewModel());
