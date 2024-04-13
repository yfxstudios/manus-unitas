'use client'
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import verifySignIn from '../verifySignIn';

import React, { useEffect, useRef, useState } from 'react'

export default function SignIn() {
  const router = useRouter();

  const buttonRef = useRef(null);
  const modalRef = useRef(null);

  // get search params from URL

  let params = null;

  if (typeof window !== 'undefined') {
    params = new URLSearchParams(window.location.search);
  }



  const [signedIn, setSignedIn] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params && params.get('error')) {
      if (params.get('error') === 'User not found' || params.get('error') === 'Password incorrect') {
        setError('Invalid email or password');
      } else {
        setError(params.get('error') + '. Contact support for help');
      }
    }
  }, []);

  const isSignedIn = async () => {
    setSignedIn(await verifySignIn());
  }

  useEffect(() => {
    isSignedIn()
  }, []);

  if (signedIn) {
    router.push('/dashboard');
    return (
      <div>
        <h1>Redirecting...</h1>
      </div>
    )
  } else if (signedIn === false) {
    return (
      <div className="flex flex-col space-y-8 items-center justify-center min-h-screen py-2">
        <h1
          className="text-3xl font-bold text-center"
        >Sign In</h1>
        <form className="flex flex-col space-y-4 w-72 lg:w-96 xs:w-80 2xs:w-full" onSubmit={async (e) => {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          buttonRef.current.childNodes[0].nodeValue = 'Signing in...';
          // create span element to show loading spinner
          const spinner = document.createElement('span');
          spinner.className = 'loading'

          buttonRef.current.appendChild(spinner);
          buttonRef.current.classList.add('disabled');

          const result = await signIn('credentials', {
            redirect: true,
            email,
            password,
            callbackUrl: '/dashboard'
          });

        }
        }>
          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
            <input type="text" className="grow" placeholder="Email" id='email' />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
            <input type="password" className="grow" placeholder="Password" id='password' />
          </label>
          <button
            type='submit'
            className="btn btn-primary"
            ref={buttonRef}
          >Sign In</button>
        </form>
        {error && (
          <div className="absolute bottom-4 right-4 z-50 rounded-lg p-4">
            <div role="alert" className="alert alert-error drop-shadow-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }
}
