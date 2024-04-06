"use client";
import EventIcon from "@mui/icons-material/Event";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useAnimation,
  useInView,
  useTransform,
  useScroll,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { PeopleAlt } from "@mui/icons-material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TransitionLink from "./components/TransitionLink";
import Footer from "./components/Footer";

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
  const ref = useRef(null);

  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1 });
  }, [controls]);

  const router = useRouter();
  return (
    <>
      <div className="navbar bg-base-300 p-8 absolute top-0 z-[1]">
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
      </div>

      {/* <div className="min-h-screen bg-base-300 flex flex-col items-center justify-center">
        <div className="items-center flex flex-col text-center relative z-[1]">
          <div className="max-w-xl mb-5">
            <h1 className="mb-5 text-7xl font-bold text-white">Drive Change.<br /><span className="text-transparent bg-clip-text bg-gradient-to-t from-primary to-accent">Effortlessly</span></h1>
          </div>
          <div className="max-w-xl">
            <p className="mb-5 text-2xl text-white font-light">Manus Unitas is a volunteer management software designed to help nonprofits streamline their volunteer programs and drive social impact.</p>
            <button className="btn btn-lg btn-accent btn-outline">
              <Link href="/signup">Get Started for Free</Link>
            </button>
          </div>
        </div>

        <div className="min-h-[40rem] w-full bg-gradient-to-br from-primary to-accent z-[-1]"></div>
      </div> */}

      <div className="min-h-screen bg-base-300 flex flex-col items-center justify-center">
        <motion.div
          className="items-center flex flex-col text-center relative z-[1]"
          animate={controls}
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-xl mb-5">
            <h1 className="mb-5 text-7xl font-bold text-white">
              Drive Change.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-t from-primary to-accent">
                Effortlessly
              </span>
            </h1>
          </div>
          <div className="max-w-xl">
            <p className="mb-5 text-2xl text-white font-light">
              Manus Unitas is a volunteer management software designed to help
              nonprofits streamline their volunteer programs and drive social
              impact.
            </p>
            <button className="btn btn-lg btn-accent btn-outline">
              <Link href="/signup">Get Started for Free</Link>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="min-h-[40rem] w-full bg-gradient-to-br from-primary to-accent z-[-1]"></div>

      <div className="min-h-screen bg-base-300 flex flex-col items-center justify-center py-20">
        <h1 className="text-5xl font-bold text-center mb-10">Features</h1>
        <div className="flex flex-col space-y-8 max-w-2xl items-start">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{
              once: true,
              margin: "-300px",
            }}
          >
            <PeopleAlt className="text-9xl text-accent" />
            <h2 className="text-3xl font-bold text-center my-5">
              Volunteer Management
            </h2>
            <p className="text-xl text-center">
              Volunteer sign-up and database, volunteer matching, communication
              tools, onboarding and training materials, volunteer hour tracking.
            </p>
          </motion.div>
          <div className="divider divider-vertical" />
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{
              once: true,
              margin: "-300px",
            }}
          >
            <EventIcon className="text-9xl text-accent" />
            <h2 className="text-3xl font-bold text-center my-5">
              Scheduling and Events
            </h2>

            <p className="text-xl text-center">
              Calendar management, event creation and promotion, volunteer
              scheduling for events, task management, email and SMS reminders.
            </p>
          </motion.div>
          <div className="divider divider-vertical" />
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{
              once: true,
              margin: "-300px",
            }}
          >
            <AnalyticsIcon className="text-9xl text-accent" />
            <h2 className="text-3xl font-bold text-center my-5">
              Additional Features
            </h2>
            <p className="text-xl text-center">
              Reporting and analytics, mobile app, integrations, security and
              data privacy.
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}
