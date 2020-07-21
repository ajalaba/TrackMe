$('#navbar').load('navbar.html');
$('#footer').load('footer.html');

const devices = JSON.parse(localStorage.getItem('devices')) || [];

devices.forEach(function(device) {
    $('#devices tbody').append(`
    <tr>
    <td>${device.user}</td>
    <td>${device.name}</td>
    </tr>`
    );
    });

$('#add-device').on('click', function() {
    const user = $('#user').val();
    const name = $('#name').val();
    devices.push({ user, name });
    localStorage.setItem('devices', JSON.stringify(devices));
    location.href = '/';
});

$('#send-command').on('click', function() {
    const command = $('#command').val();
    console.log(`command is: ${command}`);
    });

$('#register').on('click', function() {
    const username = $('#user').val();
    const password = $('#password').val();
    const confirm = $('#confirm').val();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exists = users.find(user => user.name === username);
    if (exists)
    {
        $('#message').append('<p class="alert alert-danger">Username already exists!</p>');
    } 
    else if (password != confirm)
    {
        $('#message').append('<p class="alert alert-danger">Passwords do not match!</p>');
    }
    else
    {
        users.push({ name: username, password});
        localStorage.setItem('users', JSON.stringify(users));
        location.href = '/';
    }
});

$('#login').on('click', function() {
    const username = $('#user').val();
    const password = $('#password').val();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exists = users.find(user => user.name === username);

    if (exists && exists.password === password)
    {
        localStorage.setItem('isAuthenticated', true);
        location.href = '/';
    }
    else
    {
        $('#message').append('<p class="alert alert-danger">Athentication failed!</p>');
    }
});

const logout = () => {
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
    }
