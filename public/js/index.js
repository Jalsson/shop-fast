//const mainUrl = window.location.protocol+"//"+window.location.hostname+":5000/";
const mainUrl = ""
console.log(mainUrl)
const mainHeader = document.querySelector("#main");
const addDataForm = document.querySelector("#add-data-form");

const socket = io('https://'+window.location.hostname, {
  path: '/app/socket.io/'
});


const imageModal = document.querySelector('#image-modal'); //div which displays image bigger
const modalImage = document.querySelector('#image-modal img'); 
const modalDiv = document.querySelector('#modalDiv');

const header = document.querySelector("#Header");
const chatStart = document.querySelector("#chatStart"); //displays information about product
const sitecontainer = document.querySelector("#siteContainer"); 

const modalList = document.querySelector("#modalList"); //list inside chatStart

const insertedLocation = document.querySelector("#location"); //input form (location)
const locationButton = document.querySelector("#locationInsert")

const sendMessageBtn = document.querySelector("#sendMessage");
const textArea = document.querySelector("#textArea");

let divNumber = 1;
let called = 0;

let productlat1 = 0.0;
let productlon1 = 0.0;
let lat1 = 0.0;
let lon1 = 0.0;

let unit = "K";
let userDistance = 0.0
let filterDistance = 0.0

let productOwnerId = 0

//Creates div for every product 
const createProductDivs = (products, filter) => {
  
  products.forEach((element) => {

      elementLoc = element.location;
      locationArr = elementLoc.split(',')
      productlat1 = parseFloat(locationArr[0])
      productlon1 = parseFloat(locationArr[1])
      
      userDistance = distance(lat1, lon1, productlat1, productlon1, unit)
    if(filter == true && userDistance > filterDistance){
      return
    }
   
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

    const productDistance = document.createElement("h2")
    if(userDistance === undefined){
      userDistance = 0;
    }
    //distance
    const dist = document.createTextNode(Math.round(userDistance)+"km")
    productDistance.appendChild(dist);
    
    //image slide buttons 
    const button1 = document.createElement('button');
    button1.id = "minusSlide";
    const filling = document.createTextNode('<');

    const button2 = document.createElement('button');
    button2.id = "plusSlide";
    const filling2 = document.createTextNode('>')
    
    //listeners for slide buttons
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
    
    
    //iterates every image from a object and makes them hidden or visible
    for (let i = 0; i < element.urls.length; i++) {
      let image = document.createElement("img");
      image.className = "slideImage";
      image.alt = "picture";
      image.src = mainUrl + "" + element.urls[i].url;
      //first image visible at first others hidden
      if(i >= 1){
        image.style.display = "none"
      }else{
        image.style.display = "block"
      }
      //event listener for every img which hides and makes divs visible
      //inputs the right data for every image
      image.addEventListener('click', () => {
        imageModal.classList.remove('hide');
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        sitecontainer.style.display = "none"
        header.style.display = "none"
        chatStart.style.display = "block"
        productOwnerId = element.owner_id
        document.querySelector("#top-navigation").style.display = "none"
        
        console.log("id of owner: "+productOwnerId)

        //product name
        const pName = document.querySelector("#productName")
        pName.textContent = element.name
        
        //list for products (price, price_flex, desc)
        const list1 = document.querySelector("#li1")
        list1.textContent = "Product price: "+element.price+"€"

        const list2 = document.querySelector("#li2")
        list2.textContent = "Price is "+element.price_flex

        const list3 = document.querySelector("#li3")
        list3.textContent = element.description
        
      });
      
      div.appendChild(image);
     
    }
    name.appendChild(desc);
    price.appendChild(amount);
    div.appendChild(name);
    div.appendChild(price);
    if(filter == true){
    div.appendChild(productDistance);
    }
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
    const response = await fetch(mainUrl + "data");
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
const distSlider = document.querySelector(".slider");
let filterValue = document.getElementById("distance")
distSlider.addEventListener("change", getSliderValue)

function getSliderValue(){
  filterDistance = distSlider.value;
  filterValue.textContent = filterDistance+"km"
}

const filterButton = document.querySelector("#filter")

filterButton.addEventListener('click', async function(){
  mainHeader.innerHTML = "";
  divNumber = 1;
  filter = true;
  getProducts(filter)
});

//////////////////////////////
// user location
//////////////////////////////
const getUserLocation = async () =>{
  if(navigator.geolocation){
    await navigator.geolocation.getCurrentPosition(displayPosition)
  }else{
    alert("location is not supported in this browser")
  }
}

//////////////////////////////
//stores user location to variables
//////////////////////////////
function displayPosition(position) {
  lat1 = position.coords.latitude
  lon1 = position.coords.longitude
  console.log("My location is: "+lat1 +", " + lon1);
}
//user location stored once page loaded
getUserLocation();

//////////////////////////////
//calculates distance between coordinates
//////////////////////////////
function distance(lat1, lon1, lat2, lon2, unit){
  if ((lat1 == lat2) && (lon1 == lon2)) {
	}else{
    var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    console.log("distance: "+dist)
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
//inserting user location inside form
//////////////////////////////
locationButton.addEventListener("click", insertLocation)

function insertLocation(){
    insertedLocation.value = lat1+", "+lon1
}
const saveButton = document.querySelector("#saveButton")
saveButton.addEventListener("click", insertLocation)


//////////////////////////////
//End image inspection
//////////////////////////////
const close = document.querySelector(".close")
close.addEventListener('click', closeInspect);

function closeInspect(){
  imageModal.classList.add('hide');
  header.style.display = "block"
  sitecontainer.style.display = "flex"
  chatStart.style.display = "none"
  document.querySelector("#top-navigation").style.display = "flex"
}

var slideIndex = 0;
//////////////////////////////
//slide image
//////////////////////////////

//setups image slides
function slideSetup(id){
  slideIndex = 1;
showDivs(slideIndex, id);
}

//function which is called when slidebutton pressed
function plusDivs(n, id) {
  showDivs(slideIndex += n, id);
}

//slide image function
function showDivs(n, id) {
  var i;
  var x = document.querySelector("#"+id).querySelectorAll('img');
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length} ;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}

//socket connection
socket.on("connect", () => {
  socket.emit("newUserToServer", {
    userName: myName,
    userID: myID,
  });
});

/////////////////////////////
//sending msg to seller
/////////////////////////////

//event listener for button
sendMessageBtn.addEventListener("click", function() {
  let message = textArea.value
  console.log(message)
  sendMessageToUser(message, productOwnerId)
  closeInspect();
});

//function which sends message, idTosend = msg receiver id 
function sendMessageToUser(message, idToSend){

  socket.emit("messageToServer", {
    message: message,
    senderID: myID,
    userToSendID: idToSend
  });
  
}