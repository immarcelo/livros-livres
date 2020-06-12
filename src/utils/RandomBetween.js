/* export default function getRandomFloat(min, max) {
   
} */
export const getRandomInt = (min, max) => {
    return Math.ceil(Math.floor(Math.random() * (max - min + 1)) + min);
}

export const getRandomFloat = (min, max) => {
    return  (Math.random() * (max - min + 1) + min).toFixed(2);
}

 