import { Link } from 'react-router-dom';
import styles from './navBar.module.css'

import { FiHome, FiFilter, FiTv, FiSearch, FiCalendar } from "react-icons/fi";

function NavBar(){
    return(
        <div className = {styles.container}>

            <Link to = '/' style = {{"textDecoration": "none"}}> <h2 className = {styles.brand}>Anime<span> Stream</span> </h2> </Link>

            <nav>
                <Link to = '/' className = {styles.link}> <FiHome/> Home </Link>
                <Link className = {styles.link}> <FiFilter/> Filter </Link>
                <Link to = '/calendar' className = {styles.link}> <FiCalendar/> Calendar </Link>
            </nav>

            <div className = {styles.search}><input type="text" placeholder='Search'/> <button> <FiSearch /> </button> </div>

        </div>
    );
}

export default NavBar;