console.log("Sanity Check: JS is working!");

document.addEventListener("DOMContentLoaded", function(event) {

  // GLOBAL VARIABLES
  const form = document.getElementById('workForm');
  const results = document.getElementById('results');
  const baseURL = 'http://localhost:3000/api/workhistory/';

  const render = (workHist) => {
    results.innerHTML = '';
    form.children[0] = '';
    form.children[1] = '';
    form.children[2] = '';

    const work = workHist.forEach(work => {
      results.insertAdjacentHTML('afterbegin', `
          <div>
            <p><strong>${work.name}</strong></p>
            <p><strong>${work.type}</strong></p>
            <small id="${work._id}">Remove</small>
            <small id="${work._id}">Edit</small>
          </div>
        `)
    })
  }

  // GET ALL WORK
  const getWork = () => {
    fetch(baseURL)
      .then(res => res.json())
      .then(workHist => render(workHist))
      .catch(err => console.log(err));
  }

  getWork();

  // ADD NEW WORK
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log('Form submitted!');
    const workName = document.getElementById('workName').value;
    const workType = document.getElementById('workType').value;
    const data = {name: workName, type: workType};

    // console.log(data);

    fetch(baseURL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json(res))
      .then(data => getWork())
      .catch(err => console.log(err));
  }


  // DELETE WORK
  const handleEditDelete = (event) => {
    if (event.target.innerText === 'Remove') {
      // console.log(event.target.id)
      fetch(baseURL + event.target.id, {
        method: 'DELETE',
      })
        .then(() => getWork())
        .catch(err => console.log(err));
    } else if(event.target.innerText === 'Edit') {
      // console.log('Edit Clicked!');
      const parent = event.target.parentNode;
      const workName = parent.children[0].innerText;
      const workType = parent.children[1].innerText;
      const workId = parent.children[3].id;

      parent.insertAdjacentHTML('beforeend', `
          <span id="editWork">
            <input id="editWorkName" name="name" type="text" value="${workName}" />
            <input id="editWorkType" name="type" type="text" value="${workType}" />
            <button id="editCancel">Cancel</button>
            <button id="editSubmit" data-id="${workId}">Submit</button>
          </span>
      `);
    } else if(event.target.id === 'editCancel') {
      const form = document.getElementById('editWork');
      form.remove();
    } else if(event.target.id === 'editSubmit') {
      let workId = event.target.getAttribute('data-id');
      console.log(workId);
      const newName = document.getElementById('editWorkName').value;
      const newType = document.getElementById('editWorkType').value;
      const data = {name: newName, type: newType};
      if (newName.length !== 0 && newType.length !== 0) {
        fetch(baseURL + workId, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(data),
        })
          .then(() => getWork());
      }
    }
  }

  // EVENT LISTENERS
  form.addEventListener('submit', handleSubmit);
  results.addEventListener('click', handleEditDelete);


});