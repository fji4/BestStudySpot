
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
    Form,
    Item,
    Label,
    Input
} from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';

export default class Recommend extends Component {
    render() {
        return(
            <Container>
                <Content />
                <Footer>
                    <FooterTab>
                        <Button vertical onPress={() => Actions.replace("library")}>
                            <Icon name="local-library" size={30} />
                            <Text style={{fontSize: 10}}>Library</Text>
                        </Button>
                        <Button vertical active>
                            <Icon name="comment" size={30}/>
                            <Text style={{fontSize: 10}}>Recommend</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.replace("comment")}>
                            <Icon active name="add-circle-outline" size={30}/>
                        </Button>
                        <Button vertical onPress={() => Actions.replace("user")}>
                            <Icon name="person" size={30}/>
                            <Text style={{fontSize: 10}}>Me</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )}
}