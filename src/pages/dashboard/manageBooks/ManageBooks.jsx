import React from 'react';
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';

const ManageBooks = () => {
  const { data: books, isLoading, isError, refetch } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();

  // Handle deleting a book with confirmation
  const handleDeleteBook = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteBook(id).unwrap();
        Swal.fire('Deleted!', 'Book deleted successfully.', 'success');
        refetch();
      } catch (error) {
        console.error('Failed to delete book:', error);
        Swal.fire('Error', 'Failed to delete book. Please try again.', 'error');
      }
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-500 text-center mt-4">Failed to load books.</div>;

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
            <h3 className="font-semibold text-base text-blueGray-700">All Books</h3>
            <Link to="/dashboard/add-book" className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded">
              Add New
            </Link>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left">#</th>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Book Title</th>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Category</th>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Price</th>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book, index) => (
                  <tr key={book._id}>
                    <td className="px-6 py-4 text-xs text-blueGray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-xs">{book.title}</td>
                    <td className="px-6 py-4 text-xs">{book.category}</td>
                    <td className="px-6 py-4 text-xs">${book.newPrice}</td>
                    <td className="px-6 py-4 text-xs space-x-4">
                      <Link
                        to={`/dashboard/edit-book/${book._id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-full text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageBooks;
