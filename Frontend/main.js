    let password;
    let username;
    let passwordlog;
    let usernamelog;
    const userpage = document.querySelector(".usernameuser")
    let responcetxt = document.querySelector(".responcetxt")
    let responcetxtlog = document.querySelector(".responcetxtlog")
    let navreg = document.querySelector("#navreg")
    let navlogin = document.querySelector("#navlogin")
    let likebtn = document.querySelector(".likebtn")
    let dislikebtn = document.querySelector(".dislikebtn")
    let IsLoggedin = false
    let userpageHTML = document.querySelector(".userpage")
    navlogout = document.querySelector("#navlogout")
    navlogout.hidden = true;
    let postbtn = document.querySelector("#postbtn")
    postbtn.hidden = true;
    let alluserposts;
    let postid;
    let userid;
    let commentsHTMLArray;


        function extractDirectUrl(bbcode) {
            const match = bbcode.match(/\[img\](.*?)\[\/img\]/);
            return match ? match[1] : bbcode;
        }



        async function GetUserByID(id) {
            let response = await fetch(`https://localhost:7085/api/DogShare/author/${id}`);
            let user = await response.json();
            return user;
        }

        async function GetPosts() {
            let HTML = ``;
            let response = await fetch("https://localhost:7085/api/DogShare/AllPosts");
            let posts = await response.json();

            

            for (const element of posts) {
                commentsHTMLArray = await Promise.all(
                    element.comments.map(async (c) => {
                        let user = await GetUserByID(c.authorId);
                        return `
                            <div class="comment">
                                <span class="comment-author"><strong>${user.userName || user.username || 'User'}</strong>: </span>
                                <span class="comment-text">${c.commentText}</span>
                                <div><small class="comment-date">${new Date(c.dateCommented).toLocaleString()}</small></div>
                            </div>
                        `;
                    })
                );

                

                let userHTML = '';
                if (element.authorId) {
                    let user = await GetUserByID(element.authorId);
                    userHTML = `
                        <div class="User">
                             <span class="username">${user.userName}</span>
                        </div>
                    `;
                }

                postid = element.id;
                HTML += `
                    <div class="post">
                        <p class="username">${userHTML}</p>
                        <p style="font-weight: bold;" class="title">${element.title}</p>
                        <img class="postimg" style="width: 80%" src="${element.image}" alt="">
                        <h5>Description:</h5>
                        <p class="description">${element.description}</p>
                        <p class="dateposted">${new Date(element.datePosted).toLocaleString()}</p>
                        <p class="likes">Likes: <span class="like-count-num">${element.likes}</span></p>
                        <button class="likebtn" data-post-id="${element.id}"><i class="fa-solid fa-up-long"></i></button>
                        <button class="dislikebtn" data-post-id="${element.id}"><i class="fa-solid fa-down-long"></i></button>
                        <div class="comments">
                            <input class="commentinput" placeholder="Write comment here" type="text">
                            <button class="submitcomt" data-post-id="${element.id}">submit</button>
                            <h4>Comments:</h4>
                            ${commentsHTMLArray.join('')}
                        </div>
                    </div>
                    <hr>`;
                
            }

            document.querySelector(".posts").innerHTML = HTML;
        }

        GetPosts();


        
const BASE_URL = 'https://localhost:7085'; 

fetchProtectedData()

async function registerUser(email, password) {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            responcetxt.innerHTML = 'Registration successful!'
            console.log('Registration successful!');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            return true;
        } else {
            
            const errorData = await response.json();
            const errorMessageString = Object.values(errorData.errors)
            .flat()
            .join('\n');

            responcetxt.innerHTML = 'Registration failed: ' + errorMessageString
            console.error('Registration failed:', errorData);
            return false;
        }
    } catch (err) {
        console.error('Network error during registration:', err);
    }
}


async function loginUser(email, password) {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            console.error('Login failed');
            return null;
        }

        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            console.log('Login successful via Bearer token.');
            responcetxtlog.innerHTML = 'Login successful!'
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            return data;
        }

        console.log('Login successful via Cookie.');
        return true;
    } catch (err) {
        console.error('Network error during login:', err);
    }
}

async function fetchProtectedData() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        console.error('No access token found. Please log in.');

        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/DogShare/UserInfo`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user info: ${response.status}`);
        }

        const user = await response.json();
        IsLoggedin = true;
        navreg.hidden = true;
        navlogin.hidden = true;
        navlogout.hidden = false;
        postbtn.hidden = false;
        userid = user.id;
        userpage.innerHTML = 'welcome: ' + user.email;
        document.querySelector(".emailview").innerHTML = user.email;
        console.log('User Info:', user);
        return user;
    } catch (err) {
        console.error('Error fetching protected data:', err);
    }
}




const Form = document.querySelector(".regform")
const logform = document.querySelector(".loginform")


Form.addEventListener("submit", function(event) {
    event.preventDefault();
    password = document.querySelector(".password").value
    username = document.querySelector(".email").value
    console.log(password, username)
    registerUser(username,password)
});

logform.addEventListener("submit", function(event) {
    event.preventDefault();
    passwordlog = document.querySelector(".passwordlog").value
    usernamelog = document.querySelector(".emaillog").value
    console.log(passwordlog, usernamelog)
    loginUser(usernamelog,passwordlog)
    fetchProtectedData()
});








document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.querySelector('.regform');
    const loginForm = document.querySelector('.loginform');
    const modalWrapper = regForm.parentElement;


    const navLinks = document.querySelectorAll('.nav-link');
    let regNavBtn, loginNavBtn;

    navLinks.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        if (text === 'register') regNavBtn = link;
        if (text === 'login') loginNavBtn = link;
    });


    [regForm, loginForm].forEach(form => {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.type = 'button';
        closeBtn.className = 'modal-close-x';
        closeBtn.addEventListener('click', closeModal);
        form.appendChild(closeBtn);
    });


    function openModal(formToShow) {
        modalWrapper.classList.add('show-modal');
        regForm.classList.remove('active');
        loginForm.classList.remove('active');
        formToShow.classList.add('active');
    }

  
    function closeModal() {
        modalWrapper.classList.remove('show-modal');
        regForm.classList.remove('active');
        loginForm.classList.remove('active');
    }


    if (regNavBtn) {
        regNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(regForm);
        });
    }

    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginForm);
        });
    }


    modalWrapper.addEventListener('click', (e) => {
        if (e.target === modalWrapper) {
            closeModal();
        }
    });
});



document.body.addEventListener("click", async function(event) {
    if (event.target.classList.contains("likebtn")) {
        const postId = event.target.dataset.postId;

        console.log("Liking post:", postId);

        await Likefun(postId);
        GetPosts();
    }

    if (event.target.classList.contains("dislikebtn")) {
        const postId = event.target.dataset.postId;

        console.log("disliking post:", postId);

        await dislikefun(postId);
        GetPosts();
    }
});

async function Likefun(id) {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`${BASE_URL}/api/DogShare/like/${id}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
        });
        if (response.status == 400) {
            alert("you already liked this post!")
        }
        if (response.status == 401) {
            alert("Bark! (log in or register to like!)")
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
    }
}

async function dislikefun(id) {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`${BASE_URL}/api/DogShare/unlike/${id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
        });
        if (response.status == 400) {
            alert("you already disliked this post!")
        }
        if (response.status == 401) {
            alert("Bark! (log in or register to dislike!)")
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
    }
}

document.body.addEventListener("click", async function(event) {
    const submitButton = event.target.closest(".submitcomt");
    if (!submitButton) return;

    const postId = submitButton.dataset.postId;
    if (!postId) {
        console.warn("Submit button is missing a post ID.");
        return;
    }

    const post = submitButton.closest(".post");
    const commentInput = post ? post.querySelector(".commentinput") : null;
    const commentvalue = commentInput ? commentInput.value.trim() : "";

    if (!commentvalue) {
        alert("Please enter a comment before submitting.");
        return;
    }

    console.log("Commenting:", postId, commentvalue);
    await Comment(postId, commentvalue);
    GetPosts()
});

async function Comment(id, comment) {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`${BASE_URL}/api/DogShare/comment/${id}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({Content: comment, datePosted: new Date().toISOString() })
        });
        
        if(response.status == 401) {
            alert("Bark! (log in or register to comment!)")
        }

        const data = await response.json();
        console.log(new Date().toISOString())
        return data;
    } catch (error) {
        console.error(error)
    }
}

navlogout.addEventListener("click", function(event) {
    event.preventDefault();
    LogOut();
});

function LogOut(){
    let logoutoption = confirm("Are you sure you want to log out?")

    if(logoutoption){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        IsLoggedin = false;
        navreg.hidden = false;
        navlogin.hidden = false;
        navlogout.hidden = true;
        userpage.innerHTML = '';
        alert("You have been logged out.")
    }
}


async function UserPosts() {
    let userpostsHTML = ``;
    
    try {
        let response = await fetch(`${BASE_URL}/api/DogShare/GetPostsOfUser`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) return;
        let posts = await response.json();

        for (const post of posts) {
            let commentsHTML = '';
            if (post.comments && post.comments.length > 0) {
                const commentsArray = await Promise.all(
                    post.comments.map(async (c) => {
                        let user = await GetUserByID(c.authorId);
                        return `
                            <div class="comment">
                                <span class="comment-author"><strong>${user.userName || user.username || 'User'}</strong>: </span>
                                <span class="comment-text">${c.commentText}</span>
                                <div><small class="comment-date">${new Date(c.dateCommented).toLocaleString()}</small></div>
                            </div>
                        `;
                    })
                );
                commentsHTML = commentsArray.join('');
            }

            userpostsHTML += `
                <div class="userpost">
                    <p class="title">${post.title}</p>
                    <img class="postimg" style="width: 80%" src="${post.image}" alt="">
                    <p class="description">${post.description}</p>
                    <p class="dateposted">${new Date(post.datePosted).toLocaleString()}</p>
                    <p class="likes">Likes: ${post.likes}</p>
                    <button class="likebtn" data-post-id="${post.id}"><i class="fa-solid fa-up-long"></i></button>
                    <button class="dislikebtn" data-post-id="${post.id}"><i class="fa-solid fa-down-long"></i></button>
                    <div class="comments">
                        <input class="commentinput" placeholder="Write comment here" type="text">
                        <button class="submitcomt" data-post-id="${post.id}">submit</button>
                        <h4>Comments:</h4>
                        ${commentsHTML}
                    </div>
                </div>
                <hr>`;
        }

        document.querySelector('.userposts').innerHTML = userpostsHTML;
    } catch (error) {
        console.error("Error fetching user posts:", error);
    }
}

UserPosts()



document.querySelector(".usernameuser").addEventListener("click", function(event){
    event.preventDefault();
    const element = document.querySelector(".userpopup");
    element.style.display = "flex"; 
})

document.querySelector(".closeuserpopup").addEventListener("click", function(event){
    event.preventDefault();
    const element = document.querySelector(".userpopup")
    element.style.display = "none";
})

async function Post(title,description,image){

    var response = await fetch(`${BASE_URL}/api/DogShare/AddPost`,{
        method: "POST",
        headers:{
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({             
            title: title,
            description: description,
            image: image,       
            likes: 0,          
            datePosted: new Date().toISOString() })
    })
    var data = await response.json();
    if(title == "" || description == ""){
        alert("NO!")
        return
    }
    alert("Posted Sucssessfully!")
    window.location.reload();
    return data;
}


document.querySelector("#postbtn").addEventListener("click", function(event) {
    event.preventDefault();
    document.querySelector(".postpopup").style.display = "flex"; 
})


document.querySelector(".closepostpopup").addEventListener("click", function(event){
    event.preventDefault();
    const element = document.querySelector(".postpopup")
    element.style.display = "none";
})

document.querySelector(".PostSubmit").addEventListener("click", function(event){
    event.preventDefault()
    const Title = document.querySelector(".inpTitle").value
    const Description = document.querySelector(".inpDescription").value
    const Image = document.querySelector(".inpImage").value

    Post(Title, Description, extractDirectUrl(Image))
})