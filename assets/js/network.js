$(document).ready(() => {
  let data = ["Hello"];
  const searchField = $("#search");
  const resultsContainer = $("#results");

  /*****************************************************/
  // Connect to the airtable and build initial elements
  /*****************************************************/

  const startAirtable = () => {
    fetch('https://api.airtable.com/v0/app36kMpjAlitJKAE/Seattle', {
      method: "GET",
      headers: {
        Authorization: "Bearer keywRTkDRGVoJpVNx"
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res) {
        data = res.records.map(record => record.fields).filter(record => record.Approved);
      }

      data.forEach((result, id) => resultsContainer.prepend(buildUser(id, result)));
      $(".badge").on("click", (event) => { search(event); });
    });
  }

  /*****************************************************/
  //Search the Airtable for individuals
  /*****************************************************/

  const search = (event) => {
    // Build results array and make sure query ignores case
    let results = [];
    let query = searchField.val().toLowerCase();

    // If the user clicks a tag on an alumni, this event is triggered
    if(event.type === "click") {
      query = $(event.target).text();
      searchField.val(query);
      query = query.toLowerCase();
    }

    // If the user types in the search bar, this event is triggered
    if(!query || query === "") {
      results = data;
      resultsContainer.children().each((index, child) => $(child).show());
    } else {
      data.forEach((item, index) => {
        const entries = Object.entries(item);
        let found = false;

        // Iterate through all of the fields in each object to see if there is a match betwween the query and field data.
        entries.forEach((entry) => {
          const val = entry[1];

          if(typeof val === "string"){
            if(val.toLowerCase().includes(query)) {
              found = true;
            }
          }

          // If a field is an array, like the tags, check the query on each item in the array
          if(Array.isArray(val)) {
            val.forEach(tag => {
              if(tag.toString().toLowerCase().includes(query)) {
                found = true;
              }
            });
          }
        })

        if(found) results.push(index);
      })

      // Show hide elements based on the airtable data and element id
      resultsContainer.children().each((index, child) => {
        let jChild = $(child);

        const id = jChild.data("id")
        if(results.includes(id)) {
          jChild.show();
        } else {
          jChild.hide();
        }
      })
    }
  }

  /*****************************************************/
  // Build user HTML
  /*****************************************************/

  const buildUser = (id, userData) => {
    if(!userData || userData === "") return "";

    let imageUrl = "data:image/jpeg;base64,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";
    let gradYear = "";
    let roleAndCompany = "";
    let badges = "";

    if(userData.Headshot && userData.Headshot[0]) {
      imageUrl = userData.Headshot[0].url;
    }

    if(userData["Graduating Year"]) {
      gradYear = "'" + userData["Graduating Year"];
    }

    if(userData.Role && userData.Company) {
      roleAndCompany = userData.Role + " at " + userData.Company;
    }

    if(userData.Tags) {
      badges = userData.Tags.map(tag => {
        return `<span class="badge badge-dark">${tag}</span>`;
      }).join(" ");
    }


    return `
      <div class="col-md-3" data-id="${id}">
        <div class="card network-card">
          <div class="card-body">
            <img class="rounded-circle" src="${imageUrl}" style="object-fit: cover; text-align: center" alt="Card image cap">
            <h5 class="card-title name">${userData.Name}</h5>
            <p class="card-text">${roleAndCompany}</p>
            <p class="card-text grad">${userData["Major at Purdue"] || ""} ${gradYear || ""}</p>
            ${badges}
          </div>
          <div class="card-footer">
            <a href="${userData.Linkedin || "javascript:void(0)"}" class="card-link text-center">Contact</a>
          </div>
        </div>
      </div>
    `;
  }

  startAirtable();
  searchField.on("keyup", search);
});