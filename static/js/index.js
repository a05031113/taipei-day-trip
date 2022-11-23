let searchSearchDiv = document.querySelector(".searchInput");
let attractionsDiv = document.querySelector(".attractionsBox");

async function getAttractions(url, page, keyword){
    try {
        if (keyword){
            keyword = keyword;
        }else{
            keyword = null;
        }
        let response = await fetch(url);
        let result = await response.json();
        let attractionsData = result["data"];
        let nextPage = result["nextPage"];
        // add attraction's div
        for (let i=0; i<attractionsData.length; i++){
            addDiv("attrBox", "", attractionsDiv);
        }
        let attrBox = document.querySelectorAll(".attrBox");
        for (let i=0; i<attractionsData.length; i++){
            // add image, name
            addImg("attractionImg", attractionsData[i]["image"][0], attrBox[page*12+i]);;
            addDiv("attractionNameDiv", "", attrBox[page*12+i]);
            // add mrt and categories div
            addDiv("mrtAndCat", "", attrBox[page*12+i]);
        }
        let attractionNameDiv = document.querySelectorAll(".attractionNameDiv");
        for (let i=0; i<attractionsData.length;i++){
            addDiv("attractionName", attractionsData[i]["name"], attractionNameDiv[page*12+i]);
        }
        let divMrtAndCat = document.querySelectorAll(".mrtAndCat");
        for (let i=0; i<attractionsData.length; i++){
            // add mrt and category
            addDiv("attractionMrt", attractionsData[i]["mrt"], divMrtAndCat[page*12+i]);
            addDiv("attractionCat", attractionsData[i]["category"], divMrtAndCat[page*12+i]);
        }
        page++;
        // check scroll to bottom and check if nextPage
        window.onscroll = function() {
            if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
                if (nextPage){
                    if (keyword){
                        url = "/api/attractions?page="+nextPage+"&keyword="+keyword;
                        getAttractions(url, page, keyword);
                    }else{
                        url = "/api/attractions?page="+nextPage;
                        getAttractions(url, page);
                    }
                } else {
                    return false;
                }
            }
        }
    }catch(error){
        console.log({"error": error});
    }
}
// index
let url = "/api/attractions?page=0";
getAttractions(url, 0);
// search with keyword
keyword = document.querySelector(".searchInput")
let searchBtn = document.querySelector(".searchButton");
searchBtn.onclick=function(){
    url = "/api/attractions?page=0&keyword="+keyword.value;
    attractionsDiv.innerHTML="";
    getAttractions(url, 0, keyword.value);
}
// categories bar
let urlCat = "/api/categories";
fetch(urlCat).then((res)=>{
    return res.json();
}).then((result)=>{
    let categoriesData = result["data"];
    for (let i=0; i<categoriesData.length;i++){
        const categories = document.createElement("div");
        categories.className = "searchCategories";
        categories.setAttribute("onclick", "chooseCat(this)");
        const text = document.createTextNode(categoriesData[i]);
        categories.appendChild(text);
        categoriesDiv.appendChild(categories);
    }
})
// hide and seed
let categoriesDiv = document.querySelector(".categories");
let ghostSearch = document.querySelector(".ghostSearch");
searchSearchDiv.onclick=function(){
    ghostSearch.style.display="block";
    categoriesDiv.style.display="flex";
}
window.onclick=function(){
    if (event.target===ghostSearch){
        categoriesDiv.style.display="none";
        ghostSearch.style.display="none"
    }
}
// select category
function chooseCat(element){
    keyword.value = element.textContent
}
// createElement function div and img
function addDiv(className, insideContent, insert){
    const addDiv = document.createElement("div");
    addDiv.className = className;
    const text = document.createTextNode(insideContent);
    addDiv.appendChild(text);
    insert.appendChild(addDiv);
}
function addImg(className, imgUrl, insert){
    const attractionImg = document.createElement("img");
    attractionImg.className = className;
    attractionImg.src = imgUrl;
    insert.appendChild(attractionImg);
}
