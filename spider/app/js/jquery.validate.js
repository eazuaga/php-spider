(function(a){
a.fn.extend({
    validate: function(){
        this.each(function(){
            var $this = a(this);
            $this.blur(function () {
                $this.attr("requiredField") == "true" ? validateRequired($this) : console.log("no es required");
                $this.attr("emailvalid") == "true" ? validateEmail($this) : console.log("no lo es email");
                $this.attr("compareto") != undefined ? compare($this) : console.log("no compara");
            });
        });
        var validateRequired = function (obj) {
            (a.trim(obj.val()).length == 0) ? setMessageRequired(obj) : obj.attr("placeholder", "");
            return;
        }
        var validateEmail = function (obj) {
            (obj.val().indexOf('@', 0) == -1 || obj.val().indexOf('.', 0) == -1) ? setMessage(obj) : console.log("email correcto");
        }
        var setMessageRequired = function (obj) {
            obj.attr("placeholder", Traducir("Required"));
        //    $(obj).focus();
            return;
        }
        var setMessage = function (obj) {
            obj.val("");
            obj.attr("placeholder", Traducir("InvalidEmail"));
         //   obj.focus();
        }
        var compare = function (obj) {
            console.log("1 " + $(obj.attr("compareto")).val());
            console.log("2 " + obj.val());
            if ($("#" + obj.attr("compareto")).val() != obj.val()) {
                obj.val("");
                obj.attr("placeholder", Traducir("PasswordMustMatch"));
            }
            return;
        }
    }
});
})(jQuery);
$(function () {
    $("input").validate();
});
