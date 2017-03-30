import React, { Component } from 'react';
import styled from 'styled-components';
import media from 'theme/media';
import { black } from 'theme/variables';
import RollableImage from 'components/RollableImage/RollableImage';
import LongPressMenu from 'components/LongPressMenu/LongPressMenu';
import WeirdImage from 'components/WeirdImage/WeirdImage';
import FoldImage from 'components/FoldImage/FoldImage';
import ToggleState from 'components/ToggleState/ToggleState';

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

const StyledFoldImage = styled(FoldImage)`
  width: 70%;
  ${media.tablet`
    width: 100%;
  `}
`;

class App extends Component {
  render() {
    return (
      <Container>
        <h1>@code_everyday's playground</h1>
        <hr/>
        <h2>RollableImage: <small>(Try this on your phone)</small></h2>
        <RollableImage/>
        <p>
          Inspired By:&nbsp;
          <a target="_blank" href="http://bergluft.hervis.at/chapter/2">110%</a>
        </p>
        <LinkButton
          target="_blank"
          href="https://github.com/chuson1996/playground/blob/master/src/components/RollableImage/RollableImage.js">
          Source
        </LinkButton>
        <br/>
        <hr/>
        <h2>LongPressMenu</h2>
        <p>Long press on your mobile to open the menu</p>
        <LongPressMenu/>
        <p>
          Inspired By:&nbsp;
          <a target="_blank" href="http://bergluft.hervis.at/chapter/2">110%</a>
        </p>
        <LinkButton
          target="_blank"
          href="https://github.com/chuson1996/playground/blob/master/src/components/LongPressMenu/LongPressMenu.js">
          Source
        </LinkButton>
        <br/>
        <hr/>

        <h2>WeirdImage</h2>
        <p>Hover over the image</p>
        <WeirdImage/>
        <p>Knowledge Applied: clip-path, <a target="_blank" href="https://www.viget.com/articles/film-grain-effect">film-grain</a></p>
        <p>
          Inspired By:&nbsp;
          <a target="_blank" href="http://www.danielspatzek.com/">Daniel Spatzek</a>
        </p>
        <LinkButton
          target="_blank"
          href="https://github.com/chuson1996/playground/blob/master/src/components/WeirdImage/WeirdImage.js">
          Source
        </LinkButton>
        <br/>
        <hr/>

        <h2>FoldImage</h2>
        <ToggleState>
          {({state, toggle}) =>
            <div>
              <button onClick={toggle}>Toggle</button>
              <StyledFoldImage
                noCol={4}
                noRow={4}
                startingPoint={0}
                startingDirection={'down'}
                src={'https://upload.wikimedia.org/wikipedia/commons/6/68/Great_Ex_Telescope_Telescope.jpg'}
                hide={state}/>
            </div>
          }
        </ToggleState>

        <p>
          Inspired By:
          <a target="_blank" href="https://www.beoplay.com/landingpages/ss17#intro">B&O PLAY</a>
        </p>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </Container>
    );
  }
}

export default App;
