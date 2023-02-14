import React, {useEffect, useRef, useState} from 'react'
import p5 from 'p5'

function RoomMap() {
    const canvasRef = useRef();
    const requestIdRef = useRef(null);
    const xPos = useRef(0);
    const p5ContainerRef = useRef();
    
    const drawCircle = (ctx, x, y, r) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }

    const renderFrame = () => {
        const ctx = canvasRef.current.getContext("2d");
        // ctx.save();
        ctx.clearRect(0, 0, 300, 300);
        
        drawCircle(ctx, 150, 150, 10)


        
        // ctx.restore();

    }
    const tick = () => {
        if (!canvasRef.current) return;
        renderFrame();
        requestIdRef.current = requestAnimationFrame(tick);
    }
    useEffect(() => {
        // let ctx = canvasRef.current.getContext("2d");
        // ctx.fillRect(25, 25, 200, 100)
        requestIdRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(requestIdRef.current);
        }
    }, [])

    return (
        <div className=''>
            <canvas className='border border-red-500 border-2' ref={canvasRef} width={300} height={300}>

            </canvas>
        </div>
    )
}

export default RoomMap