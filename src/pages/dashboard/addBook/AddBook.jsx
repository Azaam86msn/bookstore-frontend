// src/pages/dashboard/addBook/AddBook.jsx
import React, { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { useForm } from "react-hook-form";
import { useAddBookMutation } from "../../../redux/features/books/booksApi";
import Swal from "sweetalert2";

const AddBook = () => {
  const { register, handleSubmit, reset } = useForm();
  const [addBook, { isLoading }] = useAddBookMutation();

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageFileName, setCoverImageFileName] = useState("");
  const [epubFile, setEpubFile] = useState(null);
  const [epubFileName, setEpubFileName] = useState("");

  // State for linked words
  const [links, setLinks] = useState([{ phrase: "", url: "" }]);

  const addLinkField = () => setLinks([...links, { phrase: "", url: "" }]);

  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const onSubmit = async (data) => {
    if (!coverImageFile || !epubFile) {
      Swal.fire({
        icon: "error",
        title: "Missing Files",
        text: "Both cover image and EPUB file are required.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("trending", data.trending || false);
    formData.append("oldPrice", data.oldPrice);
    formData.append("newPrice", data.newPrice);
    formData.append("coverImage", coverImageFile);
    formData.append("epubFile", epubFile);
    formData.append("linkedWords", JSON.stringify(links));

    try {
      await addBook(formData).unwrap();

      Swal.fire({
        title: "Book added",
        text: "Your book is uploaded successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!",
      });

      reset();
      setCoverImageFile(null);
      setCoverImageFileName("");
      setEpubFile(null);
      setEpubFileName("");
      setLinks([{ phrase: "", url: "" }]);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to add book. Please try again.",
      });
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImageFileName(file.name);
    }
  };

  const handleEpubFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEpubFile(file);
      setEpubFileName(file.name);
    }
  };

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
          rules={{ required: "Title is required" }}
        />
        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
          rules={{ required: "Description is required" }}
        />
        <SelectField
          label="Category"
          name="category"
          options={[
            { value: "", label: "Choose A Category" },
            { value: "business", label: "Business" },
            { value: "technology", label: "Technology" },
            { value: "fiction", label: "Fiction" },
            { value: "horror", label: "Horror" },
            { value: "adventure", label: "Adventure" },
          ]}
          register={register}
          rules={{ required: "Category is required" }}
        />

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register("trending")}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">
              Trending
            </span>
          </label>
        </div>

        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
          rules={{ required: "Old price is required" }}
        />
        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
          register={register}
          rules={{ required: "New price is required" }}
        />

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="mb-2 w-full"
            required
          />
          {coverImageFileName && (
            <p className="text-sm text-gray-500">
              Selected: {coverImageFileName}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Book File (EPUB)
          </label>
          <input
            type="file"
            accept=".epub"
            onChange={handleEpubFileChange}
            className="mb-2 w-full"
            required
          />
          {epubFileName && (
            <p className="text-sm text-gray-500">Selected: {epubFileName}</p>
          )}
        </div>

        {/* Linked Words Section */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Linked Words (Phrase + URL)
          </label>
          {links.map((link, idx) => (
            <div
              key={`${link.phrase}-${link.url}`}
              className="flex space-x-2 mb-2"
            >
              <input
                type="text"
                value={link.phrase}
                onChange={(e) => updateLink(idx, "phrase", e.target.value)}
                placeholder="Phrase"
                className="w-1/2 border rounded px-2 py-1"
                required
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(idx, "url", e.target.value)}
                placeholder="https://..."
                className="w-1/2 border rounded px-2 py-1"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addLinkField}
            className="text-blue-600 text-sm mt-1"
          >
            + Add another
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-bold rounded-md"
        >
          {isLoading ? <span>Adding...</span> : <span>Add Book</span>}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
