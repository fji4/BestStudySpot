
import React, { Component } from 'react';
import axios from 'axios';
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

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';


class LibraryListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            library: {}
        };

        this.get_library();
    }



    get_library() {
        axios.get(this.props.library['unit_json'])
            .then(function (response) {
                console.log(response.data);
                this.setState({
                    library:response.data[0]
                });
        }.bind(this));
    }



    render() {
        return(
            <Card style={{flex: 0}} >

                <CardItem>
                    <Left>
                        <Body>
                        <Text onPress={() => Actions.webview({html:this.state.library['weblinks']})}>
                            {this.props.library['library_name']}
                            </Text>
                        <Text note>{this.state.library['street_address']}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                    <Image source={{uri: this.state.library['parking_image']}} style={{height: 200, width: 200, flex: 1}}/>
                    <Text>{this.state.library['description']}</Text>
                    </Body>
                </CardItem>
            </Card>
        )
    }
}

/**
 * Render the whole list of the followers
 * @param props
 * @returns {XML}
 * @constructor
 */
const LibraryList = props => {
    const LibraryItems = props.libraries.map(library => {
        return (
            <LibraryListItem
                key = {library['unit_id']}
                library={library}
            />
        );
    });

    return (
        <ScrollView>
            {LibraryItems}
        </ScrollView>
    );
};




export default class Library extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            libraries:[]
        };

        this.getAuthInformation();
    }

    /**
     * Call library api to get all the user information and store them to a dic.
     */

    getAuthInformation() {
        axios.get("https://quest.library.illinois.edu/LibDirectory/Api/UnitsWithCalendars")
            .then(function(response){
                this.setState({
                    libraries:response.data
                },function () {

                });
            }.bind(this));
    }

    render() {
        return(
            <Container>
                <LibraryList libraries={this.state.libraries}/>
                <Footer>
                    <FooterTab>
                        <Button vertical active>
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
                        <Button vertical onPress={() => Actions.replace("user")}>
                            <Icon name="person" size={30}/>
                            <Text style={{fontSize: 10}}>Me</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
    )}
}