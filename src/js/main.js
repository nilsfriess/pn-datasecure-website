$("body").removeClass("noscript");
$("#contact").show();

let navbarIsOpen = false;
const $main = $("main");

let currentSiteName = "home";

let contactInitialized = false;

// ########################################
// Helper Functions

const closeNavbar = () => {
  navbarIsOpen = false;
  $("header").removeClass("navbarOpened");
};

const loadPageToMain = sitename => {
  if (sitename === "home") sitename = "index";

  if (sitename !== "contact") {
    $main.load(sitename + ".html main>*", () => {
      console.log(sitename, "loaded");

      $(".icon-section").on("click", function () {
        $(".vorteile-container").css("left", "-100vw");
      });
    });
  } else {
    $main.load("index.html main>*", () => {
      // Scroll to Contact and init contact form
      scrollToContact();
      setupContactForm();

      console.log(sitename, "loaded");
    });
  }
};

const setPageTitle = title => {
  const titleName = "PN DataSecure - ";

  switch (title) {
    case "home":
    case "contact":
      document.title = titleName + "Über uns";
      break;
    case "impressum":
      document.title = titleName + "Impressum";
      break;
    case "datenschutz":
      document.title = titleName + "Datenschutzerklärung";
      break;
    default:
      document.title = titleName + "Über uns";
  }
};

const setNavbarActive = (newsitename, oldsitename) => {
  if (newsitename === oldsitename) {
    $("#home, #contact, #impressum, #datenschutz").removeClass("active");
    $("#" + newsitename).addClass("active");
    return;
  }

  $("#" + oldsitename).removeClass("active");
  $("#" + newsitename).addClass("active");
};

const scrollToTop = () => {
  $(window).scrollTop(0);
};

const scrollToTopSmooth = () => {
  $("html, body").animate(
    {
      scrollTop: 0
    },
    "slow"
  );
};

const extractPageName = href => {
  console.log("href extract", href);
  let newPage = href.substring(1);
  if (newPage.split("#")[1] === "contact") {
    newPage = "contact";
  } else {
    newPage = newPage.split(".")[0];
    if (newPage === "") {
      newPage = "home";
    }
  }

  return newPage;
};

const scrollToContact = () => {
  $("body, html").animate(
    {
      scrollTop: $(".kontakt-container").offset().top - 80
    },
    "slow"
  );
};

const setupContactForm = () => {
  console.log($("form"))
  $("form").off();

  console.log("initilizing contact form");
  $(".message-sent").hide();
  $(".message-error").hide();
  $(".checkmark").hide();
  $(".contact-status").hide();

  $("form").on("submit", () => {
    $(".kontakt-container .modal, .kontakt-container .overlay").addClass(
      "active"
    );

    const name = $("#name").val(),
      mail = $("#mail").val(),
      phone = $("#phone").val(),
      message = $("#message").val();

    $.ajax({
      type: "POST",
      url: "https://tun05kpnq5.execute-api.eu-west-1.amazonaws.com/Master",
      contentType: "application/json",
      data: JSON.stringify({
        name,
        mail,
        phone,
        message
      }),
      success: res => {
        console.log("mail sent");
        $(".message-status").hide();
        $(".modal .loader").hide();
        $(".modal .checkmark").show(200);
        $(".message-sent").show(200);

        setTimeout(() => {
          $(
            ".kontakt-container .modal, .kontakt-container .overlay"
          ).removeClass("active");
          $(".message-status").show();
          $(".modal .loader").show();
          $(".modal .checkmark").hide();
          $(".message-sent").hide();
          $("form").trigger("reset");
          $(".contact-status").show().text("Ihre Nachricht wurde gesendet");
        }, 3000);
      },
      error: err => {
        console.log("mail not sent");
        $(".message-status").hide();
        $(".modal .loader").hide();
        $(".message-error").show(200);

        setTimeout(() => {
          $(
            ".kontakt-container .modal, .kontakt-container .overlay"
          ).removeClass("active");
          $(".message-status").show();
          $(".modal .loader").show();
          $(".modal .checkmark").hide();
          $(".message-sent").hide();
          $(".contact-status").show().text("Beim Senden der Nachricht ist ein Fehler aufgetreten");

        }, 4000);
      }
    });

    return false;
  });

  contactInitialized = true;
};

// ########################################

// handle hamburger button
$(document).click(event => {
  if (navbarIsOpen) {
    closeNavbar();
  } else {
    // open navbar when clicked on hamburger
    if (
      $(event.target).hasClass("hamburger") ||
      $(event.target)
        .parent()
        .hasClass("hamburger")
    ) {
      navbarIsOpen = true;
      $("header").addClass("navbarOpened");
    }
  }
});

// ROUTING
$(".router-link").click(event => {
  closeNavbar();

  const href = $(event.target).attr("href");

  // convert <name>.html to <name>
  let newPage = extractPageName(href);

  if (newPage === currentSiteName) {
    if (newPage !== "contact") scrollToTopSmooth();
    else scrollToContact();
    return false;
  }

  // if (newPage === "home") {
  //   history.pushState({}, "", "/");
  // } else if (newPage === "contact") {
  //   history.pushState({}, "", "/#contact")
  // } else {
  //   history.pushState({}, "", newPage + ".html");
  // }

  history.pushState({}, "", href);

  if (newPage !== "contact") {
    if (currentSiteName === "contact" && newPage === "home")
      scrollToTopSmooth();

    scrollToTop();
  }

  loadPageToMain(newPage);
  setNavbarActive(newPage, currentSiteName);
  setPageTitle(newPage);

  currentSiteName = newPage;
  return false;
});

$(window).on("popstate, load", () => {
  currentSiteName = extractPageName(location.pathname);

  if (location.hash === "#contact") {
    currentSiteName = "contact";
  } else {
    scrollToTop();
  }

  console.log(currentSiteName);

  loadPageToMain(currentSiteName);
  setNavbarActive(currentSiteName, currentSiteName);
  setPageTitle(currentSiteName);
});


// vorteilehandler

// GLOBAL VARS
// let isOpen = false;
// let currentActive = "home";
// const $main = $("main");
// const scrollTime = 280;
// let contactInitialized = false;

// const loadPage = function(href, callback) {
//   if (href === "#" || href === "") {
//     href = "#home";
//   }

//   if (
//     href !== "#home" &&
//     href !== "#datenschutz" &&
//     href !== "#impressum" &&
//     href !== "#contact"
//   ) {
//     href = "#home";
//     console.log("404");
//   }

//   href = href.substr(1);

//   $main.load(href + ".html main>*", () => {
//     if (href === "home") {
//       console.log("Home loaded");
//       setupContactForm();
//     }

//     if (callback) callback();
//   });
//   setActive(href);
// };
// // handle internal links
// $(".router-link").click(function() {
//   let href = $(this).attr("href");

//   history.pushState({}, "", href);

//   if (isOpen) {
//     isOpen = false;
//     $("header").removeClass("navbarOpened");
//   }

//   const before = currentActive;

//   checkHref(href);

//   const after = currentActive;

//   if (
//     (before !== after && after !== "contact") ||
//     (before === after && $(window).scrollTop() !== 0)
//   )
//     scrollToTop();

//   return false;
// });

// $(window).on("popstate load", function() {
//   const href = location.hash;

//   checkHref(href);
// });

// const checkHref = href => {
//   if (href === "#contact") {
//     scrollToContact();
//     setupContactForm();
//   } else {
//     loadPage(href);
//   }
// };

// // close navbar if clicked anywhere
// $(document).click(event => {
//   if (isOpen) {
//     isOpen = false;
//     $("header").removeClass("navbarOpened");
//   } else {
//     // open navbar when clicked on hamburger
//     if (
//       $(event.target).hasClass("hamburger") ||
//       $(event.target)
//         .parent()
//         .hasClass("hamburger")
//     ) {
//       isOpen = true;
//       $("header").addClass("navbarOpened");
//     }
//   }
// });

// const scrollToContact = () => {
//   $("html,body").stop();
//   if (currentActive !== "home") {
//     loadPage("#home", () => {
//       $("html, body").animate(
//         {
//           scrollTop: $(".kontakt-container").offset().top - 80
//         },
//         1000
//       );
//     });
//   } else {
//     $("html, body").animate(
//       {
//         scrollTop: $(".kontakt-container").offset().top - 80
//       },
//       1000
//     );
//   }
//   setActive("contact");
// };

// const scrollToTop = () => {
//   $("html,body").stop();
//   $("html, body").animate(
//     {
//       scrollTop: 0
//     },
//     500
//   );
// };

// const setTitle = active => {
//   const titleName = "PN DataSecure - ";

//   switch (active) {
//     case "home":
//     case "contact":
//       document.title = titleName + "Über uns";
//       break;
//     case "impressum":
//       document.title = titleName + "Impressum";
//       break;
//     case "datenschutz":
//       document.title = titleName + "Datenschutzerklärung";
//       break;
//     default:
//       document.title = titleName + "Über uns";
//   }
// };

// const setupContactForm = () => {
//   console.log($("form"))
//   $("form").off();

//   console.log("initilizing contact form");
//   $(".message-sent").hide();
//   $(".message-error").hide();
//   $(".checkmark").hide();
//   $(".contact-status").hide();

//   $("form").on("submit", () => {
//     $(".kontakt-container .modal, .kontakt-container .overlay").addClass(
//       "active"
//     );

//     const name = $("#name").val(),
//       mail = $("#mail").val(),
//       phone = $("#phone").val(),
//       message = $("#message").val();

//     $.ajax({
//       type: "POST",
//       url: "https://tun05kpnq5.execute-api.eu-west-1.amazonaws.com/Master",
//       contentType: "application/json",
//       data: JSON.stringify({
//         name,
//         mail,
//         phone,
//         message
//       }),
//       success: res => {
//         console.log("mail sent");
//         $(".message-status").hide();
//         $(".modal .loader").hide();
//         $(".modal .checkmark").show(200);
//         $(".message-sent").show(200);

//         setTimeout(() => {
//           $(
//             ".kontakt-container .modal, .kontakt-container .overlay"
//           ).removeClass("active");
//           $(".message-status").show();
//           $(".modal .loader").show();
//           $(".modal .checkmark").hide();
//           $(".message-sent").hide();
//           $("form").trigger("reset");
//           $(".contact-status").show().text("Ihre Nachricht wurde gesendet");
//         }, 3000);
//       },
//       error: err => {
//         console.log("mail not sent");
//         $(".message-status").hide();
//         $(".modal .loader").hide();
//         $(".message-error").show(200);

//         setTimeout(() => {
//           $(
//             ".kontakt-container .modal, .kontakt-container .overlay"
//           ).removeClass("active");
//           $(".message-status").show();
//           $(".modal .loader").show();
//           $(".modal .checkmark").hide();
//           $(".message-sent").hide();
//           $(".contact-status").show().text("Beim Senden der Nachricht ist ein Fehler aufgetreten");

//         }, 4000);
//       }
//     });

//     return false;
//   });

//   contactInitialized = true;
// };

// loadPage("#home", () => {});
// CONTACT FORM
/* 

$(document).ready(() => {
  const $main = $("main");

  $(window).on("popstate", () => {
    loadPage(location.href, $main);
  })

  $(window).bind("mousewheel DOMMouseScroll wheel", () => {
    console.log("scrolling");
    if (currentActive === "impressum" || currentActive === "datenschutz")
      return;
    if (
      $(window).scrollTop() > $(".kontakt-container").offset().top - 80 ||
      $(window).scrollTop() + $(window).height() == $(document).height()
    ) {
      setActive("contact");
    } else {
      setActive("about");
    }
  });

  // close navbar if clicked anywhere
  $(document).click(event => {
    if (isOpen) {
      isOpen = false;
      $("header").removeClass("navbarOpened");
    } else {
      // open navbar when clicked on hamburger
      if (
        $(event.target).hasClass("hamburger") ||
        $(event.target)
          .parent()
          .hasClass("hamburger")
      ) {
        isOpen = true;
        $("header").addClass("navbarOpened");
      }
    }
  });

  // $("#about, .logo").click(() => {
  //   goTo("about");
  //   return false;
  // });

  // $("#contact").click(() => {
  //   goTo("contact");
  //   return false;
  // });

  // $("#impressum, .impressum-footer").click(() => {
  //   goTo("impressum");
  //   return false;
  // });

  // $("#datenschutz, .datenschutz-footer, .datenschutz-contact").click(() => {
  //   goTo("datenschutz");
  //   return false;
  // });

  $(".router-link").click(function() {
    let href = $(this).attr("href");
    console.log(href);
    history.pushState({}, "", href);

    if (href === "/") href = "home";

    loadPage(href, $main);

    if (isOpen) {
      isOpen = false;
      $("header").removeClass("navbarOpened");
    }
    return false;
  });

  // Contact-Form

  
});

*/
