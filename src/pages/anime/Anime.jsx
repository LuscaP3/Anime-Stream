import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import styles from './anime.module.css'

import AnimeSummary from './AnimeSummary.jsx';
import Carousel from '../../components/carousel/Carousel.jsx';
import Card from '../../components/card/Card.jsx';

import jikan from '../../services/JikanApi.js'

function Anime({anime}){
    const [seasons, setSeasons] = useState(null);
    const [relations, setRelations] = useState(null);

    const [animeRef, setAnimeRef] = useState(null);
    const { id: animeParam} = useParams();

    
    useEffect( () => {

        let id;

        setSeasons(null);
        setRelations(null);
        
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
        
        jikan.getSeasons(id)
        .then( (element) => { setSeasons(element.length <= 1 ? null : element) });
        
        

        jikan.getRelations(id)
        .then( (element) => { setRelations(element.length == 0 ? null : element) })
    
    }, [animeParam]);    


    return(
        <>
        { animeRef &&
            <div className =  {styles.container}>
                <AnimeSummary anime = {animeRef}/>

                <div className = {styles.carousels}>            
                { seasons && <>
                    <h2 className = {styles.description}>{'| Seasons'}</h2>
                    <Carousel>
                        {seasons.map( (element, index) => <Card key = {index} anime = {element}/>)}
                    </Carousel>
                </>}

                { relations && <>
                    <h2 className = {styles.description}>{'| Relations'}</h2>
                    <Carousel>
                        {relations.map( (element, index) => <Card key = {index} anime = {element}/>)}
                    </Carousel>
                </>}
                </div>
            </div>
        }     
        </>
    );
}

export default Anime;