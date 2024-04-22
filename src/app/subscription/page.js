'use client'

import React from 'react'
import TransitionLink from '@/app/components/TransitionLink'

export default function Subscription() {
  const [pricing, setPricing] = React.useState("monthly")
  return (
    <div className="min-h-screen flex flex-col w-full p-10 items-center justify-center">
      <h1 className="text-4xl font-bold text-center max-w-md">{`Choose the plan that's right for you`}</h1>

      <section className="w-full">
        <div className="py-12 px-4 mx-auto max-w-screen-xl lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            {/* <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-base-content dark:text-white">Pricing Plans</h2> */}
            {/* <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{`Choose the plan that best fits your organization's needs.`}</p> */}
            <div className="flex justify-center items-center space-x-4">
              <label htmlFor="toggle" className="text-gray-500 dark:text-gray-400">Monthly</label>
              <input type="checkbox" className="toggle toggle-lg" onChange={(e) => {
                setPricing(e.target.checked ? "yearly" : "monthly")
              }} />
              <label htmlFor="toggle" className="text-gray-500 dark:text-gray-400">Yearly (20% off)</label>
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
              <TransitionLink href={
                pricing === "monthly" ? "/subscription/15" : "/subscription/12"
              } className="btn btn-md btn-accent">Get started</TransitionLink>
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
              <TransitionLink href={
                pricing === "monthly" ? "/subscription/99" : "/subscription/79"
              } className="btn btn-md btn-accent btn-disabled">Coming Soon</TransitionLink>
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

    </div>
  )
}
