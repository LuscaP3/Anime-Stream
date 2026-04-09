import { useEffect, useRef, useState } from 'react';
import jikan from '../../../services/JikanApi'

import styles from './recentEpisodes.module.css'

function RecentEpisodes(){
    const [recentEpisodes, setRecentEpisodes] = useState([]);
    const montage = useRef(false);

    useEffect( () => {
        if(!montage.current){
            montage.current = true;

            jikan.getPopularEpisodes()
            .then( (res) => {
                const data = res.data;

                data.map( (element) => {
                    if(!element.region_locked){
                        const animeId = element.entry.mal_id;
                        const episodes = element.episodes.map( (ep) => ep.mal_id);
                        
                        jikan.getEpisodeById(animeId, episodes)
                        .then( (eps) => {
                            setRecentEpisodes( (prev) => [...prev, {episodes: eps, anime_title: element.entry.title, anime_img: element.entry.images.jpg.image_url}]);
                        });
                    }
                });
            });
        }
    }, []);

    return(
        <>
            { recentEpisodes && <div className = {styles.episodes}>
                {recentEpisodes.map( (element, index) => (
                    <div className = {styles['cards-container']} key = {index}>
                        <div className = {styles['card-wrapper']}>
                            <img className = {styles['card-image']} src = {element.anime_img}/>
                            <div>
                                <h3> {element.anime_title} </h3>
                                {element.episodes.map( (ep, index) => <p key = {index}> {`${ep.episode.replace("Episode ", "#")} - ${ep.title ? ep.title : ep.episode}`} </p>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>}
        </>
    );
}

export default RecentEpisodes;