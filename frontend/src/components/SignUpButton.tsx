import React from "react";
import { Link } from "react-router-dom";

const SignUpButton: React.FC = () => {
    return (
        <>
            <div className=" flex items-center">
                <style>{`
                             @keyframes spin {
                                0% {
                                    transform: rotate(0deg);
                                }
                                100% {
                                    transform: rotate(360deg);
                                }
                                }
                                .rotate-gradient {
                                animation: spin 4s linear infinite;
                                animation-timing-function: linear;
                                }
                            `}</style>
                <Link to="/SignUp">
                    <button className="group w-[90px] h-[40px] items-center relative cursor-pointer overflow-hidden whitespace-nowrap px-4 py-3 text-white text-sm [background:var(--bg)] [border-radius:var(--radius)] transition-all duration-300 hover:scale-105 hover:shadow-[1px_3px_45px_-11px_#246122] flex justify-center"
                        style={{
                            '--spread': '90deg',
                            '--shimmer-color': '#ffffff',
                            '--radius': '8px',
                            '--speed': '1.5s',
                            '--cut': '2px',
                            '--bg':
                                'radial-gradient(ellipse 80% 50% at 50% 120%, #0E3205, #0E3205)',
                        } as React.CSSProperties} >
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute inset-[-100%] rotate-gradient">
                                <div
                                    className="absolute inset-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,hsl(0_0%_100%/1)_var(--spread),transparent_var(--spread))]">
                                </div>
                            </div>
                        </div>
                        <div className="absolute [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"></div>
                        <span
                            className="z-10 bg-gradient-to-b from-black from-30% to-gray-300/80 bg-clip-text  text-sm text-center font-semibold leading-none tracking-tight text-white">Sign Up</span>

                    </button>
                </Link>
            </div>
        </>
        
    );
};

export default SignUpButton;

/*

                                
                            </div>*/
