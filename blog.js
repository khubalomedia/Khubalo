// SUPABASE CONNECTION
const SUPABASE_URL = "https://lnuznyfumxjrfxtxozhg.supabase.co"

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxudXpueWZ1bXhqcmZ4dHhvemhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDU5MjgsImV4cCI6MjA5NTM4MTkyOH0.WxIT5uWCm-Y0UXiWvwTEzU_HCnYTxJoEt9SJFfUhIfo"

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)


// HTML ELEMENTS
const usernameInput = document.getElementById("username")
const contentInput = document.getElementById("content")
const postBtn = document.getElementById("postBtn")
const postsContainer = document.getElementById("posts")


// CREATE POST
async function createPost() {

  const username = usernameInput.value
  const content = contentInput.value

  if (!username || !content) {
    alert("Please fill all fields")
    return
  }

  const { data, error } = await supabaseClient
    .from("Posts")
    .insert([
      {
        username: username,
        content: content
      }
    ])

  if (error) {
    console.log(error)
    alert(error.message)
  } else {
    alert("Posted successfully!")

    usernameInput.value = ""
    contentInput.value = ""

    loadPosts()
  }
}


// LOAD POSTS
async function loadPosts() {

  const { data, error } = await supabaseClient
    .from("Posts")
    .select("*")
    .order("id", { ascending: false })

  if (error) {
    console.log(error)
    return
  }

  postsContainer.innerHTML = ""

  data.forEach(post => {

    postsContainer.innerHTML += `
      <div class="post">
        <h3>${post.username}</h3>
        <p>${post.content}</p>
      </div>
    `
  })
}


// BUTTON CLICK
postBtn.addEventListener("click", createPost)


// START
loadPosts()