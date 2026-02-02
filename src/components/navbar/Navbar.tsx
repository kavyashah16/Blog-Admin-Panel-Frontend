import { FC, useState } from "react";
import { Link } from "react-router";

const Navbar: FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <nav className="bg-white border-b-2 border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <img src="image.png" alt="Company logo" className="h-10 w-auto" />

        <ul className="hidden md:flex space-x-10 text-gray-700 font-medium font-jakarta">
          <li>
            <Link to="/" className="hover:text-button">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-button">
              About
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-button">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/service" className="hover:text-button">
              Service
            </Link>
          </li>
          <li>
            <Link to="/product" className="hover:text-button">
              Product
            </Link>
          </li>
        </ul>

        <Link
          to="/cart"
          className="hidden md:flex bg-button text-white px-4 py-2.5 rounded-md font-jakarta"
        >
          Cart
        </Link>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden text-gray-700"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            <li>
              <Link to="/" onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/blog" onClick={() => setOpen(false)}>
                Blog
              </Link>
            </li>
            <li>
              <Link to="/service" onClick={() => setOpen(false)}>
                Service
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="bg-button text-white px-4 py-2 rounded-md w-full shadow-lg"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
