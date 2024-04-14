import gsap from "gsap";

export const animatePageIn = (pathname) => {
  if (typeof window !== "undefined") {
    document.body.style.overflow = 'auto';
  }


  const bannerOne = document.getElementById("banner-1");
  const bannerTwo = document.getElementById("banner-2");
  const bannerThree = document.getElementById("banner-3");
  const bannerFour = document.getElementById("banner-4");
  if (pathname === "/") {
    return
  }

  if (bannerOne && bannerTwo && bannerThree && bannerFour) {
    const tl = gsap.timeline();

    tl.set([bannerOne, bannerTwo, bannerThree, bannerFour], {
      yPercent: 0,
    }).to([bannerOne, bannerTwo, bannerThree, bannerFour], {
      yPercent: 100,
      stagger: 0.2,
    });
  }
};

export const animatePageOut = (href, router) => {
  const bannerOne = document.getElementById("banner-1");
  const bannerTwo = document.getElementById("banner-2");
  const bannerThree = document.getElementById("banner-3");
  const bannerFour = document.getElementById("banner-4");

  const loadingScreen = document.getElementById("loading-screen");

  const tl = gsap.timeline();
  if (bannerOne && bannerTwo && bannerThree && bannerFour) {
    tl.set([bannerOne, bannerTwo, bannerThree, bannerFour], {
      yPercent: -100,
    }).to([bannerOne, bannerTwo, bannerThree, bannerFour], {
      yPercent: 0,
      stagger: 0.2,
      onComplete: () => {
        router.push(href);
      },
    });
  } else if (loadingScreen) {
    loadingScreen.style.display = "block";
    loadingScreen.childNodes[0].style.display = "none"
    tl.set(loadingScreen, {
      opacity: 0,
    }).to(loadingScreen, {
      opacity: 1,
      onComplete: () => {
        router.push(href);
      },
      duration: 0.5,
    });
  }
};
