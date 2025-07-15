import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BookCard from '../books/BookCard';
import { useFetchRecommendedBooksQuery } from '../../redux/features/books/booksApi';
import axios from 'axios';

// Attach token to every Axios request
const token = localStorage.getItem('token');
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const Recommended = () => {
  const {
    data: recommendationData = {},
    isLoading,
    error,
  } = useFetchRecommendedBooksQuery();

  // Treat 401 Unauthorized as no recommendations
  const status = error?.status;
  const recommendedBooks = recommendationData.recommendedBooks || [];

  if (isLoading) {
    return <div className="py-16 text-center">Loading recommendations…</div>;
  }

  if (status && status !== 401) {
    return (
      <div className="py-16 text-center text-red-500">
        Failed to load recommendations.
      </div>
    );
  }

  return (
    <div className="py-16">
      <h2 className="text-3xl font-semibold mb-6">Recommended for you</h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 2, spaceBetween: 50 },
          1180: { slidesPerView: 3, spaceBetween: 50 },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {recommendedBooks.length > 0 ? (
          recommendedBooks.map((book) => (
            <SwiperSlide key={book._id}>
              <BookCard book={book} />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="text-center">No recommendations available at the moment.</div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default Recommended;
