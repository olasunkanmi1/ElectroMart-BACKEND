import { StatusCodes } from 'http-status-codes';
import { ControllerFunction, QueryObject } from '../types';
import Product from '../models/Product';
import { BadRequestError, NotFoundError } from '../errors';
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';

// create product
const createProduct: ControllerFunction = async (req, res) => {
    const { 
        name, price, description, images, 
        category, brand, QuantityInStock, discount
    } = req.body;

    if(!name || !price || !description || !images || !category || !brand || !QuantityInStock ) {
        throw new BadRequestError('please provide all values');
    }

    req.body.createdBy = req.user?.userId;
    req.body.newPrice = parseFloat( (price - ((discount || 0 / 100) * price)).toFixed(2) );
    const product = await Product.create(req.body)

    res.status(StatusCodes.CREATED).json({ product });
};
  
// get all products
const getAllProducts: ControllerFunction = async (req, res) => {
    const { category, featured, brand, discount, rating, name, sort }  = req.query;
    const queryObject: QueryObject = {};

    if(category) {
        queryObject.category = category.toString()
    }

    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }

    if(brand) {
        queryObject.brand = brand.toString()
    }
    
    if(discount) {
        const discountValue = parseInt(discount.toString());
        if(discountValue === 0) {
            queryObject.discount = { $lte: 9 };
        } else {
            queryObject.discount = { $gte: discountValue };
        }
    }
    
    if(rating) {
        const ratingValue = parseInt(rating.toString());
        queryObject.rating = { $gte: ratingValue };
    }
    
    // if(name) {
    //     // i = case insensitive -- returns any product where the input letter appears
    //     queryObject.name = { $regex: name.toString(), $options: 'i'}
    // }
    let result = Product.find(queryObject);
    
    if (sort) {
        const sortOrder = sort === 'price-asc' ? 1 : sort === 'price-desc' ? -1 : 'featured';

        if(sortOrder === 'featured') {
            result = result.sort({ featured: -1 });
        } else {
            // Handle sorting by price (numeric sorting)
            result = result.sort({ newPrice: sortOrder });
        }
    }

    const products = await result
    res.status(StatusCodes.OK).json({ products, nbHits: products.length });
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
    const uploadedImages = req.files?.images as UploadedFile[];
    if (!uploadedImages) {
        throw new BadRequestError('Please provide images');
    }

    let imagesSrc: string[] = [];

    for(const image of uploadedImages) {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            use_filename: true,
            folder: 'electromart',
            upload_preset: 'electro-mart'
        });

        imagesSrc.push(result.secure_url);
        fs.unlinkSync(image.tempFilePath); //remove tmp files
    }

    return res.status(StatusCodes.OK).json({ images: imagesSrc });
};

export { 
    createProduct, getAllProducts, getSingleProduct, 
    updateProduct, deleteProduct, uploadImage,
}