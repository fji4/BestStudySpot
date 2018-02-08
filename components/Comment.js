
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    NavigatorIOS,
    View,
    Image,
    ScrollView,
    KeyboardAvoidingView
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
import Geocoder from 'react-native-geocoding';
import { ImagePicker, Permissions } from 'expo';

Geocoder.setApiKey('AIzaSyDE9vHZRqDgv8BhmvchDJrPKPjaIBChb_8');

/**
 * The add comment page
 */
export default class Comment extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            place: "",
            comment: "",
            error: null,
            user: "",
            showEmoji: false,
            commentFocus: false,
            likes:0,
            latitude: null,
            longitude: null,
            image: "",
            id:""
        };
    }

    /**
     * Get current location with google api and decode the lat and lng into real address.
     */
    getCurrentPosition(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                }, () => {
                    const current = {
                        lat: this.state.latitude,
                        lng: this.state.longitude
                    };
                    console.log(current.lat);
                    console.log(current.lng);
                    Geocoder.getFromLatLng(current.lat, current.lng).then(
                        json => {
                            var address_component = json.results[0].formatted_address;
                            console.log(address_component);
                            this.setState({place: address_component})
                        },
                        error => {
                            alert(error);
                        }
                    );
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }

    displayCurrentLocation() {
        this.getCurrentPosition();

    }
    /**
     * add posts to the database
     */
    addPost() {
        const {currentUser} = firebase.auth();
        console.log(currentUser.uid);
        this.setState({user:currentUser.uid}, () => {
            const {place, comment, user, likes, image} = this.state;
            const key = firebase.database().ref(`posts/`)
                .push({place, comment, user, likes, image}).key;
            firebase.database().ref(`users/${currentUser.uid}/posts`)
                .push({key});
            this.setState({id:key});
            Actions.pop();
        });


    }

    /**
     * Toggle the emoji keyboard on and off.
     */
    emojiPicker() {
        this.setState({showEmoji: !this.state.showEmoji});

    }

    /**
     * Select emoji and add it to comment.
     * @param emoji
     * @private
     */
    _emojiSelected(emoji) {
        console.log(emoji);
        if (this.state.commentFocus) {
            this.setState({comment: this.state.comment.concat(emoji)})
        }
    }

    /**
     * Display emoji keyboard
     * @returns {XML}
     */
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


    /**
     * Display the system UI for choosing an image or a video from the phone’s library.
     * @returns {Promise.<void>}
     * @private
     */
    _pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };


    render() {
        return(
            <ScrollView>
                <ScrollView style={{backgroundColor:"#FFFFFF"}}>
                    <Item >
                        <Input placeholder='Place' value={this.state.place} onChangeText={place => this.setState({place})}/>
                    </Item>
                    <View style={{paddingTop: 10}}>
                    <Item  >
                        <Input multiline = {true} style={{height:150}} placeholder='Comment...' value={this.state.comment} onChangeText={comment => this.setState({comment})}
                               onFocus={()=> {
                                   this.setState({commentFocus: !this.state.commentFocus})
                               }}/>
                    </Item>
                    <Item>
                        <Thumbnail large square source={{url: this.state.image}} />
                    </Item>
                    </View>
                </ScrollView>

                {this.displayEmoji()}
                <View  style={{paddingBottom:10}}>
                <Footer>
                    <FooterTab>
                        <Button vertical onPress={() => this._pickImage()}>
                            <Icon name="photo" size={20} color="#7cc5f4"/>
                        </Button>
                        <Button vertical onPress={() => this.emojiPicker()}>
                            <Icon active name="tag-faces" size={20} color="#efb311"/>
                        </Button>
                        <Button vertical onPress={() => this.displayCurrentLocation()}>
                            <Icon active name="location-on" size={20} color="#154ed0"/>
                        </Button>
                    </FooterTab>
                </Footer></View>
            <Footer>
                    <FooterTab>
                        <Button vertical onPress={() => Actions.pop()} danger transparent>
                            <Text style={{fontSize: 15}}>Cancel</Text>
                        </Button>

                        <Button vertical onPress={() => this.addPost()} success transparent>
                            <Text style={{fontSize: 15}}>Send</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </ScrollView>
        )}
}