import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([]);
    
    const getPasswords = async() => {
      let req = await fetch("http://localhost:3000/")
      let passwords = await req.json()
      console.log(passwords)
      setpasswordArray(passwords)
    }
    

    useEffect(() => {
        getPasswords()
    }, [])

    const showPassword = () => {

        console.log(ref.current.src)
        if (ref.current.src.includes("icons/eyehide.svg")) {
            ref.current.src = "icons/eyeshow.svg";
            passwordRef.current.type = "password";
        }
        else {
            ref.current.src = "icons/eyehide.svg";
            passwordRef.current.type = "text";
        }
    }

    const savePassword = async() => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]));
            //console.log([...passwordArray, form]);

            await fetch("http://localhost:3000/",{method:"DELETE", headers: {"Content-Type":"application/json"}, body: JSON.stringify({id:form.id})} )
            setpasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
            await fetch("http://localhost:3000/",{method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({...form, id:uuidv4()})} )

            setform({ site: "", username: "", password: "" })
            toast('🦄 Password saved successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
        }

    }
    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => {
        toast('🦄 Copied to clipboard', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

        });
        navigator.clipboard.writeText(text)
    }

    const editPassword = (id) => {
        console.log('Editing password with id ', id)
        setform({...passwordArray.filter(item => item.id === id)[0], id:id})
        setpasswordArray(passwordArray.filter(item => item.id !== id));

    }
    const deletePassword = async(id) => {
        
        console.log('Deleting password with id ', id)
        let c = confirm("Do you want to delete?")
        if (c) {
            setpasswordArray(passwordArray.filter(item => item.id !== id));
            let res = await fetch("http://localhost:3000/",{method:"DELETE", headers: {"Content-Type":"application/json"}, body: JSON.stringify({id})} )
            
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)));
        }


    }




    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            {/* <ToastContainer /> */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-600 opacity-20 blur-[100px]"></div></div>
            <div className="container mx-auto md:px-52 md:my-10 flex flex-col items-center">
                <div className='flex justify-center items-center text-2xl font-bold'><span className='text-green-800'>&lt;</span>
                    <span>Pass</span>
                    <span className='text-green-800'>OP</span>
                    <span className='text-green-700'>/&gt;</span></div>
                <p className='flex justify-center text-lg mb-5'>Your own Password Manager</p>
                <input value={form.site} onChange={handleChange} className='border border-green-400 rounded-full px-3 py-1 w-full' placeholder='Enter the URL' type="text" name="site" id="site" />
                <div className='flex flex-col md:flex-row md:justify-between w-full gap-8 my-5'>
                    <input value={form.username} onChange={handleChange} className='border border-green-400 rounded-full px-3 py-1 w-full' placeholder='Enter Username' type="text" name="username" id="username" />
                    <div className="relative">
                        <input ref={passwordRef} value={form.password} onChange={handleChange} className='border border-green-400 rounded-full px-3 py-1 w-full' placeholder='Enter Password' type="password" name="password" id="password" />
                        <span className='absolute right-1 top-2 cursor-pointer' onClick={showPassword}>
                            <img ref={ref} className='w-[20px] h-[20px]' src="icons/eyeshow.svg" alt="" />
                        </span>
                    </div>
                    
                </div>
                <button onClick={savePassword} className='bg-green-500 rounded-full px-4 py-1 border border-green-900 hover:bg-green-300 flex justify-center items-center font-medium'>
                    <lord-icon
                        src="https://cdn.lordicon.com/zrkkrrpl.json"
                        trigger="hover"
                        colors="primary:#242424,secondary:#242424">
                    </lord-icon>
                    Save</button>
            </div>
            <div className='passwords mx-auto md:px-52'>
                <h2 className='text-2xl font-bold'>Your Passwords</h2>
                {passwordArray.length == 0 && <div>No passwords to show</div>}
                {passwordArray.length != 0 &&
                    <table className="table-auto w-full rounded-md overflow-hidden">
                        <thead className='bg-green-800 text-white py-2'>
                            <tr>
                                <th>Site</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.map((item, index) => {

                                return <tr key={index}>
                                    <td className='py-2 text-center '>
                                        <div className='flex justify-center items-center gap-2'><a href={item.site} target='_blank'>{item.site}</a> <span onClick={() => { copyText(item.site) }}><img className='w-5 cursor-pointer' src="icons/copy.svg" alt="" /></span></div></td>
                                    <td className='py-2 text-center'> <div className='flex justify-center items-center gap-2'>{item.username} <span onClick={() => { copyText(item.username) }}><img className='w-5 cursor-pointer' src="icons/copy.svg" alt="" /></span></div></td>
                                    <td className='py-2 text-center'><div className='flex justify-center items-center gap-2'>{"*".repeat(item.password.length)} <span onClick={() => { copyText(item.password) }}><img className='w-5 cursor-pointer' src="icons/copy.svg" alt="" /></span></div></td>
                                    <td className='py-2 text-center'><div className='flex justify-center items-center gap-2'>
                                        <span className='cursor-pointer' onClick={() => { editPassword(item.id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="edit">
                                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                                            <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                                        </svg></span>
                                        <span className='cursor-pointer' onClick={() => { deletePassword(item.id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" id="delete">
                                            <path fill="#000" d="M15 3a1 1 0 0 1 1 1h2a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2h2a1 1 0 0 1 1-1h6Z"></path>
                                            <path fill="#000" fillRule="evenodd" d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3.5 2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Z" clipRule="evenodd"></path>
                                        </svg></span>

                                    </div></td>
                                </tr>
                            })}
                        </tbody>
                    </table>}
            </div>
        </>
    )

}

export default Manager
