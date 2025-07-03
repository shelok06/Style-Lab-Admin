'use client'
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"


export default function Home() {
  const [form, setForm] = useState({redirect: false})
  const {data: session} = useSession()
  const router = useRouter()

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
    console.log(form)
  }

  const handleClick = async () => {
    const signin = await signIn("credentials", form)
    if (signin.ok) {
      router.push("/dashboard")
    }
    else {
      alert("Wrong Credentials")
    }
  }

  useEffect(() => {
    if(session){
      router.push("/dashboard")
    }
  }, [session])
  

  
  
  
  return (
    <>
      <div className="w-[80vw] mx-auto my-10 flex flex-col items-center justify-center">
        <div className="box px-10 py-5 bg-white shadow-2xl rounded-xl">
          <h1 className="text-3xl font-extrabold text-center my-6">Sign in</h1>
            <div className="flex flex-col justify-center">
              <label htmlFor="username">Username</label>
              <input onChange={handleChange} name="username" type="text" className="px-3 py-1 border-2 border-slate-950 mb-4 w-[20vw] rounded-md" />
              <label htmlFor="email">Email</label>
              <input onChange={handleChange} name="email" type="text" className="px-3 py-1 border-2 border-slate-950 mb-4 w-[20vw] rounded-md" />
              <label htmlFor="password">Password</label>
              <input onChange={handleChange} name="password" type="password" className="px-3 py-1 border-2 border-slate-950 mb-4 w-[20vw] rounded-md" />
              <button onClick={handleClick} className="bg-gray-300 rounded-xl py-2 px-6 text-xl font-bold">Sign in</button>
            </div>
        </div>

      </div>

    </>
  );
}
