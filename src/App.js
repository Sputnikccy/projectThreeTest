// Config details
import firebaseConfig from './firebase';
// NPM Modules
import { useState, useEffect } from 'react';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

function App() {
  // this state will track the books from our db
  const [ books, setBooks ] = useState([]);
  // this state will track user inputs from the form
  const [ userInput, setUserInput ] = useState("");

  useEffect(() => {
    // create a variable that will hold on to our database values
    const database = getDatabase(firebaseConfig);
    
    // create a variable that makes reference to our database!
    const databaseRef = ref(database);
    
    // grabbing the information from our database
    onValue(databaseRef, (response) => {
      // Creating an array to store our data
      const newState = [];
      // Storing the returned data as a variable
      const data = response.val();
      // loop through the returned object
      for (let key in data) {
        newState.push({ key: key, name: data[key]})
      }
      // updating state with the new array!
      setBooks(newState)
    })
  }, []);

  // creating function that takes care of the update input logic
  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  };

  // creating the function that submits the value to firebase!
  const handleFormSubmit = (event) => {
    // preventing the default action of the form
    event.preventDefault();

    // now to push the information to firebase!
    const database = getDatabase(firebaseConfig);
    const databaseRef = ref(database);
    // put it in firebase!
    push(databaseRef, userInput);
    // reset the userInput state
    setUserInput("");
  };

  // this will remove the book from the list
  const handleRemoveBook = (bookId) => {
    const database = getDatabase(firebaseConfig);
    const databaseRef = ref(database, `/${bookId}`);
    // this will remove the specific value from our database
    remove(databaseRef)
  }
  
  return (
    <div>
      <h1>My BookShelf!!</h1>
      <ul>
        {
          books.map((book) => {
            return (
              <li key={book.key}>
              
                <p>{book.name}</p>
                
                {/* I want to be able to remove the book */}
                <button onClick={() => {handleRemoveBook(book.key)}}>Remove book!</button>
              </li>
            )
          })
        }
      </ul>

      {/* I want to be able to add a book! */}
      <form action='submit'>
        <label htmlFor='newBook'>Add a new book to our collection!</label>
        <input 
          id='newBook'
          type='text'
          onChange={handleInputChange}
          value={userInput}
        />
        <button onClick={handleFormSubmit}>Add Book</button>
      </form>
    </div>
  )
};

export default App;