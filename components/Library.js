
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


/**
 * Render the Library hour list
 * @param props
 * @returns {XML}
 * @constructor
 */
const HourList = props => {
    const hourItems = props.hours.map(hour => {
        return (
            <HourListItem
                key = {hour.date}
                hour={hour}
            />
        );
    });

    return (
        <View>
            {hourItems}
        </View>
    );
};


/**
 * Render each day hour for library
 * @param hour
 * @returns {XML}
 * @constructor
 */
const HourListItem = ({hour}) => {

    return(
        <CardItem>
            <Text style={{fontWeight: "bold"}}>{`${hour.day}:  `}</Text>
            <Right>
                <Text>{hour.hours[0].label}</Text>
            </Right>
        </CardItem>
    );
};

/**
 * Individual library Card Item
 */
class LibraryListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            library: {},
            calendar:[],
            toggle: false
        };

        this.get_library();
    }


    /**
     * Call each library api to get the library detail information
     */

    get_library() {
        axios.get(this.props.library['unit_json'])
            .then(function (response) {
                // console.log(response.data);
                this.setState({
                    library:response.data[0],
                    calendar: response.data[0].calendar.nextSevenDays
                });
        }.bind(this));
    }

    /**
     * Detect should the hour be displayed or not
     * @returns {XML}
     */
    displayHour() {
        if (this.state.toggle) {
            return (
                <View>
                    <HourList hours={this.state.calendar}/>
                </View>
            )
        }
        else {
            return (
                <View>

                </View>
            )
        }
    }

    /**
     * Toggle the display of hour list or not
     */
    toggleHour () {
        console.log("clicked")
        this.setState({toggle: !this.state.toggle})
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
                <CardItem >
                    <Text>Library Hours</Text>
                    <Right>
                        <Button transparent onPress={() => this.toggleHour()}>
                            <Icon name="arrow-drop-down" size={30} color="#7cc5f4"/>

                        </Button>
                    </Right>
                </CardItem>

                {this.displayHour()}

            </Card>
        )
    }
}

/**
 * Render the whole list of the libraries
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


/**
 * The library page
 */
export default class Library extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            libraries:[]
        };

        this.getAuthInformation();
    }

    /**
     * Call library api to get all the library information and store them to a dic.
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
                            <Icon name="local-library" size={30} color="#d1d111"/>
                            <Text style={{fontSize: 10}}>Library</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.replace("recommend")}>
                            <Icon name="comment" size={30} color="#ea841f"/>
                            <Text style={{fontSize: 10}}>Recommend</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.comment()}>
                            <Icon active name="add-circle-outline" size={30} color="#f55486"/>
                        </Button>
                        <Button vertical onPress={() => Actions.replace("user")}>
                            <Icon name="person" size={30} color="#7cc5f4"/>
                            <Text style={{fontSize: 10}}>Me</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
    )}
}