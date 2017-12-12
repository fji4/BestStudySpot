/**
 * Created by aliceji on 12/5/17.
 */
/**
 * Created by aliceji on 11/14/17.
 */
import React from 'react';
import Recommend from '../components/Recommend';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
    const tree = renderer.create(
        <Recommend />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders the first post', () => {
    const ListView = require('ListView');
    const Text = require('Text');
    const dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2, r3) => r1 !== r2 || r1 !== r3 || r2 !== r3,
    }).cloneWithRows(['Grainger',
        'It’s best for study😘',
        'file:///Users/aliceji/Library/Developer/CoreSimulator/Devices/498AB8E3-943B-432B-B58A-2C3DEB0FCDEA/data/Containers/Data/Application/6C958905-F2CC-4368-ACF0-53D46B5F7A5E/Library/Caches/ExponentExperienceData/%2540anonymous%252Ffinal-1c4dc687-1d29-47f0-a8c0-079b2613742d/ImagePicker/91EE1FD1-A18F-443D-8958-25221E93FCF5.jpg',
        ]);
    const tree = renderer
        .create(
            <ListView
                dataSource={dataSource}
                renderRow={rowData => <Text>{rowData}</Text>}
            />
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

