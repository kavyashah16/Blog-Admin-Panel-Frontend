import { FC } from "react";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const Contact: FC = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="mb-1">
                Get <br /> in touch!
              </h2>
            </div>

            <div className="flex flex-col gap-5 text-sm">
              <div>
                <p className="font-medium text-primary flex gap-3 items-center">
                  <FaMapMarkerAlt />
                  Address
                </p>
                <p className="text-gray-500">Mumbai, Maharashtra, India</p>
              </div>

              <div>
                <p className="font-medium text-primary flex gap-3 items-center">
                  <MdOutlineEmail />
                  Email
                </p>
                <p className="text-gray-500">support@woc.com</p>
              </div>

              <div>
                <p className="font-medium text-primary flex gap-3 items-center">
                  <FaPhoneAlt />
                  Phone
                </p>
                <p className="text-gray-500">+91 98765 43210</p>
              </div>
            </div>
          </div>

          <form
            className="bg-white shadow-md hover:shadow-lg border border-[#f2eaea] rounded-md p-8 flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="border border-[#f2eaea] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="border border-[#f2eaea] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              type="text"
              placeholder="Subject"
              className="border border-[#f2eaea] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              rows={5}
              placeholder="Your Message"
              className="border border-gray-200 rounded-md px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
