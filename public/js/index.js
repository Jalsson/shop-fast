console.log('runnaa')
const url = 'http://localhost:5000';
const test = document.createElement('p');
const mainHeader = document.querySelector('#main')
const text = document.createTextNode('asd');
test.appendChild(text);
mainHeader.appendChild(test);

const addImage = (image) => {
    
    image.forEach((element) => {
        
    
    console.log('test 2')
    //create image
    const img = document.createElement('img');
    img.src = url + '/' + element.filename;
    img.alt = "random";
    const div = document.createElement('div');
    div.className = "saleBoard";

    div.appendChild(img);

    mainHeader.appendChild(div);
});
}
const getImage = async () => {
    try {
      const response = await fetch(url + '/image');
      const image = await response.json();
      addImage(image);
    }
    catch (e) {
      console.log(e.message);
    }
  };
  getImage();

  