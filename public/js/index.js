const mainUrl = "http://localhost:5000";

const mainHeader = document.querySelector("#main");
const addDataForm = document.querySelector("#add-data-form");

const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');

const header = document.querySelector("#Header");
const chatStart = document.querySelector("#chatStart");
const sitecontainer = document.querySelector("#siteContainer")
let divNumber = 1
let called = 0
const createProductDivs = (products) => {
  
  products.forEach((element) => {
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
    
    //button2.addEventListener("click", nextImage(div.id)); 

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

const getProducts = async () => {
  try {
    const response = await fetch(mainUrl + "/data");
    const products = await response.json();
    createProductDivs(products);
  } catch (e) {
    console.log("error " + e.message);
  }
};
getProducts();

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
function slideSetup(id){
  console.log("called slideSetup")
  slideIndex = 1;
showDivs(slideIndex, id);
}

function plusDivs(n, id) {
  console.log("called plusDivs")
  showDivs(slideIndex += n, id);
}

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
