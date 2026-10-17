import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import api from '../../api/axios'

const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Coupe']
const TRANSMISSIONS = ['Automatic', 'Manual', 'Semi-Automatic']
const FUEL_TYPES = ['Gas', 'Petrol', 'Diesel', 'Electric', 'Hybrid']
const LOCATIONS = ['New York', 'Chicago', 'Los Angeles', 'Houston']

const AddCar = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('brand', car.brand)
      formData.append('model', car.model)
      formData.append('year', Number(car.year))
      formData.append('pricePerDay', Number(car.pricePerDay))
      formData.append('category', car.category)
      formData.append('transmission', car.transmission)
      formData.append('fuel_type', car.fuel_type)
      formData.append('seating_capacity', Number(car.seating_capacity))
      formData.append('location', car.location)
      formData.append('description', car.description)
      if (image) formData.append('image', image)

      await api.post('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setSuccess(true)
      setCar({
        brand: '', model: '', year: '', pricePerDay: '', category: '',
        transmission: '', fuel_type: '', seating_capacity: '', location: '', description: '',
      })
      setImage(null)
      setImagePreview(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to list car')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title title='Add New Car' subTitle='Fill in details to list a new car for booking, including pricing, availability, and car specifications.' />

      {success && (
        <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm'>
          Car listed successfully! It will appear in browse once you confirm.
        </div>
      )}

      {error && <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm'>{error}</div>}

      <form className='flex flex-col gap-5 text-gray-700 text-sm mt-6 max-w-2xl' onSubmit={onSubmitHandler}>
        <div>
          <label className='block text-sm font-medium mb-2'>Car Image</label>
          <div className='flex items-center gap-4'>
            <img
              src={imagePreview || assets.upload_icon}
              alt=''
              className={`h-16 w-16 rounded cursor-pointer ${imagePreview ? 'object-cover border' : 'border-dashed border-borderColor'}`}
              onClick={() => document.getElementById('car-image').click()}
            />
            <input type='file' id='car-image' accept='image/*' hidden onChange={handleImageChange} />
          </div>
          <p className='text-xs text-gray-500 mt-1'>Upload a picture of your car</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label className='font-medium mb-1'>Brand</label>
            <input
              type='text'
              placeholder='e.g. BMW, Mercedes, Toyota'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className='flex flex-col w-full'>
            <label className='font-medium mb-1'>Model</label>
            <input
              type='text'
              placeholder='e.g. X5, E-Class, M4'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label className='font-medium mb-1'>Year</label>
            <input
              type='number'
              placeholder='2025'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>
          <div className='flex flex-col w-full'>
            <label className='font-medium mb-1'>Daily Price ({currency})</label>
            <input
              type='number'
              placeholder='100'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>
          <div className='flex flex-col w-full'>
            <label className='font-medium mb-1'>Category</label>
            <select
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
              value={car.category}
              onChange={(e) => setCar({ ...car, category: e.target.value })}
            >
              <option value=''>Select Category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label className='font-medium mb-1'>Transmission</label>
            <select
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
              value={car.transmission}
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
            >
              <option value=''>Select Transmission</option>
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className='font-medium mb-1'>Fuel Type</label>
            <select
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
              value={car.fuel_type}
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
            >
              <option value=''>Select Fuel Type</option>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className='font-medium mb-1'>Seating Capacity</label>
            <input
              type='number'
              placeholder='4'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
              value={car.seating_capacity}
              onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
            />
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <label className='font-medium mb-1'>Location</label>
          <select
            required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
            value={car.location}
            onChange={(e) => setCar({ ...car, location: e.target.value })}
          >
            <option value=''>Select a Location</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className='flex flex-col w-full'>
          <label className='font-medium mb-1'>Description</label>
          <textarea
            rows={4}
            placeholder='Describe your car...'
            required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary'
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-fit cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all'
        >
          <img src={assets.tick_icon} alt='' /> {loading ? 'Listing...' : 'List Your Car'}
        </button>
      </form>
    </div>
  )
}

export default AddCar
