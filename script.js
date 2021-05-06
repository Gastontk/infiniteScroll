console.log('infinite scroll');


const imageContainer= document.getElementById('image-container')
const loader= document.getElementById('loader')
const searchText = document.getElementById('input')
let searchTerm = ''
// searchText.innerText=searchTerm;
let buttonContainer=document.getElementById('button-container')
let textBoxText =document.getElementById('input')
let button = document.getElementById('button')
let searchFinished = false;

let photosArray =[];


// Setup Unsplash.com API key and setup
const apiAccess='S-3zHLFjI0Y2ScHe1Wr0se37Ts9-yIyjYQkiAlAvX14';
const apiSecret = 'jLiLHs-KTevVYUOh2cQAddsy5-qiVPPJLUU77evmZP4';
const photoCount = 20;
let apiUrl ='';

// Set attributes of elements

function setAttributes(element, attributes){
    for (const key in attributes){
        element.setAttribute(key, attributes[key])
    }
}

// Create elements to display photos and add to DOM
function displayPhotos(){
    photosArray.forEach((photo)=>{
    //     // anchor element to link photo to page
        const item = document.createElement('a');
    //     // item.setAttribute('href', photo.links.html);
    //     // item.setAttribute('target', '_blank');
    //     // create image tag
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        })
        const image= document.createElement('img');
        setAttributes(image,{
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        })

        item.appendChild(image);
        imageContainer.appendChild(item);
        
    })
    photosArray =[];
}

// Get photos from Unsplash.com
async function getPhotosFromUnsplash(searchTerm){
    photosArray=[];
    if(searchFinished){
        try {
 
            const response = await fetch(apiUrl);
            console.log(response, response.status);
            if (response.status == 403){
                console.log('too many requests this hour. Please try again later.')
                const warn = document.createElement('h1');
                warn.innerText = 'No photos available now. Please reload page again later!';
                // warn.style.color ='red';
                warn.setAttribute('id', 'error');
                // warn.setAttribute('value', 'testing');
                // warn.setAttribute('width', '100%');
                imageContainer.appendChild(warn)
                
    
            }else{
                        photosArray= await response.json();
             console.log('data from unsplash ', photosArray);
             displayPhotos();
             
            }
    
    
            
        } catch(err){
    
                console.log('error getting json for photos ', err)
    
    
        }
    }
    

}

// async function debounce(func, interval) {
//     var lastCall = -1;
//     return function() {
//         console.log('in debounce');
//         clearTimeout(lastCall);
//         var args = arguments;
//         var self = this;
//         lastCall = setTimeout(function() {
//             func.apply(self, args);
//         }, interval);
//     };
// }


// Check if scroll is near end of page. If so add more photos

let count =0
window.addEventListener('scroll', async ()=>{
    console.log('count for triggering getPhotosFromUnsplash', count)
   
   
    console.log('scroll', (window.innerHeight+ window.scrollY), (document.body.offsetHeight));
    if(window.innerHeight + window.scrollY >= (document.body.offsetHeight - 500) && count == 0){
        count++
        console.log('triggered get new photos')
        // await getPhotosFromUnsplash();
        //  let x = await debounce(getPhotosFromUnsplash, 1000);
        //   x();
        getPhotosFromUnsplash()

        setTimeout(()=>{
            count =0;
        },500)
        
    }


})
// Button initiates picture download
button.addEventListener('click',()=>{
    button.hidden ='true';
    buttonContainer.hidden = true;
    searchText.hidden=true;
    searchFinished=true;
    apiUrl=`https://api.unsplash.com/photos/random/?query=${searchTerm}&client_id=${apiAccess}&count=${photoCount}`
    getPhotosFromUnsplash()
    

})
textBoxText.addEventListener('keyup',()=>{
    console.log('searchText', textBoxText.value);
    searchTerm = textBoxText.value;
})



// getPhotosFromUnsplash()


