
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
 * Render the list of the comment on the post
 * @param props
 * @returns {XML}
 * @constructor
 */
const SubcommentList = props => {
    const subcommentItems = props.subcomments.map(subcomment => {
        return (
            <SubcommentListItem
                key = {subcomment}
                subcomment={subcomment}
            />
        );
    });

    return (
        <View>
            {subcommentItems}
        </View>
    );
};


/**
 * Render each comment of the post
 * @param subcomment
 * @returns {XML}
 * @constructor
 */
const SubcommentListItem = ({subcomment}) => {

    return(
        <CardItem>
            <Text>{subcomment}</Text>
        </CardItem>
    );
};

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
            liked: false,
            subcomment: []
        };
        console.log("recommend "+this.props.recommend.comment);
    }


    /**
     * set state for posts
     */

    componentWillMount() {
        firebase.database().ref(`posts/${this.state.id}`)
            .on('value', function(snapshot) {
                this.setState({posts:snapshot.val()});
            }.bind(this));

        firebase.database().ref(`posts/${this.state.id}/subComment`)
            .on('value', function (snapshot) {
                var comment = snapshot.val();
                var commentArray=[]
                for (var key in comment) {
                    // skip loop if the property is from prototype
                    if (!comment.hasOwnProperty(key)) continue;

                    var obj = comment[key];
                    for (var prop in obj) {
                        // skip loop if the property is from prototype
                        if(!obj.hasOwnProperty(prop)) continue;
                        console.log(obj[prop]);
                        commentArray.push(obj[prop]);

                    }
                }
                this.setState({
                    subcomment: commentArray
                },function () {
                    console.log(this.state.subcomment);
                });


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
        this.setState({comment:""});
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
                <View>
                    <SubcommentList subcomments={this.state.subcomment}/>
                    <CardItem>
                        <Input placeholder="Comments" value={this.state.comment} onChangeText={comment => this.setState({comment})}/>
                        <Button transparent onPress={() => this.updateComment()}>
                            <Icon active name="keyboard-arrow-right" size={20}/>
                        </Button>
                    </CardItem>
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
     * Help function for toggling comment box on and off.
     */
    toggleComment() {
        this.setState({toggle: !this.state.toggle})
    }

    renderImage() {
        if (this.state.posts['image']) {
            return (
                <CardItem cardBody>
                    <Image source={{uri: this.state.posts['image']}} style={{height: 200, width: null, flex: 1}}/>
                </CardItem>
            )
        }
        else{
            return(
                <View>

                </View>
            )
        }
    }

    render() {
        return(
            <Card >
                <CardItem>
                    <Body ref="myRef">
                    <Text style={{fontSize: 20}}>{this.state.posts['place']}</Text>
                    <Text>{this.state.posts['comment']}</Text>
                    </Body>
                </CardItem>
                {this.renderImage()}
                <CardItem>
                    <Left>
                        <Button transparent onPress={() => this.updateNewLikes()}>
                            <Icon active name="thumb-up" size={20} color='red'/>
                            <Text>{this.state.posts['likes']} Likes</Text>
                        </Button>
                    </Left>
                    <Right>
                        <Button transparent onPress={() => this.toggleComment()}>
                            <Icon active name="chat-bubble" size={20} color="#ea841f"/>
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
                key = {recommend}
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
 * The Favorite Comment the user marked page
 */
export default class Favorite extends Component {
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
        const {currentUser} = firebase.auth();
        firebase.database().ref(`users/${currentUser.uid}/favorite`)
            .on('value', function(snapshot) {
                var posts = snapshot.val();
                var id=[];
                for (var key in posts) {
                    // skip loop if the property is from prototype
                    if (!posts.hasOwnProperty(key)) continue;

                    var obj = posts[key];
                    for (var prop in obj) {
                        // skip loop if the property is from prototype
                        if(!obj.hasOwnProperty(prop)) continue;
                        console.log(obj[prop]);
                        id.push(obj[prop]);

                    }
                }

                this.setState({recommends:id});
                console.log(this.state.recommends);
            }.bind(this));
    }

    render() {
        return(
            <Container>
                <RecommendList recommends={this.state.recommends} />
            </Container>
        )}
}
