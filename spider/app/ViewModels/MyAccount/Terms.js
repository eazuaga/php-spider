function Terms (data) {
    this.id = data.id;
    this.description = data.description;
    this.title = data.title;
}

function TermsViewModel() {
    var self = this;
    self.Dealer = Config.Dealer;
    self.id = "#Terms";
    self.terms = ko.observable({}); //"aa";new Terms({});
    GetTitle();
    CreateBackIcon();
    var animar = function () {
        Animate(self.id);
    };
    dataMapper = function (data) {
        console.log(data);
        if(data !== undefined && data.length > 0) {
            self.terms(new Terms(data[0]));
            console.log(self.terms);
            SetTitle(self.terms().title);
        }
    }
    Repository.GetCallBack("Terms", dataMapper, true);

}
TermsViewModel.prototype = new Base;
//console.log(TermsViewModel);
ko.applyBindings(new TermsViewModel());