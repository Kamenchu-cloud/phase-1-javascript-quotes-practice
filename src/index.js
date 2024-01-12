document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const quoteForm = document.getElementById('new-quote-form');
    const sortButton = document.getElementById('sort-button');
    let likesData = [];
  
    const fetchQuotes = async () => {
      const response = await fetch('http://localhost:3000/quotes?_embed=likes');
      const quotes = await response.json();
      const likesResponse = await fetch('http://localhost:3000/likes');
      likesData = await likesResponse.json();
      displayQuotes(quotes);
    };
  
    const displayQuotes = (quotes) => {
      quoteList.innerHTML = '';
      quotes.forEach(quote => {
        const li = document.createElement('li');
        li.className = 'quote-card';
        li.innerHTML = `
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success' data-id="${quote.id}">Likes: <span>${getLikesCount(quote.id)}</span></button>
            <button class='btn-danger' data-id="${quote.id}">Delete</button>
            <button class='btn-info edit-button' data-id="${quote.id}">Edit</button>
          </blockquote>
        `;
        quoteList.appendChild(li);
      });
    };
  
    const getLikesCount = (quoteId) => {
      const likes = likesData.filter(like => like.quoteId === quoteId);
      return likes.length;
    };
  
    quoteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(quoteForm);
      const text = formData.get('quote');
      const author = formData.get('author');
  
      await fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote: text, author }),
      });
  
      fetchQuotes();
    });
  
    quoteList.addEventListener('click', async (event) => {
      const quoteId = event.target.getAttribute('data-id');
  
      if (event.target.classList.contains('btn-success')) {
        await fetch('http://localhost:3000/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quoteId: parseInt(quoteId) }),
        });
  
        fetchQuotes();
      } else if (event.target.classList.contains('btn-danger')) {
        await fetch(`http://localhost:3000/quotes/${quoteId}`, {
          method: 'DELETE',
        });
  
        fetchQuotes();
      } else if (event.target.classList.contains('edit-button')) {
        console.log(`Edit button clicked for quote with ID ${quoteId}`);
      }
    });
  
    fetchQuotes();
  });
  