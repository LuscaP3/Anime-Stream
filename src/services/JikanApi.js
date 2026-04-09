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
      //await utils.sleep(this.#rateLimit);

      return new Promise((resolve, reject) => {
        this.#queue.push({ url, resolve, reject });
        this.#processQueue();
      });
    }
    
    async getRelations(id){
      const relations = await this.consume(`anime/${id}/relations`);

      let temp = relations.data.filter( (element) => element.relation != 'Sequel' && element.relation != 'Prequel' ); // Remove Sequels e Prequels.
      const temp2 = temp.map( (element) => element.entry).flat();           // Junta os arrays.
      const temp3 = temp2.filter( (element) => element.type == 'anime');   // Pega somente anime (sem mangá).

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

    async getEpisodeById(animeId, epsId){
      let episodesId = epsId
      if(!Array.isArray(epsId)){
        episodesId = [epsId];
      }
      const episodes = await this.getEpisodes(animeId);

      let filter = [];
      for(let id of episodesId){
        filter = filter.concat(episodes.filter( (element) =>  element.mal_id == id ));
      }
      
      return filter;
    }
}

export default new Jikan();
