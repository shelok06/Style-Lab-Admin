'use client'
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { ToastContainer, toast, Slide } from 'react-toastify';
import Loader from '@/components/Loader'

export default function Home() {
  const [form, setForm] = useState({ redirect: false })
  const [loader, setloader] = useState(false)

  const { data: session } = useSession()
  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleClick = async () => {
    const signin = await signIn("credentials", form)
    setloader(true)
    if (signin.ok) {
      router.push("/dashboard")
    }
    else {
      setloader(false)
      toast.error('Wrong Credentials', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      })
    }
  }

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session])





  return (
    <>
      <ToastContainer />
      <div className={`${loader ? "bg-[#86898f36] backdrop-blur-lg z-30 fixed inset-0 h-[100vh] w-[100vw] flex justify-center items-center" : "hidden"}`}>
        <Loader />
      </div>
      <div className="w-[80%] mx-auto my-10 flex flex-col items-center justify-center">
        <div className="md:w-1/2 w-full box px-10 py-5 bg-white shadow-2xl rounded-xl">
          <h1 className="text-3xl font-extrabold text-center my-6">Sign in</h1>
          <div className="flex flex-col justify-center">
            <label htmlFor="username">Username</label>
            <input onChange={handleChange} name="username" type="text" className="px-3 py-1 border-2 border-slate-950 mb-4 rounded-md" />
            <label htmlFor="email">Email</label>
            <input onChange={handleChange} name="email" type="text" className="px-3 py-1 border-2 border-slate-950 mb-4 rounded-md" />
            <label htmlFor="password">Password</label>
            <input onChange={handleChange} name="password" type="password" className="px-3 py-1 border-2 border-slate-950 mb-4 rounded-md" />
            <button onClick={handleClick} className="bg-gray-300 rounded-xl py-2 px-6 text-xl font-bold">Sign in</button>
          </div>
        </div>

      </div>

    </>
  );
}
