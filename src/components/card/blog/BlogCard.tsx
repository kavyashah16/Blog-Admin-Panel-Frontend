import React, { FC } from "react";
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router";

/* ===================== TYPES ===================== */
interface BlogCardProps {
  id: number;
  img: string;
  tag: string;
  title: string;
  desc: string;
  date: string;
}

/* ===================== COMPONENT ===================== */
const BlogCard: FC<BlogCardProps> = ({ id, img, tag, title, desc, date }) => {
  return (
    <Link to={`/blog/${id}`} className="block">
      <div className="flex flex-col p-4 gap-3 border border-[#f2eaea] rounded-md shadow-md relative hover:shadow-lg transition-shadow duration-300">
        <img
          src={img}
          alt={title}
          className="w-full h-48 object-cover rounded-md"
        />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 bg-[#155efc19] px-3 py-1 rounded-full font-jakarta">
              {tag}
            </span>
            <span className="text-xs text-gray-500 font-jakarta">{date}</span>
          </div>

          <h3 className="text-xl text-primary flex items-center gap-2 font-jakarta">
            {title}
            <MdArrowOutward />
          </h3>

          <p className="text-sm text-gray-500 font-jakarta">{desc}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
