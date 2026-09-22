import React from "react";
import Hero from "./sections/Home/Hero";
import Courses from "./sections/Home/Courses";
import Features from "./sections/Home/Features";
import PopularCoursesCTA from "./sections/Home/PopularCoursesCTA";
import Testimonials from "./sections/Home/Testimonials";
import FAQ from "./sections/Home/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <Courses />
      <PopularCoursesCTA />
      <Features />
      <Testimonials />
      <FAQ />
    </>
  );
}
