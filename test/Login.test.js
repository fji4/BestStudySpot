/**
 * Created by aliceji on 11/14/17.
 */
import React from 'react';
import Login from '../components/Login';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
    const tree = renderer.create(
        <Login />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders the profile login form component', () => {
    const ListView = require('ListView');
    const Text = require('Text');
    const dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2, r3) => r1 !== r2 || r1 !== r3 || r2 !== r3,
    }).cloneWithRows(['Best Study Spot', 'Email', 'Password']);
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