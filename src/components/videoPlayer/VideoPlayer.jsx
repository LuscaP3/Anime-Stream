import { useEffect, useRef, useState } from "react";

import styles from './videoPlayer.module.css'

function VideoPlayer({ videoId, onStateChange, onReady }) {
  const playerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if(!videoId || !videoRef.current) return;

    // Função chamada quando a API estiver pronta
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(videoRef.current, {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: {
          controls: 0,
          rel: 0,
          mute:1,
          autoplay:1,
          modestbranding: 1,
          showinfo: 0
        },
        events: {
          onReady: onReady,
          onStateChange: onStateChange
        },
      });
    };

    // Carrega a API apenas uma vez
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      window.onYouTubeIframeAPIReady();
    }


    // Cleanup (quando o componente desmontar)
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  return (
    <>

    {videoId != null &&

    <div className = {styles.container}>
      <div ref = {videoRef} />
      {false && <div className = {styles.overlay} />}
    </div>

    }

    </>

  );
}

export default VideoPlayer;