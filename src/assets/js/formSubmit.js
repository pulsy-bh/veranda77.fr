jQuery(document).ready(function ($) {
  var successMessage = `<i class="fa fa-info-circle"></i><b class="success-message">Succès:</b> Votre demande est envoyée avec succès`;
  var ErrorMessage = `<i class="fa fa-info-circle"></i><b class="error-message">Erreur:</b> Veuillez vérifier vos données d'entrée`;

  $("#contactForm").on("submit", function (e) {
    sendFormData(e, "#contactForm", "contact");
  });

  $("#contactFormAccueil").on("submit", function (e) {
    sendFormData(e, "#contactFormAccueil", "contact");
  });

  $("#devisForm").on("submit", function (e) {
    sendFormData(e, "#devisForm", "devis");
  });

  $("#particulier").on("submit", function (e) {
    sendFormData(e, "#particulier", "devis");
  });

  $("#professional").on("submit", function (e) {
    sendFormData(e, "#professional", "devis");
  });

  function sendFormData(e, id, type) {
    e.preventDefault();
    
    var captchaContainer = $(id).find('.g-recaptcha')[0];
    var captchaResponse = '';
    
    if (captchaContainer && window.captchaWidgets && window.captchaWidgets[captchaContainer.id]) {
      captchaResponse = grecaptcha.getResponse(window.captchaWidgets[captchaContainer.id]);
    } else {
      captchaResponse = grecaptcha.getResponse();
    }
    
    if (captchaResponse.length == 0) {
      alert("Veuillez vérifier le reCAPTCHA");
      return false;
    }
    
    var formData = $(id).serialize();
    
    $.ajax({
      url: $(id)[0]["action"],
      type: "POST",
      data: formData,
      datatype: "json",
      success: function (data, response, message) {
        console.log("Succès:", data);
        if (type === "contact") {
          e.target.querySelector("#contact-form-response").classList.add("success");
          e.target.querySelector(
            "#contact-form-response"
          ).innerHTML = successMessage;
          window.location.href="/message-envoye";
        }
        if (type === "devis"){
        e.target.querySelector("#devis-form-response").classList.add("success");
        e.target.querySelector(
          "#devis-form-response"
        ).innerHTML = successMessage;
        }
        window.location.href="/message-envoye";  
        localStorage.removeItem('calc_list');
                localStorage.removeItem('calc_volume');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Erreur AJAX:", jqXHR.status, jqXHR.responseText);
        if (type === "contact") {
          e.target.querySelector("#contact-form-response").classList.add("error");
          e.target.querySelector(
            "#contact-form-response"
          ).innerHTML = ErrorMessage;
        }
        if (type === "devis") {
          e.target.querySelector("#devis-form-response").classList.add("error");
          e.target.querySelector(
            "#devis-form-response"
          ).innerHTML = ErrorMessage;
          console.log(textStatus);
        }
      },
    });
  }
  // $("#clone_g_re_captcha").html($("#g_re_captcha").clone(true, true));
  $("#contact-form").prop("disabled", true);
});

var CaptchaCallback = function () {
  var captchaWidgets = {};
  var index = 0;
  
  jQuery(".g-recaptcha").each(function () {
    if (!this.id) {
      this.id = 'recaptcha-' + index;
    }
    
    var widgetId = grecaptcha.render(this, {
      sitekey: "6LfBQIorAAAAAEoLhrNSRUOQEqOW3o7s9jBjDaW0",
      callback: correctCaptcha,
    });
    
    captchaWidgets[this.id] = widgetId;
    window.captchaWidgets = captchaWidgets;
    
    index++;
  });
};

function correctCaptcha() {
  if (grecaptcha === undefined) {
    return;
  }
  console.log(grecaptcha.getResponse());
  document.querySelectorAll(".g-recaptcha").forEach((checkbox) => {
    checkbox.classList.add("hidden");
  });
  document.querySelectorAll(".form-submit").forEach((button) => {
    button.innerHTML = "Envoyer";
    button.disabled = false
  });
}