import React from 'react'
import {CiStreamOn} from 'react-icons/ci'
function LiveStream() {
    return (
        <div className=''>
            <img src='http://localhost:8080/live_stream' />
            
            <div className='flex items-center gap-1 text-red-500'>
                <CiStreamOn className='text-3xl animate-pulse'/> LIVE
            </div>

            <div className='shadow-md mt-2 p-2  rounded bg-slate-50'>
                <div className='font-bold text-lg pb-2'>
                    INFORMATION
                </div>
                <div className='w-full mb-4'>
                    <form className='grid grid-cols-2 gap-y-2'>
                        <div className=''>
                            <label className='block mb-1 text-bold text-gray-700 uppercase font-bold'>
                                Zip Code
                            </label>
                            <input type="text" className='bg-gray-100 p-1 text-bold rounded focus' placeholder='70810' />
                        </div>
                        <div className=''>
                            <label className='block mb-1 text-bold text-gray-700 uppercase font-bold'>
                                State
                            </label>
                            <input type="text" className='bg-gray-100 p-1 text-bold rounded focus' placeholder='LA' />
                        </div>
                        <div className=''>
                            <label className='block mb-1 text-bold text-gray-700 uppercase font-bold'>
                                Phone
                            </label>
                            <input type="text" className='bg-gray-100 p-1 text-bold rounded focus' placeholder='225-111-111' />
                        </div>
                        <div className=''>
                            <label className='block mb-1 text-bold text-gray-700 uppercase font-bold'>
                                Provider
                            </label>
                            <input type="text" className='bg-gray-100 p-1 text-bold rounded focus' placeholder='EMS' />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LiveStream