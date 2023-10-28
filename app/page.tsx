'use client'

import React, { useRef } from 'react';
import Image from 'next/image'
import ReCAPTCHA from 'react-google-recaptcha';

export default function Home() {


  const captchaRef = useRef<null | ReCAPTCHA>(null);

  function onChange(value : any) {
    console.log("Captcha value:",value);
  }

  const sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY

  function handleRest() {
    const current = captchaRef.current as ReCAPTCHA;
    current.reset();
  }


  return (
    <div>
      <ReCAPTCHA
        sitekey={sitekey as string}
        onChange={onChange}
        ref={captchaRef}
      />
      
       <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleRest}>Reset captcha</button>
    </div>
  )
}
