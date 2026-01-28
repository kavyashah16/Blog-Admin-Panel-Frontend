import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TestimonialSlider from "../../components/TestimoialSlider/TestimonialSlider";
import ServiceCard from "../../components/card/service/ServiceCard";

interface BlogItem {
  id: number;
  img: string;
  title: string;
  desc: string;
}

const Home = () => {
  const blogs: BlogItem[] = [
    {
      id: 1,
      img: "b1.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
    {
      id: 2,
      img: "b2.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
    {
      id: 3,
      img: "b3.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
    {
      id: 4,
      img: "b4.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
    {
      id: 5,
      img: "b5.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
    {
      id: 6,
      img: "b6.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
  ];

  return (
    <>
      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 container">
          <div className="md:col-span-3 flex flex-col justify-center text-center md:text-left gap-6">
            <h1>
              Search and find your best{" "}
              <span className="underline decoration-button">courses</span>
              <span> with easy way</span>
            </h1>

            <p className="mx-auto md:mx-0 max-w-lg hidden sm:block">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
              eligendi dolor praesentium ex odit qui quos.
            </p>

            <div className="flex flex-row items-center justify-center md:justify-start gap-4">
              <button className="text-white bg-button rounded-md px-4 py-1 md:px-7 md:py-2.5 font-jakarta">
                Join us now!
              </button>
              <span className="cursor-pointer underline underline-offset-4 font-jakarta">
                See all plans
              </span>
            </div>
          </div>

          <div className="md:col-span-3 flex justify-center items-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <img src="homeimage.png" alt="Home Page" className="w-full" />
              <img
                src="star.png"
                className="absolute bottom-[8%] left-[5%] w-16"
              />
              <img
                src="star.png"
                className="absolute top-[6%] right-[6%] w-16"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F8FE] section">
        <div className="flex flex-col items-center py-14 px-6 text-center gap-15 container">
          <h2>
            <span className="md:block">Collaborate with 100+</span>
            leading universities and companies
          </h2>

          <p className="max-w-2xl mx-auto">
            WOC has contributed to students so that they can work in their dream
            company.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center container">
          <img src="homeimg2.png" className="w-full max-w-md rounded-md" />

          <div className="flex flex-col gap-10 text-center md:text-left">
            <h2>We are committed to helping you achieve your dreams</h2>

            <p>
              Lorem ipsum dolor sit amet consectetur. Nibh proin proin eget
              neque.
            </p>

            <button className="bg-button text-white px-6 py-2.5 rounded-md">
              See detail
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="flex flex-col gap-15 items-center container">
          <h2>Our best courses for you</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-6xl w-full">
            {blogs.map((blog) => (
              <ServiceCard
                key={blog.id}
                img={blog.img}
                title={blog.title}
                desc={blog.desc}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto container">
          <div>
            <img src="/comment.svg" className="w-12" />
            <h2>what they say about WOC</h2>
            <p>More than 3000 users have been helped.</p>
          </div>

          <div className="md:col-span-2">
            <TestimonialSlider />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
