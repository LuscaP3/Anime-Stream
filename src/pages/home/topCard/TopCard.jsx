import styles from './topCard.module.css';

import * as utils from '../../../services/utils';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

function TopCard({anime}){
    const navigate = useNavigate();

    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
        
    const containerRef = useRef(null);

    function handleMouseMove(e){

        // Mouse Position
        const rect = containerRef.current.getBoundingClientRect();

        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        setMouseX((-rect.width/2) + mx);
        setMouseY((-rect.height/2) + my);

    }


    return(
        <button onClick = {() => navigate(`/anime/${anime.mal_id}`)} 
                className = {styles.container} 
                ref = {containerRef} 
                onMouseMove = {handleMouseMove}
                style = 
                {{
                    '--mx': `${mouseX}px`, 
                    '--my': `${mouseY}px`,
                }}>


            <div className = {styles.header}>                
                <h1 className = {styles.title}>{anime.title}</h1>
                <div className = {styles.info}>
                    {anime.season   && <p>{`${utils.strFormat(anime.season)}`}</p>}
                    {anime.year     && <p>{`${anime.year}`}</p>}
                    {anime.episodes && <p style = {{"opacity":"70%"}}>{anime.year ? `•` : ''}</p>}
                    {anime.episodes && <p>{anime.type == 'TV' || anime.type == 'ONA'? `${anime.episodes} Episodes` : anime.type}</p>}
                </ div>
            </div>

            <p className = {styles.rank}> {anime.rank} </p>


            <div className = {styles['image-wrapper']}>
                { <img src = {anime.images.jpg.large_image_url}/>}
                <div className = {styles.overlay} />
            </div>

        </button>
    );
}

export default TopCard;