import React, { Component } from 'react';
import styled, { css, keyframes } from 'styled-components';
import media from 'theme/media';

const grain = keyframes`
  0%, 100% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-5%, -10%);
  }
  20% {
    transform: translate(-15%, 5%);
  }
  30% {
    transform: translate(7%, -25%);
  }
  40% {
    transform: translate(-5%, 25%);
  }
  50% {
    transform: translate(-15%, 10%);
  }
  60% {
    transform: translate(15%, 0%);
  }
  70% {
    transform: translate(0%, 15%);
  }
  80% {
    transform: translate(3%, 35%);
  }
  90% {
    transform: translate(-10%, 10%);
  }
`;

const Container = styled.div`
  width: 400px;
  height: 250px;
  position: relative;

  ${media.tablet`
    width: 100%;
    height: 250px;
  `}
`;

// `
// }
// blink {
//   background: url(http://placekitten.com/g/600/600);
//   display: block;
//   height: 600px;
//   position: relative;
//   width: 600px;
//   overflow: hidden;
// }
// blink > * {
//   z-index: 2;
// }
// blink:after {
// }
// `

const producePolygon = ({ x, y, w, h }) => {
  return `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`;
}

const polygons = [
  { x: 0, y: 0, w: 80, h: 70 },
  { x: 80, y: 0, w: 20, h: 60 },
  { x: 80, y: 59.9, w: 20, h: 40 },
  { x: 0, y: 69.9, w: 80, h: 30 },
];

const Piece1 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-image: url(${require('assets/portrait.jpg')});
  background-size: cover;
  pointer-events: none;

  transition: transform .2s;

  z-index: 0;
  clip-path: ${producePolygon(polygons[0])};
`;
const Piece2 = styled(Piece1)`
  clip-path: ${producePolygon(polygons[1])};
  z-index: 1;
  transform: translate(0, 0);
  ${({ step }) => step >= 1 && css`
    transform: translate(0, 10%);
  `}
`;
const Piece3 = styled(Piece1)`
  clip-path: ${producePolygon(polygons[2])};
  z-index: 4;

  transform: translate(0, 0);
  ${({ step }) => step === 1 && css`
    transform: translate(0, 10%);
  `}
  ${({ step }) => step === 2 && css`
    transform: translate(-10%, 10%);
  `}
`;
const Piece4 = styled(Piece1)`
  clip-path: ${producePolygon(polygons[3])};
  z-index: 3;
  ${({ step }) => step === 2 && css`
    transform: translate(-10%, 0);
  `}
`;

const Grain1 = styled.div`
  position: absolute;
  overflow: hidden;
  pointer-events: none;

  z-index: 5;
  transition: top .2s, left .2s, right .2s, bottom .2s;
  &:after {
    content: "";
    display: block;
    position: absolute;
    left: -300px;
    top: -600px;

    height: 1200px;
    width: 1200px;
    background: url('${require('assets/grain.png')}');
    animation: ${grain} 4s steps(10) infinite;

    z-index: 5;
  }

  left: ${polygons[0].x}%;
  top: ${polygons[0].y}%;
  width: ${polygons[0].w}%;
  height: ${polygons[0].h}%;
`;

const Grain2 = styled(Grain1)`
  left: ${polygons[1].x}%;
  top: ${polygons[1].y}%;
  width: ${polygons[1].w}%;
  height: ${polygons[1].h}%;

  ${({ step }) => step >= 1 && css`
    ${''/* transform: translate(0, 10%); */}
    top: ${polygons[1].y + 10}%;
  `}
`;

const Grain3 = styled(Grain1)`
  left: ${polygons[2].x}%;
  top: ${polygons[2].y}%;
  width: ${polygons[2].w}%;
  height: ${polygons[2].h}%;

  transform: translate(0, 0);
  ${({ step }) => step === 1 && css`
    top: ${polygons[2].y + 10}%;
  `}
  ${({ step }) => step === 2 && css`
    left: ${polygons[2].x - 10}%;
    top: ${polygons[2].y + 10}%;
  `}
`;

const Grain4 = styled(Grain1)`
  left: ${polygons[3].x}%;
  top: ${polygons[3].y}%;
  width: ${polygons[3].w}%;
  height: ${polygons[3].h}%;

  ${({ step }) => step === 2 && css`
    ${''/* transform: translate(-10%, 0); */}
    left: ${polygons[3].x - 10}%;
  `}
`;

export default class WeirdImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 2
    };
  }

  onMouseLeave = () => {
    if (this.timeout) clearTimeout(this.timeout);
    this.setState({
      step: 1
    });
    this.timeout = setTimeout(() => {
      this.setState({
        step: 2
      });
    }, 200);
  }

  onMouseOver = () => {
    if (this.timeout) clearTimeout(this.timeout);
    if (this.state.step === 2) {
      this.setState({
        step: 1
      });
      this.timeout = setTimeout(() => {
        this.setState({
          step: 0
        });
      }, 200);
    } else {
      this.setState({
        step: 0
      });
    }
  }

  render() {
    const { step } = this.state;
    return (
      <div>
        <Container
          onMouseLeave={this.onMouseLeave}
          onMouseOver={this.onMouseOver}>
          <Piece1 step={step}/>
          <Piece2 step={step}/>
          <Piece3 step={step}/>
          <Piece4 step={step}/>
          <Grain1 step={step}/>
          <Grain2 step={step}/>
          <Grain3 step={step}/>
          <Grain4 step={step}/>
        </Container>
      </div>
    );
  }
}
