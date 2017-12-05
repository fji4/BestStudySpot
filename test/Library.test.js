/**
 * Created by aliceji on 12/5/17.
 */
import React from 'react';
import Library from '../components/Library';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
    const tree = renderer.create(
        <Library />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders the first library', () => {
    const ListView = require('ListView');
    const Text = require('Text');
    const dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
    }).cloneWithRows(['Grainger Engineering Library Information Center', '1301 West Springfield Avenue']);
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

it('renders the second library', () => {
    const ListView = require('ListView');
    const Text = require('Text');
    const dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
    }).cloneWithRows(['Mathematical Library', '1409 West Green Street']);
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