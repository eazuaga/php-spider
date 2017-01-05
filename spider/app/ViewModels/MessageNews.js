function NewsMessage(data) {
    this.id = data.id;
    this.title = data.title;
   // this.img = Config.GetUrlApi() + data.img;
    this.img = "img/" + data.img;

    this.content = data.content;
    this.link = data.link;
}

function NewsListViewModel() {
    var self = this;
    SetTitle();
    self.Dealer = Config.Dealer;
    self.name = "News";
    var url = Config.Url(self.name);
    self.News = ko.observableArray([]);
    /*deprecated*/
  //  var urlapi = Config.GetUrlApi() + "News";
   // var jsonlocal = "json/data/news.json";
    self.mapear = function (json) {
        var mapped = $.map(json, function (item) { return new NewsMessage(item); });
        self.News(mapped);
    }
    if (localStorage.getItem("News") != null) {
        console.log("leo del local storage");
        var News = $.parseJSON(localStorage.getItem("News"));
        self.mapear(News);
    }
    else {
        console.log("hago la peticion porque el local storage esta vacio");
        var ajax = $.ajax({
            url: url, beforeSend: function () { $(".loader").show(); }, dataType: 'json',
        });
        ajax.done(function (json) {
            $(".loader").hide();
            self.mapear(json);
            localStorage.setItem("News", JSON.stringify(json));
        });
    }
    self.id = "#Messages";
    Animate(self.id);
}
NewsListViewModel.prototype = new Base;
ko.applyBindings(new NewsListViewModel());
