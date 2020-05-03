const mainUrl = "http://localhost:5000";

const mainHeader = document.querySelector("#main");
const addDataForm = document.querySelector("#add-data-form");

const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');

const header = document.querySelector("#Header");
const chatStart = document.querySelector("#chatStart");
const sitecontainer = document.querySelector("#siteContainer")

const modalList = document.querySelector("#modalList")
let divNumber = 1
let called = 0

let productlat1 = 0.0
let productlon1 = 0.0

let lat1 = 0.0
let lon1 = 0.0
let unit = "K"

const createProductDivs = (products, filter) => {
  
  products.forEach((element) => {

    if(filter == true){
      elementLoc = element.location;
      locationArr = elementLoc.split(',')
      productlat1 = parseFloat(locationArr[0])
      productlon1 = parseFloat(locationArr[1])
      
      console.log("product location: "+productlat1 +", "+ productlon1)

      getUserLocation();
      setTimeout(function(){ console.log("waiting")}, 500);
      console.log("My location: "+lat1 +", "+ lon1)
      console.log(distance(lat1, lon1, productlat1, productlon1, unit))
      

      //let userlat2 = uCoordinates[0]
      //let userlon2 = uCoordinates[1]

      //console.log(userlat2, userlon2)
    }
    
    console.log(element.urls[0].url);
    //saleBoard div
    const div = document.createElement("div");
    div.className = "saleBoard";
    div.id = "saleBoard"+ divNumber;
    //product name header
    const name = document.createElement("h2");
    const desc = document.createTextNode(element.name);
    

    //price
    const price = document.createElement("h2");
    const amount = document.createTextNode("Price: " + element.price + "€");
    
    const button1 = document.createElement('button');
    button1.id = "minusSlide";
    const filling = document.createTextNode('<');

    const button2 = document.createElement('button');
    button2.id = "plusSlide";
    const filling2 = document.createTextNode('>')
    
    button1.addEventListener('click', function(){
      id = div.id
      if(called === 0){
        slideSetup(id)
        called++
      }
      plusDivs(-1, id);
    });
//
    button2.addEventListener('click', function(){
      id = div.id
      if(called === 0){
        slideSetup(id)
        called++
      }
      plusDivs(1, id)
    });
    divNumber++
    
    //

    for (let i = 0; i < element.urls.length; i++) {
      //element.urls[i].url
      let image = document.createElement("img");
      image.className = "slideImage";
      image.alt = "picture";
      image.src = mainUrl + "/" + element.urls[i].url;
      if(i >= 1){
        image.style.display = "none"
      }else{
        image.style.display = "block"
      }
      image.addEventListener('click', () => {
        imageModal.classList.remove('hide');
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        sitecontainer.style.display = "none"
        header.style.display = "none"
        chatStart.style.display = "block"
        
        
        const list0 = document.querySelector("#li0")
        list0.textContent = "Product: "+element.name
        
        
        const list1 = document.querySelector("#li1")
        list1.textContent = "Product: "+element.price

        const list2 = document.querySelector("#li2")
        list2.textContent = "Product: "+element.price_flex

        const list3 = document.querySelector("#li3")
        list3.textContent = "Product: "+element.description

        const list4 = document.querySelector("#li4")
        list4.textContent = "Product: "+element.location
        
        modalList.appendChild(list0, list1, list2, list3, list4)
        
        
      });

      div.appendChild(image);
    }
    name.appendChild(desc);
    price.appendChild(amount);
    div.appendChild(name);
    div.appendChild(price);
    button1.appendChild(filling);
    div.appendChild(button1)
    button2.appendChild(filling2)
    div.appendChild(button2)

    mainHeader.appendChild(div);

  });
 
};

//getproducts fetches data once called then creates divs that are needed with createProductDivs function
const getProducts = async (filter) => {
  try {
    const response = await fetch(mainUrl + "/data");
    const products = await response.json();
    createProductDivs(products, filter);
  } catch (e) {
    console.log("error " + e.message);
  }
};
let filter = false;
getProducts(filter);

//////////////////////////////
//user location and product filter
//////////////////////////////
const filterButton = document.querySelector("#filter")

filterButton.addEventListener('click', function(){
  mainHeader.innerHTML = "";
  divNumber = 1;
  filter = true;
  getProducts(filter)
});

//function getUserLocation(){
const getUserLocation = async () =>{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(displayPosition)
  }else{
    alert("location is not supported in this browser")
  }
}

function displayPosition(position) {
  lat1 = position.coords.latitude
  lon1 = position.coords.longitude

  console.log("my position "+lat1 +", "+lon1)
  //console.log(lat1 +", " + lon1);
  //let unit = "K"
  //distance(lat1, lon1, lat2, lon2, unit)
}
function distance(lat1, lon1, lat2, lon2, unit){
  if ((lat1 == lat2) && (lon1 == lon2)) {
		console.log("same coordinates")
	}else{
    var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
  }
}

//////////////////////////////
//End close inspect
//////////////////////////////
const close = document.querySelector(".close")
close.addEventListener('click', (evt)=>{
  evt.preventDefault();
  imageModal.classList.add('hide');
  header.style.display = "block"
  sitecontainer.style.display = "flex"
  chatStart.style.display = "none"

  
  
});

var slideIndex = 0;

//setups image slides
function slideSetup(id){
  console.log("called slideSetup")
  slideIndex = 1;
showDivs(slideIndex, id);
}

//function which is called when slidebutton pressed
function plusDivs(n, id) {
  console.log("called plusDivs")
  showDivs(slideIndex += n, id);
}

//slide image function
function showDivs(n, id) {
  var i;
  console.log(id)
  console.log("called showDivs")
  var x = document.querySelector("#"+id).querySelectorAll('img');
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length} ;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}
