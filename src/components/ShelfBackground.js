import React, {useState, useEffect, useCallback} from 'react'; 
import {getRandomInt} from '../utils/RandomBetween'

const ShelfBackground = () => {

    const [shelfDone, setShelfDone] = useState(false);

    const vw = window.innerWidth;
    const vh = window.innerHeight; 


    const [shelfState, setShelfState] = useState({
        width: 0,
        bookCount: 0, 
        minBookWidth: vw/60,
        maxBookWidth: vw/20,
        minBookHeight: vh/1.2,
        maxBookHeight: vh/2,
        books: []
    });

    let shelf = {
      width: 0,
      bookCount: 0, 
      minBookWidth: vw/30,
      maxBookWidth: vw/10,
      minBookHeight: vh/1.2,
      maxBookHeight: vh/2,
      books: []
    }
    
    function addBookToShelf() {
        let bookWidth = getRandomInt( shelf.minBookWidth , shelf.maxBookWidth )
        let bookHeight = getRandomInt( shelf.minBookHeight , shelf.maxBookHeight )
   
        

        shelf.books.push( { width: bookWidth, height: bookHeight, delay: getRandomInt(0,4)  } ); 
    
        setShelfState( shelf );
    
        shelf.width += bookWidth;
    
        if ( shelf.width < vw ) {
          addBookToShelf();
        } else {
          //console.log( 'shelf width: ' + shelf.width + '/' + vw ); 
          setShelfDone(true);
        }
    }
    
    useEffect( ()  => {
        addBookToShelf();   
    }, []) ; 

    useEffect( ()  => {
      if (shelfDone) {
       /*  var shelfReady = document.querySelector(".shelfBackground");
        var shelfReadyClone =shelfReady.cloneNode(true);
        shelfReadyClone.classList.add('clone');
        document.body.querySelector('.container').appendChild(shelfReadyClone); */
      }
        
    }, [shelfDone]) ; 

    return(
      <div>
        <div className="shelfBackground is-original"> 
           {shelfState.books.map( (item, i) => ( 
            <span
              className="book-outter"
              key={i}
              style={{ 
                width:`${ item.width }px`, 
                height:`${ item.height }px`
              }}
            > 
              <span  
              className="book-inner"></span>
            </span>
          ))}  
        </div>
  
        <div className="shelfBackground is-clone"> 
           {shelfState.books.map( (item, i) => ( 
            <span
              className="book-outter"
              key={i}
              style={{ 
                width:`${ item.width }px`, 
                height:`${ item.height }px`,
                transitionDelay: `.${ item.delay }s `
              }}
            > 
              <span 
              className="book-inner"
              style={{  
                transitionDelay: `1.${ item.delay }s , 0s ` 
              }}
              ></span>
            </span>
          ))}  
        </div>
      </div>

    )
}

export default ShelfBackground;