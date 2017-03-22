import React, { Component } from 'react';
import styled from 'styled-components';
import media from 'theme/media';
import { black } from 'theme/variables';
import RollableImage from 'components/RollableImage/RollableImage';
import LongPressMenu from 'components/LongPressMenu/LongPressMenu';

const Container = styled.div`
  padding-left: 150px;
  padding-right: 150px;
  ${media.tablet`
    padding-left: 30px;
    padding-right: 30px;
  `}
`;

const LinkButton = styled.a`
  background-color: transparent;
  border: 3px solid ${black};
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left: 20px;
  padding-right: 20px;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <h1>@code_everyday's playground</h1>
        <hr/>
        <h2>RollableImage: <small>(Try this on your phone)</small></h2>
        <RollableImage/>
        <LinkButton
          target="_blank"
          href="https://github.com/chuson1996/playground/blob/master/src/components/RollableImage/RollableImage.js">Source</LinkButton>
        <br/>
        <hr/>
        <h2>LongPressMenu</h2>
        <p>Long press on your mobile to open the menu</p>
        <LongPressMenu/>
        <LinkButton
          target="_blank"
          href="https://github.com/chuson1996/playground/blob/master/src/components/LongPressMenu/LongPressMenu.js">Source</LinkButton>

      </Container>
    );
  }
}

export default App;
