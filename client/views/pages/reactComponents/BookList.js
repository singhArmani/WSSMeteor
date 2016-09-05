import React from 'react';



export default class BookList extends React.Component {
    //E6 new style

    constructor(props) {
        super(props);

        //defining state for this component
        this.state = {books:[
            {   id:1,
                name:"The Golden Bird",
                author:"Amandeep Singh"
            },
            {   id:2,
                name:"Harry Potter and the Deathly Hollows",
                author:"Malkeet Singh"
            },
            {
                id:3,
                name:"My Journey of struggle",
                author:"Rasmeet Kour"
            }],
            selectedBooks:[], //empty selectedBooks
            error:false
        };

        //As we are retrieving state of our component in handleSelectedBooks function
        //we have to bind the function with out React Component class using bind method
        this.handleSelectedBooks= this.handleSelectedBooks.bind(this);

        //same logic as above ..this.state..
         this.handleSubmit = this.handleSubmit.bind(this);

        this.RenderError = this.RenderError.bind(this);
    //
    }

    handleSelectedBooks(event){

        var _selectedBooks = this.state.selectedBooks;

        //getting index of the selected book
        var index = _selectedBooks.indexOf(event.target.value);

        //pushing into the array only when item is not in the selectedBook state and it's being checked
        if (event.target.checked)
        {
            if (index === -1) _selectedBooks.push(event.target.value);

        } else {
                _selectedBooks.splice(index, 1);
        }


        this.setState({selectedBooks:_selectedBooks}); //updating the state using setState(mykey:"new value")
    }

    handleSubmit(event){
        event.preventDefault();

        /*
         "The BookList component now calls the updateFormData function and passes the
         currently selected books to it, whenever a user submits the first form,"
         */

        //if user hasn't selected any books
        if (this.state.selectedBooks.length === 0) {
            this.setState({error:"Please choose one book to continue"});
            console.log("Form can't be Submitted!");
        }
        else {
            this.setState({error:false}); //setting to false again
            this.props.updateFormData({selectedBooks: this.state.selectedBooks});
            console.log("Form Submitted!");
        }

    }

    //this function will render the book with the name and the author
    RenderBook(book){
        return(
                <div className="checkbox" key={book.id}>
                    <label>
                        <input type="checkbox"
                               value= {book.name}
                               onChange= {this.handleSelectedBooks}
                        />{book.name} -- {book.author}
                    </label>
                </div>
        );
    }

    RenderError(){
        if(this.state.error) {
            return (
                <div className="alert alert-danger">
                    {this.state.error}
                </div>
            );
        }

    }

   render(){
       //getting all books from the state
       var Books = this.state.books.map((book) => this.RenderBook(book));

        var errorMessage = this.RenderError();
      return (
          <div>
            <h3>Choose from wide variety of Books available in our store</h3>
              {errorMessage}
              <form onSubmit={this.handleSubmit}>
                {Books}
                  <input type="submit" value ="submit" className="btn btn-success"/>
              </form>
          </div>
      );
   }
}
