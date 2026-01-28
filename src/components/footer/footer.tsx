import { FC } from "react";
import { Link } from "react-router";

const Footer: FC = () => {
  return (
    <footer className="bg-primary px-6 pt-8 pb-6 mt-14">
      <div className="container flex flex-col md:flex-row gap-10 md:gap-0 justify-between items-start md:items-center">
        <div className="flex flex-col items-start gap-3">
          <img src="Logo2.svg" className="h-10 w-auto" alt="Logo" />
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 text-white">
          <div className="flex flex-col">
            <span className="text-xl mb-5">Address</span>
            <span>Technology Inc. 90B</span>
            <span className="text-sm">Wherever Street</span>
            <span className="text-sm">99122 Indonesia</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xl mb-5">Contact</span>
            <span className="text-sm">Phone: +1 234 778 991</span>
            <span className="text-sm">Email: hello@woc.com</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xl mb-5">Quick Links</span>
            <span className="text-sm">FAQ</span>
            <Link to="/about" className="hover:underline text-sm">
              About Us
            </Link>
            <span className="text-sm">Command Center</span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 border-gray-500">
        <div className="container flex justify-center text-white text-sm">
          © 2025 | All rights reserved by Hexagon Digital
        </div>
      </div>
    </footer>
  );
};

export default Footer;
