import React from 'react';
import Hero from './sections/Home/Hero';
import Features from './sections/Home/Features';
import Testimonials from './sections/Home/Testimonials';
import FAQ from './sections/Home/FAQ';
import Contact from './sections/Home/Contact';

// Agar aapke paas aur bhi Home page ke sections hain, toh unhe bhi yahan import karein
import Courses from './sections/Home/Courses';
// import Contact from './sections/Home/Contact';

export default function Home() {
  return (
    <>
   
      <Hero />
      <Courses/>
      <Features/>
 <Testimonials/>
   <FAQ/>
<Contact/>
 

    </>
  );
}