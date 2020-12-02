import React from 'react';
import '../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        // The state maintained by this React Component. 
        this.state = {
            categoryList: []
        }

    }

    // React function that is called when the page load.
    componentDidMount() {
    }

    showCategoriesCity(city) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };
        fetch("http://localhost:8081//topCategories/" + city, requestOptions)
            .then(res => res.json())
            .then((categoryList) => {
                if (!categoryList) return;
                let categoryL = genreList.map((categoryObj, i) =>
                <p> </p>
              );
      
              // Set the state of the genres list to the value returned by the HTTP response from the server.
              this.setState({
                categoryList: categoryL
              })
            })
            .catch(err => console.log(err))
        this.setState({
            email: '',
            password: ''
        });
    }

    render() {
        return (
            <div></div>
        );
    }
}