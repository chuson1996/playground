import React, { Component } from 'react';
import RollableImage from 'components/RollableImage/RollableImage';
import styled from 'styled-components';

const Container = styled.div`
  padding-left: 150px;
  padding-right: 150px;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <RollableImage/>
      </Container>
    );
  }
}

export default App;
