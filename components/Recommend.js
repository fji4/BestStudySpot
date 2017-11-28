
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
            posts: this.props.recommend}
        ;
        console.log("recommend "+this.props.recommend.comment);

    }


    /**
     * set state for posts
     */
    componentDidMount() {
        this.setState({posts:this.props.recommend})
    }


    render() {
        return(
            <Card style={{flex: 0}} >


                <CardItem>
                    <Body>
                    <Text style={{fontSize: 20}}>{this.state.posts['place']}</Text>
                    <Text>{this.state.posts['comment']}</Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent>
                            <Icon active name="thumb-up" />
                            <Text>Likes</Text>
                        </Button>
                    </Left>
                    <Body>
                    <Button transparent>
                        <Icon active name="chat-bubble" />
                        <Text>Comments</Text>
                    </Button>
                    </Body>
                    <Right>
                        <Text>11h ago</Text>
                    </Right>
                </CardItem>
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
        // this.getPost=this.getPost.bind(this);
        this.getPost();
    }

    /**
     * Get the data in database
     */
    getPost() {
        firebase.database().ref(`posts/`)
            .on('value', function(snapshot) {
                var id=[];
                for (var i in snapshot.val()){
                    id.push(snapshot.val()[i]);
                }
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