import * as utils from './utils'

class Jikan {
    #BaseUrl = 'https://api.jikan.moe/v4';
    #queue = [];
    #isProcessing = false;
    #rateLimit = 550;

    constructor() {
        
    }

    async #processQueue(){
      if(this.#isProcessing || this.#queue.length === 0 ) return;
      this.#isProcessing = true;

      const { url, resolve, reject } = this.#queue.shift();

      try{
        const response = await fetch(`${this.#BaseUrl}/${url}`);
        resolve(response.json());
      } 

      catch (error){
        reject(error);
      } 

      finally{
        await utils.sleep(this.#rateLimit);
        this.#isProcessing = false;
        this.#processQueue();
      }
    }


    async consume(url){
      return new Promise((resolve, reject) => {
        this.#queue.push({ url, resolve, reject });
        this.#processQueue();
      });
    }

    clearQueue(){
      this.#queue = [];
    }
    
    async getRelations(id){
      const relations = await this.consume(`anime/${id}/relations`);

      let temp = relations.data.filter( (element) => element.relation != 'Sequel' && element.relation != 'Prequel' );
      const temp2 = temp.map( (element) => element.entry).flat();
      const temp3 = temp2.filter( (element) => element.type == 'anime'); 

      const ids = temp3.map(obj => obj.mal_id);

      return ids;
      
    }

    async getSeasons(id){
      const anime = await this.getAnimeFullById(id);
      let prequels = [], sequels = [];

      for(let relation of anime.data.relations){
            if(relation.relation == "Prequel"){
                prequels = await this.getSequence(relation.entry[0].mal_id, "Prequel");
                break;
            }
        }

        
      for(let relation of anime.data.relations){
          if(relation.relation == "Sequel"){
              sequels = await this.getSequence(relation.entry[0].mal_id, "Sequel");
              break;
          }
      }

      const res = [...prequels, ... sequels, ...[anime.data]];
      res.sort((a, b) => a.mal_id - b.mal_id);

      return res;
    }

    async getSequence(id, type){
      if(!id) return;

      const anime = await this.getAnimeFullById(id);

      let next = null;
      for(let relation of anime.data.relations){
          if(relation.relation == type){
              next = relation.entry[0].mal_id;
              break;
          }
      }

      const sequence = next ? await this.getSequence(next, type) : null;
      
      return next ? [anime.data].concat(sequence) : [anime.data];
    }

    async getAnimeById(id){
      return this.consume(`anime/${id}`);
    }

    async getAnimeFullById(id){
      return this.consume(`anime/${id}/full`);
    }

    async getTopAnimes(){
      return this.consume('top/anime');
    }

    async getMostPopular(){
      return this.consume('anime?order_by=popularity&sort=asc');
    }

    async searchAnime(str){
      return this.consume(`anime?q=${str}?sfw`);
    }

    async getUpComingAnimes(){
      return this.consume('seasons/upcoming');
    }

    async getCurrentSeason(page = null){
      const pageUrl = page ? `page=${page}` : '';
      return this.consume('seasons/now?' + pageUrl + '&sfw');
    } 


    async getEpisodes(id){
      const episodes = [];
      let currentPage = 1
      let hasNextPage = false;

      do{
        const page = await this.consume(`anime/${id}/videos/episodes?page=${currentPage}`);
        episodes.push(...page.data);

        currentPage += 1;
        hasNextPage = page.pagination.has_next_page;
      }
      while(hasNextPage);

      return episodes;
    }

    async getRecentEpisodes(){
      return this.consume('watch/episodes');
    }

    async getPopularEpisodes(){
      return this.consume('watch/episodes/popular');
    }

    async getEpisodeById(animeId, epId){
      let currentPage = 1
      let hasNextPage = false;

      do{
        const page = await this.consume(`anime/${animeId}/videos/episodes?page=${currentPage}`);

        currentPage += 1;
        hasNextPage = page.pagination.has_next_page;

        const len = page.data.length;
        for(let i=0; i< len; i++){
          if(page.data[i].mal_id === epId){
            return page.data[i];
          }
        }

      }
      while(hasNextPage);

      return null;
    }

    async getAnimes({search = null, page = null, genres = null, minRate = null, order = null, sort = null, status = null}){
      const queue = [];

      if(search)  { queue.push(`q=${search}`) }
      if(page)    { queue.push(`page=${page}`)  }
      if(genres)  { queue.push(`genres=${genres.join(',')}`) }
      if(minRate) { queue.push(`min_score=${minRate}`)  }
      if(order)   { queue.push(`order_by=${order}`)  }
      if(sort)    { queue.push(`sort=${sort}`) }
      if(status)  { queue.push(`status=${status}`) }

      return this.consume(`anime?${queue.join('&')}&sfw`);
    }

    getGenres(){
      const genres = [{genre: "Shonen", id: 27},        {genre: "Seinen", id: 42},   {genre: "Shoujo", id: 25},       {genre: "School", id: 23}, 
                      {genre: "Isekai", id: 62},        {genre: "Suspence", id: 41}, {genre: "Supernatural", id: 37}, {genre: "Sports", id: 30},
                      {genre: "Slice of life", id: 36}, {genre: "Sci-Fi", id: 24},   {genre: "Romance", id: 22},      {genre: "Mistery", id: 7},
                      {genre: "Horror", id: 14},        {genre: "Fantasy", id: 10},  {genre: "Drama", id: 8},         {genre: "Comedy", id: 4},
                      {genre: "Award winning", id: 46}, {genre: "Adventure", id: 2}, {genre: "Action", id: 1},        {genre: "Mecha", id: 18}];

      return genres;
    }

    getGenreName(genreId){
      const genreList = this.getGenres();
      const filter = genreList.filter( (element) => element.id == genreId);
      const result = filter[0].genre;

      return result;
    }

    getGenreId(genreName){
      const genreList = this.getGenres();
      const filter = genreList.filter( (element) => element.genre == genreName);
      const result = filter[0].id;

      return result;
    }

    getAnimesByGenre(genre){
      return this.consume(`anime?genres=${genre}`);
    }

    getPromos(){
      return this.consume('watch/promos');
    }
}

export default new Jikan();
