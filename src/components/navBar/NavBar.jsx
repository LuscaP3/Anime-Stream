import { Link } from 'react-router-dom';
import styles from './navBar.module.css'

import { FiHome, FiFilter, FiTv, FiSearch, FiCalendar } from "react-icons/fi";

function NavBar(){
    return(
        <div className = {styles.container}>

            <nav>
                <Link to = '/' className = {styles.link}> <FiHome/> Home </Link>
                <Link className = {styles.link}> <FiFilter/> Filter </Link>
                <Link className = {styles.link}> <FiTv/> Airing </Link>
                <Link className = {styles.link}> <FiCalendar/> Calendar </Link>
            </nav>

            <div className = {styles.search}><input type="text" placeholder='Search'/> <button> <FiSearch /> </button> </div>

        </div>
    );
}

export default NavBar;