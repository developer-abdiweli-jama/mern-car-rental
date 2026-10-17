import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'

const Hero = () => {
    const [pickupLocation, setPickupLocation] = useState('')
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-light text-center pt-16'>

            <div className='mb-12'>
                <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-8'>
                    Luxury Cars on Rent
                </h1>
            </div>

            <form className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-4xl bg-white border border-borderColor shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 w-full">
                    <div className='flex flex-col items-start gap-1'>
                        <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required >
                            <option value="">Pickup Location</option>
                            {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
                        </select>
                        <p className='px-1 text-sm text-gray-500'>{pickupLocation ? pickupLocation : 'Please select a location'}</p>
                    </div>
                    {/* Pick-up Date */}
                    <div className='flex flex-col items-start gap-1'>
                        <label htmlFor='pickup-date' className='text-sm font-medium text-gray-700'>Pick-up Date</label>
                        <input
                            type='date'
                            id='pickup-date'
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className='text-gray-500 bg-transparent border-none outline-none'
                            required
                        />
                    </div>

                    {/* Return Date */}
                    <div className='flex flex-col items-start gap-1'>
                        <label htmlFor='return-date' className='text-sm font-medium text-gray-700'>Return Date</label>
                        <input
                            type='date'
                            id='return-date'
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className='text-gray-500 bg-transparent border-none outline-none'
                            required
                        />
                    </div>
                </div>

                <button
                    type="button"
                    className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer transition-colors'
                >
                    <img src={assets.search_icon} alt='Search' className='w-5 h-5 brightness-0 invert' />
                    <span>Search</span>
                </button>
            </form >
            <img src={assets.main_car} alt="car" className='max-h-74' />
        </div >
    )
}

export default Hero


