const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const notesByDate = document.getElementById('notes-by-date');
const notesByTag = document.getElementById('notes-by-tag');

function loadNotes() {
  return JSON.parse(localStorage.getItem('notes') || '[]');
}

function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function parseTags(text) {
  const regex = /#(\w+)/g;
  const tags = new Set();
  let match;
  while ((match = regex.exec(text))) {
    tags.add(match[1].toLowerCase());
  }
  return Array.from(tags);
}

function render() {
  const notes = loadNotes();
  renderByDate(notes);
  renderByTag(notes);
}

function renderByDate(notes) {
  notesByDate.innerHTML = '<h2>Notes by Date</h2>';
  const grouped = {};
  notes.forEach((note) => {
    const date = note.date.split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(note);
  });
  Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .forEach((date) => {
      const div = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = date;
      div.appendChild(h3);
      grouped[date].forEach((n) => {
        const p = document.createElement('div');
        p.className = 'note';
        p.textContent = n.content;
        div.appendChild(p);
      });
      notesByDate.appendChild(div);
    });
}

function renderByTag(notes) {
  notesByTag.innerHTML = '<h2>Notes by Concept</h2>';
  const grouped = {};
  notes.forEach((note) => {
    note.tags.forEach((tag) => {
      if (!grouped[tag]) grouped[tag] = [];
      grouped[tag].push(note);
    });
  });
  Object.keys(grouped)
    .sort()
    .forEach((tag) => {
      const div = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = tag;
      div.appendChild(h3);
      grouped[tag].forEach((n) => {
        const p = document.createElement('div');
        p.className = 'note';
        p.textContent = n.content;
        div.appendChild(p);
      });
      notesByTag.appendChild(div);
    });
}

noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = noteInput.value.trim();
  if (!content) return;
  const tags = parseTags(content);
  const notes = loadNotes();
  notes.push({ content, date: new Date().toISOString(), tags });
  saveNotes(notes);
  noteInput.value = '';
  render();
});

render();
