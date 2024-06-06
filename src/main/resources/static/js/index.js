const context = {
    users: {},
    user: {},
    roles: []
}

const init = async () => {
    const api = '/api'

    const header = document.querySelector('#header');
    const tableBodyAllUsers = document.querySelector('#table_all_users');
    const newUserFormRoles = document.querySelector('#create_roles');
    const tabUserInfo = document.querySelector('#user-info');
    const sidebar = document.querySelector('#sidebar');
    const userTableTab = document.querySelector('#admins-tab')
    const body = document.body;
    const modals = document.createElement('div')

    context.users = await fetch(`${api}/admin/users`).then((res) => res.json())
    context.user = await fetch(`${api}/user`).then((res) => res.json());
    context.roles = await fetch(`${api}/admin/roles`).then((res) => res.json());

    const {user, roles} = context

    const getTextRoles = (roles) => {
        return roles.map(({name}) => name.slice(5)).join(', ')
    }

    header.innerHTML = `
        <div class="container-fluid">
            <ul class="navbar-nav mb-auto">
                <li class="navbar-brand">
                    <form >
                        You:
                        <span class="navbar-brand mb-0 h1">${user.email}</span>
                        <span class="navbar-brand mb-0 me-0 h1">with roles: </span>
                        ${getTextRoles(user.roles)}
                     </form>
                </li>
            </ul>
            <ul class="navbar-nav ms-auto">
            <li class="nav-item">
                <form action="/logout" method="POST">
                    <button class="nav-link">Logout
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="25"
                             height="25"
                             fill="currentColor"
                             class="bi bi-door-open"
                             viewBox="0 0 16 16">
                            <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                            <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5
                            0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z"/>
                        </svg>
                    </button>
                </form>
            </li>
        </ul>
        </div>
`

    const isAdmin = Boolean(user.roles.find((item) => item.id === 2))

    sidebar.innerHTML = `
        <ul class="nav nav-pills flex-column pt-3 gap-1"
                id="side-bar"
                role="tablist"
                aria-orientation="vertical">
                ${isAdmin ? `<li class="nav-item">
                    <button class="nav-link active col-12"
                            id="side-admin-tab"
                            data-bs-toggle="pill"
                            role="tab"
                            href="#admin-tab"
                            aria-controls="admin-panel"
                            aria-selected="true">
                        <span class="row">
                            <span class="fw-bold text-start">
                                Admin
                            </span>
                        </span>
                    </button>
                </li>` : ''}
                <li class="nav-item">
                    <button class="nav-link col-12"
                            id="side-user-tab"
                            data-bs-toggle="pill"
                            role="tab"
                            href="#user-info"
                            aria-controls="user-panel"
                            aria-selected="false">
                        <span class="row">
                            <span class="fw-bold text-start"
                            >User
                            </span>
                        </span>
                    </button>
                </li>
            </ul>
    `

    if (!isAdmin) {
        const sidebarUserTab = document.querySelector('#side-user-tab')
        sidebarUserTab.click();
    }

    function renderUserData(isFirstRender) {
        const contextUsers = context.users
        modals.innerHTML = '';

        if (isAdmin) {
            tableBodyAllUsers.innerHTML = `
        ${contextUsers.map(item => {
                return `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.username}</td>
                    <td>${item.name}</td>
                    <td>${item.surname}</td>
                    <td>${item.age}</td>
                    <td>${item.email}</td>
                    <td>${getTextRoles(item.roles)}</td>
                    <td>
                    <button class="btn btn-primary btn-ml" 
                    data-bs-toggle="modal" 
                    data-bs-target="${'#edit' + item.id}" 
                    data-row="${item}"
                    >Edit
                    </button>
                    </td>
                    <td>
                    <button class="btn btn-danger btn-ml" 
                    data-bs-toggle="modal" 
                    data-bs-target="${'#delete' + item.id}" 
                    data-row="${item}"
                    >Delete
                    </button>
                    </td>
                </tr>`
            }).join('')}
    `

            if (isFirstRender) {
                newUserFormRoles.insertAdjacentHTML('beforeend', `
        <select size="2" multiple class="form-select" name="roles" id="select_edit">
                                    ${roles.map(item => {
                    return `<option value="${item.id}">${item.name.slice(5)}</option>`
                }).join('')}
        </select>
        <br/>
        <br/>
         <div class="modal-footer justify-content-evenly">
            <button type="button" class="btn btn-success" id="create-submit">Add new user</button>
        </div>
    `)
            }

            contextUsers.forEach(item => {
                modals.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="${'edit' + item.id}" tabindex="-1" aria-labelledby="update" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content text-center fw-bold">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="update">Edit user</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form class="offset-1 col-10" name="edit-form-${item.id}">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="id_edit" class="col-form-label">id</label>
                                <input type="number" value="${item.id}" name="id" class="form-control" id="id_edit" readonly/>
                            </div>
                            <div class="mb-3">
                                <label for="username_edit" class="col-form-label" >username</label>
                                <input type="text" value="${item.username}" name="username" class="form-control" id="username_edit" minlength="3" maxlength="32" required/>
                            </div>
                            <div class="mb-3">
                                <label for="name_edit" class="col-form-label">name</label>
                                <input type="text"  value="${item.name}"  name="name"  class="form-control"  id="name_edit"  minlength="0"  maxlength="32" />
                            </div>
                            <div class="mb-3">
                                <label for="surname_edit" class="col-form-label">surname</label>
                                <input type="text"  value="${item.surname}"  name="surname"  class="form-control"  id="surname_edit"  minlength="0"  maxlength="32" />
                            </div>
                            <div class="mb-3">
                                <label for="age_edit" class="col-form-label">age</label>
                                <input type="number" value="${item.age}" name="age" class="form-control" id="age_edit" min="0" max="100"/>
                            </div>
                            <div class="mb-3">
                                <label for="email_edit" class="col-form-label">email</label>
                                <input type="text" value="${item.email}" name="email" class="form-control" id="email_edit" minlength="0" maxlength="32"/>
                            </div>
                            <div class="mb-3">
                                <label for="password_edit" class="col-form-label" >password</label>
                                <input type="password" value="" name="password" class="form-control" id="password_edit" placeholder="new password" minlength="4" maxlength="64" required />
                            </div>
                            <div class="d-flex flex-column mb-3">
                                <label class="col-form-label font-weight-bold">role:</label>
                                <select size="2" multiple class="form-select" name="roles" id="select_edit">
                                    ${roles.map(role => {
                    return `<option ${Boolean(item.roles.find(({id}) => id === role.id)) ? 'selected' : ''} value="${role.id}">${role.name.slice(5)}</option>`
                }).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer justify-content-md-end">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" <button  id="edit-submit-${item.id}">Edit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `)

                const editButton = modals.querySelector(`#edit-submit-${item.id}`);

                editButton.addEventListener('click', () => {
                    const form = document.forms[`edit-form-${item.id}`]
                    const body = {
                        id: item.id,
                        surname: form.surname.value,
                        name: form.name.value,
                        age: form.age.value,
                        email: form.email.value,
                        username: form.username.value,
                        ...form.password.value && {password: form.password.value},
                        roles: Array.from(form.roles.selectedOptions)
                            .map(option => ({id: Number(option.value)}))
                    }

                    fetch(`${api}/admin/users`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'PATCH',
                        body: JSON.stringify((body)),
                    }).then(async () => {
                        context.users = await fetch(`${api}/admin/users`).then((res) => res.json())
                        renderUserData()
                    });
                })


                modals.insertAdjacentHTML('beforeend', `
            <div class="modal fade" id="${'delete' + item.id}" tabindex="-1" aria-labelledby="delete" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content text-center fw-bold">
                        <div class="modal-header">
                            <h1 class="modal-title fs-4" id="delete">Delete user</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form class="offset-1 col-10" name="delete-form-${item.id}">
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="id_delete" class="col-form-label">id</label>
                                    <input type="number" value="${item.id}" name="id" class="form-control" id="id_delete" disabled readonly/>
                                </div>
                                <div class="mb-3">
                                    <label for="username_delete" class="col-form-label">username</label>
                                    <input type="text" value="${item.username}" name="username" class="form-control" id="username_delete" disabled readonly/>
                                </div>
                                <div class="mb-3">
                                    <label for="name_delete" class="col-form-label">name</label>
                                    <input type="text" value="${item.name}" name="name" class="form-control" id="name_delete" disabled readonly/>
                                </div>
                                <div class="mb-3">
                                    <label for="surname_delete" class="col-form-label">surname</label>
                                    <input type="text" value="${item.surname}" name="surname" class="form-control" id="surname_delete" disabled readonly/>
                                </div>
                                <div class="mb-3">
                                    <label for="age_delete" class="col-form-label">age</label>
                                    <input type="number" value="${item.age}" name="age" class="form-control" id="age_delete" disabled readonly/>
                                </div>
                                <div class="mb-3">
                                    <label for="email_delete" class="col-form-label">email</label>
                                    <input type="text" value="${item.email}" name="email" class="form-control" id="email_delete" disabled readonly/>
                                </div>
                                <div class="mb-3">
                                    <label class="col-form-label">role</label>
                                    <h6 class="form-heading text-center">${getTextRoles(item.roles)}</h6>
                                </div>
                            </div>
                            <div class="modal-footer justify-content-md-end">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="delete-submit-${item.id}">Delete</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `)


                const deleteButton = modals.querySelector(`#delete-submit-${item.id}`);

                deleteButton.addEventListener('click', () => {
                    fetch(`${api}/admin/users?username=${item.username}`, {method: 'DELETE'}).then(async () => {
                        context.users = await fetch(`${api}/admin/users`).then((res) => res.json())
                        renderUserData()
                    });
                })
            })

            const createButtons = document.querySelector(`#create-submit`);

            createButtons.addEventListener('click', () => {
                const form = document.forms[`create-form`]
                const body = {
                    surname: form.surname.value,
                    name: form.name.value,
                    age: form.age.value,
                    email: form.email.value,
                    username: form.username.value,
                    password: form.password.value,
                    roles: Array.from(form.roles.selectedOptions)
                        .map(option => ({id: Number(option.value)}))
                }

                fetch(`${api}/admin/users`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify((body)),
                }).then(async () => {
                    context.users = await fetch(`${api}/admin/users`).then((res) => res.json())
                    userTableTab.click()
                    renderUserData()
                });
            })

        }

        if (isFirstRender) {
            tabUserInfo.insertAdjacentHTML('beforeend', `
    <div class="card">
        <table class="table table-striped">
            <thead>
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Age</th>
                <th>Email</th>
                <th>Role</th>
            </tr>
            </thead>
                <tbody>
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.name}</td>
                        <td>${user.surname}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${getTextRoles(user.roles)}</td>
                    </tr>
                </tbody>
        </table>
    </div>
`)

        }

        body.append(modals)
    }

    renderUserData(true)
}


init()