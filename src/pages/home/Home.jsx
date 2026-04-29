import { useEffect, useState } from "react";
import { useRef } from "react";
import { Link } from 'react-router-dom';

import styles from './home.module.css'
import jikan from '../../services/JikanApi'

import Top10 from "./top/Top10.jsx";
import RecentEpisodes from "./recent_episodes/RecentEpisodes.jsx";
import Carousel from '../../components/carousel/Carousel.jsx'


function Home(){
    const [mostPopular, setMostPopular] = useState(null);

    useEffect( () => {

        jikan.getMostPopular()
        .then( (res) => {
            const data = res.data;
            setMostPopular(data);
        });

    }, []);


    return(
        <div className = {styles.home}>
            <div className = {styles.container}>

                <section className = {styles.section}>
                    <Top10 />
                </section>

                <section className = {styles.section}>
                    <p className = {styles.description}> Recent Episodes</p>
                    <RecentEpisodes />
                </section>             

                <section className = {styles.section}>
                    <p className = {styles.description}> Most Popular </p>
                    <Carousel gap = {20}>
                        { mostPopular && mostPopular.map( (element, index) => (
                            <Link to = {`/anime/${element.mal_id}`} style = {{'textDecoration': 'none'}} key = {index} className = {styles['most-popular']}> 
                                <img src = {element.images.jpg.image_url}/>
                            </Link>))}
                    </Carousel>
                </section>

            </div>

        </ div>
    );
}

export default Home;