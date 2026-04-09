import { useState } from 'react';
import styles from './miniCard.module.css'
import { useNavigate } from 'react-router-dom';

function MiniCard({anime}){
    const navigate = useNavigate();


    return(
        <button onClick = {() => navigate(`/anime/${anime.mal_id}`)} className = {styles['mini-card']}>
            <img src ={anime.images.jpg.image_url}/>
            <p className={styles.title}>{anime.title}</p>
        </button>
    );
}

export default MiniCard;