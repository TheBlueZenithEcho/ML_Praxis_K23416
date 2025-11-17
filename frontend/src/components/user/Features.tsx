import React from 'react'


const Features = () => {
    return (
        <>
            <div>
                <section className='features mt-[40px] xl:mt-[90px] relative z-20'>
                    <div className='absolute -top-[120px] left-0 w-full z-30 flex justify-center'>
                        <div className='flex justify-center gap-x-4 items-end w-full md:max-w-[700px] lg:max-w-[700px] px-6'>
                            <div className='w-[145px] h-[145px] rounded-full overflow-hidden shadow-xl border-4 border-white'>
                                <img src="/img/features/icon1.jpg" alt="Icon 1" className="w-full h-full object-cover" />
                            </div>
                            <div className='w-[180px] h-[180px] rounded-full overflow-hidden shadow-xl border-4 border-white mt-10 xl:mt-16'>
                                <img src="/img/features/icon2.jpg" alt="Icon 2" className="w-full h-full object-cover" />
                            </div>
                            <div className='w-[145px] h-[145px] rounded-full overflow-hidden shadow-xl border-4 border-white'>
                                <img src="/img/features/icon3.jpg" alt="Icon 3" className="w-full h-full object-cover" />
                            </div>
                        </div>


                    </div>

                    <div className='mx-auto xl:px-0 bg-[#FDFBCE] bg-opacity-40 xl:rounded-tr-[290px] pt-48 xl:pt-40 pb-20'>

                        <div className="flex flex-col xl:flex-row text-center xl:text-left justify-center items-center gap-8 xl:gap-[100px] container mx-auto px-6 xl:px-0">
                            <div className="relative w-[300px] h-[300px] lg:xl:w-[470px] lg:h-[470px] overflow-hidden rounded-[180px_0_180px_0]">
                                <img src="/img/features/img.jpg"
                                    alt="feature"
                                    className="w-full h-full object-cover"
                                    style={{
                                        borderTopLeftRadius: '180px',
                                    }}
                                />
                            </div>

                            <div className="w-full xl:w-1/2 flex flex-col xl:items-start">

                                <h2 className="h2 font-serif text-green-800 text-3xl md:text-4xl lg:text-4xl drop-shadow-lg font-bold  mb-5">
                                    Design Your Elevated Life
                                </h2>

                                <div className="space-y-8 w-full">
                                    <div className='FeatureItem font-inter '>
                                        <p className='font-inter text-[16px] mb-5 text-justify'>We believe that a beautiful space begins with a pleasant working experience.
                                            By applying an intelligent interior design management and consulting platform, we provide our clients with a transparent, convenient, and efficient design journey. From exploring ideas and collaborating with designers to receiving detailed quotations — every step takes place within a single unified online space, allowing clients to easily track progress and stay engaged throughout the creative process.</p>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10 font-serif">
                                            <div className="flex flex-col items-center p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition">
                                                <i className="bi bi-compass text-4xl text-green-700 mb-3"></i>
                                                <h4 className="font-semibold text-green-800">Discover</h4>
                                            </div>

                                            <div className="flex flex-col items-center p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition">
                                                <i className="bi bi-file-earmark-text text-4xl text-green-700 mb-3"></i>
                                                <h4 className="font-semibold text-green-800">Request</h4>
                                            </div>

                                            <div className="flex flex-col items-center p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition">
                                                <i className="bi bi-people text-4xl text-green-700 mb-3"></i>
                                                <h4 className="font-semibold text-green-800">Consult</h4>
                                            </div>

                                            <div className="flex flex-col items-center p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition">
                                                <i className="bi bi-check-circle text-4xl text-green-700 mb-3"></i>
                                                <h4 className="font-semibold text-green-800">Approve</h4>
                                            </div>

                                            <div className="flex flex-col items-center p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition">
                                                <i className="bi bi-box-seam text-4xl text-green-700 mb-3"></i>
                                                <h4 className="font-semibold text-green-800">Deliver</h4>
                                            </div>
                                        </div>
                                        {/* {/* Tách 3 mục ra 3 div riêng để dễ quản lý khoảng cách hơn
                                        <h3 className='bi bi-stars text-[#F8B518] text-1xl md:text-2xl lg:text-2xl font-lora font-semibold'>Centralized Hub</h3>
                                        <p className='font-inter text-[16px] mb-5'>All communication, product lists, and documents stored in one place. No more lost information across various apps.</p>

                                        <h3 className='bi bi-lamp-fill text-[#F8B518] text-1xl md:text-2xl lg:text-2xl font-lora font-semibold'>Vision-Driven Design</h3>
                                        <p className='font-inter text-[16px] mb-5'>Start your journey by selecting a favorite design. Your needs are instantly transformed into a visual concept.</p> */}

                                        {/* <h3 className='bi bi-lock-fill text-[#F8B518] text-1xl md:text-2xl lg:text-2xl font-lora font-semibold'>Instant Visualization</h3>
                                        <p className='font-inter text-[16px]'>Official quotes are internally approved, and the final agreement is locked to ensure clarity and accuracy.</p>  */}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>

        </>
    )
}

export default Features