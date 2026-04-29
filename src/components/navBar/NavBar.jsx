import { Link, useNavigate } from 'react-router-dom';
import styles from './navBar.module.css'

import { FiHome, FiFilter, FiTv, FiSearch, FiCalendar } from "react-icons/fi";
import { useRef, useState } from 'react';
import SearchBar from '../search_bar/SearchBar';

function NavBar(){
    const navigate = useNavigate();
    const[currentPage, setCurrentPage] = useState('home');

    return(
        <div className = {styles.navbar}>

            <Link to = '/' style = {{'textDecoration': 'none'}}> <h2 className = {styles.brand}>Anime<span> Stream</span> </h2> </Link>

            <nav>
                <Link to = '/'         className = {styles.link} onClick = { () => setCurrentPage('home')}>      Home     </Link>
                <Link to = '/filter'   className = {styles.link} onClick = { () => setCurrentPage('filter')}>    Filter   </Link>
                <Link to = '/calendar' className = {styles.link} onClick = { () => setCurrentPage('calendar')}>  Calendar </Link>
            </nav>

            <div className = {styles['search-wrapper']}> <SearchBar onSearch = {(value) => navigate(`/filter?search=${value}`)}/> </div>
        </div>
    );
}

export default NavBar;