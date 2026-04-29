import { useEffect, useRef, useState } from 'react';

import Top from './Top'

import styles from './top10.module.css'
import jikan from '../../../services/JikanApi';

import { FiChevronRight } from "react-icons/fi";

function Top10(){
    const[topAnimes, setTopAnimes] = useState(null);
    const[translation, setTranslation] = useState(0);

    const cartRef = useRef(null);

    useEffect( () => {

        jikan.getTopAnimes()
        .then( (res) => {
            const data = res.data;
            data.sort((a, b) => a.rank - b.rank);
            setTopAnimes(data.slice(0,10));
        });

    }, []);


    function getSlides(){
        const circles = [];

        for(let i=0; i<10; i++){
            if(i == translation){
                circles.push( <button key = {i} onClick = { () => handleSlideClick(i)} className = {styles.slides} style = {{'backgroundColor': 'var(--blue)'}}></button>);
            }
            else{
                circles.push( <button key = {i} onClick = { () => handleSlideClick(i)} className = {styles.slides}></button>);
            }
        }

        return circles;
    }

    function handleSlideClick(index){
        setTranslation(index);
        cartRef.current.style.transform = `translate(-${index * 100}%, 0)`;
    }

    function handleClick(){
        if(translation < 9){
            setTranslation( prev => prev + 1);
            cartRef.current.style.transform = `translate(-${(translation + 1) * 100}%, 0)`;
        }
        else{
            setTranslation(0);
            cartRef.current.style.transform = `translate(-${0 * 100}%, 0)`;
        }
    }

    return(
        <>
        {topAnimes  &&
            <div className = {styles.top10}>

                <div className = {styles.rail}> 
                    <div ref = {cartRef} className = {styles.cart}> { topAnimes.map( (element, index) => < Top key = {index} anime = {element}/>)} </div>
                </div>

                <button className = {styles['next']} onClick = { handleClick }> <FiChevronRight color = {'var(--text)'} size = {'3em'}/> </button>

                <div className = {styles['slides-container']}> {getSlides()} </div>

            </div>
        }
        </>
    );
}

export default Top10;