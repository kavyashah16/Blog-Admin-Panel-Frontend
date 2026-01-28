export interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "This platform completely changed the way I learn. The courses are well structured and easy to follow.",
    name: "Aarav Mehta",
    role: "UI Designer",
    image: "/user.svg",
  },
  {
    id: 2,
    text: "Amazing experience! The mentors are very helpful and the content is top-notch.",
    name: "Sneha Patil",
    role: "Frontend Developer",
    image: "/user.svg",
  },
  {
    id: 3,
    text: "World Online Course helped me land my first job. Highly recommended!",
    name: "Rahul Sharma",
    role: "Product Designer",
    image: "/user.svg",
  },
];
