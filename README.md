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

## Steps to Get Gemini API Key:

- Go to: https://makersuite.google.com/app
- Sign in with your Google account.
- Visit: https://aistudio.google.com/app/apikey
- Click “Create API Key”

Copy the key shown — this is what they paste into your app.
---

## Setup Instructions

### Backend

```bash
git clone https://github.com/chandra865/BookSnap.git
cd BookSnap/backend
npm install
npm start
```
### frontend
```bash
cd BookSnap/frontend
npm install
npm run dev
```

## Screenshots

### Book Upload Page

![Upload Page](./assets/Capture_page.PNG)

### Book Details Extracted

![Book Details](./assets/verify_capture.PNG)

###  Inventory View

![Inventory Grid](./assets/inventory_page.PNG)

```
