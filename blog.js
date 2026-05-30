// SUPABASE CONNECTION
const SUPABASE_URL =
"https://lnuznyfumxjrfxtxozhg.supabase.co"

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxudXpueWZ1bXhqcmZ4dHhvemhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDU5MjgsImV4cCI6MjA5NTM4MTkyOH0.WxIT5uWCm-Y0UXiWvwTEzU_HCnYTxJoEt9SJFfUhIfo"

const supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)


// HTML ELEMENTS
const contentInput =
document.getElementById("content")

const postBtn =
document.getElementById("postBtn")

const postsContainer =
document.getElementById("posts")

const loginBtn =
document.getElementById("loginBtn")

const logoutBtn =
document.getElementById("logoutBtn")

const userLabel =
document.getElementById("userLabel")


// AUTH STATE
let currentUser = null


// CHECK LOGIN
async function checkUser() {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser()

  currentUser = user

  if (user) {

    userLabel.innerText =
    `Logged in as ${user.email}`

    loginBtn.style.display =
    "none"

    logoutBtn.style.display =
    "inline-block"

  } else {

    userLabel.innerText =
    "Not logged in"

    loginBtn.style.display =
    "inline-block"

    logoutBtn.style.display =
    "none"
  }
}


// LOGIN
async function login() {

  const email =
  prompt("Email")

  const password =
  prompt("Password")

  if (!email || !password)
  return

  const { error } =
  await supabaseClient.auth
  .signInWithPassword({
    email,
    password
  })

  if (error) {

    alert(error.message)

    return
  }

  await checkUser()
}


// LOGOUT
async function logout() {

  await supabaseClient.auth.signOut()

  await checkUser()
}


// CREATE POST
async function createPost() {

  if (!currentUser) {

    alert(
      "Please login first"
    )

    return
  }

  const content =
  contentInput.value.trim()

  if (!content) {

    alert(
      "Enter post content"
    )

    return
  }

  postBtn.disabled = true
  postBtn.innerText =
  "Posting..."

  const { error } =
  await supabaseClient
  .from("posts")
  .insert([
    {
      user_id:
      currentUser.id,

      username:
      currentUser.email,

      content:
      content
    }
  ])

  postBtn.disabled = false
  postBtn.innerText =
  "Post"

  if (error) {

    alert(error.message)

    console.log(error)

    return
  }

  contentInput.value = ""

  loadPosts()
}


// LOAD POSTS
async function loadPosts() {

  postsContainer.innerHTML =
  "<p>Loading feed...</p>"

  const { data, error } =
  await supabaseClient
  .from("posts")
  .select("*")
  .order(
    "created_at",
    { ascending: false }
  )

  if (error) {

    postsContainer.innerHTML =
    "<p>Failed to load posts</p>"

    return
  }

  postsContainer.innerHTML = ""

  if (!data.length) {

    postsContainer.innerHTML =
    "<p>No posts yet</p>"

    return
  }

  data.forEach(post => {

    postsContainer.innerHTML += `

      <div class="feed-post">

        <h3>
          ${post.username}
        </h3>

        <p>
          ${post.content}
        </p>

      </div>

    `
  })
}


// TOGGLE MENU
function toggleMenu(){

  const menu =
  document.getElementById(
    "dropdownMenu"
  )

  menu.classList.toggle(
    "show"
  )
}


// CLOSE MENU
document.addEventListener(
  "click",
  function(event){

    const menu =
    document.getElementById(
      "dropdownMenu"
    )

    const menuBtn =
    document.querySelector(
      ".menu-btn"
    )

    if(
      menu &&
      menuBtn &&
      !menu.contains(
        event.target
      ) &&
      !menuBtn.contains(
        event.target
      )
    ){

      menu.classList.remove(
        "show"
      )

    }

  }
)


// EVENTS
postBtn.addEventListener(
  "click",
  createPost
)

loginBtn.addEventListener(
  "click",
  login
)

logoutBtn.addEventListener(
  "click",
  logout
)


// START
checkUser()
loadPosts()