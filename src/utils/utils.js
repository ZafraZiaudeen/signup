import ReactGA from "react-ga4";
const trackingId = "G-3QHV5V4XDL";
ReactGA.initialize(trackingId);

export const createGAEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  }); 
};

export const getFromLocalStorage = arr => new Promise(resolve => {
  //turn arr into array if it's not
  if (!Array.isArray(arr)) arr = [arr];

  // eslint-disable-next-line no-undef
  if (!chrome?.storage) {
      const res = {}
      arr.forEach(key => {
          res[key] = localStorage.getItem(key);
      });
      return resolve(res);
  }

  // eslint-disable-next-line no-undef
  chrome?.storage?.local?.get(arr, res => resolve(res));
})

export const saveToLocalStorage = obj => new Promise(resolve => {
  // eslint-disable-next-line no-undef
  if (!chrome?.storage) {
      Object.keys(obj).forEach(key => localStorage.setItem(key, JSON.stringify(obj[key])));
      return resolve(true);
  }

  // eslint-disable-next-line no-undef
  chrome?.storage?.local?.set(obj, res => resolve(true));
})

export const getBingImage = () => {

  return new Promise(async resolve => {
    const storageRes = await getFromLocalStorage("bingImage");
    const today = new Date().toISOString().split('T')[0];
    const bingImage = storageRes?.bingImage;
    if (bingImage?.date === today) return resolve(bingImage?.imageData);

    fetch('https://bing.biturl.top/').then(res => res.json()).then(data => {
      const selectedImage = data.url
      saveToLocalStorage({ bingImage: { date: today, imageData: selectedImage } });
      resolve(selectedImage);

    });
  })
}