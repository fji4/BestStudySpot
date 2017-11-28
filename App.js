import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    Scene,
    Router,
    Actions,
    Stack
} from 'react-native-router-flux';

import firebase from 'firebase';

import Login from './components/Login';
import Register from './components/Register';
import Library from './components/Library';
import Comment from './components/Comment';
import Recommend from './components/Recommend';
import User from './components/User';
import Webview from './components/Webview';

/**
 * The Navigation setup for the whole app.
 */
export default class App extends React.Component {
    componentWillMount() {
        firebase.initializeApp({
            apiKey: 'AIzaSyCThMsvn3SlasnipSJ_byYiZlaWPmF5Wto',
            authDomain: 'best-study-spot.firebaseapp.com',
            databaseURL: 'https://best-study-spot.firebaseio.com',
            projectId: 'best-study-spot',
            storageBucket: 'best-study-spot.appspot.com',
            messagingSenderId: '778414789573'
        });
    }
  render() {
    return (
        <Router sceneStyle={{paddingTop:5, paddingRight:5}}>
            <Stack key="root">
                <Scene key="login" component={Login} title="Login" initial/>
                <Scene key="register" component={Register} title="Register"/>
                <Scene key="library" component={Library} title="Libraries"/>
                <Scene key="comment" component={Comment} title="New Post"/>
                <Scene key="recommend" component={Recommend} title="Recommend"/>
                <Scene key="user" component={User}/>
                <Scene key="webview" component={Webview}/>
            </Stack>

        </Router>
    );
  }
}


