
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    NavigatorIOS,
    View,
    Image,
    Camera,
    ActionSheetIOS
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
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';
import { ImagePicker, Permissions } from 'expo';
import UploadImage from './UploadPhoto';

/**
 * The user page
 */
export default class User extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

                avatar_url: "",
                name:"",
                user:{},
                favorite: 2,
                recommended: 2,
            avatarSource:null,
            image: null,
            hasCameraPermission: null

        };
    }

    /**
     * Let user be able to sign out and change account.
     */
    signOut() {
        firebase.auth().signOut();
        Actions.replace("login")

    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }


    /**
     * Read data about user from database and store in the state.
     */
    componentDidMount() {
        const {currentUser} = firebase.auth();
        firebase.database().ref(`users/${currentUser.uid}`)
            .on('value', function(snapshot) {
                console.log(snapshot.val().username);
                let nickname = snapshot.val().username;
                let image_url = snapshot.val().avatar;
            this.setState({
                name: nickname,
                avatar_url: image_url,
                user: snapshot.val()
            });
            console.log(this.state.name);

        }.bind(this));
    }

    /**
     * Render a picker for user to choose image from camera roll and save it into database
     * @returns {Promise.<void>}
     * @private
     */
    _pickImage = async () => {
        const {currentUser} = firebase.auth();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ avatar_url: result.uri }, () => {
                var userData = {
                    email: this.state.user.email,
                    avatar: this.state.avatar_url,
                    password: this.state.user.password,
                    username: this.state.user.username
                };


                // Write the new user's data simultaneously in the user schema.
                var updates = {};
                updates['/users/' + currentUser.uid] = userData;

                firebase.database().ref().update(updates);
            });
        }
    };

    /**
     * Display the system UI for taking a photo with the camera and save the image into database.
     * @returns {Promise.<void>}
     * @private
     */
    _takeImage = async () => {
        const {currentUser} = firebase.auth();

        let iresult = await ImagePicker.launchCameraAsync();

        console.log(iresult);

        if (!iresult.cancelled) {
            this.setState({ avatar_url: iresult.uri }, () => {
                var userData = {
                    email: this.state.user.email,
                    avatar: this.state.avatar_url,
                    password: this.state.user.password,
                    username: this.state.user.username
                };


                // Write the new user's data simultaneously in the user schema.
                var updates = {};
                updates['/users/' + currentUser.uid] = userData;

                firebase.database().ref().update(updates);
            });
        }
    };

    /**
     * Render an actionsheet to let the user choose whether take photo or choose photo from camera roll
     */
    displayActionSheet() {
        ActionSheetIOS.showActionSheetWithOptions({
                options: ['Take Photo','Choose from Library', 'Cancel'],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 2,
            },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    this._pickImage()
                }
                if (buttonIndex === 2) {

                        this._takeImage();

                        console.log("failed");


                }
                });
    }


    render() {
        return(
            <Container>
                <Content>
                    <List>
                        <ListItem onPress={()=>this._pickImage()}>
                            <View style={styles.centralize}>
                                <Thumbnail large source={{url:this.state.avatar_url}} />
                            </View>
                        </ListItem>
                        <ListItem style={styles.centralize}>
                            <Text>{this.state.name}</Text>
                        </ListItem>


                        <ListItem>
                            <Left>
                                <Text>Favorite</Text>
                            </Left>
                            <Right>
                                <Icon name="keyboard-arrow-right" size={30}/>
                            </Right>
                        </ListItem>

                        <ListItem>
                            <Left>
                                <Text>Recommended</Text>
                            </Left>

                            <Icon name="keyboard-arrow-right" size={30}/>

                        </ListItem>


                    </List>
                    <View style={{paddingTop: 50}}>
                        <Button block info onPress={() => this.signOut()}>
                            <Text> Sign Out </Text>
                        </Button>
                    </View>


                </Content>
                <Footer>
                    <FooterTab>
                        <Button vertical onPress={() => Actions.replace("library")}>
                            <Icon name="local-library" size={30} />
                            <Text style={{fontSize: 10}}>Library</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.replace("recommend")}>
                            <Icon name="comment" size={30}/>
                            <Text style={{fontSize: 10}}>Recommend</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.comment()}>
                            <Icon active name="add-circle-outline" size={30}/>
                        </Button>
                        <Button vertical active>
                            <Icon name="person" size={30}/>
                            <Text style={{fontSize: 10}}>Me</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )}
}
const styles = StyleSheet.create({
    centralize: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});