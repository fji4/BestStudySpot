
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

import {Actions} from 'react-native-router-flux';

/**
 * The login page
 */
export default class Login extends Component {

    render() {
        return(

        <Image style={styles.background} source={require('../assets/grainger.png')}>

            <Text style={styles.header}>Best Study Spot</Text>

                <Form style={styles.centralize}>
                    <Item inlinedLabel bordered>
                        <Label>Email</Label>
                        <Input />
                    </Item>
                    <Item inlinedLabel last>
                        <Label>Password</Label>
                        <Input />
                    </Item>
                </Form>

            <View style={{paddingTop: 50}}>
                    <Button block info onPress={() => Actions.replace("library")}>
                        <Text> Sign In </Text>
                    </Button>

                        <Button block transparent onPress={() => Actions.replace("register")}>
                            <Text style={styles.registerColor}>
                                Don't have an account? Register.
                            </Text>
                        </Button>


            </View>

        </Image>
    )}
}

/**
 * Style sheet for font and position of the UI layout
 */
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