import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { testimonials } from "../../data/Testimonial";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  image: string;
}

const TestimonialSlider = () => {
  const items = testimonials as Testimonial[];

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary">What they say</h3>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={30}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
        }}
        navigation={{
          nextEl: ".next-btn",
          prevEl: ".prev-btn",
        }}
        className="pb-10"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
              “{item.text}”
            </p>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-primary text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="prev-btn p-2 rounded-full border hover:bg-gray-100">
                  <MdArrowBack />
                </button>
                <button className="next-btn p-2 rounded-full border hover:bg-gray-100">
                  <MdArrowForward />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSlider;
