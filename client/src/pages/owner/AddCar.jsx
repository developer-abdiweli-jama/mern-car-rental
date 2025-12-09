import React, { useState } from 'react'
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';

const AddCar = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking, including pricing,availability, and car specifications." />

      <form className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl' onSubmit={onSubmitHandler}>

        {/* Car Image */}
        <label htmlFor="car-image">
          <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-14 rounded cursor-pointer' />
          <input type="file" id="car-image" accept='image/*' hidden />
        </label>
        <p>Upload a picture of your car</p>
        {/* Car Details */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label >Brand </label>
            <input type="text" placeholder='e.g. BMW, Mercedes, Toyota, Audi...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.brand} onChange={e => setCar({ ...car, brand: e.target.value })} />
          </div>
          <div className='flex flex-col w-full'>
            <label >Model </label>
            <input type="text" placeholder='e.g.X5,E-Class M4' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.model} onChange={e => setCar({ ...car, model: e.target.value })} />
          </div>
        </div>

        {/* Car Year, Price, category */}
        <div className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label >Year </label>
            <input type="number" placeholder='2025' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.year} onChange={e => setCar({ ...car, year: e.target.value })} />
          </div>
          <div className='flex flex-col w-full'>
            <label >Daily Price ({currency})</label>
            <input type="number" placeholder='100' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.pricePerDay} onChange={e => setCar({ ...car, pricePerDay: e.target.value })} />
          </div>
          <div className='flex flex-col w-full'>
            <label >Category</label>
            <select onChange={e => setCar({ ...car, category: e.target })} value={car.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select Category</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
              <option value="Coupe">Coupe</option>
            </select>
          </div>
        </div>
        {/* Car Transmission Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <label >Transmission </label>
          <select onChange={e => setCar({ ...car, transmission: e.target })} value={car.transmission} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value="">Select Transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="semiAuto">Semi-Automatic</option>
          </select>
        </div>
        <div className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <label > Fuel Type </label>
          <select onChange={e => setCar({ ...car, fuel_type: e.target })} value={car.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value="">Select Fuel Type</option>
            <option value="Gas">Gas</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className='flex flex-col w-full'>
          <label >Seating Capacity </label>
          <input type="number" placeholder='4' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e => setCar({ ...car, seating_capacity: e.target.value })} />
        </div>
        {/* Car Location */}
        <div className='flex flex-col w-full'>
          <label >Location </label>
          <select onChange={e => setCar({ ...car, location: e.target })} value={car.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value="">Select a Location</option>
            <option value="New York">New York</option>
            <option value="Chicago">Chicago</option>
            <option value="Los Angels">Los Angels</option>
            <option value="Houston">Houston</option>
          </select>
        </div>
        {/* Car Description */}
        <div className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label >Description </label>
            <textarea rows={5} placeholder='e.g. Alucurious SUV with a specious interior and powerful engine' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.description} onChange={e => setCar({ ...car, description: e.target.value })}> </textarea>
            </div>
          </div>
          <button className='flex items-center gap-2  px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer '>
            <img src={assets.tick_icon} alt=""  /> List Your Car
          </button>
      </form>

    </div>
  )
}

export default AddCar
