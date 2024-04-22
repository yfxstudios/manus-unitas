"use client";
import EventIcon from "@mui/icons-material/Event";
import Link from "next/link";
import {
  motion,
  useAnimation
} from "framer-motion";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { PeopleAlt } from "@mui/icons-material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TransitionLink from "./components/TransitionLink";
import Footer from "./components/Footer";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import { useGSAP } from '@gsap/react'

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
  const backgroundImage = useRef(null)

  const feature1 = useRef(null)
  const feature2 = useRef(null)
  const feature3 = useRef(null)

  const getStarted = useRef(null)

  const signUpHeading = useRef(null)
  const signUpText = useRef(null)
  const signUpBtn = useRef(null)

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
        opacity: 1
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

  }, [])

  useEffect(() => {

    (
      async () => {
        const LocomotiveScroll = (await import('locomotive-scroll')).default
        const locomotiveScroll = new LocomotiveScroll({
          lenisOptions: {
            wheelMultiplier: .5,
          }
        })
      }

    )()


  }, [])

  const controls = useAnimation();



  useEffect(() => {
    // controls.start({ opacity: 1 }); delay of .8s
    controls.start({ opacity: 1, animationDelay: 0.8 });
  }, [controls]);


  return (
    <div className="overflow-x-hidden">
      <Image
        src="/images/AdobeStock_275873051.jpeg"
        fill
        objectFit="cover"
        alt="Background"
        className="absolute top-0 left-0 z-[-1] h-[140vw] w-full filter brightness-[.4]"
        ref={backgroundImage}
        onLoad={() => setLoaded(true)}
      />
      <div className="navbar bg-base-300 p-8 absolute top-0 z-[1] bg-opacity-0">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[2] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/signin">Sign In</Link>
              </li>
              <li>
                <Link href="/signup">Sign Up</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-2xl">Manus Unitas</a>
        </div>

        <div className="navbar-end hidden lg:flex">
          <TransitionLink
            className="px-10 cursor-pointer text-xl"
            href="/signin"
          >
            Sign In
          </TransitionLink>
          <TransitionLink className="btn btn-lg btn-accent" href="/signup">
            Try Free
          </TransitionLink>
        </div>
      </div >


      <div div className="min-h-screen bg-base-300 flex flex-col items-center justify-center bg-opacity-0" >
        <motion.div
          className="items-center flex flex-col text-center relative "
          animate={controls}
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="relative max-w-xl mb-5 z-[1]" data-scroll data-scroll-speed=".3">
            <h1 className="mb-5 text-5xl font-bold text-white md:text-7xl">
              Drive Change.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-t from-primary to-accent">
                Effortlessly
              </span>
            </h1>
          </div>
          <div className="relative max-w-xl z-[1]" data-scroll data-scroll-speed=".1">
            <p className="mb-5 text-xl text-white font-light md:text-2xl px-5">
              Manus Unitas is a volunteer management software designed to help
              nonprofits streamline their volunteer programs and drive social
              impact.
            </p>
            <button className="btn btn-lg btn-accent btn-outline">
              <TransitionLink href="/signup">Get Started for Free</TransitionLink>
            </button>
          </div>
        </motion.div>
      </div>


      <div className="min-h-screen bg-base-300 flex flex-col items-center justify-center py-20 px-5">
        <h1 className="text-5xl font-bold text-center mb-10">Features</h1>
        <div className="flex flex-col space-y-8 max-w-2xl items-start">
          <div
            className="flex flex-col items-center"
            ref={feature1}
          >
            <PeopleAlt className="text-9xl text-accent" />
            <h2 className="text-4xl font-bold text-center my-5">
              Volunteer Management
            </h2>
            <p className="text-xl text-center">
              Volunteer sign-up and database, volunteer matching, communication
              tools, onboarding and training materials, volunteer hour tracking.
            </p>
          </div>
          <div className="divider divider-vertical" />
          <div
            className="flex flex-col items-center"
            ref={feature2}
          >
            <EventIcon className="text-9xl text-accent" />
            <h2 className="text-4xl font-bold text-center my-5">
              Scheduling and Events
            </h2>

            <p className="text-xl text-center">
              Calendar management, event creation and promotion, volunteer
              scheduling for events, task management, email and SMS reminders.
            </p>
          </div>
          <div className="divider divider-vertical" />
          <div
            className="flex flex-col items-center"
            ref={feature3}

          >
            <AnalyticsIcon className="text-9xl text-accent" />
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
      <div className="min-h-[40rem] w-full bg-gradient-to-br from-primary to-accent items-center justify-center flex flex-col">
        {/* Call to Action */}
        <div className="flex flex-col items-center justify-center text-center text-white" ref={getStarted}>
          <h2 className="text-5xl font-bold mb-10"
            ref={signUpHeading}
          >Ready to get started?</h2>
          <p className="text-xl mb-10"
            ref={signUpText}
          >
            Start streamlining your volunteer programs and driving social impact today.</p>
          <button className="btn btn-lg btn-secondary"
            ref={signUpBtn}
          >
            <TransitionLink href="/signup">Sign Up Now</TransitionLink>
          </button>
        </div >
      </div>


      <section className="bg-base-300">
        <div className="py-16 px-4 mx-auto max-w-screen-xl lg:py-32 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-base-content dark:text-white">Pricing Plans</h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{`Choose the plan that best fits your organization's needs.`}</p>
            <div className="flex justify-center items-center space-x-4">
              <label htmlFor="toggle" className="text-gray-500 dark:text-gray-400">Monthly</label>
              <input type="checkbox" className="toggle toggle-lg" onChange={(e) => {
                setPricing(e.target.checked ? "yearly" : "monthly")
              }} />
              <label htmlFor="toggle" className="text-gray-500 dark:text-gray-400">Yearly</label>
            </div>
          </div>
          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-white bg-base-100 rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8">
              <h3 className="mb-4 text-2xl font-semibold">Starter</h3>
              <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best option for small nonprofits and organizations.</p>
              {pricing === "monthly" &&
                (
                  <div className="flex flex-col my-8">
                    <div className="flex justify-center items-baseline">
                      <span className="mr-2 text-5xl font-extrabold">$15</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-sm  text-gray-500 dark:text-gray-400">&nbsp;</p>
                  </div>
                ) || (
                  <div className="flex flex-col my-8">
                    <div className="justify-center items-baseline">
                      <span className="mr-2 text-5xl font-extrabold">$12</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-sm  text-gray-500 dark:text-gray-400">Billed annually</p>
                  </div>
                )}
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Up to 100 volunteers</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Basic features</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Email support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Basic reporting</span>
                </li>
              </ul>
              <TransitionLink href="/signup/admin" className="btn btn-md btn-accent">Get started</TransitionLink>
            </div>
            <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-white bg-base-100 rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8">
              <h3 className="mb-4 text-2xl font-semibold">Business</h3>
              <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Relevant for medium-sized nonprofits and organizations.</p>
              {pricing === "monthly" &&
                (
                  <div className="flex flex-col my-8">
                    <div className="justify-center items-baseline">
                      <span className="mr-2 text-5xl font-extrabold">$99</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-sm  text-gray-500 dark:text-gray-400">&nbsp;</p>
                  </div>
                ) || (
                  <div className="flex flex-col my-8">
                    <div className="justify-center items-baseline">
                      <span className="mr-2 text-5xl font-extrabold">$79</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-sm  text-gray-500 dark:text-gray-400">Billed annually</p>
                  </div>
                )}
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Up to 500 volunteers</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Advanced features</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Email and phone support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Advanced reporting</span>
                </li>
              </ul>
              <TransitionLink href="/signup" className="btn btn-md btn-accent btn-disabled">Coming Soon</TransitionLink>
            </div>
            <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-white bg-base-100 rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8">
              <h3 className="mb-4 text-2xl font-semibold">Enterprise</h3>
              <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best for large nonprofits and organizations.</p>
              {pricing === "monthly" &&
                (
                  <div className="flex flex-col my-8">
                    <div className="flex justify-center items-baseline">
                      <span className="mr-2 text-5xl font-extrabold">$499</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-sm  text-gray-500 dark:text-gray-400">&nbsp;</p>
                  </div>
                ) || (
                  <div className="flex flex-col my-8">
                    <div className="justify-center items-baseline">
                      <span className="mr-2 text-5xl font-extrabold">$419</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-sm  text-gray-500 dark:text-gray-400">Billed annually</p>
                  </div>
                )}

              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Unlimited volunteers</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>All features</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7 293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span>Advanced reporting</span>
                </li>
              </ul>
              <TransitionLink href="/signup" className="btn btn-md btn-accent btn-disabled">Coming Soon</TransitionLink>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div >
  );
}



const stopLoading = () => {
  const loadingScreen = document.getElementById('loading-screen');

  const tl = gsap.timeline();
  tl.to(loadingScreen, {
    opacity: 0, duration: 1, onComplete: () => {
      loadingScreen.style.display = 'none';
    }, onStart: () => {
      document.body.style.overflow = 'auto';
    }
  })
}