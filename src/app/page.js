"use client";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import TransitionLink from "./components/TransitionLink";
import Footer from "./components/Footer";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import { AreaChart, CalendarCheck2, UsersRound } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Subscriptions from "./subscribe/subscriptions";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

// There's a definite need for robust volunteer management software for nonprofits. Here are some features you can consider including in your SaaS to make it stand out:

// Volunteer Management:

// Volunteer sign - up and database: Allow easy online volunteer registration with profiles, skills, and availability.
// Volunteer matching: Match volunteers with relevant opportunities based on skills and interests.
// Communication tools: Facilitate communication between volunteers and staff through email, messaging, and discussion boards.
// Onboarding and training materials: Provide a central location for onboarding documents, training videos, and resources for volunteers.
// Volunteer hour tracking: Track volunteer hours for reporting, recognition programs, and volunteer impact measurement.
// Scheduling and Events:

// Calendar management: Create and manage volunteer schedules with individual and group shifts.
// Event creation and promotion: Post volunteer opportunities(both one - time and ongoing) with descriptions, signup links, and location details.
// Volunteer scheduling for events: Allow volunteers to sign up for specific shifts or events that match their availability and skills.
// Task management: Assign specific tasks to volunteers within events or projects.
// Email and SMS reminders: Send automated reminders to volunteers about upcoming shifts and events.
// Additional Features:

// Reporting and analytics: Generate reports on volunteer activity, demographics, and program impact.
// Mobile app: Develop a mobile app for volunteers to access schedules, sign up for shifts, and track their hours.
//   Integrations: Integrate with donor management software or other nonprofit tools for a more unified system.
// Security and data privacy: Ensure secure storage of volunteer data and comply with relevant data privacy regulations.
// Here are some additional things to consider as you develop your SaaS:

// Pricing: Will you offer a freemium model, tiered pricing plans, or a flat fee ?
//   Ease of use: Make sure the platform is easy to learn and navigate for both staff and volunteers with varying technical skills.
// Customer support: Offer excellent customer support to help nonprofits get the most out of your platform.
// By focusing on these aspects, you can develop a valuable SaaS that helps nonprofits streamline volunteer management, improve volunteer engagement, and ultimately achieve their mission more effectively.

export default function Home() {
  const backgroundImage = useRef(null);

  const feature1 = useRef(null);
  const feature2 = useRef(null);
  const feature3 = useRef(null);

  const getStarted = useRef(null);

  const signUpHeading = useRef(null);
  const signUpText = useRef(null);
  const signUpBtn = useRef(null);

  const [loading, setLoading] = useState(true);

  const [loaded, setLoaded] = useState(false);

  const [pricing, setPricing] = useState("monthly");

  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
  }

  useLayoutEffect(() => {
    if (loaded) {
      stopLoading();
    } else {
    }
  }, [loaded]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top",
        end: "+=500px",
        scrub: true,
        markers: false,
      },
    });

    timeline
      .from(backgroundImage.current, { clipPath: "inset(15%)" })
      .to(backgroundImage.current, { clipPath: "inset(0%)" }, 0);

    const feature1Timeline = gsap.timeline({
      scrollTrigger: {
        trigger: feature1.current,
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
        markers: false,
      },
    });

    feature1Timeline
      .from(feature1.current, { x: -100, opacity: 0 })
      .to(feature1.current, {
        x: 0,
        opacity: 1,
      });

    const feature2Timeline = gsap.timeline({
      scrollTrigger: {
        trigger: feature2.current,
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
        markers: false,
      },
    });

    feature2Timeline
      .from(feature2.current, { x: 100, opacity: 0 })
      .to(feature2.current, { x: 0, opacity: 1 });

    const feature3Timeline = gsap.timeline({
      scrollTrigger: {
        trigger: feature3.current,
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
        markers: false,
      },
    });

    feature3Timeline
      .from(feature3.current, { x: -100, opacity: 0 })
      .to(feature3.current, { x: 0, opacity: 1 });

    const signUpHeadingTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: getStarted.current,
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
        markers: false,
      },
    });

    signUpHeadingTimeline
      .from(signUpHeading.current, { y: 100, opacity: 0 })
      .to(signUpHeading.current, { y: 0, opacity: 1 });

    const signUpTextTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: getStarted.current,
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
        markers: false,
      },
    });

    signUpTextTimeline
      .from(signUpText.current, { y: 100, opacity: 0 })
      .to(signUpText.current, { y: 0, opacity: 1 });

    const signUpBtnTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: signUpBtn.current,
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
        markers: false,
      },
    });

    signUpBtnTimeline
      .from(signUpBtn.current, { y: 100, opacity: 0 })
      .to(signUpBtn.current, { y: 0, opacity: 1 });
  }, []);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          wheelMultiplier: 0.5,
        },
      });
    })();
  }, []);

  const controls = useAnimation();

  useEffect(() => {
    // controls.start({ opacity: 1 }); delay of .8s
    controls.start({ opacity: 1, animationDelay: 0.8 });
  }, [controls]);

  return (
    <div className="overflow-x-hidden bg-primary-foreground">
      <div>
        <Button
          variant="ghost"
          className="absolute top-5 right-5 z-50 text-lg"
          asChild
          disabled={loading}
        >
          <Link href="/signin">Login</Link>
        </Button>
      </div>
      <div className="bg-primary">
        <Image
          src="/images/AdobeStock_275873051.jpeg"
          fill
          objectFit="cover"
          alt="Background"
          className="absolute top-0 left-0 z-[1] h-[140vw] w-full filter brightness-[.4] border-primary"
          ref={backgroundImage}
          onLoad={() => setLoaded(true)}
        />
      </div>

      <div
        div
        className="min-h-screen flex flex-col items-center justify-center"
      >
        <motion.div className="items-center flex flex-col text-center relative px-[15vw] sm:p-0">
          <div
            className="relative max-w-xl mb-5 z-[10]"
            data-scroll
            data-scroll-speed=".3"
          >
            <h1 className="mb-5 text-5xl font-bold text-white md:text-7xl">
              Drive Change.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff0f7b] to-[#f89b29]  xs:text-5xl md:text-7xl text-4xl">
                Effortlessly
              </span>
            </h1>
          </div>
          <div
            className="relative max-w-xl z-[10]"
            data-scroll
            data-scroll-speed=".1"
          >
            <p className="mb-5 text-xl text-white font-light md:text-2xl px-5">
              Manus Unitas is a volunteer management software designed to help
              nonprofits streamline their volunteer programs and drive social
              impact.
            </p>
            <Button variant="outline">
              <TransitionLink href="/signin">
                Get Started for Free
              </TransitionLink>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="min-h-screen bg-base-300 flex flex-col items-center justify-center py-20 px-5">
        <h1 className="text-5xl font-bold text-center mb-10">Features</h1>
        <div className="flex flex-col space-y-8 max-w-2xl items-start">
          <div className="flex flex-col items-center" ref={feature1}>
            <UsersRound size={64} className="text-primary" />
            <h2 className="text-4xl font-bold text-center my-5">
              Volunteer Management
            </h2>
            <p className="text-xl text-center">
              Volunteer sign-up and database, volunteer matching, communication
              tools, onboarding and training materials, volunteer hour tracking.
            </p>
          </div>
          <div className="divider divider-vertical" />
          <div className="flex flex-col items-center" ref={feature2}>
            <CalendarCheck2 size={64} className="text-primary" />
            <h2 className="text-4xl font-bold text-center my-5">
              Scheduling and Events
            </h2>

            <p className="text-xl text-center">
              Calendar management, event creation and promotion, volunteer
              scheduling for events, task management, email and SMS reminders.
            </p>
          </div>
          <div className="divider divider-vertical" />
          <div className="flex flex-col items-center" ref={feature3}>
            <AreaChart size={64} className="text-primary" />
            <h2 className="text-4xl font-bold text-center my-5">
              Additional Features
            </h2>
            <p className="text-xl text-center">
              Reporting and analytics, mobile app, integrations, security and
              data privacy.
            </p>
          </div>
        </div>
      </div>
      <div className="min-h-[40rem] w-full bg-gradient-to-br from-[#ff0f7b] to-[#f89b29] items-center justify-center flex flex-col">
        {/* Call to Action */}
        <div
          className="flex flex-col items-center justify-center text-center text-white z-10"
          ref={getStarted}
        >
          <h2 className="text-5xl font-bold mb-10" ref={signUpHeading}>
            Ready to get started?
          </h2>
          <p className="text-xl mb-10" ref={signUpText}>
            Start streamlining your volunteer programs and driving social impact
            today.
          </p>
          <Button ref={signUpBtn}>
            <TransitionLink href="/signin">Sign Up Now</TransitionLink>
          </Button>
        </div>
      </div>

      {/* <Subscriptions /> */}

      <Footer />
    </div>
  );
}

const stopLoading = () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (!loadingScreen) return;

  const tl = gsap.timeline();
  tl.to(loadingScreen, {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      loadingScreen.style.display = "none";
    },
    onStart: () => {
      document.body.style.overflow = "auto";
    },
  });
};

// Manus Unitas is a volunteer management software designed to help nonprofits streamline their volunteer programs and drive social impact. With features like volunteer sign-up and database, volunteer matching, communication tools, onboarding and training materials, and volunteer hour tracking, Manus Unitas makes it easy for nonprofits to manage their volunteers and make a difference in their communities. Sign up now to start streamlining your volunteer programs and driving social impact today.

// Volunteer Management:
// P Volunteer sign-up and database: Allow easy online volunteer registration with profiles, skills, and availability.
// N Communication tools: Facilitate communication between volunteers and staff through email, messaging, and discussion boards.
// N Onboarding and training materials: Provide a central location for onboarding documents, training videos, and resources for volunteers.
// Y Volunteer hour tracking: Track volunteer hours for reporting, recognition programs, and volunteer impact measurement.

// Y Event creation and promotion: Post volunteer opportunities(both one-time and ongoing) with descriptions, signup links, and location details.
// Y Volunteer scheduling for events: Allow volunteers to sign up for specific shifts or events that match their availability and skills.
// N Task management: Assign specific tasks to volunteers within events or projects.
// Y Email reminders: Send automated reminders to volunteers about upcoming shifts and events.

// P Reporting and analytics: Generate reports on volunteer activity, demographics, and program impact.
