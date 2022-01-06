// fixed menu button
$(window).scroll(function () {
    if ($(document).scrollTop() > 20) {
      $(".navigation").addClass("fix-icon");
    } else {
      $(".navigation").removeClass("fix-icon");
    }
  });
  // progress bar
  let scrollPercentage = () => {
    let scrollProgress = document.getElementById("progress");
    let progressValue = document.getElementById("progress-value");
    let pos = document.documentElement.scrollTop;
    let calcHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);
    scrollProgress.style.background = `conic-gradient(#e70634 ${scrollValue}%, #2b2f38 ${scrollValue}%)`;
  };
  window.onscroll = scrollPercentage;
  window.onload = scrollPercentage;

// var
  const main = document.getElementById('watchmain');
  const favPage = document.getElementById('fav')
  const watchPage = document.getElementById('later')
  // API links
const API_KEY = "api_key=bd95210b0fc359499095f827f48634cf";
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

console.log(localStorage)
let mylist = JSON.parse(localStorage.later);
console.log(mylist);
if (mylist!=null){

    main.innerHTML = '';
    for(let i=0; i< mylist.length; i++){
       
        axios.get(`https://api.themoviedb.org/3/movie/${mylist[i]}?api_key=bd95210b0fc359499095f827f48634cf`).then(
            (response) => {
                const movieEl = document.createElement('div');
                movieEl.classList.add('movie');
               movieEl.innerHTML= `<img src="https://image.tmdb.org/t/p/w500/${response.data.poster_path}" alt="${response.data.title}">
  
                <div class="movie-info">
                    <h3>${response.data.title}</h3>
                    <span class="${getColor(response.data.vote_average)}">${response.data.vote_average}</span>
                </div>
      
                <div class="overview">
      
                    <h3>Overview</h3>
                    <p class="fifty-chars">${response.data.overview}</p>
                    <br/> 
                    <button class="know-more" id="${response.data.id}">Know More</button>
                  
      
                </div>
            ` 
            main.appendChild(movieEl);
            document.getElementById(response.data.id).addEventListener('click', () => {
                //console.log(id)
                openNav(response.data)
        }
     
            )}
       
        )}
    }

  
  // the movie trailer functions
  const overlayContent = document.getElementById('overlay-content');
  /* Open when someone clicks on the span element */
  function openNav(movie) {
    let id = movie.id;
    axios.get(BASE_URL + '/movie/'+id+'/videos?'+API_KEY).then(function(response){
      
      if(response.data.results){
        document.getElementById("myNav").style.width = "100%";
        if(response.data.results.length > 0){
          var embed = [];
          var dots = [];
          response.data.results.forEach((video, idx) => {
            let {name, key, site} = video
  
            if(site == 'YouTube'){
                
              embed.push(`
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}"
                 class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media;
                  gyroscope; picture-in-picture" allowfullscreen></iframe>
            
            `)
  
              dots.push(`
                <span class="dot">${idx + 1}</span>
              `)
            }
          })
          
          var content = `
          <h1 class="no-results">${movie.original_title}</h1>
          <br/>
          <p>${movie.overview}</p>
          <br>
          ${embed.join('')}
          <br/>
          <div class="dots">${dots.join('')}</div>
          <br>
          <button class="links"><i class="far fa-heart" id="favorite" ></i></button>
          <button class="links"><i class="far fa-clock" id="watchLater" ></i></button>
          <button class="links"><i class="far fa-trash-alt" id="remove"></i></button>
          `
          overlayContent.innerHTML = content;
          activeSlide=0;
          showVideos();
        }else{
          overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }
  
        document.querySelector("#favorite").addEventListener('click', () => {
          console.log(id);
          console.log(movie);
          if(!favMovie.includes(id)){
            favMovie.push(id);
            localStorage.setItem('myfav', JSON.stringify(favMovie));
            console.log(localStorage);
  
          }
          console.log(favMovie);
         
        })
        document.querySelector("#watchLater").addEventListener('click', () => {
          console.log(id);
          console.log(movie);
          if(!watch.includes(id)){
            watch.push(id);
            localStorage.setItem('later', JSON.stringify(watch));
            
          }
          console.log(watch);
        })
        document.querySelector("#remove").addEventListener('click', () => {
            removeFromwatch(id);
           })
         }
       })
     }
   
     function removeFromwatch(id) {
      mylist= localStorage.getItem("later");
       mylist= JSON.parse(mylist);
       const movieID = mylist.indexOf(id); 
       mylist.splice(movieID,  1);
       localStorage.setItem("later", JSON.stringify(mylist));
       location.reload();
       
   }

  
/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }
  var activeSlide = 0;
  var totalVideos = 0;
  
  function showVideos(){
    let embedClasses = document.querySelectorAll('.embed');
    let dots = document.querySelectorAll('.dot');
  
    totalVideos = embedClasses.length; 
    embedClasses.forEach((embedTag, idx) => {
      if(activeSlide == idx){
        embedTag.classList.add('show')
        embedTag.classList.remove('hide')
  
      }else{
        embedTag.classList.add('hide');
        embedTag.classList.remove('show')
      }
    })
  
    dots.forEach((dot, indx) => {
      if(activeSlide == indx){
        dot.classList.add('active');
      }else{
        dot.classList.remove('active')
      }
    })
  }
  
  const leftArrow = document.getElementById('left-arrow')
  const rightArrow = document.getElementById('right-arrow')
  
  leftArrow.addEventListener('click', () => {
    if(activeSlide > 0){
      activeSlide--;
    }else{
      activeSlide = totalVideos -1;
    }
  
    showVideos()
  })
  
  rightArrow.addEventListener('click', () => {
    if(activeSlide < (totalVideos -1)){
      activeSlide++;
    }else{
      activeSlide = 0;
    }
    showVideos()
  })
  
  // for the rating
  function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
  }
  