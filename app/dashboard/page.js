'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast, Slide } from 'react-toastify';

const dashboard = () => {
  const { data: session } = useSession()
  const [image, setImage] = useState("")
  const [product, setProduct] = useState({})
  const [productButton, setproductButton] = useState(false)
  const [productlist, setproductlist] = useState([])
  const [deleteIds, setdeleteIds] = useState([])
  const [Edit, setEdit] = useState()
  const [editPanel, seteditPanel] = useState(false)
  const [updatedProduct, setupdatedProduct] = useState()
  const router = useRouter()

  // useEffect(() => {
  //   if (!session) {
  //     router.push("/")
  //   }
  // }, [session])

  const handleImageUpload = (e) => {
    const picture = e.target.files[0]

    const reader = new FileReader()
    reader.onload = (e) => {
      const fileContent = e.target.result
      setImage(fileContent)
    }

    if (picture) {
      reader.readAsDataURL(picture)
    }
  }

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const handleProductUpload = async () => {
    try {
      const res = await fetch("/api/productUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "image": image, ...product }),
      })
      const r = await res.json()
      if (r.success) {
        toast.success('Product Added!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
        setTimeout(() => {
          window.location.reload()
        }, 500);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleproductList = async () => {
    try {
      let res = await fetch("/api/productList")
      if (!res.ok) throw new Error("Fetch failed");
      let r = await res.json()
      setproductlist([...r.data])
    }
    catch (err) {
      console.error(err)
      throw err
    }
  }

  const handleDelete = (e, id) => {
    let newArr = productlist.filter((item) => {
      return (item._id !== id)
    })
    setproductlist(newArr)
    setdeleteIds([...deleteIds, id])
  }


  const handleDeletechanges = async () => {
    if (deleteIds.length > 0) {
      try {
        const res = await fetch("/api/deleteChanges", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "deleteIDs": deleteIds })
        })
        if (!res.ok) throw new Error("Fetch failed")
        const r = await res.json()
        console.log(r)
        window.location.reload()
      }
      catch (err) {
        console.error(err)
        throw err
      }
    }

  }

  const handleEdit = (e, id) => {
    let newArr = productlist.filter((item) => {
      return (item._id === id)
    })
    setEdit(...newArr)
    seteditPanel(true)
  }

  const handleUpdatedProduct = (e) => {
    setupdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value })
  }

  const handleUpdatechanges = async () => {
    if (updatedProduct) {
      try {
        const res = await fetch("/api/updateChanges", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: updatedProduct, id: Edit._id })
        })
        if (!res.ok) throw new Error("Fetch failed")
        const r = await res.json()
        console.log(r)
        window.location.reload()
      }
      catch (err) {
        console.error(err)
        throw err
      }
    }
  }



  useEffect(() => {
    if (image.length > 0 && Edit) {
      setupdatedProduct({ ...updatedProduct, picture: image })
    }
  }, [image])


  return (
    <>
      <ToastContainer />
      <div className='mx-20 my-10 py-10'>
        <div className='my-5'>
          <h1 className='text-4xl font-extrabold text-slate-950'>Seller dashboard</h1>
        </div>
        <div className='my-2.5 px-3'>
          <h2 className='text-lg font-semibold'>Quick Actions</h2>
          <div className="buttons my-2.5 flex flex-col">
            <button onClick={() => { setproductButton(!productButton) }} type="button" className="w-fit text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 my-2.5">
              <div className='flex justify-center items-center'>
                <p>Add products</p>
                <img src="/downarrow.svg" alt="" className={`size-7 transition-all ${productButton ? " rotate-180" : "rotate-0"}`} />
              </div>
            </button>
            <div className='overflow-hidden'>
              <div className={`flex items-center gap-12 transition-all ${productButton ? "h-fit visible translate-y-0" : "h-5 invisible -translate-y-[218px] pointer-events-none"}`}>
                <div className='flex flex-col grow-[0.5]'>
                  <input onChange={handleImageUpload} type="file" accept='image/' className='border border-black my-2.5 px-2 py-1' />
                  <input onChange={handleChange} name='product' type="text" className='border border-black my-2.5 px-2 py-1' placeholder='Enter product name' />
                  <input onChange={handleChange} name='brand' type="text" className='border border-black my-2.5 px-2 py-1' placeholder='Enter brand name' />
                  <input onChange={handleChange} name='quantity' className='border border-black my-2.5 px-2 py-1' type="number" min="1" max="50" />
                  <input onChange={handleChange} name='price' type="text" className='border border-black my-2.5 px-2 py-1' placeholder='Enter product price' />
                  <button onClick={handleProductUpload} type="button" className="w-fit text-slate-950 border-2 border-black font-medium rounded-lg text-sm px-5 py-2.5 my-2.5">Upload</button>
                </div>

                <div>
                  {image && <img src={image} alt="" className='w-52' />}
                </div>
              </div>
            </div>

            <div className='flex gap-2.5 items-center'>
              <button onClick={handleproductList} type="button" className="w-fit text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 my-2.5">Manage products</button>

              <button onClick={handleDeletechanges} type="button" className={`text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700`}>Save changes</button>
            </div>
            <div className='card_container flex flex-col justify-center items-center'>
              {productlist && productlist.map((item) => {
                return <div key={item._id} className="card bg-[#d1d5dc66] backdrop-blur-md rounded-xl shadow-lg w-[95%] flex justify-around py-5 px-5 my-5">
                  <div className="picture">
                    <img src={item.picture} alt="" className='w-20' />
                  </div>
                  <div className="brand flex flex-col justify-evenly">
                    <h3 className='self-start'>Brand</h3>
                    <p>{item.brand}</p>
                  </div>
                  <div className="brand flex flex-col justify-evenly">
                    <h3 className='self-start'>Product</h3>
                    <p>{item.product}</p>
                  </div>
                  <div className="brand flex flex-col justify-evenly">
                    <h3 className='self-start'>Quantity</h3>
                    <p>{item.quantity}</p>
                  </div>
                  <div className="brand flex flex-col justify-evenly">
                    <h3 className='self-start'>Price</h3>
                    <p>{item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                  </div>

                  <div className="delete flex justify-center items-center gap-5">
                    <button onClick={(e) => handleEdit(e, item._id)}>
                      <img src="/edit.svg" alt="" className='size-7' />
                    </button>
                    <button onClick={(e) => handleDelete(e, item._id)}>
                      <img src="/delete.svg" alt="" className='size-8' />
                    </button>
                  </div>
                </div>
              })
              }
            </div>

            <div className={`min-w-full fixed top-0 left-0 min-h-full bg-[#86898f36] backdrop-blur-lg z-10 flex justify-center items-center ${editPanel ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}>
              <div className="card bg-white w-[500px] h-[600px]">
                <div className='flex gap-2.5 items-center my-5 mx-5'>
                  <button onClick={handleUpdatechanges} type="button" className={`text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700`}>Save changes</button>

                  <button onClick={() => { seteditPanel(false); setEdit({}); setImage("") }} type="button" className="w-fit text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 my-2.5">Cancel</button>
                </div>
                {Edit && <div className='mx-5 my-2.5'>
                  <div className='flex justify-center my-4'>
                    <img src={image.length > 0 ? image : Edit.picture} alt="" className='w-52' />
                  </div>

                  <div className='my-3'>
                    <input onChange={handleImageUpload} type="file" accept='image/' />
                  </div>

                  <div className="flex gap-4 my-3">
                    <h3>Brand: </h3>
                    <input onChange={handleUpdatedProduct} defaultValue={Edit.brand} type="text" name='brand' />
                  </div>
                  <div className="flex gap-4 my-3">
                    <h3>Product: </h3>
                    <input onChange={handleUpdatedProduct} defaultValue={Edit.product} type="text" name='product' />
                  </div>
                  <div className="flex gap-4 my-3">
                    <h3>Quantity: </h3>
                    <input onChange={handleUpdatedProduct} defaultValue={Edit.quantity} type="number" min="1" max="50" name='quantity' />
                  </div>
                  <div className="flex gap-4 my-3">
                    <h3>Price: </h3>
                    <input onChange={handleUpdatedProduct} defaultValue={Edit.price} type="text" name='price' />
                  </div>
                </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default dashboard
