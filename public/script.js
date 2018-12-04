const apiLink = '/api';
const listWords = document.getElementById('listWords');
function vote(id, vote) {
    if (localStorage.getItem('token')) {
        let bkqt = document.getElementById(`${id}`);
        let body = {
            definition: id,
            voter: localStorage.getItem('userId'),
            vote: vote
        };
        $.ajax({
                method: "POST",
                url: apiLink + '/vote',
                data: body
            })
            .then((result) => {
                if (result.vote === 1) {
                    getYesFN(id, bkqt)
                }

                if (result.vote === 0) {
                    getNoFN(id, bkqt)
                }

            }).catch((err) => {
                if (err.status == 409) {
                    console.clear();
                    $.ajax({
                            method: "DELETE",
                            url: apiLink + '/vote/' + localStorage.getItem('userId') + '/' + id + '/' + vote
                        })
                        .then(r => {
                            if (r) {
                                getYesFN(id, bkqt);
                                getNoFN(id, bkqt);
                            }
                        })
                        .catch(err => console.log(err))
                }

            });
    }
}

function getYesFN(id, dom) {
    $.ajax({
            method: 'GET',
            url: apiLink + '/vote/yes/' + id
        })
        .then((result) => {
            dom.querySelector('.getYes').innerHTML = result.result
        }).catch((err) => {
            console.log(err)
        });
}

function getNoFN(id, dom) {
    $.ajax({
            method: 'GET',
            url: apiLink + '/vote/no/' + id
        })
        .then((result) => {
            dom.querySelector('.getNo').innerHTML = result.result
        }).catch((err) => {
            console.log(err)
        });
}




$(document).ready(function () {
    let checkUser = document.getElementById('userCheck');


    if (localStorage.getItem('token')) {
        $.ajaxSetup({
            headers: { authorization: localStorage.getItem('token') }
          })
        
        $.ajax({
            method: 'GET',
            url: apiLink + '/user/' + localStorage.getItem('userId')
        })
        .then((result) => {
            console.log(result)
        }).catch((err) => {
            if (err.status === 401) {
                localStorage.clear();
                checkUser.innerHTML = `
                <a class="nav-link" href="/user">Register/Login</a>
                `    
            }
        });
        checkUser.innerHTML = `
        <a class="nav-link" href="/logout" id="logout">Logout</a>
        `
        let logout = document.getElementById('logout');
        logout.addEventListener('click', function (e) {
            localStorage.clear();
            checkUser.innerHTML = `
            <a class="nav-link" href="/user">Register/Login</a>
            `
            e.preventDefault()
        })

    } else {
        checkUser.innerHTML = `
        <a class="nav-link" href="/user">Register/Login</a>
        `
    }

    if (location.pathname === '/user') {
        $('#register-form').hide()
        $('#login-form').show()
        $('#login-form-link').addClass('active');

        $('#login-form-link').click(function (e) {
            $("#login-form").delay(100).fadeIn(100);
            $("#register-form").fadeOut(100);
            $('#register-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        $('#register-form-link').click(function (e) {
            console.log(this)
            $("#register-form").delay(100).fadeIn(100);
            $("#login-form").fadeOut(100);
            $('#login-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });

        let fullName = document.getElementById('fullName');
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        let loginemail = document.getElementById('loginemail');
        let loginpassword = document.getElementById('loginpassword');
        let registerForm = document.getElementById('register');
        let loginForm = document.getElementById('login');

        registerForm.addEventListener("keyup", (e) => {
            if (email.value && fullName.value && password.value && password.value.length >= 8) {
                document.getElementById("registerBtn").removeAttribute('disabled');
            } else {
                document.getElementById("registerBtn").setAttribute('disabled', 'true');
            }
        });

        loginForm.addEventListener('keyup', function () {
            if (loginemail.value && loginpassword.value && loginpassword.value.length >= 8) {
                document.getElementById('loginBtn').removeAttribute('disabled');
            } else {
                document.getElementById('loginBtn').setAttribute('disabled', true);
            }
        })

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let body = {
                email: loginemail.value,
                password: loginpassword.value
            }

            $.ajax({
                    method: 'POST',
                    url: apiLink + '/login',
                    data: body
                })
                .then((result) => {
                    if (result) {
                        localStorage.setItem('token', result.token);
                        localStorage.setItem('userId', result.result._id);
                        document.location.replace('/')
                    }
                }).catch((err) => {
                    console.log(err)
                });
        });


        $('#register').submit(function (e) {
            e.preventDefault()
            let body = {
                email: email.value,
                fullName: fullName.value,
                password: password.value
            }

            $.ajax({
                    method: 'POST',
                    url: apiLink + '/user',
                    data: body
                })
                .then((result) => {
                    if (result) {
                        localStorage.setItem('token', result.token);
                        localStorage.setItem('userId', result.result._id);
                        document.location.replace('/')
                    }
                }).catch((err) => {
                    console.log(err)
                });
        });
    } else {

        const wordBtn = document.getElementById('wordBtn');
        const word = document.getElementById('word');
        word.addEventListener('keyup', function (e) {
            if (word.value) {
                wordBtn.removeAttribute('disabled');
            } else {
                wordBtn.setAttribute('disabled', 'true');
            }
        });
    
        wordBtn.addEventListener('click', function (e) {
            listWords.innerHTML = '';
            let body = {
                word: word.value,
                user: localStorage.getItem('userId')
            };
            $.ajax({
                    method: 'POST',
                    url: apiLink + '/word',
                    data: body
                })
                .then(result => {
                    startWord()
                })
        })
    
        function startWord() {
            $.ajax({
                    method: 'GET',
                    url: apiLink + '/word'
                })
                .then(result => {
                    if (result.length >= 1) {
                        result.forEach(element => {
                            let newDiv = document.createElement('div');
                            newDiv.classList.add('card');
                            newDiv.classList.add('m-2')
                            let definedDiv = document.createElement('div');
                            definedDiv.classList.add('card-body');
                            definedDiv.classList.add('p-2');
    
                            function defineWord() {
                                $.ajax({
                                        method: 'GET',
                                        url: apiLink + '/definition/word/' + element._id,
                                    })
                                    .then(res => {
                                        if (res.length >= 1) {
                                            res.forEach(el => {
                                                let yes;
                                                let no = 0;
                                                let bkqt = document.createElement('blockquote');
                                                bkqt.classList.add('blockquote');
                                                bkqt.classList.add('m-3');
                                                bkqt.setAttribute('id', el._id)
                                                bkqt.innerHTML = `
                                        <p>${el.defined}</p>
                                        <p>
                                            <i class="fa fa-thumbs-up text-muted m-2" onclick="vote('${el._id}', '1')"></i> <span class="badge badge-light getYes">${yes}</span>
                                            <i class="fa fa-thumbs-down text-muted m-2" onclick="vote('${el._id}', '0')"></i> <span class="badge badge-light getNo">${no}</span>
                                        </p>
                                        <footer class="blockquote-footer">${el.user.fullName} <!-- on <cite title="Source Title">${el.dateCreated}</cite> --></footer>   
                                        `;
                                                getYesFN(el._id, bkqt);
                                                getNoFN(el._id, bkqt)
                                                definedDiv.appendChild(bkqt);
                                            });
                                        } else {
                                            let bkqt = document.createElement('blockquote');
                                            bkqt.classList.add('blockquote');
                                            bkqt.classList.add('mb-0');
                                            bkqt.innerHTML = `
                                    <p>This has no definition yet click the button above to suggest a definition</p>
                                    `;
                                            definedDiv.appendChild(bkqt);
                                        }
                                    })
                            }
    
                            defineWord();
                            newDiv.innerHTML = `
                             <div class="card-header">
                               ${element.word}
                               <button class="mx-1 btn btn-sm btn-primary" data-toggle="modal" data-word-id="${element._id}" data-word-cont="${element.word}" data-target="#defineModal">Define</button>
                               <!-- <button class="mx-1 btn btn-sm btn-success" data-toggle="modal" data-word-id="${element._id}" data-word-cont="${element.word}" data-target="#defineModal">Edit</button>
                               <button class="mx-1 btn btn-sm btn-danger" data-toggle="modal" data-word-id="${element._id}" data-word-cont="${element.word}" data-target="#defineModal">Delete</button> -->
                             </div>
                             `;
                            newDiv.appendChild(definedDiv)
                            listWords.appendChild(newDiv);
                        });
                    } else {
                        listWords.innerText = "There no Words to display";
                    }
                })
    
        }
    
        startWord()
    
        $('#addWord').on('show.bs.modal', function (event) {
            if (localStorage.getItem('token')) {
    
            } else {
                let modal = $(this);
                modal.find('.modal-body').html('Please login or register first')
            }
        })
    
        $('#defineModal').on('show.bs.modal', function (event) {
            if (localStorage.getItem('token')) {
                var button = $(event.relatedTarget) // Button that triggered the modal
                var wordCont = button.data('wordCont');
                let wordId = button.data('wordId');
                // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                var modal = $(this)
                modal.find('.modal-title').text('Define: ' + wordCont)
                let defineBtn = modal.find('#defineBtn');
                let defineText = modal.find('#definition');
    
                defineText.keyup(function (e) {
                    if (defineText.val().length >= 2) {
                        defineBtn.removeAttr('disabled')
                    } else {
                        defineBtn.attr('disabled', 'true')
                    }
                });
    
                defineBtn.on('click', function (e) {
                    let body = {
                        user: localStorage.getItem('userId'),
                        word: wordId,
                        defined: defineText.val()
                    }
                    $.ajax({
                        method: 'POST',
                        url: apiLink + '/definition',
                        data: body
                    });
                })
            } else {
                let modal = $(this);
                modal.find('.modal-body').html('Please login or register first')
            }
        });   
    }
});