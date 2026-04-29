export function strFormat(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getVideoId(url){
  const match = url.match(/embed\/([^?]+)/);

  const videoId = match ? match[1] : null;

  return videoId;
}
