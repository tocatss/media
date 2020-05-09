import React, { useRef, useEffect, useState } from 'react'
import { createFFmpeg } from '@ffmpeg/ffmpeg'

const constraints = {
    audio: true,
    video: { width: 376, height: 282 }
}

let mediaRecorder = null, chunks = []

const PCMedia = () => {
    const ffmpeg = createFFmpeg({
        log: true,
    });
    const videoEl = useRef(null)
    const canvasEl = useRef(null)
    const [file, setFile] = useState({ visible: false, url: "" })
    const [outputFile, setOutputFile] = useState({ visible: false, url: "" })

    const [capture, setCapture] = useState(false)
    const [isRecord, setRecord] = useState(false)

    const preview = (mediaStream) => {
        // const width = 100
        videoEl.current.srcObject = mediaStream
        // videoEl.current.setAttribute("width", width)
        // videoEl.current.setAttribute("height",videoEl.current.videoHeight /(videoEl.current.videoWidth/width) )
        videoEl.current.onloadedmetadata = function(e) {
            videoEl.current.play()
        }
    }

    // Init
    useEffect(() => {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia(constraints)
            .then(
                mediaStream => {
                    preview(mediaStream)
    
                    const canvasCtx = canvasEl.current.getContext('2d')
                    canvasCtx.fillStyle = "#AAA"
                    canvasCtx.fillRect(0, 0, canvasEl.current.width, canvasEl.current.height)
    
                    mediaRecorder = new MediaRecorder(mediaStream,{
                        // audioBitsPerSecond: 128000,
                        // videoBitsPerSecond: 2500000,
                        // mimeType: 'video/*',
                    })
                    mediaRecorder.ondataavailable = (e) => {
                        chunks.push(e.data);
                    }
                    mediaRecorder.onstop = () => {
                        const blob = new Blob(chunks)
                        chunks = []
                        console.log(mediaRecorder)
                        const url = window.URL.createObjectURL(blob,{type:mediaRecorder.mimeType})
                        setFile({visible:true,url:url,blob:blob})
                    }
                })
            .catch(err => console.log(err.name + ": " + err.message))
        }
    }, [])
    
    useEffect(() => {
        if (!!mediaRecorder) {
            if (isRecord) {
                mediaRecorder.start()
                // Reset
                setFile({ visible: false, url: "" })
                chunks = []
                return
            }
            mediaRecorder.stop()
        }
    }, [isRecord])

    useEffect(() => {
        const width = 300
        const height = videoEl.current.videoHeight / (videoEl.current.videoWidth/width)
        const canvasCtx = canvasEl.current.getContext('2d')
        if (capture) {
            canvasCtx.drawImage(videoEl.current, 0, 0, width, height)
            return
        }
        canvasCtx.fillStyle = "#AAA"
        canvasCtx.fillRect(0, 0, width, height)

    }, [capture])

    const doTranscode = async () => {
        await ffmpeg.load();
        console.log("strat",new Date())
        await ffmpeg.write("input", file.blob);
        await ffmpeg.transcode("input", "output.mp4", "-r 30 -s 376x282")
        console.log("stop",new Date())

        const data = ffmpeg.read("output.mp4")
        setOutputFile({visible:true,url:URL.createObjectURL(new Blob([data.buffer]))})
    }
    return  <div style={{ width: "800px", margin: "0 auto" }}>
        <video ref={videoEl} width="100%" />
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex",flexFlow: "column nowrap" }}>
                <button onClick={() => setCapture(true)}>capture</button>
                <button onClick={() => setCapture(false)}>clear</button>
            </div>
            <canvas ref={canvasEl}></canvas>
        </div>
        <div style={{ display: "flex" }}>
            <div><button onClick={() => { setRecord(!isRecord) }}> {isRecord ? "stop" : "start"}</button></div>
            <div>{file.visible && <a href={file.url} download="recoredvideo.mkv">download</a>}</div>
        </div>
        {file.visible && <video src={file.url} controls width="100%" />}
            {file.visible &&
                <div>
                    <button onClick={doTranscode}> Click Start to transcode 376x282 px 30fps </button>
                    {outputFile.visible && <video src={outputFile.url} controls width="100%" />}
                </div>}
        </div>
   
}
export default PCMedia