import React, {useEffect, useState, useRef} from 'react';



const FullscreenType = (props) => {
    var root = document.documentElement;
   

    const [typeScale, setTypeScale] = useState(1);
    const [typeHeight, setTypeHeight] = useState('');



    const coverTitle = useRef(null);

    useEffect(() => {
       

        function fullScreenType() { 
            setTypeScale( 1 );
            let coverTitleW = coverTitle.current.getBoundingClientRect().width;
            let coverTitleH = coverTitle.current.getBoundingClientRect().height;
            let coverTitleWidthRatio = window.innerWidth / parseInt(coverTitleW);  
            setTypeScale( coverTitleWidthRatio ); 
            setTypeHeight(  coverTitleH  * coverTitleWidthRatio  );   
            root.style.setProperty('--title-height', (coverTitleH  * coverTitleWidthRatio)+'px');
        } 

        fullScreenType(); 

        window.addEventListener('resize', fullScreenType)
        return _ => {
            window.removeEventListener('resize', fullScreenType)
        }
    }, []);
    
    
    
    return(
        <div style={{ height: `${typeHeight}px` , display: 'block', textAlign: 'center' }} className="coverTitle">
            <span 
                ref={coverTitle} 
                style={{transform: `scale(${typeScale})` , display: 'inline-block', transformOrigin: 'top' }}
                className="FullscreenType-sizer" >
                {props.text}
            </span> 
        </div>
    )
}


export default FullscreenType;

