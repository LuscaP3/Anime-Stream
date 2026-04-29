import styles from './top.module.css';
import * as utils from '../../../services/utils';
import jikan from '../../../services/JikanApi';

import { useEffect, useState } from 'react';
import { FiStar, FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';


function Top({anime}){

    function getStars(){
        const score = Math.floor(anime.score);
        const res = [];
        for(let i=0; i< 10; i++){
            if(i<score){
                res.push(<FiStar key = {i} size = {'1.4em'} color = {'var(--blue)'} fill = {'var(--blue)'}/>);
            }
            else{
                res.push(<FiStar key = {i} size = {'1.4em'} color = {'var(--bg1)'} fill = {'var(--bg1)'} />);
            }
        }

        return res;
    }

    return(
        <div className = {styles.top}>

            <div className = {styles['image-wrapper']}>
                <img src = {anime.images.jpg.image_url} />
            </div>

            <div className = {styles.right}>

                <section className = {styles.info}>
                    <h2>{anime.title}</h2>

                    <div className = {styles['rank-info']}>
                        <div className = {styles.rank}>
                            <h2>{`#${anime.rank}`}</h2>
                            <p>Ranking</p>
                        </div>

                        <div className = {styles['anime-info']}> 
                            {anime.season   && <p>{`${utils.strFormat(anime.season)}`}</p>}
                            {anime.year     && <p>{`${anime.year}`}</p>}
                            {anime.episodes && <p style = {{"opacity":"70%"}}>{anime.year ? `•` : ''}</p>}
                            {anime.episodes && <p>{anime.type == 'TV' || anime.type == 'ONA'? `${anime.episodes} Episodes` : anime.type}</p>}
                        </div>
                    </div>
                </section>

                <section className = {styles.score}>
                    <div> {getStars()} </div>

                    <div className = {styles.votes}>
                        <p> {`${anime.score} - `} </p>
                        <FiUser color = {'var(--text)'} size = {'0.75em'}/>
                        <p> {`${anime.scored_by} votes`} </p>
                    </div>
                </section>

                <section className = {styles.genres}>
                    {anime.genres.map( (element, index) => <Link to = {`/filter?genre=${element.mal_id}`} className = {styles.link} key = {index}> {element.name} </Link>)}
                </section>

            </div>

            <div className = {styles.background}> { <img src = {anime.images.jpg.large_image_url} /> } </div>

        </div>
    );
}

export default Top;