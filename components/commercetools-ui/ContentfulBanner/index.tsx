import React from 'react'


function ContentfulBanner({ imageUrl, altText, bannerTitle, bannerSubTitle }) {
  return (
    <>
      <div className='mt-2'>
        <img src={imageUrl} alt={bannerTitle}
          style={{ objectFit: 'cover' }}
          className="h-full w-full max-h-[640px]" />
      </div>
      {/* <div className="bg-black px-24 py-40">
                  <Typography as="h1" className="text-left text-34 font-semibold leading-tight text-white">
                    {slide?.banner_heading}
                  </Typography>
                  <Typography className="mt-22 text-left text-16 text-white ">{slide?.banner_description}</Typography>
                  {slide?.call_to_action?.title && (
                    <Link href={slide?.call_to_action?.href ?? ''}>
                      <Button className="mt-22 py-18 w-full rounded-none bg-white shadow-sm hover:!bg-[#F4F4F4]">
                        <Typography as="span" className="text-16 font-medium leading-6 text-[#2B2C39] ">
                          {slide?.call_to_action?.title}
                        </Typography>
                      </Button>
                    </Link>
                  )}
                </div> */}
    </>


  )
}

export default ContentfulBanner
