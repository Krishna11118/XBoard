function createCarousal(id) {
  return `
    <div id="carouselExampleControls-${id}" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner" id="carouselInner-${id}">
      
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls-${id}" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls-${id}" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
    `;
}

function createAccordion(id, controls, target, open, heading, jsonData, index) {
  //    console.log("id",id, "controls",controls,"targets",target,"open",open,"heading",heading);
  // console.log(index)
  let accoItem = document.createElement("div");
  accoItem.className = "accordion-item";
  accoItem.innerHTML = `
            <h2 class="accordion-header" id=${id}>
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="${target}" ${open} aria-controls=${controls}>
                    ${jsonData.feed.title}
                </button>         
            </h2>
            <div id="${controls}" class="accordion-collapse collapse ${
    index === 0 ? "show" : ""
  }" aria-labelledby="${heading}" data-bs-parent="#accordionExample">
                <div class="accordion-body" id="accordionBody-${id}">
            
                </div>       
            </div>
        `;
  return accoItem;
}

const init = async () => {
  magazines.forEach(async (element, index) => {
    let id = `heading${index}`;
    let controls = `collapse${index}`;
    let target = `#collapse${index}`;
    //
    let heading = `heading${index}`;
    let jsonFile = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURI(element)}`
    );
    let jsonData = await jsonFile.json();
    console.log(jsonData);
    // console.log(id,controls,target,heading,url);
    let open = index === 0 ? `aria-expanded="true"` : `aria-expanded="false"`;
    let selectAccordion = document.getElementById("accordionExample");
    let accordion = createAccordion(
      id,
      controls,
      target,
      open,
      heading,
      jsonData,
      index
    );
    selectAccordion.append(accordion);

    let carouselCreate = document.getElementById(`accordionBody-${id}`);
    let creatingDiv = document.createElement("div");
    creatingDiv.innerHTML = createCarousal(`${controls}`);
    carouselCreate.append(creatingDiv);

    jsonData.items.forEach((item, index) => {
      let neededDate = item.pubDate;
      neededDateFinal = neededDate.split(" ")[0];
      let finalDate = new Date(neededDateFinal).toLocaleDateString("en-IN");
      let carouselInner = document.getElementById(`carouselInner-${controls}`);
      let carousalSlide = document.createElement("div");
      if (index === 0) {
        carousalSlide.className = "carousel-item active";
      } else {
        carousalSlide.className = "carousel-item";
      }

      carousalSlide.innerHTML = `
                <div class="card d-block">
                    <img class="card-img-top img-fluid carousel-img" src="${item.enclosure.link}" alt="carousel image">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <div class="d-flex align-items-center">
                            <h6 class="card-subtitle text-muted">${item.author}</h6>
                            <p class="card-subtitle text-secondary">&nbsp; • &nbsp;${finalDate}</p>
                        </div>
                        <p class="card-text">${item.description}</p>
                        <a href="${item.link}" class="stretched-link" target="_blank"></a>
                    </div>
                </div> 
            `;
      carouselInner.append(carousalSlide);
    });
  });
};
init();
