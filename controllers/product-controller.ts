import { StatusCodes } from 'http-status-codes';
import { ControllerFunction } from '../types';
import Product from '../models/Product';
import { BadRequestError, NotFoundError } from '../errors';

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

export { 
    createProduct, getAllProducts, getSingleProduct, 
    updateProduct, deleteProduct, uploadImage,
}