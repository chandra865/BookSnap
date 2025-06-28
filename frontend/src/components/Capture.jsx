import React, { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { callGeminiVision } from "../utility/callGeminiVision";
import { toBase64 } from "../utility/toBase64";
import {useNavigate} from "react-router-dom";
import Loading from "./Loading";
import axios from "axios";  
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const Capture = () => {
  const [image, setImage] = useState(null);
  const [ogImg, setOgImage] = useState(null);
  const [provider, setProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [bookData, setBookData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const inputRef = useRef();

  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setOgImage(file);
      setImage(URL.createObjectURL(file));
      if (provider === "gemini" && apiKey) {
        await extractFromImage(file);
      }
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    
    if (file) {
      setOgImage(file);
      setImage(URL.createObjectURL(file));
      if (provider === "gemini" && apiKey) {
        await extractFromImage(file);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setImage(null);
    setOgImage(null);
    inputRef.current.value = "";
  };

  const handleSaveLLMConfig = () => {
    if (!provider || !apiKey) {
      alert("Please select a provider and enter your API key.");
      return;
    }
    alert(
      `LLM Config Saved:\nProvider: ${provider}\nKey: ${apiKey.slice(0, 5)}***`
    );
  };

  const toTitleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const extractFromImage = async (file) => {
    try {
      setLoading(true);
      const base64 = await toBase64(file);
      const rawData = await callGeminiVision(base64, apiKey);
      setLoading(false);
      const data = {
        title: toTitleCase(rawData.title),
        author: toTitleCase(rawData.author),
        grade: toTitleCase(rawData.grade),
        category: toTitleCase(rawData.category),
        publisher: toTitleCase(rawData.publisher),
        publishedYear: toTitleCase(rawData.publishedYear),
        edition: toTitleCase(rawData.edition),
      };
      setBookData(data); 
      setShowModal(true);

      console.log("Extracted Book Data:", data);
     
    } catch (err) {
      console.error("Extraction failed:", err.message);
      alert(
        "Extraction failed. Please check your API key or try another image."
      );
    }
  };

  const saveBookToBackend = async () => {
  try {
    // Create FormData object
    setLoading(true);
    const formData = new FormData();
    formData.append('cover', ogImg); 
    formData.append('title', bookData.title);
    formData.append('author', bookData.author);
    formData.append('category', bookData.category);
    formData.append('publisher', bookData.publisher);
    formData.append('publishedYear', bookData.publishedYear);
    formData.append('edition', bookData.edition);
    formData.append('grade', bookData.grade);

    // Send POST request
    const response = await axios.post(`${API_BASE_URL}/api/v1/book/add-book`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Book saved:', response.data);

    alert('Book saved successfully!');
    setShowModal(false);
    setLoading(false);
    navigate('/inventory'); // Redirect to inventory page after saving
  } catch (err) {
    console.error('Save error:', err);
    alert('Failed to save book data.');
  }
};

if (loading) {  
  return <Loading/>;
}

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Configure LLM and Upload Cover
      </h1> */}

      {/* LLM Configuration */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">LLM Setup</h2>
        <label className="block mb-2">
          <span className="text-sm text-gray-700">Choose Provider</span>
          <select
            className="w-full mt-1 border rounded px-3 py-2"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="">-- Select --</option>
            {/* <option value="openai">OpenAI Vision</option> */}
            <option value="gemini">Google Gemini</option>
          </select>
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-700">API Key</span>
          <input
            type="password"
            className="w-full mt-1 border rounded px-3 py-2"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your API key"
          />
        </label>
        {/* <button
          onClick={handleSaveLLMConfig}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save API Config
        </button> */}
      </div>

      {/* Image Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-white hover:bg-gray-50 transition-all"
        onClick={() => inputRef.current.click()}
      >
        <p className="text-gray-600">
          Drag & drop an image here or click to browse
        </p>
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Select Image
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {image && (
        <div className="mt-6 text-center relative w-fit mx-auto">
          <button
            onClick={removeImage}
            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
            aria-label="Remove image"
          >
            <FaTimes size={14} />
          </button>
          <img
            src={image}
            alt="Preview"
            className="w-64 mx-auto rounded shadow-md"
          />
          <p className="mt-2 text-sm text-gray-600">Image preview</p>
        </div>
      )}

      {showModal && bookData && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-12 flex items-center justify-center z-50">
          <div className="bg-gray-200 p-6 rounded-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">Verify Book Details</h2>

            <div className="flex gap-4">
              <img
                src={image}
                alt="Book"
                className="w-28 h-40 object-cover rounded shadow"
              />
              <div className="flex-1 space-y-2">
                <label className="font-bold">Title</label>
                <input
                  type="text"
                  value={bookData.title || ""}
                  onChange={(e) =>
                    setBookData({ ...bookData, title: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Book Title"
                />
                <label className="font-bold">Author</label>
                <input
                  type="text"
                  value={bookData.author || ""}
                  onChange={(e) =>
                    setBookData({ ...bookData, author: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Author"
                />
                {/* Grade Dropdown */}
                <label className="font-bold">Grade</label>
                <select
                  value={bookData.grade || ""}
                  onChange={(e) =>
                    setBookData({ ...bookData, grade: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-4"
                >
                  <option value="">-- Select Grade --</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                </select>

                {/* Category Dropdown */}
                {/* Category Dropdown */}
                <label className="font-bold">Category</label>
                <select
                  value={bookData.category || ""}
                  onChange={(e) =>
                    setBookData({ ...bookData, category: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-4"
                >
                  <option value="">-- Select Category --</option>
                  <option value="Science">Science</option>
                  <option value="Math">Math</option>
                  <option value="Literature">Literature</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Language">Language</option>
                  <option value="Art">Art</option>
                </select>

                {/* Published Year Input (Year Only) */}
                <label className="font-bold">Published Year</label>
                <input
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={bookData.publishedYear || ""}
                  onChange={(e) =>
                    setBookData({ ...bookData, publishedYear: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-4"
                  placeholder="e.g. 2022"
                />

                <label className="font-bold">Publisher</label>
                <input
                  type="text"
                  value={bookData.publisher || ""}
                  onChange={(e) =>
                    setBookData({ ...bookData, publisher: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Publisher"
                />

                <label className="font-bold">Edition</label>
                <input
                  type="text"
                  value={bookData.edition || ""}
                  onChange={(e) =>
                    setBookData({ ...bookData, edition: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Edition"
                />
                
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveBookToBackend}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Capture;
