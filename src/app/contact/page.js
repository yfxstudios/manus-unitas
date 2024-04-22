'use client'
import React, { useState } from "react";

export default function Contact() {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "7cc84867-f87d-4221-805d-93f8ecb495d3");
    formData.append("subject", "New Contact Form Submission");
    formData.append("from_name", "Manus Unitas");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div>
      {/* <form onSubmit={onSubmit}>
        <input type="text" name="name" required />
        <input type="email" name="email" required />
        <textarea name="message" required></textarea>

        <button type="submit">Submit Form</button>

      </form>
      <span>{result}</span> */}


      <form className="min-h-screen flex flex-col w-full max-w-md p-10 m-auto justify-center" onSubmit={onSubmit}>
        <label className="">
          <input type="text" name="name" placeholder="Full Name" className="input input-bordered" required />
        </label>
        <label className="label">
          <input type="email" name="email" placeholder="Email" className="input input-bordered" required />
        </label>
        <label className="label">
          <textarea name="message" placeholder="Message" className="textarea textarea-bordered resize-none w-full h-64" required></textarea>
        </label>
        {result !== "" ?
          <button className="btn btn-disabled">{result}</button>
          :
          <button type="submit" className="btn btn-primary">Submit Form</button>
        }
        {result === "Form Submitted Successfully" &&
          <a href="/" className="text-center underline mt-4">Back to Home</a>
        }
      </form>
    </div>
  );
}
