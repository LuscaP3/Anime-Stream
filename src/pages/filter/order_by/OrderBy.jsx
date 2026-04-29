import { useState } from 'react';
import styles from './orderBy.module.css'

import { FiChevronDown, FiChevronUp } from "react-icons/fi";

function OrderBy({onSortClick, onOrderClick}){
    const[sort, setSort] = useState('desc');
    const[order, setOrder] = useState('score');


    function handleSortClick(value){
        setSort(value);
        onSortClick(value);
    }

    function handleOrderClick(value){
        setOrder(value);
        onOrderClick(value)
    }

    return(
        <div className = {styles['order-by']}>
            <div className = {styles.title}> 
                <p>Order By</p>
                <button title = 'asc'  onClick = { () => { handleSortClick('asc')  }} className = {sort == 'asc'  ? styles['pressed-sort-button'] : styles['sort-button'] }>  <FiChevronUp />   </button>
                <button title = 'desc' onClick = { () => { handleSortClick('desc') }} className = {sort == 'desc' ? styles['pressed-sort-button'] : styles['sort-button'] }>  <FiChevronDown /> </button>
            </div>

            <div className = {styles.options}> 
                <button onClick = { () => { handleOrderClick('title')      }}   className = {order == 'title'      ? styles['pressed-order-button'] : styles['order-button'] }>  Title      </button>
                <button onClick = { () => { handleOrderClick('start_date') }}   className = {order == 'start_date' ? styles['pressed-order-button'] : styles['order-button'] }>  Start date </button>
                <button onClick = { () => { handleOrderClick('episodes')   }}   className = {order == 'episodes'   ? styles['pressed-order-button'] : styles['order-button'] }>  Episodes   </button>
                <button onClick = { () => { handleOrderClick('score')      }}   className = {order == 'score'      ? styles['pressed-order-button'] : styles['order-button'] }>  Score      </button>
                <button onClick = { () => { handleOrderClick('popularity') }}   className = {order == 'popularity' ? styles['pressed-order-button'] : styles['order-button'] }>  Popularity </button>
            </div>

        </div>
        
    );
}

export default OrderBy;