/**
 * Created by aliceji on 11/14/17.
 */
import React, { Component } from 'react';
import {WebView} from 'react-native';
import {Actions} from 'react-native-router-flux';

/**
 * Render the web page of the repositories inside the app by pass the props
 */
export default class Webview extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <WebView source={{uri:this.props.html}}/>

        );
    }
}