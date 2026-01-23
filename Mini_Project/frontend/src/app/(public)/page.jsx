import React from 'react'
import Hero from '@/components/Hero'
import Features from '@/components/Features';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const page = () => {
  return (<>
    <Navbar />
    <Hero />
    <Features />
    <Footer />
  </>
    // <div className='flex justify-center items-center text-white font-bold
    // text-[40px] h-full'>
    //   Welcome to LearnHub📚📚
    // </div>

  )
}

export default page
