import React, { useEffect, useState, useRef } from 'react'
import {AiOutlineCheck, AiOutlineArrowRight} from 'react-icons/ai'
import {BsArrowRight} from 'react-icons/bs'
import RoomMap from './RoomMap';
import Radar from './Radar';
function AlgoStatus() {
    const [fps, setFps] = useState(40)
    const [latency, setLatency] = useState(30)
    const mapRef = useRef(null)
    const [map, setMap] = useState()
    const updateFps = () => {
        setFps(37 + Math.floor(Math.random() * 6))
    }
    const updateLatency = () => {
        setLatency(30 + Math.floor(Math.random() * 5))
    }
    useEffect(() => {
        const fpsInterval = setInterval(updateFps, 500)
        const latencyInterval = setInterval(updateLatency, 1700)
        


        return () => {
            clearInterval(fpsInterval)
            clearInterval(latencyInterval)
        }
    }, [])
    // useState(() => {
    //     if (mapRef.current && !map) {
    //         setMap(new window.google.maps.Map(mapRef.current, {}));
    //     }
    // }, [mapRef, map])
    return (
        <div>
            <div className='uppercase font-bold text-center mb-2 text-xl'>
                Algorithm Status
            </div>
            <div className='font-mono text-green-500 text-lg text-center'>
                All Systems Operational
            </div>
            {/* <img className='filt' src='https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2018/png/iconmonstr-arrow-right-thin.png&r=0&g=0&b=0' /> */}
            <div className='mt-2 text-center'>
                First Responder Map
            </div>
            {/* <iframe className='w-full h-[400px]' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220148.0396912898!2d-91.25150376644972!3d30.441399195388318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86243867325f74cb%3A0x2123f1db91579a1d!2sBaton%20Rouge%2C%20LA!5e0!3m2!1sen!2sus!4v1674412217390!5m2!1sen!2sus" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
            <Radar />
            <div className='flex'>
                <div className='text-4xl font-bold font-mono mb-2 grow'>
                    FPS
                    <div className='text-5xl mb-5'>
                        {fps}
                    </div>
                </div>
                
                <div className='text-4xl font-bold font-mono mb-2 grow'>
                    Latency
                    <div className='text-5xl'>
                        {latency} <span>ms</span>
                    </div>
                </div>
            </div>
            
                
                
        </div>
    )
}

export default AlgoStatus