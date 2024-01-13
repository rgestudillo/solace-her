const db = firebase.firestore();
const movieList = document.getElementById('movieList');

function renderMovies(movies) {
  movieList.innerHTML = '';
  movies.forEach(movie => {
    const li = document.createElement('li');
    li.classList.add('movie-item');
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = movie.id;
    checkbox.checked = movie.checked || false;
    checkbox.addEventListener('change', () => updateMovieCheckStatus(movie.id, checkbox.checked));
    li.appendChild(checkbox);
    // Label
    const label = document.createElement('label');
    label.setAttribute('for', movie.id);
    label.textContent = movie.title;
    li.appendChild(label);
    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.id = "delete";
    deleteButton.innerHTML = '<svg class="svg-icon" width="16" height="16" viewBox="0 0 20 20"> <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path></svg>';
    deleteButton.addEventListener('click', () => deleteMovie(movie.id));
    li.appendChild(deleteButton);
    movieList.appendChild(li);
  });
}

function addMovie() {
  const movieTitleInput = document.getElementById('movieTitle');
  const title = movieTitleInput.value.trim();

  if (title !== '') {
    db.collection('movies').add({
      title: title,
      checked: false,
    });
    movieTitleInput.value = '';
  }
}

function updateMovieCheckStatus(movieId, isChecked) {
  db.collection('movies').doc(movieId).update({
    checked: isChecked,
  });
}

function deleteMovie(movieId) {
  db.collection('movies').doc(movieId).delete();
}

// Real-time updates
db.collection('movies').onSnapshot(snapshot => {
  const movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderMovies(movies);
});
