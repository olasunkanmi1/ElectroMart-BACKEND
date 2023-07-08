import { Schema, model, SchemaTypes  } from "mongoose";
import { ReviewModel } from '../types'

const ReviewSchema = new Schema<ReviewModel>({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide rating'],
  },
  title: {
    type: String,
    trim: true,
    required: [true, 'Please provide review title'],
    maxlength: 100,
  },
  comment: {
    type: String,
    required: [true, 'Please provide review comment'],
  },
  createdBy: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the user who created the review'],
  },
  product: {
    type: SchemaTypes.ObjectId,
    ref: 'Product',
    required: true,
  },
},{ 
    timestamps: true 
});

// Create a compound index on the product and createdBy fields in the Review 
// collection to ensure that each user can only submit one review per product.
ReviewSchema.index({ product: 1, createdBy: 1 }, { unique: true });

// ReviewSchema.statics.calculateAverageRating = async function (productId) {
//   const result = await this.aggregate([
//     { $match: { product: productId } },
//     {
//       $group: {
//         _id: null,
//         averageRating: { $avg: '$rating' },
//         numOfReviews: { $sum: 1 },
//       },
//     },
//   ]);

//   try {
//     await this.model('Product').findOneAndUpdate(
//       { _id: productId },
//       {
//         averageRating: Math.ceil(result[0]?.averageRating || 0),
//         numOfReviews: result[0]?.numOfReviews || 0,
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// ReviewSchema.post('save', async function () {
//   await this.constructor.calculateAverageRating(this.product);
// });

// ReviewSchema.post('remove', async function () {
//   await this.constructor.calculateAverageRating(this.product);
// });

export default model<ReviewModel>('Review', ReviewSchema);
