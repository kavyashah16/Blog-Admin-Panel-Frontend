import React from "react";
import { Link } from "react-router";

interface SmallBlogCardProps {
  id: number;
  img: string;
  title: string;
  date: string;
  tag: string;
}

const SmallBlogCard: React.FC<SmallBlogCardProps> = ({
  id,
  img,
  title,
  date,
  tag,
}) => {
  return (
    <Link
      to={`/blog/${id}`}
      className="block border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0"
    >
      <div className="grid grid-cols-3 gap-3">
        <div>
          <img
            src={img}
            alt={title}
            className="w-full h-16 object-cover rounded-md"
          />
        </div>
        <div className="col-span-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-primary leading-snug mb-1">
              {title}
            </h4>
            <span className="inline-block text-xs bg-[#155efc19] text-gray-600 px-2 py-0.5 rounded-full mb-2 font-jakarta">
              {tag}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-jakarta">{date}</p>
        </div>
      </div>
    </Link>
  );
};

export default SmallBlogCard;
