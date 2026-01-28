import React, { FC } from "react";
import { Link } from "react-router";

const About: FC = () => {
  return (
    <>
      <section className="section">
        <div className="container text-center max-w-4xl mx-auto">
          <h1>
            Empowering learners to build
            <br /> careers they love
          </h1>
          <p className="my-5">
            We help students and professionals gain real-world skills through
            curated courses, expert guidance, and practical learning.
          </p>
        </div>
      </section>

      <section>
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="homeimg2.png"
              alt="About us"
              className="w-full max-w-md mx-auto rounded-md"
            />
          </div>

          <div className="flex flex-col gap-6">
            <h2>Who we are</h2>
            <p>
              We are a learning-focused platform dedicated to helping students
              and professionals upskill with industry-relevant knowledge. Our
              courses are designed by experts and tailored for real-world
              applications.
            </p>
            <p>
              Whether you're starting your career or upgrading your skills, we
              provide the right tools and mentorship to support your journey.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-6 border border-gray-200 rounded-md">
            <h3>Our Mission</h3>
            <p>
              To make quality education accessible, practical, and impactful for
              learners across the globe.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-md">
            <h3>Our Vision</h3>
            <p>
              To become a trusted learning partner that bridges the gap between
              education and industry.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold">100+</h3>
            <p>Courses</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">50K+</h3>
            <p>Students</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">200+</h3>
            <p>Mentors</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">95%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </section>

      <section className="section bg-card">
        <div className="container text-center py-14 rounded-md">
          <h2>Start learning with us today</h2>
          <p className="mt-3 mb-6">
            Join thousands of learners building their future with us.
          </p>
          <Link to="/service" className="btn-primary">
            Explore Courses
          </Link>
        </div>
      </section>
    </>
  );
};

export default About;
