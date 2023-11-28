import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    image2: { type: String, required: false },
    image3: { type: String, required: false },
    reference: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0, required: true },
    size: { type: String, required: true },
    countInStock: { type: Number, default: 0, required: true },
    notes: { type: String, required: true },
    includes: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
