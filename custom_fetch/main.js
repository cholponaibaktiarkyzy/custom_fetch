async function fech(method,url,data=null){//fetch
  return new Promise((resolve,reject)=>{
    const client = new XMLHttpRequest()
    client.open (method,url);
    client.setRequestHeader('Content-Type', 'application/json');//error 415
    client.responseType = 'json';
    client.send(JSON.stringify(data));
    client.onload = (response ) =>{
      if(response.target.status>= 100 && response.target.status < 400){
        resolve(response.target.response)
      }else{
      reject(response.target.status,response.target.statusText)
      }
    }
  })
}

const baseURL = 'https://geektech-project.herokuapp.com';

const endpoints = {
  products: `${baseURL}/products/`,
}

const state = {
  products: null,
  productId: null
};

const submit = document.getElementById('submit');

const inputs = {
  title: document.getElementById('name'),
  description: document.getElementById('description'),
  price: document.getElementById('price'),
  stock_price: document.getElementById('stock_price'),
  category: document.getElementById('category_id'),
  image: null
}

const deleteProduct = async (id) => {
  let msg = await fech('DELETE',`https://geektech-project.herokuapp.com/products/${id}`)
  console.log(msg)
   console.log(getAllProducts());
}

const getProduct = async (id) => {
  const res = await fech(`GET`,`https://geektech-project.herokuapp.com/products/${id}`)
  const data = res
  state.productId = data.id
  for (let key in data) {
    if (key !== "id" && key !== "image") {
      inputs[key].value = key === "category" ? data[key].id : data[key]
    }
  }
}


async function updateProduct(obj) {
  let res = await fech(`PUT`,`https://geektech-project.herokuapp.com/products/${state.productId}`,obj)
  console.log(res)
}

const getAllProducts = async () => {
  const products = document.querySelector('.products');
  products.innerHTML = "";
  const res = await fech(`GET`,`https://geektech-project.herokuapp.com/products/`)
  const data = res
  state.products = data;

  for (let i = 0; i < data.length; i++) {
    products.innerHTML += `
  <div class="product_block">
   <img src="${baseURL}${data[i].image}" alt=""/>
   <h3>${data[i].title}</h3>
   <p class="description">${data[i].description}</p>
   <p class="price">${data[i].price}</p>
   <button onclick="deleteProduct(${data[i].id})">Delete</button>
   <button onclick="getProduct(${data[i].id})">Edit</button>
  </div>`;
  }

  return data;
}

getAllProducts();

const addProduct = async () => {
  const obj = {
    title: inputs.title.value,
    description: inputs.description.value,
    price: inputs.price.value,
    stock_price: inputs.stock_price.value,
    category_id: inputs.category.value,
    image: null
  }
  if (state.productId) {
    await updateProduct(obj)
  } else {
    await createProduct(obj)
  }
  await getAllProducts()
}

async function createProduct(obj) {
  let res = await fech(`POST`, `https://geektech-project.herokuapp.com/products/`,obj);
  console.log(res);
}

submit.addEventListener('click', addProduct);
