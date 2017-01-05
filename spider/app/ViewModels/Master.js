//function Categoria(name, id, clase, clasei) {
//    this.Name = name;
//    this.Id = id;
//    this.clase = clase;
//    this.clasei = clasei;
//    this.NombreTraducido = ko.computed(function () {
//        var r = {};
//        r = Config.Language[Config.LenguajeApp][name];
//        console.log(r);
//        return r;
//    }, this);
//}

function MenuListViewModel() {

    var self = this;
//    self.categoria = ko.observableArray([]);
    self.Dealer = Config.Dealer;
    //Config.Inicialize();
    //self.Theme = "bar--top" + Config.Inicialize();
    //self.categorias = ko.observableArray([
    //   new Categoria("SpecialOfferts", "Offerts.html", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-star"),
    //   new Categoria("Location", "#", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-map-marker"),
    //   new Categoria("Appointment", "turnos.html", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-calendar"),
    //   new Categoria("Parts", "#", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-gears"),
    //   new Categoria("Inventario", "inventory.html", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-calendar"),
    //   new Categoria("Messages", "Messages.html", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-comment-o"),
    //   new Categoria("Contacts", "Branch.html", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-users"),
    //   new Categoria("MyAccount", "#", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-user"),
    //   new Categoria("Tools", "#", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-briefcase"),

    //]);

}
ko.applyBindings(new MenuListViewModel());
