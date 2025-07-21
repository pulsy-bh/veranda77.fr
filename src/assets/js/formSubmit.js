jQuery(document).ready(function ($) {
    var successMessage = `<i class="fa fa-info-circle"></i><b class="success-message">Succès:</b> Votre demande est envoyée avec succès`;
    var ErrorMessage = `<i class="fa fa-info-circle"></i><b class="error-message">Erreur:</b> Veuillez vérifier vos données d'entrée`;
    var checkbox = document.querySelector('input[name="condition"]');
    // var checkboxError = document.getElementById('checkboxError');
  
    $("#contactForm").on("submit", function (e) {
      sendFormData(e, "#contactForm", "contact");
    });
  
    $("#devisForm").on("submit", function (e) {
      sendFormData(e, "#devisForm", "devis");
    });
  
    function sendFormData(e, id, type) {
      e.preventDefault();
      
      // Vérification reCAPTCHA avec gestion d'erreur
      if (typeof grecaptcha === 'undefined' || grecaptcha.getResponse().length == 0) {
        alert("Veuillez vérifier le reCAPTCHA");
        return false;
      }

    //   if (!checkbox.checked) {
    //     checkboxError.textContent = "Le formulaire n'est pas envoyé tant que vous n'acceptez pas ce point";
    //     e.preventDefault(); 
    // } else {
    //     checkboxError.textContent = ''; 
    // }
  
      $.ajax({
        url: $(id)[0]["action"],
        type: "POST",
        data: $(id).serialize(),
        datatype: "json",
        success: function (data, response, message) {
          if (type === "contact") {
            // Afficher le message de succès
            var responseElement = e.target.querySelector("#contact-form-response");
            if (responseElement) {
              responseElement.classList.add("success");
              responseElement.innerHTML = successMessage;
            }
          }
          if (type === "devis"){
            var devisResponseElement = e.target.querySelector("#devis-form-response");
            if (devisResponseElement) {
              devisResponseElement.classList.add("success");
              devisResponseElement.innerHTML = successMessage;
            }
          }
          
          // Nettoyer le localStorage
          localStorage.removeItem('calc_list');
          localStorage.removeItem('calc_volume');
          
          // Redirection après un court délai
          setTimeout(function() {
            window.location.href="/message-envoye";
          }, 1000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("Erreur AJAX:", textStatus, errorThrown);
          
          if (type === "contact") {
            var responseElement = e.target.querySelector("#contact-form-response");
            if (responseElement) {
              responseElement.classList.add("error");
              responseElement.innerHTML = ErrorMessage;
            }
          }
          if (type === "devis") {
            var devisResponseElement = e.target.querySelector("#devis-form-response");
            if (devisResponseElement) {
              devisResponseElement.classList.add("error");
              devisResponseElement.innerHTML = ErrorMessage;
            }
          }
        },
      });
    }
    // $("#clone_g_re_captcha").html($("#g_re_captcha").clone(true, true));
    $("#contact-form").prop("disabled", true);
  });
  
  var CaptchaCallback = function () {
    jQuery(".g-recaptcha").each(function () {
      var sitekey = jQuery(this).data('sitekey');
      grecaptcha.render(this, {
        sitekey: sitekey,
        callback: correctCaptcha,
      });
    });
  };
  
  function correctCaptcha() {
    if (grecaptcha === undefined) {
      return;
    }
    document.querySelectorAll(".g-recaptcha").forEach((checkbox) => {
      checkbox.classList.add("hidden");
    });
    document.querySelectorAll(".form-submit").forEach((button) => {
      button.innerHTML = "Envoyer";
      button.disabled = false
    });
  }