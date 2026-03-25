import styles from './animeSummary.module.css'
import * as utils from '../../services/utils.js'

function AnimeSummary({anime}){

    return (
        <div className = {styles.container}>

            <div className = {styles.info}>
                <div className = {styles['image-wrapper']}> <img src = {anime.images.jpg.image_url}/> </div>

                <div className = {styles.right}>
                    <header className = {styles.header}>
                    <h2 className = {[styles.title, styles.t].join(' ')}> {anime.title} </h2>
                    <p className = {[styles.airing, styles.t].join(' ')} style = { anime.airing ? {'--color': '#82c487'} : {'--color': 'var(--text)'}}> {anime.airing ? 'Airing' : 'Finished'} </p>
                </header>
                
                    <div className = {styles['row-display']}>
                        { anime.rank && <div className = {styles['rank-wrapper']}> <p className = {[styles.t, styles.rank].join(' ')}>{`#${anime.rank}`}</p> <p className = {styles.t}>Ranking</p></div>}

                        {anime.season && <p>{`${utils.strFormat(anime.season)}`}</p>}
                        {anime.year && <p>{`${anime.year}`}</p>}
                        {anime.episodes &&<p style = {{"opacity":"70%"}}>{anime.year ? `•` : ''}</p>}
                        {anime.episodes && <p>{anime.type == 'TV' || anime.type == 'ONA'? `${anime.episodes} Episodes` : anime.type}</p>}
                    </div>

                    <p className = {styles.synopsis}> {anime.synopsis} </p>
                </div>

            </div>
            
            <footer className = {styles.footer}>
                <div className = {styles['genres-container']}>
                    {
                    anime.genres.map( (element, index) => (
                        <p key = {index} className = {styles.genre}> {element.name} </p>
                    ))
                    }
                </div>
                {anime.score && <p className= {styles.score}> {`⭐${anime.score}`} </p>}
            </footer>
        </div>
    );
}

export default AnimeSummary;