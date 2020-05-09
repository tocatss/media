import React from 'react'
import SPMedia from './SPMedia'
import PCMedia from './PCMedia'

const Media = () => {
    if (navigator.userAgent.match(/iphone/gi)) {
        return <SPMedia />
    }
    return <PCMedia />
   
}
export default Media