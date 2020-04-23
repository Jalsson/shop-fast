console.log('runnaa')
const url = 'http://localhost:5000';
const test = document.createElement('p');
const mainHeader = document.querySelector('#main')


const createProductDivs = (products) => {
    
    products.forEach((element) => {
        
    
    console.log('test 2')
    //create image
    const img = document.createElement('img');
    img.src = element.url;
    img.alt = "random";
    const div = document.createElement('div');
    div.className = "saleBoard";
    
    const h1 = document.createElement('h1');
    const desc = document.createTextNode(element.description);
    h1.appendChild(desc);

    const price = document.createElement('h2');
    const amount = document.createTextNode('Price: '+element.price+'€');
    price.appendChild(amount)

    div.appendChild(img);
    div.appendChild(h1);
    div.appendChild(price);

    mainHeader.appendChild(div);
});
}
const getProducts = async () => {
    try {
      const response = await fetch(url + '/data');
      const products = await response.json();
      createProductDivs(products);
    }
    catch (e) {
      console.log(e.message);
    }
  };
  getProducts();

  