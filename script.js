console.log('infinite scroll');

const title= document.getElementById('title')

const imageContainer= document.getElementById('image-container')
const loader= document.getElementById('loader')
const searchText = document.getElementById('input')
let searchTerm = ''
// searchText.innerText=searchTerm;
let buttonContainer=document.getElementById('button-container')
let textBoxText =document.getElementById('input')
let button = document.getElementById('button')
let searchFinished = false;
let photoCount  =5;
let photosArray =[];


// Setup Unsplash.com API key and setup
const apiAccess='S-3zHLFjI0Y2ScHe1Wr0se37Ts9-yIyjYQkiAlAvX14';
const apiSecret = 'jLiLHs-KTevVYUOh2cQAddsy5-qiVPPJLUU77evmZP4';
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
    title.classList.remove('blur')
    imageContainer.classList.remove('blur')
    loader.hidden =true;
    photosArray =[];
}

// Get photos from Unsplash.com
async function getPhotosFromUnsplash(searchTerm){
    loader.hidden =false
    title.classList.add('blur')
    imageContainer.classList.add('blur')
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

                
    
            } else if(response.status == 404){
                // change title to reflect no photo found
                title.textContent =`No photos found matching the description \"${searchTerm}\"` 
            }
            else{
                        photosArray= await response.json();
             console.log('data from unsplash ', photosArray);
             displayPhotos();

             
            }
    
    
            
        } catch(err){
                console.log('error getting json for photos ', err)
    
    
        }

    }
        loader.hidden =true;
        title.classList.remove('blur')
        imageContainer.classList.remove('blur')
        photoCount =10;

}



// Check if scroll is near end of page. If so add more photos

let count =0
window.addEventListener('scroll', async ()=>{
    console.log('count for triggering getPhotosFromUnsplash', count)
   
   
    console.log('scroll window.innerheight: ', window.innerHeight, 'window.scrollY ',window.scrollY, 'document.body.offsetHeight:',document.body.offsetHeight, 'document.body.offsetHeight: ',document.body.offsetHeight, 'image-container height:', imageContainer.scrollHeight);
    if((window.innerHeight + window.scrollY) >= (imageContainer.scrollHeight) - 1000 && count == 0){
        
        count++
        console.log('triggered get new photos')
        loader.hidden =false;
        title.classList.add('blur')
        imageContainer.classList.add('blur')
        await getPhotosFromUnsplash()

        setTimeout(()=>{
            count =0;
        },1000)
        
    }


})
// Button initiates picture download
button.addEventListener('click',()=>{
    button.hidden ='true';
    buttonContainer.hidden = true;
    searchText.hidden=true;
    searchFinished=true;
    title.innerText=` ${searchTerm}`;
    apiUrl=`https://api.unsplash.com/photos/random/?query=${searchTerm}&client_id=${apiAccess}&count=${photoCount}`
    

    getPhotosFromUnsplash(searchTerm)
    

})
textBoxText.addEventListener('keyup',()=>{
    console.log('searchText', textBoxText.value);
    searchTerm = textBoxText.value;
})

async function checkIP(){
    fetch('https://ipapi.co/json/')
            .then(data=>{
       return data.json()})
       .then(res=>{
            let now = Date.now();
            let timeDate = new Date(now);
            res.timeDate=timeDate;
            res.app ='infinite-Scroll'

             sendIpToFirebase(res)

           
       });
}

function sendIpToFirebase(res){
    var firebaseConfig = {
        apiKey: "AIzaSyB61iGOSYQlOCo1rGU0qjc9mYNT9SqNEsM",
        authDomain: "store-ips.firebaseapp.com",
        projectId: "store-ips",
        storageBucket: "store-ips.appspot.com",
        messagingSenderId: "902404946025",
        appId: "1:902404946025:web:ee9e588996640f15614af8"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    let db =firebase.firestore()
    db.collection("ips").add({
        ...res
    }).then((docRef)=>{
        // unnimportant. If it fails, it's not important to the function of the app.
    })
    .catch((error =>{
        console.log('error adding doc',error);
    }))
}
checkIP()
// getPhotosFromUnsplash()


