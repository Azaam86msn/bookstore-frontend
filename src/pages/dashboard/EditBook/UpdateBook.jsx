// src/pages/dashboard/EditBook/UpdateBook.jsx
import React, { useEffect, useState } from "react";
import InputField from "../addBook/InputField";
import SelectField from "../addBook/SelectField";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useFetchBookByIdQuery } from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";

const UpdateBook = () => {
  const { id } = useParams();
  const {
    data: bookData,
    isLoading,
    isError,
    refetch,
  } = useFetchBookByIdQuery(id);

  const { register, handleSubmit, setValue } = useForm();
  const [linkedWords, setLinkedWords] = useState([{ phrase: "", url: "" }]);

  useEffect(() => {
    if (bookData) {
      Object.entries({
        title: bookData.title,
        description: bookData.description,
        category: bookData.category,
        trending: bookData.trending,
        oldPrice: bookData.oldPrice,
        newPrice: bookData.newPrice,
        coverImage: bookData.coverImage,
      }).forEach(([key, value]) => setValue(key, value));

      setLinkedWords(
        bookData.linkedWords?.length
          ? bookData.linkedWords
          : [{ phrase: "", url: "" }]
      );
    }
  }, [bookData, setValue]);

  const updateLink = (index, field, value) => {
    const updated = [...linkedWords];
    updated[index][field] = value;
    setLinkedWords(updated);
  };

  const addLinkField = () =>
    setLinkedWords([...linkedWords, { phrase: "", url: "" }]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      linkedWords,
    };

    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${getBaseUrl()}/api/books/edit/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Book Updated",
        text: "Your book has been updated!",
        icon: "success",
      });
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Error", text: "Update failed.", icon: "error" });
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return <div className="text-red-500">Error loading book data.</div>;

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Title"
          name="title"
          register={register}
          rules={{ required: "Title is required" }}
          placeholder="Enter book title"
        />
        <InputField
          label="Description"
          name="description"
          type="textarea"
          register={register}
          rules={{ required: "Description is required" }}
          placeholder="Enter book description"
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
          register={register}
          rules={{ required: "Old Price is required" }}
          placeholder="Old Price"
        />
        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          register={register}
          rules={{ required: "New Price is required" }}
          placeholder="New Price"
        />
        <InputField
          label="Cover Image URL"
          name="coverImage"
          type="text"
          register={register}
          rules={{ required: "Cover Image URL is required" }}
          placeholder="Cover Image URL"
        />

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Linked Words (Phrase + URL)
          </label>
          {linkedWords.map((link, idx) => (
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
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
