import React from 'react'
import SignUpHeader from '@/components/user/SignUpHeader'
import RegisterForm from '@/components/user/RegisterForm'

const SignUp = () => {
    return (
        <>
            <SignUpHeader></SignUpHeader>
            <section className="relative bg-[url('/img/login/bg3.jpeg')] h-screen w-full bg-cover bg-center bg-no-repeat">
                <div className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to left, rgba(0,0,0,0.9), transparent)",
                    }}></div>

                <div
                    className="
                        relative z-20 grid w-full h-full
                        grid-cols-1 md:grid-cols-2 
                        place-items-center
                    "
                >
                    <div className="w-full max-w-[400px] px-4">
                        <RegisterForm/>
                    </div>
                    <div className="hidden md:block">
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignUp