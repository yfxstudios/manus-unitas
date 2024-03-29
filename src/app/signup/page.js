import { createUser } from "@/lib/mongo/users"

export default function SignUp() {
  const handleSignUp = async () => {
    'use server'
    const user = {
      first_name: document.getElementById('firstName').value,
      last_name: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    }

    if (user.password !== document.getElementById('confirmPassword').value) {
      console.log('Passwords do not match')
      return
    }

    await createUser(user)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen" >
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <div
        className="flex flex-col items-center justify-center"
      >
        <input
          type="text"
          placeholder="First Name"
          id="firstName"
          className="input input-primary input-bordered w-96 mb-4"
        />
        <input
          type="text"
          placeholder="Last Name"
          id="lastName"
          className="input input-primary input-bordered w-96 mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="input input-primary input-bordered w-96 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="input input-primary input-bordered w-96 mb-4"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          id="confirmPassword"
          className="input input-primary input-bordered w-96 mb-4"
        />
        <button className="btn btn-primary w-96" type="submit" onSubmit={handleSignUp}>Sign Up</button>

      </div>
    </div>
  )
}
