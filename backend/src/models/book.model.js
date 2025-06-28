import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  publisher: {
    type: String,
    trim: true,
  },
  publishedYear: {
    type: String,
    trim: true,
  },
  coverUrl: {
    type: String,
    required: true, 
  },
  edition: {
    type: String,
    trim: true,
  },
  grade: {
    type: String,
    trim: true,
  },
},
{
  timestamps: true, 
}
);

export const Book =  mongoose.model("Book", bookSchema);
