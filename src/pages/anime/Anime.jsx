import { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";

import styles from './anime.module.css'

import AnimeSummary from './anime_summary/AnimeSummary.jsx';
import Carousel from '../../components/carousel/Carousel.jsx';
import Card from '../../components/card/Card.jsx';

import jikan from '../../services/JikanApi.js'
import Episode from '../../components/episode/Episode.jsx';

function Anime({anime}){
    const [seasons, setSeasons] = useState(null);
    const [relations, setRelations] = useState(null);
    const [episodes, setEpisodes] = useState(null);

    const [animeRef, setAnimeRef] = useState(null);
    const { id: animeParam} = useParams();

    const containerRef = useRef(null);
    const episodesRef = useRef(null);

    const seasonBuffer = useRef(null);

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            if(episodesRef.current){
                episodesRef.current.style.height = containerRef.current.offsetHeight  + 'px';
            }

        });

        if(episodesRef.current){
            episodesRef.current.style.height = containerRef.current.offsetHeight  + 'px';
        }

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    
    useEffect( () => {
        setSeasons(null);
        setRelations(null);
        setEpisodes(null);

        let id;
        
        if(animeParam){
            const temp = jikan.getAnimeById(animeParam);
            temp.then( (element) => { setAnimeRef(element.data) });
            id = Number(animeParam);
        }

        if(typeof(anime) === 'number'){
            const temp = jikan.getAnimeById(anime);
            temp.then( (element) => { setAnimeRef(element.data) });
            id = anime;
    
        }
        else if(typeof(anime) === 'object'){
            setAnimeRef(anime);
            id = anime.mal_id;
        }  
        
        jikan.getRelations(id)
        .then( (element) => { setRelations(element.length == 0 ? null : element) });

        jikan.getEpisodes(id)
        .then( (element) => { 
            element.sort((a, b) => a.mal_id - b.mal_id);
            setEpisodes(element.length == 0 ? null : element)
        }); 
        
        jikan.getSeasons(id)
        .then( (element) => { setSeasons(element) });
    
    }, [animeParam]);


    return(
        <div ref = {containerRef} className =  {styles.container}>
        { animeRef && <>
            <div className = {styles.anime}>
                <AnimeSummary anime = {animeRef}/>

                <div className = {styles.carousels}>            
                    { seasons && <>
                        <h2 className = {styles.description}>{'| Seasons'}</h2>
                        <Carousel>
                            {seasons.map( (element) => <Card key = {element.mal_id} anime = {element}/> )}
                        </Carousel>
                    </>}

                    { relations && <>
                        <h2 className = {styles.description}>{'| Relations'}</h2>
                        <Carousel>
                            {relations.map( (element, index) =>  <Card key = {index} anime = {element}/> )}
                        </Carousel>
                    </>}
                </div>

            </div>

            <div ref = {episodesRef} className = {styles.episode}>

                <h2 className = {styles.description}>{'| Watch'}</h2>
                { episodes ? 
                    <div className = {styles['episode-list']}> {episodes.map( (element, index) => <Episode key = {index} episode = {element}/>)} </div> :
                    <p>*No episodes available</p>
                }

            </div>
            </>}            
        </div>    
    );
}

export default Anime;