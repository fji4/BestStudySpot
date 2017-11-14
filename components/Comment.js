
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

export default class Comment extends Component {
    render() {
        return(
            <Container>
                <Content style={{backgroundColor:"#FFFFFF"}}>
                    <Item >
                        <Input placeholder='Place' autoFocus={true}/>
                    </Item>
                    <View style={{paddingTop: 10}}>
                    <Item  >
                        <Input multiline = {true} style={{height:500}} placeholder='Comment...' />
                    </Item></View>
                </Content>
                <View  style={{paddingBottom:10}}>
                <Footer>
                    <FooterTab>
                        <Button vertical>
                            <Icon name="photo" size={20}/>
                        </Button>
                        <Button vertical>
                            <Icon active name="tag-faces" size={20}/>
                        </Button>
                        <Button vertical>
                            <Icon active name="location-on" size={20}/>
                        </Button>
                    </FooterTab>
                </Footer></View>
            <Footer>
                    <FooterTab>
                        <Button vertical onPress={() => Actions.pop()}>
                            <Text style={{fontSize: 15}}>Cancel</Text>
                        </Button>

                        <Button vertical onPress={() => Actions.pop()}>
                            <Text style={{fontSize: 15}}>Send</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )}
}