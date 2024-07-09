import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const [form, setForm] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])
    const [passType, setPassType] = useState(true)
    const [edit, setEdit] = useState(false)

    const getPasswords = async() => {
      let req = await fetch("http://localhost:3000/", {method : "GET"})
      let result = await req.json();
      setPasswordArray(result)
    }
    
    const insertPassword = async () => {
      let req = await fetch("http://localhost:3000/", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id : uuidv4() ,...form }), // body data type must match "Content-Type" header
      })
    }

    const  deletePasswordViaApi = async (array) => {
        let req = await fetch("http://localhost:3000/", {
          method: "DELETE", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(array), // body data type must match "Content-Type" header
        })
      }
    
    

    useEffect(() => {
        getPasswords()
    }, [])

    const copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast('🦄 Copied to Clipboard!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition : Slide,
            });
        })
    }


    const toggleEye = () => {
        setPassType(!passType)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const savePassword = () => {
        setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
        insertPassword()
        toast('🦄 Password Saved!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition : Slide,
        });
        setForm({site : "", username: "", password: ""})

    }

    const editPassword = (id) => {
        let editForm = passwordArray.filter(item => {
            return item.id === id
        })
        setForm(...editForm);
        setEdit(true)
        toast('🦄 Edit the password in the form!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition : Slide,
        });
        setPasswordArray(passwordArray.filter(item => {
            return item.id !== id
        })

        )

        // setForm(...editForm)
    }

    const deletePassword = async (id) => {
        const deletedArray = passwordArray.filter(item => {
            return item.id === id
        })
        setPasswordArray(passwordArray.filter(item => {
            return item.id !== id
        }))
        deletePasswordViaApi(deletedArray[0])
        toast('🦄 Password Deleted!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition : Slide,
        });

    }

    const updatePassword = async (id) => {
        await fetch("http://localhost:3000", {method: "PUT", headers:{"Content-Type": "appliCation/json"}, body : JSON.stringify(form)})
        getPasswords()
        toast('🦄 Password Updated!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition : Slide,
        });
        setForm({site : "", username: "", password: ""})
        setEdit(false)

    }

    return (

        <>
           <ToastContainer />
            <div className="fixed top-0 z-[-2] h-full w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
            <div className="manager flex flex-col gap-5 pass-container min-h-[73vh]  mx-[10%] my-5 p-3 rounded-2xl">
                <div className='title text-white logo flex justify-center items-center flex-col gap-2 text-4xl font-bold'>
                    <div>
                        <span className='text-green-600'>&lt;</span> Pass
                        <span className='text-green-600'>OP /&gt; </span>
                    </div>
                    <span className='text-base'>Your own password manager</span>
                    {(form.password.length <= 3 || form.username.length <= 3 || form.site.length <= 3) && <span className='text-base md:text-start text-center flex md:justify-center md:items-center items-start'><img className='w-5 md:mx-2 md:mt-0 mt-1 mx-0' src="./icons/notAllowed.png" alt="" />Ensure all the fields length is greater than equal to 4 characters</span>}
                </div>
                <form className="flex flex-col gap-3" action="">
                    <div>
                        <input name='site' id="site" value={form.site} onChange={handleChange} placeholder="Enter your website url" className="w-full px-4 py-1 border-[2px] border-green-600 rounded-full lg:text-base md:text-sm text-xs" type="text" />
                    </div>
                    <div className='flex gap-4 md:flex-row flex-col'>
                        <input value={form.username} id="username" name='username' onChange={handleChange} type="text" placeholder='Enter Username' className='md:w-[75%] px-4 py-1 border-[2px] border-green-600 rounded-full lg:text-base md:text-sm text-xs' />
                        <div className='md:w-[25%] relative'>
                            <input value={form.password} name='password' id="password" onChange={handleChange} type={passType ? "password" : "text"} placeholder='Enter Password' className='w-full px-4 py-1 border-[2px] border-green-600 rounded-full lg:text-base md:text-sm text-xs' />
                            {passType ? <span><img onClick={toggleEye} className='absolute lg:top-2 md:top-1.5 top-1 right-3 hover:cursor-pointer' width={20} src="./icons/eye.png" alt="" /></span> : <span><img onClick={toggleEye} className='absolute lg:top-2 md:top-1.5 top-1 right-3 hover:cursor-pointer' width={20} src="./icons/eyecross.png" alt="" /></span>}
                        </div>
                    </div>
                </form>
                {edit ?<button disabled={form.password.length <= 3 || form.username.length <= 3 || form.site.length <= 3} className='bg-green-600 w-fit mx-auto py-2 px-3 hover:bg-green-500 rounded-full font-semibold border-black border flex justify-center items-center gap-2 disabled:hover:bg-green-600 disabled:cursor-not-allowed' onClick={()=>{updatePassword(form.id)}}>
                    <lord-icon
                        src="https://cdn.lordicon.com/jgnvfzqg.json"
                        trigger="hover">
                    </lord-icon>
                    Update Password</button> : <button disabled={form.password.length <= 3 || form.username.length <= 3 || form.site.length <= 3} className='bg-green-600 w-fit mx-auto py-2 px-3 hover:bg-green-500 rounded-full font-semibold border-black border flex justify-center items-center gap-2 disabled:hover:bg-green-600 disabled:cursor-not-allowed' onClick={savePassword}>
                    <lord-icon
                        src="https://cdn.lordicon.com/jgnvfzqg.json"
                        trigger="hover">
                    </lord-icon>
                    Save Password</button>}

                <div className="passswords my-4">
                    <h1 className='font-bold py-2 text-2xl text-white'>Your Passwords</h1>

                    {passwordArray.length === 0 ? <p className='text-white'>No passswords to show..</p> :
                        <div className='overflow-x-auto mangerTable'>
                        <table className="table-auto rounded-lg overflow-hidden w-full">
                            <thead className='bg-green-600 rounded-lg'>
                                <tr>
                                    <th className='py-3 md:text-lg text-sm'>Site</th>
                                    <th className='py-3 md:text-lg text-sm'>Username</th>
                                    <th className='py-3 md:text-lg text-sm'>Password</th>
                                    <th className='py-3 md:text-lg text-sm'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item, index) => {
                                    return <tr key={index} className='border-2 rounded-full border-white'>
                                        <td className='text-center w-32 py-3 '>
                                            <div className="flex items-center justify-center gap-1"><span>{item.site}</span><lord-icon onClick={() => copyText(item.site)}
                                                src="https://cdn.lordicon.com/depeqmsz.json"
                                                trigger="hover"
                                                style={{ width: "30px", height: "30px", cursor: "pointer" }}>
                                            </lord-icon></div></td>
                                        <td className='text-center w-32 py-3 '>
                                            <div className="flex items-center justify-center gap-1"><span>{item.username}</span><lord-icon onClick={() => copyText(item.username)}
                                                src="https://cdn.lordicon.com/depeqmsz.json"
                                                trigger="hover"
                                                style={{ width: "30px", height: "30px", cursor: "pointer" }}>
                                            </lord-icon></div></td>
                                        <td className='text-center w-32 py-3 '>
                                            <div className="flex items-center justify-center gap-1"><span>{"*".repeat(item.password.length)}</span><lord-icon onClick={() => copyText(item.password)}
                                                src="https://cdn.lordicon.com/depeqmsz.json"
                                                trigger="hover"
                                                style={{ width: "30px", height: "30px", cursor: "pointer" }}>
                                            </lord-icon></div></td>
                                        <td className='text-center w-32 py-3'>
                                            <div className="flex justify-center gap-3"><div className="flex items-center justify-center gap-1 cursor-pointer"><lord-icon onClick={() => { deletePassword(item.id) }}
                                                src="https://cdn.lordicon.com/wpyrrmcq.json"
                                                trigger="hover">
                                            </lord-icon></div>
                                                <div className="flex items-center justify-center gap-1 cursor-pointer"><lord-icon onClick={() => { editPassword(item.id) }}
                                                    src="https://cdn.lordicon.com/msbrflth.json"
                                                    trigger="hover">
                                                </lord-icon></div></div>
                                        </td>

                                    </tr>
                                })}
                            </tbody>
                        </table>
                        </div>}

                </div>
            </div>

        </>
    )
}

export default Manager
