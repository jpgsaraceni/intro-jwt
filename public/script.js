const url = 'http://localhost';
let username;

function openContainer(id) { // close all containers and open div with id=`${id}-container`
  document.querySelectorAll('.page-container').forEach((container) => container.style.display = 'none');
  document.getElementById(`${id}-container`).style.display = 'block';
};

function renderPage(body, targetPage) { // render html received from server
  return new Promise((resolve, reject) => {
    const reader = body.getReader();
    resolve (new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
                controller.close();
                return;
            }
            // Enqueue the next data chunk into our target stream
            controller.enqueue(value);
            return pump();
          });
        }
      }
    }))
  })
    .then(stream => new Response(stream))
    .then(response => response.blob())
    .then(blob => blob.text())
    .then(data => {
      openContainer(targetPage);
      document.getElementById(`${targetPage}-container`).innerHTML = data;
      document.getElementById('username').innerHTML = username;
    })
};

document.getElementById('login-btn').addEventListener('click', () => { // send login form and receive homepage. Then adds event listeners to homepage buttons.
  username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  fetch(`${url}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({username, password}),
  })
    .then(response => renderPage(response.body, 'home'))
    .then(() => document.getElementById('list-users-btn').addEventListener('click', () => listUsers()))
    .catch(err => console.log(err));
});

function listUsers() {
  fetch(`${url}/users`).then(response => console.log(response));
  console.log('listening');
};