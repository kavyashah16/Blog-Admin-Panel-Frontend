import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router";

interface BlogCardProps {
  id: number;
  image: string;
  title: string;
  tag: string;
  date: string;
  onDelete: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  image,
  title,
  tag,
  date,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {title}
        </h3>

        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {tag}
          </span>
          <span>{date}</span>
        </div>

        <div className="flex justify-end gap-4 mt-4 text-gray-600">
          <Link to={`/blog/${id}`} title="View">
            <FaEye />
          </Link>
          <Link to={`/blogedit/${id}`} title="Edit">
            <FaEdit />
          </Link>
          <button onClick={onDelete} title="Delete">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
