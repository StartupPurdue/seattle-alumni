$(document).ready(() => {
  let data = [];
  const searchField = $("#search");
  const resultsContainer = $("#results");
  let results = data;

  const buildNewsItem = (newsData) => {
    if(!newsData || newsData === "") return "";

    return `
      <div class="col-md-12">
        <a href="#">
          <div class="card news-card">
            <h2 class="news-title">${newsData.Title}</h2>
            <p class="news-description">${newsData.Description}</p>
            <div class="news-footer">
              <p class="news-author">${newsData.Author}</p>
              <p class="news-date">${newsData.Date}</p>
            </div>
          </div>
        </a>
      </div>
    `;
  }

  const updateElements = () => {
    console.log(results)

    $('#pagination').pagination({
        dataSource: results,
        pageSize: 5,
        callback: function(paginatedData, pagination) {
          resultsContainer.html("");

          paginatedData.forEach(item => {
            console.log(item)
            resultsContainer.prepend(buildNewsItem(item));
          })
        }
    })
  }

  const startAirtable = () => {
    fetch('https://api.airtable.com/v0/appCXmPx3X0Gh8eS1/Seattle', {
      method: "GET",
      headers: {
        Authorization: "Bearer keywRTkDRGVoJpVNx"
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res) {
        data = res.records.map(record => record.fields)
        data = data.filter(record => record.Title)
        results = data;

        updateElements();      
      }
    });
  }

  //Search data
  const search = (event) => {
    let query = searchField.val();
    results = [];

    if(!query || query === "") {
      results = data;
    } else {
      data.forEach((item) => {
        const entries = Object.entries(item);
        
        let found = false;

        entries.forEach((entry) => {
          const val = entry[1];

          if(val.toString().includes(query)) {
            found = true;
          }
        })

        if(found) results.push(item);
      })
    }

    console.log("Results", results)

    updateElements();
  }  

  startAirtable();
  searchField.on("keyup", search);
});