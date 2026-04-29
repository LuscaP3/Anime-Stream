import { useEffect, useRef } from 'react';
import styles from './searchBar.module.css'
import { FiSearch } from "react-icons/fi";

function SearchBar({onSearch}){
    const inputRef = useRef(null);
    const inputButtonRef = useRef(null);
    const isOnFocus = useRef(false);

    useEffect( () => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [handleKeyDown]);

    function handleKeyDown(event){
        if(event.key === 'Enter' && isOnFocus.current){
            onSearch(inputRef.current.value);
        }
    }

    function handleFocus(){
        isOnFocus.current = true;
        inputRef.current.style.borderColor = "var(--blue)";
        inputButtonRef.current.style.borderColor = "var(--blue)";
    }

    function handleBlur(){
        isOnFocus.current = false;
        inputRef.current.style.borderColor = "var(--border)";
        inputButtonRef.current.style.borderColor = "var(--border)";
    }

    return(
        <div className = {styles.search}>
            <input onFocus = {handleFocus} onBlur = {handleBlur} ref = {inputRef} type="text" placeholder='Search...'/> 
            <button onClick = { () => onSearch(inputRef.current.value)} ref = {inputButtonRef}> <FiSearch /> </button> 
        </div>
    );
}

export default SearchBar;