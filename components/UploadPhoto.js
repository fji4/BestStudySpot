import React from 'react';
import { Button, Image, View } from 'react-native';
import { ImagePicker } from 'expo';

/**
 * Help function to upload photo.
 */
export default class ImagePickerExample extends React.Component {
    state = {
        image: null,
    };

    render() {
        let { image } = this.state;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={this._pickImage}>
                {/*<Button*/}
                    {/*title="Pick an image from camera roll"*/}
                    {/*onPress={this._pickImage}*/}
                {/*/>*/}
                {image &&
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            </View>
        );
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
}