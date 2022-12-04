let searchSearchDiv = document.querySelector(".searchInput");
let attractionsDiv = document.querySelector(".indexAttractionsBox");
let nextPage;
let keyword;
let isLoading = false;
// index
let url = "/api/attractions?page=0";
let page = 0;
let attractionsData;
getAttractions(url);
// search with keyword
keywordDiv = document.querySelector(".searchInput")
body = document.querySelector("body")
let searchBtn = document.querySelector(".searchButton");
searchBtn.onclick=function(){
    if (!isLoading){
        url = "/api/attractions?page=0&keyword="+keywordDiv.value;
        keyword = keywordDiv.value.trim();
        if (keyword.length===0){
            return false;
        }else{
            page = 0;
            attractionsDiv.innerHTML="";
            isLoading = true;
            getAttractions(url);
            categoriesDiv.style.display="none";
            ghostSearch.style.display="none";
        }
    }else{
        return false;
    }
}
// roll and roll and roll
const listEnd = document.querySelector("footer");
const callback = (entries, observer) => {
    for (const entry of entries) {
        if (nextPage===page && !isLoading){
            if (entry.isIntersecting) {
                if (keyword){
                    isLoading = true;
                    url = "/api/attractions?page="+nextPage+"&keyword="+keyword;
                    getAttractions(url);
                }else{
                    isLoading = true;
                    url = "/api/attractions?page="+nextPage;
                    getAttractions(url);
                }
            }
        } else {
            return false;
        }
    }
}
// Observe the end of the list
const observer = new IntersectionObserver(callback, {
    threshold: 1,
});
observer.observe(listEnd);
// categories bar
let urlCat = "/api/categories";
fetch(urlCat).then((res)=>{
    return res.json();
}).then((result)=>{
    let categoriesData = result.data;
    for (let i=0; i<categoriesData.length;i++){
        addDiv("searchCategories", categoriesData[i], categoriesDiv, "chooseCat(this)")
    }
})
// hide and seed
let categoriesDiv = document.querySelector(".categories");
let ghostSearch = document.querySelector(".ghostSearch");
let searchInput = document.querySelector(".searchInput");
searchSearchDiv.onclick=function(){
    ghostSearch.style.display="block";
    categoriesDiv.style.display="flex";
    searchInput.style.zIndex="2";
    searchBtn.style.zIndex="2"
}
window.onclick=function(){
    if (event.target===ghostSearch){
        categoriesDiv.style.display="none";
        ghostSearch.style.display="none"
        searchInput.style.zIndex="1";
        searchBtn.style.zIndex="1"
    }
}
async function getAttractions(url){
    try {
        let response = await fetch(url);
        let result = await response.json();
        attractionsData = result.data;
        if (attractionsData){
            nextPage = result.nextPage;
            // add attraction's div
            for (let i=0; i<attractionsData.length; i++){
                addDiv("indexAttrBox", "", attractionsDiv, "selectAttraction(this)");
            }
            let attrBox = document.querySelectorAll(".indexAttrBox");
            for (let i=0; i<attractionsData.length; i++){
                // add image, name
                addDiv("indexAttractionId", attractionsData[i]["id"]+".", attrBox[page*12+i])
                addImg("indexAttractionImg", attractionsData[i]["image"][0], attrBox[page*12+i]);;
                addDiv("indexAttractionNameDiv", "", attrBox[page*12+i]);
                // add mrt and categories div
                addDiv("indexMrtAndCat", "", attrBox[page*12+i]);
            }
            let attractionNameDiv = document.querySelectorAll(".indexAttractionNameDiv");
            for (let i=0; i<attractionsData.length;i++){
                addDiv("indexAttractionName", attractionsData[i]["name"], attractionNameDiv[page*12+i]);
            }
            let divMrtAndCat = document.querySelectorAll(".indexMrtAndCat");
            for (let i=0; i<attractionsData.length; i++){
                // add mrt and category
                addDiv("indexAttractionMrt", attractionsData[i]["mrt"], divMrtAndCat[page*12+i]);
                addDiv("indexAttractionCat", attractionsData[i]["category"], divMrtAndCat[page*12+i]);
            }
            isLoading = false;
            page++;
        }else{
            attractionsDiv.innerHTML="";
            addDiv("noData", "Here is no data", attractionsDiv);
            isLoading = false;
        }
    }catch(error){
        console.log({"error": error});
    }
}
// select category
function chooseCat(element){
    keywordDiv.value = element.textContent;
    categoriesDiv.style.display="none";
    ghostSearch.style.display="none"
    searchInput.style.zIndex="1";
    searchBtn.style.zIndex="1"
}
function selectAttraction(element){
    const id = element.textContent.split(".")[0];
    document.location.href = "/attraction/" + id;
}
// createElement function div and img
function addDiv(className, insideContent, insert, direction){
    const addDiv = document.createElement("div");
    addDiv.className = className;
    if (direction){
        addDiv.setAttribute("onclick", direction);
    }
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

