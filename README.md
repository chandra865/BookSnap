# Book Inventory Builder

A web application that helps educators and librarians digitize and manage book collections by simply uploading photos of book covers. The app uses **AI Vision models** (Google Gemini Flash) to extract book details like title, author, grade, subject, and more.

---

## Features

- Upload book cover images (drag-and-drop or camera)
- AI extracts metadata: title, author, category, grade, publisher, etc.
- Edit and verify extracted details
- Save books to inventory
- View/search/delete books from inventory
- Support for Google Gemini Flash
- Cloudinary integration for image hosting

---

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Image Upload**: Multer + Cloudinary
- **AI Vision**: Google Gemini Flash

---

## Setup Instructions

### Backend

1. **Clone the repo**

```bash
git clone https://github.com/your-username/book-inventory-builder.git
cd book-inventory-builder/backend
