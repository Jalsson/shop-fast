
const url = 'http://localhost:5000';

const mainHeader = document.querySelector('#main')
const addDataForm = document.querySelector('#add-data-form');


const createProductDivs = (products) => {
    console.log(products)
    products.forEach((element) => {

    //saleBoard div
    const div = document.createElement('div');
    div.className = "saleBoard";

      //product name header
    const h1 = document.createElement('h1');
    const desc = document.createTextNode(element.Name);
    h1.appendChild(desc);

    //price
    const price = document.createElement('h2');
    const amount = document.createTextNode('Price: '+element.price+'€');
    price.appendChild(amount)

    //slide buttons

    div.appendChild(h1);
    div.appendChild(price);
    mainHeader.appendChild(div);

    });

    //images.forE
    /*products.forEach((element) => {
    console.log(element)
    //create image
    const img = document.createElement('img');
    img.className = "slideImage"
    img.src = url + '/' + element.url;
    img.alt = "picture";

    //images to div
    div.appendChild(img);*/
    
   
//});

     //product name header
    /*const h1 = document.createElement('h1');
    const desc = document.createTextNode(products[0].Name);
    h1.appendChild(desc);

    //price
    const price = document.createElement('h2');
    const amount = document.createTextNode('Price: '+products[0].price+'€');
    price.appendChild(amount)

    //slide buttons

    const button1 = document.createElement('button');
    button1.className = "minusSlide";
    const filling = document.createTextNode('asd');
    button1.appendChild(filling);

    const button2 = document.createElement('button');
    button2.className = "plusSlide";
    const filling2 = document.createTextNode('asd')
    button2.appendChild(filling2)

    div.appendChild(h1);
    div.appendChild(price);
    div.appendChild(button1);
    div.appendChild(button2);
    mainHeader.appendChild(div);


    document.querySelector(".minusSlide").addEventListener("click", plusDivs(-1));
    document.querySelector(".plusSlide").addEventListener("click", plusDivs(1));*/
   
    
}
const createInsertImagesToDiv = (images) => {
  console.log(images)
  products.forEach((element) => {
    
  });
}

const getProducts = async () => {
    try {
      const response = await fetch(url + '/data');
      const products = await response.json();
      createProductDivs(products);
    }
    catch (e) {
      console.log("error " +e.message);
    }
  };
  getProducts();
///////////////////////////////

//image slide
  /*var slideIndex = 1;
  showDivs(slideIndex);
  
  function plusDivs(n) {
    console.log("slide runs")
    showDivs(slideIndex += n);
  }
  
  function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("slideImage");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    x[slideIndex-1].style.display = "block";  }*/

//////////////////////////////








/*function loadfiles()
{
    var imageFiles = document.getElementById("fileUpload"),
    filesLength = imageFiles.files.length;
    for (var i = 0; i < filesLength; i++) {
      document.write(imageFiles.files[i].name);
    }
    console.log(imageFiles)
}*/
/*var input = document.getElementById('fileUpload')
var fileList = [];

input.addEventListener('change', function (evnt){
  fileList = [];
  for(let i = 0; i<input.files.length; i++){
    fileList.push(input.files[i]);
  }
});

var fileCatcher = document.getElementById('fileCatcher');

fileCatcher.addEventListener('submit', function(evnt){
  evnt.preventDefault();
  fileList.forEach(function(file){
    sendfile(file);
  });
});

sendfile = function (file){
  var formData = new FormData();
  var request = new XMLHttpRequest();

  formData.set('file', file);
  request.open("POST", '/data');
  request.send(formData);
}*/

//////////////////////////////////////

//image upload

//var files = document.getElementById('files');

//files.addEventListener('submit')


/*addDataForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addDataForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/data', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  getProducts();
}); */