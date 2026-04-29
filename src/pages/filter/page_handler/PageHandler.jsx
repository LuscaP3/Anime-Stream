import { useEffect, useRef, useState } from 'react';
import styles from './pageHandler.module.css'
import { FiChevronLeft, FiChevronRight  } from "react-icons/fi";

function PageHandler({nPages, currentPage, onClick}){
    const pageRef = useRef(null);
    const[pageGroup, setPageGroup] = useState(1);

    function pages(){
        const maxPages = 5;
        const pages = [];

        if(nPages <= 5){
            for(let i=1; i<=nPages; i++){
                pages.push(
                    <button 
                        onClick = { () => { handleClick(i) }}
                        className = {currentPage == i ? [styles.page, styles['current-page']].join(' ') : styles.page} key = {i}> {i}
                    </button>);
            }
        }

        else{
            for(let i= pageGroup; i<maxPages + pageGroup; i++){
                if(i > nPages){
                    break;
                }
                pages.push(
                    <button 
                        onClick = { () => { handleClick(i) }}
                        className = {currentPage == i ? [styles.page, styles['current-page']].join(' ') : styles.page} key = {i}> {i}
                    </button>);
            }           
        }

    
        return pages;
        }

        function handleClick(page){
            
            onClick(page);
        }

    return(
        <div className = {styles.pages}>
            <button className = {styles['page-button']} onClick = {() => setPageGroup( (prev) => prev - 5)}> <FiChevronLeft  /> </button>

                    <div ref = {pageRef} className = {styles['page-wrapper']}>
                        {pages()}
                    </div> 

            <button className = {styles['page-button']} onClick = {() => setPageGroup( (prev) => prev + 5)}> <FiChevronRight /> </button>
        </div>
    );
}

export default PageHandler;