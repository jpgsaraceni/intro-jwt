const url = 'http://localhost';
let username;

document.getElementById('login-btn').addEventListener('click', () => { // send login form and receive homepage. Then adds event listeners to homepage buttons.
    username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch(`${url}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.text()).then(data => {
            document.getElementById(`home-container`).innerHTML = data;
            document.getElementById('username').innerHTML = username;
            document.getElementById('list-users-btn').addEventListener('click', () => listUsers());
            if (document.getElementById('register-user-btn'))
                document.getElementById('register-user-btn').addEventListener('click', () => renderUserForm());
        })
        .catch(err => console.log(err));
});

function listUsers() { // gets user list then iterates calling renderUserList for each user
    fetch(`${url}/users`)
        .then(response => response.json())
        // .then(response => response.status===200 ? response.json() : false)
        .then(data => {
            data.forEach(user => renderUserList(user));
        })
        .catch(err => console.log(err));
};

function renderUserList(user) { // renders a div for each user
    document.getElementById('list-users-btn').style.display = 'none';
    if (document.querySelectorAll('form-container')) {
        const elements = document.querySelectorAll('.form-container');
        elements.forEach(element => element.innerHTML = '');
    };
    if (document.getElementById('register-user-btn')) document.getElementById('register-user-btn').style.display = 'inline-block';

    const userContainer = document.createElement('div');
    userContainer.className = 'user-container';
    userContainer.style.border = '1px solid';
    userContainer.innerHTML = `
    <p>Name: <strong>${user.name}</strong></p>
    <p>Username: <strong>${user.username}</strong></p>
    <p>Type: <strong>${user.userType}</strong></p>
  `;
    document.getElementById(`home-container`).appendChild(userContainer);
}

function renderUserForm() { // renders the form to register a new user
    document.getElementById('register-user-btn').style.display = 'none';
    if (document.querySelectorAll('user-container')) {
        const elements = document.querySelectorAll('.user-container');
        elements.forEach(element => element.style.display = 'none');
    };
    document.getElementById('list-users-btn').style.display = 'inline-block';

    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    formContainer.innerHTML = `
    <input id="new-name" type="text" placeholder="Nome" />
    <input id="new-username" type="text" placeholder="Usuário" />
    <input id="new-password" type="password" placeholder="Senha" />
    <input id="confirm-password" type="password" placeholder="Confirmar Senha" />
    <button id="send-user-btn">Registrar</button>
  `;
    document.getElementById('home-container').append(formContainer);
    document.getElementById('send-user-btn').addEventListener('click', () => sendUser());
}

function sendUser() { // sends the form to the server
    const name = document.getElementById('new-name').value;
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password === confirmPassword) {

        fetch(`${url}/users`, {
            method: 'POST',
            body: JSON.stringify({ name, username, password }),
            headers: { 'Content-Type': 'application/json' },
        }).catch(err => console.log(err));
    }
}