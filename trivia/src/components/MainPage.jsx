import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import constants from "./Constants";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import LeaderBoard from './LeaderBoard';

export default class MainPageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: undefined
        }
    }

    componentDidMount() {
        this.authUnsub = firebase.auth().onAuthStateChanged(user => {
          this.setState({
              displayName: user.displayName,
              authenticated: this.props.authenticated
          });
        });
    }
    
    componentWillUnmount() {
        this.authUnsub();
    }

    handleSignOut() {
        this.setState({working: true});
        firebase.auth().signOut()
          .catch(err => this.setState({errorMessage: err.message}))
          .then(() => this.setState({working: false, authenicated: false}));
          this.props.history.replace(constants.routes.signin);
    }

    quiz(evt) {
        evt.preventDefault();
        this.props.history.replace(constants.routes.quizpage);
        //<Redirect to = {constants.routes.quizpage}/>
    }

    render() {
        let taken;
        var dateobj= new Date() ;
        var month = dateobj.getMonth() + 1;
        var day = dateobj.getDate() ;
        var year = dateobj.getFullYear();
        var lday;
        var lmonth;
        var lyear;
        let dataRef = firebase.database().ref(month+"-"+day+"-"+year).on("value", (snapshot)=>{
            console.log(snapshot.val());
            snapshot.forEach(function(childSnapshot){
                lday = childSnapshot.val().dateTaken.dayTaken;
                lmonth = childSnapshot.val().dateTaken.monthTaken;
                lyear = childSnapshot.val().dateTaken.yearTaken;
            })
        });
        var date = (lmonth === month && lday === day && lyear === year);
        if(!date) {
            taken = (
                <div className="container">
                    <button
                        className="btn-sm btn-info" 
                        onClick={(evt) => this.quiz(evt)}>
                        Take Quiz!
                    </button>
                </div>
            ); 
        } else {    //taken
            taken = <h3>Come back tomorrow!</h3>;
        }
        
        return (
            <div className="Main text-center">
                <LeaderBoard  />
                {taken}
                <div className="footer">
                    <button className="btn-sm btn-danger text-center signoutbutton" onClick={()=>this.handleSignOut()}> Sign Out</button>
                </div>
                
                
            </div>
        );
    }
}


