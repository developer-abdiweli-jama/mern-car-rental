import { AppError } from '../middleware/errorHandler.js';
import { Car } from '../models/Car.js';
import { saveCarImage } from '../services/imageStorage.js';

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFilter = (query) => {
  const filter = {};
  if (query.location) filter.location = new RegExp(escapeRegExp(query.location), 'i');
  if (query.category) filter.category = query.category;
  if (query.isAvailable === 'true') filter.isAvailable = true;
  if (query.isAvailable === 'false') filter.isAvailable = false;
  if (query.minPrice || query.maxPrice) {
    filter.pricePerDay = {};
    if (query.minPrice) filter.pricePerDay.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.pricePerDay.$lte = Number(query.maxPrice);
  }
  if (query.search) {
    filter.$or = [
      { brand: new RegExp(escapeRegExp(query.search), 'i') },
      { model: new RegExp(escapeRegExp(query.search), 'i') },
      { location: new RegExp(escapeRegExp(query.search), 'i') },
    ];
  }
  return filter;
};

export const getCars = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
  const skip = (page - 1) * limit;

  const filter = buildFilter(req.query);
  const sort = {};
  if (req.query.sort === 'price_asc') sort.pricePerDay = 1;
  else if (req.query.sort === 'price_desc') sort.pricePerDay = -1;
  else sort.createdAt = -1;

  const [cars, total] = await Promise.all([
    Car.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Car.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: { cars, page, limit, total, pages: Math.ceil(total / limit) },
  });
};

export const getCarById = async (req, res, next) => {
  const car = await Car.findById(req.params.id).lean();
  if (!car) return next(AppError('Vehicle not found', 404));
  return res.json({ success: true, data: { car } });
};

export const getOwnerCars = async (req, res) => {
  const cars = await Car.find({ owner: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: { cars } });
};

export const createCar = async (req, res) => {
  const carData = { ...req.body, owner: req.user._id };
  if (req.file) carData.image = await saveCarImage(req.file);
  const car = await Car.create(carData);
  return res.status(201).json({ success: true, data: { car } });
};

export const updateCar = async (req, res, next) => {
  let car = await Car.findById(req.params.id);
  if (!car) return next(AppError('Vehicle not found', 404));

  if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(AppError('Not authorized to update this vehicle', 403));
  }

  const allowed = [
    'brand', 'model', 'year', 'category', 'seating_capacity', 'fuel_type',
    'transmission', 'pricePerDay', 'location', 'description', 'image', 'isAvailable',
  ];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) car[field] = req.body[field];
  });

  await car.save();
  return res.json({ success: true, data: { car } });
};

export const deleteCar = async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) return next(AppError('Vehicle not found', 404));

  if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(AppError('Not authorized to delete this vehicle', 403));
  }

  await car.deleteOne();
  return res.json({ success: true, message: 'Vehicle deleted' });
};
