// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import { GiDeadWood } from "react-icons/gi";
import avatarImg from "../assets/avatar.png";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";

const navigation = [
  { name: "Dashboard", href: "/user-dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();
  const token = localStorage.getItem("token");

  const { data: booksData = [], error } = useFetchAllBooksQuery();
  const books = booksData || [];

  console.log("Books API Response:", books);
  if (error) console.error("Books API Error:", error);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      setFilteredBooks(
        books.filter((book) =>
          book.title.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredBooks([]);
    }
  };

  // Extracted user link rendering to avoid nested ternary
  let userLink;
  if (currentUser) {
    userLink = (
      <>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <img
            src={avatarImg}
            alt="Avatar"
            className={`size-7 rounded-full ${
              currentUser ? "ring-2 ring-blue-500" : ""
            }`}
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
            <ul className="py-2">
              {navigation.map((item) => (
                <li
                  key={item.name}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Link
                    to={item.href}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </>
    );
  } else if (token) {
    userLink = (
      <Link to="/dashboard" className="border-b-2 border-primary">
        Dashboard
      </Link>
    );
  } else {
    userLink = (
      <Link to="/login">
        <HiOutlineUser className="size-6" />
      </Link>
    );
  }

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <GiDeadWood className="size-16 m-2" />
          </Link>
          <div className="relative sm:w-72 w-40 space-x-2">
            <IoSearchOutline className="absolute left-3 inset-y-2" />
            <input
              type="text"
              placeholder="Search books..."
              className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && filteredBooks.length > 0 && (
              <ul className="absolute z-50 bg-white w-full shadow-md rounded-md mt-2 max-h-60 overflow-y-auto">
                {filteredBooks.map((book) => (
                  <li
                    key={book._id}
                    className="p-2 hover:bg-gray-200"
                  >
                    <Link
                      to={`/books/${book._id}`}
                      className="block text-sm text-gray-700"
                      onClick={() => setSearchQuery("")}
                    >
                      {book.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="relative flex items-center md:space-x-3 space-x-2">
          <div>{userLink}</div>

          <button className="hidden sm:block">
            <HiOutlineHeart className="size-6" />
          </button>

          <Link
            to="/cart"
            className="bg-primary p-1 sm:px-6 px-2 flex items-center rounded-sm"
          >
            <HiOutlineShoppingCart />
            <span className="text-sm font-semibold sm:ml-1">
              {cartItems.length}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
