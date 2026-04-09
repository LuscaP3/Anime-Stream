import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight  } from "react-icons/fi";

import styles from './calendar.module.css';

import jikan from '../../services/JikanApi';
import MiniCard from '../../components/miniCard/MiniCard';

import { useSearchParams } from 'react-router-dom';

function Calendar(){
    const[currentSeason, setCurrentSeason] = useState(null);
    const[currentPage, setCurrentPage] = useState(1);

    const day = new Date().getDay();

    const weekdays = ['Sundays', 'Mondays','Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
    const colors = ['#f7a663', '#f5f763', '#63f779', '#63ebf7', '#ad63f7', '#f563f7', '#f76363'];

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const nPages = useRef(0);

    useEffect( () => {
        jikan.getCurrentSeason(currentPage)
        .then( (res) => {
            const data = res.data;
            setCurrentSeason(data);

            nPages.current = res.pagination.last_visible_page;
            setSearchParams(page);
        });

    }, [currentPage]);

    function pages(){
        const pages = [];
        for(let i=1; i<=nPages.current; i++){
            pages.push(<button onClick = { () => {
                    setCurrentPage(i);
                    setCurrentSeason(null);

                }} className = {currentPage == i ? [styles.page, styles['current-page']].join(' ') : styles.page} key = {i}> {i} </button>);
        }

        return pages;
    }

    function getCurrentSeason() {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        let season;

        if (month <= 3) season = "Winter";
        else if (month <= 6) season = "Spring";
        else if (month <= 9) season = "Summer";
        else season = "Fall";

        return `${season} ${year}`;     

    }

    function goToPage(newPage) {
        if(newPage < 1 || newPage > nPages.current) return;
        setCurrentSeason(null);
        setSearchParams({ page: newPage });
        setCurrentPage(newPage)
    }

    function getNumberByWeekDay(day){
        let result;
        for(let i=0; i<7;i++){
            if(day == weekdays[i]){
                result = i;

                break;
            }
        }
        return result;
    }

    return(
        <div className = {styles.container}>
            <div className = {styles['calendar-wrapper']}>  
                <div className = {styles.top}>
                    <h1>{getCurrentSeason()}</h1>
                    <div className = {styles.navigate}>
                        <button className = {styles['page-button']} onClick={() => goToPage(currentPage - 1)}> <FiChevronLeft  /> </button>
                            {pages()}
                        <button className = {styles['page-button']} onClick={() => goToPage(currentPage + 1)}> <FiChevronRight /> </button>
                    </div>
                </div>


                <div className = {styles.calendar}>
                    {weekdays.map( (weekday, index) =>
                    <div className= {styles.cards} key = {index}> 
                        <h2 className = {styles.weekday}>{weekday}</h2>
                        { currentSeason &&   currentSeason.map( (element, index) => 
                            element.broadcast.day == weekday ? 
                            <div 
                                key = {index} 
                                className = {styles['card-wrapper']} 
                                style = {{
                                    '--color': colors[getNumberByWeekDay(element.broadcast.day)]
                                }}> <MiniCard anime = {element}/> </div>
                            : '')} 
                    </div>)}                    
                </div>
            </div>
        </div>
    );
}

export default Calendar;