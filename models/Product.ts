import { Schema, model, SchemaTypes  } from "mongoose";
import { ProductModel } from '../types'
import { NextFunction } from 'express'

const categoryBrands: Record<string, string[]> = {
    smartwatches: ['apple', 'fitbit', 'samsung'],
    computing: ['hp', 'lenovo', 'dell'],
    drones: ['dji', 'parrot', 'autel'],
    gaming: ['sony', 'microsoft', 'nintendo'],
    phonesAndTabs: ['iphone', 'samsung', 'google'],
    televisions: ['lg', 'samsung', 'sony'],
    audio: ['bose', 'sony', 'jbl'],
    photography: ['nikon', 'canon', 'sony'],
    homeAppliances: ['lg', 'samsung', 'whirlpool'],
};

const ProductSchema = new Schema<ProductModel>({
      name: {
        type: String,
        trim: true,
        required: [true, 'Please provide product name'],
        maxlength: [100, 'Name can not be more than 100 characters'],
      },
      price: {
        type: Number,
        required: [true, 'Please provide product price'],
        default: 0,
      },
      description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [1000, 'Description can not be more than 1000 characters'],
      },
      images: {
        type: [String],
        required: [true, 'Please provide product image'],
      },
      category: {
        type: String,
        required: [true, 'Please provide product category'],
        enum: [
            'smartwatches', 'computing', 'drones', 'gaming', 'phonesAndTabs', 
            'televisions', 'audio', 'photography', 'homeAppliances'
        ],
      },
      brand: {
        type: String,
        required: [true, 'Please provide product brand'],
        validate: {
            validator: function (this: ProductModel, value: string) {
                const category = this.category;
                const allowedBrands = categoryBrands[category];
                return allowedBrands ? allowedBrands.includes(value) : false;
            },
            message: '{VALUE} is not a valid brand for the selected category',
        },
      },
      featured: { type: Boolean, default: false },
      QuantityInStock: {
        type: Number,
        required: [true, 'Please provide product quantity'],
        default: 20,
      },
      averageRating: { type: Number, default: 0 },
      numOfReviews: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      createdBy: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
}, 
{ 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
});

ProductSchema.pre("findOneAndDelete", async function (next) {
    const Review = model('Review');
    await Review.deleteMany({ product: this.getQuery()._id });
    next()
});
  
export default model<ProductModel>('Product', ProductSchema);