import React from 'react'
import {AiOutlineLoading3Quarters, AiFillFire} from 'react-icons/ai'
import {GiPoliceBadge} from 'react-icons/gi'
import {BiPlusMedical} from 'react-icons/bi'
function MaskedStream() {
    return (
        <div>
            <img src='http://localhost:8080/video_feed' />
            <div className='flex items-center gap-1 text-green-500 font-mono mt-2'>
                <AiOutlineLoading3Quarters className='text-2xl animate-spin mx-2'/> HERO Vision Analysis
            </div>

            <div className='shadow-md mt-2 p-2  rounded bg-slate-50'>
                <div className='font-bold text-lg pb-2'>
                    DISPATCH FIRST RESPONDERS
                </div>
                <div className='flex w-full h-full gap-4'>
                    <div className='bg-red-200 grow flex justify-center text-8xl py-6 rounded hover:bg-red-400 transition'>
                        <BiPlusMedical />
                    </div>
                    <div className='bg-blue-200 grow flex justify-center text-8xl py-6 rounded hover:bg-blue-400 transition'>
                        <GiPoliceBadge />
                    </div>
                    <div className='bg-amber-200 grow flex justify-center text-8xl py-6 rounded hover:bg-amber-400 transition'>
                        <AiFillFire />
                    </div>
                </div>
            </div>
        </div>
        

    )
}

export default MaskedStream