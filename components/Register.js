
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    NavigatorIOS,
    View,
    Image
} from 'react-native';
import  {
    Container,
    Header,
    Content,
    Footer,
    FooterTab,
    Button,
    Text,
    Badge,
    Thumbnail,
    List,
    ListItem,
    Left,
    Right,
    Separator,
    Icon,
    Form,
    Item,
    Label,
    Input
} from 'native-base';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';

/**
 * The registration page
 */
export default class Register extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            email: "",
            password: "",
            username: "",
            avatar: "https://static1.squarespace.com/static/51b3dc8ee4b051b96ceb10de/51ce6099e4b0d911b4489b79/52235f06e4b0bf0a6aa8425d/1378105582329/tom-hiddleston-talks-loki-in-thor-the-dark-world-and-beyond-preview.jpg"
        };
    }

    /**
     * firebase register auth
     */
    signInButton() {
        const {email, password, username, avatar} = this.state;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function () {
                const {currentUser} = firebase.auth();
                console.log(currentUser.uid);
                firebase.database().ref(`users/${currentUser.uid}`)
                    .set({email, password, username, avatar});
                Actions.replace("library",{userid:currentUser.uid});
            });

    }

    render() {
        return(

        <Image style={styles.background} source={require('../assets/grainger.png')}>

            <Text style={styles.header}>Best Study Spot</Text>

            <Form style={styles.centralize}>
                <Item inlinedLabel>
                    <Label>Username</Label>
                    <Input value={this.state.username} onChangeText={username => this.setState({username})}/>
                </Item>
                <Item inlinedLabel>
                    <Label>Email</Label>
                    <Input value={this.state.email} onChangeText={email => this.setState({email})} />
                </Item>
                <Item inlinedLabel last>
                    <Label>Password</Label>
                    <Input value={this.state.password} onChangeText={password => this.setState({password})}/>
                </Item>
            </Form>

            <View style={{paddingTop: 50}}>
                <Button block info onPress={() => this.signInButton()}>
                    <Text> Register </Text>
                </Button>

            </View>

        </Image>
    )}
}

const styles = StyleSheet.create({
    centralize: {
        paddingTop: 10,
    },
    header: {
        paddingTop: 10,
        fontFamily:'Snell Roundhand',
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        opacity: 0.9,
        zIndex: 3,
        backgroundColor: 'transparent',
    },
    background: {
        flex: 1,
        zIndex: 1,
        width: null,
        height: null,
        backgroundColor: 'transparent',
    },
    registerColor: {
        color: '#4f59fb'
    }
});