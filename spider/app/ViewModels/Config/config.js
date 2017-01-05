var Config = {
    GetUrlApi: function() {
       //return "http://backend.10.0.0.6.xip.io/";
      // return "http://backend.10.0.0.6.xip.io/";
       //return "http://dapp.10.0.0.112.xip.io:8080/";
        return "http://localhost:61907";
    },
    InUse: false,
    gMapsLoaded: false,
    UrlApi: {
        Branch: { Local: "json/data/branch.json", Dev: "/Branch/all?token=" },
        Contact: { Local: "", Dev: "<%api%>/Contact?token=" },
        InventoryAll: { Local: "json/data/vehicle.json", Dev: "/Vehicle?token=" },
        Inventory: { Local: "/products", Dev: "/products?token=" },
        motos: { Local: "json/data/motos.json", Dev: "/Vehicle/starred?token=" },
        detodo: { Local: "json/data/detodo.json", Dev: "/Vehicle/starred?token=" },
        InventoryById: { Local: "json/data/vehicle.json", Dev: "/Vehicle/<%params%>?token=" },
        SearchInventory: { Local: "json/data/vehicle.json", Dev: "/Vehicle?token=" },
        SearchInventoryByNumber: { Local: "json/data/vehicle.json", Dev: "/Vehicle/number/<%params%>?token=" },
        Location: { Local: "json/data/location.json", Dev: "/Location?token=" },
        Offerts: { Local: "json/data/Offer.json", Dev: "/Offer?token=" },
        News: { Local: "json/data/news.json", Dev: "/News?token=" },
        PostMessage: { Local: "json/data/Messages.json", Dev: "/Message?token=" },
        Message: { Local: "json/data/Messages.json", Dev: "/Message/device/<%params%>?token=" },
        Conversation: { Local: "json/data/Messages.json", Dev: "/Message/<%params%>?device=<%IdDevice%>&token=" },
        Apoint: { Local: "json/data/Messages.json", Dev: "/Apoint/<%params%>?token=" },
        Login: { Local: "json/data/Messages.json", Dev: "/login" },
        Settings: { Local: "json/data/config.json", Dev: "/Settings?token=" },
        CurrentAccount: { Local: "json/data/CurrentAccount.json", Dev: "/current-account?token=" },
        Parts: { Local: "json/data/Parts.json", Dev: "/Part?token=" },
        PartStarred: { Local: "json/data/Parts.json", Dev: "/Part/starred?token=" },
        CategoryParts: { Local: "", Dev: "/Category?token=" },
      //  SearchParts: { Local: "json/data/vehicle.json", Dev: "/Part/<%params%>?token=" },
        //SearchParts: { Local: "json/data/vehicle.json", Dev: "/SearchPartPaged/<%params%>/<%page%>?token=" },
        SearchParts: { Local: "json/data/vehicle.json", Dev: "/SearchPartPaged/<%params%>/<%Page%>?token=" },
        MyCars: { Local: "json/data/MyCar.json", Dev: "/Part?token=" },
        Devices: { Local: "json/data/MyCar.json", Dev: "/Device?token=" },
        Device: { Local: "json/data/MyCar.json", Dev: "/Device/<%params%>?token=" },
        Social: { Local: "json/data/social.json", Dev: "/SocialNetwork?token=" },
        RegistCustomer: { Local: "", Dev: "/Customer?token="  },
        Customer: { Local: "", Dev: "/Customer/<%params%>?token=" },
        User: { Local: "", Dev: "/User?token=" },
        CurrentCustomer: { Local: "", Dev: "/current-customer?token=" },
        VehicleHistory: { Local: "json/data/VehicleHistory.json", Dev: "/vehicle-history/<%params%>?token=" },
        ViewedMessage: { Local: "", Dev: "viewed?token=" },
        AllMakesNModels: { Local: "json/data/mm-genericos.json", Dev: "json/data/mm-genericos.json" },
        AllMakesNModelsMachines: { Local: "json/data/mm-maquinarias.json", Dev: "json/data/mm-maquinarias.json" },
        ThemeInfo: { Local: "css/Themes/<%theme_name%>.json", Dev: "css/Themes/<%theme_name%>.json" },
        PartsOrder: { Local: "", Dev: "/PartsOrder?token=" },
        MyOrder: { Local: "", Dev: "/order?token=" },
        Terms: { Local: "", Dev: "/Terms?token=" },
        Cart: { Local: "", Dev: "/Cart?token=" }
    },
    server: ["Dev", "Dev"],
    theme: [
        "Blue",
        "Red",
        "Dark",
        /*"BlueVader", */
        /*"Green", */
        /*"RedLight", */
        "Yellow",
        /*"Black",*/
        /*"RedVader", */
        "JDGreen",
        /*"JDYellow", */
        "purpleP",
        "purpleVW",
        "orange"
    ],
    Template: ["lista", "damero", "damerosolid"],
    Context: function() {
        return this.server[1];
    },
    Platform: "",
    CurrentTemplate: "",
    //IdDevice: Repository.GetItem("IdDevice"),
    IdDevice: 0,
    ResourceLoaded:false,
    OnLine: false,
    ActiveKeyboard: false,
    IframeLoaded : false,
    timeout: 45000,
    EnabledLoading:false   ,
    NumberResultGlobal : 0,
    Currency: "$",
    decDelimiter: ".", thousandsDelimiter: ",",
    moneyFormat: null,
    User: {
        Logued: false,
        Token: 0,
        Id: 0,
        email: "" ,
        name: "",
        idCustomer: 0
    },
    Language: {
    },
    History: "",
    LenguajeApp: "",
    Dealer: "",
    TransitionIn :"",
    TransitionOut: "",
    Logo: "res/icon/android/icon.png",
    usedContact: {}, newContact: {}, partsContact: {},
    offersContact: {},
    TokenApp: "",
   // UserApp: { username: GetSettingXml("username"), password: GetSettingXml("password"), remote: "true" , loginApp : "true"},
    UserApp: { username: "", password: "", remote: "true" , loginApp : "true"},
    Apoint365: 0,
    dealerName: "",
    dealerType: "",
    Heigth: "",
    Parametro: "",
    ImgNotAvailable: "img/not_available.jpg",
    ImgUser: "img/user.png"

};
//Config.prototype = new Base;

