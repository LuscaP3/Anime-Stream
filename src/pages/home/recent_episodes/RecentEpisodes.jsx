import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './recentEpisodes.module.css'
import Jikan from '../../../services/JikanApi';
import VideoButton from './VideoButton';

function RecentEpisodes(){
    const[episodes, setEpisodes] = useState([]);
    const[animes, setanimes] = useState([]);

    const montage = useRef(false);

    useEffect( () => {
        if(montage.current) return;
        montage.current = true;

        Jikan.getRecentEpisodes()
        .then( (res) => {
            const data = res.data;
            
            
            data.forEach(element => {

                const anime = {title: element.entry.title, image_url: element.entry.images.jpg.image_url, mal_id: element.entry.mal_id};
                setanimes( (prev) => [...prev, anime]);

                Jikan.getEpisodeById(element.entry.mal_id, element.episodes[0].mal_id)
                .then( (episode) => {
                    const ep = {animeTitle: element.entry.title, episodeTitle: episode.title, image: episode.images.jpg.image_url, episodeNumber: episode.episode.replace("Episode ","")};
                    setEpisodes( (prev) => [...prev, ep]);
                }); 
            });

        });
    }, []);

    return(
        <div className = {styles['recent-episodes']}>

            {episodes && episodes.map( (element, index) =>
            
            <div key = {index} className = {styles.container}>
                <VideoButton anime = {element}/>

                <div className = {styles['episode-info']}>
                    <p className = {styles['episode-number']}> {`Episode ${element.episodeNumber}`} </p>
                    <p  style = {{'color': 'var(--subtext)'}}> {element.animeTitle}</p>
                </div>
            </div>
                
            )}
        </div>
    );
}

export default RecentEpisodes;