import * as utils from './utils'

import axios from "axios";
import rateLimit from "axios-rate-limit";

class Jikan {
    #BaseUrl = 'https://api.jikan.moe/v4';
    #http

    constructor() {
        this.#http = rateLimit(axios.create(), {
          maxRequests: 3,
          perMilliseconds: 1000
      })
    }

    async consume(url){
      const res = await this.#http.get(`${this.#BaseUrl}/${url}`);

      return res.data;
    }


    async getSeasons(id){
      const prequel = await this.#getSequence(id, 'Prequel');
      const sequel = await this.#getSequence(id, 'Sequel');
    
      const seasons = [... new Set(prequel.concat(sequel))];
      seasons.sort()
    
      return seasons;
    }
    
    async #getSequence(id, type){
      if(!id) return;
    
      let nextId;
      const dataArray = await this.consume(`anime/${id}/relations?sfw`);
      const len = dataArray.data.length;
    
      for(let i=0; i<len; i++){
        const data = dataArray.data[i];
    
        if(data.relation == type){
          nextId = data.entry[0].mal_id;
          console.log(nextId)
    
          break;
        }
      }
      
      const next = await this.#getSequence(nextId, type);
    
      return (next ? [id].concat(next) : [id]);
    }
    
    async getRelations(id){
      const relations = await this.consume(`anime/${id}/relations`);

      let temp = relations.data.filter( (element) => element.relation != 'Sequel' && element.relation != 'Prequel' ); // Remove Sequels e Prequels.
      const temp2 = temp.map( (element) => element.entry).flat(); // Junta os arrays.
      const temp3 = temp2.filter( (element) => element.type == 'anime'); // Pega somente anime (sem mangá).

      const ids = temp3.map(obj => obj.mal_id);

      return ids;
      
    }

    async getAnimeById(id){
      return this.consume(`anime/${id}`);
    }

    async getTopAnimes(){
      return this.consume('top/anime');
    }

    async getMostPopular(){
      return this.consume('anime?order_by=popularity&sort=asc');
    }
}


export default new Jikan();
