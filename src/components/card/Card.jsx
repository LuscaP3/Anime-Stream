import { useEffect, useRef, useState } from 'react';
import styles from './card.module.css'

import jikan from '../../services/JikanApi.js'

import * as utils from '../../services/utils.js'
import { useNavigate } from 'react-router-dom';

function Card({anime}){
    const hovering = useRef(false);
    const title = useRef(null)
    const deg = useRef(90);

    const navigate = useNavigate();

    const [animeRef, setAnimeRef] = useState(null);

    useEffect( () => {
        if(typeof(anime) === 'number'){
            const temp = jikan.getAnimeById(anime);
            temp.then( (element) => { setAnimeRef(element.data) });

        }
        else{
            setAnimeRef(anime);
        }

    }, []);

    const loop = () => {
        if (hovering.current){
            deg.current = (deg.current + 0.125/2) % 360;
            document.documentElement.style.setProperty('--borderProgress', `${deg.current}deg`);

            requestAnimationFrame(loop);
        }
    };

    function handleMouseEnter(){
        hovering.current = true;
        loop();
    }

    function handleMouseLeave(){
        hovering.current = false
    }

    function getGenres(){
        const genre = animeRef.genres.slice(2);
        let str = '';
        genre.map( (element) => {
            str += ' ' + element.name;
        });

        return str;
    }

    return(
        <>
        { animeRef &&
            <button onClick = {() => navigate(`/anime/${animeRef.mal_id}`)} onMouseEnter = {handleMouseEnter} onMouseLeave = {handleMouseLeave} className = {styles.container}>
                <div className = {styles["image-wrapper"]}>
                    <img className = {styles.image} src = {animeRef.images.jpg.image_url}/>
                    <p className = {styles.score}>⭐{animeRef.score}</p>
                </div>

                <div className = {styles.info}>
                    <p ref = {title} title = {animeRef.title} className = {styles.title}>{animeRef.title}</p>

                    <div className = {styles["row-display"]}>
                        { animeRef.season && <p className = {styles.description}>{`${utils.strFormat(animeRef.season)}`}</p>}
                        { animeRef.year && <p className = {styles.description}>{`${animeRef.year}`}</p>}
                        <p className = {styles.description} style = {{"opacity":"70%"}}>{animeRef.year ? `•` : ''}</p>
                        { animeRef.episodes && <p className = {styles.description}>{animeRef.type == 'TV' || animeRef.type == 'ONA'? `${animeRef.episodes} Episodes` : animeRef.type}</p>}
                    </div>


                    <div className = {styles["genres-container"]}>
                        { animeRef.genres[0] && <p className = {styles.genre}>{animeRef.genres[0].name}</p>}
                        { animeRef.genres[1] && <p className = {styles.genre}>{animeRef.genres[1].name}</p>}
                        { (animeRef.genres.length > 2) && <p title={getGenres()}className = {styles.genre}>{`+ ${animeRef.genres.length - 2}`}</p>}
                    </div>
                </div>
            </button>
        }
        </>
    );

}

export default Card;