import { Router } from "express";
import { createBook, getAllBooks, deleteBook, searchBooks} from "../controllers/book.controller.js";
import uploadImage from "../middlewares/multer.middleware.js";
const router = Router();

router.post("/add-book", uploadImage.single('cover'), createBook);
router.get("/get-books",getAllBooks);
router.delete("/delete-book/:id", deleteBook);
router.get("/search-books", searchBooks);


export default router;