import React, {useState, useEffect, useRef } from 'react'; 
import axios from 'axios'; 
import './style/style.scss'; 
import stringSimilarity from 'string-similarity';
import FullscreenType from './components/FullscreenType'
import ShelfBackground from './components/ShelfBackground'
import {getRandomInt, getRandomFloat} from './utils/RandomBetween'
import cover1 from './assets/cover1.jpg'

 

function App() {

  let useApi = true;
  const fakeBooks = [0,1,2,3,4,5]; 
  const suggestedAuthor = "machado de assis";
  const [authorQuery, setAuthorQuery] = useState(suggestedAuthor); 
  const [books, setBooks] = useState([]); 
  const [queryResultsCount, setQueryResultsCount] = useState([]);  
  const [loading, setLoading] = useState(false); 
  const [searching, setSearching] = useState(false);
  const loadTimeout = 3000;

  

  //home, loading, result, nothingFound
  const [screenState, setScreenState] = useState('home');


 
  function loadPage(nextScreen) {
    setLoading(true);  
    setTimeout( () => {
      window.scrollTo(0,0);
      setLoading(false); 
      setScreenState(nextScreen);
    }, loadTimeout );
  }
  

  function handleSubmit(event) {
    event.preventDefault();  
    fetchData( authorQuery );
  }

  function handleSubmitSuggest(event) {
    event.preventDefault();  
    setAuthorQuery(suggestedAuthor);
    fetchData( suggestedAuthor );
  }

  function backHome(event) {
    event.preventDefault(); 
    loadPage('home'); 
  }

  
 async function fetchData(searchTerm)  {
      setLoading(true);
      setSearching(true); 
      console.log(searchTerm); 
      let queryURL = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&projection=lite&filter=free-ebooks&maxResults=10&key=${process.env.REACT_APP_GOOGLE_BOOKS_KEY}`; 
      
      const result = await axios(queryURL).then( (result) => {
          
          let shelfArray = []; 
          console.log(result);
    
          if ( result.data.items ) {
              console.log('has items');
              result.data.items.forEach( (book) =>{
                console.log('foreac aqui');
                
                let author = book.volumeInfo.authors;
                  if ( author !== undefined) {
                      let similarity = stringSimilarity.compareTwoStrings(searchTerm, author[0]);
                      console.log(searchTerm + ' / ' +  author[0]);
                      console.log(author + ' / ' + similarity);
                      if (similarity > 0.3) {
                       
                        console.log(book);
                        shelfArray.push( book ) ; 
                      } 
                  }
              });  
              setBooks( shelfArray ); 
          }
          
          setTimeout( () =>  {  
            setLoading(false); 
            setSearching(false);
            setQueryResultsCount( shelfArray.length );
            if ( shelfArray.length === 0 ) {
              setScreenState('nothingFound')  
            } else {
              setScreenState('result')  
            }
            
          }, loadTimeout)
      });
  }; 

 
 
  
  return (
    <div className={
              `container is-${screenState} 
              ${ loading ? ' is-loading' : '' }`
          } 
          > 
        <ShelfBackground  />
        {
          searching && 
          <div className="loading-message">
            <p> buscando livros de {authorQuery}... </p>
          </div>
        }

        <h1 className="title">
          <FullscreenType  text={'livros livres'}/> 
        </h1>

        <div className="main" >
          <div className="search-container page">
         
            <div className="wrapper search">
              <form onSubmit={ handleSubmit } className="search-wrapper">
                <input 
                  type="text" 
                  value={ authorQuery }
                  placeholder="buscar um autor"
                  onChange={e => setAuthorQuery( e.target.value )}
                  className="search-input__text" />
                  
                  <button className="search-suggest" 
                    onClick={ handleSubmitSuggest }
                  > 
                    hoje recomendamos <span>{suggestedAuthor}</span>, que tal? 
                  </button>

                   <button type="submit" className="search-input__submit"> 
                      <span>buscar livros gratuitos</span>
                  </button>
              </form>
            </div>
            
  
          </div>
  
          <div className="result page">
            <div className="wrapper">
              <h2 className="result__title">
                Nossos resultados para <span> {authorQuery} </span> 
                encontramos { queryResultsCount } { queryResultsCount > 1 ? 'títulos' : 'título'}
              </h2>
              <div className="bookList"> 
             
             {  !useApi &&
                
                  fakeBooks.map( (item, index) => (
                    
                      <a href="#" target="_blank"  rel="noopener noreferrer" 
                          className={`bookList__item 
                          bookList__item--style${ getRandomInt(1,3) }`}
                          key={index}
                          style={{ 
                            //transform:`translateX(${ getRandomFloat(-10,10) }%)`
                          /*  transitionDelay: `${ (6 + index) *0.1 }s` */
                          }}
                      >
                      <span className="bookList__item__img">
                        <img src={cover1} alt=""/>
                      </span>
                      <div className="inner"> 
                          <span className="bookList__item__index"> { index + 1 } </span>
                          <span className="bookList__item__title">  o alienista </span>
                          <div className="bookList__item__info"> 
                           
                          </div>
                      </div>
                     
                      
                      </a>  
                  ))
                
             }
                  
                { books.map( (item, index) => ( 
                      <a href={  item.saleInfo.buyLink } target="_blank"  rel="noopener noreferrer" 
                          className={`bookList__item 
                          bookList__item--style${ getRandomInt(1,3) }`}
                          key={index}
                          style={{ 
                            //transform:`translateX(${ getRandomFloat(-10,10) }%)`
                          /*  transitionDelay: `${ (6 + index) *0.1 }s` */
                          }}
                      > 
                        <span className="bookList__item__img"> 
                          <img src={  item.volumeInfo.imageLinks.thumbnail } alt=""/>
                        </span>
                        <div className="inner">
                          <span className="bookList__item__index"> { index + 1 } </span>
                          <span className="bookList__item__title"> { item.volumeInfo.title } </span>
                          <div className="bookList__item__info"> 
                             disponível no Google Play Books
                          </div>
                        </div>
                    </a> 
                ) ) } 
              </div>
  
              <button className="search-input__submit" onClick={backHome}>
                <span>quero procurar outro autor</span> 
              </button>
  
            </div>
          </div>

          <div className="nothingFound page"> 
                <div className="wrapper">
                  <h2 className="result__title">
                    <span>helás!</span>
                    não encontramos nada de {authorQuery}
                  </h2>
                  <button className="search-input__submit" onClick={backHome}>
                    <span>vou tentar buscar outro</span> 
                  </button>
                </div>
          </div>
          
        </div>

        <div className="secondary">
          <div className="wrapper">
            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt dignissimos maxime, tempore asperiores quibusdam laborum repellendus deserunt tenetur id neque. Deleniti, debitis eum dignissimos, mollitia quisquam, placeat reiciendis blanditiis totam vero a pariatur. Consequuntur assumenda ea error est soluta pariatur.</p>
          </div>
        </div>

        {/* <h1 className="title">livros livres</h1> */}
       
       
        
        
    </div>
  );
}

export default App;
