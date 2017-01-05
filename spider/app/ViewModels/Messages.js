function Message(data) {
    this.id = data.id;
    this.content = data.content;
    this.shorContent = (data.content !== null && data.content !== undefined && data.content.length > 40) ? data.content.Truncate() : data.content;
    this.device = data.device;
    this.answerOf = data.answerOf;
    this.sender = data.sender == "dealer" ? Config.dealerName : (Config.User.Logued ? Config.User.name : Traducir("Customer"));
    this.sendDatetime = "";
    if(data.sendDatetime != null && data.sendDatetime != undefined) {
        this.sendDatetime = data.sendDatetime.toString().toDate().toFormatedString(Config.DateTimeFormat);
        this.sendDatetimeFromNow = moment(data.sendDatetime, "YYYY-MM-DD hh:mm:ss").fromNow(); // hace 4 años
    }
    this.clase = ko.computed(function () {
        var clase = data.sender == "user" ? "you" : "me";
        return clase;
    }, this);
    this.ClassViewed = data.viewed == "0" ? " BackWhite" : "";
    this.viewed = data.viewed == "0" ? " BackWhite" : "";
    this.answerable = data.answerable;
    this.avatar = data.sender == "user" ? "img/im2.jpg" : "img/im1.jpg";
}

function MessageListViewModel() {
    Config.InUse = true;
    $(".ec").hide();
    var self = this;
    SetTitle();
    self.Dealer = Config.Dealer;
    self.name = "Message";
    self.AnswerVisible = ko.observable(false);
    self.IdMessageAnswer = ko.observable();
    var url = Url(self.name);
    self.Messages = ko.observableArray([]);
    self.MyMessage = ko.observable();
    self.resultMessage = ko.observable(Traducir('SearchingMessages'));
    moment.locale(Config.LenguajeApp);
    self.mapear = function (json) {
        var mapped = $.map(json, function (item) { return new Message(item); });
        self.Messages(mapped);
    }
    ajustContentMessage(110);
    Mapear = function (json) {
        console.log(json);
        //self.MessageVisible(json.length != 0);
        if(json.length > 0) {
            self.resultMessage("");
        } else {
            self.resultMessage(Traducir('NoMessages'));
        }
        var mapped = $.map(json, function (item) { return new Message(item); });
        var order = Enumerable.From(mapped).Where(function (x) { return x.answerOf == "" }).ToArray();
        console.log(mapped);
        binds();
        self.Messages(order);
    }
    MapearRespuesta = function (json) {
        console.log("JSON: ", json);
        var idMessage = Parametros()[1];
        var messageViewed = json;
        if(typeof json === "string") {
            messageViewed = $.parseJSON(json);
        }
        messageViewed.viewed = "1";
        Repository.SendPost2("ViewedMessage", messageViewed);
        Sync.HideNotificationBadge(messageViewed.type);
        console.log("MESSAGE: ", messageViewed);
        var conversacion = $.map(messageViewed.responses, function (item) { return new Message(item); });
        console.log("RESPUESTAS: ", conversacion);
        conversacion.push(new Message(messageViewed));
        self.Messages(conversacion.reverse());
        binds();
    }
    var ShowAll = function () {
        var serial = Config.IdDevice;
        console.log("iddevice :" + serial);
        serial = serial == 0 ? 27 : serial;
        //serial = 837;
        Repository.GetCallBack(self.name, Mapear, true, serial);
        self.AnswerVisible(false);
    };
    LoadMessages = function () {
        ShowAll();
    };
    LoadConversation = function () {
         console.log("PARAMETROS: ", Parametros());
         GetById(Parametros()[1]);

        Animate(self.id);
    };
    GetById = function (id) {
        var idMessage = id;
        var key = Config.OnLine ? "Conversation" : "Message";
        Repository.GetCallBack(key, MapearRespuesta, true, id);
        //return Enumerable.From(self.Messages()).Where(function (x) { return x.answerOf == idMessage || x.id == idMessage }).ToArray();
    };
    var section = { 'Conversation': LoadConversation, 'Messages': LoadMessages };
    section[Parametros()[0]]();



    self.AnswerText = ko.observable();

    self.id = "#Messages";
    Animate(self.id);
    send = function () {
        var params = {
            content: self.AnswerText(),
            device: Config.IdDevice,
            answerOf: Parametros()[1],
            sender: "user",
            type: null,
            "answerable": false
        };
        console.log(params);

        Config.OnLine ? Repository.SendPost("PostMessage", params, LoadConversation) : Repository.SavePending({ key: "PostMessage", obj: params });
        Config.OnLine ? alert(Traducir('sentSuccessfully')) : alert(Traducir('willbesent'));

        self.AnswerText("");

    };

    ShowMore = function () {
        var messages = $.parseJSON(Repository.GetItem(self.name));
        var order = Enumerable.From(mapped).Where(function (x) { return x.answerOf == "" }).ToArray();
        var childs = Enumerable.From(mapped).Where(function (x) { return x.answerOf != "" }).ToArray();
        console.log(order);
        console.log(childs);
        var TotalMessages = ProcessArray(order, childs);
        console.log(TotalMessages);
        self.mapear(TotalMessages);
    };
}
MessageListViewModel.prototype = new Base;
ko.applyBindings(new MessageListViewModel());
