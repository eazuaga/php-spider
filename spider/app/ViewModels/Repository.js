var Repository = (function () {
    var Get = function (name) {
        if (localStorage.getItem(name) != null) {
            console.log(name + "estan en el localstorage");
            return  ; /*solo lo llama para verificar q este cargado : mejorar*/
        }
        else {
            console.log(name + "ajax");
            ajaxCallBack(name);
        }
    };
    var displayLoad = function (show) {
        if (Config.EnabledLoading) {
            if (show) {
                device.platform === "Win32" ? $("#loader").show() : spinnerplugin.show();
            }
            else {
                device.platform === "Win32" ? $("#loader").hide() : spinnerplugin.hide();
            }
        }


    }
    var DisplaySplash = function (show) {
        if (device.platform === "Win32" || !navigator.splashscreen) {
            $("#loader").show();
        } else {
            show ? navigator.splashscreen.show() : navigator.splashscreen.hide();
        }

    };
    /*version 3.0*/
    var GetCallBack = function (name, callback, last, params,page) {
        var lastInfo = last || false;
        console.log("last info : " + lastInfo);
        if (!Config.OnLine) {
            lastInfo = false;
        }
        lastInfo === false ? (GetItem(name) !== 0 ? ProcessCallBack(name ,callback, GetItem(name)) : ajaxCallBack(name, callback, params,"GET",page)) :
        ajaxCallBack(name, callback, params,"GET",page);
    };
    var ajaxCallBack = function (name, callback, params, type,page) {
        console.log("ajaxCallBack nombre de url :" + name);
        console.log("params:", params);
        var url = Url(name, params,page);
        var Type = type || "GET";
        var CallBack = callback || false;
        var d = new Date();
        var s = d.getUTCSeconds();
        var params = { cache : s}
        console.log("peticion en "+url);
        var t = $.ajax({
            beforeSend: function () { displayLoad(true); },
            url: url,
            type: Type,
            dataType: "json",
           // data: params,
            success: function (json) {
            },
            complete: function (jqXHR, status) {
                //$("#loader").hide();
                displayLoad(false);
                //console.log(jqXHR.getResponseHeader());
             //   console.log(t.getAllResponseHeaders());
              //  console.log("search token", jqXHR.getAllResponseHeaders());
                //$(".base").show();
                var json = jqXHR.responseText;
                CallBack == false ? SetLocalStorage(name, json) : ProcessCallBack(name, callback, json);
            }
        });
    };
    var updateInfo = function (name) {
        var ajax = $.ajax({
            url: url, dataType: 'json',
        });
        ajax.done(function (json) {
            //Refresco el localstorage
            localStorage.setItem(name, JSON.stringify(json));
        });
        ajax.fail(function() {
            alert("error");
        });
    };
    var Send = function (name, params) {
        var url = Url(name, params);
        var ajax = $.ajax({type: "POST", url: url });
    };
    var SendPost2 = function (name, params) {
        var url = Url(name,false);
        var ajax = $.ajax({ type: "POST", url: url, data: params, headers: { "Accept": "application/json" } });
    };
    var Login = function ( params, callback,splash) {
        var url = Config.GetUrlApi() + "login";
        console.log(url);
        $(".base").hide();
        console.log("online mode repositort"+ Config.OnLine);
        splash ? DisplaySplash(true) : displayLoad(true);
        $.ajax({
            //beforeSend: function (splash) {

            //},
            url: url, type: 'POST', data: params,
            complete: function (jqXHR) {
                $(document).unbind("configReady");
                //$(".splash").hide();
                //navigator.splashscreen.hide()
                DisplaySplash(false);
                displayLoad(false);
                $(".base").show();
                console.log(jqXHR.responseText);
                try {
                    var responseText = $.parseJSON(jqXHR.responseText);
                    callback(responseText);
                } catch (err) {
                    console.log(err.message);
                    OfflineMode();
                    Sync.Synchronize();
                }

            },
            timeout: Config.timeout,
            statusCode: {
                404: function () {
                    console.log("404");
                    //alert(Traducir("CouldNotConnect"));
                    $(document).bind("configReady", function (){
                        alert(Traducir("GeolocalizacionDisabled"));
                    });
                    OfflineMode();
                    Sync.Synchronize();
                },
                408: function () {
                    console.log("408");
                    $(document).bind("configReady", function (){
                        alert(Traducir("GeolocalizacionDisabled"));
                    });
                    OfflineMode();
                    Sync.Synchronize();
                },
                504: function () {
                    console.log("504");
                    $(document).bind("configReady", function () {
                        alert(Traducir("GeolocalizacionDisabled"));
                    });
                    OfflineMode();
                    Sync.Synchronize();
                },
                500: function () {
                    console.log("500");
                    $(document).bind("configReady", function () {
                        alert(Traducir("GeolocalizacionDisabled"));
                    });
                    OfflineMode();
                    Sync.Synchronize();
                },
                error: function (jqXHR, textStatus) {
                    console.log("error");
                    alert(textStatus);
                    OfflineMode();
                    Sync.Synchronize();
                }
            }
        }).fail(function (jqXHR, textStatus) {
            if (textStatus == 'timeout') {
               console.log("timeout");
                $(document).bind("configReady", function (){
                    alert(Traducir("GeolocalizacionDisabled"));
                });
                OfflineMode();
                Sync.Synchronize();
                //do something. Try again perhaps?
            }
        });
    };
    var GetJsonLocal = function (url,key) {
        //  var url = UrlApi[url].local;
        console.log(url);
        $.ajax({
            url: url, complete: function (jqXHR) {
                var responseText = jqXHR.responseText;
                SetLocalStorage(key,responseText);
                return responseText;
            }
        });
    }
    var SendPost = function (name, params, callback) {
        var url = Url(name,false);
        console.log(url);
        $.ajax({
            headers: { 'Accept': 'application/json' },
            beforeSend: function () { displayLoad(true); },
            url: url,
            type: 'POST',
            data: params,
            complete: function (jqXHR) {
                //$("#loader").hide();
                displayLoad(false);
                console.log(jqXHR.responseText);
                var responseText = $.parseJSON(jqXHR.responseText);
                callback(responseText);
            }
        });
    };
    GetFromLocalStorage = function (key, value, callBack) {
        console.log("LocalStorage", key, localStorage.getItem(key));
        if (localStorage.getItem(key) == null) {
            localStorage.setItem(key, value);
            callBack();
        }
    };
    GetFromLocalStorage2 = function (key, value, callBack) {
        if (localStorage.getItem(key) == null) {
            // localStorage.setItem(key, value);
            callBack();
        }
    };
    SetLocalStorage = function (key, value) {
        //localStorage.setItem(key, JSON.stringify(value));
        localStorage.setItem(key, value);
    };
    IsLogued = function () {
        return localStorage.getItem("user") != null;
    };
    RemoveLogued = function () {
        localStorage.removeItem("user");
    }
    GetItem = function (key) {
        var value;
        console.log("Get from local storage  key : " + key);
        //value = localStorage.getItem(key) != null ? $.parseJSON(localStorage.getItem(key)) : 0;
        value = localStorage.getItem(key) != null ? localStorage.getItem(key) : 0;
        return value;

    };
    ProcessCallBack = function (key, callback, json) {
        var Json = $.parseJSON(json);
        SetLocalStorage(key, json);
        callback(Json);
    };
    GetWithParams = function (name, params, callback) {
        var url = Url(name);
        var ajax = $.ajax({
            beforeSend: function () { displayLoad(true); }, url: url, type: 'GET', data: params,
            complete: function (jqXHR) {
                displayLoad(false);
                var responseText = $.parseJSON(jqXHR.responseText);
                SetLocalStorage(name, JSON.stringify(responseText))
                callback(responseText);
            }
        });
    };
    GetForUserLogueds = function (args) {
        options = $.extend({ name: 'active', params: null, callback: function(){}}, args);
        var url = UrlLogued(options.name, options.params);
        var ajax = $.ajax({
            beforeSend: function () { displayLoad(true); }, url: url, type: 'GET', data: options.params,
            complete: function (jqXHR) {

                var responseText = $.parseJSON(jqXHR.responseText);
                SetLocalStorage(options.name, JSON.stringify(responseText));
                options.callback(responseText);
            }
        });
        ajax.always(function () { displayLoad(false); });
    };
    PostForUserLogueds = function (args) {
        console.log("usuario logueago",Config.User.Token !== 0); 
        if (Config.User.Token !== 0) {
            options = $.extend({ name: 'active', params: null, callback: function() {} }, args);
            var url = UrlLogued(options.name);
            var ajax = $.ajax({
                beforeSend: function() { displayLoad(true); },
                url: url,
                type: 'POST',
                data: options.params,
                complete: function(jqXHR) {
                    displayLoad(false);
                    var responseText = $.parseJSON(jqXHR.responseText);
                    //SetLocalStorage(options.name, JSON.stringify(responseText))
                    options.callback(responseText);
                }
            });
        } else {
            alert(Traducir("NeedLogued"));
        }
    };
    Del = function (args) {
        console.log("enrta a delete");
        options = $.extend({ name: 'active', params: null, callback: function () { } }, args);
        var url = Url(options.name,options.params);
        console.log("url del delete : " + url);

        var ajax = $.ajax({
            beforeSend: function () { $("#loader").show(); }, url: url, type: 'DELETE', data: options.params,
            complete: function (jqXHR) {
                $("#loader").hide();
                // var responseText = $.parseJSON(jqXHR.responseText);
                options.callback();
            }
        });
    };
    SavePending = function (obj) {
        console.log(obj);
        var pendings = [];
        var pend = GetItem("Pending");

        //pend != 0 ? pendings.push($.parseJSON(pend)) : false;
        if (pend != 0) {
            $.each($.parseJSON(pend), function (index, value) {
                console.log(obj.key);
                console.log(value.key);
                obj.key != value.key ? pendings.push(value) : false;
            });
        }
            console.log(pendings);
            pendings.push(obj);
            console.log(pendings);
            SetLocalStorage("Pending", JSON.stringify(pendings));
        //obj.callback();
    };
    ProcessBach = function () {
        var pend = GetItem("Pending");
        if (pend != 0) {
            $.each($.parseJSON(pend), function (index, value) {
                console.log(value.key);
                console.log(value.obj);
                console.log(value.callback);
                value.hasOwnProperty('callback') ? SendPost(value.key, value.obj, function (json) { bachRegister.execute(value.callback, json) }) : SendPost2(value.key, value.obj);
            });
            SetLocalStorage("Pending", "");
        }


    }
    var appendArrayLocalStorage = function(obj ,key) {
        var array = GetItem(key);
        var collections = [];
        //pend != 0 ? pendings.push($.parseJSON(pend)) : false;
        if (array !== 0) {
            $.each($.parseJSON(array), function (index, value) {
                 collections.push(value) ;
            });

        }
     //   collections.push(obj);
        collections.unshift(obj);
       // collections.reverse();
        console.log(collections);
        SetLocalStorage(key, JSON.stringify(collections));
    };
    return {
        GetItem: function(key) {
            return GetItem(key);
        },
        Get: function(name) {
            return Get(name);
        },
        UpdateInformation: function(name) {
            return updateInfo(name);
        },
        Send: function(name, params) {
            return Send(name, params);
        },
        SendPost2: function(name, params) {
            return SendPost2(name, params);
        },
        Login: function(params, callback, splash) {
            return Login(params, callback, splash);
        },
        GetFromLocalStorage: function(key, value, callBack) {
            return GetFromLocalStorage(key, value, callBack);
        },
        GetFromLocalStorage2: function(key, value, callBack) {
            return GetFromLocalStorage2(key, value, callBack);
        },

        /*GetFromLocalStorage2*/
        SetLocalStorage: function(key, value) {
            return SetLocalStorage(key, value);
        },
        IsLogued: function() {
            return IsLogued();
        },
        RemoveLogued: function() {
            RemoveLogued();
        },
        GetCallBack: function(name, callback, last, params,page) {
            return GetCallBack(name, callback, last, params,page);
        },

        SendPost: function(url, params, callback) {
            return SendPost(url, params, callback);
        },
        GetWithParams: function(url, params, callback) {
            return GetWithParams(url, params, callback);
        },
        GetForUserLogueds: function(arg) {
            return GetForUserLogueds(arg);
        },
        Del: function(arg) {
            return Del(arg);
        },
        displayLoad: function(v) {
            return displayLoad(v);
        },
        GetJsonLocal: function(url, key) {
            return GetJsonLocal(url, key);
        },
        SavePending: function(obj) {
            return SavePending(obj);
        },
        ProcessBach: function() {
            return ProcessBach();
        },
        PostForUserLogueds: function(arg) {
            return PostForUserLogueds(arg);
        },
        appendArrayLocalStorage: function(obj, key) {
            return appendArrayLocalStorage(obj , key);
        }
    };
})()
