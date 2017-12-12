
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
 * Render the list user commented on the post
 * @param props
 * @returns {XML}
 * @constructor
 */
const CommentList = props => {
    const commentItems = props.comments.map(comment => {
        return (
            <CommentListItem
                key = {comment}
                comment={comment}
            />
        );
    });

    return (
        <View>
            {commentItems}
        </View>
    );
};


/**
 * Render every comment the user commented on the post
 * @param comment
 * @returns {XML}
 * @constructor
 */
const CommentListItem = ({comment}) => {

    return(
        <CardItem>
            <Text>{comment}</Text>
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
            subcomment: [],
            favorite: false,
            favid: ""
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

        /**
         * Get all the sub comment for the post
         */
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

                        commentArray.push(obj[prop]);

                    }
                }
                this.setState({
                    subcomment: commentArray
                });


            }.bind(this));

        const {currentUser} = firebase.auth();

        /**
         * Check the post is favorited by the user or not
         */
        firebase.database().ref(`posts/${this.state.id}/favorite`)
            .on('value', function (snapshot) {
                console.log(snapshot.val());
                if (snapshot.val()) {
                    var fav = snapshot.val();
                    var commentArray=[]
                    for (var key in fav) {
                        // skip loop if the property is from prototype
                        if (!fav.hasOwnProperty(key)) continue;

                        var obj = fav[key];
                        console.log("fav" );;
                        console.log(obj);
                        for (var prop in obj) {
                            // skip loop if the property is from prototype
                            if(!obj.hasOwnProperty(prop)) continue;
                            if (obj[prop] == currentUser.uid) {
                                this.setState({favorite: true, favid: key}, function () {
                                    console.log("favorite");
                                    console.log(this.state.favid);
                                });
                            }

                        }
                    }

                }


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
                    <CommentList comments={this.state.subcomment}/>
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

    toggleFavorite() {
        if (this.state.favorite) {
            return (
                <Right>
                    <Icon name="star" size={20} onPress={() => this.setFavorite()}/>
                </Right>
            )
        }
        else {
            return (
                <Right>
                    <Icon name="star-border" size={20} onPress={() => this.setFavorite()}/>
                </Right>
            )
        }
    }

    /**
     * Toggle the favorite on and off.
     * Update in the database.
     */
    setFavorite() {
        if (this.state.favorite) {
            this.setState({favorite: false});
            firebase.database().ref(`posts/${this.state.id}/favorite`).child(this.state.favid)
                .remove();
            const {currentUser} = firebase.auth();
            var userfavid="";
            firebase.database().ref(`users/${currentUser.uid}/favorite`)
                .on('value', function (snapshot) {
                    if (snapshot.val()) {
                        var favid = snapshot.val();
                        var commentArray=[]
                        for (var key in favid) {
                            // skip loop if the property is from prototype
                            if (!favid.hasOwnProperty(key)) continue;

                            var obj = favid[key];
                            console.log("fav" );;
                            console.log(obj);
                            for (var prop in obj) {
                                // skip loop if the property is from prototype
                                if(!obj.hasOwnProperty(prop)) continue;
                                if (obj[prop] == this.state.id) {
                                    favid = key;
                                }

                            }
                        }

                        firebase.database().ref(`users/${currentUser.uid}/favorite`).child(favid)
                            .remove();

                    }


                }.bind(this));

        }
        else{
            this.setState({favorite: true});
            const {currentUser} = firebase.auth();
            const uid = currentUser.uid;
            const {id} =this.state;
            firebase.database().ref(`posts/${this.state.id}/favorite`)
                .push({uid});
            firebase.database().ref(`users/${currentUser.uid}/favorite`)
                .push({id});
        }
    }

    /**
     * Checking the image exist in the post or not.
     * If yes display.
     * If not, not display it.
     * @returns {XML}
     */
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
                    {/*<Left>*/}
                    <Body ref="myRef">
                    <Text style={{fontSize: 18}}>{this.state.posts['place']}</Text>
                    </Body>
                    {/*</Left>*/}
                    {this.toggleFavorite()}
                </CardItem>
                <CardItem>
                    <Text>{this.state.posts['comment']}</Text>
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