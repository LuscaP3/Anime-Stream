import * as utils from './utils.js'

const BASE_URL = 'https://api.jikan.moe/v4';

export async function getTopAnimes() {
  const res = await fetch(`${BASE_URL}/top/anime`);
  const json = await res.json();
  return json.data;
}

export async function searchAnime(query) {
  const res = await fetch(`${BASE_URL}/anime?q=${query}?sfw`);
  const json = await res.json();
  return json.data;
}

export async function getAnimeById(id) {
  const res = await fetch(`${BASE_URL}/anime/${id}`);
  const json = await res.json();
  return json.data;
}

export async function getRelations(id){
  if(!id) return;

  const res = await fetch(`${BASE_URL}/anime/${id}/relations?sfw`);
  const json = await res.json();

  const ids = [];

  json.data.map( (entries) => {
      if(!(entries.relation == 'Sequel' && entries.relation == 'Prequel')){
        entries.entry.map( (relation) => {
        ids.push(relation.mal_id);
        });
      }
  })

  console.log(ids);

  return ids;
}

export async function getSeasons(id){
  const prequel = await getPrequel(id);
  const sequel = await getSequel(id);

  const seasons = [... new Set(prequel.concat(sequel))];
  seasons.sort()

  return seasons;
}

export async function getSequel(id){
  if(!id) return;

  let nextId;

  const res = await fetch(`${BASE_URL}/anime/${id}/relations?sfw`);
  const json = await res.json();

  const len = json.data.length;

  for(let i=0; i<len; i++){
    const data = json.data[i];

    if(data.relation == 'Sequel'){
      nextId = data.entry[0].mal_id;

      break;
    }
  }
  
  const next = await getSequel(nextId);

  return (next ? [id].concat(next) : [id]);
}

export async function getPrequel(id){
  if(!id) return;

  let nextId;

  const res = await fetch(`${BASE_URL}/anime/${id}/relations?sfw`);
  const json = await res.json();

  const len = json.data.length;

  for(let i=0; i<len; i++){
    const data = json.data[i];

    if(data.relation == 'Prequel'){
      nextId = data.entry[0].mal_id;

      break;
    }
  }  

  const next = await getPrequel(nextId);

  return (next ? [id].concat(next) : [id]);
}

export async function getRandomAnime(){
  const res = await fetch(`${BASE_URL}/random/anime?sfw`);
  const json = await res.json();
  return json.data;
}