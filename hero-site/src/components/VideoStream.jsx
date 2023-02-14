import React, { useEffect, useRef, useState } from 'react'

const IP = "192.168.0.48";


function VideoStream() {
    const outputCanvasRef = useRef(null);
    const inputCanvasRef = useRef(null);
    const imgRef = useRef(null);
    // const [l1, setl1] = useState(0);
    // const [l2, setl2] = useState(0);
    // const [l3, setl3] = useState(0);
    // const [l4, setl4] = useState(0);

    // const [h1, seth1] = useState(255);
    // const [h2, seth2] = useState(255);
    // const [h3, seth3] = useState(255);
    // const [h4, seth4] = useState(255);
    const [curInterval, setcurInterval] = useState("");
    const [bounds, setBounds] = useState([0, 0, 0, 0, 360, 100, 100, 0]);
    const handleChange = (event) => {
        setBounds(oldBounds => {
            let newBounds = structuredClone(oldBounds)
            newBounds[parseInt(event.target.id)] = parseInt(event.target.value);
            return newBounds;
        });
        // console.log(bounds)
    }

    const drawFrame = (ctxOut = outputCanvasRef.current.getContext("2d")) => {
        // // let mat = cv.imread(imgRef.current);

        // // cv.imshow('canvasout', mat);
        // // mat.delete();

        // let frame = cv.imread(imgRef.current);
        // // console.log(imgRef.current);
        // cv.imshow('canvasInput', frame);
        
        // let frameHSV = new cv.Mat();
        // cv.cvtColor(frame, frameHSV, cv.COLOR_RGBA2RGB);
        // // cv.cvtColor(frame, frameHSV, cv.RGBA2RGB, 0);
        // cv.cvtColor(frameHSV, frameHSV, cv.COLOR_RGB2HSV);


        // let lowScalar = new cv.Scalar(bounds[0], bounds[1], bounds[2]);
        // let highScalar = new cv.Scalar(bounds[4], bounds[5], bounds[6]);
        // let low = new cv.Mat(frameHSV.rows, frameHSV.cols, frameHSV.type(), lowScalar);
        // let high = new cv.Mat(frameHSV.rows, frameHSV.cols, frameHSV.type(), highScalar);
        // let hsvMask = new cv.Mat();
        // let masked = new cv.Mat();
        // // console.log(bounds);
        // // let low = new cv.Mat(frameHSV.rows, frameHSV.cols, frameHSV.type(), bounds.slice(0, 4));
        // // let high = new cv.Mat(frameHSV.rows, frameHSV.cols, frameHSV.type(), bounds.slice(4, 8));

        // // // // You can try more different parameters
        // cv.inRange(frameHSV, low, high, hsvMask);
        // // // let mask = new cv.Mat();
        // // // cv.cvtColor(hsvMask, mask, cv.COLOR_HSV2BGR, 0)
        // cv.bitwise_and(frame, frame, masked, hsvMask);

        // cv.imshow('canvasOutput', masked);


        // // Find selected splotches and highlight
        // // let maskData = nj.uint8(masked.data)


        // frame.delete();
        // // mask.delete();
        // low.delete();
        // high.delete();
        // masked.delete();
        // frameHSV.delete();
        // hsvMask.delete();
    }

    useEffect(() => {
        let img = imgRef.current;
        let interval = "";

        img.onload = () => {
            interval = setInterval(() => drawFrame(), 0);
            setcurInterval(interval)
        }
        
        
        return ()=> {
            clearInterval(interval);
        }

    }, [])

    useEffect(() => {
        clearInterval(curInterval)
        let newInterval = setInterval(() => drawFrame(), 0);
        setcurInterval(newInterval)
        return ()=> {
            clearInterval(newInterval)
        }
    }, [bounds])
    
    return (
    <div className="p-4">
        <div className="grid grid-cols-2 place-items-center">
            <div>
                {/* <img id="videoInput" ref={imgRef} src={`http://${IP}:81/stream`} crossOrigin="anonymous" /> */}
                <canvas className='' ref={inputCanvasRef} id="canvasInput" width={320} height={240}></canvas>
            </div>
            <div className=''>
                <canvas className='' ref={outputCanvasRef} id="canvasOutput" width={320} height={240}></canvas>
            </div>
        </div>
        <div className='grid grid-cols-2 gap-5 mt-5'>
            <div className="flex flex-col">
                {
                    [0, 1, 2].map(i => {
                        // console.log(i);
                        if (i == 0) return <input key={`slider${i}`} type="range" id={i} value={bounds[i]} min={0} max={360} onChange={handleChange}/>
                        return <input key={`slider${i}`} type="range" id={i} value={bounds[i]} min={0} max={100} onChange={handleChange}/>
                    })
                }
            </div>
            <div className="flex flex-col">
                {
                    [4, 5, 6].map(i => {
                        // console.log(i);
                        if (i == 4) return <input key={`slider${i}`} type="range" id={i} value={bounds[i]} min={0} max={360} onChange={handleChange}/>
                        return <input key={`slider${i}`} type="range" id={i} value={bounds[i]} min={0} max={100} onChange={handleChange}/>
                    })
                }
            </div>
        </div>
       
    </div>
    )
}

export default VideoStream