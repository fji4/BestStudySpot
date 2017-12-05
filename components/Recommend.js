
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    NavigatorIOS,
    View,
    Image,
    ScrollView
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
    Input,
    Card,
    CardItem,
    Body
} from 'native-base';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';



/**
 * One post Item
 */
class RecommendListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.recommend,
            posts: {},
            comment: "",
            toggle: false,
            liked: false
        };
        console.log("recommend "+this.props.recommend.comment);
    }


    /**
     * set state for posts
     */

    componentDidMount() {
        firebase.database().ref(`posts/${this.state.id}`)
            .on('value', function(snapshot) {
                this.setState({posts:snapshot.val()});
            }.bind(this));
    }

    /**
     * Plus one like every time user push the like button
     */
    updateNewLikes() {
        // A post entry.
        var postData = {
            user: this.state.posts['user'],
            comment: this.state.posts['comment'],
            place: this.state.posts['place'],
            likes: this.state.posts['likes'] + 1,
            image: this.state.posts['image']
        };

        // Write the new post's data simultaneously in the posts list.
        var updates = {};
        updates['/posts/' + this.state.id] = postData;

        firebase.database().ref().update(updates);
    }

    /**
     * Store comment data into post schema
     */
    updateComment() {
        const {comment} = this.state;
        // const {currentUser} = firebase.auth();
        firebase.database().ref(`posts/${this.state.id}/subComment`)
            .push({comment});

        this.toggleComment();
    }

    /**
     * User can toggle on and off the comment box.
     * Let user able to comment on others' posts.
     * @returns {XML}
     */
    addComment() {
        if (this.state.toggle) {
            return (
                <CardItem>

                    <Input placeholder="Comments" autoFocus={true} value={this.state.comment} onChangeText={comment => this.setState({comment})}/>
                    <Button transparent onPress={() => this.updateComment()}>
                        <Icon active name="keyboard-arrow-right" size={20}/>
                    </Button>
                </CardItem>
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
     * Help function for toggling comment box on and off.
     */
    toggleComment() {
        this.setState({toggle: !this.state.toggle})
    }


    render() {
        return(
            <Card style={{flex: 0}} >


                <CardItem>
                    <Body ref="myRef">
                    <Text style={{fontSize: 20}}>{this.state.posts['place']}</Text>
                    <Text>{this.state.posts['comment']}</Text>
                    </Body>
                </CardItem>
                <CardItem cardBody>
                    <Image source={{uri: this.state.posts['image']}} style={{height: 200, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent onPress={() => this.updateNewLikes()}>
                            <Icon active name="thumb-up" size={20} color='red'/>
                            <Text>{this.state.posts['likes']} Likes</Text>
                        </Button>
                    </Left>
                    <Right>
                    <Button transparent onPress={() => this.toggleComment()}>
                        <Icon active name="chat-bubble" size={20}/>
                        <Text>Comments</Text>
                    </Button>
                    </Right>
                </CardItem>
                {this.addComment()}
            </Card>
        )
    }
}

/**
 * Render the whole list of the posts
 * @param props
 * @returns {XML}
 * @constructor
 */
const RecommendList = props => {
    const RecommendItems = props.recommends.map(recommend => {
        return (
            <RecommendListItem
                key = {recommend['user']}
                recommend={recommend}
            />
        );
    });

    return (
        <ScrollView>
            {RecommendItems}
        </ScrollView>
    );
};





/**
 * The recommendation page
 */
export default class Recommend extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            recommends:[]
        };

    }

    /**
     * Get the data in database
     */
    componentDidMount() {
        firebase.database().ref(`posts/`)
            .on('value', function(snapshot) {
                var id=[];
                snapshot.forEach(function(childSnapshot) {
                    id.push(childSnapshot.key)
                });

                this.setState({recommends:id});
                console.log(this.state.recommends);
            }.bind(this));
    }

    render() {
        return(
            <Container>
                <RecommendList recommends={this.state.recommends} />
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
                        <Button vertical onPress={() => Actions.comment()}>
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