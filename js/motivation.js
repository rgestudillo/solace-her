const db = firebase.firestore();
const motivationList = document.getElementById('motivationList');

function rendermotivations(motivations) {
  motivationList.innerHTML = '';
  motivations.forEach(motivation => {
    const li = document.createElement('li');
    li.classList.add('motivation-item');
    // Label
    const label = document.createElement('label');
    label.setAttribute('for', motivation.id);
    label.textContent = motivation.title;
    li.appendChild(label);
    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.id = "delete";
    deleteButton.innerHTML = '<svg class="svg-icon" width="16" height="16" viewBox="0 0 20 20"> <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path></svg>';
    deleteButton.addEventListener('click', () => deletemotivation(motivation.id));
    li.appendChild(deleteButton);
    motivationList.appendChild(li);
  });
}

function addMotivation() {
  const motivationTitleInput = document.getElementById('motivations');
  const title = motivationTitleInput.value.trim();

  if (title !== '') {
    db.collection('motivations').add({
      title: title,
    });
    motivationTitleInput.value = '';
  }
}

function deletemotivation(motivationId) {
  db.collection('motivations').doc(motivationId).delete();
}

// Real-time updates
db.collection('motivations').onSnapshot(snapshot => {
  const motivations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  rendermotivations(motivations);
});
