import styles from './filter.module.css'

import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FiChevronDown } from "react-icons/fi";

import Jikan from '../../services/JikanApi';
import Card from '../../components/card/Card';
import Slider from '../../components/slider/Slider.jsx'

import PageHandler from './page_handler/PageHandler.jsx'
import OrderBy from './order_by/OrderBy.jsx';

function Filter(){
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || null;

    const [genreParams, setGenreParams] = useSearchParams();
    const genre = searchParams.get("genre") || null;

    const[animes, setAnimes] = useState(null);
    const[genres, setGenres] = useState([]);
    const[rate, setRate] = useState('5.00');
    const[order, setOrder] = useState('title');
    const[sort, setSort] = useState('asc');
    const[status, setStatus] = useState(null);

    const[change, setChange] = useState(false);

    const[currentPage, setCurrentPage] = useState(1);
    const [nPages, setnPages] = useState(null); 

    const genreList = Jikan.getGenres();

    const montage = useRef(false);

    useEffect( () => {
        const genreId = genre ? [Number(genre)] : [];
        const searchP = search ? search : null; 


        setAnimes(null);
        setGenres(genreId);
        setOrder('score');
        setSort('desc');

        Jikan.getAnimes({search: searchP, page: 1, genres: genreId, minRate: rate, order: 'score', sort: 'desc', status: status})
        .then( (res) => {
            setAnimes(res.data);

            setnPages(res.pagination.last_visible_page);
            setCurrentPage(1);

            montage.current = true;
        });
    }, [searchParams, genreParams]);

    useEffect( () => {
        if(!montage.current) return;

        getPages();
    }, [currentPage, sort, order]);

    function getPages(){
        setAnimes(null);
        setnPages(0);

        Jikan.getAnimes({search: search, page: currentPage, genres: genres, minRate: rate, order: order, sort: sort, status: status})
        .then( (res) => {
            setAnimes(res.data);
            setnPages(res.pagination.last_visible_page);
        });
    }

    function handleGenre(id){
        const contais = genres.includes(id);

        if(contais){
            const copy = [...genres];
            const newList = copy.filter( (item) => item != id );
            setGenres(newList);
        }
        else{
            setGenres( (prev) => [...prev, id]);
        }

        setChange(true);
    }

    function handleStatus(value){
        if(status == value || !value){
            setStatus(null)
        }
        else{
            setStatus(value);
        }

        setChange(true);
    }

    function handleSlider(value){
        setRate(value.toFixed(2));
        setChange(true);
    }

    function handleApply(){
        if(change){
            getPages();
            setCurrentPage(1);
            setChange(false);
        }
    }

    return(
        <div className = {styles.filter}>
            <aside>
                <section>
                    <h2> Status </h2>
                    <div className = {styles.status}>
                        <button onClick = { () => { handleStatus('complete') }} className = {  status == 'complete' ? styles['selected-status'] : styles['status-button']}> Complete  </button>
                        <button onClick = { () => { handleStatus('airing') }}   className = {  status == 'airing'   ? styles['selected-status'] : styles['status-button']}> Airing    </button>
                        <button onClick = { () => { handleStatus('upcoming') }} className = {  status == 'upcoming' ? styles['selected-status'] : styles['status-button']}> Up Coming </button>
                        <button onClick = { () => { handleStatus(null) }}       className = { !status               ? styles['selected-status'] : styles['status-button']}> All       </button>
                    </div>
                </section>

                <h2>Genre</h2>
                <section>
                    <div className= {styles.genres}>
                        {genreList.map( (element, index) => 
                            <button 
                                onClick = { () => handleGenre(element.id) } 
                                className = {genres.includes(element.id) ? styles['selected-genre'] : styles['genre-button']} 
                                key = {index}>
                            {element.genre}
                            </button>)}
                    </div>
                </section>

                <section>
                    <h2>{`Min-Rate: ${rate}`}</h2>
                    <div className = {styles['slider-wrapper']}> <p>0</p> <Slider initialValue = {5} maxValue = {10} size = {0.6} color = {"var(--blue)"} onChange={ (value) => handleSlider(value)}/> <p>10</p></div>
                </section>

                <section className = {styles['apply-container']}>
                    <button className = { change ? styles.apply : styles['apply-off']} onClick={ () => {handleApply()}}>Apply</button>
                </section>
                
            </aside>

            <section className = {styles.config}>

                <div className = {styles.top}>
                    <OrderBy onOrderClick = { (value) => setOrder(value)} onSortClick = { (value) => setSort(value)}/>
                    <PageHandler nPages = {nPages} currentPage = {currentPage} onClick = { (value) => setCurrentPage(value)}/>                      
                </div>
                { search && <h2> {`Search: ${search}`} </h2>}

                <div className = {styles.response}>
                    {animes && animes.map( (element, index) => <Card key = {index} anime = {element}/>)}
                </div>
            </section>

        </div>
    );
}

export default Filter;