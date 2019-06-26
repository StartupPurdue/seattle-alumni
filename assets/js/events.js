$(document).ready(() => {
  let data = [];
  const upcomingEvents = $("#upcoming-events");
  const pastEvents = $("#past-events");

  //Connect to the Airtable and build elements
  const startAirtable = () => {
    fetch('https://api.airtable.com/v0/appLLGsgl0o7H5VN7/Seattle', {
      method: "GET",
      headers: {
        Authorization: "Bearer keywRTkDRGVoJpVNx"
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res) {
        data = res.records.map(record => record.fields)
      }

      data.forEach(event => {       
        if(event.Name === null || event.Name === undefined) return;

        if(event.Completed) {
          pastEvents.prepend(buildEvent(event));
        } else {
          upcomingEvents.prepend(buildEvent(event));
        }
      });
    });
  }

  // Build user HTML
  const buildEvent = (eventData) => {
    let date = new Date(eventData.Date);

    const month = date.toLocaleString('en-us', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const datetime = date.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric'}) + ", " + date.toLocaleTimeString('en-US').replace(/(.*)\D\d+/, '$1');;
   
    return `
      <div class="col-md-4">
        <div class="card event-card">
          <div class="card-body">
            <div class="card-text big-date">
              <p class="month">${month}</p>
              <p class="day">${day}</p>
            </div>
            <h5 class="card-title">${eventData.Name}</h5>
            <p class="card-text date">${datetime}</p>
            <p class="card-text location"><a href="https://maps.google.com/?q=${eventData.Location}">${eventData.Location}</a></p>
          </div>
          <div class="card-footer">
            <a href="${eventData.Link}" class="card-link text-center"><i class="fas fa-external-link-square-alt"></i> &nbsp;More Information</a>
          </div>
        </div>
      </div>
    `;
  }

  startAirtable();
});