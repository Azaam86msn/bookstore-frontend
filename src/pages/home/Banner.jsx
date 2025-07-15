// import React from 'react'

// import bannerImg from "../../assets/banner.png"

// const Banner = () => {
//   return (
//     <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
//          <div className='md:w-1/2 w-full flex items-center md:justify-end'>
//             <img src={bannerImg} alt="" />
//         </div>
        
//         <div className='md:w-1/2 w-full'>
//             <h1 className='md:text-5xl text-2xl font-medium mb-7'>New Releases This Week</h1>
//             <p className='mb-10'>It's time to update your reading list with some of the latest and greatest releases in the literary world. From heart-pumping thrillers to captivating memoirs, this week's new releases offer something for everyone</p>

//             <button className='btn-primary'>Subscribe</button>
//         </div>

       
//     </div>
//   )
// }

// export default Banner

import React from 'react'

import bannerImg from "../../assets/MayBe.jpg"

const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
         <div className='md:w-1/2 w-full flex items-center md:justify-end mx-10'>
            <img src={bannerImg} alt="" />
        </div>
        
        <div className='md:w-1/2 w-full'>
            <h1 className='md:text-5xl text-2xl font-medium mb-8'>Maybe They Wont</h1>
            <p className='mb-10'>COLOMBO : The English novel “MAYBE THEY WON’T” will be released on Tuesday, on May 28, at the Colombo BMICH Tulip Hall. 

This day marks the launch of the first edition of the novel, which explores a concept that remains largely unspoken in our society: the relationships among young adults—boys and girls—their feelings, thoughts, views, and contradictions, and how parents and society interpret them. The novel delves into the circumstances that arise from these relationships and the decisions young adults make</p>

        </div>

       
    </div>
  )
}

export default Banner