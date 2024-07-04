import ReactGA from "react-ga4";
import image1 from "../images/bgImages/1.jpg";
import image2 from "../images/bgImages/2.jpg";
import image3 from "../images/bgImages/3.jpg";
import image4 from "../images/bgImages/4.jpg";
import image5 from "../images/bgImages/5.jpg";
import image6 from "../images/bgImages/6.jpg";
import image7 from "../images/bgImages/7.jpg";
import image8 from "../images/bgImages/8.jpg";
import image9 from "../images/bgImages/9.jpg";
import image10 from "../images/bgImages/10.jpg";
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

export const getImageForToday = () => {
  const images = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
  ];
  const today = new Date();
  const dayOfMonth = today.getDate();
  const imageIndex = (dayOfMonth - 1) % images.length;
  const imageForToday = images[imageIndex];
  return imageForToday;
}

