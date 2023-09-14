/*-----------Navigation menu------------------- */
(() => {
  const hamBurgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = document.querySelector(".close-nav-menu");

  hamBurgerBtn.addEventListener("click", showNavMenu);
  closeNavBtn.addEventListener("click", hideNavMenu);

  function showNavMenu() {
    navMenu.classList.add("open");
    bodyScrollingToggle();
  }
  function hideNavMenu() {
    navMenu.classList.remove("open");
    fadeOutEffect();
    bodyScrollingToggle();
  }
  function fadeOutEffect() {
    document.querySelector(".fade-out-effect").classList.add("active");
    setTimeout(() => {
      document.querySelector(".fade-out-effect").classList.remove("active");
    }, 300);
  }
  //attach an event handler to document
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("link-item")) {
      /* make sure event.target.hash has a value before overridding default behavior */
      if (event.target.hash !== "") {
        //prevent default anchor behavior
        event.preventDefault();
        const hash = event.target.hash;
        //deactivate existing active 'section'
        document.querySelector(".section.active").classList.add("hide");
        document.querySelector(".section.active").classList.remove("active");
        //active new 'section'
        document.querySelector(hash).classList.add("active");
        document.querySelector(hash).classList.remove("hide");
        /* deactive existing active navigation menu */
        navMenu
          .querySelector(".active")
          .classList.add("outer-shadow", "hover-in-shadow");
        navMenu
          .querySelector(".active")
          .classList.remove("active", "inner-shadow");
        /* if clicked 'link-item is contained within the navigation meno' */
        if (navMenu.classList.contains("open")) {
          // activate new navigation menu 'link-item'
          event.target.classList.add("active", "inner-shadow");
          event.target.classList.remove("outer-shadow", "hover-in-shadow");
          // hide navigation menu
          hideNavMenu();
        } else {
          let navItem = navMenu.querySelectorAll(".link-item");
          navItem.forEach((item) => {
            if (hash === item.hash) {
              // activate new navigation menu 'link-item'
              item.classList.add("active", "inner-shadow");
              item.classList.remove("outer-shadow", "hover-in-shadow");
            }
          });
          fadeOutEffect();
        }
        //add hash (#) to url
        window.location.hash = hash;
      }
    }
  });
})();
//--------About section tabs-----------

(() => {
  const aboutSection = document.querySelector(".about-section"),
    tabsContainer = document.querySelector(".about-tabs");

  tabsContainer.addEventListener("click", (event) => {
    /**if event.target contains 'tab-item' clas and not contains 'active' class */
    if (
      event.target.classList.contains("tab-item") &&
      !event.target.classList.contains("active")
    ) {
      const target = event.target.getAttribute("data-target");
      //deactive existing active 'tab-item'
      tabsContainer
        .querySelector(".active")
        .classList.remove("outer-shadow", "active");
      // active new 'tab-item'
      event.target.classList.add("active", "outer-shadow");
      //deactive existing active 'tab-content'
      aboutSection
        .querySelector(".tab-content.active")
        .classList.remove("active");
      // active new 'tab-content'
      aboutSection.querySelector(target).classList.add("active");
    }
  });
})();

function bodyScrollingToggle() {
  document.body.classList.toggle("hidden-scrolling");
}
/*-----------Portfolio filter and popup----------------*/

(() => {
  const filterCotainer = document.querySelector(".portfolio-filter"),
    portfolioItemContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    popup = document.querySelector(".portfolio-popup"),
    prevBtn = popup.querySelector(".pp-prev"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectBetailsBtn = popup.querySelector(".pp-project-details-btn");
  let itemIndex, slideIndex, screenshorts;
  /*---Filter portfolio item-- */
  filterCotainer.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("filter-item") &&
      !event.target.classList.contains("active")
    ) {
      //deactive existing active 'filter-item'
      filterCotainer
        .querySelector(".active")
        .classList.remove("outer-shadow", "active");
      //activate new filter item
      event.target.classList.add("active", "outer-shadow");
      const target = event.target.getAttribute("data-target");
      portfolioItems.forEach((item) => {
        if (target === item.getAttribute("data-category") || target === "all") {
          item.classList.remove("hide");
          item.classList.add("show");
        } else {
          item.classList.remove("show");
          item.classList.add("hide");
        }
      });
    }
  });
  portfolioItemContainer.addEventListener("click", (event) => {
    if (event.target.closest(".portfolio-item-inner")) {
      const portfolioItem = event.target.closest(
        ".portfolio-item-inner"
      ).parentElement;
      //get the portfolioItem index
      itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(
        portfolioItem
      );
      screenshorts = portfolioItems[itemIndex]
        .querySelector(".portfolio-item-img img")
        .getAttribute("data-sreenshorts");
      //convert screenshorts into array
      screenshorts = screenshorts.split(",");
      if (screenshorts.length === 1) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
      } else {
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
      }
      slideIndex = 0;
      popupToggle();
      popupSliderShow();
      popupDetails();
    }
  });
  closeBtn.addEventListener("click", () => {
    popupToggle();
    if (projectDetailsContainer.classList.contains("active")) {
      popupDetailsToggle();
    }
  });
  function popupToggle() {
    popup.classList.toggle("open");
    bodyScrollingToggle();
  }
  function popupSliderShow() {
    const imgSrc = screenshorts[slideIndex];
    const popupImg = popup.querySelector(".pp-img");
    /*activate loader until the popupimg loader*/
    popup.querySelector(".pp-loader").classList.add("active");
    popupImg.src = imgSrc;
    popupImg.onload = () => {
      //deactive loader after the popupimg loaded
      popup.querySelector(".pp-loader").classList.remove("active");
    };
    popup.querySelector(".pp-counter").innerHTML =
      slideIndex + 1 + " of " + screenshorts.length;
  }
  // next slide
  nextBtn.addEventListener("click", () => {
    if (slideIndex === screenshorts.length - 1) {
      slideIndex = 0;
    } else {
      slideIndex++;
    }
    popupSliderShow();
  });
  // prev slide
  prevBtn.addEventListener("click", () => {
    if (slideIndex === 0) {
      slideIndex = screenshorts.length - 1;
    } else {
      slideIndex--;
    }
    popupSliderShow();
  });

  function popupDetails() {
    // if portfolio-item-details not exist
    if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
      projectBetailsBtn.style.display = "none";
      return; /* end functin execution */
    }
    projectBetailsBtn.style.display = "block";

    // get the project details
    const details = portfolioItems[itemIndex].querySelector(
      ".portfolio-item-details"
    ).innerHTML;
    //set the project details
    popup.querySelector(".pp-project-details").innerHTML = details;
    //get the project title
    const title = portfolioItems[itemIndex].querySelector(
      ".portfolio-item-title"
    ).innerHTML;
    //set the project title
    popup.querySelector(".pp-title h2").innerHTML = title;
    //get the project category
    const category = portfolioItems[itemIndex].getAttribute("data-category");
    //set the project category
    popup.querySelector(".pp-project-category").innerHTML = category
      .split("-")
      .join("");
  }

  projectBetailsBtn.addEventListener("click", () => {
    popupDetailsToggle();
  });
  function popupDetailsToggle() {
    if (projectDetailsContainer.classList.contains("active")) {
      projectBetailsBtn.querySelector("i").classList.remove("fa-minus");
      projectBetailsBtn.querySelector("i").classList.add("fa-plus");
      projectDetailsContainer.classList.remove("active");
      projectDetailsContainer.style.maxHeight = 0 + "px";
    } else {
      projectBetailsBtn.querySelector("i").classList.remove("fa-plus");
      projectBetailsBtn.querySelector("i").classList.add("fa-minus");
      projectDetailsContainer.classList.add("active");
      projectDetailsContainer.style.maxHeight =
        projectDetailsContainer.scrollHeight + "px";
      popup.scrollTo(0, projectDetailsContainer.ofsetTop);
    }
  }
})();

/*--------------- Testimonial slider------------ */
(() => {
  const sliderContainer = document.querySelector(".testi-slider-container");
  slides = sliderContainer.querySelectorAll(".testi-item");
  slideWidth = sliderContainer.offsetWidth;
  (prevBtn = document.querySelector(".testi-slider-nav .prev")),
    (nextBtn = document.querySelector(".testi-slider-nav .next"));
  activeSlide = sliderContainer.querySelector(".testi-item.active");
  let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(
    activeSlide
  );
  //set width of all slides
  slides.forEach((slide) => {
    slide.style.width = slideWidth + "px";
  });
  //set width of slideContainer
  sliderContainer.style.width = slideWidth * slides.length + "px";

  nextBtn.addEventListener("click", () => {
    if (slideIndex === slides.length - 1) {
      slideIndex = 0;
    } else {
      slideIndex++;
    }
    slider();
  });
  prevBtn.addEventListener("click", () => {
    if (slideIndex === 0) {
      slideIndex = slides.length - 1;
    } else {
      slideIndex--;
    }
    slider();
  });
  function slider() {
    //deactive existing activeSlides
    sliderContainer
      .querySelector(".testi-item.active")
      .classList.remove("active");
    //activate new slide
    slides[slideIndex].classList.add("active");
    sliderContainer.style.marginLeft = -(slideWidth * slideIndex) + "px";
  }
  slider();
})();

/*-------------hide all section except active------------------ */

(() => {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    if (!section.classList.contains("active")) {
      section.classList.add("active");
    }
  });
})();

window.addEventListener("load", () => {
  // preloader
  document.querySelector(".preloader").classList.add("fade-out");
  setTimeout(() => {
    document.querySelector(".preloader").style.display = "none";
  }, 600);
});
