
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
import EmojiPicker from 'react-native-simple-emoji-picker';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';

/**
 * The add comment page
 */
export default class Comment extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            place: "",
            comment: "",
            error: "",
            user: "",
            showEmoji: false,
            commentFocus: false,
            likes:0,
            subComment:[]
        };
    }

    /**
     * add posts to the database
     */
    addPost() {
        const {currentUser} = firebase.auth();
        console.log(currentUser.uid);
        this.setState({user:currentUser.uid}, () => {
            const {place, comment, user, likes, subComment} = this.state;
            const key = firebase.database().ref(`posts/`)
                .push({place, comment, user, likes, subComment}).key;
            firebase.database().ref(`users/${currentUser.uid}/posts`)
                .push({key});
            Actions.pop();
        });


    }

    emojiPicker() {
        this.setState({showEmoji: !this.state.showEmoji});

    }

    _emojiSelected(emoji) {
        console.log(emoji);
        if (this.state.commentFocus) {
            this.setState({comment: this.state.comment.concat(emoji)})
        }
    }

    displayEmoji() {
        if (this.state.showEmoji) {
            return (
                <View>
                    <EmojiPicker onPick={emoji => {this._emojiSelected(emoji)}}/>
                </View>
            )
        }
        else{
            return (
                <View>

                </View>
            )
        }
    }



    render() {
        return(
            <Container>
                <Content style={{backgroundColor:"#FFFFFF"}}>
                    <Item >
                        <Input placeholder='Place' autoFocus={true} value={this.state.place} onChangeText={place => this.setState({place})}/>
                    </Item>
                    <View style={{paddingTop: 10}}>
                    <Item  >
                        <Input multiline = {true} style={{height:500}} placeholder='Comment...' value={this.state.comment} onChangeText={comment => this.setState({comment})}
                               onFocus={()=> {
                                   this.setState({commentFocus: !this.state.commentFocus})
                               }}/>
                    </Item></View>
                </Content>

                {this.displayEmoji()}
                <View  style={{paddingBottom:10}}>
                <Footer>
                    <FooterTab>
                        <Button vertical>
                            <Icon name="photo" size={20}/>
                        </Button>
                        <Button vertical onPress={() => this.emojiPicker()}>
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

                        <Button vertical onPress={() => this.addPost()}>
                            <Text style={{fontSize: 15}}>Send</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )}
}