import React from 'react'
import { assets, dummyUserData, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
    const user = dummyUserData;
    const location = useLocation;
    const [image, setImage]= useState('')
    const updateImage = async ()=>{
        user.image = URL.createObjectURL(image)
        setImage('')
    }
  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 border-r border-borderColor text-sm'>

        <div className='group relative'>
            <label htmlFor="image">
                <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' src={image ? URL.createObjectURL(image): user ?.image || "https://unsplash.com/photos/grayscale-photo-of-man-wearing-blazer-Kt8eGw8_S8Y" } alt="" />
                <input type="file" id='image' accept='image/*' hidden onChange={(e)=> setImage(e.target.files[0])} onBlur={updateImage} />

                <div className='absolute hidden top-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer '>
                    <img src={assets.edit_icon} alt="" />
                </div>
            </label>
        </div>
         {image && (
            <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer'>Save <img src={assets.check_icon} width={13} alt='' onClick={updateImage}/></button>
         )}
         <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>

         <div className='w-full'>
            {ownerMenuLinks.map((link, index)=>(
                <NavLink key={index} to={link.path} className={`relative flex items-center gap-2 w-full py-6 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600' } px-6`}>
                    <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="Car Icon" />
                    <span className='max-md:hidden'>{link.name}</span>
                    <div className={`${link.path === location.pathname && 'bg-primary/10'} absolute rounded-l right-0 h-8 w-1.5`}>

                    </div>
                </NavLink>

            ))}
         </div>
    </div>
  )
}

export default Sidebar
