function Base() {
    var self = this;
    self.Title = ko.observable();
    var IsHome;
    self.enabled = ko.observable(false);
    self.homeVisible = ko.observable();
    self.PartsVisible = ko.observable();
    self.NothomeVisible = ko.observable(false);
    self.OtherPageVisible = ko.observable();
    self.enabledUsed = ko.observable(false);
    self.enabledNew = ko.observable(true);
    self.panelProgramer = ko.observable(Config.Platform == "Win32 Google Inc.");
    Config.IdDevice = Repository.GetItem("IdDevice");

    self.GoHome = function () {
        // Config.Parametro = "";
        // DisplayHome();
        //window.location.hash = "#!/";
        console.log("go home ?");
        DisplayMenu(true);
    };
    self.NumberResultGlobal = ko.observable();
    //$("#actionBar").bind('click', function () {
    //    history.go(-1);
    //});
    self.EnabledSearcher = function () {
        //alert("click searcher");
        self.enabled() == true ? self.enabled(false) : self.enabled(true);
    };
    self.SelectTypeCar = ko.observable();
    OnChange = function () {
        Config.EnabledLoading = false;
        $("#contentApoint").hide();
        Parametros()[0] !== "inventory" && Parametros()[0] !== "InventoryDetails" ?  Repository.SetLocalStorage("SearchInventory", "") :   console.log("no vacio");
        IsHome = Parametros()[0].IsNullOrEmpty();
        $("#search_icon").hide();
        self.homeVisible(IsHome);

        //self.PartsVisible(Parametros()[0] === "Parts");
        var icon = $("#cartIcon");
        var iconS = $("#SearchIcon");
        (Parametros()[0] === "Parts" || Parametros()[0] === "CategoryPartsList") && Config.User.Logued  ? icon.show() : icon.hide();
        (Parametros()[0] === "Parts" || Parametros()[0] === "CategoryPartsList" || Parametros()[0] === "inventory")  ? iconS.show() : iconS.hide();

        self.NothomeVisible(!IsHome);
        //if (IsHome) {
        //    DisplayHome();
        //}
        //else {
            self.Title(Parametros()[0]);
            $("#BarAcionBack").show();
            $("#iconMenu").show();
            if ($(window).width() <= 768) {
                console.log("oculto menu onchange");
                $("#menu").hide();
            } else {
                $("#menu").show();
            }
        //}
    }
    DisplayMenu = function (visible) {
        console.log("visible ? ", visible);

        //IsHome = Parametros()[0].IsNullOrEmpty();

        if ($(window).width() <= 769) {
            visible ? $("#Menu").show() : $("#Menu").hide();
        } else {
            $("#menu").show();
        }

    }
    DisplayHome = function () {
        GetTitle();
        $("#BarAcionBack").hide();
       // $("#menu").show();
        $("#app").hide();
        $("#iconMenu").hide();
       // Animate('#menu');
        //$("#menu a").css("background", "none");
    };
    /*Deprecated*/
    GetTitle = function (override) {
        SetTitle(override);
    }
    SetTitle = function (override) {
        if(override !== undefined && override !== null && override !== "") {
            var magicNumber = Math.trunc(display.vw / 13); //Magic number
            var title = override;
            if(override.length >= magicNumber) {
                title = override.substr(0, magicNumber - 4) + " ...";
            }
            self.Title(Traducir(title));
        } else {
            self.Title(Traducir(Parametros()[0]));
        }
        //Cosas que se tienen que repetir por cada página
        _sharer.addClass("hidden");
        self.Share = function () {};
        $('.material-tabs-fixed').remove();
        $(window).unbind("scroll");
    }
    self.unParametro = 2;
    self.Property = function () {
        return (self.unParametro);
    }
    var _sharer = $(".bar-title_sharer").addClass("hidden");
    var icon = $(".fa-m-chevron-left");/*ya viene oculto con la clase whitecart*/
    //icon.hide();
    ShowIconsBar = function() {
        var icon_menu = $("#iconMenuNew");
        var icon_back = $("#iconback");
        if ($(window).width() <= 768) {
            icon_menu.show();
        } else {
            icon_menu.hide();
        }
        icon_back.hide();
    };
    CreateBackIcon = function () {
        var iconMenu = $("#iconMenuNew");
        var iconBack = $("#iconback");
        iconMenu.hide();
        iconBack.show();icon.show();
        iconBack.click(function () {
            history.go(-1);
        });
    };
    self.Share = function () {};
    CreateSharer = function (texto, titulo, image, url) {
        _sharer.removeClass("hidden");
        console.log("Create Share: " + texto + " | " + titulo + " | " + image + " | " + url);
        //Libero Bindings pasados
        var element = _sharer.find("i").get(0);
        console.log(element);
        ko.cleanNode(element);
        //Nuevo Bind
        console.log(self);
        $(_sharer).unbind("click");
        $(_sharer).bind("click", function() {
               console.log("Sharing: " + texto + " | " + titulo + " | " + image + " | " + url);
               alert(Traducir("WaitForSharing"), 3000);
               if(window.plugins !== undefined && window.plugins.socialsharing !== undefined && window.plugins.socialsharing.share !== undefined) {
                   window.plugins.socialsharing.share(texto, titulo, image.path, url);
               }
        });
        //self.Share = function () {
        //   console.log("Sharing: " + texto + " | " + titulo + " | " + image + " | " + url);
        //   alert(Traducir("WaitForSharing"), 3000);
        //   if(window.plugins !== undefined && window.plugins.socialsharing !== undefined && window.plugins.socialsharing.share !== undefined) {
        //       window.plugins.socialsharing.share(texto, titulo, image.path, url);
        //   }
        //}
    };

    InvalidateInput = function (_input) {
        //_input.attr("placeholder", Traducir("Required"));
        _input.addClass("input-error");
        _input.focus(function (){
            $(this).removeClass("input-error");
        });
    };
 ;
    Animate = function (id) {
        DisplayContent();
        $(id).removeClass();
        $(id).css("display", "block");
        var a = $(id).attr('data');
        $(id).attr('class', Config.TransitionIn + " oc");
        scrollWinTop(0);
        bindTouchState();
        //$("input").validate();
        addShadowBar();
    }
    Animate2 = function (id) {
        DisplayContent();

        $(id).show();
        $(id).addClass("show");
        //$(id).css("display", "block");
        //var a = $(id).attr('data');
        //$(id).attr('class', Config.TransitionIn + " oc");


        scrollWinTop(0);
        bindTouchState();

        //IsHome = Parametros()[0].IsNullOrEmpty();
        //if ($(window).width() <= 769) {
        //    IsHome ? $("#menu").show() : $("#menu").hide();
        //} else {
        //    $("#menu").show();
        //}
        $("input").validate();
    }
    Traducir = function (name) {
        var r = {};
        if(Config.Language[Config.LenguajeApp] && Config.Language[Config.LenguajeApp][name]) {
            r = Config.Language[Config.LenguajeApp][name];
        } else {
            r = name;
        }
        return r;
    }
    HumanSerialize = function (object, exclude) {
        if(exclude === undefined || Object.prototype.toString.call(exclude) !== "[object Array]") {
            exclude = [];
        }
        var strObject = "";
        if(Object.prototype.toString.call(object) === "[object Object]") {
            for (var prop in object) {
                if(object.hasOwnProperty(prop)) {
                    if(Object.prototype.toString.call(object[prop]) === "[object Object]") {
                        strObject += ", " + HumanSerialize(object[prop], exclude);
                    } else {
                        if(object[prop] !== undefined && object[prop] !== "" && exclude.indexOf(prop) < 0) {
                            var key = prop.slice(0,1).toUpperCase() + prop.substring(1, prop.length);
                            strObject += ", " + Traducir(key) + ": " + object[prop].toString();
                        }
                    }
                }
            }
        }
        return strObject.replace(/^(, )+/g, "");
    }
    EvalMenu = function (config) {
        var page, page2;
        // Repository.GetCallBack("Offerts", EvalMenuCallback,true);
        /*var value = Repository.GetItem("Branch");
        console.log("value : " + value);
        if (value != 0) {
            var branch = $.parseJSON(Repository.GetItem("Branch"));
            page = branch.length == 1 ? "#!/Contact/" + branch[0].id : "#!/Branch";
            $("a[href='#!/Branch']").attr("data", page);
        }*/
        //$("a[href='#!/inventory']").children()[1].attr("class", "").addClass("fa").addClass("icon-launcher").addClass("fa-" + config.dealerType);
        var vehicleLink = $("a[href='#!/inventory']").children()[1];
        var spanLinkVehicle = $("a[href='#!/inventory']").children()[2];
        var clase = "";
        switch (config.dealerType) {
            case "automobile":
                clase = "menu-auto";
                break;
            case "tractor-front":
                clase = "menu-tractor";
                break;
            case "motorbike-front":
                clase = "menu-moto";
                break;
            case "truck-front":
                clase = "menu-camion";
                break;
        }
        $(vehicleLink).attr("class", "").addClass("fa").addClass("icon-launcher").addClass("fa-" + clase);
        //console.log("link de vehiculos ", vehicleLink);
        if($(spanLinkVehicle).text() === "Inventory") {
            $(spanLinkVehicle).text(Config.dealerType === "tractor-front" ? Traducir("Tractor") : Traducir("Inventory"));
            //$("a[href='#!/inventory']").find("i:first").attr("class", "").addClass("fa").addClass("icon-launcher").addClass("fa-" + config.dealerType);
        }


    }
    DisplayContent = function () {
        IsHome = Parametros()[0].IsNullOrEmpty();
        $(window).width() <= 769 && IsHome ?$("#app").hide(): $("#app").show();

    };
    OfflineMode = function () {
        Config.Context() == "Dev" ?  Config.server.move(0, 1) : false;
        Config.OnLine = false;
    };
    OnlineMode = function () {
        Config.Context() == "Local" ? Config.server.move(0, 1) : false;
        Config.OnLine = true;
    };
    GetStatusConection = function () {
        return { context: Config.Context(), Online: Config.OnLine };
    };
    alert = function (msj, hiddingTime) {
        if(hiddingTime === undefined) {
            hiddingTime = 1500;
        }
        if(Config.Platform.IsNullOrEmpty() || !(window.plugins && window.plugins.toast && window.plugins.toast.showShortTop)) {
            console.log("ALERT: " + msj);
            var _loader = $("#loader");
            var text = _loader.html();
            _loader.html("<span>" + msj + "</span>").show();
            setTimeout(function (){
                _loader.hide();
                _loader.html(text);
            }, hiddingTime);
        } else {
            if(hiddingTime > 1500) {
                window.plugins.toast.showShortCenter(msj, function (a) { console.log('toast success: ' + a) }, function (b) { alert('toast error: ' + b) });
            } else {
                window.plugins.toast.showLongCenter(msj, function (a) { console.log('toast success: ' + a) }, function (b) { alert('toast error: ' + b) });
            }
        }
    }
    self.customer = ko.observable();

    /*bach register*/
    MapCustomer = function (json) {
        self.customer(new Customer(json));
        //InsertInfoDevices(self.customer());

    };

    /*bach register*/
    InsertInfoDevices = function (customer) {
        var notifications = { turnos: "1", servicios: "1", Ofertas: "1", Mensajes: "1" };
        var params = { serial: Config.registrationid, type: Config.Platform, notifications: notifications, customer: customer.id, idDealer: Config.Dealer };
        console.log(params);
        Repository.SendPost("Devices", params, SaveDeviceLocal);

    };
    /*bach , si el usuario no tiene internet en el primer uso despues de procesar el bach de insert customer debo registrar el
        device */
    SaveDeviceLocal = function (json) {
        console.log(json);
        json.id == "0" ? console.log("serial de dispositivo nulo") : Config.IdDevice = json.id;
        Repository.SetLocalStorage("IdDevice", json.id);
        Repository.SetLocalStorage("Register", "ok");
        /*registro en  1*/
    };


}
var bachRegister = {
    MapCustomer: function (json) {
        InsertInfoDevices(new Customer(json));
    }
}

bachRegister.execute = function (name) {
    console.log("bach register:" + bachRegister[name]);
    console.log([].slice.call(arguments, 1));
    return bachRegister[name] && bachRegister[name].apply(bachRegister, [].slice.call(arguments, 1));
};

function binds() {
    //if ($(window).width() >= 1024) {
    //    $(".clickeable").click(function () {
    //        $(this).attr("data").IsNullOrEmpty() ? $("#app").empty() : DisplayPage($(this).attr("data"));
    //    });
    //}

}
Load = function (name) {
    var menu = "#menu";
    var content = "#app";
    $('#app').load('PartialView/' + name + '.html');
};
function DisplayPage(pathname) {
    var hash = pathname.split('/')[1];
    Config.Parametro = pathname;
    window.location.hash = pathname;
}
ko.bindingHandlers.executeOnEnter = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor();
        $(element).keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                allBindings.executeOnEnter.call(viewModel);
                return false;
            }
            return true;
        });
    }
};
ajustContentMessage = function (value) {
    var h = Config.Heigth - value;
    $("#contentMessage").height(h);
    $("#PartSearcherFixed").height(h);
}
changePosition = function (data) {
    var heigthKeyBoard = Config.Heigth - $(window).height();
    var magicNumber = heigthKeyBoard + 217;
    data ? ajustContentMessage(magicNumber) : ajustContentMessage(150);
}

$(window).resize(function () {
    console.log("cambio el tamño de la ventana");
    console.log($(window).height() + " teclado activo: " + Config.ActiveKeyboard);
    IsHome = Parametros()[0].IsNullOrEmpty();
    if ($(window).width() <= 768) {
         $("#menu").hide() ;
         $("#iconMenuNew").show();
         $("#Menu").hide() ;
    } else {
        if ($(window).width() > 769) {
            $("#Menu").hide();
            $("#menu").show();
            $("#iconMenuNew").hide();
        }
    }
    Parametros()[0] == "Conversation" ? changePosition(Config.ActiveKeyboard) : false;
});

function scrollWinTop(time) {
    $('html,body').animate({
        scrollTop: 0
    }, time);
}
function scrollWinTopTo(h) {
    //  var destination = $(dom).offset().top;
    // console.log("alto dom : " + destination);
    $('html,body').animate({
        scrollTop: h
    }, 1000);
}
function bindTouchState() {
    $(document).delegate(".clickeable", "touchstart", function () {
        $(this).addClass("fake-active");
    }).delegate(" button, .clickeable", "touchend", function () {
        $(this).removeClass("fake-active");
    }).delegate(" button, .clickeable", "touchcancel", function () {
        $(this).removeClass("fake-active");
    });
    //console.log($(".clickeable"));
}
function adjustTemplate(overrideH) {
    var h = $(window).height() - $("#ActionBar").outerHeight() ;
    if(overrideH !== undefined) {
        h = overrideH;
    }
    //if(window.orientation && (window.orientation = 90 || window.orientation = -90)) { //landscape }

    if(h < 450) {
        h = 450; //Numero mágico
    }

    Config.Heigth = h;

    var _launcher = $("#launcher").height(h);
    var sizeNumber = Config.CurrentTemplate == "damero" ? Math.floor(h / 28) + 12 : Math.floor(h / 28);
    _launcher.find(".fa").css("font-size", sizeNumber + "px");
    bindTouchState();

}
String.prototype.IsNullOrEmpty = function () {
    var n = this;
    //    return (({ null: 1, "": 1, undefined: 1 })[n]) ? true : false;
    return n == "";
};
String.prototype.RemoveSymbols = function () {
    return this.replace(/[u][$][s]/, '').replace('.', '');
};
String.prototype.Truncate = function () {
    return this.substring(0, 30) + " ...";;
};
Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
}
String.prototype.toDate = function (format) {
    var input = this;
    format = format || 'yyyy-mm-dd'; // default format
    var parts = input.match(/(\d+)/g),
    i = 0, fmt = {};
    // extract date-part indexes from the format
    if(parts != null) {
       format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

       return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
    } else {
       return null;
    }
}
Date.prototype.toFormatedString = function (format) {
    var date = this;
    format = format || 'yyyy-MM-dd'; // default format
    var strDate = date.toString();
    if(format !== undefined && format !== "") {
        strDate = format;
        strDate = strDate.replace("yyyy", date.getFullYear());
        strDate = strDate.replace("yy", date.getFullYear().toString().substring(2,4));

        strDate = strDate.replace("MM",  lpad(date.getMonth() + 1, 2));
        strDate = strDate.replace("M",  date.getMonth());

        strDate = strDate.replace("dd", lpad(date.getDate(), 2));
        strDate = strDate.replace("d", date.getDate());

        strDate = strDate.replace("hh", lpad(date.getHours(), 2));
        strDate = strDate.replace("h", date.getHours());

        strDate = strDate.replace("mm", lpad(date.getMinutes(), 2));
        strDate = strDate.replace("m", date.getMinutes());

        strDate = strDate.replace("ss", lpad(date.getSeconds(), 2));
        strDate = strDate.replace("s", date.getSeconds());
    }
    return strDate;
}
function lpad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        // Clean up
        canvas = null;
    };
    img.src = url;
}
Url = function (ViewModel, param, page) {
    console.log(ViewModel, " === ", Config.Context());
    var parametros = param || false;
    var pagina = page || false;
    //Config.IdDevice = 837;
    console.log("parametros", parametros);
    var route = Config.Context() == "Local" ? Config.UrlApi[ViewModel][Config.Context()] :
           (parametros === false ? (Config.GetUrlApi() + Config.UrlApi[ViewModel][Config.Context()] + Config.TokenApp).replace("<%IdDevice%>", Config.IdDevice) :
            Config.GetUrlApi() + (Config.UrlApi[ViewModel][Config.Context()] + Config.TokenApp).replace("<%params%>", parametros).replace("<%IdDevice%>", Config.IdDevice));
    console.log("usa paginado", pagina);
    console.log("route", route);
    var r = route.replace("<%Page%>", pagina);
    //!isNaN(Number(pagina)) ? route.replace("<%Page%>", pagina) : console.log("la ruta no podee paginado");

    return r;

};
UrlLogued = function (ViewModel, param) {
    var parametros = param || false;
    //var userToken = $.parseJSON(Repository.GetItem("user")).token;
    var userToken = Config.User.Token;
    var route = Config.Context() == "Local" ? Config.UrlApi[ViewModel][Config.Context()] :
           (parametros == false ? Config.GetUrlApi() + Config.UrlApi[ViewModel][Config.Context()] + userToken : (Config.GetUrlApi() + Config.UrlApi[ViewModel][Config.Context()] + userToken).replace("<%params%>", parametros));
    return route;
};
Path = function () {
    return Config.Context() == "Local" ? "img/" : Config.GetUrlApi();
};
DisplayTerms = function () {
    window.location.hash = "#!/Register";
    console.log("DisplayTerms Executed");
    //Change2("Register");
};
ProcessTemplate = function (json, idTml, idDiv, Nametmp) {
    $(idDiv).empty();
    if (json != null && json.length != 0) {
        $(idTml).tmpl(json).appendTo(idDiv);
    }
}
Change = function () {
    HideMenu();
    $("#loader").show();
    //$("#iconMenuNew").show();
    ShowIconsBar();
    OnChange();
    params = ParametrosHash();
    $('#app').empty();
    if (params[0] != "") { Load(params[0]); }
    $("#loader").hide();
};
Change2 =  function (hash) {
    OnChange();
    Load(hash);
}
Parametros = function(){
    return window.location.hash.substring(3).split('/');
};
ParametrosHash =  function () {
    return window.location.hash.substring(3).split('/');
};
Traducir = function (name) {
    var r = {};
    console.log(name);
    console.log("tiene la propiedad", Config.Language[Config.LenguajeApp]);

//    console.log("tiene la propiedad", Config.Language[Config.LenguajeApp].hasOwnProperty(name));
    try {
        r = Config.Language[Config.LenguajeApp][name];
        if (r === undefined) r = name;
        return r;
    } catch (e) {
        console.log(e);
        return name;
    }

}
//GetSettingXml = function (label) {
//    var xmlDoc = loadXMLDoc("config.xml");
//    console.log(xmlDoc);
//    x = xmlDoc.getElementsByTagName(label);
//    return x[0].childNodes[0].nodeValue;
//    //for (i = 0; i < x.length; i++) {
//    //    console.log(x[i].childNodes[0].nodeValue);
//    //    console.log("<br>");
//    //}
//}

function Display () {
    this.vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    this.vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.deviceType = "";
    if(this.vw < 480) {
        this.deviceType = "mobile-mini";
    } else {
        if(this.vw < 769) {
            this.deviceType = "mobile";
        } else {
            if(this.vw < 1200) {
                this.deviceType = "tablet";
            } else {
                this.deviceType = "retina";
            }
        }
    }
}

function loadIframeApoint() {
    console.log("iframe cargado :", Config.IframeLoaded);
    if (!Config.IframeLoaded) {
        Config.IframeLoaded = true;
        var url;
        if (Config.wsSettings !== undefined && Config.wsSettings !== null) {
            if (Config.wsSettings.appointments !== undefined && Config.wsSettings.appointments !== null) {
                if (Config.wsSettings.appointments.url !== undefined && Config.wsSettings.appointments.url !== null) {
                    url = Config.wsSettings.appointments.url;
                    var themeInfo = Repository.GetItem("ThemeInfo");
                    if (themeInfo != 0) {
                        console.log(themeInfo);
                        themeInfo = $.parseJSON(themeInfo);
                        url += "&primaryColor=" + themeInfo.primaryColor + "&secondaryColor=" + themeInfo.secondaryColor;
                    }
                    url += "&make=" + "84" + "&model=" + "31595" + "&year=" + "2014";
                } else {
                    Config.Apoint365 = "0";
                }
            } else {
                Config.Apoint365 = "0";
            }
        } else {
            Config.Apoint365 = "0";
        }
        Config.Apoint365 == "1" ?
          $("#contentApoint").append("<iframe src='" + url + "' style='width:99%; height:" + Config.Heigth + "px; border:0;' ></iframe>")
          : $("#formApoint").show();
    }

}

function addShadowBar() {
    var home = Parametros()[0].IsNullOrEmpty();
    if (!home) {
        if (Parametros()[0] === "Parts" || Parametros()[0] === "inventory") {
            $(".type-switcher").addClass("sombraBarra");
            $("#ActionBar").removeClass("sombraBarra");
        } else {
            $(".type-switcher").removeClass("sombraBarra");
            $("#ActionBar").addClass("sombraBarra");
        }
    }

}

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i]
           && arr[i].hasOwnProperty(attr)
           && (arguments.length > 2 && arr[i][attr] === value ) ){

           arr.splice(i,1);

       }
    }
    return arr;
}
Array.prototype.max = function (s) {
    s = s || DefaultSelector;
    var l = this.length;
    var max = s(this[0]);
    while (l-- > 0)
        if (s(this[l]) > max) max = s(this[l]);
    return max;
};
Array.prototype.min = function (s) {
    s = s || DefaultSelector;
    var l = this.length;
    var min = s(this[0]);
    while (l-- > 0)
        if (s(this[l]) < min) min = s(this[l]);
    return min;
};
Config.prototype = new Base;
window.display = new Display();

/*************************************************************************/
/*bind button menu*/
var _menu = $("#Menu").hide();
var _doc = $("html");
_doc.find("body").css("min-height", $(window).height() + "px");
var _icon = $("#iconMenuNew").click(function () {
    console.log($(this).attr("data"));
    if ($(this).attr("data") == "true") {
        HideMenu();
    } else {
        ShowMenu();

    }
});

function HideMenu() {
    console.log("oculta el menu");
    _doc.css("overflow", "auto");
    _menu.removeClass();
    _menu.attr('class', "pt-page-moveToLeftEasing menu");
    _icon.attr("data", "false");
    _doc.unbind("click.menu");
}

function ShowMenu() {
    _doc.css("overflow", "hidden");
    _menu.removeClass().scrollTop(0);
    _menu.find(".content").scrollTop(0);
    _menu.attr('class', "pt-page-moveFromLeft menu");
    _icon.attr("data", "true");
    $(".menu").show();
    setTimeout(function () {
        _doc.unbind("click.menu").one('click.menu', function () {
            // Hide the menus
            HideMenu();
        });
    }, 500);


}
if(Config.Platform !== "") {
    if(Config.Platform.toLowerCase().indexOf("ios") === -1) {
        //No es iOS
        new Hammer(document.body).on("swiperight panright", function(ev) {
            console.log("SWIPE / PAN right on Body");
            ShowMenu();
        });
        new Hammer(_menu.get(0)).on("swipeleft", function(ev) {
            console.log("SWIPE / PAN left on Menu");
            HideMenu();
        });
    }
} else {
    //document.addEventListener('deviceready', this.onDeviceReady, false);
}
/*********************************************************************************/
