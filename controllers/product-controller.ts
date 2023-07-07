import { model } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ControllerFunction } from '../types';
import Product from '../models/Product';
import { BadRequestError, NotFoundError, ConflictError } from '../errors';
import { checkPermissions } from '../utils';

// create product
const createProduct: ControllerFunction = async (req, res) => {
    const { 
        name, price, description, images, 
        category, brand, QuantityInStock 
    } = req.body;

    if(!name || !price || !description || !images || !category || !brand || !QuantityInStock ) {
        throw new BadRequestError('please provide all values');
    }

    req.body.createdBy = req.user?.userId;
    const product = await Product.create(req.body)

    res.status(StatusCodes.CREATED).json({ product });
};
  
// get all products
const getAllProducts: ControllerFunction = async (req, res) => {
    const products = await Product.find({});

    res.status(StatusCodes.OK).json({ products, quantity: products.length });
};

// get single product
const getSingleProduct: ControllerFunction = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId }).populate('reviews');

    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
};

// update product
const updateProduct: ControllerFunction = async (req, res) => {
    const { id: productId } = req.params;
    const { 
        name, price, description, images, 
        category, brand, QuantityInStock 
    } = req.body;

    if(!name || !price || !description || !images || !category || !brand || !QuantityInStock ) {
        throw new BadRequestError('please provide all values');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.images = images;
    product.category = category;
    product.brand = brand;
    product.QuantityInStock = QuantityInStock;

    await product.save();
    res.status(StatusCodes.OK).json({ product });
};

// delete product
const deleteProduct: ControllerFunction = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOneAndDelete({ _id: productId });
    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }
    res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
};

// upload image
const uploadImage: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'ok' });
};

// save product
const saveProduct: ControllerFunction = async (req, res) => {
    const productAlreadySaved = await Product.findOne({ user: req.user?.userId, externalID: req.body.externalID });
    if(productAlreadySaved) {
      throw new ConflictError('Product already saved by user');
    }
    
    req.body.user = req.user?.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.OK).json({ product });
};

// get saved products
const getSavedProducts: ControllerFunction = async (req, res) => {
    const savedProducts =  await Product.find({ user: req.user?.userId })
    res.status(StatusCodes.OK).json({ savedProducts });
};

// remove saved product
const unsaveProduct: ControllerFunction = async (req, res) => {
    const { externalID } = req.params;

    const product = await Product.findOne({ externalID });
    if(!product) {
        throw new NotFoundError(`No product with externalID: ${externalID}`)
    }

    checkPermissions({ requestUser: req.user, resourceUserId: product.createdBy })

    await product.deleteOne();
    res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
}

// remove all saved properties
const unsaveAllProducts: ControllerFunction = async (req, res) => {
    const product = model('Product');
    
    await product.deleteMany({ user: req.user?.userId });
    res.status(StatusCodes.OK).json({ msg: 'Success! All Saved Productss removed.' });
}

export { 
    createProduct, getAllProducts, getSingleProduct, 
    updateProduct, deleteProduct, uploadImage,
    saveProduct, getSavedProducts, unsaveProduct, unsaveAllProducts
}