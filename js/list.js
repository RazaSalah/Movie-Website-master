// API links
const API_KEY = "api_key=bd95210b0fc359499095f827f48634cf";
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const genres = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
]
const favMovie =[];
const watch =[];
// var
const main = document.getElementById('main');
const form =  document.getElementById('searchForm');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')
const favPage = document.getElementById('fav')
const watchPage = document.getElementById('later')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;



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


// get the saved movie from local storage
function getFav(){
    // Retrieve the array from local storage
    var array = localStorage.getItem('myfav');
  // Parse it to something usable in js
    array = JSON.parse(array);
    if(!array.length == 0){
      showFavmovie(array);
    }else {
      array =[];
    }
  }
  
  function showFavmovie(array){
    
   main.innerHTML =``;
    array.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
  
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
  
            <div class="overview">
                <h3>Overview</h3>
                <p class="fifty-chars">${overview}</p>
                <br/> 
                <button class="know-more" id="${id}">Know More</button>
            </div>
        `
  
      main.appendChild(movieEl);
  
        document.getElementById(id).addEventListener('click', () => {
          console.log(id)
          openNav(movie)
        })
      
  
    })
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
        <button class="links"><i class="far fa-heart" id="fav"></i></button>
        <button class="links"><i class="far fa-clock" id="watch"></i></button>
        `
        overlayContent.innerHTML = content;
        activeSlide=0;
        showVideos();
      }else{
        overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
      }

      document.querySelector("#fav").addEventListener('click', () => {
        console.log(id);
        console.log(movie);
        if(!favMovie.includes(movie)){
          favMovie.push(movie);
          localStorage.setItem('myfav', JSON.stringify(favMovie));


        }
        console.log(favMovie);
       
      })
      document.querySelector("#watch").addEventListener('click', () => {
        console.log(id);
        console.log(movie);
        if(!watch.includes(movie)){
          watch.push(movie);
          localStorage.setItem('later', JSON.stringify(watch));
          
        }
        console.log(watch);
      })
    }
  })
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
  