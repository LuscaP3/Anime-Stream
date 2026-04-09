import { useEffect, useState } from "react";

import styles from './home.module.css'
import jikan from '../../services/JikanApi'

import TopCard from "./topCard/TopCard.jsx";
import Carousel1 from "./carousel/Carousel.jsx"
import Carousel2 from "../../components/carousel/Carousel.jsx";
import Card from "../../components/card/Card.jsx";


function Home(){
    const [topAnimes, setTopAnimes] = useState(null);
    const [mostPopular, setMostPopular] = useState(null);

    useEffect( () => {
        jikan.getTopAnimes()
        .then( (res) => {
            const data = res.data;
            data.sort((a, b) => a.rank - b.rank);
            setTopAnimes(data.slice(0,10));
        });

        jikan.getMostPopular()
        .then( (res) => {
            const data = res.data;
            setMostPopular(data);
        });

    }, []);


    return(
        <div className = {styles.container}>

            <h1 className = {styles.description}>{'| Top 10'}</h1>
            <div className = {styles['top-10']}>
                { topAnimes && 
                <Carousel1 gap = {15}>
                    {topAnimes.map( (element, index) => (<TopCard key = {index} anime = {element}/>))}
                </Carousel1>
                }
            </div>
            
            <h1 className = {styles.description}>{'| Most Popular'}</h1>
            { mostPopular && 
                <Carousel2 gap = {15}>
                    {mostPopular.map( (element, index) => (<Card key = {index} anime = {element}/>))}
                </Carousel2>
            }

        </ div>
    );
}

export default Home;