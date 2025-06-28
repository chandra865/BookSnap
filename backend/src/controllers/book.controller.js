import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import {Book} from '../models/book.model.js';

export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      publisher,
      publishedYear,
      edition,
      grade,
    } = req.body;
    console.log(req.body);
    console.log(req.file);
    // Validate required fields
    console.log('Received book data')
    if (!title || !req.file) {
      return res.status(400).json({ message: 'Title and cover image are required.' });
    }

    // Upload to Cloudinary
    console.log(req.file.path);
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'book-covers',
    });

    // Delete local temp file after upload
    fs.unlinkSync(req.file.path);


    const newBook = new Book({
      title,
      author,
      category,
      publisher,
      publishedYear,
      edition,
      grade,
      coverUrl: result.secure_url, // Save Cloudinary image URL
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      message: 'Book saved successfully.',
      book: savedBook,
    });

  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ message: 'Server error while saving the book.' });
  }
};


export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }); // optional: sort by latest
    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching books.' });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Book.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
};


export const searchBooks = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';

    const books = await Book.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { author: { $regex: searchQuery, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};
