function Categoria(name, id, clase, clasei) {
    this.Name = name;
    this.Id = id;
    this.clase = clase;
    this.clasei = clasei
}

function CategoriaListViewModel() {

    var self = this;
    self.categoria = ko.observableArray([]);
    self.categorias = ko.observableArray([
       new Categoria("Special Offerts", "1", "grid-cell grc-1-3 launcher launcher--highlighted","fa fa-star"),
       new Categoria("Location", "2", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-map-marker"),
       new Categoria("Contacts", "people.html", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-calendar"),
       new Categoria("Inventario", "inventory.html", "grid-cell grc-1-3 launcher launcher--highlighted", "fa fa-calendar"),
    ]);

}
ko.applyBindings(new CategoriaListViewModel());
