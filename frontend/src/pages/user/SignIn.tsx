import React from 'react'
import Header from '../../components/user/Header'
import LoginForm from '../../components/user/LoginForm'

const SignIn = () => {
    return (
        <>
            <Header></Header>
            <section className="relative bg-[url('/img/login/bg3.jpeg')] h-screen w-full bg-cover bg-center bg-no-repeat">
                <div className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to left, rgba(0,0,0,0.9), transparent)",
                    }}></div>

                <div
                    className="
                        relative z-20 grid w-full h-full
                        grid-cols-1 md:grid-cols-2  {/* 1 cột trên mobile, 2 cột trên desktop */}
                        place-items-center         {/* Căn giữa mọi thứ trong grid cell (ngang + dọc) */}
                    "
                >
                    <div className="w-full max-w-[400px] px-4">
                        <LoginForm />
                    </div>
                    <div className="hidden md:block">
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignIn