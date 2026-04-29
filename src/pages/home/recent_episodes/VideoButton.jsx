import { useRef, useState } from 'react';
import styles from './videoButton.module.css'

import { FiPlay } from "react-icons/fi";

function VideoButton({anime}){
    const overlayRef = useRef(null);
    const [overlayOpacity, setOverlayOpacity] = useState(null);

    return(
        <div onMouseEnter = {() => setOverlayOpacity('50%')} onMouseLeave = {() => setOverlayOpacity('0')} className = {styles['video-button']}>
            <img src = {anime.image}/>
            <div ref = {overlayRef} className = {styles.overlay} style = {{'opacity': overlayOpacity}}> <FiPlay color = {'var(--text)'} size = {'3em'}/> </div>
        </div>
    );
}

export default VideoButton;