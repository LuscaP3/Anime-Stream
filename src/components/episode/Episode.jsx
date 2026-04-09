import { useEffect } from 'react';
import styles from './episode.module.css'

function Episode({episode}){

    return(
        <button className = {styles.episode}>
            <img src = {episode.images.jpg.image_url}/>

            <div className = {styles.title}>
                <h2>{episode.episode.replace("Episode ","#")}</h2>
                <p>{episode.title}</p>
            </div>
        </button>
    );
}

export default Episode;