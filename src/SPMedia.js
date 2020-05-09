import React, { useRef } from 'react'
// import { createFFmpeg } from '@ffmpeg/ffmpeg'

const SPMedia = () => {
    // const ffmpeg = createFFmpeg({
    //     log: true,
    // });
    // const doTranscode = async (blob) => {
    //     await ffmpeg.load();
    //     await ffmpeg.write("input", blob);
    //     await ffmpeg.run("-i input")
    //     // await ffmpeg.transcode("input", "output.mp4", "-r 30 -s 376x282")
    //     // const data = ffmpeg.read("output.mp4")
    // }
    const inputEl = useRef(null)
    const videoEl = useRef(null)
    // const convert = () => {
    //     const file = inputEl.current.files[0]
    //     const blob = new Blob([file], { type: file.type })
    //     doTranscode(blob)
    //     // videoEl.current.src = url
    // }
    return <div>
        <input type="file" name="image" accept="video/*" capture="user" ref={inputEl} />
        {/* <button onClick={convert}>ok</button> */}
        <video ref={videoEl} controls width="100%" />
    </div>
}
export default SPMedia