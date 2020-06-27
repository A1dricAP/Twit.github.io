console.log("Hello world!");

const loadingElement = document.querySelector(".loading");
const mewsElement = document.querySelector(".mews");

const API_URL = "http://localhost:5000/mews";

loadingElement.style.display = "";

listAllMews();

const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formdata = new FormData(form);
  const name = formdata.get("name");
  const content = formdata.get("content");
  const mew = {
    name,
    content,
  };

  loadingElement.style.display = "";
  form.style.display = "none";
  //   console.log(mew);
  console.log("form was submitted!");

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(mew),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((createdMew) => {
      //   console.log(createdMew);

      form.reset();
      setTimeout(() => {
        form.style.display = "";
      }, 15000);

      listAllMews();
      // form.style.display = "";
    });
});

function listAllMews() {
  mewsElement.innerHTML = "";
  /*
  basically, (mewsElement.innerHTML) will blank out entire page contents 
  that were there before and then add something new, 
  using the mewsElement.appendChild(div)*/

  fetch(API_URL)
    .then((response) => response.json())
    .then((mews) => {
      console.log(mews);
      mews.reverse();
      mews.forEach((mew) => {
        const div = document.createElement("div");

        const date = document.createElement("small");
        date.textContent = new Date(mew.created);
        const header = document.createElement("h3");
        header.textContent = mew.name;

        const contents = document.createElement("p");
        contents.textContent = mew.content;

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        mewsElement.appendChild(div);
      });
      loadingElement.style.display = "none";
    });
}
