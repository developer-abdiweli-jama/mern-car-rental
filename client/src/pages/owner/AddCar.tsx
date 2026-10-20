import { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import api from '../../api/axios'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Alert } from '../../components/ui/alert'

const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Coupe']
const TRANSMISSIONS = ['Automatic', 'Manual', 'Semi-Automatic']
const FUEL_TYPES = ['Gas', 'Petrol', 'Diesel', 'Electric', 'Hybrid']
const LOCATIONS = ['New York', 'Chicago', 'Los Angeles', 'Houston']

type CarForm = {
  brand: string
  model: string
  year: string
  pricePerDay: string
  category: string
  transmission: string
  fuel_type: string
  seating_capacity: string
  location: string
  description: string
}

const AddCar = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [car, setCar] = useState<CarForm>({
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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => () => {
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file) {
      setImageUrl('')
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('brand', car.brand)
      formData.append('model', car.model)
      formData.append('year', String(Number(car.year) || 0))
      formData.append('pricePerDay', String(Number(car.pricePerDay) || 0))
      formData.append('category', car.category)
      formData.append('transmission', car.transmission)
      formData.append('fuel_type', car.fuel_type)
      formData.append('seating_capacity', String(Number(car.seating_capacity) || 0))
      formData.append('location', car.location)
      formData.append('description', car.description)
      if (image) formData.append('image', image)
      else if (imageUrl.trim()) formData.append('image', imageUrl.trim())

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
      setImageUrl('')
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.error || 'Failed to list car')
    } finally {
      setLoading(false)
    }
  }

  const openFilePicker = () => {
    const input = document.getElementById('car-image') as HTMLInputElement | null
    input?.click()
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1 bg-background'>
      <div className='max-w-2xl mx-auto'>
        <Title title='Add New Car' subTitle='List a new vehicle for booking, including pricing, availability, and specifications.' align='left' />

        {success && (
          <Alert variant='success' title='Car listed successfully!'>
            Your vehicle will appear in browse once confirmed.
          </Alert>
        )}

        {error && <Alert variant='error' title='Failed to list car'>{error}</Alert>}

        <Card padding='lg'>
          <CardContent className='space-y-6'>
            <form onSubmit={onSubmitHandler} className='space-y-6'>
              <div>
                <label className='block text-body-sm font-medium text-text mb-2'>Car image</label>
                <div className='flex items-center gap-4'>
                  <img
                    src={imagePreview || imageUrl || assets.upload_icon}
                    alt=''
                    className={`h-16 w-16 rounded-xl cursor-pointer ${imagePreview ? 'object-cover border border-border' : 'border-2 border-dashed border-border'}`
                    }
                    onClick={openFilePicker}
                  />
                  <input type='file' id='car-image' accept='image/*' hidden onChange={handleImageChange} />
                </div>
                <p className='text-caption text-text-muted mt-1'>Upload a picture of your car</p>
                <label htmlFor='car-image-url' className='block text-body-sm font-medium text-text mt-4 mb-1'>Or paste an image URL</label>
                <Input
                  id='car-image-url'
                  type='url'
                  value={imageUrl}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setImageUrl(e.target.value)
                    setImage(null)
                    setImagePreview(null)
                  }}
                  placeholder='https://images.example.com/car.jpg'
                  className='w-full'
                />
                <p className='text-caption text-text-muted mt-1'>A public HTTPS image URL works without Cloudinary. File uploads need Cloudinary configured on the server.</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex flex-col'>
                  <label className='text-body-sm font-medium text-text mb-1'>Brand</label>
                  <Input
                    placeholder='e.g. BMW, Mercedes, Toyota'
                    required
                    value={car.brand}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, brand: e.target.value })}
                    className='w-full'
                  />
                </div>
                <div className='flex flex-col'>
                  <label className='text-body-sm font-medium text-text mb-1'>Model</label>
                  <Input
                    placeholder='e.g. X5, E-Class, M4'
                    required
                    value={car.model}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, model: e.target.value })}
                    className='w-full'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                <div className='flex flex-col'>
                  <label className='text-body-sm font-medium text-text mb-1'>Year</label>
                  <Input
                    type='number'
                    placeholder='2025'
                    required
                    value={car.year}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, year: e.target.value })}
                    className='w-full'
                  />
                </div>
                <div className='flex flex-col'>
                  <label className='text-body-sm font-medium text-text mb-1'>Daily price ({currency})</label>
                  <Input
                    type='number'
                    placeholder='100'
                    required
                    value={car.pricePerDay}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, pricePerDay: e.target.value })}
                    className='w-full'
                  />
                </div>
                <div className='flex flex-col'>
                  <label className='text-body-sm font-medium text-text mb-1'>Category</label>
                  <Select
                    required
                    value={car.category}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setCar({ ...car, category: e.target.value })}
                    className='w-full'
                  >
                    <option value=''>Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                <div className='flex flex-col'>
                  <label className='text-body-sm font-medium text-text mb-1'>Transmission</label>
                  <Select
                    required
                    value={car.transmission}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setCar({ ...car, transmission: e.target.value })}
                    className='w-full'
                  >
                    <option value=''>Select transmission</option>
                    {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </div>
                <div className='flex flex-col'>
                  <label className='text-body-sm font-medium text-text mb-1'>Fuel type</label>
                  <Select
                    required
                    value={car.fuel_type}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setCar({ ...car, fuel_type: e.target.value })}
                    className='w-full'
                  >
                    <option value=''>Select fuel type</option>
                    {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </Select>
                </div>
                <div className='flex flex-col'>
                  <label className='text-body-sm font-medium text-text mb-1'>Seating capacity</label>
                  <Input
                    type='number'
                    placeholder='4'
                    required
                    value={car.seating_capacity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, seating_capacity: e.target.value })}
                    className='w-full'
                  />
                </div>
              </div>

              <div className='flex flex-col'>
                <label className='text-body-sm font-medium text-text mb-1'>Location</label>
                <Select
                  required
                  value={car.location}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setCar({ ...car, location: e.target.value })}
                  className='w-full'
                >
                  <option value=''>Select a location</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </Select>
              </div>

              <div className='flex flex-col'>
                <label className='text-body-sm font-medium text-text mb-1'>Description</label>
                <textarea
                  rows={4}
                  placeholder='Describe your car...'
                  required
                  className='w-full px-4 py-3 rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50'
                  value={car.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCar({ ...car, description: e.target.value })}
                />
              </div>

              <Button type='submit' isLoading={loading} className='w-full'>
                <img src={assets.tick_icon} alt='' className='w-4 h-4' /> {loading ? 'Listing...' : 'List Your Car'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddCar
