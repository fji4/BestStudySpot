
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
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';
// import PhotoUpload from 'react-native-photo-upload'

/**
 * The user page
 */
export default class User extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

                avatar_url: "https://static1.squarespace.com/static/51b3dc8ee4b051b96ceb10de/51ce6099e4b0d911b4489b79/52235f06e4b0bf0a6aa8425d/1378105582329/tom-hiddleston-talks-loki-in-thor-the-dark-world-and-beyond-preview.jpg",
                name:"",
                favorite: 2,
                recommended: 2,
            avatarSource:''

        };
        // this.userInfo();
    }

    signOut() {
        firebase.auth().signOut();
        Actions.replace("login")

    }

    componentDidMount() {
        const {currentUser} = firebase.auth();
        firebase.database().ref(`users/${currentUser.uid}`)
            .on('value', function(snapshot) {
                console.log(snapshot.val().username);
                let nickname = snapshot.val().username;
            this.setState({name: nickname});
            console.log(this.state.name);

        }.bind(this));
    }

    uploadPhoto() {
        return (
            <PhotoUpload
                onPhotoSelect={avatar => {
     if (avatar) {
       console.log('Image base64 string: ', avatar)
     }
   }}
            >
                <Image
                    style={{
       paddingVertical: 30,
       width: 150,
       height: 150,
       borderRadius: 75
     }}
                    resizeMode='cover'
                    source={{
       uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'
     }}
                />
            </PhotoUpload>
        )
    }

    render() {
        return(
            <Container>
                <Content>
                    <List>
                        <ListItem>
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

                    {/*{this.uploadPhoto()}*/}

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