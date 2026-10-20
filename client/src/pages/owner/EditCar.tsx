import { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Car } from '../../types'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import api from '../../api/axios'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Select, Textarea } from '../../components/ui/input'
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
  image: string
}

const EditCar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const [car, setCar] = useState<CarForm>({
    brand: '', model: '', year: '', pricePerDay: '', category: '',
    transmission: '', fuel_type: '', seating_capacity: '', location: '',
    description: '', image: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => () => {
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/cars/${id}`)
        const c = res.data.data.car as Car
        setCar({
          brand: c.brand, model: c.model, year: String(c.year), pricePerDay: String(c.pricePerDay),
          category: c.category, transmission: c.transmission, fuel_type: c.fuel_type,
          seating_capacity: String(c.seating_capacity), location: c.location,
          description: c.description || '', image: c.image || '',
        })
        setImageUrl(c.image || '')
      } catch {
        setError('Failed to load vehicle')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchCar()
  }, [id])

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

      await api.put(`/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setSuccess(true)
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.error || 'Failed to update vehicle')
    } finally {
      setLoading(false)
    }
  }

  const openFilePicker = () => {
    const input = document.getElementById('car-image') as HTMLInputElement | null
    input?.click()
  }

  if (loading) return <div className='flex justify-center py-20 animate-pulse' />

  return (
    <div className='px-4 py-10 md:px-10 flex-1 bg-background'>
      <div className='max-w-2xl mx-auto'>
        <Title title='Edit Vehicle' subTitle='Update your car listing details.' align='left' />

        {success && (
          <Alert variant='success' title='Vehicle updated!'>
            Your changes have been saved.
          </Alert>
        )}

        {error && <Alert variant='error' title='Update failed'>{error}</Alert>}

        <Card padding='none'>
          <CardContent className='p-5 sm:p-8'>
            <form onSubmit={onSubmitHandler} className='space-y-8'>
              <div>
                <p className='mb-2 text-sm font-semibold text-text'>Vehicle photo</p>
                <div className='flex items-center gap-4 rounded-xl border border-dashed border-border bg-background p-4'>
                  <img
                    role='presentation'
                    src={imagePreview || imageUrl || assets.car_image1}
                    alt=''
                    className={`h-16 w-16 rounded-xl cursor-pointer ${imagePreview ? 'object-cover border border-border' : 'border-2 border-dashed border-border'}`}
                    onClick={openFilePicker}
                  />
                  <input type='file' id='car-image' accept='image/*' hidden aria-label='Upload vehicle photo' onChange={handleImageChange} />
                </div>
                <p className='text-caption text-text-muted mt-1'>Choose a replacement photo or keep the current image.</p>
                <Input
                  id='car-image-url'
                  label='Image URL'
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
              </div>

              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                <div className='flex flex-col'>
                  <Input
                    label='Brand'
                    placeholder='e.g. BMW, Mercedes, Toyota'
                    required
                    value={car.brand}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, brand: e.target.value })}
                    className='w-full'
                  />
                </div>
                <div className='flex flex-col'>
                  <Input
                    label='Model'
                    placeholder='e.g. X5, E-Class, M4'
                    required
                    value={car.model}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, model: e.target.value })}
                    className='w-full'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                <div className='flex flex-col'>
                  <Input
                    label='Year'
                    type='number'
                    min='1900'
                    max={new Date().getFullYear() + 1}
                    placeholder='2025'
                    required
                    value={car.year}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, year: e.target.value })}
                    className='w-full'
                  />
                </div>
                <div className='flex flex-col'>
                  <Input
                    label={`Daily price (${currency})`}
                    type='number'
                    min='1'
                    step='0.01'
                    placeholder='100'
                    required
                    value={car.pricePerDay}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, pricePerDay: e.target.value })}
                    className='w-full'
                  />
                </div>
                <div className='flex flex-col'>
                  <Select
                    label='Category'
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

              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                <div className='flex flex-col'>
                  <Select
                    label='Transmission'
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
                  <Select
                    label='Fuel type'
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
                  <Input
                    label='Seating capacity'
                    type='number'
                    min='1'
                    max='12'
                    placeholder='4'
                    required
                    value={car.seating_capacity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCar({ ...car, seating_capacity: e.target.value })}
                    className='w-full'
                  />
                </div>
              </div>

              <div className='flex flex-col'>
                <Select
                  label='Pickup location'
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
                <Textarea
                  label='Description'
                  rows={4}
                  placeholder='Describe your car, its condition, and what makes it a good fit for a trip.'
                  required
                  value={car.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCar({ ...car, description: e.target.value })}
                />
              </div>

              <div className='flex gap-3'>
                <Button type='submit' isLoading={loading} className='flex-1'>
                  Save changes
                </Button>
                <Button variant='outline' onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EditCar
