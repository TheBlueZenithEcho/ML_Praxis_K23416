import React from 'react'

const Hero = () => {
    return (
        <>
            <div>
                <section className="hero bg-[url('/img/hero/bg.png')] min-h-[500px] md:min-h-[690px] pt-[80px] xl:pt-[100px] bg-[center_30%] md:bg-center lg:bg-cover bg-no-repeat bg-fixed xl:rounded-bl-[290px] relative z-20 ">
                    <div className="container mx-auto h-full flex items-center justify-center xl:justify-star">
                        {/* text */}
                        <div className='hero__text w-[567px] flex flex-col items-center text-center'>
                            <h1 className='h1 mb-4 text-3xl md:text-5xl lg:text-5xl drop-shadow-lg font-bold mt-7 lg:mr-10 font-serif text-[#FFD600]'>Elevate Your Space</h1>
                            <h1 className='h1 mb-0 text-3xl md:text-5xl lg:text-5xl drop-shadow-lg font-bold lg:mr-10 font-serif text-[#FFD600]'>Elevate Your Life</h1>
                            <p className='inter drop-shadow-lg text-[#FDFBCE] italic  mt-2 text-sm xl:text-base whitespace-nowrap text-center lg:self-end lg:mr-[45px]'> Where extraordinary design meets unparalleled comfort</p>

                        </div>
                    </div>

                </section>
            </div>


        </>
    )
}

export default Hero