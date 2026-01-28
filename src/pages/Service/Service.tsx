import ServiceCard from "../../components/card/service/ServiceCard";

interface ServiceItem {
  id: number;
  img: string;
  title: string;
  desc: string;
}

const Service = ()=> {
  const services: ServiceItem[] = [
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
    {
      id: 7,
      img: "b6.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
    {
      id: 8,
      img: "b6.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
    {
      id: 9,
      img: "b6.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
    {
      id: 10,
      img: "b6.svg",
      title: "Product Designer",
      desc: "Learn various UI UX Design materials including UX Research, UI Design, UX Writing, and Product Design for 4.5 months with professionals product designer practitioners.",
    },
  ];

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="flex flex-col gap-20 justify-center items-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl text-primary font-semibold leading-tight text-center font-jakarta">
              Our best courses for you
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-6xl w-full">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  img={service.img}
                  title={service.title}
                  desc={service.desc}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Service;
